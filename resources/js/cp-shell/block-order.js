/**
 * cp.js — region "block-order", split out in WP5. Same statements, same order;
 * only the imports are new. See the barrel cp.js for what the shell exports.
 */
import { emit, register } from '../cp/bus.js';
import { bpBase, bpDevice, bpForDevice, bpFromWidth, bpInherits, breakpoints } from '../breakpoints.js';
import { bindTips } from '../cp/tip.js';
import { t } from '../lib/i18n.js';
import { chromeGet, chromeSet } from '../chrome-prefs.js';
import { featureOn } from '../lib/config.js';
import { LP_CONTROL_H, LP_ICON_BTN_STYLE, LP_ICON_IDLE_OPACITY, LP_ICON_LOCKED_OPACITY, LP_PREVIEW_CHROME_ID, LP_TOOLBAR_GAP } from '../lib/ids.js';
import { unwrapRef } from '../lib/values.js';
import { lpHeader } from '../lib/live-preview.js';
import { previewFrame } from '../lib/preview-frame.js';
import { activeContainers } from '../lib/publish-containers.js';
import { lpModeSeparator, paintLpActiveControl, paintLpSaveButton, syncLpRightBarGaps } from '../lp-panel.js';
import { LP_DEVICE_ICONS, LP_DEVICE_KEY, LP_SCALE_DEVICE_TO_PANE, LP_ZOOM_DEFAULT, LP_ZOOM_KEY, LP_ZOOM_STEPS, lpChromeActiveDevice, lpConfiguredDevices, lpDeviceKeys, lpStoredDevice } from './preview-chrome.js';
import { FRAMED_CONTROL_STYLE, HEADER_GROUP_STYLE, HEADER_TOOLBAR_ID } from './header-toolbar.js';
import { hideStatamicLpClose } from './grid-rows.js';

// ===== block-order =====
// --- Per-breakpoint block order ---------------------------------------------
//
// A block field is one array, and one array is one order for every screen size.
// A section that wants its own order per size declares a `block_order` field
// beside the block field; this fills it in with the row ids in the order they
// are on screen, one entry per breakpoint.
//
// Two rules learned the hard way, both about writing into a form somebody else
// owns:
//
//  - The order lives in ONE field on the section, never in a field added to each
//    block. A field on a set has to be answered for whenever Statamic builds a
//    new one of that set, and that is the path an editor uses constantly.
//  - It is written when the device changes and at no other time. A timer writing
//    into the form re-renders the page builder underneath whatever the editor is
//    doing — and a re-render landing mid-request leaves Statamic's own promises
//    unsettled, which is a spinner that never stops.
//
// So: drag as you always have. On the way out of a breakpoint the order you left
// behind is written down, and the array is sorted into the one you are going to.

// One field per breakpoint, not one field holding a map of them. Statamic's
// `array` fieldtype reshapes what it is given into key/value pairs, so a map of
// lists comes back out the other side as an error; `list` is the fieldtype that
// stores exactly a list of strings and hands it back unchanged.
export const BLOCK_ORDER_PREFIX = 'block_order_';
export const BLOCK_ORDER_FIELD = 'blocks';

export const orderField = (bp) => BLOCK_ORDER_PREFIX + bp;

/**
 * Desktop-first, like the rest of the responsive work: no order = inherit up.
 *
 * A getter, not a constant: the chain is derived from the breakpoint list, and
 * that list is only filled once the Control Panel has booted. Callers read it
 * as they always did — `BP_INHERITS[bp]` — and get today's answer.
 */
export const BP_INHERITS = new Proxy(
  {},
  {
    get: (_, key) => (typeof key === 'string' ? bpInherits(window)[key] : undefined),
    has: (_, key) => typeof key === 'string' && key in bpInherits(window),
    ownKeys: () => Object.keys(bpInherits(window)),
    getOwnPropertyDescriptor: (_, key) => ({
      enumerable: typeof key === 'string' && key in bpInherits(window),
      configurable: true,
      value: bpInherits(window)[key],
    }),
  }
);

/**
 * The breakpoint being edited — the same answer the responsive fields give.
 *
 * Full-width is not a synonym for laptop: it fills the pane, and at a narrow
 * pane that is tablet or mobile. The base stays the base even when scaled down.
 */
export function currentBp(win) {
  const device = chromeGet(win, LP_DEVICE_KEY) || 'Responsive';
  const row = bpForDevice(device, win);

  if (row) {
    return row.handle;
  }

  // Full-width: the page is as wide as the pane, so the breakpoint follows it.
  return lpWidthToBp(lpPaneInnerSize(win).width || 1200);
}

/** Does this list name exactly the blocks that exist right now? */
export function describesBlocks(list, ids) {
  return (
    Array.isArray(list) &&
    list.length === ids.length &&
    [...list].sort().join('') === [...ids].sort().join('')
  );
}

