"""PDF 时刻表列 → 日种映射（2026-03-01 種子島・屋久島交通 中央線）。

列数以宫之浦港(20)西向、Hotel Yakushima(99)东向为**日种分区**基准；解析时取该侧**全表最大列数**（西/东向均可达 15 列），避免环线末列被参考站行截断。
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
