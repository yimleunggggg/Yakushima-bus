# 2026-10-23：根据最近修改同步 SEO / GEO

本轮为本地实现，未提交、未推送或部署。改动基于已有的十月交通更新；未把工作区其他尚未提交的改动当成本轮成果。

## 问题与改动

| 原问题 | 本轮处理 |
|---|---|
| 船运 meta 仍写 2026 夏季，而页面已按日期选择季节 | 去掉固定夏季说法，三语摘要改为按日期核对；静态来源区读取高速船季节底表，列出所收录最后一个季节区间及官方入口 |
| `llms.txt`、无脚本攻略保留三月班次数值，含白谷可乘信息 | 删除独立维护的班次表；`llms.txt` 和页尾可见折叠区从交通底表生成，列真实改订日、核查日、复核期限、已记录的停运公告及官方来源 |
| 中文 FAQ 仍写机场→宫之浦 9 班、06:06–19:06 | 改为查询实际出行日与运行条件，不在文案中复制另一份班次 |
| 七个页面的语言、分享与结构化信息覆盖不一致 | `sources/seo-pages.json` 维护七页三语标题/摘要；生成静态默认日文元数据、JSON-LD、hreflang，并在初次加载及切换语言时同步 title/description、OG/Twitter、canonical、schema 与来源区 |
| sitemap 的日期仍为六月，并含 noindex 介绍页 | 仅列七个可索引页面，主 sitemap 包含默认入口和 21 个语言 URL，互相声明四种 alternate；中文 sitemap 列七个中文入口；intro 和预览 Demo 均不加入 |
| 旧检查只搜 meta 是否存在，未覆盖登山/不租车页与事实漂移 | 新门禁检查生成物、元数据、语言 URL、JSON-LD、索引边界、内链及资源哈希；增加三语初次加载/来回切换回归，接入构建与独立 CI |

`dateModified`/sitemap `lastmod` 的 2026-10-23 表示本轮实际页面内容修改日期，不能解读为交通资料今天已核查。后续由 Agent 只在对应页面有实质修改时调整 `sources/seo-pages.json` 的 `modified`；生成脚本不会自动改成当天。

来源区位于页尾折叠块，沿用现有样式；默认日文内容无需 JavaScript 即存在于 HTML，语言版本由现有切换事件呈现。介绍页继续 noindex，未把仅预览的 Explore Demo 加入公开优化。

## 后续每次执行

`AGENTS.md` 与 README 已写明：每次有功能、页面、文案或交通资料变更，复核 SEO/GEO；纯内部变更也运行检查并说明公开影响。

```sh
python3 scripts/build_seo.py
python3 scripts/sync_transport_assets.py
bash scripts/seo_check.sh
node --test tests/seo-metadata.test.js
```

全量构建自动生成 SEO/GEO；`build_all.py --validate` 包含离线检查。`.github/workflows/seo-verify.yml` 对相关 PR/main 更新独立运行检查；本轮未发布该 workflow，不能声称远端 CI 已通过。

## 本轮验证与边界

- `bash scripts/seo_check.sh`：通过。七页、三语、两份 XML、索引边界、官方来源生成内容、页面内链和资源引用一致。
- `node --test tests/*.test.js`：30/30 通过，其中新增 SEO 三语回归 8 项；包括各页面不同初始语言和切回日文。
- `python3 scripts/check_transport_data.py`：非严格一致性通过，保留白谷、松叶与时刻入口三项资料待复核警告。
- `python3 scripts/build_all.py --validate`：SEO 与 106 对票价锚点通过，但交通严格新鲜度检查失败。已有 `reviewAfter=2026-10-16` 过期；没有放宽门禁、延长核查日期或解除停运。
- 本地浏览器实际打开 `/without-car/?lang=zh`，展开来源区，切换 EN：title、description、canonical 与可见来源语言一致；390×844 折叠/展开均无页面横向溢出。
- `git diff --check` 在既有 BuildTrace 原文的 Markdown 尾空格处报错，未重写历史引文来消除它；本轮代码改动单独核对。
- 未访问 GSC/GA4 后台，未声称排名、点击或 AI 引用效果提升；后续效果需真实数据与可重复的引用实验。

## 方法依据

本轮复核了 Google 第一方文档，采用其现有 SEO 原则，无需引入额外框架或第三方代码。

- [AI 搜索与网站](https://developers.google.com/search/docs/appearance/ai-features)：沿用 SEO 基础，重点是可抓取的文本、清楚的内链与内容/结构化数据一致；不要求特殊 AI schema 或额外机器文件。`llms.txt` 仅作本站便利摘要。
- [语言版本](https://developers.google.com/search/docs/specialty/international/localized-versions)：可访问的语言 URL、完整且相互对应的 hreflang。
- [Sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)：列希望收录的 URL，lastmod 对应实质页面变化。


## 2026-10-24 复核与后续修正

本地实现已迁移到最新 main 的隔离分支复核。查到官方部分复开与白谷公交恢复公告后，同步了共享状态、交通/票价/地图/登山/攻略/分销及月份标识。严格资料门禁已在实际重新读取官方原件、公告和哈希验证后通过，不再是上一节所述的过期阻断状态。详见 [本轮复核报告](2026-10-24-shiratani-seo-review.md)。此前“同一链接返回新版内容”的初步判断不成立：日英 PDF 下载后的哈希均与库存一致，内部标题的 10.19 不是页面左上角的正式改订日期；正式版本仍为 2026 年 10 月版。
