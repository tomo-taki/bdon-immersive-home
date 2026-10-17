import CryptoKit
import Foundation

/// macOS 26 and later keep a full-size BMP of every picture ever set as a
/// desktop picture and never remove one (FB20636593): with a new still at each
/// Spot change that is gigabytes a day. An entry is named
/// `<SHA-256 of the picture's path>-<width>-<height>-0-<mtime>.bmp`, the mtime a
/// big-endian Double of seconds since 2001, so the entries of our stills can be
/// told from any other picture's and the retired ones deleted. The folder lies
/// in the wallpaper agent's container: reading it takes Full Disk Access, which
/// only the user can grant (macOS shows no prompt for it).
enum LockScreenCache {
    enum Access {
        case absent     // this macOS keeps no such cache
        case denied     // no Full Disk Access
        case granted
    }

    private static let tail = "com.apple.wallpaper.caches/extension-com.apple.wallpaper.extension.image"

    /// The wallpaper agent's cache (macOS 26+), the one never trimmed.
    static let agentDirectory = FileManager.default.homeDirectoryForCurrentUser
        .appendingPathComponent("Library/Containers/com.apple.wallpaper.agent/Data/Library/Caches")
        .appendingPathComponent(tail, isDirectory: true)

    /// Plus where macOS 14 and 15 kept it (15.1 and later trim it themselves).
    static let directories: [URL] = [agentDirectory] + [userCacheDirectory?.appendingPathComponent(tail, isDirectory: true)].compactMap { $0 }

    static func access(_ directory: URL) -> Access {
        guard let handle = opendir(directory.path) else {
            return errno == ENOENT || errno == ENOTDIR ? .absent : .denied
        }
        closedir(handle)
        return .granted
    }

    private static var userCacheDirectory: URL? {
        var buffer = [CChar](repeating: 0, count: Int(PATH_MAX))
        guard confstr(_CS_DARWIN_USER_CACHE_DIR, &buffer, buffer.count) > 0 else { return nil }
        return URL(fileURLWithPath: String(cString: buffer), isDirectory: true)
    }

    // MARK: - Our stills

    /// `<display key>-<stamp>.jpg`, the file's mtime set to `stamp` (whole
    /// seconds since 1970): the name of its cache entry is then known.
    static func stillName(key: String, stamp: Int) -> String {
        "\(key)-\(stamp).jpg"
    }

    /// Display key and stamp of a still: `<key>-<stamp>.jpg`, or
    /// `<key>-<spot>-<stamp>.jpg` as builds before this naming wrote them.
    static func parseStill(_ name: String) -> (key: String, stamp: Int)? {
        guard name.hasSuffix(".jpg") else { return nil }
        let parts = name.dropLast(4).split(separator: "-", omittingEmptySubsequences: false)
        guard parts.count == 2 || parts.count == 3, UInt32(parts[0]) != nil,
              let stamp = Int(parts[parts.count - 1]) else { return nil }
        return (String(parts[0]), stamp)
    }

    /// A stamp after every one in use: the system keeps showing the old
    /// picture of a reused path.
    static func nextStamp(now: Date, after used: [Int]) -> Int {
        max(Int(now.timeIntervalSince1970), (used.max() ?? 0) + 1)
    }

    /// The newest two stills (paths) of each display in `keys`: its current
    /// and previous.
    static func newestTwo(_ paths: [String], keys: Set<String>) -> Set<String> {
        var byKey: [String: [(stamp: Int, path: String)]] = [:]
        for path in paths {
            guard let still = parseStill((path as NSString).lastPathComponent), keys.contains(still.key) else { continue }
            byKey[still.key, default: []].append((still.stamp, path))
        }
        return Set(byKey.values.flatMap { $0.sorted { $0.stamp > $1.stamp }.prefix(2).map(\.path) })
    }

    // MARK: - Cache entries

    /// One cached BMP: which path it was made from (hashed) and that file's mtime.
    struct Entry {
        let name: String
        let pathHash: Data
        let mtime: Double   // seconds since 1970

        init?(_ name: String) {
            guard name.hasSuffix(".bmp") else { return nil }
            let parts = name.dropLast(4).split(separator: "-")
            guard parts.count == 5, let hash = Data(hex: parts[0]), hash.count == 32,
                  parts[4].count == 16, let bits = UInt64(parts[4], radix: 16) else { return nil }
            self.name = name
            pathHash = hash
            mtime = Double(bitPattern: bits) + Date.timeIntervalBetween1970AndReferenceDate
        }
    }

    /// Where and how our stills were named, to recognise their entries.
    struct Stills {
        let directories: [String]
        /// Display keys, likeliest first: the search stops at the first match.
        let keys: [String]
        /// For the earlier `<key>-<spot>-<stamp>.jpg` names.
        let spotIds: [String]

        func owns(_ entry: Entry) -> Bool {
            let stamp = Int(entry.mtime.rounded(.down))
            for directory in directories {
                // This naming: the mtime is the stamp.
                if Double(stamp) == entry.mtime,
                   keys.contains(where: { hash("\(directory)/\(stillName(key: $0, stamp: stamp))") == entry.pathHash }) {
                    return true
                }
                // Earlier names took the stamp just before writing the file.
                for key in keys {
                    for lag in 0...10 {
                        for spot in spotIds where hash("\(directory)/\(key)-\(spot)-\(stamp - lag).jpg") == entry.pathHash {
                            return true
                        }
                    }
                }
            }
            return false
        }
    }

    /// Entries found not to be ours: the search for earlier names is slow.
    /// Only touched on the caller's serial queue.
    private static var foreign = Set<String>()

    /// Delete the entries of our stills except those of `keep` (paths). Other
    /// pictures' entries are never touched. Returns what was freed.
    static func sweep(_ directory: URL, keeping keep: Set<String>, stills: Stills) -> (files: Int, bytes: Int64) {
        guard let names = try? FileManager.default.contentsOfDirectory(atPath: directory.path) else { return (0, 0) }
        let kept = Set(keep.map(hash))
        var freed: (files: Int, bytes: Int64) = (0, 0)
        for name in names where !foreign.contains(name) {
            guard let entry = Entry(name), !kept.contains(entry.pathHash) else { continue }
            guard stills.owns(entry) else {
                foreign.insert(name)
                continue
            }
            let url = directory.appendingPathComponent(name)
            let size = (try? url.resourceValues(forKeys: [.fileSizeKey]))?.fileSize ?? 0
            guard (try? FileManager.default.removeItem(at: url)) != nil else { continue }
            freed.files += 1
            freed.bytes += Int64(size)
        }
        return freed
    }

    static func hash(_ path: String) -> Data {
        Data(SHA256.hash(data: Data(path.utf8)))
    }
}

private extension Data {
    init?<S: StringProtocol>(hex: S) {
        guard hex.count.isMultiple(of: 2) else { return nil }
        var bytes = [UInt8]()
        bytes.reserveCapacity(hex.count / 2)
        var index = hex.startIndex
        while index < hex.endIndex {
            let next = hex.index(index, offsetBy: 2)
            guard let byte = UInt8(hex[index..<next], radix: 16) else { return nil }
            bytes.append(byte)
            index = next
        }
        self.init(bytes)
    }
}
