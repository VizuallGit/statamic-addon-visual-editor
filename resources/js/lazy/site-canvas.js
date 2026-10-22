/**
 * The site canvas's API for code that runs before the tool has loaded.
 *
 * site-canvas.js is a lazy chunk: lazy-panels.js loads it the first time its
 * top-bar icon is clicked. Until then Live Preview carries only this file. The
 * canvas is never left open — closed is its state until a click — so "is it
 * open" needs no stored preference: the module answers once it is here, and
 * before that the answer is no.
 *
 * May import: lazy-panels.js, lib/config.js.
 */
import { ensurePanel, loadedPanel } from '../lazy-panels.js';
import { featureSaidOn } from '../lib/config.js';

const KEY = 'site_canvas';

/**
 * On only when the settings say so: off by default while it is a demo, and
 * the endpoint is the server's, so a key the server does not know is off.
 */
export function siteCanvasAllowed(win) {
  return featureSaidOn(win, KEY);
}

export function isSiteCanvasOpen(win) {
  const mod = loadedPanel(KEY);

  return mod ? mod.isSiteCanvasOpen(win) : false;
}

/** A click while the chunk is still on its way: the same promise, not a second toggle. */
let pendingToggle = null;

/** loads */
export function toggleSiteCanvas(win) {
  const mod = loadedPanel(KEY);

  if (mod) {
    return mod.toggleSiteCanvas(win);
  }

  pendingToggle ??= ensurePanel(KEY)
    .then((loaded) => loaded.toggleSiteCanvas(win))
    .finally(() => {
      pendingToggle = null;
    });

  return pendingToggle;
}
