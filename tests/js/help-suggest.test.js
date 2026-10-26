/**
 * Contract tests for dock/help-suggest.js — what help mode offers to write at
 * one spot in a template, and exactly what each suggestion writes.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { HELP_MAX, helpSuggestions, shiftSuggestion } from '../../resources/js/dock/help-suggest.js';
import { HEAD_RULES, ONLY_RULES, RULES, TAIL_RULES, runRules } from '../../resources/js/dock/help-rules/index.js';
import { buildContext } from '../../resources/js/dock/help-rules/context.js';

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

const byId = (list, id) => list.find((item) => item.id === id);

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
    { var: 'intro', label: 'Intro', type: 'text' },
  ];

  assert.deepEqual(ids(helpSuggestions(html, at, { fields })).slice(1, 3), ['text:intro', 'text:title']);
});

test('<ul> over a grid: the list, its rows and their fields', () => {
  const { html, at } = caret('<ul>|</ul>');
  const loop = byId(helpSuggestions(html, at, { fields: GRID }), 'loop:items');

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
  const loop = byId(helpSuggestions(html, at, { fields: GRID }), 'loop:items');
  const out = apply(html, loop);

  assert.ok(out.includes('    </ul>\n    <p>Below</p>\n</div>'), out);
});

test('inside a loop, the loop’s own fields — in a heading, its text field alone', () => {
  const { html, at } = caret('{{ items }}\n    <h3>|</h3>\n{{ /items }}');
  const suggestions = helpSuggestions(html, at, { fields: [{ var: 'heading', label: 'Heading', type: 'text' }, ...GRID] });

  assert.deepEqual(ids(suggestions), ['class', 'text:title']);
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
  const inFile = byId(helpSuggestions(file, offset + 2, { fields }), 'text:title');
  const inPane = shiftSuggestion(inFile, offset);

  assert.equal(apply(pane, inPane), '<p {{ visual_edit field="title" inline_edit="true" }}>{{ title }}</p>');
  assert.equal(inPane.selection, inFile.selection - offset);
  assert.equal(shiftSuggestion(inFile, 0), inFile, 'the whole file in the pane: nothing to move');

  // The loop's address stays the file's: it is looked up again there.
  const loop = { id: 'loop-ask', changes: [], selection: null, loop: { from: 40 } };

  assert.equal(shiftSuggestion(loop, 10).loop.from, 40);
  assert.equal(shiftSuggestion(loop, 10).selection, null);
});

test('never more than the popup shows between the class, always first, and the id, always last — and nothing for a caret outside markup', () => {
  const { html, at } = caret('<img|>');
  const fields = ['a', 'b', 'c', 'd'].map((name) => ({ var: name, label: name, type: 'assets' }));
  const suggestions = helpSuggestions(html, at, { fields });

  assert.equal(suggestions.length, 1 + HELP_MAX + 1);
  assert.equal(suggestions[0].id, 'class');
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
  assert.deepEqual(ids(helpSuggestions(root.html, root.at, { sectionPartial: true, shellRoot: SCAFFOLD })), ['shell', 'x-data']);
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

test('the registry: the middle fills the cap in order — or by counts — and sees what came before; the head stands first and the tail last, outside the cap', () => {
  const ctx = { node: { tag: 'x' } };
  const row = (id) => ({ id, key: 'k', args: {}, meta: '', changes: [], selection: null });
  const rules = [
    () => [row('a'), row('b')],
    (_, offered) => (offered.some((item) => item.id === 'a') ? [row('c')] : []),
    () => [row('d'), null],
  ];
  const head = [(_, offered) => [row(`head:${offered.length}`)]];
  const tail = [(_, offered) => [row(`tail:${offered.length}`)]];
  const lists = { only: [], head, rules, tail };

  assert.deepEqual(ids(runRules(ctx, 3, {}, lists)), ['head:3', 'a', 'b', 'c', 'tail:4']);
  assert.deepEqual(ids(runRules(ctx, 10, {}, lists)), ['head:4', 'a', 'b', 'c', 'd', 'tail:5']);
  assert.deepEqual(ids(runRules(ctx, 3, { x: { d: 2, b: 1 } }, lists)), ['head:3', 'd', 'b', 'a', 'tail:4']);

  // A rule of its own tag answers alone.
  assert.deepEqual(ids(runRules(ctx, 3, {}, { ...lists, only: [() => [row('alone')]] })), ['alone']);
});

test('help-rules/index.js: the rules in the order their rows show — the class first, the id last', () => {
  assert.deepEqual(ONLY_RULES.map((rule) => rule.name), ['ifTagRule']);
  assert.deepEqual(HEAD_RULES.map((rule) => rule.name), ['classRule']);
  assert.deepEqual(RULES.map((rule) => rule.name), [
    'sectionRule',
    'visualEditRule',
    'blocksRule',
    'linkRule',
    'listRule',
    'textRule',
    'alpineRule',
    'sourceRule',
    'imgRule',
  ]);
  assert.deepEqual(TAIL_RULES.map((rule) => rule.name), ['idRule']);
});

/* ---- section -------------------------------------------------------------- */

