#!/usr/bin/env python3
"""GA4 日报数据解读：渠道、来源、国家×渠道、欧盟访客真实性。"""
from __future__ import annotations

from typing import Any

# GA4 country 英文名（含常见访日市场 + EEA）
EU_EEA = {
    "Austria", "Belgium", "Bulgaria", "Croatia", "Cyprus", "Czechia",
    "Denmark", "Estonia", "Finland", "France", "Germany", "Greece",
    "Hungary", "Ireland", "Italy", "Latvia", "Lithuania", "Luxembourg",
    "Malta", "Netherlands", "Poland", "Portugal", "Romania", "Slovakia",
    "Slovenia", "Spain", "Sweden", "Iceland", "Norway", "Liechtenstein",
}
UK = {"United Kingdom"}
JP_MARKET = {"Japan", "Taiwan", "Hong Kong"}
CN_MARKET = {"China", "Hong Kong"}

# 常见云机房/爬虫 IP 地理定位（GA4 若拉 city 维度可对照；国家行用互动+均时启发式）
DATACENTER_CITY_HINTS = {
    "Boardman", "Ashburn", "Dallas", "Columbus", "Seattle", "Chicago",
    "Frankfurt am Main", "Amsterdam", "Dublin", "Singapore",
}


def is_likely_bot_row(row: dict) -> bool:
    """互动 0% 且均时 0s → 爬虫/机房探测/点开即走；不纳入 geo 与质量判定。"""
    eng = float(row.get("engagement_rate") or 0)
    avg_sec = float(row.get("avg_session_sec") or 0)
    if eng == 0 and avg_sec == 0:
        return True
    if eng == 0 and avg_sec < 5 and int(row.get("active_users") or 0) <= 3:
        return True
    return False


def partition_human_bot(rows: list[dict]) -> tuple[list[dict], list[dict]]:
    human, bot = [], []
    for r in rows:
        (bot if is_likely_bot_row(r) else human).append(r)
    return human, bot


def _bot_totals(rows: list[dict]) -> dict[str, Any]:
    return {
        "users": sum(int(r.get("active_users") or 0) for r in rows),
        "sessions": sum(int(r.get("sessions") or 0) for r in rows),
        "labels": [
            f"{r.get('dimension') or r.get('country') or '?'}({r.get('active_users', 0)})"
            for r in rows
        ],
    }


def _rows(g: dict, key: str) -> list[dict]:
    return list(g.get(key) or [])


def _sessions_total(rows: list[dict]) -> int:
    return sum(int(r.get("sessions") or 0) for r in rows)


def _users_total(rows: list[dict]) -> int:
    return sum(int(r.get("active_users") or 0) for r in rows)


def _avg_engagement(rows: list[dict]) -> float:
    if not rows:
        return 0.0
    total_s = sum(int(r.get("sessions") or 0) for r in rows)
    if total_s == 0:
        return 0.0
    weighted = sum(
        float(r.get("engagement_rate") or 0) * int(r.get("sessions") or 0) for r in rows
    )
    return round(weighted / total_s, 1)


def get_ga4_payload(d: dict) -> dict:
    """合并 daily 与 biweekly 结构；拉数失败时回退。"""
    g = dict(d.get("ga4_daily") or {})
    if g.get("error") or not g.get("channels_7d"):
        legacy = d.get("ga4") or {}
        if legacy and not legacy.get("error"):
            g.setdefault("error", None)
            g["last_7d"] = {
                "active_users": legacy.get("users_28d", 0),
                "sessions": legacy.get("sessions_28d", 0),
            }
            if legacy.get("channels_28d"):
                g["channels_7d"] = legacy["channels_28d"]
                g["countries_7d"] = legacy.get("countries_28d") or []
                g["source_medium_7d"] = legacy.get("source_medium_28d") or []
                g["country_channel_7d"] = legacy.get("country_channel_28d") or []
            elif legacy.get("organic_users_28d") is not None:
                g["channels_7d"] = [
                    {
                        "dimension": "Organic Search",
                        "active_users": legacy.get("organic_users_28d", 0),
                        "sessions": 0,
                        "engagement_rate": 0,
                    }
                ]
                if legacy.get("users_28d", 0) > legacy.get("organic_users_28d", 0):
                    g["channels_7d"].append(
                        {
                            "dimension": "Direct",
                            "active_users": legacy.get("users_28d", 0)
                            - legacy.get("organic_users_28d", 0),
                            "sessions": legacy.get("sessions_28d", 0),
                            "engagement_rate": 0,
                        }
                    )
    return g


