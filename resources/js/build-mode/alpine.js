/**
 * Alpine on the file's tags, for Build's Action tab: what a tag has, which
 * switches reach it, and writing an action in one go.
 *
 * Owner: Build mode (resources/js/build-mode/).
 * May import: alpine-behaviours.js, html-tree-parse.js, place.js. Pure — strings in, strings out.
 * Bus messages: none.
 *
 * The list of behaviours and how a tag's attributes are read are the dock's
 * (alpine-behaviours.js). The dock writes where its cursor is, into its
 * editor; this writes on an element by its path, into the file's text, because
 * Build has no cursor. An attribute is written where the dock writes it, right
 * after the tag name, and bare when it has no value.
 *
 * A trigger and what follows it have to reach the same `x-data`, or nothing
 * ever happens and nothing says why. So an action does not ask where the switch
 * goes: it goes on the nearest element holding both, or into an `x-data` that
 * already stands above them.
 */

import { fillName, stateNames, tagAttrs } from '../alpine-behaviours.js';
import { maskAntlers, parseTemplateTree } from '../html-tree-parse.js';
import { findByPath } from './place.js';

/** A tag's attributes: read past any `{{ … }}` in it, values as the file has them. */
export function elementAttrs(html, node) {
  const open = String(html || '').slice(node.from, node.openTo);

  return tagAttrs(maskAntlers(open)).map((attr) => {
    const raw = open.slice(attr.from, attr.to);
    const at = raw.indexOf('=');

    return { ...attr, value: at === -1 ? '' : raw.slice(at + 1).trim().replace(/^["']|["']$/g, '') };
  });
}

export const alpineAttrs = (html, node) => elementAttrs(html, node).filter((attr) => attr.alpine);

/** One attribute set on the element at `path`, or replaced where it stands. An empty value is written bare. */
export function withAlpineAttr(html, path, name, value) {
  const node = findByPath(parseTemplateTree(html), path);

  if (!node) {
    return html;
  }

  const open = html.slice(node.from, node.openTo);
  const written = value === '' ? name : `${name}="${value}"`;
  const found = elementAttrs(html, node).find((attr) => attr.name === name);
  const at = found ? null : open.search(/\s|\/?>$/);
  const next = found
    ? open.slice(0, found.from) + written + open.slice(found.to)
    : at === -1 ? open : `${open.slice(0, at)} ${written}${open.slice(at)}`;

  return html.slice(0, node.from) + next + html.slice(node.openTo);
}

/** One attribute off the element, with the space in front of it. */
export function withoutAlpineAttr(html, path, name) {
  const node = findByPath(parseTemplateTree(html), path);
  const found = node ? elementAttrs(html, node).find((attr) => attr.name === name) : null;

  if (!found) {
    return html;
  }

  const open = html.slice(node.from, node.openTo);
  let from = found.from;

  while (from > 0 && /\s/.test(open[from - 1])) {
    from -= 1;
  }

  return html.slice(0, node.from) + open.slice(0, from) + open.slice(found.to) + html.slice(node.openTo);
}

/** The nodes from the top of the file down to `path`, itself last. Empty when it is not there. */
export function chainTo(roots, path) {
  for (const node of roots || []) {
    if (node.path === path) {
      return [node];
    }

    const below = chainTo(node.children, path);

    if (below.length) {
      return [node, ...below];
    }
  }

  return [];
}

/** The switches that reach the element, nearest first: `{ name, path, tag }`. */
export function statesInScope(html, path) {
  const out = [];
  const seen = new Set();

  chainTo(parseTemplateTree(html), path).reverse().forEach((node) => {
    if (node.kind) {
      return;
    }

    const data = elementAttrs(html, node).find((attr) => attr.name === 'x-data');

    stateNames(data?.value || '').forEach((name) => {
      if (!seen.has(name)) {
        seen.add(name);
        out.push({ name, path: node.path, tag: node.tag });
      }
    });
  });

  return out;
}

/** A switch name nothing in reach uses: `open`, `open2`, … */
export function freeName(html, paths) {
  const used = new Set(paths.flatMap((path) => statesInScope(html, path).map((state) => state.name)));

  if (!used.has('open')) {
    return 'open';
  }

  let n = 2;

  while (used.has(`open${n}`)) {
    n += 1;
  }

  return `open${n}`;
}

/** The nearest tag holding both elements (either may hold the other); null when only the file does. */
function holderOf(roots, a, b) {
  const one = chainTo(roots, a);
  const two = chainTo(roots, b);
  let shared = 0;

  while (shared < one.length && shared < two.length && one[shared].path === two[shared].path) {
    shared += 1;
  }

  return one.slice(0, shared).reverse();
}

/** `{ a: 1 }` with `name: false` in it. Null when the value is not an object written out (`dropdown()`). */
function withState(value, name) {
  const text = String(value || '').trim();

  if (!text) {
    return `{ ${name}: false }`;
  }

  const inner = /^\{([\s\S]*)\}$/.exec(text);

  if (!inner) {
    return null;
  }

  const body = inner[1].trim().replace(/,$/, '');

  return body ? `{ ${body}, ${name}: false }` : `{ ${name}: false }`;
}

/**
 * The file with `name` in reach of both elements, unless it already is.
 *
 * @returns {string|null} null when no tag can hold it
 */
export function withStateFor(html, a, b, name) {
  const shared = holderOf(parseTemplateTree(html), a, b).filter((node) => !node.kind);

  if (!shared.length) {
    return null;
  }

  for (const node of shared) {
    const data = elementAttrs(html, node).find((attr) => attr.name === 'x-data');

    if (data) {
      if (stateNames(data.value).includes(name)) {
        return html;
      }

      const value = withState(data.value, name);

      return value === null ? null : withAlpineAttr(html, node.path, 'x-data', value);
    }
  }

  return withAlpineAttr(html, shared[0].path, 'x-data', `{ ${name}: false }`);
}

/** What the switch does when the trigger fires. */
export const STATEMENT = {
  toggle: (name) => `${name} = !${name}`,
  on: (name) => `${name} = true`,
  off: (name) => `${name} = false`,
};

/** A trigger's statement beside the ones it already runs: `@click` is one attribute, and a button may do two things. */
function joined(existing, statement) {
  const parts = String(existing || '').split(';').map((part) => part.trim()).filter(Boolean);

  return parts.includes(statement) ? parts.join('; ') : [...parts, statement].join('; ');
}

/**
 * A whole action: the switch where both can reach it, the trigger on `trigger`,
 * and what follows on `target`.
 *
 * `then` is one of the react behaviours (alpine-behaviours.js). A thing that
 * shows also gets `x-cloak`, or it flashes while the page loads.
 *
 * @returns {string|null} the file, or null when no tag can hold the switch
 */
export function withAction(html, { trigger, target, when, does, name, then, classes = '' }) {
  let next = withStateFor(html, trigger, target, name);

  if (next === null) {
    return null;
  }

  const node = findByPath(parseTemplateTree(next), trigger);
  const had = elementAttrs(next, node).find((attr) => attr.name === when)?.value;

  next = withAlpineAttr(next, trigger, when, joined(had, STATEMENT[does](name)));

  fillName(then.attrs, name).forEach((attr) => {
    next = withAlpineAttr(next, target, attr.name, attr.value.replace('|', classes));
  });

  return then.id.startsWith('show') ? withAlpineAttr(next, target, 'x-cloak', '') : next;
}
