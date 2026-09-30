package com.bdon.immersivehome;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.LinearGradient;
import android.graphics.Paint;
import android.graphics.Path;
import android.graphics.RadialGradient;
import android.graphics.RectF;
import android.graphics.Shader;
import android.util.AttributeSet;
import android.view.Gravity;
import android.view.View;
import android.widget.LinearLayout;
import android.widget.TextView;

/**
 * Custom Canvas-drawn widgets reproducing Theme.swift's game UI on Android with
 * no AndroidX. Everything here paints its own gradients/rings so the Gradle-free
 * build pulls in no support libraries.
 */
final class GameViews {
    private GameViews() {}

    static int dp(Context c, float v) {
        return Math.round(v * c.getResources().getDisplayMetrics().density);
    }

    // ---- GameRadio: concentric-ring ON/OFF radio (Theme.swift GameRadio) ----
    static final class GameRadio extends View {
        private boolean on;
        private final Paint p = new Paint(Paint.ANTI_ALIAS_FLAG);

        GameRadio(Context c) { super(c); }

        void setOn(boolean v) { if (on != v) { on = v; invalidate(); } }

        @Override protected void onDraw(Canvas cv) {
            float d = Math.min(getWidth(), getHeight());
            float cx = getWidth() / 2f, cy = getHeight() / 2f;
            // Drop shadow.
            p.setShader(null); p.setColor(Theme.argb(0.35, 0)); 
            cv.drawCircle(cx, cy + d * 0.03f, d * 0.5f, p);
            if (on) drawOn(cv, cx, cy, d); else drawOff(cv, cx, cy, d);
        }

        private void disc(Canvas cv, float cx, float cy, float d, float frac, int color) {
            p.setShader(null); p.setColor(color);
            cv.drawCircle(cx, cy, d * frac / 2f, p);
        }
        private void discGrad(Canvas cv, float cx, float cy, float d, float frac, int top, int bot) {
            float r = d * frac / 2f;
            p.setShader(new LinearGradient(cx, cy - r, cx, cy + r, top, bot, Shader.TileMode.CLAMP));
            cv.drawCircle(cx, cy, r, p);
        }
        private void discRadial(Canvas cv, float cx, float cy, float d, float frac, int inner, int outer) {
            float r = d * frac / 2f;
            p.setShader(new RadialGradient(cx, cy, r, inner, outer, Shader.TileMode.CLAMP));
            cv.drawCircle(cx, cy, r, p);
        }

        private void drawOn(Canvas cv, float cx, float cy, float d) {
            disc(cv, cx, cy, d, 1.0f, Theme.ON_OUTLINE);
            discGrad(cv, cx, cy, d, 0.92f, Theme.ON_RIM_TOP, Theme.ON_RIM_BOT);
            discRadial(cv, cx, cy, d, 0.84f, Theme.ON_RING_B, Theme.ON_RING_A);
            discRadial(cv, cx, cy, d, 0.60f, Theme.ON_BAND_A, Theme.ON_BAND_B);
            disc(cv, cx, cy, d, 0.40f, Theme.argb(0.35, Theme.WHITE));
            disc(cv, cx, cy, d, 0.32f, Theme.WHITE);
        }
        private void drawOff(Canvas cv, float cx, float cy, float d) {
            disc(cv, cx, cy, d, 1.0f, Theme.OFF_OUTLINE);
            discGrad(cv, cx, cy, d, 0.92f, Theme.OFF_RIM_TOP, Theme.OFF_RIM_BOT);
            discGrad(cv, cx, cy, d, 0.86f, Theme.OFF_RING_TOP, Theme.OFF_RING_BOT);
            disc(cv, cx, cy, d, 0.58f, Theme.OFF_WELL);
        }
    }

    // ---- Level-1 tab chip: indigo slab, teal + ✦ when selected ----
    static final class Tab extends View {
        private final String title;
        private boolean selected;
        private final Paint fill = new Paint(Paint.ANTI_ALIAS_FLAG);
        private final Paint stroke = new Paint(Paint.ANTI_ALIAS_FLAG);
        private final Paint text = new Paint(Paint.ANTI_ALIAS_FLAG);

        Tab(Context c, String title) {
            super(c);
            this.title = title;
            stroke.setStyle(Paint.Style.STROKE);
            text.setTypeface(Theme.font());
            text.setColor(Theme.WHITE);
            text.setTextAlign(Paint.Align.CENTER);
            text.setTextSize(dp(c, 16));
        }
        void setChosen(boolean v) { if (selected != v) { selected = v; invalidate(); } }

