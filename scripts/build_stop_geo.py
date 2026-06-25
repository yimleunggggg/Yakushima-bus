#!/usr/bin/env python3
"""Build bus-stops-geo.js — OSM-first (ref + name), KSJ P11 fallback, manual. No interpolation."""

from __future__ import annotations

import json
import math
import re
import subprocess
import sys
import unicodedata
import urllib.parse
import urllib.request
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

from lib.catalog import build_stops  # noqa: E402

MAP_DATA = ROOT / "map-data.js"
OSM_CACHE = ROOT / "sources" / "osm-bus-stops.json"
OSM_ROADS_CACHE = ROOT / "sources" / "osm-ring-roads.json"
KSJ_GEOJSON = ROOT / "sources" / "ksj" / "P11-22_46.geojson"
KSJ_ZIP = ROOT / "sources" / "ksj" / "P11-22_46_SHP.zip"
KSJ_YAKU = ROOT / "sources" / "ksj-yakushima-bus-stops.json"
OUT = ROOT / "bus-stops-geo.js"
STOPS_JSON = ROOT / "sources" / "stops.json"
OVERPASS = "https://maps.mail.ru/osm/tools/overpass/api/interpreter"
KSJ_ZIP_URL = "https://nlftp.mlit.go.jp/ksj/gml/datalist/P11-22_46_GML.zip"
KSJ_REFERER = "https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-P11.html"

OVERPASS_STOPS = """
[out:json][timeout:120];
area["name:ja"="屋久島町"]->.a;
(
  node["highway"="bus_stop"](area.a);
  node["public_transport"="platform"]["bus"="yes"](area.a);
  node["highway"="platform"]["public_transport"="platform"](area.a);
);
out body;
"""

OVERPASS_ROADS = """
[out:json][timeout:120];
area["name:ja"="屋久島町"]->.a;
way["highway"~"^(primary|secondary|tertiary|trunk|unclassified|residential)$"](area.a);
out geom;
"""

# Verified manually (trailheads / hubs). nagata corrected to west coast.
MANUAL: dict[str, tuple[float, float]] = {
    "nagata": (30.39592, 130.42619),
    "miyanoura_port": (30.43268, 130.57138),
    "yakusugi_museum": (30.38815, 130.56875),
    "shiratani": (30.35828, 130.51665),
    "arakawa_trailhead": (30.34755, 130.5348),
}

# Per stop-group longitude bounds (WGS84). Rejects sea / wrong-island matches.
GROUP_LNG: dict[str, tuple[float, float]] = {
    "nagata": (130.40, 130.58),
    "miyanoura": (130.53, 130.63),
    "airport": (130.57, 130.68),
    "anbo": (130.54, 130.72),
    "east": (130.53, 130.78),
    "west": (130.41, 130.56),
    "shiratani": (130.48, 130.58),
    "arakawa": (130.51, 130.60),
}

YAKU_BBOX = (30.22, 130.40, 30.46, 130.78)  # lat_min, lng_min, lat_max, lng_max
MAX_ROAD_M = 150.0

