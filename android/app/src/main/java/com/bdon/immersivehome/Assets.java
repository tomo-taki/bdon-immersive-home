package com.bdon.immersivehome;

import android.content.Context;
import android.content.pm.PackageManager;
import android.content.res.AssetManager;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.RandomAccessFile;
import java.nio.channels.FileLock;
import java.nio.charset.StandardCharsets;

/**
 * Extracts the bundled spot data (assets/spots/**) to internal storage. The
 * native code (spine-c, the glTF/JSON loaders) reads real filesystem paths via
 * fopen, so the data must live on disk, not inside the APK. The marker holds
 * the APK's install time: an update (which may bring new or changed Spots)
 * extracts again, later launches of the same APK skip it.
 */
final class Assets {
    private static final String SPOTS = "spots";
    private static final String MARKER = "installed.stamp";
    private static final String LOCK = "spots.lock";

    private Assets() {}

    /** Absolute path to the extracted spots root (…/files/spots). */
    static String spotsDir(Context ctx) {
        return new File(ctx.getFilesDir(), SPOTS).getAbsolutePath();
    }

    /**
     * Copy assets/spots to internal storage unless this APK's copy is there.
     * Returns the spots dir. The wallpaper engines and the settings screen all
     * call it: one at a time, in this process (synchronized) and across
     * processes (the file lock).
     */
    static synchronized String ensureExtracted(Context ctx) {
        File root = new File(ctx.getFilesDir(), SPOTS);
        File marker = new File(root, MARKER);
        String stamp = installStamp(ctx);
        try (RandomAccessFile lockFile = new RandomAccessFile(new File(ctx.getFilesDir(), LOCK), "rw");
             FileLock lock = lockFile.getChannel().lock()) {
            if (stamp.equals(readText(marker))) {
                return root.getAbsolutePath();
            }
            deleteRecursive(root);   // the previous APK's copy, or a partial one
            root.mkdirs();
            copyAssetDir(ctx.getAssets(), SPOTS, root);
            writeText(marker, stamp);
        } catch (IOException e) {
            throw new RuntimeException("asset extraction failed", e);
        }
        return root.getAbsolutePath();
    }

    /** Differs for every installed APK (first install or update). */
    private static String installStamp(Context ctx) {
        try {
            return String.valueOf(ctx.getPackageManager().getPackageInfo(ctx.getPackageName(), 0).lastUpdateTime);
        } catch (PackageManager.NameNotFoundException e) {
            return "";   // our own package: does not happen; "" never matches a marker
        }
    }

    private static String readText(File f) {
        if (!f.exists()) return null;
        try (InputStream in = new FileInputStream(f)) {
            byte[] buf = new byte[(int) f.length()];
            int n = 0;
            while (n < buf.length) {
                int r = in.read(buf, n, buf.length - n);
                if (r < 0) break;
                n += r;
            }
            return new String(buf, 0, n, StandardCharsets.UTF_8);
        } catch (IOException e) {
            return null;
        }
    }

    private static void writeText(File f, String text) throws IOException {
        try (OutputStream out = new FileOutputStream(f)) {
            out.write(text.getBytes(StandardCharsets.UTF_8));
        }
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
