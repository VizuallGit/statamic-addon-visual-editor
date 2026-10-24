/**
 * The loading dots beside an entry's link while the editor overlay boots.
 *
 * Put up by whoever opens the overlay from a Control Panel page — the rows'
 * "Open in Live Preview" label, the top bar's Live Preview button — and taken
 * down by the same hand: `showEntryOpening` listens for the overlay host's
 * `sve-overlay-idle` (dispatched when the overlay is up, or when it gave up)
 * and removes the dots it made. No caller has to remember a cleanup, and no
 * feature's init is relied on for another feature's dots.
 *
 * May import: lib/style.js.
 */
import { injectStyle } from './style.js';

export const ENTRY_OPEN_STYLE_ID = '__sve-entry-open-style';
export const ENTRY_OPEN_ATTR = 'data-sve-entry-loading';

export function ensureEntryOpenStyles(doc) {
  injectStyle(doc, ENTRY_OPEN_STYLE_ID, `
[${ENTRY_OPEN_ATTR}] {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  margin-inline-start: 8px;
  height: 8px;
  pointer-events: none;
  flex: 0 0 auto;
}
[${ENTRY_OPEN_ATTR}] i {
  width: 4px;
  height: 4px;
  border-radius: 999px;
  background: currentColor;
  opacity: .22;
  animation: sve-entry-dots 1s ease-in-out infinite;
}
[${ENTRY_OPEN_ATTR}] i:nth-child(2) { animation-delay: .15s; }
[${ENTRY_OPEN_ATTR}] i:nth-child(3) { animation-delay: .3s; }
[${ENTRY_OPEN_ATTR}] i:nth-child(4) { animation-delay: .45s; }
@keyframes sve-entry-dots {
  0%, 100% { opacity: .22; }
  50% { opacity: .88; }
}
`);
}

export function clearEntryOpening(doc) {
  doc.querySelectorAll(`[${ENTRY_OPEN_ATTR}]`).forEach((el) => el.remove());
}

/**
 * The link the dots stand beside: the element the click came from when it is
 * a link (or holds / stands in a tree branch with one), else the page's link
 * to the entry at `url`.
 */
export function entryTitleAnchor(doc, fromEl, url) {
  if (fromEl?.closest) {
    const branch = fromEl.closest('.page-tree-branch');
    const inBranch = branch?.querySelector('a[href*="/entries/"]');

    if (inBranch) {
      return inBranch;
    }

    if (fromEl.matches?.('a[href]')) {
      return fromEl;
    }

    const nested = fromEl.querySelector?.('a[href*="/entries/"]');

    if (nested) {
      return nested;
    }
  }

  let path = '';

  try {
    path = new URL(url, doc.defaultView.location.origin).pathname;
  } catch {
    return null;
  }

  const links = [...doc.querySelectorAll(`a[href*="/entries/"]`)];

  return links.find((a) => {
    try {
      return new URL(a.href, doc.defaultView.location.origin).pathname === path;
    } catch {
      return false;
    }
  }) || null;
}

/**
 * Dots beside the entry's link until the overlay host says it is idle.
 * Any dots still up from an earlier click go first: one opening at a time.
 */
export function showEntryOpening(doc, fromEl, url) {
  ensureEntryOpenStyles(doc);
  clearEntryOpening(doc);

  const anchor = entryTitleAnchor(doc, fromEl, url);

  if (!anchor) {
    return;
  }

  const dots = doc.createElement('span');

  dots.setAttribute(ENTRY_OPEN_ATTR, '');
  dots.setAttribute('aria-hidden', 'true');
  dots.innerHTML = '<i></i><i></i><i></i><i></i>';
  anchor.after(dots);

  const win = doc.defaultView;
  const done = () => {
    win.removeEventListener('sve-overlay-idle', done);
    dots.remove();
  };

  win.addEventListener('sve-overlay-idle', done);
}
