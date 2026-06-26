# 官方链接样式统一（2026-05-20）

## 规范
- **平铺列表**（时刻表/票价/船运/登山）：`aux-block` → `.aux-body` → `.links.source-links`，由 `SourceLinks.mountFlat()`
- **多分类**（intro）：`SourceLinks.introBodyHtml()` → `.source-group-fold` 分组折叠
- 单行结构：`<a><span class="source-link-label">…</span><span class="source-link-note">…</span></a>`

## 改动
- 新增 `source-links.js`
- 徒步页官方资料改为 `aux-block`（去掉 `trek-resource-links`）
- index / fare / ferry / intro 接入同一渲染器

## 缓存
- `source-links.js?v=src-v1`、`styles.css?v=layout-v122`
