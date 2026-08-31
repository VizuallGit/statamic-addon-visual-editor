/**
 * Live Preview top bar: pick which entry a collection show-template is previewed as.
 *
 * Own CP script — not addon.js. Does not touch overlay-host / preview / bridge.
 */
(function () {
    'use strict';

    if (window.__sveCollectionViewPicker) {
        return;
    }
    window.__sveCollectionViewPicker = true;

    var SELECT_ID = '__sve-collection-view-as';
    var container = null;
    var lastSource = null;
    var fetching = false;
    var timer = null;

    function cfg(key, fallback) {
        var get = window.Statamic && window.Statamic.$config && window.Statamic.$config.get;
        if (typeof get !== 'function') {
            return fallback;
        }
        var value = get(key);
        return value == null ? fallback : value;
    }

    function t(key, fallback) {
        var strings = cfg('sveStrings', {}) || {};
        return strings[key] || fallback;
    }

    function featureOn() {
        var features = cfg('sveFeatures', {}) || {};
        return features.collection_templates === true;
    }

    function storeHandle() {
        return cfg('sveCollectionTemplatesCollection', 'templates');
    }

    function onTemplateEntry() {
        var path = window.location.pathname || '';
        var handle = storeHandle();
        return path.indexOf('/collections/' + handle + '/entries/') !== -1;
    }

    function inLivePreview() {
        return !!document.querySelector('.live-preview-header');
    }

    function kindOf() {
        if (!container || !container.values) {
            return null;
        }
        var values = typeof container.values === 'function' ? container.values() : container.values;
        if (values && typeof values === 'object' && values.kind) {
            return values.kind;
        }
        return null;
    }

    function sourceOf() {
        if (!container || !container.values) {
            return null;
        }
        var values = typeof container.values === 'function' ? container.values() : container.values;
        return values && values.source_collection ? values.source_collection : null;
    }

    function currentPreviewId() {
        if (!container || !container.values) {
            return '';
        }
        var values = typeof container.values === 'function' ? container.values() : container.values;
        var picked = values && values.preview_as;
        if (Array.isArray(picked)) {
            return picked[0] || '';
        }
        return picked || '';
    }

    function setPreviewAs(id) {
        if (!container || typeof container.setFieldValue !== 'function') {
            return;
        }
        container.setFieldValue('preview_as', id ? [id] : []);
    }

    function header() {
        return document.querySelector('.live-preview-header');
    }

    function ensureSelect() {
        var bar = header();
        if (!bar) {
            return null;
        }
        var existing = document.getElementById(SELECT_ID);
        if (existing) {
            return existing;
        }
        var wrap = document.createElement('label');
        wrap.setAttribute('data-sve-collection-view-as', '1');
        wrap.style.cssText = 'display:flex;align-items:center;gap:8px;margin-left:12px;font-size:12px;color:inherit;';
        var caption = document.createElement('span');
        caption.textContent = t('collection_view_preview_as', 'Preview as');
        var select = document.createElement('select');
        select.id = SELECT_ID;
        select.style.cssText = 'max-width:220px;font-size:12px;';
        wrap.appendChild(caption);
        wrap.appendChild(select);
        bar.appendChild(wrap);
        select.addEventListener('change', function () {
            setPreviewAs(select.value);
        });
        return select;
    }

    function fill(select, entries) {
        var current = currentPreviewId();
        select.innerHTML = '';
        var sample = document.createElement('option');
        sample.value = '';
        sample.textContent = t('collection_view_sample', 'Sample data');
        select.appendChild(sample);
        (entries || []).forEach(function (entry) {
            var option = document.createElement('option');
            option.value = entry.id;
            option.textContent = entry.title || entry.id;
            select.appendChild(option);
        });
        select.value = current;
        if (current && select.value !== current) {
            select.value = '';
        }
    }

    function load() {
        if (
            !featureOn() ||
            !onTemplateEntry() ||
            !inLivePreview() ||
            kindOf() !== 'show' ||
            document.getElementById('__sve-entry-picker')
        ) {
            var leftover = document.getElementById(SELECT_ID);
            if (leftover && leftover.parentNode) {
                leftover.parentNode.remove();
            }
            lastSource = null;
            return;
        }
        var source = sourceOf();
        if (!source) {
            return;
        }
        var select = ensureSelect();
        if (!select) {
            return;
        }
        if (fetching || (lastSource === source && select.options.length > 1)) {
            return;
        }
        fetching = true;
        lastSource = source;
        window.fetch('/!/sve/collections/' + encodeURIComponent(source) + '/entries', {
            credentials: 'same-origin',
            headers: { 'X-Requested-With': 'XMLHttpRequest' },
        })
            .then(function (res) { return res.ok ? res.json() : { entries: [] }; })
            .then(function (data) { fill(select, data.entries || []); })
            .catch(function () { fill(select, []); })
            .finally(function () { fetching = false; });
    }

    function schedule() {
        window.clearTimeout(timer);
        timer = window.setTimeout(load, 200);
    }

    function bindEvents() {
        var events = window.Statamic && window.Statamic.$events;
        if (!events || typeof events.$on !== 'function') {
            return;
        }
        events.$on('publish-container-created', function (payload) {
            if (payload && typeof payload.setFieldValue === 'function') {
                container = payload;
                schedule();
            }
        });
    }

    bindEvents();
    document.addEventListener('DOMContentLoaded', schedule);
    new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true });
})();
