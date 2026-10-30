/**
 * build-mode/classes.js — a typed value as the Tailwind class for it, and back.
 * The examples are BRIEF §3's, value for value.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  effectiveClass,
  fromClass,
  kindOf,
  rootFor,
  rootOf,
  sideFallbackTools,
  nextLink,
  sideTool,
  toClass,
  typedClass,
  variantChain,
} from '../../../resources/js/build-mode/classes.js';

test('a token, a value and a custom property become the class Tailwind compiles to', () => {
  assert.equal(toClass('pbs', '500'), 'pbs-500');
  assert.equal(toClass('pbs', '10px'), 'pbs-[10px]');
  assert.equal(toClass('pbs', '4rem'), 'pbs-[4rem]');
  assert.equal(toClass('pbs', 'calc(1rem + 2vw)'), 'pbs-[calc(1rem_+_2vw)]');
  assert.equal(toClass('pbs', '--gutter'), 'pbs-(--gutter)');
  assert.equal(toClass('pbs', 'var(--gutter)'), 'pbs-(--gutter)');
  assert.equal(toClass('mbs', 'auto'), 'mbs-auto');
  assert.equal(toClass('pbs', '  '), null);
});

test('a font size from a variable says it is a length; a colour from one does not need to', () => {
  assert.equal(toClass('text', '--x', 'size'), 'text-(length:--x)');
  assert.equal(toClass('text', 'var(--brand)', 'color'), 'text-(--brand)');
  assert.equal(toClass('text', '#fff', 'color'), 'text-[#fff]');
  assert.equal(toClass('text', 'primary', 'color'), 'text-primary');
  assert.equal(toClass('text', '700', 'size'), 'text-700');
  assert.equal(toClass('text', '2rem', 'size'), 'text-[2rem]');
  assert.equal(toClass('text', 'clamp(1rem, 2vw, 3rem)', 'size'), 'text-[length:clamp(1rem,_2vw,_3rem)]');
});

test('text typed into a field\'s menu: a row of the scale as it is, anything else as a typed value', () => {
  const scale = ['pbs-0', 'pbs-700', 'pbs-72'];

  assert.equal(typedClass('pbs-700', scale, 'pbs'), 'pbs-700');
  assert.equal(typedClass('7', scale, 'pbs'), 'pbs-7');
  assert.equal(typedClass(' 10px ', scale, 'pbs'), 'pbs-[10px]');
  assert.equal(typedClass('--gutter', scale, 'pbs'), 'pbs-(--gutter)');
  assert.equal(typedClass('2rem', [], 'text', 'size'), 'text-[2rem]');
  assert.equal(typedClass('', scale, 'pbs'), null);
  assert.equal(typedClass('7', scale, ''), null);
});

test('width and height take the words CSS uses', () => {
  assert.equal(toClass('w', '100%', 'dim'), 'w-full');
  assert.equal(toClass('w', 'fit-content', 'dim'), 'w-fit');
  assert.equal(toClass('max-w', '45ch', 'dim'), 'max-w-[45ch]');
  assert.equal(toClass('w', '1/2', 'dim'), 'w-1/2');
});

test('read back, the class shows what was typed', () => {
  assert.equal(fromClass('pbs-500', 'pbs'), '500');
  assert.equal(fromClass('pbs-[10px]', 'pbs'), '10px');
  assert.equal(fromClass('pbs-[calc(1rem_+_2vw)]', 'pbs'), 'calc(1rem + 2vw)');
  assert.equal(fromClass('pbs-(--gutter)', 'pbs'), 'var(--gutter)');
  assert.equal(fromClass('text-(length:--x)', 'text'), 'var(--x)');
  assert.equal(fromClass('text-[length:clamp(1rem,_2vw,_3rem)]', 'text'), 'clamp(1rem, 2vw, 3rem)');
  assert.equal(fromClass('w-full', 'w'), '100%');
  assert.equal(fromClass('max-md:pbs-800', 'pbs'), '800');
  assert.equal(fromClass('text-primary', 'text'), 'primary');
});

test('a value round-trips through its class', () => {
  for (const [prefix, kind, value] of [['pbs', 'space', '10px'], ['gap', 'space', 'var(--gutter)'], ['text', 'size', 'var(--x)'], ['w', 'dim', 'fit-content'], ['text', 'color', '#13204f']]) {
    assert.equal(fromClass(toClass(prefix, value, kind), prefix), value, `${prefix} ${value}`);
  }
});

test('the property says how a bare value reads', () => {
  assert.equal(kindOf('padding-block-start'), 'space');
  assert.equal(kindOf('font-size'), 'size');
  assert.equal(kindOf('background-color'), 'color');
  assert.equal(kindOf('max-width'), 'dim');
});

test('the root is what the scale has in common — the catalog names it, not a table', () => {
  assert.equal(rootOf(['pbs-100', 'pbs-200', 'pbs-[10px]']), 'pbs');
  assert.equal(rootOf(['text-primary', 'text-gray-600']), 'text');
  assert.equal(rootOf(['bg-white', 'bg-gray-600']), 'bg');
  assert.equal(rootOf(['min-w-0', 'min-w-full']), 'min-w');
  assert.equal(rootOf('gap-500'), 'gap');
});

test('one class keeps the root it was written with', () => {
  assert.equal(rootFor('pbs-[10px]', ['pbs-100', 'pbs-200']), 'pbs');
  assert.equal(rootFor('max-md:pt-800', ['pbs-100', 'pbs-200']), 'pt');
  assert.equal(rootFor('w-[calc(100%-2rem)]'), 'w');
  assert.equal(rootFor('text-(length:--x)'), 'text');
  assert.equal(rootFor('min-w-0'), 'min-w');
  assert.equal(fromClass('w-[calc(100%-2rem)]', rootFor('w-[calc(100%-2rem)]')), 'calc(100%-2rem)');
});

test('a side writes the dock box tool its link says', () => {
  assert.equal(sideTool('padding', 'block-start'), 'padding-block-start');
  assert.equal(sideTool('padding', 'block-start', 'all'), 'padding-all');
  assert.equal(sideTool('margin', 'block-end', 'block'), 'margin-block');
  assert.equal(sideTool('margin', 'block-end', 'inline'), 'margin-block-end');
  assert.equal(sideTool('padding', 'inline-start', 'inline'), 'padding-inline');
  assert.deepEqual(sideFallbackTools('padding', 'padding-inline-end'), ['padding-inline', 'padding-all']);
  assert.deepEqual(sideFallbackTools('padding', 'padding-block'), ['padding-all']);
  assert.deepEqual(sideFallbackTools('padding', 'padding-all'), []);
});

const ROWS = [
  { handle: 'laptop', base: true, tw: '', direction: 'desktop' },
  { handle: 'tablet', base: false, tw: 'max-lg', direction: 'desktop' },
  { handle: 'mobile', base: false, tw: 'max-md', direction: 'desktop' },
];

test('a size reads through the wider ones, nearest first; All is the base alone', () => {
  assert.deepEqual(variantChain(ROWS, 'mobile'), ['max-md', 'max-lg', '']);
  assert.deepEqual(variantChain(ROWS, 'tablet'), ['max-lg', '']);
  assert.deepEqual(variantChain(ROWS, null), ['']);
  const mobileFirst = [
    { handle: 'laptop', base: false, tw: 'lg', direction: 'mobile' },
    { handle: 'tablet', base: false, tw: 'md', direction: 'mobile' },
    { handle: 'mobile', base: true, tw: '', direction: 'mobile' },
  ];
  assert.deepEqual(variantChain(mobileFirst, 'laptop'), ['lg', 'md', '']);
});

test('a state reads its own classes at every size first, then the sizes without it', () => {
  assert.deepEqual(variantChain(ROWS, 'mobile', 'hover'), ['max-md:hover', 'max-lg:hover', 'hover', 'max-md', 'max-lg', '']);
  assert.deepEqual(variantChain(ROWS, null, 'prose-p'), ['prose-p', '']);
});

test('what a size shows: its own class, else the nearest wider size, else the broader property', () => {
  const props = { pbs: 'padding-block-start', py: 'padding-block', p: 'padding', 'text-700': 'font-size' };
  const propertyOf = (name) => props[name.split('-')[0]] || props[name] || '';
  const chain = ['max-md', 'max-lg', ''];
  const sides = ['padding-block-start', 'padding-block', 'padding'];

  assert.deepEqual(
    effectiveClass('pbs-800 max-md:pbs-200', sides, chain, propertyOf),
    { raw: 'max-md:pbs-200', key: 'max-md', name: 'pbs-200', property: 'padding-block-start', inherited: false }
  );
  assert.equal(effectiveClass('pbs-800', sides, chain, propertyOf).inherited, true);
  // A media query beats the narrower property: max-md:py wins over a base pbs.
  assert.equal(effectiveClass('pbs-800 max-md:py-100', sides, chain, propertyOf).name, 'py-100');
  assert.equal(effectiveClass('[ {{ _class }} ] {{ cls }} wrapper', sides, chain, propertyOf), null);
});

test('the link button goes round: alone, block, inline, all, alone', () => {
  assert.equal(nextLink(''), 'block');
  assert.equal(nextLink('block'), 'inline');
  assert.equal(nextLink('inline'), 'all');
  assert.equal(nextLink('all'), '');
});
