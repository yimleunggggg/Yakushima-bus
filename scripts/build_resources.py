"""Static reference directory derived from existing manifests and source HTML."""
import json,re
from html import escape
from html.parser import HTMLParser
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
TITLES={
 'bus':{'en':'Bus timetables','zh':'公交时刻表','ja':'バス時刻表'},
 'fares':{'en':'Fares & passes','zh':'票价与乘车券','ja':'運賃・乗車券'},
 'ferry':{'en':'Ferries & island access','zh':'船运与上岛交通','ja':'船・島へのアクセス'},
 'hiking':{'en':'Hiking & service notices','zh':'徒步与交通公告','ja':'登山・運行のお知らせ'},
 'map':{'en':'Maps & practical information','zh':'地图与实用资料','ja':'地図・実用情報'},
 'guides':{'en':'Travel guides & local references','zh':'旅行攻略与地方资料','ja':'旅行ガイド・地域資料'},
 'contacts':{'en':'Operator contacts','zh':'交通运营商联系方式','ja':'交通事業者への連絡'}}
CONFIG=[('bus',[0],['/']),('fares',[1,3],['/fare/']),('ferry',[2],['/ferry/']),('hiking',[4,6],['/trekking/']),('map',[5,7],['/map/','/about/']),('guides',[],['/without-car/','/guides/','/guides/yakushima-where-to-stay/','/guides/yakushima-rainy-day/','/guides/kagoshima-half-day/']),('contacts',[8],[])]
class Links(HTMLParser):
 def __init__(self):super().__init__();self.items=[];self.current=None;self.stack=[];self.lang='en'
 def handle_starttag(self,t,attrs):
  attrs=dict(attrs)
  if t not in ('br','hr','img','input','meta','link'):
   self.stack.append((t,self.lang));self.lang=attrs.get('data-seo-lang',attrs.get('data-guide-lang',self.lang))
  if t=='a':self.current={'attrs':attrs,'text':'','lang':self.lang}
 def handle_data(self,d):
  if self.current is not None:self.current['text']+=d
 def handle_endtag(self,t):
  if t=='a'and self.current is not None:self.items.append(self.current);self.current=None
  for i in range(len(self.stack)-1,-1,-1):
   if self.stack[i][0]==t:self.lang=self.stack[i][1];self.stack=self.stack[:i];break

