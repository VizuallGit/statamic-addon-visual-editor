/**
 * Settings toggle: `sections`
 * Section library / Patterns panel.
 * Imports leftover helpers from cp.js. Does not get imported by cp.js.
 */
import { sve } from './cp-registry.js';
import { t } from './cp-t.js';
import { sveState } from './cp-state.js';
import { SELECTORS } from './cp-selectors.js';
import {
  LP_SCALE_DEVICE_TO_PANE,
  MERGED_TABS,
  applyHeaderTab,
  applyLpDevice,
  applyLpZoom,
  collectAncestorSets,
  expandSet,
  findSetByUid,
  paintLpPreviewChrome,
  positionLpBackButton,
  rowIsLocked,
  sameOrder,
  sendToPreview,
  setHeaderTab,
} from './cp.js';
import { openCpOverlay } from './cp/open-overlay.js';
import { relayoutCodeDock } from './code-dock.js';
import { closeAiPanel } from './ai-panel.js';
import SectionLibraryPane from './cp/surfaces/SectionLibraryPane.vue';
import ChoiceDialog from './cp/surfaces/ChoiceDialog.vue';
import LibraryCard from './cp/surfaces/LibraryCard.vue';
import LibraryTabs from './cp/surfaces/LibraryTabs.vue';
import LibraryGroups from './cp/surfaces/LibraryGroups.vue';
import DeleteLibraryDialog from './cp/surfaces/DeleteLibraryDialog.vue';
import LibraryEmpty from './cp/surfaces/LibraryEmpty.vue';
import LibrarySaveButton from './cp/surfaces/LibrarySaveButton.vue';
import { mountPane } from './cp/mount-pane.js';
import { mountSurface } from './cp/mount.js';
import { deleteLibraryUi } from './cp/library/delete-store.js';
import {
  RIGHT_DOCK_ID,
  RIGHT_DOCK_PIN_STACK,
  RIGHT_PANEL_FILL,
  beginRightShellSwap,
  endRightShellSwap,
  hideRightDock,
  isRightDockResizing,
  pinnedKeepIds,
  releaseRightShellIfEmpty,
  rightDockWidth,
  showInRightShell,
} from './right-dock.js';

// ===== library =====
// --- Section picker (visual "Add section") ---------------------------------------
//
// The "+" on a section opens this instead of Statamic's native Add Set picker, so
// we can offer three tabs: the built-in section types, and the saved templates
// split into Custom (insert a copy) and Global (insert a reference). Each is shown
// with its preview image. Insertion writes straight into the page_sections array,
// after the section the "+" was clicked on.


export const SECTION_PICKER_ID = '__sve-section-picker';
export const CHROME_DESIGNS_ID = '__sve-chrome-designs';
export const COMMENTS_PANEL_ID = '__sve-comments-pane';

// The type list is handed over at page render. Deleting one replaces it here for
// the rest of the session — the config is a snapshot, and reloading the CP just
// to drop a card from the picker isn't worth asking for.
export let sectionTypesOverride = null;

export function sectionTypes(win) {
  if (sectionTypesOverride) {
    return sectionTypesOverride;
  }

  const list = win.Statamic?.$config?.get?.('sveSectionTypes');

  return Array.isArray(list) ? list : [];
}

/**
 * Fetches the section types with their preview images as they are on disk.
 *
 * One request when Patterns opens, and one when something actually changed
 * (theme save, template save, a section saved into the library). Not a timer:
 * polling every 1.5s rebuilt the Live Preview header and Theme Settings with
 * every picture that landed.
 */
export let sectionTypesGen = 0;
export let lastTypeHandles = '';
export let lastTypeImages = '';
export let libraryCatchupTimer = 0;

export function refreshSectionTypes(win, onUpdated) {
  const gen = ++sectionTypesGen;

  win
    .fetch('/!/sve/section-types', {
      credentials: 'same-origin',
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
    })
    .then((res) => res.json())
    .then((data) => {
      if (gen !== sectionTypesGen) {
        return;
      }

      if (!Array.isArray(data.types) || !data.types.length) {
        return;
      }

      const handles = data.types.map((type) => `${type.handle}\t${type.display || ''}`).join('\n');
      const images = data.types.map((type) => type.image_url || '').join('\n');

      sectionTypesOverride = data.types;

      const listChanged = handles !== lastTypeHandles;
      const imagesChanged = images !== lastTypeImages;

      lastTypeHandles = handles;
      lastTypeImages = images;

      if ((listChanged || imagesChanged) && typeof onUpdated === 'function') {
        onUpdated({ listChanged, imagesChanged });
      }
    })
    .catch(() => {});
}

/**
 * Tells an open section library that what it is showing is out of date.
 *
 * Saving a section from the editor happens outside the library's own code, so it
 * has no way of knowing. Without this the designer saves "hero with the red
 * background", switches to the Custom tab, and it isn't there — because the tab
 * still holds the list it fetched before the save.
 *
 * Screenshots finish a few seconds after the save. One follow-up refetch picks
 * those pictures up. It is not a loop: it fires once, for this change.
 */
export function libraryWentStale(win) {
  savedSectionIndex = null;
  win.document
    .getElementById(SECTION_PICKER_ID)
    ?.dispatchEvent(new win.CustomEvent('sve-library-stale'));
}

/**
 * Loads a library list once.
 *
 * A section saved from the editor is on screen before its screenshot exists —
 * photographing it takes a few seconds in a real browser, which is deliberately
 * not done while the save is waiting. The card appears immediately; the one
 * follow-up from `libraryWentStale` fills the picture in. Asking every 1.5s
 * while sitting still rebuilt the rest of Live Preview with it.
 */
export function pollLibrary(win, url, take, onItems, onFailed) {
  win
    .fetch(url, { credentials: 'same-origin', headers: { 'X-Requested-With': 'XMLHttpRequest' } })
    .then((res) => res.json())
    .then((data) => onItems(take(data)))
    .catch(() => onFailed());
}

/** A new uuid for a re-id'd copy. */
export function newUuid(win) {
  return win.crypto?.randomUUID ? win.crypto.randomUUID() : `${newRowId()}-${newRowId()}`;
}

/** Gives a section (and everything in it) fresh ids, so a copy is independent. */
export function reidSection(win, section) {
  const clone = JSON.parse(JSON.stringify(section));

  const walk = (node) => {
    if (Array.isArray(node)) {
      node.forEach(walk);
    } else if (node && typeof node === 'object') {
      if ('id' in node || '_id' in node) {
        if ('_id' in node) {
          node._id = newRowId();
        } else {
          node.id = newRowId();
        }
      }

      if ('_visual_id' in node) {
        node._visual_id = newUuid(win);
      }

      Object.values(node).forEach(walk);
    }
  };

  walk(clone);

  return clone;
}

/**
 * Inserts a section into page_sections. `afterUid` = the section to drop after;
 * null drops at the very top. `rowMeta` is the set's fresh meta (from the
 * section-meta endpoint): without it the Replicator has no way to render the new
 * row, so it would show in the preview but never in the CP's own section list.
 * Returns false when the field can't be located (e.g. nothing has focus yet).
 */
export function insertSectionAfter(win, doc, afterUid, section, rowMeta = null) {
  const field = sectionField(win);

  for (const container of sve.activeContainers(doc)) {
    const values = sve.unwrapRef(container.values);

    if (!values || typeof values !== 'object') {
      continue;
    }

    // No uid → drop at the top of the page_sections array.
    if (afterUid == null) {
      const rows = sve.dataGet(values, field);

      if (!Array.isArray(rows)) {
        continue;
      }

      writeSetMeta(container, field, section, rowMeta);
      container.setFieldValue(field, [section, ...JSON.parse(JSON.stringify(rows))]);

      return true;
    }

    const found = rowLocation(values, afterUid);

    if (!found) {
      continue;
    }

    const { parentPath, index, rows } = found;
    const next = JSON.parse(JSON.stringify(rows));

    next.splice(index + 1, 0, section);
    // Sections live at the top level, so the meta always belongs to `field`.
    writeSetMeta(container, field, section, rowMeta);
    container.setFieldValue(parentPath, next);

    return true;
  }

  return false;
}

/**
 * Registers a new row's meta on the container so the Replicator can render it.
 * The Replicator reads each row's fields from `meta.<field>.existing[<_id>]`;
 * merging the fresh meta under the row's id is what makes the row appear in the
 * CP list (not just the preview).
 */
export function writeSetMeta(container, field, section, rowMeta) {
  if (!rowMeta || !section._id || typeof container.setFieldMeta !== 'function') {
    return;
  }

  const allMeta = sve.unwrapRef(container.meta) || {};
  const fieldMeta = allMeta[field] || { existing: {}, new: null, defaults: null, collapsed: [] };

  container.setFieldMeta(field, {
    ...fieldMeta,
    existing: { ...(fieldMeta.existing || {}), [section._id]: rowMeta },
  });
}

/** Replicator/grid meta (object `existing`), not assets (`existing` is an array). */
export function isNestedSetMeta(fieldMeta) {
  return (
    !!fieldMeta &&
    typeof fieldMeta === 'object' &&
    !Array.isArray(fieldMeta) &&
    ('existing' in fieldMeta || 'new' in fieldMeta) &&
    !Array.isArray(fieldMeta.existing)
  );
}

function nestedMetaTemplate(fieldMeta) {
  if (
    fieldMeta.new &&
    typeof fieldMeta.new === 'object' &&
    !Array.isArray(fieldMeta.new) &&
    Object.keys(fieldMeta.new).length
  ) {
    return fieldMeta.new;
  }

  return Object.values(fieldMeta.existing || {})[0] || {};
}

/**
 * Re-keys a set's meta to the row ids actually in `row`.
 *
 * `meta.new` is built from fieldset defaults, so its nested `existing` keys
 * belong to those default rows. A custom/duplicated section has different ids —
 * without this the Replicator finds no meta for `blocks` / `list` and the
 * sidebar is empty even though values are there. unique_sets then treats the
 * types as present, so Add is dead too.
 *
 * `defaultsRow` is the same set's defaults (from the section-meta endpoint),
 * used to pick the matching nested template by type (content vs list) instead
 * of handing every child the first default's meta.
 */
export function hydrateExistingMeta(row, template, defaultsRow = null) {
  const out =
    template && typeof template === 'object' && !Array.isArray(template)
      ? JSON.parse(JSON.stringify(template))
      : {};

  if (!row || typeof row !== 'object') {
    return out;
  }

  for (const [handle, fieldMeta] of Object.entries(out)) {
    if (!isNestedSetMeta(fieldMeta)) {
      continue;
    }

    const children = row[handle];
    const defaultChildren = Array.isArray(defaultsRow?.[handle]) ? defaultsRow[handle] : [];
    const genericTemplate = nestedMetaTemplate(fieldMeta);
    const existing = {};
    const typeIndex = {};

    if (Array.isArray(children)) {
      children.forEach((child, index) => {
        if (!child || typeof child !== 'object') {
          return;
        }

        const id = child._id || child.id;

        if (!id) {
          return;
        }

        let match = null;

        if (child.type) {
          const n = typeIndex[child.type] || 0;
          const same = defaultChildren.filter((d) => d && d.type === child.type);

          match = same[n] || same[0] || null;
          typeIndex[child.type] = n + 1;
        } else {
          match = defaultChildren[index] || defaultChildren[0] || null;
        }

        const matchId = match?._id || match?.id;
        const typedTemplate =
          (matchId && fieldMeta.existing && fieldMeta.existing[matchId]) || genericTemplate;

        existing[id] = hydrateExistingMeta(child, typedTemplate, match);
      });
    }

    fieldMeta.existing = existing;
  }

  return out;
}

// Site-specific handles all come from the server config (provideToScript), never
// from a literal here — the addon has to work as installed on any site.

/** The Replicator field the page builder lives in. */
export function sectionField(win) {
  return win.Statamic?.$config?.get?.('sveSectionField') || 'page_sections';
}

/**
 * Is a tool switched on for this site? (Addons > Statamic Visual Editor.)
 *
 * Unknown keys — and a config that hasn't arrived yet — read as on: the editor
 * showing a tool it could have hidden is a smaller failure than it hiding one
 * the site depends on.
 */
export function featureOn(win, key) {
  return win.Statamic?.$config?.get?.('sveFeatures')?.[key] !== false;
}

/** The Replicator set a page uses to reference a synced ("global") saved section. */
export function globalSectionSet(win) {
  return win.Statamic?.$config?.get?.('sveGlobalSectionSet') || 'global_section';
}

/** The collection saved sections live in. */
export function savedSectionsCollection(win) {
  return win.Statamic?.$config?.get?.('sveSavedSectionsCollection') || 'saved_sections';
}

/**
 * What each saved (global) section is, keyed by entry id.
 *
 * Seeded from the CP config so the block tree can name a referenced section
 * without waiting on a fetch. Grows during the session when one is saved or
 * dropped from the library — the config is a snapshot from page load.
 */
export let savedSectionIndex = null;

export function rememberSavedSection(id, info) {
  if (!id || typeof id !== 'string') {
    return;
  }

  if (!savedSectionIndex) {
    savedSectionIndex = new Map();
  }

  savedSectionIndex.set(id, {
    title: info?.title || '',
    section_type: info?.section_type || '',
  });
}

export function savedSectionLookup(win) {
  if (savedSectionIndex) {
    return savedSectionIndex;
  }

  savedSectionIndex = new Map();
  const raw = win.Statamic?.$config?.get?.('sveSavedSectionLabels');

  if (raw && typeof raw === 'object') {
    Object.entries(raw).forEach(([id, info]) => {
      savedSectionIndex.set(id, {
        title: info?.title || '',
        section_type: info?.section_type || '',
      });
    });
  }

  return savedSectionIndex;
}

export function savedSectionInfo(win, id) {
  return id ? savedSectionLookup(win).get(id) || null : null;
}

/** First entry id from an Entries field value (array, string, or `{id}`). */
export function firstEntryId(value) {
  if (typeof value === 'string' && value !== '') {
    return value;
  }

  if (Array.isArray(value) && value.length) {
    const first = value[0];

    if (typeof first === 'string' && first !== '') {
      return first;
    }

    if (first && typeof first === 'object' && typeof first.id === 'string') {
      return first.id;
    }
  }

  return '';
}

/** The Replicator set handle a library card of the given kind inserts. */
export function setHandleFor(win, kind, item) {
  if (kind === 'global') {
    return globalSectionSet(win);
  }

  if (kind === 'custom') {
    return item.section_type;
  }

  return item.handle;
}

// Fresh set meta + defaults, per set handle, cached for the session (the
// blueprint doesn't change while the form is open).
export const sectionMetaCache =
  (typeof window !== 'undefined' && window.__sveSectionMetaCache) || new Map();

