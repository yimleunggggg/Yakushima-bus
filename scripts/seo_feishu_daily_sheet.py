#!/usr/bin/env python3
"""将 daily-*.json 同步到飞书电子表格（固定一张表，每天一行）。"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
METRICS_DIR = ROOT / "docs/seo" / "metrics"

sys.path.insert(0, str(Path(__file__).resolve().parent))
import seo_feishu_columns as cols  # noqa: E402
import seo_feishu_util as fu  # noqa: E402
import seo_metrics_derive as md  # noqa: E402
from seo_fetch_weekly import channel_metric  # noqa: E402
from seo_week_util import wow_pct  # noqa: E402

SHEETS = [
    "日报汇总",
    "日报-维度明细",
    "日报-国家×渠道",
    "日报-GSC查询词",
    "日报-GSC页面",
]

DIM_SPECS = [
    ("channels_yesterday", "单日(昨日)", "渠道(sessionDefaultChannelGroup)", "sessionDefaultChannelGroup"),
    ("countries_yesterday", "单日(昨日)", "国家(country)", "country"),
    ("source_medium_yesterday", "单日(昨日)", "来源/媒介(sessionSourceMedium)", "sessionSourceMedium"),
    ("landing_pages_yesterday", "单日(昨日)", "着陆页(landingPage)", "landingPage"),
    ("pages_yesterday", "单日(昨日)", "页面(pagePath)", "pagePath"),
    ("devices_yesterday", "单日(昨日)", "设备(deviceCategory)", "deviceCategory"),
    ("channels_7d", "滚动7日", "渠道(sessionDefaultChannelGroup)", "sessionDefaultChannelGroup"),
    ("countries_7d", "滚动7日", "国家(country)", "country"),
    ("source_medium_7d", "滚动7日", "来源/媒介(sessionSourceMedium)", "sessionSourceMedium"),
    ("landing_pages_7d", "滚动7日", "着陆页(landingPage)", "landingPage"),
    ("pages_7d", "滚动7日", "页面(pagePath)", "pagePath"),
    ("devices_7d", "滚动7日", "设备(deviceCategory)", "deviceCategory"),
    ("sources_7d", "滚动7日", "来源(sessionSource)", "sessionSource"),
]


def data_day(payload: dict) -> str:
    g = payload.get("ga4_daily") or {}
    p = g.get("period") or {}
    return p.get("yesterday") or payload.get("fetched_at") or ""


def load_daily_files() -> list[dict]:
    by_day: dict[str, dict] = {}
    for p in sorted(METRICS_DIR.glob("daily-*.json")):
        if p.name == "daily-latest.json":
            continue
        if not re.match(r"daily-\d{4}-\d{2}-\d{2}\.json$", p.name):
            continue
        try:
            payload = json.loads(p.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            continue
        day = data_day(payload)
        if not day:
            continue
        prev = by_day.get(day)
        if not prev or (payload.get("fetched_at") or "") >= (prev.get("fetched_at") or ""):
            by_day[day] = payload
    return [by_day[k] for k in sorted(by_day)]


def _row_metrics(r: dict) -> list:
    return [
        md.cell(r.get("active_users")),
        md.cell(r.get("new_users")),
        md.cell(r.get("sessions")),
        md.cell(r.get("engaged_sessions")),
        md.cell(r.get("pageviews")),
        md.cell(r.get("engagement_rate")),
        md.cell(r.get("avg_session_sec")),
    ]


def summary_rows(days: list[dict]) -> list[list]:
    rows = [cols.DAILY_SUMMARY]
    for d in days:
        g = d.get("ga4_daily") or {}
        gs28 = d.get("gsc_28d") or {}
        gs7 = d.get("gsc_7d") or {}
        period = g.get("period") or {}
        y = md.summary_fields(g.get("yesterday") if not g.get("error") else None)
        db = md.summary_fields(g.get("day_before") if not g.get("error") else None)
        l7 = md.summary_fields(g.get("last_7d") if not g.get("error") else None)
        ch = g.get("channels_7d") or []
        countries = g.get("countries_7d") or []
        au, as_, bot = md.partition_countries(countries)

        g28 = md.gsc_fields(gs28 if not gs28.get("error") else None)
        g7 = md.gsc_fields(gs7 if not gs7.get("error") else None)

        rows.append(
            [
                data_day(d),
                d.get("fetched_at", ""),
                md.cell(g.get("property_id")),
                md.cell(y.get("active_users")),
                md.cell(y.get("new_users")),
                md.cell(y.get("sessions")),
                md.cell(y.get("engaged_sessions")),
                md.cell(y.get("pageviews")),
                md.cell(y.get("engagement_rate")),
                md.cell(y.get("avg_session_sec")),
                md.cell(wow_pct(y.get("active_users"), db.get("active_users")) if y and db else ""),
                md.cell(wow_pct(y.get("sessions"), db.get("sessions")) if y and db else ""),
                md.cell(wow_pct(y.get("pageviews"), db.get("pageviews")) if y and db else ""),
                md.cell(period.get("last_7d_start")),
                md.cell(period.get("last_7d_end")),
                md.cell(l7.get("active_users")),
                md.cell(l7.get("new_users")),
                md.cell(l7.get("sessions")),
                md.cell(l7.get("engaged_sessions")),
                md.cell(l7.get("pageviews")),
                md.cell(l7.get("engagement_rate")),
                md.cell(l7.get("avg_session_sec")),
                md.cell(channel_metric(ch, "Organic Search")),
                md.cell(channel_metric(ch, "Organic Search", "sessions")),
                md.cell(channel_metric(ch, "Direct")),
                md.cell(channel_metric(ch, "Direct", "sessions")),
                md.cell(channel_metric(ch, "Referral")),
                md.cell(channel_metric(ch, "Referral", "sessions")),
                md.cell(channel_metric(ch, "AI Assistant")),
                md.cell(channel_metric(ch, "Unassigned")),
                md.cell(au),
                md.cell(as_),
                md.cell(bot),
                md.cell(g28.get("period_start")),
                md.cell(g28.get("period_end")),
                md.cell(g28.get("impressions")),
                md.cell(g28.get("clicks")),
                md.cell(g28.get("ctr")),
                md.cell(g28.get("position")),
                md.cell(g7.get("period_start")),
                md.cell(g7.get("period_end")),
                md.cell(g7.get("impressions")),
                md.cell(g7.get("clicks")),
                md.cell(g7.get("ctr")),
                md.cell(g7.get("position")),
                md.cell(g.get("error") or ""),
                md.cell(gs28.get("error") or gs7.get("error") or ""),
            ]
        )
    return rows


def dim_detail_rows(days: list[dict]) -> list[list]:
    rows = [cols.DAILY_DIM]
    for d in days:
        day = data_day(d)
        fetched = d.get("fetched_at", "")
        g = d.get("ga4_daily") or {}
        if g.get("error"):
            continue
        for key, window, dim_type, dim_field in DIM_SPECS:
            for r in g.get(key) or []:
                rows.append(
                    [day, fetched, window, dim_type, r.get(dim_field) or r.get("dimension") or ""]
                    + _row_metrics(r)
                )
    return rows


def country_channel_rows(days: list[dict], key: str) -> list[list]:
    headers = [
        "[元数据] 数据日",
        "[元数据] 拉取日",
        "[维度] 统计窗口",
        "[维度] 国家",
        "[维度] 渠道",
        "[GA4] 活跃用户",
        "[GA4] 会话数",
        "[GA4] 互动率%",
        "[GA4] 平均会话时长(秒)",
    ]
    window = "单日(昨日)" if "yesterday" in key else "滚动7日"
    rows = [headers]
    for d in days:
        g = d.get("ga4_daily") or {}
        if g.get("error"):
            continue
        for r in g.get(key) or []:
            rows.append(
                [
                    data_day(d),
                    d.get("fetched_at", ""),
                    window,
                    r.get("country", ""),
                    r.get("sessionDefaultChannelGroup", ""),
                    md.cell(r.get("active_users")),
                    md.cell(r.get("sessions")),
                    md.cell(r.get("engagement_rate")),
                    md.cell(r.get("avg_session_sec")),
                ]
            )
    return rows


def gsc_query_rows(days: list[dict]) -> list[list]:
    rows = [cols.DAILY_GSC_QUERY]
    for d in days:
        for label, block in (("滚动28日", d.get("gsc_28d")), ("滚动7日", d.get("gsc_7d"))):
            gs = block or {}
            if gs.get("error"):
                continue
            win = f"{(gs.get('period') or {}).get('start', '')}~{(gs.get('period') or {}).get('end', '')}"
            for q in gs.get("top_queries") or []:
                rows.append(
                    [
                        data_day(d),
                        d.get("fetched_at", ""),
                        win or label,
                        q.get("query", ""),
                        md.cell(q.get("impressions")),
                        md.cell(q.get("clicks")),
                        md.cell(q.get("ctr")),
                        md.cell(q.get("position")),
                    ]
                )
    return rows


def gsc_page_rows(days: list[dict]) -> list[list]:
    rows = [cols.DAILY_GSC_PAGE]
    for d in days:
        for label, block in (("滚动28日", d.get("gsc_28d")), ("滚动7日", d.get("gsc_7d"))):
            gs = block or {}
            if gs.get("error"):
                continue
            win = f"{(gs.get('period') or {}).get('start', '')}~{(gs.get('period') or {}).get('end', '')}"
            for q in gs.get("top_pages") or []:
                rows.append(
                    [
                        data_day(d),
                        d.get("fetched_at", ""),
                        win or label,
                        q.get("page", ""),
                        md.cell(q.get("impressions")),
                        md.cell(q.get("clicks")),
                        md.cell(q.get("ctr")),
                    ]
                )
    return rows


def merge_country_channel(days: list[dict]) -> list[list]:
    cc = country_channel_rows(days, "country_channel_yesterday")
    cc7 = country_channel_rows(days, "country_channel_7d")
    return cc + cc7[1:]


def sync_all(token: str, spreadsheet_token: str, days: list[dict]) -> None:
    builders = {
        "日报汇总": lambda: summary_rows(days),
        "日报-维度明细": lambda: dim_detail_rows(days),
        "日报-国家×渠道": lambda: merge_country_channel(days),
        "日报-GSC查询词": lambda: gsc_query_rows(days),
        "日报-GSC页面": lambda: gsc_page_rows(days),
    }
    for title in SHEETS:
        fu.ensure_sheet_tab(token, spreadsheet_token, title)
        fu.write_range(token, spreadsheet_token, title, builders[title]())


def sync_sheet() -> int:
    if not fu.cfg("FEISHU_APP_ID") or not fu.cfg("FEISHU_APP_SECRET"):
        print("ℹ 未配置飞书 App，跳过（见 docs/seo/FEISHU_SETUP.md）")
        return 0

    days = load_daily_files()
    if not days:
        print("⚠ 无 daily-YYYY-MM-DD.json，跳过飞书日报表")
        return 0

    token = fu.tenant_token()
    try:
        ss_token, meta, folder = fu.resolve_spreadsheet_token()
    except RuntimeError as e:
        print(f"ℹ {e}")
        return 0

    if not ss_token:
        if not folder:
            print("ℹ 未配置 FEISHU_FOLDER_TOKEN，跳过飞书表格")
            return 0
        ss_token, url = fu.create_spreadsheet(token, "YakuBus SEO 数据", folder)
        meta = {"spreadsheet_token": ss_token, "url": url, "title": "YakuBus SEO 数据"}
        fu.save_sheet_meta(meta)
        print(f"✓ 首次自动创建表格: {url}")
    else:
        url = meta.get("url") or f"https://feishu.cn/sheets/{ss_token}"

    sync_all(token, ss_token, days)
    print(f"✓ 已更新日报表（{len(days)} 天）: {url}")
    return 0


def main() -> int:
    cmd = sys.argv[1] if len(sys.argv) > 1 else "sync"
    if cmd in ("init", "sync"):
        return sync_sheet()
    print("用法: seo_feishu_daily_sheet.py sync", file=sys.stderr)
    return 1


if __name__ == "__main__":
    sys.exit(main())
