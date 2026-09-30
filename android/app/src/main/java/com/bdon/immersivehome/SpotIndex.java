package com.bdon.immersivehome;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.File;
import java.io.FileInputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

/**
 * Parses the extracted spots/index.json (id, ko name, band, dir "<room>/<id>").
 * Backs the settings scene picker and the shuffle rotation. Only entries whose
 * dir actually exists on disk are kept, so a partial data set never lists a
 * scene that would fail to load.
 */
final class SpotIndex {

    static final class Entry {
        final String id;
        final String name;   // Korean title
        final String band;
        final String dir;    // "<room>/<id>"
        Entry(String id, String name, String band, String dir) {
            this.id = id; this.name = name; this.band = band; this.dir = dir;
        }
    }

    private final List<Entry> entries;
    private final Random random = new Random();

    private SpotIndex(List<Entry> entries) { this.entries = entries; }

    static SpotIndex load(String spotsDir) {
        List<Entry> out = new ArrayList<>();
        try {
            File f = new File(spotsDir, "index.json");
            byte[] bytes = new byte[(int) f.length()];
            try (FileInputStream in = new FileInputStream(f)) {
                int off = 0, n;
                while (off < bytes.length && (n = in.read(bytes, off, bytes.length - off)) > 0) off += n;
            }
            JSONArray arr = new JSONArray(new String(bytes, "UTF-8"));
            for (int i = 0; i < arr.length(); i++) {
                JSONObject o = arr.getJSONObject(i);
                String dir = o.optString("dir", "");
                if (dir.isEmpty()) continue;
                if (!new File(spotsDir, dir + "/spot.json").exists()) continue;   // only loadable scenes
                out.add(new Entry(
                        o.optString("id", ""),
                        o.optString("name", o.optString("id", "")),
                        o.optString("band", ""),
                        dir));
            }
        } catch (Exception ignored) {
            // A malformed or missing index leaves the list empty; the default spot still loads.
        }
        return new SpotIndex(out);
    }

    int size() { return entries.size(); }
    List<Entry> all() { return entries; }

    /** Distinct bands in first-seen order. */
    List<String> bands() {
        List<String> out = new ArrayList<>();
        for (Entry e : entries) if (!out.contains(e.band)) out.add(e.band);
        return out;
    }

    /** Scenes for one band, in index order. */
    List<Entry> scenesForBand(String band) {
        List<Entry> out = new ArrayList<>();
        for (Entry e : entries) if (e.band.equals(band)) out.add(e);
        return out;
    }

    /** The band a given dir belongs to (empty if unknown). */
    String bandForDir(String dir) {
        for (Entry e : entries) if (e.dir.equals(dir)) return e.band;
        return entries.isEmpty() ? "" : entries.get(0).band;
    }

    String randomDirExcept(String current) {
        if (entries.isEmpty()) return null;
        if (entries.size() == 1) return entries.get(0).dir;
        for (int tries = 0; tries < 8; tries++) {
            String d = entries.get(random.nextInt(entries.size())).dir;
            if (!d.equals(current)) return d;
        }
        return entries.get(0).dir;
    }
}
