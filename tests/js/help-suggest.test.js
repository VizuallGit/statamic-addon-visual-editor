/**
 * Contract tests for dock/help-suggest.js — what help mode offers to write at
 * one spot in a template, and exactly what each suggestion writes.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { HELP_MAX, helpSuggestions, shiftSuggestion } from '../../resources/js/dock/help-suggest.js';
import { RULES, TAIL_RULES, runRules } from '../../resources/js/dock/help-rules/index.js';
import { blockPartialSrc, buildContext, hasBlockPartial } from '../../resources/js/dock/help-rules/context.js';
import { blockPartials } from '../../resources/js/lib/config.js';

/** SectionTypeMaker::scaffold(), as the dock is handed it. */
const SCAFFOLD = [
  '{{# sve-unlocked #}}',
  '<section id="id-{{ id }}" class="" {{ visual_edit outline_inside="true" section_orderable="true" }}>',
  '',
  '</section>',
  '',
].join('\n');

const GRID = [
  { var: 'items', label: 'Items', type: 'grid', loop: true, value: '3 rows' },
  { var: 'title', label: 'Title', type: 'text', parent: 'items' },
  { var: 'text', label: 'Text', type: 'bard', parent: 'items' },
];

/** featured_section/feature_list_icons: a replicator of items, each a replicator of blocks. */
const FEATURE_LIST = [
  { var: 'list', label: 'List', type: 'replicator', loop: true },
  { var: 'blocks', label: 'Blocks', type: 'replicator', loop: true, parent: 'list › item' },
  { var: 'iconify', label: 'Icon', type: 'iconify', parent: 'list › item › blocks › icon' },
  { var: 'title', label: 'Title', type: 'text', parent: 'list › item › blocks › title' },
  { var: 'text', label: 'Text', type: 'bard', parent: 'list › item › blocks › text' },
];

/** A section's blocks replicator, each set one of the site's block partials. */
const BLOCKS = [
  { var: 'blocks', label: 'Blocks', type: 'replicator', loop: true, value: '2 ×' },
  { var: 'title', label: 'Title', type: 'text', parent: 'blocks › headline' },
  { var: 'text', label: 'Text', type: 'bard', parent: 'blocks › richtext' },
  { var: 'links', label: 'Links', type: 'replicator', loop: true, parent: 'blocks › links' },
  { var: 'url', label: 'URL', type: 'link', parent: 'blocks › links › links › link' },
  { var: 'text', label: 'Text', type: 'text', parent: 'blocks › links › links › link' },
  { var: 'media', label: 'Media', type: 'assets', loop: true, parent: 'blocks › media' },
];

const PARTIALS = { src: 'blocks/{type}', handles: ['headline', 'richtext', 'links', 'media', 'icon', 'title', 'text', 'content'], image: 'components/image' };

/** A replicator with one set the site has a block partial for, and one it has not. */
const MIXED_SETS = [
  { var: 'content', label: 'Content', type: 'replicator', loop: true },
  { var: 'title', label: 'Title', type: 'text', parent: 'content › headline' },
  { var: 'quote', label: 'Quote', type: 'textarea', parent: 'content › quote' },
  { var: 'author', label: 'Author', type: 'text', parent: 'content › quote' },
];

const MEDIA = [{ var: 'media', label: 'Media', type: 'assets', loop: true }];

const apply = (html, suggestion) =>
  [...suggestion.changes]
    .sort((a, b) => b.from - a.from)
    .reduce((out, change) => out.slice(0, change.from) + change.insert + out.slice(change.to), html);

const caret = (html, marker = '|') => ({ html: html.replace(marker, ''), at: html.indexOf(marker) });

const ids = (list) => list.map((item) => item.id);

test('the section root: written the way a new section starts', () => {
  const { html, at } = caret('<sec|tion>\n</section>');
  const [shell] = helpSuggestions(html, at, { sectionPartial: true, shellRoot: SCAFFOLD });

  assert.equal(shell.id, 'shell');
  assert.equal(
    apply(html, shell),
    '<section id="id-{{ id }}" class="" {{ visual_edit outline_inside="true" section_orderable="true" }}>\n</section>'
  );
});

test('the section root keeps the class it has, and gets no second one', () => {
  const { html, at } = caret('<section class="py-800 |">\n</section>');
  const [shell] = helpSuggestions(html, at, { sectionPartial: true, shellRoot: SCAFFOLD });

  assert.equal(
    apply(html, shell),
    '<section id="id-{{ id }}" class="py-800 " {{ visual_edit outline_inside="true" section_orderable="true" }}>\n</section>'
  );
});

test('no shell outside a section partial, or below the first element', () => {
  const plain = caret('<section|>\n</section>');

  assert.ok(!ids(helpSuggestions(plain.html, plain.at, { shellRoot: SCAFFOLD })).includes('shell'));

  const second = caret('<div></div>\n<section|>\n</section>');

  assert.ok(!ids(helpSuggestions(second.html, second.at, { sectionPartial: true, shellRoot: SCAFFOLD })).includes('shell'));
});

