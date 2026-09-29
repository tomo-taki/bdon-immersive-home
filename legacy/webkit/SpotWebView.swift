import AppKit
import WebKit

/// A WKWebView running the three.js Spot renderer (Resources/web).
final class SpotWebView: WKWebView, WKNavigationDelegate {
    private static let framesPerSecond = 30
    private static let readyPollInterval: TimeInterval = 0.25
    private static let readyTimeout: TimeInterval = 90

    private var frameTimer: Timer?
    private var stepInFlight = false
    private var readyTimer: Timer?

    /// The page drew its first Spot frame (or gave up); called once per page load.
    var onReady: ((String) -> Void)?

    /// A later Spot change failed to load (the previous Spot stays on screen).
    var onLoadError: ((_ dir: String, _ message: String) -> Void)?

    private static let messageName = "wallpaper"

    init(frame: CGRect, spot: Spot, characters: Bool, hidden: [String] = []) {
        let config = WKWebViewConfiguration()
        config.setURLSchemeHandler(SpotSchemeHandler(), forURLScheme: SpotSchemeHandler.scheme)
        config.suppressesIncrementalRendering = true
        let relay = MessageRelay()
        config.userContentController.add(relay, name: Self.messageName)
        super.init(frame: frame, configuration: config)
        relay.view = self

        var components = URLComponents(url: SpotSchemeHandler.root, resolvingAgainstBaseURL: false)!
        components.path = "/index.html"
        components.queryItems = [
            URLQueryItem(name: "situation", value: spot.dir),
            URLQueryItem(name: "chars", value: characters ? "1" : "0"),
            URLQueryItem(name: "hide", value: hidden.joined(separator: ",")),
            URLQueryItem(name: "fps", value: "\(Self.framesPerSecond)"),
            // WebKit may halt requestAnimationFrame for desktop-level windows, so frames come from us.
            URLQueryItem(name: "driver", value: "native"),
        ]
        load(URLRequest(url: components.url!))
        navigationDelegate = self
        watchReady()
    }

    required init?(coder: NSCoder) {
        fatalError("init(coder:) is not supported")
    }

    /// Wallpaper windows ignore the mouse, so clicks never reach the page.
    override func hitTest(_ point: NSPoint) -> NSView? { nil }

    // MARK: - Page lifecycle

    /// Poll window.__wallpaperReady until the first Spot is on screen.
    private func watchReady() {
        readyTimer?.invalidate()
        let deadline = Date().addingTimeInterval(Self.readyTimeout)
        let timer = Timer(timeInterval: Self.readyPollInterval, repeats: true) { [weak self] timer in
            guard let self else {
                timer.invalidate()
                return
            }
            if Date() > deadline {
                timer.invalidate()
                self.onReady?("timeout")
                return
            }
            self.evaluateJavaScript("window.__wallpaperReady ?? null") { value, _ in
                guard let status = value as? String, timer.isValid else { return }
                timer.invalidate()
                self.onReady?(status)
            }
        }
        RunLoop.main.add(timer, forMode: .common)
        readyTimer = timer
    }

    /// WebKit killed or lost the page's process (memory pressure, GPU reset):
    /// the view would stay blank for good, so load the page again.
    func webViewWebContentProcessDidTerminate(_ webView: WKWebView) {
        EventLog.write("page process terminated; reloading")
        restart()
    }

    /// When the page was last (re)loaded; see `restart`.
    private(set) var loadedAt = Date()

    /// Load the page from scratch; onReady fires again and the controller
    /// re-sends the current settings.
    func restart() {
        loadedAt = Date()
        reload()
        watchReady()
    }

    /// Events posted by the page (web/src/main.ts `post`).
    fileprivate func received(_ body: Any) {
        guard let message = body as? [String: Any], let event = message["event"] as? String else { return }
        let dir = message["dir"] as? String ?? ""
        let detail = message["message"] as? String ?? ""
        EventLog.write("page: \(event) \(dir) \(detail.prefix(300))")

        switch event {
        case "loadError":
            onLoadError?(dir, detail)
        case "reload":
            // WebGL context lost and never restored: start the page over.
            restart()
        default:
            break
        }
    }

    // MARK: - Frame driver

