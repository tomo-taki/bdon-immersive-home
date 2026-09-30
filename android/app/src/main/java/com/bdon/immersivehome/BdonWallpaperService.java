package com.bdon.immersivehome;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.SharedPreferences;
import android.os.Handler;
import android.os.Looper;
import android.service.wallpaper.WallpaperService;
import android.view.SurfaceHolder;

/**
 * Live wallpaper service. Each Engine owns one native onp::Engine (EGL + GLES3
 * renderer on its own thread). Android lifecycle callbacks are forwarded to the
 * native side; parallax comes from onOffsetsChanged (home-screen swipe). The
 * shuffle timer lives here in Java and rotates the spot from the extracted index.
 */
public final class BdonWallpaperService extends WallpaperService {

    /**
     * Explicit in-app broadcast SettingsActivity sends after writing any pref, so
     * the running wallpaper engines apply the change LIVE without the wallpaper
     * being re-selected. Sent with setPackage(getPackageName()) and received via a
     * runtime-registered, non-exported receiver, so it never leaves the app.
     */
    static final String ACTION_SETTINGS_CHANGED = "com.bdon.immersivehome.SETTINGS_CHANGED";

    /**
     * Optional extra on ACTION_SETTINGS_CHANGED carrying the exact spot dir the
     * sender just selected. When present, every receiving engine applies THIS
     * value directly instead of reopening Prefs from disk -- which removes the
     * apply()/reopen race that let one engine (home) update while another (lock)
     * kept the old scene. It also guarantees home and lock apply the identical
     * scene from a single source, even for a shuffle pick.
     */
    static final String EXTRA_SPOT_DIR = "spotDir";

    @Override
    public Engine onCreateEngine() {
        return new BdonEngine();
    }

    // Screen-off shuffle de-dup: SCREEN_OFF reaches every engine (home + lock) in
    // this one process. The first to arrive within a short window claims the pick;
    // the rest defer to the broadcast the winner sends, so all engines converge on
    // ONE scene instead of each rolling its own random one.
    private static final Object SHUFFLE_LOCK = new Object();
    private static long lastShufflePickAt = 0L;
    private static boolean claimShufflePick() {
        synchronized (SHUFFLE_LOCK) {
            long now = android.os.SystemClock.elapsedRealtime();
            if (now - lastShufflePickAt < 1500L) return false;   // another engine already picked
            lastShufflePickAt = now;
            return true;
        }
    }

    // The next scene, pre-picked once (shared by home + lock) while the screen is
    // ON so both engines preload and later swap to the SAME scene. Null = not armed.
    private static volatile String sPendingNext = null;
    private static String pendingNext() { return sPendingNext; }
    private static void setPendingNext(String v) { sPendingNext = v; }

