/**
 * section-library.js — add, remove, copy, hide a row from the preview.
 * Split out of section-library.js in the quality pass (tab G): the same statements, in the same
 * order; only the imports are new. section-library.js re-exports this file.
 */
import { sveState } from '../cp-state.js';
import { dataGet, findPathByUid, unwrapRef } from '../lib/values.js';
import { previewFrame } from '../lib/preview-frame.js';
import { sectionField } from '../lib/config.js';
import { activeContainers } from '../lib/publish-containers.js';
import { setLpCollapsed } from '../lp-panel.js';
import { selectRow } from '../selection-panel.js';
import { hasUnsavedGlobals } from '../globals-panel.js';
import { openGlobalSectionInline } from '../global-section.js';
import { confirmLeaveGlobalsOverlay } from '../pages.js';
import { newUuid } from './types.js';
import {
  applySidTemplate,
  attachSidNestedMeta,
  globalSectionSet,
  rowMetaTemplate,
  writeNestedRowMeta,
} from './row-meta.js';
import { syncSectionLibraryAvailability } from '../section-library.js';
import { dismissChromeForPageEdit, isGlobalsOverlayOpen } from './panel-layout.js';

/** The uid of the last top-level page section in the preview (for click-append). */
export function lastSectionUid(doc) {
  const frame = previewFrame(doc);
  const inner = frame?.contentDocument;
  const sections = inner ? [...inner.querySelectorAll('section[data-sid], article[data-sid]')] : [];

  return sections.length ? sections[sections.length - 1].getAttribute('data-sid') : null;
}

/** A fresh row id in the same shape Statamic uses for replicator/grid rows. */
export function newRowId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

/**
 * A blank row modelled on an existing one.
 *
 * Copying the row's shape rather than building one from the blueprint: the
 * blueprint isn't reachable from here, and a row that's missing keys renders
 * wrong. Text is cleared, ids are regenerated, and everything else is kept —
 * so a new button arrives with the same styling and an empty label, ready to
 * fill in, rather than as something the template can't render.
 */
export function blankRowFrom(row) {
  const next = {};

  for (const [key, value] of Object.entries(row)) {
    if (key === 'id' || key === '_id') {
      next[key] = newRowId();
    } else if (key === '_visual_id') {
      next[key] = crypto?.randomUUID ? crypto.randomUUID() : `${newRowId()}-${newRowId()}`;
    } else if (key === 'type' || key === 'enabled') {
      // Replicator sets need their type intact — clearing it yields
      // "Undefined array key type" when the preview augments the field.
      next[key] = value;
    } else if (typeof value === 'string') {
      next[key] = '';
    } else {
      next[key] = JSON.parse(JSON.stringify(value ?? null));
    }
  }

  return next;
}

/**
 * Walks the container meta alongside the values to the field meta at `path`.
 * Meta mirrors the values tree but keys array rows by their `_id`
 * (`existing[<_id>]`) rather than by index, so numeric path segments are
 * resolved through the value at that index. Returns null if the path can't be
 * followed.
 */
export function metaForPath(fullMeta, values, path) {
  let meta = fullMeta;
  let val = values;

  for (const seg of path.split('.')) {
    if (meta == null) {
      return null;
    }

    if (/^\d+$/.test(seg)) {
      const row = Array.isArray(val) ? val[Number(seg)] : null;

      if (!row || !meta.existing) {
        return null;
      }

      meta = meta.existing[row._id];
      val = row;
    } else {
      meta = meta[seg];
      val = val ? val[seg] : null;
    }
  }

  return meta;
}

/**
 * A new row for an orderable field, pre-filled with the field's DEFAULT values
 * (from the grid meta) so the CP inputs show them and inline editing works right
 * away — matching what Statamic's own "Add row" does. Text-only defaults live in
 * `meta.<field>.defaults`; replicators (per-set defaults) have none, so those
 * fall back to a blank clone of the neighbouring row.
 */
export function newRowFor(win, container, values, parentPath, sampleRow) {
  const fullMeta = unwrapRef(container.meta);
  const fieldMeta = fullMeta ? metaForPath(fullMeta, values, parentPath) : null;
  const defaults = fieldMeta && typeof fieldMeta === 'object' ? fieldMeta.defaults : null;

  let row;

  if (!defaults || typeof defaults !== 'object' || Array.isArray(defaults)) {
    row = blankRowFrom(sampleRow);
  } else {
    row = JSON.parse(JSON.stringify(defaults));
    row._id = newRowId();
  }

  // Grid rows (and anything else we inject auto_uuid onto) need a stable
  // _visual_id in the preview — without it Antlers cascades the parent block's
  // id onto the button, and "Add another" would duplicate the whole block.
  if (!row._id) {
    row._id = newRowId();
  }

  row._visual_id = newUuid(win);

  return row;
}