KSJ_NAMES: dict[str, list[str]] = {
    "nagata": ["永田"],
    "inakahama": ["田舎浜"],
    "yoshida": ["吉田"],
    "hitomaru": ["一湊"],
    "shitoko": ["志戸子"],
    "fukagawa": ["深川"],
    "miyanoura_port": ["宮之浦港"],
    "miyanoura_port_entrance": ["宮之浦港入口"],
    "miyanoura": ["宮之浦"],
    "a_coop": ["Aコープ前", "Ａコープ前"],
    "miyaura_elem": ["宮浦小前"],
    "koko_mae": ["高校前"],
    "asahi": ["旭町"],
    "kobara": ["小原町"],
    "kusugawa": ["楠川"],
    "kunugawa": ["椨川"],
    "kozeta": ["小瀬田"],
    "shionomichi": ["塩ノ道", "塩の道"],
    "airport": ["空港"],
    "hayasaki": ["早崎"],
    "takamibashi": ["高見橋"],
    "towaho": ["永久保"],
    "funayuki": ["船行"],
    "chuo": ["中央"],
    "gocho_mae": ["合庁前"],
    "police_mae": ["警察署前"],
    "anbo_port": ["安房港"],
    "naka_iin_mae": ["仲医院前"],
    "anbo": ["安房"],
    "makino": ["牧野"],
    "yakusugi_museum": ["屋久杉自然館"],
    "morihisa_jinja": ["盛久神社"],
    "hirano": ["平野"],
    "mugi": ["麦生"],
    "botanical_park": ["ボタニカルリサーチパーク"],
    "hara": ["原"],
    "onokaido": ["尾之間"],
    "saman_hotel": ["サマナホテルヤクシマ", "JRホテル", "サマナホテル"],
    "hotel_yakushima": ["ザホテルヤクシマ", "いわさきホテル", "いわさきホテル入口"],
    "kojima": ["小島"],
    "hirauchi_onsen": ["平内海中温泉"],
    "yunuma": ["湯泊"],
    "naka": ["中間"],
    "kurio_bashi": ["栗生橋", "栗生"],
    "okawa_falls": ["大川の滝"],
    "ushiroka_park": ["牛床公園"],
    "shiratani": ["白谷雲水峡"],
    "arakawa_sancho": ["荒川三叉路"],
    "arakawa_trailhead": ["荒川登山口"],
    "yakusugiland": ["屋久杉ランド", "ヤクスギランド"],
    "kigen_sugi": ["紀元杉"],
    "miyanoura_port_early": ["宮之浦港"],
}

OSM_NAMES: dict[str, list[str]] = {
    "nagata": ["永田", "永田入口"],
    "inakahama": ["いなか浜", "田舎浜"],
    "yoshida": ["吉田", "吉田橋"],
    "hitomaru": ["一湊", "一湊入口"],
    "shitoko": ["志戸子"],
    "fukagawa": ["深川"],
    "miyanoura_port_entrance": ["宮之浦港入口"],
    "miyanoura": ["宮之浦"],
    "a_coop": ["Aコープ前", "Ａコープ前", "ヤクデン前"],
    "miyaura_elem": ["宮浦小前"],
    "koko_mae": ["高校前"],
    "asahi": ["旭町", "旭"],
    "kobara": ["小原町"],
    "kusugawa": ["楠川", "楠川入口"],
    "kunugawa": ["椨川"],
    "kozeta": ["小瀬田", "西小瀬田"],
    "shionomichi": ["塩の道", "塩ノ道"],
    "airport": ["空港", "空港前"],
    "hayasaki": ["早崎"],
    "takamibashi": ["高見橋"],
    "towaho": ["永久保"],
    "funayuki": ["船行"],
    "chuo": ["中央"],
    "gocho_mae": ["合庁前"],
    "police_mae": ["警察署前"],
    "anbo_port": ["安房港"],
    "naka_iin_mae": ["仲医院前"],
    "anbo": ["安房"],
    "makino": ["牧野"],
    "morihisa_jinja": ["盛久神社"],
    "kurio_bashi": ["栗生橋", "栗生"],
    "arakawa_trailhead": ["荒川登山口"],
    "yakusugiland": ["ヤクスギランド", "屋久杉ランド"],
    "kigen_sugi": ["紀元杉"],
    "okawa_falls": ["大川の滝"],
    "hirauchi_onsen": ["平内海中温泉", "海中温泉"],
    "yunuma": ["湯泊"],
    "naka": ["中間"],
    "kojima": ["小島", "Koshima"],
    "ushiroka_park": ["牛床公園"],
    "shiratani": ["白谷雲水峡"],
    "arakawa_sancho": ["荒川三叉路"],
    "botanical_park": ["ボタニカルリサーチパーク"],
    "hirano": ["平野"],
    "mugi": ["麦生"],
    "hara": ["原", "Hara"],
    "onokaido": ["尾之間", "Onoaida", "尾の間"],
}


def load_stops() -> dict:
    """Canonical stop list — scripts/lib/catalog.py (same as data.js / map-data.js)."""
    return build_stops()


