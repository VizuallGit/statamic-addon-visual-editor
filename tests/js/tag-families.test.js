import { test } from 'node:test';
import assert from 'node:assert/strict';
import { FAMILIES, FAMILY_COLORS, familyCssVars, tagFamily } from '../../resources/js/lib/tag-families.js';

test('every family has a colour in both themes', () => {
  for (const family of FAMILIES) {
    assert.match(FAMILY_COLORS.dark[family], /^#[0-9a-f]{6}$/);
    assert.match(FAMILY_COLORS.light[family], /^#[0-9a-f]{6}$/);
  }
});

test('the dark set is the dock toolbar\'s own three', () => {
  assert.equal(FAMILY_COLORS.dark.component, '#5eead4');
  assert.equal(FAMILY_COLORS.dark.loop, '#a5b4fc');
  assert.equal(FAMILY_COLORS.dark.if, '#e8c468');
});

test('the CSS variables name every family once', () => {
  const css = familyCssVars('dark');

  for (const family of FAMILIES) {
    assert.ok(css.includes(`--sve-fam-${family}: ${FAMILY_COLORS.dark[family]};`), family);
  }

  assert.equal(familyCssVars('nope'), familyCssVars('dark'));
});

test('tags fall into the families the tree draws', () => {
  assert.equal(tagFamily('section'), 'layout');
  assert.equal(tagFamily('DIV'), 'layout');
  assert.equal(tagFamily('ul'), 'layout');
  assert.equal(tagFamily('h2'), 'text');
  assert.equal(tagFamily('a'), 'text');
  assert.equal(tagFamily('button'), 'text');
  assert.equal(tagFamily('img'), 'media');
  assert.equal(tagFamily('figure'), 'media');
  assert.equal(tagFamily('br'), 'other');
  assert.equal(tagFamily('', 'component'), 'component');
  assert.equal(tagFamily('collection', 'antlers', 'loop'), 'loop');
  assert.equal(tagFamily('if', 'antlers', 'if'), 'if');
  assert.equal(tagFamily('once', 'antlers', ''), 'if');
});
