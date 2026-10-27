#!/usr/bin/env python3
"""Send one concise Feishu bot DM per report day; require an explicit recipient."""
import json
import sys
import uuid
from pathlib import Path
import seo_feishu_util as fu

ROOT=Path(__file__).resolve().parents[1]


def card(payload, url):
    from seo_daily_diagnosis import analyse
    rows=payload.get("daily_changes", [])
    ga=payload.get("ga4_daily", {})
    period=ga.get("period", {})
    end=period.get("yesterday")
    gsc=payload.get("gsc_latest_complete_day")
    aligned=bool(end and gsc and end==gsc and not ga.get("error") and not payload.get("gsc_7d",{}).get("error"))
    analysis=payload.get("analysis") or analyse(payload)
    def metric(name):return next((r for r in rows if r.get("metric")==name), {})
    def value(name):
        r=metric(name)
        return f"{r['current']}（{r.get('change','无法比较')}）" if r.get('current') is not None else '暂缺'
    def block(content):return {"tag":"div", "text":{"tag":"lark_md", "content":content}}
    def comparison(name):
        r=metric(name)
        if r.get('current') is None or r.get('previous') is None:return '暂缺'
        return f"{r['previous']}→{r['current']}（{r.get('change','无法比较')}）"
    def clean(s):return str(s).replace('**','').replace('<','＜').replace('>','＞')
    findings=analysis.get('card_findings',[])[:2]
    headline='\n'.join('• '+clean(f) for f in findings) or '可比较的数据不足，暂不能判断变化。'
    elements=[block('📌 **重点发现**\n'+headline), {"tag":"hr"}]
    if aligned:
        elements.append(block('📊 **共同数据日：'+end+'**\n活跃访客 '+value('活跃用户·日环比')+' · 访问 '+value('会话·日环比')+'\nGoogle搜索点击 '+value('搜索点击·日环比')+'\n较前一完整日；来源口径不同。'))
        elements.append(block('📈 **近7天：'+str(period.get('last_7d','未知'))+'**\n活跃访客 '+comparison('活跃用户·周环比')+'\n自然搜索访问 '+comparison('自然搜索会话·周环比')+'\nGoogle搜索点击 '+comparison('搜索点击·周环比')))
        queries=analysis.get('gsc_visible_query_changes',[])
        decline=next((q for q in queries if q.get('delta',0)<=-5 and q.get('previous',0)>=10),None)
        if decline:elements.append(block('🔎 **搜索词变化**\n“'+clean(decline['key'][:35])+'”点击 '+str(decline['previous'])+'→'+str(decline['current'])+'；仅限可见搜索词。'))
        elements.append(block('💡 **判断**\n'+clean(analysis.get('judgment','数据不足，暂不能判断原因。'))))
    else:
        elements.append(block('⚠️ **数据未对齐**\nGA4截至 '+str(end or '未取得')+'；GSC截至 '+str(gsc or '未取得')+'。本轮暂停跨平台共同周期结论，自动任务将继续采集。'))
    actions=analysis.get('agent_actions',[])
    checks=next((a for a in actions if a.startswith('已核验')),None)
    if checks:elements.append(block('✅ **已检查**\n'+clean(checks)))
    for action in analysis.get('user_actions',[]):elements.append(block('⚠️ **需要你操作**\n'+clean(action)))
    errors=[r.get('service','服务') for r in payload.get('integrations',[]) if '失败' in r.get('status','') or '异常' in r.get('status','')]
    note='报告日 '+str(payload.get('fetched_at','未知'))+'（北京时间）｜数据按太平洋时区完整日统计；GA4访问与GSC点击口径不同。'
    if errors:note+=' 异常：'+'、'.join(errors)
    elements.extend([{'tag':'note','elements':[{'tag':'plain_text','content':note}]},
      {'tag':'action','actions':[{'tag':'button','text':{'tag':'plain_text','content':'查看看板和明细'},'url':url,'type':'primary'}]}])
    return {'config':{'wide_screen_mode':True},'header':{'template':'blue' if aligned and not errors else 'orange','title':{'tag':'plain_text','content':'YakuBus 日报 · '+str(payload.get('fetched_at','未知'))}},'elements':elements}


def bot_config():
    raw=fu.cfg("FEISHU_BOT_CONFIG_JSON")
    if raw:
        try: config=json.loads(raw)
        except (ValueError, TypeError):raise RuntimeError("飞书机器人配置JSON格式无效") from None
        keys=("app_id", "app_secret", "receive_id", "receive_id_type")
        if not isinstance(config, dict) or any(not isinstance(config.get(k), str) or not config[k].strip() for k in keys):
            raise RuntimeError("飞书机器人配置缺少必要字段")
        return {k:config[k].strip() for k in keys}
    return {"app_id":fu.cfg("FEISHU_BOT_APP_ID"), "app_secret":fu.cfg("FEISHU_BOT_APP_SECRET"),
            "receive_id":fu.cfg("FEISHU_BOT_RECEIVE_ID"), "receive_id_type":fu.cfg("FEISHU_BOT_RECEIVE_ID_TYPE") or "open_id"}


def send(payload, delivery_key=None, receipt_callback=None):
    config=bot_config()
    recipient=config["receive_id"]
    kind=config["receive_id_type"]
    if not recipient:
        print("⚠ 飞书机器人未发送：尚未指定收件人；表格更新不代表消息已送达", flush=True)
        return 2
    if kind not in {"open_id", "user_id", "union_id", "email", "chat_id"}:
        raise RuntimeError("飞书机器人收件人类型无效")
    app_id=config["app_id"]; app_secret=config["app_secret"]
    if bool(app_id)!=bool(app_secret):raise RuntimeError("机器人应用ID与密钥必须成对配置")
    token=fu.tenant_token(app_id,app_secret)
    spreadsheet,meta,_=fu.resolve_spreadsheet_token()
    url=meta.get("url") or "https://my.feishu.cn/sheets/"+spreadsheet
    if meta.get("dashboard_sheet_id"): url+="?sheet="+meta["dashboard_sheet_id"]
    body={"receive_id":recipient, "msg_type":"interactive", "content":json.dumps(card(payload, url), ensure_ascii=False),
          "uuid":str(uuid.uuid5(uuid.NAMESPACE_URL, (delivery_key or "yakubus-diagnosed-daily-v1:"+payload["fetched_at"])+":"+kind+":"+recipient))}
    data=fu.api_json("POST", "/im/v1/messages?receive_id_type="+kind, token, json=body)
    message_id=data.get("data", {}).get("message_id")
    if not message_id: raise RuntimeError("飞书没有返回消息ID，不能确认发送成功")
    # Feishu acknowledgement proves accepted delivery, not that the recipient read it.
    print("✓ 飞书机器人已接受日报消息："+message_id, flush=True)
    if receipt_callback:receipt_callback(message_id)
    return 0


if __name__=="__main__":
    from seo_daily_delivery import deliver
    sys.exit(deliver(json.loads((ROOT/"docs/seo/metrics/daily-latest.json").read_text())))
