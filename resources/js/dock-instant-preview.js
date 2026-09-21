/**
 * Paint HTML-dock edits into Live Preview in the same frame.
 *
 * Own CP script — not addon.js. Does not touch overlay-host / preview / bridge.
 *
 * Two speeds, one source (the dock's text):
 *
 *   Paint (this file, same frame)   classes, CSS, the static structure of the
 *                                   markup, and simple `{{ field }}` text taken
 *                                   from the publish form's values.
 *   Truth (PHP morph, ~1 s)         everything Antlers must decide: `{{ if }}`,
 *                                   loops, partials, tags, `visual_edit` attrs.
 *
 * How the structure paint stays honest:
 *   - every `{{ … }}` that is not a plain field path becomes a marker; an
 *     element whose text or attributes still hold a marker is "dynamic" and is
 *     never created from the template — the live node waits for the morph;
 *   - a live node that has no template counterpart is only removed when its
 *     parent has no markers at all, so loop and partial output is left alone;
 *   - a renamed tag keeps every attribute of the live node (`data-sid` included);
 *     new elements never get `data-sid` — that is the server's to give;
 *   - `<script>` is never created, `<style>` belongs to the CSS pane.
 *   If anything in the structure paint throws, the class-only paint runs instead.
 *
 * The dock's text is read from the editor's state, never from its DOM: CodeMirror
 * only renders the lines in view, so a long file read off the DOM ends where the
 * pane's viewport does — and a scroll would then paint that cut.
 *
 * Astro/Vite updates CSS in place. The dock does the same for classes: the
 * section's classes go through the same Tailwind compiler that writes the
 * baked file, the result is one unlayered <style> last in <head>, and the
 * class attribute is swapped. A class the strip's add list is on — under the
 * mouse, the arrows or the keyboard — is held the same way (`sve:tw-preview`)
 * until it is picked or left. The PHP morph still saves in the background. It
 * is not on the paint path.
 *
 * Which elements a class is held on is decided one way for every entry point
 * (the HTML pane's own list, the strip's plus list, a chip's menu, the icon
 * row — the strip renders from the HTML caret, so all four are about the tag
 * the caret is in): the dock's text up to the caret is parsed with a sentinel
 * where the caret is, which lands inside whatever element is open there, and
 * that template element is paired with the live section by the rules the
 * structure paint pairs with. Not the tree's stamps in the preview (they go
 * stale between two morphs) and not "the first tag of that name".
 */
