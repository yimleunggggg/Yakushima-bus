#!/usr/bin/env python3
"""审查 findTrips 班次耗时是否在 PDF 统计上下限内。"""

from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
STATS = ROOT / "sources" / "segment-stats.json"
DAY_TYPES = ("weekday", "saturday", "sunday_holiday")


def load_stats() -> dict:
    if not STATS.exists():
        print("ERROR: run scripts/build_segment_stats.py first", file=sys.stderr)
        raise SystemExit(2)
    return json.loads(STATS.read_text(encoding="utf-8"))


def cluster_map(raw: dict) -> dict[str, list[str]]:
    out: dict[str, list[str]] = {}
    for members in raw.values():
        for sid in members:
            out[sid] = members
    return out


def node_all_segments() -> list[dict]:
    script = r"""
const fs=require('fs');const vm=require('vm');
const s={};vm.createContext(s);
vm.runInContext(fs.readFileSync('data.js','utf8')+'\nthis.BUS_DATA=BUS_DATA;',s);
vm.runInContext(fs.readFileSync('app-core.js','utf8').replace('AppCore.applyDocLang(AppCore.getLang());','')+'\nthis.AppCore=AppCore;',s);
const {AppCore,BUS_DATA}=s;
const central=BUS_DATA.routes.find(r=>r.id==='central');
const out=[];
for (const dir of central.directions) {
  const stops=dir.stops;
  for (let fi=0;fi<stops.length;fi++)
    for (let ti=fi+1;ti<stops.length;ti++)
      for (const day of ['weekday','saturday','sunday_holiday']) {
        for (const t of AppCore.findTrips(stops[fi],stops[ti],day)) {
          const d=AppCore.parseMinutes(t.arr)-AppCore.parseMinutes(t.dep);
          out.push({from:stops[fi],to:stops[ti],dep:t.dep,arr:t.arr,d,day,route:t.route.id,dir:t.dir.id});
        }
      }
}
console.log(JSON.stringify(out));
"""
    out = subprocess.check_output(["node", "-e", script], cwd=ROOT, text=True)
    return json.loads(out)


def main() -> int:
    stats = load_stats()
    abs_max = stats["absMaxMinutes"]
    pdf_max = stats["pdfWestGlobalMaxSegment"]
    segments = node_all_segments()
    over_abs = [s for s in segments if s["d"] > abs_max]
    over_pdf = [s for s in segments if s["d"] > pdf_max + 5]

    print(f"=== 班次耗时审查 (上限 {abs_max}m, PDF西向最大站间 {pdf_max}m) ===")
    print(f"findTrips 区间班次: {len(segments)}")
    print(f"超过 {abs_max}m: {len(over_abs)}")
    for s in sorted(over_abs, key=lambda x: -x["d"])[:15]:
        print(f"  {s['d']}m {s['from']}→{s['to']} {s['dep']}→{s['arr']} ({s['day']})")
    if over_pdf and not over_abs:
        print(f"超过 PDF+5m ({pdf_max+5}): {len(over_pdf)} (仅提示)")

    return 1 if over_abs else 0


if __name__ == "__main__":
    raise SystemExit(main())