/**
 * The order in force at `bp`, following the cascade up. Null when there is none.
 *
 * A list that no longer names the blocks that exist counts as none. It is only
 * written on the way out of a breakpoint, so adding or deleting a block leaves
 * it talking about a set that is gone — and applying it anyway would reorder the
 * panel by a rule the editor cannot see, moving a block they just added away
 * from where they put it. Ignored instead, the field's own order stands until
 * the next drag writes a list that fits.
 */
export function orderFor(row, bp) {
  if (!row || typeof row !== 'object') {
    return null;
  }

  const ids = blockIds(row);

  for (const key of [bp, ...BP_INHERITS[bp]]) {
    const list = row[orderField(key)];

    if (Array.isArray(list) && list.length && describesBlocks(list, ids)) {
      return list;
    }
  }

  return null;
}

/**
 * Every section row that opted in, as `{container, path, row}`.
 *
 * Opting in is declaring the field: a section with no `block_order` is left
 * exactly as it was, which is what keeps this off every other section on the
 * site — and off every site that has never asked for it.
 */
export function orderableSections(doc) {
  const found = [];
  const win = doc?.defaultView || window;

  for (const container of activeContainers(doc)) {
    const values = unwrapRef(container.values);

    if (!values || typeof values !== 'object') {
      return found;
    }

    const walk = (node, path, depth) => {
      if (depth > 12 || !node || typeof node !== 'object') {
        return;
      }

      if (Array.isArray(node)) {
        node.forEach((item, i) => walk(item, `${path}.${i}`, depth + 1));

        return;
      }

      // The base size's own list is the marker: every section that keeps a
      // per-size order has one, whatever the sizes are called here.
      if (
        Object.prototype.hasOwnProperty.call(node, orderField(bpBase(win))) &&
        Array.isArray(node[BLOCK_ORDER_FIELD])
      ) {
        found.push({ container, path, row: node });
      }

      for (const [key, value] of Object.entries(node)) {
        if (value && typeof value === 'object') {
          walk(value, path ? `${path}.${key}` : key, depth + 1);
        }
      }
    };

    walk(values, '', 0);

    return found;
  }

  return found;
}

/** Row ids in their current on-screen order. */
export function blockIds(row) {
  return (row[BLOCK_ORDER_FIELD] || []).map((block) => block?._id).filter(Boolean);
}

export function sameOrder(a, b) {
  return Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((id, i) => id === b[i]);
}

/**
 * Writes the order now on screen down for `bp`.
 *
 * Only where it differs from the order inherited from the bigger screen — so
 * merely looking at mobile never gives mobile an order of its own, and dragging
 * it back into step drops the override again and resumes inheriting.
 */
export function recordBlockOrder(doc, bp) {
  orderableSections(doc).forEach(({ container, path, row }) => {
    const ids = blockIds(row);

    if (ids.length < 2) {
      return;
    }

    const stored = row[orderField(bp)];

    if (sameOrder(stored, ids)) {
      return;
    }

    // Only ever written, never cleared.
    //
    // It used to drop the override when the order matched the bigger screen
    // again — tidy, and wrong: arriving at a breakpoint sorts the array into its
    // order, and a tick landing in the moment before that write settles sees the
    // order it is about to leave behind. "In step, so forget it" then threw away
    // the very order it was on its way to restoring. An override that outlives
    // its usefulness renders identically to none at all; one deleted by a race
    // is somebody's work gone.
    container.setFieldValue(`${path}.${orderField(bp)}`, ids);
  });
}

/** Sorts each section's blocks into `bp`'s order, so the panel shows it too. */
export function sortBlockOrder(doc, bp) {
  orderableSections(doc).forEach(({ container, path, row }) => {
    const rows = row[BLOCK_ORDER_FIELD];

    if (!Array.isArray(rows) || rows.length < 2) {
      return;
    }

    const wanted = orderFor(row, bp);

    if (!wanted) {
      return;
    }

    const byId = new Map(rows.map((block) => [block?._id, block]));
    const next = wanted.map((id) => byId.get(id)).filter(Boolean);

    // Anything the stored order doesn't mention — a block added since — keeps
    // its place at the end rather than disappearing from the panel.
    rows.forEach((block) => {
      if (!next.includes(block)) {
        next.push(block);
      }
    });

    if (next.length !== rows.length || next.every((block, i) => block === rows[i])) {
      return;
    }

    container.setFieldValue(`${path}.${BLOCK_ORDER_FIELD}`, next);
  });
}

/**
 * Writes a drag down as it happens, so the page reorders while you watch rather
 * than on the next device switch.
 *
 * Silent on the base size, and that is the whole safety of it. The base is where
 * blocks are added and fields are edited, and a write there re-renders the page
 * builder underneath that work — which is what once left Statamic's set picker
 * spinning forever. Its own order is written once, on the way out, by
 * `setLpDevice`. Everywhere else this only writes when the order actually changed.
 */
