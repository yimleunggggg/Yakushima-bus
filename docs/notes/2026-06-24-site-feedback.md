# 全站反馈与精简页脚

- **`site-chrome.js`**：页脚合并为一行（时刻表·路线·上岛·关于·支持）；页脚上方星级反馈（1–5）。
- **低分（1–2）**：展开填写框 + 链到关于本站；有文字时 `mailto` 提交。
- **3–5 星**：记入 `localStorage` 后整块隐藏，不再显示感谢语。
- **跳过**：`/intro/`、`/about/` 不显示反馈。
- **GA4**：`site_feedback`、`site_feedback_comment`。
- **版本**：`layout-v74` / `chrome-v2`
- **样式**：反馈区移入 `.app-footer`，无白底卡片，与底部链接同层级
