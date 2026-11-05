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
