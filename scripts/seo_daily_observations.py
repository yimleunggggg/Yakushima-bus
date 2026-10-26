#!/usr/bin/env python3
"""Daily comparisons and integration checks, with explicit periods and missing data."""
from datetime import datetime, date, timedelta
from zoneinfo import ZoneInfo
from urllib.parse import quote
from pathlib import Path
import json
import requests

ROOT = Path(__file__).resolve().parents[1]


def complete_windows(timezone_name, now=None):
    now = now or datetime.now(ZoneInfo('Asia/Shanghai'))
    end = now.astimezone(ZoneInfo(timezone_name)).date() - timedelta(days=1)
    return end, end - timedelta(days=1), end - timedelta(days=6), end - timedelta(days=13)


def fetch_gsc_windows(credentials, site):
    from google.auth.transport.requests import AuthorizedSession
    session = AuthorizedSession(credentials)
    endpoint = 'https://www.googleapis.com/webmasters/v3/sites/' + quote(site, safe='') + '/searchAnalytics/query'
    def query(start, end, dims=None, limit=100):
        body = {'startDate':str(start), 'endDate':str(end), 'dataState':'final', 'rowLimit':limit}
        if dims: body['dimensions'] = dims
        r = session.post(endpoint, json=body, timeout=35)
        r.raise_for_status()
        return r.json()
    def block(start, end, detail=False):
        raw = query(start, end, limit=1)
        row = (raw.get('rows') or [{}])[0]
        out = {'period':{'start':str(start), 'end':str(end)}, 'site_url':site,
               'clicks':int(row.get('clicks',0)), 'impressions':int(row.get('impressions',0)),
               'ctr':round(row.get('ctr',0)*100,2), 'position':round(row.get('position',0),3), 'error':None, 'data_state':'final'}
        if detail:
            for dim, key in [('query','top_queries'),('page','top_pages')]:
                out[key] = [{dim:r['keys'][0], 'clicks':int(r.get('clicks',0)), 'impressions':int(r.get('impressions',0)),
                             'ctr':round(r.get('ctr',0)*100,2), 'position':round(r.get('position',0),3)}
                            for r in query(start,end,[dim],20).get('rows',[])]
        return out
    today = datetime.now(ZoneInfo('America/Los_Angeles')).date()
    daily = query(today-timedelta(days=40),today,['date'])
    rows = sorted(daily.get('rows',[]),key=lambda r:r['keys'][0])
    if not rows: raise RuntimeError('GSC没有返回已完成日期；不能把缺失数据当作0')
    end = date.fromisoformat(rows[-1]['keys'][0])
    out = {'gsc_daily_final':daily, 'gsc_latest_complete_day':str(end)}
    periods = {'gsc_28d':(end-timedelta(days=27),end), 'gsc_7d':(end-timedelta(days=6),end),
               'gsc_previous_7d':(end-timedelta(days=13),end-timedelta(days=7)),
               'gsc_latest_day':(end,end), 'gsc_previous_day':(end-timedelta(days=1),end-timedelta(days=1))}
    for key, (start,finish) in periods.items():
        try: out[key] = block(start,finish,key=='gsc_28d')
        except Exception as e: out[key] = {'error':type(e).__name__, 'period':{'start':str(start),'end':str(finish)}}
    return out


def channel(rows, name, metric='sessions'):
    return next((r.get(metric) for r in rows if r.get('dimension',r.get('sessionDefaultChannelGroup'))==name),0) if rows is not None else None


def comparison(source, label, current, previous, window, unit='%'):
    change = None if current is None or previous is None else current-previous
    if change is None: delta='缺失，不能比较'
    elif unit=='个百分点': delta=f'{change:+.2f}个百分点'
    elif previous==0: delta='0%' if current==0 else '新增（前期为0）'
    else: delta=f'{change/previous*100:+.1f}%'
    return {'source':source,'metric':label,'current':current,'previous':previous,'change':delta,'window':window,
            'status':'可比较' if change is not None else '缺失'}


