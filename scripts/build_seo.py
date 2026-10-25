#!/usr/bin/env python3
"""Generate crawlable SEO/GEO surfaces from page copy and transport sources."""
import argparse
import json
import re
from html import escape
from pathlib import Path
from xml.etree import ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
BASE = 'https://yakushimabus.com'
LANGS = {'ja': 'ja', 'zh': 'zh-CN', 'en': 'en'}
START, END = '<!-- seo-evidence:start -->', '<!-- seo-evidence:end -->'
# Publisher ID supplied by the site owner; this is public verification code.
ADSENSE_CLIENT = 'ca-pub-4217601910449827'
ADSENSE_CODE = (f'<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client={ADSENSE_CLIENT}" '
                'crossorigin="anonymous"></script>')
ADS_TXT = f'google.com, {ADSENSE_CLIENT[3:]}, DIRECT, f08c47fec0942fa0\n'


def with_adsense(text):
    if ADSENSE_CODE in text:
        return text
    return text.replace('</head>', f'  {ADSENSE_CODE}\n</head>', 1)


def load(name):
    return json.loads((ROOT / name).read_text())


def month_label(value, lang):
    year, month = value[:7].split('-')
    return f"{['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][int(month)-1]} {year}" if lang == 'en' else f'{year}年{int(month)}月'


def evidence(page, lang, manifest):
    copy = page[lang][1]
    links = [('/', {'ja': '時刻表', 'zh': '公交时刻表', 'en': 'Bus timetable'}[lang]),
             ('/fare/', {'ja': '運賃', 'zh': '票价', 'en': 'Fares'}[lang]),
             ('/ferry/', {'ja': 'フェリー', 'zh': '船运', 'en': 'Ferry'}[lang]),
             ('/trekking/', {'ja': '登山', 'zh': '徒步', 'en': 'Hiking'}[lang])]
    revision = month_label(manifest['revision'], lang)
    fare = month_label(manifest['sources']['fare']['revision'], lang)
    checked, review = month_label(manifest['checkedAt'],lang), month_label(manifest['reviewAfter'],lang)
    note = {
        'ja': f'時刻表改訂日: {revision}。運賃表改定日: {fare}。資料確認日: {checked}／再確認期限: {review}。期限後は再確認が必要です。計画便は当日の運行を保証しません。',
        'zh': f'时刻表改订：{revision}；运价表改订：{fare}。资料核查：{checked}／应复核日期：{review}，超过该日期须重新核查。计划班次不保证当日运行。',
        'en': f'Timetable revision: {revision}; fare-table revision: {fare}. Sources checked: {checked}; review due: {review}. Recheck after that date. Planned departures do not guarantee same-day service.',
    }[lang]
    return copy, links, note


