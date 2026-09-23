/**
 * cp.js — region "add-section", split out in WP5. Same statements, same order;
 * only the imports are new. See the barrel cp.js for what the shell exports.
 */
import { ask } from '../cp/bus.js';
import { syncCodeDock } from '../code-dock-lazy.js';
import { t } from '../lib/i18n.js';
import { sveState } from '../cp-state.js';
import { COLLAPSE_SETTLE_MS, SELECTORS } from '../cp-selectors.js';
import { closeCodeDockPopups } from '../code-dock-lazy.js';
import { ensurePanel, markLivePreviewReady } from '../lazy-panels.js';
import { COMMENTS_BADGE_ACTIVE_BG, COMMENTS_BADGE_FG, COMMENTS_BADGE_IDLE_TYPE, GLOBAL_SECTION_PANEL_ID, HEADER_ICON_HOVER, LP_BACK_ID, LP_COVER_ID } from '../lib/ids.js';
import { dataGet, findPathByUid, unwrapRef } from '../lib/values.js';
import { livePreviewEditorEl } from '../lib/live-preview.js';
import { previewFrame } from '../lib/preview-frame.js';
import { syncStoredVideoHolds } from './video-holds.js';
import { activeContainers } from '../lib/publish-containers.js';
import { autoOpenPanel, lpMode, setLpCollapsed } from '../lp-panel.js';
import { focusFieldOwner, focusFromPreview, focusPanelOn, soloSection } from '../focus-panel.js';
import { closeRightPanels, dismissChromeForPageEdit, handleAddRow, handleDuplicateRow, handleHideRow, handleInsertBardSet, handleInsertBlock, handleOpenGlobalSection, handleRemoveRow, handleRowCaps, handleSectionSettings, insertSection, openSectionPicker, overlaySidTemplate, watchNewRow } from '../section-library.js';
import { handleOpenChrome, handleOpenGlobal, notifyChromeDirty, notifyGlobalSectionDirty, saveGlobalsPanel, setChromeSidebarMode } from '../globals-panel.js';
import { editSession, handleAddColumn, handleAssetEdit, handleBardCommand, handleBlockFormat, handleColumnWidth, handleEditControl, handleEditEnd, handleEditInput, handleEditRequest, handleGridSpan, handleIconEdit, handleLinkEdit, handleMove, handleOpenPanelField, handleSaveSection, handleThemeSwatchesRequest } from '../inline-edit.js';
import { closeGlobalSectionPanel, forwardGlobalSectionFocus, globalSectionEditorOpen, saveGlobalSectionPanel } from '../global-section.js';
import { claimOrigin, markLivePreviewOpening } from '../open-in-preview.js';
import { confirmCloseDiscard, handleRequestCloseChrome, handleRequestCloseGlobal, hideNavSpinner } from '../pages.js';
import { listViewSyncTo, pinDockedPanelsUnderHeader } from '../lazy/listview.js';
import { handleOutline } from '../lazy/outline.js';
import { handleAiTextApply, handleAiTextGenerate, handleAiTextOpen, handleAiTextSetKeywords, syncAiTextToPreview } from '../lazy/ai-text.js';
import { collectAncestorSets, expandSet, findFieldElement, findSetByUid, handleFieldFocus, handleFieldHover, handleFocus, handleHover, topLevelSectionUid } from './sets.js';
import { applyDeclaredDefaults, restoreDockedHeaderPanels, scheduleHtmlTreePrefetch } from './header-toolbar.js';
import { tellPreviewWherePillIs } from './grid-rows.js';
import { openOverlay } from '../cp.js';
import { MSG, SOURCE } from '../lib/protocol.js';

// ===== add-section =====
// --- Add section ("+" in the preview) -------------------------------------------
// Each Replicator row carries an "insert a set before me" button (a popover
// trigger) at its top. Clicking the row AFTER the clicked section therefore opens
// Statamic's own Add Set picker at exactly the right position — no re-implemented
// picker. The last section falls back to the Replicator's own "Add Set" button.

/**
 * The "insert set here" trigger at the top of a sortable row. It's a popover
 * trigger (reka-ui) rendered as a centred wrapper around a single button.
 * Tried by id first, then by class, then by structure — the row also contains
 * many other buttons, so we must not just grab the first one.
 */
export function insertButtonOf(item) {
  const holder =
    item.querySelector(':scope > [id^="reka-popover-trigger"]') ??
    [...item.children].find((c) => c.classList?.contains('justify-center')) ??
    null;

  return holder?.querySelector('button') ?? null;
}

/**
 * Preview-originated Add Set session. When the picker is opened from the live
 * preview "+", we keep its anchorRect for the whole time the picker is open —
 * including list↔grid toggles, which remount the popover onto the CP trigger.
 * Admin-panel Add Set never sets this, so it stays in the sidebar.
 */
export let previewPickerSession = null; // { doc, win, anchorRect, observer, goneTimer }

/**
 * Only the Add Set picker — never "Search sections..." or other CP search
 * fields (those live in docked sidebars we must not reposition).
 */
export function findSetPickerSearchInput(doc) {
  const nodes = doc.querySelectorAll(
    '[data-set-picker-search-input], input[placeholder*="Search Sets" i]'
  );

  for (const node of nodes) {
    const input = node.tagName === 'INPUT' ? node : node.querySelector?.('input') || node;

    if (
      input instanceof (doc.defaultView?.HTMLElement || HTMLElement) &&
      input.getClientRects().length > 0
    ) {
      return input;
    }
  }

  return nodes[0] || null;
}

export function findSetPickerEl(doc, win) {
  const input = findSetPickerSearchInput(doc);

  if (!input) {
    return null;
  }

  // List popover (and its float wrapper) — prefer these so we never grab the
  // wide grid modal shell when both could match a climb.
  const list = input.closest('[data-set-picker-popover], .set-picker');

  if (list) {
    const parent = list.parentElement;

    if (parent && parent !== doc.body) {
      const cs = win.getComputedStyle(parent);
      const pw = parent.getBoundingClientRect().width;
      const floating =
        cs.position === 'fixed' ||
        cs.position === 'absolute' ||
        (cs.transform && cs.transform !== 'none');

      if (floating && pw > 180 && pw < 400) {
        return parent;
      }
    }

    return list;
  }

  // Grid modal: Search Sets inside a dialog, without .set-picker.
  const dialog = input.closest('[role="dialog"]');

  if (dialog) {
    return dialog;
  }

  let el = input;

  for (let i = 0; el && i < 12; i++) {
    const cs = win.getComputedStyle(el);

    if (cs.position === 'fixed' || cs.position === 'absolute') {
      return el;
    }

    el = el.parentElement;
  }

  return input.closest('[data-popper-placement]') || input.parentElement;
}

export function placeSetPicker(el, doc, win, anchorRect) {
  if (anchorRect) {
    const iframe = doc.getElementById('live-preview-iframe');

    if (iframe && el) {
      const measured = el.getBoundingClientRect().width || el.offsetWidth || 0;

      // Grid = wide ui-modal. Moving it under the "+" cuts it off on the left.
      // Leave Statamic's centre alone. List is ~w-72.
      if (measured >= 400) {
        return;
      }

      const ir = iframe.getBoundingClientRect();
      const w = measured || 288;
      const h = el.getBoundingClientRect().height || el.offsetHeight || 420;
      // Centre horizontally on the +, sit just below it.
      const preferredLeft = ir.left + (anchorRect.left || 0) + (anchorRect.width || 0) / 2 - w / 2;
      const left = Math.max(8, Math.min(preferredLeft, win.innerWidth - w - 8));
      let top = ir.top + (anchorRect.bottom || 0) + 8;

      if (top + h > win.innerHeight - 8) {
        top = Math.max(8, ir.top + (anchorRect.top || 0) - h - 8);
      }

      el.style.setProperty('position', 'fixed', 'important');
      el.style.setProperty('left', `${left}px`, 'important');
      el.style.setProperty('top', `${top}px`, 'important');
      el.style.setProperty('right', 'auto', 'important');
      el.style.setProperty('bottom', 'auto', 'important');
      el.style.setProperty('transform', 'none', 'important');
      el.style.setProperty('margin', '0', 'important');
      el.style.setProperty('z-index', '2147483000', 'important');
      el.style.setProperty('max-height', '85vh', 'important');
      el.style.setProperty('overflow', 'auto', 'important');

      return;
    }
  }

  const rect = el.getBoundingClientRect();

  if (rect.left >= 0 && rect.right <= win.innerWidth && rect.width > 0) {
    return; // already on screen — admin-panel / grid modal
  }

  const w = el.offsetWidth || 480;
  const h = el.offsetHeight || 420;

  el.style.setProperty('position', 'fixed', 'important');
  el.style.setProperty('left', `${Math.max(8, (win.innerWidth - w) / 2)}px`, 'important');
  el.style.setProperty('top', `${Math.max(8, (win.innerHeight - h) / 2)}px`, 'important');
  el.style.setProperty('right', 'auto', 'important');
  el.style.setProperty('bottom', 'auto', 'important');
  el.style.setProperty('transform', 'none', 'important');
  el.style.setProperty('z-index', '2147483000', 'important');
}

export function stopPreviewPickerSession() {
  if (!previewPickerSession) {
    return;
  }

  previewPickerSession.observer?.disconnect();
  clearTimeout(previewPickerSession.goneTimer);
  previewPickerSession.doc?.removeEventListener?.(
    'pointerdown',
    previewPickerSession.onDocPointer,
    true
  );

  try {
    previewPickerSession.iframeDoc?.removeEventListener?.(
      'pointerdown',
      previewPickerSession.onIframePointer,
      true
    );
  } catch {
    // iframe may already be gone / cross-origin
  }

  previewPickerSession.iframe?.removeEventListener?.(
    'load',
    previewPickerSession.onIframeLoad
  );
  previewPickerSession = null;
}

/** Close the open list Set picker (Escape, then toggle its trigger if needed). */
export function dismissOpenSetPicker(doc) {
  doc.dispatchEvent(
    new KeyboardEvent('keydown', {
      key: 'Escape',
      code: 'Escape',
      keyCode: 27,
      which: 27,
      bubbles: true,
      cancelable: true,
    })
  );

  setTimeout(() => {
    if (!findSetPickerSearchInput(doc)) {
      return;
    }

    const trigger = [...doc.querySelectorAll('[aria-expanded="true"]')].find(
      (el) =>
        el.closest?.('.replicator-fieldtype-container') ||
        (el.id || '').includes('reka-popover')
    );

    trigger?.click();
  }, 0);
}

/**
 * Keep pinning the picker under the preview "+" for as long as it stays open.
 * List↔grid remounts a new popover on the CP trigger — the observer catches
 * that and re-applies. Cleared when the Search Sets UI disappears.
 *
 * Clicks in the live-preview iframe never reach Statamic's popover
 * click-outside — so we dismiss list view ourselves on outside pointerdown.
 */
export function startPreviewPickerSession(doc, win, anchorRect) {
  stopPreviewPickerSession();

  // placeSetPicker writes style attributes. After the Vue split the CP panes
  // also stamp data-* attrs on every tick. Watching attributes here retriggers
  // that write and freezes the page. List↔grid remounts are childList.
  let placing = false;
  const ignoreUntil = Date.now() + 350;

  const isListPicker = (el) => {
    if (!el) {
      return false;
    }

    const w = el.getBoundingClientRect().width || el.offsetWidth || 0;

    return w > 0 && w < 400;
  };

  const onDocPointer = (event) => {
    if (!previewPickerSession || Date.now() < ignoreUntil) {
      return;
    }

    const el = findSetPickerEl(doc, win);

    if (!isListPicker(el)) {
      return;
    }

    if (el.contains(event.target)) {
      return;
    }

    dismissOpenSetPicker(doc);
  };

  const onIframePointer = () => {
    if (!previewPickerSession || Date.now() < ignoreUntil) {
      return;
    }

    const el = findSetPickerEl(doc, win);

    if (!isListPicker(el)) {
      return;
    }

    dismissOpenSetPicker(doc);
  };

  const bindIframe = () => {
    const iframe = doc.getElementById('live-preview-iframe');

    if (!iframe || !previewPickerSession) {
      return;
    }

    try {
      previewPickerSession.iframeDoc?.removeEventListener?.(
        'pointerdown',
        onIframePointer,
        true
      );
    } catch {
      // ignore
    }

    previewPickerSession.iframe = iframe;

    try {
      const iframeDoc = iframe.contentDocument;

      if (iframeDoc) {
        iframeDoc.addEventListener('pointerdown', onIframePointer, true);
        previewPickerSession.iframeDoc = iframeDoc;
      }
    } catch {
      // cross-origin
    }
  };

  const onIframeLoad = () => bindIframe();

  const tick = () => {
    if (!previewPickerSession) {
      return;
    }

    const el = findSetPickerEl(doc, win);

    if (el) {
      clearTimeout(previewPickerSession.goneTimer);
      previewPickerSession.goneTimer = null;
      placing = true;
      try {
        // Hidden until pinned under the "+" — otherwise Statamic first paints
        // the popover on the sidebar Add Set trigger.
        if (!el.dataset.svePickerPlaced) {
          el.style.setProperty('visibility', 'hidden', 'important');
        }

        placeSetPicker(el, doc, win, anchorRect);
        el.style.setProperty('visibility', 'visible', 'important');
        el.dataset.svePickerPlaced = '1';
        silenceSetPickerSearch(doc);
      } finally {
        placing = false;
      }
      bindIframe();

      return;
    }

    // Picker briefly unmounts while switching list↔grid — wait before ending.
    if (!previewPickerSession.goneTimer) {
      previewPickerSession.goneTimer = setTimeout(() => {
        stopPreviewPickerSession();
      }, 600);
    }
  };

  const observer = new MutationObserver(() => {
    if (placing) {
      return;
    }

    tick();
  });

  observer.observe(doc.body, { childList: true, subtree: true });
  doc.addEventListener('pointerdown', onDocPointer, true);

  const iframe = doc.getElementById('live-preview-iframe');

  iframe?.addEventListener('load', onIframeLoad);

  previewPickerSession = {
    doc,
    win,
    anchorRect,
    observer,
    goneTimer: null,
    onDocPointer,
    onIframePointer,
    onIframeLoad,
    iframe,
    iframeDoc: null,
  };
  bindIframe();
  tick();
}

