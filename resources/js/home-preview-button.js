/**
 * Settings toggle: `home_preview_button`
 * A Live Preview button in the Control Panel's top bar, on every page.
 *
 * Opens the page last open in Live Preview — the first time, the site's front
 * page — in the overlay the listing label and the front-end edit button use
 * (goToPreview), with a note of where it was opened from so × leads back here.
 * The server says whether there is a button and where the front page is
 * (`sveHomePreview`: the entry at `/` on the selected site, as a Live Preview
 * URL), and says nothing when there is none, when it cannot be previewed, when
 * this user may not edit it, or when the toggle is off — then there is no
 * button.
 *
 * The last page is a note in the browser (lib/last-page.js). The editor writes
 * it in the overlay's frame once a page's preview is ready, so switching pages
 * in the picker moves it along; the button reads it here and follows it while
 * it stands in the header.
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
import { LAST_PAGE_KEY, lastPage, rememberLastPage } from './lib/last-page.js';
import { publishContainers } from './lib/publish-containers.js';
import { unwrapRef } from './lib/values.js';
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

function storageOf(win) {
  try {
    return win.localStorage;
  } catch {
    return null;
  }
}

/** Who and where a last-page note is for: the Control Panel's user and selected site. */
function noteScope(win) {
  const config = win.Statamic?.$config;

  return { site: config?.get?.('selectedSite'), user: config?.get?.('user')?.id };
}

/**
 * In the editor: write down the page whose preview is ready. Its title comes
 * from the page's own publish form — Statamic's container, not a field of ours.
 */
function rememberShownPage(win) {
  const page = publishContainers.find((container) => container.name === 'base');

  rememberLastPage(storageOf(win), win.location.href, win.location.origin, {
    ...noteScope(win),
    title: unwrapRef(page?.values)?.title,
  });
}

/** Where the button goes, and what it says on hover: the last page, else the front page. */
export function buttonTarget(win, home) {
  const last = lastPage(storageOf(win), win.location.origin, {
    ...noteScope(win),
    previewable: win.Statamic?.$config?.get?.('svePreviewable'),
  });

  if (last) {
    return {
      url: last.url,
      title: last.title ? t(win, 'open_in_live_preview_title', { title: last.title }) : t(win, 'open_in_live_preview'),
    };
  }

  return {
    url: home.url,
    title: home.title ? t(win, 'open_in_live_preview_title', { title: home.title }) : t(win, 'home_preview_button_title'),
  };
}

function paintTarget(win, button, home) {
  const target = buttonTarget(win, home);

  button.setAttribute('href', target.url);
  button.title = target.title;
  button.setAttribute('aria-label', target.title);
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
  paintTarget(win, button, home);
  button.innerHTML = `${ICON}<span>${t(win, 'home_preview_button')}</span>`;
  button.addEventListener('click', (event) => {
    // A middle click or ⌘-click asks for a tab, and the link says where.
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }

    event.preventDefault();
    goToPreview(win, button.getAttribute('href'), button);
  });

  search.before(button);
}

export function initHomePreviewButton(win = window) {
  const home = homePreview(win);

  if (!home) {
    return;
  }

  // In an iframe this document is the editor in the overlay (or a screen in a
  // drawer, which never gets ready): it writes down the page it shows.
  if (isEmbeddedInSite(win)) {
    win.addEventListener('sve-lp-ready', () => rememberShownPage(win), { once: true });

    return;
  }

  // The header is Statamic's Vue and may be drawn after boot; it stays across
  // Inertia visits, so after the first draw this finds the button in place.
  watchPage(win, () => ensureHomePreviewButton(win, home));

  // The note is written in the overlay's frame, so this document hears of it
  // as a storage event — the button standing in the header follows it.
  win.addEventListener('storage', (event) => {
    if (event.key !== LAST_PAGE_KEY && event.key !== null) {
      return;
    }

    const button = win.document.querySelector(`[${HOME_PREVIEW_ATTR}]`);

    if (button) {
      paintTarget(win, button, home);
    }
  });
}
