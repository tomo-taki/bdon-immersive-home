// settings.js (renderer) — drives settings.html via window.settingsApi.
//
// Ported from the macOS SettingsView (Our Notes game UI). Three columns:
//   left    game-tab slabs   배경 / 상세 / 정보  (selected = teal arrow slab)
//   middle  sub-tab rows      배경 -> bands ; 상세 -> 표시 / 셔플 ; 정보 -> 앱 정보
//   right   content           scene grid / option pills / app info
//
// contextIsolation ON: only settingsApi is available, no Node. The renderer
// mirrors the Swift SettingsNav state machine (tab / section / band / open
// pill) and the SpotTile shuffle-pool behaviour, and keeps the same IPC.

"use strict";

const api = window.settingsApi;

// ── Constants mirroring the Swift layout ──────────────────────────────────
const TAB_HEIGHT = 46;
const TAB_SPACING = 18;

// Left-column tabs, in order.
const TABS = [
  { id: "scene", label: "배경" },
  { id: "display", label: "상세" },
  { id: "about", label: "정보" },
];

// 상세 sections (middle column), in order.
const SECTIONS = [
  { id: "display", label: "표시" },
  { id: "shuffle", label: "셔플" },
];

// ── View state (SettingsNav) ──────────────────────────────────────────────
const nav = {
  tab: "scene", // "scene" | "display" | "about"
  section: "display", // "display" | "shuffle"
  band: "",
  expanded: null, // option id of the open pill, or null
};

let webRoot = "";
let iconRoot = "";
let bands = [];
let snapshot = null;
let intervals = []; // [{id, label}] in order
let version = "개발 빌드";

// ── DOM refs ──────────────────────────────────────────────────────────────
const sidebarEl = document.getElementById("sidebar");
const subtabsEl = document.getElementById("subtabs");
const scenePane = document.getElementById("scene-pane");
const optionsPane = document.getElementById("options-pane");
const aboutPane = document.getElementById("about-pane");
const sceneBandEl = document.getElementById("scene-band");
const scenePoolBtn = document.getElementById("scene-pool-btn");
const sceneGridEl = document.getElementById("scene-grid");
const optionsListEl = document.getElementById("options-list");
const resetBtn = document.getElementById("reset-btn");
const aboutIconEl = document.getElementById("about-icon");
const aboutVersionEl = document.getElementById("about-version");
const bugReportBtn = document.getElementById("bug-report-btn");
const backdropEl = document.getElementById("backdrop");

// ── Helpers ────────────────────────────────────────────────────────────────
function s() {
  return snapshot.settings;
}

function thumbSrc(spot, characters) {
  const file = characters ? `${spot.id}.jpg` : `${spot.id}_bg.jpg`;
  return `file://${webRoot}/thumbs/${file}`;
}