(function () {
    'use strict';

    if (window.__sveDockInstantPreview === 13) {
        return;
    }
    window.__sveDockInstantPreview = 13;

    var DOCK_ID = '__sve-code-dock';
    var STYLE_TW_ID = '__sve-tw-dock-live';
    var STYLE_CSS_ID = '__sve-dock-css-live';
    var MODE_KEY = 'sveInstantPreview';
    /** 'off' = a class shows only once it is picked; anything else = it shows while the list is on it. */
    var HOVER_KEY = 'sveInstantHover';
    var MODE_STYLE_ID = '__sve-instant-mode-style';
    var ANT = '\uE000';

    var raf = 0;
    var lastHtml = null;
    var lastCss = '';
    var lastSid = '';
    var painting = false;
    var booted = false;
    var lastFullHtml = '';
    var lastSnippet = '';

    /** The last few paint decisions, newest last: `window.__sveInstantTrace`. */
    function trace(what) {
        var list = window.__sveInstantTrace || (window.__sveInstantTrace = []);

        list.push(Date.now() + ' ' + what);

        if (list.length > 30) {
            list.shift();
        }
    }

    function cfg(key, fallback) {
        try {
            var value = window.Statamic?.$config?.get?.(key);
            return value === undefined || value === null ? fallback : value;
        } catch (e) {
            return fallback;
        }
    }

    function featureOn(key) {
        return cfg('sveFeatures', {})[key] === true;
    }

    /**
     * Two paints, same save path. `astro` writes classes into the iframe in
     * the same frame. `morph` leaves the iframe to the PHP morph (~1 s).
     */
    function instantMode() {
        try {
            var value = window.localStorage.getItem(MODE_KEY);

            if (value === 'morph' || value === 'astro') {
                return value;
            }
        } catch (e) {
            // Private mode still gets the fast path.
        }

        return 'astro';
    }

    function hoverPreviewOn() {
        try {
            return window.localStorage.getItem(HOVER_KEY) !== 'off';
        } catch (e) {
            return true;
        }
    }

    function setHoverPreview(on) {
        try {
            window.localStorage.setItem(HOVER_KEY, on ? 'on' : 'off');
        } catch (e) {
            // The session still switches; it just will not remember.
        }

        if (!on) {
            restoreTwHold();
        }

        paintToggle();
    }

    function setInstantMode(next) {
        try {
            window.localStorage.setItem(MODE_KEY, next);
        } catch (e) {
            // The session still switches; it just will not remember.
        }

        lastHtml = null;
        paintToggle();
        schedulePaint();
    }

    function ensureModeStyle() {
        var style = document.getElementById(MODE_STYLE_ID);

        if (!style) {
            style = document.createElement('style');
            style.id = MODE_STYLE_ID;
            document.head.appendChild(style);
        }

        style.textContent =
            '#' + DOCK_ID + ' [data-sve-instant-mode]{' +
                'display:inline-flex;flex:0 0 auto;align-items:stretch;box-sizing:border-box;' +
                'position:relative;height:26px;margin-left:4px;border:1px solid rgba(255,255,255,.12);' +
                'border-radius:6px;' +
            '}' +
            '#' + DOCK_ID + ' [data-sve-instant-mode] button{' +
                'all:unset;cursor:pointer;display:inline-flex;align-items:center;height:100%;' +
                'padding:0 8px;font:600 11px/1 ui-sans-serif,system-ui,sans-serif;' +
                'letter-spacing:.04em;text-transform:uppercase;color:#d4d4d4;opacity:.55;' +
            '}' +
            '#' + DOCK_ID + ' [data-sve-instant="astro"]{' +
                'border-radius:5px 0 0 5px;' +
            '}' +
            '#' + DOCK_ID + ' [data-sve-instant="morph"]{' +
                'border-radius:0;' +
            '}' +
            '#' + DOCK_ID + ' [data-sve-instant-mode] button[aria-pressed="true"]{' +
                'opacity:1;color:#93c5fd;background:rgba(56,88,233,.22);' +
            '}' +
            '#' + DOCK_ID + ' [data-sve-instant-hover]{' +
                'padding:0 7px;border-radius:0 5px 5px 0;border-left:1px solid rgba(255,255,255,.12);' +
            '}' +
            '#' + DOCK_ID + ' [data-sve-instant-hover] svg{' +
                'width:13px;height:13px;display:block;' +
            '}' +
            '#' + DOCK_ID + ' [data-sve-instant-active="morph"] [data-sve-instant-hover]{' +
                'opacity:.25;' +
            '}' +
            '#' + DOCK_ID + ' [data-sve-tw-docs]{' +
                'all:unset;cursor:pointer;flex:0 0 auto;display:inline-flex;align-items:center;' +
                'height:26px;padding:0 7px;margin-left:2px;border-radius:6px;' +
                'font:600 10px/1 ui-sans-serif,system-ui,sans-serif;letter-spacing:.02em;' +
                'color:#7dd3fc;opacity:.7;' +
            '}' +
            '#' + DOCK_ID + ' [data-sve-tw-docs]:hover{' +
                'opacity:1;background:rgba(56,189,248,.16);' +
            '}' +
            '#' + DOCK_ID + ':not([data-sve-style="tw"]) [data-sve-tw-docs]{' +
                'display:none;' +
            '}';
    }

    function paintToggle() {
        var dock = document.getElementById(DOCK_ID);
        var group = dock && dock.querySelector('[data-sve-instant-mode]');
        var mode = instantMode();

        if (!group) {
            return;
        }

        group.setAttribute('data-sve-instant-active', mode);

        Array.prototype.forEach.call(group.querySelectorAll('[data-sve-instant]'), function (button) {
            button.setAttribute(
                'aria-pressed',
                button.getAttribute('data-sve-instant') === mode ? 'true' : 'false'
            );
        });

        paintHoverButton(group.querySelector('[data-sve-instant-hover]'));
    }

    var EYE_ICON =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>';

    function paintHoverButton(btn) {
        var on = hoverPreviewOn();

        if (!btn) {
            return;
        }

        btn.setAttribute('aria-pressed', on ? 'true' : 'false');
        btn.title = on
            ? 'Klasser forhåndsvises i Live Preview mens listen står på dem — klik for at vise dem først når de vælges'
            : 'Klasser vises først når de vælges — klik for at forhåndsvise dem mens listen står på dem';
    }

    /**
     * The eye: a class shows in Live Preview while the add list is on it
     * (mouse, arrows, typing), or only once it is picked. Both stay; this
     * is the switch, remembered per browser like the mode next to it.
     */
    function ensureHoverButton(group) {
        var btn = group.querySelector('[data-sve-instant-hover]');

        if (btn) {
            return;
        }

        btn = document.createElement('button');
        btn.type = 'button';
        btn.setAttribute('data-sve-instant-hover', '');
        btn.setAttribute('aria-label', 'Forhåndsvis klasser under musen og pilen');
        btn.innerHTML = EYE_ICON;
        btn.addEventListener('click', function (event) {
            event.preventDefault();
            event.stopPropagation();
            setHoverPreview(!hoverPreviewOn());
        });
        group.appendChild(btn);
    }

    function ensureTwDocs(dock) {
        var btn;
        var link;

        if (!dock) {
            return;
        }

        btn = dock.querySelector('[data-sve-style-mode]');

        if (!btn) {
            return;
        }

        link = dock.querySelector('[data-sve-tw-docs]');

        if (!link) {
            link = document.createElement('a');
            link.setAttribute('data-sve-tw-docs', '');
            link.href = 'https://tailwindcss.com/docs';
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.title = 'Tailwind CSS docs — utility classes';
            link.textContent = 'Docs';
            link.addEventListener('click', function (event) {
                event.stopPropagation();
            });

            if (btn.nextSibling) {
                btn.parentNode.insertBefore(link, btn.nextSibling);
            } else {
                btn.parentNode.appendChild(link);
            }
        }
    }

    function paintInstantButton(btn) {
        var wrap;
        var group;
        var badge;

        if (!btn) {
            return;
        }

        btn.title = 'Instant Preview — klasser males med det samme';
        btn.textContent = 'Instant';

        // Older sessions wrapped Instant for a beta badge — unwrap and drop it.
        wrap = btn.closest('[data-sve-instant-wrap]');
        group = btn.closest('[data-sve-instant-mode]');

        if (wrap && group) {
            Array.prototype.slice.call(wrap.querySelectorAll('[data-sve-instant-beta]')).forEach(function (el) {
                el.remove();
            });
            group.insertBefore(btn, wrap);
            wrap.remove();
        }

        badge = group && group.querySelector('[data-sve-instant-beta]');

        if (badge) {
            badge.remove();
        }
    }

    function ensureToggle(dock) {
        var bar;
        var group;
        var before;

        ensureModeStyle();

        if (!dock) {
            return;
        }

        group = dock.querySelector('[data-sve-instant-mode]');

        if (group) {
            var instantBtn = group.querySelector('[data-sve-instant="astro"]');
            var morphBtn = group.querySelector('[data-sve-instant="morph"]');

            group.setAttribute('aria-label', 'Instant Preview');

            paintInstantButton(instantBtn);

            if (morphBtn) {
                morphBtn.textContent = '1 s';
                morphBtn.title = 'Venter på gemt morph, cirka ét sekund';
            }

            ensureHoverButton(group);
            paintToggle();
            ensureTwDocs(dock);
            return;
        }

        bar = dock.querySelector('[data-sve-code-bar]');

        if (!bar) {
            return;
        }

        group = document.createElement('div');
        group.setAttribute('data-sve-instant-mode', '');
        group.setAttribute('role', 'group');
        group.setAttribute('aria-label', 'Instant Preview');
        group.innerHTML =
            '<button type="button" data-sve-instant="astro" title="Instant Preview — klasser males med det samme">Instant</button>' +
            '<button type="button" data-sve-instant="morph" title="Venter på gemt morph, cirka ét sekund">1 s</button>';
        group.addEventListener('click', function (event) {
            var btn = event.target.closest('[data-sve-instant]');

            if (!btn) {
                return;
            }

            setInstantMode(btn.getAttribute('data-sve-instant'));
        });

        ensureHoverButton(group);
        before = bar.querySelector('[data-sve-code-autosave]');

        if (before) {
            bar.insertBefore(group, before);
        } else {
            bar.appendChild(group);
        }

        paintToggle();
        ensureTwDocs(dock);
    }

    function paneContent(handle) {
        return document.querySelector(
            '#' + DOCK_ID + ' [data-sve-code-pane="' + handle + '"] .cm-content'
        );
    }

    /**
     * A pane's EditorView, read off its content node. @codemirror/view keeps
     * the editor on `cmTile` since 6.38; older builds used `cmView`.
     */
    function paneView(handle) {
        var el = paneContent(handle);

        return el?.cmTile?.view || el?.cmView?.view || el?.cmView?.rootView?.view || null;
    }

    /**
     * The whole document, from the editor's state. CodeMirror renders only the
     * lines in view (plus a margin): read off the DOM, a long file ends where
     * the viewport does, and the paint would take out whatever lies past it —
     * on every scroll. The DOM is the fallback for a pane with no view on it.
     */
    function paneText(handle) {
        var view = paneView(handle);
        var pane;
        var lines;

        if (view && view.state && view.state.doc) {
            return view.state.doc.toString();
        }

        pane = paneContent(handle);

        if (!pane) {
            return '';
        }

        lines = pane.querySelectorAll('.cm-line');

        if (!lines.length) {
            return pane.textContent || '';
        }

        return Array.prototype.map.call(lines, function (line) {
            return line.textContent;
        }).join('\n');
    }

    function previewDocument() {
        var iframe = document.getElementById('live-preview-iframe');

        try {
            var doc = iframe?.contentDocument || null;
            var nested = doc?.getElementById('live-preview-iframe');

            return nested?.contentDocument || doc;
        } catch (e) {
            return null;
        }
    }

    function outermostSid(from) {
        var last = from && from.hasAttribute && from.hasAttribute('data-sid') ? from : null;
        var el = from ? from.parentElement : null;

        while (el) {
            if (el.hasAttribute && el.hasAttribute('data-sid')) {
                last = el;
            }
            el = el.parentElement;
        }

        return last;
    }

    function sectionBySid(doc, sid) {
        if (!sid || !doc) {
            return null;
        }

        var el;

        try {
            el = doc.querySelector('[data-sid="' + CSS.escape(sid) + '"]');
        } catch (e) {
            return null;
        }

        return outermostSid(el);
    }

    function uidFromInput(input) {
        if (!input) {
            return '';
        }

        return String(input.getAttribute('data-visual-id') || input.value || '').trim();
    }

    function uidFromCp() {
        var hosts = document.querySelectorAll(
            '[data-sve-active], [data-sve-section-active], [data-sve-focus-set], [data-sve-lite-focus]'
        );
        var i;
        var input;
        var uid;

        for (i = 0; i < hosts.length; i++) {
            input = hosts[i].querySelector('[data-visual-id]');
            uid = uidFromInput(input);
            if (uid) {
                return uid;
            }
        }

        return '';
    }

    function lonePageSection(doc) {
        var nodes = doc.querySelectorAll('[data-sid-section-orderable]');
        var list = [];
        var seen = {};
        var i;
        var id;

        for (i = 0; i < nodes.length; i++) {
            id = nodes[i].getAttribute('data-sid');
            if (id && !seen[id]) {
                seen[id] = true;
                list.push(nodes[i]);
            }
        }

        return list.length === 1 ? list[0] : null;
    }

    function classTokens(el) {
        return (el && el.getAttribute && el.getAttribute('class') || '')
            .split(/\s+/)
            .filter(function (name) {
                return name && name !== '[' && name !== ']' && name.indexOf('\uE000') === -1;
            });
    }

    /**
     * Collection templates (services/show, index) stamp `visual_edit` on an
     * inner tag, not `section_orderable` on the file root. Match the file's
     * first element by path, then by tag + classes — not the header.
     */
    function fileRootLive(doc, root) {
        var tag;
        var found;
        var nodes;
        var i;
        var path;
        var tokens;
        var live;
        var cls;
        var j;
        var ok;

        if (!doc || !root) {
            return null;
        }

        tag = root.tagName;
        found = pageSection(doc);

        if (found && found.tagName === tag) {
            return found;
        }

        nodes = doc.querySelectorAll('[data-sve-ht-path]');

        for (i = 0; i < nodes.length; i++) {
            path = nodes[i].getAttribute('data-sve-ht-path') || '';

            if (nodes[i].tagName === tag && path.indexOf('/') === -1) {
                return nodes[i];
            }
        }

        tokens = classTokens(root);
        live = doc.getElementsByTagName(tag);

        if (tokens.length) {
            for (i = 0; i < live.length; i++) {
                cls = ' ' + (live[i].getAttribute('class') || '') + ' ';
                ok = true;

                for (j = 0; j < tokens.length; j++) {
                    if (cls.indexOf(' ' + tokens[j] + ' ') === -1) {
                        ok = false;
                        break;
                    }
                }

                if (ok) {
                    return live[i];
                }
            }
        }

        found = null;

        for (i = 0; i < live.length; i++) {
            if (live[i].closest && live[i].closest('header, footer, nav, [data-sve-chrome]')) {
                continue;
            }

            if (found) {
                return live.length === 1 ? live[0] : null;
            }

            found = live[i];
        }

        return found || (live.length === 1 ? live[0] : null);
    }

    function pageSection(doc) {
        var found =
            outermostSid(
                doc.querySelector('[data-sid-active]') || doc.querySelector('[data-sid-hover]')
            ) ||
            sectionBySid(doc, uidFromCp()) ||
            sectionBySid(doc, lastSid) ||
            lonePageSection(doc);

        if (found) {
            lastSid = found.getAttribute('data-sid') || lastSid;
        }

        return found;
    }

    // ---- Publish-form values: the real source for `{{ field }}` ----------------
    //
    // Statamic announces every publish form it mounts. The entry form's values
    // hold the section rows (`page_sections`), and a row is found by the same
    // uid the preview carries as `data-sid`.

    var containers = [];

    function trackContainers() {
        var events = window.Statamic && Statamic.$events;

        if (!events || typeof events.$on !== 'function' || trackContainers.done) {
            return;
        }

        trackContainers.done = true;
        events.$on('publish-container-created', function (payload) {
            if (payload && payload.values && containers.indexOf(payload) === -1) {
                containers.push(payload);
            }
        });
        events.$on('publish-container-destroyed', function (payload) {
            containers = containers.filter(function (c) {
                return c !== payload && !(payload && payload.name && c.name === payload.name);
            });
        });
    }

    function unwrapRef(v) {
        return v && v.__v_isRef ? v.value : v;
    }

    function rowMatches(row, uid) {
        return !!row && typeof row === 'object' &&
            (row._visual_id === uid || row.id === uid || row._id === uid);
    }

    /** Depth-first: the row with this uid, however deep the set sits. */
    function findRow(node, uid, depth) {
        var i;
        var key;
        var hit;

        if (!node || typeof node !== 'object' || depth > 12) {
            return null;
        }

        if (Array.isArray(node)) {
            for (i = 0; i < node.length; i++) {
                if (rowMatches(node[i], uid)) {
                    return node[i];
                }
            }

            for (i = 0; i < node.length; i++) {
                hit = findRow(node[i], uid, depth + 1);

                if (hit) {
                    return hit;
                }
            }

            return null;
        }

        for (key in node) {
            if (Object.prototype.hasOwnProperty.call(node, key) && node[key] && typeof node[key] === 'object') {
                hit = findRow(node[key], uid, depth + 1);

                if (hit) {
                    return hit;
                }
            }
        }

        return null;
    }

    function classFromType(type) {
        return String(type || '').replace(/\//g, '-').replace(/_/g, '-');
    }

    /**
     * The variables a section partial sees, as the page loop hands them over:
     * the row's own fields plus `id`, `_class` and `class`.
     */
    function sectionContext(uid) {
        var i;
        var values;
        var row;
        var ctx;

        if (!uid) {
            return null;
        }

        for (i = 0; i < containers.length; i++) {
            values = unwrapRef(containers[i].values);
            row = values ? findRow(values[cfg('sveSectionField', 'page_sections')] || values, uid, 0) : null;

            if (row) {
                ctx = Object.assign({}, row);
                ctx.id = row.id || uid;
                ctx._class = classFromType(row.type);
                ctx.class = ctx._class;

                return ctx;
            }
        }

        return null;
    }

    // Antlers heads that are never a field: tags, control flow, closers, and
    // anything with a colon, a space, a pipe or a parenthesis.
    var NOT_A_FIELD = /^(if|unless|else|elseif|endif|endunless|partial|collection|nav|svg|assets|asset|once|yield|section|glide|iconify|visual_edit|style_push|script_push|responsive_css|sve_tw|sve_props|sve_defaults|theme_color_scale|loop|foreach|switch|cache|no_cache|form|user|taxonomy|structure|link|route|dump|redirect|increment|locales|mix|vite|markdown|parent|path|query|search|session|set|slot|trans|translate|users|entries|children|rss|now|is_|has_)$/;

    /**
     * `{{ headline }}` or `{{ settings.style }}` from the row: a string or a
     * number, or `null` when this is anything Antlers has to decide.
     */
    function resolveField(expr, ctx) {
        var parts;
        var value;
        var i;

        expr = String(expr || '').trim();

        if (!ctx || !/^[a-zA-Z_][\w]*(\.[\w]+)*$/.test(expr) || NOT_A_FIELD.test(expr.split('.')[0])) {
            return null;
        }

        parts = expr.split('.');

        if (!Object.prototype.hasOwnProperty.call(ctx, parts[0])) {
            return null;
        }

        value = ctx;

        for (i = 0; i < parts.length; i++) {
            if (value === null || value === undefined) {
                return '';
            }

            if (typeof value !== 'object' || !Object.prototype.hasOwnProperty.call(value, parts[i])) {
                return null;
            }

            value = value[parts[i]];
        }

        if (value === null || value === undefined) {
            return '';
        }

        if (typeof value === 'string' || typeof value === 'number') {
            return String(value);
        }

        return null;
    }

    function escapeHtml(text) {
        return String(text)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    /**
     * Antlers out, DOM in. Comments vanish, plain fields become their value,
     * everything else becomes the marker character the rest of this file
     * treats as "not ours to paint".
     */
    function stripAntlers(html, ctx) {
        return String(html)
            .replace(/\{\{#[\s\S]*?#\}\}/g, '')
            .replace(/\{\{[\s\S]*?\}\}/g, function (tag) {
                var value = resolveField(tag.slice(2, -2), ctx);

                return value === null ? ANT : escapeHtml(value);
            });
    }

    function templateRoot(html, ctx) {
        var wrap = document.createElement('div');

        wrap.innerHTML = stripAntlers(html, ctx);

        for (var i = 0; i < wrap.children.length; i++) {
            var el = wrap.children[i];

            if (el.tagName !== 'STYLE' && el.tagName !== 'SCRIPT') {
                return el;
            }
        }

        return null;
    }

    function tagKids(parent, tag) {
        var out = [];
        var kids = parent.children;

        for (var i = 0; i < kids.length; i++) {
            if (kids[i].tagName === tag) {
                out.push(kids[i]);
            }
        }

        return out;
    }

    function classValue(value) {
        return String(value || '')
            .split(/\s+/)
            .filter(function (name) {
                return name && name !== '[' && name !== ']' && name.indexOf(ANT) === -1;
            })
            .join(' ');
    }

    function applyClass(el, value) {
        var next;
        var prev;

        if (!el || String(value).indexOf(ANT) !== -1) {
            return;
        }

        next = classValue(value);
        prev = classValue(el.getAttribute('class') || '');

        if (prev === next) {
            return;
        }

        if (next === '') {
            el.removeAttribute('class');
            return;
        }

        el.setAttribute('class', next);
    }

    function syncClasses(section, tplRoot) {
        applyClass(section, tplRoot.getAttribute('class') || '');

        function walk(tplParent, liveParents) {
            var children = [];
            var counts = {};
            var i;

            for (i = 0; i < tplParent.children.length; i++) {
                var child = tplParent.children[i];

                if (child.tagName === 'STYLE' || child.tagName === 'SCRIPT') {
                    continue;
                }

                children.push(child);
                counts[child.tagName] = (counts[child.tagName] || 0) + 1;
            }

            var seen = {};

            children.forEach(function (tplEl) {
                var tag = tplEl.tagName;
                seen[tag] = (seen[tag] || 0) + 1;

                var liveKids = [];
                liveParents.forEach(function (parent) {
                    liveKids = liveKids.concat(tagKids(parent, tag));
                });

                var targets;

                if (counts[tag] === 1) {
                    targets = liveKids;
                } else {
                    var idx = seen[tag] - 1;
                    targets = liveParents
                        .map(function (parent) {
                            return tagKids(parent, tag)[idx];
                        })
                        .filter(Boolean);
                }

                if (tplEl.hasAttribute('class')) {
                    var cls = tplEl.getAttribute('class') || '';
                    targets.forEach(function (liveEl) {
                        applyClass(liveEl, cls);
                    });
                }

                if (tplEl.children.length && targets.length) {
                    walk(tplEl, targets);
                }
            });
        }

        walk(tplRoot, [section]);
    }

    // ---- Structure paint ---------------------------------------------------------

    var SKIP_TAGS = { SCRIPT: 1, STYLE: 1, TEMPLATE: 1 };

    function hasMarker(text) {
        return String(text || '').indexOf(ANT) !== -1;
    }

    function elementKids(el) {
        var out = [];
        var i;

        for (i = 0; i < el.children.length; i++) {
            if (!SKIP_TAGS[el.children[i].tagName]) {
                out.push(el.children[i]);
            }
        }

        return out;
    }

    /** Direct text of an element, ignoring whitespace-only nodes. */
    function directText(el) {
        var out = '';
        var i;
        var node;

        for (i = 0; i < el.childNodes.length; i++) {
            node = el.childNodes[i];

            if (node.nodeType === 3) {
                out += node.nodeValue;
            }
        }

        return out;
    }

    /** Text or an attribute still waiting on Antlers, anywhere in this subtree. */
    function isDynamic(tplEl) {
        var i;

        if (hasMarker(tplEl.textContent)) {
            return true;
        }

        for (i = 0; i < tplEl.attributes.length; i++) {
            if (hasMarker(tplEl.attributes[i].value)) {
                return true;
            }
        }

        return elementKids(tplEl).some(isDynamic);
    }

    /** Attributes the server owns: never written, never removed by the paint. */
    function isServerAttr(name) {
        return name.indexOf('data-sid') === 0 || name.indexOf('data-sve-') === 0 || name === 'data-visual-id';
    }

    /**
     * On a node that is already on the page only the class is painted. Every
     * other attribute is either the server's (`data-sid*`, `id="id-…"`, glide
     * URLs) or the page's own JS's (Alpine's `style`, `aria-*`), and rewriting
     * those mid-edit breaks the page for no gain. New attributes arrive with
     * the morph; new nodes are built from the template in full.
     */
    function syncAttrs(live, tpl) {
        var cls = tpl.getAttribute('class');

        if (cls !== null && !hasMarker(cls)) {
            applyClass(live, cls);
        }
    }

    /**
     * A fresh element from the template, scrubbed of anything the server owns
     * and of attribute names the marker left behind (`{{ visual_edit }}` sits
     * where an attribute would).
     */
    function buildStatic(doc, tplEl) {
        var el = doc.importNode(tplEl, true);
        var scripts = el.querySelectorAll('script, style, template');
        var all;
        var i;
        var j;
        var attr;

        for (i = scripts.length - 1; i >= 0; i--) {
            scripts[i].remove();
        }

        all = [el].concat(Array.prototype.slice.call(el.querySelectorAll('*')));

        for (i = 0; i < all.length; i++) {
            for (j = all[i].attributes.length - 1; j >= 0; j--) {
                attr = all[i].attributes[j];

                if (isServerAttr(attr.name) || hasMarker(attr.name) || hasMarker(attr.value)) {
                    all[i].removeAttribute(attr.name);
                }
            }
        }

        return el;
    }

    /** Same node, new tag: every attribute and child comes along. */
    function renameTag(live, tag) {
        var doc = live.ownerDocument;
        var next = doc.createElement(tag.toLowerCase());
        var i;

        for (i = 0; i < live.attributes.length; i++) {
            next.setAttribute(live.attributes[i].name, live.attributes[i].value);
        }

        while (live.firstChild) {
            next.appendChild(live.firstChild);
        }

        live.replaceWith(next);

        return next;
    }

    /** The tags of an element's kids as a set: a loop renders many from one, so counts are no shape. */
    function kidTags(el) {
        var out = {};

        elementKids(el).forEach(function (kid) {
            out[kid.tagName] = true;
        });

        return out;
    }

    /** Same kids by tag on both sides: a leaf for a leaf, a wrapper for a wrapper. */
    function sameShape(live, tpl) {
        var a = kidTags(live);
        var b = kidTags(tpl);
        var key;

        for (key in a) {
            if (!b[key]) {
                return false;
            }
        }

        for (key in b) {
            if (!a[key]) {
                return false;
            }
        }

        return true;
    }

    /** The wrapper goes; its children take its place. */
    function unwrap(el) {
        while (el.firstChild) {
            el.before(el.firstChild);
        }

        el.remove();
    }

    /** Text nodes with something in them, directly under this element. */
    function dropDirectText(el) {
        var i;
        var node;

        for (i = el.childNodes.length - 1; i >= 0; i--) {
            node = el.childNodes[i];

            if (node.nodeType === 3 && node.nodeValue.trim() !== '') {
                el.removeChild(node);
            }
        }
    }

    /**
     * How well a live child and a template child match: the same tag, then
     * the same class, the same kids by tag, the same finished text on a leaf.
     * 0 when the tags differ — those are never a pair.
     */
    function pairScore(liveEl, tplEl) {
        var score;

        if (liveEl.tagName !== tplEl.tagName) {
            return 0;
        }

        score = 1;

        if (classValue(liveEl.getAttribute('class') || '') === classValue(tplEl.getAttribute('class') || '')) {
            score += 1;
        }

        if (sameShape(liveEl, tplEl)) {
            score += 1;
        }

        if (
            !elementKids(tplEl).length &&
            !elementKids(liveEl).length &&
            !hasMarker(tplEl.textContent) &&
            liveEl.textContent.trim() === tplEl.textContent.trim()
        ) {
            score += 1;
        }

        return score;
    }

    /**
     * Template kids paired with live kids, in order: the alignment with the
     * highest total score, never crossing.
     *
     * Four <p> in a row used to be paired by ordinal into a list that shrank
     * as it was consumed, so the second template <p> met the third live one
     * and every text landed one node off until the morph put it right. A
     * wrapper typed around the <h2> took the first <div> on the page instead
     * of wrapping the heading. In a section with one tag of each kind neither
     * showed; in a section with a fieldset and repeated tags every keystroke
     * painted wrong and "waited a second" for the morph.
     *
     * @returns {Map<Element, Element>} template kid → live kid
     */
    function alignKids(liveKids, tplKids) {
        var n = tplKids.length;
        var m = liveKids.length;
        var dp = [];
        var pairs = new Map();
        var i;
        var j;
        var s;

        for (i = 0; i <= n; i++) {
            dp[i] = [];

            for (j = 0; j <= m; j++) {
                dp[i][j] = 0;
            }
        }

        for (i = 1; i <= n; i++) {
            for (j = 1; j <= m; j++) {
                s = pairScore(liveKids[j - 1], tplKids[i - 1]);
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1], s ? dp[i - 1][j - 1] + s : 0);
            }
        }

        i = n;
        j = m;

        while (i > 0 && j > 0) {
            s = pairScore(liveKids[j - 1], tplKids[i - 1]);

            if (s && dp[i][j] === dp[i - 1][j - 1] + s) {
                pairs.set(tplKids[i - 1], liveKids[j - 1]);
                i--;
                j--;
            } else if (dp[i - 1][j] >= dp[i][j - 1]) {
                i--;
            } else {
                j--;
            }
        }

        return pairs;
    }

    /**
     * A tag still being typed: `<p` with no `>` before the next `<`, or an
     * attribute value whose quote is not closed yet. The parser then swallows
     * the markup after it, and painting that state moved a whole list into a
     * paragraph and dropped what it could not rebuild. The next keystroke
     * paints; this one waits.
     */
    function midTag(html) {
        return /<\/?[a-zA-Z][^<>"']*(?:"[^"]*"[^<>"']*|'[^']*'[^<>"']*)*(?:<|$|"[^"]*(?:<|$)|'[^']*(?:<|$))/.test(String(html || ''));
    }

    /**
     * `parentTags` are the tags the template names one level up. A live child
     * this level no longer has, but that level does, is lifted up to it rather
     * than removed — the parent's paint is still running and matches it there.
     * That is what keeps a loop's output on the page while a `</div>` is typed
     * mid-way through it. The root of a paint has no parent to hand anything to.
     */
    function morphElement(live, tpl, parentTags) {
        syncAttrs(live, tpl);
        morphChildren(live, tpl, parentTags || {});
    }

    function morphChildren(live, tpl, parentTags) {
        var doc = live.ownerDocument;
        var tplKids = elementKids(tpl);
        var tplTags = {};
        var counts = {};
        var consumed = [];
        var dynamicParent = hasMarker(directText(tpl));
        // In a static parent every child is one node for one: paired in order,
        // by how alike they are. In a dynamic one a loop may have rendered many
        // from one template child, and the pairing is by tag.
        var pairs = dynamicParent ? null : alignKids(elementKids(live), tplKids);
        var paired = new Set(pairs ? pairs.values() : []);
        var lifted;
        var i;

        tplKids.forEach(function (kid) {
            tplTags[kid.tagName] = true;
            counts[kid.tagName] = (counts[kid.tagName] || 0) + 1;
        });

        // Spoken for: painted already, or waiting for its own template child.
        function taken(kid) {
            return consumed.indexOf(kid) !== -1 || paired.has(kid);
        }

        // Always read fresh: a child's paint may have lifted nodes up to here, a
        // new wrapper may have taken some, a dropped one given its own back.
        function liveOfTag(tag) {
            return elementKids(live).filter(function (kid) {
                return kid.tagName === tag && !taken(kid);
            });
        }

        // Live children of a tag the template does not name at this level.
        function strangers() {
            return elementKids(live).filter(function (kid) {
                return !taken(kid) && !tplTags[kid.tagName];
            });
        }

        // The live node the NEXT template sibling maps to — where an insert goes.
        function anchorAfter(index) {
            var j;
            var hits;

            for (j = index + 1; j < tplKids.length; j++) {
                if (pairs && pairs.get(tplKids[j])) {
                    return pairs.get(tplKids[j]);
                }

                hits = liveOfTag(tplKids[j].tagName);

                if (hits.length) {
                    return hits[0];
                }
            }

            return null;
        }

        for (i = 0; i < tplKids.length; i++) {
            (function (tplEl, index) {
                var tag = tplEl.tagName;
                var same;
                var targets;
                var idx;
                var candidate;
                var inner;
                var wrapper;
                var fresh;
                var anchor;

                if (pairs) {
                    candidate = pairs.get(tplEl) || null;

                    if (!candidate) {
                        // A wrapper the template dropped: a live child the template no
                        // longer names, holding this tag. Its children take its place.
                        candidate = strangers().filter(function (kid) {
                            return kidTags(kid)[tag];
                        })[0];

                        if (candidate) {
                            unwrap(candidate);
                        }

                        // The next live child of this tag nobody is waiting for — one
                        // freed just now, or one the alignment had to leave out.
                        candidate = liveOfTag(tag)[0] || null;
                    }

                    same = candidate ? [candidate] : [];
                } else {
                    same = liveOfTag(tag);
                }

                if (same.length) {
                    // In a dynamic parent one template child of a tag speaks for every
                    // live child of that tag where a loop can have rendered many from
                    // one — a loop always leaves its marker in the parent's text.
                    // Otherwise one speaks for one, and a deleted sibling goes below.
                    targets = !pairs && counts[tag] === 1 ? same : [same[0]];
                    targets.forEach(function (target) {
                        consumed.push(target);
                        morphElement(target, tplEl, tplTags);
                    });

                    return;
                }

                // New wrapper: its children are already on the page, unwrapped. Before
                // the rename below — a tag around the first child is a wrapper, not
                // that child under a new name.
                inner = elementKids(tplEl);

                if (inner.length) {
                    var found = [];
                    var ok = inner.every(function (kid) {
                        var hits = liveOfTag(kid.tagName).filter(function (hit) {
                            return found.indexOf(hit) === -1;
                        });
                        var own = !isDynamic(kid) ? kid.textContent.trim() : '';

                        if (!hits.length) {
                            return false;
                        }

                        // A child that brings its own finished text is new content,
                        // not a wrapper around what is already on the page.
                        if (own && hits[0].textContent.trim() !== own) {
                            return false;
                        }

                        found.push(hits[0]);

                        return true;
                    });

                    if (ok && found.length) {
                        wrapper = buildStatic(doc, tplEl);

                        while (wrapper.firstChild) {
                            wrapper.removeChild(wrapper.firstChild);
                        }

                        if (hasMarker(wrapper.outerHTML)) {
                            return;
                        }

                        found[0].before(wrapper);
                        found.forEach(function (node) {
                            wrapper.appendChild(node);
                        });
                        consumed.push(wrapper);
                        morphElement(wrapper, tplEl, tplTags);

                        return;
                    }
                }

                // Renamed tag: an unmatched live child next to this position with the
                // same children — a leaf for a leaf, a wrapper for a wrapper. Anything
                // else is new markup, and what is on the page keeps its tag.
                candidate = strangers().filter(function (kid) {
                    return sameShape(kid, tplEl);
                })[0];
                idx = candidate ? elementKids(live).indexOf(candidate) : -1;

                if (candidate && Math.abs(idx - index) <= 1) {
                    candidate = renameTag(candidate, tag);
                    consumed.push(candidate);
                    morphElement(candidate, tplEl, tplTags);

                    return;
                }

                // New static markup: created as written. Anything the server has to
                // fill in waits for the morph.
                if (isDynamic(tplEl)) {
                    return;
                }

                fresh = buildStatic(doc, tplEl);
                anchor = anchorAfter(index);

                if (anchor) {
                    anchor.before(fresh);
                } else {
                    live.appendChild(fresh);
                }

                consumed.push(fresh);
            })(tplKids[i], i);
        }

        // Live children the template no longer has — only where nothing dynamic
        // could have put them there. One the parent's template still names goes
        // up to the parent; a dropped wrapper gives its children back; the rest go.
        if (!dynamicParent) {
            lifted = live;
            elementKids(live).forEach(function (kid) {
                if (taken(kid)) {
                    return;
                }

                if (parentTags[kid.tagName]) {
                    lifted.after(kid);
                    lifted = kid;

                    return;
                }

                if (elementKids(kid).some(function (grand) { return tplTags[grand.tagName]; })) {
                    unwrap(kid);

                    return;
                }

                kid.remove();
            });
        }

        // Leaf text: written when the template's is fully resolved. Between
        // children, text the template does not have goes — an abbreviation
        // painted a keystroke ago, before it expanded into the tag it named.
        if (!dynamicParent) {
            if (!tplKids.length && !elementKids(live).length) {
                var text = directText(tpl);

                if (text.trim() !== '' && live.textContent !== text) {
                    live.textContent = text;
                }
            } else if (tplKids.length && directText(tpl).trim() === '') {
                dropDirectText(live);
            }
        }
    }

    /**
     * Structure + classes + text in one pass. Falls back to the class-only
     * paint if the walk throws, so a bad template never breaks the preview.
     */
    function paintStructure(live, html, scopedRoot) {
        var uid;
        var ctx = null;
        var tpl = scopedRoot;
        var started = window.performance ? performance.now() : Date.now();

        if (midTag(html)) {
            trace('structure: a tag is still being typed, waiting for the next keystroke');

            return true;
        }

        try {
            uid = (outermostSid(live) || live).getAttribute('data-sid') || '';
            ctx = sectionContext(uid);
            tpl = scopedRoot || templateRoot(html, ctx);
        } catch (e) {
            trace('structure: values/template failed, classes only: ' + (e && e.message));
            tpl = scopedRoot || templateRoot(html, null);
        }

        if (!tpl || tpl.tagName !== live.tagName) {
            trace('structure: root tag mismatch ' + (tpl && tpl.tagName) + ' vs ' + live.tagName);

            return false;
        }

        try {
            morphElement(live, tpl);
            trace('structure: painted ' + live.tagName.toLowerCase() + '#' + live.id + (ctx ? ' with values' : ' without values') + ' in ' + Math.round(((window.performance ? performance.now() : Date.now()) - started) * 10) / 10 + ' ms');
        } catch (e) {
            if (!paintStructure.warned) {
                paintStructure.warned = true;
                console.warn('[sve] instant structure paint fell back to classes:', e);
            }

            syncClasses(live, tpl);
        }

        return true;
    }

    function classNames(html) {
        var out = [];
        var re = /\bclass\s*=\s*("([^"]*)"|'([^']*)')/gi;
        var match;

        while ((match = re.exec(String(html || '')))) {
            var value = (match[2] ?? match[3] ?? '').replace(/\{\{[\s\S]*?\}\}/g, ' ');
            value.split(/\s+/).forEach(function (token) {
                var name = token.trim();

                if (
                    !name ||
                    name === '[' ||
                    name === ']' ||
                    name.indexOf('{') !== -1 ||
                    name.indexOf('}') !== -1
                ) {
                    return;
                }

                if (out.indexOf(name) === -1) {
                    out.push(name);
                }
            });
        }

        return out;
    }

    function putStyle(doc, id, css) {
        if (!doc?.head) {
            return;
        }

        var style = doc.getElementById(id);

        if (!css) {
            style?.remove();
            return;
        }

        if (!style) {
            style = doc.createElement('style');
            style.id = id;
            doc.head.appendChild(style);
        }

        if (style.textContent !== css) {
            style.textContent = css;
        }
    }

    /**
     * The live Tailwind sheet: the file's whole class list, built by the same
     * compiler the save uses, in one unlayered <style> that stays last in
     * <head> — exactly the shape `{{ sve_tw }}` pushes after the save.
     *
     * It used to be one rule per new class inside `@layer tokens`, which loses
     * to the site's own utilities layer: `px-900` on a tag that also carried
     * `wrapper` did nothing until the bake arrived a second later, while a
     * class with no such neighbour showed at once. Same sheet, same layer, no
     * "sometimes".
     */
    var twState = null;
    var twStateWait = null;
    var twBuild = null;
    var twLastKey = '';
    var twLastCss = '';

    function setLiveTw(doc, css) {
        if (!doc?.head) {
            return;
        }

        var style = doc.getElementById(STYLE_TW_ID);

        if (!css) {
            style?.remove();
            return;
        }

        if (!style) {
            style = doc.createElement('style');
            style.id = STYLE_TW_ID;
        }

        if (style.textContent !== css) {
            style.textContent = css;
        }

        // Last in <head>, always — a morph may have pushed a newer sve_tw
        // <style> after it, and the sheet being typed must win.
        if (doc.head.lastElementChild !== style) {
            doc.head.appendChild(style);
        }
    }

    function injectLive(doc, html) {
        if (!doc) {
            return;
        }

        if (!twState || !twBuild) {
            loadCompiler().then(function () {
                var next = previewDocument();

                if (next && twState && twBuild) {
                    injectLive(next, fullHtml() || paneText('html'));
                }
            });

            return;
        }

        var started = performance.now();
        var key = classNames(html).join(' ');
        var css;

        // Only the classes reach the compiler. A keystroke in text keeps the
        // sheet and just puts it back last in <head>, where a morph may have
        // pushed a newer sve_tw <style> after it.
        if (key === twLastKey) {
            setLiveTw(doc, twLastCss);

            return;
        }

        try {
            css = twBuild(twState, String(html || ''));
        } catch (e) {
            trace('tw: build failed: ' + (e && e.message));
            return;
        }

        twLastKey = key;
        twLastCss = css;
        setLiveTw(doc, css);
        trace('tw: built live sheet (' + css.length + ' B) in ' + (performance.now() - started).toFixed(1) + ' ms');
    }

    function loadCompiler() {
        if (twState) {
            return Promise.resolve(twState);
        }

        if (twStateWait) {
            return twStateWait;
        }

        var url = cfg('sveTwCompile', '');

        if (!url || !featureOn('tailwind_dock')) {
            trace('tw: compiler not loaded (' + (url ? 'tailwind_dock is off' : 'no sveTwCompile url') + ')');
            return Promise.resolve(null);
        }

        var started = performance.now();

        twStateWait = import(url)
            .then(function (mod) {
                if (!mod?.loadTailwindCompiler || !mod.buildTailwind) {
                    trace('tw: ' + url + ' has no loadTailwindCompiler/buildTailwind — an older chunk?');
                    return null;
                }

                twBuild = mod.buildTailwind;

                return mod.loadTailwindCompiler(window);
            })
            .then(function (state) {
                twState = state || null;

                if (twState) {
                    trace('tw: compiler ready in ' + (performance.now() - started).toFixed(0) + ' ms');
                }

                return twState;
            })
            .catch(function (e) {
                trace('tw: compiler failed to load: ' + (e && e.message));
                twStateWait = null;
                return null;
            });

        return twStateWait;
    }

    function bindPreview(doc) {
        var win = doc.defaultView;

        if (!win || win.__sveInstantUpdated) {
            return;
        }

        win.__sveInstantUpdated = true;
        win.addEventListener('statamic:preview-updated', function () {
            if (painting) {
                return;
            }

            lastHtml = null;

            paint();
        });
    }

    function bindIframe() {
        var iframe = document.getElementById('live-preview-iframe');

        if (!iframe) {
            return;
        }

        if (!iframe.__sveInstantLoad) {
            iframe.__sveInstantLoad = true;
            iframe.addEventListener('load', function () {
                lastHtml = null;
                lastSid = '';
                schedulePaint();
            });
        }

        var doc = previewDocument();

        if (doc) {
            bindPreview(doc);
        }
    }

    function htmlScoped() {
        var dock = document.getElementById(DOCK_ID);

        return !!(dock && dock.hasAttribute('data-sve-html-scoped'));
    }

    function spliceOnce(haystack, needle, replacement) {
        var at = haystack.indexOf(needle);

        if (at === -1) {
            return haystack;
        }

        return haystack.slice(0, at) + replacement + haystack.slice(at + needle.length);
    }

    function isFileRoot(html) {
        if (htmlScoped()) {
            return false;
        }

        return (
            /\bsection_orderable\b/.test(html) ||
            /\bsve_tw\b/.test(html) ||
            /\bstyle_push\b/.test(html) ||
            /\bvisual_edit\b/.test(html)
        );
    }

    /**
     * The whole file with the pane's current text spliced into the scoped
     * range, from what the dock exposes on its element (`__sveHtmlScope`:
     * the file as of its last sync and the range the pane shows). Null when
     * the dock is older than this script or the pane is not scoped.
     */
    function scopedFull() {
        var dock = document.getElementById(DOCK_ID);
        var scope = dock && dock.__sveHtmlScope;
        var pane;

        if (!scope || typeof scope.full !== 'string' || typeof scope.from !== 'number' || typeof scope.to !== 'number') {
            return null;
        }

        if (scope.from < 0 || scope.to < scope.from || scope.to > scope.full.length) {
            return null;
        }

        pane = paneText('html');

        return {
            full: scope.full.slice(0, scope.from) + pane + scope.full.slice(scope.to),
            at: scope.from,
        };
    }

    function fullHtml() {
        var pane = paneText('html');
        var scoped;

        if (!htmlScoped()) {
            lastFullHtml = pane;
            lastSnippet = '';

            return pane;
        }

        // The dock says where the slice sits: the whole file is always known,
        // and a `<p>` typed beside the scoped one is painted in its section.
        scoped = scopedFull();

        if (scoped) {
            lastFullHtml = scoped.full;
            lastSnippet = pane;

            return scoped.full;
        }

        if (!lastFullHtml) {
            if (isFileRoot(pane)) {
                lastFullHtml = pane;
                lastSnippet = '';

                return pane;
            }

            return '';
        }

        if (pane && lastFullHtml.indexOf(pane) !== -1) {
            lastSnippet = pane;

            return lastFullHtml;
        }

        if (lastSnippet && lastFullHtml.indexOf(lastSnippet) !== -1) {
            lastFullHtml = spliceOnce(lastFullHtml, lastSnippet, pane);
            lastSnippet = pane;

            return lastFullHtml;
        }

        return lastFullHtml;
    }

    function htmlCmView() {
        return paneView('html');
    }

    function twPaneTag() {
        var btn = document.querySelector('.sve-tw-tag');
        var text = ((btn && btn.textContent) || '').replace(/[<>]/g, '').trim();

        return text ? text.toUpperCase() : '';
    }

    function tagAtHtmlCursor() {
        var view = htmlCmView();
        var html;
        var pos;
        var re;
        var match;
        var stack;
        var name;

        if (!view) {
            return null;
        }

        html = view.state.doc.toString();
        pos = view.state.selection.main.from;
        re = /<\/?([a-zA-Z][a-zA-Z0-9:-]*)\b[^>]*>/g;
        stack = [];

        while ((match = re.exec(html)) && match.index < pos) {
            name = match[1];

            if (match[0][1] === '/') {
                stack.pop();
                continue;
            }

            if (!/\/>$/.test(match[0])) {
                stack.push({ tag: name.toUpperCase(), open: match[0] });
            }
        }

        return stack.length ? stack[stack.length - 1] : null;
    }

    function liveByPath(doc, el) {
        var path;
        var list;

        if (!el) {
            return [];
        }

        path = el.getAttribute('data-sve-ht-path');

        if (!path) {
            return [el];
        }

        try {
            list = doc.querySelectorAll('[data-sve-ht-path="' + CSS.escape(path) + '"]');
        } catch (e) {
            return [el];
        }

        return list.length ? Array.prototype.slice.call(list) : [el];
    }

    function pickedLive(doc, tpl) {
        var tag = twPaneTag() || (tpl && tpl.tagName) || '';
        var at = tagAtHtmlCursor();
        var active = doc.querySelector('[data-sid-active]');
        var root;
        var hits;
        var inner;

        if (at && at.tag) {
            tag = at.tag;
        }

        if (active && (!tag || active.tagName === tag)) {
            return liveByPath(doc, active);
        }

        root = tpl ? fileRootLive(doc, templateRoot(fullHtml() || paneText('html')) || tpl) : null;

        if (active && tag && active.tagName !== tag) {
            inner = active.querySelector(tag.toLowerCase());

            if (inner) {
                return liveByPath(doc, inner);
            }
        }

        if (!root || !tag) {
            return active ? [active] : [];
        }

        hits = [];

        if (root.tagName === tag) {
            hits.push(root);
        }

        Array.prototype.push.apply(hits, root.querySelectorAll(tag.toLowerCase()));

        if (hits.length === 1) {
            return liveByPath(doc, hits[0]);
        }

        if (tpl && tpl.tagName === tag) {
            inner = hits.filter(function (el) {
                var live = classValue(el.getAttribute('class') || '');
                var want = classValue(tpl.getAttribute('class') || '');

                return !want || live === want || (' ' + live + ' ').indexOf(' ' + want + ' ') !== -1;
            });

            if (inner.length) {
                return liveByPath(doc, inner[0]);
            }
        }

        return hits[0] ? liveByPath(doc, hits[0]) : [];
    }

    /**
     * The live elements of a scoped pane's root: by its place in the file when
     * the file is known, else by its tag in the active section.
     */
    function scopedRootLive(doc, pane) {
        var scoped = scopedFull();
        var full = scoped ? scoped.full : fullHtml();
        var snippetAt = scoped ? scoped.at : full ? full.indexOf(pane) : -1;
        var into = intoRootTag(pane);

        if (snippetAt === -1) {
            return liveForOffset(doc, pane, into, true).targets;
        }

        return liveForOffset(doc, full, snippetAt + into, false).targets;
    }

    /**
     * An offset inside the snippet's root tag, past its name: the point before
     * the tag's `>`, which `templatePathAt` reads as "in this element". Used
     * to be `<` + 1, where there is no name yet — the path came back null and
     * the snippet's root was never found. Antlers is blanked first, so a `>`
     * inside `{{ }}` does not end the tag early.
     */
    function intoRootTag(html) {
        var masked = String(html).replace(/\{\{[\s\S]*?\}\}/g, function (m) {
            return new Array(m.length + 1).join(' ');
        });
        var name = /^\s*<[a-zA-Z][\w:-]*/.exec(masked);
        var gt = masked.indexOf('>');

        if (!name) {
            return 1;
        }

        return gt === -1 ? name[0].length : gt;
    }

    /** Every place the open component renders, as the preview marks them, of the file root's tag. */
    function componentInstances(doc, root) {
        var marked = doc.querySelectorAll('[data-sve-component-focused]');
        var out = [];
        var i;

        for (i = 0; i < marked.length; i++) {
            if (marked[i].tagName === root.tagName) {
                out.push(marked[i]);
            }
        }

        return out;
    }

    /**
     * `snippetOnly`: the pane is a slice of a file this script does not have.
     * A scoped pane whose file is known paints like the whole file: the
     * section is morphed from the file with the slice spliced in, so a
     * sibling typed beside the scoped tag, a wrapper around it or a tag
     * renamed all land where they belong. That holds when the slice IS the
     * whole file too — the section's own row picked in the tree, the pane
     * and the file one and the same text. That case used to be read as a
     * snippet with no file (the two texts were equal), and then nothing typed
     * in it was painted, not even a static tag; every child of the section
     * waited for the morph while the same edit painted at once with the
     * child's own row picked. Only a snippet with no file to sit in is
     * painted on its own.
     */
    function paintLive(doc, html, snippetOnly) {
        var pane = paneText('html');
        var root;
        var live;
        var focused;
        var tpl;
        var i;
        var targets;

        if (snippetOnly) {
            root = templateRoot(pane);
            targets = scopedRootLive(doc, pane);

            if (root && targets.length && targets[0].tagName === root.tagName) {
                targets.forEach(function (el) {
                    var scoped = templateRoot(pane, sectionContext((outermostSid(el) || el).getAttribute('data-sid') || ''));

                    if (!scoped || !paintStructure(el, pane, scoped)) {
                        syncClasses(el, root);
                    }
                });
            }

            return;
        }

        root = templateRoot(html);

        if (!root) {
            return;
        }

        // The open file is a component: the preview marks every place it
        // renders, and every one is painted — a card typed once is on the page
        // eight times. Structure and classes, like a section; the text of a
        // `{{ props_* }}` is the caller's and waits for the morph. Used to be
        // classes only here, so a new tag in a component waited a second.
        focused = componentInstances(doc, root);

        if (focused.length) {
            tpl = templateRoot(html, null);

            for (i = 0; i < focused.length; i++) {
                if (!paintStructure(focused[i], html, tpl)) {
                    syncClasses(focused[i], root);
                }
            }

            return;
        }

        live = fileRootLive(doc, root);

        if (!live) {
            trace('paintLive: no live root for <' + root.tagName.toLowerCase() + '>');
        }

        if (live && live.tagName === root.tagName) {
            if (!paintStructure(live, html, null)) {
                syncClasses(live, root);
            }

            return;
        }

        targets = pickedLive(doc, root);

        if (targets.length && targets[0].tagName === root.tagName) {
            syncClasses(targets[0], root);
        }
    }

    var lastPath = '';

    /** The dock moved to another file: nothing remembered about the last one holds. */
    function forgetOtherFile() {
        var el = document.querySelector('#' + DOCK_ID + ' [data-sve-code-path]');
        var path = el ? (el.textContent || '').trim() : '';

        if (path === lastPath) {
            return;
        }

        lastPath = path;
        lastHtml = null;
        lastSid = '';
        lastFullHtml = '';
        lastSnippet = '';
    }

    /**
     * The CSS to hold live. The whole pane when the pane is the whole sheet.
     * When the pane is a slice — the HTML pane is scoped, so the CSS pane
     * shows the picked tag's rules — the sheet the dock exposes comes first
     * and the slice after it: an edited rule wins over its older copy and the
     * rest of the sheet stays. Used to keep the last whole sheet while
     * scoped, so a CSS keystroke there waited for the morph. An older dock
     * exposes nothing, and then the last whole sheet still stays.
     */
    function liveCss() {
        var dock;
        var scope;

        if (!htmlScoped()) {
            return paneText('css');
        }

        dock = document.getElementById(DOCK_ID);
        scope = dock && dock.__sveHtmlScope;

        if (!scope || typeof scope.css !== 'string') {
            return lastCss;
        }

        return scope.css + '\n' + paneText('css');
    }

    /** The section the dock is on, as the page loop hands its partial the row — for the CSS pane's `{{ id }}` and friends. */
    function cssContext(doc) {
        var section;

        try {
            section = pageSection(doc);

            return section ? sectionContext(section.getAttribute('data-sid') || '') : null;
        } catch (e) {
            return null;
        }
    }

    /**
     * The CSS pane as it can go into the live sheet.
     *
     * The pane holds Antlers: `#id-{{ id }}`, `{{ responsive_css }}`,
     * `--grid-cols: {{ cols }}`. Injected raw, a normal declaration with a tag
     * in it is invalid and the browser drops it. A custom property takes any
     * tokens, so `--grid-cols: {{ cols }}` was a valid declaration, sat last
     * in <head>, won over the rendered `--grid-cols: 6` from style_push, and
     * the media textbox's grid fell to one column the moment the dock opened.
     *
     * Fields the row knows are filled in, unescaped (this is CSS, not HTML).
     * Every declaration still holding a tag goes, custom property or not, so
     * the value the server rendered keeps standing. What is left of a tag
     * elsewhere — a selector, a media query, `{{ responsive_css }}` on its
     * own line — is removed too: a selector that misses matches nothing, a
     * bare tag would otherwise swallow the next rule as its prelude.
     */
    function cssForLive(css, ctx) {
        var text = String(css || '')
            .replace(/\{\{#[\s\S]*?#\}\}/g, '')
            .replace(/\{\{[\s\S]*?\}\}/g, function (tag) {
                var value = resolveField(tag.slice(2, -2), ctx);

                return value === null ? ANT : String(value);
            });

        return text
            .replace(/(^|[;{}\s])([\w-]+)\s*:\s*[^;{}]*\uE000[^;{}]*(;|(?=\}))/g, '$1')
            .replace(/\uE000/g, '');
    }

    function paint() {
        if (painting || !featureOn('template_dock') || !document.getElementById(DOCK_ID)) {
            return;
        }

        if (instantMode() !== 'astro') {
            return;
        }

        forgetOtherFile();

        var pane = paneText('html');
        var scoped = htmlScoped();
        // The whole file when it is known: the pane itself, or the file the
        // dock exposes with the pane's slice spliced in. A scoped pane that has
        // never shown the file's root has no whole file to give, and then the
        // snippet is painted on its own rather than not at all.
        var file = isFileRoot(pane) || scoped ? fullHtml() : '';
        var html = file || pane;
        var css = liveCss();
        var doc = previewDocument();

        if (!doc) {
            trace('paint: no preview document');

            return;
        }

        if (!html) {
            trace('paint: nothing to paint (scoped=' + scoped + ', file root=' + isFileRoot(pane) + ')');
        }

        bindPreview(doc);

        if (css !== lastCss) {
            lastCss = css;
            putStyle(doc, STYLE_CSS_ID, cssForLive(css, cssContext(doc)));
        }

        if (!html || html === lastHtml) {
            return;
        }

        lastHtml = html;
        painting = true;

        injectLive(doc, fullHtml() || html);

        if (!twSuggestOpen()) {
            dropTwHold();
        }

        try {
            paintLive(doc, html, scoped && !file);
            reholdTw(doc);
        } catch (e) {
            // Never leave `painting` stuck: that would silence every later paint
            // and make the dock feel like the morph is all there is.
            trace('paint: threw ' + (e && e.message));
        } finally {
            painting = false;
        }
    }

    // ---- One tag in the dock, its elements in the preview ---------------------

    var VOID_TAGS = {
        AREA: 1, BASE: 1, BR: 1, COL: 1, EMBED: 1, HR: 1, IMG: 1, INPUT: 1,
        LINK: 1, META: 1, PARAM: 1, SOURCE: 1, TRACK: 1, WBR: 1,
    };

    /** Index path, element kids only, from `root` down to `el`; null when `el` is not under `root`. */
    function indexPath(root, el) {
        var path = [];
        var node = el;
        var parent;
        var idx;

        while (node && node !== root) {
            parent = node.parentElement;

            if (!parent) {
                return null;
            }

            idx = elementKids(parent).indexOf(node);

            if (idx === -1) {
                return null;
            }

            path.unshift(idx);
            node = parent;
        }

        return node === root ? path : null;
    }

    function elementAtPath(root, path) {
        var el = root;
        var i;

        for (i = 0; el && i < path.length; i++) {
            el = elementKids(el)[path[i]] || null;
        }

        return el;
    }

    /**
     * The template element the caret is in, as an index path from the root.
     *
     * The text up to the caret is parsed with a sentinel appended: the browser
     * puts it inside whatever element is open there, with the same nesting
     * rules as the template the paint walks. A caret inside a tag
     * (`<div class="bg-pr|">`) counts as in that element — the text is cut at
     * its `<` and the tag closed for the parse; inside a closing tag it is the
     * element being closed; inside a void tag (`<img …|`) the tag itself.
     */
    function templatePathAt(html, pos, ctx) {
        var head = String(html).slice(0, pos);
        var masked = head.replace(/\{\{[\s\S]*?\}\}/g, function (m) {
            return new Array(m.length + 1).join(' ');
        });
        var lt = masked.lastIndexOf('<');
        var gt = masked.lastIndexOf('>');
        var open = null;
        var tag;
        var wrap;
        var sentinel;
        var root;
        var el;
        var i;

        if (lt > gt) {
            if (head[lt + 1] === '/') {
                // Inside a closing tag, its name maybe still to come: the element
                // being closed is the one still open at the `<`.
                head = head.slice(0, lt);
            } else {
                tag = /^<([a-zA-Z][\w:-]*)/.exec(head.slice(lt));

                if (!tag) {
                    return null;
                }

                open = tag[1].toUpperCase();
                head = head.slice(0, lt) + '<' + tag[1] + '>';
            }
        }

        wrap = document.createElement('div');
        wrap.innerHTML = stripAntlers(head, ctx) + '<i data-sve-caret></i>';
        sentinel = wrap.querySelector('[data-sve-caret]');

        for (i = 0; i < wrap.children.length; i++) {
            if (wrap.children[i].tagName !== 'STYLE' && wrap.children[i].tagName !== 'SCRIPT' && wrap.children[i] !== sentinel) {
                root = wrap.children[i];
                break;
            }
        }

        if (!sentinel || !root) {
            return null;
        }

        el = open && VOID_TAGS[open] ? sentinel.previousElementSibling : sentinel.parentElement;
        sentinel.remove();

        return el && el !== wrap ? indexPath(root, el) : null;
    }

    /**
     * The live elements paired with `wanted`, walking template and live the way
     * the structure paint does: same tag in order; in a parent that holds a
     * loop's marker, one template child for every live child of its tag.
     */
    function pairLive(live, tpl, wanted) {
        var tplKids = elementKids(tpl);
        var counts = {};
        var seen = {};
        var consumed = [];
        var dynamicParent = hasMarker(directText(tpl));
        var out = [];
        var i;
        var tplEl;
        var tag;
        var same;
        var targets;

        if (tpl === wanted) {
            return [live];
        }

        tplKids.forEach(function (kid) {
            counts[kid.tagName] = (counts[kid.tagName] || 0) + 1;
        });

        for (i = 0; i < tplKids.length; i++) {
            tplEl = tplKids[i];
            tag = tplEl.tagName;
            seen[tag] = (seen[tag] || 0) + 1;
            same = elementKids(live).filter(function (kid) {
                return kid.tagName === tag && consumed.indexOf(kid) === -1;
            });

            if (!same.length) {
                continue;
            }

            targets = counts[tag] === 1 && dynamicParent ? same : [same[Math.min(seen[tag] - 1, same.length - 1)]];
            targets.forEach(function (target) {
                consumed.push(target);
            });

            if (tplEl === wanted) {
                return targets;
            }

            if (tplEl.contains(wanted)) {
                targets.forEach(function (target) {
                    out = out.concat(pairLive(target, tplEl, wanted));
                });

                return out;
            }
        }

        return out;
    }

    /**
     * The snippet a scoped pane shows, when the file it sits in is not known:
     * the active section if it is that tag, else the first such tag in it.
     * The one place left where a tag name has to do — a snippet on its own has
     * no file to be found in.
     */
    function snippetRootLive(doc, tplRoot) {
        var tag = tplRoot.tagName;
        var active = doc.querySelector('[data-sid-active]');
        var section = pageSection(doc);
        var host = active || section;
        var inner;

        if (!host) {
            return [];
        }

        if (host.tagName === tag) {
            return [host];
        }

        inner = host.querySelector(tag.toLowerCase());

        return inner ? [inner] : [];
    }

    /**
     * The live elements for the tag at `at` in `html`: `{ targets, tag }`.
     * `html` is the whole file when it is known, and then the section is
     * found as the paint finds it; a snippet on its own goes through
     * `snippetRootLive`.
     */
    function liveForOffset(doc, html, at, snippetOnly) {
        var tplRoot = templateRoot(html, null);
        var roots;
        var path;
        var tplEl;
        var targets = [];

        if (!tplRoot) {
            return { targets: [], tag: '' };
        }

        roots = snippetOnly ? snippetRootLive(doc, tplRoot) : [fileRootLive(doc, tplRoot)].filter(Boolean);
        path = templatePathAt(html, at, null);
        tplEl = path ? elementAtPath(tplRoot, path) : null;

        if (!tplEl || !roots.length) {
            return { targets: [], tag: tplEl ? tplEl.tagName : '' };
        }

        roots.forEach(function (root) {
            if (root.tagName === tplRoot.tagName) {
                targets = targets.concat(pairLive(root, tplRoot, tplEl));
            }
        });

        return { targets: targets, tag: tplEl.tagName };
    }

    /**
     * Where the HTML caret is, in the preview. The strip shows the tag the
     * caret is in, so this is the answer for its lists too.
     */
    function liveAtCaret(doc) {
        var view = paneView('html');
        var pane;
        var pos;
        var full;
        var snippetAt;
        var scoped;

        if (!view) {
            return { targets: [], tag: '' };
        }

        pane = view.state.doc.toString();
        pos = view.state.selection.main.head;

        if (!htmlScoped()) {
            return liveForOffset(doc, pane, pos, false);
        }

        scoped = scopedFull();
        full = scoped ? scoped.full : fullHtml();
        snippetAt = scoped ? scoped.at : full ? full.indexOf(pane) : -1;

        if (snippetAt === -1) {
            return liveForOffset(doc, pane, pos, true);
        }

        return liveForOffset(doc, full, snippetAt + pos, false);
    }

    var twHold = null;
    var twHeldKey = '';
    /** The hold as asked for, so a paint or a morph in between can be followed by the same hold on the fresh elements. */
    var twHoldRequest = null;

    /**
     * Show a class the way accepting it would: the rule in the live sheet,
     * the class on the tag. One compiler and one sheet, the same as a paint
     * after a keystroke — so `py-700` next to `p-500` resolves as it will in
     * the baked file, and a colour nobody has used yet brings its `--color-*`
     * variable along. `valueFor(el, original)` says what the tag's class
     * attribute becomes; `key` tells one hold from the next.
     */
    function holdTw(doc, request) {
        var targets = request.find(doc);
        var valueFor = request.valueFor;
        var key = request.key;
        var candidate = request.candidate;
        var i;
        var el;
        var original;

        if (!doc || !targets.length || instantMode() !== 'astro') {
            return;
        }

        if (twHeldKey === key && twHold) {
            return;
        }

        restoreTwHold();
        twHoldRequest = request;

        if (twState && twBuild) {
            try {
                setLiveTw(doc, twBuild(twState, '<i class="' + candidate + '">'));
            } catch (e) {
                trace('tw: hold build failed: ' + (e && e.message));
            }
        } else {
            loadCompiler().then(function () {
                var next = previewDocument();

                if (next && twState && twBuild && twHeldKey === key) {
                    setLiveTw(next, twBuild(twState, '<i class="' + candidate + '">'));
                }
            });
        }

        twHold = [];

        for (i = 0; i < targets.length; i++) {
            el = targets[i];
            original = el.getAttribute('class') || '';
            el.setAttribute('class', valueFor(el, original));
            twHold.push({ el: el, original: original });
        }

        twHeldKey = key;
        trace('tw: holding ' + key + ' on ' + targets.length + ' element(s)');
    }

    function restoreTwHold() {
        var i;
        var item;

        if (!twHold) {
            twHeldKey = '';
            return;
        }

        for (i = 0; i < twHold.length; i++) {
            item = twHold[i];

            if (!item.el || !item.el.isConnected) {
                continue;
            }

            if (item.original) {
                item.el.setAttribute('class', item.original);
            } else {
                item.el.removeAttribute('class');
            }
        }

        twHold = null;
        twHeldKey = '';
        twHoldRequest = null;
    }

    /** Forget the hold and leave the tag as it is: what it shows is about to be written. */
    function dropTwHold() {
        twHold = null;
        twHeldKey = '';
        twHoldRequest = null;
    }

    /**
     * After a paint or a morph the tag carries the file's classes again, and
     * the elements may be new ones: the same hold is put back, from what was
     * asked for, as long as the list is still open.
     */
    function reholdTw(doc) {
        var request = twHoldRequest;

        if (!request || !twSuggestOpen()) {
            return;
        }

        twHold = null;
        twHeldKey = '';
        holdTw(doc, request);
    }

    /**
     * The strip's add list, a chip's menu and the icon row (tw-classes.js
     * `previewAdd` / `previewChip` / `previewSet`): `{ path, value }` is the
     * tag and the class value Enter would write; `{ keep: true }` says it is
     * being written; no detail means the list moved off or closed. The tag is
     * the one the HTML caret is in — the strip renders from that caret — so
     * the elements are found exactly as for the HTML pane's own list.
     */
    function onTwPreview(event) {
        var detail = event && event.detail;
        var doc = previewDocument();

        if (!detail) {
            restoreTwHold();
            return;
        }

        if (detail.keep) {
            dropTwHold();
            return;
        }

        if (!doc || typeof detail.value !== 'string' || !hoverPreviewOn()) {
            return;
        }

        holdTw(doc, {
            find: twLiveTargets,
            valueFor: function () {
                return detail.value;
            },
            key: 'strip:' + (detail.path || '') + ':' + detail.value,
            candidate: detail.value,
        });
    }

    /**
     * The HTML pane's completion list: accepting inserts the name where the
     * cursor is, inside the tag's class attribute, so it joins the others.
     */
    function previewTwClass(name) {
        var doc = previewDocument();

        name = String(name || '').trim();

        if (!name || !doc || !hoverPreviewOn()) {
            return;
        }

        holdTw(doc, {
            find: twLiveTargets,
            valueFor: function (el, original) {
                return original ? original + ' ' + name : name;
            },
            key: 'complete:' + name,
            candidate: name,
        });
    }

    function twLiveTargets(doc) {
        var found = liveAtCaret(doc);

        if (!found.targets.length) {
            trace('tw: no live element for the caret' + (found.tag ? ' (<' + found.tag.toLowerCase() + '>)' : ''));
        }

        return found.targets;
    }

    function optionClassName(el) {
        var label = el && el.querySelector('[data-sve-tw-label], .cm-completionLabel');

        if (label) {
            return (label.textContent || '').trim();
        }

        return ((el && el.getAttribute('aria-label')) || (el && el.textContent) || '').trim();
    }

    function watchTwSuggest() {
        if (document.__sveTwSuggestWatch === 5) {
            return;
        }

        document.__sveTwSuggestWatch = 5;
        document.addEventListener('sve:tw-preview', onTwPreview);

        // The HTML pane's completion list is CodeMirror's: hover and the
        // arrows are read off it, since it cannot say what it is on.
        document.addEventListener(
            'mouseover',
            function (event) {
                var option =
                    event.target &&
                    event.target.closest &&
                    event.target.closest('.cm-tooltip.sve-tw-complete li');

                if (option) {
                    previewTwClass(optionClassName(option));
                }
            },
            true
        );

        document.addEventListener(
            'keydown',
            function (event) {
                if (event.key === 'Escape') {
                    restoreTwHold();
                    return;
                }

                if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') {
                    return;
                }

                window.requestAnimationFrame(function () {
                    var active = document.querySelector('.cm-tooltip.sve-tw-complete li[aria-selected]');

                    if (active) {
                        previewTwClass(optionClassName(active));
                    }
                });
            },
            true
        );
    }

    function twSuggestOpen() {
        return !!(
            document.getElementById('__sve-tw-menu') ||
            document.querySelector('.cm-tooltip.sve-tw-complete')
        );
    }

    function schedulePaint() {
        if (raf) {
            return;
        }

        raf = window.requestAnimationFrame(function () {
            raf = 0;
            paint();
        });
    }

    function watchPanes(dock) {
        ['html', 'css'].forEach(function (handle) {
            var content = dock.querySelector(
                '[data-sve-code-pane="' + handle + '"] .cm-content'
            );

            if (!content || content.__sveInstantWatch === 4) {
                return;
            }

            content.__sveInstantWatch = 4;
            content.addEventListener('input', schedulePaint, true);
            new MutationObserver(schedulePaint).observe(content, {
                subtree: true,
                childList: true,
                characterData: true,
            });
        });
    }

    function watchDock() {
        var dock = document.getElementById(DOCK_ID);

        if (!dock) {
            lastHtml = null;
            lastCss = '';
            lastFullHtml = '';
            lastSnippet = '';
            return;
        }

        watchPanes(dock);
        ensureToggle(dock);
        ensureTwDocs(dock);
        watchTwSuggest();

        if (dock.__sveInstantWatch) {
            return;
        }

        dock.__sveInstantWatch = true;
        loadCompiler();
        bindIframe();
        dock.addEventListener('input', schedulePaint, true);
        dock.addEventListener('keyup', schedulePaint, true);
        schedulePaint();
    }

    function observeShell() {
        var shell = document.querySelector('.live-preview');

        if (!shell || shell.__sveInstantShell) {
            return;
        }

        shell.__sveInstantShell = true;
        new MutationObserver(function () {
            watchDock();
            bindIframe();
        }).observe(shell, { childList: true });
    }

    function boot() {
        if (booted) {
            return;
        }

        if (!window.Statamic || !Statamic.$config) {
            return;
        }

        var features = cfg('sveFeatures', null);

        if (!features) {
            return;
        }

        if (features.template_dock !== true) {
            booted = true;
            return;
        }

        booted = true;
        trackContainers();
        watchDock();
        bindIframe();
        observeShell();
        window.setInterval(function () {
            observeShell();
            watchDock();
            bindIframe();
        }, 1000);
    }

    function start() {
        if (window.Statamic && typeof Statamic.booting === 'function') {
            Statamic.booting(boot);
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', boot);
        } else {
            boot();
        }

        window.setTimeout(boot, 0);
        window.setTimeout(boot, 300);
    }

    start();
})();
