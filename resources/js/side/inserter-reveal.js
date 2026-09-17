/**
 * "+" in the gap between blocks — after the last block only when that one
 * is hovered. Not while you are inside a block (or the one being edited).
 *
 * Morph rebuilds the layer at opacity 0; pointerenter does not fire again.
 * This script shows the plus again and moves it into the hovered gap.
 * Click inserts after that block (the native handler always used the last one).
 *
 * Own CP script — not addon.js. Does not touch overlay-host / preview / bridge.
 */
(function () {
    'use strict';

    if (window.__sveInserterReveal) {
        return;
    }
    window.__sveInserterReveal = true;

    var LAYER_ID = '__sve-inserters';
    var INSERT_ATTR = 'data-sid-insert';
    var AFTER_GAP = 8;
    var GAP_SLOP = 14;
    var WRAP_H = 30;
    var STICKY_MS = 8000;
    var lastX = 0;
    var lastY = 0;
    var pending = null;
    var revealTimer = 0;
    var followRaf = 0;
    var LOOK_STYLE_ID = '__sve-inserter-look';
    var PLUS_SVG =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" width="14" height="14" aria-hidden="true"><rect x="6.5" y="2" width="1" height="10" fill="currentColor"/><rect x="2" y="6.5" width="10" height="1" fill="currentColor"/></svg>';

    function isBlock(el) {
        return (
            el &&
            (el.hasAttribute('data-sid') ||
                el.hasAttribute('data-sid-orderable') ||
                el.hasAttribute('data-sid-field'))
        );
    }

    function blocksOf(container) {
        var kids = container ? container.children : [];
        var out = [];
        var i;

        for (i = 0; i < kids.length; i++) {
            if (isBlock(kids[i])) {
                out.push(kids[i]);
            }
        }

        return out;
    }

    function lastBlock(container) {
        var blocks = blocksOf(container);

        return blocks.length ? blocks[blocks.length - 1] : null;
    }

    function parseSets(container) {
        try {
            return JSON.parse(container.getAttribute('data-sid-insert-sets') || '[]');
        } catch (err) {
            return [];
        }
    }

    function findContainer(doc, field, scope) {
        var nodes;
        var i;
        var el;
        var fallback = null;

        if (!doc || !field) {
            return null;
        }

        nodes = doc.querySelectorAll('[' + INSERT_ATTR + '="' + field + '"]');

        for (i = 0; i < nodes.length; i++) {
            el = nodes[i];

            if (scope && (el.getAttribute('data-sid-insert-scope') || '') === scope) {
                return el;
            }

            if (!fallback) {
                fallback = el;
            }
        }

        return fallback;
    }

    function isHorizontal(win, container, blocks) {
        var a;
        var b;
        var style;
        var display;

        if (blocks.length >= 2) {
            a = blocks[0].getBoundingClientRect();
            b = blocks[1].getBoundingClientRect();

            return Math.abs(b.left - a.left) > Math.abs(b.top - a.top);
        }

        style = win.getComputedStyle(container);
        display = style.display;

        if (display === 'flex' || display === 'inline-flex') {
            return style.flexDirection.indexOf('row') === 0;
        }

        if (display === 'grid' || display === 'inline-grid') {
            return (
                style.gridAutoFlow.indexOf('column') === 0 ||
                style.gridTemplateColumns.split(' ').filter(Boolean).length > 1
            );
        }

        return false;
    }

    function wrapForContainer(layer, container, used) {
        var last;
        var r;
        var best = null;
        var bestDist = Infinity;
        var wraps;
        var i;
        var box;
        var stacked;
        var beside;

        if (!layer || !container) {
            return null;
        }

        last = lastBlock(container);
        r = (last || container).getBoundingClientRect();
        wraps = layer.children;

        for (i = 0; i < wraps.length; i++) {
            if (used && used.indexOf(wraps[i]) !== -1) {
                continue;
            }

            box = wraps[i].getBoundingClientRect();
            stacked = Math.hypot(box.left - r.left, box.top - (r.bottom + AFTER_GAP));
            beside = Math.hypot(box.left - (r.right - 15), box.top - r.top);

            if (Math.min(stacked, beside) < bestDist) {
                bestDist = Math.min(stacked, beside);
                best = wraps[i];
            }
        }

        if (!last) {
            stacked = Math.abs((best ? best.getBoundingClientRect().top : 0) - (r.top + 6));

            return stacked < 24 ? best : null;
        }

        return bestDist < 96 ? best : null;
    }

    function associateWraps(win) {
        var doc = win.document;
        var layer = doc.getElementById(LAYER_ID);
        var containers;
        var used = [];
        var i;
        var wrap;
        var already;

        if (!layer) {
            return;
        }

        already = true;

        for (i = 0; i < layer.children.length; i++) {
            if (!layer.children[i].__sveInsertContainer) {
                already = false;
                break;
            }
        }

        if (already && layer.children.length) {
            return;
        }

        containers = doc.querySelectorAll('[' + INSERT_ATTR + ']');

        for (i = 0; i < containers.length; i++) {
            wrap = wrapForContainer(layer, containers[i], used);

            if (!wrap) {
                continue;
            }

            wrap.__sveInsertContainer = containers[i];
            used.push(wrap);
        }
    }

    function hitNode(doc) {
        try {
            return doc.elementFromPoint(lastX, lastY);
        } catch (err) {
            return null;
        }
    }

    function hasRoomOnRight(container, block) {
        var cr;
        var r;

        if (!container || !block) {
            return false;
        }

        cr = container.getBoundingClientRect();
        r = block.getBoundingClientRect();

        return cr.right - r.right > 64;
    }

    function innermostInsertable(el) {
        return el && el.closest ? el.closest('[' + INSERT_ATTR + ']') : null;
    }

    function hoveredInsertable(doc) {
        var nodes = doc.querySelectorAll('[' + INSERT_ATTR + ']:hover');

        return nodes.length ? nodes[nodes.length - 1] : null;
    }

    function nextBlock(container, block) {
        var blocks = blocksOf(container);
        var i = blocks.indexOf(block);

        return i >= 0 && i < blocks.length - 1 ? blocks[i + 1] : null;
    }

    function insertionTarget(win, container, x, y) {
        var blocks = blocksOf(container);
        var horizontal;
        var i;
        var r;
        var n;
        var last;

        if (!blocks.length) {
            return null;
        }

        horizontal = isHorizontal(win, container, blocks);
        last = blocks[blocks.length - 1];

        for (i = 0; i < blocks.length - 1; i++) {
            r = blocks[i].getBoundingClientRect();
            n = blocks[i + 1].getBoundingClientRect();

            if (horizontal) {
                if (x >= r.right - GAP_SLOP && x < n.left + GAP_SLOP) {
                    return blocks[i];
                }
            } else if (y >= r.bottom - GAP_SLOP && y < n.top + GAP_SLOP) {
                return blocks[i];
            }
        }

        r = last.getBoundingClientRect();

        if (horizontal) {
            if (hasRoomOnRight(container, last)) {
                return x >= r.left ? last : null;
            }

            if (x >= r.left && x <= r.right && y >= r.top) {
                return last;
            }

            return null;
        }

        return y >= r.top ? last : null;
    }

    function injectLook(win) {
        var doc;
        var style;

        if (!win || !win.document) {
            return;
        }

        doc = win.document;
        style = doc.getElementById(LOOK_STYLE_ID);

        if (!style) {
            style = doc.createElement('style');
            style.id = LOOK_STYLE_ID;
            (doc.head || doc.documentElement).appendChild(style);
        }

        style.textContent =
            '[id="' +
            LAYER_ID +
            '"] .sve-ins-wrap{display:flex!important;align-items:center!important;justify-content:center!important;gap:10px!important;box-sizing:border-box;}' +
            '[id="' +
            LAYER_ID +
            '"] .sve-ins-line{flex:1 1 0!important;min-width:0!important;min-height:0!important;pointer-events:none!important;opacity:1!important;transition:background .2s ease;background:rgba(0,0,0,.15)!important;}' +
            '[id="' +
            LAYER_ID +
            '"] .sve-ins-wrap[data-sve-ins-dir="row"] .sve-ins-line{height:1px!important;width:auto!important;max-height:1px!important;}' +
            '[id="' +
            LAYER_ID +
            '"] .sve-ins-wrap[data-sve-ins-dir="col"] .sve-ins-line{width:1px!important;height:auto!important;max-width:1px!important;}' +
            '[id="' +
            LAYER_ID +
            '"] .sve-ins-wrap[data-sve-ins-tone="dark"] .sve-ins-line{background:rgba(255,255,255,.15)!important;}' +
            '[id="' +
            LAYER_ID +
            '"] .sve-ins-wrap[data-sve-ins-hover] .sve-ins-line{background:rgba(0,0,0,.3)!important;}' +
            '[id="' +
            LAYER_ID +
            '"] .sve-ins-wrap[data-sve-ins-tone="dark"][data-sve-ins-hover] .sve-ins-line{background:rgba(255,255,255,.3)!important;}' +
            '[id="' +
            LAYER_ID +
            '"] .sve-ins-btn{pointer-events:auto!important;position:relative!important;top:auto!important;bottom:auto!important;left:auto!important;right:auto!important;flex:0 0 22px!important;width:22px!important;height:22px!important;margin:0!important;padding:0!important;border:none!important;border-radius:2px!important;cursor:pointer!important;box-shadow:none!important;display:flex!important;align-items:center!important;justify-content:center!important;color:#fff!important;background:#000!important;opacity:.6!important;transition:opacity .2s ease,background .2s ease,color .2s ease;}' +
            '[id="' +
            LAYER_ID +
            '"] .sve-ins-btn svg{display:block;width:14px;height:14px;}' +
            '[id="' +
            LAYER_ID +
            '"] .sve-ins-wrap[data-sve-ins-tone="dark"] .sve-ins-btn{background:#fff!important;color:#111!important;}' +
            '[id="' +
            LAYER_ID +
            '"] .sve-ins-wrap[data-sve-ins-hover] .sve-ins-btn{opacity:1!important;}';
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

        for (i = 0; node && i < 16; i++) {
            cs = win.getComputedStyle(node);
            parsed = parseRgb(cs.backgroundColor);

            if (parsed && parsed.a >= 0.4) {
                if (node === win.document.body || node === win.document.documentElement) {
                    break;
                }

                lum = (0.2126 * parsed.r + 0.7152 * parsed.g + 0.0722 * parsed.b) / 255;

                // Same cut as toolbar-look.js — light chrome only on a really
                // dark surface (≈ 70% dark). Text/outline contrast stays in bridge.js.
                return lum < 0.3;
            }

            node = node.parentElement;
        }

        return false;
    }

    function applyTone(win, wrap, block, container) {
        var source =
            (container && container.closest && container.closest('[data-auto-contrast]')) ||
            block ||
            container;
        var dark = source ? surfaceIsDark(win, source) : false;

        wrap.style.setProperty('--sve-ins-rgb', dark ? '255, 255, 255' : '0, 0, 0');
        wrap.setAttribute('data-sve-ins-tone', dark ? 'dark' : 'light');
    }

    function paintLook(wrap, dir, dark) {
        var line = wrap.__line;
        var after = wrap.__lineAfter;
        var btn = wrap.__btn;
        var lineBg = dark ? 'rgba(255,255,255,.15)' : 'rgba(0,0,0,.15)';
        var btnBg = dark ? '#fff' : '#000';
        var btnFg = dark ? '#111' : '#fff';
        var lineCss =
            (dir === 'col'
                ? 'width:1px !important;height:auto !important;max-width:1px !important;'
                : 'height:1px !important;width:auto !important;max-height:1px !important;') +
            'flex:1 1 0 !important;min-width:0;min-height:0;background:' +
            lineBg +
            ' !important;opacity:1;transition:background .2s ease;pointer-events:none;';
        var nodes = [line, after];
        var i;

        wrap.setAttribute('data-sve-ins-dir', dir || 'row');
        wrap.style.gap = '10px';

        for (i = 0; i < nodes.length; i++) {
            if (nodes[i]) {
                nodes[i].classList.add('sve-ins-line');
                nodes[i].style.cssText = lineCss;
            }
        }

        if (!btn) {
            return;
        }

        btn.classList.add('sve-ins-btn');
        btn.setAttribute('aria-label', '+');

        if (!btn.querySelector('svg')) {
            btn.innerHTML = PLUS_SVG;
        }

        btn.style.cssText =
            'pointer-events:auto;position:relative;top:auto;bottom:auto;left:auto;right:auto;flex:0 0 22px;' +
            'width:22px;height:22px;margin:0;padding:0;border:none;border-radius:2px;cursor:pointer;' +
            'display:flex;align-items:center;justify-content:center;box-shadow:none !important;' +
            'background:' +
            btnBg +
            ' !important;color:' +
            btnFg +
            ' !important;opacity:.6 !important;transition:opacity .2s ease,background .2s ease,color .2s ease;';
    }

    function bindLookHover(wrap) {
        var btn = wrap.__btn;

        if (!btn || btn.__sveLookHover) {
            return;
        }

        btn.__sveLookHover = true;
        btn.addEventListener('pointerenter', function () {
            wrap.setAttribute('data-sve-ins-hover', '1');
            btn.style.setProperty('opacity', '1', 'important');
            setLineAlpha(wrap, 0.3);
        });
        btn.addEventListener('pointerleave', function () {
            wrap.removeAttribute('data-sve-ins-hover');
            btn.style.setProperty('opacity', '.6', 'important');
            setLineAlpha(wrap, 0.15);
        });
    }

    function setLineAlpha(wrap, alpha) {
        var dark = wrap.getAttribute('data-sve-ins-tone') === 'dark';
        var bg = dark ? 'rgba(255,255,255,' + alpha + ')' : 'rgba(0,0,0,' + alpha + ')';
        var nodes = [wrap.__line, wrap.__lineAfter];
        var i;

        for (i = 0; i < nodes.length; i++) {
            if (nodes[i]) {
                nodes[i].style.setProperty('background', bg, 'important');
            }
        }
    }

    function dressWrap(win, wrap) {
        var doc;
        var line;
        var btn;
        var after;

        if (!wrap || wrap.__sveInsDressed) {
            return;
        }

        doc = win.document;
        btn = wrap.__btn || wrap.querySelector('button');
        line = wrap.__line;

        if (!line || (line.tagName === 'BUTTON')) {
            line = wrap.firstElementChild;

            if (line && line.tagName === 'BUTTON') {
                line = line.nextElementSibling;
            }
        }

        if (!btn || !line || line.tagName === 'BUTTON') {
            return;
        }

        wrap.classList.add('sve-ins-wrap');
        line.classList.add('sve-ins-line');
        btn.classList.add('sve-ins-btn');
        btn.setAttribute('aria-label', '+');
        line.style.cssText = '';
        btn.style.position = 'relative';

        after = doc.createElement('div');
        after.className = 'sve-ins-line';
        wrap.appendChild(line);
        wrap.appendChild(btn);
        wrap.appendChild(after);
        wrap.__line = line;
        wrap.__lineAfter = after;
        wrap.__btn = btn;
        wrap.__sveInsDressed = true;
    }

    function dressLayer(win) {
        var layer;
        var i;

        try {
            injectLook(win);
            layer = win.document.getElementById(LAYER_ID);

            if (!layer) {
                return;
            }

            for (i = 0; i < layer.children.length; i++) {
                dressWrap(win, layer.children[i]);
            }
        } catch (err) {
            /* look never blocks "+" placement */
        }
    }

    function finishLook(win, wrap, container, block, dir) {
        try {
            injectLook(win);
            dressWrap(win, wrap);
            applyTone(win, wrap, block, container);
            paintLook(wrap, dir, wrap.getAttribute('data-sve-ins-tone') === 'dark');
            bindLookHover(wrap);
        } catch (err) {
            /* look never blocks "+" placement */
        }
    }

    function placeWrap(win, wrap, container, block) {
        var r;
        var horizontal;
        var blocks;
        var next;

        if (!wrap || !container) {
            return;
        }

        wrap.__sveInsertContainer = container;
        wrap.__sveInsertBlock = block || null;
        wrap.style.opacity = '1';

        if (!block) {
            r = container.getBoundingClientRect();
            wrap.style.left = r.left + 'px';
            wrap.style.top = r.top + 6 + 'px';
            wrap.style.width = r.width + 'px';
            wrap.style.height = '30px';
            wrap.style.flexDirection = 'row';
            finishLook(win, wrap, container, block, 'row');

            return;
        }

        r = block.getBoundingClientRect();
        blocks = blocksOf(container);
        horizontal = isHorizontal(win, container, blocks);

        if (horizontal) {
            next = nextBlock(container, block);

            if (next) {
                wrap.style.left = (r.right + next.getBoundingClientRect().left) / 2 - WRAP_H / 2 + 'px';
                wrap.style.top = r.top + 'px';
                wrap.style.width = WRAP_H + 'px';
                wrap.style.height = r.height + 'px';
                wrap.style.flexDirection = 'column';
                finishLook(win, wrap, container, block, 'col');

                return;
            }

            if (hasRoomOnRight(container, block)) {
                wrap.style.left = r.right - 15 + 'px';
                wrap.style.top = r.top + 'px';
                wrap.style.width = WRAP_H + 'px';
                wrap.style.height = r.height + 'px';
                wrap.style.flexDirection = 'column';
                finishLook(win, wrap, container, block, 'col');

                return;
            }
        }

        next = nextBlock(container, block);
        wrap.style.left = r.left + 'px';
        wrap.style.width = r.width + 'px';
        wrap.style.height = WRAP_H + 'px';
        wrap.style.flexDirection = 'row';

        if (next) {
            wrap.style.top =
                (r.bottom + next.getBoundingClientRect().top) / 2 - WRAP_H / 2 + 'px';
        } else {
            wrap.style.top = r.bottom + AFTER_GAP + 'px';
        }

        finishLook(win, wrap, container, block, 'row');
    }

    function hideOtherWraps(layer, keep) {
        var i;
        var wrap;
        var container;

        if (!layer) {
            return;
        }

        for (i = 0; i < layer.children.length; i++) {
            wrap = layer.children[i];

            if (wrap === keep) {
                continue;
            }

            container = wrap.__sveInsertContainer;

            if (container && !lastBlock(container)) {
                continue;
            }

            wrap.style.opacity = '0';
        }
    }

    function follow(win, hitEl) {
        var doc;
        var layer;
        var hit;
        var container;
        var block;
        var wrap;

        if (!win || !win.document) {
            return;
        }

        doc = win.document;
        layer = doc.getElementById(LAYER_ID);

        if (!layer || !layer.children.length) {
            return;
        }

        associateWraps(win);
        hit = hitEl || hitNode(doc);

        if (hit && hit.closest && hit.closest('#' + LAYER_ID + ' button')) {
            return;
        }

        container = innermostInsertable(hit) || hoveredInsertable(doc);

        if (container) {
            block = insertionTarget(win, container, lastX, lastY);
        } else if (pending && Date.now() < pending.until) {
            container = findContainer(doc, pending.field, pending.scope);
            block = lastBlock(container);
        }

        if (!container) {
            hideOtherWraps(layer, null);

            return;
        }

        wrap = wrapForTagged(layer, container) || wrapForContainer(layer, container, []);

        if (!wrap) {
            return;
        }

        if (!block && lastBlock(container)) {
            wrap.style.opacity = '0';
            hideOtherWraps(layer, wrap);

            return;
        }

        placeWrap(win, wrap, container, block);
        hideOtherWraps(layer, wrap);
    }

    function wrapForTagged(layer, container) {
        var i;

        for (i = 0; i < layer.children.length; i++) {
            if (layer.children[i].__sveInsertContainer === container) {
                return layer.children[i];
            }
        }

        return null;
    }

    function collectDefaults(root) {
        var out = {};
        var nodes;
        var i;
        var field;
        var value;

        if (!root || !root.querySelectorAll) {
            return out;
        }

        nodes = root.querySelectorAll('[data-sid-field][data-sid-default]');

        for (i = 0; i < nodes.length; i++) {
            field = nodes[i].getAttribute('data-sid-field');
            value = nodes[i].getAttribute('data-sid-default');

            if (field && value != null && value !== '') {
                out[field] = value;
            }
        }

        return out;
    }

    function onPlusClick(event) {
        var btn;
        var wrap;
        var container;
        var block;
        var win;
        var r;
        var payload;
        var defaults;
        var row;
        var rowTemplate;
        var containerTemplate;

        btn = event.target && event.target.closest && event.target.closest('#' + LAYER_ID + ' button');

        if (!btn) {
            return;
        }

        wrap = btn.closest('#' + LAYER_ID + ' > *') || btn.parentElement;
        container = wrap && wrap.__sveInsertContainer;

        if (!container) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();

        win = event.view || container.ownerDocument.defaultView;
        block = wrap.__sveInsertBlock || lastBlock(container);
        r = btn.getBoundingClientRect();
        defaults = collectDefaults(container);
        row = block && block.closest ? block.closest('[data-sid-orderable]') : null;
        containerTemplate =
            container.getAttribute('data-sid-template') || (block && block.getAttribute('data-sid-template')) || '';
        rowTemplate =
            (row && row.getAttribute('data-sid-template')) ||
            container.getAttribute('data-sid-row-template') ||
            '';

        payload = {
            source: 'statamic-visual-editor',
            type: 'add-block-native',
            field: container.getAttribute(INSERT_ATTR),
            sets: parseSets(container),
            anchorUid: block
                ? block.getAttribute('data-sid') || block.getAttribute('data-sid-field-uid')
                : null,
            sectionUid: container.getAttribute('data-sid-insert-scope') || null,
            global: !!container.closest('[data-sve-global-focused]'),
            position: 'after',
            anchorRect: {
                left: r.left,
                top: r.top,
                bottom: r.bottom,
                right: r.right,
                width: r.width,
                height: r.height,
            },
            template: rowTemplate || containerTemplate,
            rowTemplate: rowTemplate,
            containerTemplate: containerTemplate,
        };

        if (Object.keys(defaults).length) {
            payload.fieldDefaults = defaults;
        }

        win.parent.postMessage(payload, win.location.origin);
    }

    function scheduleFollow(win) {
        if (!win) {
            return;
        }

        if (revealTimer) {
            win.clearTimeout(revealTimer);
        }

        revealTimer = win.setTimeout(function () {
            revealTimer = 0;
            follow(win);
        }, 40);
    }

    function onPointerMove(event) {
        var win;
        var hit = event.target;

        lastX = event.clientX;
        lastY = event.clientY;
        win = event.view || (hit && hit.ownerDocument && hit.ownerDocument.defaultView);

        if (!win) {
            return;
        }

        if (followRaf) {
            win.__sveFollowHit = hit;
            return;
        }

        followRaf = win.requestAnimationFrame(function () {
            followRaf = 0;
            follow(win, win.__sveFollowHit || hit);
            win.__sveFollowHit = null;
        });
    }

    function observeHoverTarget(win) {
        var doc;

        if (!win || !win.document) {
            return;
        }

        doc = win.document;

        if (doc.__sveInnerObs) {
            return;
        }

        doc.__sveInnerObs = new MutationObserver(function () {
            follow(win);
        });
        doc.__sveInnerObs.observe(doc.documentElement, {
            attributes: true,
            subtree: true,
            attributeFilter: ['data-sid-inner'],
        });
    }

    function observeLayer(win) {
        var layer;

        if (!win || !win.document) {
            return;
        }

        layer = win.document.getElementById(LAYER_ID);

        if (!layer || layer.__sveRevealObs) {
            return;
        }

        layer.__sveRevealObs = new MutationObserver(function () {
            scheduleFollow(win);
        });
        layer.__sveRevealObs.observe(layer, { childList: true });
    }

    function bindPreview(win) {
        var doc;

        if (!win || !win.document) {
            return;
        }

        doc = win.document;

        if (win.__sveInserterRevealBoundDoc === doc) {
            return;
        }

        win.__sveInserterRevealBoundDoc = doc;
        win.__sveInserterRevealBound = true;
        win.__sveFollowInserterAt = function (x, y) {
            lastX = x;
            lastY = y;
            follow(win);
        };
        doc.addEventListener('mousemove', onPointerMove, true);
        doc.addEventListener('pointermove', onPointerMove, true);
        doc.addEventListener('pointerdown', onPointerMove, true);
        doc.addEventListener('click', onPlusClick, true);

        if (!win.__sveInserterRevealWinBound) {
            win.__sveInserterRevealWinBound = true;
            win.addEventListener('statamic:preview-updated', function () {
                bindPreview(win);
                observeLayer(win);
                observeHoverTarget(win);
                scheduleFollow(win);
            });
        }

        observeLayer(win);
        observeHoverTarget(win);
        scheduleFollow(win);
    }

    function bindPreviewFrames() {
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

    window.addEventListener('message', function (event) {
        var data = event.data;

        if (!data || data.source !== 'statamic-visual-editor') {
            return;
        }

        if (data.type !== 'add-block-native' && data.type !== 'add-bard-set-native') {
            return;
        }

        if (!data.field) {
            return;
        }

        pending = {
            field: data.field,
            scope: data.sectionUid || data.scope || '',
            until: Date.now() + STICKY_MS,
        };
        bindPreviewFrames();
        scheduleFollow(iframeWindow());
    });

    function iframeWindow() {
        var iframe = document.getElementById('live-preview-iframe');

        try {
            return iframe && iframe.contentWindow;
        } catch (err) {
            return null;
        }
    }

    var bindTimer = 0;

    function scheduleBind() {
        if (bindTimer) {
            return;
        }

        bindTimer = window.setTimeout(function () {
            bindTimer = 0;
            bindPreviewFrames();
        }, 200);
    }

    bindPreviewFrames();
    document.addEventListener('sve-chrome-render', scheduleBind);

    new MutationObserver(scheduleBind).observe(document.documentElement, {
        childList: true,
        subtree: true,
    });
})();
