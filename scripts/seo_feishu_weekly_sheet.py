#!/usr/bin/env python3
"""将 weekly-*.json 同步到飞书电子表格（长期周维度看板）。"""
from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
METRICS_DIR = ROOT / "docs/seo" / "metrics"

sys.path.insert(0, str(Path(__file__).resolve().parent))
import seo_feishu_columns as cols  # noqa: E402
import seo_feishu_util as fu  # noqa: E402
import seo_metrics_derive as md  # noqa: E402

SHEETS = [
    "周报汇总",
    "周报-维度明细",
    "周报-国家×渠道",
    "周报-GSC查询词",
    "周报-GSC页面",
    "周报-GSC国家",
    "周报-GSC设备",
]

WEEKLY_DIM_SPECS = [
    ("channels", "渠道(sessionDefaultChannelGroup)", "sessionDefaultChannelGroup"),
    ("countries", "国家(country)", "country"),
    ("source_medium", "来源/媒介(sessionSourceMedium)", "sessionSourceMedium"),
    ("sources", "来源(sessionSource)", "sessionSource"),
    ("landing_pages", "着陆页(landingPage)", "landingPage"),
    ("pages", "页面(pagePath)", "pagePath"),
    ("devices", "设备(deviceCategory)", "deviceCategory"),
]


def load_weekly_files() -> list[dict]:
    out = []
    for p in sorted(METRICS_DIR.glob("weekly-*.json")):
        if p.name == "weekly-latest.json":
            continue
        try:
            out.append(json.loads(p.read_text(encoding="utf-8")))
        except json.JSONDecodeError:
            continue
    out.sort(key=lambda x: x.get("week") or "")
    return out


def _ga4_row(r: dict) -> list:
    return [
        md.cell(r.get("active_users")),
        md.cell(r.get("new_users")),
        md.cell(r.get("sessions")),
        md.cell(r.get("engaged_sessions")),
        md.cell(r.get("pageviews")),
        md.cell(r.get("engagement_rate")),
        md.cell(r.get("avg_session_sec")),
    ]


def summary_rows(weeks: list[dict]) -> list[list]:
    rows = [cols.WEEKLY_SUMMARY]
    for w in weeks:
        g = w.get("ga4") or {}
        gs = w.get("gsc") or {}
        d = w.get("derived") or {}
        wow = w.get("wow") or {}
        p = w.get("period") or {}
        rows.append(
            [
                w.get("week", ""),
                p.get("start", ""),
                p.get("end", ""),
                w.get("fetched_at", ""),
                md.cell(g.get("property_id")),
                md.cell(d.get("raw_users")),
                md.cell(d.get("new_users")),
                md.cell(d.get("raw_sessions")),
                md.cell(d.get("engaged_sessions")),
                md.cell(d.get("pageviews")),
                md.cell(d.get("engagement_rate")),
                md.cell(d.get("avg_session_sec")),
                md.cell(d.get("analyzable_users")),
                md.cell(d.get("analyzable_sessions")),
                md.cell(d.get("bot_users")),
                md.cell(d.get("organic_users")),
                md.cell(d.get("organic_sessions")),
                md.cell(d.get("direct_users")),
                md.cell(d.get("direct_sessions")),
                md.cell(d.get("referral_users")),
                md.cell(d.get("referral_sessions")),
                md.cell(d.get("ai_users")),
                md.cell(d.get("unassigned_users")),
                md.cell(gs.get("impressions") if not gs.get("error") else None),
                md.cell(gs.get("clicks") if not gs.get("error") else None),
                md.cell(gs.get("ctr") if not gs.get("error") else None),
                md.cell(gs.get("position") if not gs.get("error") else None),
                md.cell(wow.get("users")),
                md.cell(wow.get("analyzable_users")),
                md.cell(wow.get("organic_users")),
                md.cell(wow.get("sessions")),
                md.cell(wow.get("pageviews")),
                md.cell(wow.get("gsc_clicks")),
                md.cell(wow.get("gsc_impressions")),
                md.cell(g.get("error") or ""),
                md.cell(gs.get("error") or ""),
            ]
        )
    return rows


def dim_rows(weeks: list[dict]) -> list[list]:
    rows = [cols.WEEKLY_DIM]
    for w in weeks:
        p = w.get("period") or {}
        g = w.get("ga4") or {}
        if g.get("error"):
            continue
        for key, dim_type, dim_field in WEEKLY_DIM_SPECS:
            for r in g.get(key) or []:
                rows.append(
                    [
                        w.get("week", ""),
                        p.get("start", ""),
                        p.get("end", ""),
                        dim_type,
                        r.get(dim_field) or r.get("dimension") or "",
                    ]
                    + _ga4_row(r)
                )
    return rows


def country_channel_rows(weeks: list[dict]) -> list[list]:
    rows = [cols.WEEKLY_COUNTRY_CHANNEL]
    for w in weeks:
        p = w.get("period") or {}
        for r in (w.get("ga4") or {}).get("country_channel") or []:
            rows.append(
                [
                    w.get("week", ""),
                    p.get("start", ""),
                    p.get("end", ""),
                    r.get("country", ""),
                    r.get("sessionDefaultChannelGroup", ""),
                    md.cell(r.get("active_users")),
                    md.cell(r.get("sessions")),
                    md.cell(r.get("engagement_rate")),
                    md.cell(r.get("avg_session_sec")),
                ]
            )
    return rows


