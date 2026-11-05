/**
 * build-mode/animation.js — an element's animation in the dock's file, and
 * resources/animation/presets.json, the one list of presets, a gallery per kind.
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
  isChanged,
  KINDS,
  missingEffects,
  moves,
  newAnimation,
  onPreset,
  pickPreset,
  presetDiffers,
  presetLook,
  presetName,
  presetOf,
  presetRules,
  presetsFor,
  presetToSave,
  RECIPES,
  recipePreset,
  recipeAnimation,
  RUNTIME_DEFAULTS,
  SETTINGS,
  springEase,
  stepped,
  TICKER_DURATION,
  timed,
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
  const spring = presetOf(PRESETS, 'bounce');
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

test('each recipe reads back as it was written, and a recipe writes no trigger, preset or repeat', () => {
  for (const key of Object.keys(RECIPES)) {
    const written = recipeAnimation(key);

    assert.deepEqual(read(withAnimation('<ul>\n  <li>a</li>\n</ul>\n', '0:ul', written), '0:ul'), written, key);
  }

  assert.equal(
    withAnimation('<ul>x</ul>', '0:ul', { ...recipeAnimation('ticker'), on: 'view', preset: 'fade', repeat: true, pause: true }),
    '<ul data-anim="ticker" data-anim-pause="">x</ul>\n\n{{ sve_animation }}'
  );
});

test('a ticker\'s round, gap and direction, and a stack\'s top and offset, are classes like any other value', () => {
  const ticker = { ...recipeAnimation('ticker'), duration: 30000, vars: { '--anim-gap': '3rem', '--anim-dir': 'reverse' } };
  const stack = { ...recipeAnimation('stack'), vars: { '--anim-stack-top': '5rem', '--anim-stack-gap': '0.5rem' } };

  assert.equal(withAnimation('<ul>x</ul>', '0:ul', ticker), '<ul data-anim="ticker" class="[--anim-duration:30s] [--anim-dir:reverse] [--anim-gap:3rem]">x</ul>\n\n{{ sve_animation }}');
  assert.deepEqual(read(withAnimation('<ul>x</ul>', '0:ul', stack), '0:ul'), stack);
});

test('a switch is Alpine\'s :data-anim-active on the element, read as x-bind too, and goes with the trigger', () => {
  const html = '<div x-data="{ open: false }">\n  <ul>x</ul>\n</div>\n';
  const on = { ...newAnimation('fade-up', 'children'), on: 'switch', switch: 'open' };
  const next = withAnimation(html, '0:div/0:ul', on);

  assert.equal(next.split('\n')[1], '  <ul data-anim="children" data-anim-preset="fade-up" data-anim-on="switch" :data-anim-active="open">x</ul>');
  assert.deepEqual(read(next, '0:div/0:ul'), on);
  assert.equal(read(next.replace(':data-anim-active', 'x-bind:data-anim-active'), '0:div/0:ul').switch, 'open');
  assert.equal(withAnimation(next, '0:div/0:ul', { ...on, on: 'view', switch: null }).split('\n')[1], '  <ul data-anim="children" data-anim-preset="fade-up" data-anim-on="view">x</ul>');
  assert.equal(withAnimation(next, '0:div/0:ul', null), html);
});

test('every trigger the runtime knows reads back; anything else reads as scrolled into view', () => {
  for (const on of ['view', 'scroll', 'load', 'hover']) {
    assert.equal(read(withAnimation('<p>x</p>', '0:p', { ...newAnimation('fade'), on }), '0:p').on, on);
  }

  assert.equal(read('<a data-anim="self" data-anim-on="hover" class="[--anim-y:-0.375rem]">x</a>', '0:a').on, 'hover', 'a hover made before stays a hover: nothing changes it unasked');
  assert.ok(!('lift' in RECIPES), 'the library makes no hover any more');

  assert.equal(read('<p data-anim="self" data-anim-on="mouse">x</p>', '0:p').on, 'view');
});

test('a parallax and the mouse move only, a hover reveals nothing, and a ticker or a stack has no effects', () => {
  const keys = (list) => list.map((effect) => effect.key);

  assert.deepEqual(keys(missingEffects(recipeAnimation('parallax'), null)), ['x']);
  assert.deepEqual(keys(effectsOf(recipeAnimation('parallax'), null)), ['y']);
  assert.deepEqual(keys(effectsOf(recipeAnimation('mouse'), null)), ['y', 'x']);
  assert.deepEqual(missingEffects(recipeAnimation('mouse'), null), []);
  assert.ok(!keys(missingEffects({ ...newAnimation(''), on: 'hover' }, null)).includes('clip'));
  assert.deepEqual(missingEffects(recipeAnimation('ticker'), null), []);
  assert.deepEqual(effectsOf(recipeAnimation('stack'), null), []);
});

test('words in turn play a preset on a trigger as children do, with a step between; the mouse is a recipe with how far it goes', () => {
  const words = { ...newAnimation('fade-up', 'words'), step: 50 };
  const next = withAnimation('<h2>Two <em>short</em> words</h2>', '0:h2', words);

  assert.ok(timed('words') && stepped('words') && !moves('words'));
  assert.ok(!timed('mouse') && !stepped('mouse') && moves('mouse'));
  assert.equal(next, '<h2 data-anim="words" data-anim-preset="fade-up" data-anim-on="view" class="[--anim-step:0.05s]">Two <em>short</em> words</h2>\n\n{{ sve_animation }}');
  assert.deepEqual(read(next, '0:h2'), words);
  assert.equal(withAnimation('<p>x</p>', '0:p', recipeAnimation('mouse')), '<p data-anim="mouse" class="[--anim-y:1rem] [--anim-x:1rem]">x</p>\n\n{{ sve_animation }}');
  assert.equal(read('<p data-anim="mouse" data-anim-on="view" data-anim-preset="fade">x</p>', '0:p').on, null);
});

test('a path that is no element leaves the file alone', () => {
  assert.equal(withAnimation(SECTION, '9:div', newAnimation('fade')), SECTION);
});

/** The handles pages may name from before kinds: every one stays in the file, values unchanged. */
const OLD_HANDLES = [
  'fade', 'fade-up', 'fade-down', 'fade-left', 'fade-right', 'slide-up', 'slide-down', 'slide-left', 'slide-right',
  'zoom-in', 'zoom-out', 'pop', 'blur', 'blur-up', 'tilt', 'spin', 'flip-up', 'flip-in', 'bounce', 'bounce-in', 'drop',
  'draw-up', 'draw-left', 'circle', 'curtain',
];

