#!/usr/bin/env python3
"""Add en/zh names & descriptions to sources/poi/spots.json via Google Translate."""

from __future__ import annotations

import json
import re
import time
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "sources" / "poi" / "spots.json"
UA = "Yakushima-bus-poi-enrich/1.0 (+https://yakushimabus.com)"


def translate(text: str, target: str, source: str = "ja") -> str:
    if not text or not text.strip():
        return ""
    q = urllib.parse.urlencode(
        {
            "client": "gtx",
            "sl": source,
            "tl": target,
            "dt": "t",
            "q": text[:500],
        }
    )
    url = f"https://translate.googleapis.com/translate_a/single?{q}"
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=25) as r:
        data = json.loads(r.read().decode("utf-8"))
    parts = [chunk[0] for chunk in data[0] if chunk[0]]
    return "".join(parts).strip()


def main() -> None:
    data = json.loads(SRC.read_text(encoding="utf-8"))
    spots = data.get("spots", [])
    updated = 0
    for i, spot in enumerate(spots):
        name_ja = spot.get("name", {}).get("ja", "")
        desc_ja = spot.get("desc", {}).get("ja", "")
        if not name_ja:
            continue
        need_name = spot.get("name", {}).get("en") == name_ja or not spot.get("name", {}).get("en")
        need_desc = desc_ja and (
            spot.get("desc", {}).get("en") == desc_ja or not spot.get("desc", {}).get("en")
        )
        if not need_name and not need_desc:
            continue
        print(f"[{i + 1}/{len(spots)}] {name_ja[:40]}")
        try:
            if need_name:
                spot.setdefault("name", {})["en"] = translate(name_ja, "en")
                spot["name"]["zh"] = translate(name_ja, "zh-CN")
            if need_desc:
                spot.setdefault("desc", {})["en"] = translate(desc_ja, "en")
                spot["desc"]["zh"] = translate(desc_ja, "zh-CN")
            updated += 1
        except Exception as e:
            print(f"  skip: {e}")
        time.sleep(0.25)
    data["meta"]["updatedAt"] = time.strftime("%Y-%m-%d")
    SRC.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"enriched {updated} spots → {SRC}")


if __name__ == "__main__":
    main()