    final class BdonEngine extends Engine
            implements SharedPreferences.OnSharedPreferenceChangeListener {

        private long handle;
        private Prefs prefs;
        private SpotIndex index;
        private final Handler handler = new Handler(Looper.getMainLooper());
        private Runnable shuffleTick;
        private BroadcastReceiver screenReceiver;
        private BroadcastReceiver settingsReceiver;

        @Override
        public void onCreate(SurfaceHolder holder) {
            super.onCreate(holder);
            // Home + lock screen both show this wallpaper (system decides per screen).
            setOffsetNotificationsEnabled(true);

            String spotsDir = Assets.ensureExtracted(BdonWallpaperService.this);
            index = SpotIndex.load(spotsDir);
            prefs = new Prefs(BdonWallpaperService.this);
            prefs.registerListener(this);

            handle = NativeWallpaper.nativeCreate(spotsDir);
            pushSettings();
            scheduleShuffle();
            registerScreenReceiver();
            registerSettingsReceiver();
        }

        // Live-apply receiver: SettingsActivity broadcasts ACTION_SETTINGS_CHANGED
        // after each pref write. The wallpaper engine may run in a different process
        // instance than the settings screen, so its SharedPreferences in-memory cache
        // does not see the write; we reopen Prefs (which re-reads the backing file the
        // other process just committed) and re-push to the native engine + reschedule
        // shuffle. Registered non-exported with an explicit package filter, so only
        // this app's own broadcast is ever received.
        private void registerSettingsReceiver() {
            if (settingsReceiver != null) return;
            settingsReceiver = new BroadcastReceiver() {
                @Override public void onReceive(Context ctx, Intent intent) {
                    if (!ACTION_SETTINGS_CHANGED.equals(intent.getAction())) return;
                    // Reopen from disk: a fresh SharedPreferences load reflects the
                    // commit made by the settings process.
                    prefs.unregisterListener(BdonEngine.this);
                    prefs = new Prefs(BdonWallpaperService.this);
                    prefs.registerListener(BdonEngine.this);
                    // If the sender named the exact new scene, apply THAT (single
                    // source of truth for every engine, no disk-read race); persist
                    // it locally too so a later reopen/visibility-true agrees.
                    String spot = intent.getStringExtra(EXTRA_SPOT_DIR);
                    if (spot != null && !spot.isEmpty() && !spot.equals(prefs.spotDir())) {
                        prefs.setSpotDirNow(spot);
                    }
                    pushSettings();
                    scheduleShuffle();
                }
            };
            IntentFilter f = new IntentFilter(ACTION_SETTINGS_CHANGED);
            // API 33+ requires an export flag on runtime receivers; NOT_EXPORTED keeps
            // it app-internal. Guard for older platforms with the 2-arg overload.
            if (android.os.Build.VERSION.SDK_INT >= 33) {
                BdonWallpaperService.this.registerReceiver(settingsReceiver, f, Context.RECEIVER_NOT_EXPORTED);
            } else {
                BdonWallpaperService.this.registerReceiver(settingsReceiver, f);
            }
        }

        // Dynamically-registered screen on/off receiver. With screen-on shuffle the
        // NEXT scene is chosen once (shared) while the screen is still ON and each
        // engine PRE-BUILDS it in the background (nativeSetNextSpot -> render thread
        // builds the Stage during idle time). On SCREEN_OFF every engine swaps to
        // that preloaded Stage and draws its first frame into the (still-invisible)
        // surface, so screen-on shows the new scene from its very first pixel with
        // no load hitch and no visible switch. The winning engine also persists the
        // new scene + broadcasts it so all engines' Prefs agree (single source).
        private void registerScreenReceiver() {
            if (screenReceiver != null) return;
            screenReceiver = new BroadcastReceiver() {
                @Override public void onReceive(Context ctx, Intent intent) {
                    if (!Intent.ACTION_SCREEN_OFF.equals(intent.getAction())) return;
                    if (!prefs.shuffle()) return;
                    if (prefs.shuffleMode() != Prefs.SHUFFLE_MODE_SCREEN_ON) return;
                    if (index == null || index.size() < 2) return;
                    // The single pre-picked next scene (armed while ON). Fall back to
                    // an immediate pick if arming has not run yet.
                    String next = pendingNext();
                    if (next == null || next.equals(prefs.spotDir())) {
                        next = index.randomDirExcept(prefs.spotDir());
                    }
                    if (next == null) return;
                    // Swap THIS engine's surface to the preloaded scene NOW (before the
                    // panel goes dark). If its preload matched `next` the swap is a
                    // pointer flip; otherwise the native side loads it here off-screen.
                    NativeWallpaper.nativeSetNextSpot(handle, next);   // ensure target is named
                    NativeWallpaper.nativePrepareForScreenOff(handle); // swap + draw t=0 frame
                    // One engine persists + broadcasts so every engine's Prefs converge
                    // on the same scene, and arms the FOLLOWING scene's preload.
                    if (claimShufflePick()) {
                        prefs.setSpotDirNow(next);
                        Intent b = new Intent(ACTION_SETTINGS_CHANGED);
                        b.setPackage(getPackageName());
                        b.putExtra(EXTRA_SPOT_DIR, next);
                        sendBroadcast(b);
                        setPendingNext(null);   // consumed; re-armed after the new scene applies
                    }
                }
            };
            IntentFilter f = new IntentFilter();
            f.addAction(Intent.ACTION_SCREEN_OFF);
            // Registered on the service Context so it lives for the engine's lifetime.
            BdonWallpaperService.this.registerReceiver(screenReceiver, f);
        }

        /** Arm the next-scene preload: pick once (shared), push to native so the
         *  render thread builds it while the current scene is still visible. Called
         *  after a scene is applied, only in screen-on shuffle mode. */
        private void armPreload() {
            if (!prefs.shuffle() || prefs.shuffleMode() != Prefs.SHUFFLE_MODE_SCREEN_ON) return;
            if (index == null || index.size() < 2) return;
            String next = pendingNext();
            if (next == null || next.equals(prefs.spotDir())) {
                next = index.randomDirExcept(prefs.spotDir());
                setPendingNext(next);
            }
            if (next != null) NativeWallpaper.nativeSetNextSpot(handle, next);
        }

        @Override
        public void onSurfaceCreated(SurfaceHolder holder) {
            super.onSurfaceCreated(holder);
            NativeWallpaper.nativeSetSurface(handle, holder.getSurface());
        }

        @Override
        public void onSurfaceChanged(SurfaceHolder holder, int format, int width, int height) {
            super.onSurfaceChanged(holder, format, width, height);
            // Re-attach so the native side rebuilds its target at the new size.
            NativeWallpaper.nativeSetSurface(handle, holder.getSurface());
        }

        @Override
        public void onSurfaceDestroyed(SurfaceHolder holder) {
            NativeWallpaper.nativeSetSurface(handle, null);
            super.onSurfaceDestroyed(holder);
        }

        @Override
        public void onVisibilityChanged(boolean visible) {
            super.onVisibilityChanged(visible);
            NativeWallpaper.nativeSetVisible(handle, visible);
            if (visible) {
                // Reconcile from the single source: re-read prefs (a broadcast may
                // have arrived while this engine was paused) and re-push, so home and
                // lock always show the same, current scene when shown.
                prefs.unregisterListener(this);
                prefs = new Prefs(BdonWallpaperService.this);
                prefs.registerListener(this);
                pushSettings();
                scheduleShuffle();
            } else {
                handler.removeCallbacks(shuffleTick);
            }
        }

        @Override
        public void onOffsetsChanged(float xOffset, float yOffset, float xStep, float yStep,
                                     int xPixels, int yPixels) {
            NativeWallpaper.nativeSetOffset(handle, xOffset);
        }

        @Override
        public void onDestroy() {
            handler.removeCallbacks(shuffleTick);
            if (screenReceiver != null) {
                try { BdonWallpaperService.this.unregisterReceiver(screenReceiver); }
                catch (IllegalArgumentException ignored) { /* already unregistered */ }
                screenReceiver = null;
            }
            if (settingsReceiver != null) {
                try { BdonWallpaperService.this.unregisterReceiver(settingsReceiver); }
                catch (IllegalArgumentException ignored) { /* already unregistered */ }
                settingsReceiver = null;
            }
            if (prefs != null) prefs.unregisterListener(this);
            if (handle != 0) { NativeWallpaper.nativeDestroy(handle); handle = 0; }
            super.onDestroy();
        }

        @Override
        public void onSharedPreferenceChanged(SharedPreferences sp, String key) {
            pushSettings();
            scheduleShuffle();
        }

        private void pushSettings() {
            NativeWallpaper.nativeSetSettings(handle, prefs.spotDir(), prefs.showCharacters(),
                    prefs.parallax(), new String[0]);
            // With screen-on shuffle, immediately begin pre-loading the next scene so
            // it is ready (built off the hot path) before the next SCREEN_OFF.
            armPreload();
        }

        private void scheduleShuffle() {
            handler.removeCallbacks(shuffleTick);
            if (!prefs.shuffle() || index == null || index.size() < 2) return;
            // Only the interval mode uses the timer; screen-on mode rotates from the
            // SCREEN_OFF receiver instead, so no periodic tick is scheduled for it.
            if (prefs.shuffleMode() != Prefs.SHUFFLE_MODE_INTERVAL) return;
            final long periodMs = (long) prefs.shuffleIntervalMinutes() * 60_000L;
            shuffleTick = new Runnable() {
                @Override public void run() {
                    // One timer fires per engine; de-dup so home and lock rotate to the
                    // SAME scene (like the screen-off path) instead of each picking its own.
                    if (claimShufflePick()) {
                        String next = index.randomDirExcept(prefs.spotDir());
                        if (next != null) {
                            prefs.setSpotDirNow(next);
                            Intent b = new Intent(ACTION_SETTINGS_CHANGED);
                            b.setPackage(getPackageName());
                            b.putExtra(EXTRA_SPOT_DIR, next);
                            sendBroadcast(b);
                        }
                    }
                    handler.postDelayed(this, periodMs);
                }
            };
            handler.postDelayed(shuffleTick, periodMs);
        }
    }
}
