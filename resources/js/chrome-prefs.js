/**
 * Editor chrome: widths, pins, docks, toggles.
 *
 * Shared localStorage on this browser — not stored on the Statamic user.
 */

export const CHROME_KEYS = [
  'sve-right-dock-open',
  'sve-right-dock-width',
  'sve-right-dock-pinned',
  'sve-right-dock-stack-heights',
  'sve-right-dock-stack-order',
  'sve-right-dock-open-panes',
  'sve-right-dock-folded',
  'sve-globals-panel-width',
  'sve-listview-panel-width',
  'sve-ai-panel-width',
  'sve-lp-docked',
  'sve-lp-panel-mode',
  'sve-lp-collapsed',
  'sve-header-tab',
  'sve-lp-device',
  'sve-lp-zoom',
  'statamic.live-preview.editor-width',
  'sve-code-dock-height',
  'sve-code-dock-panes',
  'sve-code-dock-widths',
  'sve-code-dock-armed',
  'sve-ai-panel-mode',
  'sve-listview-tab',
];

function readRaw(win, key) {
  try {
    return win.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeRaw(win, key, value) {
  try {
    if (value == null) {
      win.localStorage.removeItem(key);
    } else {
      win.localStorage.setItem(key, value);
    }
  } catch {
    /* private mode */
  }
}

export function chromeGet(win, key) {
  return readRaw(win, key);
}

export function chromeSet(win, key, value) {
  writeRaw(win, key, value);
}

export function chromeRemove(win, key) {
  writeRaw(win, key, null);
}

export function readChromeBlob(win) {
  const out = {};

  CHROME_KEYS.forEach((key) => {
    const value = chromeGet(win, key);

    if (value != null) {
      out[key] = value;
    }
  });

  return out;
}

export function hydrateChromePrefs() {
  /* localStorage only — nothing to hydrate from the user. */
}

export function scheduleChromeSave() {
  /* no server write */
}

export function flushChromeSave() {
  /* no server write */
}

export function clearChromePrefs(win) {
  CHROME_KEYS.forEach((key) => {
    writeRaw(win, key, null);
  });
}

export function bindChromePrefsFlush() {
  /* no server write */
}
