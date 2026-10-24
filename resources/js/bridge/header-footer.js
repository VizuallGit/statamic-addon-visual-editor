/**
 * bridge.js — region "header-footer", split out in WP5. Same statements, same order;
 * only the imports are new. See the barrel bridge.js for what the shell exports.
 */
import { bridgeState } from '../bridge/state.js';
import { featureOn, t } from '../bridge.js';
import { CHROME_ATTR, CHROME_FOCUS_ATTR, exitGlobalFocus, showPreviewConfirm } from './global-sections.js';
import { mountFocusFrame, setFocusFrameDirty, unmountFocusFrame } from './focus-frame.js';
import { MSG, SOURCE } from '../lib/protocol.js';

// ===== header-footer =====
/**
 * Flags the chrome this site has switched off, so the CSS above can drop its
 * hover affordance. On <html> rather than the elements themselves: the header
 * and footer are the site's own markup and get replaced on every morph, while
 * the root element survives — the same reason the focus classes live there.
 */
export function markDisabledChrome(doc) {
  ['header', 'footer'].forEach((kind) => {
    doc.documentElement.classList.toggle(`sve-chrome-off-${kind}`, !featureOn(`chrome_${kind}`));
  });
}

/**
 * The chrome element only if this site lets it be edited, else null.
 *
 * Header and footer toggle separately, so the answer depends on which one was
 * hit — a site can open its footer to editors while its header stays fixed.
 */
export function chromeEditable(el) {
  if (!el) {
    return null;
  }

  const kind = el.getAttribute(CHROME_ATTR) === 'footer' ? 'footer' : 'header';

  return featureOn(`chrome_${kind}`) ? el : null;
}

function chromeFocusClass(kind) {
  return kind === 'footer' ? 'sve-chrome-focus-footer' : 'sve-chrome-focus-header';
}

function clearChromeFocusClasses(doc) {
  doc.documentElement.classList.remove(
    'sve-chrome-focus',
    'sve-chrome-focus-header',
    'sve-chrome-focus-footer'
  );
}

function applyChromeFocusClass(doc, kind) {
  const next = chromeFocusClass(kind);

  // Idempotent: don't thrash classList if already correct (avoids style recalc flicker).
  if (doc.documentElement.classList.contains(next)) {
    doc.documentElement.classList.remove(
      next === 'sve-chrome-focus-footer' ? 'sve-chrome-focus-header' : 'sve-chrome-focus-footer',
      'sve-chrome-focus'
    );

    return;
  }

  clearChromeFocusClasses(doc);
  doc.documentElement.classList.add(next);
}

export function hasChromeFocusClass(doc, kind = null) {
  if (kind) {
    return doc.documentElement.classList.contains(chromeFocusClass(kind));
  }

  return (
    doc.documentElement.classList.contains('sve-chrome-focus-header') ||
    doc.documentElement.classList.contains('sve-chrome-focus-footer')
  );
}

export function rememberedChromeKind() {
  return bridgeState.chromeFocusKindSticky || bridgeState.chromeFocusKind || (typeof window !== 'undefined' ? window.__sveChromeKind : null);
}

function rememberChromeKind(kind) {
  bridgeState.chromeFocusKind = kind || null;
  bridgeState.chromeFocusKindSticky = kind || null;

  if (typeof window !== 'undefined') {
    window.__sveChromeKind = kind || null;
  }
}

/** Rebind after morph: keep html kind class; only refresh the live element pointer. */
export function rebindChromeFocus(win, kind, attempt = 0) {
  const chromeKind = kind === 'footer' ? 'footer' : kind === 'header' ? 'header' : null;

  if (!chromeKind) {
    return;
  }

  rememberChromeKind(chromeKind);

  const doc = win.document;
  const again = doc.querySelector(`[${CHROME_ATTR}="${chromeKind}"]`);

  if (!again) {
    if (attempt < 50) {
      setTimeout(() => rebindChromeFocus(win, chromeKind, attempt + 1), 40);

      return;
    }

    // No such element on the page (a layout whose footer partial renders no
    // marked footer): nothing to lift above the fade, so no fade — a scrim
    // over the whole page with nothing in front of it is not a focus.
    clearChromeFocusClasses(doc);

    return;
  }

  // Fade/outline live on <html> — re-assert without removing (no flicker).
  // Only once the element is here to stand in front of it.
  applyChromeFocusClass(doc, chromeKind);

  if (bridgeState.chromeFocusEl !== again || !again.hasAttribute(CHROME_FOCUS_ATTR)) {
    doc.querySelectorAll(`[${CHROME_FOCUS_ATTR}]`).forEach((el) => {
      if (el !== again) {
        el.removeAttribute(CHROME_FOCUS_ATTR);
      }
    });
    again.setAttribute(CHROME_FOCUS_ATTR, '');
    bridgeState.chromeFocusEl = again;
    bridgeState.chromeFocusKind = chromeKind;
  }

  // A morph replaces the half's markup, and the frame is re-pointed at the
  // new node — mounting is idempotent, so this is the same call as the entry.
  mountChromeFrame(win, chromeKind, again);
}

