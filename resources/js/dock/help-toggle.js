/**
 * The help switch in the HTML pane's label row — one click on, one click off.
 *
 * A button like the Data one (`pickerButton`), pressed while help is on. Never
 * dimmed into looking locked: it can always be clicked. What it switches is
 * help-state.js's — this Live Preview only, never the user's default.
 *
 * Its own surface: this module and help-state.js. The editor side (the popup
 * at the caret, the keys) listens to `onHelpSwitch` and loads only once on.
 */
import { t } from '../lib/i18n.js';
import { pickerButton } from './data-vars.js';
import { helpOn, onHelpSwitch, setHelpOn } from './help-state.js';

/** A light bulb: help that suggests, not help that explains. */
export const HELP_ICON =
  '<svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5.6 10.2C4.6 9.4 4 8.3 4 7a4 4 0 1 1 8 0c0 1.3-.6 2.4-1.6 3.2-.4.3-.6.8-.6 1.3V12H6.2v-.5c0-.5-.2-1-.6-1.3z"/><path d="M6.4 14h3.2"/></svg>';

/** Puts the switch in `[data-sve-help-tools]`, once. */
export function bindHelpToggle(win, dock) {
  const host = dock.querySelector('[data-sve-help-tools]');

  if (!host || host._sveBound) {
    return;
  }

  host._sveBound = true;

  const btn = pickerButton(win, host, 'data-sve-help-btn', HELP_ICON, t(win, 'code_dock_help_off'));
  const paint = () => {
    const on = helpOn(win);
    const title = t(win, on ? 'code_dock_help_on' : 'code_dock_help_off');

    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    btn.title = title;
    btn.setAttribute('aria-label', title);
  };

  btn.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    setHelpOn(win, !helpOn(win));
  });

  paint();
  onHelpSwitch((changed) => {
    if (changed === win) {
      paint();
    }
  });
}
