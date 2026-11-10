/**
 * Whether page transitions play in Live Preview.
 *
 * Live Preview settings → General, «Page transitions». Off unless this user
 * turned it on: the preview never fades or slides when it loads a page. The
 * public site is untouched and keeps every page transition it has. Stored per
 * user (chrome-prefs syncs the key to the Statamic user); only "on" is written.
 *
 * The server reads the same key when it renders the preview
 * (InjectBridgeScript::pageTransitionGuard). A cross-document view transition
 * plays only when the page that loads asks for one too, so the next page the
 * preview loads follows the setting; nothing is sent to the preview. The
 * change is saved at once, not after chrome-prefs' short wait, so that next
 * page already has it.
 *
 * Owner: Live Preview settings (lp-more-menu.js).
 * May import: chrome-prefs.js.
 */
import { chromeGet, chromeRemove, chromeSet, flushChromeSave } from './chrome-prefs.js';

export const PAGE_TRANSITIONS_KEY = 'sve-page-transitions';

export function pageTransitionsOn(win = window) {
  return chromeGet(win, PAGE_TRANSITIONS_KEY) === 'on';
}

export function setPageTransitionsOn(win, on) {
  if (on) {
    chromeSet(win, PAGE_TRANSITIONS_KEY, 'on');
  } else {
    chromeRemove(win, PAGE_TRANSITIONS_KEY);
  }

  flushChromeSave(win);
}
