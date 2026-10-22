import test from 'node:test';
import assert from 'node:assert/strict';
import {
  BP_CHANGED_EVENT,
  applyBreakpointList,
  bpBase,
  bpCascade,
  bpCascadeHandles,
  bpDevice,
  bpDirection,
  bpForDevice,
  bpFromWidth,
  bpHandles,
  bpInherits,
  bpMedia,
  bpRow,
  bpTailwind,
  breakpoints,
} from '../../resources/js/breakpoints.js';

// The one list, always widest first — the order the buttons and tabs draw.
// Which end is the base is the direction PHP derived; every row carries it.
const DESKTOP = [
  { handle: 'laptop', label: 'Laptop', device: 'Laptop', icon: 'laptop', base: true, direction: 'desktop', min: 64, unit: 'em', min_px: 1024, max: null, media: '', media_px: '', tw: '' },
  { handle: 'tablet', label: 'Tablet', device: 'Tablet', icon: 'tablet', base: false, direction: 'desktop', min: 48, unit: 'em', min_px: 768, max: '1023.98px', media: '(width < 64em)', media_px: '(max-width: 1023.98px)', tw: 'max-lg' },
  { handle: 'mobile', label: 'Mobile', device: 'Mobile', icon: 'mobile', base: false, direction: 'desktop', min: 0, unit: 'em', min_px: 0, max: '767.98px', media: '(width < 48em)', media_px: '(max-width: 767.98px)', tw: 'max-md' },
];

const MOBILE = [
  { handle: 'laptop', label: 'Laptop', device: 'Laptop', icon: 'laptop', base: false, direction: 'mobile', min: 64, unit: 'em', min_px: 1024, max: null, media: '(width >= 64em)', media_px: '(min-width: 1024px)', tw: 'lg' },
  { handle: 'tablet', label: 'Tablet', device: 'Tablet', icon: 'tablet', base: false, direction: 'mobile', min: 48, unit: 'em', min_px: 768, max: null, media: '(width >= 48em)', media_px: '(min-width: 768px)', tw: 'md' },
  { handle: 'mobile', label: 'Mobile', device: 'Mobile', icon: 'mobile', base: true, direction: 'mobile', min: 0, unit: 'em', min_px: 0, max: null, media: '', media_px: '', tw: '' },
];

const win = (rows) => ({ Statamic: { $config: { get: (key) => (key === 'sveBreakpoints' ? rows : undefined) } } });

test('the list is read as given, widest first, in both directions', () => {
  assert.deepEqual(bpHandles(win(DESKTOP)), ['laptop', 'tablet', 'mobile']);
  assert.deepEqual(bpHandles(win(MOBILE)), ['laptop', 'tablet', 'mobile']);
  assert.equal(breakpoints(win(DESKTOP)).length, 3);

  const w = win(DESKTOP);
  assert.equal(breakpoints(w), breakpoints(w), 'one normalised list per config array');
  assert.notEqual(breakpoints(win([...DESKTOP])), breakpoints(w), 'a new config array is a new list — how a size added at runtime shows up');
});

test('direction comes from the rows', () => {
  assert.equal(bpDirection(win(DESKTOP)), 'desktop');
  assert.equal(bpDirection(win(MOBILE)), 'mobile');
});

test('a window without a list falls back to the three built-in sizes, desktop-first', () => {
  const empty = { Statamic: { $config: { get: () => undefined } } };

  assert.deepEqual(bpHandles(empty), ['laptop', 'tablet', 'mobile']);
  assert.equal(bpDirection(empty), 'desktop');
  assert.equal(bpBase(empty), 'laptop');
});

test('the cascade starts at the base: widest first desktop-first, narrowest first mobile-first', () => {
  assert.deepEqual(bpCascadeHandles(win(DESKTOP)), ['laptop', 'tablet', 'mobile']);
  assert.deepEqual(bpCascadeHandles(win(MOBILE)), ['mobile', 'tablet', 'laptop']);
  assert.equal(bpCascade(win(MOBILE))[0].base, true);
  assert.equal(bpBase(win(DESKTOP)), 'laptop');
  assert.equal(bpBase(win(MOBILE)), 'mobile');
});

test('a size inherits from everything before it in the cascade, nearest first', () => {
  assert.deepEqual(bpInherits(win(DESKTOP)), { laptop: [], tablet: ['laptop'], mobile: ['tablet', 'laptop'] });
  assert.deepEqual(bpInherits(win(MOBILE)), { mobile: [], tablet: ['mobile'], laptop: ['tablet', 'mobile'] });
});

