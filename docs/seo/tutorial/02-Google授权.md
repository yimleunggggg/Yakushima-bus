# Google 授权（GSC + GA4）

> 逐步点击见 [GOOGLE_SETUP.md](../GOOGLE_SETUP.md)。此处为阶段清单。

## 1. Cloud 项目

1. [Cloud Console](https://console.cloud.google.com/) 新建项目 `[你的项目名]`
2. 启用 API：Search Console、Analytics Data、Analytics Admin
3. 创建 **服务账号** `[你的SA名]@....iam.gserviceaccount.com`，下载 JSON → 存 `secrets/`，**勿提交 Git**

## 2. GSC（搜索数据 + 索引）

1. Search Console 添加资源 `https://[你的域名]/`
2. 提交 `sitemap.xml`
3. **OAuth**（索引 API 需要）：Desktop OAuth Client → `seo_setup_gsc_oauth.py` → 得到 refresh token
4. GSC → **设置 → 用户** → 添加服务账号邮箱 → **完全**权限

## 3. GA4（流量数据）

1. 创建属性，网站数据流，埋点 `G-XXXXXXXX`
2. 记下 **数字属性 ID**（非 `G-xxx`）
3. 本地运行 `seo_grant_ga4_access.py [属性ID]` 给服务账号「查看者」

## 4. GitHub Secrets（名称固定）

| Secret | 内容 |
|--------|------|
| `GOOGLE_SERVICE_ACCOUNT_JSON` | 服务账号 JSON 全文 |
| `GOOGLE_OAUTH_CLIENT_JSON` | OAuth client JSON |
| `GOOGLE_OAUTH_REFRESH_TOKEN` | refresh token 字符串 |
| `GA4_PROPERTY_ID` | 纯数字 |
| `GSC_SITE_URL` | 与 GSC 资源一致，如 `https://example.com/` |

验证：`Actions → SEO daily → Fetch` 日志出现 GA4/GSC 行。

## 5. 飞书（可选，暂缓）

见 [FEISHU_SETUP.md](../FEISHU_SETUP.md)，配 `FEISHU_APP_ID` 等三个 Secret 后日报同步云文档。
