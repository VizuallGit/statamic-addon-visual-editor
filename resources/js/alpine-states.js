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
 * message per state of every section on the page whose file has one, and of
 * the header's, the footer's and the layout's files — not only the file the
 * dock has open, because after a reload nothing is open yet. The mobile menu
 * in the header (`x-data="{ menuOpen: false }"`) is the commonest of them.
 *
 * A copy of the preview — one of the breakpoint overview's frames — knows no
 * states either, and it never asks: the overview asks for it over the bus
 * (`alpine-states:sync`, with the copy's window) once the copy has loaded.
 */
import { ask, on } from './cp/bus.js';
import { LAYOUT_TEMPLATE_TYPE } from './lib/ids.js';
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

/**
 * The part of the page's frame a dock file draws — what the preview counts
 * its components in — from the dock's own word for it (`dock:chrome-kind`):
 * 'header', 'footer', or 'layout' for its 'main'. '' for a section, a
 * template or a component, which the preview finds by the section's uid.
 */
export function frameScope(kind) {
  return kind === 'header' || kind === 'footer' ? kind : kind === 'main' ? 'layout' : '';
}

/**
 * The file each part of the frame is drawn from, by the name the dock gives
 * it — the name its states are remembered under. The layout is one file. A
 * half is the partial the server found `data-sve-chrome` on
 * (`sveChromeTemplates`) or, while the dock holds that half, the dock's file:
 * the half's form may have picked another layout than the saved one, and the
 * preview draws the form.
 */
function frameFiles(win) {
  const templates = win.Statamic?.$config?.get?.('sveChromeTemplates') || {};
  const files = { header: templates.header?.type || '', footer: templates.footer?.type || '', layout: LAYOUT_TEMPLATE_TYPE };
  const open = frameScope(String(ask('dock:chrome-kind') || ''));

  if (open) {
    files[open] = String(ask('dock:current-type') || '');
  }

  return files;
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
 * section on the page whose file has one — named by the section's ids — and
 * of the header's, the footer's and the layout's files, named by the part of
 * the frame (`chrome`). Setting a value a component already has changes
 * nothing, so this is safe to send on every boot and every draw.
 */
export function syncStoredAlpineStates(win, doc = win.document, target = previewFrame(doc)?.contentWindow) {
  const states = readStates(win);

  if (!target) {
    return;
  }

  const send = (scope, file) => {
    for (const [nth, keys] of Object.entries(statesOf(file))) {
      for (const [key, value] of Object.entries(keys)) {
        target.postMessage({ source: SOURCE, type: MSG.SVE_ALPINE_STATE, ...scope, nth: Number(nth), key, value, on: true }, win.location.origin);
      }
    }
  };

  for (const row of pageSectionRows(win, doc)) {
    send({ uid: row.ids[0], uids: row.ids }, states[row.type]);
  }

  for (const [chrome, type] of Object.entries(frameFiles(win))) {
    send({ chrome }, states[type]);
  }
}

on('alpine-states:sync', ({ win, target } = {}) => {
  if (win && target) {
    syncStoredAlpineStates(win, win.document, target);
  }
});
