/**
 * The HTML tree's API for code that runs before the tree has loaded.
 *
 * html-tree.js is a lazy chunk: lazy-panels.js loads it when its icon is clicked or
 * remembered open. Eager code must not import it directly — that would pull it
 * into the main bundle — so it calls these instead. Each function answers from
 * the loaded module when it is there; before that it does what the old registry
 * stub did: "loads" ones load the panel first and return that promise, "default"
 * ones answer with a fixed value, the rest skip (the caller did not load it).
 *
 * May import: lazy-panels.js. Generated for WP4h; edit by hand from here on.
 */
import { ensurePanel, loadedPanel } from '../lazy-panels.js';

const KEY = 'html_tree';

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

/** loads */
export function openHtmlTreePanel(...args) {
  return loads('openHtmlTreePanel', args);
}

/** loads */
export function closeHtmlTreePanel(...args) {
  return loads('closeHtmlTreePanel', args);
}

/** loads */
export function toggleHtmlTreePanel(...args) {
  return loads('toggleHtmlTreePanel', args);
}

/** skips until loaded */
export function armHtmlTreePrefetch(...args) {
  return ifLoaded('armHtmlTreePrefetch', args, undefined);
}
