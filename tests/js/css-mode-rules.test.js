import assert from 'node:assert/strict';
import test from 'node:test';
import {
  liveSheet,
  readBound,
  readRule,
  renameSelector,
  sizeKey,
  writeDeclarations,
} from '../../resources/js/build-mode/css-mode/rules.js';
import {
  boundLabel,
  boundValue,
  createTranslator,
  fieldsFor,
  fillValue,
  parseDeclarations,
} from '../../resources/js/build-mode/css-mode/translate.js';

const ROWS = [
  { handle: 'desktop', base: true, direction: 'desktop', tw: '', media: '' },
  { handle: 'tablet', base: false, direction: 'desktop', max: '64em', tw: 'max-lg', media: '(width < 64em)' },
  { handle: 'mobile', base: false, direction: 'desktop', max: '48em', tw: 'max-md', media: '(width < 48em)' },
];
const at = (selector, size = '') => ({
  selector,
  size,
  rows: ROWS,
  query: ROWS.find((row) => row.handle === size)?.media || '',
});
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

test("a class goes in the file's one @scope, an ID at the top of the file", () => {
  const css = '@scope(.{{ _class }}) {\n    .title { color: red; }\n}\n';
  const withClass = set(css, '.card', 'display', 'flex');

  assert.match(
    withClass,
    /@scope\(\.\{\{ _class \}\}\) \{\n    \.title \{ color: red; \}\n    \.card \{\n        display: flex;\n    \}\n\}/
  );

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
  assert.deepEqual(
    readRule(next, '.a', ROWS).find((decl) => decl.size === 'tablet'),
    { size: 'tablet', prop: 'padding-top', value: '1rem' }
  );
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

test("a size written before the base rule's block order is never put ahead of the base", () => {
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
  assert.match(
    set(css, '#id-{{ id }}', 'color', 'green', 'mobile'),
    /@media \(width < 48em\) \{\n {8}color: green;\n {4}\}/
  );
});

test('other rules and comments stand untouched', () => {
  const css = '/* top */\n.a { color: red; /* mine */ margin: 0 }\n.ab { color: blue; }\n';
  const next = set(css, '.a', 'color', 'green');

  assert.ok(next.includes('/* top */'));
  assert.ok(next.includes('.ab { color: blue; }'));
  assert.ok(next.includes('color: green;'));
  assert.deepEqual(
    readRule(next, '.a', ROWS).map((decl) => decl.prop),
    ['color', 'margin']
  );
});

test('a value with a semicolon in it is one value', () => {
  const css = set('', '.a', 'background-image', 'url("data:image/png;base64,AA")');

  assert.deepEqual(readRule(css, '.a', ROWS), [
    { size: '', prop: 'background-image', value: 'url("data:image/png;base64,AA")' },
  ]);
});

test('the base row and All are the same place', () => {
  assert.equal(sizeKey(ROWS, 'desktop'), '');
  assert.equal(sizeKey(ROWS, null), '');
  assert.equal(sizeKey(ROWS, 'tablet'), 'tablet');
});

test("the canvas's sheet has no Antlers, and its sizes in cascade order", () => {
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
const translator = createTranslator({
  ruleOf: (name) =>
    COMPILED[name]
      ? `.x {\n  ${COMPILED[name]
          .split(/;\s*(?![^(]*\))/)
          .filter(Boolean)
          .join(';\n  ')};\n}`
      : '',
  scale: (prop) => ({ display: ['flex', 'block'], 'padding-top': ['pt-700', 'pt-800'] })[prop] || [],
});

test("a class is its declarations; what is left of Tailwind's plumbing has none", () => {
  assert.deepEqual(translator.planFor('flex').decls, [{ prop: 'display', value: 'flex' }]);
  assert.equal(translator.planFor('nothing'), null);
  assert.deepEqual(translator.planFor('bg-[url(/a;b.png)]').decls, [
    { prop: 'background-image', value: 'url(/a;b.png)' },
  ]);
});

test("a declaration reads as the scale's row, a typed value, or any property", () => {
  assert.equal(translator.nameFor('display', 'flex'), 'flex');
  assert.equal(translator.nameFor('padding-top', 'var(--spacing-700)'), 'pt-700');
  assert.equal(translator.nameFor('padding-top', '5rem'), 'pt-[5rem]');
  assert.equal(translator.nameFor('inset', '0 auto'), '[inset:0_auto]');
});

test('declarations are split where they end', () => {
  assert.deepEqual(parseDeclarations('a: b; c: url(x;y);'), [
    { prop: 'a', value: 'b' },
    { prop: 'c', value: 'url(x;y)' },
  ]);
});

/* ---------------- renaming an ID ---------------- */

test('renaming reaches every rule that names the ID, and nothing else', () => {
  const css =
    '#a { color: red; }\n#ab { color: blue; }\n#a .b, .c { margin: 0; }\n@media (width < 48em) {\n    #a:hover { color: green; }\n}\n.d { background: url(#a); }\n';
  const next = renameSelector(css, '#a', '#z');

  assert.equal(
    next,
    '#z { color: red; }\n#ab { color: blue; }\n#z .b, .c { margin: 0; }\n@media (width < 48em) {\n    #z:hover { color: green; }\n}\n.d { background: url(#a); }\n'
  );
});

test('a dynamic ID is the same however its tag is spaced', () => {
  const next = renameSelector(
    '#titel-{{id}} { color: red; }\n#titel-{{ id }} .x { margin: 0; }\n',
    '#titel-{{ id }}',
    '#navn-{{ id }}'
  );

  assert.equal(next, '#navn-{{ id }} { color: red; }\n#navn-{{ id }} .x { margin: 0; }\n');
});

/* ---------------- a style's value from a field ---------------- */

test("a field's value is read apart from the values written by hand", () => {
  const css = '#id-{{ id }} {\n    background-color: {{ bg_color }};\n    padding-top: 2rem;\n}\n';

  assert.deepEqual(readBound(css, '#id-{{ id }}', ROWS), [
    { size: '', prop: 'background-color', value: '{{ bg_color }}' },
  ]);
  assert.deepEqual(readRule(css, '#id-{{ id }}', ROWS), [{ size: '', prop: 'padding-top', value: '2rem' }]);
});

test("a field's value replaces a value by hand, and a value by hand replaces it", () => {
  let css = set('', '#a', 'color', 'red');

  css = set(css, '#a', 'color', '{{ c }}');
  assert.equal(css, '#a {\n    color: {{ c }};\n}\n');
  css = set(css, '#a', 'color', 'blue');
  assert.equal(css, '#a {\n    color: blue;\n}\n');
});

test('only fields that fit are offered', () => {
  assert.deepEqual(fieldsFor('background-color').types, ['theme_color_picker', 'color']);
  assert.ok(fieldsFor('padding-top').types.includes('range'));
  assert.ok(fieldsFor('padding-top').types.includes('select'));
  assert.ok(!fieldsFor('padding-top').types.includes('theme_color_picker'));
  assert.deepEqual(fieldsFor('background-image'), { types: ['assets'], single: true });
  assert.ok(fieldsFor('background-size').types.includes('select'));
  assert.ok(!fieldsFor('background-size').types.includes('range'));
});

test('a number gets the unit, words do not, an image its url()', () => {
  assert.equal(boundValue('padding-top', '{{ g }}', { type: 'range', unit: 'em' }), '{{ g }}em');
  assert.equal(boundValue('padding-top', '{{ g }}', { type: 'text', current: '4' }), '{{ g }}rem');
  assert.equal(boundValue('padding-top', '{{ g }}', { type: 'text', current: '2rem' }), '{{ g }}');
  assert.equal(boundValue('padding-top', '{{ g }}', { type: 'select', current: 'var(--size-500)' }), '{{ g }}');
  assert.equal(boundValue('background-color', '{{ c }}', { type: 'theme_color_picker', current: '4' }), '{{ c }}');
  assert.equal(boundValue('background-image', '{{ i }}'), 'url({{ i }})');
});

test('a field shows by its name', () => {
  assert.equal(boundLabel('{{ gap }}rem'), 'gap rem');
  assert.equal(boundLabel('url({{ image }})'), 'image');
  assert.equal(boundLabel('{{ bg_color }}'), 'bg_color');
});

test('the canvas fills a field in, and leaves what it cannot to the server', () => {
  const fill = (value) => fillValue(value, (body) => ({ c: 'var(--gray-600)', g: 4, empty: '' })[body.trim()]);

  assert.equal(fill('{{ c }}'), 'var(--gray-600)');
  assert.equal(fill('{{ g }}rem'), '4rem');
  assert.equal(fill('{{ empty }}rem'), '');
  assert.equal(fill('{{ other | modify }}'), '');

  const css = '#a {\n    color: {{ c }};\n    margin: 1rem;\n    padding: {{ nope }};\n}\n';
  const sheet = liveSheet(css, [{ selector: '#a', real: '#a' }], ROWS, fill);

  assert.ok(sheet.includes('color: var(--gray-600);'));
  assert.ok(sheet.includes('margin: 1rem;'));
  assert.ok(!sheet.includes('padding'));
  assert.ok(!sheet.includes('{{'));
});
