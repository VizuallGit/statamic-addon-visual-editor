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
    blockPartials: { src: 'blocks/{type}', handles: ['headline', 'richtext', 7] },
  });

  assert.deepEqual(ctx.blockPartials, { src: 'blocks/{type}', handles: ['headline', 'richtext'] });
  assert.equal(hasBlockPartial(ctx, 'richtext'), true);
  assert.equal(hasBlockPartial(ctx, 'hero'), false);
  assert.equal(blockPartialSrc(ctx, 'richtext'), 'blocks/richtext');

  const none = buildContext(html, at, { rows: [], blocks: [], blockPartials: null });
  assert.deepEqual(none.blockPartials, { src: '', handles: [] });
  assert.equal(hasBlockPartial(none, 'richtext'), false);
});

test('blockPartials(win): what PHP hands over, or nothing from an older PHP', () => {
  const win = (value) => ({ Statamic: { $config: { get: (key) => (key === 'sveBlockPartials' ? value : undefined) } } });

  assert.deepEqual(blockPartials(win({ src: 'blocks/{type}', handles: ['links'] })), { src: 'blocks/{type}', handles: ['links'] });
  assert.deepEqual(blockPartials(win(undefined)), { src: '', handles: [] });
  assert.deepEqual(blockPartials({}), { src: '', handles: [] });
});

test('help-rules/index.js: the rules in the order their rows show, the id last', () => {
  assert.deepEqual(RULES.map((rule) => rule.name), ['sectionRule', 'listRule', 'textRule', 'classRule']);
  assert.deepEqual(TAIL_RULES.map((rule) => rule.name), ['idRule']);
});
