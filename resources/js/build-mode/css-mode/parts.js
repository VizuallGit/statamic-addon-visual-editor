/**
 * The values several Style fields share one CSS property for: `filter` holds a
 * blur and a contrast, `translate` an x and a y, `background-image` a gradient's
 * direction and stops. Read and written here as parts of the one value.
 *
 * Owner: Build mode, the CSS mode demo (resources/js/build-mode/css-mode/).
 * May import: css-mode/rules.js. Pure: strings and plain objects in and out.
 * Bus messages: none.
 *
 * Tailwind keeps each part in a variable of its own, so a blur at Tablet leaves
 * the plain contrast standing. Plain CSS has one value, which replaces the wider
 * size's whole. So a place's value is written whole, what reaches it included,
 * and read back the other way: what a place sets itself is what differs from what
 * reaches it. A part changed at a wider size follows down to the narrower ones.
 * The order is the same as for a class: a size's own, then a state at that size.
 *
 * A value this cannot take apart (`none`, a field's `{{ tag }}`, an image) stands
 * as it was written, reaches nothing, and is only replaced by a write to that very place.
 */

import { declarationsAt, treeOf, writeDeclarations } from './rules.js';

/** Text split where `by` stands outside parentheses and quotes. */
export function splitTop(text, by) {
  const source = String(text || '');
  const out = [];
  let depth = 0;
  let quote = '';
  let start = 0;

  for (let i = 0; i < source.length; i += 1) {
    const ch = source[i];

    if (quote) {
      quote = ch === quote ? '' : quote;
    } else if (ch === '"' || ch === "'") {
      quote = ch;
    } else if (ch === '(') {
      depth += 1;
    } else if (ch === ')') {
      depth -= 1;
    } else if (depth === 0 && (by === ' ' ? /\s/.test(ch) : ch === by)) {
      out.push(source.slice(start, i));
      start = i + 1;
    }
  }

  out.push(source.slice(start));

  return out.map((part) => part.trim()).filter(Boolean);
}

/** `blur(8px) contrast(150%)`: a part per function. Two of one (`drop-shadow`) are one part. */
const functions = {
  parse(value) {
    const list = splitTop(value, ' ');
    const out = new Map();

    if (!list.length || list.some((one) => !/^[a-zA-Z-]+\(.*\)$/.test(one) || one.startsWith('var('))) {
      return null;
    }

    for (const one of list) {
      const key = one.slice(0, one.indexOf('('));

      out.set(key, out.has(key) ? `${out.get(key)} ${one}` : one);
    }

    return out;
  },
  render: (parts) => [...parts.values()].join(' ') || null,
  neutral: () => false,
  /* What says "no blur" at a place a blur reaches; the others have a value that says it. */
  off: { blur: 'blur(0)', 'drop-shadow': 'drop-shadow(0 0 #0000)' },
};

const translate = {
  parse(value) {
    const list = splitTop(value, ' ');

    return list.length && list.length < 3 && list[0] !== 'none'
      ? new Map(list.map((one, i) => [i ? 'y' : 'x', one]))
      : null;
  },
  render(parts) {
    const { x, y } = Object.fromEntries(parts);

    return x || y ? [x || '0', ...(y ? [y] : [])].join(' ') : null;
  },
  neutral: (key, value) => /^0([a-z%]*)$/.test(value),
};

const scale = {
  parse(value) {
    const list = splitTop(value, ' ');

    if (!list.length || list.length > 2 || list[0] === 'none') {
      return null;
    }

    return new Map([
      ['x', list[0]],
      ['y', list[1] || list[0]],
    ]);
  },
  render(parts) {
    const { x, y } = Object.fromEntries(parts);

    if (!x && !y) {
      return null;
    }

    return (x || '100%') === (y || '100%') ? x || y : `${x || '100%'} ${y || '100%'}`;
  },
  neutral: (key, value) => value === '100%' || value === '1',
};

