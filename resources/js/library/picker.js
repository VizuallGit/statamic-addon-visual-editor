/**
 * section-library.js — the pattern picker.
 * Split out of section-library.js in the quality pass (tab G): the same statements, in the same
 * order; only the imports are new. section-library.js re-exports this file.
 */
import { t } from '../lib/i18n.js';
import { SECTION_PICKER_ID } from '../lib/ids.js';
import { unwrapRef } from '../lib/values.js';
import { featureOn, sectionField } from '../lib/config.js';
import { activeContainers } from '../lib/publish-containers.js';
import { closeSectionPicker, isSectionLibraryLocked } from './panel-layout.js';
import { mountSectionPicker, syncSectionLibraryAvailability } from '../section-library.js';

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
export function libraryGroupLabel(win, key, types, groups = []) {
  const named = (groups || []).find((g) => g && g.handle === key && g.display);

  if (named) {
    return named.display;
  }

  const fromYaml = (types || []).find((type) => type.group === key && type.group_display);

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
/**
 * Every group of the page-builder fieldset, in its order — the ones with no
 * section in them too. Handed to the page at load (`sveSectionGroups`) and
 * refreshed with the type map; a group just made in the fieldset used to have
 * no chip until a section existed in it.
 */
let sectionGroupsOverride = null;

export function sectionGroups(win) {
  if (Array.isArray(sectionGroupsOverride)) {
    return sectionGroupsOverride;
  }

  const list = win?.Statamic?.$config?.get?.('sveSectionGroups');

  return Array.isArray(list) ? list : [];
}

export function setSectionGroups(groups) {
  sectionGroupsOverride = Array.isArray(groups) ? groups : null;
}

export function libraryGroupKeys(types, groups = []) {
  const keys = [];

  (groups || []).forEach((g) => {
    if (g && typeof g.handle === 'string' && g.handle && !keys.includes(g.handle)) {
      keys.push(g.handle);
    }
  });

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

  for (const container of activeContainers(doc)) {
    const values = unwrapRef(container.values);

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

  // Header/footer chrome and global-section edit own the page — no section drops.
  if (isSectionLibraryLocked(win)) {
    closeSectionPicker(win);
    syncSectionLibraryAvailability(win);

    return;
  }

  if (doc.getElementById(SECTION_PICKER_ID)) {
    if (initialTab) {
      doc
        .getElementById(SECTION_PICKER_ID)
        .dispatchEvent(new CustomEvent('sve-set-tab', { detail: { tab: initialTab } }));

      return;
    }

    closeSectionPicker(win);

    return;
  }

  // Theme Settings is on the left now — the library can open beside it.
  mountSectionPicker(win, options);

  if (initialTab) {
    doc
      .getElementById(SECTION_PICKER_ID)
      ?.dispatchEvent(new CustomEvent('sve-set-tab', { detail: { tab: initialTab } }));
  }
}
