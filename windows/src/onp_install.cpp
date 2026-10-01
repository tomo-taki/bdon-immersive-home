// onp_install.cpp -- per-user install / uninstall / start-with-Windows.
//
// The zip ships the app folder as is. Running BDONImmersiveHome.exe from
// anywhere but the install folder offers to install it:
//   %LOCALAPPDATA%\Programs\BDON Immersive Home\   (exe + data, no admin)
//   Start menu shortcut, "start with Windows" (HKCU Run), and an entry in
//   Settings > Apps whose uninstall runs `BDONImmersiveHome.exe --uninstall`.
// Settings in %APPDATA%\BDONImmersiveHome are kept on uninstall.

#ifndef WIN32_LEAN_AND_MEAN
#define WIN32_LEAN_AND_MEAN
#endif
#include <windows.h>
#include <shellapi.h>
#include <shlobj.h>
#include <shobjidl.h>
#include <objbase.h>

#include <cstring>
#include <string>

#include "onp_install.h"
#include "onp_settings.h"

#ifndef BDON_BUILD_DATE
#define BDON_BUILD_DATE "dev"
#endif

namespace onp {

static const wchar_t* kAppName = L"BDON Immersive Home";
static const wchar_t* kRunKey = L"Software\\Microsoft\\Windows\\CurrentVersion\\Run";
static const wchar_t* kUninstallKey = L"Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\BDONImmersiveHome";

static std::wstring knownFolderPath(REFKNOWNFOLDERID id) {
    PWSTR p = nullptr;
    std::wstring out;
    if (SUCCEEDED(SHGetKnownFolderPath(id, 0, nullptr, &p))) out = p;
    CoTaskMemFree(p);
    return out;
}

std::wstring currentExePath() {
    wchar_t buf[MAX_PATH * 2] = {};
    GetModuleFileNameW(nullptr, buf, (DWORD)(sizeof(buf) / sizeof(buf[0])));
    return buf;
}

static std::wstring dirOf(const std::wstring& path) {
    size_t slash = path.find_last_of(L"\\/");
    return slash == std::wstring::npos ? path : path.substr(0, slash);
}

std::wstring installDir() {
    return knownFolderPath(FOLDERID_LocalAppData) + L"\\Programs\\" + kAppName;
}

static std::wstring installedExe() { return installDir() + L"\\BDONImmersiveHome.exe"; }

static std::wstring shortcutPath() {
    return knownFolderPath(FOLDERID_Programs) + L"\\" + kAppName + L".lnk";
}

bool isInstalledCopy() {
    return lstrcmpiW(dirOf(currentExePath()).c_str(), installDir().c_str()) == 0;
}

// ---- start with Windows ----

bool autostartEnabled() {
    wchar_t value[MAX_PATH * 2] = {};
    DWORD size = sizeof(value);
    if (RegGetValueW(HKEY_CURRENT_USER, kRunKey, kAppName, RRF_RT_REG_SZ, nullptr, value, &size) != ERROR_SUCCESS)
        return false;
    std::wstring expected = L"\"" + currentExePath() + L"\"";
    return lstrcmpiW(value, expected.c_str()) == 0;
}

void setAutostart(bool on) {
    HKEY key;
    if (RegCreateKeyExW(HKEY_CURRENT_USER, kRunKey, 0, nullptr, 0, KEY_SET_VALUE, nullptr, &key, nullptr) != ERROR_SUCCESS)
        return;
    if (on) {
        std::wstring cmd = L"\"" + currentExePath() + L"\"";
        RegSetValueExW(key, kAppName, 0, REG_SZ, (const BYTE*)cmd.c_str(), (DWORD)((cmd.size() + 1) * sizeof(wchar_t)));
    } else {
        RegDeleteValueW(key, kAppName);
    }
    RegCloseKey(key);
    logLine(std::string("start with Windows: ") + (on ? "on" : "off"));
}

// ---- helpers ----

static void setString(HKEY key, const wchar_t* name, const std::wstring& value) {
    RegSetValueExW(key, name, 0, REG_SZ, (const BYTE*)value.c_str(), (DWORD)((value.size() + 1) * sizeof(wchar_t)));
}

static void setDword(HKEY key, const wchar_t* name, DWORD value) {
    RegSetValueExW(key, name, 0, REG_DWORD, (const BYTE*)&value, sizeof(value));
}

static bool createShortcut(const std::wstring& target, const std::wstring& lnk) {
    IShellLinkW* link = nullptr;
    if (FAILED(CoCreateInstance(CLSID_ShellLink, nullptr, CLSCTX_INPROC_SERVER, IID_IShellLinkW, (void**)&link)))
        return false;
    link->SetPath(target.c_str());
    link->SetWorkingDirectory(dirOf(target).c_str());
    link->SetIconLocation(target.c_str(), 0);
    IPersistFile* file = nullptr;
    bool ok = SUCCEEDED(link->QueryInterface(IID_IPersistFile, (void**)&file)) && SUCCEEDED(file->Save(lnk.c_str(), TRUE));
    if (file) file->Release();
    link->Release();
    return ok;
}

// Ask a running copy (any location) to quit, and wait for it to let go.
static void stopRunningCopy() {
    HWND main = FindWindowW(L"BDONImmersiveHomeWnd", L"BDONImmersiveHomeMain");
    if (!main) return;
    DWORD pid = 0;
    GetWindowThreadProcessId(main, &pid);
    PostMessageW(main, WM_COMMAND, kQuitCommand, 0);
    HANDLE proc = OpenProcess(SYNCHRONIZE, FALSE, pid);
    if (proc) {
        WaitForSingleObject(proc, 8000);
        CloseHandle(proc);
    }
}

static void launch(const std::wstring& exe) {
    ShellExecuteW(nullptr, L"open", exe.c_str(), nullptr, dirOf(exe).c_str(), SW_SHOWNORMAL);
}

// ---- install ----

static bool install(bool silent) {
    stopRunningCopy();
    std::wstring from = dirOf(currentExePath()) + L"\\*";
    from.push_back(L'\0');                       // SHFileOperation wants double NUL
    std::wstring to = installDir();
    to.push_back(L'\0');
    SHFILEOPSTRUCTW op = {};
    op.wFunc = FO_COPY;
    op.pFrom = from.c_str();
    op.pTo = to.c_str();
    op.fFlags = FOF_NOCONFIRMATION | FOF_NOCONFIRMMKDIR | FOF_SIMPLEPROGRESS | (silent ? FOF_NOERRORUI : 0);
    op.lpszProgressTitle = L"BDON Immersive Home \uC124\uCE58 \uC911";   // 설치 중
    if (SHFileOperationW(&op) != 0 || op.fAnyOperationsAborted) {
        logLine("install: copy failed or cancelled");
        return false;
    }

    std::wstring exe = installedExe();
    createShortcut(exe, shortcutPath());

    HKEY key;
    if (RegCreateKeyExW(HKEY_CURRENT_USER, kUninstallKey, 0, nullptr, 0, KEY_SET_VALUE, nullptr, &key, nullptr) == ERROR_SUCCESS) {
        setString(key, L"DisplayName", kAppName);
        setString(key, L"DisplayIcon", exe);
        const char* date = BDON_BUILD_DATE;
        setString(key, L"DisplayVersion", std::wstring(date, date + strlen(date)));
        setString(key, L"Publisher", L"Tomo Taki");
        setString(key, L"InstallLocation", installDir());
        setString(key, L"UninstallString", L"\"" + exe + L"\" --uninstall");
        setDword(key, L"NoModify", 1);
        setDword(key, L"NoRepair", 1);
        RegCloseKey(key);
    }

    // Start with Windows, pointing at the installed copy.
    HKEY run;
    if (RegCreateKeyExW(HKEY_CURRENT_USER, kRunKey, 0, nullptr, 0, KEY_SET_VALUE, nullptr, &run, nullptr) == ERROR_SUCCESS) {
        setString(run, kAppName, L"\"" + exe + L"\"");
        RegCloseKey(run);
    }
    logLine("installed to install dir; start with Windows on");
    launch(exe);
    return true;
}

bool offerInstall() {
    if (isInstalledCopy()) return false;
    bool update = GetFileAttributesW(installedExe().c_str()) != INVALID_FILE_ATTRIBUTES;
    const wchar_t* text = update
        ? L"\uC124\uCE58\uB41C BDON Immersive Home\uC744 \uC774 \uBC84\uC804\uC73C\uB85C \uC5C5\uB370\uC774\uD2B8\uD560\uAE4C\uC694?"
          // 설치된 BDON Immersive Home을 이 버전으로 업데이트할까요?
        : L"BDON Immersive Home\uC744 \uC124\uCE58\uD560\uAE4C\uC694?\n\n"
          L"\uC2DC\uC791 \uBA54\uB274\uC5D0 \uCD94\uAC00\uD558\uACE0 Windows\uB97C \uC2DC\uC791\uD560 \uB54C \uC790\uB3D9\uC73C\uB85C \uC2E4\uD589\uD569\uB2C8\uB2E4.\n"
          L"[\uC544\uB2C8\uC694]\uB97C \uB204\uB974\uBA74 \uC124\uCE58\uD558\uC9C0 \uC54A\uACE0 \uC774 \uD3F4\uB354\uC5D0\uC11C \uC2E4\uD589\uD569\uB2C8\uB2E4.";
          // BDON Immersive Home을 설치할까요? / 시작 메뉴에 추가하고 Windows를 시작할 때 자동으로 실행합니다.
          // [아니요]를 누르면 설치하지 않고 이 폴더에서 실행합니다.
    int answer = MessageBoxW(nullptr, text, kAppName, MB_YESNOCANCEL | MB_ICONQUESTION | MB_SETFOREGROUND);
    if (answer == IDCANCEL) return true;         // quit without running
    if (answer == IDNO) return false;            // run portable
    if (install(false)) return true;
    MessageBoxW(nullptr, L"\uC124\uCE58\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.", kAppName, MB_OK | MB_ICONWARNING);  // 설치하지 못했습니다.
    return false;
}

bool installUpdateCopy() {
    if (isInstalledCopy()) return false;
    if (install(true)) return true;
    launch(installedExe());      // copy failed: bring the old version back up
    return false;
}

// ---- uninstall ----

void uninstall() {
    int answer = MessageBoxW(nullptr, L"BDON Immersive Home\uC744 \uC81C\uAC70\uD560\uAE4C\uC694?",   // 제거할까요?
                             kAppName, MB_YESNO | MB_ICONQUESTION | MB_SETFOREGROUND);
    if (answer != IDYES) return;
    stopRunningCopy();
    HKEY run;
    if (RegOpenKeyExW(HKEY_CURRENT_USER, kRunKey, 0, KEY_SET_VALUE, &run) == ERROR_SUCCESS) {
        RegDeleteValueW(run, kAppName);
        RegCloseKey(run);
    }
    DeleteFileW(shortcutPath().c_str());
    RegDeleteTreeW(HKEY_CURRENT_USER, kUninstallKey);

    // The folder holds this very exe: let a detached cmd remove it after we exit.
    std::wstring dir = installDir();
    std::wstring cmd = L"cmd.exe /c timeout /t 2 /nobreak >nul & rmdir /s /q \"" + dir + L"\"";
    std::wstring temp = knownFolderPath(FOLDERID_LocalAppData) + L"\\Temp";
    STARTUPINFOW si = {sizeof(si)};
    si.dwFlags = STARTF_USESHOWWINDOW;
    si.wShowWindow = SW_HIDE;
    PROCESS_INFORMATION pi = {};
    if (CreateProcessW(nullptr, cmd.data(), nullptr, nullptr, FALSE, CREATE_NO_WINDOW | DETACHED_PROCESS,
                       nullptr, temp.c_str(), &si, &pi)) {
        CloseHandle(pi.hThread);
        CloseHandle(pi.hProcess);
    }
    logLine("uninstalled");
    MessageBoxW(nullptr, L"\uC81C\uAC70\uD588\uC2B5\uB2C8\uB2E4.", kAppName, MB_OK | MB_ICONINFORMATION);   // 제거했습니다.
}

}  // namespace onp