if (typeof window !== 'undefined') {
  window.__sveSectionMetaCache = sectionMetaCache;
}

/** The collection being edited, read from the CP URL. */
export function currentCollection(win) {
  const match = win.location.pathname.match(/\/collections\/([^/]+)\//);

  return match ? match[1] : null;
}

/** Fetches (and caches) a set's fresh meta + default values from the addon. */
/**
 * Meta + defaults for a set in a NESTED replicator field (a section's own
 * `blocks`), for the in-preview block inserter. Same endpoint as sections, with a
 * `field` so it resolves the nested replicator instead of the top-level one.
 */
export async function fetchNestedSetMeta(win, field, setHandle, sectionType = '') {
  const key = `${field}::${setHandle}::${sectionType}`;

  if (sectionMetaCache.has(key)) {
    return sectionMetaCache.get(key);
  }

  const collection = currentCollection(win);

  if (!collection) {
    return null;
  }

  const pending = (async () => {
    const url =
      `/!/sve/section-meta?collection=${encodeURIComponent(collection)}` +
      `&field=${encodeURIComponent(field)}&set=${encodeURIComponent(setHandle)}` +
      (sectionType ? `&section=${encodeURIComponent(sectionType)}` : '');

    const primed = win.__sveSectionMetaJson?.get?.(url);

    if (primed) {
      return primed;
    }

    const res = await win.fetch(url, {
      credentials: 'same-origin',
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
    });

    if (!res.ok) {
      return null;
    }

    return res.json();
  })();

  sectionMetaCache.set(key, pending);

  try {
    const data = await pending;

    if (!data) {
      sectionMetaCache.delete(key);
    }

    return data;
  } catch {
    sectionMetaCache.delete(key);

    return null;
  }
}

/**
 * Registers a new row's meta in a NESTED replicator/grid field, so the row
 * renders in the Control Panel form (the sidebar), not only the preview.
 *
 * The meta for a top-level field is set with `setFieldMeta(field, …)`, but a
 * nested field's meta lives deep inside the top field's — so we clone the top
 * field's meta, walk into the nested field within the clone, add the row there,
 * and write the whole top field back. `parentPath` is like `page_sections.2.blocks`.
 */
export function writeNestedRowMeta(container, values, parentPath, rowId, rowMeta) {
  if (!rowMeta || !rowId || typeof container.setFieldMeta !== 'function') {
    return;
  }

  const fullMeta = sve.unwrapRef(container.meta) || {};
  const segments = parentPath.split('.');
  const topField = segments[0];

  if (!fullMeta[topField]) {
    return;
  }

  const clone = JSON.parse(JSON.stringify(fullMeta[topField]));
  // metaForPath walks meta keyed by row _id — pass the top field's own meta and
  // values, and the path below it (e.g. "2.blocks").
  const nested = metaForPath(clone, sve.dataGet(values, topField), segments.slice(1).join('.'));

  if (!nested || typeof nested !== 'object') {
    return;
  }

  nested.existing = { ...(nested.existing || {}), [rowId]: rowMeta };
  container.setFieldMeta(topField, clone);
}

/**
 * Drops a row's meta from a nested replicator/grid field after the row itself
 * was removed from values — keeps `existing` from accumulating orphans.
 */
export function removeNestedRowMeta(container, values, parentPath, rowId) {
  if (!rowId || typeof container.setFieldMeta !== 'function') {
    return;
  }

  const fullMeta = sve.unwrapRef(container.meta) || {};
  const segments = parentPath.split('.');
  const topField = segments[0];

  if (!fullMeta[topField]) {
    return;
  }

  const clone = JSON.parse(JSON.stringify(fullMeta[topField]));
  const nested = metaForPath(clone, sve.dataGet(values, topField), segments.slice(1).join('.'));

  if (!nested?.existing || !(rowId in nested.existing)) {
    return;
  }

  delete nested.existing[rowId];
  container.setFieldMeta(topField, clone);
}

/**
 * Fresh row meta for a grid/replicator row: prefer the field's blank `new`
 * template (what Statamic's own "Add row" uses), else clone a sibling's.
 */
export function rowMetaTemplate(container, values, parentPath, sampleRow) {
  const fullMeta = sve.unwrapRef(container.meta);
  const fieldMeta = fullMeta ? metaForPath(fullMeta, values, parentPath) : null;

  if (!fieldMeta || typeof fieldMeta !== 'object') {
    return null;
  }

  if (fieldMeta.new && typeof fieldMeta.new === 'object') {
    return JSON.parse(JSON.stringify(fieldMeta.new));
  }

  const sampleId = sampleRow?._id;

  if (sampleId && fieldMeta.existing?.[sampleId]) {
    return JSON.parse(JSON.stringify(fieldMeta.existing[sampleId]));
  }

  return null;
}

/**
 * `template="icon|title:Enter a title"` from the preview — starting inner sets
 * for a new row, declared in Antlers where the replicator is used. Same idea as
 * `controls="tag:h1"`: the fieldset stays reusable; the template says what a
 * fresh row contains at this place.
 *
 * Pipe-separated set types, optional `:text` on the field named like the set
 * (`title:Hello`) or `type.field:text`. JSON is accepted too — BlockStudio's
 * InnerBlocks shape `[['title', { title: 'Hello' }]]`.
 */
export function parseSidTemplate(spec) {
  const trimmed = String(spec || '').trim();

  if (!trimmed) {
    return [];
  }

  if (trimmed.startsWith('[')) {
    try {
      const json = JSON.parse(trimmed);

      return (Array.isArray(json) ? json : []).map(normalizeSidTemplateItem).filter(Boolean);
    } catch {
      return [];
    }
  }

  return trimmed
    .split('|')
    .map((part) => {
      const raw = part.trim();

      if (!raw) {
        return null;
      }

      // `3:item` — N starting rows of that set, not a field value named "3".
      const counted = raw.match(/^(\d+):([A-Za-z_][\w-]*)$/);

      if (counted) {
        return { type: counted[2], count: Number(counted[1]) };
      }

      const colon = raw.indexOf(':');

      if (colon === -1) {
        return { type: raw };
      }

      const left = raw.slice(0, colon).trim();
      const value = raw.slice(colon + 1).trim();
      const dot = left.indexOf('.');

      if (dot !== -1) {
        return { type: left.slice(0, dot), field: left.slice(dot + 1), value };
      }

      return { type: left, field: left, value };
    })
    .filter(Boolean);
}

export function normalizeSidTemplateItem(raw) {
  if (typeof raw === 'string') {
    return raw.trim() ? { type: raw.trim() } : null;
  }

  if (Array.isArray(raw)) {
    const type = String(raw[0] || '')
      .trim()
      .replace(/^core\//, '');

    if (!type) {
      return null;
    }

    const attrs = raw[1] && typeof raw[1] === 'object' && !Array.isArray(raw[1]) ? { ...raw[1] } : {};

    delete attrs.placeholder;

    return { type, attrs };
  }

  if (raw && typeof raw === 'object' && typeof raw.type === 'string') {
    const { type, ...attrs } = raw;

    return { type, attrs };
  }

  return null;
}

export function isBardValue(value) {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value[0] &&
    typeof value[0] === 'object' &&
    ['paragraph', 'heading', 'text', 'set', 'bulletList', 'orderedList'].includes(value[0].type)
  );
}

export function looksLikeBardSpec(spec) {
  return typeof spec === 'string' && /^(heading:\d+:|paragraph:|h[1-6]:)/i.test(spec.trim());
}

export function specToBard(spec) {
  if (Array.isArray(spec)) {
    return spec;
  }

  return String(spec)
    .split('|')
    .map((part) => {
      const p = part.trim();
      const heading = p.match(/^heading:([1-6]):(.*)$/i) || p.match(/^h([1-6]):(.*)$/i);

      if (heading) {
        const text = heading[2];

        return {
          type: 'heading',
          attrs: { level: Number(heading[1]) },
          content: text ? [{ type: 'text', text }] : [],
        };
      }

      if (/^paragraph:/i.test(p)) {
        const text = p.slice(p.indexOf(':') + 1);

        return { type: 'paragraph', content: text ? [{ type: 'text', text }] : [] };
      }

      return { type: 'paragraph', content: p ? [{ type: 'text', text: p }] : [] };
    });
}

export function coerceSidValue(current, spec) {
  if (isBardValue(current) || looksLikeBardSpec(spec)) {
    return specToBard(spec);
  }

  return spec;
}

export function applySidFieldDefaults(row, defaults) {
  if (!row || !defaults || typeof defaults !== 'object') {
    return;
  }

  for (const [handle, value] of Object.entries(defaults)) {
    if (handle === 'type' || value == null || value === '') {
      continue;
    }

    const current = row[handle];
    const blank =
      current === undefined ||
      current === null ||
      current === '' ||
      (Array.isArray(current) && !current.length);

    if (blank) {
      row[handle] = coerceSidValue(current, value);
    }
  }
}

export function assignSidTemplateValues(row, item, fieldDefaults) {
  if (item.attrs && typeof item.attrs === 'object') {
    for (const [key, value] of Object.entries(item.attrs)) {
      if (key === 'type' || key === 'placeholder' || value == null) {
        continue;
      }

      row[key] = coerceSidValue(row[key], value);
    }
  }

  const field = item.field || item.type;

  if (item.value != null && item.value !== '' && field) {
    row[field] = coerceSidValue(row[field], item.value);
  }

  applySidFieldDefaults(row, fieldDefaults);
}

export function nestedReplicatorHandle(row, metaNew) {
  const keys = new Set();

  if (row && typeof row === 'object') {
    for (const [key, value] of Object.entries(row)) {
      if (['id', '_id', '_visual_id', 'type', 'enabled'].includes(key)) {
        continue;
      }

      if (Array.isArray(value)) {
        keys.add(key);
      }
    }
  }

  if (metaNew && typeof metaNew === 'object') {
    for (const [key, value] of Object.entries(metaNew)) {
      if (value && typeof value === 'object' && !Array.isArray(value) && 'existing' in value) {
        keys.add(key);
      }
    }
  }

  const list = [...keys];

  if (list.includes('blocks')) {
    return 'blocks';
  }

  return list[0] || null;
}

export async function buildSidTemplateRow(win, field, item, fieldDefaults) {
  const meta = await fetchNestedSetMeta(win, field, item.type);
  const rowId = newRowId();
  const row = {
    ...(meta?.defaults ? JSON.parse(JSON.stringify(meta.defaults)) : {}),
    _id: rowId,
    _visual_id: newUuid(win),
    type: item.type,
  };

  assignSidTemplateValues(row, item, fieldDefaults);

  return { row, meta: meta?.new ? JSON.parse(JSON.stringify(meta.new)) : {} };
}

export function attachSidNestedMeta(parentMeta, nestedField, nestedBuilt) {
  if (!parentMeta || !nestedField || !nestedBuilt.length) {
    return parentMeta;
  }

  parentMeta[nestedField] = parentMeta[nestedField] || { existing: {} };
  parentMeta[nestedField].existing = { ...(parentMeta[nestedField].existing || {}) };

  for (const built of nestedBuilt) {
    parentMeta[nestedField].existing[built.row._id] = built.meta || {};
  }

  return parentMeta;
}

/**
 * Fill a newly created row from an Antlers `template` / `default`.
 *
 * `template="icon|title"` — inner sets for this row (typically `blocks`).
 * `template="3:item"` on the parent — N child rows, each filled from
 * `rowTemplate` (the `<li>`'s `template="icon|title"`).
 */
export async function applySidTemplate(win, row, template, fieldDefaults, parentMeta, rowTemplate = '', fieldTemplates = {}) {
  const items = parseSidTemplate(template);
  const nested = [];
  let nestedField = null;

  if (items.some((item) => item.count)) {
    const nestedHandle = nestedReplicatorHandle(row, parentMeta);

    if (nestedHandle) {
      nestedField = nestedHandle;

      for (const spec of items) {
        const times = spec.count || 1;

        for (let n = 0; n < times; n++) {
          const built = await buildSidTemplateRow(win, nestedHandle, { type: spec.type }, fieldDefaults);
          const inner = await applySidTemplate(win, built.row, rowTemplate, fieldDefaults, built.meta, '', fieldTemplates);
          const meta = attachSidNestedMeta(built.meta, inner.nestedField, inner.nested);

          nested.push({ row: inner.row, meta: meta || built.meta });
        }
      }

      row[nestedHandle] = nested.map((built) => built.row);
    } else {
      applySidFieldDefaults(row, fieldDefaults);
    }
  } else if (items.length) {
    const types = items.map((item) => item.type);
    const nestedHandle = nestedReplicatorHandle(row, parentMeta);

    if (nestedHandle && row.type && !types.includes(row.type)) {
      nestedField = nestedHandle;

      for (const item of items) {
        nested.push(await buildSidTemplateRow(win, nestedHandle, item, fieldDefaults));
      }

      row[nestedHandle] = nested.map((built) => built.row);
    } else {
      const match = items.find((item) => item.type === row.type) || (items.length === 1 ? items[0] : null);

      if (match) {
        assignSidTemplateValues(row, match, fieldDefaults);
      } else {
        applySidFieldDefaults(row, fieldDefaults);
      }
    }
  } else {
    applySidFieldDefaults(row, fieldDefaults);
  }

  if (nested.length && fieldTemplates && typeof fieldTemplates === 'object') {
    for (let i = 0; i < nested.length; i++) {
      const spec = fieldTemplates[nested[i].row?.type];

      if (!spec || !(spec.template || spec.rowTemplate)) {
        continue;
      }

      const inner = await applySidTemplate(
        win,
        nested[i].row,
        spec.template || '',
        fieldDefaults,
        nested[i].meta || {},
        spec.rowTemplate || '',
        fieldTemplates
      );

      nested[i] = {
        row: inner.row,
        meta: attachSidNestedMeta(nested[i].meta, inner.nestedField, inner.nested) || nested[i].meta,
      };
    }

    if (nestedField) {
      row[nestedField] = nested.map((built) => built.row);
    }
  }

  return { row, nested, nestedField };
}

export function countedTemplateTypes(template) {
  return parseSidTemplate(template)
    .filter((item) => item.count)
    .map((item) => item.type);
}

export function sectionTypeFromPath(values, parentPath) {
  const parts = String(parentPath || '').split('.');

  if (parts.length < 2 || !Number.isInteger(Number(parts[1]))) {
    return '';
  }

  const section = sve.dataGet(values, `${parts[0]}.${parts[1]}`);

  return section && typeof section === 'object' ? String(section.type || '') : '';
}

export async function overlaySidTemplate(win, container, _values, parentPath, added, template, fieldDefaults, rowTemplate = '') {
  if (!added?._id) {
    return;
  }

  const values = sve.unwrapRef(container.values);

  const rows = sve.dataGet(values, parentPath);

  if (!Array.isArray(rows)) {
    return;
  }

  const index = rows.findIndex((row) => row && row._id === added._id);

  if (index < 0) {
    return;
  }

  const sectionType = sectionTypeFromPath(values, parentPath);
  const field = parentPath.slice(parentPath.lastIndexOf('.') + 1);
  const addedMeta =
    added.type && field
      ? await fetchNestedSetMeta(win, field, added.type, sectionType)
      : null;

  // `3:item` seeds a new *list*. A single new *item* (the native picker, or +
  // on an empty ul) should only get the row template — icon|title — not 3 rows.
  let applyTemplate = template || addedMeta?.template || '';
  let applyRowTemplate = rowTemplate || addedMeta?.rowTemplate || '';

  if (added.type && countedTemplateTypes(applyTemplate).includes(added.type)) {
    applyTemplate = applyRowTemplate;
    applyRowTemplate = '';
  }

  if (!applyTemplate && !applyRowTemplate && !(fieldDefaults && Object.keys(fieldDefaults).length)) {
    return;
  }

  const row = JSON.parse(JSON.stringify(rows[index]));
  const parentMeta =
    (addedMeta?.new ? JSON.parse(JSON.stringify(addedMeta.new)) : null) ||
    rowMetaTemplate(container, values, parentPath, row) ||
    {};
  const built = await applySidTemplate(
    win,
    row,
    applyTemplate,
    fieldDefaults,
    parentMeta,
    applyRowTemplate,
    addedMeta?.fieldTemplates || {}
  );
  const next = JSON.parse(JSON.stringify(rows));

  next[index] = built.row;
  container.setFieldValue(parentPath, next);

  if (built.nestedField && built.nested.length) {
    const updated = sve.unwrapRef(container.values);
    const rowPath = `${parentPath}.${index}`;
    const fullMeta = sve.unwrapRef(container.meta) || {};
    const segments = rowPath.split('.');
    const topField = segments[0];

    if (!fullMeta[topField] || typeof container.setFieldMeta !== 'function') {
      return;
    }

    const clone = JSON.parse(JSON.stringify(fullMeta[topField]));
    const rowMeta = metaForPath(clone, sve.dataGet(updated, topField), segments.slice(1).join('.'));

    if (!rowMeta) {
      return;
    }

    attachSidNestedMeta(rowMeta, built.nestedField, built.nested);
    container.setFieldMeta(topField, clone);
  }
}

export function watchNewRow(doc, win, data, onAdded) {
  const { uid, anchorUid, sectionUid, field } = data;
  const around = uid || anchorUid;

  for (const container of sve.activeContainers(doc)) {
    const values = sve.unwrapRef(container.values);

    if (!values || typeof values !== 'object') {
      continue;
    }

    let parentPath = null;
    let startIds = new Set();

    if (around) {
      const loc = rowLocation(values, around);

      if (!loc) {
        continue;
      }

      parentPath = loc.parentPath;
      startIds = new Set(loc.rows.map((row) => row?._id).filter(Boolean));
    } else if (sectionUid && field) {
      const sectionPath = sve.findPathByUid(values, sectionUid);

      if (sectionPath === null) {
        continue;
      }

      parentPath = `${sectionPath}.${field}`;
      const existing = sve.dataGet(values, parentPath);

      startIds = new Set((Array.isArray(existing) ? existing : []).map((row) => row?._id).filter(Boolean));
    } else {
      continue;
    }

    let attempts = 0;

    const poll = () => {
      const current = sve.dataGet(sve.unwrapRef(container.values), parentPath);

      if (!Array.isArray(current)) {
        return;
      }

      const added = current.find((row) => row && row._id && !startIds.has(row._id));

      if (added) {
        onAdded(container, sve.unwrapRef(container.values), parentPath, added);

        return;
      }

      if (++attempts < 240) {
        setTimeout(poll, 150);
      }
    };

    setTimeout(poll, 150);

    return;
  }
}

/**
 * "+" between a replicator's blocks: insert a new set of the chosen type, next to
 * the block the "+" sits by (or as the first block when the field is empty). The
 * row is written into the nested array with its meta, so it shows in both the
 * preview and the CP form.
 */
export async function handleInsertBlock(data, doc, win) {
  const { field, set, anchorUid, position, scope } = data;

  if (!field || !set) {
    return;
  }

  const meta = await fetchNestedSetMeta(win, field, set, data.sectionType || '');
  const rowId = newRowId();
  const row = {
    ...(meta?.defaults ? JSON.parse(JSON.stringify(meta.defaults)) : {}),
    _id: rowId,
    id: rowId,
    _visual_id: newUuid(win),
    type: set,
  };
  const built = await applySidTemplate(
    win,
    row,
    data.template || meta?.template || '',
    data.fieldDefaults,
    meta?.new ? JSON.parse(JSON.stringify(meta.new)) : {},
    data.rowTemplate || meta?.rowTemplate || ''
  );
  const rowMeta = attachSidNestedMeta(
    meta?.new ? JSON.parse(JSON.stringify(meta.new)) : {},
    built.nestedField,
    built.nested
  );

  for (const container of sve.activeContainers(doc)) {
    const values = sve.unwrapRef(container.values);

    if (!values || typeof values !== 'object') {
      continue;
    }

    // Anchored to a sibling block: splice in beside it. If the preview uid
    // is not in values yet, fall through to `scope` instead of giving up.
    if (anchorUid) {
      const loc = rowLocation(values, anchorUid);

      if (loc) {
        const next = JSON.parse(JSON.stringify(loc.rows));

        next.splice(position === 'before' ? loc.index : loc.index + 1, 0, built.row);
        writeNestedRowMeta(container, values, loc.parentPath, rowId, rowMeta);
        container.setFieldValue(loc.parentPath, next);

        return;
      }
    }

    // Empty field, or anchor uid missed: seed the section's own field array.
    if (scope) {
      const sectionPath = sve.findPathByUid(values, scope);

      if (sectionPath === null) {
        continue;
      }

      const fieldPath = `${sectionPath}.${field}`;
      const existing = sve.dataGet(values, fieldPath);
      const next = Array.isArray(existing) ? JSON.parse(JSON.stringify(existing)) : [];

      next.push(built.row);
      writeNestedRowMeta(container, values, fieldPath, rowId, rowMeta);
      container.setFieldValue(fieldPath, next);

      return;
    }
  }
}

/**
 * Insert a Bard set node into a Bard field's value array (ProseMirror JSON).
 * Used by the whole-field inline editor's "+" on an empty paragraph.
 *
 * `index` is the text-block index in the serialized preview (locked sets also
 * count in the final array — the bridge sends the absolute splice index).
 */
export async function handleInsertBardSet(data, doc, win) {
  const { field, set, scope, index } = data;

  if (!field || !set) {
    return;
  }

  const meta = await fetchNestedSetMeta(win, field, set);
  const setId = newRowId();
  const visualId = newUuid(win);
  const valuesPayload = {
    ...(meta?.defaults ? JSON.parse(JSON.stringify(meta.defaults)) : {}),
    type: set,
    _visual_id: visualId,
  };

  const setNode = {
    type: 'set',
    attrs: {
      id: setId,
      enabled: true,
      values: valuesPayload,
    },
  };

  for (const container of sve.activeContainers(doc)) {
    const values = sve.unwrapRef(container.values);

    if (!values || typeof values !== 'object') {
      continue;
    }

    let fieldPath = field;

    if (scope) {
      const sectionPath = sve.findPathByUid(values, scope);

      if (sectionPath === null) {
        continue;
      }

      fieldPath = `${sectionPath}.${field}`;
    }

    const existing = sve.dataGet(values, fieldPath);

    if (!Array.isArray(existing)) {
      continue;
    }

    const next = JSON.parse(JSON.stringify(existing));
    const at = Number.isInteger(index) ? Math.max(0, Math.min(index, next.length)) : next.length;

    next.splice(at, 0, setNode);
    writeNestedRowMeta(container, values, fieldPath, setId, meta?.new);
    container.setFieldValue(fieldPath, next);

    return;
  }
}

export async function fetchSetMeta(win, setHandle) {
  if (!setHandle) {
    return null;
  }

  if (sectionMetaCache.has(setHandle)) {
    return sectionMetaCache.get(setHandle);
  }

  const collection = currentCollection(win);

  if (!collection) {
    return null;
  }

  const pending = (async () => {
    const url =
      `/!/sve/section-meta?collection=${encodeURIComponent(collection)}&set=${encodeURIComponent(setHandle)}`;

    const res = await win.fetch(url, {
      credentials: 'same-origin',
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
    });

    if (!res.ok) {
      return null;
    }

    return res.json();
  })();

  sectionMetaCache.set(setHandle, pending);

  try {
    const data = await pending;

    if (!data) {
      sectionMetaCache.delete(setHandle);
    }

    return data;
  } catch {
    sectionMetaCache.delete(setHandle);

    return null;
  }
}

/** The section object to insert for a library card of the given kind. */
export function buildSectionRow(win, kind, item, defaults, newId) {
  const base = {
    ...reidSection(win, defaults || {}),
    _id: newId,
    id: newId,
    _visual_id: newUuid(win),
    enabled: true,
  };

  if (kind === 'page') {
    return { ...base, type: item.handle };
  }

  if (kind === 'global') {
    // A reference — the template renders the source's current sections. The set
    // and its entries field share one handle, so the row is built from it.
    const set = globalSectionSet(win);

    rememberSavedSection(item.id, { title: item.title, section_type: item.section_type });

    return { ...base, type: set, [set]: [item.id] };
  }

  // custom: an independent copy with fresh ids, laid over the type's defaults so
  // any fields added since it was saved still get sensible values.
  return alignCustomSetIds(win, {
    ...base,
    ...reidSection(win, item.section_data || {}),
    _id: newId,
    id: newId,
    _visual_id: newUuid(win),
    enabled: true,
    type: item.section_type,
  });
}

/**
 * Custom YAML has `id` (not `_id`) and no `_visual_id`. After reid, plus and
 * rowLocation look up the preview `data-sid` against form values — both keys
 * and a visual id have to be present and equal. Only used on custom insert,
 * not on Add-row / blankRowFrom.
 */
function isCustomSetRow(node) {
  if (!node || typeof node !== 'object') {
    return false;
  }

  if ('_id' in node || '_visual_id' in node) {
    return true;
  }

  if (typeof node.type !== 'string') {
    return false;
  }

  if (node.type === 'text' || node.type === 'paragraph' || node.type === 'hardBreak' || node.type === 'heading') {
    return false;
  }

  return 'enabled' in node || 'id' in node;
}

export function alignCustomSetIds(win, row) {
  const walk = (node) => {
    if (Array.isArray(node)) {
      node.forEach(walk);

      return;
    }

    if (!node || typeof node !== 'object') {
      return;
    }

    if (isCustomSetRow(node)) {
      const fresh = node._id || node.id || newRowId();

      node._id = fresh;
      node.id = fresh;

      if (!node._visual_id) {
        node._visual_id = newUuid(win);
      }
    }

    Object.values(node).forEach(walk);
  };

  walk(row);

  return row;
}

/**
 * Inserts a library card's section: fetches the set's fresh meta, builds the
 * row from it, and drops it in at `afterUid` (null = top). Async because the
 * meta round-trip is what lets the row render in the CP list, not only the
 * preview.
 */
export async function insertSection(win, doc, afterUid, kind, item) {
  if (kind === 'template') {
    return insertTemplate(win, doc, afterUid, item);
  }

  const handle = setHandleFor(win, kind, item);
  const newId = newRowId();
  const meta = await fetchSetMeta(win, handle);
  const row = buildSectionRow(win, kind, item, meta?.defaults, newId);

  insertSectionAfter(win, doc, afterUid, row, hydrateExistingMeta(row, meta?.new || {}, meta?.defaults));
}

/**
 * Drops a whole template onto the page.
 *
 * Every section in it is copied — a template is a stencil, never a reference —
 * and each one is laid over its type's current defaults, so a template saved
 * before a field existed still gets a sensible value for it.
 *
 * Meta is fetched per section *type*, not per row: the Replicator renders each row
 * from `meta.<field>.existing[<_id>]`, so without it the sections would appear in
 * the preview and be missing from the CP list.
 */
export async function insertTemplate(win, doc, afterUid, item) {
  const sections = (item.sections || []).filter((section) => section && section.type);

  if (!sections.length) {
    win.Statamic?.$toast?.error(t(win, 'template_empty'));

    return;
  }

  const mode = await askTemplateMode(win, item);

  if (!mode) {
    return; // cancelled
  }

  const rows = [];
  const metas = [];

  for (const section of sections) {
    const meta = await fetchSetMeta(win, section.type);
    const newId = newRowId();

    const row = buildSectionRow(
      win,
      'custom',
      { section_data: section, section_type: section.type },
      meta?.defaults,
      newId
    );

    rows.push(row);
    metas.push(hydrateExistingMeta(row, meta?.new || {}, meta?.defaults));
  }

  insertSectionsAfter(win, doc, afterUid, rows, metas, mode === 'replace');
}

/**
 * The multi-row sibling of `insertSectionAfter`: all of a template's sections in
 * one write.
 *
 * One `setFieldValue` for the lot, not one per section — each call re-renders the
 * Replicator, so inserting fifteen sections one at a time would be fifteen
 * re-renders and fifteen preview reloads.
 */
export function insertSectionsAfter(win, doc, afterUid, rows, rowMetas, replace) {
  const field = sectionField(win);

  for (const container of sve.activeContainers(doc)) {
    const values = sve.unwrapRef(container.values);

    if (!values || typeof values !== 'object') {
      continue;
    }

    const existing = sve.dataGet(values, field);

    if (!Array.isArray(existing)) {
      continue;
    }

    rows.forEach((row, index) => writeSetMeta(container, field, row, rowMetas[index]));

    if (replace) {
      container.setFieldValue(field, rows);

      return true;
    }

    if (afterUid == null) {
      container.setFieldValue(field, [...rows, ...JSON.parse(JSON.stringify(existing))]);

      return true;
    }

    const found = rowLocation(values, afterUid);

    if (!found) {
      continue;
    }

    const next = JSON.parse(JSON.stringify(found.rows));

    next.splice(found.index + 1, 0, ...rows);
    container.setFieldValue(found.parentPath, next);

    return true;
  }

  return false;
}

/**
 * Replace what's on the page, or add to it?
 *
 * Asked every time rather than remembered: dropping a template on an empty page
 * and dropping one onto a page you've already built are different intentions, and
 * replacing is not undoable from here.
 */
export function askTemplateMode(win, item) {
  return new Promise((resolve) => {
    const overlay = openCpOverlay(win.document, ChoiceDialog, {
      title: item.title,
      body: t(win, 'template_mode_body', { count: (item.sections || []).length }),
      buttons: [
        { value: null, label: t(win, 'cancel'), variant: 'ghost' },
        { value: 'replace', label: t(win, 'template_replace'), variant: 'muted' },
        { value: 'append', label: t(win, 'template_append'), variant: 'primary' },
      ],
      onPick: (value) => {
        overlay.dismiss();
        resolve(value);
      },
      onClose: () => resolve(null),
    });
  });
}

export function closeSectionPicker(win) {
  const panel = win.document.getElementById(SECTION_PICKER_ID);

  panel?._sveLibRo?.disconnect?.();
  panel?.remove();
  releaseRightShellIfEmpty(win);
  syncPreviewInset(win);
}

/** True while editing header/footer chrome or a global section. */
export function isSectionLibraryLocked(win) {
  return !!sve.activeChromeKind || sve.globalSectionEditorOpen(win.document);
}

/**
 * The top-bar tools that belong to the page rather than to what is being edited
 * inside it.
 *
 * Stepping into a header, a footer or a global section locks the page around it:
 * the other sections fade, and a click out there does nothing. These four reach
 * straight past that lock — another page, another global set, the section
 * library, the block tree — so while you are inside, they have nothing to act on.
 *
 * The panel tool is deliberately not among them. The left-sidebar icon is how you
 * get at the fields you stepped in for, and taking it away would lock the way in
 * along with the way out.
 */
export const FOCUS_LOCKED_TABS = ['pages', 'globals', 'sections', 'listview'];

/**
 * Dim and disable those tools while chrome or a global section owns the editor.
 *
 * Painted from applyHeaderTab, which runs on the header loop — so the state
 * survives Vue rebuilding the bar underneath it, the same way the icons' own
 * colours do.
 */
export function paintFocusLockedTabs(win, btn, tab, on) {
  const off = isSectionLibraryLocked(win) && FOCUS_LOCKED_TABS.includes(tab);

  btn.disabled = off;
  btn.style.pointerEvents = off ? 'none' : '';
  btn.style.cursor = off ? 'default' : 'pointer';
  // A merged tool wears its surface on the frame around the glyph, and it is the
  // frame that goes out — see applyHeaderTab. Fading the glyph here as well would
  // fade it twice over, leaving it far darker than the standalone icons it stands
  // in a row with.
  btn.style.opacity = off
    ? (MERGED_TABS.includes(tab) ? '1' : sve.LP_ICON_LOCKED_OPACITY)
    : on
      ? '1'
      : sve.LP_ICON_IDLE_OPACITY;

  if (off) {
    btn.setAttribute('aria-disabled', 'true');
  } else {
    btn.removeAttribute('aria-disabled');
  }

  return off;
}

/**
 * Hide/disable the Sections header button (and close what those tools have open)
 * while chrome or a global section owns the editor — dragging sections there is
 * a no-op, and a panel left standing would sit over the fields you came for.
 */
export function syncSectionLibraryAvailability(win) {
  const doc = win.document;
  const locked = isSectionLibraryLocked(win);
  const noBuilder = !formHasSectionField(win);
  const btn = doc.getElementById(sve.LIBRARY_BUTTON_ID);

  if (noBuilder) {
    closeSectionPicker(win);

    if (btn) {
      btn.style.display = 'none';
      btn.setAttribute('aria-disabled', 'true');
      btn.disabled = true;
    }

    applyHeaderTab(win);

    return;
  }

  if (locked) {
    closeSectionPicker(win);
    sve.closeListViewPanel(win);
    sve.closeOutlinePanel(win);

    if (btn) {
      btn.style.display = 'none';
      btn.setAttribute('aria-disabled', 'true');
      btn.disabled = true;
    }

    // An unfolded Pages or Globals control is the same tool, one state further
    // out — folded away with the rest so the bar reads as one locked row.
    if (FOCUS_LOCKED_TABS.includes(sveState.headerTab)) {
      setHeaderTab(win, null);
    }

    applyHeaderTab(win);

    return;
  }

  if (btn) {
    btn.style.display = '';
    btn.removeAttribute('aria-disabled');
    btn.disabled = false;
  }

  applyHeaderTab(win);
}

/** True while Theme Settings / Site settings covers the left editor. */
export function isGlobalsOverlayOpen(win) {
  const panel = win.document.getElementById(sve.GLOBALS_PANEL_ID);

  return !!(panel && !panel.hidden && !panel.hasAttribute('data-sve-chrome-hidden'));
}

/**
 * Park Theme Settings off-screen on document.body.
 *
 * Never reparent the iframe (that reloads it). Never put it in the right dock —
 * that is where the block tree / comments / library stack, and Theme Settings
 * is a full form, not one more pane in that stack.
 */
export function parkGlobalsOverlay(panel) {
  if (!panel) {
    return;
  }

  panel.hidden = true;
  panel.setAttribute('data-sve-chrome-hidden', '1');
  panel.style.cssText =
    'position:fixed;left:-10000px;top:0;width:440px;height:100vh;z-index:-1;display:none;';
}

/** Keep the iframe on body so showing it never moves it in the DOM. */
export function attachGlobalsOverlay(win, panel) {
  if (!panel || panel.parentElement === win.document.body) {
    return;
  }

  win.document.body.appendChild(panel);
}

/**
 * Cover the left Live Preview editor with Theme Settings.
 *
 * Same form as before (tabs, colour pickers, …) — just over Page Settings
 * instead of stacked in the right sidebar. Sits under the width-handle (z 62).
 * Page Settings/SEO is hidden for this overlay — same as header/footer.
 */
export function placeGlobalsOverlay(win) {
  const panel = win.document.getElementById(sve.GLOBALS_PANEL_ID);

  if (!panel || panel.hidden || panel.hasAttribute('data-sve-chrome-hidden')) {
    return;
  }

  const editor = livePreviewEditorEl(win.document);

  if (!editor || sveState.lpCollapsed) {
    return;
  }

  const rect = editor.getBoundingClientRect();
  const handle = win.document.querySelector('.live-preview-resizer');
  const grip = handle ? Math.round(handle.getBoundingClientRect().width) || 16 : 16;
  const width = Math.max(0, Math.round(rect.width) - grip);

  panel.hidden = false;
  panel.removeAttribute('data-sve-chrome-hidden');
  panel.style.cssText =
    'position:fixed;z-index:61;display:flex;flex-direction:column;overflow:hidden;' +
    'background:var(--theme-color-content-bg,#fff);color:currentColor;border:0;box-shadow:none;' +
    'font-family:ui-sans-serif,system-ui,sans-serif;box-sizing:border-box;';
  sve.hideSettingsBar?.(win);
  panel.style.left = `${Math.round(rect.left)}px`;
  panel.style.top = `${Math.round(rect.top)}px`;
  panel.style.width = `${width}px`;
  panel.style.height = `${Math.round(rect.height)}px`;
}

export function bindGlobalsOverlayLayout(win) {
  const editor = livePreviewEditorEl(win.document);

  if (!editor || typeof win.ResizeObserver !== 'function' || editor._sveGlobalsRo) {
    return;
  }

  editor._sveGlobalsRo = new win.ResizeObserver(() => placeGlobalsOverlay(win));
  editor._sveGlobalsRo.observe(editor);
}

/** Hide Theme Settings without destroying it (stash + form stay alive). */
export function hideGlobalsPanel(win, { release = true } = {}) {
  const panel = win.document.getElementById(sve.GLOBALS_PANEL_ID);

  if (!panel) {
    return;
  }

  parkGlobalsOverlay(panel);

  const tabs = win.document.getElementById(sve.LP_WIDTH_ID);

  if (tabs) {
    tabs.style.visibility = '';
  }

  if (release) {
    releaseLeftEdgeIfFree(win);
  }

  syncPreviewInset(win);
}

/** Show Theme Settings again (left overlay). Page section form stays mounted underneath. */
export function showGlobalsPanel(win) {
  const panel = win.document.getElementById(sve.GLOBALS_PANEL_ID);

  if (!panel) {
    return;
  }

  // Never reparent the iframe — moving it in the DOM reloads it and refreshes
  // the Live Preview. It lives on body; we only change its box.
  pinGlobalsPanelLeft(win, panel);

  const designs = win.document.getElementById(CHROME_DESIGNS_ID);

  if (designs) {
    designs.style.cssText =
      'position:fixed;left:-10000px;top:0;width:440px;height:100vh;z-index:-1;display:none;';
    designs.setAttribute('data-sve-chrome-hidden', '1');
  }

  syncPreviewInset(win);
}

/**
 * Docked panels on the RIGHT: sections library, block tree, comments, AI.
 * Theme Settings lives on the left and is not closed from here.
 * `keep` is id(s) to leave open. Called with nothing to close them all (leaving Live Preview).
 */
export function closeRightPanels(win, keep = null) {
  const keepIds = keep == null ? [] : Array.isArray(keep) ? keep : [keep];
  const extra = keepIds.length && RIGHT_DOCK_PIN_STACK ? pinnedKeepIds(win) : [];
  const allKeep = [...new Set([...keepIds, ...extra])];

  beginRightShellSwap();

  try {
    closeRightPanelsInner(win, allKeep);
  } finally {
    endRightShellSwap();
  }

  if (!allKeep.length) {
    hideRightDock(win);
  }
}

export function closeRightPanelsInner(win, keepIds) {
  if (!keepIds.includes(SECTION_PICKER_ID)) {
    closeSectionPicker(win);
  }

  if (!keepIds.includes(sve.OUTLINE_PANEL_ID)) {
    sve.closeOutlinePanel(win);
  }

  if (!keepIds.includes(sve.HTML_TREE_PANEL_ID)) {
    sve.closeHtmlTreePanel?.(win);
  }

  if (!keepIds.includes(sve.LISTVIEW_PANEL_ID)) {
    sve.closeListViewPanel(win);
  }

  if (!keepIds.includes(COMMENTS_PANEL_ID)) {
    sve.closeCommentsPanel(win);
  }

  if (!keepIds.includes(sve.GLOBAL_SECTION_PANEL_ID) && !keepIds.includes(sve.GLOBAL_SECTION_HOST_ID)) {
    sve.closeGlobalSectionPanel(win);
  }

  if (!keepIds.includes(CHROME_DESIGNS_ID)) {
    sve.closeChromeDesignsPanel(win);
  }

  if (!keepIds.includes('__sve-ai-panel')) {
    closeAiPanel(win);
  }
}

/**
 * Push the preview away from RIGHT-docked panels (Theme Settings, sections library, …).
 */
export function syncPreviewInset(win) {
  if (isRightDockResizing()) {
    return;
  }

  const doc = win.document;
  const el = doc.querySelector('.live-preview-contents');

  if (!el) {
    return;
  }

  const right = dockedPanelWidth(doc, [
    RIGHT_DOCK_ID,
    SECTION_PICKER_ID,
    sve.OUTLINE_PANEL_ID,
    sve.HTML_TREE_PANEL_ID,
    sve.LISTVIEW_PANEL_ID,
    COMMENTS_PANEL_ID,
    '__sve-ai-panel',
  ]);

  el.style.transition = 'padding-right .2s ease';
  el.style.paddingRight = right ? `${right}px` : '';
  el.style.paddingLeft = '';
  relayoutCodeDock(win);

  if (LP_SCALE_DEVICE_TO_PANE) {
    applyLpDevice(win);
    applyLpZoom(win);
    paintLpPreviewChrome(win);
    win.setTimeout(() => {
      applyLpDevice(win);
      applyLpZoom(win);
      paintLpPreviewChrome(win);
    }, 220);
  }

  positionLpBackButton(win);
}

export function livePreviewEditorEl(doc) {
  return doc.querySelector('.live-preview-editor');
}

/**
 * Dock Theme Settings over the LEFT Live Preview editor.
 * Stays on document.body — reparenting an iframe reloads it (preview flicker).
 */
export function pinGlobalsPanelLeft(win, panel) {
  attachGlobalsOverlay(win, panel);
  sveState.forcePanelOpen = true;
  sve.setLpCollapsed(win, false);
  applyHeaderTab(win);

  const editor = livePreviewEditorEl(win.document);

  if (editor && win.getComputedStyle(editor).position === 'static') {
    editor.style.position = 'relative';
  }

  panel.hidden = false;
  panel.removeAttribute('data-sve-chrome-hidden');
  bindGlobalsOverlayLayout(win);
  placeGlobalsOverlay(win);
  applyHeaderTab(win);
}

/** Absolute fill CSS — only for designs cards that are not an iframe form. */
export function editorOverlayCss() {
  return (
    'position:absolute;inset:0;width:auto;height:auto;z-index:50;overflow:hidden;' +
    'display:flex;flex-direction:column;background:var(--theme-color-content-bg,#fff);' +
    'color:currentColor;border:0;box-shadow:none;font-family:ui-sans-serif,system-ui,sans-serif;'
  );
}

/**
 * Open Statamic's left Live Preview editor and keep it open. Chrome UI mounts
 * inside it so switching footer ↔ hero never changes sidebar width.
 */
export function claimLivePreviewEditor(win) {
  sve.clearSolo(win.document);

  if (sveState.headerTab === 'settings') {
    setHeaderTab(win, null);
  }

  sveState.forcePanelOpen = true;
  sve.setLpCollapsed(win, false);
  applyHeaderTab(win);

  const editor = livePreviewEditorEl(win.document);

  if (editor && win.getComputedStyle(editor).position === 'static') {
    editor.style.position = 'relative';
  }
}

/** Designs panel (no iframe) can still mount inside the editor. */
export function mountInLivePreviewEditor(win, panel) {
  claimLivePreviewEditor(win);

  const doc = win.document;
  const editor = livePreviewEditorEl(doc);
  const visible = panel.style.display !== 'none' && !panel.hasAttribute('data-sve-chrome-hidden');

  panel.style.cssText = editorOverlayCss();
  panel.style.display = visible ? 'flex' : 'none';

  if (!editor) {
    doc.body.appendChild(panel);

    return;
  }

  if (win.getComputedStyle(editor).position === 'static') {
    editor.style.position = 'relative';
  }

  if (panel.parentElement !== editor) {
    editor.appendChild(panel);
  }
}

/** After chrome overlays close, follow LP mode — unless a solo section needs the pane. */
export function releaseLeftEdgeIfFree(win) {
  const doc = win.document;

  if (dockedPanelWidth(doc, [sve.GLOBALS_PANEL_ID, CHROME_DESIGNS_ID]) > 0) {
    return;
  }

  sveState.forcePanelOpen = false;

  if (!sve.lpHeader(doc)) {
    return;
  }

  if (sveState.soloUid) {
    sve.setLpCollapsed(win, false);

    return;
  }

  sve.setLpCollapsed(win, sve.lpMode(win) !== 'show');
}

/**
 * Leave header/footer chrome focus so a page section can use the left editor.
 * Theme Settings overlay is parked (form + stash intact) — only chrome designs
 * and tab-lock are cleared.
 */
export function dismissChromeForPageEdit(win) {
  hideGlobalsPanel(win, { release: false });
  win.document.getElementById(CHROME_DESIGNS_ID)?.remove();
  sve.removeChromeModeToggles(win);
  sve.setActiveChromeKind(null);
  // In this window the chrome form IS the left editor, so a page section can only
  // have it once that form is out of the way. Its stash stays until the section
  // click that got us here has been answered — the preview is still rendering the
  // header as it is being typed.
  sve.closeChromeInline(win, { refresh: false });
  sve.unlockChromeGlobalsTabs(win);
  sveState.forcePanelOpen = false;
  syncPreviewInset(win);
  syncSectionLibraryAvailability(win);
}

/** Visible width of the widest panel in `ids` (0 if none). */
export function dockedPanelWidth(doc, ids) {
  let px = 0;

  for (const id of ids) {
    const panel = doc.getElementById(id);

    if (
      !panel ||
      panel.style.display === 'none' ||
      panel.hasAttribute('data-sve-chrome-hidden') ||
      panel.hasAttribute('data-sve-right-closed')
    ) {
      continue;
    }

    px = Math.max(px, Math.round(panel.getBoundingClientRect().width));
  }

  return px;
}

// The section library is a docked panel, not a popup: it stays open while you
// work, and you drag a card straight into the preview to place it (or click to
// drop it at the end). The pending drag lives here so the ext-drop reply from
// the bridge knows what to insert.

/**
 * Chip group for the section library: the replicator tab the set sits in
 * (`group` from page_sections.yaml). A new tab in the fieldset becomes a chip
 * on its own, in fieldset order. Handle prefix (`hero/style_1` → `hero`) is
 * only used when the type has no YAML group — a flat, ungrouped fieldset.
 */
export function libraryGroupKey(type) {
  if (type && typeof type.group === 'string' && type.group.length) {
    return type.group;
  }

  const handle = type?.handle;

  if (handle && typeof handle === 'string' && handle.includes('/')) {
    return handle.split('/')[0].toLowerCase();
  }

  if (handle && typeof handle === 'string' && handle.length) {
    return handle.toLowerCase();
  }

  return 'other';
}

/** Fieldset tab label (`Content sections`), then title-cased key, then "Other". */
export function libraryGroupLabel(win, key, types) {
  const fromYaml = (types || []).find(
    (type) => type.group === key && type.group_display
  );

  if (fromYaml?.group_display) {
    return fromYaml.group_display;
  }

  if (key === 'other') {
    return t(win, 'library_group_other');
  }

  const spaced = key.replace(/[_-]+/g, ' ');

  return spaced.replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Unique group keys in fieldset order (first seen), not alphabetically. */
export function libraryGroupKeys(types) {
  const keys = [];

  (types || []).forEach((type) => {
    const key = libraryGroupKey(type);

    if (!keys.includes(key)) {
      keys.push(key);
    }
  });

  return keys;
}

/** Case-insensitive match against display/title and handle. */
export function libraryMatchesQuery(item, query) {
  const q = (query || '').trim().toLowerCase();

  if (!q) {
    return true;
  }

  const haystack = [item.display, item.title, item.handle]
    .filter((v) => typeof v === 'string' && v.length)
    .join(' ')
    .toLowerCase();

  return haystack.includes(q);
}

export function formHasSectionField(win) {
  const field = sectionField(win);
  const doc = win.document;

  if (doc.querySelector(`.publish-field-${field}, [data-field="${field}"], #field_${field}`)) {
    return true;
  }

  for (const container of sve.activeContainers(doc)) {
    const values = sve.unwrapRef(container.values);

    if (values && Array.isArray(values[field])) {
      return true;
    }
  }

  return false;
}

/** Opens/creates the docked section library. Toggles closed if already open. */
export function openSectionPicker(win, options = {}) {
  const doc = win.document;
  const initialTab = options.tab || null;

  // Switched off for this site. Checked here rather than only where the toolbar
  // icon is built, because the "add a section below" control in the preview opens
  // the library too — one gate covers every way in.
  if (!featureOn(win, 'sections')) {
    return;
  }

  // No page-builder field on this blueprint — drops have nowhere to land.
  if (!formHasSectionField(win)) {
    closeSectionPicker(win);
    syncSectionLibraryAvailability(win);

    return;
  }

  // Header/footer chrome and global-section edit own the page — no section drops.
  if (isSectionLibraryLocked(win)) {
    closeSectionPicker(win);
    syncSectionLibraryAvailability(win);

    return;
  }

  if (doc.getElementById(SECTION_PICKER_ID)) {
    if (initialTab) {
      doc.getElementById(SECTION_PICKER_ID).dispatchEvent(
        new CustomEvent('sve-set-tab', { detail: { tab: initialTab } })
      );

      return;
    }

    closeSectionPicker(win);

    return;
  }

  // Theme Settings is on the left now — the library can open beside it.
  mountSectionPicker(win, options);

  if (initialTab) {
    doc.getElementById(SECTION_PICKER_ID)?.dispatchEvent(
      new CustomEvent('sve-set-tab', { detail: { tab: initialTab } })
    );
  }
}

/** Build the sections library panel. Caller has already handled globals. */
export function mountSectionPicker(win, options = {}) {
  const doc = win.document;
  const initialTab = options.tab || null;

  if (doc.getElementById(SECTION_PICKER_ID)) {
    return;
  }

  closeRightPanels(win, [SECTION_PICKER_ID, CHROME_DESIGNS_ID]);

  const panel = doc.createElement('div');

  panel.id = SECTION_PICKER_ID;
  panel.style.cssText = RIGHT_PANEL_FILL;
  mountPane(panel, SectionLibraryPane, {
    title: t(win, 'sections'),
    hint: t(win, 'library_hint'),
    searchPlaceholder: t(win, 'library_search_placeholder'),
  });

  // Fade sits on a sibling, not on the scroller. Setting mask-image on a
  // scrollable element resets scrollLeft in Chrome.
  const syncGroupsFade = () => {
    const groups = panel.querySelector('[data-sve-groups]');
    const fade = panel.querySelector('[data-sve-groups-fade]');

    if (!groups || !fade) {
      return;
    }

    const more = groups.scrollWidth - groups.clientWidth - groups.scrollLeft > 1;

    fade.style.display = more ? 'block' : 'none';
  };

  const applyLibraryLayout = () => {
    const w = panel.getBoundingClientRect().width || rightDockWidth(win);
    const cols = w >= 720 ? 3 : w >= 480 ? 2 : 1;
    const grid = panel.querySelector('[data-sve-grid]');
    const next = String(cols);

    syncGroupsFade();

    if (!grid || grid.style.columnCount === next) {
      return;
    }

    // Masonry lives on an unconstrained inner box; the outer [data-sve-scroll]
    // scrolls. Putting column-count on the scroll box itself overflows sideways.
    grid.style.columnCount = next;
  };

  showInRightShell(win, panel);
  applyLibraryLayout();
  syncPreviewInset(win);

  try {
    const ro = new win.ResizeObserver(() => applyLibraryLayout());

    ro.observe(panel);
    panel._sveLibRo = ro;
  } catch {
    win.addEventListener('resize', applyLibraryLayout);
  }

  const tabsEl = panel.querySelector('[data-sve-tabs]');
  const searchEl = panel.querySelector('[data-sve-search]');
  const groupsWrap = panel.querySelector('[data-sve-groups-wrap]');
  const groupsEl = panel.querySelector('[data-sve-groups]');
  const gridEl = panel.querySelector('[data-sve-grid]');

  panel.querySelector('[data-sve-close]')?.addEventListener('click', () => {
    closeSectionPicker(win);

    if (sveState.headerTab === 'sections') {
      setHeaderTab(win, null);
    }

    sve.persistDockedPanel(win);
    applyHeaderTab(win);
  });
  groupsEl.addEventListener('scroll', syncGroupsFade);

  const tabs = [
    { key: 'page', feature: 'library_page', label: t(win, 'tab_page') },
    { key: 'custom', feature: 'library_custom', label: t(win, 'tab_custom') },
    { key: 'global', feature: 'library_global', label: t(win, 'tab_global') },
    { key: 'template', feature: 'library_templates', label: t(win, 'tab_templates') },
  ].filter((tab) => featureOn(win, tab.feature));

  // 'page' is the natural landing tab, but a site can switch it off — then the
  // first tab that survived is what opens.
  const fallbackTab = tabs.some((tab) => tab.key === 'page') ? 'page' : tabs[0]?.key;
  let active = initialTab && tabs.some((tab) => tab.key === initialTab) ? initialTab : fallbackTab;
  let saved = null;
  let templates = null;
  let query = '';
  let group = null; // null = all groups
  let typesAsked = false;


  // Natural-height preview cards in a CSS-columns masonry grid. The image sets
  // the card height (no fixed crop); break-inside keeps a card in one column.
    const card = (title, imageUrl, kind, item) => {
      const el = doc.createElement('div');

      el.setAttribute('data-sve-lib-handle', String(item?.handle || item?.id || title));
      el.setAttribute('data-sve-lib-kind', kind);

      if (kind === 'custom' && item?.section_type) {
        el.setAttribute('data-sve-lib-set', String(item.section_type));
      }
      mountPane(el, LibraryCard, {
        title,
        imageUrl: imageUrl || '',
        noPreview: t(win, 'no_preview'),
        canDelete: !!item?.can_delete,
        onDelete: () => {
          confirmDeleteLibraryItem(win, kind, item, () => {
            saved = null;
            templates = null;
            renderActive();
          });
        },
      });
      beginCardDrag(win, el, kind, item);

      return el;
    };

  const empty = (text) => {
    const el = doc.createElement('div');

    mountPane(el, LibraryEmpty, { text });

    return el;
  };

  const styleChip = (btn, on) => {
    btn.style.background = on ? 'var(--theme-color-primary,#4f46e5)' : 'rgba(128,128,128,.22)';
    btn.style.color = on ? '#fff' : 'currentColor';
    btn.style.fontWeight = on ? '600' : '500';
    btn.style.opacity = '1';
  };

  const renderGroups = () => {
    if (active !== 'page') {
      groupsWrap.style.display = 'none';
      groupsEl.innerHTML = '';

      return;
    }

    const types = sectionTypes(win);
    const ordered = libraryGroupKeys(types);

    if (group && !ordered.includes(group)) {
      group = null;
    }

    if (ordered.length < 2) {
      groupsWrap.style.display = 'none';
      groupsEl.innerHTML = '';
      group = null;

      return;
    }

    const scrollLeft = groupsEl.scrollLeft;

    groupsWrap.style.display = 'block';
    mountPane(groupsEl, LibraryGroups, {
      chips: [
        { key: '', label: t(win, 'library_group_all'), on: group === null },
        ...ordered.map((key) => ({
          key,
          label: libraryGroupLabel(win, key, types),
          on: group === key,
        })),
      ],
      onPick: (key) => {
        group = key || null;
        renderActive();
      },
    });
    groupsEl.scrollLeft = scrollLeft;
    requestAnimationFrame(syncGroupsFade);
  };

  const gridScrollEl = () => panel.querySelector('[data-sve-scroll]');

  /**
   * Fill the masonry without snapping scroll back to the top.
   *
   * Preview polling used to wipe `innerHTML` every 1.5s. Emptying the grid
   * collapses the scroll box, so `scrollTop` clamps to 0 — and the group chips
   * were rebuilt the same way. Same cards in the same order only get their
   * picture/title updated.
   */
  const paintGrid = (rows, before) => {
    const existing = [...gridEl.querySelectorAll(':scope > [data-sve-lib-handle]')];
    const sameOrder =
      existing.length === rows.length &&
      rows.length > 0 &&
      rows.every((row, i) => existing[i].getAttribute('data-sve-lib-handle') === row.key);

    if (sameOrder) {
      rows.forEach((row, i) => {
        const el = existing[i];
        const titleEl = el.querySelector('[data-sve-card-title]');

        if (titleEl && titleEl.textContent !== row.title) {
          titleEl.textContent = row.title;
        }

        const img = el.querySelector('img');

        if (row.imageUrl) {
          if (img) {
            if (img.getAttribute('src') !== row.imageUrl) {
              const h = img.getBoundingClientRect().height;

              if (h) {
                img.style.minHeight = `${Math.round(h)}px`;
                img.addEventListener('load', () => {
                  img.style.minHeight = '';
                }, { once: true });
              }

              img.setAttribute('src', row.imageUrl);
            }
          } else {
            el.replaceWith(card(row.title, row.imageUrl, row.kind, row.item));
          }
        }
      });

      return;
    }

    const scrollEl = gridScrollEl();
    const top = scrollEl?.scrollTop ?? 0;

    gridEl.innerHTML = '';
    before?.();
    rows.forEach((row) => gridEl.appendChild(card(row.title, row.imageUrl, row.kind, row.item)));

    if (scrollEl) {
      scrollEl.scrollTop = top;
    }
  };

  const renderPage = () => {
    const types = sectionTypes(win);

    if (!types.length) {
      gridEl.innerHTML = '';
      gridEl.appendChild(empty(t(win, 'no_section_types')));

      return;
    }

    const filtered = types.filter((type) => {
      if (group && libraryGroupKey(type) !== group) {
        return false;
      }

      return libraryMatchesQuery(type, query);
    });

    if (!filtered.length) {
      gridEl.innerHTML = '';
      gridEl.appendChild(empty(t(win, 'library_no_matches')));

      return;
    }

    paintGrid(
      filtered.map((type) => ({
        key: String(type.handle),
        title: type.display,
        imageUrl: type.image_url,
        kind: 'page',
        item: type,
      }))
    );
  };

  const applyTypeRefresh = (diff = { listChanged: true, imagesChanged: true }) => {
    if (active !== 'page') {
      return;
    }

    if (diff.listChanged) {
      renderGroups();
    }

    if (diff.listChanged || diff.imagesChanged) {
      renderPage();
    }
  };

  const renderSaved = (synced) => {
    const items = (saved || []).filter((s) => !!s.synced === synced);

    if (!items.length) {
      gridEl.innerHTML = '';
      gridEl.appendChild(
        empty(
          synced
            ? t(win, 'no_global_sections')
            : t(win, 'no_saved_sections')
        )
      );

      return;
    }

    const filtered = items.filter((item) => libraryMatchesQuery(item, query));

    if (!filtered.length) {
      gridEl.innerHTML = '';
      gridEl.appendChild(empty(t(win, 'library_no_matches')));

      return;
    }

    paintGrid(
      filtered.map((item) => ({
        key: String(item.id),
        title: item.title,
        imageUrl: item.preview_url,
        kind: synced ? 'global' : 'custom',
        item,
      }))
    );

    [...new Set(filtered.map((item) => item.section_type).filter(Boolean))].forEach((handle) => {
      fetchSetMeta(win, handle);
    });
  };

  // A template's card carries the whole page, so it says how many sections that
  // is — the picture alone can't tell you whether you're about to drop three
  // sections or fifteen.
  const renderTemplates = () => {
    const saveBtn = () => {
      const el = doc.createElement('div');

      mountPane(el, LibrarySaveButton, {
        label: t(win, 'save_page_as_template'),
        onSave: () => sve.savePageAsTemplate(win, () => {
          templates = null;
          renderActive();
        }),
      });

      return el;
    };

    if (!(templates || []).length) {
      gridEl.innerHTML = '';
      gridEl.appendChild(saveBtn());
      gridEl.appendChild(empty(t(win, 'no_templates')));

      return;
    }

    const filtered = templates.filter((item) => libraryMatchesQuery(item, query));

    if (!filtered.length) {
      gridEl.innerHTML = '';
      gridEl.appendChild(saveBtn());
      gridEl.appendChild(empty(t(win, 'library_no_matches')));

      return;
    }

    paintGrid(
      filtered.map((item) => ({
        key: String(item.id),
        title: `${item.title} · ${t(win, 'template_count', { count: item.count })}`,
        imageUrl: item.preview_url,
        kind: 'template',
        item,
      })),
      () => gridEl.appendChild(saveBtn())
    );
  };

  // Design cards for header/footer live in the LEFT chrome-designs panel now —
  // not in this sections library.

  const renderActive = () => {
    mountPane(tabsEl, LibraryTabs, {
      tabs: tabs.map((tab) => ({ ...tab, on: tab.key === active })),
      onPick: (key) => {
        active = key;

        if (active !== 'page') {
          group = null;
        }

        renderActive();
      },
    });

    const hintEl = panel.querySelector('[data-sve-hint]');

    if (hintEl) {
      hintEl.textContent = t(win, 'library_hint');
    }

    if (searchEl) {
      searchEl.placeholder = t(win, 'library_search_placeholder');
    }

    renderGroups();

    if (active === 'page') {
      if (!typesAsked) {
        typesAsked = true;
        refreshSectionTypes(win, applyTypeRefresh);
      }

      renderPage();

      return;
    }

    if (active === 'template') {
      if (templates === null) {
        gridEl.innerHTML = '';
        gridEl.appendChild(empty(t(win, 'loading')));

        pollLibrary(
          win,
          '/!/sve/templates',
          (data) => data.templates || [],
          (items) => {
            templates = items;

            if (active === 'template') {
              renderTemplates();
            }
          },
          () => {
            templates = [];
            gridEl.innerHTML = '';
            gridEl.appendChild(empty(t(win, 'templates_failed')));
          }
        );

        return;
      }

      renderTemplates();

      return;
    }

    if (saved === null) {
      gridEl.innerHTML = '';
      gridEl.appendChild(empty(t(win, 'loading')));

      pollLibrary(
        win,
        '/!/sve/saved-sections',
        (data) => data.sections || [],
        (items) => {
          saved = items;

          if (active === 'custom' || active === 'global') {
            renderSaved(active === 'global');
          }
        },
        () => {
          saved = [];
          gridEl.innerHTML = '';
          gridEl.appendChild(empty(t(win, 'saved_sections_failed')));
        }
      );

      return;
    }

    renderSaved(active === 'global');
  };

  searchEl.addEventListener('input', () => {
    query = searchEl.value;
    renderActive();
  });

  // Something was added to a library while this panel was open — a section just
  // saved from the editor, most often. The lists it has are from before that, so
  // it drops them and asks again. A screenshot follows the save; one catch-up
  // event (not a 1.5s loop) fills the picture in.
  panel.addEventListener('sve-library-stale', () => {
    saved = null;
    templates = null;
    sectionTypesOverride = null;
    typesAsked = false;
    renderActive();

    win.clearTimeout(libraryCatchupTimer);
    libraryCatchupTimer = win.setTimeout(() => {
      panel.dispatchEvent(new win.CustomEvent('sve-library-preview-ready'));
    }, 8000);
  });

  panel.addEventListener('sve-library-preview-ready', () => {
    refreshSectionTypes(win, applyTypeRefresh);

    if (saved !== null) {
      pollLibrary(
        win,
        '/!/sve/saved-sections',
        (data) => data.sections || [],
        (items) => {
          saved = items;

          if (active === 'custom' || active === 'global') {
            renderSaved(active === 'global');
          }
        },
        () => {}
      );
    }

    if (templates !== null) {
      pollLibrary(
        win,
        '/!/sve/templates',
        (data) => data.templates || [],
        (items) => {
          templates = items;

          if (active === 'template') {
            renderTemplates();
          }
        },
        () => {}
      );
    }
  });

  panel.addEventListener('sve-set-tab', (event) => {
    const next = event.detail?.tab;

    if (!next || !tabs.some((tab) => tab.key === next)) {
      return;
    }

    active = next;
    group = null;
    renderActive();

    const activeBtn = tabsEl.querySelector(`[data-tab="${next}"]`);

    activeBtn?.scrollIntoView({ inline: 'nearest', block: 'nearest' });
  });

  renderActive();
  searchEl.focus();
}

export const LIBRARY_DELETE_ID = '__sve-library-delete';

export const TRASH_ICON =
  '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" ' +
  'stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ' +
  'style="display:block;pointer-events:none"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>' +
  '<path d="M10 11v6M14 11v6"/></svg>';

/**
 * The trash on a library card.
 *
 * Its pointerdown is swallowed so the card's drag handler never starts: without
 * that, aiming for the trash would pick the card up and — under the drag
 * threshold — drop the section onto the page instead of deleting it.
 */
export function libraryDeleteButton(win, kind, item, onDeleted) {
  const btn = win.document.createElement('button');

  btn.type = 'button';
  btn.title = t(win, 'delete_item');
  btn.setAttribute('aria-label', t(win, 'delete_item'));
  btn.innerHTML = TRASH_ICON;
  btn.style.cssText =
    'all:unset;cursor:pointer;flex:0 0 auto;display:inline-flex;align-items:center;justify-content:center;' +
    'width:24px;height:24px;border-radius:6px;color:currentColor;opacity:.45;transition:opacity .12s,color .12s;';
  btn.addEventListener('mouseenter', () => {
    btn.style.opacity = '1';
    btn.style.color = '#dc2626';
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.opacity = '.45';
    btn.style.color = 'currentColor';
  });
  btn.addEventListener('pointerdown', (event) => event.stopPropagation());
  btn.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    confirmDeleteLibraryItem(win, kind, item, onDeleted);
  });

  return btn;
}

