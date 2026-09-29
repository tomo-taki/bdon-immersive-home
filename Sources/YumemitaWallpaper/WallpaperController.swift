import AppKit
import Combine

/// One borderless, click-through window per display, pinned at desktop level
/// (below Finder icons, above the system wallpaper), each showing the Spot.
final class WallpaperController {
    private static let pointerInterval: TimeInterval = 1.0 / 20.0

    private let settings: WallpaperSettings
    private var windows: [NSWindow] = []
    private var views: [SpotMetalView] = []
    private var pointerTimer: Timer?
    private var lastPointer: [CGPoint] = []
    private var subscriptions = Set<AnyCancellable>()
    private var pauseReasons = Set<PauseReason>()
    private var systemPaused: Bool { !pauseReasons.isEmpty }
    private var shuffleTimer: Timer?

    init(settings: WallpaperSettings) {
        self.settings = settings
    }

    func start() {
        rebuildWindows()
        observeSystem()
        observeQA()
        observeSettings()
        pointerTimer = Timer.scheduledTimer(withTimeInterval: Self.pointerInterval, repeats: true) {
            [weak self] _ in self?.updatePointer()
        }
        MemoryProbe.start { [weak self] in self?.views ?? [] }
        DispatchQueue.main.asyncAfter(deadline: .now() + 20) { [weak self] in
            MemoryProbe.log(self?.views ?? [])
        }
    }

    // MARK: - Settings

    private func observeSettings() {
        settings.$spotId
            .dropFirst()
            .removeDuplicates()
            .sink { [weak self] id in
                guard let self, let spot = SpotCatalog.spot(id: id) else { return }
                EventLog.write("spot -> \(spot.id)")
                let hidden = self.settings.easterEgg.hiddenMembers(in: spot)
                self.views.forEach {
                    $0.setHidden(hidden)
                    $0.setSpot(spot)
                }
                self.restartShuffle()
            }
            .store(in: &subscriptions)

        settings.$easterEgg
            .dropFirst()
            .removeDuplicates()
            .sink { [weak self] egg in
                guard let self, let spot = self.settings.spot else { return }
                let hidden = egg.hiddenMembers(in: spot)
                self.views.forEach { $0.setHidden(hidden) }
            }
            .store(in: &subscriptions)

        settings.$cursorParallax
            .dropFirst()
            .removeDuplicates()
            .sink { [weak self] on in if !on { self?.centerCamera() } }
            .store(in: &subscriptions)

        // Publishers fire before the property is stored, so read on the next turn.
        settings.$shuffle.combineLatest(settings.$shuffleInterval)
            .dropFirst()
            .receive(on: RunLoop.main)
            .sink { [weak self] _ in self?.restartShuffle() }
            .store(in: &subscriptions)
        restartShuffle()

        settings.$showCharacters
            .dropFirst()
            .removeDuplicates()
            .sink { [weak self] visible in self?.views.forEach { $0.setCharacters(visible) } }
            .store(in: &subscriptions)

        settings.$lockScreen
            .dropFirst()
            .removeDuplicates()
            .receive(on: RunLoop.main)
            .sink { [weak self] on in
                if on {
                    self?.views.forEach { $0.requestSettle() }
                } else {
                    LockScreenWallpaper.restore()
                }
            }
            .store(in: &subscriptions)
    }

    // MARK: - Windows

    /// One entry per display, keyed by its CGDirectDisplayID.
    private var screenIds: [CGDirectDisplayID] = []
    private var rebuildPending = false

    private static func displayId(_ screen: NSScreen) -> CGDirectDisplayID {
        let number = screen.deviceDescription[NSDeviceDescriptionKey("NSScreenNumber")] as? NSNumber
        return number?.uint32Value ?? 0
    }

