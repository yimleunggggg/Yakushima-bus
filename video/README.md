# Yakushima Bus 产品讲解视频

基于 **main 最新 commit**（`df9fff9`）自动生成的中文产品演示片，约 **4.2 分钟**。

## 成品

- **文件**：[`out/yakushima-bus-demo-zh.mp4`](out/yakushima-bus-demo-zh.mp4)
- **分辨率**：1920×1080
- **语言**：中文旁白（macOS Ting-Ting TTS）

## 内容结构

| 章节 | 时长 | 要点 |
|------|------|------|
| Hook | ~28s | 屋久岛公交痛点：时刻表密、换乘乱、多运营商 |
| 产品介绍 | ~22s | 独立三语静态工具，官方 PDF 数据 |
| 下一班车 | ~35s | 预设区间、倒计时、JST 实时钟 |
| 完整时刻表 | ~32s | 运营商色标、日种切换、筛选 |
| 三语切换 | ~24s | JA/ZH/EN 站名检索 |
| 路线图 & 运价 | ~38s | 桌面 PDF 内嵌 + **移动端 JPG 预览**（最新 commit） |
| 上岛交通 | ~30s | 船/渡轮/多日券 |
| 数据可信 | ~26s | 官方来源、校验、免责声明 |
| 结尾 | ~18s | CTA + 联系方式 |

## 重新生成

```bash
# 终端 1：本地静态服务
cd .. && python3 -m http.server 8899

# 终端 2：一键流水线
cd video
npm install
npx playwright install chromium
npm run narrate          # 旁白 TTS
VIDEO_SKIP_SERVER=1 VIDEO_BASE_URL=http://127.0.0.1:8899 npm run record
npm run compose          # 合成 MP4
```

或 `npm run build`（会自动起 8765 端口服务；若端口占用请改用上面方式）。

## 自定义

- **旁白/章节**：编辑 [`scripts/scenes.json`](scripts/scenes.json)
- **录制动作**：编辑 [`scripts/record.mjs`](scripts/record.mjs)
- **标题卡样式**：编辑 [`titles/card.html`](titles/card.html)
- **合成参数**：编辑 [`scripts/compose.mjs`](scripts/compose.mjs)

## 参考 Skills

- `supercent-io/skills-template@remotion-video-production`（Remotion 程序化视频，本次用 Playwright+ffmpeg 轻量实现）
- `remotion-dev/skills@remotion-best-practices`（若需更精细动效可迁移至 Remotion）

## 后续可提升

- 替换 TTS 为真人配音或 ElevenLabs
- 加背景音乐（需 royalty-free 音轨）
- 用 Remotion 做章节转场、文字动画
- 英/日版旁白：复制 `scenes.json` 为 `scenes-en.json` 等