/**
 * "Are you sure?" for deleting something out of the library.
 *
 * Three different things, three different costs. A template and a custom section
 * are only ever *copied* onto a page, so the pages built from one keep what they
 * have and the question is simple. A global section is a live reference: the
 * dialog looks first, and if pages point at it they're named, because confirming
 * takes the section off all of them. A section *type* is heavier still — the set
 * leaves the fieldset, so no page can ever add one again, and the pages that
 * have one lose it along with its content.
 */
export function confirmDeleteLibraryItem(win, kind, item, onDeleted) {
  const doc = win.document;
  const isTemplate = kind === 'template';
  const isType = kind === 'page';
  const name = item.display || item.title;

  doc.getElementById(LIBRARY_DELETE_ID)?.remove();

  const host = doc.createElement('div');

  host.id = LIBRARY_DELETE_ID;
  doc.body.appendChild(host);

  const app = mountSurface(DeleteLibraryDialog, host);
  const close = () => {
    app.unmount();
    host.remove();
  };

  const titleKey = isTemplate
    ? 'delete_template_title'
    : isType
      ? 'delete_section_type_title'
      : 'delete_saved_section_title';

  const usageWhere = (usage) =>
    usage.count > 1
      ? `${usage.collection_title} · ${t(win, 'delete_usage_count', { count: usage.count })}`
      : usage.collection_title;

  const setButtons = (confirmKey, removeUsages) => {
    deleteLibraryUi.buttons = [
      { id: 'cancel', label: t(win, 'cancel'), variant: '' },
      ...(confirmKey
        ? [{ id: 'confirm', label: t(win, confirmKey), variant: 'danger' }]
        : []),
    ];
    deleteLibraryUi.onPick = (id) => {
      close();

      if (id === 'confirm') {
        deleteLibraryItem(win, kind, item, removeUsages, onDeleted);
      }
    };
  };

  deleteLibraryUi.title = t(win, titleKey, { name });
  deleteLibraryUi.body = t(win, isTemplate ? 'delete_template_body' : 'delete_checking');
  deleteLibraryUi.leads = [];
  deleteLibraryUi.usages = [];
  deleteLibraryUi.usageHeading = '';
  deleteLibraryUi.onClose = close;
  setButtons(isTemplate ? 'delete_confirm' : null, false);

  if (isTemplate) {
    return;
  }

  const usageUrl = isType
    ? `/!/sve/section-types/usage?handle=${encodeURIComponent(item.handle)}`
    : `/!/sve/saved-sections/${encodeURIComponent(item.id)}/usage`;

  win
    .fetch(usageUrl, {
      credentials: 'same-origin',
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
    })
    .then((res) => (res.ok ? res.json() : Promise.reject(res)))
    .then((data) => {
      const usages = data.usages || [];

      if (!usages.length) {
        deleteLibraryUi.body = t(
          win,
          isType
            ? 'delete_section_type_body'
            : item.synced
              ? 'delete_global_section_unused_body'
              : 'delete_saved_section_body'
        );
        setButtons('delete_confirm', false);

        return;
      }

      const leadKeys = isType
        ? ['delete_section_type_body', 'delete_section_type_used']
        : ['delete_global_section_body'];

      deleteLibraryUi.body = '';
      deleteLibraryUi.leads = leadKeys.map((key) => t(win, key));
      deleteLibraryUi.usageHeading =
        usages.length === 1
          ? t(win, 'delete_usage_heading_one')
          : t(win, 'delete_usage_heading', { count: usages.length });
      deleteLibraryUi.usages = usages.map((usage) => ({
        title: usage.title,
        where: usageWhere(usage),
      }));
      setButtons('delete_confirm_everywhere', true);
    })
    .catch(() => {
      deleteLibraryUi.body = t(win, 'delete_usage_failed');
    });
}