test('a class: empty, no [ ], with the caret between the quotes', () => {
  const { html, at } = caret('<div|>\n</div>');
  const suggestion = helpSuggestions(html, at).find((item) => item.id === 'class');
  const out = apply(html, suggestion);

  assert.equal(out, '<div class="">\n</div>');
  assert.equal(out.slice(suggestion.selection - 1, suggestion.selection + 1), '""');
  assert.ok(!out.includes('[ ]'));
});

test('the same classes as the same tag above', () => {
  const { html, at } = caret('<ul>\n    <li class="flex gap-100">A</li>\n    <li|>B</li>\n</ul>');
  const [like] = helpSuggestions(html, at);

  assert.equal(like.id, 'class-same');
  assert.equal(like.meta, 'flex gap-100');
  assert.ok(apply(html, like).includes('<li class="flex gap-100">B</li>'));
});

test('text from a field replaces the fixed text and makes it editable', () => {
  const { html, at } = caret('<h2 class="text-800">Vores| ydelser</h2>');
  const fields = [{ var: 'title', label: 'Title', type: 'text', value: 'Det gør vi' }];
  const [text] = helpSuggestions(html, at, { fields });

  assert.equal(text.id, 'text:title');
  assert.deepEqual(text.args, { name: 'Title' });
  assert.equal(text.meta, 'Det gør vi');
  assert.equal(apply(html, text), '<h2 class="text-800" {{ visual_edit field="title" inline_edit="true" }}>{{ title }}</h2>');
});

test('a Bard field never goes in a <p>', () => {
  const { html, at } = caret('<p class="lead">|</p>');
  const [text] = helpSuggestions(html, at, { fields: [{ var: 'text', label: 'Text', type: 'bard' }] });

  assert.equal(apply(html, text), '<div class="lead" {{ visual_edit field="text" inline_edit="true" }}>{{ text }}</div>');
});

test('fields the file does not print yet come first', () => {
  const { html, at } = caret('<h1>{{ title }}</h1>\n<p>|</p>');
  const fields = [
    { var: 'title', label: 'Title', type: 'text' },
    { var: 'intro', label: 'Intro', type: 'textarea' },
  ];

  assert.deepEqual(ids(helpSuggestions(html, at, { fields })).slice(0, 2), ['text:intro', 'text:title']);
});

test('<ul> over a grid: the list, its rows and their fields', () => {
  const { html, at } = caret('<ul>|</ul>');
  const [loop] = helpSuggestions(html, at, { fields: GRID });

  assert.equal(loop.id, 'loop:items');
  assert.equal(loop.meta, 'grid · 3 rows');
  assert.equal(
    apply(html, loop),
    [
      '<ul class="" {{ visual_edit field="items" outline_inside="true" insertable="true" }}>',
      '    {{ items }}',
      '        <li class="" {{ visual_edit orderable="true" }}>',
      '            <h3 {{ visual_edit field="title" inline_edit="true" }}>{{ title }}</h3>',
      '            <div {{ visual_edit field="text" inline_edit="true" }}>{{ text }}</div>',
      '        </li>',
      '    {{ /items }}',
      '</ul>',
    ].join('\n')
  );
  assert.ok(apply(html, loop).slice(0, loop.selection).endsWith('{{ visual_edit orderable="true" }}>'));
});

test('a replicator gets a branch per set, the way feature_list_icons is built', () => {
  const { html, at } = caret('    <ul class="[ list ] wrapper">|</ul>');
  const [loop] = helpSuggestions(html, at, { fields: FEATURE_LIST });

  assert.equal(
    apply(html, loop),
    [
      '    <ul class="[ list ] wrapper" {{ visual_edit field="list" outline_inside="true" insertable="true" }}>',
      '        {{ list }}',
      '            <li class="" {{ visual_edit orderable="true" }}>',
      '                {{ blocks }}',
      "                    {{ if type == 'title' }}",
      '                        <h3 {{ visual_edit field="title" inline_edit="true" }}>{{ title }}</h3>',
      "                    {{ elseif type == 'text' }}",
      '                        <div {{ visual_edit field="text" inline_edit="true" }}>{{ text }}</div>',
      '                    {{ /if }}',
      '                {{ /blocks }}',
      '            </li>',
      '        {{ /list }}',
      '    </ul>',
    ].join('\n')
  );
});

test('a <ul> just typed, not closed yet, above other markup', () => {
  const { html, at } = caret('<div>\n    <ul>|\n    <p>Below</p>\n</div>');
  const [loop] = helpSuggestions(html, at, { fields: GRID });
  const out = apply(html, loop);

  assert.equal(loop.id, 'loop:items');
  assert.ok(out.includes('    </ul>\n    <p>Below</p>\n</div>'), out);
});

test('inside a loop, the loop’s own fields', () => {
  const { html, at } = caret('{{ items }}\n    <h3>|</h3>\n{{ /items }}');
  const suggestions = helpSuggestions(html, at, { fields: [{ var: 'heading', label: 'Heading', type: 'text' }, ...GRID] });

  assert.deepEqual(ids(suggestions).slice(0, 2), ['text:title', 'text:text']);
});

test('inside a collection loop the section’s fields are not what prints', () => {
  const { html, at } = caret('{{ collection:services }}\n    <h3>|</h3>\n{{ /collection:services }}');

  assert.deepEqual(ids(helpSuggestions(html, at, { fields: GRID })), ['class']);
});

