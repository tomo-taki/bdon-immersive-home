// settings.js (renderer) — drives settings.html via window.settingsApi.
//
// contextIsolation ON: only settingsApi is available, no Node. Mirrors the
// macOS SettingsView: thumbnail grid grouped by band, current Spot marked,
// shuffle turns tile clicks into pool toggles, footer toggles + interval,
// easter egg via KeyboardEvent.code (layout independent).

"use strict";

const api = window.settingsApi;
let webRoot = "";
let bands = [];
let snapshot = null;

const gridEl = document.getElementById("grid");
const chkCharacters = document.getElementById("chk-characters");
const chkParallax = document.getElementById("chk-parallax");
const chkShuffle = document.getElementById("chk-shuffle");
const selInterval = document.getElementById("sel-interval");
const poolCountEl = document.getElementById("pool-count");
const poolEmptyEl = document.getElementById("pool-empty");
const eggEl = document.getElementById("egg");
const currentEl = document.getElementById("current");

function thumbSrc(spot, characters) {
  // <id>.jpg with characters, <id>_bg.jpg without (falls back to <id>.jpg).
  const file = characters ? `${spot.id}.jpg` : `${spot.id}_bg.jpg`;
  return `file://${webRoot}/thumbs/${file}`;
}

function bandIconSrc(icon) {
  return icon ? `file://${webRoot}/bands/${icon}.png` : "";
}

/** Build the whole grid from the catalog + current snapshot. */
function renderGrid() {
  const s = snapshot.settings;
  const shuffle = s.shuffle;
  const characters = s.showCharacters;
  gridEl.innerHTML = "";

  for (const band of bands) {
    const section = document.createElement("section");
    section.className = "band";

    const head = document.createElement("div");
    head.className = "band-head";
    if (band.icon) {
      const img = document.createElement("img");
      img.src = bandIconSrc(band.icon);
      img.alt = "";
      head.appendChild(img);
    }
    const h2 = document.createElement("h2");
    h2.textContent = band.band;
    head.appendChild(h2);

    if (shuffle) {
      const ids = band.spots.map((sp) => sp.id);
      const allIn = ids.every((id) => s.shufflePool.includes(id));
      const btn = document.createElement("button");
      btn.className = "pool-btn";
      btn.textContent = allIn ? "전체 해제" : "전체 선택";
      btn.onclick = async () => {
        snapshot = await api.setPool(ids, !allIn);
        renderAll();
      };
      head.appendChild(btn);
    }
    section.appendChild(head);

    const tiles = document.createElement("div");
    tiles.className = "tiles";
    for (const spot of band.spots) {
      tiles.appendChild(makeTile(spot, s, shuffle, characters));
    }
    section.appendChild(tiles);
    gridEl.appendChild(section);
  }
}

function makeTile(spot, s, shuffle, characters) {
  const current = spot.id === s.spotId;
  const pooled = s.shufflePool.includes(spot.id);

  const tile = document.createElement("button");
  tile.className = "tile";
  tile.setAttribute("aria-label", `${spot.band} ${spot.name}${current ? ", 재생 중" : ""}`);

  const wrap = document.createElement("div");
  wrap.className = "thumb-wrap";
  // Highlight: selected in normal mode, pooled in shuffle mode.
  if (shuffle ? pooled : current) {
    wrap.classList.add("selected");
  }
  if (shuffle && !pooled) {
    wrap.classList.add("unpooled");
  }

  const img = document.createElement("img");
  img.src = thumbSrc(spot, characters);
  img.alt = "";
  // Fall back to the with-characters thumb if the _bg variant is missing.
  img.onerror = () => {
    if (!img.dataset.fallback) {
      img.dataset.fallback = "1";
      img.src = `file://${webRoot}/thumbs/${spot.id}.jpg`;
    }
  };
  wrap.appendChild(img);

  const badge = document.createElement("div");
  badge.className = "badge";
  if (shuffle) {
    badge.classList.add(pooled ? "check" : "ring");
    badge.textContent = pooled ? "✓" : "";
  } else if (current) {
    badge.classList.add("check");
    badge.textContent = "✓";
  }
  wrap.appendChild(badge);
  tile.appendChild(wrap);

  const name = document.createElement("div");
  name.className = "name" + ((shuffle ? pooled : current) ? " current" : "");
  const nameText = document.createElement("span");
  nameText.textContent = spot.name;
  name.appendChild(nameText);
  if (current && shuffle) {
    const playing = document.createElement("span");
    playing.className = "playing";
    playing.textContent = "▶ 재생 중";
    name.appendChild(playing);
  }
  tile.appendChild(name);

  tile.onclick = async () => {
    if (shuffle) {
      snapshot = await api.togglePool(spot.id);
    } else {
      snapshot = await api.chooseSpot(spot.id);
    }
    renderAll();
  };
  return tile;
}

/** Sync the footer controls + status line from the snapshot. */
function renderFooter() {
  const s = snapshot.settings;
  chkCharacters.checked = s.showCharacters;
  chkParallax.checked = s.cursorParallax;
  chkShuffle.checked = s.shuffle;

  // Interval options (built once).
  if (selInterval.options.length === 0) {
    for (const it of snapshot.intervals) {
      const opt = document.createElement("option");
      opt.value = it.id;
      opt.textContent = it.label;
      selInterval.appendChild(opt);
    }
  }
  selInterval.value = s.shuffleInterval;
  selInterval.disabled = !s.shuffle;

  if (s.shuffle) {
    poolCountEl.textContent = `셔플에 넣을 장면을 눌러 선택하세요 · ${s.shufflePool.length}개 선택됨`;
    poolEmptyEl.style.display = s.shufflePool.length === 0 ? "" : "none";
  } else {
    poolCountEl.textContent = "";
    poolEmptyEl.style.display = "none";
  }

  eggEl.textContent = snapshot.eggLabel ? `🐧 ${snapshot.eggLabel}` : "";
  currentEl.textContent = snapshot.current ? `현재: ${snapshot.current.name}` : "";
}

function renderAll() {
  renderGrid();
  renderFooter();
}

// --- Footer wiring ---

chkCharacters.onchange = async () => {
  snapshot = await api.set("showCharacters", chkCharacters.checked);
  renderAll();
};
chkParallax.onchange = async () => {
  snapshot = await api.set("cursorParallax", chkParallax.checked);
  renderAll();
};
chkShuffle.onchange = async () => {
  snapshot = await api.set("shuffle", chkShuffle.checked);
  renderAll();
};
selInterval.onchange = async () => {
  snapshot = await api.set("shuffleInterval", selInterval.value);
  renderAll();
};

// --- Easter egg: stream physical key codes to main (layout independent) ---
window.addEventListener("keydown", async (e) => {
  // Ignore when a modifier is held or focus is in a text field.
  if (e.metaKey || e.ctrlKey || e.altKey) {
    return;
  }
  if (/^Key[A-Z]$/.test(e.code)) {
    snapshot = await api.typeCode(e.code);
    renderFooter();
  }
});

// Main pushes updates (shuffle advanced the Spot, egg flipped elsewhere).
api.onUpdate((next) => {
  snapshot = next;
  renderAll();
});

// Boot.
(async () => {
  const payload = await api.load();
  webRoot = payload.webRoot.replace(/\\/g, "/"); // file:// wants forward slashes on Windows
  bands = payload.bands;
  snapshot = {
    settings: payload.settings,
    current: payload.current,
    eggLabel: payload.eggLabel,
    intervals: payload.intervals,
  };
  renderAll();
})();
