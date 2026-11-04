/**
 * build-mode/animation.js — an element's animation in the dock's file, and
 * resources/animation/presets.json, the one list of presets.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  animationOf,
  bezierCss,
  bezierOf,
  easeKey,
  effectsOf,
  groupPresets,
  isChanged,
  missingEffects,
  newAnimation,
  presetName,
  presetOf,
  presetRules,
  RUNTIME_DEFAULTS,
  springEase,
  withAnimation,
  withEffect,
  withVar,
} from '../../../resources/js/build-mode/animation.js';
import { findByPath } from '../../../resources/js/build-mode/place.js';
import { parseTemplateTree } from '../../../resources/js/html-tree-parse.js';

const root = new URL('../../../resources/animation/', import.meta.url);
const PRESETS = JSON.parse(readFileSync(new URL('presets.json', root), 'utf8'));
const RUNTIME = readFileSync(new URL('runtime.css', root), 'utf8');
const REDUCED = readFileSync(new URL('reduced-motion.css', root), 'utf8');
const CANVAS_MOTION = readFileSync(new URL('canvas-motion.css', root), 'utf8');

const read = (html, path) => animationOf(html, findByPath(parseTemplateTree(html), path));
const anim = (own = {}) => ({ ...newAnimation('fade'), ...own });

const SECTION = '<div class="hero" style="color: red">\n  <h2>{{ title }}</h2>\n  <p>Tekst</p>\n</div>\n';

test('a written animation reads back as it was written', () => {
  const written = anim({ target: 'children', preset: 'fade-up', on: 'load', duration: 600, delay: 200, step: 70 });
  const next = withAnimation(SECTION, '0:div', written);

  assert.deepEqual(read(next, '0:div'), written);
  assert.equal(
    next,
    '<div data-anim="children" data-anim-preset="fade-up" data-anim-on="load" class="hero [--anim-duration:0.6s] [--anim-delay:0.2s] [--anim-step:0.07s]" style="color: red">\n  <h2>{{ title }}</h2>\n  <p>Tekst</p>\n</div>\n\n{{ sve_animation }}\n'
  );
});

test('an element without a class gets one for its own values, and loses it with them', () => {
  const next = withAnimation('<p>x</p>', '0:p', anim({ duration: 500 }));

  assert.equal(next, '<p data-anim="self" data-anim-preset="fade" data-anim-on="view" class="[--anim-duration:0.5s]">x</p>\n\n{{ sve_animation }}');
  assert.equal(withAnimation(next, '0:p', anim()), '<p data-anim="self" data-anim-preset="fade" data-anim-on="view">x</p>\n\n{{ sve_animation }}');
  assert.equal(withAnimation(next, '0:p', null), '<p>x</p>');
});

test('a fresh preset is the element, on scroll into view, with the runtime\'s timing — no class of its own', () => {
  const next = withAnimation('<p>x</p>', '0:p', newAnimation('fade'));

  assert.equal(next, '<p data-anim="self" data-anim-preset="fade" data-anim-on="view">x</p>\n\n{{ sve_animation }}');
  assert.deepEqual(read(next, '0:p'), newAnimation('fade'));
  assert.equal(newAnimation('fade-up', 'children').target, 'children');
});

test('an element without data-anim has no animation', () => {
  assert.equal(read(SECTION, '0:div'), null);
  assert.equal(read('<p data-anim="{{ x }}">x</p>', '0:p'), null);
});

test('removal leaves no attribute, declaration or runtime tag behind', () => {
  const html = '<p class="lead">x</p>\n';
  const animated = withAnimation(html, '0:p', anim({ preset: 'zoom-in', duration: 500, repeat: true, off: true, vars: { '--anim-y': '3rem' } }));

  assert.equal(withAnimation(animated, '0:p', null), html);
});

test('removal keeps the element\'s own classes and style and drops only the [--anim-*] classes', () => {
  const animated = withAnimation(SECTION, '0:div', anim({ duration: 400, vars: { '--anim-ease': 'linear' } }));

  assert.equal(withAnimation(animated, '0:div', null), SECTION);
});

test('the author\'s classes stay: one with a size or state in front, and {{ }}', () => {
  const html = '<p class="lead max-md:[--anim-y:1rem] {{ extra }} hover:[--anim-scale:1.1]">x</p>';
  const next = withAnimation(html, '0:p', anim({ duration: 300, vars: { '--anim-y': '3rem' } }));

  assert.match(next, /class="lead max-md:\[--anim-y:1rem\] \{\{ extra \}\} hover:\[--anim-scale:1\.1\] \[--anim-duration:0\.3s\] \[--anim-y:3rem\]"/);
  assert.deepEqual(read(next, '0:p').vars, { '--anim-y': '3rem' });
  assert.equal(withAnimation(next, '0:p', null), html);
});

test('curves and shapes go into a class without spaces and read back as the editor writes them', () => {
  const spring = springEase(100, 8, 1);
  const written = anim({ vars: { '--anim-ease': 'cubic-bezier(.42, 0, .58, 1)', '--anim-clip': 'inset(100% 0 0 0)', '--anim-clip-to': 'inset(0)' } });
  const next = withAnimation('<p>x</p>', '0:p', written);

  assert.match(next, /class="\[--anim-ease:cubic-bezier\(\.42,0,\.58,1\)\] \[--anim-clip:inset\(100%_0_0_0\)\] \[--anim-clip-to:inset\(0\)\]"/);
  assert.deepEqual(read(next, '0:p'), written);
  assert.equal(read(withAnimation('<p>x</p>', '0:p', anim({ vars: { '--anim-ease': spring } })), '0:p').vars['--anim-ease'], spring);
});

test('values an earlier version wrote in the style read as the element\'s own and move into the class', () => {
  const html = "<div data-anim=\"self\" data-anim-preset=\"fade\" data-anim-on=\"view\" style=\"background: {{ bg ?? 'red;blue' }};color:red; --anim-duration: 0.3s; --anim-ease: ease-in\">x</div>";
  const old = read(html, '0:div');

  assert.equal(old.duration, 300);
  assert.equal(old.vars['--anim-ease'], 'ease-in');
  assert.equal(
    withAnimation(html, '0:div', old),
    "<div class=\"[--anim-duration:0.3s] [--anim-ease:ease-in]\" data-anim=\"self\" data-anim-preset=\"fade\" data-anim-on=\"view\" style=\"background: {{ bg ?? 'red;blue' }};color:red\">x</div>\n\n{{ sve_animation }}"
  );
  assert.equal(withAnimation('<p data-anim="self" style="--anim-y: 2rem">x</p>', '0:p', null), '<p>x</p>');
});

test('a style with no value of ours is not rewritten', () => {
  const html = '<div style="color: red;">x</div>';
  const next = withAnimation(html, '0:div', anim({ duration: 300 }));

  assert.match(next, /style="color: red;"/);
});

test('a change rewrites only what changed, and the timing reads in ms from s or ms', () => {
  let html = withAnimation(SECTION, '0:div', anim({ target: 'children', preset: 'fade-up', duration: 600, step: 100 }));

  html = withAnimation(html, '0:div', { ...read(html, '0:div'), preset: 'blur', duration: null });
  assert.deepEqual(read(html, '0:div'), anim({ target: 'children', preset: 'blur', step: 100 }));
  assert.match(html, /class="hero \[--anim-step:0\.1s\]" style="color: red"/);
  assert.equal(read('<p data-anim="self" class="[--anim-delay:250ms]">x</p>', '0:p').delay, 250);
});

test('play again and kept-but-off stand as their own attributes and read back', () => {
  const next = withAnimation('<p>x</p>', '0:p', anim({ repeat: true, off: true }));

  assert.equal(next, '<p data-anim="self" data-anim-preset="fade" data-anim-on="view" data-anim-repeat="" data-anim-off="">x</p>\n\n{{ sve_animation }}');
  assert.deepEqual(read(next, '0:p'), anim({ repeat: true, off: true }));
  assert.equal(withAnimation(next, '0:p', anim()), '<p data-anim="self" data-anim-preset="fade" data-anim-on="view">x</p>\n\n{{ sve_animation }}');
});

test('the element\'s own curve and effects stand after the timing, in the editor\'s order, and read back', () => {
  const written = anim({ duration: 600, vars: { '--anim-blur': '0.5rem', '--anim-ease': 'linear', '--anim-y': '2rem' } });
  const next = withAnimation('<p>x</p>', '0:p', written);

  assert.match(next, /class="\[--anim-duration:0\.6s\] \[--anim-ease:linear\] \[--anim-y:2rem\] \[--anim-blur:0\.5rem\]"/);
  assert.deepEqual(read(next, '0:p'), written);
});

test('the effects come from the preset, with the element\'s own values over them', () => {
  const fadeUp = presetOf(PRESETS, 'fade-up');
  const own = anim({ preset: 'fade-up', vars: { '--anim-blur': '0.5rem' } });

  assert.deepEqual(
    effectsOf(own, fadeUp).map((effect) => [effect.key, effect.value]),
    [['opacity', 0], ['y', 2], ['blur', 0.5]]
  );
  assert.ok(isChanged(own));
  assert.ok(!isChanged(anim({ vars: { '--anim-step-curve': '1.5' } })));
  assert.deepEqual(missingEffects(own, fadeUp).map((effect) => effect.key), ['x', 'scale', 'rotate', 'clip']);
});

test('an effect set back to the preset\'s value leaves nothing of the element\'s own', () => {
  const fadeUp = presetOf(PRESETS, 'fade-up');
  let own = withEffect(anim({ preset: 'fade-up' }), fadeUp, 'y', 3);

  assert.deepEqual(own.vars, { '--anim-y': '3rem' });

  own = withEffect(own, fadeUp, 'y', 2);
  assert.deepEqual(own.vars, {});
});

test('taking out a preset\'s effect writes it as doing nothing; one it does not have just goes', () => {
  const fadeUp = presetOf(PRESETS, 'fade-up');
  const taken = withEffect(anim({ preset: 'fade-up' }), fadeUp, 'y', null);

  assert.deepEqual(taken.vars, { '--anim-y': '0rem' });
  assert.deepEqual(effectsOf(taken, fadeUp).map((effect) => effect.key), ['opacity']);

  const added = withEffect(anim({ preset: 'fade-up' }), fadeUp, 'scale', 0.9);

  assert.deepEqual(withEffect(added, fadeUp, 'scale', null).vars, {});
});

test('a reveal is one clip from the top, and a preset\'s other shape reads as written', () => {
  const own = withEffect(anim({ preset: 'fade-up' }), presetOf(PRESETS, 'fade-up'), 'clip', 100);

  assert.deepEqual(own.vars, { '--anim-clip': 'inset(100% 0 0 0)', '--anim-clip-to': 'inset(0)' });

  const circle = PRESETS.find((preset) => /circle/.test(preset.vars['--anim-clip'] || ''));

  if (circle) {
    const shown = effectsOf(anim({ preset: circle.handle }), circle).find((effect) => effect.key === 'clip');

    assert.equal(shown.value, null);
    assert.equal(shown.raw, circle.vars['--anim-clip']);
  }
});

test('a value of the element\'s own goes when it is the preset\'s', () => {
  const spring = PRESETS.find((preset) => preset.group === 'spring');
  const own = withVar(anim({ preset: spring.handle }), spring, '--anim-ease', 'linear');

  assert.deepEqual(own.vars, { '--anim-ease': 'linear' });
  assert.deepEqual(withVar(own, spring, '--anim-ease', spring.vars['--anim-ease']).vars, {});
  assert.deepEqual(withVar(own, spring, '--anim-ease', null).vars, {});
});

test('curves are named by what they are, not how they are written', () => {
  assert.equal(easeKey(null), 'ease');
  assert.equal(easeKey('ease-out'), 'out');
  assert.equal(easeKey('cubic-bezier(.42, 0, .58, 1)'), 'in-out');
  assert.equal(easeKey('cubic-bezier(0.42,0,0.58,1)'), 'in-out');
  assert.equal(easeKey('linear(0, 1.1, 1)'), 'spring');
  assert.equal(easeKey('cubic-bezier(.2, .8, .2, 1)'), 'custom');
  assert.deepEqual(bezierOf('ease-in'), [0.42, 0, 1, 1]);
  assert.equal(bezierOf('linear(0, 1)'), null);
  assert.equal(bezierCss([0.42, 0, 0.58, 1]), 'cubic-bezier(.42, 0, .58, 1)');
});

test('a spring becomes a linear() curve that starts at 0, ends at 1 and overshoots when loose', () => {
  const loose = springEase(100, 8, 1);
  const points = loose.slice(7, -1).split(',').map(Number);

  assert.match(loose, /^linear\(0, .*, 1\)$/);
  assert.equal(points.length, 41);
  assert.ok(Math.max(...points) > 1);
  assert.ok(Math.max(...springEase(100, 40, 1).slice(7, -1).split(',').map(Number)) <= 1);
});

test('the runtime tag is written once, and stays while another element still animates', () => {
  let html = '<div>\n  <h2>A</h2>\n  <p>B</p>\n</div>';

  html = withAnimation(html, '0:div/0:h2', newAnimation('fade'));
  html = withAnimation(html, '0:div/1:p', newAnimation('fade-up'));
  assert.equal(html.match(/\{\{ sve_animation \}\}/g).length, 1);

  html = withAnimation(html, '0:div/0:h2', null);
  assert.match(html, /\{\{ sve_animation \}\}/);

  html = withAnimation(html, '0:div/1:p', null);
  assert.equal(html, '<div>\n  <h2>A</h2>\n  <p>B</p>\n</div>');
});

test('a path that is no element leaves the file alone', () => {
  assert.equal(withAnimation(SECTION, '9:div', newAnimation('fade')), SECTION);
});

test('all 25 presets have a handle, a group, both labels and only --anim-* vars', () => {
  assert.equal(PRESETS.length, 25);
  assert.equal(new Set(PRESETS.map((preset) => preset.handle)).size, 25);

  for (const preset of PRESETS) {
    assert.match(preset.handle, /^[a-z][a-z0-9-]*$/, preset.handle);
    assert.match(preset.group, /^[a-z]+$/, preset.handle);
    assert.ok(preset.label_da && preset.label_en, preset.handle);
    assert.ok(Object.keys(preset.vars).length, preset.handle);

    for (const name of Object.keys(preset.vars)) {
      assert.match(name, /^--anim-[a-z-]+$/, `${preset.handle}: ${name}`);
    }
  }
});

test('the presets fall in the canvas\'s 7 groups, in its order', () => {
  assert.deepEqual(
    groupPresets(PRESETS).map(([group, list]) => [group, list.length]),
    [['fade', 5], ['slide', 4], ['zoom', 3], ['blur', 2], ['rotate', 4], ['spring', 3], ['reveal', 4]]
  );
});

test('the spring presets carry a fixed linear() curve', () => {
  for (const preset of PRESETS.filter((p) => p.group === 'spring')) {
    assert.match(preset.vars['--anim-ease'], /^linear\(/, preset.handle);
  }
});

test('a preset\'s values stand under --anim-preset-*, as SveAnimation::css writes them', () => {
  const rules = presetRules(PRESETS);

  assert.equal(rules.split('\n').length, 25);
  assert.match(rules, /^\[data-anim-preset="fade-up"\] \{ --anim-preset-opacity: 0; --anim-preset-y: 2rem; \}$/m);
  assert.doesNotMatch(rules, /\s--anim-(?!preset-)[a-z-]+:/);
});

test('the runtime reads every value a preset can carry as the element\'s own first, its preset\'s after', () => {
  const names = new Set(PRESETS.flatMap((preset) => Object.keys(preset.vars)));

  for (const name of names) {
    assert.ok(RUNTIME.includes(`var(${name}, var(${presetName(name)}, `), name);
    assert.ok(!new RegExp(`var\\(${name}, (?!var\\(${presetName(name)},)`).test(RUNTIME), `${name} read without its preset`);
  }
});

test('the fade for less motion stands on its own, so the stage can leave it out', () => {
  assert.doesNotMatch(RUNTIME, /prefers-reduced-motion|anim-fade/);
  assert.match(REDUCED, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(REDUCED, /:not\(\[data-anim-off\], \[data-anim-off\] > \*\)/);
});

test('no value the runtime reads is inherited, except by the children of children, from their parent', () => {
  const read = new Set([...RUNTIME.matchAll(/var\((--anim-[a-z-]+)/g)].map((match) => match[1]));
  const own = [...read].filter((name) => !['--anim-i', '--anim-flip'].includes(name));
  const children = /\[data-anim="children"\] > :not\(\[data-anim\]\) \{([^}]*)\}/.exec(RUNTIME)?.[1] || '';

  assert.ok(own.length > 20);

  for (const name of own) {
    assert.ok(RUNTIME.includes(`@property ${name} { syntax: "*"; inherits: false; }`), `${name} registered`);
    assert.ok(children.includes(`${name}: inherit;`), `${name} passed to the children`);
  }
});

test('the fade for less motion stands over the runtime, and the canvas reverts it with the same selector', () => {
  const selector = (css) => /\n\s*(:is\([^{]+\))\s*\{/.exec(css)?.[1];

  assert.match(RUNTIME, /^@layer anim-runtime, anim-reduced;$/m);
  assert.match(REDUCED, /@layer anim-reduced \{\s*@media \(prefers-reduced-motion: reduce\)/);
  assert.match(CANVAS_MOTION, /@layer anim-reduced \{[^}]*animation: revert-layer;/);
  assert.ok(selector(REDUCED));
  assert.equal(selector(CANVAS_MOTION), selector(REDUCED));
});

test('the timing placeholders are the runtime\'s own defaults', () => {
  assert.match(RUNTIME, new RegExp(`var\\(--anim-duration, ${RUNTIME_DEFAULTS.duration / 1000}s\\)`));
  assert.match(RUNTIME, new RegExp(`var\\(--anim-delay, ${RUNTIME_DEFAULTS.delay}s\\)`));
  assert.match(RUNTIME, new RegExp(`var\\(--anim-step, ${RUNTIME_DEFAULTS.step / 1000}s\\)`));
});
