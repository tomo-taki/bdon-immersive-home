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

    init(character: SpotCharacter, drawable: OpaquePointer, model: Mat4, animation: String?) {
        self.character = character
        self.drawable = drawable
        self.model = model
        self.animation = animation
    }

    deinit { sb_dispose(drawable) }
}

/// Atlas pages come back to C as retained MTLTexture pointers.
enum TextureBridge {
    static var device: MTLDevice?
    private static var live = NSHashTable<AnyObject>.weakObjects()

    /// Atlas pages currently alive (QA).
    static func allocatedMB() -> Int {
        live.allObjects.compactMap { ($0 as? MTLTexture)?.allocatedSize }.reduce(0, +) / 1_048_576
    }

    static func install(device: MTLDevice) {
        self.device = device
        sb_texture_load = { path, width, height in
            guard let path, let device = TextureBridge.device,
                  let texture = try? makeTexture(path: String(cString: path), device: device, mipmapped: false) else {
                return nil
            }
            TextureBridge.live.add(texture)
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
    let room: Room
    let roomVertices: MTLBuffer
    let roomIndices: MTLBuffer
    private(set) var residents: [Resident] = []
    private var atlases: [String: OpaquePointer] = [:]

    private(set) var clock: Double = 0
    private var replayAt = Double.infinity
    private var settleUntil = SpotStage.settle
    var charactersVisible = true { didSet { applyVisibility() } }

    init(spotsDir: URL, dir: String, device: MTLDevice) throws {
        let spotDir = spotsDir.appendingPathComponent(dir)
        data = try JSONDecoder().decode(SpotData.self, from: Data(contentsOf: spotDir.appendingPathComponent("spot.json")))

        let roomURL = spotsDir.appendingPathComponent(dir.components(separatedBy: "/")[0]).appendingPathComponent("room.glb")
        room = try loadRoom(url: roomURL, root: roomMatrix(data), visible: data.roomNodes, device: device)
        roomVertices = device.makeBuffer(bytes: room.vertices, length: max(1, room.vertices.count) * MemoryLayout<RoomVertex>.stride)!
        roomIndices = device.makeBuffer(bytes: room.indices, length: max(1, room.indices.count) * 4)!

        // QA: NP_ONLY=Name,Name draws just those residents.
        let only = ProcessInfo.processInfo.environment["NP_ONLY"].map { Set($0.split(separator: ",").map(String.init)) }
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
        for resident in residents {
            sb_setup_slots(resident.drawable)
        }
    }

    /// Advance animations; false when nothing changed (the frame can be skipped).
    func advance(_ delta: Double, cameraMoving: Bool) -> Bool {
        clock += delta
        let replay = clock >= replayAt
        if replay {
            replayAt = .infinity
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
        if completed, replayAt == .infinity, !residents.contains(where: { $0.character.loop }) {
            replayAt = clock + Double.random(in: Self.replayMin ... Self.replayMax)
        }
        return true
    }
}
