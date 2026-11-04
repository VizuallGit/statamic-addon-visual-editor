/**
 * build-mode/animation.js — an element's animation in the dock's file, and
 * resources/animation/presets.json, the one list of presets.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { animationOf, groupPresets, newAnimation, RUNTIME_DEFAULTS, withAnimation } from '../../../resources/js/build-mode/animation.js';
import { findByPath } from '../../../resources/js/build-mode/place.js';
import { parseTemplateTree } from '../../../resources/js/html-tree-parse.js';

const root = new URL('../../../resources/animation/', import.meta.url);
const PRESETS = JSON.parse(readFileSync(new URL('presets.json', root), 'utf8'));
const RUNTIME = readFileSync(new URL('runtime.css', root), 'utf8');

const read = (html, path) => animationOf(html, findByPath(parseTemplateTree(html), path));

const SECTION = '<div class="hero" style="color: red">\n  <h2>{{ title }}</h2>\n  <p>Tekst</p>\n</div>\n';

test('a written animation reads back as it was written', () => {
  const anim = { target: 'children', preset: 'fade-up', on: 'load', duration: 600, delay: 200, step: 70 };
  const next = withAnimation(SECTION, '0:div', anim);

  assert.deepEqual(read(next, '0:div'), anim);
  assert.equal(
    next,
    '<div data-anim="children" data-anim-preset="fade-up" data-anim-on="load" class="hero" style="color: red; --anim-duration: 0.6s; --anim-delay: 0.2s; --anim-step: 0.07s">\n  <h2>{{ title }}</h2>\n  <p>Tekst</p>\n</div>\n\n{{ sve_animation }}\n'
  );
});

test('a fresh preset is the element, on scroll into view, with the runtime\'s timing — nothing in style', () => {
  const next = withAnimation('<p>x</p>', '0:p', newAnimation('fade'));

  assert.equal(next, '<p data-anim="self" data-anim-preset="fade" data-anim-on="view">x</p>\n\n{{ sve_animation }}');
  assert.deepEqual(read(next, '0:p'), { target: 'self', preset: 'fade', on: 'view', duration: null, delay: null, step: null });
});

test('an element without data-anim has no animation', () => {
  assert.equal(read(SECTION, '0:div'), null);
  assert.equal(read('<p data-anim="{{ x }}">x</p>', '0:p'), null);
});

test('removal leaves no attribute, declaration or runtime tag behind', () => {
  const html = '<p class="lead">x</p>\n';
  const animated = withAnimation(html, '0:p', { target: 'self', preset: 'zoom-in', on: 'view', duration: 500, delay: null, step: null });

  assert.equal(withAnimation(animated, '0:p', null), html);
});

test('removal keeps the element\'s own style and drops only the timing', () => {
  const animated = withAnimation(SECTION, '0:div', { target: 'self', preset: 'fade', on: 'view', duration: 400, delay: null, step: null });

  assert.equal(withAnimation(animated, '0:div', null), SECTION);
});

test('other style declarations and {{ }} in them stay as written', () => {
  const html = "<div style=\"background: {{ bg ?? 'red;blue' }};color:red\">x</div>";
  const next = withAnimation(html, '0:div', { target: 'self', preset: 'fade', on: 'view', duration: 300, delay: null, step: null });

  assert.equal(next, "<div data-anim=\"self\" data-anim-preset=\"fade\" data-anim-on=\"view\" style=\"background: {{ bg ?? 'red;blue' }};color:red; --anim-duration: 0.3s\">x</div>\n\n{{ sve_animation }}");
  assert.equal(read(next, '0:div').duration, 300);
  assert.equal(withAnimation(next, '0:div', null), html);
});

test('a style with no timing of ours is not rewritten', () => {
  const html = '<div style="color: red;">x</div>';
  const next = withAnimation(html, '0:div', newAnimation('fade'));

  assert.match(next, /style="color: red;"/);
});

test('a change rewrites only what changed, and the timing reads in ms from s or ms', () => {
  let html = withAnimation(SECTION, '0:div', { target: 'children', preset: 'fade-up', on: 'view', duration: 600, delay: null, step: 100 });

  html = withAnimation(html, '0:div', { ...read(html, '0:div'), preset: 'blur', duration: null });
  assert.deepEqual(read(html, '0:div'), { target: 'children', preset: 'blur', on: 'view', duration: null, delay: null, step: 100 });
  assert.match(html, /style="color: red; --anim-step: 0\.1s"/);
  assert.equal(read('<p data-anim="self" style="--anim-delay: 250ms">x</p>', '0:p').delay, 250);
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

test('the timing placeholders are the runtime\'s own defaults', () => {
  assert.match(RUNTIME, new RegExp(`var\\(--anim-duration, ${RUNTIME_DEFAULTS.duration / 1000}s\\)`));
  assert.match(RUNTIME, new RegExp(`var\\(--anim-delay, ${RUNTIME_DEFAULTS.delay}s\\)`));
  assert.match(RUNTIME, new RegExp(`var\\(--anim-step, ${RUNTIME_DEFAULTS.step / 1000}s\\)`));
});
