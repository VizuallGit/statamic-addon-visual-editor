/**
 * build-mode/canvas-paint.js — the open section as Build's canvas paints it.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  CANVAS_EMPTY,
  CANVAS_PATH,
  CANVAS_ROOT,
  ISLAND_WAIT,
  attrRendered,
  fieldLookup,
  inertAttr,
  learnTags,
  openTagParts,
  pageClasses,
  paintPlan,
  planTemplate,
  servedImage,
} from '../../../resources/js/build-mode/canvas-paint.js';

const ROW = { id: 'abc123', title: 'Hello', hero: { title: 'Nested' }, empty: null, list: [1, 2] };
const PAGE = { title: 'Page title', slug: 'test-ny' };
const field = fieldLookup(ROW, PAGE);

const TESTT = [
  '{{# sve-unlocked #}}',
  '<section id="id-{{ id }}" class="[ {{ _class }} ]" data-auto-contrast {{ visual_edit outline_inside="true" section_orderable="true" }}>',
  '<h1>fddsfdsfd</h1>',
  '  <p>{{ title }}</p>',
  '</section>',
  '',
].join('\n');

const LOOP = [
  '<section class="py-800">',
  '  <h2 class="text-700">{{ title }}</h2>',
  '  <div class="grid grid-cols-3">',
  '    {{ collection:pages limit="3" }}',
  '      <article class="card"><h3>{{ title }}</h3></article>',
  '    {{ /collection:pages }}',
  '  </div>',
  '  <p>After</p>',
  '</section>',
].join('\n');

test('a field is the row’s first, then the page’s; null is nothing; a list is the server’s', () => {
  assert.equal(field('title'), 'Hello');
  assert.equal(field(' hero.title '), 'Nested');
  assert.equal(field('hero:title'), 'Nested');
  assert.equal(field('slug'), 'test-ny');
  assert.equal(field('empty'), '');
  assert.equal(field('list'), undefined);
  assert.equal(field('_class'), undefined);
  assert.equal(field('title | upper'), undefined);
  assert.equal(field('partial:foo'), undefined);
});

test('an opening tag: its attributes with Antlers kept whole, and Antlers where an attribute would stand', () => {
  const { attrs, loose } = openTagParts('<section id="id-{{ id }}" class="[ {{ _class }} ]" data-auto-contrast {{ visual_edit outline_inside="true" }}>');

  assert.deepEqual(attrs.map((a) => [a.name, a.value]), [
    ['id', 'id-{{ id }}'],
    ['class', '[ {{ _class }} ]'],
    ['data-auto-contrast', null],
  ]);
  assert.equal(loose, true);
  assert.equal(openTagParts('<img src="a.png" alt=\'x\' />').attrs.length, 2);
  assert.equal(openTagParts('<div class="a {{ b }}">').loose, false);
});

test('the section paints from the file: paths on every element, fields filled, the root marked', () => {
  const plan = planTemplate(TESTT, field);
  const { html, waiting } = paintPlan(plan, {
    learned: new Map([['{{ _class }}', 'static-section-testt']]),
    extras: new Map([['0:section', [['data-sid', 'abc123']]]]),
  });

  assert.deepEqual(waiting, []);
  assert.match(html, /^<section id="id-abc123" class="\[ static-section-testt \]" data-auto-contrast data-sid="abc123"/);
  assert.ok(html.includes(`${CANVAS_PATH}="0:section" ${CANVAS_ROOT}>`));
  assert.ok(html.includes(`<h1 ${CANVAS_PATH}="0:section/0:h1">fddsfdsfd</h1>`));
  assert.ok(html.includes(`<p ${CANVAS_PATH}="0:section/1:p">Hello</p>`));
  assert.ok(html.endsWith('</section>'));
});

test('a tag nobody has learned yet paints as nothing, never as Antlers', () => {
  const { html } = paintPlan(planTemplate(TESTT, field));

  assert.ok(html.startsWith('<section id="id-abc123" class="[  ]" data-auto-contrast '));
  assert.ok(!html.includes('{{'));
});

test('a loop is an island: waiting until rendered, then what the real preview rendered', () => {
  const plan = planTemplate(LOOP, field);

  assert.equal(plan.islands.length, 1);

  const island = plan.islands[0];

  assert.equal(island.host, '0:section/1:div');
  assert.equal(island.prev, null);
  assert.equal(island.next, null);

  const first = paintPlan(plan);

  assert.deepEqual(first.waiting, [island.key]);
  assert.ok(first.html.includes(`<${ISLAND_WAIT}></${ISLAND_WAIT}>`));
  // The static parts around it paint at once.
  assert.ok(first.html.includes(`<h2 class="text-700" ${CANVAS_PATH}="0:section/0:h2">Hello</h2>`));
  assert.ok(first.html.includes(`<p ${CANVAS_PATH}="0:section/2:p">After</p>`));

  const cards = '<article class="card">One</article><article class="card">Two</article>';
  const second = paintPlan(plan, { islands: new Map([[island.key, cards]]) });

  assert.deepEqual(second.waiting, []);
  assert.ok(second.html.includes(`${CANVAS_PATH}="0:section/1:div">${cards}</div>`));
});

test('an island keeps its key through an edit inside the loop, and loses it when the loop asks for something else', () => {
  const key = (html) => planTemplate(html, field).islands[0].key;
  const base = key(LOOP);

  assert.equal(key(LOOP.replace('class="card"', 'class="card p-400"')), base);
  assert.notEqual(key(LOOP.replace('limit="3"', 'limit="6"')), base);
});

test('islands stand between their static siblings', () => {
  const plan = planTemplate('<div><h2>A</h2>{{ if show }}<p>x</p>{{ /if }}<h3>B</h3>{{ partial:card }}</div>', field);

  assert.deepEqual(
    plan.islands.map((run) => [run.prev, run.next]),
    [
      ['0:div/0:h2', '0:div/2:h3'],
      ['0:div/2:h3', null],
    ]
  );
});

test('a modifier or any other tag in text makes its run an island; a comment does not', () => {
  assert.equal(planTemplate('<p>{{ title | upper }}</p>', field).islands.length, 1);
  assert.equal(planTemplate('<p>{{ site_settings:phone }}</p>', field).islands.length, 1);

  const plan = planTemplate('<p>A {{# note #}}<!-- {{ nope | x }} -->{{ title }} B</p>', field);

  assert.equal(plan.islands.length, 0);
  assert.equal(paintPlan(plan).html, `<p ${CANVAS_PATH}="0:p" ${CANVAS_ROOT}>A Hello B</p>`);
});

test('an island that is one field of the form — a Bard document — names the field; any other island does not', () => {
  const island = (html) => planTemplate(html, field).islands[0];

  assert.equal(island('<div class="prose">{{ list }}</div>').field, 'list');
  assert.equal(island('<div class="prose">\n  {{ hero.list }}\n</div>').field, 'hero.list');
  assert.equal(island('<div>{{ list }} {{ title | upper }}</div>').field, '');
  assert.equal(island('<p>{{ site_settings:phone }}</p>').field, '');
  assert.equal(island('<p>{{ title | upper }}</p>').field, '');
  assert.equal(island(LOOP).field, '');
});

test('Alpine’s attributes stay off the canvas; void and self-closed elements have no inside', () => {
  const { html } = paintPlan(planTemplate('<div x-data="{}" @click="go()" :class="{ a: b }" data-x="1"><img src="a.png"><br><span /></div>', field));

  assert.ok(!html.includes('@click'));
  assert.ok(!html.includes('x-data'));
  assert.ok(!html.includes(':class'));
  assert.ok(html.includes('data-x="1"'));
  assert.ok(inertAttr('x-show') && inertAttr('@click.away') && inertAttr(':href') && !inertAttr('data-x') && !inertAttr('xmlns'));
  assert.ok(inertAttr('onload') && inertAttr('onClick') && !inertAttr('role'));
  assert.ok(html.includes(`<img src="a.png" ${CANVAS_PATH}="0:div/0:img">`));
  assert.ok(!html.includes('</img>'));
});

test('a value from the DOM goes back into an attribute encoded', () => {
  const { html } = paintPlan(planTemplate('<a title="{{ x }}">t</a>', field), { learned: new Map([['{{ x }}', 'a "b" & c']]) });

  assert.ok(html.includes('title="a &quot;b&quot; &amp; c"'));
});

test('learning a tag reads it off the rendered value; a render the file has moved on from teaches nothing', () => {
  const parts = planTemplate(TESTT, field).root.attrs.find((a) => a.name === 'class').parts;
  const read = learnTags(parts, '[ static-section-testt ]');

  assert.deepEqual([...read.values], [['{{ _class }}', 'static-section-testt']]);
  assert.equal(read.served, false);
  assert.equal(learnTags(parts, 'something else'), null);

  const id = planTemplate(TESTT, field).root.attrs.find((a) => a.name === 'id').parts;

  // The render agrees with the form: nothing to learn, the form keeps answering.
  assert.deepEqual(learnTags(id, 'id-abc123'), { values: new Map(), served: false });
});

test('a tag the server answers otherwise than the form is the server’s until they agree', () => {
  // The page's own id answers `{{ id }}` in the form; the partial is handed the row's.
  const plan = planTemplate(TESTT, fieldLookup({ _id: 'row1' }, { id: 'page-entry' }));
  const id = plan.root.attrs.find((a) => a.name === 'id').parts;
  const read = learnTags(id, 'id-row1');

  assert.equal(read.served, true);
  assert.deepEqual([...read.values], [['{{ id }}', 'row1']]);
  assert.ok(paintPlan(plan).html.startsWith('<section id="id-page-entry"'));
  assert.ok(paintPlan(plan, { learned: read.values, served: new Set(['{{ id }}']) }).html.startsWith('<section id="id-row1"'));
});

test('a class list is read token by token, without the editor’s own classes', () => {
  const parts = planTemplate(TESTT, field).root.attrs.find((a) => a.name === 'class').parts;
  const rendered = pageClasses('[ static-section-testt ]  sve-cp-pulse sve-editing');

  assert.equal(rendered, '[ static-section-testt ]');
  assert.equal(learnTags(parts, '[ static-section-testt ] sve-cp-pulse'), null);
  assert.deepEqual([...learnTags(parts, rendered, { tokens: true }).values], [['{{ _class }}', 'static-section-testt']]);

  const team = planTemplate('<section class="{{ _class }}  py-800"></section>', field).root.attrs[0].parts;

  assert.deepEqual([...learnTags(team, 'other-section-team py-800', { tokens: true }).values], [['{{ _class }}', 'other-section-team']]);
});

test('no element at the top: nothing to paint', () => {
  assert.equal(planTemplate('{{ partial:hero }}', field), null);
  assert.equal(planTemplate('', field), null);
});

test('an element the file leaves empty is stamped for the placeholder — by the plan, a line break inside or not', () => {
  const html = [
    '<section class="py-800">',
    '  <div class="grid grid-cols-2">',
    '    <div>',
    '    </div>',
    '    <div></div>',
    '  </div>',
    '  <h2>  </h2>',
    '  <p>{{ title }}</p>',
    '  <p>{{ empty }}</p>',
    '  <p>{{# a note #}}</p>',
    '  <div><!-- <p>hidden</p> --></div>',
    '  <span></span>',
    '  <img src="a.png">',
    '  <div>{{ collection:pages }}<p>{{ title }}</p>{{ /collection:pages }}</div>',
    '  <div>&nbsp;</div>',
    '</section>',
  ].join('\n');
  const plan = planTemplate(html, field);
  const empty = Object.fromEntries(plan.elements.map((el) => [el.path, el.empty]));

  assert.equal(empty['0:section'], '');
  assert.equal(empty['0:section/0:div'], '');
  assert.equal(empty['0:section/0:div/0:div'], 'box');
  assert.equal(empty['0:section/0:div/1:div'], 'box');
  assert.equal(empty['0:section/1:h2'], 'text');
  // A field is not nothing, even when the form has it empty.
  assert.equal(empty['0:section/2:p'], '');
  assert.equal(empty['0:section/3:p'], '');
  assert.equal(empty['0:section/4:p'], 'text');
  assert.equal(empty['0:section/5:div'], 'box');
  assert.equal(empty['0:section/6:span'], '');
  assert.equal(empty['0:section/7:img'], '');
  assert.equal(empty['0:section/8:div'], '');
  assert.equal(empty['0:section/9:div'], '');

  const { html: painted } = paintPlan(plan);

  assert.ok(painted.includes(`<div ${CANVAS_PATH}="0:section/0:div/1:div" ${CANVAS_EMPTY}="box"></div>`), painted);
  assert.ok(painted.includes(`<h2 ${CANVAS_PATH}="0:section/1:h2" ${CANVAS_EMPTY}="text">  </h2>`), painted);
  assert.ok(!painted.includes(`${CANVAS_PATH}="0:section" ${CANVAS_EMPTY}`));
});

test('a new, blank section is one placeholder; a locked empty element is none', () => {
  assert.equal(planTemplate('<section id="id-{{ id }}" class="[ {{ _class }} ]">\n</section>', field).root.empty, 'box');
  assert.equal(planTemplate('{{# sve-lock #}}\n<div>\n</div>', field).root.empty, '');
});

test('an attribute counts as rendered only when the real preview rendered its tag from the form value it has now', () => {
  const plan = {
    elements: [
      {
        path: '0',
        attrs: [
          { name: 'src', parts: [{ tag: '{{ image }}' }] },
          { name: 'href', parts: [{ tag: '{{ link }}', value: 'entry::a' }] },
          { name: 'alt', value: 'Own', parts: null },
          { name: 'title', parts: [{ text: 'Plain' }] },
        ],
      },
    ],
  };

  assert.equal(attrRendered(plan, '0', 'src', new Map()), false, 'an assets field paints empty until it is rendered');
  assert.equal(attrRendered(plan, '0', 'src', new Map([['{{ image }}', undefined]])), true, 'rendered, and empty is then a value');
  assert.equal(attrRendered(plan, '0', 'href', new Map()), false, 'a raw entry::id is not an address');
  assert.equal(attrRendered(plan, '0', 'href', new Map([['{{ link }}', 'entry::a']])), true);
  assert.equal(attrRendered(plan, '0', 'href', new Map([['{{ link }}', 'entry::old']])), false, 'the form has moved on since the render');
  assert.equal(attrRendered(plan, '0', 'alt', new Map()), true, 'no tag, nothing to wait for');
  assert.equal(attrRendered(plan, '0', 'title', new Map()), true);
  assert.equal(attrRendered(plan, '0', 'data-x', new Map()), true);
  assert.equal(attrRendered(null, '0', 'src', new Map()), true);
});

/* An image the server finishes (the site's ImageMarkup): the crop is the server's. */