def export_stops_json(stops: dict) -> None:
    payload = {
        "meta": {
            "source": "scripts/lib/catalog.py",
            "stopCount": len(stops),
            "note": "Master stop table: id, no, ja/zh/en, group. Edit catalog.py then run build_all.py.",
        },
        "stops": stops,
    }
    STOPS_JSON.parent.mkdir(parents=True, exist_ok=True)
    STOPS_JSON.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def assert_map_stops_match(stops: dict) -> None:
    """Warn if generated map-data.js drifts from catalog."""
    if not MAP_DATA.exists():
        return
    js = f"""
const fs = require('fs');
const code = fs.readFileSync({json.dumps(str(MAP_DATA))}, 'utf8').replace(/^const MAP_DATA/m, 'var MAP_DATA');
eval(code);
console.log(JSON.stringify(Object.keys(MAP_DATA.stops).sort()));
"""
    raw = subprocess.check_output(["node", "-e", js], cwd=ROOT, text=True)
    map_ids = set(json.loads(raw))
    cat_ids = set(stops.keys())
    if map_ids != cat_ids:
        only_map = sorted(map_ids - cat_ids)
        only_cat = sorted(cat_ids - map_ids)
        raise SystemExit(
            f"catalog vs map-data.js mismatch — run build_all.py --map\n"
            f"  only in map-data: {only_map}\n  only in catalog: {only_cat}"
        )


def norm(s: str) -> str:
    s = unicodedata.normalize("NFKC", s or "")
    return re.sub(r"\s+", "", s)


def overpass_post(query: str, cache: Path) -> dict:
    if cache.exists():
        return json.loads(cache.read_text(encoding="utf-8"))
    req = urllib.request.Request(
        OVERPASS,
        data=urllib.parse.urlencode({"data": query}).encode(),
        method="POST",
        headers={"User-Agent": "Yakushima-bus/1.0 (build_stop_geo.py)"},
    )
    with urllib.request.urlopen(req, timeout=120) as resp:
        data = json.loads(resp.read().decode())
    cache.parent.mkdir(parents=True, exist_ok=True)
    cache.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    return data


def fetch_osm_nodes() -> list[dict]:
    data = overpass_post(OVERPASS_STOPS, OSM_CACHE)
    nodes: list[dict] = []
    for e in data.get("elements", []):
        if e.get("type") != "node" or "lat" not in e:
            continue
        nodes.append({"id": e["id"], "lat": e["lat"], "lon": e["lon"], "tags": e.get("tags", {})})
    return nodes


def fetch_road_segments() -> list[tuple[tuple[float, float], tuple[float, float]]]:
    data = overpass_post(OVERPASS_ROADS, OSM_ROADS_CACHE)
    segs: list[tuple[tuple[float, float], tuple[float, float]]] = []
    for e in data.get("elements", []):
        if e.get("type") != "way":
            continue
        geom = e.get("geometry") or []
        for i in range(len(geom) - 1):
            a, b = geom[i], geom[i + 1]
            segs.append(((a["lat"], a["lon"]), (b["lat"], b["lon"])))
    return segs