def integration_checks(payload):
    g=payload.get('ga4_daily',{}); s=payload.get('gsc_28d',{})
    rows=[{'service':'GA4','status':'拉取失败' if g.get('error') else '已取数',
           'evidence':g.get('error') or f"属性{g.get('property_id')}；时区{g.get('timezone')}；完整日{g.get('period',{}).get('yesterday')}",
           'action':'检查只读授权/网络' if g.get('error') else '按完整周期比较，不把活跃用户直接称作真人'},
          {'service':'GSC','status':'拉取失败' if s.get('error') else '已取数',
           'evidence':s.get('error') or f"final数据截至{payload.get('gsc_latest_complete_day')}；本站已授权",
           'action':'重新授权GSC' if s.get('error') else '关注点击、展示、CTR及查询词/页面'}]
    try:
        r=requests.get('https://yakushimabus.com/',timeout=25);r.raise_for_status();html=r.text
        ads=requests.get('https://yakushimabus.com/ads.txt',timeout=25)
        correct=ads.status_code==200 and 'google.com, pub-4217601910449827, DIRECT, f08c47fec0942fa0' in ads.text
        code='adsbygoogle.js?client=ca-pub-4217601910449827' in html
        rows.append({'service':'AdSense','status':'代码检测通过；收益未接入' if code and correct else '代码或ads.txt异常',
                     'evidence':f'首页脚本={code}；ads.txt HTTP{ads.status_code}；发布商匹配={correct}；未取得后台审核/收益数据',
                     'action':'后台确认Ready与Authorized；收益API未授权，金额留空，不填0'})
        rows.append({'service':'Clarity','status':'前端代码存在；后台未取数' if 'clarity.ms/tag/' in html else '未检测到前端代码',
                     'evidence':'仅检测公开首页，不代表录屏/热图已产生','action':'后台复核录屏、热图和异常点击，当前不编造数量'})
    except Exception as e:
        rows.append({'service':'网站/AdSense/Clarity','status':'公开检测失败','evidence':type(e).__name__,'action':'检查站点HTTP及网络；不沿用旧检测冒充今天'})
    events=g.get('events_yesterday')
    affiliate=next((r.get('event_count') for r in events or [] if r.get('event_name')=='affiliate_click'),0) if events is not None else None
    rows.append({'service':'Klook等分销','status':'GA4点击可查；订单收益未接入' if events is not None else '事件拉取失败',
                 'evidence':f'最新完整日affiliate_click={affiliate if affiliate is not None else "未取得"}；不等同订单或佣金',
                 'action':'看分销点击变化；订单/佣金必须来自平台后台'})
    return rows


def enrich(payload):
    g=payload.get('ga4_daily',{}); p=g.get('period',{}); changes=[]
    y=g.get('yesterday',{}) if not g.get('error') else {}; prev=g.get('day_before',{}) if not g.get('error') else {}
    for key,label in [('active_users','活跃用户'),('sessions','会话'),('pageviews','页面浏览'),('engagement_rate','参与率')]:
        changes.append(comparison('GA4',label+'·日环比',y.get(key),prev.get(key),f"{p.get('yesterday')} 对 {p.get('day_before')}（{g.get('timezone','时区未知')}）",'个百分点' if key=='engagement_rate' else '%'))
    win=f"{p.get('last_7d')} 对 {p.get('previous_7d','未知前期')}"
    for key,label in [('active_users','活跃用户'),('sessions','会话')]:
        changes.append(comparison('GA4',label+'·周环比',g.get('last_7d',{}).get(key),g.get('previous_7d',{}).get(key),win))
    for name,label,metric in [('Organic Search','自然搜索会话','sessions'),('AI Assistant','AI渠道活跃用户','active_users')]:
        changes.append(comparison('GA4',label+'·周环比',channel(g.get('channels_7d'),name,metric),channel(g.get('channels_previous_7d'),name,metric),win))
    for curkey,prevkey,suffix in [('gsc_latest_day','gsc_previous_day','日环比'),('gsc_7d','gsc_previous_7d','周环比')]:
        a=payload.get(curkey,{});b=payload.get(prevkey,{})
        def period_text(block):
            period=block.get('period',{})
            return period.get('start','未知')+'~'+period.get('end','未知')
        window=f"{period_text(a)} 对 {period_text(b)}（GSC final）"
        for key,label in [('clicks','搜索点击'),('impressions','搜索展示'),('ctr','搜索CTR')]:
            changes.append(comparison('GSC',label+'·'+suffix,a.get(key) if not a.get('error') else None,b.get(key) if not b.get('error') else None,window,'个百分点' if key=='ctr' else '%'))
    payload['daily_changes']=changes
    payload['integrations']=integration_checks(payload)
    actions=[]
    for row in payload['integrations']:
        if '失败' in row['status'] or '异常' in row['status']:actions.append(row['service']+'：'+row['action'])
    weekly=next((r for r in changes if r['metric']=='活跃用户·周环比'),{})
    if weekly.get('current') is not None and weekly.get('previous'):
        ratio=weekly['current']/weekly['previous']
        actions.append('总访客尚未明显增长，优先检查搜索入口及新增攻略落地页。' if ratio<1.05 else '总访客周环比增加；继续观察两周并核对参与质量，暂不归因单次改版。')
    day_click=next((r for r in changes if r['metric']=='搜索点击·日环比'),{})
    if day_click.get('current') is not None and (day_click.get('previous') or 0)>=20 and day_click['current']<day_click['previous']*0.7:
        actions.append(f"最新完整日搜索点击{day_click['current']}，前日{day_click['previous']}（{day_click['change']}）；先核对下降的查询词和页面，再看同星期表现，勿凭一天判定改版影响。")
    actions+=['AdSense审核/收益需后台核验；当前只验证网站代码。' ,'AI渠道增加不等于已验证AI引用增长；分销点击不等于成交。']
    payload['daily_actions']=actions
    return payload


