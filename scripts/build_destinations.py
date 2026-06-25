#!/usr/bin/env python3
"""sources/destinations.json → map-destinations-data.js"""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "sources" / "destinations.json"
OUT = ROOT / "map-destinations-data.js"


def main() -> None:
    data = json.loads(SRC.read_text(encoding="utf-8"))
    OUT.write_text(
        "/** 主景区↔公交 — sources/destinations.json · scripts/build_destinations.py */\n"
        f"const DESTINATIONS_DATA = {json.dumps(data, ensure_ascii=False, indent=2)};\n",
        encoding="utf-8",
    )
    print(f"→ {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
