/**
 * section-library.js — inserting a block, set, section or template into the form.
 * Split out of section-library.js in the quality pass (tab G): the same statements, in the same
 * order; only the imports are new. section-library.js re-exports this file.
 */
import { t } from '../lib/i18n.js';
import { openCpOverlay } from '../cp/open-overlay.js';
import ChoiceDialog from '../cp/surfaces/ChoiceDialog.vue';
import { dataGet, findPathByUid, unwrapRef } from '../lib/values.js';
import { currentCollection } from '../lib/live-preview.js';
import { sectionField } from '../lib/config.js';
import { activeContainers } from '../lib/publish-containers.js';
import { newRowId, rowLocation } from './row-ops.js';
import {
  applySidTemplate,
  attachSidNestedMeta,
  fetchNestedSetMeta,
  globalSectionSet,
  hydrateExistingMeta,
  rememberSavedSection,
  sectionMetaCache,
  setHandleFor,
  writeNestedRowMeta,
  writeSetMeta,
} from './row-meta.js';
import {
  announcePageStructure,
  blueprintQuery,
  insertSectionAfter,
  newUuid,
  pageBuilderKey,
  reidSection,
} from './types.js';
import { formHasSectionField } from './picker.js';

export function watchNewRow(doc, win, data, onAdded) {
  const { uid, anchorUid, sectionUid, field } = data;
  const around = uid || anchorUid;

  for (const container of activeContainers(doc)) {
    const values = unwrapRef(container.values);

    if (!values || typeof values !== 'object') {
      continue;
    }

    let parentPath = null;
    let startIds = new Set();

    if (around) {
      const loc = rowLocation(values, around);

      if (!loc) {
        continue;
      }

      parentPath = loc.parentPath;
      startIds = new Set(loc.rows.map((row) => row?._id).filter(Boolean));
    } else if (sectionUid && field) {
      const sectionPath = findPathByUid(values, sectionUid);

      if (sectionPath === null) {
        continue;
      }

      parentPath = `${sectionPath}.${field}`;
      const existing = dataGet(values, parentPath);

      startIds = new Set((Array.isArray(existing) ? existing : []).map((row) => row?._id).filter(Boolean));
    } else {
      continue;
    }

    let attempts = 0;

    const poll = () => {
      const current = dataGet(unwrapRef(container.values), parentPath);

      if (!Array.isArray(current)) {
        return;
      }

      const added = current.find((row) => row && row._id && !startIds.has(row._id));

      if (added) {
        onAdded(container, unwrapRef(container.values), parentPath, added);

        return;
      }

      if (++attempts < 240) {
        setTimeout(poll, 150);
      }
    };

    setTimeout(poll, 150);

    return;
  }
}

/**
 * "+" between a replicator's blocks: insert a new set of the chosen type, next to
 * the block the "+" sits by (or as the first block when the field is empty). The
 * row is written into the nested array with its meta, so it shows in both the
 * preview and the CP form.
 */
export async function handleInsertBlock(data, doc, win) {
  const { field, set, anchorUid, position, scope } = data;

  if (!field || !set) {
    return;
  }

  const meta = await fetchNestedSetMeta(win, field, set, data.sectionType || '');
  const rowId = newRowId();
  const row = {
    ...(meta?.defaults ? JSON.parse(JSON.stringify(meta.defaults)) : {}),
    _id: rowId,
    id: rowId,
    _visual_id: newUuid(win),
    type: set,
  };
  const built = await applySidTemplate(
    win,
    row,
    data.template || meta?.template || '',
    data.fieldDefaults,
    meta?.new ? JSON.parse(JSON.stringify(meta.new)) : {},
    data.rowTemplate || meta?.rowTemplate || ''
  );
  const rowMeta = attachSidNestedMeta(
    meta?.new ? JSON.parse(JSON.stringify(meta.new)) : {},
    built.nestedField,
    built.nested
  );

  for (const container of activeContainers(doc)) {
    const values = unwrapRef(container.values);

    if (!values || typeof values !== 'object') {
      continue;
    }

    // Anchored to a sibling block: splice in beside it. If the preview uid
    // is not in values yet, fall through to `scope` instead of giving up.
    if (anchorUid) {
      const loc = rowLocation(values, anchorUid);

      if (loc) {
        const next = JSON.parse(JSON.stringify(loc.rows));

        next.splice(position === 'before' ? loc.index : loc.index + 1, 0, built.row);
        writeNestedRowMeta(container, values, loc.parentPath, rowId, rowMeta);
        container.setFieldValue(loc.parentPath, next);

        return;
      }
    }

    // Empty field, or anchor uid missed: seed the section's own field array.
    if (scope) {
      const sectionPath = findPathByUid(values, scope);

      if (sectionPath === null) {
        continue;
      }

      const fieldPath = `${sectionPath}.${field}`;
      const existing = dataGet(values, fieldPath);
      const next = Array.isArray(existing) ? JSON.parse(JSON.stringify(existing)) : [];

      next.push(built.row);
      writeNestedRowMeta(container, values, fieldPath, rowId, rowMeta);
      container.setFieldValue(fieldPath, next);

      return;
    }
  }
}

