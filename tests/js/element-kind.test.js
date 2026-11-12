/**
 * lib/element-kind.js — what an element is, as Build's panel names it.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
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

/** What Build says of every plain tag in the file, in document order. */
function described(html) {
  const out = [];
  const walk = (nodes) => {
    for (const node of nodes) {
      if (!node.kind) {
        out.push(describeAt(html, node.path).node);
      }

      walk(node.children);
    }
  };

  walk(parseTemplateTree(html));

  return out;
}

test('every plain tag is named by what it is, with its place', () => {
  const nodes = described(FILE);

  assert.deepEqual(
    nodes.map((it) => it.kind),
    ['section', 'container', 'heading', 'columns', 'column', 'text', 'column', 'tag']
  );
  assert.deepEqual(
    nodes.filter((it) => it.kind === 'column').map((it) => it.index),
    [1, 2]
  );
});

test('a Container is a div with `container`, as Build writes one — or `wrapper`, as one was written before', () => {
  const html =
    '<section><div class="container container-narrow"><p>a</p></div><div class="wrapper"><p>b</p></div><div class="flex"><p>c</p></div></section>';

  assert.deepEqual(
    described(html).map((it) => it.kind),
    ['section', 'container', 'text', 'container', 'text', 'flex', 'text']
  );
});