def analyze_ga4(ga4: dict, gsc: dict | None = None) -> dict[str, Any]:
    """返回结构化解读，供日报与 insight_blocks 共用。"""
    gsc = gsc or {}
    ga4 = dict(ga4 or {})
    if ga4.get("error") and not ga4.get("last_7d"):
        out: dict[str, Any] = {
            "ok": False,
            "insights": [f"GA4 拉数失败：{ga4['error']}"],
            "warnings": [],
            "verdict_traffic_quality": None,
            "verdict_eu_visitors": None,
        }
        return out
    ga4.pop("error", None)
    out: dict[str, Any] = {
        "ok": True,
        "insights": [],
        "warnings": [],
        "verdict_traffic_quality": None,
        "verdict_eu_visitors": None,
    }
    channels = _rows(ga4, "channels_7d")
    sources = _rows(ga4, "sources_7d")
    src_med = _rows(ga4, "source_medium_7d")
    countries_raw = _rows(ga4, "countries_7d")
    cc_raw = _rows(ga4, "country_channel_7d")
    countries, bot_countries = partition_human_bot(countries_raw)
    cc, bot_cc = partition_human_bot(cc_raw)
    landing = _rows(ga4, "landing_pages_7d")
    l7 = ga4.get("last_7d") or {}

    total_sessions = int(l7.get("sessions") or 0) or _sessions_total(channels)
    total_users = int(l7.get("active_users") or 0) or _users_total(channels)
    bot_geo = _bot_totals(bot_countries)
    human_users = max(0, total_users - bot_geo["users"])
    human_sessions = max(0, total_sessions - bot_geo["sessions"])
    out["bot_summary"] = {
        **bot_geo,
        "human_users": human_users,
        "human_sessions": human_sessions,
        "raw_users": total_users,
        "raw_sessions": total_sessions,
    }
    if bot_geo["users"]:
        out["insights"].append(
            f"已排除 **疑似 bot** {bot_geo['users']} 用户 / {bot_geo['sessions']} 会话"
            f"（{', '.join(bot_geo['labels'][:6])}）：互动 0% 且均时 0s。"
            f"**可分析**：约 {human_users} 用户 / {human_sessions} 会话。"
        )

    # --- 渠道 ---
    ch_map = {r.get("dimension") or "?": r for r in channels}
    organic = ch_map.get("Organic Search", {})
    direct = ch_map.get("Direct", {})
    unassigned = ch_map.get("Unassigned", {})
    org_s = int(organic.get("sessions") or 0)
    dir_s = int(direct.get("sessions") or 0)
    un_s = int(unassigned.get("sessions") or 0)

    if total_sessions == 0:
        out["insights"].append("近 7 日 GA4 无会话：检查埋点是否部署到 yakushimabus.com，或流量全在 internal 过滤。")
        out["verdict_traffic_quality"] = "no_data"
        return out

    direct_pct = round(100 * dir_s / total_sessions) if total_sessions else 0
    unassigned_pct = round(100 * un_s / total_sessions) if total_sessions else 0
    organic_pct = round(100 * org_s / total_sessions) if total_sessions else 0

    out["channel_summary"] = {
        "total_sessions": total_sessions,
        "total_users": total_users,
        "organic_sessions": org_s,
        "direct_sessions": dir_s,
        "unassigned_sessions": un_s,
        "organic_pct": organic_pct,
        "direct_pct": direct_pct,
        "unassigned_pct": unassigned_pct,
    }

    if org_s == 0:
        gsc_imp = gsc.get("impressions", 0) if not gsc.get("error") else None
        if gsc_imp == 0:
            out["insights"].append(
                "**自然搜索 = 0** 且 GSC 展示 ≈ 0：目前几乎没有 Google 搜索流量，"
                "属新站常态；「有访问但没搜索来源」不矛盾。"
            )
        else:
            out["warnings"].append(
                f"GSC 有展示 ({gsc_imp}) 但 GA4 Organic 仍为 0：检查 GA4 关联/渠道定义，或点击来自非 Google。"
            )
    elif organic_pct >= 20:
        out["insights"].append(
            f"自然搜索占 **{organic_pct}%**（{org_s} 会话）：SEO 开始起量，与 GSC 点击交叉验证。"
        )

    if direct_pct + unassigned_pct >= 70:
        out["insights"].append(
            f"**Direct {direct_pct}% + Unassigned {unassigned_pct}%** 占主导（渠道为 GA4 原始值，"
            "bot 多记 Direct）：朋友圈/书签等 **无 referrer** 是主因，不是 GA4 漏记。"
        )
        top_src = sources[:3] if sources else src_med[:3]
        if top_src:
            names = ", ".join(
                (r.get("dimension") or r.get("sessionSource") or "?") for r in top_src
            )
            out["insights"].append(f"来源明细 Top：`{names}`（见 §2.2）。")

    # --- 国家 ---
    eu_rows = [r for r in countries if (r.get("dimension") or "") in EU_EEA | UK]
    jp_rows = [r for r in countries if (r.get("dimension") or "") in JP_MARKET]
    eu_users = sum(int(r.get("active_users") or 0) for r in eu_rows)
    jp_users = sum(int(r.get("active_users") or 0) for r in jp_rows)

    out["geo_summary"] = {
        "eu_users": eu_users,
        "jp_related_users": jp_users,
        "top_countries": [
            {
                "country": r.get("dimension"),
                "users": r.get("active_users"),
                "sessions": r.get("sessions"),
                "avg_session_sec": r.get("avg_session_sec"),
            }
            for r in countries[:8]
        ],
        "excluded_bot_countries": bot_geo["labels"],
    }

    if eu_users > 0:
        eu_cc = [r for r in cc if (r.get("country") or "") in EU_EEA | UK]
        eu_eng = _avg_engagement(eu_cc or eu_rows)
        eu_sessions = sum(int(r.get("sessions") or 0) for r in eu_rows)
        eu_detail = ", ".join(
            f"{r.get('dimension')}({r.get('active_users')})" for r in eu_rows[:5]
        )
        if eu_eng < 35 and eu_sessions <= eu_users * 1.2:
            out["verdict_eu_visitors"] = "likely_noise"
            out["insights"].append(
                f"欧盟/英国用户 **{eu_users}**（{eu_detail}），互动率均值 **{eu_eng}%**、"
                "会话≈用户：更像 **单次跳出/爬虫/VPN**，暂不能当真实旅客。"
            )
            out["warnings"].append(
                "若你本人用欧洲节点 VPN 测站且未加 `?ga_internal=1`，会计入此类。"
            )
        elif eu_eng >= 35:
            out["verdict_eu_visitors"] = "plausible_real"
            out["insights"].append(
                f"欧盟/英国 **{eu_users}** 用户、互动率 **{eu_eng}%**：有实际浏览行为，"
                "可能含欧州赴日旅客或英文搜索；仍建议对照着陆页是否多页访问。"
            )
        else:
            out["verdict_eu_visitors"] = "uncertain"
            out["insights"].append(
                f"欧盟/英国 **{eu_users}** 用户（{eu_detail}）：样本小，真实性 **待定**；"
                f"互动率 {eu_eng}%，继续观察。"
            )
    else:
        out["verdict_eu_visitors"] = "none"
        if countries:
            top = ", ".join(f"{r.get('dimension')}({r.get('active_users')})" for r in countries[:4])
            out["insights"].append(f"近 7 日国家 Top：**{top}**（无欧盟/英国条目或量极低）。")

    # --- 着陆页 / 工具使用 ---
    if landing:
        norm_paths = {
            (r.get("dimension") or "").replace("https://yakushimabus.com", "") or "/"
            for r in landing
        }
        multi = len(norm_paths) >= 2
        eng_l7 = float(l7.get("engagement_rate") or 0)
        if multi and eng_l7 >= 40:
            out["verdict_traffic_quality"] = "real_usage"
            out["insights"].append(
                f"多着陆页 + 7 日互动率 **{eng_l7}%**：有人在用时刻表/地图等工具，非纯误点。"
            )
        elif not multi and eng_l7 < 30:
            out["verdict_traffic_quality"] = "mostly_bounce"
            out["insights"].append(
                "主要只有首页、互动率偏低：可能是爬虫或点开即走，需更多样本。"
            )
        else:
            out["verdict_traffic_quality"] = "mixed"
    else:
        out["verdict_traffic_quality"] = "mixed"

    if not out["insights"]:
        out["insights"].append("数据平稳：维持工具定位，对照 §2 表格即可。")

    return out


