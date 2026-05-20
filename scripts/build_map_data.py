#!/usr/bin/env python3
"""从 data.js + 运价表生成 map-data.js"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

from lib.catalog import FARE_ANCHOR_BY_NO, GROUP_LABELS, STOP_CATALOG, build_stops  # noqa: E402
from lib.fare_table import FARE_DISCLAIMER, build_exact_pairs, validate_pairs  # noqa: E402
from lib.overrides import apply_overrides, merge_fare_pairs  # noqa: E402

MANIFEST = json.loads((ROOT / "sources" / "manifest.json").read_text(encoding="utf-8"))
OVERRIDES = ROOT / MANIFEST["overridesDir"]
MAP_WIDTH = 2600

ROUTE_ORDER = [
    "nagata", "inakahama", "yoshida", "hitomaru", "shitoko", "fukagawa",
    "miyanoura_port", "miyanoura_port_entrance", "miyanoura", "a_coop", "miyaura_elem",
    "koko_mae", "asahi", "kobara", "kusugawa", "kunugawa", "kozeta", "shionomichi", "airport",
    "hayasaki", "takamibashi", "towaho", "funayuki", "chuo", "gocho_mae", "police_mae",
    "anbo_port", "naka_iin_mae", "anbo", "makino", "yakusugi_museum", "morihisa_jinja",
    "hirano", "mugi", "botanical_park", "hara", "onokaido", "saman_hotel", "hotel_yakushima",
    "kojima", "hirauchi_onsen", "yunuma", "naka", "kurio_bashi", "okawa_falls",
]

BRANCH = {
    "ushiroka_park": ("kobara", 0, 55),
    "shiratani": ("kobara", 0, 95),
    "arakawa_sancho": ("yakusugi_museum", 0, 55),
    "arakawa_trailhead": ("yakusugi_museum", 0, 85),
    "yakusugiland": ("yakusugi_museum", 0, 115),
    "kigen_sugi": ("yakusugi_museum", 0, 145),
    "miyanoura_port_early": ("miyanoura_port", -25, 0),
}


def load_bus_stops() -> dict:
    text = (ROOT / "data.js").read_text(encoding="utf-8")
    data = json.loads(re.search(r"const BUS_DATA = (\{.*\});", text, re.S).group(1))
    return data["stops"]


def layout_stops(stops: dict) -> dict:
    out = {}
    order = [s for s in ROUTE_ORDER if s in stops]
    n = len(order)
    for i, sid in enumerate(order):
        s = stops[sid]
        x = 40 + i * ((MAP_WIDTH - 80) / max(n - 1, 1))
        y = 210 if i % 2 == 0 else 290
        entry = {"no": s["no"], "ja": s["ja"], "zh": s["zh"], "en": s["en"], "group": s["group"], "x": round(x, 1), "y": y}
        if s.get("tags"):
            entry["tags"] = s["tags"]
        anc_no = FARE_ANCHOR_BY_NO.get(s["no"], s["no"])
        entry["fareAnchor"] = STOP_CATALOG[anc_no]["id"]
        out[sid] = entry

    for sid, (parent, dx, dy) in BRANCH.items():
        if sid not in stops or parent not in out:
            continue
        p = out[parent]
        s = stops[sid]
        out[sid] = {
            "no": s["no"], "ja": s["ja"], "zh": s["zh"], "en": s["en"], "group": s["group"],
            "x": p["x"] + dx, "y": p["y"] + dy,
            "fareAnchor": STOP_CATALOG[FARE_ANCHOR_BY_NO.get(s["no"], s["no"])]["id"],
            **({"tags": s["tags"]} if s.get("tags") else {}),
        }
    return out


def main():
    stops = load_bus_stops()
    positioned = layout_stops(stops)
    fare_pairs = merge_fare_pairs(build_exact_pairs(), OVERRIDES)
    errors = validate_pairs(fare_pairs)
    if errors:
        print("WARN fare validation:", errors[:3])

    src = MANIFEST["sources"]
    data = {
        "meta": {
            "mapPdf": src["fare"]["url"],
            "mapPdfEn": src["fareEn"]["url"],
            "fareRevision": src["fare"]["revision"],
            "mapRevision": "2024-10",
            "fareSource": src["fare"]["url"],
        },
        "stopGroups": GROUP_LABELS,
        "stops": positioned,
        "routes": [
            {"id": "central", "color": "#2d6a4f", "width": 4, "stops": [s for s in ROUTE_ORDER if s in positioned]},
            {"id": "shiratani", "color": "#40916c", "width": 2.5, "dash": "5 4", "stops": ["kobara", "ushiroka_park", "shiratani"]},
            {"id": "arakawa", "color": "#bc6c25", "width": 2.5, "dash": "5 4", "stops": ["yakusugi_museum", "arakawa_sancho", "arakawa_trailhead", "yakusugiland", "kigen_sugi"]},
            {"id": "airport_spur", "color": "#7aa88a", "width": 2, "dash": "4 3", "stops": ["kozeta", "shionomichi", "airport"]},
        ],
        "fareStops": sorted(
            positioned.keys(),
            key=lambda k: int(positioned[k]["no"]),
        ),
        "farePairs": fare_pairs,
        "fareDisclaimer": FARE_DISCLAIMER,
        "fareNotes": {
            "payment": {"ja": "運賃は後払い。乗車時に整理券を取ってください。", "zh": "下车付车费，上车取整理券。", "en": "Pay when alighting. Take a numbered ticket on boarding."},
            "change": {"ja": "2千円・5千円・1万円札は車内で両替できません。", "zh": "车内无法找零大额纸币。", "en": "No change for large notes on board."},
            "child": {"ja": "小児（小学生）・障害者手帳所持者は半額。", "zh": "小学生及持残疾手册者半价。", "en": "Half fare for children & disability pass holders."},
            "infant": {"ja": "幼児（1歳以上6歳未満）は同伴者1人につき1人無賃。", "zh": "1–6岁幼儿每位陪同者可免费带1名。", "en": "One infant (1–6) free per paying adult."},
            "shirataniTransfer": {"ja": "白谷雲水峡（安房方面）は小原町で乗換", "zh": "往白谷（从安房方向）需在小原町换乘", "en": "To Shiratani from Anbo: transfer at Kobara"},
            "yakusugiTransfer": {"ja": "ヤクスギランド（宮之浦方面）は合庁前で乗換", "zh": "往屋久杉Land需在县厅前换乘", "en": "To Yakusugiland: transfer at Govt Office"},
            "arakawaTransfer": {"ja": "荒川登山バスは自然館で乗換（3～11月）", "zh": "荒川登山巴士在自然馆换乘（3–11月）", "en": "Arakawa bus: transfer at museum (Mar–Nov)"},
        },
        "passOffices": [
            {"ja": "宮之浦港（高速船窓口）", "zh": "宫之浦港（高速船窗口）", "en": "Miyanoura Port ferry counter", "stop": "miyanoura_port", "mapQuery": "宮之浦港 高速船 屋久島"},
            {"ja": "屋久島観光センター", "zh": "屋久岛观光中心", "en": "Tourism Center", "stop": "miyanoura", "mapQuery": "屋久島観光協会 宮之浦"},
            {"ja": "安房港（高速船窓口）", "zh": "安房港（高速船窗口）", "en": "Anbo Port ferry counter", "stop": "anbo_port", "mapQuery": "安房港 高速船 屋久島"},
            {"ja": "屋久島空港", "zh": "屋久岛机场", "en": "Airport", "stop": "airport", "mapQuery": "屋久島空港"},
            {"ja": "いわさきホテル", "zh": "Iwasaki Hotel", "en": "Iwasaki Hotel", "stop": "hotel_yakushima", "mapQuery": "いわさきホテル 屋久島"},
        ],
        "tagLabels": {
            "ferry": {"ja": "フェリー", "zh": "渡轮", "en": "Ferry"},
            "airport": {"ja": "空港", "zh": "机场", "en": "Airport"},
            "transfer": {"ja": "乗換", "zh": "换乘", "en": "Transfer"},
            "tourist": {"ja": "観光", "zh": "观光", "en": "Sightseeing"},
            "pass": {"ja": "乗車券", "zh": "乘车券", "en": "Pass sales"},
            "hotel": {"ja": "ホテル", "zh": "酒店", "en": "Hotel"},
        },
    }
    data = apply_overrides(data, OVERRIDES)

    out = ROOT / "map-data.js"
    out.write_text(
        "/** 路线图 — scripts/build_all.py 生成 */\n"
        f"const MAP_DATA = {json.dumps(data, ensure_ascii=False, indent=2)};\n",
        encoding="utf-8",
    )
    print(f"stops: {len(positioned)}, fare pairs: {len(fare_pairs)}")


if __name__ == "__main__":
    main()