def outputs(pages,manifest,status,full_reference,guide_pages):
 from build_sources_data import build_data
 catalog=build_data();sections=[];notes=[]
 for key,groups,routes in CONFIG:
  items=[]
  def add(item):
   url=item.get('url','')
   if not url.startswith(('https://','http://','tel:','/assets/')):return
   old=next((x for x in items if x['url']==url),None)
   if old:
    if not old.get('sourceRef'):old.setdefault('label',{}).update(item.get('label',{}))
    return
   items.append(item)
  for n in groups:
   for item in catalog['sourceGroups'][n]['items']:add(dict(item))
  if key=='ferry':
   from build_access_data import build_data as access_data
   access=access_data()
   for link in access.get('links',[]):add({'url':access['meta']['sources'][link['key']],'label':link['label']})
  for route in routes:
   if route not in pages:continue
   full=full_reference(route,pages[route],manifest,status,route in ('/','/trekking/','/without-car/'))
   blocks=re.findall(r'<details\b[^>]*>.*?</details>',full,re.S)
   original=guide_pages.get(route.lstrip('/')+'index.html','')
   article_blocks=re.findall(r'<details class="guide-sources"[^>]*>.*?</details>',original,re.S)
   blocks += [f'<div data-seo-lang="{lang}"'+('' if lang=='ja'else' hidden')+'>'+block+'</div>' for lang,block in zip(['ja','zh','en'],article_blocks)]
   # Supplemental source/booking lists are from the existing HTML, not hand-copied fares or times.
   filename=ROOT/(route.lstrip('/')+'index.html')
   raw=filename.read_text() if filename.exists() else ''
   supplemental=re.findall(r'<div class="links" id="sourceLinks">.*?</div>',raw,re.S)
   for block in blocks+supplemental:
    parser=Links();parser.feed(block)
    for link in parser.items:
     url=link['attrs'].get('href','');label=link['text'].strip()
     if not label:continue
     add({'url':url,'label':{link['lang']:label},'rel':link['attrs'].get('rel','')})
   if blocks:notes.append({'route':route,'key':key,'html':re.sub(r'<summary\b[^>]*>.*?</summary>|<details\b[^>]*>|</details>','', ''.join(blocks),flags=re.S)})
  sections.append({'id':key,'title':TITLES[key],'items':items})
 # Deduplicate URLs globally; retain each canonical source under its actual topic.
 owners={}
 for key,groups,_ in CONFIG:
  for n in groups:
   for item in catalog['sourceGroups'][n]['items']:owners.setdefault(item.get('url'),key)
 for alert in status['alerts']:owners[alert['sourceUrl']]='hiking'
 all_items={}
 for section in sections:
  for item in section['items']:
   url=item['url'];owners.setdefault(url,section['id']);all_items.setdefault(url,item)
 for alert in status['alerts']:
  item=all_items.get(alert['sourceUrl'])
  if item and not item.get('sourceRef'):
   item['label']={lang:message.split('. ')[0].split('。')[0] for lang,message in alert['message'].items()}
 for section in sections:section['items']=[item for url,item in all_items.items() if owners[url]==section['id']]
 blocks=[]
 intro={
 'en':('Sources & references','The documents behind YakuBus, collected in one place. Browse by travel task, then check the original publisher for the latest information.','Recorded review dates are not live service checks. Confirm current departures, closures and prices with the operator before travel.','Browse by topic','Source notes & checks'),
 'zh':('资料与参考链接','把 YakuBus 使用的交通、徒步与旅行资料集中放在这里。按出行需要查找，再到原发布方核对最新信息。','资料中的核查日期不代表实时运行状态。出发前请向运营方核对班次、封闭情况与票价。','按主题查找','资料记录与核查说明'),
 'ja':('資料・参考リンク','YakuBusの交通・登山・旅行情報の出典をまとめました。目的別に探し、最新情報は元の発行元でご確認ください。','記録された確認日はリアルタイムの運行確認ではありません。出発前に運行・通行止め・運賃を事業者へご確認ください。','目的別に探す','出典・確認の記録')}
 for lang in ['ja','zh','en']:
  title,description,warning,navtitle,notestitle=intro[lang];hidden='' if lang=='ja'else' hidden'
  toc=''.join(f'<a href="#{s["id"]}-{lang}">{escape(s["title"][lang])}</a>'for s in sections)
  content=[]
  for section in sections:
   links=[]
   for item in section['items']:
    label=item.get('label')or{};label=label.get(lang)or label.get('en')or label.get('ja')or label.get('zh')or item['url'] if isinstance(label,dict)else label
    note=item.get('note')or{};note=note.get(lang,'')if isinstance(note,dict)else note
    rel='noopener noreferrer '+item.get('rel','');url=escape(item['url'],quote=True)
    links.append(f'<li><a href="{url}" target="_blank" rel="{escape(rel,quote=True)}"><span>{escape(label)}</span><span class="resources-arrow" aria-hidden="true">↗</span></a>'+ (f'<p class="resources-link-note">{escape(note)}</p>'if note else'')+'</li>')
   content.append(f'<section class="resources-section" id="{section["id"]}-{lang}"><div class="resources-section-head"><h2>{escape(section["title"][lang])}</h2><span>{len(links)}</span></div><ul class="resources-list">'+''.join(links)+'</ul></section>')
  blocks.append(f'<div data-seo-lang="{lang}" lang="{lang}"{hidden}><header class="resources-head"><h1>{escape(title)}</h1><p class="resources-lead">{escape(description)}</p><p class="resources-caution">{escape(warning)}</p></header><div class="resources-layout"><nav class="resources-toc" aria-label="{escape(navtitle)}"><h2>{escape(navtitle)}</h2>{toc}</nav><div class="resources-body">'+''.join(content)+'</div></div></div>')
 # Preserve full notes in one place, including dated safety caveats and original source URLs.
 notes_html='<section class="resources-notes" id="notes"><h2>'+''.join(f'<span data-seo-lang="{lang}"'+(''if lang=='ja'else' hidden')+'>'+escape(intro[lang][4])+'</span>'for lang in ['ja','zh','en'])+'</h2>'+''.join(f'<details><summary>{n["route"]}</summary><div class="resources-original">{n["html"]}</div></details>'for n in notes)+'</section>'
 p=ROOT/'resources/index.html';text=p.read_text();main='<!-- resources-content:start -->'+''.join(blocks)+notes_html+'<!-- resources-content:end -->'
 if '<!-- resources-content:start -->'in text:text=re.sub(r'<!-- resources-content:start -->.*?<!-- resources-content:end -->',lambda _:main,text,flags=re.S)
 else:text=text.replace('<main id="resourcesMain"></main>',f'<main id="resourcesMain">{main}</main>')
 return {'resources/index.html':text,'resources/catalog.json':json.dumps({'sections':sections},ensure_ascii=False,indent=2)+'\n'}
