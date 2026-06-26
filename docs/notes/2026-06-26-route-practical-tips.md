# 时刻表「这样搜」实用提示

## 场景
安房港→宫之浦港等：周末无直达码头班次，但到镇上「宫之浦」有车——用户往往不会改搜。

## 实现
- `index.html`：`getPracticalRouteTips()` 对比港/镇/入口等邻近站班次差
- 起终点下方 `#routeTips` + 空状态内嵌同款提示，一键改搜
- 文案三语：`routeTipsTitle`、`tipMoreToAlt`、`tipAnboPortWeekend` 等

## 缓存
- `styles.css` → `layout-v124`（index）