export function watchBlockOrder(win) {
  if (win.__sveBlockOrderWatch) {
    return;
  }

  win.__sveBlockOrderWatch = setInterval(() => {
    const bp = currentBp(win);

    if (bp === bpBase(win)) {
      return;
    }

    // Arriving at a breakpoint sorts the array into its order, and that write
    // takes a moment to settle. Recording in that moment would file the order
    // being left behind as this breakpoint's own — overwriting the one it is on
    // its way to restoring. Nothing is dragged in the first half second of a
    // switch anyway, so there is nothing to lose by waiting.
    if (Date.now() < blockOrderSettleUntil) {
      return;
    }

    try {
      recordBlockOrder(win.document, bp);
    } catch {
      /* a form mid-render is not worth a thrown interval */
    }
  }, 400);
}

/** Set on a device switch; the watcher holds off until the sort has landed. */
export let blockOrderSettleUntil = 0;

export function setLpDevice(win, key) {
  // Read while nothing has moved yet: this is the breakpoint whose order the
  // array currently is, and the only moment it can still be identified.
  const from = currentBp(win);

  recordBlockOrder(win.document, from);

  // Nothing may record between here and the sort below. Both breakpoints are in
  // play across those lines, and a tick landing in the middle would file one
  // order under the other's name — which is how the base size and tablet ended
  // up holding the same thing.
  blockOrderSettleUntil = Date.now() + 1200;

  chromeSet(win, LP_DEVICE_KEY, String(key));

  // Panels that follow the size being looked at — the Tailwind switch does —
  // hear it here rather than polling the stored value.
  emit('lp:device', String(key));

  // Before the sort, not after. In Fit the breakpoint is read off the preview's
  // width, and until this has run that width is still the one being left — so a
  // sort placed above it would quietly sort into the order it came from.
  applyLpDevice(win, key);
  applyLpZoom(win);
  paintLpPreviewChrome(win);

  // A device names its own size; only Fit has to be read off the pane.
  const named = bpForDevice(key, win)?.handle || '';
  const to = named || currentBp(win);

  sortBlockOrder(win.document, to);

  // Fit has no width of its own — it takes the pane's, and the class that gives
  // it that may still be settling. One more pass inside the quiet window, which
  // costs nothing when the first one already got it right.
  if (!named) {
    setTimeout(() => sortBlockOrder(win.document, currentBp(win)), 350);
  }

  watchBlockOrder(win);

  dispatchLpBreakpoint(win, key);
  watchLpResponsiveWidth(win);
}

/** Map a preview width to the responsive field drawer (desktop-first). */
/**
 * The same door the toolbar's own buttons use, for panels that offer the
 * sizes too. Goes through setLpDevice so the block-order bookkeeping it does
 * first is not skipped.
 */
register('lp:set-device', ({ win, key } = {}) => {
  if (win && key) {
    setLpDevice(win, key);
  }
});

export function lpWidthToBp(width, win = window) {
  return bpFromWidth(width, win);
}

/**
 * Full-width fills the pane and never auto-zooms. Device presets lock a CSS
 * width and scale down when the pane is narrower than that frame.
 */
export function lpShouldFillPane(win) {
  return lpStoredDevice(win) === 'Responsive';
}

export function dispatchLpBreakpoint(win, deviceKey = lpStoredDevice(win)) {
  let bp = bpBase(win);

  if (deviceKey === 'Responsive') {
    bp = lpWidthToBp(lpPaneInnerSize(win).width || 1200);
  } else {
    bp = bpForDevice(deviceKey, win)?.handle || bp;
  }

  try {
    win.dispatchEvent(
      new CustomEvent('sve:breakpoint', { detail: { bp, device: deviceKey } })
    );
  } catch {
    /* ignore */
  }
}

