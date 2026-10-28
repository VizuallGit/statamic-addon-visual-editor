/**
 * Which top bar icons each mode of Live Preview may have, as plain data — no
 * storage, no DOM.
 *
 * The site's two lists come from PHP (ToolbarModes::all(), `sveToolbarModes`):
 * { content: [tab key, …], build: [tab key, …] }, the HTML dock already on
 * Build's and off Content's. An icon a mode's list leaves out is not there in
 * that mode, whatever the user does. Only the icons of DEFAULT_ORDER are the
 * lists' to hold back: Page settings is every mode's.
 *
 * May import: lib/toolbar-groups.js.
 */
import { DEFAULT_ORDER } from './toolbar-groups.js';

export const MODES = ['content', 'build'];

const keysOf = (list) => (Array.isArray(list) ? [...new Set(list.filter((key) => DEFAULT_ORDER.includes(key)))] : []);

/** The lists as the CP script has them, made safe; null when there are none. */
export function cleanModes(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return null;
  }

  return { content: keysOf(raw.content), build: keysOf(raw.build) };
}

/**
 * May `mode` have the icon `key`? No lists — a page the CP script has not
 * been on — hold nothing back.
 */
export function modeAllows(modes, mode, key) {
  if (!modes || !DEFAULT_ORDER.includes(key)) {
    return true;
  }

  return (modes[mode === 'build' ? 'build' : 'content'] || []).includes(key);
}
