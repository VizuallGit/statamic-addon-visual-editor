/**
 * Fetch a tool's code while the pointer is on its way to the click.
 *
 * Splitting the editor into chunks moved the cost off the pages that never use
 * a tool — and put a small wait in front of the ones that do. A pointer resting
 * on an icon is as clear a statement of intent as a click, and the few hundred
 * milliseconds between the two are enough to have the module in hand by the
 * time the button is pressed.
 *
 * Delegated from the toolbar rather than bound per button: the top bar is
 * rebuilt on every preview render, and a listener per icon would be rebound
 * every time. `pointerenter` does not bubble, so this listens for `pointerover`
 * and works out which button it came from.
 *
 * Nothing here opens anything. It only warms what a click would need, so being
 * wrong costs one unused fetch and never a surprise on screen.
 */
import { ensurePanel } from './lazy-panels.js';
import { prefetchCodeDock } from './code-dock-lazy.js';

/** Toolbar tab name → the panel chunk behind it. */
const PANEL_FOR_TAB = {
  outline: 'outline',
  listview: 'listview',
  comments: 'comments',
  sections: 'sections',
  html_tree: 'html_tree',
  edits: 'edits',
  performance: 'performance',
};

const warmed = new Set();

function warm(win, tab) {
  if (!tab || warmed.has(tab)) {
    return;
  }

  warmed.add(tab);

  if (tab === 'code') {
    prefetchCodeDock(win);

    return;
  }

  const key = PANEL_FOR_TAB[tab];

  if (key) {
    void ensurePanel(key).catch(() => {});
  }
}

/**
 * Bound once per document. The toolbar and the dock's own pane buttons come and
 * go; the listener sits above both and asks what was hovered.
 */
export function bindToolbarPrefetch(win) {
  const doc = win.document;

  if (doc.__svePrefetchBound) {
    return;
  }

  doc.__svePrefetchBound = true;

  doc.addEventListener(
    'pointerover',
    (event) => {
      const btn = event.target?.closest?.('button[data-tab], [data-sve-right-pane-btn]');

      if (!btn) {
        return;
      }

      warm(win, btn.dataset.tab || btn.getAttribute('data-sve-right-pane-btn'));
    },
    { passive: true, capture: true }
  );
}
