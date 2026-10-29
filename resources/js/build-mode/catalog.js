/**
 * How Build's two tabs arrange the dock's own tools.
 *
 * Owner: Build mode (resources/js/build-mode/).
 * May import: lib/tag-families.js, lib/element-kind.js. Pure — no editor, no bus, no DOM.
 * Bus messages: none.
 *
 * Nothing is defined here that the dock already defines. Add's tiles are the
 * HTML toolbar's elements (HTML_TOOLS, HTML_DIVS, HTML_HEADINGS in
 * code-dock.js) and Style's rows are the style row's tools (CSS_TOOLS) — this
 * file only says which group each one sits in. The lists are handed in, never
 * imported, so the arrangement is tested on its own and the editor always
 * hands it the dock's live lists. A tool the dock gains later that no group
 * names lands in Other, in Build, by itself.
 *
 * Build adds only what the dock has no button for yet — Grid with its cells,
 * Button, Divider, Rich text, four more HTML tags, and grid-template-columns in Style —
 * each written in the dock's own shape (`{ id, classes }` like HTML_DIVS,
 * `{ id, title, css, tw }` like CSS_TOOLS), so moving one into the dock is a
 * cut and paste and then it is in both.
 */

import { tagFamily } from '../lib/tag-families.js';

/* ------------------------------------------------------------------ *
 * Add
 * ------------------------------------------------------------------ */

/** Build's own elements, in HTML_TOOLS shape. */
export const BUILD_ELEMENTS = {
  // The site's own button class, as `wrapper` is its container in HTML_DIVS.
  button: { id: 'button', tag: 'a', classes: 'btn' },
  divider: { id: 'divider', tag: 'hr' },
  // A block of prose Content edits with Bard (rich.js): a div of paragraphs, nothing else on it.
  richtext: { id: 'richtext', tag: 'div', rich: true },
  article: { id: 'article', tag: 'article' },
  aside: { id: 'aside', tag: 'aside' },
  nav: { id: 'nav', tag: 'nav' },
  header: { id: 'header', tag: 'header' },
  footer: { id: 'footer', tag: 'footer' },
  figure: { id: 'figure', tag: 'figure' },
};

/**
 * Grid: one grid, its columns (a structure) and rows, an empty div per cell
 * — the cells are what the canvas outlines and drops into. The columns stack
 * on the narrowest size by themselves; that size's variant is the site's
 * (breakpoints()), handed to markup.js.
 */
export const STRUCTURES = [
  { key: '1', parts: [1], cls: 'grid-cols-1', label: '1' },
  { key: '2', parts: [1, 1], cls: 'grid-cols-2', label: '½ + ½' },
  { key: '3', parts: [1, 1, 1], cls: 'grid-cols-3', label: '⅓ × 3' },
  { key: '21', parts: [2, 1], cls: 'grid-cols-[2fr_1fr]', label: '⅔ + ⅓', later: true },
  { key: '12', parts: [1, 2], cls: 'grid-cols-[1fr_2fr]', label: '⅓ + ⅔', later: true },
  { key: '4', parts: [1, 1, 1, 1], cls: 'grid-cols-4', label: '¼ × 4' },
];
export const ROWS = [1, 2, 3];

/**
 * The tiles, by group. `tool` names an HTML_TOOLS id, `div` an HTML_DIVS one,
 * `own` a BUILD_ELEMENTS one, `columns` the Grid picker (columns and rows).
 */