        @Override protected void onDraw(Canvas cv) {
            float w = getWidth(), h = getHeight(), r = dp(getContext(), 10);
            RectF box = new RectF(dp(getContext(), 2), dp(getContext(), 2),
                    w - dp(getContext(), 2), h - dp(getContext(), 2));
            if (selected) {
                fill.setShader(new LinearGradient(0, box.top, 0, box.bottom, Theme.TEAL_TOP, Theme.TEAL_BOTTOM, Shader.TileMode.CLAMP));
                cv.drawRoundRect(box, r, r, fill);
                stroke.setShader(null); stroke.setColor(Theme.argb(0.85, Theme.WHITE)); stroke.setStrokeWidth(dp(getContext(), 1.5f));
                cv.drawRoundRect(box, r, r, stroke);
            } else {
                fill.setShader(new LinearGradient(0, box.top, 0, box.bottom, Theme.TAB_TOP, Theme.TAB_BOTTOM, Shader.TileMode.CLAMP));
                cv.drawRoundRect(box, r, r, fill);
                stroke.setShader(null); stroke.setColor(Theme.argb(0.30, 0)); stroke.setStrokeWidth(dp(getContext(), 1));
                cv.drawRoundRect(box, r, r, stroke);
            }
            float baseline = h / 2f - (text.descent() + text.ascent()) / 2f;
            cv.drawText(title, w / 2f, baseline, text);
            if (selected) {
                // ✦ marker at the trailing edge.
                text.setTextAlign(Paint.Align.RIGHT);
                float old = text.getTextSize(); text.setTextSize(dp(getContext(), 13));
                cv.drawText("\u2726", w - dp(getContext(), 12), baseline, text);
                text.setTextSize(old); text.setTextAlign(Paint.Align.CENTER);
            }
        }
    }

    // ---- Level-2 horizontal chip (band / scene / section) ----
    static final class Chip extends View {
        private final String label;
        private boolean selected;
        private android.graphics.Bitmap logo;   // optional band logo, drawn left of the label
        private final Paint fill = new Paint(Paint.ANTI_ALIAS_FLAG);
        private final Paint stroke = new Paint(Paint.ANTI_ALIAS_FLAG);
        private final Paint text = new Paint(Paint.ANTI_ALIAS_FLAG);
        private final Paint img = new Paint(Paint.ANTI_ALIAS_FLAG | Paint.FILTER_BITMAP_FLAG);

        Chip(Context c, String label) {
            super(c);
            this.label = label;
            stroke.setStyle(Paint.Style.STROKE);
            text.setTypeface(Theme.font());
            text.setTextAlign(Paint.Align.CENTER);
            text.setTextSize(dp(c, 14));
        }
        void setChosen(boolean v) { if (selected != v) { selected = v; invalidate(); } }
        void setLogo(android.graphics.Bitmap b) { logo = b; invalidate(); }

        @Override protected void onDraw(Canvas cv) {
            float w = getWidth(), h = getHeight(), r = h / 2f;
            RectF box = new RectF(dp(getContext(), 1), dp(getContext(), 1), w - dp(getContext(), 1), h - dp(getContext(), 1));
            if (selected) {
                fill.setShader(new LinearGradient(0, box.top, 0, box.bottom, Theme.TEAL, Theme.TEAL_BOTTOM, Shader.TileMode.CLAMP));
                text.setColor(Theme.WHITE);
            } else {
                fill.setShader(null); fill.setColor(Theme.argb(0.45, Theme.PILL));
                text.setColor(Theme.argb(0.92, Theme.WHITE));
            }
            cv.drawRoundRect(box, r, r, fill);
            stroke.setShader(null);
            stroke.setColor(selected ? Theme.argb(0.85, Theme.WHITE) : Theme.argb(0.5, Theme.PILL_EDGE));
            stroke.setStrokeWidth(dp(getContext(), 1.2f));
            cv.drawRoundRect(box, r, r, stroke);
            float baseline = h / 2f - (text.descent() + text.ascent()) / 2f;
            if (logo != null) {
                // ~20dp logo at the leading edge; text centered in the remaining space.
                float ic = dp(getContext(), 20);
                float lead = dp(getContext(), 12);
                float iy = (h - ic) / 2f;
                RectF dstR = new RectF(lead, iy, lead + ic, iy + ic);
                cv.drawBitmap(logo, null, dstR, img);
                // Center the label in the area to the right of the logo.
                float textCx = (lead + ic + dp(getContext(), 4) + (w - dp(getContext(), 12))) / 2f;
                cv.drawText(label, textCx, baseline, text);
            } else {
                cv.drawText(label, w / 2f, baseline, text);
            }
        }
    }

