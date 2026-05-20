#!/usr/bin/env python3
"""用 PyMuPDF 探测 PDF 时刻列 x 坐标，校验 day_columns 手工映射。

日种表头（平日/土曜/日祝）在 PDF 中不可提取为文本（疑为图形），
故以参考站时刻列的 x 坐标聚类来推断列数。
"""

from __future__ import annotations

import json
import re
import sys
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

from lib.day_columns import CENTRAL_SPLITS, REF_STOP, column_day_types  # noqa: E402

MANIFEST = json.loads((ROOT / "sources" / "manifest.json").read_text(encoding="utf-8"))
PDF = ROOT / MANIFEST["sources"]["taneyaku"]["file"]
TIME_RE = re.compile(r"^\d{1,2}:\d{2}$")


def load_words(page):
    import fitz

    return page.get_text("words")


def cluster_x(xs: list[float], tol: float = 8.0) -> list[float]:
    if not xs:
        return []
    xs = sorted(xs)
    clusters: list[list[float]] = [[xs[0]]]
    for x in xs[1:]:
        if x - clusters[-1][-1] <= tol:
            clusters[-1].append(x)
        else:
            clusters.append([x])
    return [sum(c) / len(c) for c in clusters]


def row_times_for_stop(words, stop_no: str) -> list[tuple[float, float, str]]:
    """取指定站号行上的时刻及其 x 坐标（整行解析，不按页宽切半）。"""
    by_y: dict[int, list] = defaultdict(list)
    for w in words:
        by_y[int(round(w[1]))].append(w)

    for y in sorted(by_y.keys()):
        row = sorted(by_y[y], key=lambda w: w[0])
        texts = [w[4].strip() for w in row]
        if stop_no not in texts:
            continue
        idx = texts.index(stop_no)
        times = []
        for w in row[idx + 1 :]:
            t = w[4].strip()
            if t.isdigit() and len(t) <= 3:
                break
            if TIME_RE.match(t):
                times.append((w[0], w[1], t))
            elif t in ("||", "⛴"):
                continue
        if times:
            return times
    return []


def probe_side(words, side: str) -> dict:
    ref = REF_STOP[side]
    times = row_times_for_stop(words, ref)
    xs = [t[0] for t in times]
    clusters = cluster_x(xs)
    w, sat, sun = CENTRAL_SPLITS[side]
    expected = w + sat + sun
    day_map = column_day_types(side, len(clusters))
    east_ref = REF_STOP["east"]
    east_times = row_times_for_stop(words, east_ref) if side == "west" else []
    if side == "west" and east_times:
        east_x = east_times[0][0]
        times = [t for t in times if t[0] < east_x - 5]
        xs = [t[0] for t in times]
        clusters = cluster_x(xs)
        day_map = column_day_types(side, len(clusters))
    return {
        "side": side,
        "refStop": ref,
        "timeLabels": [t[2] for t in times],
        "columnCount": len(clusters),
        "xCenters": [round(x, 1) for x in clusters],
        "expectedColumns": expected,
        "split": {"weekday": w, "saturday": sat, "sunday_holiday": sun},
        "dayMap": day_map,
        "match": len(clusters) == expected,
    }


def search_day_labels(doc) -> list[str]:
    """PDF 全文搜索日种关键字（通常找不到）。"""
    found = []
    for i, page in enumerate(doc):
        text = page.get_text()
        for kw in ("平日", "土曜", "日祝", "日・祝"):
            if kw in text:
                found.append(f"p{i + 1}:{kw}")
    return found


def main() -> int:
    try:
        import fitz
    except ImportError:
        print("ERROR: pip install pymupdf", file=sys.stderr)
        return 1

    if not PDF.exists():
        print(f"ERROR: missing {PDF}", file=sys.stderr)
        return 1

    doc = fitz.open(PDF)
    page = doc[0]
    words = load_words(page)
    report = {
        "pdf": str(PDF.name),
        "pageSize": [round(page.rect.width, 1), round(page.rect.height, 1)],
        "wordCount": len(words),
        "dayLabelsInText": search_day_labels(doc),
        "note": "平日/土曜/日祝 若 dayLabelsInText 为空，表头为图形不可 OCR，列日种仍靠 day_columns.py",
        "sides": [probe_side(words, s) for s in ("west", "east")],
    }

    print(json.dumps(report, ensure_ascii=False, indent=2))

    ok = all(s["match"] for s in report["sides"])
    return 0 if ok else 2


if __name__ == "__main__":
    raise SystemExit(main())