def daily_insight_bullets(d: dict) -> list[str]:
    ga4 = get_ga4_payload(d)
    gsc = d.get("gsc_28d") or d.get("gsc") or {}
    return analyze_ga4(ga4, gsc).get("insights") or ["数据不足，先跑 seo_fetch_daily.py。"]


def markdown_analysis_section(ga4: dict, gsc: dict | None = None) -> str:
    """§2.5 自动分析 markdown。"""
    a = analyze_ga4(ga4, gsc)
    lines = ["### 2.5 自动分析（基于近 7 日数据）", ""]
    cs = a.get("channel_summary") or {}
    bs = a.get("bot_summary") or {}
    if bs.get("human_users") is not None and bs.get("raw_users"):
        lines.append(
            f"- **可分析流量**（已剔 bot 国家行）：{bs.get('human_users', 0)} 用户 / "
            f"{bs.get('human_sessions', 0)} 会话 · GA4 原始 {bs.get('raw_users', 0)} / "
            f"{bs.get('raw_sessions', 0)}"
        )
    if cs:
        lines.append(
            f"- **渠道（原始）**：Organic {cs.get('organic_pct', 0)}% · "
            f"Direct {cs.get('direct_pct', 0)}% · "
            f"Unassigned {cs.get('unassigned_pct', 0)}%"
        )
    gs = a.get("geo_summary") or {}
    if gs.get("eu_users"):
        lines.append(
            f"- **欧盟/英国用户**：{gs['eu_users']} · "
            f"判定：**{a.get('verdict_eu_visitors', '—')}**"
        )
    if a.get("verdict_traffic_quality"):
        lines.append(f"- **流量质量**：`{a['verdict_traffic_quality']}`")
    lines.append("")
    for w in a.get("warnings") or []:
        lines.append(f"- ⚠ {w}")
    for i in a.get("insights") or []:
        lines.append(f"- {i}")
    lines.append("")
    return "\n".join(lines)
