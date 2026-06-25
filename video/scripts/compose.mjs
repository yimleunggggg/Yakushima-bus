import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import { VIDEO_W, VIDEO_H, OUT_NAME } from "./config.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const rawDir = path.join(root, "raw");
const audioDir = path.join(root, "audio");
const titlesDir = path.join(root, "titles");
const workDir = path.join(root, "work");
const outDir = path.join(root, "out");
const scenes = JSON.parse(fs.readFileSync(path.join(__dirname, "scenes.json"), "utf8"));

const FFMPEG = ffmpegInstaller.path;
const FONT_CANDIDATES = [
  "/System/Library/Fonts/Hiragino Sans GB.ttc",
  "/System/Library/Fonts/PingFang.ttc",
  "/Library/Fonts/Arial Unicode.ttf",
];
const FONT_MAIN = (
  process.env.VIDEO_FONT ||
  FONT_CANDIDATES.find((p) => fs.existsSync(p)) ||
  FONT_CANDIDATES[0]
).replace(/ /g, "\\ ");

function run(cmd, args, allowFail = false) {
  const r = spawnSync(cmd, args, { encoding: "utf8", maxBuffer: 20 * 1024 * 1024 });
  if (r.status !== 0 && !allowFail) throw new Error(`${cmd} ${args.join(" ")}\n${r.stderr}`);
  return (r.stdout || "") + (r.stderr || "");
}

function probeDuration(file) {
  const out = run(FFMPEG, ["-i", file], true);
  const m = out.match(/Duration:\s(\d+):(\d+):([\d.]+)/);
  if (!m) return 0;
  return parseInt(m[1], 10) * 3600 + parseInt(m[2], 10) * 60 + parseFloat(m[3]);
}

