import Foundation
import simd

// spot.json (tools/spots/build_spot.py) and the Spot camera, ported from
// web/src/spot-camera.ts.

struct SpotSituation: Decodable {
    let originalOffset: Vec3
    let defaultPositionOffset: Vec3
    let orbitRatio: Float
    let fieldOfView: Float
    let maxLeftShift: Float
    let maxRightShift: Float
    let maxUpShift: Float
    let maxDownShift: Float
    let backgroundPosition: Vec3
    let backgroundRotation: Vec3
    let backgroundScale: Vec3
}

struct UnityTransform: Decodable {
    struct Quat: Decodable { let x, y, z, w: Float }
    let localPosition: Vec3
    let localRotation: Quat
    let localScale: Vec3
}

struct SpotCharacter: Decodable {
    let name: String
    let skeleton: String
    let atlas: String
    let scale: Float
    let world: [Float]
    let animation: String?
    let loop: Bool
    let order: Int
}

struct SpotData: Decodable {
    struct Camera: Decodable { let near, far, fieldOfView: Float }
    let name: String
    let situation: SpotSituation
    let camera: Camera
    let roomRoot: UnityTransform
    let roomNodes: [Bool]
    let characters: [SpotCharacter]
}

struct SpotIndexEntry: Decodable {
    let id: String
    let name: String
    let band: String
    let dir: String
}

/// SpotSceneRoot.SetObject: background matrix with the room file's baked root taken out.
func roomMatrix(_ data: SpotData) -> Mat4 {
    let s = data.situation
    let background = Mat4.compose(s.backgroundPosition.simd, eulerYXZ(s.backgroundRotation), s.backgroundScale.simd)
    let root = data.roomRoot
    let rq = simd_quatf(ix: root.localRotation.x, iy: root.localRotation.y, iz: root.localRotation.z, r: root.localRotation.w)
    let baked = Mat4.compose(root.localPosition.simd, rq, root.localScale.simd)
    return mirrorZ * (background * baked.inverse) * mirrorZ
}

// MARK: - Camera (web/src/spot-camera.ts)

struct SpotPose {
    var position: SIMD3<Float>   // Unity space
    var forward: SIMD3<Float>
    var yaw: Float = 0
    var pitch: Float = 0
    var fov: Float
}

private let wideAspect: Float = 19.5 / 9
private let maxFitFov: Float = 32

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