/**
 * The picker is a popover anchored to its CP trigger. When opened from the
 * preview "+" we pin it under that button for the whole picker session
 * (list↔grid included). Without an anchorRect we only rescue off-screen
 * popovers — admin-panel Add Set is left alone.
 */
export function isSetPickerSearchField(el) {
  if (!el || el.tagName !== 'INPUT') {
    return false;
  }

  if (el.hasAttribute('data-set-picker-search-input')) {
    return true;
  }

  return /search sets/i.test(el.getAttribute('placeholder') || '');
}

export function applySetPickerSearchAttrs(input) {
  // Safari stores previous searches per origin for type=search and shows them
  // even with autocomplete=off. Chrome also ignores "off" on search fields.
  if ((input.getAttribute('type') || '').toLowerCase() === 'search') {
    input.type = 'text';
  }

  input.setAttribute('autocomplete', 'sve-off');
  input.autocomplete = 'sve-off';
  input.setAttribute('autocorrect', 'off');
  input.setAttribute('autocapitalize', 'off');
  input.setAttribute('spellcheck', 'false');
  input.setAttribute('data-1p-ignore', 'true');
  input.setAttribute('data-lpignore', 'true');
  input.setAttribute('data-form-type', 'other');
  input.setAttribute('aria-autocomplete', 'none');

  const name = input.getAttribute('name') || '';

  if (!name || /^search$/i.test(name)) {
    input.setAttribute('name', 'sve-set-search');
  }
}

export function onSetPickerSearchFocus(event) {
  const input = event.target;

  applySetPickerSearchAttrs(input);

  if (input.readOnly) {
    return;
  }

  // Browsers skip native suggestions on readonly fields. Lift it on the next
  // frame so the editor can still type.
  input.readOnly = true;
  requestAnimationFrame(() => {
    input.readOnly = false;
  });
}

export function silenceSetPickerSearch(doc) {
  const input = findSetPickerSearchInput(doc);

  if (!input || input.tagName !== 'INPUT') {
    return;
  }

  applySetPickerSearchAttrs(input);

  if (input.hasAttribute('data-sve-no-suggest')) {
    return;
  }

  input.setAttribute('data-sve-no-suggest', '');
  input.addEventListener('focus', onSetPickerSearchFocus);
}

export function armSetPickerSearchSilence(win) {
  if (win.__sveSetPickerSilence) {
    return;
  }

  win.__sveSetPickerSilence = true;

  win.document.addEventListener(
    'focusin',
    (event) => {
      const el = event.target;

      if (!(el instanceof win.HTMLInputElement) || !isSetPickerSearchField(el)) {
        return;
      }

      applySetPickerSearchAttrs(el);
      onSetPickerSearchFocus(event);
      silenceSetPickerSearch(win.document);
    },
    true
  );
}

export function ensurePickerVisible(doc, win, anchorRect = null) {
  closeCodeDockPopups(doc);

  if (anchorRect) {
    startPreviewPickerSession(doc, win, anchorRect);

    // Also nudge a few times up front — floating-ui writes after open.
    let attempts = 0;

    const run = () => {
      const el = findSetPickerEl(doc, win);

      if (!el) {
        if (++attempts < 25) {
          setTimeout(run, 100);
        }

        return;
      }

      placeSetPicker(el, doc, win, anchorRect);
      silenceSetPickerSearch(doc);
      setTimeout(() => placeSetPicker(el, doc, win, anchorRect), 130);
      setTimeout(() => placeSetPicker(el, doc, win, anchorRect), 320);
    };

    setTimeout(run, 80);

    return;
  }

  let attempts = 0;

  const run = () => {
    const el = findSetPickerEl(doc, win);

    if (!el) {
      if (++attempts < 25) {
        setTimeout(run, 100);
      }

      return;
    }

    placeSetPicker(el, doc, win, null);
    silenceSetPickerSearch(doc);
  };

  setTimeout(run, 80);
}

export function repositionAfterAdd(uid, doc) {
  for (const container of activeContainers(doc)) {
    const values = unwrapRef(container.values);

    if (!values || typeof values !== 'object') {
      continue;
    }

    const path = findPathByUid(values, uid);

    if (path === null) {
      continue;
    }

    const dot = path.lastIndexOf('.');

    if (dot === -1) {
      return;
    }

    const parentPath = path.slice(0, dot);
    const index = Number(path.slice(dot + 1));
    const initial = dataGet(values, parentPath);

    if (!Array.isArray(initial) || !Number.isInteger(index)) {
      return;
    }

    const startLength = initial.length;
    let attempts = 0;

    const poll = () => {
      const current = dataGet(unwrapRef(container.values), parentPath);

      if (!Array.isArray(current)) {
        return;
      }

      if (current.length > startLength) {
        const next = [...current];
        const [added] = next.splice(next.length - 1, 1); // the appended set
        next.splice(index + 1, 0, added); // right after the clicked section

        container.setFieldValue(parentPath, next);

        return;
      }

      // Give the user time to browse the picker; stop if they never pick one.
      if (++attempts < 240) {
        setTimeout(poll, 150);
      }
    };

    setTimeout(poll, 150);

    return;
  }
}

/** Opens Statamic's Add Set picker to insert a section after the given one. */
export function handleAddSet(data, doc, win) {
  // The "+" on a section opens the section library (docked panel). You place a
  // section by dragging a card into the preview, so no insert position is passed.
  void ensurePanel('sections').then(() => openSectionPicker(win));
}

export function nativeAddSetAt(setEl, uid, doc, win, anchorRect = null, position = 'after') {
  const item = setEl.closest('[class*="sortable-item"]');

  if (!item?.parentElement) {
    return false;
  }

  // Walk the real row list (not nextElementSibling — a stray node between rows
  // must not throw the position off).
  const rows = [...item.parentElement.children].filter((c) =>
    /sortable-item/.test((c.className || '').toString())
  );

  // Every row carries an "insert before me" trigger, so both sides are the same
  // question asked of a different row: this one to land above it, the next one
  // to land below. `next` is also what says whether the fallback has to move the
  // set afterwards — at the end of the list, appending already puts it right.
  const next = rows[rows.indexOf(item) + 1] ?? null;
  const target = position === 'before' ? item : next;

  // Preferred: click that trigger — Statamic then inserts exactly where we want
  // and nothing else is needed.
  if (target) {
    const trigger = insertButtonOf(target);

    if (trigger) {
      trigger.click();
      ensurePickerVisible(doc, win, anchorRect);

      return true;
    }
  }

  // Otherwise the Replicator's own "Add Set" button, which appends at the end —
  // so unless this really is the last row, move the picked set into place after.
  //
  // The label belongs to whoever wrote the blueprint (button_label, add_row), so
  // matching on words alone took whichever add button came first in the DOM. A
  // links block holds a grid labelled "Tilføj link", and once that block was
  // expanded its button stood above the replicator's own — so the "+" after the
  // last block quietly added a link instead of opening the set picker.
  //
  // Depth settles it: the set list's own button belongs to the replicator, not
  // to anything inside one of its sets. Rows above the replicator don't count —
  // this field may well sit inside a page section, which is a row itself.
  const replicator = item.closest('.replicator-fieldtype-container') ?? doc;
  const insideOwnSet = (b) => {
    const owner = b.closest('[class*="sortable-item"]');

    return !!owner && replicator.contains(owner);
  };

  const candidates = [...replicator.querySelectorAll('button')].filter((b) =>
    /add set|add block|tilføj/i.test(b.textContent || '')
  );

  // Last resort is the old first-match: a picker in the wrong place still beats
  // a "+" that does nothing at all if the markup ever moves the button.
  const addButton = candidates.find((b) => !insideOwnSet(b)) ?? candidates[0];

  if (!addButton) {
    return false;
  }

  if (next) {
    repositionAfterAdd(uid, doc);
  }

  addButton.click();
  ensurePickerVisible(doc, win, anchorRect);

  return true;
}

/**
 * Choose a set in the picker on the preview's behalf.
 *
 * The preview already asked which block to add — its own list, right at the "+"
 * — because Statamic's picker can only open where the fields are, and a global
 * section's are in here. So the picker is opened as usual and the answer is
 * given to it, which keeps the insert itself entirely native.
 */
export function autoPickSet(doc, win, label) {
  const wanted = String(label || '').trim().toLowerCase();

  if (!wanted) {
    return;
  }

  let attempts = 0;

  const run = () => {
    const picker = findSetPickerEl(doc, win);
    const item = picker
      ? [...picker.querySelectorAll('button, [role="option"], [role="menuitem"], li, a')].find(
          (el) => el.textContent.trim().toLowerCase() === wanted
        )
      : null;

    if (item) {
      item.click();

      return;
    }

    if (++attempts < 40) {
      setTimeout(run, 100);
    }
  };

  setTimeout(run, 150);
}

/**
 * Off while the global section still lives in its own panel: a picker mounted
 * out here cannot reach the fields in there reliably. Kept, and switched on
 * again, once the section is edited in this window like any other.
 */
export const PICKER_OVER_PREVIEW = false;

/** Plus-button rect in the innermost preview → coordinates in `win.top`. */
export function previewRectInTop(doc, win, localRect) {
  if (!localRect) {
    return null;
  }

  let left = localRect.left || 0;
  let top = localRect.top || 0;
  let iframe = doc.getElementById('live-preview-iframe');

  try {
    const nested = iframe?.contentDocument?.getElementById('live-preview-iframe');

    if (nested) {
      iframe = nested;
    }
  } catch {
    /* ignore */
  }

  let el = iframe;

  while (el) {
    const r = el.getBoundingClientRect();

    left += r.left;
    top += r.top;

    const owner = el.ownerDocument?.defaultView;

    if (!owner || owner === owner.top) {
      break;
    }

    el = owner.frameElement;
  }

  const width = localRect.width || 0;
  const height = localRect.height || 0;

  return {
    left,
    top,
    width,
    height,
    right: left + width,
    bottom: top + height,
  };
}

/** Same as previewRectInTop, but stop at `win` (the overlay editor), not the host. */
export function previewRectInWindow(doc, win, localRect) {
  if (!localRect) {
    return null;
  }

  let left = localRect.left || 0;
  let top = localRect.top || 0;
  let iframe = doc.getElementById('live-preview-iframe');

  try {
    const nested = iframe?.contentDocument?.getElementById('live-preview-iframe');

    if (nested) {
      iframe = nested;
    }
  } catch {
    /* ignore */
  }

  let el = iframe;

  while (el) {
    const r = el.getBoundingClientRect();

    left += r.left;
    top += r.top;

    const owner = el.ownerDocument?.defaultView;

    if (!owner || owner === win || owner === owner.top) {
      break;
    }

    el = owner.frameElement;
  }

  const width = localRect.width || 0;
  const height = localRect.height || 0;

  return {
    left,
    top,
    width,
    height,
    right: left + width,
    bottom: top + height,
  };
}

