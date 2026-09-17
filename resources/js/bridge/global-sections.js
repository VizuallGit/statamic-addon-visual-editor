/**
 * bridge.js — region "global-sections", split out in WP5. Same statements, same order;
 * only the imports are new. See the barrel bridge.js for what the shell exports.
 */
import { bridgeState } from '../bridge/state.js';
import { SID_ATTR, t } from '../bridge.js';
import { GLOBAL_ATTR, GLOBAL_BAR_ID, GLOBAL_FOCUS_ATTR, GLOBAL_ROW_ATTR } from './row-toolbar.js';
import { setupInserters } from './inserters.js';
import { exitChromeFocus } from './header-footer.js';

// ===== global-sections =====
/** Tags each section that came from a Global section with its source's id. */
export function tagGlobalSections(win) {
  const label = t('global_badge');

  const ensureBadge = (el, text) => {
    let badge = el.querySelector(':scope > [data-sve-global-badge]');

    if (!badge) {
      badge = win.document.createElement('span');
      badge.setAttribute('data-sve-global-badge', '');
      el.prepend(badge);
    }

    badge.textContent = text;
  };

  const apply = (el, sourceId, row) => {
    el.setAttribute(GLOBAL_ATTR, sourceId);
    el.setAttribute('data-sve-global-label', label);
    ensureBadge(el, label);

    if (row) {
      el.setAttribute(GLOBAL_ROW_ATTR, row);
    }
  };

  // Preferred: wrap from the template (display:contents) — every section inside
  // belongs to this synced source; nothing after it on the page gets tagged.
  win.document.querySelectorAll('[data-sve-global-root]').forEach((root) => {
    const sourceId = root.getAttribute('data-sve-global-root');
    const row =
      root.previousElementSibling?.getAttribute('data-sve-global-row') ||
      root.parentElement?.querySelector(':scope > [data-sve-global-row]')?.getAttribute('data-sve-global-row');

    // Only the page_sections roots (direct children), not nested rows/blocks —
    // those would otherwise get the purple "Global" badge too.
    [...root.children].forEach((el) => {
      if (el.hasAttribute(SID_ATTR) || /^SECTION|ARTICLE$/i.test(el.tagName)) {
        apply(el, sourceId, row);
      }
    });
  });

  // Legacy marker (single following sibling) for sites that haven't updated the
  // global_section partial yet.
  win.document.querySelectorAll('[data-sve-global-id]').forEach((marker) => {
    if (marker.closest('[data-sve-global-root]')) {
      return;
    }

    const sourceId = marker.getAttribute('data-sve-global-id');
    const row = marker.previousElementSibling?.getAttribute('data-sve-global-row');
    const section = marker.nextElementSibling;

    if (section && !section.hasAttribute(GLOBAL_ATTR)) {
      apply(section, sourceId, row);
    }
  });
}

export function exitGlobalFocus(win, closePanel = true) {
  const doc = win.document;
  const wasFocused = !!bridgeState.globalFocusEl || !!bridgeState.globalFocusId;

  doc.querySelectorAll(`[${GLOBAL_FOCUS_ATTR}]`).forEach((el) => el.removeAttribute(GLOBAL_FOCUS_ATTR));
  doc.documentElement.classList.remove('sve-global-focus');
  doc.getElementById(GLOBAL_BAR_ID)?.remove();
  globalSaveBtn = null;
  globalStatusEl = null;
  globalSectionDirty = false;
  bridgeState.globalSectionLabel = null;
  bridgeState.globalFocusEl = null;
  bridgeState.globalFocusId = null;

  // Stepping out closes the section's editor with it — leaving it open would keep
  // the page rendering an unsaved section you can no longer see you're in.
  if (wasFocused && closePanel) {
    win.parent.postMessage({ source: 'statamic-visual-editor', type: 'close-global-section' }, win.location.origin);
  }

  // … and it goes away again with the focus.
  if (wasFocused) {
    setupInserters(win);
  }
}

/**
 * After a Live Preview morph the section nodes are new DOM. Re-apply focus marks
 * without tearing down panel state (exitGlobalFocus would clear globalFocusId and
 * leave fields un-editable until the user re-confirms enter).
 */
