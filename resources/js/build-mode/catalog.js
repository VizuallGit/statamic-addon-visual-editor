/**
 * How Build's two tabs arrange the dock's own tools.
 *
 * Owner: Build mode (resources/js/build-mode/).
 * May import: lib/tag-families.js, lib/element-kind.js, build-mode/site-images.js. Pure — no editor, no bus, no DOM (the site's config read for the Picture tile).
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
 * Build adds only what the dock has no button for yet — Grid,
 * Button, Divider, Rich text, SVG, a numbered list, four more HTML tags, and grid-template-columns in Style —
 * each written in the dock's own shape (`{ id, classes }` like HTML_DIVS,
 * `{ id, title, css, tw }` like CSS_TOOLS), so moving one into the dock is a
 * cut and paste and then it is in both.
 */

import { tagFamily } from '../lib/tag-families.js';
import { siteImageOptions } from './site-images.js';

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
  // Images in a Tailwind grid, by hand or from an assets field (gallery.js).
  gallery: { id: 'gallery', tag: 'div', gallery: true },
  // Statamic's `{{ svg }}` for a file of the site's SVG folder, picked first (svg.js, BuildSvgPopup.vue).
  svg: { id: 'svg', tag: 'svg', svg: true },
  article: { id: 'article', tag: 'article' },
  aside: { id: 'aside', tag: 'aside' },
  nav: { id: 'nav', tag: 'nav' },
  header: { id: 'header', tag: 'header' },
  footer: { id: 'footer', tag: 'footer' },
  figure: { id: 'figure', tag: 'figure' },
  ol: { id: 'ol', tag: 'ol' },
};

/**
 * A grid's columns and rows in one click: Add's Grid picker (BuildGridPicker.vue)
 * and Style's tiles (BuildStyle.vue), which stand them behind the grid's own.
 * One row is no rows class. Add writes the grid empty (markup.js): what goes in
 * it is picked after, and the columns stack on the narrowest size by themselves.
 */
export const GRID_PRESETS = [
  { key: '1', parts: [1], cls: 'grid-cols-1', rows: 1, label: '1' },
  { key: '2', parts: [1, 1], cls: 'grid-cols-2', rows: 1, label: '½ + ½' },
  { key: '3', parts: [1, 1, 1], cls: 'grid-cols-3', rows: 1, label: '⅓ × 3' },
  { key: '4', parts: [1, 1, 1, 1], cls: 'grid-cols-4', rows: 1, label: '¼ × 4' },
  { key: '2x2', parts: [1, 1], cls: 'grid-cols-2', rows: 2, label: '2 × 2' },
  { key: '3x2', parts: [1, 1, 1], cls: 'grid-cols-3', rows: 2, label: '3 × 2' },
  { key: '4x2', parts: [1, 1, 1, 1], cls: 'grid-cols-4', rows: 2, label: '4 × 2' },
  { key: '3x3', parts: [1, 1, 1], cls: 'grid-cols-3', rows: 3, label: '3 × 3' },
  { key: '21', parts: [2, 1], cls: 'grid-cols-[2fr_1fr]', rows: 1, label: '⅔ + ⅓' },
  { key: '12', parts: [1, 2], cls: 'grid-cols-[1fr_2fr]', rows: 1, label: '⅓ + ⅔' },
  { key: '121', parts: [1, 2, 1], cls: 'grid-cols-[1fr_2fr_1fr]', rows: 1, label: '¼ + ½ + ¼' },
  { key: '6', parts: [1, 1, 1, 1, 1, 1], cls: 'grid-cols-6', rows: 1, label: '⅙ × 6' },
];
/** What a grid starts with besides its columns: the site's gutter between its cells, as `wrapper` is its container. */
export const GRID_GAP = 'gap-gutter';

/**
 * The tiles, by group. `tool` names an HTML_TOOLS id, `div` an HTML_DIVS one,
 * `own` a BUILD_ELEMENTS one, `columns` the Grid picker (GRID_PRESETS).
 */
