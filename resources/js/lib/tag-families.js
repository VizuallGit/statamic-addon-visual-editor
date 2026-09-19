/**
 * The families a tag can belong to, and the colour each one wears.
 *
 * One table, read by the HTML tree (a row's icon and chip) and by the HTML
 * pane (a tag name, an Antlers block, a partial call, the toolbar's three
 * Antlers buttons): a `<section>` is the same blue in the tree and in the
 * code, a loop the same indigo, a component the same green. Before this file
 * each surface kept its own colours and they drifted apart; the tree said
 * teal where the pane said green.
 *
 * Seven families: `layout` (sections, divs, lists, tables), `text` (headings,
 * paragraphs, inline text, links and buttons — text you press), `media`,
 * `loop`, `if` (a condition, and any Antlers block that is not a loop),
 * `component` (a partial call) and `other`. Few enough that no two colours
 * sit next to each other.
 *
 * May import: nothing. Values and pure helpers only.
 */

export const FAMILIES = ['layout', 'text', 'media', 'loop', 'if', 'component', 'other'];

/**
 * The dark set is the dock's own: the toolbar's component, loop and if
 * buttons already wore these three; layout, text and media were chosen to
 * sit apart from them. The light set is the same seven, darkened for a white
 * panel — the dock is always dark and reads only the first.
 */
export const FAMILY_COLORS = {
  dark: {
    layout: '#60a5fa',
    text: '#f9a8d4',
    media: '#fb923c',
    loop: '#a5b4fc',
    if: '#e8c468',
    component: '#5eead4',
    other: '#9a9a9a',
  },
  light: {
    layout: '#2563eb',
    text: '#be185d',
    media: '#c2410c',
    loop: '#4f46e5',
    if: '#b45309',
    component: '#0f766e',
    other: '#6b6b6b',
  },
};

/**
 * The seven as CSS custom properties, `--sve-fam-<family>`, for a stylesheet
 * to drop inside a rule. Both surfaces read the colours through these names,
 * so a rule says `var(--sve-fam-loop)` and never a hex.
 */
export function familyCssVars(theme = 'dark') {
  const set = FAMILY_COLORS[theme] || FAMILY_COLORS.dark;

  return FAMILIES.map((family) => `--sve-fam-${family}: ${set[family]};`).join(' ');
}

/** The tags the tree draws with the section mark, and the toolbar's Text button writes. */
export const SECTION_TAGS = ['section', 'article', 'header', 'footer', 'main', 'nav', 'aside'];
export const TEXT_TAGS = ['p', 'span', 'strong', 'em'];

const LAYOUT_TAGS = new Set([
  'div',
  ...SECTION_TAGS,
  'ul',
  'ol',
  'li',
  'dl',
  'dt',
  'dd',
  'menu',
  'form',
  'fieldset',
  'details',
  'summary',
  'dialog',
  'hgroup',
  'address',
  'table',
  'thead',
  'tbody',
  'tfoot',
  'tr',
  'td',
  'th',
  'template',
]);
const TEXT_LIKE_TAGS = new Set([
  ...TEXT_TAGS,
  'b',
  'i',
  'small',
  'blockquote',
  'q',
  'cite',
  'code',
  'pre',
  'label',
  'time',
  'mark',
  'sub',
  'sup',
  'abbr',
  'a',
  'button',
  'input',
  'select',
  'textarea',
  'option',
  'optgroup',
]);
const MEDIA_TAGS = new Set([
  'img',
  'picture',
  'svg',
  'video',
  'audio',
  'iframe',
  'canvas',
  'figure',
  'figcaption',
  'source',
  'object',
  'embed',
]);

/**
 * Which family a thing belongs to.
 *
 * @param {string} tag      the HTML tag name, lower-case
 * @param {string} kind     '' for a tag, 'antlers' for a block, 'component' for a partial call
 * @param {string} antlers  for a block: 'loop' or 'if' — the same split the tree's icon makes,
 *                          so an unfamiliar block wears the if colour, not a new one
 */
export function tagFamily(tag, kind = '', antlers = '') {
  if (kind === 'component') {
    return 'component';
  }

  if (kind === 'antlers') {
    return antlers === 'loop' ? 'loop' : 'if';
  }

  const name = String(tag || '').toLowerCase();

  if (/^h[1-6]$/.test(name) || TEXT_LIKE_TAGS.has(name)) {
    return 'text';
  }

  if (LAYOUT_TAGS.has(name)) {
    return 'layout';
  }

  if (MEDIA_TAGS.has(name)) {
    return 'media';
  }

  return 'other';
}
