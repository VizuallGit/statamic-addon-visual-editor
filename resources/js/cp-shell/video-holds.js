/**
 * Which videos stay paused in the preview, remembered across sessions.
 *
 * The tree's video icon holds a video still while the section is built. The
 * hold is remembered per section file in this browser (a hold is about the
 * file, not the page), and it has to outlive a redraw, a trip into another
 * section and a reload of the page: a video paused before lunch is still
 * paused after it, and one that was set playing plays. The preview asks for
 * the holds when its bridge boots, and gets one message per section on the
 * page whose file has a hold — not only the file the dock has open, because
 * after a reload nothing is open yet.
 *
 * A copy of the preview — one of the breakpoint overview's frames — knows no
 * holds either, and it never asks: the overview asks for it over the bus
 * (`video-holds:sync`, with the copy's window) once the copy has loaded.
 */
import { on } from '../cp/bus.js';
import { sectionField } from '../lib/config.js';
import { previewFrame } from '../lib/preview-frame.js';
import { MSG, SOURCE } from '../lib/protocol.js';
import { activeContainers } from '../lib/publish-containers.js';
import { unwrapRef } from '../lib/values.js';

const VIDEO_HOLDS_KEY = 'sveVideoHolds';

function readHolds(win) {
  try {
    const all = JSON.parse(win.localStorage.getItem(VIDEO_HOLDS_KEY) || '{}');

    return all && typeof all === 'object' ? all : {};
  } catch {
    return {};
  }
}

/** The held videos of one file, by their order in it. */
export function heldVideos(win, type) {
  const list = type ? readHolds(win)[type] : null;

  return new Set(Array.isArray(list) ? list.filter((n) => Number.isInteger(n)) : []);
}

export function rememberVideoHolds(win, type, held) {
  if (!type) {
    return;
  }

  try {
    const all = readHolds(win);

    if (held.size) {
      all[type] = [...held].sort((a, b) => a - b);
    } else {
      delete all[type];
    }

    win.localStorage.setItem(VIDEO_HOLDS_KEY, JSON.stringify(all));
  } catch {
    /* no storage: the hold lasts the session */
  }
}

/** The page's section rows, each with every id it answers to. */
function sectionRows(win, doc) {
  const field = sectionField(win) || 'page_sections';
  const rows = [];

  for (const container of activeContainers(doc) || []) {
    const values = unwrapRef(container.values);
    const list = values && typeof values === 'object' ? values[field] : null;

    if (!Array.isArray(list)) {
      continue;
    }

    for (const row of list) {
      if (!row || typeof row !== 'object' || typeof row.type !== 'string') {
        continue;
      }

      const ids = [row._visual_id, row.id, row._id].filter((id) => typeof id === 'string' && id !== '');

      if (ids.length) {
        rows.push({ type: row.type, ids });
      }
    }
  }

  return rows;
}

/**
 * Every remembered hold, told to the preview: one message per section on the
 * page whose file has one. An extra hold on a video already held costs
 * nothing, so this is safe to send on every boot and every draw.
 */
export function syncStoredVideoHolds(win, doc = win.document, target = previewFrame(doc)?.contentWindow) {
  const holds = readHolds(win);

  if (!target) {
    return;
  }

  for (const row of sectionRows(win, doc)) {
    const list = holds[row.type];

    if (!Array.isArray(list)) {
      continue;
    }

    for (const nth of list) {
      if (Number.isInteger(nth)) {
        target.postMessage({ source: SOURCE, type: MSG.SVE_VIDEO_HOLD, uid: row.ids[0], uids: row.ids, nth, on: true }, win.location.origin);
      }
    }
  }
}

on('video-holds:sync', ({ win, target } = {}) => {
  if (win && target) {
    syncStoredVideoHolds(win, win.document, target);
  }
});