test('on a loop’s own tag: what should it repeat — and nothing else', () => {
  const { html, at } = caret('<ul>\n    {{ it|ems }}\n        <li></li>\n    {{ /items }}\n</ul>');
  const suggestions = helpSuggestions(html, at, { fields: GRID });

  assert.equal(suggestions.length, 1);
  assert.equal(suggestions[0].id, 'loop-ask');
  assert.equal(suggestions[0].args.name, 'items');
  assert.deepEqual(suggestions[0].changes, []);
  assert.ok(suggestions[0].loop);
});

test('nothing inside a locked element, or a range the dock locked', () => {
  const locked = caret('{{# sve-lock #}}\n<div><p>|</p></div>');

  assert.deepEqual(helpSuggestions(locked.html, locked.at, { fields: GRID }), []);

  const ranged = caret('<div|></div>');

  assert.deepEqual(helpSuggestions(ranged.html, ranged.at, { locked: [0, 11] }), []);
});

test('a scoped pane: the file is asked, the pane is written', () => {
  // The pane shows the <p> alone; the file holds the section around it.
  const file = '<section>\n    <p></p>\n</section>';
  const pane = '<p></p>';
  const offset = file.indexOf(pane);
  const fields = [{ var: 'title', label: 'Title', type: 'text' }];
  const [inFile] = helpSuggestions(file, offset + 2, { fields });
  const inPane = shiftSuggestion(inFile, offset);

  assert.equal(inPane.id, 'text:title');
  assert.equal(apply(pane, inPane), '<p {{ visual_edit field="title" inline_edit="true" }}>{{ title }}</p>');
  assert.equal(inPane.selection, inFile.selection - offset);
  assert.equal(shiftSuggestion(inFile, 0), inFile, 'the whole file in the pane: nothing to move');

  // The loop's address stays the file's: it is looked up again there.
  const loop = { id: 'loop-ask', changes: [], selection: null, loop: { from: 40 } };

  assert.equal(shiftSuggestion(loop, 10).loop.from, 40);
  assert.equal(shiftSuggestion(loop, 10).selection, null);
});

test('never more than the popup shows — plus the id row, always last — and nothing for a caret outside markup', () => {
  const { html, at } = caret('<p|></p>');
  const fields = ['a', 'b', 'c', 'd'].map((name) => ({ var: name, label: name, type: 'text' }));
  const suggestions = helpSuggestions(html, at, { fields });

  assert.equal(suggestions.length, HELP_MAX + 1);
  assert.equal(suggestions.at(-1).id, 'id');
  assert.deepEqual(helpSuggestions('<p></p>\n', 8), []);
  assert.deepEqual(helpSuggestions('<p></p>', -1), []);
});

test('an id: empty, after the class rows, with the caret between the quotes', () => {
  const { html, at } = caret('<div class="box">\n    <p>|</p>\n</div>');
  const suggestions = helpSuggestions(html, at);

  assert.deepEqual(ids(suggestions), ['class', 'id']);

  const id = suggestions[1];
  const next = apply(html, id);

  assert.equal(next, '<div class="box">\n    <p id=""></p>\n</div>');
  assert.equal(next.slice(id.selection - 4, id.selection + 1), 'id=""');
  assert.equal(id.after, undefined);
});

test('no id on an element that has one, inside a loop, or where the shell writes it', () => {
  const has = caret('<div id="top">|</div>');
  assert.ok(!ids(helpSuggestions(has.html, has.at)).includes('id'));

  const inLoop = caret('<ul>{{ items }}<li>|</li>{{ /items }}</ul>');
  assert.ok(!ids(helpSuggestions(inLoop.html, inLoop.at, { fields: GRID })).includes('id'));

  const inCollection = caret('{{ collection:services }}<h3>|</h3>{{ /collection:services }}');
  assert.ok(!ids(helpSuggestions(inCollection.html, inCollection.at)).includes('id'));

  const root = caret('<section>|</section>');
  assert.deepEqual(ids(helpSuggestions(root.html, root.at, { sectionPartial: true, shellRoot: SCAFFOLD })), ['shell']);
});

test('what the editor does after a row: the class opens the picker, a loop tag the loop panel', () => {
  const { html, at } = caret('<p|></p>');
  const byId = Object.fromEntries(helpSuggestions(html, at).map((item) => [item.id, item]));

  assert.equal(byId.class.after, 'class');

  const loop = caret('<ul>{{ it|ems }}<li></li>{{ /items }}</ul>');
  assert.equal(helpSuggestions(loop.html, loop.at, { fields: GRID })[0].after, 'loop');

  const same = caret('<p class="lead"></p>\n<p|></p>');
  assert.equal(helpSuggestions(same.html, same.at).find((item) => item.id === 'class-same').after, undefined);
});

test('the registry: primary rules fill the cap in order and see what came before; tail rules come after the cap', () => {
  const ctx = { node: { tag: 'x' } };
  const row = (id) => ({ id, key: 'k', args: {}, meta: '', changes: [], selection: null });
  const rules = [
    () => [row('a'), row('b')],
    (_, offered) => (offered.some((item) => item.id === 'a') ? [row('c')] : []),
    () => [row('d'), null],
  ];
  const tail = [(_, offered) => [row(`tail:${offered.length}`)]];

  assert.deepEqual(ids(runRules(ctx, 3, rules, tail)), ['a', 'b', 'c', 'tail:3']);
  assert.deepEqual(ids(runRules(ctx, 10, rules, tail)), ['a', 'b', 'c', 'd', 'tail:4']);
});

