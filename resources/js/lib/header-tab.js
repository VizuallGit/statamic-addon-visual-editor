/**
 * The toolbar's chosen tab, for panels: which right-hand panel is the open one
 * (outline, performance, list view, ...), and "draw the toolbar again".
 *
 * A panel that opens or closes itself sets the tab and asks the shell to
 * redraw. It imports this file, never the CP shell: the shell owns the
 * toolbar's DOM and answers `header:apply` (cp-shell/header-toolbar.js).
 *
 * May import: cp/bus.js, cp-state.js, chrome-prefs.js.
 */
import { ask } from '../cp/bus.js';
import { sveState } from '../cp-state.js';
import { chromeRemove, chromeSet } from '../chrome-prefs.js';

export function setHeaderTab(win, tab) {
  sveState.headerTab = tab;

  if (tab) {
    chromeSet(win, 'sve-header-tab', tab);
  } else {
    chromeRemove(win, 'sve-header-tab');
  }
}

/** Ask the shell to draw the toolbar and its panels for the tab that is set. */
export function applyHeaderTab(win) {
  return ask('header:apply', { win });
}
