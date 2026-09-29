import AppKit

/// Settings-window easter egg: type a pair code to leave the other pair out
/// of MyGO!!!!! scenes. Typing the same code again rolls it back.
///
///   토모타키 (tmtk, tktm, tomotaki, takitomo) : scenes with Tomori and Taki
///                                           lose Anon and Soyo
///   아논소요 (ansy, syan, anonsoyo, soyoanon) : scenes with Anon and Soyo
///                                           lose Tomori and Taki
///   Rana always stays.
enum EasterEgg: String {
    case none
    case tomoTaki
    case anonSoyo

    private static let band = "MyGO!!!!!"

    /// Codes as physical QWERTY keys, so Hangul typed on 두벌식 matches too
    /// (토모타키 = xhahxkzl, 아논소요 = dkshsthdy).
    static let codes: [(String, EasterEgg)] = [
        ("tmtk", .tomoTaki), ("tktm", .tomoTaki), ("tomotaki", .tomoTaki), ("takitomo", .tomoTaki),
        ("xhahxkzl", .tomoTaki), ("xkzlxhah", .tomoTaki),
        ("ansy", .anonSoyo), ("syan", .anonSoyo), ("anonsoyo", .anonSoyo), ("soyoanon", .anonSoyo),
        ("dkshsthdy", .anonSoyo), ("thdydkshs", .anonSoyo),
    ]

    /// The egg whose code the typed keys end with.
    static func matching(_ typed: String) -> EasterEgg? {
        codes.first { typed.hasSuffix($0.0) }?.1
    }

    var label: String? {
        switch self {
        case .none: return nil
        case .tomoTaki: return "토모타키 모드"
        case .anonSoyo: return "아논소요 모드"
        }
    }

    private var kept: [String] {
        switch self {
        case .none: return []
        case .tomoTaki: return ["tomori", "taki"]
        case .anonSoyo: return ["anon", "soyo"]
        }
    }

    private var dropped: [String] {
        switch self {
        case .none: return []
        case .tomoTaki: return ["anon", "soyo"]
        case .anonSoyo: return ["tomori", "taki"]
        }
    }

    /// Members the page should hide in `spot` (renderer names, see spot-stage.ts).
    func hiddenMembers(in spot: Spot) -> [String] {
        guard self != .none, spot.band == Self.band else { return [] }
        let names = spot.characters.map { $0.lowercased() }
        let present = { (member: String) in names.contains { $0.contains(member) } }
        guard kept.allSatisfy(present) else { return [] }
        return dropped.filter(present)
    }
}

/// Collects keys typed into the settings window and fires on a code.
final class EasterEggListener {
    private static let bufferLimit = 16

    // Virtual key code -> QWERTY letter (layout independent).
    private static let letters: [UInt16: Character] = [
        0: "a", 11: "b", 8: "c", 2: "d", 14: "e", 3: "f", 5: "g", 4: "h", 34: "i",
        38: "j", 40: "k", 37: "l", 46: "m", 45: "n", 31: "o", 35: "p", 12: "q",
        15: "r", 1: "s", 17: "t", 32: "u", 9: "v", 13: "w", 7: "x", 16: "y", 6: "z",
    ]

    private var buffer = ""
    private var monitor: Any?

    init(window: NSWindow, settings: WallpaperSettings) {
        monitor = NSEvent.addLocalMonitorForEvents(matching: .keyDown) { [weak self, weak window] event in
            guard let self, event.window === window,
                  event.modifierFlags.intersection([.command, .control, .option]).isEmpty,
                  let letter = Self.letters[event.keyCode] else { return event }
            self.type(letter, settings: settings)
            return nil     // no beep: the window has no text input
        }
    }

    deinit {
        if let monitor {
            NSEvent.removeMonitor(monitor)
        }
    }

    private func type(_ letter: Character, settings: WallpaperSettings) {
        buffer.append(letter)
        buffer = String(buffer.suffix(Self.bufferLimit))
        guard let egg = EasterEgg.matching(buffer) else { return }
        buffer = ""
        settings.easterEgg = settings.easterEgg == egg ? .none : egg
    }
}