export function applyLpDevice(win, key = lpStoredDevice(win)) {
  const doc = win.document;
  const iframe = previewFrame(doc);

  if (!iframe) {
    return;
  }

  const devices = lpConfiguredDevices(win);
  let preset = key && key !== 'Responsive' ? devices[key] : null;

  if (!preset && key && key === bpDevice(bpBase(win), win)) {
    preset = { width: 1440, height: 900 };
  }
  const contents = doc.querySelector('.live-preview-contents');

  if (contents) {
    // Keep Statamic's gutter (theme gray-500). Do not paint white/black over it —
    // that flash shows when the window resizes and the pane reflows.
    if (contents.style.getPropertyValue('background-color')) {
      contents.style.removeProperty('background-color');
    }

    // Column flex: align-items = horizontal, justify-content = vertical.
    // Scale-to-fit owns align-items in applyLpZoom (left while scaled, else center).
    if (!LP_SCALE_DEVICE_TO_PANE && contents.style.getPropertyValue('align-items') !== 'center') {
      contents.style.setProperty('align-items', 'center', 'important');
    }

    if (contents.style.getPropertyValue('justify-content') !== 'flex-start') {
      contents.style.setProperty('justify-content', 'flex-start', 'important');
    }
  }

  // Idempotent writes only — unconditional style/class changes retrigger
  // watchLpIframeChrome and freeze Live Preview in an attribute loop.
  if (!preset) {
    if (iframe.classList.contains('device')) {
      iframe.classList.remove('device');
    }

    if (!iframe.classList.contains('responsive')) {
      iframe.classList.add('responsive');
    }

    if (iframe.style.getPropertyValue('width')) {
      iframe.style.removeProperty('width');
    }

    if (iframe.style.getPropertyValue('height') !== '100%') {
      iframe.style.setProperty('height', '100%', 'important');
    }

    // Clear device-only chrome Statamic adds (margin-top gap, shadow, radius).
    ['margin-top', 'border-radius', 'box-shadow', 'max-height'].forEach((prop) => {
      if (iframe.style.getPropertyValue(prop)) {
        iframe.style.removeProperty(prop);
      }
    });

    return;
  }

  if (iframe.classList.contains('responsive')) {
    iframe.classList.remove('responsive');
  }

  if (!iframe.classList.contains('device')) {
    iframe.classList.add('device');
  }

  const wantW = `${preset.width}px`;

  // !important: Statamic's Live Preview Vue resets inline width/height on refresh
  // to the preset's fixed px. We only want width from the preset — height always
  // fills the pane, flush to the top (no margin-top black bar).
  if (iframe.style.getPropertyValue('width') !== wantW) {
    iframe.style.setProperty('width', wantW, 'important');
  }

  if (iframe.style.getPropertyValue('height') !== '100%') {
    iframe.style.setProperty('height', '100%', 'important');
  }

  if (iframe.style.getPropertyValue('margin-top') !== '0px') {
    iframe.style.setProperty('margin-top', '0', 'important');
  }

  if (iframe.style.getPropertyValue('max-height') !== 'none') {
    iframe.style.setProperty('max-height', 'none', 'important');
  }

  if (iframe.style.getPropertyValue('max-width') !== 'none') {
    iframe.style.setProperty('max-width', 'none', 'important');
  }

  // Drop the floating “device card” look — same flush frame as Fit mode.
  if (iframe.style.getPropertyValue('border-radius') !== '0px') {
    iframe.style.setProperty('border-radius', '0', 'important');
  }

  if (iframe.style.getPropertyValue('box-shadow') !== 'none') {
    iframe.style.setProperty('box-shadow', 'none', 'important');
  }
}

/** When Fit/Responsive is active, re-broadcast breakpoint as the pane resizes. */
export let lpResponsiveWidthObserver = null;
export let lpResponsiveWidthTarget = null;
export let lpResponsiveWidthLastBp = null;

export function lpDeviceCssWidth(win, key = lpStoredDevice(win)) {
  const devices = lpConfiguredDevices(win);

  if (key && key !== 'Responsive' && devices[key]) {
    return devices[key].width;
  }

  return devices[bpDevice(bpBase(win), win)]?.width || 1440;
}

export function watchLpResponsiveWidth(win) {
  if (LP_SCALE_DEVICE_TO_PANE) {
    watchLpPreviewFit(win);

    return;
  }

  const iframe = previewFrame(win.document);

  if (!iframe) {
    return;
  }

  const device = lpStoredDevice(win);

  if (device !== 'Responsive') {
    lpResponsiveWidthObserver?.disconnect();
    lpResponsiveWidthObserver = null;
    lpResponsiveWidthTarget = null;
    lpResponsiveWidthLastBp = null;

    return;
  }

  if (lpResponsiveWidthTarget === iframe && lpResponsiveWidthObserver) {
    return;
  }

  lpResponsiveWidthObserver?.disconnect();
  lpResponsiveWidthTarget = iframe;
  lpResponsiveWidthLastBp = null;

  const tick = () => {
    if (lpStoredDevice(win) !== 'Responsive') {
      return;
    }

    const w = iframe.clientWidth || iframe.offsetWidth || 0;
    const bp = lpWidthToBp(w || 1200);

    if (bp === lpResponsiveWidthLastBp) {
      return;
    }

    lpResponsiveWidthLastBp = bp;
    dispatchLpBreakpoint(win, 'Responsive');
    paintLpPreviewChrome(win);
  };

  lpResponsiveWidthObserver = new win.ResizeObserver(tick);
  lpResponsiveWidthObserver.observe(iframe);
  tick();
}

/** Keep the scaled preview fitted when sidebars open or the window resizes. */
export function watchLpPreviewFit(win) {
  const contents = win.document.querySelector('.live-preview-contents');

  if (!contents) {
    return;
  }

  if (lpResponsiveWidthTarget === contents && lpResponsiveWidthObserver) {
    return;
  }

  lpResponsiveWidthObserver?.disconnect();
  lpResponsiveWidthTarget = contents;

  const tick = () => {
    applyLpDevice(win);
    applyLpZoom(win);
    paintLpPreviewChrome(win);

    if (lpStoredDevice(win) === 'Responsive') {
      const bp = lpWidthToBp(lpPaneInnerSize(win).width || 1200);

      if (bp !== lpResponsiveWidthLastBp) {
        lpResponsiveWidthLastBp = bp;
        dispatchLpBreakpoint(win, 'Responsive');
      }
    }
  };

  lpResponsiveWidthObserver = new win.ResizeObserver(tick);
  lpResponsiveWidthObserver.observe(contents);
  tick();
}

