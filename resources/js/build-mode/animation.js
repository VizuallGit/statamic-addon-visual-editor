/**
 * An element's animation in the dock's file — the build panel's Animation tab.
 *
 * Owner: Build mode (resources/js/build-mode/).
 * May import: html-tree-parse.js, tw-parse.js, build-mode/attrs.js,
 * build-mode/place.js. Pure.
 * Bus messages: none.
 *
 * What an element does stands in its opening tag, as
 * resources/animation/runtime.css reads it: `data-anim` (self | children),
 * `data-anim-preset`, `data-anim-on` (view | load), `data-anim-repeat` (play
 * again each time it comes into view), `data-anim-off` (kept, not played),
 * and every `--anim-*` value of its own as a Tailwind class in its `class`
 * (`[--anim-duration:1.2s]`): the timing, the curve and the effects that
 * differ from the preset. `{{ sve_tw }}` bakes them like any other class. A
 * preset's values stand under `--anim-preset-*` (presetRules), which
 * runtime.css reads only where the element has none of its own, so the class
 * wins whatever layer or order the two sheets come in.
 *
 * Only classes without a size or state in front are the editor's;
 * `max-md:[--anim-y:1rem]` is the author's and stays. An element an earlier
 * version animated has its values in its `style`: they read as its own, and
 * the next write moves them into the class.
 *
 * The section's template carries `{{ sve_animation }}` while anything in it
 * animates: the tag pushes the runtime onto the page, once however many
 * sections ask.
 */
import { maskAntlers, parseTemplateTree } from '../html-tree-parse.js';
import { appendToken, readClassAttr, replaceToken, tokenizeClassValue, writeClassValue } from '../tw-parse.js';
import { readAttribute, withAttribute } from './attrs.js';
import { findByPath } from './place.js';

export const TARGETS = ['self', 'children'];

/** What runtime.css falls back to, in ms — the timing fields' placeholders. */
export const RUNTIME_DEFAULTS = { duration: 700, delay: 0, step: 70 };

/**
 * The effects the editor lists, in its order: the variable, its unit, what it
 * is when it does nothing, what it starts at when added, the size its field's
 * fill measures against, the lowest it goes, its step, and whether `max` is
 * as high as it goes (`cap`).
 */
export const EFFECTS = [
  { key: 'opacity', name: '--anim-opacity', unit: '', neutral: 1, add: 0, max: 1, min: 0, step: 0.05, cap: true },
  { key: 'y', name: '--anim-y', unit: 'rem', neutral: 0, add: 2, max: 5, min: -20, step: 0.25 },
  { key: 'x', name: '--anim-x', unit: 'rem', neutral: 0, add: -2, max: 5, min: -20, step: 0.25 },
  { key: 'scale', name: '--anim-scale', unit: '', neutral: 1, add: 0.9, max: 2, min: 0, step: 0.05 },
  { key: 'rotate', name: '--anim-rotate', unit: 'deg', neutral: 0, add: -6, max: 180, min: -360, step: 1 },
  { key: 'blur', name: '--anim-blur', unit: 'rem', neutral: 0, add: 0.5, max: 2, min: 0, step: 0.05 },
  { key: 'clip', name: '--anim-clip', unit: '%', neutral: 0, add: 100, max: 100, min: 0, step: 5, cap: true },
];

/** The timing fields: the size each fill measures against, and its step, in ms. */
export const TIMING_RANGE = { delay: { max: 1000, step: 10 }, duration: { max: 1500, step: 10 }, step: { max: 500, step: 10 } };

/** The curves the editor names; anything else is a spring (`linear(…)`) or a curve of the author's own. */
export const EASES = [
  ['ease', 'ease', [0.25, 0.1, 0.25, 1]],
  ['in', 'ease-in', [0.42, 0, 1, 1]],
  ['out', 'ease-out', [0, 0, 0.58, 1]],
  ['in-out', 'cubic-bezier(.42, 0, .58, 1)', [0.42, 0, 0.58, 1]],
  ['linear', 'linear', [0, 0, 1, 1]],
];

const TIMING = { duration: '--anim-duration', delay: '--anim-delay', step: '--anim-step' };
const ORDER = ['--anim-step-curve', '--anim-ease', ...EFFECTS.map((effect) => effect.name), '--anim-clip-to'];
const RUNTIME_TAG = '{{ sve_animation }}';
const RUNTIME_RE = /\s*\{\{\s*sve_animation\s*\}\}/;
const CLIP_RE = /^inset\((\d*\.?\d+)%\s+0\s+0\s+0\)$/;
const OWN_RE = /^\[(--anim-[a-z-]+):(.+)\]$/;

