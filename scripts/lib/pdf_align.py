"""PDF 时刻列 x 坐标对齐 — 修复各站行列数不一致导致的错列。"""

from __future__ import annotations

import re
from collections import defaultdict
from pathlib import Path

from lib.catalog import CENTRAL_EAST_NOS, CENTRAL_WEST_NOS, no_to_id
from lib.day_columns import CENTRAL_SPLITS, REF_STOP, column_day_types

TIME_RE = re.compile(r"^\d{1,2}:\d{2}$")

# 列数最全的参考站（用于 x 聚类）
ANCHOR_STOP: dict[str, str] = {"west": "21", "east": "20"}


def aligned_day_types(side: str, ncols: int) -> list[list[str]]:
    """环线 PDF 首列常为松葉等附加班次，日种分区须整体后移一列。"""
    w, sat, sun = CENTRAL_SPLITS[side]
    std = w + sat + sun
    if ncols == std + 1:
        return [["weekday"]] + column_day_types(side, std)
    return column_day_types(side, ncols)


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


def load_pdf_words(pdf_path: Path) -> list:
    import fitz

    return fitz.open(str(pdf_path))[0].get_text("words")


WEST_STOP_X_MAX = 120.0
EAST_STOP_X_MIN = 480.0
EAST_TIME_X_MIN = 570.0


def _east_split_x(words) -> float:
    """西表时刻区与东表站号列之间的分界 x。"""
    return EAST_TIME_X_MIN - 5


def row_times_for_stop(words, stop_no: str) -> list[tuple[float, float, str]]:
    """整行解析（不区分东西），取指定站号后的时刻及 x 坐标。"""
    by_y: dict[int, list] = defaultdict(list)
    for w in words:
        by_y[int(round(w[1]))].append(w)

    for y in sorted(by_y.keys()):
        row = sorted(by_y[y], key=lambda w: w[0])
        texts = [w[4].strip() for w in row]
        if stop_no not in texts:
            continue
        idx = texts.index(stop_no)
        times: list[tuple[float, float, str]] = []
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


def row_times_for_side(words, stop_no: str, side: str) -> list[tuple[float, float, str]]:
    by_y: dict[int, list] = defaultdict(list)
    for w in words:
        by_y[int(round(w[1]))].append(w)

    best: list[tuple[float, float, str]] = []
    for y in sorted(by_y.keys()):
        row = sorted(by_y[y], key=lambda w: w[0])
        if side == "west":
            idx = next(
                (i for i, w in enumerate(row) if w[4].strip() == stop_no and w[0] < WEST_STOP_X_MAX),
                None,
            )
            if idx is None:
                continue
            split = _east_split_x(words)
            times: list[tuple[float, float, str]] = []
            for w in row[idx + 1 :]:
                if w[0] >= split:
                    break
                t = w[4].strip()
                if t.isdigit() and len(t) <= 3:
                    break
                if TIME_RE.match(t):
                    times.append((w[0], w[1], t))
                elif t in ("||", "⛴"):
                    continue
        else:
            idx = next(
                (i for i, w in enumerate(row) if w[4].strip() == stop_no and w[0] >= EAST_STOP_X_MIN),
                None,
            )
            if idx is None:
                continue
            times = []
            for w in row[idx + 1 :]:
                if w[0] < EAST_TIME_X_MIN:
                    continue
                t = w[4].strip()
                if t.isdigit() and len(t) <= 3:
                    break
                if TIME_RE.match(t):
                    times.append((w[0], w[1], t))
                elif t in ("||", "⛴"):
                    continue

        if len(times) > len(best):
            best = times
    return best


def column_centers(words, side: str) -> list[float]:
    anchor = ANCHOR_STOP[side]
    times = row_times_for_side(words, anchor, side)
    return cluster_x([t[0] for t in times])


def assign_to_columns(
    times: list[tuple[float, float, str]], centers: list[float]
) -> dict[int, str]:
    out: dict[int, str] = {}
    for x, _y, t in times:
        col = min(range(len(centers)), key=lambda i: abs(x - centers[i]))
        out[col] = t
    return out


def parse_side_x(words, side: str) -> list[dict]:
    centers = column_centers(words, side)
    if not centers:
        return []

    ncols = len(centers)
    day_types = aligned_day_types(side, ncols)
    trips: list[dict] = [{"days": day_types[i], "times": {}} for i in range(ncols)]

    stop_nos = CENTRAL_WEST_NOS if side == "west" else CENTRAL_EAST_NOS
    for stop_no in stop_nos:
        sid = no_to_id(stop_no)
        if not sid:
            continue
        times = row_times_for_side(words, stop_no, side)
        if not times:
            continue
        col_map = assign_to_columns(times, centers)
        for col, t in col_map.items():
            trips[col]["times"][sid] = t

    return [t for t in trips if len(t.get("times", {})) >= 2]


def time_min(t: str) -> int:
    h, m = map(int, t.split(":"))
    return h * 60 + m


def find_row_offset(
    row_times: list[str | None],
    anchor_times: list[str | None],
    stop_no: str,
    anchor_no: str,
    side: str,
) -> int:
    """文本解析回退：按站序与时刻单调性推断列偏移。"""
    order = CENTRAL_WEST_NOS if side == "west" else CENTRAL_EAST_NOS
    try:
        si = order.index(stop_no)
        ai = order.index(anchor_no)
    except ValueError:
        best_o, best_s = 0, -1
        for o in range(0, max(1, len(anchor_times) - len(row_times) + 1)):
            s = sum(
                1
                for i, t in enumerate(row_times)
                if t and o + i < len(anchor_times) and anchor_times[o + i]
            )
            if s > best_s:
                best_s, best_o = s, o
        return best_o

    upstream = si < ai
    best_o, best_s = 0, -1
    for o in range(0, len(anchor_times) - len(row_times) + 1):
        score = 0
        for i, t in enumerate(row_times):
            if not t:
                continue
            at = anchor_times[o + i]
            if not at:
                continue
            td = time_min(t) - time_min(at)
            if upstream and -30 <= td <= 5:
                score += 1
            elif not upstream and -5 <= td <= 90:
                score += 1
            elif si == ai and abs(td) <= 1:
                score += 1
        if score > best_s:
            best_s, best_o = score, o
    return best_o


def parse_side_text(rows: dict[str, list[str | None]], side: str) -> list[dict]:
    """pypdf 文本回退：按参考站列偏移对齐。"""
    anchor_no = ANCHOR_STOP[side]
    if anchor_no not in rows:
        return []

    anchor_times = rows[anchor_no]
    ncols = len(anchor_times)
    day_types = aligned_day_types(side, ncols)
    trips: list[dict] = [{"days": day_types[i], "times": {}} for i in range(ncols)]

    for stop_no, times in rows.items():
        sid = no_to_id(stop_no)
        if not sid:
            continue
        offset = find_row_offset(times, anchor_times, stop_no, anchor_no, side)
        for i, t in enumerate(times):
            col = offset + i
            if t and col < ncols:
                trips[col]["times"][sid] = t

    return [t for t in trips if len(t.get("times", {})) >= 2]
