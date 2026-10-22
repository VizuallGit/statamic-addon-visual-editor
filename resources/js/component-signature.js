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
import { antlersTags } from './lib/antlers-tags.js';

const VIEW_PREFIX = 'view:';
const PARTIALS = 'partials/';
const MARK = '\u0000';

/**
 * Antlers replaced by a marker, offsets kept. The scanner takes a tag whole —
 * `{{ glide :src="s" width="{{ _w }}" }}` is one tag — where a lazy regex
 * ended it at the inner `}}` and left ` width="…" }}` standing as markup, so
 * glide's parameters were read as the img's attributes.
 */
function markAntlers(text) {
  let out = '';
  let i = 0;

  for (const tag of antlersTags(text)) {
    out += text.slice(i, tag.from) + MARK.repeat(tag.to - tag.from);
    i = tag.to;
  }

  return out + text.slice(i);
}

/** `view:partials/components/card` → `components/card`. Anything that is not a view → null. */
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
 *
 * The `[ ]` marks stand on their own between spaces (`[ {{ _class }} ]`), so
 * the split is on whitespace alone and the bare brackets are dropped after.
 * Splitting on the brackets themselves cut `prose-headings:max-w-[30ch]` into
 * `prose-headings:max-w-` — the same kind of fragment — and a component whose
 * root wore one arbitrary value was never found on the page.
 */
export function staticClasses(openTag) {
  const match = markAntlers(String(openTag || '')).match(/\sclass\s*=\s*(["'])([\s\S]*?)\1/i);

  if (!match) {
    return [];
  }

  return match[2]
    .split(/\s+/)
    .filter((name) => name && !name.includes(MARK) && /^[A-Za-z_][\w:./%!#\[\]()-]*$/.test(name));
}

const escapeClass = (name) =>
  globalThis.CSS?.escape ? globalThis.CSS.escape(name) : name.replace(/([^\w-])/g, '\\$1');

const CONDITION = /^(if|unless)$/;
const CONDITION_END = /^(endif|endunless)$/;

/** How many `{{ if }}` / `{{ unless }}` blocks are still open at `offset`. A comment opens nothing. */
function conditionDepth(source, offset) {
  let depth = 0;

  for (const tag of antlersTags(source)) {
    if (tag.from >= offset) {
      break;
    }

    if (tag.comment) {
      continue;
    }

    if (CONDITION.test(tag.name)) {
      depth += tag.closer ? -1 : 1;
    } else if (CONDITION_END.test(tag.name)) {
      depth -= 1;
    }
  }

  return depth;
}

/**
 * The element among `nodes` that stands for the component on the page.
 *
 * The parser masks Antlers, so a `{{ if }}` around a tag is invisible to it
 * and every tag looked equally certain to render. They are not:
 *
 * - A tag written outside every condition always renders. The first such
 *   element is the root — not a conditional block before it (`form` opens
 *   with an error list that is only there when the form failed).
 * - A tag whose whole element sits inside one condition — open and close tag
 *   both — renders as a unit or not at all (`{{ if links }}<div …>…</div>
 *   {{ /if }}`). When nothing always renders, the first of those is the root:
 *   it is the component, whenever the component is on the page.
 * - A tag whose condition closes before its own close tag is a conditional
 *   wrapper (`{{ if _blur }}<div class="blurred-img">{{ /if }} <img …>
 *   {{ if _blur }}</div>{{ /if }}` — the image component draws the blur
 *   wrapper on the public page only, never in Live Preview). It may not be
 *   there; what it wraps is. Its children are read the same way.
 */
function rootElement(source, nodes) {
  const elements = nodes.filter((node) => !node.kind);
  const always = elements.find((node) => conditionDepth(source, node.from) === 0);
  const root = always || elements.find((node) => !isConditionalWrapper(source, node)) || elements[0];

  if (!root) {
    return null;
  }

  if (!always && isConditionalWrapper(source, root)) {
    return rootElement(source, root.children || []);
  }

  return root;
}

/**
 * Opened inside a condition that has closed again by its first child: the tag
 * may be missing while what it wraps is there. The close tag is no measure —
 * the wrapper's condition opens again around it (`{{ if _blur }}</div>{{ /if }}`).
 */
function isConditionalWrapper(source, node) {
  const first = (node.children || []).find((child) => !child.kind);

  return !!first && conditionDepth(source, first.from) < conditionDepth(source, node.from);
}

/**
 * Attributes the file writes out in full — `href="/"`, `role="list"` — never
 * one with Antlers in it, never one inside a condition (`{{ if priority }}
 * priority="true" {{ /if }}` is on the page only sometimes), never class (the
 * classes are read on their own) or style. A root with no classes of its own
 * is still this component's when its attributes are: the logo is a bare
 * `<a href="/">`, and a bare `a` is every link on the page.
 */
export function staticAttributes(openTag) {
  const source = String(openTag || '');
  const marked = markAntlers(source);
  const out = [];
  const re = /\s([A-Za-z_:][\w:.-]*)\s*=\s*(["'])([^"']*?)\2/g;
  let match;

  while ((match = re.exec(marked))) {
    const [, name, , value] = match;

    if (name === 'class' || name === 'style' || value.includes(MARK) || conditionDepth(source, match.index) > 0) {
      continue;
    }

    out.push([name, value]);
  }

  return out;
}

/**
 * A CSS selector for the component's root element, or null when the file opens
 * with something too vague to point at.
 */
export function rootSelector(html) {
  const source = String(html || '');
  // The first tag at the top of the file — not the first node. A component
  // may open with Antlers that writes no markup (`{{ if _aspect }} … {{ /if }}`
  // working out a size) before its tag; that block was taken for the root,
  // and the component was never found on the page.
  const root = rootElement(source, parseHtmlTree(source));

  if (!root) {
    return null;
  }

  const openTag = source.slice(root.from, root.openTo);
  const classes = staticClasses(openTag);
  const attributes = staticAttributes(openTag);

  // A bare `div` would match half the page. A tag with nothing of its own is
  // only specific enough when the tag itself is rare.
  if (!classes.length && !attributes.length && !/^(header|footer|main|nav|aside|figure|picture|form|table)$/.test(root.tag)) {
    return null;
  }

  return (
    root.tag +
    classes.map((name) => `.${escapeClass(name)}`).join('') +
    attributes.map(([name, value]) => `[${name}="${value.replace(/["\\]/g, '\\$&')}"]`).join('')
  );
}
