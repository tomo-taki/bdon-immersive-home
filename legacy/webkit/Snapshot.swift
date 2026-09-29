import AppKit
import WebKit

/// `--snapshot <out.png> [width height] [situation]`: render the Spot page
/// offscreen in the same WKWebView the wallpaper uses, then save a PNG (QA).
enum Snapshot {
    private static var warmUp: TimeInterval {
        Double(ProcessInfo.processInfo.environment["YUMEMITA_WARMUP"] ?? "") ?? 4.5
    }

    static func render(to url: URL, size: CGSize, spot: Spot, characters: Bool) -> Bool {
        _ = NSApplication.shared
        // WebKit throttles requestAnimationFrame for offscreen windows, so the
        // snapshot uses a real desktop-level window, exactly like the wallpaper.
        let screen = NSScreen.main?.frame ?? .zero
        let window = NSWindow(contentRect: CGRect(x: screen.minX, y: screen.maxY - size.height, width: size.width, height: size.height),
                              styleMask: .borderless, backing: .buffered, defer: false)
        window.level = NSWindow.Level(rawValue: Int(CGWindowLevelForKey(.desktopWindow)))
        window.ignoresMouseEvents = true
        let view = SpotWebView(frame: CGRect(origin: .zero, size: size), spot: spot, characters: characters)
        window.contentView = view
        window.orderFrontRegardless()
        view.setRunning(true)

        let status = view.waitUntilReady(timeout: 60)
        guard status == "ok" else {
            FileHandle.standardError.write(Data("page not ready: \(status)\n".utf8))
            return false
        }
        RunLoop.main.run(until: Date().addingTimeInterval(warmUp))

        // Viewport as the page sees it, for comparing against browser QA.
        view.evaluateJavaScript("JSON.stringify([innerWidth, innerHeight, devicePixelRatio, window.__frames])") { value, _ in
            FileHandle.standardError.write(Data("viewport \(value ?? "?")\n".utf8))
        }
        RunLoop.main.run(until: Date().addingTimeInterval(0.3))

        var image: NSImage?
        view.takeSnapshot(with: nil) { result, _ in image = result }
        let deadline = Date().addingTimeInterval(10)
        while image == nil, Date() < deadline {
            RunLoop.main.run(until: Date().addingTimeInterval(0.1))
        }

        guard let cg = image?.cgImage(forProposedRect: nil, context: nil, hints: nil),
              let data = NSBitmapImageRep(cgImage: cg).representation(using: .png, properties: [:]) else {
            return false
        }
        return (try? data.write(to: url)) != nil
    }
}