/** Sends the delete, then tells the picker to reload the list it came from. */
export function deleteLibraryItem(win, kind, item, removeUsages, onDeleted) {
  const name = item.display || item.title;
  const suffix = removeUsages ? 'remove_usages=1' : '';

  const url =
    kind === 'template'
      ? `/!/sve/templates/${encodeURIComponent(item.id)}`
      : kind === 'page'
        ? `/!/sve/section-types?handle=${encodeURIComponent(item.handle)}${suffix ? `&${suffix}` : ''}`
        : `/!/sve/saved-sections/${encodeURIComponent(item.id)}${suffix ? `?${suffix}` : ''}`;

  win
    .fetch(url, {
      method: 'DELETE',
      credentials: 'same-origin',
      headers: {
        'X-CSRF-TOKEN': sve.csrfToken(win),
        'X-Requested-With': 'XMLHttpRequest',
      },
    })
    .then(async (res) => {
      const body = await res.json().catch(() => ({}));

      if (!res.ok) {
        win.Statamic?.$toast?.error(t(win, 'delete_failed'));

        return;
      }

      // The page open in the editor holds its own copy of the form. The server
      // took the rows out of the entry on disk, but not out of this — and saving
      // the page would write them straight back.
      if (kind === 'global') {
        stripSectionsFromForm(win, sectionReferenceMatcher(win, item.id));
      } else if (kind === 'page') {
        stripSectionsFromForm(win, (row) => row?.type === item.handle);
        // The picker's type list came from the page render, and one of them no
        // longer exists. The server sent the fresh list back with the delete.
        if (Array.isArray(body.section_types)) {
          sectionTypesOverride = body.section_types;
        }
      }

      win.Statamic?.$toast?.success(
        body.removed_from
          ? t(win, 'deleted_toast_everywhere', { name, count: body.removed_from })
          : t(win, 'deleted_toast', { name })
      );

      onDeleted();
    })
    .catch(() => win.Statamic?.$toast?.error(t(win, 'delete_failed')));
}