    /// macOS posts didChangeScreenParameters for many reasons (wake, Dock,
    /// resolution, arrangement), often in bursts: coalesce them, then only
    /// touch the displays that actually changed.
    private func scheduleRebuild() {
        guard !rebuildPending else { return }
        rebuildPending = true
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) { [weak self] in
            self?.rebuildPending = false
            self?.rebuildWindows()
        }
    }

    /// Keep each display's window and page (moving it if the frame changed),
    /// close windows of displays that left, and add one for each new display.
    /// Reloading a page costs seconds of a blank window, so it only happens
    /// for a display the app has not seen.
    private func rebuildWindows() {
        guard let spot = settings.spot else {
            NSLog("No Spot data bundled")
            return
        }
        let screens = NSScreen.screens
        let currentIds = screens.map(Self.displayId)
        EventLog.write("displays \(currentIds) (had \(screenIds))")

        var keptWindows: [NSWindow] = []
        var keptViews: [SpotMetalView] = []
        var keptIds: [CGDirectDisplayID] = []
        var keptPointer: [CGPoint] = []

        for (screen, id) in zip(screens, currentIds) {
            if let index = screenIds.firstIndex(of: id) {
                let window = windows[index]
                if window.frame != screen.frame {
                    window.setFrame(screen.frame, display: true)
                }
                keptWindows.append(window)
                keptViews.append(views[index])
                keptPointer.append(lastPointer[index])
            } else if let (window, view) = makeWindow(for: screen, spot: spot) {
                keptWindows.append(window)
                keptViews.append(view)
                keptPointer.append(CGPoint(x: CGFloat.nan, y: CGFloat.nan))
            } else {
                continue
            }
            keptIds.append(id)
        }

        // Displays that are gone.
        for (index, id) in screenIds.enumerated() where !currentIds.contains(id) {
            views[index].setRunning(false)
            windows[index].orderOut(nil)
        }

        windows = keptWindows
        views = keptViews
        screenIds = keptIds
        lastPointer = keptPointer
        applyPause()
    }

    /// A new display's window stays invisible until its view draws the Spot,
    /// so an empty frame never shows.
    private func makeWindow(for screen: NSScreen, spot: Spot) -> (NSWindow, SpotMetalView)? {
        let window = NSWindow(contentRect: screen.frame, styleMask: .borderless,
                              backing: .buffered, defer: false, screen: screen)
        window.level = NSWindow.Level(rawValue: Int(CGWindowLevelForKey(.desktopWindow)))
        window.collectionBehavior = [.canJoinAllSpaces, .stationary, .ignoresCycle]
        window.ignoresMouseEvents = true
        window.hasShadow = false
        window.isReleasedWhenClosed = false
        window.backgroundColor = .black
        window.alphaValue = 0

        guard let view = SpotMetalView(frame: CGRect(origin: .zero, size: screen.frame.size),
                                       spot: spot, characters: settings.showCharacters,
                                       hidden: settings.easterEgg.hiddenMembers(in: spot)) else { return nil }
        view.autoresizingMask = [.width, .height]
        view.onReady = { [weak self, weak window, weak view] status in
            EventLog.write("page ready on display \(Self.displayId(screen)): \(status.prefix(300))")
            window?.alphaValue = 1
            if let view {
                self?.syncPage(view)
            }
        }
        view.onLoadError = { [weak self, weak view] dir, _ in
            guard let self, let view else { return }
            self.retryLoad(dir, in: view)
        }
        view.onSettled = { [weak self, weak window] view in
            guard let self, self.settings.lockScreen, let screen = window?.screen,
                  let spotId = view.spotId, let image = view.captureStill() else { return }
            LockScreenWallpaper.apply(image, to: screen, spotId: spotId)
        }
        window.contentView = view
        window.setFrame(screen.frame, display: true)
        window.orderBack(nil)
        return (window, view)
    }

    /// Push the current settings into a page that just (re)loaded: its URL
    /// carries the settings from when the view was created.
    private func syncPage(_ view: SpotMetalView) {
        guard let spot = settings.spot else { return }
        view.setCharacters(settings.showCharacters)
        view.setHidden(settings.easterEgg.hiddenMembers(in: spot))
        view.setSpot(spot)
        view.setPaused(systemPaused)
        if !settings.cursorParallax {
            view.setPointer(x: 0, y: 0)
        }
    }

    // MARK: - Load errors

    private static let loadRetryDelay: TimeInterval = 5
    private static let maxLoadRetries = 2
    private var loadFailures: [String: Int] = [:]

    /// A Spot failed to load (the page keeps the previous one on screen).
    /// Retry the current Spot a couple of times; shuffle moves on by itself.
    private func retryLoad(_ dir: String, in view: SpotMetalView) {
        let failures = loadFailures[dir, default: 0] + 1
        loadFailures[dir] = failures
        guard failures <= Self.maxLoadRetries else {
            EventLog.write("giving up on \(dir) after \(failures) failures")
            return
        }
        DispatchQueue.main.asyncAfter(deadline: .now() + Self.loadRetryDelay) { [weak self, weak view] in
            guard let self, let view, let spot = self.settings.spot, spot.dir == dir else { return }
            EventLog.write("retrying \(dir) (\(failures))")
            view.setSpot(spot)
        }
    }

    // MARK: - Shuffle

    /// New Spot on screen or new shuffle settings: start its dwell over.
    private func restartShuffle() {
        shuffleTimer?.invalidate()
        shuffleTimer = nil
        guard settings.shuffle else { return }
        let seconds = settings.shuffleInterval.seconds

        let timer = Timer(timeInterval: seconds, repeats: false) { [weak self] _ in self?.advanceShuffle() }
        RunLoop.main.add(timer, forMode: .common)
        shuffleTimer = timer
    }

    private func advanceShuffle() {
        // Paused or nothing else to pick: keep the Spot, try again next period.
        guard !systemPaused, let next = settings.nextShuffleSpot() else {
            restartShuffle()
            return
        }
        settings.spotId = next.id
    }

    // MARK: - System events

    private func observeSystem() {
        NotificationCenter.default.addObserver(
            forName: NSApplication.didChangeScreenParametersNotification, object: nil, queue: .main
        ) { [weak self] _ in self?.scheduleRebuild() }

        // Stop rendering while displays sleep or the session is inactive
        // (locked, fast user switch). Two separate reasons: waking the
        // displays behind a lock screen must not resume rendering.
        let workspace = NSWorkspace.shared.notificationCenter
        let events: [(Notification.Name, PauseReason, Bool)] = [
            (NSWorkspace.screensDidSleepNotification, .screensAsleep, true),
            (NSWorkspace.screensDidWakeNotification, .screensAsleep, false),
            (NSWorkspace.sessionDidResignActiveNotification, .sessionInactive, true),
            (NSWorkspace.sessionDidBecomeActiveNotification, .sessionInactive, false),
        ]
        for (name, reason, active) in events {
            workspace.addObserver(forName: name, object: nil, queue: .main) { [weak self] _ in
                guard let self else { return }
                if active {
                    self.pauseReasons.insert(reason)
                } else {
                    self.pauseReasons.remove(reason)
                }
                EventLog.write("pause reasons \(self.pauseReasons.map(\.rawValue).sorted())")
                self.applyPause()
            }
        }
    }

    private enum PauseReason: String {
        case screensAsleep
        case sessionInactive
        case qa
    }

    /// QA hooks, posted with work/stability/notify.swift:
    /// `<bundle id>.qa.restartPages` and `<bundle id>.qa.pause` (object "1"/"0").
    private func observeQA() {
        let center = DistributedNotificationCenter.default()
        let prefix = Bundle.main.bundleIdentifier ?? "ournotes"
        center.addObserver(forName: .init("\(prefix).qa.restartPages"), object: nil, queue: .main) { [weak self] _ in
            EventLog.write("qa: restart pages")
            self?.views.forEach { $0.restart() }
        }
        center.addObserver(forName: .init("\(prefix).qa.pause"), object: nil, queue: .main) { [weak self] note in
            guard let self else { return }
            if (note.object as? String) == "1" {
                self.pauseReasons.insert(.qa)
            } else {
                self.pauseReasons.remove(.qa)
            }
            EventLog.write("pause reasons \(self.pauseReasons.map(\.rawValue).sorted())")
            self.applyPause()
        }
    }

    private func applyPause() {
        let paused = systemPaused
        views.forEach { $0.setPaused(paused) }
    }

    // MARK: - Pointer

    /// Windows ignore the mouse, so poll the cursor and hand it to the Spot
    /// camera, which turns within the situation's own look-around limits.
    private func updatePointer() {
        guard !systemPaused, settings.cursorParallax else { return }

        let mouse = NSEvent.mouseLocation
        for (index, (window, view)) in zip(windows, views).enumerated() {
            let frame = window.frame
            guard frame.width > 0, frame.height > 0 else { continue }

            let x = ((mouse.x - frame.midX) / (frame.width / 2)).clamped(to: -1...1)
            let y = ((mouse.y - frame.midY) / (frame.height / 2)).clamped(to: -1...1)
            let point = CGPoint(x: (x * 100).rounded() / 100, y: (y * 100).rounded() / 100)

            // Only talk to the page when the cursor actually moved.
            guard point != lastPointer[index] else { continue }
            lastPointer[index] = point
            view.setPointer(x: point.x, y: point.y)
        }
    }
}

extension WallpaperController {
    /// Parallax off: settle back on the Spot's default view.
    fileprivate func centerCamera() {
        views.forEach { $0.setPointer(x: 0, y: 0) }
        lastPointer = lastPointer.map { _ in CGPoint(x: CGFloat.nan, y: CGFloat.nan) }
    }
}

private extension CGFloat {
    func clamped(to range: ClosedRange<CGFloat>) -> CGFloat {
        Swift.min(Swift.max(self, range.lowerBound), range.upperBound)
    }
}
