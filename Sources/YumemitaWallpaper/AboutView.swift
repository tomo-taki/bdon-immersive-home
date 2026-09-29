import AppKit
import SwiftUI

/// Right-hand pane of the settings 정보 tab: version, licence notices and one
/// bug-report / suggestion button that opens a Mail draft.
struct AboutPane: View {
    static let contact = "tomo.taki@proton.me"
    private static let mailBundleId = "com.apple.mail"
    private static let subject = "[BDON Immersive Home] 버그 리포트 / 제안"

    /// "2026.09.29 (42)": build date, then the commit count as build number.
    static var version: String {
        let info = Bundle.main.infoDictionary
        let date = info?["CFBundleShortVersionString"] as? String ?? "개발 빌드"
        let build = info?["CFBundleVersion"] as? String
        return build.map { "\(date) (\($0))" } ?? date
    }

    private static var systemLine: String {
        let os = ProcessInfo.processInfo.operatingSystemVersion
        #if arch(arm64)
        let arch = "Apple silicon"
        #else
        let arch = "Intel"
        #endif
        return "macOS \(os.majorVersion).\(os.minorVersion).\(os.patchVersion) · \(arch)"
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 14) {
            Text("정보").font(Theme.font(20, .heavy)).foregroundStyle(.white)
                .frame(height: 38)
                .accessibilityAddTraits(.isHeader)
            Rectangle().fill(Color.white.opacity(0.7)).frame(height: 1)

            HStack(spacing: 18) {
                Image(nsImage: NSApp.applicationIconImage)
                    .resizable().frame(width: 76, height: 76)
                    .accessibilityHidden(true)
                VStack(alignment: .leading, spacing: 4) {
                    Text("BDON Immersive Home").font(Theme.font(22, .heavy))
                    Text("버전 \(Self.version)").font(Theme.font(13, .semibold)).opacity(0.8)
                }
                .foregroundStyle(.white)
            }
            .padding(.vertical, 6)

            VStack(alignment: .leading, spacing: 6) {
                Text("라이선스").font(Theme.font(13)).foregroundStyle(.white)
                Rectangle().fill(Color.white.opacity(0.6)).frame(height: 1)
                Group {
                    Text("비공식 팬 제작 앱입니다. 게임 에셋의 권리는 © BanG Dream! Project 및 각 권리자에 있습니다.")
                    Text("Spine Runtimes (spine-c 4.2) © 2013-2025 Esoteric Software LLC — Spine Runtimes License Agreement.")
                }
                .font(Theme.font(11, .medium))
                .foregroundStyle(.white.opacity(0.78))
                .fixedSize(horizontal: false, vertical: true)
            }
            .padding(14)
            .background(RoundedRectangle(cornerRadius: 6).fill(Color.black.opacity(0.22)))

            LavenderButton(title: "버그 리포트 및 제안", systemImage: "envelope") { Self.mail() }
                .frame(width: 280)
                .padding(.top, 6)
            Spacer()
        }
        .padding(.horizontal, 26)
        .padding(.vertical, 20)
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
    }

    /// Opens a pre-filled draft in Mail.app. The default mailto: handler may be
    /// a browser (Chrome + Gmail), so Mail is asked for by bundle id first.
    static func mail() {
        let spot = WallpaperSettings.shared.spot.map { "\($0.id) \($0.name)" } ?? "-"
        let body = """



        ---
        BDON Immersive Home \(version)
        \(systemLine)
        현재 장면: \(spot)
        """
        var parts = URLComponents()
        parts.scheme = "mailto"
        parts.path = contact
        parts.queryItems = [URLQueryItem(name: "subject", value: subject),
                            URLQueryItem(name: "body", value: body)]
        // URLComponents leaves "+" alone, which mail clients read as a space.
        parts.percentEncodedQuery = parts.percentEncodedQuery?.replacingOccurrences(of: "+", with: "%2B")
        guard let url = parts.url else { return copyAddress() }

        guard let mailApp = NSWorkspace.shared.urlForApplication(withBundleIdentifier: mailBundleId) else {
            if !NSWorkspace.shared.open(url) { copyAddress() }
            return
        }
        NSWorkspace.shared.open([url], withApplicationAt: mailApp, configuration: NSWorkspace.OpenConfiguration()) { _, error in
            guard error != nil else { return }
            DispatchQueue.main.async { copyAddress() }
        }
    }

    /// No mail client could take the draft: copy the address instead.
    private static func copyAddress() {
        NSPasteboard.general.clearContents()
        NSPasteboard.general.setString(contact, forType: .string)
        let alert = NSAlert()
        alert.messageText = "메일 앱을 열 수 없습니다"
        alert.informativeText = "\(contact) 주소를 클립보드에 복사했습니다."
        alert.runModal()
    }
}
