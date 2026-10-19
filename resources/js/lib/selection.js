/**
 * What the editor has selected: one row of the page, named by its id.
 *
 * The thing the left panel shows. A click in the preview, a row in the block
 * tree, the back arrow in the panel and the Page Settings icon all write here;
 * the panel, the tree, the dock and the preview highlight read here. Nothing
 * else carries that fact — not a mark on Statamic's form, not a module
 * variable in a panel. The selection survives whatever Statamic redraws,
 * because it never lived in Statamic's DOM.
 *
 *   select({ uid, field, source })   choose a row (and, optionally, the field clicked in it)
 *   select({ tab, ctxName, source })  choose a whole tab of a form (the header, the footer)
 *   clearSelection(source)           nothing chosen: the panel shows the page
 *   currentSelection()               { uid, tab, ctxName, field, source } or null
 *   onSelection(fn)                  fn(selection, previous) on every change
 *
 * `uid` is the row's id as the preview knows it (`_visual_id`, `id` or `_id` —
 * findPathByUid in lib/values.js accepts all three). `tab` names a tab of the
 * form `ctxName` (a publish container's name), for the parts of a form that
 * are not rows. `field` is the handle of the field the click landed on, when
 * it landed on one. `source` says who selected ('preview', 'tree', 'panel',
 * 'settings', 'global', 'chrome'), so a reader can skip echoing a change back
 * to its origin.
 *
 * May import: lib/debug.js.
 */
import { log } from './debug.js';

let current = null;
const listeners = new Set();

function notify(previous) {
  for (const fn of listeners) {
    fn(current, previous);
  }
}

/** The selected row, or null. */
export function currentSelection() {
  return current;
}

/**
 * Select a row. The same row again is still a change when the field differs
 * (a second click in the same block, on another field); the very same thing
 * twice is not, and readers are not disturbed for it.
 */
export function select({ uid, tab, ctxName, field = null, source = 'preview' } = {}) {
  const id = typeof uid === 'string' && uid !== '' ? uid : null;
  const tabHandle = !id && typeof tab === 'string' && tab !== '' ? tab : null;

  if (!id && !tabHandle) {
    return clearSelection(source);
  }

  const handle = typeof field === 'string' && field !== '' ? field : null;
  const owner = typeof ctxName === 'string' && ctxName !== '' ? ctxName : null;

  if (
    current &&
    current.uid === id &&
    current.tab === tabHandle &&
    current.ctxName === owner &&
    current.field === handle
  ) {
    return current;
  }

  const previous = current;

  current = { uid: id, tab: tabHandle, ctxName: owner, field: handle, source };
  log(`select ${source} ${id || `tab:${tabHandle}@${owner}`} field=${handle || '-'}`);
  notify(previous);

  return current;
}

/** Nothing selected. Readers are told once; clearing an empty selection is silent. */
export function clearSelection(source = 'panel') {
  if (!current) {
    return null;
  }

  const previous = current;

  current = null;
  log(`clear ${source}`);
  notify({ ...previous, clearedBy: source });

  return null;
}

/** fn(selection, previous) on every change; returns the unsubscribe. */
export function onSelection(fn) {
  listeners.add(fn);

  return () => listeners.delete(fn);
}
