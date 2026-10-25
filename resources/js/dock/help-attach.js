/**
 * Where help mode meets the HTML pane's editor — and the whole of what the
 * dock pays for it while it is off.
 *
 * Asked once per mounted editor (dock-api.js). The editor side
 * (help-editor.js: listeners, keys, popup, the rows' fetch) is a separate
 * chunk, imported the first time help is on in this Live Preview — from the
 * user's default or from the pane's switch — and never when it is not. Off
 * again, the editor is handed back as it was; a switch off before anything
 * loaded loads nothing.
 *
 * May import: dock/help-state.js, dock/help-editor.js (lazily).
 */
import { helpOn, onHelpSwitch } from './help-state.js';

let loaded = null;
let stop = null;

const load = () => {
  loaded = loaded || import('./help-editor.js');

  return loaded;
};

export function attachHelp(win, view) {
  if (!win || !view) {
    return;
  }

  const sync = (on) => {
    if (on) {
      return load().then((help) => help.enableHelp(win, view));
    }

    return loaded ? loaded.then((help) => help.disableHelp(view)) : Promise.resolve();
  };

  if (helpOn(win)) {
    void sync(true);
  }

  // The editor is mounted again when the dock is rebuilt; the switch then
  // speaks to the new one only.
  stop?.();
  stop = onHelpSwitch((changed, on) => {
    if (changed === win) {
      void sync(on);
    }
  });
}
