import AppKit
import SwiftUI

/// Which tab / band / open option the settings window shows. The CLT SDK has
/// no SwiftUI macro plugin, so view state lives in an ObservableObject.
final class SettingsNav: ObservableObject {
    enum Tab: String, CaseIterable {
        case scene = "배경"
        case display = "상세"
        case about = "정보"

        /// Tabs stacked at the top of the sidebar; 정보 sits at the bottom.
        static let main: [Tab] = [.scene, .display]
    }

    /// Middle-column sections of the 상세 tab.
    enum Section: String, CaseIterable {
        case display = "표시"
        case shuffle = "셔플"
    }

    /// Option pills that open a choice panel (only one open at a time).
    enum Option {
        case characters
        case parallax
        case lockScreen
        case shuffle
        case interval
    }

    @Published var tab: Tab = .scene { didSet { expanded = nil } }
    @Published var section: Section = .display { didSet { expanded = nil } }
    @Published var band: String
    @Published var expanded: Option?

    init(settings: WallpaperSettings) {
        band = settings.spot?.band ?? SpotCatalog.byBand.first?.band ?? ""
    }

    func toggle(_ option: Option) {
        expanded = expanded == option ? nil : option
    }
}

/// Settings window laid out like the Our Notes game settings screen: tab
/// slabs on the left (the selected one juts out to the right), a sub-tab
/// column in the middle and the content (Spot grid, option pills or the
/// app info) on the right. With shuffle on, a tile click toggles that Spot
/// in the shuffle pool instead.
struct SettingsView: View {
    @ObservedObject var settings: WallpaperSettings
    @ObservedObject var nav: SettingsNav

    private static let tabHeight: CGFloat = 46
    private static let tabSpacing: CGFloat = 18
    private static let columnTop: CGFloat = 18

    private let columns = [GridItem(.flexible(), spacing: 16), GridItem(.flexible(), spacing: 16), GridItem(.flexible(), spacing: 16)]

    var body: some View {
        HStack(spacing: 0) {
            sidebar.zIndex(1)   // selected slab overlaps the middle column
            subTabs
            content
        }
        .frame(width: SettingsWindowController.width)
        .frame(minHeight: 560)
        .background(GameBackdrop(image: settings.spot.flatMap { SpotCatalog.thumbnail(for: $0, characters: settings.showCharacters) }))
        .environment(\.colorScheme, .dark)
    }

    // MARK: - Left column

    private var sidebar: some View {
        VStack(alignment: .leading, spacing: Self.tabSpacing) {
            ForEach(SettingsNav.Tab.main, id: \.self) { tab($0) }
            Spacer()
            tab(.about)
        }
        .padding(.leading, 16)
        .padding(.vertical, Self.columnTop)
        .frame(width: 236)
        .background(LinearGradient(colors: [Theme.tabBottom.opacity(0.55), Theme.navyTop.opacity(0.35)],
                                   startPoint: .top, endPoint: .bottom))
    }

    private func tab(_ tab: SettingsNav.Tab) -> some View {
        GameTab(title: tab.rawValue, selected: nav.tab == tab) { nav.tab = tab }
    }

    // MARK: - Middle column

    /// Sub-tab rows start level with the selected left tab, as in the game.
    private var subTabs: some View {
        VStack(spacing: 0) {
            switch nav.tab {
            case .scene:
                ScrollView {
                    VStack(spacing: 0) {
                        ForEach(SpotCatalog.byBand, id: \.band) { group in
                            SubTabRow(title: group.band, icon: SpotCatalog.bandIcon(group.band),
                                      selected: nav.band == group.band) { nav.band = group.band }
                        }
                    }
                }
            case .display:
                VStack(spacing: 0) {
                    ForEach(SettingsNav.Section.allCases, id: \.self) { section in
                        SubTabRow(title: section.rawValue, selected: nav.section == section) { nav.section = section }
                    }
                }
                .padding(.top, Self.tabHeight + Self.tabSpacing)
            case .about:
                Spacer()
                SubTabRow(title: "앱 정보", selected: true) {}
            }
            Spacer(minLength: 0)
                .frame(maxHeight: nav.tab == .about ? 0 : .infinity)
        }
        .padding(.top, Self.columnTop + 1)
        .padding(.bottom, nav.tab == .about ? Self.columnTop + 1 : 0)
        .frame(width: 196)
        .background(Theme.panel.opacity(0.72))
    }

    // MARK: - Right column