const ADD_LAYOUT = [
  { id: 'section', tool: 'section' },
  { id: 'container', div: 'container' },
  { id: 'grid', columns: true },
  { id: 'flex', div: 'flex' },
  { id: 'div', div: 'div' },
];
const ADD_BASIC = [
  { id: 'heading', tool: 'heading' },
  { id: 'text', tool: 'text' },
  { id: 'richtext', own: 'richtext' },
  { id: 'button', own: 'button' },
  { id: 'link', tool: 'a' },
  { id: 'image', tool: 'img' },
  { id: 'video', tool: 'video' },
  { id: 'list', tool: 'ul' },
  { id: 'divider', own: 'divider' },
];
const ADD_LOGIC = [
  { id: 'loop', tool: 'loop', logic: 'loop' },
  { id: 'if', tool: 'if', logic: 'if' },
];
const ADD_TAGS = ['article', 'aside', 'nav', 'header', 'footer', 'figure'].map((id) => ({ id, own: id }));

/** HTML toolbar buttons that are not an element to put somewhere. */
const NOT_ELEMENTS = new Set(['component', 'pagination']);

/**
 * Add's groups, resolved against the dock's lists. An entry whose dock
 * element is gone is left out rather than drawn dead; a dock element no
 * entry names is offered under Other.
 *
 * @param {{ htmlTools: object[], divs: object[], headings: string[] }} dock
 * @returns {Array<{ id: string, mono?: boolean, items: object[] }>}
 */
export function addGroups(dock = {}) {
  const tools = new Map((dock.htmlTools || []).map((tool) => [tool.id, tool]));
  const divs = new Map((dock.divs || []).map((div) => [div.id, div]));
  // The toolbar's div button is a menu of HTML_DIVS, and those are tiles of their own.
  const named = new Set(['div']);
  const namedDivs = new Set();
  const resolve = (entry) => {
    if (entry.tool) {
      named.add(entry.tool);

      const tool = tools.get(entry.tool);

      return tool ? { ...entry, source: 'tool', def: tool, headings: entry.tool === 'heading' ? dock.headings || [] : undefined } : null;
    }

    if (entry.div) {
      namedDivs.add(entry.div);

      const div = divs.get(entry.div);

      return div ? { ...entry, source: 'div', def: div } : null;
    }

    if (entry.own) {
      return { ...entry, source: 'own', def: BUILD_ELEMENTS[entry.own] };
    }

    return entry.columns ? { ...entry, source: 'columns' } : null;
  };
  const groups = [
    { id: 'layout', items: ADD_LAYOUT.map(resolve).filter(Boolean) },
    { id: 'basic', items: ADD_BASIC.map(resolve).filter(Boolean) },
    { id: 'logic', items: ADD_LOGIC.map(resolve).filter(Boolean) },
    { id: 'tags', mono: true, items: ADD_TAGS.map(resolve).filter(Boolean) },
  ];
  const other = [
    ...[...tools.values()]
      .filter((tool) => !named.has(tool.id) && !NOT_ELEMENTS.has(tool.id) && !tool.action)
      .map((tool) => ({ id: tool.id, tool: tool.id, source: 'tool', def: tool, title: tool.title })),
    // The div menu's other layouts (`flex flex-col` …), under the dock's own words for them.
    ...(dock.divs || [])
      .filter((div) => !namedDivs.has(div.id))
      .map((div) => ({ id: `div:${div.id}`, div: div.id, source: 'div', def: div, lang: div.lang })),
  ];

  if (other.length) {
    groups.push({ id: 'other', items: other });
  }

  return groups.filter((group) => group.items.length);
}

/* ------------------------------------------------------------------ *
 * Style
 * ------------------------------------------------------------------ */

/** Build's own tools, in CSS_TOOLS shape. */
export const BUILD_TOOLS = [
  { id: 'grid-cols', title: 'Grid columns', css: 'grid-template-columns', tw: 'grid-template-columns', menu: 'values' },
  { id: 'tw-weight', title: 'Font weight', css: 'font-weight', tw: 'font-weight', menu: 'choices' },
  { id: 'tw-minw', title: 'Min width', css: 'min-width', tw: 'min-width', menu: 'sizes' },
  // Two declarations each, so a named group as the dock's border widths are (twSetGroup).
  { id: 'tw-shadow', title: 'Shadow', css: 'box-shadow', twGroup: ['shadow-2xs', 'shadow-xs', 'shadow-sm', 'shadow-md', 'shadow-lg', 'shadow-xl', 'shadow-2xl', 'shadow-none'] },
  { id: 'tw-opacity', title: 'Opacity', css: 'opacity', tw: 'opacity', menu: 'values' },
];

