# 地图弹窗时刻表 & 登山公交接驳（2026-06-26）

## 背景

- 地图公交站弹窗「查时刻表」原先跳转首页 `/?from=…`，体验割裂。
- POI 弹窗用「谷歌地图」链接，与公交站「导航」不一致；两按钮宽度不统一。
- 登山页路线缺 `stopId` / 预设区间，无法一键查接驳。

## 决策

### P0：地图弹窗

1. **抽取 `timetable-modal.js`**  
   - 与 `fare/index.html` 共用 `getStopDepartures` 逻辑（读 `BUS_DATA.routes`）。  
   - 仅接受 `data.js` 内 52 个官方 `stopId`（`TimetableModal.isOfficialStop`）。  
   - `map/index.html` 注入 `#timeModal` HTML，加载 `data.js`、`operator-ui.js`、`timetable-modal.js`。

2. **公交站弹窗**  
   - 「查时刻表」改为 `<button data-guide-tt="stopId">`，点击 `TimetableModal.open(stopId)`。  
   - 非官方站不渲染时刻表按钮。

3. **POI 弹窗**  
   - 操作区：**导航**（`navUrl` 坐标导航）+ **复制地址**；移除独立「谷歌地图」标签。  
   - 来源链 `yakukan.jp` 移到操作区下方 `.guide-popup-source`。  
   - `.guide-popup-actions--pair` 两列等宽网格，按钮 `width: 100%`。

### P1：登山 ↔ 公交

1. **`trekking-data.js`**  
   - 每条路线增加 `accessStops: [{ stopId, note }]`、`presetRoute: { from, to }`（可选）。  
   - 数据对齐 `map-destinations-data.js` / `sources/destinations.json` 的进山模式（荒川、白谷、纪元杉等）。  
   - 页脚 disclaimer 补充「以官方时刻表为准」。

2. **`trekking/index.html`**  
   - 卡片内展示接驳站与季节说明；页脚链「查接驳」→ `/?from=…&to=…&lang=…`。  
   - 加载 `data.js` + `map-data.js` 解析站名。

## 未做 / 后续

- `fare/index.html` 仍内联 modal 逻辑，可后续改为引用 `timetable-modal.js` 去重。  
- 登山页未内嵌 modal；如需地图页同款弹窗可再挂 `timetable-modal.js`。

## 涉及文件

- 新增：`timetable-modal.js`  
- 修改：`map/index.html`、`guide.js`、`styles.css`（v104）、`trekking-data.js`（trek-v7）、`trekking/index.html`
