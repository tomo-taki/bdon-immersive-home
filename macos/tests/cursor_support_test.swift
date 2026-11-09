import Foundation

@main
private enum CursorTest {
    static func main() {
        let fixed = Data(#"{"situation":{"maxLeftShift":0,"maxRightShift":0,"maxUpShift":0,"maxDownShift":0}}"#.utf8)
        let moving = Data(#"{"situation":{"maxLeftShift":0,"maxRightShift":4,"maxUpShift":0,"maxDownShift":0}}"#.utf8)
        guard CursorSupport.decode(fixed) == .fixed else {
            FileHandle.standardError.write(Data("FAIL: a fixed camera must not offer cursor movement\n".utf8))
            exit(EXIT_FAILURE)
        }
        precondition(CursorSupport.decode(moving) == .available)
        precondition(CursorSupport.decode(Data()) == .unknown)
        print("PASS: fixed, movable and missing camera data produce distinct cursor capabilities")
    }
}
