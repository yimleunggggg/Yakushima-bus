#!/usr/bin/env python3
"""从 x 对齐 PDF 列统计站间耗时，供审查与 META_DATA.segmentBounds。"""

from __future__ import annotations

import json
import sys
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

from lib.catalog import CENTRAL_WEST_NOS, no_to_id  # noqa: E402
from lib.pdf_align import load_pdf_words, parse_side_x  # noqa: E402

PDF = ROOT / "assets" / "pdf" / "taneyakubus-timetable-20260301.pdf"
OUT = ROOT / "sources" / "segment-stats.json"
ABS_MAX = 120


def parse_minutes(t: str) -> int:
    h, m = t.split(":")
    return int(h) * 60 + int(m)


def build_stats() -> dict:
    words = load_pdf_words(PDF)
    west = parse_side_x(words, "west")
    ids = [no_to_id(n) for n in CENTRAL_WEST_NOS if no_to_id(n)]

    seg_samples: dict[str, list[int]] = defaultdict(list)
    full_durs: list[int] = []
    global_max = 0
    global_max_pair: tuple[str, str, int] | None = None

    for trip in west:
        times = trip.get("times", {})
        ordered = [(i, sid, times[sid]) for i, sid in enumerate(ids) if sid in times]
        if len(ordered) < 2:
            continue
        dep_m = parse_minutes(ordered[0][2])
        arr_m = parse_minutes(ordered[-1][2])
        if arr_m > dep_m:
            full_durs.append(arr_m - dep_m)
        for j in range(len(ordered) - 1):
            fi, a, ta = ordered[j]
            ti, b, tb = ordered[j + 1]
            da, db = parse_minutes(ta), parse_minutes(tb)
            if db <= da:
                continue
            dur = db - da
            key = f"{a}|{b}"
            seg_samples[key].append(dur)
            if dur > global_max:
                global_max = dur
                global_max_pair = (a, b, dur)

    adjacent: dict[str, dict] = {}
    for key, durs in seg_samples.items():
        adjacent[key] = {
            "min": min(durs),
            "max": max(durs),
            "samples": len(durs),
        }

    clusters_path = ROOT / "sources" / "stop-search-clusters.json"
    clusters_raw = json.loads(clusters_path.read_text(encoding="utf-8"))

    return {
        "absMaxMinutes": ABS_MAX,
        "pdfWestGlobalMaxSegment": global_max,
        "pdfWestGlobalMaxSegmentPair": (
            {"from": global_max_pair[0], "to": global_max_pair[1], "minutes": global_max_pair[2]}
            if global_max_pair
            else None
        ),
        "pdfWestMaxFullTrip": max(full_durs) if full_durs else 0,
        "adjacent": adjacent,
        "stopSearchClusters": clusters_raw,
    }


def main() -> int:
    stats = build_stats()
    OUT.write_text(json.dumps(stats, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(
        f"→ {OUT.name} pdfMaxSeg={stats['pdfWestGlobalMaxSegment']}m "
        f"fullTrip={stats['pdfWestMaxFullTrip']}m pairs={len(stats['adjacent'])}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
