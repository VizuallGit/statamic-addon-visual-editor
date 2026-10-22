import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  FIT_MARGIN_PX,
  FRAME,
  GAP,
  GROUP_GAP,
  GROUP_HEAD_PX,
  LABEL_PX,
  LOAD_AT_ONCE,
  LOAD_MARGIN_PX,
  PAD,
  ROW_GAP,
  ROW_HEAD_PX,
  VIEW_FLAG,
  VIEW_VALUE,
  ZOOM_DEFAULT,
  ZOOM_MAX,
  ZOOM_MIN,
  anchoredScroll,
  canvasFrames,
  canvasGroups,
  canvasLayout,
  clampZoom,
  contentBox,
  fitZoom,
  frameHeight,
  frameSrc,
  framesNear,
  isDrag,
  nextLoads,
  isSiteCanvasOpen,
  restingScroll,
  stepZoom,
  withViewFlag,
} from '../../resources/js/site-canvas.js';

const JS = join(dirname(fileURLToPath(import.meta.url)), '../../resources/js');
const BASE = 'http://site.test/cp/collections/pages/entries/p1?live-preview=1';

const frame = (id, extra = {}) => ({ id, title: `Page ${id}`, preview: `http://site.test/${id}?live-preview=abc&token=tok-${id}`, edit: `http://site.test/cp/collections/pages/entries/${id}`, ...extra });

/** What the endpoint answers for a site with two template collections, two site views and five pages. */
const PAYLOAD = {
  groups: [
    {
      key: 'templates',
      title: 'Skabeloner',
      rows: [
        { key: 'services', title: 'Services', frames: [frame('services-index'), frame('services-show')] },
        { key: 'pages', title: 'Pages', frames: [frame('pages-index')] },
        { key: 'site', title: 'Sitet', frames: [frame('layout'), frame('default')] },
      ],
    },
    {
      key: 'pages',
      title: 'Sider',
      rows: [{ key: 'pages', title: 'Pages', frames: [frame('home'), frame('about'), frame('contact'), frame('services'), frame('news')] }],
    },
  ],
};

// --- grouping -----------------------------------------------------------------------

test('the endpoint’s groups are drawn as they come: two groups, rows under them, frames in order', () => {
  const groups = canvasGroups(PAYLOAD);

  assert.deepEqual(groups.map((group) => [group.key, group.title, group.rows.length]), [['templates', 'Skabeloner', 3], ['pages', 'Sider', 1]]);
  assert.deepEqual(groups[0].rows.map((row) => [row.title, row.frames.map((item) => item.id)]), [
    ['Services', ['services-index', 'services-show']],
    ['Pages', ['pages-index']],
    ['Sitet', ['layout', 'default']],
  ]);
  assert.deepEqual(canvasFrames(groups).map((item) => item.id), ['services-index', 'services-show', 'pages-index', 'layout', 'default', 'home', 'about', 'contact', 'services', 'news']);
});

test('a frame without an id, a preview URL or an edit URL is left out, and an empty row or group with it', () => {
  const groups = canvasGroups({
    groups: [
      { key: 'templates', title: 'T', rows: [{ key: 'x', title: 'X', frames: [{ id: 'a', title: 'A', preview: '', edit: '/e' }, { id: '', preview: '/p', edit: '/e' }] }] },
      { key: 'pages', title: 'P', rows: [{ key: 'p', title: 'P', frames: [{ id: 'b', preview: '/p', edit: '/e' }] }] },
    ],
  });

  assert.deepEqual(groups.map((group) => group.key), ['pages']);
  // No title: the id stands in, so every frame has a label.
  assert.equal(groups[0].rows[0].frames[0].title, 'b');
});

test('nothing, or nonsense, from the endpoint is no groups', () => {
  assert.deepEqual(canvasGroups(null), []);
  assert.deepEqual(canvasGroups({}), []);
  assert.deepEqual(canvasGroups({ groups: 'x' }), []);
  assert.deepEqual(canvasGroups({ groups: [{ key: 'pages', rows: 7 }] }), []);
});

// --- layout -------------------------------------------------------------------------

