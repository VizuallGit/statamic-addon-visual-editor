/**
 * The HTML tree's padlock: `{{# sve-lock #}}` in front of an element locks it
 * and everything inside it — in the tree (html-tree-parse.js), in the tree's
 * edits (html-tree-edit.js) and in the dock (lib/locked-tags.js, and the
 * `locksKept` check dock:set-html makes).
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { EditorState } from '@codemirror/state';
import { flattenHtmlTree, lockedElementRanges, locksKept, parseTemplateTree } from '../../resources/js/html-tree-parse.js';
import { deleteHtml, lockHtml, moveHtml, unlockHtml } from '../../resources/js/html-tree-edit.js';
import { editedByHand, lockedRanges } from '../../resources/js/lib/locked-tags.js';
import { withTemplateElement } from '../../resources/js/template-elements.js';

const PAGE = [
  '<main class="page">',
  '    <nav class="crumbs"></nav>',
  '    <div class="hard">',
  '        <p class="tricky">x</p>',
  '    </div>',
  '    <footer class="foot"></footer>',
  '</main>',
  '',
].join('\n');

const rowsOf = (html) => flattenHtmlTree(parseTemplateTree(html), new Set());
const row = (html, tag) => rowsOf(html).find((item) => item.tag === tag);

test('locking writes the marker on its own line, indented like the element', () => {
  const locked = lockHtml(PAGE, row(PAGE, 'div'));

  assert.ok(locked.includes('<nav class="crumbs"></nav>\n    {{# sve-lock #}}\n    <div class="hard">'));
});

test('the locked element and everything inside it are held; its neighbours are not', () => {
  const locked = lockHtml(PAGE, row(PAGE, 'div'));
  const rows = rowsOf(locked);

  assert.equal(rows.find((item) => item.tag === 'div').locked, true);
  assert.equal(rows.find((item) => item.tag === 'p').lockedIn, true);
  assert.equal(rows.find((item) => item.tag === 'nav').locked, false);
  assert.equal(rows.find((item) => item.tag === 'footer').lockedIn, false);
});

test('unlocking takes the marker and its line away and nothing else', () => {
  const locked = lockHtml(PAGE, row(PAGE, 'div'));

  assert.equal(unlockHtml(locked, row(locked, 'div')), PAGE);
  // Already unlocked, already locked: left as they are.
  assert.equal(unlockHtml(PAGE, row(PAGE, 'div')), PAGE);
  assert.equal(lockHtml(locked, row(locked, 'div')), locked);
});

test('a lock on an element that shares its line stays on that line', () => {
  const inline = '<p><span class="a">x</span></p>';
  const locked = lockHtml(inline, row(inline, 'span'));

  assert.equal(locked, '<p>{{# sve-lock #}} <span class="a">x</span></p>');
  assert.equal(row(locked, 'span').locked, true);
  assert.equal(unlockHtml(locked, row(locked, 'span')), inline);
});

test('the locked range runs from the marker to the end of the element', () => {
  const locked = lockHtml(PAGE, row(PAGE, 'div'));
  const r = lockedElementRanges(locked);

  assert.equal(r.length, 2);
  assert.ok(locked.slice(r[0], r[1]).startsWith('{{# sve-lock #}}'));
  assert.ok(locked.slice(r[0], r[1]).endsWith('</div>'));
});

test('a loop, a component call and the sections loop can be locked too', () => {
  const html = '{{# sve-lock #}}\n{{ page_sections }}\n    {{ partial src="partials/page_sections/{ type }" }}\n{{ /page_sections }}\n';
  const rows = flattenHtmlTree(parseTemplateTree(html, { sectionLoops: ['page_sections'], sectionsLabel: 'S' }), new Set());

  assert.equal(rows.find((item) => item.kind === 'sections').locked, true);
  assert.ok(html.slice(...lockedElementRanges(html)).endsWith('{{ /page_sections }}'));
});

test('an edit that changes a locked element is not kept; one that moves it whole is', () => {
  const locked = lockHtml(PAGE, row(PAGE, 'div'));

  // A class typed into the locked <p>.
  assert.equal(locksKept(locked, locked.replace('class="tricky"', 'class="tricky red"')), false);
  // The element deleted, or unlocked.
  assert.equal(locksKept(locked, deleteHtml(locked, row(locked, 'div'))), false);
  assert.equal(locksKept(locked, unlockHtml(locked, row(locked, 'div'))), false);
  // Something added beside it.
  assert.equal(locksKept(locked, withTemplateElement(locked, 'section', row(locked, 'nav')).html), true);
  // No lock at all: anything goes.
  assert.equal(locksKept(PAGE, ''), true);
});

test('dropped "before" a locked element lands in front of its lock, not between', () => {
  const locked = lockHtml(PAGE, row(PAGE, 'div'));
  const roots = parseTemplateTree(locked);
  const find = (nodes, tag) => nodes.flatMap((node) => [node, ...(function all(n) { return n.children.flatMap((c) => [c, ...all(c)]); })(node)]).find((node) => node.tag === tag);
  const moved = moveHtml(locked, roots, find(roots, 'footer').id, find(roots, 'div').id, 'before');

  // In front of the marker — the <div> is still the element the lock is on.
  // (moveHtml's whitespace around a "before" drop is its own, lock or not.)
  assert.ok(moved.indexOf('<footer') < moved.indexOf('{{# sve-lock #}}'));
  assert.equal(row(moved, 'div').locked, true);
  assert.equal(locksKept(locked, moved), true);
});

test('the dock refuses a person typing into a locked element, and not beside it', () => {
  const locked = lockHtml(PAGE, row(PAGE, 'div'));
  const filter = EditorState.changeFilter.of((tr) =>
    editedByHand((event) => tr.isUserEvent(event))
      ? lockedRanges(tr.startState.doc.toString(), lockedElementRanges(tr.startState.doc.toString()))
      : true
  );
  const state = EditorState.create({ doc: locked, extensions: [filter] });
  const inside = locked.indexOf('x</p>');
  const typedInside = state.update({ changes: { from: inside, insert: 'y' }, userEvent: 'input.type' }).state;
  const toolbarInside = state.update({ changes: { from: inside, insert: '<div></div>' }, userEvent: 'input.toolbar' }).state;
  const marker = locked.indexOf('{{# sve-lock');
  const deletedMarker = state.update({ changes: { from: marker, to: marker + 16 }, userEvent: 'delete.backward' }).state;
  const beside = locked.indexOf('<footer');
  const typedBeside = state.update({ changes: { from: beside, insert: '<hr>' }, userEvent: 'input.type' }).state;

  assert.equal(typedInside.doc.toString(), locked);
  assert.equal(toolbarInside.doc.toString(), locked, 'the toolbar counts as typing');
  assert.equal(deletedMarker.doc.toString(), locked, 'the lock cannot be typed away');
  assert.ok(typedBeside.doc.toString().includes('<hr><footer'));
});

test('plumbing and locked elements come back as one list in document order', () => {
  const html = `{{ theme_tokens }}\n${lockHtml(PAGE, row(PAGE, 'div'))}{{ yield_scripts }}`;
  const r = lockedRanges(html, lockedElementRanges(html));

  assert.equal(r.length, 6);

  for (let i = 1; i < r.length; i += 1) {
    assert.ok(r[i - 1] <= r[i]);
  }
});
