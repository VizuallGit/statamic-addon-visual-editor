/**
 * The open section as Build's canvas paints it: the dock's file, every
 * element stamped with its tree path, simple fields filled from the form —
 * and every part only the server can render left as an island, filled with
 * what the real preview rendered there.
 *
 * Owner: Build mode (resources/js/build-mode/).
 * May import: html-tree-parse.js, html-tree-edit.js, lib/antlers-tags.js,
 *   build-mode/catalog.js.
 * Pure: strings and plain objects in, a string out. The frame, the real
 *   preview and the morph are canvas.js's.
 * Bus messages: none.
 *
 * An element's inside is its child elements and the runs of source between
 * them. A run of text and simple fields (`{{ title }}`, `{{ hero.title }}`,
 * found in the form) is the canvas's own: it paints the frame it is typed.
 * A run holding a loop, a condition, a component or any other Antlers tag is
 * an island. Its key is the element it stands in and the opening tags it
 * holds, so a key outlives an edit inside a loop's body and the island keeps
 * its last rendering until the real preview renders the new one.
 *
 * Attributes go the same way, one tag at a time: a simple field is filled
 * from the form, any other tag (`{{ _class }}`) takes what the real preview
 * rendered for it (`learnTags`). Antlers standing where an attribute would
 * (`{{ visual_edit … }}`) brings the rendered element's other attributes.
 *
 * An element the file leaves empty — nothing inside but whitespace, no child,
 * no field, no island — is stamped for the canvas's placeholder, read off the
 * plan: `:empty` does not match an element holding a line break.
 */

import { parseTemplateTree } from '../html-tree-parse.js';
import { closingTagIndex } from '../html-tree-edit.js';
import { antlersTags } from '../lib/antlers-tags.js';
import { holdsElements } from './catalog.js';

/** On every element the canvas paints from the file: its tree path, as parseTemplateTree names it. */
export const CANVAS_PATH = 'data-sve-build-path';
/** On the section's root element in the canvas. */
export const CANVAS_ROOT = 'data-sve-build-root';
/** Where an island stands until the real preview has rendered it once. */
export const ISLAND_WAIT = 'sve-island';
/** On an element the file leaves empty: `box` when it holds others, `text` for a block of text. */
export const CANVAS_EMPTY = 'data-sve-build-empty';

/** Blocks of text: emptied, they stand on the page with no height of their own. */
const TEXT_BLOCKS = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'li', 'blockquote', 'figcaption']);

/**
 * Alpine's attributes (`x-data`, `:class`, `@click`) and inline handlers
 * (`onload`, `onclick`). Alpine does not run on the canvas, and the morph
 * hands every element it patches to the CP's own Alpine: on the canvas they
 * would be instructions for the wrong Alpine. The canvas's sandbox runs no
 * script, so a handler would only be refused, once per element.
 */
export function inertAttr(name) {
  return /^(?:x-|[:@]|on)/i.test(name) || name.includes('@');
}