def gsc_query_rows(weeks: list[dict]) -> list[list]:
    rows = [cols.WEEKLY_GSC_QUERY]
    for w in weeks:
        p = w.get("period") or {}
        gs = w.get("gsc") or {}
        if gs.get("error"):
            continue
        for q in gs.get("top_queries") or []:
            rows.append(
                [
                    w.get("week", ""),
                    p.get("start", ""),
                    p.get("end", ""),
                    q.get("query", ""),
                    md.cell(q.get("impressions")),
                    md.cell(q.get("clicks")),
                    md.cell(q.get("ctr")),
                    md.cell(q.get("position")),
                ]
            )
    return rows


def gsc_page_rows(weeks: list[dict]) -> list[list]:
    rows = [cols.WEEKLY_GSC_PAGE]
    for w in weeks:
        p = w.get("period") or {}
        gs = w.get("gsc") or {}
        if gs.get("error"):
            continue
        for q in gs.get("top_pages") or []:
            rows.append(
                [
                    w.get("week", ""),
                    p.get("start", ""),
                    p.get("end", ""),
                    q.get("page", ""),
                    md.cell(q.get("impressions")),
                    md.cell(q.get("clicks")),
                    md.cell(q.get("ctr")),
                ]
            )
    return rows


def gsc_country_rows(weeks: list[dict]) -> list[list]:
    rows = [cols.WEEKLY_GSC_COUNTRY]
    for w in weeks:
        p = w.get("period") or {}
        gs = w.get("gsc") or {}
        if gs.get("error"):
            continue
        for q in gs.get("by_country") or []:
            rows.append(
                [
                    w.get("week", ""),
                    p.get("start", ""),
                    p.get("end", ""),
                    q.get("dimension", ""),
                    md.cell(q.get("impressions")),
                    md.cell(q.get("clicks")),
                    md.cell(q.get("ctr")),
                ]
            )
    return rows


def gsc_device_rows(weeks: list[dict]) -> list[list]:
    rows = [cols.WEEKLY_GSC_DEVICE]
    for w in weeks:
        p = w.get("period") or {}
        gs = w.get("gsc") or {}
        if gs.get("error"):
            continue
        for q in gs.get("by_device") or []:
            rows.append(
                [
                    w.get("week", ""),
                    p.get("start", ""),
                    p.get("end", ""),
                    q.get("dimension", ""),
                    md.cell(q.get("impressions")),
                    md.cell(q.get("clicks")),
                    md.cell(q.get("ctr")),
                ]
            )
    return rows


def sync_all(token: str, spreadsheet_token: str, weeks: list[dict]) -> None:
    builders = {
        "周报汇总": lambda: summary_rows(weeks),
        "周报-维度明细": lambda: dim_rows(weeks),
        "周报-国家×渠道": lambda: country_channel_rows(weeks),
        "周报-GSC查询词": lambda: gsc_query_rows(weeks),
        "周报-GSC页面": lambda: gsc_page_rows(weeks),
        "周报-GSC国家": lambda: gsc_country_rows(weeks),
        "周报-GSC设备": lambda: gsc_device_rows(weeks),
    }
    for title in SHEETS:
        fu.ensure_sheet_tab(token, spreadsheet_token, title)
        fu.write_range(token, spreadsheet_token, title, builders[title]())


def _sync_to_sheet() -> int:
    if not fu.cfg("FEISHU_APP_ID") or not fu.cfg("FEISHU_APP_SECRET"):
        print("ℹ 未配置飞书 App，跳过（见 docs/seo/FEISHU_SETUP.md）")
        return 0

    weeks = load_weekly_files()
    if not weeks:
        print("⚠ 无 weekly-*.json，请先运行 seo_fetch_weekly.py")
        return 1

    token = fu.tenant_token()
    try:
        ss_token, meta, folder = fu.resolve_spreadsheet_token()
    except RuntimeError as e:
        print(f"ℹ {e}")
        return 0

    if not ss_token:
        try:
            ss_token, url = fu.create_spreadsheet(token, "YakuBus SEO 数据", folder)
        except RuntimeError as e:
            print(f"✗ 飞书建表失败: {e}")
            print(
                "→ 个人版请手动：飞书新建表格「YakuBus SEO 数据」→ 右上角 … → 添加文档应用(Cursor)"
                "→ URL 里 shtcn… 填入 GitHub Secret FEISHU_SHEET_TOKEN 后重跑 workflow"
            )
            return 1
        meta = {"spreadsheet_token": ss_token, "url": url, "title": "YakuBus SEO 数据"}
        fu.save_sheet_meta(meta)
        print(f"✓ 已创建表格: {url}")
        print("  → token 已写入 docs/seo/feishu-sheet.json")
    else:
        url = meta.get("url") or f"https://feishu.cn/sheets/{ss_token}"

    sync_all(token, ss_token, weeks)
    print(f"✓ 已更新周报表（{len(weeks)} 周）: {url}")
    return 0


def main() -> int:
    cmd = sys.argv[1] if len(sys.argv) > 1 else "sync"
    if cmd in ("init", "sync"):
        return _sync_to_sheet()
    print("用法: seo_feishu_weekly_sheet.py sync", file=sys.stderr)
    return 1


if __name__ == "__main__":
    sys.exit(main())
