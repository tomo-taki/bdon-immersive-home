// worker-w.js — Attach a BrowserWindow behind the desktop icons on Windows.
//
// The Windows "live wallpaper" trick: Progman (the desktop) owns a hidden
// WorkerW window that sits *behind* the SHELLDLL_DefView (the icon layer).
// We ask Progman to spawn that WorkerW (undocumented message 0x052C), find it,
// then SetParent our own HWND into it and size it to the target monitor.
//
//   Progman ── SHELLDLL_DefView ── (icons)
//          └── WorkerW  ◄── our window goes here (drawn under the icons)
//
// On Win11 24H2+ the WorkerW can be a *child* of Progman rather than a sibling,
// so we look in both places.
//
// Everything here is a no-op that returns false off Windows, so the same code
// path is skipped on the macOS dev build (which passes --dev-mac).
//
// koffi API used here was verified against koffi 3.3.2:
//   lib.func('__stdcall', name, ret, params)   — declare a Win32 function
//   koffi.register(fn, koffi.pointer(proto))    — make a C callback
//   koffi.decode(buffer, 'void *')              — reinterpret a Buffer as HWND

"use strict";

const os = require("os");

const IS_WINDOWS = process.platform === "win32";

// ---- Win32 constants -------------------------------------------------------

const WM_SPAWN_WORKER_W = 0x052c; // undocumented Progman message
const SMTO_NORMAL = 0x0000;
const SPAWN_TIMEOUT_MS = 1000;

// SetWindowPos flags: no activate, no z-order change, show the window.
const SWP_NOACTIVATE = 0x0010;
const SWP_NOZORDER = 0x0004;
const SWP_SHOWWINDOW = 0x0040;
const SWP_FLAGS = SWP_NOACTIVATE | SWP_NOZORDER | SWP_SHOWWINDOW;

// GetWindowLongPtr / SetWindowLongPtr index for the window style.
const GWL_STYLE = -16;
const WS_CHILD = 0x40000000;
const WS_POPUP = 0x80000000;

let user32 = null;
let loadError = null;

/** Load koffi + user32 on demand; returns the bound functions or null. */
function bindUser32() {
  if (user32 || loadError) {
    return user32;
  }
  try {
    const koffi = require("koffi");
    const lib = koffi.load("user32.dll");

    const HWND = "void *";

    // EnumWindows callback prototype: BOOL CALLBACK EnumProc(HWND, LPARAM).
    const EnumProc = koffi.proto("bool __stdcall EnumProc(void *hwnd, intptr_t lparam)");

    user32 = {
      koffi,
      EnumProcPointer: koffi.pointer(EnumProc),
      FindWindowW: lib.func("__stdcall", "FindWindowW", HWND, ["str16", "str16"]),
      FindWindowExW: lib.func("__stdcall", "FindWindowExW", HWND, [HWND, HWND, "str16", "str16"]),
      SendMessageTimeoutW: lib.func("__stdcall", "SendMessageTimeoutW", "intptr_t", [
        HWND,
        "uint",
        "uintptr_t",
        "intptr_t",
        "uint",
        "uint",
        "void *",
      ]),
      EnumWindows: lib.func("__stdcall", "EnumWindows", "bool", ["void *", "intptr_t"]),
      SetParent: lib.func("__stdcall", "SetParent", HWND, [HWND, HWND]),
      SetWindowPos: lib.func("__stdcall", "SetWindowPos", "bool", [
        HWND,
        HWND,
        "int",
        "int",
        "int",
        "int",
        "uint",
      ]),
      GetWindowLongPtrW: lib.func("__stdcall", "GetWindowLongPtrW", "intptr_t", [HWND, "int"]),
      SetWindowLongPtrW: lib.func("__stdcall", "SetWindowLongPtrW", "intptr_t", [HWND, "int", "intptr_t"]),
    };
    return user32;
  } catch (err) {
    loadError = err;
    return null;
  }
}

/**
 * Ask Progman to create the WorkerW layer and return its HWND (a koffi
 * pointer). Tries the classic sibling-of-Progman arrangement first, then the
 * Win11 child-of-Progman one, and finally falls back to Progman itself.
 */
