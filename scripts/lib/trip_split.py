"""环线 PDF 列拆分为单调子班次（构建期）。"""

from __future__ import annotations

import re

TIME_RE = re.compile(r"^\d{1,2}:\d{2}$")
# 相邻有时刻站点间超过该间隔，视为不同班次（环线 PDF 常见）
GAP_SPLIT_MINUTES = 75


def parse_minutes(time: str) -> int:
    h, m = time.split(":")
    return int(h) * 60 + int(m)


def trip_destination(times: dict[str, str], order: list[str]) -> str | None:
    for sid in reversed(order):
        if times.get(sid):
            return sid
    return None


def _clean_times(times: dict, stop_order: list[str]) -> dict[str, str]:
    order_set = set(stop_order)
    return {
        k: v
        for k, v in (times or {}).items()
        if k in order_set and v and TIME_RE.match(v)
    }


def geographic_fragments(times: dict[str, str], stop_order: list[str]) -> list[dict[str, str]]:
    """沿站序扫描，时刻回退处切开。"""
    frags: list[dict[str, str]] = []
    current: dict[str, str] = {}
    last_m: int | None = None
    for sid in stop_order:
        raw = times.get(sid)
        if not raw:
            continue
        m = parse_minutes(raw)
        if last_m is not None and m < last_m:
            if current:
                frags.append(current)
            current = {}
        current[sid] = raw
        last_m = m
    if current:
        frags.append(current)
    return frags


def split_time_gaps(fragment: dict[str, str], stop_order: list[str]) -> list[dict[str, str]]:
    """片段内相邻有时刻站点间隔过大时再切。"""
    ordered = [(sid, fragment[sid]) for sid in stop_order if sid in fragment]
    if len(ordered) < 2:
        return [fragment] if len(ordered) == 1 else []

    parts: list[dict[str, str]] = []
    current: dict[str, str] = {ordered[0][0]: ordered[0][1]}
    last_m = parse_minutes(ordered[0][1])

    for sid, raw in ordered[1:]:
        m = parse_minutes(raw)
        if m - last_m > GAP_SPLIT_MINUTES:
            if len(current) >= 2:
                parts.append(current)
            elif parts:
                # 单站并入前一段（常见：前圈末站与下圈首站同列）
                parts[-1].update(current)
            current = {}
        current[sid] = raw
        last_m = m

    if len(current) >= 2:
        parts.append(current)
    elif current and parts:
        parts[-1].update(current)
    elif len(current) == 1 and not parts:
        parts.append(current)
    return parts


def merge_singleton_forward(parts: list[dict[str, str]], stop_order: list[str]) -> list[dict[str, str]]:
    """将单站片段并入后一段（站序更后、时刻更晚）。"""
    if not parts:
        return parts
    merged = [dict(p) for p in parts]
    used: set[int] = set()
    for i, frag in enumerate(merged):
        if i in used or len(frag) != 1:
            continue
        sid, t = next(iter(frag.items()))
        if sid == "miyanoura_port":
            continue  # 由 finalize_port_anbo_legs 处理
        si = stop_order.index(sid)
        tm = parse_minutes(t)
        target: int | None = None
        for j, nxt in enumerate(merged):
            if j == i or j in used or len(nxt) < 2:
                continue
            nxt_min_sid = min(nxt, key=lambda s: stop_order.index(s))
            if stop_order.index(nxt_min_sid) <= si:
                continue
            if min(parse_minutes(v) for v in nxt.values()) <= tm:
                continue
            if target is None or stop_order.index(nxt_min_sid) < stop_order.index(
                min(merged[target], key=lambda s: stop_order.index(s))
            ):
                target = j
        if target is not None:
            merged[target] = {sid: t, **merged[target]}
            used.add(i)
    return [
        p
        for idx, p in enumerate(merged)
        if idx not in used and (len(p) >= 2 or (len(p) == 1 and "miyanoura_port" in p))
    ]


