# 介绍页修正（2026-05-26）

- **布局**：视频区与卡片重叠已修；视频区缩小（max ~280px 宽）。
- **Vibe Coding / 顶部 CTA**：已移除；三语字样从导语与卡片标题去掉。
- **视频**：英文旁白 `yakushima-bus-demo.mp4`；竖版封面 `yakushima-bus-demo-poster.jpg`（不再用横版 og-image）。
- **快进**：去掉 wrap 的 `overflow:hidden`（避免裁切控件）；`preload=auto`。若仍不能拖进度条，需对 MP4 做 faststart（见 `assets/video/README.md`）。
- **未 push 正式站**。
