// easter-egg.js — MyGO!!!!! pair easter egg, mirroring EasterEgg.swift.
//
// Typing a pair code in the settings window leaves the *other* pair out of
// MyGO!!!!! scenes; typing it again rolls it back. Rana always stays. Codes
// are physical-key sequences (KeyboardEvent.code), so a 두벌식 Hangul typist
// hits them too: 토모타키 = "xhahxkzl", 아논소요 = "dkshsthdy".

"use strict";

const BAND = "MyGO!!!!!";

// Suffix codes -> egg id, matching EasterEgg.codes.
const CODES = [
  ["tmtk", "tomoTaki"],
  ["tktm", "tomoTaki"],
  ["tomotaki", "tomoTaki"],
  ["takitomo", "tomoTaki"],
  ["xhahxkzl", "tomoTaki"],
  ["xkzlxhah", "tomoTaki"],
  ["ansy", "anonSoyo"],
  ["syan", "anonSoyo"],
  ["anonsoyo", "anonSoyo"],
  ["soyoanon", "anonSoyo"],
  ["dkshsthdy", "anonSoyo"],
  ["thdydkshs", "anonSoyo"],
];

const KEPT = {
  none: [],
  tomoTaki: ["tomori", "taki"],
  anonSoyo: ["anon", "soyo"],
};

const DROPPED = {
  none: [],
  tomoTaki: ["anon", "soyo"],
  anonSoyo: ["tomori", "taki"],
};

const LABELS = {
  none: null,
  tomoTaki: "토모타키 모드",
  anonSoyo: "아논소요 모드",
};

/** The egg whose code the typed buffer ends with, or null. */
function matching(typed) {
  const hit = CODES.find(([code]) => typed.endsWith(code));
  return hit ? hit[1] : null;
}

/**
 * Members the page should hide for `spot`, mirroring
 * EasterEgg.hiddenMembers(in:). Only MyGO!!!!! scenes are affected, and only
 * when both kept members are actually present.
 *
 * @param {string} egg  "none" | "tomoTaki" | "anonSoyo"
 * @param {{band:string, characters:string[]}} spot
 * @returns {string[]}
 */
function hiddenMembers(egg, spot) {
  if (egg === "none" || !spot || spot.band !== BAND) {
    return [];
  }
  const names = (spot.characters || []).map((c) => c.toLowerCase());
  const present = (member) => names.some((n) => n.includes(member));
  if (!KEPT[egg].every(present)) {
    return [];
  }
  return DROPPED[egg].filter(present);
}

function label(egg) {
  return LABELS[egg] || null;
}

module.exports = { matching, hiddenMembers, label, BAND, LABELS };
