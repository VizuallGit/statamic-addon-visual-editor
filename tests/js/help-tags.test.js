/**
 * Help mode, tag by tag — the rows of the specification
 * (vizuall-skabelon docs/hjaelp-i-docken-tags.html): the class first, the
 * fields in the middle, the id last; the tag stays the tag it is, and the
 * help never writes a partial or a component.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { HELP_MAX, helpSuggestions } from '../../resources/js/dock/help-suggest.js';
import { runRules } from '../../resources/js/dock/help-rules/index.js';
import { buildContext } from '../../resources/js/dock/help-rules/context.js';
import { findAntlersBlocks } from '../../resources/js/antlers-blocks.js';

/** SectionTypeMaker::scaffold(), as the dock is handed it. */
const SCAFFOLD = [
  '{{# sve-unlocked #}}',
  '<section id="id-{{ id }}" class="" {{ visual_edit outline_inside="true" section_orderable="true" }}>',
  '',
  '</section>',
  '',
].join('\n');

/** The intro section the specification uses: Text (bard), Media (file), Color, Popup Video (file). */
const INTRO = [
  { var: 'text', label: 'Text', type: 'bard' },
  { var: 'media', label: 'Media', type: 'assets' },
  { var: 'color', label: 'Color', type: 'color' },
  { var: 'popup_video', label: 'Popup Video', type: 'assets' },
];

const GRID = [
  { var: 'items', label: 'Items', type: 'grid', loop: true, value: '3 rows' },
  { var: 'title', label: 'Title', type: 'text', parent: 'items' },
  { var: 'text', label: 'Text', type: 'bard', parent: 'items' },
];

const BLOCKS = [
  { var: 'blocks', label: 'Blocks', type: 'replicator', loop: true, value: '2 ×' },
  { var: 'title', label: 'Title', type: 'text', parent: 'blocks › headline' },
  { var: 'text', label: 'Text', type: 'bard', parent: 'blocks › richtext' },
  { var: 'links', label: 'Links', type: 'replicator', loop: true, parent: 'blocks › links' },
  { var: 'url', label: 'URL', type: 'link', parent: 'blocks › links › links › link' },
  { var: 'text', label: 'Text', type: 'text', parent: 'blocks › links › links › link' },
  { var: 'media', label: 'Media', type: 'assets', loop: true, parent: 'blocks › media' },
];


/** One field of each text kind: a line, a textarea, Bard. */
const TEXTS = [
  { var: 'intro', label: 'Intro', type: 'textarea' },
  { var: 'body', label: 'Body', type: 'bard' },
  { var: 'title', label: 'Title', type: 'text' },
  { var: 'label', label: 'Label', type: 'text' },
];

const apply = (html, suggestion) =>
  [...suggestion.changes]
    .sort((a, b) => b.from - a.from)
    .reduce((out, change) => out.slice(0, change.from) + change.insert + out.slice(change.to), html);

const caret = (html, marker = '|') => ({ html: html.replace(marker, ''), at: html.indexOf(marker) });

const ids = (list) => list.map((item) => item.id);

const byId = (list, id) => list.find((item) => item.id === id);

/** What help offers at the caret, as helpSuggestions asks it. */
const help = (marked, options = {}) => {
  const { html, at } = caret(marked);

  return { html, list: helpSuggestions(html, at, options) };
};

/** The rules run directly, so `counts` can be handed in. */
const ranked = (marked, fields, counts) => {
  const { html, at } = caret(marked);
  const ctx = buildContext(html, at, { rows: fields, blocks: findAntlersBlocks(html), sectionPartial: false, shellRoot: '' });

  return ids(runRules(ctx, HELP_MAX, counts));
};

/** Where the caret lands, relative to the text around it. */
const around = (out, suggestion) => [out.slice(0, suggestion.selection), out.slice(suggestion.selection)];

/* ---- Order: class first, id last, the middle by use ----------------------- */