test('frames are a desktop viewport wide and the minimum tall until their page has said; each group is one line, its rows clusters along it, the groups under one another', () => {
  const { items, headings, width } = canvasLayout(canvasGroups(PAYLOAD), 1);
  const W = FRAME.width;

  assert.equal(items.length, 10);
  assert.ok(items.every((item) => item.width === W && item.height === FRAME.minHeight));

  // The templates line: Services (two frames), a row gap, Pages (one), a row gap, Sitet (two) — all on one line, a frame gap within a row.
  const templates = items.filter((item) => item.group === 'templates');
  const x = { services: PAD, pages: PAD + 2 * W + GAP + ROW_GAP, site: PAD + 3 * W + GAP + 2 * ROW_GAP };

  assert.deepEqual(templates.map((item) => item.x), [x.services, x.services + W + GAP, x.pages, x.site, x.site + W + GAP]);
  assert.ok(templates.every((item) => item.y === templates[0].y), 'one line: every template frame shares its top');

  // The pages line: five frames side by side, a frame gap apart — no wrapping.
  const pages = items.filter((item) => item.group === 'pages');

  assert.deepEqual(pages.map((item) => item.x), [0, 1, 2, 3, 4].map((i) => PAD + i * (W + GAP)));
  assert.ok(pages.every((item) => item.y === pages[0].y), 'one line: every page frame shares its top');

  // As wide as the widest line (the templates', with its two row gaps), padded.
  assert.equal(width, x.site + 2 * W + GAP + PAD);
  assert.ok(x.site + 2 * W + GAP > pages[4].x + W, 'the templates line is the wider here');

  // Headings: one per group; one per row of a group with several rows, over its first frame; none for a group of one row — its heading names it.
  assert.deepEqual(headings.map((heading) => [heading.kind, heading.title]), [
    ['group', 'Skabeloner'],
    ['row', 'Services'],
    ['row', 'Pages'],
    ['row', 'Sitet'],
    ['group', 'Sider'],
  ]);
  const [services, pagesRow, sitet] = headings.filter((heading) => heading.kind === 'row');

  assert.deepEqual([services.x, pagesRow.x, sitet.x], [x.services, x.pages, x.site]);
  assert.ok(services.y === pagesRow.y && pagesRow.y === sitet.y, 'the row headings stand level on the line');
  assert.equal(templates[0].y, services.y + ROW_HEAD_PX + LABEL_PX, 'the frames stand under the row heading and their label');

  const pagesGroup = headings.find((heading) => heading.kind === 'group' && heading.title === 'Sider');

  assert.equal(pagesGroup.y, templates[0].y + FRAME.minHeight + GROUP_GAP, 'the second group stands a group gap under the first line');
  assert.equal(pages[0].y, pagesGroup.y + GROUP_HEAD_PX + LABEL_PX, 'the pages stand under their one heading and their label — no row heading in between');
});

test('rows of any length stand on their group’s one line, a row gap — wider than a frame gap — between clusters; a group of one row is headed once', () => {
  const groups = canvasGroups({
    groups: [
      {
        key: 'templates',
        title: 'T',
        rows: [
          { key: 'a', title: 'A', frames: [frame('a1')] },
          { key: 'b', title: 'B', frames: [frame('b1'), frame('b2'), frame('b3'), frame('b4'), frame('b5')] },
          { key: 'c', title: 'C', frames: [frame('c1'), frame('c2')] },
          { key: 'd', title: 'D', frames: [frame('d1')] },
        ],
      },
      { key: 'pages', title: 'P', rows: [{ key: 'p', title: 'P again', frames: [frame('p1'), frame('p2')] }] },
    ],
  });
  const { items, headings, metrics } = canvasLayout(groups, 1);
  const head = (title) => headings.find((heading) => heading.title === title);
  const item = (id) => items.find((it) => it.id === id);
  const W = FRAME.width;

  assert.ok(ROW_GAP > GAP);
  assert.ok(items.filter((it) => it.group === 'templates').every((it) => it.y === item('a1').y), 'nine frames, one line');
  assert.equal(item('b1').x, item('a1').x + W + ROW_GAP, 'B starts a row gap after A');
  assert.equal(item('b5').x, item('b1').x + 4 * (W + GAP), 'B’s five frames a frame gap apart, no wrapping');
  assert.equal(item('c1').x, item('b5').x + W + ROW_GAP);
  assert.equal(item('d1').x, item('c2').x + W + ROW_GAP);
  assert.ok(['A', 'B', 'C', 'D'].every((title) => head(title).y === head('A').y), 'the four row headings stand level');
  assert.deepEqual(['A', 'B', 'C', 'D'].map((title) => head(title).x), ['a1', 'b1', 'c1', 'd1'].map((id) => item(id).x), 'each over its row’s first frame');

  // The pages group has one row: the group heading alone, and the frames straight under it and their label.
  assert.equal(head('P again'), undefined, 'no row heading for a group of one row');
  assert.equal(item('p1').y, head('P').y + GROUP_HEAD_PX + LABEL_PX);
  // Screen pixels: two group headings, one line of row headings (the templates'), one line of labels per group.
  assert.equal(metrics.screenHeight, 2 * GROUP_HEAD_PX + ROW_HEAD_PX + 2 * LABEL_PX);
});

