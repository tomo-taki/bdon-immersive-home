import Foundation

enum TrialBundle {
    private static let marker = "BDONIntegrationProbe"
    private static let receiptKey = "BDONReceiptPath"
    private static let expectedKey = "BDONReceiptVersion"
    private static let versionKey = "CFBundleVersion"

    static var isTrial: Bool {
        Bundle.main.bundleIdentifier?.hasSuffix(".integration") == true
            && Bundle.main.object(forInfoDictionaryKey: marker) as? Bool == true
    }

    /// The relaunched update leaves evidence outside the bundle being replaced.
    static func writeReceipt() throws -> Bool {
        let bundle = Bundle.main
        guard isTrial, let path = bundle.object(forInfoDictionaryKey: receiptKey) as? String,
              let expected = bundle.object(forInfoDictionaryKey: expectedKey) as? String,
              bundle.object(forInfoDictionaryKey: versionKey) as? String == expected else { return false }

        let receipt = ["status": "installed", "version": expected]
        let data = try JSONEncoder().encode(receipt)
        try data.write(to: URL(fileURLWithPath: path), options: .atomic)
        return true
    }
}
