import { spawnSync, spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const rawDir = path.join(root, "raw");
const audioDir = path.join(root, "audio");
const titlesDir = path.join(root, "titles");
const workDir = path.join(root, "work");
const outDir = path.join(root, "out");
const scenes = JSON.parse(fs.readFileSync(path.join(__dirname, "scenes.json"), "utf8"));

const FFMPEG = ffmpegInstaller.path;
const FONT = "/System/Library/Fonts/Hiragino Sans GB.ttc".replace(/ /g, "\\ ");

function run(cmd, args, allowFail = false) {
  const r = spawnSync(cmd, args, { encoding: "utf8" });
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
  return text
    .replace(/\\/g, "\\\\")
    .replace(/:/g, "\\:")
    .replace(/'/g, "\\'")
    .replace(/\[/g, "\\[")
    .replace(/,/g, "\\,")
    .replace(/&/g, "\\&");
}

function makeTitleSegment(scene, duration) {
  const png = path.join(titlesDir, `${scene.id}.png`);
  const audio = path.join(audioDir, `${scene.id}.mp3`);
  const out = path.join(workDir, `${scene.id}.mp4`);
  const sub = esc(scene.narration.slice(0, 42) + (scene.narration.length > 42 ? "…" : ""));

  const frames = Math.ceil(duration * 30);
  const vf = [
    "scale=1920:1080:force_original_aspect_ratio=decrease",
    "pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=0x081816",
    `zoompan=z='min(zoom+0.0008,1.08)':d=${frames}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1920x1080:fps=30`,
    `drawtext=fontfile=${FONT}:text='${sub}':fontsize=28:fontcolor=white@0.85:x=(w-text_w)/2:y=h-120:line_spacing=8`,
  ].join(",");

  run(FFMPEG, [
    "-y",
    "-loop", "1", "-i", png,
    "-i", audio,
    "-vf", vf,
    "-t", String(duration),
    "-c:v", "libx264", "-preset", "medium", "-crf", "20", "-pix_fmt", "yuv420p",
    "-c:a", "aac", "-b:a", "192k",
    "-shortest",
    out,
  ]);
  return out;
}

function makeRecordSegment(scene, duration) {
  const isMobile = scene.viewport === "both";
  const webmDesktop = path.join(rawDir, `${scene.recordId}-desktop.webm`);
  const webm = fs.existsSync(webmDesktop) ? webmDesktop : path.join(rawDir, `${scene.recordId}.webm`);
  const audio = path.join(audioDir, `${scene.id}.mp3`);
  const out = path.join(workDir, `${scene.id}.mp4`);

  let mobileClip = "";
  const webmMobile = path.join(rawDir, `${scene.recordId}-mobile.webm`);
  if (isMobile && fs.existsSync(webmMobile)) {
    mobileClip = path.join(workDir, `${scene.id}-mobile-raw.mp4`);
    run(FFMPEG, [
      "-y", "-i", webmMobile,
      "-vf", "scale=640:1280:force_original_aspect_ratio=decrease,pad=640:1280:(ow-iw)/2:(oh-ih)/2:color=0x081816,fps=30",
      "-an", "-c:v", "libx264", "-preset", "fast", "-crf", "22", "-pix_fmt", "yuv420p",
      mobileClip,
    ]);
  }

  const titleBar = esc(scene.title);
  const subBar = esc(scene.subtitle || "");

  let filter;
  if (mobileClip) {
    filter = [
      "[0:v]scale=1180:900:force_original_aspect_ratio=decrease,pad=1180:900:(ow-iw)/2:(oh-ih)/2:color=0x0f2824,setsar=1,fps=30[desk]",
      "[1:v]scale=420:-1,pad=420:900:(ow-iw)/2:(oh-ih)/2:color=0x081816,setsar=1,fps=30[mob]",
      "[desk][mob]hstack=inputs=2:shortest=1[stack]",
      `[stack]pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=0x081816,drawbox=x=0:y=0:w=iw:h=72:color=0x143a35@0.92:t=fill,drawtext=fontfile=${FONT}:text='${titleBar}':fontsize=34:fontcolor=0xf4f1ea:x=48:y=22,drawtext=fontfile=${FONT}:text='${subBar}':fontsize=22:fontcolor=0x8f9a3a:x=48:y=58[vout]`,
    ].join(";");
  } else {
    filter = [
      "[0:v]scale=1920:1080:force_original_aspect_ratio=decrease,",
      "pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=0x081816,",
      "setsar=1,fps=30,",
      `drawbox=x=0:y=0:w=iw:h=72:color=0x143a35@0.92:t=fill,`,
      `drawtext=fontfile=${FONT}:text='${titleBar}':fontsize=34:fontcolor=0xf4f1ea:x=48:y=22,`,
      `drawtext=fontfile=${FONT}:text='${subBar}':fontsize=22:fontcolor=0x8f9a3a:x=48:y=58[vout]`,
    ].join("");
  }

  const args = ["-y", "-i", webm];
  if (mobileClip) args.push("-i", mobileClip);
  args.push(
    "-i", audio,
    "-filter_complex", filter,
    "-map", "[vout]", "-map", `${mobileClip ? 2 : 1}:a`,
    "-t", String(duration),
    "-c:v", "libx264", "-preset", "medium", "-crf", "20", "-pix_fmt", "yuv420p",
    "-c:a", "aac", "-b:a", "192k",
    "-shortest",
    out,
  );
  run(FFMPEG, args);
  return out;
}

function concatSegments(segments, output) {
  const list = path.join(workDir, "concat.txt");
  fs.writeFileSync(list, segments.map((s) => `file '${s.replace(/'/g, "'\\''")}'`).join("\n"));
  run(FFMPEG, [
    "-y", "-f", "concat", "-safe", "0", "-i", list,
    "-c", "copy", output,
  ]);
}

function addFade(output) {
  const final = path.join(outDir, "yakushima-bus-demo-zh.mp4");
  run(FFMPEG, [
    "-y", "-i", output,
    "-vf", "fade=t=in:st=0:d=1,fade=t=out:st=" + (probeDuration(output) - 1.2) + ":d=1.2",
    "-c:v", "libx264", "-preset", "medium", "-crf", "19", "-pix_fmt", "yuv420p",
    "-c:a", "aac", "-b:a", "192k",
    final,
  ]);
  return final;
}

async function main() {
  [workDir, outDir].forEach((d) => fs.mkdirSync(d, { recursive: true }));

  const segments = [];
  let total = 0;

  for (const scene of scenes) {
    const audio = path.join(audioDir, `${scene.id}.mp3`);
    if (!fs.existsSync(audio)) throw new Error(`Missing audio: ${audio}`);
    const audioDur = probeDuration(audio);
    const duration = Math.max(audioDur + 0.8, scene.durationHint || audioDur);

    console.log(`compose ${scene.id} (${duration.toFixed(1)}s)`);
    const seg =
      scene.type === "title"
        ? makeTitleSegment(scene, duration)
        : makeRecordSegment(scene, duration);
    segments.push(seg);
    total += duration;
  }

  const merged = path.join(workDir, "merged.mp4");
  concatSegments(segments, merged);
  const final = addFade(merged);

  console.log(`\nDone: ${final}`);
  console.log(`Total duration: ~${Math.round(total)}s (${(total / 60).toFixed(1)} min)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
