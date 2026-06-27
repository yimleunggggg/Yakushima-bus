#!/usr/bin/env python3
"""まつばんだ交通：早朝便・運休情報（公式 PDF / yakushima.co.jp）"""

from __future__ import annotations

MATSUBANDA_OUTBOUND = {
    "miyanoura_port": "4:00",
    "miyanoura_port_entrance": "4:01",
    "miyanoura": "4:04",
    "kobara": "4:05",
    "a_coop": "4:07",
    "miyaura_elem": "4:08",
    "koko_mae": "4:09",
    "asahi": "4:10",
    "kusugawa": "4:12",
    "kunugawa": "4:16",
    "kozeta": "4:19",
    "shionomichi": "4:23",
    "airport": "4:24",
    "hayasaki": "4:26",
    "takamibashi": "4:27",
    "towaho": "4:30",
    "funayuki": "4:33",
    "chuo": "4:36",
    "gocho_mae": "4:36",
    "police_mae": "4:37",
    "anbo_port": "4:40",
    "naka_iin_mae": "4:41",
    "anbo": "4:42",
    "makino": "4:43",
    "yakusugi_museum": "4:48",
}

MATSUBANDA_INBOUND = {
    "yakusugi_museum": "16:45",
    "makino": "↓",
    "anbo": "↓",
    "anbo_port": "↓",
    "naka_iin_mae": "↓",
    "police_mae": "↓",
    "gocho_mae": "↓",
    "chuo": "↓",
    "funayuki": "↓",
    "towaho": "↓",
    "takamibashi": "↓",
    "hayasaki": "↓",
    "airport": "↓",
    "shionomichi": "↓",
    "kozeta": "↓",
    "kunugawa": "↓",
    "kusugawa": "↓",
    "asahi": "↓",
    "koko_mae": "↓",
    "miyaura_elem": "↓",
    "a_coop": "↓",
    "kobara": "↓",
    "miyanoura": "↓",
    "miyanoura_port_entrance": "↓",
    "miyanoura_port": "↓",
}

OUTBOUND_STOPS = list(MATSUBANDA_OUTBOUND.keys())
INBOUND_STOPS = list(MATSUBANDA_INBOUND.keys())


def build_matsubanda_routes() -> list[dict]:
    season_note = {
        "ja": "冬季（12/1–2/28）運行。ゆったり満喫券・IC不可。",
        "zh": "冬季运行，无券/IC。",
        "en": "Winter (Dec 1–Feb 28). No day pass or IC.",
    }
    delay_note = {
        "ja": "下山時間の都合により出発が遅れる場合あり",
        "zh": "因下山时间关系，发车可能延迟",
        "en": "Departure may be delayed due to descent schedule",
    }
    shiratani_suspended = {
        "ja": "2026/3/1–11/30 運休（まつばんだ便）",
        "zh": "2026/3/1–11/30 停运（松叶班次）",
        "en": "Suspended Mar 1–Nov 30, 2026 (Matsubanda)",
    }

    return [
        {
            "id": "matsubanda_core",
            "operator": "matsubanda",
            "name": {"ja": "早朝・夕方便", "zh": "早晚班次", "en": "Early / evening service"},
            "season": "12-2",
            "directions": [
                {
                    "id": "out",
                    "label": {"ja": "自然館行（早朝）", "zh": "往自然馆（早班）", "en": "To museum (early)"},
                    "stops": OUTBOUND_STOPS,
                    "trips": [{
                        "days": ["weekday", "saturday", "sunday_holiday"],
                        "times": MATSUBANDA_OUTBOUND,
                        "dest": "yakusugi_museum",
                        "note": season_note,
                    }],
                },
                {
                    "id": "in",
                    "label": {"ja": "宮之浦港行（夕方）", "zh": "往宫之浦港（傍晚）", "en": "To Miyanoura Port (evening)"},
                    "stops": INBOUND_STOPS,
                    "trips": [{
                        "days": ["weekday", "saturday", "sunday_holiday"],
                        "times": MATSUBANDA_INBOUND,
                        "dest": "miyanoura_port",
                        "note": delay_note,
                    }],
                },
            ],
        },
        {
            "id": "matsubanda_shiratani",
            "operator": "matsubanda",
            "name": {"ja": "白谷雲水峡線", "zh": "白谷云水峡线", "en": "Shiratani Unsuikyo"},
            "directions": [
                {
                    "id": "to",
                    "label": {"ja": "白谷雲水峡行", "zh": "往白谷", "en": "To Shiratani"},
                    "stops": ["miyanoura_port", "miyanoura_port_entrance", "miyanoura", "kobara", "ushiroka_park", "shiratani"],
                    "trips": [{"days": ["weekday", "saturday", "sunday_holiday"], "times": {}, "suspended": True, "note": shiratani_suspended}],
                },
                {
                    "id": "from",
                    "label": {"ja": "宮之浦港行", "zh": "往宫之浦港", "en": "To Miyanoura Port"},
                    "stops": ["shiratani", "ushiroka_park", "kobara", "miyanoura", "miyanoura_port_entrance", "miyanoura_port"],
                    "trips": [{"days": ["weekday", "saturday", "sunday_holiday"], "times": {}, "suspended": True, "note": shiratani_suspended}],
                },
            ],
        },
    ]


from lib.operators import MATSUBANDA_OPERATOR  # noqa: E402

MATSUBANDA_INFO = {
    "matsubandaPass": {
        "ja": "まつばんだ便では「ゆったり満喫乗車券」は利用できません。",
        "zh": "松叶班次不可使用悠享乘车券。",
        "en": "Matsubanda buses do not accept the Yakushima day pass.",
    },
    "matsubandaIc": {
        "ja": "まつばんだ便では IC カードは利用できません。",
        "zh": "松叶班次不可使用 IC 卡。",
        "en": "IC cards are not accepted on Matsubanda buses.",
    },
}
