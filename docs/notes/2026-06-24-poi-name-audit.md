# POI 名称审计与修复（2026-06-24）

## 问题

Guide 地图侧栏 ATM 出现多个网点名拼成一条（KML placemark 的 `name` 含换行）。

## 根因

`scripts/scrape_yakukan_poi.py` 从 Google My Maps KML 导入 ATM 时，未拆分换行分隔的多名称；`enrich_poi_i18n.py` 机翻导致邮局 ATM 中文地名错误。

## 修复

- `spots.json`：拆分 `gmap-atm-8/9/10` → 新增 `gmap-atm-14/15/16`；修正邮局/JA/信渔连等 zh/en
- `scrape_yakukan_poi.py`：`split_kml_names()` 防止复发
- 重建 `poi-data.js`；`guide/index.html` cache `poi-v5`

## 未改

其他类别无换行拼接；部分景点 zh 机翻质量一般但非错乱，未批量重写。
