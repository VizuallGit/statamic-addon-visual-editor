/**
 * From a row's id to what Statamic needs to draw that row's fields.
 *
 * Statamic draws a Replicator set, a Bard set or a Grid row from three things:
 * the field definitions of the set (`config.fields`), the dotted path of the
 * row in the form's values (`page_sections.3.blocks.0`; a Bard set's
 * `text.2.attrs.values`) and the dotted path of its meta
 * (`page_sections.existing.<id>.blocks.existing.<id>`). Its own Set and Row
 * components build those on the way down the tree; this file builds the same
 * three for one row, from the top, so the row can be drawn on its own.
 *
 * Pure: values in, result out. The blueprint is the container's publish
 * array (`ctx.blueprint`), the one the form was built from. No DOM, no window.
 *
 * May import: lib/values.js.
 */
import { dataGet, findPathByUid, humanizeHandle } from '../../lib/values.js';

/** Every field of a publish blueprint, in order, whichever shape the blueprint has. */
export function blueprintFields(blueprint) {
  if (!blueprint || typeof blueprint !== 'object') {
    return [];
  }

  if (Array.isArray(blueprint.fields)) {
    return blueprint.fields;
  }

  const tabs = Array.isArray(blueprint.tabs) ? blueprint.tabs : [];
  const sections = tabs.flatMap((tab) => (Array.isArray(tab.sections) ? tab.sections : []))
    .concat(Array.isArray(blueprint.sections) ? blueprint.sections : []);

  return sections.flatMap((section) => (Array.isArray(section.fields) ? section.fields : []));
}

/** A replicator field's sets as one flat list, grouped or not. */
export function setsOf(field) {
  const groups = Array.isArray(field?.sets) ? field.sets : [];

  return groups.flatMap((group) => (Array.isArray(group?.sets) ? group.sets : [group]));
}

/** The id a row answers to in the preview and the tree. */
export function rowUid(row) {
  if (!row || typeof row !== 'object') {
    return null;
  }

  return row._visual_id || row.id || row._id || null;
}

/** Whether a field type keeps rows (sets) with a `type` each. */
function holdsSets(field) {
  return field?.type === 'replicator' || field?.type === 'sve_lite_sections';
}

/**
 * A Bard set is a ProseMirror node: `{ type: 'set', attrs: { id, enabled,
 * values: { type, … } } }`. The row Statamic draws is `attrs.values`, at
 * `field.N.attrs.values` in the values and `field.existing.<attrs.id>` in the
 * meta (bard/Set.vue). Its path therefore has two more segments than a
 * replicator row's, and the `_id` that keys its meta sits on the node, not
 * on the row.
 */
function bardRow(field, node, index) {
  const list = node?.[field];
  const item = Array.isArray(list) && /^\d+$/.test(index) ? list[Number(index)] : null;
  const row = item?.type === 'set' && item.attrs && typeof item.attrs.values === 'object' ? item.attrs.values : null;

  return row ? { row, id: item.attrs.id } : null;
}

/**
 * Resolve one row.
 *
 * @returns {null | {
 *   uid: string,
 *   path: string,            values path of the row ("page_sections.3.blocks.0")
 *   metaPath: string,        meta path of the row ("page_sections.existing.a.blocks.existing.b")
 *   fields: Array,           the field definitions Statamic draws
 *   kind: 'set' | 'grid',
 *   handle: string,          set handle, or the grid field's handle
 *   display: string,         what the row is called (its own label first)
 *   icon: string | null,     the set's icon as the blueprint names it
 *   instructions: string,
 *   row: object,
 *   parentUid: string | null row one level up, when there is one
 * }}
 */
