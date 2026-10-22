/**
 * bridge.js — region "header-footer", split out in WP5. Same statements, same order;
 * only the imports are new. See the barrel bridge.js for what the shell exports.
 */
import { bridgeState } from '../bridge/state.js';
import { featureOn, t } from '../bridge.js';
import { CHROME_ATTR, CHROME_BAR_ID, CHROME_CLOSE_ID, CHROME_FOCUS_ATTR, cpDialogTheme, exitGlobalFocus, showPreviewConfirm, sveFocusBarStyle, svePrimaryBtn, sveSecondaryBtn } from './global-sections.js';
import { alongBandBottom } from './viewport.js';
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

  if (!doc.getElementById(CHROME_BAR_ID)) {
    mountChromeBar(win, chromeKind);
  }

  mountChromeClose(win, again);
}

/**
 * The way out, written on the half: a Close chip over its top-right corner,
 * opposite the label that names it. The bar under the preview says the same
 * — but the bar stands at the bottom of the band, and standing in the header
 * the eye is at the top. Same door as the bar and Escape
 * (`requestCloseChrome`): the Control Panel asks about unsaved edits first.
 *
 * Over the half, not in it. The half is the site's markup, and two morphs
 * own that markup — the preview's Alpine morph against server HTML, and the
 * dock's Instant paint against the file — and both take out what the server
 * did not send. A chip appended to the header lived until the next paint. So
 * the chip hangs off <html> like the bar and the confirm card, and is placed
 * at the half's corner in document coordinates: measured when mounted, when
 * the viewport resizes, and when the half's own box changes (a dock paint, a
 * morph). The rebind after a morph only re-points it at the new node.
 */
let chromeCloseWatch = null;

function placeChromeClose(win, el, chip) {
  const rect = el.getBoundingClientRect();

  chip.style.top = `${rect.top + win.scrollY}px`;
  chip.style.left = `${rect.right + win.scrollX}px`;
}

function mountChromeClose(win, el) {
  const doc = win.document;

  if (!el) {
    return;
  }

  let chip = doc.getElementById(CHROME_CLOSE_ID);

  if (!chip) {
    chip = doc.createElement('button');
    chip.id = CHROME_CLOSE_ID;
    chip.type = 'button';
    chip.setAttribute('data-sve-chrome-ui', '');
    chip.setAttribute('aria-label', t('close'));
    chip.textContent = `${t('close')} ✕`;
    chip.style.cssText =
      'position:absolute;z-index:9998;margin:0;border:0;transform:translateX(-100%);' +
      'background:#60a5fa;color:#fff;font:500 10px/1 sans-serif;letter-spacing:.02em;' +
      'padding:4px 8px;border-radius:0 0 0 4px;cursor:pointer;pointer-events:auto;opacity:1;';
    // The chip is the half's way out, not one of its fields: the page's click
    // handling must not see the press as a click on the header.
    chip.addEventListener('pointerdown', (event) => {
      event.stopPropagation();
    });
    chip.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      requestCloseChrome(win);
    });
    doc.documentElement.appendChild(chip);
  }

  if (chromeCloseWatch?.el !== el) {
    chromeCloseWatch?.stop();

    const place = () => placeChromeClose(win, el, chip);
    const sizes = new win.ResizeObserver(place);

    sizes.observe(el);
    win.addEventListener('resize', place);
    chromeCloseWatch = {
      el,
      stop() {
        sizes.disconnect();
        win.removeEventListener('resize', place);
      },
    };
  }

  placeChromeClose(win, el, chip);
}

function unmountChromeClose(doc) {
  chromeCloseWatch?.stop();
  chromeCloseWatch = null;
  doc.getElementById(CHROME_CLOSE_ID)?.remove();
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
  doc.getElementById(CHROME_BAR_ID)?.remove();
  unmountChromeClose(doc);
  chromeSaveBtn = null;
  chromeStatusEl = null;
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
    if (!win.document.getElementById(CHROME_BAR_ID)) {
      mountChromeBar(win, el.getAttribute(CHROME_ATTR) || 'header');
    }

    mountChromeClose(win, el);

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
  mountChromeBar(win, kind);
  mountChromeClose(win, el);

  if (reopen) {
    win.parent.postMessage({ source: SOURCE, type: MSG.OPEN_CHROME, kind }, win.location.origin);
  }

  win.parent.postMessage({ source: SOURCE, type: MSG.SVE_CHROME_DIRTY_QUERY }, win.location.origin);
}

let chromeSaveBtn = null;
let chromeStatusEl = null;
let chromeDirty = false;
// The half's global set has no fields: nothing can change, so no bar.
let chromeBarOff = false;

export function setChromeDirtyUI(dirty, fields = null, win = null) {
  chromeDirty = !!dirty;

  if (typeof fields === 'number' && win) {
    chromeBarOff = fields === 0;

    if (chromeBarOff) {
      win.document.getElementById(CHROME_BAR_ID)?.remove();
      chromeSaveBtn = null;
      chromeStatusEl = null;
    } else if (bridgeState.chromeFocusEl && !win.document.getElementById(CHROME_BAR_ID)) {
      mountChromeBar(win, bridgeState.chromeFocusEl.getAttribute(CHROME_ATTR) || 'header');
    }
  }

  if (chromeSaveBtn) {
    chromeSaveBtn.style.display = chromeDirty ? '' : 'none';
  }

  if (chromeStatusEl) {
    chromeStatusEl.textContent = chromeDirty ? t('chrome_bar_dirty') : t('chrome_bar_clean');
  }
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

function mountChromeBar(win, kind) {
  const doc = win.document;
  const theme = cpDialogTheme(win);

  doc.getElementById(CHROME_BAR_ID)?.remove();

  if (chromeBarOff) {
    return;
  }

  const bar = doc.createElement('div');

  bar.id = CHROME_BAR_ID;
  bar.style.cssText = sveFocusBarStyle(theme);
  alongBandBottom(win, bar, 24);

  const text = doc.createElement('span');

  text.style.cssText = `font-weight:400;color:${theme.muted};`;
  text.innerHTML = t('chrome_bar', {
    chrome: `<b style="font-weight:700;color:${theme.color};">${t(kind === 'footer' ? 'chrome_footer' : 'chrome_header')}</b>`,
  });

  const status = doc.createElement('span');

  status.style.cssText = `font-weight:400;color:${theme.muted};`;
  status.textContent = chromeDirty ? t('chrome_bar_dirty') : t('chrome_bar_clean');
  chromeStatusEl = status;

  text.appendChild(doc.createTextNode(' '));
  text.appendChild(status);
  bar.appendChild(text);

  const barButton = (label, style) => {
    const btn = doc.createElement('button');

    btn.type = 'button';
    btn.textContent = label;
    btn.style.cssText = style;
    bar.appendChild(btn);

    return btn;
  };

  // Save only when Theme Settings has unsaved edits (CP drives visibility).
  chromeSaveBtn = barButton(t('save'), svePrimaryBtn(theme, { compact: true }));
  chromeSaveBtn.style.display = chromeDirty ? '' : 'none';
  chromeSaveBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    win.parent.postMessage({ source: SOURCE, type: MSG.SAVE_CHROME }, win.location.origin);
  });

  barButton(t('close'), sveSecondaryBtn(theme, { compact: true })).addEventListener('click', (event) => {
    event.stopPropagation();
    requestCloseChrome(win);
  });

  doc.documentElement.appendChild(bar);
}
