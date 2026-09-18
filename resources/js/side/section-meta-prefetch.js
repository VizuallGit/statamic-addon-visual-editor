/**
 * Starter section-meta før klik, så insert ikke venter på det første HTTP-kald.
 *
 * - Bibliotekskort: hover/pointerdown (page, custom, global, template).
 * - Klik på et bibliotekskort indsætter ikke — kun drag-and-drop i preview.
 * - Search Sets over preview: hover på Headline / Richtext / Links / andre sæt.
 * - "+" med kun ét sæt (fx Hero-liste med item): hover på listen eller plusset.
 *
 * Eget CP-script — ikke addon.js. Rører ikke overlay-host / preview / bridge.
 */
(function () {
    'use strict';

    if (window.__sveSectionMetaPrefetch) {
        return;
    }
    window.__sveSectionMetaPrefetch = true;

    var inflight = new Map();
    var nestedCache = window.__sveSectionMetaCache || new Map();
    var lastPicker = null;
    var PICKER_MS = 20000;

    window.__sveSectionMetaCache = nestedCache;

    /**
     * Insert uses win.fetch for section-meta. sve is a module, not window.sve,
     * so we cache that GET here. Hover and click then share one round-trip.
     */
    function wrapFetch() {
        if (window.__sveFetchWrapped) {
            return;
        }

        try {
            var orig = window.fetch.bind(window);
            var jsonCache = window.__sveSectionMetaJson || new Map();
            var inflightJson = new Map();

            window.__sveSectionMetaJson = jsonCache;

            function asJsonResponse(data) {
                return new Response(JSON.stringify(data), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' },
                });
            }

            window.fetch = function (input, init) {
                var url = typeof input === 'string' ? input : (input && input.url) || '';
                var key;

                if (url.indexOf('/!/sve/section-meta?') === -1) {
                    return orig(input, init);
                }

                key = String(url).split('#')[0];

                if (jsonCache.has(key)) {
                    return Promise.resolve(asJsonResponse(jsonCache.get(key)));
                }

                if (inflightJson.has(key)) {
                    return inflightJson.get(key).then(asJsonResponse);
                }

                var dataPromise = orig(input, init)
                    .then(function (res) {
                        if (!res.ok) {
                            inflightJson.delete(key);

                            throw new Error('section-meta ' + res.status);
                        }

                        return res.json();
                    })
                    .then(function (data) {
                        jsonCache.set(key, data);
                        inflightJson.delete(key);

                        return data;
                    })
                    .catch(function (err) {
                        inflightJson.delete(key);
                        throw err;
                    });

                inflightJson.set(key, dataPromise);

                return dataPromise.then(asJsonResponse);
            };

            window.__sveFetchWrapped = true;
            window.__sveFetchWrapErr = null;
        } catch (err) {
            window.__sveFetchWrapErr = String(err && err.message ? err.message : err);
        }
    }

    wrapFetch();

    var libDragMoved = false;
    var libDragX = 0;
    var libDragY = 0;
    var savedListP = { p: null, at: 0 };
    var templatesP = { p: null, at: 0 };

    function metaFetch(handle) {
        var collection;
        var url;
        var pending;

        wrap();

        if (!handle) {
            return;
        }

        if (window.sve && typeof sve.fetchSetMeta === 'function') {
            sve.fetchSetMeta(window, handle);

            return;
        }

        collection = collectionHandle();

        if (!collection) {
            return;
        }

        if (nestedCache.has(handle)) {
            return;
        }

        url =
            '/!/sve/section-meta?collection=' +
            encodeURIComponent(collection) +
            '&set=' +
            encodeURIComponent(handle);

        pending = window
            .fetch(url, {
                credentials: 'same-origin',
                headers: { 'X-Requested-With': 'XMLHttpRequest' },
            })
            .then(function (res) {
                return res.ok ? res.json() : null;
            })
            .then(function (data) {
                if (!data) {
                    nestedCache.delete(handle);
                }

                return data;
            })
            .catch(function () {
                nestedCache.delete(handle);

                return null;
            });

        nestedCache.set(handle, pending);
    }

    function jsonList(cache, url) {
        if (cache.p && Date.now() - cache.at < 20000) {
            return cache.p;
        }

        cache.at = Date.now();
        cache.p = window
            .fetch(url, {
                credentials: 'same-origin',
                headers: { 'X-Requested-With': 'XMLHttpRequest' },
            })
            .then(function (res) {
                return res.ok ? res.json() : {};
            })
            .catch(function () {
                cache.p = null;

                return {};
            });

        return cache.p;
    }

    function libraryKind() {
        var on = document.querySelector('.sve-lib-tabs button.is-on[data-tab]');

        return (on && on.getAttribute('data-tab')) || '';
    }

    function prefetchLibraryCard(card) {
        var kind = (card.getAttribute('data-sve-lib-kind') || libraryKind() || '').toLowerCase();
        var handle = card.getAttribute('data-sve-lib-handle');
        var set = card.getAttribute('data-sve-lib-set');
        var id = handle;

        wrap();

        if (set) {
            metaFetch(set);

            return;
        }

        if (kind === 'page' && handle) {
            metaFetch(handle);

            return;
        }

        if (kind === 'global' && window.sve && typeof sve.globalSectionSet === 'function') {
            metaFetch(sve.globalSectionSet(window));

            return;
        }

        if (kind === 'custom' && id) {
            jsonList(savedListP, '/!/sve/saved-sections').then(function (data) {
                var items = data.sections || [];
                var item = items.find(function (row) {
                    return String(row.id) === String(id);
                });

                if (item && item.section_type) {
                    metaFetch(item.section_type);
                }
            });

            return;
        }

        if (kind === 'template' && id) {
            jsonList(templatesP, '/!/sve/templates').then(function (data) {
                var items = data.templates || [];
                var item = items.find(function (row) {
                    return String(row.id) === String(id);
                });
                var sections = (item && item.sections) || [];

                sections.forEach(function (section) {
                    if (section && section.type) {
                        metaFetch(section.type);
                    }
                });
            });

            return;
        }

        if (handle && handle.indexOf('-') === -1) {
            metaFetch(handle);
        }
    }

    function nestedKey(field, setHandle, sectionType) {
        return String(field) + '::' + String(setHandle) + '::' + String(sectionType || '');
    }

    function collectionHandle() {
        var match = window.location.pathname.match(/\/collections\/([^/]+)\//);

        return match ? match[1] : null;
    }

    function flattenSets(raw) {
        if (!Array.isArray(raw) || !raw.length) {
            return [];
        }

        if (raw[0] && raw[0].handle && !raw[0].sets) {
            return raw;
        }

        var out = [];

        raw.forEach(function (group) {
            var inner = group && group.sets;

            if (!Array.isArray(inner)) {
                return;
            }

            inner.forEach(function (set) {
                if (set && set.handle) {
                    out.push(set);
                }
            });
        });

        return out;
    }

    function wrap() {
        var sve = window.sve;

        if (!sve || typeof sve.fetchSetMeta !== 'function' || sve.fetchSetMeta.__svePrefetch) {
            return;
        }

        var orig = sve.fetchSetMeta;

        sve.fetchSetMeta = function (win, setHandle) {
            if (sve.sectionMetaCache && sve.sectionMetaCache.has(setHandle)) {
                return Promise.resolve(sve.sectionMetaCache.get(setHandle));
            }

            if (inflight.has(setHandle)) {
                return inflight.get(setHandle);
            }

            var pending = Promise.resolve(orig(win, setHandle)).finally(function () {
                inflight.delete(setHandle);
            });

            inflight.set(setHandle, pending);

            return pending;
        };

        sve.fetchSetMeta.__svePrefetch = true;
    }

    function wrapNested() {
        var sve = window.sve;

        if (!sve || typeof sve.fetchNestedSetMeta !== 'function' || sve.fetchNestedSetMeta.__svePrefetch) {
            return;
        }

        var orig = sve.fetchNestedSetMeta;

        sve.fetchNestedSetMeta = function (win, field, setHandle, sectionType) {
            return prefetchNested(field, setHandle, sectionType || '', orig, win);
        };

        sve.fetchNestedSetMeta.__svePrefetch = true;
    }

    function startNested(field, setHandle, sectionType) {
        wrapNested();

        if (window.sve && typeof sve.fetchNestedSetMeta === 'function') {
            sve.fetchNestedSetMeta(window, field, setHandle, sectionType || '');

            return;
        }

        prefetchNested(field, setHandle, sectionType || '');
    }

    function prefetchNested(field, setHandle, sectionType, orig, win) {
        var key;
        var cached;
        var collection;
        var pending;
        var view = win || window;

        if (!field || !setHandle) {
            return Promise.resolve(null);
        }

        wrapNested();
        key = nestedKey(field, setHandle, sectionType);
        cached = nestedCache.get(key);

        if (cached !== undefined) {
            return Promise.resolve(cached);
        }

        if (typeof orig === 'function') {
            pending = Promise.resolve(orig(view, field, setHandle, sectionType || '')).then(function (data) {
                if (!data) {
                    nestedCache.delete(key);
                }

                return data;
            }).catch(function () {
                nestedCache.delete(key);

                return null;
            });

            nestedCache.set(key, pending);

            return pending;
        }

        collection = collectionHandle();

        if (!collection) {
            return Promise.resolve(null);
        }

        pending = view
            .fetch(
                '/!/sve/section-meta?collection=' +
                    encodeURIComponent(collection) +
                    '&field=' +
                    encodeURIComponent(field) +
                    '&set=' +
                    encodeURIComponent(setHandle) +
                    (sectionType ? '&section=' + encodeURIComponent(sectionType) : ''),
                {
                    credentials: 'same-origin',
                    headers: { 'X-Requested-With': 'XMLHttpRequest' },
                }
            )
            .then(function (res) {
                return res.ok ? res.json() : null;
            })
            .then(function (data) {
                if (!data) {
                    nestedCache.delete(key);
                }

                return data;
            })
            .catch(function () {
                nestedCache.delete(key);

                return null;
            });

        nestedCache.set(key, pending);

        return pending;
    }

    function rememberPicker(data) {
        if (!data || !data.field) {
            return;
        }

        lastPicker = {
            field: data.field,
            sets: flattenSets(data.sets),
            sectionType: data.sectionType || '',
            at: Date.now(),
        };
    }

    function pickerSetHandle(event, sets) {
        var target = event.target;
        var row;
        var label;
        var match;

        if (!target || !target.closest || !sets || !sets.length) {
            return null;
        }

        if (target.closest('input, textarea, [data-set-picker-search-input]')) {
            return null;
        }

        row =
            target.closest('#sve-bard-set-fallback button') ||
            target.closest('[data-sve-set-picker-host] .cursor-pointer') ||
            target.closest('[data-set-picker-popover] .cursor-pointer');

        if (!row) {
            return null;
        }

        label = (row.innerText || '').split('\n')[0].replace(/\s+/g, ' ').trim().toLowerCase();

        if (!label || label === 'search sets' || label === 'groups' || label === 'all') {
            return null;
        }

        match = sets.find(function (set) {
            var display = String(set.display || '').toLowerCase();
            var handle = String(set.handle || '').toLowerCase();

            return display === label || handle === label;
        });

        if (!match) {
            match = sets.find(function (set) {
                var display = String(set.display || set.handle || '').toLowerCase();

                return display && label.indexOf(display) === 0;
            });
        }

        return match ? match.handle : null;
    }

    function parseSets(el) {
        try {
            return flattenSets(JSON.parse(el.getAttribute('data-sid-insert-sets') || '[]'));
        } catch (err) {
            return [];
        }
    }

    function prefetchSoloEl(el) {
        var sets;
        var field;

        if (!el || el.__sveSoloPrefetched) {
            return;
        }

        sets = parseSets(el);
        field = el.getAttribute('data-sid-insert');

        if (!field || sets.length !== 1 || !sets[0].handle) {
            return;
        }

        el.__sveSoloPrefetched = true;
        startNested(field, sets[0].handle, '');
    }

    function prefetchSoloIn(doc) {
        if (!doc || !doc.querySelectorAll) {
            return;
        }

        doc.querySelectorAll('[data-sid-insert]').forEach(prefetchSoloEl);
    }

    function onPreviewPointer(event) {
        var target = event.target;
        var insert;

        wrap();
        wrapNested();

        if (!target || !target.closest) {
            return;
        }

        if (target.closest('#__sve-inserters')) {
            prefetchSoloIn(event.currentTarget);
            return;
        }

        insert = target.closest('[data-sid-insert]');

        if (insert) {
            prefetchSoloEl(insert);
        }
    }

    function bindPreviewDoc(doc) {
        if (!doc || doc.__sveMetaPrefetchBound) {
            return;
        }

        doc.__sveMetaPrefetchBound = true;
        doc.addEventListener('pointerenter', onPreviewPointer, true);
    }

    function bindPreviewFrames() {
        var iframe = document.getElementById('live-preview-iframe');
        var nested;

        if (!iframe) {
            return;
        }

        try {
            bindPreviewDoc(iframe.contentDocument);
            nested = iframe.contentDocument && iframe.contentDocument.getElementById('live-preview-iframe');

            if (nested) {
                bindPreviewDoc(nested.contentDocument);
            }
        } catch (err) {
            /* cross-origin */
        }
    }

    var libCardDown = false;

    document.addEventListener(
        'pointerdown',
        function (event) {
            var card = event.target && event.target.closest && event.target.closest('[data-sve-lib-handle]');

            if (!card || event.button !== 0 || event.target.closest('button, .sve-lib-card__del, a')) {
                libCardDown = false;

                return;
            }

            libCardDown = true;
            libDragMoved = false;
            libDragX = event.clientX;
            libDragY = event.clientY;
            prefetchLibraryCard(card);
        },
        true
    );

    document.addEventListener(
        'pointermove',
        function (event) {
            if (!libCardDown || event.buttons !== 1) {
                return;
            }

            if (Math.hypot(event.clientX - libDragX, event.clientY - libDragY) >= 6) {
                libDragMoved = true;
            }
        },
        true
    );

    window.addEventListener(
        'pointerup',
        function (event) {
            if (!libCardDown) {
                return;
            }

            libCardDown = false;

            if (libDragMoved) {
                return;
            }

            event.stopPropagation();
        },
        true
    );

    document.addEventListener(
        'pointerover',
        function (event) {
            var card = event.target && event.target.closest && event.target.closest('[data-sve-lib-handle]');

            if (card) {
                prefetchLibraryCard(card);
            }
        },
        true
    );

    document.addEventListener(
        'pointerenter',
        function (event) {
            var target = event.target;
            var popover;
            var handle;

            wrap();
            wrapNested();

            if (!target || !target.closest || !lastPicker || !lastPicker.field) {
                return;
            }

            if (Date.now() - lastPicker.at > PICKER_MS) {
                return;
            }

            popover = target.closest(
                '[data-sve-set-picker-host], [data-set-picker-popover], #sve-bard-set-fallback'
            );

            if (!popover) {
                return;
            }

            handle = pickerSetHandle(event, lastPicker.sets);

            if (handle) {
                startNested(lastPicker.field, handle, lastPicker.sectionType);
            }
        },
        true
    );

    window.addEventListener('message', function (event) {
        var data = event.data;

        if (!data || data.source !== 'statamic-visual-editor') {
            return;
        }

        if (data.type === 'add-block-native' || data.type === 'add-bard-set-native') {
            rememberPicker(data);
            wrapNested();
        }
    });

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
