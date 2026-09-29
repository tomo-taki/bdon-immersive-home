// main.js — BDON Immersive Home (Windows web track), Electron main process.
//
// One frameless, click-through BrowserWindow per display, attached behind the
// desktop icons via the WorkerW trick (worker-w.js). The window loads the same
// three.js + spine-threejs Spot renderer the macOS app uses (web/index.html +
// app.js, copied into this package under ./web).
//
// Behaviours mirror the macOS app:
//   1. per-display wallpaper windows, WorkerW-attached, click-through
//   2. cursor parallax polled at 20 Hz
//   3. pause on lock / suspend (powerMonitor)
//   4. tray menu (settings / characters / shuffle / quit), single instance
//   5. HTML settings window (settings.html)
//   6. shuffle timer, load-error retry, log file with memory every 5 min
//
// A --dev-mac switch skips WorkerW and opens one ordinary window + the settings
// window, then screenshots both for QA — that is how this is verified on macOS.

"use strict";

const { app, BrowserWindow, Tray, Menu, screen, powerMonitor, ipcMain, nativeImage } = require("electron");
const fs = require("fs");
const path = require("path");

const workerW = require("./worker-w");
const { Settings, INTERVALS } = require("./settings-store");
const { Catalog } = require("./catalog");
const easterEgg = require("./easter-egg");

// ---- Constants -------------------------------------------------------------

const APP_DIR = __dirname;
const WEB_ROOT = path.join(APP_DIR, "web");
const ICON_DIR = path.join(APP_DIR, "icons");
const FPS = 30; // page frame cap; the page self-drives with rAF (no driver=native)
const POINTER_HZ = 20;
const POINTER_INTERVAL_MS = 1000 / POINTER_HZ;
const MEMORY_LOG_INTERVAL_MS = 5 * 60 * 1000;
const LOAD_RETRY_DELAY_MS = 5000;
const MAX_LOAD_RETRIES = 2;

const DEV_MAC = process.argv.includes("--dev-mac");
// SwiftShader/WARP software WebGL, for the GPU-less Windows VM.
app.commandLine.appendSwitch("enable-unsafe-swiftshader");
// Keep rendering when the window is occluded/behind the desktop.
app.commandLine.appendSwitch("disable-backgrounding-occluded-windows");

// The macOS dev/QA run happens in a sandbox-restricted environment where the
// Chromium sandbox cannot initialize, so we drop it there (and ONLY there — the
// packaged Windows app keeps the sandbox). Hardware GL works on the dev Mac, so
// we do NOT force swiftshader here; that fallback is for the GPU-less Windows VM.
if (DEV_MAC) {
  app.commandLine.appendSwitch("no-sandbox");
}

// ---- Logging ---------------------------------------------------------------

let logPath = null;

function log(line) {
  const stamp = new Date().toISOString();
  const text = `${stamp}  ${line}\n`;
  try {
    if (logPath) {
      fs.appendFileSync(logPath, text);
    }
  } catch {
    // ignore log write failures
  }
  // Also to stdout so `npx electron .` shows progress during QA.
  process.stdout.write(text);
}

// ---- App state -------------------------------------------------------------

let settings = null;
let catalog = null;
let tray = null;
let settingsWindow = null;
let pointerTimer = null;
let memoryTimer = null;
let shuffleTimer = null;

// One record per display: { id, window, rectPx, lastPointer, ready }.
let displays = [];

// Pause reasons (set of strings), matching the macOS PauseReason approach.
const pauseReasons = new Set();
const isPaused = () => pauseReasons.size > 0;

// Per-dir load-failure counts, for the bounded retry.
const loadFailures = new Map();

// ---- Wallpaper windows -----------------------------------------------------

/** Build the page URL for a Spot; the page self-drives (rAF), no driver=native. */
function pageUrl(spot, hidden) {
  const params = new URLSearchParams({
    situation: spot.dir,
    chars: settings.get("showCharacters") ? "1" : "0",
    hide: hidden.join(","),
    fps: String(FPS),
  });
  return `file://${path.join(WEB_ROOT, "index.html")}?${params.toString()}`;
}

function currentSpot() {
  return catalog.spot(settings.get("spotId")) || catalog.spots[0] || null;
}