test('every preset has a handle of its own, a kind, both labels and only --anim-* vars or a timing in ms', () => {
  assert.equal(new Set(PRESETS.map((preset) => preset.handle)).size, PRESETS.length);

  for (const preset of PRESETS) {
    assert.match(preset.handle, /^[a-z][a-z0-9-]*$/, preset.handle);
    assert.ok(KINDS.includes(preset.kind), `${preset.handle}: ${preset.kind}`);
    assert.ok(!('group' in preset), `${preset.handle}: the kind took the group's place`);
    assert.ok(preset.label_da && preset.label_en, preset.handle);
    assert.ok(Object.keys(preset.vars).length || Object.keys(preset.timing || {}).length, preset.handle);
    assert.ok(preset.listed === undefined || preset.listed === false, preset.handle);

    for (const name of Object.keys(preset.vars)) {
      assert.match(name, /^--anim-[a-z-]+$/, `${preset.handle}: ${name}`);
    }

    for (const [key, ms] of Object.entries(preset.timing || {})) {
      assert.ok(['duration', 'delay', 'step'].includes(key) && Number.isInteger(ms) && ms >= 0, `${preset.handle}: ${key}`);
    }
  }
});

test('the 25 handles from before kinds are all still there, as an element\'s; the 15 left out of Element in are kept unlisted', () => {
  for (const handle of OLD_HANDLES) {
    assert.equal(presetOf(PRESETS, handle)?.kind, 'self', handle);
  }

  assert.deepEqual(presetsFor('self', PRESETS, []).map((preset) => preset.handle), ['fade', 'fade-up', 'fade-down', 'fade-left', 'fade-right', 'zoom-in', 'pop', 'blur-up', 'draw-up', 'flip-up']);
  assert.equal(PRESETS.filter((preset) => preset.listed === false).length, 15);
  assert.ok(PRESETS.filter((preset) => preset.listed === false).every((preset) => preset.kind === 'self'));
});

