/**
 * How often the author took each help row, by tag — what sorts the popup's
 * middle (help-rules/index.js `runRules`). The class stays first and the id
 * last whatever is counted; this only moves what stands between them.
 *
 * Stored with the user's other editor preferences (chrome-prefs.js), so the
 * order follows them to another browser. One JSON blob:
 * `{ div: { 'visual-edit': 4, 'alpine:x-show': 1 } }`.
 */
import { chromeGet, chromeSet } from '../chrome-prefs.js';

/** In CHROME_KEYS and ChromePrefsController::KEYS. */
export const HELP_COUNTS_KEY = 'sve-code-dock-help-counts';

/** @returns {Object<string, Object<string, number>>} */
export function helpCounts(win) {
  if (!win) {
    return {};
  }

  try {
    const parsed = JSON.parse(chromeGet(win, HELP_COUNTS_KEY) || '{}');

    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

/** One more for `id` on `tag`. */
export function countHelpUse(win, tag, id) {
  if (!win || !tag || !id) {
    return;
  }

  const counts = helpCounts(win);
  const byId = counts[tag] && typeof counts[tag] === 'object' ? counts[tag] : {};

  byId[id] = (Number(byId[id]) || 0) + 1;
  counts[tag] = byId;
  chromeSet(win, HELP_COUNTS_KEY, JSON.stringify(counts));
}
