/**
 * What an Add tile does (BuildAdd.vue): its label, its markup and its write.
 *
 * Owner: Build mode (resources/js/build-mode/).
 * May import: build-mode/markup.js, build-mode/place.js. No editor, no bus, no
 *   DOM: everything goes through the port (boot.js).
 * Bus messages: none.
 */

import { markupFor } from './markup.js';
import { addAt } from './place.js';

/** A tile's name: the dock's lang key, its title, Build's `el_` word, or its id. */
export function tileLabel(port, entry) {
  if (entry.lang) {
    return port.t(entry.lang);
  }

  if (entry.title) {
    return entry.title;
  }

  const key = `el_${entry.id}`;
  const word = port.t(key);

  return word === key ? entry.id : word;
}

/**
 * What a tile writes: the toolbar's markup for its element (markup.js).
 *
 * @param {{ structure?: string, rows?: number }} [grid]  a Grid's columns (STRUCTURES key) and rows
 */
export function tileMarkup(port, entry, { structure, rows } = {}) {
  return markupFor(entry, {
    sectionTag: port.sectionTag(),
    mobile: port.mobileVariant(),
    structure,
    rows,
    text: {
      heading: port.t('new_heading'),
      text: port.t('new_text'),
      button: port.t('new_button'),
      link: port.t('new_link'),
      item: port.t('new_item'),
    },
  });
}

/** Into the element at `path` when it holds others, else after it (place.js); the new element is picked. */
export function writeAt(port, path, markup) {
  const out = addAt(port.html(), path, markup);

  if (out) {
    port.write(out.html, { select: out.path });
  }

  return !!out;
}
