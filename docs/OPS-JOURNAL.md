# YakuBus 运维变更日志

> 唯一主轴：**版本号 + 日期 → 加了 / 改了 / 减去了**。最新在上。  
> 长教程：`docs/notes/` · SEO 专轴：[seo/SEO-JOURNAL.md](seo/SEO-JOURNAL.md)

**当前 V1.8.3 · 2026-06-30**

---

## 待办

- [ ] GSC：新页 URL 检查（`/without-car/`、`/map/`、`/fare/`、`/ferry/` 等）
- [ ] Bing：建议操作「meta 过短」复扫（部署后 48h+）
- [ ] 搜狗 / 360（可选）
- [ ] IndexNow（可选）

---

## V1.8.3（2026-06-30）— Bing meta description 加长

**加了**
- `/access/` 跳转页：`meta description` + `noindex, follow`

**改了**
- 首页、`/ferry/` 的 `meta description` 扩至约 150 字（Bing 建议 150–160）
- 首页 og / twitter description 同步加长
- `seo-head-zh.js` 首页、船运中文 description 加长

**减去了 / 下线**
- `/access/` 不再参与索引（权重归 `/ferry/`）

**技术**：`index.html`、`ferry/index.html`、`access/index.html`、`seo-head-zh.js?v=seo-zh-v2`

---

## V1.8.2（2026-06-30）— Trace v1.10 工具升级

**加了**
- `project.resources` 6 条项目入口（GitHub、生产站、OPS-JOURNAL 等）
- 节点 `2026-06-30-trace-v110-upgrade`
- `docs/buildtrace/backups/nodes-before-v1.10.json`（40 节点备份）

**改了**
- Trace v1.10：`viewer/`、`SKILL.md`、`scripts/`、`references/`、`CURSOR-UPDATE-PROMPT.md`、`.cursor/rules/buildtrace.mdc`
- 看板 boot 优先 `../nodes.json`；资料柜支持 id 与编辑/移除
- `PROJECT-NODES.md` 重生成（41 节点 + 项目入口）

**减去了 / 下线**
- Trace v1.8 工具文件（由 v1.10 覆盖）

**技术**：`nodes.json` 41 节点、`PROJECT-PROFILE.md` 未改动、`buildtrace-v1.10.zip`

---

## V1.8.1（2026-06-30）— Trace v1.8 工具升级

**加了**
- `docs/buildtrace/CURSOR-UPDATE-PROMPT.md`（更新边界与维护流程）
- `docs/buildtrace/references/evidence-policy.md`、`lifecycle.md`
- `docs/buildtrace/release/` 发布文案
- `docs/buildtrace/backups/nodes-before-v1.8.json`（39 节点备份）
- 节点 `2026-06-30-trace-v18-upgrade`

**改了**
- Trace v1.8：`viewer/`、`SKILL.md`、`scripts/`、`references/`、`.cursor/rules/buildtrace.mdc`
- 看板保留 `../nodes.json` 优先加载与「清空缓存并重载」
- `PROJECT-NODES.md` 重生成（40 节点）

**减去了 / 下线**
- Trace v1.6 工具文件（由 v1.8 覆盖）

**技术**：`nodes.json` 40 节点（39 历史 + 1 升级节点）、`PROJECT-PROFILE.md` 未改动、`buildtrace-v1.8.zip`

---

## V1.8.0（2026-07-01）— Trace v1.6 看板与规则升级

**加了**
- `docs/buildtrace/backups/nodes-before-v1.6.json`（升级前节点备份）

**改了**
- Trace v1.6：`viewer/`、`SKILL.md`、`scripts/nodes-json-to-md.mjs`、`.cursor/rules/buildtrace.mdc`
- `PROJECT-NODES.md` 用 v1.6 脚本重生成

**减去了 / 下线**
- BuildTrace v1.5 看板/脚本（由 v1.6 覆盖）

