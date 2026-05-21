# 上岛页「如何购票」区块

## 状态（2026-05-21）
- 代码已在本地完成，**尚未 commit / 部署**，线上 `yakushimabus.com/access/` 仍无此块
- 位置：简介段落下方 → **如何购票**（高速船可网购 + 渡轮码头当日购）→ 时刻表/运价表格

## 涉及文件
- `sources/access/booking.json` — 文案数据源
- `access-data.js` — 含 `ACCESS_DATA.booking`（由 `scripts/build_access_data.py` 生成）
- `access/index.html` — `#bookingPanel` + `renderBooking()`
- `styles.css` — `.access-booking-*`

## 预览
- 本地：`/access/`（`access-data.js?v=booking-v2`，`styles.css?v=layout-v11`）
- 预约链接：`https://www.tykousoku.jp/reserve/`
- 购票区不再重复「时刻表」外链；下方有时刻表区块
- 运价用 `.access-fare-panel` 列表，与时刻表表格区分

## 下一步
commit 并部署后线上可见。
