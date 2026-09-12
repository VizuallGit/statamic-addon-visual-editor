/**
 * Alpine, as a short list of things a site actually needs.
 *
 * Alpine is attributes on tags — `x-data`, `@click`, `x-show` — so this is not
 * a fourth file, it is a fourth view of the same HTML: pick a tag, see what it
 * does, add something. The Tailwind panel one pane over answers the same shape
 * of question about the same tag, which is why it looks like it.
 *
 * A behaviour is one or two attributes and a name. The name is the whole
 * trick: `open` in `x-data="{ open: false }"` is what `@click` flips and what
 * `x-show` reads, and a designer who never learns anything else about Alpine
 * can build a dropdown by picking the same name twice.
 *
 * Trimmed on purpose. Alpine has far more than this; a list nobody can scan is
 * not a feature in reserve. What is here is what these templates already use —
 * `@click` 14 times, `x-show` 7, `x-transition` 6 — plus the two guards every
 * popup needs and nobody remembers: click outside, and Escape.
 */

/** Where a behaviour's attributes go. */
export const ON_TAG = 'tag';
export const ON_STATE = 'state';

export const ALPINE_GROUPS = [
  { id: 'state', lang: 'alpine_group_state' },
  { id: 'act', lang: 'alpine_group_act' },
  { id: 'react', lang: 'alpine_group_react' },
];

/**
 * `name` is filled in by the panel: either a state the tag already has, or one
 * the reader typed. `|` marks where the caret lands, same as the other snippet
 * lists in this dock.
 */
export const ALPINE_BEHAVIOURS = [
  {
    id: 'state',
    group: 'state',
    label: 'alpine_state',
    icon: 'state',
    needsName: true,
    attrs: [{ name: 'x-data', value: '{ :name: false }' }],
  },
  {
    id: 'state_text',
    group: 'state',
    label: 'alpine_state_text',
    icon: 'state',
    needsName: true,
    attrs: [{ name: 'x-data', value: "{ :name: '|' }" }],
  },

  {
    id: 'toggle',
    group: 'act',
    label: 'alpine_toggle',
    icon: 'toggle',
    needsName: true,
    attrs: [{ name: '@click', value: ':name = !:name' }],
  },
  {
    id: 'open',
    group: 'act',
    label: 'alpine_open',
    icon: 'open',
    needsName: true,
    attrs: [{ name: '@click', value: ':name = true' }],
  },
  {
    id: 'close',
    group: 'act',
    label: 'alpine_close',
    icon: 'close',
    needsName: true,
    attrs: [{ name: '@click', value: ':name = false' }],
  },
  {
    id: 'close_outside',
    group: 'act',
    label: 'alpine_close_outside',
    icon: 'outside',
    needsName: true,
    attrs: [{ name: '@click.outside', value: ':name = false' }],
  },
  {
    id: 'close_escape',
    group: 'act',
    label: 'alpine_close_escape',
    icon: 'escape',
    needsName: true,
    attrs: [{ name: '@keydown.escape.window', value: ':name = false' }],
  },

  {
    id: 'show',
    group: 'react',
    label: 'alpine_show',
    icon: 'show',
    needsName: true,
    attrs: [{ name: 'x-show', value: ':name' }],
  },
  {
    id: 'show_smooth',
    group: 'react',
    label: 'alpine_show_smooth',
    icon: 'show',
    needsName: true,
    attrs: [
      { name: 'x-show', value: ':name' },
      { name: 'x-transition', value: '' },
    ],
  },
  {
    id: 'hide_until_ready',
    group: 'react',
    label: 'alpine_hide_until_ready',
    icon: 'cloak',
    attrs: [{ name: 'x-cloak', value: '' }],
  },
  {
    id: 'class_when',
    group: 'react',
    label: 'alpine_class_when',
    icon: 'klass',
    needsName: true,
    attrs: [{ name: ':class', value: ":name ? '|' : ''" }],
  },
  {
    id: 'text',
    group: 'react',
    label: 'alpine_text',
    icon: 'text',
    needsName: true,
    attrs: [{ name: 'x-text', value: ':name' }],
  },
];

/** Anything Alpine owns: `x-…`, `@…`, and the `:` shorthand for `x-bind:`. */
const ALPINE_ATTR = /^(x-[\w:.-]+|@[\w:.-]+|:[\w-]+)$/;

export function isAlpineAttr(name) {
  return ALPINE_ATTR.test(String(name || ''));
}

/**
 * The attributes on one open tag, in the order they are written.
 *
 * Offsets are relative to `openTag`, so the caller can rewrite one in place
 * without re-finding it.
 *
 * @returns {Array<{name: string, value: string, from: number, to: number, alpine: boolean}>}
 */
export function tagAttrs(openTag) {
  const source = String(openTag || '');
  const out = [];
  // Name, then optionally `=` and a quoted value. Antlers inside a value is
  // left alone: `{{ }}` never closes an attribute, and pulling it apart here
  // would be the one place this file could break a template.
  const re = /([@:a-zA-Z_][\w:.@-]*)(\s*=\s*(["'])([\s\S]*?)\3)?/g;
  let m;
  let first = true;

  while ((m = re.exec(source))) {
    if (first) {
      // The tag name itself.
      first = false;
      continue;
    }

    if (!m[0].trim()) {
      continue;
    }

    out.push({
      name: m[1],
      value: m[4] ?? '',
      from: m.index,
      to: m.index + m[0].length,
      alpine: isAlpineAttr(m[1]),
    });
  }

  return out;
}

/** The state names an `x-data` declares — `{ open: false, tab: 'one' }`. */
export function stateNames(value) {
  const inner = String(value || '').trim().replace(/^\{|\}$/g, '');
  const out = [];
  const re = /(^|,)\s*([a-zA-Z_$][\w$]*)\s*:/g;
  let m;

  while ((m = re.exec(inner))) {
    out.push(m[2]);
  }

  return out;
}

/** Put a name into a behaviour's attributes. */
export function fillName(attrs, name) {
  return attrs.map((attr) => ({
    name: attr.name,
    value: String(attr.value).replaceAll(':name:', `${name}:`).replaceAll(':name', name),
  }));
}
