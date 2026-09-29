// onp_settings.h -- user settings (WallpaperSettings.swift keys/defaults),
// persisted to %APPDATA%\BDONImmersiveHome\settings.json, plus the log file at
// %LOCALAPPDATA%\BDONImmersiveHome\log.txt and shared path helpers.

#pragma once

#include <set>
#include <string>
#include <vector>

namespace onp {

enum class ShuffleInterval { minute1, minutes5, minutes10, minutes30, hour1 };

int shuffleIntervalSeconds(ShuffleInterval i);
const char* shuffleIntervalLabel(ShuffleInterval i);   // Korean, matches SettingsView
const char* shuffleIntervalKey(ShuffleInterval i);     // JSON string value
ShuffleInterval shuffleIntervalFromKey(const std::string& s);

enum class EasterEgg { none, tomoTaki, anonSoyo };
const char* easterEggKey(EasterEgg e);
EasterEgg easterEggFromKey(const std::string& s);
const char* easterEggLabel(EasterEgg e);   // "토모타키 모드" / "아논소요 모드" / nullptr

struct Settings {
    std::string spotId = "30001";
    bool showCharacters = true;
    bool cursorParallax = true;
    bool shuffle = false;
    std::set<std::string> shufflePool;   // empty on first run -> filled with all ids
    ShuffleInterval shuffleInterval = ShuffleInterval::minutes10;
    EasterEgg easterEgg = EasterEgg::none;

    void load();                         // reads settings.json, applies defaults
    void save() const;                   // writes settings.json (creates dir)
};

// Paths (created on demand).
std::wstring appDataDir();       // %APPDATA%\BDONImmersiveHome
std::wstring localAppDataDir();  // %LOCALAPPDATA%\BDONImmersiveHome
std::string settingsJsonPath();  // UTF-8

// Where the bundled data/ lives: next to the exe (package layout) or the repo.
std::string dataRoot();          // .../data  (spots, thumbs, bands)
std::string spotsDir();          // dataRoot()/spots

// Logging (SPEC behaviour 7): spot loads, errors, HARDWARE/WARP, memory.
void logInit();
void logLine(const std::string& line);
void logMemoryTick();            // called from the main loop every 5 min

} // namespace onp
