/**
 * What the dock's AI remembers of one author — stored with their other editor
 * preferences (chrome-prefs.js), so it follows them to another browser.
 *
 * - **Taken**: the last suggestions they took, each with the line it
 *   followed. Sent with every request as their way of writing, so the grey
 *   text drifts toward how this person writes rather than how a model does.
 * - **Counts**: this month's grey text shown and taken, ⌘K edits asked and
 *   kept — whether it helps, in numbers (Live Preview settings → HTML tree).
 *   A new month starts from nothing.
 *
 * May import: chrome-prefs.js.
 */
import { chromeGet, chromeSet } from '../chrome-prefs.js';

/** In CHROME_KEYS and ChromePrefsController::KEYS. */
export const GHOST_TAKEN_KEY = 'sve-code-dock-ghost-taken';
export const GHOST_COUNTS_KEY = 'sve-code-dock-ghost-counts';

/**
 * Kept, newest last. Small on purpose: all of a user's preferences share one
 * 20 KB blob (ChromePrefsController), and six short rows say enough.
 */
export const MAX_TAKEN = 6;
export const TAKEN_CHARS = 200;
export const LINE_CHARS = 80;

/** The counts this file keeps, in the order the settings line reads them. */
export const COUNT_KINDS = ['shown', 'taken', 'edits', 'kept'];

function readJson(win, key, fallback) {
  try {
    const parsed = JSON.parse(chromeGet(win, key) || 'null');

    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

/** @returns {{ line: string, text: string }[]} */
export function takenRows(win) {
  const rows = win ? readJson(win, GHOST_TAKEN_KEY, []) : [];

  return Array.isArray(rows) ? rows.filter((row) => row && typeof row.text === 'string') : [];
}

/**
 * One more taken: what was written, after which line. A suggestion taken
 * twice in a row is kept once.
 */
export function rememberTaken(win, line, text) {
  const taken = String(text || '').slice(0, TAKEN_CHARS);

  if (!win || taken.trim() === '') {
    return;
  }

  const rows = takenRows(win).filter((row) => row.text !== taken);

  rows.push({ line: String(line || '').trim().slice(-LINE_CHARS), text: taken });
  chromeSet(win, GHOST_TAKEN_KEY, JSON.stringify(rows.slice(-MAX_TAKEN)));
}

/** This month's YYYY-MM, by the author's clock. */
export function monthOf(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

/** @returns {{ month: string, shown: number, taken: number, edits: number, kept: number }} */
export function ghostCounts(win, now = new Date()) {
  const month = monthOf(now);
  const stored = win ? readJson(win, GHOST_COUNTS_KEY, {}) : {};
  const fresh = stored && stored.month === month ? stored : {};
  const out = { month };

  for (const kind of COUNT_KINDS) {
    out[kind] = Number(fresh[kind]) || 0;
  }

  return out;
}

/** One more `kind` (shown, taken, edits, kept) this month. */
export function countGhost(win, kind, now = new Date()) {
  if (!win || !COUNT_KINDS.includes(kind)) {
    return;
  }

  const counts = ghostCounts(win, now);

  counts[kind] += 1;
  chromeSet(win, GHOST_COUNTS_KEY, JSON.stringify(counts));
}

/** Taken of shown, as a whole percent; 0 before anything was shown. */
export function takenRate(counts) {
  return counts.shown ? Math.round((counts.taken / counts.shown) * 100) : 0;
}
