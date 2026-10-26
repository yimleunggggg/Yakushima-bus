#!/usr/bin/env python3
"""Send one concise Feishu bot DM per report day; require an explicit recipient."""
import json
import sys
import uuid
from pathlib import Path
import seo_feishu_util as fu
from seo_daily_dashboard import value

ROOT=Path(__file__).resolve().parents[1]


def card(payload, url):
    rows=payload.get("daily_changes", [])
    lines=[]
    for name in ["活跃用户·日环比", "会话·日环比", "搜索点击·日环比", "自然搜索会话·周环比"]:
        r=next((r for r in rows if r["metric"]==name), {})
        lines.append(f"**{name}**：{value(r.get('current'))} · {r.get('change', '缺失，不能比较')}")
    ga=payload.get("ga4_daily", {})
    lines += ["", "**今天优先处理**"]+["• "+a for a in payload.get("daily_actions", [])[:3]]
    lines += ["", "**接入状态**"]+[r["service"]+"："+r["status"] for r in payload.get("integrations", [])]
    lines += ["", "GA4完整日："+ga.get("period", {}).get("yesterday", "未取得")+"（"+ga.get("timezone", "未知时区")+"）",
              "GSC final截至："+payload.get("gsc_latest_complete_day", "未取得"),
              "采集："+payload.get("fetched_at_iso", "未知"),
              "缺失不补零；分销点击不等于订单，AdSense收益未接入。"]
    partial=any("失败" in r["status"] for r in payload.get("integrations", []))
    return {"config":{"wide_screen_mode":True},
            "header":{"template":"orange" if partial else "blue", "title":{"tag":"plain_text", "content":"YakuBus 每日重点 · "+payload.get("fetched_at", "")+(" · 数据不完整" if partial else "")}},
            "elements":[{"tag":"div", "text":{"tag":"lark_md", "content":"\n".join(lines)}},
                        {"tag":"action", "actions":[{"tag":"button", "text":{"tag":"plain_text", "content":"打开总览看板"}, "url":url, "type":"primary"}]}]}


def send(payload):
    recipient=fu.cfg("FEISHU_BOT_RECEIVE_ID")
    kind=fu.cfg("FEISHU_BOT_RECEIVE_ID_TYPE") or "open_id"
    if not recipient:
        print("⚠ 飞书机器人未发送：尚未指定收件人；表格更新不代表消息已送达", flush=True)
        return 2
    if kind not in {"open_id", "user_id", "union_id", "email", "chat_id"}:
        raise RuntimeError("飞书机器人收件人类型无效")
    app_id=fu.cfg("FEISHU_BOT_APP_ID"); app_secret=fu.cfg("FEISHU_BOT_APP_SECRET")
    if bool(app_id)!=bool(app_secret):raise RuntimeError("机器人应用ID与密钥必须成对配置")
    token=fu.tenant_token(app_id,app_secret)
    spreadsheet,meta,_=fu.resolve_spreadsheet_token()
    url=meta.get("url") or "https://my.feishu.cn/sheets/"+spreadsheet
    if meta.get("dashboard_sheet_id"): url+="?sheet="+meta["dashboard_sheet_id"]
    body={"receive_id":recipient, "msg_type":"interactive", "content":json.dumps(card(payload, url), ensure_ascii=False),
          "uuid":str(uuid.uuid5(uuid.NAMESPACE_URL, "yakubus-daily:"+payload["fetched_at"]+":"+kind+":"+recipient))}
    data=fu.api_json("POST", "/im/v1/messages?receive_id_type="+kind, token, json=body)
    message_id=data.get("data", {}).get("message_id")
    if not message_id: raise RuntimeError("飞书没有返回消息ID，不能确认发送成功")
    # Feishu acknowledgement proves accepted delivery, not that the recipient read it.
    print("✓ 飞书机器人已接受日报消息："+message_id, flush=True)
    return 0


if __name__=="__main__":
    sys.exit(send(json.loads((ROOT/"docs/seo/metrics/daily-latest.json").read_text())))