export function lpPaneInnerSize(win) {
  const pane = win.document.querySelector('.live-preview-contents');

  if (!pane) {
    return { width: 0, height: 0 };
  }

  const style = win.getComputedStyle(pane);
  const padL = parseFloat(style.paddingLeft) || 0;
  const padR = parseFloat(style.paddingRight) || 0;
  const padT = parseFloat(style.paddingTop) || 0;
  const padB = parseFloat(style.paddingBottom) || 0;

  return {
    width: Math.max(0, pane.clientWidth - padL - padR),
    height: Math.max(0, pane.clientHeight - padT - padB),
  };
}

export function lpFitScale(win) {
  const deviceW = lpDeviceCssWidth(win);
  const paneW = lpPaneInnerSize(win).width;

  if (!deviceW || !paneW) {
    return 1;
  }

  return Math.min(1, paneW / deviceW);
}

/** Zoom never goes past 100% — on any device, including full-width. */
export function lpMaxStoredZoom(_win) {
  return 100;
}

export function lpZoomInAllowed(win) {
  return lpStoredZoom(win) < lpMaxStoredZoom(win);
}

export function lpNextZoomIn(win) {
  const cur = lpStoredZoom(win);
  const max = lpMaxStoredZoom(win);
  const next = LP_ZOOM_STEPS.find((step) => step > cur && step <= max);

  if (next != null) {
    return next;
  }

  return cur < max ? max : cur;
}

export function lpZoomIsAuto(win) {
  if (!LP_SCALE_DEVICE_TO_PANE || lpShouldFillPane(win)) {
    return false;
  }

  return lpStoredZoom(win) === 100 && lpFitScale(win) < 0.995;
}

/** The zoom the preview actually shows — fit-to-pane times the user's zoom. */
export function lpVisualZoom(win, percent = lpStoredZoom(win)) {
  const used = Math.min(percent, lpMaxStoredZoom(win));

  if (!LP_SCALE_DEVICE_TO_PANE || lpShouldFillPane(win)) {
    return used;
  }

  return Math.max(1, Math.round(lpFitScale(win) * used));
}

export function lpStoredZoom(win) {
  const n = parseInt(chromeGet(win, LP_ZOOM_KEY) ?? '', 10);

  if (Number.isFinite(n) && n >= 25 && n <= 300) {
    if (n > 100) {
      chromeSet(win, LP_ZOOM_KEY, '100');

      return 100;
    }

    return n;
  }

  return LP_ZOOM_DEFAULT;
}

export function setLpZoom(win, percent) {
  const max = lpMaxStoredZoom(win);
  const clamped = Math.max(25, Math.min(max, Math.round(percent)));

  chromeSet(win, LP_ZOOM_KEY, String(clamped));

  applyLpZoom(win, clamped);
  paintLpPreviewChrome(win);
}

export function applyLpZoom(win, percent = lpStoredZoom(win)) {
  const iframe = previewFrame(win.document);
  const contents = win.document.querySelector('.live-preview-contents');

  if (!iframe) {
    return;
  }

  percent = Math.min(percent, lpMaxStoredZoom(win));

  const deviceW = lpDeviceCssWidth(win);
  let scale = percent / 100;

  if (LP_SCALE_DEVICE_TO_PANE && !lpShouldFillPane(win)) {
    scale = lpFitScale(win) * (percent / 100);
  }

  const pane = lpPaneInnerSize(win);
  const layoutW = lpShouldFillPane(win) ? pane.width || deviceW : deviceW;
  const visualW = layoutW * scale;
  const slackX = pane.width && visualW ? Math.max(0, pane.width - visualW) : 0;
  const centerX = slackX > 1;

  const fitted = LP_SCALE_DEVICE_TO_PANE && Math.abs(scale - 1) >= 0.001;
  const wantOrigin = fitted ? 'top left' : 'top center';
  const wantTransform = fitted || Math.abs(scale - 1) >= 0.001 ? `scale(${scale})` : '';

  if (contents && LP_SCALE_DEVICE_TO_PANE) {
    // Keep the layout box left-aligned while scaled (origin top-left). Centering
    // is done with marginLeft so a 1440 frame in a narrower pane cannot clip.
    const align = fitted ? 'flex-start' : 'center';

    if (contents.style.getPropertyValue('align-items') !== align) {
      contents.style.setProperty('align-items', align, 'important');
    }
  }

  // Scale from the top-left of the pane. Origin `center` plus a 1440px frame in
  // a narrower column clips the left of the page — overflow hides it before
  // the transform is painted.
  if (iframe.style.transformOrigin !== wantOrigin) {
    iframe.style.transformOrigin = wantOrigin;
  }

  if (iframe.style.transform !== wantTransform) {
    iframe.style.transform = wantTransform;
  }

  if (!wantTransform) {
    ['marginBottom', 'marginLeft', 'marginRight'].forEach((prop) => {
      if (iframe.style[prop]) {
        iframe.style[prop] = '';
      }
    });

    return;
  }

  const paneH = pane.height;
  const layoutH = paneH && fitted ? paneH / scale : iframe.offsetHeight || paneH;
  const wantMarginY = `${layoutH * (scale - 1)}px`;
  const wantMarginL = fitted && centerX ? `${Math.round(slackX / 2)}px` : '';
  const wantMarginR = fitted ? `${layoutW * (scale - 1)}px` : '';

  if (fitted && paneH) {
    const wantH = `${layoutH}px`;

    if (iframe.style.getPropertyValue('height') !== wantH) {
      iframe.style.setProperty('height', wantH, 'important');
    }
  }

  if (iframe.style.marginBottom !== wantMarginY) {
    iframe.style.marginBottom = wantMarginY;
  }

  if (fitted) {
    if (iframe.style.marginLeft !== wantMarginL) {
      iframe.style.marginLeft = wantMarginL;
    }

    if (iframe.style.marginRight !== wantMarginR) {
      iframe.style.marginRight = wantMarginR;
    }
  }
}