test('a frame is as tall as its page says; a line of frames is as tall as its tallest; a page that has not said is the minimum', () => {
  const groups = canvasGroups(PAYLOAD);
  const heights = new Map([
    ['home', 4200],
    ['about', 2300],
    ['services', 1800],
    ['layout', 700],
  ]);
  const { items, headings, metrics, height } = canvasLayout(groups, 1, { heights });
  const item = (id) => items.find((it) => it.id === id);

  assert.equal(item('home').height, 4200);
  assert.equal(item('about').height, 2300);
  assert.equal(item('contact').height, FRAME.minHeight, 'not measured: the minimum');
  assert.equal(item('layout').height, 700);
  assert.ok(items.every((it) => it.width === FRAME.width), 'every frame keeps the viewport width');

  // The pages line: all five share a top, whatever their heights; the line is as tall as home.
  assert.ok([item('about'), item('contact'), item('services'), item('news')].every((it) => it.y === item('home').y), 'frames on a line share its top');

  // The templates line: layout at 700 is its tallest, so the line is 700 tall and the pages group follows that.
  const sitet = headings.find((heading) => heading.title === 'Sitet');
  const pagesGroup = headings.find((heading) => heading.kind === 'group' && heading.title === 'Sider');

  assert.equal(pagesGroup.y, sitet.y + ROW_HEAD_PX + LABEL_PX + 700 + GROUP_GAP);
  assert.equal(height, item('home').y + 4200 + PAD, 'the sheet ends a pad under the tallest page');

  // The sheet is as tall as the sum of its parts, and the metrics still split it: the frames and gaps scale, the headings and labels do not.
  const screen = 2 * GROUP_HEAD_PX + ROW_HEAD_PX + 2 * LABEL_PX;
  const sheet = 2 * PAD + GROUP_GAP + 700 + 4200;

  assert.equal(metrics.screenHeight, screen);
  assert.equal(metrics.fixedHeight, sheet);
  assert.equal(height, sheet + screen);

  const atHalf = canvasLayout(groups, 0.5, { heights });

  assert.equal(atHalf.metrics.fixedHeight, sheet, 'the part that scales is the same at every zoom');
  assert.equal(atHalf.height, sheet + screen / 0.5);
});

test('the height of a frame’s page: its scroll height in whole pixels, never under the minimum, the minimum for a page that said nothing', () => {
  assert.equal(frameHeight(3187.4), 3188);
  assert.equal(frameHeight(FRAME.minHeight + 1), FRAME.minHeight + 1);
  assert.equal(frameHeight(FRAME.minHeight), FRAME.minHeight);
  assert.equal(frameHeight(120), FRAME.minHeight, 'a short page is the minimum tall');
  assert.equal(frameHeight(0), FRAME.minHeight);
  assert.equal(frameHeight(undefined), FRAME.minHeight, 'no document to read');
  assert.equal(frameHeight(NaN), FRAME.minHeight);
  assert.equal(frameHeight(Infinity), FRAME.minHeight);
  assert.equal(frameHeight(900, 1000), 1000, 'the minimum is the caller’s');
});

