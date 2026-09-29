// swift_reference.swift -- prints the ground-truth values the C++ host test
// compares against. It copies the PURE-MATH parts of Math.swift and Spot.swift
// verbatim (no Metal/CoreGraphics), and a mesh-count-only GLB traversal that
// mirrors Room.swift's loadRoom node-visit logic exactly.
//
// Run:  swift windows/native/tests/swift_reference.swift <spots-dir>
// Prints one JSON object to stdout: { meshes, transparentMeshes, view[16],
// projection[16], fov, residents }.

import Foundation
import simd

typealias Mat4 = simd_float4x4
let mirrorZ = Mat4(diagonal: SIMD4<Float>(1, 1, -1, 1))
let degrees: Float = .pi / 180

struct Vec3: Decodable { var x: Float; var y: Float; var z: Float; var simd: SIMD3<Float> { SIMD3(x, y, z) } }

extension Mat4 {
    init(columnMajor v: [Float]) {
        self.init(columns: (SIMD4(v[0], v[1], v[2], v[3]), SIMD4(v[4], v[5], v[6], v[7]),
                            SIMD4(v[8], v[9], v[10], v[11]), SIMD4(v[12], v[13], v[14], v[15])))
    }
    static func compose(_ t: SIMD3<Float>, _ q: simd_quatf, _ s: SIMD3<Float>) -> Mat4 {
        var m = Mat4(q); m.columns.0 *= s.x; m.columns.1 *= s.y; m.columns.2 *= s.z; m.columns.3 = SIMD4(t, 1); return m
    }
    var translation: SIMD3<Float> { SIMD3(columns.3.x, columns.3.y, columns.3.z) }
    var flat: [Float] {
        [columns.0.x, columns.0.y, columns.0.z, columns.0.w,
         columns.1.x, columns.1.y, columns.1.z, columns.1.w,
         columns.2.x, columns.2.y, columns.2.z, columns.2.w,
         columns.3.x, columns.3.y, columns.3.z, columns.3.w]
    }
}

func unityMatrix(_ values: [Float]) -> Mat4 { mirrorZ * Mat4(columnMajor: values) * mirrorZ }
func eulerYXZ(_ e: Vec3) -> simd_quatf {
    let qy = simd_quatf(angle: e.y * degrees, axis: SIMD3(0, 1, 0))
    let qx = simd_quatf(angle: e.x * degrees, axis: SIMD3(1, 0, 0))
    let qz = simd_quatf(angle: e.z * degrees, axis: SIMD3(0, 0, 1))
    return qy * qx * qz
}
func lookAt(eye: SIMD3<Float>, target: SIMD3<Float>, up: SIMD3<Float> = SIMD3(0, 1, 0)) -> Mat4 {
    let z = simd_normalize(eye - target)
    let x = simd_normalize(simd_cross(up, z))
    let y = simd_cross(z, x)
    return Mat4(columns: (SIMD4(x.x, y.x, z.x, 0), SIMD4(x.y, y.y, z.y, 0), SIMD4(x.z, y.z, z.z, 0),
                          SIMD4(-simd_dot(x, eye), -simd_dot(y, eye), -simd_dot(z, eye), 1)))
}
func perspective(fovY: Float, aspect: Float, near: Float, far: Float) -> Mat4 {
    let f = 1 / tan(fovY * degrees / 2)
    let range = far / (near - far)
    return Mat4(columns: (SIMD4(f / aspect, 0, 0, 0), SIMD4(0, f, 0, 0), SIMD4(0, 0, range, -1), SIMD4(0, 0, range * near, 0)))
}

