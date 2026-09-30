package com.bdon.immersivehome;

/**
 * JNI surface to the native renderer (libbdon.so). One native engine per live
 * wallpaper Engine, addressed by an opaque handle. All methods are static; the
 * handle carries instance state on the native side.
 */
final class NativeWallpaper {
    static {
        System.loadLibrary("bdon");
    }

    private NativeWallpaper() {}

    /** Create + start a native engine reading spot data from spotsDir. Returns a handle. */
    static native long nativeCreate(String spotsDir);

    /** Stop + destroy the engine. */
    static native void nativeDestroy(long handle);

    /** Attach/detach the drawing Surface (null on surfaceDestroyed). */
    static native void nativeSetSurface(long handle, android.view.Surface surface);

    /** Engine visibility (pauses rendering when false). */
    static native void nativeSetVisible(long handle, boolean visible);

    /** Home-screen horizontal offset 0..1 from onOffsetsChanged (parallax target). */
    static native void nativeSetOffset(long handle, float xOffset);

    /** Push a settings snapshot (spot dir "<room>/<id>", toggles, hidden members). */
    static native void nativeSetSettings(long handle, String spotDir, boolean showCharacters,
                                         boolean parallax, String[] hiddenMembers);

    /** Name the next scene to pre-build while the current one is still shown
     *  (screen-on shuffle: eliminates the load hitch at the swap). */
    static native void nativeSetNextSpot(long handle, String spotDir);

    /** SCREEN_OFF: swap to the preloaded scene, reset to t=0, draw its first frame
     *  into the surface now, so screen-on shows the new scene from its first pixel. */
    static native void nativePrepareForScreenOff(long handle);

    /** QA-only: render one spot offscreen to a PNG. Returns true on success. */
    static native boolean nativeSnapshot(String spotsDir, String spotDir, int w, int h,
                                         boolean showCharacters, String outPath);
}
