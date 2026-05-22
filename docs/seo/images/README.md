# 教程配图清单

把截图放入本目录，**文件名必须一致**，Markdown 才会显示。

## 必配（核心流程）

| 文件名 | 拍什么 | 用在 |
|--------|--------|------|
| `gsc-sitemap-submitted.png` | GSC → Sitemap 已提交 | RUNBOOK §A1 |
| `ga4-property-id.png` | GA4 管理 → 属性设置 → 属性 ID | RUNBOOK §A2、GOOGLE_SETUP §5 |
| `cloud-project-select.png` | Cloud Console 顶部已选项目 | GOOGLE_SETUP §1 |
| `cloud-apis-enabled.png` | 已启用 API 列表含 3 个 | GOOGLE_SETUP §1 |
| `service-account-key.png` | 服务账号 → 密钥已创建 | GOOGLE_SETUP §2 |
| `gsc-oauth-token.png` | 终端输出 refresh token | GOOGLE_SETUP §3 |
| `oauth-audience-external.png` | Auth Platform → Audience = External | GOOGLE_SETUP §4 |
| `oauth-desktop-client.png` | OAuth 客户端类型 Desktop | GOOGLE_SETUP §4 |
| `ga4-service-account-viewer.png` | GA4 属性权限含 `seo-metrics-reader@...` | GOOGLE_SETUP §4 |
| `github-secrets.png` | GitHub Actions Secrets 三项 | GOOGLE_SETUP §6 |
| `actions-run-workflow.png` | Actions → Run workflow 按钮 | GOOGLE_SETUP §7 |
| `actions-workflow-success.png` | workflow 绿色勾 | GOOGLE_SETUP §7、RUNBOOK §C2 |
| `fetch-metrics-ok.png` | 日志 `✓ GSC 28d` / `✓ GA4 28d` | GOOGLE_SETUP §7、RUNBOOK §C2 |

## 可选

| 文件名 | 拍什么 |
|--------|--------|
| `oauth-test-users.png` | Test users 列表含管理员 Gmail |
| `oauth-continue-unverified.png` | 「未验证应用」点 Continue |
| `issue-seo-round.png` | GitHub Issue 标签 seo-round |
| `ntfy-push.png` | 手机收到 ntfy 推送 |

## 提交

```bash
git add docs/seo/images/*.png
git commit -m "docs(seo): add tutorial screenshots"
```

## 尚未完成的步骤

步骤未完成时图片可缺省；完成后补图并更新 [RUNBOOK §8](../RUNBOOK.md#8-案例进度yakushima-bus) 进度表。
