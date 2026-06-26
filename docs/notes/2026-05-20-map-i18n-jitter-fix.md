# 地图页三语与切换抖动修复（2026-05-20）

## 现象
`/map/?lang=zh` 标题仍为「スポット地図」；切换语言时筛选条换行、地图区域抖动。

## 根因
1. `nav-boot` 在 `#appTitle` 渲染前执行，`syncPageTitle` 无效。
2. `guide.js` 的 `applyPageHead` 未传 `lang`、无 fallback；语言未读 URL `?lang=`。
3. 语言切换触发重复 `boot()`（`yakushima-bus-lang` + 点击各一次），含 `placeGuideFoot` / `invalidateSize`。
4. 筛选 pill `flex-wrap` 导致中英文切换时高度变化。

## 修复
- `site-chrome-nav-boot.js`：`DOMContentLoaded` 再同步标题与语言按钮；导出 `__syncPageTitle`。
- `guide.js`：统一 `resolveLang`、`applyPageHead(lang)`、去掉重复 boot；切换时不重排 foot/地图。
- `styles.css`：筛选条改横向滚动单行。
- 各页 `applyI18n` 调用 `__syncPageTitle`。

## 缓存
`guide-v26`、`chrome-v16`、`layout-v89`

## 2026-05-20 补充
地图页移除 Viator 体验区；`affiliate-data.js` 私人观光/浮潜仅保留 `without-car` 与登山页 trekking 区块。
