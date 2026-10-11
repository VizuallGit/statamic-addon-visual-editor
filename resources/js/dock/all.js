import { t } from '../lib/i18n.js';
import { dockState } from '../dock/state.js';
import { DOCK_ID } from '../code-dock.js';

/** All's icon: show the whole file, not the picked element. */
const ALL_ICON = '<svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="M2.5 3.5h11M2.5 8h11M2.5 12.5h7"/></svg>';

/**
 * What All has to widen. Only the tree narrows the panes to one element, so
 * with it off both already show the whole file. Tailwind has no style block to
 * show, and a locked file keeps its CSS pane as it is.
 */
export function allParts() {
  const html = !!dockState.htmlScopePref;

  return {
    html,
    css: html && dockState.styleMode !== 'tw' && !dockState.lastLocked,
  };
}

export function allOn() {
  return dockState.htmlAll || (allParts().css && dockState.cssAll);
}

/**
 * The bar's All button — one for both panes: the HTML pane's whole file
 * (`htmlAll`, dock/scope.js) and the CSS pane's whole style block (`cssAll`,
 * dock/style-modes.js). Always in the bar; the title says what a press shows.
 */
export function paintAll(win) {
  const btn = win?.document.getElementById(DOCK_ID)?.querySelector('[data-sve-all]');

  if (!btn) {
    return;
  }

  const parts = allParts();
  const on = allOn();
  const text = win.document.createElement('span');

  text.textContent = t(win, 'code_dock_all');
  btn.innerHTML = ALL_ICON;
  btn.appendChild(text);
  btn.title = t(win, on ? 'code_dock_all_off' : parts.css ? 'code_dock_all_on' : parts.html ? 'code_dock_all_on_html' : 'code_dock_all_none');
  btn.setAttribute('aria-label', btn.title);
  btn.setAttribute('aria-pressed', on ? 'true' : 'false');
}
