/**
 * The page last open in Live Preview, so the top bar's Live Preview button
 * (home-preview-button.js) goes back there instead of to the front page.
 *
 * The editor writes the note in its overlay frame each time a page's preview
 * is ready; the button reads it on the Control Panel page underneath. One
 * note per browser, in localStorage: it has to outlive the overlay, a reload
 * and a trip through the rest of the admin.
 *
 * A note counts only for the user and the site it was written on, and only
 * while its collection can still open in Live Preview for this user (the
 * server's `svePreviewable` map). Without one the button opens the front page.
 *
 * Pure — storage and the Control Panel's facts are handed in — so the rules
 * can be held in tests without a document.
 *
 * May import: lib/entry-open.js, lib/caught.js.
 */
import { entryCollectionOf } from './entry-open.js';
import { logCaught } from './caught.js';

export const LAST_PAGE_KEY = 'sve-lp-last-page';

/** Write down the entry whose edit screen is `href`. A screen that is not an entry's writes nothing. */
export function rememberLastPage(storage, href, origin, { site, user, title }) {
  if (!storage || !entryCollectionOf(href, origin)) {
    return;
  }

  const note = {
    path: new URL(href, origin).pathname,
    site: String(site ?? ''),
    user: String(user ?? ''),
    title: typeof title === 'string' ? title : '',
  };

  try {
    storage.setItem(LAST_PAGE_KEY, JSON.stringify(note));
  } catch (error) {
    logCaught('last-page: remember the page', error);
  }
}

/**
 * The page to go back to, as `{ url, title }` with its Live Preview URL, or
 * null when there is none for this user on this site.
 */
export function lastPage(storage, origin, { site, user, previewable }) {
  let note = null;

  try {
    note = JSON.parse(storage?.getItem(LAST_PAGE_KEY) ?? 'null');
  } catch {
    return null;
  }

  if (!note || typeof note.path !== 'string') {
    return null;
  }

  if (note.site !== String(site ?? '') || note.user !== String(user ?? '')) {
    return null;
  }

  const handle = entryCollectionOf(note.path, origin);

  if (!handle || previewable?.[handle] !== true) {
    return null;
  }

  const url = new URL(note.path, origin);

  url.searchParams.set('live-preview', '1');

  return { url: url.toString(), title: typeof note.title === 'string' ? note.title : '' };
}
