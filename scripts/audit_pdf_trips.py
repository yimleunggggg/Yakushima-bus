#!/usr/bin/env python3
"""全量核对 PDF 时刻列 vs data.js（含搜索可达性）。

用法:
  python3 scripts/audit_pdf_trips.py          # 审计当前 data.js
  python3 scripts/audit_pdf_trips.py --rebuild  # 先 parse_pdf 再审计
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

from lib.catalog import no_to_id  # noqa: E402
from lib.day_columns import REF_STOP  # noqa: E402
from parse_pdf import (  # noqa: E402
    build_data,
    extract_pdf_text,
    parse_row_line,
    parse_times,
)

TIME_RE = re.compile(r"^\d{1,2}:\d{2}$")
DAY_TYPES = ("weekday", "saturday", "sunday_holiday")


def parse_minutes(t: str) -> int:
    h, m = t.split(":")
    return int(h) * 60 + int(m)


def pdf_rows_by_side(text: str) -> dict[str, dict[str, list[str | None]]]:
    """PDF 文本：每侧每站号 → 时刻列（含 None 占位）。"""
    out: dict[str, dict[str, list[str | None]]] = {"west": {}, "east": {}}
    for line in text.splitlines():
        west, east = parse_row_line(line)
        for side, chunk in (("west", west), ("east", east)):
            if not chunk:
                continue
            no, raw = chunk
            times = parse_times(raw)
            prev = out[side].get(no)
            if prev is None or len(times) > len(prev):
                out[side][no] = times
    return out


def pdf_column_stats(text: str) -> list[dict]:
    rows = pdf_rows_by_side(text)
    stats = []
    for side in ("west", "east"):
        side_rows = rows[side]
        ref = REF_STOP[side]
        ref_n = len(side_rows.get(ref, []))
        max_n = max((len(t) for t in side_rows.values()), default=0)
        longer = sum(1 for t in side_rows.values() if len(t) > ref_n)
        stats.append(
            {
                "side": side,
                "refStop": ref,
                "refColumns": ref_n,
                "maxColumns": max_n,
                "stopsLongerThanRef": longer,
            }
        )
    return stats


def resolve_trip_segment(trip: dict, stops: list[str], fi: int, ti: int) -> bool:
    if fi == ti:
        return False
    dep = trip["times"].get(stops[fi])
    if not dep or not TIME_RE.match(dep):
        return False
    dep_m = parse_minutes(dep)
    step = 1 if fi < ti else -1
    last_m = dep_m
    last_idx = fi
    for i in range(fi + step, ti + step, step):
        raw = trip["times"].get(stops[i])
        if not raw or not TIME_RE.match(raw):
            continue
        m = parse_minutes(raw)
        if m < last_m:
            continue
        last_m = m
        last_idx = i
    return last_idx == ti and last_m > dep_m


def resolve_column_segment(trip: dict, stops: list[str], fi: int, ti: int) -> bool:
    if fi == ti:
        return False
    dep = trip["times"].get(stops[fi])
    arr = trip["times"].get(stops[ti])
    if not dep or not arr or not TIME_RE.match(dep) or not TIME_RE.match(arr):
        return False
    dep_m, arr_m = parse_minutes(dep), parse_minutes(arr)
    return arr_m > dep_m and arr_m - dep_m <= 240


def find_segments(
    trips: list[dict],
    stops: list[str],
    fi: int,
    ti: int,
    day: str,
    mode: str,
) -> list[str]:
    found = []
    for trip in trips:
        if trip.get("suspended") or day not in trip.get("days", []):
            continue
        ok = (
            resolve_trip_segment(trip, stops, fi, ti)
            if mode == "fragment"
            else resolve_column_segment(trip, stops, fi, ti)
        )
        if ok:
            dep = trip["times"][stops[fi]]
            found.append(dep)
    return sorted(set(found), key=parse_minutes)


def expected_column_segments(
    trips: list[dict], stops: list[str], fi: int, ti: int, day: str
) -> list[str]:
    """PDF 整列：同列起终点有时刻且 arr>dep。"""
    return find_segments(trips, stops, fi, ti, day, "column")


def audit_search_matrix(data: dict) -> list[dict]:
    """相邻站区间：fragment vs columnTrips 班次差。"""
    issues = []
    for route in data["routes"]:
        for direction in route.get("directions", []):
            stops = direction["stops"]
            cols = direction.get("columnTrips") or direction.get("trips") or []
            frags = direction.get("trips") or []
            if not cols:
                continue
            for day in DAY_TYPES:
                for i in range(len(stops) - 1):
                    fi, ti = i, i + 1
                    exp = expected_column_segments(cols, stops, fi, ti, day)
                    if not exp:
                        continue
                    frag = find_segments(frags, stops, fi, ti, day, "fragment")
                    col = find_segments(cols, stops, fi, ti, day, "column")
                    missing_frag = sorted(set(exp) - set(frag), key=parse_minutes)
                    missing_col = sorted(set(exp) - set(col), key=parse_minutes)
                    if missing_frag or missing_col:
                        issues.append(
                            {
                                "route": route["id"],
                                "dir": direction["id"],
                                "from": stops[fi],
                                "to": stops[ti],
                                "day": day,
                                "pdfCols": len(exp),
                                "fragment": len(frag),
                                "columnSearch": len(col),
                                "missingFragment": missing_frag,
                                "missingColumn": missing_col,
                            }
                        )
    return issues


def audit_column_counts(data: dict, text: str) -> list[dict]:
    rows = pdf_rows_by_side(text)
    gaps = []
    for route in data["routes"]:
        if route["id"] != "central":
            continue
        for direction in route["directions"]:
            side = direction["id"]
            side_rows = rows.get(side, {})
            ref = REF_STOP[side]
            max_n = max((len(t) for t in side_rows.values()), default=0)
            cols = direction.get("columnTrips") or []
            if len(cols) < max_n:
                gaps.append(
                    {
                        "side": side,
                        "pdfMaxColumns": max_n,
                        "dataColumns": len(cols),
                        "lostColumns": max_n - len(cols),
                    }
                )
    return gaps


def audit_stop_departures(data: dict, text: str) -> list[dict]:
    """每站 PDF 列中的发车时刻 vs columnTrips 是否一致。"""
    rows = pdf_rows_by_side(text)
    mismatches = []
    central = next(r for r in data["routes"] if r["id"] == "central")
    for direction in central["directions"]:
        side = direction["id"]
        side_rows = rows[side]
        stops = direction["stops"]
        cols = direction.get("columnTrips") or []
        # 站号 → sid
        sid_by_no = {no: no_to_id(no) for no in side_rows}
        for stop_no, pdf_times in side_rows.items():
            sid = sid_by_no.get(stop_no)
            if not sid or sid not in stops:
                continue
            si = stops.index(sid)
            for day in DAY_TYPES:
                pdf_deps = []
                for col_i, raw in enumerate(pdf_times):
                    if not raw or not TIME_RE.match(raw):
                        continue
                    if col_i >= len(cols):
                        continue
                    trip = cols[col_i]
                    if day not in trip.get("days", []):
                        continue
                    pdf_deps.append(raw)
                data_deps = sorted(
                    {
                        t["times"][sid]
                        for t in cols
                        if day in t.get("days", [])
                        and TIME_RE.match(t["times"].get(sid) or "")
                    },
                    key=parse_minutes,
                )
                pdf_deps_u = sorted(set(pdf_deps), key=parse_minutes)
                if pdf_deps_u != data_deps:
                    only_pdf = sorted(set(pdf_deps_u) - set(data_deps), key=parse_minutes)
                    only_data = sorted(set(data_deps) - set(pdf_deps_u), key=parse_minutes)
                    if only_pdf or only_data:
                        mismatches.append(
                            {
                                "side": side,
                                "stop": sid,
                                "day": day,
                                "onlyPdf": only_pdf,
                                "onlyData": only_data,
                            }
                        )
    return mismatches


def summarize_routes(data: dict) -> list[dict]:
    out = []
    for route in data["routes"]:
        for direction in route.get("directions", []):
            cols = direction.get("columnTrips") or []
            frags = direction.get("trips") or []
            by_day = defaultdict(int)
            for t in cols:
                for d in t.get("days", []):
                    by_day[d] += 1
            out.append(
                {
                    "route": route["id"],
                    "dir": direction["id"],
                    "columnTrips": len(cols),
                    "fragments": len(frags),
                    "colsByDay": dict(by_day),
                }
            )
    return out


def load_data(rebuild: bool) -> dict:
    if rebuild:
        return build_data()
    raw = (ROOT / "data.js").read_text(encoding="utf-8")
    start = raw.index("{")
    end = raw.rindex("}") + 1
    return json.loads(raw[start:end])


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--rebuild", action="store_true")
    ap.add_argument("--json", action="store_true")
    args = ap.parse_args()

    pdf_path = ROOT / "assets/taneyaku-20260301.pdf"
    text = extract_pdf_text(pdf_path) if pdf_path.exists() else ""
    data = load_data(args.rebuild)

    report = {
        "pdfColumnStats": pdf_column_stats(text),
        "routeSummary": summarize_routes(data),
        "columnCountGaps": audit_column_counts(data, text),
        "stopDepartureMismatches": audit_stop_departures(data, text),
        "searchGaps": audit_search_matrix(data),
    }

    gaps = report["searchGaps"]
    frag_only = [g for g in gaps if g["missingFragment"] and not g["missingColumn"]]
    col_broken = [g for g in gaps if g["missingColumn"]]

    if args.json:
        print(json.dumps(report, ensure_ascii=False, indent=2))
    else:
        print("=== PDF 列数（参考站 vs 全表最大）===")
        for s in report["pdfColumnStats"]:
            print(
                f"  {s['side']}: ref({s['refStop']})={s['refColumns']} "
                f"max={s['maxColumns']} 超长行={s['stopsLongerThanRef']}"
            )
        print("\n=== 路线 columnTrips / fragments ===")
        for r in report["routeSummary"]:
            print(
                f"  {r['route']}/{r['dir']}: cols={r['columnTrips']} "
                f"frags={r['fragments']} byDay={r['colsByDay']}"
            )
        print(f"\n=== 列数缺口: {len(report['columnCountGaps'])} ===")
        for g in report["columnCountGaps"]:
            print(f"  {g}")
        print(f"\n=== 站点时刻不一致: {len(report['stopDepartureMismatches'])} ===")
        for m in report["stopDepartureMismatches"][:15]:
            print(f"  {m['side']} {m['stop']} {m['day']}: pdf+{m['onlyPdf']} data+{m['onlyData']}")
        if len(report["stopDepartureMismatches"]) > 15:
            print(f"  ... +{len(report['stopDepartureMismatches']) - 15} more")
        print(f"\n=== 搜索缺口: {len(gaps)} 区间×日种 ===")
        print(f"  仅 fragment 丢班（column 已覆盖）: {len(frag_only)}")
        print(f"  column 仍缺: {len(col_broken)}")
        for g in sorted(col_broken, key=lambda x: (-len(x['missingColumn']), x['route']))[:20]:
            print(
                f"  {g['route']}/{g['dir']} {g['from']}→{g['to']} {g['day']}: "
                f"pdf={g['pdfCols']} col={g['columnSearch']} missing={g['missingColumn']}"
            )

    failed = bool(report["columnCountGaps"] or report["stopDepartureMismatches"] or col_broken)
    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main())
