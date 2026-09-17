/**
 * Facts about Statamic's Live Preview screen and the entry it shows.
 *
 * Statamic draws the editor (`.live-preview-editor`) and the header
 * (`.live-preview-header`); the addon draws its own cover over the header
 * while pages switch. The readers here know that layout so the panels do not
 * have to.
 *
 * May import: lib/ids.js.
 */
import { LP_COVER_ID } from './ids.js';

/** Statamic's Live Preview header — the real one, not the addon's cover. */
export function lpHeader(doc) {
  return (
    [...doc.querySelectorAll('.live-preview-header')].find((el) => !el.closest(`#${LP_COVER_ID}`)) ??
    null
  );
}

/** The left editor pane. */
export function livePreviewEditorEl(doc) {
  return doc.querySelector('.live-preview-editor');
}

/** The entry id in the CP URL, or null on a page that is not an entry. */
export function currentEntryId(win) {
  const match = win.location.pathname.match(/\/entries\/([^/]+)/);

  return match ? match[1] : null;
}

/** The collection handle in the CP URL, or null. */
export function currentCollection(win) {
  const match = win.location.pathname.match(/\/collections\/([^/]+)\//);

  return match ? match[1] : null;
}
