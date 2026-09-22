/**
 * A section's fields, without leaving Live Preview.
 *
 * The Fieldsets screen is Statamic's own and it is good — a field type picker,
 * every field's real config form, validation, conditions. Rebuilding it here
 * would mean rebuilding all of that and getting the corners subtly wrong, so
 * this opens the actual screen in an overlay instead. Same origin (the editor
 * runs in the Control Panel), so it is a frame and nothing more.
 *
 * Which fieldset belongs to a section is the server's answer, not a guess from
 * the handle: on this site `featured_section/style_1` imports
 * `featured_sections.style_1`, singular one side and plural the other. The
 * section-types endpoint carries the import for each set.
 *
 * On Save, that section's sidebar and Antlers-data are updated in place.
 * Closing remorphs that section's preview once. Other sections are left alone.
 */
import { t } from './lib/i18n.js';
import { ask } from './cp/bus.js';
import { ensurePanel } from './lazy-panels.js';
import { openCpOverlay } from './cp/open-overlay.js';
import FieldsetOverlay from './cp/surfaces/FieldsetOverlay.vue';
import { dataGet, unwrapRef } from './lib/values.js';
import { sectionField } from './lib/config.js';
import { activeContainers } from './lib/publish-containers.js';
import { fetchSetMeta, hydrateExistingMeta, sectionMetaCache, writeSetMeta } from './section-library.js';
import { refreshLiteSetFields } from './side/lite-sections.js';

const API = '/!/sve/section-types';

function cpRoot(win) {
  return String(win.Statamic?.$config?.get?.('cpRoot') || '/cp').replace(/\/+$/, '');
}

/**
 * The section the dock currently has open, as a set handle.
 *
 * A component or a view file is not a section and has no fieldset of its own —
 * the dock reports those as `view:…`, and the button is for sections.
 */
export function currentSetHandle() {
  const type = ask('dock:current-type');

  if (typeof type !== 'string' || !type || type.startsWith('view:')) {
    return null;
  }

  return type;
}

/** The fieldset a section type imports its fields from, or null. */
export async function fieldsetFor(win, handle) {
  const res = await win.fetch(API, {
    headers: { Accept: 'application/json' },
    credentials: 'same-origin',
  });

  if (!res.ok) {
    throw new Error(`section-types ${res.status}`);
  }

  const data = await res.json();
  const type = (data.types || []).find((row) => row?.handle === handle);

  return type ? { fieldset: type.fieldset || null, display: type.display || handle } : null;
}

/**
 * Drop cached section-meta for this set, and nothing else.
 *
 * One cache stands between a saved fieldset and what the editor shows: the
 * library's `sectionMetaCache`, keyed by set handle or `field::set::section`.
 * (Until WP6b-2 there were three — the prefetch script answered
 * `/!/sve/section-meta?…` from its own URL-keyed Map with no expiry, so asking
 * the server again did not ask the server again.) Only this set's keys go —
 * other sections keep what they already have, and the sidebar does not
 * redraw them.
 */
function cacheKeyHitsSet(key, setHandle) {
  const text = String(key);
  let hay = text;

  try {
    hay = decodeURIComponent(text);
  } catch {
    /* a malformed percent-sequence is still searchable as itself */
  }

  return (
    hay === setHandle ||
    hay.includes(`set=${setHandle}`) ||
    hay.endsWith(`::${setHandle}`) ||
    hay.includes(`::${setHandle}::`)
  );
}

function dropSetCache(map, setHandle) {
  if (!map) {
    return;
  }

  if (typeof map.keys === 'function' && typeof map.delete === 'function') {
    for (const key of [...map.keys()]) {
      if (cacheKeyHitsSet(key, setHandle)) {
        map.delete(key);
      }
    }

    return;
  }

  map.delete?.(setHandle);
}

export function invalidateFieldCaches(win, setHandle) {
  // Set meta (top-level and nested keys alike) — the library's one cache.
  dropSetCache(sectionMetaCache, setHandle);

  // The data picker's Section tab is this set's fieldset — drop only that.
  ask('dock:reset-data-vars', setHandle);
}

