/**
 * Trial look for the inline-edit toolbar (T-chip + controls).
 *
 * Original (bridge): 9px radius, 1px border, drop shadow, CP light/dark theme.
 * Trial: 4px radius, no border/outline, no shadow. Background follows the
 * section — light chrome on a dark surface, dark chrome on a light one —
 * the same reading as the plus inserter.
 *
 * Set ENABLED to false and hard-refresh CP to restore the original.
 *
 * Own CP script — not addon.js. Does not touch overlay-host / preview / bridge.
 */
(function () {
    'use strict';

    var ENABLED = true;
    var STYLE_ID = '__sve-toolbar-look';
    var BARS = '#__sve-edit-toolbar,#__sve-hover-belt';

    if (window.__sveToolbarLook) {
        return;
    }
    window.__sveToolbarLook = true;

    function css() {
        if (!ENABLED) {
            return '';
        }

        return (
            BARS +
            ' > *,[data-sve-menu]{' +
            'border:none!important;outline:none!important;box-shadow:none!important;border-radius:4px!important;' +
            '}' +
            BARS +
            ' button,[data-sve-menu] button{' +
            'border-radius:4px!important;outline:none!important;box-shadow:none!important;' +
            '}' +
            BARS +
            '[data-sve-tb-tone="dark"],[data-sve-menu][data-sve-tb-tone="dark"]{color:#111!important;}' +
            BARS +
            '[data-sve-tb-tone="dark"] > *,[data-sve-menu][data-sve-tb-tone="dark"]{' +
            'background:#fff!important;color:#111!important;' +
            '}' +
            BARS +
            '[data-sve-tb-tone="dark"] button,[data-sve-menu][data-sve-tb-tone="dark"] button{color:#111!important;}' +
            BARS +
            '[data-sve-tb-tone="dark"] [data-sve-sep],[data-sve-menu][data-sve-tb-tone="dark"] [data-sve-sep]{' +
            'background:rgba(0,0,0,.12)!important;' +
            '}' +
            BARS +
            '[data-sve-tb-tone="dark"] button:hover:not([data-sve-on="1"]),[data-sve-menu][data-sve-tb-tone="dark"] button:hover{' +
            'background:rgba(0,0,0,.06)!important;' +
            '}' +
            BARS +
            '[data-sve-tb-tone="dark"] button[data-sve-on="1"]{background:#e4e4e7!important;}' +
            BARS +
            '[data-sve-tb-tone="light"],[data-sve-menu][data-sve-tb-tone="light"]{color:#fff!important;}' +
            BARS +
            '[data-sve-tb-tone="light"] > *,[data-sve-menu][data-sve-tb-tone="light"]{' +
            'background:#111!important;color:#fff!important;' +
            '}' +
            BARS +
            '[data-sve-tb-tone="light"] button,[data-sve-menu][data-sve-tb-tone="light"] button{color:#fff!important;}' +
            BARS +
            '[data-sve-tb-tone="light"] [data-sve-sep],[data-sve-menu][data-sve-tb-tone="light"] [data-sve-sep]{' +
            'background:rgba(255,255,255,.16)!important;' +
            '}' +
            BARS +
            '[data-sve-tb-tone="light"] button:hover:not([data-sve-on="1"]),[data-sve-menu][data-sve-tb-tone="light"] button:hover{' +
            'background:rgba(255,255,255,.10)!important;' +
            '}' +
            BARS +
            '[data-sve-tb-tone="light"] button[data-sve-on="1"]{background:rgba(255,255,255,.20)!important;}'
        );
    }

    function inject(win) {
        var doc;
        var style;
        var text;

        if (!win || !win.document) {
            return;
        }

        doc = win.document;
        style = doc.getElementById(STYLE_ID);
        text = css();

        if (!style) {
            style = doc.createElement('style');
            style.id = STYLE_ID;
            (doc.head || doc.documentElement).appendChild(style);
            style.textContent = text;

            return;
        }

        if (style.textContent !== text) {
            style.textContent = text;
        }
    }

    function parseRgb(value) {
        var m;
        var h;

        if (!value || typeof value !== 'string') {
            return null;
        }

        m = value.trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);

        if (m) {
            h = m[1];

            if (h.length === 3) {
                h = h.charAt(0) + h.charAt(0) + h.charAt(1) + h.charAt(1) + h.charAt(2) + h.charAt(2);
            }

            return {
                r: parseInt(h.slice(0, 2), 16),
                g: parseInt(h.slice(2, 4), 16),
                b: parseInt(h.slice(4, 6), 16),
                a: 1,
            };
        }

        m = value.match(
            /rgba?\(\s*([\d.]+)\s*[, ]\s*([\d.]+)\s*[, ]\s*([\d.]+)(?:\s*[,/]\s*([\d.]+%?))?/i
        );

        if (!m) {
            return null;
        }

        return {
            r: Number(m[1]),
            g: Number(m[2]),
            b: Number(m[3]),
            a: m[4] == null ? 1 : m[4].indexOf('%') !== -1 ? parseFloat(m[4]) / 100 : Number(m[4]),
        };
    }

    function surfaceIsDark(win, el) {
        var node = el;
        var i;
        var cs;
        var parsed;
        var lum;
        var text;

        for (i = 0; node && i < 16; i++) {
            cs = win.getComputedStyle(node);
            parsed = parseRgb(cs.backgroundColor);

            if (parsed && parsed.a >= 0.4) {
                if (node === win.document.body || node === win.document.documentElement) {
                    break;
                }

                lum = (0.2126 * parsed.r + 0.7152 * parsed.g + 0.0722 * parsed.b) / 255;

                return lum < 0.45;
            }

            node = node.parentElement;
        }

        parsed = el ? parseRgb(win.getComputedStyle(el).getPropertyValue('--sve-outline-color')) : null;

        if (parsed && parsed.a > 0) {
            lum = (0.2126 * parsed.r + 0.7152 * parsed.g + 0.0722 * parsed.b) / 255;

            return lum > 0.5;
        }

        text = el ? parseRgb(win.getComputedStyle(el).color) : null;

        if (text) {
            lum = (0.2126 * text.r + 0.7152 * text.g + 0.0722 * text.b) / 255;

            return lum > 0.55;
        }

        return false;
    }

    function sourceForBar(win, bar) {
        var doc = win.document;
        var el =
            doc.querySelector('[data-sid-inner]') ||
            doc.querySelector('[data-sve-editing]') ||
            doc.querySelector('[data-sid-hover]');
        var rect;
        var x;
        var y;
        var hit;

        if (!el && bar && bar.getBoundingClientRect) {
            rect = bar.getBoundingClientRect();
            x = rect.left + Math.min(24, rect.width / 2);
            y = rect.bottom + 12;
            hit = doc.elementFromPoint(x, y);

            if (hit && bar.contains(hit)) {
                hit = null;
            }

            el = hit;
        }

        if (el && el.closest) {
            return el.closest('[data-auto-contrast]') || el;
        }

        return el;
    }

    function applyTone(win, bar) {
        var source;
        var dark;
        var tone;

        if (!bar) {
            return;
        }

        source = sourceForBar(win, bar);
        dark = source ? surfaceIsDark(win, source) : false;
        tone = dark ? 'dark' : 'light';

        if (bar.getAttribute('data-sve-tb-tone') !== tone) {
            bar.setAttribute('data-sve-tb-tone', tone);
        }
    }

    function paint(win) {
        var doc;
        var edit;
        var hover;
        var menu;
        var tone;

        if (!ENABLED || !win || !win.document) {
            return;
        }

        doc = win.document;
        edit = doc.getElementById('__sve-edit-toolbar');
        hover = doc.getElementById('__sve-hover-belt');

        applyTone(win, edit);
        applyTone(win, hover);

        menu = doc.querySelector('[data-sve-menu]');

        if (menu) {
            tone =
                (edit && edit.getAttribute('data-sve-tb-tone')) ||
                (hover && hover.getAttribute('data-sve-tb-tone')) ||
                'light';

            if (menu.getAttribute('data-sve-tb-tone') !== tone) {
                menu.setAttribute('data-sve-tb-tone', tone);
            }
        }
    }

    function schedulePaint(win) {
        if (!win || win.__sveToolbarLookPaint) {
            return;
        }

        win.__sveToolbarLookPaint = win.requestAnimationFrame(function () {
            win.__sveToolbarLookPaint = 0;

            try {
                paint(win);
            } catch (err) {
                /* look must not abort bind */
            }
        });
    }

    function bindPreview(win) {
        var body;

        if (!win || !win.document || win.__sveToolbarLookBound === win.document) {
            return;
        }

        win.__sveToolbarLookBound = win.document;
        inject(win);
        schedulePaint(win);

        body = win.document.body;

        if (body && !body.__sveToolbarLookObs) {
            body.__sveToolbarLookObs = new MutationObserver(function () {
                schedulePaint(win);
            });
            body.__sveToolbarLookObs.observe(body, { childList: true });
        }

        if (!win.__sveToolbarLookWinBound) {
            win.__sveToolbarLookWinBound = true;
            win.addEventListener('statamic:preview-updated', function () {
                win.__sveToolbarLookBound = null;
                bindPreview(win);
            });
        }
    }

    function bindFrames() {
        var iframe = document.getElementById('live-preview-iframe');
        var nested;

        if (!iframe) {
            return;
        }

        try {
            bindPreview(iframe.contentWindow);
            nested = iframe.contentDocument && iframe.contentDocument.getElementById('live-preview-iframe');

            if (nested && nested.contentWindow) {
                bindPreview(nested.contentWindow);
            }
        } catch (err) {
            /* cross-origin */
        }
    }

    var timer = 0;

    function schedule() {
        if (timer) {
            return;
        }

        timer = window.setTimeout(function () {
            timer = 0;
            bindFrames();
        }, 200);
    }

    bindFrames();
    document.addEventListener('sve-chrome-render', schedule);
    new MutationObserver(schedule).observe(document.documentElement, {
        childList: true,
        subtree: true,
    });
})();
