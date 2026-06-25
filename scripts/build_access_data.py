#!/usr/bin/env python3
"""生成 access-data.js — 上岛交通（数据来自 sources/access/*.json）"""

from __future__ import annotations

import json
import sys
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

from lib.overrides import apply_overrides  # noqa: E402

MANIFEST = json.loads((ROOT / "sources/access-manifest.json").read_text(encoding="utf-8"))
ACCESS_DIR = ROOT / "sources" / "access"
OVERRIDES = ROOT / MANIFEST["overridesDir"]


def load_json(name: str) -> dict:
    return json.loads((ACCESS_DIR / name).read_text(encoding="utf-8"))


def yen(n: int) -> str:
    return f"¥{n:,}"


def pick_season(seasons: list[dict], ref: date | None = None) -> dict:
    ref = ref or date.today()
    for s in seasons:
        if date.fromisoformat(s["validFrom"]) <= ref <= date.fromisoformat(s["validTo"]):
            return s
    past = [s for s in seasons if date.fromisoformat(s["validFrom"]) <= ref]
    if past:
        return max(past, key=lambda s: s["validFrom"])
    return seasons[0]


def season_schedule_notes(season: dict) -> tuple[dict, dict]:
    label = season["label"]
    vf, vt = season["validFrom"], season["validTo"]
    prefix_ja = f"{label['ja']}（{vf}–{vt}）。"
    prefix_zh = f"{label['zh']}（{vf}–{vt}）。"
    prefix_en = f"{label['en']} ({vf}–{vt}). "
    outbound = {
        "ja": prefix_ja + "鹿児島発：本港新港ふ頭（同一ターミナル）。屋久島側は宮之浦または安房着（着港欄）。",
        "zh": prefix_zh + "鹿儿岛出发：本港新港码头（同一码头）。屋久岛侧到达宫之浦或安房（见「到达港」）。",
        "en": prefix_en + "Departs Kagoshima Honko Shin-ko (one terminal). Arrives Miyanoura or Anbo on Yakushima (see Port).",
    }
    inbound = {
        "ja": prefix_ja + "屋久島発：宮之浦または安房（発港欄）。鹿児島着：本港新港ふ頭。",
        "zh": prefix_zh + "屋久岛出发：宫之浦或安房（见「出发港」）。到达鹿儿岛本港新港码头。",
        "en": prefix_en + "Departs Miyanoura or Anbo on Yakushima (see From). Arrives Kagoshima Honko Shin-ko.",
    }
    return outbound, inbound


def fare_rows(jetfoil: dict) -> list[dict]:
    rows = []
    for r in jetfoil["fares"]["rows"]:
        rows.append({
            "route": r["route"],
            "adult": yen(r["adultOneWay"]),
            "child": yen(r["childOneWay"]),
            "sub": False,
        })
        rows.append({
            "route": {
                "ja": f"↳ 往復割引（{r['route']['ja']}）",
                "zh": f"↳ 往返优惠（{r['route']['zh']}）",
                "en": f"↳ Round-trip ({r['route']['en']})",
            },
            "adult": yen(r["adultRoundTrip"]),
            "child": yen(r["childRoundTrip"]),
            "sub": True,
        })
    return rows


