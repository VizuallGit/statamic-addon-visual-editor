/**
 * A rejected save, said in a way the person who pressed Save can act on.
 *
 * Statamic answers a rejected save with 422 and a per-field `errors` object,
 * but the CP can only draw those errors on the fields themselves. In Live
 * Preview the offending field is usually not on screen — the left column holds
 * the header form, not the entry's — so everything that survives is the generic
 * "The given data was invalid." A layout template rejected for a missing
 * `source_collection` says exactly that and nothing more.
 *
 * Own CP script, not addon.js, and deliberately so: the save chain in
 * globals-panel.js already patches fetch and XHR, and it owns `globalsStashEpoch`
 * and the unsaved-changes bar. This one only *reads* responses — it never
 * changes one, never resolves one, and never decides whether a save happened.
 * A classic script rather than a module, like dedupe-cp-fetch.js, so it is in
 * place before any bundle evaluates.
 */
(function () {
    'use strict';

    if (window.__sveSaveErrors) {
        return;
    }

    window.__sveSaveErrors = true;

    var TEXT = {
        title: 'Det kunne ikke gemmes',
        oneField: 'Ét felt skal rettes:',
        manyFields: 'Disse felter skal rettes:',
        noFields: 'Serveren afviste det, men fortalte ikke hvilket felt det drejer sig om.',
        offscreen: 'Feltet vises ikke her — det hører til et andet sted i opsætningen. Kopiér detaljerne og send dem til en udvikler.',
        copy: 'Kopiér detaljer',
        copied: 'Kopieret',
        close: 'Luk',
        row: 'række',
    };

    /* "The Collection field is required." → "skal udfyldes", and the field's own
     * name, which Statamic has already put in the sentence. Read from the
     * message rather than translated from the path, because the message carries
     * the display label and the path carries only the handle. */
    var PATTERNS = [
        [/^The (.+) field is required\.?$/i, 'skal udfyldes'],
        [/^The (.+) field must be a?n? ?\w+\.?$/i, 'har et forkert format'],
        [/^The (.+) field must not be greater than .+\.?$/i, 'er for langt'],
        [/^The (.+) field must be at least .+\.?$/i, 'er for kort'],
        [/^The (.+) has already been taken\.?$/i, 'er allerede i brug'],
        [/^The (.+) field must be a valid (?:URL|email).*$/i, 'er ikke skrevet rigtigt'],
    ];

    function labelFromMessage(message) {
        for (var i = 0; i < PATTERNS.length; i++) {
            var hit = PATTERNS[i][0].exec(String(message || '').trim());

            if (hit) {
                return { label: hit[1], reason: PATTERNS[i][1] };
            }
        }

        return null;
    }

    /* `blocks.0.widgets.1.logo` reads as nothing at all. Numbers are rows, and a
     * person counts from one. */
    function readablePath(path) {
        return String(path || '')
            .split('.')
            .map(function (part) {
                return /^\d+$/.test(part) ? TEXT.row + ' ' + (Number(part) + 1) : part;
            })
            .join(' › ');
    }

    function lines(body) {
        var errors = body && body.errors;
        var out = [];

        if (errors && typeof errors === 'object') {
            Object.keys(errors).forEach(function (path) {
                var list = [].concat(errors[path]);

                list.forEach(function (message) {
                    var read = labelFromMessage(message);

                    out.push({
                        name: read ? read.label : readablePath(path),
                        said: read ? read.reason : String(message),
                        path: path,
                        raw: String(message),
                    });
                });
            });
        }

        return out;
    }

    var host = null;

    function close() {
        if (host && host.parentNode) {
            host.parentNode.removeChild(host);
        }

        host = null;
    }

    function styles(doc) {
        if (doc.getElementById('sve-save-errors-css')) {
            return;
        }

        var el = doc.createElement('style');

        el.id = 'sve-save-errors-css';
        /* Unlayered on purpose: Statamic v6 puts its own CSS in cascade layers,
         * and unlayered rules win over layered ones regardless of specificity.
         * Everything here is scoped to .sve-save-error, so nothing else moves. */
        el.textContent = [
            '.sve-save-error{position:fixed;z-index:99999;left:50%;bottom:1.5rem;transform:translateX(-50%);',
            'width:min(32rem,calc(100vw - 2rem));background:#fff;color:#1f2430;border:1px solid rgba(0,0,0,.08);',
            'border-radius:.75rem;box-shadow:0 1.25rem 3rem rgba(15,20,35,.22);padding:1.125rem 1.25rem;',
            'font:normal 0.875rem/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}',
            '.sve-save-error__head{display:flex;align-items:center;gap:.5em;font-weight:600;font-size:1em;margin:0 0 .5em}',
            '.sve-save-error__dot{width:.6em;height:.6em;border-radius:50%;background:#e5484d;flex:0 0 auto}',
            '.sve-save-error__lead{margin:0 0 .5em;color:#5b6172}',
            '.sve-save-error__list{margin:0 0 .75em;padding:0;list-style:none}',
            '.sve-save-error__item{padding:.4em 0;border-top:1px solid rgba(0,0,0,.06)}',
            '.sve-save-error__name{font-weight:600}',
            '.sve-save-error__where{display:block;color:#8a90a2;font-size:.85em;margin-top:.15em}',
            '.sve-save-error__note{margin:0 0 .75em;color:#5b6172;font-size:.9em}',
            '.sve-save-error__buttons{display:flex;gap:.5em;justify-content:flex-end}',
            '.sve-save-error__btn{font:inherit;font-size:.9em;padding:.4em .9em;border-radius:.4em;cursor:pointer;',
            'border:1px solid rgba(0,0,0,.12);background:#fff;color:#1f2430}',
            '.sve-save-error__btn--primary{background:#1f2430;border-color:#1f2430;color:#fff}',
            '@media (prefers-color-scheme:dark){',
            '.sve-save-error{background:#1b1f2a;color:#eef0f5;border-color:rgba(255,255,255,.1)}',
            '.sve-save-error__lead,.sve-save-error__note{color:#a7adbe}',
            '.sve-save-error__item{border-top-color:rgba(255,255,255,.08)}',
            '.sve-save-error__btn{background:#252a37;border-color:rgba(255,255,255,.14);color:#eef0f5}',
            '.sve-save-error__btn--primary{background:#eef0f5;border-color:#eef0f5;color:#1b1f2a}}',
        ].join('');

        doc.head.appendChild(el);
    }

    function show(found, body, url) {
        var doc = window.document;

        close();
        styles(doc);

        host = doc.createElement('div');
        host.className = 'sve-save-error';
        host.setAttribute('role', 'alert');

        var head = doc.createElement('p');

        head.className = 'sve-save-error__head';

        var dot = doc.createElement('span');

        dot.className = 'sve-save-error__dot';
        head.appendChild(dot);
        head.appendChild(doc.createTextNode(TEXT.title));
        host.appendChild(head);

        var lead = doc.createElement('p');

        lead.className = 'sve-save-error__lead';
        lead.textContent = found.length === 0
            ? TEXT.noFields
            : (found.length === 1 ? TEXT.oneField : TEXT.manyFields);
        host.appendChild(lead);

        if (found.length) {
            var list = doc.createElement('ul');

            list.className = 'sve-save-error__list';

            found.forEach(function (one) {
                var item = doc.createElement('li');

                item.className = 'sve-save-error__item';

                var name = doc.createElement('span');

                name.className = 'sve-save-error__name';
                name.textContent = one.name;
                item.appendChild(name);
                item.appendChild(doc.createTextNode(' ' + one.said));

                var where = doc.createElement('span');

                where.className = 'sve-save-error__where';
                where.textContent = readablePath(one.path);
                item.appendChild(where);

                list.appendChild(item);
            });

            host.appendChild(list);

            var note = doc.createElement('p');

            note.className = 'sve-save-error__note';
            note.textContent = TEXT.offscreen;
            host.appendChild(note);
        }

        var buttons = doc.createElement('div');

        buttons.className = 'sve-save-error__buttons';

        var copy = doc.createElement('button');

        copy.type = 'button';
        copy.className = 'sve-save-error__btn';
        copy.textContent = TEXT.copy;
        copy.addEventListener('click', function () {
            var detail = [
                url,
                body && body.message ? body.message : '',
                found.map(function (one) { return one.path + ': ' + one.raw; }).join('\n'),
            ].filter(Boolean).join('\n');

            try {
                window.navigator.clipboard.writeText(detail);
                copy.textContent = TEXT.copied;
            } catch (e) {
                /* Clipboard refused (insecure context, or denied). The detail is
                 * still in the console, which is where it was going anyway. */
            }

            /* eslint-disable-next-line no-console */
            console.info('[sve] save rejected\n' + detail);
        });

        var dismiss = doc.createElement('button');

        dismiss.type = 'button';
        dismiss.className = 'sve-save-error__btn sve-save-error__btn--primary';
        dismiss.textContent = TEXT.close;
        dismiss.addEventListener('click', close);

        buttons.appendChild(copy);
        buttons.appendChild(dismiss);
        host.appendChild(buttons);

        doc.body.appendChild(host);
    }

    /* A rejected *save*, not every failed request. GETs fail for reasons a
     * person cannot act on (a poll, a prefetch, a screen that went away), and a
     * box about those would be noise on top of noise. */
    function isSave(method) {
        return /^(POST|PUT|PATCH)$/i.test(method || 'GET');
    }

    function ours(url) {
        try {
            var path = new URL(url, window.location.origin).pathname;

            return path.indexOf('/cp/') === 0 || path.indexOf('/!/') === 0;
        } catch (e) {
            return false;
        }
    }

    function handle(url, status, method, text) {
        if (status < 400 || status === 401 || status === 419 || !isSave(method) || !ours(url)) {
            return;
        }

        var body;

        try {
            body = JSON.parse(text);
        } catch (e) {
            return;
        }

        if (!body || typeof body !== 'object') {
            return;
        }

        show(lines(body), body, url);
    }

    var originalFetch = window.fetch;

    if (typeof originalFetch === 'function') {
        window.fetch = function (input, init) {
            var url = typeof input === 'string' ? input : (input && input.url);
            var method = (init && init.method) || (typeof input === 'object' && input ? input.method : null);
            var answer = originalFetch.apply(this, arguments);

            /* The clone is read on the side. The caller's response is handed on
             * untouched and un-awaited, so nothing downstream waits on us. */
            answer.then(function (response) {
                if (response && !response.ok) {
                    response.clone().text().then(function (text) {
                        handle(url || response.url, response.status, method, text);
                    }, function () {});
                }
            }, function () {});

            return answer;
        };
    }

    var XHR = window.XMLHttpRequest;
    var originalOpen = XHR && XHR.prototype.open;
    var originalSend = XHR && XHR.prototype.send;

    if (!originalSend) {
        return;
    }

    XHR.prototype.open = function (method, url) {
        this.__sveMethod = method;
        this.__sveUrl = url;

        return originalOpen.apply(this, arguments);
    };

    XHR.prototype.send = function () {
        var xhr = this;

        xhr.addEventListener('load', function () {
            try {
                handle(xhr.responseURL || xhr.__sveUrl, xhr.status, xhr.__sveMethod, xhr.responseText);
            } catch (e) {
                /* Never let a reporting failure become the failure. */
            }
        });

        return originalSend.apply(this, arguments);
    };
})();
