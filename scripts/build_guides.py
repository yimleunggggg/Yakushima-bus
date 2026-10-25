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
UI={
 'ja':{'toc':'このガイドの内容','read':'ガイドを読む','start':'まずはここから','island':'屋久島を旅する','city':'鹿児島に立ち寄る','tools':'日程が決まったら、交通を確認','editorial':'非公式ガイド · 観光協会などの公式資料を参考に編集','day':'日目'},
 'zh':{'toc':'本篇内容','read':'阅读攻略','start':'第一次去，从这里开始','island':'在屋久岛旅行','city':'顺路逛鹿儿岛','tools':'定好行程，再核对交通','editorial':'非官方攻略 · 依据观光协会等官方资料整理','day':'天'},
 'en':{'toc':'In this guide','read':'Read guide','start':'Start planning here','island':'On Yakushima','city':'A stop in Kagoshima','tools':'Ready to check your transport?','editorial':'Independent guide · Edited using official tourism references','day':'Day'}
}
def actions(L):
 c=COPY[L]
 return '<nav class="guide-actions" aria-label="'+c['actions']+'">'+''.join(f'<a href="{p}?lang={L}">{c[k]} <span aria-hidden="true">→</span></a>' for p,k in [('/','time'),('/map/','map'),('/ferry/','ferry')])+'</nav>'
def section_id(g,L,i):return f'{g["id"]}-{L}-{i}'
def booking_checklist(text,L):
 # Keep the source wording, turning the existing five checks into a readable list.
 sentence,sep,tail=text.partition('.' if L=='en' else '。')
 items=sentence.split({'ja':'／','zh':'；','en':';'}[L])
 if len(items)!=5:raise ValueError(f'Expected five accommodation checks for {L}')
 return '<ul class="guide-checklist">'+''.join('<li>'+e(item.strip())+'</li>' for item in items)+'</ul>'+('<p>'+e(tail)+'</p>' if tail else '')

def article(g,L,data,embedded=False):
 c=COPY[L];u=UI[L];v=g[L];heading='h2' if embedded else 'h1'
 year,month=data['modified'][:7].split('-')
 display_date=(f'{year}年{int(month)}月' if L!='en' else f"{['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][int(month)-1]} {year}")
 area={'ja':{'yakushima':'屋久島','kagoshima':'鹿児島'},'zh':{'yakushima':'屋久岛','kagoshima':'鹿儿岛'},'en':{'yakushima':'Yakushima','kagoshima':'Kagoshima'}}[L][g['area']]
 body=f'<article class="guide-article" data-guide-lang="{L}" data-seo-lang="{L}" lang="{LANGS[L]}"'+(' hidden' if L!='ja' else '')+'>'
 body+=f'<header class="guide-article-header"><p class="guide-kicker">{area} / {e(v["card"]["topic"])}</p><{heading}>{e(v["title"])}</{heading}><p class="guide-dek">{e(v["dek"])}</p>'
 body+=f'<p class="guide-date">{c["date"]} <time datetime="{data["modified"]}">{display_date}</time></p><p class="guide-editorial-note">{u["editorial"]}</p></header>'
 body+=f'<div class="guide-reading-layout"><nav class="guide-toc" aria-label="{u["toc"]}"><p>{u["toc"]}</p><ol>'
 for i,s in enumerate(v['sections'],1):
  body+=f'<li><a href="#{section_id(g,L,i)}"><span aria-hidden="true">{i:02}</span>{e(s["nav"])}</a></li>'
 body+='</ol></nav><div class="guide-reading">'
 for i,s in enumerate(v['sections'],1):
  h='h3' if embedded else 'h2'
  body+=f'<section class="guide-section" id="{section_id(g,L,i)}"><{h}><span class="guide-step" aria-hidden="true">{i:02}</span>{e(s["title"])}</{h}>'
  if g['id']=='without-car' and i==2:
   body+='<ol class="guide-days">'
   for day,p in enumerate(s['paragraphs'],1):
    label=f'Day {day}' if L=='en' else (f'第{day}天' if L=='zh' else f'{day}日目')
    body+=f'<li><span class="guide-day-label">{label}</span><p>{e(p)}</p></li>'
   body+='</ol>'
  elif g['id']=='where-to-stay' and i==4:
   body+=booking_checklist(s['paragraphs'][0],L)+''.join('<p>'+e(p)+'</p>' for p in s['paragraphs'][1:])
  else:body+=''.join('<p>'+e(p)+'</p>' for p in s['paragraphs'])
  body+='</section>'
 body+=f'<aside class="guide-note">{e(c["notice"])}</aside>'+actions(L)
 body+=f'<details class="guide-sources"><summary>{c["sources"]}</summary><p>{e(c["sourceNote"])}</p>'
 if g['area']=='kagoshima':body+='<p>'+e(c['cityNote'])+'</p>'
 body+='<ul>'+''.join(f'<li><a href="{e(data["sources"][k]["url"])}" data-guide-source="{k}">{e(data["sources"][k]["label"][L])} ↗</a></li>' for k in g['sources'])+'</ul></details></div></div></article>'
 return body
