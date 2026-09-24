import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { BP_OVERVIEW_ID } from '../../resources/js/lib/ids.js';
import {
  GAP,
  HEIGHT_CAP,
  PAD,
  VIEW_FLAG,
  ZOOM_MAX,
  ZOOM_MIN,
  anchoredScroll,
  clampZoom,
  contentBox,
  fitZoom,
  frameHeight,
  framesTop,
  holePolygon,
  isDrag,
  isTransparent,
  knockoutColor,
  labelColor,
  overviewFrames,
  revealScroll,
  rowWidth,
  stashFlags,
  stepZoom,
  viewUrl,
  visibleBand,
} from '../../resources/js/breakpoint-overview.js';

const JS = join(dirname(fileURLToPath(import.meta.url)), '../../resources/js');

// Widest first, as Breakpoints::forScript() hands them over.
const LIST = [
  { handle: 'laptop', device: 'Desktop', label: 'Desktop', base: true },
  { handle: 'tablet', device: 'Tablet', label: 'Tablet', base: false },
  { handle: 'mobile', device: 'Mobile', label: 'Mobile', base: false },
];
const DEVICES = { Desktop: { width: 1440, height: 900 }, Tablet: { width: 810, height: 1080 }, Mobile: { width: 375, height: 812 } };

test('one frame per breakpoint, narrowest first, at the device preset width', () => {
  assert.deepEqual(overviewFrames(LIST, DEVICES), [
    { handle: 'mobile', device: 'Mobile', label: 'Mobile', width: 375 },
    { handle: 'tablet', device: 'Tablet', label: 'Tablet', width: 810 },
    { handle: 'laptop', device: 'Desktop', label: 'Desktop', width: 1440 },
  ]);
});

test('the frame count follows the list — five sizes, five frames', () => {
  const five = [
    { handle: 'wide', device: 'Wide', base: true },
    { handle: 'laptop', device: 'Laptop' },
    { handle: 'tablet', device: 'Tablet' },
    { handle: 'phablet', device: 'Phablet' },
    { handle: 'mobile', device: 'Mobile' },
  ];
  const widths = { Wide: { width: 1920 }, Laptop: { width: 1280 }, Tablet: { width: 810 }, Phablet: { width: 600 }, Mobile: { width: 375 } };

  assert.deepEqual(overviewFrames(five, widths).map((frame) => frame.width), [375, 600, 810, 1280, 1920]);
});

test('the base size falls back to 1440 as applyLpDevice does; a size with no width is left out', () => {
  assert.deepEqual(overviewFrames(LIST, {}).map((frame) => [frame.handle, frame.width]), [['laptop', 1440]]);
  assert.deepEqual(overviewFrames(LIST, null).map((frame) => frame.handle), ['laptop']);
  assert.deepEqual(overviewFrames(null, DEVICES), []);
});

test('a label falls back to the device name', () => {
  assert.equal(overviewFrames([{ handle: 'mobile', device: 'Mobile', base: true }], {})[0].label, 'Mobile');
});

test('the view URL keeps the token and adds the view flag once', () => {
  const url = 'http://site.test/landing?live-preview=AY7h&token=qJYs';
  const out = new URL(viewUrl(url));

  assert.equal(out.searchParams.get(VIEW_FLAG), '1');
  assert.equal(out.searchParams.get('live-preview'), 'AY7h');
  assert.equal(out.searchParams.get('token'), 'qJYs');
  assert.equal(out.pathname, '/landing');
  assert.equal(viewUrl(viewUrl(url)), viewUrl(url));
  assert.equal(viewUrl('/landing?token=x', 'http://site.test/cp/entries/1'), 'http://site.test/landing?token=x&sve_view=1');
  assert.equal(new URL(viewUrl(url, undefined, 'mobile')).searchParams.get(VIEW_FLAG), 'mobile');
  assert.notEqual(viewUrl(url, undefined, 'mobile'), viewUrl(url, undefined, 'tablet'));
  assert.equal(viewUrl(''), '');
  assert.equal(viewUrl(null), '');
  assert.equal(viewUrl('/no-base'), '');
});