test('the block partials reach the rules as { src, handles }, and a set’s src is written from them', () => {
  const { html, at } = caret('<div>|</div>');
  const ctx = buildContext(html, at, {
    rows: [],
    blocks: [],
    sectionPartial: false,
    shellRoot: '',
    blockPartials: { src: 'blocks/{type}', handles: ['headline', 'richtext', 7], image: 'components/image' },
  });

  assert.deepEqual(ctx.blockPartials, { src: 'blocks/{type}', handles: ['headline', 'richtext'], image: 'components/image' });
  assert.equal(hasBlockPartial(ctx, 'richtext'), true);
  assert.equal(hasBlockPartial(ctx, 'hero'), false);
  assert.equal(blockPartialSrc(ctx, 'richtext'), 'blocks/richtext');

  const none = buildContext(html, at, { rows: [], blocks: [], blockPartials: null });
  assert.deepEqual(none.blockPartials, { src: '', handles: [], image: '' });
  assert.equal(hasBlockPartial(none, 'richtext'), false);
});

test('blockPartials(win): what PHP hands over, or nothing from an older PHP', () => {
  const win = (value) => ({ Statamic: { $config: { get: (key) => (key === 'sveBlockPartials' ? value : undefined) } } });

  assert.deepEqual(blockPartials(win({ src: 'blocks/{type}', handles: ['links'], image: 'components/image' })), { src: 'blocks/{type}', handles: ['links'], image: 'components/image' });
  assert.deepEqual(blockPartials(win(undefined)), { src: '', handles: [], image: '' });
  assert.deepEqual(blockPartials({}), { src: '', handles: [], image: '' });
});

test('help-rules/index.js: the rules in the order their rows show, the id last', () => {
  assert.deepEqual(RULES.map((rule) => rule.name), [
    'sectionRule',
    'blocksRule',
    'linkRule',
    'listRule',
    'textRule',
    'mediaRule',
    'imgRule',
    'classRule',
  ]);
  assert.deepEqual(TAIL_RULES.map((rule) => rule.name), ['idRule']);
});

/* ---- section: the blocks wrapper ------------------------------------------ */

test('the section root with its shell: the blocks wrapper — a <div>, a branch per set, each set its block partial', () => {
  const { html, at } = caret(SCAFFOLD.replace('>\n\n</section>', '>\n|\n</section>'));
  const suggestions = helpSuggestions(html, at, { fields: BLOCKS, blockPartials: PARTIALS, sectionPartial: true, shellRoot: SCAFFOLD });

  assert.deepEqual(ids(suggestions), ['blocks:blocks']);

  const [blocks] = suggestions;
  const out = apply(html, blocks);

  assert.equal(blocks.key, 'code_dock_help_blocks');
  assert.deepEqual(blocks.args, { name: 'Blocks' });
  assert.equal(blocks.meta, 'replicator · 2 ×');
  assert.equal(
    out,
    [
      '{{# sve-unlocked #}}',
      '<section id="id-{{ id }}" class="" {{ visual_edit outline_inside="true" section_orderable="true" }}>',
      '    <div class="" {{ visual_edit field="blocks" outline_inside="true" insertable="true" }}>',
      '        {{ blocks }}',
      "            {{ if type == 'headline' }}",
      '                {{ partial src="blocks/headline" }}',
      "            {{ elseif type == 'richtext' }}",
      '                {{ partial src="blocks/richtext" }}',
      "            {{ elseif type == 'links' }}",
      '                {{ partial src="blocks/links" }}',
      "            {{ elseif type == 'media' }}",
      '                {{ partial src="blocks/media" }}',
      '            {{ /if }}',
      '        {{ /blocks }}',
      '    </div>',
      '</section>',
      '',
    ].join('\n')
  );
  assert.equal(out.slice(blocks.selection), '\n</section>\n', 'the caret after the wrapper, inside the section');
});

test('no blocks wrapper on the section before its shell, with markup inside, without block partials, or for a grid', () => {
  const options = { fields: BLOCKS, blockPartials: PARTIALS, sectionPartial: true, shellRoot: SCAFFOLD };
  const bare = caret('<section>|</section>');

  assert.deepEqual(ids(helpSuggestions(bare.html, bare.at, options)), ['shell']);

  const full = caret('<section id="id-{{ id }}" class="">\n    <h2>Hej</h2>|\n</section>');

  assert.deepEqual(ids(helpSuggestions(full.html, full.at, options)), []);

  const shelled = caret('<section id="id-{{ id }}" class="">|</section>');

  assert.deepEqual(ids(helpSuggestions(shelled.html, shelled.at, options)), ['blocks:blocks']);
  assert.deepEqual(ids(helpSuggestions(shelled.html, shelled.at, { ...options, blockPartials: { src: '', handles: PARTIALS.handles } })), []);
  assert.deepEqual(ids(helpSuggestions(shelled.html, shelled.at, { ...options, fields: GRID })), [], 'no loop directly under a section');
});

/* ---- div ------------------------------------------------------------------ */

