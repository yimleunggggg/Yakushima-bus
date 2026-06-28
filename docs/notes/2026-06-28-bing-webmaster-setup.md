# Bing Webmaster Tools 接入指南（yakushimabus.com）

> 适用：独立站 / 静态站，且 **Google Search Console 已验证**  
> 复盘：2026-06-28 完成 GSC 导入 + Sitemap Success + URL 提交

---

## 一、综述：这是什么、为什么要做

### 这是什么

**Bing Webmaster Tools**（必应网站管理员工具）是 Microsoft 提供的免费后台，作用类似 **Google Search Console（GSC）**：

- 告诉 Bing「这个站是我的、请收录」
- 提交 **Sitemap**（站点地图），让爬虫发现所有页面
- 查看 **Bing / Edge / Copilot** 搜索带来的展示、点击、搜索词
- 单页 **URL 检查**：某 URL 是否已被 Bing 收录

它和 **GA4（网站统计）不是一回事**：GA4 看「谁来了、做了什么」；Bing Webmaster 看「在 Bing 搜索里表现如何、有没有被收录」。

### 为什么要做

| 原因 | 说明 |
|------|------|
| **Google 之外仍有流量** | 日本等地区仍有用户用 Bing / Edge；本站 GA4 曾出现 `bing / organic`，且互动率不低 |
| **GSC 管不了 Bing** | GSC 只服务 Google；不登记 Bing，就无法在 Bing 后台看收录与搜索词 |
| **与 GA4 互补** | GA4 渠道报表能看到 `bing` 来源，但**看不到 Bing 搜索词**；搜索词需 Bing Webmaster 的 **Search Performance** |
| **一次性配置** | 登记 + Sitemap 通常做一次；大改版或新页再补提交即可 |

### 和 Google / GA4 的分工

| 工具 | 管什么 | 本站 |
|------|--------|------|
| **GSC** | Google 收录、搜索词、URL 检查 | 已验证 |
| **Bing Webmaster** | Bing 收录、Bing 搜索词 | 2026-06-28 已接入 |
| **GA4** | 全渠道流量、站内事件（查时刻表、票价等） | `G-BX2P31GEHW` |
| **GA4 关键事件 ☆** | 站内「转化」定义 | 在 GA4 后台标，**与 Bing 无关** |

### 不需要做的事（常见误解）

- ❌ **不必**为 ja / zh / en 各提交一条 URL（Sitemap 里已有 `hreflang`）
- ❌ **不必**提交 `/intro/`（该页 noindex）
- ❌ **不必**为了 Bing 去配 IndexNow（更新不频繁时 Sitemap 够用）
- ❌ **找不到「关联 GA4」** 时不是漏做——许多账号设置里只有 GSC，没有 GA4 入口

---

## 二、前置条件

- 站点：https://yakushimabus.com  
- **GSC** 已验证属性 `yakushimabus.com`  
- 线上可访问：
  - `https://yakushimabus.com/sitemap.xml`（7 个 canonical URL + hreflang）
  - `https://yakushimabus.com/robots.txt`（含 Sitemap 声明）
- 建议：Bing 登录时用 **与 GSC 相同的 Google 邮箱**，便于一键导入

---

## 三、分步骤操作

### 第 0 步：打开入口

1. 浏览器打开：https://www.bing.com/webmasters  
2. 使用 Microsoft 账号登录（可关联 Google 账号）

---

### 第 1 步：添加站点（推荐 GSC 导入）

**方式 A — 从 Google 导入（推荐，本站采用）**

1. 欢迎页左侧 **Import**（「Already verified on Google Search Console?」）
2. 授权 Google 账号 → 勾选 **yakushimabus.com** → 确认
3. **无需** HTML 验证文件、**无需** DNS CNAME

**方式 B — 手动添加（没有 GSC 时）**

1. 欢迎页右侧 **Add your site manually** → 输入 `https://yakushimabus.com`
2. 验证任选其一：
   - **XML 文件**：下载 `BingSiteAuth.xml` → 放网站**仓库根目录** → 部署 → 确认 `https://yakushimabus.com/BingSiteAuth.xml` 可访问 → 点验证  
   - **DNS CNAME**：在域名 DNS 添加 Bing 提供的记录  
   - **Meta 标签**：写入首页 `<head>`

---

### 第 2 步：确认 Sitemap

1. 左侧 **Sitemaps**（网站地图）
2. **从 GSC 导入时，Sitemap 常已自动出现**——状态 **Success**、**7 URLs** 即正常，无需重复提交
3. 若列表为空，手动提交：

   ```
   https://yakushimabus.com/sitemap.xml
   ```

