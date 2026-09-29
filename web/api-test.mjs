// QA: live API — switch background and toggle characters on one page, like the app does.
// Usage: node web/api-test.mjs
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { webkit } from "/Users/seungheonhan/workspace/sobimate-build/node_modules/playwright/index.mjs";

const ROOT = new URL("../Resources/web/", import.meta.url).pathname;
const OUT = new URL("../prev/", import.meta.url).pathname;
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".json": "application/json", ".png": "image/png", ".glb": "model/gltf-binary" };

const server = createServer(async (req, res) => {
  const path = normalize(join(ROOT, decodeURIComponent(new URL(req.url, "http://x").pathname)));
  if (!path.startsWith(ROOT)) { res.writeHead(403).end(); return; }
  try {
    const file = path.endsWith("/") ? join(path, "index.html") : path;
    res.writeHead(200, { "Content-Type": TYPES[extname(file)] ?? "application/octet-stream" }).end(await readFile(file));
  } catch { res.writeHead(404).end(); }
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));

const browser = await webkit.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 960, height: 540 } });
page.on("pageerror", (e) => console.log("pageerror", e.message));
const ready = () => page.waitForFunction(() => window.__wallpaperReady, null, { timeout: 60000 });

await page.goto(`http://127.0.0.1:${server.address().port}/?situation=home_003_yumemita_01_vrfloor_03/30001`);
await ready();
await page.evaluate(() => wallpaper.setCharacters(false));
await page.waitForTimeout(500);
await page.screenshot({ path: `${OUT}api_1_chars_off.jpg`, type: "jpeg" });

// Switch background: the character toggle must carry over.
await page.evaluate(() => wallpaper.setSituation("home_002_mujica_01_studio_0101/20001"));
await ready();
await page.waitForTimeout(500);
await page.screenshot({ path: `${OUT}api_2_switched.jpg`, type: "jpeg" });

await page.evaluate(() => wallpaper.setCharacters(true));
await page.waitForTimeout(1500);
await page.screenshot({ path: `${OUT}api_3_chars_on.jpg`, type: "jpeg" });

// Rapid switches: only the last one may win.
await page.evaluate(() => {
  wallpaper.setSituation("home_004_millsage_02_cafe_0101/40004");
  wallpaper.setSituation("home_005_ikka_01_livehouse_0101/50001");
});
await ready();
const shown = await page.evaluate(() => document.title && window.__wallpaperReady);
await page.waitForTimeout(1500);
await page.screenshot({ path: `${OUT}api_4_last_wins.jpg`, type: "jpeg" });
console.log("ok", shown);

await browser.close();
server.close();