function groupedPickerSets(sets) {
  if (!Array.isArray(sets) || !sets.length) {
    return [];
  }

  if (sets[0]?.sets) {
    return sets;
  }

  // Statamic's picker, on open: `selectedGroupHandle = this.sets[0].handle`.
  // Without a handle that assignment is `undefined`, Vue keeps `null`, and
  // `visibleSets` is empty — Search Sets opens with no Headline/Richtext/Links.
  // Do not use `all`: grid mode starts with a synthetic All tab, then writes
  // `groups[handle]` and concats onto `groups.all`. Handle `all` overwrites
  // that tab and concats the same sets onto themselves — Headline twice.
  return [{ handle: 'sets', display: '', sets }];
}

/**
 * Statamic's own `set-picker`, mounted on the top CP document at the plus.
 * The trigger sits on the plus — the popover opens there. The sidebar Add Set
 * button is never clicked, so nothing flashes in the left panel.
 */
let previewSetPickerApp = null;

export function openSetPickerOverPreview(doc, win, sets, anchorRect, onChoose) {
  const Vue = win.Vue;
  const app = win.Statamic?.$app;
  const Picker = app?.component?.('set-picker');
  const grouped = groupedPickerSets(sets);

  if (!Vue?.createApp || !Picker || !grouped.length) {
    return false;
  }

  // Plus click lives in the preview iframe. That document forwards pointerdown
  // onto this overlay body so CP menus close. Mounting Search Sets in the same
  // turn lets ui-popover treat that gesture as clicked-away — host is gone
  // before paint. Wait until the click is finished. Do not remove this.
  win.setTimeout(() => {
    mountSetPickerOverPreview(doc, win, Vue, app, Picker, grouped, anchorRect, onChoose);
  }, 0);

  return true;
}

function mountSetPickerOverPreview(doc, win, Vue, app, Picker, grouped, anchorRect, onChoose) {
  if (previewSetPickerApp) {
    try {
      previewSetPickerApp.unmount();
    } catch {
      /* ignore */
    }

    previewSetPickerApp = null;
  }

  doc.querySelectorAll('[data-sve-set-picker-host]').forEach((el) => el.remove());

  const host = doc.createElement('div');
  const vw = doc.defaultView?.innerWidth || 1440;
  const vh = doc.defaultView?.innerHeight || 900;
  const pickerW = 280;
  const pickerH = 340;
  let left = Math.round(anchorRect?.left || 0);
  let top = Math.round(anchorRect?.bottom || anchorRect?.top || 0);

  if (left + pickerW > vw - 12) {
    left = Math.max(12, vw - pickerW - 12);
  }

  if (top + pickerH > vh - 12) {
    top = Math.max(12, Math.round((anchorRect?.top || top) - pickerH));
  }

  host.dataset.sveSetPickerHost = '';
  host.style.cssText = `position:fixed;z-index:2147483647;left:${left}px;top:${top}px;width:1px;height:1px;`;
  doc.body.appendChild(host);

  let mounted = null;
  let vm = null;
  const ignoreAwayUntil = Date.now() + 800;

  const close = () => {
    try {
      mounted?.unmount();
    } catch {
      /* ignore */
    }

    if (previewSetPickerApp === mounted) {
      previewSetPickerApp = null;
    }

    host.remove();
  };

  try {
    const wrapper = Vue.defineComponent({
      setup() {
        return () =>
          Vue.h(
            Picker,
            {
              ref: (el) => {
                vm = el;
              },
              sets: grouped,
              enabled: true,
              align: 'start',
              onAdded: (set) => {
                onChoose(typeof set === 'string' ? { handle: set } : set);
                setTimeout(close, 0);
              },
              // The plus click that opened us is still the current gesture.
              // Treat it as "away" and the menu flashes open then shut.
              onClickedAway: () => {
                if (Date.now() < ignoreAwayUntil) {
                  return;
                }

                setTimeout(close, 0);
              },
            },
            {
              trigger: () =>
                Vue.h('button', {
                  type: 'button',
                  style: 'width:1px;height:1px;padding:0;border:0;opacity:0;',
                  'aria-hidden': 'true',
                }),
            }
          );
      },
    });

    mounted = Vue.createApp(wrapper);

    // Same registries as Statamic's app — a copy misses ui-popover / $keys
    // on the prototype chain, and Search Sets never paints.
    mounted._context.components = app._context.components;
    mounted._context.directives = app._context.directives;
    mounted._context.provides = app._context.provides;
    Object.assign(mounted.config.globalProperties, app.config.globalProperties);

    mounted.mount(host);
    previewSetPickerApp = mounted;

    const pickerVm = (el) => {
      if (el && typeof el.open === 'function') {
        return el;
      }

      const proxy = el?.$?.proxy ?? el?.$?.ctx ?? el?.__vueParentComponent?.proxy;

      return proxy && typeof proxy.open === 'function' ? proxy : null;
    };

    const tryOpen = (n = 0) => {
      const inst = pickerVm(vm);

      if (inst) {
        inst.open();

        return;
      }

      if (n < 20) {
        setTimeout(() => tryOpen(n + 1), 40);

        return;
      }

      close();
    };

    tryOpen();
  } catch {
    close();
  }
}

/** Replicator Vue instance that owns this row — the one with addSet. */
export function replicatorOwningUid(uid, rootDoc) {
  if (!uid) {
    return null;
  }

  const docs = [rootDoc];

  rootDoc.querySelectorAll?.('iframe').forEach((frame) => {
    try {
      if (frame.contentDocument) {
        docs.push(frame.contentDocument);
      }
    } catch {
      /* ignore */
    }
  });

  for (const doc of docs) {
    const found = replicatorOwningUidIn(uid, doc);

    if (found) {
      return found;
    }
  }

  return null;
}

function replicatorOwningUidIn(uid, doc) {
  const el = findSetByUid(uid, doc);

  if (!el) {
    return null;
  }

  let vn = el.__vueParentComponent;

  for (let i = 0; vn && i < 50; i++) {
    const proxy = vn.proxy;

    if (proxy && typeof proxy.addSet === 'function' && (proxy.config?.sets || proxy.setConfigs)) {
      return proxy;
    }

    vn = vn.parent;
  }

  let cur = el;

  for (let i = 0; cur && i < 30; i++) {
    const proxy = cur.__vueParentComponent?.proxy;

    if (proxy && typeof proxy.addSet === 'function' && (proxy.config?.sets || proxy.setConfigs)) {
      return proxy;
    }

    cur = cur.parentElement;
  }

  return null;
}

/** Flat [{handle, display}] for openSetPickerOverPreview. */
export function pickerSetsFrom(sent, field) {
  if (Array.isArray(sent) && sent.length && sent[0]?.handle) {
    return sent;
  }

  return flattenPickerSets(field?.setConfigs ?? field?.config?.sets ?? []);
}

export function flattenPickerSets(raw) {
  if (!raw) {
    return [];
  }

  if (Array.isArray(raw)) {
    if (raw[0]?.handle && !raw[0]?.sets) {
      return raw;
    }

    const out = [];

    raw.forEach((group) => {
      const inner = group?.sets ?? group;

      if (Array.isArray(inner)) {
        inner.forEach((set) => {
          if (set?.handle) {
            out.push(set);
          }
        });
      } else if (inner && typeof inner === 'object') {
        Object.entries(inner).forEach(([handle, set]) => {
          out.push({ handle, display: set?.display || handle, ...(set || {}) });
        });
      }
    });

    return out;
  }

  if (typeof raw === 'object') {
    const out = [];

    Object.entries(raw).forEach(([key, val]) => {
      if (val?.sets) {
        out.push(...flattenPickerSets(val.sets));
      } else {
        out.push({ handle: val?.handle || key, display: val?.display || key, ...(val || {}) });
      }
    });

    return out;
  }

  return [];
}

function nativeAddSetAtFallback(anchorUid, sectionUid, doc, win, anchorRect, position, handle) {
  const section = sectionUid ? findSetByUid(sectionUid, doc) : null;
  const block = anchorUid ? findSetByUid(anchorUid, doc) : null;

  if (block) {
    nativeAddSetAt(block, anchorUid, doc, win, anchorRect, position);
    if (handle) {
      autoPickSet(doc, win, handle);
    }
  } else if (section) {
    const addButton = [...section.querySelectorAll('button')].find((b) =>
      /add set|add block|tilføj/i.test(b.textContent || '')
    );

    addButton?.click();
    ensurePickerVisible(doc, win, anchorRect);

    if (handle) {
      autoPickSet(doc, win, handle);
    }
  }
}

export function handleAddBlockNative(data, doc, win) {
  const { anchorUid, sectionUid, anchorRect = null, position = 'after' } = data;

  if (data.template || (data.fieldDefaults && Object.keys(data.fieldDefaults).length)) {
    watchNewRow(doc, win, data, (container, values, parentPath, added) => {
      overlaySidTemplate(win, container, values, parentPath, added, data.template, data.fieldDefaults);
    });
  }

  // A global section's fields are not in this form. They belong to the synced
  // source entry, whose own form is the panel docked beside the preview — so the
  // set lives in that document, and the picker has to open in there. Without
  // this the lookup below finds nothing, retries, and the "+" does nothing.
  //
  // Edited in this window there is no other document: the section's sets are
  // right here, so the lookup below finds them, the "+" takes the same path a
  // page section's does, and Statamic's own picker opens over the preview,
  // pinned under the button. That is what the missing panel means here.
  if (data.global) {
    const frame = doc.getElementById(GLOBAL_SECTION_PANEL_ID)?.querySelector('iframe');

    if (frame?.contentWindow) {
      const forward = (extra = {}) =>
        frame.contentWindow.postMessage(
          { ...data, ...extra, source: SOURCE, type: MSG.SVE_SECTION_ADD_BLOCK },
          win.location.origin
        );

      // The picker belongs over the preview, so it is opened here and the answer
      // is sent on. Only if that cannot be mounted does the panel open its own.
      const opened =
        PICKER_OVER_PREVIEW &&
        openSetPickerOverPreview(doc, win, data.sets, data.anchorRect, (set) =>
          forward({ setHandle: set?.handle, setLabel: set?.display || set?.handle })
        );

      if (!opened) {
        forward();
      }

      return;
    }
  }

  // Preview "+": Statamic's set-picker in the *editor* document, at the plus.
  // The sidebar Add Set button is hidden behind the overlay — clicking it
  // looks like plus does nothing. Mount the same Search Sets component here.
  //
  // LOCKED. Do not remove this. Only skip if the user asks in this message.
  if (anchorRect && !data.global) {
    const field =
      replicatorOwningUid(anchorUid, doc) ||
      replicatorOwningUid(sectionUid, doc);
    const sets = pickerSetsFrom(data.sets, field);
    const rect = previewRectInWindow(doc, win, anchorRect) || anchorRect;
    const vueWin = win.Statamic?.$app ? win : win.top || win;

    const insertChosen = (handle) => {
      if (!handle) {
        return;
      }

      if (data.field) {
        handleInsertBlock(
          {
            field: data.field,
            set: handle,
            anchorUid: data.anchorUid,
            position: data.position,
            scope: data.scope || data.sectionUid,
            template: data.template,
            fieldDefaults: data.fieldDefaults,
            rowTemplate: data.rowTemplate,
            sectionType: data.sectionType,
          },
          doc,
          win
        );

        return;
      }

      if (field && typeof field.addSet === 'function') {
        field.addSet(handle);

        if (anchorUid) {
          repositionAfterAdd(anchorUid, doc);
        }

        return;
      }

      handleInsertBlock(
        {
          field: data.field,
          set: handle,
          anchorUid: data.anchorUid,
          position: data.position,
          scope: data.scope || data.sectionUid,
          template: data.template,
          fieldDefaults: data.fieldDefaults,
          rowTemplate: data.rowTemplate,
          sectionType: data.sectionType,
        },
        doc,
        win
      );
    };

    // List "+" only offers `item`. Opening a picker the overlay then hides is
    // why the button looked dead — write the row immediately.
    if (data.field && sets.length === 1 && sets[0]?.handle) {
      insertChosen(sets[0].handle);

      return;
    }

    const opened = openSetPickerOverPreview(win.document, vueWin, sets, rect, (set) => {
      insertChosen(set?.handle);
    });

    if (opened) {
      return;
    }
  }

  const section = sectionUid ? findSetByUid(sectionUid, doc) : null;

  if (section) {
    collectAncestorSets(section).forEach(expandSet);
    expandSet(section);
  }

  let attempts = 0;

  const run = () => {
    if (anchorUid) {
      const block = findSetByUid(anchorUid, doc);

      if (block) {
        collectAncestorSets(block).forEach(expandSet);
        nativeAddSetAt(block, anchorUid, doc, win, anchorRect, position);

        return;
      }
    } else if (section) {
      const addButton = [...section.querySelectorAll('button')].find((b) => /add set|add block|tilføj/i.test(b.textContent || ''));

      if (addButton) {
        addButton.click();
        ensurePickerVisible(doc, win, anchorRect);

        return;
      }
    }

    if (++attempts < 25) {
      setTimeout(run, 100); // the row mounts a beat after the section expands
    }
  };

  setTimeout(run, 60);
}

