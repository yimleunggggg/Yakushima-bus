#!/usr/bin/env python3
"""Render crawlable travel guides from one trilingual editorial source."""
import json,re
from pathlib import Path
from html import escape as e
ROOT=Path(__file__).resolve().parents[1]
LANGS={'ja':'ja','zh':'zh-CN','en':'en'}
COPY={
 'ja':{'hub':'旅行ガイド','lead':'屋久島と鹿児島。宿・天気・移動から旅を組み立てる。','eyebrow':'旅の準備','sources':'出典と資料について','sourceNote':'公式資料をもとにYakuBusが独立編集した非公式ガイドです。店舗の営業、予約、運行は出発前に各事業者へ確認してください。','date':'本文更新','back':'すべての旅行ガイド','actions':'移動を確認する','time':'バス時刻表','map':'地図で見る','ferry':'船・上島交通','notice':'交通・道路情報は変わります。出発日の運行条件を交通ページで確認してください。','cityNote':'鹿児島市観光サイトは資料整理時にメンテナンス表示でした。モデルコースの時間は参考値です。施設・運行会社の公式案内を優先し、JNTOの案内も参照してください。'},
 'zh':{'hub':'旅行攻略','lead':'屋久岛与鹿儿岛：从住宿、天气和交通开始安排行程。','eyebrow':'行前准备','sources':'来源与资料说明','sourceNote':'YakuBus依据官方公开资料独立整理，为非官方攻略。营业、预约和实际运行，请在出发前向相关服务方确认。','date':'正文更新','back':'查看全部攻略','actions':'接着确认交通','time':'查公交时刻','map':'打开地图','ferry':'船运与上岛','notice':'交通和道路信息会变动，请在交通页面选择实际日期，核对运行条件。','cityNote':'整理资料时，鹿儿岛市旅游官网显示维护中。示范路线时长仅作参考，请优先核对设施和运营商公告，也可参阅JNTO资料。'},
 'en':{'hub':'Travel guides','lead':'Yakushima and Kagoshima. Plan around your base, the weather and your transport.','eyebrow':'Before you go','sources':'Sources and editorial note','sourceNote':'An independent, unofficial guide edited by YakuBus using official public references. Confirm opening, bookings and actual operations with each provider before travel.','date':'Article updated','back':'All travel guides','actions':'Check your transport next','time':'Bus timetable','map':'Open the map','ferry':'Ferry and island access','notice':'Transport and road conditions change. Select your actual date on the transport pages and check service conditions.','cityNote':'The Kagoshima City tourism site showed a maintenance notice when these materials were compiled. Model-course durations are references. Prioritize facility and operator notices; JNTO is also linked below.'}}
START,END='<!-- travel-guide:start -->','<!-- travel-guide:end -->'
def load():return json.loads((ROOT/'sources/guides.json').read_text())
def actions(L):
 c=COPY[L];return '<nav class="guide-actions" aria-label="'+c['actions']+'">'+''.join(f'<a href="{p}?lang={L}">{c[k]} →</a>' for p,k in [('/','time'),('/map/','map'),('/ferry/','ferry')])+'</nav>'
def article(g,L,data,embedded=False):
 c=COPY[L];v=g[L];heading='h2' if embedded else 'h1';year,month=data['modified'][:7].split('-');display_date=(f'{year}年{int(month)}月' if L!='en' else f"{['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][int(month)-1]} {year}");area='屋久島' if g['area']=='yakushima' else '鹿児島'
 body=f'<article class="guide-article" data-guide-lang="{L}" data-seo-lang="{L}" lang="{LANGS[L]}"'+(' hidden' if L!='ja' else '')+'>'
 body+=f'<p class="guide-kicker">{area} / {e(c["eyebrow"])}</p><{heading}>{e(v["title"])}</{heading}><p class="guide-dek">{e(v["dek"])}</p>'
 body+=f'<p class="guide-date">{c["date"]} <time datetime="{data["modified"]}">{display_date}</time></p>'
 body+='<div class="guide-reading">'
 for i,s in enumerate(v['sections'],1):
  h='h3' if embedded else 'h2'
  body+=f'<section><{h}><span class="guide-step" aria-hidden="true">{i:02}</span>{e(s["title"])}</{h}>'+''.join('<p>'+e(p)+'</p>' for p in s['paragraphs'])+'</section>'
 body+=f'<aside class="guide-note">{e(c["notice"])}</aside>'+actions(L)
 body+=f'<section class="guide-sources"><h{3 if embedded else 2}>{c["sources"]}</h{3 if embedded else 2}><p>{e(c["sourceNote"])}</p>'
 if g['area']=='kagoshima':body+='<p>'+e(c['cityNote'])+'</p>'
 body+='<ul>'+''.join(f'<li><a href="{e(data["sources"][k]["url"])}" data-guide-source="{k}">{e(data["sources"][k]["label"][L])} ↗</a></li>' for k in g['sources'])+'</ul></section></div></article>'
 return body
