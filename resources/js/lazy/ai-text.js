/**
 * AI text's API for code that runs before the tool has loaded.
 *
 * ai-text.js is a lazy chunk: lazy-panels.js loads it when its icon is clicked or
 * remembered open. Eager code must not import it directly — that would pull it
 * into the main bundle — so it calls these instead. Each function answers from
 * the loaded module when it is there; before that it does what the old registry
 * stub did: "loads" ones load the panel first and return that promise, "default"
 * ones answer with a fixed value, the rest skip (the caller did not load it).
 *
 * May import: lazy-panels.js. Generated for WP4h; edit by hand from here on.
 */
import { ensurePanel, loadedPanel } from '../lazy-panels.js';

const KEY = 'ai_text';

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

function aiTextAllowedFallback(win) {
  if (win.Statamic?.$config?.get?.('sveEnabled') === false) {
    return false;
  }

  return win.Statamic?.$config?.get?.('sveFeatures')?.ai_text === true;
}

/** The switch as the browser remembered it: on for this site or for any site. */
export function aiTextStoredOn(win) {
  try {
    const store = win.localStorage;

    for (let i = 0; i < store.length; i++) {
      const key = store.key(i);

      if ((key === 'sve-ai-text-on' || key?.endsWith(':sve-ai-text-on')) && store.getItem(key) === '1') {
        return true;
      }
    }
  } catch {
    /* private mode */
  }

  return false;
}

/** With the switch on, the tool has to answer the preview without a click: load it, then sync. */
function syncAiTextWhenOn(win) {
  if (!aiTextStoredOn(win)) {
    return undefined;
  }

  return ensurePanel(KEY).then((mod) => mod.syncAiTextToPreview(win));
}

/** default: computed */
export function aiTextAllowed(...args) {
  const mod = loadedPanel(KEY);

  return mod ? mod.aiTextAllowed(...args) : aiTextAllowedFallback(...args);
}

/** default: computed */
export function isAiTextOn(...args) {
  const mod = loadedPanel(KEY);

  return mod ? mod.isAiTextOn(...args) : aiTextStoredOn(...args);
}

/** default: computed */
export function syncAiTextToPreview(...args) {
  const mod = loadedPanel(KEY);

  return mod ? mod.syncAiTextToPreview(...args) : syncAiTextWhenOn(...args);
}

/** loads */
export function toggleAiText(...args) {
  return loads('toggleAiText', args);
}

/** loads */
export function handleAiTextOpen(...args) {
  return loads('handleAiTextOpen', args);
}

/** loads */
export function handleAiTextGenerate(...args) {
  return loads('handleAiTextGenerate', args);
}

/** loads */
export function handleAiTextApply(...args) {
  return loads('handleAiTextApply', args);
}

/** loads */
export function handleAiTextSetKeywords(...args) {
  return loads('handleAiTextSetKeywords', args);
}
