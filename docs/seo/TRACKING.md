# SEO 效果追踪

站点：https://yakushimabus.com  
GA4：`G-BX2P31GEHW`（`analytics.js`）  
GSC：域名验证文件 `googlef464172b97bd6d41.html` 已在仓库

## 「URL 检查 → 请求编入索引」是什么意思？

Google 不会立刻爬完你刚上线的每个页面。**URL 检查** = 在 GSC 顶部输入某个网址（如 `https://yakushimabus.com/map/`），看 Google **是否已经收录**。

- **未收录**：显示「URL 不在 Google 上」→ 点 **「请求编入索引」** = 排队让 Google 来爬这一页（通常几天内，不保证立刻进搜索结果）
- **已收录**：显示「URL 已在 Google 上」→ 不用重复点

新站上线后各做一次即可；**只有大改版或新页面**才需要再请求。不是每天点的按钮。

## 自动化（已配置）

| 机制 | 作用 |
|------|------|
| `scripts/seo_fetch_daily.py` | 拉 GA4 昨日/7日：**渠道、来源/媒介、国家、国家×渠道、着陆页、设备** |
| `scripts/seo_ga4_analysis.py` | 根据数据自动生成 §2.5 解读（Direct/欧盟真实性/Organic） |
| `scripts/seo_report_daily.sh` | 生成 `docs/seo/reports/daily/YYYY-MM-DD.md` |

**你需要做的**：按 [`RUNBOOK.md`](RUNBOOK.md) / [`GOOGLE_SETUP.md`](GOOGLE_SETUP.md) 配好 3 个 Secrets 并 push → 全自动读数；可选 ntfy/邮件见 `NOTIFICATIONS.md`。

## 通知与报告

| 产物 | 位置 |
|------|------|
| 定时报告 | `docs/seo/reports/YYYY-MM-DD-reminder.md` |
| Round 完成报告 | `docs/seo/reports/YYYY-MM-DD-round-N.md` |
| 邮件 / 手机推送 | 配 GitHub Secrets，见 `NOTIFICATIONS.md` |

## 你需手动完成（一次性）

