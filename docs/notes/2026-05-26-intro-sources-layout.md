# Intro 页 #sources 区块布局修复（2026-05-26）

## 问题
- 功能卡片（上岛交通 / 数据来源）标题字重不一致、行高不齐
- 来源列表行：有 `note` 的项右列显示日期，无 `note` 的项整行占满，视觉不统一
- 分类标题过小、偏灰、与列表贴太紧
- 分隔线过淡、面板内间距偏挤

## 改动
- **功能卡片**：`flex` 等高列、`title` 改为 `font-weight: 600`
- **来源行**：统一 `grid`（label + note）；`renderSources` 始终输出 `.about-source-note`（空则 `:empty` 隐藏，右列不占位）
- **分类**：标题对齐 `intro-section-title` 层级（0.8125rem / 600 / primary-dark），组间 `border-top` + 16px 间距
- **列表**：行分隔改用实色 `var(--border)`，行内 padding 11px
- `intro/index.html` CSS cache → `layout-v54`

## 文件
- `intro/index.html`（`renderSources` + cache）
- `styles.css`（`.about-sources-*`、`.intro-feature*`、`.intro-sources`）

## 刷新后应见
- 四张功能卡片等高、标题字重一致
- 来源面板分类标题更清晰，组与组之间有浅分隔
- 每行链接左标签、右元数据（无日期时标签自然占满一行，不再留空右列）