/** Matches a `global_section` row pointing at a given saved-section entry. */
export function sectionReferenceMatcher(win, savedEntryId) {
  const set = globalSectionSet(win);
  const id = String(savedEntryId);

  return (row) =>
    row !== null &&
    typeof row === 'object' &&
    row.type === set &&
    [].concat(row[set] ?? []).map(String).includes(id);
}

/** Takes every matching section row out of the form open in the editor. */
export function stripSectionsFromForm(win, matches) {
  const doc = win.document;
  const field = sectionField(win);

  const strip = (node) => {
    if (Array.isArray(node)) {
      return node.filter((entry) => !matches(entry)).map(strip);
    }

    if (node !== null && typeof node === 'object') {
      return Object.fromEntries(Object.entries(node).map(([key, value]) => [key, strip(value)]));
    }

    return node;
  };

  for (const container of sve.activeContainers(doc)) {
    const values = sve.unwrapRef(container.values);
    const rows = values && typeof values === 'object' ? values[field] : null;

    if (!Array.isArray(rows)) {
      continue;
    }

    const before = JSON.parse(JSON.stringify(rows));
    const next = strip(before);

    if (JSON.stringify(next) !== JSON.stringify(before)) {
      container.setFieldValue(field, next);
    }
  }
}

/**
 * True when the pointer is over the live-preview iframe and not over a CP
 * overlay that sits on top of it (code dock, right sidebar, left editor, Theme Settings).
 * The iframe has pointer-events:none for the drag, so the box is the source
 * of truth; elementFromPoint only vetoes overlays.
 */