function esc(text) {
  return String(text)
    .replace(/\\/g, "\\\\")
    .replace(/:/g, "\\:")
    .replace(/'/g, "'\\''")
    .replace(/,/g, "\\,")
    .replace(/&/g, "\\&")
    .replace(/%/g, "\\%");
}

/** 底部中文字幕条 + 顶栏章节标题 */
function portraitOverlayFilters(titleBar, subBar, subtitleZh) {
  const sub = esc(subtitleZh || "");
  return [
    `drawbox=x=0:y=0:w=iw:h=64:color=0x143a35@0.94:t=fill`,
    `drawtext=fontfile=${FONT_MAIN}:text='${titleBar}':fontsize=26:fontcolor=0xf4f1ea:x=32:y=14`,
    `drawtext=fontfile=${FONT_MAIN}:text='${subBar}':fontsize=17:fontcolor=0x8f9a3a:x=32:y=40`,
    `drawbox=x=24:y=h-108:w=iw-48:h=84:color=0x081816@0.88:t=fill`,
    `drawbox=x=24:y=h-108:w=iw-48:h=3:color=0x5a8299@0.9:t=fill`,
    `drawtext=fontfile=${FONT_MAIN}:text='${sub}':fontsize=30:fontcolor=0xf4f1ea:x=(w-text_w)/2:y=h-62:shadowcolor=0x000000@0.5:shadowx=1:shadowy=1`,
  ].join(",");
}

function scalePad() {
  return [
    `scale=${VIDEO_W}:${VIDEO_H}:force_original_aspect_ratio=decrease`,
    `pad=${VIDEO_W}:${VIDEO_H}:(ow-iw)/2:(oh-ih)/2:color=0x081816`,
    "setsar=1",
    "fps=30",
  ].join(",");
}

function makeTitleSegment(scene, duration) {
  const png = path.join(titlesDir, `${scene.id}.png`);
  const audio = path.join(audioDir, `${scene.id}.mp3`);
  const out = path.join(workDir, `${scene.id}.mp4`);
  const sub = esc(scene.subtitleZh || scene.subtitle || "");

  const frames = Math.ceil(duration * 30);
  const vf = [
    scalePad(),
    `zoompan=z='min(zoom+0.0006,1.06)':d=${frames}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=${VIDEO_W}x${VIDEO_H}:fps=30`,
    `drawbox=x=24:y=h-108:w=iw-48:h=84:color=0x081816@0.88:t=fill`,
    `drawbox=x=24:y=h-108:w=iw-48:h=3:color=0x5a8299@0.9:t=fill`,
    `drawtext=fontfile=${FONT_MAIN}:text='${sub}':fontsize=32:fontcolor=0xf4f1ea:x=(w-text_w)/2:y=h-62`,
  ].join(",");

  run(FFMPEG, [
    "-y",
    "-loop",
    "1",
    "-i",
    png,
    "-i",
    audio,
    "-vf",
    vf,
    "-t",
    String(duration),
    "-c:v",
    "libx264",
    "-preset",
    "medium",
    "-crf",
    "20",
    "-pix_fmt",
    "yuv420p",
    "-c:a",
    "aac",
    "-b:a",
    "192k",
    "-shortest",
    out,
  ]);
  return out;
}

function makeRecordSegment(scene, duration) {
  const webm = path.join(rawDir, `${scene.recordId}.webm`);
  const audio = path.join(audioDir, `${scene.id}.mp3`);
  const out = path.join(workDir, `${scene.id}.mp4`);
  const titleBar = esc(scene.title);
  const subBar = esc(scene.subtitle || "");
  const overlay = portraitOverlayFilters(titleBar, subBar, scene.subtitleZh);
  const filter = `[0:v]${scalePad()},${overlay}[vout]`;

  run(FFMPEG, [
    "-y",
    "-i",
    webm,
    "-i",
    audio,
    "-filter_complex",
    filter,
    "-map",
    "[vout]",
    "-map",
    "1:a",
    "-t",
    String(duration),
    "-c:v",
    "libx264",
    "-preset",
    "medium",
    "-crf",
    "20",
    "-pix_fmt",
    "yuv420p",
    "-c:a",
    "aac",
    "-b:a",
    "192k",
    "-shortest",
    out,
  ]);
  return out;
}

function concatSegments(segments, output) {
  const list = path.join(workDir, "concat.txt");
  fs.writeFileSync(list, segments.map((s) => `file '${s.replace(/'/g, "'\\''")}'`).join("\n"));
  run(FFMPEG, ["-y", "-f", "concat", "-safe", "0", "-i", list, "-c", "copy", output]);
}

function writeSrt(segments, sceneDurations) {
  let t = 0;
  const lines = [];
  let n = 1;
  scenes.forEach((scene, i) => {
    const dur = sceneDurations[i];
    const start = formatSrt(t);
    t += dur;
    const end = formatSrt(t);
    const zh = scene.subtitleZh || "";
    if (!zh) return;
    lines.push(String(n++), `${start} --> ${end}`, zh, "");
  });
  const srtPath = path.join(outDir, OUT_NAME.replace(/\.mp4$/, ".zh.srt"));
  fs.writeFileSync(srtPath, lines.join("\n"), "utf8");
  console.log("subtitles:", srtPath);
}

function formatSrt(sec) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.floor(sec % 60);
  const ms = Math.round((sec % 1) * 1000);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")},${String(ms).padStart(3, "0")}`;
}

function addFade(input, output) {
  const dur = probeDuration(input);
  const fadeOut = Math.max(0, dur - 1.1);
  run(FFMPEG, [
    "-y",
    "-i",
    input,
    "-vf",
    `fade=t=in:st=0:d=0.8,fade=t=out:st=${fadeOut}:d=1`,
    "-c:v",
    "libx264",
    "-preset",
    "medium",
    "-crf",
    "19",
    "-pix_fmt",
    "yuv420p",
    "-c:a",
    "aac",
    "-b:a",
    "192k",
    output,
  ]);
}

async function main() {
  [workDir, outDir].forEach((d) => fs.mkdirSync(d, { recursive: true }));

  const segments = [];
  const durations = [];
  let total = 0;

  for (const scene of scenes) {
    const audio = path.join(audioDir, `${scene.id}.mp3`);
    if (!fs.existsSync(audio)) throw new Error(`Missing audio: ${audio}`);
    const audioDur = probeDuration(audio);
    const duration = Math.max(audioDur + 0.5, scene.durationHint || audioDur);

    console.log(`compose ${scene.id} (${duration.toFixed(1)}s)`);
    const seg =
      scene.type === "title" ? makeTitleSegment(scene, duration) : makeRecordSegment(scene, duration);
    segments.push(seg);
    durations.push(duration);
    total += duration;
  }

  writeSrt(segments, durations);

  const merged = path.join(workDir, "merged.mp4");
  concatSegments(segments, merged);
  const final = path.join(outDir, OUT_NAME);
  addFade(merged, final);

  console.log(`\nDone: ${final}`);
  console.log(`Size: ${VIDEO_W}×${VIDEO_H} (3:4) · ~${Math.round(total)}s`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
