package com.bdon.immersivehome;

import android.graphics.Color;
import android.graphics.Typeface;

/**
 * Java port of Theme.swift's palette and font feel: navy backdrop, indigo tab
 * slabs (teal when selected), lavender panels, translucent option pills, and a
 * rounded-bold typeface. Colours are the same 0-1 fractions scaled to 0-255.
 */
final class Theme {
    private Theme() {}

    static int rgb(double r, double g, double b) {
        return Color.rgb((int) Math.round(r * 255), (int) Math.round(g * 255), (int) Math.round(b * 255));
    }
    static int argb(double a, int c) {
        return Color.argb((int) Math.round(a * 255), Color.red(c), Color.green(c), Color.blue(c));
    }

    static final int NAVY_TOP    = rgb(0.11, 0.13, 0.33);
    static final int NAVY_BOTTOM = rgb(0.15, 0.18, 0.40);
    static final int PANEL       = rgb(0.09, 0.10, 0.25);
    static final int TAB_TOP     = rgb(0.36, 0.42, 0.85);
    static final int TAB_BOTTOM  = rgb(0.24, 0.29, 0.69);
    static final int TAB_EDGE    = rgb(0.62, 0.68, 0.97);
    static final int TEAL_TOP    = rgb(0.50, 0.87, 0.87);
    static final int TEAL_BOTTOM = rgb(0.24, 0.64, 0.72);
    static final int TEAL        = rgb(0.30, 0.72, 0.78);
    static final int PILL        = rgb(0.17, 0.20, 0.45);
    static final int PILL_EDGE   = rgb(0.47, 0.53, 0.84);
    static final int PILL_OPEN   = rgb(0.46, 0.50, 0.72);   // used at ~0.42 alpha
    static final int LAV_TOP     = rgb(0.94, 0.95, 0.99);
    static final int LAV_BOTTOM  = rgb(0.77, 0.79, 0.90);
    static final int INK         = rgb(0.17, 0.19, 0.38);
    static final int MAGENTA     = rgb(0.84, 0.36, 0.94);
    static final int WHITE       = Color.WHITE;

    // GameRadio ON discs (sampled in Theme.swift, 0-255).
    static final int ON_OUTLINE = Color.rgb(48, 72, 92);
    static final int ON_RIM_TOP = Color.rgb(200, 236, 248);
    static final int ON_RIM_BOT = Color.rgb(158, 190, 206);
    static final int ON_RING_A  = Color.rgb(86, 160, 184);
    static final int ON_RING_B  = Color.rgb(150, 216, 236);
    static final int ON_BAND_A  = Color.rgb(92, 150, 173);
    static final int ON_BAND_B  = Color.rgb(64, 110, 134);
    // GameRadio OFF discs.
    static final int OFF_OUTLINE = Color.rgb(50, 52, 95);
    static final int OFF_RIM_TOP = Color.rgb(160, 143, 201);
    static final int OFF_RIM_BOT = Color.rgb(100, 100, 166);
    static final int OFF_RING_TOP= Color.rgb(64, 74, 124);
    static final int OFF_RING_BOT= Color.rgb(78, 94, 164);
    static final int OFF_WELL    = Color.rgb(40, 41, 79);

    /** Rounded-bold face; falls back to the platform sans-serif rounded feel. */
    static Typeface font() {
        Typeface t = Typeface.create("sans-serif-medium", Typeface.BOLD);
        return t != null ? t : Typeface.DEFAULT_BOLD;
    }
}