/** Children the display tool has no button for yet, in its shape; `glyph` is the sketch's icon. */
export const BUILD_KIDS = {
  main: [{ id: 'justify-evenly', twClass: 'justify-evenly', title: 'Justify: evenly', css: 'justify-content', value: 'space-evenly', glyph: 'jEvenly' }],
  cross: [{ id: 'align-baseline', twClass: 'items-baseline', title: 'Align: baseline', css: 'align-items', value: 'baseline', glyph: 'aBaseline' }],
};

/**
 * The families, in the order the Tailwind pane's icons run, with the CSS_TOOLS
 * ids each one shows. The group's icon is its first tool's icon — the row's
 * own. Effects and Transform & transition have little or nothing in the row
 * yet; they are drawn, and say so.
 */
export const STYLE_GROUPS = [
  { id: 'layout', tools: ['display', 'grid-cols', 'tw-gap'] },
  { id: 'position', tools: ['absolute'] },
  { id: 'size', tools: ['tw-w', 'tw-minw', 'tw-maxw', 'tw-h'] },
  { id: 'spacing', tools: ['padding', 'margin'] },
  { id: 'typography', tools: ['tw-text', 'tw-weight', 'tw-align', 'color', 'tw-leading', 'tw-font'] },
  { id: 'background', tools: ['bg'] },
  { id: 'border', tools: ['tw-border', 'tw-radius', 'tw-border-color'] },
  { id: 'effects', tools: ['tw-shadow', 'tw-opacity', 'tw-overflow'] },
  { id: 'transform', tools: [] },
];

/**
 * Style's groups, resolved against CSS_TOOLS (+ BUILD_TOOLS). A CSS_TOOLS
 * entry no group names goes under Other.
 *
 * @returns {Array<{ id: string, tools: object[] }>}
 */
export function styleGroups(cssTools = []) {
  const all = new Map([...cssTools, ...BUILD_TOOLS].map((tool) => [tool.id, tool]));
  const named = new Set(STYLE_GROUPS.flatMap((group) => group.tools));
  const groups = STYLE_GROUPS.map((group) => ({
    id: group.id,
    tools: group.tools.map((id) => all.get(id)).filter(Boolean),
  }));
  const other = cssTools.filter((tool) => !named.has(tool.id));

  if (other.length) {
    groups.push({ id: 'other', tools: other });
  }

  return groups;
}

/** A tool's own children by id — the box kids of `padding`, the flex kids of `display`. */
export function kidsById(tool) {
  return new Map((tool?.kids || []).map((kid) => [kid.id, kid]));
}

/* ------------------------------------------------------------------ *
 * What an element is, for its name in the panel
 * ------------------------------------------------------------------ */

/* The HTML tree names its rows with the same function (lib/element-kind.js). */
export { elementKind } from '../lib/element-kind.js';

/** Whether an element holds others: Add can put something into it. */
export function holdsElements(node) {
  if (!node || node.hidden || node.locked || node.lockedIn) {
    return false;
  }

  if (node.kind === 'antlers') {
    return true;
  }

  if (node.kind) {
    return false;
  }

  const tag = String(node.tag || '').toLowerCase();

  return tag === 'figure' || (tagFamily(tag) === 'layout' && !ONLY_THEIR_OWN.has(tag));
}

/** Layout tags whose children are their own kind only: a list holds items, a table rows. */
const ONLY_THEIR_OWN = new Set(['ul', 'ol', 'dl', 'menu', 'table', 'thead', 'tbody', 'tfoot', 'tr', 'template']);
