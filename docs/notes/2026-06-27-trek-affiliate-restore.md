# 登山页分销区再现（2026-06-27）

## 原因
1. 脚本名 `affiliate-*.js` 易被广告拦截器屏蔽 → `AffiliateUI` 未加载，面板保持 `hidden`。
2. 移动端 `details` 默认折叠，分销卡片在折叠体内不可见。

## 修复
- 重命名：`partner-data.js` / `partner-ui.js`（登山/船运/不租车页已切换）
- 分销 `details` 加 `open`，移动端默认展开
- `.trek-affiliate-panel` 去掉 HTML 初始 `hidden`，由 JS 在无内容时隐藏

## 验证
硬刷新 `/trekking/?lang=zh`，登山季节与路线推荐之间应见「屋久岛当地体验 · 一日游」及 Klook/Viator 卡片。
