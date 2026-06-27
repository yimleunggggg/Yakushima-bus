#!/usr/bin/env python3
"""从官方 PDF 提取完整时刻表，生成 data.js"""

from __future__ import annotations

import copy
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

from lib.catalog import (  # noqa: E402
    CENTRAL_EAST_NOS,
    CENTRAL_WEST_NOS,
    GROUP_LABELS,
    STOP_CATALOG,
    build_stops,
    no_to_id,
)
from lib.day_columns import REF_STOP, column_day_types  # noqa: E402
from lib.operators import OPERATORS  # noqa: E402
from lib.overrides import apply_overrides  # noqa: E402
from lib.trip_split import split_routes_trips, validate_routes_monotonic  # noqa: E402
from parse_matsubanda import (  # noqa: E402
    MATSUBANDA_INFO,
    build_matsubanda_routes,
)

MANIFEST = json.loads((ROOT / "sources" / "manifest.json").read_text(encoding="utf-8"))
PDF = ROOT / MANIFEST["sources"]["taneyaku"]["file"]
OVERRIDES = ROOT / MANIFEST["overridesDir"]
TIME_RE = re.compile(r"\d{1,2}:\d{2}")

ROW_RE = re.compile(
    r"^(\d+)\s+(.+?)\s+((?:\d{1,2}:\d{2}|⛴|\|\||\s)+?)"
    r"(?:\s+(\d+)\s+(.+?)\s+((?:\d{1,2}:\d{2}|⛴|\|\||\s)+))?$"
)


def parse_row_line(line: str) -> tuple[tuple[str, str] | None, tuple[str, str] | None]:
    """一行から西側・東側の (stop_no, times_raw) を取り出す"""
    line = line.strip()
    if not line or line.startswith("宮之浦") or "⇒" in line:
        return None, None

    east_at: int | None = None
    for m in re.finditer(r"(?:^|\s)(\d+)\s", line):
        no = m.group(1)
        pos = m.start() + (1 if m.group(0).startswith(" ") else 0)
        if no not in STOP_CATALOG or pos < 2:
            continue
        tail = line[pos:]
        if TIME_RE.search(tail) and pos > 0:
            # 最初の停留所番号以外で、後ろに時刻がある位置＝東側の開始
            if east_at is None or pos < east_at:
                east_at = pos

    if east_at is None:
        west_chunk = line
        east_chunk = None
    else:
        west_chunk = line[:east_at].rstrip()
        east_chunk = line[east_at:].lstrip()

    def half(chunk: str | None) -> tuple[str, str] | None:
        if not chunk:
            return None
        chunk = chunk.strip()
        # 无站名行（如 "19 4:45 5:51 ||"）须优先匹配纯时刻列
        m = re.match(r"^(\d+)\s+((?:\d{1,2}:\d{2}|⛴|\|\||\s)+)$", chunk)
        if m:
            return m.group(1), m.group(2)
        m = re.match(r"^(\d+)\s+(.+?)\s+((?:\d{1,2}:\d{2}|⛴|\|\||\s)+)$", chunk)
        if m:
            return m.group(1), m.group(3)
        return None

    return half(west_chunk), half(east_chunk)


def extract_pdf_text(pdf_path: Path) -> str:
    from pypdf import PdfReader

    return PdfReader(str(pdf_path)).pages[0].extract_text() or ""


def parse_times(raw: str) -> list[str | None]:
    parts = re.split(r"\s+", raw.replace("⛴", " ").strip())
    out: list[str | None] = []
    for p in parts:
        if not p:
            continue
        if p == "||":
            out.append(None)
        elif TIME_RE.fullmatch(p):
            out.append(p)
    return out


def apply_row(trips: list[dict], stop_no: str, raw: str) -> list[dict]:
    sid = no_to_id(stop_no)
    if not sid:
        return trips
    times = parse_times(raw)
    if not times:
        return trips
    if not trips:
        trips = [{"times": {}} for _ in times]
    for i, t in enumerate(times):
        while i >= len(trips):
            trips.append({"times": {}})
        if t:
            trips[i]["times"][sid] = t
    return trips


def parse_side(text: str, side: str) -> list[dict]:
    rows: dict[str, list[str | None]] = {}
    for line in text.splitlines():
        west, east = parse_row_line(line)
        chunk = west if side == "west" else east
        if chunk:
            times = parse_times(chunk[1])
            prev = rows.get(chunk[0])
            if prev is None or len(times) > len(prev):
                rows[chunk[0]] = times

    ref = REF_STOP[side]
    if ref not in rows:
        return []
    # 环线 PDF：参考站列数可能少于其他行（如西向 20 站 14 列、21 站 15 列），
    # 须取全表最大列数，否则末列班次（如 18:26 宫之浦港入口）会被截断。
    ncols = max(len(rows[ref]), max((len(t) for t in rows.values()), default=0))
    day_types = column_day_types(side, ncols)
    trips = [{"days": day_types[i], "times": {}} for i in range(ncols)]

    for stop_no, times in rows.items():
        sid = no_to_id(stop_no)
        if not sid:
            continue
        for i, t in enumerate(times):
            if i < ncols and t:
                trips[i]["times"][sid] = t

    return [t for t in trips if len(t.get("times", {})) >= 2]