def card(g,L,kind=''):
 v=g[L]['card'];u=UI[L]
 body=f'<a class="guide-card {kind}" href="{g["path"]}?lang={L}"><span class="guide-card-topic">{e(v["topic"])}</span><h3>{e(v["title"])}</h3><p>{e(v["summary"])}</p>'
 if v['steps']:
  body+='<ol class="guide-card-journey">'+''.join(f'<li><span>0{i}</span>{e(s)}</li>' for i,s in enumerate(v['steps'],1))+'</ol>'
 return body+f'<span class="guide-card-cta">{u["read"]} <span aria-hidden="true">→</span></span></a>'
def hub(L,data):
 c=COPY[L];u=UI[L];guides=data['guides']
 body=f'<section class="guide-hub" data-guide-lang="{L}" data-seo-lang="{L}" lang="{LANGS[L]}"'+(' hidden' if L!='ja' else '')+f'><header class="guide-hub-header"><p class="guide-kicker">YAKUSHIMA / KAGOSHIMA</p><h1>{c["hub"]}</h1><p class="guide-dek">{c["lead"]}</p></header>'
 body+=f'<section class="guide-island"><div class="guide-group-heading"><h2>{u["island"]}</h2><p>{u["start"]}</p></div><div class="guide-grid">'
 body+=card(guides[0],L,'guide-card-featured')+'<div class="guide-secondary">'+''.join(card(g,L) for g in guides[1:3])+'</div></div></section>'
 body+=f'<section class="guide-city"><h2>{u["city"]}</h2>'+card(guides[3],L,'guide-card-city')+'</section>'
 body+=f'<section class="guide-tools"><h2>{u["tools"]}</h2>'+actions(L)+'</section></section>'
 return body
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
</head><body class="app-page-narrow guide-reading-page"><div class="app travel-guide-page">
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
   f=ROOT/'without-car/index.html';text=f.read_text();text=text.replace('class="app-page-narrow"','class="app-page-narrow guide-reading-page"');block=START+'\n<div class="travel-guide-embedded">'+body+'</div>\n'+END
   if START in text:text=re.sub(re.escape(START)+'.*?'+re.escape(END),lambda _:block,text,flags=re.S)
   else:text=text.replace('    <div id="geoEvidence">',block+'\n    <div id="geoEvidence">',1)
   out['without-car/index.html']=text
  else:out[g['path'].lstrip('/')+'index.html']=shell(g['path'],body)
 return out
if __name__=='__main__':
 for name,text in outputs().items():
  p=ROOT/name;p.parent.mkdir(parents=True,exist_ok=True);p.write_text(text)
 print('Rendered travel guides in JA, ZH and EN')
