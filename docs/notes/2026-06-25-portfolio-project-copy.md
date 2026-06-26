# 个人站 Project 文案 — Yakushima Bus

> 复制到个人网站项目页。标签建议：产品 · 旅行 · 静态站 · 已上线

---

## 一句话

面向屋久岛自由行旅客的**独立公交与交通查询工具**：路边查下一班、看路线图与票价、查船班与便利设施；日 / 中 / 英三语，纯静态部署，弱网可用。

**链接**：[yakushimabus.com](https://yakushimabus.com) · [GitHub](https://github.com/yimleunggggg/Yakushima-bus)（私有仓可只放网站链）

---

## 简介（放项目卡片正文，约 150 字）

屋久岛是世界遗产离岛，公交是岛内主要交通，但时刻表分散在日文 PDF 里，山里信号也差。我在岛上旅行时踩过坑，回来用 vibe coding 做了这个站：把观光协会等**官方公开资料**整理成可搜索的查询页——选站查下一班、看路线与票价、船运上岛、温泉景点与公交站地图。全站静态托管，打开即查；上线后 Google 自然搜索已有「屋久島 バス 時刻表」等词的早期排名。

**当前核心页面**：时刻表 `/` · 票价 `/fare/` · 便利地图 `/guide/` · 船运 `/ferry/` · 登山 `/trekking/` · 不租车 `/without-car/`

---

## 时间线（简表）

| 日期 | 里程碑 |
|------|--------|
| **2026-05-20** | **上线** [yakushimabus.com](https://yakushimabus.com)：GitHub Pages + 自定义域名；时刻表、路线图/运价、上岛交通三页；GA4 / Search Console |
| **2026-05-21** | 桌面布局与 PDF 预览优化；手机端路线图改图片预览；上岛页预约链；SEO 自动拉数（GSC/GA4）雏形 |
| **2026-05-22** | **SEO 日报 Actions** 上线；公开教程仓拆出（见下方复用） |
| **2026-05-25** | 日报 v2（优先级 P0–P2）、站点存活探测 + ntfy 告警；四页内链与 sitemap 加固 |
| **2026-06-09** | 日文 SEO：meta / FAQ / 产品介绍页；全站导航与页眉统一 |
| **2026-06-23** | 渡轮运休公告同步；Ko-fi 支持入口；**登山参考** `/trekking/` |
| **2026-06-24–25** | **便利地图** `/guide/`（92 点位 POI + 公交站）；**不租车攻略** `/without-car/`；SEO 第二轮（title/CTR、GA4 关键事件）；URL 调整为 `/fare/`、`/ferry/` 更贴搜索词 |
| **进行中** | 自然搜索约 40% 用户、核心日文词排名约 5–12 位；持续跟官方 3 月/10 月改表 |

---

## 可复用产出（可链到个人站「延伸阅读」）

| 产出 | 说明 | 链接 |
|------|------|------|
| **静态站 SEO 教程** | 从 0 到 1、GSC/GA4、日报自动化（脱敏公开） | [vibe-coding-static-site-guide](https://github.com/yimleunggggg/vibe-coding-static-site-guide) |
| **SEO 日报流水线** | GitHub Actions + Python 拉 GSC/GA4 + 飞书/ntfy（案例在本仓 `docs/seo/`） | [docs/seo/README.md](https://github.com/yimleunggggg/Yakushima-bus/blob/main/docs/seo/README.md)（仓私有则只写「本项目管理」） |
| **POI 数据管线** | 观光协会抓取 → `poi-data.js` → Leaflet 地图 | `scripts/scrape_yakukan_poi.py`、`scripts/build_poi_data.py` |
| **公交数据构建** | PDF/JSON → `data.js` / `fare-data.js`，含运价锚点校验 | `scripts/build_all.py` |
| **产品介绍 + 演示** | 非技术介绍、45s 演示视频流程 | 站内 `/intro/`（noindex）· `docs/product-intro.md` |

---

## 数据亮点（可选，汇报用）

- 上线约 5 周：~380 月活；自然搜索会话感兴趣率 ~64%（高于 Direct）
- GSC：「屋久島 バス 時刻表」等词已有展示，排名进入第一页尾部
- 主要真实用户：日本 + 中文地区；美国低互动流量当噪音过滤

---

*文案基于仓库 git 与 `docs/notes/`，更新 2026-06-25*
