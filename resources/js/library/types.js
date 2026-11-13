/**
 * section-library.js — section types, new ids, insert after.
 * Split out of section-library.js in the quality pass (tab G): the same statements, in the same
 * order; only the imports are new. section-library.js re-exports this file.
 */
import { SECTION_PICKER_ID } from '../lib/ids.js';
import { dataGet, unwrapRef } from '../lib/values.js';
import { defaultSectionField, pageBuilderParams, pageBuilderQuery, sectionField } from '../lib/config.js';
import { activeContainers } from '../lib/publish-containers.js';
import { libraryState } from './state.js';
import { setSectionGroups } from './picker.js';
import { newRowId, rowLocation } from './row-ops.js';
import { writeSetMeta } from './row-meta.js';

// ===== library =====
// --- Section picker (visual "Add section") ---------------------------------------
//
// The "+" on a section opens this instead of Statamic's native Add Set picker, so
// we can offer three tabs: the built-in section types, and the saved templates
// split into Custom (insert a copy) and Global (insert a reference). Each is shown
// with its preview image. Insertion writes straight into the page_sections array,
// after the section the "+" was clicked on.

/**
 * The section types the Patterns panel offers. A hidden set (`hide: true` —
 * the global-section carrier, a set taken out of use) is not offered to
 * anyone, super admins included: it has nothing to show and nothing to place
 * by hand. The Global tab places the carrier itself.
 *
 * The list for the page on screen: the one fetched for its sections field, or
 * the render's snapshot when that field is the default one. A page with a
 * field of its own shows nothing until its list has come back.
 */
export function sectionTypes(win) {
  const field = sectionField(win);
  const list =
    libraryState.sectionTypesOverride?.field === field
      ? libraryState.sectionTypesOverride.types
      : field === defaultSectionField(win)
        ? win.Statamic?.$config?.get?.('sveSectionTypes')
        : null;

  return Array.isArray(list) ? list.filter((type) => type?.hidden !== true) : [];
}

/** Which page's list, for a section-types or section-meta URL (`pageBuilderQuery`). */
export function blueprintQuery(win) {
  return pageBuilderQuery(win);
}

/** One cache key per page builder: two of them may both have a set of this name. */
export function pageBuilderKey(win) {
  const { blueprint, collection, sections_field: field } = pageBuilderParams(win);

  return blueprint || `${collection}.${field}`;
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

export function refreshSectionTypes(win, onUpdated) {
  const gen = ++sectionTypesGen;

  win
    .fetch(`/!/sve/section-types?${blueprintQuery(win)}`, {
      credentials: 'same-origin',
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
    })
    .then((res) => res.json())
    .then((data) => {
      if (gen !== sectionTypesGen) {
        return;
      }

      if (Array.isArray(data.groups)) {
        setSectionGroups(data.groups);
      }

      if (!Array.isArray(data.types) || !data.types.length) {
        return;
      }

      const handles = data.types.map((type) => `${type.handle}\t${type.display || ''}`).join('\n');
      const images = data.types.map((type) => type.image_url || '').join('\n');

      libraryState.sectionTypesOverride = { field: data.field || sectionField(win), types: data.types };

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
  libraryState.savedSectionIndex = null;
  win.document.getElementById(SECTION_PICKER_ID)?.dispatchEvent(new win.CustomEvent('sve-library-stale'));
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
/**
 * Tells the panels that the page's rows changed. The block tree learns it
 * through its own watch on values, but only while that panel is open; the
 * HTML tree listens to this event alone — a section dragged in from the
 * library sat outside it until something else repainted the tree.
 */
export function announcePageStructure() {
  document.dispatchEvent(new CustomEvent('sve-page-structure'));
}

export function insertSectionAfter(win, doc, afterUid, section, rowMeta = null) {
  const field = sectionField(win);

  for (const container of activeContainers(doc)) {
    const values = unwrapRef(container.values);

    if (!values || typeof values !== 'object') {
      continue;
    }

    // No uid → drop at the top of the page_sections array.
    if (afterUid == null) {
      const rows = dataGet(values, field);

      if (!Array.isArray(rows)) {
        continue;
      }

      writeSetMeta(container, field, section, rowMeta);
      container.setFieldValue(field, [section, ...JSON.parse(JSON.stringify(rows))]);
      announcePageStructure();

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
    announcePageStructure();

    return true;
  }

  return false;
}
