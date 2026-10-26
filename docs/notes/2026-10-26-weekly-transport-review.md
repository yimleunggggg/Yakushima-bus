# 2026-10-26 每周交通资料复核

本轮从 main `9f46c314b9d082b3f8621499a49334b159effa65` 的隔离副本复核，仅维护已实际检查的核查信息和派生资产。未确认新的班次、票价或开放范围变化；不把核查日解释为实时运行状态。

## 已核对的官方来源

- [观光协会交通入口](https://yakukan.jp/on-island.html)仍指向现行日英公交与运价 PDF。重新下载五份原件，其 SHA-256 均与本站底表/镜像一致：日文公交 `f23cb07f…`、英文公交 `0c8dbc4a…`、松叶公交 `0f11b9af…`、日文运价 `9a1bec73…`、英文运价 `f80acfdf…`。同时读取英文时刻内容并核对现行主线与白谷支线；保留 10 月改订和原有适用范围。
- [园区管理方](https://y-rekumori.com/)、[协会入山公告](https://yakukan.jp/topics/19316.html)与[种屋交通](https://www.iwasaki-corp.com/kagoshima_kotsu/)确认白谷部分开放、种屋白谷线 10/18 起恢复；部分步道仍封闭。[松叶交通](https://yakushima.co.jp/route_bus/)白谷线仍标停运，不能混同运营商。
- [屋久岛町道路公告](https://www.town.yakushima.kagoshima.jp/kurashi_tetsuzuki/doro_kotsu/2836.html)的桥梁检查计划仍覆盖 10/16–28；本周 10/26 宫之浦汤川桥、10/27 一凑稚儿见桥、10/28 一凑天幸桥，时间和绕行以官方原文为准。保留既有公告及适用终日，没有扩大封闭范围。
- [屋久岛2号渡轮](https://ferryyakusima2.com/timetable)仍列 08:30–12:30、13:30–17:40，成人/儿童二等 ¥7,000/¥3,450、一等 ¥9,500/¥4,750。[7–11 月停航日](https://ferryyakusima2.com/news/10207)和[12 月至 2027 年 1 月停航日](https://ferryyakusima2.com/news/15420)与本站已有日历一致；原文一月笔误的既有说明保留。

## 未完成的来源复核

[高速船官方时刻及运价页](https://www.tykousoku.jp/fare_time/)经直接访问/代理抓取均未取得当前完整正文（403/抓取失败），浏览器读取亦超时。搜索缓存不能证明本周现况，因此不修改高速船班次、票价、checkedAt 或季节适用期。搜索缓存疑似包含多个季节表，不能据摘要将旧季节数值覆盖冬季表。

## 同步范围和验证

已复核的公交/运价/现行告示及渡轮核查日更新为 10/26，当前公交与告示的下一次周复核设为 11/2；已结束的历史停运记录原样保留。PDF 内容和预览无需替换。同步来源数据、交通状态、渡轮派生表和 llms/页面资源哈希。SEO 标题、description、OG/Twitter、三语、canonical/hreflang、JSON-LD、内链和 sitemap 通过既有生成/检查；仅核查元数据变化不批量刷新页面 modified，intro 继续 noindex。

完整校验首次发现白谷测试将 checkedAt 固定为 10/24；改为校验它与唯一底表一致且仍使用完整 ISO 日期，保留生效日及运营规则断言。修正后 build_seo、sync_transport_assets、seo_check、build_all --validate、41 项 Node 回归和 1 项 Python SEO 生成器测试通过；106 对票价锚点、972 时刻单元、84 站行、34 趟及 17 个视觉锚点通过。严格门禁保持原逻辑；本地通过不等于已发布，发布与线上核对另以提交及部署记录为准。
