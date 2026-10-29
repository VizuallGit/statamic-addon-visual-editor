/**
 * Into the header or the footer from the Control Panel, asked the way the
 * bridge asks in the preview (bridge/header-footer.js `confirmEnterChrome`):
 * "Global header — changes apply on every page. Do you want to edit it?",
 * then the same OPEN_CHROME the bridge sends.
 *
 * For where the preview is not the page on screen — Build's canvas stands over
 * it (lib/build-canvas.js), so the bridge's question would be asked where no
 * one sees it. The canvas's click on the header and the HTML tree's Layout
 * rows come here then.
 *
 * May import: lib/*, cp/bus.js, cp/open-overlay.js, cp/surfaces/ChoiceDialog.vue.
 * Bus: asks `dock:chrome-kind`.
 */
import { ask } from './cp/bus.js';
import { t } from './lib/i18n.js';
import { MSG, SOURCE } from './lib/protocol.js';
import { openCpOverlay } from './cp/open-overlay.js';
import ChoiceDialog from './cp/surfaces/ChoiceDialog.vue';

/** Ask, then open `kind` ('header' | 'footer'). Open already, it is not asked again. */
export function enterChromeAsked(win, kind) {
  const half = kind === 'footer' ? 'footer' : 'header';

  // Already in it: nothing to ask.
  if (String(ask('dock:chrome-kind') || '') === half) {
    return;
  }

  const chrome = t(win, `chrome_${half}`);
  let done = false;

  const overlay = openCpOverlay(win.document, ChoiceDialog, {
    title: t(win, 'chrome_enter_title', { chrome }),
    body: t(win, 'chrome_enter_body', { chrome }),
    buttons: [
      { value: 'cancel', label: t(win, 'cancel'), variant: 'ghost' },
      { value: 'edit', label: t(win, 'chrome_enter_confirm'), variant: 'primary' },
    ],
    onPick: (value) => {
      if (done) {
        return;
      }

      done = true;
      overlay.dismiss();

      if (value === 'edit') {
        win.postMessage({ source: SOURCE, type: MSG.OPEN_CHROME, kind: half }, win.location.origin);
      }
    },
    onClose: () => {
      if (!done) {
        done = true;
        overlay.dismiss();
      }
    },
  });
}
