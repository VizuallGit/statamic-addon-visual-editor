/**
 * Reading Statamic's publish values from the outside.
 *
 * Values arrive as Vue refs and nested arrays of sets; every panel needs the
 * same four moves on them. One place, no `sve` hop.
 *
 * May import: nothing.
 */

/** A Vue ref's value, or the value itself when it is not a ref. */
export function unwrapRef(v) {
  return v && v.__v_isRef ? v.value : v;
}

/**
 * `dataGet(values, 'page_sections.0.headline')` — dotted path, undefined when
 * absent. An empty path is the object itself (the root row's own path).
 */
export function dataGet(obj, path) {
  if (!path) {
    return obj;
  }

  return path.split('.').reduce((acc, key) => (acc == null ? undefined : acc[key]), obj);
}

/**
 * The dotted path to the set whose id / `_id` / `_visual_id` is `uid`, or
 * null. This is how a `data-sid` in the preview becomes a field path.
 */
export function findPathByUid(value, uid, path = '') {
  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      const found = findPathByUid(value[i], uid, path ? `${path}.${i}` : String(i));

      if (found !== null) {
        return found;
      }
    }

    return null;
  }

  if (value && typeof value === 'object') {
    if (value._visual_id === uid || value.id === uid || value._id === uid) {
      return path;
    }

    for (const key of Object.keys(value)) {
      const found = findPathByUid(value[key], uid, path ? `${path}.${key}` : key);

      if (found !== null) {
        return found;
      }
    }
  }

  return null;
}

/** The first entry id in an entries field value: a string, a list of ids, or a list of {id}. */
export function firstEntryId(value) {
  if (typeof value === 'string' && value !== '') {
    return value;
  }

  if (Array.isArray(value) && value.length) {
    const first = value[0];

    if (typeof first === 'string' && first !== '') {
      return first;
    }

    if (first && typeof first === 'object' && typeof first.id === 'string') {
      return first.id;
    }
  }

  return '';
}

/** `hero/style_1` → "Style 1", `bg_color` → "Bg color": a handle as a label. */
export function humanizeHandle(handle) {
  const name = String(handle || '').split('/').pop().replace(/[-_]+/g, ' ').trim();

  return name ? name.charAt(0).toUpperCase() + name.slice(1) : '';
}

/**
 * Deepest dotted path to `handle` under `node` (children before self), so a
 * section that wraps a headline block resolves to the block field — not a
 * missing `section.headline`.
 */
export function deepestFieldPath(node, handle, path = '') {
  if (node == null || typeof handle !== 'string' || !handle) {
    return null;
  }

  const field = handle.includes('.') ? handle.split('.').pop() : handle;

  if (Array.isArray(node)) {
    for (let i = 0; i < node.length; i++) {
      const found = deepestFieldPath(node[i], field, path ? `${path}.${i}` : String(i));

      if (found) {
        return found;
      }
    }

    return null;
  }

  if (typeof node !== 'object') {
    return null;
  }

  for (const [key, value] of Object.entries(node)) {
    if (key === field) {
      continue;
    }

    const found = deepestFieldPath(value, field, path ? `${path}.${key}` : key);

    if (found) {
      return found;
    }
  }

  if (Object.prototype.hasOwnProperty.call(node, field)) {
    return path ? `${path}.${field}` : field;
  }

  return null;
}
