/**
 * How a component is recognised in the rendered page.
 *
 * A partial leaves no mark of its own: what comes out is just its markup. So
 * the component is found by its root signature — the tag and the static classes
 * the file itself opens with. Classes written by Antlers are skipped, since the
 * preview holds the rendered value and the file does not.
 *
 * Kept apart from the code that talks to the preview so the matching can be
 * read, and tested, on its own.
 */
import { parseHtmlTree } from './html-tree-parse.js';

const VIEW_PREFIX = 'view:';
const PARTIALS = 'partials/';

/** `view:partials/components/card` → `components/card`. Anything else → null. */
export function componentSrcFromType(type) {
  const value = String(type || '');

  if (!value.startsWith(VIEW_PREFIX)) {
    return null;
  }

  const view = value.slice(VIEW_PREFIX.length);

  return view.startsWith(PARTIALS) ? view.slice(PARTIALS.length) : view;
}

/**
 * Static class names on an opening tag — never `{{ … }}`, never the `[ ]` marks.
 *
 * Antlers is replaced by a marker rather than a space, so `bg-{{ color }}` is
 * dropped whole. Blanking it would leave `bg-`, a class the page never has, and
 * one such fragment is enough to make the whole selector match nothing.
 */
export function staticClasses(openTag) {
  const match = String(openTag || '').match(/\sclass\s*=\s*(["'])([\s\S]*?)\1/i);

  if (!match) {
    return [];
  }

  return match[2]
    .replace(/\{\{[\s\S]*?\}\}/g, '\u0000')
    .split(/[\s[\]]+/)
    .filter((name) => name && !name.includes('\u0000') && /^[A-Za-z_][\w:./%!#-]*$/.test(name));
}

const escapeClass = (name) =>
  globalThis.CSS?.escape ? globalThis.CSS.escape(name) : name.replace(/([^\w-])/g, '\\$1');

/**
 * A CSS selector for the component's root element, or null when the file opens
 * with something too vague to point at.
 */
export function rootSelector(html) {
  const root = parseHtmlTree(html)[0];

  if (!root) {
    return null;
  }

  const classes = staticClasses(String(html).slice(root.from, root.openTo));

  // A bare `div` would match half the page. A tag with no classes is only
  // specific enough when the tag itself is rare.
  if (!classes.length && !/^(header|footer|main|nav|aside|figure|form|table)$/.test(root.tag)) {
    return null;
  }

  return root.tag + classes.map((name) => `.${escapeClass(name)}`).join('');
}