/** Hide Statamic's Pop out / device <Select…> — our chrome replaces them. */
export function hideStatamicLpChrome(header) {
  const ours = (el) =>
    el?.closest?.(`#${LP_PREVIEW_CHROME_ID}`) || el?.closest?.(`#${HEADER_TOOLBAR_ID}`);

  const hide = (el) => {
    if (!el || ours(el) || el.classList.contains('sve-off')) {
      return;
    }

    el.classList.add('sve-off');
    el.style.setProperty('display', 'none', 'important');
  };

  // Our icons replace the device picker entirely — hide every combobox /
  // listbox in the Live Preview header that isn't ours (covers "Select…",
  // translated labels, and empty placeholders).
  header.querySelectorAll('[role="combobox"], [role="listbox"], [data-ui-combobox-trigger]').forEach((el) => {
    if (ours(el)) {
      return;
    }

    hide(el);
    // Also hide a wrapping control if the trigger is nested in one.
    const wrap = el.closest?.('[data-ui-combobox], .ui-combobox, [data-reka-combobox-trigger]') || el.parentElement;

    if (wrap && wrap !== header && !ours(wrap)) {
      hide(wrap);
    }
  });

  header.querySelectorAll('button, [role="combobox"], [role="listbox"]').forEach((el) => {
    const text = (el.textContent || '').replace(/\s+/g, ' ').trim();

    // Pop out / Pop in — label may sit in a child span beside an icon.
    if (/pop\s*out|pop\s*in|pop\s*ud|pop\s*ind/i.test(text)) {
      hide(el);

      return;
    }

    // Device select: Responsive / Laptop / … or placeholder "Select…" / "Vælg…".
    if (
      /^(responsive|laptop|tablet|mobile|desktop|select…|select\.\.\.|select\.{3}|vælg…|vælg\.\.\.)$/i.test(text) ||
      (/^(responsive|laptop|tablet|mobile|desktop|select|vælg)/i.test(text) && text.length < 24)
    ) {
      if (/save|publish|gem|public/i.test(text)) {
        return;
      }

      hide(el);
    }
  });
}

