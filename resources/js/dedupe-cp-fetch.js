/**
 * Iconify and Bard colour each fetch the same CP JSON once per field.
 * One GET, shared body — not a wrap of those fieldtypes' Vue.
 *
 * Own CP script, not addon.js. Must run before fields mount.
 */
(function () {
    'use strict';

    var orig = window.fetch;

    if (!orig || orig.__sveDedupeCpFetch) {
        return;
    }

    var inflight = Object.create(null);
    var cache = Object.create(null);

    function urlOf(input) {
        if (typeof input === 'string') {
            return input;
        }

        if (input && typeof input.url === 'string') {
            return input.url;
        }

        return '';
    }

    function methodOf(input, init) {
        if (init && init.method) {
            return String(init.method).toUpperCase();
        }

        if (input && typeof input === 'object' && input.method) {
            return String(input.method).toUpperCase();
        }

        return 'GET';
    }

    function cacheKey(input, init) {
        var raw;
        var path;

        if (methodOf(input, init) !== 'GET') {
            return null;
        }

        raw = urlOf(input);

        if (!raw) {
            return null;
        }

        try {
            path = new URL(raw, window.location.origin).pathname.replace(/\/+$/, '');
        } catch (err) {
            path = String(raw).split('?')[0].replace(/\/+$/, '');
        }

        if (path === '/color-scheme/swatches' || path.slice(-22) === '/color-scheme/swatches') {
            return 'swatches';
        }

        if (path === '/iconify/config' || path.slice(-15) === '/iconify/config') {
            return 'iconify-config';
        }

        return null;
    }

    function replay(stored) {
        return new Response(stored.body, {
            status: stored.status,
            statusText: stored.statusText,
            headers: stored.headers,
        });
    }

    function storeFrom(res) {
        var headers = {};

        if (res.headers && typeof res.headers.forEach === 'function') {
            res.headers.forEach(function (value, name) {
                headers[name] = value;
            });
        }

        return res.text().then(function (body) {
            return {
                ok: res.ok,
                status: res.status,
                statusText: res.statusText,
                headers: headers,
                body: body,
            };
        });
    }

    window.fetch = function (input, init) {
        var key = cacheKey(input, init);
        var pending;

        if (!key) {
            return orig.apply(this, arguments);
        }

        if (cache[key]) {
            return Promise.resolve(replay(cache[key]));
        }

        pending = inflight[key];

        if (!pending) {
            pending = orig.apply(this, arguments).then(storeFrom).then(function (stored) {
                delete inflight[key];

                if (stored.ok) {
                    cache[key] = stored;
                }

                return stored;
            }, function (err) {
                delete inflight[key];
                throw err;
            });

            inflight[key] = pending;
        }

        return pending.then(replay);
    };

    window.fetch.__sveDedupeCpFetch = true;
})();
