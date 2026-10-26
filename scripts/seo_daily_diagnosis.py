#!/usr/bin/env python3
"""Compare real acquisition dimensions; report findings, not homework for the owner."""
from datetime import datetime
from urllib.parse import quote, urlsplit
import requests
import json
from pathlib import Path
from html.parser import HTMLParser


def fetch_details(sa, oauth, property_id, site, payload):
    from google.analytics.data_v1beta import BetaAnalyticsDataClient
    from google.analytics.data_v1beta.types import RunReportRequest, DateRange, Dimension, Metric
    from google.auth.transport.requests import AuthorizedSession
    result={"collected_at":datetime.now().astimezone().isoformat()}
    client=BetaAnalyticsDataClient(credentials=sa,transport="rest")
    def ga(start,end,dimensions):
        raw=client.run_report(RunReportRequest(property="properties/"+property_id,
            date_ranges=[DateRange(start_date=start,end_date=end)],dimensions=[Dimension(name=n) for n in dimensions],
            metrics=[Metric(name="sessions")],limit=10000),timeout=35)
        return {"period":{"start":start,"end":end},"complete":raw.row_count<=len(raw.rows) and not getattr(raw.metadata,"subject_to_thresholding",False) and not getattr(raw.metadata,"data_loss_from_other_row",False),
                "rows":[{"keys":[v.value for v in r.dimension_values],"sessions":int(r.metric_values[0].value)} for r in raw.rows]}
    def guarded(function):
        try:return function()
        except Exception as e:return {"error":type(e).__name__,"complete":False,"rows":[]}
    p=payload.get("ga4_daily",{}).get("period",{})
    if p.get("last_7d_start") and p.get("previous_7d"):
        previous=p["previous_7d"].split("~")
        for name,dims in [("ga4_landing",["landingPage"]),("ga4_source",["sessionSourceMedium"]),("ga4_source_landing",["landingPage","sessionSourceMedium"])]:
            result[name]={"current":guarded(lambda:ga(p["last_7d_start"],p["last_7d_end"],dims)),
                          "previous":guarded(lambda:ga(previous[0],previous[1],dims))}
    windows=[payload.get(k,{}).get("period",{}) for k in ("gsc_7d","gsc_previous_7d")]
    if oauth and all(w.get("start") and w.get("end") for w in windows):
        session=AuthorizedSession(oauth)
        endpoint="https://www.googleapis.com/webmasters/v3/sites/"+quote(site,safe="")+"/searchAnalytics/query"
        def gsc(period,dimension):
            rows=[]
            for start in range(0,10000,1000):
                r=session.post(endpoint,json={"startDate":period["start"],"endDate":period["end"],"dataState":"final","dimensions":[dimension],"rowLimit":1000,"startRow":start},timeout=35)
                r.raise_for_status();batch=r.json().get("rows",[]);rows+=batch
                if len(batch)<1000:return {"period":period,"rows":rows,"complete":True,"visible_only":dimension=="query"}
            return {"period":period,"rows":rows,"complete":False,"visible_only":dimension=="query"}
        for name,dim in [("gsc_pages","page"),("gsc_queries","query")]:
            result[name]={side:guarded(lambda w=w:gsc(w,dim)) for side,w in zip(("current","previous"),windows)}
        result["ga4_aligned_source"]={side:guarded(lambda w=w:ga(w["start"],w["end"],["sessionSourceMedium"])) for side,w in zip(("current","previous"),windows)}
    result["page_checks"]=check_landing_pages(result)
    return result


class HeadTags(HTMLParser):
    def __init__(self):super().__init__();self.noindex=False;self.canonical=None
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if tag=="meta" and a.get("name","").lower() in ("robots","googlebot") and "noindex" in a.get("content","").lower():self.noindex=True
        if tag=="link" and a.get("rel")=="canonical":self.canonical=a.get("href")


def check_landing_pages(details):
    catalog=json.loads((Path(__file__).resolve().parents[1]/"sources/seo-pages.json").read_text())
    allowed={page_name(k) for k in catalog if k!="/intro/"}
    losses=[r for r in compared(details.get("ga4_landing",{}),"sessions",page=True) if r["delta"]<0 and r["key"] in allowed][:2]
    checks=[]
    for row in losses:
        path=row["key"];url="https://yakushimabus.com"+(path if path=="/" else path+"/")
        try:
            response=requests.get(url,timeout=20);parser=HeadTags();parser.feed(response.text)
            header_noindex="noindex" in response.headers.get("X-Robots-Tag", "").lower()
            checks.append({"page":path,"url":url,"status":response.status_code,"noindex":parser.noindex or header_noindex,"canonical":parser.canonical})
        except requests.RequestException as e:checks.append({"page":path,"url":url,"error":type(e).__name__})
    return checks