test('no two frames overlap, at any zoom, whatever the pages’ heights — a tall frame beside a long row of short ones too', () => {
  const mixed = canvasGroups({
    groups: [{
      key: 'templates',
      title: 'T',
      rows: [
        { key: 'a', title: 'A', frames: [frame('a1')] },
        { key: 'b', title: 'B', frames: [frame('b1'), frame('b2'), frame('b3')] },
        { key: 'c', title: 'C', frames: [frame('c1'), frame('c2'), frame('c3'), frame('c4'), frame('c5')] },
        { key: 'd', title: 'D', frames: [frame('d1')] },
      ],
    }],
  });
  const heights = new Map([['a1', 9000], ['b2', 3000], ['c3', 2400], ['c5', 7000], ['d1', 650], ['home', 4200], ['about', 2300]]);

  for (const [groups, name] of [[canvasGroups(PAYLOAD), 'payload'], [mixed, 'mixed']]) {
    for (const z of [1, 0.5, 0.12, ZOOM_MIN]) {
      const { items } = canvasLayout(groups, z, { heights });

      for (const a of items) {
        for (const b of items) {
          if (a === b) {
            continue;
          }

          const apart = a.x + a.width <= b.x || b.x + b.width <= a.x || a.y + a.height <= b.y || b.y + b.height <= a.y;

          assert.ok(apart, `${name}: ${a.id} and ${b.id} overlap at zoom ${z}`);
        }
      }
    }
  }

  // In the mixed sheet, A (one frame, 9000 tall), B, C and D all stand on the one line, each as tall as its page says: the line is as tall as A, and the sheet ends a pad under it.
  const { items, headings, height } = canvasLayout(mixed, 1, { heights });
  const head = (title) => headings.find((heading) => heading.title === title);
  const item = (id) => items.find((it) => it.id === id);

  assert.ok(['B', 'C', 'D'].every((title) => head(title).y === head('A').y), 'one line of four clusters');
  assert.equal(item('c5').x, item('c4').x + FRAME.width + GAP);
  assert.equal(item('d1').x, item('c5').x + FRAME.width + ROW_GAP);
  assert.equal(height, item('a1').y + 9000 + PAD, 'the line is as tall as A, the tallest');
});

test('headings and labels keep their screen size: their room on the sheet is their pixels over the zoom, and the metrics add up', () => {
  const groups = canvasGroups(PAYLOAD);
  const at1 = canvasLayout(groups, 1);
  const atHalf = canvasLayout(groups, 0.5);

  // Two groups, one line each: row headings on the templates' line only (the pages group has one row), a line of labels on each.
  const screen = 2 * GROUP_HEAD_PX + ROW_HEAD_PX + 2 * LABEL_PX;

  assert.equal(at1.metrics.screenHeight, screen);
  assert.equal(atHalf.metrics.screenHeight, screen);
  assert.ok(Math.abs(at1.metrics.fixedHeight - atHalf.metrics.fixedHeight) < 1e-6, 'the part that scales is the same at every zoom');
  assert.ok(Math.abs(at1.height - (at1.metrics.fixedHeight + screen)) < 1e-6);
  assert.ok(Math.abs(atHalf.height - (atHalf.metrics.fixedHeight + screen / 0.5)) < 1e-6);
  assert.equal(at1.width, atHalf.width, 'the width does not depend on the zoom');
});

test('an empty sheet is padding alone', () => {
  const layout = canvasLayout([], 1);

  assert.deepEqual([layout.width, layout.height, layout.items, layout.headings], [PAD * 2, PAD * 2, [], []]);
});

// --- zoom ---------------------------------------------------------------------------

