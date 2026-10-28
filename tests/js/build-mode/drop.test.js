/**
 * build-mode/drop.js — what an element on the canvas takes, and the file with a drop in it.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dropInto, dropMove, dropNew, dropWhere, dropZones, movable } from '../../../resources/js/build-mode/drop.js';
import { findByPath } from '../../../resources/js/build-mode/place.js';
import { parseTemplateTree } from '../../../resources/js/html-tree-parse.js';

const FILE = [
  '<section id="id-{{ id }}" class="[ {{ _class }} ] py-800">',
  '    <div class="wrapper">',
  '        <h2>Title</h2>',
  '        <div class="grid grid-cols-2 max-md:grid-cols-1">',
  '            <div>',
  '                <p>One</p>',
  '            </div>',
  '            <div></div>',
  '        </div>',
  '    </div>',
  '</section>',
  '',
].join('\n');

const ROOTS = parseTemplateTree(FILE);
const WRAPPER = '0:section/0:div';
const H2 = '0:section/0:div/0:h2';
const GRID = '0:section/0:div/1:div';
const COL1 = '0:section/0:div/1:div/0:div';
const COL2 = '0:section/0:div/1:div/1:div';
const P = '<p>New</p>';
const tagAt = (html, path) => findByPath(parseTemplateTree(html), path)?.tag;

test('the section’s own element takes things inside only; text beside only; a box both', () => {
  assert.deepEqual(dropZones(ROOTS, '0:section'), { beside: false, inside: true });
  assert.deepEqual(dropZones(ROOTS, H2), { beside: true, inside: false });
  assert.deepEqual(dropZones(ROOTS, WRAPPER), { beside: true, inside: true });
  assert.equal(dropZones(ROOTS, ''), null);
  assert.equal(dropZones(ROOTS, '0:section/9:div'), null);
});

test('a locked element takes nothing inside, things beside it; inside one nothing at all', () => {
  const html = '<section>\n    {{# sve-lock #}}\n    <div>\n        <p>Fixed</p>\n    </div>\n</section>\n';
  const roots = parseTemplateTree(html);

  assert.deepEqual(dropZones(roots, '0:section/0:div'), { beside: true, inside: false });
  assert.equal(dropZones(roots, '0:section/0:div/0:p'), null);
  assert.equal(dropNew(html, '0:section/0:div/0:p', 'after', P), null);
  assert.equal(dropNew(html, '0:section/0:div', 'inside', P), null);
  assert.ok(dropNew(html, '0:section/0:div', 'before', P).html.includes('    <p>New</p>\n    {{# sve-lock #}}\n'));
});

test('a move: the moved element and anything inside it take nothing', () => {
  assert.equal(dropZones(ROOTS, GRID, GRID), null);
  assert.equal(dropZones(ROOTS, COL1, GRID), null);
  assert.deepEqual(dropZones(ROOTS, H2, GRID), { beside: true, inside: false });
});

test('the zones are the tree’s: top half before, bottom half after, middle third inside a box', () => {
  const box = { beside: true, inside: true };
  const text = { beside: true, inside: false };

  assert.equal(dropWhere(box, 10, 100), 'before');
  assert.equal(dropWhere(box, 50, 100), 'inside');
  assert.equal(dropWhere(box, 90, 100), 'after');
  assert.equal(dropWhere(text, 49, 100), 'before');
  assert.equal(dropWhere(text, 51, 100), 'after');
  assert.equal(dropWhere({ beside: false, inside: true }, 2, 100), 'inside');
  assert.equal(dropWhere(null, 50, 100), null);
});

test('a new element before and after a row, at its indent, and its path', () => {
  const before = dropNew(FILE, H2, 'before', P);

  assert.ok(before.html.includes('    <div class="wrapper">\n        <p>New</p>\n        <h2>Title</h2>'), before.html);
  assert.equal(before.path, H2.replace('0:h2', '0:p'));

  const after = dropNew(FILE, H2, 'after', P);

  assert.ok(after.html.includes('        <h2>Title</h2>\n        <p>New</p>\n        <div class="grid'), after.html);
  assert.equal(tagAt(after.html, after.path), 'p');
});

test('inside goes where Add puts it: a section fills its container, Columns their first empty column', () => {
  const section = dropNew(FILE, '0:section', 'inside', P);

  assert.ok(section.html.includes('        </div>\n        <p>New</p>\n    </div>\n</section>'), section.html);
  assert.equal(dropInto(FILE, '0:section'), WRAPPER);

  const grid = dropNew(FILE, GRID, 'inside', P);

  assert.ok(grid.html.includes('            <div>\n                <p>New</p>\n            </div>\n        </div>'), grid.html);
  assert.equal(dropInto(FILE, GRID), COL2);
  assert.equal(tagAt(grid.html, grid.path), 'p');
});

/** Whether the needles stand in the file in this order, each found after the one before it. */
const order = (html, ...needles) => {
  let at = 0;

  return needles.every((needle) => (at = html.indexOf(needle, at)) !== -1 && (at += needle.length));
};

