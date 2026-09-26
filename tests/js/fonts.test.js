import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fontKind, nearestWeight, sfntInfo, toSfnt, toWoff2 } from '../../resources/js/cp/theme-panel/font-files.js';
import { familyShape, formatBytes, hasVariant, slug, variantLabel } from '../../resources/js/cp/theme-panel/font-helpers.js';

// Two letters ("Ab") of Inter (variable, OFL) and Barlow Condensed Bold (OFL), from the site's fonts.
const fixture = (name) => new Uint8Array(readFileSync(new URL(`./fixtures/${name}`, import.meta.url)));
const inter = fixture('inter-ab.ttf');
const barlowWoff = fixture('barlow-bold-ab.woff');
const barlowWoff2 = fixture('barlow-bold-ab.woff2');

test('a font is known by its first bytes, whatever its name', () => {
  assert.equal(fontKind(inter), 'ttf');
  assert.equal(fontKind(barlowWoff), 'woff');
  assert.equal(fontKind(barlowWoff2), 'woff2');
  assert.equal(fontKind(new TextEncoder().encode('OTTO....')), 'otf');
  assert.equal(fontKind(new TextEncoder().encode('<svg>')), null);
});

test('a variable font gives its family and weight range', () => {
  assert.deepEqual(sfntInfo(inter), { family: 'Inter', weight: 400, italic: false, axis: [100, 900] });
});

test('WOFF and WOFF2 are read through to their tables', async () => {
  for (const [bytes, kind] of [[barlowWoff, 'woff'], [barlowWoff2, 'woff2']]) {
    const info = sfntInfo(await toSfnt(bytes, kind));

    assert.deepEqual(info, { family: 'Barlow Condensed', weight: 700, italic: false, axis: null }, kind);
  }
});

test('a TTF and a WOFF become WOFF2 that reads back the same', async () => {
  for (const [bytes, kind] of [[inter, 'ttf'], [barlowWoff, 'woff']]) {
    const woff2 = await toWoff2(bytes, kind);

    assert.equal(fontKind(woff2), 'woff2', kind);
    assert.deepEqual(sfntInfo(await toSfnt(woff2, 'woff2')), sfntInfo(await toSfnt(bytes, kind)), kind);
  }

  assert.equal(await toWoff2(barlowWoff2, 'woff2'), barlowWoff2);
});

test('an odd weight goes to the nearest CSS weight', () => {
  assert.equal(nearestWeight(340), 300);
  assert.equal(nearestWeight(350), 400);
  assert.equal(nearestWeight(950), 900);
});

test('an installed family says what it holds', () => {
  const variable = { faces: [{ weight: '300 900', style: 'normal' }, { weight: '300 900', style: 'italic' }] };
  const statics = { faces: [{ weight: '400', style: 'normal' }, { weight: '700', style: 'normal' }, { weight: '500', style: 'normal' }] };

  assert.deepEqual(familyShape(variable), { weights: '300–900', variable: true, count: 0, italic: true });
  assert.deepEqual(familyShape(statics), { weights: '400–700', variable: false, count: 3, italic: false });
  assert.ok(hasVariant(variable, 800, true));
  assert.ok(!hasVariant(variable, 200, false));
  assert.ok(hasVariant(statics, 500, false));
  assert.ok(!hasVariant(statics, 600, false));
  assert.ok(!hasVariant(null, 400, false));
});

test('names, sizes and variant labels', () => {
  assert.equal(slug('Barlow Condensed'), 'barlow-condensed');
  assert.equal(formatBytes(18 * 1024), '18 KB');
  assert.equal(formatBytes(1.5 * 1024 * 1024), '1.5 MB');
  assert.equal(variantLabel('400'), 'Regular');
  assert.equal(variantLabel('400i'), 'Italic');
  assert.equal(variantLabel('700i'), 'Bold Italic');
});
