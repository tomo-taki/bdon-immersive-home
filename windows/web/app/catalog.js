// catalog.js — Bundled Spot list, mirroring SpotCatalog.swift.
//
// Reads web/spots/index.json (built by tools/build_spot.py). Provides the
// band grouping the settings grid draws, and the band-logo file map.

"use strict";

const fs = require("fs");
const path = require("path");

// Band -> logo basename in web/bands (copied from icon/bands).
const BAND_ICONS = {
  "MyGO!!!!!": "mygo",
  "Ave Mujica": "avemujica",
  "夢限大みゅーたいぷ": "yumemita",
  millsage: "millsage",
  "一家Dumb Rock!": "ikka",
};

class Catalog {
  /** @param {string} webRoot  the app's web/ directory */
  constructor(webRoot) {
    this.webRoot = webRoot;
    this.spots = this._load();
    this.byId = new Map(this.spots.map((s) => [s.id, s]));
  }

  _load() {
    try {
      const raw = fs.readFileSync(path.join(this.webRoot, "spots", "index.json"), "utf8");
      const list = JSON.parse(raw);
      return Array.isArray(list) ? list : [];
    } catch {
      return [];
    }
  }

  spot(id) {
    return this.byId.get(id) || null;
  }

  ids() {
    return this.spots.map((s) => s.id);
  }

  /** Spots grouped by band, in index order (mirrors SpotCatalog.byBand). */
  byBand() {
    const order = [];
    const groups = new Map();
    for (const spot of this.spots) {
      if (!groups.has(spot.band)) {
        order.push(spot.band);
        groups.set(spot.band, []);
      }
      groups.get(spot.band).push(spot);
    }
    return order.map((band) => ({ band, icon: BAND_ICONS[band] || null, spots: groups.get(band) }));
  }
}

module.exports = { Catalog, BAND_ICONS };
