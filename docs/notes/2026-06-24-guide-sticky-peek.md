# 地图页吸顶列表滚动（2026-06-24）

## 需求
手机端地图+筛选固定，仅 POI 列表区域滚动（非整页滚动）。

## 实现（v2 layout-v82）
- 移动端 `body` 锁 `100dvh`，`.guide-list-block` `overflow-y: auto`
- 筛选+地图在 `.guide-peek` 固定高度，不参与列表滚动
- 页脚 `#guidePageFoot` 由 `guide.js` 在窄屏移入列表底部
- 桌面端仍为左列表+右地图双栏

缓存：`layout-v82`, `guide-v22`
