#!/usr/bin/env python3
"""从 GSC + GA4 拉取 28 天指标，写入 latest.json 并更新 TRACKING.md 表格。"""
from __future__ import annotations

import json
import os
import re
import sys
from datetime import date, timedelta
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(Path(__file__).resolve().parent))
import seo_oauth_util  # noqa: E402
METRICS_DIR = ROOT / "docs" / "seo" / "metrics"
METRICS_FILE = METRICS_DIR / "latest.json"
TRACKING_FILE = ROOT / "docs" / "seo" / "TRACKING.md"

SITE_PAGES = [
    "https://yakushimabus.com/",
    "https://yakushimabus.com/map/",
    "https://yakushimabus.com/access/",
    "https://yakushimabus.com/about/",
]

SCOPES = [
    seo_oauth_util.GSC_READONLY,
    "https://www.googleapis.com/auth/analytics.readonly",
]


def creds_path() -> Path | None:
    p = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS")
    if p and Path(p).is_file():
        return Path(p)
    raw = os.environ.get("GOOGLE_SERVICE_ACCOUNT_JSON", "").strip()
    if raw:
        tmp = Path("/tmp/gcp-seo-sa.json")
        tmp.write_text(raw, encoding="utf-8")
        return tmp
    local = ROOT / "secrets" / "google-sa.json"
    if local.is_file():
        return local
    return None


def load_service_account_credentials():
    from google.oauth2 import service_account

    path = creds_path()
    if not path:
        return None, "未找到服务账号：GOOGLE_SERVICE_ACCOUNT_JSON 或 secrets/google-sa.json"
    try:
        return (
            service_account.Credentials.from_service_account_file(
                str(path), scopes=["https://www.googleapis.com/auth/analytics.readonly"]
            ),
            None,
        )
    except Exception as e:
        return None, f"服务账号加载失败: {e}"


def load_gsc_credentials():
    """GSC：优先 OAuth（服务账号邮箱无法加入 GSC）；无 token 时再试 SA。"""
    creds, err = seo_oauth_util.load_user_credentials([seo_oauth_util.GSC_READONLY])
    if creds:
        return creds, None, "oauth"
    sa, sa_err = load_service_account_credentials()
    if sa:
        return sa, None, "service_account"
    return None, err or sa_err, None


def gsc_dates():
    end = date.today() - timedelta(days=3)
    start = end - timedelta(days=27)
    return start.isoformat(), end.isoformat()


def fetch_gsc(credentials, site_url: str) -> dict:
    from googleapiclient.discovery import build

    out = {
        "site_url": site_url,
        "impressions": 0,
        "clicks": 0,
        "ctr": 0.0,
        "position": 0.0,
        "top_queries": [],
        "top_pages": [],
        "index_status": {},
        "error": None,
    }
    start, end = gsc_dates()
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

        qrows = (
            svc.searchanalytics()
            .query(
                siteUrl=site_url,
                body={
                    "startDate": start,
                    "endDate": end,
                    "dimensions": ["query"],
                    "rowLimit": 8,
                },
            )
            .execute()
            .get("rows")
            or []
        )
        out["top_queries"] = [
            {
                "query": r["keys"][0],
                "clicks": int(r.get("clicks", 0)),
                "impressions": int(r.get("impressions", 0)),
            }
            for r in qrows
        ]

        prows = (
            svc.searchanalytics()
            .query(
                siteUrl=site_url,
                body={
                    "startDate": start,
                    "endDate": end,
                    "dimensions": ["page"],
                    "rowLimit": 8,
                },
            )
            .execute()
            .get("rows")
            or []
        )
        out["top_pages"] = [
            {
                "page": r["keys"][0],
                "clicks": int(r.get("clicks", 0)),
                "impressions": int(r.get("impressions", 0)),
            }
            for r in prows
        ]

        insp = svc.urlInspection().index()
        for url in SITE_PAGES:
            try:
                res = insp.inspect(
                    body={"inspectionUrl": url, "siteUrl": site_url}
                ).execute()
                verdict = (
                    res.get("inspectionResult", {})
                    .get("indexStatusResult", {})
                    .get("verdict", "UNKNOWN")
                )
                out["index_status"][url] = verdict
            except Exception as e:
                out["index_status"][url] = f"ERR:{e.__class__.__name__}"

    except Exception as e:
        out["error"] = str(e)
    out["period"] = {"start": start, "end": end}
    return out


