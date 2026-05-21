import { chromium, devices } from "playwright";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const rawDir = path.join(root, "raw");
const titlesDir = path.join(root, "titles");
const scenes = JSON.parse(fs.readFileSync(path.join(__dirname, "scenes.json"), "utf8"));

const BASE = process.env.VIDEO_BASE_URL || "http://127.0.0.1:8765";
const serverProc = process.env.VIDEO_SKIP_SERVER
  ? null
  : spawn("python3", ["-m", "http.server", "8765"], {
      cwd: path.join(root, ".."),
      stdio: "ignore",
    });

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function waitForServer(url, tries = 30) {
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {}
    await sleep(400);
  }
  throw new Error(`Server not ready: ${url}`);
}

async function renderTitleCards(page) {
  for (const scene of scenes.filter((s) => s.type === "title")) {
    const cardUrl =
      `file://${path.join(titlesDir, "card.html")}` +
      `?title=${encodeURIComponent(scene.title)}` +
      `&subtitle=${encodeURIComponent(scene.subtitle || "")}`;
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto(cardUrl);
    await sleep(300);
    const out = path.join(titlesDir, `${scene.id}.png`);
    await page.screenshot({ path: out, type: "png" });
    console.log("title card:", out);
  }
}

async function recordScene(browser, scene, viewportName, size, device) {
  const outPath = path.join(rawDir, `${scene.recordId}-${viewportName}.webm`);
  const context = await browser.newContext({
    ...device,
    viewport: size,
    recordVideo: { dir: rawDir, size },
  });
  const page = await context.newPage();
  page.setDefaultTimeout(20000);

  await page.goto(BASE + scene.url, { waitUntil: "networkidle" });
  await sleep(1200);

  if (scene.recordId === "home-next") {
    await page.locator(".presets button").first().click();
    await sleep(5500);
  }

  if (scene.recordId === "home-timetable") {
    await page.locator(".presets button").nth(1).click().catch(() => page.locator(".presets button").first().click());
    await sleep(1200);
    await page.locator('[data-day="saturday"]').click();
    await sleep(900);
    await page.locator('[data-day="sunday_holiday"]').click();
    await sleep(900);
    await page.locator('[data-day="weekday"]').click();
    await sleep(900);
    await page.mouse.wheel(0, 700);
    await sleep(2500);
  }

  if (scene.recordId === "home-i18n") {
    await page.locator('[data-lang="ja"]').click();
    await sleep(900);
    await page.locator('[data-lang="zh"]').click();
    await sleep(900);
    await page.locator('[data-lang="en"]').click();
    await sleep(900);
    await page.locator('[data-lang="zh"]').click();
    await sleep(1200);
    await page.locator("#fromStopInput").click();
    await sleep(400);
    await page.locator('li[role="option"]').first().click();
    await sleep(2000);
  }

  if (scene.recordId === "map") {
    await sleep(1500);
    if (viewportName === "desktop") {
      const zoomIn = page.locator("#pdfZoomIn").first();
      if (await zoomIn.count()) {
        await zoomIn.click();
        await sleep(600);
        await zoomIn.click();
        await sleep(1200);
      }
    }
    await page.mouse.wheel(0, 500);
    await sleep(2500);
  }

  if (scene.recordId === "access") {
    await page.mouse.wheel(0, 400);
    await sleep(1500);
    await page.mouse.wheel(0, 600);
    await sleep(2000);
    await page.mouse.wheel(0, 600);
    await sleep(2000);
  }

  if (scene.recordId === "about") {
    await page.mouse.wheel(0, 300);
    await sleep(2000);
    await page.mouse.wheel(0, 500);
    await sleep(2500);
  }

  const video = page.video();
  await context.close();
  if (video) {
    await video.saveAs(outPath);
    console.log("recorded:", outPath);
  }
}

async function main() {
  fs.mkdirSync(rawDir, { recursive: true });
  await waitForServer(BASE);

  const browser = await chromium.launch({ headless: true });
  const titlePage = await browser.newPage();
  await renderTitleCards(titlePage);
  await titlePage.close();

  const desktop = { viewport: { width: 1440, height: 900 } };
  const mobile = devices["iPhone 14 Pro"];

  for (const scene of scenes.filter((s) => s.type === "record")) {
    await recordScene(browser, scene, "desktop", { width: 1440, height: 900 }, desktop);
    if (scene.viewport === "both") {
      await recordScene(browser, scene, "mobile", { width: 390, height: 844 }, {
        ...mobile,
        isMobile: true,
        hasTouch: true,
      });
    }
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
