import AppKit
import Foundation

/// GitHub discovers platform releases; Sparkle verifies, installs and relaunches.
@MainActor
final class Updater: ObservableObject {
    static let shared = Updater()

    typealias Release = ReleaseFeed.Update

    enum State: Equatable {
        case idle
        case checking
        case upToDate
        case available(Release)
        case downloading(Release, Double)
        case installing(Release)
        case failed(String)

        /// The update on offer or being applied (its title and summary).
        var release: Release? {
            switch self {
            case .available(let release), .downloading(let release, _), .installing(let release): return release
            default: return nil
            }
        }
    }

    @Published private(set) var state = State.idle

    private static let packageName = "BDONImmersiveHome.dmg"
    private static let httpOK = 200
    private static let checkEvery: TimeInterval = 24 * 60 * 60
    private static let firstCheckDelay: TimeInterval =
        Double(ProcessInfo.processInfo.environment["BDON_UPDATE_DELAY"] ?? "") ?? 15
    private static let defaultRepo = "tomo-taki/bdon-immersive-home"

    private var timer: Timer?
    private var installer: SparkleDriver?

    private static var info: [String: Any] { Bundle.main.infoDictionary ?? [:] }
    private static var repo: String { info["BDONUpdateRepo"] as? String ?? defaultRepo }
    private static var currentBuild: Int? { Int(info["CFBundleVersion"] as? String ?? "") }

    /// Background checks: once shortly after launch, then daily. Builds
    /// without a build number, and dev builds (`.dev`; a release would not
    /// replace them, the bundle ids differ), check only when asked.
    func start() {
        guard Self.currentBuild != nil, !AppIdentity.isDevBuild else { return }
        DispatchQueue.main.asyncAfter(deadline: .now() + Self.firstCheckDelay) { [weak self] in
            self?.check()
        }
        timer = Timer.scheduledTimer(withTimeInterval: Self.checkEvery, repeats: true) { [weak self] _ in
            Task { @MainActor in self?.check() }
        }
    }

    // MARK: - Check

    func check() {
        switch state {
        case .checking, .downloading, .installing: return
        default: break
        }
        state = .checking
        Task {
            do {
                state = try await Self.newest().map { .available($0) } ?? .upToDate
                // QA: BDON_UPDATE_AUTO=1 installs without the click.
                if ProcessInfo.processInfo.environment["BDON_UPDATE_AUTO"] == "1" { install() }
            } catch {
                state = .failed("업데이트 정보를 가져오지 못했습니다")
            }
        }
    }

    /// Newer release for the mac, or nil when this build is the latest.
    private static func newest() async throws -> Release? {
        guard let current = currentBuild else { return nil }
        // QA: BDON_UPDATE_API=http://127.0.0.1:<port> serves a fake releases list.
        let api = ProcessInfo.processInfo.environment["BDON_UPDATE_API"] ?? "https://api.github.com"
        var request = URLRequest(url: URL(string: "\(api)/repos/\(repo)/releases?per_page=30")!)
        request.setValue("application/vnd.github+json", forHTTPHeaderField: "Accept")
        request.setValue("BDONImmersiveHome", forHTTPHeaderField: "User-Agent")
        request.cachePolicy = .reloadIgnoringLocalCacheData

        let (data, response) = try await URLSession.shared.data(for: request)
        guard (response as? HTTPURLResponse)?.statusCode == httpOK else { throw URLError(.badServerResponse) }
        return try ReleaseFeed.update(in: data, current: current, package: packageName)
    }

    // MARK: - Install

    func install() {
        guard case .available(let release) = state else { return }
        guard let feed = release.appcast else {
            state = .failed("이 업데이트에는 서명된 업데이트 피드가 없습니다")
            return
        }
        state = .downloading(release, 0)
        let driver = SparkleDriver(feed: feed, build: release.build) { [weak self] event in
            guard let self else { return }
            switch event {
            case .downloading(let fraction): self.state = .downloading(release, fraction)
            case .installing: self.state = .installing(release)
            case .failed(let error):
                self.state = .failed("업데이트를 설치하지 못했습니다. 다시 확인해주세요")
                EventLog.write("Sparkle update failed: \(error)")
            }
        }
        installer = driver
        do { try driver.install() }
        catch {
            state = .failed("업데이트 서명 설정을 확인해주세요")
            EventLog.write("Sparkle configuration failed: \(error)")
        }
    }
}
