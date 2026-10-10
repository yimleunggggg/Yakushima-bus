#!/usr/bin/env python3
"""Release gate: canonical/derived equality, evidence, validity and shared page assets."""
import argparse, hashlib, json, re
from datetime import date
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
def load(path):return json.loads((ROOT/path).read_text())
def js(path):
    raw=(ROOT/path).read_text();return json.loads(raw[raw.index('{'):raw.rindex('}')+1])
def check(as_of=None,strict=False):
    ref=as_of or date.today();warnings=[]
    manifest=load('sources/manifest.json');bus=js('data.js');access=js('access-data.js');meta=js('meta-data.js');status=js('transport-data.js')
    from parse_pdf import build_data
    assert bus==build_data(),'data.js differs from PDF/special-route sources'
    from build_access_data import build_data as build_access,OVERRIDES
    from lib.overrides import apply_overrides
    assert access==apply_overrides(build_access(),OVERRIDES),'access-data.js differs from source tables'
    from build_sources_data import build_data as build_sources
    assert js('sources-data.js')==build_sources(),'sources-data.js differs from manifests'
    assert bus['meta']['version']==meta['datasets']['timetable']['revision']==status['timetable']['revision']==manifest['revision'],'Mixed timetable revisions'
    assert bus['meta']['sources']['taneyaku']==manifest['sources']['taneyaku']['url']
    assert date.fromisoformat(manifest['validFrom'])<=ref<=date.fromisoformat(manifest['validTo']),'No verified timetable covers check date'
    for key,src in manifest['sources'].items():
        if not src.get('file'):continue
        path=ROOT/src['file'];digest=hashlib.sha256(path.read_bytes()).hexdigest()
        assert digest==src['sha256'],f'Unverified PDF content: {key}'
        asset=status['pdfAssets'][src['url']]
        assert asset['mirror']=='/'+src['file'] and asset['sha256']==digest,f'PDF viewer/source mismatch: {key}'
        for preview in asset['previews']:
            assert (ROOT/preview['url'].lstrip('/')).is_file(),f'Missing preview: {key}'
            assert digest[:8] in preview['url'],f'Wrong PDF preview version: {key}'
    canonical_status=load('sources/transport-status.json')
    assert all(status[k]==v for k,v in canonical_status.items()),'Stale operational notices'
    ids={r['id'] for r in bus['routes']};operators=set(bus['operators'])
    course_ids=set(re.findall(r'^\s+id: "([^"]+)"', (ROOT/'trekking-data.js').read_text(),re.M))
    for notice in status['alerts']:
        assert notice['sourceUrl'].startswith('https://') and all(notice['message'].get(l) for l in ['ja','zh','en'])
        assert set(notice.get('routeIds',[]))<=ids, f'Unknown alert route: {notice["id"]}'
        assert set(notice.get('operatorIds',[]))<=operators
        assert set(notice.get('courseIds',[]))<=course_ids, f'Unknown closed course: {notice["id"]}'
        assert set(notice.get('alternativeCourseIds',[]))<=course_ids, f'Unknown alternative course: {notice["id"]}'
        assert not (set(notice.get('courseIds',[])) & set(notice.get('alternativeCourseIds',[]))), f'Closed course recommended: {notice["id"]}'
        if date.fromisoformat(notice['reviewAfter'])<ref:warnings.append('Operational notice needs recheck: '+notice['id'])
    if date.fromisoformat(manifest['reviewAfter'])<ref:warnings.append('Timetable/official index needs recheck')
    special=load('sources/routes/special.json')
    assert special['sourceRevision']==manifest['revision'],'Special routes were not reviewed with this PDF revision'
    seasons=load('sources/access/jetfoil.json')['seasons'];previous=None
    for s in sorted(seasons,key=lambda s:s['validFrom']):
        start,end=date.fromisoformat(s['validFrom']),date.fromisoformat(s['validTo'])
        assert start<=end and (previous is None or start>previous),'Overlapping/invalid jetfoil seasons'
        previous=end
    assert any(s['validFrom']<=ref.isoformat()<=s['validTo'] for s in seasons),'No verified jetfoil season'
    stops=load('sources/stops.json')['stops'];map_stops=js('map-data.js')['stops']
    for sid,s in bus['stops'].items():
        assert all(s[k]==stops[sid][k]==map_stops[sid][k] for k in ['no','ja','zh','en']),f'Stop identity drift: {sid}'
    from sync_transport_assets import main,PAGES
    main(check=True)
    for page in PAGES:
        content=(ROOT/page).read_text()
        assert '/transport-data.js?' in content and '/transport-status.js?' in content, f'Missing global status: {page}'
        assert content.index('/transport-data.js?')<content.index('/transport-status.js?')
    for w in warnings:print('WARN:',w)
    if strict and warnings:raise AssertionError('Release blocked until official evidence is rechecked')
    print('Transport consistency OK: sources, generated data, PDF mirrors/previews, stop identities, dates, 8 pages')
if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--as-of',type=date.fromisoformat);p.add_argument('--strict-freshness',action='store_true');args=p.parse_args();check(args.as_of,args.strict_freshness)
