/**
 * The three things everyone needs to know about the template dock without
 * opening it: whether the site has it at all, and whether it is switched on.
 *
 * Split out of code-dock.js because that file is the code editor — CodeMirror,
 * its language modes and Emmet, some 900 KB of it. A dozen places ask "is the
 * dock armed?" on every preview render, and asking used to mean loading the
 * whole editor into every Control Panel page whether or not anyone opened it.
 *
 * Nothing here touches the DOM or the dock. It reads a config flag and a
 * preference, and that is the whole point.
 */
import { chromeGet, chromeSet } from './chrome-prefs.js';

export const ARMED_KEY = 'sve-code-dock-armed';

export function templateDockAllowed(win) {
  return win.Statamic?.$config?.get?.('sveFeatures')?.template_dock === true;
}

export function isCodeDockArmed(win) {
  if (!win) {
    return false;
  }

  return chromeGet(win, ARMED_KEY) === '1';
}

export function setCodeDockArmed(win, on) {
  chromeSet(win, ARMED_KEY, on ? '1' : '0');
}
