/**
 * Starter section-meta, når man tager fat i et bibliotekskort.
 * Droppet venter så ikke på det første HTTP-kald.
 *
 * Eget CP-script — ikke addon.js.
 */
(function () {
    'use strict';

    if (window.__sveSectionMetaPrefetch) {
        return;
    }
    window.__sveSectionMetaPrefetch = true;

    var inflight = new Map();

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

    document.addEventListener(
        'pointerdown',
        function (event) {
            wrap();

            var card = event.target && event.target.closest && event.target.closest('[data-sve-lib-handle]');

            if (!card || !window.sve || typeof sve.fetchSetMeta !== 'function') {
                return;
            }

            var handle = card.getAttribute('data-sve-lib-handle');

            if (handle) {
                sve.fetchSetMeta(window, handle);
            }
        },
        true
    );
})();
