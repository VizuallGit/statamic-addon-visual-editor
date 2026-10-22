import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  COLS,
  FIT_MARGIN_PX,
  FRAME,
  GAP,
  GROUP_GAP,
  GROUP_HEAD_PX,
  LABEL_PX,
  LOAD_AT_ONCE,
  LOAD_MARGIN_PX,
  PAD,
  ROW_HEAD_PX,
  VIEW_FLAG,
  VIEW_VALUE,
  ZOOM_MAX,
  ZOOM_MIN,
  anchoredScroll,
  canvasFrames,
  canvasGroups,
  canvasLayout,
  clampZoom,
  contentBox,
  fitZoom,
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

test('frames are one desktop viewport each and wrap at the column count; short rows share a line, groups stand under one another', () => {
  const { items, headings, width } = canvasLayout(canvasGroups(PAYLOAD), 1);

  assert.equal(items.length, 10);
  assert.ok(items.every((item) => item.width === FRAME.width && item.height === FRAME.height));

  // The pages row has five frames: four on one line, one on the next, same x as the first.
  const pages = items.filter((item) => item.group === 'pages');

  assert.deepEqual(pages.map((item) => item.x), [PAD, PAD + FRAME.width + GAP, PAD + 2 * (FRAME.width + GAP), PAD + 3 * (FRAME.width + GAP), PAD]);
  assert.ok(pages[4].y > pages[0].y + FRAME.height, 'the fifth frame is on the next line');
  assert.equal(width, PAD * 2 + COLS * (FRAME.width + GAP) - GAP);

  // Headings: one per group, one per row, in order, each above what it names.
  assert.deepEqual(headings.map((heading) => [heading.kind, heading.title]), [
    ['group', 'Skabeloner'],
    ['row', 'Services'],
    ['row', 'Pages'],
    ['row', 'Sitet'],
    ['group', 'Sider'],
    ['row', 'Pages'],
  ]);
  // Template rows flow along a line: Services (2) and Pages (1) share the first, three columns; Sitet (2) would make five, so it starts the next.
  const [services, pagesRow, sitet] = headings.filter((heading) => heading.kind === 'row');
  const byRow = (key) => items.filter((item) => item.group === 'templates' && item.row === key);

  assert.equal(services.x, PAD);
  assert.equal(pagesRow.x, PAD + 2 * (FRAME.width + GAP));
  assert.equal(pagesRow.y, services.y, 'two short rows share a line');
  assert.deepEqual(byRow('pages').map((item) => [item.x, item.y]), [[PAD + 2 * (FRAME.width + GAP), byRow('services')[0].y]]);
  assert.equal(sitet.x, PAD);
  assert.ok(sitet.y >= byRow('services')[0].y + FRAME.height + GAP, 'the row that does not fit starts a new line under the first');
  assert.ok(byRow('site')[0].y > sitet.y, 'its frames stand under its heading');

  const pagesGroup = headings.find((heading) => heading.kind === 'group' && heading.title === 'Sider');
  const lastTemplate = items.filter((item) => item.group === 'templates').at(-1);

  assert.ok(pagesGroup.y >= lastTemplate.y + FRAME.height + GROUP_GAP, 'the second group stands a group gap under the first');
  assert.ok(pages[0].y > pagesGroup.y, 'the pages stand under their heading');
});

test('a row of more than the column count takes whole lines of its own; a line’s height is its deepest block’s', () => {
  const groups = canvasGroups({
    groups: [{
      key: 'templates',
      title: 'T',
      rows: [
        { key: 'a', title: 'A', frames: [frame('a1')] },
        { key: 'b', title: 'B', frames: [frame('b1'), frame('b2'), frame('b3'), frame('b4'), frame('b5')] },
        { key: 'c', title: 'C', frames: [frame('c1'), frame('c2')] },
        { key: 'd', title: 'D', frames: [frame('d1')] },
      ],
    }],
  });
  const { items, headings, metrics } = canvasLayout(groups, 1);
  const head = (title) => headings.find((heading) => heading.title === title);
  const row = (key) => items.filter((item) => item.row === key);

  // A (1) alone cannot share with B (5 > 4 columns): B starts a new line and spans two; C and D share the line after.
  assert.ok(head('B').y > row('a')[0].y + FRAME.height, 'B under A');
  assert.equal(row('b').map((item) => item.x).join(), [PAD, PAD + (FRAME.width + GAP), PAD + 2 * (FRAME.width + GAP), PAD + 3 * (FRAME.width + GAP), PAD].join());
  assert.ok(head('C').y > row('b')[4].y + FRAME.height, 'C under B’s second line');
  assert.equal(head('D').y, head('C').y, 'C and D share a line');
  assert.equal(head('D').x, PAD + 2 * (FRAME.width + GAP));
  // Screen pixels: one group heading, three lines of row headings, 1 + 2 + 1 lines of labels.
  assert.equal(metrics.screenHeight, GROUP_HEAD_PX + 3 * ROW_HEAD_PX + 4 * LABEL_PX);
});

test('no two frames overlap, at any zoom', () => {
  for (const z of [1, 0.5, 0.12]) {
    const { items } = canvasLayout(canvasGroups(PAYLOAD), z);

    for (const a of items) {
      for (const b of items) {
        if (a === b) {
          continue;
        }

        const apart = a.x + a.width <= b.x || b.x + b.width <= a.x || a.y + a.height <= b.y || b.y + b.height <= a.y;

        assert.ok(apart, `${a.id} and ${b.id} overlap at zoom ${z}`);
      }
    }
  }
});

test('headings and labels keep their screen size: their room on the sheet is their pixels over the zoom, and the metrics add up', () => {
  const groups = canvasGroups(PAYLOAD);
  const at1 = canvasLayout(groups, 1);
  const atHalf = canvasLayout(groups, 0.5);

  // Two groups; three lines of rows (Services and Pages share one, Sitet has one, the pages row one); labels: one line each, two for the pages row.
  const screen = 2 * GROUP_HEAD_PX + 3 * ROW_HEAD_PX + (1 + 1 + 2) * LABEL_PX;

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
  const view = { scrollLeft: first.x, scrollTop: first.y, width: FRAME.width, height: FRAME.height };
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
  // The view is wider than the sheet; the sheet's edge stands 150 px in.
  const view = { scrollLeft: -150, scrollTop: 0, width: layout.width * z + 300, height: 400 };
  const near = framesNear(layout.items, z, view, 0);

  assert.ok(near.includes('services-index'));
  assert.ok(near.includes('services-show'));
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
