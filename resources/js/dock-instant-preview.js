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
 * Astro/Vite updates CSS in place. The dock does the same for classes: the
 * design system already in the Control Panel answers for one class
 * (milliseconds), the rule is appended to the iframe, then the class attribute
 * is swapped. The PHP morph still saves in the background. It is not on the
 * paint path.
 */
(function () {
    'use strict';

    if (window.__sveDockInstantPreview === 9) {
        return;
    }
    window.__sveDockInstantPreview = 9;

    var DOCK_ID = '__sve-code-dock';
    var STYLE_TW_ID = '__sve-tw-dock-live';
    var STYLE_TW_HOVER_ID = '__sve-tw-hover-live';
    var STYLE_CSS_ID = '__sve-dock-css-live';
    var MODE_KEY = 'sveInstantPreview';
    var MODE_STYLE_ID = '__sve-instant-mode-style';
    var ANT = '\uE000';

    var raf = 0;
    var lastHtml = null;
    var lastCss = '';
    var lastSid = '';
    var served = Object.create(null);
    var design = null;
    var designWait = null;
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
                'border-radius:0 5px 5px 0;' +
            '}' +
            '#' + DOCK_ID + ' [data-sve-instant-mode] button[aria-pressed="true"]{' +
                'opacity:1;color:#93c5fd;background:rgba(56,88,233,.22);' +
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

        Array.prototype.forEach.call(group.querySelectorAll('button'), function (button) {
            button.setAttribute(
                'aria-pressed',
                button.getAttribute('data-sve-instant') === mode ? 'true' : 'false'
            );
        });
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

        before = bar.querySelector('[data-sve-code-autosave]');

        if (before) {
            bar.insertBefore(group, before);
        } else {
            bar.appendChild(group);
        }

        paintToggle();
        ensureTwDocs(dock);
    }

    function paneText(handle) {
        var pane = document.querySelector(
            '#' + DOCK_ID + ' [data-sve-code-pane="' + handle + '"] .cm-content'
        );

        if (!pane) {
            return '';
        }

        var lines = pane.querySelectorAll('.cm-line');

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

    function syncAttrs(live, tpl) {
        var i;
        var attr;

        for (i = 0; i < tpl.attributes.length; i++) {
            attr = tpl.attributes[i];

            if (isServerAttr(attr.name) || hasMarker(attr.value)) {
                continue;
            }

            if (attr.name === 'class') {
                applyClass(live, attr.value);
                continue;
            }

            // Alpine strips x-cloak on init; putting it back would hide the node.
            if (attr.name === 'x-cloak') {
                continue;
            }

            if (live.getAttribute(attr.name) !== attr.value) {
                live.setAttribute(attr.name, attr.value);
            }
        }

        // Attributes the template no longer has are left for the morph: the
        // page's own JS (Alpine, sliders) adds attributes of its own, and taking
        // those away mid-edit breaks the page for no gain.
    }

    /** A fresh element from the template, scrubbed of anything the server owns. */
    function buildStatic(doc, tplEl) {
        var el = doc.importNode(tplEl, true);
        var scripts = el.querySelectorAll('script, style, template');
        var i;

        for (i = scripts.length - 1; i >= 0; i--) {
            scripts[i].remove();
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

    function morphElement(live, tpl) {
        syncAttrs(live, tpl);
        morphChildren(live, tpl);
    }

    function morphChildren(live, tpl) {
        var doc = live.ownerDocument;
        var tplKids = elementKids(tpl);
        var liveKids = elementKids(live);
        var tplTags = {};
        var counts = {};
        var seen = {};
        var consumed = [];
        var dynamicParent = hasMarker(directText(tpl));
        var i;

        tplKids.forEach(function (kid) {
            tplTags[kid.tagName] = true;
            counts[kid.tagName] = (counts[kid.tagName] || 0) + 1;
        });

        function liveOfTag(tag) {
            return liveKids.filter(function (kid) {
                return kid.tagName === tag && consumed.indexOf(kid) === -1;
            });
        }

        // The live node the NEXT template sibling maps to — where an insert goes.
        function anchorAfter(index) {
            var j;
            var hits;

            for (j = index + 1; j < tplKids.length; j++) {
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
                var same = liveOfTag(tag);
                var targets;
                var idx;
                var candidate;
                var inner;
                var wrapper;
                var fresh;
                var anchor;

                seen[tag] = (seen[tag] || 0) + 1;

                if (same.length) {
                    // One template child of a tag speaks for every live child of that
                    // tag: a loop renders many from one.
                    targets = counts[tag] === 1 ? same : [same[Math.min(seen[tag] - 1, same.length - 1)]];
                    targets.forEach(function (target) {
                        consumed.push(target);
                        morphElement(target, tplEl);
                    });

                    return;
                }

                // Renamed tag: the live child at this position has a tag the template
                // no longer mentions at all.
                candidate = liveKids.filter(function (kid) {
                    return consumed.indexOf(kid) === -1 && !tplTags[kid.tagName];
                })[0];
                idx = candidate ? liveKids.indexOf(candidate) : -1;

                if (candidate && idx >= 0 && Math.abs(idx - index) <= 1 && !SKIP_TAGS[candidate.tagName]) {
                    liveKids[idx] = renameTag(candidate, tag);
                    consumed.push(liveKids[idx]);
                    morphElement(liveKids[idx], tplEl);

                    return;
                }

                // New wrapper: its children are already on the page, unwrapped.
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
                        morphElement(wrapper, tplEl);

                        return;
                    }
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
        // could have put them there. A dropped wrapper gives its children back.
        if (!dynamicParent) {
            liveKids.forEach(function (kid) {
                var keeps;

                if (consumed.indexOf(kid) !== -1 || !kid.isConnected || SKIP_TAGS[kid.tagName]) {
                    return;
                }

                keeps = elementKids(kid).some(function (grand) {
                    return tplTags[grand.tagName];
                });

                if (keeps) {
                    while (kid.firstChild) {
                        kid.before(kid.firstChild);
                    }
                }

                kid.remove();
            });
        }

        // Leaf text: written when the template's is fully resolved.
        if (!dynamicParent && !tplKids.length && !elementKids(live).length) {
            var text = directText(tpl);

            if (text.trim() !== '' && live.textContent !== text) {
                live.textContent = text;
            }
        }
    }

    /**
     * Structure + classes + text in one pass. Falls back to the class-only
     * paint if the walk throws, so a bad template never breaks the preview.
     */
    function paintStructure(live, html, scopedRoot) {
        var uid = (outermostSid(live) || live).getAttribute('data-sid') || '';
        var ctx = sectionContext(uid);
        var tpl = scopedRoot || templateRoot(html, ctx);

        if (!tpl || tpl.tagName !== live.tagName) {
            trace('structure: root tag mismatch ' + (tpl && tpl.tagName) + ' vs ' + live.tagName);

            return false;
        }

        try {
            morphElement(live, tpl);
            trace('structure: painted ' + live.tagName.toLowerCase() + '#' + live.id + (ctx ? ' with values' : ' without values'));
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

    function appendRule(doc, css) {
        if (!doc?.head || !css) {
            return;
        }

        var style = doc.getElementById(STYLE_TW_ID);

        if (!style) {
            style = doc.createElement('style');
            style.id = STYLE_TW_ID;
            doc.head.appendChild(style);
        } else if (style.textContent.indexOf('@layer theme, base, components, utilities') !== -1) {
            style.textContent = '';
            served = Object.create(null);
        }

        var text = String(css);

        if (style.textContent.indexOf(text) !== -1) {
            return;
        }

        // site.css already declared `@layer … tokens, utilities`. Rules in
        // `tokens` lose to that utilities layer, so a class the page already
        // has keeps its look. A class only this sheet has still applies.
        style.textContent += '@layer tokens {\n' + text + '\n}\n';
    }

    function injectNew(doc, names) {
        if (!design?.candidatesToCss || !doc) {
            return;
        }

        var missing = names.filter(function (name) {
            return !served[name];
        });

        if (!missing.length) {
            return;
        }

        var compiled;

        try {
            compiled = design.candidatesToCss(missing);
        } catch (e) {
            return;
        }

        missing.forEach(function (name, index) {
            served[name] = true;
            var css = compiled[index];

            if (typeof css === 'string' && css) {
                appendRule(doc, css);
            }
        });
    }

    function loadDesign() {
        if (design) {
            return Promise.resolve(design);
        }

        if (designWait) {
            return designWait;
        }

        var url = cfg('sveTwCompile', '');

        if (!url || !featureOn('tailwind_dock')) {
            return Promise.resolve(null);
        }

        designWait = import(url)
            .then(function (mod) {
                if (!mod?.loadTailwindDesign) {
                    return null;
                }

                return mod.loadTailwindDesign(window);
            })
            .then(function (ds) {
                design = ds || null;
                return design;
            })
            .catch(function () {
                designWait = null;
                return null;
            });

        return designWait;
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

            if (!doc.getElementById(STYLE_TW_ID)) {
                served = Object.create(null);
            }

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
                served = Object.create(null);
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

    function fullHtml() {
        var pane = paneText('html');

        if (!htmlScoped()) {
            lastFullHtml = pane;
            lastSnippet = '';

            return pane;
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

    /**
     * The HTML pane's EditorView, read off its content node. @codemirror/view
     * keeps the editor on `cmTile` since 6.38; older builds used `cmView`.
     */
    function htmlCmView() {
        var el = document.querySelector(
            '#' + DOCK_ID + ' [data-sve-code-pane="html"] .cm-content'
        );

        return el?.cmTile?.view || el?.cmView?.view || el?.cmView?.rootView?.view || null;
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

    function paintLive(doc, html) {
        var pane = paneText('html');
        var root;
        var live;
        var focused;
        var i;
        var targets;

        if (htmlScoped()) {
            root = templateRoot(pane);
            targets = pickedLive(doc, root);

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

        focused = doc.querySelectorAll('[data-sve-component-focused]');

        for (i = 0; i < focused.length; i++) {
            if (focused[i].tagName === root.tagName) {
                syncClasses(focused[i], root);
            }
        }

        if (focused.length) {
            return;
        }

        targets = pickedLive(doc, root);

        if (targets.length && targets[0].tagName === root.tagName) {
            syncClasses(targets[0], root);
        }
    }

    function paint() {
        if (painting || !featureOn('template_dock') || !document.getElementById(DOCK_ID)) {
            return;
        }

        if (instantMode() !== 'astro') {
            return;
        }

        var pane = paneText('html');
        var html = isFileRoot(pane) || htmlScoped() ? fullHtml() : pane;
        var css = htmlScoped() ? lastCss : paneText('css');
        var doc = previewDocument();

        if (!doc) {
            trace('paint: no preview document');

            return;
        }

        if (!html) {
            trace('paint: nothing to paint (scoped=' + htmlScoped() + ', file root=' + isFileRoot(pane) + ')');
        }

        bindPreview(doc);

        if (!htmlScoped() && css !== lastCss) {
            lastCss = css;
            putStyle(doc, STYLE_CSS_ID, css);
        }

        if (!html || html === lastHtml) {
            return;
        }

        lastHtml = html;
        painting = true;

        var names = classNames(html);

        if (design) {
            injectNew(doc, names);
        } else {
            loadDesign().then(function () {
                var next = previewDocument();
                if (next) {
                    injectNew(next, classNames(fullHtml() || paneText('html')));
                }
            });
        }

        if (!twSuggestOpen()) {
            dropTwHold();
        }

        paintLive(doc, html);

        painting = false;
    }

    var twHold = null;
    var twHeldName = '';
    var htmlCursorHold = null;

    function utilityRoot(name) {
        var base = String(name || '').split(':').pop().replace(/!$/, '');
        var at = base.indexOf('-');

        return at === -1 ? base : base.slice(0, at);
    }

    function twLiveTargets(doc) {
        var pane = paneText('html');
        var tpl = htmlScoped() ? templateRoot(pane) : templateRoot(fullHtml() || pane);

        return pickedLive(doc, tpl);
    }

    function cssForNames(names) {
        var compiled;

        if (!design?.candidatesToCss || !names.length) {
            return '';
        }

        try {
            compiled = design.candidatesToCss(names);
        } catch (e) {
            return '';
        }

        if (typeof compiled === 'string') {
            return compiled;
        }

        if (Array.isArray(compiled)) {
            return compiled.filter(Boolean).join('\n');
        }

        return '';
    }

    function putHoverCss(doc, name) {
        var css = cssForNames([name]);
        var style = doc.getElementById(STYLE_TW_HOVER_ID);

        if (!css) {
            style?.remove();
            return;
        }

        if (!style) {
            style = doc.createElement('style');
            style.id = STYLE_TW_HOVER_ID;
            doc.head.appendChild(style);
        }

        // Unlayered, last in the document: the hovered class must win over
        // whatever other utility is already on the tag (bg-gray vs bg-primary).
        style.textContent = css;
    }

    function clearHoverCss(doc) {
        doc?.getElementById(STYLE_TW_HOVER_ID)?.remove();
    }

    function rememberHtmlCursor() {
        var view = htmlCmView();

        htmlCursorHold = view ? view.state.selection.main.head : null;
    }

    function restoreHtmlCursor() {
        var view = htmlCmView();
        var at = htmlCursorHold;

        htmlCursorHold = null;

        if (!view || at == null) {
            return;
        }

        if (view.state.selection.main.head === at) {
            return;
        }

        view.dispatch({
            selection: { anchor: at },
            scrollIntoView: true,
        });
    }

    function optionClassName(el) {
        var label = el && el.querySelector('[data-sve-tw-label], .cm-completionLabel');

        if (label) {
            return (label.textContent || '').trim();
        }

        return ((el && el.getAttribute('aria-label')) || (el && el.textContent) || '').trim();
    }

    function restoreTwHold() {
        var i;
        var item;
        var doc = previewDocument();

        if (!twHold) {
            twHeldName = '';
            clearHoverCss(doc);
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
        twHeldName = '';
        clearHoverCss(doc);
    }

    function dropTwHold() {
        twHold = null;
        twHeldName = '';
        clearHoverCss(previewDocument());
    }

    function previewTwClass(name) {
        var doc;
        var targets;
        var stem;
        var i;
        var el;
        var original;
        var next;

        name = String(name || '').trim();

        if (!name || instantMode() !== 'astro') {
            return;
        }

        if (twHeldName === name && twHold) {
            return;
        }

        doc = previewDocument();

        if (!doc) {
            return;
        }

        restoreTwHold();
        targets = twLiveTargets(doc);

        if (!targets.length) {
            return;
        }

        if (design) {
            putHoverCss(doc, name);
        } else {
            loadDesign().then(function () {
                var nextDoc = previewDocument();

                if (nextDoc && twHeldName === name) {
                    putHoverCss(nextDoc, name);
                }
            });
        }

        stem = utilityRoot(name);
        twHold = [];

        for (i = 0; i < targets.length; i++) {
            el = targets[i];
            original = el.getAttribute('class') || '';
            next = original.split(/\s+/).filter(Boolean).filter(function (token) {
                return utilityRoot(token) !== stem;
            });
            next.push(name);
            el.setAttribute('class', next.join(' '));
            twHold.push({ el: el, original: original });
        }

        twHeldName = name;
    }

    function twSuggestActive() {
        return document.querySelector(
            '[data-sve-tw-option][data-active], [data-sve-tw-option][data-cursor], ' +
            '.cm-tooltip.sve-tw-complete li[aria-selected]'
        );
    }

    function twSuggestOpen() {
        return !!(
            document.getElementById('__sve-tw-menu') ||
            document.querySelector('.cm-tooltip.sve-tw-complete')
        );
    }

    function bindTwMenu(menu) {
        if (!menu || menu.__sveTwPreview) {
            return;
        }

        menu.__sveTwPreview = true;
        menu.addEventListener('mouseover', function (event) {
            var option = event.target.closest && event.target.closest('[data-sve-tw-option]');

            if (option) {
                previewTwClass(optionClassName(option));
            }
        });
        menu.addEventListener('mouseleave', restoreTwHold);
        menu.addEventListener('click', function (event) {
            if (event.target.closest && event.target.closest('[data-sve-tw-option]')) {
                rememberHtmlCursor();
                dropTwHold();
                window.requestAnimationFrame(restoreHtmlCursor);
            }
        });
    }

    function watchTwSuggest() {
        if (document.__sveTwSuggestWatch === 4) {
            return;
        }

        document.__sveTwSuggestWatch = 4;
        bindTwMenu(document.getElementById('__sve-tw-menu'));

        document.addEventListener(
            'mouseover',
            function (event) {
                var option =
                    event.target &&
                    event.target.closest &&
                    event.target.closest(
                        '[data-sve-tw-option], .cm-tooltip.sve-tw-complete li'
                    );

                if (!option) {
                    return;
                }

                previewTwClass(optionClassName(option));
            },
            true
        );

        document.addEventListener(
            'click',
            function (event) {
                if (
                    event.target &&
                    event.target.closest &&
                    event.target.closest(
                        '[data-sve-tw-option], .cm-tooltip.sve-tw-complete li'
                    )
                ) {
                    rememberHtmlCursor();
                    dropTwHold();
                    window.requestAnimationFrame(restoreHtmlCursor);
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
                    var active = twSuggestActive();

                    if (active) {
                        previewTwClass(optionClassName(active));
                    }
                });
            },
            true
        );

        new MutationObserver(function () {
            var menu = document.getElementById('__sve-tw-menu');

            if (menu) {
                bindTwMenu(menu);
                return;
            }

            restoreTwHold();
        }).observe(document.body, { childList: true });
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
        loadDesign();
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
