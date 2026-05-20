# SEO / GEO 配置

站点：https://yakushimabus.com

## 已部署文件

| 文件 | 作用 |
|------|------|
| `robots.txt` | 爬虫规则 + sitemap 链接；允许主流 AI bot |
| `sitemap.xml` | 4 页 URL + hreflang |
| `llms.txt` | GEO：供 LLM/AI 搜索引用的站点摘要 |
| 各页 `<head>` | description, canonical, Open Graph, Twitter, geo, JSON-LD |

## 推送后建议

1. [Google Search Console](https://search.google.com/search-console) 添加属性 → 验证 → 提交 sitemap  
2. [Bing Webmaster](https://www.bing.com/webmasters) 同上（可选）  
3. 检查：`https://yakushimabus.com/robots.txt`、`/sitemap.xml`、`/llms.txt`

## 后续可选

- OG 分享图 `og-image.png`（1200×630）
- Google Analytics / Plausible（隐私友好）
- 各页 `?lang=` 与 hreflang 一致化（map/access 加语言参数）
