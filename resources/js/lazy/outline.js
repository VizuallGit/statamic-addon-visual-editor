/**
 * The outline panel's API for code that runs before it has loaded.
 *
 * outline-panel.js is a lazy chunk: lazy-panels.js loads it when its icon is clicked or
 * remembered open. Eager code must not import it directly — that would pull it
 * into the main bundle — so it calls these instead. Each function answers from
 * the loaded module when it is there; before that it does what the old registry
 * stub did: "loads" ones load the panel first and return that promise, "default"
 * ones answer with a fixed value, the rest skip (the caller did not load it).
 *
 * May import: lazy-panels.js. Generated for WP4h; edit by hand from here on.
 */
import { ensurePanel, loadedPanel } from '../lazy-panels.js';

const KEY = 'outline';

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

/** skips until loaded */
export function toggleOutlinePanel(...args) {
  return ifLoaded('toggleOutlinePanel', args, undefined);
}

/** skips until loaded */
export function closeOutlinePanel(...args) {
  return ifLoaded('closeOutlinePanel', args, undefined);
}

/** skips until loaded */
export function handleOutline(...args) {
  return ifLoaded('handleOutline', args, undefined);
}

/** skips until loaded */
export function watchOutlineInPreview(...args) {
  return ifLoaded('watchOutlineInPreview', args, undefined);
}

/** skips until loaded */
export function fillOutlinePane(...args) {
  return ifLoaded('fillOutlinePane', args, undefined);
}

/** skips until loaded */
export function showOutlinePane(...args) {
  return ifLoaded('showOutlinePane', args, undefined);
}
