import { test } from 'node:test';
import assert from 'node:assert/strict';
import { FAMILY_COLORS, familyColorStyle, parseFamilyOverrides, withFamilyColor } from '../../resources/js/lib/tag-families.js';

test('stored colours are read back, and only real ones', () => {
  const raw = JSON.stringify({ layout: '#FF0000', text: 'red', media: FAMILY_COLORS.dark.media, bogus: '#00ff00' });

  assert.deepEqual(parseFamilyOverrides(raw), { layout: '#ff0000' });
  assert.deepEqual(parseFamilyOverrides('not json'), {});
  assert.deepEqual(parseFamilyOverrides(null), {});
});

test('setting a colour adds it; the default, an empty or a bad value clears it', () => {
  let over = withFamilyColor({}, 'loop', '#123456');

  assert.deepEqual(over, { loop: '#123456' });
  over = withFamilyColor(over, 'loop', FAMILY_COLORS.dark.loop);
  assert.deepEqual(over, {});
  over = withFamilyColor({ if: '#abcdef' }, 'if', '');
  assert.deepEqual(over, {});
  over = withFamilyColor({}, 'nope', '#abcdef');
  assert.deepEqual(over, {});
});

test('the inline style names only what was chosen', () => {
  assert.deepEqual(familyColorStyle({ component: '#112233' }), { '--sve-fam-component': '#112233' });
  assert.deepEqual(familyColorStyle({}), {});
});
