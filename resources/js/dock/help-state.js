/**
 * Help mode in the HTML pane: on or off — now, and from the start.
 *
 * Two answers, kept apart on purpose. The default is the user's: a tick in
 * Live Preview settings (⋮ → HTML tree), stored with their other editor
 * preferences, so it follows them to another browser and to the server. Off
 * for everyone until they tick it. The switch in the pane belongs to the open
 * Live Preview alone: it starts from the default, and clicking it never writes
 * the default back. Live Preview closing forgets it.
 *
 * Nothing here touches the DOM or the dock, so asking costs nothing — the help
 * itself (suggestions, popup) is loaded only once this says on.
 */
import { chromeGet, chromeSet } from '../chrome-prefs.js';

/** In CHROME_KEYS and ChromePrefsController::KEYS. */
export const HELP_DEFAULT_KEY = 'sve-code-dock-help';

const session = new WeakMap();
const listeners = new Set();

/** The user's default: on from the start, or not. */
export function helpDefaultOn(win) {
  return !!win && chromeGet(win, HELP_DEFAULT_KEY) === '1';
}

/**
 * The user's default, from the settings tick. While this Live Preview still
 * follows the default (its switch not clicked), what `helpOn` answers changes
 * with it, so the listeners hear it the same way they hear the switch.
 */
export function setHelpDefault(win, on) {
  const before = helpOn(win);

  chromeSet(win, HELP_DEFAULT_KEY, on ? '1' : '0');

  if (!session.has(win) && helpOn(win) !== before) {
    tell(win, !!on);
  }
}

/** Whether help is on in this Live Preview: the switch once clicked, the default until then. */
export function helpOn(win) {
  return session.has(win) ? session.get(win) : helpDefaultOn(win);
}

/** The pane's switch. This Live Preview only — the default stays as the user set it. */
export function setHelpOn(win, on) {
  session.set(win, !!on);
  tell(win, !!on);
}

function tell(win, on) {
  for (const listener of [...listeners]) {
    listener(win, on);
  }
}

/**
 * Live Preview closed: the next one starts from the default again. The
 * listeners hear it when that changes the answer, so an editor still mounted
 * from this session (the dock is not rebuilt between two) lets help go.
 */
export function forgetHelpSwitch(win) {
  if (!session.has(win)) {
    return;
  }

  const before = session.get(win);

  session.delete(win);

  if (helpOn(win) !== before) {
    tell(win, helpOn(win));
  }
}

/**
 * Told `(win, on)` when what `helpOn(win)` answers changes: the switch
 * clicked, or the default ticked while the switch is untouched. Returns the
 * way to stop listening.
 */
export function onHelpSwitch(listener) {
  listeners.add(listener);

  return () => listeners.delete(listener);
}
