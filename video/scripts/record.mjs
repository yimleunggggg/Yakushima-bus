import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";
import { BASE, VIDEO_W, VIDEO_H } from "./config.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const rawDir = path.join(root, "raw");
const titlesDir = path.join(root, "titles");
const scenes = JSON.parse(fs.readFileSync(path.join(__dirname, "scenes.json"), "utf8"));

const serverProc = process.env.VIDEO_SKIP_SERVER
  ? null
  : spawn("python3", ["-m", "http.server", "8765"], {
      cwd: path.join(root, ".."),
      stdio: "ignore",
    });

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function waitForServer(url, tries = 40) {
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, { method: "HEAD" });
      if (res.ok) return;
    } catch {
      try {
        const res = await fetch(url);
        if (res.ok) return;
      } catch {}
    }
    await sleep(500);
  }
  throw new Error(`Server not ready: ${url}`);
}

async function pickOption(page, text) {
  const opt = page.locator('li[role="option"]', { hasText: new RegExp(text, "i") }).first();
  if (await opt.count()) await opt.click();
  else await page.locator('li[role="option"]').first().click();
}

async function fillPicker(page, inputSel, query) {
  await page.locator(inputSel).click();
  await sleep(300);
  await page.locator(inputSel).fill("");
  await page.locator(inputSel).pressSequentially(query, { delay: 60 });
  await sleep(500);
  await pickOption(page, query);
  await sleep(800);
}

async function renderTitleCards(page) {
  for (const scene of scenes.filter((s) => s.type === "title")) {
    const cardUrl =
      `file://${path.join(titlesDir, "card.html")}` +
      `?title=${encodeURIComponent(scene.title)}` +
      `&subtitle=${encodeURIComponent(scene.subtitle || "")}`;
    await page.setViewportSize({ width: VIDEO_W, height: VIDEO_H });
    await page.goto(cardUrl);
    await sleep(400);
    const out = path.join(titlesDir, `${scene.id}.png`);
    await page.screenshot({ path: out, type: "png" });
    console.log("title card:", out);
  }
}

async function recordScene(browser, scene) {
  const outPath = path.join(rawDir, `${scene.recordId}.webm`);
  const context = await browser.newContext({
    viewport: { width: VIDEO_W, height: VIDEO_H },
    deviceScaleFactor: 2,
    recordVideo: { dir: rawDir, size: { width: VIDEO_W, height: VIDEO_H } },
  });
  const page = await context.newPage();
  page.setDefaultTimeout(60000);

  await page.goto(BASE + scene.url, { waitUntil: "commit", timeout: 60000 });
  await page.waitForSelector(".app", { timeout: 45000 }).catch(() => {});
  await sleep(2200);

  if (scene.recordId === "home-next") {
    const anbo = page.locator(".presets button", { hasText: /Anbo/i }).first();
    if (await anbo.count()) await anbo.click();
    else await page.locator(".presets button").first().click();
    await sleep(3500);
    await page.locator("#swapBtn").click();
    await sleep(2800);
  }

  if (scene.recordId === "home-timetable") {
    await page.locator('[data-day="saturday"]').click();
    await sleep(900);
    await page.locator('[data-day="weekday"]').click();
    await sleep(900);
    const upcoming = page.locator("#upcomingOnly");
    if (await upcoming.isChecked()) await upcoming.click();
    await sleep(700);
    await upcoming.click();
    await sleep(900);
    await page.mouse.wheel(0, 520);
    await sleep(2800);
  }

  if (scene.recordId === "home-i18n") {
    await page.locator('[data-lang="zh"]').click();
    await sleep(1000);
    await page.locator('[data-lang="en"]').click();
    await sleep(900);
    await fillPicker(page, "#fromStopInput", "Anbo");
    await fillPicker(page, "#toStopInput", "Shiratani");
    await sleep(2000);
  }

  if (scene.recordId === "map") {
    const zoomIn = page.locator("#pdfZoomIn").first();
    if (await zoomIn.count()) {
      await zoomIn.click();
      await sleep(500);
      await zoomIn.click();
      await sleep(1200);
    }
    await page.locator("#farePanel").scrollIntoViewIfNeeded();
    await sleep(800);
    await fillPicker(page, "#fareFromPicker .picker-input", "Miyanoura");
    await fillPicker(page, "#fareToPicker .picker-input", "Shiratani");
    await sleep(2500);
  }

  if (scene.recordId === "access") {
    await page.mouse.wheel(0, 380);
    await sleep(1400);
    await page.mouse.wheel(0, 520);
    await sleep(1800);
    await page.mouse.wheel(0, 480);
    await sleep(2200);
  }

  await sleep(2000);
  const video = page.video();
  await context.close();
  if (video) {
    await video.saveAs(outPath);
    console.log("recorded:", outPath);
  }
}

async function main() {
  fs.mkdirSync(rawDir, { recursive: true });
  await waitForServer(BASE.replace(/\/$/, "") + "/");

  const browser = await chromium.launch({ headless: true });
  const titlePage = await browser.newPage();
  await renderTitleCards(titlePage);
  await titlePage.close();

  for (const scene of scenes.filter((s) => s.type === "record")) {
    await recordScene(browser, scene);
  }

  await browser.close();
  if (serverProc) serverProc.kill();
  console.log("Recording complete.");
}

main().catch((err) => {
  if (serverProc) serverProc.kill();
  console.error(err);
  process.exit(1);
});
