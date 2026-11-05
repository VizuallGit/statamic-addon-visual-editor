/**
 * A section's own animation over its template's — «Kun denne sektion» in the
 * build panel's Animation tab.
 *
 * Owner: Build mode (resources/js/build-mode/).
 * May import: html-tree-parse.js, tw-parse.js, build-mode/animation.js,
 * build-mode/attrs.js, build-mode/place.js. Pure.
 * Bus messages: none.
 *
 * The template is what every section of its style shares. What one section
 * on one page does differently stands in its set's hidden `_anim` field,
 * never in the template:
 *
 *   { flip?: true, elements?: { "<build path>": { vars?: { "--anim-y": "3rem" }, preset?: "fade", off?: true } } }
 *
 * keyed by the element's build path (`0:section/0:div/1:h2`), timing in
 * seconds as the template's classes carry it. `{{ sve_animation }}` pushes it
 * as a sheet under the section's id (SveAnimation::sectionCss). A value of
 * `initial` takes the template's own value away, so the preset's shows.
 *
 * Mirroring for every section is a class on the template's root,
 * `[--anim-flip:-1]`; runtime.css multiplies it into every x.
 */
import { parseTemplateTree } from '../html-tree-parse.js';
import { appendToken, readClassAttr, replaceToken, tokenizeClassValue, writeClassValue } from '../tw-parse.js';
import { ownValues } from './animation.js';
import { withAttribute } from './attrs.js';
import { findByPath } from './place.js';

const VAR_RE = /^--anim-[a-z-]+$/;
const TIMING = { duration: '--anim-duration', delay: '--anim-delay', step: '--anim-step' };
const FLIP_CLASS = '[--anim-flip:-1]';

const isMap = (value) => !!value && typeof value === 'object' && !Array.isArray(value);

/** `_anim` as the form holds it, an object, the JSON of one, or nothing: always `{ flip, elements }`, empty entries left out. */
export function readOverride(raw) {
  let value = raw;

  if (typeof value === 'string') {
    try {
      value = JSON.parse(value);
    } catch {
      value = null;
    }
  }

  const elements = {};

  for (const [path, over] of Object.entries(isMap(value?.elements) ? value.elements : {})) {
    const clean = cleanElement(over);

    if (clean) {
      elements[path] = clean;
    }
  }

  return { flip: isMap(value) && value.flip === true, elements };
}

function cleanElement(over) {
  if (!isMap(over)) {
    return null;
  }

  const vars = Object.fromEntries(Object.entries(isMap(over.vars) ? over.vars : {}).filter(([name, value]) => VAR_RE.test(name) && typeof value === 'string' && value !== ''));
  const clean = {};

  if (Object.keys(vars).length) {
    clean.vars = vars;
  }

  if (typeof over.preset === 'string' && over.preset) {
    clean.preset = over.preset;
  }

  if (over.off === true) {
    clean.off = true;
  }

  return Object.keys(clean).length ? clean : null;
}

/** The element's difference: `{ vars, preset, off }`, null for what it does not change; null when it has none. */
export function overrideFor(override, path) {
  const over = readOverride(override).elements[path];

  return over ? { vars: { ...(over.vars || {}) }, preset: over.preset ?? null, off: over.off ?? null } : null;
}

/** The animation as the section shows it: the difference's values over the template's, its preset and off in their place where it has them. Target and trigger stay. */
export function applyOverride(anim, over) {
  if (!anim || !over) {
    return anim;
  }

  const vars = { ...(anim.vars || {}) };
  const shown = { ...anim, preset: over.preset ?? anim.preset, off: over.off ?? anim.off, vars };

  for (const [name, value] of Object.entries(over.vars || {})) {
    const key = Object.keys(TIMING).find((k) => TIMING[k] === name);

    if (key) {
      shown[key] = value === 'initial' ? null : toMs(value);
    } else if (value === 'initial') {
      delete vars[name];
    } else {
      vars[name] = value;
    }
  }

  return shown;
}

/** The override with one key of the element's set: 'preset', 'off' (true), or an `--anim-*` name. */
export function withOverrideValue(override, path, key, value) {
  const now = readOverride(override);
  const over = { ...(now.elements[path] || {}) };

  if (key === 'preset') {
    over.preset = value;
  } else if (key === 'off') {
    over.off = value === true;
  } else {
    over.vars = { ...(over.vars || {}), [key]: value };
  }

  return readOverride({ ...now, elements: { ...now.elements, [path]: over } });
}

