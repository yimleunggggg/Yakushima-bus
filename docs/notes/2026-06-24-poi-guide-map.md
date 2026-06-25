# POI 便利指南地图（2026-06-24）

## 做了什么

- 新增 `/guide/`：Leaflet 互动地图，整合屋久岛观光协会（yakukan.jp）POI
- 数据管线：`sources/poi/spots.json` → `scripts/build_poi_data.py` → `poi-data.js`
- 全站导航第 6 项「指南 / Guide」（`nav-main--6`）

## 数据来源

| 类别 | 来源 |
|------|------|
| 史跡・温泉・ビーチ・お土産・アウトドアレンタル | yakukan.jp spot 页面（爬虫） |
| 超市·药店、ATM | Google My Maps KML（经爬虫合并） |
| 厕所 | 仅 PDF 链接卡片，无坐标 |

当前 **92** 个带坐标点位（`meta.updatedAt` 见 `spots.json`）。

## 刷新数据

```bash
python3 scripts/scrape_yakukan_poi.py   # 重新抓取 → sources/poi/spots.json
python3 scripts/build_poi_data.py       # 生成 poi-data.js
```

## 页面文件

- `guide/index.html` — 页面壳 + SEO
- `guide.js` — 地图、筛选、列表、i18n
- `styles.css` — `.guide-layout` 等样式
