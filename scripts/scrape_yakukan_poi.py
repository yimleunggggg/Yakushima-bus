#!/usr/bin/env python3
"""Scrape yakukan.jp spot pages → sources/poi/spots.json (coords from Google embed)."""

from __future__ import annotations

import json
import re
import time
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "sources" / "poi" / "spots.json"
UA = "Yakushima-bus-poi-scraper/1.0 (+https://yakushimabus.com)"

GENRE_PAGES = [
    ("historic", "https://yakukan.jp/spot/genre/historic/"),
    ("historic", "https://yakukan.jp/spot/genre/historic/page/2/"),
    ("spa", "https://yakukan.jp/spot/genre/spa/"),
    ("beach", "https://yakukan.jp/spot/genre/beach/"),
    ("souvenir", "https://yakukan.jp/spot/genre/souvenir-shop/"),
    ("souvenir", "https://yakukan.jp/spot/genre/souvenir-shop/page/2/"),
    ("outdoor_rental", "https://yakukan.jp/spot/business/outdoor-equipment/"),
]

MY_MAPS = [
    ("shops", "1lS1LmUKkECg6Tr4sBdeYlDNnL3hqzT0"),
    ("atm", "1LAEd59YvMNmts7It2W2L26TPqHokIzk"),
]


def fetch(url: str) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read().decode("utf-8", errors="replace")


def spot_ids_from_listing(html: str) -> list[str]:
    return sorted(set(re.findall(r"spot/(\d+)\.html", html)))


def parse_embed_coords(html: str) -> tuple[float, float] | None:
    m = re.search(r"!3d(-?\d+\.?\d*)!2d(-?\d+\.?\d*)", html)
    if m:
        return float(m.group(1)), float(m.group(2))
    m = re.search(r"!2d(-?\d+\.?\d*)!3d(-?\d+\.?\d*)", html)
    if m:
        return float(m.group(2)), float(m.group(1))
    return None


def truncate_desc(text: str, max_sentences: int = 2, max_len: int = 220) -> str:
    text = re.sub(r"\s+", " ", text).strip()
    if not text:
        return ""
    parts = re.split(r"(?<=[。！？!?])", text)
    out = ""
    sentences = 0
    for part in parts:
        part = part.strip()
        if not part:
            continue
        if out and len(out) + len(part) > max_len:
            break
        out += part
        if re.search(r"[。！？!?]$", part):
            sentences += 1
        if sentences >= max_sentences:
            break
    out = out.strip()
    return out or text[:max_len].strip()


def parse_og_description(html: str) -> str:
    m = re.search(r'property="og:description"\s+content="([^"]+)"', html)
    return m.group(1).strip() if m else ""


def parse_article_lead(html: str) -> str:
    m = re.search(r'<article class="spot-page">(.*?)</article>', html, re.S)
    if not m:
        return ""
    chunk = re.sub(r"<script[^>]*>.*?</script>", " ", m.group(1), flags=re.S)
    chunk = re.sub(r"<style[^>]*>.*?</style>", " ", chunk, flags=re.S)
    chunk = re.sub(r"<[^>]+>", " ", chunk)
    chunk = re.sub(r"\s+", " ", chunk).strip()
    chunk = re.split(r"行きたいリスト|details|詳細情報", chunk)[0].strip()
    return chunk


def parse_spot_page(spot_id: str) -> dict | None:
    url = f"https://yakukan.jp/spot/{spot_id}.html"
    try:
        html = fetch(url)
    except Exception as e:
        print(f"  skip {spot_id}: {e}")
        return None
    coords = parse_embed_coords(html)
    if not coords:
        print(f"  no coords {spot_id}")
        return None
    lat, lng = coords
    title_m = re.search(r"<h1[^>]*>([^<]+)", html)
    title_ja = title_m.group(1).strip() if title_m else f"spot-{spot_id}"
    desc_ja = truncate_desc(parse_og_description(html) or parse_article_lead(html))
    return {
        "id": f"yakukan-{spot_id}",
        "source": "yakukan",
        "sourceUrl": url,
        "name": {"ja": title_ja, "zh": title_ja, "en": title_ja},
        "desc": {"ja": desc_ja, "zh": desc_ja, "en": desc_ja},
        "lat": lat,
        "lng": lng,
    }


def normalize_shop_name(name: str) -> str:
    s = name.strip()
    s = s.replace("Ａ", "A").replace("ｍ", "m").replace("Ｍ", "M")
    s = re.sub(r"\s+", "", s)
    s = s.lower()
    s = re.sub(r"[（）()]", "", s)
    for noise in ("鹿児島", "かごしま", "kagoshima"):
        s = s.replace(noise, "")
    return s