test('the class first and the id last on every tag — the middle capped at three between them', () => {
  const files = ['a', 'b', 'c', 'd'].map((name) => ({ var: name, label: name, type: 'assets' }));
  const { list } = help('<img|>', { fields: files });

  assert.deepEqual(ids(list), ['class', 'img-src:a', 'img-src:b', 'img-src:c', 'id']);
  assert.equal(list[0].after, 'class');

  for (const tag of ['div', 'section', 'ul', 'ol', 'li', 'h1', 'h4', 'p', 'span', 'strong', 'em', 'a', 'video', 'button']) {
    const got = ids(help(`<${tag}|></${tag}>`).list);

    assert.equal(got[0], 'class', tag);
    assert.equal(got.at(-1), 'id', tag);
  }
});

test('counts: the middle by how often a row was taken on that tag; class and id stay where they are', () => {
  const nested = '<div x-data="">\n    <div|></div>\n</div>';
  const fields = [{ var: 'text', label: 'Text', type: 'bard' }];

  assert.deepEqual(ranked(nested, fields), ['class', 'visual-edit', 'text:text', 'x-show', 'id']);
  assert.deepEqual(ranked(nested, fields, { div: { 'x-show': 4, 'text:text': 2 } }), ['class', 'x-show', 'text:text', 'visual-edit', 'id']);
  assert.deepEqual(ranked(nested, fields, { div: { class: 9, id: 9, 'x-show': 1 } }), ['class', 'x-show', 'visual-edit', 'text:text', 'id']);

  // Another tag's counts, none, or something that is not a count: the specification's order.
  for (const counts of [{ img: { 'x-show': 9 } }, {}, undefined, null, { div: null }, { div: { 'x-show': 'many' } }]) {
    assert.deepEqual(ranked(nested, fields, counts), ['class', 'visual-edit', 'text:text', 'x-show', 'id'], JSON.stringify(counts));
  }
});

test('counts: a row past the cap rises into it', () => {
  const fields = INTRO.filter((row) => row.type === 'assets');

  assert.deepEqual(ranked('<img|>', fields), ['class', 'img-src:media', 'img-src:popup_video', 'src', 'id']);
  assert.deepEqual(ranked('<img|>', fields, { img: { lazy: 3, 'img-src:popup_video': 1 } }), ['class', 'lazy', 'img-src:popup_video', 'img-src:media', 'id']);
});

/* ---- section -------------------------------------------------------------- */

test('section with its shell: x-data, and no wrapper, loop or partial inside it', () => {
  const marked = SCAFFOLD.replace('>\n\n</section>', '>\n|\n</section>');

  for (const fields of [BLOCKS, GRID, INTRO]) {
    const { html, list } = help(marked, { fields, sectionPartial: true, shellRoot: SCAFFOLD });

    assert.deepEqual(ids(list), ['x-data']);

    const out = apply(html, list[0]);
    const [before, after] = around(out, list[0]);

    assert.equal(list[0].key, 'code_dock_help_attr');
    assert.deepEqual(list[0].args, { attr: 'x-data' });
    assert.ok(
      out.includes('<section id="id-{{ id }}" class="" x-data="" {{ visual_edit outline_inside="true" section_orderable="true" }}>')
    );
    assert.ok(before.endsWith('x-data="') && after.startsWith('"'));
  }
});

test('section: x-data right after the name without a class; none when it has one', () => {
  const { html, list } = help('<section|>\n</section>');

  assert.deepEqual(ids(list), ['class', 'x-data', 'id']);
  assert.equal(apply(html, byId(list, 'x-data')), '<section x-data="">\n</section>');

  assert.deepEqual(ids(help('<section x-data|>\n</section>').list), ['class', 'id']);
  assert.deepEqual(ids(help('<section class="py-800" x-data="{ open: false }"|>\n</section>').list), ['id']);
});

/* ---- div ------------------------------------------------------------------ */

test('div: class, visual_edit, the Bard field, id — no file, colour or line of text', () => {
  const lines = TEXTS.filter((row) => row.type !== 'bard');
  const { list } = help('<div|>\n</div>', { fields: [...INTRO, ...lines] });

  assert.deepEqual(ids(list), ['class', 'visual-edit', 'text:text', 'id']);
  assert.ok(list.every((item) => item.changes.every((change) => !change.insert.includes('partial') && !change.insert.includes('<img'))));
});