/** The array a row lives in, plus its index. */
export function rowLocation(values, uid) {
  const path = findPathByUid(values, uid);

  if (path === null || path === '') {
    return null;
  }

  const parts = path.split('.');

  // Bard set: uid lives on attrs.values (_visual_id) or attrs (id). Climb to the
  // content-array index so hide/dup/delete/move operate on the set node itself.
  if (parts.length >= 3 && parts[parts.length - 1] === 'values' && parts[parts.length - 2] === 'attrs') {
    const index = Number(parts[parts.length - 3]);
    const parentPath = parts.slice(0, -3).join('.');
    const rows = dataGet(values, parentPath);

    if (Array.isArray(rows) && Number.isInteger(index) && rows[index]?.type === 'set') {
      return { parentPath, index, rows, kind: 'bard-set' };
    }
  }

  if (parts.length >= 2 && parts[parts.length - 1] === 'attrs') {
    const index = Number(parts[parts.length - 2]);
    const parentPath = parts.slice(0, -2).join('.');
    const rows = dataGet(values, parentPath);

    if (Array.isArray(rows) && Number.isInteger(index) && rows[index]?.type === 'set') {
      return { parentPath, index, rows, kind: 'bard-set' };
    }
  }

  const dot = path.lastIndexOf('.');

  if (dot === -1) {
    return null;
  }

  const parentPath = path.slice(0, dot);
  const index = Number(path.slice(dot + 1));
  const rows = dataGet(values, parentPath);

  if (!Array.isArray(rows) || !Number.isInteger(index)) {
    return null;
  }

  return {
    parentPath,
    index,
    rows,
    kind: rows[index]?.type === 'set' ? 'bard-set' : 'row',
  };
}

/**
 * What the blueprint allows for the field this row lives in (max_rows/min_rows,
 * or max_sets/min_sets on a replicator). Looked up by the containing set's type
 * first, since the same handle appears in several sets with different limits.
 */
export function rowLimits(values, parentPath, win) {
  const all = win.Statamic?.$config?.get?.('sveRowLimits') ?? {};
  const handle = parentPath.slice(parentPath.lastIndexOf('.') + 1);
  const dot = parentPath.lastIndexOf('.');
  const set = dot === -1 ? null : dataGet(values, parentPath.slice(0, dot));
  const type = set && typeof set === 'object' ? set.type : null;

  return (type ? all[`${type}.${handle}`] : null) ?? all[handle] ?? {};
}

/** "+" on an orderable row: add another one just after it, within the field's max. */
export async function handleAddRow(data, doc, win) {
  for (const container of activeContainers(doc)) {
    const values = unwrapRef(container.values);

    if (!values || typeof values !== 'object') {
      continue;
    }

    const found = rowLocation(values, data.uid);

    if (!found) {
      continue;
    }

    const { parentPath, index, rows } = found;
    const { max } = rowLimits(values, parentPath, win);

    if (max && rows.length >= max) {
      return; // the field is full — the CP wouldn't allow it either
    }

    const row = newRowFor(win, container, values, parentPath, rows[index]);
    const rowMeta = rowMetaTemplate(container, values, parentPath, rows[index]) || {};
    const built = await applySidTemplate(win, row, data.template, data.fieldDefaults, rowMeta);
    const next = JSON.parse(JSON.stringify(rows));

    next.splice(index + 1, 0, built.row);

    // Without meta.existing[row._id] the Grid/Replicator Vue UI ignores the row:
    // Live Preview (values) shows it, the sidebar does not. Same requirement as
    // handleInsertBlock / insertSectionAfter.
    writeNestedRowMeta(
      container,
      values,
      parentPath,
      built.row._id,
      attachSidNestedMeta(rowMeta, built.nestedField, built.nested)
    );
    container.setFieldValue(parentPath, next);

    return;
  }
}

