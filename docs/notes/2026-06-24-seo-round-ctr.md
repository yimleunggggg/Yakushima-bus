# SEO Round 2 — CTR / 内链 / 事件（2026-06-24）

## P0 已完成
- `/` title·meta 对齐「屋久島バス時刻表 2026」「屋久島交通」
- `/map/` title·meta 对齐「路線図・料金」「Yakushima Bus Map」+ hreflang
- `sitemap.xml` 更新 lastmod；`/map/` priority 0.9；新增 `/without-car/`

## P1 GA4 关键事件（需在 GA4 后台标记）
`analytics-events.js` 发送：
- `file_download` — PDF 链接
- `open_maps` — Google Maps 链接
- `timetable_preset` — 首页常用区间
- `fare_lookup` — 地图页运价查询
- `open_timetable` — 地图页「查看时刻表」

内部流量：访问任意页加 `?ga_internal=1`（已支持，见 `analytics.js`）。

## P2 内链
- `/`、`/map/` 增加 `page-seo-lead` + meta 栏关键词链到 map / access / without-car

## P3
- 新页 `/without-car/` — 不租车交通说明 + 链到工具页

## 未做（刻意）
- 未拆 `/timetable/`、`/fare/` 独立 URL（避免与 `/`、`/map/` 抢权重）