test('each kind has its own gallery: 10 / 6 / 6 / 3 / 3 / 3 / 3', () => {
  assert.deepEqual(KINDS, ['self', 'children', 'words', 'parallax', 'ticker', 'stack', 'mouse']);
  assert.deepEqual(KINDS.map((kind) => presetsFor(kind, PRESETS, []).length), [10, 6, 6, 3, 3, 3, 3]);
});

test('a gallery is the listed built-ins of its kind in the file\'s order, then the site\'s own of that kind', () => {
  const own = [
    { handle: 'my-a', kind: 'children', vars: { '--anim-y': '1rem' } },
    { handle: 'my-b', kind: 'self', vars: { '--anim-y': '1rem' } },
    { handle: 'my-c', kind: 'children', vars: { '--anim-x': '1rem' } },
  ];

  assert.deepEqual(presetsFor('children', PRESETS, own).map((preset) => preset.handle), ['cascade-up', 'cascade-left', 'cascade-zoom', 'cascade-pop', 'cascade-blur', 'cascade-flip', 'my-a', 'my-c']);
  assert.deepEqual(presetsFor('mouse', PRESETS, own).map((preset) => preset.handle), ['mouse-soft', 'mouse-strong', 'mouse-away']);
  assert.deepEqual(presetsFor('stack', [], own), []);
});