test('an empty <div> over a replicator of block partials: the div itself becomes the blocks wrapper', () => {
  const { html, at } = caret('    <div class="content">|</div>');
  const suggestions = helpSuggestions(html, at, { fields: BLOCKS, blockPartials: PARTIALS });

  assert.deepEqual(ids(suggestions), ['blocks:blocks', 'id']);

  const out = apply(html, suggestions[0]);

  assert.equal(
    out,
    [
      '    <div class="content" {{ visual_edit field="blocks" outline_inside="true" insertable="true" }}>',
      '        {{ blocks }}',
      "            {{ if type == 'headline' }}",
      '                {{ partial src="blocks/headline" }}',
      "            {{ elseif type == 'richtext' }}",
      '                {{ partial src="blocks/richtext" }}',
      "            {{ elseif type == 'links' }}",
      '                {{ partial src="blocks/links" }}',
      "            {{ elseif type == 'media' }}",
      '                {{ partial src="blocks/media" }}',
      '            {{ /if }}',
      '        {{ /blocks }}',
      '    </div>',
    ].join('\n')
  );
  assert.equal(suggestions[0].selection, out.length);
});

test('a set the site has no block partial for keeps its fields in its branch', () => {
  const { html, at } = caret('<div>|</div>');
  const [blocks] = helpSuggestions(html, at, { fields: MIXED_SETS, blockPartials: PARTIALS });

  assert.equal(blocks.id, 'blocks:content');
  assert.equal(
    apply(html, blocks),
    [
      '<div class="" {{ visual_edit field="content" outline_inside="true" insertable="true" }}>',
      '    {{ content }}',
      "        {{ if type == 'headline' }}",
      '            {{ partial src="blocks/headline" }}',
      "        {{ elseif type == 'quote' }}",
      '            <p {{ visual_edit field="quote" inline_edit="true" }}>{{ quote }}</p>',
      '            <p {{ visual_edit field="author" inline_edit="true" }}>{{ author }}</p>',
      '        {{ /if }}',
      '    {{ /content }}',
      '</div>',
    ].join('\n')
  );
});

test('an empty <div> over a grid: rows of <div>s, the way the list writes <li>s', () => {
  const { html, at } = caret('<div>|</div>');
  const suggestions = helpSuggestions(html, at, { fields: GRID, blockPartials: PARTIALS });

  assert.deepEqual(ids(suggestions), ['loop:items', 'class', 'id']);

  const [loop] = suggestions;
  const out = apply(html, loop);

  assert.equal(loop.key, 'code_dock_help_loop');
  assert.equal(loop.meta, 'grid · 3 rows');
  assert.equal(
    out,
    [
      '<div class="" {{ visual_edit field="items" outline_inside="true" insertable="true" }}>',
      '    {{ items }}',
      '        <div class="" {{ visual_edit orderable="true" }}>',
      '            <h3 {{ visual_edit field="title" inline_edit="true" }}>{{ title }}</h3>',
      '            <div {{ visual_edit field="text" inline_edit="true" }}>{{ text }}</div>',
      '        </div>',
      '    {{ /items }}',
      '</div>',
    ].join('\n')
  );
  assert.ok(out.slice(0, loop.selection).endsWith('{{ items }}\n        <div class="" {{ visual_edit orderable="true" }}>'));
});

test('a replicator with no block-partial set: rows of <div>s — and the loops inside them still use the partials', () => {
  const { html, at } = caret('<div>|</div>');
  const [loop] = helpSuggestions(html, at, { fields: FEATURE_LIST, blockPartials: PARTIALS });

  assert.equal(loop.id, 'loop:list');
  assert.equal(loop.key, 'code_dock_help_loop');
  assert.equal(
    apply(html, loop),
    [
      '<div class="" {{ visual_edit field="list" outline_inside="true" insertable="true" }}>',
      '    {{ list }}',
      '        <div class="" {{ visual_edit orderable="true" }}>',
      '            {{ blocks }}',
      "                {{ if type == 'icon' }}",
      '                    {{ partial src="blocks/icon" }}',
      "                {{ elseif type == 'title' }}",
      '                    {{ partial src="blocks/title" }}',
      "                {{ elseif type == 'text' }}",
      '                    {{ partial src="blocks/text" }}',
      '                {{ /if }}',
      '            {{ /blocks }}',
      '        </div>',
      '    {{ /list }}',
      '</div>',
    ].join('\n')
  );
});

test('a <div> takes text only from Bard or Markdown — never a text or textarea field', () => {
  const { html, at } = caret('<div>|</div>');
  const fields = [
    { var: 'title', label: 'Title', type: 'text' },
    { var: 'intro', label: 'Intro', type: 'textarea' },
    { var: 'text', label: 'Text', type: 'bard' },
  ];
  const suggestions = helpSuggestions(html, at, { fields });

  assert.deepEqual(ids(suggestions), ['text:text', 'class', 'id']);
  assert.equal(suggestions[0].key, 'code_dock_help_text');
  assert.equal(apply(html, suggestions[0]), '<div {{ visual_edit field="text" inline_edit="true" }}>{{ text }}</div>');

  const fixed = caret('<div>Lorem| ipsum</div>');

  assert.deepEqual(ids(helpSuggestions(fixed.html, fixed.at, { fields: fields.slice(0, 2) })), ['class', 'id']);
});