/** A preset on an element with nothing yet: the element itself, when it scrolls into view, the runtime's timing. */
export function newAnimation(preset, target = 'self') {
  return { target, preset, on: 'view', repeat: false, off: false, duration: null, delay: null, step: null, vars: {} };
}

/** presets.json in its groups, in the order the file has them: [[group, [preset, …]], …]. */
export function groupPresets(presets) {
  const groups = new Map();

  for (const preset of presets || []) {
    if (!groups.has(preset.group)) {
      groups.set(preset.group, []);
    }

    groups.get(preset.group).push(preset);
  }

  return [...groups];
}

/** The name a preset's value stands under. */
export function presetName(name) {
  return name.replace(/^--anim-/, '--anim-preset-');
}

/** A rule per preset, as {{ sve_animation }} pushes them (SveAnimation::css writes the same). */
export function presetRules(presets) {
  return (presets || [])
    .map((preset) => `[data-anim-preset="${preset.handle}"] { ${Object.entries(preset.vars).map(([name, value]) => `${presetName(name)}: ${value};`).join(' ')} }`)
    .join('\n');
}

/**
 * The element's animation, or null when it has none. Timing is in ms, null
 * where the runtime's own applies; `vars` holds its other `--anim-*` values
 * as written.
 */
export function animationOf(html, node) {
  const target = node && !node.kind ? readAttribute(html, node, 'data-anim') : null;

  if (!TARGETS.includes(target)) {
    return null;
  }

  const own = {};
  const timing = {};
  const vars = {};

  for (const decl of declarations(readAttribute(html, node, 'style'))) {
    if (decl.name.startsWith('--anim-')) {
      own[decl.name] = decl.value;
    }
  }

  for (const { name, value } of ownTokens(readClassAttr(html, node.from, node.openTo)?.value)) {
    own[name] = value;
  }

  for (const [name, value] of Object.entries(own)) {
    if (Object.values(TIMING).includes(name)) {
      timing[name] = value;
    } else {
      vars[name] = value;
    }
  }

  return {
    target,
    preset: readAttribute(html, node, 'data-anim-preset') || '',
    on: readAttribute(html, node, 'data-anim-on') === 'load' ? 'load' : 'view',
    repeat: readAttribute(html, node, 'data-anim-repeat') !== null,
    off: readAttribute(html, node, 'data-anim-off') !== null,
    duration: toMs(timing[TIMING.duration]),
    delay: toMs(timing[TIMING.delay]),
    step: toMs(timing[TIMING.step]),
    vars,
  };
}

/**
 * The file with the element at `path` animating as `anim` says; null takes
 * every attribute and `[--anim-*:…]` class it wrote back out. Its other
 * attributes, classes and declarations stay as they were.
 */
export function withAnimation(html, path, anim) {
  let next = String(html ?? '');
  const at = () => findByPath(parseTemplateTree(next), path);
  const node = at();

  if (!node || node.kind) {
    return next;
  }

  const set = (name, value) => {
    const fresh = at();

    if (readAttribute(next, fresh, name) !== value) {
      next = withAttribute(next, fresh, name, value);
    }
  };

  const style = readAttribute(next, node, 'style');

  if (style !== null && withoutVars(style) !== style) {
    set('style', withoutVars(style) || null);
  }

  next = withOwnClasses(next, at(), ownValues(anim));

  set('data-anim-off', anim?.off ? '' : null);
  set('data-anim-repeat', anim?.repeat ? '' : null);
  set('data-anim-on', anim ? anim.on : null);
  set('data-anim-preset', anim?.preset || null);
  set('data-anim', anim ? anim.target : null);

  return withRuntimeTag(next);
}

/** The preset with this handle, or null. */
export function presetOf(presets, handle) {
  return (presets || []).find((preset) => preset.handle === handle) || null;
}

/** A value as it stands: the element's own, else its preset's. */
export function valueOf(anim, preset, name) {
  return anim?.vars?.[name] ?? preset?.vars?.[name] ?? null;
}

/** Whether the element changed anything of its preset's: an effect or the curve. */
export function isChanged(anim) {
  return Object.keys(anim?.vars || {}).some((name) => name !== '--anim-step-curve');
}

