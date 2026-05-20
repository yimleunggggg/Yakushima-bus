"""全站目录 — 与官方 PDF 停留所番号一致。"""

from __future__ import annotations

STOP_CATALOG: dict[str, dict] = {
    "1": {"id": "nagata", "ja": "永田", "zh": "永田", "en": "Nagata", "group": "nagata"},
    "5": {"id": "inakahama", "ja": "いなか浜", "zh": "稻叶滨", "en": "Inakahama", "group": "nagata"},
    "8": {"id": "yoshida", "ja": "吉田", "zh": "吉田", "en": "Yoshida", "group": "nagata"},
    "11": {"id": "hitomaru", "ja": "一湊", "zh": "一凑", "en": "Isso", "group": "nagata"},
    "14": {"id": "shitoko", "ja": "志戸子", "zh": "志户子", "en": "Shitoko", "group": "nagata"},
    "17": {"id": "fukagawa", "ja": "深川", "zh": "深川", "en": "Fukagawa", "group": "nagata"},
    "19": {"id": "miyanoura_port_early", "ja": "宮之浦港（早朝）", "zh": "宫之浦港（早班）", "en": "Miyanoura Port (early)", "group": "miyanoura", "tags": ["ferry"]},
    "20": {"id": "miyanoura_port", "ja": "宮之浦港", "zh": "宫之浦港", "en": "Miyanoura Port", "group": "miyanoura", "tags": ["ferry", "tourist"]},
    "21": {"id": "miyanoura_port_entrance", "ja": "宮之浦港入口", "zh": "宫之浦港入口", "en": "Miyanoura Port Ent.", "group": "miyanoura"},
    "23": {"id": "miyanoura", "ja": "宮之浦", "zh": "宫之浦", "en": "Miyanoura", "group": "miyanoura", "tags": ["tourist"]},
    "25": {"id": "kobara", "ja": "小原町", "zh": "小原町", "en": "Oharamachi", "group": "miyanoura", "tags": ["transfer"]},
    "26": {"id": "ushiroka_park", "ja": "牛床公園", "zh": "牛床公园", "en": "Ushiroka Park", "group": "shiratani"},
    "29": {"id": "shiratani", "ja": "白谷雲水峡", "zh": "白谷云水峡", "en": "Shiratani Unsuikyo", "group": "shiratani", "tags": ["tourist"]},
    "30": {"id": "a_coop", "ja": "Ａコープ前", "zh": "A-Coop前", "en": "A-Coop", "group": "miyanoura"},
    "31": {"id": "miyaura_elem", "ja": "宮浦小前", "zh": "宫浦小学前", "en": "Miyaura Elem.", "group": "miyanoura"},
    "32": {"id": "koko_mae", "ja": "高校前", "zh": "高中前", "en": "High School", "group": "miyanoura", "matsubandaOnly": True},
    "34": {"id": "asahi", "ja": "旭町", "zh": "旭町", "en": "Asahi-machi", "group": "miyanoura"},
    "37": {"id": "kusugawa", "ja": "楠川", "zh": "楠川", "en": "Kusugawa", "group": "miyanoura"},
    "41": {"id": "kunugawa", "ja": "椨川", "zh": "椨川", "en": "Kunugawa", "group": "miyanoura"},
    "44": {"id": "kozeta", "ja": "小瀬田", "zh": "小濑田", "en": "Koseda", "group": "airport"},
    "48": {"id": "shionomichi", "ja": "塩ノ道", "zh": "盐之道", "en": "Shionomichi", "group": "airport"},
    "49": {"id": "airport", "ja": "空港", "zh": "机场", "en": "Airport", "group": "airport", "tags": ["airport", "tourist"]},
    "52": {"id": "hayasaki", "ja": "早崎", "zh": "早崎", "en": "Hayasaki", "group": "airport"},
    "53": {"id": "takamibashi", "ja": "高見橋", "zh": "高见桥", "en": "Takamibashi", "group": "airport", "matsubandaOnly": True},
    "56": {"id": "towaho", "ja": "永久保", "zh": "永久保", "en": "Towaho", "group": "airport"},
    "59": {"id": "funayuki", "ja": "船行", "zh": "船行", "en": "Funayuki", "group": "anbo"},
    "61": {"id": "chuo", "ja": "中央", "zh": "中央", "en": "Chuo", "group": "anbo", "matsubandaOnly": True},
    "62": {"id": "gocho_mae", "ja": "合庁前", "zh": "县厅前", "en": "Govt Office", "group": "anbo", "tags": ["transfer"]},
    "63": {"id": "police_mae", "ja": "警察署前", "zh": "警察署前", "en": "Police Sta.", "group": "anbo"},
    "64": {"id": "anbo_port", "ja": "安房港", "zh": "安房港", "en": "Anbo Port", "group": "anbo", "tags": ["ferry", "tourist"]},
    "65": {"id": "naka_iin_mae", "ja": "仲医院前", "zh": "仲医院前", "en": "Naka Clinic", "group": "anbo", "matsubandaOnly": True},
    "66": {"id": "anbo", "ja": "安房", "zh": "安房", "en": "Anbo", "group": "anbo", "tags": ["tourist"]},
    "67": {"id": "makino", "ja": "牧野", "zh": "牧野", "en": "Makino", "group": "anbo"},
    "68": {"id": "yakusugi_museum", "ja": "屋久杉自然館", "zh": "屋久杉自然馆", "en": "Yakusugi Museum", "group": "anbo", "tags": ["tourist", "transfer"]},
    "69": {"id": "arakawa_sancho", "ja": "荒川三叉路", "zh": "荒川三岔路", "en": "Arakawa Junction", "group": "arakawa"},
    "70": {"id": "arakawa_trailhead", "ja": "荒川登山口", "zh": "荒川登山口", "en": "Arakawa Trailhead", "group": "arakawa", "tags": ["tourist"]},
    "71": {"id": "yakusugiland", "ja": "ヤクスギランド", "zh": "屋久杉Land", "en": "Yakusugiland", "group": "arakawa", "tags": ["tourist"]},
    "72": {"id": "kigen_sugi", "ja": "紀元杉", "zh": "纪元杉", "en": "Kigen Sugi", "group": "arakawa", "tags": ["tourist"]},
    "73": {"id": "morihisa_jinja", "ja": "盛久神社", "zh": "盛久神社", "en": "Morihisa Shrine", "group": "east"},
    "78": {"id": "hirano", "ja": "平野", "zh": "平野", "en": "Hirano", "group": "east"},
    "85": {"id": "mugi", "ja": "麦生", "zh": "麦生", "en": "Mugi", "group": "east"},
    "86": {"id": "botanical_park", "ja": "ボタニカルリサーチパーク", "zh": "植物研究公园", "en": "Botanical Park", "group": "east", "tags": ["tourist"]},
    "89": {"id": "hara", "ja": "原", "zh": "原", "en": "Hara", "group": "east"},
    "94": {"id": "onokaido", "ja": "尾之間", "zh": "尾之间", "en": "Onoaida", "group": "east"},
    "97": {"id": "saman_hotel", "ja": "サマナホテルヤクシマ", "zh": "Samana Hotel Yakushima", "en": "Samana Hotel", "group": "east", "tags": ["hotel"]},
    "99": {"id": "hotel_yakushima", "ja": "ザホテルヤクシマ", "zh": "The Hotel Yakushima", "en": "The Hotel Yakushima", "group": "east", "tags": ["hotel"]},
    "102": {"id": "kojima", "ja": "小島", "zh": "小岛", "en": "Kojima", "group": "west"},
    "112": {"id": "hirauchi_onsen", "ja": "平内海中温泉", "zh": "平内海中温泉", "en": "Hirauchi Onsen", "group": "west", "tags": ["tourist"]},
    "114": {"id": "yunuma", "ja": "湯泊", "zh": "汤泊", "en": "Yunuma", "group": "west"},
    "123": {"id": "naka", "ja": "中間", "zh": "中间", "en": "Naka", "group": "west"},
    "127": {"id": "kurio_bashi", "ja": "栗生橋", "zh": "栗生桥", "en": "Kurio Bridge", "group": "west"},
    "129": {"id": "okawa_falls", "ja": "大川の滝", "zh": "大川瀑布", "en": "Okawa Falls", "group": "west", "tags": ["tourist"]},
}

