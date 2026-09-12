/**
 * The pages a link prop can point at, and the menu that offers them.
 *
 * A prop value is a partial parameter, so a link is a URL and nothing more —
 * `{{ partial:components/card href="/om-os" }}`. What this adds is that nobody
 * has to know the URL: pick the page by its name and the URL is what lands in
 * the field.
 *
 * One fetch for the whole session. The list is the same for every component,
 * and a page added while the dock is open is rare enough to be worth a reload.
 */

import { t } from './cp-t.js';
import { openCpOverlay } from './cp/open-overlay.js';
import HtmlTreeMenu from './cp/surfaces/HtmlTreeMenu.vue';

let pending = null;

export function fetchLinkTargets(win) {
  if (!pending) {
    pending = win
      .fetch('/!/sve/link-targets', {
        credentials: 'same-origin',
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
      })
      .then((res) => (res.ok ? res.json() : { pages: [] }))
      .then((data) => (Array.isArray(data.pages) ? data.pages : []))
      .catch(() => []);
  }

  return pending;
}

/** A page was added or renamed; ask again next time. */
export function forgetLinkTargets() {
  pending = null;
}

let menu = null;

export function closePageMenu() {
  menu?.dismiss();
  menu = null;
}

/**
 * The page list, under whichever button was pressed.
 *
 * Where it opens is measured before the fetch: by the time the answer is here
 * the pane may have scrolled, and a menu placed against a rect that has moved
 * lands somewhere nobody pointed at.
 */
export function openPageMenu(win, anchor, onPick) {
  closePageMenu();

  const rect = anchor?.getBoundingClientRect?.();
  const at = {
    x: rect ? rect.left : 0,
    y: rect ? rect.bottom + 4 : 0,
  };

  void fetchLinkTargets(win).then((pages) => {
    const items = pages.length
      ? pages.map((page) => ({
          label: page.title || page.url,
          onPick: () => {
            closePageMenu();
            onPick(page.url);
          },
        }))
      : [{ label: t(win, 'component_props_pages_none'), onPick: null }];

    closePageMenu();

    menu = openCpOverlay(win.document, HtmlTreeMenu, {
      items,
      x: at.x,
      y: at.y,
      onClose: () => {
        menu = null;
      },
    });
  });
}
