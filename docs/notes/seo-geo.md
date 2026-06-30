# SEO / GEO 配置

站点：https://yakushimabus.com

## 追踪与定期优化

| 文件 | 作用 |
|------|------|
| [`docs/OPS-JOURNAL.md`](../OPS-JOURNAL.md) | **运维主文件**（版本块 + 归因 ID + 平台对照 + 待办） |
| [`~/.cursor/rules/change-journal.mdc`](../../../.cursor/rules/change-journal.mdc) | 版本块格式与 Agent 义务（全项目） |
| [`docs/seo/TRACKING.md`](../seo/TRACKING.md) | GSC/GA4 操作清单、指标表、目标查询词 |
| [`docs/seo/CHANGELOG.md`](../seo/CHANGELOG.md) | 每轮 SEO 改了什么 |

在 Cursor 说 **「跑一轮 SEO 优化」** 即可按上述文档迭代。

## 已部署文件

| 文件 | 作用 |
|------|------|
| `robots.txt` | 爬虫规则 + sitemap 链接；允许主流 AI bot |
| `sitemap.xml` | 4 页 URL + hreflang + lastmod |
| `llms.txt` | GEO：供 LLM/AI 搜索引用的站点摘要 |
| `favicon.ico` / `favicon.svg` / `favicon-48x48.png` | 浏览器标签 + **Google 搜索结果小图标**（需 ≥48px） |
| `apple-touch-icon.png` | iOS 主屏幕 180×180 |
| `og-image.svg` → `og-image.png` | OG/Twitter 分享图 1200×630（山林主题） |
| `site.webmanifest` | PWA 图标声明 |
| `analytics.js` | GA4 `G-BX2P31GEHW` |

## Google Search Console

- 验证文件：`googlef464172b97bd6d41.html`（仓库根目录）
- **你需要**：登录 GSC → 确认属性已验证 → Sitemap 提交 `sitemap.xml` → URL 检查请求编入索引 4 页
- 详见 `docs/seo/TRACKING.md`

## Bing Webmaster Tools

- 2026-06-28：从 GSC 导入完成，Sitemap Success（7 URL）
- 完整步骤与踩坑：[`docs/notes/2026-06-28-bing-webmaster-setup.md`](2026-06-28-bing-webmaster-setup.md)

## 中文搜索引擎（百度等）

- 中文 Sitemap：`sitemap-zh.xml`（7 条 `?lang=zh`）
- 语言优先：`lang-boot.js` v4 + `seo-head-zh.js`
- 后台登记：[`docs/notes/2026-06-28-baidu-search-setup.md`](2026-06-28-baidu-search-setup.md)

## Google Analytics 4

- 衡量 ID：`G-BX2P31GEHW`（四页 `<head>` 已引用 `analytics.js`）
- GA4 **报告 → 实时** 打开网站应看到活跃用户

## 后续可选

- map/access 加 `?lang=` hreflang 与首页一致
- 1–2 篇 `/tips/` 乘车指南（链回工具，不扩成攻略站）
