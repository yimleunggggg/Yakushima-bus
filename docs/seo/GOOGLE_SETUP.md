# Google 授权配置教程（GSC + GA4 自动读数）

> 本文是 [SEO 自动化总教程](RUNBOOK.md) 的 **阶段 B2**，逐步点击即可完成。  
> 完成后：GitHub Actions 与 `python3 scripts/seo_fetch_metrics.py` 自动写入 `docs/seo/metrics/latest.json` 和 `TRACKING.md`。

**示例值（Yakushima Bus，请换成你的）**

| 变量 | 示例 |
|------|------|
| 域名 / GSC 资源 | `https://yakushimabus.com/` |
| Cloud 项目名 | `yakushimabus-seo` |
| 服务账号名 | `seo-metrics-reader` |
| 服务账号邮箱 | `seo-metrics-reader@yakushimabus-seo.iam.gserviceaccount.com` |
| GA4 属性 ID | `538426834`（数字，非 `G-xxx`） |
| GA4 管理员 Gmail | `yimleung.ly@gmail.com` |

**总耗时**：约 30–60 分钟。

---

## 开始之前

- [ ] GSC 已验证你的站点（见 [RUNBOOK §A1](RUNBOOK.md#a1-search-console)）
- [ ] GA4 属性已创建（见 [RUNBOOK §A2](RUNBOOK.md#a2-google-analytics-4)）
- [ ] 已记下 GA4 **数字属性 ID**
- [ ] 本地已 clone 仓库，存在 `secrets/` 目录（可 `mkdir secrets`）

---

## 第 1 步：创建 Cloud 项目并启用 API

### 1.1 创建项目

1. 打开 [Google Cloud Console](https://console.cloud.google.com/)
2. 顶部项目下拉 → **新建项目**
3. 项目名称：`yakushimabus-seo`（或你的项目名）→ **创建**
4. 等待创建完成 → 顶部切换到该项目

![Cloud 项目选择](images/cloud-project-select.png)

### 1.2 启用 3 个 API

1. 左侧 **API 和服务 → 库**（或直接 [API 库](https://console.cloud.google.com/apis/library)）
2. 依次搜索并 **启用**：

| API 名称 | 用途 |
|----------|------|
| **Google Search Console API** | 拉搜索展示/点击 |
| **Google Analytics Data API** | 拉 GA4 流量 |
| **Google Analytics Admin API** | grant 脚本给 SA 加权限 |

3. 每个 API 页点 **启用** → 返回库搜下一个

![API 已启用列表](images/cloud-apis-enabled.png)

**检查点**：**API 和服务 → 已启用的 API** 里能看到上述 3 个。

**常见错误**：Actions 报 `SERVICE_DISABLED` / `analyticsdata.googleapis.com` → 漏启 **Analytics Data API**，启用后等 2–5 分钟。

---

## 第 2 步：创建服务账号并下载 JSON

### 2.1 创建服务账号

1. **IAM 和管理 → 服务账号** → **创建服务账号**
2. 名称：`seo-metrics-reader`
3. 说明可填：`Read GSC and GA4 for SEO reports`
4. **创建并继续** → 角色可 **跳过**（不赋 IAM 角色）→ **完成**

### 2.2 下载 JSON 密钥

1. 点击刚创建的服务账号邮箱
2. **密钥** 标签 → **添加密钥 → 创建新密钥**
3. 类型 **JSON** → **创建** → 浏览器下载 `.json` 文件
4. 重命名并移到仓库：

```text
你的仓库/secrets/google-sa.json
```

⚠️ **切勿** commit 到 Git（已在 `.gitignore`）。

![服务账号密钥](images/service-account-key.png)

### 2.3 记下服务账号邮箱

打开 JSON，找到 `"client_email"`，形如：

```text
seo-metrics-reader@yakushimabus-seo.iam.gserviceaccount.com
```

后面 GA4 grant 脚本会用到（已写在脚本里，换项目需改脚本中的 `SA_EMAIL`）。

**检查点**：`secrets/google-sa.json` 存在且为合法 JSON。

---

## 第 3 步：GSC 授权（OAuth）

### 为什么不用服务账号 / Cloud 关联？

| 方式 | 结果 |
|------|------|
| Users 添加 `@...iam.gserviceaccount.com` | **`email not found`**（你已遇到） |
| Associations 关联 Cloud 项目 | 许多账号**只有 GA4**，无 Cloud 选项 |
| **OAuth + refresh token** | ✅ 推荐：用 **你的 Gmail**（GSC 所有者）读数 |

### 3.1 准备 OAuth 客户端

与第 4 步 GA4 共用 **`secrets/oauth-client.json`**（桌面应用）。  
Auth Platform → **External** → **Test users** 含你的 Gmail。

可选：在 **Data Access** 手动加范围 `https://www.googleapis.com/auth/webmasters.readonly`（登录时也会提示）。

### 3.2 运行脚本

```bash
pip3 install google-auth-oauthlib -i https://pypi.tuna.tsinghua.edu.cn/simple
python3 scripts/seo_setup_gsc_oauth.py
```

1. 浏览器 **Continue** → 用 **GSC 所有者 Gmail** 登录 → 允许  
2. 终端打印 **refresh token**  
3. 本地另存 `secrets/gsc-oauth-token.json`（勿 commit）

![GSC OAuth 成功](images/gsc-oauth-token.png)

### 3.3 GitHub Secrets

| Secret | 值 |
|--------|-----|
| `GOOGLE_OAUTH_REFRESH_TOKEN` | 脚本输出的 token |
| `GOOGLE_OAUTH_CLIENT_JSON` | `oauth-client.json` 全文 |
| `GSC_SITE_URL` | `https://yakushimabus.com/`（与 GSC 资源完全一致） |

**检查点**：Actions 日志 `GSC auth: oauth` 且 `✓ GSC 28d`。

### 3.4 （可选）Cloud 关联

若你的 Associations 里**有**「Google Cloud project」且能关联，可额外做；**没有则跳过**，不影响 OAuth 方案。

---

## 第 4 步：GA4 授权服务账号（查看者）

GA4 网页「添加用户」填服务账号 **常会失败**，推荐 **OAuth + 脚本**（一次性）。

### 4.1 配置 OAuth 同意屏幕

1. Cloud Console → **Google Auth Platform**（或 **API 和服务 → OAuth 同意屏幕**）
2. 若提示创建应用 → 应用名可填 `Yakushima-bus SEO`
3. **Audience / 受众**：
   - 用户类型选 **External（外部）** → **Next**
   - 联系邮箱填你的 Gmail → **Next** → **Save**
4. **Publishing status** 保持 **Testing（测试中）** — **不要 Publish**

![OAuth Audience 选 External](images/oauth-audience-external.png)

5. **Test users / 测试用户** → **Add users** → 输入 **GA4 属性管理员的 Gmail**（须与后面浏览器登录 **完全一致**）→ Save

**常见错误 `403 access_denied`**：登录 Gmail 不在 Test users 列表。

### 4.2 创建 OAuth 桌面客户端

1. **Clients / 客户端** → **Create client / 创建客户端**
2. 应用类型：**Desktop app / 桌面应用**
3. 名称随意 → **Create**
4. **Download JSON** → 保存为：

```text
你的仓库/secrets/oauth-client.json
```

![OAuth 桌面客户端](images/oauth-desktop-client.png)

### 4.3 运行 grant 脚本

```bash
cd "/path/to/your-repo"
pip3 install google-auth-oauthlib requests
# 国内可选：-i https://pypi.tuna.tsinghua.edu.cn/simple

python3 scripts/seo_grant_ga4_access.py 538426834
# 最后一个参数 = 你的 GA4 数字属性 ID
```

**浏览器流程**（按顺序）：

1. 自动打开 Google 登录
2. 若显示 **Google hasn't verified this app** → 点 **Continue**（Testing 正常，无需 Publish）
3. 选择 **Test users 里的那个 Gmail**
4. 允许 **Manage Google Analytics users** 权限
5. 出现 *The authentication flow has completed* → 可关浏览器

**终端成功标志**（必须看到，不能只看浏览器）：

```text
正在通过 REST API 添加服务账号（无需 gRPC）…
✓ 已添加 seo-metrics-reader@yakushimabus-seo.iam.gserviceaccount.com 为查看者 → 属性 538426834
```

### 4.4 在 GA4 网页确认

1. [GA4](https://analytics.google.com) → **管理**
2. **属性** 列 → **属性访问权限管理**
3. 列表中应出现 `seo-metrics-reader@...`，角色 **查看者**

![GA4 服务账号已添加](images/ga4-service-account-viewer.png)

**说明**：OAuth 登录的是 **你的 Gmail**，脚本代你把 **服务账号** 加进 GA4；两者不是同一个邮箱。

**常见错误 `503 grpc`**：请用仓库内最新 `seo_grant_ga4_access.py`（REST 版）。仍失败 → VPN 或 [Cloud Shell](https://console.cloud.google.com/?cloudshell=true) 克隆仓库后运行同一命令。

---

## 第 5 步：确认 GA4 属性 ID

1. GA4 → **管理 → 属性设置**
2. 复制 **属性 ID**（Property ID）— **纯数字**

| 字段 | 示例 | 能否用于 Secret |
|------|------|-----------------|
| 属性 ID | `538426834` | ✅ `GA4_PROPERTY_ID` |
| 衡量 ID | `G-BX2P31GEHW` | ❌ 仅用于 `analytics.js` |

![GA4 属性 ID](images/ga4-property-id.png)

---

## 第 6 步：写入 GitHub Secrets

1. GitHub 仓库 → **Settings → Secrets and variables → Actions**
2. **New repository secret**，逐个创建：

| Name | Secret value |
|------|--------------|
| `GOOGLE_SERVICE_ACCOUNT_JSON` | 打开 `google-sa.json`，**全选复制** 整份 JSON（GA4 用） |
| `GOOGLE_OAUTH_REFRESH_TOKEN` | 第 3 步 `seo_setup_gsc_oauth.py` 输出（GSC 用） |
| `GOOGLE_OAUTH_CLIENT_JSON` | `oauth-client.json` 全文（GSC 用） |
| `GA4_PROPERTY_ID` | `538426834` |
| `GSC_SITE_URL` | `https://yakushimabus.com/` |

![GitHub Secrets](images/github-secrets.png)

**注意**：

- JSON 粘贴时不要少括号、不要加多余引号
- `GSC_SITE_URL` 与 GSC 资源完全一致（含 `https://`、末尾 `/`）

---

## 第 7 步：验证

### 7.1 确认 workflow 已 push

仓库需含 `.github/workflows/seo-daily.yml`。  
Actions 页应出现 **SEO daily report**。

### 7.2 手动 Run workflow

1. **Actions → SEO daily report → Run workflow**
2. 等约 1–3 分钟 → 点开 run → job **seo-daily**

### 7.3 逐步验收

| 步骤 | 期望 |
|------|------|
| Install SEO dependencies | Successfully installed |
| Run daily pipeline | 日志含日报路径、`✓` 拉数 |
| （自动 commit） | `docs/seo/reports/daily/`、`metrics/` 更新 |
| Open review issue | Issue 标签 `seo-round` |

![Workflow 成功](images/actions-workflow-success.png)

![拉数日志](images/fetch-metrics-ok.png)

### 7.4 本地对照（可选）

```bash
export GOOGLE_APPLICATION_CREDENTIALS=secrets/google-sa.json
export GA4_PROPERTY_ID=538426834
export GSC_SITE_URL='https://yakushimabus.com/'
pip3 install -r scripts/requirements-seo.txt
python3 scripts/seo_fetch_metrics.py
```

国内 Mac 可能超时；**以 Actions 结果为准**。

### 7.5 检查仓库文件

- `docs/seo/metrics/latest.json` — `"ok": true` 且无 gsc/ga4 error
- `docs/seo/reports/YYYY-MM-DD-reminder.md` — §2 有数据
- GitHub **Issues** — 新 Issue 或评论

---

## 常见报错

| 日志 / 现象 | 原因 | 处理 |
|-------------|------|------|
| GSC `403` / SA `email not found` | 第 3 步 OAuth + `GOOGLE_OAUTH_*` Secrets |
| GA4 `SERVICE_DISABLED` | Data API 未启用 | 第 1.2 步；等 2–5 分钟 |
| GA4 `403 property` | SA 未进属性 | 第 4 步 grant；GA4 权限页确认 |
| OAuth `access_denied` | 非 Test user | 第 4.1 步加 Gmail |
| OAuth 要求 Publish | 误解 | Testing 即可，点 Continue |
| grant `503 grpc` | 旧脚本 / 网络 | REST 版脚本 / VPN / Cloud Shell |
| 浏览器 completed 但 GA4 无 SA | API 步骤失败 | 看终端有无 `✓ 已添加` |
| Actions 无 workflow | 未 push | push `.github/` |
| 指标全 0 | 新站 | 正常；GSC 滞后 2–3 天 |

---

## 自动读取的数据

| 来源 | 字段 | 写入 |
|------|------|------|
| GSC | 28 天展示、点击、CTR、平均排名、Top 查询词、Top 页面、4 URL 索引抽查 | `latest.json` + `TRACKING.md` |
| GA4 | 28 天活跃用户、自然搜索用户 | 同上 |

---

## 下一步

- 总流程与日常用法 → [RUNBOOK.md](RUNBOOK.md) §5–§6  
- 邮件/推送 → [NOTIFICATIONS.md](NOTIFICATIONS.md)  
- 截图清单 → [images/README.md](images/README.md)
