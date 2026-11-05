/**
 * A write from Build keeps its pick without moving the dock's cursor: one
 * flag from boot.js write() through the host to the tree's row select.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const JS = join(dirname(fileURLToPath(import.meta.url)), '../../../resources/js');
const read = (name) => readFileSync(join(JS, name), 'utf8');

test('write() keeps the pick with reveal: false; a click (select, setPlus) reveals as before', () => {
  const boot = read('build-mode/boot.js');

  assert.match(boot, /wrote = select;[\s\S]{0,400}hooks\.select\?\.\(select, \{ reveal: false \}\);/);
  assert.ok(boot.includes("hooks.select?.(wholeOwner(html(), path) || path || '');"), 'a click on the canvas reveals');
  assert.ok(boot.includes('hooks.select?.(path);'), 'a + target reveals');
});

test('the host passes the flag through html-tree:from-preview, true by default', () => {
  const host = read('build-mode-host.js');

  assert.ok(host.includes('select(path, { reveal = true } = {}) {'));
  assert.ok(host.includes("ask('html-tree:from-preview', { path, reveal });"));
});

test('the tree marks the row and outlines it in the preview either way; only a reveal touches the dock', () => {
  const tree = read('html-tree.js');

  assert.ok(tree.includes("register('html-tree:from-preview', ({ path, src, uid, reveal = true } = {}) => {"));
  assert.ok(tree.includes('selectHtmlTreeByPath(window, componentPathFor(path, src) || path, { reveal });'));
  assert.ok(tree.includes('function selectHtmlTreeByPath(win, path, { reveal = true } = {}) {'));
  assert.ok(tree.includes('selectHtmlTreeRow(win, row.id, htmlTreeUi.rows, { reveal });'));
  assert.ok(tree.includes('function selectHtmlTreeRow(win, id, rows, { reveal = true, scroll = false } = {}) {'));
  assert.match(tree, /if \(reveal\) \{\n\s+ask\('dock:reveal-html', \{[\s\S]{0,600}ask\('dock:tw-follow'\);\n\s+\}/);
  // The preview's outline is not behind the flag.
  const fn = tree.slice(tree.indexOf('function selectHtmlTreeRow('), tree.indexOf('function componentPathFor('));
  const outline = fn.indexOf('MSG.SVE_HTML_PICK_FOCUS');
  const gate = fn.indexOf('if (reveal) {');
  const gateEnd = fn.indexOf("ask('dock:tw-follow');");

  assert.ok(gate > -1 && gateEnd > gate && outline > gateEnd, 'the outline follows after the reveal block, outside it');
});

test('only a click on the row itself scrolls the preview to the element; a pick from the preview or a write does not', () => {
  const tree = read('html-tree.js');
  const fn = tree.slice(tree.indexOf('function selectHtmlTreeRow('), tree.indexOf('function componentPathFor('));

  // The flag rides on the outline message, and nothing in the tree sets it but the row's own click.
  assert.match(fn, /type: MSG\.SVE_HTML_PICK_FOCUS,[\s\S]{0,200}scroll,\n/);
  assert.ok(tree.includes('selectHtmlTreeRow(win, id, rows, { scroll: !!at });'));
  assert.equal((tree.match(/\{ scroll: /g) || []).length, 1, 'one caller passes scroll');

  // The preview only moves when told to, and then to the first marked element.
  const nav = read('bridge/outline-nav.js');
  const handler = nav.slice(nav.indexOf('MSG.SVE_HTML_PICK_FOCUS) {'), nav.indexOf('MSG.SVE_VIDEO_HOLD) {'));

  assert.ok(handler.includes('if (data.scroll && marked[0]) {'));
  assert.ok(handler.includes('revealElement(win, marked[0]);'));
});

test('the row already picked, picked again, is not a redraw: the rows come from the dock change (watchHtmlTreeDock)', () => {
  const tree = read('html-tree.js');
  const fn = tree.slice(tree.indexOf('function selectHtmlTreeByPath('), tree.indexOf('export function watchHtmlTreeDock('));
  const short = fn.indexOf('if (picked && picked.path === path) {');
  const render = fn.indexOf('renderHtmlTree(win);');

  assert.ok(short > -1 && render > short, 'the same-path return comes before the first renderHtmlTree');
  assert.ok(fn.includes("const picked = htmlTreeUi.rows.find((item) => item.current);"));
  assert.match(fn, /if \(picked && picked\.path === path\) \{\n\s+selectHtmlTreeRow\(win, picked\.id, htmlTreeUi\.rows, \{ reveal \}\);\n\n\s+return;\n\s+\}/);
});
