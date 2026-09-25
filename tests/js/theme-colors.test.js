import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  STEPS,
  familyMode,
  generateSteps,
  hexToOklch,
  lightnessNumber,
  nameProblem,
  nameSteps,
  oklchToHex,
  readColors,
  takenNames,
  writeColors,
} from '../../resources/js/cp/theme-colors/palette.js';

const SITE_CSS = `@import "tailwindcss";

@theme {
    --color-*: initial;
    --color-transparent: transparent;
    --color-white: #FFFFFF;
    --color-black: #000000;
    --color-contrast-light: var(--contrast-light);

    --color-primary: #11122C;
    --color-primary-50: #f4f5f7;
    --color-primary-500: #727692;
    --color-primary-950: #05060a;

    --color-secondary: #254446;
    --color-secondary-500: #627e7f;


    --color-gray-50: var(--gray-50);

    --text-base: 1rem;
}

.btn { color: var(--color-primary); }
`;

const NEUTRAL = ['#fafafa', '#f5f5f5', '#e5e5e5', '#d4d4d4', '#a3a3a3', '#737373', '#525252', '#404040', '#262626', '#171717', '#0a0a0a'];

test('the families are read in file order; tokens that point at a variable are not colors to edit', () => {
  const families = readColors(SITE_CSS);

  assert.deepEqual(families.map((f) => f.name), ['white', 'black', 'primary', 'secondary']);
  assert.equal(families[2].value, '#11122C');
  assert.deepEqual(families[2].steps, [
    { name: '50', value: '#f4f5f7' },
    { name: '500', value: '#727692' },
    { name: '950', value: '#05060a' },
  ]);
});

test('writing back what was read changes nothing, byte for byte', () => {
  assert.equal(writeColors(SITE_CSS, readColors(SITE_CSS)), SITE_CSS);
});

test('a changed value rewrites that one line and nothing else', () => {
  const families = readColors(SITE_CSS);

  families[2].steps[1].value = '#808080';

  const out = writeColors(SITE_CSS, families);

  assert.equal(out, SITE_CSS.replace('--color-primary-500: #727692;', '--color-primary-500: #808080;'));
});

test('a new family goes after the last literal color, before the variable tokens', () => {
  const families = readColors(SITE_CSS);

  families.push({ name: 'moss', value: '#55613f', steps: [{ name: '800', value: '#2a3020' }, { name: '300', value: '#aab39a' }] });

  const out = writeColors(SITE_CSS, families);

  assert.ok(out.includes(`    --color-secondary-500: #627e7f;

    --color-moss: #55613f;
    --color-moss-300: #aab39a;
    --color-moss-800: #2a3020;
`));
  assert.equal(out.replace(/\n    --color-moss[^\n]*/g, '').replace('#627e7f;\n\n', '#627e7f;\n'), SITE_CSS);
  assert.deepEqual(readColors(out).map((f) => f.name), ['white', 'black', 'primary', 'secondary', 'moss']);
});

test('new steps land in number order inside their family; removed ones disappear', () => {
  const families = readColors(SITE_CSS);

  families[2].steps = [
    { name: '50', value: '#f4f5f7' },
    { name: '300', value: '#b5b8c7' },
    { name: '950', value: '#05060a' },
    { name: '975', value: '#020205' },
  ];

  const out = writeColors(SITE_CSS, families);

  assert.ok(out.includes(`    --color-primary: #11122C;
    --color-primary-50: #f4f5f7;
    --color-primary-300: #b5b8c7;
    --color-primary-950: #05060a;
    --color-primary-975: #020205;
`));
  assert.ok(!out.includes('--color-primary-500'));
});

test('a removed family leaves the file; the other tokens stay', () => {
  const out = writeColors(SITE_CSS, readColors(SITE_CSS).filter((f) => f.name !== 'secondary'));

  assert.ok(!out.includes('--color-secondary'));
  assert.ok(out.includes('--color-contrast-light: var(--contrast-light);'));
  assert.ok(out.includes('--color-gray-50: var(--gray-50);'));
  assert.ok(out.includes('.btn { color: var(--color-primary); }'));
});

