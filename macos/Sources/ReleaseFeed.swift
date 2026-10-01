import Foundation

/// The GitHub releases list as Updater reads it.
///
///   GET api.github.com/repos/<repo>/releases   (newest first)
///     tag    "b<commit count>"       compared with the running build number
///     name   "2026.09.29 (5786b63)"
///     body   the update summary, written by the human (tools/release.sh)
///     assets one package per platform + SHA256SUMS.txt
///
/// tools/release.sh may publish some platforms only, so the update is the
/// newest release carrying our package; releases without it are not ours.
/// The summaries of every newer release with our package are shown, newest
/// first, so a version skipped in between still tells what it changed.
///
/// Parity: windows/src/onp_release.h.
enum ReleaseFeed {
    struct Update: Equatable {
        let build: Int
        let title: String
        let notes: String       // "" when no newer release has a summary
        let package: URL
        let checksums: URL
        let page: URL
    }

    static let checksumName = "SHA256SUMS.txt"

    private struct Asset: Decodable {
        let name: String
        let browser_download_url: URL
    }

    private struct Release: Decodable {
        let tag_name: String
        let name: String?
        let body: String?
        let draft: Bool?
        let prerelease: Bool?
        let html_url: URL
        let assets: [Asset]

        var title: String { name ?? tag_name }

        func asset(_ name: String) -> URL? {
            assets.first { $0.name == name }?.browser_download_url
        }
    }

    /// The newest release after build `current` that carries `package`, or nil.
    static func update(in data: Data, current: Int, package: String) throws -> Update? {
        let releases = try JSONDecoder().decode([Release].self, from: data)

        // Published releases newer than us that ship our package, newest first.
        let newer = releases
            .compactMap { release -> (build: Int, release: Release)? in
                guard release.draft != true, release.prerelease != true,
                      let build = build(of: release.tag_name), build > current,
                      release.asset(package) != nil, release.asset(checksumName) != nil else { return nil }
                return (build, release)
            }
            .sorted { $0.build > $1.build }
        guard let newest = newer.first,
              let packageURL = newest.release.asset(package),
              let checksums = newest.release.asset(checksumName) else { return nil }

        // One summary as written; several under their release titles.
        let summaries = newer.compactMap { entry -> (title: String, text: String)? in
            let text = summary(of: entry.release)
            return text.isEmpty ? nil : (entry.release.title, text)
        }
        let notes = summaries.count == 1
            ? summaries[0].text
            : summaries.map { "\($0.title)\n\($0.text)" }.joined(separator: "\n\n")

        return Update(build: newest.build, title: newest.release.title, notes: notes,
                      package: packageURL, checksums: checksums, page: newest.release.html_url)
    }

    /// "b42" -> 42; any other tag is not one of ours.
    static func build(of tag: String) -> Int? {
        let digits = tag.dropFirst()
        guard tag.first == "b", !digits.isEmpty, digits.allSatisfy({ $0.isASCII && $0.isNumber }) else { return nil }
        return Int(digits)
    }

    /// The release body without line-ending noise. Releases from before
    /// summaries said only "BDON Immersive Home <title>": nothing to show.
    private static func summary(of release: Release) -> String {
        let text = (release.body ?? "")
            .replacingOccurrences(of: "\r\n", with: "\n")
            .trimmingCharacters(in: .whitespacesAndNewlines)
        return text == "BDON Immersive Home \(release.title)" ? "" : text
    }
}
