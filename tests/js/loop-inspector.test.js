/**
 * loop-inspector.js: the loop panel's model and writes, shared by the HTML
 * tree's panel and the dock's help popup. The writes are antlers-edit.js's;
 * what is proven here is the rule around them — what is written when, and
 * that a node built without a tree is the tree's row.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findAntlersBlocks, NAV_PAGES } from '../../resources/js/antlers-blocks.js';
import { flattenHtmlTree, parseTemplateTree } from '../../resources/js/html-tree-parse.js';
import {
  loopDepthEdit,
  loopIncludeHomeEdit,
  loopInspectModel,
  loopKindEdit,
  loopKindOf,
  loopLimitEdit,
  loopNodeOf,
  loopOffsetEdit,
  loopSortDirEdit,
  loopSortFieldEdit,
  loopSourceEdit,
  navSources,
} from '../../resources/js/loop-inspector.js';

const win = {
  Statamic: {
    $config: {
      get: (key) =>
        ({
          sveCollections: [{ handle: 'services', title: 'Services' }],
          sveNavigations: [{ handle: 'footer', title: 'Footer' }],
          sveStrings: { antlers_nav_pages: 'Pages', antlers_loop: 'Loop' },
        })[key],
    },
  },
};

const HTML = '<ul>\n    {{ items | sort:title | limit:3 }}\n        <li>{{ title }}</li>\n    {{ /items }}\n</ul>';

const blockOf = (html) => findAntlersBlocks(html).find((block) => block.kind === 'loop');
const nodeOf = (html) => loopNodeOf(blockOf(html));

test('a node from a block is the tree’s row for the same loop', () => {
  const node = nodeOf(HTML);
  const row = flattenHtmlTree(parseTemplateTree(HTML), new Set()).find((item) => item.kind === 'antlers');
  const same = ['id', 'tag', 'kind', 'antlers', 'loopKind', 'handle', 'params', 'sortField', 'sortDir', 'limit', 'offset', 'paginate', 'alias', 'navDepth', 'includeHome', 'expr', 'from', 'to', 'openTo'];

  for (const key of same) {
    assert.deepEqual(node[key], row[key], key);
  }

  assert.equal(loopNodeOf(null), null);
  assert.equal(loopNodeOf({ kind: 'if' }), null);
});

test('the model names the kind, the sort, the limit — and the nav its depth', () => {
  const model = loopInspectModel(win, nodeOf(HTML));

  assert.equal(model.mode, 'loop');
  assert.equal(model.loopKind, 'field');
  assert.equal(model.value, 'items');
  assert.deepEqual(model.kinds.map((kind) => kind.id), ['field', 'collection', 'nav']);
  assert.equal(model.sort.dir, 'asc');
  assert.equal(model.sort.field, 'title');
  assert.equal(model.sort.needsField, true);
  assert.equal(model.sort.pickable, true);
  assert.equal(model.limit.value, '3');
  assert.equal(model.offset.value, '');
  assert.equal(model.key, 'antlers-9');

  // A direction chosen before its field shows the field box.
  const plain = loopInspectModel(win, nodeOf('{{ items }}x{{ /items }}'), { key: 'k', draft: 'desc' });

  assert.equal(plain.key, 'k');
  assert.equal(plain.sort.dir, 'desc');
  assert.equal(plain.sort.needsField, true);

  const nav = loopInspectModel(win, nodeOf('{{ nav handle="collection::pages" max_depth="2" }}x{{ /nav }}'));

  assert.equal(nav.loopKind, 'nav');
  assert.equal(nav.nav.depth, '2');
  assert.equal(nav.nav.homeAsked, true);
  assert.equal(nav.sort, undefined);
  assert.deepEqual(navSources(win).map((item) => item.handle), [NAV_PAGES, 'footer']);
});

test('switching kind writes only where there is somewhere to point', () => {
  const node = nodeOf(HTML);

  assert.equal(loopKindEdit(win, node, 'field'), null, 'the kind it already is');
  assert.ok(loopKindEdit(win, node, 'collection')(HTML, node).includes('{{ collection from="services"'));
  assert.ok(loopKindEdit(win, node, 'nav')(HTML, node).includes(`{{ nav handle="${NAV_PAGES}"`));

  const none = { Statamic: { $config: { get: () => [] } } };

  assert.equal(loopKindEdit(none, node, 'collection'), null, 'no collection to start on');
  assert.equal(loopKindOf({ loopKind: 'collection' }), 'collection');
  assert.equal(loopKindOf({}), 'field');
});

test('the sort: a direction without a field is a draft; dropping it drops the field', () => {
  const bare = '{{ items }}x{{ /items }}';
  const node = nodeOf(bare);

  assert.deepEqual(loopSortDirEdit(node, 'desc'), { draft: 'desc' });

  const written = loopSortFieldEdit(node, 'title', 'desc')(bare, node);

  assert.ok(written.startsWith('{{ items | sort:title | reverse }}'), written);

  const sorted = nodeOf(HTML);
  const dropped = loopSortDirEdit(sorted, '');

  assert.ok(dropped.edit);
  assert.ok(!dropped.edit(HTML, sorted).includes('sort:'), 'no leftover sort field');

  const random = loopSortDirEdit(node, 'random');

  assert.ok(random.edit(bare, node).includes('shuffle'), 'random needs no field');
});

test('limit, offset, depth, home and the source are written on the tag alone', () => {
  const node = nodeOf(HTML);

  assert.ok(loopLimitEdit('5')(HTML, node).includes('limit:5'));
  assert.ok(loopOffsetEdit('2x')(HTML, node).includes('offset:2'), 'digits only');
  assert.ok(loopSourceEdit(node, 'blocks')(HTML, node).includes('{{ /blocks }}'), 'both ends renamed');

  const nav = '{{ nav handle="collection::pages" }}x{{ /nav }}';
  const navNode = nodeOf(nav);

  assert.ok(loopDepthEdit('1')(nav, navNode).includes('max_depth="1"'));
  assert.ok(loopIncludeHomeEdit(true)(nav, navNode).includes('include_home="true"'));
});
