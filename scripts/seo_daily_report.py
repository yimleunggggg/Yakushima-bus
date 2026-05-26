#!/usr/bin/env python3
"""生成 SEO/GA4 日报：信息完整 + 解释「为什么」+ 优化方向。"""
from __future__ import annotations

import json
import os
import sys
from datetime import date, datetime
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

from seo_ga4_analysis import analyze_ga4, get_ga4_payload, partition_human_bot  # noqa: E402
from seo_priorities import compute_priorities, priorities_markdown, query_landing  # noqa: E402

LEARNINGS = [
    "**活跃用户 vs 会话**：用户 = 去重访客；会话 = 一次访问。会话远高于用户说明同一人反复查路线。",
    "**互动率 / 均时**：GA4「参与」需 ≥10s 或多页。0s 常见于爬虫、误点、或只加载首页即关。",
    "**Direct 不是「直达官网」**：无 referrer 的流量都算 Direct，含微信粘贴、书签、部分 App 内打开。",
    "**GSC 展示 vs GA4 Organic**：展示 = 搜索结果里出现链接；Organic = 有人从 Google 点进来。先有展示，后有点击。",
    "**索引 PASS / NEUTRAL**：PASS = Google 已收录；NEUTRAL = 已知 URL 但权重/抓取优先级低，可手动「请求编入索引」。",
    "**剔 bot 规则**：国家行互动 0% 且均时 0s → 不计入「可分析访客」（机房 IP 如 Boardman 常落在美国）。",
]


def _delta(cur: int, prev: int) -> str:
    if prev == 0:
        return "—" if cur == 0 else "**新**"
    pct = (cur - prev) / prev * 100
    return f"**{pct:+.0f}%**"


def _pick_metrics(date_str: str) -> Path | None:
    env = os.environ.get("SEO_DAILY_METRICS")
    if env and Path(env).is_file():
        return Path(env)
    for p in (
        ROOT / "docs/seo/metrics" / f"daily-{date_str}.json",
        ROOT / "docs/seo/metrics/daily-latest.json",
        ROOT / "docs/seo/metrics/latest.json",
    ):
        if p.is_file():
            return p
    return None


def _md_table(headers: list[str], rows: list[list[str]]) -> list[str]:
    if not rows:
        return ["*（暂无数据）*", ""]
    sep = ["---"] * len(headers)
    lines = [
        "| " + " | ".join(headers) + " |",
        "| " + " | ".join(sep) + " |",
    ]
    for row in rows:
        lines.append("| " + " | ".join(str(c) for c in row) + " |")
    lines.append("")
    return lines


def _channel_table(rows: list[dict]) -> list[str]:
    body = [
        [
            r.get("dimension", "?"),
            str(r.get("active_users", 0)),
            str(r.get("sessions", 0)),
            str(r.get("pageviews", 0)),
            f"{r.get('engagement_rate', 0)}%",
            f"{r.get('avg_session_sec', 0)}s",
        ]
        for r in rows
    ]
    return _md_table(["渠道", "用户", "会话", "PV", "互动率", "均时"], body)


def _dim_table(rows: list[dict], label: str = "维度") -> list[str]:
    body = [
        [
            r.get("dimension", "?"),
            str(r.get("active_users", 0)),
            str(r.get("sessions", 0)),
            f"{r.get('engagement_rate', 0)}%",
            f"{r.get('avg_session_sec', 0)}s",
        ]
        for r in rows
    ]
    return _md_table([label, "用户", "会话", "互动率", "均时"], body)


def _country_channel_table(rows: list[dict]) -> list[str]:
    body = [
        [
            r.get("country", "?"),
            r.get("sessionDefaultChannelGroup", "?"),
            str(r.get("active_users", 0)),
            str(r.get("sessions", 0)),
            f"{r.get('engagement_rate', 0)}%",
            f"{r.get('avg_session_sec', 0)}s",
        ]
        for r in rows
    ]
    return _md_table(["国家", "渠道", "用户", "会话", "互动率", "均时"], body)