**技术**：`docs/buildtrace/nodes.json`（39 节点未改动）、`buildtrace-v1.6.zip`

---

## V1.7.9（2026-07-01）— Trace / BuildTrace v1.5 安装与节点迁移

**加了**
- Trace v1.5：`docs/buildtrace/`（viewer、references、v1.5 字段）
- `docs/buildtrace/backups/nodes-before-v1.5.json`（38 节点备份）
- 全局 skill `~/.cursor/skills/buildtrace/`（含 references/）

**改了**
- 37 条历史节点迁移至 v1.5 结构（plainSummary、scenario、结构化 evidence）
- `.cursor/rules/buildtrace.mdc` 更新为 v1.5 Agent 工作流

**减去了 / 下线**
- BuildTrace v1.2 包文件（viewer/scripts/templates/SKILL 旧版）
- 旧节点 `2026-06-30-buildtrace-v11-deep-backfill`（由 v1.5 安装节点替代）

**技术**：`docs/buildtrace/nodes.json`（39 节点）、`buildtrace-v1.5.zip`

---

## V1.7.8（2026-06-30）— BuildTrace v1.2 与节点中文修复

**加了**
- `nodes.json` 语言修复元数据（`language_repair` 块）

**改了**
- BuildTrace 升级 v1.2（SKILL、viewer「清空旧缓存」、nodes-json-to-md、cursor-rule）
- 38 条节点人类可读字段统一中文；`PROJECT-NODES.md` 重生成

**减去了 / 下线**
- v1.1 包文件引用（由 v1.2 覆盖）

**技术**：`docs/buildtrace/nodes.json`、`buildtrace-v1.2.zip`

---

## V1.7.7（2026-06-30）— BuildTrace v1.1 深度回填

**加了**
- `nodes.json` 回填元数据（`backfill` 块：来源、git 108 commits、不可访问项）
- 38 条项目节点（2026-05-20 → 2026-06-30）

**改了**
- BuildTrace 升级 v1.1（SKILL、viewer、nodes-json-to-md 中文版、cursor-rule）
- `PROJECT-NODES.md` 全量重生成

**减去了 / 下线**
- 旧 11 条浅回填节点（由 38 条深度节点替代）

**技术**：`docs/buildtrace/nodes.json`、`buildtrace-v1.1.zip`

---

## V1.7.6（2026-06-30）— 接入 BuildTrace 项目节点记忆

**加了**
- `docs/buildtrace/`：`nodes.json`（11 条回填节点）、`PROJECT-PROFILE.md`、`PROJECT-NODES.md`、viewer、scripts
- `.cursor/rules/buildtrace.mdc`
- 全局 skill `~/.cursor/skills/buildtrace/SKILL.md`

**改了**
- （无）

**减去了 / 下线**
- （无）

**技术**：`docs/buildtrace/nodes.json`、`docs/buildtrace/viewer/index.html`

---

## V1.7.5（2026-06-30）— 下线 SHIPLOG

**加了**
- （无）

**改了**
- （无）

**减去了 / 下线**
- `docs/shiplog/`、`docs/SHIPLOG.md`、`.cursor/rules/shiplog.mdc`
- 全局 skill `~/.cursor/skills/shiplog/`

**技术**：项目记忆仍用 `docs/OPS-JOURNAL.md` + `ops-journal` skill

---

## V1.7.4（2026-06-30）— 接入 SHIPLOG 项目记忆

**加了**
- `docs/shiplog/`：SHIPLOG skill、模板、示例
- `docs/SHIPLOG.md`：判断痕迹主文件（3 条种子条目）
- `.cursor/rules/shiplog.mdc`：完成重要改动后落盘规则
- 全局 skill `~/.cursor/skills/shiplog/SKILL.md`

**改了**
- （无）

**减去了 / 下线**
- （无）

**技术**：`docs/SHIPLOG.md`、`docs/shiplog/SKILL.md`、`.cursor/rules/shiplog.mdc`

---

