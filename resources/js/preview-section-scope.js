/**
 * When Live Preview refreshes because one page section changed (sidebar field
 * or dock HTML), tell preview.js which `data-sid` to morph.
 *
 * Reorder, add/remove, theme/site settings, and anything that is not a single
 * section stay a full-body morph. Does not run on the public site.
 *
 * Isolated: no overlay-host, preview, or bridge imports. Parent wraps the
 * iframe's postMessage so Statamic's own `preview.updated` carries the uids.
 */
import { sve } from './cp-registry.js';

let snapshot = null;
let pendingUids = null;

function sectionField(win) {
  return (typeof sve.sectionField === 'function' && sve.sectionField(win)) || 'page_sections';
}

function containers(win) {
  return typeof sve.activeContainers === 'function' ? sve.activeContainers(win.document) : [];
}

function valuesOf(container) {
  return sve.unwrapRef?.(container.values) || container.values;
}

function rowsOf(win) {
  const field = sectionField(win);

  for (const container of containers(win)) {
    const values = valuesOf(container);
    const rows = values?.[field];

    if (Array.isArray(rows)) {
      return rows;
    }
  }

  return null;
}

function rowIds(row) {
  if (!row || typeof row !== 'object') {
    return [];
  }

  return [row.id, row._id, row._visual_id].filter((id) => typeof id === 'string' && id !== '');
}

function fingerprint(rows) {
  return (rows || [])
    .map((row) => rowIds(row)[0] || '')
    .join('\n');
}

function cloneRows(rows) {
  try {
    return JSON.parse(JSON.stringify(rows));
  } catch {
    return null;
  }
}

/**
 * Compare the last snapshot to the live page_sections. One row changed and the
 * list order is the same → that section. Anything else → full preview.
 *
 * Call this when Statamic's preview POST starts (values already updated), not
 * when the response lands — a second call after the snapshot is updated would
 * look like "no change" and wipe the uids before postMessage.
 */
export function noteSectionPreviewScope(win) {
  const rows = rowsOf(win);

  if (!rows) {
    snapshot = null;
    pendingUids = null;

    return;
  }

  const nextPrint = fingerprint(rows);
  const prev = snapshot;
  snapshot = cloneRows(rows) || snapshot;

  if (!prev) {
    pendingUids = null;

    return;
  }

  if (fingerprint(prev) !== nextPrint) {
    pendingUids = null;

    return;
  }

  const changed = [];

  for (let i = 0; i < rows.length; i += 1) {
    if (JSON.stringify(prev[i]) !== JSON.stringify(rows[i])) {
      changed.push(i);
    }
  }

  if (changed.length !== 1) {
    pendingUids = null;

    return;
  }

  const ids = rowIds(rows[changed[0]]);
  pendingUids = ids.length ? ids : null;
}

function withSectionUids(data) {
  if (!data || typeof data !== 'object' || data.name !== 'statamic.preview.updated') {
    return data;
  }

  if (Array.isArray(data.sectionUids) && data.sectionUids.length) {
    return data;
  }

  if (typeof data.sectionUid === 'string' && data.sectionUid !== '') {
    return data;
  }

  if (!pendingUids?.length) {
    return data;
  }

  const sectionUids = pendingUids;
  pendingUids = null;

  return { ...data, sectionUids };
}

function wrapFrame(win) {
  const frame = win.document.getElementById('live-preview-iframe');
  const child = frame?.contentWindow;

  if (!child || child.__sveSectionScopeWrapped) {
    return;
  }

  const original = child.postMessage.bind(child);
  const wrapped = function postMessage(data, targetOrigin, transfer) {
    return original(withSectionUids(data), targetOrigin, transfer);
  };

  try {
    child.postMessage = wrapped;
    child.__sveSectionScopeWrapped = true;

    return;
  } catch {
    /* assignment can fail on platform postMessage */
  }

  try {
    Object.defineProperty(child, 'postMessage', {
      configurable: true,
      writable: true,
      value: wrapped,
    });
    child.__sveSectionScopeWrapped = true;
  } catch {
    /* Statamic then morphs the full body, same as before this module */
  }
}

function bindFrameLoad(win) {
  const frame = win.document.getElementById('live-preview-iframe');

  if (!frame || frame.__sveSectionScopeLoad) {
    return;
  }

  frame.__sveSectionScopeLoad = true;
  frame.addEventListener('load', () => wrapFrame(win));
}

export function wrapSectionPreviewFrame(win) {
  wrapFrame(win);
  bindFrameLoad(win);
}

export function captureSectionPreviewScope(win) {
  noteSectionPreviewScope(win);
  wrapSectionPreviewFrame(win);
}

export function watchSectionPreviewScope(win) {
  wrapSectionPreviewFrame(win);
}