test('an empty <div> over a file field: the media wrapper, one image partial line and no <img>', () => {
  const { html, at } = caret('<div>|</div>');
  const suggestions = helpSuggestions(html, at, { fields: MEDIA, blockPartials: PARTIALS });

  assert.deepEqual(ids(suggestions), ['media:media', 'class', 'id']);

  const [media] = suggestions;
  const out = apply(html, media);

  assert.equal(media.key, 'code_dock_help_media');
  assert.deepEqual(media.args, { name: 'Media' });
  assert.equal(
    out,
    [
      '<div class="" {{ visual_edit field="media" outline_inside="true" inline_edit="true" }}>',
      '    {{ partial:components/image :imagePath="media" class="" }}',
      '</div>',
    ].join('\n')
  );
  assert.equal(media.selection, out.length);
  assert.ok(!out.includes('<img'));
});

test('no image help on a site without the image partial — the <img> still gets its attributes', () => {
  const div = caret('<div>|</div>');
  const img = caret('<img|>');
  const none = { src: 'blocks/{type}', handles: ['media'], image: '' };

  assert.deepEqual(ids(helpSuggestions(div.html, div.at, { fields: MEDIA, blockPartials: none })), ['class', 'id']);
  assert.deepEqual(ids(helpSuggestions(div.html, div.at, { fields: MEDIA })), ['class', 'id']);
  assert.deepEqual(ids(helpSuggestions(img.html, img.at, { fields: MEDIA, blockPartials: none })), ['img-attrs', 'class', 'id']);

  // The partial's name is the site's, not a constant here.
  const other = helpSuggestions(img.html, img.at, { fields: MEDIA, blockPartials: { ...none, image: 'components/picture' } })[0];

  assert.equal(apply(img.html, other), '{{ partial:components/picture :imagePath="media" class="" }}');
  assert.equal(other.meta, 'components/picture');
});

test('a <div>: loops first, then Bard, then the image — the class gives way, the id stays last', () => {
  const { html, at } = caret('<div>|</div>');
  const fields = [{ var: 'body', label: 'Body', type: 'bard' }, ...MEDIA, ...GRID];

  assert.deepEqual(ids(helpSuggestions(html, at, { fields, blockPartials: PARTIALS })), ['loop:items', 'text:body', 'media:media', 'id']);
});

test('a <div> inside the blocks loop: what the sets hold that fits a div', () => {
  const { html, at } = caret('{{ blocks }}\n    <div>|</div>\n{{ /blocks }}');

  assert.deepEqual(ids(helpSuggestions(html, at, { fields: BLOCKS, blockPartials: PARTIALS })), ['loop:links', 'text:text', 'media:media']);
});

test('no loop, text or image on a <div> that holds markup, or inside a collection loop', () => {
  const fields = [{ var: 'body', label: 'Body', type: 'bard' }, ...MEDIA, ...GRID];
  const full = caret('<div>\n    <p>Hej</p>|\n</div>');

  assert.deepEqual(ids(helpSuggestions(full.html, full.at, { fields })), ['class', 'id']);

  const loop = caret('{{ collection:services }}\n    <div>|</div>\n{{ /collection:services }}');

  assert.deepEqual(ids(helpSuggestions(loop.html, loop.at, { fields: [...fields, ...BLOCKS], blockPartials: PARTIALS })), ['class']);
});

/* ---- ul / ol / li --------------------------------------------------------- */

test('<ol> over a replicator of block partials: each <li> holds its set’s partial', () => {
  const { html, at } = caret('<ol>|</ol>');
  const [loop] = helpSuggestions(html, at, { fields: BLOCKS, blockPartials: PARTIALS });

  assert.equal(loop.id, 'loop:blocks');
  assert.equal(loop.key, 'code_dock_help_loop');
  assert.equal(
    apply(html, loop),
    [
      '<ol class="" {{ visual_edit field="blocks" outline_inside="true" insertable="true" }}>',
      '    {{ blocks }}',
      '        <li class="" {{ visual_edit orderable="true" }}>',
      "            {{ if type == 'headline' }}",
      '                {{ partial src="blocks/headline" }}',
      "            {{ elseif type == 'richtext' }}",
      '                {{ partial src="blocks/richtext" }}',
      "            {{ elseif type == 'links' }}",
      '                {{ partial src="blocks/links" }}',
      "            {{ elseif type == 'media' }}",
      '                {{ partial src="blocks/media" }}',
      '            {{ /if }}',
      '        </li>',
      '    {{ /blocks }}',
      '</ol>',
    ].join('\n')
  );
});

test('feature_list_icons with the site’s block partials: the blocks inside each <li> are written as partials', () => {
  const { html, at } = caret('    <ul class="[ list ] wrapper">|</ul>');
  const [loop] = helpSuggestions(html, at, { fields: FEATURE_LIST, blockPartials: PARTIALS });

  assert.equal(
    apply(html, loop),
    [
      '    <ul class="[ list ] wrapper" {{ visual_edit field="list" outline_inside="true" insertable="true" }}>',
      '        {{ list }}',
      '            <li class="" {{ visual_edit orderable="true" }}>',
      '                {{ blocks }}',
      "                    {{ if type == 'icon' }}",
      '                        {{ partial src="blocks/icon" }}',
      "                    {{ elseif type == 'title' }}",
      '                        {{ partial src="blocks/title" }}',
      "                    {{ elseif type == 'text' }}",
      '                        {{ partial src="blocks/text" }}',
      '                    {{ /if }}',
      '                {{ /blocks }}',
      '            </li>',
      '        {{ /list }}',
      '    </ul>',
    ].join('\n')
  );
});

