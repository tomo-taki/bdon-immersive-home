import PaperSaverKit

/// Restore only our slots; preserve choices made later in System Settings.
enum NativeRestore {
    static func merge(_ current: WallpaperStore, original: WallpaperStore,
                      provider: String) -> WallpaperStore {
        var result = current
        result.allSpacesAndDisplays = section(current.allSpacesAndDisplays, original.allSpacesAndDisplays, provider)
        result.systemDefault = section(current.systemDefault, original.systemDefault, provider)
        for (id, entry) in current.spaces {
            var restored = entry
            restored.default = section(entry.default, original.spaces[id]?.default, provider)
            for (display, value) in entry.displays {
                restored.displays[display] = section(value, original.spaces[id]?.displays[display], provider)
            }
            result.spaces[id] = restored
        }
        for (id, value) in current.displays {
            result.displays[id] = section(value, original.displays[id], provider)
        }
        return result
    }

    private static func section(_ current: StoreSection?, _ original: StoreSection?,
                                _ provider: String) -> StoreSection? {
        guard var current else { return nil }
        let desktop = current.desktop?.provider?.rawValue == provider
        let idle = current.idle?.provider?.rawValue == provider
        let linked = current.linked?.provider?.rawValue == provider
        if linked || desktop && idle { return original }
        guard desktop || idle else { return current }
        if desktop { current.desktop = original?.desktop ?? original?.linked ?? SystemDefaults.slot(.desktop) }
        if idle { current.idle = original?.idle ?? original?.linked ?? SystemDefaults.slot(.screensaver) }
        current.type = .individual
        return current
    }
}
