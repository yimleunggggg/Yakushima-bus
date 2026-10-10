# 屋久岛公交查询

路边查下一班公交 + 路线图/运价。纯静态，无后端。

## 数据来源（与官方对齐）

| 类型 | 来源 |
|------|------|
| 时刻表（日/英） | [屋久岛观光协会交通入口](https://yakukan.jp/on-island.html)；当前 2026-10-01 两份 PDF URL 见 `sources/manifest.json` |
| 松ばんだ winter | [matsubanda PDF](https://yakukan.jp/wp-content/uploads/2026/03/matsubanda-timetable-20260301.pdf) + [运行状况](https://yakushima.co.jp/route_bus/) |
| 运价 | [运价表 PDF](https://yakukan.jp/wp-content/uploads/2024/12/yakushimabus-map-unchin.pdf)（2024/3 改定） |
| 高速船/渡轮/机场巴士 | [tykousoku.jp](https://www.tykousoku.jp/fare_time/) · [ferryyakusima2.com](https://ferryyakusima2.com/timetable) · [南国交通](https://nangoku-kotsu.com/ashuttle/kagoshima/) |
| 多日券 | [Iwasaki ゆったり満喫乗車券](https://www.iwasaki-corp.com/kagoshima_kotsu/route-bus/yakushima-free-pass/) |

三语站名：日文为主，中/英来自目录与英文 PDF 对照。

## 文件

| 文件 | 作用 |
|------|------|
| `index.html` | 时刻表 |
| `map/index.html` | 路线图 + 运价 |
| `guide/index.html` | 便利设施地图（POI + 公交站） |
| `access/index.html` | 上岛交通 + 多日券 |
| `trekking/index.html` | 登山路线参考 |
| `without-car/index.html` | 不租车交通攻略（SEO） |
| `intro/index.html` | 产品介绍（noindex） |
| `about/index.html` | 关于本站 |
| `about-data.js` | 关于页文案 |
| `data.js` / `map-data.js` / `access-data.js` | 生成数据 |
| `sources/manifest.json` | 公交 PDF URL、校验和与核查期限 |
| `sources/routes/special.json` | 支线与荒川登山巴士计划班次 |
| `sources/transport-status.json` | 停运、道路公告和受影响线路/路线的唯一状态表 |
| `sources/access/*.json` | 船运、票价、停航日和预约信息的底表 |
| `sources/references.json` | 全站官方来源链接 |
| `sources/access-manifest.json` | 上岛交通官方入口与核查记录 |
| `sources/overrides/` | **局部手工覆盖** |
| `scripts/build_all.py` | **统一构建入口** |

`data.js`、`access-data.js`、`transport-data.js`、`sources-data.js`、PDF 镜像和预览均为派生内容，勿直接维护第二份事实。计划时刻和临时停运分开存储；查询、地图、登山卡片都从同一状态表读取。`validTo` 是本站保守核查范围，不代表官方 PDF 宣布到期。

## 更新流程

### 全量替换（官方发新表）

```bash
# 1. 从官方交通入口确认日/英 PDF、改订日期和停运公告；下载到 assets/pdf/
# 2. 更新 sources/manifest.json 的 URL、文件、SHA-256、核查日期；
#    同时复核 sources/routes/special.json、sources/transport-status.json 和上岛交通底表
# 3. 重建全部派生文件、PDF 预览及页面资源版本
python3 scripts/build_all.py
# 4. 严格核验（过了复核日期会失败）
python3 scripts/build_all.py --validate
# 5. 浏览器检查手机首屏、停运查询、替代路线及日/英 PDF 的切换/来源/预览
```

### 局部修改（不等官方 PDF）

在 `sources/overrides/` 添加 JSON，见 [`sources/overrides/README.md`](sources/overrides/README.md)。

```bash
python3 scripts/build_all.py --map        # 只重建运价
python3 scripts/build_all.py --access     # 只重建上岛交通
python3 scripts/build_all.py --timetable  # 只重建时刻表
```

### 运价校验

`build_all.py --validate` 会核对底表与生成文件、972 个公交时刻单元、常用区间、票价锚点、PDF 校验和/镜像/预览、全站资源版本和核查日期。`.github/workflows/transport-verify.yml` 在交通相关 PR、main 更新和每天 09:00 JST 定时执行同一校验；过了 `reviewAfter` 会失败，提醒先查官方来源，再修底表并重建。不要单独改页面数字或复制另一版表；临时停运需要新公告确认后才能解除。

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
| [**Vibe Coding 教程仓**](https://github.com/yimleunggggg/vibe-coding-static-site-guide) | 从 0 到 1、部署、SEO 自动化、踩坑与复用（公开脱敏） |
| [产品介绍（非技术）](docs/product-intro.md) | 访客 / 社媒 |
| [本站部署](docs/deploy-yakushimabus.md) | yakushimabus.com 运维 |
| [SEO 日报与指标](docs/seo/README.md) | 本仓库 Actions 产出与私人配置 |

## 部署（yakushimabus.com）

**GitHub Pages + 自定义域名**。详细步骤见 [`docs/deploy-yakushimabus.md`](docs/deploy-yakushimabus.md)。

```bash
git push origin main   # 推送后自动发布
```

DNS：根域名 4 条 A 记录 → GitHub Pages IP（见部署文档）。