export function pointerOverLivePreview(win, frame, event) {
  if (!frame) {
    return false;
  }

  const r = frame.getBoundingClientRect();

  if (
    event.clientX < r.left ||
    event.clientX > r.right ||
    event.clientY < r.top ||
    event.clientY > r.bottom
  ) {
    return false;
  }

  const hit = win.document.elementFromPoint(event.clientX, event.clientY);

  if (!hit || hit === frame || frame.contains(hit)) {
    return true;
  }

  // During a library drag the iframe has pointer-events:none, so the hit is
  // the preview shell underneath — that still counts. Only a panel covering
  // the iframe (dock, toolbar) cancels. `.live-preview-editor` is the canvas.
  return !hit.closest(
    '#__sve-right-dock, #__sve-code-dock, #__sve-globals-panel, .live-preview-header, #__sve-toolbar'
  );
}

/**
 * Pointer drag on a library card. A release over the live preview inserts.
 * Letting go halfway (library, editor, chrome) cancels; nothing is added.
 * A click without a drag does not insert.
 */
export function beginCardDrag(win, cardEl, kind, item) {
  cardEl.addEventListener('pointerdown', (event) => {
    if (event.button !== 0 || sveState.libraryDrag) {
      return;
    }

    if (kind === 'template') {
      (item.sections || []).forEach((section) => {
        if (section?.type) {
          fetchSetMeta(win, section.type);
        }
      });
    } else {
      fetchSetMeta(win, setHandleFor(win, kind, item));
    }

    const doc = win.document;
    const frame = sve.previewFrame(doc);
    const startX = event.clientX;
    const startY = event.clientY;
    let active = false;
    let ghost = null;
    let moved = false;

    const toPreview = (e) => {
      const r = frame.getBoundingClientRect();

      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };

    const stopListen = () => {
      win.removeEventListener('pointermove', onMove);
      win.removeEventListener('pointerup', onUp);
      win.removeEventListener('pointercancel', onUp);
    };

    const start = () => {
      if (!frame) {
        return;
      }

      active = true;
      cardEl.setPointerCapture(event.pointerId);
      // The iframe would swallow the pointer once we're over it — let this window
      // keep the events, and map the coordinates ourselves.
      frame.style.pointerEvents = 'none';
      frame.contentWindow.postMessage({ source: 'statamic-visual-editor', type: 'ext-drag-start' }, win.location.origin);

      ghost = cardEl.cloneNode(true);
      ghost.style.cssText +=
        ';position:fixed;z-index:2147483647;pointer-events:none;width:220px;opacity:.9;transform:rotate(1.5deg);box-shadow:0 12px 32px rgba(0,0,0,.3);';
      doc.body.appendChild(ghost);
    };

    const onMove = (e) => {
      if (!active) {
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        if (Math.hypot(dx, dy) < 6) {
          return;
        }

        moved = true;

        // Vertical move inside the list is a scroll — don't start, but don't
        // abort either: a later move toward the preview should still drop.
        const scrollEl = cardEl.closest('[data-sve-scroll]');
        const overList = scrollEl?.contains(doc.elementFromPoint(e.clientX, e.clientY));

        if (overList && Math.abs(dy) >= Math.abs(dx)) {
          return;
        }

        start();
      }

      if (!active || !frame) {
        return;
      }

      const p = toPreview(e);

      frame.contentWindow.postMessage(
        { source: 'statamic-visual-editor', type: 'ext-drag-move', x: p.x, y: p.y },
        win.location.origin
      );

      if (ghost) {
        ghost.style.left = `${e.clientX - 110}px`;
        ghost.style.top = `${e.clientY - 16}px`;
      }
    };

    const onUp = (e) => {
      stopListen();
      ghost?.remove();

      try {
        cardEl.releasePointerCapture(e.pointerId);
      } catch {
        /* already released */
      }

      if (!active) {
        return;
      }

      const overPreview =
        e.type !== 'pointercancel' && pointerOverLivePreview(win, frame, e);

      if (overPreview) {
        // The bridge replies with ext-drop → the message listener inserts.
        sveState.libraryDrag = { kind, item };
      } else {
        sveState.libraryDrag = null;
      }

      if (frame) {
        frame.style.pointerEvents = '';
        frame.contentWindow?.postMessage(
          {
            source: 'statamic-visual-editor',
            type: 'ext-drag-end',
            cancelled: !overPreview,
          },
          win.location.origin
        );
      }
    };

    win.addEventListener('pointermove', onMove);
    win.addEventListener('pointerup', onUp);
    win.addEventListener('pointercancel', onUp);
  });
}

