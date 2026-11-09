import AppKit
import CryptoKit
import Foundation

private func emit(_ value: some Encodable) {
    do {
        let encoder = JSONEncoder()
        encoder.outputFormatting = [.prettyPrinted, .sortedKeys]
        var data = try encoder.encode(value)
        data.append(contentsOf: "\n".utf8)
        FileHandle.standardOutput.write(data)
    } catch {
        fail(error)
    }
}

private func fail(_ error: Error) -> Never {
    FileHandle.standardError.write(Data("\(error)\n".utf8))
    exit(EXIT_FAILURE)
}

private func writeKey(to directory: URL) throws {
    let ownerOnly = 0o600
    let key = Curve25519.Signing.PrivateKey()
    let seed = directory.appendingPathComponent("seed.txt")
    try key.rawRepresentation.base64EncodedString().write(to: seed, atomically: true, encoding: .utf8)
    try FileManager.default.setAttributes([.posixPermissions: ownerOnly], ofItemAtPath: seed.path)
    try key.publicKey.rawRepresentation.base64EncodedString().write(
        to: directory.appendingPathComponent("public.txt"), atomically: true, encoding: .utf8)
}

private let arguments = Array(CommandLine.arguments.dropFirst())
do {
    if try TrialBundle.writeReceipt() { exit(EXIT_SUCCESS) }
} catch {
    fail(error)
}

guard arguments.count == 2 else {
    FileHandle.standardError.write(Data("usage: IntegrationProbe wallpaper BUNDLE_ID | sparkle URL | install URL | key DIRECTORY\n".utf8))
    exit(EXIT_FAILURE)
}

switch arguments[0] {
case "wallpaper":
    Task {
        do {
            emit(try await WallpaperProbe.read(bundleID: arguments[1]))
            exit(EXIT_SUCCESS)
        } catch {
            fail(error)
        }
    }
    dispatchMain()
case "sparkle", "install":
    do {
        let app = NSApplication.shared
        let mode = arguments[0] == "install" ? SparkleProbe.Mode.install : .information
        let probe = try SparkleProbe(feed: arguments[1], mode: mode) { result in
            emit(result)
            app.terminate(nil)
        }
        try probe.start()
        withExtendedLifetime(probe) { app.run() }
    } catch {
        fail(error)
    }
case "key":
    do {
        try writeKey(to: URL(fileURLWithPath: arguments[1], isDirectory: true))
    } catch {
        fail(error)
    }
default:
    FileHandle.standardError.write(Data("unknown command\n".utf8))
    exit(EXIT_FAILURE)
}
