package com.bdon.immersivehome;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Handler;
import android.os.Looper;
import android.util.LruCache;
import android.widget.ImageView;

import java.io.InputStream;
import java.lang.ref.WeakReference;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * Loads the scene thumbnails (assets/thumbs/&lt;id&gt;.jpg) and band logos
 * (assets/bands/&lt;name&gt;.png) for the settings scene grid. Decodes on a
 * background thread, downsampled to the requested display size, and caches the
 * decoded bitmaps in memory so scrolling the 39-scene grid does not re-decode.
 *
 * Read straight from the APK's AssetManager -- these are UI-only images, so
 * (unlike the spot data the native loaders fopen) they never need to live on
 * disk.
 */
final class Thumbs {
    private Thumbs() {}

    private static final ExecutorService IO = Executors.newFixedThreadPool(2);
    private static final Handler MAIN = new Handler(Looper.getMainLooper());
    // ~8 MB of decoded thumbnails is plenty for 39 small cards.
    private static final LruCache<String, Bitmap> CACHE = new LruCache<String, Bitmap>(8 * 1024 * 1024) {
        @Override protected int sizeOf(String key, Bitmap b) { return b.getByteCount(); }
    };

    /** Band -> logo asset base name (mirrors SpotCatalog.bandIcons on macOS). */
    static String bandAsset(String band) {
        switch (band) {
            case "MyGO!!!!!":            return "mygo";
            case "Ave Mujica":           return "avemujica";
            case "\u5922\u9650\u5927\u307f\u3085\u30fc\u305f\u3044\u3077": return "yumemita"; // 夢限大みゅーたいぷ
            case "millsage":             return "millsage";
            case "\u4e00\u5bb6Dumb Rock!": return "ikka"; // 一家Dumb Rock!
            default:                     return null;
        }
    }

    /**
     * Load assets/thumbs/&lt;id&gt;.jpg into `iv`, downsampled to about
     * reqW x reqH, off the UI thread. The ImageView is tagged so a recycled
     * card that has scrolled to a different scene does not get a stale bitmap.
     */
    static void loadScene(Context ctx, String id, ImageView iv, int reqW, int reqH) {
        loadAsset(ctx, "thumbs/" + id + ".jpg", iv, reqW, reqH);
    }

    /** Load assets/bands/&lt;name&gt;.png into `iv`, downsampled to reqW x reqH. */
    static void loadBand(Context ctx, String bandAsset, ImageView iv, int reqW, int reqH) {
        if (bandAsset == null) { iv.setImageBitmap(null); return; }
        loadAsset(ctx, "bands/" + bandAsset + ".png", iv, reqW, reqH);
    }

    private static void loadAsset(Context ctx, String path, ImageView iv, int reqW, int reqH) {
        final String key = path + "@" + reqW + "x" + reqH;
        iv.setTag(key);
        Bitmap cached = CACHE.get(key);
        if (cached != null) { iv.setImageBitmap(cached); return; }
        iv.setImageBitmap(null);
        final Context app = ctx.getApplicationContext();
        final WeakReference<ImageView> ref = new WeakReference<>(iv);
        IO.execute(() -> {
            Bitmap bmp = decodeDownsampled(app, path, reqW, reqH);
            if (bmp == null) return;
            CACHE.put(key, bmp);
            MAIN.post(() -> {
                ImageView target = ref.get();
                if (target != null && key.equals(target.getTag())) {
                    target.setImageBitmap(bmp);
                }
            });
        });
    }

    private static Bitmap decodeDownsampled(Context ctx, String path, int reqW, int reqH) {
        try {
            // Pass 1: bounds only.
            BitmapFactory.Options o = new BitmapFactory.Options();
            o.inJustDecodeBounds = true;
            try (InputStream in = ctx.getAssets().open(path)) {
                BitmapFactory.decodeStream(in, null, o);
            }
            o.inSampleSize = sampleSize(o.outWidth, o.outHeight, reqW, reqH);
            o.inJustDecodeBounds = false;
            // Pass 2: real decode at the reduced size.
            try (InputStream in = ctx.getAssets().open(path)) {
                return BitmapFactory.decodeStream(in, null, o);
            }
        } catch (Exception e) {
            return null;
        }
    }

    private static int sampleSize(int w, int h, int reqW, int reqH) {
        int s = 1;
        while (w / (s * 2) >= reqW && h / (s * 2) >= reqH) s *= 2;
        return s;
    }
}