test('fit puts the whole sheet in the view with the margin clear, and never past 100 %', () => {
  const groups = canvasGroups(PAYLOAD);
  const at1 = canvasLayout(groups, 1);
  const view = { width: 1200, height: 800 };
  const z = fitZoom(view, at1);
  const fitted = canvasLayout(groups, z);

  assert.ok(z >= ZOOM_MIN && z <= ZOOM_MAX);
  assert.ok(fitted.width * z <= view.width - 2 * FIT_MARGIN_PX + 1e-6);
  assert.ok(fitted.height * z <= view.height - 2 * FIT_MARGIN_PX + 1e-6);
  // Snug: a step more and one side would not fit.
  const bigger = canvasLayout(groups, z * 1.05);

  assert.ok(bigger.width * z * 1.05 > view.width - 2 * FIT_MARGIN_PX || bigger.height * z * 1.05 > view.height - 2 * FIT_MARGIN_PX);

  assert.equal(fitZoom({ width: 100000, height: 100000 }, at1), ZOOM_MAX, 'a huge view: 100 %, not more');
  assert.equal(fitZoom(view, canvasLayout([], 1)), 1, 'nothing to fit: 100 %');
});

test('the canvas opens at 50 %: a step on the ladder, within the clamp, a frame 720 px wide on screen', () => {
  assert.equal(ZOOM_DEFAULT, 0.5);
  assert.equal(clampZoom(ZOOM_DEFAULT), ZOOM_DEFAULT);
  assert.equal(stepZoom(stepZoom(ZOOM_DEFAULT, 1), -1), ZOOM_DEFAULT, 'up a step and down again lands on it: it is on the ladder');
  assert.equal(FRAME.width * ZOOM_DEFAULT, 720);
});

test('the zoom is clamped and steps along the ladder', () => {
  assert.equal(clampZoom(0.001), ZOOM_MIN);
  assert.equal(clampZoom(5), ZOOM_MAX);
  assert.equal(clampZoom(NaN), 1);
  assert.equal(stepZoom(0.2, 1), 0.25);
  assert.equal(stepZoom(0.2, -1), 0.15);
  assert.equal(stepZoom(0.22, 1), 0.25);
  assert.equal(stepZoom(0.22, -1), 0.2);
  assert.equal(stepZoom(1, 1), ZOOM_MAX);
  assert.equal(stepZoom(0.04, -1), ZOOM_MIN);
});

test('a zoom round the pointer keeps the sheet point under it still', () => {
  // Sheet point under the pointer: (scroll + pointer - offset) / z.
  const before = (300 + 200 - 0) / 0.5;
  const scroll = anchoredScroll(300, 200, 0, 0, 0.5, 1);

  assert.equal((scroll + 200 - 0) / 1, before);
  // The same zoom twice moves nothing.
  assert.equal(anchoredScroll(300, 200, 0, 0, 0.5, 0.5), 300);
  // A sheet centred in the view before (offset 100) and flush after (offset 0).
  const centred = anchoredScroll(0, 400, 100, 0, 0.25, 0.5);

  assert.equal((centred + 400) / 0.5, (0 + 400 - 100) / 0.25);
  // Never a negative scroll.
  assert.equal(anchoredScroll(0, 10, 0, 0, 1, 0.5), 0);
});

test('a pointer in the room beside the sheet holds the nearest sheet point, so a zoom never strands the view in empty room', () => {
  // A 400 px view, the sheet (2000 sheet px tall) 400 into the scroll box (one view of room).
  // Scrolled to the bottom at 5 %: the view spans scroll box 400 + 100 − 400 … → sheet points −3000 … 5000 under it;
  // the pointer at the view's middle is at sheet point (100 + 200 − 400) / 0.05 = −2000: in the room above the sheet.
  const top = anchoredScroll(100, 200, 400, 400, 0.05, 1, 2000);

  // The sheet point held is 0 (its top edge), so after the zoom the sheet's top sits under the pointer: scroll = 0 × 1 + 400 − 200.
  assert.equal(top, 200);
  // Past the far edge: a pointer at sheet point 6000 of a 2000 sheet holds 2000 (its bottom).
  const bottom = anchoredScroll(400 + 6000 * 0.05 - 200, 200, 400, 400, 0.05, 1, 2000);

  assert.equal(bottom, 2000 * 1 + 400 - 200);
  // Inside the sheet, the extent changes nothing.
  assert.equal(anchoredScroll(300, 200, 0, 0, 0.5, 1, 5000), anchoredScroll(300, 200, 0, 0, 0.5, 1));
});

