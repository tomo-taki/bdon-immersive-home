package com.bdon.immersivehome;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.ActivityNotFoundException;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.provider.Settings;

/**
 * Builds up to b27 were installed as com.bdon.immersivehome; this one is
 * com.togawa.bdon_immersive_home (android/build.sh), so Android keeps both.
 * While the old app is still there, the settings screen asks to remove it
 * (one tap opens the system uninstall prompt) and to set this app's wallpaper
 * again: the two apps cannot share settings. 닫기 stops the question for good.
 */
final class PreviousApp {
    static final String PACKAGE = "com.bdon.immersivehome";   // AndroidManifest <queries>

    // A file of its own: a write to the wallpaper prefs would make the settings
    // screen broadcast a settings change to the running engines.
    private static final String FILE = "bdon_app";
    private static final String K_CLOSED = "previousAppNoticeClosed";

    private PreviousApp() {}

    /** Shows the notice and returns it, or null when there is nothing to ask. */
    static AlertDialog askToRemove(Activity activity) {
        SharedPreferences sp = activity.getSharedPreferences(FILE, Context.MODE_PRIVATE);
        if (sp.getBoolean(K_CLOSED, false) || !isInstalled(activity)) return null;
        return new AlertDialog.Builder(activity, android.R.style.Theme_DeviceDefault_Dialog_Alert)
                .setTitle(R.string.previous_app_title)
                .setMessage(R.string.previous_app_message)
                .setPositiveButton(R.string.previous_app_remove, (d, w) -> uninstall(activity))
                .setNegativeButton(R.string.previous_app_close,
                        (d, w) -> sp.edit().putBoolean(K_CLOSED, true).apply())
                .show();
    }

    private static boolean isInstalled(Context ctx) {
        try {
            ctx.getPackageManager().getPackageInfo(PACKAGE, 0);
            return true;
        } catch (PackageManager.NameNotFoundException e) {
            return false;
        }
    }

    /** The system uninstall prompt; failing that, the app's info page (with 제거). */
    private static void uninstall(Activity activity) {
        Uri uri = Uri.parse("package:" + PACKAGE);
        try {
            activity.startActivity(new Intent(Intent.ACTION_DELETE, uri));
        } catch (ActivityNotFoundException e) {
            activity.startActivity(new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS, uri));
        }
    }
}
