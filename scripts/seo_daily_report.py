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
    imp = gsc.get("impressions", 0) if not gsc.get("error") else None

    if direct_pct >= 50:
        lines.append(
            "- **为什么渠道几乎全是 Direct？** "
            "微信/朋友圈/书签打开链接**不带 referrer**，GA4 只能记成 Direct 或 Unassigned，"
            "**不是**统计坏了，也**不代表**没人从社交来。看「国家 + 均时」判断真人。"
        )
    if organic_pct == 0:
        if imp == 0 or imp is None:
            lines.append(
                "- **为什么 Organic = 0、GSC 展示也低/为 0？** "
                "新站 Google 尚未给排名或展示很少；首页 **索引 PASS** 只说明「能收录」，"
                "不等于已经在「屋久島 バス」等词上有曝光。"
            )
        else:
            lines.append(
                f"- **为什么 GSC 有 {imp} 展示但 GA4 Organic 仍为 0？** "
                "可能展示在很靠后的排名、或用户从图片/品牌词看到但未点击；"
                "也可能 GA4 与 GSC 窗口/归因差 1–2 天，继续观察。"
            )
    if bot_labels:
        lines.append(
            f"- **为什么有美国/欧洲用户但互动 0 秒？** "
            f"常见是 **机房爬虫、SEO 扫描、VPN 自测**（如 Boardman=AWS 节点）。"
            f"已从可分析访客扣除：**{', '.join(bot_labels[:5])}**。"
            "真人自测请加 `?ga_internal=1`。"
        )
    if raw_u > human_u and human_u > 0:
        lines.append(
            f"- **为什么 GA4 总用户 {raw_u}，可分析只有 {human_u}？** "
            "总用户含 bot 与零互动噪声；**可分析** = 去掉「互动 0% + 均时 0s」的国家行后估算，"
            "更接近真实旅客/朋友圈访客。"
        )
    v = analysis.get("verdict_traffic_quality")
    if v == "real_usage":
        lines.append(
            "- **为什么判断「有人在用工具」？** "
            "近 7 日多个着陆页 + 互动率不低，说明不是误点就走，而是在查时刻表/地图。"
        )
    elif v == "mostly_bounce":
        lines.append(
            "- **为什么互动偏低？** "
            "可能 bot 占比高、或移动端首屏加载慢、或用户只确认链接可用即关。"
            "样本够大后再看均时是否 >30s。"
        )

    for w in analysis.get("warnings") or []:
        lines.append(f"- ⚠ {w}")
    for i in analysis.get("insights") or []:
        if i not in lines:
            lines.append(f"- {i}")

    if len(lines) == 2:
        lines.append("- 数据平稳，暂无异常模式需要特别解释。")
    lines.append("")
    return lines


def _todo_section(gsc: dict, priorities: dict) -> list[str]:
    lines = ["## 六、待办清单", ""]
    todos: list[tuple[str, str]] = []

    if gsc.get("error"):
        todos.append(("👤 手动", "检查 GitHub Secrets / GSC OAuth → `docs/seo/GOOGLE_SETUP.md`"))

    for it in priorities.get("items") or []:
        if it["priority"] != "P0":
            continue
        if it["owner"].startswith("👤"):
            todos.append(("👤 手动", f"{it['area']}：{it['action'][:100]}"))
        if len(todos) >= 4:
            break

    if len(todos) <= 1:
        todos.append(("⏳ 观察", "周一查看 `docs/seo/proposals/` 周报；P0 项 Issue 回复 approve"))
    todos.append(("🤖 自动", "日报拉数、优先级、ntfy（Actions）"))

    for tag, text in todos:
        lines.append(f"- **{tag}** — {text}")
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
    if priorities.get("p0_headlines"):
        lines.append("")
        lines.append("**本周优先（GSC/GA4 自动）：**")
        for h in priorities["p0_headlines"][:3]:
            lines.append(f"- {h}")
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
    lines.extend(["### 2.2 来源 / 媒介 Top（7 日）", ""])
    if src:
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
    else:
        lines.extend(["*（暂无；需 Actions 成功跑 `seo_fetch_daily.py`）*", ""])

    countries_raw = ga4.get("countries_7d") or []
    human_c, bot_c = partition_human_bot(countries_raw)
    lines.extend(["### 2.3 国家 · 可分析访客（7 日）", ""])
    if human_c:
        lines.extend(_dim_table(human_c[:10], "国家"))
    else:
        lines.extend(["*（暂无国家明细，或全部被判为 bot 行）*", ""])

    lines.extend(["### 2.4 国家 · 已排除噪声（7 日）", ""])
    if bot_c:
        lines.extend(_dim_table(bot_c, "国家"))
        lines.append("> 规则：互动 0% 且均时 0s → 不计入 §一 的「可分析」。")
        lines.append("")
    else:
        lines.extend(["*（无，或暂无国家维度数据）*", ""])

    cc_raw = ga4.get("country_channel_7d") or []
    cc_human, _ = partition_human_bot(cc_raw)
    lines.extend(["### 2.5 国家 × 渠道（7 日，可分析）", ""])
    if cc_human:
        lines.extend(_country_channel_table(cc_human[:15]))
    else:
        lines.extend(["*（暂无）*", ""])

    landing = ga4.get("landing_pages_7d") or []
    lines.extend(["### 2.6 着陆页 Top（7 日）", ""])
    if landing:
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
    else:
        lines.extend(["*（暂无）*", ""])

    devices = ga4.get("devices_7d") or []
    lines.extend(["### 2.7 设备（7 日）", ""])
    if devices:
        lines.extend(_dim_table(devices, "设备"))
    else:
        lines.extend(["*（暂无）*", ""])

    lines.append("---")
    lines.append("")

    bot_labels = bs.get("labels") or [
        f"{r.get('dimension', '?')}({r.get('active_users', 0)})" for r in bot_c
    ]
    lines.extend(_why_section(analysis, gsc, organic_pct, direct_pct, human_u, raw_u, bot_labels))
    lines.extend(priorities_markdown(priorities, _md_table))

    lines.extend(["## 五、Google 搜索（GSC）", ""])
    if gsc.get("error"):
        lines.append(f"- ⚠ 拉数失败：{gsc['error']}")
    else:
        period = gsc.get("period") or {}
        lines.append(
            f"- 窗口 **{period.get('start', '?')} ~ {period.get('end', '?')}**："
            f"展示 **{gsc.get('impressions', 0)}** · 点击 **{gsc.get('clicks', 0)}** · "
            f"均排 **{gsc.get('position', 0)}**"
        )
        for q in (gsc.get("top_queries") or [])[:8]:
            lines.append(
                f"- 「**{q.get('query', '?')}**」展示 {q.get('impressions', 0)} · "
                f"点击 {q.get('clicks', 0)} · 均排 {q.get('position', '—')} · "
                f"建议落地 **{query_landing(q.get('query', ''))[0]}**"
            )
        if not gsc.get("top_queries"):
            lines.append("- Top 查询词：暂无（等有展示后会出现）")
        st = gsc.get("index_status") or {}
        if st:
            lines.append("")
            lines.append("**索引状态：**")
            for u, v in st.items():
                path = u.replace("https://yakushimabus.com", "") or "/"
                note = "已收录可用" if v == "PASS" else "建议手动请求编入索引"
                lines.append(f"- {'✓' if v == 'PASS' else '○'} `{path}` → **{v}**（{note}）")
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
