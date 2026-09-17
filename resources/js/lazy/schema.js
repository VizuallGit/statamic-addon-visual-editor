/**
 * The schema panel's API for code that runs before it has loaded.
 *
 * schema-panel.js is a lazy chunk: lazy-panels.js loads it when its icon is clicked or
 * remembered open. Eager code must not import it directly — that would pull it
 * into the main bundle — so it calls these instead. Each function answers from
 * the loaded module when it is there; before that it does what the old registry
 * stub did: "loads" ones load the panel first and return that promise, "default"
 * ones answer with a fixed value, the rest skip (the caller did not load it).
 *
 * May import: lazy-panels.js. Generated for WP4h; edit by hand from here on.
 */
import { ensurePanel, loadedPanel } from '../lazy-panels.js';

const KEY = 'schema';

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

function schemaAllowedFallback(win) {
  return win.Statamic?.$config?.get?.('sveFeatures')?.schema === true;
}

function isSchemaOpenFallback(doc) {
  return !!doc?.getElementById?.('__sve-schema-panel');
}

/** default: computed */
export function schemaAllowed(...args) {
  const mod = loadedPanel(KEY);

  return mod ? mod.schemaAllowed(...args) : schemaAllowedFallback(...args);
}

/** default: computed */
export function isSchemaOpen(...args) {
  const mod = loadedPanel(KEY);

  return mod ? mod.isSchemaOpen(...args) : isSchemaOpenFallback(...args);
}

/** loads */
export function toggleSchema(...args) {
  return loads('toggleSchema', args);
}

/** loads */
export function closeSchema(...args) {
  return loads('closeSchema', args);
}