export function rebindGlobalFocus(win, sourceId, attempt = 0) {
  if (!sourceId) {
    return;
  }

  tagGlobalSections(win);

  const doc = win.document;
  const sections = [...doc.querySelectorAll(`[${GLOBAL_ATTR}="${CSS.escape(sourceId)}"]`)];

  if (!sections.length) {
    if (attempt < 10) {
      win.setTimeout(() => rebindGlobalFocus(win, sourceId, attempt + 1), 80);
    }

    // Keep the id sticky so the next click can still recover focus.
    bridgeState.globalFocusId = sourceId;

    return;
  }

  doc.querySelectorAll(`[${GLOBAL_FOCUS_ATTR}]`).forEach((el) => el.removeAttribute(GLOBAL_FOCUS_ATTR));
  sections.forEach((el) => el.setAttribute(GLOBAL_FOCUS_ATTR, ''));
  doc.documentElement.classList.add('sve-global-focus');
  bridgeState.globalFocusEl = sections[0];
  bridgeState.globalFocusId = sourceId;

  // A morph replaces the whole page, bar included — put it back, or stepping
  // into a global section and typing one character loses the way to save it.
  if (!doc.getElementById(GLOBAL_BAR_ID)) {
    mountGlobalBar(win);
  }
}

/**
 * Statamic CP light/dark tokens for dialogs rendered inside the preview iframe
 * (which doesn't inherit CP CSS variables). Reads the parent CP theme when possible.
 */
export function cpDialogTheme(win) {
  let dark = false;
  let bg = '';
  let primary = '';

  try {
    const root = win.parent?.document?.documentElement;

    if (root) {
      dark = root.classList.contains('dark');
      const cs = win.parent.getComputedStyle(root);

      bg = (cs.getPropertyValue('--theme-color-content-bg') || '').trim();
      primary = (cs.getPropertyValue('--theme-color-primary') || '').trim();
    }
  } catch {
    // Cross-origin or missing parent — fall back below.
  }

  return {
    dark,
    bg: bg || (dark ? '#1e293b' : '#ffffff'),
    color: dark ? '#f8fafc' : '#0f172a',
    muted: dark ? 'rgba(248,250,252,.7)' : 'rgba(15,23,42,.7)',
    primary: primary || '#4f46e5',
    overlay: 'rgba(0,0,0,.45)',
  };
}

/** Statamic primary button (same look as CP “Save & Publish”). */
export function svePrimaryBtn(theme, { compact = false } = {}) {
  const pad = compact ? '6px 12px' : '8px 14px';
  const size = compact ? '12px' : '13px';

  return (
    `all:unset;cursor:pointer;padding:${pad};border-radius:8px;font-size:${size};font-weight:600;` +
    `background:${theme.primary};color:#fff;`
  );
}

/** Quiet secondary/cancel chip — 10% white on dark, 10% black on light. */
export function sveSecondaryBtn(theme, { compact = false } = {}) {
  const pad = compact ? '6px 12px' : '8px 14px';
  const size = compact ? '12px' : '13px';
  const wash = theme.dark ? 'rgba(255,255,255,.1)' : 'rgba(0,0,0,.1)';

  return (
    `all:unset;cursor:pointer;padding:${pad};border-radius:8px;font-size:${size};font-weight:600;` +
    `color:${theme.color};background:${wash};`
  );
}

/** Destructive (discard / close without saving). */
function sveDangerBtn(theme, { compact = false } = {}) {
  const pad = compact ? '6px 12px' : '8px 14px';
  const size = compact ? '12px' : '13px';

  return (
    `all:unset;cursor:pointer;padding:${pad};border-radius:8px;font-size:${size};font-weight:600;` +
    'background:#dc2626;color:#fff;'
  );
}

/** Floating focus bar (header/footer/global) — same surface as dialog cards. */
export function sveFocusBarStyle(theme) {
  return (
    'position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:2147483646;' +
    `display:flex;align-items:center;gap:10px;background:${theme.bg};color:${theme.color};` +
    'padding:8px 10px 8px 16px;border-radius:10px;box-shadow:0 8px 28px rgba(0,0,0,.35);' +
    'font:500 13px/1.3 ui-sans-serif,system-ui,sans-serif;user-select:none;'
  );
}

