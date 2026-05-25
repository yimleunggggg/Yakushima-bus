#!/usr/bin/env python3
"""Shared markdown blocks: 洞察 / 学一点 / 下一步 — for daily & biweekly reports."""
from __future__ import annotations

import json
import os
import pathlib
import sys
from datetime import datetime

# Rotate beginner tips by day-of-year
LEARNINGS = [
    (
        "**GA4 活跃用户 vs 会话**：用户是去重的人，会话是一次访问（刷新可能算新会话）。"
        "工具站看「有没有人用」先看用户，再看会话是否高于用户很多（反复查路线）。"
    ),
    (
        "**GSC 展示 vs 点击**：展示是搜索结果里出现了你的链接；点击是有人点进来。"
        "新站长期展示≈0 正常；有展示无点击时优先改 title/description 是否含「屋久島 バス 時刻表」等意图词。"
    ),
    (
        "**Direct vs 来源/媒介**：Direct = 无 referrer；`google / organic` = 搜索。"
        "界面「有国家没来源」时先看 **渠道** 是否 Direct/Unassigned，再看 **sessionSourceMedium** 表。"
    ),
    (
        "**索引 PASS / NEUTRAL**：PASS 表示 Google 已收录可用；NEUTRAL 常是新页或次要页，"
        "可在 Search Console 对该 URL「请求编入索引」（需手动，无稳定全自动 API）。"
    ),
    (
        "**互动率与均时**：互动率高、停留长，说明在用查路线或 PDF；极低可能是误点或首屏加载慢。"
    ),
    (
        "**GEO / 生成式搜索**：AI 更愿引用页面里**静态可见**的交通事实（`page-lead`、FAQ JSON-LD），"
        "而非 JS 动态表格；屋久岛站保持「工具事实」比堆攻略更易被引用。"
    ),
    (
        "**28 天窗口**：GSC 默认看 28 天趋势，单日波动无意义；每 2–4 周对比 TRACKING 表才看得出改动效果。"
    ),
]


def _metrics_path() -> pathlib.Path | None:
    for key in ("SEO_DAILY_METRICS", "SEO_WEEKLY_METRICS"):
        p = os.environ.get(key)
        if p and pathlib.Path(p).is_file():
            return pathlib.Path(p)
    for candidate in (
        "docs/seo/metrics/daily-latest.json",
        "docs/seo/metrics/latest.json",
    ):
        pp = pathlib.Path(candidate)
        if pp.is_file():
            return pp
    return None


def load_metrics() -> dict:
    p = _metrics_path()
    if not p:
        return {}
    d = json.loads(p.read_text(encoding="utf-8"))
    # 若 daily 拉数失败，尝试合并 latest.json 的 biweekly ga4
    g = d.get("ga4_daily") or {}
    if g.get("error") and not d.get("ga4"):
        for candidate in (
            pathlib.Path("docs/seo/metrics/latest.json"),
            pathlib.Path("docs/seo/metrics/daily-latest.json"),
        ):
            if candidate.is_file() and candidate != p:
                alt = json.loads(candidate.read_text(encoding="utf-8"))
                if alt.get("ga4") and not alt["ga4"].get("error"):
                    d["ga4"] = alt["ga4"]
                    if alt.get("gsc_28d"):
                        d["gsc_28d"] = alt["gsc_28d"]
                    break
    return d


def daily_insight(d: dict) -> list[str]:
    from seo_ga4_analysis import daily_insight_bullets

    bullets = daily_insight_bullets(d)
    gs = d.get("gsc_28d") or d.get("gsc") or {}
    st = gs.get("index_status") or {} if gs else {}
    neutral = [u for u, v in (st or {}).items() if v != "PASS"]
    if neutral and not any("NEUTRAL" in b for b in bullets):
        bullets.append(
            f"索引 NEUTRAL 页 {len(neutral)} 个：属正常跟进项，**手动**在 GSC 做 URL 检查并请求编入索引。"
        )
    return bullets


def weekly_insight(d: dict) -> list[str]:
    return daily_insight(d) + [
        "本周方案只列改动、不自动执行；你 `approve` 后才会开 PR 或 commit（workflow 待接）。"
    ]


def learning_lines(n: int = 2) -> list[str]:
    day = int(datetime.now().strftime("%j"))
    idx = day % len(LEARNINGS)
    out = [LEARNINGS[idx]]
    if n > 1:
        out.append(LEARNINGS[(idx + 1) % len(LEARNINGS)])
    return out


def next_steps_daily(d: dict) -> list[tuple[str, str]]:
    """(tag, text) tag: auto | manual | wait"""
    g = d.get("ga4_daily") or {}
    gs = d.get("gsc_28d") or d.get("gsc") or {}
    steps = []
    if gs.get("error") or "OAuth" in str(gs.get("error", "")):
        steps.append(("manual", "配置 GSC OAuth Secrets → 见 docs/seo/GOOGLE_SETUP.md 第 4–5 步"))
    imp = gs.get("impressions", 0) if gs and not gs.get("error") else 0
    if imp == 0:
        steps.append(("manual", "GSC → URL 检查 → 对首页与 /map/ 请求编入索引（各一次即可）"))
    steps.append(("wait", "本周一查看 `proposals/` 周报；有 P1 项再 Issue 回复 approve"))
    if (g.get("last_7d") or {}).get("active_users", 0) > 5:
        steps.append(("auto", "着陆页有数据后，周报将建议对齐 ferry/バス 长尾 meta（批准后执行）"))
    ga4 = d.get("ga4_daily") or {}
    if ga4.get("country_channel_7d") or ga4.get("source_medium_7d"):
        steps.append(("manual", "自测时用 `?ga_internal=1`，避免 VPN/欧盟节点污染国家与渠道数据"))
    else:
        steps.append(("auto", "无需改代码；日报与自检已由 Actions 自动完成"))
    return steps


def next_steps_weekly() -> list[tuple[str, str]]:
    return [
        ("manual", "阅读 §2 表格 → GitHub Issue 评论 `approve` / `defer` / 修改意见"),
        ("manual", "NEUTRAL 索引页：GSC URL 检查 → 请求编入索引"),
        ("auto", "批准后：meta / JSON-LD / page-lead 等（待 approve workflow 接入）"),
        ("wait", "PDF 官方换版 → 你核对后 rebuild，不自动改时刻表"),
    ]


def render_section(title: str, bullets: list[str]) -> str:
    lines = [f"## {title}", ""]
    for b in bullets:
        lines.append(f"- {b}")
    lines.append("")
    return "\n".join(lines)


def render_steps(title: str, steps: list[tuple[str, str]]) -> str:
    tag_map = {"auto": "🤖 自动", "manual": "👤 手动", "wait": "⏳ 观察"}
    lines = [f"## {title}", ""]
    for kind, text in steps:
        lines.append(f"- **{tag_map.get(kind, kind)}** — {text}")
    lines.append("")
    return "\n".join(lines)


def main() -> None:
    mode = sys.argv[1] if len(sys.argv) > 1 else "daily"
    d = load_metrics()
    if mode == "daily":
        print(render_section("今日洞察", daily_insight(d)), end="\n")
        print(render_section("学一点", learning_lines(2)), end="\n")
        print(render_steps("下一步建议", next_steps_daily(d)), end="")
    elif mode == "weekly":
        print(render_section("本期洞察", weekly_insight(d)), end="\n")
        print(render_section("学一点", learning_lines(2)), end="\n")
        print(render_steps("下一步建议", next_steps_weekly()), end="")
    else:
        sys.exit(1)


if __name__ == "__main__":
    main()
