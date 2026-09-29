// Wallpaper page: one Spot situation, full window, no UI.
// The native app drives it through window.wallpaper (pointer parallax, pause,
// situation, characters) and reads window.__wallpaperReady for QA snapshots.
//
// URL: index.html?situation=<room>/<spotId>&chars=1&fps=30&driver=native

import { defaultPose, fitFov, shiftedPose, type SpotPose } from "./spot-camera";
import { createRenderer, SpotStage } from "./spot-stage";

const SPOTS = "spots";
const DEFAULT_SITUATION = "home_003_yumemita_01_vrfloor_03/30001";
const EASE = 0.06;          // pointer smoothing per frame
const MAX_DELTA = 0.25;     // s; clamp after sleeps / pauses (> the app's idle step interval)
const CAMERA_EPSILON = 1e-4; // smoothed pointer change that still counts as camera motion

const PARAMS = new URLSearchParams(location.search);
// Frame cap; rAF may run at 60-120 Hz on ProMotion displays.
const FPS = Number(PARAMS.get("fps") ?? 30);
const FRAME_MS = 1000 / FPS - 1;
// driver=native: the macOS app calls wallpaper.step() on its own timer, because
// WebKit may stop requestAnimationFrame for desktop-level (occluded) windows.
const NATIVE_DRIVER = PARAMS.get("driver") === "native";

type State = {
  stage: SpotStage | null;
  base: SpotPose | null;
  pointer: { x: number; y: number };
  smooth: { x: number; y: number };
  characters: boolean;
  hidden: string[];
  paused: boolean;
  last: number;
  frame: number | null;
  loadToken: number;
  // Spot being shown or loading ("" before the first load).
  dir: string;
};

const state: State = {
  stage: null,
  base: null,
  pointer: { x: 0, y: 0 },
  smooth: { x: 0, y: 0 },
  characters: PARAMS.get("chars") !== "0",
  // hide=anon,soyo: easter-egg members left out of this Spot
  hidden: (PARAMS.get("hide") ?? "").split(",").filter(Boolean),
  paused: false,
  last: 0,
  frame: null,
  loadToken: 0,
  dir: "",
};

const canvas = document.getElementById("spot") as HTMLCanvasElement;
const renderer = createRenderer(canvas);
// QA: live GPU object counts (work/stability/leak-soak.mjs).
window.__gpu = () => ({ ...renderer.info.memory, programs: renderer.info.programs?.length ?? 0 });

function resize() {
  const stage = state.stage;
  if (!stage) {
    return;
  }
  const width = window.innerWidth;
  const height = window.innerHeight;
  stage.setSize(width, height);
  state.base = defaultPose(stage.data.situation, fitFov(stage.data.situation, width, height));
}

function tick(now: number) {
  // Skip display refreshes until the capped frame interval has passed.
  if (!state.last || now - state.last >= FRAME_MS) {
    draw(now);
  }
  schedule();
}

function schedule() {
  state.frame = state.paused || NATIVE_DRIVER ? null : requestAnimationFrame(tick);
}

function draw(now: number) {
  const stage = state.stage;
  const delta = state.last ? Math.min(MAX_DELTA, (now - state.last) / 1000) : 0;
  state.last = now;
  if (!stage || !state.base) {
    return;
  }
  const previous = { ...state.smooth };
  state.smooth.x += (state.pointer.x - state.smooth.x) * EASE;
  state.smooth.y += (state.pointer.y - state.smooth.y) * EASE;
  const moving = Math.abs(state.smooth.x - previous.x) + Math.abs(state.smooth.y - previous.y) > CAMERA_EPSILON;
  stage.setPose(shiftedPose(state.base, state.smooth.x, state.smooth.y, stage.data.situation, window.innerWidth / Math.max(window.innerHeight, 1)));
  stage.render(delta, moving);
  window.__frames = (window.__frames ?? 0) + 1;
  window.__drawn = stage.drawn;
}

