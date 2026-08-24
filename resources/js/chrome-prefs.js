/**
 * Per-user editor chrome: widths, pins, docks, toggles.
 *
 * Live writes go to namespaced localStorage so the layout follows immediately.
 * A debounced POST stores the same blob on the Statamic user (`sve_chrome`),
 * so another browser comes back as that user left it. A different user on this
 * machine sees their own blob, or the defaults.
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

const MIGRATED_KEY = 'sve-chrome-legacy-migrated';
const SAVE_MS = 400;

let saveTimer = null;
let hydrated = false;

function userId(win) {
  const id = win.Statamic?.$config?.get?.('sveUserId');

  return id == null || id === '' ? '' : String(id);
}

function csrfToken(win) {
  return (
    win.document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ||
    win.Statamic?.$config?.get?.('csrfToken') ||
    win.Statamic?.$config?.get?.('csrf_token') ||
    ''
  );
}

function ns(win, key) {
  const id = userId(win);

  return id ? `sve-u:${id}:${key}` : key;
}

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
  const namespaced = readRaw(win, ns(win, key));

  if (namespaced != null) {
    return namespaced;
  }

  return userId(win) ? null : readRaw(win, key);
}

export function chromeSet(win, key, value) {
  writeRaw(win, ns(win, key), value);
  scheduleChromeSave(win);
}

export function chromeRemove(win, key) {
  writeRaw(win, ns(win, key), null);
  scheduleChromeSave(win);
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

function applyBlob(win, blob) {
  if (!blob || typeof blob !== 'object') {
    return;
  }

  CHROME_KEYS.forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(blob, key) && blob[key] != null) {
      writeRaw(win, ns(win, key), String(blob[key]));
    }
  });
}

function migrateLegacy(win) {
  if (readRaw(win, MIGRATED_KEY) === '1') {
    return;
  }

  const blob = {};

  CHROME_KEYS.forEach((key) => {
    const value = readRaw(win, key);

    if (value != null) {
      blob[key] = value;
    }
  });

  writeRaw(win, MIGRATED_KEY, '1');

  if (Object.keys(blob).length) {
    applyBlob(win, blob);
    scheduleChromeSave(win);
  }
}

/**
 * Server prefs win (this user). Empty server + first visit on this browser
 * copies the old un-namespaced keys once, then other users get defaults.
 */
export function hydrateChromePrefs(win) {
  if (hydrated) {
    return;
  }

  hydrated = true;

  const server = win.Statamic?.$config?.get?.('sveChromePrefs');
  const hasServer = server && typeof server === 'object' && Object.keys(server).length;

  if (hasServer) {
    applyBlob(win, server);

    return;
  }

  if (userId(win) && Object.keys(readChromeBlob(win)).length === 0) {
    migrateLegacy(win);
  }
}

export function scheduleChromeSave(win) {
  if (saveTimer) {
    win.clearTimeout(saveTimer);
  }

  saveTimer = win.setTimeout(() => {
    saveTimer = null;
    flushChromeSave(win);
  }, SAVE_MS);
}

export function flushChromeSave(win) {
  if (saveTimer) {
    win.clearTimeout(saveTimer);
    saveTimer = null;
  }

  let prefs;

  try {
    prefs = readChromeBlob(win);
  } catch {
    return;
  }

  if (!win.fetch) {
    return;
  }

  win
    .fetch('/!/sve/chrome-prefs', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': csrfToken(win),
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: JSON.stringify({ prefs }),
    })
    .catch(() => {});
}

export function clearChromePrefs(win) {
  if (saveTimer) {
    win.clearTimeout(saveTimer);
    saveTimer = null;
  }

  CHROME_KEYS.forEach((key) => {
    writeRaw(win, ns(win, key), null);
    writeRaw(win, key, null);
  });

  scheduleChromeSave(win);
}

export function bindChromePrefsFlush(win) {
  if (win.__sveChromeFlushBound) {
    return;
  }

  win.__sveChromeFlushBound = true;
  win.addEventListener('pagehide', () => flushChromeSave(win));
  win.document.addEventListener('visibilitychange', () => {
    if (win.document.visibilityState === 'hidden') {
      flushChromeSave(win);
    }
  });
}
