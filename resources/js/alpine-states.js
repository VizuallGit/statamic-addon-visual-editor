/**
 * Which Alpine booleans the preview shows set, remembered across sessions.
 *
 * The tree's Alpine icon sets a component's boolean in the preview — a dialog
 * open, a menu out — while what is behind it is built. The state is
 * remembered per section file in this browser (a dialog is about the file,
 * not the page), by which of the file's `x-data` tags and by key, and it has
 * to outlive a redraw, a trip into another section and a reload of the page:
 * a dialog left open before lunch is still open after it. Only what differs
 * from the file is kept; set back to the file's own value, the entry goes.
 * The preview asks for the states when its bridge boots, and gets one
 * message per state of every section on the page whose file has one — not
 * only the file the dock has open, because after a reload nothing is open yet.
 *
 * A copy of the preview — one of the breakpoint overview's frames — knows no
 * states either, and it never asks: the overview asks for it over the bus
 * (`alpine-states:sync`, with the copy's window) once the copy has loaded.
 */
import { on } from './cp/bus.js';
import { previewFrame } from './lib/preview-frame.js';
import { MSG, SOURCE } from './lib/protocol.js';
import { pageSectionRows } from './lib/publish-containers.js';

const ALPINE_STATES_KEY = 'sveAlpineStates';

function readStates(win) {
  try {
    const all = JSON.parse(win.localStorage.getItem(ALPINE_STATES_KEY) || '{}');

    return all && typeof all === 'object' ? all : {};
  } catch {
    return {};
  }
}

/** A stored file entry as `{ [nth]: { [key]: boolean } }` — booleans only, a fresh object. */
function statesOf(file) {
  const out = {};

  if (!file || typeof file !== 'object') {
    return out;
  }

  for (const [nth, keys] of Object.entries(file)) {
    if (!/^\d+$/.test(nth) || !keys || typeof keys !== 'object') {
      continue;
    }

    for (const [key, value] of Object.entries(keys)) {
      if (typeof value === 'boolean') {
        out[nth] = { ...(out[nth] || {}), [key]: value };
      }
    }
  }

  return out;
}

/** The set states of one file, by its `x-data` tags' order in it. */
export function alpineStates(win, type) {
  return statesOf(type ? readStates(win)[type] : null);
}

export function rememberAlpineStates(win, type, states) {
  if (!type) {
    return;
  }

  try {
    const all = readStates(win);

    if (Object.keys(states).length) {
      all[type] = states;
    } else {
      delete all[type];
    }

    win.localStorage.setItem(ALPINE_STATES_KEY, JSON.stringify(all));
  } catch {
    /* no storage: the state lasts the session */
  }
}

/**
 * Every remembered state, told to the preview: one message per state of every
 * section on the page whose file has one. Setting a value a component already
 * has changes nothing, so this is safe to send on every boot and every draw.
 */
export function syncStoredAlpineStates(win, doc = win.document, target = previewFrame(doc)?.contentWindow) {
  const states = readStates(win);

  if (!target) {
    return;
  }

  for (const row of pageSectionRows(win, doc)) {
    for (const [nth, keys] of Object.entries(statesOf(states[row.type]))) {
      for (const [key, value] of Object.entries(keys)) {
        target.postMessage(
          { source: SOURCE, type: MSG.SVE_ALPINE_STATE, uid: row.ids[0], uids: row.ids, nth: Number(nth), key, value, on: true },
          win.location.origin
        );
      }
    }
  }
}

on('alpine-states:sync', ({ win, target } = {}) => {
  if (win && target) {
    syncStoredAlpineStates(win, win.document, target);
  }
});