/**
 * Walk the Vue parent chain from el looking for Bard's fieldtype proxy
 * (openSetPicker / editor / showAddSetButton).
 */
export function findBardVueProxy(el) {
  let vn = el?.__vueParentComponent;

  if (!vn && el?.querySelector) {
    const pm = el.querySelector('.ProseMirror') || el.querySelector('[contenteditable="true"]');

    vn = pm?.__vueParentComponent;
  }

  for (let i = 0; vn && i < 40; i++) {
    const proxy = vn.proxy;

    if (
      proxy &&
      (typeof proxy.openSetPicker === 'function' ||
        (proxy.editor && 'showAddSetButton' in proxy))
    ) {
      return proxy;
    }

    vn = vn.parent;
  }

  // Fallback: climb DOM and check each node's Vue parent.
  let cur = el;

  for (let i = 0; cur && i < 30; i++) {
    const proxy = cur.__vueParentComponent?.proxy;

    if (
      proxy &&
      (typeof proxy.openSetPicker === 'function' ||
        (proxy.editor && 'showAddSetButton' in proxy))
    ) {
      return proxy;
    }

    cur = cur.parentElement;
  }

  return null;
}

/**
 * Place TipTap's selection inside the top-level child at index (required for
 * Bard's floating SetPicker to mount — DOM Selection alone is not enough).
 */
export function placeBardTipTapAtIndex(editor, index) {
  if (!editor?.state?.doc) {
    return false;
  }

  let targetPos = null;
  let lastTextPos = null;
  let i = 0;

  editor.state.doc.forEach((node, pos) => {
    if (node.isTextblock) {
      lastTextPos = pos + 1;
    }

    if (Number.isInteger(index) && i === index) {
      targetPos = pos + (node.isTextblock ? 1 : 0);
    }

    i++;
  });

  if (targetPos == null) {
    targetPos = lastTextPos;
  }

  if (targetPos == null) {
    editor.chain().focus().run();

    return false;
  }

  try {
    editor.chain().focus().setTextSelection(targetPos).run();

    return true;
  } catch {
    try {
      editor.chain().focus().run();
    } catch {
      /* ignore */
    }

    return false;
  }
}

/**
 * Place the caret in the Bard ProseMirror at a top-level child index (matching
 * the preview wrapper's children, including set node-views).
 */
export function placeBardCaretAtIndex(pm, index, win) {
  if (!pm) {
    return false;
  }

  const kids = [...pm.children];
  const target = Number.isInteger(index) ? kids[index] : kids[kids.length - 1];

  if (!target) {
    pm.focus();

    return false;
  }

  pm.focus();

  try {
    const range = win.document.createRange();

    range.selectNodeContents(target);
    range.collapse(true);

    const sel = win.getSelection();

    sel.removeAllRanges();
    sel.addRange(range);
  } catch {
    /* selection APIs can throw on detached nodes */
  }

  return true;
}

/**
 * CP-side fallback when Bard's SetPicker isn't mounted yet: same Search Sets
 * UX (search + list), pinned under the preview "+", inserting via insert-bard-set.
 */
export function openBardSetPickerFallback(doc, win, data) {
  const sets = Array.isArray(data.sets) ? data.sets : [];

  if (!sets.length) {
    return;
  }

  doc.getElementById('sve-bard-set-fallback')?.remove();

  const panel = doc.createElement('div');

  panel.id = 'sve-bard-set-fallback';
  panel.setAttribute('data-set-picker-popover', '');
  panel.style.cssText =
    'position:fixed;z-index:999999;width:260px;max-height:320px;overflow:auto;' +
    'background:#fff;color:#18181b;border:1px solid #e4e4e7;border-radius:8px;' +
    'box-shadow:0 10px 40px rgba(0,0,0,.18);padding:8px;font-size:13px;';

  if (doc.documentElement.classList.contains('dark')) {
    panel.style.background = '#18181b';
    panel.style.color = '#fafafa';
    panel.style.borderColor = '#3f3f46';
  }

  const search = doc.createElement('input');

  search.type = 'text';
  search.setAttribute('data-set-picker-search-input', '');
  search.setAttribute('autocomplete', 'sve-off');
  search.setAttribute('autocorrect', 'off');
  search.setAttribute('autocapitalize', 'off');
  search.setAttribute('spellcheck', 'false');
  search.setAttribute('name', 'sve-set-search');
  search.placeholder = 'Search Sets...';
  search.style.cssText =
    'width:100%;box-sizing:border-box;margin-bottom:6px;padding:6px 8px;' +
    'border:1px solid #d4d4d8;border-radius:6px;background:transparent;color:inherit;';

  const list = doc.createElement('div');

  const render = (q = '') => {
    list.innerHTML = '';
    const needle = q.trim().toLowerCase();

    sets
      .filter((s) => {
        const label = `${s.display || ''} ${s.handle || ''}`.toLowerCase();

        return !needle || label.includes(needle);
      })
      .forEach((s) => {
        const btn = doc.createElement('button');

        btn.type = 'button';
        btn.textContent = s.display || s.handle;
        btn.style.cssText =
          'display:block;width:100%;text-align:left;padding:8px 10px;border:none;' +
          'border-radius:6px;background:transparent;color:inherit;cursor:pointer;';
        btn.addEventListener('mouseenter', () => {
          btn.style.background = doc.documentElement.classList.contains('dark')
            ? 'rgba(255,255,255,.08)'
            : 'rgba(0,0,0,.05)';
        });
        btn.addEventListener('mouseleave', () => {
          btn.style.background = 'transparent';
        });
        btn.addEventListener('click', () => {
          panel.remove();
          stopPreviewPickerSession();
          handleInsertBardSet(
            {
              field: data.field,
              set: s.handle,
              scope: data.scope,
              index: data.index,
            },
            doc,
            win
          );
        });
        list.appendChild(btn);
      });
  };

  search.addEventListener('input', () => render(search.value));
  render();

  panel.appendChild(search);
  panel.appendChild(list);
  doc.body.appendChild(panel);

  ensurePickerVisible(doc, win, data.anchorRect || null);
  setTimeout(() => search.focus(), 50);

  const onOutside = (e) => {
    if (panel.contains(e.target)) {
      return;
    }

    panel.remove();
    doc.removeEventListener('pointerdown', onOutside, true);
    stopPreviewPickerSession();
  };

  setTimeout(() => doc.addEventListener('pointerdown', onOutside, true), 100);
}

/**
 * Preview "+" on a Bard field: open Statamic's real SetPicker (Search Sets),
 * pinned under the plus — same component the replicator inserter uses.
 *
 * Bard only mounts SetPicker while showAddSetButton is true (empty focused
 * textblock via TipTap). We drive TipTap selection, then open; if the native
 * picker never mounts we fall back to a Search Sets list with the field's sets.
 */
export function handleAddBardSetNative(data, doc, win) {
  const { field, scope, index = null, anchorRect = null, sets = [] } = data;

  if (!field) {
    return;
  }

  if (scope && autoOpenPanel(win)) {
    soloSection(topLevelSectionUid(scope, doc) || scope, doc, win);
  }

  handleFieldFocus(field, doc, { scopeUid: scope || undefined });

  let attempts = 0;

  const run = () => {
    const fieldEl = findFieldElement(field, doc, scope || undefined);
    const bardEl =
      fieldEl?.closest('.bard-fieldtype') || fieldEl?.querySelector('.bard-fieldtype') || fieldEl;
    const pm = bardEl?.querySelector('.ProseMirror') || bardEl?.querySelector('[contenteditable="true"]');

    if (!bardEl || !pm) {
      if (++attempts < 30) {
        setTimeout(run, 100);
      } else {
        openBardSetPickerFallback(doc, win, data);
      }

      return;
    }

    const proxy = findBardVueProxy(bardEl);

    if (proxy?.editor) {
      placeBardTipTapAtIndex(proxy.editor, index);
    } else {
      placeBardCaretAtIndex(pm, index, win);
    }

    // Temporarily allow the floating set button so SetPicker can mount even
    // if TipTap's "empty paragraph" heuristic lags a frame behind focus.
    const prevAlways = proxy?.config?.always_show_set_button;
    let restored = false;

    const restoreAlways = () => {
      if (!proxy?.config || restored) {
        return;
      }

      restored = true;
      proxy.config.always_show_set_button = prevAlways;
    };

    if (proxy?.config) {
      proxy.config.always_show_set_button = true;
    }

    if (proxy) {
      proxy.showAddSetButton = true;
    }

    let openAttempts = 0;

    const tryOpen = () => {
      if (proxy) {
        try {
          if (proxy.$refs?.setPicker && typeof proxy.$refs.setPicker.open === 'function') {
            proxy.$refs.setPicker.open();
            ensurePickerVisible(doc, win, anchorRect);
            setTimeout(restoreAlways, 1500);

            return;
          }

          if (typeof proxy.openSetPicker === 'function' && proxy.$refs?.setPicker) {
            proxy.openSetPicker();
            ensurePickerVisible(doc, win, anchorRect);
            setTimeout(restoreAlways, 1500);

            return;
          }
        } catch {
          /* fall through */
        }
      }

      const trigger =
        bardEl.querySelector('.bard-set-selector button') ||
        bardEl.querySelector('.bard-set-selector [aria-expanded]') ||
        doc.querySelector('.bard-set-selector button');

      if (trigger) {
        trigger.click();
        ensurePickerVisible(doc, win, anchorRect);
        setTimeout(restoreAlways, 1500);

        return;
      }

      if (++openAttempts < 25) {
        setTimeout(tryOpen, 80);

        return;
      }

      restoreAlways();
      openBardSetPickerFallback(doc, win, { ...data, sets });
    };

    setTimeout(tryOpen, 60);
  };

  setTimeout(run, 120);
}

/**
 * When a synced section panel is open, field DOM (focus, assets, link UI) lives
 * in that iframe — not the page publish form. Value writes still go through
 * sectionPanelContainer on the parent.
 */
export function globalSectionEditorDoc(doc) {
  // Edited in this window there is no panel, so this is null and every caller
  // works in `doc` — exactly as it does for one of the page's own sections.
  const frame = doc.getElementById(GLOBAL_SECTION_PANEL_ID)?.querySelector('iframe');

  try {
    return frame?.contentDocument || null;
  } catch {
    return null;
  }
}

export function globalSectionEditorWin(win) {
  const frame = win.document.getElementById(GLOBAL_SECTION_PANEL_ID)?.querySelector('iframe');

  try {
    return frame?.contentWindow || null;
  } catch {
    return null;
  }
}

/** True when the message came from the preview iframe, including a nested one. */
function isPreviewMessageSource(event, doc) {
  const win = doc.defaultView;

  // The plus click listener is created in this overlay script and bound onto
  // the preview document. `parent.postMessage` then has event.source === this
  // window, not the iframe. Rejecting that is why Search Sets never opened.
  if (win && event.source === win) {
    return true;
  }

  const frames = [...doc.querySelectorAll('#live-preview-iframe')];

  if (!frames.length) {
    return false;
  }

  const allowed = new Set();

  try {
    frames.forEach((iframe) => {
      let frame = iframe;

      while (frame) {
        allowed.add(frame.contentWindow);
        frame = frame.contentDocument?.getElementById('live-preview-iframe');
      }
    });
  } catch {
    /* cross-origin */
  }

  try {
    let source = event.source;

    while (source) {
      if (allowed.has(source)) {
        return true;
      }

      if (source === source.parent) {
        break;
      }

      source = source.parent;
    }
  } catch {
    /* cross-origin */
  }

  // WindowProxy identity fails after Live Preview replaces the iframe node:
  // the plus still posts from the live document, getElementById holds a stale
  // one, Search Sets never opens. Walk the posting window's frameElement, and
  // accept a same-origin document that actually has the plus layer.
  try {
    let el = event.source?.frameElement;

    while (el) {
      if (el.id === 'live-preview-iframe') {
        return true;
      }

      el = el.ownerDocument?.defaultView?.frameElement;
    }
  } catch {
    /* cross-origin */
  }

  try {
    if (event.origin !== doc.defaultView?.location.origin || !event.source) {
      return false;
    }

    const srcDoc = event.source.document;

    if (srcDoc?.getElementById('__sve-inserters') || srcDoc?.querySelector('[data-sid-insert]')) {
      return true;
    }
  } catch {
    /* cross-origin */
  }

  return false;
}

