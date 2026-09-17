/**
 * cp.js — region "preview-chrome", split out in WP5. Same statements, same order;
 * only the imports are new. See the barrel cp.js for what the shell exports.
 */
import { bpBase, bpDevice, breakpoints } from '../breakpoints.js';
import { chromeGet } from '../chrome-prefs.js';
import { previewFrame } from '../lib/preview-frame.js';
import { lpWidthToBp } from './block-order.js';

// ===== preview-chrome =====
// --- Preview chrome: devices + zoom, no Pop out --------------------------------
//
// Statamic's own header shows a "Pop out" button and a text device <Select…>.
// Editors get Puck-style icons: one per breakpoint, plus Full-width and zoom.
// Device presets lock CSS width and auto-scale to the pane. Full-width fills the
// pane and never auto-zooms — shrinking the window just narrows the page.
// Plus is disabled when the preview already fills the available width.
//
// LP_SCALE_DEVICE_TO_PANE (the experiment):
//   true  — device presets auto-scale to the pane; plus locks at that ceiling
//   false — no auto-scale (old Fit fills; tablet/mobile light up with width)
// Restore the old behaviour: set this to false and `npm run cp:build`,
// or `git checkout checkpoint-fit-follows-pane`.

export const LP_SCALE_DEVICE_TO_PANE = true;

export const LP_DEVICE_KEY = 'sve-lp-device';
export const LP_ZOOM_KEY = 'sve-lp-zoom';
export const LP_ZOOM_STEPS = [50, 75, 90, 100];
export const LP_ZOOM_DEFAULT = 100;

/**
 * Keyed on the icon NAME, not on the device — a breakpoint says which picture
 * it wants, so a self-chosen size can look like whatever it is. `Responsive`
 * is the odd one out: it is not a breakpoint, it is the absence of one.
 */
export const LP_DEVICE_ICONS = {
  mobile:
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="2" width="12" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>',
  tablet:
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>',
  laptop:
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="14" rx="2"/><path d="M2 18h20M8 22h8"/></svg>',
  desktop:
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="13" rx="2"/><path d="M8 21h8M12 16v5"/></svg>',
  tv:
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="14" rx="2"/><path d="m7 3 5 3 5-3"/></svg>',
  watch:
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="6" width="10" height="12" rx="2.5"/><path d="M9 6V3h6v3M9 18v3h6v-3"/></svg>',
  // Full-width / Responsive — four arrows out, same idea as Statamic and Puck.
  Responsive:
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"/><line x1="21" y1="3" x2="14" y2="10"/><polyline points="9 21 3 21 3 15"/><line x1="3" y1="21" x2="10" y2="14"/><polyline points="21 15 21 21 15 21"/><line x1="21" y1="21" x2="14" y2="14"/><polyline points="3 9 3 3 9 3"/><line x1="3" y1="3" x2="10" y2="10"/></svg>',
};

export function lpConfiguredDevices(win) {
  const raw = win.Statamic?.$config?.get?.('livePreview.devices');

  return raw && typeof raw === 'object' ? raw : {};
}

/**
 * The breakpoints, narrowest first, then Responsive on the right.
 *
 * The order is deliberately the reverse of the list: mobile sits on the left
 * and the widest beside the expand arrows, which is how every other builder
 * draws it. The base size is always there — it is where a section is designed,
 * so there has to be a way back to it.
 */
export function lpDeviceKeys(win) {
  const keys = breakpoints(win)
    .map((item) => item.device)
    .filter(Boolean)
    .reverse();

  keys.push('Responsive');

  return keys;
}

export function lpStoredDevice(win) {
  const stored = chromeGet(win, LP_DEVICE_KEY);
  const keys = lpDeviceKeys(win);

  if (stored && keys.includes(stored)) {
    return stored;
  }

  // A device this site no longer has. Readers who were last on "Laptop" before
  // it was renamed should land on the base size, not be thrown out to Fit —
  // the stored name is stale, the size they were looking at is not.
  if (stored === 'Laptop' || stored === 'Desktop') {
    const base = bpDevice(bpBase(win), win);

    if (base && keys.includes(base)) {
      return base;
    }
  }

  return 'Responsive';
}

/**
 * Which device icon should look active.
 *
 * Scale-to-fit: the icon you clicked stays lit — opening a sidebar must not
 * pretend you switched to tablet. Old Fit: the highlight follows pane width.
 */
export function lpChromeActiveDevice(win) {
  const device = lpStoredDevice(win);

  if (LP_SCALE_DEVICE_TO_PANE || device !== 'Responsive') {
    return device;
  }

  const iframe = previewFrame(win.document);
  const w = iframe?.clientWidth || iframe?.offsetWidth || 0;

  // Before the iframe has a real size (or while LP is still mounting), don't
  // treat a tiny/zero width as Mobile — keep the Full-width icon lit.
  if (w < 200) {
    return 'Responsive';
  }

  const bp = lpWidthToBp(w);

  // The widest size is the base, and at the base nothing is constrained —
  // that is Full-width, not a device. Only the narrower ones light a button.
  return bp === bpBase(win) ? 'Responsive' : bpDevice(bp, win) || 'Responsive';
}
