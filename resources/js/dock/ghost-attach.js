/**
 * Where grey text meets the HTML pane's editor — and the whole of what the
 * dock pays for it while it is off.
 *
 * Asked once per mounted editor (dock-api.js, beside attachHelp). The editor
 * side (ghost-editor.js: the listener, the keys, the requests) is a separate
 * chunk, imported the first time grey text is on in this Live Preview — from
 * the user's default or from the pane's sparkle — and never when it is not.
 * Off again, the editor is handed back as it was; a switch off before
 * anything loaded loads nothing.
 *
 * May import: dock/ghost-state.js, dock/ghost-editor.js (lazily).
 */
import { ghostOn, onGhostSwitch } from './ghost-state.js';

let loaded = null;
let stop = null;

const load = () => {
  loaded = loaded || import('./ghost-editor.js');

  return loaded;
};

export function attachGhost(win, view) {
  if (!win || !view) {
    return;
  }

  const sync = (on) => {
    if (on) {
      return load().then((ghost) => ghost.enableGhost(win, view));
    }

    return loaded ? loaded.then((ghost) => ghost.disableGhost(view)) : Promise.resolve();
  };

  if (ghostOn(win)) {
    void sync(true);
  }

  // The editor is mounted again when the dock is rebuilt; the switch then
  // speaks to the new one only.
  stop?.();
  stop = onGhostSwitch((changed, on) => {
    if (changed === win) {
      void sync(on);
    }
  });
}
