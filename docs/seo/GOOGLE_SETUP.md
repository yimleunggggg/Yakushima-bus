# Google 授权一次性配置（GSC + GA4 自动读数）

做完下面 **7 步**，GitHub 定时任务和 Cursor「跑一轮 SEO」都会自动拉搜索/流量数据，写进 `docs/seo/metrics/latest.json` 和 `TRACKING.md`。

## 第 1 步：Google Cloud 项目

1. 打开 [Google Cloud Console](https://console.cloud.google.com/)
2. 顶部选/新建项目，例如 `yakushimabus-seo`
3. **API 和服务 → 库**，分别启用：
   - **Google Search Console API**
   - **Google Analytics Data API**
   - **Google Analytics Admin API**（GA4 脚本授权用）

## 第 2 步：创建服务账号 + 下载 JSON

1. **IAM 和管理 → 服务账号 → 创建**
2. 名称随意，如 `seo-metrics-reader`
3. 创建完成后 → **密钥 → 添加密钥 → JSON** → 下载到本机  
   ⚠️ 此文件只存 GitHub Secrets 或本地 `secrets/google-sa.json`，**不要 commit**

## 第 3 步：Search Console ↔ Cloud 项目关联

GSC **「添加用户」不接受** `@...iam.gserviceaccount.com`（会报「邮箱不存在」）——正常，改用关联：

1. 打开 [Search Console](https://search.google.com/search-console) → 选 **https://yakushimabus.com/** 资源
2. **设置 Settings → Associations / 关联**
3. **Associate with a Google Cloud project** → 选 **`yakushimabus-seo`**
4. 确认关联成功（列表里出现该项目名）

关联后，同项目里的服务账号 `seo-metrics-reader@...` 即可调用 Search Console API，**无需**在用户列表里添加该邮箱。

`GSC_SITE_URL` Secret 填：`https://yakushimabus.com/`（与资源一致，末尾带 `/`）

## 第 4 步：GA4 授权

**方式 A（网页）**  
管理 → **属性**列 → 属性访问权限管理 → 添加用户 → 同一邮箱 → **查看者** → **不要勾选**邮件通知

**方式 B（网页报错时用）**

1. Cloud Console → **API 库** → 启用 **Google Analytics Admin API**
2. **OAuth 同意屏幕** → 用户类型 **外部** → 保存  
   → **测试用户** → 添加 **你的 Gmail**  
   → **添加或移除范围** → 手动加 `.../auth/analytics.manage.users`（若列表没有可跳过，登录时再授权）
3. **凭据 → 创建凭据 → OAuth 客户端 ID** → 应用类型 **桌面应用** → 创建 → **下载 JSON**
4. 保存为项目内 `secrets/oauth-client.json`（勿 commit，已在 .gitignore）
5. 运行：

```bash
cd "/Users/yimleung/手搓程序/Yakushima-bus"
python3 scripts/seo_grant_ga4_access.py 538426834
```

若仍显示 **This app is blocked**：确认 OAuth 为 **Testing** 且你的 Gmail 在 **测试用户** 列表里。

**pip 超时时** 加镜像：`-i https://pypi.tuna.tsinghua.edu.cn/simple`

或用 [Cloud Shell](https://console.cloud.google.com/?cloudshell=true) 克隆仓库后运行同上命令。

## 第 5 步：查 GA4 属性 ID

**管理 → 属性设置** → 复制 **属性 ID**（纯数字）  
❌ 不是衡量 ID `G-BX2P31GEHW`

## 第 6 步：GitHub Secrets

仓库 **Settings → Secrets → Actions**：

| Secret | 值 |
|--------|-----|
| `GOOGLE_SERVICE_ACCOUNT_JSON` | JSON 整份粘贴 |
| `GA4_PROPERTY_ID` | 数字属性 ID |
| `GSC_SITE_URL` | `https://yakushimabus.com/` |

## 第 7 步：验证

```bash
pip3 install -r scripts/requirements-seo.txt
export GA4_PROPERTY_ID=你的数字ID
export GSC_SITE_URL='https://yakushimabus.com/'
python3 scripts/seo_fetch_metrics.py
```

成功会看到 `✓ GSC 28d` / `✓ GA4 28d`，并生成 `docs/seo/metrics/latest.json`。

GitHub：**Actions → SEO review (biweekly) → Run workflow** 手动跑一次。

---

## 常见报错

| 报错 | 原因 | 处理 |
|------|------|------|
| `403 User does not have sufficient permission` (GSC) | 未关联 Cloud 项目或 API 未启用 | 设置 → **Associations** 关联 `yakushimabus-seo` |
| `403 GA4` | 服务账号未加进 GA4 属性 | 重做第 4 步 |
| `404 site not found` | `GSC_SITE_URL` 和资源类型不一致 | 换 `sc-domain:` 或 `https://` 前缀 |
| GA4 全空 | 用了 `G-xxx` 而不是属性 ID | 改用数字 ID |

## 自动读什么

| 来源 | 数据 | 写入 |
|------|------|------|
| GSC | 28 天展示/点击/排名、Top 查询词、4 页索引状态 | `latest.json` + TRACKING 表 |
| GA4 | 28 天活跃用户、自然搜索用户 | 同上 |

GSC 数据通常滞后 **2–3 天**，新站前几周为 0 正常。