/**
 * The last row of a block's field was just taken away, so the block goes too —
 * a links block with no links draws nothing, and an empty block that draws
 * nothing can't be hovered, so it could never be reached again from the page.
 *
 * `uid` is the block the preview found around the row (see blockHolding() in
 * bridge.js — always a set of an insertable container, never a page section).
 * Returns true when the block was removed, and then the caller has nothing left
 * to do: the row went with it.
 */
export function removeEmptiedBlock(container, values, uid, rows, win) {
  const block = rowLocation(values, uid);

  if (!block || block.rows === rows) {
    return false;
  }

  const { min } = rowLimits(values, block.parentPath, win);

  if (min && block.rows.length <= min) {
    return false; // the section needs this block — leave it, empty
  }

  const next = JSON.parse(JSON.stringify(block.rows));

  next.splice(block.index, 1);
  container.setFieldValue(block.parentPath, next);

  return true;
}

/** The row when `uid` is a section of the page builder itself (not a block in one), else null. */
export function pageSectionRow(win, doc, uid) {
  const field = sectionField(win);

  for (const container of activeContainers(doc)) {
    const values = unwrapRef(container.values);
    const found = values && typeof values === 'object' ? rowLocation(values, uid) : null;

    if (!found) {
      continue;
    }

    const row = found.rows[found.index];

    return found.parentPath === field && row && typeof row.type === 'string' && row.type !== globalSectionSet(win)
      ? row
      : null;
  }

  return null;
}

/**
 * Hide a replicator/Bard set (`enabled: false`) — same as the CP's blue toggle.
 * The set disappears from the preview; re-enable it from the sidebar, or with
 * `data.show` (the HTML tree's eye on a section row).
 * No-ops on grid rows that have no `type` (they're not toggleable sets).
 */
export function handleHideRow(data, doc, win) {
  for (const container of activeContainers(doc)) {
    const values = unwrapRef(container.values);

    if (!values || typeof values !== 'object') {
      continue;
    }

    const found = rowLocation(values, data.uid);

    if (!found) {
      continue;
    }

    const { parentPath, index, rows, kind } = found;
    const row = rows[index];

    if (!row || typeof row !== 'object') {
      return;
    }

    const next = JSON.parse(JSON.stringify(rows));
    const enabled = data.show === true;

    if (kind === 'bard-set' && row.type === 'set') {
      next[index] = {
        ...next[index],
        attrs: { ...(next[index].attrs || {}), enabled },
      };
    } else if ('type' in row) {
      next[index] = { ...next[index], enabled };
    } else {
      return;
    }

    container.setFieldValue(parentPath, next);

    return;
  }
}

/**
 * "Rediger global sektion": content belongs to the synced entry. Open its form
 * in the LEFT Live Preview editor (same place as a normal section) — not a
 * right-hand drawer. Values stream up so inline edit in the preview works.
 */
export function handleOpenGlobalSection(data, win) {
  if (!data.id) {
    return;
  }

  openGlobalSectionInline(win, data.id);
  syncSectionLibraryAvailability(win);
}

/**
 * The gear on a section in the preview: the section on the panel, settings a
 * tab away. It used to expand the set in Statamic's form, click its revealer,
 * wait for the fields and isolate them; the panel draws the row from the
 * form's values instead.
 */
export function handleSectionSettings(data, doc, win) {
  if (isGlobalsOverlayOpen(win) && hasUnsavedGlobals(win)) {
    confirmLeaveGlobalsOverlay(win, () => {
      dismissChromeForPageEdit(win);
      handleSectionSettings(data, doc, win);
    });

    return;
  }

  dismissChromeForPageEdit(win);

  // The panel draws the section under its own name with its tabs across the
  // top; the gear means "show me this section", its settings one tab away.
  selectRow(win, data.uid, 'preview');
  sveState.forcePanelOpen = true;
  setLpCollapsed(win, false);
}

/**
 * The panel row for a top-level array item, located via the form values: the
 * uid's path ("page_sections.3") gives the field handle and index, and the
 * sortable rows render in values order.
 */
export function sortableItemForUid(uid, doc) {
  for (const container of activeContainers(doc)) {
    const values = unwrapRef(container.values);

    if (!values || typeof values !== 'object') {
      continue;
    }

    const path = findPathByUid(values, uid);
    const match = path?.match(/^([^.]+)\.(\d+)$/);

    if (!match) {
      continue;
    }

    return doc.querySelectorAll(`.field_${match[1]}-sortable-item`)[Number(match[2])] ?? null;
  }

  return null;
}
