import Foundation
import Metal
import simd
import SpineBridge

// One Spot situation: room + residents, animation clock and replay.
// Port of web/src/spot-stage.ts without the WebGL layer.

final class Resident {
    let character: SpotCharacter
    let drawable: OpaquePointer
    let model: Mat4
    let animation: String?
    /// Slots that draw people; the rest is furniture that stays with characters off.
    let personSlots: [Int32]
    let hasProps: Bool
    let slotNames: [String]
    /// Drawn this frame (characters toggle / easter egg); see SpotStage.applyVisibility.
    fileprivate(set) var visible = true
    fileprivate var blanked: Set<Int32> = []

    init(character: SpotCharacter, drawable: OpaquePointer, model: Mat4, animation: String?) {
        self.character = character
        self.drawable = drawable
        self.model = model
        self.animation = animation
        let names = (0 ..< sb_slot_count(drawable)).map { String(cString: sb_slot_name(drawable, $0)) }
        slotNames = names
        let person = SlotNames.isPerson(character.name) || names.contains(where: SlotNames.isPerson)
        personSlots = person ? names.indices.filter { !SlotNames.isProp(names[$0]) }.map(Int32.init) : []
        hasProps = personSlots.count < names.count
    }

    deinit { sb_dispose(drawable) }
}

/// Slot / resident name rules, same as web/src/spot-stage.ts (audited against
/// every Spot's slot names there).
enum SlotNames {
    /// Easter egg: band members a resident's name or slot names refer to.
    static let memberTokens: [String: [String]] = [
        "tomori": ["tomori", "燈"],
        "taki": ["taki", "立希"],
        "anon": ["anon", "愛音"],
        "soyo": ["soyo", "そよ"],
        "rana": ["rana", "楽奈"],
    ]

    static func members(in name: String) -> [String] {
        let lower = name.lowercased()
        return memberTokens.keys.sorted().filter { memberTokens[$0]!.contains(where: lower.contains) }
    }

    private static let people = [
        "tomori", "taki", "anon", "soyo", "rana", "燈", "立希", "愛音", "そよ", "楽奈",
        "sakiko", "uika", "mutsumi", "umiri", "nyamu", "祥子", "初華", "睦", "海鈴", "にゃむ",
        "nonoka", "arare", "miyako", "yuno", "ritsu", "manager", "marukun",
        "houka", "hotaru", "mahoro", "natsume", "nagi", "kanata",
        "raika", "chieri", "yomogi", "miku", "shizuku",
    ]
    // Furniture even when named after a resident or a shadow ("hotaru_chair_3", "chair_shadow").
    private static let propAlways = try! NSRegularExpression(
        pattern: "chair|armrest|sofa|door|handrail|menu|coaster|teaset|komono|bucket|balcony|_item|(^|_)pc(_|$)")
    // A resident's shadow cast on furniture belongs to her, as does her speech-bubble backdrop.
    private static let shadow = try! NSRegularExpression(pattern: "shadow|syadow|wipe")
    // "table(?!t)": a held tablet is hers.
    private static let prop = try! NSRegularExpression(
        pattern: "table(?!t)|stall|bench|stage|dish|(^|_)bg(\\d|_|$)|(^|_)ef_\\d|smoke")

    static func isPerson(_ name: String) -> Bool {
        let lower = name.lowercased()
        return people.contains(where: lower.contains)
    }

    static func isProp(_ name: String) -> Bool {
        let lower = name.lowercased()
        return matches(propAlways, lower) || (!matches(shadow, lower) && matches(prop, lower))
    }

    private static func matches(_ regex: NSRegularExpression, _ text: String) -> Bool {
        regex.firstMatch(in: text, range: NSRange(text.startIndex..., in: text)) != nil
    }
}

/// Atlas pages come back to C as retained MTLTexture pointers. Spots load on
/// a background queue, so the bookkeeping is locked.
enum TextureBridge {
    static var device: MTLDevice?
    private static let lock = NSLock()
    private static var live = NSHashTable<AnyObject>.weakObjects()

    /// Atlas pages currently alive (QA).
    static func allocatedMB() -> Int {
        lock.lock()
        defer { lock.unlock() }
        return live.allObjects.compactMap { ($0 as? MTLTexture)?.allocatedSize }.reduce(0, +) / 1_048_576
    }

