/**
 * Build mode's API for code that runs before the chunk has loaded.
 *
 * build-mode/boot.js is a lazy chunk: lazy-panels.js loads it (key
 * `build_mode`) the first time Build is switched on. The top bar's switch
 * and the left column call these instead of the module, so a Live Preview
 * that stays in Content carries none of it — only these few lines.
 *
 * The switch may be clicked back to Content before the chunk has arrived.
 * Every enter takes a ticket and a leave voids it, so a panel that loads
 * after its Build was already left is never mounted (the gap after an await
 * that let a lazy panel draw into a column it no longer owned).
 *
 * May import: lazy-panels.js.
 */
import { ensurePanel, loadedPanel } from '../lazy-panels.js';

const KEY = 'build_mode';

let unmount = null;
let ticket = 0;

export function isBuildLoaded() {
  return !!loadedPanel(KEY);
}

/**
 * Draw the Build panel into `host`. Resolves true once it is drawn, false
 * when Build was left (or the host went away) before the chunk arrived.
 *
 * @param {Window} win
 * @param {HTMLElement} host  the left column's Build host
 * @param {object} hooks      see build-mode/boot.js
 */
export function enterBuild(win, host, hooks = {}) {
  const mine = ++ticket;

  return ensurePanel(KEY).then((mod) => {
    if (mine !== ticket || !host?.isConnected || !mod?.mountBuildPanel) {
      return false;
    }

    unmount?.();
    unmount = mod.mountBuildPanel(win, host, hooks);

    return true;
  });
}

/** Take the panel down. Safe to call when it never mounted. */
export function leaveBuild() {
  ticket += 1;
  unmount?.();
  unmount = null;
}
