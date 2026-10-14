import Foundation

/// Keep installation failures actionable in the settings window.
enum UpdateFailure: Error {
    private static let diskTool = "hdiutil"
    case missingChecksum
    case checksumMismatch
    case missingApp
    case identityMismatch
    case toolFailed(String)

    static func message(_ error: Error) -> String {
        switch error {
        case UpdateFailure.missingChecksum: return "업데이트 검증 정보를 읽지 못했습니다"
        case UpdateFailure.checksumMismatch: return "업데이트 파일 검증에 실패했습니다. 다시 시도해주세요"
        case UpdateFailure.missingApp: return "업데이트 파일에서 앱을 찾지 못했습니다"
        case UpdateFailure.identityMismatch: return "이 설치본은 설치 파일로 직접 업데이트해야 합니다"
        case UpdateFailure.toolFailed(let tool):
            return tool == diskTool ? "업데이트 설치 파일을 열지 못했습니다" : "업데이트 앱을 복사하지 못했습니다"
        case is URLError: return "업데이트 파일을 내려받지 못했습니다. 연결을 확인해주세요"
        default: return "업데이트를 적용하지 못했습니다: \(error.localizedDescription)"
        }
    }
}