export function createMessageListener(doc = document, win = window) {
  return function handleMessage(event) {
    // Guard: only accept messages from the live-preview iframe (and a nested
    // one). Matching only the outer frame's contentWindow drops plus clicks
    // from the inner document — Search Sets never opens.
    if (!isPreviewMessageSource(event, doc)) {
      return;
    }

    const { data } = event;

    if (!data || data.source !== SOURCE) {
      return;
    }

    if (data.type === MSG.SVE_VIDEO_HOLDS_REQUEST) {
      syncStoredVideoHolds(win, doc);

      return;
    }

    if (data.type === MSG.CLICK) {
      if (data.htmlPath) {
        ask('html-tree:from-preview', { path: data.htmlPath, src: data.componentSrc || '' });

        return;
      }

      // Synced section: focus/solo runs inside the left iframe (source entry),
      // not the page form — those uids are not on this page.
      if (forwardGlobalSectionFocus(data, doc, win)) {
        return;
      }

      // Normal page click while the synced-section editor is still up: put the
      // page form back so the sidebar matches the section being edited.
      if (globalSectionEditorOpen(doc) && !data.global) {
        closeGlobalSectionPanel(win);
        previewFrame(doc)?.contentWindow?.postMessage(
          { source: SOURCE, type: MSG.SVE_FORCE_EXIT_GLOBAL },
          win.location.origin
        );
      }

      // Whatever the click turns out to mean below, the tree should show where it
      // landed. Placed here, before the branching, because the branches lead to
      // different functions — a field click with the focus panel on never reaches
      // `focusFromPreview` — and "the preview reported a click" is true of all of
      // them exactly once.
      listViewSyncTo(win, data.scope, data.uid);
      applyDeclaredDefaults(data, doc);

      // Template dock follows the section in publish values. Opening the left
      // panel is a different question (`autoOpenPanel`); collapsing that pane
      // must not skip the file load.
      const dockUid = data.uid || data.scope;

      if (dockUid) {
        syncCodeDock(win, doc, dockUid);
      }

      if (data.field) {
        // Open what the field belongs to. With the focus panel on that is the
        // block holding it; without it, the top-level section — a nested block
        // passes its row id as scope, which still expands below via
        // handleFieldFocus.
        if (data.scope && autoOpenPanel(win)) {
          if (focusPanelOn(win)) {
            focusFieldOwner(data.field, data.scope, doc, win);
          } else {
            focusFromPreview(data.scope, doc, win, { clampToSection: true });
          }
        }

        handleFieldFocus(data.field, doc, { scopeUid: data.scope });

        // Solo/accordion re-render can leave the nested set collapsed — re-assert
        // after the expand transition so the edited block's fields stay open.
        if (data.scope) {
          setTimeout(
            () => handleFieldFocus(data.field, doc, { animate: false, scopeUid: data.scope }),
            COLLAPSE_SETTLE_MS
          );
        }
      } else if (autoOpenPanel(win)) {
        // Clicking a section opens the panel showing ONLY that section. Falls
        // back to plain focus (e.g. nested rows without a resolvable set).
        if (!focusFromPreview(data.uid, doc, win)) {
          handleFocus(data.uid, doc, data.afterSetUid, data.uidIndex ?? 0);
        }
      }
    } else if (data.type === MSG.EDIT_REQUEST) {
      handleEditRequest(data, doc, win);
    } else if (data.type === MSG.EDIT_INPUT) {
      handleEditInput(data, doc);
    } else if (data.type === MSG.EDIT_CONTROL) {
      handleEditControl(data);
    } else if (data.type === MSG.THEME_SWATCHES_REQUEST) {
      handleThemeSwatchesRequest(data, win);
    } else if (data.type === MSG.EDIT_END) {
      handleEditEnd(data, win);
    } else if (data.type === MSG.BLOCK_FORMAT) {
      handleBlockFormat(data, doc);
    } else if (data.type === MSG.OUTLINE) {
      handleOutline(data, win);
    } else if (data.type === MSG.OPEN_PANEL_FIELD) {
      // Pencil / "finish in panel": focus the field in the synced-section iframe
      // when that is the active editor — same path as a preview click.
      const iwin = globalSectionEditorWin(win);

      if (iwin && editSession?.container?.name === 'sve-global-section' && editSession.field) {
        setLpCollapsed(win, false);
        iwin.postMessage(
          {
            source: SOURCE,
            type: MSG.SVE_SECTION_FOCUS,
            uid: editSession.scope || null,
            field: editSession.field,
          },
          win.location.origin
        );

        return;
      }

      handleOpenPanelField(data, doc, win);
    } else if (data.type === MSG.BARD_COMMAND) {
      const idoc = globalSectionEditorDoc(doc);

      if (idoc && editSession?.container?.name === 'sve-global-section') {
        handleBardCommand(data, idoc, globalSectionEditorWin(win) || win);
      } else {
        handleBardCommand(data, doc, win);
      }
    } else if (data.type === MSG.ASSET_EDIT) {
      const idoc = globalSectionEditorDoc(doc);

      handleAssetEdit(data, idoc || doc);
    } else if (data.type === MSG.ICON_EDIT) {
      const idoc = globalSectionEditorDoc(doc);

      handleIconEdit(data, idoc || doc, win);
    } else if (data.type === MSG.LINK_EDIT) {
      const idoc = globalSectionEditorDoc(doc);
      const iwin = globalSectionEditorWin(win);

      if (idoc && iwin && editSession?.container?.name === 'sve-global-section') {
        handleLinkEdit(data, idoc, iwin);
      } else {
        handleLinkEdit(data, doc, win);
      }
    } else if (data.type === MSG.MOVE) {
      handleMove(data, doc);
    } else if (data.type === MSG.ADD_SET) {
      handleAddSet(data, doc, win);
    } else if (data.type === MSG.CB_COL_WIDTH) {
      handleColumnWidth(data, doc);
    } else if (data.type === MSG.SVE_GRID_SPAN) {
      handleGridSpan(data, doc, win);
    } else if (data.type === MSG.OPEN_COMPONENT) {
      // The dock is open whenever the preview knows about components at all —
      // the map is only sent while a template is loaded.
      ask('dock:open-template', `view:partials/${data.src}`);
    } else if (data.type === MSG.OPEN_GLOBAL) {
      handleOpenGlobal(data, doc, win);
    } else if (data.type === MSG.OPEN_CHROME) {
      handleOpenChrome(data, doc, win);
    } else if (data.type === MSG.OPEN_CHROME_DESIGNS) {
      setChromeSidebarMode(win, 'design');
    } else if (data.type === MSG.OPEN_CHROME_SETTINGS) {
      setChromeSidebarMode(win, 'settings');
    } else if (data.type === MSG.CLOSE_CHROME) {
      // Stepping out of header/footer (e.g. clicking a page section): free the
      // left edge so the section editor isn't stacked under Theme Settings.
      // The dock follows: a click on a section brings its own load right
      // after this (same type, no second fetch); a click on empty page does not.
      dismissChromeForPageEdit(win, { syncDock: true });
    } else if (data.type === MSG.REQUEST_CLOSE_CHROME) {
      handleRequestCloseChrome(win);
    } else if (data.type === MSG.SVE_CHROME_DIRTY_QUERY) {
      notifyChromeDirty(win);
    } else if (data.type === MSG.SAVE_CHROME) {
      // The bar's Save, driving whichever form is actually holding the edits.
      // Sent straight to the panel iframe, it went to Theme Settings as the
      // background prefetch had loaded it — a form that had never seen the edit
      // — and saved that instead.
      saveGlobalsPanel(win, () => {});
    } else if (data.type === MSG.ADD_ROW) {
      handleAddRow(data, doc, win);
    } else if (data.type === MSG.ADD_BLOCK_NATIVE) {
      // Preview "+": open Statamic's real SetPicker, pin list under the plus.
      handleAddBlockNative(data, doc, win);
    } else if (data.type === MSG.ADD_BARD_SET_NATIVE) {
      handleAddBardSetNative(data, doc, win);
    } else if (data.type === MSG.INSERT_BARD_SET) {
      handleInsertBardSet(data, doc, win);
    } else if (data.type === MSG.REMOVE_ROW) {
      // A section is asked about first. It takes one click to remove and holds
      // everything inside it, and the page it leaves behind looks like a page
      // that was always that way — there is nothing on screen to tell you what
      // is gone. A row is small and sits in view of its siblings, so it goes
      // straight away, as it always has.
      if (data.confirm) {
        confirmCloseDiscard(
          win,
          {
            titleKey: 'remove_section_title',
            bodyKey: 'remove_section_body',
            confirmKey: 'remove_section_confirm',
          },
          () => handleRemoveRow(data, doc, win)
        );
      } else {
        handleRemoveRow(data, doc, win);
      }
    } else if (data.type === MSG.DUPLICATE_ROW) {
      handleDuplicateRow(data, doc, win);
    } else if (data.type === MSG.HIDE_ROW) {
      handleHideRow(data, doc, win);
    } else if (data.type === MSG.ROW_CAPS) {
      handleRowCaps(data, doc, win);
    } else if (data.type === MSG.OPEN_GLOBAL_SECTION) {
      handleOpenGlobalSection(data, win);
    } else if (data.type === MSG.AI_TEXT_HELLO) {
      syncAiTextToPreview(win);
    } else if (data.type === MSG.AI_TEXT_OPEN) {
      handleAiTextOpen(data, doc, win);
    } else if (data.type === MSG.AI_TEXT_GENERATE) {
      handleAiTextGenerate(data, doc, win);
    } else if (data.type === MSG.AI_TEXT_APPLY) {
      handleAiTextApply(data, doc, win);
    } else if (data.type === MSG.AI_TEXT_SET_KEYWORDS) {
      handleAiTextSetKeywords(data, doc, win);
    } else if (data.type === MSG.SVE_PILL_BOX_REQUEST) {
      const pill = doc.getElementById(LP_BACK_ID);

      if (pill) {
        tellPreviewWherePillIs(win, pill);
      }
        } else if (data.type === MSG.CLOSE_GLOBAL_SECTION) {
      closeGlobalSectionPanel(win);
    } else if (data.type === MSG.REQUEST_CLOSE_GLOBAL) {
      handleRequestCloseGlobal(win);
    } else if (data.type === MSG.SVE_GLOBAL_DIRTY_QUERY) {
      notifyGlobalSectionDirty(win);
    } else if (data.type === MSG.SAVE_GLOBAL_SECTION) {
      // The bar's Save, driving the entry form's real one — wherever it lives.
      saveGlobalSectionPanel(win, () => {});
    } else if (data.type === MSG.SECTION_SETTINGS) {
      handleSectionSettings(data, doc, win);
    } else if (data.type === MSG.SAVE_SECTION) {
      handleSaveSection(data, doc, win);
    } else if (data.type === MSG.EXT_DROP) {
      // A section dragged in from the library was released — insert it where the
      // preview's drop line ended up (data.afterUid, null = at the top).
      if (sveState.libraryDrag) {
        insertSection(win, doc, data.afterUid ?? null, sveState.libraryDrag.kind, sveState.libraryDrag.item);
        sveState.libraryDrag = null;
      }
    } else if (data.type === MSG.CB_ADD_COLUMN) {
      handleAddColumn(data, doc, win);
    } else if (data.type === MSG.POPUP) {
      // A column popup is opening (the column-builder addon handles that) —
      // expand and scroll the publish form to the containing section, so the
      // form behind the popup shows where you are when it closes again.
      if (data.sectionUid) {
        handleFocus(data.sectionUid, doc);
      }
    } else if (data.type === MSG.HOVER) {
      if (data.field || ('field' in data && !data.uid)) {
        handleFieldHover(data.field || null, doc, data.scope);
      } else {
        handleHover(data.uid, doc);
      }
    }
  };
}

