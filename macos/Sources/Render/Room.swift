import CoreGraphics
import Foundation
import ImageIO
import Metal
import simd

// Minimal glTF 2.0 binary reader for the Spot rooms: KHR_materials_unlit,
// one embedded image, float positions/UVs, u16/u32 indices, node TRS or
// matrix transforms. Vertices are baked into world space at load time
// (the room never moves).

struct RoomVertex {
    var position: SIMD3<Float>
    var uv: SIMD2<Float>
}

struct RoomMesh {
    let firstIndex: Int
    let indexCount: Int
    let transparent: Bool
    let texture: Int           // index into Room.textures
    let center: SIMD3<Float>   // world-space bounds centre (transparent sort)
}

struct Room {
    var vertices: [RoomVertex] = []
    var indices: [UInt32] = []
    var meshes: [RoomMesh] = []
    var textures: [MTLTexture] = []
}

enum GLBError: Error { case format(String) }

private struct GLTF: Decodable {
    struct Scene: Decodable { let nodes: [Int]? }
    struct Node: Decodable {
        let children: [Int]?
        let mesh: Int?
        let matrix: [Float]?
        let translation: [Float]?
        let rotation: [Float]?
        let scale: [Float]?
    }
    struct Mesh: Decodable {
        struct Primitive: Decodable {
            let attributes: [String: Int]
            let indices: Int?
            let material: Int?
        }
        let primitives: [Primitive]
    }
    struct Accessor: Decodable {
        let bufferView: Int?
        let byteOffset: Int?
        let componentType: Int
        let count: Int
        let type: String
    }
    struct BufferView: Decodable {
        let byteOffset: Int?
        let byteLength: Int
        let byteStride: Int?
    }
    struct Material: Decodable {
        struct PBR: Decodable {
            struct TextureRef: Decodable { let index: Int }
            let baseColorTexture: TextureRef?
        }
        let name: String?
        let pbrMetallicRoughness: PBR?
    }
    struct Texture: Decodable { let source: Int? }
    struct Image: Decodable { let bufferView: Int? }

    let scene: Int?
    let scenes: [Scene]
    let nodes: [Node]
    let meshes: [Mesh]
    let accessors: [Accessor]
    let bufferViews: [BufferView]
    let materials: [Material]?
    let textures: [Texture]?
    let images: [Image]?
}