def finalize_port_anbo_legs(legs: list[dict[str, str]], stop_order: list[str]) -> list[dict[str, str]]:
    """同一 PDF 列：把仅含宫之浦港发车的腿并入含对应安房到站的腿。"""
    if not legs:
        return legs
    try:
        pi = stop_order.index("miyanoura_port")
        ai = stop_order.index("anbo")
    except ValueError:
        return [leg for leg in legs if len(leg) >= 2]

    work = [dict(leg) for leg in legs]
    changed = True
    while changed:
        changed = False
        for i, leg in enumerate(work):
            if not leg or "miyanoura_port" not in leg or "anbo" in leg:
                continue
            pm = parse_minutes(leg["miyanoura_port"])
            port_part = {
                sid: t for sid, t in leg.items() if stop_order.index(sid) <= ai
            }
            best_j = -1
            best_suffix: dict[str, str] | None = None
            for j, other in enumerate(work):
                if j == i or not other or "anbo" not in other:
                    continue
                at = other.get("anbo")
                if not at or parse_minutes(at) <= pm:
                    continue
                suffix = {
                    sid: t
                    for sid, t in other.items()
                    if pi <= stop_order.index(sid) <= ai and parse_minutes(t) >= pm
                }
                if "anbo" not in suffix:
                    continue
                if best_suffix is None or parse_minutes(suffix["anbo"]) < parse_minutes(best_suffix["anbo"]):
                    best_j = j
                    best_suffix = suffix
            if best_j < 0 or not best_suffix:
                continue
            combined = {**port_part, **best_suffix}
            if find_non_monotonic({"times": combined}, stop_order):
                continue
            work[i] = combined
            for sid in best_suffix:
                work[best_j].pop(sid, None)
            remainder = {sid: t for sid, t in leg.items() if sid not in combined}
            if len(remainder) >= 2:
                work.append(remainder)
            changed = True
            break

    return [leg for leg in work if len(leg) >= 2]


def decompose_trip_times(times: dict, stop_order: list[str]) -> list[dict[str, str]]:
    legs: list[dict[str, str]] = []
    for frag in geographic_fragments(times, stop_order):
        for part in split_time_gaps(frag, stop_order):
            if part:
                legs.append(part)
    legs = merge_singleton_forward(legs, stop_order)
    legs = finalize_port_anbo_legs(legs, stop_order)
    return [leg for leg in legs if len(leg) >= 2]


def split_loop_trip(trip: dict, stop_order: list[str]) -> list[dict]:
    times = _clean_times(trip.get("times") or {}, stop_order)
    if len(times) < 2:
        return []

    legs = decompose_trip_times(times, stop_order)
    if not legs:
        return []
    if len(legs) == 1 and legs[0] == times:
        if not find_non_monotonic({"times": times}, stop_order):
            return [trip]

    meta_keys = ("days", "destNote", "note", "suspended")
    out: list[dict] = []
    for seg_times in legs:
        entry = {k: trip[k] for k in meta_keys if k in trip}
        entry["times"] = seg_times
        dest = trip_destination(seg_times, stop_order)
        if dest:
            entry["dest"] = dest
        out.append(entry)
    return out


def split_all_trips(trips: list[dict], stop_order: list[str]) -> list[dict]:
    out: list[dict] = []
    for trip in trips:
        out.extend(split_loop_trip(trip, stop_order))
    return out


def split_routes_trips(routes: list[dict]) -> list[dict]:
    for route in routes:
        for direction in route.get("directions", []):
            order = direction.get("stops") or []
            direction["trips"] = split_all_trips(direction.get("trips", []), order)
    return routes


def find_non_monotonic(trip: dict, stop_order: list[str]) -> list[tuple[str, str, str, str]]:
    issues: list[tuple[str, str, str, str]] = []
    last: tuple[str, str] | None = None
    times = trip.get("times") or {}
    for sid in stop_order:
        raw = times.get(sid)
        if not raw or not TIME_RE.match(raw):
            continue
        if last and parse_minutes(raw) < parse_minutes(last[1]):
            issues.append((last[0], last[1], sid, raw))
        last = (sid, raw)
    return issues


def validate_routes_monotonic(routes: list[dict]) -> list[str]:
    errors: list[str] = []
    for route in routes:
        rid = route.get("id", "?")
        for direction in route.get("directions", []):
            did = direction.get("id", "?")
            order = direction.get("stops") or []
            for i, trip in enumerate(direction.get("trips", [])):
                issues = find_non_monotonic(trip, order)
                if issues:
                    errors.append(
                        f"{rid}/{did} trip#{i} days={trip.get('days')} "
                        f"backslide {issues[0][0]}@{issues[0][1]} -> {issues[0][2]}@{issues[0][3]}"
                    )
    return errors
