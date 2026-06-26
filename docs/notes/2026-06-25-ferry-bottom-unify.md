# 船运页底部面板统一（2026-06-25）

## 做了什么
- `ferryBottomHtml()` 改为单个 `aux-block` + `aux-summary` + `.links` 行链，与「官方链接」同视觉语言。
- `#affiliateFerryBottom` 移入 `panel-aux` 内，与官方链接并列于同一 `aux-sections`（曾用 `display: contents` 保持手风琴分隔线；后因斜线渲染 bug 已移除，见 `2026-05-20-ferry-diagonal-line.md`）。
- 移除 `affiliate-foot` / `affiliate-link-list` 等冗余样式。
- Viator 体验卡：`affiliate-data.js` 中 `viator_jetfoil_day` 的 `pages` 已不含 `ferry`（仅 trekking / without-car / map）。
- 运价表首列：`fareRowLabel()` 兜底 `type`/`route` 等键，修复 `fareKey: "type"` 时首行标签偶发空白。

## 缓存
- `styles.css?v=layout-v88`，`affiliate-*.js?v=aff-v6`（ferry 页）

## 预览
- http://127.0.0.1:8765/ferry/?lang=zh
