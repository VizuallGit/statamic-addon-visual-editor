/**
 * The Control Panel page a refresh lands on while the editor is open, kept out
 * of sight until the editor is back on screen.
 *
 * The overlay host's history entry is the entry's own screen asking for Live
 * Preview (`?live-preview=1`, lib/overlay-history.js), so a refresh — ⌘⇧R, the
 * browser's own button — loads that Control Panel page as a page of its own,
 * and autoOpenLivePreview (cp-shell/add-section.js) opens the editor over it
 * once the Live Preview cluster has landed. Between the two, the plain entry
 * screen is what is on the screen — form, sidebar, whatever Statamic has to
 * say that morning — for as long as the cluster takes to load and the editor's
 * own page takes to answer `lp-ready`. Seconds of a page nobody asked for, and
 * then the editor again.
 *
 * So the host puts a cover up at evaluation, before Statamic has mounted a
 * thing, in the Control Panel's own colour (the editor's chrome shares it), and
 * takes it down the moment the overlay host shows the editor (`html.sve-editing`,
 * overlay-host.js `show()`). A site with the editor switched off never opens
 * it: the cover goes when Statamic boots and says so. A cover that swallows
 * clicks must never depend on a later step to come down, so it also lifts after
 * HOLD_MAX_MS regardless — the overlay host shows the editor or leaves the page
 * by 8 s on its own (its `failTimer`), long before.
 *
 * Only the arrival of a page of its own. The editor's frame (embedded) covers
 * itself in openLivePreviewCovered, and an in-app move puts its cover up before
 * it leaves (coverForNavigation); neither is this.
 *
 * Owner: the CP host's arrival. Loaded with addon.js, before the cluster.
 * May import: lib/ids.js, lib/live-preview.js. Bus messages: none.
 */
import { HOST_COVER_ID } from './lib/ids.js';
import { isEmbeddedInSite } from './lib/live-preview.js';

/** The class the overlay host puts on `<html>` when the editor is shown. */
const EDITING_CLASS = 'sve-editing';

/** Longest the cover stands without the editor showing — after the overlay host's own 8 s. */
export const HOLD_MAX_MS = 15000;

/** The fade the Live Preview cover has, so the two read as one. */
const FADE_MS = 500;

/** Whether this page is a Control Panel page of its own, arriving with the Live Preview ask. */
export function hostArrivesForEditor(win) {
  return !isEmbeddedInSite(win) && new URLSearchParams(win.location.search).get('live-preview') === '1';
}

/**
 * The colour the page paints under everything, as CSS resolves it: the body's
 * background, or the root's when the body has none, or the white canvas when
 * neither says.
 */
export function pageColour(win) {
  const doc = win.document;
  const painted = (el) => {
    const colour = el ? win.getComputedStyle(el).backgroundColor : '';

    return colour && !/rgba\(0,\s*0,\s*0,\s*0\)|transparent/.test(colour) ? colour : null;
  };

  return painted(doc.body) ?? painted(doc.documentElement) ?? '#fff';
}

function buildHostCover(doc, colour) {
  const cover = doc.createElement('div');

  cover.id = HOST_COVER_ID;
  cover.setAttribute('aria-hidden', 'true');
  cover.style.cssText =
    'position:fixed;inset:0;z-index:2147483647;pointer-events:auto;' +
    'display:flex;align-items:center;justify-content:center;' +
    // Mid grey, as the Live Preview cover: the one ink that reads on a light
    // Control Panel and a dark one alike.
    `background:${colour};color:#9ca3af;opacity:1;transition:opacity .45s ease;`;
  cover.innerHTML =
    '<style>@keyframes sve-host-spin{to{transform:rotate(360deg)}}</style>' +
    '<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" ' +
    'stroke-linecap="round" style="font-size:1.5rem;display:block;opacity:.85;animation:sve-host-spin 1s linear infinite;">' +
    '<path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>';

  return cover;
}

/**
 * Covers the page when it is the host arriving for the editor; otherwise does
 * nothing. Returns the cover, or null when none went up.
 */
export function coverHostUntilEditor(win) {
  if (!hostArrivesForEditor(win)) {
    return null;
  }

  const doc = win.document;
  const cover = buildHostCover(doc, pageColour(win));

  (doc.body ?? doc.documentElement).appendChild(cover);

  let lifted = false;
  let observer = null;
  let hold = null;

  const lift = ({ fade }) => {
    if (lifted) {
      return;
    }

    lifted = true;
    observer?.disconnect();
    win.clearTimeout(hold);

    if (!fade) {
      cover.remove();

      return;
    }

    // Clicks reach the editor from the first frame; the colour follows it out.
    cover.style.pointerEvents = 'none';
    cover.style.opacity = '0';
    win.setTimeout(() => cover.remove(), FADE_MS);
  };

  // The editor is on screen the moment the overlay host says so.
  observer = new win.MutationObserver(() => {
    if (doc.documentElement.classList.contains(EDITING_CLASS)) {
      lift({ fade: true });
    }
  });
  observer.observe(doc.documentElement, { attributes: true, attributeFilter: ['class'] });

  // Switched off for this site: nothing is going to open (cp-shell/boot.js
  // initCp returns before autoOpenLivePreview). Known once Statamic boots.
  win.Statamic?.booting?.(() => {
    if (win.Statamic?.$config?.get?.('sveEnabled') === false) {
      lift({ fade: false });
    }
  });

  hold = win.setTimeout(() => lift({ fade: false }), HOLD_MAX_MS);

  return cover;
}