def evidence_html(path, page, manifest, status, include_alerts):
    if path.startswith('/guides/'):
        from build_guides import COPY, load as guide_data
        data = guide_data()
        guide = next((g for g in data['guides'] if g['path'] == path), None)
        if guide:
            return START + END  # The visible article already includes all three attributed source sections.
        keys = list(data['sources'])
        blocks = []
        for lang, tag in LANGS.items():
            hidden = '' if lang == 'ja' else ' hidden'
            links = ' · '.join(f'<a href="{escape(data["sources"][k]["url"])}">{escape(data["sources"][k]["label"][lang])}</a>' for k in keys)
            blocks.append(f'<div data-seo-lang="{lang}" lang="{tag}"{hidden}><p>{escape(COPY[lang]["sourceNote"])}</p><p>{links}</p></div>')
        summary = ''.join(f'<span data-seo-lang="{lang}"' + ('' if lang == 'ja' else ' hidden') + f'>{escape(COPY[lang]["sources"])}</span>' for lang in LANGS)
        return START + '<details class="guide-sources guide-source-evidence"><summary>' + summary + '</summary>' + ''.join(blocks) + '</details>' + END
    sections = []
    titles = {'ja': '出典・交通情報の確認', 'zh': '来源与交通信息核查', 'en': 'Sources and transport checks'}
    labels = {'ja': '記録された案内（出発前に再確認）', 'zh': '已记录的公告（出行前复核）', 'en': 'Recorded notices (recheck before travel)'}
    for lang, tag in LANGS.items():
        copy, links, note = evidence(page, lang, manifest)
        access_sources = load('sources/access-manifest.json')['sources']
        if path == '/ferry/':
            season = max(load('sources/access/jetfoil.json')['seasons'], key=lambda s: s['validFrom'])
            dates = season['validFrom'] + '–' + season['validTo']
            note = {
                'ja': f'掲載資料の高速船最終季節区間: {dates}。利用日を選び、計画休航・入出港地を確認してください。天候等による当日の運航は公式発表で確認が必要です。',
                'zh': f'所收录高速船资料的最后一个季节区间：{dates}。请选择实际出行日期，核对计划停航及出入港口；天气等导致的当日运行变化须向船公司确认。',
                'en': f'Last jetfoil season in the published source data: {dates}. Select the travel date and check planned cancellations and arrival ports. Confirm same-day weather and operations with the operator.',
            }[lang]
        parts = [f'<p>{escape(copy)}</p>', f'<p>{escape(note)}</p>']
        if include_alerts:
            for alert in [a for a in status['alerts'] if a['validFrom'] <= status['checkedAt'] and (not a.get('validTo') or a['validTo'] >= status['checkedAt'])]:
                review_label = {'ja': '再確認期限', 'zh': '应复核', 'en': 'review due'}[lang]
                source_label = {'ja': '公式案内', 'zh': '官方公告', 'en': 'Official notice'}[lang]
                parts.append(f'<p>{escape(labels[lang])}: {escape(alert["message"][lang])} '
                             f'({escape(month_label(alert["checkedAt"],lang))}; {review_label}: {escape(month_label(alert["reviewAfter"],lang))}) '
                             f'<a href="{escape(alert["sourceUrl"])}" rel="noopener">{source_label}</a></p>')
        source_links = [(manifest['sources']['taneyaku']['url'], 'PDF (JA)'),
                        (manifest['sources']['taneyakuEn']['url'], 'PDF (EN)'),
                        (manifest['sources']['fare']['url'], f'Fare PDF ({manifest["sources"]["fare"]["revision"]})')]
        if path in ('/ferry/', '/without-car/', '/about/'):
            ferry_links = [(access_sources[key]['url'], access_sources[key]['label'][lang]) for key in ('jetfoil', 'ferry')]
            source_links = ferry_links if path == '/ferry/' else source_links + ferry_links
        if path == '/trekking/':
            source_links.append(('https://yakukan.jp/trekking/', {'ja': '観光協会 登山案内', 'zh': '观光协会登山指南', 'en': 'Tourism association hiking guide'}[lang]))
        parts.append('<p>' + ' · '.join(f'<a href="{escape(url)}">{escape(label)}</a>' for url, label in source_links) + '</p>')
        parts.append('<p>' + ' · '.join(f'<a href="{url}?lang={lang}">{label}</a>' for url, label in links) + '</p>')
        hidden = '' if lang == 'ja' else ' hidden'
        sections.append(f'<div data-seo-lang="{lang}" lang="{tag}"{hidden}>' + ''.join(parts) + '</div>')
    summaries = ''.join(f'<span data-seo-lang="{lang}" lang="{tag}"' + ('' if lang == 'ja' else ' hidden') + f'>{titles[lang]}</span>' for lang, tag in LANGS.items())
    return f'{START}\n    <details class="aux-block seo-evidence"><summary class="aux-summary">{summaries}</summary><div class="aux-body">' + ''.join(sections) + f'</div></details>\n    {END}'


