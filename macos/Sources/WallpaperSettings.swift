import Combine
import Foundation

/// When shuffle moves on to the next Spot.
enum ShuffleInterval: String, CaseIterable, Identifiable {
    case minute1
    case minutes5
    case minutes10
    case minutes30
    case hour1

    var id: String { rawValue }

    var label: String {
        switch self {
        case .minute1: return "1분마다"
        case .minutes5: return "5분마다"
        case .minutes10: return "10분마다"
        case .minutes30: return "30분마다"
        case .hour1: return "1시간마다"
        }
    }

    /// "10분" for the settings stepper.
    var shortLabel: String { String(label.dropLast(2)) }

    var seconds: TimeInterval {
        switch self {
        case .minute1: return 60
        case .minutes5: return 5 * 60
        case .minutes10: return 10 * 60
        case .minutes30: return 30 * 60
        case .hour1: return 60 * 60
        }
    }
}

/// User choices, persisted in UserDefaults. The wallpaper and the settings
/// window both observe this one object.
final class WallpaperSettings: ObservableObject {
    static let shared = WallpaperSettings()

    private static let spotKey = "spotId"
    private static let charactersKey = "showCharacters"
    private static let parallaxKey = "cursorParallax"
    private static let shuffleKey = "shuffle"
    private static let poolKey = "shufflePool"
    private static let intervalKey = "shuffleInterval"
    private static let easterEggKey = "easterEgg"
    private static let lockScreenKey = "lockScreen"
    private static let defaultSpot = "30001"

    @Published var spotId: String {
        didSet { UserDefaults.standard.set(spotId, forKey: Self.spotKey) }
    }

    /// Applies to every background.
    @Published var showCharacters: Bool {
        didSet { UserDefaults.standard.set(showCharacters, forKey: Self.charactersKey) }
    }

    /// Camera turns toward the cursor.
    @Published var cursorParallax: Bool {
        didSet { UserDefaults.standard.set(cursorParallax, forKey: Self.parallaxKey) }
    }

    @Published var shuffle: Bool {
        didSet { UserDefaults.standard.set(shuffle, forKey: Self.shuffleKey) }
    }

    /// Spot ids shuffle picks from.
    @Published var shufflePool: Set<String> {
        didSet { UserDefaults.standard.set(Array(shufflePool).sorted(), forKey: Self.poolKey) }
    }

    @Published var shuffleInterval: ShuffleInterval {
        didSet { UserDefaults.standard.set(shuffleInterval.rawValue, forKey: Self.intervalKey) }
    }

    @Published var easterEgg: EasterEgg {
        didSet { UserDefaults.standard.set(easterEgg.rawValue, forKey: Self.easterEggKey) }
    }

    /// Mirror the Spot onto the desktop picture, which the lock screen shows.
    @Published var lockScreen: Bool {
        didSet { UserDefaults.standard.set(lockScreen, forKey: Self.lockScreenKey) }
    }

    var spot: Spot? {
        SpotCatalog.spot(id: spotId) ?? SpotCatalog.spots.first
    }

    private init() {
        let defaults = UserDefaults.standard
        let saved = defaults.string(forKey: Self.spotKey) ?? Self.defaultSpot
        spotId = SpotCatalog.spot(id: saved) != nil ? saved : Self.defaultSpot
        showCharacters = defaults.object(forKey: Self.charactersKey) as? Bool ?? true
        cursorParallax = defaults.object(forKey: Self.parallaxKey) as? Bool ?? true
        shuffle = defaults.bool(forKey: Self.shuffleKey)

        // First run: every Spot is in the pool.
        let pool = defaults.stringArray(forKey: Self.poolKey) ?? SpotCatalog.spots.map(\.id)
        shufflePool = Set(pool).intersection(SpotCatalog.spots.map(\.id))

        let interval = defaults.string(forKey: Self.intervalKey).flatMap(ShuffleInterval.init(rawValue:))
        shuffleInterval = interval ?? .minutes10
        easterEgg = defaults.string(forKey: Self.easterEggKey).flatMap(EasterEgg.init(rawValue:)) ?? .none
        lockScreen = defaults.object(forKey: Self.lockScreenKey) as? Bool ?? true
    }

    // MARK: - Shuffle pool

    func inPool(_ spot: Spot) -> Bool {
        shufflePool.contains(spot.id)
    }

    func togglePool(_ spot: Spot) {
        if shufflePool.contains(spot.id) {
            shufflePool.remove(spot.id)
        } else {
            shufflePool.insert(spot.id)
        }
    }

    /// Whole band in or out of the pool.
    func setPool(_ spots: [Spot], included: Bool) {
        let ids = Set(spots.map(\.id))
        shufflePool = included ? shufflePool.union(ids) : shufflePool.subtracting(ids)
    }

    /// Random pooled Spot other than the current one; nil when there is none.
    func nextShuffleSpot() -> Spot? {
        let candidates = SpotCatalog.spots.filter { shufflePool.contains($0.id) && $0.id != spotId }
        return candidates.randomElement()
    }
}
