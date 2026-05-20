"""PDF 时刻表列 → 日种映射（2026-03-01 種子島・屋久島交通 中央線）。

列数以宫之浦港(20)西向、Hotel Yakushima(99)东向为基准，对照官方 PDF 平日/土曜/日祝 分区。
"""

from __future__ import annotations

# (weekday 列数, 土曜列数, 日祝列数)
CENTRAL_SPLITS: dict[str, tuple[int, int, int]] = {
    "west": (10, 2, 2),
    "east": (9, 2, 2),
}

REF_STOP: dict[str, str] = {"west": "20", "east": "99"}


def column_day_types(side: str, col_count: int) -> list[list[str]]:
    w, sat, sun = CENTRAL_SPLITS[side]
    total = w + sat + sun
    out: list[list[str]] = []
    for i in range(col_count):
        if i < w:
            out.append(["weekday"])
        elif i < w + sat:
            out.append(["saturday"])
        elif i < total:
            out.append(["sunday_holiday"])
        else:
            # 超出标准列数的附加班次，保守标为平日
            out.append(["weekday"])
    return out
