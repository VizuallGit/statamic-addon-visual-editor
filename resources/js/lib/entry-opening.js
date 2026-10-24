/**
 * The loading dots on the control that opened the editor overlay, while it boots.
 *
 * Put up by whoever opens the overlay from a Control Panel page — the rows'
 * "Open in Live Preview" label, the top bar's Live Preview button — and taken
 * down by the same hand: `showEntryOpening` listens for the overlay host's
 * `sve-overlay-idle` (dispatched when the overlay is up, or when it gave up)
 * and removes the dots it made. No caller has to remember a cleanup, and no
 * feature's init is relied on for another feature's dots.
 *
 * The dots stand right after the clicked link, so nothing before them moves.
 * A control marked ENTRY_OPEN_INSIDE_ATTR takes them inside instead, where its
 * own stylesheet lays them over its label.
 *
 * May import: lib/style.js.
 */
import { injectStyle } from './style.js';

export const ENTRY_OPEN_STYLE_ID = '__sve-entry-open-style';
export const ENTRY_OPEN_ATTR = 'data-sve-entry-loading';
export const ENTRY_OPEN_INSIDE_ATTR = 'data-sve-entry-loading-inside';

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
[${ENTRY_OPEN_INSIDE_ATTR}] > [${ENTRY_OPEN_ATTR}] { margin-inline-start: 0; }
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
 * The link the dots stand by: the element the click came from when it is a
 * link — the row's label, not the title before it, so the label stays put —
 * else the link in its tree branch or inside it, else the page's link to the
 * entry at `url`.
 */
export function entryTitleAnchor(doc, fromEl, url) {
  if (fromEl?.closest) {
    if (fromEl.matches?.('a[href]')) {
      return fromEl;
    }

    const branch = fromEl.closest('.page-tree-branch');
    const inBranch = branch?.querySelector('a[href*="/entries/"]');

    if (inBranch) {
      return inBranch;
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
 * Dots after the entry's link — or inside it, when it is marked for that —
 * until the overlay host says it is idle.
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

  if (anchor.hasAttribute(ENTRY_OPEN_INSIDE_ATTR)) {
    anchor.appendChild(dots);
  } else {
    anchor.after(dots);
  }

  const win = doc.defaultView;
  const done = () => {
    win.removeEventListener('sve-overlay-idle', done);
    dots.remove();
  };

  win.addEventListener('sve-overlay-idle', done);
}
