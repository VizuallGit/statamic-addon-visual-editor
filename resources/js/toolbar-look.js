/**
 * Trial look for the inline-edit toolbar and the section move bar.
 *
 * Original (bridge): 9px radius, 1px border, drop shadow, CP light/dark theme.
 * Trial: 4px radius, no border, no shadow. The pills themselves follow the
 * section — light chrome on a dark surface, dark chrome on a light one.
 *
 * Set ENABLED to false and hard-refresh CP to restore the original.
 *
 * Own CP script — not addon.js. Does not touch overlay-host / preview / bridge.
 */
(function () {
    'use strict';

    var ENABLED = true;
    var STYLE_ID = '__sve-toolbar-look';

    if (window.__sveToolbarLook) {
        return;
    }
    window.__sveToolbarLook = true;

    // Each ID gets its own suffix. Concatenating a comma-list then appending
    // ` > *` only attaches the child selector to the last ID, so the wrapper
    // was painted (white glow behind the bar) while the pills stayed dark.
    function pills(attr) {
        attr = attr || '';

        // Edit/hover bars are a transparent wrapper; the move bar *is* the pill.
        return (
            '#__sve-edit-toolbar' +
            attr +
            ' > *,' +
            '#__sve-hover-belt' +
            attr +
            ' > *,' +
            '#__sve-move-ctrl' +
            attr +
            ',' +
            '[data-sve-menu]' +
            attr
        );
    }

    function buttons(attr) {
        attr = attr || '';

        return (
            '#__sve-edit-toolbar' +
            attr +
            ' button,' +
            '#__sve-hover-belt' +
            attr +
            ' button,' +
            '#__sve-move-ctrl' +
            attr +
            ' button,' +
            '[data-sve-menu]' +
            attr +
            ' button'
        );
    }

    function seps(attr) {
        attr = attr || '';

        return (
            '#__sve-edit-toolbar' +
            attr +
            ' [data-sve-sep],' +
            '#__sve-hover-belt' +
            attr +
            ' [data-sve-sep],' +
            '[data-sve-menu]' +
            attr +
            ' [data-sve-sep]'
        );
    }

    function css() {
        if (!ENABLED) {
            return '';
        }

        return (
            pills() +
            '{' +
            'border:none!important;outline:none!important;box-shadow:none!important;' +
            'filter:none!important;border-radius:4px!important;' +
            '}' +
            buttons() +
            '{' +
            'border-radius:4px!important;outline:none!important;box-shadow:none!important;' +
            '}' +
            pills('[data-sve-tb-tone="dark"]') +
            '{' +
            'background:#ececee!important;color:#18181b!important;' +
            '}' +
            buttons('[data-sve-tb-tone="dark"]') +
            '{color:#18181b!important;}' +
            seps('[data-sve-tb-tone="dark"]') +
            '{background:rgba(0,0,0,.12)!important;}' +
            '#__sve-edit-toolbar[data-sve-tb-tone="dark"] button:hover:not([data-sve-on="1"]),' +
            '#__sve-hover-belt[data-sve-tb-tone="dark"] button:hover:not([data-sve-on="1"]),' +
            '#__sve-move-ctrl[data-sve-tb-tone="dark"] button:hover:not([data-sve-on="1"]),' +
            '[data-sve-menu][data-sve-tb-tone="dark"] button:hover{' +
            'background:rgba(0,0,0,.06)!important;' +
            '}' +
            '#__sve-edit-toolbar[data-sve-tb-tone="dark"] button[data-sve-on="1"],' +
            '#__sve-hover-belt[data-sve-tb-tone="dark"] button[data-sve-on="1"],' +
            '#__sve-move-ctrl[data-sve-tb-tone="dark"] button[data-sve-on="1"]{' +
            'background:#e4e4e7!important;' +
            '}' +
            pills('[data-sve-tb-tone="light"]') +
            '{' +
            'background:#27272a!important;color:#e4e4e7!important;' +
            '}' +
            buttons('[data-sve-tb-tone="light"]') +
            '{color:#e4e4e7!important;}' +
            seps('[data-sve-tb-tone="light"]') +
            '{background:rgba(255,255,255,.16)!important;}' +
            '#__sve-edit-toolbar[data-sve-tb-tone="light"] button:hover:not([data-sve-on="1"]),' +
            '#__sve-hover-belt[data-sve-tb-tone="light"] button:hover:not([data-sve-on="1"]),' +
            '#__sve-move-ctrl[data-sve-tb-tone="light"] button:hover:not([data-sve-on="1"]),' +
            '[data-sve-menu][data-sve-tb-tone="light"] button:hover{' +
            'background:rgba(255,255,255,.10)!important;' +
            '}' +
            '#__sve-edit-toolbar[data-sve-tb-tone="light"] button[data-sve-on="1"],' +
            '#__sve-hover-belt[data-sve-tb-tone="light"] button[data-sve-on="1"],' +
            '#__sve-move-ctrl[data-sve-tb-tone="light"] button[data-sve-on="1"]{' +
            'background:rgba(255,255,255,.20)!important;' +
            '}'
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

    function sampleUnder(win, bar) {
        var doc = win.document;
        var rect;
        var x;
        var y;
        var prev;
        var hit;

        if (!bar || !bar.getBoundingClientRect) {
            return null;
        }

        rect = bar.getBoundingClientRect();
        x = rect.left + Math.min(40, Math.max(8, rect.width / 2));
        y = rect.bottom + 8;
        prev = bar.style.pointerEvents;
        bar.style.pointerEvents = 'none';
        hit = doc.elementFromPoint(x, y);

        if (!hit || hit === bar || (bar.contains && bar.contains(hit))) {
            hit = doc.elementFromPoint(x, Math.max(0, rect.top - 8));
        }

        bar.style.pointerEvents = prev;

        if (hit && (hit === bar || (bar.contains && bar.contains(hit)))) {
            return null;
        }

        return hit;
    }

    function sourceForBar(win, bar) {
        var doc = win.document;
        var el;

        if (bar && bar.id === '__sve-move-ctrl') {
            el = sampleUnder(win, bar);
        } else {
            el =
                doc.querySelector('[data-sve-editing]') ||
                doc.querySelector('[data-sid-hover]') ||
                sampleUnder(win, bar);
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
        var move;
        var menu;
        var tone;

        if (!ENABLED || !win || !win.document) {
            return;
        }

        doc = win.document;
        edit = doc.getElementById('__sve-edit-toolbar');
        hover = doc.getElementById('__sve-hover-belt');
        move = doc.getElementById('__sve-move-ctrl');
        menu = doc.querySelector('[data-sve-menu]');

        if (!edit && !hover && !move && !menu) {
            return;
        }

        applyTone(win, edit);
        applyTone(win, hover);
        applyTone(win, move);

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
    document.addEventListener(
        'load',
        function (event) {
            if (event.target && event.target.id === 'live-preview-iframe') {
                schedule();
            }
        },
        true
    );
})();
