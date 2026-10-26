/**
 * The grey-text switch in the HTML pane's label row — one click on, one click
 * off — beside help mode's light bulb, in the same `[data-sve-help-tools]`.
 *
 * Only on a site that has grey text (`dock_ghost`). Never dimmed into looking
 * locked: it can always be clicked. What it switches is ghost-state.js's —
 * this Live Preview only, never the user's default.
 *
 * Appended, not put in place of the bulb: bindHelpToggle fills the host with
 * `replaceChildren`, so this is bound after it. The button wears
 * `data-sve-help-btn` for the row's look (dock/layout.js) and
 * `data-sve-ghost-btn` for its own.
 *
 * May import: dock/ghost-state.js, lib/.
 */
import { t } from '../lib/i18n.js';
import { ghostAllowed, ghostOn, onGhostSwitch, setGhostOn } from './ghost-state.js';

/** A sparkle: suggested by the AI, not by the rules. */
export const GHOST_ICON =
  '<svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 2.5l1.3 3.2 3.2 1.3-3.2 1.3L8 11.5 6.7 8.3 3.5 7l3.2-1.3z"/><path d="M12.5 11v3M11 12.5h3"/></svg>';

/** Puts the switch in `[data-sve-help-tools]`, once per host. */
export function bindGhostToggle(win, dock) {
  const host = dock.querySelector('[data-sve-help-tools]');

  if (!host || !ghostAllowed(win) || host.querySelector('[data-sve-ghost-btn]')) {
    return;
  }

  const btn = win.document.createElement('button');

  btn.type = 'button';
  btn.setAttribute('data-sve-help-btn', '');
  btn.setAttribute('data-sve-ghost-btn', '');
  btn.innerHTML = `<span>${GHOST_ICON}</span>`;
  btn.addEventListener('mousedown', (event) => event.preventDefault());
  host.appendChild(btn);

  const paint = () => {
    const on = ghostOn(win);
    const title = t(win, on ? 'code_dock_ghost_on' : 'code_dock_ghost_off');

    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    btn.title = title;
    btn.setAttribute('aria-label', title);
  };

  btn.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    setGhostOn(win, !ghostOn(win));
  });

  paint();

  // The dock may be rebuilt; a listener for a button no longer in it lets go
  // the first time it hears.
  const stop = onGhostSwitch((changed) => {
    if (!btn.isConnected) {
      stop();

      return;
    }

    if (changed === win) {
      paint();
    }
  });
}
