/**
 * Whether the Content | Vizuall Build | HTML Build switch stands on a tab of
 * the top bar that hangs into the preview (cp-shell/build-switch.js draws both looks).
 * On unless this user turned it off in Live Preview settings → Top bar; off,
 * the switch is a group like the bar's others, as it was before the tab.
 *
 * Its own file so the settings menu reads and writes it without importing the
 * switch. Stored per user (chrome-prefs syncs the key); only "off" is written.
 */
import { chromeGet, chromeRemove, chromeSet } from './chrome-prefs.js';

const KEY = 'sve-build-switch-tab';

/** The attribute on the switch that turns the tab on (build-switch.js styles it). */
export const SWITCH_TAB_ATTR = 'data-sve-switch-tab';

export function buildSwitchTabOn(win) {
  return chromeGet(win, KEY) !== 'off';
}

export function setBuildSwitchTab(win, on) {
  if (on) {
    chromeRemove(win, KEY);
  } else {
    chromeSet(win, KEY, 'off');
  }

  win.document.querySelector('[data-sve-build-switch]')?.toggleAttribute(SWITCH_TAB_ATTR, on);
}