func loadRoom(url: URL, root: Mat4, visible: [Bool], device: MTLDevice) throws -> Room {
    let data = try Data(contentsOf: url)
    func u32(_ at: Int) -> Int { Int(data.withUnsafeBytes { $0.loadUnaligned(fromByteOffset: at, as: UInt32.self) }) }
    guard data.count > 20, u32(0) == 0x4654_6C67 else { throw GLBError.format("not glb") }

    let jsonLength = u32(12)
    let json = data.subdata(in: 20 ..< 20 + jsonLength)
    let binStart = 20 + jsonLength + 8
    let gltf = try JSONDecoder().decode(GLTF.self, from: json)
    let bin = data.subdata(in: binStart ..< data.count)

    func viewBytes(_ index: Int) -> Data {
        let view = gltf.bufferViews[index]
        let start = view.byteOffset ?? 0
        return bin.subdata(in: start ..< start + view.byteLength)
    }

    func floats(_ accessorIndex: Int, components: Int) -> [Float] {
        let accessor = gltf.accessors[accessorIndex]
        let view = gltf.bufferViews[accessor.bufferView!]
        let stride = view.byteStride ?? components * 4
        let base = (view.byteOffset ?? 0) + (accessor.byteOffset ?? 0)
        var out = [Float](repeating: 0, count: accessor.count * components)
        bin.withUnsafeBytes { raw in
            for i in 0 ..< accessor.count {
                for c in 0 ..< components {
                    out[i * components + c] = raw.loadUnaligned(fromByteOffset: base + i * stride + c * 4, as: Float.self)
                }
            }
        }
        return out
    }

    func indexList(_ accessorIndex: Int) -> [UInt32] {
        let accessor = gltf.accessors[accessorIndex]
        let view = gltf.bufferViews[accessor.bufferView!]
        let base = (view.byteOffset ?? 0) + (accessor.byteOffset ?? 0)
        return bin.withUnsafeBytes { raw in
            (0 ..< accessor.count).map { i in
                switch accessor.componentType {
                case 5121: return UInt32(raw.load(fromByteOffset: base + i, as: UInt8.self))
                case 5123: return UInt32(raw.loadUnaligned(fromByteOffset: base + i * 2, as: UInt16.self))
                default: return raw.loadUnaligned(fromByteOffset: base + i * 4, as: UInt32.self)
                }
            }
        }
    }

    // Textures: images in order; texture -> image mapping below.
    let images = try (gltf.images ?? []).map { image -> MTLTexture in
        guard let view = image.bufferView else { throw GLBError.format("external image") }
        return try makeTexture(data: viewBytes(view), device: device, mipmapped: true)
    }

    var room = Room()
    room.textures = images

    func localMatrix(_ node: GLTF.Node) -> Mat4 {
        if let m = node.matrix { return Mat4(columnMajor: m) }
        let t = node.translation.map { SIMD3($0[0], $0[1], $0[2]) } ?? .zero
        let r = node.rotation.map { simd_quatf(ix: $0[0], iy: $0[1], iz: $0[2], r: $0[3]) } ?? simd_quatf(angle: 0, axis: SIMD3(0, 1, 0))
        let s = node.scale.map { SIMD3($0[0], $0[1], $0[2]) } ?? SIMD3(1, 1, 1)
        return .compose(t, r, s)
    }

    // A hidden node hides its whole subtree (three.js Object3D.visible).
    func visit(_ index: Int, parent: Mat4) {
        if index < visible.count, !visible[index] { return }
        let node = gltf.nodes[index]
        let world = parent * localMatrix(node)

        if let meshIndex = node.mesh {
            for primitive in gltf.meshes[meshIndex].primitives {
                guard let positionAccessor = primitive.attributes["POSITION"],
                      let uvAccessor = primitive.attributes["TEXCOORD_0"] else { continue }
                let positions = floats(positionAccessor, components: 3)
                let uvs = floats(uvAccessor, components: 2)
                let count = positions.count / 3

                let material = primitive.material.flatMap { gltf.materials?[$0] }
                let transparent = material?.name?.hasSuffix("_transparent") ?? false
                let textureRef = material?.pbrMetallicRoughness?.baseColorTexture?.index ?? 0
                let image = gltf.textures?[textureRef].source ?? 0

                // Local bounds centre, as three.js' geometry.boundingSphere.
                var low = SIMD3<Float>(repeating: .infinity), high = SIMD3<Float>(repeating: -.infinity)
                let base = UInt32(room.vertices.count)
                for i in 0 ..< count {
                    let p = SIMD3(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2])
                    low = simd_min(low, p)
                    high = simd_max(high, p)
                    let w = world * SIMD4(p, 1)
                    room.vertices.append(RoomVertex(position: SIMD3(w.x, w.y, w.z), uv: SIMD2(uvs[i * 2], uvs[i * 2 + 1])))
                }
                let local = primitive.indices.map(indexList) ?? (0 ..< UInt32(count)).map { $0 }
                let first = room.indices.count
                room.indices.append(contentsOf: local.map { $0 + base })
                let c = world * SIMD4((low + high) / 2, 1)
                room.meshes.append(RoomMesh(firstIndex: first, indexCount: local.count, transparent: transparent,
                                            texture: image, center: SIMD3(c.x, c.y, c.z)))
            }
        }
        for child in node.children ?? [] {
            visit(child, parent: world)
        }
    }

    for index in gltf.scenes[gltf.scene ?? 0].nodes ?? [] {
        visit(index, parent: root)
    }
    return room
}

// MARK: - Textures

/// Decode an image into an RGBA8 texture with premultiplied alpha (what
/// CoreGraphics produces, and what spine-threejs uploads for atlas pages).
func makeTexture(data: Data, device: MTLDevice, mipmapped: Bool) throws -> MTLTexture {
    guard let source = CGImageSourceCreateWithData(data as CFData, nil),
          let image = CGImageSourceCreateImageAtIndex(source, 0, nil) else {
        throw GLBError.format("image decode failed")
    }
    return try makeTexture(image: image, device: device, mipmapped: mipmapped)
}

