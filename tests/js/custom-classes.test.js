import { test } from 'node:test';
import assert from 'node:assert/strict';
import { classBodies, classNameProblem, readClasses, writeClasses } from '../../resources/js/cp/theme-panel/custom-classes.js';

const FILE = `.btn {
    padding-block: .9em;
    gap: .5em;
}

.btn[data-style='primary'] {
    background-color: var(--color-primary);
}

.card h2 {
    font-size: 2rem;
}
`;

test('only a rule that is one whole class counts as the site\'s own', () => {
  assert.deepEqual(readClasses(FILE).map((c) => c.name), ['btn'], 'an attribute or a descendant describes a place');
});

test('a body comes out as a designer reads it', () => {
  assert.equal(classBodies(FILE).get('btn'), 'padding-block: .9em;\ngap: .5em;');
});

test('changing one rule leaves every other byte alone', () => {
  const next = writeClasses(FILE, { btn: 'gap: 1em;' });

  assert.equal(classBodies(next).get('btn'), 'gap: 1em;');
  assert.ok(next.includes(".btn[data-style='primary']"), 'the variant is untouched');
  assert.ok(next.includes('.card h2'), 'and so is the descendant rule');
});

test('a new rule is added at the end, indented once', () => {
  const next = writeClasses(FILE, { heading: 'font-size: var(--text-700);' });

  assert.ok(next.includes('.heading {\n    font-size: var(--text-700);\n}'));
  assert.deepEqual(readClasses(next).map((c) => c.name), ['btn', 'heading']);
});

test('a rule round-trips through a second edit', () => {
  const once = writeClasses(FILE, { heading: 'color: red;' });
  const twice = writeClasses(once, { heading: 'color: blue;' });

  assert.equal(classBodies(twice).get('heading'), 'color: blue;');
  assert.equal(readClasses(twice).length, 2, 'and is not written a second time');
});

test('null removes a rule and leaves no gap behind', () => {
  const next = writeClasses(FILE, { btn: null });

  assert.deepEqual(readClasses(next).map((c) => c.name), []);
  assert.ok(!/\n{3,}/.test(next), 'no run of blank lines where it stood');
  assert.ok(next.includes('.card h2'), 'the rules it did not own stay');
});

test('a brace inside a string does not end a rule', () => {
  const css = `.quote {\n    content: '}';\n    color: red;\n}\n`;

  assert.equal(classBodies(css).get('quote'), "content: '}';\ncolor: red;");
});

test('a name has to be one CSS would read back', () => {
  assert.equal(classNameProblem(''), 'empty');
  assert.equal(classNameProblem('Min Klasse'), 'format');
  assert.equal(classNameProblem('btn', ['btn']), 'taken');
  assert.equal(classNameProblem('.hero-title'), null, 'a typed dot is not a mistake');
  assert.equal(classNameProblem('hero-title'), null);
});
