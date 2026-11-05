/**
 * An element's animation in the dock's file — the build panel's Animation tab.
 *
 * Owner: Build mode (resources/js/build-mode/).
 * May import: html-tree-parse.js, tw-parse.js, build-mode/alpine.js,
 * build-mode/attrs.js, build-mode/place.js. Pure.
 * Bus messages: none.
 *
 * What an element does stands in its opening tag, as
 * resources/animation/runtime.css reads it: `data-anim` (self | children |
 * words, or one of the recipes parallax | ticker | stack | mouse), and for
 * self, children and words `data-anim-preset`, `data-anim-on` (view | scroll
 * | load | hover | switch), `data-anim-repeat` (play again each time it comes
 * into view) and, on a switch, Alpine's `:data-anim-active="open"`.
 * `data-anim-off` (kept, not played) and a ticker's `data-anim-pause` stand on any of them,
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
import { elementAttrs, withAlpineAttr, withoutAlpineAttr } from './alpine.js';
import { readAttribute, withAttribute } from './attrs.js';
import { findByPath } from './place.js';

export const TARGETS = ['self', 'children', 'words', 'parallax', 'ticker', 'stack', 'mouse'];

/**
 * A preset's kind: the target it is for, each with its own gallery in the
 * library, in this order. The timed kinds' presets are linked by
 * `data-anim-preset` (a rule each, presetRules); a recipe's are a starting
 * point, written onto the element as its own values (pickPreset).
 */
export const KINDS = TARGETS;

/**
 * When the element, its children or its words play: the triggers runtime.css
 * knows. `hover` is read, never offered: the Animation tab makes no hover any
 * more (Style → State → hover does), but an element that has one keeps it
 * until the author picks another trigger.
 */
export const TRIGGER_KEYS = ['view', 'scroll', 'load', 'hover', 'switch'];

/** Whether the target plays a preset on a trigger; the recipes do one thing of their own. */
export const timed = (target) => target === 'self' || target === 'children' || target === 'words';

/** Whether the target plays one after another, with a step between: the children, or the words. */
export const stepped = (target) => target === 'children' || target === 'words';

/** Whether the target only moves, by its x and y: a parallax with the scroll, or toward the mouse. */
export const moves = (target) => target === 'parallax' || target === 'mouse';

/** What runtime.css falls back to, in ms — the timing fields' placeholders. */
export const RUNTIME_DEFAULTS = { duration: 700, delay: 0, step: 70 };

/** One loop of a ticker, in ms, when it has no duration of its own. */
export const TICKER_DURATION = 20000;

/** The recipes' own lengths and what runtime.css falls back to for each. */
export const SETTINGS = { '--anim-gap': '2rem', '--anim-stack-top': '6rem', '--anim-stack-gap': '1rem' };

/** The library's recipes beyond a preset: what each one writes on the element. */
export const RECIPES = {
  parallax: { target: 'parallax', vars: { '--anim-y': '4rem' } },
  ticker: { target: 'ticker' },
  stack: { target: 'stack' },
  mouse: { target: 'mouse', vars: { '--anim-x': '1rem', '--anim-y': '1rem' } },
};

const SWITCH_ATTRS = [':data-anim-active', 'x-bind:data-anim-active'];

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
const ORDER = ['--anim-step-curve', '--anim-ease', ...EFFECTS.map((effect) => effect.name), '--anim-clip-to', '--anim-dir', ...Object.keys(SETTINGS)];
const RUNTIME_TAG = '{{ sve_animation }}';
const RUNTIME_RE = /\s*\{\{\s*sve_animation\s*\}\}/;
const CLIP_RE = /^inset\((\d*\.?\d+)%\s+0\s+0\s+0\)$/;
const OWN_RE = /^\[(--anim-[a-z-]+):(.+)\]$/;

/** A preset on an element with nothing yet: the element itself, when it scrolls into view, the runtime's timing. */
export function newAnimation(preset, target = 'self') {
  return {
    target,
    preset: timed(target) ? preset : '',
    on: timed(target) ? 'view' : null,
    repeat: false,
    off: false,
    duration: null,
    delay: null,
    step: null,
    vars: {},
    switch: null,
    pause: false,
  };
}

/** A recipe of the library's (RECIPES) as an animation of its own. */
export function recipeAnimation(key) {
  const recipe = RECIPES[key];

  return { ...newAnimation('', recipe.target), ...recipe, vars: { ...(recipe.vars || {}) } };
}

