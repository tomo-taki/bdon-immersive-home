package com.bdon.immersivehome;

import android.content.Context;
import android.content.SharedPreferences;

/**
 * Persisted wallpaper settings, mirroring WallpaperSettings.swift keys/defaults:
 * spot dir ("<room>/<id>", default spot 30001), showCharacters, parallax,
 * shuffle + interval, shuffle pool. Stored in SharedPreferences and read by both
 * the service and the settings screen.
 */
final class Prefs {
    static final String DEFAULT_SPOT_DIR = "home_003_yumemita_01_vrfloor_03/30001";

    private static final String FILE = "bdon_wallpaper";
    private static final String K_SPOT_DIR = "spotDir";
    private static final String K_SHOW_CHARACTERS = "showCharacters";
    private static final String K_PARALLAX = "parallax";
    private static final String K_SHUFFLE = "shuffle";
    private static final String K_SHUFFLE_INTERVAL_MIN = "shuffleIntervalMinutes";
    private static final String K_SHUFFLE_MODE = "shuffleMode";

    /** Shuffle trigger: rotate on a timer. */
    static final int SHUFFLE_MODE_INTERVAL = 0;
    /** Shuffle trigger: rotate each time the screen turns on. */
    static final int SHUFFLE_MODE_SCREEN_ON = 1;

    private final SharedPreferences sp;

    Prefs(Context ctx) {
        sp = ctx.getSharedPreferences(FILE, Context.MODE_PRIVATE);
    }

    String spotDir() { return sp.getString(K_SPOT_DIR, DEFAULT_SPOT_DIR); }
    void setSpotDir(String v) { sp.edit().putString(K_SPOT_DIR, v).apply(); }
    /** Synchronous spot write: the value is on disk before this returns, so a
     *  settings-changed broadcast fired right after cannot let another process
     *  reopen Prefs and read the old scene. */
    void setSpotDirNow(String v) { sp.edit().putString(K_SPOT_DIR, v).commit(); }

    boolean showCharacters() { return sp.getBoolean(K_SHOW_CHARACTERS, true); }
    void setShowCharacters(boolean v) { sp.edit().putBoolean(K_SHOW_CHARACTERS, v).apply(); }

    boolean parallax() { return sp.getBoolean(K_PARALLAX, true); }
    void setParallax(boolean v) { sp.edit().putBoolean(K_PARALLAX, v).apply(); }

    boolean shuffle() { return sp.getBoolean(K_SHUFFLE, false); }
    void setShuffle(boolean v) { sp.edit().putBoolean(K_SHUFFLE, v).apply(); }

    /** Shuffle interval in minutes; default 10 (minutes10). */
    int shuffleIntervalMinutes() { return sp.getInt(K_SHUFFLE_INTERVAL_MIN, 10); }
    void setShuffleIntervalMinutes(int v) { sp.edit().putInt(K_SHUFFLE_INTERVAL_MIN, v).apply(); }

    /** Shuffle trigger mode: SHUFFLE_MODE_INTERVAL (default) or SHUFFLE_MODE_SCREEN_ON. */
    int shuffleMode() { return sp.getInt(K_SHUFFLE_MODE, SHUFFLE_MODE_INTERVAL); }
    void setShuffleMode(int v) { sp.edit().putInt(K_SHUFFLE_MODE, v).apply(); }

    void registerListener(SharedPreferences.OnSharedPreferenceChangeListener l) {
        sp.registerOnSharedPreferenceChangeListener(l);
    }
    void unregisterListener(SharedPreferences.OnSharedPreferenceChangeListener l) {
        sp.unregisterOnSharedPreferenceChangeListener(l);
    }
}
