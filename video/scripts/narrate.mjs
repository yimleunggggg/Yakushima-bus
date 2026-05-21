import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const audioDir = path.join(root, "audio");
const scenes = JSON.parse(fs.readFileSync(path.join(__dirname, "scenes.json"), "utf8"));

fs.mkdirSync(audioDir, { recursive: true });

const VOICES = ["Ting-Ting", "Meijia", "Sin-Ji", "Yu-shu"];

function pickVoice() {
  for (const v of VOICES) {
    const test = spawnSync("say", ["-v", v, "测试"], { encoding: "utf8" });
    if (test.status === 0) return v;
  }
  return "Ting-Ting";
}

const voice = pickVoice();
console.log("TTS voice:", voice);

for (const scene of scenes) {
  const aiff = path.join(audioDir, `${scene.id}.aiff`);
  const mp3 = path.join(audioDir, `${scene.id}.mp3`);
  console.log("narrating:", scene.id);

  const say = spawnSync("say", ["-v", voice, "-r", "185", scene.narration, "-o", aiff], {
    encoding: "utf8",
  });
  if (say.status !== 0) {
    console.error("say failed:", say.stderr);
    process.exit(1);
  }

  const ffmpegBin = (await import("@ffmpeg-installer/ffmpeg")).default.path;
  const conv = spawnSync(
    ffmpegBin,
    ["-y", "-i", aiff, "-codec:a", "libmp3lame", "-q:a", "2", mp3],
    { encoding: "utf8" }
  );
  if (conv.status !== 0) {
    console.error("ffmpeg mp3 failed:", conv.stderr);
    process.exit(1);
  }
  fs.unlinkSync(aiff);
}

console.log("Narration complete.");
