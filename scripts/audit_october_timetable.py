#!/usr/bin/env python3
"""Independent row-multiset and hand-checked connection anchors for October PDF."""
import json,re
from collections import Counter
from pathlib import Path
import fitz
from lib.catalog import no_to_id
ROOT=Path(__file__).resolve().parents[1]

def audit():
    m=json.loads((ROOT/'sources/manifest.json').read_text())
    raw=(ROOT/'data.js').read_text();data=json.loads(raw[raw.index('{'):raw.rindex('}')+1])
    with fitz.open(ROOT/m['sources'][m['parseSource']]['file']) as doc:
        words=doc[0].get_text('words')
    central=next(r for r in data['routes'] if r['id']=='central'); count=0
    for d in central['directions']:
        side=d['id']; sx,lo,hi=(28,82,490) if side=='west' else (513,568,974)
        rows=[w for w in words if abs(w[0]-sx)<3 and 90<w[1]<499 and w[4].isdigit()]
        assert len(rows)==42 and len(d['columnTrips'])==17
        for row in rows:
            expected=Counter(w[4] for w in words if lo<w[0]<hi and abs(w[1]-row[1])<1.6 and re.fullmatch(r'\d{1,2}:\d{2}',w[4]))
            actual=Counter(t['times'][no_to_id(row[4])] for t in d['columnTrips'] if no_to_id(row[4]) in t['times'])
            assert expected==actual, f'{side} stop {row[4]}: {expected} != {actual}'
            count+=sum(expected.values())
    west,east=central['directions']
    # Visually transcribed from BOTH official language sheets. Column is zero-based.
    anchors=[(west,0,'miyanoura_port_early','4:45'),(west,0,'yakusugi_museum','5:29'),
      (west,1,'miyanoura_port','5:50'),(west,1,'anbo_port','6:32'),
      (west,3,'miyanoura_port','8:00'),(west,3,'airport','8:23'),(west,3,'hotel_yakushima','9:08'),
      (west,13,'miyanoura_port','16:50'),(west,13,'anbo_port','17:33'),
      (west,14,'yakusugi_museum','17:40'),(west,16,'anbo_port','19:08'),
      (east,1,'anbo_port','5:50'),(east,1,'miyanoura_port','6:31'),
      (east,2,'kurio_bashi','6:39'),(east,2,'miyanoura_port','8:15'),
      (east,14,'yakusugi_museum','17:10'),(east,14,'miyanoura_port_early','17:55')]
    for d,col,stop,time in anchors: assert d['columnTrips'][col]['times'].get(stop)==time,(d['id'],col,stop,time)
    assert west['columnTrips'][2]['condition']=='school-days'
    assert east['columnTrips'][3]['condition']=='school-days'
    assert all(len(t['days'])==3 for d,school in [(west,2),(east,3)] for i,t in enumerate(d['columnTrips']) if i!=school)
    print(f'October PDF audit OK: {count} time cells, 84 stop rows, 34 runs, {len(anchors)} visual anchors')
    return 0
if __name__=='__main__': raise SystemExit(audit())
