import Foundation

@main
private enum UpdateTest {
    private static let releaseId = "com.togawa.bdon-immersive-home"
    private static let legacyId = "moe.local.bdon-immersive-home"

    private static func bundle(_ root: URL, _ name: String, _ id: String) throws -> Bundle {
        let app = root.appendingPathComponent(name + ".app")
        let contents = app.appendingPathComponent("Contents")
        try FileManager.default.createDirectory(at: contents, withIntermediateDirectories: true)
        let data = try PropertyListSerialization.data(fromPropertyList: ["CFBundleIdentifier": id],
                                                       format: .xml, options: 0)
        try data.write(to: contents.appendingPathComponent("Info.plist"))
        return Bundle(url: app)!
    }

    static func main() throws {
        let root = FileManager.default.temporaryDirectory.appendingPathComponent(UUID().uuidString)
        defer { try? FileManager.default.removeItem(at: root) }
        let b27 = try bundle(root, "b27", legacyId)
        let b31 = try bundle(root, "b31", releaseId)
        let next = try bundle(root, "next", releaseId)
        // Existing clients require exact identity equality before replacing an app.
        precondition(b31.bundleIdentifier == next.bundleIdentifier)
        precondition(b27.bundleIdentifier != next.bundleIdentifier)
        let pinned = try String(contentsOfFile: CommandLine.arguments[1], encoding: .utf8)
            .trimmingCharacters(in: .whitespacesAndNewlines)
        precondition(pinned == b31.bundleIdentifier, "release identity broke existing clients")

        precondition(UpdateFailure.message(UpdateFailure.identityMismatch).contains("직접 업데이트"))
        precondition(UpdateFailure.message(UpdateFailure.checksumMismatch).contains("검증"))
        precondition(UpdateFailure.message(UpdateFailure.missingChecksum).contains("검증 정보"))
        precondition(UpdateFailure.message(UpdateFailure.missingApp).contains("앱을 찾지"))
        precondition(UpdateFailure.message(UpdateFailure.toolFailed("hdiutil")).contains("열지"))
        precondition(UpdateFailure.message(UpdateFailure.toolFailed("ditto")).contains("복사"))
        precondition(UpdateFailure.message(URLError(.notConnectedToInternet)).contains("연결"))
        print("PASS: stable identity, legacy manual migration, and installation errors")
    }
}
