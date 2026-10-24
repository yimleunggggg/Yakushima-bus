## 每次修改后的 SEO / GEO 检查

用户要求：每次有功能、页面、文案或交通资料变更，都同步复核 SEO 与 GEO；纯内部变更也运行检查并说明是否影响公开页面。

- 对照本轮差异，核对标题、description、OG/Twitter、三语文案、canonical/hreflang、JSON-LD、内链、sitemap 和 `llms.txt`；只做与变更相关的调整。
- 页面 SEO 文案维护于 `sources/seo-pages.json`。有实质内容变更时更新对应页面的 `modified`，不得每次构建批量刷新日期。交通事实仍来自现有唯一底表，不手抄另一份班次或票价。
- 运行 `python3 scripts/build_seo.py`、`python3 scripts/sync_transport_assets.py` 和 `bash scripts/seo_check.sh`；发布前还需完成 `python3 scripts/build_all.py --validate`，不得绕过已过期的交通复核门禁。
- 保留非官方定位、来源日期和待复核提示；不把资料核查日冒充今日实时状态，不凭空承诺排名、AI 引用或流量提升。
- `/intro/` 保持 noindex 并排除 sitemap；仅预览的 Demo 不进入公开 SEO/GEO。
- 在 BuildTrace 中记录本轮范围、校验结果及发布状态；后续用 GSC/GA4 与可复现的 AI 引用检查观察效果。


- 前端的更新、核查和数据版本标识只显示年月；生效日期、实际出行日、底表精确核查日期、JSON-LD 与 sitemap 保留必要的完整日期，不能用月份破坏班次判断。
- 同一目的地恢复时，分别核对运营商、道路与步道、交通查询/票价/地图/攻略、分销入口及说明，不把部分开放写成全面恢复，也不把商品页面存在写成余位已确认。
