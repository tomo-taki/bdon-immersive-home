package com.bdon.immersivehome;

import android.content.Context;
import android.content.res.AssetManager;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

/**
 * Extracts the bundled spot data (assets/spots/**) to internal storage on first
 * run. The native code (spine-c, the glTF/JSON loaders) reads real filesystem
 * paths via fopen, so the data must live on disk, not inside the APK. A version
 * marker skips re-extraction on later launches.
 */
final class Assets {
    private static final String SPOTS = "spots";
    private static final String MARKER = "extracted.v1";

    private Assets() {}

    /** Absolute path to the extracted spots root (…/files/spots). */
    static String spotsDir(Context ctx) {
        return new File(ctx.getFilesDir(), SPOTS).getAbsolutePath();
    }

    /** Copy assets/spots to internal storage if not already done. Returns the spots dir. */
    static String ensureExtracted(Context ctx) {
        File root = new File(ctx.getFilesDir(), SPOTS);
        File marker = new File(root, MARKER);
        if (marker.exists()) {
            return root.getAbsolutePath();
        }
        try {
            deleteRecursive(root);   // clean any partial prior extraction
            root.mkdirs();
            copyAssetDir(ctx.getAssets(), SPOTS, root);
            new FileOutputStream(marker).close();   // touch the marker
        } catch (IOException e) {
            throw new RuntimeException("asset extraction failed", e);
        }
        return root.getAbsolutePath();
    }

    private static void copyAssetDir(AssetManager am, String assetPath, File dst) throws IOException {
        String[] entries = am.list(assetPath);
        if (entries == null || entries.length == 0) {
            // Leaf: copy the file.
            copyAssetFile(am, assetPath, dst);
            return;
        }
        dst.mkdirs();
        for (String entry : entries) {
            String childAsset = assetPath + "/" + entry;
            File childDst = new File(dst, entry);
            String[] sub = am.list(childAsset);
            if (sub != null && sub.length > 0) {
                copyAssetDir(am, childAsset, childDst);
            } else {
                copyAssetFile(am, childAsset, childDst);
            }
        }
    }

    private static void copyAssetFile(AssetManager am, String assetPath, File dst) throws IOException {
        dst.getParentFile().mkdirs();
        try (InputStream in = am.open(assetPath);
             OutputStream out = new FileOutputStream(dst)) {
            byte[] buf = new byte[65536];
            int n;
            while ((n = in.read(buf)) > 0) {
                out.write(buf, 0, n);
            }
        }
    }

    private static void deleteRecursive(File f) {
        if (f == null || !f.exists()) return;
        File[] kids = f.listFiles();
        if (kids != null) {
            for (File k : kids) deleteRecursive(k);
        }
        f.delete();
    }
}
