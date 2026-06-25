# 产品介绍与 SEO 内链更新（2026-06-25）

## 做了什么
- `intro-data.js`：7 张功能卡（时刻表 / 运价 / 地图 / 船运 / 登山 / 不租车 / 来源），对齐当前功能
- `intro/index.html`：功能链自带 `?lang=`；meta 关键词；`intro-v11` / `chrome-v10`
- `site-chrome.js`：页脚加「地图」；首页/运价/介绍 cross 链到 `/without-car/`（不租车长尾词）
- `sitemap.xml`：7 条索引 URL + hreflang，`lastmod` 2026-06-25
- `llms.txt`：补全 guide / trekking / without-car
- `without-car-data.js`：工具区加登山链

## SEO 依据（GSC/GA4 2026-06-24）
- 自然搜索约 66% 会话；着陆以 `/`、`/map/` 为主
- 日本访客互动率高 → 标题/内链保留「屋久島バス時刻表」「運賃」
- `/without-car/` 承接「レンタカーなし / 不租车」；`/intro/` 仍 `noindex`

## 待办
- GSC OAuth 失效需手动续期（见 GOOGLE_SETUP.md）
- 部署后在 GSC 对 `/guide/`、`/without-car/` 请求编入索引（若 NEUTRAL）
