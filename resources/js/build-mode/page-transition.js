/**
 * An element's page transition in the dock's file — the build panel's
 * Animation tab, «Page transition».
 *
 * Owner: Build mode (resources/js/build-mode/).
 * May import: html-tree-parse.js, component-props.js, build-mode/attrs.js,
 * build-mode/place.js. Pure.
 * Bus messages: none.
 *
 * An element flies from one page to the next when it has the same
 * `view-transition-name` on both. The name stands in the element's `style`,
 * because it carries the entry's id, which a class cannot:
 *
 *   style="view-transition-name: image-{{ id }}; view-transition-class: spring"
 *
 * On a component it is the call's `style` parameter, which the component puts
 * on its element: `{{ partial:components/image … style="view-transition-name:
 * image-{page:id}" }}`. There the id is written with Antlers' single braces,
 * which a parameter fills in the same way: a `{{ … }}` inside the call would
 * end it early for every reader that looks for its `}}` (the HTML tree among
 * them). One written that way before is read across its whole length and
 * written back the short way.
 *
 * `{{ id }}` inside a loop over entries (the list), `{{ page:id }}` outside
 * one (the entry's own page): inside a page section `{{ id }}` is the set's
 * id, not the entry's. The pair name in front keeps the name valid (an id can
 * start with a digit) and lets one page pair more than one element (image,
 * title); one page holds a pair name once, or the browser plays nothing. The
 * motion is one of the three classes the tag styles.
 *
 * The template carries `{{ sve_page_transition }}` while any element in it
 * has a name: the tag turns cross-document view transitions on for the page
 * and pushes the three motions, once however many sections ask. A page
 * transition plays between two pages that both ask for one.
 */
import { readCallParams, writeCallParam } from '../component-props.js';
import { parseTemplateTree } from '../html-tree-parse.js';
import { readAttribute, withAttribute } from './attrs.js';
import { findByPath, parentOf } from './place.js';

export const MOTIONS = ['smooth', 'spring', 'snappy'];

/** Each motion's length, as the tag's CSS has it. */
export const MOTION_MS = { smooth: 700, spring: 900, snappy: 250 };

/** What the element matches by: the page's own entry, or the entry the loop is on. */
export const KEYS = { page: '{{ page:id }}', loop: '{{ id }}' };

export const TAG = '{{ sve_page_transition }}';
const TAG_RE = /\s*\{\{\s*sve_page_transition\s*\}\}/;
const NAME = 'view-transition-name';
const CLASS = 'view-transition-class';

/** Whether a row can carry a page transition: an element, or a component's call. */
export const carries = (node) => !!node && (!node.kind || node.kind === 'component');

/** The style attribute's declarations, in order. A `{{ … }}` holds no `;`. */
function declarations(style) {
  return String(style || '')
    .split(';')
    .map((text) => text.trim())
    .filter(Boolean)
    .map((text) => {
      const at = text.indexOf(':');

      return at < 0 ? { name: '', value: text, text } : { name: text.slice(0, at).trim().toLowerCase(), value: text.slice(at + 1).trim(), text };
    });
}

/**
 * A component call's whole length: to its first `}}` outside a quoted
 * parameter. The tree's row ends at the first `}}` of all, which a
 * `{{ id }}` inside a parameter comes before.
 */
function callOf(source, node) {
  let quote = '';

  for (let i = node.from + 2; i < source.length; i += 1) {
    const c = source[i];

    if (quote) {
      quote = c === quote ? '' : quote;
    } else if (c === '"' || c === "'") {
      quote = c;
    } else if (c === '}' && source[i + 1] === '}') {
      return { ...node, to: i + 2, openTo: i + 2 };
    }
  }

  return node;
}

/** The row's style: the element's attribute, or the component call's parameter. */
function styleOf(source, node) {
  if (node.kind === 'component') {
    const call = callOf(source, node);

    return readCallParams(source.slice(call.from, call.to)).get('style')?.value ?? null;
  }

  return readAttribute(source, node, 'style');
}

function withStyle(source, node, style) {
  if (node.kind === 'component') {
    return writeCallParam(source, callOf(source, node), 'style', style);
  }

  return withAttribute(source, node, 'style', style || null, { end: true });
}

function keyOf(raw) {
  if (/^\{\{?\s*id\s*\}?\}$/.test(raw)) {
    return KEYS.loop;
  }

  return /^\{\{?\s*page:id\s*\}?\}$/.test(raw) ? KEYS.page : raw;
}

/** The key as the row writes it: `{{ id }}` in an element's attribute, `{id}` in a component's call. */
function keyText(key, node) {
  return node.kind === 'component' ? String(key).replace(/^\{\{\s*/, '{').replace(/\s*\}\}$/, '}') : key;
}

/** A pair name as a name can take it: small letters, digits and dashes, a letter first. */
export function cleanPair(raw) {
  return String(raw || '')
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^[^a-z]+/, '')
    .replace(/-+$/, '');
}

/** The pair name a new one starts with: what the element shows. */
export function defaultPair(node) {
  if (node?.kind === 'component') {
    return /image|picture|photo|media|video/i.test(`${node.src || ''} ${node.label || ''}`) ? 'image' : 'element';
  }

  const tag = String(node?.tag || '').toLowerCase();

  if (['img', 'picture', 'figure', 'video', 'svg'].includes(tag)) {
    return 'image';
  }

  if (/^h[1-6]$/.test(tag)) {
    return 'title';
  }

  return tag === 'p' ? 'text' : 'element';
}

/** The loop over entries the row stands in — the nearest — or null. */
function entryLoop(roots, node) {
  let row = node;

  while (row) {
    row = parentOf(roots, row) || null;

    if (row?.kind === 'antlers' && (row.loopKind === 'collection' || row.loopKind === 'nav')) {
      return row;
    }
  }

  return null;
}

