#!/usr/bin/env python3
"""A compact latest-only dashboard and honest calendar-day trend data."""
from datetime import date, timedelta

TITLE = "总览看板"


def latest_payload(days):
    return max(days, key=lambda d: d.get("fetched_at_iso") or d.get("fetched_at", ""))


def value(v):
    return "未取得" if v is None else v


def trend_rows(days, latest):
    end = latest.get("ga4_daily", {}).get("period", {}).get("yesterday")
    if not end:
        return []
    end = date.fromisoformat(end)
    ga, gs = {}, {}
    for d in sorted(days, key=lambda d: d.get("fetched_at_iso") or d.get("fetched_at", "")):
        g = d.get("ga4_daily", {})
        day = g.get("period", {}).get("yesterday")
        if day and not g.get("error"):
            ga[day] = g.get("yesterday", {})
        if not d.get("gsc_28d", {}).get("error"):
            for r in d.get("gsc_daily_final", {}).get("rows", []):
                gs[r["keys"][0]] = r
    rows = []
    for i in range(13, -1, -1):
        day = str(end-timedelta(days=i)); a=ga.get(day, {}); b=gs.get(day, {})
        rows.append([day, value(a.get("active_users")), value(a.get("sessions")),
                     value(a.get("pageviews")), value(b.get("clicks")), value(b.get("impressions"))])
    return rows


def build_dashboard(days):
    d=latest_payload(days); g=d.get("ga4_daily", {}); p=g.get("period", {})
    changes=d.get("daily_changes", [])
    def metric(name):
        r=next((r for r in changes if r["metric"]==name), {})
        return [value(r.get("current")), r.get("change", "缺失，不能比较")]
    users=metric("活跃用户·日环比"); sessions=metric("会话·日环比")
    clicks=metric("搜索点击·日环比"); organic=metric("自然搜索会话·周环比")
    rows=[
        ["YakuBus · 总览看板", "", "", "", "", "", "", ""],
        ["报告更新", d.get("fetched_at_iso", d.get("fetched_at", "")), "GA4完整日", p.get("yesterday", "未取得"), "GSC final截至", d.get("gsc_latest_complete_day", "未取得"), "每天17:00北京时间启动", ""],
        ["① 核心表现", "", "", "", "", "", "", ""],
        ["日活跃用户", "日会话", "日搜索点击", "自然搜索会话·7日", "", "", "", ""],
        [users[0], sessions[0], clicks[0], organic[0], "", "", "", ""],
        ["日环比 "+users[1], "日环比 "+sessions[1], "日环比 "+clicks[1], "周环比 "+organic[1], "", "", "", ""],
        ["② 今天先看这三件事", "", "", "", "", "", "", ""],
    ]
    for i, action in enumerate(d.get("daily_actions", [])[:3], 1):
        rows.append([str(i), action, "", "", "", "", "", ""])
    while len(rows)<10: rows.append([""]*8)
    rows += [["③ 最近14个完整日 · 缺失不补零", "", "", "", "", "", "", ""],
             ["GA4日期（"+g.get("timezone", "未知时区")+"）", "活跃用户", "会话", "页面浏览", "GSC点击", "GSC展示", "流量示意（相同尺度）", ""]]
    trend=trend_rows(days, d)
    peak=max([r[1] for r in trend if isinstance(r[1], (int, float))] or [1]) or 1
    for r in trend:
        bars="未取得" if not isinstance(r[1], (int,float)) else "▰"*max(0, round(r[1]/peak*18))
        rows.append(r+[bars, ""])
    rows += [["④ 接入与变现状态", "", "", "", "", "", "", ""],
             ["服务", "实际状态", "下一步", "", "", "", "", ""]]
    for r in d.get("integrations", []):
        rows.append([r["service"], r["status"], r["action"], "", "", "", "", ""])
    rows += [["阅读顺序", "总览看板 → 每日变化 → 功能使用；其他页签为历史明细。", "", "", "", "", "", ""],
             ["数据说明", "GA4和GSC各按自身完整日；GSC数据有延迟。流量不等于真人，点击不等于订单。", "", "", "", "", "", ""]]
    return rows


def format_dashboard(fu, token, spreadsheet, rows):
    sid=fu.ensure_sheet_tab(token, spreadsheet, TITLE)
    fu.api_json("POST", f"/sheets/v2/spreadsheets/{spreadsheet}/sheets_batch_update", token,
                json={"requests":[{"updateSheet":{"properties":{"sheetId":sid,"index":0,"frozenRowCount":2}}}]})
    sections=[i for i,r in enumerate(rows,1) if str(r[0]).startswith(("①","②","③","④"))]
    styles=[{"ranges":[f"{sid}!A1:H{len(rows)}"],"style":{"font":{"fontSize":"11pt/1.5"},"foreColor":"#233247","backColor":"#FFFFFF"}},
            {"ranges":[f"{sid}!A1:H1"]+[f"{sid}!A{i}:H{i}" for i in sections],"style":{"font":{"bold":True},"backColor":"#173B57","foreColor":"#FFFFFF"}},
            {"ranges":[f"{sid}!A4:D6"],"style":{"backColor":"#EAF4F5","font":{"bold":True}}},
            {"ranges":[f"{sid}!A5:D5"],"style":{"font":{"fontSize":"22pt/1.5","bold":True}}}]
    fu.api_json("PUT", f"/sheets/v2/spreadsheets/{spreadsheet}/styles_batch_update", token,json={"data":styles})
    # v2 dimension indices are one-based and inclusive (official larksuite CLI).
    for dimension,start,end,size in [("COLUMNS",1,6,160),("COLUMNS",7,8,210),("ROWS",1,len(rows),30),("ROWS",5,5,46),("ROWS",2,2,64)]:
        fu.api_json("PUT", f"/sheets/v2/spreadsheets/{spreadsheet}/dimension_range", token,
                    json={"dimension":{"sheetId":sid,"majorDimension":dimension,"startIndex":start,"endIndex":end},
                          "dimensionProperties":{"fixedSize":size}})
    # Merge only blank neighbours. Repeated runs unmerge our owned dashboard first.
    fu.api_json("POST", f"/sheets/v2/spreadsheets/{spreadsheet}/unmerge_cells", token,json={"range":f"{sid}!A1:H{len(rows)}"})
    ranges=[f"A{i}:H{i}" for i in [1]+sections]
    ranges += [f"B{i}:H{i}" for i in [8,9,10,len(rows)-1,len(rows)]]
    for i,r in enumerate(rows,1):
        if i>28 and r[0] not in ("阅读顺序","数据说明"):
            ranges.append(f"C{i}:H{i}")
    for rng in ranges:
        fu.api_json("POST", f"/sheets/v2/spreadsheets/{spreadsheet}/merge_cells", token,json={"range":sid+"!"+rng,"mergeType":"MERGE_ALL"})
    meta=fu.api_json("GET", f"/sheets/v3/spreadsheets/{spreadsheet}/sheets/query", token)
    actual=next(s for s in meta["data"]["sheets"] if s["sheet_id"]==sid)
    if actual.get("index")!=0: raise RuntimeError("看板未排到首页")
    saved=fu.load_sheet_meta()
    saved["dashboard_sheet_id"]=sid
    fu.save_sheet_meta(saved)
    print("✓ 总览看板样式已应用，首页顺序回读通过", flush=True)