    // ---- Scene card: thumbnail on top, Korean name below, teal border + ✦ when selected ----
    static final class SceneCard extends View {
        private final String name;
        private boolean selected;
        private android.graphics.Bitmap thumb;
        private final Paint fill = new Paint(Paint.ANTI_ALIAS_FLAG);
        private final Paint stroke = new Paint(Paint.ANTI_ALIAS_FLAG);
        private final Paint text = new Paint(Paint.ANTI_ALIAS_FLAG);
        private final Paint img = new Paint(Paint.ANTI_ALIAS_FLAG | Paint.FILTER_BITMAP_FLAG);
        private final RectF tmp = new RectF();

        SceneCard(Context c, String name) {
            super(c);
            this.name = name;
            setClickable(true);
            stroke.setStyle(Paint.Style.STROKE);
            text.setTypeface(Theme.font());
            text.setTextAlign(Paint.Align.CENTER);
            text.setTextSize(dp(c, 13));
        }
        void setChosen(boolean v) { if (selected != v) { selected = v; invalidate(); } }
        void setThumb(android.graphics.Bitmap b) { thumb = b; invalidate(); }

        @Override protected void onDraw(Canvas cv) {
            float w = getWidth(), h = getHeight();
            float pad = dp(getContext(), 2);
            float r = dp(getContext(), 10);
            float labelH = dp(getContext(), 30);
            RectF card = new RectF(pad, pad, w - pad, h - pad);

            // Card body.
            fill.setShader(null);
            fill.setColor(selected ? Theme.argb(0.55, Theme.TEAL) : Theme.argb(0.35, Theme.PILL));
            cv.drawRoundRect(card, r, r, fill);

            // Thumbnail region (top), rounded, cover-cropped.
            float imgBottom = h - labelH - pad;
            RectF imgBox = new RectF(card.left, card.top, card.right, imgBottom);
            int save = cv.save();
            Path clip = new Path();
            clip.addRoundRect(imgBox, new float[]{r, r, r, r, 0, 0, 0, 0}, Path.Direction.CW);
            cv.clipPath(clip);
            if (thumb != null) {
                // cover: scale so the 16:9 thumb fills the box, center-crop.
                float bw = thumb.getWidth(), bh = thumb.getHeight();
                float scale = Math.max(imgBox.width() / bw, imgBox.height() / bh);
                float dw = bw * scale, dh = bh * scale;
                float dx = imgBox.left + (imgBox.width() - dw) / 2f;
                float dy = imgBox.top + (imgBox.height() - dh) / 2f;
                tmp.set(dx, dy, dx + dw, dy + dh);
                cv.drawBitmap(thumb, null, tmp, img);
            } else {
                fill.setColor(Theme.argb(0.6, Theme.PANEL));
                cv.drawRect(imgBox, fill);
            }
            cv.restoreToCount(save);

            // Name (bottom band).
            text.setColor(selected ? Theme.WHITE : Theme.argb(0.92, Theme.WHITE));
            float baseline = imgBottom + labelH / 2f - (text.descent() + text.ascent()) / 2f;
            cv.drawText(ellipsize(name, text, w - dp(getContext(), 16)), w / 2f, baseline, text);

            // Selected border + ✦.
            if (selected) {
                stroke.setColor(Theme.argb(0.9, Theme.WHITE));
                stroke.setStrokeWidth(dp(getContext(), 2f));
                cv.drawRoundRect(card, r, r, stroke);
                float old = text.getTextSize();
                text.setTextAlign(Paint.Align.RIGHT); text.setTextSize(dp(getContext(), 13));
                cv.drawText("\u2726", card.right - dp(getContext(), 8), card.top + dp(getContext(), 18), text);
                text.setTextSize(old); text.setTextAlign(Paint.Align.CENTER);
            }
        }

        private static String ellipsize(String s, Paint p, float maxW) {
            if (p.measureText(s) <= maxW) return s;
            String ell = "\u2026";
            while (s.length() > 1 && p.measureText(s + ell) > maxW) s = s.substring(0, s.length() - 1);
            return s + ell;
        }
    }

    // ---- Option pill header capsule with attached drop panel (radius 32) ----
    // The pill is a LinearLayout: a header View that paints the capsule, plus an
    // optional detail container that the DropPanel background flows under.
    static final class Pill extends LinearLayout {
        private static final float HEADER_H_DP = 64;
        private final HeaderView header;
        private final LinearLayout detail;
        private boolean expanded;

