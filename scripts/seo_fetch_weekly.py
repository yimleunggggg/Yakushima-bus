#!/usr/bin/env python3
"""拉 GA4 + GSC 日历周数据，写入 docs/seo/metrics/weekly-YYYY-Www.json"""
from __future__ import annotations

import argparse
import json
import os
import sys
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(Path(__file__).resolve().parent))

import seo_fetch_metrics as m  # noqa: E402
import seo_metrics_derive as md  # noqa: E402
import seo_oauth_util  # noqa: E402
from seo_fetch_daily import ga4_report  # noqa: E402
from seo_week_util import iso_week_label, last_complete_iso_week, prev_iso_week, week_bounds, wow_pct  # noqa: E402

METRICS_DIR = ROOT / "docs" / "seo" / "metrics"


def fetch_gsc_range(credentials, site_url: str, start: str, end: str) -> dict:
    from googleapiclient.discovery import build

    out = {
        "site_url": site_url,
        "impressions": 0,
        "clicks": 0,
        "ctr": 0.0,
        "position": 0.0,
        "top_queries": [],
        "top_pages": [],
        "error": None,
        "period": {"start": start, "end": end},
    }
    try:
        svc = build("searchconsole", "v1", credentials=credentials, cache_discovery=False)
        agg = (
            svc.searchanalytics()
            .query(
                siteUrl=site_url,
                body={"startDate": start, "endDate": end, "rowLimit": 1},
            )
            .execute()
        )
        rows = agg.get("rows") or []
        if rows:
            r = rows[0]
            out["impressions"] = int(r.get("impressions", 0))
            out["clicks"] = int(r.get("clicks", 0))
            out["ctr"] = round(float(r.get("ctr", 0)) * 100, 2)
            out["position"] = round(float(r.get("position", 0)), 1)

        for dim, key, limit in (
            (["query"], "top_queries", 20),
            (["page"], "top_pages", 15),
            (["country"], "by_country", 15),
            (["device"], "by_device", 5),
        ):
            qrows = (
                svc.searchanalytics()
                .query(
                    siteUrl=site_url,
                    body={
                        "startDate": start,
                        "endDate": end,
                        "dimensions": dim,
                        "rowLimit": limit,
                    },
                )
                .execute()
                .get("rows")
                or []
            )
            if dim == ["query"]:
                out[key] = [
                    {
                        "query": r["keys"][0],
                        "clicks": int(r.get("clicks", 0)),
                        "impressions": int(r.get("impressions", 0)),
                        "ctr": round(float(r.get("ctr", 0)) * 100, 2),
                        "position": round(float(r.get("position", 0)), 1),
                    }
                    for r in qrows
                ]
            elif dim == ["page"]:
                out[key] = [
                    {
                        "page": r["keys"][0],
                        "clicks": int(r.get("clicks", 0)),
                        "impressions": int(r.get("impressions", 0)),
                        "ctr": round(float(r.get("ctr", 0)) * 100, 2),
                    }
                    for r in qrows
                ]
            else:
                out[key] = [
                    {
                        "dimension": r["keys"][0],
                        "clicks": int(r.get("clicks", 0)),
                        "impressions": int(r.get("impressions", 0)),
                        "ctr": round(float(r.get("ctr", 0)) * 100, 2),
                    }
                    for r in qrows
                ]
    except Exception as e:
        out["error"] = str(e)
    return out


def channel_metric(rows: list[dict], name: str, field: str = "active_users") -> int | None:
    r = md.channel_row(rows, name)
    if not r:
        return None
    v = r.get(field)
    return int(v) if v is not None else None


def fetch_ga4_week(credentials, property_id: str, start: str, end: str) -> dict:
    from google.analytics.data_v1beta import BetaAnalyticsDataClient

    out = {"property_id": property_id, "error": None, "period": {"start": start, "end": end}}
    if not property_id:
        out["error"] = "未设置 GA4_PROPERTY_ID"
        return out
    prop = f"properties/{property_id}"
    try:
        client = BetaAnalyticsDataClient(credentials=credentials)
        out["summary"] = ga4_report(client, prop, start, end)
        specs = [
            ("channels", ["sessionDefaultChannelGroup"], 15),
            ("sources", ["sessionSource"], 15),
            ("source_medium", ["sessionSourceMedium"], 15),
            ("landing_pages", ["landingPage"], 15),
            ("pages", ["pagePath"], 15),
            ("countries", ["country"], 20),
            ("devices", ["deviceCategory"], 5),
            ("country_channel", ["country", "sessionDefaultChannelGroup"], 40),
        ]
        for key, dims, limit in specs:
            out[key] = ga4_report(client, prop, start, end, dims=dims, limit=limit)
    except Exception as e:
        out["error"] = str(e)
    return out


def derive_metrics(ga4: dict) -> dict:
    countries = ga4.get("countries") or []
    analyzable_u, analyzable_s, bot_u = md.partition_countries(countries)
    channels = ga4.get("channels") or []
    summary = ga4.get("summary") if not ga4.get("error") else None
    base = md.summary_fields(summary)
    return {
        **base,
        "analyzable_users": analyzable_u,
        "analyzable_sessions": analyzable_s,
        "bot_users": bot_u,
        "organic_users": channel_metric(channels, "Organic Search"),
        "organic_sessions": channel_metric(channels, "Organic Search", "sessions"),
        "direct_users": channel_metric(channels, "Direct"),
        "direct_sessions": channel_metric(channels, "Direct", "sessions"),
        "referral_users": channel_metric(channels, "Referral"),
        "referral_sessions": channel_metric(channels, "Referral", "sessions"),
        "ai_users": channel_metric(channels, "AI Assistant"),
        "unassigned_users": channel_metric(channels, "Unassigned"),
        "raw_users": base.get("active_users"),
        "new_users": base.get("new_users"),
        "raw_sessions": base.get("sessions"),
        "pageviews": base.get("pageviews"),
        "engagement_rate": base.get("engagement_rate"),
        "avg_session_sec": base.get("avg_session_sec"),
        "engaged_sessions": base.get("engaged_sessions"),
    }


