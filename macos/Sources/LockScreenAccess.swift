import AppKit

/// Whether a display may get a new lock-screen still. On macOS 26 and later
/// each still stays in the system's wallpaper cache until we delete it, and
/// only Full Disk Access lets us (LockScreenCache). Without it a display keeps
/// the still it has: the settings say why, and the first skip asks once.
final class LockScreenAccess: ObservableObject {
    static let shared = LockScreenAccess()

    private static let askedKey = "lockScreenAccessAsked"
    private static let settingsURL = URL(string: "x-apple.systempreferences:com.apple.preference.security?Privacy_AllFiles")!

    /// The cache is there but closed to us.
    @Published private(set) var blocked = false
    /// Access arrived while running (System Settings may instead relaunch the app).
    var onGranted: (() -> Void)?

    /// Read the access again (main thread); true when new stills may be made.
    @discardableResult
    func refresh() -> Bool {
        let denied = LockScreenCache.access(LockScreenCache.agentDirectory) == .denied
        guard denied != blocked else { return !denied }
        blocked = denied
        EventLog.write("wallpaper cache access: \(denied ? "denied" : "granted")")
        if !denied { onGranted?() }
        return !denied
    }

    /// A display kept its still for lack of access: explain, the first time.
    func stillSkipped() {
        guard !UserDefaults.standard.bool(forKey: Self.askedKey) else { return }
        UserDefaults.standard.set(true, forKey: Self.askedKey)
        DispatchQueue.main.async { Self.ask() }
    }

    static func openSettings() {
        NSWorkspace.shared.open(settingsURL)
    }

    private static func ask() {
        let alert = NSAlert()
        alert.messageText = "잠금 화면 이미지 정리에 권한이 필요합니다"
        alert.informativeText = """
        macOS는 잠금 화면에 쓰인 이미지를 지우지 않고 계속 보관해서, 장면이 바뀔 때마다 저장 공간을 차지합니다. \
        전체 디스크 접근 권한을 허용하면 디스플레이마다 현재와 직전 이미지만 남기고, 그동안 쌓인 이미지도 지웁니다.

        허용하기 전까지는 저장 공간을 아끼기 위해 잠금 화면 이미지를 바꾸지 않습니다.

        시스템 설정 > 개인정보 보호 및 보안 > 전체 디스크 접근 권한에서 BDON Immersive Home을 켜 주세요. \
        목록에 없으면 + 버튼으로 추가할 수 있습니다.
        """
        alert.addButton(withTitle: "시스템 설정 열기")
        alert.addButton(withTitle: "나중에")
        NSApp.activate(ignoringOtherApps: true)
        if alert.runModal() == .alertFirstButtonReturn {
            openSettings()
        }
    }
}
