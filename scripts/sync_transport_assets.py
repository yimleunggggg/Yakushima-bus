#!/usr/bin/env python3
"""Use content digests on every page reference to transport scripts/styles."""
import argparse,hashlib,re
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
PAGES=['index.html']+[p+'/index.html' for p in ['fare','ferry','map','trekking','intro','about','without-car']]
ASSETS={'data.js','meta-data.js','map-data.js','access-data.js','access-schedule.js','sources-data.js','transport-data.js','transport-status.js','pdf-viewer.js','app-core.js','guide.js','site-chrome.js','styles.css','trekking-data.js','without-car-data.js'}
def synced(text):
    def replace(m):
        filename=m[2].lstrip('/')
        if filename not in ASSETS:return m[0]
        digest=hashlib.sha256((ROOT/filename).read_bytes()).hexdigest()[:12]
        return m[1]+m[2]+'?v='+digest+'"'
    return re.sub(r'((?:src|href)=")(/?[^"?]+)(?:\?[^" ]*)?"',replace,text)
def main(check=False):
    errors=[]
    for name in PAGES:
        p=ROOT/name;old=p.read_text();new=synced(old)
        if old!=new:
            if check: errors.append(name)
            else:p.write_text(new)
    if errors:raise ValueError('Stale asset references: '+', '.join(errors))
if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--check',action='store_true');main(p.parse_args().check)
