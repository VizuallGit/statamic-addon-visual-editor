import assert from 'node:assert/strict';
import test from 'node:test';
import { liveSheet, readRule, sizeKey, writeDeclarations } from '../../resources/js/build-mode/css-mode/rules.js';
import { classToCss, cssToClass, parseDeclarations } from '../../resources/js/build-mode/css-mode/translate.js';

const ROWS = [
  { handle: 'desktop', base: true, direction: 'desktop', tw: '', media: '' },
  { handle: 'tablet', base: false, direction: 'desktop', max: '64em', tw: 'max-lg', media: '(width < 64em)' },
  { handle: 'mobile', base: false, direction: 'desktop', max: '48em', tw: 'max-md', media: '(width < 48em)' },
];
const at = (selector, size = '') => ({ selector, size, rows: ROWS, query: ROWS.find((row) => row.handle === size)?.media || '' });
const set = (css, selector, prop, value, size = '') => writeDeclarations(css, at(selector, size), [{ prop, value }]);

test('a first rule in an empty file', () => {
  assert.equal(set('', '.card', 'padding-top', '5rem'), '.card {\n    padding-top: 5rem;\n}\n');
});

test('a value replaces its own declaration, and a new one joins the rule', () => {
  let css = set('', '.card', 'padding-top', '5rem');

  css = set(css, '.card', 'padding-top', '6rem');
  css = set(css, '.card', 'display', 'flex');
  assert.equal(css, '.card {\n    padding-top: 6rem;\n    display: flex;\n}\n');
  assert.deepEqual(readRule(css, '.card', ROWS), [
    { size: '', prop: 'padding-top', value: '6rem' },
    { size: '', prop: 'display', value: 'flex' },
  ]);
});

test('a class goes in the file\'s one @scope, an ID at the top of the file', () => {
  const css = '@scope(.{{ _class }}) {\n    .title { color: red; }\n}\n';
  const withClass = set(css, '.card', 'display', 'flex');

  assert.match(withClass, /@scope\(\.\{\{ _class \}\}\) \{\n    \.title \{ color: red; \}\n    \.card \{\n        display: flex;\n    \}\n\}/);

  const withId = set(css, '#hero', 'display', 'flex');

  assert.match(withId, /^@scope[\s\S]*\}\n\n#hero \{\n    display: flex;\n\}\n$/);
});

test('an ID with Antlers is one rule, read and written where it stands', () => {
  const css = '#id-{{ id }} {\n    --bg: {{ bg_color }};\n}\n';
  const next = set(css, '#id-{{ id }}', 'margin-top', '1rem');

  assert.equal(next, '#id-{{ id }} {\n    --bg: {{ bg_color }};\n    margin-top: 1rem;\n}\n');
  assert.deepEqual(readRule(next, '#id-{{ id }}', ROWS), [{ size: '', prop: 'margin-top', value: '1rem' }]);
});

test('a size uses the block the file has, never a second one', () => {
  const css = '.a {\n    color: red;\n}\n\n@media (width < 64em) {\n    .b { color: blue; }\n}\n';
  const next = set(css, '.a', 'padding-top', '1rem', 'tablet');

  assert.equal(next.match(/@media/g).length, 1);
  assert.deepEqual(readRule(next, '.a', ROWS).find((decl) => decl.size === 'tablet'), { size: 'tablet', prop: 'padding-top', value: '1rem' });
});

test('the same boundary in other words is the same block', () => {
  const css = '.a {\n    color: red;\n}\n\n@media (max-width: 1023.98px) {\n    .b { color: blue; }\n}\n';

  assert.equal(set(css, '.a', 'color', 'green', 'tablet').match(/@media/g).length, 1);
});

test('a size block lands in cascade order, and after the base rule', () => {
  let css = set('', '.a', 'color', 'red', 'mobile');

  css = set(css, '.a', 'color', 'blue', 'tablet');
  assert.ok(css.indexOf('64em') < css.indexOf('48em'), 'tablet before mobile');

  css = set(css, '.a', 'color', 'green');
  assert.ok(css.indexOf('green') < css.indexOf('64em'), 'base before the sizes');
});

test('a size written before the base rule\'s block order is never put ahead of the base', () => {
  const css = '@media (width < 64em) {\n    .b { color: blue; }\n}\n\n.a {\n    color: red;\n}\n';
  const next = set(css, '.a', 'color', 'green', 'tablet');

  assert.ok(next.lastIndexOf('@media') > next.indexOf('color: red'), 'the size comes after the base');
});

