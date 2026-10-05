import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { BP_OVERVIEW_ID } from '../../resources/js/lib/ids.js';
import {
  GAP,
  PAD,
  VIEW_FLAG,
  ZOOM_MAX,
  ZOOM_MIN,
  anchoredScroll,
  clampZoom,
  contentBox,
  fitZoom,
  framesTop,
  glideEase,
  holePolygon,
  isDrag,
  isTransparent,
  labelColor,
  nearestSize,
  overviewFrames,
  revealScroll,
  rowWidth,
  sizeLock,
  stashFlags,
  stepZoom,
  syncedScrollTop,
  viewUrl,
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

test('a pointer that barely moved between down and up is a click, not a pan', () => {
  assert.equal(isDrag({ x: 10, y: 10 }, { x: 12, y: 13 }), false);
  assert.equal(isDrag({ x: 10, y: 10 }, { x: 15, y: 10 }), true);
  assert.equal(isDrag({ x: 10, y: 10 }, { x: 10, y: 4 }), true);
});

// --- Synced scroll: the same section under every frame's top edge -----------

// Desktop: a header, three sections and a footer, 900 px of viewport.
const DESKTOP = {
  scrollHeight: 2700,
  viewport: 900,
  anchors: [
    { id: 'chrome:header', top: 0, height: 100 },
    { id: 'a', top: 100, height: 600 },
    { id: 'b', top: 700, height: 500 },
    { id: 'c', top: 1200, height: 1300 },
    { id: 'chrome:footer', top: 2500, height: 200 },
  ],
};
// Mobile: the same page, every section drawn taller.
const MOBILE = {
  scrollHeight: 5400,
  viewport: 800,
  anchors: [
    { id: 'chrome:header', top: 0, height: 80 },
    { id: 'a', top: 80, height: 1400 },
    { id: 'b', top: 1480, height: 1200 },
    { id: 'c', top: 2680, height: 2400 },
    { id: 'chrome:footer', top: 5080, height: 320 },
  ],
};

test('synced scroll: the same section stands under the top edge, as far into it as in the source', () => {
  // 40 % into b on desktop (700 + 0.4 × 500) is 40 % into b on mobile (1480 + 0.4 × 1200).
  assert.equal(syncedScrollTop({ ...DESKTOP, scrollTop: 900 }, MOBILE), 1960);
  // And back again.
  assert.equal(syncedScrollTop({ ...MOBILE, scrollTop: 1960 }, DESKTOP), 900);
  // The edge exactly on a section's top: that section's top.
  assert.equal(syncedScrollTop({ ...DESKTOP, scrollTop: 1200 }, MOBILE), 2680);
  // Header and footer are anchors too: halfway into the header.
  assert.equal(syncedScrollTop({ ...DESKTOP, scrollTop: 50 }, MOBILE), 40);
});

test('synced scroll: a section the target does not have falls back to the same share of the page', () => {
  const noB = { ...MOBILE, anchors: MOBILE.anchors.filter((anchor) => anchor.id !== 'b') };

  // 900 of desktop's 1800 scrollable pixels: half of mobile's 4600.
  assert.equal(syncedScrollTop({ ...DESKTOP, scrollTop: 900 }, noB), 2300);
});

test('synced scroll: an edge above the first anchor, or no anchors at all, goes by share too', () => {
  const late = { ...DESKTOP, anchors: [{ id: 'a', top: 400, height: 600 }] };

  // The edge at 200 is above a's top (400): a fraction of 1800, not of a.
  assert.equal(syncedScrollTop({ ...late, scrollTop: 200 }, MOBILE), Math.round((4600 * 200) / 1800));
  assert.equal(syncedScrollTop({ ...DESKTOP, anchors: [], scrollTop: 450 }, { ...MOBILE, anchors: [] }), 1150);
  // Past the last anchor: by share as well.
  assert.equal(syncedScrollTop({ scrollTop: 300, scrollHeight: 1000, viewport: 400, anchors: [{ id: 'a', top: 0, height: 200 }] }, { scrollHeight: 2200, viewport: 400, anchors: [{ id: 'a', top: 0, height: 900 }] }), 900);
  // A source that cannot scroll is at share 0, not a division by nothing.
  assert.equal(syncedScrollTop({ scrollTop: 0, scrollHeight: 500, viewport: 900, anchors: [] }, MOBILE), 0);
});

test('synced scroll: never past what the target can scroll, never above its top, whole pixels', () => {
  // The source deep in its footer; the target's footer starts past its own end of scroll.
  const short = { scrollHeight: 1000, viewport: 800, anchors: [{ id: 'chrome:footer', top: 900, height: 100 }] };

  assert.equal(syncedScrollTop({ ...DESKTOP, scrollTop: 1800 }, short), 200);
  // A target too short to scroll at all.
  assert.equal(syncedScrollTop({ ...DESKTOP, scrollTop: 900 }, { scrollHeight: 600, viewport: 900, anchors: MOBILE.anchors }), 0);
  // A target section that starts above the page (a negative top): no lower than 0.
  assert.equal(syncedScrollTop({ ...DESKTOP, scrollTop: 100 }, { scrollHeight: 3000, viewport: 800, anchors: [{ id: 'a', top: -50, height: 10 }] }), 0);
  // Fractions round to a whole pixel.
  const third = syncedScrollTop({ scrollTop: 100, scrollHeight: 1200, viewport: 900, anchors: [] }, { scrollHeight: 1900, viewport: 900, anchors: [] });

  assert.equal(third, 333);
  assert.ok(Number.isInteger(syncedScrollTop({ ...DESKTOP, scrollTop: 777 }, MOBILE)));
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

test('any size may leave the row but the last one in it', () => {
  const sizes = [
    { handle: 'mobile', hidden: false, active: false },
    { handle: 'tablet', hidden: false, active: false },
    { handle: 'laptop', hidden: false, active: true },
  ];

  assert.equal(sizeLock(sizes, 'mobile'), '');
  // The size being edited too: the preview moves on (nearestSize).
  assert.equal(sizeLock(sizes, 'laptop'), '');
  assert.equal(sizeLock(sizes, 'nope'), '');

  // The last one ticked stays; one already out may always come back.
  const one = [
    { handle: 'mobile', hidden: true },
    { handle: 'tablet', hidden: false },
    { handle: 'laptop', hidden: true },
  ];

  assert.equal(sizeLock(one, 'tablet'), 'last');
  assert.equal(sizeLock(one, 'mobile'), '');
  assert.equal(sizeLock(one, 'laptop'), '');
});

test('the preview moves to the size still in the row nearest in width, the narrower on a tie', () => {
  const sizes = [
    { handle: 'mobile', width: 375, hidden: false },
    { handle: 'tablet', width: 810, hidden: false },
    { handle: 'laptop', width: 1440, hidden: false },
  ];

  assert.equal(nearestSize(sizes, 'laptop'), 'tablet');
  assert.equal(nearestSize(sizes, 'mobile'), 'tablet');
  assert.equal(nearestSize(sizes, 'tablet'), 'mobile');
  assert.equal(nearestSize(sizes.map((row) => ({ ...row, hidden: row.handle === 'tablet' })), 'laptop'), 'mobile');
  assert.equal(nearestSize([{ handle: 'a', width: 500 }, { handle: 'b', width: 700 }, { handle: 'c', width: 300 }], 'a'), 'c');
  assert.equal(nearestSize([{ handle: 'laptop', width: 1440 }], 'laptop'), '');
  assert.equal(nearestSize(sizes.map((row) => ({ ...row, hidden: row.handle !== 'laptop' })), 'laptop'), '');
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
  // An animation frame is not a timer: the glide asks for one only while a
  // reveal is under way, and stopGlide cancels it on a wheel, a drag, a zoom
  // and on close.
  for (const banned of ['setInterval(', 'setTimeout(', 'MutationObserver', 'chromeSet', 'localStorage', 'sessionStorage', 'sve-lp-zoom']) {
    assert.ok(!code.includes(banned), `breakpoint-overview.js uses ${banned}`);
  }

  assert.ok(/function stopGlide\(/.test(code) && /cancelAnimationFrame\(/.test(code), 'a glide can be cut short');
});

test('a glide starts fast and lands gently, and never overshoots', () => {
  assert.equal(glideEase(0), 0);
  assert.equal(glideEase(1), 1);
  assert.equal(glideEase(2), 1);
  assert.equal(glideEase(-1), 0);
  assert.ok(glideEase(0.25) > 0.25 && glideEase(0.5) > 0.8 && glideEase(0.5) < 0.9);
  assert.ok(glideEase(0.5) - glideEase(0.25) > glideEase(1) - glideEase(0.75), 'slower towards the end');
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