test('hex and OKLCH convert both ways', () => {
  for (const hex of ['#11122c', '#55613f', '#de4f3f', '#ffffff', '#000000']) {
    assert.equal(oklchToHex(hexToOklch(hex)), hex);
  }

  assert.equal(hexToOklch('not a color'), null);
});

test('the site’s own gray scale is named exactly as it is, from lightness alone', () => {
  assert.deepEqual(nameSteps(NEUTRAL), STEPS);
});

test('a dark color gets a dark number and a light one a light number, whatever order they come in', () => {
  assert.ok(lightnessNumber('#11122C') >= 850, 'primary is near black');
  assert.deepEqual(nameSteps(['#1a1a1a', '#f5f5f5']), [900, 100]);
});

test('names stay unique and in lightness order when two colors are about as light', () => {
  const names = nameSteps(['#737373', '#757575', '#777777']);

  assert.equal(new Set(names).size, 3);
  assert.ok(names[2] < names[1] && names[1] < names[0], names.join(','));
});

test('tints are lighter than the base and shades darker, and every name tells how light it is', () => {
  for (const base of ['#55613f', '#11122C', '#DE4F3F', '#f4f5f7']) {
    const steps = generateSteps(base, { tints: 5, shades: 5 });
    const l = hexToOklch(base).l;

    assert.equal(steps.length, 10);
    assert.equal(new Set(steps.map((s) => s.name)).size, 10);

    for (const s of steps) {
      const sl = hexToOklch(s.value).l;

      assert.ok(s.kind === 'tint' ? sl > l : sl < l, `${base} ${s.kind} ${s.value}`);
    }

    // Lighter first: numbers rise as the color gets darker.
    for (let i = 1; i < steps.length; i++) {
      assert.ok(Number(steps[i].name) > Number(steps[i - 1].name));
      assert.ok(hexToOklch(steps[i].value).l < hexToOklch(steps[i - 1].value).l);
    }
  }
});

test('a dark base never has a step called 100 unless it is really that light', () => {
  const steps = generateSteps('#11122C', { tints: 3, shades: 2 });

  for (const s of steps) {
    assert.ok(Math.abs(Number(s.name) - lightnessNumber(s.value)) <= 60, `${s.name} for ${s.value}`);
  }
});

test('counts are clamped to 0–5', () => {
  assert.equal(generateSteps('#55613f', { tints: 9, shades: -2 }).length, 5);
  assert.deepEqual(generateSteps('nope', { tints: 3 }), []);
});

test('a new color name must be a plain, free CSS name', () => {
  const taken = takenNames(readColors(SITE_CSS));

  assert.equal(nameProblem('moss', taken), null);
  assert.equal(nameProblem('dark-moss', taken), null);
  assert.equal(nameProblem('', taken), 'empty');
  assert.equal(nameProblem('Moss', taken), 'format');
  assert.equal(nameProblem('moss green', taken), 'format');
  assert.equal(nameProblem('moss-2', taken), 'number');
  assert.equal(nameProblem('current', taken), 'reserved');
  assert.equal(nameProblem('primary', taken), 'taken');
});

test('generated steps are recognised with their counts; the theme’s own steps are not', () => {
  const steps = generateSteps('#55613f', { tints: 2, shades: 3 }).map(({ name, value }) => ({ name, value }));

  assert.deepEqual(familyMode({ value: '#55613f', steps }), { tints: 2, shades: 3, generated: true });
  assert.deepEqual(familyMode({ value: '#55613F', steps }), { tints: 2, shades: 3, generated: true });
  assert.deepEqual(familyMode({ value: '#55613f', steps: [] }), { tints: 0, shades: 0, generated: true });

  const primary = readColors(SITE_CSS)[2];

  assert.equal(familyMode(primary).generated, false);

  // One hand-edited step makes the family its own again.
  steps[0] = { ...steps[0], value: '#ff0000' };
  assert.equal(familyMode({ value: '#55613f', steps }).generated, false);
});
