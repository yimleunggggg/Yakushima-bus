# 38 天复盘行动项 — 执行摘要

**日期**：2026-06-28  
**依据**：`docs/notes/2026-06-27-phase1-review.md`

## 已完成（代码）

- **CLS**：footer / next-bar / page-head 预留高度；PDF 移动预览图带尺寸与 aspect-ratio（`pdf-preview-v5`）
- **可及性**：票价页站点/运价 `<label for>`；首页时刻筛选 `queryTime` aria-label
- **性能**：全站 `analytics.js defer`；主站 CSS `preload`
- **Schema**：`areaServed` 从 `WebApplication` 迁至 `Organization`
- **Sitemap**：补 `/intro/`，全 URL `lastmod` 2026-06-28
- **关于页**：从业者书签提示（P2-4）

## 需你手动（约 15 分钟）

1. **GSC** → URL 检查 → 请求编入索引：`/fare/`、`/ferry/`、`/map/`（若显示未收录）
2. **GA4** → 事件 → 标记关键事件：`timetable_search`、`fare_lookup`、`file_download`（见 `docs/seo/TRACKING.md`）
3. **部署** push 后 → [PageSpeed](https://pagespeed.web.dev/) 复测首页 Mobile CLS

## 仍待下阶段

- PDF 预览图 WebP/AVIF（需 `cwebp` 或 CI 转换）
- GitHub Pages 长期缓存（需 CDN 或 Actions 头）
- 中文 SEO 内容（小红书等）
- Leaflet 按需加载（P2-1）
