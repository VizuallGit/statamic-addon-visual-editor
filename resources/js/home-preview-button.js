/**
 * Settings toggle: `home_preview_button`
 * A Live Preview button in the Control Panel's top bar, on every page.
 *
 * Opens the site's front page in Live Preview — the overlay the listing label
 * and the front-end edit button use (goToPreview), with a note of where it was
 * opened from so × leads back here. The server says which entry that is
 * (`sveHomePreview`: the entry at `/` on the selected site, as a Live Preview
 * URL), and says nothing when there is none, when it cannot be previewed, when
 * this user may not edit it, or when the toggle is off — then there is no
 * button. Nothing is decided here.
 *
 * The button is a real link, so ⌘-click and the middle button open a tab the
 * ordinary way. It sits in Statamic's global header just before the search,
 * dressed like it (Statamic's own size, radius and colour variables): the
 * header is Statamic's Vue, found by its own marks (named in CONTRACTS,
 * scripts/statamic-update-check.py on the site), and the button is a sibling
 * it never knows about. Not inside an iframe — there this document is the
 * editor in the overlay, or a screen framed in a drawer.
 *
 * While the overlay boots, the loading dots stand in the label's place and the
 * label fades: same grid cell, so the button keeps its width.
 */
import { watchPage } from './cp/page-watch.js';
import { t } from './lib/i18n.js';
import { injectStyle } from './lib/style.js';
import { isEmbeddedInSite } from './lib/live-preview.js';
import { ENTRY_OPEN_ATTR, ENTRY_OPEN_INSIDE_ATTR } from './lib/entry-opening.js';
import { goToPreview } from './open-in-preview.js';

export const HOME_PREVIEW_ATTR = 'data-sve-home-preview';
const STYLE_ID = '__sve-home-preview-style';

/** The global header, and its search (the command palette's dialog trigger). */
export const GLOBAL_HEADER_MARK = '[data-global-header-breadcrumbs]';
export const GLOBAL_HEADER_SEARCH = 'button[aria-haspopup="dialog"]';

const ICON =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
  'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
  '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>';

/** The front page's Live Preview, as the server described it, or null. */
export function homePreview(win) {
  const home = win.Statamic?.$config?.get?.('sveHomePreview');

  return home && typeof home.url === 'string' && home.url ? home : null;
}

function ensureStyles(doc) {
  injectStyle(doc, STYLE_ID, `
@layer sve {
  [${HOME_PREVIEW_ATTR}] {
    display: inline-grid;
    grid-template-areas: "icon label";
    align-items: center;
    column-gap: .4em;
    flex: 0 0 auto;
    height: calc(var(--spacing) * 8);
    padding: 0 .625rem;
    border-radius: var(--radius-xl);
    background-color: color-mix(in oklab, var(--color-black) 40%, transparent);
    box-shadow: 0 0 0 1px color-mix(in oklab, var(--color-white) 10%, transparent);
    font-size: .8125rem;
    font-weight: 500;
    line-height: 1;
    white-space: nowrap;
    color: rgba(255, 255, 255, .85);
    text-decoration: none;
    cursor: pointer;
    transition: color .12s ease, box-shadow .12s ease;
  }
  [${HOME_PREVIEW_ATTR}]:hover,
  [${HOME_PREVIEW_ATTR}]:focus-visible {
    background: linear-gradient(to bottom, color-mix(in oklab, var(--color-primary) 90%, transparent), var(--color-primary));
    box-shadow: 0 0 0 1px color-mix(in oklch, var(--color-primary) 100%, black 20%);
    color: var(--color-white);
    text-decoration: none;
  }
  [${HOME_PREVIEW_ATTR}] svg {
    grid-area: icon;
    width: 1rem;
    height: 1rem;
  }
  [${HOME_PREVIEW_ATTR}] > span:not([${ENTRY_OPEN_ATTR}]) {
    grid-area: label;
    transition: opacity .15s ease;
  }
  [${HOME_PREVIEW_ATTR}] > [${ENTRY_OPEN_ATTR}] {
    grid-area: label;
    justify-self: center;
  }
  [${HOME_PREVIEW_ATTR}]:has(> [${ENTRY_OPEN_ATTR}]) > span:not([${ENTRY_OPEN_ATTR}]) {
    opacity: 0;
  }
}
`);
}

/** The header's item holding Statamic's search; the button stands before it. */
function searchItem(doc) {
  const header = doc.querySelector(GLOBAL_HEADER_MARK)?.closest('header');

  return header?.querySelector(GLOBAL_HEADER_SEARCH)?.closest('header > div > *') ?? null;
}

/** Put the button in the header if the header is there and the button is not. */
export function ensureHomePreviewButton(win, home) {
  const doc = win.document;

  if (doc.querySelector(`[${HOME_PREVIEW_ATTR}]`)) {
    return;
  }

  const search = searchItem(doc);

  if (!search) {
    return;
  }

  ensureStyles(doc);

  const button = doc.createElement('a');

  button.setAttribute(HOME_PREVIEW_ATTR, '');
  button.setAttribute(ENTRY_OPEN_INSIDE_ATTR, '');
  button.setAttribute('href', home.url);
  button.title = home.title ? t(win, 'open_in_live_preview_title', { title: home.title }) : t(win, 'home_preview_button_title');
  button.setAttribute('aria-label', button.title);
  button.innerHTML = `${ICON}<span>${t(win, 'home_preview_button')}</span>`;
  button.addEventListener('click', (event) => {
    // A middle click or ⌘-click asks for a tab, and the link says where.
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }

    event.preventDefault();
    goToPreview(win, home.url, button);
  });

  search.before(button);
}

export function initHomePreviewButton(win = window) {
  const home = homePreview(win);

  if (!home || isEmbeddedInSite(win)) {
    return;
  }

  // The header is Statamic's Vue and may be drawn after boot; it stays across
  // Inertia visits, so after the first draw this finds the button in place.
  watchPage(win, () => ensureHomePreviewButton(win, home));
}
