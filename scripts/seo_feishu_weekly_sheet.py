#!/usr/bin/env python3
"""将 weekly-*.json 同步到飞书电子表格（长期周维度看板）。"""
from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
METRICS_DIR = ROOT / "docs" / "seo" / "metrics"

sys.path.insert(0, str(Path(__file__).resolve().parent))
import seo_feishu_util as fu  # noqa: E402

SHEETS = [
    "周报汇总",
    "渠道",
    "国家",
    "国家×渠道",
    "来源媒介",
    "着陆页",
    "设备",
    "GSC查询词",
    "GSC页面",
]

SUMMARY_HEADERS = [
    "周次",
    "起始日",
    "结束日",
    "拉取日",
    "GA4用户",
    "GA4新用户",
    "GA4会话",
    "GA4 PV",
    "互动率%",
    "均时(s)",
    "可分析用户",
    "可分析会话",
    "噪声用户",
    "Organic用户",
    "Organic会话",
    "Direct用户",
    "Direct会话",
    "AI用户",
    "Referral用户",
    "GSC展示",
    "GSC点击",
    "GSC CTR%",
    "GSC排名",
    "用户WoW%",
    "可分析WoW%",
    "Organic WoW%",
    "GSC点击WoW%",
    "GSC展示WoW%",
]


def load_weekly_files() -> list[dict]:
    files = sorted(METRICS_DIR.glob("weekly-*.json"))
    out = []
    for p in files:
        if p.name == "weekly-latest.json":
            continue
        try:
            out.append(json.loads(p.read_text(encoding="utf-8")))
        except json.JSONDecodeError:
            continue
    out.sort(key=lambda x: x.get("week") or "")
    return out


def summary_rows(weeks: list[dict]) -> list[list]:
    rows = [SUMMARY_HEADERS]
    for w in weeks:
        g = w.get("ga4") or {}
        s = g.get("summary") or {}
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
                d.get("raw_users", s.get("active_users", "")),
                s.get("new_users", ""),
                d.get("raw_sessions", s.get("sessions", "")),
                d.get("pageviews", s.get("pageviews", "")),
                d.get("engagement_rate", s.get("engagement_rate", "")),
                d.get("avg_session_sec", s.get("avg_session_sec", "")),
                d.get("analyzable_users", ""),
                d.get("analyzable_sessions", ""),
                d.get("bot_users", ""),
                d.get("organic_users", ""),
                d.get("organic_sessions", ""),
                d.get("direct_users", ""),
                d.get("direct_sessions", ""),
                d.get("ai_users", ""),
                d.get("referral_users", ""),
                gs.get("impressions", ""),
                gs.get("clicks", ""),
                gs.get("ctr", ""),
                gs.get("position", ""),
                wow.get("users", ""),
                wow.get("analyzable_users", ""),
                wow.get("organic_users", ""),
                wow.get("gsc_clicks", ""),
                wow.get("gsc_impressions", ""),
            ]
        )
    return rows


def dim_rows(weeks: list[dict], key: str, dim_field: str, dim_label: str = "维度") -> list[list]:
    rows = [["周次", "起始日", "结束日", dim_label, "用户", "会话", "PV", "互动率%", "均时(s)"]]
    for w in weeks:
        p = w.get("period") or {}
        for r in w.get("ga4", {}).get(key) or []:
            rows.append(
                [
                    w.get("week", ""),
                    p.get("start", ""),
                    p.get("end", ""),
                    r.get(dim_field) or r.get("dimension") or "",
                    r.get("active_users", ""),
                    r.get("sessions", ""),
                    r.get("pageviews", ""),
                    r.get("engagement_rate", ""),
                    r.get("avg_session_sec", ""),
                ]
            )
    return rows


def gsc_query_rows(weeks: list[dict]) -> list[list]:
    rows = [["周次", "起始日", "结束日", "查询词", "展示", "点击", "排名"]]
    for w in weeks:
        p = w.get("period") or {}
        for q in (w.get("gsc") or {}).get("top_queries") or []:
            rows.append(
                [
                    w.get("week", ""),
                    p.get("start", ""),
                    p.get("end", ""),
                    q.get("query", ""),
                    q.get("impressions", ""),
                    q.get("clicks", ""),
                    q.get("position", ""),
                ]
            )
    return rows