def build_data() -> dict:
    src = MANIFEST["sources"]
    jetfoil = load_json("jetfoil.json")
    ferry = load_json("ferry.json")
    pass_data = load_json("pass.json")
    booking = load_json("booking.json")
    season = pick_season(jetfoil["seasons"])
    note_out, note_in = season_schedule_notes(season)

    return {
        "meta": {
            "revision": MANIFEST["revision"],
            "updatedAt": MANIFEST["updatedAt"],
            "activeSeason": season["id"],
            "seasonRange": {"from": season["validFrom"], "to": season["validTo"]},
            "sources": {k: v["url"] for k, v in src.items()},
            "sourceLabels": {k: v.get("label", {}) for k, v in src.items()},
        },
        "intro": {
            "ja": "鹿児島から屋久島へは高速船（約2–3時間）かフェリー（約4時間）が一般的です。島内は路線バス（時刻表タブ）が中心。最新ダイヤ・運休は各社公式を確認してください。",
            "zh": "从鹿儿岛到屋久岛通常乘高速船（约2–3小时）或渡轮（约4小时）。岛上以公交为主（见时刻表页）。请以各运营商最新公告为准。",
            "en": "Reach Yakushima from Kagoshima by jetfoil (~2–3h) or ferry (~4h). On-island travel is mostly by route bus (Timetable tab). Check each operator for latest schedules.",
        },
        "booking": booking,
        "sections": [
            {
                "id": "jetfoil_out",
                "kind": "schedule",
                "sourceKey": "jetfoil",
                "title": {"ja": "高速船：鹿児島 → 屋久島", "zh": "高速船：鹿儿岛 → 屋久岛", "en": "Jetfoil: Kagoshima → Yakushima"},
                "note": note_out,
                "columns": [
                    {"key": "no", "label": {"ja": "便", "zh": "班次", "en": "No."}},
                    {"key": "dep", "label": {"ja": "鹿児島発", "zh": "鹿儿岛发", "en": "Dep. Kagoshima"}},
                    {"key": "arr", "label": {"ja": "着", "zh": "到", "en": "Arr."}},
                    {"key": "port", "label": {"ja": "着港", "zh": "到达港", "en": "Port"}},
                    {"key": "via", "label": {"ja": "経路", "zh": "路线", "en": "Route"}},
                ],
                "rows": season["toYakushima"],
            },
            {
                "id": "jetfoil_in",
                "kind": "schedule",
                "sourceKey": "jetfoil",
                "title": {"ja": "高速船：屋久島 → 鹿児島", "zh": "高速船：屋久岛 → 鹿儿岛", "en": "Jetfoil: Yakushima → Kagoshima"},
                "note": note_in,
                "columns": [
                    {"key": "no", "label": {"ja": "便", "zh": "班次", "en": "No."}},
                    {"key": "from", "label": {"ja": "発港", "zh": "出发港", "en": "From"}},
                    {"key": "dep", "label": {"ja": "発", "zh": "发", "en": "Dep."}},
                    {"key": "arr", "label": {"ja": "鹿児島着", "zh": "鹿儿岛到", "en": "Arr. Kagoshima"}},
                    {"key": "via", "label": {"ja": "備考", "zh": "备注", "en": "Note"}},
                ],
                "rows": season["toKagoshima"],
            },
            {
                "id": "jetfoil_fare",
                "kind": "fare",
                "sourceKey": "jetfoil",
                "title": {"ja": "高速船：運賃（片道・往復割引）", "zh": "高速船：运价（单程·往返优惠）", "en": "Jetfoil fares (one-way & round-trip)"},
                "note": jetfoil["fares"]["sourceNote"],
                "fareKey": "route",
                "rows": fare_rows(jetfoil),
            },
            {
                "id": "ferry",
                "kind": "schedule",
                "sourceKey": "ferry",
                "title": {"ja": "フェリー屋久島2（1日1便）", "zh": "屋久岛2号渡轮（每日1班）", "en": "Ferry Yakushima 2 (daily)"},
                "note": ferry["note"],
                **({"alert": ferry["alert"], "alertUrl": ferry["alertUrl"]} if ferry.get("alert") else {}),
                "columns": [
                    {"key": "from", "label": {"ja": "出発", "zh": "出发", "en": "From"}},
                    {"key": "dep", "label": {"ja": "発", "zh": "发", "en": "Dep."}},
                    {"key": "to", "label": {"ja": "到着", "zh": "到达", "en": "To"}},
                    {"key": "arr", "label": {"ja": "着", "zh": "到", "en": "Arr."}},
                ],
                "rows": ferry["rows"],
            },
            {
                "id": "ferry_fare",
                "kind": "fare",
                "sourceKey": "ferry",
                "title": {"ja": "フェリー：運賃目安（片道・通常期）", "zh": "渡轮：运价参考（单程·平季）", "en": "Ferry: sample one-way fares (regular season)"},
                "fareKey": "type",
                "rows": [
                    {"type": r["type"], "adult": yen(r["adult"]), "child": yen(r["child"])}
                    for r in ferry["fares"]
                ],
            },
            {
                "id": "pass",
                "sourceKey": "pass",
                "title": {"ja": "屋久島ゆったり満喫乗車券", "zh": "屋久岛悠享乘车券", "en": "Yakushima day pass"},
                "intro": pass_data.get("intro", {}),
                "note": pass_data["note"],
                "columns": [
                    {"key": "days", "label": {"ja": "券種", "zh": "票种", "en": "Ticket"}},
                    {"key": "adult", "label": {"ja": "大人", "zh": "成人", "en": "Adult"}},
                    {"key": "child", "label": {"ja": "小児", "zh": "儿童", "en": "Child"}},
                ],
                "rows": [
                    {
                        "days": {"ja": f"{r['days']}日", "zh": f"{r['days']}日", "en": f"{r['days']}-day"},
                        "adult": yen(r["adult"]),
                        "child": yen(r["child"]),
                    }
                    for r in pass_data["rows"]
                ],
            },
        ],
        "links": [
            {"key": "yakukan", "label": {"ja": "屋久島観光協会（交通）", "zh": "屋久岛观光协会（交通）", "en": "Yakushima tourism — transport"}},
            {"key": "jetfoil", "label": {"ja": "高速船 予約・時刻表", "zh": "高速船 预约·时刻表", "en": "Jetfoil booking & timetable"}},
            {"key": "jetfoilBook", "label": {"ja": "高速船 オンライン予約", "zh": "高速船 在线预约", "en": "Jetfoil online booking"}},
            {"key": "ferry", "label": {"ja": "フェリー屋久島2", "zh": "屋久岛2号渡轮", "en": "Ferry Yakushima 2"}},
            {"key": "pass", "label": {"ja": "ゆったり満喫乗車券（詳細）", "zh": "悠享乘车券（详情）", "en": "Day pass details"}},
        ],
        "disclaimer": {
            "ja": "時刻・運賃は各社公式情報に基づく参考です。季節ダイヤ・運休・改定があるため、乗船・乗車前に必ず公式サイトで確認してください。",
            "zh": "时刻与票价仅供参考，均来自各运营商公开信息。季节班次、停运与改定频繁，出行前请务必查阅官网。",
            "en": "Times and fares are reference only from official sources. Check each operator before travel—seasonal schedules and suspensions apply.",
        },
    }


def main():
    data = apply_overrides(build_data(), OVERRIDES)
    out = ROOT / "access-data.js"
    out.write_text(
        "/** 上岛交通 — scripts/build_access_data.py 生成；数据 sources/access/ */\n"
        f"const ACCESS_DATA = {json.dumps(data, ensure_ascii=False, indent=2)};\n",
        encoding="utf-8",
    )
    print(f"sections: {len(data['sections'])}  season: {data['meta']['activeSeason']}")


if __name__ == "__main__":
    main()
