# 徒步页联盟区块移动端折叠

**日期**: 2026-05-20

## 做了什么

- `affiliate-ui.js` `trekkingSectionHtml()`：Klook/Viator 区块改为 `<details class="trek-affiliate-details aux-block">`，移动端默认折叠，点击 summary 展开。
- `styles.css`：折叠标题、内边距；`@media (min-width: 768px)` 隐藏 summary、始终展示卡片。
- `trekking/index.html`：`styles.css?v=layout-v115`，`affiliate-ui.js?v=aff-v11`。

## 行为

- **移动端**：只显示「屋久岛当地体验 · 一日游」标题 + 箭头，点击展开说明与三张联盟卡。
- **桌面**：与改前一致，直接展示完整区块。