## V1.7.3（2026-05-20）— 运维日志格式改为加减改

**加了**
- 全局 skill `~/.cursor/skills/ops-journal/SKILL.md`（显式唤起记运维）
- 版本块固定 **加了 / 改了 / 减去了** 三块

**改了**
- `change-journal.mdc`：去掉主文件里的归因表、平台对照、验证字段
- 本文件 2026-05-25～2026-06-29 全部条目按新格式重写

**减去了 / 下线**
- 主文件不再维护归因 ID、指标窗口、平台对照大表

**技术**：`docs/OPS-JOURNAL.md`、`~/.cursor/rules/change-journal.mdc`

---

## V1.7.2（2026-06-29）— 运维日志合并为单文件

**加了**
- `docs/OPS-JOURNAL.md` 作为唯一运维主文件

**改了**
- 原 `JOURNAL.md`、`GROWTH-NODES.md` 改为 stub 重定向

**减去了 / 下线**
- 不再双写 JOURNAL + GROWTH-NODES 两份

**技术**：`docs/OPS-JOURNAL.md`

---

## V1.7.1（2026-06-28）— GA4 埋点 v4（debug 跨页 + 事件委托）

**加了**
- `analytics-events.js` v4：debug 参数 `localStorage` 跨页持久化

**改了**
- 全站埋点改为事件委托，换页 DebugView 不断

**减去了 / 下线**
- （无）

**技术**：`analytics-events.js?v=analytics-v4`

**详情**：[notes/2026-06-25-analytics.md](notes/2026-06-25-analytics.md)

---

## V1.7.0（2026-06-28）— GA4 关键事件标记

**加了**
- GA4 后台：`fare_lookup` 等事件标 ☆ 关键事件

**改了**
- （无代码）

**减去了 / 下线**
- （无）

**技术**：GA4 属性 `G-BX2P31GEHW`（后台配置）

**详情**：[notes/2026-06-25-analytics.md](notes/2026-06-25-analytics.md)

---

## V1.6.9（2026-06-28）— GA4 排除内部流量

**加了**
- GA4 数据过滤器：排除 `traffic_type=internal`（自测流量）

**改了**
- 标准报告用户数不再计入内部自测

**减去了 / 下线**
- （无）

**技术**：GA4 后台「排除内部自测」过滤器

**详情**：[notes/2026-06-25-analytics.md](notes/2026-06-25-analytics.md)

---

## V1.6.8（2026-06-28）— 中文 SEO 动态 meta

**加了**
- `seo-head-zh.js`：`?lang=zh` 时动态中文 title / description / og
- `sitemap-zh.xml`（7 条 `?lang=zh` URL）
- `robots.txt` 声明双 sitemap

**改了**
- `lang-boot.js` v4：百度 / 搜狗来源首访优先 `zh`

**减去了 / 下线**
- （无）

**技术**：`seo-head-zh.js?v=seo-zh-v1`、`lang-boot.js?v=lang-v4`、`sitemap-zh.xml`

**详情**：[notes/2026-06-28-baidu-search-setup.md](notes/2026-06-28-baidu-search-setup.md)

---

## V1.6.7（2026-06-28）— 百度搜索资源平台登记

**加了**
- 根目录 `baidu_verify_*.html` 验证文件
- `index.html` `baidu-site-verification` meta
- 百度搜索资源平台提交 `sitemap-zh.xml`

**改了**
- （无）

**减去了 / 下线**
- （无）

**技术**：`baidu_verify_codeva-oiTnOYey5q.html`

**详情**：[notes/2026-06-28-baidu-search-setup.md](notes/2026-06-28-baidu-search-setup.md)

---

## V1.6.6（2026-06-28）— Bing Webmaster 登记

**加了**
- Bing Webmaster 属性（从 GSC 导入）
- Sitemap 提交；手动提交 7 条 canonical URL

**改了**
- （无）

**减去了 / 下线**
- （无）