    static func install(device: MTLDevice) {
        self.device = device
        sb_texture_load = { path, width, height in
            guard let path, let device = TextureBridge.device,
                  let texture = try? makeTexture(path: String(cString: path), device: device, mipmapped: false) else {
                return nil
            }
            TextureBridge.lock.lock()
            TextureBridge.live.add(texture)
            TextureBridge.lock.unlock()
            width?.pointee = Int32(texture.width)
            height?.pointee = Int32(texture.height)
            return Unmanaged.passRetained(texture as AnyObject).toOpaque()
        }
        sb_texture_release = { pointer in
            guard let pointer else { return }
            Unmanaged<AnyObject>.fromOpaque(pointer).release()
        }
    }

    static func texture(_ pointer: UnsafeMutableRawPointer?) -> MTLTexture? {
        guard let pointer else { return nil }
        return Unmanaged<AnyObject>.fromOpaque(pointer).takeUnretainedValue() as? MTLTexture
    }
}

final class SpotStage {
    private static let replayMin: Double = 18
    private static let replayMax: Double = 40
    private static let settle: Double = 3

    let data: SpotData
    /// Edge-coverage zoom per aspect (cover.json); nil = no zoom.
    let cover: CoverTable?
    let room: Room
    let roomVertices: MTLBuffer
    let roomIndices: MTLBuffer
    private(set) var residents: [Resident] = []
    private var atlases: [String: OpaquePointer] = [:]

    private(set) var clock: Double = 0
    /// Seconds since the choreography last (re)started: what another
    /// display's stage fast-forwards to so both show the same moment.
    private(set) var playTime: Double = 0
    /// A follower never picks its own replay time; its leader calls replayNow().
    var follows = false {
        didSet { if oldValue, !follows { scheduleReplayIfIdle() } }
    }
    /// The choreography restarted (only the leader's matters).
    var onReplay: (() -> Void)?
    private var replayAt = Double.infinity
    private var settleUntil = SpotStage.settle
    /// Clock of the last frame a clip was playing (or the choreography restarted).
    private var lastActive: Double = 0
    /// Seconds since the last clip stopped (0 while one plays).
    var quietFor: Double { clock - lastActive }
    var charactersVisible = true { didSet { applyVisibility() } }
    /// Easter egg: members to leave out (e.g. ["anon", "soyo"]). A resident that
    /// is only hidden members disappears; one shared with a shown member
    /// (TakiRana) keeps its skeleton and blanks the hidden member's slots.
    var hiddenMembers: Set<String> = [] { didSet { applyVisibility() } }

    init(spotsDir: URL, dir: String, device: MTLDevice) throws {
        let spotDir = spotsDir.appendingPathComponent(dir)
        data = try JSONDecoder().decode(SpotData.self, from: Data(contentsOf: spotDir.appendingPathComponent("spot.json")))
        // QA: BDON_NOCOVER=1 ignores cover.json (measuring, before/after shots).
        cover = ProcessInfo.processInfo.environment["BDON_NOCOVER"] == "1" ? nil : CoverTable.load(spotDir: spotDir)

        let roomURL = spotsDir.appendingPathComponent(dir.components(separatedBy: "/")[0]).appendingPathComponent("room.glb")
        room = try loadRoom(url: roomURL, root: roomMatrix(data), visible: data.roomNodes, device: device)
        roomVertices = device.makeBuffer(bytes: room.vertices, length: max(1, room.vertices.count) * MemoryLayout<RoomVertex>.stride)!
        roomIndices = device.makeBuffer(bytes: room.indices, length: max(1, room.indices.count) * 4)!

        // QA: NP_ONLY=Name,Name draws just those residents.
        let only = QA.only
        for character in data.characters where only?.contains(character.name) ?? true {
            var atlas = atlases[character.atlas]
            if atlas == nil {
                atlas = sb_atlas_load(spotDir.appendingPathComponent(character.atlas).path)
                atlases[character.atlas] = atlas
            }
            guard let atlas else { throw GLBError.format("atlas \(character.atlas)") }

            var error = [CChar](repeating: 0, count: 256)
            guard let drawable = sb_create(atlas, spotDir.appendingPathComponent(character.skeleton).path,
                                           character.scale, &error, Int32(error.count)) else {
                throw GLBError.format("\(character.skeleton): \(String(cString: error))")
            }
            // No (or unknown) animation name: Unity shows the setup pose.
            var animation: String?
            if let name = character.animation, !name.isEmpty, sb_set_animation(drawable, name, character.loop ? 1 : 0) == 1 {
                animation = name
            }
            residents.append(Resident(character: character, drawable: drawable,
                                      model: unityMatrix(character.world), animation: animation))
        }
    }

