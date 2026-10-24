/**
 * bridge.js — region "global-sections", split out in WP5. Same statements, same order;
 * only the imports are new. See the barrel bridge.js for what the shell exports.
 */
import { bridgeState } from '../bridge/state.js';
import { SID_ATTR, t } from '../bridge.js';
import { GLOBAL_ATTR, GLOBAL_FOCUS_ATTR, GLOBAL_ROW_ATTR } from './row-toolbar.js';
import { setupInserters } from './inserters.js';
import { exitChromeFocus } from './header-footer.js';
import { mountFocusFrame, setFocusFrameDirty, setFocusFrameLabel, unmountFocusFrame } from './focus-frame.js';
import { centreInBand } from './viewport.js';
import { MSG, SOURCE } from '../lib/protocol.js';

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
  unmountFocusFrame('global');
  globalSectionDirty = false;
  bridgeState.globalSectionLabel = null;
  bridgeState.globalFocusEl = null;
  bridgeState.globalFocusId = null;

  // Stepping out closes the section's editor with it — leaving it open would keep
  // the page rendering an unsaved section you can no longer see you're in.
  if (wasFocused && closePanel) {
    win.parent.postMessage({ source: SOURCE, type: MSG.CLOSE_GLOBAL_SECTION }, win.location.origin);
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

  // A morph replaces the section's markup — the frame is re-pointed at the new
  // node, or stepping into a global section and typing one character loses
  // the way to save it.
  mountGlobalFrame(win, sections[0]);
}

/** What the frame calls the section: the set's display name, once the panel has streamed it. */
function globalFrameLabel() {
  const name = bridgeState.globalSectionLabel;

  return name ? t('focus_label_global_named', { name }) : t('focus_label_global');
}

/** The name arrives with the first values the panel streams — after the frame is up. */
export function refreshGlobalFrameLabel() {
  setFocusFrameLabel('global', globalFrameLabel());
}

/**
 * The frame on the section: its name in the corner, and the way out opposite —
 * the same frame the header, the footer and a component get (focus-frame.js).
 * The Control Panel asks about unsaved edits before the focus drops
 * (`requestCloseGlobal`), and drives Save's visibility through `setGlobalSectionDirtyUI`.
 */
function mountGlobalFrame(win, el) {
  mountFocusFrame(win, {
    kind: 'global',
    el,
    t,
    label: globalFrameLabel(),
    dirtyable: true,
    dirty: globalSectionDirty,
    onSave: () => {
      win.parent.postMessage({ source: SOURCE, type: MSG.SAVE_GLOBAL_SECTION }, win.location.origin);
    },
    onClose: () => requestCloseGlobal(win),
  });
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
  // In the overview's row the page is shown whole: the card goes to the middle of what is on screen.
  centreInBand(win, overlay, card);

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
  win.parent.postMessage({ source: SOURCE, type: MSG.REQUEST_CLOSE_GLOBAL }, win.location.origin);
}

let globalSectionDirty = false;

/** Whether the section's entry holds unsaved edits — the Control Panel drives it. */
export function setGlobalSectionDirtyUI(dirty) {
  globalSectionDirty = !!dirty;
  setFocusFrameDirty('global', globalSectionDirty);
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
    mountGlobalFrame(win, bridgeState.globalFocusEl);

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
  mountGlobalFrame(win, section);

  // Open the source entry in the left Live Preview editor — same slot a normal
  // section uses. Inline edit borrows that form's values (sectionPanelContainer).
  if (reopen) {
    win.parent.postMessage(
      { source: SOURCE, type: MSG.OPEN_GLOBAL_SECTION, id: sourceId },
      win.location.origin
    );
  }

  win.parent.postMessage({ source: SOURCE, type: MSG.SVE_GLOBAL_DIRTY_QUERY }, win.location.origin);

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
