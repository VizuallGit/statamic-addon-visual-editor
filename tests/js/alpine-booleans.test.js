import { test } from 'node:test';
import assert from 'node:assert/strict';
import { alpineBooleans, xDataOf } from '../../resources/js/lib/alpine-booleans.js';

test('the x-data value is read off the opening tag, however it is quoted', () => {
  assert.equal(xDataOf('<div x-data="{ open: false }">'), '{ open: false }');
  assert.equal(xDataOf(`<dialog class="a" x-data='{ "open": true }' x-effect="open">`), '{ "open": true }');
  assert.equal(xDataOf('<div x-data=dropdown()>'), 'dropdown()');
});

test('a bare x-data is an Alpine component with nothing in it; no x-data is none', () => {
  assert.equal(xDataOf('<div x-data class="menu">'), '');
  assert.equal(xDataOf('<div x-data>'), '');
  assert.equal(xDataOf('<div class="menu">'), null);
  assert.equal(xDataOf(''), null);
});

test('x-data inside another attribute or an Antlers tag is not the attribute', () => {
  assert.equal(xDataOf('<div class="x-data" title=" x-data=1">'), null);
  assert.equal(xDataOf('<section class="[ {{ _class }} ]" {{ visual_edit label="x-data" }}>'), null);
  assert.equal(
    xDataOf('<section id="id-{{ id }}" {{ visual_edit outline_inside="true" }} x-data="{ open: false }">'),
    '{ open: false }'
  );
});

test('top-level booleans, in the order the object writes them', () => {
  assert.deepEqual(alpineBooleans('{ open: false, menuOpen: true }'), [
    { key: 'open', value: false },
    { key: 'menuOpen', value: true },
  ]);
});

test('methods, nested objects, numbers, strings and expressions are stepped over', () => {
  const source = `{
    open: false,
    count: 0,
    label: 'a, b: true',
    items: [true, false],
    nested: { shown: true },
    toggle() { this.open = !this.open },
    get shut() { return !this.open },
    flag: !true,
    pick: (a, b) => true,
    dark: true,
  }`;

  assert.deepEqual(alpineBooleans(source), [
    { key: 'open', value: false },
    { key: 'dark', value: true },
  ]);
});

test('quoted keys count; a key written twice keeps its place and its last value', () => {
  assert.deepEqual(alpineBooleans(`{ 'open': false, "menu-open": true, open: true }`), [
    { key: 'open', value: true },
    { key: 'menu-open', value: true },
  ]);
});

test('comments are not pairs, and do not hide the pairs around them', () => {
  assert.deepEqual(alpineBooleans('{ // shut: true,\n open: false, /* wide: true, */ tall: true }'), [
    { key: 'open', value: false },
    { key: 'tall', value: true },
  ]);
});

test('no object literal, no booleans', () => {
  assert.deepEqual(alpineBooleans('dropdown()'), []);
  assert.deepEqual(alpineBooleans(''), []);
  assert.deepEqual(alpineBooleans('{}'), []);
  assert.deepEqual(alpineBooleans('{ open: {{ open }} }'), []);
});

test('a literal cut short still gives the pairs it has', () => {
  assert.deepEqual(alpineBooleans('{ open: false, menu: true'), [
    { key: 'open', value: false },
    { key: 'menu', value: true },
  ]);
});

test('what the attribute walk hands over is what the parser reads', () => {
  const tag = '<dialog class="company" x-data="{ open: false, toggle() { this.open = !this.open } }" x-effect="open ? $el.showModal() : $el.close()">';

  assert.deepEqual(alpineBooleans(xDataOf(tag)), [{ key: 'open', value: false }]);
});
