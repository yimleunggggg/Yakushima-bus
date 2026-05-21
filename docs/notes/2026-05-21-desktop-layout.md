# PC 布局（2026-05-21，已回滚双栏）

## 决策
- **PC 与移动端同列排版**，不再使用 ≥768px 双栏 grid
- 出发/到达仍保持左右并排（`route-row` / `fare-form` 不变）
- 地图页：查询工具在上、PDF 在下（`flex` + `order`，全端一致）

## 实现
- 删除 `@media (min-width:768px)` 内 `.panel:has(.panel-grid)` 双栏与 `.map-layout` 左右分栏
- 新增 `.panel-grid { flex-direction: column }` 兜底
- PC 仅加宽至 **1040px**（`@media min-width:768px`），全站一致；**不再**对 `app-page-narrow` 单独 720px
- 移动端（<768px）仍为 `--app-width: 560px`，字号/间距规则未改

## 缓存
全站 `styles.css?v=layout-v10`
