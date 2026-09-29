// preload-wallpaper.js — Bridge for the Spot renderer page.
//
// The renderer (web/src/main.ts) reports load errors / context loss by calling
//   window.webkit.messageHandlers.wallpaper.postMessage({ event, dir, message })
// (a WebKit convention). We provide that shim so the *unmodified* page bundle
// runs under Electron, and forward each message to the main process over IPC.
//
// contextIsolation is ON and nodeIntegration is OFF, so the page only ever sees
// this shim, never Node. The shim lives on the isolated `window`; the page's
// bundle runs in the main world, so we expose it into the main world too.

"use strict";

const { contextBridge, ipcRenderer } = require("electron");

const forward = (message) => {
  try {
    ipcRenderer.send("wallpaper-event", message);
  } catch {
    // ignore — a lost bridge just means no retry hint reaches the main process
  }
};

// The page reads window.webkit?.messageHandlers?.wallpaper?.postMessage.
// contextBridge puts this on the *main-world* window, which is where the
// bundle's `post()` looks.
contextBridge.exposeInMainWorld("webkit", {
  messageHandlers: {
    wallpaper: {
      postMessage: forward,
    },
  },
});
