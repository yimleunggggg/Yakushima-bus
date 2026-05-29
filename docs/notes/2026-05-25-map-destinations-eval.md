# `/map/` 主景区轻量内容 — 评估结论

**日期**：2026-05-25 · **状态**：UI 已按反馈收紧（2026-05-25）

## 结论（一句话）

景点数据（`sources/destinations.json`）保留备后用；**页面不再放折叠「主景区与公交」块**——用户认为折叠与说明句无意义。SEO 导语并入标题下 `header-sub`；运休链并入首页 `metaBar`。

## 本次 UI 调整（相对初版实现）

| 用户反馈 | 处理 |
|----------|------|
| 折叠块 + 内文无意义 | 删除 `#mapDestinations` 与 `map-destinations*.js` 引用 |
| 导语单独占一行 | 改为 `header-sub`（标题下灰色一行） |
| 选站区重复站名/对齐乱 | 标题「站点 — 时刻·运价」；仅 picker + No. 标签 + 三按钮（主按钮整行） |
| 站名「中·英·日」堆叠 | `altLine`：输入框上小字（中界面=日·英；日=英；英=日），无「站牌」前缀；下拉同规则 |
| 交换箭头错位 | `route-swap` 与输入框底对齐（`align-self:end` + `--tap-min`），去掉 `:has(.stop-sub)` 整行 padding |
| 运价结果居中与免责不对齐 | `.fare-result` 左对齐 |
| 运价说明灰条太多显乱 | `info-list-plain`：无底色、小字 `·` 列表；无价格时运价区也去灰底 |
| 班次点击回缩 / 下拉重复站名 | `openTripKey` + 触摸防抖；`listHint`＝`altLine` |
| 展开时间线仅一行站名 | `renderTimeline` 恢复 `tl-sub` + `tl-primary`，规则同 `altLine` |
| 区块间隔插画 | `section-divider.js`（map 运价↔乘车券、access 高速船↔渡轮） |

## 文件

| 项 | 文件 |
|----|------|
| 数据源（未挂页） | `sources/destinations.json` → `map-destinations-data.js` |
| 页面 | `map/index.html`、`index.html` |
| 样式 | `styles.css`（`layout-v27`：`header-sub`、选站 actions 网格、运价区对齐） |

## 参考信息优先级

| 层级 | 来源 | 用途 |
|------|------|------|
| A | 本站 `special.json`、时刻表 | 班次、换乘、季节 |
| B | yakukan、tozan、松ばんだ运休 | 官方链 |
| C | `assets/pdf/yakuzarugo.pdf` | 可选，未嵌入 |
| D | Yamap / AllTrails | 仅外链参考，不写攻略 |

## 后续可选

- 景点块改为极简：链到 `/?from=&to=` preset，不展开长文。
- 重建数据：改 `sources/destinations.json` 后生成 `map-destinations-data.js`。

## 关键词簇 → 页面

| 优先级 | 意图 | 承接 |
|--------|------|------|
| P0 | 屋久島 バス 時刻表 / 2026年3月 | 首页 `header-sub` + meta |
| P0 | 運賃 / 路線図 / 白谷 荒川 縄文杉 | `/map/` `header-sub` + meta |
| P2 | 運休 | 首页 `metaLinks`；map 官方链接区 |
