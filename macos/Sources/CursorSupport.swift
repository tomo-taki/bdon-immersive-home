import Foundation

enum CursorSupport: Equatable {
    case available, fixed, unknown

    static func decode(_ data: Data) -> CursorSupport {
        guard let camera = try? JSONDecoder().decode(Camera.self, from: data) else { return .unknown }
        let limits = camera.situation
        let shifts = [limits.maxLeftShift, limits.maxRightShift, limits.maxUpShift, limits.maxDownShift]
        return shifts.contains(where: { $0 > 0 }) ? .available : .fixed
    }

    var explanation: String? {
        switch self {
        case .available: return nil
        case .fixed: return "이 장면은 게임 원본의 시점 이동 범위가 없어 고정 시점을 사용합니다."
        case .unknown: return "장면의 시점 이동 정보를 확인할 수 없습니다."
        }
    }

    private struct Camera: Decodable { let situation: Limits }
    private struct Limits: Decodable {
        let maxLeftShift, maxRightShift, maxUpShift, maxDownShift: Float
    }
}
