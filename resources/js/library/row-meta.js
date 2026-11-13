/**
 * section-library.js — a row's meta and the template for new rows.
 * Split out of section-library.js in the quality pass (tab G): the same statements, in the same
 * order; only the imports are new. section-library.js re-exports this file.
 */
import { dataGet, firstEntryId, unwrapRef } from '../lib/values.js';
import { currentCollection } from '../lib/live-preview.js';
import { libraryState } from './state.js';
import { blueprintQuery, newUuid, pageBuilderKey } from './types.js';
import { metaForPath, newRowId } from './row-ops.js';

/**
 * Registers a new row's meta on the container so the Replicator can render it.
 * The Replicator reads each row's fields from `meta.<field>.existing[<_id>]`;
 * merging the fresh meta under the row's id is what makes the row appear in the
 * CP list (not just the preview).
 */
export function writeSetMeta(container, field, section, rowMeta) {
  if (!rowMeta || !section._id || typeof container.setFieldMeta !== 'function') {
    return;
  }

  const allMeta = unwrapRef(container.meta) || {};
  const fieldMeta = allMeta[field] || { existing: {}, new: null, defaults: null, collapsed: [] };

  container.setFieldMeta(field, {
    ...fieldMeta,
    existing: { ...(fieldMeta.existing || {}), [section._id]: rowMeta },
  });
}

/** Replicator/grid meta (object `existing`), not assets (`existing` is an array). */
export function isNestedSetMeta(fieldMeta) {
  return (
    !!fieldMeta &&
    typeof fieldMeta === 'object' &&
    !Array.isArray(fieldMeta) &&
    ('existing' in fieldMeta || 'new' in fieldMeta) &&
    !Array.isArray(fieldMeta.existing)
  );
}

