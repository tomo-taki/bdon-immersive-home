// Render every Spot situation in headless WebKit: writes settings thumbnails
// and reports load errors (a full-coverage smoke test of the renderer).
// Usage: node web/thumbs.mjs [only-id ...]
import { createServer } from "node:http";
import { mkdir, readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { webkit } from "/Users/seungheonhan/workspace/sobimate-build/node_modules/playwright/index.mjs";

const ROOT = new URL("../Resources/web/", import.meta.url).pathname;
const THUMBS = join(ROOT, "thumbs");
const VIEW = { width: 1280, height: 720 };
const SETTLE_MS = 4500;   // let home_start play out
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".json": "application/json", ".png": "image/png", ".glb": "model/gltf-binary", ".atlas": "text/plain" };

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

// --bg: characters off, written as <id>_bg.jpg
const args = process.argv.slice(2);
const BG = args.includes("--bg");
const only = new Set(args.filter((a) => a !== "--bg"));
const index = JSON.parse(await readFile(join(ROOT, "spots/index.json"), "utf8")).filter((s) => !only.size || only.has(s.id));
await mkdir(THUMBS, { recursive: true });

const browser = await webkit.launch({ headless: true });
const page = await browser.newPage({ viewport: VIEW, deviceScaleFactor: 1 });
let errors = [];
page.on("pageerror", (e) => errors.push(e.message + " @ " + (e.stack || "").split("\n").slice(0, 4).join(" < ")));
let failed = 0;

for (const spot of index) {
  errors = [];
  await page.goto(`http://127.0.0.1:${port}/?situation=${encodeURIComponent(spot.dir)}&chars=${BG ? 0 : 1}`);
  await page.waitForFunction(() => window.__wallpaperReady, null, { timeout: 90000 }).catch(() => {});
  const ready = await page.evaluate(() => window.__wallpaperReady ?? "timeout");
  await page.waitForTimeout(BG ? 800 : SETTLE_MS);
  await page.screenshot({ path: join(THUMBS, `${spot.id}${BG ? "_bg" : ""}.jpg`), type: "jpeg", quality: 82 });
  const ok = ready === "ok" && errors.length === 0;
  failed += ok ? 0 : 1;
  console.log(`${ok ? "ok  " : "FAIL"} ${spot.id} ${spot.name} ${ok ? "" : ready + " " + errors.join(" | ").slice(0, 200)}`);
}
await browser.close();
server.close();
console.log(`${index.length - failed}/${index.length} rendered`);
process.exit(failed ? 1 : 0);
