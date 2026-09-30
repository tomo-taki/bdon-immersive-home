package com.bdon.immersivehome;

import android.app.Activity;
import android.app.WallpaperManager;
import android.content.ComponentName;
import android.content.Intent;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.LinearGradient;
import android.graphics.Paint;
import android.graphics.Shader;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.util.Log;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;
import android.widget.HorizontalScrollView;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TextView;
import android.widget.Toast;

import java.util.ArrayList;
import java.util.List;

/**
 * Launcher + settings screen in the Mac/Windows family look (Theme.swift), laid
 * out for portrait phones: level-1 tabs (배경 / 상세 / 정보) in a row at the top,
 * level-2 choices (band list, then scene list) in a horizontal scroll row below,
 * and vertically-scrolling content that fills the screen. All custom-drawn
 * (GameViews), no AndroidX. Korean strings.
 */
public final class SettingsActivity extends Activity {

    private enum Tab { SCENE, DETAIL, ABOUT }

    private Prefs prefs;
    private android.content.SharedPreferences.OnSharedPreferenceChangeListener prefsChangeListener;
    private SpotIndex index;
    private String spotsDir;

    private Tab tab = Tab.SCENE;
    private String band = "";
    private int insetTop, insetBottom;

    private FrameLayout root;
    private LinearLayout tabRow;
    private HorizontalScrollView level2Scroll;
    private LinearLayout level2Row;
    private ScrollView contentScroll;
    private LinearLayout content;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        spotsDir = Assets.ensureExtracted(this);
        index = SpotIndex.load(spotsDir);
        prefs = new Prefs(this);

        // Live-apply: whenever any setting changes in this screen, broadcast an
        // explicit in-app signal so the running wallpaper engines reload prefs and
        // apply the change without the wallpaper being re-selected. One listener
        // catches every write (scene, band, characters, parallax, shuffle mode/interval).
        prefsChangeListener = (sp, key) -> {
            Intent i = new Intent(BdonWallpaperService.ACTION_SETTINGS_CHANGED);
            i.setPackage(getPackageName());   // app-internal only
            sendBroadcast(i);
        };
        prefs.registerListener(prefsChangeListener);
        // QA prefs-seed hook (test only): `am start ... --es qa_prefs "shuffle=1,mode=1,spot=<dir>"`.
        // Sets shuffle on/off, shuffle mode (0 interval / 1 screen-on) and optional spot,
        // then finishes -- lets the emulator test exercise the screen-on shuffle path on a
        // release build where SharedPreferences are not writable via adb.
        String qp = BuildFlags.DEBUG && getIntent() != null ? getIntent().getStringExtra("qa_prefs") : null;
        if (qp != null) {
            Prefs p = new Prefs(this);
            String spotChanged = null;
            for (String kv : qp.split(",")) {
                String[] e = kv.split("=", 2);
                if (e.length != 2) continue;
                switch (e[0].trim()) {
                    case "shuffle": p.setShuffle(e[1].trim().equals("1")); break;
                    case "mode":    p.setShuffleMode(Integer.parseInt(e[1].trim())); break;
                    case "spot":    spotChanged = e[1].trim(); p.setSpotDirNow(spotChanged); break;
                }
            }
            Log.i("BDONWallpaper", "qa_prefs applied: " + qp);
            // Fire the same live-apply broadcast the settings UI sends (carrying the
            // exact spot so both engines apply the identical scene, no disk race).
            Intent b = new Intent(BdonWallpaperService.ACTION_SETTINGS_CHANGED);
            b.setPackage(getPackageName());
            if (spotChanged != null) b.putExtra(BdonWallpaperService.EXTRA_SPOT_DIR, spotChanged);
            sendBroadcast(b);
            finish();
            return;
        }

        // QA snapshot hook: `am start ... --es qa_snapshot "<dir>,<w>,<h>,<chars>,<name>"`.
        String qa = BuildFlags.DEBUG && getIntent() != null ? getIntent().getStringExtra("qa_snapshot") : null;
        if (qa != null) {
            String[] p = qa.split(",");
            java.io.File dir = getExternalFilesDir(null);
            if (dir != null) dir.mkdirs();
            String out = new java.io.File(dir, p[4] + ".png").getAbsolutePath();
            boolean ok = NativeWallpaper.nativeSnapshot(spotsDir, p[0],
                    Integer.parseInt(p[1]), Integer.parseInt(p[2]),
                    Boolean.parseBoolean(p[3]), out);
            Log.i("BDONWallpaper", "qa_snapshot " + (ok ? "ok" : "FAIL") + " -> " + out);
            finish();
            return;
        }

