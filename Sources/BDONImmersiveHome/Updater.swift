import AppKit
import CryptoKit
import Foundation

/// Self-update from GitHub Releases.
///
///   GET api.github.com/repos/<repo>/releases/latest   (newest non-draft, non-prerelease)
///     tag  "b<commit count>"  -> compared with CFBundleVersion (also the commit count)
///     name "2026.09.29 (5786b63)"
///     assets BDONImmersiveHome-mac.zip + SHA256SUMS.txt  (tools/release.sh)
///
///   download zip -> verify SHA-256 -> ditto -x -> same bundle id?
///   -> replace this .app in place -> relaunch.
///
/// A file URLSession downloads carries no quarantine flag, so the updated app
/// opens without the Gatekeeper prompt the first install needed.
@MainActor
final class Updater: ObservableObject {
    static let shared = Updater()

    struct Release: Equatable {
        let build: Int
        let title: String
        let package: URL
        let checksums: URL
        let page: URL
    }

    enum State: Equatable {
        case idle
        case checking
        case upToDate
        case available(Release)
        case downloading(Double)
        case installing
        case failed(String)
    }

    @Published private(set) var state = State.idle

    private static let packageName = "BDONImmersiveHome-mac.zip"
    private static let checksumName = "SHA256SUMS.txt"
    private static let checkEvery: TimeInterval = 24 * 60 * 60
    private static let firstCheckDelay: TimeInterval =
        Double(ProcessInfo.processInfo.environment["BDON_UPDATE_DELAY"] ?? "") ?? 15
    private static let defaultRepo = "zgghw2t4cd-blip/bdon-immersive-home"

    private var timer: Timer?
    private var progress: NSKeyValueObservation?

    private static var info: [String: Any] { Bundle.main.infoDictionary ?? [:] }
    private static var repo: String { info["BDONUpdateRepo"] as? String ?? defaultRepo }
    private static var currentBuild: Int? { Int(info["CFBundleVersion"] as? String ?? "") }