    @ViewBuilder private var content: some View {
        switch nav.tab {
        case .scene: sceneGrid
        case .display: displayOptions
        case .about: AboutPane()
        }
    }

    private var sceneGrid: some View {
        let spots = SpotCatalog.byBand.first { $0.band == nav.band }?.spots ?? []
        return VStack(alignment: .leading, spacing: 14) {
            HStack(spacing: 12) {
                Text(nav.band).font(Theme.font(20, .heavy)).foregroundStyle(.white)
                    .accessibilityAddTraits(.isHeader)
                Spacer()
                if settings.shuffle {
                    bandPoolButton(nav.band, spots)
                }
            }
            .frame(height: 38)
            Rectangle().fill(Color.white.opacity(0.7)).frame(height: 1)
            ScrollViewReader { proxy in
                ScrollView {
                    LazyVGrid(columns: columns, alignment: .leading, spacing: 18) {
                        ForEach(spots) { spot in tile(spot).id(spot.id) }
                    }
                    .padding(.vertical, 6)
                }
                .onAppear { proxy.scrollTo(settings.spotId, anchor: .center) }
            }
        }
        .padding(.horizontal, 26)
        .padding(.vertical, 20)
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
    }

    private func tile(_ spot: Spot) -> some View {
        let current = spot.id == settings.spotId
        let mark: SpotTile.Mark = settings.shuffle ? (settings.inPool(spot) ? .pooled : .unpooled) : (current ? .selected : .none)
        return SpotTile(spot: spot, mark: mark, current: current, showCharacters: settings.showCharacters) {
            if settings.shuffle {
                settings.togglePool(spot)
            } else {
                settings.spotId = spot.id
            }
        }
        .contextMenu {
            Button("이 장면으로 바꾸기") { settings.spotId = spot.id }
        }
    }

    /// Whole band in or out of the shuffle pool.
    private func bandPoolButton(_ band: String, _ spots: [Spot]) -> some View {
        let all = spots.allSatisfy(settings.inPool)
        return CapsuleButton(title: all ? "전체 해제" : "전체 선택") {
            settings.setPool(spots, included: !all)
        }
        .accessibilityLabel("\(band) \(all ? "전체 해제" : "전체 선택")")
    }

    // MARK: - Detail options (표시 / 셔플 sections)

    private var displayOptions: some View {
        VStack(alignment: .trailing, spacing: 14) {
            ScrollView {
                VStack(spacing: 14) {
                    switch nav.section {
                    case .display:
                        onOffPill(.characters, "캐릭터 표시", $settings.showCharacters)
                        onOffPill(.parallax, "커서 따라 시점 이동", $settings.cursorParallax)
                        onOffPill(.lockScreen, "잠금 화면에도 표시", $settings.lockScreen)
                    case .shuffle:
                        onOffPill(.shuffle, "장면 셔플", $settings.shuffle, badge: settings.shuffle ? "적용 중" : nil)
                        intervalPill
                        OptionPill(title: "셔플 대상", value: "\(settings.shufflePool.count)개 장면",
                                   enabled: settings.shuffle, expandable: false) { nav.tab = .scene }
                    }
                }
                .frame(width: 430)
                .padding(.vertical, 2)
                .animation(.easeOut(duration: 0.15), value: nav.expanded)
            }
            CapsuleButton(title: "기본값으로 되돌리기", action: resetSection)
        }
        .padding(.horizontal, 30)
        .padding(.vertical, 20)
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topTrailing)
    }

    /// Pill that opens an OFF / ON choice (a tap never flips the value itself).
    private func onOffPill(_ option: SettingsNav.Option, _ title: String, _ value: Binding<Bool>,
                           badge: String? = nil) -> some View {
        OptionPill(title: title, value: value.wrappedValue ? "ON" : "OFF", badge: badge,
                   expanded: nav.expanded == option, action: { nav.toggle(option) }) {
            HStack(spacing: 16) {
                RadioChoice(title: "OFF", selected: !value.wrappedValue) { value.wrappedValue = false }
                RadioChoice(title: "ON", selected: value.wrappedValue) { value.wrappedValue = true }
                Spacer(minLength: 0)
            }
        }
    }

    /// Interval stepper, modelled on the game's "슬라이드 불투명도" detail:
    /// [∨] value [∧], without the slider and its 10 / 100 end labels.
    private var intervalPill: some View {
        let all = ShuffleInterval.allCases
        let index = all.firstIndex(of: settings.shuffleInterval) ?? 0
        return OptionPill(title: "변경 주기", value: settings.shuffleInterval.shortLabel, enabled: settings.shuffle,
                          expanded: nav.expanded == .interval && settings.shuffle,
                          action: { nav.toggle(.interval) }) {
            StepperField(value: settings.shuffleInterval.shortLabel,
                         canDown: index > 0, canUp: index < all.count - 1,
                         down: { settings.shuffleInterval = all[index - 1] },
                         up: { settings.shuffleInterval = all[index + 1] })
        }
    }

    /// "기본값으로 되돌리기" resets only the section on screen, as in the game.
    private func resetSection() {
        switch nav.section {
        case .display:
            settings.showCharacters = true
            settings.cursorParallax = true
            settings.lockScreen = true
        case .shuffle:
            settings.shuffle = false
            settings.shuffleInterval = .minutes10
            settings.setPool(SpotCatalog.spots, included: true)
        }
    }
}