**技术**：`sitemap.xml`（7 URL）

**详情**：[notes/2026-06-28-bing-webmaster-setup.md](notes/2026-06-28-bing-webmaster-setup.md)

---

## V1.6.5（2026-06-27）— 数据审计接入构建 + 站牌弹窗统一数据源

**加了**
- `build_all.py --validate` 接入 `audit_pdf_trips.py`

**改了**
- 地图 / 票价站牌弹窗改用 `getStopDepartures` / `columnTrips`（不再读 fragment）
- 与 V1.6.0 / V1.5.9 的 columnTrips + 15 列修复一并上线

**减去了 / 下线**
- 站牌弹窗读 fragment 的旧逻辑

**技术**：`build_all.py`、`audit_pdf_trips.py`、`app-core.js`；`data.js?v=data-column-v3`

**详情**：[notes/2026-06-27-pdf-full-audit.md](notes/2026-06-27-pdf-full-audit.md)

---

## V1.6.4（2026-06-27）— 登山页分销区位置

**加了**
- （无）

**改了**
- 登山页「屋久岛当地体验·一日游」分销白卡片：移回 **登山季节 ↓ 分销 ↓ 路线推荐**（原误放在 8 条路线卡片下方）

**减去了 / 下线**
- （无）

**技术**：`trekking/index.html`、`styles.css?v=layout-v134`

**详情**：[notes/2026-06-25-ferry-trekking-affiliate.md](notes/2026-06-25-ferry-trekking-affiliate.md)

---

## V1.6.3（2026-06-27）— 手动切语言后不再被 URL 覆盖

**加了**
- `localStorage` 标记 `lang-picked`（用户手动选语言后生效）

**改了**
- 手动选 EN 后，导航链不再因残留 `?lang=zh` 把语言打回中文

**减去了 / 下线**
- URL 参数强制覆盖用户选择的逻辑

**技术**：`lang-boot.js?v=lang-v2`、`app-core.js?v=core-v12`

**详情**：[notes/2026-06-27-browser-lang.md](notes/2026-06-27-browser-lang.md)

---

## V1.6.2（2026-06-27）— 浏览器语言自动落地

**加了**
- 首访按 `navigator.languages` 自动选 ja / zh / en
- 无 `?lang=` 时自动写入 URL；顶栏链接携带 `lang=`

**改了**
- 分享链接与页面语言一致

**减去了 / 下线**
- （无）

**技术**：`lang-boot.js?v=lang-v1`、`site-chrome.js?v=chrome-v22`、`app-core.js?v=core-v11`

**详情**：[notes/2026-06-27-browser-lang.md](notes/2026-06-27-browser-lang.md)

---

## V1.6.1（2026-06-27）— 便利设施地图路径与 UI

**加了**
- （无）

**改了**
- 便利设施地图 canonical 路径 `/map/`（原 guide 语义）
- 筛选 chip 间距、班次卡对齐、`.trip.open` 展开经停、移动端列表高度

**减去了 / 下线**
- （无）

**技术**：`styles.css?v=layout-v130`～`layout-v132`

**详情**：[notes/2026-06-27-map-url.md](notes/2026-06-27-map-url.md)

---

## V1.6.0（2026-06-27）— PDF 全表 15 列 + 末列截断修复

**加了**
- `scripts/audit_pdf_trips.py` PDF 时刻审计脚本

**改了**
- `parse_pdf.py`：`ncols` 取全表最大列数（**15 列**完整入库）
- 工作日 宫之浦港入口→宫浦小前：**11 班 → 12 班**（与 PDF 一致）

**减去了 / 下线**
- 参考站截断末列导致的缺班

**技术**：`parse_pdf.py`、`data.js?v=data-column-v2`→`data-column-v3`

**详情**：[notes/2026-06-27-pdf-full-audit.md](notes/2026-06-27-pdf-full-audit.md)

---

## V1.5.9（2026-06-27）— 环线跨站搜索丢班修复

