#!/usr/bin/env python3
"""从 GA4/GSC 拉数结果生成数据驱动的 SEO 优先级（供日报 / ntfy / 飞书）。"""
from __future__ import annotations

from typing import Any

# 查询词 → 最该承接的落地页
_QUERY_ROUTES: list[tuple[tuple[str, ...], str, str]] = [
    (("運賃", "路線", "fare", "map", "停留所"), "/map/", "地图/运价"),
    (("船", "フェリー", "高速船", "ferry", "jetfoil", "上岛", "鹿児島"), "/access/", "船票/上岛"),
    (("時刻表", "timetable", "バス", "bus", "荒川", "登山"), "/", "时刻表首页"),
    (("交通", "yakushima"), "/", "交通总览/首页"),
]


def _path(url: str) -> str:
    return url.replace("https://yakushimabus.com", "") or "/"


def query_landing(query: str) -> tuple[str, str]:
    q = query.lower()
    for keys, path, label in _QUERY_ROUTES:
        if any(k.lower() in q or k in query for k in keys):
            return path, label
    return "/", "首页"


def compute_priorities(d: dict) -> dict[str, Any]:
    from seo_ga4_analysis import analyze_ga4, get_ga4_payload, partition_human_bot

    ga4 = get_ga4_payload(d)
    gsc = d.get("gsc_28d") or d.get("gsc") or {}
    analysis = analyze_ga4(ga4, gsc)
    cs = analysis.get("channel_summary") or {}
    organic_pct = cs.get("organic_pct", 0)
    l7 = ga4.get("last_7d") or {}
    human_u = (analysis.get("bot_summary") or {}).get("human_users") or l7.get("active_users", 0)

    items: list[dict[str, str]] = []
    uptime = d.get("uptime") or {}
    if uptime and not uptime.get("ok", True):
        bad = [u for u in (uptime.get("urls") or []) if u.get("status") != 200]
        detail = " · ".join(f"{u.get('path')}→{u.get('status')}" for u in bad[:4])
        items.append(
            {
                "priority": "P0",
                "area": "站点不可用",
                "action": (
                    f"线上 HTTP 异常（{detail}）。先 GitHub → Settings → Pages / 腾讯云 DNS；"
                    "修好前 GSC 编入索引无效"
                ),
                "owner": "👤 立即",
                "evidence": f"uptime check {uptime.get('checked_at', '?')}",
            }
        )

    gsc_err = gsc.get("error")

    if gsc_err:
        items.append(
            {
                "priority": "P0",
                "area": "数据",
                "action": "GSC 拉数失败，优先检查 OAuth Secrets（见 GOOGLE_SETUP.md）",
                "owner": "👤 手动",
                "evidence": str(gsc_err)[:80],
            }
        )
    else:
        st = gsc.get("index_status") or {}
        for url, verdict in st.items():
            path = _path(url)
            if verdict == "PASS":
                continue
            items.append(
                {
                    "priority": "P0",
                    "area": f"索引 {path}",
                    "action": f"GSC → URL 检查 `{url}` → 请求编入索引（当前 **{verdict}**）",
                    "owner": "👤 手动",
                    "evidence": f"index_status API: {verdict}",
                }
            )

        imp = int(gsc.get("impressions") or 0)
        clk = int(gsc.get("clicks") or 0)
        pos = gsc.get("position", 0)

        queries = gsc.get("top_queries") or []
        for q in queries[:8]:
            query = q.get("query", "")
            qimp = int(q.get("impressions") or 0)
            qclk = int(q.get("clicks") or 0)
            qpos = q.get("position")
            target, label = query_landing(query)
            target_path = target if target.startswith("/") else f"/{target}"
            target_url = (
                "https://yakushimabus.com/"
                if target_path == "/"
                else f"https://yakushimabus.com{target_path}"
            )
            target_index = st.get(target_url, "UNKNOWN")
            if qimp <= 0:
                continue

            if qclk == 0 and qimp >= 1:
                prio = "P0" if qimp >= 2 or (qpos and qpos > 20) else "P1"
                idx_hint = ""
                if target_index not in ("PASS",):
                    idx_hint = f"；先让 **{target}** 进索引（当前 {target_index}）"
                items.append(
                    {
                        "priority": prio,
                        "area": f"查询「{query}」",
                        "action": (
                            f"展示 **{qimp}**、点击 0 → 应用 **{label}（{target}）** 承接；"
                            f"核对 title 是否含该意图{idx_hint}"
                        ),
                        "owner": "👤 索引" if target_index != "PASS" else "⏳ 观察 meta",
                        "evidence": f"GSC query: {qimp} imp, pos {qpos or '—'}",
                    }
                )

        if imp > 0 and clk == 0:
            items.append(
                {
                    "priority": "P0",
                    "area": "搜索 CTR",
                    "action": (
                        f"28 天共 **{imp}** 展示、**0** 点击、均排 **{pos}** — "
                        "排名靠后或标题不够吸引；优先完成 P0 索引与查询词落地页"
                    ),
                    "owner": "⏳ 数据驱动",
                    "evidence": f"GSC 28d: {imp} imp / {clk} clk",
                }
            )
        elif imp == 0:
            items.append(
                {
                    "priority": "P0",
                    "area": "搜索曝光",
                    "action": "尚无展示：先完成全站索引 + sitemap；保持 P0 目标词在 title/description",
                    "owner": "⏳ 2–4 周",
                    "evidence": "GSC impressions = 0",
                }
            )

        top_pages = gsc.get("top_pages") or []
        if top_pages:
            only_home = len(top_pages) == 1 and _path(top_pages[0].get("page", "")) == "/"
            if only_home:
                items.append(
                    {
                        "priority": "P1",
                        "area": "展示页集中",
                        "action": "GSC 展示只在首页 → 索引 /map/、/access/ 并加首页内链，分摊长尾词",
                        "owner": "👤 approve 后改",
                        "evidence": f"top_pages: {_path(top_pages[0].get('page', ''))} 100%",
                    }
                )

    if organic_pct == 0 and human_u >= 5:
        items.append(
            {
                "priority": "P1",
                "area": "流量结构",
                "action": (
                    f"Organic 0% 但近 7 日 **{human_u}** 可分析访客 → 朋友圈/Direct 在用工具；"
                    "搜索优化不急改产品，先索引与 meta"
                ),
                "owner": "🤖 维持",
                "evidence": f"GA4 Direct 主导, {human_u} human users",
            }
        )

    bs = analysis.get("bot_summary") or {}
    if int(bs.get("users") or 0) > 3:
        items.append(
            {
                "priority": "P1",
                "area": "数据质量",
                "action": "GA4 开「排除已知机器人」；自测用 `?ga_internal=1`",
                "owner": "👤 一次",
                "evidence": f"bot 行约 {bs.get('users')} 用户",
            }
        )

    landing = ga4.get("landing_pages_7d") or []
    if landing:
        paths = {
            (_path(r.get("dimension") or "/")) for r in landing
        }
        if paths == {"/"}:
            items.append(
                {
                    "priority": "P2",
                    "area": "GA4 入口",
                    "action": "7 日着陆仅首页 → 强化 /map/、/access/ 内链与索引",
                    "owner": "👤 approve",
                    "evidence": "landing_pages_7d: / only",
                }
            )

    # 去重：同 area 保留最高优先级
    order = {"P0": 0, "P1": 1, "P2": 2}
    seen: set[str] = set()
    deduped: list[dict] = []
    for it in sorted(items, key=lambda x: order.get(x["priority"], 9)):
        key = it["area"]
        if key in seen:
            continue
        seen.add(key)
        deduped.append(it)

    p0_lines = [it for it in deduped if it["priority"] == "P0"][:4]
    return {
        "items": deduped,
        "p0_headlines": [f"[{it['priority']}] {it['area']}：{it['action']}" for it in p0_lines],
        "queries": gsc.get("top_queries") or [] if not gsc_err else [],
        "index_status": gsc.get("index_status") or {} if not gsc_err else {},
    }


def priorities_markdown(p: dict[str, Any], md_table_fn) -> list[str]:
    lines = ["## 四、优化方向（数据自动生成）", ""]
    if not p.get("items"):
        lines.extend(["*GSC/GA4 拉数不足，暂无优先级。*", ""])
        return lines

    rows = [
        [it["priority"], it["area"], it["action"], it["owner"], it["evidence"]]
        for it in p["items"]
    ]
    lines.extend(md_table_fn(["优先级", "领域", "建议", "谁做", "数据依据"], rows))
    lines.append("> 由上表 **`top_queries` / `index_status` / `top_pages` / GA4** 自动算出，无需手查 GSC。")
    lines.append("")
    return lines