test('rows are found by handle and by device name', () => {
  assert.equal(bpRow('tablet', win(DESKTOP)).min_px, 768);
  assert.equal(bpRow('nope', win(DESKTOP)), null);
  assert.equal(bpForDevice('Tablet', win(DESKTOP)).handle, 'tablet');
  assert.equal(bpDevice('mobile', win(DESKTOP)), 'Mobile');
});

test('a frame width lands in the size whose range holds it, whichever way the site cascades', () => {
  for (const rows of [DESKTOP, MOBILE]) {
    assert.equal(bpFromWidth(1440, win(rows)), 'laptop');
    assert.equal(bpFromWidth(1024, win(rows)), 'laptop');
    assert.equal(bpFromWidth(1023, win(rows)), 'tablet');
    assert.equal(bpFromWidth(768, win(rows)), 'tablet');
    assert.equal(bpFromWidth(767, win(rows)), 'mobile');
    assert.equal(bpFromWidth(320, win(rows)), 'mobile');
  }
});

test('media and tailwind are read off the row, never derived here', () => {
  assert.equal(bpMedia('tablet', 'em', win(DESKTOP)), '(width < 64em)');
  assert.equal(bpMedia('tablet', 'px', win(DESKTOP)), '(max-width: 1023.98px)');
  assert.equal(bpMedia('laptop', 'em', win(DESKTOP)), '');
  assert.equal(bpTailwind('tablet', win(DESKTOP)), 'max-lg');

  assert.equal(bpMedia('tablet', 'em', win(MOBILE)), '(width >= 48em)');
  assert.equal(bpMedia('tablet', 'px', win(MOBILE)), '(min-width: 768px)');
  assert.equal(bpMedia('mobile', 'em', win(MOBILE)), '');
  assert.equal(bpTailwind('laptop', win(MOBILE)), 'lg');
});

test('the change event has one name everybody listens for', () => {
  assert.equal(BP_CHANGED_EVENT, 'sve:breakpoints-changed');
});

/**
 * Statamic's own Config: `set` writes one top-level key as given, `get` walks
 * a dotted path (resources/js/components/Config.js + util/data_get.js). A
 * stub that behaves the same, so a write that only looks right is caught.
 */
function statamicConfig(values) {
  return {
    values,
    get(key) {
      return key.split('.').reduce((prev, curr) => prev && prev[curr], values);
    },
    set(key, value) {
      values[key] = value;
    },
  };
}

test('a saved list lands where the page load would have put it, and the window is told', () => {
  const $config = statamicConfig({
    sveBreakpoints: DESKTOP,
    livePreview: { devices: { Laptop: { width: 1440, height: 900 } }, enabled: true },
  });
  const events = [];
  const w = {
    Statamic: { $config },
    CustomEvent: class {
      constructor(type, init) {
        this.type = type;
        this.detail = init?.detail;
      }
    },
    dispatchEvent: (event) => events.push(event),
  };
  const wide = { ...DESKTOP[0], handle: 'wide', device: 'Wide', min: 90, min_px: 1440 };
  const next = [wide, ...DESKTOP.map((row) => ({ ...row, base: false }))];
  const devices = { Wide: { width: 1600, height: 900 }, Laptop: { width: 1440, height: 900 } };

  assert.equal(applyBreakpointList(w, { breakpoints: next, devices }), true);

  assert.deepEqual(bpHandles(w), ['wide', 'laptop', 'tablet', 'mobile'], 'breakpoints() reads the new array');
  assert.deepEqual($config.get('livePreview.devices'), devices, 'the device buttons read the new widths through the dotted path');
  assert.equal($config.get('livePreview.enabled'), true, 'the rest of livePreview is kept');
  assert.equal(Object.hasOwn($config.values, 'livePreview.devices'), false, 'no key spelled with a dot');
  assert.equal(events.length, 1);
  assert.equal(events[0].type, BP_CHANGED_EVENT);
  assert.equal(events[0].detail.breakpoints, next);
});

test('an answer without a list changes nothing', () => {
  const $config = statamicConfig({ sveBreakpoints: DESKTOP });
  const w = { Statamic: { $config }, CustomEvent: class {}, dispatchEvent: () => assert.fail('nothing to announce') };

  assert.equal(applyBreakpointList(w, { ok: true }), false);
  assert.equal(applyBreakpointList({ Statamic: {} }, { breakpoints: DESKTOP }), false);
  assert.equal($config.get('sveBreakpoints'), DESKTOP);
});