function hiddenForCurrent() {
  const spot = currentSpot();
  return spot ? easterEgg.hiddenMembers(settings.get("easterEgg"), spot) : [];
}

/**
 * Physical-pixel rect of a display in WorkerW client space. The WorkerW spans
 * the whole virtual screen, whose origin is the top-left of the left/top-most
 * monitor (not necessarily the primary one), so offset by that.
 */
function physicalBounds(display) {
  if (process.platform === "win32") {
    return screen.dipToScreenRect(null, display.bounds);
  }
  const b = display.bounds;
  const s = display.scaleFactor || 1;
  return { x: Math.round(b.x * s), y: Math.round(b.y * s), width: Math.round(b.width * s), height: Math.round(b.height * s) };
}

function rectPx(display) {
  const all = screen.getAllDisplays().map(physicalBounds);
  const originX = Math.min(...all.map((r) => r.x));
  const originY = Math.min(...all.map((r) => r.y));
  const r = physicalBounds(display);
  return { x: r.x - originX, y: r.y - originY, width: r.width, height: r.height };
}

function makeWallpaperWindow(display) {
  const spot = currentSpot();
  if (!spot) {
    log("no Spot data bundled");
    return null;
  }

  const win = new BrowserWindow({
    x: display.bounds.x,
    y: display.bounds.y,
    width: display.bounds.width,
    height: display.bounds.height,
    frame: false,
    transparent: false,
    backgroundColor: "#f6b9dd",
    show: DEV_MAC, // dev window shows normally; wallpaper windows show after attach
    skipTaskbar: true,
    focusable: false,
    resizable: false,
    movable: false,
    hasShadow: false,
    fullscreenable: false,
    title: "BDONImmersiveHome",
    webPreferences: {
      preload: path.join(APP_DIR, "preload-wallpaper.js"),
      contextIsolation: true,
      nodeIntegration: false,
      backgroundThrottling: false,
      // Software WebGL path needs this to keep painting when hidden.
      offscreen: false,
    },
  });

  win.setMenu(null);
  if (!DEV_MAC) {
    win.setIgnoreMouseEvents(true); // click-through
  }

  const hidden = easterEgg.hiddenMembers(settings.get("easterEgg"), spot);
  win.loadURL(pageUrl(spot, hidden));

  const record = {
    id: display.id,
    window: win,
    rectPx: rectPx(display),
    lastPointer: { x: NaN, y: NaN },
    ready: false,
  };

  win.webContents.on("did-finish-load", () => {
    watchReady(record);
  });

  return record;
}

/** Poll window.__wallpaperReady until the first Spot frame is up (or fails). */
function watchReady(record) {
  const deadline = Date.now() + 90_000;
  const poll = async () => {
    if (record.window.isDestroyed()) {
      return;
    }
    let status = null;
    try {
      status = await record.window.webContents.executeJavaScript("window.__wallpaperReady ?? null", true);
    } catch {
      status = null;
    }
    if (status) {
      record.ready = true;
      log(`page ready on display ${record.id}: ${String(status).slice(0, 200)}`);
      if (!DEV_MAC) {
        attachWindow(record);
      }
      syncPage(record);
      return;
    }
    if (Date.now() > deadline) {
      log(`page ready timeout on display ${record.id}`);
      if (!DEV_MAC) {
        attachWindow(record);
      }
      return;
    }
    setTimeout(poll, 250);
  };
  poll();
}

/** Attach a ready wallpaper window behind the desktop icons. */
function attachWindow(record) {
  try {
    const handle = record.window.getNativeWindowHandle();
    const ok = workerW.attachToDesktop(handle, record.rectPx);
    log(`attach display ${record.id}: ${ok ? "workerW" : "fallback (not attached)"}`);
    if (!ok) {
      // Not on Windows, or WorkerW unavailable: at least send it to the back.
      record.window.setAlwaysOnTop(false);
    }
    record.window.showInactive();
  } catch (err) {
    log(`attach error on display ${record.id}: ${err.message}`);
  }
}

