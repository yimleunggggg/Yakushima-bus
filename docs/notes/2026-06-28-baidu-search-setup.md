# 中文搜索引擎接入指南（百度等 · yakushimabus.com）

> 复盘：2026-06-28  
> 站点代码侧：已加 `sitemap-zh.xml`、中文优先语言逻辑、`seo-head-zh.js`  
> **后台登记需你本人在百度搜索资源平台完成**

---

## 一、综述：这是什么、为什么要做

### 这是什么

**百度搜索资源平台**（原百度站长平台）类似 Google Search Console / Bing Webmaster，用于：

- 验证站点所有权  
- 提交 **Sitemap**，让百度蜘蛛发现页面  
- 查看索引量、抓取诊断（境外站功能可能受限）  
- （可选）主动推送 URL  

**搜狗 / 360 搜索**也有站长平台，流程类似，优先级低于百度。

### 为什么要做

| 原因 | 说明 |
|------|------|
| **中文用户已有，搜索几乎为零** | GA4 显示不少中文用户走 Direct（微信等），Organic 来自百度极少 |
| **Google/Bing 管不了百度** | 必须在百度单独登记 |
| **与 Bing 策略不同** | Bing 交 canonical 主 URL；**中文引擎应优先 `?lang=zh` URL**（见下文） |

### 与 Google / Bing 的分工

| 引擎 | Sitemap | 手动提交 URL |
|------|---------|--------------|
| Google GSC | `sitemap.xml`（canonical + hreflang） | canonical 主 URL |
| Bing | 同上（GSC 导入） | canonical 主 URL |
| **百度 / 中文** | **`sitemap-zh.xml`（`?lang=zh`）** | **`?lang=zh` 链接** |

---

## 二、站点侧已做（代码，部署后生效）

### 1. 中文专用 Sitemap

- 文件：`sitemap-zh.xml`（7 条 `?lang=zh` URL）  
- `robots.txt` 已声明：`Sitemap: https://yakushimabus.com/sitemap-zh.xml`

### 2. 访问优先中文

| 机制 | 行为 |
|------|------|
| **`?lang=zh`** | 强制中文（不变） |
| **浏览器语言 zh** | 自动中文（不变） |
| **来自百度/搜狗等** | Referrer 为 baidu.com、sogou.com 等 → 自动 `?lang=zh` |
| **中文搜索爬虫** | Baiduspider、Sogou、360Spider 等 → 按中文处理 |
| **`seo-head-zh.js`** | 语言为 zh 时，同步中文 `<title>` / description / og |
| **`lang-boot.js` v4** | 提前在 `<head>` 执行，减少日文闪屏 |

用户**手动切过语言**后仍以 localStorage 为准（不会被覆盖）。

### 3. 目标关键词（提交 / 文案参考）

- 屋久岛 公交 时刻表 / 屋久岛 巴士 时刻表  
- 屋久岛 公交 票价 / 屋久岛 不租车  
- 屋久岛 船票 / 上岛 交通  

---

## 三、分步骤：百度搜索资源平台

### 第 0 步：打开入口

1. https://ziyuan.baidu.com/  
2. 登录百度账号（无则注册）

---

### 第 1 步：添加站点

1. **用户中心 → 站点管理 → 添加网站**  
2. 站点地址：`https://yakushimabus.com`  
3. 站点属性：按提示选择（境外/旅游工具类）

---

### 第 2 步：验证所有权（三选一）

**方式 A — HTML 标签（推荐）**

1. 选择 **HTML 标签验证**  
2. 复制类似：`<meta name="baidu-site-verification" content="xxxxxxxx" />`  
3. 加到 **`index.html` 的 `<head>` 内**（`<meta charset>` 之后即可）  
4. push 部署 → 百度后台点 **完成验证**

**方式 B — HTML 文件**

1. 下载 `baidu_verify_xxxxx.html`  
2. 放**仓库根目录**（与 Google 验证文件同级）→ 部署  
3. 确认 `https://yakushimabus.com/baidu_verify_xxxxx.html` 可访问 → 验证

**方式 C — DNS**

在域名 DNS 添加百度提供的 TXT/CNAME 记录。

> 验证通过后，把 meta 或文件**保留在仓库**，勿删。

---

### 第 3 步：提交 Sitemap（中文）

1. **资源提交 → Sitemap**  
2. 提交：

   ```
   https://yakushimabus.com/sitemap-zh.xml
   ```

3. **不要只交** `sitemap.xml` 而不交中文版——百度应优先抓带 `?lang=zh` 的 URL。

（可选）同时提交 `https://yakushimabus.com/sitemap.xml` 作补充。

---

### 第 4 步：主动推送 URL（可选）

**资源提交 → 普通收录 / API 提交**（界面名可能随版本变化）

**每行一条，优先中文 URL：**

```
https://yakushimabus.com/?lang=zh
https://yakushimabus.com/fare/?lang=zh
https://yakushimabus.com/map/?lang=zh
https://yakushimabus.com/ferry/?lang=zh
https://yakushimabus.com/without-car/?lang=zh
https://yakushimabus.com/trekking/?lang=zh
https://yakushimabus.com/about/?lang=zh
```

**不要提交**：`/intro/`（noindex）

---

### 第 5 步：等待与预期

| 现象 | 说明 |
|------|------|
| 境外 .com 站 | 百度收录**慢于** Google/Bing，数周也正常 |
| 索引量 | 后台「索引」逐步增加即正常 |
| 检验 | 百度搜索 `site:yakushimabus.com` 或品牌词 |

---

## 四、搜狗 / 360（可选，低优先级）

| 平台 | 入口 | 提交 |
|------|------|------|
| 搜狗 | https://zhanzhang.sogou.com/ | 同上：`sitemap-zh.xml` + 中文 URL |
| 360 | https://zhanzhang.so.com/ | 同上 |

流程与百度类似：验证 → Sitemap → 中文 URL。

---

## 五、与 Bing 文档的差异（勿混用）

| 项目 | Bing | 百度 / 中文 |
|------|------|-------------|
| Sitemap | `sitemap.xml` | **`sitemap-zh.xml`** |
| URL 提交 | canonical，不带 lang | **`?lang=zh`** |
| 导入 GSC | 支持 | 不支持 |
| 语言默认 | 浏览器 / ja | **百度来源 + 爬虫 → zh** |

Bing 完整步骤：[`2026-06-28-bing-webmaster-setup.md`](2026-06-28-bing-webmaster-setup.md)

---

## 六、维护

| 何时 | 做什么 |
|------|--------|
| 新页上线 | 更新 `sitemap.xml` **和** `sitemap-zh.xml` → 部署 → 百度重新提交 |
| 大改版 | 百度普通收录再推一遍中文 URL |
| 验证 meta | 换模板或重构 `<head>` 时保留 `baidu-site-verification` |

---

## 七、对外一句话摘要

> 为中文搜索单独维护 `sitemap-zh.xml` 与 `?lang=zh` 收录 URL；站点对百度来源与中文爬虫自动切中文并输出中文 title/description；在百度搜索资源平台验证后提交中文 Sitemap 与 URL。

---

## 待你完成（一次性）

- [ ] 百度搜索资源平台验证（meta 或文件）  
- [ ] 提交 `sitemap-zh.xml`  
- [ ] （可选）主动推送 7 条中文 URL  
- [ ] 部署含 `lang-v4` / `seo-head-zh` 的代码  
- [ ] 验证文件：`baidu_verify_codeva-oiTnOYey5q.html`（根目录，与百度下载名一致）  
- [ ] 验证 meta：`index.html` 内 `baidu-site-verification`