/** `title`, `hero.title`, `hero:title` — a name the form can answer, nothing more. */
const SIMPLE = /^[A-Za-z_]\w*(?:[.:]\w+)*$/;
const ATTR = /([^\s"'<>/=]+)(?:\s*=\s*("[^"]*"|'[^']*'|[^\s"'=<>`]+))?/g;
const COMMENT = /<!--[\s\S]*?(?:-->|$)/g;

/**
 * `{{ name }}` from the form: the first scope that has the name answers.
 * A string or number is the value; null is nothing; anything else — a list,
 * a Bard document, an asset — is the server's to render.
 *
 * @param {...object} scopes  the section's row, then the page's values
 * @returns {(body: string) => string|undefined}
 */
export function fieldLookup(...scopes) {
  return (body) => {
    const name = String(body || '').trim();

    if (!SIMPLE.test(name)) {
      return undefined;
    }

    const keys = name.split(/[.:]/);

    for (const scope of scopes) {
      let value = scope;
      let hit = true;

      for (const key of keys) {
        if (!value || typeof value !== 'object' || !Object.prototype.hasOwnProperty.call(value, key)) {
          hit = false;
          break;
        }

        value = value[key];
      }

      if (!hit) {
        continue;
      }

      if (value === null || value === undefined) {
        return '';
      }

      return typeof value === 'string' || typeof value === 'number' ? String(value) : undefined;
    }

    return undefined;
  };
}

/** What a tag paints without the server: '' for a comment, a field's value, else undefined. */
function tagValue(tag, field) {
  if (tag.comment) {
    return '';
  }

  if (!tag.closed || tag.closer) {
    return undefined;
  }

  return field(tag.body);
}

/** An attribute value as text and tags, or null when it holds no Antlers. */
function valueParts(value, field) {
  const tags = antlersTags(value);

  if (!tags.length) {
    return null;
  }

  const parts = [];
  let at = 0;

  for (const tag of tags) {
    if (tag.from > at) {
      parts.push({ text: value.slice(at, tag.from) });
    }

    parts.push({ tag: value.slice(tag.from, tag.to), value: tagValue(tag, field) });
    at = tag.to;
  }

  if (at < value.length) {
    parts.push({ text: value.slice(at) });
  }

  return parts;
}

/**
 * An opening tag's attributes, Antlers kept whole, and whether Antlers stands
 * where an attribute would (`<section {{ visual_edit }}>`).
 *
 * @returns {{ attrs: Array<{ name: string, value: string|null, quote: string }>, loose: boolean }}
 */
export function openTagParts(open) {
  const source = String(open || '');
  const tags = antlersTags(source);
  let masked = '';
  let at = 0;

  for (const tag of tags) {
    masked += source.slice(at, tag.from) + ' '.repeat(tag.to - tag.from);
    at = tag.to;
  }

  masked += source.slice(at);

  let end = masked.length;

  if (masked[end - 1] === '>') {
    end -= 1;
  }

  if (masked[end - 1] === '/') {
    end -= 1;
  }

  const body = masked.slice(0, end);
  const attrs = [];
  const values = [];

  ATTR.lastIndex = (/^<[A-Za-z][\w:-]*/.exec(body) || [''])[0].length;

  let match;

  while ((match = ATTR.exec(body))) {
    let value = null;
    let quote = '';

    if (match[2] !== undefined) {
      const from = match.index + match[0].length - match[2].length;
      const raw = source.slice(from, from + match[2].length);

      quote = raw[0] === '"' || raw[0] === "'" ? raw[0] : '';
      value = quote ? raw.slice(1, -1) : raw;
      values.push([from, from + raw.length]);
    }

    attrs.push({ name: match[1], value, quote });
  }

  const loose = tags.some((tag) => !tag.comment && !values.some(([from, to]) => tag.from >= from && tag.to <= to));

  return { attrs, loose };
}

/** Where HTML comments sit in a run: they paint nothing, and what is inside them is not the run's. */
function commentRanges(source) {
  const out = [];

  COMMENT.lastIndex = 0;

  let match;

  while ((match = COMMENT.exec(source))) {
    out.push([match.index, match.index + match[0].length]);
  }

  return out;
}

/** A field's name alone in a tag — `bard_field`, `hero.body` — with nothing of a modifier's, a tag's or a parameter's. */
const FIELD = /^[A-Za-z_]\w*(?:\.\w+)*$/;

/**
 * One run of source between two child elements, with the rows standing in it
 * (loops, conditions, components, slots).
 *
 * An island that is one tag naming one field of the form — a value that is
 * not text, a Bard document — says so (`field`): the canvas can read it off
 * the form's own editor while that is typed in (canvas-fields.js). Any other
 * island is the server's alone.
 *
 * @returns {{ dynamic: false, text: string } | { dynamic: true, sig: string, field: string }}
 */
function runOf(source, from, to, members, field) {
  const text = source.slice(from, to);
  const comments = commentRanges(text);
  const skip = [...members.map((row) => [row.from - from, row.to - from]), ...comments];
  const tags = antlersTags(text).filter((tag) => !skip.some(([a, b]) => tag.from >= a && tag.to <= b));
  const loose = tags.filter((tag) => tagValue(tag, field) === undefined);

  if (members.length || loose.length) {
    const opens = members.map((row) => source.slice(row.from, row.openTo > row.from ? row.openTo : row.to));
    const one = !members.length && loose.length === 1 && !loose[0].comment && loose[0].closed && !loose[0].closer ? loose[0].body : '';

    return {
      dynamic: true,
      sig: [...opens, ...loose.map((tag) => text.slice(tag.from, tag.to))].join('\n'),
      field: FIELD.test(one) ? one : '',
    };
  }

  const cuts = [
    ...comments.map(([a, b]) => ({ from: a, to: b, text: '' })),
    ...tags.map((tag) => ({ from: tag.from, to: tag.to, text: tagValue(tag, field) })),
  ].sort((a, b) => a.from - b.from);
  let out = '';
  let at = 0;

  for (const cut of cuts) {
    if (cut.from < at) {
      continue;
    }

    out += text.slice(at, cut.from) + cut.text;
    at = cut.to;
  }

  return { dynamic: false, text: out + text.slice(at), filled: tags.some((tag) => !tag.comment) };
}

/** What an element's placeholder is: '' when it has something inside, is a void or locked, or is neither a box nor a block of text. */
function emptyKind(node, el) {
  if (el.leaf || node.locked || node.lockedIn || el.items.some((item) => item.items || item.dynamic || item.filled || item.text.trim())) {
    return '';
  }

  if (holdsElements(node)) {
    return 'box';
  }

  return TEXT_BLOCKS.has(String(node.tag).toLowerCase()) ? 'text' : '';
}

/**
 * The file as the canvas will paint it: the section's root element and every
 * element under it that is not inside an island, each with its attributes and
 * its runs; and every island, with where it stands between its siblings.
 *
 * Only the first element at the top is the section. What stands beside it at
 * the top (`{{ sve_tw }}`) is the page's and comes with the real preview.
 *
 * @param {string} html            the dock's file
 * @param {Function} field         fieldLookup(...)
 * @returns {null | { node: object, root: object, elements: object[], islands: object[] }}
 */
export function planTemplate(html, field = () => undefined) {
  const source = String(html || '');
  const top = parseTemplateTree(source).find((node) => !node.kind && !node.hidden);

  if (!top) {
    return null;
  }

  const elements = [];
  const islands = [];
  const seen = new Map();

  const walk = (node) => {
    const { attrs, loose } = openTagParts(source.slice(node.from, node.openTo));
    const el = {
      path: node.path,
      tag: node.tag,
      attrs: attrs.map((attr) => ({ ...attr, parts: attr.value === null ? null : valueParts(attr.value, field) })),
      loose,
      leaf: node.to <= node.openTo,
      items: [],
      empty: '',
    };

    elements.push(el);

    if (el.leaf) {
      return el;
    }

    const end = closingTagIndex(source, node);
    let cursor = node.openTo;
    let prev = null;
    let members = [];

    const flush = (to, next) => {
      if (to > cursor || members.length) {
        const run = { ...runOf(source, cursor, to, members, field), host: node.path, prev: prev?.path || null, next: next?.path || null };

        if (run.dynamic) {
          const base = `${node.path}\n${run.sig}`;
          const n = (seen.get(base) || 0) + 1;

          seen.set(base, n);
          run.key = `${base}\n#${n}`;
          islands.push(run);
        }

        el.items.push(run);
      }

      members = [];
    };

    for (const child of node.children) {
      if (child.hidden) {
        continue;
      }

      if (child.kind) {
        members.push(child);

        continue;
      }

      flush(child.from, child);
      el.items.push(walk(child));
      cursor = child.to;
      prev = child;
    }

    flush(Math.max(cursor, end), null);
    el.empty = emptyKind(node, el);

    return el;
  };

  return { node: top, root: walk(top), elements, islands };
}

