"""官方运价表 — 来源 yakushimabus-map-unchin.pdf (2024/3 改定)"""

from __future__ import annotations

from .catalog import FARE_ANCHOR_BY_NO, FARE_COLUMN_NOS, STOP_CATALOG

FARE_ANCHORS: list[tuple[str, str, int]] = [
    ("20", "25", 140),
    ("20", "49", 590),
    ("20", "64", 870),
    ("20", "68", 1020),
    ("20", "29", 530),
    ("25", "49", 550),
    ("49", "64", 400),
    ("66", "68", 240),
    ("25", "29", 500),
    ("68", "70", 1000),
    ("20", "70", 1790),
]

# 到各主要列：自左侧全部列（PDF 上三角按列读取）
TO_COLUMN: dict[str, list[int]] = {
    "68": [570, 490, 590, 880, 1250, 1250, 1270, 1590, 1910],
    "86": [270, 720, 660, 750, 1030, 1400, 1400, 1410, 1720, 2050],
    "94": [210, 380, 830, 800, 860, 1120, 1470, 1470, 1490, 1800, 2130],
    "97": [350, 500, 670, 1020, 1110, 1340, 1690, 1690, 1710, 2030, 2330],
    "99": [500, 740, 880, 1030, 1340, 1420, 1650, 1980, 1980, 2010, 2310, 2590],
    "112": [280, 630, 870, 1000, 1140, 1440, 1510, 1740, 2090, 2090, 2100],
    "127": [280, 630, 870, 1000, 1140, 1440, 1510, 1740, 2090, 2090, 2100],
    "129": [280, 630, 870, 1000, 1140, 1440, 1510, 1740, 2090, 2090, 2100],
}

# 近郊 / 特殊区段（PDF 注记行）
SPECIAL_ROWS: list[tuple[str, str, int]] = [
    ("20", "1", 530), ("20", "11", 940),
    ("21", "1", 530), ("21", "11", 940),
    ("25", "1", 500), ("25", "11", 530), ("25", "23", 560),
    ("29", "23", 140), ("29", "25", 560), ("29", "20", 530),
    ("49", "23", 570), ("49", "25", 570),
    ("66", "68", 240), ("64", "68", 280), ("62", "68", 580),
    ("71", "62", 620), ("71", "64", 1140), ("71", "66", 1260), ("71", "68", 1290),
    ("72", "62", 620), ("72", "64", 1140), ("72", "66", 1260), ("72", "68", 1290),
    ("70", "68", 1000),
    ("20", "25", 140), ("20", "49", 590), ("20", "64", 870), ("20", "66", 870), ("20", "68", 1020),
    ("20", "29", 530), ("25", "49", 550), ("49", "64", 400),
    ("25", "29", 500), ("20", "70", 1790),
]

# 自 68 往后续主要列
FROM_68 = [570, 490, 590, 880, 1250, 1250, 1270, 1590, 1910]

FARE_DISCLAIMER = {
    "ja": "表示運賃は種子島・屋久島交通「バス運賃表（2024年3月改定）」に基づく目安です。乗車方向・経路・改定により異なる場合があります。実際の運賃は車内整理券・運転士に従ってください。",
    "zh": "所示票价依据种子岛·屋久岛交通《巴士运价表（2024年3月改定）》估算，因乘车方向、路线或改定可能不同，请以车内整理券及司机收费为准。",
    "en": "Fares shown are estimates from the Tanegashima Yakushima Kotsu fare table (Mar 2024). Actual fares may differ by direction, route, or revision—follow the numbered ticket and driver on board.",
}


def _id_by_no() -> dict[str, str]:
    return {no: meta["id"] for no, meta in STOP_CATALOG.items()}


def build_exact_pairs() -> dict[str, int]:
    id_by_no = _id_by_no()
    pairs: dict[str, int] = {}

    def add_no(a: str, b: str, yen: int):
        aid, bid = id_by_no.get(a), id_by_no.get(b)
        if not aid or not bid or not yen:
            return
        pairs[f"{aid}|{bid}"] = yen
        pairs[f"{bid}|{aid}"] = yen

    for to_no, vals in TO_COLUMN.items():
        to_idx = FARE_COLUMN_NOS.index(to_no)
        from_cols = FARE_COLUMN_NOS[:to_idx]
        for i, y in enumerate(vals[: len(from_cols)]):
            add_no(from_cols[i], to_no, y)

    for i, y in enumerate(FROM_68):
        j = 10 + i
        if j < len(FARE_COLUMN_NOS):
            add_no("68", FARE_COLUMN_NOS[j], y)

    # 特殊区段・近郊は最後に上書き（PDF 注記行）
    for a, b, y in SPECIAL_ROWS:
        add_no(a, b, y)

    return pairs


def lookup_fare(from_id: str, to_id: str, stops: dict, exact: dict[str, int]) -> tuple[int | None, str]:
    if from_id == to_id:
        return None, "none"
    key = f"{from_id}|{to_id}"
    if key in exact:
        return exact[key], "exact"

    def anchor(sid: str) -> str:
        no = stops[sid]["no"]
        anc_no = FARE_ANCHOR_BY_NO.get(no, no)
        return STOP_CATALOG[anc_no]["id"]

    a, b = anchor(from_id), anchor(to_id)
    if a == b:
        return None, "none"
    k2 = f"{a}|{b}"
    if k2 in exact:
        return exact[k2], "estimate"
    return None, "none"


def validate_pairs(pairs: dict[str, int]) -> list[str]:
    id_by_no = _id_by_no()
    errors = []
    for a, b, expected in FARE_ANCHORS:
        aid, bid = id_by_no[a], id_by_no[b]
        got = pairs.get(f"{aid}|{bid}")
        if got != expected:
            errors.append(f"{a}→{b}: got {got}, expected {expected}")
    return errors
