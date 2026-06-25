# Klook / 联盟链接策略（2026-05-20）

## 状态：**已上线**（2026-05-20）

配置：`affiliate-data.js` + `affiliate-ui.js`

| 用途 | adid | 页面位置 |
|------|------|----------|
| 高速船往返 | 1316221 | `/ferry/` jetfoil 卡次要按钮 |
| 徒步一日游 | 1316225 | `/trekking/` 绳文杉卡下 |
| 屋久岛目的地 | 1316230 | `/without-car/` 预订参考 |
| 鹿儿岛目的地 | 1316233 | `/without-car/` 预订参考 |
| 九州 JR Pass | 1316236 | `/ferry/` 铁路小节 |
| 7日全日本 Pass | 1316237 | `/ferry/` 铁路小节 |

- 全站页脚：`site-chrome.js` 联盟披露
- GA4：`affiliate_click`（partner, adid, placement）
- 图：`/images/affiliate/jetfoil-klook.png`、`hiking-klook.png`

## Viator（pid=P00307180）

| 产品 | 代码 | 页面 | 评分/评价数（需定期核对） |
|------|------|------|-------------------------|
| 高速船一日游+白谷徒步 | 43454P739 | ferry, trekking, without-car | 5.0 / 56 |
| 私人环岛观光 | 43454P373 | without-car, map | 4.9 / 28 |
| 海龟浮潜 3h | 306889P1 | without-car, map | 4.9 / 24 |

## 徒步/体验补量平台（未接入）

| 平台 | 屋久岛徒步 | 注册 | 说明 |
|------|-----------|------|------|
| **GetYourGuide** | ✅ 绳文杉日归徒步 | Awin / Travelpayouts | 佣金 ~7–8%，SKU 比 Viator 多 |
| **Veltra** | ✅ 绳文杉+白谷+浮潜最全 | partner.veltra.com (ShareASale) | 日本本地最深，8% 起 |
| **Klook** | ✅ 150846 已挂 | 已有 | 中文转化好 |
| **ActivityJapan** | ✅✅ 100+ 徒步 | 需商务直签 | 库存最深，无自助联盟 |
| **Viator** | ⚠️ 白谷/观光多，绳文杉少 | 已有 P00307180 | 海类体验较全 |
