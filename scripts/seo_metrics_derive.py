#!/usr/bin/env python3
"""从 GA4/GSC 原始 JSON 提取汇总字段；仅使用 API 返回值，缺失留空。"""
from __future__ import annotations

from typing import Any

import seo_ga4_analysis as analysis


def _int(v: Any) -> int | None:
    if v is None or v == "":
        return None
    try:
        return int(v)
    except (TypeError, ValueError):
        return None


def _float(v: Any) -> float | None:
    if v is None or v == "":
        return None
    try:
        return float(v)
    except (TypeError, ValueError):
        return None


def api_block(block: dict | None) -> dict | None:
    """GA4/GSC 块有 error 则返回 None，避免把错误当 0。"""
    if not block or block.get("error"):
        return None
    return block


def channel_row(rows: list[dict] | None, name: str) -> dict | None:
    if not rows:
        return None
    for r in rows:
        label = r.get("dimension") or r.get("sessionDefaultChannelGroup") or ""
        if label == name:
            return r
    return None


def channel_users(rows: list[dict] | None, name: str) -> int | None:
    r = channel_row(rows, name)
    return _int(r.get("active_users")) if r else None


def channel_sessions(rows: list[dict] | None, name: str) -> int | None:
    r = channel_row(rows, name)
    return _int(r.get("sessions")) if r else None


def partition_countries(countries: list[dict] | None) -> tuple[int | None, int | None, int | None]:
    if not countries:
        return None, None, None
    human, bot = analysis.partition_human_bot(countries)
    return (
        sum(_int(r.get("active_users")) or 0 for r in human) or None,
        sum(_int(r.get("sessions")) or 0 for r in human) or None,
        sum(_int(r.get("active_users")) or 0 for r in bot) or None,
    )


def summary_fields(block: dict | None) -> dict[str, Any]:
    if not block:
        return {}
    return {
        "active_users": _int(block.get("active_users")),
        "new_users": _int(block.get("new_users")),
        "sessions": _int(block.get("sessions")),
        "engaged_sessions": _int(block.get("engaged_sessions")),
        "pageviews": _int(block.get("pageviews")),
        "engagement_rate": _float(block.get("engagement_rate")),
        "avg_session_sec": _float(block.get("avg_session_sec")),
    }


def gsc_fields(block: dict | None) -> dict[str, Any]:
    if not block:
        return {}
    return {
        "impressions": _int(block.get("impressions")),
        "clicks": _int(block.get("clicks")),
        "ctr": _float(block.get("ctr")),
        "position": _float(block.get("position")),
        "period_start": (block.get("period") or {}).get("start"),
        "period_end": (block.get("period") or {}).get("end"),
    }


def cell(v: Any) -> Any:
    """飞书单元格：None 写空字符串，不编造 0。"""
    if v is None:
        return ""
    return v
