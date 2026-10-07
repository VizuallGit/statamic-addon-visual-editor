/**
 * Bard styles in the popup: the rules a style is held to, the CSS its preview
 * paints, and the values offered for a property.
 *
 * The list belongs to the bard-style addon, which checks the same rules again
 * on save and has the last word (src/Styles.php there). The codes here are its
 * codes, so one message table serves both: `bard_styles_err_{code}`.
 *
 * May import: nothing.
 */

/** span: a property on the marked words (or the whole paragraph); paragraph: a class on it; div: a wrapper with a class. */
export const STYLE_TYPES = ['span', 'paragraph', 'div'];

/** The properties a span style is usually made of; any other CSS property may be typed. */
export const PROPS = [
  'font-size',
  '--flow-space',
  'color',
  'text-transform',
  'font-weight',
  'font-style',
  'letter-spacing',
  'line-height',
  'text-decoration',
  'font-family',
];

const KEYWORDS = {
  'text-transform': ['uppercase', 'lowercase', 'capitalize', 'none'],
  'font-weight': ['300', '400', '500', '600', '700', '800', '900'],
  'font-style': ['italic', 'normal'],
  'text-decoration': ['underline', 'line-through', 'none'],
  'letter-spacing': ['0.05em', '0.1em', '0.2em', 'normal'],
  'line-height': ['1', '1.2', '1.5', 'normal'],
};

/** Properties that take a length: offered the theme's fluid sizes. */
const SIZE_PROPS = new Set(['font-size', '--flow-space', 'letter-spacing', 'margin-block-start', 'margin-block-end']);

/**
 * What the value field offers for `prop`: the theme's sizes as `var(--size-*)`,
 * its colors as `var(--primary-500)` …, and a property's keywords.
 */
export function valueSuggestions(prop, { sizes = [], colors = [] } = {}) {
  if (prop === 'color' || prop === 'background-color') {
    return colors.map((name) => `var(${name})`);
  }

  return [...(SIZE_PROPS.has(prop) ? sizes.map((name) => `var(--${name})`) : []), ...(KEYWORDS[prop] || [])];
}

/** A handle from a name, the way Statamic makes field handles. Styles use `_`, groups `-` (as the shipped ones do). */
export function slug(name, sep = '_') {
  const out = String(name || '')
    .replace(/æ/gi, 'ae')
    .replace(/ø/gi, 'oe')
    .replace(/å/gi, 'aa')
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, sep)
    .replace(/^[^a-z]+/, '');

  return out.endsWith(sep) ? out.replace(new RegExp(`${sep}+$`), '') : out;
}

/** Button text from a name: its first two letters, the first one capital ("Title text" → "Ti"). */
export function identFrom(name) {
  const word = String(name || '').trim();

  return word ? word[0].toUpperCase() + word.slice(1, 2).toLowerCase() : '';
}

/** Is the button text an inline svg (drawn as markup) rather than letters? */
export function identIsSvg(ident) {
  return String(ident || '').trimStart().startsWith('<');
}

/** The same test the server makes before it lets markup into the toolbar. */
export function identOk(ident) {
  const value = String(ident || '').trim();

  if (!identIsSvg(value)) {
    return value.length <= 6;
  }

  return value.startsWith('<svg') && value.length <= 4000 && !/<script|<foreignObject|\son[a-z]+\s*=|javascript:/i.test(value);
}

/** Problems with one group, as `{ field: code }`. */
export function groupProblems(group, groups) {
  const out = {};

  if (!/^[a-z][a-z0-9_-]*$/.test(group.handle || '')) {
    out.handle = 'handle_format';
  } else if (groups.some((other) => other !== group && other.handle === group.handle)) {
    out.handle = 'handle_taken';
  }

  if (!String(group.name || '').trim()) {
    out.name = 'required';
  }

  if (!identOk(group.ident)) {
    out.ident = 'ident_format';
  }

  return out;
}

/** Problems with one style, as `{ field: code }`. */
export function styleProblems(style, styles, groupHandles) {
  const out = {};

  if (!/^[a-z][a-z0-9_]*$/.test(style.handle || '')) {
    out.handle = 'handle_format';
  } else if (styles.some((other) => other !== style && other.handle === style.handle)) {
    out.handle = 'handle_taken';
  }

  if (!String(style.name || '').trim()) {
    out.name = 'required';
  }

  if (!identOk(style.ident)) {
    out.ident = 'ident_format';
  }

  if (style.type === 'span') {
    if (!/^(--)?[a-z][a-z0-9-]*$/.test(String(style.prop || '').trim())) {
      out.prop = 'prop_format';
    }

    const value = String(style.value || '').trim();

    if (!value || /[;{}<>"]/.test(value)) {
      out.value = 'value_format';
    }
  } else {
    if (!/^-?[A-Za-z_][A-Za-z0-9_-]*( -?[A-Za-z_][A-Za-z0-9_-]*)*$/.test(String(style.class || '').trim().replace(/\s+/g, ' '))) {
      out.class = 'class_format';
    }

    if (/[{}<>]/.test(style.cp_css || '')) {
      out.cp_css = 'css_format';
    }
  }

  if (style.group) {
    if (!groupHandles.includes(style.group)) {
      out.group = 'group_missing';
    } else if (style.type === 'div') {
      out.group = 'group_div';
    }
  }

  return out;
}

/** A style as the server stores it: only its type's fields, trimmed. */
export function styleForSave(style) {
  const out = {
    handle: style.handle.trim(),
    type: style.type,
    name: style.name.trim(),
    ident: String(style.ident || '').trim(),
  };

  if (style.type === 'span') {
    out.prop = String(style.prop || '').trim();
    out.value = String(style.value || '').trim();

    if (style.target === 'block') {
      out.target = 'block';
    }
  } else {
    out.class = String(style.class || '').trim().replace(/\s+/g, ' ');

    if (String(style.cp_css || '').trim()) {
      out.cp_css = String(style.cp_css).trim();
    }
  }

  if (style.group) {
    out.group = style.group;
  }

  return out;
}

export function groupForSave(group) {
  return { handle: group.handle.trim(), name: group.name.trim(), ident: String(group.ident || '').trim() };
}

/** The inline CSS a style's preview gets: its property for a span, its editor CSS otherwise. */
export function previewCss(style) {
  if (style.type === 'span') {
    const prop = String(style.prop || '').trim();
    const value = String(style.value || '').trim();

    return prop && value && !/[;{}<>"]/.test(value) ? `${prop}: ${value}` : '';
  }

  return /[{}<>]/.test(style.cp_css || '') ? '' : String(style.cp_css || '');
}
