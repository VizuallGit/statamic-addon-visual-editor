/**
 * The variable catalogue behind the dock's Data button.
 *
 * Names and labels come from the server (blueprints, global sets); the values
 * shown next to them come from the form that is open, so what you read in the
 * menu is what the preview is rendering — including edits not yet saved.
 *
 * Isolated: fetch plus plain objects. No overlay, editor or bridge.
 */

const cache = new Map();

/** Nothing to offer — a failed fetch reads the same as a section with no fields. */
const EMPTY = { scope: null, section: [], page: [], site: [] };

/** The collection being edited, read from the CP URL — same rule as the library. */
export function dataVarsCollection(win) {
  const match = win?.location?.pathname?.match(/\/collections\/([^/]+)\//);

  return match ? match[1] : '';
}

/**
 * `custom_section/style_1` is the set handle itself — the slash is part of the
 * name, not a path. Header, footer and collection views have no set, and get
 * an empty Section tab rather than a wrong one.
 */
export function dataVarsSet(type) {
  const handle = String(type || '').trim();

  return !handle || /^(header|footer)\//.test(handle) ? '' : handle;
}

/**
 * The loop chain as one query value: `collection:services|field:gallery`.
 *
 * One value rather than a list of parameters, because it is one fact — where in
 * the template the picker was opened — and it has to survive a cache key, which
 * is a string either way.
 */
export function dataVarsScope(chain) {
  return (Array.isArray(chain) ? chain : [])
    .filter((step) => step?.handle)
    .map((step) => `${step.kind === 'collection' ? 'collection' : 'field'}:${step.handle}`)
    .join('|');
}

export function dataVarsKey({ collection, set, view, scope }) {
  return `${collection}::${set}::${view || ''}::${scope || ''}`;
}

export function cachedDataVars(key) {
  return cache.get(key) || null;
}

export function fetchDataVars(win, { collection, set, view, scope }) {
  const key = dataVarsKey({ collection, set, view, scope });
  const hit = cache.get(key);

  if (hit) {
    return Promise.resolve(hit);
  }

  const query = new URLSearchParams();

  if (collection) {
    query.set('collection', collection);
  }

  if (set) {
    query.set('set', set);
  }

  if (view) {
    query.set('view', view);
  }

  if (scope) {
    query.set('scope', scope);
  }

  return win
    .fetch(`/!/sve/data-vars?${query.toString()}`, {
      credentials: 'same-origin',
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
    })
    .then((res) => (res.ok ? res.json() : null))
    .then((json) => {
      const data = json && typeof json === 'object' ? json : EMPTY;

      cache.set(key, data);

      return data;
    })
    .catch(() => EMPTY);
}

/** Forget everything — a blueprint or a global can change while the dock is open. */
export function resetDataVars() {
  cache.clear();
}

/** A value shortened to one row of a menu. Mirrors DataVars::preview() in PHP. */
export function previewValue(value) {
  if (value == null || value === '') {
    return '';
  }

  if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  }

  if (Array.isArray(value)) {
    return value.length ? `${value.length} ×` : '';
  }

  if (typeof value === 'object') {
    // Bard and asset fields arrive as objects; a count says more than `[object]`.
    const count = Object.keys(value).length;

    return count ? `${count} ×` : '';
  }

  const text = String(value).replace(/\s+/g, ' ').trim();

  return text.length > 60 ? `${text.slice(0, 60)}…` : text;
}

/** Follow a dotted path — `link.url` — without throwing on a missing step. */
function valueAt(values, path) {
  return path.split('.').reduce((at, key) => (at && typeof at === 'object' ? at[key] : undefined), values);
}

/**
 * Fill in what the open form holds.
 *
 * Rows with a `parent` live inside a loop: they have one value per row and no
 * single one of them is *the* value, so they are left alone. Tag syntax
 * (`collection:handle`) is not a path into the form either.
 */
export function withValues(rows, values) {
  if (!Array.isArray(rows) || !values || typeof values !== 'object') {
    return rows || [];
  }

  return rows.map((row) => {
    if (row.parent || row.value != null || row.var.includes(':')) {
      return row;
    }

    const preview = previewValue(valueAt(values, row.var));

    return preview ? { ...row, value: preview } : row;
  });
}

/** The same, group by group — for the Page tab. */
export function groupsWithValues(groups, values) {
  if (!Array.isArray(groups)) {
    return [];
  }

  return groups.map((group) => ({ ...group, items: withValues(group.items, values) }));
}

/**
 * What picking a row writes.
 *
 * A field you loop over gets its pair with the cursor between them, because
 * `{{ image }}` alone renders nothing useful. Everything else is one tag. Rows
 * that live inside a loop print as the bare handle — which is right, since that
 * is where you are when you write them.
 */
export function dataVarSnippet(row, group) {
  const name = String(row?.var || '').trim();

  if (!name) {
    return null;
  }

  if (row.loop) {
    return { text: `{{ ${name} }}\n  \n{{ /${name} }}`, cursor: `{{ ${name} }}\n  `.length };
  }

  // A collection group's fields only resolve inside its loop, so the first pick
  // from one brings the loop with it.
  if (group?.loop && !row.parent) {
    const tag = group.loop;

    return {
      text: `{{ ${tag} }}\n  {{ ${name} }}\n{{ /${tag} }}`,
      cursor: `{{ ${tag} }}\n  {{ ${name} }}`.length,
    };
  }

  return { text: `{{ ${name} }}`, cursor: `{{ ${name} }}`.length };
}
