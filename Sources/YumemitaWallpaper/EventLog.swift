import Foundation

/// Append-only event log at ~/Library/Logs/OurNotesWallpaper.log, so a
/// problem seen on the desktop (blank window, reload, failed Spot) can be
/// traced afterwards. Also mirrored to NSLog.
enum EventLog {
    private static let maxBytes = 1_000_000
    private static let queue = DispatchQueue(label: "EventLog")
    private static let url = FileManager.default.homeDirectoryForCurrentUser
        .appendingPathComponent("Library/Logs/OurNotesWallpaper.log")
    private static let stamp: ISO8601DateFormatter = {
        let formatter = ISO8601DateFormatter()
        formatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        return formatter
    }()

    static func write(_ message: String) {
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
