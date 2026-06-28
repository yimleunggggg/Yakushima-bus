# 浏览器语言自动落地（2026-06-27）

## 优先级

1. URL `?lang=ja|zh|en`（分享链接、hreflang）
2. `localStorage`（用户曾手动切换）
3. `navigator.languages`（设备/浏览器语言）
4. 默认 `ja`

## 行为

- **首访**：无 URL 参数且无 localStorage → 检测浏览器语言 → 写入 localStorage + `?lang=`
- **切语言**：JA/ZH/EN 按钮 → 标记「用户已选」+ 更新 localStorage、URL、全页文案
- **站内跳转**：手动选过语言后，**localStorage 优先于导航链接里旧的 `?lang=`**，并自动改正 URL
- **站内跳转**：主导航 `langQs()` 带当前 `?lang=`

## 映射

| 浏览器 | 站点 |
|---|---|
| `ja*` | ja |
| `zh*` | zh |
| `en*` | en |
| 其他 | ja |

## 文件

- `lang-boot.js` — 最早执行，`SiteLang` API
- `site-chrome-nav-boot.js`、`app-core.js` — 统一读 `SiteLang`

## 说明

不是三个独立域名，而是**同一路径 + `?lang=`**（与现有 `hreflang` 一致）。