def haversine_m(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    r = 6_371_000.0
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dp = math.radians(lat2 - lat1)
    dl = math.radians(lng2 - lng1)
    a = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return 2 * r * math.asin(math.sqrt(a))


def point_seg_dist_m(
    plat: float, plng: float,
    a: tuple[float, float], b: tuple[float, float],
) -> float:
    lat1, lng1 = a
    lat2, lng2 = b
    dx, dy = lng2 - lng1, lat2 - lat1
    if dx == 0 and dy == 0:
        return haversine_m(plat, plng, lat1, lng1)
    t = max(0.0, min(1.0, ((plng - lng1) * dx + (plat - lat1) * dy) / (dx * dx + dy * dy)))
    clat = lat1 + t * dy
    clng = lng1 + t * dx
    return haversine_m(plat, plng, clat, clng)


def min_road_dist_m(lat: float, lng: float, segs: list) -> float:
    if not segs:
        return 0.0
    return min(point_seg_dist_m(lat, lng, a, b) for a, b in segs)


def in_yaku_bbox(lat: float, lng: float) -> bool:
    lat_min, lng_min, lat_max, lng_max = YAKU_BBOX
    return lat_min <= lat <= lat_max and lng_min <= lng <= lng_max


def in_group_lng(group: str, lng: float) -> bool:
    bounds = GROUP_LNG.get(group)
    if not bounds:
        return True
    lo, hi = bounds
    return lo <= lng <= hi


def ensure_ksj_geojson() -> Path:
    if KSJ_GEOJSON.exists():
        return KSJ_GEOJSON
    if KSJ_ZIP.exists():
        return KSJ_GEOJSON
    print("Downloading KSJ P11-22 (Kagoshima)…")
    req = urllib.request.Request(KSJ_ZIP_URL, headers={"Referer": KSJ_REFERER})
    with urllib.request.urlopen(req, timeout=180) as resp:
        KSJ_ZIP.parent.mkdir(parents=True, exist_ok=True)
        KSJ_ZIP.write_bytes(resp.read())
    return KSJ_GEOJSON


def build_ksj_yakushima() -> list[dict]:
    ensure_ksj_geojson()
    if not KSJ_GEOJSON.exists() and KSJ_ZIP.exists():
        with zipfile.ZipFile(KSJ_ZIP) as zf:
            geo_names = [n for n in zf.namelist() if n.endswith(".geojson")]
            if geo_names:
                KSJ_GEOJSON.write_bytes(zf.read(geo_names[0]))
    if not KSJ_GEOJSON.exists():
        raise FileNotFoundError(f"KSJ geojson missing: {KSJ_GEOJSON}")

    data = json.loads(KSJ_GEOJSON.read_text(encoding="utf-8"))
    out: list[dict] = []
    for f in data.get("features", []):
        pr = f.get("properties") or {}
        town = pr.get("P11_002") or ""
        route = pr.get("P11_003_01") or ""
        if "屋久" not in town and "屋久" not in route:
            continue
        coords = f.get("geometry", {}).get("coordinates")
        if not coords or len(coords) < 2:
            continue
        lng, lat = float(coords[0]), float(coords[1])
        if not in_yaku_bbox(lat, lng):
            continue
        out.append({"name": pr.get("P11_001", ""), "lat": lat, "lng": lng, "operator": town})

    KSJ_YAKU.parent.mkdir(parents=True, exist_ok=True)
    KSJ_YAKU.write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
    return out


def name_index(items: list[dict], key: str = "name") -> dict[str, list[dict]]:
    idx: dict[str, list[dict]] = {}
    for item in items:
        name = norm(item.get(key) or item.get("tags", {}).get("name", ""))
        if name:
            idx.setdefault(name, []).append(item)
    return idx


def ref_index(osm_nodes: list[dict]) -> dict[str, list[dict]]:
    idx: dict[str, list[dict]] = {}
    for node in osm_nodes:
        ref = norm(node.get("tags", {}).get("ref", ""))
        if ref:
            idx.setdefault(ref, []).append(node)
    return idx


def pick_best(cands: list[dict], group: str) -> dict | None:
    filtered = []
    for c in cands:
        lat = c["lat"]
        lng = c.get("lng", c.get("lon"))
        if not in_yaku_bbox(lat, lng) or not in_group_lng(group, lng):
            continue
        filtered.append(c)
    if not filtered:
        return None
    if len(filtered) == 1:
        return filtered[0]
    # Prefer western lng for nagata/west groups, central for miyanoura, etc.
    if group in ("nagata", "west", "shiratani"):
        return min(filtered, key=lambda c: c.get("lng", c.get("lon")))
    if group in ("east", "anbo"):
        return min(filtered, key=lambda c: (c.get("lng", c.get("lon")), c["lat"]))
    return filtered[0]


def resolve_coords(stops: dict, ksj: list[dict], osm_nodes: list[dict], road_segs: list) -> dict[str, tuple[str, float, float]]:
    ksj_idx = name_index(ksj)
    osm_idx = name_index(osm_nodes)
    osm_ref_idx = ref_index(osm_nodes)
    resolved: dict[str, tuple[str, float, float]] = {}

    def accept(sid: str, source: str, lat: float, lng: float) -> bool:
        if sid not in stops:
            return False
        group = stops[sid].get("group", "")
        if not in_yaku_bbox(lat, lng):
            return False
        if not in_group_lng(group, lng):
            return False
        if source == "osm" and lng > 130.68 and road_segs and min_road_dist_m(lat, lng, road_segs) > MAX_ROAD_M:
            return False
        resolved[sid] = (source, round(lat, 6), round(lng, 6))
        return True

    for sid, (lat, lng) in MANUAL.items():
        accept(sid, "manual", lat, lng)

    def try_ref(sid: str) -> None:
        if sid in resolved:
            return
        no = norm(stops.get(sid, {}).get("no", ""))
        if not no:
            return
        group = stops.get(sid, {}).get("group", "")
        node = pick_best(osm_ref_idx.get(no, []), group)
        if not node:
            return
        accept(sid, "osm", node["lat"], node.get("lng", node.get("lon")))

    def try_names(sid: str, names: list[str], source: str, idx: dict[str, list[dict]]) -> None:
        if sid in resolved:
            return
        group = stops.get(sid, {}).get("group", "")
        cands: list[dict] = []
        for name in names:
            cands.extend(idx.get(norm(name), []))
        node = pick_best(cands, group)
        if not node:
            return
        lat = node["lat"]
        lng = node.get("lng", node.get("lon"))
        accept(sid, source, lat, lng)

    for sid in stops:
        try_ref(sid)

    for sid in stops:
        names = OSM_NAMES.get(sid)
        if not names:
            ja = norm(stops[sid].get("ja", ""))
            names = [ja] if ja else []
        try_names(sid, names, "osm", osm_idx)

    for sid in stops:
        names = KSJ_NAMES.get(sid)
        if not names:
            ja = norm(stops[sid].get("ja", ""))
            names = [ja] if ja else []
        try_names(sid, names, "ksj", ksj_idx)

    return resolved


def main() -> None:
    stops = load_stops()
    export_stops_json(stops)
    assert_map_stops_match(stops)
    ksj = build_ksj_yakushima()
    osm_nodes = fetch_osm_nodes()
    road_segs = fetch_road_segments()
    resolved = resolve_coords(stops, ksj, osm_nodes, road_segs)

    out_stops: dict[str, dict] = {}
    for sid, (source, lat, lng) in resolved.items():
        out_stops[sid] = {
            "lat": lat,
            "lng": lng,
            "source": source,
        }

    west_groups = {"nagata", "west", "shiratani", "arakawa"}
    west = sum(1 for sid in out_stops if stops[sid].get("group") in west_groups)
    east_groups = {"east", "anbo", "airport"}
    east = sum(1 for sid in out_stops if stops[sid].get("group") in east_groups)
    sea = sum(
        1
        for st in out_stops.values()
        if st.get("source") == "osm"
        and st["lng"] > 130.68
        and road_segs
        and min_road_dist_m(st["lat"], st["lng"], road_segs) > MAX_ROAD_M
    )

    payload = {
        "meta": {
            "updatedAt": "2026-06-24",
            "catalog": "sources/stops.json",
            "method": "OSM-first (ref + name) + KSJ P11 fallback + manual; coords only — names from catalog",
            "ksjStops": len(ksj),
            "osmNodes": len(osm_nodes),
            "roadSegments": len(road_segs),
            "stopCount": len(out_stops),
            "catalogStops": len(stops),
            "westCoast": west,
            "eastCoast": east,
        },
        "stops": out_stops,
    }
    OUT.write_text(
        "/** Bus stop WGS84 — scripts/build_stop_geo.py */\n"
        f"window.BUS_STOP_GEO = {json.dumps(payload, ensure_ascii=False, indent=2)};\n",
        encoding="utf-8",
    )
    print(
        f"→ {OUT.relative_to(ROOT)} ({len(out_stops)}/{len(stops)} verified; "
        f"west={west} east={east} sea={sea})"
    )


if __name__ == "__main__":
    main()