/** A value read off the DOM, back into an attribute. */
function encodeAttr(value) {
  return String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

/**
 * Has the real preview rendered this attribute's tags, from the form's value as
 * it is now? Until it has, the canvas paints nothing there (an assets field) or
 * the form's raw value (`entry::id`); `''` from a tag it has rendered is a real
 * empty value.
 *
 * @param {object|null} plan  planTemplate(...)
 * @param {Map<string, string|undefined>} rendered  tag source → the form's value it was rendered from
 */
export function attrRendered(plan, path, name, rendered) {
  const attr = plan?.elements.find((el) => el.path === path)?.attrs.find((row) => row.name.toLowerCase() === name.toLowerCase());

  return !attr?.parts || attr.parts.every((part) => part.tag === undefined || (rendered.has(part.tag) && rendered.get(part.tag) === part.value));
}

/**
 * The section's HTML for the canvas.
 *
 * @param {object} plan      planTemplate(...)
 * @param {object} known     what the real preview rendered, read by canvas.js:
 *   learned  Map tag source → value (`{{ _class }}` → `static-section-testt`)
 *   served   Set of tag sources the server answers otherwise than the form (learnTags)
 *   extras   Map path → [[name, value]] (the attributes a loose tag rendered)
 *   islands  Map island key → HTML
 * @returns {{ html: string, waiting: string[] }}  waiting: islands not rendered yet
 */
export function paintPlan(plan, { learned = new Map(), served = new Set(), extras = new Map(), islands = new Map() } = {}) {
  const waiting = [];

  const attrText = (attr) => {
    if (attr.value === null) {
      return attr.name;
    }

    const value = attr.parts
      ? attr.parts
          .map((part) => {
            if (part.text !== undefined) {
              return part.text;
            }

            if (part.value !== undefined && !served.has(part.tag)) {
              return part.value.replace(/"/g, '&quot;');
            }

            return learned.has(part.tag) ? encodeAttr(learned.get(part.tag)) : '';
          })
          .join('')
      : attr.value;

    return `${attr.name}="${attr.quote === "'" ? value.replace(/"/g, '&quot;') : value}"`;
  };

  const paint = (el, root) => {
    const attrs = el.attrs.filter((attr) => !inertAttr(attr.name)).map(attrText);

    if (el.loose) {
      for (const [name, value] of extras.get(el.path) || []) {
        attrs.push(`${name}="${encodeAttr(value)}"`);
      }
    }

    attrs.push(`${CANVAS_PATH}="${el.path}"`);

    if (el.empty) {
      attrs.push(`${CANVAS_EMPTY}="${el.empty}"`);
    }

    if (root) {
      attrs.push(CANVAS_ROOT);
    }

    const open = `<${el.tag} ${attrs.join(' ')}>`;

    if (el.leaf) {
      return open;
    }

    const inner = el.items
      .map((item) => {
        if (item.items) {
          return paint(item, false);
        }

        if (!item.dynamic) {
          return item.text;
        }

        if (islands.has(item.key)) {
          return islands.get(item.key);
        }

        waiting.push(item.key);

        return `<${ISLAND_WAIT}></${ISLAND_WAIT}>`;
      })
      .join('');

    return `${open}${inner}</${el.tag}>`;
  };

  return { html: paint(plan.root, true), waiting };
}

/**
 * A class list as the page rendered it. The editor's own classes on the real
 * preview (`sve-cp-pulse`, `sve-editing`) are its marks, not the page's.
 */
export function pageClasses(value) {
  return String(value ?? '')
    .split(/\s+/)
    .filter((name) => name && !name.startsWith('sve-'))
    .join(' ');
}

/**
 * What the server made of each Antlers tag in an attribute, read off the
 * rendered value. The form's answers are tried as they stand first, and each
 * tag the form cannot answer takes what is between them. When the render does
 * not fit the form's answers, the server answered otherwise — a partial's
 * parameter (`id`, `_class`), a row id the form keeps under another name — and
 * every tag is read off the render (`served`). Null when the render fits the
 * template neither way (the file has moved on since that render).
 *
 * `tokens`: the value is a class list. The editor writes classes through
 * `classList`, which joins them with single spaces, so a space in the
 * template stands for any run of them; the caller leaves the editor's own
 * classes out (`pageClasses`).
 *
 * @param {Array|null} parts      an attribute's parts (planTemplate)
 * @param {string|null} rendered
 * @returns {{ values: Map<string, string>, served: boolean } | null}
 */
export function learnTags(parts, rendered, { tokens = false } = {}) {
  if (!parts || rendered === null || rendered === undefined) {
    return null;
  }

  const literal = (text) => {
    const escaped = text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    return tokens ? escaped.replace(/\s+/g, '\\s+') : escaped;
  };

  const read = (formAnswers) => {
    const asked = parts.filter((part) => part.tag !== undefined && !(formAnswers && part.value !== undefined));
    const pattern = parts
      .map((part) => {
        if (part.text !== undefined) {
          return literal(part.text);
        }

        return formAnswers && part.value !== undefined ? literal(part.value) : '([\\s\\S]*?)';
      })
      .join('');
    const match = new RegExp(tokens ? `^\\s*${pattern}\\s*$` : `^${pattern}$`).exec(String(rendered));

    return match ? new Map(asked.map((part, i) => [part.tag, match[i + 1]])) : null;
  };

  const values = read(true);

  if (values) {
    return { values, served: false };
  }

  const served = read(false);

  return served ? { values: served, served: true } : null;
}
