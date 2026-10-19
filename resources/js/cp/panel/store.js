/**
 * The selection panel's state: what is selected, resolved against the form.
 *
 * One reactive object. The selection (lib/selection.js) says which row; the
 * container context (lib/publish-containers.js) holds the values, meta and
 * blueprint; `resolved` is the row worked out from the two, recomputed by Vue
 * whenever the values move under it — a row deleted above it changes its
 * index, and the path must follow. Nothing here is a timer or a DOM lookup.
 *
 * `ctxId` counts the contexts seen. The panel keys its field tree on it, so a
 * new form (Statamic rebuilt the container) remounts the fields on the new
 * context instead of leaving them bound to the old refs.
 *
 * May import: vue, lib/, cp/panel/resolve.js.
 */
import { computed, markRaw, reactive } from 'vue';
import { unwrapRef } from '../../lib/values.js';
import { log } from '../../lib/debug.js';
import { resolveRow } from './resolve.js';

export const panelStore = reactive({
  /** The page form's publish context (raw: Vue must not proxy Statamic's object). */
  ctx: null,
  ctxId: 0,
  /** { uid, field, source } or null — a copy of the selection at the time it changed. */
  selection: null,
  /** Set by the host: what the back arrow does and what it says. */
  onBack: null,
  /** Labels in the CP user's language, filled by the host. */
  strings: { back: 'Back', page: 'Page' },
});

/** Hand the store a (new) container context. Same object again is a no-op. */
export function setPanelContext(ctx) {
  const next = ctx ? markRaw(ctx) : null;

  if (panelStore.ctx === next) {
    return;
  }

  panelStore.ctx = next;
  panelStore.ctxId += 1;
}

export function setPanelSelection(selection) {
  panelStore.selection = selection ? { ...selection } : null;
}

/** The values the form holds right now (a Vue ref inside the context). */
export function panelValues() {
  return unwrapRef(panelStore.ctx?.values) || null;
}

export function panelBlueprint() {
  return unwrapRef(panelStore.ctx?.blueprint) || null;
}

/**
 * The selected row, resolved. A computed, so Statamic's values ref is tracked:
 * the walk re-runs when the form changes and the field path keeps pointing at
 * the same row.
 */
export const resolvedSelection = computed(() => {
  const uid = panelStore.selection?.uid;

  if (!uid || !panelStore.ctx) {
    return null;
  }

  return resolveRow(panelValues(), panelBlueprint(), uid, (why) => log(`resolve ${uid}: ${why}`));
});

/** The row above the selected one, resolved the same way, for the back arrow. */
export const resolvedParent = computed(() => {
  const parentUid = resolvedSelection.value?.parentUid;

  if (!parentUid) {
    return null;
  }

  return resolveRow(panelValues(), panelBlueprint(), parentUid);
});
