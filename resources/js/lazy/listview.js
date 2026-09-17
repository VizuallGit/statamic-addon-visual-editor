/**
 * The block tree's API for code that runs before the block tree has loaded.
 *
 * block-tree.js is a lazy chunk: lazy-panels.js loads it when its icon is clicked or
 * remembered open. Eager code must not import it directly — that would pull it
 * into the main bundle — so it calls these instead. Each function answers from
 * the loaded module when it is there; before that it does what the old registry
 * stub did: "loads" ones load the panel first and return that promise, "default"
 * ones answer with a fixed value, the rest skip (the caller did not load it).
 *
 * May import: lazy-panels.js. Generated for WP4h; edit by hand from here on.
 */
import { ensurePanel, loadedPanel } from '../lazy-panels.js';

const KEY = 'listview';

/** Loads the panel if needed, then calls it. */
function loads(name, args) {
  const mod = loadedPanel(KEY);

  return mod ? mod[name](...args) : ensurePanel(KEY).then((loaded) => loaded[name](...args));
}

/** Calls the panel when it is loaded; otherwise answers with `fallback`. */
function ifLoaded(name, args, fallback) {
  const mod = loadedPanel(KEY);

  return mod ? mod[name](...args) : fallback;
}

/** A row's uid the way the block tree reads it, for code that runs before the tree is loaded. */
function rowUidFallback(row) {
  return row?._visual_id || row?.id || row?._id || '';
}

/** skips until loaded */
export function listViewPanel(...args) {
  return ifLoaded('listViewPanel', args, undefined);
}

/** skips until loaded */
export function closeListViewPanel(...args) {
  return ifLoaded('closeListViewPanel', args, undefined);
}

/** skips until loaded */
export function toggleListViewPanel(...args) {
  return ifLoaded('toggleListViewPanel', args, undefined);
}

/** skips until loaded */
export function commentsPanel(...args) {
  return ifLoaded('commentsPanel', args, undefined);
}

/** skips until loaded */
export function closeCommentsPanel(...args) {
  return ifLoaded('closeCommentsPanel', args, undefined);
}

/** skips until loaded */
export function toggleCommentsPanel(...args) {
  return ifLoaded('toggleCommentsPanel', args, undefined);
}

/** default: undefined */
export function listViewSyncTo(...args) {
  return ifLoaded('listViewSyncTo', args, undefined);
}

/** default: undefined */
export function pinDockedPanelsUnderHeader(...args) {
  return ifLoaded('pinDockedPanelsUnderHeader', args, undefined);
}

/** default: 0 */
export function dockedPanelTop(...args) {
  return ifLoaded('dockedPanelTop', args, 0);
}

/** default: false */
export function isGridRowValue(...args) {
  return ifLoaded('isGridRowValue', args, false);
}

/** default: '' */
export function gridRowPreview(...args) {
  return ifLoaded('gridRowPreview', args, '');
}

/** default: computed */
export function blockRowUid(...args) {
  const mod = loadedPanel(KEY);

  return mod ? mod.blockRowUid(...args) : rowUidFallback(...args);
}