private struct SpotTile: View {
    /// Corner badge: current pick (normal mode) or pool membership (shuffle).
    enum Mark {
        case none
        case selected
        case pooled
        case unpooled
    }

    let spot: Spot
    let mark: Mark
    let current: Bool
    let showCharacters: Bool
    let action: () -> Void

    private var highlighted: Bool { mark == .selected || mark == .pooled }

    var body: some View {
        Button(action: action) {
            VStack(alignment: .leading, spacing: 6) {
                ZStack(alignment: .topTrailing) {
                    thumbnail
                        .aspectRatio(16 / 9, contentMode: .fit)
                        .clipShape(RoundedRectangle(cornerRadius: 8))
                        .opacity(mark == .unpooled ? 0.45 : 1)
                        .overlay(
                            RoundedRectangle(cornerRadius: 8)
                                .strokeBorder(highlighted ? Theme.tealTop : Color.white.opacity(0.35),
                                              lineWidth: highlighted ? 3 : 1)
                        )
                    badge.padding(6)
                }
                Text(spot.name)
                    .font(Theme.font(13, highlighted ? .bold : .medium))
                    .foregroundStyle(.white)
                    .lineLimit(1)
            }
            .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
        .accessibilityLabel("\(spot.band) \(spot.name)\(current ? ", 현재 장면" : "")")
        .accessibilityAddTraits(highlighted ? [.isSelected] : [])
    }

    @ViewBuilder private var badge: some View {
        switch mark {
        case .none:
            EmptyView()
        case .selected, .pooled:
            Image(systemName: "checkmark.circle.fill")
                .font(.title2)
                .symbolRenderingMode(.palette)
                .foregroundStyle(.white, Theme.tealTop)
        case .unpooled:
            Image(systemName: "circle")
                .font(.title2)
                .foregroundStyle(.white)
                .shadow(radius: 2)
        }
    }

    @ViewBuilder private var thumbnail: some View {
        if let image = SpotCatalog.thumbnail(for: spot, characters: showCharacters) {
            Image(nsImage: image).resizable()
        } else {
            Rectangle().fill(Color.secondary.opacity(0.2))
        }
    }
}

/// Hosts SettingsView in a regular window; the app itself stays menu-bar only.
final class SettingsWindowController: NSWindowController {
    /// Fixed width (four thumbnail columns); only the height can change.
    static let width: CGFloat = 980

    private var nav: SettingsNav?
    private var easterEgg: EasterEggListener?

    convenience init(settings: WallpaperSettings) {
        let window = NSWindow(
            contentRect: NSRect(x: 0, y: 0, width: Self.width, height: 700),
            styleMask: [.titled, .closable, .miniaturizable, .resizable],
            backing: .buffered, defer: false
        )
        let nav = SettingsNav(settings: settings)
        window.title = "설정"
        window.contentViewController = NSHostingController(rootView: SettingsView(settings: settings, nav: nav))
        window.setContentSize(NSSize(width: Self.width, height: 700))
        window.contentMinSize = NSSize(width: Self.width, height: 560)
        window.contentMaxSize = NSSize(width: Self.width, height: .greatestFiniteMagnitude)
        window.collectionBehavior.insert(.fullScreenNone)
        window.center()
        window.isReleasedWhenClosed = false
        self.init(window: window)
        self.nav = nav
        easterEgg = EasterEggListener(window: window, settings: settings)
    }

    func present(tab: SettingsNav.Tab? = nil) {
        if let tab { nav?.tab = tab }
        NSApp.activate(ignoringOtherApps: true)
        showWindow(nil)
        window?.makeKeyAndOrderFront(nil)
    }
}
