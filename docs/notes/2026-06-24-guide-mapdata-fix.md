# 地图页空白修复（2026-06-24）

## 现象
筛选栏、POI 列表、地图标记全部空白；标题/简介正常。

## 根因
`busStopsMeta()` 在 `catalogStops` 为真时访问 `window.MAP_DATA.stops`，但 `map-data.js` 使用 `const MAP_DATA`（非 `window`），导致 `TypeError`，`renderFilters` 中断。

## 修复
- `guide.js`：新增 `mapStops()`，统一读取全局 `MAP_DATA`；`busStopsMeta()` 用 `??` 替代错误的三元优先级
- 缓存版本：`guide-v21`

## 预览
http://127.0.0.1:8765/guide/?lang=zh
