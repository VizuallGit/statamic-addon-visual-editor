/**
 * The design overlay's API for code that runs before the tool has loaded.
 *
 * design-overlay.js is a lazy chunk, loaded the first time its top-bar switch
 * is turned on (or when it was left on). Until then Live Preview carries only
 * this file and cp/design/prefs.js — the few lines that say whether it is on.
 *
 * May import: lazy-panels.js, cp/design/prefs.js.
 */
import { ensurePanel, loadedPanel } from '../lazy-panels.js';
import { designAllowed as allowed, readDesignPrefs } from '../cp/design/prefs.js';

const KEY = 'design_overlay';

export function designAllowed(win) {
  return allowed(win);
}

export function isDesignOn(win) {
  const mod = loadedPanel(KEY);

  return mod ? mod.isDesignOn(win) : readDesignPrefs(win).on;
}

/** A click while the chunk is still on its way: the same promise, not a second toggle. */
let pendingToggle = null;

/** loads */
export function toggleDesign(win) {
  const mod = loadedPanel(KEY);

  if (mod) {
    return mod.toggleDesign(win);
  }

  pendingToggle ??= ensurePanel(KEY)
    .then((loaded) => loaded.toggleDesign(win))
    .finally(() => {
      pendingToggle = null;
    });

  return pendingToggle;
}

/** With the switch on, the overlay has to follow the preview without a click: load, then sync. */
export function syncDesignToPreview(win) {
  const mod = loadedPanel(KEY);

  if (mod) {
    return mod.syncDesignToPreview(win);
  }

  if (!allowed(win) || !readDesignPrefs(win).on) {
    return undefined;
  }

  return ensurePanel(KEY).then((loaded) => loaded.syncDesignToPreview(win));
}