test('the unsaved-work flags the preview fetches with ride along on a frame URL', () => {
  const url = 'http://site.test/landing?token=qJYs';
  const both = new URL(viewUrl(url, undefined, 'tablet', ['sve_globals', 'sve_sections']));

  assert.equal(both.searchParams.get('sve_globals'), '1');
  assert.equal(both.searchParams.get('sve_sections'), '1');
  assert.equal(both.searchParams.get(VIEW_FLAG), 'tablet');
  assert.equal(both.searchParams.get('token'), 'qJYs');
  assert.equal(new URL(viewUrl(url, undefined, 'tablet', [])).searchParams.has('sve_globals'), false);
});

test('which flags: the globals stash while a global set is edited, the section stash while a global section is', () => {
  assert.deepEqual(stashFlags({ globalsStashActive: false, sectionPanelValues: null }), []);
  assert.deepEqual(stashFlags({ globalsStashActive: true, sectionPanelValues: null }), ['sve_globals']);
  assert.deepEqual(stashFlags({ globalsStashActive: false, sectionPanelValues: { id: 'x', values: {} } }), ['sve_sections']);
  assert.deepEqual(stashFlags({ globalsStashActive: true, sectionPanelValues: { id: 'x', values: {} } }), ['sve_globals', 'sve_sections']);
  assert.deepEqual(stashFlags({}), []);
});

test('fit all puts every frame, gap and padding in the view, never above 100%', () => {
  const widths = [375, 810, 1440];
  const total = 375 + 810 + 1440 + GAP * 2 + PAD * 2;

  assert.equal(rowWidth(widths), total);
  assert.equal(fitZoom(736, widths), 736 / total);
  assert.ok(rowWidth(widths) * fitZoom(736, widths) <= 736);
  assert.equal(fitZoom(10000, widths), 1);
  assert.equal(fitZoom(0, widths), 1);
  assert.equal(fitZoom(736, []), 1);
});

test('zoom stays between its bounds', () => {
  assert.equal(clampZoom(0.001), ZOOM_MIN);
  assert.equal(clampZoom(50), ZOOM_MAX);
  assert.equal(clampZoom(0.5), 0.5);
  assert.equal(clampZoom(Number.NaN), 1);
  assert.equal(clampZoom(-1), 1);
});

test('the buttons step along the ladder, from wherever fit left the zoom', () => {
  assert.equal(stepZoom(0.258, 1), 0.33);
  assert.equal(stepZoom(0.258, -1), 0.25);
  assert.equal(stepZoom(1, 1), 1.5);
  assert.equal(stepZoom(1, -1), 0.75);
  assert.equal(stepZoom(ZOOM_MAX, 1), ZOOM_MAX);
  assert.equal(stepZoom(0.07, -1), ZOOM_MIN);
});

test('the frames start below the labels, and the labels keep their room at any zoom', () => {
  assert.equal(framesTop(1, 32), PAD);
  assert.equal(framesTop(0.25, 32), 32);
});

test('zooming keeps the point under the pointer where it was', () => {
  const cases = [
    { scroll: 0, pointer: 300, before: 12, after: 40, z0: 0.25, z1: 0.5 },
    { scroll: 900, pointer: 120, before: 0, after: 0, z0: 1, z1: 0.33 },
    { scroll: 250, pointer: 368, before: 32, after: 48, z0: 0.5, z1: 1 },
  ];

  for (const { scroll, pointer, before, after, z0, z1 } of cases) {
    const content = (scroll + pointer - before) / z0; // canvas pixels under the pointer
    const next = anchoredScroll(scroll, pointer, before, after, z0, z1);

    assert.ok(Math.abs((next + pointer - after) / z1 - content) < 1e-9);
  }
});

test('picking a size scrolls the row the shortest way until its frame is whole in view', () => {
  // A 1440 px view over a row at 100 %: mobile 375 wide at 48, tablet 810 at
  // 487, desktop 1440 at 1361 — the padding and gaps between them.
  const view = 1440;
  const mobile = [48, 423];
  const tablet = [487, 1297];
  const desktop = [1361, 2801];

  // Already in view: nothing moves.
  assert.equal(revealScroll(0, view, ...mobile), 0);
  assert.equal(revealScroll(0, view, ...tablet), 0);
  assert.equal(revealScroll(100, view, ...tablet), 100);
  // Off to the right: its right edge comes to the view's right edge.
  assert.equal(revealScroll(0, view, 1361, 2000), 2000 - view);
  // Off to the left: its left edge comes to the view's left edge.
  assert.equal(revealScroll(1361, view, ...mobile), 48);
  assert.equal(revealScroll(1361, view, ...tablet), 487);
  // Partly out on either side counts as out.
  assert.equal(revealScroll(1000, view, ...tablet), 487);
  assert.equal(revealScroll(400, view, 1000, 2000), 560);
});