const IMG = '<img src="/assets/portrait.webp" alt="Camilla" width="400" height="711" format="webp" quality="10" blur>';
const GLIDE = (w, h) => `/img/asset/portrait.webp?w=${w}&h=${h}&fit=crop_focal&q=10&fm=webp`;
const rendered = (attrs) => ({ getAttribute: (name) => attrs[name] ?? null });
const imgOf = (html) => paintPlan(...html).html.match(/<img\b[^>]*>/)[0];

test('an <img> with format, quality or blur is the server’s to finish; a plain one is not', () => {
  assert.equal(planTemplate(IMG, field).root.image, 'img');
  assert.equal(planTemplate('<img src="a.png" width="400" height="300">', field).root.image, '');
  assert.equal(planTemplate('<img src="a.png" blur>', field).root.image, 'img');
});

test('the server has made the size the file asks: its address, srcset, width and height; no option on the canvas', () => {
  const plan = planTemplate(IMG, field);
  const made = servedImage(plan.root, rendered({ src: GLIDE(400, 711), srcset: `${GLIDE(400, 711)} 1x, ${GLIDE(800, 1422)} 2x`, width: '400', height: '711' }));
  const img = imgOf([plan, { images: new Map([[plan.root.path, made]]) }]);

  assert.ok(img.includes(`src="${GLIDE(400, 711).replace(/&/g, '&amp;')}"`), img);
  assert.ok(img.includes('srcset="'), img);
  assert.ok(img.includes('width="400"') && img.includes('height="711"'), img);
  assert.ok(img.includes('alt="Camilla"'), img);
  assert.ok(!/\s(?:format|quality|blur)\b/.test(img), img);
  assert.ok(!img.includes('aspect-ratio'), 'the server’s crop has its own shape');
});

