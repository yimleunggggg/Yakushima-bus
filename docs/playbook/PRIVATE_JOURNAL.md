# 私人项目日记（勿发社媒）

> 真实时间线、内部链接、花费。公开分享请用 [playbook/README](README.md) 脱敏版。

---

## 时间线

| 日期 | 里程碑 | 详细笔记 |
|------|--------|----------|
| 2026-05-20 | 项目启动；PDF 解析；48 站；三语 MVP | [init](../notes/2026-05-20-init.md) |
| 2026-05-20 | 数据管线 build_all；运价锚点；上岛页 | init + [data-layer](../notes/2026-05-20-data-layer-ux.md) |
| 2026-05-21 | 桌面布局；地图 PDF 移动预览；access booking | [desktop](../notes/2026-05-21-desktop-layout.md) · [map-pdf](../notes/2026-05-21-map-pdf-mobile-preview.md) · [booking](../notes/2026-05-21-access-booking.md) |
| 2026-05-21 | 演示视频脚本 | [product-demo-video](../notes/2026-05-21-product-demo-video.md) |
| 2026-05-21～22 | GSC OAuth 打通；SEO Actions v1 | [GOOGLE_SETUP](../seo/GOOGLE_SETUP.md) · [RUNBOOK §8](../seo/RUNBOOK.md) |
| 2026-05-22 | 日报/周报 workflow；报告格式；教程体系 | [seo-reports-notify](../notes/2026-05-22-seo-reports-notify.md) |
| 2026-05-25 | 日报 v2、自动 P0–P2、失败重跑、SEO-JOURNAL、飞书追踪 | [tutorial/06](../seo/tutorial/06-日报与优化追踪.md) · [CHANGELOG](../seo/CHANGELOG.md) |
| 2026-05-22 | Resend 域名 Verified；ntfy+邮件双通 | [NOTIFICATIONS](../seo/NOTIFICATIONS.md) |
| 待定 | access booking 部署；approve→PR | [ROADMAP](../seo/ROADMAP.md) |

**密集开发窗口**：约 5/20 中午 → 5/21 凌晨（见 [cost-ledger](../notes/cost-ledger.md)）。

---

## 花费（本人）

| 项 | 金额 |
|----|------|
| yakushimabus.com 首年 | ¥83 |
| Cursor | 见 Dashboard |
| 其余 | ¥0 |

---

## 我的 Secret 填表

→ [docs/seo/PRIVATE_SETUP.md](../seo/PRIVATE_SETUP.md)  
本地可复制 `PRIVATE_SETUP.local.md`（gitignore）。

真实 GA4 属性 ID、Gmail 等细节 → [GOOGLE_SETUP.md](../seo/GOOGLE_SETUP.md)（仓库内，勿外链社媒）。

---

## 当前待办（给自己）

- [ ] GSC OAuth Secrets 在 Actions 稳定（若仍 timeout 查日志）  
- [ ] 飞书：`FEISHU_FOLDER_TOKEN` + `python3 scripts/seo_feishu_journal.py init`（SEO 优化追踪）  
- [ ] `approve` 自动 PR workflow  
- [ ] commit + 部署 access booking  
- [ ] 清理 `2026-05-22-test-reminder.md`、根目录 QA 截图  
- [ ] 社媒发：playbook + seo/tutorial 链接  

**教程库 push**（维护者）：`cd vibe-coding-static-site-guide && git push origin main`  
分享链：https://github.com/yimleunggggg/vibe-coding-static-site-guide

---

## 社媒可用素材（脱敏）

**标题示例**：「不会写代码，用 AI 做了屋久岛公交查询站 + 自动 SEO 日报」

**可贴链接**：

- https://github.com/yimleunggggg/Yakushima-bus/tree/main/docs/playbook/README.md  
- https://github.com/yimleunggggg/Yakushima-bus/tree/main/docs/seo/tutorial/README.md  
- https://yakushimabus.com  

**可讲的故事点**（来自 [07-踩坑](07-踩坑·决策·思考.md)）：

1. GSC 服务账号 email not found → 改 OAuth  
2. 域名审核期先用 github.io  
3. Resend DNS 四记录，不用真邮箱  
4. 手机 ntfy + Gmail 双通知，电脑不用开  

---

[Playbook 首页](README.md)
