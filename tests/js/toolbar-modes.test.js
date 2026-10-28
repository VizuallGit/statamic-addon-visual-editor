import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { MODES, cleanModes, modeAllows } from '../../resources/js/lib/toolbar-modes.js';

test('the lists are made safe: known icons once each; no lists is null', () => {
  assert.deepEqual(cleanModes({ content: ['pages', 'pages', 'bogus', 3, 'ai'], build: ['code'] }), { content: ['pages', 'ai'], build: ['code'] });
  assert.deepEqual(cleanModes({ content: 'pages' }), { content: [], build: [] });
  assert.equal(cleanModes(null), null);
  assert.equal(cleanModes([]), null);
  assert.equal(cleanModes('x'), null);
});

test('a mode has what its list has, and nothing it leaves out', () => {
  const modes = { content: ['pages', 'ai'], build: ['pages', 'code', 'theme'] };

  assert.equal(modeAllows(modes, 'content', 'pages'), true);
  assert.equal(modeAllows(modes, 'content', 'code'), false, 'the dock is never Content’s');
  assert.equal(modeAllows(modes, 'content', 'theme'), false);
  assert.equal(modeAllows(modes, 'build', 'code'), true);
  assert.equal(modeAllows(modes, 'build', 'ai'), false);
  assert.equal(modeAllows(modes, 'anything else', 'ai'), true, 'an unknown mode is Content');
});

test('only the top bar’s tools are the lists’ to hold back', () => {
  assert.equal(modeAllows({ content: [], build: [] }, 'content', 'settings'), true);
  assert.equal(modeAllows({ content: [], build: [] }, 'content', 'rightdock'), true);
});

test('without lists nothing is held back', () => {
  assert.equal(modeAllows(null, 'content', 'code'), true);
});

test('the modes are the two the switch has', () => {
  assert.deepEqual(MODES, ['content', 'build']);
});

test('the dock is on Build’s list and off Content’s, in PHP', () => {
  const php = readFileSync(new URL('../../src/ToolbarModes.php', import.meta.url), 'utf8');

  assert.match(php, /public const DOCK = 'code';/);
  assert.match(php, /\$mode === 'build' \? static::tools\(\[\.\.\.\$tools, static::DOCK\]\) : \$tools/);
});