def lookup_shop_meta(name: str, directory: dict[str, dict]) -> dict:
    key = normalize_shop_name(name)
    if key in directory:
        return directory[key]
    branch_m = re.search(r"(宮之浦店|安房店|尾之間店|尾の間店)", name)
    if branch_m and ("コープ" in name or "coop" in key):
        branch = branch_m.group(1).replace("尾の間", "尾之間")
        for meta in directory.values():
            nj = meta.get("name_ja", "")
            if "コープ" in nj and branch in nj:
                return meta
    for dk, meta in directory.items():
        if key in dk or dk in key:
            return meta
        nj = normalize_shop_name(meta.get("name_ja", ""))
        if nj and (key in nj or nj in key):
            return meta
    return {}


def classify_shop(name: str) -> str:
    if "薬局" in name or "ドラッグ" in name:
        return "pharmacy"
    return "supermarket"


def parse_shop_directory() -> dict[str, dict]:
    try:
        html = fetch("https://yakukan.jp/safe-travel/shop.html")
    except Exception as e:
        print(f"  shop.html failed: {e}")
        return {}
    shops: dict[str, dict] = {}
    for m in re.finditer(
        r"<th>.*?<span[^>]*>\d+</span>\s*([^<]+)</th>\s*<td>(.*?)</td>",
        html,
        re.S,
    ):
        name = re.sub(r"<[^>]+>", "", m.group(1)).strip()
        td = re.sub(r"<br\s*/?>", "\n", m.group(2))
        td_plain = re.sub(r"<[^>]+>", "", td)
        buys_m = re.search(r"【購入できるもの】(.+?)(?:\n|$)", td_plain)
        desc_ja = ""
        if buys_m:
            desc_ja = truncate_desc(buys_m.group(1).strip(), max_sentences=1)
        shops[normalize_shop_name(name)] = {"name_ja": name, "desc_ja": desc_ja}
    print(f"  shop directory: {len(shops)} entries")
    return shops


def split_kml_names(name: str) -> list[str]:
    """One KML placemark may list multiple ATMs separated by newlines."""
    parts = [p.strip() for p in re.split(r"[\r\n]+", name) if p.strip()]
    return parts or [name.strip()]


def parse_kml_placemarks(
    kml: str, *, shop_directory: dict[str, dict] | None = None
) -> list[dict]:
    root = ET.fromstring(kml)
    ns = {"k": "http://www.opengis.net/kml/2.2"}
    out = []
    for i, pm in enumerate(root.findall(".//k:Placemark", ns)):
        name_el = pm.find("k:name", ns)
        desc_el = pm.find("k:description", ns)
        coord_el = pm.find(".//k:coordinates", ns)
        if coord_el is None or not coord_el.text:
            continue
        parts = coord_el.text.strip().split(",")
        if len(parts) < 2:
            continue
        lng, lat = float(parts[0]), float(parts[1])
        raw_name = (name_el.text or "").strip() if name_el is not None else f"place-{i}"
        desc = ""
        if desc_el is not None and desc_el.text:
            desc = re.sub(r"<[^>]+>", " ", desc_el.text)
            desc = truncate_desc(re.sub(r"\s+", " ", desc).strip())
        category = classify_shop(raw_name) if shop_directory is not None else "atm"
        cat_slug = category if shop_directory is not None else "atm"
        names = split_kml_names(raw_name) if shop_directory is None else [raw_name]
        for j, name in enumerate(names):
            meta = lookup_shop_meta(name, shop_directory or {}) if shop_directory else {}
            spot_desc = meta["desc_ja"] if meta.get("desc_ja") else desc
            spot_id = f"gmap-{cat_slug}-{i}" if j == 0 else f"gmap-{cat_slug}-{i}-{j}"
            out.append(
                {
                    "id": spot_id,
                    "source": "google_my_maps",
                    "sourceUrl": "https://yakukan.jp/safe-travel/shop.html"
                    if shop_directory is not None
                    else "https://yakukan.jp/safe-travel/atm.html",
                    "name": {"ja": name, "zh": name, "en": name},
                    "desc": {"ja": spot_desc, "zh": spot_desc, "en": spot_desc},
                    "lat": lat,
                    "lng": lng,
                    "categories": [category] if shop_directory is not None else ["atm"],
                }
            )
    return out


