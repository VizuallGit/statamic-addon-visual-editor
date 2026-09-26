import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  bodyProblem,
  bodyProperties,
  compilerCss,
  readUtilities,
  utilityBodies,
  utilityNameProblem,
  writeUtilities,
} from '../../resources/js/cp/theme-panel/utilities.js';

const CSS = `@import "tailwindcss";

@theme {
    --color-primary: #11122C;
    --size-900: clamp(3.75rem, 3.2083rem + 2.7083vw, 5.375rem);
}

/* @utility commented { color: red; } */

@utility wrapper {
    padding-left: calc(((100% - var(--container-width)) / 2) - var(--gutter));
    border-left: var(--gutter) solid transparent;
}

@utility card {
    padding: var(--size-900);
    background-color: red;
}

@utility image-overlay {
    position: relative;
    &::after{
        content: '}';
        position: absolute;
    }
}

@utility auto-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(var(--auto-grid-size, var(--spacing-900)), 1fr));
}
`;

test('reads every top-level @utility, skipping comments, strings and @theme', () => {
  const utilities = readUtilities(CSS);

  assert.deepEqual(utilities.map((u) => u.name), ['wrapper', 'card', 'image-overlay', 'auto-grid']);
  assert.equal(utilityBodies(CSS).get('card'), 'padding: var(--size-900);\nbackground-color: red;');
  // The brace in the string does not end the block; nesting stays.
  assert.equal(
    utilityBodies(CSS).get('image-overlay'),
    "position: relative;\n&::after{\n    content: '}';\n    position: absolute;\n}"
  );
  assert.equal(utilities[3].indent, '  ');
});

test('writes one body in place, with the block\'s own indent, and nothing else', () => {
  const out = writeUtilities(CSS, { card: 'padding: var(--size-700);\nbackground-color: var(--color-primary);' });

  assert.ok(out.includes('@utility card {\n    padding: var(--size-700);\n    background-color: var(--color-primary);\n}'));
  assert.equal(out.replace(/@utility card \{[^}]*\}/, ''), CSS.replace(/@utility card \{[^}]*\}/, ''));

  const two = writeUtilities(CSS, { 'auto-grid': 'display: grid;' });

  assert.ok(two.includes('@utility auto-grid {\n  display: grid;\n}'));
});

test('an unchanged body leaves the file byte for byte', () => {
  assert.equal(writeUtilities(CSS, { card: '  padding: var(--size-900);\n  background-color: red;  \n' }), CSS);
  assert.equal(writeUtilities(CSS, {}), CSS);
});

test('a new utility goes after the last one; a removed one takes its blank line along', () => {
  const added = writeUtilities(CSS, { stack: 'display: flex;\nflex-direction: column;' });

  assert.ok(added.endsWith('1fr));\n}\n\n@utility stack {\n  display: flex;\n  flex-direction: column;\n}\n'));
  assert.deepEqual(readUtilities(added).map((u) => u.name), ['wrapper', 'card', 'image-overlay', 'auto-grid', 'stack']);

  const removed = writeUtilities(CSS, { card: null });

  assert.deepEqual(readUtilities(removed).map((u) => u.name), ['wrapper', 'image-overlay', 'auto-grid']);
  assert.ok(removed.includes('transparent;\n}\n\n@utility image-overlay {'));
  assert.ok(!/\n\n\n/.test(removed));
});

test('a file without utilities gets the first one at the end', () => {
  const out = writeUtilities('@import "tailwindcss";\n', { card: 'padding: 1rem;' });

  assert.equal(out, '@import "tailwindcss";\n\n@utility card {\n    padding: 1rem;\n}\n');
});

test('names: class-safe, not taken', () => {
  assert.equal(utilityNameProblem('', []), 'empty');
  assert.equal(utilityNameProblem('Card', []), 'format');
  assert.equal(utilityNameProblem('my card', []), 'format');
  assert.equal(utilityNameProblem('card-', []), 'format');
  assert.equal(utilityNameProblem('card', ['card']), 'taken');
  assert.equal(utilityNameProblem('card-2', ['card']), null);
});

test('a body with braces that do not pair up is not saved', () => {
  assert.equal(bodyProblem('padding: 1rem;'), null);
  assert.equal(bodyProblem("&::after {\n  content: '}';\n}"), null);
  assert.equal(bodyProblem('&::after {\n  content: "";'), 'braces');
  assert.equal(bodyProblem('padding: 1rem; }'), 'braces');
  assert.equal(bodyProblem("content: '"), 'braces');
  assert.equal(bodyProblem('/* note'), 'braces');
});

test('the list shows the top-level properties only', () => {
  assert.deepEqual(bodyProperties(utilityBodies(CSS).get('image-overlay')), ['position']);
  assert.deepEqual(bodyProperties('--flow-space: 1em;\n& > * + * {\n  margin-top: 1em;\n}'), ['--flow-space']);
});

test('the compiler gets the @theme and @utility blocks, not the rest', () => {
  const out = compilerCss(CSS);

  assert.ok(out.startsWith('@theme {'));
  assert.ok(out.includes('@utility card {'));
  assert.ok(!out.includes('@import'));
  assert.ok(!out.includes('commented'));
});

test('paint: the class a built rule is for, and the utility it is made of', async () => {
  const { belongsTo, classTokens, utilityOf } = await import('../../resources/js/cp/theme-panel/utility-paint.js');

  assert.deepEqual(classTokens('.md\\:card>*+*'), ['md:card']);
  assert.deepEqual(classTokens('.group-hover\\:card:is(:where(.group):hover *)'), ['group-hover:card', 'group']);
  assert.deepEqual(classTokens('.\\32 xl\\:card'), ['2xl:card']);
  assert.deepEqual(classTokens('.pt-0\\.5'), ['pt-0.5']);

  assert.equal(utilityOf('md:hover:card'), 'card');
  assert.equal(utilityOf('[&>p:hover]:card!'), 'card');
  assert.equal(utilityOf('group-[.card]:p-4'), 'p-4');

  assert.ok(belongsTo('max-md:card', 'card'));
  assert.ok(!belongsTo('card-title', 'card'));
  assert.ok(belongsTo('md:tab-4', 'tab-*'));
  assert.ok(!belongsTo('tab-', 'tab-*'));
});
