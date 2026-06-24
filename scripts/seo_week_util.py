#!/usr/bin/env python3
"""ISO 周次与环比工具。"""
from __future__ import annotations

from datetime import date, timedelta


def iso_week_label(d: date) -> str:
    y, w, _ = d.isocalendar()
    return f"{y}-W{w:02d}"


def week_bounds(iso_week: str) -> tuple[date, date]:
    """iso_week 形如 2026-W25 → (周一, 周日)。"""
    y_str, w_str = iso_week.upper().split("-W")
    y, w = int(y_str), int(w_str)
    # ISO：该年第一个周四所在周为 W01
    jan4 = date(y, 1, 4)
    start = jan4 - timedelta(days=jan4.weekday()) + timedelta(weeks=w - 1)
    return start, start + timedelta(days=6)


def last_complete_iso_week(ref: date | None = None) -> str:
    """ref 所在周若未结束，返回上一完整 ISO 周。"""
    ref = ref or date.today()
    this_monday = ref - timedelta(days=ref.weekday())
    if ref >= this_monday + timedelta(days=6):
        return iso_week_label(this_monday)
    return iso_week_label(this_monday - timedelta(days=7))


def prev_iso_week(iso_week: str) -> str:
    start, _ = week_bounds(iso_week)
    return iso_week_label(start - timedelta(days=7))


def wow_pct(cur: float | int | None, prev: float | int | None) -> str:
    if cur is None or prev is None:
        return ""
    cur, prev = float(cur), float(prev)
    if prev == 0:
        return "—" if cur == 0 else "+∞"
    return f"{((cur - prev) / prev) * 100:+.1f}%"
