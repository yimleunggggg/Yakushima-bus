# intro 支持区块样式修复

- **问题**：Ko-fi 按钮贴卡片底边，`.intro-support.panel` 无 padding。
- **改动**：横排 flex（文案左 / 按钮右）、统一 `14–16px` 内边距、淡绿底区分；功能卡 ≥900px 三列；来源区间距对齐。
- **版本**：`styles.css?v=layout-v67`（仅 intro 页引用）。
