// onp_install.h -- per-user install / uninstall / start-with-Windows.
#pragma once
#include <string>

namespace onp {

// Tray command that quits the app (posted by the installer to a running copy).
constexpr unsigned kQuitCommand = 103;

std::wstring currentExePath();
std::wstring installDir();       // %LOCALAPPDATA%\Programs\BDON Immersive Home
bool isInstalledCopy();

// Outside the install folder: ask to install (or update). Returns true when
// this process should exit (installed copy launched, or the user cancelled).
bool offerInstall();
bool installUpdateCopy();        // `--update`: same install, no prompt
void uninstall();                // `--uninstall`, from Settings > Apps

bool autostartEnabled();         // HKCU Run points at this exe
void setAutostart(bool on);

}  // namespace onp
