# 通知配置教程

> 定时任务跑完后，默认会：**写报告到 Git** + **开/更新 GitHub Issue**。  
> 本章配置 **邮件** 或 **手机推送**（可选）。

前置：已完成 [GOOGLE_SETUP.md](GOOGLE_SETUP.md) 且 workflow 能跑通。

---

## 1. 零配置也能收到什么

| 渠道 | 做法 | 收到什么 |
|------|------|----------|
| GitHub Issue | 仓库 **Watch → All Activity** 或 Custom → Issues | Issue 邮件 |
| 仓库文件 | 拉最新 main | `docs/seo/reports/YYYY-MM-DD-reminder.md` |

Workflow 步骤 **Send notifications** 未配 Secret 时会输出：

```text
ℹ 未配置通知 — 报告在 docs/seo/reports/ 与 GitHub Issue
```

### 失败重试与告警（2026-05）

| 阶段 | 行为 |
|------|------|
| 第 1 轮 | 定时 17:00 跑完整流程 |
| 第 2 轮 | 第 1 轮失败 → **等 60 秒**自动再跑一遍 |
| GA4/GSC / push | 每轮内各 **最多 3 次**短间隔重试 |
| 两轮均失败 | ntfy **高优先级**：`[YakuBus] 日报失败 · 请人工处理` + Actions 链接 |

第 2 轮成功时 workflow 显示 **绿**，标题带「重试成功」。**与你电脑开不开机无关**。

---

## 2. 手机推送（ntfy.sh）

### 2.1 安装 ntfy  app

- iOS / Android 搜索 **ntfy** 安装

### 2.2 订阅主题

1. 打开 app → 右上角 **+**
2. 主题名自定，如 `yakushimabus-seo`（勿用易猜的敏感词作唯一防护）
3. 订阅

### 2.3 添加 GitHub Secret

| Secret | 值 |
|--------|-----|
| `NTFY_TOPIC` | 与 app 里订阅的主题名 **完全一致** |

可选 `NTFY_SERVER`（自建 ntfy 时改，默认 `https://ntfy.sh`）。

### 2.4 验证

Actions → Run workflow → 步骤 **Send notifications** 应出现：

```text
✓ ntfy → yakushimabus-seo
```

手机收到推送，标题形如 `[YakuBus SEO] 2026-05-21 展示/流量报告 — Issue #N`。

---

## 3. 邮件（Resend）

### 3.1 注册 Resend

1. [resend.com](https://resend.com) 注册
2. **API Keys** → 创建 Key → 复制

### 3.2 发件域名（可选）

- 测试可用 Resend 默认发件 `onboarding@resend.dev`
- 正式建议验证自己的域名

### 3.3 添加 GitHub Secrets

| Secret | 值 |
|--------|-----|
| `RESEND_API_KEY` | `re_...` |
| `SEO_NOTIFY_EMAIL` | 你的收件邮箱 |
| `RESEND_FROM` | 如 `YakuBus SEO <onboarding@resend.dev>` 或已验证域名发件人 |

### 3.4 验证

**Send notifications** 日志：

```text
✓ email → your@email.com
```

邮件正文为报告 Markdown 的 HTML 预览。

---

## 4. 同时配置 ntfy + 邮件

Secrets 都填即可；`seo_notify.sh` 会 **两个都发**（任一成功即 `sent=1`）。

---

## 5. Issue 内容是什么

Workflow 会：

1. 若无 open 的 `seo-round` Issue → 创建 `SEO Round — YYYY-MM-DD`
2. 若已有 → 在该 Issue **追加评论**

正文 = 当日 `reports/*-reminder.md` 全文 + 文末提示「在 Cursor 说跑一轮 SEO 优化」。

---

## 6. 排错

| 现象 | 处理 |
|------|------|
| ntfy 无推送 | 查主题名与 Secret；app 是否订阅 |
| 邮件失败 | Resend Key、发件人域名验证、收件是否在垃圾箱 |
| 有 Issue 无推送 | 正常；Issue 即默认通知 |

---

## 7. 相关

- 总教程：[RUNBOOK.md](RUNBOOK.md)
- 报告样例：`docs/seo/reports/2026-05-21-reminder.md`
