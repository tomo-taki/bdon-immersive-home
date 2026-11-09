import Foundation
import PaperSaverKit

struct WallpaperReport: Encodable {
    let libraryVersion: String
    let sectionCount: Int
    let roundTripMatches: Bool
    let desktopProviders: [String]
    let idleProviders: [String]
    let linkedProviders: [String]
    let extensions: [String]
    let productExtensions: [String]
    let agentCount: Int
}

/// Read-only host inspection; mutations belong to temporary-store tests.
enum WallpaperProbe {
    static func read(bundleID: String) async throws -> WallpaperReport {
        let saver = PaperSaver()
        let store = try saver.readStore()
        let extensions = try await saver.listWallpaperExtensions().map(\.bundleIdentifier).sorted()
        let summary = StoreSummary(store)

        return WallpaperReport(
            libraryVersion: PaperSaverKitInfo.version,
            sectionCount: summary.sections.count,
            roundTripMatches: try roundTrip(store),
            desktopProviders: providers(summary.sections.compactMap(\.desktop)),
            idleProviders: providers(summary.sections.compactMap(\.idle)),
            linkedProviders: providers(summary.sections.compactMap(\.linked)),
            extensions: extensions,
            productExtensions: extensions.filter { $0 == bundleID || $0.hasPrefix(bundleID + ".") },
            agentCount: WallpaperAgent.runningProcessIdentifiers().count
        )
    }

    private static func providers(_ slots: [StoreSummary.Slot]) -> [String] {
        Set(slots.map(\.provider)).sorted()
    }

    private static func roundTrip(_ store: WallpaperStore) throws -> Bool {
        let directory = FileManager.default.temporaryDirectory.appendingPathComponent("BDONPaperSaverRead-\(UUID())")
        defer { try? FileManager.default.removeItem(at: directory) }

        let copy = StoreFile(url: directory.appendingPathComponent("Index.plist"))
        try copy.write(store)
        return try copy.read() == store
    }
}