/** A kind's gallery: the addon's listed presets of that kind, in the file's order, then the site's own of that kind. */
export function presetsFor(kind, builtIn, own) {
  return [
    ...(builtIn || []).filter((preset) => preset.kind === kind && preset.listed !== false),
    ...(own || []).filter((preset) => preset.kind === kind),
  ];
}

/** A preset's timing, in ms, for only the keys it has. */
function timingOf(preset) {
  return Object.fromEntries(Object.keys(TIMING).filter((key) => Number.isFinite(preset?.timing?.[key])).map((key) => [key, preset.timing[key]]));
}

/**
 * The animation a tile writes. A timed kind links the preset as the preset
 * list always did — the element's trigger kept while it played one (not a
 * hover's), its effects let go but its step curve — and its timing becomes
 * the element's own, key by key. A recipe's values become the element's own
 * on the recipe, kept as it was where the preset says nothing: no link.
 */
export function pickPreset(anim, preset) {
  const kind = preset.kind;
  const timing = timingOf(preset);

  if (timed(kind)) {
    const keep = !!anim && timed(anim.target) && anim.on !== 'hover';
    const start = keep ? { ...anim, target: kind } : newAnimation('', kind);
    const curve = start.vars?.['--anim-step-curve'];

    return { ...start, preset: preset.handle, vars: curve ? { '--anim-step-curve': curve } : {}, ...timing };
  }

  const start = anim?.target === kind ? anim : recipeAnimation(kind);
  const own = Object.entries(preset.vars || {}).reduce((now, [name, value]) => withVar(now, null, name, value), start);

  return { ...own, ...timing };
}

/** A value as the recipe stands with it: its own, else the runtime's. */
function recipeValue(anim, key) {
  if (key in TIMING) {
    return anim[key] ?? (key === 'duration' && anim.target === 'ticker' ? TICKER_DURATION : RUNTIME_DEFAULTS[key]);
  }

  return anim.vars?.[key] ?? SETTINGS[key] ?? null;
}

/** Two values as one: `.5rem` and `0.5rem`, `2rem` and `2.0rem`. */
function sameValue(a, b) {
  const parts = (value) => /^(-?\d*\.?\d+)([a-z%]*)$/.exec(String(value ?? '').trim());
  const x = parts(a);
  const y = parts(b);

  return x && y ? Number(x[1]) === Number(y[1]) && x[2] === y[2] : String(a) === String(b);
}

/** The recipe's preset its values still match, every value the preset names, or null: the element's own then. */
export function recipePreset(anim, presets) {
  if (!anim || timed(anim.target)) {
    return null;
  }

  return (presets || []).find((preset) => preset.kind === anim.target
    && [...Object.entries(preset.vars || {}), ...Object.entries(timingOf(preset))].every(([key, value]) => sameValue(recipeValue(anim, key), value))) || null;
}

/** The name a preset's value stands under. */
export function presetName(name) {
  return name.replace(/^--anim-/, '--anim-preset-');
}