def _why_section(
    analysis: dict,
    gsc: dict,
    organic_pct: int,
    direct_pct: int,
    human_u: int,
    raw_u: int,
    bot_labels: list[str],
) -> list[str]:
    lines = ["## 三、为什么会这样", ""]
    rows: list[list[str]] = []
    imp = gsc.get("impressions", 0) if not gsc.get("error") else None

    if direct_pct >= 50:
        rows.append([
            "渠道几乎全是 Direct",
            "微信/朋友圈/书签不带 referrer，GA4 记成 Direct；看国家+均时判断真人，不是统计坏了。",
        ])
    if organic_pct == 0:
        if imp == 0 or imp is None:
            rows.append([
                "Organic=0、GSC 展示低",
                "新站正常；索引 PASS ≠ 已在目标词上有排名。",
            ])
        else:
            rows.append([
                f"GSC 有 {imp} 展示但 Organic=0",
                "排名靠后或未点击；GA4/GSC 窗口差 1–2 天，继续观察。",
            ])
    if bot_labels:
        rows.append([
            "美国/欧洲用户但互动 0s",
            f"多为爬虫/VPN（已剔除：{', '.join(bot_labels[:3])}…）。自测加 ?ga_internal=1。",
        ])
    if raw_u > human_u and human_u > 0:
        rows.append([
            f"GA4 总用户 {raw_u} vs 可分析 {human_u}",
            "总用户含 bot；可分析=去掉互动0%+均时0s的国家行。",
        ])
    v = analysis.get("verdict_traffic_quality")
    if v == "real_usage":
        rows.append(["判断「有人在用」", "多着陆页+互动率不低，在查时刻表/地图。"])
    elif v == "mostly_bounce":
        rows.append(["互动偏低", "可能 bot 多、首屏慢、或只确认链接即关。"])

    for w in analysis.get("warnings") or []:
        rows.append(["⚠ 告警", w])
    for i in analysis.get("insights") or []:
        rows.append(["洞察", i])

    if not rows:
        rows.append(["—", "数据平稳，暂无异常模式。"])
    lines.extend(_md_table(["现象", "说明"], rows))
    lines.append("")
    return lines


def _todo_section(gsc: dict, priorities: dict) -> list[str]:
    lines = ["## 六、待办清单", ""]
    todos: list[tuple[str, str]] = []

    if gsc.get("error"):
        todos.append(("👤 手动", "检查 GitHub Secrets / GSC OAuth → GOOGLE_SETUP.md"))

    seen: set[str] = set()
    for it in priorities.get("items") or []:
        if it["priority"] != "P0" or not it["owner"].startswith("👤"):
            continue
        key = it["area"]
        if key in seen:
            continue
        seen.add(key)
        todos.append((it["owner"], f"{it['area']}：{it['action'][:90]}"))
        if len(todos) >= 3:
            break

    if len(todos) <= 1:
        todos.append(("⏳ 观察", "数据平稳则无需改代码；NEUTRAL 页在 GSC 手动请求编入索引"))
    todos.append(("🤖 自动", "日报拉数、优先级、ntfy（Actions）"))

    lines.extend(_md_table(["负责", "待办"], [[a, b] for a, b in todos]))
    lines.append("")
    return lines