test('after a fit the sheet rests in the middle of the view, or from its top-left edge when ZOOM_MIN left it bigger', () => {
  // A 187 px sheet in a 537 px view, one view of room before it: the middle of the sheet at the middle of the view.
  assert.equal(restingScroll(187, 537, 537), 537 + 187 / 2 - 537 / 2);
  // A 487 px sheet in a 449 px view (the demo's small pane at 3 %): the sheet's top FIT_MARGIN_PX in from the view's top.
  assert.equal(restingScroll(487, 449, 449), 449 - FIT_MARGIN_PX);
  // Exactly the view's size still centres.
  assert.equal(restingScroll(449, 449, 449), 449);
  // Never a negative scroll.
  assert.equal(restingScroll(10, 400, 0), 0);
});

// --- which frames load ----------------------------------------------------------------

test('only frames near the view get a src: those in it, and those within the margin of its edge', () => {
  const groups = canvasGroups(PAYLOAD);
  const z = 1;
  const { items } = canvasLayout(groups, z);
  const first = items[0];

  // A view the size of one frame, over the first frame alone: the first, and its neighbour within the margin.
  const view = { scrollLeft: first.x, scrollTop: first.y, width: FRAME.width, height: FRAME.minHeight };
  const near = framesNear(items, z, view, LOAD_MARGIN_PX);

  assert.ok(near.includes('services-index'));
  // The next frame starts GAP (96) past the first's edge, inside a 200 px margin.
  assert.ok(near.includes('services-show'));
  // The pages, a group gap and more down the sheet, are empty shells.
  assert.ok(!near.includes('home'));
  assert.ok(!near.includes('news'));

  // No margin: the neighbour is out too.
  assert.deepEqual(framesNear(items, z, view, 0), ['services-index']);
});

test('zoomed out so that everything is in view, every frame is near', () => {
  const groups = canvasGroups(PAYLOAD);
  const z = 0.1;
  const layout = canvasLayout(groups, z);

  assert.equal(framesNear(layout.items, z, { scrollLeft: 0, scrollTop: 0, width: layout.width * z, height: layout.height * z }, 0).length, 10);
});

test('a few frames load at once: the near ones without a page, in order, as many as the cap leaves over those under way', () => {
  const near = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
  const wants = (id) => !['b', 'e'].includes(id); // b and e have their page, or no URL

  assert.equal(LOAD_AT_ONCE, 4);
  assert.deepEqual(nextLoads(near, wants, 0), ['a', 'c', 'd', 'f']);
  assert.deepEqual(nextLoads(near, wants, 3), ['a']);
  assert.deepEqual(nextLoads(near, wants, 4), [], 'the cap is full');
  assert.deepEqual(nextLoads(near, wants, 9), [], 'and never negative');
  assert.deepEqual(nextLoads(near, wants, 1, 2), ['a']);
  assert.deepEqual(nextLoads([], wants, 0), []);
  assert.deepEqual(nextLoads(['b', 'e'], wants, 0), [], 'nothing near wants a page');
});

test('a sheet centred in the view starts inside it: a negative scroll origin, and the frames at its top are near', () => {
  const groups = canvasGroups(PAYLOAD);
  const z = 0.2;
  const layout = canvasLayout(groups, z);
  // The view is wider than the sheet; the sheet's edge stands 150 px in. Tall enough for the templates' line, not for the pages' under it.
  const view = { scrollLeft: -150, scrollTop: 0, width: layout.width * z + 300, height: 300 };
  const near = framesNear(layout.items, z, view, 0);

  assert.ok(near.includes('services-index'));
  assert.ok(near.includes('services-show'));
  assert.ok(near.includes('default'), 'the whole templates line is in the view');
  assert.ok(!near.includes('home'));
  assert.ok(!near.includes('news'));
});

// --- URLs ---------------------------------------------------------------------------