def gsc_page_rows(weeks: list[dict]) -> list[list]:
    rows = [["周次", "起始日", "结束日", "页面", "展示", "点击"]]
    for w in weeks:
        p = w.get("period") or {}
        for q in (w.get("gsc") or {}).get("top_pages") or []:
            rows.append(
                [
                    w.get("week", ""),
                    p.get("start", ""),
                    p.get("end", ""),
                    q.get("page", ""),
                    q.get("impressions", ""),
                    q.get("clicks", ""),
                ]
            )
    return rows


def country_channel_rows(weeks: list[dict]) -> list[list]:
    rows = [["周次", "起始日", "结束日", "国家", "渠道", "用户", "会话", "互动率%", "均时(s)"]]
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
                    r.get("active_users", ""),
                    r.get("sessions", ""),
                    r.get("engagement_rate", ""),
                    r.get("avg_session_sec", ""),
                ]
            )
    return rows


def sync_all(token: str, spreadsheet_token: str, weeks: list[dict]) -> None:
    builders = {
        "周报汇总": lambda: summary_rows(weeks),
        "渠道": lambda: dim_rows(weeks, "channels", "sessionDefaultChannelGroup", "渠道"),
        "国家": lambda: dim_rows(weeks, "countries", "country", "国家"),
        "国家×渠道": country_channel_rows,
        "来源媒介": lambda: dim_rows(weeks, "source_medium", "sessionSourceMedium", "来源/媒介"),
        "着陆页": lambda: dim_rows(weeks, "landing_pages", "landingPage", "着陆页"),
        "设备": lambda: dim_rows(weeks, "devices", "deviceCategory", "设备"),
        "GSC查询词": gsc_query_rows,
        "GSC页面": gsc_page_rows,
    }
    for title in SHEETS:
        fu.ensure_sheet_tab(token, spreadsheet_token, title)
        fu.write_range(token, spreadsheet_token, title, builders[title]())


def _sync_to_sheet(allow_create: bool) -> int:
    if not fu.cfg("FEISHU_APP_ID") or not fu.cfg("FEISHU_APP_SECRET"):
        print("ℹ 未配置飞书 App，跳过（见 docs/seo/FEISHU_SETUP.md）")
        return 0

    weeks = load_weekly_files()
    if not weeks:
        print("⚠ 无 weekly-*.json，请先运行 seo_fetch_weekly.py")
        return 1

    token = fu.tenant_token()
    try:
        ss_token, meta, folder = fu.resolve_spreadsheet_token(allow_create=allow_create)
    except RuntimeError as e:
        print(f"ℹ {e}")
        return 0

    if not ss_token:
        ss_token, url = fu.create_spreadsheet(token, "YakuBus SEO 周报", folder or "")
        meta = {"spreadsheet_token": ss_token, "url": url, "title": "YakuBus SEO 周报"}
        fu.save_sheet_meta(meta)
        print(f"✓ 首次创建表格（仅此一次）: {url}")
        print("  → 请把 token 写入 FEISHU_SHEET_TOKEN，并 commit docs/seo/feishu-sheet.json")
    else:
        url = meta.get("url") or f"https://feishu.cn/sheets/{ss_token}"

    sync_all(token, ss_token, weeks)
    print(f"✓ 已更新同一张表格（{len(weeks)} 周数据）: {url}")
    return 0


def main() -> int:
    cmd = sys.argv[1] if len(sys.argv) > 1 else "sync"
    if cmd == "init":
        return _sync_to_sheet(allow_create=True)
    if cmd == "sync":
        return _sync_to_sheet(allow_create=False)
    print("用法: seo_feishu_weekly_sheet.py init|sync", file=sys.stderr)
    print("  init — 仅首次：创建表格并写入 token", file=sys.stderr)
    print("  sync — 每周：更新已有表格，绝不新建", file=sys.stderr)
    return 1


if __name__ == "__main__":
    sys.exit(main())