def trip_destination(times: dict, order: list[str]) -> str | None:
    for sid in reversed(order):
        if times.get(sid):
            return sid
    return None


def fmt_trips(raw: list[dict], order: list[str], dest_hints: list[str] | None = None) -> list[dict]:
    out = []
    for i, t in enumerate(raw):
        times = {k: v for k, v in t["times"].items() if v}
        if len(times) < 2:
            continue
        dest = trip_destination(times, order)
        note = None
        if dest_hints and i < len(dest_hints):
            note = dest_hints[i]
        entry = {"days": t.get("days", ["weekday", "saturday", "sunday_holiday"]), "times": times}
        if dest:
            entry["dest"] = dest
        if note:
            entry["destNote"] = {"ja": note}
        out.append(entry)
    return out


def parse_section_rows(lines: list[str], stop_order: list[str]) -> list[dict]:
    trips: list[dict] = []
    for line in lines:
        m = re.match(r"^(\d+)\s*(.*?)\s+((?:\d{1,2}:\d{2}\s*)+)$", line.strip())
        if not m:
            m2 = ROW_RE.match(line.strip())
            if m2:
                apply_row(trips, m2.group(1), m2.group(3))
            continue
        apply_row(trips, m.group(1), m.group(3))
    ids = [no_to_id(n) for n in stop_order if no_to_id(n)]
    result = []
    for t in trips:
        times = {k: v for k, v in t.get("times", {}).items() if v}
        if len(times) >= 2 and any(k in times for k in ids):
            result.append({"days": ["weekday", "saturday", "sunday_holiday"], "times": times})
    return result


def _meta_sources() -> dict:
    m = MANIFEST["sources"]
    return {
        "taneyaku": m["taneyaku"]["url"],
        "taneyakuEn": m["taneyakuEn"]["url"],
        "matsubanda": m["matsubanda"]["url"],
        "fare": m["fare"]["url"],
        "fareEn": m["fareEn"]["url"],
        "notice": m["notice"]["url"],
        "serviceStatus": m["serviceStatus"]["url"],
        "arakawaX": m["arakawaX"]["url"],
        "pass": m["pass"]["url"],
    }