test('no blocks wrapper and no loop on the section — before its shell, with markup inside, partials on the site or not', () => {
  const options = { fields: BLOCKS, sectionPartial: true, shellRoot: SCAFFOLD };
  const bare = caret('<section>|</section>');

  assert.deepEqual(ids(helpSuggestions(bare.html, bare.at, options)), ['shell', 'x-data']);

  const full = caret('<section id="id-{{ id }}" class="">\n    <h2>Hej</h2>|\n</section>');

  assert.deepEqual(ids(helpSuggestions(full.html, full.at, options)), ['x-data']);

  const shelled = caret('<section id="id-{{ id }}" class="">|</section>');

  assert.deepEqual(ids(helpSuggestions(shelled.html, shelled.at, options)), ['x-data']);
  assert.deepEqual(ids(helpSuggestions(shelled.html, shelled.at, { ...options, fields: GRID })), ['x-data'], 'no loop directly under a section');
});

/* ---- div ------------------------------------------------------------------ */

test('an empty <div> over a replicator: the div is the wrapper, its rows <div>s, each set its fields — no partial where the site has them', () => {
  const { html, at } = caret('    <div class="content">|</div>');
  const suggestions = helpSuggestions(html, at, { fields: BLOCKS });

  assert.deepEqual(ids(suggestions), ['visual-edit', 'loop:blocks', 'id']);

  const loop = byId(suggestions, 'loop:blocks');
  const out = apply(html, loop);

  assert.equal(loop.key, 'code_dock_help_loop');
  assert.equal(
    out,
    [
      '    <div class="content" {{ visual_edit field="blocks" outline_inside="true" insertable="true" }}>',
      '        {{ blocks }}',
      '            <div class="" {{ visual_edit orderable="true" }}>',
      "                {{ if type == 'headline' }}",
      '                    <h3 {{ visual_edit field="title" inline_edit="true" }}>{{ title }}</h3>',
      "                {{ elseif type == 'richtext' }}",
      '                    <div {{ visual_edit field="text" inline_edit="true" }}>{{ text }}</div>',
      "                {{ elseif type == 'links' }}",
      '                    {{ links }}',
      '                        <p {{ visual_edit field="text" inline_edit="true" }}>{{ text }}</p>',
      '                    {{ /links }}',
      '                {{ /if }}',
      '            </div>',
      '        {{ /blocks }}',
      '    </div>',
    ].join('\n')
  );
  assert.ok(out.slice(0, loop.selection).endsWith('{{ blocks }}\n            <div class="" {{ visual_edit orderable="true" }}>'));
});