/**
 * The effects the animation does, in the editor's order: `{ key, name, unit,
 * value, raw, max }`. `value` is a number, or null for one the editor cannot
 * read as one (a preset's circle reveal) — `raw` shows it as written.
 */
export function effectsOf(anim, preset) {
  return EFFECTS.map((effect) => {
    const raw = valueOf(anim, preset, effect.name);

    if (raw === null || raw === 'none') {
      return null;
    }

    const value = effect.key === 'clip' ? clipPercent(raw) : number(raw);

    return value === effect.neutral ? null : { ...effect, value, raw };
  }).filter(Boolean);
}

/** The effects not in the list yet — the editor's "+" offers these. */
export function missingEffects(anim, preset) {
  const shown = new Set(effectsOf(anim, preset).map((effect) => effect.key));

  return EFFECTS.filter((effect) => !shown.has(effect.key));
}

/**
 * The animation with one effect set to a number, or taken out (null). The
 * element keeps a value only where it differs from its preset; one the preset
 * has and the element takes out is written as doing nothing.
 */
export function withEffect(anim, preset, key, value) {
  const effect = EFFECTS.find((e) => e.key === key);
  const vars = { ...(anim.vars || {}) };
  const own = effect.key === 'clip'
    ? { '--anim-clip': value === null ? 'none' : `inset(${value}% 0 0 0)`, '--anim-clip-to': value === null ? 'none' : 'inset(0)' }
    : { [effect.name]: value === null ? `${effect.neutral}${effect.unit}` : `${value}${effect.unit}` };

  for (const [name, written] of Object.entries(own)) {
    const presetValue = preset?.vars?.[name] ?? null;

    if (value === null && presetValue === null) {
      delete vars[name];
    } else if (written === presetValue) {
      delete vars[name];
    } else {
      vars[name] = written;
    }
  }

  return { ...anim, vars };
}

/** The animation with one `--anim-*` value of its own, or none (null, or the preset's own value). */
export function withVar(anim, preset, name, value) {
  const vars = { ...(anim.vars || {}) };

  if (value === null || value === (preset?.vars?.[name] ?? null)) {
    delete vars[name];
  } else {
    vars[name] = value;
  }

  return { ...anim, vars };
}

/** Which named curve a `--anim-ease` value is: a key of EASES, 'spring' for linear(…), 'custom' for any other bezier. */
export function easeKey(raw) {
  const value = String(raw ?? 'ease').trim();
  const named = EASES.find(([, css]) => css === value);

  if (named) {
    return named[0];
  }

  if (/^linear\(/.test(value)) {
    return 'spring';
  }

  const points = bezierOf(value);
  const same = points && EASES.find(([, , p]) => p.every((n, i) => Math.abs(n - points[i]) < 1e-6));

  return same ? same[0] : 'custom';
}

/** The four numbers of a curve: a named one's or a cubic-bezier's; null for a spring. */
export function bezierOf(raw) {
  const value = String(raw ?? 'ease').trim();
  const named = EASES.find(([, css]) => css === value);

  if (named) {
    return named[2];
  }

  const match = /^cubic-bezier\(([^)]+)\)$/.exec(value);
  const points = match ? match[1].split(',').map((n) => Number(n.trim())) : null;

  return points && points.length === 4 && points.every(Number.isFinite) ? points : null;
}

/** The four numbers as the runtime reads them. */
export function bezierCss(points) {
  return `cubic-bezier(${points.map(short).join(', ')})`;
}

/**
 * A spring as a CSS curve: stiffness, damping and mass, run until it rests,
 * sampled into `linear(…)`. The page only ever gets CSS.
 */
export function springEase(stiffness, damping, mass, samples = 40) {
  const dt = 1 / 600;
  const track = [0];
  let x = 0;
  let v = 0;
  let t = 0;

  while (t < 6) {
    v += ((-stiffness * (x - 1) - damping * v) / mass) * dt;
    x += v * dt;
    t += dt;
    track.push(x);

    if (Math.abs(x - 1) < 0.0005 && Math.abs(v) < 0.005) {
      break;
    }
  }

  const points = [];

  for (let i = 0; i <= samples; i += 1) {
    points.push(i === samples ? 1 : Number(track[Math.round((i / samples) * (track.length - 1))].toFixed(3)));
  }

  return `linear(${points.join(', ')})`;
}

function short(n) {
  return String(Number(n.toFixed(3))).replace(/^0\./, '.').replace(/^-0\./, '-.');
}

