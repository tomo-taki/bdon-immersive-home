import AppKit
import Combine
import ServiceManagement

/// Owns the wallpaper windows, the settings window and the status-bar menu.
@MainActor
final class AppDelegate: NSObject, NSApplicationDelegate {
    private let settings = WallpaperSettings.shared
    private lazy var wallpapers = WallpaperController(settings: settings)
    private lazy var settingsWindow = SettingsWindowController(settings: settings)
    private var statusItem: NSStatusItem?
    private var currentItem: NSMenuItem?
    private var charactersItem: NSMenuItem?
    private var parallaxItem: NSMenuItem?
    private var shuffleItem: NSMenuItem?
    private var loginItem: NSMenuItem?
    private var updateItem: NSMenuItem?
    private var subscriptions = Set<AnyCancellable>()

    func applicationDidFinishLaunching(_ notification: Notification) {
        wallpapers.start()
        buildMenu()
        Updater.shared.start()

        // Menu shows "업데이트 설치" once a newer release is found.
        Updater.shared.$state
            .receive(on: RunLoop.main)
            .sink { [weak self] state in self?.refreshUpdateItem(state) }
            .store(in: &subscriptions)

        // Keep the menu in step with changes made in the settings window.
        settings.objectWillChange
            .receive(on: RunLoop.main)
            .sink { [weak self] _ in DispatchQueue.main.async { self?.refreshMenu() } }
            .store(in: &subscriptions)

        // `--open-settings`: show the settings window at launch (QA, first run).
        if CommandLine.arguments.contains("--open-settings") {
            openSettings()
        }
    }

    // MARK: - Menu

    private func buildMenu() {
        let item = NSStatusBar.system.statusItem(withLength: NSStatusItem.squareLength)
        item.button?.image = Self.menuBarIcon()

        let menu = NSMenu()
        currentItem = menu.addItem(withTitle: "", action: nil, keyEquivalent: "")
        menu.addItem(.separator())

        menu.addItem(withTitle: "설정…", action: #selector(openSettings), keyEquivalent: ",").target = self

        let characters = menu.addItem(withTitle: "캐릭터 표시", action: #selector(toggleCharacters), keyEquivalent: "")
        characters.target = self
        charactersItem = characters

        let parallax = menu.addItem(withTitle: "커서 따라 시점 이동", action: #selector(toggleParallax), keyEquivalent: "")
        parallax.target = self
        parallaxItem = parallax

        let shuffle = menu.addItem(withTitle: "장면 셔플", action: #selector(toggleShuffle), keyEquivalent: "")
        shuffle.target = self
        shuffleItem = shuffle

        let login = menu.addItem(withTitle: "로그인 시 실행", action: #selector(toggleLogin), keyEquivalent: "")
        login.target = self
        loginItem = login

        menu.addItem(.separator())
        let update = menu.addItem(withTitle: "", action: #selector(installUpdate), keyEquivalent: "")
        update.target = self
        update.isHidden = true
        updateItem = update
        menu.addItem(withTitle: "BDON Immersive Home에 관하여", action: #selector(openAbout), keyEquivalent: "").target = self
        menu.addItem(withTitle: "종료", action: #selector(quit), keyEquivalent: "q").target = self

        item.menu = menu
        statusItem = item
        refreshMenu()
    }

    /// Monochrome Tomori (Resources/menubar.png, @2x); template so macOS tints it.
    private static func menuBarIcon() -> NSImage? {
        let image = Bundle.main.image(forResource: "menubar")
            ?? NSImage(systemSymbolName: "sparkles", accessibilityDescription: nil)
        image?.size = NSSize(width: 18, height: 18)
        image?.isTemplate = true
        image?.accessibilityDescription = "BDON Immersive Home"
        return image
    }

    private func refreshMenu() {
        currentItem?.title = settings.spot.map { "\($0.band) · \($0.name)" } ?? "배경 없음"
        charactersItem?.state = settings.showCharacters ? .on : .off
        parallaxItem?.state = settings.cursorParallax ? .on : .off
        shuffleItem?.state = settings.shuffle ? .on : .off
        shuffleItem?.title = settings.shuffle ? "장면 셔플 (\(settings.shuffleInterval.label))" : "장면 셔플"
        loginItem?.state = SMAppService.mainApp.status == .enabled ? .on : .off
    }

    // MARK: - Actions

    private func refreshUpdateItem(_ state: Updater.State) {
        guard case .available(let release) = state else {
            updateItem?.isHidden = true
            return
        }
        updateItem?.title = "업데이트 설치 (\(release.title))"
        updateItem?.isHidden = false
    }

    @objc private func installUpdate() {
        settingsWindow.present(tab: .about)
        Updater.shared.install()
    }

    @objc private func openAbout() {
        settingsWindow.present(tab: .about)
    }

    @objc private func openSettings() {
        settingsWindow.present()
    }

    @objc private func toggleCharacters() {
        settings.showCharacters.toggle()
    }

    @objc private func toggleParallax() {
        settings.cursorParallax.toggle()
    }

    @objc private func toggleShuffle() {
        settings.shuffle.toggle()
    }

    @objc private func toggleLogin() {
        let service = SMAppService.mainApp
        do {
            if service.status == .enabled {
                try service.unregister()
            } else {
                try service.register()
            }
        } catch {
            EventLog.write("Login item change failed: \(error)")
        }
        refreshMenu()
    }

    @objc private func quit() {
        NSApp.terminate(nil)
    }
}
