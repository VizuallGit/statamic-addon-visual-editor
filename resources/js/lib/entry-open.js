/**
 * Where an entry's Control Panel edit URL opens.
 *
 * Two readers, one rule each, both pure so they can be held in tests without
 * a document:
 *
 *   previewUrlFor      the listing label (open-in-preview.js): the same URL
 *                      with `?live-preview=1`, for an entry of one of the
 *                      collections the settings named — or null.
 *   entryOpenDecision  the Collections drawer in Live Preview
 *                      (lp-collections.js): `preview` when the entry's
 *                      collection can open in Live Preview, `cp` when it
 *                      cannot (the ordinary form, outside Live Preview), null
 *                      when the URL is not an entry's edit screen at all.
 *
 * May import: lib/ids.js.
 */
import { ENTRY_EDIT_PATH } from './ids.js';

/** The collection handle in an entry's edit URL, or null. */
export function entryCollectionOf(href, origin) {
  let url;

  try {
    url = new URL(href, origin);
  } catch {
    return null;
  }

  if (url.origin !== origin) {
    return null;
  }

  const match = url.pathname.match(ENTRY_EDIT_PATH);

  return match ? match[1] : null;
}

/**
 * The Live Preview URL for an entry of one of `collections`, or null when the
 * link is not such an entry — or already asks for Live Preview itself.
 */
export function previewUrlFor(href, origin, collections) {
  const handle = entryCollectionOf(href, origin);

  if (!handle || !collections.includes(handle)) {
    return null;
  }

  const url = new URL(href, origin);

  if (url.searchParams.get('live-preview') === '1') {
    return null;
  }

  url.searchParams.set('live-preview', '1');

  return url.toString();
}

/**
 * What the Collections drawer does with a move to `href`.
 *
 * `previewable` is the server's map (`svePreviewable`): handle → can an entry
 * of it open in Live Preview. A collection the map does not know is not
 * previewable: the server listed every collection this user may edit, so an
 * unknown handle is one that cannot be opened in Live Preview by this user.
 *
 * @returns {'preview'|'cp'|null}
 */
export function entryOpenDecision(href, origin, previewable) {
  const handle = entryCollectionOf(href, origin);

  if (!handle) {
    return null;
  }

  return previewable?.[handle] === true ? 'preview' : 'cp';
}