const ADD_LAYOUT = [
  { id: 'section', tool: 'section' },
  { id: 'container', div: 'container' },
  { id: 'grid', columns: true },
  { id: 'flex', div: 'flex' },
  { id: 'div', div: 'div' },
  { id: 'list', tool: 'ul', lang: 'tile_ul' },
  { id: 'ol', own: 'ol', lang: 'tile_ol' },
];
const ADD_BASIC = [
  { id: 'heading', tool: 'heading' },
  { id: 'text', tool: 'text' },
  { id: 'richtext', own: 'richtext' },
  { id: 'button', own: 'button' },
  { id: 'link', tool: 'a' },
  { id: 'image', tool: 'img' },
  { id: 'picture', tool: 'picture' },
  { id: 'gallery', own: 'gallery' },
  { id: 'svg', own: 'svg' },
  { id: 'video', tool: 'video' },
  { id: 'divider', own: 'divider' },
];
const ADD_LOGIC = [
  { id: 'loop', tool: 'loop', logic: 'loop' },
  { id: 'if', tool: 'if', logic: 'if' },
];
const ADD_TAGS = ['article', 'aside', 'nav', 'header', 'footer', 'figure'].map((id) => ({ id, own: id }));

/** HTML toolbar buttons with no tile of that id: not an element to put somewhere, or Build's own tile writes it. */
const NOT_ELEMENTS = new Set(['component', 'pagination', 'grid', 'richtext', 'gallery', 'button', 'svg', 'hr']);

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

      // A picture is the site's image work (image.js): no tile where the site does not do it.
      if (tool?.images && !siteImageOptions()) {
        return null;
      }

      return tool
        ? { ...entry, source: 'tool', def: tool, headings: entry.tool === 'heading' ? dock.headings || [] : undefined }
        : null;
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

/** Dock buttons Build writes with a tile of its own (NOT_ELEMENTS): the tile's id. */
const TOOL_TILES = { grid: 'grid', richtext: 'richtext', gallery: 'gallery', button: 'button', hr: 'divider' };

/**
 * The Add tile a dock HTML button writes the same element as — so the button
 * and the tile write one markup (dock/element-markup.js). Null for a button
 * that is no element to add (component, pagination) or has its own way (svg).
 */
export function tileForTool(dock, toolId) {
  const want = TOOL_TILES[toolId];

  for (const group of addGroups(dock)) {
    const hit = group.items.find((entry) => (want ? entry.id === want : entry.tool === toolId));

    if (hit) {
      return hit;
    }
  }

  return null;
}

/**
 * What can stand at the top of a file with no section of the page in it: a
 * Section, a plain Div, or a Loop or If, which is no element. All else goes
 * inside one of them (new-section.js says what a page built from sections takes).
 */
export function startsFile(entry) {
  return (
    !!entry?.logic ||
    (entry?.source === 'tool' && entry.def?.tag === 'section') ||
    (entry?.source === 'div' && entry.def?.id === 'div')
  );
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
  {
    id: 'tw-shadow',
    title: 'Shadow',
    css: 'box-shadow',
    twGroup: [
      'shadow-2xs',
      'shadow-xs',
      'shadow-sm',
      'shadow-md',
      'shadow-lg',
      'shadow-xl',
      'shadow-2xl',
      'shadow-none',
    ],
  },
  { id: 'tw-opacity', title: 'Opacity', css: 'opacity', tw: 'opacity', menu: 'values' },
];

