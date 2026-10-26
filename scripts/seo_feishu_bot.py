#!/usr/bin/env python3
"""Send one concise Feishu bot DM per report day; require an explicit recipient."""
import json
import sys
import uuid
from pathlib import Path
import seo_feishu_util as fu

ROOT=Path(__file__).resolve().parents[1]


def card(payload, url):
    rows=payload.get("daily_changes", [])
    def metric(name):
        return next((r for r in rows if r["metric"]==name), {})
    def number(name, label, period):
        r=metric(name)
        if r.get("current") is None:return label+"：暂缺"
        return f"{label}：{r['current']}（{period}{r.get('change', '暂不能比较')}）"
    ga=payload.get("ga4_daily", {})
    day=ga.get("period", {}).get("yesterday", "暂缺")
    timezone=ga.get("timezone", "时区未知")
    timezone={"America/Los_Angeles":"洛杉矶时间", "Asia/Shanghai":"北京时间"}.get(timezone, timezone)
    lines=["**流量 · "+day+"完整日（"+timezone+"）**",
           number("活跃用户·日环比", "活跃访客", "比前一天"),
           number("会话·日环比", "访问次数", "比前一天"),
           number("搜索点击·日环比", "Google搜索点击", "比前一天"),
           number("自然搜索会话·周环比", "自然搜索近7天访问", "比前7天"), ""]
    from seo_daily_diagnosis import analyse
    analysis=payload.get("analysis") or analyse(payload)
    lines += ["**已查到**"]+["• "+fact for fact in analysis["card_findings"]]
    lines += ["**判断** · "+analysis["judgment"]]
    done=next((a for a in analysis['agent_actions'] if a.startswith('已核验')),None)
    if not done:done=analysis['agent_actions'][-1] if analysis['agent_actions'] else '已自动完成可用数据对比。'
    lines += ["**我已处理** · "+done]
    for action in analysis.get("user_actions",[]):lines.append("**需要你操作** · "+action)
    integrations=payload.get("integrations", [])
    failed=[r["service"] for r in integrations if "失败" in r["status"] or "异常" in r["status"]]
    status=[]
    for r in integrations:
        service=r["service"]
        if service=="GA4":status.append("访问统计异常" if service in failed else "访问统计正常")
        elif service=="GSC":status.append("搜索数据待恢复" if service in failed else "搜索数据正常")
        elif service=="AdSense":status.append("广告代码异常" if service in failed else "广告收益未接入")
        elif service=="Clarity":status.append("录屏后台未接入")
        elif "分销" in service:status.append("分销仅有点击，暂无订单数据")
    if status:lines += ["", "状态："+"；".join(status)]
    final_day=payload.get("gsc_latest_complete_day")
    if final_day:lines.append("搜索数据截至 "+final_day)
    partial=bool(failed)
    return {"config":{"wide_screen_mode":True},
            "header":{"template":"orange" if partial else "blue", "title":{"tag":"plain_text", "content":"YakuBus 日报 · "+payload.get("fetched_at", "")}},
            "elements":[{"tag":"div", "text":{"tag":"lark_md", "content":"\n".join(lines)}},
                        {"tag":"action", "actions":[{"tag":"button", "text":{"tag":"plain_text", "content":"查看看板和明细"}, "url":url, "type":"primary"}]}]}


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


def send(payload):
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
          "uuid":str(uuid.uuid5(uuid.NAMESPACE_URL, "yakubus-diagnosed-daily-v1:"+payload["fetched_at"]+":"+kind+":"+recipient))}
    data=fu.api_json("POST", "/im/v1/messages?receive_id_type="+kind, token, json=body)
    message_id=data.get("data", {}).get("message_id")
    if not message_id: raise RuntimeError("飞书没有返回消息ID，不能确认发送成功")
    # Feishu acknowledgement proves accepted delivery, not that the recipient read it.
    print("✓ 飞书机器人已接受日报消息："+message_id, flush=True)
    return 0


if __name__=="__main__":
    sys.exit(send(json.loads((ROOT/"docs/seo/metrics/daily-latest.json").read_text())))