def main():
    spots_by_id: dict[str, dict] = {}
    shop_directory = parse_shop_directory()

    for category, list_url in GENRE_PAGES:
        print(f"listing {category} …")
        ids = spot_ids_from_listing(fetch(list_url))
        for sid in ids:
            pid = f"yakukan-{sid}"
            if pid in spots_by_id:
                spots_by_id[pid]["categories"] = sorted(
                    set(spots_by_id[pid].get("categories", []) + [category])
                )
                continue
            print(f"  spot {sid}")
            row = parse_spot_page(sid)
            time.sleep(0.35)
            if not row:
                continue
            row["categories"] = [category]
            spots_by_id[row["id"]] = row
        time.sleep(0.5)

    for kind, mid in MY_MAPS:
        print(f"kml {kind} …")
        kml_url = f"https://www.google.com/maps/d/kml?mid={mid}&forcekml=1"
        try:
            kml = fetch(kml_url)
            rows = parse_kml_placemarks(
                kml,
                shop_directory=shop_directory if kind == "shops" else None,
            )
            for row in rows:
                spots_by_id[row["id"]] = row
            print(f"  {len(rows)} placemarks")
        except Exception as e:
            print(f"  kml failed: {e}")

    meta = {
        "updatedAt": time.strftime("%Y-%m-%d"),
        "sources": {
            "historic": "https://yakukan.jp/spot/genre/historic/",
            "spa": "https://yakukan.jp/spot/genre/spa/",
            "beach": "https://yakukan.jp/spot/genre/beach/",
            "souvenir": "https://yakukan.jp/spot/genre/souvenir-shop/",
            "outdoor_rental": "https://yakukan.jp/spot/business/outdoor-equipment/",
            "supermarket": "https://yakukan.jp/safe-travel/shop.html",
            "pharmacy": "https://yakukan.jp/safe-travel/shop.html",
            "atm": "https://yakukan.jp/safe-travel/atm.html",
            "toilet": "https://yakukan.jp/safe-travel/public-restroom.html",
            "toilet_barrier_free": "https://yakukan.jp/wp-content/uploads/2024/01/barrierfree-map.pdf",
        },
        "categories": {
            "historic": {"ja": "史跡・名所", "zh": "名胜古迹", "en": "Historic sites"},
            "spa": {"ja": "温泉", "zh": "温泉", "en": "Hot springs"},
            "beach": {"ja": "ビーチ", "zh": "海滩", "en": "Beaches"},
            "souvenir": {"ja": "お土産", "zh": "纪念品店", "en": "Souvenir shops"},
            "outdoor_rental": {"ja": "アウトドアレンタル", "zh": "户外装备租赁", "en": "Outdoor rental"},
            "supermarket": {"ja": "スーパー", "zh": "超市", "en": "Supermarkets"},
            "pharmacy": {"ja": "薬局・ドラッグ", "zh": "药店", "en": "Pharmacies"},
            "atm": {"ja": "ATM", "zh": "ATM", "en": "ATMs"},
        },
        "pdfLayers": [
            {
                "id": "toilet",
                "title": {"ja": "公衆トイレ", "zh": "公共厕所", "en": "Public restrooms"},
                "url": "https://yakukan.jp/wp-content/uploads/2024/02/yakushima-manor-guide.pdf#page=13",
                "note": {
                    "ja": "屋久島マナーガイド p.21–22 の地図を参照（PDF内座標は本マップ未収録）",
                    "zh": "详见登山者礼仪指南 PDF 第 21–22 页地图（坐标未录入本互动地图）",
                    "en": "See Manor Guide PDF pp.21–22 (coords not in this interactive map yet)",
                },
            },
            {
                "id": "toilet_barrier_free",
                "title": {"ja": "バリアフリートイレ", "zh": "无障碍厕所", "en": "Barrier-free restrooms"},
                "url": "https://yakukan.jp/wp-content/uploads/2024/01/barrierfree-map.pdf",
                "note": {
                    "ja": "PDFマップを参照",
                    "zh": "请参阅 PDF 地图",
                    "en": "See PDF map",
                },
            },
        ],
        "supplements": [
            {
                "id": "yesyakushima_hot_springs",
                "categories": ["spa"],
                "title": {
                    "ja": "屋久島温泉ガイド",
                    "zh": "屋久岛温泉指南",
                    "en": "Yakushima hot springs guide",
                },
                "url": "https://yesyakushima.com/yakushima-travel-guide/travel-guidance/hot-springs/",
                "note": {
                    "ja": "YES YAKUSHIMA — 種類・利用方法・マナー",
                    "zh": "YES YAKUSHIMA — 种类、泡法与礼仪",
                    "en": "YES YAKUSHIMA — types, etiquette & tips",
                },
            },
        ],
    }

    data = {"meta": meta, "spots": list(spots_by_id.values())}
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"wrote {len(data['spots'])} spots → {OUT}")


if __name__ == "__main__":
    main()
