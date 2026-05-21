# SEO 优化日志

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