// ---- Spot.swift (verbatim pure parts) ----
struct SpotSituation: Decodable {
    let originalOffset: Vec3; let defaultPositionOffset: Vec3; let orbitRatio: Float; let fieldOfView: Float
    let maxLeftShift: Float; let maxRightShift: Float; let maxUpShift: Float; let maxDownShift: Float
    let backgroundPosition: Vec3; let backgroundRotation: Vec3; let backgroundScale: Vec3
}
struct UnityTransform: Decodable {
    struct Quat: Decodable { let x, y, z, w: Float }
    let localPosition: Vec3; let localRotation: Quat; let localScale: Vec3
}
struct SpotCharacter: Decodable {
    let name: String; let skeleton: String; let atlas: String; let scale: Float; let world: [Float]
    let animation: String?; let loop: Bool; let order: Int
}
struct SpotData: Decodable {
    struct Camera: Decodable { let near, far, fieldOfView: Float }
    let name: String; let situation: SpotSituation; let camera: Camera
    let roomRoot: UnityTransform; let roomNodes: [Bool]; let characters: [SpotCharacter]
}
func roomMatrix(_ data: SpotData) -> Mat4 {
    let s = data.situation
    let background = Mat4.compose(s.backgroundPosition.simd, eulerYXZ(s.backgroundRotation), s.backgroundScale.simd)
    let root = data.roomRoot
    let rq = simd_quatf(ix: root.localRotation.x, iy: root.localRotation.y, iz: root.localRotation.z, r: root.localRotation.w)
    let baked = Mat4.compose(root.localPosition.simd, rq, root.localScale.simd)
    return mirrorZ * (background * baked.inverse) * mirrorZ
}
struct SpotPose { var position: SIMD3<Float>; var forward: SIMD3<Float>; var yaw: Float = 0; var pitch: Float = 0; var fov: Float }
let wideAspect: Float = 19.5 / 9
let maxFitFov: Float = 32
func fitFov(_ s: SpotSituation, width: Float, height: Float) -> Float {
    let half = tan(s.fieldOfView * degrees / 2) * wideAspect * (height / max(width, 1))
    return min(maxFitFov, max(s.fieldOfView, 2 * atan(half) / degrees))
}
func defaultPose(_ s: SpotSituation, fov: Float) -> SpotPose {
    let forward = simd_normalize(s.originalOffset.simd - s.defaultPositionOffset.simd)
    let position = s.defaultPositionOffset.simd - forward * s.orbitRatio
    return SpotPose(position: position, forward: forward, fov: fov)
}
func shiftedPose(_ base: SpotPose, px: Float, py: Float, _ s: SpotSituation, aspect: Float) -> SpotPose {
    let extraV = max(0, (base.fov - s.fieldOfView) / 2)
    func halfH(_ fov: Float, _ a: Float) -> Float { atan(tan(fov * degrees / 2) * a) / degrees }
    let extraH = max(0, halfH(base.fov, aspect) - halfH(s.fieldOfView, wideAspect))
    func limit(_ m: Float, _ e: Float) -> Float { max(0, m - e) }
    var pose = base
    pose.yaw = px >= 0 ? px * limit(s.maxRightShift, extraH) : px * limit(s.maxLeftShift, extraH)
    pose.pitch = py >= 0 ? py * limit(s.maxUpShift, extraV) : py * limit(s.maxDownShift, extraV)
    return pose
}
func lookDirection(_ pose: SpotPose) -> SIMD3<Float> {
    let f = simd_normalize(pose.forward)
    let yaw = atan2(f.x, f.z) + pose.yaw * degrees
    let pitch = asin(max(-1, min(1, f.y))) + pose.pitch * degrees
    return SIMD3(sin(yaw) * cos(pitch), sin(pitch), cos(yaw) * cos(pitch))
}
func rightHanded(_ v: SIMD3<Float>) -> SIMD3<Float> { SIMD3(v.x, v.y, -v.z) }