/**
 * Confirm overlay in the preview — same card/button chrome as CP
 * confirmCloseDiscard / confirmUnsaved (Statamic light + dark).
 */
export function showPreviewConfirm(win, { title, body, confirmLabel, cancelLabel, danger = false, onConfirm, onCancel }) {
  const doc = win.document;
  const theme = cpDialogTheme(win);

  doc.getElementById('__sve-preview-confirm')?.remove();

  const overlay = doc.createElement('div');

  overlay.id = '__sve-preview-confirm';
  overlay.style.cssText =
    'position:fixed;inset:0;z-index:2147483647;display:flex;align-items:center;justify-content:center;' +
    `background:${theme.overlay};font-family:ui-sans-serif,system-ui,sans-serif;`;

  const card = doc.createElement('div');

  card.style.cssText =
    `width:400px;max-width:92vw;background:${theme.bg};color:${theme.color};` +
    'border-radius:12px;padding:22px;box-shadow:0 24px 64px rgba(0,0,0,.35);';
  card.innerHTML =
    `<div style="font-size:15px;font-weight:600;margin-bottom:6px;">${title}</div>` +
    `<div style="font-size:13px;color:${theme.muted};line-height:1.45;margin-bottom:18px;">${body}</div>` +
    '<div data-sve-actions style="display:flex;justify-content:flex-end;gap:8px;flex-wrap:wrap;"></div>';

  const actions = card.querySelector('[data-sve-actions]');
  const close = () => overlay.remove();

  const button = (label, style, fn) => {
    const btn = doc.createElement('button');

    btn.type = 'button';
    btn.textContent = label;
    btn.style.cssText = style;
    btn.addEventListener('click', (event) => {
      event.stopPropagation();
      close();
      fn?.();
    });
    actions.appendChild(btn);
  };

  button(cancelLabel || t('cancel'), sveSecondaryBtn(theme), () => onCancel?.());
  button(
    confirmLabel,
    danger ? sveDangerBtn(theme) : svePrimaryBtn(theme),
    () => onConfirm?.()
  );

  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) {
      close();
      onCancel?.();
    }
  });

  overlay.appendChild(card);
  doc.documentElement.appendChild(overlay);
}

export function confirmEnterGlobal(win, section) {
  showPreviewConfirm(win, {
    title: t('global_enter_title'),
    body: t('global_enter_body'),
    confirmLabel: t('global_enter_confirm'),
    cancelLabel: t('cancel'),
    onConfirm: () => enterGlobalFocus(win, section),
  });
}

export function requestCloseGlobal(win) {
  win.parent.postMessage({ source: 'statamic-visual-editor', type: 'request-close-global' }, win.location.origin);
}

let globalSaveBtn = null;
let globalStatusEl = null;
let globalSectionDirty = false;
export function setGlobalSectionDirtyUI(dirty) {
  globalSectionDirty = !!dirty;

  if (globalSaveBtn) {
    globalSaveBtn.style.display = globalSectionDirty ? '' : 'none';
  }

  if (globalStatusEl) {
    globalStatusEl.textContent = globalSectionDirty ? t('chrome_bar_dirty') : t('chrome_bar_clean');
  }
}

/**
 * The bar that says which global section is being edited, whether it holds
 * unsaved work, and where to save it.
 *
 * The same bar the header and footer get, for the same reason: stepping into
 * something shared has to keep saying so, and the page behind it can no longer
 * be trusted to — what you are looking at is one of several places this section
 * appears. Built here rather than in the CP because it belongs over the page, in
 * the preview's own coordinates; the CP's panel is beside it, not on it.
 */
