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
| 各页 `<head>` | description, canonical, Open Graph, Twitter, geo, JSON-LD, favicon |

## Google Search Console

- ✅ 2026-05-20 域名验证（HTML 文件）+ sitemap 已提交
- 待办：favicon 等资源 push 后，搜索小图标需数天～数周更新

1. 根目录验证文件 `googlef464172b97bd6d41.html`
2. Sitemaps 已提交 `sitemap.xml`
3. 可选：**URL 检查** → `https://yakushimabus.com/` → 请求编入索引（加速首页收录）

## 推送后建议

## 后续可选

- Google Analytics / Plausible（隐私友好）
- 各页 `?lang=` 与 hreflang 一致化（map/access 加语言参数）
