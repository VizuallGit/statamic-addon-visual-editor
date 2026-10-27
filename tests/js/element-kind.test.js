/**
 * lib/element-kind.js — what an element is, shared by the HTML tree's row
 * names and Build's panel.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { elementNames } from '../../resources/js/lib/element-kind.js';
import { describeAt } from '../../resources/js/build-mode/place.js';
import { parseTemplateTree } from '../../resources/js/html-tree-parse.js';

const FILE = [
  '<section id="id-{{ id }}" class="[ {{ _class }} ] py-800">',
  '    <div class="wrapper">',
  '        <h2 class="text-800  font-bold">Title</h2>',
  '        <div class="grid grid-cols-2 max-md:grid-cols-1">',
  '            <div>',
  '                <p>One</p>',
  '            </div>',
  '            <div></div>',
  '        </div>',
  '        {{ blocks }}<span class="flex">x</span>{{ /blocks }}',
  '        {{ partial:components/btn_group }}',
  '    </div>',
  '</section>',
  '',
].join('\n');

test('every plain tag is named by what it is, with its place and its classes', () => {
  const names = elementNames(FILE, parseTemplateTree(FILE));
  const byKind = [...names.values()].map((it) => it.kind);

  assert.deepEqual(byKind, ['section', 'container', 'heading', 'columns', 'column', 'text', 'column', 'tag']);

  const heading = [...names.values()].find((it) => it.kind === 'heading');
  assert.equal(heading.classes, 'text-800 font-bold', 'classes read from the file, whitespace collapsed');

  const columns = [...names.values()].filter((it) => it.kind === 'column').map((it) => it.index);
  assert.deepEqual(columns, [1, 2]);
});

test('loops, conditions and components are left to their own names', () => {
  const roots = parseTemplateTree(FILE);
  const names = elementNames(FILE, roots);
  const kinded = [];
  const walk = (nodes) => nodes.forEach((n) => { if (n.kind) kinded.push(n.path); walk(n.children); });
  walk(roots);

  assert.ok(kinded.length >= 2);
  kinded.forEach((path) => assert.equal(names.has(path), false, path));
});

test('the tree and Build name a row the same way', () => {
  const roots = parseTemplateTree(FILE);
  const names = elementNames(FILE, roots);

  for (const [path, it] of names) {
    const node = describeAt(FILE, path).node;

    assert.equal(node.kind, it.kind, path);
    assert.equal(node.index, it.index, path);
  }
});
