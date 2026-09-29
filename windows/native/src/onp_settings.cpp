// onp_settings.cpp -- see onp_settings.h.
#include "onp_settings.h"

#include <windows.h>
#include <shlobj.h>
#include <psapi.h>

#include <cstdio>
#include <ctime>
#include <fstream>
#include <sstream>

#include "../third_party/json.hpp"

namespace onp {

using json = nlohmann::json;

int shuffleIntervalSeconds(ShuffleInterval i) {
    switch (i) {
        case ShuffleInterval::minute1: return 60;
        case ShuffleInterval::minutes5: return 5 * 60;
        case ShuffleInterval::minutes10: return 10 * 60;
        case ShuffleInterval::minutes30: return 30 * 60;
        case ShuffleInterval::hour1: return 60 * 60;
    }
    return 600;
}
const char* shuffleIntervalLabel(ShuffleInterval i) {
    switch (i) {
        case ShuffleInterval::minute1: return "1\xeb\xb6\x84\xeb\xa7\x88\xeb\x8b\xa4";      // 1분마다
        case ShuffleInterval::minutes5: return "5\xeb\xb6\x84\xeb\xa7\x88\xeb\x8b\xa4";     // 5분마다
        case ShuffleInterval::minutes10: return "10\xeb\xb6\x84\xeb\xa7\x88\xeb\x8b\xa4";   // 10분마다
        case ShuffleInterval::minutes30: return "30\xeb\xb6\x84\xeb\xa7\x88\xeb\x8b\xa4";   // 30분마다
        case ShuffleInterval::hour1: return "1\xec\x8b\x9c\xea\xb0\x84\xeb\xa7\x88\xeb\x8b\xa4"; // 1시간마다
    }
    return "";
}
const char* shuffleIntervalKey(ShuffleInterval i) {
    switch (i) {
        case ShuffleInterval::minute1: return "minute1";
        case ShuffleInterval::minutes5: return "minutes5";
        case ShuffleInterval::minutes10: return "minutes10";
        case ShuffleInterval::minutes30: return "minutes30";
        case ShuffleInterval::hour1: return "hour1";
    }
    return "minutes10";
}
ShuffleInterval shuffleIntervalFromKey(const std::string& s) {
    if (s == "minute1") return ShuffleInterval::minute1;
    if (s == "minutes5") return ShuffleInterval::minutes5;
    if (s == "minutes30") return ShuffleInterval::minutes30;
    if (s == "hour1") return ShuffleInterval::hour1;
    return ShuffleInterval::minutes10;
}

const char* easterEggKey(EasterEgg e) {
    switch (e) {
        case EasterEgg::tomoTaki: return "tomoTaki";
        case EasterEgg::anonSoyo: return "anonSoyo";
        default: return "none";
    }
}
EasterEgg easterEggFromKey(const std::string& s) {
    if (s == "tomoTaki") return EasterEgg::tomoTaki;
    if (s == "anonSoyo") return EasterEgg::anonSoyo;
    return EasterEgg::none;
}
const char* easterEggLabel(EasterEgg e) {
    switch (e) {
        case EasterEgg::tomoTaki: return "\xf0\x9f\x90\xa7 \xed\x86\xa0\xeb\xaa\xa8\xed\x83\x80\xed\x82\xa4 \xeb\xaa\xa8\xeb\x93\x9c"; // 🐧 토모타키 모드
        case EasterEgg::anonSoyo: return "\xec\x95\x84\xeb\x85\xb8\xec\x86\x8c\xec\x9a\x94 \xeb\xaa\xa8\xeb\x93\x9c";                 // 아논소요 모드
        default: return nullptr;
    }
}

// ---- paths ----

static std::wstring knownFolder(REFKNOWNFOLDERID id) {
    PWSTR p = nullptr;
    std::wstring out;
    if (SUCCEEDED(SHGetKnownFolderPath(id, 0, nullptr, &p))) out = p;
    if (p) CoTaskMemFree(p);
    return out;
}

static void ensureDir(const std::wstring& dir) {
    CreateDirectoryW(dir.c_str(), nullptr);
}

std::wstring appDataDir() {
    std::wstring d = knownFolder(FOLDERID_RoamingAppData) + L"\\BDONImmersiveHome";
    ensureDir(d);
    return d;
}
std::wstring localAppDataDir() {
    std::wstring d = knownFolder(FOLDERID_LocalAppData) + L"\\BDONImmersiveHome";
    ensureDir(d);
    return d;
}

static std::string wideToUtf8(const std::wstring& w) {
    if (w.empty()) return {};
    int n = WideCharToMultiByte(CP_UTF8, 0, w.c_str(), (int)w.size(), nullptr, 0, nullptr, nullptr);
    std::string s(n, 0);
    WideCharToMultiByte(CP_UTF8, 0, w.c_str(), (int)w.size(), s.data(), n, nullptr, nullptr);
    return s;
}

std::string settingsJsonPath() {
    return wideToUtf8(appDataDir()) + "\\settings.json";
}

static std::string exeDir() {
    wchar_t buf[MAX_PATH];
    GetModuleFileNameW(nullptr, buf, MAX_PATH);
    std::wstring p = buf;
    size_t slash = p.find_last_of(L"\\/");
    return wideToUtf8(slash == std::wstring::npos ? p : p.substr(0, slash));
}

std::string dataRoot() {
    std::string exe = exeDir();
    // Package layout: <exe dir>\data. Repo layout: fall back to Resources/web.
    std::string candidate = exe + "\\data";
    DWORD attr = GetFileAttributesA(candidate.c_str());
    if (attr != INVALID_FILE_ATTRIBUTES && (attr & FILE_ATTRIBUTE_DIRECTORY)) return candidate;
    return exe + "\\data";
}
std::string spotsDir() { return dataRoot() + "\\spots"; }

// ---- Settings ----

void Settings::load() {
    std::ifstream f(settingsJsonPath(), std::ios::binary);
    if (!f) return;   // keep defaults; shufflePool filled by caller from catalog
    std::ostringstream ss; ss << f.rdbuf();
    try {
        json j = json::parse(ss.str());
        spotId = j.value("spotId", spotId);
        showCharacters = j.value("showCharacters", showCharacters);
        cursorParallax = j.value("cursorParallax", cursorParallax);
        shuffle = j.value("shuffle", shuffle);
        if (j.contains("shufflePool"))
            for (const auto& id : j["shufflePool"]) shufflePool.insert(id.get<std::string>());
        shuffleInterval = shuffleIntervalFromKey(j.value("shuffleInterval", std::string("minutes10")));
        easterEgg = easterEggFromKey(j.value("easterEgg", std::string("none")));
    } catch (...) {
        // Corrupt file -> defaults.
    }
}

void Settings::save() const {
    json j;
    j["spotId"] = spotId;
    j["showCharacters"] = showCharacters;
    j["cursorParallax"] = cursorParallax;
    j["shuffle"] = shuffle;
    j["shufflePool"] = std::vector<std::string>(shufflePool.begin(), shufflePool.end());
    j["shuffleInterval"] = shuffleIntervalKey(shuffleInterval);
    j["easterEgg"] = easterEggKey(easterEgg);
    std::ofstream f(settingsJsonPath(), std::ios::binary);
    if (f) f << j.dump(1, '\t');
}

// ---- logging ----

static std::string g_logPath;

static std::string timestamp() {
    SYSTEMTIME st;
    GetLocalTime(&st);
    char buf[32];
    std::snprintf(buf, sizeof(buf), "%04d-%02d-%02d %02d:%02d:%02d",
                  st.wYear, st.wMonth, st.wDay, st.wHour, st.wMinute, st.wSecond);
    return buf;
}

void logInit() {
    // Release builds leave no log on the user's machine. Set BDON_LOG=1 to
    // get %LOCALAPPDATA%\BDONImmersiveHome\log.txt while debugging.
    std::wstring dir = localAppDataDir();
    std::wstring path = dir + L"\\log.txt";
    wchar_t flag[8] = {};
    bool enabled = GetEnvironmentVariableW(L"BDON_LOG", flag, 8) > 0 && flag[0] == L'1';
    if (!enabled) {
        DeleteFileW(path.c_str());         // drop a log left by an older build
        RemoveDirectoryW(dir.c_str());     // only succeeds when nothing else is in it
        return;
    }
    g_logPath = wideToUtf8(path);
    logLine("=== BDONImmersiveHome started ===");
}

void logLine(const std::string& line) {
    if (g_logPath.empty()) return;
    std::ofstream f(g_logPath, std::ios::app | std::ios::binary);
    if (f) f << timestamp() << "  " << line << "\n";
}

void logMemoryTick() {
    PROCESS_MEMORY_COUNTERS pmc = {};
    if (GetProcessMemoryInfo(GetCurrentProcess(), &pmc, sizeof(pmc))) {
        char buf[128];
        std::snprintf(buf, sizeof(buf), "memory: working set %llu MB",
                      (unsigned long long)(pmc.WorkingSetSize / (1024 * 1024)));
        logLine(buf);
    }
}

} // namespace onp