    deinit {
        residents.removeAll()
        atlases.values.forEach { sb_atlas_dispose($0) }
    }

    private func applyVisibility() {
        settleUntil = clock + Self.settle
        lastActive = clock
        for resident in residents {
            // Blanked slots only get an attachment back from a keyed animation,
            // so restore the setup pose; the next update re-applies the clip.
            sb_setup_slots(resident.drawable)

            let named = SlotNames.members(in: resident.character.name)
            let wholeHidden = !named.isEmpty && named.allSatisfy(hiddenMembers.contains)
            var blank: Set<Int32> = []
            if !named.isEmpty, !wholeHidden, named.contains(where: hiddenMembers.contains) {
                for (index, name) in resident.slotNames.enumerated() {
                    let members = SlotNames.members(in: name)
                    if !members.isEmpty, members.allSatisfy(hiddenMembers.contains) {
                        blank.insert(Int32(index))
                    }
                }
            }
            // Characters off: a resident with furniture keeps drawing it.
            let peopleOnly = !resident.personSlots.isEmpty && !resident.hasProps
            if !charactersVisible {
                blank.formUnion(resident.personSlots)
            }
            resident.visible = !(peopleOnly && !charactersVisible) && !wholeHidden

            for index in resident.blanked.subtracting(blank) {
                sb_set_blank(resident.drawable, index, 0)
            }
            for index in blank.subtracting(resident.blanked) {
                sb_set_blank(resident.drawable, index, 1)
            }
            resident.blanked = blank
        }
    }

    /// Advance animations; false when nothing changed (the frame can be skipped).
    func advance(_ delta: Double, cameraMoving: Bool) -> Bool {
        clock += delta
        playTime += delta
        let replay = clock >= replayAt
        if replay {
            replayAt = .infinity
            playTime = 0
            onReplay?()
        }

        var animating = false
        for resident in residents {
            if replay, let name = resident.animation {
                sb_set_animation(resident.drawable, name, 0)
            }
            if sb_is_animating(resident.drawable) == 1 {
                animating = true
            }
        }
        if animating || replay {
            settleUntil = clock + Self.settle
            lastActive = clock
        }
        guard cameraMoving || clock <= settleUntil else { return false }

        var completed = false
        for resident in residents {
            sb_update(resident.drawable, Float(delta))
            if sb_take_completions(resident.drawable) > 0 {
                completed = true
            }
        }
        // The residents' clips are one choreography: one replay time for all.
        if completed {
            scheduleReplayIfIdle()
        }
        return true
    }

    /// Restart the choreography on the next advance (a follower copying its leader).
    func replayNow() {
        replayAt = clock
    }

    /// Catch up with a stage that has played `target` seconds, in frame-sized
    /// steps so clip completions and settling behave as if it had been running.
    func fastForward(to target: Double) {
        let step = 1.0 / 30
        while playTime + step <= target {
            // Settled: the leader stopped posing too, so only the clock moves.
            guard advance(step, cameraMoving: false) else {
                let rest = target - playTime
                clock += rest
                playTime += rest
                return
            }
            // Still animating after a minute (a looping clip): one jump, which
            // wraps by itself, instead of steps for every second it looped.
            if playTime >= Self.fastForwardStepped, target > playTime {
                _ = advance(target - playTime, cameraMoving: true)
                return
            }
        }
    }
    private static let fastForwardStepped: Double = 60

    /// The residents' clips are one choreography: one replay time for all.
    private func scheduleReplayIfIdle() {
        guard !follows, replayAt == .infinity, !residents.contains(where: { $0.character.loop }) else { return }
        replayAt = clock + Double.random(in: Self.replayMin ... Self.replayMax)
    }
}
