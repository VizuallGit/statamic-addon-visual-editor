/**
 * X-ray's API for code that runs before the tool has loaded.
 *
 * xray.js is a lazy chunk: lazy-panels.js loads it the first time the switch
 * is turned on, or when it was left on. The top bar calls these instead of the
 * module, so a Live Preview where nobody uses X-ray carries none of it — only
 * the few lines of cp/xray/prefs.js that say whether the switch is on.
 *
 * May import: lazy-panels.js, cp/xray/prefs.js.
 */
import { ensurePanel, loadedPanel } from '../lazy-panels.js';
import { readXrayPrefs, xrayAllowed as allowed } from '../cp/xray/prefs.js';

const KEY = 'xray';

export function xrayAllowed(win) {
  return allowed(win);
}

export function isXrayOn(win) {
  const mod = loadedPanel(KEY);

  return mod ? mod.isXrayOn(win) : readXrayPrefs(win).on;
}

/** A click while the chunk is still on its way: the same promise, not a second toggle. */
let pendingToggle = null;

/** loads */
export function toggleXray(win) {
  const mod = loadedPanel(KEY);

  if (mod) {
    return mod.toggleXray(win);
  }

  pendingToggle ??= ensurePanel(KEY)
    .then((loaded) => loaded.toggleXray(win))
    .finally(() => {
      pendingToggle = null;
    });

  return pendingToggle;
}

/** With the switch on, the drawing has to follow the preview without a click: load, then sync. */
export function syncXrayToPreview(win) {
  const mod = loadedPanel(KEY);

  if (mod) {
    return mod.syncXrayToPreview(win);
  }

  if (!allowed(win) || !readXrayPrefs(win).on) {
    return undefined;
  }

  return ensurePanel(KEY).then((loaded) => loaded.syncXrayToPreview(win));
}