test('a new size: the server’s last picture at once, in the shape the file asks, until the server has made it', () => {
  const plan = planTemplate(IMG.replace('height="711"', 'height="400"'), field);
  const before = servedImage(planTemplate(IMG, field).root, rendered({ src: GLIDE(400, 711), width: '400', height: '711' }));
  const img = imgOf([plan, { images: new Map([[plan.root.path, before]]) }]);

  assert.ok(img.includes(`src="${GLIDE(400, 711).replace(/&/g, '&amp;')}"`), 'the picture there is, not the raw file');
  assert.ok(img.includes('width="400"') && img.includes('height="400"'), img);
  assert.ok(img.includes('style="aspect-ratio: 400 / 400; object-fit: cover"'), img);
});

test('another picture, or none rendered yet: the file’s address in the file’s shape; an own style is kept', () => {
  const plan = planTemplate(IMG.replace('portrait.webp', 'other.webp').replace('<img ', '<img style="opacity: .9;" '), field);
  const old = servedImage(planTemplate(IMG, field).root, rendered({ src: GLIDE(400, 711), width: '400', height: '711' }));

  for (const images of [new Map([[plan.root.path, old]]), new Map()]) {
    const img = imgOf([plan, { images }]);

    assert.ok(img.includes('src="/assets/other.webp"'), img);
    assert.ok(img.includes('style="opacity: .9; aspect-ratio: 400 / 711; object-fit: cover"'), img);
    assert.ok(!img.includes('srcset'), img);
  }
});

