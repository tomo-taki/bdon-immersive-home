import AppKit
import Combine

/// Run the shipped updater against a local signed feed in a dev app copy.
@MainActor
final class UpdateQA: NSObject, NSApplicationDelegate {
    private static let receiptKey = "BDONTestReceipt"
    private static let versionKey = "BDONTestVersion"
    private static let buildKey = "CFBundleVersion"
    private static let timeout: TimeInterval = 60
    private let output: URL
    private var subscription: AnyCancellable?

    init(output: URL) { self.output = output }

    static func writeReceipt() -> Bool {
        let bundle = Bundle.main
        guard AppIdentity.isDevBuild, let path = bundle.object(forInfoDictionaryKey: receiptKey) as? String,
              let expected = bundle.object(forInfoDictionaryKey: versionKey) as? String,
              bundle.object(forInfoDictionaryKey: buildKey) as? String == expected else { return false }
        let receipt = ["status": "installed", "version": expected]
        try? JSONEncoder().encode(receipt).write(to: URL(fileURLWithPath: path), options: .atomic)
        return true
    }

    func applicationDidFinishLaunching(_ notification: Notification) {
        subscription = Updater.shared.$state.receive(on: RunLoop.main).sink { [weak self] state in
            self?.receive(state)
        }
        Updater.shared.check()
        DispatchQueue.main.asyncAfter(deadline: .now() + Self.timeout) { [weak self] in self?.finish("timeout") }
    }

    private func receive(_ state: Updater.State) {
        switch state {
        case .available(let release):
            let record = ["title": release.title, "notes": release.notes]
            let offer = output.deletingPathExtension().appendingPathExtension("offer.json")
            try? JSONEncoder().encode(record).write(to: offer, options: .atomic)
            Updater.shared.install()
        case .failed(let message): finish(message)
        case .upToDate: finish("noUpdate")
        default: break
        }
    }

    private func finish(_ message: String) {
        try? JSONEncoder().encode(["status": "failed", "error": message]).write(to: output, options: .atomic)
        NSApp.terminate(nil)
    }
}