export function resolveRow(values, blueprint, uid, why = () => {}) {
  if (!values || typeof values !== 'object' || !uid) {
    why('no values or no uid');

    return null;
  }

  const path = findPathByUid(values, uid);

  if (path === null || path === '') {
    why(`uid not in values (${Object.keys(values).length} keys)`);

    return null;
  }

  // A row path alternates field, index, field, index … — a Bard set adds
  // `attrs.values` after its index, which is folded away here and told
  // apart below by the field's type.
  const segments = path.split('.').filter((part, i, all) => !(part === 'attrs' && all[i + 1] === 'values') && !(part === 'values' && all[i - 1] === 'attrs'));

  if (segments.length % 2 !== 0) {
    why(`odd path ${path}`);

    return null;
  }

  let fields = blueprintFields(blueprint);
  let node = values;
  let metaPath = '';
  let parentUid = null;
  let result = null;

  for (let i = 0; i < segments.length; i += 2) {
    const handle = segments[i];
    const index = segments[i + 1];
    const field = fields.find((candidate) => candidate?.handle === handle);
    const list = node?.[handle];
    const bard = field?.type === 'bard' ? bardRow(handle, node, index) : null;
    const row = bard ? bard.row : Array.isArray(list) && /^\d+$/.test(index) ? list[Number(index)] : null;

    if (!field || !row || typeof row !== 'object') {
      why(`at ${handle}.${index}: field=${!!field} row=${!!row} (fields: ${fields.map((f) => f?.handle).join(',')})`);

      return null;
    }

    metaPath = `${metaPath ? `${metaPath}.` : ''}${handle}.existing.${bard ? bard.id : row._id}`;

    let kind;
    let config;

    if (field.type === 'grid') {
      kind = 'grid';
      config = field;
      fields = Array.isArray(field.fields) ? field.fields : [];
    } else if (holdsSets(field) || bard) {
      const set = setsOf(field).find((candidate) => candidate?.handle === row.type);

      if (!set) {
        why(`no set ${row.type} in ${handle}`);

        return null;
      }

      kind = 'set';
      config = set;
      fields = Array.isArray(set.fields) ? set.fields : [];
    } else {
      why(`field ${handle} is a ${field.type}`);

      return null;
    }

    if (i + 2 < segments.length) {
      parentUid = rowUid(row);
    } else {
      const own = typeof row._sve_label === 'string' ? row._sve_label.trim() : '';

      result = {
        uid,
        // The values path as found: a Bard row's keeps its `attrs.values`.
        path,
        metaPath,
        fields,
        kind,
        handle: config.handle || field.handle,
        display: own || config.display || humanizeHandle(config.handle || field.handle),
        icon: config.icon || null,
        instructions: config.instructions || '',
        row,
        parentUid,
      };
    }

    node = row;
  }

  return result;
}

/**
 * A whole tab of a form — the header's fields, the footer's — as something the
 * panel can draw: its fields at the top of the values, no row around them.
 * Found by handle first, then by a display name that starts with the handle
 * (a site's own blueprint says "Header" where the editor says `header`).
 */
export function resolveTab(blueprint, handle) {
  const tabs = Array.isArray(blueprint?.tabs) ? blueprint.tabs : [];
  const want = String(handle || '').toLowerCase();

  if (!want || !tabs.length) {
    return null;
  }

  const tab =
    tabs.find((candidate) => String(candidate?.handle || '').toLowerCase() === want) ||
    tabs.find((candidate) => String(candidate?.display || '').toLowerCase().startsWith(want)) ||
    (tabs.length === 1 ? tabs[0] : null);

  if (!tab) {
    return null;
  }

  const sections = Array.isArray(tab.sections) ? tab.sections : [];

  return {
    uid: null,
    path: '',
    metaPath: '',
    fields: sections.flatMap((section) => (Array.isArray(section?.fields) ? section.fields : [])),
    kind: 'tab',
    handle: tab.handle || want,
    display: tab.display || humanizeHandle(tab.handle || want),
    icon: null,
    instructions: tab.instructions || '',
    row: null,
    parentUid: null,
  };
}

/** The row's values, for a reader that has the path but not the row. */
export function rowAt(values, path) {
  return dataGet(values, path);
}