/**
 * The frame on the half: its name in the corner, and the way out opposite —
 * the same frame a global section and a component get (focus-frame.js). The
 * Control Panel asks about unsaved edits before the focus drops
 * (`requestCloseChrome`), and drives Save's visibility through `setChromeDirtyUI`.
 */
function mountChromeFrame(win, kind, el) {
  mountFocusFrame(win, {
    kind,
    el,
    t,
    label: t(kind === 'footer' ? 'focus_label_footer' : 'focus_label_header'),
    dirtyable: true,
    dirty: chromeDirty,
    onSave: () => {
      win.parent.postMessage({ source: SOURCE, type: MSG.SAVE_CHROME }, win.location.origin);
    },
    onClose: () => requestCloseChrome(win),
  });
}

/** @deprecated name — soft rebind, never exit/enter. */
function restoreChromeFocus(win, kind, attempt = 0) {
  rebindChromeFocus(win, kind, attempt);
}

export function exitChromeFocus(win, closePanel = true) {
  const doc = win.document;
  const wasFocused = !!bridgeState.chromeFocusEl;

  doc.querySelectorAll(`[${CHROME_FOCUS_ATTR}]`).forEach((el) => el.removeAttribute(CHROME_FOCUS_ATTR));
  clearChromeFocusClasses(doc);
  unmountFocusFrame('header');
  unmountFocusFrame('footer');
  chromeDirty = false;
  bridgeState.chromeFocusEl = null;
  bridgeState.chromeFocusKind = null;

  if (closePanel) {
    bridgeState.chromeFocusKindSticky = null;
    win.__sveChromeKind = null;
  }

  if (wasFocused && closePanel) {
    win.parent.postMessage({ source: SOURCE, type: MSG.CLOSE_CHROME }, win.location.origin);
  }
}

/**
 * Steps into header/footer: fade the rest of the page and open theme settings.
 * `reopen: false` keeps the panel after a morph (same idea as enterGlobalFocus).
 */
function enterChromeFocus(win, el, reopen = true) {
  if (bridgeState.chromeFocusEl === el && hasChromeFocusClass(win.document, el.getAttribute(CHROME_ATTR) || 'header')) {
    mountChromeFrame(win, el.getAttribute(CHROME_ATTR) || 'header', el);

    return;
  }

  // Can't be in both at once.
  exitGlobalFocus(win, false);
  exitChromeFocus(win, false);

  const doc = win.document;
  const kind = el.getAttribute(CHROME_ATTR) || 'header';

  el.setAttribute(CHROME_FOCUS_ATTR, '');
  applyChromeFocusClass(doc, kind);
  bridgeState.chromeFocusEl = el;
  rememberChromeKind(kind);
  mountChromeFrame(win, kind, el);

  if (reopen) {
    win.parent.postMessage({ source: SOURCE, type: MSG.OPEN_CHROME, kind }, win.location.origin);
  }

  win.parent.postMessage({ source: SOURCE, type: MSG.SVE_CHROME_DIRTY_QUERY }, win.location.origin);
}

let chromeDirty = false;

/** Whether the half's global set holds unsaved edits — the Control Panel drives it. */
export function setChromeDirtyUI(dirty) {
  chromeDirty = !!dirty;
  setFocusFrameDirty('header', chromeDirty);
  setFocusFrameDirty('footer', chromeDirty);
}

export function requestCloseChrome(win) {
  win.parent.postMessage({ source: SOURCE, type: MSG.REQUEST_CLOSE_CHROME }, win.location.origin);
}

/**
 * Confirm before stepping into header/footer — same “this is global” gate as
 * synced sections, so a stray click doesn’t open Theme Settings by accident.
 */
export function confirmEnterChrome(win, el) {
  const kind = el.getAttribute(CHROME_ATTR) === 'footer' ? 'footer' : 'header';
  const chrome = t(kind === 'footer' ? 'chrome_footer' : 'chrome_header');

  showPreviewConfirm(win, {
    title: t('chrome_enter_title', { chrome }),
    body: t('chrome_enter_body', { chrome }),
    confirmLabel: t('chrome_enter_confirm'),
    cancelLabel: t('cancel'),
    onConfirm: () => enterChromeFocus(win, el),
  });
}
