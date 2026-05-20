# SEO / GEO 配置

站点：https://yakushimabus.com

## 已部署文件

| 文件 | 作用 |
|------|------|
| `robots.txt` | 爬虫规则 + sitemap 链接；允许主流 AI bot |
| `sitemap.xml` | 4 页 URL + hreflang |
| `llms.txt` | GEO：供 LLM/AI 搜索引用的站点摘要 |
| `favicon.ico` / `favicon.svg` / `favicon-48x48.png` | 浏览器标签 + **Google 搜索结果小图标**（需 ≥48px） |
| `apple-touch-icon.png` | iOS 主屏幕 180×180 |
| `og-image.svg` → `og-image.png` | OG/Twitter 分享图 1200×630（山林主题） |
| `site.webmanifest` | PWA 图标声明 |
| `analytics.js` | GA4（填衡量 ID 后生效） |

## Google Search Console

- ✅ 2026-05-20 域名验证（HTML 文件）+ sitemap 已提交
- 待办：favicon 等资源 push 后，搜索小图标需数天～数周更新

1. 根目录验证文件 `googlef464172b97bd6d41.html`
2. Sitemaps 已提交 `sitemap.xml`
3. 可选：**URL 检查** → `https://yakushimabus.com/` → 请求编入索引（加速首页收录）

## Google Analytics 4

1. [analytics.google.com](https://analytics.google.com) → **管理** → **创建媒体资源** → 名称 `Yakushima Bus`
2. **数据流** → **网站** → URL `https://yakushimabus.com` → 复制 **衡量 ID**（`G-XXXXXXXXXX`）
3. ~~编辑 `analytics.js`~~ → 已配置 `G-BX2P31GEHW` → `git push`
4. GA4 **报告 → 实时** 打开网站，应看到 1 个活跃用户

代码：`analytics.js`（四页 `<head>` 已引用；ID 未填时不加载，不影响站点）

## 后续可选

- Google Analytics / Plausible（隐私友好）→ GA4 已接入口，见上
- 各页 `?lang=` 与 hreflang 一致化（map/access 加语言参数）
