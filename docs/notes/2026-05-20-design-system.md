# 全站 UI 层级与徒步页对齐（2026-05-20）

## 层级约定
- **H1**：页名（`header-compact`）
- **H2 区块**：`.page-section-title`（面板内，与 intro 一致 0.8125rem / 600）
- **折叠次要区**：`.aux-sections` + `.aux-block`（同时刻表/船运）
- **卡片标题**：`.trek-card-title` 等，不抢区块标题

## 徒步页改动
- 季节/路线/资源区统一 `page-section-title`；路线区收入 `panel`
- Klook/Viator 改用标准 `aux-block`（`aux-block--desktop-open`），删除 `trek-affiliate-*` 特例
- Agent 规则：`.cursor/rules/design-system.mdc` + 全局 `multi-page-ui-consistency.mdc`
