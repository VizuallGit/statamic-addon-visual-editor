/**
 * build-mode/animation-override.js — a section's own animation in its set's
 * `_anim`, over the template's.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  applyOverride,
  isEmpty,
  overriddenKeys,
  overrideFor,
  overrideTo,
  prune,
  readOverride,
  storedOverride,
  templateFlips,
  withFlip,
  withoutOverrideKey,
  withOverrideValue,
  withTemplateFlip,
} from '../../../resources/js/build-mode/animation-override.js';
import { animationOf } from '../../../resources/js/build-mode/animation.js';
import { findByPath } from '../../../resources/js/build-mode/place.js';
import { parseTemplateTree } from '../../../resources/js/html-tree-parse.js';

const H2 = '0:section/0:div/1:h2';
const HTML = '<section id="id-{{ id }}" class="[ {{ _class }} ] py-8"><div><p>a</p><h2 data-anim="self" data-anim-preset="fade-up" class="[--anim-duration:1.2s] [--anim-y:3rem]">b</h2></div></section>';
const template = () => animationOf(HTML, findByPath(parseTemplateTree(HTML), H2));

test('readOverride normalises an object, its JSON and nothing', () => {
  const raw = { flip: true, elements: { [H2]: { vars: { '--anim-y': '4rem', color: 'red', '--anim-x': '' }, preset: 'fade', off: true }, '0:section': {} } };

  assert.deepEqual(readOverride(raw), { flip: true, elements: { [H2]: { vars: { '--anim-y': '4rem' }, preset: 'fade', off: true } } });
  assert.deepEqual(readOverride(JSON.stringify(raw)), readOverride(raw));
  assert.deepEqual(readOverride(null), { flip: false, elements: {} });
  assert.deepEqual(readOverride(''), { flip: false, elements: {} });
  assert.deepEqual(readOverride('not json'), { flip: false, elements: {} });
  assert.deepEqual(readOverride([]), { flip: false, elements: {} });
  assert.deepEqual(readOverride({ flip: 'yes', elements: { [H2]: { off: false, preset: '' } } }), { flip: false, elements: {} });
});

test('overrideFor gives the element its vars, preset and off, null where unset', () => {
  const override = { elements: { [H2]: { vars: { '--anim-y': '4rem' } } } };

  assert.deepEqual(overrideFor(override, H2), { vars: { '--anim-y': '4rem' }, preset: null, off: null });
  assert.equal(overrideFor(override, '0:section'), null);
  assert.equal(overrideFor(null, H2), null);
});

test('applyOverride lays the values over the template and keeps target and trigger', () => {
  const anim = template();
  const shown = applyOverride(anim, { vars: { '--anim-y': '5rem', '--anim-scale': '0.9', '--anim-delay': '0.2s' }, preset: 'zoom-in', off: true });

  assert.equal(shown.target, 'self');
  assert.equal(shown.on, 'view');
  assert.equal(shown.preset, 'zoom-in');
  assert.equal(shown.off, true);
  assert.equal(shown.duration, 1200);
  assert.equal(shown.delay, 200);
  assert.deepEqual(shown.vars, { '--anim-y': '5rem', '--anim-scale': '0.9' });
  assert.equal(applyOverride(anim, null), anim);
  assert.equal(applyOverride(null, { vars: {} }), null);

  const without = applyOverride(anim, { vars: { '--anim-y': 'initial', '--anim-duration': 'initial' }, preset: null, off: null });

  assert.deepEqual(without.vars, {});
  assert.equal(without.duration, null);
  assert.equal(without.preset, 'fade-up');
  assert.equal(without.off, false);
});

test('withOverrideValue and withoutOverrideKey set and take one key', () => {
  let override = withOverrideValue(null, H2, '--anim-y', '4rem');

  override = withOverrideValue(override, H2, 'preset', 'fade');
  override = withOverrideValue(override, H2, 'off', true);

  assert.deepEqual(override.elements[H2], { vars: { '--anim-y': '4rem' }, preset: 'fade', off: true });
  assert.deepEqual(overriddenKeys(overrideFor(override, H2)), ['--anim-y', 'preset', 'off']);

  override = withoutOverrideKey(override, H2, '--anim-y');
  override = withoutOverrideKey(override, H2, 'preset');

  assert.deepEqual(override.elements[H2], { off: true });

  override = withoutOverrideKey(override, H2, 'off');

  assert.deepEqual(override.elements, {});
  assert.deepEqual(overriddenKeys(null), []);
});

test('overrideTo keeps what differs from the template, initial for what it takes away', () => {
  const anim = template();
  let override = overrideTo(null, H2, anim, { ...anim, vars: { '--anim-y': '5rem', '--anim-opacity': '0.5' } });

  assert.deepEqual(override.elements[H2], { vars: { '--anim-y': '5rem', '--anim-opacity': '0.5' } });

  override = overrideTo(override, H2, anim, { ...anim, duration: null, vars: { '--anim-y': '3rem' }, preset: 'zoom-in', off: true });

  assert.deepEqual(override.elements[H2], { vars: { '--anim-duration': 'initial' }, preset: 'zoom-in', off: true });
  assert.deepEqual(overrideTo(override, H2, anim, anim).elements, {});
});

test('prune drops a path the file no longer has and keeps a live one', () => {
  const override = { elements: { [H2]: { off: true }, '0:section/3:ul': { off: true } } };

  assert.deepEqual(Object.keys(prune(override, HTML).elements), [H2]);
  assert.deepEqual(prune(override, '').elements, {});
});

test('isEmpty and storedOverride: nothing left is {}', () => {
  assert.equal(isEmpty(null), true);
  assert.equal(isEmpty({ elements: { [H2]: {} } }), true);
  assert.equal(isEmpty({ flip: true }), false);
  assert.deepEqual(storedOverride(withoutOverrideKey({ elements: { [H2]: { off: true } } }, H2, 'off')), {});
  assert.deepEqual(storedOverride({ flip: true, elements: {} }), { flip: true });
  assert.deepEqual(storedOverride({ elements: { [H2]: { off: true } } }), { elements: { [H2]: { off: true } } });
});

test('withFlip mirrors the section; Nulstil on flip takes it away', () => {
  const flipped = withFlip(null, true);

  assert.equal(flipped.flip, true);
  assert.equal(withFlip(flipped, false).flip, false);
  assert.equal(withoutOverrideKey(flipped, H2, 'flip').flip, false);
});

test('the template mirrors with a class on its root, and back', () => {
  const on = withTemplateFlip(HTML, true);

  assert.match(on, /^<section id="id-\{\{ id \}\}" class="\[ \{\{ _class \}\} \] py-8 \[--anim-flip:-1\]">/);
  assert.equal(templateFlips(on), true);
  assert.equal(templateFlips(HTML), false);
  assert.equal(withTemplateFlip(on, true), on);
  assert.equal(withTemplateFlip(on, false).startsWith('<section id="id-{{ id }}" class="[ {{ _class }} ] py-8">'), true);
  assert.equal(withTemplateFlip('<section>a</section>', true), '<section class="[--anim-flip:-1]">a</section>');
  assert.equal(withTemplateFlip('<section class="[--anim-flip:-1]">a</section>', false), '<section>a</section>');
});
