import { mark } from '../lib/debug.js';

/**
 * Live Preview top bar: pick which entry a collection show-template is previewed as.
 *
 * Own CP script — not addon.js. Does not touch overlay-host / preview / bridge.
 */
import { t } from '../lib/i18n.js';
import { collectionTemplatesCollection, featureOn as featureIsOn } from '../lib/config.js';

(function () {
  'use strict';

  mark('collection-template-picker');

  const SELECT_ID = '__sve-collection-view-as';
  let container = null;
  let lastSource = null;
  let fetching = false;
  let timer = null;

  function featureOn() {
    return featureIsOn(window, 'collection_templates');
  }

  function storeHandle() {
    return collectionTemplatesCollection(window);
  }

  function onTemplateEntry() {
    const path = window.location.pathname || '';
    const handle = storeHandle();
    return path.indexOf('/collections/' + handle + '/entries/') !== -1;
  }

  function inLivePreview() {
    return !!document.querySelector('.live-preview-header');
  }

  function kindOf() {
    if (!container || !container.values) {
      return null;
    }
    const values = typeof container.values === 'function' ? container.values() : container.values;
    if (values && typeof values === 'object' && values.kind) {
      return values.kind;
    }
    return null;
  }

  function sourceOf() {
    if (!container || !container.values) {
      return null;
    }
    const values = typeof container.values === 'function' ? container.values() : container.values;
    return values && values.source_collection ? values.source_collection : null;
  }

  function currentPreviewId() {
    if (!container || !container.values) {
      return '';
    }
    const values = typeof container.values === 'function' ? container.values() : container.values;
    const picked = values && values.preview_as;
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
    const bar = header();
    if (!bar) {
      return null;
    }
    const existing = document.getElementById(SELECT_ID);
    if (existing) {
      return existing;
    }
    const wrap = document.createElement('label');
    wrap.setAttribute('data-sve-collection-view-as', '1');
    wrap.style.cssText = 'display:flex;align-items:center;gap:8px;margin-left:12px;font-size:12px;color:inherit;';
    const caption = document.createElement('span');
    caption.textContent = t(window, 'collection_view_preview_as');
    const select = document.createElement('select');
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
    const current = currentPreviewId();
    select.innerHTML = '';
    const sample = document.createElement('option');
    sample.value = '';
    sample.textContent = t(window, 'collection_view_sample');
    select.appendChild(sample);
    (entries || []).forEach(function (entry) {
      const option = document.createElement('option');
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
      const leftover = document.getElementById(SELECT_ID);
      if (leftover && leftover.parentNode) {
        leftover.parentNode.remove();
      }
      lastSource = null;
      return;
    }
    const source = sourceOf();
    if (!source) {
      return;
    }
    const select = ensureSelect();
    if (!select) {
      return;
    }
    if (fetching || (lastSource === source && select.options.length > 1)) {
      return;
    }
    fetching = true;
    lastSource = source;
    window
      .fetch('/!/sve/collections/' + encodeURIComponent(source) + '/entries', {
        credentials: 'same-origin',
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
      })
      .then(function (res) {
        return res.ok ? res.json() : { entries: [] };
      })
      .then(function (data) {
        fill(select, data.entries || []);
      })
      .catch(function () {
        fill(select, []);
      })
      .finally(function () {
        fetching = false;
      });
  }

  function schedule() {
    window.clearTimeout(timer);
    timer = window.setTimeout(load, 200);
  }

  function bindEvents() {
    const events = window.Statamic && window.Statamic.$events;
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