const DIRECTION = /^(to\s|-?[\d.]+(deg|turn|rad|grad)\b)/;

/** `linear-gradient(to right, a, b, c)`: a direction, and up to three stops. Anything else is not ours to take apart. */
const gradient = {
  parse(value) {
    const match = /^linear-gradient\((.*)\)$/s.exec(String(value || '').trim());
    const args = match ? splitTop(match[1], ',') : [];
    const position = DIRECTION.test(args[0] || '') ? args.shift() : '';

    if (args.length < 2 || args.length > 3) {
      return null;
    }

    const out = new Map();

    if (position) {
      out.set('position', position);
    }

    out.set('from', args[0]);

    if (args.length === 3) {
      out.set('via', args[1]);
    }

    out.set('to', args[args.length - 1]);

    return out;
  },
  render(parts) {
    const { position, from, via, to } = Object.fromEntries(parts);

    if (!position && !from && !via && !to) {
      return null;
    }

    return `linear-gradient(${[position || 'to bottom', from || 'transparent', ...(via ? [via] : []), to || 'transparent'].join(', ')})`;
  },
  neutral: (key, value) => value === 'transparent',
};

const COMPOSITES = {
  filter: functions,
  'backdrop-filter': functions,
  transform: functions,
  translate,
  scale,
  'background-image': gradient,
};

export const PART_PROPS = Object.keys(COMPOSITES);
export const isPartProp = (prop) => Object.hasOwn(COMPOSITES, prop);

/** The parts of a value, or null when it is not one this can take apart. */
export const partsOf = (prop, value) => (String(value).includes('{{') ? null : COMPOSITES[prop].parse(value));

/* ---------------- the places a value stands ---------------- */

/** The sizes in cascade order: the rule outside every block, then each size block as it comes later. */
function sizesInOrder(rows) {
  const list = rows?.[0]?.direction === 'mobile' ? [...(rows || [])].reverse() : rows || [];

  return ['', ...list.filter((row) => !row.base).map((row) => row.handle)];
}

/**
 * Every place of `selector` the property could stand, in order: plain first, as a
 * state's value holds what the plain one has at that size.
 *
 * @returns {Array<{ suffix: string, size: string, value: ?string, opaque: boolean, own: Map }>}
 */
export function readPlaces(css, selector, prop, rows, suffixes = []) {
  const comp = COMPOSITES[prop];
  const plainAt = new Map();
  const places = [];

  for (const suffix of ['', ...suffixes]) {
    const decls = declarationsAt(css, `${selector}${suffix}`, rows).filter((decl) => decl.prop === prop);
    let through = new Map();

    for (const size of sizesInOrder(rows)) {
      const under = reached(comp, suffix ? plainAt.get(size) : null, through);
      const value = decls.find((decl) => decl.size === size)?.value ?? null;
      const parts = value === null ? new Map() : partsOf(prop, value);
      const own = new Map();

      if (parts) {
        for (const [key, one] of parts) {
          if (under.get(key) !== one && (under.has(key) || !comp.neutral(key, one))) {
            own.set(key, one);
          }
        }

        through = new Map([...through, ...own]);
      } else {
        through = new Map();
      }

      places.push({ suffix, size, value, opaque: !parts, own });

      if (!suffix) {
        plainAt.set(size, parts ? new Map(through) : new Map());
      }
    }
  }

  return places;
}

const reached = (comp, plain, through) => new Map([...(plain || []), ...through]);

const sameParts = (a, b) => a.size === b.size && [...a].every(([key, one]) => b.get(key) === one);

/**
 * The CSS with parts changed at one place, and every place after it that holds
 * what changed written again.
 *
 * @param {object} where  `{ selector, suffix, size, rows, query, suffixes }`; `selector` without the state
 * @param {Array<{ key: string, value: ?string }>} changes  null takes a part out; '' is the class that says "none" (`blur-none`)
 */
