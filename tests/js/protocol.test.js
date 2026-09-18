import test from 'node:test';
import assert from 'node:assert/strict';
import { CHANNEL, MSG, SOURCE } from '../../resources/js/lib/protocol.js';

test('the source mark is the string the bridge has always used', () => {
  assert.equal(SOURCE, 'statamic-visual-editor');
});

test('every message name is unique and stays a kebab-case wire string', () => {
  const values = Object.values(MSG);
  assert.equal(new Set(values).size, values.length);
  for (const [key, value] of Object.entries(MSG)) {
    assert.match(value, /^[a-z][a-z0-9-]*$/, `${key} → ${value}`);
    assert.equal(key, value.toUpperCase().replace(/[^A-Z0-9]+/g, '_'), `${key} is named after its string`);
  }
});

test('the channels the CP posts publish values on are the ones the preview accepts', () => {
  assert.deepEqual(CHANNEL, { GLOBALS: 'sve.globals', SECTIONS: 'sve.sections' });
});