def brief(payload, check_ok=True):
    g=payload.get('ga4_daily',{}); p=g.get('period',{})
    rows=payload.get('daily_changes',[])
    lines=[f"# YakuBus 每日变化 · {payload.get('fetched_at')}",'','## 一、今日结论','',
           f"数据拉取：{payload.get('fetched_at_iso','未知')}；GA4属性时区：{g.get('timezone','未知')}，最新完整日：{p.get('yesterday','未取得')}。",
           f"GSC仅使用final数据，最新完整日：{payload.get('gsc_latest_complete_day','未取得')}。今日未结束的数据不与完整日混比。",'']
    for source,label in [('GA4','活跃用户·周环比'),('GA4','自然搜索会话·周环比'),('GSC','搜索点击·周环比')]:
        r=next((r for r in rows if r['source']==source and r['metric']==label),{})
        lines.append(f"- {label}：{r.get('current') if r.get('current') is not None else '未取得'}；变化 {r.get('change','缺失')}。")
    lines+=['','## 二、每日与每周变化','','| 来源 | 指标 | 当前 | 前期 | 变化 | 比较窗口 |','|---|---|---:|---:|---|---|']
    for r in rows:lines.append('| '+' | '.join(str(r.get(k)) if r.get(k) is not None else '未取得' for k in ['source','metric','current','previous','change','window'])+' |')
    lines+=['','## 三、接入状态','','| 服务 | 状态 | 实际依据 | 下一步 |','|---|---|---|---|']
    for r in payload.get('integrations',[]):lines.append('| '+' | '.join(str(r[k]).replace('|','/') for k in ['service','status','evidence','action'])+' |')
    lines+=['','## 四、今天值得处理的事','']+['- '+a for a in payload.get('daily_actions',[])]
    lines+=['','## 五、入口与原始依据','',
            '- 飞书表格：https://my.feishu.cn/sheets/VjjFsgsRehgdHRt6URZcLGncnXb',
            '- GA4属性：538426834；来源 Google Analytics Data API。',
            '- GSC资源：https://yakushimabus.com/；来源 Search Console Search Analytics API。',
            f"- 原始快照：docs/seo/metrics/daily-{payload.get('fetched_at')}.json；缺失字段留空，不补造0。",
            '- 不将地区或低参与率直接判定为机器人，不将渠道归因当成真人/AI引用证明。',
            '- SEO/GEO检查：'+('通过' if check_ok else '失败，查看运行日志'), '']
    return '\n'.join(lines)
