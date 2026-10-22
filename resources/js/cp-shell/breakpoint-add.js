/**
 * The popover behind the «+» beside Live Preview's size buttons: one more
 * screen size, saved into the addon's settings (POST /!/sve/breakpoints) and
 * drawn at once — the size buttons, the CSS panel's size tabs, the Tailwind
 * row and the overview all read the one list this hands back.
 *
 * Loaded on the first click (cp-shell/breakpoint-add-button.js imports it
 * then), so a Control Panel where nobody adds a size never carries the form.
 *
 * Nothing here works out a media query, a Tailwind variant or what inherits
 * from what: PHP derives those from the saved list, and the answer to the
 * save IS that list, exactly as the next page load would get it. The browser
 * puts it where the page load would have put it (`Statamic.$config`) and
 * tells the window; every reader of `breakpoints()` sees the new array.
 */
import { applyBreakpointList, bpDirection, breakpoints } from '../breakpoints.js';
import { mountSurface } from '../cp/mount.js';
import LpBreakpointAdd from '../cp/surfaces/LpBreakpointAdd.vue';
import { csrfToken } from '../lib/csrf.js';
import { remToPx } from '../lib/dom.js';
import { t } from '../lib/i18n.js';
import { bindMenuDismiss } from '../lp-menu-dismiss.js';
import { LP_DEVICE_ICONS } from './preview-chrome.js';

const HOST_ID = '__sve-bp-add-host';
const ENDPOINT = '/!/sve/breakpoints';
// LpBreakpointAdd's width; the popover is pulled left so it stays on screen.
const POPOVER_WIDTH_REM = 21;
const VIEWPORT_PAD = 8;

/**
 * How many sizes the list holds at most — Breakpoints::MAX, sent by
 * ControlPanelScript as `sveBreakpointsMax`. The form gives way to a note at
 * that count. The Store refuses a save past it either way; this only spares
 * the round trip.
 */
function maxSizes(win) {
  return Number(win.Statamic?.$config?.get?.('sveBreakpointsMax'));
}

/** The pictures a size may have, in the order to offer them. Only the ones this build draws. */
const ICON_ORDER = ['mobile', 'mobile_landscape', 'tablet', 'tablet_landscape', 'laptop', 'desktop', 'widescreen', 'ultrawide', 'tv', 'watch'];

/** Tailwind's own scale, as starting points — the same five Queries::TAILWIND_SCALE names. */
const PRESETS = [
  { key: 'sm', px: 640 },
  { key: 'md', px: 768 },
  { key: 'lg', px: 1024 },
  { key: 'xl', px: 1280 },
  { key: '2xl', px: 1536 },
];

const UNITS = ['em', 'rem', 'px'];

let open = null;

export function dismissBreakpointAdd() {
  if (!open) {
    return;
  }

  const { unbind, app, host, anchor } = open;

  open = null;
  unbind();
  app.unmount();
  host.remove();
  anchor.setAttribute('aria-expanded', 'false');
}

async function save(win, payload) {
  let res;

  try {
    res = await win.fetch(ENDPOINT, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRF-TOKEN': csrfToken(win),
      },
      body: JSON.stringify(payload),
    });
  } catch {
    return { ok: false, errors: {} };
  }

  if (res.status === 422) {
    const body = await res.json().catch(() => ({}));
    const errors = {};

    for (const [field, messages] of Object.entries(body?.errors || {})) {
      errors[field] = Array.isArray(messages) ? messages[0] : String(messages);
    }

    return { ok: false, errors };
  }

  if (!res.ok) {
    return { ok: false, errors: {} };
  }

  applyBreakpointList(win, await res.json());
  dismissBreakpointAdd();

  return { ok: true };
}

function popoverProps(win, anchor) {
  const rect = anchor.getBoundingClientRect();
  const rows = breakpoints(win);
  const max = maxSizes(win);
  const taken = (px) => rows.some((row) => Math.abs(Number(row.min_px) - px) < 0.5);

  return {
    top: Math.round(rect.bottom + 8),
    left: Math.round(Math.max(VIEWPORT_PAD, Math.min(rect.left, win.innerWidth - remToPx(win, POPOVER_WIDTH_REM) - VIEWPORT_PAD))),
    strings: {
      title: t(win, 'bp_add_title'),
      name: t(win, 'bp_add_name'),
      namePlaceholder: t(win, 'bp_add_name_placeholder'),
      handle: t(win, 'bp_add_handle'),
      icon: t(win, 'bp_add_icon'),
      presets: t(win, 'bp_add_presets'),
      from: t(win, 'bp_add_from'),
      fromHint: t(win, 'bp_add_from_hint'),
      unit: t(win, 'bp_add_from'),
      previewWidth: t(win, 'bp_add_preview_width'),
      previewWidthHint: t(win, 'bp_add_preview_width_hint'),
      directionDesktop: t(win, 'bp_add_direction_desktop'),
      directionMobile: t(win, 'bp_add_direction_mobile'),
      save: t(win, 'bp_add_save'),
      saving: t(win, 'bp_add_saving'),
      cancel: t(win, 'bp_add_cancel'),
      failed: t(win, 'bp_add_failed'),
      full: t(win, 'bp_add_error_max', { max }),
    },
    icons: ICON_ORDER.filter((key) => LP_DEVICE_ICONS[key]).map((key) => ({ key, svg: LP_DEVICE_ICONS[key] })),
    presets: PRESETS.map((preset) => ({ ...preset, taken: taken(preset.px) })),
    units: UNITS,
    direction: bpDirection(win),
    full: rows.length >= max,
    onSave: (payload) => save(win, payload),
    onClose: dismissBreakpointAdd,
  };
}

function openPopover(win, anchor) {
  const doc = win.document;
  const host = doc.createElement('div');

  host.id = HOST_ID;
  doc.body.appendChild(host);

  const app = mountSurface(LpBreakpointAdd, host, popoverProps(win, anchor));
  const unbind = bindMenuDismiss(
    win,
    (target) => host.contains(target) || anchor.contains(target),
    dismissBreakpointAdd
  );

  open = { host, app, unbind, anchor };
  anchor.setAttribute('aria-expanded', 'true');
  win.requestAnimationFrame(() => host.querySelector('.sve-bp-add__name')?.focus());
}

/** Open from the «+», or close if that same «+» opened it. */
export function toggleBreakpointAdd(win, anchor) {
  const same = open?.anchor === anchor;

  dismissBreakpointAdd();

  if (!same) {
    openPopover(win, anchor);
  }
}
