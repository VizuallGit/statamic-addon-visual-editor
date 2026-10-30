/**
 * The markup one Add tile writes — what the dock's HTML toolbar writes for
 * the same element.
 *
 * Owner: Build mode (resources/js/build-mode/).
 * May import: build-mode/catalog.js. Pure — no editor, no bus, no DOM.
 * Bus messages: none.
 *
 * The rules are the toolbar's (`openTagFor` and `applyHtmlTag` in
 * dock/html-tools.js): a section opens with the attributes the site
 * configures (`sveSectionTag`); a link opens with `href=""`; an HTML_DIVS
 * entry carries its classes; a snippet tool (image, video, loop, if) is its
 * snippet; a list is a `ul` with one `li`. Build differs only where it puts a
 * finished element somewhere instead of leaving a caret in it: an element
 * that holds text gets a word, so there is something to see and click, and
 * a list item is indented one step of four spaces, as the site's files are.
 */

import { STRUCTURES } from './catalog.js';

export const INDENT = '    ';

const esc = (s) => String(s ?? '').replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]);

function open(tag, classes = '', attrs = '') {
  return `<${tag}${attrs ? ` ${attrs}` : ''}${classes ? ` class="${classes}"` : ''}>`;
}

/**
 * @param {object} entry  one item of addGroups()
 * @param {{ sectionTag?: string, text?: object, heading?: string, structure?: string, rows?: number, mobile?: string }} opts
 *   `sectionTag` the site's section attributes (Statamic config `sveSectionTag`),
 *   `text` the words new elements start with ({ heading, text, button, link, item }),
 *   `heading` the heading level (h2), `structure` a STRUCTURES key for a Grid's
 *   columns and `rows` its rows (ROWS), `mobile` the narrowest size's Tailwind
 *   variant (breakpoints(), e.g. `max-md`)
 * @returns {string} markup, not indented, children indented with INDENT
 */
export function markupFor(entry, opts = {}) {
  const text = opts.text || {};
  const def = entry?.def || {};

  switch (entry?.source) {
    case 'columns':
      return columnsMarkup(opts.structure || '2', opts.mobile, opts.rows);

    case 'div':
      return `${open('div', def.classes)}</div>`;

    case 'own':
      if (def.tag === 'hr') {
        return '<hr>';
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
  if (def.snippet) {
    return String(def.snippet).replace(/\n+$/, '');
  }

  if (def.menu === 'heading') {
    const level = (entry.headings || []).includes(opts.heading) ? opts.heading : (entry.headings || [])[1] || 'h2';

    return `<${level}>${esc(text.heading)}</${level}>`;
  }

  if (def.menu === 'text') {
    return `<p>${esc(text.text)}</p>`;
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

/** A grid with one empty div per cell — its columns times its rows — stacking at the narrowest size. */
export function columnsMarkup(key, mobile = 'max-md', rows = 1) {
  const structure = STRUCTURES.find((s) => s.key === key) || STRUCTURES[1];
  const stack = structure.parts.length > 1 && mobile ? ` ${mobile}:grid-cols-1` : '';
  const cells = structure.parts.length * Math.max(1, Math.floor(rows) || 1);
  const kids = Array.from({ length: cells }, () => `${INDENT}<div></div>`).join('\n');

  return `<div class="grid ${structure.cls}${stack}">\n${kids}\n</div>`;
}