export function mountGlobalBar(win) {
  const doc = win.document;
  const theme = cpDialogTheme(win);

  doc.getElementById(GLOBAL_BAR_ID)?.remove();

  const bar = doc.createElement('div');

  bar.id = GLOBAL_BAR_ID;
  bar.style.cssText = sveFocusBarStyle(theme);

  const text = doc.createElement('span');

  text.style.cssText = `font-weight:400;color:${theme.muted};`;
  text.innerHTML = t('global_bar', {
    section: `<b style="font-weight:700;color:${theme.color};">${bridgeState.globalSectionLabel || t('global_bar_fallback')}</b>`,
  });

  const status = doc.createElement('span');

  status.style.cssText = `font-weight:400;color:${theme.muted};`;
  status.textContent = globalSectionDirty ? t('chrome_bar_dirty') : t('chrome_bar_clean');
  globalStatusEl = status;

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

  // Save only while there is something to save — the CP drives the flag.
  globalSaveBtn = barButton(t('save'), svePrimaryBtn(theme, { compact: true }));
  globalSaveBtn.style.display = globalSectionDirty ? '' : 'none';
  globalSaveBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    win.parent.postMessage(
      { source: 'statamic-visual-editor', type: 'save-global-section' },
      win.location.origin
    );
  });

  barButton(t('close'), sveSecondaryBtn(theme, { compact: true })).addEventListener('click', (event) => {
    event.stopPropagation();
    requestCloseGlobal(win);
  });

  doc.documentElement.appendChild(bar);
}

/**
 * Steps into a global section: mark it focused and open its editor on the LEFT
 * (same place as a normal section). Confirm already happened; from here it
 * edits like any other section — values live on the synced source entry.
 * `reopen: false` re-applies the look after a re-render without remounting the
 * panel (would reload the form mid-edit).
 */
function enterGlobalFocus(win, section, reopen = true) {
  const sourceId = section.getAttribute(GLOBAL_ATTR);

  // Already focused on this synced source (any of its rendered sections).
  if (bridgeState.globalFocusId && bridgeState.globalFocusId === sourceId && bridgeState.globalFocusEl) {
    if (!win.document.getElementById(GLOBAL_BAR_ID)) {
      mountGlobalBar(win);
    }

    return;
  }

  exitChromeFocus(win, false);
  exitGlobalFocus(win, false);

  const doc = win.document;

  // Focus every rendered chunk that belongs to this synced source (multi-section
  // globals), not only the one that was clicked.
  doc.querySelectorAll(`[${GLOBAL_ATTR}="${CSS.escape(sourceId)}"]`).forEach((el) => {
    el.setAttribute(GLOBAL_FOCUS_ATTR, '');
  });
  doc.documentElement.classList.add('sve-global-focus');
  bridgeState.globalFocusEl = section;
  bridgeState.globalFocusId = sourceId;
  mountGlobalBar(win);

  // Open the source entry in the left Live Preview editor — same slot a normal
  // section uses. Inline edit borrows that form's values (sectionPanelContainer).
  if (reopen) {
    win.parent.postMessage(
      { source: 'statamic-visual-editor', type: 'open-global-section', id: sourceId },
      win.location.origin
    );
  }

  win.parent.postMessage({ source: 'statamic-visual-editor', type: 'sve-global-dirty-query' }, win.location.origin);

  // The section's own "+" only exists while it is being edited.
  setupInserters(win);
}

// --- Site chrome (header / footer) ----------------------------------------------
//
// Same focus UX as global sections, but the content lives in a global set
// (theme_settings by default). Stepping in fades the page, opens that global in
// the side panel, and switches the library to Header/Footer design cards.

export const CHROME_ATTR = 'data-sve-chrome';
export const CHROME_FOCUS_ATTR = 'data-sve-chrome-focused';
export const CHROME_BAR_ID = '__sve-chrome-bar';

/**
 * What a click outside the header/footer means while you are inside one.
 *
 * true (default) — nothing at all, the same lock a global section has. The page
 *   around it is faded and out of reach, and the way out is the bar at the bottom.
 * false — the older behaviour: the click asks the Control Panel to close chrome,
 *   warning first if Theme Settings has unsaved work.
 *
 * Goes off together with CHROME_INLINE in cp.js — the lock is part of editing the
 * header in the left panel, and on its own over the docked route it would only
 * take away a way out that route still expects to have.
 */
export const CHROME_LOCKS_PAGE = true;
