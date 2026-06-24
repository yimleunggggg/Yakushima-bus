# 私人配置清单（勿提交真实密钥）

> 在本地填写；可复制为 `PRIVATE_SETUP.local.md`（已在 `.gitignore`）。  
> 公开步骤见 [vibe-coding-static-site-guide/seo/tutorial](https://github.com/yimleunggggg/vibe-coding-static-site-guide/tree/main/seo/tutorial/README.md)。

## 我的站点

| 项 | 我的值 |
|----|--------|
| 域名 | `https://_______________/` |
| GSC 资源 URL | 与上相同 |
| GA4 衡量 ID（埋点） | `G-________` |
| GA4 属性 ID（API） | `________` |
| Cloud 项目 ID | `_______________` |
| 服务账号邮箱 | `____________@____________.iam.gserviceaccount.com` |

## Google 本地文件（仅本机 `secrets/`）

- [ ] `secrets/google-sa.json` — 服务账号密钥
- [ ] `secrets/oauth-client.json` — OAuth Desktop client
- [ ] `secrets/oauth-refresh.txt` — refresh token（一行）

## GitHub Secrets 勾选表

- [ ] `GOOGLE_SERVICE_ACCOUNT_JSON`
- [ ] `GOOGLE_OAUTH_CLIENT_JSON`
- [ ] `GOOGLE_OAUTH_REFRESH_TOKEN`
- [ ] `GA4_PROPERTY_ID`
- [ ] `GSC_SITE_URL`
- [ ] `SEO_NOTIFY_EMAIL` = `[你的邮箱]`
- [ ] `RESEND_API_KEY` = `re_...`
- [ ] `RESEND_FROM` = `[显示名] <[发件地址]>`
- [ ] `NTFY_TOPIC` = `[ntfy 主题名]`
- [ ] `FEISHU_APP_ID` / `FEISHU_APP_SECRET` / `FEISHU_FOLDER_TOKEN`
- [ ] `FEISHU_SHEET_TOKEN`（周报表，固定一张）
- [ ] （可选）`FEISHU_JOURNAL_DOC_ID`

## 验证记录

| 日期 | 操作 | 结果 |
|------|------|------|
| | `seo_fetch_daily.py` 本地 | |
| | Actions SEO daily 绿 | |
| | ntfy 收到日报 | |
| | 邮件收到日报 | |
| | 周报 Issue `approve` 测试 | |

## 待办（对照 ROADMAP）

- [ ] GSC OAuth Secrets 全绿
- [ ] `approve` → PR workflow
- [ ] access booking 块部署上线
- [ ] 飞书 Secrets + 周报表 `init`（见 FEISHU_SETUP.md §4）
- [ ] Actions SEO weekly 绿 + 表格有数据