function bandIconSrc(icon) {
  return icon ? `file://${webRoot}/bands/${icon}.png` : "";
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

// ── GameRadio: concentric discs as an inline SVG (fractions + RGB from
//    Theme.swift GameRadio). Diameter 33 to match RadioChoice. ────────────
function gameRadioSvg(selected) {
  const D = 33;
  const c = D / 2;
  const disc = (frac, fill) => {
    const r = (D * frac) / 2;
    return `<circle cx="${c}" cy="${c}" r="${r}" fill="${fill}"/>`;
  };
  // Shadow disc offset y by d*0.03.
  const shadow = `<circle cx="${c}" cy="${c + D * 0.03}" r="${D / 2}" fill="rgba(0,0,0,0.35)"/>`;

  let defs = "";
  let body = "";
  const uid = selected ? "on" : "off";

  if (selected) {
    // linear rim
    defs += `<linearGradient id="r-${uid}-rim" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="rgb(200,236,248)"/><stop offset="1" stop-color="rgb(158,190,206)"/></linearGradient>`;
    // radial ring
    defs += `<radialGradient id="r-${uid}-ring" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0.69" stop-color="rgb(86,160,184)"/><stop offset="0.83" stop-color="rgb(104,190,216)"/><stop offset="1" stop-color="rgb(150,216,236)"/></radialGradient>`;
    // top gloss
    defs += `<linearGradient id="r-${uid}-gloss" x1="0" y1="0" x2="0" y2="0.5">
      <stop offset="0" stop-color="rgba(255,255,255,0.18)"/><stop offset="1" stop-color="rgba(255,255,255,0)"/></linearGradient>`;
    // inner well
    defs += `<radialGradient id="r-${uid}-well" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0.57" stop-color="rgb(92,150,173)"/><stop offset="1" stop-color="rgb(64,110,134)"/></radialGradient>`;
    body =
      disc(1.0, "rgb(48,72,92)") +
      disc(0.92, `url(#r-${uid}-rim)`) +
      disc(0.84, `url(#r-${uid}-ring)`) +
      disc(0.84, `url(#r-${uid}-gloss)`) +
      disc(0.6, `url(#r-${uid}-well)`) +
      disc(0.4, "rgba(255,255,255,0.35)") +
      disc(0.32, "rgb(255,255,255)");
  } else {
    defs += `<linearGradient id="r-${uid}-rim" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="rgb(160,143,201)"/><stop offset="1" stop-color="rgb(100,100,166)"/></linearGradient>`;
    defs += `<linearGradient id="r-${uid}-ring" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="rgb(64,74,124)"/><stop offset="1" stop-color="rgb(78,94,164)"/></linearGradient>`;
    defs += `<linearGradient id="r-${uid}-well" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="rgb(37,36,68)"/><stop offset="1" stop-color="rgb(40,41,79)"/></linearGradient>`;
    body =
      disc(1.0, "rgb(50,52,95)") +
      disc(0.92, `url(#r-${uid}-rim)`) +
      disc(0.86, `url(#r-${uid}-ring)`) +
      disc(0.62, "rgb(43,45,83)") +
      disc(0.58, `url(#r-${uid}-well)`);
  }

  return `<svg class="radio-disc" viewBox="0 0 ${D} ${D}" width="${D}" height="${D}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs>${defs}</defs>${shadow}${body}</svg>`;
}

// ── Left column: game tabs ─────────────────────────────────────────────────
function renderSidebar() {
  sidebarEl.innerHTML = "";
  for (const t of TABS) {
    const btn = el("button", "game-tab");
    if (nav.tab === t.id) btn.classList.add("selected");
    btn.setAttribute("aria-pressed", String(nav.tab === t.id));

    const badge = el("span", "tab-badge", "적용 중");
    const slab = el("div", "slab");
    const label = el("span", "label", t.label);
    slab.appendChild(label);
    if (nav.tab === t.id) {
      const outline = el("span", "outline");
      slab.appendChild(outline);
      const spark = el("span", "sparkle", "✦");
      slab.appendChild(spark);
    }
    btn.appendChild(badge);
    btn.appendChild(slab);
    btn.onclick = () => {
      if (nav.tab !== t.id) {
        nav.tab = t.id;
        nav.expanded = null;
        renderAll();
      }
    };
    sidebarEl.appendChild(btn);
  }
  // trailing spacer to push nothing; tabs sit at the top via flex gap
  const spacer = el("div");
  spacer.style.flex = "1 1 auto";
  sidebarEl.appendChild(spacer);
}

// ── Middle column: sub-tabs ─────────────────────────────────────────────────
function renderSubtabs() {
  subtabsEl.innerHTML = "";
  // Sub-tab rows start level with the selected left tab.
  if (nav.tab === "scene") {
    for (const band of bands) {
      const row = el("button", "subtab");
      if (nav.band === band.band) row.classList.add("selected");
      if (band.icon) {
        const img = el("img");
        img.src = bandIconSrc(band.icon);
        img.alt = "";
        row.appendChild(img);
      }
      row.appendChild(el("span", "subtab-title", band.band));
      row.onclick = () => {
        nav.band = band.band;
        renderAll();
      };
      subtabsEl.appendChild(row);
    }
  } else if (nav.tab === "display") {
    // Rows start level with the 상세 tab (one tab + gap down).
    subtabsEl.style.paddingTop = `${19 + TAB_HEIGHT + TAB_SPACING}px`;
    for (const sec of SECTIONS) {
      const row = el("button", "subtab");
      if (nav.section === sec.id) row.classList.add("selected");
      row.appendChild(el("span", "subtab-title", sec.label));
      row.onclick = () => {
        nav.section = sec.id;
        nav.expanded = null;
        renderAll();
      };
      subtabsEl.appendChild(row);
    }
    return;
  } else if (nav.tab === "about") {
    // Single row level with the 정보 tab (two tabs + gaps down).
    subtabsEl.style.paddingTop = `${19 + (TAB_HEIGHT + TAB_SPACING) * 2}px`;
    const row = el("button", "subtab selected");
    row.appendChild(el("span", "subtab-title", "앱 정보"));
    subtabsEl.appendChild(row);
    return;
  }
  subtabsEl.style.paddingTop = "19px";
}

// ── Right column ────────────────────────────────────────────────────────────
function renderContent() {
  scenePane.classList.toggle("active", nav.tab === "scene");
  optionsPane.classList.toggle("active", nav.tab === "display");
  aboutPane.classList.toggle("active", nav.tab === "about");

  if (nav.tab === "scene") renderScene();
  else if (nav.tab === "display") renderOptions();
  else if (nav.tab === "about") renderAbout();
}

// ── Scene grid (배경) ────────────────────────────────────────────────────────
function renderScene() {
  const set = s();
  const shuffle = set.shuffle;
  const characters = set.showCharacters;
  const band = bands.find((b) => b.band === nav.band) || bands[0];
  if (!band) return;

  sceneBandEl.textContent = band.band;

  const ids = band.spots.map((sp) => sp.id);
  if (shuffle) {
    const allIn = ids.every((id) => set.shufflePool.includes(id));
    scenePoolBtn.classList.remove("hidden");
    scenePoolBtn.textContent = allIn ? "전체 해제" : "전체 선택";
    scenePoolBtn.onclick = async () => {
      snapshot = await api.setPool(ids, !allIn);
      renderAll();
    };
  } else {
    scenePoolBtn.classList.add("hidden");
    scenePoolBtn.onclick = null;
  }

  sceneGridEl.innerHTML = "";
  const tiles = el("div", "tiles");
  for (const spot of band.spots) {
    tiles.appendChild(makeTile(spot, set, shuffle, characters));
  }
  sceneGridEl.appendChild(tiles);
}

function makeTile(spot, set, shuffle, characters) {
  const current = spot.id === set.spotId;
  const pooled = set.shufflePool.includes(spot.id);
  const highlighted = shuffle ? pooled : current;

  const tile = el("button", "tile");
  tile.setAttribute("aria-label", `${spot.band} ${spot.name}${current ? ", 현재 장면" : ""}`);

  const wrap = el("div", "thumb-wrap");
  if (highlighted) wrap.classList.add("selected");
  if (shuffle && !pooled) wrap.classList.add("unpooled");

  const img = el("img");
  img.src = thumbSrc(spot, characters);
  img.alt = "";
  img.onerror = () => {
    if (!img.dataset.fallback) {
      img.dataset.fallback = "1";
      img.src = `file://${webRoot}/thumbs/${spot.id}.jpg`;
    }
  };
  wrap.appendChild(img);

  const badge = el("div", "badge");
  if (shuffle) {
    badge.classList.add(pooled ? "check" : "ring");
    badge.textContent = pooled ? "✓" : "";
  } else if (current) {
    badge.classList.add("check");
    badge.textContent = "✓";
  }
  wrap.appendChild(badge);
  tile.appendChild(wrap);

  const name = el("div", "tile-name" + (highlighted ? " current" : ""), spot.name);
  tile.appendChild(name);

  tile.onclick = async () => {
    snapshot = shuffle ? await api.togglePool(spot.id) : await api.chooseSpot(spot.id);
    renderAll();
  };
  return tile;
}

// ── Option pills (상세) ──────────────────────────────────────────────────────
function renderOptions() {
  const set = s();
  optionsListEl.innerHTML = "";

  if (nav.section === "display") {
    optionsListEl.appendChild(onOffPill("characters", "캐릭터 표시", "showCharacters"));
    optionsListEl.appendChild(onOffPill("parallax", "커서 따라 시점 이동", "cursorParallax"));
    // 잠금 화면 is macOS-only (unused on Windows): omitted.
  } else {
    optionsListEl.appendChild(
      onOffPill("shuffle", "장면 셔플", "shuffle", set.shuffle ? "적용 중" : null)
    );
    optionsListEl.appendChild(intervalPill());
    optionsListEl.appendChild(shuffleTargetPill());
  }

  resetBtn.onclick = resetSection;
}

/** Build the SVG DropPanel mask once the pill is laid out. */
function applyDropPanelMask(pill) {
  const panel = pill.querySelector(".pill-panel");
  const rect = pill.getBoundingClientRect();
  const w = Math.round(rect.width);
  const h = Math.round(rect.height);
  if (w === 0 || h === 0) return;
  const headerH = 64;
  const radius = 32;
  const top = headerH / 2; // panel starts at the capsule's vertical middle
  // Panel body: from y=top down, square top corners, bottom corners r32.
  // Minus the header capsule (rounded rect h=headerH, r=32) via mask.
  const bodyH = h - top;
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' viewBox='0 0 ${w} ${h}'>` +
    `<defs><mask id='m'>` +
    // white body (kept)
    `<path d='M0 ${top} L${w} ${top} L${w} ${top + bodyH - radius} ` +
    `A${radius} ${radius} 0 0 1 ${w - radius} ${h} ` +
    `L${radius} ${h} A${radius} ${radius} 0 0 1 0 ${top + bodyH - radius} Z' fill='white'/>` +
    // black header capsule (removed)
    `<rect x='0' y='0' width='${w}' height='${headerH}' rx='${radius}' ry='${radius}' fill='black'/>` +
    `</mask></defs>` +
    `<rect width='${w}' height='${h}' fill='black' mask='url(#m)'/>` +
    `</svg>`;
  const url = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  panel.style.webkitMaskImage = url;
  panel.style.maskImage = url;
  panel.style.webkitMaskRepeat = "no-repeat";
  panel.style.maskRepeat = "no-repeat";
}

function makePill({ id, title, value, badge, enabled, expandable, onHeader, buildBody, onClickWhenNotExpandable }) {
  const open = nav.expanded === id && enabled !== false;
  const pill = el("div", "pill");
  if (open) pill.classList.add("open");
  if (enabled === false) pill.classList.add("disabled");

  const panel = el("div", "pill-panel");
  pill.appendChild(panel);

  const header = el("button", "pill-header");
  header.setAttribute("aria-label", `${title}, ${value}`);
  header.setAttribute("aria-expanded", String(open));

  const text = el("div", "pill-text");
  const titleRow = el("div", "pill-title-row");
  titleRow.appendChild(el("span", null, title));
  if (badge) titleRow.appendChild(el("span", "pill-badge", badge));
  text.appendChild(titleRow);
  text.appendChild(el("div", "pill-hairline"));
  text.appendChild(el("div", "pill-value", value));
  header.appendChild(text);

  const tri = el("div", "pill-tri", expandable && open ? "▼" : "▲");
  header.appendChild(tri);

  header.onclick = () => {
    if (enabled === false) return;
    if (!expandable) {
      if (onClickWhenNotExpandable) onClickWhenNotExpandable();
      return;
    }
    nav.expanded = nav.expanded === id ? null : id;
    renderAll();
  };
  pill.appendChild(header);

  if (open && expandable && buildBody) {
    const body = el("div", "pill-body");
    buildBody(body);
    pill.appendChild(body);
    // Mask the panel to the DropPanel shape after layout.
    requestAnimationFrame(() => applyDropPanelMask(pill));
  }
  return pill;
}

function onOffPill(id, title, key, badge = null) {
  const value = s()[key];
  return makePill({
    id,
    title,
    value: value ? "ON" : "OFF",
    badge,
    enabled: true,
    expandable: true,
    buildBody: (body) => {
      const row = el("div", "radio-row");
      row.appendChild(radioChoice("OFF", !value, () => setKey(key, false)));
      row.appendChild(radioChoice("ON", value, () => setKey(key, true)));
      body.appendChild(row);
    },
  });
}

function radioChoice(label, selected, onClick) {
  const btn = el("button", "radio-choice" + (selected ? " selected" : ""));
  btn.setAttribute("aria-pressed", String(selected));
  btn.innerHTML = gameRadioSvg(selected);
  btn.appendChild(el("span", null, label));
  btn.onclick = onClick;
  return btn;
}

function intervalShort(id) {
  const it = intervals.find((x) => x.id === id);
  // "10분마다" -> "10분"
  return it ? it.label.replace(/마다$/, "") : id;
}

function intervalPill() {
  const set = s();
  const idx = intervals.findIndex((x) => x.id === set.shuffleInterval);
  const short = intervalShort(set.shuffleInterval);
  return makePill({
    id: "interval",
    title: "변경 주기",
    value: short,
    enabled: set.shuffle,
    expandable: true,
    buildBody: (body) => {
      const stepper = el("div", "stepper");
      const down = el("button", "step-btn", "∨");
      down.setAttribute("aria-label", "줄이기");
      down.disabled = idx <= 0;
      down.onclick = () => idx > 0 && setKey("shuffleInterval", intervals[idx - 1].id);

      const val = el("div", "step-value", short);

      const up = el("button", "step-btn", "∧");
      up.setAttribute("aria-label", "늘리기");
      up.disabled = idx >= intervals.length - 1;
      up.onclick = () => idx < intervals.length - 1 && setKey("shuffleInterval", intervals[idx + 1].id);

      stepper.appendChild(down);
      stepper.appendChild(val);
      stepper.appendChild(up);
      body.appendChild(stepper);
    },
  });
}

function shuffleTargetPill() {
  const set = s();
  return makePill({
    id: "target",
    title: "셔플 대상",
    value: `${set.shufflePool.length}개 장면`,
    enabled: set.shuffle,
    expandable: false,
    onClickWhenNotExpandable: () => {
      nav.tab = "scene";
      nav.expanded = null;
      renderAll();
    },
  });
}

async function setKey(key, value) {
  snapshot = await api.set(key, value);
  renderAll();
}

// "기본값으로 되돌리기" resets only the section on screen.
async function resetSection() {
  if (nav.section === "display") {
    await api.set("showCharacters", true);
    snapshot = await api.set("cursorParallax", true);
  } else {
    await api.set("shuffle", false);
    await api.set("shuffleInterval", "minutes10");
    const allIds = bands.flatMap((b) => b.spots.map((sp) => sp.id));
    snapshot = await api.setPool(allIds, true);
  }
  renderAll();
}

// ── About (정보) ─────────────────────────────────────────────────────────────
function renderAbout() {
  aboutIconEl.src = `file://${iconRoot}/tomori.png`;
  aboutVersionEl.textContent = `버전 ${version}`;
  bugReportBtn.onclick = () => api.reportBug();
}

// ── Render everything ────────────────────────────────────────────────────────
function renderAll() {
  renderSidebar();
  renderSubtabs();
  renderContent();
}

// Backdrop: blurred current-scene thumbnail (GameBackdrop).
function updateBackdrop() {
  const cur = snapshot.current;
  if (cur && webRoot) {
    backdropEl.style.backgroundImage = `url("file://${webRoot}/thumbs/${cur.id}.jpg")`;
    document.body.classList.add("has-scene");
  } else {
    document.body.classList.remove("has-scene");
  }
}

// Main pushes updates (shuffle advanced the Spot, egg flipped elsewhere).
api.onUpdate((next) => {
  snapshot = next;
  updateBackdrop();
  renderAll();
});

// Easter egg: stream physical key codes to main (layout independent).
window.addEventListener("keydown", async (e) => {
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  if (/^Key[A-Z]$/.test(e.code)) {
    snapshot = await api.typeCode(e.code);
    updateBackdrop();
  }
});

// Boot.
(async () => {
  const payload = await api.load();
  webRoot = payload.webRoot.replace(/\\/g, "/");
  iconRoot = (payload.iconRoot || "").replace(/\\/g, "/");
  bands = payload.bands;
  intervals = payload.intervals;
  version = payload.version || "개발 빌드";
  snapshot = {
    settings: payload.settings,
    current: payload.current,
    eggLabel: payload.eggLabel,
    intervals: payload.intervals,
  };
  nav.band = payload.current
    ? (bands.find((b) => b.spots.some((sp) => sp.id === payload.current.id))?.band ?? bands[0]?.band ?? "")
    : bands[0]?.band ?? "";
  updateBackdrop();
  renderAll();
})();
