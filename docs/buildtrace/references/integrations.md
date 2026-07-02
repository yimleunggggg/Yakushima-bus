# BuildTrace 外部时间线接入

读取时机：当用户要求叠加 GA4、GitHub、Vercel、PostHog、Stripe、部署、交易、事件、流量、收入、错误、评论、客服、App Store 或其他外部时间线时读取本文件。

## 核心原则

外部时间线只回答“某天发生了什么事实”，不回答“人为什么这样做”。

BuildTrace 的因果链应该这样分层：

- 项目节点：人为什么想做、做了什么、技术上怎么做、当时证据是什么。
- 外部事件：部署、PR、commit、流量、事件、收入、支付、错误、反馈等按时间发生的事实。
- 结果回看：人在看完数据后写下“有效、无效、不确定、为什么”的判断。

不要因为两个事件日期接近就写成因果。先写“同一时间段出现”，再由用户或证据确认。

## 接入层级

### 1. 手填事件

适合个人项目、早期 MVP、无法授权后台、只需要补几个关键日期。

记录格式：

```json
{
  "source": "manual",
  "date": "2026-06-30",
  "kind": "metric-note",
  "title": "自然搜索开始有连续访问",
  "value": "连续 3 天每天都有自然搜索访问",
  "url": "",
  "note": "用户从 GA4/GSC 手动观察后补充"
}
```

### 2. 文件导入

适合对外发布的通用版本，因为不同用户不一定有同一套账号或权限。

支持 CSV/JSON 的常见列：

- `source`: ga4, github, vercel, posthog, stripe, manual, sentry, app-store 等
- `date`: YYYY-MM-DD
- `kind`: metric, event, deployment, commit, pull-request, issue, payment, refund, error, feedback, note
- `title`: 人能读懂的一句话
- `value`: 数值、状态、版本号、金额、事件数
- `url`: 后台链接、PR、部署、截图或报告链接
- `note`: 为什么和这个节点有关

导入时先做来源报告：文件名、行数、日期范围、字段映射、跳过了哪些无效行。

### 3. CLI 或连接器

适合开发者或团队环境。

可用时优先读取：

- GitHub：本地 git、`gh`、GitHub connector，用于 PR、issue、release、Actions、commit。
- Vercel：Vercel CLI/API 或导出的 deployment 列表，用于部署、环境、域名、回滚。
- PostHog：导出的事件、漏斗、实验结果。
- Stripe：导出的 event、payment、checkout、subscription、refund 事件。
- GA4/GSC：导出的报告或授权 API 结果。

读取前说明权限边界。不要读取 secrets、token、客户 PII、完整卡号、完整邮箱、完整用户标识。

### 4. 直接 API

只在用户明确授权、环境已有凭证、或连接器已安装时使用。

API 结果必须压缩成时间线事实，不要把大量原始数据写进 `nodes.json`。

## 常见来源如何映射

### GA4

用途：看流量、来源、页面、关键事件、漏斗变化。

建议事件：

- 某天某渠道访问明显变化
- 某页面浏览或关键事件变化
- 新埋点开始有数据
- 内部流量过滤或数据口径变化

不要写入个人级用户数据。优先存聚合值和报告链接。

### GitHub

用途：还原代码事实和协作事实。

建议事件：

- commit、PR merge、release、tag
- issue 创建/关闭
- workflow 失败或恢复
- 重要分支或回滚

GitHub 能支持“做了什么”，不能支持“为什么做”，除非 PR/issue/commit message 明确写了动机。

### Vercel

用途：还原上线、预览、生产部署、回滚、环境变量变化的时间。

建议事件：

- production deployment
- preview deployment
- rollback
- domain/config change
- build failure / fix

Vercel 部署时间不是功能完成时间。若功能在多次 commit 后才上线，节点日期和部署事件应分开。

### PostHog

用途：产品事件、漏斗、实验、session replay 证据。

建议事件：

- 新事件出现
- 漏斗转化变化
- feature flag 开启/关闭
- 实验开始/结束
- 关键 session replay 或用户反馈链接

不要把完整 replay、个人属性或敏感事件明细写进节点；存链接和摘要。

### Stripe

用途：交易、订阅、退款、支付失败、价格策略变化。

建议事件：

- 首次成功支付
- checkout/payment link 上线
- 退款或支付失败集中出现
- 价格、套餐、优惠码、订阅变更
- webhook 修复或支付流程事故

不要写完整客户信息、邮箱、卡信息或发票明细。只写聚合事实、事件 id、金额区间或后台链接。

## 什么时候值得接入

应该接入：

- 用户正在复盘数据变化。
- 项目已经上线并有真实流量、交易、部署或用户事件。
- 用户问“某天为什么涨/跌/坏了/有人付费了”。
- 团队需要把多个 AI 工具、部署、后台数据合在一条时间线上。

不必接入：

- 项目还在纯原型阶段，没有真实数据。
- 用户只是想记录一个设计/产品判断。
- 数据源授权成本高，当前只需要一两条手填事实。
- 事件太噪，导入后不能帮助判断。

## 手填内容是必要能力

手填不是低级方案，而是这个系统的人性核心。

必须允许用户手填：

- 原话和动机
- 当时的顾虑和取舍
- 外部后台看到的关键数值
- 无法授权的数据摘要
- 复盘后的判断和经验
- 对自动推断的纠错

用户手填应优先短句，不要求完整报告。

## 外部事件 JSON 形状

可以写在顶层 `externalEvents`，也可以写在单个节点的 `externalEvents`。

```json
{
  "externalEvents": [
    {
      "id": "2026-06-30-vercel-prod-deploy",
      "source": "vercel",
      "date": "2026-06-30",
      "kind": "deployment",
      "title": "生产环境部署",
      "value": "deployment ready",
      "url": "https://...",
      "note": "对应中文落地页改动上线"
    }
  ]
}
```

顶层事件用于独立时间线；节点内事件用于说明这个节点的直接证据或后续结果。
