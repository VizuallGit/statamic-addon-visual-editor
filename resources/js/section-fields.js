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
 * On close the preview is refreshed, because a field added in there changes
 * what the section renders — and the editor is still showing what it rendered
 * before.
 */
import { t } from './cp-t.js';
import { ask } from './cp/bus.js';
import { openCpOverlay } from './cp/open-overlay.js';
import FieldsetOverlay from './cp/surfaces/FieldsetOverlay.vue';

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
 * Re-reads the set's meta and hands it to every row of that type on the page.
 *
 * What this fixes: a field whose *configuration* changed in the overlay — a
 * select's options, an asset field's container, anything the form reads out of
 * meta rather than out of the field definition. Those are stale otherwise,
 * because the set's meta is cached for the session on the reasoning that a
 * blueprint does not change while a form is open. That was true until this
 * panel existed, so the cache entry goes first.
 *
 * What this does NOT fix, measured rather than assumed: a brand-new field does
 * not appear in the panel beside the preview until the page is reloaded. Meta
 * is keyed by field handle and supplies each field's *state*; which fields
 * exist at all comes from the set config in the blueprint the publish form was
 * built with, and that is a snapshot from page load. Writing meta for a handle
 * the form has never heard of changes nothing on screen — `touched` counts
 * rows, not fields rendered. The field is saved and real; it renders on the
 * site and after a reload.
 *
 * Reached through the `sve` global rather than imported: these live in
 * section-library.js, and importing them would pull the whole library into the
 * HTML tree's chunk.
 *
 * @returns {Promise<number>} how many rows were given the fresh meta
 */
export async function refreshFieldsForType(win, setHandle) {
  const sve = win.sve;

  if (!sve?.fetchSetMeta || !sve.activeContainers || !sve.writeSetMeta) {
    return 0;
  }

  win.__sveSectionMetaCache?.delete(setHandle);

  const meta = await sve.fetchSetMeta(win, setHandle);

  if (!meta) {
    return 0;
  }

  const field = sve.sectionField(win);
  let touched = 0;

  for (const container of sve.activeContainers(win.document)) {
    const rows = sve.dataGet(sve.unwrapRef(container.values), field);

    if (!Array.isArray(rows)) {
      continue;
    }

    for (const row of rows) {
      if (row?.type !== setHandle || !row._id) {
        continue;
      }

      // Re-keyed to this row's own nested ids — the fresh meta is built from
      // the fieldset's defaults, whose child rows are not these ones.
      sve.writeSetMeta(container, field, row, sve.hydrateExistingMeta(row, meta.new || {}, meta.defaults));
      touched++;
    }
  }

  // And the field *list*, which meta does not carry. Without this a field added
  // in the overlay is saved and real but absent from the panel until a reload —
  // the panel draws its list from the set config the publish form was built
  // with, and that is a snapshot from page load.
  if (Array.isArray(meta.definitions) && typeof sve.refreshLiteSetFields === 'function') {
    sve.refreshLiteSetFields(setHandle, meta.definitions);
  }

  return touched;
}

export function canEditFields(win) {
  return win.Statamic?.$permissions?.has?.('configure fields') === true;
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

    const overlay = openCpOverlay(win.document, FieldsetOverlay, {
      heading: t(win, 'section_fields'),
      subtitle: found.display,
      src: `${cpRoot(win)}/fields/fieldsets/${encodeURIComponent(found.fieldset)}/edit`,
      closeLabel: t(win, 'close'),
      onClose: () => {
        void (async () => {
          // Meta first, then the render: replaying the preview against meta a
          // version behind would put the old state straight back.
          try {
            await refreshFieldsForType(win, handle);
          } catch {
            // A failed refresh costs a reload, not the edit — the fieldset is
            // already saved. Refresh the preview regardless.
          }

          ask('dock:refresh-preview');

          onClose?.();
        })();
      },
    });

    return overlay;
  })();
}