/** Children the display tool has no button for yet, in its shape; `glyph` is the sketch's icon. */
export const BUILD_KIDS = {
  main: [
    {
      id: 'justify-evenly',
      twClass: 'justify-evenly',
      title: 'Justify: evenly',
      css: 'justify-content',
      value: 'space-evenly',
      glyph: 'jEvenly',
    },
  ],
  cross: [
    {
      id: 'align-baseline',
      twClass: 'items-baseline',
      title: 'Align: baseline',
      css: 'align-items',
      value: 'baseline',
      glyph: 'aBaseline',
    },
  ],
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

/* A choice among fixed classes, drawn as buttons: [class, what the button shows, its title]. */
const seg = (label, options, extra = {}) => ({
  label,
  seg: options,
  names: options.map((option) => option[0]),
  ...extra,
});
const value = (css, extra = {}) => ({ label: css, css, ...extra });
const named = (css, extra = {}) => ({ label: css, css, named: true, ...extra });
const color = (css, extra = {}) => ({ label: css, css, color: true, ...extra });
/* A utility of its own under a property several share (`blur` and `contrast` are both `filter`): `only` is what its rows set. */
const utility = (label, roots, extra = {}) => ({ label, roots: [].concat(roots), ...extra });

/**
 * Where a child of a grid or a flex row stands among its siblings: Layout's
 * Order, drawn under Grid item (BuildStyle.vue). A placement: inside a section
 * that says a field (`data-position="{{ image_position }}"`) it is written for
 * the value that field stands on (boot.js `placedAt`), as the grid's are.
 */
export const ORDER_FIELD = seg(
  'order',
  [
    ['order-first', '#first', 'first'],
    ['order-last', '#last', 'last'],
    ['order-none', 'x', 'none'],
  ],
  { wide: true, placement: true }
);

/**
 * The fields beyond the ones BuildStyle.vue draws by hand, by family. Every one
 * writes a Tailwind class through the pane's own functions, so a value set here
 * and one added with the dock's + are the same class in the same place.
 *
 * `css` is a field on the scale Tailwind publishes for that property; `roots`
 * one for a utility, because the property alone says too little; `names` a
 * list named here, because Tailwind has no scale for it (a width that also
 * sets a style, `break-normal`). Anything not listed is still in the + menu.
 */
export const STYLE_FIELDS = {
  position: [value('z-index'), value('inset'), value('top'), value('right'), value('bottom'), value('left')],
  size: [value('aspect-ratio'), named('object-fit'), named('object-position', { wide: true })],
  typography: [
    seg(
      'text-decoration',
      [
        ['no-underline', 'x', 'none'],
        ['line-through', 'strike', 'line-through'],
        ['underline', 'underline', 'underline'],
        ['overline', 'overline', 'overline'],
      ],
      { wide: true }
    ),
    color('text-decoration-color', { wide: true }),
    value('text-decoration-thickness'),
    value('text-underline-offset'),
    seg('font-style', [
      ['not-italic', 'x', 'normal'],
      ['italic', 'italic', 'italic'],
    ]),
    seg('direction', [
      ['[direction:ltr]', 'arrowR', 'ltr'],
      ['[direction:rtl]', 'arrowL', 'rtl'],
    ]),
    seg(
      'text-transform',
      [
        ['normal-case', 'x', 'none'],
        ['uppercase', '#AB', 'uppercase'],
        ['capitalize', '#Ab', 'capitalize'],
        ['lowercase', '#ab', 'lowercase'],
      ],
      { wide: true }
    ),
    named('white-space'),
    named('text-wrap'),
    named('overflow-wrap'),
    utility('word-break', [], { names: ['break-normal', 'break-all', 'break-keep'] }),
    value('letter-spacing'),
    value('text-indent'),
    value('columns'),
    value('column-gap'),
    named('vertical-align', { wide: true }),
  ],
  background: [
    utility('background-image', [], { match: /^bg-\[url\(/, image: true, wide: true }),
    named('background-size'),
    named('background-position'),
    named('background-repeat'),
    named('background-clip'),
    utility('gradient', [], {
      names: [
        'bg-linear-to-t',
        'bg-linear-to-tr',
        'bg-linear-to-r',
        'bg-linear-to-br',
        'bg-linear-to-b',
        'bg-linear-to-bl',
        'bg-linear-to-l',
        'bg-linear-to-tl',
        'bg-none',
      ],
      wide: true,
    }),
    utility('from', 'from', { only: '--tw-gradient-from:', swatch: true }),
    utility('via', 'via', { only: '--tw-gradient-via:', swatch: true }),
    utility('to', 'to', { only: '--tw-gradient-to:', swatch: true, wide: true }),
  ],
  border: [
    named('border-style', { wide: true }),
    utility('outline-width', [], {
      names: ['outline', 'outline-0', 'outline-1', 'outline-2', 'outline-4', 'outline-8'],
    }),
    named('outline-style'),
    color('outline-color', { wide: true }),
    value('outline-offset', { wide: true }),
  ],
  effects: [
    named('cursor'),
    named('mix-blend-mode'),
    named('backface-visibility'),
    utility('text-shadow', 'text-shadow', { only: 'text-shadow:' }),
    utility('blur', 'blur'),
    utility('brightness', 'brightness'),
    utility('contrast', 'contrast'),
    utility('drop-shadow', 'drop-shadow', { only: 'filter:' }),
    utility('grayscale', 'grayscale'),
    utility('hue-rotate', ['hue-rotate', '-hue-rotate']),
    utility('invert', 'invert'),
    utility('saturate', 'saturate'),
    utility('sepia', 'sepia'),
    utility('backdrop-blur', 'backdrop-blur'),
  ],
  transform: [
    utility('rotate', ['rotate', '-rotate']),
    utility('scale', ['scale', '-scale']),
    utility('scale-x', ['scale-x', '-scale-x']),
    utility('scale-y', ['scale-y', '-scale-y']),
    utility('skew-x', ['skew-x', '-skew-x']),
    utility('skew-y', ['skew-y', '-skew-y']),
    utility('translate-x', ['translate-x', '-translate-x']),
    utility('translate-y', ['translate-y', '-translate-y']),
    named('transform-origin', { wide: true }),
    utility('transition', [], {
      names: [
        'transition',
        'transition-all',
        'transition-colors',
        'transition-opacity',
        'transition-shadow',
        'transition-transform',
        'transition-none',
      ],
      wide: true,
    }),
    value('transition-duration'),
    value('transition-delay'),
    named('transition-timing-function'),
    utility('animation', 'animate'),
  ],
};

/**
 * What stands in front of each family: the fields BuildStyle.vue draws by hand
 * by their property, STYLE_FIELDS ones by their label. The rest of a family
 * named here waits under its More, folded; Layout and Spacing are not named,
 * and show everything. A field with a value stands wherever it sits: nothing
 * set is ever hidden.
 */
export const STYLE_FRONT = {
  position: ['position', 'z-index'],
  size: ['width', 'height', 'max-width'],
  typography: ['font-size', 'font-weight', 'line-height', 'text-align', 'color'],
  background: ['background-color', 'background-image'],
  border: ['border-width', 'border-radius', 'border-color'],
  effects: ['opacity', 'box-shadow'],
  transform: ['rotate', 'scale', 'transition', 'transition-duration'],
};

/** Whether a family's field waits under More rather than standing in front. */
export function inMore(family, name) {
  return !!STYLE_FRONT[family] && !STYLE_FRONT[family].includes(name);
}

/**
 * Whether a class is a field's own. `rootOfClass` is the catalog's answer for
 * what utility a class belongs to; passed in, as `propertyOf` is to
 * effectiveClass. Never asked for a field on `css`, which the catalog sorts by
 * the property it sets.
 */
export function fieldHas(field, name, rootOfClass) {
  if (field.names) {
    return field.names.includes(name);
  }

  if (field.match) {
    return field.match.test(name);
  }

  return (field.roots || []).includes(rootOfClass(name));
}

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