test('the spring presets carry a fixed linear() curve', () => {
  for (const handle of ['bounce', 'bounce-in', 'drop', 'words-drop']) {
    assert.match(presetOf(PRESETS, handle).vars['--anim-ease'], /^linear\(/, handle);
  }

  assert.equal(presetOf(PRESETS, 'words-drop').vars['--anim-ease'], presetOf(PRESETS, 'bounce-in').vars['--anim-ease']);
});

test('a preset\'s values stand under --anim-preset-*, as SveAnimation::css writes them — a rule for each a timed kind links, listed or not, none for a recipe\'s', () => {
  const rules = presetRules(PRESETS);
  const linked = PRESETS.filter((preset) => timed(preset.kind));

  assert.equal(linked.length, 37);
  assert.equal(rules.split('\n').length, linked.length);
  assert.match(rules, /^\[data-anim-preset="fade-up"\] \{ --anim-preset-opacity: 0; --anim-preset-y: 2rem; \}$/m);
  assert.match(rules, /^\[data-anim-preset="slide-up"\] /m, 'unlisted, still a page may name it');
  assert.match(rules, /^\[data-anim-preset="cascade-up"\] \{ --anim-preset-opacity: 0; --anim-preset-y: 1.5rem; \}$/m, 'the timing is the element\'s own, not the rule\'s');
  assert.doesNotMatch(rules, /parallax-|ticker-|stack-|mouse-/);
  assert.doesNotMatch(rules, /\s--anim-(?!preset-)[a-z-]+:/);
});

test('a timed kind\'s tile links its preset and writes its timing as the element\'s own, key by key', () => {
  const cascade = presetOf(PRESETS, 'cascade-up');
  const picked = pickPreset(null, cascade);

  assert.deepEqual(picked, { ...newAnimation('cascade-up', 'children'), duration: 600, step: 80 });
  assert.equal(
    withAnimation('<ul>x</ul>', '0:ul', picked),
    '<ul data-anim="children" data-anim-preset="cascade-up" data-anim-on="view" class="[--anim-duration:0.6s] [--anim-step:0.08s]">x</ul>\n\n{{ sve_animation }}'
  );

  // On an element that plays: its trigger and its own delay stay, its effects go, its step curve stays.
  const playing = anim({ target: 'self', preset: 'fade', on: 'load', repeat: true, delay: 200, duration: 900, vars: { '--anim-y': '3rem', '--anim-step-curve': '1.5' } });
  const next = pickPreset(playing, presetOf(PRESETS, 'words-rise'));

  assert.equal(next.target, 'words');
  assert.equal(next.preset, 'words-rise');
  assert.equal(next.on, 'load');
  assert.equal(next.repeat, true);
  assert.equal(next.delay, 200);
  assert.equal(next.duration, 600);
  assert.equal(next.step, 60);
  assert.deepEqual(next.vars, { '--anim-step-curve': '1.5' });

  // A preset without timing leaves the element's timing as it is; a hover from before starts afresh.
  assert.equal(pickPreset(playing, presetOf(PRESETS, 'pop')).duration, 900);
  assert.equal(pickPreset({ ...playing, on: 'hover' }, presetOf(PRESETS, 'pop')).on, 'view');
});

test('a recipe\'s tile writes its values as the element\'s own — no data-anim-preset — and its gallery marks it while they still match', () => {
  const soft = presetOf(PRESETS, 'parallax-soft');
  const picked = pickPreset(null, soft);
  const html = withAnimation('<img>', '0:img', picked);

  assert.equal(picked.preset, '');
  assert.deepEqual(picked.vars, { '--anim-y': '2rem' });
  assert.doesNotMatch(html, /data-anim-preset/);
  assert.match(html, /data-anim="parallax" class="\[--anim-y:2rem\]"/);
  assert.equal(recipePreset(read(html, '0:img'), PRESETS)?.handle, 'parallax-soft');
  assert.equal(recipePreset({ ...picked, vars: { '--anim-y': '3rem' } }, PRESETS), null, 'changed: its own');

  const fast = pickPreset({ ...recipeAnimation('ticker'), pause: true, vars: { '--anim-gap': '3rem' } }, presetOf(PRESETS, 'ticker-fast'));

  assert.equal(fast.duration, 10000);
  assert.equal(fast.pause, true, 'the same recipe keeps what the preset says nothing about');
  assert.deepEqual(fast.vars, { '--anim-gap': '3rem' });
  assert.equal(recipePreset(recipeAnimation('ticker'), PRESETS)?.handle, 'ticker-normal', 'the runtime\'s own round is Normal');

  const tight = pickPreset(read('<ul data-anim="ticker">x</ul>', '0:ul'), presetOf(PRESETS, 'stack-tight'));

  assert.equal(tight.target, 'stack');
  assert.deepEqual(tight.vars, { '--anim-stack-top': '6rem', '--anim-stack-gap': '0.5rem' });
  assert.equal(recipePreset({ ...tight, vars: { '--anim-stack-gap': '.5rem' } }, PRESETS)?.handle, 'stack-tight', '.5rem is 0.5rem, the top the runtime\'s own');
  assert.equal(recipePreset(pickPreset(null, presetOf(PRESETS, 'mouse-away')), PRESETS)?.handle, 'mouse-away');
  assert.equal(recipePreset(anim(), PRESETS), null, 'a timed kind links instead');
});

test('«Update preset» is offered once the element\'s look — and for children and words their timing — is no longer its preset\'s', () => {
  const cascade = { handle: 'my-cascade', kind: 'children', vars: { '--anim-opacity': '0', '--anim-y': '1rem' }, timing: { duration: 600, step: 80 } };
  const fresh = pickPreset(null, cascade);

  assert.equal(presetDiffers(fresh, cascade), false, 'just picked: nothing to update');
  assert.equal(presetDiffers(withEffect(fresh, cascade, 'y', 2), cascade), true);
  assert.equal(presetDiffers({ ...fresh, step: 90 }, cascade), true);
  assert.equal(presetDiffers({ ...fresh, vars: { '--anim-y': '1.0rem' } }, cascade), false, '1.0rem is 1rem');
  assert.equal(presetDiffers(fresh, null), false);

  const rise = { handle: 'my-rise', kind: 'self', vars: { '--anim-opacity': '0', '--anim-y': '2rem' } };

  assert.equal(presetDiffers({ ...pickPreset(null, rise), duration: 900 }, rise), false, 'an element in keeps its timing on the element');
  assert.equal(presetDiffers(withVar(pickPreset(null, rise), rise, '--anim-ease', 'linear'), rise), true, 'the curve is the look');
});

test('«Save as preset» keeps what the kind\'s preset holds: the look, a stack\'s top and offset, the timing of children, words and a ticker', () => {
  const self = anim({ duration: 900, vars: { '--anim-y': '3rem' } });

  assert.deepEqual(presetToSave(self, presetOf(PRESETS, 'fade')), { kind: 'self', vars: { '--anim-opacity': '0', '--anim-y': '3rem' }, timing: {} });
  assert.deepEqual(presetToSave(pickPreset(null, presetOf(PRESETS, 'cascade-zoom')), presetOf(PRESETS, 'cascade-zoom')), {
    kind: 'children',
    vars: { '--anim-opacity': '0', '--anim-scale': '.9' },
    timing: { duration: 500, step: 70 },
  });
  assert.deepEqual(presetToSave(recipeAnimation('ticker'), null), { kind: 'ticker', vars: {}, timing: { duration: TICKER_DURATION } });
  assert.deepEqual(presetToSave({ ...recipeAnimation('stack'), vars: { '--anim-stack-gap': '2rem' } }, null), {
    kind: 'stack',
    vars: { '--anim-stack-top': SETTINGS['--anim-stack-top'], '--anim-stack-gap': '2rem' },
    timing: {},
  });
  assert.deepEqual(presetToSave(recipeAnimation('mouse'), null), { kind: 'mouse', vars: { '--anim-y': '1rem', '--anim-x': '1rem' }, timing: {} });
});

test('the runtime reads every value a linked preset can carry as the element\'s own first, its preset\'s after', () => {
  const names = new Set(PRESETS.filter((preset) => timed(preset.kind)).flatMap((preset) => Object.keys(preset.vars)));

  for (const name of names) {
    assert.ok(RUNTIME.includes(`var(${name}, var(${presetName(name)}, `), name);
    assert.ok(!new RegExp(`var\\(${name}, (?!var\\(${presetName(name)},)`).test(RUNTIME), `${name} read without its preset`);
  }
});

test('the fade for less motion stands on its own, so the stage can leave it out', () => {
  assert.doesNotMatch(RUNTIME, /prefers-reduced-motion|anim-fade/);
  assert.match(REDUCED, /@media \(prefers-reduced-motion: reduce\)/);
});

test('with less motion, only what plays now fades: not an element that is off, waits for a hover or waits for its switch', () => {
  const gate = ':not([data-anim-off], [data-anim-on="hover"], [data-anim-on="switch"]:not([data-anim-active]))';

  assert.ok(REDUCED.includes(`:is([data-anim="self"]${gate}, [data-anim="children"]${gate} > *, [data-anim="words"]${gate} [data-anim-word]) {\n      animation: anim-fade 0.3s ease backwards;`));
  assert.match(REDUCED, /:is\(\[data-anim="parallax"\], \[data-anim="ticker"\]\) \{\s*animation: none;/);
  assert.match(REDUCED, /\[data-anim="words"\]\[data-anim-on="hover"\] \[data-anim-word\]\) \{\s*--anim-motion: 0;/);
});

test('no value the runtime reads is inherited, except by the children of children and of a stack, and the words of words, from their parent', () => {
  const read = new Set([...RUNTIME.matchAll(/var\((--anim-[a-z-]+)/g)].map((match) => match[1]));
  // --anim-i, --anim-mx and --anim-my are the runtime's own marks on the element itself, as --anim-flip is the section's.
  const own = [...read].filter((name) => !['--anim-i', '--anim-flip', '--anim-mx', '--anim-my'].includes(name));
  const children = /:is\(\[data-anim="children"\], \[data-anim="stack"\]\) > :not\(\[data-anim\]\), \[data-anim="words"\] :not\(\[data-anim\]\) \{([^}]*)\}/.exec(RUNTIME)?.[1] || '';

  assert.ok(own.length > 20);

  for (const name of own) {
    assert.ok(RUNTIME.includes(`@property ${name} { syntax: "*"; inherits: false; }`), `${name} registered`);
    assert.ok(children.includes(`${name}: inherit;`), `${name} passed to the children`);
  }
});

test('a heading\'s words animate as children do, from a <span data-anim-word> each, and are boxes so they can move', () => {
  assert.match(RUNTIME, /:is\(\[data-anim="self"\], \[data-anim="children"\] > \*, \[data-anim="words"\] \[data-anim-word\]\) \{\s*animation: anim-in/);
  assert.match(RUNTIME, /\[data-anim="words"\] \[data-anim-word\] \{\s*display: inline-block;\s*\}/);
  assert.match(RUNTIME, /\[data-anim="words"\]\[data-anim-on="switch"\]:not\(\[data-anim-active\]\) \[data-anim-word\]\) \{\s*animation: none;/);
  assert.match(RUNTIME, /\[data-anim="words"\]\[data-anim-on="scroll"\] \[data-anim-word\]\) \{\s*animation-duration: auto;/);
  assert.ok(RUNTIME.includes(':is([data-anim-off], [data-anim-off] > *, [data-anim-off] [data-anim-word]) {\n    animation: none;'));
});

test('an element that follows the mouse moves by its x and y times where the pointer is, for a fine pointer only, and stands still when off', () => {
  const rule = /@media \(hover: hover\) and \(pointer: fine\) \{\s*\[data-anim="mouse"\] \{([^}]*)\}/.exec(RUNTIME)?.[1] || '';

  assert.ok(rule.includes('translate: calc(var(--anim-x, var(--anim-preset-x, 0rem)) * var(--anim-flip, 1) * var(--anim-mx, 0)) calc(var(--anim-y, var(--anim-preset-y, 0rem)) * var(--anim-my, 0));'));
  assert.match(rule, /transition: translate var\(--anim-duration, 0\.7s\)/);
  assert.match(RUNTIME, /\[data-anim="mouse"\]\[data-anim-off\] \{\s*translate: none;\s*\}/);
  assert.doesNotMatch(RUNTIME, /\[data-anim="mouse"\][^{]*\{[^}]*animation:/, 'the mouse is a transition, never an animation');
});

test('less motion stands over the runtime, and the canvas reverts its animations for what plays, with the same selectors under the play mark', () => {
  const rules = (css) => [...css.matchAll(/\n\s*(:is\([^{]+\))\s*\{\s*([a-z-]+):/g)].map((match) => [match[1], match[2]]);
  const unmarked = rules(CANVAS_MOTION).map(([selector, property]) => [selector.replaceAll('[data-sve-anim-playing]', ''), property]);

  assert.match(RUNTIME, /^@layer anim-runtime, anim-reduced;$/m);
  assert.match(REDUCED, /@layer anim-reduced \{\s*@media \(prefers-reduced-motion: reduce\)/);
  assert.equal(rules(REDUCED).length, 3);
  assert.deepEqual(unmarked, rules(REDUCED).slice(0, 2), 'the timed kinds, then parallax and ticker; a hover is never played');
  assert.equal(CANVAS_MOTION.match(/: revert-layer;/g).length, 2);
});

test('while scrolling and a parallax follow a view() timeline, only where the browser has one', () => {
  const supports = RUNTIME.slice(RUNTIME.indexOf('@supports (animation-timeline: view())'));

  assert.match(supports, /\[data-anim="children"\]\[data-anim-on="scroll"\] > \*, \[data-anim="words"\]\[data-anim-on="scroll"\] \[data-anim-word\]\) \{[^}]*animation-timeline: view\(\);/);
  assert.match(supports, /\[data-anim="parallax"\] \{\s*animation: anim-parallax auto linear both;\s*animation-timeline: view\(\);\s*animation-range: cover;/);
  assert.doesNotMatch(RUNTIME.slice(0, RUNTIME.indexOf('@supports')), /animation-timeline/);
});

test('a hover is a transition to the values, a switch waits for Alpine\'s data-anim-active, and off stops both', () => {
  const words = (on) => `\\[data-anim="words"\\]\\[data-anim-on="${on}"\\]`;

  assert.match(RUNTIME, new RegExp(`\\[data-anim="self"\\]\\[data-anim-on="hover"\\], \\[data-anim="children"\\]\\[data-anim-on="hover"\\] > \\*, ${words('hover')} \\[data-anim-word\\]\\) \\{\\s*animation: none;\\s*transition-property: opacity, translate, scale, rotate, filter, transform;`));
  assert.match(RUNTIME, new RegExp(`@media \\(hover: hover\\) \\{\\s*:is\\(\\[data-anim="self"\\]\\[data-anim-on="hover"\\]:hover, \\[data-anim="children"\\]\\[data-anim-on="hover"\\]:hover > \\*, ${words('hover')}:hover \\[data-anim-word\\]\\):not\\(\\[data-anim-off\\], \\[data-anim-off\\] > \\*, \\[data-anim-off\\] \\[data-anim-word\\]\\)`));
  assert.match(RUNTIME, new RegExp(`\\[data-anim="self"\\]\\[data-anim-on="switch"\\]:not\\(\\[data-anim-active\\]\\), \\[data-anim="children"\\]\\[data-anim-on="switch"\\]:not\\(\\[data-anim-active\\]\\) > \\*, ${words('switch')}:not\\(\\[data-anim-active\\]\\) \\[data-anim-word\\]\\) \\{\\s*animation: none;`));
  assert.ok(RUNTIME.lastIndexOf(':is([data-anim-off], [data-anim-off] > *, [data-anim-off] [data-anim-word])') > RUNTIME.indexOf('[data-anim="ticker"] {'));
});

test('a ticker\'s and a stack\'s placeholders are the runtime\'s own', () => {
  assert.match(RUNTIME, new RegExp(`var\\(--anim-duration, ${TICKER_DURATION / 1000}s\\) linear infinite`));

  for (const [name, value] of Object.entries(SETTINGS)) {
    assert.ok(RUNTIME.includes(`var(${name}, ${value})`), name);
  }
});

test('runtime.js copies a ticker\'s row once, out of reach of assistive technology and the tab order', () => {
  const js = readFileSync(new URL('runtime.js', root), 'utf8');

  assert.match(js, /querySelectorAll\('\[data-anim="ticker"\]'\)/);
  assert.match(js, /setAttribute\('aria-hidden', 'true'\)/);
  assert.match(js, /\.inert = true/);
  assert.match(js, /removeAttribute\('id'\)/);
});

test('runtime.js cuts a heading into words the page owns, said once to assistive technology, and follows the mouse through one sheet — never a style attribute', () => {
  const js = readFileSync(new URL('runtime.js', root), 'utf8');

  assert.match(js, /querySelectorAll\('\[data-anim="words"\]'\)\.forEach\(wrapWords\)/);
  assert.match(js, /createTreeWalker\(el, NodeFilter\.SHOW_TEXT\)/, 'the text nodes are cut; inline markup stays');
  assert.match(js, /word\.setAttribute\(WORD, String\(count\+\+\)\)/);
  assert.match(js, /word\.setAttribute\('aria-hidden', 'true'\)/);
  assert.match(js, /el\.setAttribute\('aria-label', el\.textContent/);
  assert.match(js, /\[\$\{WORD\}="\$\{n \+ 1\}"\] \{ --anim-i: \$\{n \+ 1\}; \}/, 'the index is a rule in a sheet of its own');
  assert.match(js, /if \(el\.querySelector\(`\[\$\{WORD\}\]`\)\) \{\s*return;/, 'a heading already cut is left as it is');

  assert.match(js, /matchMedia\('\(hover: hover\) and \(pointer: fine\)'\)\.matches/);
  assert.match(js, /!matchMedia\('\(prefers-reduced-motion: reduce\)'\)\.matches/);
  assert.match(js, /el\.setAttribute\(MOUSE, String\(\+\+follow\.keys\)\)/);
  assert.match(js, /rule\.style\.setProperty\('--anim-mx', x\.toFixed\(3\)\)/);
  assert.match(js, /\[\$\{MOUSE\}="\$\{el\.getAttribute\(MOUSE\)\}"\] \{ --anim-mx: 0; --anim-my: 0; \}/);
  assert.match(js, /addEventListener\('pointermove', [^\n]*\{ passive: true \}\)/);
  assert.doesNotMatch(js, /(?<!rule)\.style\b|setAttribute\('style'/, 'only a rule’s style is written, never an element’s');
});

test('a saved preset keeps the look as it stands, its own values over the preset\'s, never the timing', () => {
  const fadeUp = presetOf(PRESETS, 'fade-up');
  const anim = { ...newAnimation('fade-up'), duration: 1200, vars: { '--anim-y': '3rem', '--anim-step-curve': '1.5' } };

  assert.deepEqual(presetLook(anim, fadeUp), { '--anim-opacity': '0', '--anim-y': '3rem' });
  assert.deepEqual(presetLook({ ...anim, vars: { '--anim-opacity': '1' } }, fadeUp), { '--anim-y': '2rem' });
  assert.deepEqual(presetLook(newAnimation('flip-up'), presetOf(PRESETS, 'flip-up')), { '--anim-opacity': '0', '--anim-rx': '60deg' });
  assert.deepEqual(presetLook(newAnimation('circle'), presetOf(PRESETS, 'circle')), {
    '--anim-clip': 'circle(0% at 50% 50%)',
    '--anim-clip-to': 'circle(72% at 50% 50%)',
    '--anim-ease': 'cubic-bezier(.65, 0, .35, 1)',
  });
  assert.deepEqual(presetLook({ ...newAnimation('fade-up'), vars: { '--anim-ease': 'ease' } }, fadeUp), { '--anim-opacity': '0', '--anim-y': '2rem' });
});

test('on the preset it was saved as, the element keeps only what is not the look', () => {
  const anim = { ...newAnimation('fade-up', 'children'), duration: 900, vars: { '--anim-y': '3rem', '--anim-ease': 'ease-out', '--anim-step-curve': '1.5' } };
  const next = onPreset(anim, 'my-soft-rise');

  assert.equal(next.preset, 'my-soft-rise');
  assert.equal(next.duration, 900);
  assert.equal(next.target, 'children');
  assert.deepEqual(next.vars, { '--anim-step-curve': '1.5' });
});

test('AnimationPresets.php keeps every name a saved look can hold', () => {
  const php = readFileSync(new URL('../../../src/AnimationPresets.php', import.meta.url), 'utf8');
  const kept = new Set(/VARS = \[([^\]]+)\]/.exec(php)[1].match(/--anim-[a-z-]+/g));
  const looks = PRESETS.map((preset) => presetLook(newAnimation(preset.handle), preset));

  for (const name of new Set(looks.flatMap((vars) => Object.keys(vars)))) {
    assert.ok(kept.has(name), name);
  }

  for (const preset of PRESETS) {
    for (const name of Object.keys(preset.vars)) {
      assert.ok(kept.has(name), `${preset.handle} ${name}`);
    }
  }
});

test('the timing placeholders are the runtime\'s own defaults', () => {
  assert.match(RUNTIME, new RegExp(`var\\(--anim-duration, ${RUNTIME_DEFAULTS.duration / 1000}s\\)`));
  assert.match(RUNTIME, new RegExp(`var\\(--anim-delay, ${RUNTIME_DEFAULTS.delay}s\\)`));
  assert.match(RUNTIME, new RegExp(`var\\(--anim-step, ${RUNTIME_DEFAULTS.step / 1000}s\\)`));
});