/** Push current settings into a page that just (re)loaded. */
function syncPage(record) {
  const spot = currentSpot();
  if (!spot || record.window.isDestroyed()) {
    return;
  }
  const hidden = easterEgg.hiddenMembers(settings.get("easterEgg"), spot);
  callPage(record, `wallpaper.setCharacters(${settings.get("showCharacters")})`);
  callPage(record, `wallpaper.setHidden(${JSON.stringify(hidden)})`);
  callPage(record, `wallpaper.setSituation(${JSON.stringify(spot.dir)})`);
  callPage(record, `wallpaper.setPaused(${isPaused()})`);
  if (!settings.get("cursorParallax")) {
    callPage(record, "wallpaper.setPointer(0, 0)");
  }
}

/** Evaluate a `window.wallpaper.*` call in a page, guarded. */
function callPage(record, expr) {
  if (record.window.isDestroyed()) {
    return;
  }
  record.window.webContents.executeJavaScript(`window.wallpaper && ${expr}`, true).catch(() => {});
}

function forEachPage(fn) {
  for (const record of displays) {
    if (!record.window.isDestroyed()) {
      fn(record);
    }
  }
}

// ---- Display management ----------------------------------------------------

function rebuildDisplays() {
  const current = screen.getAllDisplays();
  const currentIds = current.map((d) => d.id);
  log(`displays ${currentIds.join(",")} (had ${displays.map((r) => r.id).join(",")})`);

  const kept = [];
  for (const display of current) {
    const existing = displays.find((r) => r.id === display.id);
    if (existing) {
      // Reposition if the frame moved.
      existing.rectPx = rectPx(display);
      existing.window.setBounds(display.bounds);
      if (!DEV_MAC && existing.ready) {
        workerW.attachToDesktop(existing.window.getNativeWindowHandle(), existing.rectPx);
      }
      kept.push(existing);
    } else {
      const record = makeWallpaperWindow(display);
      if (record) {
        kept.push(record);
      }
    }
  }

  // Close windows for displays that went away.
  for (const record of displays) {
    if (!currentIds.includes(record.id) && !record.window.isDestroyed()) {
      record.window.destroy();
    }
  }

  displays = kept;
  applyPause();
}

// ---- Cursor parallax (20 Hz) ----------------------------------------------

function updatePointer() {
  if (isPaused() || !settings.get("cursorParallax")) {
    return;
  }
  const point = screen.getCursorScreenPoint();
  for (const record of displays) {
    if (record.window.isDestroyed()) {
      continue;
    }
    const b = screen.getAllDisplays().find((d) => d.id === record.id)?.bounds;
    if (!b || b.width === 0 || b.height === 0) {
      continue;
    }
    const midX = b.x + b.width / 2;
    const midY = b.y + b.height / 2;
    // +y is UP, like the macOS app: screen y grows downward, so negate.
    let x = (point.x - midX) / (b.width / 2);
    let y = -((point.y - midY) / (b.height / 2));
    x = Math.max(-1, Math.min(1, Math.round(x * 100) / 100));
    y = Math.max(-1, Math.min(1, Math.round(y * 100) / 100));
    if (x === record.lastPointer.x && y === record.lastPointer.y) {
      continue;
    }
    record.lastPointer = { x, y };
    callPage(record, `wallpaper.setPointer(${x}, ${y})`);
  }
}

function centerCamera() {
  forEachPage((record) => {
    record.lastPointer = { x: NaN, y: NaN };
    callPage(record, "wallpaper.setPointer(0, 0)");
  });
}

// ---- Pause (lock / suspend) ------------------------------------------------

function setPauseReason(reason, active) {
  if (active) {
    pauseReasons.add(reason);
  } else {
    pauseReasons.delete(reason);
  }
  log(`pause reasons ${[...pauseReasons].sort().join(",") || "(none)"}`);
  applyPause();
}

function applyPause() {
  const paused = isPaused();
  forEachPage((record) => callPage(record, `wallpaper.setPaused(${paused})`));
  if (!paused) {
    restartShuffle(); // resume dwell timing
  }
}

// ---- Shuffle ---------------------------------------------------------------

function restartShuffle() {
  if (shuffleTimer) {
    clearTimeout(shuffleTimer);
    shuffleTimer = null;
  }
  if (!settings.get("shuffle")) {
    return;
  }
  shuffleTimer = setTimeout(advanceShuffle, settings.intervalSeconds() * 1000);
}

