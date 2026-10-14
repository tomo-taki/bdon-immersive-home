import Foundation
import simd

// Exercise the shipping Swift camera, then export poses for C++ parity.
@main
private enum CameraTest {
    private enum Verdict { case pass, fail }
    private static let tolerance: Float = 0.00002
    private static let nearClip: Float = 0.3
    private static let farClip: Float = 1000
    private static let viewHeight: Float = 1080
    private static let pointers: [SIMD2<Float>] = [
        .zero, SIMD2(-1, 0), SIMD2(1, 0), SIMD2(0, -1), SIMD2(0, 1),
        SIMD2(-1, -1), SIMD2(1, 1), SIMD2(0.4, -0.6),
    ]
    private static var failures = 0

    private static func check(_ result: Verdict, _ label: String) {
        if result == .pass {
            return
        }

        failures += 1
        FileHandle.standardError.write(Data("FAIL: \(label)\n".utf8))
    }

    private static func projected(_ point: SIMD3<Float>, _ pose: SpotPose) -> SIMD2<Float> {
        let eye = rightHanded(pose.position)
        let view = lookAt(eye: eye, target: eye + rightHanded(lookDirection(pose)))
        let projection = perspective(fovY: pose.fov, aspect: 1, near: nearClip, far: farClip)
        let clip = projection * view * SIMD4(rightHanded(point), 1)
        return SIMD2(clip.x, clip.y) / clip.w
    }

    private static func checkDepth() {
        // Collinear objects move together under rotation alone; orbit separates them.
        let s = SpotSituation(originalOffset: Vec3(x: 0, y: 0, z: 5),
                              defaultPositionOffset: Vec3(x: 0, y: 0, z: 0),
                              orbitRatio: 1, fieldOfView: 19,
                              maxLeftShift: 5, maxRightShift: 5, maxUpShift: 5, maxDownShift: 5,
                              backgroundPosition: Vec3(x: 0, y: 0, z: 0),
                              backgroundRotation: Vec3(x: 0, y: 0, z: 0),
                              backgroundScale: Vec3(x: 1, y: 1, z: 1))
        let base = defaultPose(s, fov: s.fieldOfView)
        for pointer in [SIMD2<Float>(1, 0), SIMD2<Float>(0, 1)] {
            let pose = shiftedPose(base, px: pointer.x, py: pointer.y, s, aspect: 1)
            let near = projected(SIMD3(0, 0, 1), pose)
            let far = projected(SIMD3(0, 0, 8), pose)
            check(simd_length(near - far) > 0.01 ? .pass : .fail, "depth separation \(pointer)")
        }
    }

    static func main() throws {
        checkDepth()

        let root = URL(fileURLWithPath: CommandLine.arguments[1])
        let index = try JSONDecoder().decode([SpotIndexEntry].self,
                                             from: Data(contentsOf: root.appendingPathComponent("index.json")))
        var rows: [[String: Any]] = []
        for entry in index {
            let url = root.appendingPathComponent(entry.dir).appendingPathComponent("spot.json")
            let data = try JSONDecoder().decode(SpotData.self, from: Data(contentsOf: url))
            let s = data.situation
            for aspect: Float in [0.5625, 1, 16 / 9, 19.5 / 9, 32 / 9] {
                let base = defaultPose(s, fov: fitFov(s, width: aspect * viewHeight, height: viewHeight))
                for pointer in pointers {
                    let pose = shiftedPose(base, px: pointer.x, py: pointer.y, s, aspect: aspect)
                    let direction = lookDirection(pose)
                    let pivot = pose.position + direction * s.orbitRatio
                    check(simd_length(pivot - s.defaultPositionOffset.simd) < tolerance ? .pass : .fail,
                          "\(entry.id) orbit \(aspect) \(pointer)")
                    if pointer == .zero {
                        check(simd_length(pose.position - base.position) < tolerance ? .pass : .fail,
                              "center \(entry.id)")
                    }

                    rows.append(["dir": entry.dir, "aspect": aspect, "px": pointer.x, "py": pointer.y,
                                 "position": [pose.position.x, pose.position.y, pose.position.z],
                                 "forward": [direction.x, direction.y, direction.z],
                                 "yaw": pose.yaw, "pitch": pose.pitch, "fov": pose.fov])
                }
            }
        }

        try JSONSerialization.data(withJSONObject: rows).write(to: URL(fileURLWithPath: CommandLine.arguments[2]))
        print("Swift camera: \(rows.count) poses, \(failures) failures")
        if failures > 0 {
            exit(1)
        }
    }
}
