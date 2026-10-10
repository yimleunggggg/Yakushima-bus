"""Verified 2026-10-01 English PDF layout. Reject unexpected cells, never shift them.
The Japanese PDF has outlined glyphs; both versions are retained for visual audit.
Columns are individual runs, NOT weekday/Saturday/Sunday column blocks.
"""
import re
from lib.catalog import no_to_id
TIME = re.compile(r'^\d{1,2}:\d{2}$')
DAYS = ['weekday', 'saturday', 'sunday_holiday']


def parse_october(words, side):
    low, high, stop_x = (82, 490, 28) if side == 'west' else (568, 974, 513)
    cells = [w for w in words if low < w[0] < high and 90 < w[1] < 499 and TIME.fullmatch(w[4])]
    clusters = []
    for x in sorted((w[0]+w[2])/2 for w in cells):
        if not clusters or x-clusters[-1][-1] > 6: clusters.append([x])
        else: clusters[-1].append(x)
    centers = [sum(c)/len(c) for c in clusters]
    if len(centers) != 17: raise ValueError(f'{side}: expected 17 physical run columns, got {len(centers)}')
    rows = [(w[4], w[1]) for w in words if abs(w[0]-stop_x)<3 and 90<w[1]<499 and w[4].isdigit()]
    if len(rows) != 42 or len({n for n,y in rows}) != 42: raise ValueError(f'{side}: expected 42 distinct stop rows, got {len(rows)}')
    trips = [{'days':DAYS.copy(), 'times':{}, 'sourceColumn':i+1} for i in range(17)]
    for w in cells:
        col=min(range(17),key=lambda i:abs((w[0]+w[2])/2-centers[i]))
        no,y=min(rows,key=lambda r:abs(r[1]-w[1]))
        if abs(y-w[1])>1.6 or abs((w[0]+w[2])/2-centers[col])>1.5: raise ValueError(f'Unaligned PDF cell {side}: {w}')
        sid=no_to_id(no)
        if not sid or sid in trips[col]['times']: raise ValueError(f'Unknown or duplicated cell {side}/{no}/{col}')
        trips[col]['times'][sid]=w[4]
    # Triangle mark means elementary school days, not all weekdays.
    school=2 if side=='west' else 3
    trips[school]['days']=['weekday']
    trips[school]['condition']='school-days'
    trips[school]['note']={'ja':'小学校の登校日のみ。学校休業日は運休。','zh':'仅小学上学日运行；学校假期停运，请确认当天是否开行。','en':'Elementary school days only; does not run during school holidays. Confirm service for your date.'}
    conditional = {0:'arakawa',1:'anbo-jetfoil-and-arakawa',14:'arakawa'} if side=='west' else {0:'arakawa',1:'miyanoura-first-jetfoil',14:'arakawa'}
    for col, condition in conditional.items():
        trips[col]['condition']=condition
        trips[col]['season']='3-11'
        if condition=='miyanoura-first-jetfoil':
            trips[col]['note']={'ja':'3〜11月、宮之浦港発の高速船始発便がある場合のみ運行。','zh':'3–11月，仅宫之浦港有高速船首班时运行。','en':'Mar–Nov only, when the first jetfoil departs Miyanoura.'}
        else:
            trips[col]['note']={'ja':'3〜11月、荒川登山バス運休時は運休。安房港行きは高速船始発便にも連動。','zh':'3–11月，荒川登山巴士停运时停运；去安房港的接驳班次也受高速船首班影响。','en':'Mar–Nov; suspended when the Arakawa trail bus is suspended. Anbo port connections also depend on the first jetfoil.'}
    trips[14]["boardOnlyAt"]=["yakusugi_museum"]
    for t in trips:
        if len(t['times'])<2: raise ValueError('Incomplete run')
    return trips