CENTRAL_WEST_NOS = [
    "1", "5", "8", "11", "14", "17", "20", "21", "23", "25", "30", "31", "34", "37",
    "41", "44", "48", "49", "52", "56", "59", "62", "63", "64", "66", "67", "68",
    "73", "78", "85", "86", "89", "94", "97", "102", "112", "114", "123", "127", "129",
]
CENTRAL_EAST_NOS = list(reversed(CENTRAL_WEST_NOS))

GROUP_LABELS = {
    "miyanoura": {"ja": "宮之浦方面", "zh": "宫之浦方向", "en": "Miyanoura area"},
    "airport": {"ja": "空港方面", "zh": "机场方向", "en": "Airport area"},
    "anbo": {"ja": "安房・自然館", "zh": "安房/自然馆", "en": "Anbo / Museum"},
    "east": {"ja": "安房以東", "zh": "安房以东", "en": "East of Anbo"},
    "west": {"ja": "西部（栗生・大川）", "zh": "西部（栗生/大川）", "en": "West (Kurio / Okawa)"},
    "nagata": {"ja": "永田方面", "zh": "永田方向", "en": "Nagata area"},
    "shiratani": {"ja": "白谷雲水峡", "zh": "白谷云水峡", "en": "Shiratani Unsuikyo"},
    "arakawa": {"ja": "荒川・紀元杉", "zh": "荒川/纪元杉", "en": "Arakawa / Kigen Sugi"},
}

# 运价表主要列（2024/3 改定 PDF）
FARE_COLUMN_NOS = ["1", "11", "23", "25", "49", "50", "62", "64", "66", "68", "86", "94", "97", "99", "112", "127", "129"]

# 非主要列站点 → 运价锚点（同一路线最近的主要列）
FARE_ANCHOR_BY_NO: dict[str, str] = {
    "5": "1", "8": "1", "14": "11", "17": "11",
    "19": "20", "21": "20", "26": "29", "30": "25", "31": "25", "32": "25", "34": "25", "37": "25", "41": "25",
    "44": "49", "48": "49", "52": "49", "53": "49", "56": "49",
    "59": "62", "61": "62", "63": "62", "65": "66", "67": "66",
    "69": "71", "70": "68", "71": "68", "72": "68",
    "73": "86", "78": "86", "85": "86", "89": "94", "102": "112", "114": "127", "123": "127",
}


def no_to_id(no: str) -> str | None:
    return STOP_CATALOG.get(no, {}).get("id")


def build_stops() -> dict:
    stops: dict = {}
    for no, meta in STOP_CATALOG.items():
        sid = meta["id"]
        if sid in stops:
            continue
        entry = {
            "no": no,
            "ja": meta["ja"],
            "zh": meta["zh"],
            "en": meta["en"],
            "group": meta["group"],
        }
        if meta.get("tags"):
            entry["tags"] = meta["tags"]
        if meta.get("matsubandaOnly"):
            entry["matsubandaOnly"] = True
        stops[sid] = entry
    return stops


def fare_anchor_no(no: str) -> str:
    return FARE_ANCHOR_BY_NO.get(no, no)