export const CP_STYLES = `
/* Match sidebar inset (12px) — Statamic ships 1.75rem / 1rem on the header. */
.live-preview-header {
  padding-inline: 12px !important;
}
/* Live Preview top bar — pointer + a visible hover so the icons read as buttons. */
#__sve-toolbar button[data-tab],
#__sve-lp-mode button,
#__sve-preview-chrome button {
  cursor: pointer !important;
}
#__sve-preview-chrome button:disabled {
  cursor: default !important;
}
#__sve-toolbar button[data-tab]:hover:not(:disabled),
#__sve-lp-mode button:hover:not(:disabled),
#__sve-preview-chrome button:hover:not(:disabled) {
  opacity: 1 !important;
}
#__sve-toolbar button[data-tab]:hover:not(:disabled):not([aria-pressed="true"]) {
  background: ${HEADER_ICON_HOVER} !important;
}
#${LP_BACK_ID} {
  background: var(--color-primary, #4f46e5) !important;
  color: rgba(255, 255, 255, .86) !important;
  opacity: 1 !important;
  transition: background-color .12s ease, color .12s ease !important;
}
#${LP_BACK_ID}:hover {
  background: color-mix(in oklch, var(--color-primary, #4f46e5) 100%, white 30%) !important;
  color: #fff !important;
}
#__sve-toolbar button[data-tab="comments"] [data-sc-badge] {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  line-height: 1 !important;
  /* currentColor follows the button (the idle glyph). text-fill is the number
     so we can keep that inherit for the disc. */
  background: currentColor !important;
  color: inherit !important;
  -webkit-text-fill-color: ${COMMENTS_BADGE_IDLE_TYPE} !important;
  box-shadow: 0 0 0 2px var(--sve-toolbar-ring, rgba(128,128,128,.16));
}
#__sve-toolbar button[data-tab="comments"][aria-pressed="true"] [data-sc-badge] {
  background: ${COMMENTS_BADGE_ACTIVE_BG} !important;
  color: ${COMMENTS_BADGE_FG} !important;
  -webkit-text-fill-color: ${COMMENTS_BADGE_FG} !important;
}
#__sve-lp-mode button:hover:not(:disabled):not([aria-pressed="true"]),
#__sve-preview-chrome button:hover:not(:disabled):not([aria-pressed="true"]) {
  background: rgba(128, 128, 128, .22) !important;
}

/* Page Settings / SEO and Block tree / Outline — same text tabs. */
[data-sve-settings-bar] {
  border-bottom: 1px solid rgba(128, 128, 128, .22);
}
[data-sve-settings-tabs],
[data-sve-lv-tabs] {
  display: flex;
  align-items: stretch;
  gap: 16px;
  min-width: 0;
  padding: 0;
}
/* Left bar sits on the editor edge; right pane already has 12px padding-inline. */
[data-sve-settings-tabs] {
  padding: 0 12px;
}
[data-sve-lv-tabs] {
  flex: 1 1 auto;
}
[data-sve-settings-tab],
[data-sve-panel-tab] {
  all: unset;
  cursor: pointer;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  padding: 14px 0 12px;
  font-size: 13px;
  font-weight: 500;
  line-height: 1.2;
  color: currentColor;
  opacity: .58;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  background: transparent;
}
[data-sve-settings-tab]:hover,
[data-sve-panel-tab]:hover {
  opacity: 1;
  background: transparent;
}
[data-sve-settings-tab]:focus-visible,
[data-sve-panel-tab]:focus-visible {
  outline: 2px solid var(--theme-color-primary, #4530D8);
  outline-offset: 2px;
}
[data-sve-settings-tab][aria-pressed="true"],
[data-sve-panel-tab][aria-pressed="true"] {
  opacity: 1;
  border-bottom-color: var(--theme-color-primary, #4530D8);
  background: transparent;
}

/* Tab bar is fixed over the editor; the drag strip spans the full editor height
   (through the tabs) and sits above the bar on the right edge. */
.live-preview-editor {
  --sve-lp-gutter: 12px;
  --sve-lp-resizer: 1rem;
}
.live-preview-editor > .live-preview-resizer {
  position: absolute !important;
  top: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  height: auto !important;
  margin: 0 !important;
  z-index: 62 !important;
}
/* The handle is out of flow and sits on the editor edge, so padding-right on
   the field column must clear the handle *and* leave the same gutter as the
   left. Statamic's own px-4 is 16px on both sides — 4px more than the 12px
   the tabs and header use — so the left reads wider than the right (right is
   gutter + handle). Same 12px on both, plus the handle on the right. */
.live-preview-editor .live-preview-fields {
  box-sizing: border-box;
  min-width: 0;
  padding-left: var(--sve-lp-gutter) !important;
  padding-right: calc(var(--sve-lp-gutter) + var(--sve-lp-resizer)) !important;
}

/* Page Settings / SEO (and any other publish tab) ship as a Statamic Panel +
   Card: rounded box, ring, own padding. A focused section has that chrome
   stripped, so the tab views looked like a form dropped into a different
   app. Flatten the same way — fields sit on the panel background, in the
   same gutter as the section views. The Card selector is the panel's own
   body, not a card nested inside a field. */
.live-preview-editor .live-preview-fields [data-ui-panel],
.live-preview-editor .live-preview-fields .publish-section-collapsible__inner > [data-ui-card] {
  border: 0 !important;
  border-radius: 0 !important;
  background: none !important;
  box-shadow: none !important;
  padding: 0 !important;
  margin: 0 !important;
}
.live-preview-editor .publish-tab-outer {
  padding-inline: 0 !important;
}

/* The page's own fields, while the field column belongs to a global section.
   The solo view hides them too once it has a set to isolate; this covers the
   moment before that, when the synced entry's form is still mounting. */
[data-sve-global-away] {
  display: none !important;
}
/* Focus-panel / block-tree icons. Tab-bar icons live in the tabs addon. */
[data-sve-icon] {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.1em;
  height: 1.1em;
  font-size: 1em;
  line-height: 1;
  opacity: .85;
}
[data-sve-icon] svg {
  display: block;
  width: 100%;
  height: 100%;
}
.sve-off {
  display: none !important;
}
/* The sve-panel frame's scrolling column. Live Preview's field column brings its
   own margin, which is what the focus view strips its cards flat against; this
   frame has none, so the panel was read edge to edge on both sides. */
[data-sve-panel-column] {
  padding-inline: 1rem !important;
}
/* Statamic Live Preview × — always gone; our header close replaces it. */
.live-preview-header button[data-sve-statamic-lp-close],
[data-sve-statamic-lp-close]:not([data-sve-close]):not(#__sve-right-dock *) {
  display: none !important;
  visibility: hidden !important;
  pointer-events: none !important;
  width: 0 !important;
  min-width: 0 !important;
  padding: 0 !important;
  margin: 0 !important;
  overflow: hidden !important;
}
/* --- Focus panel -----------------------------------------------------------
   The panel showing one thing: its name at the top, its fields under it, and
   none of the frame it wears as a row in a list. Everything here is scoped to
   [data-sve-focus-set] or the header — with the feature off not one rule of it
   can match, and the ordinary publish form never carries the attribute at all. */
/* Sticky, because it is the answer to "what am I editing?" and the answer is
   worth having at the bottom of a long section too. The column it sits in scrolls
   and carries its own horizontal padding, so this adds none. */
[data-sve-focus-header] {
  position: sticky;
  top: 0;
  z-index: 3;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  padding: 0.875rem 0 1rem;
  border-bottom: 1px solid rgba(128, 128, 128, .16);
  background: var(--color-white, #fff);
}
.dark [data-sve-focus-header] {
  background: var(--theme-color-gray-850, #1f2937);
}
[data-sve-focus-id] {
  display: flex;
  align-items: center;
  gap: 0.7rem;
}
/* The initial of the name when nothing named an icon — enough to tell one block
   from the next, and the same square either way. */
[data-sve-focus-tile] {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.1rem;
  height: 2.1rem;
  border-radius: 0.6rem;
  background: rgba(128, 128, 128, .16);
  font-size: 0.9rem;
  font-weight: 600;
  line-height: 1;
}
[data-sve-focus-tile] [data-sve-icon] {
  width: 1.15rem;
  height: 1.15rem;
  font-size: 1.15rem;
  opacity: 1;
}
[data-sve-focus-title] {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.25;
}
/* The way back, at the end of the line that names where you are. */
[data-sve-focus-back] {
  all: unset;
  cursor: pointer;
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  gap: 0.55em;
  margin-left: auto;
  padding: 0.55em 0.95em;
  border-radius: 0.55rem;
  background: rgba(128, 128, 128, .16);
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1;
  white-space: nowrap;
  transition: background-color .12s;
}
[data-sve-focus-back]:hover {
  background: rgba(128, 128, 128, .28);
}
[data-sve-focus-back-arrow] {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  line-height: 1;
  font-weight: 600;
  /* Optical align with lowercase text — glyph sits a hair low otherwise. */
  transform: translateY(-1.5px);
}
[data-sve-focus-desc] {
  margin: 0;
  font-size: 0.8125rem;
  line-height: 1.5;
  opacity: .6;
}
/* A row this view leaves out: a section's block list, opened from the page, and
   any segment left with nothing to show once it is gone. */
[data-sve-focus] [data-sve-focus-hide] {
  display: none !important;
}
/* The set IS the panel now. Its header bar names it a second time, its card
   draws a box around a box, and both belong to the list it was lifted out of.
   Under [data-sve-focus], which only the focused Live Preview document ever
   carries: a mark left behind can't reach an ordinary publish form from here. */
[data-sve-focus] [data-sve-focus-set] > header {
  display: none !important;
}
/* The arrow out of a block, in its own header beside the collapse chevron. Quiet
   until the header is under the pointer — the chevron is the common move, and two
   equally loud controls on one row is a decision nobody asked for. */
[data-sve-focus-step] {
  all: unset;
  cursor: pointer;
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.6rem;
  height: 1.6rem;
  margin-left: 0.25rem;
  border-radius: 0.4rem;
  opacity: .45;
  transition: opacity .12s, background-color .12s;
}
header:hover > [data-sve-focus-step] {
  opacity: .9;
}
[data-sve-focus-step]:hover {
  opacity: 1;
  background: rgba(128, 128, 128, .2);
}
/* Every wrapper between the panel and the fields — the tab pane, the page
   builder's list, the section's card and grid, the block's card. Everything they
   draw goes; the boxes themselves stay in the layout, so a wrapper that is a grid
   still lays its fields out in one. Decoration only: nothing here can hide a
   field, whatever the markup between the panel and it turns out to be. */
[data-sve-focus] [data-sve-focus-flat] {
  border: 0 !important;
  border-radius: 0 !important;
  background: none !important;
  box-shadow: none !important;
  padding: 0 !important;
  margin: 0 !important;
}
/* Dividers drawn as a child rather than as a border — a set list separates its
   rows with one, and in a panel showing a single row it is a line under nothing. */
[data-sve-focus] [data-sve-focus-flat] > hr {
  display: none !important;
}
/* The field list itself, out to the same gutter as the header above it. Sides
   only: the padding it was given is the inset of a card, and the card is gone —
   what it puts above and below the fields is spacing, and that stays. */
[data-sve-focus] [data-sve-focus-flush] {
  padding-inline: 0 !important;
}
/* --- Heading outline -------------------------------------------------------
   A row draws its own share of the tree: one rail per level above it, then the
   branch it hangs from. Nothing measures anything, and a list of any depth comes
   out aligned. */
[data-sve-outline-item] {
  all: unset;
  cursor: pointer;
  box-sizing: border-box;
  display: flex;
  align-items: flex-start;
  width: 100%;
  border-radius: 0.375rem;
  font-size: 0.8125rem;
  line-height: 1.45;
}
[data-sve-outline-item]:hover {
  background: rgba(128, 128, 128, .12);
}
[data-sve-outline-item][aria-current="true"] {
  background: rgba(128, 128, 128, .16);
}
/* Stretched to the row's full height, so consecutive rows draw one unbroken line
   down the level they share. Which is also why the rows are not spaced apart: the
   air between entries is padding *inside* them, so the tree stays drawn while the
   list breathes. */
[data-sve-outline-rail] {
  flex: 0 0 1.25rem;
  align-self: stretch;
  border-left: 1px solid rgba(128, 128, 128, .55);
}
[data-sve-outline-branch] {
  flex: 0 0 1rem;
  height: 0;
  /* Half a line below the row's own top padding — level with the text it points
     at, at any zoom. */
  margin-top: 1.1em;
  border-top: 1px solid rgba(128, 128, 128, .55);
}
[data-sve-outline-level] {
  flex: 0 0 auto;
  padding: 0.55em 0 0.55em 0.5em;
  font-weight: 700;
  white-space: nowrap;
}
[data-sve-outline-level]::after {
  content: ":";
  font-weight: 400;
  opacity: .5;
}
[data-sve-outline-text] {
  padding: 0.55em 0.6em 0.55em 0.4em;
  opacity: .75;
  overflow-wrap: anywhere;
}
[data-sve-outline-item]:hover [data-sve-outline-text],
[data-sve-outline-item][aria-current="true"] [data-sve-outline-text] {
  opacity: 1;
}
/* A heading with no words in it yet: still a heading, still in the outline, and
   said so rather than drawn as a gap. */
[data-sve-outline-blank] {
  font-style: italic;
  opacity: .45;
}
/* Two severities, two colours.

   Amber is the default and covers most of it: a level reached without passing
   through the one above, a heading standing before the page's H1. None of that is
   broken — the page renders, it just doesn't read the way its levels claim.

   Red is kept for the one rule that isn't a matter of taste: exactly one H1. No
   H1 and the page never says what it is about; several and they contradict each
   other. Sparing with the red is what lets it mean something — if the skipped
   levels were red too, a page with a few loose headings would look like a fire
   and the real fault would be lost in it. */
[data-sve-outline-note] {
  margin: 0.5rem 0.75rem 0;
  padding: 0.6rem 0.7rem;
  border: 1px solid rgba(217, 119, 6, .35);
  border-radius: 0.5rem;
  background: rgba(217, 119, 6, .1);
  color: #b45309;
  font-size: 0.75rem;
  line-height: 1.45;
}
[data-sve-outline-warn] [data-sve-outline-level],
[data-sve-outline-warn] [data-sve-outline-text],
[data-sve-outline-flag] {
  color: #b45309;
}
.dark [data-sve-outline-note] {
  color: #fcd34d;
}
.dark [data-sve-outline-warn] [data-sve-outline-level],
.dark [data-sve-outline-warn] [data-sve-outline-text],
.dark [data-sve-outline-flag] {
  color: #fbbf24;
}
[data-sve-outline-warn] [data-sve-outline-text] {
  opacity: 1;
}
/* Critical — after the amber rules, so it wins on order rather than on a
   specificity trick that the next edit would have to keep track of. */
[data-sve-outline-note="critical"] {
  border-color: rgba(220, 38, 38, .4);
  background: rgba(220, 38, 38, .1);
  color: #b91c1c;
}
[data-sve-outline-warn="critical"] [data-sve-outline-level],
[data-sve-outline-warn="critical"] [data-sve-outline-text],
[data-sve-outline-warn="critical"] [data-sve-outline-flag] {
  color: #b91c1c;
}
.dark [data-sve-outline-note="critical"] {
  color: #fca5a5;
}
.dark [data-sve-outline-warn="critical"] [data-sve-outline-level],
.dark [data-sve-outline-warn="critical"] [data-sve-outline-text],
.dark [data-sve-outline-warn="critical"] [data-sve-outline-flag] {
  color: #f87171;
}
/* Sized off the row's text, so it sits on the same line whatever the zoom. */
[data-sve-outline-flag] {
  flex: 0 0 auto;
  align-self: center;
  width: 1.15em;
  height: 1.15em;
  margin-right: 0.5em;
  border: 1px solid currentColor;
  border-radius: 50%;
  font-size: 0.7rem;
  font-weight: 700;
  line-height: 1.05em;
  text-align: center;
}
/* Live Preview header: cluster icon, mode group and the "Live Preview" title on
   the left with an even gap; the actions keep the right edge. Statamic lays the
   header out with space-between, which strands the title mid-header. */
.live-preview-header {
  justify-content: flex-start !important;
  align-items: center !important;
  gap: 1.25rem;
  position: relative;
  z-index: 50;
}
.live-preview-header > :last-child {
  margin-left: auto;
}
/* Our devices/zoom cluster sits mid-header; keep Statamic's action group right. */
#__sve-preview-chrome {
  flex: 0 0 auto;
}
/* Preview → panel pointer used to draw a blue outline on the active CP field.
   Editors found it noisy around the sidebar when drilling into a block — drop it.
   Scroll/open-on-click still uses [data-sve-active]; it just isn't drawn. */
[data-sve-active]:not([contenteditable="false"]), [data-sve-active][contenteditable="false"] > * {
  outline: none !important;
}
/* Hovering the page draws nothing over here. The pointer is already on the thing
   it means, and the panel answering every pass of the mouse with a dashed box
   around a whole section is movement without information. [data-sve-hover] is
   still set — the panel scrolls and opens by it — it just isn't drawn. */
/* One ring, never two. A marked row holding a field that has taken focus leaves
   the marking to that field — it is already saying the same thing, in the CP's own
   colour — and a marked element that contains another marked one is the outer of a
   pair, which is the one nobody needed. */
[data-sve-active]:has(:focus),
[data-sve-active]:has([data-sve-active]) {
  outline: none !important;
}
/* Grid rows: draw the outline INSIDE the row so it isn't clipped by the
   surrounding grid table border or overlapped by adjacent rows. */
[data-grid-row][data-sve-active] {
  outline: none !important;
}
.sve-highlight {
  animation: sve-highlight-pulse 0.4s ease-out;
}
@keyframes sve-highlight-pulse {
  0%   { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.5); }
  100% { box-shadow: 0 0 0 8px rgba(59, 130, 246, 0); }
}
.sve-field-highlight {
  animation: sve-field-highlight-pulse 0.5s ease-out;
}
@keyframes sve-field-highlight-pulse {
  0%   { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.6); }
  60%  { box-shadow: 0 0 0 6px rgba(59, 130, 246, 0.2); }
  100% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
}
/* Subtle "pop" for the set preview thumbnail: fade in + slight scale up. */
.sve-thumb-inner {
  animation: sve-thumb-in 0.14s ease-out both;
}
@keyframes sve-thumb-in {
  from { opacity: 0; transform: scale(0.94); }
  to   { opacity: 1; transform: scale(1); }
}
`;