// ---- Mesh count: mirror Room.swift loadRoom traversal (no textures) ----
struct GLTF: Decodable {
    struct Scene: Decodable { let nodes: [Int]? }
    struct Node: Decodable { let children: [Int]?; let mesh: Int?; let matrix: [Float]?; let translation: [Float]?; let rotation: [Float]?; let scale: [Float]? }
    struct Mesh: Decodable { struct Primitive: Decodable { let attributes: [String: Int]; let indices: Int?; let material: Int? }; let primitives: [Primitive] }
    struct Material: Decodable { let name: String? }
    let scene: Int?; let scenes: [Scene]; let nodes: [Node]; let meshes: [Mesh]; let materials: [Material]?
}
func countMeshes(glbURL: URL, root: Mat4, visible: [Bool]) throws -> (total: Int, transparent: Int) {
    let data = try Data(contentsOf: glbURL)
    func u32(_ at: Int) -> Int { Int(data.withUnsafeBytes { $0.loadUnaligned(fromByteOffset: at, as: UInt32.self) }) }
    let jsonLength = u32(12)
    let json = data.subdata(in: 20 ..< 20 + jsonLength)
    let gltf = try JSONDecoder().decode(GLTF.self, from: json)
    var total = 0, transparent = 0
    func localMatrix(_ node: GLTF.Node) -> Mat4 {
        if let m = node.matrix { return Mat4(columnMajor: m) }
        let t = node.translation.map { SIMD3($0[0], $0[1], $0[2]) } ?? .zero
        let r = node.rotation.map { simd_quatf(ix: $0[0], iy: $0[1], iz: $0[2], r: $0[3]) } ?? simd_quatf(angle: 0, axis: SIMD3(0, 1, 0))
        let s = node.scale.map { SIMD3($0[0], $0[1], $0[2]) } ?? SIMD3(1, 1, 1)
        return .compose(t, r, s)
    }
    func visit(_ index: Int, parent: Mat4) {
        if index < visible.count, !visible[index] { return }
        let node = gltf.nodes[index]
        let world = parent * localMatrix(node)
        if let meshIndex = node.mesh {
            for primitive in gltf.meshes[meshIndex].primitives {
                guard primitive.attributes["POSITION"] != nil, primitive.attributes["TEXCOORD_0"] != nil else { continue }
                let material = primitive.material.flatMap { gltf.materials?[$0] }
                let isTransparent = material?.name?.hasSuffix("_transparent") ?? false
                total += 1
                if isTransparent { transparent += 1 }
            }
        }
        for child in node.children ?? [] { visit(child, parent: world) }
    }
    for index in gltf.scenes[gltf.scene ?? 0].nodes ?? [] { visit(index, parent: root) }
    return (total, transparent)
}

// ---- Main ----
let spotsDir = CommandLine.arguments.count > 1 ? CommandLine.arguments[1] : "Resources/web/spots"
let spotDir = URL(fileURLWithPath: spotsDir).appendingPathComponent("home_003_yumemita_01_vrfloor_03/30001")
let data = try JSONDecoder().decode(SpotData.self, from: Data(contentsOf: spotDir.appendingPathComponent("spot.json")))

let roomURL = URL(fileURLWithPath: spotsDir).appendingPathComponent("home_003_yumemita_01_vrfloor_03/room.glb")
let (total, transparent) = try countMeshes(glbURL: roomURL, root: roomMatrix(data), visible: data.roomNodes)

let w: Float = 1920, h: Float = 1080
let fov = fitFov(data.situation, width: w, height: h)
let base = defaultPose(data.situation, fov: fov)
let pose = shiftedPose(base, px: 0, py: 0, data.situation, aspect: w / h)
let eye = rightHanded(pose.position)
let dir = rightHanded(lookDirection(pose))
let view = lookAt(eye: eye, target: eye + dir)
let proj = perspective(fovY: fov, aspect: w / h, near: data.camera.near, far: data.camera.far)

func arr(_ f: [Float]) -> String { "[" + f.map { String(format: "%.7g", $0) }.joined(separator: ",") + "]" }
var out = "{"
out += "\"meshes\":\(total),\"transparentMeshes\":\(transparent),"
out += "\"residents\":\(data.characters.count),"
out += "\"fov\":\(String(format: "%.7g", fov)),"
out += "\"view\":\(arr(view.flat)),"
out += "\"projection\":\(arr(proj.flat))}"
print(out)
