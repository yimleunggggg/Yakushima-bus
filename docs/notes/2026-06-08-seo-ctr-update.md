# SEO 优化落地（2026-06-08）

## 做了什么

- **首页 (P0-3)**：title/description/og 日文优先，突出「屋久島バス時刻表 · 2026年3月改定」；弱化 PDF 表述
- **P1-4 `/map/`**：meta/title/pageLead 强化 路線図・運賃・料金；静态 seo-lead + FAQ
- **P1-5 首页**：静态 `seo-lead` 日文一句 + FAQ 三节
- **P1-6 内链**：map/access 链回首页「バス時刻表」
- **P1-7 `/intro/`**：`noindex, follow`；从 sitemap 移除
- **P2**：首页/map FAQ；空港线已在常用区间预设
- **sitemap**：4 URL，`lastmod` → 2026-06-08
- **seo_check.sh**：验证 4 条 sitemap 路径

## 用户侧待办

1. GSC → Sitemap 重新提交（可选）
2. GSC → 首页、`/map/` → **请求编入索引**
3. 更新 GitHub Secret `GOOGLE_OAUTH_REFRESH_TOKEN`（日报 GSC 段）

## 观察

2–4 周后看 GSC：`屋久島 バス 時刻表` 展示 vs 点击、首页 CTR