test('an empty <li> in a loop whose row holds a replicator: a blocks wrapper <div> inside it', () => {
  const { html, at } = caret('<ul>\n    {{ list }}\n        <li>|</li>\n    {{ /list }}\n</ul>');
  const suggestions = helpSuggestions(html, at, { fields: FEATURE_LIST, blockPartials: PARTIALS });

  assert.deepEqual(ids(suggestions), ['blocks:blocks', 'class']);
  assert.equal(
    apply(html, suggestions[0]),
    [
      '<ul>',
      '    {{ list }}',
      '        <li>',
      '            <div class="" {{ visual_edit field="blocks" outline_inside="true" insertable="true" }}>',
      '                {{ blocks }}',
      "                    {{ if type == 'icon' }}",
      '                        {{ partial src="blocks/icon" }}',
      "                    {{ elseif type == 'title' }}",
      '                        {{ partial src="blocks/title" }}',
      "                    {{ elseif type == 'text' }}",
      '                        {{ partial src="blocks/text" }}',
      '                    {{ /if }}',
      '                {{ /blocks }}',
      '            </div>',
      '        </li>',
      '    {{ /list }}',
      '</ul>',
    ].join('\n')
  );

  // Without block partials the replicator's sets are rows of <div>s, as in an empty <div>.
  const plain = helpSuggestions(html, at, { fields: FEATURE_LIST });

  assert.deepEqual(ids(plain), ['loop:blocks', 'class']);
  assert.equal(plain[0].key, 'code_dock_help_loop');
});

test('an <li> outside a loop is static: no text from a field — inside one it takes the loop’s', () => {
  const outside = caret('<ul>\n    <li>|</li>\n</ul>');

  assert.deepEqual(ids(helpSuggestions(outside.html, outside.at, { fields: [{ var: 'title', label: 'Title', type: 'text' }] })), [
    'class',
    'id',
  ]);

  const inside = caret('<ul>\n    {{ items }}\n        <li>|</li>\n    {{ /items }}\n</ul>');

  assert.deepEqual(ids(helpSuggestions(inside.html, inside.at, { fields: GRID })), ['text:title', 'text:text', 'class']);
});

/* ---- a -------------------------------------------------------------------- */

test('an empty <a> where a link field prints: href and visual_edit from it, the text from the first text field', () => {
  const { html, at } = caret('{{ blocks }}\n    {{ links }}\n        <a>|</a>\n    {{ /links }}\n{{ /blocks }}');
  const suggestions = helpSuggestions(html, at, { fields: BLOCKS, blockPartials: PARTIALS });

  assert.deepEqual(ids(suggestions), ['link:url', 'text:text', 'class']);

  const [link] = suggestions;
  const out = apply(html, link);

  assert.equal(link.key, 'code_dock_help_link');
  assert.deepEqual(link.args, { name: 'URL' });
  assert.equal(out, '{{ blocks }}\n    {{ links }}\n        <a href="{{ url }}" {{ visual_edit field="url" }}>{{ text }}</a>\n    {{ /links }}\n{{ /blocks }}');
  assert.ok(out.slice(0, link.selection).endsWith('{{ text }}'));
});

test('a link field and no text field: the <a> keeps its class and stays empty, the caret inside it', () => {
  const { html, at } = caret('<a class="btn">|</a>');
  const suggestions = helpSuggestions(html, at, { fields: [{ var: 'url', label: 'URL', type: 'link' }] });

  assert.deepEqual(ids(suggestions), ['link:url', 'id']);

  const out = apply(html, suggestions[0]);

  assert.equal(out, '<a href="{{ url }}" class="btn" {{ visual_edit field="url" }}></a>');
  assert.equal(out.slice(suggestions[0].selection), '</a>');
});

test('no link row on an <a> that has an href or holds text; no href row while a link field prints here', () => {
  const fields = [{ var: 'url', label: 'URL', type: 'link' }];
  const has = caret('<a href="/kontakt">|</a>');

  assert.deepEqual(ids(helpSuggestions(has.html, has.at, { fields })), ['class', 'id']);

  const text = caret('<a>Læs mere|</a>');

  assert.deepEqual(ids(helpSuggestions(text.html, text.at, { fields })), ['class', 'id']);
});

test('an empty <a> where a links replicator prints: the links block partial in its place', () => {
  const { html, at } = caret("{{ blocks }}\n    {{ if type == 'links' }}\n        <a class=\"btn\">|</a>\n    {{ /if }}\n{{ /blocks }}");
  const suggestions = helpSuggestions(html, at, { fields: BLOCKS, blockPartials: PARTIALS });

  assert.deepEqual(ids(suggestions), ['links-partial', 'href', 'text:title']);

  const [partial] = suggestions;
  const out = apply(html, partial);

  assert.equal(partial.key, 'code_dock_help_links_partial');
  assert.equal(partial.meta, 'blocks/links');
  assert.equal(out, "{{ blocks }}\n    {{ if type == 'links' }}\n        {{ partial src=\"blocks/links\" }}\n    {{ /if }}\n{{ /blocks }}");
  assert.ok(out.slice(0, partial.selection).endsWith('{{ partial src="blocks/links" }}'));

  assert.ok(!ids(helpSuggestions(html, at, { fields: BLOCKS })).includes('links-partial'), 'no block partials');
  assert.ok(
    !ids(helpSuggestions(html, at, { fields: BLOCKS, blockPartials: { src: 'blocks/{type}', handles: ['headline'] } })).includes('links-partial'),
    'no links partial on the site'
  );
});