        Pill(Context c, String title, String value, boolean expandable, Runnable onTap) {
            super(c);
            setOrientation(VERTICAL);
            setWillNotDraw(false);
            header = new HeaderView(c, title, value, expandable);
            header.setOnClickListener(v -> onTap.run());
            addView(header, new LinearLayout.LayoutParams(LayoutParams.MATCH_PARENT, dp(c, HEADER_H_DP)));
            detail = new LinearLayout(c);
            detail.setOrientation(VERTICAL);
            detail.setVisibility(GONE);
            int px = dp(c, 22);
            detail.setPadding(px, dp(c, 14), px, dp(c, 18));
            addView(detail, new LinearLayout.LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.WRAP_CONTENT));
        }

        LinearLayout detailContainer() { return detail; }
        void setValue(String v) { header.value = v; header.invalidate(); }

        void setExpanded(boolean v) {
            expanded = v;
            header.expanded = v;
            detail.setVisibility(v ? VISIBLE : GONE);
            header.invalidate();
            invalidate();
        }

        // The drop panel behind the whole pill, from header mid-line down.
        private final Paint panel = new Paint(Paint.ANTI_ALIAS_FLAG);
        @Override protected void onDraw(Canvas cv) {
            if (!expanded) return;
            float r = dp(getContext(), HEADER_H_DP) / 2f;
            float top = r;   // start at header vertical middle
            RectF body = new RectF(0, top, getWidth(), getHeight());
            Path path = new Path();
            path.addRoundRect(body, new float[]{0, 0, 0, 0, r, r, r, r}, Path.Direction.CW);
            // Subtract the header capsule so the panel starts on its lower contour.
            Path headerCap = new Path();
            headerCap.addRoundRect(new RectF(0, 0, getWidth(), dp(getContext(), HEADER_H_DP)), r, r, Path.Direction.CW);
            path.op(headerCap, Path.Op.DIFFERENCE);
            panel.setColor(Theme.argb(0.42, Theme.PILL_OPEN));
            cv.drawPath(path, panel);
        }

        static final class HeaderView extends View {
            String value;
            boolean expanded;
            private final String title;
            private final boolean expandable;
            private final Paint fill = new Paint(Paint.ANTI_ALIAS_FLAG);
            private final Paint stroke = new Paint(Paint.ANTI_ALIAS_FLAG);
            private final Paint rule = new Paint(Paint.ANTI_ALIAS_FLAG);
            private final Paint tp = new Paint(Paint.ANTI_ALIAS_FLAG);
            private final Paint vp = new Paint(Paint.ANTI_ALIAS_FLAG);

            HeaderView(Context c, String title, String value, boolean expandable) {
                super(c);
                this.title = title; this.value = value; this.expandable = expandable;
                setClickable(true);
                stroke.setStyle(Paint.Style.STROKE);
                tp.setTypeface(Theme.font()); tp.setColor(Theme.WHITE); tp.setTextSize(dp(c, 13));
                vp.setTypeface(Theme.font()); vp.setColor(Theme.WHITE); vp.setTextSize(dp(c, 16));
                rule.setColor(Theme.argb(0.85, Theme.WHITE));
            }

            @Override protected void onDraw(Canvas cv) {
                float w = getWidth(), h = getHeight(), r = h / 2f;
                RectF box = new RectF(0, 0, w, h);
                fill.setColor(Theme.argb(0.55, Theme.PILL));
                cv.drawRoundRect(box, r, r, fill);
                if (!expanded) {
                    stroke.setColor(Theme.argb(0.8, Theme.PILL_EDGE)); stroke.setStrokeWidth(dp(getContext(), 1));
                    cv.drawRoundRect(new RectF(0.5f, 0.5f, w - 0.5f, h - 0.5f), r, r, stroke);
                }
                float lead = dp(getContext(), 34);
                float ty = dp(getContext(), 20);
                cv.drawText(title, lead, ty, tp);
                float ruleY = dp(getContext(), 30);
                cv.drawRect(lead, ruleY, w - dp(getContext(), 60), ruleY + dp(getContext(), 1), rule);
                cv.drawText(value, lead, dp(getContext(), 52), vp);
                // Triangle: up when closed, down when open.
                drawTriangle(cv, w - dp(getContext(), 40), h / 2f, dp(getContext(), 8), expandable && expanded);
            }