export function ensureLpPreviewChrome(win) {
  const doc = win.document;
  const header = lpHeader(doc);

  if (!header) {
    doc.getElementById(LP_PREVIEW_CHROME_ID)?.remove();

    return;
  }

  hideStatamicLpChrome(header);
  hideStatamicLpClose(header);

  let chrome = doc.getElementById(LP_PREVIEW_CHROME_ID);

  // Vue may wipe the header — recreate if our chrome left the tree.
  if (chrome && !header.contains(chrome)) {
    chrome.remove();
    chrome = null;
  }

  if (!chrome) {
    chrome = doc.createElement('div');
    chrome.id = LP_PREVIEW_CHROME_ID;
    chrome.style.cssText =
      `display:inline-flex;align-items:center;gap:${LP_TOOLBAR_GAP}px;flex-shrink:0;`;
    bindTips(win, chrome);

    const devices = doc.createElement('div');

    devices.dataset.sveDevices = '';
    // Lidt tættere inde i device-gruppen (samme cluster), ikke mellem clusters.
    devices.style.cssText = `${HEADER_GROUP_STYLE}gap:4px;`;
    chrome.appendChild(devices);

    // Every size side by side (breakpoint-overview.js): an icon of its own,
    // right of the sizes it shows and before zoom, square like reload and
    // blueprint. At rest the icon — not the button's surface — has the zoom
    // icons' idle opacity; the module lifts it while the overview is open.
    // One button and one import() on click. Nothing else exists until then.
    if (featureOn(win, 'breakpoint_overview')) {
      const overview = doc.createElement('button');

      overview.type = 'button';
      overview.dataset.overview = '';
      overview.title = t(win, 'bp_overview');
      overview.setAttribute('aria-pressed', 'false');
      overview.innerHTML =
        `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" opacity="${LP_ICON_IDLE_OPACITY}"><rect x="3" y="3" width="7.5" height="7.5" rx="1.5"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5"/><path d="M17.25 14v6.5M14 17.25h6.5"/></svg>`;
      overview.style.cssText = `${LP_ICON_BTN_STYLE}flex-shrink:0;`;
      overview.addEventListener('click', () => {
        import('../breakpoint-overview.js').then((m) => m.toggleBreakpointOverview(win));
      });

      chrome.appendChild(overview);
    }

    const zoom = doc.createElement('div');

    zoom.dataset.sveZoom = '';
    zoom.style.cssText = `${HEADER_GROUP_STYLE}gap:6px;`;

    const zoomOut = doc.createElement('button');

    zoomOut.type = 'button';
    zoomOut.dataset.zoom = 'out';
    zoomOut.title = t(win, 'zoom_out');
    zoomOut.innerHTML =
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>';
    zoomOut.style.cssText =
      `${FRAMED_CONTROL_STYLE}width:${LP_CONTROL_H}px;padding:0;display:inline-flex;align-items:center;justify-content:center;`;
    zoomOut.addEventListener('click', () => {
      const cur = lpStoredZoom(win);
      const next = [...LP_ZOOM_STEPS].reverse().find((step) => step < cur) ?? Math.max(25, cur - 10);

      setLpZoom(win, next);
    });

    const zoomLabel = doc.createElement('button');

    zoomLabel.type = 'button';
    zoomLabel.dataset.zoom = 'label';
    zoomLabel.style.cssText = `${FRAMED_CONTROL_STYLE}padding:0 4px;min-width:2.75rem;white-space:nowrap;`;
    zoomLabel.addEventListener('click', () => {
      const max = lpMaxStoredZoom(win);
      const allowed = LP_ZOOM_STEPS.filter((step) => step <= max);
      const cur = lpStoredZoom(win);
      const idx = allowed.indexOf(cur);
      const next = allowed[(idx + 1) % allowed.length] ?? LP_ZOOM_DEFAULT;

      setLpZoom(win, next);
    });

    const zoomIn = doc.createElement('button');

    zoomIn.type = 'button';
    zoomIn.dataset.zoom = 'in';
    zoomIn.title = t(win, 'zoom_in');
    zoomIn.innerHTML =
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>';
    zoomIn.style.cssText =
      `${FRAMED_CONTROL_STYLE}width:${LP_CONTROL_H}px;padding:0;display:inline-flex;align-items:center;justify-content:center;`;
    zoomIn.addEventListener('click', () => {
      const next = lpNextZoomIn(win);

      if (next > lpStoredZoom(win)) {
        setLpZoom(win, next);
      }
    });

    zoom.appendChild(zoomOut);
    zoom.appendChild(lpModeSeparator(doc));
    zoom.appendChild(zoomLabel);
    zoom.appendChild(lpModeSeparator(doc));
    zoom.appendChild(zoomIn);

    chrome.appendChild(zoom);
  }

  // Rebuild device icons when the set changes (a size added, renamed or removed).
  const devicesEl = chrome.querySelector('[data-sve-devices]');
  const deviceKeys = lpDeviceKeys(win);
  // The icon and the name can change while the keys stay put — a renamed size
  // still has to redraw, or the row keeps the label it had before.
  const deviceSig = [
    deviceKeys.join('|'),
    ...breakpoints(win).map((item) => `${item.device}:${item.icon}:${item.label}`),
  ].join('~');

  if (devicesEl && devicesEl.dataset.sig !== deviceSig) {
    devicesEl.dataset.sig = deviceSig;
    devicesEl.textContent = '';

    deviceKeys.forEach((key) => {
      const btn = doc.createElement('button');

      const row = key === 'Responsive' ? null : bpForDevice(key, win);

      btn.type = 'button';
      btn.dataset.device = key;
      btn.title = key === 'Responsive' ? t(win, 'device_full') : row?.label || key;
      btn.innerHTML =
        key === 'Responsive'
          ? LP_DEVICE_ICONS.Responsive
          : LP_DEVICE_ICONS[row?.icon] || LP_DEVICE_ICONS.desktop;
      btn.style.cssText =
        `${FRAMED_CONTROL_STYLE}width:28px;padding:0;display:inline-flex;align-items:center;justify-content:center;`;
      btn.addEventListener('click', () => setLpDevice(win, key));
      devicesEl.appendChild(btn);
    });
  }

  // Place devices+zoom on the RIGHT — where Statamic's device <Select…> sat —
  // immediately before Save & Publish. Never move the node when it's already
  // there (Node.after on every observer pass freezes Live Preview).
  const wantParent = header;
  let anchor = null;

  wantParent.querySelectorAll('button').forEach((btn) => {
    const text = (btn.textContent || '').replace(/\s+/g, ' ').trim();

    if (/save\s*&\s*publish|gem\s*&\s*public|save\s*and\s*publish|gem og public/i.test(text)) {
      anchor = btn;
    }
  });

  // Prefer anchoring next to the save button's cluster so chrome sits left of it.
  const cluster = anchor?.parentElement;

  if (cluster && cluster !== header) {
    if (chrome.parentElement !== cluster || chrome.nextElementSibling !== anchor) {
      cluster.insertBefore(chrome, anchor);
    }
  } else if (anchor && chrome.nextElementSibling !== anchor) {
    header.insertBefore(chrome, anchor);
  } else if (chrome.parentElement !== header) {
    header.appendChild(chrome);
  }

  // Ét gap devices↔zoom↔Save↔go-back (ingen stablede margins).
  syncLpRightBarGaps(win);

  applyLpDevice(win);
  applyLpZoom(win);
  paintLpPreviewChrome(win);
  watchLpIframeChrome(win);
  watchLpResponsiveWidth(win);
  // Started here as well as on a device switch: the editor can open straight
  // into tablet or mobile from the last session, and a drag there has to be
  // written down without waiting for the device to be clicked first.
  watchBlockOrder(win);
  dispatchLpBreakpoint(win);
}