test('an <a> without href and no link field: href="" before the class, the caret between the quotes', () => {
  const { html, at } = caret('<a|>Kontakt</a>');
  const suggestions = helpSuggestions(html, at);

  assert.deepEqual(ids(suggestions), ['href', 'class', 'id']);

  const [href] = suggestions;
  const out = apply(html, href);

  assert.equal(href.key, 'code_dock_help_href');
  assert.equal(out, '<a href="">Kontakt</a>');
  assert.equal(out.slice(href.selection - 6, href.selection + 1), 'href=""');
});

/* ---- img ------------------------------------------------------------------ */

test('an <img> where a file field prints: the image partial in its place, the static class kept', () => {
  const { html, at } = caret('<img class="w-full h-full object-cover"|>');
  const suggestions = helpSuggestions(html, at, { fields: MEDIA, blockPartials: PARTIALS });

  assert.deepEqual(ids(suggestions), ['media:media', 'img-attrs', 'id']);

  const out = apply(html, suggestions[0]);

  assert.equal(suggestions[0].key, 'code_dock_help_media');
  assert.equal(out, '{{ partial:components/image :imagePath="media" class="w-full h-full object-cover" }}');
  assert.equal(suggestions[0].selection, out.length);

  const bare = caret('<img src="{{ url }}" class="{{ klass }}"|>');

  assert.equal(apply(bare.html, helpSuggestions(bare.html, bare.at, { fields: MEDIA, blockPartials: PARTIALS })[0]), '{{ partial:components/image :imagePath="media" class="" }}');

  const loop = caret('{{ collection:news }}\n    <img|>\n{{ /collection:news }}');

  assert.deepEqual(ids(helpSuggestions(loop.html, loop.at, { fields: MEDIA, blockPartials: PARTIALS })), ['img-attrs', 'class']);
});

test('an <img> without src: src, lazy loading and alt — only the ones missing, the caret in src', () => {
  const { html, at } = caret('<img|>');
  const suggestions = helpSuggestions(html, at);

  assert.deepEqual(ids(suggestions), ['img-attrs', 'class', 'id']);

  const [attrs] = suggestions;
  const out = apply(html, attrs);

  assert.equal(attrs.key, 'code_dock_help_img_attrs');
  assert.equal(out, '<img src="" loading="lazy" alt="">');
  assert.equal(out.slice(attrs.selection - 5, attrs.selection + 1), 'src=""');

  const some = caret('<img class="logo" alt="Vizuall" loading="eager"|>');

  assert.equal(apply(some.html, helpSuggestions(some.html, some.at)[0]), '<img src="" class="logo" alt="Vizuall" loading="eager">');
});

test('an <img> with src and no alt: alt="", the caret inside; nothing when both are there', () => {
  const { html, at } = caret('<img src="/logo.svg" class="logo"|>');
  const suggestions = helpSuggestions(html, at);

  assert.deepEqual(ids(suggestions), ['alt', 'id']);

  const out = apply(html, suggestions[0]);

  assert.equal(suggestions[0].key, 'code_dock_help_alt');
  assert.equal(out, '<img alt="" src="/logo.svg" class="logo">');
  assert.equal(out.slice(suggestions[0].selection - 5, suggestions[0].selection + 1), 'alt=""');

  const done = caret('<img src="/logo.svg" alt="Logo" class="logo"|>');

  assert.deepEqual(ids(helpSuggestions(done.html, done.at)), ['id']);
});

/* ---- headings, button ----------------------------------------------------- */

test('a heading offers the title-like fields first — still unused first inside each group', () => {
  const fields = [
    { var: 'intro', label: 'Intro', type: 'textarea' },
    { var: 'title', label: 'Title', type: 'text' },
    { var: 'heading', label: 'Heading', type: 'text' },
  ];
  const heading = caret('<h1>{{ title }}</h1>\n<h2>|</h2>');

  assert.deepEqual(ids(helpSuggestions(heading.html, heading.at, { fields })).slice(0, 2), ['text:heading', 'text:title']);

  const paragraph = caret('<h1>{{ title }}</h1>\n<p>|</p>');

  assert.deepEqual(ids(helpSuggestions(paragraph.html, paragraph.at, { fields })).slice(0, 2), ['text:intro', 'text:heading']);
});

test('a <button> takes no Bard or Markdown', () => {
  const { html, at } = caret('<button>|</button>');
  const fields = [
    { var: 'label', label: 'Label', type: 'text' },
    { var: 'text', label: 'Text', type: 'bard' },
  ];

  assert.deepEqual(ids(helpSuggestions(html, at, { fields })), ['text:label', 'class', 'id']);
});
