import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { __unstable__loadDesignSystem as loadDesignSystem } from 'tailwindcss';
import { STYLE_FIELDS } from '../../resources/js/build-mode/catalog.js';
import { applyUpdates, partsOf, readPlaces, writeParts } from '../../resources/js/build-mode/css-mode/parts.js';
import { moveClassesIntoScope } from '../../resources/js/css-scope-move.js';
import { liveSheet, readBound, readRule, renameSelector, treeOf, writeDeclarations } from '../../resources/js/build-mode/css-mode/rules.js';
import { boundValue, createTranslator, fieldsFor, planIsOn, planOf, planUpdates, printKeyframes } from '../../resources/js/build-mode/css-mode/translate.js';

/*
 * Against Tailwind's real output, not a copy of it: the classes Style's fields
 * offer have to come out as plain CSS and read back as themselves.
 */

const ROOT = new URL('../../', import.meta.url).pathname;
const theme = readFileSync(`${ROOT}node_modules/tailwindcss/theme.css`, 'utf8');
const utilities = readFileSync(`${ROOT}node_modules/tailwindcss/utilities.css`, 'utf8');
const SITE = '@theme { --color-primary: #11122c; --text-500: var(--size-500); }';
const design = await loadDesignSystem(`@layer theme, utilities;\n@import "T" layer(theme);\n@import "U" layer(utilities);\n${SITE}`, {
  base: '/',
  loadStylesheet: async (id, base) => ({ base, content: id === 'U' ? utilities : theme }),
});
const LIST = design.getClassList().map(([name]) => name);
const ruleOf = (name) => design.candidatesToCss([name])[0] || '';
const themeValue = (name) => design.resolveThemeValue(name);
const plan = (name) => planOf(ruleOf(name), themeValue);
const utilityNames = (roots, only = '') => roots.flatMap((root) => LIST.filter((name) => name === root || (name.startsWith(`${root}-`) && (root !== 'scale' || !/^scale-[xyz3]/.test(name)) && (root !== '-scale' || !/^-scale-[xyz3]/.test(name)))))
  .filter((name) => !only || ruleOf(name).includes(only));

const ROWS = [
  { handle: 'desktop', base: true, direction: 'desktop', tw: '', media: '' },
  { handle: 'tablet', base: false, direction: 'desktop', max: '64em', tw: 'max-lg', media: '(width < 64em)' },
  { handle: 'mobile', base: false, direction: 'desktop', max: '48em', tw: 'max-md', media: '(width < 48em)' },
];
const SUFFIXES = [':hover', '::before'];
const place = (size = '', suffix = '') => ({ selector: '.a', suffix, suffixes: SUFFIXES, size, rows: ROWS, query: ROWS.find((row) => row.handle === size)?.media || '' });
const named = () => [
  'border-0', 'border', 'border-2', 'border-4', 'border-8',
  ...Object.values(STYLE_FIELDS).flat().flatMap((field) => field.names || []),
  ...Object.values(STYLE_FIELDS).flat().flatMap((field) => (field.roots?.length ? utilityNames(field.roots, field.only) : [])),
];
const translator = createTranslator({ ruleOf, themeValue, scale: () => [], named });
const set = (css, name, size = '', suffix = '') => applyUpdates(css, place(size, suffix), planUpdates(translator.planFor(name), null, new Map(readRule(css, `.a${suffix}`, ROWS).filter((one) => one.size === size).map((one) => [one.prop, one.value]))));
const value = (css, prop, size = '', suffix = '') => readRule(css, `.a${suffix}`, ROWS).find((one) => one.prop === prop && one.size === size)?.value;

test('filter: each function has its share of the one value, and can be taken out alone', () => {
  let css = set('', 'blur-sm');

  css = set(css, 'contrast-150');
  css = set(css, 'sepia');
  assert.equal(value(css, 'filter'), 'blur(8px) contrast(150%) sepia(100%)');
  assert.ok(!css.includes('--tw-'));
  assert.deepEqual([...readPlaces(css, '.a', 'filter', ROWS)[0].own.keys()], ['blur', 'contrast', 'sepia']);

  css = writeParts(css, place(), 'filter', [{ key: 'contrast', value: null }]);
  assert.equal(value(css, 'filter'), 'blur(8px) sepia(100%)');
  css = writeParts(css, place(), 'filter', [{ key: 'blur', value: null }, { key: 'sepia', value: null }]);
  assert.equal(value(css, 'filter'), undefined);
  assert.equal(css.trim(), '');
});

