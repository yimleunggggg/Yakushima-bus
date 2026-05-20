# PDF 列坐标探测（2026-05-20）

## 结论

- **平日/土曜/日祝** 在 `taneyaku-20260301.pdf` 中**无法**作为文本提取（疑为图形表头），不能靠 OCR 自动识别日种。
- 可用 **PyMuPDF 时刻 x 坐标聚类** 校验列数，与 `scripts/lib/day_columns.py` 手工映射一致：
  - 西向（20 宫之浦港）：**14 列** = 10 平日 + 2 土曜 + 2 日祝
  - 东向（99 Hotel Yakushima）：**13 列** = 9 平日 + 2 土曜 + 2 日祝

## 复现

```bash
python3 scripts/probe_pdf_columns.py
```

依赖：`pymupdf`（已装）。退出码 0 = 列数与 `day_columns.py` 一致。

## 说明

- 日种分配仍以 `day_columns.py` 为准；探测脚本仅用于 PDF 改订后快速核对。
- 上次 pdfplumber / pymupdf 后台任务因超时中止，现脚本约 0.4s 完成。