test('a replicator on a <div>: every set field by field, the same with the site’s partials or without', () => {
  const { html, at } = caret('<div>|</div>');
  const loop = byId(helpSuggestions(html, at, { fields: MIXED_SETS }), 'loop:content');
  const out = apply(html, loop);

  assert.equal(
    out,
    [
      '<div class="" {{ visual_edit field="content" outline_inside="true" insertable="true" }}>',
      '    {{ content }}',
      '        <div class="" {{ visual_edit orderable="true" }}>',
      "            {{ if type == 'headline' }}",
      '                <h3 {{ visual_edit field="title" inline_edit="true" }}>{{ title }}</h3>',
      "            {{ elseif type == 'quote' }}",
      '                <p {{ visual_edit field="quote" inline_edit="true" }}>{{ quote }}</p>',
      '                <p {{ visual_edit field="author" inline_edit="true" }}>{{ author }}</p>',
      '            {{ /if }}',
      '        </div>',
      '    {{ /content }}',
      '</div>',
    ].join('\n')
  );
  assert.equal(apply(html, byId(helpSuggestions(html, at, { fields: MIXED_SETS }), 'loop:content')), out);
});

test('an empty <div> over a grid: rows of <div>s, the way the list writes <li>s', () => {
  const { html, at } = caret('<div>|</div>');
  const suggestions = helpSuggestions(html, at, { fields: GRID });

  assert.deepEqual(ids(suggestions), ['class', 'visual-edit', 'loop:items', 'id']);

  const loop = byId(suggestions, 'loop:items');
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

test('a replicator inside a <div>’s rows: the loops inside are written field by field too', () => {
  const { html, at } = caret('<div>|</div>');
  const loop = byId(helpSuggestions(html, at, { fields: FEATURE_LIST }), 'loop:list');

  assert.equal(loop.key, 'code_dock_help_loop');
  assert.equal(
    apply(html, loop),
    [
      '<div class="" {{ visual_edit field="list" outline_inside="true" insertable="true" }}>',
      '    {{ list }}',
      '        <div class="" {{ visual_edit orderable="true" }}>',
      '            {{ blocks }}',
      "                {{ if type == 'title' }}",
      '                    <h3 {{ visual_edit field="title" inline_edit="true" }}>{{ title }}</h3>',
      "                {{ elseif type == 'text' }}",
      '                    <div {{ visual_edit field="text" inline_edit="true" }}>{{ text }}</div>',
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

  assert.deepEqual(ids(suggestions), ['class', 'visual-edit', 'text:text', 'id']);

  const text = byId(suggestions, 'text:text');

  assert.equal(text.key, 'code_dock_help_add_field');
  assert.equal(apply(html, text), '<div {{ visual_edit field="text" }}>{{ text }}</div>');

  const fixed = caret('<div>Lorem| ipsum</div>');

  assert.deepEqual(ids(helpSuggestions(fixed.html, fixed.at, { fields: fields.slice(0, 2) })), ['class', 'visual-edit', 'id']);
});

test('no file row on a <div> — files belong to img and video', () => {
  const { html, at } = caret('<div>|</div>');

  assert.deepEqual(ids(helpSuggestions(html, at, { fields: MEDIA })), ['class', 'visual-edit', 'id']);
});

test('an <img> stays an <img>: its sources, never a partial', () => {
  const img = caret('<img|>');
  const suggestions = helpSuggestions(img.html, img.at, { fields: MEDIA });

  assert.deepEqual(ids(suggestions), ['class', 'img-src:media', 'src', 'alt', 'id']);
  assert.ok(suggestions.every((item) => item.changes.every((change) => !change.insert.includes('partial'))));
});

test('a <div>: visual_edit, its loops, then Bard — no image; the class first, the id last', () => {
  const { html, at } = caret('<div>|</div>');
  const fields = [{ var: 'body', label: 'Body', type: 'bard' }, ...MEDIA, ...GRID];

  assert.deepEqual(ids(helpSuggestions(html, at, { fields })), ['class', 'visual-edit', 'loop:items', 'text:body', 'id']);
});

test('a <div> inside the blocks loop: what the sets hold that fits a div', () => {
  const { html, at } = caret('{{ blocks }}\n    <div>|</div>\n{{ /blocks }}');

  assert.deepEqual(ids(helpSuggestions(html, at, { fields: BLOCKS })), ['class', 'visual-edit', 'loop:links', 'text:text']);
});

test('no loop or text on a <div> that holds markup, or inside a collection loop', () => {
  const fields = [{ var: 'body', label: 'Body', type: 'bard' }, ...MEDIA, ...GRID];
  const full = caret('<div>\n    <p>Hej</p>|\n</div>');

  assert.deepEqual(ids(helpSuggestions(full.html, full.at, { fields })), ['class', 'visual-edit', 'id']);

  const loop = caret('{{ collection:services }}\n    <div>|</div>\n{{ /collection:services }}');

  assert.deepEqual(ids(helpSuggestions(loop.html, loop.at, { fields: [...fields, ...BLOCKS] })), ['class', 'visual-edit']);
});

/* ---- ul / ol / li --------------------------------------------------------- */

test('<ol> over a replicator: each <li> holds its set’s fields, a branch per set — no partial where the site has them', () => {
  const { html, at } = caret('<ol>|</ol>');
  const loop = byId(helpSuggestions(html, at, { fields: BLOCKS }), 'loop:blocks');

  assert.equal(loop.key, 'code_dock_help_loop');
  assert.equal(
    apply(html, loop),
    [
      '<ol class="" {{ visual_edit field="blocks" outline_inside="true" insertable="true" }}>',
      '    {{ blocks }}',
      '        <li class="" {{ visual_edit orderable="true" }}>',
      "            {{ if type == 'headline' }}",
      '                <h3 {{ visual_edit field="title" inline_edit="true" }}>{{ title }}</h3>',
      "            {{ elseif type == 'richtext' }}",
      '                <div {{ visual_edit field="text" inline_edit="true" }}>{{ text }}</div>',
      "            {{ elseif type == 'links' }}",
      '                {{ links }}',
      '                    <p {{ visual_edit field="text" inline_edit="true" }}>{{ text }}</p>',
      '                {{ /links }}',
      '            {{ /if }}',
      '        </li>',
      '    {{ /blocks }}',
      '</ol>',
    ].join('\n')
  );
});

test('feature_list_icons with the site’s block partials: the same list as without them', () => {
  const { html, at } = caret('    <ul class="[ list ] wrapper">|</ul>');
  const [housed] = helpSuggestions(html, at, { fields: FEATURE_LIST });
  const [plain] = helpSuggestions(html, at, { fields: FEATURE_LIST });

  assert.equal(housed.id, 'loop:list');
  assert.equal(apply(html, housed), apply(html, plain));
});

test('an empty <li> in a loop whose row holds a replicator: a wrapper <div> inside it, its sets field by field', () => {
  const { html, at } = caret('<ul>\n    {{ list }}\n        <li>|</li>\n    {{ /list }}\n</ul>');
  const suggestions = helpSuggestions(html, at, { fields: FEATURE_LIST });

  assert.deepEqual(ids(suggestions), ['class', 'loop:blocks']);
  assert.equal(suggestions[1].key, 'code_dock_help_loop');
  assert.equal(
    apply(html, suggestions[1]),
    [
      '<ul>',
      '    {{ list }}',
      '        <li>',
      '            <div class="" {{ visual_edit field="blocks" outline_inside="true" insertable="true" }}>',
      '                {{ blocks }}',
      '                    <div class="" {{ visual_edit orderable="true" }}>',
      "                        {{ if type == 'title' }}",
      '                            <h3 {{ visual_edit field="title" inline_edit="true" }}>{{ title }}</h3>',
      "                        {{ elseif type == 'text' }}",
      '                            <div {{ visual_edit field="text" inline_edit="true" }}>{{ text }}</div>',
      '                        {{ /if }}',
      '                    </div>',
      '                {{ /blocks }}',
      '            </div>',
      '        </li>',
      '    {{ /list }}',
      '</ul>',
    ].join('\n')
  );
  assert.deepEqual(helpSuggestions(html, at, { fields: FEATURE_LIST }), suggestions, 'the same without block partials');
});

test('an <li> outside a loop is static: no text from a field — inside one it takes the loop’s', () => {
  const outside = caret('<ul>\n    <li>|</li>\n</ul>');

  assert.deepEqual(ids(helpSuggestions(outside.html, outside.at, { fields: [{ var: 'title', label: 'Title', type: 'text' }] })), [
    'class',
    'id',
  ]);

  const inside = caret('<ul>\n    {{ items }}\n        <li>|</li>\n    {{ /items }}\n</ul>');

  assert.deepEqual(ids(helpSuggestions(inside.html, inside.at, { fields: GRID })), ['class', 'text:title', 'text:text']);
});

/* ---- a -------------------------------------------------------------------- */

test('an empty <a> where a link field prints: its URL row, «Add a URL» beside it, the text from a text field', () => {
  const { html, at } = caret('{{ blocks }}\n    {{ links }}\n        <a>|</a>\n    {{ /links }}\n{{ /blocks }}');
  const suggestions = helpSuggestions(html, at, { fields: BLOCKS });

  assert.deepEqual(ids(suggestions), ['class', 'url:url', 'href', 'text:text']);

  const link = byId(suggestions, 'url:url');
  const out = apply(html, link);

  assert.equal(link.key, 'code_dock_help_url');
  assert.deepEqual(link.args, { name: 'URL' });
  assert.equal(out, '{{ blocks }}\n    {{ links }}\n        <a href="{{ url }}"></a>\n    {{ /links }}\n{{ /blocks }}');
  assert.equal(out.slice(link.selection, link.selection + 4), '</a>');
});

test('a link field and no text field: the <a> keeps its class and stays empty, the caret inside it', () => {
  const { html, at } = caret('<a class="btn">|</a>');
  const suggestions = helpSuggestions(html, at, { fields: [{ var: 'url', label: 'URL', type: 'link' }] });

  assert.deepEqual(ids(suggestions), ['url:url', 'href', 'id']);

  const out = apply(html, suggestions[0]);

  assert.equal(out, '<a href="{{ url }}" class="btn"></a>');
  assert.equal(out.slice(suggestions[0].selection), '</a>');
});

test('no URL row on an <a> that has an href; one that holds text still gets it', () => {
  const fields = [{ var: 'url', label: 'URL', type: 'link' }];
  const has = caret('<a href="/kontakt">|</a>');

  assert.deepEqual(ids(helpSuggestions(has.html, has.at, { fields })), ['class', 'id']);

  const text = caret('<a>Læs mere|</a>');

  assert.deepEqual(ids(helpSuggestions(text.html, text.at, { fields })), ['class', 'url:url', 'href', 'id']);
});

test('an empty <a> in a links set: no links block — an href and a text field', () => {
  const { html, at } = caret("{{ blocks }}\n    {{ if type == 'links' }}\n        <a class=\"btn\">|</a>\n    {{ /if }}\n{{ /blocks }}");
  const suggestions = helpSuggestions(html, at, { fields: BLOCKS });

  assert.deepEqual(ids(suggestions), ['href', 'text:title']);
  assert.ok(suggestions.every((item) => item.changes.every((change) => !change.insert.includes('partial'))));
});

test('an <a> without href and no link field: href="" after the class row, the caret between the quotes', () => {
  const { html, at } = caret('<a|>Kontakt</a>');
  const suggestions = helpSuggestions(html, at);

  assert.deepEqual(ids(suggestions), ['class', 'href', 'id']);

  const href = byId(suggestions, 'href');
  const out = apply(html, href);

  assert.equal(href.key, 'code_dock_help_add_url');
  assert.equal(out, '<a href="">Kontakt</a>');
  assert.equal(out.slice(href.selection - 6, href.selection + 1), 'href=""');
});

/* ---- img ------------------------------------------------------------------ */

test('an <img> where a file field prints: it stays an <img>, its static class kept; no file rows in a collection loop', () => {
  const { html, at } = caret('<img class="w-full h-full object-cover"|>');
  const suggestions = helpSuggestions(html, at, { fields: MEDIA });

  assert.deepEqual(ids(suggestions), ['img-src:media', 'src', 'alt', 'id']);

  const out = apply(html, suggestions[0]);

  assert.equal(suggestions[0].key, 'code_dock_help_source');
  assert.equal(out, '<img src="{{ media:url }}" class="w-full h-full object-cover" {{ visual_edit field="media" }}>');
  assert.equal(suggestions[0].selection, out.length);

  const sourced = caret('<img src="{{ url }}" class="{{ klass }}"|>');

  assert.deepEqual(ids(helpSuggestions(sourced.html, sourced.at, { fields: MEDIA })), ['alt', 'lazy', 'id']);

  const loop = caret('{{ collection:news }}\n    <img|>\n{{ /collection:news }}');

  assert.deepEqual(ids(helpSuggestions(loop.html, loop.at, { fields: MEDIA })), ['class', 'src', 'alt', 'lazy']);
});

test('an <img> without src: src, alt and lazy loading as rows of their own — only the ones missing, the caret in src', () => {
  const { html, at } = caret('<img|>');
  const suggestions = helpSuggestions(html, at);

  assert.deepEqual(ids(suggestions), ['class', 'src', 'alt', 'lazy', 'id']);

  const src = byId(suggestions, 'src');
  const out = apply(html, src);

  assert.equal(src.key, 'code_dock_help_src');
  assert.equal(out, '<img src="">');
  assert.equal(out.slice(src.selection - 5, src.selection + 1), 'src=""');

  const some = caret('<img class="logo" alt="Vizuall" loading="eager"|>');
  const left = helpSuggestions(some.html, some.at);

  assert.deepEqual(ids(left), ['src', 'id']);
  assert.equal(apply(some.html, left[0]), '<img src="" class="logo" alt="Vizuall" loading="eager">');
});

test('an <img> with src and no alt: alt="", the caret inside, and lazy loading; only lazy when alt is there', () => {
  const { html, at } = caret('<img src="/logo.svg" class="logo"|>');
  const suggestions = helpSuggestions(html, at);

  assert.deepEqual(ids(suggestions), ['alt', 'lazy', 'id']);

  const out = apply(html, suggestions[0]);

  assert.equal(suggestions[0].key, 'code_dock_help_alt');
  assert.equal(out, '<img alt="" src="/logo.svg" class="logo">');
  assert.equal(out.slice(suggestions[0].selection - 5, suggestions[0].selection + 1), 'alt=""');

  const lazy = apply(html, suggestions[1]);

  assert.equal(lazy, '<img loading="lazy" src="/logo.svg" class="logo">');
  assert.equal(lazy.slice(0, suggestions[1].selection), '<img loading="lazy"');

  const done = caret('<img src="/logo.svg" alt="Logo" class="logo"|>');

  assert.deepEqual(ids(helpSuggestions(done.html, done.at)), ['lazy', 'id']);
});

/* ---- headings, button ----------------------------------------------------- */

test('a heading offers the title-like fields first, a <p> the unused first — neither a textarea', () => {
  const fields = [
    { var: 'intro', label: 'Intro', type: 'textarea' },
    { var: 'title', label: 'Title', type: 'text' },
    { var: 'heading', label: 'Heading', type: 'text' },
  ];
  const heading = caret('<h1>{{ title }}</h1>\n<h2>|</h2>');

  assert.deepEqual(ids(helpSuggestions(heading.html, heading.at, { fields })), ['class', 'text:heading', 'text:title', 'id']);

  const paragraph = caret('<h1>{{ title }}</h1>\n<p>|</p>');

  assert.deepEqual(ids(helpSuggestions(paragraph.html, paragraph.at, { fields })), ['class', 'text:heading', 'text:title', 'id']);
});

test('a <button> takes no Bard or Markdown', () => {
  const { html, at } = caret('<button>|</button>');
  const fields = [
    { var: 'label', label: 'Label', type: 'text' },
    { var: 'text', label: 'Text', type: 'bard' },
  ];

  assert.deepEqual(ids(helpSuggestions(html, at, { fields })), ['class', 'text:label', 'id']);
});
