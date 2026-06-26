# 船运页斜线 bug（2026-05-20）

## 现象
渡轮时刻/运价表上出现一条从底部「优惠购票」区向左上延伸的灰色斜线，穿过表格数字。

## 原因
`#affiliateFerryBottom { display: contents }` 使内部 `details.aux-block` 参与父级 flex 布局时，部分浏览器会把子元素边框/装饰错误绘制到整页（绘制层脱离原容器）。

## 修复
- 去掉 `display: contents`；`#affiliateFerryBottom` 包裹层已移除，优惠购票 `details` 直接插入 `aux-sections`。
- **斜线复发**：`aux-summary` 内标题未包 `<span>`，chevron 在 flex 中被拉高，边框绘制成斜线；已统一 `<span>标题</span><span class="aux-chevron">` 并限制 chevron 尺寸。
- `styles.css?v=layout-v91`
