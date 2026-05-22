# 屋久岛公交查询

路边查下一班公交 + 路线图/运价。纯静态，无后端。

## 数据来源（与官方对齐）

| 类型 | 来源 |
|------|------|
| 时刻表（日/英） | [taneyakubus PDF](https://yakukan.jp/wp-content/uploads/2026/03/taneyakubus-timetable-20260301.pdf) |
| 松ばんだ winter | [matsubanda PDF](https://yakukan.jp/wp-content/uploads/2026/03/matsubanda-timetable-20260301.pdf) + [运行状况](https://yakushima.co.jp/route_bus/) |
| 运价 | [运价表 PDF](https://yakukan.jp/wp-content/uploads/2024/12/yakushimabus-map-unchin.pdf)（2024/3 改定） |
| 高速船/渡轮/机场巴士 | [tykousoku.jp](https://www.tykousoku.jp/fare_time/) · [ferryyakusima2.com](https://ferryyakusima2.com/timetable) · [南国交通](https://nangoku-kotsu.com/ashuttle/kagoshima/) |
| 多日券 | [Iwasaki ゆったり満喫乗車券](https://www.iwasaki-corp.com/kagoshima_kotsu/route-bus/yakushima-free-pass/) |

三语站名：日文为主，中/英来自目录与英文 PDF 对照。

## 文件

| 文件 | 作用 |
|------|------|
| `index.html` | 时刻表 |
| `map.html` | 路线图 + 运价 |
| `access.html` | 上岛交通 + 多日券（直出表格） |
| `about.html` | 关于本站 / 开发者说明（三语） |
| `about-data.js` | 关于页文案 |
| `data.js` / `map-data.js` / `access-data.js` | 生成数据 |
| `sources/manifest.json` | 公交官方 URL |
| `sources/access-manifest.json` | 上岛交通官方 URL |
| `sources/overrides/` | **局部手工覆盖** |
| `scripts/build_all.py` | **统一构建入口** |

## 更新流程

### 全量替换（官方发新表）

```bash
# 1. 下载 PDF 到 assets/，更新 sources/manifest.json 中的 URL/文件名
curl -fsSL -o assets/taneyaku-20260301.pdf "https://yakukan.jp/.../taneyakubus-timetable-YYYYMMDD.pdf"

# 2. 重建并校验运价锚点
python3 scripts/build_all.py

# 3. 浏览器预览 index.html / map.html
python3 -m http.server 8765
```

### 局部修改（不等官方 PDF）

在 `sources/overrides/` 添加 JSON，见 [`sources/overrides/README.md`](sources/overrides/README.md)。

```bash
python3 scripts/build_all.py --map        # 只重建运价
python3 scripts/build_all.py --access     # 只重建上岛交通
python3 scripts/build_all.py --timetable  # 只重建时刻表
```

### 运价校验

`build_all.py` 会自动校验 11 组锚点票价（港→安房 870 等）。失败则退出，需修正 `scripts/lib/fare_table.py` 或 overrides。

## 运价说明

- 地图页票价来自 **2024年3月改定** 官方运价表
- 非主要列站点通过「运价锚点」估算，标注 **目安**
- 页脚小字：**实际以车内整理券与司机收费为准**

## 本地预览

```bash
python3 -m http.server 8765
```

## 文档

| 文档 | 读者 |
|------|------|
| [**Playbook**（流程 / 架构 / 踩坑 / 复用）](docs/playbook/README.md) | 自己复盘、vibe coding 分享 |
| [**教程独立仓库**（可分享）](https://github.com/yimleunggggg/vibe-coding-static-site-guide) | Vibe Coding 静态工具站使用教程 |
| [产品介绍（非技术）](docs/product-intro.md) | 访客 / 社媒 |
| [SEO 自动化教程（脱敏）](docs/seo/tutorial/README.md) | 跟做 Actions 日报 |

## 部署（yakushimabus.com）

**GitHub Pages + 自定义域名**。详细步骤见 [`docs/deploy-yakushimabus.md`](docs/deploy-yakushimabus.md)。

```bash
git push origin main   # 推送后自动发布
```

DNS：根域名 4 条 A 记录 → GitHub Pages IP（见部署文档）。
