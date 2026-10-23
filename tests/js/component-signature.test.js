import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { COMPONENT_ATTR, componentSelector, componentSrcFromType } from '../../resources/js/component-signature.js';

test('a component is found by the mark the server writes, whatever its root wears', () => {
  // intro_style opens with <section id="id-{{ id }}" class="" {{ visual_edit }}>:
  // no static class, an Antlers id. The guess from the file gave null; the
  // server's mark is there whatever the root looks like.
  assert.equal(componentSelector('components/intro_style'), '[data-sve-component~="components/intro_style"]');
  assert.equal(componentSelector('header/style_1'), '[data-sve-component~="header/style_1"]');
});

test('the match is on a token: an element that starts two renders carries both srcs', () => {
  assert.match(componentSelector('components/card'), /~=/);
});

test('a tokenised call is a folder, not one component, and has no selector', () => {
  assert.equal(componentSelector('blocks/{type}'), null);
  assert.equal(componentSelector('blocks/{ type }'), null);
});

test('no src, no selector', () => {
  assert.equal(componentSelector(''), null);
  assert.equal(componentSelector(null), null);
  assert.equal(componentSelector('   '), null);
});

test('a quote in a src cannot break out of the selector', () => {
  assert.equal(componentSelector('a"b'), '[data-sve-component~="a\\"b"]');
});

test('the dock type names the component the preview marks', () => {
  assert.equal(componentSrcFromType('view:partials/components/card'), 'components/card');
  assert.equal(componentSrcFromType('view:layout'), 'layout');
  assert.equal(componentSrcFromType('hero/style_2'), null);
  assert.equal(componentSrcFromType(''), null);
});

test('the attribute is spelled the same in PHP (ComponentMark::ATTR) and here', () => {
  const php = readFileSync(new URL('../../src/ComponentMark.php', import.meta.url), 'utf8');

  assert.ok(php.includes(`public const ATTR = '${COMPONENT_ATTR}';`), 'ComponentMark::ATTR is the attribute component-signature.js asks the preview for');
});
