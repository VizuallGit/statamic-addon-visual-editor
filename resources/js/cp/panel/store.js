/**
 * The selection panel's state: what is selected, resolved against the forms.
 *
 * One reactive object. The selection (lib/selection.js) says which row, or
 * which tab of which form; the registered contexts (lib/publish-containers.js)
 * hold each form's values, meta and blueprint; `resolvedSelection` is the
 * thing worked out from the two, recomputed by Vue whenever the values move
 * under it — a row deleted above it changes its index, and the path must
 * follow. Nothing here is a timer or a DOM lookup.
 *
 * Several forms at once: the page's own ('base'), a global section's borrowed
 * entry form ('sve-global-section') while one is open, the header's or
 * footer's globals form ('sve-chrome') while that is. A row is looked for in
 * the newest first — a form opened later answers for its own rows — and the
 * panel draws it on the context that owns it. `ctxKey` tells the contexts
 * apart, so the panel keys its field tree on the one in use and remounts the
 * fields when the owner changes.
 *
 * May import: vue, lib/, cp/panel/resolve.js.
 */
import { computed, markRaw, reactive } from 'vue';
import { unwrapRef } from '../../lib/values.js';
import { containerContextName } from '../../lib/publish-containers.js';
import { log } from '../../lib/debug.js';
import { resolveRow, resolveTab } from './resolve.js';

export const panelStore = reactive({
  /** The registered publish contexts, newest first (raw: Vue must not proxy Statamic's objects). */
  ctxs: [],
  /** { uid, tab, ctxName, field, source } or null — a copy of the selection at the time it changed. */
  selection: null,
  /** The tab last chosen in each form, by container name: a widget's way back is its tab. */
  tabByCtx: {},
  /** Set by the host: what the back arrow does. Called with (parent, row). */
  onBack: null,
  /** Set by the host: what the empty state's door does — opens the fields of the tab shown. Called with (row). */
  onFields: null,
  /** Set by the host: whether this user may configure fields (Statamic's `configure fields`). */
  canFields: false,
  /** Labels in the CP user's language, filled by the host. */
  strings: { back: 'Back', page: 'Page', noFields: 'No fields yet.', addFields: 'Add fields' },
});

const ctxIds = new WeakMap();
let nextCtxId = 0;

/** A stable number per context object, for keys. */
export function ctxKey(ctx) {
  if (!ctx) {
    return 0;
  }

  if (!ctxIds.has(ctx)) {
    ctxIds.set(ctx, (nextCtxId += 1));
  }

  return ctxIds.get(ctx);
}

/** Hand the store the registered contexts, newest first. */
export function setPanelContexts(list) {
  panelStore.ctxs = (list || []).map((ctx) => markRaw(ctx));
}

export function setPanelSelection(selection) {
  panelStore.selection = selection ? { ...selection } : null;

  if (selection?.tab && selection.ctxName) {
    panelStore.tabByCtx = { ...panelStore.tabByCtx, [selection.ctxName]: selection.tab };
  }
}

/** The page's own context: the one named 'base', else the oldest. */
export function pageContext() {
  return panelStore.ctxs.find((ctx) => containerContextName(ctx) === 'base') || panelStore.ctxs[panelStore.ctxs.length - 1] || null;
}

function contextNamed(name) {
  return panelStore.ctxs.find((ctx) => containerContextName(ctx) === name) || null;
}

/** The values a form holds right now (a Vue ref inside the context). */
export function valuesOf(ctx) {
  return unwrapRef(ctx?.values) || null;
}

export function blueprintOf(ctx) {
  return unwrapRef(ctx?.blueprint) || null;
}

/** The page's values, for readers that only know the page. */
export function panelValues() {
  return valuesOf(pageContext());
}

/**
 * The selection, resolved. A computed, so each form's values ref is tracked:
 * the walk re-runs when a form changes and the field path keeps pointing at
 * the same row.
 */
export const resolvedSelection = computed(() => {
  const selection = panelStore.selection;

  if (!selection || !panelStore.ctxs.length) {
    return null;
  }

  if (!selection.uid && selection.tab) {
    const ctx = contextNamed(selection.ctxName);
    const tab = ctx ? resolveTab(blueprintOf(ctx), selection.tab) : null;

    return tab ? { ...tab, ctx, ctxName: selection.ctxName } : null;
  }

  for (const ctx of panelStore.ctxs) {
    const row = resolveRow(valuesOf(ctx), blueprintOf(ctx), selection.uid, (why) =>
      log(`resolve ${selection.uid} in ${containerContextName(ctx)}: ${why}`)
    );

    if (row) {
      return { ...row, ctx, ctxName: containerContextName(ctx) };
    }
  }

  return null;
});

/**
 * What the back arrow leads to: the row above, or — for a row at the top of
 * a form that is not the page's — the tab it was opened from (a widget in the
 * header goes back to the header). Null means "the page".
 */
export const resolvedParent = computed(() => {
  const row = resolvedSelection.value;

  if (!row) {
    return null;
  }

  if (row.parentUid) {
    const parent = resolveRow(valuesOf(row.ctx), blueprintOf(row.ctx), row.parentUid);

    return parent ? { ...parent, ctx: row.ctx, ctxName: row.ctxName } : null;
  }

  const tab = row.kind !== 'tab' ? panelStore.tabByCtx[row.ctxName] : null;

  if (tab) {
    const parent = resolveTab(blueprintOf(row.ctx), tab);

    return parent ? { ...parent, ctx: row.ctx, ctxName: row.ctxName } : null;
  }

  return null;
});
