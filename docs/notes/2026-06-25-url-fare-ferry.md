# URL 重命名：fare / ferry（2026-06-25）

## 变更

- `/map/` → **`/fare/`**（路线图 + 票价；中文「票价」）
- `/access/` → **`/ferry/`**（船运上岛）
- **`/guide/`** 为便利设施地图（原语义不变）

旧路径保留 `index.html` 跳转（query/hash 保留），sitemap 仅列 canonical 新 URL。

## 待办（部署后）

- [ ] GSC 提交 sitemap；请求编入 `/fare/`、`/ferry/`、`/guide/`
- [ ] GA4 标关键事件（见 `2026-06-25-analytics.md`）
