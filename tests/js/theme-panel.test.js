import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readTokens, resolveToken, writeTokens } from '../../resources/js/cp/theme-panel/tokens.js';
import { inferViewport, nextSizeName, parseSize, sizeValue } from '../../resources/js/cp/theme-panel/sizes.js';
import { BORDERS, CHECK_SIZES, INPUT_TOKENS, OPACITIES, TITLE_TOKENS, TRACKINGS, TYPE_TOKENS, isManaged, withCurrent } from '../../resources/js/cp/theme-panel/presets.js';
import { highlightNameProblem, isHighlightValue, nextHighlightName, readHighlights } from '../../resources/js/cp/theme-panel/highlights.js';
import { checkSample, fieldSample, sampleColor } from '../../resources/js/cp/theme-panel/samples.js';

const CSS = `@import "tailwindcss";

@theme {
    --color-primary: #11122C;

    --leading-normal: 1.5;

    --font-*: initial;
    --font-base: 'Inter', 'Helvetica', sans-serif;

    /* Temaet */
    --container-width: 80rem;

    --size-sm: .9375rem;
    --size-100: clamp(0.9375rem, 0.9167rem + 0.1042vw, 1rem);
    --size-200: clamp(1rem, 0.9583rem + 0.2083vw, 1.125rem);

    --font-size-h1: var(--size-200);
    --line-height: var(--leading-normal);

    --button-radius: var(--radius-sm);
}

.btn { color: red; }
`;

// What the old theme settings (the fluid-size addon) wrote for this site, min → max px.
const FLUID_SIZE = [
  [15, 16, 'clamp(0.9375rem, 0.9167rem + 0.1042vw, 1rem)'],
  [16, 18, 'clamp(1rem, 0.9583rem + 0.2083vw, 1.125rem)'],
  [18, 22, 'clamp(1.125rem, 1.0417rem + 0.4167vw, 1.375rem)'],
  [21, 26, 'clamp(1.3125rem, 1.2083rem + 0.5208vw, 1.625rem)'],
  [24, 34, 'clamp(1.5rem, 1.2917rem + 1.0417vw, 2.125rem)'],
  [31, 44, 'clamp(1.9375rem, 1.6667rem + 1.3542vw, 2.75rem)'],
  [38, 56, 'clamp(2.375rem, 2rem + 1.875vw, 3.5rem)'],
  [48, 70, 'clamp(3rem, 2.5417rem + 2.2917vw, 4.375rem)'],
  [60, 86, 'clamp(3.75rem, 3.2083rem + 2.7083vw, 5.375rem)'],
  [72, 110, 'clamp(4.5rem, 3.7083rem + 3.9583vw, 6.875rem)'],
  [84, 135, 'clamp(5.25rem, 4.1875rem + 5.3125vw, 8.4375rem)'],
  [90, 150, 'clamp(5.625rem, 4.375rem + 6.25vw, 9.375rem)'],
];

test('every token in @theme is read, comments and other rules are not', () => {
  const tokens = readTokens(CSS);

  assert.equal(tokens.get('size-100'), 'clamp(0.9375rem, 0.9167rem + 0.1042vw, 1rem)');
  assert.equal(tokens.get('font-base'), "'Inter', 'Helvetica', sans-serif");
  // Tailwind's namespace resets are not tokens.
  assert.ok(![...tokens.keys()].some((name) => name.includes('*')));
});

test('writing the same values changes nothing, byte for byte', () => {
  assert.equal(writeTokens(CSS, Object.fromEntries(readTokens(CSS))), CSS);
});

test('a changed token is rewritten in place, and only that line', () => {
  const out = writeTokens(CSS, { 'button-radius': '0.5rem' });

  assert.equal(out, CSS.replace('--button-radius: var(--radius-sm);', '--button-radius: 0.5rem;'));
});

test('a new size lands in number order inside the scale; a removed one goes', () => {
  const out = writeTokens(CSS, { 'size-150': '1rem', 'size-300': '2rem', 'size-100': null });

  assert.ok(out.includes(`    --size-sm: .9375rem;
    --size-150: 1rem;
    --size-200: clamp(1rem, 0.9583rem + 0.2083vw, 1.125rem);
    --size-300: 2rem;
`), out);
  assert.ok(!out.includes('--size-100'));
});

test('a token with no group yet goes after the last declaration', () => {
  const out = writeTokens(CSS, { 'heading-text-transform': 'uppercase' });

  assert.ok(out.includes('    --button-radius: var(--radius-sm);\n    --heading-text-transform: uppercase;\n}'));
});

test('var() is followed through the other tokens', () => {
  const tokens = readTokens(CSS);

  assert.equal(resolveToken('var(--leading-normal)', tokens), '1.5');
  assert.equal(resolveToken('var(--line-height)', tokens), '1.5');
  assert.equal(resolveToken('var(--radius-sm)', tokens), 'var(--radius-sm)');
});