/** `{{ id }}` when the element stands in a loop over entries, else `{{ page:id }}`. */
export function keyFor(html, path) {
  const roots = parseTemplateTree(html);

  return entryLoop(roots, findByPath(roots, path)) ? KEYS.loop : KEYS.page;
}

/** The collection the loop around the element draws from (`cases`), or '' outside one. */
export function loopCollectionOf(html, path) {
  const roots = parseTemplateTree(html);
  const loop = entryLoop(roots, findByPath(roots, path));

  return loop ? String(loop.handle || '').replace(/^collection::/, '').split('|')[0].trim() : '';
}

/** The row's page transition — `{ pair, key, motion }` — or null when it has none. */
export function pageTransitionOf(html, node) {
  if (!carries(node)) {
    return null;
  }

  const decls = declarations(styleOf(String(html ?? ''), node));
  const name = decls.find((decl) => decl.name === NAME)?.value || '';

  if (!name || name === 'none') {
    return null;
  }

  const split = /^([a-z][a-z0-9-]*?)-(\{[\s\S]*\})$/i.exec(name);
  const classes = (decls.find((decl) => decl.name === CLASS)?.value || '').split(/\s+/);

  return {
    pair: split ? split[1] : name,
    key: split ? keyOf(split[2]) : '',
    motion: classes.find((name) => MOTIONS.includes(name)) || '',
  };
}

/** Every row of the file that carries something or could, in document order, with how deep it stands. */
export function transitionRows(html) {
  const source = String(html ?? '');
  const out = [];
  const walk = (nodes, depth) => {
    for (const node of nodes || []) {
      if (carries(node)) {
        out.push({ node, depth, pt: pageTransitionOf(source, node) });
      }

      walk(node.children, carries(node) ? depth + 1 : depth);
    }
  };

  walk(parseTemplateTree(source), 0);

  return out;
}

/** `{{ sve_page_transition }}` after the markup while a row has a name; gone once none does. */
function withTag(source) {
  const has = TAG_RE.test(source);
  const needs = transitionRows(source).some((row) => row.pt);

  if (needs && !has) {
    const body = source.replace(/\s+$/, '');

    return `${body}\n\n${TAG}${source.slice(body.length)}`;
  }

  return !needs && has ? source.replace(TAG_RE, '') : source;
}

/** The row's own style with its name and motion set to `pt`, or taken out when it is null. */
function writeOne(source, node, pt) {
  const rest = declarations(styleOf(source, node))
    .filter((decl) => decl.name !== NAME && decl.name !== CLASS)
    .map((decl) => decl.text);
  const pair = pt ? cleanPair(pt.pair) || defaultPair(node) : '';
  const own = pt ? [`${NAME}: ${pair}-${keyText(pt.key || KEYS.page, node)}`, ...(MOTIONS.includes(pt.motion) ? [`${CLASS}: ${pt.motion}`] : [])] : [];

  return withStyle(source, node, [...rest, ...own].join('; '));
}

/**
 * The file with the row at `path` on the page transition `pt`; null takes its
 * name and motion back out. Its other declarations stay.
 */
export function withPageTransition(html, path, pt) {
  const source = String(html ?? '');
  const node = findByPath(parseTemplateTree(source), path);

  if (!carries(node)) {
    return source;
  }

  return withTag(writeOne(source, node, pt));
}

/**
 * The page an element lands on: the row at `path` takes `pt`, and any other
 * row of the file that had the same pair name lets it go — a page holds a
 * pair once.
 */
export function withLanding(html, path, pt) {
  let source = String(html ?? '');
  const pair = cleanPair(pt?.pair);

  for (;;) {
    const other = transitionRows(source).find((row) => row.node.path !== path && row.pt && row.pt.pair === pair);

    if (!other) {
      break;
    }

    source = writeOne(source, other.node, null);
  }

  return withPageTransition(source, path, pt);
}

/** The other rows of the file that already use this pair name. */
export function samePair(html, path, pair) {
  const clean = cleanPair(pair);

  return transitionRows(html).filter((row) => row.node.path !== path && row.pt && row.pt.pair === clean);
}

const SPRING = [0, 0.043, 0.15, 0.292, 0.447, 0.598, 0.734, 0.849, 0.941, 1.008, 1.054, 1.081, 1.093, 1.094, 1.087, 1.075, 1.061, 1.046, 1.032, 1.02, 1.01, 1.003, 0.997, 0.994, 0.992, 0.991, 0.991, 0.992, 0.993, 0.995, 0.996, 0.997, 1];
const BEZIER = { smooth: [0.22, 1, 0.36, 1], snappy: [0.2, 0, 0, 1] };

function bezierPoints([x1, y1, x2, y2], samples = 32) {
  return Array.from({ length: samples + 1 }, (_, i) => {
    const t = i / samples;
    const u = 1 - t;

    return [3 * u * u * t * x1 + 3 * u * t * t * x2 + t * t * t, 3 * u * u * t * y1 + 3 * u * t * t * y2 + t * t * t];
  });
}

const X = (x) => (4 + x * 92).toFixed(1);
const Y = (y) => (50 - y * 36).toFixed(1);

/** The dashed line a motion ends on, in a 100 × 56 box. */
export const MOTION_BASE = `M4 ${Y(1)}H96`;

/** A motion's curve as an SVG path in a 100 × 56 box: time across, distance up. */
export function motionPath(motion) {
  const points = motion === 'spring' ? SPRING.map((v, i) => [i / (SPRING.length - 1), v]) : bezierPoints(BEZIER[motion] || BEZIER.smooth);

  return points.map(([x, y], i) => `${i ? 'L' : 'M'}${X(x)} ${Y(y)}`).join('');
}
