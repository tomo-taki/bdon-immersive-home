// settings-store.js — Persisted user choices, mirroring WallpaperSettings.swift.
//
// Same keys and defaults as the macOS app so a user's mental model carries
// over. Stored as JSON in app.getPath('userData')/settings.json instead of
// UserDefaults. The pool defaults to "every Spot" on first run.
//
// (Named settings-store, not settings, to avoid colliding with the renderer
// script settings.js that settings.html loads.)

"use strict";

const fs = require("fs");
const path = require("path");

// Shuffle periods, matching ShuffleInterval in WallpaperSettings.swift.
const INTERVALS = {
  minute1: { label: "1분마다", seconds: 60 },
  minutes5: { label: "5분마다", seconds: 5 * 60 },
  minutes10: { label: "10분마다", seconds: 10 * 60 },
  minutes30: { label: "30분마다", seconds: 30 * 60 },
  hour1: { label: "1시간마다", seconds: 60 * 60 },
};

const DEFAULT_SPOT = "30001";
const DEFAULT_INTERVAL = "minutes10";

// Keys line up with the Swift UserDefaults keys.
const KEYS = {
  spotId: "spotId",
  showCharacters: "showCharacters",
  cursorParallax: "cursorParallax",
  shuffle: "shuffle",
  shufflePool: "shufflePool",
  shuffleInterval: "shuffleInterval",
  easterEgg: "easterEgg",
  // lockScreen is macOS-only; kept for parity but unused on Windows.
  lockScreen: "lockScreen",
};

/**
 * Load, validate and persist settings. `allSpotIds` seeds the first-run pool
 * and clamps stored values to Spots that still exist.
 */
class Settings {
  /**
   * @param {string} filePath  settings.json location
   * @param {string[]} allSpotIds  every known Spot id, in catalog order
   */
  constructor(filePath, allSpotIds) {
    this.filePath = filePath;
    this.allSpotIds = allSpotIds;
    this.data = this._read();
  }

  _read() {
    let raw = {};
    try {
      raw = JSON.parse(fs.readFileSync(this.filePath, "utf8"));
    } catch {
      raw = {};
    }

    const spotId = this.allSpotIds.includes(raw[KEYS.spotId]) ? raw[KEYS.spotId] : DEFAULT_SPOT;
    const interval = INTERVALS[raw[KEYS.shuffleInterval]] ? raw[KEYS.shuffleInterval] : DEFAULT_INTERVAL;
    const egg = ["none", "tomoTaki", "anonSoyo"].includes(raw[KEYS.easterEgg]) ? raw[KEYS.easterEgg] : "none";

    // First run (no stored pool): every Spot is pooled. Otherwise intersect
    // with the current catalog so stale ids drop out.
    const storedPool = Array.isArray(raw[KEYS.shufflePool]) ? raw[KEYS.shufflePool] : null;
    const pool = storedPool
      ? storedPool.filter((id) => this.allSpotIds.includes(id))
      : this.allSpotIds.slice();

    return {
      [KEYS.spotId]: spotId,
      [KEYS.showCharacters]: typeof raw[KEYS.showCharacters] === "boolean" ? raw[KEYS.showCharacters] : true,
      [KEYS.cursorParallax]: typeof raw[KEYS.cursorParallax] === "boolean" ? raw[KEYS.cursorParallax] : true,
      [KEYS.shuffle]: typeof raw[KEYS.shuffle] === "boolean" ? raw[KEYS.shuffle] : false,
      [KEYS.shufflePool]: pool,
      [KEYS.shuffleInterval]: interval,
      [KEYS.easterEgg]: egg,
      [KEYS.lockScreen]: typeof raw[KEYS.lockScreen] === "boolean" ? raw[KEYS.lockScreen] : true,
    };
  }

  _write() {
    try {
      fs.mkdirSync(path.dirname(this.filePath), { recursive: true });
      // Store the pool sorted, like the Swift app does.
      const out = { ...this.data, [KEYS.shufflePool]: this.data[KEYS.shufflePool].slice().sort() };
      fs.writeFileSync(this.filePath, JSON.stringify(out, null, 2));
    } catch {
      // A failed write is non-fatal; the app keeps running with in-memory state.
    }
  }

  get(key) {
    return this.data[key];
  }

  set(key, value) {
    this.data[key] = value;
    this._write();
  }

  /** Snapshot for the settings renderer / IPC. */
  all() {
    return { ...this.data, [KEYS.shufflePool]: this.data[KEYS.shufflePool].slice() };
  }

  // --- Shuffle pool helpers (mirror WallpaperSettings) ---

  inPool(id) {
    return this.data[KEYS.shufflePool].includes(id);
  }

  togglePool(id) {
    const pool = new Set(this.data[KEYS.shufflePool]);
    if (pool.has(id)) {
      pool.delete(id);
    } else {
      pool.add(id);
    }
    this.set(KEYS.shufflePool, [...pool]);
  }

  setPool(ids, included) {
    const pool = new Set(this.data[KEYS.shufflePool]);
    for (const id of ids) {
      if (included) {
        pool.add(id);
      } else {
        pool.delete(id);
      }
    }
    this.set(KEYS.shufflePool, [...pool]);
  }

  /** Random pooled Spot other than the current one; null when there is none. */
  nextShuffleId() {
    const current = this.data[KEYS.spotId];
    const pool = this.data[KEYS.shufflePool];
    const candidates = this.allSpotIds.filter((id) => pool.includes(id) && id !== current);
    if (candidates.length === 0) {
      return null;
    }
    return candidates[Math.floor(Math.random() * candidates.length)];
  }

  intervalSeconds() {
    return (INTERVALS[this.data[KEYS.shuffleInterval]] || INTERVALS[DEFAULT_INTERVAL]).seconds;
  }
}

module.exports = { Settings, INTERVALS, KEYS, DEFAULT_SPOT, DEFAULT_INTERVAL };