def build_report(date_str: str, metrics_path: Path, check_ok: bool) -> str:
    d = json.loads(metrics_path.read_text(encoding="utf-8"))
    uptime_path = ROOT / "docs/seo/metrics/uptime-latest.json"
    if uptime_path.is_file():
        d["uptime"] = json.loads(uptime_path.read_text(encoding="utf-8"))
    ga4 = get_ga4_payload(d)
    gsc = d.get("gsc_28d") or d.get("gsc") or {}
    analysis = analyze_ga4(ga4, gsc)
    priorities = compute_priorities(d)

    y = ga4.get("yesterday") or {}
    db = ga4.get("day_before") or {}
    l7 = ga4.get("last_7d") or {}
    bs = analysis.get("bot_summary") or {}
    cs = analysis.get("channel_summary") or {}
    human_u = bs.get("human_users") if bs.get("human_users") is not None else l7.get("active_users", 0)
    human_s = bs.get("human_sessions") if bs.get("human_sessions") is not None else l7.get("sessions", 0)
    raw_u = bs.get("raw_users") or l7.get("active_users", 0)
    raw_s = bs.get("raw_sessions") or l7.get("sessions", 0)

    organic_pct = cs.get("organic_pct", 0)
    direct_pct = cs.get("direct_pct", 0)
    period_7d = (ga4.get("period") or {}).get("last_7d", "近 7 日")

    lines: list[str] = [
        f"# YakuBus 日报 · {date_str}",
        "",
        "站点 https://yakushimabus.com · 公交/轮渡工具站 · GSC 数据滞后约 2–3 天",
        "",
        "---",
        "",
        "## 一、今日结论",
        "",
    ]

    imp = gsc.get("impressions", 0) if not gsc.get("error") else "—"
    clicks = gsc.get("clicks", 0) if not gsc.get("error") else "—"
    verdict_bits = []
    if human_u >= 5:
        verdict_bits.append(f"近 7 日约 **{human_u}** 位可分析访客在用它")
    if isinstance(imp, int) and imp > 0:
        verdict_bits.append(f"Google 开始展示（{imp} 次）")
    elif organic_pct == 0:
        verdict_bits.append("搜索流量尚未起量，社交/直达为主")
    lines.append(" · ".join(verdict_bits) if verdict_bits else "数据平稳，继续观察。")
    uptime = d.get("uptime") or {}
    if uptime and not uptime.get("ok", True):
        bad = [u for u in (uptime.get("urls") or []) if u.get("status") != 200]
        detail = " · ".join(f"`{u.get('path')}` HTTP **{u.get('status')}**" for u in bad)
        lines.append("")
        lines.append(f"⚠ **线上站点异常**（{uptime.get('checked_at', '?')} UTC）：{detail}")
        lines.append("")
        lines.append(
            "> 此前 GSC「已编入索引」是历史快照；**Live test 404** 表示现在打不开。"
            "日报/GA4 不会自动发现，现已加 HTTP 探测 + ntfy  urgent 告警。"
        )
    if priorities.get("items"):
        p0 = [it for it in priorities["items"] if it["priority"] == "P0"][:4]
        if p0:
            lines.append("")
            lines.extend(
                _md_table(
                    ["优先级", "事项", "建议"],
                    [[it["priority"], it["area"], it["action"][:100]] for it in p0],
                )
            )
    lines.append("")

    summary_rows = []
    if y:
        summary_rows.append(
            [
                f"昨日 ({ga4.get('period', {}).get('yesterday', '?')})",
                f"{y.get('active_users', 0)} 人 {_delta(y.get('active_users', 0), db.get('active_users', 0))}",
                str(y.get("sessions", 0)),
                f"{y.get('engagement_rate', 0)}%",
                f"{y.get('avg_session_sec', 0)}s",
            ]
        )
    summary_rows.append(
        [
            f"近 7 日 · 可分析",
            str(human_u),
            str(human_s),
            "—",
            "见 §2.4",
        ]
    )
    summary_rows.append(
        [
            "近 7 日 · GA4 原始",
            str(raw_u),
            str(raw_s),
            f"{l7.get('engagement_rate', '—')}%"
            if l7.get("engagement_rate") is not None
            else "—",
            f"{l7.get('avg_session_sec', '—')}s"
            if l7.get("avg_session_sec") is not None
            else "—",
        ]
    )
    if not gsc.get("error"):
        gsc_p = gsc.get("period") or {}
        summary_rows.append(
            [
                f"GSC 28 天 ({gsc_p.get('start', '?')}~{gsc_p.get('end', '?')})",
                f"展示 {imp}",
                f"点击 {clicks}",
                f"CTR {gsc.get('ctr', 0)}%",
                f"均排 {gsc.get('position', 0)}",
            ]
        )
    lines.extend(_md_table(["窗口", "用户/展示", "会话/点击", "互动/CTR", "均时/排名"], summary_rows))
    lines.append(
        "> **可分析** = 去掉互动 0% 且均时 0s 的国家行（爬虫/机房）。"
        "**原始** = GA4 后台看到的总数。两者差越大，bot 噪声越多。"
    )
    lines.extend(["", "---", "", "## 二、数据明细", ""])

    # 2.1 指标怎么读
    lines.extend(
        [
            "### 2.0 这些指标是什么意思",
            "",
            "| 指标 | 怎么读 |",
            "|---|---|",
            "| **活跃用户** | 去重访客（靠 `_ga` Cookie，不是 IP） |",
            "| **会话** | 一次访问；同一人一天内可能多次 |",
            "| **互动率 / 均时** | 是否「真在看」：≥10s 或多页 ≈ 参与；0s 常是 bot 或误点 |",
            "| **Direct** | 无 referrer，**含微信**；不是「直接输入网址」 |",
            "| **Organic** | 从 Google/Bing 等搜索引擎点进来 |",
            "| **GSC 展示** | 链接出现在搜索结果里；**≠** 点进网站 |",
            "| **索引 PASS/NEUTRAL** | 收录状态；NEUTRAL 可手动请求编入索引 |",
            "",
        ]
    )

    lines.extend(["### 2.1 渠道（7 日）", ""])
    lines.extend(_channel_table(ga4.get("channels_7d") or []))

    src = ga4.get("source_medium_7d") or ga4.get("sources_7d") or []
    if src:
        lines.extend(["### 2.2 来源 / 媒介 Top（7 日）", ""])
        body = [
            [
                f"`{r.get('dimension', '?')}`",
                str(r.get("active_users", 0)),
                str(r.get("sessions", 0)),
                f"{r.get('engagement_rate', 0)}%",
            ]
            for r in src[:10]
        ]
        lines.extend(_md_table(["来源 / 媒介", "用户", "会话", "互动率"], body))

    countries_raw = ga4.get("countries_7d") or []
    human_c, bot_c = partition_human_bot(countries_raw)
    if human_c:
        lines.extend(["### 2.3 国家 · 可分析访客（7 日）", ""])
        lines.extend(_dim_table(human_c[:10], "国家"))

    if bot_c:
        lines.extend(["### 2.4 国家 · 已排除噪声（7 日）", ""])
        lines.extend(_dim_table(bot_c, "国家"))
        lines.append("> 规则：互动 0% 且均时 0s → 不计入 §一 的「可分析」。")
        lines.append("")

    cc_raw = ga4.get("country_channel_7d") or []
    cc_human, _ = partition_human_bot(cc_raw)
    if cc_human:
        lines.extend(["### 2.5 国家 × 渠道（7 日，可分析）", ""])
        lines.extend(_country_channel_table(cc_human[:15]))

    landing = ga4.get("landing_pages_7d") or []
    if landing:
        lines.extend(["### 2.6 着陆页 Top（7 日）", ""])
        body = [
            [
                (r.get("dimension") or "/").replace("https://yakushimabus.com", "") or "/",
                str(r.get("active_users", 0)),
                str(r.get("sessions", 0)),
                str(r.get("pageviews", 0)),
            ]
            for r in landing[:8]
        ]
        lines.extend(_md_table(["路径", "用户", "会话", "PV"], body))

    devices = ga4.get("devices_7d") or []
    if devices:
        lines.extend(["### 2.7 设备（7 日）", ""])
        lines.extend(_dim_table(devices, "设备"))

    has_detail = bool(src or human_c or bot_c or cc_human or landing or devices)
    if not has_detail and not (ga4.get("channels_7d") or []):
        lines.extend(["*（渠道/国家等明细需 Actions 成功跑 `seo_fetch_daily.py`；见 §一 汇总即可）*", ""])

    lines.append("---")
    lines.append("")

    bot_labels = bs.get("labels") or [
        f"{r.get('dimension', '?')}({r.get('active_users', 0)})" for r in bot_c
    ]
    lines.extend(_why_section(analysis, gsc, organic_pct, direct_pct, human_u, raw_u, bot_labels))
    lines.extend(priorities_markdown(priorities, _md_table))

    lines.extend(["## 五、Google 搜索（GSC）", ""])
    if gsc.get("error"):
        lines.extend(_md_table(["状态", "说明"], [["⚠ 拉数失败", str(gsc["error"])[:120]]]))
    else:
        period = gsc.get("period") or {}
        lines.extend(
            _md_table(
                ["指标", "数值"],
                [
                    ["窗口", f"{period.get('start', '?')} ~ {period.get('end', '?')}"],
                    ["展示", str(gsc.get("impressions", 0))],
                    ["点击", str(gsc.get("clicks", 0))],
                    ["CTR", f"{gsc.get('ctr', 0)}%"],
                    ["均排", str(gsc.get("position", 0))],
                ],
            )
        )
        queries = gsc.get("top_queries") or []
        if queries:
            lines.append("")
            lines.extend(
                _md_table(
                    ["查询词", "展示", "点击", "均排", "落地页"],
                    [
                        [
                            q.get("query", "?"),
                            str(q.get("impressions", 0)),
                            str(q.get("clicks", 0)),
                            str(q.get("position", "—")),
                            query_landing(q.get("query", ""))[0],
                        ]
                        for q in queries[:8]
                    ],
                )
            )
        else:
            lines.append("")
            lines.append("*Top 查询词：暂无（等有展示后会出现）*")
        st = gsc.get("index_status") or {}
        if st:
            lines.append("")
            lines.extend(
                _md_table(
                    ["路径", "状态", "说明"],
                    [
                        [
                            u.replace("https://yakushimabus.com", "") or "/",
                            v,
                            "已收录" if v == "PASS" else "建议 GSC 请求编入索引",
                        ]
                        for u, v in st.items()
                    ],
                )
            )
    lines.append("")

    lines.extend(_todo_section(gsc, priorities))

    day_idx = int(datetime.now().strftime("%j")) % len(LEARNINGS)
    lines.extend(
        [
            "## 七、学一点",
            "",
            f"- {LEARNINGS[day_idx]}",
            "",
            "---",
            "",
        ]
    )

    check_line = "✓ 站点自检通过" if check_ok else "⚠ 自检有告警（见 Actions 日志）"
    try:
        rel = metrics_path.resolve().relative_to(ROOT.resolve())
    except ValueError:
        rel = metrics_path.name
    lines.append(f"*{check_line} · 数据文件 `{rel}` · 周期 {period_7d}*")
    lines.append("")
    return "\n".join(lines)


def main() -> int:
    date_str = sys.argv[1] if len(sys.argv) > 1 else date.today().isoformat()
    metrics = _pick_metrics(date_str)
    if not metrics:
        print("无 metrics 文件", file=sys.stderr)
        return 1

    check_ok = True
    check_log = os.environ.get("SEO_CHECK_LOG", "")
    if check_log and "All checks passed" not in check_log:
        check_ok = False

    out_dir = ROOT / "docs/seo/reports/daily"
    out_dir.mkdir(parents=True, exist_ok=True)
    out_path = out_dir / f"{date_str}.md"
    out_path.write_text(build_report(date_str, metrics, check_ok), encoding="utf-8")
    print(out_path)
    return 0


if __name__ == "__main__":
    sys.exit(main())
