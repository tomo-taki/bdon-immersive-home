// QA: render each Spot situation in headless WebKit and save screenshots.
// Usage: node web/qa.mjs <out_dir> [width height]
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { webkit } from "/Users/seungheonhan/workspace/sobimate-build/node_modules/playwright/index.mjs";

const ROOT = new URL("../Resources/web/", import.meta.url).pathname;
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".json": "application/json", ".png": "image/png", ".glb": "model/gltf-binary", ".atlas": "text/plain" };
const [out = "prev", width = "1920", height = "1080"] = process.argv.slice(2);

// Static server bound to loopback only.
const server = createServer(async (req, res) => {
  const path = normalize(join(ROOT, decodeURIComponent(new URL(req.url, "http://x").pathname)));
  if (!path.startsWith(ROOT)) { res.writeHead(403).end(); return; }
  try {
    const file = path.endsWith("/") ? join(path, "index.html") : path;
    res.writeHead(200, { "Content-Type": TYPES[extname(file)] ?? "application/octet-stream" }).end(await readFile(file));
  } catch { res.writeHead(404).end(); }
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const port = server.address().port;

const index = JSON.parse(await readFile(join(ROOT, "spots/index.json"), "utf8"));
const browser = await webkit.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: +width, height: +height } });
page.on("pageerror", (e) => console.log("pageerror", e.message));
page.on("console", (m) => { if (m.type() === "error") console.log("console", m.text().slice(0, 300)); });

for (const spot of index) {
  await page.goto(`http://127.0.0.1:${port}/?situation=${spot.dir}`);
  await page.waitForFunction(() => window.__wallpaperReady, null, { timeout: 90000 });
  const ready = await page.evaluate(() => window.__wallpaperReady);
  await page.waitForTimeout(4500);   // let home_start play out
  const file = `${out}/spot_${spot.dir.slice(-2)}.png`;
  await page.screenshot({ path: file });
  console.log(spot.dir, ready, file);
}
await browser.close();
server.close();
