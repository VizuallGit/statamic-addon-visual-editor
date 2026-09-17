/**
 * Library drop: keep the overview until the new section exists, then zoom in
 * on it. No jump to the old scroll position, no jump to the top then down.
 *
 * Own CP script — not addon.js. Does not touch overlay-host / preview / bridge.
 * Insert still goes through the bridge (ext-drop). This only holds the overview
 * past restoreZoom, then FLIPs into the new section.
 */
(function () {
    'use strict';

    if (window.__sveLibraryDropFocus) {
        return;
    }
    window.__sveLibraryDropFocus = true;

    var SECTION_ATTR = 'data-sid-section-orderable';
    var drag = null;

    function sectionsOf(win) {
        var nodes = win.document.querySelectorAll('[' + SECTION_ATTR + ']');
        var out = [];
        var i;

        for (i = 0; i < nodes.length; i++) {
            if (nodes[i].getBoundingClientRect().width > 0) {
                out.push(nodes[i]);
            }
        }

        return out;
    }

    function uidOf(el) {
        return el ? el.getAttribute('data-sid') : null;
    }

    function uidList(win) {
        return sectionsOf(win).map(uidOf);
    }

    function insertedSection(win, before) {
        var list = sectionsOf(win);
        var i;

        for (i = 0; i < list.length; i++) {
            if (before.indexOf(uidOf(list[i])) === -1) {
                return list[i];
            }
        }

        return null;
    }

    function bodyScale(win) {
        var t = win.getComputedStyle(win.document.body).transform;
        var m;

        if (!t || t === 'none') {
            return 1;
        }

        m = t.match(/matrix\(([^)]+)\)/);

        if (m) {
            return Math.abs(parseFloat(m[1].split(',')[0])) || 1;
        }

        return 1;
    }

    function keepOverview(win) {
        var body;
        var scale;
        var style;

        if (!drag || drag.win !== win) {
            return;
        }

        scale = drag.scale > 0 && drag.scale < 0.999 ? drag.scale : 0;

        if (!scale) {
            return;
        }

        style = win.document.getElementById('sve-hold-overview');

        if (!style) {
            style = win.document.createElement('style');
            style.id = 'sve-hold-overview';
            win.document.head.appendChild(style);
        }

        style.textContent = 'body{transform:scale(' + scale + ') !important;transform-origin:top center !important;transition:none !important;}';
        body = win.document.body;
        body.style.transition = 'none';
        body.style.transformOrigin = 'top center';
        body.style.transform = 'scale(' + scale + ')';
        win.scrollTo(0, 0);
    }

    function releaseOverview(win) {
        var style = win.document.getElementById('sve-hold-overview');

        if (style) {
            style.remove();
        }
    }

    function holdOverview(win) {
        var frames = 0;

        function tick() {
            if (!drag || drag.win !== win || frames > 24) {
                return;
            }

            keepOverview(win);
            frames += 1;
            win.requestAnimationFrame(tick);
        }

        tick();
    }

    function tapRestoreScroll(win) {
        var orig;

        if (win.__sveDropScrollOrig) {
            return;
        }

        orig = win.scrollTo.bind(win);
        win.__sveDropScrollOrig = orig;
        drag.holdUntil = Date.now() + 450;
        win.scrollTo = function () {
            if (drag && Date.now() < drag.holdUntil) {
                orig(0, 0);

                return;
            }

            return orig.apply(win, arguments);
        };

        win.setTimeout(function () {
            if (win.__sveDropScrollOrig === orig) {
                win.scrollTo = orig;
                win.__sveDropScrollOrig = null;
            }

            if (drag && drag.win === win) {
                keepOverview(win);
            }
        }, 390);
    }

    function flipZoomTo(win, el) {
        var body = win.document.body;
        var first;
        var last;
        var br;
        var dx;
        var dy;
        var sx;
        var previous = drag ? drag.previous : null;

        first = el.getBoundingClientRect();

        body.style.transition = 'none';
        body.style.transform = previous && previous.transform ? previous.transform : 'none';
        body.style.transformOrigin = previous && previous.origin ? previous.origin : '';

        try {
            el.scrollIntoView({ block: 'start', behavior: 'instant' });
        } catch (err) {
            el.scrollIntoView(true);
        }

        last = el.getBoundingClientRect();
        br = body.getBoundingClientRect();
        dx = first.left - last.left;
        dy = first.top - last.top;
        sx = first.width / Math.max(last.width, 1);

        body.style.transformOrigin = last.left - br.left + 'px ' + (last.top - br.top) + 'px';
        body.style.transform = 'translate(' + dx + 'px, ' + dy + 'px) scale(' + sx + ')';
        body.getBoundingClientRect();
        body.style.transition = 'transform .35s ease';
        body.style.transform = previous && previous.transform ? previous.transform : 'none';

        win.setTimeout(function () {
            body.style.transformOrigin = previous ? previous.origin : '';
            body.style.transition = previous ? previous.transition : '';
        }, 380);
    }

    function finishOnSection(win) {
        var el;

        if (!drag || drag.win !== win) {
            return;
        }

        el = insertedSection(win, drag.before);

        if (!el) {
            return;
        }

        if (drag.timer) {
            win.clearInterval(drag.timer);
        }

        releaseOverview(win);
        flipZoomTo(win, el);
        drag = null;
    }

    function watchInsert(win) {
        var tries = 0;

        if (!drag) {
            return;
        }

        if (drag.timer) {
            win.clearInterval(drag.timer);
        }

        drag.timer = win.setInterval(function () {
            tries += 1;

            if (!drag || drag.win !== win) {
                win.clearInterval(drag.timer);

                return;
            }

            if (insertedSection(win, drag.before)) {
                finishOnSection(win);

                return;
            }

            if (tries > 160) {
                win.clearInterval(drag.timer);
                releaseOverview(win);
                drag = null;
            }
        }, 50);
    }

    function bindPreview(win) {
        if (!win || win.__sveDropFocusBound) {
            return;
        }

        win.__sveDropFocusBound = true;

        win.addEventListener(
            'message',
            function (event) {
                var data = event.data;

                if (!data || data.source !== 'statamic-visual-editor') {
                    return;
                }

                if ((data.type === 'ext-drag-move' || data.type === 'ext-drag-end') && drag && drag.win === win) {
                    drag.scale = bodyScale(win);

                    if (data.type === 'ext-drag-end' && !data.cancelled) {
                        drag.scale = bodyScale(win);
                        keepOverview(win);
                    }
                }
            },
            true
        );

        win.addEventListener(
            'message',
            function (event) {
                var data = event.data;
                var body;

                if (!data || data.source !== 'statamic-visual-editor') {
                    return;
                }

                if (data.type === 'ext-drag-start') {
                    body = win.document.body;
                    drag = {
                        win: win,
                        previous: {
                            scroll: win.scrollY,
                            transform: body.style.transform,
                            origin: body.style.transformOrigin,
                            transition: body.style.transition,
                        },
                        before: uidList(win),
                        scale: 1,
                        timer: 0,
                        holdUntil: 0,
                    };
                    win.requestAnimationFrame(function () {
                        win.requestAnimationFrame(function () {
                            if (drag && drag.win === win) {
                                drag.scale = bodyScale(win);
                            }
                        });
                    });

                    return;
                }

                if (data.type !== 'ext-drag-end') {
                    return;
                }

                if (!drag || drag.win !== win) {
                    return;
                }

                if (data.cancelled) {
                    if (drag.timer) {
                        win.clearInterval(drag.timer);
                    }

                    releaseOverview(win);
                    drag = null;

                    return;
                }

                keepOverview(win);
                holdOverview(win);
                tapRestoreScroll(win);
                watchInsert(win);
            },
            false
        );

        win.addEventListener('statamic:preview-updated', function () {
            if (!drag || drag.win !== win) {
                return;
            }

            keepOverview(win);
            win.setTimeout(function () {
                finishOnSection(win);
            }, 40);
        });
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