function number(raw) {
  const value = parseFloat(String(raw));

  return Number.isFinite(value) ? value : null;
}

function clipPercent(raw) {
  const match = CLIP_RE.exec(String(raw).trim());

  return match ? Number(match[1]) : null;
}

function toMs(value) {
  const match = /^(\d*\.?\d+)(ms|s)$/i.exec(String(value ?? '').trim());

  return match ? Math.round(parseFloat(match[1]) * (match[2].toLowerCase() === 's' ? 1000 : 1)) : null;
}

function toSeconds(ms) {
  return `${Number((ms / 1000).toFixed(3))}s`;
}

/** The style's declarations, split on `;` outside `{{ }}`: name, value and the text as written. */
function declarations(style) {
  const text = String(style ?? '');
  const masked = maskAntlers(text);
  const out = [];
  let from = 0;

  for (let i = 0; i <= masked.length; i += 1) {
    if (i < masked.length && masked[i] !== ';') {
      continue;
    }

    const colon = masked.indexOf(':', from);
    const named = colon !== -1 && colon < i;

    out.push({
      name: named ? masked.slice(from, colon).trim().toLowerCase() : '',
      value: named ? text.slice(colon + 1, i).trim() : '',
      text: text.slice(from, i),
    });
    from = i + 1;
  }

  return out;
}

/**
 * The animation's own `--anim-*` values, in the order its classes stand:
 * [[name, value], …] — the timing in seconds, then the rest.
 */
export function ownValues(anim) {
  if (!anim) {
    return [];
  }

  const rank = (name) => (ORDER.includes(name) ? ORDER.indexOf(name) : ORDER.length);
  const timing = Object.entries(TIMING).filter(([key]) => Number.isFinite(anim[key])).map(([key, name]) => [name, toSeconds(anim[key])]);

  return [...timing, ...Object.entries(anim.vars || {}).sort(([a], [b]) => rank(a) - rank(b))];
}

/** The class value's `[--anim-*:…]` classes without a size or state in front: name, value as CSS reads it, and the token. */
function ownTokens(value) {
  return tokenizeClassValue(value).flatMap((token) => {
    const match = token.dynamic ? null : OWN_RE.exec(token.text);

    return match ? [{ name: match[1], value: fromClass(match[2]), token }] : [];
  });
}

/** A value as a Tailwind class carries it: no space after a comma, `_` for any other. */
function toClass(value) {
  return String(value).trim().replace(/\s*,\s*/g, ',').replace(/\s+/g, '_');
}

/** A class's value as CSS reads it, its commas spaced as the editor writes its curves. */
function fromClass(text) {
  return text.replace(/_/g, ' ').replace(/\s*,\s*/g, ', ');
}

/** The file with the element's own `[--anim-*:…]` classes replaced by these values, after its other classes; a class left empty goes. */
function withOwnClasses(source, node, values) {
  const before = readClassAttr(source, node.from, node.openTo)?.value ?? '';
  let after = ownTokens(before).reverse().reduce((text, { token }) => replaceToken(text, token, ''), before);

  for (const [name, value] of values) {
    after = appendToken(after, `[${name}:${toClass(value)}]`);
  }

  if (after === before) {
    return source;
  }

  return after.trim() ? writeClassValue(source, node, after) : withAttribute(source, node, 'class', null);
}

/** The style without the `--anim-*` declarations an earlier version wrote there. */
function withoutVars(style) {
  const decls = declarations(style);

  if (!decls.some((decl) => decl.name.startsWith('--anim-'))) {
    return style;
  }

  return decls
    .filter((decl) => !decl.name.startsWith('--anim-'))
    .map((decl) => decl.text)
    .join(';')
    .replace(/[\s;]+$/, '')
    .trim();
}

function animates(source) {
  const any = (nodes) => nodes.some((node) => (!node.kind && readAttribute(source, node, 'data-anim') !== null) || any(node.children || []));

  return any(parseTemplateTree(source));
}

/** `{{ sve_animation }}` after the markup while anything animates; gone once nothing does. */
function withRuntimeTag(source) {
  const has = RUNTIME_RE.test(source);
  const needs = animates(source);

  if (needs && !has) {
    const body = source.replace(/\s+$/, '');

    return `${body}\n\n${RUNTIME_TAG}${source.slice(body.length)}`;
  }

  return !needs && has ? source.replace(RUNTIME_RE, '') : source;
}
