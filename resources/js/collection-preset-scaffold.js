/**
 * Scaffold Views: pick a VS Code preset instead of Statamic's empty dump.
 *
 * Own CP script — not addon.js. Does not replace Statamic's Scaffold page.
 *
 * Vue owns the Scaffold page (Inertia). A node inserted next to its header is
 * often patched away; the table is a stable hook, and we put the panel back
 * if Vue removes it.
 */
(function () {
    'use strict';

    if (window.__sveCollectionPresetScaffold) {
        return;
    }
    window.__sveCollectionPresetScaffold = true;

    var PANEL_ID = '__sve-collection-preset';
    var PANEL_UI = '6';

    var SELECT_CLASS = [
        'h-10 w-64 max-w-full rounded-lg ps-3 pe-9',
        'appearance-none bg-no-repeat',
        'bg-white dark:bg-gray-900',
        'border border-gray-300 dark:border-gray-700',
        'text-gray-925 dark:text-gray-300',
        'shadow-ui-sm antialiased',
        'cursor-pointer',
    ].join(' ');

    var BUTTON_CLASS = [
        'relative inline-flex items-center justify-center whitespace-nowrap shrink-0',
        'font-medium antialiased cursor-pointer no-underline',
        'px-4 h-10 text-sm gap-2 rounded-lg',
        'bg-linear-to-b from-primary/90 to-primary hover:bg-primary-hover',
        'text-white border border-primary-border shadow-ui-md',
        'inset-shadow-2xs inset-shadow-white/25',
        'disabled:opacity-60 disabled:text-white disabled:inset-shadow-none disabled:cursor-not-allowed',
    ].join(' ');

    function cfg(key, fallback) {
        if (window.StatamicConfig && window.StatamicConfig[key] != null) {
            return window.StatamicConfig[key];
        }

        var store = window.Statamic && window.Statamic.$config;
        var get = store && store.get;
        if (typeof get === 'function') {
            try {
                var value = get.call(store, key);
                if (value != null) {
                    return value;
                }
            } catch (e) {
                // Config not ready yet.
            }
        }

        return fallback;
    }

    function t(key, fallback) {
        var strings = cfg('sveStrings', {}) || {};
        return strings[key] || fallback;
    }

    function csrf() {
        return cfg('csrfToken', '') ||
            (document.querySelector('meta[name="csrf-token"]') || {}).content ||
            '';
    }

    function onScaffold() {
        var path = window.location.pathname || '';
        var match = path.match(/\/collections\/([^/]+)\/scaffold\/?$/);
        if (match) {
            return decodeURIComponent(match[1]);
        }

        if (!document.querySelector('label[for="field_index"]')) {
            return null;
        }

        match = path.match(/\/collections\/([^/]+)\//);
        return match ? decodeURIComponent(match[1]) : null;
    }

    function presets() {
        var list = cfg('sveCollectionPresets', []);
        return Array.isArray(list) ? list : [];
    }

    function featureOn() {
        var features = cfg('sveFeatures', null);
        if (!features || typeof features !== 'object') {
            return null;
        }
        var flag = features.collection_templates;
        return flag === true || flag === 1 || flag === 'true';
    }

    function ensureSelectStyle() {
        if (document.getElementById(PANEL_ID + '-css')) {
            return;
        }

        var style = document.createElement('style');
        style.id = PANEL_ID + '-css';
        style.textContent = [
            '#' + PANEL_ID + ' select {',
            '  -webkit-appearance: none;',
            '  appearance: none;',
            '  background-image: url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%236b7280\' stroke-width=\'2\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' d=\'M6 9l6 6 6-6\'/%3E%3C/svg%3E");',
            '  background-repeat: no-repeat;',
            '  background-position: right 0.85rem center;',
            '  background-size: 0.85rem;',
            '}',
            '.dark #' + PANEL_ID + ' select {',
            '  background-image: url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%239ca3af\' stroke-width=\'2\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' d=\'M6 9l6 6 6-6\'/%3E%3C/svg%3E");',
            '}',
        ].join('\n');
        document.head.appendChild(style);
    }

    function tableEl() {
        var label = document.querySelector('label[for="field_index"]');
        return label ? label.closest('table') : document.querySelector('table.data-table');
    }

    function buildPanel(handle, list) {
        var panel = document.createElement('div');
        panel.id = PANEL_ID;
        panel.setAttribute('data-sve-preset-ui', PANEL_UI);
        panel.className = 'rounded-xl px-4 py-5';
        panel.style.margin = '0 0 1.25rem';
        panel.style.backgroundColor = '#1E1E21';

        var title = document.createElement('div');
        title.textContent = t('collection_preset_label', 'Start from a preset');
        title.style.cssText = 'font-weight:600;margin-bottom:.35rem;';

        var hint = document.createElement('p');
        hint.textContent = list.length
            ? t(
                'collection_preset_hint',
                'Loads the blueprint and index/show views you keep in VS Code. The collection name does not matter.'
            )
            : t(
                'collection_preset_empty',
                'No presets yet. Add a folder in resources/visual-editor/collection-presets (preset.yaml + optional blueprint and views).'
            );
        hint.style.cssText = 'font-size:.875rem;opacity:.8;margin:0 0 .75rem;';

        panel.appendChild(title);
        panel.appendChild(hint);

        if (!list.length) {
            return panel;
        }

        var row = document.createElement('div');
        row.style.cssText = 'display:flex;gap:.5rem;flex-wrap:wrap;align-items:center;';

        var select = document.createElement('select');
        select.className = SELECT_CLASS;
        var blank = document.createElement('option');
        blank.value = '';
        blank.textContent = t('collection_preset_none', 'Choose a preset…');
        select.appendChild(blank);
        list.forEach(function (preset) {
            var option = document.createElement('option');
            option.value = preset.handle;
            option.textContent = preset.title || preset.handle;
            select.appendChild(option);
        });

        var button = document.createElement('button');
        button.type = 'button';
        button.setAttribute('data-ui-button', '');
        button.className = BUTTON_CLASS;
        button.textContent = t('collection_preset_apply', 'Apply preset');

        var error = document.createElement('div');
        error.style.cssText = 'display:none;margin-top:.6rem;font-size:.875rem;color:#f87171;';

        button.addEventListener('click', function () {
            var preset = select.value;
            if (!preset) {
                select.focus();
                return;
            }
            button.disabled = true;
            error.style.display = 'none';
            window.fetch('/!/sve/collection-presets/apply', {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrf(),
                    'X-Requested-With': 'XMLHttpRequest',
                    Accept: 'application/json',
                },
                body: JSON.stringify({ collection: handle, preset: preset }),
            })
                .then(function (res) { return res.json().then(function (data) { return { ok: res.ok, data: data }; }); })
                .then(function (result) {
                    if (!result.ok || !result.data || !result.data.redirect) {
                        throw new Error((result.data && result.data.message) || t('collection_preset_failed', 'Could not apply the preset.'));
                    }
                    window.location.href = result.data.redirect;
                })
                .catch(function (err) {
                    button.disabled = false;
                    error.textContent = err.message || t('collection_preset_failed', 'Could not apply the preset.');
                    error.style.display = 'block';
                });
        });

        row.appendChild(select);
        row.appendChild(button);
        panel.appendChild(row);
        panel.appendChild(error);

        return panel;
    }

    function mount() {
        var handle = onScaffold();
        var table = tableEl();
        var existing = document.getElementById(PANEL_ID);

        if (!handle) {
            if (existing) {
                existing.remove();
            }
            return;
        }

        if (featureOn() === false) {
            return;
        }

        if (!table || !table.parentNode) {
            return;
        }

        if (existing && existing.getAttribute('data-sve-preset-ui') === PANEL_UI && existing.parentNode === table.parentNode && existing.nextSibling === table) {
            return;
        }

        if (existing) {
            existing.remove();
        }

        ensureSelectStyle();
        table.parentNode.insertBefore(buildPanel(handle, presets()), table);
    }

    window.setInterval(mount, 250);
})();
