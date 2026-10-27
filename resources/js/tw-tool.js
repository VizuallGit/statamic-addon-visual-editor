/**
 * What one tool of the Tailwind row does, wherever the button is.
 *
 * The dock's style row (CSS_TOOLS in code-dock.js) and Build mode's Style tab
 * draw the same tools: the same ids, titles and icons, and a click on either
 * is this one function. A tool added to CSS_TOOLS is therefore a tool in
 * both, and changing what a tool writes changes it in both.
 *
 * The rule is the dock's own Tailwind branch (dock/toolbars.js `run`, and
 * the lit state in dock/css-tools.js `paintCssToolStateInner`), lifted out
 * verbatim:
 *
 *   `twClass`  a fixed class, set outright — or taken off when it is there;
 *   `twGroup`  a named list Tailwind does not publish as a scale (border widths);
 *   `tw`       a scale: open the site's own values for that property.
 *
 * Everything is written onto the tag tw-classes.js has picked, through
 * tw-classes.js — never here.
 *
 * May import: tw-classes.js.
 * Bus messages: none of its own (tw-classes.js commits through `dock:set-html`).
 */

import { twActiveClass, twGroupActive, twHasNode, twOpenGroupMenu, twOpenToolMenu, twSetClass } from './tw-classes.js';

/**
 * Run one tool or child. `anchor` is the button the menu opens from;
 * `after(label)` runs once a value was picked from that menu.
 *
 * @returns {'set'|'menu'|''} what the click did
 */
export function runTwTool(win, item, anchor, after) {
  if (!item) {
    return '';
  }

  if (item.twClass) {
    twSetClass(win, item.twClass);

    return 'set';
  }

  if (item.twGroup) {
    twOpenGroupMenu(win, anchor, item.title, item.twGroup, after);

    return 'menu';
  }

  if (item.tw) {
    twOpenToolMenu(win, anchor, item.tw, after);

    return 'menu';
  }

  return '';
}

/**
 * Whether the picked tag has what this tool sets — the row's lit state.
 *
 * One difference from the dock's row, on purpose: a fixed-class child
 * (`flex`, `justify-center`) is lit when its class is on the tag. The row
 * asks `twActiveClass(kid.tw)`, and those children carry no `tw`, so there
 * they are never lit in Tailwind mode. Whether the row follows is for the
 * step that points it at this file.
 */
export function twToolActive(item) {
  if (!item || !twHasNode()) {
    return false;
  }

  if (item.twClass) {
    return twActiveClass(item.css || item.tw) === item.twClass;
  }

  return item.twGroup ? !!twGroupActive(item.twGroup) : !!item.tw && !!twActiveClass(item.tw);
}