def update_head(text, path, page):
    text = with_adsense(text)
    title, description = page['ja']
    text = re.sub(r'<title>.*?</title>', f'<title>{escape(title)}</title>', text, count=1)
    def meta(text, attr, name, value):
        pattern = rf'<meta {attr}="{re.escape(name)}"[^>]*>'
        element = f'<meta {attr}="{name}" content="{escape(value, quote=True)}">'
        return re.sub(pattern, element, text, count=1) if re.search(pattern, text) else text.replace('</head>', f'  {element}\n</head>')
    for attr, key, value in [('name', 'description', description), ('property', 'og:title', title),
                              ('property', 'og:description', description), ('property', 'og:url', BASE + path),
                              ('name', 'twitter:title', title), ('name', 'twitter:description', description),
                              ('name', 'twitter:card', 'summary_large_image'),
                              ('name', 'twitter:image', BASE + '/og-image.png')]:
        text = meta(text, attr, key, value)
    if 'application/ld+json' not in text:
        text = text.replace('</head>', '  <script type="application/ld+json">{"@context":"https://schema.org","@type":"WebPage"}</script>\n</head>')
    text = re.sub(r'  <link rel="alternate" hreflang="[^"]+"[^>]*>\n', '', text)
    alternates = [f'  <link rel="alternate" hreflang="{tag}" href="{BASE}{path}?lang={lang}">' for lang, tag in LANGS.items()]
    alternates.append(f'  <link rel="alternate" hreflang="x-default" href="{BASE}{path}">')
    text = text.replace('</head>', '\n'.join(alternates) + '\n</head>')
    def schema(match):
        data = json.loads(match[1])
        nodes = data.get('@graph', [data])
        found = False
        for node in nodes:
            if node.get('@type') in ('WebPage', 'AboutPage', 'WebApplication'):
                node.pop('@context', None)
                node.update(name=title, description=description, url=BASE + path, dateModified=page['modified'], inLanguage=list(LANGS.values()))
                found = True
        if not found:
            nodes.append({'@type': 'WebPage', 'url': BASE + path, 'name': title, 'description': description,
                          'dateModified': page['modified'], 'inLanguage': list(LANGS.values()),
                          'isPartOf': {'@type': 'WebSite', 'url': BASE + '/', 'name': 'YakuBus'}})
        if page.get('kind') == 'article':
            article = next((n for n in nodes if n.get('@type') == 'Article'), None)
            if article is None:
                article = {'@type': 'Article'}
                nodes.append(article)
            article.update(headline=title, description=description, url=BASE + path,
                           dateModified=page['modified'], inLanguage=list(LANGS.values()),
                           author={'@type': 'Organization', 'name': 'YakuBus'},
                           mainEntityOfPage=BASE + path)
        data = {'@context': 'https://schema.org', '@graph': nodes}
        return '<script type="application/ld+json">\n' + json.dumps(data, ensure_ascii=False, indent=2) + '\n  </script>'
    if 'application/ld+json' not in text:
        text = text.replace('</head>', '  <script type="application/ld+json">{"@context":"https://schema.org","@type":"WebPage"}</script>\n</head>')
    return re.sub(r'<script type="application/ld\+json">\s*(.*?)\s*</script>', schema, text, flags=re.S)


def sitemap(pages, chinese=False):
    ns, xhtml = 'http://www.sitemaps.org/schemas/sitemap/0.9', 'http://www.w3.org/1999/xhtml'
    ET.register_namespace('', ns)
    ET.register_namespace('xhtml', xhtml)
    root = ET.Element(f'{{{ns}}}urlset')
    for path, page in pages.items():
        variants = ['?lang=zh'] if chinese else ['', '?lang=ja', '?lang=zh', '?lang=en']
        for variant in variants:
            url = ET.SubElement(root, f'{{{ns}}}url')
            ET.SubElement(url, f'{{{ns}}}loc').text = BASE + path + variant
            ET.SubElement(url, f'{{{ns}}}lastmod').text = page['modified']
            for lang, tag in [*LANGS.items(), (None, 'x-default')]:
                ET.SubElement(url, f'{{{xhtml}}}link', rel='alternate', hreflang=tag,
                              href=BASE + path + (f'?lang={lang}' if lang else ''))
    ET.indent(root)
    return '<?xml version="1.0" encoding="UTF-8"?>\n' + ET.tostring(root, encoding='unicode') + '\n'


