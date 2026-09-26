import { test } from 'node:test';
import assert from 'node:assert/strict';
import { propNameProblem, propValueProblem, readCustomProps, writeCustomProps } from '../../resources/js/cp/theme-panel/custom-props.js';

const CSS = `/* kept */

:root {
  --gutter: var(--size-700);
  --container-width: 85.375rem;
  --container-width-narrow: 45rem;
  --container-padding: calc(((100vw - var(--container-width)) / 2) - var(--gutter));
}
`;

test('reads the :root declarations and leaves a comment alone', () => {
  assert.deepEqual(readCustomProps(CSS).map((p) => p.name), [
    'gutter',
    'container-width',
    'container-width-narrow',
    'container-padding',
  ]);
  assert.equal(readCustomProps(CSS)[1].value, '85.375rem');
});

test('a changed value keeps its place and the rest of the file', () => {
  const next = writeCustomProps(CSS, { 'container-width': '80rem' });

  assert.equal(readCustomProps(next)[1].value, '80rem');
  assert.ok(next.startsWith('/* kept */'));
  assert.ok(next.includes('--gutter: var(--size-700);'));
  assert.ok(next.includes('--container-padding: calc(((100vw - var(--container-width)) / 2) - var(--gutter));'));
});

test('a new property is added at the end of :root, and null removes one', () => {
  const next = writeCustomProps(CSS, {
    'container-ultra-narrow': '30rem',
    gutter: null,
  });
  const names = readCustomProps(next).map((p) => p.name);

  assert.deepEqual(names, ['container-width', 'container-width-narrow', 'container-padding', 'container-ultra-narrow']);
  assert.equal(readCustomProps(next).at(-1).value, '30rem');
});

test('a name is a lowercase custom property, and a value is one declaration', () => {
  assert.equal(propNameProblem('', []), 'empty');
  assert.equal(propNameProblem('Container', []), 'chars');
  assert.equal(propNameProblem('container-width', ['container-width']), 'taken');
  assert.equal(propNameProblem('container-ultra-narrow', []), null);
  assert.equal(propValueProblem(''), 'empty');
  assert.equal(propValueProblem('30rem; color: red'), 'chars');
  assert.equal(propValueProblem('calc(((100vw - var(--container-width)) / 2) - var(--gutter))'), null);
});