test('the fluid size formula writes exactly what the fluid-size addon wrote', () => {
  for (const [min, max, value] of FLUID_SIZE) {
    assert.equal(sizeValue(min, max, 1280), value, `${min} → ${max}`);
    assert.deepEqual(parseSize(value), { min, max });
  }
});

test('a size that is the same everywhere is one length; fixed lengths read as min = max', () => {
  assert.equal(sizeValue(15, 15, 1280), '0.9375rem');
  assert.deepEqual(parseSize('.9375rem'), { min: 15, max: 15 });
  assert.equal(parseSize('var(--x)'), null);
});

test('the container width is worked back from the scale', () => {
  assert.equal(inferViewport(FLUID_SIZE.map(([, , v]) => v)), 1280);
  assert.equal(inferViewport(['.9375rem']), null);
});

test('a new size is named after the largest number', () => {
  assert.equal(nextSizeName(['size-sm', 'size-100', 'size-1200']), 'size-1300');
  assert.equal(nextSizeName(['size-sm']), 'size-100');
});

test('a new size’s Tailwind lines land after their neighbours, in number order', () => {
  const css = `@theme {
    --text-900: var(--size-900);
    --spacing-1200: var(--size-1200);
    --spacing-container: var(--container-padding);
    --size-1200: 9rem;
}`;
  const out = writeTokens(css, { 'size-1300': '10rem', 'spacing-1300': 'var(--size-1300)', 'text-1300': 'var(--size-1300)' });

  assert.equal(out, `@theme {
    --text-900: var(--size-900);
    --text-1300: var(--size-1300);
    --spacing-1200: var(--size-1200);
    --spacing-1300: var(--size-1300);
    --spacing-container: var(--container-padding);
    --size-1200: 9rem;
    --size-1300: 10rem;
}`);
});

test('body color, background and gutter reach the page on every render', () => {
  for (const name of ['body-color', 'body-bg']) {
    assert.ok(TYPE_TOKENS.includes(name), name);
    assert.ok(isManaged(name), name);
  }

  assert.ok(isManaged('gutter'));
});

test('headings have no color token: they inherit from the body and the section', () => {
  assert.ok(!TYPE_TOKENS.includes('heading-color'));
  assert.ok(!isManaged('heading-color'));
});

test('a highlight is a color token pointing at a palette color', () => {
  const tokens = readTokens(`@theme {
    --color-primary: #112233;
    --color-primary-500: #223344;
    --color-highlight-1: var(--color-primary-500);
    --color-brand: var( --color-primary );
    --color-gray: var(--color-primary);
    --size-700: 1rem;
    --gutter: var(--size-700);
}`);

  assert.deepEqual(readHighlights(tokens), [
    { name: 'highlight-1', value: 'var(--color-primary-500)' },
    { name: 'brand', value: 'var( --color-primary )' },
    { name: 'gray', value: 'var(--color-primary)' },
  ]);
  assert.ok(isHighlightValue('var(--color-primary)'));
  assert.ok(!isHighlightValue('#112233'));
  assert.ok(!isHighlightValue('var(--size-700)'));
  assert.ok(!isHighlightValue('var(--highlight-1)'));
});

test('a highlight name is free, lowercase and not a palette color', () => {
  const families = [{ name: 'primary', steps: [{ name: 500 }] }];

  assert.equal(highlightNameProblem('highlight-1', [], families), null);
  assert.equal(highlightNameProblem('accent-2', ['highlight-1'], families), null);
  assert.equal(highlightNameProblem('', [], families), 'empty');
  assert.equal(highlightNameProblem('Accent', [], families), 'format');
  assert.equal(highlightNameProblem('highlight-1', ['highlight-1'], families), 'taken');
  assert.equal(highlightNameProblem('primary', [], families), 'taken');
  assert.equal(highlightNameProblem('primary-500', [], families), 'taken');
  assert.equal(highlightNameProblem('white', [], families), 'taken');
});

test('a new highlight counts on from the highest default name', () => {
  assert.equal(nextHighlightName([]), 'highlight-1');
  assert.equal(nextHighlightName(['highlight-1', 'highlight-2']), 'highlight-3');
  assert.equal(nextHighlightName(['brand', 'highlight-4', 'highlight-2']), 'highlight-5');
});

test('writeTokens adds a highlight to the theme and removes a gone one', () => {
  const css = `@theme {
    --color-primary: #112233;
    --color-highlight-1: var(--color-primary);
    --size-700: 1rem;
}`;

  assert.equal(writeTokens(css, { 'color-highlight-2': 'var(--color-primary)', 'color-highlight-1': null }), `@theme {
    --color-primary: #112233;
    --size-700: 1rem;
    --color-highlight-2: var(--color-primary);
}`);
});