test('a value at a narrower size holds what reaches it, and reads back as only its own', () => {
  let css = set(set('', 'contrast-150'), 'blur-sm');

  css = set(css, 'blur-lg', 'tablet');
  assert.match(value(css, 'filter', 'tablet'), /contrast\(150%\)/);
  assert.match(value(css, 'filter', 'tablet'), /blur\(16px\)/);

  const tablet = readPlaces(css, '.a', 'filter', ROWS).find((one) => one.size === 'tablet');

  assert.deepEqual([...tablet.own], [['blur', 'blur(16px)']]);
});

test('a part changed at a wider size follows down, and the narrower size keeps its own', () => {
  let css = set(set('', 'contrast-150'), 'blur-sm');

  css = set(css, 'blur-lg', 'tablet');
  css = set(css, 'contrast-200');
  assert.match(value(css, 'filter'), /contrast\(200%\)/);
  assert.match(value(css, 'filter', 'tablet'), /contrast\(200%\)/);
  assert.match(value(css, 'filter', 'tablet'), /blur\(16px\)/);
});

test('taking the last own part off a size removes its value: it inherits again', () => {
  let css = set('', 'contrast-150');

  css = set(css, 'blur-lg', 'tablet');
  css = writeParts(css, place('tablet'), 'filter', [{ key: 'blur', value: null }]);
  assert.equal(value(css, 'filter', 'tablet'), undefined);
  assert.equal((css.match(/@media/g) || []).length, 0);
});

