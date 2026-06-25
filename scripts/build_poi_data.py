#!/usr/bin/env python3
"""sources/poi/spots.json → poi-data.js"""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "sources" / "poi" / "spots.json"
OUT = ROOT / "poi-data.js"


def main() -> None:
    data = json.loads(SRC.read_text(encoding="utf-8"))
    OUT.write_text(
        "/** 便利ガイド POI — sources/poi/spots.json · scripts/build_poi_data.py */\n"
        f"window.POI_DATA = {json.dumps(data, ensure_ascii=False, indent=2)};\n",
        encoding="utf-8",
    )
    n = len(data.get("spots", []))
    print(f"→ {OUT.relative_to(ROOT)} ({n} spots)")


if __name__ == "__main__":
    main()