/** A plain bag of keys — not an array, not null. */
function isPlainBag(value) {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

/**
 * A field whose meta holds *other fields'* meta rather than its own rows.
 * `responsive` is the one that matters here: one bag per breakpoint, each a
 * normal handle-to-meta map, so a grid inside it keeps its `existing` two
 * levels down.
 *
 * `reidSection` re-ids every row in the values, including those ones, and
 * `isNestedSetMeta` says no to the wrapper — so without this the grid keeps
 * the ids the server sent. The Grid then renders a row it has no meta for, the
 * select inside it falls through to `Object.entries(undefined)`, and the whole
 * page_sections render throws. Nothing below the throw gets patched, which is
 * why an unrelated field (a colour swatch, say) stops following its value the
 * moment a section with a responsive grid is dropped in.
 *
 * Only bags the values actually reach are touched: a breakpoint with no value
 * of its own has no rows to key, so its meta is left as it came.
 */
function hydrateWrapperMeta(fieldMeta, value, defaults) {
  if (!isPlainBag(fieldMeta) || !isPlainBag(value)) {
    return;
  }

  for (const [key, nested] of Object.entries(fieldMeta)) {
    if (!isPlainBag(nested) || !isPlainBag(value[key])) {
      continue;
    }

    fieldMeta[key] = hydrateExistingMeta(value[key], nested, defaults?.[key] ?? null);
  }
}

function nestedMetaTemplate(fieldMeta) {
  if (
    fieldMeta.new &&
    typeof fieldMeta.new === 'object' &&
    !Array.isArray(fieldMeta.new) &&
    Object.keys(fieldMeta.new).length
  ) {
    return fieldMeta.new;
  }

  return Object.values(fieldMeta.existing || {})[0] || {};
}

/**
 * Re-keys a set's meta to the row ids actually in `row`.
 *
 * `meta.new` is built from fieldset defaults, so its nested `existing` keys
 * belong to those default rows. A custom/duplicated section has different ids —
 * without this the Replicator finds no meta for `blocks` / `list` and the
 * sidebar is empty even though values are there. unique_sets then treats the
 * types as present, so Add is dead too.
 *
 * `defaultsRow` is the same set's defaults (from the section-meta endpoint),
 * used to pick the matching nested template by type (content vs list) instead
 * of handing every child the first default's meta.
 */
export function hydrateExistingMeta(row, template, defaultsRow = null) {
  const out =
    template && typeof template === 'object' && !Array.isArray(template) ? JSON.parse(JSON.stringify(template)) : {};

  if (!row || typeof row !== 'object') {
    return out;
  }

  for (const [handle, fieldMeta] of Object.entries(out)) {
    if (!isNestedSetMeta(fieldMeta)) {
      hydrateWrapperMeta(fieldMeta, row[handle], defaultsRow?.[handle]);

      continue;
    }

    const children = row[handle];
    const defaultChildren = Array.isArray(defaultsRow?.[handle]) ? defaultsRow[handle] : [];
    const genericTemplate = nestedMetaTemplate(fieldMeta);
    const existing = {};
    const typeIndex = {};

    if (Array.isArray(children)) {
      children.forEach((child, index) => {
        if (!child || typeof child !== 'object') {
          return;
        }

        const id = child._id || child.id;

        if (!id) {
          return;
        }

        let match = null;

        if (child.type) {
          const n = typeIndex[child.type] || 0;
          const same = defaultChildren.filter((d) => d && d.type === child.type);

          match = same[n] || same[0] || null;
          typeIndex[child.type] = n + 1;
        } else {
          match = defaultChildren[index] || defaultChildren[0] || null;
        }

        const matchId = match?._id || match?.id;
        const typedTemplate = (matchId && fieldMeta.existing && fieldMeta.existing[matchId]) || genericTemplate;

        existing[id] = hydrateExistingMeta(child, typedTemplate, match);
      });
    }

    fieldMeta.existing = existing;
  }

  return out;
}

// Site-specific handles all come from the server config (provideToScript), never
// from a literal here — the addon has to work as installed on any site.

/** The Replicator set a page uses to reference a synced ("global") saved section. */
export function globalSectionSet(win) {
  return win.Statamic?.$config?.get?.('sveGlobalSectionSet') || 'global_section';
}

/** The collection saved sections live in. */
export function savedSectionsCollection(win) {
  return win.Statamic?.$config?.get?.('sveSavedSectionsCollection') || 'saved_sections';
}

export function rememberSavedSection(id, info) {
  if (!id || typeof id !== 'string') {
    return;
  }

  if (!libraryState.savedSectionIndex) {
    libraryState.savedSectionIndex = new Map();
  }

  libraryState.savedSectionIndex.set(id, {
    title: info?.title || '',
    section_type: info?.section_type || '',
  });
}

export function savedSectionLookup(win) {
  if (libraryState.savedSectionIndex) {
    return libraryState.savedSectionIndex;
  }

  libraryState.savedSectionIndex = new Map();
  const raw = win.Statamic?.$config?.get?.('sveSavedSectionLabels');

  if (raw && typeof raw === 'object') {
    Object.entries(raw).forEach(([id, info]) => {
      libraryState.savedSectionIndex.set(id, {
        title: info?.title || '',
        section_type: info?.section_type || '',
      });
    });
  }

  return libraryState.savedSectionIndex;
}

export function savedSectionInfo(win, id) {
  return id ? savedSectionLookup(win).get(id) || null : null;
}

/**
 * The section a page row renders: its own set, or — for a row of the global
 * set, which only points at a saved section — that section's type.
 *
 * A global row's own partial is a wrapper (a hidden <span> with the row's id,
 * then a loop over the saved entry's sections); nothing that names, draws or
 * opens "the section" means the wrapper. The HTML tree names the row by this,
 * and the dock opens this file when the row is clicked — one answer, so the
 * tree can match the dock's file to the row. The row's own set when the saved
 * section is unknown (deleted, or not in the index); '' for a row with no type.
 */
export function renderedSectionType(win, row) {
  const type = typeof row?.type === 'string' ? row.type : '';
  const globalSet = globalSectionSet(win);

  if (!type || type !== globalSet) {
    return type;
  }

  return savedSectionInfo(win, firstEntryId(row[globalSet]))?.section_type || type;
}

/** The Replicator set handle a library card of the given kind inserts. */
export function setHandleFor(win, kind, item) {
  if (kind === 'global') {
    return globalSectionSet(win);
  }

  if (kind === 'custom') {
    return item.section_type;
  }

  return item.handle;
}

// Fresh set meta + defaults, per set handle (and `field::set::section` for a
// nested set), cached for the session — the blueprint doesn't change while
// the form is open. The pending promise is what is cached, so concurrent
// callers (a hover prefetch and the click after it) share one request.
// The one cache: `invalidateFieldCaches` (section-fields.js) drops from it.
export const sectionMetaCache = new Map();

/** Fetches (and caches) a set's fresh meta + default values from the addon. */
/**
 * Meta + defaults for a set in a NESTED replicator field (a section's own
 * `blocks`), for the in-preview block inserter. Same endpoint as sections, with a
 * `field` so it resolves the nested replicator instead of the top-level one.
 */
export async function fetchNestedSetMeta(win, field, setHandle, sectionType = '') {
  const key = `${pageBuilderKey(win)}::${field}::${setHandle}::${sectionType}`;

  if (sectionMetaCache.has(key)) {
    return sectionMetaCache.get(key);
  }

  const collection = currentCollection(win);

  if (!collection) {
    return null;
  }

  const pending = (async () => {
    const url =
      `/!/sve/section-meta?collection=${encodeURIComponent(collection)}` +
      `&field=${encodeURIComponent(field)}&set=${encodeURIComponent(setHandle)}` +
      (sectionType ? `&section=${encodeURIComponent(sectionType)}` : '') +
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

/**
 * Registers a new row's meta in a replicator/grid field, so the row renders in
 * the Control Panel form (the sidebar), not only the preview.
 *
 * A nested field's meta lives deep inside the top field's — so we clone the top
 * field's meta, walk into the nested field within the clone, add the row there,
 * and write the whole top field back. `parentPath` is like `page_sections.2.blocks`,
 * or `page_sections` for a section.
 */
export function writeNestedRowMeta(container, values, parentPath, rowId, rowMeta) {
  if (!rowMeta || !rowId || typeof container.setFieldMeta !== 'function') {
    return;
  }

  const fullMeta = unwrapRef(container.meta) || {};
  const segments = parentPath.split('.');
  const topField = segments[0];

  if (!fullMeta[topField]) {
    return;
  }

  const clone = JSON.parse(JSON.stringify(fullMeta[topField]));
  const below = segments.slice(1).join('.');
  // metaForPath walks meta keyed by row _id — pass the top field's own meta and
  // values, and the path below it (e.g. "2.blocks"). A section sits in the top
  // field itself (`page_sections`), so its meta IS the clone: handed an empty
  // path, metaForPath looks up `meta['']`, and a duplicated section landed in
  // values with no meta — the sidebar showed its name and no fields until the
  // page was saved and Live Preview reloaded.
  const nested = below ? metaForPath(clone, dataGet(values, topField), below) : clone;

  if (!nested || typeof nested !== 'object') {
    return;
  }

  nested.existing = { ...(nested.existing || {}), [rowId]: rowMeta };
  container.setFieldMeta(topField, clone);
}

/**
 * Drops a row's meta from a nested replicator/grid field after the row itself
 * was removed from values — keeps `existing` from accumulating orphans.
 */
export function removeNestedRowMeta(container, values, parentPath, rowId) {
  if (!rowId || typeof container.setFieldMeta !== 'function') {
    return;
  }

  const fullMeta = unwrapRef(container.meta) || {};
  const segments = parentPath.split('.');
  const topField = segments[0];

  if (!fullMeta[topField]) {
    return;
  }

  const clone = JSON.parse(JSON.stringify(fullMeta[topField]));
  const nested = metaForPath(clone, dataGet(values, topField), segments.slice(1).join('.'));

  if (!nested?.existing || !(rowId in nested.existing)) {
    return;
  }

  delete nested.existing[rowId];
  container.setFieldMeta(topField, clone);
}

/**
 * Fresh row meta for a grid/replicator row: prefer the field's blank `new`
 * template (what Statamic's own "Add row" uses), else clone a sibling's.
 */
export function rowMetaTemplate(container, values, parentPath, sampleRow) {
  const fullMeta = unwrapRef(container.meta);
  const fieldMeta = fullMeta ? metaForPath(fullMeta, values, parentPath) : null;

  if (!fieldMeta || typeof fieldMeta !== 'object') {
    return null;
  }

  if (fieldMeta.new && typeof fieldMeta.new === 'object') {
    return JSON.parse(JSON.stringify(fieldMeta.new));
  }

  const sampleId = sampleRow?._id;

  if (sampleId && fieldMeta.existing?.[sampleId]) {
    return JSON.parse(JSON.stringify(fieldMeta.existing[sampleId]));
  }

  return null;
}

/**
 * `template="icon|title:Enter a title"` from the preview — starting inner sets
 * for a new row, declared in Antlers where the replicator is used. Same idea as
 * `controls="tag:h1"`: the fieldset stays reusable; the template says what a
 * fresh row contains at this place.
 *
 * Pipe-separated set types, optional `:text` on the field named like the set
 * (`title:Hello`) or `type.field:text`. JSON is accepted too — BlockStudio's
 * InnerBlocks shape `[['title', { title: 'Hello' }]]`.
 */
export function parseSidTemplate(spec) {
  const trimmed = String(spec || '').trim();

  if (!trimmed) {
    return [];
  }

  if (trimmed.startsWith('[')) {
    try {
      const json = JSON.parse(trimmed);

      return (Array.isArray(json) ? json : []).map(normalizeSidTemplateItem).filter(Boolean);
    } catch {
      return [];
    }
  }

  return trimmed
    .split('|')
    .map((part) => {
      const raw = part.trim();

      if (!raw) {
        return null;
      }

      // `3:item` — N starting rows of that set, not a field value named "3".
      const counted = raw.match(/^(\d+):([A-Za-z_][\w-]*)$/);

      if (counted) {
        return { type: counted[2], count: Number(counted[1]) };
      }

      const colon = raw.indexOf(':');

      if (colon === -1) {
        return { type: raw };
      }

      const left = raw.slice(0, colon).trim();
      const value = raw.slice(colon + 1).trim();
      const dot = left.indexOf('.');

      if (dot !== -1) {
        return { type: left.slice(0, dot), field: left.slice(dot + 1), value };
      }

      return { type: left, field: left, value };
    })
    .filter(Boolean);
}

export function normalizeSidTemplateItem(raw) {
  if (typeof raw === 'string') {
    return raw.trim() ? { type: raw.trim() } : null;
  }

  if (Array.isArray(raw)) {
    const type = String(raw[0] || '')
      .trim()
      .replace(/^core\//, '');

    if (!type) {
      return null;
    }

    const attrs = raw[1] && typeof raw[1] === 'object' && !Array.isArray(raw[1]) ? { ...raw[1] } : {};

    delete attrs.placeholder;

    return { type, attrs };
  }

  if (raw && typeof raw === 'object' && typeof raw.type === 'string') {
    const { type, ...attrs } = raw;

    return { type, attrs };
  }

  return null;
}

export function isBardValue(value) {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value[0] &&
    typeof value[0] === 'object' &&
    ['paragraph', 'heading', 'text', 'set', 'bulletList', 'orderedList'].includes(value[0].type)
  );
}

export function looksLikeBardSpec(spec) {
  return typeof spec === 'string' && /^(heading:\d+:|paragraph:|h[1-6]:)/i.test(spec.trim());
}

export function specToBard(spec) {
  if (Array.isArray(spec)) {
    return spec;
  }

  return String(spec)
    .split('|')
    .map((part) => {
      const p = part.trim();
      const heading = p.match(/^heading:([1-6]):(.*)$/i) || p.match(/^h([1-6]):(.*)$/i);

      if (heading) {
        const text = heading[2];

        return {
          type: 'heading',
          attrs: { level: Number(heading[1]) },
          content: text ? [{ type: 'text', text }] : [],
        };
      }

      if (/^paragraph:/i.test(p)) {
        const text = p.slice(p.indexOf(':') + 1);

        return { type: 'paragraph', content: text ? [{ type: 'text', text }] : [] };
      }

      return { type: 'paragraph', content: p ? [{ type: 'text', text: p }] : [] };
    });
}

export function coerceSidValue(current, spec) {
  if (isBardValue(current) || looksLikeBardSpec(spec)) {
    return specToBard(spec);
  }

  return spec;
}

export function applySidFieldDefaults(row, defaults) {
  if (!row || !defaults || typeof defaults !== 'object') {
    return;
  }

  for (const [handle, value] of Object.entries(defaults)) {
    if (handle === 'type' || value == null || value === '') {
      continue;
    }

    const current = row[handle];
    const blank =
      current === undefined || current === null || current === '' || (Array.isArray(current) && !current.length);

    if (blank) {
      row[handle] = coerceSidValue(current, value);
    }
  }
}

export function assignSidTemplateValues(row, item, fieldDefaults) {
  if (item.attrs && typeof item.attrs === 'object') {
    for (const [key, value] of Object.entries(item.attrs)) {
      if (key === 'type' || key === 'placeholder' || value == null) {
        continue;
      }

      row[key] = coerceSidValue(row[key], value);
    }
  }

  const field = item.field || item.type;

  if (item.value != null && item.value !== '' && field) {
    row[field] = coerceSidValue(row[field], item.value);
  }

  applySidFieldDefaults(row, fieldDefaults);
}

export function nestedReplicatorHandle(row, metaNew) {
  const keys = new Set();

  if (row && typeof row === 'object') {
    for (const [key, value] of Object.entries(row)) {
      if (['id', '_id', '_visual_id', 'type', 'enabled'].includes(key)) {
        continue;
      }

      if (Array.isArray(value)) {
        keys.add(key);
      }
    }
  }

  if (metaNew && typeof metaNew === 'object') {
    for (const [key, value] of Object.entries(metaNew)) {
      if (value && typeof value === 'object' && !Array.isArray(value) && 'existing' in value) {
        keys.add(key);
      }
    }
  }

  const list = [...keys];

  if (list.includes('blocks')) {
    return 'blocks';
  }

  return list[0] || null;
}

export async function buildSidTemplateRow(win, field, item, fieldDefaults) {
  const meta = await fetchNestedSetMeta(win, field, item.type);
  const rowId = newRowId();
  const row = {
    ...(meta?.defaults ? JSON.parse(JSON.stringify(meta.defaults)) : {}),
    _id: rowId,
    _visual_id: newUuid(win),
    type: item.type,
  };

  assignSidTemplateValues(row, item, fieldDefaults);

  return { row, meta: meta?.new ? JSON.parse(JSON.stringify(meta.new)) : {} };
}

export function attachSidNestedMeta(parentMeta, nestedField, nestedBuilt) {
  if (!parentMeta || !nestedField || !nestedBuilt.length) {
    return parentMeta;
  }

  parentMeta[nestedField] = parentMeta[nestedField] || { existing: {} };
  parentMeta[nestedField].existing = { ...(parentMeta[nestedField].existing || {}) };

  for (const built of nestedBuilt) {
    parentMeta[nestedField].existing[built.row._id] = built.meta || {};
  }

  return parentMeta;
}

/**
 * Fill a newly created row from an Antlers `template` / `default`.
 *
 * `template="icon|title"` — inner sets for this row (typically `blocks`).
 * `template="3:item"` on the parent — N child rows, each filled from
 * `rowTemplate` (the `<li>`'s `template="icon|title"`).
 */
export async function applySidTemplate(
  win,
  row,
  template,
  fieldDefaults,
  parentMeta,
  rowTemplate = '',
  fieldTemplates = {}
) {
  const items = parseSidTemplate(template);
  const nested = [];
  let nestedField = null;

  if (items.some((item) => item.count)) {
    const nestedHandle = nestedReplicatorHandle(row, parentMeta);

    if (nestedHandle) {
      nestedField = nestedHandle;

      for (const spec of items) {
        const times = spec.count || 1;

        for (let n = 0; n < times; n++) {
          const built = await buildSidTemplateRow(win, nestedHandle, { type: spec.type }, fieldDefaults);
          const inner = await applySidTemplate(
            win,
            built.row,
            rowTemplate,
            fieldDefaults,
            built.meta,
            '',
            fieldTemplates
          );
          const meta = attachSidNestedMeta(built.meta, inner.nestedField, inner.nested);

          nested.push({ row: inner.row, meta: meta || built.meta });
        }
      }

      row[nestedHandle] = nested.map((built) => built.row);
    } else {
      applySidFieldDefaults(row, fieldDefaults);
    }
  } else if (items.length) {
    const types = items.map((item) => item.type);
    const nestedHandle = nestedReplicatorHandle(row, parentMeta);

    if (nestedHandle && row.type && !types.includes(row.type)) {
      nestedField = nestedHandle;

      for (const item of items) {
        nested.push(await buildSidTemplateRow(win, nestedHandle, item, fieldDefaults));
      }

      row[nestedHandle] = nested.map((built) => built.row);
    } else {
      const match = items.find((item) => item.type === row.type) || (items.length === 1 ? items[0] : null);

      if (match) {
        assignSidTemplateValues(row, match, fieldDefaults);
      } else {
        applySidFieldDefaults(row, fieldDefaults);
      }
    }
  } else {
    applySidFieldDefaults(row, fieldDefaults);
  }

  if (nested.length && fieldTemplates && typeof fieldTemplates === 'object') {
    for (let i = 0; i < nested.length; i++) {
      const spec = fieldTemplates[nested[i].row?.type];

      if (!spec || !(spec.template || spec.rowTemplate)) {
        continue;
      }

      const inner = await applySidTemplate(
        win,
        nested[i].row,
        spec.template || '',
        fieldDefaults,
        nested[i].meta || {},
        spec.rowTemplate || '',
        fieldTemplates
      );

      nested[i] = {
        row: inner.row,
        meta: attachSidNestedMeta(nested[i].meta, inner.nestedField, inner.nested) || nested[i].meta,
      };
    }

    if (nestedField) {
      row[nestedField] = nested.map((built) => built.row);
    }
  }

  return { row, nested, nestedField };
}

export function countedTemplateTypes(template) {
  return parseSidTemplate(template)
    .filter((item) => item.count)
    .map((item) => item.type);
}

export function sectionTypeFromPath(values, parentPath) {
  const parts = String(parentPath || '').split('.');

  if (parts.length < 2 || !Number.isInteger(Number(parts[1]))) {
    return '';
  }

  const section = dataGet(values, `${parts[0]}.${parts[1]}`);

  return section && typeof section === 'object' ? String(section.type || '') : '';
}

export async function overlaySidTemplate(
  win,
  container,
  _values,
  parentPath,
  added,
  template,
  fieldDefaults,
  rowTemplate = ''
) {
  if (!added?._id) {
    return;
  }

  const values = unwrapRef(container.values);

  const rows = dataGet(values, parentPath);

  if (!Array.isArray(rows)) {
    return;
  }

  const index = rows.findIndex((row) => row && row._id === added._id);

  if (index < 0) {
    return;
  }

  const sectionType = sectionTypeFromPath(values, parentPath);
  const field = parentPath.slice(parentPath.lastIndexOf('.') + 1);
  const addedMeta = added.type && field ? await fetchNestedSetMeta(win, field, added.type, sectionType) : null;

  // `3:item` seeds a new *list*. A single new *item* (the native picker, or +
  // on an empty ul) should only get the row template — icon|title — not 3 rows.
  let applyTemplate = template || addedMeta?.template || '';
  let applyRowTemplate = rowTemplate || addedMeta?.rowTemplate || '';

  if (added.type && countedTemplateTypes(applyTemplate).includes(added.type)) {
    applyTemplate = applyRowTemplate;
    applyRowTemplate = '';
  }

  if (!applyTemplate && !applyRowTemplate && !(fieldDefaults && Object.keys(fieldDefaults).length)) {
    return;
  }

  const row = JSON.parse(JSON.stringify(rows[index]));
  const parentMeta =
    (addedMeta?.new ? JSON.parse(JSON.stringify(addedMeta.new)) : null) ||
    rowMetaTemplate(container, values, parentPath, row) ||
    {};
  const built = await applySidTemplate(
    win,
    row,
    applyTemplate,
    fieldDefaults,
    parentMeta,
    applyRowTemplate,
    addedMeta?.fieldTemplates || {}
  );
  const next = JSON.parse(JSON.stringify(rows));

  next[index] = built.row;
  container.setFieldValue(parentPath, next);

  if (built.nestedField && built.nested.length) {
    const updated = unwrapRef(container.values);
    const rowPath = `${parentPath}.${index}`;
    const fullMeta = unwrapRef(container.meta) || {};
    const segments = rowPath.split('.');
    const topField = segments[0];

    if (!fullMeta[topField] || typeof container.setFieldMeta !== 'function') {
      return;
    }

    const clone = JSON.parse(JSON.stringify(fullMeta[topField]));
    const rowMeta = metaForPath(clone, dataGet(updated, topField), segments.slice(1).join('.'));

    if (!rowMeta) {
      return;
    }

    attachSidNestedMeta(rowMeta, built.nestedField, built.nested);
    container.setFieldMeta(topField, clone);
  }
}
