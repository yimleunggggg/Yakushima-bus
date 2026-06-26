# 船运页排版 + Viator 迁至登山页

**日期**：2026-06-25

## 变更

1. **渡轮运价表**：`renderFarePart` 增加 `fareRowLabel` 回退（`type` / `route` / `class` / `days`）；`sources/access/ferry.json` 中文舱位改为「二等（经济舱）」「一等（头等舱）」；运价表首列加 `min-width` 防挤压。
2. **Viator 区块**：从 `/ferry/` 移除「当地体验 · 一日游」；`/trekking/` 在路线卡片之后挂载 `AffiliateUI.trekkingSectionHtml`（Klook 徒步 + Viator 日归）。
3. **联盟数据**：`viator_jetfoil_day.pages` 去掉 `ferry`，保留 `trekking` / `without-car`。
4. **船运页底部**：仅保留 Klook「优惠购票」折叠 +「官方链接」；Viator 不再插入。

## 缓存版本

- `aff-v6`、`layout-v88`、`booking-v4`（ferry 页 access-data）

## 预览

- http://localhost:8765/ferry/?lang=zh
- http://localhost:8765/trekking/?lang=zh
