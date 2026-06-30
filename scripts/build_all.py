#!/usr/bin/env python3
"""
统一构建入口。

  python3 scripts/build_all.py          # 全部
  python3 scripts/build_all.py --timetable
  python3 scripts/build_all.py --map
  python3 scripts/build_all.py --validate
"""

from __future__ import annotations

import argparse
import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

MANIFEST = ROOT / "sources" / "manifest.json"
OVERRIDES = ROOT / "sources" / "overrides"


def load_manifest() -> dict:
    return json.loads(MANIFEST.read_text(encoding="utf-8"))


def run_timetable():
    subprocess.check_call([sys.executable, str(ROOT / "scripts" / "parse_pdf.py")], cwd=ROOT)


def run_map():
    subprocess.check_call([sys.executable, str(ROOT / "scripts" / "build_map_data.py")], cwd=ROOT)


def validate():
    from lib.fare_table import build_exact_pairs, validate_pairs
    from lib.overrides import merge_fare_pairs

    pairs = build_exact_pairs()
    pairs = merge_fare_pairs(pairs, OVERRIDES)
    errors = validate_pairs(pairs)
    if errors:
        print("FARE VALIDATION FAILED:")
        for e in errors:
            print(" ", e)
        sys.exit(1)
    print(f"fare anchors OK ({len(pairs)//2} symmetric pairs)")

    from build_meta_data import validate as validate_meta

    validate_meta()


def validate_timetable():
    subprocess.check_call([sys.executable, str(ROOT / "scripts" / "build_segment_stats.py")], cwd=ROOT)
    subprocess.check_call([sys.executable, str(ROOT / "scripts" / "build_meta_data.py")], cwd=ROOT)
    for script in ("audit_pdf_trips.py", "audit_presets.py", "audit_segment_bounds.py"):
        r = subprocess.run(
            [sys.executable, str(ROOT / "scripts" / script)],
            cwd=ROOT,
        )
        if r.returncode != 0:
            sys.exit(r.returncode)
    print("timetable audit OK")


def run_meta():
    subprocess.check_call([sys.executable, str(ROOT / "scripts" / "build_meta_data.py")], cwd=ROOT)


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--timetable", action="store_true")
    p.add_argument("--map", action="store_true")
    p.add_argument("--access", action="store_true")
    p.add_argument("--meta", action="store_true")
    p.add_argument("--validate", action="store_true")
    args = p.parse_args()
    all_ = not (args.timetable or args.map or args.validate or args.access or args.meta)

    if args.validate or all_:
        validate()
    if args.meta or all_:
        print("→ meta-data.js")
        run_meta()
    if args.timetable or all_:
        print("→ data.js")
        run_timetable()
        if args.validate or all_:
            validate_timetable()
    elif args.validate:
        validate_timetable()
    if args.map or all_:
        print("→ map-data.js")
        run_map()
        print("→ bus-stops-geo.js")
        subprocess.check_call([sys.executable, str(ROOT / "scripts" / "build_stop_geo.py")], cwd=ROOT)
    if args.access or all_:
        print("→ access-data.js")
        subprocess.check_call([sys.executable, str(ROOT / "scripts" / "build_access_data.py")], cwd=ROOT)
    print("done")


if __name__ == "__main__":
    main()
