#!/usr/bin/env python3
"""HTTP 探测线上四页是否 200；写入 uptime-latest.json。"""
from __future__ import annotations

import json
import os
import sys
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SITE = os.environ.get("SITE_URL", "https://yakushimabus.com").rstrip("/")
PATHS = ["/", "/map/", "/access/", "/about/"]
OUT = Path(os.environ.get("UPTIME_JSON", ROOT / "docs/seo/metrics/uptime-latest.json"))


def check(url: str) -> int:
    req = urllib.request.Request(url, method="HEAD")
    try:
        with urllib.request.urlopen(req, timeout=25) as resp:
            return resp.status
    except urllib.error.HTTPError as e:
        return e.code
    except Exception:
        try:
            req = urllib.request.Request(url, method="GET")
            with urllib.request.urlopen(req, timeout=25) as resp:
                return resp.status
        except urllib.error.HTTPError as e:
            return e.code
        except Exception:
            return 0


def main() -> int:
    rows = []
    ok = True
    print(f"Site uptime — {SITE}")
    for p in PATHS:
        url = f"{SITE}{p}"
        code = check(url)
        good = code == 200
        ok = ok and good
        mark = "✓" if good else "✗"
        print(f"  {mark} {p} → {code or 'ERR'}")
        rows.append({"path": p, "url": url, "status": code})

    payload = {
        "checked_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "site": SITE,
        "ok": ok,
        "urls": rows,
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    if ok:
        print("All URLs OK.")
        return 0
    print(f"SITE DOWN or partial failure — {OUT}")
    return 1


if __name__ == "__main__":
    sys.exit(main())
