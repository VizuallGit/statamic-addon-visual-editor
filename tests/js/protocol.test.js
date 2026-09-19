import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { CHANNEL, EVENT, MSG, SOURCE } from '../../resources/js/lib/protocol.js';

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

test('the DOM event the strip sends the paint script is spelt the same on both sides', () => {
  assert.deepEqual(EVENT, { TW_PREVIEW: 'sve:tw-preview' });
  const script = readFileSync(new URL('../../resources/js/dock-instant-preview.js', import.meta.url), 'utf8');
  assert.ok(script.includes(`'${EVENT.TW_PREVIEW}'`), 'dock-instant-preview.js listens for the event by its literal');
});
