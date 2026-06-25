# 公交站定位数据源与构建

## 管线

`python3 scripts/build_stop_geo.py` → `bus-stops-geo.js`（guide 页 `bus-stops-geo.js?v=stop-geo-v4`）

## 数据源（优先级）

1. **MANUAL** — 少量人工锚点（永田西岸、宫之浦港、自然馆、白谷、荒川登山口等）
2. **KSJ P11-22** — 国土数値情報バス停留所（鹿児島県），筛选屋久岛相关 → `sources/ksj-yakushima-bus-stops.json`
3. **OSM** — Overpass `屋久島町` area：`bus_stop` + `platform`（mail.ru 镜像）

## 过滤规则

- **禁止插值**（不用路线顺序推坐标）
- **group 经度约束** — 拒绝错岸匹配（如永田 lng≈130.43 而非东岸海里 130.70）
- **环岛公路** — 仅 OSM 匹配且 lng>130.68 时要求距 `highway` way <150m，过滤海里误点
- KSJ / manual 不做公路距离硬过滤（登山口等离环岛公路较远但仍在陆地）

## 2026-06-24 结果

- **50/52** 站有坐标（缺：サマナホテルヤクシマ、ザホテルヤクシマ — KSJ/OSM 无对应）
- **西岸**（nagata + west + shiratani + arakawa）：18 站
- **东岸**（east + anbo + airport）：21 站
- **海里点**：0

## 重建

```bash
python3 scripts/build_stop_geo.py
```

删除 `sources/ksj-yakushima-bus-stops.json` 可强制从 `sources/ksj/P11-22_46.geojson` 重筛。
