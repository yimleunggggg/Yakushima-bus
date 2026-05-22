#!/usr/bin/env python3
"""拉 GA4 昨日/7日 + GSC 28天，写入 docs/seo/metrics/daily-YYYY-MM-DD.json"""
from __future__ import annotations

import json
import os
import sys
from datetime import date, timedelta
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(Path(__file__).resolve().parent))

import seo_fetch_metrics as m  # noqa: E402
import seo_oauth_util  # noqa: E402

METRICS_DIR = ROOT / "docs" / "seo" / "metrics"


def ga4_report(client, prop: str, start: str, end: str, dims=None, limit=10):
    from google.analytics.data_v1beta.types import (
        DateRange,
        Dimension,
        Metric,
        RunReportRequest,
    )

    dims = dims or []
    req = RunReportRequest(
        property=prop,
        date_ranges=[DateRange(start_date=start, end_date=end)],
        dimensions=[Dimension(name=d) for d in dims],
        metrics=[
            Metric(name="activeUsers"),
            Metric(name="newUsers"),
            Metric(name="sessions"),
            Metric(name="engagementRate"),
            Metric(name="averageSessionDuration"),
        ],
        limit=limit,
    )
    resp = client.run_report(req)
    rows = []
    for row in resp.rows:
        rec = {
            "active_users": int(row.metric_values[0].value or 0),
            "new_users": int(row.metric_values[1].value or 0),
            "sessions": int(row.metric_values[2].value or 0),
            "engagement_rate": round(float(row.metric_values[3].value or 0) * 100, 1),
            "avg_session_sec": round(float(row.metric_values[4].value or 0), 1),
        }
        if dims:
            rec["dimension"] = row.dimension_values[0].value
        rows.append(rec)
    if not dims and rows:
        return rows[0]
    if not dims:
        return {
            "active_users": 0,
            "new_users": 0,
            "sessions": 0,
            "engagement_rate": 0.0,
            "avg_session_sec": 0.0,
        }
    return rows


def fetch_ga4_daily(credentials, property_id: str) -> dict:
    from google.analytics.data_v1beta import BetaAnalyticsDataClient

    out = {"property_id": property_id, "error": None}
    if not property_id:
        out["error"] = "未设置 GA4_PROPERTY_ID"
        return out
    prop = f"properties/{property_id}"
    try:
        client = BetaAnalyticsDataClient(credentials=credentials)
        yday = (date.today() - timedelta(days=1)).isoformat()
        day_before = (date.today() - timedelta(days=2)).isoformat()
        wk_start = (date.today() - timedelta(days=7)).isoformat()

        out["yesterday"] = ga4_report(client, prop, yday, yday)
        out["day_before"] = ga4_report(client, prop, day_before, day_before)
        out["last_7d"] = ga4_report(client, prop, wk_start, yday)
        out["channels_7d"] = ga4_report(
            client, prop, wk_start, yday, dims=["sessionDefaultChannelGroup"], limit=8
        )
        out["landing_pages_7d"] = ga4_report(
            client, prop, wk_start, yday, dims=["landingPage"], limit=8
        )
        out["countries_7d"] = ga4_report(
            client, prop, wk_start, yday, dims=["country"], limit=5
        )
        out["devices_7d"] = ga4_report(
            client, prop, wk_start, yday, dims=["deviceCategory"], limit=3
        )
        out["period"] = {"yesterday": yday, "last_7d": f"{wk_start}~{yday}"}
    except Exception as e:
        out["error"] = str(e)
    return out


def delta_pct(cur: int, prev: int) -> str:
    if prev == 0:
        return "—" if cur == 0 else "+∞"
    return f"{((cur - prev) / prev) * 100:+.0f}%"


def main() -> int:
    METRICS_DIR.mkdir(parents=True, exist_ok=True)
    today = date.today().isoformat()
    out_file = METRICS_DIR / f"daily-{today}.json"

    sa, err = m.load_service_account_credentials()
    if err:
        print(f"⚠ {err}", file=sys.stderr)
        return 1

    gsc_creds, gsc_err, gsc_via = m.load_gsc_credentials()
    site = os.environ.get("GSC_SITE_URL", "https://yakushimabus.com/")
    ga4_id = os.environ.get("GA4_PROPERTY_ID", "").strip()

    seo_oauth_util.oauth_preflight_log()
    print(f"GSC auth: {gsc_via or 'none'}")

    payload = {
        "fetched_at": today,
        "ga4_daily": fetch_ga4_daily(sa, ga4_id),
        "gsc_28d": m.fetch_gsc(gsc_creds, site) if gsc_creds else {"error": gsc_err},
    }

    out_file.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    (METRICS_DIR / "daily-latest.json").write_text(
        out_file.read_text(encoding="utf-8"), encoding="utf-8"
    )

    g = payload["ga4_daily"]
    if g.get("error"):
        print(f"⚠ GA4 daily: {g['error']}", file=sys.stderr)
    else:
        y = g["yesterday"]
        db = g["day_before"]
        print(
            f"✓ GA4 昨日 {g['period']['yesterday']}: "
            f"用户 {y['active_users']} ({delta_pct(y['active_users'], db['active_users'])}) · "
            f"会话 {y['sessions']}"
        )
    gs = payload["gsc_28d"]
    if gs.get("error"):
        print(f"⚠ GSC: {gs['error']}", file=sys.stderr)
    else:
        print(f"✓ GSC 28d: 展示 {gs.get('impressions', 0)} 点击 {gs.get('clicks', 0)}")

    print(f"✓ 已写入 {out_file.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
