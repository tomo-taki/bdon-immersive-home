// onp_update.h -- self-update from GitHub Releases (Updater.swift parity).
//
//   GET api.github.com/repos/<repo>/releases/latest
//     tag "b<commit count>" > BDON_BUILD_NUMBER  -> an update exists
//     asset BDONImmersiveHome-Native-win-<arch>.zip + SHA256SUMS.txt
//   download -> SHA-256 (bcrypt) -> tar.exe -xf -> run the new exe with
//   --update: it quits this copy, copies itself over the install folder and
//   starts the installed exe (the same path as the zip's install offer).
#pragma once
#include <windows.h>
#include <string>

namespace onp {

enum class UpdateState { Idle, Checking, UpToDate, Available, Downloading, Installing, Failed };

struct UpdateStatus {
    UpdateState state = UpdateState::Idle;
    std::string title;      // "2026.09.29 (5786b63)", UTF-8
    int percent = 0;        // while downloading
};

// Checks shortly after start and then daily; posts `message` to `notify`
// whenever the status changes. No-op for dev builds (no build number).
void startUpdateChecks(HWND notify, UINT message);
void checkForUpdate();
void installUpdate();              // only when state == Available
UpdateStatus updateStatus();

// `--update`: this extracted copy replaces the installed one. Returns true
// when the process should exit.
bool applyDownloadedUpdate();

}  // namespace onp
