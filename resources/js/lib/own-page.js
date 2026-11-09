/**
 * Pages with a template of their own (OwnPage.php): the file that is the
 * page's, by entry — known once the HTML tree has asked about the page's
 * template (`/!/sve/template-usage`, `own_page`). On such a page the dock holds
 * that file, the tree draws its rows, and Build's Content and canvas treat it
 * as the page's: no other page shares it.
 *
 * May import: lib/ only.
 */
import { currentEntryId } from './live-preview.js';

/** Entry id → `view:pages/about`. */
const views = new Map();

export function rememberOwnPage(entry, view) {
  if (entry && view) {
    views.set(String(entry), `view:${String(view).replace(/^view:/, '')}`);
  }
}

/** The page's own file as the dock names it (`view:pages/about`), or '' on any other page. */
export function ownPageType(win) {
  const id = currentEntryId(win);

  return id ? views.get(id) || '' : '';
}
