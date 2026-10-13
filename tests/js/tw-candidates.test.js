import test from 'node:test';
import assert from 'node:assert/strict';
import { twCandidates } from '../../resources/js/tw-candidates.js';

const sorted = (html) => twCandidates(html).sort();

test('classes inside an Antlers condition in class reach the compiler', () => {
  const html = `<li><a class="{{ highlighted ?= 'btn bg-gray-800 text-gray-50 py-[.5em]! px-1! text-xs' }}" href="{{ url }}">{{ title }}</a></li>`;

  assert.deepEqual(sorted(html), ['bg-gray-800', 'btn', 'px-1!', 'py-[.5em]!', 'text-gray-50', 'text-xs']);
});

test('both branches of a ternary are classes, next to plain ones', () => {
  const html = `<div class="flex {{ open ? 'gap-200' : 'hidden md:block' }} p-100"></div>`;

  assert.deepEqual(sorted(html), ['flex', 'gap-200', 'hidden', 'md:block', 'p-100']);
});

test('the attribute’s own quote inside the tag is Antlers’, not the end of class', () => {
  assert.deepEqual(sorted(`<a class="{{ on ?= "px-1! py-2" }} mt-4" href="/"></a>`), ['mt-4', 'px-1!', 'py-2']);
  assert.deepEqual(sorted(`<a class='{{ on ?= 'px-1!' }} mt-4'></a>`), ['mt-4', 'px-1!']);
});

test('if/else in class keeps the text between the tags', () => {
  const html = '<a class="{{ if on }}bg-primary{{ else }}bg-secondary{{ /if }} rounded"></a>';

  assert.deepEqual(sorted(html), ['bg-primary', 'bg-secondary', 'rounded']);
});

test('a value built from a variable is still no class', () => {
  const names = twCandidates('<div class="bg-{{ color }} p-1"></div>');

  assert.ok(names.includes('p-1'));
  assert.ok(!names.some((name) => name.includes('color')));
  assert.deepEqual(sorted(`<div class="{{ classes }} {{ size | ensure_left('text-{x}') }}"></div>`), []);
});

test('a tag still being typed ends the value at the next quote and adds nothing', () => {
  assert.deepEqual(sorted(`<a class="{{ highlighted ?= 'btn" href="/"><b class="mt-2"></b>`), ['mt-2']);
  assert.deepEqual(
    sorted(`<a class="{{ highlighted ?= 'btn" href="/">{{ title }}</a><b class="mt-2"></b><i class="p-4"></i>`),
    ['mt-2', 'p-4']
  );
});

test('a comparison inside the tag is no tag start', () => {
  assert.deepEqual(sorted(`<a class="{{ count < 3 ?= 'px-2' }} mt-1"></a>`), ['mt-1', 'px-2']);
});