/** Replace the current situation; a newer call wins over one still loading. */
async function load(dir: string) {
  const token = ++state.loadToken;
  state.dir = dir;
  window.__wallpaperReady = undefined;

  const next = await SpotStage.create(renderer, SPOTS, dir);
  if (token !== state.loadToken) {
    next.dispose();
    return;
  }
  state.stage?.dispose();
  state.stage = next;
  next.setCharactersVisible(state.characters);
  next.setHiddenMembers(state.hidden);
  resize();

  // Render one frame right away so a snapshot never sees an empty canvas.
  state.last = 0;
  draw(performance.now());
  if (state.frame === null) {
    schedule();
  }
  window.__wallpaperReady = "ok";
}

function report(error: unknown) {
  window.__wallpaperReady = `error: ${error instanceof Error ? `${error.message} @ ${error.stack?.split("\n").slice(0, 3).join(" < ")}` : String(error)}`;
  document.body.dataset.error = window.__wallpaperReady;
}

/** A failed load keeps the previous Spot on screen and may be asked for again. */
function failed(dir: string) {
  return (error: unknown) => {
    if (state.dir === dir) {
      state.dir = "";
    }
    report(error);
    post({ event: "loadError", dir, message: window.__wallpaperReady ?? "" });
  };
}

/** Tell the macOS app (SpotWebView.received); a no-op in a plain browser. */
function post(message: Record<string, string>) {
  window.webkit?.messageHandlers?.wallpaper?.postMessage(message);
}

// WebKit restores a lost WebGL context on its own, and three.js re-uploads
// everything on restore. If it never comes back, ask the app to start over.
const CONTEXT_RESTORE_MS = 10_000;
let restoreTimer: number | undefined;

canvas.addEventListener("webglcontextlost", () => {
  post({ event: "contextLost", dir: state.dir });
  window.clearTimeout(restoreTimer);
  restoreTimer = window.setTimeout(() => post({ event: "reload", dir: state.dir }), CONTEXT_RESTORE_MS);
});

canvas.addEventListener("webglcontextrestored", () => {
  window.clearTimeout(restoreTimer);
  // The restored canvas is blank: draw even if the Spot is idle.
  state.stage?.invalidate();
  post({ event: "contextRestored", dir: state.dir });
});

const api = {
  /** Pointer relative to the display centre, each axis in [-1, 1]; +y is up. */
  setPointer(x: number, y: number) {
    state.pointer = { x: Math.max(-1, Math.min(1, x)), y: Math.max(-1, Math.min(1, y)) };
  },
  setPaused(paused: boolean) {
    state.paused = paused;
    if (!paused && state.frame === null) {
      state.last = 0;
      schedule();
    }
  },
  setCharacters(visible: boolean) {
    state.characters = visible;
    state.stage?.setCharactersVisible(visible);
  },
  /** Members to leave out; kept across situation changes. */
  setHidden(members: string[]) {
    state.hidden = members;
    state.stage?.setHiddenMembers(members);
  },
  /** One frame, driven by the native app (driver=native). */
  /**
   * One frame, driven by the native app (driver=native). Returns 1 when a
   * frame was drawn, 0 when the Spot is idle, so the app can slow its timer.
   */
  step() {
    if (state.paused) {
      return 0;
    }
    const before = state.stage?.drawn ?? 0;
    draw(performance.now());
    return (state.stage?.drawn ?? 0) !== before || !state.stage ? 1 : 0;
  },
  setSituation(dir: string) {
    // The app re-sends its settings after every page (re)load; the Spot on
    // screen, or the one already loading, is not loaded a second time.
    if (dir === state.dir) {
      return;
    }
    load(dir).catch(failed(dir));
  },
};

declare global {
  interface Window {
    wallpaper: typeof api;
    __wallpaperReady?: string;
    __frames?: number;
    __drawn?: number;
    __gpu?: () => { geometries: number; textures: number; programs: number };
    webkit?: { messageHandlers?: { wallpaper?: { postMessage(message: unknown): void } } };
  }
}
window.wallpaper = api;
window.addEventListener("resize", resize);

load(PARAMS.get("situation") ?? DEFAULT_SITUATION).catch(failed(PARAMS.get("situation") ?? DEFAULT_SITUATION));
