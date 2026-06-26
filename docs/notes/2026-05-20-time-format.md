# 全站时刻格式统一（2026-05-20）

## 规范
- 展示：**24 小时制 `HH:mm`**（`04:00`、`16:08`），与 ja/zh/en 无关
- 实现：`AppCore.formatTime()` / `AppCore.formatJapanClock()`
- 数据层可保留 `4:00` 等 PDF 原文，**禁止**在 UI 直接输出未格式化字段

## 已改
- `app-core.js`：`formatTime`、`formatJapanClock`；`getStopDepartures` 返回已格式化时刻
- `index.html`：班次卡、下一班条、时间筛选、展开时刻轴
- `timetable-modal.js`、`fare` 发车弹窗、`ferry` 船运表、`guide.js` 顶栏时钟

## 缓存
- `core-v8`、`layout-v119`（时刻表）、`tt-modal-v3`、`guide-v33`
- 环线拆分后：`data.js?v=data-loop-split-v1`（安房港→宫之浦港工作日仅 1 班 05:43→06:31）
