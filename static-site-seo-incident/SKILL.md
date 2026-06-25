---
name: static-site-seo-incident
description: >-
  静态站 SEO 事故排查：全站 404、GSC sitemap 拉取失败、OAuth 超时、
  Pages 未启用、NEUTRAL 未索引。触发：站点打不开、日报 P0 站点不可用、
  GSC 拉数失败。
---

# 静态站 SEO 事故排查

## P0：全站 HTTP 404

1. GitHub 仓是否 **Public**（私有仓免费版无 Pages）。
2. **Settings → Pages**：Source = `main` / root，保存后等 1–3 分钟。
3. 自定义域 DNS（CNAME/A）是否指向 `*.github.io`。
4. GSC URL 检查：Live test 404 = **现在**打不开，与历史「已编入索引」无关。
5. 修复后：重新提交 `sitemap.xml`；对 `/map/`、`/access/` 等手动「请求编入索引」。

## P0：GSC / GA4 拉数失败

| 现象 | 处理 |
|---|---|
| OAuth / Secrets | 对照 `GOOGLE_SETUP.md` 重填 `GSC_*`；刷新 refresh token |
| timed out / 503 | Actions 重跑；检查 Google API 配额与网络 |
| GA4 服务账号 | GA4 管理 → 媒体资源访问权限 → 只读 |

## 索引 NEUTRAL

- 非 bug；GSC → URL 检查 → 请求编入索引。
- sitemap `Couldn't fetch` 常在 404 修复前；修好后重新提交。

## 通知

- ntfy **urgent**：uptime 非 200。
- 邮件 digest 不含空 §2 表；勿把整份 md 当 HTML 发。

详细排错表：[vibe-coding-static-site-guide/seo/tutorial/TROUBLESHOOTING.md](https://github.com/yimleunggggg/vibe-coding-static-site-guide/blob/main/seo/tutorial/TROUBLESHOOTING.md)。
