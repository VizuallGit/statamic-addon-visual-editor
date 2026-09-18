/**
 * cp.js — region "boot", split out in WP5. Same statements, same order;
 * only the imports are new. See the barrel cp.js for what the shell exports.
 */
import { sveState } from '../cp-state.js';
import { ACTIVE_ATTR, SELECTORS } from '../cp-selectors.js';
import { stampGridRows } from '../cp-section-groups.js';
import { relayoutCodeDock } from '../code-dock-lazy.js';
import { relayoutAiPanel } from '../ai-panel-lazy.js';
import { relayoutRightDock } from '../right-dock.js';
import { bindChromePrefsFlush, chromeGet, hydrateChromePrefs } from '../chrome-prefs.js';
import { ensurePanel, markLivePreviewReady, refreshRightDockHooks } from '../lazy-panels.js';
import { watchPreviewRenders } from '../lp-replay.js';
import { injectStyle } from '../lib/style.js';
import { registerContainerEvents } from '../lib/publish-containers.js';
import { persistDockedPanel } from '../lp-panel.js';
import { ensureLpPanelToggle, markStepIntoAll } from '../focus-panel.js';
import { openSectionPicker, syncPreviewInset } from '../section-library.js';
import { ensurePreviewOutsideDismiss, initGlobalsPanelFrame } from '../globals-panel.js';
import { listenForGlobalsValues, listenForSectionValues } from '../chrome.js';
import { initOpenInPreview, watchEntrySaves } from '../open-in-preview.js';
import { CP_STYLES, armSetPickerSearchSilence, autoOpenLivePreview, createMessageListener, findPrecedingBardSetNode, getUidFromSet, interceptLivePreviewOpen, isEmbeddedInSite, previewPainted, sendToPreview } from './add-section.js';
import { applyHeaderTab, scheduleHtmlTreePrefetch } from './header-toolbar.js';
import { handleFieldFocus, isSetCollapsed } from './sets.js';
import { MSG, SOURCE } from '../lib/protocol.js';

// ===== boot =====
// --- Asset browser: hard-enforce the field's file limit --------------------------
//
// A field with max_files: 1 can still end up holding several assets: the browser
// only clamps the selection on its own checkbox path, so the other ways a row can
// become selected (clicking the filename, which opens the asset editor) slip past
// it. Rather than guess at Statamic's internals, enforce the limit the browser
// itself advertises: its footer reads "N/M selected". Whenever N exceeds M, the
// extra rows are deselected — keeping the row that was clicked last, which is the
// one the user meant.

export const ASSET_COUNT_RE = /^(\d+)\s*\/\s*(\d+)\s+selected$/i;

/** The browser's "N/M selected" footer, if it's on screen. */
export function assetCounter(doc) {
  for (const el of doc.querySelectorAll('span, div, p, td')) {
    if (el.childElementCount !== 0) {
      continue;
    }

    const match = ASSET_COUNT_RE.exec((el.textContent || '').trim());

    if (match) {
      return { selected: Number(match[1]), max: Number(match[2]) };
    }
  }

  return null;
}

export function checkedAssetToggles(doc) {
  return [...doc.querySelectorAll('[role="checkbox"], input[type="checkbox"]')].filter(
    (el) =>
      el.checked === true ||
      el.getAttribute('aria-checked') === 'true' ||
      el.dataset?.state === 'checked'
  );
}

// The row the user touched most recently — the selection we keep when trimming.
export let lastAssetRow = null;

export function enforceAssetLimit(doc) {
  const counter = assetCounter(doc);

  if (!counter || !counter.max || counter.selected <= counter.max) {
    return;
  }

  const toggles = checkedAssetToggles(doc);

  if (toggles.length <= counter.max) {
    return; // can't see the selection — leave it alone rather than guess
  }

  const keep = new Set();
  const clicked = lastAssetRow ? toggles.find((el) => lastAssetRow.contains(el)) : null;

  if (clicked) {
    keep.add(clicked);
  }

  // Fill the remaining slots from the bottom: newest selections win.
  for (const toggle of [...toggles].reverse()) {
    if (keep.size >= counter.max) {
      break;
    }

    keep.add(toggle);
  }

  toggles.filter((toggle) => !keep.has(toggle)).forEach((toggle) => toggle.click());
}

