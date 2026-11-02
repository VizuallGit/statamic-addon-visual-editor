/**
 * Style's fields speak in classes (`pt-[5rem]`, `flex`), the CSS mode's file in
 * declarations (`padding-top: 5rem`). This goes between the two, so the fields
 * stay as they are and no class ever reaches the file.
 *
 * Owner: Build mode, the CSS mode demo (resources/js/build-mode/css-mode/).
 * May import: build-mode/classes.js, css-mode/parts.js. Pure: what Tailwind
 * compiles a class to is handed in (`ruleOf`, the site's catalog), so nothing here
 * is a table of values of its own.
 * Bus messages: none.
 *
 * A class Tailwind builds on its own plumbing (`var(--tw-…)`: a shadow, a blur,
 * a gradient) is read for what the plumbing comes to: the shadow's value, the
 * blur's share of `filter`. What still holds a `--tw-` variable after that has no
 * plain CSS: `planOf` says null rather than leave one in a file meant to be free of it.
 */

import { kindOf, rootOf, toClass } from '../classes.js';
import { isPartProp, partsOf, splitTop } from './parts.js';

/** `a: b; c: url(x;y)` → declarations, a `;` inside parentheses or quotes not ending one. */
export function parseDeclarations(text) {
  const source = String(text || '');
  const out = [];
  let start = 0;
  let depth = 0;
  let quote = '';

  const push = (end) => {
    const part = source.slice(start, end);
    const colon = part.indexOf(':');

    if (colon !== -1) {
      out.push({ prop: part.slice(0, colon).trim().toLowerCase(), value: part.slice(colon + 1).trim() });
    }
  };

  for (let i = 0; i < source.length; i += 1) {
    const ch = source[i];

    if (quote) {
      quote = ch === quote ? '' : quote;
    } else if (ch === '"' || ch === "'") {
      quote = ch;
    } else if (ch === '(') {
      depth += 1;
    } else if (ch === ')') {
      depth -= 1;
    } else if (ch === ';' && depth <= 0) {
      push(i);
      start = i + 1;
    }
  }

  push(source.length);

  return out;
}

/* ---------------- a class, as plain CSS ---------------- */

/** Tailwind's own values, which no build of the site is sure to print; the site's tokens stay variables. */
const LITERAL = /var\(\s*(--(?:blur|drop-shadow|ease|animate|default-transition|text-shadow)(?:-[\w-]*)?)\s*\)/g;

