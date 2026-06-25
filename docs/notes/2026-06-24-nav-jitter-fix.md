# 主导航切换抖动修复（2026-06-24）

## 现象
切换页面时顶栏导航文字闪一下、轻微抖动。

## 原因
1. HTML 静态日文 → `site-chrome.js`（defer）再替换为当前语言
2. 激活项 `font-weight` 400→600 导致宽度微变

## 修复
- 新增 `site-chrome-nav-boot.js`，在 `</nav>` 后同步渲染
- `site-chrome.js` 若已渲染则跳过重复 innerHTML
- `.nav-main a` 统一 `font-weight: 600`

缓存：`chrome-v7`, `layout-v79`