function findWorkerW(u32) {
  const koffi = u32.koffi;
  const progman = u32.FindWindowW("Progman", null);
  if (!progman) {
    return null;
  }

  // 0x052C / 0xD / 0x1 forces Progman to spawn the WorkerW behind the icons.
  const out = koffi.alloc("intptr_t", 1);
  u32.SendMessageTimeoutW(progman, WM_SPAWN_WORKER_W, 0xd, 0x1, SMTO_NORMAL, SPAWN_TIMEOUT_MS, out);
  u32.SendMessageTimeoutW(progman, WM_SPAWN_WORKER_W, 0x0, 0x0, SMTO_NORMAL, SPAWN_TIMEOUT_MS, out);

  // Classic: a top-level WorkerW that follows the one owning SHELLDLL_DefView.
  let workerW = null;
  const enumProc = (hwnd) => {
    const defView = u32.FindWindowExW(hwnd, null, "SHELLDLL_DefView", null);
    if (defView && !koffi.address(defView) === false && koffi.address(defView) !== 0n) {
      const next = u32.FindWindowExW(null, hwnd, "WorkerW", null);
      if (next && koffi.address(next) !== 0n) {
        workerW = next;
        return false; // stop enumerating
      }
    }
    return true;
  };
  const cb = koffi.register(enumProc, u32.EnumProcPointer);
  try {
    u32.EnumWindows(cb, 0);
  } finally {
    koffi.unregister(cb);
  }
  if (workerW && koffi.address(workerW) !== 0n) {
    return workerW;
  }

  // Win11 24H2+: SHELLDLL_DefView and WorkerW live *inside* Progman.
  const defViewInProgman = u32.FindWindowExW(progman, null, "SHELLDLL_DefView", null);
  if (defViewInProgman && koffi.address(defViewInProgman) !== 0n) {
    const child = u32.FindWindowExW(progman, null, "WorkerW", null);
    if (child && koffi.address(child) !== 0n) {
      return child;
    }
  }
  const bareChild = u32.FindWindowExW(progman, null, "WorkerW", null);
  if (bareChild && koffi.address(bareChild) !== 0n) {
    return bareChild;
  }

  // Attach straight to Progman: icons then paint on top of us, which is what
  // a wallpaper wants.
  return progman;
}

/**
 * Reparent `nativeHandleBuffer` (from BrowserWindow.getNativeWindowHandle())
 * into the WorkerW and size it to the monitor's device-pixel rect.
 *
 * @param {Buffer} nativeHandleBuffer
 * @param {{x:number,y:number,width:number,height:number}} rectPx  physical px
 * @returns {boolean} true when the window was attached
 */
function attachToDesktop(nativeHandleBuffer, rectPx) {
  if (!IS_WINDOWS) {
    return false;
  }
  const u32 = bindUser32();
  if (!u32) {
    return false;
  }
  const koffi = u32.koffi;

  const hwnd = handleFromBuffer(koffi, nativeHandleBuffer);
  if (!hwnd) {
    return false;
  }

  const workerW = findWorkerW(u32);
  if (!workerW) {
    return false;
  }

  // Turn the popup into a child so it clips to and moves with the WorkerW.
  const style = BigInt.asUintN(64, BigInt(u32.GetWindowLongPtrW(hwnd, GWL_STYLE)));
  const childStyle = (style & ~BigInt(WS_POPUP)) | BigInt(WS_CHILD);
  u32.SetWindowLongPtrW(hwnd, GWL_STYLE, BigInt.asIntN(64, childStyle));

  u32.SetParent(hwnd, workerW);

  // Position in the WorkerW's client space. The WorkerW spans the whole
  // virtual desktop starting at the primary monitor's top-left, so the
  // monitor rect (already in physical px) maps straight through.
  u32.SetWindowPos(hwnd, null, rectPx.x, rectPx.y, rectPx.width, rectPx.height, SWP_FLAGS);
  return true;
}

/**
 * Turn Electron's native-handle Buffer into a koffi HWND pointer. The buffer's
 * bytes ARE the HWND value, so decode them straight into a void*.
 */
function handleFromBuffer(koffi, buffer) {
  if (!Buffer.isBuffer(buffer) || buffer.length === 0) {
    return null;
  }
  const value = buffer.length >= 8 ? buffer.readBigUInt64LE(0) : BigInt(buffer.readUInt32LE(0));
  if (value === 0n) {
    return null;
  }
  // Write the address into a uintptr_t slot, then read it back as void *.
  const slot = koffi.alloc("uintptr_t", 1);
  koffi.encode(slot, "uintptr_t", value);
  return koffi.decode(slot, "void *");
}

/** Diagnostic: is the FFI layer usable on this host? */
function status() {
  return {
    platform: process.platform,
    arch: process.arch,
    release: os.release(),
    ffi: IS_WINDOWS ? Boolean(bindUser32()) : false,
    error: loadError ? String(loadError.message || loadError) : null,
  };
}

module.exports = { attachToDesktop, status, IS_WINDOWS };
