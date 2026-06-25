# 2026-06-24 跟进

## 公交站（数据源调研已落盘）
- P11 鹿儿岛 GeoJSON → `sources/ksj-yakushima-bus-stops.json`（岛域 91+ 条）
- `build_stop_geo.py`：**OSM 优先**（`tags.ref` 对站号 → 名称 → KSJ 兜底）+ manual；已重建 `bus-stops-geo.js`（**52/52**，海里 0；osm 44 / ksj 3 / manual 5）
- **为何用 OSM 坐标**：与底图瓦片上的 `highway=bus_stop` 蓝标对齐，避免 KSJ 与瓦片双层错位；**不**改为点击瓦片 POI（栅格瓦片不可交互、无稳定 node id）
- guide 缓存键 `stop-geo-v6`
- 详见 `docs/notes/2026-05-20-bus-stop-geo-sources.md`

## 全站导航
- `site-chrome.js` chrome-v6：`PAGE_HEAD` + `applyPageHead`（简称 nav / 全称 h1 / 一行 cross）
- 已接：guide、index、map、access、trekking、intro
