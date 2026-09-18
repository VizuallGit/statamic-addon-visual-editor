/**
 * Starts section-meta before the click, so an insert never waits on its first
 * request.
 *
 * - Library cards: hover / pointerdown (page, custom, global, template).
 *   A click on a card does not insert — only drag-and-drop into the preview
 *   does — so a pointerup that did not move is swallowed here.
 * - Search Sets over the preview: hover on a set row, after the bridge's
 *   add-block-native / add-bard-set-native message said which field it is for.
 * - "+" with exactly one set (a Hero list with `item`): hover on the list or
 *   the plus.
 *
 * Until WP6b-2 this was a standalone script that patched `window.fetch` to
 * cache `/!/sve/section-meta` JSON, wrapped the library's fetchers off
 * `window.sve`, and fetched on its own when they were missing. The library's
 * `sectionMetaCache` already keeps one promise per set; this file now simply
 * calls the library early. One cache, no patch.
 *
 * May import: section-library.js (set meta and the global-section set), lib/.
 * Imported by addon.js right after section-library.js, not through
 * side/index.js: pulling the library into the first import would change the
 * order the CP's module graph evaluates in.
 */
import { fetchNestedSetMeta, fetchSetMeta, globalSectionSet } from '../section-library.js';
import { mark } from '../lib/debug.js';
import { MSG, SOURCE } from '../lib/protocol.js';

mark('section-meta-prefetch');

const PICKER_MS = 20000;
const LIST_MS = 20000;

let lastPicker = null;
const savedList = { p: null, at: 0 };
const templates = { p: null, at: 0 };

/** A library list (saved sections, templates), fetched at most once per LIST_MS. */
function jsonList(cache, url) {
  if (cache.p && Date.now() - cache.at < LIST_MS) {
    return cache.p;
  }

  cache.at = Date.now();
  cache.p = fetch(url, {
    credentials: 'same-origin',
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
  })
    .then((res) => (res.ok ? res.json() : {}))
    .catch(() => {
      cache.p = null;

      return {};
    });

  return cache.p;
}

function libraryKind() {
  const on = document.querySelector('.sve-lib-tabs button.is-on[data-tab]');

  return on?.getAttribute('data-tab') || '';
}

function warm(handle) {
  if (handle) {
    fetchSetMeta(window, handle);
  }
}

function prefetchLibraryCard(card) {
  const kind = (card.getAttribute('data-sve-lib-kind') || libraryKind() || '').toLowerCase();
  const handle = card.getAttribute('data-sve-lib-handle');
  const set = card.getAttribute('data-sve-lib-set');

  if (set) {
    warm(set);

    return;
  }

  if (kind === 'page' && handle) {
    warm(handle);

    return;
  }

  if (kind === 'global') {
    warm(globalSectionSet(window));

    return;
  }

  if (kind === 'custom' && handle) {
    jsonList(savedList, '/!/sve/saved-sections').then((data) => {
      const item = (data.sections || []).find((row) => String(row.id) === String(handle));

      warm(item?.section_type);
    });

    return;
  }

  if (kind === 'template' && handle) {
    jsonList(templates, '/!/sve/templates').then((data) => {
      const item = (data.templates || []).find((row) => String(row.id) === String(handle));

      for (const section of item?.sections || []) {
        warm(section?.type);
      }
    });

    return;
  }

  if (handle && !handle.includes('-')) {
    warm(handle);
  }
}

/** Search Sets groups → one flat list of sets. */
function flattenSets(raw) {
  if (!Array.isArray(raw) || !raw.length) {
    return [];
  }

  if (raw[0]?.handle && !raw[0].sets) {
    return raw;
  }

  const out = [];

  for (const group of raw) {
    for (const set of Array.isArray(group?.sets) ? group.sets : []) {
      if (set?.handle) {
        out.push(set);
      }
    }
  }

  return out;
}

function startNested(field, setHandle, sectionType) {
  if (field && setHandle) {
    fetchNestedSetMeta(window, field, setHandle, sectionType || '');
  }
}

function rememberPicker(data) {
  if (!data?.field) {
    return;
  }

  lastPicker = {
    field: data.field,
    sets: flattenSets(data.sets),
    sectionType: data.sectionType || '',
    at: Date.now(),
  };
}