def page_name(value):
    if not value:return ""
    path=urlsplit(value).path if value.startswith("http") else value.split("?",1)[0]
    return path.rstrip("/") or "/"


def compared(pair,metric,page=False,visible_only=False):
    a=pair.get("current",{});b=pair.get("previous",{})
    if not a.get("complete") or not b.get("complete") or a.get("error") or b.get("error"):return []
    def values(block):
        out={}
        for r in block.get("rows",[]):
            key=page_name(r["keys"][0]) if page else r["keys"][0]
            out[key]=out.get(key,0)+r.get(metric,0)
        return out
    current=values(a);previous=values(b)
    keys=current.keys() & previous.keys() if visible_only else current.keys() | previous.keys()
    return sorted([{"key":k,"current":current.get(k,0),"previous":previous.get(k,0),"delta":current.get(k,0)-previous.get(k,0)} for k in keys],key=lambda r:r["delta"])



def analyse(payload):
    details=payload.get("diagnostics",{});ga=payload.get("ga4_daily",{});facts=[];evidence=[];actions=[]
    a=ga.get("last_7d",{});b=ga.get("previous_7d",{})
    if not ga.get("error") and a.get("active_users") is not None and b.get("active_users"):
        facts.append(f"本周活跃访客{b['active_users']}→{a['active_users']}（{(a['active_users']/b['active_users']-1)*100:+.1f}%）。")
    channels=compared({"current":{"complete":not ga.get("error") and 'channels_7d' in ga,"rows":[{"keys":[r['dimension']],"sessions":r['sessions']} for r in ga.get('channels_7d',[])]},"previous":{"complete":not ga.get("error") and 'channels_previous_7d' in ga,"rows":[{"keys":[r['dimension']],"sessions":r['sessions']} for r in ga.get('channels_previous_7d',[])]}},"sessions",visible_only=True)
    labels={"Direct":"直接访问","Organic Search":"自然搜索","AI Assistant":"AI渠道","Referral":"外站链接","Organic Social":"社交平台","Unassigned":"未归类"}
    losses=[r for r in channels if r['delta']<=-5 and r['previous']>=20][:2]
    if losses:
        facts.append("减少集中在"+"、".join(f"{labels.get(r['key'],r['key'])}{r['previous']}→{r['current']}次" for r in losses)+"；这里比较访问次数，不把各渠道人数相加。")
        evidence.extend({**r,"source":"GA4 channel","metric":"sessions"} for r in losses)
    landings=compared(details.get("ga4_landing",{}),"sessions",page=True)
    landing_losses=[r for r in landings if r['delta']<=-5 and r['previous']>=20 and r['key'] not in ('(not set)','')][:2]
    if landing_losses:
        facts.append("入口页减少最多："+"；".join(f"{('首页' if r['key']=='/' else r['key'])} {r['previous']}→{r['current']}次" for r in landing_losses)+"。")
        evidence.extend({**r,"source":"GA4 landing","metric":"sessions"} for r in landing_losses)
    gs=payload.get('gsc_7d',{});old=payload.get('gsc_previous_7d',{})
    if not gs.get('error') and not old.get('error') and gs.get('clicks') is not None and old.get('clicks') is not None:
        same=ga.get('period',{}).get('last_7d_start')==gs.get('period',{}).get('start') and ga.get('period',{}).get('last_7d_end')==gs.get('period',{}).get('end')
        caution="统计周相差一天，不能直接拿来解释整站涨跌。" if not same else "点击和访问次数口径不同，不能直接等同。"
        facts.append(f"Google搜索点击{old['clicks']}→{gs['clicks']}；"+caution)
        if losses and gs['clicks']>=old['clicks']:
            actions.append("目前不能把访客减少归因于Google搜索流量下降。")
    pages=compared(details.get('gsc_pages',{}),'clicks',page=True,visible_only=True)
    queries=compared(details.get('gsc_queries',{}),'clicks',visible_only=True)
    for source,rows in [('GSC page',pages),('GSC visible query',queries)]:
        evidence.extend({**r,'source':source,'metric':'clicks'} for r in rows[:5])
    page_losses=[r for r in pages if r['delta']<=-5 and r['previous']>=10]
    query_losses=[r for r in queries if r['delta']<=-5 and r['previous']>=10]
    if page_losses:
        r=page_losses[0];facts.append(f"Google点击下降最多的页面：{r['key']} {r['previous']}→{r['current']}。")
    if query_losses:
        r=query_losses[0];facts.append(f"可见搜索词中下降最多：“{r['key'][:35]}” {r['previous']}→{r['current']}次点击；不含隐藏词。")
    aligned=compared(details.get('ga4_aligned_source',{}),'sessions')
    google=next((r for r in aligned if r['key']=='google / organic'),None)
    if google:
        facts.append(f"对齐GSC统计周后，GA4的Google自然搜索访问{google['previous']}→{google['current']}次。")
        evidence.append({**google,'source':'GA4 aligned Google','metric':'sessions'})
    source_landing=details.get("ga4_source_landing",{})
    source_landing_rows={}
    for side in ("current","previous"):
        original=source_landing.get(side,{})
        source_landing_rows[side]={**original,"rows":[{**r,"keys":[page_name(r["keys"][0])+" ← "+r["keys"][1]]} for r in original.get("rows",[])]}
    source_landing_changes=compared(source_landing_rows,"sessions")
    if landing_losses:
        name=landing_losses[0]["key"]
        parts=[r for r in source_landing_changes if r["key"].split(" ← ")[0]==name and r["delta"]<=-5 and r["previous"]>=20][:2]
        if parts:
            source_labels={"(direct) / (none)":"直接访问","google / organic":"Google搜索","yahoo / organic":"Yahoo搜索","bing / organic":"必应搜索"}
            facts.append(("首页" if name=="/" else name)+"的减少细分："+"；".join(source_labels.get(r["key"].split(" ← ")[1],r["key"].split(" ← ")[1])+f" {r['previous']}→{r['current']}次" for r in parts)+"。")
            evidence.extend({**r,"source":"GA4 source + landing","metric":"sessions"} for r in parts)
    checks=details.get("page_checks",[])
    good=[r for r in checks if r.get("status")==200 and not r.get("noindex")]
    bad=[r for r in checks if r not in good]
    if good:actions.append("已核验"+"、".join("首页" if r['page']=='/' else r['page'] for r in good)+"可打开，未见禁止收录标记。")
    if bad:actions.append("检测到入口页异常，已在分析明细记录响应或收录标记，需继续修复。")
    expected=('ga4_landing','ga4_source','ga4_source_landing','gsc_pages','gsc_queries','ga4_aligned_source')
    gaps=[name for name in expected if not details.get(name) or any(not details[name].get(side,{}).get('complete') for side in ('current','previous'))]
    if gaps:actions.append("页面/搜索词对比尚有缺项，已记录缺口；自动任务下轮继续采集，不需要你查表。")
    else:actions.append("已自动对比两周渠道、入口页和可见搜索词；后续每日按相同窗口继续核对。")
    if not facts:facts.append("可比较的数据不足，暂不下增长或下降结论。")
    card_findings=([next((f for f in reversed(facts) if "的减少细分" in f),""),next((f for f in facts if f.startswith("入口页减少最多")),"")] if landing_losses else [f for f in facts if f.startswith("减少集中")])
    card_findings=[f for f in card_findings if f][:2]
    judgment="尚不足以判定变化原因；我会继续自动补齐对比数据。"
    if google and gs.get('clicks') is not None and old.get('clicks') is not None:
        window=gs.get('period',{});prior=old.get('period',{})
        judgment=f"Google同周期（{window.get('start')}~{window.get('end')} 对 {prior.get('start')}~{prior.get('end')}）：点击{old['clicks']}→{gs['clicks']}，访问{google['previous']}→{google['current']}；与整站统计周不同，不能直接归因排名。"
    elif gs.get('clicks') is not None and old.get('clicks') is not None:
        judgment=next((f for f in facts if f.startswith("Google搜索点击")),judgment)
    if not card_findings:card_findings=[facts[0]]
    user_actions=[]
    if 'invalid_grant' in str(payload.get('gsc_28d',{}).get('error','')):user_actions.append('Google只读授权已失效，需要你重新登录授权。')
    return {'card_findings':card_findings,'judgment':judgment,'findings':facts,'agent_actions':actions,'user_actions':user_actions,'evidence':evidence,'gaps':gaps,'page_checks':checks,'landing_source_changes':source_landing_changes,
            'periods':{'ga4':ga.get('period',{}),'gsc':gs.get('period',{})},'landing_changes':landings,'source_changes':compared(details.get('ga4_source',{}),'sessions'),'gsc_page_changes':pages,'gsc_visible_query_changes':queries}
