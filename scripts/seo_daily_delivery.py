#!/usr/bin/env python3
"""Business-day delivery receipt and early preparation for the 10:00 Beijing report."""
import hashlib
import json
import os
import subprocess
import sys
import time
from datetime import datetime, time as daytime
from pathlib import Path
from zoneinfo import ZoneInfo

ROOT=Path(__file__).resolve().parents[1]
ZONE=ZoneInfo("Asia/Shanghai")
DIRECTORY="docs/seo/delivery"


def context(config,now=None):
    now=(now or datetime.now(ZONE)).astimezone(ZONE)
    recipient=config.get("receive_id", "").strip()
    if not recipient:raise RuntimeError("未配置机器人收件人")
    identity="|".join(config.get(k, "").strip() for k in ("app_id","receive_id_type","receive_id"))
    fingerprint=hashlib.sha256(identity.encode()).hexdigest()
    return {"now":now,"target":datetime.combine(now.date(),daytime(10),ZONE),"day":str(now.date()),
            "fingerprint":fingerprint,"path":DIRECTORY+"/"+str(now.date())+"-"+fingerprint[:12]+".json"}


def valid(receipt,ctx):
    try:
        accepted=datetime.fromisoformat(receipt['accepted_at'].replace('Z','+00:00'))
        return (receipt.get('business_date')==ctx['day'] and receipt.get('slot')=='10:00' and
                receipt.get('recipient_fingerprint')==ctx['fingerprint'] and
                str(receipt.get('message_id','')).startswith('om_') and
                accepted>=ctx['target'] and accepted.astimezone(ZONE).date()==ctx['now'].date())
    except (ValueError,KeyError,TypeError):return False


def read_receipt(root,ctx,refresh=True):
    if refresh:subprocess.run(['git','-C',str(root),'fetch','origin','main'],check=True,capture_output=True,timeout=40)
    result=subprocess.run(['git','-C',str(root),'show','origin/main:'+ctx['path']],capture_output=True,text=True,timeout=15)
    if result.returncode:return None
    try:return json.loads(result.stdout)
    except ValueError:raise RuntimeError('远端投递凭证格式异常，停止以免重复发送') from None


def should_run(event,ctx,receipt):
    if event!='schedule':return True
    if valid(receipt or {},ctx):return False
    # Do not treat a previous day's extremely late trigger as today's early-morning report.
    return (ctx['target']-ctx['now']).total_seconds()<=1200


def wait_for_target(target):
    while True:
        remaining=(target-datetime.now(ZONE)).total_seconds()
        if remaining<=0:return
        if remaining>1200:raise RuntimeError('不在日报预热窗口内，禁止过早发送')
        time.sleep(min(60,remaining))


def gate():
    raw=os.environ.get('FEISHU_BOT_CONFIG_JSON','').strip()
    try:config=json.loads(raw) if raw else {'app_id':os.environ.get('FEISHU_BOT_APP_ID',''),'receive_id':os.environ.get('FEISHU_BOT_RECEIVE_ID',''),'receive_id_type':os.environ.get('FEISHU_BOT_RECEIVE_ID_TYPE','open_id')}
    except ValueError:raise RuntimeError('机器人完整配置JSON无效') from None
    ctx=context(config);receipt=read_receipt(ROOT,ctx)
    run=should_run(os.environ.get('GITHUB_EVENT_NAME',''),ctx,receipt)
    if run:print('本轮需要采集/投递',flush=True)
    elif valid(receipt or {},ctx):print('已有今日10点投递凭证，本轮跳过：'+receipt['message_id'],flush=True)
    else:print('schedule到达时不在09:40之后的预热窗口，不提前打扰用户',flush=True)
    output=os.environ.get('GITHUB_OUTPUT')
    if output:
        with open(output,'a') as f:f.write('should_run='+str(run).lower()+'\n')


def deliver(payload,root=ROOT,now=None):
    from seo_feishu_bot import bot_config,send
    config=bot_config();ctx=context(config,now)
    if payload.get('fetched_at')!=ctx['day']:raise RuntimeError('数据日期不是本次业务日，禁止把旧日报当今天发送')
    event=os.environ.get('GITHUB_EVENT_NAME','manual')
    business=event=='schedule' or ctx['now']>=ctx['target']
    if not business:
        preview='preview:'+os.environ.get('GITHUB_RUN_ID','local')+':'+ctx['day']
        return send(payload,delivery_key=preview)
    receipt=read_receipt(root,ctx)
    if valid(receipt or {},ctx):
        print('✓ 今日10点日报已有真实投递凭证，跳过重复发送：'+receipt['message_id'],flush=True)
        return 0
    if ctx['now']<ctx['target']:
        print('已提前完成采集和写表，等待北京时间10:00发送',flush=True)
        wait_for_target(ctx['target'])
        ctx=context(config,now=ctx['target'] if now else None)
        receipt=read_receipt(root,ctx)
        if valid(receipt or {},ctx):return 0
    def accepted(message_id):
        from seo_daily_publish import publish
        accepted_at=(now if now and now>=ctx['target'] else ctx['target'] if now else datetime.now(ZONE))
        record={'business_date':ctx['day'],'slot':'10:00','recipient_fingerprint':ctx['fingerprint'],
                'accepted_at':accepted_at.isoformat(),'message_id':message_id,'report_fetched_at':payload.get('fetched_at_iso'),
                'run_id':os.environ.get('GITHUB_RUN_ID'),'event':event}
        p=Path(root)/ctx['path'];p.parent.mkdir(parents=True,exist_ok=True);p.write_text(json.dumps(record,ensure_ascii=False,indent=2)+'\n')
        publish(root,paths=[DIRECTORY])
        print('✓ 今日10点投递凭证已保存；后续兜底不会重复发送',flush=True)
    return send(payload,receipt_callback=accepted)


if __name__=='__main__':
    if len(sys.argv)>1 and sys.argv[1]=='gate':gate()
    else:sys.exit(deliver(json.loads((ROOT/'docs/seo/metrics/daily-latest.json').read_text())))
