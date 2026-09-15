/**
 * Fields on a component, and their values at each place it is used.
 *
 * Two halves of one idea. The *declaration* — name, kind, default — belongs to
 * the component and rides in its file as an Antlers comment. The *values*
 * belong to the call: `{{ partial:components/card headline="Hi" }}`. Antlers
 * hands a partial's parameters to it as plain variables, so the same card in
 * three places is three calls with three sets of values, and nothing had to be
 * invented to store them.
 *
 * That is also why none of this can slow a page down. A rendered page reads a
 * partial call, which it already did; the declaration is a comment the parser
 * throws away. Everything here runs in the Control Panel.
 */

const cache = new Map();

export function componentPropsOn(win) {
  return win?.Statamic?.$config?.get?.('sveFeatures')?.component_props === true;
}

/**
 * What a component declares. One fetch per component per session — the answer
 * only changes when the component itself is saved, and that reloads the dock.
 */
export function fetchComponentProps(win, src) {
  const key = String(src || '');

  if (!key) {
    return Promise.resolve([]);
  }

  if (!cache.has(key)) {
    cache.set(
      key,
      win
        .fetch(`/!/sve/component-props?src=${encodeURIComponent(key)}`, {
          credentials: 'same-origin',
          headers: { 'X-Requested-With': 'XMLHttpRequest' },
        })
        .then((res) => (res.ok ? res.json() : { props: [] }))
        .then((data) => (Array.isArray(data.props) ? data.props : []))
        .catch(() => [])
    );
  }

  return cache.get(key);
}

/** A component that was just saved has to be asked again. */
export function forgetComponentProps(src) {
  if (src) {
    cache.delete(String(src));
  } else {
    cache.clear();
  }
}

/* ------------------------------------------------------------------ *
 * Reading and writing the call
 * ------------------------------------------------------------------ */

/**
 * What every prop is called once it reaches Antlers.
 *
 * Mirrors `ComponentProps::PREFIX` — the panel and the declaration keep the
 * short handle, the call and the template carry the prefixed one. A partial is
 * handed the whole scope it was called from, so a prop named `headline` and a
 * section field named `headline` were one name with two meanings, and the
 * section's won.
 */
export const PROP_PREFIX = 'props_';

/** The parameter name a prop is written as. */
export function propParam(handle) {
  return PROP_PREFIX + String(handle || '');
}

/** The prop a parameter belongs to, prefixed or written before there was one. */
export function propHandle(param) {
  const name = String(param || '');

  return name.startsWith(PROP_PREFIX) ? name.slice(PROP_PREFIX.length) : name;
}

/** `name="value"` and `:name="expr"` inside one tag, with where each sits. */
const PARAM = /(^|\s)(:?)([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(["'])([\s\S]*?)\4/g;

/**
 * The parameters a partial call carries.
 *
 * `src` and `handle` are the call's own plumbing, not fields, so they never
 * come back as values however the tag was written.
 *
 * @returns {Map<string, {bound: boolean, value: string, from: number, to: number}>}
 */
export function readCallParams(tag) {
  const text = String(tag || '');
  const out = new Map();

  PARAM.lastIndex = 0;

  let match;

  while ((match = PARAM.exec(text))) {
    const handle = match[3];

    if (handle === 'src' || handle === 'handle') {
      continue;
    }

    out.set(handle, {
      bound: match[2] === ':',
      value: match[5],
      from: match.index + match[1].length,
      to: match.index + match[0].length,
    });
  }

  return out;
}

/**
 * One parameter written into a call, and nothing else touched.
 *
 * An empty value takes the parameter out rather than writing `headline=""`:
 * a field left blank means "whatever the component falls back to", and an
 * empty string is not that.
 *
 * `bound` is the difference between a value and a binding — `headline="Hi"`
 * against `:headline="title"` — which is Antlers' own distinction, not one
 * invented here.
 */
export function writeCallParam(html, row, handle, value, { bound = false } = {}) {
  const source = String(html || '');

  if (!row || row.from == null || row.to == null || !handle) {
    return source;
  }

  const tag = source.slice(row.from, row.to);

  // The offsets came from a parse of this text. If the pane has moved on since,
  // splicing by them would cut the wrong bytes.
  if (!tag.startsWith('{{') || !tag.endsWith('}}')) {
    return source;
  }

  const existing = readCallParams(tag).get(handle);
  const clean = String(value ?? '').trim();
  const quote = clean.includes('"') ? "'" : '"';
  const written = clean === '' ? '' : `${bound ? ':' : ''}${handle}=${quote}${clean}${quote}`;

  let next;

  if (existing) {
    const before = tag.slice(0, existing.from);
    const after = tag.slice(existing.to);

    // Taking the last parameter out leaves the space that was in front of it.
    next = written === '' ? `${before.replace(/\s+$/, ' ')}${after.replace(/^\s+/, '')}` : `${before}${written}${after}`;
  } else if (written === '') {
    return source;
  } else {
    next = `${tag.slice(0, -2).replace(/\s+$/, '')} ${written} }}`;
  }

  return source.slice(0, row.from) + next + source.slice(row.to);
}

/**
 * The rows the panel draws for one call: what the component declares, with
 * whatever this place has said about each.
 */
export function valueRows(props, tag) {
  const params = readCallParams(tag);

  return (props || []).map((prop) => {
    const set = params.get(propParam(prop.handle)) || params.get(prop.handle);

    return {
      handle: prop.handle,
      label: prop.label || prop.handle,
      type: prop.type || 'text',
      options: Array.isArray(prop.options) ? prop.options : [],
      value: set ? set.value : '',
      bound: !!set?.bound,
      placeholder: prop.default || '',
    };
  });
}

/**
 * One prop written into a call, under its prefixed name.
 *
 * A call written before the prefix says `headline="Hi"`. Writing the new
 * spelling next to it would leave the call carrying both, which reads as two
 * fields in the HTML pane and is one — so the old parameter comes out in the
 * same pass that puts the new one in.
 */
export function writePropParam(html, row, handle, value, { bound = false } = {}) {
  const source = String(html || '');

  if (!row || row.from == null || row.to == null || !handle) {
    return source;
  }

  let next = source;
  let to = row.to;

  if (readCallParams(next.slice(row.from, to)).has(handle)) {
    const before = next.length;

    next = writeCallParam(next, { from: row.from, to }, handle, '');
    to += next.length - before;
  }

  return writeCallParam(next, { from: row.from, to }, propParam(handle), value, { bound });
}