/** The uid of the last top-level page section in the preview (for click-append). */
export function lastSectionUid(doc) {
  const frame = sve.previewFrame(doc);
  const inner = frame?.contentDocument;
  const sections = inner ? [...inner.querySelectorAll('section[data-sid], article[data-sid]')] : [];

  return sections.length ? sections[sections.length - 1].getAttribute('data-sid') : null;
}

/** A fresh row id in the same shape Statamic uses for replicator/grid rows. */
export function newRowId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

/**
 * A blank row modelled on an existing one.
 *
 * Copying the row's shape rather than building one from the blueprint: the
 * blueprint isn't reachable from here, and a row that's missing keys renders
 * wrong. Text is cleared, ids are regenerated, and everything else is kept —
 * so a new button arrives with the same styling and an empty label, ready to
 * fill in, rather than as something the template can't render.
 */
export function blankRowFrom(row) {
  const next = {};

  for (const [key, value] of Object.entries(row)) {
    if (key === 'id' || key === '_id') {
      next[key] = newRowId();
    } else if (key === '_visual_id') {
      next[key] = crypto?.randomUUID ? crypto.randomUUID() : `${newRowId()}-${newRowId()}`;
    } else if (key === 'type' || key === 'enabled') {
      // Replicator sets need their type intact — clearing it yields
      // "Undefined array key type" when the preview augments the field.
      next[key] = value;
    } else if (typeof value === 'string') {
      next[key] = '';
    } else {
      next[key] = JSON.parse(JSON.stringify(value ?? null));
    }
  }

  return next;
}

/**
 * Walks the container meta alongside the values to the field meta at `path`.
 * Meta mirrors the values tree but keys array rows by their `_id`
 * (`existing[<_id>]`) rather than by index, so numeric path segments are
 * resolved through the value at that index. Returns null if the path can't be
 * followed.
 */
export function metaForPath(fullMeta, values, path) {
  let meta = fullMeta;
  let val = values;

  for (const seg of path.split('.')) {
    if (meta == null) {
      return null;
    }

    if (/^\d+$/.test(seg)) {
      const row = Array.isArray(val) ? val[Number(seg)] : null;

      if (!row || !meta.existing) {
        return null;
      }

      meta = meta.existing[row._id];
      val = row;
    } else {
      meta = meta[seg];
      val = val ? val[seg] : null;
    }
  }

  return meta;
}

/**
 * A new row for an orderable field, pre-filled with the field's DEFAULT values
 * (from the grid meta) so the CP inputs show them and inline editing works right
 * away — matching what Statamic's own "Add row" does. Text-only defaults live in
 * `meta.<field>.defaults`; replicators (per-set defaults) have none, so those
 * fall back to a blank clone of the neighbouring row.
 */
export function newRowFor(win, container, values, parentPath, sampleRow) {
  const fullMeta = sve.unwrapRef(container.meta);
  const fieldMeta = fullMeta ? metaForPath(fullMeta, values, parentPath) : null;
  const defaults = fieldMeta && typeof fieldMeta === 'object' ? fieldMeta.defaults : null;

  let row;

  if (!defaults || typeof defaults !== 'object' || Array.isArray(defaults)) {
    row = blankRowFrom(sampleRow);
  } else {
    row = JSON.parse(JSON.stringify(defaults));
    row._id = newRowId();
  }

  // Grid rows (and anything else we inject auto_uuid onto) need a stable
  // _visual_id in the preview — without it Antlers cascades the parent block's
  // id onto the button, and "Add another" would duplicate the whole block.
  if (!row._id) {
    row._id = newRowId();
  }

  row._visual_id = newUuid(win);

  return row;
}

/** The array a row lives in, plus its index. */
export function rowLocation(values, uid) {
  const path = sve.findPathByUid(values, uid);

  if (path === null || path === '') {
    return null;
  }

  const parts = path.split('.');

  // Bard set: uid lives on attrs.values (_visual_id) or attrs (id). Climb to the
  // content-array index so hide/dup/delete/move operate on the set node itself.
  if (parts.length >= 3 && parts[parts.length - 1] === 'values' && parts[parts.length - 2] === 'attrs') {
    const index = Number(parts[parts.length - 3]);
    const parentPath = parts.slice(0, -3).join('.');
    const rows = sve.dataGet(values, parentPath);

    if (Array.isArray(rows) && Number.isInteger(index) && rows[index]?.type === 'set') {
      return { parentPath, index, rows, kind: 'bard-set' };
    }
  }

  if (parts.length >= 2 && parts[parts.length - 1] === 'attrs') {
    const index = Number(parts[parts.length - 2]);
    const parentPath = parts.slice(0, -2).join('.');
    const rows = sve.dataGet(values, parentPath);

    if (Array.isArray(rows) && Number.isInteger(index) && rows[index]?.type === 'set') {
      return { parentPath, index, rows, kind: 'bard-set' };
    }
  }

  const dot = path.lastIndexOf('.');

  if (dot === -1) {
    return null;
  }

  const parentPath = path.slice(0, dot);
  const index = Number(path.slice(dot + 1));
  const rows = sve.dataGet(values, parentPath);

  if (!Array.isArray(rows) || !Number.isInteger(index)) {
    return null;
  }

  return {
    parentPath,
    index,
    rows,
    kind: rows[index]?.type === 'set' ? 'bard-set' : 'row',
  };
}

/**
 * What the blueprint allows for the field this row lives in (max_rows/min_rows,
 * or max_sets/min_sets on a replicator). Looked up by the containing set's type
 * first, since the same handle appears in several sets with different limits.
 */
export function rowLimits(values, parentPath, win) {
  const all = win.Statamic?.$config?.get?.('sveRowLimits') ?? {};
  const handle = parentPath.slice(parentPath.lastIndexOf('.') + 1);
  const dot = parentPath.lastIndexOf('.');
  const set = dot === -1 ? null : sve.dataGet(values, parentPath.slice(0, dot));
  const type = set && typeof set === 'object' ? set.type : null;

  return (type ? all[`${type}.${handle}`] : null) ?? all[handle] ?? {};
}

/** "+" on an orderable row: add another one just after it, within the field's max. */
export async function handleAddRow(data, doc, win) {
  for (const container of sve.activeContainers(doc)) {
    const values = sve.unwrapRef(container.values);

    if (!values || typeof values !== 'object') {
      continue;
    }

    const found = rowLocation(values, data.uid);

    if (!found) {
      continue;
    }

    const { parentPath, index, rows } = found;
    const { max } = rowLimits(values, parentPath, win);

    if (max && rows.length >= max) {
      return; // the field is full — the CP wouldn't allow it either
    }

    const row = newRowFor(win, container, values, parentPath, rows[index]);
    const rowMeta = rowMetaTemplate(container, values, parentPath, rows[index]) || {};
    const built = await applySidTemplate(win, row, data.template, data.fieldDefaults, rowMeta);
    const next = JSON.parse(JSON.stringify(rows));

    next.splice(index + 1, 0, built.row);

    // Without meta.existing[row._id] the Grid/Replicator Vue UI ignores the row:
    // Live Preview (values) shows it, the sidebar does not. Same requirement as
    // handleInsertBlock / insertSectionAfter.
    writeNestedRowMeta(
      container,
      values,
      parentPath,
      built.row._id,
      attachSidNestedMeta(rowMeta, built.nestedField, built.nested)
    );
    container.setFieldValue(parentPath, next);

    return;
  }
}

/**
 * The last row of a block's field was just taken away, so the block goes too —
 * a links block with no links draws nothing, and an empty block that draws
 * nothing can't be hovered, so it could never be reached again from the page.
 *
 * `uid` is the block the preview found around the row (see blockHolding() in
 * bridge.js — always a set of an insertable container, never a page section).
 * Returns true when the block was removed, and then the caller has nothing left
 * to do: the row went with it.
 */
export function removeEmptiedBlock(container, values, uid, rows, win) {
  const block = rowLocation(values, uid);

  if (!block || block.rows === rows) {
    return false;
  }

  const { min } = rowLimits(values, block.parentPath, win);

  if (min && block.rows.length <= min) {
    return false; // the section needs this block — leave it, empty
  }

  const next = JSON.parse(JSON.stringify(block.rows));

  next.splice(block.index, 1);
  container.setFieldValue(block.parentPath, next);

  return true;
}

/** "−" on an orderable row: take it out, unless the field's min needs it. */
export function handleRemoveRow(data, doc, win) {
  if (rowIsLocked(data.uid, doc)) {
    return false;
  }

  for (const container of sve.activeContainers(doc)) {
    const values = sve.unwrapRef(container.values);

    if (!values || typeof values !== 'object') {
      continue;
    }

    const found = rowLocation(values, data.uid);

    if (!found) {
      continue;
    }

    const { parentPath, index, rows } = found;
    const { min } = rowLimits(values, parentPath, win);

    if (min && rows.length <= min) {
      return; // removing it would take the field below its minimum
    }

    const removedId = rows[index]?._id;
    const next = JSON.parse(JSON.stringify(rows));

    next.splice(index, 1);

    if (!next.length && data.emptyRemovesBlock) {
      // Drop the emptied row's meta first; removeEmptiedBlock then takes the
      // whole parent set out of values (its own meta cleanup is a separate path).
      removeNestedRowMeta(container, values, parentPath, removedId);

      if (removeEmptiedBlock(container, values, data.emptyRemovesBlock, rows, win)) {
        return;
      }
    }

    removeNestedRowMeta(container, values, parentPath, removedId);
    container.setFieldValue(parentPath, next);

    return;
  }
}

/**
 * Duplicate an orderable row (replicator set, Bard set, or grid row), keeping
 * its content but giving every id a fresh value — same idea as Statamic's
 * "Duplicate Set".
 */
