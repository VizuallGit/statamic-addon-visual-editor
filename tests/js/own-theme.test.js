import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ownFirst, ownTheme, varsForProperty, varsIn } from '../../resources/js/lib/own-theme.js';

const SITE = `
@theme {
    --color-*: initial;
    --color-primary-500: #727692;
    /* --spacing-999: 1rem; — a comment, not a variable */
    --spacing-500: var(--size-500);
    --spacing-gutter: var(--gutter);
    --text-800: var(--size-800);
}

@theme default {
    --radius-sm: 0.25rem;
}

@utility flow-y {
    > * + * { margin-block-start: 1em; }
}

@utility tab-* {
    tab-size: --value(integer);
}
`;

test('the site’s own variables, not its resets, comments or borrowed defaults', () => {
  const own = ownTheme(SITE);

  assert.deepEqual([...own.vars], ['--color-primary-500', '--spacing-500', '--spacing-gutter', '--text-800']);
  assert.equal(own.vars.has('--spacing-999'), false, 'a commented-out line is no variable');
  assert.equal(own.vars.has('--radius-sm'), false, '@theme default is Tailwind’s kind of block, not the site’s');
});

test('a class value can be any dash-ending of an own variable', () => {
  const { tails } = ownTheme(SITE);

  for (const tail of ['primary-500', '500', 'gutter', '800']) {
    assert.ok(tails.has(tail), tail);
  }

  assert.equal(tails.has('spacing-500'), false, 'the namespace is never a value');
});

test('the site’s @utility names, plain and functional', () => {
  const own = ownTheme(SITE);

  assert.ok(own.utilities.has('flow-y'));
  assert.ok(own.prefixes.has('tab'));
});

test('a declaration says which variables it reads', () => {
  assert.deepEqual(varsIn('padding-block: var(--spacing-500)'), ['--spacing-500']);
  assert.deepEqual(varsIn('padding-block: calc(var(--spacing) * 4)'), ['--spacing']);
});

test('the site’s own first, each side in the order it came', () => {
  const own = new Set(['py-500', 'py-gutter']);

  assert.deepEqual(
    ownFirst(['py-0', 'py-500', 'py-1', 'py-gutter'], (name) => own.has(name)),
    ['py-500', 'py-gutter', 'py-0', 'py-1']
  );
  assert.deepEqual(
    ownFirst([{ label: 'py-0' }, { label: 'py-500' }], (name) => own.has(name)).map((row) => row.label),
    ['py-500', 'py-0'],
    'menu rows are sorted by their label'
  );
});

test('a value menu offers the variables of its own kind first', () => {
  const vars = ['--color-primary-500', '--spacing-500', '--text-800', '--size-300'];

  assert.deepEqual(varsForProperty(vars, 'color'), [
    '--color-primary-500',
    '--spacing-500',
    '--text-800',
    '--size-300',
  ]);
  assert.deepEqual(varsForProperty(vars, 'font-size'), [
    '--text-800',
    '--size-300',
    '--color-primary-500',
    '--spacing-500',
  ]);
  assert.deepEqual(varsForProperty(vars, 'padding-block'), [
    '--spacing-500',
    '--size-300',
    '--color-primary-500',
    '--text-800',
  ]);
});