def outputs():
    pages = load('sources/seo-pages.json')
    manifest, status = load('sources/manifest.json'), load('sources/transport-status.json')
    from build_guides import outputs as guide_outputs
    guide_pages = guide_outputs()
    result = {}
    for path, page in pages.items():
        filename = path.lstrip('/') + 'index.html'
        text = guide_pages.get(filename) or (ROOT / filename).read_text()
        text = update_head(text, path, page)
        # Remove superseded fallback facts; the generated block is visible without JS.
        if path in ('/', '/without-car/'):
            text = re.sub(r'    <noscript>.*?</noscript>\n', '', text, flags=re.S)
        block = evidence_html(path, page, manifest, status, path in ('/', '/trekking/', '/without-car/'))
        if START in text:
            text = re.sub(re.escape(START) + r'.*?' + re.escape(END), lambda _: block, text, flags=re.S)
        else:
            text = text.replace('    <footer class="app-footer">', '    ' + block + '\n\n    <footer class="app-footer">', 1)
        if path in ('/trekking/', '/without-car/'):
            badges = ''.join(f'<span data-seo-lang="{lang}"' + ('' if lang == 'ja' else ' hidden') + f'>{"Updated" if lang == "en" else "更新"} {month_label(page["modified"], lang)}</span>' for lang in LANGS)
            badge = '<!-- seo-updated:start --><p class="app-meta">' + badges + '</p><!-- seo-updated:end -->'
            if '<!-- seo-updated:start -->' in text:
                text = re.sub(r'<!-- seo-updated:start -->.*?<!-- seo-updated:end -->', lambda _: badge, text, flags=re.S)
            else:
                text = text.replace('</header>', '</header>\n    ' + badge, 1)
        if path.startswith('/guides/'):
            text = text.replace('</main>', block + '</main>') if START not in text else text
        result[filename] = text
    # Intro remains noindex; it shares the publisher code without entering SEO copy or sitemaps.
    result['intro/index.html'] = with_adsense((ROOT / 'intro/index.html').read_text())
    result['ads.txt'] = ADS_TXT
    result['seo-data.js'] = '/** Generated by scripts/build_seo.py; edit sources/seo-pages.json. */\nwindow.SEO_PAGES = ' + json.dumps(pages, ensure_ascii=False, indent=2) + ';\n'
    result['sitemap.xml'], result['sitemap-zh.xml'] = sitemap(pages), sitemap(pages, True)
    lines = ['# YakuBus / Yakushima Bus / 屋久島バス / 屋久岛公交', '',
             '> Independent trilingual transport tool for Yakushima, Kagoshima, Japan. Not the bus or ferry operator.', '',
             '## Pages', '']
    for path, page in pages.items():
        lines.append(f'- [{page["en"][0]}]({BASE}{path}): {page["en"][1]}')
    lines.extend(['', '## Data scope and dates', '', f'Timetable revision: {manifest["revision"]}; fare revision: {manifest["sources"]["fare"]["revision"]}; checked {manifest["checkedAt"]}; review due {manifest["reviewAfter"]}. Recheck official information before travel.',
                  'All times use Japan Standard Time (JST, UTC+9). Choose the actual travel day and check each conditional service note.',
                  'The internal display horizon is a conservative review policy, not an official PDF expiry date.',
                  'Japanese, Simplified Chinese and English are selected using ?lang=ja, ?lang=zh or ?lang=en.',
                  '', '## Official sources', ''])
    for key in ('taneyaku', 'taneyakuEn', 'fare', 'notice'):
        source = manifest['sources'][key]
        lines.append(f'- [{key}]({source["url"]})' + (f' — revision {source["revision"]}' if source.get('revision') else ''))
    access = load('sources/access-manifest.json')
    for key in ('jetfoil', 'ferry', 'pass'):
        source = access['sources'][key]
        lines.append(f'- [{source["label"]["en"]}]({source["url"]})')
    lines.extend(['', '## Recorded service notices — recheck before travel', '',
                  'These are dated source records, not live confirmation. An overdue review does not establish that a suspended route has reopened.', ''])
    for alert in [a for a in status['alerts'] if a['validFrom'] <= status['checkedAt'] and (not a.get('validTo') or a['validTo'] >= status['checkedAt'])]:
        lines.append(f'- {alert["message"]["en"]} Checked {alert["checkedAt"]}; review due {alert["reviewAfter"]}; notice scope {alert["validFrom"]} to {alert.get("validTo") or "until further notice"}. Source: {alert["sourceUrl"]}')
    lines.extend(['', '## Optional', '', f'- [Sitemap]({BASE}/sitemap.xml)', f'- [Contact and provenance]({BASE}/about/)', ''])
    result['llms.txt'] = '\n'.join(lines)
    from sync_transport_assets import synced
    for name in list(result):
        if name.endswith(".html"):
            result[name] = synced(result[name], result)
    return result


def main(check=False):
    stale = []
    for name, content in outputs().items():
        path = ROOT / name
        if not path.exists() or path.read_text() != content:
            if check:
                stale.append(name)
            else:
                path.write_text(content)
    if stale:
        raise SystemExit('Stale SEO/GEO outputs; run python3 scripts/build_seo.py: ' + ', '.join(stale))
    print(f'SEO/GEO generated surfaces OK ({len(load("sources/seo-pages.json"))} pages, 3 languages, sitemaps, llms.txt)')


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--check', action='store_true')
    main(parser.parse_args().check)