1. 打开 [Google Search Console](https://search.google.com/search-console) → 确认属性 **yakushimabus.com** 已验证（HTML 文件法）
2. **Sitemap** → 提交 `https://yakushimabus.com/sitemap.xml`（若已提交可跳过）
3. （可选）新页或大改版时 → **URL 检查** → 见上文说明；四 URL 各请求一次即可
4. [GA4](https://analytics.google.com) → 确认数据流 URL 为 `yakushimabus.com`，与 `analytics.js` ID 一致
5. （可选）GSC → **设置 → 用户和权限** 添加自己常用 Google 账号

## 定期任务（建议每 2–4 周）

| 步骤 | 做什么 |
|------|--------|
| 1 | 记录下方「指标表」新一行（GSC + GA4） |
| 2 | GSC → **效果**：看展示/点击/CTR/平均排名；**网页**→ 哪些 URL 有展示 |
| 3 | GSC → **编制索引**→ 确认 4 页均为「已编入索引」 |
| 4 | 根据查询词微调 title/description（见 `CHANGELOG.md` 记录） |
| 5 | 若有新页面或 PDF 大更新 → 改 `sitemap.xml` 的 `<lastmod>` 并在 GSC 重新抓取 |

在 Cursor 可说：**「跑一轮 SEO 优化」**（或等 GitHub Issue `seo-round` 提醒）→ Agent 按 `.cursor/skills/seo-round/SKILL.md` 执行。

## GA4：用户 / PV / Cookie（2026-05-22）

### 没有 Cookie 横幅，还算「独立用户」吗？

| 概念 | 实际含义 |
|------|----------|
| **浏览量（PV）** | 每打开/刷新一页 +1，≠ 新用户 |
| **用户** | GA4 用浏览器里的 **`_ga` 第一方 Cookie**（客户端 ID）区分，**不是 IP** |
| **没有授权弹窗** | 站点仍会默认写 `_ga`（除非浏览器/插件拦截 Cookie） |
| **VPN** | 换节点**通常不会**单独算新用户；**无痕 / 清 Cookie / 换浏览器** 会 |
| **是不是真人** | 否 — 是「设备+浏览器」近似，同一人两台手机 = 2 用户 |

**欧盟访客**：严格合规应上 Consent Mode + 横幅；未做时法律与 Google 政策另说，技术上仍可能写 Cookie。

### 排除自测（代码 + GA4 后台）

**1. 本地**：`127.0.0.1` / `localhost` **不再发送** GA（已改 `analytics.js`）。

**2. 线上自测时**（任选）：

- 访问一次：`https://yakushimabus.com/?ga_internal=1` → 本浏览器后续访问都带 `traffic_type=internal`
- 取消：`?ga_internal=0`
- 调试：`?ga_debug=1` → GA4 **DebugView** 可见事件（管理 → DebugView）

**3. GA4 后台（一次性，过滤 internal）**

1. [GA4](https://analytics.google.com) → **管理** → **数据流** → 你的网站 → **配置标记设置** → **显示全部**
2. **定义内部流量** → 规则名 `internal` → 条件：`traffic_type` **等于** `internal` → 保存
3. **管理 → 数据设置 → 数据过滤条件** → **创建** → 类型 **内部流量** → 选择刚建的规则 → 过滤行为 **排除** → 状态 **测试**（先看报告）→ 确认无误后改 **有效**

**4. （可选）按 IP 排除**：同上「定义内部流量」里加 IP 规则（填你 VPN/家里常用出口 IP）。

**5. 排除已知爬虫（GA4 内置，建议开启）**

1. **管理 → 数据流** → 你的网站 → **配置标记设置** → **显示全部**
2. 打开 **排除已知机器人和蜘蛛程序的流量** → 保存

仍会有 SEO 工具、云机房探测等漏网之鱼；日报 §2.3–§2.5 已用 **互动 0% + 均时 0s** 从国家维度剔除，不当作真实旅客。

## GA4 关键事件（复盘 P1-5，一次性）

在 [GA4](https://analytics.google.com) → **管理** → **数据展示** → **事件** 中，将下列自定义事件标记为 **关键事件**（Key events）：

| 事件名 | 含义 | 触发位置 |
|--------|------|----------|
| `timetable_search` | 时刻表区间查询 | 首页 `renderResults` |
| `fare_lookup` | 票价查询 | 票价页 `updateFare` |
| `file_download` | PDF 下载/打开 | 各页 PDF 链接 |

操作：事件列表 → 点事件名 → 打开 **标记为关键事件**。标记后可在 **报告 → 互动 → 事件** 与 **转化** 中直接看到功能使用量。

可选一并标记：`guide_filter`（地图筛选）、`open_timetable`（弹窗时刻表）、`site_feedback`（页脚评分）。

## 爬虫流量：怎么读、有没有用

### 为什么「互动 0s + Boardman」≈ 不是真人？

| 信号 | 含义 |
|------|------|
| **互动 0s / 互动率 0%** | GA4 认定会话未「参与」：通常 <10s 即走、只打 1 次 page_view、无滚动/二次点击 |
| **Boardman, Oregon** | 美国 AWS 等 **机房 IP** 的常见地理定位，不是旅客会「路过」的城市 |
| **美国 16 人全 0 互动** | 批量扫描/索引/安全探测，不是 16 个美国旅客 |
| **中国 ~1m43s** | 像朋友圈点开、真在用时刻表 — 与 bot 行对比即筛噪声 |

爱沙尼亚 3 人 0 互动：多半是你 **VPN 自测**（塔林节点）或同类探测，已从「欧盟旅客」判定里排除。

### 被爬到 = 有用吗？

**不等于**「已经有很多人在用」，但 **对发现性有用**：

| 爬虫类型 | 对你站的意义 |
|----------|----------------|
| **Googlebot / Bingbot** | 收录 → 以后 Organic 才有量；GSC「已编入索引」即证明 |
| **GPTBot / Claude / Perplexity**（`robots.txt` 已 Allow） | AI 问答可能引用你的时刻表/票价 — 长尾发现 |
| **SEO 审计、安全扫描** | 噪声，可忽略；别当 KPI |

**可做的利用**（你站已基本具备）：

1. **保持可爬**：静态 HTML、`sitemap.xml`、各页 title/description、JSON-LD
2. **`llms.txt`**：告诉 AI 站点结构与用途（已有）
3. **GSC**：索引正常后盯 **查询词 / 展示**，比 GA4 国家分布更准
4. **不要**为爬虫优化 PV；真人指标看 **可分析用户**（有互动、多页、中国/日本时长）

微信 **不加 UTM** 没问题；朋友圈仍是 Direct，用国家+互动区分即可。

## 指标表

| 日期 | GSC 展示 | GSC 点击 | 平均排名 | 已索引页 | GA4 用户(28d) | GA4 自然(28d) | 备注 |
|------|---------|---------|---------|---------|--------------|--------------|------|
| 2026-05-22 | 0 | 0 | 0.0 | 1/4 | 48 | 0 | 自动拉取 2026-05-22 |
| 2026-05-21 | — | — | — | 待查 | — | — | Round 1 技术优化上线，待 GSC 有数据后回填 |

> **新站预期**：首 1–4 周展示≈0 正常；4–8 周开始出现长尾词（屋久島 バス 時刻表 等）。

## 目标查询词（监控用）

| 优先级 | 查询词 |
|--------|--------|
| P0 | 屋久島 バス 時刻表 / 屋久岛 公交 时刻表 / Yakushima bus timetable |
| P0 | 屋久島 バス 運賃 / 屋久岛 公交 票价 |
| P1 | 鹿児島 屋久島 高速船 時刻表 / 屋久岛 船票 |
| P1 | 宮之浦 バス / 安房 バス 時刻表 |
| P2 | 荒川 登山 バス / 白谷 バス |

## 相关文件

- **优化追踪（飞书主读）**：`docs/seo/SEO-JOURNAL.md` → 飞书「YakuBus SEO 优化追踪」
- **主教程**：`docs/seo/RUNBOOK.md`
- 技术清单：`docs/notes/seo-geo.md`
- 每轮变更：`docs/seo/CHANGELOG.md`
- `sitemap.xml` / `robots.txt` / `llms.txt` / 各页 `<head>`
