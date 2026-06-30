#!/usr/bin/env python3
"""全站运价核查：map-data.js farePairs vs fare_table + 票价页 lookup 逻辑。"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

from lib.catalog import STOP_CATALOG, build_stops  # noqa: E402
from lib.fare_table import FARE_ANCHORS, build_exact_pairs, lookup_fare, validate_pairs  # noqa: E402
from lib.overrides import merge_fare_pairs  # noqa: E402

MANIFEST = json.loads((ROOT / "sources" / "manifest.json").read_text(encoding="utf-8"))
OVERRIDES = ROOT / MANIFEST["overridesDir"]


def load_map_data() -> dict:
    text = (ROOT / "map-data.js").read_text(encoding="utf-8")
    return json.loads(re.search(r"const MAP_DATA = (\{.*\});", text, re.S).group(1))


def js_get_fare(from_id: str, to_id: str, map_stops: dict, pairs: dict) -> tuple[int | None, str]:
    """与 fare/index.html getFare 一致。"""
    if from_id == to_id:
        return None, "none"
    key = f"{from_id}|{to_id}"
    if key in pairs:
        return pairs[key], "exact"
    a = map_stops.get(from_id, {}).get("fareAnchor") or from_id
    b = map_stops.get(to_id, {}).get("fareAnchor") or to_id
    if a == b:
        return None, "none"
    k2 = f"{a}|{b}"
    if k2 in pairs:
        return pairs[k2], "estimate"
    return None, "none"


def main() -> int:
    stops = build_stops()
    expected = merge_fare_pairs(build_exact_pairs(), OVERRIDES)
    map_data = load_map_data()
    map_pairs = map_data["farePairs"]
    map_stops = map_data["stops"]

    anchor_errors = validate_pairs(expected)
    print("=== FARE_ANCHORS 锚点校验 ===")
    if anchor_errors:
        for e in anchor_errors:
            print("  FAIL", e)
    else:
        print("  OK", len(FARE_ANCHORS), "anchors")

    # map-data 与 Python 重建
    map_keys = {k for k in map_pairs if "|" in k}
    exp_keys = {k for k in expected if "|" in k}
    only_map = sorted(map_keys - exp_keys)
    only_exp = sorted(exp_keys - map_keys)
    wrong = []
    for k in sorted(map_keys & exp_keys):
        if map_pairs[k] != expected[k]:
            wrong.append((k, map_pairs[k], expected[k]))

    print("\n=== map-data.js vs build_exact_pairs ===")
    print(f"  map pairs: {len(map_keys)//2} undirected")
    if only_map:
        print(f"  仅 map 有 ({len(only_map)}):", only_map[:5])
    if only_exp:
        print(f"  仅 Python 有 ({len(only_exp)}):", only_exp[:5])
    if wrong:
        print(f"  金额不一致 ({len(wrong)}):")
        for k, m, e in wrong[:15]:
            print(f"    {k}: map={m} py={e}")
    if not only_map and not only_exp and not wrong:
        print("  OK 完全一致")

    # 全站可查询性（catalog 站点 × JS lookup）
    all_ids = sorted({m["id"] for m in STOP_CATALOG.values()})
    no_fare = []
    estimate_only = []
    exact_count = 0
    for a in all_ids:
        for b in all_ids:
            if a >= b:
                continue
            fare, kind = js_get_fare(a, b, map_stops, map_pairs)
            if fare is None:
                no_fare.append((a, b))
            elif kind == "estimate":
                estimate_only.append((a, b, fare))
            else:
                exact_count += 1

    print("\n=== 全站站点对（票价页逻辑）===")
    print(f"  精确票价对: {exact_count}")
    print(f"  锚点估算对: {len(estimate_only)}")
    print(f"  无法报价: {len(no_fare)}")
    if no_fare:
        print("  无法报价示例（前 12）:")
        for a, b in no_fare[:12]:
            print(f"    {a} → {b}")

    # 常用区间 spot check
    spots = [
        ("miyanoura_port", "yakusugi_museum", 1020),
        ("miyanoura_port_entrance", "yakusugi_museum", 1020),
        ("miyanoura", "yakusugi_museum", 590),
        ("miyanoura_port", "airport", 590),
        ("anbo_port", "yakusugi_museum", 280),
        ("kobara", "shiratani", None),
    ]
    print("\n=== 常用区间 spot check ===")
    for fr, to, exp_yen in spots:
        fare, kind = js_get_fare(fr, to, map_stops, map_pairs)
        ok = exp_yen is None or fare == exp_yen
        mark = "OK" if ok else "FAIL"
        print(f"  {mark} {fr}→{to}: {fare}円 ({kind})" + (f" 期望{exp_yen}" if exp_yen else ""))

    return 1 if anchor_errors or wrong or only_map or only_exp else 0


if __name__ == "__main__":
    raise SystemExit(main())