test('«Add visual_edit»: {{ visual_edit }} in front of the >, the caret right before its }}', () => {
  const { html, list } = help('<div|>\n</div>');
  const edit = byId(list, 'visual-edit');
  const out = apply(html, edit);
  const [before, after] = around(out, edit);

  assert.equal(out, '<div {{ visual_edit }}>\n</div>');
  assert.equal(before, '<div {{ visual_edit ');
  assert.ok(after.startsWith('}}>'));
  assert.equal(edit.after, 'visual-edit');
  assert.equal(edit.key, 'code_dock_help_attr');
  assert.deepEqual(edit.args, { attr: 'visual_edit' });

  const klass = help('<div class="box"|></div>');

  assert.equal(apply(klass.html, byId(klass.list, 'visual-edit')), '<div class="box" {{ visual_edit }}></div>');
  assert.ok(!ids(help('<div {{ visual_edit field="text" }}|></div>').list).includes('visual-edit'));
});

test('«Add Text?»: the Bard field in the div, pointed at by visual_edit', () => {
  const { html, list } = help('<div>|</div>', { fields: INTRO });
  const text = byId(list, 'text:text');

  assert.equal(text.key, 'code_dock_help_add_field');
  assert.deepEqual(text.args, { name: 'Text' });
  assert.equal(apply(html, text), '<div {{ visual_edit field="text" }}>{{ text }}</div>');
  assert.ok(around(apply(html, text), text)[0].endsWith('{{ text }}'));
});

test('x-show on a div only inside an element that has x-data — the caret between the quotes', () => {
  const { html, list } = help('<section x-data>\n    <div>\n        <div class="panel"|></div>\n    </div>\n</section>');
  const show = byId(list, 'x-show');
  const out = apply(html, show);
  const [before, after] = around(out, show);

  assert.deepEqual(show.args, { attr: 'x-show' });
  assert.ok(out.includes('<div class="panel" x-show=""></div>'));
  assert.ok(before.endsWith('x-show="') && after.startsWith('"'));

  assert.ok(!ids(help('<div>\n    <div|></div>\n</div>').list).includes('x-show'), 'no x-data around it');
  assert.ok(!ids(help('<div x-data|></div>').list).includes('x-show'), 'its own x-data is not around it');
  assert.ok(!ids(help('<div x-data>\n    <div x-show="open"|></div>\n</div>').list).includes('x-show'), 'it has one');
});

/* ---- ul, ol, li ----------------------------------------------------------- */

test('a list is the loop with its fields — the same with or without the site’s partials, and no line of text', () => {
  for (const fields of [BLOCKS, GRID]) {
    const plain = help('<ol>|</ol>', { fields });
    const housed = help('<ol>|</ol>', { fields });
    const loop = plain.list.find((item) => item.id.startsWith('loop:'));

    assert.equal(apply(plain.html, loop), apply(housed.html, housed.list.find((item) => item.id === loop.id)));
    assert.ok(!apply(plain.html, loop).includes('partial'));
  }

  assert.deepEqual(ids(help('<ul|></ul>', { fields: [{ var: 'title', label: 'Title', type: 'text' }] }).list), ['class', 'id']);
});

/* ---- h1–h6, p, span, strong, em ------------------------------------------- */

test('h1–h6 alike: text fields only, the title-like first — no Bard, no textarea', () => {
  for (const tag of ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']) {
    assert.deepEqual(ids(help(`<${tag}>|</${tag}>`, { fields: TEXTS }).list), ['class', 'text:title', 'text:label', 'id'], tag);
  }
});

test('span, strong, em: text fields only; a <p> takes Bard too, and turns into a div for it', () => {
  for (const tag of ['span', 'strong', 'em']) {
    assert.deepEqual(ids(help(`<${tag}>|</${tag}>`, { fields: TEXTS }).list), ['class', 'text:title', 'text:label', 'id'], tag);
  }

  const { html, list } = help('<p>|</p>', { fields: TEXTS });

  assert.deepEqual(ids(list), ['class', 'text:body', 'text:title', 'id']);
  assert.equal(apply(html, list[1]), '<div {{ visual_edit field="body" inline_edit="true" }}>{{ body }}</div>');
});

/* ---- a -------------------------------------------------------------------- */

const LINK_FIELDS = [
  { var: 'url', label: 'URL', type: 'link', value: '/kontakt' },
  { var: 'title', label: 'Title', type: 'text' },
  { var: 'intro', label: 'Intro', type: 'textarea' },
  { var: 'body', label: 'Body', type: 'bard' },
];