test('taking a value out takes the empty rule and block with it, and nothing else', () => {
  const css = '.keep {\n    color: red;\n}\n';
  let next = set(css, '.a', 'color', 'blue', 'tablet');

  next = set(next, '.a', 'color', null, 'tablet');
  assert.equal(next.trim(), css.trim());

  let two = set('', '.a', 'color', 'blue');

  two = set(two, '.a', 'margin', '0');
  two = set(two, '.a', 'color', null);
  assert.equal(two, '.a {\n    margin: 0;\n}\n');
});

test('a size nested in the rule is that size', () => {
  const css = '#id-{{ id }} {\n    color: red;\n    @media (width < 48em) {\n        color: blue;\n    }\n}\n';

  assert.deepEqual(readRule(css, '#id-{{ id }}', ROWS), [
    { size: '', prop: 'color', value: 'red' },
    { size: 'mobile', prop: 'color', value: 'blue' },
  ]);
  assert.match(set(css, '#id-{{ id }}', 'color', 'green', 'mobile'), /@media \(width < 48em\) \{\n {8}color: green;\n {4}\}/);
});

test('other rules and comments stand untouched', () => {
  const css = '/* top */\n.a { color: red; /* mine */ margin: 0 }\n.ab { color: blue; }\n';
  const next = set(css, '.a', 'color', 'green');

  assert.ok(next.includes('/* top */'));
  assert.ok(next.includes('.ab { color: blue; }'));
  assert.ok(next.includes('color: green;'));
  assert.deepEqual(readRule(next, '.a', ROWS).map((decl) => decl.prop), ['color', 'margin']);
});

test('a value with a semicolon in it is one value', () => {
  const css = set('', '.a', 'background-image', 'url("data:image/png;base64,AA")');

  assert.deepEqual(readRule(css, '.a', ROWS), [{ size: '', prop: 'background-image', value: 'url("data:image/png;base64,AA")' }]);
});

test('the base row and All are the same place', () => {
  assert.equal(sizeKey(ROWS, 'desktop'), '');
  assert.equal(sizeKey(ROWS, null), '');
  assert.equal(sizeKey(ROWS, 'tablet'), 'tablet');
});

test('the canvas\'s sheet has no Antlers, and its sizes in cascade order', () => {
  let css = set('', '#id-{{ id }}', 'color', 'red');

  css = set(css, '#id-{{ id }}', 'color', 'blue', 'mobile');
  css = set(css, '#id-{{ id }}', 'color', 'green', 'tablet');
  css = css.replace('color: red;', 'color: red;\n    --x: {{ y }};');

  const sheet = liveSheet(css, [{ selector: '#id-{{ id }}', real: '#id-abc' }], ROWS);

  assert.ok(!sheet.includes('{{'));
  assert.ok(sheet.startsWith('@scope ([data-sve-build-root])'));
  assert.ok(sheet.indexOf('64em') < sheet.indexOf('48em'));
  assert.equal(liveSheet(css, [], ROWS), '');
});

/* ---------------- classes and declarations ---------------- */

const COMPILED = {
  flex: 'display: flex',
  block: 'display: block',
  'pt-700': 'padding-top: var(--spacing-700)',
  'pt-[5rem]': 'padding-top: 5rem',
  'shadow-md': 'box-shadow: var(--tw-inset-shadow), var(--tw-shadow)',
  'border-2': 'border-style: var(--tw-border-style); border-width: 2px',
  'bg-[url(/a;b.png)]': 'background-image: url(/a;b.png)',
};
const catalog = {
  cssOf: (name) => COMPILED[name] || '',
  scale: (prop) => ({ display: ['flex', 'block'], 'padding-top': ['pt-700', 'pt-800'] })[prop] || [],
};

test('a class is its declarations; one built on Tailwind\'s plumbing has none', () => {
  assert.deepEqual(classToCss('flex', catalog.cssOf), [{ prop: 'display', value: 'flex' }]);
  assert.equal(classToCss('shadow-md', catalog.cssOf), null);
  assert.equal(classToCss('border-2', catalog.cssOf), null);
  assert.equal(classToCss('nothing', catalog.cssOf), null);
  assert.deepEqual(classToCss('bg-[url(/a;b.png)]', catalog.cssOf), [{ prop: 'background-image', value: 'url(/a;b.png)' }]);
});

test('a declaration reads as the scale\'s row, a typed value, or any property', () => {
  assert.equal(cssToClass('display', 'flex', catalog), 'flex');
  assert.equal(cssToClass('padding-top', 'var(--spacing-700)', catalog), 'pt-700');
  assert.equal(cssToClass('padding-top', '5rem', catalog), 'pt-[5rem]');
  assert.equal(cssToClass('inset', '0 auto', catalog), '[inset:0_auto]');
});

test('declarations are split where they end', () => {
  assert.deepEqual(parseDeclarations('a: b; c: url(x;y);'), [{ prop: 'a', value: 'b' }, { prop: 'c', value: 'url(x;y)' }]);
});
