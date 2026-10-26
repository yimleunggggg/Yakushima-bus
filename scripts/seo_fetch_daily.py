#!/usr/bin/env python3
"""拉 GA4 昨日/7日 + GSC 28天，写入 docs/seo/metrics/daily-YYYY-MM-DD.json"""
from __future__ import annotations

import json
import os
import sys
from datetime import date, timedelta, datetime
from zoneinfo import ZoneInfo
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(Path(__file__).resolve().parent))

import seo_fetch_metrics as m  # noqa: E402
import seo_oauth_util  # noqa: E402

METRICS_DIR = ROOT / "docs" / "seo" / "metrics"

GA4_METRICS = [
    "activeUsers",
    "newUsers",
    "sessions",
    "engagedSessions",
    "engagementRate",
    "averageSessionDuration",
    "screenPageViews",
]

METRIC_ALIASES = {
    "activeUsers": "active_users",
    "newUsers": "new_users",
    "sessions": "sessions",
    "engagedSessions": "engaged_sessions",
    "engagementRate": "engagement_rate",
    "averageSessionDuration": "avg_session_sec",
    "screenPageViews": "pageviews",
}


def _parse_metrics(row) -> dict:
    rec: dict = {}
    for i, name in enumerate(GA4_METRICS):
        raw = row.metric_values[i].value if i < len(row.metric_values) else "0"
        alias = METRIC_ALIASES[name]
        if name in ("engagementRate",):
            rec[alias] = round(float(raw or 0) * 100, 1)
        elif name in ("averageSessionDuration",):
            rec[alias] = round(float(raw or 0), 1)
        else:
            rec[alias] = int(raw or 0)
    return rec


def ga4_report(
    client,
    prop: str,
    start: str,
    end: str,
    dims: list[str] | None = None,
    limit: int = 10,
):
    from google.analytics.data_v1beta.types import (
        DateRange,
        Dimension,
        Metric,
        RunReportRequest,
        OrderBy,
    )

    dims = dims or []
    req = RunReportRequest(
        property=prop,
        date_ranges=[DateRange(start_date=start, end_date=end)],
        dimensions=[Dimension(name=d) for d in dims],
        metrics=[Metric(name=n) for n in GA4_METRICS],
        limit=limit,
        order_bys=[OrderBy(metric=OrderBy.MetricOrderBy(metric_name="sessions"),desc=True)] if dims else [],
    )
    resp = client.run_report(req, timeout=35)
    rows = []
    for row in resp.rows:
        rec = _parse_metrics(row)
        for i, dname in enumerate(dims):
            rec[dname] = row.dimension_values[i].value
        if len(dims) == 1:
            rec["dimension"] = row.dimension_values[0].value
        rows.append(rec)
    if not dims and rows:
        return rows[0]
    if not dims:
        return {METRIC_ALIASES[n]: (0.0 if n == "engagementRate" else 0) for n in GA4_METRICS}
    return rows