export function writeParts(css, where, prop, changes) {
  const { selector, suffix = '', size, rows, query, suffixes = [] } = where;
  const comp = COMPOSITES[prop];
  const places = readPlaces(css, selector, prop, rows, suffixes);
  const here = places.find((place) => place.suffix === suffix && place.size === size);

  if (!here) {
    return css;
  }

  const plainAt = new Map();
  let text = css;
  let through = new Map();
  let state = null;

  here.opaque = false;
  here.touched = true;

  for (const place of places) {
    if (place.suffix !== state) {
      state = place.suffix;
      through = new Map();
    }

    const under = reached(comp, place.suffix ? plainAt.get(place.size) : null, through);

    if (place.touched) {
      for (const { key, value } of changes) {
        if (value === null || value === undefined) {
          place.own.delete(key);
        } else if (value !== '') {
          place.own.set(key, value);
        } else if (under.has(key) && comp.off?.[key]) {
          place.own.set(key, comp.off[key]);
        } else {
          place.own.delete(key);
        }

        // What says nothing where nothing reaches (`scale-100`) is not worth a line.
        if (place.own.has(key) && !under.has(key) && comp.neutral(key, place.own.get(key))) {
          place.own.delete(key);
        }
      }
    }

    if (place.opaque) {
      through = new Map();

      if (!place.suffix) {
        plainAt.set(place.size, new Map());
      }

      continue;
    }

    const whole = new Map([...under, ...place.own]);

    through = new Map([...through, ...place.own]);

    if (!place.suffix) {
      plainAt.set(place.size, new Map(through));
    }

    const at = {
      selector: `${selector}${place.suffix}`,
      size: place.size,
      rows,
      query: place.touched ? query : rows.find((row) => row.handle === place.size)?.media || '',
    };
    const was = place.value === null ? null : partsOf(prop, place.value);

    if (!place.own.size) {
      if (place.value !== null) {
        text = writeDeclarations(text, at, [{ prop, value: null }]);
      }
    } else if (!was || !sameParts(was, whole)) {
      text = writeDeclarations(text, at, [{ prop, value: comp.render(whole) }]);
    }
  }

  return text;
}

/* ---------------- what the panel hands in ---------------- */

const keyframesIn = (css, name) => treeOf(css).find((node) => node.prelude === `@keyframes ${name}`);

/**
 * The CSS with a list of updates applied at one place: a declaration, a part of a
 * shared value, or the `@keyframes` an animation needs in the file with it. Those
 * are not left to the site's build: on the server nothing is built after a save.
 *
 * @param {object} where  as writeParts; `selector` without the state
 * @param {Array<object>} updates  `{ prop, value }`, `{ prop, key, value }`, `{ keyframes, text }` or `{ dropKeyframes }`
 */
export function applyUpdates(css, where, updates) {
  const place = { ...where, selector: `${where.selector}${where.suffix || ''}` };
  let text = String(css || '');

  for (const prop of new Set((updates || []).filter((one) => one.key).map((one) => one.prop))) {
    text = writeParts(
      text,
      where,
      prop,
      updates.filter((one) => one.key && one.prop === prop)
    );
  }

  text = writeDeclarations(
    text,
    place,
    (updates || []).filter((one) => one.prop && !one.key)
  );

  for (const one of updates || []) {
    if (one.keyframes && one.text && !keyframesIn(text, one.keyframes)) {
      text = `${text.trimEnd()}\n\n${one.text}\n`;
    }

    if (
      one.dropKeyframes &&
      !new RegExp(`animation(-name)?\\s*:[^;}]*\\b${one.dropKeyframes.replace(/[^\w-]/g, '\\$&')}\\b`).test(text)
    ) {
      const node = keyframesIn(text, one.dropKeyframes);

      if (node) {
        text = `${text.slice(0, node.from).trimEnd()}\n${text.slice(node.to).replace(/^\n+/, '\n')}`.replace(
          /^\n+/,
          ''
        );
      }
    }
  }

  return text;
}
