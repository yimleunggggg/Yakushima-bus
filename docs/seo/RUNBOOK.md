# 静态站点 SEO 自动化教程

> 适用：GitHub Pages 等静态站，希望 **自动读 GSC/GA4 → 定期报告存档 → 收到提醒 → 按需做 SEO 优化**。  
> 示例站点：[yakushimabus.com](https://yakushimabus.com)（屋久岛公交时刻表）

**文档结构**

| 章节 | 文档 | 内容 |
|------|------|------|
| 总流程 | 本文 | 从 0 到跑通的全链路 |
| Google 授权 | [GOOGLE_SETUP.md](GOOGLE_SETUP.md) | Cloud / GSC / GA4 分步操作（**最细**） |
| 通知 | [NOTIFICATIONS.md](NOTIFICATIONS.md) | Issue / 邮件 / 手机推送 |
| 指标 | [TRACKING.md](TRACKING.md) | 历史数据表 |
| 配图 | [images/README.md](images/README.md) | 截图清单 |

**维护**：每完成一项关键配置，更新本文 **§8 案例进度** 与文首日期。最后更新：**2026-05-22**

---

## 0. 你将得到什么

| 能力 | 说明 |
|------|------|
| 自动读数 | 每半月拉 GSC（28 天展示/点击/排名、Top 词、索引）+ GA4（28 天用户、自然搜索） |
| **日报** | 每天 GA4 昨日/7 日 + GSC + 自检 → `reports/daily/YYYY-MM-DD.md` |
| **周报方案** | 每周一 → `proposals/YYYY-WW-proposal.md` + Issue `seo-round YYYY-WW` |
| 长期存档 | `docs/seo/metrics/latest.json`、`reports/YYYY-MM-DD-reminder.md`、`TRACKING.md` 自动写入 Git |
| 定期提醒 | GitHub Issue（标签 `seo-round`）；可叠加邮件或 ntfy |
| 专业优化 | 在 Cursor 说「跑一轮 SEO 优化」→ 读数据、改 meta、写 Round 报告（**定时任务默认不改 HTML**） |

---

## 1. 前置条件

开始之前请确认：

| # | 条件 | 如何确认 |
|---|------|----------|
| 1 | 站点已公网可访问 | 浏览器打开 `https://你的域名/` |
| 2 | 代码在 GitHub 仓库 | 能 push、能开 Actions |
| 3 | [Search Console](https://search.google.com/search-console) 已验证站点 | 左侧能看到你的资源 |
| 4 | [GA4](https://analytics.google.com) 已创建属性 | 管理里能看到数据流 |
| 5 | 本仓库已含 SEO 脚本 | 存在 `scripts/seo_*.py`、`/.github/workflows/seo-review.yml` |

**需要的账号**：Google 账号（GSC/GA4 管理员）、GitHub 仓库管理员。

**预计耗时**：首次配置约 **45–90 分钟**（含等待 API 生效）。

---

## 2. 阶段 A：站点与 Google 基础（人工，一次性）

### A1 Search Console

1. 打开 [Search Console](https://search.google.com/search-console) → **添加资源**
2. 选 **网址前缀**（推荐）或 **网域**；示例：`https://yakushimabus.com/`
3. 按提示验证（HTML 文件 / DNS / GA 关联等）
4. 左侧 **Sitemap** → 提交 `https://你的域名/sitemap.xml`
5. （可选）**URL 检查** → 输入首页 → **请求编入索引**（新站各主要 URL 各一次即可）

![GSC 已验证并提交 sitemap](images/gsc-sitemap-submitted.png)

**检查点**：Sitemap 状态为「成功」或处理中（新站可能暂时 0 页，正常）。

### A2 Google Analytics 4

1. [GA4](https://analytics.google.com) → **管理**（左下角齿轮）
2. **创建** 账号 / 属性（若还没有）
3. **数据流** → **网站** → URL 填你的域名
4. 复制 **衡量 ID**（`G-XXXXXXXX`）→ 写入站点 `analytics.js`（或等价埋点）
5. **管理 → 属性设置** → 复制 **属性 ID**（**纯数字**，如 `538426834`）→ 稍后填入 GitHub Secret  
   ❌ **不是** `G-xxx`

![GA4 属性 ID 位置](images/ga4-property-id.png)

**检查点**：GA4 **报告 → 实时** 能见到自己访问（需已部署含 GA 的页面）。

---

## 3. 阶段 B：启用仓库内自动化

### B1 确认文件已在仓库

push 后，仓库应包含：

```
.github/workflows/seo-review.yml
scripts/seo_check.sh
scripts/seo_fetch_metrics.py
scripts/seo_report.sh
scripts/seo_notify.sh
scripts/seo_grant_ga4_access.py
scripts/requirements-seo.txt
docs/seo/
```

若 Actions 页只有 `pages-build-deployment`、没有 **SEO review (biweekly)** → 说明 workflow **尚未 push**。

### B2 配置 Google 授权（核心）

👉 **逐步操作见 [GOOGLE_SETUP.md](GOOGLE_SETUP.md)**（共 7 大步，不要跳步）

摘要顺序：

1. Cloud 项目 + 启用 3 个 API  
2. 创建服务账号，下载 JSON  
3. GSC **Associations** 关联 Cloud 项目（❌ 不要在 GSC「添加用户」填服务账号）  
4. OAuth + `seo_grant_ga4_access.py` 给 GA4 属性加服务账号「查看者」  
5. 记下 GA4 **数字**属性 ID  
6. GitHub Secrets 三项  
7. Run workflow 验证  

### B3 配置 GitHub Secrets

路径：**仓库 → Settings → Secrets and variables → Actions → New repository secret**

| Secret 名称 | 填什么 | 示例 |
|-------------|--------|------|
| `GOOGLE_SERVICE_ACCOUNT_JSON` | 服务账号 JSON **完整内容** | `{ "type": "service_account", ... }` |
| `GA4_PROPERTY_ID` | GA4 **属性 ID**（纯数字） | `538426834` |
| `GSC_SITE_URL` | 与 GSC 资源 **完全一致** 的 URL | `https://yakushimabus.com/` |

![GitHub Secrets 三项](images/github-secrets.png)

可选通知 Secret 见 [NOTIFICATIONS.md](NOTIFICATIONS.md)。

---

## 4. 阶段 C：首次运行与验证

### C1 手动触发 Workflow

1. GitHub 仓库 → **Actions**
2. 左侧 **SEO review (biweekly)**
3. 右侧 **Run workflow** → 分支 `main` → **Run workflow**

![Run workflow](images/actions-run-workflow.png)

### C2 逐步检查日志

点开最新一次 run →  job **seo-round**：

| 步骤 | 期望结果 | 失败时 |
|------|----------|--------|
| **Static SEO checks** | `All checks passed` | 修 sitemap/meta/robots |
| **Fetch GSC + GA4 metrics** | `✓ GSC 28d` 与 `✓ GA4 28d` | 见 [GOOGLE_SETUP 常见报错](GOOGLE_SETUP.md#常见报错) |
| **Commit report and metrics** | 新 commit `docs(seo): biweekly report...` | 检查 `contents: write` 权限 |
| **Open review issue** | Issue 标签 `seo-round` | 可忽略 Octokit 弃用警告 |
| **Send notifications** | 已配 Secret 则 ✓；否则跳过 | 见 NOTIFICATIONS |

![Workflow 全部成功](images/actions-workflow-success.png)

![拉数成功日志](images/fetch-metrics-ok.png)

### C3 检查仓库产物

| 路径 | 内容 |
|------|------|
| `docs/seo/metrics/latest.json` | 最近一次 API 原始数据 |
| `docs/seo/reports/YYYY-MM-DD-reminder.md` | 可读报告（含 §2 数据、§4 学习说明） |
| `docs/seo/TRACKING.md` | 指标表（有数据时会更新一行） |
| GitHub **Issues** | `SEO Round — 日期` |

### C4 本地验证（可选）

仅当 Actions 已成功时可对照；**国内本地常因网络超时，以 Actions 为准**。

```bash
cd /path/to/your-repo
export GOOGLE_APPLICATION_CREDENTIALS=secrets/google-sa.json
export GA4_PROPERTY_ID=你的数字属性ID
export GSC_SITE_URL='https://你的域名/'   # 与 GSC 资源一致
pip3 install -r scripts/requirements-seo.txt
python3 scripts/seo_fetch_metrics.py
```

---

## 5. 阶段 D：定时任务说明

| 项 | 值 |
|----|-----|
| Workflow 文件 | `.github/workflows/seo-review.yml` |
| 定时 | 每月 **1 日、15 日** UTC 09:00（北京时间约 17:00） |
| 手动 | Actions → Run workflow 随时可跑 |
| 会改代码吗 | **默认不会**；只自检、拉数、写 `docs/seo/`、开 Issue |
| 会改 meta 吗 | 需你在 Cursor 触发「跑一轮 SEO 优化」 |

---

## 5b. 怎么看日报和周报

| 类型 | 去哪看 | 说明 |
|------|--------|------|
| **日报** | [`docs/seo/reports/daily/`](reports/daily/) 最新 `YYYY-MM-DD.md` | 每天 UTC 09:00（北京 **17:00**）自动生成；Actions → **SEO daily report** |
| **日报数据** | `docs/seo/metrics/daily-YYYY-MM-DD.json`、`daily-latest.json` | 原始 API 快照 |
| **飞书** | `docs/seo/feishu-links.json` 或 Actions 日志 `✓ Feishu doc:` | 需配 [FEISHU_SETUP.md](FEISHU_SETUP.md) 三个 Secret |
| **周报方案** | [`docs/seo/proposals/`](proposals/) 最新 `YYYY-WW-proposal.md` | 每周一 UTC 09:30；Actions → **SEO weekly proposal** |
| **确认执行** | GitHub Issue 标签 **`seo-round`**，标题 `seo-round YYYY-WW` | 评论 **`approve`** 后执行 §2 改动（或 Cursor 说「执行本周 SEO 方案」） |

本地预览：

```bash
bash scripts/seo_report_daily.sh          # 用 daily-latest 或 latest.json
bash scripts/seo_report_weekly.sh         # 生成本周方案
```

---

## 6. 阶段 E：收到报告之后做什么

### E1 每月例行（约 10 分钟）

1. 打开 GitHub Issue `seo-round`，或 `docs/seo/reports/` 最新 `*-reminder.md`
2. 看 **§2 GSC/GA4 数据**：展示、点击、Top 词、GA4 自然流量
3. 对比 [TRACKING.md](TRACKING.md) 上一行 → 看趋势
4. 新站 1–4 周展示≈0 **正常**；看趋势不看单日

### E2 需要改 SEO 时

在 Cursor（或支持项目的 AI IDE）说：

```text
跑一轮 SEO 优化
```

Agent 将（见 `.cursor/skills/seo-round/SKILL.md`）：

1. 读 `latest.json`、最近 report、TRACKING、CHANGELOG  
2. 根据 Top 查询词与 CTR 建议/修改 title、description、`page-lead`、JSON-LD  
3. 更新 `CHANGELOG.md`、生成 `reports/YYYY-MM-DD-round-N.md`  
4. 保持「工具站」定位，不堆旅游攻略  

### E3 新页面或大改版

1. 更新 `sitemap.xml` 的 `<lastmod>`  
2. GSC → **URL 检查** → **请求编入索引**  
3. 等下次定时报告看是否出现展示  

---

## 7. 通知（可选）

不配也能用：**Watch 仓库 Issue** + 读 `docs/seo/reports/`。

配邮件/手机推送 → [NOTIFICATIONS.md](NOTIFICATIONS.md)。

---

## 8. 案例进度：Yakushima Bus

> 对外教程的**真实进度样例**；你复用时复制此表改自己的站名。

| 项 | 状态 | 备注 |
|----|------|------|
| GSC 验证 + Sitemap | ✅ | `yakushimabus.com` |
| GA4 埋点 | ✅ | `G-BX2P31GEHW` |
| Workflow push | ✅ | `abc2720` |
| Cloud + 服务账号 | ✅ | `yakushimabus-seo` |
| GitHub Secrets 三项 | ✅ | |
| 首次 Run workflow | ✅ | 自检通过；初跑 GSC/GA4 403 |
| Analytics Data API | ✅ | 启用后 GA4 错误变为 403 property |
| GA4 grant 脚本 | ✅ | REST 版，`2026-05-21` |
| GA4 Actions `✓ GA4 28d` | ✅ | Run `2026-05-22`：28 天用户 **48**，自然搜索 **0**（新站正常） |
| GSC Associations | ⏳ | 界面无 Cloud 项；改 **OAuth**（见下） |
| GSC OAuth | ⏳ | 跑 `seo_setup_gsc_oauth.py` + 2 个 Secret |
| 报告 + Issue | ✅ | `docs/seo/reports/2026-05-22-reminder.md`，Issue #1 |
| **日报 workflow** | ✅ | `seo-daily.yml` + `seo_report_daily.sh` + `seo_fetch_daily.py` |
| **周报 workflow** | ✅ | `seo-weekly.yml` + `proposals/` + Issue `seo-round YYYY-WW` |
| **飞书归档** | ⏳ | 脚本就绪；待配 `FEISHU_*` Secrets（见 FEISHU_SETUP.md） |
| 邮件/ntfy | — | 未配置；看 Issue 或仓库报告 |

**实操日志**

| 日期 | 事件 |
|------|------|
| 2026-05-21 | SEO Round 1：四页 meta/JSON-LD、`page-lead` |
| 2026-05-21 | 首次 workflow：报告 commit、Issue 创建 |
| 2026-05-21 | GA4 OAuth grant 成功（国内需 REST，勿用旧 gRPC 脚本） |
| 2026-05-22 | Run workflow：GA4 ✅ 48 用户；GSC 403；Issue #1、报告 `2026-05-22-reminder.md` |

---

## 9. 排错速查

| 现象 | 处理 |
|------|------|
| Actions 无 SEO workflow | push `.github/workflows/seo-review.yml` |
| GSC `403 permission` | [GOOGLE_SETUP §3](GOOGLE_SETUP.md#第-3-步gsc--cloud-项目关联) Associations |
| GA4 `SERVICE_DISABLED` | 启用 Analytics Data API，等 2–5 分钟 |
| GA4 `403 property` | 跑 `seo_grant_ga4_access.py` |
| OAuth `access_denied` | Test users 加**登录 Gmail**；Testing 模式，勿 Publish |
| OAuth「未验证应用」 | 点 **Continue** |
| grant `503 grpc` | 用仓库内 **REST 版**脚本 / VPN / [Cloud Shell](https://console.cloud.google.com/?cloudshell=true) |
| 浏览器授权成功但 GA4 无 SA | 看终端 `✓ 已添加`，不是浏览器 completed |
| 本地 fetch 超时 | 以 Actions 日志为准 |

### 常见误区

| ❌ 错误 | ✅ 正确 |
|--------|--------|
| GSC「添加用户」填服务账号 | Associations 关联 Cloud 项目 |
| OAuth 要 Publish | Testing + Test users 即可 |
| `GA4_PROPERTY_ID` 填 `G-xxx` | 填数字属性 ID |
| 定时任务自动改网站 | 仅 Cursor「跑一轮 SEO 优化」改 meta |

---

## 10. 复用到你的网站

1. Fork 或复制 `scripts/seo_*`、`.github/workflows/seo-review.yml`、`docs/seo/`
2. 在 `seo_fetch_metrics.py` 改 `SITE_PAGES` 列表
3. 报告脚本里的域名文案改为你的站
4. 按 [GOOGLE_SETUP.md](GOOGLE_SETUP.md) 为你的域名重做授权
5. 改 GitHub Secrets → push → Run workflow

---

## 11. 相关链接

- [Search Console](https://search.google.com/search-console)
- [GA4](https://analytics.google.com)
- [Cloud Console](https://console.cloud.google.com)
- [Cloud Shell](https://console.cloud.google.com/?cloudshell=true)