    /// Background checks: once shortly after launch, then daily.
    func start() {
        guard Self.currentBuild != nil else { return }      // dev build: nothing to compare
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
                state = try await Self.latest().map { .available($0) } ?? .upToDate
                // QA: BDON_UPDATE_AUTO=1 installs without the click.
                if ProcessInfo.processInfo.environment["BDON_UPDATE_AUTO"] == "1" { install() }
            } catch {
                state = .failed("업데이트 정보를 가져오지 못했습니다")
            }
        }
    }

    /// Newer release, or nil when this build is the latest.
    private static func latest() async throws -> Release? {
        // QA: BDON_UPDATE_API=http://127.0.0.1:<port> serves a fake releases/latest.
        let api = ProcessInfo.processInfo.environment["BDON_UPDATE_API"] ?? "https://api.github.com"
        var request = URLRequest(url: URL(string: "\(api)/repos/\(repo)/releases/latest")!)
        request.setValue("application/vnd.github+json", forHTTPHeaderField: "Accept")
        request.setValue("BDONImmersiveHome", forHTTPHeaderField: "User-Agent")
        request.cachePolicy = .reloadIgnoringLocalCacheData

        let (data, response) = try await URLSession.shared.data(for: request)
        guard (response as? HTTPURLResponse)?.statusCode == 200 else { throw URLError(.badServerResponse) }

        struct Asset: Decodable { let name: String; let browser_download_url: URL }
        struct Payload: Decodable { let tag_name: String; let name: String?; let html_url: URL; let assets: [Asset] }
        let payload = try JSONDecoder().decode(Payload.self, from: data)

        // "b42" -> 42
        guard let build = Int(payload.tag_name.drop { !$0.isNumber }),
              let current = currentBuild, build > current else { return nil }
        let asset = { (name: String) in payload.assets.first { $0.name == name }?.browser_download_url }
        guard let package = asset(packageName), let checksums = asset(checksumName) else { return nil }
        return Release(build: build, title: payload.name ?? payload.tag_name,
                       package: package, checksums: checksums, page: payload.html_url)
    }

    // MARK: - Install

    func install() {
        guard case .available(let release) = state else { return }
        state = .downloading(0)
        Task {
            do {
                let app = try await download(release)
                state = .installing
                try Self.replaceRunningApp(with: app)
                Self.relaunch()
            } catch {
                state = .failed("업데이트를 적용하지 못했습니다")
                NSWorkspace.shared.open(release.page)
            }
        }
    }

    /// Downloads and verifies the package; returns the unpacked .app.
    private func download(_ release: Release) async throws -> URL {
        let work = FileManager.default.temporaryDirectory.appendingPathComponent("BDONUpdate-\(release.build)")
        try? FileManager.default.removeItem(at: work)
        try FileManager.default.createDirectory(at: work, withIntermediateDirectories: true)

        let (sums, _) = try await URLSession.shared.data(from: release.checksums)
        guard let expected = Self.checksum(for: Self.packageName, in: sums) else { throw URLError(.cannotParseResponse) }

        let zip = work.appendingPathComponent(Self.packageName)
        let downloaded: URL = try await withCheckedThrowingContinuation { continuation in
            let task = URLSession.shared.downloadTask(with: release.package) { url, response, error in
                guard let url, (response as? HTTPURLResponse)?.statusCode == 200 else {
                    return continuation.resume(throwing: error ?? URLError(.badServerResponse))
                }
                // The temporary file is deleted when this handler returns.
                do {
                    try FileManager.default.moveItem(at: url, to: zip)
                    continuation.resume(returning: zip)
                } catch {
                    continuation.resume(throwing: error)
                }
            }
            progress = task.progress.observe(\.fractionCompleted) { [weak self] p, _ in
                let fraction = p.fractionCompleted
                Task { @MainActor in
                    if case .downloading = self?.state { self?.state = .downloading(fraction) }
                }
            }
            task.resume()
        }
        progress = nil

        guard try Self.sha256(of: downloaded) == expected else { throw URLError(.cannotDecodeContentData) }

        let unpacked = work.appendingPathComponent("app")
        try Self.run("/usr/bin/ditto", ["-x", "-k", downloaded.path, unpacked.path])
        let apps = try FileManager.default.contentsOfDirectory(at: unpacked, includingPropertiesForKeys: nil)
        guard let app = apps.first(where: { $0.pathExtension == "app" }),
              Bundle(url: app)?.bundleIdentifier == Bundle.main.bundleIdentifier else {
            throw URLError(.cannotOpenFile)
        }
        return app
    }

    /// "hex  name" lines (sha256sum format).
    private static func checksum(for name: String, in data: Data) -> String? {
        let text = String(decoding: data, as: UTF8.self)
        for line in text.split(whereSeparator: \.isNewline) {
            let parts = line.split(separator: " ", omittingEmptySubsequences: true)
            if parts.count == 2, parts[1].trimmingCharacters(in: CharacterSet(charactersIn: "*")) == name {
                return parts[0].lowercased()
            }
        }
        return nil
    }

    private static func sha256(of url: URL) throws -> String {
        let chunk = 4 << 20
        let handle = try FileHandle(forReadingFrom: url)
        defer { try? handle.close() }
        var hash = SHA256()
        while let data = try handle.read(upToCount: chunk), !data.isEmpty {
            hash.update(data: data)
        }
        return hash.finalize().map { String(format: "%02x", $0) }.joined()
    }

    /// Swap the bundle on disk; the running process keeps its mapped files.
    private static func replaceRunningApp(with app: URL) throws {
        _ = try FileManager.default.replaceItemAt(Bundle.main.bundleURL, withItemAt: app,
                                                  backupItemName: nil, options: [])
    }

    /// Start the new copy once this one has exited.
    private static func relaunch() {
        let path = Bundle.main.bundleURL.path
        let task = Process()
        task.executableURL = URL(fileURLWithPath: "/bin/sh")
        task.arguments = ["-c", "sleep 1; /usr/bin/open \"$0\"", path]
        try? task.run()
        NSApp.terminate(nil)
    }

    private static func run(_ tool: String, _ arguments: [String]) throws {
        let task = Process()
        task.executableURL = URL(fileURLWithPath: tool)
        task.arguments = arguments
        try task.run()
        task.waitUntilExit()
        guard task.terminationStatus == 0 else { throw URLError(.cannotDecodeRawData) }
    }
}
