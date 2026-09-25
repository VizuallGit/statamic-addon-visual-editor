import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readTokens, resolveToken, writeTokens } from '../../resources/js/cp/theme-panel/tokens.js';
import { inferViewport, nextSizeName, parseSize, sizeValue } from '../../resources/js/cp/theme-panel/sizes.js';

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
