/**
 * inline-edit.js — move, column width, grid.
 * Split out of inline-edit.js in the quality pass (tab G): the same statements, in the same
 * order; only the imports are new. inline-edit.js re-exports this file.
 */
import { findPathByUid, unwrapRef } from '../lib/values.js';
import { activeContainers } from '../lib/publish-containers.js';

/**
 * Visual column resize: writes the col_w_* span classes the preview's width
 * drag produced. `changes` come in pairs (both columns at a boundary), and the
 * paths are looked up per uid — width writes never shift array indexes, so one
 * values snapshot serves both lookups.
 */
export function handleColumnWidth(data, doc) {
  for (const container of activeContainers(doc)) {
    const values = unwrapRef(container.values);

    if (!values || typeof values !== 'object') {
      continue;
    }

    let applied = false;

    for (const change of data.changes ?? []) {
      if (typeof change?.field !== 'string' || !/^col_w_[mtd]$/.test(change.field)) {
        continue;
      }

      const path = findPathByUid(values, change.uid);

      if (path === null) {
        continue;
      }

      container.setFieldValue(`${path}.${change.field}`, change.value);
      applied = true;
    }

    if (applied) {
      return;
    }
  }
}

/**
 * A stored width, read the same way whichever of its two shapes it has.
 *
 * A plain number is a width with no opinion about where it sits — how every
 * value written before starting columns existed still looks, and how one is
 * still written when nobody has said where the block begins. An object carries
 * both. Null is "no opinion at all".
 */
export function placementOf(value) {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const source = typeof value === 'object' ? value : { span: value };
  const span = Number(source.span ?? source.value);

  if (!Number.isFinite(span) || span < 1) {
    return null;
  }

  const start = Number(source.start);

  return { span, start: Number.isFinite(start) && start > 0 ? start : null };
}

/** Same placement, or not — both numbers have to agree, including "no start". */
export function samePlacement(a, b) {
  return a !== null && b !== null && a.span === b.span && a.start === b.start;
}

/**
 * Opens the builder's type picker on a (typeless) column card once it has
 * mounted — the same flow the card's own plus icon runs. Cards that already
 * have a type get their edit popup instead.
 */
export function openColumnTypePicker(rowId, doc, win, attempts = 0) {
  const card = doc.querySelector(`[data-cb-item-id="${rowId}"]`);
  const trigger = card?.querySelector('.cb-col-plus') ?? card?.querySelector('.cb-edit-btn');

  if (trigger && trigger.offsetParent !== null) {
    trigger.click();
    keepPickerOnScreen(doc, win);

    return;
  }

  if (attempts < 25) {
    setTimeout(() => openColumnTypePicker(rowId, doc, win, attempts + 1), 200);
  }
}

/**
 * The builder positions its type-picker portal at the trigger's rect — with the
 * editor panel parked off-screen (Hide/Auto mode) that lands at left:-10000px.
 * Pull it back into view, centered, so picking a type happens over the preview.
 */
function keepPickerOnScreen(doc, win, attempts = 0) {
  const panel = [...doc.body.children].find((el) => el.style?.position === 'fixed' && el.style?.zIndex === '99999');

  if (panel) {
    const left = parseFloat(panel.style.left);

    if (Number.isNaN(left) || left < 0 || left > win.innerWidth) {
      panel.style.left = `${Math.max(8, (win.innerWidth - (panel.offsetWidth || 224)) / 2)}px`;
      panel.style.top = '120px';
    }

    return;
  }

  if (attempts < 15) {
    setTimeout(() => keepPickerOnScreen(doc, win, attempts + 1), 150);
  }
}
