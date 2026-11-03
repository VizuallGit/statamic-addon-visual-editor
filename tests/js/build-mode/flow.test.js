/**
 * build-mode/flow.js — where an element stands in the site's flow, read from the file.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { flowAt } from '../../../resources/js/build-mode/flow.js';
import { parseTemplateTree } from '../../../resources/js/html-tree-parse.js';

/* What site.css's flow-y and flow-x compile to: a rule reading `var(--flow-space`. */
const readsFlow = (name) => /^(?:[\w-]+:)*flow-[xy]$/.test(name);

const html = [
  '<div class="wrapper flow-y">',
  '    <h2>Title</h2>',
  '    <p class="flow-space-900">Text</p>',
  '    {{ if more }}<p>More</p>{{ /if }}',
  '    <div class="md:flow-x {{ extra }}"><span>a</span><span>b</span></div>',
  '</div>',
  '<section><p>Plain</p></section>',
].join('\n');

const pathOf = (test) => {
  let out = '';
  const walk = (nodes) => nodes.forEach((node) => {
    if (!out && test(node)) {
      out = node.path;
    }

    walk(node.children || []);
  });

  walk(parseTemplateTree(html));

  return out;
};
const text = (node) => html.slice(node.openTo, node.to ?? node.openTo + 20);
const at = (test) => flowAt(html, pathOf(test), readsFlow);

test('the flow element itself spaces its children', () => {
  assert.deepEqual(at((n) => /flow-y/.test(html.slice(n.from, n.openTo))), { inside: false, holds: true, first: true });
});

test('a child of the flow: the first has no room above, the next ones do', () => {
  assert.deepEqual(at((n) => n.tag === 'h2'), { inside: true, holds: false, first: true });
  assert.deepEqual(at((n) => n.tag === 'p' && /flow-space-900/.test(html.slice(n.from, n.openTo))), { inside: true, holds: false, first: false });
});

test('an {{ if }} between is no box: its element is still the flow\'s child', () => {
  assert.deepEqual(at((n) => n.tag === 'p' && /More/.test(text(n))), { inside: true, holds: false, first: false });
});

test('a flow under a size variant counts, and an Antlers class in the same attribute is let be', () => {
  const inner = at((n) => /md:flow-x/.test(html.slice(n.from, n.openTo)));

  assert.equal(inner.inside, true);
  assert.equal(inner.holds, true);
  assert.equal(at((n) => n.tag === 'span').inside, true);
});

test('outside any flow: nothing', () => {
  assert.deepEqual(at((n) => n.tag === 'p' && /Plain/.test(text(n))), { inside: false, holds: false, first: true });
  assert.equal(flowAt(html, 'no-such-path', readsFlow), null);
});

test('the site\'s own plain CSS classes that set --flow-space, in the file\'s order; a flow class read from its rule', async () => {
  const { siteFlowSpaces, siteReadsFlow } = await import('../../../resources/js/build-mode/flow.js');
  /* As /!/sve/site-css/defined hands them over: a demo keeps them in base.css. */
  const defs = [
    { name: 'flow-space-none', file: 'resources/css/base.css', selector: '.flow-space-none', css: '--flow-space: 0px;', kind: 'rule' },
    { name: 'flow-space-900', file: 'resources/css/base.css', selector: '.flow-space-900', css: '--flow-space: var(--size-900);', kind: 'rule' },
    { name: 'card', file: 'resources/css/base.css', selector: '.card .flow-space-x', css: '--flow-space: 1em;', kind: 'rule' },
    { name: 'gap', file: 'resources/css/base.css', selector: '.gap', css: 'gap: 1rem;', kind: 'rule' },
    { name: 'flow-y', file: 'resources/css/base.css', selector: '.flow-y > * + *', css: 'margin-block-start: var(--flow-space, 1em);', kind: 'rule' },
  ];

  assert.deepEqual(siteFlowSpaces(defs), ['flow-space-none', 'flow-space-900']);
  assert.equal(siteReadsFlow(defs, 'flow-y'), true);
  assert.equal(siteReadsFlow(defs, 'gap'), false);
});