export function guardAssetLimit(win) {
  const doc = win.document;

  const check = () => {
    setTimeout(() => enforceAssetLimit(doc), 60);
    setTimeout(() => enforceAssetLimit(doc), 450);
  };

  doc.addEventListener(
    'click',
    (event) => {
      lastAssetRow = event.target.closest?.('tr, li, [data-asset-id]') ?? null;
      check();
    },
    true
  );

  // Closing the asset editor with the keyboard is not a click.
  doc.addEventListener('keyup', (event) => {
    if (event.key === 'Escape' || event.key === 'Enter') {
      check();
    }
  }, true);
}

/**
 * The two conditions the "where is this edited?" setting turns into.
 *
 * Registered by the editor rather than left to each site: the setting is offered
 * on every field's settings screen, and a field naming a condition nobody
 * registered is hidden everywhere instead of somewhere — the one failure worse
 * than the setting not working at all. A site that already registers these of its
 * own accord simply registers them twice, to the same effect.
 *
 * A ref, not a DOM lookup per call: conditions are evaluated inside a Vue
 * computed, so a ref is what makes them reactive. Without it a field would only
 * change places the next time some other value happened to change.
 */
export function registerPanelConditions(win) {
  const conditions = win.Statamic?.$conditions;
  const ref = win.Vue?.ref;

  if (!conditions || !ref || !win.document.body) {
    return;
  }

  const inLivePreview = ref(false);
  const sync = () => {
    inLivePreview.value = !!win.document.querySelector('.live-preview-editor');
  };

  sync();
  new win.MutationObserver(sync).observe(win.document.body, { childList: true, subtree: true });

  conditions.add('notInLivePreview', () => !inLivePreview.value);
  conditions.add('onlyInLivePreview', () => inLivePreview.value);
}

/**
 * Statamic's leave confirm (`dirty_navigation_warning`) lives on this window —
 * the publish form — not on the overlay host. Same-origin preview shares
 * session history; a click that pops iframe history fires confirm here, and
 * Cancel aborts the plus. Swallow that noise while Live Preview / the overlay
 * iframe is open. Real leave still goes through Inertia and onbeforeunload.
 */
function guardEditorDirtyPopstate(win) {
  if (win.__sveEditorPopstateGuard) {
    return;
  }

  win.__sveEditorPopstateGuard = true;

  win.addEventListener(
    'popstate',
    (event) => {
      const editing =
        !!win.document.querySelector('.live-preview-editor') || win.parent !== win;

      if (!editing) {
        return;
      }

      event.stopImmediatePropagation();

      try {
        win.history.replaceState(win.history.state, '', win.location.href);
      } catch {
        /* ignore */
      }
    },
    true
  );
}

