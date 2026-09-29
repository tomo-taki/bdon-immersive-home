import Foundation
import simd

// Unity (left-handed, y up) -> glTF / right-handed: negate z. Matrices go
// through S·M·S with S = diag(1, 1, -1), exactly as web/src/spot-stage.ts.

typealias Mat4 = simd_float4x4

let mirrorZ = Mat4(diagonal: SIMD4<Float>(1, 1, -1, 1))
let degrees: Float = .pi / 180

struct Vec3: Decodable {
    var x: Float
    var y: Float
    var z: Float

    var simd: SIMD3<Float> { SIMD3(x, y, z) }
}

extension Mat4 {
    /// three.js Matrix4.fromArray: column-major.
    init(columnMajor v: [Float]) {
        self.init(columns: (
            SIMD4(v[0], v[1], v[2], v[3]),
            SIMD4(v[4], v[5], v[6], v[7]),
            SIMD4(v[8], v[9], v[10], v[11]),
            SIMD4(v[12], v[13], v[14], v[15])
        ))
    }

    static func compose(_ t: SIMD3<Float>, _ q: simd_quatf, _ s: SIMD3<Float>) -> Mat4 {
        var m = Mat4(q)
        m.columns.0 *= s.x
        m.columns.1 *= s.y
        m.columns.2 *= s.z
        m.columns.3 = SIMD4(t, 1)
        return m
    }

    var translation: SIMD3<Float> { SIMD3(columns.3.x, columns.3.y, columns.3.z) }
}

/// Unity matrix (spot.json `world`) in right-handed space.
func unityMatrix(_ values: [Float]) -> Mat4 {
    mirrorZ * Mat4(columnMajor: values) * mirrorZ
}

/// three.js Euler order "YXZ" (Unity Quaternion.Euler: z, then x, then y).
func eulerYXZ(_ e: Vec3) -> simd_quatf {
    let qy = simd_quatf(angle: e.y * degrees, axis: SIMD3(0, 1, 0))
    let qx = simd_quatf(angle: e.x * degrees, axis: SIMD3(1, 0, 0))
    let qz = simd_quatf(angle: e.z * degrees, axis: SIMD3(0, 0, 1))
    return qy * qx * qz
}

/// Right-handed view matrix looking from `eye` at `target`.
func lookAt(eye: SIMD3<Float>, target: SIMD3<Float>, up: SIMD3<Float> = SIMD3(0, 1, 0)) -> Mat4 {
    let z = simd_normalize(eye - target)
    let x = simd_normalize(simd_cross(up, z))
    let y = simd_cross(z, x)
    return Mat4(columns: (
        SIMD4(x.x, y.x, z.x, 0),
        SIMD4(x.y, y.y, z.y, 0),
        SIMD4(x.z, y.z, z.z, 0),
        SIMD4(-simd_dot(x, eye), -simd_dot(y, eye), -simd_dot(z, eye), 1)
    ))
}

/// Right-handed perspective with Metal's [0, 1] depth range.
func perspective(fovY: Float, aspect: Float, near: Float, far: Float) -> Mat4 {
    let f = 1 / tan(fovY * degrees / 2)
    let range = far / (near - far)
    return Mat4(columns: (
        SIMD4(f / aspect, 0, 0, 0),
        SIMD4(0, f, 0, 0),
        SIMD4(0, 0, range, -1),
        SIMD4(0, 0, range * near, 0)
    ))
}