test('the Title tokens are typography the page gets on every render', () => {
  for (const name of TITLE_TOKENS) {
    assert.ok(TYPE_TOKENS.includes(name), name);
    assert.ok(isManaged(name), name);
  }

  assert.ok(!isManaged('title-color'));
});

test('the Title letter spacings run narrowest first, with normal in the middle', () => {
  assert.deepEqual(TRACKINGS.map(([, value]) => value), ['-0.05em', '-0.025em', 'normal', '0.05em', '0.1em']);
});

const FORMS_CSS = `@theme {
    --color-white: #FFFFFF;
    --button-radius: 0;
    --btn-radius: var(--button-radius);

    --input-bg: var(--color-white);
    --input-bg-opacity: 100%;
    --input-radius: 0.375rem;
    --input-check-size: 1.1em;
}
`;

test('a changed input token is rewritten in place, and reads back the same', () => {
  const out = writeTokens(FORMS_CSS, { 'input-radius': '0.5rem' });

  assert.equal(out, FORMS_CSS.replace('--input-radius: 0.375rem;', '--input-radius: 0.5rem;'));
  assert.equal(readTokens(out).get('input-radius'), '0.5rem');
  assert.equal(writeTokens(out, Object.fromEntries(readTokens(out))), out);
});

test('a new input token joins the other input tokens', () => {
  const out = writeTokens(FORMS_CSS, { 'input-focus': 'var(--color-primary)' });

  assert.ok(out.includes('    --input-radius: 0.375rem;\n    --input-focus: var(--color-primary);\n'), out);
});

test('every Forms token is one the page gets on every render, so the panel paints it at once', () => {
  assert.equal(INPUT_TOKENS.length, 10);

  for (const name of INPUT_TOKENS) {
    assert.ok(isManaged(name), name);
  }

  assert.ok(isManaged('input-bg-opacity'));
  assert.ok(!isManaged('inputs'));
});

test('the Forms choices are written in rem/em and %, px only for border widths', () => {
  assert.deepEqual(OPACITIES, ['100%', '90%', '75%', '50%', '25%', '0%']);
  assert.deepEqual(BORDERS.map(([, v]) => v), ['0', '1px', '2px']);
  assert.ok(CHECK_SIZES.every(([, v]) => /^[\d.]+em$/.test(v)));
});

test('a value the list does not have is offered first; a listed one is not repeated', () => {
  assert.deepEqual(withCurrent(BORDERS, '3px')[0], ['', '3px']);
  assert.equal(withCurrent(BORDERS, '1px'), BORDERS);
  assert.equal(withCurrent(BORDERS, ''), BORDERS);
});

const FAMILIES = [
  { name: 'white', value: '#FFFFFF', steps: [] },
  { name: 'gray', value: null, steps: [{ name: '300', value: '#d4d4d4' }, { name: '800', value: '#262626' }] },
  { name: 'primary', value: '#bc6f35', steps: [{ name: '500', value: '#9e571e' }] },
];

test('a color token resolves through the theme for the sample', () => {
  assert.equal(sampleColor('var(--color-white)', FAMILIES), '#fff');
  assert.equal(sampleColor('var(--color-black)', FAMILIES), '#000');
  assert.equal(sampleColor('var(--color-primary)', FAMILIES), '#bc6f35');
  assert.equal(sampleColor('var(--color-primary-500)', FAMILIES), '#9e571e');
  assert.equal(sampleColor('var(--gray-800)', FAMILIES), '#262626');
  assert.equal(sampleColor('transparent', FAMILIES), 'transparent');
  assert.equal(sampleColor('var(--color-nope)', FAMILIES), null);
});

test('the sample field reads the tokens the way the site\'s input rule does', () => {
  const ui = {
    families: FAMILIES,
    sizes: [{ name: 'size-sm', min: 15, max: 15 }],
    input: {
      'input-bg': 'var(--color-primary)', 'input-bg-opacity': '50%', 'input-color': 'var(--color-gray-800)',
      'input-size': 'var(--size-sm)', 'input-radius': 'var(--radius-lg)', 'input-border-width': '1px',
      'input-border-color': 'var(--color-gray-300)', 'input-accent': 'var(--color-primary-500)', 'input-check-size': '1.4em',
    },
  };
  const field = fieldSample(ui);

  assert.equal(field.backgroundColor, 'color-mix(in srgb, #bc6f35 50%, transparent)');
  assert.equal(field.color, '#262626');
  assert.equal(field.fontSize, '0.9375rem');
  assert.equal(field.borderRadius, '0.5rem');
  assert.equal(field.border, '1px solid #d4d4d4');
  assert.deepEqual([checkSample(ui).accentColor, checkSample(ui).width], ['#9e571e', '1.4em']);
});
