import Foundation
import UniformTypeIdentifiers
import WebKit

/// Serves the bundled web renderer (Contents/Resources/web) under
/// `spot://app/...`, so the page can fetch() its glb / JSON / PNG files
/// without enabling file-URL access in WebKit.
final class SpotSchemeHandler: NSObject, WKURLSchemeHandler {
    static let scheme = "spot"
    static let root = URL(string: "spot://app/")!

    private let base: URL

    override init() {
        let resources = Bundle.main.resourceURL ?? URL(fileURLWithPath: FileManager.default.currentDirectoryPath)
        let bundled = resources.appendingPathComponent("web")
        // Dev runs from the repo fall back to Resources/web.
        base = FileManager.default.fileExists(atPath: bundled.path)
            ? bundled
            : URL(fileURLWithPath: FileManager.default.currentDirectoryPath).appendingPathComponent("Resources/web")
        super.init()
    }

    func webView(_ webView: WKWebView, start task: WKURLSchemeTask) {
        guard let url = task.request.url, let file = resolve(url),
              let data = try? Data(contentsOf: file) else {
            task.didFailWithError(URLError(.fileDoesNotExist))
            return
        }
        let type = UTType(filenameExtension: file.pathExtension)?.preferredMIMEType ?? "application/octet-stream"
        let response = HTTPURLResponse(url: url, statusCode: 200, httpVersion: "HTTP/1.1",
                                       headerFields: ["Content-Type": type, "Content-Length": "\(data.count)"])!
        task.didReceive(response)
        task.didReceive(data)
        task.didFinish()
    }

    func webView(_ webView: WKWebView, stop task: WKURLSchemeTask) {}

    /// Maps a request path into `base`, refusing anything that escapes it.
    private func resolve(_ url: URL) -> URL? {
        var path = url.path
        if path.isEmpty || path == "/" {
            path = "/index.html"
        }
        let file = base.appendingPathComponent(path).standardizedFileURL
        return file.path.hasPrefix(base.standardizedFileURL.path) ? file : nil
    }
}
