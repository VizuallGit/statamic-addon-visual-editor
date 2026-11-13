/**
 * Design overlay: the switch and its settings, as this browser remembers them.
 *
 * Same shape as X-ray's (cp/xray/prefs.js) and for the same reason: one plain
 * localStorage key both Live Preview windows can read. The images themselves
 * are on the server, per page and size; only how they are shown is here.
 *
 * May import: lib/config.js, lib/caught.js, lib/storage.js.
 */
import { featureOn } from '../../lib/config.js';
import { logCaught } from '../../lib/caught.js';
import { keepLocal } from '../../lib/storage.js';

const KEY = 'sve-design-overlay';

export const DESIGN_DEFAULTS = Object.freeze({
  on: false,
  /** 0–100. Half: the design and the page both readable. */
  opacity: 50,
  /** `mix-blend-mode: difference` — what matches goes black, what differs lights up. */
  diff: false,
});

/** Is the tool on this site at all? The settings screen's `design_overlay` toggle. */
export function designAllowed(win) {
  if (win?.Statamic?.$config?.get?.('sveEnabled') === false) {
    return false;
  }

  return featureOn(win, 'design_overlay');
}

export function readDesignPrefs(win = window) {
  const out = { ...DESIGN_DEFAULTS };

  try {
    const raw = win.localStorage.getItem(KEY);
    const stored = raw ? JSON.parse(raw) : null;

    if (stored && typeof stored === 'object') {
      if (typeof stored.on === 'boolean') {
        out.on = stored.on;
      }

      if (typeof stored.diff === 'boolean') {
        out.diff = stored.diff;
      }

      if (Number.isFinite(stored.opacity)) {
        out.opacity = Math.min(100, Math.max(0, Math.round(stored.opacity)));
      }
    }
  } catch (error) {
    // Storage refused, or a hand-edited value: the defaults.
    logCaught('design-overlay: read the settings', error);
  }

  return out;
}

export function writeDesignPrefs(win, prefs) {
  keepLocal(win, KEY, JSON.stringify(prefs));
}

/**
 * The size an image should be sent at: as is, unless it is wider than
 * `maxWidth` — then scaled down to it. A Figma export at 2× of a 1440 frame is
 * 2880 wide and passes; a 4× export is halved.
 */
export function fitWidth(width, height, maxWidth = 3000) {
  if (!(width > 0) || !(height > 0) || width <= maxWidth) {
    return { width, height, scaled: false };
  }

  return { width: maxWidth, height: Math.round((height * maxWidth) / width), scaled: true };
}
