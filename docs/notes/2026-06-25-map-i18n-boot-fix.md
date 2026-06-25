# 运价页多语言标题与站点选择器修复（2026-06-25）

## 现象
`/map/?lang=zh` 时页眉仍显示日文「運賃計算」；站点区只显示「站点」标签，输入框与按钮空白。

## 根因
1. `applyPageHead` 未传 `lang`，defer 的 `site-chrome.js` 加载前 fallback 也用错语言。
2. `initPdf()` 抛错会阻断后续 `initPickers()`。
3. `boot()` 未用 `AppCore.runPageBoot`，语言解析与 access/trekking 不一致。
4. `site-chrome-nav-boot.js` 只同步导航，未提前更新 `#appTitle`。

## 修复
- `map/index.html`：传 `lang`、fallback 标题、`initPdf` try/catch、`runPageBoot`；缓存 `chrome-v10` / `layout-v80`。
- `site-chrome-nav-boot.js`：`/map/` 下同步 `navMapTitle` 到 `#appTitle`。
