// onp_update.cpp -- see onp_update.h. All network and file work runs on one
// worker thread; the UI reads updateStatus() after a posted message.

#ifndef WIN32_LEAN_AND_MEAN
#define WIN32_LEAN_AND_MEAN
#endif
#include <windows.h>
#include <winhttp.h>
#include <bcrypt.h>
#include <shlobj.h>

#include <cstdio>
#include <cstdlib>
#include <mutex>
#include <string>
#include <thread>
#include <vector>

#include "../third_party/json.hpp"
#include "onp_install.h"
#include "onp_settings.h"
#include "onp_update.h"

#ifndef BDON_BUILD_NUMBER
#define BDON_BUILD_NUMBER 0
#endif
#ifndef BDON_UPDATE_REPO
#define BDON_UPDATE_REPO "tomo-taki/bdon-immersive-home"
#endif

namespace onp {

namespace {

#if defined(_M_ARM64) || defined(__aarch64__)
const char* kPackage = "BDONImmersiveHome-win-arm64.zip";
#else
const char* kPackage = "BDONImmersiveHome-win-x64.zip";
#endif
const char* kChecksums = "SHA256SUMS.txt";
const char* kDefaultApi = "https://api.github.com";
const wchar_t* kUserAgent = L"BDONImmersiveHome";
const DWORD kFirstCheckMs = 15 * 1000;
const DWORD kCheckEveryMs = 24 * 60 * 60 * 1000;

std::mutex g_mutex;
UpdateStatus g_status;
std::string g_packageUrl, g_checksumUrl;
HWND g_notify = nullptr;
UINT g_message = 0;
bool g_busy = false;

void setStatus(UpdateState state, int percent = 0, const std::string* title = nullptr) {
    {
        std::lock_guard<std::mutex> lock(g_mutex);
        g_status.state = state;
        g_status.percent = percent;
        if (title) g_status.title = *title;
    }
    if (g_notify) PostMessageW(g_notify, g_message, 0, 0);
}

std::wstring widen(const std::string& s) {
    int n = MultiByteToWideChar(CP_UTF8, 0, s.c_str(), -1, nullptr, 0);
    std::wstring w(n, 0);
    MultiByteToWideChar(CP_UTF8, 0, s.c_str(), -1, w.data(), n);
    if (!w.empty() && w.back() == L'\0') w.pop_back();
    return w;
}

std::string apiBase() {
    const char* qa = std::getenv("BDON_UPDATE_API");   // QA: a local fake releases/latest
    return qa && *qa ? qa : kDefaultApi;
}

// GET `url` (redirects followed). Body goes to `out`, or to `file` when given.
bool httpGet(const std::string& url, std::string* out, const std::wstring* file = nullptr) {
    std::wstring wurl = widen(url);
    URL_COMPONENTS parts = {sizeof(parts)};
    wchar_t host[256] = {}, path[2048] = {};
    parts.lpszHostName = host; parts.dwHostNameLength = 256;
    parts.lpszUrlPath = path; parts.dwUrlPathLength = 2048;
    wchar_t extra[2048] = {};
    parts.lpszExtraInfo = extra; parts.dwExtraInfoLength = 2048;
    if (!WinHttpCrackUrl(wurl.c_str(), 0, 0, &parts)) return false;
    std::wstring target = std::wstring(path) + extra;
    bool secure = parts.nScheme == INTERNET_SCHEME_HTTPS;

    HINTERNET session = WinHttpOpen(kUserAgent, WINHTTP_ACCESS_TYPE_AUTOMATIC_PROXY, nullptr, nullptr, 0);
    HINTERNET connect = session ? WinHttpConnect(session, host, parts.nPort, 0) : nullptr;
    HINTERNET request = connect ? WinHttpOpenRequest(connect, L"GET", target.c_str(), nullptr, nullptr, nullptr,
                                                     secure ? WINHTTP_FLAG_SECURE : 0) : nullptr;
    bool ok = request &&
              WinHttpSendRequest(request, L"Accept: application/vnd.github+json\r\n", (DWORD)-1, nullptr, 0, 0, 0) &&
              WinHttpReceiveResponse(request, nullptr);
    DWORD statusCode = 0, size = sizeof(statusCode);
    if (ok) {
        WinHttpQueryHeaders(request, WINHTTP_QUERY_STATUS_CODE | WINHTTP_QUERY_FLAG_NUMBER, nullptr, &statusCode, &size, nullptr);
        ok = statusCode == 200;
    }
    DWORD total = 0;
    size = sizeof(total);
    if (ok) WinHttpQueryHeaders(request, WINHTTP_QUERY_CONTENT_LENGTH | WINHTTP_QUERY_FLAG_NUMBER, nullptr, &total, &size, nullptr);

    FILE* fp = nullptr;
    if (ok && file) ok = _wfopen_s(&fp, file->c_str(), L"wb") == 0;
    std::vector<char> buffer(1 << 16);
    unsigned long long received = 0;
    int lastPercent = -1;
    while (ok) {
        DWORD read = 0;
        if (!WinHttpReadData(request, buffer.data(), (DWORD)buffer.size(), &read)) { ok = false; break; }
        if (read == 0) break;
        received += read;
        if (fp) {
            ok = fwrite(buffer.data(), 1, read, fp) == read;
            int percent = total ? (int)(received * 100 / total) : 0;
            if (percent != lastPercent) { lastPercent = percent; setStatus(UpdateState::Downloading, percent); }
        } else {
            out->append(buffer.data(), read);
        }
    }
    if (fp) fclose(fp);
    if (request) WinHttpCloseHandle(request);
    if (connect) WinHttpCloseHandle(connect);
    if (session) WinHttpCloseHandle(session);
    return ok;
}

std::string sha256(const std::wstring& file) {
    BCRYPT_ALG_HANDLE alg = nullptr;
    BCRYPT_HASH_HANDLE hash = nullptr;
    std::string hex;
    if (BCryptOpenAlgorithmProvider(&alg, BCRYPT_SHA256_ALGORITHM, nullptr, 0) != 0) return hex;
    FILE* fp = nullptr;
    if (BCryptCreateHash(alg, &hash, nullptr, 0, nullptr, 0, 0) == 0 && _wfopen_s(&fp, file.c_str(), L"rb") == 0) {
        std::vector<unsigned char> buffer(1 << 20);
        size_t n;
        while ((n = fread(buffer.data(), 1, buffer.size(), fp)) > 0) BCryptHashData(hash, buffer.data(), (ULONG)n, 0);
        fclose(fp);
        unsigned char digest[32];
        if (BCryptFinishHash(hash, digest, sizeof(digest), 0) == 0) {
            char b[3];
            for (unsigned char c : digest) { std::snprintf(b, sizeof(b), "%02x", c); hex += b; }
        }
    }
    if (hash) BCryptDestroyHash(hash);
    BCryptCloseAlgorithmProvider(alg, 0);
    return hex;
}

// "hex  name" lines (sha256sum format).
std::string checksumFor(const std::string& sums, const std::string& name) {
    size_t start = 0;
    while (start < sums.size()) {
        size_t end = sums.find('\n', start);
        std::string line = sums.substr(start, end == std::string::npos ? std::string::npos : end - start);
        start = end == std::string::npos ? sums.size() : end + 1;
        if (!line.empty() && line.back() == '\r') line.pop_back();
        size_t space = line.find(' ');
        if (space == std::string::npos) continue;
        size_t nameAt = line.find_first_not_of(" *", space);
        if (nameAt != std::string::npos && line.substr(nameAt) == name) return line.substr(0, space);
    }
    return {};
}

std::wstring updateDir() {
    PWSTR p = nullptr;
    std::wstring dir;
    if (SUCCEEDED(SHGetKnownFolderPath(FOLDERID_LocalAppData, 0, nullptr, &p))) dir = std::wstring(p) + L"\\BDONImmersiveHome\\update";
    CoTaskMemFree(p);
    return dir;
}

bool run(std::wstring cmd, bool wait) {
    STARTUPINFOW si = {sizeof(si)};
    si.dwFlags = STARTF_USESHOWWINDOW;
    si.wShowWindow = SW_HIDE;
    PROCESS_INFORMATION pi = {};
    if (!CreateProcessW(nullptr, cmd.data(), nullptr, nullptr, FALSE, CREATE_NO_WINDOW, nullptr, nullptr, &si, &pi))
        return false;
    DWORD code = 0;
    if (wait) {
        WaitForSingleObject(pi.hProcess, INFINITE);
        GetExitCodeProcess(pi.hProcess, &code);
    }
    CloseHandle(pi.hThread);
    CloseHandle(pi.hProcess);
    return code == 0;
}

// ---- worker bodies ----

void doCheck() {
    setStatus(UpdateState::Checking);
    std::string body;
    if (!httpGet(apiBase() + "/repos/" BDON_UPDATE_REPO "/releases/latest", &body)) {
        setStatus(UpdateState::Failed);
        return;
    }
    try {
        auto j = nlohmann::json::parse(body);
        std::string tag = j.value("tag_name", "");
        size_t digit = tag.find_first_of("0123456789");
        int build = digit == std::string::npos ? 0 : std::atoi(tag.c_str() + digit);
        std::string package, checksums;
        for (const auto& a : j["assets"]) {
            std::string name = a.value("name", "");
            if (name == kPackage) package = a.value("browser_download_url", "");
            if (name == kChecksums) checksums = a.value("browser_download_url", "");
        }
        if (build <= BDON_BUILD_NUMBER) {
            setStatus(UpdateState::UpToDate);
            return;
        }

        // A newer release without our file (e.g. renamed asset) is not "up to date".
        if (package.empty() || checksums.empty()) {
            logLine("update " + tag + " has no " + kPackage);
            setStatus(UpdateState::MissingPackage);
            return;
        }
        std::string title = j.value("name", tag);
        {
            std::lock_guard<std::mutex> lock(g_mutex);
            g_packageUrl = package;
            g_checksumUrl = checksums;
        }
        logLine("update available: " + tag);
        setStatus(UpdateState::Available, 0, &title);
    } catch (...) {
        setStatus(UpdateState::Failed);
    }
}

void doInstall() {
    std::string package, checksums;
    {
        std::lock_guard<std::mutex> lock(g_mutex);
        package = g_packageUrl;
        checksums = g_checksumUrl;
    }
    auto fail = [](const char* why) { logLine(std::string("update failed: ") + why); setStatus(UpdateState::Failed); };

    std::wstring dir = updateDir();
    std::wstring zip = dir + L"\\package.zip", unpacked = dir + L"\\app";
    run(L"cmd.exe /c rmdir /s /q \"" + dir + L"\"", true);
    SHCreateDirectoryExW(nullptr, unpacked.c_str(), nullptr);

    std::string sums;
    if (!httpGet(checksums, &sums)) return fail("checksums");
    std::string expected = checksumFor(sums, kPackage);
    setStatus(UpdateState::Downloading, 0);
    if (expected.empty() || !httpGet(package, nullptr, &zip)) return fail("download");
    if (sha256(zip) != expected) return fail("checksum mismatch");

    setStatus(UpdateState::Installing);
    // tar.exe (bsdtar, in System32 since Windows 10 1803) reads zip.
    wchar_t system[MAX_PATH] = {};
    GetSystemDirectoryW(system, MAX_PATH);
    if (!run(L"\"" + std::wstring(system) + L"\\tar.exe\" -xf \"" + zip + L"\" -C \"" + unpacked + L"\"", true))
        return fail("unpack");

    std::wstring exe = unpacked + L"\\BDONImmersiveHome\\BDONImmersiveHome.exe";
    if (GetFileAttributesW(exe.c_str()) == INVALID_FILE_ATTRIBUTES) exe = unpacked + L"\\BDONImmersiveHome.exe";
    if (GetFileAttributesW(exe.c_str()) == INVALID_FILE_ATTRIBUTES) return fail("no exe in package");

    // The new copy quits this one, installs itself and starts the installed exe.
    if (!run(L"\"" + exe + L"\" --update", false)) return fail("launch");
}

void worker(void (*body)()) {
    body();
    std::lock_guard<std::mutex> lock(g_mutex);
    g_busy = false;
}

bool beginWork(void (*body)()) {
    {
        std::lock_guard<std::mutex> lock(g_mutex);
        if (g_busy) return false;
        g_busy = true;
    }
    std::thread(worker, body).detach();
    return true;
}

}  // namespace

void startUpdateChecks(HWND notify, UINT message) {
    g_notify = notify;
    g_message = message;
    if (BDON_BUILD_NUMBER <= 0) return;   // dev build: nothing to compare against
    std::thread([] {
        Sleep(kFirstCheckMs);
        // The previous update's download and unpacked copy are done with.
        if (isInstalledCopy()) run(L"cmd.exe /c rmdir /s /q \"" + updateDir() + L"\"", true);
        for (;;) {
            if (updateStatus().state != UpdateState::Available) beginWork(doCheck);
            Sleep(kCheckEveryMs);
        }
    }).detach();
}

void checkForUpdate() { beginWork(doCheck); }

void installUpdate() {
    if (updateStatus().state == UpdateState::Available) beginWork(doInstall);
}

UpdateStatus updateStatus() {
    std::lock_guard<std::mutex> lock(g_mutex);
    return g_status;
}

bool applyDownloadedUpdate() {
    return installUpdateCopy();
}

}  // namespace onp