**加了**
- `data.js` 整列 `columnTrips` 字段

**改了**
- `findTrips` 优先按列起终点匹配；跨 2–3 站小段搜索不再只剩首班（如仅松叶 04:00）

**减去了 / 下线**
- 仅按 fragment 小段匹配导致丢班的逻辑

**技术**：`app-core.js?v=core-v10`、`data.js?v=data-column-v1`→`data-column-v2`

**详情**：[notes/2026-06-27-column-trip-search.md](notes/2026-06-27-column-trip-search.md)

---

## V1.5.8（2026-06-27）— 变更日志制度

**加了**
- 全局规则 `~/.cursor/rules/change-journal.mdc`（Agent 自动落盘义务）

**改了**
- （无）

**减去了 / 下线**
- （无）

**技术**：`~/.cursor/rules/change-journal.mdc`

---

## V1.5.0（2026-06-26）— SEO 文案「2026最新」

**加了**
- （无）

**改了**
- 各页 title / meta / og / JSON-LD / FAQ：「3月改定」→「**2026最新**」（PDF 备注仍保留具体改定月）
- `site-chrome.js` 时刻表、运价页 lead；`intro-data.js` 功能卡

**减去了 / 下线**
- SERP 易误解为过时的「3月改定」主文案

**技术**：`site-chrome.js?v=chrome-v21`

**详情**：[notes/2026-06-26-seo-2026-latest.md](notes/2026-06-26-seo-2026-latest.md)

---

## V1.4.0（2026-06-25）— GA4 全站自定义事件

**加了**
- `analytics-events.js`：票价、时刻表、导航、语言、PDF、地图 POI 等 **26 项**事件
- 全页 `<head>` 引用

**改了**
- （无）

**减去了 / 下线**
- （无）

**技术**：`analytics-events.js?v=analytics-v1`（后续升至 v4）

**详情**：[notes/2026-06-25-analytics.md](notes/2026-06-25-analytics.md)

---

## V1.3.0（2026-06-25）— URL 重命名 fare / ferry

**加了**
- `/fare/` 票价页、`/ferry/` 船运页

**改了**
- 原 `/map/`（票价语义）→ **`/fare/`**
- 原 `/access/`（船运语义）→ **`/ferry/`**
- `/guide/` 仍为便利设施地图
- 旧路径 **301** 跳转（保留 query / hash）
- `sitemap.xml` 仅 canonical 新 URL

**减去了 / 下线**
- `/map/`、`/access/` 作为 canonical 着陆页（保留 301）

**技术**：`fare/index.html`、`ferry/index.html`、`sitemap.xml`

**详情**：[notes/2026-06-25-url-fare-ferry.md](notes/2026-06-25-url-fare-ferry.md)

---

## V1.0.0（2026-05-25）— ⭐ GSC 索引与 SEO 基线

**加了**
- GitHub Pages 改 Public 并重新启用
- 四页 footer 内链互通
- 首页 meta / page-lead「荒川登山口」
- WebSite JSON-LD `hasPart`
- GSC sitemap 提交

**改了**
- `sitemap.xml` lastmod → 2026-05-25
- 站点从 Private 404 → 可公开访问

**减去了 / 下线**
- Private Pages 导致的全站 404 状态

**技术**：`sitemap.xml`、各页 footer / JSON-LD

**详情**：[seo/SEO-JOURNAL.md](seo/SEO-JOURNAL.md)

---

## 读法提示（时刻表）

| 现象 | 原因 |
|---|---|
| 选「周六」只有 2–3 班 | PDF 土曜列就 2 列 + 松叶早班；不是把平日 11 班都算进周六 |
| PDF 一行很多时刻 | 同一行画了平日+土曜+日祝各列；本站按所选日种过滤 |
| 港 vs 港入口 班次不同 | 不同停留所；提示条会对比工作日班次数 |

审计：`python3 scripts/audit_pdf_trips.py --rebuild`
