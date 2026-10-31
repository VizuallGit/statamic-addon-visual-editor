/**
 * lib/browse-button.js — the asset field's own Browse button: the visible one
 * of the two Statamic draws, by its translated words; null when it is not there.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { browseButton } from '../../resources/js/lib/browse-button.js';

const button = (text, shown = true) => ({ textContent: ` ${text} `, offsetParent: shown ? {} : null });
const field = (...buttons) => ({ querySelectorAll: () => buttons });

// The Control Panel's window; Statamic's translator (`__`) is set per test.
globalThis.window = {};

test('the shown Browse button, by either of its words', () => {
  const wide = button('Browse Assets');
  const narrow = button('Browse', false);

  assert.equal(browseButton(field(button('Upload'), narrow, wide)), wide);
  assert.equal(browseButton(field(button('Browse Assets', false), button('Browse'))).textContent.trim(), 'Browse');
});

test('Statamic\'s translation is asked, so a Danish Control Panel finds it too', () => {
  globalThis.window.__ = (key) => ({ 'Browse Assets': 'Gennemse filer', Browse: 'Gennemse' })[key] || key;

  try {
    assert.equal(browseButton(field(button('Browse Assets'), button('Gennemse filer'))).textContent.trim(), 'Gennemse filer');
  } finally {
    delete globalThis.window.__;
  }
});

test('nothing drawn, nothing found', () => {
  assert.equal(browseButton(field(button('Upload'))), null);
  assert.equal(browseButton(field()), null);
  assert.equal(browseButton(null), null);
});
