/**
 * Settings toggle: `page_activity`
 * Edit history popup from a Live Preview toolbar icon.
 * Vue UI in PageActivity.vue. Does not import the kernel.
 */
import { sve } from './cp-registry.js';
import { t } from './cp-t.js';
import { mountPane, unmountPane } from './cp/mount-pane.js';
import PageActivity from './cp/surfaces/PageActivity.vue';

export const PAGE_EDITS_ID = '__sve-page-edits';

const cache = new Map();
const inflight = new Map();

let shownFor = null;
let liveHost = null;
let editsOpen = false;

function entryId(win) {
  if (typeof sve.currentEntryId === 'function') {
    return sve.currentEntryId(win);
  }

  const match = win.location.pathname.match(/\/entries\/([^/]+)/);

  return match ? decodeURIComponent(match[1]) : null;
}

function hostOf(doc) {
  if (liveHost?.isConnected) {
    return liveHost;
  }

  return doc.getElementById(PAGE_EDITS_ID);
}

function paintButton(win) {
  const btn = win.document.querySelector('#__sve-toolbar button[data-tab="edits"]');

  if (btn && typeof sve.paintLpActiveControl === 'function') {
    sve.paintLpActiveControl(btn, editsOpen);
  }
}

function bindDoc(win) {
  const doc = win.document;

  if (doc.documentElement.dataset.sveEditsBound) {
    return;
  }

  doc.documentElement.dataset.sveEditsBound = '1';
  doc.addEventListener('sve-edits-changed', (event) => {
    editsOpen = !!event.detail?.open;
    paintButton(win);
  });
}

function removeHost(doc) {
  const host = liveHost || hostOf(doc);

  if (host) {
    unmountPane(host);
    host.remove();
  }

  liveHost = null;
  shownFor = null;
  editsOpen = false;
}

function ensureHost(doc) {
  let host = liveHost || hostOf(doc);

  if (!host) {
    host = doc.createElement('div');
    host.id = PAGE_EDITS_ID;
    host.style.cssText = 'position:absolute;width:0;height:0;overflow:visible;';
    doc.body.appendChild(host);
  } else if (host.parentElement !== doc.body) {
    doc.body.appendChild(host);
  }

  liveHost = host;

  return host;
}

function loadActivity(win, id) {
  if (cache.has(id)) {
    return Promise.resolve(cache.get(id));
  }

  if (!inflight.has(id)) {
    const req = win
      .fetch(`/!/sve/entry-activity/${encodeURIComponent(id)}`, {
        credentials: 'same-origin',
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
      })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        inflight.delete(id);

        if (data) {
          cache.set(id, data);
        }

        return data;
      })
      .catch(() => {
        inflight.delete(id);

        return null;
      });

    inflight.set(id, req);
  }

  return inflight.get(id);
}

function mountActivity(win, host, data) {
  mountPane(host, PageActivity, {
    emptyLabel: t(win, 'page_edits_empty'),
    unknownUser: t(win, 'page_edit_unknown'),
    historyTitle: t(win, 'page_edits_title'),
    closeLabel: t(win, 'page_edits_close'),
    colDate: t(win, 'page_edits_col_date'),
    colUser: t(win, 'page_edits_col_user'),
    colType: t(win, 'page_edits_col_type'),
    colDetails: t(win, 'page_edits_col_details'),
    prevLabel: t(win, 'page_edits_prev'),
    nextLabel: t(win, 'page_edits_next'),
    pageOf: t(win, 'page_edits_range'),
    edits: data.revisions === false
      ? []
      : (data.edits || []).flatMap((edit) => editRows(win, edit)),
  });
}

function typeLabel(win, action) {
  const key = `page_edit_type_${action || 'revision'}`;
  const label = t(win, key);

  return label === key ? t(win, 'page_edit_type_revision') : label;
}

function fieldLabel(win, handle) {
  const key = `page_edit_field_${handle}`;
  const label = t(win, key);

  if (label !== key) {
    return label;
  }

  return String(handle || '').replaceAll('_', ' ');
}

function editRows(win, edit) {
  const base = {
    at: edit.at,
    user: edit.user?.name || '',
    initials: edit.user?.initials || '',
  };
  const page = t(win, 'page_edit_page');
  const rows = [];
  const changes = Array.isArray(edit.changes) ? edit.changes : [];

  const push = (type, details) => {
    rows.push({ ...base, type, details });
  };

  for (const change of changes) {
    if (change.action === 'created') {
      push(page, t(win, 'page_edit_field_created'));

      continue;
    }

    if (change.action === 'reordered') {
      push(t(win, 'page_edit_field_page_sections'), t(win, 'page_edit_reordered'));

      continue;
    }

    if (change.section && change.action === 'added') {
      push(change.section, t(win, 'page_edit_added_short'));

      continue;
    }

    if (change.section && change.action === 'removed') {
      push(change.section, t(win, 'page_edit_removed_short'));

      continue;
    }

    if (change.section) {
      const labels = (change.parts || []).map((handle) => fieldLabel(win, handle)).filter(Boolean);

      push(change.section, labels.join(', ') || t(win, 'page_edit_type_revision'));

      continue;
    }

    if (change.handle) {
      push(page, fieldLabel(win, change.handle));
    }
  }

  if (!rows.length && Array.isArray(edit.fields) && edit.fields.length) {
    edit.fields.forEach((handle) => push(page, fieldLabel(win, handle)));
  }

  if (!rows.length) {
    push(page, typeLabel(win, edit.action));
  }

  if (edit.message && rows[0]) {
    rows[0].details = rows[0].details
      ? `${edit.message} — ${rows[0].details}`
      : edit.message;
  }

  return rows;
}

export function pageEditsOpen() {
  return editsOpen;
}

export function togglePageEdits(win) {
  bindDoc(win);

  if (!sve.featureOn(win, 'page_activity')) {
    removeHost(win.document);
    paintButton(win);

    return;
  }

  const id = entryId(win);

  if (!id) {
    return;
  }

  if (editsOpen) {
    win.document.dispatchEvent(new CustomEvent('sve-edits-toggle'));

    return;
  }

  const host = ensureHost(win.document);

  const open = (data) => {
    if (!data || !host.isConnected || entryId(win) !== id) {
      return;
    }

    if (shownFor !== id || !host.querySelector('[data-sve-page-edits-root]')) {
      mountActivity(win, host, data);
      shownFor = id;
    }

    win.queueMicrotask(() => {
      win.document.dispatchEvent(new CustomEvent('sve-edits-open'));
    });
  };

  const cached = cache.get(id);

  if (cached) {
    open(cached);

    return;
  }

  loadActivity(win, id).then(open);
}

sve.pageEditsOpen = pageEditsOpen;
sve.togglePageEdits = togglePageEdits;