def build_week_payload(iso_week: str, ga4_id: str, site: str) -> dict:
    start_d, end_d = week_bounds(iso_week)
    start, end = start_d.isoformat(), end_d.isoformat()

    sa, sa_err = m.load_service_account_credentials()
    gsc_creds, gsc_err, gsc_via = m.load_gsc_credentials()

    payload = {
        "week": iso_week,
        "period": {"start": start, "end": end},
        "fetched_at": date.today().isoformat(),
        "ga4": {"error": sa_err},
        "gsc": {"error": gsc_err or "OAuth 未配置"},
        "derived": {},
        "wow": {},
    }

    if sa:
        ga4 = fetch_ga4_week(sa, ga4_id, start, end)
        payload["ga4"] = ga4
        if not ga4.get("error"):
            payload["derived"] = derive_metrics(ga4)
    else:
        payload["ga4"] = {"error": sa_err}

    if gsc_creds:
        payload["gsc"] = fetch_gsc_range(gsc_creds, site, start, end)
        payload["gsc"]["auth"] = gsc_via
    else:
        payload["gsc"] = {"error": gsc_err, "period": {"start": start, "end": end}}

    prev_file = METRICS_DIR / f"weekly-{prev_iso_week(iso_week)}.json"
    if prev_file.is_file():
        prev = json.loads(prev_file.read_text(encoding="utf-8"))
        pd = prev.get("derived") or {}
        cd = payload.get("derived") or {}
        gs = payload.get("gsc") or {}
        pgs = prev.get("gsc") or {}
        payload["wow"] = {
            "users": wow_pct(cd.get("raw_users"), pd.get("raw_users")),
            "analyzable_users": wow_pct(cd.get("analyzable_users"), pd.get("analyzable_users")),
            "organic_users": wow_pct(cd.get("organic_users"), pd.get("organic_users")),
            "sessions": wow_pct(cd.get("raw_sessions"), pd.get("raw_sessions")),
            "pageviews": wow_pct(cd.get("pageviews"), pd.get("pageviews")),
            "gsc_clicks": wow_pct(gs.get("clicks"), pgs.get("clicks")),
            "gsc_impressions": wow_pct(gs.get("impressions"), pgs.get("impressions")),
        }

    return payload


def save_week(payload: dict) -> Path:
    METRICS_DIR.mkdir(parents=True, exist_ok=True)
    path = METRICS_DIR / f"weekly-{payload['week']}.json"
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    latest = METRICS_DIR / "weekly-latest.json"
    latest.write_text(path.read_text(encoding="utf-8"), encoding="utf-8")
    return path


def weeks_to_backfill(count: int, ref: date | None = None) -> list[str]:
    cur = last_complete_iso_week(ref)
    out = [cur]
    for _ in range(count - 1):
        cur = prev_iso_week(cur)
        out.append(cur)
    return list(reversed(out))


def main() -> int:
    ap = argparse.ArgumentParser(description="拉取 GA4/GSC 日历周指标")
    ap.add_argument("--week", help="ISO 周次，如 2026-W25；默认上一完整周")
    ap.add_argument("--backfill", type=int, metavar="N", help="回填最近 N 个完整周")
    args = ap.parse_args()

    ga4_id = os.environ.get("GA4_PROPERTY_ID", "538426834").strip()
    site = os.environ.get("GSC_SITE_URL", "https://yakushimabus.com/")

    seo_oauth_util.oauth_preflight_log()

    targets = weeks_to_backfill(args.backfill) if args.backfill else [args.week or last_complete_iso_week()]

    rc = 0
    for iso_week in targets:
        print(f"=== {iso_week} ({week_bounds(iso_week)[0]} ~ {week_bounds(iso_week)[1]}) ===")
        payload = build_week_payload(iso_week, ga4_id, site)
        path = save_week(payload)
        g = payload["ga4"]
        gs = payload["gsc"]
        d = payload.get("derived") or {}
        if g.get("error"):
            print(f"⚠ GA4: {g['error']}", file=sys.stderr)
            rc = 1
        else:
            print(
                f"✓ GA4: 用户 {d.get('raw_users')} (可分析 {d.get('analyzable_users')}) · "
                f"Organic {d.get('organic_users')} · 会话 {d.get('raw_sessions')} · PV {d.get('pageviews')}"
            )
        if gs.get("error"):
            print(f"⚠ GSC: {gs['error']}", file=sys.stderr)
        else:
            print(f"✓ GSC: 展示 {gs.get('impressions', 0)} · 点击 {gs.get('clicks', 0)}")
        wow = payload.get("wow") or {}
        if wow:
            print(f"  WoW: 用户 {wow.get('users')} · Organic {wow.get('organic_users')} · GSC点击 {wow.get('gsc_clicks')}")
        print(f"✓ 已写入 {path.relative_to(ROOT)}")

    return rc


if __name__ == "__main__":
    sys.exit(main())