def fetch_ga4(credentials, property_id: str) -> dict:
    from google.analytics.data_v1beta import BetaAnalyticsDataClient
    from google.analytics.data_v1beta.types import (
        DateRange,
        Dimension,
        Metric,
        RunReportRequest,
    )

    out = {
        "property_id": property_id,
        "users_28d": None,
        "organic_users_28d": None,
        "sessions_28d": None,
        "error": None,
    }
    if not property_id:
        out["error"] = "未设置 GA4_PROPERTY_ID（GA4 管理→属性设置里的数字 ID，不是 G-xxx）"
        return out
    prop = property_id if property_id.startswith("properties/") else f"properties/{property_id}"
    try:
        client = BetaAnalyticsDataClient(credentials=credentials)
        req = RunReportRequest(
            property=prop,
            date_ranges=[DateRange(start_date="28daysAgo", end_date="yesterday")],
            dimensions=[Dimension(name="sessionDefaultChannelGroup")],
            metrics=[
                Metric(name="activeUsers"),
                Metric(name="sessions"),
            ],
        )
        resp = client.run_report(req)
        total_users = 0
        total_sessions = 0
        organic = 0
        for row in resp.rows:
            channel = row.dimension_values[0].value
            users = int(row.metric_values[0].value)
            sessions = int(row.metric_values[1].value)
            total_users += users
            total_sessions += sessions
            if channel == "Organic Search":
                organic = users
        out["users_28d"] = total_users
        out["sessions_28d"] = total_sessions
        out["organic_users_28d"] = organic
    except Exception as e:
        out["error"] = str(e)
    return out


def indexed_summary(gsc: dict) -> str:
    st = gsc.get("index_status") or {}
    if not st:
        return "—"
    ok = sum(1 for v in st.values() if v == "PASS")
    return f"{ok}/{len(st)}"


def update_tracking_table(payload: dict) -> None:
    if not TRACKING_FILE.is_file():
        return
    gsc = payload.get("gsc") or {}
    ga4 = payload.get("ga4") or {}
    today = payload.get("fetched_at", "")[:10]
    row = (
        f"| {today} "
        f"| {gsc.get('impressions', '—')} "
        f"| {gsc.get('clicks', '—')} "
        f"| {gsc.get('position', '—')} "
        f"| {indexed_summary(gsc)} "
        f"| {ga4.get('users_28d', '—')} "
        f"| {ga4.get('organic_users_28d', '—')} "
        f"| 自动拉取 {today} |"
    )
    text = TRACKING_FILE.read_text(encoding="utf-8")
    if today in text and f"| {today} " in text:
        text = re.sub(
            rf"\| {re.escape(today)} \|[^\n]+\n",
            row + "\n",
            text,
            count=1,
        )
    else:
        text = text.replace(
            "|------|---------|---------|---------|---------|--------------|--------------|------|",
            "|------|---------|---------|---------|---------|--------------|--------------|------|\n" + row,
            1,
        )
    TRACKING_FILE.write_text(text, encoding="utf-8")


def main() -> int:
    METRICS_DIR.mkdir(parents=True, exist_ok=True)
    payload = {
        "fetched_at": date.today().isoformat(),
        "ok": False,
        "gsc": None,
        "ga4": None,
        "setup_hint": str(ROOT / "docs" / "seo" / "GOOGLE_SETUP.md"),
    }

    creds, err = load_service_account_credentials()
    if err:
        payload["error"] = err
        METRICS_FILE.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"⚠ {err}", file=sys.stderr)
        print(f"  → 见 {payload['setup_hint']}")
        return 0

    gsc_creds, gsc_err, gsc_via = load_gsc_credentials()
    site = os.environ.get("GSC_SITE_URL", "https://yakushimabus.com/")
    ga4_id = os.environ.get("GA4_PROPERTY_ID", "").strip()

    print(f"GSC site: {site}")
    print(f"GSC auth: {gsc_via or 'none'}")
    print(f"GA4 property: {ga4_id or '(未设置)'}")

    if gsc_creds:
        gsc = fetch_gsc(gsc_creds, site)
    else:
        gsc = {
            "site_url": site,
            "impressions": 0,
            "clicks": 0,
            "ctr": 0.0,
            "position": 0.0,
            "top_queries": [],
            "top_pages": [],
            "index_status": {},
            "error": gsc_err,
            "period": {"start": gsc_dates()[0], "end": gsc_dates()[1]},
        }
    ga4 = fetch_ga4(creds, ga4_id)

    payload["gsc"] = gsc
    payload["ga4"] = ga4
    payload["ok"] = not gsc.get("error") and (ga4.get("organic_users_28d") is not None or ga4.get("error"))

    if gsc.get("error"):
        print(f"⚠ GSC: {gsc['error']}", file=sys.stderr)
    else:
        print(f"✓ GSC 28d: 展示 {gsc['impressions']} 点击 {gsc['clicks']} 排名 {gsc['position']}")

    if ga4.get("error"):
        print(f"⚠ GA4: {ga4['error']}", file=sys.stderr)
    elif ga4.get("users_28d") is not None:
        print(f"✓ GA4 28d: 用户 {ga4['users_28d']} 自然搜索 {ga4['organic_users_28d']}")

    METRICS_FILE.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    if not gsc.get("error"):
        update_tracking_table(payload)
        print(f"✓ 已更新 {TRACKING_FILE.name} 与 {METRICS_FILE.name}")

    return 0


if __name__ == "__main__":
    sys.exit(main())