const VAR_START = /var\(\s*(--tw-[\w-]+)\s*(,)?/;

/** Each `var(--tw-…)` in a value: what the class gives it, else its fallback, else nothing. */
function resolvePlumbing(value, local) {
  let text = String(value);

  for (;;) {
    const match = VAR_START.exec(text);

    if (!match) {
      return text;
    }

    let depth = 1;
    let end = match.index + match[0].length;

    for (; end < text.length && depth > 0; end += 1) {
      depth += text[end] === '(' ? 1 : text[end] === ')' ? -1 : 0;
    }

    const fallback = match[2] ? text.slice(match.index + match[0].length, end - 1).trim() : '';
    const instead = local.has(match[1]) ? local.get(match[1]) : fallback;

    text = `${text.slice(0, match.index)}${instead}${text.slice(end)}`;
  }
}

/** A comma list that lost members to nothing, or named Tailwind's variables (`transition`'s list), whitespace made one. */
function tidy(value) {
  const parts = splitTop(value, ',').filter((part) => !/^--tw-[\w-]+$/.test(part));

  return parts.join(', ').replace(/\s+/g, ' ').trim();
}

/** The rule's own declarations and its `@property` starting values; null when it is more than one plain rule. */
function readRuleText(rule) {
  const [body, ...properties] = String(rule || '').split(/^@property/m);
  const initial = new Map();
  const decls = [];
  let depth = 0;
  let skip = 0;
  let rules = 0;

  for (const block of properties) {
    const named = /^\s*(--[\w-]+)/.exec(block);
    const value = /initial-value:\s*([^;]*);/.exec(block);

    if (named && value) {
      initial.set(named[1], value[1].trim());
    }
  }

  for (const raw of body.split('\n')) {
    const line = raw.trim();

    if (line.endsWith('{')) {
      if (depth === 0) {
        rules += 1;
      } else if (line.startsWith('@supports')) {
        // A newer browser's better form of what is declared outside it.
        skip = depth;
      } else if (!skip) {
        return null;
      }

      depth += 1;
    } else if (line === '}') {
      depth -= 1;
      skip = skip === depth ? 0 : skip;
    } else if (!skip && depth === 1 && line.endsWith(';') && line.includes(':')) {
      const colon = line.indexOf(':');

      decls.push({ prop: line.slice(0, colon).trim(), value: line.slice(colon + 1, -1).trim() });
    }
  }

  return rules === 1 ? { decls, initial } : null;
}

const FILTER = /^--tw-(blur|brightness|contrast|grayscale|hue-rotate|invert|saturate|sepia|drop-shadow)$/;
const BACKDROP = /^--tw-backdrop-(blur|brightness|contrast|grayscale|hue-rotate|invert|opacity|saturate|sepia)$/;
const TRANSFORM = /^--tw-(rotate-x|rotate-y|rotate-z|skew-x|skew-y)$/;
const AXIS = /^--tw-(translate|scale)-(x|y)$/;
const STOP = /^--tw-gradient-(position|from|via|to)$/;

/** Which part of which shared value a `--tw-` variable is. */
function partOfVariable(name, value) {
  const fn = /^([a-zA-Z-]+)\(/.exec(value)?.[1];
  const axis = AXIS.exec(name);
  const stop = STOP.exec(name);

  if (FILTER.test(name)) {
    return { prop: 'filter', key: FILTER.exec(name)[1] };
  }

  if (BACKDROP.test(name)) {
    return { prop: 'backdrop-filter', key: fn || BACKDROP.exec(name)[1] };
  }

  if (TRANSFORM.test(name) && fn) {
    return { prop: 'transform', key: fn };
  }

  if (axis) {
    return { prop: axis[1], key: axis[2] };
  }

  return stop ? { prop: 'background-image', key: stop[1] } : null;
}

/**
 * What a class stands for in plain CSS, or null when it has none.
 *
 * `decls` are its declarations; a `soft` one is what the class falls back on
 * (`transition`'s duration, `border-2`'s solid): written when nothing is there,
 * never counted as the class, and left when something else has been chosen.
 * `parts` are its shares of a value several fields hold together (parts.js);
 * an empty value is the class that says "none" (`blur-none`). `keyframes` is the
 * animation it needs in the file.
 *
 * @param {string} rule  what Tailwind compiles the class to (`catalog.rule`)
 * @param {(name: string) => (string|undefined)} themeValue  a theme variable's value
 */
export function planOf(rule, themeValue = () => undefined) {
  const read = readRuleText(rule);

  if (!read) {
    return null;
  }

  const literal = (value) => value.replace(LITERAL, (all, name) => themeValue(name) ?? all);
  const local = new Map(read.decls.filter((decl) => decl.prop.startsWith('--tw-')).map((decl) => [decl.prop, literal(decl.value)]));
  const plan = { decls: [], parts: [], keyframes: '' };
  const clean = (value) => tidy(resolvePlumbing(value, local));

  for (const [name, value] of local) {
    // A shadow's size holds what its colour falls back on; its variable names a theme value.
    const text = clean(name === '--tw-drop-shadow' && local.has('--tw-drop-shadow-size') ? local.get('--tw-drop-shadow-size') : value);
    const part = partOfVariable(name, text);

    if (part) {
      plan.parts.push({ ...part, value: text });
    }
  }

  for (const { prop, value } of read.decls) {
    const shared = isPartProp(prop) && /var\(--tw-/.test(value);

    if (!prop.startsWith('--') && prop !== '-webkit-backdrop-filter' && !shared) {
      const whole = /^var\(\s*(--tw-[\w-]+)\s*(,[\s\S]*)?\)$/.exec(value);
      const given = whole && local.has(whole[1]);
      const text = clean(literal(value));
      const taken = isPartProp(prop) && !plan.parts.length ? partsOf(prop, text) : null;

      if (taken) {
        taken.forEach((one, key) => plan.parts.push({ prop, key, value: one }));
      } else if (whole && !given) {
        const soft = whole[2] ? text : read.initial.get(whole[1]);

        if (soft) {
          plan.decls.push({ prop, value: soft, soft: true });
        }
      } else if (text) {
        plan.decls.push({ prop, value: text });
      }
    }
  }

  if ((!plan.parts.length && !plan.decls.length) || [...plan.decls, ...plan.parts].some((one) => /--tw-/.test(one.value))) {
    return null;
  }

  const moving = plan.decls.find((decl) => decl.prop === 'animation')?.value;

  plan.keyframes = moving && moving !== 'none' ? moving.split(/\s+/)[0] : '';

  return plan;
}

const same = (value) => String(value || '').replace(/\s+/g, ' ').trim().toLowerCase();
const MIX = /^color-mix\(in oklab, (.+) (\d+(?:\.\d+)?)%, transparent\)$/;
const hardOf = (plan) => plan.decls.filter((decl) => !decl.soft);
const partsKey = (prop, list) => `${prop}|${list.map(([key, value]) => `${key}=${same(value)}`).sort().join('&')}`;

/** A part's own words inside its function: `blur(3px)` is `3px`. */
const innerOf = (value) => /^[a-zA-Z-]+\((.*)\)$/s.exec(value)?.[1] ?? value;

/** The utility a part's typed value is written after. */
function typedRoot(prop, key) {
  if (prop === 'transform') {
    return { skewX: 'skew-x', skewY: 'skew-y' }[key] || '';
  }

  if (prop === 'filter') {
    return key;
  }

  if (prop === 'backdrop-filter') {
    return `backdrop-${key}`;
  }

  return prop === 'background-image' ? (key === 'position' ? '' : key) : `${prop}-${key}`;
}

/**
 * Classes and declarations, both ways: what a class writes (`planFor`) and the
 * class a declaration reads as (`nameFor`, `namesForParts`), so the fields can go
 * on speaking in classes.
 *
 * @param {object} source
 * @param {(name: string) => string} source.ruleOf  what Tailwind compiles a class to
 * @param {(name: string) => (string|undefined)} [source.themeValue]
 * @param {(prop: string) => string[]} source.scale  the site's scale for a property
 * @param {() => ?string[]} [source.named]  the names Style's fields list by hand and by utility; null until they are known
 */
export function createTranslator({ ruleOf, themeValue = () => undefined, scale, named = () => [] }) {
  const plans = new Map();
  const planFor = (name) => {
    if (!plans.has(name)) {
      plans.set(name, planOf(ruleOf(name), themeValue));
    }

    return plans.get(name);
  };

  let sorted = null;

  /** The fields' names by what they set. Not kept while the site's catalog is still on its way (`named` says null). */
  function namedSorted() {
    if (sorted) {
      return sorted;
    }

    const list = named();
    const byProp = new Map();
    const byParts = new Map();
    const several = [];

    // `w-1/2` reads as `w-1` to everything that takes a class apart (`/2` is an opacity to it): those read as a typed value.
    for (const name of (list || []).filter((one) => !one.includes('/'))) {
      const plan = planFor(name);

      if (plan?.parts.length) {
        const key = partsKey(plan.parts[0].prop, plan.parts.map((part) => [part.key, part.value]));

        if (!byParts.has(key)) {
          byParts.set(key, name);
        }
      }

      if (plan && hardOf(plan).length === 1 && !plan.parts.length) {
        const { prop } = hardOf(plan)[0];

        byProp.set(prop, [...(byProp.get(prop) || []), name]);
      }

      if (plan && hardOf(plan).length > 1 && !plan.parts.length) {
        several.push({ name, hard: hardOf(plan) });
      }
    }

    const out = { byProp, byParts, several };

    sorted = list ? out : null;

    return out;
  }

  const says = (name, prop, value) => {
    const plan = planFor(name);
    const hard = plan ? hardOf(plan) : [];

    return !plan?.parts.length && hard.length === 1 && hard[0].prop === prop && same(hard[0].value) === same(value);
  };

  /**
   * The class a field reads a declaration as: the row of the property's scale
   * that compiles to it, else one of the fields' own, else the value typed after
   * the scale's root (`pt-[5rem]`), else Tailwind's way of naming any property
   * (`[inset:0]`). A candidate that does not compile back to it is not used.
   */
  function nameFor(prop, value) {
    // A colour with an alpha is the colour's class with that alpha, as Tailwind compiles it.
    const mix = MIX.exec(String(value).trim());
    const mixed = mix ? `${nameFor(prop, mix[1])}/${mix[2]}` : '';

    if (mixed && !mixed.startsWith('[') && says(mixed, prop, value)) {
      return mixed;
    }

    const names = scale(prop) || [];
    const row = names.find((name) => !name.includes('/') && says(name, prop, value)) || (namedSorted().byProp.get(prop) || []).find((name) => says(name, prop, value));

    if (row) {
      return row;
    }

    const root = rootOf(names);
    const inner = String(value).trim().replace(/\s+/g, '_');
    const typed = root ? [toClass(root, value, kindOf(prop)), `${root}-[${inner}]`].find((name) => !name.replace(/\[.*\]/, '').includes('/') && says(name, prop, value)) : '';

    return typed || `[${prop}:${inner}]`;
  }

  /** The classes parts of a shared value read as: one class for them all when it exists (`scale-150`), else one each. */
  function namesForParts(prop, parts) {
    const { byParts } = namedSorted();
    const list = [...parts];
    const whole = byParts.get(partsKey(prop, list));

    if (whole) {
      return [whole];
    }

    return list.flatMap(([key, value]) => {
      const mix = MIX.exec(String(value).trim());
      const mixed = mix ? `${namesForParts(prop, new Map([[key, mix[1]]]))[0] || ''}/${mix[2]}` : '';
      const mixedPlan = mixed.length > 1 && !mixed.startsWith('/') ? planFor(mixed)?.parts : null;

      if (mixedPlan?.length === 1 && mixedPlan[0].key === key && same(mixedPlan[0].value) === same(value)) {
        return [mixed];
      }

      const one = byParts.get(partsKey(prop, [[key, value]]));
      const root = typedRoot(prop, key);
      const words = ['filter', 'backdrop-filter', 'transform'].includes(prop) ? innerOf(value) : value;
      const typed = root ? `${root}-[${words.trim().replace(/\s+/g, '_')}]` : '';
      const said = typed ? planFor(typed)?.parts : null;
      const fits = said?.length === 1 && said[0].prop === prop && said[0].key === key && same(said[0].value) === same(value);

      return one ? [one] : fits ? [typed] : [];
    });
  }

  /** One place's declarations as classes: a class of several (`break-normal`) when all of its are there, else one each. */
  function namesForDeclarations(decls) {
    const here = new Map(decls.map((decl) => [decl.prop, decl.value]));
    const taken = new Set();
    const names = [];

    for (const { name, hard } of namedSorted().several) {
      if (hard.every((decl) => !taken.has(decl.prop) && same(here.get(decl.prop)) === same(decl.value))) {
        hard.forEach((decl) => taken.add(decl.prop));
        names.push(name);
      }
    }

    return [...names, ...decls.filter((decl) => !taken.has(decl.prop)).map((decl) => nameFor(decl.prop, decl.value))];
  }

  return { planFor, nameFor, namesForParts, namesForDeclarations };
}

/**
 * What puts `plan` in the place of `previous` at one place: what only the old
 * class set comes out, a soft value only while it is still the class's own.
 *
 * @param {?object} plan  null takes `previous` off
 * @param {?object} previous
 * @param {Map<string, string>} here  the declarations at the place, by property
 * @param {Set<string>|Map<string, string>} reaching  the properties a wider size or the plain state gives it as well: no soft value over those
 */
export function planUpdates(plan, previous, here = new Map(), reaching = here) {
  const out = [];

  for (const decl of previous?.decls || []) {
    if (!plan?.decls.some((one) => one.prop === decl.prop) && (!decl.soft || same(here.get(decl.prop)) === same(decl.value))) {
      out.push({ prop: decl.prop, value: null });
    }
  }

  for (const part of previous?.parts || []) {
    if (!plan?.parts.some((one) => one.prop === part.prop && one.key === part.key)) {
      out.push({ prop: part.prop, key: part.key, value: null });
    }
  }

  for (const decl of plan?.decls || []) {
    if (!decl.soft || (!here.has(decl.prop) && !reaching.has(decl.prop))) {
      out.push({ prop: decl.prop, value: decl.value });
    }
  }

  for (const part of plan?.parts || []) {
    out.push({ prop: part.prop, key: part.key, value: part.value });
  }

  if (previous?.keyframes && previous.keyframes !== plan?.keyframes) {
    out.push({ dropKeyframes: previous.keyframes });
  }

  return out;
}

/** Whether a place has the class already: its own declarations, and its parts as that place's own. */
export function planIsOn(plan, here, ownOf) {
  const hard = hardOf(plan);

  return (hard.length > 0 || plan.parts.length > 0)
    && hard.every((decl) => same(here.get(decl.prop)) === same(decl.value))
    && plan.parts.every((part) => (part.value === '' ? !ownOf(part.prop).has(part.key) : same(ownOf(part.prop).get(part.key)) === same(part.value)));
}

/** An animation's steps as the file holds them, from Tailwind's own tree of them. */
export function printKeyframes(node) {
  const steps = (node.nodes || []).map((step) => {
    const decls = (step.nodes || []).map((decl) => `        ${decl.property}: ${decl.value};`).join('\n');

    return `    ${step.selector} {\n${decls}\n    }`;
  });

  return `@keyframes ${node.params} {\n${steps.join('\n')}\n}`;
}

/* ---------------- a style's value from a field ---------------- */

const NUMBERS = ['integer', 'float', 'range'];
const COLORS = ['theme_color_picker', 'color'];
const WORDS = ['select', 'button_group', 'icon_button_group', 'text'];
const LENGTH = /^((padding|margin)(-[a-z-]+)?|gap|row-gap|column-gap|(min-|max-)?(width|height)|inset|top|right|bottom|left|font-size|letter-spacing|text-indent|border(-[a-z]+)*-radius|border(-[a-z]+)?-width|outline-offset|text-decoration-thickness|text-underline-offset)$/;
const COUNT = /^(z-index|opacity|line-height|font-weight|columns|aspect-ratio)$/;
const UNIT_OF = { rotate: 'deg', 'transition-duration': 'ms', 'transition-delay': 'ms' };

/**
 * The fieldtypes that can give a property its value: a colour takes a colour, a
 * length or a time a number or words, a font a font, an image one asset. A number
 * in a length gets a unit, a plain count (`z-index`) does not. Null for nothing that fits.
 */
export function fieldsFor(property) {
  const p = String(property || '');

  if (p === 'background-image') {
    return { types: ['assets'], single: true };
  }

  if (kindOf(p) === 'color') {
    return { types: COLORS };
  }

  if (p === 'font-family') {
    return { types: ['font_family_selector', ...WORDS] };
  }

  if (LENGTH.test(p) || UNIT_OF[p]) {
    return { types: [...NUMBERS, ...WORDS], length: true, ...(UNIT_OF[p] ? { unit: UNIT_OF[p] } : {}) };
  }

  if (COUNT.test(p)) {
    return { types: [...NUMBERS, ...WORDS] };
  }

  return p ? { types: WORDS } : null;
}

/**
 * The value a field's tag makes for a property: an image in `url()`, a length a
 * unit when the field gives a bare number (`{{ gap }}rem`), anything else as it is.
 */
export function boundValue(property, tag, { type = '', current = '', unit = 'rem' } = {}) {
  const fits = fieldsFor(property);

  if (property === 'background-image') {
    return `url(${tag})`;
  }

  return fits?.length && (NUMBERS.includes(type) || /^-?\d*\.?\d+$/.test(String(current).trim())) ? `${tag}${fits.unit || unit}` : tag;
}

/** How a Style field shows a value that comes from a field: `{{ gap }}rem` → `gap rem`. */
export function boundLabel(value) {
  return String(value || '')
    .replace(/^url\((.*)\)$/, '$1')
    .replace(/\{\{\s*([\s\S]*?)\s*\}\}/g, '$1 ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** A value with its `{{ fields }}` filled by `lookup`; '' when one has nothing the page could use yet. */
export function fillValue(value, lookup) {
  let missing = false;
  const text = String(value || '').replace(/\{\{([\s\S]*?)\}\}/g, (all, body) => {
    const got = lookup(body);

    if (got === undefined || got === '') {
      missing = true;
    }

    return got ?? '';
  });

  return missing ? '' : text.trim();
}
