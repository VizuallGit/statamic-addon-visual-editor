/**
 * A tool's file that is gone: the page is older than the editor on the server.
 *
 * Each release gives the lazy tools (X-ray, Block tree, Outline …) new file
 * names and removes the old ones. A Control Panel tab opened before a release
 * still asks for the old names, the browser answers with a failed import, and
 * the click on the tool's icon did nothing at all (X-ray in Visual Build on the
 * demo, 8 Nov 2026; Block tree, 6 Nov). Reloading the page is the remedy, so
 * the editor says that, in Statamic's own toast.
 *
 * Only a file that could not be fetched counts — an error thrown while the
 * module runs is a bug, not an update, and is left to the console.
 *
 * May import: lib/i18n.js.
 */
import { t } from './i18n.js';

/**
 * The browsers' words for an import whose file could not be fetched, and
 * Vite's for a chunk whose stylesheet could not be.
 *   Chrome / Edge   Failed to fetch dynamically imported module: …
 *   Firefox         error loading dynamically imported module: …
 *   Safari          Importing a module script failed.
 *   Vite            Unable to preload CSS for …
 */
const MISSING_FILE = /dynamically imported module|Importing a module script failed|Unable to preload CSS/i;

/** One toast for a burst: a click and a warm-up failing in the same moment say it once. */
const QUIET_MS = 3000;

let lastToast = 0;

export function isStaleChunkError(err) {
  return MISSING_FILE.test(String(err?.message ?? err ?? ''));
}

/** Tell the user to reload when `err` is a tool's file gone after a release; true when it was. */
export function reportStaleChunk(win, err, now = Date.now()) {
  if (!isStaleChunkError(err)) {
    return false;
  }

  if (now - lastToast >= QUIET_MS) {
    lastToast = now;
    win?.Statamic?.$toast?.error?.(t(win, 'editor_updated_reload'));
  }

  return true;
}