test('a: «Use URL as the URL», «Add a URL» beside it, the text from a text field', () => {
  const { html, list } = help('<a|></a>', { fields: LINK_FIELDS });

  assert.deepEqual(ids(list), ['class', 'url:url', 'href', 'text:title', 'id']);

  const url = byId(list, 'url:url');
  const out = apply(html, url);

  assert.equal(url.key, 'code_dock_help_url');
  assert.deepEqual(url.args, { name: 'URL' });
  assert.equal(url.meta, '/kontakt');
  assert.equal(out, '<a href="{{ url }}"></a>');
  assert.equal(around(out, url)[1], '</a>', 'the caret inside the link');

  const href = byId(list, 'href');
  const empty = apply(html, href);
  const [before, after] = around(empty, href);

  assert.equal(href.key, 'code_dock_help_add_url');
  assert.equal(empty, '<a href=""></a>');
  assert.ok(before.endsWith('href="') && after.startsWith('"'));
});

test('a: one URL row per link field and for a field named url; that one is not link text', () => {
  const fields = [
    { var: 'cta', label: 'Button', type: 'link' },
    { var: 'url', label: 'URL', type: 'text' },
    { var: 'title', label: 'Title', type: 'text' },
  ];

  assert.deepEqual(ids(help('<a class="btn"|>Læs mere</a>', { fields }).list), ['url:cta', 'url:url', 'href', 'id']);
  assert.deepEqual(ids(help('<a class="btn">|</a>', { fields: fields.slice(1) }).list), ['url:url', 'href', 'text:title', 'id']);
});

test('a: with an href, the text alone — and never the links block', () => {
  const { html, list } = help('<a href="{{ url }}">|</a>', { fields: LINK_FIELDS });

  assert.deepEqual(ids(list), ['class', 'text:title', 'id']);
  assert.equal(apply(html, list[1]), '<a href="{{ url }}" {{ visual_edit field="title" inline_edit="true" }}>{{ title }}</a>');

  const links = help("{{ blocks }}\n    {{ if type == 'links' }}\n        <a class=\"btn\">|</a>\n    {{ /if }}\n{{ /blocks }}", { fields: BLOCKS });

  assert.ok(links.list.every((item) => item.changes.every((change) => !change.insert.includes('partial'))));
});

/* ---- img, video ----------------------------------------------------------- */

test('img stays an img: one source row per file field — src from its url, visual_edit on the field', () => {
  const { html, list } = help('<img|>', { fields: INTRO });

  assert.deepEqual(ids(list), ['class', 'img-src:media', 'img-src:popup_video', 'src', 'id']);

  const media = byId(list, 'img-src:media');

  assert.equal(media.key, 'code_dock_help_source');
  assert.deepEqual(media.args, { name: 'Media' });
  assert.equal(apply(html, media), '<img src="{{ media:url }}" {{ visual_edit field="media" }}>');
  assert.equal(media.selection, apply(html, media).length);

  const klass = help('<img class="w-full h-full object-cover"|>', { fields: INTRO });

  assert.equal(
    apply(klass.html, byId(klass.list, 'img-src:media')),
    '<img src="{{ media:url }}" class="w-full h-full object-cover" {{ visual_edit field="media" }}>'
  );
});

test('img: «Add a source», «Alt text» and «Lazy loading» are rows of their own, only for what is missing', () => {
  const bare = help('<img|>');

  assert.deepEqual(ids(bare.list), ['class', 'src', 'alt', 'lazy', 'id']);

  const src = apply(bare.html, byId(bare.list, 'src'));
  const [before, after] = around(src, byId(bare.list, 'src'));

  assert.equal(src, '<img src="">');
  assert.ok(before.endsWith('src="') && after.startsWith('"'));
  assert.equal(byId(bare.list, 'src').key, 'code_dock_help_src');

  const sourced = help('<img src="{{ media:url }}" {{ visual_edit field="media" }}|>', { fields: INTRO });

  assert.deepEqual(ids(sourced.list), ['class', 'alt', 'lazy', 'id']);
  assert.equal(apply(sourced.html, byId(sourced.list, 'alt')), '<img alt="" src="{{ media:url }}" {{ visual_edit field="media" }}>');
  assert.equal(apply(sourced.html, byId(sourced.list, 'lazy')), '<img loading="lazy" src="{{ media:url }}" {{ visual_edit field="media" }}>');
  assert.equal(byId(sourced.list, 'lazy').key, 'code_dock_help_lazy');

  assert.deepEqual(ids(help('<img src="/a.jpg" alt loading="eager"|>').list), ['class', 'id']);
});

