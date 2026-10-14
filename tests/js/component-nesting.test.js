import test from 'node:test';
import assert from 'node:assert/strict';
import { bindCall, callBindings, callValues, enclosingList, readGroupValue, writeGroupValue } from '../../resources/js/component-props.js';
import { findPartials } from '../../resources/js/dock-partials.js';

const props = [
  { handle: 'items', type: 'group', repeat: true, fields: [{ handle: 'title' }] },
  { handle: 'content', type: 'group', repeat: true, sets: [{ handle: 'headline' }, { handle: 'picture' }] },
  { handle: 'hero', type: 'group', repeat: false, fields: [{ handle: 'title' }] },
];

test('a group value written here reads back, æøå and all', () => {
  const value = writeGroupValue({ fields: ['title'], repeat: false, rows: [{ title: 'Første "rå" {{ x }}' }] });

  assert.match(value, /^sve64:[A-Za-z0-9_-]+$/);
  assert.deepEqual(readGroupValue(value).rows, [{ title: 'Første "rå" {{ x }}' }]);
  assert.equal(readGroupValue(value).repeat, false);
});

test('a call at the top of the file is in no list', () => {
  const html = '<div>{{ partial:components/image }}</div>';

  assert.equal(enclosingList(html, findPartials(html)[0].from, props), null);
});

test('a call inside a list loop belongs to that list', () => {
  const html = '{{ props_items }}<li>{{ partial:components/image }}</li>{{ /props_items }}';

  assert.deepEqual(enclosingList(html, findPartials(html)[0].from, props), { handle: 'items', type: null });
});

test('a call after a closed loop is in no list', () => {
  const html = '{{ props_items }}<li></li>{{ /props_items }}{{ partial:components/image }}';

  assert.equal(enclosingList(html, findPartials(html)[0].from, props), null);
});

test('a group that does not repeat is not a list', () => {
  const html = '{{ props_hero }}{{ partial:components/image }}{{ /props_hero }}';

  assert.equal(enclosingList(html, findPartials(html)[0].from, props), null);
});

test('inside a list with block types, the open type branch names the type', () => {
  const html = "{{ props_content }}{{ if type == 'headline' }}<h2></h2>{{ /if }}{{ if type == 'picture' }}{{ if image }}x{{ /if }}{{ partial:components/image }}{{ /if }}{{ /props_content }}";

  assert.deepEqual(enclosingList(html, findPartials(html)[0].from, props), { handle: 'content', type: 'picture' });
});

test('a call says some props outright and reads others', () => {
  const tag = '{{ partial:components/image props_src="/a.jpg" :props_alt="title" width="10" }}';

  assert.deepEqual(callValues(tag), { src: '/a.jpg', width: '10' });
  assert.deepEqual(callBindings(tag), { alt: 'title' });
});

test('binding a call replaces what it said and keeps the rest', () => {
  const html = '<div>{{ partial:components/image props_src="/a.jpg" class="w-full" }}</div>';
  const next = bindCall(html, findPartials(html)[0], { src: 'props_image:src', alt: 'props_image:alt' });

  assert.equal(next, '<div>{{ partial:components/image :props_src="props_image:src" class="w-full" :props_alt="props_image:alt" }}</div>');
});