def hub(L,data):
 c=COPY[L];body=f'<section data-guide-lang="{L}" data-seo-lang="{L}" lang="{LANGS[L]}"'+(' hidden' if L!='ja' else '')+f'><p class="guide-kicker">YAKUSHIMA / KAGOSHIMA</p><h1>{c["hub"]}</h1><p class="guide-dek">{c["lead"]}</p><div class="guide-grid">'
 for i,g in enumerate(data['guides'],1):
  body+=f'<a class="guide-card" href="{g["path"]}?lang={L}"><span class="guide-card-number">0{i}</span><h2>{e(g[L]["title"])}</h2><p>{e(g[L]["dek"])}</p><span class="guide-card-arrow" aria-hidden="true">↗</span></a>'
 return body+'</div>'+actions(L)+'</section>'
def shell(path,body):
 return '''<!DOCTYPE html>
<html lang="ja"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="index, follow"><meta name="theme-color" content="#143a35">
<title>YakuBus Travel guides</title><link rel="canonical" href="https://yakushimabus.com'''+path+'''">
<meta property="og:image" content="https://yakushimabus.com/og-image.png">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="/styles.css"><link rel="stylesheet" href="/guides.css">
<script src="/lang-boot.js"></script><script src="/seo-data.js"></script><script src="/seo-head-zh.js"></script>
<script src="/transport-data.js"></script><script src="/transport-status.js"></script>
<script src="/app-core.js" defer></script><script src="/site-chrome.js" defer></script><script src="/guides.js" defer></script>
<script src="/analytics.js" defer></script><script src="/analytics-events.js" defer></script>
</head><body class="app-page-narrow"><div class="app travel-guide-page">
<div class="app-nav-sticky"><nav class="nav nav-main nav-main--6" id="mainNav" aria-label="メインメニュー">
<a href="/map/?lang=ja">マップ</a><a href="/?lang=ja">時刻表</a><a href="/fare/?lang=ja">運賃</a><a href="/ferry/?lang=ja">フェリー</a><a href="/trekking/?lang=ja">旅と体験</a><a href="/guides/?lang=ja" aria-current="page">旅行ガイド</a>
</nav><script src="/site-chrome-nav-boot.js"></script></div>
<header class="header header-compact guide-toolbar"><a href="/guides/" data-guide-home>旅行ガイド</a><div class="lang-switch" id="langSwitch"><button type="button" data-lang="ja">JA</button><button type="button" data-lang="zh">ZH</button><button type="button" data-lang="en">EN</button></div></header>
<main id="guideMain">'''+body+'''</main>
<footer class="app-footer"></footer></div></body></html>
'''
def outputs():
 data=load();out={'guides/index.html':shell('/guides/',''.join(hub(L,data) for L in LANGS))}
 for g in data['guides']:
  body=''.join(article(g,L,data,g['path']=='/without-car/') for L in LANGS)
  if g['path']=='/without-car/':
   f=ROOT/'without-car/index.html';text=f.read_text();block=START+'\n<div class="travel-guide-embedded">'+body+'</div>\n'+END
   if START in text:text=re.sub(re.escape(START)+'.*?'+re.escape(END),lambda _:block,text,flags=re.S)
   else:text=text.replace('    <div id="geoEvidence">',block+'\n    <div id="geoEvidence">',1)
   out['without-car/index.html']=text
  else:out[g['path'].lstrip('/')+'index.html']=shell(g['path'],body)
 return out
if __name__=='__main__':
 for name,text in outputs().items():
  p=ROOT/name;p.parent.mkdir(parents=True,exist_ok=True);p.write_text(text)
 print('Rendered travel guides in JA, ZH and EN')
