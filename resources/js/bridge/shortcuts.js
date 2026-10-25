/**
 * Keyboard shortcuts pressed in the preview document.
 *
 * A keypress lands in the window that has focus. After a click on the page the
 * preview has it, and a shortcut pressed there never reaches the Control
 * Panel: the CP's own listener (toolbar-shortcuts.js) does not hear it, and
 * the browser runs its own — ⌘P prints, ⌘D bookmarks. So the preview listens
 * too, with the same reading of a keydown (lib/shortcuts.js), and sends a
 * shortcut up as a message. The CP runs the action, as a keypress there would.
 *
 * The preview must know the shortcuts BEFORE the key is pressed: the browser's
 * own action can only be stopped in the keydown that starts it, and a round
 * trip to the CP is too late. The CP sends the list (`SVE_SHORTCUTS`) when the
 * preview asks at boot, and again whenever it changes; the preview keeps only
 * the combos, and takes exactly those from the browser.
 *
 * Capture on the window, before anything else in this document: site-inert.js
 * stops every keydown at the document in capture so the site never reacts,
 * and a listener below it would never hear one. While an inline edit is open
 * (bridgeState.editing) the keys are the text's — a native contenteditable has
 * no handler that could prevent the default for us, as Bard and CodeMirror do
 * in the CP — so nothing is sent until the edit ends.
 *
 * May import: state.js, lib/shortcuts.js, lib/protocol.js.
 */
import { bridgeState } from './state.js';
import { MSG, SOURCE } from '../lib/protocol.js';
import { comboFromEvent, isMac, normalizeCombo } from '../lib/shortcuts.js';

/** The combos that run something in the CP right now, as the CP last sent them. */
let combos = new Set();

/** `SVE_SHORTCUTS` from the CP: the list, replaced whole. */
export function setShortcuts(data) {
  const list = Array.isArray(data?.combos) ? data.combos : [];

  combos = new Set(list.map(normalizeCombo).filter((combo) => combo && combo !== 'none'));
}

/** The combos the preview takes from the browser now (for tests). */
export function previewShortcuts() {
  return [...combos];
}

/**
 * The keydown listener: a shortcut the CP knows is kept from the browser and
 * sent up; anything else is left alone.
 */
export function createShortcutKeyHandler(win, mac = isMac(win.navigator)) {
  return function onKeydown(event) {
    if (bridgeState.editing) {
      return;
    }

    const combo = comboFromEvent(event, mac);

    if (!combo || !combos.has(combo)) {
      return;
    }

    event.preventDefault();
    win.parent.postMessage({ source: SOURCE, type: MSG.SVE_SHORTCUT, combo }, win.location.origin);
  };
}

/** Listen, and ask the CP for the list — a fresh document knows no shortcuts. */
export function installShortcuts(win) {
  win.addEventListener('keydown', createShortcutKeyHandler(win), true);
  win.parent.postMessage({ source: SOURCE, type: MSG.SVE_SHORTCUTS_REQUEST }, win.location.origin);
}
