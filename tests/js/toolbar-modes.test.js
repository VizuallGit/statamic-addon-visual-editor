import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { DOCK_TAB, MODES, cleanModes, modeAllows } from '../../resources/js/lib/toolbar-modes.js';

test('the lists are made safe: known icons once each; no lists is null', () => {
  assert.deepEqual(cleanModes({ content: ['pages', 'pages', 'bogus', 3, 'ai'], build: ['theme'], html: ['pages', 'theme'] }), {
    content: ['pages', 'ai'],
    build: ['theme'],
    html: ['pages', 'theme'],
  });
  assert.deepEqual(cleanModes({ content: 'pages' }), { content: [], build: [], html: [] });
  assert.equal(cleanModes(null), null);
  assert.equal(cleanModes([]), null);
  assert.equal(cleanModes('x'), null);
});

test('a mode has what its list has, and nothing it leaves out', () => {
  const modes = { content: ['pages', 'ai'], build: ['pages', 'theme'], html: ['pages', 'theme', 'ai'] };

  assert.equal(modeAllows(modes, 'content', 'pages'), true);
  assert.equal(modeAllows(modes, 'content', 'theme'), false);
  assert.equal(modeAllows(modes, 'build', 'theme'), true);
  assert.equal(modeAllows(modes, 'build', 'ai'), false);
  assert.equal(modeAllows(modes, 'html', 'ai'), true);
  assert.equal(modeAllows(modes, 'anything else', 'ai'), true, 'an unknown mode is Content');
  assert.equal(modeAllows(modes, 'html', DOCK_TAB), false, 'the dock is on no list');
});

test('only the top bar’s tools are the lists’ to hold back', () => {
  assert.equal(modeAllows({ content: [], build: [], html: [] }, 'content', 'settings'), true);
  assert.equal(modeAllows({ content: [], build: [], html: [] }, 'content', 'rightdock'), true);
});

test('without lists nothing is held back', () => {
  assert.equal(modeAllows(null, 'content', 'theme'), true);
});

test('the modes are the three the switch has, under the names their lists are stored by', () => {
  assert.deepEqual(MODES, ['content', 'build', 'html']);
  assert.equal(DOCK_TAB, 'code');
});

test('PHP puts the dock on no list, and gives HTML Build every icon but the dock', () => {
  const php = readFileSync(new URL('../../src/ToolbarModes.php', import.meta.url), 'utf8');

  assert.match(php, /public const DOCK = 'code';/);
  assert.match(php, /\$out\[\$mode\] = array_values\(array_diff\(.*\[static::DOCK\]\)\);/);
  assert.match(php, /\$out\['html'\] = array_values\(array_diff\(static::TOOLS, \[static::DOCK\]\)\);/);
});
