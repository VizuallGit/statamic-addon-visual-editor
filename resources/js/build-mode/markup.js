/**
 * The markup one Add tile writes — and the dock's HTML toolbar button for the
 * same element (dock/element-markup.js): one element, one markup, wherever it
 * is added from.
 *
 * Owner: Build mode (resources/js/build-mode/).
 * May import: build-mode/catalog.js. Pure — no editor, no bus, no DOM.
 * Bus messages: none.
 *
 * The rules are the toolbar's (`openTagFor` and `applyHtmlTag` in
 * dock/html-tools.js): a section opens with the attributes the site
 * configures (`sveSectionTag`); a link opens with `href=""`; an HTML_DIVS
 * entry carries its classes; a snippet tool (image, video, loop, if) is its
 * snippet; a list is a `ul` with one `li`. An element that holds text gets a
 * word, so there is something to see and click — in the dock the word is
 * selected (`caretIn`), so typing replaces it — and a list item is indented
 * one step of four spaces, as the site's files are.
 */

import { GRID_GAP, GRID_PRESETS } from './catalog.js';

export const INDENT = '    ';

const esc = (s) => String(s ?? '').replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]);

function open(tag, classes = '', attrs = '') {
  return `<${tag}${attrs ? ` ${attrs}` : ''}${classes ? ` class="${classes}"` : ''}>`;
}

/**
 * @param {object} entry  one item of addGroups()
 * @param {{ sectionTag?: string, text?: object, heading?: string, textTag?: string, preset?: string, mobile?: string, images?: object }} opts
 *   `sectionTag` the site's section attributes (Statamic config `sveSectionTag`),
 *   `text` the words new elements start with ({ heading, text, button, link, item }),
 *   `heading` the heading level (h2), `preset` a GRID_PRESETS key for a Grid's
 *   columns and rows, `mobile` the narrowest size's Tailwind variant
 *   (breakpoints(), e.g. `max-md`), `textTag` the text menu's tag (p),
 *   `images` a tool's markup where the site makes images ({ img, picture }, image.js)
 * @returns {string} markup, not indented, children indented with INDENT
 */
export function markupFor(entry, opts = {}) {
  const text = opts.text || {};
  const def = entry?.def || {};

  switch (entry?.source) {
    case 'columns':
      return columnsMarkup(opts.preset || '2', opts.mobile);

    case 'div':
      return `${open('div', def.classes)}</div>`;

    case 'own':
      if (def.tag === 'hr') {
        return '<hr>';
      }

      if (def.tag === 'ol') {
        return `<ol>\n${INDENT}<li>${esc(text.item)}</li>\n</ol>`;
      }

      if (def.gallery) {
        return `<div class="grid grid-cols-3 gap-4">\n${INDENT}<img src="" alt="" class="w-full">\n</div>`;
      }

      if (def.rich) {
        return `<div class="prose">\n${INDENT}<p>${esc(text.text)}</p>\n</div>`;
      }

      return def.tag === 'a'
        ? `${open('a', def.classes, 'href=""')}${esc(text.button)}</a>`
        : `${open(def.tag, def.classes)}</${def.tag}>`;

    case 'tool':
      return toolMarkup(entry, def, opts, text);

    default:
      return '';
  }
}

function toolMarkup(entry, def, opts, text) {
  // An image or a picture the site makes (image.js): its options with it, from the start.
  if (opts.images?.[def.id]) {
    return opts.images[def.id];
  }

  if (def.snippet) {
    return String(def.snippet).replace(/\n+$/, '');
  }

  if (def.menu === 'heading') {
    const level = (entry.headings || []).includes(opts.heading) ? opts.heading : (entry.headings || [])[1] || 'h2';

    return `<${level}>${esc(text.heading)}</${level}>`;
  }

  if (def.menu === 'text') {
    const tag = /^[a-z][a-z0-9]*$/.test(opts.textTag || '') ? opts.textTag : 'p';

    return `<${tag}>${esc(text.text)}</${tag}>`;
  }

  const tag = def.tag || 'div';

  if (tag === 'a') {
    return `<a href="">${esc(text.link)}</a>`;
  }

  if (tag === 'section') {
    const attrs = String(opts.sectionTag || '').trim();

    return `${open('section', '', attrs)}</section>`;
  }

  if (tag === 'ul') {
    return `<ul>\n${INDENT}<li>${esc(text.item)}</li>\n</ul>`;
  }

  if (tag === 'li') {
    return `<li>${esc(text.item)}</li>`;
  }

  return `<${tag}></${tag}>`;
}

/**
 * Where the caret goes in an element just written into the dock's HTML pane:
 * into its first empty attribute (a link's `href=""`, an image's `src=""`),
 * else over the word it was given (selected, so typing replaces it), else
 * where the snippet says (a loop's name), else inside an empty element, else
 * after it. The same markup as Build's tile; only the caret is the dock's.
 *
 * @returns {{ at: number, select: number }}
 */
export function caretIn(markup, words = [], def = {}) {
  const text = String(markup || '');
  const empty = text.indexOf('=""');

  if (empty !== -1) {
    return { at: empty + 2, select: 0 };
  }

  for (const word of words) {
    const at = word ? text.indexOf(`>${esc(word)}<`) : -1;

    if (at !== -1) {
      return { at: at + 1, select: esc(word).length };
    }
  }

  if (def.snippet && text === String(def.snippet).replace(/\n+$/, '') && def.caret !== undefined) {
    return { at: def.caret, select: def.select || 0 };
  }

  const open = /^<([a-z][a-z0-9-]*)\b[^>]*>(?=<\/\1>)/i.exec(text);

  return { at: open ? open[0].length : text.length, select: 0 };
}

/**
 * A grid and nothing in it: its columns and rows (a GRID_PRESETS key) — one
 * row at the least, written, as Style's R + writes it — both back to one at
 * the narrowest size, the site's gutter between. What goes in it is picked
 * after: the canvas shows its cells as room to fill (canvas-empty.js).
 */
export function columnsMarkup(key, mobile = 'max-md') {
  const preset = GRID_PRESETS.find((p) => p.key === key) || GRID_PRESETS[1];
  const rows = Math.max(1, preset.rows);
  const stack = mobile ? `${preset.parts.length > 1 ? ` ${mobile}:grid-cols-1` : ''}${rows > 1 ? ` ${mobile}:grid-rows-1` : ''}` : '';

  return `<div class="grid ${preset.cls} grid-rows-${rows}${stack} ${GRID_GAP}"></div>`;
}
