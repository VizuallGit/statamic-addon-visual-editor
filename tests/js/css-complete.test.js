import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CSS_PROPERTIES, contextAt, cssCompletions } from '../../resources/js/cp/theme-panel/css-complete.js';

/** A stand-in for what CodeMirror hands a completion source. */
const at = (doc, explicit = false) => ({ state: { doc: { toString: () => doc } }, pos: doc.length, explicit });

test('the line says what is wanted, not the syntax tree', () => {
  assert.equal(contextAt('backg', 5).kind, 'property');
  assert.equal(contextAt('display: fl', 11).kind, 'value');
  assert.equal(contextAt('color: var(--pri', 16).kind, 'token');
});

test('a property is offered where a property would stand', () => {
  const r = cssCompletions()(at('backg'));

  assert.equal(r.from, 0);
  assert.ok(r.options.some((o) => o.label === 'background-color'));
  assert.equal(r.options.find((o) => o.label === 'padding').apply, 'padding: ', 'the colon comes with it');
});

test('a property after a finished declaration starts over', () => {
  const r = cssCompletions()(at('padding: 1rem;\n  colo'));

  assert.equal(r.from, 17, 'from the word, not the line');
  assert.ok(r.options.some((o) => o.label === 'color'));
});

test('a value is offered for the property it belongs to', () => {
  const r = cssCompletions()(at('display: fl'));

  assert.deepEqual(r.options.filter((o) => o.type === 'keyword').map((o) => o.label).slice(0, 3), ['block', 'flex', 'grid']);
  assert.ok(r.options.some((o) => o.apply === 'var(--'), 'and var( is always one of them');
});

test('inside var( the theme answers, not CSS', () => {
  const r = cssCompletions(() => ['--gutter', 'color-primary'])(at('color: var(--gut'));

  assert.deepEqual(r.options.map((o) => o.label), ['--gutter', '--color-primary'], 'a name given without dashes still reads as one');
  assert.equal(r.from, 11, 'replacing what stands after var(');
});

test('nothing is offered where nothing was typed', () => {
  assert.equal(cssCompletions()(at('margin: 0;\n')), null);
  assert.ok(cssCompletions()(at('margin: 0;\n', true)), 'unless it was asked for');
});

test('a name with characters CSS would not read is left alone', () => {
  assert.equal(cssCompletions()(at('&:hover')), null, 'a nested selector is not a half-typed property');
});

test('no property is listed twice', () => {
  assert.equal(new Set(CSS_PROPERTIES).size, CSS_PROPERTIES.length);
});