function advanceShuffle() {
  if (isPaused()) {
    restartShuffle();
    return;
  }
  const next = settings.nextShuffleId();
  if (!next) {
    restartShuffle();
    return;
  }
  applySpot(next);
}

// ---- Applying setting changes to pages -------------------------------------

/** Change the current Spot everywhere and restart the dwell timer. */
function applySpot(id) {
  const spot = catalog.spot(id);
  if (!spot) {
    return;
  }
  settings.set("spotId", id);
  log(`spot -> ${id}`);
  const hidden = easterEgg.hiddenMembers(settings.get("easterEgg"), spot);
  forEachPage((record) => {
    callPage(record, `wallpaper.setHidden(${JSON.stringify(hidden)})`);
    callPage(record, `wallpaper.setSituation(${JSON.stringify(spot.dir)})`);
  });
  restartShuffle();
  pushSettingsUpdate();
  updateTrayMenu();
}

function applyCharacters(visible) {
  settings.set("showCharacters", visible);
  forEachPage((record) => callPage(record, `wallpaper.setCharacters(${visible})`));
  pushSettingsUpdate();
  updateTrayMenu();
}

function applyEasterEgg(egg) {
  settings.set("easterEgg", egg);
  const spot = currentSpot();
  const hidden = spot ? easterEgg.hiddenMembers(egg, spot) : [];
  forEachPage((record) => callPage(record, `wallpaper.setHidden(${JSON.stringify(hidden)})`));
  pushSettingsUpdate();
}

function applyShuffle(on) {
  settings.set("shuffle", on);
  restartShuffle();
  pushSettingsUpdate();
  updateTrayMenu();
}

// ---- Load-error retry ------------------------------------------------------

function onWallpaperEvent(message) {
  if (!message || typeof message !== "object") {
    return;
  }
  const { event, dir = "", message: detail = "" } = message;
  log(`page: ${event} ${dir} ${String(detail).slice(0, 200)}`);
  if (event === "loadError") {
    retryLoad(dir);
  } else if (event === "reload") {
    // WebGL context lost and never restored: reload every page.
    forEachPage((record) => record.window.webContents.reload());
  }
}

function retryLoad(dir) {
  const count = (loadFailures.get(dir) || 0) + 1;
  loadFailures.set(dir, count);
  if (count > MAX_LOAD_RETRIES) {
    log(`giving up on ${dir} after ${count} failures`);
    return;
  }
  setTimeout(() => {
    const spot = currentSpot();
    if (!spot || spot.dir !== dir) {
      return; // moved on already
    }
    log(`retrying ${dir} (${count})`);
    forEachPage((record) => callPage(record, `wallpaper.setSituation(${JSON.stringify(spot.dir)})`));
  }, LOAD_RETRY_DELAY_MS);
}

// ---- Tray ------------------------------------------------------------------

function trayIcon() {
  // Prefer the colored tomori icon; fall back to the menubar template.
  for (const name of ["tomori.png", "menubar@2x.png", "menubar.png"]) {
    const p = path.join(ICON_DIR, name);
    if (fs.existsSync(p)) {
      const img = nativeImage.createFromPath(p);
      if (!img.isEmpty()) {
        return img.resize({ width: 18, height: 18 });
      }
    }
  }
  return nativeImage.createEmpty();
}

function updateTrayMenu() {
  if (!tray) {
    return;
  }
  const menu = Menu.buildFromTemplate([
    { label: "배경 설정…", click: openSettings },
    { type: "separator" },
    {
      label: "캐릭터 표시",
      type: "checkbox",
      checked: settings.get("showCharacters"),
      click: (item) => applyCharacters(item.checked),
    },
    {
      label: "장면 셔플",
      type: "checkbox",
      checked: settings.get("shuffle"),
      click: (item) => applyShuffle(item.checked),
    },
    { type: "separator" },
    { label: "종료", click: () => app.quit() },
  ]);
  tray.setContextMenu(menu);
  const spot = currentSpot();
  tray.setToolTip(spot ? `Our Notes — ${spot.name}` : "BDON Immersive Home");
}

