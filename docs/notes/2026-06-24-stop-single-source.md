# 公交站：单一数据源说明

## 为什么 OSM 有、我们没标？

- OSM 屋久岛域约 **110** 个 `bus_stop` 节点、**92** 个带 `ref` 站号。
- 本站只服务 **官方种屋久交通时刻表 52 站**（`scripts/lib/catalog.py`）。
- OSM 里约 **51 个 ref** 不在官方表（学校专线、旧站号、同站多节点如「尾之間」「尾之間支所前」等）→ **故意不显示**。
- 官方 52 站里有 **11 站** OSM 无 `ref`，靠站名匹配坐标。

底图蓝公交图标 = OSM 全量；绿/方点巴士 = 本站时刻表站（可点时刻表/导航）。

## 唯一主表（改 PDF 从这里走）

```
scripts/lib/catalog.py     ← 站号、id、日/中/英、分组（人工维护 + PDF 核对）
        ↓ parse_pdf.py
   data.js (BUS_DATA)       ← 时刻表班次
        ↓ build_map_data.py
   map-data.js              ← 运价图布局 + 同一份 stops
        ↓ build_stop_geo.py
   bus-stops-geo.js         ← 仅 lat/lng/source（名称不重复存）
   sources/stops.json       ← catalog 导出，便于查阅/ diff
```

**换新 PDF 时**：更新 `sources/manifest.json` 指向新 PDF → `python3 scripts/build_all.py` 一条命令重建时刻表、运价、地图坐标。站名/站号变更只改 `catalog.py`（或 overrides），不必分头改 guide / geo。

## 前端读取

| 页面 | 站名 | 坐标 |
|------|------|------|
| 时刻表 | BUS_DATA.stops | — |
| 运价 | MAP_DATA.stops | — |
| 便利地图 | MAP_DATA.stops | BUS_STOP_GEO.stops |

`build_stop_geo.py` 会校验 catalog 与 `map-data.js` 的 stop id 一致，不一致则构建失败。