func makeTexture(path: String, device: MTLDevice, mipmapped: Bool) throws -> MTLTexture {
    try makeTexture(data: Data(contentsOf: URL(fileURLWithPath: path)), device: device, mipmapped: mipmapped)
}

private func makeTexture(image: CGImage, device: MTLDevice, mipmapped: Bool) throws -> MTLTexture {
    let width = image.width, height = image.height
    var pixels = [UInt8](repeating: 0, count: width * height * 4)
    let space = CGColorSpace(name: CGColorSpace.sRGB)!
    let drawn: Bool = pixels.withUnsafeMutableBytes { raw in
        guard let context = CGContext(data: raw.baseAddress, width: width, height: height, bitsPerComponent: 8,
                                      bytesPerRow: width * 4, space: space,
                                      bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue) else { return false }
        context.draw(image, in: CGRect(x: 0, y: 0, width: width, height: height))
        return true
    }
    guard drawn else { throw GLBError.format("bitmap context") }

    let descriptor = MTLTextureDescriptor.texture2DDescriptor(pixelFormat: .rgba8Unorm, width: width, height: height,
                                                              mipmapped: mipmapped)
    descriptor.usage = .shaderRead
    // GPU-private textures get Apple silicon's layout and bandwidth compression;
    // "lossy" additionally halves (or better) their memory. NP_TEXTURE picks
    // shared (the old path) / private / lossy for QA.
    let mode = QA.texture ?? TextureStorage.mode
    if mode == "shared" {
        guard let texture = device.makeTexture(descriptor: descriptor) else { throw GLBError.format("texture alloc") }
        texture.replace(region: MTLRegionMake2D(0, 0, width, height), mipmapLevel: 0, withBytes: pixels, bytesPerRow: width * 4)
        if mipmapped, let queue = TextureStorage.queue(device), let buffer = queue.makeCommandBuffer(),
           let blit = buffer.makeBlitCommandEncoder() {
            blit.generateMipmaps(for: texture)
            blit.endEncoding()
            buffer.commit()
            buffer.waitUntilCompleted()
        }
        return texture
    }
    descriptor.storageMode = .private
    if mode == "lossy", device.supportsFamily(.apple8) {
        descriptor.compressionType = .lossy
    }
    guard let texture = device.makeTexture(descriptor: descriptor),
          let staging = pixels.withUnsafeBytes({ device.makeBuffer(bytes: $0.baseAddress!, length: $0.count, options: .storageModeShared) }),
          let queue = TextureStorage.queue(device), let buffer = queue.makeCommandBuffer(),
          let blit = buffer.makeBlitCommandEncoder() else { throw GLBError.format("texture alloc") }
    blit.copy(from: staging, sourceOffset: 0, sourceBytesPerRow: width * 4, sourceBytesPerImage: width * height * 4,
              sourceSize: MTLSize(width: width, height: height, depth: 1),
              to: texture, destinationSlice: 0, destinationLevel: 0, destinationOrigin: MTLOrigin())
    if mipmapped {
        blit.generateMipmaps(for: texture)
    }
    blit.endEncoding()
    buffer.commit()
    buffer.waitUntilCompleted()
    return texture
}

enum TextureStorage {
    /// Default for textures loaded from disk: "shared" | "private" | "lossy".
    /// Lossy measured on 40001/30001/10001 at 1080p: mean pixel error
    /// 0.21-0.36 of 255, differences only on alpha-cutout edges; ~50 MB less.
    static var mode = "lossy"
    private static var queues: [ObjectIdentifier: MTLCommandQueue] = [:]
    private static let lock = NSLock()
    static func queue(_ device: MTLDevice) -> MTLCommandQueue? {
        lock.lock()
        defer { lock.unlock() }
        if let q = queues[ObjectIdentifier(device)] { return q }
        let q = device.makeCommandQueue()
        queues[ObjectIdentifier(device)] = q
        return q
    }
}