function createTray() {
  tray = new Tray(trayIcon());
  updateTrayMenu();
  tray.on("click", openSettings);
}

// ---- Settings window -------------------------------------------------------

function openSettings() {
  if (settingsWindow && !settingsWindow.isDestroyed()) {
    settingsWindow.show();
    settingsWindow.focus();
    return;
  }
  // Fit the window into the work area of the display under the cursor. The
  // layout is designed at 1000x720; on a smaller screen (a 1024x768 VM) the
  // whole page is zoomed down so the grid and the footer both stay visible.
  const DESIGN_W = 1000;
  const DESIGN_H = 720;
  const work = screen.getDisplayNearestPoint(screen.getCursorScreenPoint()).workArea;
  const zoom = Math.max(0.5, Math.min(1, (work.width - 24) / DESIGN_W, (work.height - 48) / DESIGN_H));
  settingsWindow = new BrowserWindow({
    width: Math.round(DESIGN_W * zoom),
    height: Math.round(DESIGN_H * zoom),
    minWidth: Math.round(DESIGN_W * zoom),
    minHeight: Math.round(Math.min(560, DESIGN_H) * zoom),
    useContentSize: true,
    center: true,
    title: "배경 설정",
    backgroundColor: "#1c1c1e",
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(APP_DIR, "preload-settings.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  settingsWindow.setMenu(null);
  settingsWindow.webContents.on("did-finish-load", () => settingsWindow?.webContents.setZoomFactor(zoom));
  settingsWindow.loadFile(path.join(APP_DIR, "settings.html"));
  settingsWindow.on("closed", () => {
    settingsWindow = null;
  });
}

function pushSettingsUpdate() {
  if (settingsWindow && !settingsWindow.isDestroyed()) {
    settingsWindow.webContents.send("settings:update", settingsSnapshot());
  }
}

function settingsSnapshot() {
  const spot = currentSpot();
  return {
    settings: settings.all(),
    current: spot ? { id: spot.id, name: spot.name } : null,
    eggLabel: easterEgg.label(settings.get("easterEgg")),
    intervals: Object.entries(INTERVALS).map(([id, v]) => ({ id, label: v.label })),
  };
}

// ---- IPC (settings window) -------------------------------------------------

function registerIpc() {
  ipcMain.handle("settings:load", () => ({
    bands: catalog.byBand(),
    webRoot: WEB_ROOT,
    ...settingsSnapshot(),
  }));

  ipcMain.handle("settings:set", (_e, { key, value }) => {
    switch (key) {
      case "showCharacters":
        applyCharacters(value);
        break;
      case "cursorParallax":
        settings.set("cursorParallax", value);
        if (!value) {
          centerCamera();
        }
        break;
      case "shuffle":
        applyShuffle(value);
        break;
      case "shuffleInterval":
        settings.set("shuffleInterval", value);
        restartShuffle();
        break;
      default:
        settings.set(key, value);
    }
    return settingsSnapshot();
  });

  ipcMain.handle("settings:togglePool", (_e, id) => {
    settings.togglePool(id);
    return settingsSnapshot();
  });

  ipcMain.handle("settings:setPool", (_e, { ids, included }) => {
    settings.setPool(ids, included);
    return settingsSnapshot();
  });

  ipcMain.handle("settings:chooseSpot", (_e, id) => {
    applySpot(id);
    return settingsSnapshot();
  });

  ipcMain.handle("settings:typeCode", (_e, code) => {
    const egg = feedEggBuffer(code);
    if (egg !== undefined) {
      // Toggle like the macOS listener: same code again rolls back to none.
      const next = settings.get("easterEgg") === egg ? "none" : egg;
      applyEasterEgg(next);
    }
    return settingsSnapshot();
  });

  ipcMain.on("wallpaper-event", (_e, message) => onWallpaperEvent(message));
}

// Easter-egg key buffer, mirroring EasterEggListener (16-char window).
let eggBuffer = "";
function feedEggBuffer(code) {
  // code is a KeyboardEvent.code like "KeyA"; take the letter.
  const m = /^Key([A-Z])$/.exec(code);
  if (!m) {
    return undefined;
  }
  eggBuffer = (eggBuffer + m[1].toLowerCase()).slice(-16);
  const egg = easterEgg.matching(eggBuffer);
  if (egg) {
    eggBuffer = "";
    return egg;
  }
  return undefined;
}

// ---- QA (dev-mac) ----------------------------------------------------------

async function captureForQA() {
  const qaDir = path.join(APP_DIR, "..", "qa");
  try {
    fs.mkdirSync(qaDir, { recursive: true });
  } catch {
    // ignore
  }

  // Wait for the wallpaper page to report ready (bounded).
  const record = displays[0];
  if (record) {
    const deadline = Date.now() + 90_000;
    let status = null;
    while (Date.now() < deadline) {
      try {
        status = await record.window.webContents.executeJavaScript("window.__wallpaperReady ?? null", true);
      } catch {
        status = null;
      }
      if (status) {
        break;
      }
      await delay(300);
    }
    log(`dev-mac wallpaper ready status: ${status}`);
    await delay(500);
    try {
      const img = await record.window.webContents.capturePage();
      fs.writeFileSync(path.join(qaDir, "wallpaper.png"), img.toPNG());
      log(`captured qa/wallpaper.png (${img.getSize().width}x${img.getSize().height})`);
    } catch (err) {
      log(`capture wallpaper failed: ${err.message}`);
    }
  }

  // Settings window.
  openSettings();
  await delay(1500);
  if (settingsWindow && !settingsWindow.isDestroyed()) {
    try {
      const img = await settingsWindow.webContents.capturePage();
      fs.writeFileSync(path.join(qaDir, "settings.png"), img.toPNG());
      log(`captured qa/settings.png (${img.getSize().width}x${img.getSize().height})`);
    } catch (err) {
      log(`capture settings failed: ${err.message}`);
    }
  }

  log("dev-mac QA done; quitting");
  app.quit();
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ---- Lifecycle -------------------------------------------------------------

function bootstrap() {
  logPath = path.join(app.getPath("userData"), "log.txt");
  log(`start dev-mac=${DEV_MAC} ffi=${JSON.stringify(workerW.status())}`);

  catalog = new Catalog(WEB_ROOT);
  settings = new Settings(path.join(app.getPath("userData"), "settings.json"), catalog.ids());
  log(`catalog: ${catalog.spots.length} spots; current ${settings.get("spotId")}`);

  registerIpc();
  rebuildDisplays();
  createTray();

  // 2) cursor parallax @ 20 Hz
  pointerTimer = setInterval(updatePointer, POINTER_INTERVAL_MS);

  // 3) pause on lock / suspend
  powerMonitor.on("lock-screen", () => setPauseReason("locked", true));
  powerMonitor.on("unlock-screen", () => setPauseReason("locked", false));
  powerMonitor.on("suspend", () => setPauseReason("suspended", true));
  powerMonitor.on("resume", () => setPauseReason("suspended", false));

  // 6) shuffle + memory log
  restartShuffle();
  memoryTimer = setInterval(logMemory, MEMORY_LOG_INTERVAL_MS);

  // Display hotplug / metrics.
  screen.on("display-added", rebuildDisplays);
  screen.on("display-removed", rebuildDisplays);
  screen.on("display-metrics-changed", rebuildDisplays);

  if (DEV_MAC) {
    captureForQA();
  }
}

function logMemory() {
  try {
    const metrics = app.getAppMetrics();
    const totalMB = metrics.reduce((sum, m) => sum + (m.memory?.workingSetSize || 0), 0) / 1024;
    log(`memory: ${totalMB.toFixed(1)} MB across ${metrics.length} processes`);
  } catch (err) {
    log(`memory probe failed: ${err.message}`);
  }
}

// Single instance.
if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on("second-instance", openSettings);
  app.whenReady().then(bootstrap);
}

// Keep running with no windows (tray app); on macOS dev we quit after QA.
app.on("window-all-closed", (e) => {
  if (!DEV_MAC) {
    e.preventDefault();
  }
});

app.on("before-quit", () => {
  if (pointerTimer) clearInterval(pointerTimer);
  if (memoryTimer) clearInterval(memoryTimer);
  if (shuffleTimer) clearTimeout(shuffleTimer);
});