export async function refreshFieldsForType(win, setHandle) {
  // `fetchSetMeta` and friends are direct imports from the section library
  // since WP4; the library's own panel state is still loaded on demand, so it
  // is made sure of first. (Until 19 September 2026 a guard here still read
  // `win.sve` — the registry removed in WP6c — and returned 0 every time: the
  // fieldset overlay's Save refreshed nothing, without a word.)
  await ensurePanel('sections');

  invalidateFieldCaches(win, setHandle);

  const meta = await fetchSetMeta(win, setHandle);

  if (!meta) {
    return 0;
  }

  const field = sectionField(win);
  const defaults = meta.defaults && typeof meta.defaults === 'object' ? meta.defaults : {};
  let touched = 0;

  for (const container of activeContainers(win.document)) {
    const rows = dataGet(unwrapRef(container.values), field);

    if (!Array.isArray(rows)) {
      continue;
    }

    // A field that has just been added has no value on any existing row, and
    // some fieldtypes cannot start without one. Bard is the plain example: give
    // it `undefined` and it renders a box with no toolbar that will not accept
    // a keystroke — the field is there and inert, which reads as broken rather
    // than as new. Seeding the set's default is what a page load would have
    // done. Only handles the row does not already have: an existing value is
    // the author's, and this must never reach past a new field.
    let seeded = false;

    const withDefaults = rows.map((row) => {
      if (row?.type !== setHandle) {
        return row;
      }

      const add = {};

      for (const [handle, value] of Object.entries(defaults)) {
        if (!(handle in row)) {
          add[handle] = value;
        }
      }

      if (! Object.keys(add).length) {
        return row;
      }

      seeded = true;

      return { ...row, ...add };
    });

    if (seeded) {
      container.setFieldValue(field, withDefaults);
    }

    for (const row of seeded ? withDefaults : rows) {
      if (row?.type !== setHandle || !row._id) {
        continue;
      }

      // Re-keyed to this row's own nested ids — the fresh meta is built from
      // the fieldset's defaults, whose child rows are not these ones.
      writeSetMeta(container, field, row, hydrateExistingMeta(row, meta.new || {}, meta.defaults));
      touched++;
    }
  }

  // And the field *list*, which meta does not carry. Without this a field added
  // in the overlay is saved and real but absent from the panel until a reload —
  // the panel draws its list from the set config the publish form was built
  // with, and that is a snapshot from page load.
  if (Array.isArray(meta.definitions)) {
    refreshLiteSetFields(setHandle, meta.definitions);
  }

  return touched;
}

export function canEditFields(win) {
  return win.Statamic?.$permissions?.has?.('configure fields') === true;
}

/**
 * A global set's blueprint — the header's or the footer's fields — in the
 * overlay a section's fieldset opens in. Nothing to refresh afterwards here:
 * the half's form is fetched fresh the next time it is stepped into.
 */
export function openGlobalFieldsOverlay(win, handle, label) {
  if (!handle) {
    return;
  }

  openCpOverlay(win.document, FieldsetOverlay, {
    heading: t(win, 'section_fields'),
    subtitle: label,
    src: `${cpRoot(win)}/fields/blueprints/globals/${encodeURIComponent(handle)}/edit`,
    closeLabel: t(win, 'close'),
    saveMatch: /\/fields\/blueprints\/globals\//,
    onClose: () => {},
  });
}

export function openFieldsetOverlay(win, handle, { onClose } = {}) {
  void (async () => {
    let found = null;

    try {
      found = await fieldsetFor(win, handle);
    } catch {
      win.Statamic?.$toast?.error(t(win, 'section_fields_failed'));

      return;
    }

    // A section declaring its fields inline rather than importing a fieldset
    // has nothing to open — and editing it would mean editing the page-builder
    // fieldset, which is a different screen and a different intent.
    if (!found?.fieldset) {
      win.Statamic?.$toast?.error(t(win, 'section_fields_none'));

      return;
    }

    let pending = Promise.resolve();
    let fresh = false;

    const overlay = openCpOverlay(win.document, FieldsetOverlay, {
      heading: t(win, 'section_fields'),
      subtitle: found.display,
      src: `${cpRoot(win)}/fields/fieldsets/${encodeURIComponent(found.fieldset)}/edit`,
      closeLabel: t(win, 'close'),
      onSaved: () => {
        // This set only: the sidebar field list, seeded defaults, and the
        // Antlers data picker. The preview is left alone — adding a field
        // does not change what the section renders until the template uses
        // it, and remorphing here would slow every Save.
        pending = refreshFieldsForType(win, handle)
          .then(() => {
            fresh = true;
          })
          .catch(() => {});
      },
      onClose: () => {
        void (async () => {
          await pending;

          if (!fresh) {
            try {
              await refreshFieldsForType(win, handle);
            } catch {
              // A failed refresh costs a reload, not the edit — the fieldset
              // is already saved. Refresh the preview regardless.
            }
          }

          ask('dock:refresh-preview');

          onClose?.();
        })();
      },
    });

    return overlay;
  })();
}