/** The set a hovered Search Sets row stands for, by its label. */
function pickerSetHandle(event, sets) {
  const target = event.target;

  if (!target?.closest || !sets?.length) {
    return null;
  }

  if (target.closest('input, textarea, [data-set-picker-search-input]')) {
    return null;
  }

  const row =
    target.closest('#sve-bard-set-fallback button') ||
    target.closest('[data-sve-set-picker-host] .cursor-pointer') ||
    target.closest('[data-set-picker-popover] .cursor-pointer');

  if (!row) {
    return null;
  }

  const label = (row.innerText || '').split('\n')[0].replace(/\s+/g, ' ').trim().toLowerCase();

  if (!label || label === 'search sets' || label === 'groups' || label === 'all') {
    return null;
  }

  let match = sets.find((set) => {
    const display = String(set.display || '').toLowerCase();
    const handle = String(set.handle || '').toLowerCase();

    return display === label || handle === label;
  });

  if (!match) {
    match = sets.find((set) => {
      const display = String(set.display || set.handle || '').toLowerCase();

      return display && label.indexOf(display) === 0;
    });
  }

  return match ? match.handle : null;
}

function parseSets(el) {
  try {
    return flattenSets(JSON.parse(el.getAttribute('data-sid-insert-sets') || '[]'));
  } catch {
    return [];
  }
}

/** A "+" that can insert exactly one set: that set's meta, once. */
function prefetchSoloEl(el) {
  if (!el || el.__sveSoloPrefetched) {
    return;
  }

  const sets = parseSets(el);
  const field = el.getAttribute('data-sid-insert');

  if (!field || sets.length !== 1 || !sets[0].handle) {
    return;
  }

  el.__sveSoloPrefetched = true;
  startNested(field, sets[0].handle, '');
}

function prefetchSoloIn(doc) {
  doc?.querySelectorAll?.('[data-sid-insert]').forEach(prefetchSoloEl);
}

function onPreviewPointer(event) {
  const target = event.target;

  if (!target?.closest) {
    return;
  }

  if (target.closest('#__sve-inserters')) {
    prefetchSoloIn(event.currentTarget);

    return;
  }

  const insert = target.closest('[data-sid-insert]');

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
  const iframe = document.getElementById('live-preview-iframe');

  if (!iframe) {
    return;
  }

  try {
    bindPreviewDoc(iframe.contentDocument);

    const nested = iframe.contentDocument?.getElementById('live-preview-iframe');

    if (nested) {
      bindPreviewDoc(nested.contentDocument);
    }
  } catch {
    /* cross-origin */
  }
}

// ---- library cards: warm on hover / press; a still click never inserts ----

let libCardDown = false;
let libDragMoved = false;
let libDragX = 0;
let libDragY = 0;

document.addEventListener(
  'pointerdown',
  (event) => {
    const card = event.target?.closest?.('[data-sve-lib-handle]');

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
  (event) => {
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
  (event) => {
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
  (event) => {
    const card = event.target?.closest?.('[data-sve-lib-handle]');

    if (card) {
      prefetchLibraryCard(card);
    }
  },
  true
);

// ---- Search Sets over the preview: warm the row under the pointer ----

document.addEventListener(
  'pointerenter',
  (event) => {
    const target = event.target;

    if (!target?.closest || !lastPicker?.field || Date.now() - lastPicker.at > PICKER_MS) {
      return;
    }

    if (!target.closest('[data-sve-set-picker-host], [data-set-picker-popover], #sve-bard-set-fallback')) {
      return;
    }

    const handle = pickerSetHandle(event, lastPicker.sets);

    if (handle) {
      startNested(lastPicker.field, handle, lastPicker.sectionType);
    }
  },
  true
);

window.addEventListener('message', (event) => {
  const data = event.data;

  if (data?.source !== SOURCE) {
    return;
  }

  if (data.type === MSG.ADD_BLOCK_NATIVE || data.type === MSG.ADD_BARD_SET_NATIVE) {
    rememberPicker(data);
  }
});

// ---- the preview document(s): bind once each time one appears ----

let bindTimer = 0;

function scheduleBind() {
  if (bindTimer) {
    return;
  }

  bindTimer = window.setTimeout(() => {
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
