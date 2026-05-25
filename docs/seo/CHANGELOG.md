# SEO 优化日志

## 日报剔除 bot 流量 — 2026-05-20

- `seo_ga4_analysis.py`：国家行 **互动 0% + 均时 0s** 不纳入 geo/欧盟/质量判定
- `seo-daily.yml`：commit 不再强制 `git add feishu-links.json`（未配飞书时导致 Actions 红 X）
- **`seo_daily_report.py` v2**：完整数据表 + §2.0 指标释义 + §三 为什么 + §四 优化方向 + 待办/学一点
- ntfy 推送：结论 + 一条原因 + P0 优化 + 待办

## 日报 GA4 深度分析 — 2026-05-22

- `seo_fetch_daily.py`：新增来源/媒介、国家、国家×渠道、PV
- `seo_ga4_analysis.py`：自动解读 Direct/Organic、欧盟访客真实性、流量质量
- `seo_report_daily.sh`：§2.1–2.7 表格 + §2.5 自动分析
- `seo_fetch_metrics.py`：biweekly 同步拉 28 日渠道/国家/来源
- `analytics.js`：localhost 不上报；`?ga_internal=1` 内部流量标记

## 自动化流水线 — 2026-05-21

- **目标**：定期自动读 GSC/GA4 → 报告存档 → Issue/邮件通知 → Cursor「跑一轮 SEO 优化」
- **主文档**：`docs/seo/RUNBOOK.md`（实际操作、踩坑、已废弃的错误指引）
- **GA4**：`seo_grant_ga4_access.py` 改为 REST（解决国内 gRPC 503）
- **待办**：GSC Associations 关联 Cloud 项目；push 本地 commit；workflow 验证 GA4 拉数

## Round 1 — 2026-05-21

**背景**：上线约 1 天，自然流量为 0；GSC 用户尚未自行查看数据。

### 做了什么

| 类别 | 变更 |
|------|------|
| 可抓取正文 | 首页、地图页增加静态 `page-lead`（日/中/英关键词句，不依赖 JS） |
| 上岛页 | `#introText` 增加 HTML 默认日文，爬虫无 JS 也能读到简介 |
| 结构化数据 | 首页 `@graph`：`WebSite` + `SearchAction`（`?from=&to=`）+ `WebApplication` |
| 结构化数据 | `/map/`、`/access/`、`/about/` 增加 `BreadcrumbList` |
| Meta | 强化 title/description 中的目标词（时刻表、运价、高速船等） |
| Meta | 子页补全 `twitter:title` / `twitter:description` |
| Sitemap | 各 URL 增加 `<lastmod>2026-05-21</lastmod>` |
| Head | 四页增加 `<link rel="sitemap">` |
| 文档 | 本目录 `TRACKING.md` 指标表 + GSC/GA4 操作清单 |

### 未做（刻意保持工具定位）

- 不加旅游攻略/黄页合集
- 不加 `/tips/` 子站（可 Round 2 按需 1–2 篇乘车指南）

### 下轮建议（Round 2，约 2–4 周后）

1. 回填 `TRACKING.md` 指标表，看 GSC 实际查询词
2. 若 `/access/` 有展示 → 优化 ferry/jetfoil 长尾 title
3. 若首页 CTR 低 → 只改 description，不动 title 品牌段
4. 可选：1 篇 `/tips/yakushima-bus-basics/` 链回首页（仍不弱化工具感）

### 如何验证

- [Rich Results Test](https://search.google.com/test/rich-results) 测首页 JSON-LD
- GSC URL 检查 → 查看「Google 选择的 canonical」
- 查看网页源代码确认 `page-lead` 在 HTML 中可见
