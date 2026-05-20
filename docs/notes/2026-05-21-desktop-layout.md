# PC 双栏布局（2026-05-21）

## 决策
- 移动端（<768px）样式与 DOM 顺序不变
- PC（≥768px）通过 `@media (min-width: 768px)` 启用双栏

## 实现
- **时刻表**：左栏 sticky 控件；右栏班次列表；**aux 全宽在双栏下方**（非左栏内嵌）
- **路线图**：`map-layout-primary`（PDF）+ `map-layout-secondary`（站点/运价/乘车券）
- **上岛/关于**：仅容器加宽至 720px（`app-page-narrow`）

## 缓存
`styles.css?v=desktop-v4`
