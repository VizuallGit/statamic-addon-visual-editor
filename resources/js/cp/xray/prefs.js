/**
 * X-ray: the switch and its choices, as this browser remembers them.
 *
 * One plain localStorage key, not a namespaced chrome pref: Live Preview runs
 * this code in two windows (the Control Panel and the overlay that hosts it),
 * and a key namespaced by user id is not readable from both. The choice is a
 * way of working, so it is remembered; it is per browser, not synced to the
 * user record — nothing on the server knows about X-ray.
 *
 * Read by the eager facade (lazy/xray.js) to decide whether to load the tool at
 * all, and by the tool itself.
 *
 * May import: lib/config.js.
 */
import { featureOn } from '../../lib/config.js';

const KEY = 'sve-xray';

/** Every layer the bar can switch, in the order it shows them. */
export const XRAY_LAYERS = ['grid', 'flex', 'boxes', 'spacing', 'type', 'overflow', 'names'];

export const XRAY_DEFAULTS = Object.freeze({
  on: false,
  grid: true,
  flex: true,
  boxes: false,
  // On hover only, so on by default: it costs nothing until you point.
  spacing: true,
  type: false,
  // Draws nothing unless something is wrong.
  overflow: true,
  names: true,
  // The section being edited, not the whole page: on a long page the whole
  // page is a wall of lines, and the section is what the dock is writing.
  scope: 'section',
});

/** Is the tool on this site at all? The settings screen's `xray` toggle. */
export function xrayAllowed(win) {
  if (win?.Statamic?.$config?.get?.('sveEnabled') === false) {
    return false;
  }

  return featureOn(win, 'xray');
}

export function readXrayPrefs(win = window) {
  try {
    const raw = win.localStorage.getItem(KEY);
    const stored = raw ? JSON.parse(raw) : null;

    if (stored && typeof stored === 'object') {
      const out = { ...XRAY_DEFAULTS };

      for (const key of [...XRAY_LAYERS, 'on']) {
        if (typeof stored[key] === 'boolean') {
          out[key] = stored[key];
        }
      }

      if (stored.scope === 'page' || stored.scope === 'section') {
        out.scope = stored.scope;
      }

      return out;
    }
  } catch {
    /* private mode or a hand-edited value — start from the defaults */
  }

  return { ...XRAY_DEFAULTS };
}

export function writeXrayPrefs(win, prefs) {
  try {
    win.localStorage.setItem(KEY, JSON.stringify(prefs));
  } catch {
    /* private mode — the switch still works for this page */
  }
}