            private void drawTriangle(Canvas cv, float cx, float cy, float s, boolean down) {
                Path p = new Path();
                if (down) { p.moveTo(cx - s, cy - s / 2); p.lineTo(cx + s, cy - s / 2); p.lineTo(cx, cy + s); }
                else { p.moveTo(cx - s, cy + s / 2); p.lineTo(cx + s, cy + s / 2); p.lineTo(cx, cy - s); }
                p.close();
                fill.setColor(Theme.WHITE);
                cv.drawPath(p, fill);
            }
        }
    }

    // ---- [∨] value [∧] stepper ----
    static final class Stepper extends LinearLayout {
        interface OnStep { void step(int dir); }
        private final TextView valueView;
        private final View down, up;

        Stepper(Context c, String value, OnStep cb) {
            super(c);
            setOrientation(HORIZONTAL);
            setGravity(Gravity.CENTER_VERTICAL);
            down = stepButton(c, false, () -> cb.step(-1));
            up = stepButton(c, true, () -> cb.step(1));
            valueView = new TextView(c);
            valueView.setTypeface(Theme.font());
            valueView.setTextColor(Theme.WHITE);
            valueView.setTextSize(18);
            valueView.setGravity(Gravity.CENTER);
            valueView.setText(value);
            valueView.setBackground(new PanelBg(dp(c, 6), Theme.argb(0.75, Theme.PANEL)));
            LinearLayout.LayoutParams vlp = new LinearLayout.LayoutParams(0, dp(c, 46), 1f);
            int m = dp(c, 12);
            vlp.leftMargin = m; vlp.rightMargin = m;
            addView(down); addView(valueView, vlp); addView(up);
        }
        void setValue(String v) { valueView.setText(v); }
        void setEnabledSteps(boolean canDown, boolean canUp) {
            down.setEnabled(canDown); down.setAlpha(canDown ? 1f : 0.4f);
            up.setEnabled(canUp); up.setAlpha(canUp ? 1f : 0.4f);
        }

        private View stepButton(Context c, boolean upArrow, Runnable onTap) {
            View v = new View(c) {
                private final Paint bg = new Paint(Paint.ANTI_ALIAS_FLAG);
                private final Paint st = new Paint(Paint.ANTI_ALIAS_FLAG);
                private final Paint ar = new Paint(Paint.ANTI_ALIAS_FLAG);
                @Override protected void onDraw(Canvas cv) {
                    float w = getWidth(), h = getHeight(), r = dp(getContext(), 5);
                    RectF box = new RectF(0, 0, w, h);
                    bg.setShader(new LinearGradient(0, 0, 0, h, Theme.TAB_TOP, Theme.TAB_BOTTOM, Shader.TileMode.CLAMP));
                    cv.drawRoundRect(box, r, r, bg);
                    st.setStyle(Paint.Style.STROKE); st.setColor(Theme.argb(0.85, Theme.WHITE)); st.setStrokeWidth(dp(getContext(), 1.5f));
                    cv.drawRoundRect(new RectF(0.75f, 0.75f, w - 0.75f, h - 0.75f), r, r, st);
                    float s = dp(getContext(), 7), cx = w / 2, cy = h / 2;
                    Path p = new Path();
                    if (upArrow) { p.moveTo(cx - s, cy + s / 2); p.lineTo(cx + s, cy + s / 2); p.lineTo(cx, cy - s); }
                    else { p.moveTo(cx - s, cy - s / 2); p.lineTo(cx + s, cy - s / 2); p.lineTo(cx, cy + s); }
                    p.close(); ar.setColor(Theme.WHITE); cv.drawPath(p, ar);
                }
            };
            v.setLayoutParams(new LinearLayout.LayoutParams(dp(c, 46), dp(c, 46)));
            v.setOnClickListener(x -> onTap.run());
            return v;
        }
    }

    // ---- Rounded-rect solid background drawable ----
    static final class PanelBg extends android.graphics.drawable.Drawable {
        private final float r; private final int color; private final Paint p = new Paint(Paint.ANTI_ALIAS_FLAG);
        PanelBg(float r, int color) { this.r = r; this.color = color; p.setColor(color); }
        @Override public void draw(Canvas cv) {
            android.graphics.Rect b = getBounds();
            cv.drawRoundRect(new RectF(b), r, r, p);
        }
        @Override public void setAlpha(int a) {}
        @Override public void setColorFilter(android.graphics.ColorFilter cf) {}
        @Override public int getOpacity() { return android.graphics.PixelFormat.TRANSLUCENT; }
    }
}
