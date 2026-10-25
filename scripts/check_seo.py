#!/usr/bin/env python3
"""Offline release checks for indexability, translations and generated GEO facts."""
import json
import re
from datetime import date
from html.parser import HTMLParser
from urllib.parse import urlsplit
from xml.etree import ElementTree as ET

from build_seo import BASE, LANGS, ROOT, load, main as check_generated
from sync_transport_assets import main as check_assets


class Page(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.links, self.meta, self.scripts = [], [], []
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag in ('link', 'a'):
            self.links.append((tag, attrs))
        elif tag == 'meta':
            self.meta.append(attrs)
        elif tag == 'script' and 'src' in attrs:
            self.scripts.append(urlsplit(attrs['src']).path)


def check():
    check_generated(check=True)
    check_assets(check=True)
    pages = load('sources/seo-pages.json')
    for path, copy in pages.items():
        text = (ROOT / (path.lstrip('/') + 'index.html')).read_text()
        parsed = Page(text)
        assert len(re.findall(r'<title>.+?</title>', text)) == 1, f'{path}: title'
        canonical = [a['href'] for tag, a in parsed.links if tag == 'link' and a.get('rel') == 'canonical']
        assert canonical == [BASE + path], f'{path}: static canonical'
        robots = next(m['content'] for m in parsed.meta if m.get('name') == 'robots')
        assert 'noindex' not in robots.lower(), f'{path}: indexed page is noindex'
        for attr, name in [('name', 'description'), ('property', 'og:title'), ('property', 'og:description'),
                           ('name', 'twitter:title'), ('name', 'twitter:description')]:
            values = [m['content'] for m in parsed.meta if m.get(attr) == name]
            assert len(values) == 1 and values[0], f'{path}: missing/duplicate {name}'
        alternates = {a['hreflang']: a['href'] for tag, a in parsed.links if tag == 'link' and 'hreflang' in a}
        expected = {tag: BASE + path + '?lang=' + lang for lang, tag in LANGS.items()}
        expected['x-default'] = BASE + path
        assert alternates == expected, f'{path}: incomplete hreflang'
        assert date.fromisoformat(copy['modified']) <= date.today(), f'{path}: future modified date'
        for raw in re.findall(r'<script type="application/ld\+json">(.*?)</script>', text, re.S):
            json.loads(raw)
        assert all(f'data-seo-lang="{lang}"' in text for lang in LANGS), f'{path}: missing crawlable evidence'
        assert parsed.scripts.index('/lang-boot.js') < parsed.scripts.index('/seo-data.js') < parsed.scripts.index('/seo-head-zh.js')
        for tag, attrs in parsed.links:
            if tag != 'a' or 'href' not in attrs:
                continue
            link = urlsplit(attrs['href'])
            if link.netloc not in ('', 'yakushimabus.com') or link.scheme not in ('', 'http', 'https'):
                continue
            if link.path.startswith('/'):
                target = ROOT / link.path.lstrip('/')
                if link.path.endswith('/'):
                    target /= 'index.html'
                assert target.exists(), f'{path}: broken internal link {attrs["href"]}'

    ns = {'s': 'http://www.sitemaps.org/schemas/sitemap/0.9', 'x': 'http://www.w3.org/1999/xhtml'}
    for name, count in [('sitemap.xml', len(pages) * 4), ('sitemap-zh.xml', len(pages))]:
        root = ET.fromstring((ROOT / name).read_text())
        entries = root.findall('s:url', ns)
        urls = [entry.find('s:loc', ns).text for entry in entries]
        assert len(urls) == len(set(urls)) == count, f'{name}: incomplete/duplicate URLs'
        assert all('/intro/' not in u and '/explore/' not in u for u in urls), f'{name}: preview/noindex URL'
        for entry in entries:
            assert len(entry.findall('x:link', ns)) == 4, f'{name}: incomplete language cluster'
        if name == 'sitemap.xml':
            for entry in entries:
                assert all(a.attrib['href'] in set(urls) for a in entry.findall('x:link', ns)), 'Missing reciprocal sitemap URL'
    intro = Page((ROOT / 'intro/index.html').read_text())
    assert any(m.get('name') == 'robots' and 'noindex' in m.get('content', '') for m in intro.meta), 'Intro must remain noindex'
    assert (ROOT / 'googlef464172b97bd6d41.html').exists(), 'Missing GSC verification file'
    robots = (ROOT / 'robots.txt').read_text()
    assert 'Sitemap: ' + BASE + '/sitemap.xml' in robots
    assert not re.search(r'^Disallow:\s*/\s*$', robots, re.M), 'Site blocked in robots.txt'
    print(f'SEO/GEO checks passed: {len(pages)} indexed pages, {len(pages)*3} translations, reciprocal sitemaps, provenance and local links')


if __name__ == '__main__':
    check()
