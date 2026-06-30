#!/usr/bin/env python3
"""常用区间：x 对齐 PDF 列 vs findTrips 班次审查。

用法:
  python3 scripts/audit_presets.py
  python3 scripts/audit_presets.py --json
"""

from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

from lib.catalog import CENTRAL_EAST_NOS, CENTRAL_WEST_NOS, no_to_id  # noqa: E402
from lib.pdf_align import load_pdf_words, parse_side_x  # noqa: E402

DAY_TYPES = ("weekday", "saturday", "sunday_holiday")
TIME_RE = re.compile(r"^\d{1,2}:\d{2}$")

# 宫之浦港出发、西行（永田/大川方向）的常用终点
WEST_PRESETS = [
    ("miyanoura_port", "airport"),
    ("miyanoura_port", "anbo_port"),
    ("miyanoura_port", "anbo"),
    ("miyanoura_port", "yakusugi_museum"),
    ("miyanoura_port", "shiratani"),
    ("miyanoura_port", "onokaido"),
    ("miyanoura_port", "okawa_falls"),
]


def parse_minutes(t: str) -> int:
    h, m = t.split(":")
    return int(h) * 60 + int(m)


def norm_pair(dep: str, arr: str) -> tuple[int, int]:
    return parse_minutes(dep), parse_minutes(arr)


def pdf_pairs(
    trips: list[dict], stops: list[str], fid: str, tid: str, day: str
) -> list[tuple[int, int]]:
    fi, ti = stops.index(fid), stops.index(tid)
    if fi >= ti:
        return []
    out: list[tuple[int, int]] = []
    for trip in trips:
        if day not in trip.get("days", []):
            continue
        dep = trip.get("times", {}).get(fid)
        arr = trip.get("times", {}).get(tid)
        if not dep or not arr or not TIME_RE.match(dep) or not TIME_RE.match(arr):
            continue
        if parse_minutes(arr) <= parse_minutes(dep):
            continue
        out.append(norm_pair(dep, arr))
    return sorted(set(out))


def node_find_trips(fid: str, tid: str, day: str) -> list[tuple[int, int]]:
    script = ROOT / "scripts" / "check_route.js"
    out = subprocess.check_output(
        ["node", str(script), fid, tid, day],
        cwd=ROOT,
        text=True,
    )
    pairs: list[tuple[int, int]] = []
    for line in out.splitlines()[1:]:
        if "matsubanda" in line:
            continue
        m = re.match(r"(\d{1,2}:\d{2}) -> (\d{1,2}:\d{2})", line)
        if m:
            pairs.append(norm_pair(m.group(1), m.group(2)))
    return sorted(set(pairs))


def audit(data: dict, west_trips: list[dict]) -> dict:
    west_ids = [no_to_id(n) for n in CENTRAL_WEST_NOS if no_to_id(n)]
    presets = list(WEST_PRESETS)
    for p in data.get("presets", []):
        pair = (p["from"], p["to"])
        if pair not in presets and p["from"] in west_ids and p["to"] in west_ids:
            presets.append(pair)

    mismatches = []
    summary = []
    day_notes = []

    for fid, tid in presets:
        if fid not in west_ids or tid not in west_ids:
            continue
        if west_ids.index(fid) >= west_ids.index(tid):
            continue
        by_day_pdf: dict[str, int] = {}
        by_day_find: dict[str, int] = {}
        for day in DAY_TYPES:
            pdf = pdf_pairs(west_trips, west_ids, fid, tid, day)
            find = node_find_trips(fid, tid, day)
            by_day_pdf[day] = len(pdf)
            by_day_find[day] = len(find)
            only_pdf = sorted(set(pdf) - set(find))
            only_find = sorted(set(find) - set(pdf))
            if only_pdf or only_find:
                def fmt(m: int) -> str:
                    return f"{m // 60}:{m % 60:02d}"

                mismatches.append(
                    {
                        "from": fid,
                        "to": tid,
                        "day": day,
                        "pdf": len(pdf),
                        "findTrips": len(find),
                        "onlyPdf": [f"{fmt(a)}->{fmt(b)}" for a, b in only_pdf],
                        "onlyFind": [f"{fmt(a)}->{fmt(b)}" for a, b in only_find],
                    }
                )
        total_pdf = sum(by_day_pdf.values())
        summary.append(
            {
                "from": fid,
                "to": tid,
                "weekday": by_day_pdf["weekday"],
                "saturday": by_day_pdf["saturday"],
                "sunday_holiday": by_day_pdf["sunday_holiday"],
                "totalPdf": total_pdf,
                "findWeekday": by_day_find["weekday"],
            }
        )
        wk = by_day_pdf["weekday"]
        if wk and (by_day_pdf["saturday"] > wk or by_day_pdf["sunday_holiday"] > wk):
            day_notes.append(
                {
                    "from": fid,
                    "to": tid,
                    "note": "土日班次多于平日，请核对 PDF 日种分区",
                    "counts": by_day_pdf,
                }
            )

    return {
        "summary": summary,
        "mismatches": mismatches,
        "dayAnomalies": day_notes,
    }


def load_data() -> dict:
    raw = (ROOT / "data.js").read_text(encoding="utf-8")
    start = raw.index("{")
    end = raw.rindex("}") + 1
    return json.loads(raw[start:end])


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--json", action="store_true")
    args = ap.parse_args()

    pdf_path = ROOT / "assets" / "pdf" / "taneyakubus-timetable-20260301.pdf"
    if not pdf_path.exists():
        pdf_path = ROOT / "assets" / "taneyakubus-timetable-20260301.pdf"
    words = load_pdf_words(pdf_path)
    west_trips = parse_side_x(words, "west")
    report = audit(load_data(), west_trips)

    if args.json:
        print(json.dumps(report, ensure_ascii=False, indent=2))
    else:
        print("=== 常用区间 PDF(x对齐) 班次 / 日种 ===")
        for s in report["summary"]:
            print(
                f"  {s['from']}→{s['to']}: "
                f"平日{s['weekday']} 土{s['saturday']} 日祝{s['sunday_holiday']} "
                f"(全周{s['totalPdf']}) find平日={s['findWeekday']}"
            )
        print(f"\n=== findTrips 与 PDF 不一致: {len(report['mismatches'])} ===")
        for m in report["mismatches"]:
            print(
                f"  {m['from']}→{m['to']} {m['day']}: pdf={m['pdf']} find={m['findTrips']} "
                f"+pdf{m['onlyPdf']} +find{m['onlyFind']}"
            )
        if report["dayAnomalies"]:
            print(f"\n=== 日种异常: {len(report['dayAnomalies'])} ===")
            for n in report["dayAnomalies"]:
                print(f"  {n}")
        elif not report["mismatches"]:
            print("\n日种说明: 土/日祝少于平日属正常（PDF 列按平日10+土2+日祝2 分区）")

    return 1 if report["mismatches"] else 0


if __name__ == "__main__":
    raise SystemExit(main())
