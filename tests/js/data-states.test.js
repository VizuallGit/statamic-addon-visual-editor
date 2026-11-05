/**
 * lib/data-states.js — Style's Data states: the data attributes around the pick, and their values.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dataStateLabel, dataStates, isDataState } from '../../resources/js/lib/data-states.js';

const MEDIA = '<section class="grid" data-position="{{ image_position }}" data-auto-contrast><div class="flow-y">t</div><div id="img" data-kind="photo" class="aspect-4/3">i</div></section>';
const model = { section: [{ var: 'image_position', type: 'button_group', options: ['left', 'right'] }] };
const imgAt = MEDIA.indexOf('<div id="img"');

test('a field\'s attribute on the section: one group state per option; the element\'s own: data-[…]', () => {
  const ids = dataStates(MEDIA, imgAt, model).map((s) => s.id);

  assert.deepEqual(ids, ['data-[kind=photo]', 'group-data-[position=left]', 'group-data-[position=right]', 'group-data-[auto-contrast]']);
});

test('each state says where its attribute is', () => {
  const left = dataStates(MEDIA, imgAt, model).find((s) => s.id === 'group-data-[position=left]');

  assert.equal(left.own, false);
  assert.equal(left.tag, 'section');
  assert.equal(left.from, 0);
  assert.equal(left.field, 'image_position');
});

test('a field with no options, a mixed value, the editor\'s own: nothing to offer', () => {
  const html = '<div data-a="{{ title }}" data-b="x-{{ id }}" data-sve-ht-path="0:div"><p>x</p></div>';

  assert.deepEqual(dataStates(html, html.indexOf('<p>'), { section: [{ var: 'title', type: 'text' }] }), []);
});

test('a value Tailwind cannot carry without quotes is left out', () => {
  const html = '<div data-a="two words" data-b="ok"><p>x</p></div>';

  assert.deepEqual(dataStates(html, html.indexOf('<p>'), null).map((s) => s.id), ['group-data-[b=ok]']);
});

test('labels and recognition', () => {
  assert.equal(dataStateLabel('group-data-[position=left]'), 'position = left');
  assert.equal(dataStateLabel('data-[open]'), 'open');
  assert.equal(dataStateLabel('hover'), '');
  assert.equal(isDataState('group-data-[position=left]'), true);
  assert.equal(isDataState('group-hover'), false);
});

/* ---------------- placement that follows a field ---------------- */

import { fieldDataAttr, fieldLabel, placementScope, withGroup, withOneOfUnder } from '../../resources/js/lib/data-states.js';
import { parseTemplateTree } from '../../resources/js/html-tree-parse.js';

test('the section says its field: data-position="{{ image_position }}"', () => {
  const html = '<section id="x" data-auto-contrast data-position="{{ image_position }}">x</section>';

  assert.deepEqual(fieldDataAttr(html, parseTemplateTree(html)[0]), { key: 'position', field: 'image_position' });
  assert.equal(fieldDataAttr('<div data-a="left">x</div>', parseTemplateTree('<div data-a="left">x</div>')[0]), null);
});

test('the scope is the field\'s value now, as a person reads it', () => {
  const scope = placementScope({ key: 'position', field: 'image_position' }, 'right', 0);

  assert.equal(scope.variant, 'group-data-[position=right]');
  assert.equal(scope.label, 'Image position = Right');
  assert.equal(placementScope({ key: 'position', field: 'image_position' }, '', 0), null);
  assert.equal(placementScope({ key: 'position', field: 'image_position' }, 'two words', 0), null);
  assert.equal(fieldLabel('image_position'), 'Image position');
});

test('group is given once, where it is missing', () => {
  const html = '<section class="grid wrapper" data-position="{{ p }}"><div>x</div></section>';

  assert.equal(withGroup(html, 0), '<section class="grid wrapper group" data-position="{{ p }}"><div>x</div></section>');
  assert.equal(withGroup(withGroup(html, 0), 0), withGroup(html, 0));
  assert.equal(withGroup('<section data-p="{{ p }}">x</section>', 0), '<section class="group" data-p="{{ p }}">x</section>');
});

test('Order under a value: the same value\'s order replaced, the other value\'s and the base kept, the formatting too', () => {
  const value = 'bg-gray-900   aspect-4/3 order-last\n  group-data-[position=left]:order-first {{ extra }}';
  const v = ['group-data-[position=right]'];
  const names = ['order-first', 'order-last', 'order-none'];

  const once = withOneOfUnder(value, names, 'order-first', v);

  assert.equal(once, 'bg-gray-900   aspect-4/3 order-last\n  group-data-[position=left]:order-first {{ extra }} group-data-[position=right]:order-first');
  assert.equal(withOneOfUnder(once, names, 'order-last', v), 'bg-gray-900   aspect-4/3 order-last\n  group-data-[position=left]:order-first {{ extra }} group-data-[position=right]:order-last');
  assert.equal(withOneOfUnder(once, names, null, v), value);
  assert.equal(withOneOfUnder('md:group-data-[position=right]:order-first x', names, 'order-last', ['md', 'group-data-[position=right]']), 'x md:group-data-[position=right]:order-last');
});