test('video stays a video: the same source rows, no alt and no lazy', () => {
  const { html, list } = help('<video|></video>', { fields: INTRO });

  assert.deepEqual(ids(list), ['class', 'video-src:media', 'video-src:popup_video', 'src', 'id']);
  assert.equal(
    apply(html, byId(list, 'video-src:popup_video')),
    '<video src="{{ popup_video:url }}" {{ visual_edit field="popup_video" }}></video>'
  );
  assert.deepEqual(ids(help('<video src="/film.mp4"|></video>').list), ['class', 'id']);
});

/* ---- button --------------------------------------------------------------- */

test('button: text from a text field; @click only inside x-data, the caret between the quotes', () => {
  const { html, list } = help('<div x-data>\n    <button class="btn">|</button>\n</div>', { fields: TEXTS });

  assert.deepEqual(ids(list), ['text:title', 'text:label', '@click', 'id']);

  const click = byId(list, '@click');
  const out = apply(html, click);
  const [before, after] = around(out, click);

  assert.deepEqual(click.args, { attr: '@click' });
  assert.ok(out.includes('<button class="btn" @click=""></button>'));
  assert.ok(before.endsWith('@click="') && after.startsWith('"'));

  assert.deepEqual(ids(help('<button>|</button>', { fields: TEXTS }).list), ['class', 'text:title', 'text:label', 'id'], 'no x-data around it');
  assert.ok(!ids(help('<div x-data>\n    <button x-on:click="open = true"|></button>\n</div>').list).includes('@click'));
});

/* ---- if ------------------------------------------------------------------- */

test('on {{ if }}: the fields that print here, «If Text» … — and nothing else', () => {
  const { html, list } = help('<div class="intro">\n    {{ i|f }}\n</div>', { fields: INTRO });

  assert.deepEqual(ids(list), ['if:text', 'if:media', 'if:color', 'if:popup_video']);
  assert.equal(list[1].key, 'code_dock_help_if');
  assert.deepEqual(list[1].args, { name: 'Media' });

  const out = apply(html, list[1]);
  const [before, after] = around(out, list[1]);

  assert.equal(out, '<div class="intro">\n    {{ if media }}\n        \n    {{ /if }}\n</div>');
  assert.ok(before.endsWith('{{ if media }}\n        '));
  assert.ok(after.startsWith('\n    {{ /if }}'), 'the caret on the line between');

  // The caret right after the tag, as just typed, is on it too.
  assert.deepEqual(ids(help('<div>{{ if }}|</div>', { fields: INTRO }).list), ['if:text', 'if:media', 'if:color', 'if:popup_video']);
});

test('{{ if }} that already closes gets its condition, not a second {{ /if }}; inside a loop, the loop’s fields', () => {
  const closed = help('<div>\n    {{ if| }}\n        <p>Hej</p>\n    {{ /if }}\n</div>', { fields: INTRO });

  assert.equal(apply(closed.html, closed.list[0]), '<div>\n    {{ if text }}\n        <p>Hej</p>\n    {{ /if }}\n</div>');

  assert.deepEqual(ids(help('<ul>\n    {{ items }}\n        <li>{{ i|f }}</li>\n    {{ /items }}\n</ul>', { fields: GRID }).list), ['if:title', 'if:text']);
});

test('no if rows on an if with a condition, an elseif, or an {{ if }} inside an attribute', () => {
  const rowsOf = (marked) => ids(help(marked, { fields: INTRO }).list).filter((id) => id.startsWith('if:'));

  assert.deepEqual(rowsOf('<div>{{ if te|xt }}{{ /if }}</div>'), []);
  assert.deepEqual(rowsOf('<div>{{ if text }}{{ else|if }}{{ /if }}</div>'), []);
  assert.deepEqual(rowsOf('<div class="{{ i|f }}"></div>'), []);
});