test('a width alone keeps the picture’s own shape: no cut on the canvas', () => {
  const plan = planTemplate('<img src="/assets/portrait.webp" width="600" format="webp">', field);
  const before = servedImage(plan.root, rendered({ src: GLIDE(400, 400), width: '400', height: '400' }));
  const img = imgOf([plan, { images: new Map([[plan.root.path, before]]) }]);

  assert.ok(img.includes('width="600"') && !img.includes('height='), img);
  assert.ok(!img.includes('aspect-ratio'), img);

  const made = servedImage(plan.root, rendered({ src: GLIDE(600, 600), width: '600', height: '600' }));

  assert.ok(imgOf([plan, { images: new Map([[plan.root.path, made]]) }]).includes('height="600"'), 'the height the server worked out');
});

test('a <picture>: its sources are finished with the <img>, a plain <picture> is left alone', () => {
  const source = '<source media="(width < 48em)" srcset="/assets/portrait.webp" width="768" height="768">';
  const plan = planTemplate(`<picture>${source}${IMG}</picture>`, field);
  const [, src, img] = plan.elements;

  assert.equal(src.image, 'source');
  assert.equal(img.image, 'img');
  assert.equal(planTemplate(`<picture>${source}<img src="a.png"></picture>`, field).elements[1].image, '');

  const made = servedImage(src, rendered({ srcset: `${GLIDE(768, 768)} 1x`, width: '768', height: '768' }));
  const { html } = paintPlan(plan, { images: new Map([[src.path, made]]) });
  const painted = html.match(/<source\b[^>]*>/)[0];

  assert.ok(painted.includes(`srcset="${GLIDE(768, 768).replace(/&/g, '&amp;')} 1x"`), painted);
  assert.ok(painted.includes('media="(width < 48em)"'), painted);
  assert.ok(!painted.includes('aspect-ratio'), 'a source has no box of its own');
});
