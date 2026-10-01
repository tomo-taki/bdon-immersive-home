import AppKit
import SwiftUI

/// Right-hand pane of the settings 정보 tab: version, update status (with the
/// update's summary while one is on offer), licence notices and one
/// bug-report / suggestion button that opens a Mail draft.
struct AboutPane: View {
    static let contact = "tomo.taki@proton.me"
    private static let mailBundleId = "com.apple.mail"
    private static let subject = "[BDON Immersive Home] 버그 리포트 / 제안"

    @ObservedObject private var updater = Updater.shared

    /// "2026.09.29 (fa494c3)": build date, then the commit it was built from.
    static var version: String {
        let info = Bundle.main.infoDictionary
        let date = info?["CFBundleShortVersionString"] as? String ?? "개발 빌드"
        let build = info?["BDONCommit"] as? String
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

            UpdateRow(updater: updater)
            if let notes = updater.state.release?.notes, !notes.isEmpty {
                ReleaseNotes(notes: notes)
            }

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

/// Update status line plus the one button that fits the state.
private struct UpdateRow: View {
    @ObservedObject var updater: Updater

    private var status: String {
        switch updater.state {
        case .idle: return ""
        case .checking: return "확인 중…"
        case .upToDate: return "최신 버전입니다"
        case .available(let release): return "새 버전 \(release.title)"
        case .downloading(_, let fraction): return "내려받는 중 \(Int(fraction * 100))%"
        case .installing: return "설치 중…"
        case .failed(let message): return message
        }
    }

    var body: some View {
        HStack(spacing: 16) {
            switch updater.state {
            case .available:
                LavenderButton(title: "업데이트 설치", systemImage: "arrow.down.circle", height: 40) { updater.install() }
                    .frame(width: 200)
            case .downloading, .installing, .checking:
                ProgressView().controlSize(.small).tint(.white)
            default:
                LavenderButton(title: "업데이트 확인", systemImage: "arrow.clockwise", height: 40) { updater.check() }
                    .frame(width: 200)
            }
            Text(status).font(Theme.font(13, .semibold)).foregroundStyle(.white.opacity(0.85))
        }
        .frame(height: 40)
    }
}

/// The update's summary as the human wrote it (the release body), in the
/// licence box style. The box fits the text up to 120 pt, then scrolls.
private struct ReleaseNotes: View {
    let notes: String

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text("업데이트 내용").font(Theme.font(13)).foregroundStyle(.white)
            Rectangle().fill(Color.white.opacity(0.6)).frame(height: 1)
            CappedHeight(limit: 120) {
                ViewThatFits(in: .vertical) {
                    text
                    ScrollView { text }
                }
            }
        }
        .padding(14)
        .background(RoundedRectangle(cornerRadius: 6).fill(Color.black.opacity(0.22)))
    }

    private var text: some View {
        Text(notes)
            .font(Theme.font(12, .medium))
            .foregroundStyle(.white.opacity(0.85))
            .lineSpacing(2)
            .textSelection(.enabled)
            .fixedSize(horizontal: false, vertical: true)
            .frame(maxWidth: .infinity, alignment: .leading)
    }
}

/// Offers its content at most `limit` points of height and takes the height
/// the content picks; `.frame(maxHeight:)` would stretch short content to it.
private struct CappedHeight: Layout {
    let limit: CGFloat

    func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) -> CGSize {
        let height = min(proposal.height ?? limit, limit)
        return subviews.first?.sizeThatFits(ProposedViewSize(width: proposal.width, height: height)) ?? .zero
    }

    func placeSubviews(in bounds: CGRect, proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) {
        subviews.first?.place(at: bounds.origin, proposal: ProposedViewSize(bounds.size))
    }
}
