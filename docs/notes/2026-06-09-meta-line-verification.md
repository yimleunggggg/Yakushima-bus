# 页头 meta 单行验证（2026-06-09）

## 背景
用户截图 `/map/`（ZH）出现两行：pageLead + 旧静态日文 meta。预期 c665d5f 后仅一行 `app-meta`（`initMeta()` 动态填充）。

## 验证结果

| 页面 | 本地 | 线上 (curl) | 说明 |
|------|------|-------------|------|
| `/map/` | ✅ 单行 `#metaBar` | ✅ 已部署 c665d5f | 双行多为浏览器缓存旧 HTML |
| `/` | ✅ | — | 同 pattern |
| `/access/` | ✅ 已修 | ❌ 仍有 `header-sub` | 本次移除 subtitle，修正 meta 链接 |
| `/about/` | ✅ 单行 updated | — | 仅 bump CSS cache |

## 硬刷新后用户应看到

- **map（ZH）**：`有效 2026-03-01–2026-11-30 · 时刻表 · 上岛`（一行，无 pageLead）
- **index（ZH）**：`有效 … · 路线·运价 · 上岛`
- **access（ZH）**：`更新 2026-05-20 · 时刻表 · 路线·运价`

## 本次改动

- 移除 `access/index.html` 的 `header-sub` / `pageLead`
- 修正 access `metaBar` 误链到自身（改回 时刻表 · 路线）
- 清理 index/map/access 未引用的 `pageLead` i18n 键
- `styles.css?v=layout-v53` 全站 bump（促缓存刷新）

## 待办

- 部署后用户若仍见双行：Cmd+Shift+R 硬刷新，或清站点数据
