/**
 * An element's animation in the dock's file — the build panel's Animation tab.
 *
 * Owner: Build mode (resources/js/build-mode/).
 * May import: html-tree-parse.js, build-mode/attrs.js, build-mode/place.js. Pure.
 * Bus messages: none.
 *
 * What an element does stands in its opening tag, as
 * resources/animation/runtime.css reads it: `data-anim` (self | children),
 * `data-anim-preset`, `data-anim-on` (view | load), and its timing as
 * `--anim-duration`, `--anim-delay` and `--anim-step` in its `style`. The
 * timing stays inline: a stylesheet rule can never win over it, so a value
 * per section has to stand in the same declaration later
 * (`--anim-duration: {{ … ?? '0.6s' }}`).
 *
 * The section's template carries `{{ sve_animation }}` while anything in it
 * animates: the tag pushes the runtime onto the page, once however many
 * sections ask.
 */
import { maskAntlers, parseTemplateTree } from '../html-tree-parse.js';
import { readAttribute, withAttribute } from './attrs.js';
import { findByPath } from './place.js';

export const TARGETS = ['self', 'children'];

/** What runtime.css falls back to, in ms — the timing fields' placeholders. */
export const RUNTIME_DEFAULTS = { duration: 700, delay: 0, step: 70 };

const TIMING = { duration: '--anim-duration', delay: '--anim-delay', step: '--anim-step' };
const RUNTIME_TAG = '{{ sve_animation }}';
const RUNTIME_RE = /\s*\{\{\s*sve_animation\s*\}\}/;

/** A preset on an element with nothing yet: the element itself, when it scrolls into view, the runtime's timing. */
export function newAnimation(preset) {
  return { target: 'self', preset, on: 'view', duration: null, delay: null, step: null };
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

/** The element's animation, or null when it has none. Timing is in ms, null where the runtime's own applies. */
export function animationOf(html, node) {
  const target = node && !node.kind ? readAttribute(html, node, 'data-anim') : null;

  if (!TARGETS.includes(target)) {
    return null;
  }

  const timing = Object.fromEntries(declarations(readAttribute(html, node, 'style')).map((decl) => [decl.name, decl.value]));

  return {
    target,
    preset: readAttribute(html, node, 'data-anim-preset') || '',
    on: readAttribute(html, node, 'data-anim-on') === 'load' ? 'load' : 'view',
    duration: toMs(timing[TIMING.duration]),
    delay: toMs(timing[TIMING.delay]),
    step: toMs(timing[TIMING.step]),
  };
}

/**
 * The file with the element at `path` animating as `anim` says; null takes
 * every attribute and timing declaration it wrote back out. Its other
 * attributes and declarations stay as they were.
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
  const timed = withTiming(style ?? '', anim);

  if (timed !== (style ?? '')) {
    set('style', timed || null);
  }

  set('data-anim-on', anim ? anim.on : null);
  set('data-anim-preset', anim?.preset || null);
  set('data-anim', anim ? anim.target : null);

  return withRuntimeTag(next);
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

function withTiming(style, anim) {
  const own = Object.values(TIMING);
  const decls = declarations(style);
  const added = anim
    ? Object.entries(TIMING)
      .filter(([key]) => Number.isFinite(anim[key]))
      .map(([key, name]) => `${name}: ${toSeconds(anim[key])}`)
    : [];

  if (!added.length && !decls.some((decl) => own.includes(decl.name))) {
    return style;
  }

  const kept = decls
    .filter((decl) => !own.includes(decl.name))
    .map((decl) => decl.text)
    .join(';')
    .replace(/[\s;]+$/, '');

  return [kept, ...added].filter(Boolean).join('; ');
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