test('a frame’s URL carries the view flag and keeps the token', () => {
  const url = new URL(withViewFlag('http://site.test/about?live-preview=x&token=abc', BASE));

  assert.equal(url.searchParams.get(VIEW_FLAG), VIEW_VALUE);
  assert.equal(url.searchParams.get('token'), 'abc');
  assert.equal(url.searchParams.get('live-preview'), 'x');
  assert.equal(withViewFlag('', BASE), '');
  assert.equal(withViewFlag('http://[bad', BASE), '');
  assert.equal(VIEW_FLAG, 'sve_view');
});

test('the frame of the entry being edited takes the preview’s own URL; every other takes the endpoint’s', () => {
  const home = frame('home');
  const about = frame('about');
  const preview = 'http://site.test/?live-preview=zzz&token=form-token';

  assert.equal(new URL(frameSrc(home, 'home', preview, BASE)).searchParams.get('token'), 'form-token');
  assert.equal(new URL(frameSrc(about, 'home', preview, BASE)).searchParams.get('token'), 'tok-about');
  // No preview URL yet (the preview has not rendered): the endpoint's.
  assert.equal(new URL(frameSrc(home, 'home', '', BASE)).searchParams.get('token'), 'tok-home');
  assert.equal(new URL(frameSrc(home, 'home', preview, BASE)).searchParams.get(VIEW_FLAG), VIEW_VALUE);
});

// --- gestures and the pane -----------------------------------------------------------

test('a pointer that moved more than the slop is a pan, not a click', () => {
  assert.equal(isDrag({ x: 0, y: 0 }, { x: 3, y: 2 }), false);
  assert.equal(isDrag({ x: 0, y: 0 }, { x: 5, y: 0 }), true);
  assert.equal(isDrag({ x: 0, y: 0 }, { x: 0, y: -5 }), true);
});

test('the layer covers the pane’s content box: its rect less its padding', () => {
  assert.deepEqual(
    contentBox({ left: 100, top: 50 }, { paddingLeft: '10px', paddingTop: '20px', paddingRight: '10px', paddingBottom: '0px' }, 800, 600),
    { left: 110, top: 70, width: 780, height: 580 }
  );
});

// --- the module's place ----------------------------------------------------------------

test('closed from the start: nothing is open until a Control Panel asks', () => {
  assert.equal(isSiteCanvasOpen(null), false);
});

test('no file imports it statically: the button import()s it, and it import()s the overview only to close it', () => {
  const walk = (dir) => readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);

    return statSync(path).isDirectory() ? walk(path) : /\.(js|vue)$/.test(name) ? [path] : [];
  });
  const users = walk(JS)
    .filter((file) => !file.endsWith('site-canvas.js'))
    .filter((file) => /(?:from\s*|import\(\s*)['"][^'"]*site-canvas\.js['"]/.test(readFileSync(file, 'utf8')))
    .map((file) => relative(JS, file));

  assert.deepEqual(users, ['cp-shell/block-order.js']);

  const shell = readFileSync(join(JS, 'cp-shell/block-order.js'), 'utf8');

  assert.ok(!/from\s*['"][^'"]*site-canvas/.test(shell), 'block-order.js imports it statically');
  assert.equal((shell.match(/import\(\s*['"]\.\.\/site-canvas\.js['"]\s*\)/g) || []).length, 1);

  const self = readFileSync(join(JS, 'site-canvas.js'), 'utf8');

  assert.ok(!/from\s*['"][^'"]*breakpoint-overview/.test(self), 'site-canvas.js imports the overview statically');
  assert.ok(!/from\s*['"](?:\.\.?\/)+(?:preview|overlay-host|bridge|lp-replay)\.js['"]/.test(self), 'site-canvas.js reaches into the kernel');
  assert.ok(!/\b(?:replayLivePreview|watchPreviewRenders|gotoOverlay|openOverlay)\b/.test(self), 'site-canvas.js names a kernel function');
});

test('the overview asks the canvas to close as it opens, and that is its one touch', () => {
  const overview = readFileSync(join(JS, 'breakpoint-overview.js'), 'utf8');

  assert.equal((overview.match(/site-canvas/g) || []).length, 2, 'the comment and the ask, in openBreakpointOverview');
  assert.ok(/ask\(\s*'site-canvas:close'\s*\)/.test(overview));
});