export function sendToPreview(message, win) {
  const iframe = win.document.getElementById('live-preview-iframe');

  if (iframe && iframe.contentWindow) {
    // Use '*' as targetOrigin because the preview iframe may be served from a
    // different origin (e.g. a custom preview domain). Restricting to a specific
    // origin would silently drop messages. This is admin-only functionality so
    // the cross-origin exposure is acceptable.
    iframe.contentWindow.postMessage(message, '*');
  }
}

export function getUidFromSet(setEl) {
  const inputs = setEl.querySelectorAll(SELECTORS.visualIdInput);

  for (const input of inputs) {
    if (input.closest(SELECTORS.anySet) === setEl) {
      return input.value;
    }
  }

  return null;
}

/**
 * When hovering/clicking text inside a Bard contenteditable, returns the
 * nearest preceding [data-node-view-wrapper] sibling — i.e. the last Bard
 * set node before the text. Returns null for text before any set.
 */
export function findPrecedingBardSetNode(el, contentEditable) {
  if (el === contentEditable) {
    return null;
  }

  let node = el;

  while (node.parentElement && node.parentElement !== contentEditable) {
    node = node.parentElement;
  }

  if (node.parentElement !== contentEditable) {
    return null;
  }

  let prev = node.previousElementSibling;

  while (prev) {
    if (prev.hasAttribute('data-node-view-wrapper')) {
      return prev;
    }

    prev = prev.previousElementSibling;
  }

  return null;
}

/**
 * Returns the height of the nearest .bard-fixed-toolbar that sits above
 * targetEl, by walking up from targetEl to the closest .bard-fieldtype and
 * then finding its direct .bard-fixed-toolbar child.
 *
 * Using targetEl (not an outer container) ensures we find the toolbar that
 * actually overlaps the element we're about to scroll into view.
 */
export function getToolbarOffset(targetEl) {
  const bardFieldtype = targetEl.closest('.bard-fieldtype');

  if (!bardFieldtype) {
    return 0;
  }

  const toolbar = bardFieldtype.querySelector('.bard-fixed-toolbar');

  if (!toolbar) {
    return 0;
  }

  const marginBlockEnd = parseFloat(getComputedStyle(toolbar).marginBlockEnd) || 0;

  return toolbar.offsetHeight + marginBlockEnd;
}

/**
 * Scrolls targetEl into view, adding a top margin equal to the nearest Bard
 * fixed toolbar height so the element is not hidden behind the sticky toolbar.
 */
