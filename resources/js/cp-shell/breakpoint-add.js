/**
 * The popover behind the «+» beside Live Preview's size buttons: one more
 * screen size (POST /!/sve/breakpoints), or one fewer (DELETE
 * /!/sve/breakpoints/{handle}), saved into the addon's settings and drawn
 * at once — the size buttons, the CSS panel's size tabs, the Tailwind row
 * and the overview all read the one list this hands back.
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
import { LP_PREVIEW_CHROME_ID } from '../lib/ids.js';
import { bindMenuDismiss } from '../lp-menu-dismiss.js';
import { BP_ADD_ATTR } from './breakpoint-add-button.js';
import { LP_DEVICE_ICONS } from './preview-chrome.js';

const HOST_ID = '__sve-bp-add-host';
const ENDPOINT = '/!/sve/breakpoints';
// LpBreakpointAdd's width; the popover is pulled left so it stays on screen.
const POPOVER_WIDTH_REM = 21;
const VIEWPORT_PAD = 8;

/**
 * How many sizes the list holds at most and at least — Breakpoints::MAX and
 * ::MIN, sent by ControlPanelScript as `sveBreakpointsMax` / `…Min`. The
 * form gives way to a note at the top count; the remove button goes quiet at
 * the bottom one. The Store refuses either way; this only spares the round
 * trip.
 */
function maxSizes(win) {
  return Number(win.Statamic?.$config?.get?.('sveBreakpointsMax'));
}

function minSizes(win) {
  return Number(win.Statamic?.$config?.get?.('sveBreakpointsMin'));
}

/** The pictures a size may have, in the order to offer them. Only the ones this build draws. */
const ICON_ORDER = ['mobile', 'mobile_landscape', 'tablet', 'tablet_landscape', 'laptop', 'desktop', 'widescreen', 'ultrawide', 'tv'];

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

/**
 * One request against the list, add or remove. The answer is the list as
 * the next page load would read it; it goes where the page load would have
 * put it, and every reader of `breakpoints()` sees it. Returns the list as
 * well, for the popover to redraw its own rows from.
 */
async function request(win, method, url, payload) {
  let res;

  try {
    res = await win.fetch(url, {
      method,
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRF-TOKEN': csrfToken(win),
      },
      body: payload === undefined ? undefined : JSON.stringify(payload),
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

  const data = await res.json();

  applyBreakpointList(win, data);

  return { ok: true, rows: breakpoints(win) };
}

async function save(win, payload) {
  const result = await request(win, 'POST', ENDPOINT, payload);

  if (result.ok) {
    dismissBreakpointAdd();
  }

  return result;
}

/**
 * The popover stays open after a removal so the list is seen to shrink. The
 * device group is redrawn from the new list meanwhile, with a new «+» in it;
 * the popover follows that node, so it stays lit and a click on it still
 * counts as inside.
 */
async function remove(win, handle) {
  const result = await request(win, 'DELETE', `${ENDPOINT}/${encodeURIComponent(handle)}`);

  if (result.ok && open) {
    const anchor = win.document.querySelector(`#${LP_PREVIEW_CHROME_ID} [data-sve-devices] > [${BP_ADD_ATTR}]`);

    if (anchor && anchor !== open.anchor) {
      open.anchor.setAttribute('aria-expanded', 'false');
      open.anchor = anchor;
      anchor.setAttribute('aria-expanded', 'true');
    }
  }

  return result;
}

function popoverProps(win, anchor) {
  const rect = anchor.getBoundingClientRect();
  const max = maxSizes(win);
  const min = minSizes(win);

  return {
    top: Math.round(rect.bottom + 8),
    left: Math.round(Math.max(VIEWPORT_PAD, Math.min(rect.left, win.innerWidth - remToPx(win, POPOVER_WIDTH_REM) - VIEWPORT_PAD))),
    strings: {
      title: t(win, 'bp_add_title'),
      sizes: t(win, 'bp_remove_title'),
      remove: t(win, 'bp_remove'),
      removeConfirm: t(win, 'bp_remove_confirm'),
      removeLast: t(win, 'bp_remove_last'),
      removeHint: t(win, 'bp_remove_hint'),
      removeFailed: t(win, 'bp_remove_failed'),
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
    presets: PRESETS,
    units: UNITS,
    direction: bpDirection(win),
    // The list as it stands when the popover opens; the popover keeps its own
    // copy from here and takes each answer's list in its place.
    rows: breakpoints(win),
    max,
    min,
    onSave: (payload) => save(win, payload),
    onRemove: (handle) => remove(win, handle),
    onClose: dismissBreakpointAdd,
  };
}

function openPopover(win, anchor) {
  const doc = win.document;
  const host = doc.createElement('div');

  host.id = HOST_ID;
  doc.body.appendChild(host);

  const app = mountSurface(LpBreakpointAdd, host, popoverProps(win, anchor));
  // `open.anchor`, not the one captured here: a removal redraws the group,
  // and the «+» the popover belongs to is then a new node.
  const unbind = bindMenuDismiss(
    win,
    (target) => host.contains(target) || !!open?.anchor?.contains(target),
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
