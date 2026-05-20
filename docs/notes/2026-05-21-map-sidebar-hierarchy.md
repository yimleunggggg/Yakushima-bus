# 路线图页 PC 右栏信息层级（2026-05-21）

## 做了什么
- 仅 `@media (min-width: 768px)`：右栏上半（停留所/运价查询）保持独立工具卡片；下半参考信息合并。
- `map-sidebar-ref` 包裹乘车券 + 发售窓口，单卡片内分隔，标题弱化（label 字号 + muted）。
- `#farePanel` 内运价说明加 `sec-map-ref`，与查询区虚线分隔、紧凑列表。
- 移动端 DOM 仅多一层无样式 wrapper，视觉与改前一致。

## 文件
- `map/index.html` — 结构 + `styles.css?v=desktop-v4`
- `styles.css` — 桌面断点内样式
