/**
 * What a button of the dock's HTML toolbar writes for a new element: the
 * markup Build's Add tile writes for the same element (build-mode/markup.js),
 * so a heading, an image, a picture or a grid is the same wherever it is
 * added from. Only where the caret lands is the dock's own (`caretIn`): into
 * an empty `href=""`/`src=""`, or over the word the element was given.
 *
 * Owner: the dock (resources/js/dock/).
 * May import: build-mode/catalog.js, build-mode/markup.js, build-mode/image.js,
 *             build-mode/site-images.js, breakpoints.js, lib/tag-families.js, code-dock.js (lists).
 * Bus messages: none.
 *
 * The words are Build's (`sveBuildStrings`); a user without Build has none,
 * and the element is written empty, as the toolbar always wrote it.
 */
import { HTML_DIVS, HTML_HEADINGS, HTML_TOOLS } from '../code-dock.js';
import { breakpoints } from '../breakpoints.js';
import { tileForTool } from '../build-mode/catalog.js';
import { caretIn, markupFor } from '../build-mode/markup.js';
import { imageMarkup, pictureMarkup, pictureSizes } from '../build-mode/image.js';
import { siteImageOptions } from '../build-mode/site-images.js';
import { TEXT_TAGS } from '../lib/tag-families.js';

// Read when a button is pressed, not when this file loads: code-dock.js imports the dock's
// files, this one among them, before its own lists exist (a const read here would throw).
const lists = () => ({ htmlTools: HTML_TOOLS, divs: HTML_DIVS, headings: HTML_HEADINGS });
const WORDS = ['heading', 'text', 'button', 'link', 'item'];

function options(win, extra = {}) {
  const config = win?.Statamic?.$config;
  const strings = config?.get?.('sveBuildStrings') || {};
  const rows = breakpoints(win);
  const images = siteImageOptions(win);
  const text = Object.fromEntries(WORDS.map((key) => [key, strings[`new_${key}`] || '']));

  return {
    sectionTag: String(config?.get?.('sveSectionTag') || ''),
    mobile: rows[rows.length - 1]?.tw || 'max-md',
    preset: '2',
    text,
    images: images
      ? { img: imageMarkup(images.quality), picture: pictureMarkup(pictureSizes(rows), images.quality) }
      : null,
    ...extra,
  };
}

function made(entry, opts) {
  const markup = entry ? markupFor(entry, opts) : '';

  if (!markup) {
    return null;
  }

  const caret = caretIn(markup, Object.values(opts.text).filter(Boolean), entry.def);

  return { markup, caret: caret.at, select: caret.select };
}

/**
 * A toolbar button's element: `{ markup, caret, select }`, or null when the
 * button writes no element of Build's (component, pagination, svg) and keeps
 * its own way.
 */
export function toolElement(win, toolId) {
  return made(tileForTool(lists(), toolId), options(win));
}

/**
 * The element a tag button or menu writes — `h2` from the heading menu, `span`
 * from the text menu, a div of the div menu by its classes, a section, a link,
 * a list — or null for a tag Build has no tile for.
 */
export function tagElement(win, tag, classes = '') {
  const name = String(tag || '').toLowerCase();

  if (HTML_HEADINGS.includes(name)) {
    return made(tileForTool(lists(), 'heading'), options(win, { heading: name }));
  }

  if (name === 'div') {
    const div = HTML_DIVS.find((item) => item.classes === String(classes || '').trim());
    const entry = div ? { id: div.id, source: 'div', def: div } : null;

    return made(entry, options(win));
  }

  const tool = HTML_TOOLS.find((item) => item.tag === name);

  if (tool) {
    return made(tileForTool(lists(), tool.id), options(win));
  }

  // The text menu's tags: the Text tile, in the tag picked.
  return TEXT_TAGS.includes(name) ? made(tileForTool(lists(), 'text'), options(win, { textTag: name })) : null;
}

/** The toolbar's buttons, without those the site cannot use (a picture where it makes no images). */
export function toolbarTools(win) {
  return HTML_TOOLS.filter((tool) => !tool.images || siteImageOptions(win));
}