test('a frame wider than the view stands with its left edge at the view\'s left edge, wherever the row was', () => {
  const desktop = [1361, 2801];

  assert.equal(revealScroll(0, 1440, ...desktop), 1361);
  assert.equal(revealScroll(3000, 1440, ...desktop), 1361);
  assert.equal(revealScroll(1361, 1440, ...desktop), 1361);
  assert.equal(revealScroll(1500, 1440, ...desktop), 1361);
  // Exactly as wide as the view is "wider": the left edge, not the right.
  assert.equal(revealScroll(700, 1440, 0, 1440), 0);
});

test('the hole: the layer’s outline and then the slot’s, under the even-odd rule', () => {
  assert.equal(
    holePolygon(1440, 848, { left: 687.9, top: 32, width: 727.836, height: 1225.7 }),
    'polygon(evenodd, 0 0, 1440px 0, 1440px 848px, 0 848px, 0 0, 687.9px 32px, 687.9px 1257.7px, 1415.74px 1257.7px, 1415.74px 32px, 687.9px 32px)'
  );
});

test('the visible band: the part of the slot inside the view, in the page’s own pixels', () => {
  const view = { left: 0, top: 52, width: 1440, height: 848 };

  // The slot starts below the view's top and runs past its bottom.
  assert.deepEqual(visibleBand({ left: 688, top: 84, width: 728, height: 1226 }, view, 0.5), { left: 0, top: 0, width: 1456, height: 1632 });
  // Panned down: the slot's top is above the view.
  assert.deepEqual(visibleBand({ left: 688, top: -216, width: 728, height: 1226 }, view, 0.5), { left: 0, top: 536, width: 1456, height: 1696 });
  // Panned past it: nothing of it on screen.
  assert.deepEqual(visibleBand({ left: 688, top: -2000, width: 728, height: 1226 }, view, 0.5).height, 0);
  // A frame wider than the view: only what is inside counts.
  assert.deepEqual(visibleBand({ left: -100, top: 84, width: 1600, height: 400 }, view, 1), { left: 100, top: 0, width: 1440, height: 400 });
});

test('a pointer that barely moved between down and up is a click, not a pan', () => {
  assert.equal(isDrag({ x: 10, y: 10 }, { x: 12, y: 13 }), false);
  assert.equal(isDrag({ x: 10, y: 10 }, { x: 15, y: 10 }), true);
  assert.equal(isDrag({ x: 10, y: 10 }, { x: 10, y: 4 }), true);
});

test('a frame is its document tall, filling the view at least and cut at the cap', () => {
  assert.equal(frameHeight(3200.2, 1500), 3201);
  assert.equal(frameHeight(900, 1567.4), 1568);
  assert.equal(frameHeight(24000, 1500), HEIGHT_CAP);
  assert.equal(frameHeight(0, 0), 0);
  assert.equal(frameHeight(undefined, 400), 400);
});

test('the layer covers the pane without the padding the docks sit on', () => {
  const rect = { left: 352, top: 52, width: 1088, height: 848 };
  const style = { paddingTop: '0px', paddingRight: '352px', paddingBottom: '280px', paddingLeft: '0px', borderLeftWidth: '0px', borderTopWidth: '0px' };

  assert.deepEqual(contentBox(rect, style, 1088, 848), { left: 352, top: 52, width: 736, height: 568 });
  assert.deepEqual(contentBox({ left: 0, top: 52 }, { paddingLeft: '10px', paddingTop: '5px', borderLeftWidth: '1px', borderTopWidth: '1px' }, 100, 50), { left: 11, top: 58, width: 90, height: 45 });
});

test('transparent means no alpha — not a colour whose last channel is 0', () => {
  assert.equal(isTransparent('rgba(0, 0, 0, 0)'), true);
  assert.equal(isTransparent('transparent'), true);
  assert.equal(isTransparent(''), true);
  assert.equal(isTransparent('rgb(0 0 0 / 0)'), true);
  assert.equal(isTransparent('rgb(10, 20, 0)'), false);
  assert.equal(isTransparent('rgba(49, 49, 52, 0.5)'), false);
  assert.equal(isTransparent('oklch(0.274 0.006 286.033)'), false);
});

