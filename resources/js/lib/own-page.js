/**
 * Pages with a template of their own (OwnPage.php): the file that is the
 * page's, by entry — known once the HTML tree has asked about the page's
 * template (`/!/sve/template-usage`, `own_page`). On such a page the dock holds
 * that file, the tree draws its rows, and Build's Content and canvas treat it
 * as the page's: no other page shares it.
 *
 * A page whose blueprint has a sections field is built from sections as well:
 * its file draws them with a loop over that field, and the tree offers to add
 * the loop where the file has none (`ownPageSections`).
 *
 * May import: lib/ only.
 */
import { currentEntryId } from './live-preview.js';

/** Entry id → `{ type: 'view:pages/about', sections: ['page_sections'] }`. */
const pages = new Map();

export function rememberOwnPage(entry, view, sections = []) {
  if (entry && view) {
    pages.set(String(entry), {
      type: `view:${String(view).replace(/^view:/, '')}`,
      sections: Array.isArray(sections) ? sections.filter((field) => typeof field === 'string' && field) : [],
    });
  }
}

/** The page's own file as the dock names it (`view:pages/about`), or '' on any other page. */
export function ownPageType(win) {
  const id = currentEntryId(win);

  return id ? pages.get(id)?.type || '' : '';
}

/** The sections field of an own page's blueprint, as a list (one at most); [] on any other page. */
export function ownPageSections(win) {
  const id = currentEntryId(win);

  return id ? pages.get(id)?.sections || [] : [];
}