        band = index.bandForDir(prefs.spotDir());
        buildChrome();
        rebuildLevel2();
        rebuildContent();
    }

    @Override
    protected void onDestroy() {
        if (prefsChangeListener != null) {
            prefs.unregisterListener(prefsChangeListener);
            prefsChangeListener = null;
        }
        super.onDestroy();
    }

    // ---- backdrop + fixed chrome ----

    private void buildChrome() {
        root = new FrameLayout(this);
        root.setBackground(new BackdropDrawable());

        // Respect status/nav bar insets so nothing hides under them.
        root.setOnApplyWindowInsetsListener((v, insets) -> {
            insetTop = insets.getSystemWindowInsetTop();
            insetBottom = insets.getSystemWindowInsetBottom();
            applyInsets();
            return insets;
        });

        LinearLayout column = new LinearLayout(this);
        column.setOrientation(LinearLayout.VERTICAL);
        column.setId(View.generateViewId());

        // (No in-page title heading: the system app bar / launcher label already
        // reads "BDON Immersive Home". Spec removed the redundant heading above
        // the 배경/상세/정보 tabs.)
        final int pad = dp(16);

        // Level-1 tabs row.
        tabRow = new LinearLayout(this);
        tabRow.setOrientation(LinearLayout.HORIZONTAL);
        tabRow.setPadding(pad, dp(12), pad, dp(8));
        String[] labels = {getString(R.string.tab_scene), getString(R.string.tab_detail), getString(R.string.tab_about)};
        Tab[] tabs = {Tab.SCENE, Tab.DETAIL, Tab.ABOUT};
        for (int i = 0; i < tabs.length; i++) {
            final Tab t = tabs[i];
            GameViews.Tab chip = new GameViews.Tab(this, labels[i]);
            chip.setChosen(tab == t);
            chip.setOnClickListener(v -> { tab = t; refreshTabs(); rebuildLevel2(); rebuildContent(); });
            LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(0, dp(48), 1f);
            lp.leftMargin = i == 0 ? 0 : dp(8);
            tabRow.addView(chip, lp);
        }
        column.addView(tabRow);

        // Level-2 horizontal chip row.
        level2Scroll = new HorizontalScrollView(this);
        level2Scroll.setHorizontalScrollBarEnabled(false);
        level2Row = new LinearLayout(this);
        level2Row.setOrientation(LinearLayout.HORIZONTAL);
        level2Row.setPadding(pad, dp(2), pad, dp(10));
        level2Scroll.addView(level2Row);
        column.addView(level2Scroll);

        // Vertical content fills the rest.
        contentScroll = new ScrollView(this);
        content = new LinearLayout(this);
        content.setOrientation(LinearLayout.VERTICAL);
        content.setPadding(pad, 0, pad, dp(24));
        contentScroll.addView(content);
        column.addView(contentScroll, new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, 0, 1f));

        // Sticky bottom action bar (scene tab only): "배경화면으로 설정" lives here,
        // pinned below the scrolling scene grid, above the nav-bar inset.
        bottomBar = new LinearLayout(this);
        bottomBar.setOrientation(LinearLayout.VERTICAL);
        bottomBar.setPadding(pad, dp(8), pad, dp(8));
        column.addView(bottomBar, new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));

        root.addView(column, new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
        this.column = column;
        setContentView(root);
        root.requestApplyInsets();
    }

    private LinearLayout bottomBar;

    private LinearLayout column;
    private void applyInsets() {
        if (column != null) column.setPadding(0, insetTop, 0, insetBottom);
    }

    private void refreshTabs() {
        for (int i = 0; i < tabRow.getChildCount(); i++) {
            View c = tabRow.getChildAt(i);
            if (c instanceof GameViews.Tab) {
                ((GameViews.Tab) c).setChosen(i == tab.ordinal());
            }
        }
    }

    // ---- level 2 (bands for 배경; sections for 상세; nothing for 정보) ----

    private void rebuildLevel2() {
        level2Row.removeAllViews();
        if (tab == Tab.SCENE) {
            level2Scroll.setVisibility(View.VISIBLE);
            List<String> bands = index.bands();
            for (int i = 0; i < bands.size(); i++) {
                final String b = bands.get(i);
                GameViews.Chip chip = new GameViews.Chip(this, b);
                chip.setChosen(b.equals(band));
                // Band logo (~20dp) inside the chip, left of the name.
                int logoPx = dp(20);
                Thumbs.loadBand(this, Thumbs.bandAsset(b), bandLogoProxy(chip), logoPx, logoPx);
                chip.setOnClickListener(v -> { band = b; refreshLevel2Selection(); rebuildContent(); });
                LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(
                        ViewGroup.LayoutParams.WRAP_CONTENT, dp(40));
                lp.rightMargin = dp(8);
                int hp = dp(18);
                chip.setPadding(hp, 0, hp, 0);
                chip.setMinimumWidth(dp(64));
                level2Row.addView(measuredBandChip(chip, b, lp));
            }
        } else {
            level2Scroll.setVisibility(View.GONE);
        }
    }

    private void refreshLevel2Selection() {
        List<String> bands = index.bands();
        for (int i = 0; i < level2Row.getChildCount() && i < bands.size(); i++) {
            View c = level2Row.getChildAt(i);
            if (c instanceof GameViews.Chip) ((GameViews.Chip) c).setChosen(bands.get(i).equals(band));
        }
    }

    // Give a chip an intrinsic width based on its text (custom View has none).
    private View measuredChip(GameViews.Chip chip, String label, LinearLayout.LayoutParams lp) {
        Paint p = new Paint(); p.setTypeface(Theme.font()); p.setTextSize(dp(14));
        int w = (int) p.measureText(label) + dp(36);
        lp.width = Math.max(w, dp(64));
        chip.setLayoutParams(lp);
        return chip;
    }

    // Band chip carries a ~20dp logo on the left, so it needs extra width.
    private View measuredBandChip(GameViews.Chip chip, String label, LinearLayout.LayoutParams lp) {
        Paint p = new Paint(); p.setTypeface(Theme.font()); p.setTextSize(dp(14));
        int w = (int) p.measureText(label) + dp(36) + dp(20) + dp(6);   // + logo + gap
        lp.width = Math.max(w, dp(80));
        chip.setLayoutParams(lp);
        return chip;
    }

    // Adapt Thumbs (ImageView target) to a band Chip's setLogo.
    private ImageView bandLogoProxy(GameViews.Chip chip) {
        return new ImageView(this) {
            @Override public void setImageBitmap(android.graphics.Bitmap b) { chip.setLogo(b); }
        };
    }

    // ---- content per tab ----

    private void rebuildContent() {
        content.removeAllViews();
        bottomBar.removeAllViews();
        switch (tab) {
            case SCENE:  buildSceneContent();  break;
            case DETAIL: buildDetailContent(); break;
            case ABOUT:  buildAboutContent();  break;
        }
        // Scene tab: the "배경화면으로 설정" action is pinned to the bottom, after
        // the scene grid, instead of sitting at the top of the content.
        if (tab == Tab.SCENE) {
            bottomBar.setVisibility(View.VISIBLE);
            bottomBar.addView(lavender(getString(R.string.set_wallpaper), this::openLiveWallpaperChooser));
        } else {
            bottomBar.setVisibility(View.GONE);
        }
    }

    private void buildSceneContent() {
        content.addView(sectionRule());
        content.addView(label(getString(R.string.scene)));

        List<SpotIndex.Entry> scenes = index.scenesForBand(band);
        if (scenes.isEmpty()) {
            content.addView(hint(getString(R.string.no_scenes)));
            return;
        }

        // 2-column vertical grid of thumbnail cards. Card image is 16:9; total
        // card height = image + label band. Two columns with an 8dp gutter.
        String cur = prefs.spotDir();
        final int cols = 2;
        final int gutter = dp(8);
        int screenW = getResources().getDisplayMetrics().widthPixels;
        int pad = dp(16);
        int cardW = (screenW - pad * 2 - gutter * (cols - 1)) / cols;
        int imgH = Math.round(cardW * 9f / 16f);
        int cardH = imgH + dp(30) + dp(4);

        final java.util.List<GameViews.SceneCard> cards = new java.util.ArrayList<>();
        LinearLayout rowc = null;
        for (int i = 0; i < scenes.size(); i++) {
            final SpotIndex.Entry e = scenes.get(i);
            if (i % cols == 0) {
                rowc = new LinearLayout(this);
                rowc.setOrientation(LinearLayout.HORIZONTAL);
                LinearLayout.LayoutParams rlp = new LinearLayout.LayoutParams(
                        ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
                rlp.bottomMargin = gutter;
                content.addView(rowc, rlp);
            }
            GameViews.SceneCard card = new GameViews.SceneCard(this, e.name);
            card.setChosen(e.dir.equals(cur));
            // Downsampled, off-thread thumbnail load from assets/thumbs/<id>.jpg.
            Thumbs.loadScene(this, e.id, thumbImageProxy(card), cardW, imgH);
            card.setOnClickListener(v -> {
                prefs.setSpotDirNow(e.dir);   // flush before the broadcast so no engine reads stale
                Intent b = new Intent(BdonWallpaperService.ACTION_SETTINGS_CHANGED);
                b.setPackage(getPackageName());
                b.putExtra(BdonWallpaperService.EXTRA_SPOT_DIR, e.dir);   // both engines apply THIS
                sendBroadcast(b);
                for (int k = 0; k < cards.size(); k++) cards.get(k).setChosen(scenes.get(k).dir.equals(e.dir));
            });
            LinearLayout.LayoutParams clp = new LinearLayout.LayoutParams(0, cardH, 1f);
            if (i % cols != 0) clp.leftMargin = gutter;
            rowc.addView(card, clp);
            cards.add(card);
        }
        // If the last row has a single card, add an empty spacer so it stays left-aligned.
        if (scenes.size() % cols != 0 && rowc != null) {
            View spacer = new View(this);
            LinearLayout.LayoutParams slp = new LinearLayout.LayoutParams(0, cardH, 1f);
            slp.leftMargin = gutter;
            rowc.addView(spacer, slp);
        }
    }

    // SceneCard is a custom View, not an ImageView; adapt Thumbs (which targets
    // ImageView) with a tiny proxy that forwards the decoded bitmap to the card.
    private ImageView thumbImageProxy(GameViews.SceneCard card) {
        ImageView proxy = new ImageView(this) {
            @Override public void setImageBitmap(android.graphics.Bitmap b) { card.setThumb(b); }
        };
        return proxy;
    }

    private void buildDetailContent() {
        content.addView(sectionRule());

        // Display section pills.
        content.addView(label(getString(R.string.section_display)));
        content.addView(onOffPill(getString(R.string.show_characters), prefs.showCharacters(), prefs::setShowCharacters));
        content.addView(spacer(dp(12)));
        content.addView(onOffPill(getString(R.string.parallax), prefs.parallax(), prefs::setParallax));
        content.addView(spacer(dp(18)));

        // Shuffle section.
        content.addView(label(getString(R.string.section_shuffle)));
        content.addView(onOffPill(getString(R.string.shuffle), prefs.shuffle(), prefs::setShuffle));
        content.addView(spacer(dp(12)));
        content.addView(shuffleModePill());
        content.addView(spacer(dp(12)));
        intervalPillView = intervalPill();
        content.addView(intervalPillView);
        applyShuffleModeVisibility();
        content.addView(spacer(dp(18)));
        content.addView(lavender(getString(R.string.reset_defaults), this::resetDefaults));
    }

    private void buildAboutContent() {
        content.addView(sectionRule());
        TextView name = new TextView(this);
        name.setText("BDON Immersive Home");
        name.setTypeface(Theme.font()); name.setTextColor(Color.WHITE); name.setTextSize(20);
        content.addView(name);
        TextView ver = new TextView(this);
        ver.setText(getString(R.string.version_prefix) + " " + versionString());
        ver.setTypeface(Theme.font()); ver.setTextColor(Theme.argb(0.82, Color.WHITE)); ver.setTextSize(13);
        ver.setPadding(0, dp(4), 0, dp(14));
        content.addView(ver);

        LinearLayout lic = new LinearLayout(this);
        lic.setOrientation(LinearLayout.VERTICAL);
        lic.setBackground(new GameViews.PanelBg(dp(6), Theme.argb(0.22, Color.BLACK)));
        int lp = dp(14); lic.setPadding(lp, lp, lp, lp);
        lic.addView(licenseLine(getString(R.string.license_fan)));
        lic.addView(licenseLine(getString(R.string.license_spine)));
        content.addView(lic);
    }

    // ---- version: "2026.09.29 (hash)" from a generated string resource ----
    private String versionString() {
        int id = getResources().getIdentifier("build_version", "string", getPackageName());
        return id != 0 ? getString(id) : "개발 빌드";
    }

    // ---- pill builders ----

    private GameViews.Pill openPill;   // only one open at a time

    private GameViews.Pill intervalPillView;   // hidden when shuffle mode is screen-on

    // "셔플 방식" pill: choose between 시간마다 (interval timer) and 화면을 켤 때마다
    // (rotate each screen-on). Selecting a mode persists it and shows/hides the
    // interval pill, since the interval is only meaningful in the timer mode.
    private GameViews.Pill shuffleModePill() {
        final int[] mode = {prefs.shuffleMode()};
        final GameViews.Pill[] holder = new GameViews.Pill[1];
        GameViews.Pill pill = new GameViews.Pill(this, getString(R.string.shuffle_mode),
                shuffleModeLabel(mode[0]), true, () -> togglePill(holder[0]));
        holder[0] = pill;
        LinearLayout rowc = new LinearLayout(this);
        rowc.setOrientation(LinearLayout.HORIZONTAL);
        Runnable[] refresh = new Runnable[1];
        refresh[0] = () -> {
            rowc.removeAllViews();
            rowc.addView(radioChoice(getString(R.string.shuffle_mode_interval),
                    mode[0] == Prefs.SHUFFLE_MODE_INTERVAL, () -> {
                        mode[0] = Prefs.SHUFFLE_MODE_INTERVAL;
                        prefs.setShuffleMode(mode[0]);
                        pill.setValue(shuffleModeLabel(mode[0]));
                        applyShuffleModeVisibility();
                        refresh[0].run();
                    }));
            rowc.addView(spacer(dp(16)));
            rowc.addView(radioChoice(getString(R.string.shuffle_mode_screen_on),
                    mode[0] == Prefs.SHUFFLE_MODE_SCREEN_ON, () -> {
                        mode[0] = Prefs.SHUFFLE_MODE_SCREEN_ON;
                        prefs.setShuffleMode(mode[0]);
                        pill.setValue(shuffleModeLabel(mode[0]));
                        applyShuffleModeVisibility();
                        refresh[0].run();
                    }));
        };
        refresh[0].run();
        pill.detailContainer().addView(rowc);
        return pill;
    }

    private String shuffleModeLabel(int mode) {
        return getString(mode == Prefs.SHUFFLE_MODE_SCREEN_ON
                ? R.string.shuffle_mode_screen_on : R.string.shuffle_mode_interval);
    }

    private void applyShuffleModeVisibility() {
        if (intervalPillView == null) return;
        boolean interval = prefs.shuffleMode() == Prefs.SHUFFLE_MODE_INTERVAL;
        intervalPillView.setVisibility(interval ? View.VISIBLE : View.GONE);
    }

    private interface BoolSink { void set(boolean v); }

    private GameViews.Pill onOffPill(String title, boolean value, BoolSink sink) {
        final GameViews.Pill[] holder = new GameViews.Pill[1];
        GameViews.Pill pill = new GameViews.Pill(this, title, value ? "ON" : "OFF", true, () -> togglePill(holder[0]));
        holder[0] = pill;
        // Detail: OFF / ON radio choices.
        LinearLayout dc = pill.detailContainer();
        LinearLayout rowc = new LinearLayout(this);
        rowc.setOrientation(LinearLayout.HORIZONTAL);
        final boolean[] cur = {value};
        rowc.addView(radioChoice("OFF", !cur[0], () -> { cur[0] = false; sink.set(false); pill.setValue("OFF"); refreshRadios(rowc, false); }));
        rowc.addView(spacer(dp(16)));
        rowc.addView(radioChoice("ON", cur[0], () -> { cur[0] = true; sink.set(true); pill.setValue("ON"); refreshRadios(rowc, true); }));
        dc.addView(rowc);
        return pill;
    }

    private GameViews.Pill intervalPill() {
        final int[] mins = {1, 5, 10, 30, 60};
        final int[] idx = {indexOf(mins, prefs.shuffleIntervalMinutes())};
        final GameViews.Pill[] holder = new GameViews.Pill[1];
        GameViews.Pill pill = new GameViews.Pill(this, getString(R.string.shuffle_interval),
                shortInterval(mins[idx[0]]), true, () -> togglePill(holder[0]));
        holder[0] = pill;
        GameViews.Stepper[] stepHolder = new GameViews.Stepper[1];
        GameViews.Stepper stepper = new GameViews.Stepper(this, shortInterval(mins[idx[0]]), dir -> {
            idx[0] = Math.max(0, Math.min(mins.length - 1, idx[0] + dir));
            prefs.setShuffleIntervalMinutes(mins[idx[0]]);
            stepHolder[0].setValue(shortInterval(mins[idx[0]]));
            stepHolder[0].setEnabledSteps(idx[0] > 0, idx[0] < mins.length - 1);
            pill.setValue(shortInterval(mins[idx[0]]));
        });
        stepHolder[0] = stepper;
        stepper.setEnabledSteps(idx[0] > 0, idx[0] < mins.length - 1);
        pill.detailContainer().addView(stepper);
        return pill;
    }

    private void togglePill(GameViews.Pill pill) {
        if (openPill == pill) { pill.setExpanded(false); openPill = null; return; }
        if (openPill != null) openPill.setExpanded(false);
        pill.setExpanded(true);
        openPill = pill;
    }

    private LinearLayout radioChoice(String text, boolean selected, Runnable onTap) {
        LinearLayout row = new LinearLayout(this);
        row.setOrientation(LinearLayout.HORIZONTAL);
        row.setGravity(Gravity.CENTER_VERTICAL);
        row.setBackground(new GameViews.PanelBg(dp(21), selected ? Theme.TEAL : Theme.argb(0.45, Theme.PANEL)));
        int hp = dp(10);
        row.setPadding(hp, dp(4), dp(20), dp(4));
        GameViews.GameRadio radio = new GameViews.GameRadio(this);
        radio.setOn(selected);
        row.addView(radio, new LinearLayout.LayoutParams(dp(33), dp(33)));
        TextView t = new TextView(this);
        t.setText(text); t.setTypeface(Theme.font()); t.setTextColor(Color.WHITE); t.setTextSize(14);
        LinearLayout.LayoutParams tlp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        tlp.leftMargin = dp(12);
        row.addView(t, tlp);
        row.setOnClickListener(v -> onTap.run());
        row.setMinimumHeight(dp(48));
        LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(dp(150), dp(48));
        row.setLayoutParams(lp);
        return row;
    }

    private void refreshRadios(LinearLayout rowc, boolean onSelected) {
        // rowc children: [OFF row][spacer][ON row]
        setRadio(rowc.getChildAt(0), !onSelected);
        setRadio(rowc.getChildAt(2), onSelected);
    }
    private void setRadio(View row, boolean selected) {
        if (!(row instanceof LinearLayout)) return;
        row.setBackground(new GameViews.PanelBg(dp(21), selected ? Theme.TEAL : Theme.argb(0.45, Theme.PANEL)));
        View first = ((LinearLayout) row).getChildAt(0);
        if (first instanceof GameViews.GameRadio) ((GameViews.GameRadio) first).setOn(selected);
    }

    // ---- small view helpers ----

    private View sectionRule() {
        View v = new View(this);
        v.setBackgroundColor(Theme.argb(0.7, Color.WHITE));
        LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dp(1));
        lp.bottomMargin = dp(14); lp.topMargin = dp(2);
        v.setLayoutParams(lp);
        return v;
    }

    private TextView label(String text) {
        TextView t = new TextView(this);
        t.setText(text); t.setTypeface(Theme.font());
        t.setTextColor(Theme.argb(0.75, Color.WHITE)); t.setTextSize(13);
        t.setPadding(0, dp(6), 0, dp(8));
        return t;
    }

    private TextView hint(String text) {
        TextView t = new TextView(this);
        t.setText(text); t.setTypeface(Theme.font());
        t.setTextColor(Color.parseColor("#E0A0A0")); t.setTextSize(13);
        return t;
    }

    private TextView licenseLine(String text) {
        TextView t = new TextView(this);
        t.setText(text); t.setTypeface(Theme.font());
        t.setTextColor(Theme.argb(0.78, Color.WHITE)); t.setTextSize(11);
        t.setPadding(0, dp(3), 0, dp(3));
        return t;
    }

    private View spacer(int h) {
        View v = new View(this);
        v.setLayoutParams(new LinearLayout.LayoutParams(dp(1), h));
        return v;
    }

    // Lavender action button (dotted corners feel via border).
    private View lavender(String text, Runnable onTap) {
        TextView b = new TextView(this);
        b.setText(text); b.setTypeface(Theme.font()); b.setTextColor(Theme.INK);
        b.setTextSize(15); b.setGravity(Gravity.CENTER);
        b.setMinimumHeight(dp(50));
        b.setPadding(dp(16), dp(12), dp(16), dp(12));
        b.setBackground(new LavenderDrawable(dp(4)));
        b.setOnClickListener(v -> onTap.run());
        LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        b.setLayoutParams(lp);
        return b;
    }

    private int dp(float v) { return GameViews.dp(this, v); }

    private int indexOf(int[] arr, int v) {
        for (int i = 0; i < arr.length; i++) if (arr[i] == v) return i;
        return 2;   // default 10 min
    }
    private String shortInterval(int minutes) {
        return minutes >= 60 ? (minutes / 60) + "\uC2DC\uAC04" : minutes + "\uBD84";
    }

    private void resetDefaults() {
        prefs.setShowCharacters(true);
        prefs.setParallax(true);
        prefs.setShuffle(false);
        prefs.setShuffleIntervalMinutes(10);
        openPill = null;
        rebuildContent();
    }

    private void openLiveWallpaperChooser() {
        try {
            Intent i = new Intent(WallpaperManager.ACTION_CHANGE_LIVE_WALLPAPER);
            i.putExtra(WallpaperManager.EXTRA_LIVE_WALLPAPER_COMPONENT,
                    new ComponentName(this, BdonWallpaperService.class));
            startActivity(i);
        } catch (Exception e) {
            try { startActivity(new Intent(WallpaperManager.ACTION_LIVE_WALLPAPER_CHOOSER)); }
            catch (Exception e2) { Toast.makeText(this, R.string.chooser_unavailable, Toast.LENGTH_LONG).show(); }
        }
    }

    // ---- drawables ----

    private static final class BackdropDrawable extends Drawable {
        private final Paint p = new Paint(Paint.ANTI_ALIAS_FLAG);
        @Override public void draw(Canvas cv) {
            android.graphics.Rect b = getBounds();
            p.setShader(new LinearGradient(0, b.top, 0, b.bottom, Theme.NAVY_TOP, Theme.NAVY_BOTTOM, Shader.TileMode.CLAMP));
            cv.drawRect(b, p);
        }
        @Override public void setAlpha(int a) {}
        @Override public void setColorFilter(android.graphics.ColorFilter cf) {}
        @Override public int getOpacity() { return android.graphics.PixelFormat.OPAQUE; }
    }

    private static final class LavenderDrawable extends Drawable {
        private final float r; private final Paint fill = new Paint(Paint.ANTI_ALIAS_FLAG);
        private final Paint stroke = new Paint(Paint.ANTI_ALIAS_FLAG);
        LavenderDrawable(float r) { this.r = r; stroke.setStyle(Paint.Style.STROKE); }
        @Override public void draw(Canvas cv) {
            android.graphics.Rect b = getBounds();
            fill.setShader(new LinearGradient(0, b.top, 0, b.bottom, Theme.LAV_TOP, Theme.LAV_BOTTOM, Shader.TileMode.CLAMP));
            android.graphics.RectF rf = new android.graphics.RectF(b);
            cv.drawRoundRect(rf, r, r, fill);
            stroke.setColor(Theme.argb(0.9, Color.WHITE)); stroke.setStrokeWidth(2);
            cv.drawRoundRect(rf, r, r, stroke);
        }
        @Override public void setAlpha(int a) {}
        @Override public void setColorFilter(android.graphics.ColorFilter cf) {}
        @Override public int getOpacity() { return android.graphics.PixelFormat.TRANSLUCENT; }
    }
}