/**
 * Insert a Bard set node into a Bard field's value array (ProseMirror JSON).
 * Used by the whole-field inline editor's "+" on an empty paragraph.
 *
 * `index` is the text-block index in the serialized preview (locked sets also
 * count in the final array — the bridge sends the absolute splice index).
 */
export async function handleInsertBardSet(data, doc, win) {
  const { field, set, scope, index } = data;

  if (!field || !set) {
    return;
  }

  const meta = await fetchNestedSetMeta(win, field, set);
  const setId = newRowId();
  const visualId = newUuid(win);
  const valuesPayload = {
    ...(meta?.defaults ? JSON.parse(JSON.stringify(meta.defaults)) : {}),
    type: set,
    _visual_id: visualId,
  };

  const setNode = {
    type: 'set',
    attrs: {
      id: setId,
      enabled: true,
      values: valuesPayload,
    },
  };

  for (const container of activeContainers(doc)) {
    const values = unwrapRef(container.values);

    if (!values || typeof values !== 'object') {
      continue;
    }

    let fieldPath = field;

    if (scope) {
      const sectionPath = findPathByUid(values, scope);

      if (sectionPath === null) {
        continue;
      }

      fieldPath = `${sectionPath}.${field}`;
    }

    const existing = dataGet(values, fieldPath);

    if (!Array.isArray(existing)) {
      continue;
    }

    const next = JSON.parse(JSON.stringify(existing));
    const at = Number.isInteger(index) ? Math.max(0, Math.min(index, next.length)) : next.length;

    next.splice(at, 0, setNode);
    writeNestedRowMeta(container, values, fieldPath, setId, meta?.new);
    container.setFieldValue(fieldPath, next);

    return;
  }
}

export async function fetchSetMeta(win, setHandle) {
  if (!setHandle) {
    return null;
  }

  // Per page builder: two of them may both have a set of this name.
  const key = `${pageBuilderKey(win)}::${setHandle}`;

  if (sectionMetaCache.has(key)) {
    return sectionMetaCache.get(key);
  }

  const collection = currentCollection(win);

  if (!collection) {
    return null;
  }

  const pending = (async () => {
    const url =
      `/!/sve/section-meta?collection=${encodeURIComponent(collection)}&set=${encodeURIComponent(setHandle)}` +
      `&${blueprintQuery(win)}`;

    const res = await win.fetch(url, {
      credentials: 'same-origin',
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
    });

    if (!res.ok) {
      return null;
    }

    return res.json();
  })();

  sectionMetaCache.set(key, pending);

  try {
    const data = await pending;

    if (!data) {
      sectionMetaCache.delete(key);
    }

    return data;
  } catch {
    sectionMetaCache.delete(key);

    return null;
  }
}

/** The section object to insert for a library card of the given kind. */
export function buildSectionRow(win, kind, item, defaults, newId) {
  const base = {
    ...reidSection(win, defaults || {}),
    _id: newId,
    id: newId,
    _visual_id: newUuid(win),
    enabled: true,
  };

  if (kind === 'page') {
    return { ...base, type: item.handle };
  }

  if (kind === 'global') {
    // A reference — the template renders the source's current sections. The set
    // and its entries field share one handle, so the row is built from it.
    const set = globalSectionSet(win);

    rememberSavedSection(item.id, { title: item.title, section_type: item.section_type });

    return { ...base, type: set, [set]: [item.id] };
  }

  // custom: an independent copy with fresh ids, laid over the type's defaults so
  // any fields added since it was saved still get sensible values.
  return alignCustomSetIds(win, {
    ...base,
    ...reidSection(win, item.section_data || {}),
    _id: newId,
    id: newId,
    _visual_id: newUuid(win),
    enabled: true,
    type: item.section_type,
  });
}

/**
 * Custom YAML has `id` (not `_id`) and no `_visual_id`. After reid, plus and
 * rowLocation look up the preview `data-sid` against form values — both keys
 * and a visual id have to be present and equal. Only used on custom insert,
 * not on Add-row / blankRowFrom.
 */
function isCustomSetRow(node) {
  if (!node || typeof node !== 'object') {
    return false;
  }

  if ('_id' in node || '_visual_id' in node) {
    return true;
  }

  if (typeof node.type !== 'string') {
    return false;
  }

  if (node.type === 'text' || node.type === 'paragraph' || node.type === 'hardBreak' || node.type === 'heading') {
    return false;
  }

  return 'enabled' in node || 'id' in node;
}

export function alignCustomSetIds(win, row) {
  const walk = (node) => {
    if (Array.isArray(node)) {
      node.forEach(walk);

      return;
    }

    if (!node || typeof node !== 'object') {
      return;
    }

    if (isCustomSetRow(node)) {
      const fresh = node._id || node.id || newRowId();

      node._id = fresh;
      node.id = fresh;

      if (!node._visual_id) {
        node._visual_id = newUuid(win);
      }
    }

    Object.values(node).forEach(walk);
  };

  walk(row);

  return row;
}