test('a move is the tree’s (its whitespace too), and the moved element’s new path comes back', () => {
  const out = dropMove(FILE, H2, COL2, 'inside');

  assert.ok(order(out.html, '<p>One</p>', '</div>', '<div>', '<h2>Title</h2>', '</div>'), out.html);
  assert.ok(!out.html.includes('data-sve-build-moving'));
  assert.equal(out.path, '0:section/0:div/0:div/1:div/0:h2');
  assert.equal(tagAt(out.html, out.path), 'h2');

  const down = dropMove(FILE, H2, GRID, 'after');

  assert.ok(order(down.html, 'class="grid', '<div></div>', '</div>', '<h2>Title</h2>', '</div>\n</section>'), down.html);
  assert.equal(down.path, '0:section/0:div/1:h2');
});

test('a container moved inside its own section lands in the section, not in itself', () => {
  const html = '<section>\n    <div class="wrapper">\n        <p>A</p>\n    </div>\n    <p>B</p>\n</section>\n';
  const out = dropMove(html, '0:section/0:div', '0:section', 'inside');

  assert.ok(order(out.html, '<p>B</p>', '<div class="wrapper">', '<p>A</p>', '</section>'), out.html);
  assert.equal(out.path, '0:section/1:div');
});

test('a move onto a loop or an if behind it: their paths hold offsets the mark must not shift', () => {
  const html = [
    '<section>',
    '    <p>Loose</p>',
    '    {{ items }}',
    '        <li>{{ title }}</li>',
    '    {{ /items }}',
    '    {{ if show }}',
    '        <span>Yes</span>',
    '    {{ /if }}',
    '</section>',
    '',
  ].join('\n');
  const [loop, branch] = parseTemplateTree(html)[0].children.slice(1);

  const into = dropMove(html, '0:section/0:p', loop.path, 'inside');

  assert.ok(order(into.html, '{{ items }}', '<p>Loose</p>', '{{ /items }}', '{{ if show }}'), into.html);
  assert.equal(tagAt(into.html, into.path), 'p');

  for (const where of ['before', 'after']) {
    const out = dropMove(html, '0:section/0:p', branch.path, where);
    const [first, second] = where === 'before' ? ['<p>Loose</p>', '{{ if show }}'] : ['{{ /if }}', '<p>Loose</p>'];

    assert.ok(order(out.html, '{{ /items }}', first, second), out.html);
    assert.ok(!out.html.includes('data-sve-build-moving'));
    assert.equal(tagAt(out.html, out.path), 'p');
  }
});

test('what does not move: the section’s own element, a locked one, into itself', () => {
  const locked = '<section>\n    {{# sve-lock #}}\n    <p>Fixed</p>\n    <p>Free</p>\n</section>\n';
  const before = dropMove(locked, '0:section/1:p', '0:section/0:p', 'before');

  assert.equal(movable(ROOTS, '0:section'), false);
  assert.equal(movable(parseTemplateTree(locked), '0:section/0:p'), false);
  assert.equal(dropMove(locked, '0:section/0:p', '0:section/1:p', 'after'), null);
  assert.equal(dropMove(FILE, GRID, COL1, 'inside'), null);
  assert.equal(dropMove(FILE, H2, H2, 'after'), null);
  assert.ok(order(before.html, '<p>Free</p>', '{{# sve-lock #}}', '<p>Fixed</p>'), before.html);
  assert.equal(findByPath(parseTemplateTree(before.html), '0:section/1:p').locked, true);
});