export function initCp(win = window) {
  // Before anything else, and before the switch below: a field asking for a
  // condition that isn't there is hidden in both editors, so these are registered
  // even on a site where the editor itself is switched off.
  registerPanelConditions(win);

  // Boot marker — proves this build is loaded (DevTools: window.__SVE_BUILD__).
  win.__SVE_BUILD__ = 'plus-picker-stay-2026-08-25';
  guardEditorDirtyPopstate(win);

  if (win.__SVE_SCROLL_TEST) {
    win.__sveOpenPatterns = (options) => {
      void ensurePanel('sections').then(() => openSectionPicker(win, options || {}));
    };
  }

  armSetPickerSearchSilence(win);

  try {
    win.document.getElementById('sve-lp-cover')?.remove();
  } catch {
    /* ignore */
  }

  // Switched off for this site: leave Statamic's own Live Preview exactly as it
  // ships. The bridge is already withheld server-side, and without this the CP
  // would still build the toolbar and open panels onto a preview that can no
  // longer be clicked — worse than either state on its own.
  if (win.Statamic?.$config?.get?.('sveEnabled') === false) {
    return;
  }

  // Overlay iframe (?live-preview=1): hold remembered chrome until the
  // preview has painted, then restore it *before* `lp-ready` so the fade-in
  // already has the sidebar / dock. Remounting during boot still drops ready.
  try {
    if (
      isEmbeddedInSite(win) &&
      new URLSearchParams(win.location.search).get('live-preview') === '1'
    ) {
      sveState.dockRestorePaused = true;
    }
  } catch {
    /* ignore */
  }

  try {
    hydrateChromePrefs(win);
    bindChromePrefsFlush(win);

    const lvTab = chromeGet(win, 'sve-listview-tab');

    if (lvTab === 'outline' || lvTab === 'tree') {
      sveState.listViewTab = lvTab;
    }
  } catch (err) {
    console.error('[sve] chrome prefs', err);
  }

  refreshRightDockHooks();

  injectStyle(win.document, '__sve-cp-styles', CP_STYLES);

  win.addEventListener('resize', () => {
    relayoutCodeDock(win);
    relayoutAiPanel(win);
    relayoutRightDock(win);
    syncPreviewInset(win);
  });
  win.addEventListener('sve-right-dock-change', () => {
    persistDockedPanel(win);
    syncPreviewInset(win);
    applyHeaderTab(win);
  });
  win.addEventListener('sve-ai-closed', () => {
    syncPreviewInset(win);
    applyHeaderTab(win);
  });

  autoOpenLivePreview(win);
  interceptLivePreviewOpen(win);
  initOpenInPreview(win);
  watchEntrySaves(win);
  watchPreviewRenders(win);
  guardAssetLimit(win);
  listenForGlobalsValues(win);
  listenForSectionValues(win);

  // Capture publish containers BEFORE the sve-panel frame boots. The panel's
  // bootSavedSectionSolo / value poll need activeContainers(); if we register
  // listeners after the panel starts, the container-created event is missed and
  // the sidebar stays on empty entry meta (Published + title) forever.
  registerContainerEvents(win);

  // Running as the globals panel inside Live Preview: strip to the form and
  // stream its values up. None of the Live Preview machinery below applies.
  // The same frame serves a global section's editor — see initGlobalsPanelFrame.
  initGlobalsPanelFrame(win);

  // Stamp Grid rows immediately and re-stamp whenever the DOM changes
  // (Vue renders Grid rows asynchronously after page load / field expansion).
  // The same observer injects the Live Preview panel toggle when that screen
  // mounts (it lives in a portal that appears/disappears dynamically).
  //
  // CRITICAL: never run a DOM rewrite synchronously inside the observer, and
  // ignore mutations we (or Vue's immediate follow-up patch) produce — otherwise
  // insert → observer → insert becomes an infinite loop that freezes the CP.
  let sveDomScheduled = false;
  let sveDomQuietUntil = 0;

  const runSveDomPass = () => {
    sveDomScheduled = false;
    sveDomQuietUntil = Date.now() + 800;

    try {
      stampGridRows(win.document);
      ensureLpPanelToggle(win);
      // Live Preview mounts (and remounts) its iframe from here — bind the
      // click-outside forward to whichever one is on screen now.
      ensurePreviewOutsideDismiss(win);
      markStepIntoAll(win);

      if (previewPainted(win.document)) {
        markLivePreviewReady(win);
        scheduleHtmlTreePrefetch(win);
      }
    } catch (err) {
      console.error('[sve] dom pass', err);
    }

    // Extend the quiet window after our own writes so Vue's reactive patch that
    // often follows does not immediately re-enter the loop.
    sveDomQuietUntil = Date.now() + 800;
  };

  const scheduleSveDomPass = () => {
    if (Date.now() < sveDomQuietUntil) {
      return;
    }

    if (sveDomScheduled) {
      return;
    }

    sveDomScheduled = true;
    win.requestAnimationFrame(runSveDomPass);
  };

  let sveDomSettleTimer = null;

  const scheduleSveDomSettlePass = () => {
    if (sveDomSettleTimer) {
      win.clearTimeout(sveDomSettleTimer);
    }

    sveDomSettleTimer = win.setTimeout(
      () => {
        sveDomSettleTimer = null;
        scheduleSveDomPass();
      },
      Math.max(400, sveDomQuietUntil - Date.now() + 16)
    );
  };

  const onSveDomMutation = () => {
    scheduleSveDomPass();
    scheduleSveDomSettlePass();
  };

  onSveDomMutation();
  const gridObserver = new win.MutationObserver(onSveDomMutation);
  gridObserver.observe(win.document.body, { childList: true, subtree: true });

  const listener = createMessageListener(win.document, win);

  win.addEventListener('message', listener);

  // CP → iframe: hovering a set highlights the corresponding element in the preview.
  let lastCpHoverUid = null;

  const handleMouseover = (event) => {
    const set = event.target.closest(SELECTORS.anySet);

    if (!set) {
      // Check if hovering over a field wrapper (id="field_{handle}").
      // Walk up the DOM from the event target looking for a matching element.
      let fieldWrapper = null;
      let el = event.target;

      while (el && el !== win.document.body) {
        if (el.id && /^field_/.test(el.id)) {
          fieldWrapper = el;
          break;
        }

        el = el.parentElement;
      }

      // Always clear CP-side hover outlines. They may have been set by an
      // incoming preview-originated hover message, which is independent of
      // lastCpHoverUid and would otherwise linger permanently if the mouse
      // moves from the preview into a non-set area of the CP.
      win.document.querySelectorAll('[data-sve-hover]').forEach((el) => el.removeAttribute('data-sve-hover'));

      if (fieldWrapper) {
        const fieldKey = fieldWrapper.id.slice('field_'.length);

        if (fieldKey === lastCpHoverUid) {
          return;
        }

        lastCpHoverUid = fieldKey;

        // Don't apply hover to a field that is already focused/active — mirrors
        // the guard on the set branch below.
        if (!fieldWrapper.hasAttribute(ACTIVE_ATTR)) {
          fieldWrapper.setAttribute('data-sve-hover', '');

          const ownerSet = fieldWrapper.closest(SELECTORS.anySet);
          const scope = ownerSet ? getUidFromSet(ownerSet) : undefined;

          sendToPreview({ source: SOURCE, type: MSG.HOVER, field: fieldKey, scope: scope || undefined }, win);
        }

        return;
      }

      if (lastCpHoverUid !== null) {
        lastCpHoverUid = null;
        sendToPreview({ source: SOURCE, type: MSG.HOVER, uid: null }, win);
      }

      return;
    }

    const uid = getUidFromSet(set);

    if (!uid) {
      return;
    }

    // Don't send hover for the element that is currently focused/active in the CP.
    if (set.hasAttribute(ACTIVE_ATTR)) {
      return;
    }

    // When hovering plain text inside a Bard contenteditable, determine which
    // text group it belongs to via the preceding set node.
    const contentEditable = event.target.closest('[contenteditable="true"]');

    if (contentEditable && !event.target.closest('[data-node-view-wrapper]')) {
      const prevBardSet = findPrecedingBardSetNode(event.target, contentEditable);
      const afterSetUid =
        prevBardSet?.querySelector('[data-visual-id]')?.getAttribute('data-visual-id') ?? null;
      const hoverKey = `${uid}::${afterSetUid}`;

      if (hoverKey === lastCpHoverUid) {
        return;
      }

      lastCpHoverUid = hoverKey;
      sendToPreview({ source: SOURCE, type: MSG.HOVER, uid, afterSetUid }, win);

      return;
    }

    if (uid === lastCpHoverUid) {
      return;
    }

    lastCpHoverUid = uid;
    sendToPreview({ source: SOURCE, type: MSG.HOVER, uid }, win);
  };

  // CP → iframe: clicking anywhere inside a set focuses the corresponding element in the preview.
  // Uses closest() to get the innermost set, so nested replicators resolve correctly.
  const handleClick = (event) => {
    const set = event.target.closest(SELECTORS.anySet);

    if (!set) {
      // Check if the click landed inside a field wrapper (id="field_{handle}").
      // If so, send a focus message to the preview so the corresponding
      // [data-sid-field] element gets highlighted — mirrors the mouseover logic.
      let el = event.target;

      while (el && el !== win.document.body) {
        if (el.id && /^field_/.test(el.id)) {
          const fieldKey = el.id.slice('field_'.length);

          // Scope = the _visual_id of the surrounding set, so the preview can
          // disambiguate a bare data-sid-field handle that repeats across sections.
          const ownerSet = el.closest(SELECTORS.anySet);
          const scope = ownerSet ? getUidFromSet(ownerSet) : undefined;

          // Mark the field as active in the CP (clears any hover, sets solid
          // outline) and notify the preview to highlight the matching element.
          // No pulse here — the pulse is a cross-boundary signal, not a local one.
          handleFieldFocus(fieldKey, win.document, { animate: false });
          sendToPreview({ source: SOURCE, type: MSG.FOCUS, field: fieldKey, scope: scope || undefined }, win);

          return;
        }

        el = el.parentElement;
      }

      // Clicked on a generic CP area — dismiss any stale SVE active state.
      win.document.querySelectorAll(`[${ACTIVE_ATTR}]`).forEach((active) => active.removeAttribute(ACTIVE_ATTR));

      return;
    }

    const uid = getUidFromSet(set);

    if (!uid) {
      return;
    }

    const message = { source: SOURCE, type: MSG.FOCUS, uid };

    // When clicking plain text inside a Bard contenteditable, include afterSetUid
    // so the preview can highlight the correct text group.
    const contentEditable = event.target.closest('[contenteditable="true"]');

    if (contentEditable && !event.target.closest('[data-node-view-wrapper]')) {
      const prevBardSet = findPrecedingBardSetNode(event.target, contentEditable);

      message.afterSetUid =
        prevBardSet?.querySelector('[data-visual-id]')?.getAttribute('data-visual-id') ?? null;
    }

    // Sync the CP active state immediately so the clicked set is outlined
    // without waiting for a round-trip message from the preview to trigger handleFocus.
    win.document.querySelectorAll(`[${ACTIVE_ATTR}]`).forEach((active) => active.removeAttribute(ACTIVE_ATTR));
    set.setAttribute(ACTIVE_ATTR, '');

    sendToPreview(message, win);
  };

  // --- Set preview thumbnail on hover (CP-only) ---------------------------
  // When hovering a collapsed Replicator set row that has a `image` configured
  // in its blueprint set definition, show that image as a floating thumbnail
  // above the row — a visual hint of how the section looks.
  //
  // The image URL is read from the set row's Vue component (props.config.image),
  // which is the exact same value Statamic's SetPicker renders as <img :src>.
  //
  // Per the CP portal rule: the popup MUST be appended to document.body, because
  // Replicator/page_sections rows create stacking contexts that trap a
  // position:fixed child. We also reposition on scroll (capture phase) and tear
  // everything down on cleanup.
  let thumbPortal = null;
  let thumbForSet = null;

  // Set preview images are resolved server-side (Vue component instances are not
  // reachable from the DOM in a production build) and provided to the CP script
  // as a { setHandle => thumbnailUrl } map via Statamic::provideToScript. The set
  // row exposes its handle through the [data-type] attribute.
  const getSetImageUrl = (setEl) => {
    const handle = setEl.getAttribute('data-type');

    if (!handle) {
      return null;
    }

    const map = win.Statamic?.$config?.get?.('svePreviewImages') || {};

    return map[handle] || null;
  };

  const positionThumb = () => {
    if (!thumbPortal || !thumbForSet) {
      return;
    }

    const anchor = thumbForSet.querySelector(':scope > header') || thumbForSet;
    const rect = anchor.getBoundingClientRect();
    const gap = 8;
    const inner = thumbPortal.firstElementChild;

    thumbPortal.style.left = `${rect.left}px`;

    // Prefer placing the thumbnail above the row; flip below if there isn't room.
    // The outer element handles positioning (translateY); the inner element owns
    // the pop-in scale animation, so its transform-origin points at the row edge
    // the thumbnail emerges from.
    const estHeight = thumbPortal.offsetHeight || 160;

    if (rect.top - gap - estHeight < 0) {
      thumbPortal.style.top = `${rect.bottom + gap}px`;
      thumbPortal.style.transform = 'none';

      if (inner) {
        inner.style.transformOrigin = 'top left';
      }
    } else {
      thumbPortal.style.top = `${rect.top - gap}px`;
      thumbPortal.style.transform = 'translateY(-100%)';

      if (inner) {
        inner.style.transformOrigin = 'bottom left';
      }
    }
  };

  const removeThumb = () => {
    if (thumbPortal) {
      thumbPortal.remove();
      thumbPortal = null;
    }

    thumbForSet = null;
    win.removeEventListener('scroll', positionThumb, true);
  };

  const showThumb = (setEl, url) => {
    removeThumb();
    thumbForSet = setEl;

    // Outer element: positioning only (fixed + flip translate). pointer-events
    // off so it never intercepts the hover that drives it.
    const outer = win.document.createElement('div');

    outer.style.cssText = 'position:fixed;z-index:99999;pointer-events:none;';

    // Inner element: the visible card. Gray background that adapts to the CP's
    // light/dark theme. Carries the pop-in animation (.sve-thumb-inner).
    const isDark = win.document.documentElement.classList.contains('dark');

    const inner = win.document.createElement('div');

    inner.className = 'sve-thumb-inner';
    inner.style.cssText =
      'max-width:300px;padding:6px;border-radius:10px;box-shadow:0 8px 24px rgba(0,0,0,0.28);' +
      (isDark
        ? 'background:var(--theme-color-gray-800,#1f2937);border:1px solid rgba(255,255,255,0.10);'
        : 'background:var(--theme-color-gray-200,#e5e7eb);border:1px solid rgba(0,0,0,0.08);');

    const img = win.document.createElement('img');

    img.src = url;
    img.style.cssText = 'display:block;width:100%;height:auto;border-radius:6px;';
    // Reposition once the image has real dimensions (affects the above/below flip).
    img.addEventListener('load', positionThumb);

    inner.appendChild(img);
    outer.appendChild(inner);
    win.document.body.appendChild(outer);

    thumbPortal = outer;
    positionThumb();
    win.addEventListener('scroll', positionThumb, true);
  };

  const handleThumbHover = (event) => {
    const setEl = event.target.closest('[data-replicator-set]');

    if (!setEl) {
      removeThumb();
      return;
    }

    if (setEl === thumbForSet) {
      return;
    }

    // Only in the collapsed accordion listing — not while a set is expanded for editing.
    if (!isSetCollapsed(setEl)) {
      removeThumb();
      return;
    }

    const url = getSetImageUrl(setEl);

    if (!url) {
      removeThumb();
      return;
    }

    showThumb(setEl, url);
  };

  win.document.addEventListener('mouseover', handleMouseover);
  win.document.addEventListener('mouseover', handleThumbHover);
  win.document.addEventListener('click', handleClick);
  // Dismiss the thumbnail on any click — notably when expanding a set panel,
  // where the mouse stays put and no new mouseover fires to clear it.
  win.document.addEventListener('click', removeThumb);

  return () => {
    win.document.removeEventListener('mouseover', handleMouseover);
    win.document.removeEventListener('mouseover', handleThumbHover);
    win.document.removeEventListener('click', handleClick);
    win.document.removeEventListener('click', removeThumb);
    removeThumb();
  };
}

/** Used by the template dock. Implementation lives in globals-panel.js (toggle `globals`). */
export { replayLivePreview } from '../lp-replay.js';
