/**
 * Which top bar icons each mode of Live Preview may have, as plain data — no
 * storage, no DOM.
 *
 * The site's lists come from PHP (ToolbarModes::all(), `sveToolbarModes`):
 * { content: [tab key, …], build: [tab key, …], html: [tab key, …] } —
 * `build` is Visual Build's (the list keeps the name it was stored under),
 * `html` every icon there is. An icon a mode's list leaves out is not there
 * in that mode, whatever the user does. Only the icons of DEFAULT_ORDER are
 * the lists' to hold back: Page settings is every mode's.
 *
 * The HTML dock is no icon in any mode — it is on none of the lists. It comes
 * with the mode (shut in Content, open in both Builds and shown in HTML Build
 * — build-mode-host.js), and a switch of mode leaves it to the switch.
 *
 * May import: lib/toolbar-groups.js.
 */
import { DEFAULT_ORDER } from './toolbar-groups.js';

export const MODES = ['content', 'build', 'html'];

/** The dock's tab key: the mode's, never the bar's. */
export const DOCK_TAB = 'code';

const keysOf = (list) => (Array.isArray(list) ? [...new Set(list.filter((key) => DEFAULT_ORDER.includes(key)))] : []);

/** The lists as the CP script has them, made safe; null when there are none. */
export function cleanModes(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return null;
  }

  return Object.fromEntries(MODES.map((mode) => [mode, keysOf(raw[mode])]));
}

/**
 * May `mode` have the icon `key`? No lists — a page the CP script has not
 * been on — hold nothing back.
 */
export function modeAllows(modes, mode, key) {
  if (!modes || !DEFAULT_ORDER.includes(key)) {
    return true;
  }

  return (modes[MODES.includes(mode) ? mode : 'content'] || []).includes(key);
}