export function paintLpPreviewChrome(win) {
  const doc = win.document;
  const chrome = doc.getElementById(LP_PREVIEW_CHROME_ID);

  if (!chrome) {
    return;
  }

  const device = lpChromeActiveDevice(win);
  const zoom = lpVisualZoom(win);

  chrome.querySelectorAll('[data-device]').forEach((btn) => {
    paintLpActiveControl(btn, btn.dataset.device === device);
  });

  // Zoom controls: same idle opacity as other chrome icons (label stays readable).
  chrome.querySelectorAll('[data-zoom]').forEach((btn) => {
    if (btn.dataset.zoom === 'label') {
      if (btn.style.opacity !== '1') {
        btn.style.opacity = '1';
      }

      return;
    }

    if (btn.dataset.zoom === 'in') {
      const allowed = lpZoomInAllowed(win);
      const want = allowed ? LP_ICON_IDLE_OPACITY : LP_ICON_LOCKED_OPACITY;

      btn.disabled = !allowed;
      btn.setAttribute('aria-disabled', allowed ? 'false' : 'true');
      btn.title = t(win, allowed ? 'zoom_in' : 'zoom_in_max');

      if (btn.style.opacity !== want) {
        btn.style.opacity = want;
      }

      return;
    }

    if (btn.style.opacity !== LP_ICON_IDLE_OPACITY) {
      btn.style.opacity = LP_ICON_IDLE_OPACITY;
    }
  });

  paintLpSaveButton(win);
  syncLpRightBarGaps(win);

  const zoomBox = chrome.querySelector('[data-sve-zoom]');

  if (zoomBox && zoomBox.style.gap !== '6px') {
    zoomBox.style.gap = '6px';
  }

  const label = chrome.querySelector('[data-zoom="label"]');

  if (label) {
    const auto = lpZoomIsAuto(win);
    const text = auto ? t(win, 'zoom_auto', { percent: zoom }) : `${zoom}%`;

    if (label.textContent !== text) {
      label.textContent = text;
    }

    if (label.style.minWidth !== '2.75rem') {
      label.style.minWidth = '2.75rem';
    }

    if (label.style.paddingLeft !== '4px') {
      label.style.paddingLeft = '4px';
      label.style.paddingRight = '4px';
    }

    if (label.style.whiteSpace !== 'nowrap') {
      label.style.whiteSpace = 'nowrap';
    }

    const title = auto
      ? t(win, 'zoom_auto', { percent: zoom })
      : t(win, 'zoom_level', { percent: zoom });

    if (label.title !== title) {
      label.title = title;
    }
  }
}

/** Re-apply device size / zoom when Statamic Vue resets the iframe attributes. */
export let lpIframeChromeObserver = null;
export let lpIframeChromeTarget = null;

export function watchLpIframeChrome(win) {
  const iframe = previewFrame(win.document);

  if (!iframe) {
    return;
  }

  if (lpIframeChromeTarget === iframe && lpIframeChromeObserver) {
    return;
  }

  lpIframeChromeObserver?.disconnect();
  lpIframeChromeTarget = iframe;
  let reapplying = false;

  lpIframeChromeObserver = new win.MutationObserver(() => {
    if (reapplying) {
      return;
    }

    reapplying = true;

    try {
      applyLpDevice(win);
      applyLpZoom(win);
    } finally {
      // Let our own style writes settle before listening again.
      win.requestAnimationFrame(() => {
        reapplying = false;
      });
    }
  });

  lpIframeChromeObserver.observe(iframe, {
    attributes: true,
    attributeFilter: ['style', 'class', 'width', 'height'],
  });
}
