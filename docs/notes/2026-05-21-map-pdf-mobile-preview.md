# 路线图 PDF 移动端图片预览（2026-05-21）

## 问题
手机端打不开/不便看 PDF 外链。

## 方案
- 从官方 PDF 导出 2 页 JPG → `assets/pdf-preview/`（日/英各 2 张）
- 触屏设备（`preferNativePdf()`）在 `/map/` 内嵌图片，保留次要「打开 PDF」链接
- PC 仍用 iframe 内嵌 + 缩放

## 文件
- `pdf-viewer.js` — `PDF_PREVIEW` / `renderPdfMobilePreview`
- `map/index.html` / `styles.css`

## 待办
时刻表 PDF 页数多，暂不导出；若需要可只做首页缩略图。
