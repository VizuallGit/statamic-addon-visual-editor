/**
 * Grey text in the HTML pane: on or off — now, and from the start.
 *
 * The same two answers as help mode (help-state.js), kept apart the same way.
 * The default is the user's: a tick in Live Preview settings (⋮ → HTML tree),
 * stored with their other editor preferences, off until they tick it. The
 * sparkle in the pane belongs to the open Live Preview alone: it starts from
 * the default, and clicking it never writes the default back. Live Preview
 * closing forgets it.
 *
 * Off whatever the user says while the site has not switched the feature on
 * (`dock_ghost`): each suggestion is a paid request on the site's own key.
 *
 * Nothing here touches the DOM or the dock, so asking costs nothing — the
 * editor side is loaded only once this says on.
 */
import { chromeGet, chromeSet } from '../chrome-prefs.js';
import { featureSaidOn } from '../lib/config.js';

/** In CHROME_KEYS and ChromePrefsController::KEYS. */
export const GHOST_DEFAULT_KEY = 'sve-code-dock-ghost';

const session = new WeakMap();
const listeners = new Set();

/**
 * Whether the AI behind the grey text answers in time to be grey text: Claude
 * does (a second or two); Cursor takes many seconds, so there only what the
 * author asks for — a comment, ⌘K — goes to it.
 */
export function ghostFastAi(win) {
  return win?.Statamic?.$config?.get?.('sveGhostProvider') !== 'cursor';
}

/** Whether this site has grey text at all. */
export function ghostAllowed(win) {
  return !!win && featureSaidOn(win, 'dock_ghost');
}

/** The user's default: on from the start, or not. */
export function ghostDefaultOn(win) {
  return !!win && chromeGet(win, GHOST_DEFAULT_KEY) === '1';
}

/**
 * The user's default, from the settings tick. While this Live Preview still
 * follows the default (its switch not clicked), the listeners hear it the way
 * they hear the switch.
 */
export function setGhostDefault(win, on) {
  const before = ghostOn(win);

  chromeSet(win, GHOST_DEFAULT_KEY, on ? '1' : '0');

  if (!session.has(win) && ghostOn(win) !== before) {
    tell(win, ghostOn(win));
  }
}

/** Whether grey text is on in this Live Preview: the switch once clicked, the default until then. */
export function ghostOn(win) {
  if (!ghostAllowed(win)) {
    return false;
  }

  return session.has(win) ? session.get(win) : ghostDefaultOn(win);
}

/** The pane's switch. This Live Preview only — the default stays as the user set it. */
export function setGhostOn(win, on) {
  session.set(win, !!on);
  tell(win, ghostOn(win));
}

function tell(win, on) {
  for (const listener of [...listeners]) {
    listener(win, on);
  }
}

/** Live Preview closed: the next one starts from the default again. */
export function forgetGhostSwitch(win) {
  if (!session.has(win)) {
    return;
  }

  const before = ghostOn(win);

  session.delete(win);

  if (ghostOn(win) !== before) {
    tell(win, ghostOn(win));
  }
}

/**
 * Told `(win, on)` when what `ghostOn(win)` answers changes. Returns the way
 * to stop listening.
 */
export function onGhostSwitch(listener) {
  listeners.add(listener);

  return () => listeners.delete(listener);
}