test('a state holds what the plain rule has, and follows it', () => {
  let css = set('', 'contrast-150');

  css = set(css, 'blur-sm', '', ':hover');
  assert.match(css, /\.a:hover \{/);
  assert.equal(value(css, 'filter', '', ':hover'), 'contrast(150%) blur(8px)');
  css = set(css, 'contrast-200');
  assert.equal(value(css, 'filter', '', ':hover'), 'contrast(200%) blur(8px)');
  assert.deepEqual([...readPlaces(css, '.a', 'filter', ROWS, SUFFIXES).find((one) => one.suffix === ':hover' && !one.size).own], [['blur', 'blur(8px)']]);
});

test('blur-none: off where one reaches, gone where none does', () => {
  let css = set('', 'blur-sm');

  css = set(css, 'blur-none', 'tablet');
  assert.equal(value(css, 'filter', 'tablet'), 'blur(0)');
  css = set(css, 'blur-none');
  assert.equal(value(css, 'filter'), undefined);
});

test('backdrop-filter is plain, one property', () => {
  const css = set('', 'backdrop-blur-sm');

  assert.equal(value(css, 'backdrop-filter'), 'blur(8px)');
  assert.ok(!css.includes('-webkit'));
});

test('drop-shadow reads the theme\'s shadow as a value', () => {
  const css = set('', 'drop-shadow-md');

  assert.match(value(css, 'filter'), /^drop-shadow\(0 3px 3px/);
  assert.ok(!css.includes('var('));
});

test('translate: x and y share one value', () => {
  let css = set('', 'translate-x-[3px]');

  assert.equal(value(css, 'translate'), '3px');
  css = set(css, 'translate-y-1/2');
  assert.equal(value(css, 'translate'), '3px calc(1 / 2 * 100%)');
  css = writeParts(css, place(), 'translate', [{ key: 'x', value: null }]);
  assert.equal(value(css, 'translate'), '0 calc(1 / 2 * 100%)');
  assert.deepEqual([...readPlaces(css, '.a', 'translate', ROWS)[0].own], [['y', 'calc(1 / 2 * 100%)']]);
});

test('scale: one value when x and y agree, and the class that says both', () => {
  let css = set('', 'scale-150');

  assert.equal(value(css, 'scale'), '150%');
  assert.deepEqual(translator.namesForParts('scale', readPlaces(css, '.a', 'scale', ROWS)[0].own), ['scale-150']);
  css = set(css, 'scale-y-50');
  assert.equal(value(css, 'scale'), '150% 50%');
  assert.deepEqual(translator.namesForParts('scale', readPlaces(css, '.a', 'scale', ROWS)[0].own), ['scale-x-150', 'scale-y-50']);

  css = set('', 'scale-x-150');
  assert.equal(value(css, 'scale'), '150% 100%');
  css = writeParts(css, place(), 'scale', [{ key: 'x', value: null }]);
  assert.equal(value(css, 'scale'), undefined);
});

test('skew needs transform; rotate and the rest stand alone', () => {
  let css = set('', 'skew-x-12');

  css = set(css, '-skew-y-6');
  assert.equal(value(css, 'transform'), 'skewX(12deg) skewY(calc(6deg * -1))');
  assert.deepEqual(plan('rotate-45').decls, [{ prop: 'rotate', value: '45deg' }]);
});

test('a gradient is built from its direction and stops', () => {
  let css = set('', 'bg-linear-to-r');

  assert.equal(value(css, 'background-image'), 'linear-gradient(to right, transparent, transparent)');
  css = set(css, 'from-primary');
  assert.equal(value(css, 'background-image'), 'linear-gradient(to right, var(--color-primary), transparent)');
  css = set(css, 'to-[#123]');
  css = set(css, 'via-primary');
  assert.equal(value(css, 'background-image'), 'linear-gradient(to right, var(--color-primary), var(--color-primary), #123)');
  assert.deepEqual(translator.namesForParts('background-image', readPlaces(css, '.a', 'background-image', ROWS)[0].own).sort(), ['bg-linear-to-r', 'from-primary', 'to-[#123]', 'via-primary']);
  assert.ok(!css.includes('--tw-'));
  css = writeParts(css, place(), 'background-image', ['position', 'from', 'via', 'to'].map((key) => ({ key, value: null })));
  assert.equal(css.trim(), '');
});

test('a stop with no direction is a gradient that shows, and an image is not taken apart', () => {
  assert.equal(value(set('', 'from-primary'), 'background-image'), 'linear-gradient(to bottom, var(--color-primary), transparent)');
  assert.equal(partsOf('background-image', 'url(/a.png)'), null);
  assert.equal(partsOf('background-image', 'url({{ a }})'), null);

  const css = writeDeclarations('', { selector: '.a', size: '', rows: ROWS, query: '' }, [{ prop: 'background-image', value: 'url(/a.png)' }]);

  assert.equal(value(set(css, 'from-primary'), 'background-image'), 'linear-gradient(to bottom, var(--color-primary), transparent)');
  assert.equal(plan('bg-none').decls[0].value, 'none');
});

test('a shadow is its value, with the colour it falls back on', () => {
  assert.deepEqual(plan('shadow-md').decls, [{ prop: 'box-shadow', value: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }]);
  assert.deepEqual(plan('shadow-none').decls, [{ prop: 'box-shadow', value: '0 0 #0000' }]);
  assert.equal(plan('text-shadow-sm').decls[0].value, '0px 1px 0px rgb(0 0 0 / 0.075), 0px 1px 1px rgb(0 0 0 / 0.075), 0px 2px 2px rgb(0 0 0 / 0.075)');
});

test('a border width brings a style only where there is none', () => {
  let css = set('', 'border-2');

  assert.equal(value(css, 'border-width'), '2px');
  assert.equal(value(css, 'border-style'), 'solid');

  css = set('', 'border-dashed');
  css = set(css, 'border-4');
  assert.equal(value(css, 'border-style'), 'dashed');
  assert.equal(value(css, 'border-width'), '4px');

  const here = new Map([['border-style', 'dashed'], ['border-width', '4px']]);

  assert.deepEqual(planUpdates(null, plan('border-4'), here), [{ prop: 'border-width', value: null }], 'a chosen style stays');
  assert.equal(translator.nameFor('border-width', '2px'), 'border-2');
  assert.ok(planIsOn(plan('border-4'), here, () => new Map()));
});

test('a soft value does not cover what reaches the place from a wider size', () => {
  assert.deepEqual(planUpdates(plan('border-4'), null, new Map(), new Set(['border-style'])), [{ prop: 'border-width', value: '4px' }]);
  assert.deepEqual(planUpdates(plan('border-4'), null, new Map(), new Set()), [{ prop: 'border-style', value: 'solid' }, { prop: 'border-width', value: '4px' }]);
});

test('an outline width brings solid, as the class does', () => {
  const css = set('', 'outline-2');

  assert.equal(value(css, 'outline-style'), 'solid');
  assert.equal(value(css, 'outline-width'), '2px');
});

test('a transition writes its property; duration and easing stay the field\'s to choose', () => {
  let css = set('', 'duration-300');

  css = set(css, 'transition-colors');
  assert.equal(value(css, 'transition-duration'), '300ms');
  assert.ok(value(css, 'transition-property').startsWith('color, background-color'));
  assert.equal(value(css, 'transition-timing-function'), 'cubic-bezier(0.4, 0, 0.2, 1)');
  assert.ok(!/--tw-|var\(/.test(css));
  assert.equal(translator.nameFor('transition-property', value(css, 'transition-property')), 'transition-colors');
});

test('an animation writes its steps into the file, and takes them along', () => {
  const steps = printKeyframes(design.theme.getKeyframes().find((node) => node.params === 'spin'));
  const updates = [...planUpdates(plan('animate-spin'), null), { keyframes: 'spin', text: steps }];
  let css = applyUpdates('', place(), updates);

  assert.equal(value(css, 'animation'), 'spin 1s linear infinite');
  assert.match(css, /@keyframes spin \{\n {4}to \{\n {8}transform: rotate\(360deg\);\n {4}\}\n\}/);
  assert.equal((applyUpdates(css, place(), updates).match(/@keyframes/g) || []).length, 1);
  assert.match(liveSheet(css, [{ selector: '.a', real: '.a' }], ROWS), /^@keyframes spin/);

  css = applyUpdates(css, place(), planUpdates(null, plan('animate-spin'), new Map([['animation', 'spin 1s linear infinite']])));
  assert.equal(css.trim(), '');
});

test('steps another rule still uses stay', () => {
  const css = '.b {\n    animation: spin 1s;\n}\n\n.a {\n    animation: spin 2s;\n}\n\n@keyframes spin {\n    to { rotate: 1turn; }\n}\n';
  const next = applyUpdates(css, place(), planUpdates(null, plan('animate-spin'), new Map([['animation', 'spin 2s']])));

  assert.match(next, /@keyframes spin/);
});

test('a state is found where the dock writes it, inside the rule, and written there', () => {
  const css = '.a {\n    color: red;\n    &:hover {\n        color: blue;\n    }\n}\n';

  assert.deepEqual(readRule(css, '.a:hover', ROWS), [{ size: '', prop: 'color', value: 'blue' }]);
  assert.deepEqual(readRule(css, '.a', ROWS), [{ size: '', prop: 'color', value: 'red' }]);

  const next = writeDeclarations(css, { selector: '.a:hover', size: '', rows: ROWS, query: '' }, [{ prop: 'color', value: 'green' }]);

  assert.match(next, /&:hover \{\n {8}color: green;\n {4}\}/);
  assert.ok(!next.includes('.a:hover'));
});

test('a state at a size is the file\'s one block, and the sheet shows it', () => {
  let css = set('', 'blur-sm', 'tablet');

  css = set(css, 'blur-lg', 'tablet', ':hover');
  assert.equal((css.match(/@media/g) || []).length, 1);

  const sheet = liveSheet(css, [{ selector: '.a', real: '.a' }], ROWS, undefined, SUFFIXES);

  assert.match(sheet, /\.a:hover, :scope\.a:hover \{ filter: blur\(16px\); \}/);
});

test('a state\'s plain rule stands before the blocks the file has, so its sizes share them', () => {
  let css = set('', 'blur-sm', 'tablet');

  css = set(css, 'blur-lg', '', ':hover');
  css = set(css, 'blur-xl', 'tablet', ':hover');
  assert.equal((css.match(/@media/g) || []).length, 1);
  assert.ok(css.indexOf('.a:hover {') < css.indexOf('@media'));
});

test('a class with a fraction is the whole class, and reads as a typed value', () => {
  assert.equal(translator.planFor('translate-y-1/2').parts[0].value, 'calc(1 / 2 * 100%)');
  assert.deepEqual(translator.namesForParts('translate', new Map([['y', 'calc(1 / 2 * 100%)']])), ['translate-y-[calc(1_/_2_*_100%)]']);
});

test('Antlers in a shared value stands until that very place is written', () => {
  const css = '.a {\n    filter: {{ f }};\n}\n';

  assert.equal(partsOf('filter', '{{ f }}'), null);
  assert.equal(readPlaces(css, '.a', 'filter', ROWS)[0].opaque, true);
  assert.match(set(css, 'blur-sm', 'tablet'), /filter: \{\{ f \}\};/);
  assert.equal(value(set(css, 'blur-sm'), 'filter'), 'blur(8px)');
});

test('every class a field of Style offers is plain CSS, and reads back as a field of its own', () => {
  const none = [];
  const lost = [];

  for (const [family, fields] of Object.entries(STYLE_FIELDS)) {
    for (const field of fields.filter((one) => !one.css && !one.seg && !one.image)) {
      const names = field.names || utilityNames(field.roots, field.only);

      assert.ok(names.length, `${family}/${field.label} has names`);

      for (const name of names) {
        const one = plan(name);

        if (!one) {
          none.push(name);
        } else if ([...one.decls, ...one.parts].some((part) => /--tw-/.test(part.value))) {
          none.push(`${name}: plumbing`);
        } else {
          const css = set('', name);
          const parts = ['filter', 'backdrop-filter', 'transform', 'translate', 'scale', 'background-image'];
          const backs = [
            ...parts.flatMap((prop) => readPlaces(css, '.a', prop, ROWS).flatMap((slot) => translator.namesForParts(prop, slot.own))),
            ...translator.namesForDeclarations(readRule(css, '.a', ROWS).filter((decl) => !parts.includes(decl.prop) || !partsOf(decl.prop, decl.value))),
          ];
          const reads = backs.some((back) => {
            if (field.names) {
              return field.names.includes(back);
            }

            return field.roots.some((root) => back === root || back.startsWith(`${root}-`));
          });
          // `blur-none`, `scale-100`, `from-transparent`: where nothing reaches they have nothing to say.
          const nothing = one.parts.length && !css.trim();

          if (!reads && !nothing) {
            lost.push(`${name} → ${backs.join(' ') || '(nothing)'} ${css.replace(/\s+/g, ' ')}`);
          }
        }
      }
    }
  }

  assert.deepEqual(none, []);
  assert.deepEqual(lost, []);
});

test('a class of several declarations reads as itself when all of them stand', () => {
  assert.deepEqual(translator.namesForDeclarations([{ prop: 'overflow-wrap', value: 'normal' }, { prop: 'word-break', value: 'normal' }]), ['break-normal']);
  assert.deepEqual(translator.namesForDeclarations([{ prop: 'word-break', value: 'normal' }]), ['[word-break:normal]']);
});

/* ---------------- Fable's findings ---------------- */

const at = (selector, size = '') => ({ selector, size, rows: ROWS, query: ROWS.find((row) => row.handle === size)?.media || '' });
const put = (css, selector, prop, value, size = '') => writeDeclarations(css, at(selector, size), [{ prop, value }]);
const HERO = readFileSync(new URL('./fixtures/css-mode-hero.css', import.meta.url), 'utf8');

test('a tag holding a tag does not swallow the file: the @scope after it is seen', () => {
  const top = treeOf(HERO).map((node) => node.prelude.replace(/\s+/g, ' '));

  assert.ok(top.some((one) => /^@scope/.test(one)), top.join(' | '));

  let css = put(`${HERO}\n.kort {\n}\n`, '.kort', 'padding-top', '5rem');

  css = put(css, '.kort', 'padding-top', '6rem');
  assert.deepEqual(readRule(css, '.kort', ROWS), [{ size: '', prop: 'padding-top', value: '6rem' }]);
  assert.equal((css.match(/\.kort \{/g) || []).length, 1, 'one rule');
  assert.ok(css.indexOf('.kort {') > css.indexOf('@scope'), 'in the scope');
  assert.match(css, /selector="#id-\{\{ id \}\} \.content"/, 'the tag itself is as it was');
});

test('renaming reaches a rule after a tag holding a tag', () => {
  const css = '{{ responsive_css selector="#id-{{ id }} .x" only="a" }}\n{{ /responsive_css }}\n#old {\n    color: red;\n}\n';

  assert.match(renameSelector(css, '#old', '#new'), /#new \{/);
});

test('a state on an ID holding {{ id }} is found again', () => {
  let css = put('', '#knap-{{ id }}:hover', 'color', 'blue');

  css = put(css, '#knap-{{ id }}:hover', 'color', 'green');
  assert.equal((css.match(/:hover/g) || []).length, 1);
  assert.deepEqual(readRule(css, '#knap-{{ id }}:hover', ROWS), [{ size: '', prop: 'color', value: 'green' }]);
  assert.deepEqual(readRule(css, '#knap-{{ id }}', ROWS), []);
  assert.match(liveSheet(css, [{ selector: '#knap-{{ id }}', real: '#knap-abc' }], ROWS, undefined, SUFFIXES), /#knap-abc:hover, :scope#knap-abc:hover \{ color: green; \}/);
  css = put(css, '#knap-{{ id }}:hover', 'color', null);
  assert.equal(css.trim(), '');
  assert.deepEqual(readRule(put('', '#id-{{ id }}::before', 'color', 'red'), '#id-{{ id }}::before', ROWS), [{ size: '', prop: 'color', value: 'red' }]);
});

test('a size on the section\'s ID stays out of {{ responsive_css }}, which would make it #id-x #id-x', () => {
  const css = '{{ responsive_css except="padding" }}\n    .icon { color: red; }\n    @media (width < 64em) {\n        .icon { color: blue; }\n    }\n{{ /responsive_css }}\n';
  const next = put(put(css, '#id-{{ id }}', 'padding-top', '5rem'), '#id-{{ id }}', 'padding-top', '2rem', 'tablet');
  const close = next.indexOf('{{ /responsive_css }}');

  assert.ok(next.indexOf('padding-top: 2rem') > close, next);
  assert.deepEqual(readRule(next, '#id-{{ id }}', ROWS).map((one) => [one.size, one.value]), [['', '5rem'], ['tablet', '2rem']]);
});

test('a new class\'s All stands before its Tablet, in one block, and the save leaves it there', () => {
  const start = '@scope(.{{ _class }}) {\n    .content { color: red; }\n    @media (width < 64em) { .content { color: blue; } }\n}\n.kort {\n}\n';
  let css = put(start, '.kort', 'padding-top', '5rem');

  css = put(css, '.kort', 'padding-top', '2rem', 'tablet');
  assert.equal((css.match(/@media/g) || []).length, 1, css);

  const saved = moveClassesIntoScope(css);
  const text = typeof saved === 'string' ? saved : saved.css;

  assert.ok(text.indexOf('padding-top: 5rem') < text.indexOf('padding-top: 2rem'), text);
  assert.ok(text.indexOf('padding-top: 5rem') > text.indexOf('@scope'), text);
});

test('Tablet first, All after: still in cascade order', () => {
  const start = '@scope(.{{ _class }}) {\n    .content { color: red; }\n}\n.kort {\n}\n';
  let css = put(start, '.kort', 'padding-top', '2rem', 'tablet');

  css = put(css, '.kort', 'padding-top', '5rem');
  assert.ok(css.indexOf('padding-top: 5rem') < css.indexOf('padding-top: 2rem'), css);
  assert.equal((css.match(/\.kort \{/g) || []).length, 2);
});

test('a global rule written by hand beside a scope of the section\'s ID stays where it is', () => {
  const css = '@scope(#id-{{ id }}) {\n    .x { color: red; }\n}\n.kort {\n    color: blue;\n}\n';

  assert.match(put(css, '.kort', 'margin-top', '1rem'), /\}\n\.kort \{\n {4}color: blue;\n {4}margin-top: 1rem;\n\}/);
});

test('a size inside a nested state is read and written there', () => {
  const css = '.a {\n    color: red;\n    &:hover {\n        color: blue;\n        @media (width < 64em) {\n            color: green;\n        }\n    }\n}\n';

  assert.deepEqual(readRule(css, '.a:hover', ROWS).map((one) => [one.size, one.value]), [['', 'blue'], ['tablet', 'green']]);

  const next = put(css, '.a:hover', 'color', 'pink', 'tablet');

  assert.ok(!next.includes('green') && !next.includes('.a:hover'), next);
  assert.deepEqual(readBound(next, '.a:hover', ROWS), []);
});

test('a data icon\'s fields fit the property', () => {
  assert.deepEqual(fieldsFor('color').types, ['theme_color_picker', 'color']);
  assert.deepEqual(fieldsFor('border-color').types, ['theme_color_picker', 'color']);
  assert.deepEqual(fieldsFor('border-top-color').types, ['theme_color_picker', 'color']);
  assert.ok(fieldsFor('font-size').types.includes('integer') && fieldsFor('font-size').types.includes('select') && fieldsFor('font-size').length);
  assert.ok(fieldsFor('font-family').types.includes('font_family_selector') && fieldsFor('font-family').types.includes('text'));
  assert.ok(!fieldsFor('font-family').types.includes('integer'));
  assert.ok(fieldsFor('z-index').types.includes('integer') && !fieldsFor('z-index').length);
  assert.equal(boundValue('z-index', '{{ z }}', { type: 'integer' }), '{{ z }}');
  assert.equal(boundValue('rotate', '{{ r }}', { type: 'integer' }), '{{ r }}deg');
  assert.equal(boundValue('transition-duration', '{{ d }}', { type: 'integer' }), '{{ d }}ms');
  assert.equal(boundValue('width', '{{ w }}', { type: 'integer', unit: 'rem' }), '{{ w }}rem');
  assert.ok(!fieldsFor('position').types.includes('integer'));
});
