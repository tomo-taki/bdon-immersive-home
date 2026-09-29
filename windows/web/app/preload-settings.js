// preload-settings.js — Safe bridge for the settings window.
//
// contextIsolation ON, nodeIntegration OFF: the settings renderer (settings.html)
// only touches this narrow, promise-based API — never Node or ipcRenderer raw.

"use strict";

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("settingsApi", {
  // Initial payload: catalog grouped by band, current settings, resource paths.
  load: () => ipcRenderer.invoke("settings:load"),

  // Persist one setting; returns the updated snapshot (so the UI stays in sync
  // with any derived changes, e.g. easter egg toggling hidden members).
  set: (key, value) => ipcRenderer.invoke("settings:set", { key, value }),

  // Shuffle-pool edits.
  togglePool: (id) => ipcRenderer.invoke("settings:togglePool", id),
  setPool: (ids, included) => ipcRenderer.invoke("settings:setPool", { ids, included }),

  // Pick a Spot now (normal mode click).
  chooseSpot: (id) => ipcRenderer.invoke("settings:chooseSpot", id),

  // Easter-egg key buffer: the renderer streams KeyboardEvent.code; main
  // matches codes and may flip the egg. Returns the resulting snapshot.
  typeCode: (code) => ipcRenderer.invoke("settings:typeCode", code),

  // Open a pre-filled bug-report / suggestion mail draft (정보 pane).
  reportBug: () => ipcRenderer.invoke("settings:reportBug"),

  // Main pushes a fresh snapshot when something changes underneath (shuffle
  // timer advanced the Spot, egg flipped, etc.).
  onUpdate: (handler) => {
    const listener = (_event, snapshot) => handler(snapshot);
    ipcRenderer.on("settings:update", listener);
    return () => ipcRenderer.removeListener("settings:update", listener);
  },
});