/**
 * Inserts a library card's section: fetches the set's fresh meta, builds the
 * row from it, and drops it in at `afterUid` (null = top). Async because the
 * meta round-trip is what lets the row render in the CP list, not only the
 * preview.
 */
export async function insertSection(win, doc, afterUid, kind, item) {
  // No page builder on this form: no rows to land in, and the uid the preview
  // sends could name a row in some other replicator. Nothing written, nothing
  // asked (a template would otherwise put its replace-or-add question first).
  if (!formHasSectionField(win)) {
    return false;
  }

  if (kind === 'template') {
    return insertTemplate(win, doc, afterUid, item);
  }

  const handle = setHandleFor(win, kind, item);
  const newId = newRowId();
  const meta = await fetchSetMeta(win, handle);
  const row = buildSectionRow(win, kind, item, meta?.defaults, newId);

  insertSectionAfter(win, doc, afterUid, row, hydrateExistingMeta(row, meta?.new || {}, meta?.defaults));

  return true;
}

/**
 * Drops a whole template onto the page. Answers whether rows are on their way.
 *
 * Every section in it is copied — a template is a stencil, never a reference —
 * and each one is laid over its type's current defaults, so a template saved
 * before a field existed still gets a sensible value for it.
 *
 * Meta is fetched per section *type*, not per row: the Replicator renders each row
 * from `meta.<field>.existing[<_id>]`, so without it the sections would appear in
 * the preview and be missing from the CP list.
 */
export async function insertTemplate(win, doc, afterUid, item) {
  const sections = (item.sections || []).filter((section) => section && section.type);

  if (!sections.length) {
    win.Statamic?.$toast?.error(t(win, 'template_empty'));

    return false;
  }

  const mode = await askTemplateMode(win, item);

  if (!mode) {
    return false; // cancelled
  }

  const rows = [];
  const metas = [];

  for (const section of sections) {
    const meta = await fetchSetMeta(win, section.type);
    const newId = newRowId();

    const row = buildSectionRow(
      win,
      'custom',
      { section_data: section, section_type: section.type },
      meta?.defaults,
      newId
    );

    rows.push(row);
    metas.push(hydrateExistingMeta(row, meta?.new || {}, meta?.defaults));
  }

  insertSectionsAfter(win, doc, afterUid, rows, metas, mode === 'replace');

  return true;
}

/**
 * The multi-row sibling of `insertSectionAfter`: all of a template's sections in
 * one write.
 *
 * One `setFieldValue` for the lot, not one per section — each call re-renders the
 * Replicator, so inserting fifteen sections one at a time would be fifteen
 * re-renders and fifteen preview reloads.
 */
export function insertSectionsAfter(win, doc, afterUid, rows, rowMetas, replace) {
  const field = sectionField(win);

  for (const container of activeContainers(doc)) {
    const values = unwrapRef(container.values);

    if (!values || typeof values !== 'object') {
      continue;
    }

    const existing = dataGet(values, field);

    if (!Array.isArray(existing)) {
      continue;
    }

    // Where they go is settled before any meta is written: meta for rows that
    // never land in this form would be left behind in it.
    const found = replace || afterUid == null ? null : rowLocation(values, afterUid);

    if (!replace && afterUid != null && !found) {
      continue;
    }

    rows.forEach((row, index) => writeSetMeta(container, field, row, rowMetas[index]));

    if (replace) {
      container.setFieldValue(field, rows);
      announcePageStructure();

      return true;
    }

    if (afterUid == null) {
      container.setFieldValue(field, [...rows, ...JSON.parse(JSON.stringify(existing))]);
      announcePageStructure();

      return true;
    }

    const next = JSON.parse(JSON.stringify(found.rows));

    next.splice(found.index + 1, 0, ...rows);
    container.setFieldValue(found.parentPath, next);
    announcePageStructure();

    return true;
  }

  return false;
}

/**
 * Replace what's on the page, or add to it?
 *
 * Asked every time rather than remembered: dropping a template on an empty page
 * and dropping one onto a page you've already built are different intentions, and
 * replacing is not undoable from here.
 */
export function askTemplateMode(win, item) {
  return new Promise((resolve) => {
    const overlay = openCpOverlay(win.document, ChoiceDialog, {
      title: item.title,
      body: t(win, 'template_mode_body', { count: (item.sections || []).length }),
      buttons: [
        { value: null, label: t(win, 'cancel'), variant: 'ghost' },
        { value: 'replace', label: t(win, 'template_replace'), variant: 'muted' },
        { value: 'append', label: t(win, 'template_append'), variant: 'primary' },
      ],
      onPick: (value) => {
        overlay.dismiss();
        resolve(value);
      },
      onClose: () => resolve(null),
    });
  });
}