def build_data() -> dict:
    text = extract_pdf_text(PDF) if PDF.exists() else ""
    west_raw = parse_side(text, "west") if text else []
    east_raw = parse_side(text, "east") if text else []

    west_ids = [no_to_id(n) for n in CENTRAL_WEST_NOS if no_to_id(n)]
    east_ids = [no_to_id(n) for n in CENTRAL_EAST_NOS if no_to_id(n)]

    west_dest_hints = [
        "屋久杉自然館", "安房港", "栗生橋", "栗生橋", "栗生橋", "栗生橋", "栗生橋", "栗生橋", "栗生橋",
        "大川の滝", "いわさきH", "いわさきH", "大川の滝", "大川の滝",
    ]
    east_dest_hints = [
        "宮之浦港", "永田", "永田", "宮之浦港", "宮之浦港", "永田", "宮之浦港", "宮之浦港",
        "永田", "宮之浦港", "宮之浦港", "永田", "宮之浦港", "永田", "宮之浦港",
    ]

    special_routes = json.loads((ROOT / "sources/routes/special.json").read_text(encoding="utf-8"))["routes"]

    taneyaku_routes = [
            {
                "id": "central",
                "operator": "taneyaku",
                "name": {"ja": "中央線", "zh": "中央线", "en": "Central Line"},
                "directions": [
                    {
                        "id": "west",
                        "label": {"ja": "永田・大川方面", "zh": "永田/大川方向", "en": "Toward Nagata / Okawa"},
                        "stops": west_ids,
                        "trips": fmt_trips(west_raw, west_ids, west_dest_hints),
                    },
                    {
                        "id": "east",
                        "label": {"ja": "宮之浦港方面", "zh": "宫之浦港方向", "en": "Toward Miyanoura Port"},
                        "stops": east_ids,
                        "trips": fmt_trips(east_raw, east_ids, east_dest_hints),
                    },
                ],
            },
            *special_routes,
    ]

    data = {
        "meta": {
            "version": MANIFEST["revision"],
            "validFrom": MANIFEST["validFrom"],
            "validTo": MANIFEST["validTo"],
            "updatedAt": MANIFEST["updatedAt"],
            "sources": _meta_sources(),
            "phone": {"taneyaku": "0997-46-2221", "matsubanda": "0997-43-5000"},
        },
        "operators": OPERATORS,
        "stopGroups": GROUP_LABELS,
        "stops": build_stops(),
        "info": {
            "payment": {
                "ja": "運賃は後払い。乗車時に整理券を取ってください。",
                "zh": "下车付车费，上车时请取整理券。",
                "en": "Pay when you get off. Take a numbered ticket when boarding.",
            },
            "change": {
                "ja": "車内で両替不可（新千円札・新500円硬貨含む）。",
                "zh": "车内无法找零（含新版1000日元纸币和500日元硬币）。",
                "en": "No change given on board (incl. new ¥1000 notes & ¥500 coins).",
            },
            "ic": {
                "ja": "「いわさきICカード」「ラピカ」のみ利用可（種子島・屋久島交通）。Suica/PASMO等は不可。",
                "zh": "仅种子岛·屋久岛交通班次支持 Iwasaki IC / Rapica，不可用 Suica/PASMO。",
                "en": "Iwasaki IC & Rapica on Tanegashima Yakushima Kotsu only—not Suica/PASMO.",
            },
            "pass": {
                "ja": "「屋久島ゆったり満喫乗車券」1日¥2,500 / 3日¥4,000 / 4日¥5,000（小人半額）。詳細は路線・運賃タブ。",
                "zh": "「屋久岛悠享乘车券」1日2500 / 3日4000 / 4日5000日元（儿童半价）。详见路线及价格页。",
                "en": "Yakushima day pass: ¥2,500/1d, ¥4,000/3d, ¥5,000/4d (child half). See Routes & fares tab.",
            },
            "transfer": {
                "ja": "白谷雲水峡行きは小原町で乗換。紀元杉行きは合庁前で接続。荒川登山は自然館で乗換。",
                "zh": "往白谷在小原町换乘；纪元杉在县厅前接续；荒川登山在自然馆换乘。",
                "en": "Shiratani: transfer at Kobara. Kigen Sugi: connect at Govt Office. Arakawa: transfer at museum.",
            },
            "weather": {
                "ja": "台風・積雪・大雨で運休の場合あり。出発前に運行状況を確認してください。",
                "zh": "台风、积雪、大雨可能停运，出发前请确认运行状况。",
                "en": "Service may stop for typhoons, snow, or heavy rain. Check before travel.",
            },
            "arakawaSeason": {
                "ja": "荒川登山バスは3～11月のみ運行。",
                "zh": "荒川登山巴士仅 3–11 月运行。",
                "en": "Arakawa trail bus runs Mar–Nov only.",
            },
            **MATSUBANDA_INFO,
        },
        "routes": taneyaku_routes + build_matsubanda_routes(),
        "presets": [
            {"from": "yakusugi_museum", "to": "arakawa_trailhead", "tag": "tourist"},
            {"from": "miyanoura_port", "to": "anbo", "tag": "core"},
            {"from": "miyanoura_port", "to": "airport", "tag": "core"},
            {"from": "miyanoura_port", "to": "yakusugi_museum", "tag": "core"},
            {"from": "miyanoura_port", "to": "shiratani", "tag": "tourist"},
            {"from": "anbo_port", "to": "miyanoura_port", "tag": "core"},
            {"from": "airport", "to": "miyanoura_port", "tag": "core"},
            {"from": "miyanoura_port", "to": "okawa_falls", "tag": "tourist"},
            {"from": "gocho_mae", "to": "kigen_sugi", "tag": "tourist"},
        ],
    }
    data = apply_overrides(data, OVERRIDES)
    for route in data["routes"]:
        for direction in route.get("directions", []):
            direction["columnTrips"] = copy.deepcopy(direction.get("trips", []))
    split_routes_trips(data["routes"])
    return data


def emit_js(data: dict, out: Path) -> None:
    body = json.dumps(data, ensure_ascii=False, indent=2)
    out.write_text(
        "/** 屋久岛公交 — scripts/build_all.py 生成 */\n"
        f"const BUS_DATA = {body};\n",
        encoding="utf-8",
    )


if __name__ == "__main__":
    data = build_data()
    emit_js(data, ROOT / "data.js")
    central = data["routes"][0]
    bad = validate_routes_monotonic(data["routes"])
    print(f"stops: {len(data['stops'])}")
    print(f"central west trips: {len(central['directions'][0]['trips'])}")
    print(f"central east trips: {len(central['directions'][1]['trips'])}")
    if bad:
        print(f"NON-MONOTONIC trips: {len(bad)}", file=sys.stderr)
        for line in bad[:20]:
            print(f"  {line}", file=sys.stderr)
        sys.exit(1)
    print("monotonic check: OK")