test('a knock-out ring is the see-through group colour laid over the header, as one colour', () => {
  assert.equal(knockoutColor('rgba(128, 128, 128, 0.16)', 'rgb(30, 30, 30)'), 'color-mix(in srgb, rgb(128, 128, 128) 16%, rgb(30, 30, 30))');
  assert.equal(knockoutColor('rgba(128 128 128 / 16%)', 'oklch(0.2 0 0)'), 'color-mix(in srgb, rgb(128, 128, 128) 16%, oklch(0.2 0 0))');
  assert.equal(knockoutColor('rgb(46, 46, 48)', 'rgb(30, 30, 30)'), 'rgb(46, 46, 48)');
  assert.equal(knockoutColor('rgba(0, 0, 0, 0)', 'rgb(30, 30, 30)'), 'rgb(30, 30, 30)');
  assert.equal(knockoutColor('rgba(10, 20, 30, 1)', 'rgb(30, 30, 30)'), 'rgb(10, 20, 30)');
  assert.equal(knockoutColor('', 'Canvas'), 'Canvas');
});

test('labels are light on a dark pane and dark on a light one', () => {
  const light = 'rgba(255, 255, 255, .8)';
  const dark = 'rgba(24, 24, 27, .8)';

  assert.equal(labelColor('rgb(49, 49, 52)'), light);
  assert.equal(labelColor('rgb(244, 244, 245)'), dark);
  assert.equal(labelColor('oklch(0.274 0.006 286.033)'), light);
  assert.equal(labelColor('oklch(96% 0.001 286)'), dark);
  assert.equal(labelColor('lab(29 1 -4)'), light);
  assert.equal(labelColor('Canvas'), light);
});

// --- The three owner's rules, held in the source ------------------------------

const source = readFileSync(join(JS, 'breakpoint-overview.js'), 'utf8');
const code = source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');

test('closed costs nothing: no timers, no MutationObserver, no stored state', () => {
  for (const banned of ['setInterval(', 'setTimeout(', 'requestAnimationFrame(', 'MutationObserver', 'chromeSet', 'localStorage', 'sessionStorage', 'sve-lp-zoom']) {
    assert.ok(!code.includes(banned), `breakpoint-overview.js uses ${banned}`);
  }
});

test('it hangs nothing on its own window and registers nothing on the bus', () => {
  // The one thing it sets outside itself is `__sveMirror` on the preview's
  // window, while open; tests/js/mirror.test.js holds that, and the browser
  // proof sees it gone after a close.
  assert.ok(!/window\.\w+\s*=/.test(code), 'assigns onto window');
  assert.ok(!/\bregister\(/.test(code), 'registers a bus handler');
});

test('the layer id is the shared one: the paint script spells it, lib/preview-frame.js reads it', () => {
  assert.ok(code.includes('const LAYER_ID = BP_OVERVIEW_ID;'));
  assert.ok(readFileSync(join(JS, 'dock-instant-preview.js'), 'utf8').includes(`getElementById('${BP_OVERVIEW_ID}')`), 'dock-instant-preview.js spells BP_OVERVIEW_ID');
  assert.ok(readFileSync(join(JS, 'lib/preview-frame.js'), 'utf8').includes('BP_OVERVIEW_ID'));
});

test('no file depends on it: the button import()s it and nothing imports it statically', () => {
  const walk = (dir) => readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);

    return statSync(path).isDirectory() ? walk(path) : /\.(js|vue)$/.test(name) ? [path] : [];
  });
  const users = walk(JS)
    .filter((file) => !file.endsWith('breakpoint-overview.js'))
    .filter((file) => /(?:from\s*|import\(\s*)['"][^'"]*breakpoint-overview\.js['"]/.test(readFileSync(file, 'utf8')))
    .map((file) => relative(JS, file));

  assert.deepEqual(users, ['cp-shell/block-order.js']);

  const shell = readFileSync(join(JS, 'cp-shell/block-order.js'), 'utf8');

  assert.ok(!/from\s*['"][^'"]*breakpoint-overview/.test(shell), 'block-order.js imports it statically');
  assert.equal((shell.match(/import\(\s*['"]\.\.\/breakpoint-overview\.js['"]\s*\)/g) || []).length, 1);
});