export async function handleDuplicateRow(data, doc, win) {
  if (rowIsLocked(data.uid, doc)) {
    return false;
  }

  for (const container of sve.activeContainers(doc)) {
    const values = sve.unwrapRef(container.values);

    if (!values || typeof values !== 'object') {
      continue;
    }

    const found = rowLocation(values, data.uid);

    if (!found) {
      continue;
    }

    const { parentPath, index, rows, kind } = found;
    const { max } = rowLimits(values, parentPath, win);

    if (max && rows.length >= max) {
      return;
    }

    const copy = reidSection(win, rows[index]);

    if (copy && typeof copy === 'object' && 'enabled' in copy) {
      copy.enabled = true;
    }

    if (kind === 'bard-set' && copy?.type === 'set' && copy.attrs) {
      copy.attrs = { ...copy.attrs, enabled: true };

      const setHandle = copy.attrs.values?.type;
      const rowId = copy.attrs.id;

      if (setHandle && rowId) {
        const field = parentPath.slice(parentPath.lastIndexOf('.') + 1);
        const meta = await fetchNestedSetMeta(win, field, setHandle);

        writeNestedRowMeta(container, values, parentPath, rowId, meta?.new);
      }
    } else if (copy?._id) {
      // Clone the original row's meta and re-key nested `existing` to the copy's
      // new ids. `rowMetaTemplate` prefers blank `new`, whose nested keys belong
      // to fieldset defaults — same empty-sidebar bug as a custom insert.
      const fieldMeta = metaForPath(sve.unwrapRef(container.meta) || {}, values, parentPath);
      const sampleId = rows[index]?._id;
      const sampleMeta =
        (sampleId && fieldMeta?.existing?.[sampleId]
          ? JSON.parse(JSON.stringify(fieldMeta.existing[sampleId]))
          : null) || rowMetaTemplate(container, values, parentPath, rows[index]) || {};

      writeNestedRowMeta(
        container,
        values,
        parentPath,
        copy._id,
        hydrateExistingMeta(copy, sampleMeta, rows[index])
      );
    }

    const next = JSON.parse(JSON.stringify(rows));

    next.splice(index + 1, 0, copy);
    container.setFieldValue(parentPath, next);

    return;
  }
}

/**
 * Hide a replicator/Bard set (`enabled: false`) — same as the CP's blue toggle.
 * The set disappears from the preview; re-enable it from the sidebar.
 * No-ops on grid rows that have no `type` (they're not toggleable sets).
 */
export function handleHideRow(data, doc, win) {
  for (const container of sve.activeContainers(doc)) {
    const values = sve.unwrapRef(container.values);

    if (!values || typeof values !== 'object') {
      continue;
    }

    const found = rowLocation(values, data.uid);

    if (!found) {
      continue;
    }

    const { parentPath, index, rows, kind } = found;
    const row = rows[index];

    if (!row || typeof row !== 'object') {
      return;
    }

    const next = JSON.parse(JSON.stringify(rows));

    if (kind === 'bard-set' && row.type === 'set') {
      next[index] = {
        ...next[index],
        attrs: { ...(next[index].attrs || {}), enabled: false },
      };
    } else if ('type' in row) {
      next[index] = { ...next[index], enabled: false };
    } else {
      return;
    }

    container.setFieldValue(parentPath, next);

    return;
  }
}

/**
 * Answers the preview's row-caps request: whether the row's field can take
 * another row / lose this one, given its min/max. Lets the preview grey out the
 * +/− that would break the limit (the limit is still enforced here too).
 */
export function handleRowCaps(data, doc, win) {
  for (const container of sve.activeContainers(doc)) {
    const values = sve.unwrapRef(container.values);

    if (!values || typeof values !== 'object') {
      continue;
    }

    const found = rowLocation(values, data.uid);

    if (!found) {
      continue;
    }

    const { parentPath, rows } = found;
    const { min, max } = rowLimits(values, parentPath, win);
    const count = rows.length;

    sendToPreview(
      {
        source: 'statamic-visual-editor',
        type: 'row-caps-result',
        uid: data.uid,
        canAdd: !max || count < max,
        canRemove: !min || count > min,
      },
      win
    );

    return;
  }
}

/**
 * "Rediger global sektion": content belongs to the synced entry. Open its form
 * in the LEFT Live Preview editor (same place as a normal section) — not a
 * right-hand drawer. Values stream up so inline edit in the preview works.
 */
export function handleOpenGlobalSection(data, win) {
  if (!data.id) {
    return;
  }

  sve.openGlobalSectionPanel(win, data.id);
  syncSectionLibraryAvailability(win);
}

/**
 * The gear on a section in the preview: open that section's own settings popup
 * (spacing, colours, …) — the very one the panel's "Show settings" button opens,
 * so every fieldtype and condition inside it behaves exactly as it always has.
 *
 * The set has to be expanded first: a collapsed set keeps its fields behind
 * v-show, and the popup measures layout as it opens — clicked while hidden it
 * does nothing at all.
 */
export function handleSectionSettings(data, doc, win) {
  const setEl = findSetByUid(data.uid, doc) ?? sortableItemForUid(data.uid, doc);

  if (!setEl) {
    return;
  }

  if (isGlobalsOverlayOpen(win) && sve.hasUnsavedGlobals(win)) {
    sve.confirmLeaveGlobalsOverlay(win, () => {
      dismissChromeForPageEdit(win);
      handleSectionSettings(data, doc, win);
    });

    return;
  }

  dismissChromeForPageEdit(win);

  // Expand ONCE. Expanding is a toggle and Vue applies it asynchronously, so a
  // second nudge while the first is still pending closes the set right back up.
  [...collectAncestorSets(setEl), setEl].forEach(expandSet);

  let attempts = 0;
  let revealed = false;

  const open = () => {
    // Some sections hide their settings behind a revealer — open it first. It's a
    // toggle, so it gets exactly one click.
    if (!revealed) {
      const revealer = settingsRevealer(setEl);

      if (revealer && /^(show|vis)/i.test((revealer.textContent || '').trim())) {
        revealer.click();
        revealed = true;
      }
    }

    // A collapsed set renders no fields, and revealing takes a beat — just wait.
    if (!sve.sectionSettingsFields(setEl).length) {
      if (++attempts < 30) {
        setTimeout(open, 200);
      }

      return;
    }

    // Let Vue settle before isolating; fall back to showing the whole section if
    // the settings can't be pinned down.
    setTimeout(() => {
      // With the focus panel on, the section already comes up under its own name
      // with its tabs across the top — the gear means "open it on the settings
      // tab", not "show me the settings fields and nothing around them".
      const opened = sve.focusPanelOn(win)
        ? sve.soloSection(data.uid, doc, win, { kind: 'section', segment: 'settings' })
        : sve.soloSectionSettings(data.uid, doc, win);

      if (!opened) {
        sve.soloSection(data.uid, doc, win);
      }

      sveState.forcePanelOpen = true;
      sve.setLpCollapsed(win, false);
    }, 250);
  };

  open();
}

/**
 * The section's own "Show settings" revealer.
 *
 * Settings aren't a popup — `show_settings` is a `revealer` fieldtype that
 * unhides the section's `settings` fields in place. Sections are full of buttons
 * that say much the same thing (every button row and column has its own), so the
 * section's is picked by nesting: its fields sit in the set's own field list,
 * everything else's are one or more field lists further in.
 */
export function settingsRevealer(setEl) {
  const depth = (el) => {
    let levels = 0;

    for (let node = el.parentElement; node && node !== setEl; node = node.parentElement) {
      if (node.classList?.contains('publish-fields')) {
        levels++;
      }
    }

    return levels;
  };

  // Found by fieldtype, not by label: the field is *called* "Show settings", but
  // the button Statamic renders inside it reads "Show Fields".
  return [...setEl.querySelectorAll('.revealer-fieldtype button')].sort(
    (a, b) => depth(a) - depth(b)
  )[0];
}

/**
 * The panel row for a top-level array item, located via the form values: the
 * uid's path ("page_sections.3") gives the field handle and index, and the
 * sortable rows render in values order.
 */
export function sortableItemForUid(uid, doc) {
  for (const container of sve.activeContainers(doc)) {
    const values = sve.unwrapRef(container.values);

    if (!values || typeof values !== 'object') {
      continue;
    }

    const path = sve.findPathByUid(values, uid);
    const match = path?.match(/^([^.]+)\.(\d+)$/);

    if (!match) {
      continue;
    }

    return doc.querySelectorAll(`.field_${match[1]}-sortable-item`)[Number(match[2])] ?? null;
  }

  return null;
}



sve.SECTION_PICKER_ID = SECTION_PICKER_ID;
sve.CHROME_DESIGNS_ID = CHROME_DESIGNS_ID;
sve.COMMENTS_PANEL_ID = COMMENTS_PANEL_ID;
Object.defineProperty(sve, 'sectionTypesOverride', { get() { return sectionTypesOverride; }, set(v) { sectionTypesOverride = v; } });
sve.sectionTypes = sectionTypes;
Object.defineProperty(sve, 'sectionTypesGen', { get() { return sectionTypesGen; }, set(v) { sectionTypesGen = v; } });
Object.defineProperty(sve, 'lastTypeHandles', { get() { return lastTypeHandles; }, set(v) { lastTypeHandles = v; } });
Object.defineProperty(sve, 'lastTypeImages', { get() { return lastTypeImages; }, set(v) { lastTypeImages = v; } });
Object.defineProperty(sve, 'libraryCatchupTimer', { get() { return libraryCatchupTimer; }, set(v) { libraryCatchupTimer = v; } });
sve.refreshSectionTypes = refreshSectionTypes;
sve.libraryWentStale = libraryWentStale;
sve.pollLibrary = pollLibrary;
sve.newUuid = newUuid;
sve.reidSection = reidSection;
sve.hydrateExistingMeta = hydrateExistingMeta;
sve.isNestedSetMeta = isNestedSetMeta;
sve.insertSectionAfter = insertSectionAfter;
sve.writeSetMeta = writeSetMeta;
sve.sectionField = sectionField;
sve.featureOn = featureOn;
sve.globalSectionSet = globalSectionSet;
sve.savedSectionsCollection = savedSectionsCollection;
Object.defineProperty(sve, 'savedSectionIndex', { get() { return savedSectionIndex; }, set(v) { savedSectionIndex = v; } });
sve.rememberSavedSection = rememberSavedSection;
sve.savedSectionLookup = savedSectionLookup;
sve.savedSectionInfo = savedSectionInfo;
sve.firstEntryId = firstEntryId;
sve.setHandleFor = setHandleFor;
sve.sectionMetaCache = sectionMetaCache;
sve.currentCollection = currentCollection;
sve.fetchNestedSetMeta = fetchNestedSetMeta;
sve.writeNestedRowMeta = writeNestedRowMeta;
sve.removeNestedRowMeta = removeNestedRowMeta;
sve.rowMetaTemplate = rowMetaTemplate;
sve.parseSidTemplate = parseSidTemplate;
sve.normalizeSidTemplateItem = normalizeSidTemplateItem;
sve.isBardValue = isBardValue;
sve.looksLikeBardSpec = looksLikeBardSpec;
sve.specToBard = specToBard;
sve.coerceSidValue = coerceSidValue;
sve.applySidFieldDefaults = applySidFieldDefaults;
sve.assignSidTemplateValues = assignSidTemplateValues;
sve.nestedReplicatorHandle = nestedReplicatorHandle;
sve.buildSidTemplateRow = buildSidTemplateRow;
sve.attachSidNestedMeta = attachSidNestedMeta;
sve.applySidTemplate = applySidTemplate;
sve.countedTemplateTypes = countedTemplateTypes;
sve.sectionTypeFromPath = sectionTypeFromPath;
sve.overlaySidTemplate = overlaySidTemplate;
sve.watchNewRow = watchNewRow;
sve.handleInsertBlock = handleInsertBlock;
sve.handleInsertBardSet = handleInsertBardSet;
sve.fetchSetMeta = fetchSetMeta;
sve.buildSectionRow = buildSectionRow;
sve.insertSection = insertSection;
sve.insertTemplate = insertTemplate;
sve.insertSectionsAfter = insertSectionsAfter;
sve.askTemplateMode = askTemplateMode;
sve.closeSectionPicker = closeSectionPicker;
sve.isSectionLibraryLocked = isSectionLibraryLocked;
sve.FOCUS_LOCKED_TABS = FOCUS_LOCKED_TABS;
sve.paintFocusLockedTabs = paintFocusLockedTabs;
sve.syncSectionLibraryAvailability = syncSectionLibraryAvailability;
sve.isGlobalsOverlayOpen = isGlobalsOverlayOpen;
sve.parkGlobalsOverlay = parkGlobalsOverlay;
sve.attachGlobalsOverlay = attachGlobalsOverlay;
sve.placeGlobalsOverlay = placeGlobalsOverlay;
sve.bindGlobalsOverlayLayout = bindGlobalsOverlayLayout;
sve.hideGlobalsPanel = hideGlobalsPanel;
sve.showGlobalsPanel = showGlobalsPanel;
sve.closeRightPanels = closeRightPanels;
sve.closeRightPanelsInner = closeRightPanelsInner;
sve.syncPreviewInset = syncPreviewInset;
sve.livePreviewEditorEl = livePreviewEditorEl;
sve.pinGlobalsPanelLeft = pinGlobalsPanelLeft;
sve.editorOverlayCss = editorOverlayCss;
sve.claimLivePreviewEditor = claimLivePreviewEditor;
sve.mountInLivePreviewEditor = mountInLivePreviewEditor;
sve.releaseLeftEdgeIfFree = releaseLeftEdgeIfFree;
sve.dismissChromeForPageEdit = dismissChromeForPageEdit;
sve.dockedPanelWidth = dockedPanelWidth;
sve.libraryGroupKey = libraryGroupKey;
sve.libraryGroupLabel = libraryGroupLabel;
sve.libraryGroupKeys = libraryGroupKeys;
sve.libraryMatchesQuery = libraryMatchesQuery;
sve.openSectionPicker = openSectionPicker;
sve.formHasSectionField = formHasSectionField;
sve.mountSectionPicker = mountSectionPicker;
sve.LIBRARY_DELETE_ID = LIBRARY_DELETE_ID;
sve.TRASH_ICON = TRASH_ICON;
sve.libraryDeleteButton = libraryDeleteButton;
sve.confirmDeleteLibraryItem = confirmDeleteLibraryItem;
sve.deleteLibraryItem = deleteLibraryItem;
sve.sectionReferenceMatcher = sectionReferenceMatcher;
sve.stripSectionsFromForm = stripSectionsFromForm;
sve.pointerOverLivePreview = pointerOverLivePreview;
sve.beginCardDrag = beginCardDrag;
sve.lastSectionUid = lastSectionUid;
sve.newRowId = newRowId;
sve.blankRowFrom = blankRowFrom;
sve.metaForPath = metaForPath;
sve.newRowFor = newRowFor;
sve.rowLocation = rowLocation;
sve.rowLimits = rowLimits;
sve.handleAddRow = handleAddRow;
sve.removeEmptiedBlock = removeEmptiedBlock;
sve.handleRemoveRow = handleRemoveRow;
sve.handleDuplicateRow = handleDuplicateRow;
sve.handleHideRow = handleHideRow;
sve.handleRowCaps = handleRowCaps;
sve.handleOpenGlobalSection = handleOpenGlobalSection;
sve.handleSectionSettings = handleSectionSettings;
sve.settingsRevealer = settingsRevealer;
sve.sortableItemForUid = sortableItemForUid;