/** The override without one key of the element's ('preset', 'off', an `--anim-*` name), or without its flip ('flip'). */
export function withoutOverrideKey(override, path, key) {
  const now = readOverride(override);

  if (key === 'flip') {
    return withFlip(now, false);
  }

  const over = { ...(now.elements[path] || {}) };

  if (key === 'preset' || key === 'off') {
    delete over[key];
  } else {
    const vars = { ...(over.vars || {}) };

    delete vars[key];
    over.vars = vars;
  }

  return readOverride({ ...now, elements: { ...now.elements, [path]: over } });
}

export function withFlip(override, on) {
  return { ...readOverride(override), flip: !!on };
}

/**
 * The override with the element at `path` showing `next` over the template's
 * `template`: each value that differs from the template's own is kept, one the
 * template has and `next` has not is `initial`, a preset other than the
 * template's stands, and off where the template plays. What is the same as
 * the template goes.
 */
export function overrideTo(override, path, template, next) {
  const has = Object.fromEntries(ownValues(template));
  const want = Object.fromEntries(ownValues(next));
  let out = readOverride(override);
  const names = new Set([...Object.keys(has), ...Object.keys(want), ...Object.keys(out.elements[path]?.vars || {})]);

  for (const name of names) {
    if (want[name] === has[name]) {
      out = withoutOverrideKey(out, path, name);
    } else {
      out = withOverrideValue(out, path, name, name in want ? want[name] : 'initial');
    }
  }

  out = next?.preset && next.preset !== (template?.preset || '') ? withOverrideValue(out, path, 'preset', next.preset) : withoutOverrideKey(out, path, 'preset');

  return next?.off && !template?.off ? withOverrideValue(out, path, 'off', true) : withoutOverrideKey(out, path, 'off');
}

/** The override without the elements the file no longer has at their path. */
export function prune(override, html) {
  const now = readOverride(override);
  const tree = parseTemplateTree(String(html ?? ''));

  return { ...now, elements: Object.fromEntries(Object.entries(now.elements).filter(([path]) => findByPath(tree, path))) };
}

export function isEmpty(override) {
  const now = readOverride(override);

  return !now.flip && !Object.keys(now.elements).length;
}

/** The override as `_anim` stores it: `{}` when nothing is left, no `flip` or `elements` that say nothing. */
export function storedOverride(override) {
  const now = readOverride(override);

  if (isEmpty(now)) {
    return {};
  }

  return {
    ...(now.flip ? { flip: true } : {}),
    ...(Object.keys(now.elements).length ? { elements: now.elements } : {}),
  };
}

/** The keys the element's difference sets — the lines that wear the blue dot. */
export function overriddenKeys(over) {
  if (!over) {
    return [];
  }

  return [...Object.keys(over.vars || {}), ...(over.preset !== null && over.preset !== undefined ? ['preset'] : []), ...(over.off ? ['off'] : [])];
}

/** Whether the template's root carries the mirror class. */
export function templateFlips(html) {
  const source = String(html ?? '');
  const node = rootElement(source);

  return !!node && flipToken(readClassAttr(source, node.from, node.openTo)?.value) !== null;
}

/** The template with its root mirrored, or not: `[--anim-flip:-1]` in its class. */
export function withTemplateFlip(html, on) {
  const source = String(html ?? '');
  const node = rootElement(source);

  if (!node) {
    return source;
  }

  const before = readClassAttr(source, node.from, node.openTo)?.value ?? '';
  const token = flipToken(before);

  if ((token !== null) === !!on) {
    return source;
  }

  const after = on ? appendToken(before, FLIP_CLASS) : replaceToken(before, token, '');

  return after.trim() ? writeClassValue(source, node, after) : withAttribute(source, node, 'class', null);
}

function rootElement(source) {
  return parseTemplateTree(source).find((node) => !node.kind) || null;
}

function flipToken(value) {
  return tokenizeClassValue(value ?? '').find((token) => !token.dynamic && token.text === FLIP_CLASS) || null;
}

function toMs(value) {
  const match = /^(\d*\.?\d+)(ms|s)$/i.exec(String(value ?? '').trim());

  return match ? Math.round(parseFloat(match[1]) * (match[2].toLowerCase() === 's' ? 1000 : 1)) : null;
}
