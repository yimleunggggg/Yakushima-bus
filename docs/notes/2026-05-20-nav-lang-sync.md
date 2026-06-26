# 切换语言后导航不更新（2026-05-20）

## 现象
选 EN 后正文变英文，顶栏导航仍显示中文。

## 根因
1. `site-chrome.js` 曾缺 `zh:` / `en:` 键导致脚本解析失败，语言事件监听未注册。
2. 部分页面未在切换时调用 `__renderSiteChromeNav`；`app-core` 无缓存版本，浏览器可能用旧 bundle。

## 修复
- 修好 `site-chrome.js` UI 对象；`renderMainNav(forcedLang)` 委托 nav-boot。
- `AppCore.setLang` 内调用 `__renderSiteChromeNav`。
- 各页 `app-core.js?v=core-v2`、`site-chrome*.js?v=chrome-v17`。
- 地图页接入 `app-core`，`guide.js` 切换走 `AppCore.setLang`。

## 验证
`/trekking/?lang=zh` 切 EN → 导航应显示 Map / Times / Fares / Ferry / Trails / Intro。
