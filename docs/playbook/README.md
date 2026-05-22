# Vibe Coding 项目 Playbook

> **Yakushima Bus** 从零到上线的完整过程、架构、踩坑与复用清单。  
> 写给：像作者一样**不会写代码、但会用 AI 对话做产品**的人。

---

## 这套文档解决什么问题

| 你想… | 读这个 |
|--------|--------|
| 快速了解「这个项目怎么长出来的」 | [02-从想法到上线](02-从想法到上线-总流程.md) |
| 看懂技术结构（术语有人话解释） | [03-架构一览](03-架构一览.md) |
| 学 vibe coding 是什么、怎么开始 | [01-vibe-coding是什么](01-vibe-coding是什么.md) |
| 产品功能与数据怎么维护 | [04-产品与数据管线](04-产品与数据管线.md) |
| 域名、上线、花多少钱 | [05-部署与成本](05-部署与成本.md) |
| SEO 自动日报/周报（进阶） | [06-SEO与增长自动化](06-SEO与增长自动化.md) → 链到 [seo/tutorial](../seo/tutorial/README.md) |
| **踩坑、为什么这样选、Alternatives** | [07-踩坑·决策·思考](07-踩坑·决策·思考.md) |
| 做下一个类似工具站，照抄清单 | [08-下一个项目复用清单](08-下一个项目复用清单.md) |
| **自己的私密时间线 / 真实花费** | [PRIVATE_JOURNAL](PRIVATE_JOURNAL.md)（含内部链接，社媒勿发） |

---

## 和仓库里其他文档的关系

```text
docs/playbook/          ← 你在这里：故事 + 架构 + 复用（偏「人读」）
docs/product-intro.md   ← 对外产品介绍（偏「用户读」）
docs/deploy-*.md        ← 部署操作步骤（偏「照做」）
docs/seo/tutorial/      ← SEO 自动化教程（脱敏、可分享）
docs/notes/             ← 开发日记（按日碎片记录）
```

**发社媒推荐链**：[独立教程仓库](https://github.com/yimleunggggg/vibe-coding-static-site-guide)（Vibe Coding 静态工具站使用教程）  
**本仓库副本**：`docs/playbook/` + `docs/seo/tutorial/`  
**勿公开**：`PRIVATE_JOURNAL.md`、`docs/seo/GOOGLE_SETUP.md`（含真实 ID/邮箱）

---

## 术语小词典（后文会反复出现）

| 词 | 人话 |
|----|------|
| **静态站** | 只有 HTML/JS/CSS 文件，没有「服务器程序」；像一本会动的电子书 |
| **GitHub Pages** | GitHub 免费帮你把仓库里的网页挂到网上 |
| **push** | 把本地改动上传到 GitHub；Pages 会自动重新发布 |
| **DNS** | 把 `你的域名.com` 指到 GitHub 的服务器地址 |
| **Cursor / Agent** | 带 AI 的代码编辑器；你说人话，它改文件、跑命令 |
| **Vibe coding** | 用自然语言驱动 AI 写产品，你负责想法、验收、决策 |
| **GitHub Actions** | GitHub 自带的「云端定时打工人」，不用你电脑开机 |
| **GA4** | Google 统计：谁来了、看了哪页 |
| **GSC** | Google Search Console：搜索里有没有被看到、点了没 |
| **OAuth** | 用你自己的 Google 账号授权，让脚本代你读 GSC |
| **服务账号** | 机器用的 Google 假账号，适合 GA4 读数 |
| **Secret** | 存在 GitHub 里的密码/密钥，不会出现在公开代码里 |
| **ntfy** | 免费手机推送，像给自己发一条系统通知 |
| **Resend** | 发邮件的 API，不用自己搭邮箱服务器 |

---

## 一句话总结本项目

**官方 PDF → Python 脚本解析 → 生成数据文件 → 静态网页查询；GitHub 托管；Actions 每天自动写 SEO 日报推送到手机和邮箱。**

案例站：https://yakushimabus.com