def fetch_ga4_daily(credentials, property_id: str) -> dict:
    from google.analytics.data_v1beta import BetaAnalyticsDataClient

    out = {"property_id": property_id, "error": None}
    if not property_id:
        out["error"] = "未设置 GA4_PROPERTY_ID（GA4 管理→属性设置里的数字 ID，不是 G-xxx）"
        return out
    prop = f"properties/{property_id}"
    try:
        client = BetaAnalyticsDataClient(credentials=credentials, transport="rest")
        from google.analytics.data_v1beta.types import RunReportRequest, DateRange, Metric
        probe = client.run_report(RunReportRequest(property=prop, date_ranges=[DateRange(start_date="yesterday", end_date="yesterday")], metrics=[Metric(name="activeUsers")]), timeout=35)
        from seo_daily_observations import complete_windows
        out["timezone"] = probe.metadata.time_zone
        end, before, start, previous_start = complete_windows(out["timezone"])
        yday, day_before, wk_start = str(end), str(before), str(start)
        previous_end = str(start-timedelta(days=1))
        out["previous_7d"] = ga4_report(client,prop,str(previous_start),previous_end)
        out["channels_previous_7d"] = ga4_report(client,prop,str(previous_start),previous_end,dims=["sessionDefaultChannelGroup"],limit=15)
        from google.analytics.data_v1beta.types import Dimension
        try:
            response=client.run_report(RunReportRequest(property=prop,date_ranges=[DateRange(start_date=yday,end_date=yday)],dimensions=[Dimension(name="eventName")],metrics=[Metric(name="eventCount")],limit=100), timeout=35)
            out["events_yesterday"]=[{"event_name":r.dimension_values[0].value,"event_count":int(r.metric_values[0].value)} for r in response.rows]
        except Exception as e:
            out["events_error"]=type(e).__name__

        out["yesterday"] = ga4_report(client, prop, yday, yday)
        out["day_before"] = ga4_report(client, prop, day_before, day_before)
        out["last_7d"] = ga4_report(client, prop, wk_start, yday)

        dim_specs = [
            ("channels_yesterday", yday, yday, ["sessionDefaultChannelGroup"], 15),
            ("countries_yesterday", yday, yday, ["country"], 20),
            ("source_medium_yesterday", yday, yday, ["sessionSourceMedium"], 15),
            ("landing_pages_yesterday", yday, yday, ["landingPage"], 15),
            ("pages_yesterday", yday, yday, ["pagePath"], 15),
            ("devices_yesterday", yday, yday, ["deviceCategory"], 5),
            ("country_channel_yesterday", yday, yday, ["country", "sessionDefaultChannelGroup"], 30),
            ("channels_7d", wk_start, yday, ["sessionDefaultChannelGroup"], 15),
            ("sources_7d", wk_start, yday, ["sessionSource"], 15),
            ("source_medium_7d", wk_start, yday, ["sessionSourceMedium"], 15),
            ("landing_pages_7d", wk_start, yday, ["landingPage"], 15),
            ("pages_7d", wk_start, yday, ["pagePath"], 15),
            ("countries_7d", wk_start, yday, ["country"], 20),
            ("devices_7d", wk_start, yday, ["deviceCategory"], 5),
            ("country_channel_7d", wk_start, yday, ["country", "sessionDefaultChannelGroup"], 30),
        ]
        for key, start, end, dims, limit in dim_specs:
            out[key] = ga4_report(client, prop, start, end, dims=dims, limit=limit)

        out["period"] = {
            "yesterday": yday,
            "previous_7d": str(previous_start)+"~"+previous_end,
            "day_before": day_before,
            "last_7d_start": wk_start,
            "last_7d_end": yday,
            "last_7d": f"{wk_start}~{yday}",
        }
    except Exception as e:
        out["error"] = str(e)
    return out


def delta_pct(cur: int, prev: int) -> str:
    if prev == 0:
        return "—" if cur == 0 else "+∞"
    return f"{((cur - prev) / prev) * 100:+.0f}%"


def main() -> int:
    METRICS_DIR.mkdir(parents=True, exist_ok=True)
    today = datetime.now(ZoneInfo("Asia/Shanghai")).date().isoformat()
    out_file = METRICS_DIR / f"daily-{today}.json"

    sa, err = m.load_service_account_credentials()
    if err:
        print(f"⚠ {err}", file=sys.stderr)
        return 1

    gsc_creds, gsc_err, gsc_via = m.load_gsc_credentials()
    site = os.environ.get("GSC_SITE_URL", "https://yakushimabus.com/")
    ga4_id = os.environ.get("GA4_PROPERTY_ID", "538426834").strip()

    seo_oauth_util.oauth_preflight_log()
    print(f"GSC auth: {gsc_via or 'none'}")

    payload = {"fetched_at":today,"fetched_at_iso":datetime.now(ZoneInfo("Asia/Shanghai")).isoformat(),
               "ga4_daily":fetch_ga4_daily(sa,ga4_id)}
    from seo_daily_observations import fetch_gsc_windows, enrich
    if gsc_creds:
        try: payload.update(fetch_gsc_windows(gsc_creds,site))
        except Exception as e:
            payload.update({key:{"error":type(e).__name__} for key in ["gsc_7d","gsc_28d"]})
    else:
        payload.update({key:{"error":gsc_err or "GSC授权不可用"} for key in ["gsc_7d","gsc_28d"]})
    enrich(payload)

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
            f"会话 {y['sessions']} · PV {y.get('pageviews', 0)}"
        )
        ch = g.get("channels_7d") or []
        if ch:
            print("  渠道7d:", ", ".join(f"{r.get('dimension')}({r.get('sessions')})" for r in ch[:4]))
        src = g.get("source_medium_7d") or []
        if src:
            print("  来源7d:", ", ".join(f"{r.get('dimension')}({r.get('sessions')})" for r in src[:3]))
    gs = payload["gsc_28d"]
    if gs.get("error"):
        print(f"⚠ GSC: {gs['error']}", file=sys.stderr)
    else:
        print(f"✓ GSC 28d: 展示 {gs.get('impressions', 0)} 点击 {gs.get('clicks', 0)}")

    print(f"✓ 已写入 {out_file.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
