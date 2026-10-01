import Foundation

/// Event log for debugging, OFF by default so a user's Mac keeps no log
/// (neither the file nor the system log). Launch with BDON_LOG=1 to write
/// ~/Library/Logs/BDONImmersiveHome.log and mirror to NSLog.
enum EventLog {
    private static let maxBytes = 1_000_000
    private static let queue = DispatchQueue(label: "EventLog")
    private static let url = FileManager.default.homeDirectoryForCurrentUser
        .appendingPathComponent("Library/Logs/BDONImmersiveHome.log")
    private static let enabled = ProcessInfo.processInfo.environment["BDON_LOG"] == "1"
    private static let stamp: ISO8601DateFormatter = {
        let formatter = ISO8601DateFormatter()
        formatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        return formatter
    }()

    /// Remove logs written by older builds that logged unconditionally.
    static func removeOldLogs() {
        guard !enabled else { return }
        let logs = FileManager.default.homeDirectoryForCurrentUser.appendingPathComponent("Library/Logs")
        for name in ["BDONImmersiveHome.log", "BDONImmersiveHome.log.1", "OurNotesWallpaper.log", "OurNotesWallpaper.log.1"] {
            try? FileManager.default.removeItem(at: logs.appendingPathComponent(name))
        }
    }

    static func write(_ message: String) {
        guard enabled else { return }
        NSLog("%@", message)
        let line = "\(stamp.string(from: Date())) \(message)\n"
        queue.async { append(line) }
    }

    /// Wait for pending lines (before exit()).
    static func flush() {
        queue.sync {}
    }

    private static func append(_ line: String) {
        let manager = FileManager.default
        // Keep one previous file when the log grows past the cap.
        if let size = (try? manager.attributesOfItem(atPath: url.path))?[.size] as? Int, size > maxBytes {
            let old = url.appendingPathExtension("1")
            try? manager.removeItem(at: old)
            try? manager.moveItem(at: url, to: old)
        }
        guard let handle = try? FileHandle(forWritingTo: url) else {
            try? Data(line.utf8).write(to: url)
            return
        }
        handle.seekToEndOfFile()
        handle.write(Data(line.utf8))
        try? handle.close()
    }
}