    /// Ask the page for one frame every 1/fps s while `running`.
    /// Ask the page for one frame every 1/fps s while `running`. When the page
    /// reports idle frames (nothing animating, camera still) the timer drops
    /// to `idleFramesPerSecond`; any call into the page or a drawn frame
    /// brings it straight back.
    func setRunning(_ running: Bool) {
        frameTimer?.invalidate()
        frameTimer = nil
        idleSteps = 0
        guard running else { return }
        scheduleFrames(fps: Self.framesPerSecond)
    }

    private static let idleFramesPerSecond = 5
    private static let idleStepsBeforeSlowing = 30
    private var idleSteps = 0
    private var slowed = false

    private func scheduleFrames(fps: Int) {
        frameTimer?.invalidate()
        slowed = fps != Self.framesPerSecond
        let timer = Timer(timeInterval: 1.0 / Double(fps), repeats: true) { [weak self] _ in
            // One frame in flight at a time: while the page is busy (parsing a
            // new Spot) requests would otherwise pile up and replay in a burst.
            guard let self, !self.stepInFlight else { return }
            self.stepInFlight = true
            self.evaluateJavaScript("window.wallpaper ? wallpaper.step() : 1") { [weak self] value, _ in
                guard let self else { return }
                self.stepInFlight = false
                self.stepped(drew: (value as? Int ?? 1) != 0)
            }
        }
        RunLoop.main.add(timer, forMode: .common)
        frameTimer = timer
    }

    private func stepped(drew: Bool) {
        guard frameTimer != nil else { return }
        idleSteps = drew ? 0 : idleSteps + 1
        if drew && slowed {
            scheduleFrames(fps: Self.framesPerSecond)
        } else if !slowed && idleSteps >= Self.idleStepsBeforeSlowing {
            scheduleFrames(fps: Self.idleFramesPerSecond)
        }
    }

    /// Something changed on the page's side: draw at full rate again.
    private func wake() {
        idleSteps = 0
        if slowed, frameTimer != nil {
            scheduleFrames(fps: Self.framesPerSecond)
        }
    }

    // MARK: - Page API (window.wallpaper in web/src/main.ts)

    func setPointer(x: CGFloat, y: CGFloat) {
        call("wallpaper.setPointer(\(Double(x)), \(Double(y)))")
    }

    func setPaused(_ paused: Bool) {
        call("wallpaper.setPaused(\(paused))")
        setRunning(!paused)
    }

    func setSpot(_ spot: Spot) {
        call("wallpaper.setSituation(\(Self.jsString(spot.dir)))")
    }

    func setCharacters(_ visible: Bool) {
        call("wallpaper.setCharacters(\(visible))")
    }

    /// Easter-egg members to leave out (see EasterEgg.hiddenMembers).
    func setHidden(_ members: [String]) {
        let data = (try? JSONEncoder().encode(members)) ?? Data("[]".utf8)
        call("wallpaper.setHidden(\(String(decoding: data, as: UTF8.self)))")
    }

    /// Waits until the page reports ready (or failed); returns its status.
    func waitUntilReady(timeout: TimeInterval) -> String {
        let deadline = Date().addingTimeInterval(timeout)
        var status: String?
        while status == nil, Date() < deadline {
            evaluateJavaScript("window.__wallpaperReady ?? null") { value, _ in
                status = value as? String
            }
            RunLoop.main.run(until: Date().addingTimeInterval(0.2))
        }
        return status ?? "timeout"
    }

    private func call(_ script: String) {
        wake()
        evaluateJavaScript("window.wallpaper && \(script)", completionHandler: nil)
    }

    /// JSON-encode so a path can never break out of the string literal.
    private static func jsString(_ value: String) -> String {
        let data = (try? JSONEncoder().encode(value)) ?? Data("\"\"".utf8)
        return String(decoding: data, as: UTF8.self)
    }
}

/// Weak hop: WKUserContentController retains its handlers, and the view owns
/// the controller, so a direct registration would never be freed.
private final class MessageRelay: NSObject, WKScriptMessageHandler {
    weak var view: SpotWebView?

    func userContentController(_ controller: WKUserContentController, didReceive message: WKScriptMessage) {
        view?.received(message.body)
    }
}