4. 期望结果：**0 errors / 0 warnings**，URLs = **7**

**Sitemap 中的 7 页（canonical，不带 `?lang=`）**

| URL | 页面 |
|-----|------|
| `https://yakushimabus.com/` | 时刻表 |
| `https://yakushimabus.com/fare/` | 路线图·票价 |
| `https://yakushimabus.com/map/` | 便利设施地图 |
| `https://yakushimabus.com/ferry/` | 船运上岛 |
| `https://yakushimabus.com/without-car/` | 不租车攻略 |
| `https://yakushimabus.com/trekking/` | 登山参考 |
| `https://yakushimabus.com/about/` | 关于 |

三语版本（`?lang=ja|zh|en`）已在 sitemap 的 **hreflang** 中声明，**不要**为每种语言单独交 URL。

---

### 第 3 步：URL 提交（可选，催收录）

Sitemap 已 **Success** 时**非必须**；新站或大改版后建议交一次。

1. 首页 **Get started → URL Submission**，或 **Submit URLs**
2. 配额约 **100 条/天**；在文本框 **每行一条完整 URL**，粘贴：

```
https://yakushimabus.com/
https://yakushimabus.com/fare/
https://yakushimabus.com/map/
https://yakushimabus.com/ferry/
https://yakushimabus.com/without-car/
https://yakushimabus.com/trekking/
https://yakushimabus.com/about/
```

3. 点 **Submit**

> **为何不用 `/fare/?lang=zh`？**  
> 旧写法「只交中文 URL」是**中文 SEO 实验思路**，不是 Bing 技术要求。  
> 交 **canonical 主 URL** + Sitemap **hreflang** 即可覆盖日/中/英；单独交 `?lang=zh` 冗余且易与 canonical 混淆。

---

### 第 4 步：URL 检查（单页诊断，可选）

1. 左侧 **URL Inspection**
2. 输入框已固定站点前缀 `https://yakushimabus.com/` → **只填路径**，勿粘贴完整 URL

| 页面 | 输入框内填 |
|------|------------|
| 首页 | 留空或 `/` |
| 票价 | `fare/` |
| 不租车 | `without-car/` |

3. 点 **Inspect** → 查看是否 **Indexed** → 未收录可 **Request indexing**

**踩坑**：若输入 `https://yakushimabus.com/fare/`，可能报错 `http:// https://yakushimabus.com/fare`（协议重复）。

---

### 第 5 步：等待数据

1. 导入后首页常提示：数据处理最多 **48 小时**
2. 之后左侧 **Search Performance**（搜索性能）出现：展示、点击、平均排名、**搜索词**
3. 收录本身可能需 **数天～数周**；Sitemap Success ≠ 立刻出现在 Bing 搜索结果

**2–4 周后可看**：Search Performance、**Keyword Research**（试搜「屋久島 バス 時刻表」等）

---

## 四、可选功能（本站结论）

| 功能 | 建议 | 说明 |
|------|------|------|
| **关联 GA4** | 可跳过 | 设置（齿轮）中若只有 **Google 搜索控制台账户**、无 GA4 项，属正常；Bing 搜索词用 **Search Performance** 即可 |
| **IndexNow** | 可跳过 | 改版频繁时再考虑：需 API key + 根目录验证文件 + 部署后 ping；静态站 Sitemap + URL 提交已够 |
| **Block URLs** | 一般不用 | 仅屏蔽个别 URL 不出现在 Bing 结果 |
| **Site Scan** | 按需 | 技术 SEO 扫描，非登记必需 |

---

## 五、维护清单

| 何时 | 做什么 |
|------|--------|
| **新页上线** | 更新 `sitemap.xml` → push 部署 → Bing 自动重爬；可选 URL Submission 交新 URL |
| **大改版** | URL Inspection 抽查 + URL Submission |
| **每 2–4 周** | Search Performance 看词与 CTR；与 GSC 对照 |

---

## 六、对外一句话摘要（可复制）

> 在 Bing Webmaster Tools 从 Google Search Console 导入 yakushimabus.com，确认 Sitemap（7 URL）Success，并提交 7 条 canonical URL 催收录；Bing 搜索词与收录状态在 Search Performance 查看，与 GA4 站内转化统计分工明确。

---

## 相关链接

- Bing Webmaster：https://www.bing.com/webmasters  
- 本站 Sitemap：https://yakushimabus.com/sitemap.xml  
- GSC / GA4 追踪：[`docs/seo/TRACKING.md`](../seo/TRACKING.md)  
- GA4 事件与关键事件：[`docs/notes/2026-06-25-analytics.md`](2026-06-25-analytics.md)
