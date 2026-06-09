# Map 页 FAQ + 官方链接布局修复（2026-06-09）

## 问题
`/map/` 底部 FAQ（aux-block）下方另套一层 `panel map-official-links` 白卡片，展开 FAQ 时出现「盒中盒」、图标风格不一致。

## 改动
- 官方链接移入 `aux-sections`，与 FAQ 并列两个 `aux-block`（对齐 `index.html`）
- 删除 `panel map-official-links` 及内层 `sec-title`
- 官方链接默认 `open`；FAQ 仍由 `SEO_FAQ` + `renderSeoFaq()` 三语渲染

## 文件
- `map/index.html`（仅 HTML 结构，未改 CSS cache）