/** A rule per preset of a timed kind, as {{ sve_animation }} pushes them (SveAnimation::css writes the same); a recipe's preset is never linked. */
export function presetRules(presets) {
  return (presets || [])
    .filter((preset) => timed(preset.kind))
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

  const plays = timed(target);
  const written = readAttribute(html, node, 'data-anim-on');
  const on = plays ? (TRIGGER_KEYS.includes(written) ? written : 'view') : null;

  return {
    target,
    preset: plays ? readAttribute(html, node, 'data-anim-preset') || '' : '',
    on,
    repeat: plays && readAttribute(html, node, 'data-anim-repeat') !== null,
    off: readAttribute(html, node, 'data-anim-off') !== null,
    duration: toMs(timing[TIMING.duration]),
    delay: toMs(timing[TIMING.delay]),
    step: toMs(timing[TIMING.step]),
    vars,
    switch: on === 'switch' ? elementAttrs(html, node).find((attr) => SWITCH_ATTRS.includes(attr.name))?.value || null : null,
    pause: target === 'ticker' && readAttribute(html, node, 'data-anim-pause') !== null,
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

  const plays = !!anim && timed(anim.target);

  next = withSwitch(next, path, plays && anim.on === 'switch' ? anim.switch : null);
  set('data-anim-pause', anim?.target === 'ticker' && anim.pause ? '' : null);
  set('data-anim-off', anim?.off ? '' : null);
  set('data-anim-repeat', plays && anim.repeat ? '' : null);
  set('data-anim-on', plays ? anim.on : null);
  set('data-anim-preset', (plays && anim.preset) || null);
  set('data-anim', anim ? anim.target : null);

  return withRuntimeTag(next);
}

/** Alpine's `:data-anim-active` on the element, bound to the switch; null takes it out. */
function withSwitch(source, path, name) {
  const next = withoutAlpineAttr(source, path, 'x-bind:data-anim-active');

  return name ? withAlpineAttr(next, path, ':data-anim-active', name) : withoutAlpineAttr(next, path, ':data-anim-active');
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
  return effectsFor(anim).map((effect) => {
    const raw = valueOf(anim, preset, effect.name);

    if (raw === null || raw === 'none') {
      return null;
    }

    const value = effect.key === 'clip' ? clipPercent(raw) : number(raw);

    return value === effect.neutral ? null : { ...effect, value, raw };
  }).filter(Boolean);
}

/** A saved preset's names: the effects, the 3D turns the editor does not list, and the curve. AnimationPresets.php keeps the same. */
const TURNS = ['--anim-rx', '--anim-ry'];
const LOOK = ['--anim-ease', ...EFFECTS.map((effect) => effect.name), '--anim-clip-to', ...TURNS];

/**
 * What «Save as preset» keeps: the animation's look as it stands, its own
 * values over its preset's, never its timing. A clip keeps where it opens to;
 * the runtime's own curve is left out.
 */
export function presetLook(anim, preset) {
  const vars = {};

  for (const effect of effectsOf(anim, preset)) {
    vars[effect.name] = effect.raw;

    if (effect.key === 'clip') {
      vars['--anim-clip-to'] = valueOf(anim, preset, '--anim-clip-to') ?? 'inset(0)';
    }
  }

  for (const name of TURNS) {
    const value = valueOf(anim, preset, name);

    if (value !== null) {
      vars[name] = value;
    }
  }

  const ease = valueOf(anim, preset, '--anim-ease');

  if (ease !== null && ease !== 'ease') {
    vars['--anim-ease'] = ease;
  }

  return vars;
}

/**
 * What «Save as preset» saves, by the element's kind: the look as above; a
 * stack's top and offset as they stand; the timing for children and words
 * (their own, key by key) and for a ticker (its round as it stands) — their
 * timing is what they are. An element in keeps its timing, as always.
 */
export function presetToSave(anim, preset) {
  const kind = anim.target;
  const vars = presetLook(anim, preset);
  const timing = {};

  if (kind === 'stack') {
    for (const name of ['--anim-stack-top', '--anim-stack-gap']) {
      vars[name] = valueOf(anim, null, name) ?? SETTINGS[name];
    }
  }

  if (stepped(kind)) {
    for (const key of Object.keys(TIMING)) {
      if (Number.isFinite(anim[key])) {
        timing[key] = anim[key];
      }
    }
  }

  if (kind === 'ticker') {
    timing.duration = anim.duration ?? TICKER_DURATION;
  }

  return { kind, vars, timing };
}

/**
 * Whether «Update preset» has anything to say: the element's look — and for
 * children and words their timing — no longer what its preset holds. Value
 * by value, `.5rem` the same as `0.5rem`.
 */
export function presetDiffers(anim, preset) {
  if (!anim || !preset) {
    return false;
  }

  const now = presetToSave(anim, preset);
  const same = (a, b) => {
    const keys = new Set([...Object.keys(a || {}), ...Object.keys(b || {})]);

    return [...keys].every((key) => key in (a || {}) && key in (b || {}) && sameValue(a[key], b[key]));
  };

  return !same(now.vars, preset.vars) || (stepped(anim.target) && !same(now.timing, preset.timing));
}

/** The animation on a preset saved from it: the look is the preset's now, its other own values stay. */
export function onPreset(anim, handle) {
  const vars = Object.fromEntries(Object.entries(anim.vars || {}).filter(([name]) => !LOOK.includes(name)));

  return { ...anim, preset: handle, vars };
}

/** The effects not in the list yet — the editor's "+" offers these. */
export function missingEffects(anim, preset) {
  const shown = new Set(effectsOf(anim, preset).map((effect) => effect.key));

  return effectsFor(anim).filter((effect) => !shown.has(effect.key));
}

/** The effects the runtime plays for this animation: a parallax and the mouse only move, a hover reveals nothing, a ticker and a stack have none. */
function effectsFor(anim) {
  if (moves(anim?.target)) {
    return EFFECTS.filter((effect) => effect.key === 'y' || effect.key === 'x');
  }

  if (anim && !timed(anim.target)) {
    return [];
  }

  return anim?.on === 'hover' ? EFFECTS.filter((effect) => effect.key !== 'clip') : EFFECTS;
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