export function scrollToWithBardOffset(targetEl) {
  const offset = getToolbarOffset(targetEl);

  if (offset > 0) {
    const original = targetEl.style.scrollMarginTop;

    targetEl.style.scrollMarginTop = `${offset + 4}px`;
    targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    requestAnimationFrame(() => {
      targetEl.style.scrollMarginTop = original;
    });
  } else {
    targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/**
 * Scrolls the Bard contenteditable inside containerEl to the text that
 * follows the set identified by afterSetUid (or to the top when null).
 */
export function scrollBardToTextAfterSet(afterSetUid, containerEl) {
  const editor = containerEl.querySelector('[contenteditable="true"]');

  if (!editor) {
    return;
  }

  if (afterSetUid === null) {
    scrollToWithBardOffset(editor);

    return;
  }

  const input = editor.querySelector(`[data-visual-id="${afterSetUid}"]`);

  if (!input) {
    return;
  }

  const nodeWrapper = input.closest('[data-node-view-wrapper]');

  if (!nodeWrapper) {
    return;
  }

  scrollToWithBardOffset(nodeWrapper.nextElementSibling ?? nodeWrapper);
}

/**
 * True when the CP is running inside the front end's edit overlay (a full-screen
 * iframe on the site) rather than as a page of its own.
 */
export function isEmbeddedInSite(win) {
  return win.parent !== win.self;
}

/** Tell the hosting site something happened. No-op when we aren't embedded. */
export function postToHost(win, type, data = {}) {
  if (!isEmbeddedInSite(win)) {
    return;
  }

  try {
    win.parent.postMessage(
      { source: SOURCE, type, ...data },
      win.location.origin
    );
  } catch {
    /* the host went away */
  }
}

/**
 * Live Preview has genuinely rendered — not just "the iframe element exists".
 * Revealing on the element alone can crossfade to an empty frame.
 */
export function previewPainted(doc) {
  const frame = doc.getElementById('live-preview-iframe');

  if (!frame) {
    return false;
  }

  try {
    const inner = frame.contentDocument;

    return !!(inner && inner.readyState === 'complete' && inner.body?.childElementCount);
  } catch {
    return false; // never throw out of a poll
  }
}

/**
 * Statamic's own "open Live Preview" button, found in whatever language the CP is
 * speaking — matching the English label alone left every other locale waiting on
 * the failsafe, staring at a blank cover.
 */
export function livePreviewButton(doc) {
  return [...doc.querySelectorAll('button, a')].find((el) => {
    const text = `${el.textContent || ''} ${el.getAttribute('title') || ''}`;

    return /live.?preview|forhåndsvis|vorschau|voorbeeld|aperçu|vista previa/i.test(text);
  });
}

/**
 * Statamic's own Live Preview control opens in-place. That is a second editor.
 * On the top window we take the click and open the overlay instead — the same
 * iframe the front-end button uses. Inside the overlay the click must still
 * reach Statamic, or the preview never paints.
 */
export function interceptLivePreviewOpen(win) {
  win.document.addEventListener(
    'click',
    (event) => {
      if (isEmbeddedInSite(win) || livePreviewEditorEl(win.document)) {
        return;
      }

      const button = livePreviewButton(win.document);

      if (!button || !button.contains(event.target)) {
        return;
      }

      if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      const url = new URL(win.location.href);

      url.searchParams.set('live-preview', '1');
      openOverlay(win, url.toString());
      markLivePreviewOpening(win, button);
    },
    true
  );
}

/**
 * The screen that stands in while Live Preview opens.
 *
 * Flat colour alone reads as "nothing is happening" — which is exactly what the
 * old cover looked like for the second or two it was up. The spinner says the
 * wait is deliberate, and the colour is the page you were just looking at, so it
 * feels like the page staying rather than the CMS loading.
 */
/**
 * The preview exactly as it stands, kept on screen while the next one is fetched.
 *
 * The preview is same-origin, so its document can simply be copied into a second,
 * inert iframe. Not a screenshot — another rendering of the same page — which is
 * why it holds up at whatever size it is dropped into. Scripts are stripped: a
 * still that keeps running is a page, and two live copies of one page is exactly
 * what this exists to avoid.
 *
 * Null when there is nothing to copy — no preview open, or a document the browser
 * won't let us read. The cover then falls back to flat colour, as it always did.
 */
export function buildPreviewStill(win) {
  try {
    const frame = previewFrame(win.document);
    const inner = frame?.contentDocument;
    const root = inner?.documentElement;

    if (!root) {
      return null;
    }

    const rect = frame.getBoundingClientRect();

    if (rect.width < 1 || rect.height < 1) {
      return null;
    }

    const clone = root.cloneNode(true);

    clone.querySelectorAll('script').forEach((script) => script.remove());

    // Relative URLs in the copy resolve against the Control Panel unless the page
    // says otherwise, and every image and stylesheet on the page is relative.
    const head = clone.querySelector('head');

    if (head && !head.querySelector('base')) {
      const base = inner.createElement('base');

      base.setAttribute('href', inner.baseURI);
      head.prepend(base);
    }

    const scrollTop = root.scrollTop || inner.body?.scrollTop || 0;
    const still = win.document.createElement('iframe');

    still.setAttribute('aria-hidden', 'true');
    still.setAttribute('tabindex', '-1');
    // Pixels here are a measurement, not a choice: the still stands exactly where
    // the preview it copies stood.
    still.style.cssText =
      `position:absolute;left:${Math.round(rect.left)}px;top:${Math.round(rect.top)}px;` +
      `width:${Math.round(rect.width)}px;height:${Math.round(rect.height)}px;border:0;`;
    still.addEventListener('load', () => {
      try {
        still.contentWindow.scrollTo(0, scrollTop);
      } catch {
        /* close enough without it */
      }
    });
    still.srcdoc = `<!doctype html>${clone.outerHTML}`;

    return still;
  } catch {
    return null; // never let a nicety stop the move
  }
}

export function buildLpCover(doc, background, { blocking = false, still = null, label = null } = {}) {
  const cover = doc.createElement('div');

  cover.id = LP_COVER_ID;
  cover.style.cssText =
    'position:fixed;inset:0;z-index:2147483647;opacity:1;' +
    // On a page load there's nothing behind this worth hitting, so clicks pass
    // through. On a move that stays in the document the old page's controls are
    // still under here, live and invisible — poking those is worse than being
    // unable to poke anything.
    `pointer-events:${blocking ? 'auto' : 'none'};` +
    'display:flex;align-items:center;justify-content:center;' +
    // Mid grey rather than currentColor: the cover wears the page's colour, which
    // could be anything — grey is the one ink that reads on both a white page and
    // a near-black one.
    `background:${background};color:#9ca3af;transition:opacity .45s ease;`;

  const style = doc.createElement('style');

  style.textContent = '@keyframes sve-lp-spin{to{transform:rotate(360deg)}}';
  cover.appendChild(style);

  // The page you were looking at, still there. Added first so the rest sits on it.
  if (still) {
    cover.appendChild(still);

    // Dimmed, over exactly the area the preview occupied. It says the page is on
    // its way out without taking it off the screen — and it is what stops the
    // spinner from looking like part of whatever it happens to be sitting over.
    const scrim = doc.createElement('div');

    scrim.style.cssText =
      `position:absolute;left:${still.style.left};top:${still.style.top};` +
      `width:${still.style.width};height:${still.style.height};background:rgba(0,0,0,.5);`;

    cover.appendChild(scrim);
  }

  // Without a still there is nothing to stand on and the spinner is the whole
  // message, so it stays bare and centred. With one, the page is the picture and
  // the spinner is a note laid on top of it — a card, or it reads as part of the
  // page it is sitting on.
  const card = doc.createElement('div');

  card.style.cssText = still
    ? 'position:relative;display:flex;align-items:center;gap:.5em;padding:.6875em 1em;' +
      'border-radius:.625em;background:rgba(24,24,27,.92);color:#fff;' +
      'font:500 .8125rem/1 ui-sans-serif,system-ui,sans-serif;' +
      'box-shadow:0 .75em 2em rgba(0,0,0,.35);'
    : 'position:relative;display:flex;align-items:center;justify-content:center;line-height:1;';

  card.innerHTML =
    '<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" ' +
    `stroke-linecap="round" style="${still ? '' : 'font-size:1.5rem;'}display:block;opacity:.85;` +
    'animation:sve-lp-spin 1s linear infinite;">' +
    '<path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>';

  if (still && label) {
    const text = doc.createElement('span');

    text.textContent = label;
    card.appendChild(text);
  }

  cover.appendChild(card);

  return cover;
}


/**
 * Covers the screen *before* leaving, in the colour of the preview you're looking
 * at, and hands that colour to the next page so its own cover matches. Without
 * this the CP is bare for the moment between the click and the next page booting
 * — which is the whole reason switching pages felt like a trip through the
 * dashboard rather than a step sideways.
 */
export function previewBackground(win) {
  let background = '#fff';

  try {
    const frame = previewFrame(win.document);
    const body = frame?.contentDocument?.body;
    const colour = body ? win.getComputedStyle(body).backgroundColor : null;

    // A transparent body tells us nothing — better a plain white than a flash of
    // the CP showing through.
    if (colour && !/rgba\(0,\s*0,\s*0,\s*0\)|transparent/.test(colour)) {
      background = colour;
    }
  } catch {
    /* cross-origin preview — white it is */
  }

  try {
    // Handed to the next page so its own cover starts in the same colour.
    win.localStorage.setItem('sve-lp-bg', background);
  } catch {
    /* private mode */
  }

  return background;
}

/**
 * The colour of the Control Panel screen being left, for the same reason the
 * preview's is taken above: a cover in the wrong colour is a flash, and coming
 * from a listing there is no preview to take a colour from. Stashed under the
 * same key, so a page that boots fresh finds it waiting.
 */
export function cpBackground(win) {
  let background = '#fff';

  try {
    const colour = win.getComputedStyle(win.document.body).backgroundColor;

    if (colour && !/rgba\(0,\s*0,\s*0,\s*0\)|transparent/.test(colour)) {
      background = colour;
    }

    win.localStorage.setItem('sve-lp-bg', background);
  } catch {
    /* private mode */
  }

  return background;
}

/**
 * Puts the cover up, and calls `then` once it is actually on screen.
 *
 * The move waits for that call. A copy of the page needs a moment to parse and
 * paint, and putting the cover up before it has is the flicker: for a frame or
 * two there is flat colour where the page was. So the cover goes up invisible —
 * in the document, because that is the only way the copy loads at all — and is
 * only shown once the copy is painted. Nothing moves on screen during the wait:
 * the real page is still there, live, underneath.
 */
export function coverForNavigation(win, { blocking = false, background = null, then = null } = {}) {
  const doc = win.document;

  // Copied before anything else: the moment the router starts a visit, the page
  // this is a copy of is on its way out.
  const still = buildPreviewStill(win);

  // With a still, the only thing left showing is the frame around the preview —
  // header and editor panel — so the cover wears the Control Panel's colour and
  // the whole thing reads as the chrome staying put. Without one it stands in for
  // the page itself, and the page's own colour is the closest thing to not moving.
  const colour = background ?? (still ? cpBackground(win) : previewBackground(win));
  const cover = buildLpCover(doc, colour, { blocking, still, label: t(win, 'loading') });

  doc.getElementById(LP_COVER_ID)?.remove();

  cover.style.transition = 'none';
  cover.style.opacity = still ? '0' : '1';
  (doc.body ?? doc.documentElement).appendChild(cover);

  let shown = false;

  const show = () => {
    if (shown) {
      return;
    }

    shown = true;

    if (cover.isConnected) {
      cover.style.opacity = '1';

      // Put back for the way out: the reveal fades this cover away, and it needs
      // something to fade with. A frame later, so it can't catch the line above.
      win.requestAnimationFrame(() => {
        cover.style.transition = 'opacity .45s ease';
      });
    }

    then?.();
  };

  if (still) {
    /**
     * Is there a page in the copy yet?
     *
     * Watched rather than waited for. An iframe's `load` is the wrong signal
     * twice over: it fires once for the empty document the frame starts life
     * with — before the copy has been parsed at all — and then not again until
     * every image on the page has arrived, which on a page of photographs is far
     * later than the moment it is worth looking at. Laid out is what matters
     * here; the images are already in the browser's cache from the preview this
     * is a copy of, and arrive a frame or two behind.
     */
    const painted = () => {
      try {
        const inner = still.contentDocument;

        return (
          !!inner &&
          inner.readyState !== 'loading' &&
          (inner.body?.children.length ?? 0) > 0 &&
          (inner.body?.scrollHeight ?? 0) > 0
        );
      } catch {
        return false;
      }
    };

    // Two frames after it lays out: the first is the layout, the second the paint.
    // Shown on the first, the page is measured but not yet drawn — which is the
    // flicker in its smallest form.
    const poll = (frames = 0) => {
      if (painted()) {
        win.requestAnimationFrame(() => win.requestAnimationFrame(show));

        return;
      }

      if (frames < 90) {
        win.requestAnimationFrame(() => poll(frames + 1));
      }
    };

    poll();

    // A copy that never lays out must not hold the move up, and neither must a
    // tab the browser has stopped animating. The flat colour it falls back to is
    // the old behaviour, which was at least never stuck.
    win.setTimeout(show, 1500);
  } else {
    show();
  }

  if (!blocking) {
    return; // a page load is about to take this whole document with it anyway
  }

  // A cover that swallows clicks must never depend on a later step running to
  // come down. If the move is cancelled, the visit fails, or the preview never
  // opens, this is what still lifts it — long enough after the ordinary reveal
  // (and its own 12s failsafe) to never race them.
  win.setTimeout(() => {
    if (doc.getElementById(LP_COVER_ID) === cover) {
      cover.remove();
    }
  }, 15000);
}

export function autoOpenLivePreview(win) {
  const params = new URLSearchParams(win.location.search);

  if (params.get('live-preview') !== '1') {
    return;
  }

  // Inside the overlay iframe this is the one remaining job: click Statamic's
  // own Live Preview control so the preview paints, then tell the host.
  if (isEmbeddedInSite(win)) {
    claimOrigin(win);
    openLivePreviewCovered(win);

    return;
  }

  // Landed on this URL as a full page (bookmark, failsafe). Same overlay as
  // every other way in — the document underneath is the host, not the editor.
  const url = win.location.href;
  const clean = new URL(win.location.href);

  clean.searchParams.delete('live-preview');
  win.history.replaceState({}, '', clean);
  openOverlay(win, url);
}

/**
 * Opens Live Preview behind a cover, and reveals once it has painted.
 *
 * Split out from the page-load path so an in-app navigation can reuse it: the
 * entry picker swaps pages without a reload, so there's no boot to hook into,
 * but the same "hide the CP, open the preview, fade in" is exactly what's wanted.
 */
export function openLivePreviewCovered(win, { closePanels = false } = {}) {
  const doc = win.document;
  const embedded = isEmbeddedInSite(win);

  let cover = null;

  // An in-app move has already put a cover up — one holding a still of the page it
  // left. Looked for whether or not we're embedded: when the editor is running in
  // the site's overlay, this is the only code that ever takes that cover down, and
  // it blocks clicks while it's up. Missing it here strands the whole editor
  // behind a photograph.
  cover = doc.getElementById(LP_COVER_ID);

  if (!cover && !embedded) {
    // The front-end button stashes the colour it was sitting on. (It uses
    // localStorage rather than a query param so the link's URL stays identical
    // and the browser's prerender of this page can actually be reused.)
    let background = '#fff';

    try {
      background = win.localStorage.getItem('sve-lp-bg') || background;
    } catch {
      /* private mode */
    }

    cover = buildLpCover(doc, background);
    (doc.body ?? doc.documentElement).appendChild(cover);
  }

  const stripParams = () => {
    const url = new URL(win.location.href);

    url.searchParams.delete('live-preview');
    win.history.replaceState({}, '', url);
  };

  const reveal = () => {
    stripParams(); // Statamic rewrites the URL as it opens — clean it once more.
    hideNavSpinner(win);

    if (embedded) {
      // Chrome must already be in place when the overlay fades in — otherwise
      // the right sidebar / bottom dock jumps in a beat later.
      sveState.dockRestorePaused = false;
      sveState.dockedHeaderRestored = false;

      try {
        restoreDockedHeaderPanels(win);
        pinDockedPanelsUnderHeader(win);
      } catch (err) {
        console.error('[sve] restoreDockedHeaderPanels', err);
      }

      postToHost(win, 'lp-ready');
    }

    markLivePreviewReady(win);
    scheduleHtmlTreePrefetch(win);

    if (!cover) {
      return;
    }

    cover.style.opacity = '0';
    setTimeout(() => cover.remove(), 500);
  };

  if (closePanels) {
    // Arriving on another page means arriving at the page, not at a form. Every
    // panel standing open belongs to the entry you just left — the fields in the
    // editor pane, the globals or section panel on the right — so they all go,
    // whatever the remembered mode says. The mode itself is left alone: it's a
    // preference about this page, not a verdict on the next one.
    closeRightPanels(win);
    setLpCollapsed(win, true);
  } else {
    // Live Preview opens with the editor panel following the remembered mode —
    // hide/auto arrive closed (looking like the site, not a CMS); an explicitly
    // chosen `show` is respected.
    setLpCollapsed(win, lpMode(win) !== 'show');
  }

  // Never leave anyone stranded behind an opaque cover (or an overlay that never
  // appears).
  const failsafe = setTimeout(reveal, 12000);

  let attempts = 0;
  let clicked = false;

  const open = () => {
    if (previewPainted(doc)) {
      clearTimeout(failsafe);
      // One paint tick, so the preview is on screen before anyone fades to it.
      setTimeout(reveal, 150);

      return;
    }

    if (!clicked) {
      const button = livePreviewButton(doc);

      if (button) {
        button.click();
        clicked = true;
        stripParams();
      }
    }

    if (++attempts < 150) {
      setTimeout(open, 100);
    } else {
      clearTimeout(failsafe);
      reveal();
    }
  };

  open();
}
