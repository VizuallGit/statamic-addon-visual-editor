/**
 * Control Panel hub for Live Preview.
 *
 * Owns postMessage routing from the preview iframe, the LP toolbar, and
 * helpers that several panels share (find a set by `_visual_id`, highlight,
 * replay). Panel UIs are not mounted from here:
 *
 *   section-library.js  — Patterns / saved sections
 *   outline-panel.js    — heading outline
 *   block-tree.js       — list view + comments dock
 *   focus-panel.js      — one-section editor beside the preview
 *   inline-edit.js      — name prompts / save-section dialogs
 *   code-dock.js        — template dock
 *   site-css.js         — site stylesheets (resources/css)
 *   ai-panel.js         — AI chat
 *
 * Overlay open/goto live in overlay-host.js (locked). This file loads them
 * with import() so the CP bundle does not parse overlay-host at boot.
 */

import { ask } from './cp/bus.js';
import { sve } from './cp-registry.js';
import { t } from './cp-t.js';
import { sveState } from './cp-state.js';
import {
  ACTIVE_ATTR,
  COLLAPSE_SETTLE_MS,
  HIGHLIGHT_CLASS,
  HIGHLIGHT_DURATION,
  SELECTORS,
} from './cp-selectors.js';
import { revealSegmentsFor, stampGridRows } from './cp-section-groups.js';
export { t } from './cp-t.js';
export { SELECTORS, GLOBALS_PANEL_PARAM } from './cp-selectors.js';
export { stampGridRows, hideAutoUuidGridColumns } from './cp-section-groups.js';

import { closeCodeDock, closeCodeDockPopups, isCodeDockArmed, relayoutCodeDock, setCodeDockArmed, syncCodeDock, templateDockAllowed } from './code-dock.js';
import { aiPanelAllowed, closeAiPanel, ensureAiPanel, isAiPanelOpen, relayoutAiPanel, toggleAiPanel } from './ai-panel.js';
import { closeSiteCss, isSiteCssOpen, siteCssAllowed, toggleSiteCss } from './site-css.js';
import {
  RIGHT_DOCK_ID,
  beginRightShellSwap,
  endRightShellSwap,
  isRightDockTool,
  isToolbarShortcut,
  relayoutRightDock,
  rememberedListViewTab,
  rememberedRightPaneKeys,
  revealRightPane,
} from './right-dock.js';
import {
  bindChromePrefsFlush,
  chromeGet,
  chromeRemove,
  chromeSet,
  clearChromePrefs,
  hydrateChromePrefs,
} from './chrome-prefs.js';
import { bindMenuDismiss, dropMenu } from './lp-menu-dismiss.js';
import { ensurePanel, hidePanelWait, isRightPanelInDom, showPanelWait, warmLivePreviewCore } from './lazy-panels.js';

async function openOverlay(win, url) {
  const overlay = await import('./overlay-host.js');

  overlay.openOverlay(win, url);
}

// ===== sets =====
export function findSetByUid(uid, doc = document, index = 0) {
  const found = findSetByVisualIdInput(uid, doc, index);

  if (found) {
    return found;
  }

  // Nested replicator blocks often scope with the row id (`{{ id }}`) because
  // `_visual_id` cascades from the parent section in Antlers. Map that row id
  // to the set's real `_visual_id` via publish values, then retry.
  const visualId = resolveVisualIdFromValues(uid, doc);

  if (visualId && visualId !== uid) {
    const viaVisual = findSetByVisualIdInput(visualId, doc, index);

    if (viaVisual) {
      return viaVisual;
    }
  }

  // Saved (synced) sections strip `_visual_id` on save. Until AutoUuid remounts
  // a matching [data-visual-id] input, locate the set by its values path instead
  // — otherwise sve.bootSavedSectionSolo / focus never opens and the sidebar stays
  // on empty entry meta (Published + title).
  return findSetByValuesPath(uid, doc, index);
}

/** Direct (non-nested) replicator sets under a field/set root. */
export function directReplicatorSets(root) {
  if (!root) {
    return [];
  }

  return [...root.querySelectorAll(SELECTORS.replicatorSet)].filter((setEl) => {
    const ancestor = setEl.parentElement?.closest(SELECTORS.replicatorSet);

    return !(ancestor && root.contains(ancestor));
  });
}

/**
 * Walk a publish-values path (`page_sections.0.blocks.1`) into the CP DOM and
 * return the matching replicator set element.
 */
export function setElFromValuesPath(doc, path) {
  const parts = String(path || '').split('.').filter(Boolean);

  if (parts.length < 2) {
    return null;
  }

  let scope =
    doc.getElementById(`field_${parts[0]}`) ||
    doc.querySelector(`[data-field-handle="${CSS.escape(parts[0])}"]`) ||
    doc.querySelector('main') ||
    doc.body;

  let setEl = null;

  for (let i = 1; i < parts.length; i += 2) {
    const idx = Number(parts[i]);

    if (!Number.isInteger(idx)) {
      return null;
    }

    setEl = directReplicatorSets(scope)[idx] || null;

    if (!setEl) {
      return null;
    }

    const nextHandle = parts[i + 1];

    if (nextHandle != null && Number.isNaN(Number(nextHandle))) {
      scope =
        setEl.querySelector(`#field_${CSS.escape(nextHandle)}`) ||
        setEl.querySelector(`[data-field-handle="${CSS.escape(nextHandle)}"]`) ||
        setEl;
    } else {
      scope = setEl;
    }
  }

  return setEl;
}

/** Locate a set by matching row id / _visual_id through publish values → DOM. */
export function findSetByValuesPath(uid, doc, matchIndex = 0) {
  let seen = 0;

  for (const container of sve.activeContainers(doc)) {
    const values = sve.unwrapRef(container.values);

    if (!values || typeof values !== 'object') {
      continue;
    }

    const path = sve.findPathByUid(values, uid);

    if (path === null || path === '') {
      continue;
    }

    const setEl = setElFromValuesPath(doc, path);

    if (!setEl) {
      continue;
    }

    if (seen === matchIndex) {
      return setEl;
    }

    seen += 1;
  }

  return null;
}

export function findSetByVisualIdInput(uid, doc, index = 0) {
  const inputs = doc.querySelectorAll(SELECTORS.visualIdInput);
  let count = 0;

  for (const input of inputs) {
    if (input.value === uid) {
      if (count === index) {
        return input.closest(SELECTORS.anySet);
      }
      count++;
    }
  }

  return null;
}

/**
 * Er rækken låst?
 *
 * `locked_rows` på et replicator- eller grid-felt betyder at rækkerne kan
 * redigeres og skjules, men ikke flyttes, dubleres eller slettes. Fluebenet
 * findes ikke i værdierne — det er en indstilling på feltet — så svaret læses af
 * `data-row-locked`, som projektets LockedRows.js stempler rækken i formularen
 * med. Tages låsen af en række, forsvinder attributten, og så er svaret nej.
 *
 * Spurgt her, i de tre handlinger låsen handler om, frem for i hver knap der
 * kalder dem: bloktræet, værktøjslinjen på siden og et træk-og-slip er tre veje
 * til samme sted, og en lås der kun gælder på nogle af dem er ingen lås.
 */
export function rowIsLocked(uid, doc) {
  if (!uid) {
    return false;
  }

  const el = findSetByUid(uid, doc) || findSetByVisualIdInput(uid, doc);

  return !!el?.hasAttribute('data-row-locked');
}

/**
 * Resolves a preview scope uid (row `id` / `_id` or `_visual_id`) to the set's
 * `_visual_id` stored in the publish form — needed so nested blocks can be
 * found in the CP DOM the same way top-level sections are.
 */
export function resolveVisualIdFromValues(uid, doc) {
  for (const container of sve.activeContainers(doc)) {
    const values = sve.unwrapRef(container.values);

    if (!values || typeof values !== 'object') {
      continue;
    }

    const path = sve.findPathByUid(values, uid);

    if (path === null) {
      continue;
    }

    const row = sve.dataGet(values, path);

    if (row && typeof row === 'object' && row._visual_id) {
      return row._visual_id;
    }
  }

  return null;
}

/**
 * Walks up from a (possibly nested) set uid to the top-level page_sections row.
 */
function topLevelSectionRow(uid, doc) {
  if (!uid) {
    return null;
  }

  for (const container of sve.activeContainers(doc)) {
    const values = sve.unwrapRef(container.values);

    if (!values || typeof values !== 'object') {
      continue;
    }

    const path = sve.findPathByUid(values, uid);

    if (!path) {
      continue;
    }

    const match = path.match(/^([^.]+)\.(\d+)/);

    if (!match) {
      continue;
    }

    const section = sve.dataGet(values, `${match[1]}.${match[2]}`);

    if (section && typeof section === 'object') {
      return section;
    }
  }

  return null;
}

/**
 * Walks up from a (possibly nested) set uid to the top-level section uid
 * (e.g. page_sections.2). Field clicks should solo the section, while still
 * expanding the nested block that owns the field.
 */
export function topLevelSectionUid(uid, doc) {
  const section = topLevelSectionRow(uid, doc);

  if (!section) {
    return null;
  }

  return section._visual_id || section._id || section.id || null;
}

/**
 * Every identity the section row has. `data-sid` on the preview uses `id` first;
 * the dock often holds `_visual_id`. Morph has to try all of them or it falls
 * back to the full body.
 */
export function topLevelSectionIds(uid, doc) {
  const ids = [];
  const push = (value) => {
    if (typeof value === 'string' && value !== '' && !ids.includes(value)) {
      ids.push(value);
    }
  };
  const section = topLevelSectionRow(uid, doc);

  if (section) {
    push(section.id);
    push(section._id);
    push(section._visual_id);
  }

  push(uid);

  return ids;
}

export function collectAncestorSets(setEl) {
  const ancestors = [];
  let current = setEl.parentElement;

  while (current) {
    const ancestor = current.closest(SELECTORS.anySet);

    if (!ancestor) {
      break;
    }

    ancestors.unshift(ancestor);
    current = ancestor.parentElement;
  }

  return ancestors;
}

/**
 * Returns true if the set is currently in its collapsed state.
 *
 * Replicator sets expose `data-collapsed="true"` when collapsed (always
 * present; value is "true" or "false").
 *
 * Bard sets (Tiptap node views) carry no data attribute for collapsed state.
 * Instead Vue's `v-show="!collapsed"` hides the content div via an inline
 * `style="display: none;"` — detected here via `el.style.display`.
 *
 * Stacked Grid rows use our accordion (`data-sve-grid-collapsed`) — separate
 * from Statamic's collapse, which Grids don't have.
 */
export function isSetCollapsed(setEl) {
  if (setEl.hasAttribute('data-sve-grid-row') || setEl.hasAttribute('data-grid-row')) {
    // Our accordion marks collapsed stacked rows. Table-mode grid rows have no
    // accordion — treat them as always open.
    return setEl.hasAttribute('data-sve-grid-collapsed');
  }

  if (setEl.hasAttribute('data-replicator-set')) {
    // Vue may set data-collapsed="" or "true"; absent means expanded.
    return setEl.hasAttribute('data-collapsed') && setEl.getAttribute('data-collapsed') !== 'false';
  }

  // Bard: find the inner contenteditable container and check its last child
  // (the content div that v-show toggles).
  const inner = setEl.querySelector('[contenteditable="false"]');

  if (inner) {
    const contentEl = inner.lastElementChild;

    return !!contentEl && contentEl.style.display === 'none';
  }

  return false;
}

export function expandSet(setEl) {
  if (!isSetCollapsed(setEl)) {
    return;
  }

  // Stacked Grid accordion: open this row and collapse siblings (same behaviour
  // as clicking the header). Do not fake a header click — that would race with
  // our own listener and can leave the focused row closed.
  if (setEl.hasAttribute('data-sve-grid-row') || setEl.hasAttribute('data-sve-grid-collapsed')) {
    const stacked = setEl.parentElement;

    if (stacked) {
      [...stacked.children].forEach((sibling) => {
        if (sibling !== setEl && sibling.hasAttribute('data-sve-grid-row')) {
          setGridRowCollapsed(sibling, true);
        }
      });
    }

    setGridRowCollapsed(setEl, false);

    return;
  }

  // Prefer the set's own collapse toggle — never the focus "step into" arrow
  // that also sits in the header as a button[type=button].
  const toggle = ownHeaderToggle(setEl) || setEl.querySelector(SELECTORS.headerToggle);

  if (toggle) {
    // Use a non-bubbling click so Vue's @click handler on the button fires,
    // but the document-level handleClick listener (which sends a focus message
    // to the iframe) does NOT fire for this programmatic expand action.
    toggle.dispatchEvent(new MouseEvent('click', { bubbles: false, cancelable: true }));
  }
}

/**
 * The set's own collapse toggle — the button Statamic puts straight into the
 * set's `<header>`, not one belonging to a set nested inside it.
 *
 * The step-into arrow lives in that same header and is a `<button type="button">`
 * too, so it is named out rather than counted on to come second.
 */
export function ownHeaderToggle(setEl) {
  const header = [...setEl.children].find((el) => el.tagName === 'HEADER');

  if (!header) {
    return null;
  }

  return (
    [...header.children].find(
      (el) => el.matches('button[type="button"]') && !el.hasAttribute(sve.FOCUS_STEP_ATTR)
    ) || null
  );
}

/** Folds a set back up. The mirror of expandSet, and collapsed already is done. */
export function collapseSet(setEl) {
  if (isSetCollapsed(setEl)) {
    return;
  }

  if (setEl.hasAttribute('data-sve-grid-row') || setEl.hasAttribute('data-sve-grid-collapsed')) {
    setGridRowCollapsed(setEl, true);

    return;
  }

  // Non-bubbling for the same reason expandSet is: Vue's own handler runs, the
  // document listener that would read this as "the editor clicked a set" does not.
  ownHeaderToggle(setEl)?.dispatchEvent(new MouseEvent('click', { bubbles: false, cancelable: true }));
}

// Breathing room (px) left below the sticky grid header when scrolling a row
// into view, so the highlighted row isn't flush against the header.
export const GRID_HEADER_GAP = 12;

/**
 * Height of the sticky <thead> in the grid table containing targetEl, or 0 when
 * targetEl is not inside a table-mode grid (e.g. stacked-mode grids have no
 * <thead>, so no offset is needed).
 */
export function getGridHeaderOffset(targetEl) {
  const table = targetEl.closest('table.grid-table');

  if (!table) {
    return 0;
  }

  const thead = table.querySelector('thead');

  return thead ? thead.offsetHeight : 0;
}

/**
 * Scrolls a set into view. For grid rows in table mode, adds a temporary
 * scroll-margin-top equal to the sticky grid header height (+ a small gap) so
 * the row lands below the header instead of being hidden behind it. The margin
 * is read by the browser when the smooth scroll begins, then restored.
 */
export function scrollSetIntoView(setEl) {
  const offset = setEl.hasAttribute('data-grid-row') ? getGridHeaderOffset(setEl) : 0;

  if (offset > 0) {
    const original = setEl.style.scrollMarginTop;

    setEl.style.scrollMarginTop = `${offset + GRID_HEADER_GAP}px`;
    setEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    requestAnimationFrame(() => {
      setEl.style.scrollMarginTop = original;
    });
  } else {
    setEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

export function highlightSet(setEl, duration = HIGHLIGHT_DURATION) {
  setEl.classList.add(HIGHLIGHT_CLASS);
  setTimeout(() => {
    setEl.classList.remove(HIGHLIGHT_CLASS);
  }, duration);
}

/**
 * For Bard sets, programmatically focus the ProseMirror editor and mark the
 * node as selected by adding the `ProseMirror-selectednode` class — which
 * Statamic/TipTap already styles correctly. The class is removed after
 * `duration` ms so it doesn't linger after the user interacts with the editor.
 */
export function focusBardSet(setEl, duration = HIGHLIGHT_DURATION) {
  setEl.classList.add('ProseMirror-selectednode');
  setTimeout(() => {
    setEl.classList.remove('ProseMirror-selectednode');
  }, duration);
}

/**
 * If setEl lives inside an inactive tab panel, switches to the containing tab
 * by calling Statamic's PublishTabs `setActive(handle)` function, found by
 * walking the Vue component parent chain from the tab trigger element.
 *
 * reka-ui's TabsTrigger does not respond to programmatic `.click()` or
 * `dispatchEvent`, and Vue's component.setupState auto-unwraps refs so we
 * cannot set activeTab.value directly. The reliable approach is to find the
 * `setActive` function exposed in Statamic's PublishTabs.vue setupState and
 * call it with the target tab handle.
 *
 * Returns true when a tab switch was initiated, false when not needed or not
 * possible.
 */
export function switchToContainingTab(setEl, doc = document) {
  const tabPanel = setEl.closest('[role="tabpanel"]');

  if (!tabPanel) {
    return false;
  }

  // reka-ui sets data-state="inactive" on hidden panels. Statamic also adds
  // a .hidden CSS class via Vue's :class binding. Either is sufficient.
  if (tabPanel.dataset.state !== 'inactive' && !tabPanel.classList.contains('hidden')) {
    return false;
  }

  const triggerId = tabPanel.getAttribute('aria-labelledby');
  if (!triggerId) {
    return false;
  }

  const trigger = doc.getElementById(triggerId);
  if (!trigger) {
    return false;
  }

  // Extract the tab handle from the panel ID: "reka-tabs-v-N-content-{handle}"
  const match = tabPanel.id.match(/-content-(.+)$/);
  if (!match) {
    return false;
  }

  const tabHandle = match[1];

  // Walk the Vue component parent chain from the trigger element, looking for
  // Statamic's PublishTabs component which exposes a `setActive(handle)` fn.
  // Starting from the trigger traverses through reka-ui internals to the same
  // component instance that owns the reactive activeTab state.
  //
  // Note: component.setupState auto-unwraps Vue refs to plain values, so we
  // cannot set activeTab directly. Functions are not auto-unwrapped, so
  // setActive is reachable as typeof setupState.setActive === 'function'.
  let component = trigger.__vueParentComponent;

  for (let depth = 0; component && depth < 40; depth++) {
    const setActive = component.setupState?.setActive;

    if (typeof setActive === 'function') {
      setActive(tabHandle);
      return true;
    }

    component = component.parent;
  }

  return false;
}

export function handleFocus(uid, doc = document, afterSetUid = undefined, uidIndex = 0) {
  // Clear persistent active state from whichever element previously held it.
  doc.querySelectorAll(`[${ACTIVE_ATTR}]`).forEach((el) => el.removeAttribute(ACTIVE_ATTR));

  const setEl = findSetByUid(uid, doc, uidIndex);

  if (!setEl) {
    console.warn('[StatamicVisualEditor] handleFocus: no set found for uid:', uid);
    return;
  }

  // Mark as active — persists until the next focus event.
  setEl.setAttribute(ACTIVE_ATTR, '');

  const tabSwitched = switchToContainingTab(setEl, doc);

  // A block can sit under a segment of its section's just as a field can under
  // one of its block's.
  revealSegmentsFor(setEl, doc);

  // When a tab switch was initiated, Vue removes the .hidden class in a
  // microtask. Defer the expand/scroll/highlight block so it runs after the
  // panel becomes visible; otherwise scrollIntoView is a no-op on a hidden el.
  const applyFocus = () => {
    const ancestors = collectAncestorSets(setEl);

    // Check before expanding so we know whether to defer the scroll.
    const anyCollapsed = [...ancestors, setEl].some(isSetCollapsed);

    [...ancestors, setEl].forEach(expandSet);

    const doScrollAndHighlight = () => {
      // When a precise text target (afterSetUid) is provided, skip scrolling to
      // the outer set — scrollBardToTextAfterSet will scroll directly to the text,
      // eliminating the two-step "jump to top of Bard then jump to text" behaviour.
      if (afterSetUid === undefined) {
        scrollSetIntoView(setEl);
      }

      if (setEl.hasAttribute('data-node-view-wrapper')) {
        focusBardSet(setEl);
      } else {
        highlightSet(setEl);
      }

      if (afterSetUid !== undefined) {
        setTimeout(() => scrollBardToTextAfterSet(afterSetUid, setEl), COLLAPSE_SETTLE_MS);
      }
    };

    // expandSet dispatches a non-bubbling click that triggers Vue's reactive
    // collapse toggle asynchronously. If any ancestor (or the target itself)
    // needed expanding, defer the scroll until CSS transitions have completed
    // so scrollIntoView uses the final, fully-rendered layout position.
    if (anyCollapsed) {
      setTimeout(doScrollAndHighlight, COLLAPSE_SETTLE_MS);
    } else {
      doScrollAndHighlight();
    }
  };

  if (tabSwitched) {
    setTimeout(applyFocus, 0);
  } else {
    applyFocus();
  }
}

export function handleHover(uid, doc = document) {
  doc.querySelectorAll('[data-sve-hover]').forEach((el) => {
    el.removeAttribute('data-sve-hover');
  });

  const setEl = findSetByUid(uid, doc);

  // Don't apply hover outline when the element is already the active focused one.
  if (!setEl || setEl.hasAttribute(ACTIVE_ATTR)) {
    return;
  }

  setEl.setAttribute('data-sve-hover', '');
}

/**
 * Finds a field wrapper element in the CP by its dot-separated handle path.
 * Statamic renders `id="field_{path.replaceAll('.', '_')}"` on every field wrapper.
 *
 * Counterpart: bridge.js `findFieldElement()` — runs in the preview iframe and
 * resolves the preview-side `[data-sid-field]` attribute via querySelector +
 * underscore normalization. The two functions cannot share code because they run
 * in separate bundles (CP window vs. preview iframe).
 */
export function findFieldElement(fieldPath, doc = document, scopeUid = undefined) {
  const normalized = fieldPath.replaceAll('.', '_');

  // Scoped lookup: when the preview supplies the surrounding set's _visual_id,
  // restrict the search to that set element. This is what makes a bare handle
  // like "text" resolve to the correct instance instead of the first one in the
  // whole form. The set element is located via the matching [data-visual-id] input.
  if (scopeUid) {
    const setEl = findSetByUid(scopeUid, doc);

    if (setEl) {
      // Prefer the field whose id ends with the handle AND is nearest to this set.
      // querySelectorAll within the set returns only descendants, so any match is
      // already correctly scoped. Pick the shortest id (closest nesting level).
      const matches = [...setEl.querySelectorAll('[id^="field_"]')].filter(
        (el) => el.id === 'field_' + normalized || el.id.endsWith('_' + normalized)
      );

      if (matches.length) {
        matches.sort((a, b) => a.id.length - b.id.length);
        return matches[0];
      }
    }
  }

  // Unscoped: exact match only. We deliberately do NOT fall back to a global
  // suffix match — a bare handle like "text" is ambiguous across repeated
  // sections and a suffix match would wrongly grab the first one in the DOM.
  return doc.getElementById('field_' + normalized);
}

/**
 * Focus a specific CP field by its dot-separated handle path.
 * Switches to the containing tab, scrolls, and plays a highlight animation.
 * Pass `{ animate: false }` to skip the pulse (e.g. when triggered by a direct CP click).
 */
export function handleFieldFocus(fieldPath, doc = document, { animate = true, scopeUid = undefined } = {}) {
  doc.querySelectorAll(`[${ACTIVE_ATTR}]`).forEach((el) => el.removeAttribute(ACTIVE_ATTR));

  // Expand the scoped set (and ancestors) first — nested accordion rows may not
  // expose their field wrappers until open, so findFieldElement can miss them.
  if (scopeUid) {
    const scopedSet = findSetByUid(scopeUid, doc);

    if (scopedSet) {
      [...collectAncestorSets(scopedSet), scopedSet].forEach(expandSet);
    }
  }

  const focusField = () => {
    const fieldEl = findFieldElement(fieldPath, doc, scopeUid);

    if (!fieldEl) {
      console.warn('[SVE] handleFieldFocus: no field element found for path:', fieldPath);
      return false;
    }

    fieldEl.setAttribute(ACTIVE_ATTR, '');

    // Statamic's own tabs, then ours: a field is no use behind either.
    const tabSwitched = switchToContainingTab(fieldEl, doc);

    revealSegmentsFor(fieldEl, doc);

    // Expand any collapsed ancestor Replicator sets so the field is visible.
    // This handles {{ visual_edit field="text" }} used inside Replicator partials.
    const ancestorSets = [];
    let ancestor = fieldEl.parentElement;

    while (ancestor) {
      if (ancestor.hasAttribute('data-replicator-set')) {
        ancestorSets.unshift(ancestor);
      }

      ancestor = ancestor.parentElement;
    }

    const anySetsCollapsed = ancestorSets.some(isSetCollapsed);

    ancestorSets.forEach(expandSet);

    const applyFocus = () => {
      const doScroll = () => {
        fieldEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        if (animate) {
          fieldEl.classList.add('sve-field-highlight');
          setTimeout(() => fieldEl.classList.remove('sve-field-highlight'), 2000);
        }
      };

      if (anySetsCollapsed) {
        setTimeout(doScroll, COLLAPSE_SETTLE_MS);
      } else {
        doScroll();
      }
    };

    if (tabSwitched) {
      setTimeout(applyFocus, 0);
    } else {
      applyFocus();
    }

    return true;
  };

  if (!focusField() && scopeUid) {
    // Field wrappers can mount a beat after the accordion expands.
    setTimeout(focusField, COLLAPSE_SETTLE_MS);
  }
}

/**
 * Apply a hover outline to a CP field wrapper identified by its handle path.
 */
export function handleFieldHover(fieldPath, doc = document, scopeUid = undefined) {
  doc.querySelectorAll('[data-sve-hover]').forEach((el) => el.removeAttribute('data-sve-hover'));

  if (!fieldPath) {
    return;
  }

  const fieldEl = findFieldElement(fieldPath, doc, scopeUid);

  if (!fieldEl || fieldEl.hasAttribute(ACTIVE_ATTR)) {
    return;
  }

  fieldEl.setAttribute('data-sve-hover', '');
}


// ===== preview-chrome =====
// --- Preview chrome: devices + zoom, no Pop out --------------------------------
//
// Statamic's own header shows a "Pop out" button and a text device <Select…>.
// Editors get Puck-style icons: Mobile / Tablet / Laptop / Full-width, plus zoom.
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

export const LP_PREVIEW_CHROME_ID = '__sve-preview-chrome';
export const LP_DEVICE_KEY = 'sve-lp-device';
export const LP_ZOOM_KEY = 'sve-lp-zoom';
export const LP_ZOOM_STEPS = [50, 75, 90, 100];
export const LP_ZOOM_DEFAULT = 100;

export const LP_DEVICE_ICONS = {
  Mobile:
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="2" width="12" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>',
  Tablet:
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>',
  Laptop:
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="14" rx="2"/><path d="M2 18h20M8 22h8"/></svg>',
  // Full-width / Responsive — four arrows out, same idea as Statamic and Puck.
  Responsive:
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"/><line x1="21" y1="3" x2="14" y2="10"/><polyline points="9 21 3 21 3 15"/><line x1="3" y1="21" x2="10" y2="14"/><polyline points="21 15 21 21 15 21"/><line x1="21" y1="21" x2="14" y2="14"/><polyline points="3 9 3 3 9 3"/><line x1="3" y1="3" x2="10" y2="10"/></svg>',
};

export function lpConfiguredDevices(win) {
  const raw = win.Statamic?.$config?.get?.('livePreview.devices');

  return raw && typeof raw === 'object' ? raw : {};
}

/**
 * Mobile → Tablet → Laptop → Responsive — Statamic's devices, reversed so
 * mobile sits on the left and Responsive (expand) on the right.
 *
 * Responsive and Laptop are always present. Tablet/Mobile only if configured.
 */
export function lpDeviceKeys(win) {
  const configured = lpConfiguredDevices(win);
  const keys = [];

  if (configured.Mobile) {
    keys.push('Mobile');
  }

  if (configured.Tablet) {
    keys.push('Tablet');
  }

  keys.push('Laptop');
  keys.push('Responsive');

  return keys;
}

export function lpStoredDevice(win) {
  let stored = chromeGet(win, LP_DEVICE_KEY);

  if (stored === 'Desktop') {
    stored = 'Laptop';
  }

  if (stored && lpDeviceKeys(win).includes(stored)) {
    return stored;
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

  const iframe = sve.previewFrame(win.document);
  const w = iframe?.clientWidth || iframe?.offsetWidth || 0;

  // Before the iframe has a real size (or while LP is still mounting), don't
  // treat a tiny/zero width as Mobile — keep the Full-width icon lit.
  if (w < 200) {
    return 'Responsive';
  }

  const bp = lpWidthToBp(w);

  if (bp === 'tablet') {
    return 'Tablet';
  }

  if (bp === 'mobile') {
    return 'Mobile';
  }

  return 'Responsive';
}


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

/** Desktop-first, like the rest of the responsive work: no order = inherit up. */
export const BP_INHERITS = { laptop: [], tablet: ['laptop'], mobile: ['tablet', 'laptop'] };

/**
 * The breakpoint being edited — the same answer the responsive fields give.
 *
 * Full-width is not a synonym for laptop: it fills the pane, and at a narrow
 * pane that is tablet or mobile. Laptop stays laptop even when scaled down.
 */
export function currentBp(win) {
  let device = chromeGet(win, LP_DEVICE_KEY) || 'Responsive';

  if (device === 'Tablet') {
    return 'tablet';
  }

  if (device === 'Mobile') {
    return 'mobile';
  }

  if (device === 'Laptop') {
    return 'laptop';
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

  for (const container of sve.activeContainers(doc)) {
    const values = sve.unwrapRef(container.values);

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

      if (
        Object.prototype.hasOwnProperty.call(node, orderField('laptop')) &&
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
 * Silent on laptop, and that is the whole safety of it. Laptop is where blocks
 * are added and fields are edited, and a write there re-renders the page builder
 * underneath that work — which is what once left Statamic's set picker spinning
 * forever. Laptop's own order is written once, on the way out, by `setLpDevice`.
 * Everywhere else this only writes when the order actually changed.
 */
export function watchBlockOrder(win) {
  if (win.__sveBlockOrderWatch) {
    return;
  }

  win.__sveBlockOrderWatch = setInterval(() => {
    const bp = currentBp(win);

    if (bp === 'laptop') {
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
  // order under the other's name — which is how laptop and tablet ended up
  // holding the same thing.
  blockOrderSettleUntil = Date.now() + 1200;

  chromeSet(win, LP_DEVICE_KEY, String(key));

  // Before the sort, not after. In Fit the breakpoint is read off the preview's
  // width, and until this has run that width is still the one being left — so a
  // sort placed above it would quietly sort into the order it came from.
  applyLpDevice(win, key);
  applyLpZoom(win);
  paintLpPreviewChrome(win);

  const to = key === 'Tablet' ? 'tablet' : key === 'Mobile' ? 'mobile' : currentBp(win);

  sortBlockOrder(win.document, to);

  // Fit has no width of its own — it takes the pane's, and the class that gives
  // it that may still be settling. One more pass inside the quiet window, which
  // costs nothing when the first one already got it right.
  if (to !== 'tablet' && to !== 'mobile') {
    setTimeout(() => sortBlockOrder(win.document, currentBp(win)), 350);
  }

  watchBlockOrder(win);

  dispatchLpBreakpoint(win, key);
  watchLpResponsiveWidth(win);
}

/** Map a preview width to the responsive field drawer (desktop-first). */
export function lpWidthToBp(width) {
  if (width >= 1024) {
    return 'laptop';
  }

  if (width >= 768) {
    return 'tablet';
  }

  return 'mobile';
}

/**
 * Full-width fills the pane and never auto-zooms. Device presets lock a CSS
 * width and scale down when the pane is narrower than that frame.
 */
export function lpShouldFillPane(win) {
  return lpStoredDevice(win) === 'Responsive';
}

export function dispatchLpBreakpoint(win, deviceKey = lpStoredDevice(win)) {
  let bp = 'laptop';

  if (deviceKey === 'Mobile') {
    bp = 'mobile';
  } else if (deviceKey === 'Tablet') {
    bp = 'tablet';
  } else if (deviceKey === 'Laptop') {
    bp = 'laptop';
  } else if (deviceKey === 'Responsive') {
    bp = lpWidthToBp(lpPaneInnerSize(win).width || 1200);
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
  const iframe = sve.previewFrame(doc);

  if (!iframe) {
    return;
  }

  const devices = lpConfiguredDevices(win);
  let preset = key && key !== 'Responsive' ? devices[key] : null;

  if (key === 'Laptop' && !preset) {
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

  if (key === 'Tablet' && devices.Tablet) {
    return devices.Tablet.width;
  }

  if (key === 'Mobile' && devices.Mobile) {
    return devices.Mobile.width;
  }

  return devices.Laptop?.width || 1440;
}

export function watchLpResponsiveWidth(win) {
  if (LP_SCALE_DEVICE_TO_PANE) {
    watchLpPreviewFit(win);

    return;
  }

  const iframe = sve.previewFrame(win.document);

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
  const iframe = sve.previewFrame(win.document);
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
  const header = sve.lpHeader(doc);

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

    const devices = doc.createElement('div');

    devices.dataset.sveDevices = '';
    // Lidt tættere inde i device-gruppen (samme cluster), ikke mellem clusters.
    devices.style.cssText = `${HEADER_GROUP_STYLE}gap:4px;`;
    chrome.appendChild(devices);

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
    zoom.appendChild(sve.lpModeSeparator(doc));
    zoom.appendChild(zoomLabel);
    zoom.appendChild(sve.lpModeSeparator(doc));
    zoom.appendChild(zoomIn);

    chrome.appendChild(zoom);
  }

  // Rebuild device icons when the set changes (e.g. Laptop removed → Fit only).
  const devicesEl = chrome.querySelector('[data-sve-devices]');
  const deviceKeys = lpDeviceKeys(win);
  const deviceSig = deviceKeys.join('|');

  if (devicesEl && devicesEl.dataset.sig !== deviceSig) {
    devicesEl.dataset.sig = deviceSig;
    devicesEl.textContent = '';

    deviceKeys.forEach((key) => {
      const btn = doc.createElement('button');

      btn.type = 'button';
      btn.dataset.device = key;
      btn.title =
        key === 'Responsive'
          ? t(win, 'device_full')
          : key === 'Laptop'
            ? t(win, 'device_laptop')
            : key;
      btn.innerHTML = LP_DEVICE_ICONS[key] || LP_DEVICE_ICONS.Laptop;
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
  sve.syncLpRightBarGaps(win);

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
    sve.paintLpActiveControl(btn, btn.dataset.device === device);
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
      const want = allowed ? sve.LP_ICON_IDLE_OPACITY : sve.LP_ICON_LOCKED_OPACITY;

      btn.disabled = !allowed;
      btn.setAttribute('aria-disabled', allowed ? 'false' : 'true');
      btn.title = t(win, allowed ? 'zoom_in' : 'zoom_in_max');

      if (btn.style.opacity !== want) {
        btn.style.opacity = want;
      }

      return;
    }

    if (btn.style.opacity !== sve.LP_ICON_IDLE_OPACITY) {
      btn.style.opacity = sve.LP_ICON_IDLE_OPACITY;
    }
  });

  sve.paintLpSaveButton(win);
  sve.syncLpRightBarGaps(win);

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
  const iframe = sve.previewFrame(win.document);

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


// ===== header-toolbar =====
// --- Header toolbar: one control at a time -------------------------------------
//
// The header used to show every control at once — the panel mode, the collection
// picker, the globals dropdown, the sections button. For an editor a customer
// uses, that's noise. This collapses them to a row of icons; clicking one reveals
// only its control and hides the rest. The settings icon is the important one: it
// opens the editor panel and mirrors its tabs (Main/SEO/Sidebar, read live so a
// renamed tab just follows) into the header, plus a Save — so "edit the SEO" is
// one obvious click, not a hunt.

export const HEADER_TOOLBAR_ID = '__sve-toolbar';

export const SETTINGS_TABS_ID = '__sve-settings-tabs';

/**
 * Ikoner der folder en kontrol ud ved siden af sig. De øvrige (sektioner,
 * disposition) åbner et panel i siden og står helt frit.
 */
export const FRAMED_TABS = ['pages', 'globals'];

/**
 * De to der samler ikon og kontrol i ét felt, delt op af gennemgående streger.
 *
 * Panelknappen gør det ikke: dér er kontrollen en tilstand knappen selv står i,
 * og de to skal kunne skelnes. Her er kontrollen et sted man navigerer hen — ét
 * sammenhængende værktøj, hvor stregerne siger hvor det ene stopper og det
 * næste begynder.
 */
export const MERGED_TABS = ['pages', 'globals'];

export const frameId = (key) => `__sve-frame-${key}`;
export const seamId = (key) => `__sve-seam-${key}`;

/** Fladen bag både ikonknappen og kontrolgruppen — samme, så de hører sammen. */
export const HEADER_SURFACE = 'rgba(128,128,128,.16)';

/** Hover-flade på venstre toolbar-ikoner — idle-flade på close, så den læses som en knap. */
export const HEADER_ICON_HOVER = 'rgba(128, 128, 128, .28)';

/** Gruppeboksens luft ud til kontrollerne i den. */
export const LP_CONTROL_PAD = 5;

/**
 * Ydre højde for alle topbar-grupper og selvstændige ikonknapper (devices,
 * zoom, Hidden/Auto/Visible, pages/globals, go-back). Pad + kontrol = 32.
 */
export const LP_CHROME_H = 32;

/** Indre kontrolhøjde inde i en gruppe (32 − 2×5). */
export const LP_CONTROL_H = LP_CHROME_H - LP_CONTROL_PAD * 2;

/** Count disc on the comments icon. Idle = same metal as the glyph, dark type; open = pale blue. */
export const COMMENTS_BADGE_FG = 'var(--theme-color-primary, #4530D8)';
export const COMMENTS_BADGE_IDLE_TYPE = '#18181b';
export const COMMENTS_BADGE_ACTIVE_BG =
  'color-mix(in oklab, var(--theme-color-primary, #4530D8) 14%, white)';

/**
 * Kvadratisk ikonknap i topbaren — samme flade/højde som device/zoom-grupperne
 * når den står alene (fx go-back). Ikoner inde i en gruppe bruger
 * LP_TOOLBAR_ICON_STYLE.
 */
export const LP_ICON_BTN_STYLE =
  `box-sizing:border-box;width:${LP_CHROME_H}px;height:${LP_CHROME_H}px;` +
  'display:inline-flex;align-items:center;justify-content:center;padding:0;' +
  `border:none;border-radius:.5rem;cursor:pointer;background:${HEADER_SURFACE};color:currentColor;`;

/**
 * Fladen bag et felt man vælger i, oven på gruppens.
 *
 * Lysere end gruppen, ikke mørkere: den mørke er taget af knappen, og de to må
 * ikke kunne forveksles. Et felt man vælger i og en knap man trykker på gør ikke
 * det samme, så de skal heller ikke se ens ud.
 */
export const HEADER_FIELD_SURFACE = 'rgba(128,128,128,.3)';

/** Luften mellem ikonknappen og dens kontrolgruppe, når de er to bokse. */
export const LP_ICON_GAP = 8;

/**
 * Ens mellemrum mellem topbar-items (ikoner, device/zoom, Save, go-back).
 * Ikke ekstra margin på udvidede felter — det gav skæve huller omkring Globals.
 */
export const LP_TOOLBAR_GAP = 8;

/** Luften på hver side af en gennemgående streg. */
export const LP_SEAM_GAP = 6;

/** Pilen i vores egne selects. Native-pilen står klods op ad kanten. */
export const SELECT_CHEVRON =
  'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' ' +
  "viewBox='0 0 24 24' fill='none' stroke='%23a3a3a3' stroke-width='2.2' stroke-linecap='round' " +
  'stroke-linejoin=\'round\'%3E%3Cpath d=\'m6 9 6 6 6-6\'/%3E%3C/svg%3E")';

/** Selve gruppen om et sæt kontroller: fladen, hjørnerne og luften ud til dem. */
export const HEADER_GROUP_STYLE =
  `display:inline-flex;align-items:center;box-sizing:border-box;height:${LP_CHROME_H}px;` +
  `padding:${LP_CONTROL_PAD}px;border-radius:.5rem;` +
  `background:${HEADER_SURFACE};font-family:inherit;`;

/**
 * En kontrol inde i en gruppe. Lavere end gruppens indre mål, så den valgte
 * flade ikke går helt ud til kanten — den skal ligge i gruppen, ikke fylde den.
 */
export const FRAMED_CONTROL_STYLE =
  `box-sizing:border-box;height:${LP_CONTROL_H}px;border:none;border-radius:.375rem;` +
  'background:transparent;cursor:pointer;color:currentColor;' +
  'font-size:12px;font-weight:500;font-family:inherit;line-height:1;';

/** Ikon inde i en topbar-gruppe — samme mål som device-knapperne. */
export const LP_TOOLBAR_ICON_STYLE =
  `${FRAMED_CONTROL_STYLE}width:28px;padding:0;display:inline-flex;align-items:center;justify-content:center;`;

/**
 * En select i et felt med streger: ingen flade om sig selv — stregerne er det
 * der skiller den fra naboen, og en flade oveni ville sige det samme igen.
 *
 * Pilen sidder .375rem fra kanten, og teksten stopper før den. Designet tegnede
 * den ikke, men uden den ligner en select et stykke tekst — man skal kunne se at
 * der er noget at folde ud. Den luft passer med stregens egen, så afstanden ind
 * til stregen bliver den samme fra begge sider.
 */
export const FRAMED_SELECT_STYLE =
  `${FRAMED_CONTROL_STYLE}padding:0 1.375rem 0 .375rem;appearance:none;-webkit-appearance:none;` +
  `background-image:${SELECT_CHEVRON};background-repeat:no-repeat;` +
  'background-position:right .375rem center;background-size:12px;';

/**
 * Sømmen mellem to dele af samme felt — ikke i brug i topbaren.
 */
export function headerSeam(doc) {
  return sve.lpModeSeparator(doc);
}

/** Fjern lyse ikon-streger i topbaren, hvis en ældre session har sat dem ind. */
export function syncToolbarIconSeps(bar) {
  bar?.querySelectorAll('[data-sve-toolbar-sep]').forEach((el) => el.remove());
}

/**
 * Samme gruppe, men svævende over panelet i stedet for at ligge på topbaren.
 *
 * Gruppens flade er halvgennemsigtig, og panelet ruller under den — så den skal
 * have en tæt bund at ligge på, ellers læser man indholdet gennem knapperne. Et
 * fladt gradient-lag oven på panelfarven giver præcis samme nuance som oppe i
 * topbaren, bare uigennemsigtig.
 */
export const FLOATING_GROUP_STYLE =
  `${HEADER_GROUP_STYLE}background:linear-gradient(${HEADER_SURFACE},${HEADER_SURFACE}),` +
  'var(--theme-color-content-bg,#fff);box-shadow:0 1px 4px rgba(0,0,0,.18);color:currentColor;';

// null = nothing expanded (the simplest header). Persisted so it survives the
// header being rebuilt on every preview update.

/** The feature toggle behind each header tab — see ensureHeaderToolbar. */
export const HEADER_TAB_FEATURE = {
  settings: 'panel',
  pages: 'pages',
  globals: 'globals',
  sections: 'sections',
  outline: 'outline',
  html_tree: 'html_tree',
};

function formHasPageBuilder(win) {
  if (typeof sve.formHasSectionField === 'function') {
    return sve.formHasSectionField(win);
  }

  const field = sve.sectionField?.(win) || 'page_sections';
  const doc = win.document;

  if (doc.querySelector(`.publish-field-${field}, [data-field="${field}"], #field_${field}`)) {
    return true;
  }

  const containers = typeof sve.activeContainers === 'function' ? sve.activeContainers(doc) : [];

  for (const container of containers) {
    const values = sve.unwrapRef?.(container.values) || container.values;

    if (values && Array.isArray(values[field])) {
      return true;
    }
  }

  return false;
}

export function headerTabAvailable(win, tab) {
  if (!tab) {
    return true;
  }

  if (tab === 'sections' && !formHasPageBuilder(win)) {
    return false;
  }

  return sve.featureOn(win, HEADER_TAB_FEATURE[tab] ?? tab);
}

export function loadHeaderTab(win) {
  if (sveState.headerTab !== undefined) {
    return;
  }

  const stored = chromeGet(win, 'sve-header-tab');

  sveState.headerTab = stored && headerTabAvailable(win, stored) ? stored : null;
}

/** Re-open docked right panels that were showing last time — pins, order, extras. */

/**
 * While Live Preview is still booting inside the site overlay, remounting every
 * pinned right pane (AI + tree + comments + sections) races the preview open and
 * can prevent `lp-ready` — the host then looks like login failed. Pause until
 * the preview has painted.
 */

export function restoreRememberedCodeDock(win) {
  try {
    if (isCodeDockArmed(win) && templateDockAllowed(win)) {
      syncCodeDock(win, win.document, sveState.soloUid);
    }
  } catch (err) {
    console.error('[sve] restore code dock', err);
  }
}

export function restoreDockedHeaderPanels(win) {
  if (sveState.dockRestorePaused) {
    return;
  }

  // Once restored this session, stop. Re-running on every MutationObserver tick
  // remounts AI/tree/comments and races the frontend overlay open.
  if (sveState.dockedHeaderRestored) {
    return;
  }

  const showing = (key) => {
    if (key === 'listview') {
      return !!sve.listViewPanel?.(win.document) || isRightPanelInDom(win, 'listview');
    }

    if (key === 'outline') {
      return !!win.document.getElementById(sve.OUTLINE_PANEL_ID);
    }

    if (key === 'html_tree') {
      return !!win.document.getElementById(sve.HTML_TREE_PANEL_ID);
    }

    if (key === 'sections') {
      return !!win.document.getElementById(sve.SECTION_PICKER_ID);
    }

    if (key === 'comments') {
      return !!sve.commentsPanel?.(win.document) || isRightPanelInDom(win, 'comments');
    }

    if (key === 'ai') {
      return isAiPanelOpen(win.document);
    }

    return false;
  };

  let keys = [];

  try {
    keys = rememberedRightPaneKeys(win);
    const docked = chromeGet(win, sve.LP_DOCKED_KEY) || '';

    if (docked && docked !== 'right') {
      const extra = docked;

      if (!keys.includes(extra)) {
        keys = [...keys, extra];
      }
    }

    if (rememberedListViewTab(win) === 'outline' && !keys.includes('outline')) {
      keys = keys.map((k) => (k === 'listview' ? 'outline' : k));

      if (!keys.includes('outline')) {
        keys = [...keys, 'outline'];
      }
    }
  } catch {
    keys = [];
  }

  keys = keys.filter((key) => key !== 'html_tree');
  keys = keys.filter((key) => key !== 'sections' || headerTabAvailable(win, 'sections'));

  if (!keys.length) {
    sveState.dockedHeaderRestored = true;
    restoreRememberedCodeDock(win);

    return;
  }

  if (keys.every(showing)) {
    sveState.dockedHeaderRestored = true;
    restoreRememberedCodeDock(win);

    return;
  }

  sveState.dockedHeaderRestored = true;
  sveState.listViewTab = 'tree';

  beginRightShellSwap();

  void (async () => {
    try {
      for (const key of keys) {
        try {
          await ensureRightTool(win, key);
        } catch (err) {
          console.error('[sve] restore right pane', key, err);
        }
      }
    } finally {
      endRightShellSwap();
    }

    relayoutRightDock(win);
    sve.persistDockedPanel(win);
    restoreRememberedCodeDock(win);
  })();
}

export async function ensureRightTool(win, key) {
  if (key === 'ai') {
    ensureAiPanel(win);

    return;
  }

  if (!isRightPanelInDom(win, key) && key !== 'edits') {
    showPanelWait(win, key);
  }

  try {
    await ensurePanel(key);
  } finally {
    hidePanelWait(win);
  }

  if (key === 'listview') {
    if (!sve.listViewPanel?.(win.document)) {
      sve.toggleListViewPanel?.(win);
    }

    return;
  }

  if (key === 'outline') {
    if (!win.document.getElementById(sve.OUTLINE_PANEL_ID)) {
      sve.toggleOutlinePanel?.(win);
    }

    return;
  }

  if (key === 'html_tree') {
    if (!win.document.getElementById(sve.HTML_TREE_PANEL_ID)) {
      sve.toggleHtmlTreePanel?.(win);
    }

    return;
  }

  if (key === 'sections') {
    if (!win.document.getElementById(sve.SECTION_PICKER_ID)) {
      sve.openSectionPicker?.(win);
    }

    return;
  }

  if (key === 'comments') {
    if (!sve.commentsPanel?.(win.document)) {
      sve.toggleCommentsPanel?.(win);
    }

    return;
  }

  if (key === 'edits') {
    sve.togglePageEdits?.(win);
  }
}

export function setHeaderTab(win, tab) {
  sveState.headerTab = tab;

  if (tab) {
    chromeSet(win, 'sve-header-tab', tab);
  } else {
    chromeRemove(win, 'sve-header-tab');
  }
}

export const TOOLBAR_ICONS = {
  // Soft panel-left — same stroke language as pages/globe/grid (not the old heavy box).
  settings:
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" style="display:block"><rect x="3" y="3" width="18" height="18" rx="2"/>' +
    '<path d="M9 3v18"/></svg>',
  rightdock:
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" style="display:block"><rect x="3" y="3" width="18" height="18" rx="2"/>' +
    '<path d="M15 3v18"/></svg>',
  pages:
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" style="display:block"><rect x="4" y="3" width="16" height="18" rx="2"/>' +
    '<line x1="8" y1="8" x2="16" y2="8"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="8" y1="16" x2="13" y2="16"/></svg>',
  globals:
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" style="display:block"><circle cx="12" cy="12" r="9"/>' +
    '<line x1="3" y1="12" x2="21" y2="12"/><path d="M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18"/></svg>',
  sections:
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" style="display:block"><rect x="3" y="3" width="7" height="7" rx="1"/>' +
    '<rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>' +
    '<rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
  // The bars you sent — nesting, no page frame around them.
  listview:
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" ' +
    'stroke-linecap="round" stroke-linejoin="round" style="display:block">' +
    '<line x1="3" y1="6" x2="13" y2="6"/><line x1="7" y1="12" x2="17" y2="12"/>' +
    '<line x1="11" y1="18" x2="21" y2="18"/></svg>',
  // Table of contents: markers + title lines getting shorter (H1, H2, H3).
  outline:
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" style="display:block">' +
    '<circle cx="4.5" cy="6" r="1.4" fill="currentColor" stroke="none"/>' +
    '<circle cx="4.5" cy="12" r="1.4" fill="currentColor" stroke="none"/>' +
    '<circle cx="4.5" cy="18" r="1.4" fill="currentColor" stroke="none"/>' +
    '<line x1="9" y1="6" x2="21" y2="6"/><line x1="9" y1="12" x2="17.5" y2="12"/>' +
    '<line x1="9" y1="18" x2="14" y2="18"/></svg>',
  html_tree:
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" style="display:block"><rect x="4" y="3" width="16" height="7" rx="1.5"/>' +
    '<rect x="8" y="14" width="12" height="7" rx="1.5"/></svg>',
  code:
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" style="display:block" aria-hidden="true">' +
    '<path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.565-2.438L1.5 0zm7.031 9.75-.232-2.718h10.059l.23-2.622H5.412l.698 8.01h9.02l-.326 3.426-2.91.804-2.955-.81-.188-2.11H6.248l.33 4.171L12 19.351l5.379-1.443.744-8.157H8.531z"/></svg>',
  comments:
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" style="display:block">' +
    '<path d="M7 4h10a4 4 0 0 1 4 4v6a4 4 0 0 1-4 4H9.5L5 21.5V18H7a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4z"/></svg>',
  edits:
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" style="display:block">' +
    '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>' +
    '<path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>',
  ai:
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" style="display:block">' +
    '<path d="M9.94 15.5A2 2 0 0 0 8.5 14.06l-6.14-1.58a.5.5 0 0 1 0-.96L8.5 9.94A2 2 0 0 0 9.94 8.5l1.58-6.14a.5.5 0 0 1 .96 0L14.06 8.5A2 2 0 0 0 15.5 9.94l6.14 1.58a.5.5 0 0 1 0 .96L15.5 14.06a2 2 0 0 0-1.44 1.44l-1.58 6.14a.5.5 0 0 1-.96 0z"/>' +
    '<path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/></svg>',
  site_css:
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" style="display:block">' +
    '<path d="M8 4c-3 1-4 3-4 6v1c0 1.2-1 2-2 2 1 0 2 .8 2 2v1c0 3 1 5 4 6"/>' +
    '<path d="M16 4c3 1 4 3 4 6v1c0 1.2 1 2 2 2-1 0-2 .8-2 2v1c0 3-1 5-4 6"/></svg>',
};

/** Keep toolbar glyphs in sync after icon redesigns (toolbar mounts once). */
export function syncToolbarIcons(doc) {
  const bar = doc.getElementById(HEADER_TOOLBAR_ID);

  if (!bar) {
    return;
  }

  bar.querySelectorAll('button[data-tab]').forEach((btn) => {
    const key = btn.dataset.tab;
    const html = TOOLBAR_ICONS[key];

    if (!html || btn.dataset.iconVer === 'stairs-toc-20260821') {
      return;
    }

    const badge = btn.querySelector('[data-sc-badge]');

    btn.innerHTML = html;
    btn.dataset.iconVer = 'stairs-toc-20260821';

    if (badge) {
      btn.appendChild(badge);
    }
  });
}

/** The icon row at the far left of the Live Preview header. */
export function ensureHeaderToolbar(win) {
  const doc = win.document;
  const header = sve.lpHeader(doc);

  if (!header || doc.getElementById(HEADER_TOOLBAR_ID)) {
    doc.getElementById(HEADER_TOOLBAR_ID)?.querySelector('button[data-tab="rightdock"]')?.remove();
    ensureCodeDockToolbarButton(win);
    ensureSiteCssToolbarButton(win);
    ensureAiToolbarButton(win);
    ensureCommentsToolbarButton(win);
    ensurePageEditsToolbarButton(win);
    ensureOutlineToolbarButton(win);
    ensureHtmlTreeToolbarButton(win);
    syncToolbarIconSeps(doc.getElementById(HEADER_TOOLBAR_ID));

    return;
  }

  const bar = doc.createElement('div');

  bar.id = HEADER_TOOLBAR_ID;
  bar.dataset.sveChrome = 'group-1';
  bar.style.cssText =
    `${HEADER_GROUP_STYLE}gap:4px;margin-right:${LP_TOOLBAR_GAP}px;`;

  // `feature` names the toggle on the settings screen; `key` is what the rest of
  // the header calls the tab. They differ for the panel because the toggle reads
  // as what it opens ("Page settings panel") while the tab is the icon's slot.
  [
    { key: 'settings', feature: 'panel', title: t(win, 'panel') },
    { key: 'pages', feature: 'pages', title: t(win, 'pages') },
    { key: 'globals', feature: 'globals', title: t(win, 'globals') },
    { key: 'sections', feature: 'sections', title: t(win, 'sections') },
    { key: 'listview', feature: 'listview', title: t(win, 'listview') },
    { key: 'outline', feature: 'outline', title: t(win, 'outline') },
    { key: 'code', title: t(win, 'code_dock_toggle') },
    { key: 'site_css', title: t(win, 'site_css_toggle') },
    { key: 'ai', title: t(win, 'ai_panel') },
    { key: 'comments', feature: 'comments', title: t(win, 'comments_pane') },
    { key: 'edits', feature: 'page_activity', title: t(win, 'page_edits_title') },
  ].forEach((tab) => {
    if (isToolbarShortcut(tab.key) && isRightDockTool(tab.key)) {
      // Right-dock pane with a header shortcut (comments badge).
    } else if (isRightDockTool(tab.key)) {
      return;
    } else if (tab.key === 'code') {
      if (!templateDockAllowed(win)) {
        return;
      }
    } else if (tab.key === 'site_css') {
      if (!siteCssAllowed(win)) {
        return;
      }
    } else if (tab.key === 'ai') {
      if (!aiPanelAllowed(win)) {
        return;
      }
    } else if (tab.key === 'comments') {
      if (!sve.featureOn(win, 'comments')) {
        return;
      }
    } else if (tab.key === 'edits') {
      if (!sve.featureOn(win, 'page_activity')) {
        return;
      }
    } else if (!sve.featureOn(win, tab.feature)) {
      return;
    }

    const btn = doc.createElement('button');

    btn.type = 'button';
    btn.dataset.tab = tab.key;
    btn.title = tab.title;
    btn.innerHTML = TOOLBAR_ICONS[tab.key];
    btn.dataset.iconVer = 'stairs-toc-20260821';
    // Same outer size as devices / zoom / go-back — one height across the bar.
    btn.style.cssText = LP_TOOLBAR_ICON_STYLE + (tab.key === 'comments' ? 'position:relative;' : '');
    btn.querySelector('svg')?.setAttribute('width', '15');
    btn.querySelector('svg')?.setAttribute('height', '15');
    btn.addEventListener('click', () => {
      if (tab.key === 'comments') {
        void (async () => {
          showPanelWait(win, 'comments');

          try {
            await ensurePanel('comments');
          } finally {
            hidePanelWait(win);
          }

          sve.toggleCommentsPanel?.(win);
          sve.persistDockedPanel(win);
          applyHeaderTab(win);
          sve.syncPreviewInset(win);
        })();

        return;
      }

      if (tab.key === 'code') {
        toggleCodeDockButton(win);

        return;
      }

      if (tab.key === 'site_css') {
        toggleSiteCssButton(win);

        return;
      }

      if (tab.key === 'ai') {
        toggleAiPanelButton(win);

        return;
      }

      if (tab.key === 'edits') {
        void (async () => {
          await ensurePanel('edits');
          sve.togglePageEdits?.(win);
          applyHeaderTab(win);
        })();

        return;
      }

      toggleHeaderTab(win, tab.key);
    });

    if (FRAMED_TABS.includes(tab.key)) {
      const wrap = doc.createElement('div');

      wrap.id = frameId(tab.key);

      if (MERGED_TABS.includes(tab.key)) {
        wrap.style.cssText = 'display:inline-flex;align-items:center;gap:6px;';
        wrap.appendChild(btn);

        const seam = sve.lpModeSeparator(doc);

        seam.id = seamId(tab.key);
        seam.style.display = 'none';
        wrap.appendChild(seam);
      } else {
        // To bokse med luft imellem: knappen er det man trykker på, kontrollen er
        // det der kommer frem, og de skal kunne skelnes — samme højde begge.
        wrap.style.cssText = `display:inline-flex;align-items:center;gap:${LP_ICON_GAP}px;`;
        wrap.appendChild(btn);
      }

      bar.appendChild(wrap);

      return;
    }

    bar.appendChild(btn);
  });

  header.insertBefore(bar, header.firstChild);
  syncToolbarIconSeps(bar);
}

export function toggleCodeDockButton(win) {
  const next = !isCodeDockArmed(win);

  setCodeDockArmed(win, next);

  if (next) {
    syncCodeDock(win, win.document, sveState.soloUid);
  } else {
    closeCodeDock(win.document);
  }

  applyHeaderTab(win);
}

export function toggleSiteCssButton(win) {
  if (!siteCssAllowed(win)) {
    return;
  }

  toggleSiteCss(win);
  applyHeaderTab(win);
}

/**
 * The code icon is added after the toolbar first mounts (feature flags can
 * arrive late) and sits after the block tree, last in the icon row.
 */
export function ensureCodeDockToolbarButton(win) {
  const doc = win.document;
  const bar = doc.getElementById(HEADER_TOOLBAR_ID);

  if (!bar) {
    return;
  }

  const existing = bar.querySelector('button[data-tab="code"]');

  if (!templateDockAllowed(win)) {
    existing?.remove();

    if (isCodeDockArmed(win)) {
      setCodeDockArmed(win, false);
      closeCodeDock(doc);
    }

    return;
  }

  if (existing) {
    return;
  }

  const btn = doc.createElement('button');

  btn.type = 'button';
  btn.dataset.tab = 'code';
  btn.dataset.iconVer = 'stroke-15-html5';
  btn.title = t(win, 'code_dock_toggle');
  btn.innerHTML = TOOLBAR_ICONS.code;
  btn.style.cssText = LP_TOOLBAR_ICON_STYLE;
  btn.querySelector('svg')?.setAttribute('width', '15');
  btn.querySelector('svg')?.setAttribute('height', '15');
  btn.addEventListener('click', () => toggleCodeDockButton(win));

  const listview = bar.querySelector('button[data-tab="listview"]');
  const rightdock = bar.querySelector('button[data-tab="rightdock"]');

  if (listview) {
    listview.after(btn);
  } else if (rightdock) {
    rightdock.after(btn);
  } else {
    bar.appendChild(btn);
  }
}

export function ensureSiteCssToolbarButton(win) {
  const doc = win.document;
  const bar = doc.getElementById(HEADER_TOOLBAR_ID);

  if (!bar) {
    return;
  }

  const existing = bar.querySelector('button[data-tab="site_css"]');

  if (!siteCssAllowed(win)) {
    existing?.remove();

    if (isSiteCssOpen(doc)) {
      closeSiteCss(win);
    }

    return;
  }

  if (existing) {
    return;
  }

  const btn = doc.createElement('button');

  btn.type = 'button';
  btn.dataset.tab = 'site_css';
  btn.dataset.iconVer = 'css-braces-20260831';
  btn.title = t(win, 'site_css_toggle');
  btn.innerHTML = TOOLBAR_ICONS.site_css;
  btn.style.cssText = LP_TOOLBAR_ICON_STYLE;
  btn.querySelector('svg')?.setAttribute('width', '15');
  btn.querySelector('svg')?.setAttribute('height', '15');
  btn.addEventListener('click', () => toggleSiteCssButton(win));

  const code = bar.querySelector('button[data-tab="code"]');

  if (code) {
    code.after(btn);
  } else {
    bar.appendChild(btn);
  }
}

export function ensureOutlineToolbarButton(win) {
  const doc = win.document;
  const bar = doc.getElementById(HEADER_TOOLBAR_ID);

  if (!bar) {
    return;
  }

  if (!sve.featureOn(win, 'outline')) {
    bar.querySelector('button[data-tab="outline"]')?.remove();

    return;
  }

  if (bar.querySelector('button[data-tab="outline"]')) {
    return;
  }

  const btn = doc.createElement('button');

  btn.type = 'button';
  btn.dataset.tab = 'outline';
  btn.dataset.iconVer = 'stairs-toc-20260821';
  btn.title = t(win, 'outline');
  btn.innerHTML = TOOLBAR_ICONS.outline;
  btn.style.cssText = LP_TOOLBAR_ICON_STYLE;
  btn.querySelector('svg')?.setAttribute('width', '15');
  btn.querySelector('svg')?.setAttribute('height', '15');
  btn.addEventListener('click', () => toggleHeaderTab(win, 'outline'));

  const listview = bar.querySelector('button[data-tab="listview"]');

  if (listview) {
    listview.after(btn);
  } else {
    const code = bar.querySelector('button[data-tab="code"]');

    if (code) {
      code.before(btn);
    } else {
      bar.appendChild(btn);
    }
  }
}

/** HTML tree opens with the template dock — no top-bar icon. */
export function ensureHtmlTreeToolbarButton(win) {
  win.document.getElementById(HEADER_TOOLBAR_ID)
    ?.querySelector('button[data-tab="html_tree"]')
    ?.remove();
}

export function ensureCommentsToolbarButton(win) {
  const doc = win.document;
  const bar = doc.getElementById(HEADER_TOOLBAR_ID);

  if (!bar) {
    return;
  }

  if (!sve.featureOn(win, 'comments')) {
    bar.querySelector('button[data-tab="comments"]')?.remove();

    return;
  }

  if (isRightDockTool('comments')) {
    if (!isToolbarShortcut('comments')) {
      bar.querySelector('button[data-tab="comments"]')?.remove();

      return;
    }

    if (bar.querySelector('button[data-tab="comments"]')) {
      bar.appendChild(bar.querySelector('button[data-tab="comments"]'));

      return;
    }

    const btn = doc.createElement('button');

    btn.type = 'button';
    btn.dataset.tab = 'comments';
    btn.dataset.iconVer = 'stairs-toc-20260821';
    btn.title = t(win, 'comments_pane');
    btn.innerHTML = TOOLBAR_ICONS.comments;
    btn.style.cssText = `${LP_TOOLBAR_ICON_STYLE}position:relative;`;
    btn.querySelector('svg')?.setAttribute('width', '15');
    btn.querySelector('svg')?.setAttribute('height', '15');
    btn.addEventListener('click', () => {
      revealRightPane(win, 'comments');
      sve.persistDockedPanel(win);
      applyHeaderTab(win);
      sve.syncPreviewInset(win);
    });
    bar.appendChild(btn);
    win.dispatchEvent(new CustomEvent('sve-right-dock-change', { detail: {} }));

    return;
  }

  const comments = bar.querySelector('button[data-tab="comments"]');

  if (comments && comments !== bar.lastElementChild) {
    bar.appendChild(comments);
  }
}

export function ensurePageEditsToolbarButton(win) {
  const doc = win.document;
  const bar = doc.getElementById(HEADER_TOOLBAR_ID);

  if (!bar) {
    return;
  }

  if (!sve.featureOn(win, 'page_activity')) {
    bar.querySelector('button[data-tab="edits"]')?.remove();

    return;
  }

  if (bar.querySelector('button[data-tab="edits"]')) {
    return;
  }

  const btn = doc.createElement('button');

  btn.type = 'button';
  btn.dataset.tab = 'edits';
  btn.dataset.iconVer = 'stairs-toc-20260821';
  btn.title = t(win, 'page_edits_title');
  btn.innerHTML = TOOLBAR_ICONS.edits;
  btn.style.cssText = LP_TOOLBAR_ICON_STYLE;
  btn.querySelector('svg')?.setAttribute('width', '15');
  btn.querySelector('svg')?.setAttribute('height', '15');
  btn.addEventListener('click', () => {
    void (async () => {
      await ensurePanel('edits');
      sve.togglePageEdits?.(win);
      applyHeaderTab(win);
    })();
  });

  const comments = bar.querySelector('button[data-tab="comments"]');

  if (comments) {
    comments.after(btn);
  } else {
    bar.appendChild(btn);
  }
}

export function toggleAiPanelButton(win) {
  if (!aiPanelAllowed(win)) {
    return;
  }

  if (!isAiPanelOpen(win.document)) {
    sve.closeRightPanels(win, ['__sve-ai-panel']);
  }

  toggleAiPanel(win);
  sve.syncPreviewInset(win);
  applyHeaderTab(win);
}

export function ensureAiToolbarButton(win) {
  const doc = win.document;
  const bar = doc.getElementById(HEADER_TOOLBAR_ID);

  if (!bar) {
    return;
  }

  const existing = bar.querySelector('button[data-tab="ai"]');

  if (!aiPanelAllowed(win)) {
    existing?.remove();

    if (isAiPanelOpen(doc)) {
      closeAiPanel(win);
      sve.syncPreviewInset(win);
    }

    return;
  }

  if (existing) {
    return;
  }

  const btn = doc.createElement('button');

  btn.type = 'button';
  btn.dataset.tab = 'ai';
  btn.dataset.iconVer = 'stroke-15-spark';
  btn.title = t(win, 'ai_panel');
  btn.innerHTML = TOOLBAR_ICONS.ai;
  btn.style.cssText = LP_TOOLBAR_ICON_STYLE;
  btn.querySelector('svg')?.setAttribute('width', '15');
  btn.querySelector('svg')?.setAttribute('height', '15');
  btn.addEventListener('click', () => toggleAiPanelButton(win));

  const code = bar.querySelector('button[data-tab="code"]');

  if (code) {
    code.after(btn);
  } else {
    bar.appendChild(btn);
  }
}

export function toggleHeaderTab(win, key) {
  if (key === 'sections' && !headerTabAvailable(win, 'sections')) {
    return;
  }

  const active = sveState.headerTab === key;

  if (key === 'settings') {
    // The icon follows the panel, not the remembered tab. Hidden leaves the tab
    // as "settings" while the sidebar is gone — using that as `active` made the
    // next click close a panel that was already closed.
    const open = sveState.lpCollapsed === false;
    const solo =
      sveState.soloUid != null ||
      !!win.document.querySelector(
        `[${sve.SOLO_KEEP_ATTR || 'data-sve-solo-keep'}], [${sve.SOLO_PARENT_ATTR || 'data-sve-solo-parent'}]`
      );

    // A section is selected: this icon is Page settings, so the first click
    // leaves the section and shows the page — not hide. A second click hides.
    if (open && solo) {
      fireTabClick(win, 1);
      settingsTabPressedAt = Date.now();
      settingsTabTries = 0;
      sve.leaveSolo(win.document, win);
      applySectionsFieldVisibility(win);
      applyHeaderTab(win);

      return;
    }

    sve.setLpMode(win, open ? 'hide' : 'show');
    applyHeaderTab(win);

    return;
  }

  if (key === 'outline') {
    // A docked panel, like the section library — the icon is the whole control,
    // there is nothing to unfold into the header beside it.
    setHeaderTab(win, active ? null : 'outline');
    void (async () => {
      showPanelWait(win, 'outline');

      try {
        await ensurePanel('outline');
      } finally {
        hidePanelWait(win);
      }

      sve.toggleOutlinePanel?.(win);
      sve.persistDockedPanel(win);
      applyHeaderTab(win);
    })();

    return;
  }

  if (key === 'html_tree') {
    setHeaderTab(win, active ? null : 'html_tree');
    void (async () => {
      showPanelWait(win, 'html_tree');

      try {
        await ensurePanel('html_tree');
      } finally {
        hidePanelWait(win);
      }

      sve.toggleHtmlTreePanel?.(win);
      sve.persistDockedPanel(win);
      applyHeaderTab(win);
    })();

    return;
  }

  if (key === 'listview') {
    const open = !!sve.listViewPanel?.(win.document) || isRightPanelInDom(win, 'listview');

    setHeaderTab(win, open ? null : 'listview');
    void (async () => {
      showPanelWait(win, 'listview');

      try {
        await ensurePanel('listview');
      } finally {
        hidePanelWait(win);
      }

      sve.toggleListViewPanel?.(win);
      sve.persistDockedPanel(win);
      applyHeaderTab(win);
    })();

    return;
  }

  if (key === 'sections') {
    // Clicking the icon is an explicit request for the library, so it always
    // opens. The lock only means something still owns the editor — leave it
    // first (chrome, a global section, or both) instead of going dead on the
    // click, which left the icon looking alive but doing nothing.
    const open = !!win.document.getElementById(sve.SECTION_PICKER_ID);

    setHeaderTab(win, open ? null : 'sections');
    void (async () => {
      showPanelWait(win, 'sections');

      try {
        await ensurePanel('sections');
      } finally {
        hidePanelWait(win);
      }

      if (sve.isSectionLibraryLocked?.(win)) {
        sve.dismissChromeForPageEdit?.(win);
        sve.closeGlobalSectionPanel(win);
        sendToPreview({ source: 'statamic-visual-editor', type: 'sve-force-exit-chrome' }, win);
        sendToPreview({ source: 'statamic-visual-editor', type: 'sve-force-exit-global' }, win);
        sve.syncSectionLibraryAvailability(win);
      }

      sve.openSectionPicker?.(win); // toggles
      sve.persistDockedPanel(win);
      applyHeaderTab(win);
    })();

    return;
  }

  // Pages / Globals unfold in the header. They must not close a docked right
  // panel — changing page with the block tree open is a normal move.
  setHeaderTab(win, active ? null : key);
  applyHeaderTab(win);
}

/**
 * The publish tabs (Main / SEO / Sidebar…), mirrored into the header, plus Save.
 *
 * Read from the panel every time rather than remembered: the labels are the
 * blueprint's own, so a renamed tab follows for free, and different collections
 * have different tabs. The panel must be open for the native tabs to exist, which
 * is why this only shows under the settings tab.
 */
export function ensureSettingsTabs(win) {
  const doc = win.document;
  const editor = doc.querySelector('.live-preview-editor');
  const nativeTabs = nativeTabButtons(doc);
  const extra = nativeTabs.slice(1);

  hideNativePublishTabList(doc);

  let bar = doc.getElementById(sve.LP_WIDTH_ID);

  if (!editor || sveState.lpCollapsed) {
    bar?.remove();

    if (editor) {
      editor.style.paddingTop = '';
      delete editor.dataset.sveTabPad;
    }

    return null;
  }

  // Tabs not found this tick (chrome form mid-mount). Keep the last bar —
  // removing it collapses padding and is the jump in the sidebar.
  if (extra.length === 0) {
    return doc.getElementById(SETTINGS_TABS_ID);
  }

  if (!bar) {
    bar = doc.createElement('div');
    bar.id = sve.LP_WIDTH_ID;
    bar.setAttribute('data-sve-settings-bar', '');
    bar.style.cssText =
      'position:fixed;z-index:4;display:flex;align-items:stretch;' +
      'color:currentColor;font-family:inherit;box-sizing:border-box;';
    (doc.querySelector('.live-preview') || doc.body).appendChild(bar);
    win.addEventListener('resize', () => sve.placeLpWidthPicker(win));
  }

  bar.setAttribute('data-sve-settings-bar', '');

  let group = doc.getElementById(SETTINGS_TABS_ID);

  if (!group) {
    group = doc.createElement('div');
    group.id = SETTINGS_TABS_ID;
    bar.appendChild(group);
  }

  group.removeAttribute('data-sve-section-track');
  group.removeAttribute('data-sve-fill');
  group.setAttribute('data-sve-settings-tabs', '');
  group.style.cssText = 'width:100%;max-width:100%;';

  const signature = `text|${extra.map((tabEl) => tabEl.textContent.trim()).join('|')}`;

  if (group.dataset.sig !== signature) {
    group.dataset.sig = signature;
    group.innerHTML = '';

    extra.forEach((tabEl, offset) => {
      const index = offset + 1;
      const btn = doc.createElement('button');

      btn.type = 'button';
      btn.dataset.tabIndex = String(index);
      btn.setAttribute('data-sve-settings-tab', '');
      btn.textContent = tabEl.textContent.trim();
      btn.addEventListener('click', () => {
        const selected = nativeTabButtons(win.document)[index]?.getAttribute('aria-selected') === 'true';

        clickNativeTab(win, selected ? 0 : index);
      });
      group.appendChild(btn);
    });
  }

  const panelOpen = !sveState.lpCollapsed;
  const inSection =
    sveState.soloUid != null ||
    !!doc.querySelector(
      `[${sve.SOLO_KEEP_ATTR || 'data-sve-solo-keep'}], [${sve.SOLO_PARENT_ATTR || 'data-sve-solo-parent'}]`
    );

  group.querySelectorAll('[data-tab-index]').forEach((btn) => {
    const selected =
      !inSection &&
      nativeTabs[Number(btn.dataset.tabIndex)]?.getAttribute('aria-selected') === 'true';

    btn.setAttribute('aria-pressed', panelOpen && selected ? 'true' : 'false');
  });

  return group;
}

export function nativePublishTabList(doc) {
  const editor = doc.querySelector('.live-preview-editor');

  if (!editor) {
    return null;
  }

  const skip = (list) =>
    list.closest('.replicator-fieldtype, .bard-fieldtype, .grid-fieldtype, .grid-table') ||
    list.closest('#__sve-chrome-host, #__sve-global-section-host');

  return (
    [...editor.querySelectorAll('.live-preview-fields [role="tablist"]')].find((list) => !skip(list)) ||
    [...editor.querySelectorAll('[role="tablist"]')].find((list) => !skip(list)) ||
    null
  );
}

/**
 * The publish tabs actually on the entry form — including when solo hides them.
 *
 * reka-ui renders a hidden measurement copy of the tab list, so we take the
 * first real tablist in the editor and skip fieldtype-internal tabs.
 */
export function nativeTabButtons(doc) {
  const list = nativePublishTabList(doc);

  if (!list) {
    return [];
  }

  return [...list.querySelectorAll('button[role="tab"]')];
}

export function hideNativePublishTabList(doc) {
  const list = nativePublishTabList(doc);

  if (list && list.style.display !== 'none') {
    list.style.display = 'none';
  }
}

/**
 * Press the index'th publish tab, and nothing else.
 *
 * reka-ui's tabs switch on the full pointer sequence, not a bare .click(), and
 * they want real PointerEvents. Returns whether there was a tab to press.
 */
export function fireTabClick(win, index) {
  const el = nativeTabButtons(win.document)[index];

  if (!el) {
    return false;
  }

  ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click'].forEach((type) => {
    el.dispatchEvent(new win.PointerEvent(type, { bubbles: true, cancelable: true }));
  });

  return true;
}

/** Switch the editor panel to a publish tab by clicking its real tab button. */
export function clickNativeTab(win, index) {
  const notePress = () => {
    settingsTabPressedAt = Date.now();
    settingsTabTries = 0;
  };

  const fire = () => {
    const tabs = nativeTabButtons(win.document);

    if (tabs[index]?.getAttribute('aria-selected') === 'true') {
      notePress();
      ensureSettingsTabs(win);

      return;
    }

    if (!fireTabClick(win, index)) {
      return;
    }

    notePress();
    setTimeout(() => ensureSettingsTabs(win), 60); // re-highlight the new selection
  };

  // At bede om SEO mens man står inde i en overskrift er også at bede om at komme
  // ud af den: felterne hører til siden, ikke til blokken. Og solo-visningen
  // skjuler fanelisten, så der ville ikke være nogen fane at ramme.
  const leavingSolo = sveState.soloUid !== null;
  let asked = false;

  // Ask for the destination tab while isolation is still on. Dropping solo
  // first painted the sections list (or an empty Main tab) for a frame, and
  // the delayed click then hit Page Settings a second time — a visible jank.
  if (leavingSolo && index > 0) {
    asked = fireTabClick(win, index);
    notePress();
  }

  if (leavingSolo) {
    sve.leaveSolo(win.document, win);
    applySectionsFieldVisibility(win);
  }

  // Asking for a tab means asking to see it — so an open panel is implied. On
  // Hide the panel is closed and its tabs aren't even rendered yet, so switch to
  // Show first and let them mount before clicking. Leaving the mode on Hide while
  // showing a tab would just be a contradiction.
  if (sve.lpMode(win) === 'hide' || sveState.lpCollapsed) {
    sve.setLpMode(win, 'show');
    setTimeout(fire, 140);
  } else if (asked) {
    setTimeout(() => ensureSettingsTabs(win), 60);
  } else {
    fire();
  }
}

/** Show the control for the active tab, hide the rest, light up the active icon. */
/** Hide Statamic's "Live Preview" header label — it names the obvious. */
export function hideLpLabel(doc) {
  const header = sve.lpHeader(doc);

  if (!header) {
    return;
  }

  const label = [...header.querySelectorAll('*')].find(
    (el) => !el.firstElementChild && /^(live preview|forhåndsvisning)$/i.test((el.textContent || '').trim())
  );

  if (label && label.style.display !== 'none') {
    label.style.display = 'none';
  }
}

export function applyHeaderTab(win) {
  const doc = win.document;

  warmLivePreviewCore(win);
  loadHeaderTab(win);
  hideLpLabel(doc);
  ensureCodeDockToolbarButton(win);
  ensureSiteCssToolbarButton(win);
  ensureCommentsToolbarButton(win);
  ensurePageEditsToolbarButton(win);
  ensureAiToolbarButton(win);
  ensureOutlineToolbarButton(win);
  ensureHtmlTreeToolbarButton(win);

  // The standalone panel glyph and the old Hide/Auto/Show group are gone.
  const glyph = doc.getElementById(sve.LP_TOGGLE_ID);

  if (glyph) {
    glyph.style.display = 'none';
  }

  doc.getElementById(sve.LP_MODE_ID)?.remove();

  // The sections icon in the toolbar replaces the old "Sektioner" text button.
  const lib = doc.getElementById(sve.LIBRARY_BUTTON_ID);

  if (lib) {
    lib.style.display = 'none';
  }

  // Publish-fanerne er ikke med her: de er flyttet ned i panelets bundlinje, ved
  // siden af breddevælgeren — se sve.ensureLpWidthPicker.
  const controls = {
    pages: doc.getElementById(sve.COLLECTION_PICKER_ID)?.parentElement,
    globals: doc.getElementById(sve.GLOBALS_PICKER_ID)?.parentElement,
  };

  const headerBg = sve.lpHeaderBg(win) || 'rgba(0,0,0,.35)';

  // A control whose tool is off stays hidden whatever the active tab is — its
  // icon is gone, so there would be no way back out of it.
  Object.entries(controls).forEach(([key, el]) => {
    if (el) {
      el.style.display = sveState.headerTab === key && headerTabAvailable(win, key) ? 'inline-flex' : 'none';
    }
  });

  // MERGED frames (Pages / Globals): one group surface for icon + controls.
  // Icon itself stays transparent so it doesn’t stack a second pill on top.
  FRAMED_TABS.forEach((key) => {
    const frame = doc.getElementById(frameId(key));
    const seam = doc.getElementById(seamId(key));
    const expanded = sveState.headerTab === key && headerTabAvailable(win, key);

    if (frame) {
      // Kun toolbar-gap mellem items — ingen ekstra margin når feltet er foldet ud.
      frame.style.margin = '0';

      if (MERGED_TABS.includes(key)) {
        frame.style.background = 'transparent';
        frame.style.height = '';
        frame.style.padding = '0';
        frame.style.gap = '6px';
      }

      // Låsen sidder på feltet, ikke på glyffen inde i det. Sider og Globals bærer
      // deres flade på rammen, så da kun glyffen blev dæmpet, stod de to tilbage
      // som oplyste piller ved siden af et sektionsikon der var gået helt ud:
      // halvdelen af rækken så ud til stadig at kunne klikkes. Værktøjet er feltet,
      // så det er feltet der går ud.
      const locked = sve.isSectionLibraryLocked?.(win) && sve.FOCUS_LOCKED_TABS?.includes(key);

      frame.style.opacity = locked ? sve.LP_ICON_LOCKED_OPACITY : '';
      frame.style.pointerEvents = locked ? 'none' : '';
    }

    if (seam) {
      seam.style.display = 'none';
    }
  });

  // Det man trykker på, det der er valgt, og hver søm har topbarens farve. Sat her
  // og ikke der hvor de bygges, så et CP-temaskift rammer dem alle samtidig.
  // New-page bruger flat primary (ikke inset) — spring den over.
  doc.querySelectorAll('[data-sve-inset],[data-sve-seam]').forEach((el) => {
    if (el.id === sve.NEW_ENTRY_ID) {
      return;
    }

    el.style.backgroundColor = headerBg;
  });

  const newEntry = doc.getElementById(sve.NEW_ENTRY_ID);

  if (newEntry) {
    newEntry.style.background = sve.LP_PRIMARY_FLAT;
    newEntry.style.color = '#fff';
    newEntry.style.border = 'none';
    newEntry.style.boxShadow = 'none';
    newEntry.style.opacity = '1';
  }

  // Each control sits directly after the icon it belongs to, so it reads as
  // connected to it. Guarded — moving a node on every call would trip the
  // observer that re-runs this into a loop.
  const bar = doc.getElementById(HEADER_TOOLBAR_ID);

  if (bar && bar.dataset.sveChrome !== 'group-1') {
    bar.dataset.sveChrome = 'group-1';
    bar.style.cssText = `${HEADER_GROUP_STYLE}gap:4px;margin-right:${LP_TOOLBAR_GAP}px;`;
  }

  if (bar) {
    bar.style.setProperty(
      '--sve-toolbar-ring',
      `color-mix(in srgb, rgb(128 128 128) 16%, ${headerBg})`
    );
  }

  const sectionsBtn = bar?.querySelector('button[data-tab="sections"]');

  if (sectionsBtn) {
    const show = headerTabAvailable(win, 'sections');

    sectionsBtn.style.display = show ? 'inline-flex' : 'none';

    if (!show && sveState.headerTab === 'sections') {
      setHeaderTab(win, null);
      sve.closeSectionPicker?.(win);
    }
  }

  const iconOf = (tab) => bar?.querySelector(`button[data-tab="${tab}"]`);
  const place = (anchor, el) => {
    if (anchor && el && anchor.nextElementSibling !== el) {
      anchor.after(el);
    }
  };

  // I de sammensatte felter sættes kontrollen efter sømmen, ikke efter ikonet —
  // ellers ville den lande foran stregen der skiller dem.
  const anchorFor = (key) => doc.getElementById(seamId(key)) || iconOf(key);

  place(anchorFor('pages'), controls.pages);
  place(anchorFor('globals'), controls.globals);

  // A tab whose "open" state is a panel on screen is lit by that panel, not by
  // the remembered tab. The tab outlives the panel — it is stored, so it survives
  // a reload, and a closed panel under a lit icon is the icon telling a lie about
  // what is in front of you.
  const docked = {
    sections: !!doc.getElementById(sve.SECTION_PICKER_ID),
    listview: !!sve.listViewPanel?.(doc),
    outline: !!doc.getElementById(sve.OUTLINE_PANEL_ID),
    html_tree: !!doc.getElementById(sve.HTML_TREE_PANEL_ID),
    comments: !!sve.commentsPanel?.(doc),
    ai: isAiPanelOpen(doc),
  };

  // Only the icon buttons — the control groups now live inside the toolbar too,
  // and a bare querySelectorAll('button') would reach in and wipe the highlight
  // off Hide/Auto/Show and the tabs. `[data-tab]` er nok til at skelne, og
  // panelikonet ligger et niveau nede i sin egen ramme.
  syncToolbarIcons(doc);

  const sidebarOpen = sveState.lpCollapsed === false;

  bar?.querySelectorAll('button[data-tab]').forEach((btn) => {
    const tab = btn.dataset.tab;
    const on =
      tab === 'settings'
        ? sidebarOpen
        : tab === 'code'
          ? isCodeDockArmed(win)
          : tab === 'site_css'
            ? isSiteCssOpen(win.document)
          : tab === 'edits'
            ? !!sve.pageEditsOpen?.()
          : tab === 'globals'
            ? sveState.headerTab === 'globals' || !!sve.isGlobalsOverlayOpen?.(win)
          : tab in docked
            ? docked[tab]
            : tab === sveState.headerTab;

    if (btn.style.width !== '28px') {
      btn.style.width = '28px';
      btn.style.height = `${LP_CONTROL_H}px`;
      btn.style.borderRadius = '.375rem';
      btn.style.padding = '0';
    }

    sve.paintLpActiveControl(btn, on);
    sve.paintFocusLockedTabs?.(win, btn, tab, on);
  });

  syncToolbarIconSeps(bar);
  alignHeaderToolbarWithSidebar(win);
}

/**
 * Line the left top-bar icons up with the sidebar content (H tile, section rows,
 * tabs). Measure the content’s left edge and set header padding — more reliable
 * than shifting only the toolbar, which drifted when the mode group expanded.
 */
/** Whether this opening of the editor has already been sent into a section. */
export let firstSectionOpened = false;

/**
 * The page-sections field's own wrapper in the editor panel.
 *
 * Found by walking up from any section to the last element before
 * `.publish-fields` — that container holds every field on the tab, so its child
 * is the outermost thing that is still only this field. Measured rather than
 * guessed at a class name: `replicator-fieldtype` is on the nested replicators
 * too, and hiding one of those would take a section's own blocks with it.
 */
export function sectionsFieldWrapper(doc) {
  const editor = doc.querySelector('.live-preview-editor');
  const set = editor?.querySelector(SELECTORS.replicatorSet);

  if (!set) {
    return null;
  }

  let node = set;

  while (node.parentElement && !node.parentElement.classList?.contains('publish-fields')) {
    node = node.parentElement;

    if (node === editor) {
      return null; // no publish-fields on the way up — not the shape we expect
    }
  }

  return node.parentElement ? node : null;
}

/**
 * Takes the list of every section out of the sidebar.
 *
 * Only while nothing is open: a section's fields render inside this same
 * wrapper, so hiding it whenever the flag is on would hide the section you are
 * editing along with the list of the ones you are not.
 */
export function applySectionsFieldVisibility(win) {
  const doc = win.document;
  const wrapper = sectionsFieldWrapper(doc);

  if (!wrapper) {
    return;
  }

  const hide =
    sve.featureOn(win, 'open_first_section')
    && sve.focusPanelOn(win)
    && !doc.querySelector(`[${sve.SOLO_KEEP_ATTR}], [${sve.SOLO_PARENT_ATTR}]`);

  wrapper.style.display = hide ? 'none' : '';
}

/**
 * Opens the entry in its first section rather than on the list of all of them.
 *
 * Off unless the site asks for it (Addons → Visual Editor). Where the work
 * begins is a matter of how a team uses the editor: a page of three sections is
 * quicker from the list, a page of twenty is not.
 *
 * Once per opening, and never over a choice already made — a click that arrives
 * before this runs is the editor's answer to where you want to be, and it wins.
 */
export function openFirstSectionOnce(win) {
  const doc = win.document;
  const editor = doc.querySelector('.live-preview-editor');

  // The editor is gone, so this is between openings: arm it for the next one.
  if (!editor) {
    firstSectionOpened = false;

    return;
  }

  if (firstSectionOpened || !sve.featureOn(win, 'open_first_section') || !sve.focusPanelOn(win)) {
    return;
  }

  // Something is already soloed — a click got here first, and it says more about
  // where the author wants to be than a default does.
  if (doc.querySelector(`[${sve.SOLO_KEEP_ATTR}], [${sve.SOLO_PARENT_ATTR}]`)) {
    firstSectionOpened = true;

    return;
  }

  const field = sve.sectionField?.(win) || 'page_sections';

  for (const container of sve.activeContainers(doc)) {
    const values = sve.unwrapRef(container.values);
    const rows = values && typeof values === 'object' ? values[field] : null;

    if (!Array.isArray(rows)) {
      continue;
    }

    // A page with no sections has nothing to open onto, and an empty panel is
    // worse than none — so it starts closed and the preview has the window to
    // itself until there is something to edit.
    if (!rows.length) {
      firstSectionOpened = true;
      sve.setLpMode(win, 'show');

      return;
    }

    // The values arrive before the form that draws them. Soloing then hides a
    // list of sets that do not exist yet and leaves the panel blank — which is
    // exactly what it did. This runs again on every pass of the header loop, so
    // declining now costs a frame and nothing else.
    if (!editor.querySelector(SELECTORS.replicatorSet)) {
      return;
    }

    const uid = sve.blockRowUid?.(rows[0]) || rows[0]?._visual_id || rows[0]?.id || rows[0]?._id || '';

    if (!uid) {
      return;
    }

    firstSectionOpened = true;
    sve.focusFromPreview(uid, doc, win);

    return;
  }
}

/** When the panel was last moved off the sections tab — see openSettingsTab. */
export let settingsTabPressedAt = 0;

/** Presses in a row that didn't take. Cleared the moment one does. */
export let settingsTabTries = 0;

/**
 * With nothing open in the panel, keeps it off the sections tab.
 *
 * The first publish tab holds the page sections, and those are edited on the page
 * itself — where the site opens straight into its first section, the list is even
 * taken out of the panel, which is what leaves the tab empty. So with nothing
 * selected in the preview, that tab is a blank column where the page's own
 * settings should be. Moving on one tab is what stops the panel from being empty.
 *
 * Not once per opening but on every pass of the header loop: "nothing is
 * selected" is a state the editor returns to — closing a section, stepping out of
 * the header, arriving on another page — and the panel should be useful every
 * time it does, not only the first.
 */
export function openSettingsTab(win) {
  const doc = win.document;

  if (!doc.querySelector('.live-preview-editor')) {
    settingsTabTries = 0;

    return;
  }

  // The one thing that counts as "something is selected": a section or a block
  // isolated in the panel. Its fields are on the first tab, so this must never
  // pull the panel off it while one is open.
  //
  // Nothing else is asked about. An earlier version also stood down for the
  // header, the footer and the globals panel, and that was simply wrong: the
  // globals panel is built and parked off screen the moment Live Preview opens,
  // so its element is always in the document and the rule never ran once.
  if (sveState.soloUid !== null || doc.querySelector(`[${sve.SOLO_KEEP_ATTR}], [${sve.SOLO_PARENT_ATTR}]`)) {
    settingsTabTries = 0; // closing this again is a fresh question, not a retry

    return;
  }

  const tabs = nativeTabButtons(doc);

  // The form hasn't drawn its tabs yet, or the blueprint has only the one and
  // there is nowhere to move on to.
  if (tabs.length < 2) {
    return;
  }

  // Off the sections tab already — which is the whole point, so there is nothing
  // to do and nothing to keep counting.
  if (tabs[0].getAttribute('aria-selected') !== 'true') {
    settingsTabTries = 0;

    return;
  }

  // This runs on every pass of the header loop, so a press that doesn't take
  // would have us pressing again on every mutation. Slowed to one attempt per
  // half second, and given up on after three: if the tab won't move, something
  // else is holding it and a click every half second forever is worse than
  // leaving it where it is.
  const now = Date.now();

  if (settingsTabTries >= 3 || now - settingsTabPressedAt < 500) {
    return;
  }

  settingsTabPressedAt = now;
  settingsTabTries += 1;

  fireTabClick(win, 1);
  setTimeout(() => ensureSettingsTabs(win), 60); // light the tab we just moved to
}

/**
 * Hand the field column back to the page, and let it land somewhere real.
 *
 * Stepping out of a header, a footer or a global section leaves the page's own
 * form with nothing isolated — and where the site opens straight into its first
 * section, the list of all of them is hidden while nothing is, so what is left is
 * a blank column. Arming the flag again is the whole fix: the next pass of the
 * header loop treats leaving exactly like an opening, which means the first
 * section, or a closed panel on a page that has none.
 *
 * Deliberately not a focus call of its own. Leaving and opening are the same
 * question — "where does the editor start?" — and answering it twice is how the
 * two drift apart.
 */
export function rearmFirstSection() {
  firstSectionOpened = false;
}


/**
 * Writes the starting values a template declared for a block, where the block
 * has none.
 *
 * `controls="tag:h2|font_size:text-600"` says what this *place* on the page
 * starts a block on. The toolbar has always drawn itself from that; the side
 * panel could not, because it renders the Statamic form and the form has never
 * seen the template. So the value is made real instead of pretended: written
 * once, and from then on it is simply the block's value, which is why all three
 * — form, toolbar and page — agree about it afterwards.
 *
 * Only ever into an empty field. A block that already says something keeps
 * saying it; nothing that exists is replaced. That is also what makes this safe
 * to run on every click rather than only on the first.
 *
 * It marks the entry dirty, which is honest: the block now holds a value it did
 * not hold before, and it should be saved.
 */
export function applyDeclaredDefaults(data, doc) {
  const declared = Array.isArray(data.controlDefaults) ? data.controlDefaults : [];
  const uid = data.scope || data.uid;

  if (!declared.length || !uid) {
    return;
  }

  for (const container of sve.activeContainers(doc)) {
    const values = sve.unwrapRef(container.values);

    if (!values || typeof values !== 'object') {
      continue;
    }

    const found = sve.rowLocation(values, uid);

    if (!found) {
      continue;
    }

    const { parentPath, index, rows } = found;
    const row = rows[index];

    if (!row) {
      return;
    }

    const blank = (v) => v === undefined || v === null || v === '' || (Array.isArray(v) && !v.length);
    const missing = declared.filter((c) => blank(row[c.handle]));

    if (!missing.length) {
      return;
    }

    const next = JSON.parse(JSON.stringify(rows));

    // The declaration is text — `controls="uppercase:true"` cannot say what type
    // it means. A toggle wants a real boolean, and would store the string
    // "false" as a truthy value, which is the one wrong answer that looks right.
    const typed = (v) => (v === 'true' ? true : v === 'false' ? false : v);

    missing.forEach((c) => {
      next[index][c.handle] = typed(c.default);
    });

    container.setFieldValue(parentPath, next);

    return;
  }
}

/**
 * Luften fra vinduets kant ind til topbarens første/sidste kontrol.
 *
 * Samme 12px som sidebares indhold (`padding-inline` på højre dock og på
 * Page Settings/SEO-fanerne), så ikonerne står på linje med det der er
 * under dem — ikke Statamics gamle 1.75rem/1rem til "Live Preview"-etiketten.
 */
export const LP_TOOLBAR_LEFT = '12px';
export const LP_TOOLBAR_EDGE = '12px';

export function alignHeaderToolbarWithSidebar(win) {
  const doc = win.document;
  const header = sve.lpHeader(doc);
  const bar = doc.getElementById(HEADER_TOOLBAR_ID);
  const editor = doc.querySelector('.live-preview-editor');

  if (!header || !bar || !editor) {
    return;
  }

  if (LP_TOOLBAR_LEFT !== null) {
    if (header.style.paddingLeft !== LP_TOOLBAR_EDGE) {
      header.style.paddingLeft = LP_TOOLBAR_EDGE;
    }

    if (header.style.paddingRight !== LP_TOOLBAR_EDGE) {
      header.style.paddingRight = LP_TOOLBAR_EDGE;
    }

    return;
  }

  // Panel off-screen (Hide) — don’t chase a bogus left edge.
  const editorRect = editor.getBoundingClientRect();

  if (editorRect.width < 40 || editorRect.left < -500) {
    return;
  }

  const candidates = [
    doc.querySelector('[data-sve-focus-tile]'),
    doc.querySelector('[data-tabs-track], [data-sve-section-track]'),
    editor.querySelector('.replicator-set'),
    editor.querySelector('[data-sve-solo-back], [data-sve-focus-head]'),
  ].filter((el) => el && el.getClientRects().length);

  let targetLeft = null;

  if (candidates.length) {
    targetLeft = Math.min(...candidates.map((el) => el.getBoundingClientRect().left));
  } else {
    const pad = parseFloat(win.getComputedStyle(editor).paddingLeft) || 0;

    targetLeft = editorRect.left + pad;
  }

  if (targetLeft == null) {
    return;
  }

  // Drop the old margin approach so we don’t double-offset.
  if (bar.style.marginLeft) {
    bar.style.marginLeft = '';
  }

  const barLeft = bar.getBoundingClientRect().left;
  const delta = targetLeft - barLeft;

  if (Math.abs(delta) < 0.5) {
    return;
  }

  const computed = parseFloat(win.getComputedStyle(header).paddingLeft) || 0;
  const current = header.style.paddingLeft ? parseFloat(header.style.paddingLeft) || 0 : computed;
  const next = Math.max(0, Math.round(current + delta));

  if (Math.abs(next - current) >= 0.5) {
    header.style.paddingLeft = `${next}px`;
  }
}


// ===== grid-rows =====
// --- Grid rows: collapse to a title, one open at a time ------------------------
//
// Statamic's Grid (stacked) shows every row's fields in full, which eats the
// editor panel when a grid has several rows. This turns each row into an
// accordion item — the header collapses to a one-line title (the first field's
// value), and opening one closes the others — the way the Replicator already
// behaves. Rows are Statamic's own DOM: a `.grid-stacked > <panel>` with a
// `<header>` (drag handle + duplicate/delete) and a fields body beside it. We
// only mark and toggle; Vue keeps owning the DOM.

export const GRID_ROW_ATTR = 'data-sve-grid-row';
export const GRID_COLLAPSED_ATTR = 'data-sve-grid-collapsed';
export const GRID_DONE_ATTR = 'data-sve-grid-done';
export const GRID_STYLE_ID = 'sve-grid-accordion-style';

export function ensureGridStyle(doc) {
  if (doc.getElementById(GRID_STYLE_ID)) {
    return;
  }

  const style = doc.createElement('style');

  style.id = GRID_STYLE_ID;
  style.textContent = `
    [${GRID_ROW_ATTR}] > header { cursor: pointer; }
    [${GRID_ROW_ATTR}][${GRID_COLLAPSED_ATTR}] > *:not(header) { display: none !important; }
    [${GRID_ROW_ATTR}][${GRID_COLLAPSED_ATTR}] > header { border-bottom-color: transparent; }
    .sve-grid-title {
      flex: 1 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
      font-size: 13px; font-weight: 500; opacity: .7; padding: 0 10px; pointer-events: none;
    }
    [${GRID_ROW_ATTR}]:not([${GRID_COLLAPSED_ATTR}]) .sve-grid-title { opacity: 0; }
    .sve-grid-chevron {
      flex: 0 0 auto; width: 14px; height: 14px; opacity: .5; transition: transform .15s;
      pointer-events: none; margin-left: 4px;
    }
    [${GRID_ROW_ATTR}][${GRID_COLLAPSED_ATTR}] .sve-grid-chevron { transform: rotate(-90deg); }
  `;
  doc.head.appendChild(style);
}

/** Prefer text / textarea / Bard — skip icons, assets, empty controls, etc. */
export const GRID_TITLE_SKIP = [
  'assets-fieldtype',
  'button_group-fieldtype',
  'button-group-fieldtype',
  'toggle-fieldtype',
  'revealer-fieldtype',
  'date-fieldtype',
  'integer-fieldtype',
  'float-fieldtype',
  'range-fieldtype',
  'color-fieldtype',
  'auto_uuid-fieldtype',
  'iconamic-fieldtype',
  'iconify-fieldtype',
  'link-fieldtype',
  'section-fieldtype',
  'spacer-fieldtype',
  'hidden-fieldtype',
];

/**
 * Collapsed-row label: first non-empty text, textarea or Bard value.
 * (The previous "first input" approach hit empty icon fields and showed "—".)
 */
export function gridRowTitle(row) {
  try {
    const fields = row.querySelectorAll('.publish-fields input, .publish-fields textarea');

    for (const field of fields) {
      const type = (
        field.getAttribute('type') ||
        (field.tagName === 'TEXTAREA' ? 'textarea' : 'text')
      ).toLowerCase();

      if (!['text', 'search', 'url', 'email', 'tel', 'textarea'].includes(type)) {
        continue;
      }

      const wrapper = field.closest('[class*="-fieldtype"]');

      if (wrapper && GRID_TITLE_SKIP.some((name) => wrapper.classList.contains(name))) {
        continue;
      }

      const value = (field.value || '').replace(/\s+/g, ' ').trim();

      if (value) {
        return value.length > 80 ? `${value.slice(0, 77)}…` : value;
      }
    }

    for (const editable of row.querySelectorAll(
      '.publish-fields .ProseMirror, .publish-fields [contenteditable="true"]',
    )) {
      const value = (editable.textContent || '').replace(/\s+/g, ' ').trim();

      if (value) {
        return value.length > 80 ? `${value.slice(0, 77)}…` : value;
      }
    }
  } catch {
    // never break Live Preview over a label scrape
  }

  return '—';
}

export function setGridRowCollapsed(row, collapsed) {
  if (collapsed) {
    row.setAttribute(GRID_COLLAPSED_ATTR, '');
  } else {
    row.removeAttribute(GRID_COLLAPSED_ATTR);
  }

  const title = row.querySelector(':scope > header .sve-grid-title');

  if (!title) {
    return;
  }

  // Only write when the text actually changes — writing on every LP mutation
  // observer pass caused an infinite loop and froze Live Preview.
  const next = collapsed ? gridRowTitle(row) : '';

  if (title.textContent !== next) {
    title.textContent = next;
  }
}

/** True for a real Grid stacked row panel — it carries a header of its own. */
export function isGridRow(el) {
  return el.matches('div') && !!el.querySelector(':scope > header');
}

export function enhanceGridRow(win, row, stacked) {
  if (row.hasAttribute(GRID_ROW_ATTR)) {
    return;
  }

  const header = row.querySelector(':scope > header');

  if (!header) {
    return;
  }

  row.setAttribute(GRID_ROW_ATTR, '');

  const doc = win.document;
  const title = doc.createElement('span');

  title.className = 'sve-grid-title';

  const chevron = doc.createElement('span');

  chevron.className = 'sve-grid-chevron';
  chevron.innerHTML =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" ' +
    'stroke-linecap="round" stroke-linejoin="round" style="width:100%;height:100%;">' +
    '<polyline points="6 9 12 15 18 9"></polyline></svg>';

  // Title fills the middle of the header; the chevron sits at the far end. The
  // drag handle stays first, the duplicate/delete buttons stay last.
  const firstButton = header.querySelector(':scope > button');

  if (firstButton && firstButton.nextSibling) {
    header.insertBefore(title, firstButton.nextSibling);
  } else {
    header.appendChild(title);
  }

  header.appendChild(chevron);

  header.addEventListener('click', (event) => {
    // The drag handle and the duplicate/delete buttons keep their own jobs.
    if (event.target.closest('button')) {
      return;
    }

    const opening = row.hasAttribute(GRID_COLLAPSED_ATTR);

    if (opening) {
      [...stacked.children].forEach((sibling) => {
        if (sibling !== row && sibling.hasAttribute(GRID_ROW_ATTR)) {
          setGridRowCollapsed(sibling, true);
        }
      });
    }

    setGridRowCollapsed(row, !opening);
  });

  // Rows start collapsed; the grid opens its first one below. Set once, so a
  // later re-render never fights the state the user has clicked into.
  setGridRowCollapsed(row, true);

  // Vue often fills Title a beat later. One quiet retry only if still "—",
  // and only if the text would change (avoids mutation-observer loops).
  win.setTimeout(() => {
    if (!row.isConnected || !row.hasAttribute(GRID_COLLAPSED_ATTR)) {
      return;
    }

    const label = row.querySelector(':scope > header .sve-grid-title');

    if (!label || label.textContent !== '—') {
      return;
    }

    const next = gridRowTitle(row);

    if (next !== '—' && label.textContent !== next) {
      label.textContent = next;
    }
  }, 500);
}

/**
 * Turns every Grid (stacked) in the editor panel into an accordion. Runs on each
 * LP re-render; already-enhanced rows are skipped, so user-chosen open/closed
 * states survive. A freshly seen grid starts with only its first row open.
 */
export function enhanceGrids(win) {
  const doc = win.document;
  const editor = doc.querySelector('.live-preview-editor');

  if (!editor) {
    return;
  }

  ensureGridStyle(doc);

  editor.querySelectorAll('.grid-stacked').forEach((stacked) => {
    const rows = [...stacked.children].filter((el) => isGridRow(el));

    if (!rows.length) {
      return;
    }

    // enhanceGridRow starts each row collapsed (once). New rows added later
    // therefore arrive collapsed without disturbing the rows already on screen.
    rows.forEach((row) => enhanceGridRow(win, row, stacked));

    // A grid seen for the first time opens its first row, so it isn't a wall of
    // closed headers — but only if the user hasn't already opened one.
    if (!stacked.hasAttribute(GRID_DONE_ATTR)) {
      stacked.setAttribute(GRID_DONE_ATTR, '');

      if (!rows.some((row) => !row.hasAttribute(GRID_COLLAPSED_ATTR))) {
        setGridRowCollapsed(rows[0], false);
      }
    }
  });
}

export const LP_BACK_ID = '__sve-lp-back';

/** How long to wait for a save to come back before giving the button up again. */
export const LP_SAVE_TIMEOUT = 15000;

/**
 * Leaving the editor publishes what you changed. Clicking Statamic's own
 * save/publish buttons rather than posting to the API ourselves, so validation,
 * revisions and everything else behave exactly as they do from the CP.
 *
 * Revisions off → one click on "Save & Publish" (unchanged).
 * Revisions on  → save the working copy, then POST publish automatically (no
 * Publish dialog), then leave.
 *
 * Pass `{ publish: false }` to only save the working copy and stay in the editor.
 *
 * Nothing changed → leave straight away (unless save-only). A save that fails
 * puts the button back and keeps you in the editor, where the error is.
 */
export function leaveEditor(win, link, leave, { publish = true } = {}) {
  if (link.dataset.busy) {
    return;
  }

  const save = sve.saveButtonIn(win.document);
  const hasPublish = !!sve.publishButtonIn(win.document);
  const saveOnly = hasPublish && !publish;
  const entryDirty = sve.hasUnsavedChanges(win);
  const globalsDirty = sve.hasUnsavedGlobals(win);
  const sectionDirty = sve.hasUnsavedGlobalSection(win);

  if (!save && !globalsDirty && !sectionDirty) {
    if (!saveOnly) {
      leave();
    }

    return;
  }

  if (!entryDirty && !globalsDirty && !sectionDirty) {
    if (saveOnly) {
      return;
    }

    // Nothing to write — just leave. Do NOT auto-publish a clean working copy;
    // that trapped users on "Saving…" when dirty detection was sticky, and it
    // showed save/publish actions when the form had no real edits.
    leave();

    return;
  }

  runBusy(win, link, (release, setLabel) => {
    setLabel(t(win, 'saving'));

    if (!saveOnly) {
      postToHost(win, 'lp-leaving');
    }

    const finishAfterEntry = (ok) => {
      if (!ok) {
        release();

        return;
      }

      if (saveOnly) {
        release();
      } else {
        sve.leaveQuietly(win, leave);
      }
    };

    const saveEntry = () => {
      if (!entryDirty || !save) {
        finishAfterEntry(true);

        return;
      }

      let settled = false;

      const stop = sve.onEntrySave((ok) => {
        if (settled) {
          return;
        }

        // Revisions off, or save-only: one step.
        if (!hasPublish || saveOnly) {
          settled = true;
          stop();
          clearTimeout(timer);
          finishAfterEntry(ok);

          return;
        }

        // Revisions on + publish: working-copy save done — publish without a dialog.
        settled = true;
        stop();
        clearTimeout(timer);

        if (!ok) {
          release();

          return;
        }

        // Save just succeeded — refresh the clean baseline so leave isn't
        // blocked by sticky $dirty, and value-diff matches the saved form.
        sve.markEntryFormClean(win);

        publishWorkingCopy(win, {
          onSuccess: () => sve.leaveQuietly(win, leave),
          onFailure: release,
          onPublishing: () => setLabel(t(win, 'publishing')),
          afterSave: true,
        });
      });

      const timer = setTimeout(() => {
        if (settled) {
          return;
        }

        settled = true;
        stop();
        release();
      }, LP_SAVE_TIMEOUT);

      save.click();
    };

    // Theme Settings / global section first — entry save can navigate away.
    sve.saveGlobalsPanel(win, (ok) => {
      if (!ok) {
        release();

        return;
      }

      sve.saveGlobalSectionPanel(win, (sectionOk) => {
        if (!sectionOk) {
          release();

          return;
        }

        saveEntry();
      });
    });
  });
}

/** Marks the back-pill busy, runs `work`, and gives it release/setLabel helpers. */
export function runBusy(win, link, work) {
  const label = link.querySelector('span');
  const original = label?.textContent;

  link.dataset.busy = '1';
  link.style.pointerEvents = 'none';
  link.style.opacity = '.5';

  const setLabel = (text) => {
    if (label) {
      label.textContent = text;
    }
  };

  const release = () => {
    delete link.dataset.busy;
    link.style.pointerEvents = '';
    link.style.opacity = '.8';

    if (label && original) {
      label.textContent = original;
    }

    link.sveCollapse?.();
  };

  work(release, setLabel);
}

/**
 * Statamic's publish endpoint for the open entry — same URL the Publish dialog
 * posts to (`…/entries/{id}/publish`).
 */
export function entryPublishUrl(win) {
  return `${win.location.pathname.replace(/\/$/, '')}/publish`;
}

/**
 * Publish the working copy with no dialog — the same POST Statamic's "Publish
 * Now" makes, minus the notes field.
 *
 * Waits until the Publish button is enabled so we never race the preceding
 * Save Changes. Pass `afterSave: true` when the working copy was just written
 * — then skip the dirty-form wait (sticky $dirty used to block leave forever).
 */
export function publishWorkingCopy(win, { onSuccess, onFailure, onPublishing, afterSave = false } = {}) {
  let settled = false;
  let enableTimer = null;
  let attempts = 0;

  const finish = (ok) => {
    if (settled) {
      return;
    }

    settled = true;
    clearTimeout(enableTimer);
    clearTimeout(timer);
    (ok ? onSuccess : onFailure)?.();
  };

  const tryPublish = () => {
    if (settled) {
      return;
    }

    const button = sve.publishButtonIn(win.document);
    // After an explicit save we already cleared dirty marks — only wait for the
    // Publish button to enable (Statamic may still be finishing its UI update).
    const blocked = afterSave
      ? button?.disabled === true
      : sve.hasUnsavedChanges(win) || button?.disabled === true;

    if (blocked) {
      if (++attempts > 50) {
        // Don't trap the user on "Saving…": after a successful save, leave even
        // if Publish never lit up; otherwise report failure.
        finish(!!afterSave);

        return;
      }

      enableTimer = win.setTimeout(tryPublish, 100);

      return;
    }

    onPublishing?.();

    const rearm = sve.disarmUnloadWarning(win);

    win
      .fetch(entryPublishUrl(win), {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'X-CSRF-TOKEN': sve.csrfToken(win),
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({ message: null }),
      })
      .then(async (response) => {
        const data = await response.json().catch(() => ({}));
        const ok = response.ok && data.saved !== false;

        if (!ok) {
          rearm();
        }

        finish(ok);
      })
      .catch(() => {
        rearm();
        finish(false);
      });
  };

  const timer = win.setTimeout(() => finish(false), LP_SAVE_TIMEOUT);

  tryPublish();
}

/**
 * Close Live Preview — replaces Statamic’s ×. Same leave flow as before
 * (save/publish menu when dirty). Styled like the left icon pills so the whole
 * bar shares one height and surface.
 */
export const LP_BACK_MENU_ID = '__sve-lp-back-menu';

export const LP_BACK_ICON_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" ' +
  'stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
  '<path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>';

const LP_MENU_ICON =
  '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" ' +
  'stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">';

const LP_BACK_ADMIN_ICON_SVG =
  LP_MENU_ICON +
  '<rect width="20" height="14" x="2" y="3" rx="2"></rect>' +
  '<path d="M8 21h8"></path>' +
  '<path d="M12 17v4"></path></svg>';

const LP_BACK_SITE_ICON_SVG =
  LP_MENU_ICON +
  '<rect x="3" y="3" width="18" height="18" rx="2"></rect>' +
  '<path d="M3 8h18"></path>' +
  '<path d="M7 14h7"></path>' +
  '<path d="m11 11 3 3-3 3"></path></svg>';


export function isOurLpChromeButton(button) {
  return (
    !button ||
    button.id === LP_BACK_ID ||
    button.id === '__sve-lp-more' ||
    !!button.closest?.(`#${LP_BACK_ID}`) ||
    !!button.closest?.('#__sve-lp-more') ||
    !!button.closest?.(`#${HEADER_TOOLBAR_ID}`) ||
    !!button.closest?.(`#${LP_PREVIEW_CHROME_ID}`) ||
    !!button.closest?.(`#${sve.LP_MODE_ID}`) ||
    !!button.closest?.(`#${RIGHT_DOCK_ID}`) ||
    button.hasAttribute?.('data-sve-close')
  );
}

/** True for Statamic’s Live Preview exit (×) — not Save / devices / our close. */
export function isStatamicLpCloseButton(button) {
  if (isOurLpChromeButton(button)) {
    return false;
  }

  const label = `${button.getAttribute('aria-label') || ''} ${button.title || ''} ${button.textContent || ''}`.trim();

  if (/\b(save|gem|publish|publicér|visit|besøg|pop\s*out|pop\s*ud)\b/i.test(label)) {
    return false;
  }

  if (/\b(close|luk|exit|afslut)\b/i.test(label)) {
    return true;
  }

  const text = (button.textContent || '').replace(/\s+/g, '').trim();
  const html = button.innerHTML || '';

  // Lucide / Heroicons “X” paths, or a bare × glyph.
  if (
    button.querySelector('svg') &&
    (text === '' || text === '×' || text === '✕' || text === 'x' || text === 'X') &&
    (/M18\s*6|m6\s*6\s*12\s*12|M6\s*6\s*L18|line\s+x1=["']18["']/i.test(html) ||
      text === '×' ||
      text === '✕' ||
      text === 'x' ||
      text === 'X')
  ) {
    return true;
  }

  return text === '×' || text === '✕';
}

/** Statamic’s header close (×) — kept in the DOM so leaveLivePreview can click it. */
export function findLpCloseButton(header) {
  if (!header) {
    return null;
  }

  const marked = header.querySelector('[data-sve-statamic-lp-close]');

  if (marked) {
    return marked;
  }

  const candidates = collectStatamicLpCloseButtons(header);

  return candidates[candidates.length - 1] || null;
}

export function collectStatamicLpCloseButtons(header) {
  if (!header) {
    return [];
  }

  const save = sve.findLpSaveButton(header);
  const scope =
    header.closest('.live-preview, [data-live-preview], .live-preview-ui') || header;
  const buttons = [...scope.querySelectorAll('button')].filter((button) => !isOurLpChromeButton(button));

  return buttons.filter((button) => {
    // Prefer buttons after Save & Publish — that is where Statamic puts ×.
    if (save && header.contains(button)) {
      const afterSave = !!(save.compareDocumentPosition(button) & Node.DOCUMENT_POSITION_FOLLOWING);

      if (!afterSave && !isStatamicLpCloseButton(button)) {
        return false;
      }
    }

    return isStatamicLpCloseButton(button);
  });
}

export function markStatamicLpCloseHidden(close) {
  if (!close || close.id === LP_BACK_ID || isOurLpChromeButton(close)) {
    return;
  }

  close.setAttribute('data-sve-statamic-lp-close', '');
  close.classList.add('sve-off');
  close.style.setProperty('display', 'none', 'important');
  close.style.setProperty('visibility', 'hidden', 'important');
  close.style.setProperty('pointer-events', 'none', 'important');
  close.style.setProperty('width', '0', 'important');
  close.style.setProperty('min-width', '0', 'important');
  close.style.setProperty('height', '0', 'important');
  close.style.setProperty('padding', '0', 'important');
  close.style.setProperty('margin', '0', 'important');
  close.style.setProperty('margin-left', '0', 'important');
  close.style.setProperty('margin-right', '0', 'important');
  close.style.setProperty('flex', '0 0 0', 'important');
  close.style.setProperty('overflow', 'hidden', 'important');
  close.setAttribute('aria-hidden', 'true');
  close.tabIndex = -1;
}

export function hideStatamicLpClose(header) {
  if (!header) {
    return;
  }

  // Hide every match — Vue sometimes leaves a duplicate, and a single miss
  // is exactly the “× only goes away after I click a section” bug.
  collectStatamicLpCloseButtons(header).forEach(markStatamicLpCloseHidden);

  // Fallback: last icon button in the header after Save (even without a label).
  const save = sve.findLpSaveButton(header);

  if (!save) {
    return;
  }

  [...header.querySelectorAll('button')]
    .filter((button) => !isOurLpChromeButton(button))
    .filter((button) => !!(save.compareDocumentPosition(button) & Node.DOCUMENT_POSITION_FOLLOWING))
    .filter((button) => {
      const text = (button.textContent || '').replace(/\s+/g, '').trim();

      return (text === '' || text === '×' || text === '✕') && button.querySelector('svg');
    })
    .forEach(markStatamicLpCloseHidden);
}

/** Keep Statamic’s × gone across Vue re-renders of the Live Preview header. */
export function watchStatamicLpClose(win) {
  const header = sve.lpHeader(win.document);

  if (!header) {
    sveState.lpCloseHideObserver?.disconnect();
    sveState.lpCloseHideObserver = null;

    return;
  }

  hideStatamicLpClose(header);

  if (sveState.lpCloseHideObserver) {
    return;
  }

  let scheduled = false;

  sveState.lpCloseHideObserver = new win.MutationObserver(() => {
    if (scheduled) {
      return;
    }

    scheduled = true;
    win.requestAnimationFrame(() => {
      scheduled = false;
      const live = sve.lpHeader(win.document);

      if (!live) {
        sveState.lpCloseHideObserver?.disconnect();
        sveState.lpCloseHideObserver = null;

        return;
      }

      hideStatamicLpClose(live);
    });
  });

  sveState.lpCloseHideObserver.observe(header, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class', 'style', 'hidden'],
  });
}

/**
 * Keep the back control after Save & Publish (where × sat). No floating geometry —
 * the preview no longer needs to dodge a pill over the canvas.
 */
export function positionLpBackButton(win) {
  const doc = win.document;
  const pill = doc.getElementById(LP_BACK_ID);
  const header = sve.lpHeader(doc);

  if (!pill || !header) {
    return;
  }

  hideStatamicLpClose(header);

  const save = sve.findLpSaveButton(header);

  if (save && pill.previousElementSibling !== save) {
    save.after(pill);
  } else if (!save && pill.parentElement !== header) {
    header.appendChild(pill);
  }

  // Clear any leftover floating styles from older builds.
  ['position', 'top', 'right', 'bottom', 'left', 'box-shadow', 'padding'].forEach((prop) => {
    if (pill.style.getPropertyValue(prop)) {
      pill.style.removeProperty(prop);
    }
  });

  sve.syncLpRightBarGaps(win);
  tellPreviewWherePillIs(win, pill);
}

/**
 * Hands the preview the pill's box. When the control lives in the header it does
 * not overlap the iframe — send an empty box so hover chrome stops dodging.
 */
export function tellPreviewWherePillIs(win, pill) {
  const frame = sve.previewFrame(win.document);

  if (!frame) {
    return;
  }

  if (!pill) {
    sendToPreview(
      { source: 'statamic-visual-editor', type: 'sve-pill-box', bottom: 0, left: 99999 },
      win
    );

    return;
  }

  const f = frame.getBoundingClientRect();
  const r = pill.getBoundingClientRect();
  const overlaps =
    r.bottom > f.top && r.top < f.bottom && r.right > f.left && r.left < f.right;

  if (!overlaps) {
    sendToPreview(
      { source: 'statamic-visual-editor', type: 'sve-pill-box', bottom: 0, left: 99999 },
      win
    );

    return;
  }

  sendToPreview(
    {
      source: 'statamic-visual-editor',
      type: 'sve-pill-box',
      bottom: Math.round(r.bottom - f.top),
      left: Math.round(r.left - f.left),
    },
    win
  );
}

/** Tear down the back control (and its menu) when Live Preview closes. */
export function removeLpBackButton(doc) {
  doc.getElementById(LP_BACK_MENU_ID)?.remove();
  doc.getElementById(LP_BACK_ID)?.remove();
  doc.getElementById('__sve-lp-more-menu')?.remove();
  doc.getElementById('__sve-lp-more')?.remove();
  sve.clearEntryBaseline();
}

/**
 * Close control in the top bar after Save & Publish. Opens a short menu:
 * back to admin, or back to the live site. Unsaved work is asked about after.
 */
export function ensureLpBackButton(win) {
  const doc = win.document;
  const header = sve.lpHeader(doc);

  if (!header) {
    return;
  }

  hideStatamicLpClose(header);

  let pill = doc.getElementById(LP_BACK_ID);

  if (!pill) {
    pill = doc.createElement('button');
    pill.id = LP_BACK_ID;
    pill.type = 'button';
    pill.style.cssText = `${LP_ICON_BTN_STYLE}flex-shrink:0;`;

    pill.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();

      sve.dismissLpMoreMenu?.();

      if (doc.getElementById(LP_BACK_MENU_ID)) {
        dropMenu(doc.getElementById(LP_BACK_MENU_ID));

        return;
      }

      openLpBackMenu(win, pill);
    });

    header.appendChild(pill);
  }

  // Keep icon current across builds (curved arrow → ×).
  if (pill.innerHTML !== LP_BACK_ICON_SVG) {
    pill.innerHTML = LP_BACK_ICON_SVG;
  }

  pill.title = t(win, 'close_live_preview_title');
  pill.setAttribute('aria-label', pill.title);
  pill.style.opacity = '1';
  pill.style.background = '#3f3f46';
  pill.style.width = `${LP_CHROME_H}px`;
  pill.style.height = `${LP_CHROME_H}px`;
  pill.style.borderRadius = '.5rem';
  pill.style.marginLeft = '0';
  pill.style.marginRight = '0';

  positionLpBackButton(win);
  // Idempotent: no-ops once the session already has a clean snapshot.
  sve.scheduleEntryBaseline(win);
}

/**
 * Leave Live Preview the way you entered it:
 * - Embedded → close overlay onto the entry's front-end URL.
 * - Opened from a listing → back to that listing.
 * - Otherwise → close Live Preview and stay in admin.
 */
export function leaveLivePreview(win, fallbackUrl = null) {
  if (isEmbeddedInSite(win)) {
    const visitNow = [...win.document.querySelectorAll('a')].find((a) =>
      /visit url|besøg url/i.test(a.textContent || '')
    );
    const url = visitNow?.getAttribute('href') || fallbackUrl || null;

    postToHost(win, 'lp-close', url ? { url } : {});

    return;
  }

  // Never reached the publish form on the way in, so it is not somewhere to be
  // put down on the way out: the way back is the list the entry was clicked in.
  const origin = sve.originForCurrentEntry(win);

  if (origin) {
    sve.forgetOrigin(win);
    leaveToOrigin(win, origin);

    return;
  }

  closeLivePreviewUi(win);
}

/**
 * Back to the screen the entry was opened from.
 *
 * By the time this runs the unsaved question has been put and answered — every
 * path into `leave()` does that first — so the only thing left in the way is
 * Statamic's own guard, which is still holding the marks it was answered about.
 */
export function leaveToOrigin(win, url) {
  const router = win.__STATAMIC__?.inertia?.router;

  sve.dismissDirtyWarning(win);

  if (!router?.visit) {
    win.location.href = url;

    return;
  }

  router.visit(url);
}

/** Click Statamic's Live Preview × so we stay on the admin entry form. */
export function closeLivePreviewUi(win) {
  const header = sve.lpHeader(win.document);
  const close = findLpCloseButton(header);

  // Settling on the form is an answer to "where does this end", so a later × on
  // a preview reopened by hand should not still be pointing at a listing.
  sve.forgetOrigin(win);

  // Temporarily reveal so .click() works even while we keep × hidden in the UI.
  if (close) {
    const wasHidden = close.style.getPropertyValue('display') === 'none';

    if (wasHidden) {
      close.style.removeProperty('display');
    }

    close.click();

    if (wasHidden) {
      close.style.setProperty('display', 'none', 'important');
    }
  }
}

/** Public URL of the open entry, from Visit URL or the preview iframe. */
export function visitUrlOf(win) {
  const visit = [...win.document.querySelectorAll('a')].find((a) =>
    /visit url|besøg url/i.test(a.textContent || '')
  );
  const href = visit?.getAttribute('href');

  if (href) {
    return href;
  }

  try {
    const src = win.document.getElementById('live-preview-iframe')?.getAttribute('src');

    if (!src) {
      return null;
    }

    const url = new URL(src, win.location.origin);

    url.searchParams.delete('live-preview');
    url.searchParams.delete('preview');

    return url.pathname === '/' && !url.search ? null : url.href;
  } catch {
    return null;
  }
}

/** Overlay host is the Control Panel listing/form, not the live site. */
export function hostIsControlPanel(win) {
  try {
    return /\/cp(\/|$)/.test(win.top.location.pathname);
  } catch {
    return !isEmbeddedInSite(win);
  }
}

export function goTop(win, url) {
  try {
    win.top.location.href = url;
  } catch {
    win.location.href = url;
  }
}

/**
 * Collection listing for the open entry — never the entry publish form.
 *
 * With open-in-preview, the form is not a place anyone came from. The way
 * back to admin is the collection (or the listing that opened the overlay).
 */
export function collectionListingUrl(win) {
  const origin = sve.originForCurrentEntry(win);

  if (origin) {
    try {
      const path = new URL(origin, win.location.origin).pathname;

      if (/\/cp(\/|$)/.test(path) && !sve.ENTRY_EDIT_PATH.test(path)) {
        return origin;
      }
    } catch {
      /* ignore */
    }
  }

  const match = win.location.pathname.match(/\/collections\/([^/]+)\/entries\//);

  if (match) {
    return `${win.location.origin}/cp/collections/${match[1]}`;
  }

  return `${win.location.origin}/cp`;
}

/** Leave the visual editor and land on the collection listing. */
export function leaveToAdmin(win) {
  sve.dismissDirtyWarning(win);

  // Overlay sits on the CP listing (or dashboard): just lift it.
  if (isEmbeddedInSite(win) && hostIsControlPanel(win)) {
    postToHost(win, 'lp-close');

    return;
  }

  const listing = collectionListingUrl(win);

  sve.forgetOrigin(win);

  if (isEmbeddedInSite(win)) {
    postToHost(win, 'lp-close', listing ? { url: listing } : {});

    return;
  }

  leaveToOrigin(win, listing);
}

/** Leave the visual editor and land on the public page. */
export function leaveToFrontend(win) {
  sve.dismissDirtyWarning(win);
  const url = visitUrlOf(win);

  if (isEmbeddedInSite(win) && !hostIsControlPanel(win)) {
    postToHost(win, 'lp-close', url ? { url } : {});

    return;
  }

  if (url) {
    goTop(win, url);

    return;
  }

  leaveToAdmin(win);
}

/** Save or discard first when the form is dirty, then run `leave`. */
export function confirmLeaveIfDirty(win, leave) {
  if (!sve.hasUnsavedWork(win)) {
    leave();

    return;
  }

  sve.confirmUnsaved(
    win,
    () => {
      sve.saveGlobalsPanel(win, (ok) => {
        if (!ok) {
          return;
        }

        sve.saveGlobalSectionPanel(win, (sectionOk) => {
          if (!sectionOk) {
            return;
          }

          if (!sve.hasUnsavedChanges(win) || !sve.saveButtonIn(win.document)) {
            sve.leaveQuietly(win, leave);

            return;
          }

          sve.saveThenNavigate(win, leave);
        });
      });
    },
    () => {
      sve.discardChanges(win);
      sve.discardGlobalsChanges(win);
      sve.clearSectionsStash(win, { refresh: false });
      leave();
    }
  );
}

/**
 * Widths, pins and docks only — not the page. Does not reload, so unsaved
 * work in the form stays put.
 */
export function resetEditorLayout(win) {
  closeCodeDock(win.document);
  setCodeDockArmed(win, false);
  sve.closeRightPanels(win);

  sveState.listViewTab = 'tree';
  sveState.headerTab = null;
  sveState.lpEnterSidebarClosed = true;
  sveState.lpCollapsed = true;
  sveState.dockedHeaderRestored = true;

  const editor = win.document.querySelector('.live-preview-editor');

  if (editor) {
    editor.style.position = 'absolute';
    editor.style.left = '-10000px';
    editor.style.top = '0';
    editor.style.width = `${sve.remToPx(win, sve.LP_SIDE_DEFAULT_REM)}px`;
  }

  applyLpDevice(win, 'Responsive');
  applyLpZoom(win, LP_ZOOM_DEFAULT);
  clearChromePrefs(win);
  sve.persistLpWidth(win, sve.remToPx(win, sve.LP_SIDE_DEFAULT_REM));
  chromeSet(win, sve.LP_MODE_KEY, 'hide');
  chromeSet(win, sve.LP_COLLAPSED_KEY, '1');
  chromeSet(win, LP_DEVICE_KEY, 'Responsive');
  chromeSet(win, LP_ZOOM_KEY, String(LP_ZOOM_DEFAULT));
  chromeSet(win, 'sve-listview-tab', 'tree');

  relayoutRightDock(win);
  relayoutCodeDock(win);
  relayoutAiPanel(win);
  sve.syncPreviewInset(win);
  applyHeaderTab(win);
  paintLpPreviewChrome(win);
  sve.ensureLpPanelToggle(win);
}

/** Close menu: admin or the live site — Save/Publish stay on the header buttons. */
export function openLpBackMenu(win, pill) {
  const doc = win.document;

  sve.dismissLpMoreMenu?.();
  dropMenu(doc.getElementById(LP_BACK_MENU_ID));
  const menu = doc.createElement('div');
  const rect = pill.getBoundingClientRect();

  menu.id = LP_BACK_MENU_ID;
  menu.style.cssText =
    `position:fixed;z-index:2147483001;top:${Math.round(rect.bottom + 8)}px;` +
    `right:${Math.round(win.innerWidth - rect.right)}px;width:max-content;` +
    'display:flex;flex-direction:column;padding:5px;border-radius:10px;' +
    'background:#343439;box-shadow:0 12px 40px rgba(0,0,0,.55),0 0 0 1px rgba(255,255,255,.12);' +
    'font:500 13px/1.2 ui-sans-serif,system-ui,sans-serif;';

  const item = (label, title, iconSvg, onClick) => {
    const btn = doc.createElement('button');
    const icon = doc.createElement('span');
    const text = doc.createElement('span');

    btn.type = 'button';
    btn.title = title;
    btn.style.cssText =
      'all:unset;box-sizing:border-box;cursor:pointer;display:flex;align-items:center;gap:8px;' +
      'padding:9px 12px;border-radius:7px;white-space:nowrap;color:rgba(255,255,255,.88);';
    icon.setAttribute('aria-hidden', 'true');
    icon.style.cssText = 'display:inline-flex;flex-shrink:0;opacity:.85;';
    icon.innerHTML = iconSvg;
    text.textContent = label;
    btn.append(icon, text);
    btn.addEventListener('mouseenter', () => (btn.style.background = '#2c2c31'));
    btn.addEventListener('mouseleave', () => (btn.style.background = 'transparent'));
    btn.addEventListener('click', (event) => {
      event.stopPropagation();
      dropMenu(menu);
      onClick();
    });
    menu.appendChild(btn);
  };

  item(t(win, 'back_to_admin'), t(win, 'back_to_admin_title'), LP_BACK_ADMIN_ICON_SVG, () => {
    confirmLeaveIfDirty(win, () => leaveToAdmin(win));
  });
  item(t(win, 'back_to_site'), t(win, 'back_to_site_title'), LP_BACK_SITE_ICON_SVG, () => {
    confirmLeaveIfDirty(win, () => leaveToFrontend(win));
  });

  doc.body.appendChild(menu);
  menu.tabIndex = -1;
  menu.style.outline = 'none';

  const dismiss = () => dropMenu(menu);

  menu._sveUnbind = bindMenuDismiss(
    win,
    (target) => menu.contains(target) || pill.contains(target),
    dismiss
  );

  menu.focus();
}


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
  for (const container of sve.activeContainers(doc)) {
    const values = sve.unwrapRef(container.values);

    if (!values || typeof values !== 'object') {
      continue;
    }

    const path = sve.findPathByUid(values, uid);

    if (path === null) {
      continue;
    }

    const dot = path.lastIndexOf('.');

    if (dot === -1) {
      return;
    }

    const parentPath = path.slice(0, dot);
    const index = Number(path.slice(dot + 1));
    const initial = sve.dataGet(values, parentPath);

    if (!Array.isArray(initial) || !Number.isInteger(index)) {
      return;
    }

    const startLength = initial.length;
    let attempts = 0;

    const poll = () => {
      const current = sve.dataGet(sve.unwrapRef(container.values), parentPath);

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
  void ensurePanel('sections').then(() => sve.openSectionPicker?.(win));
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
    sve.watchNewRow(doc, win, data, (container, values, parentPath, added) => {
      sve.overlaySidTemplate(win, container, values, parentPath, added, data.template, data.fieldDefaults);
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
    const frame = doc.getElementById(sve.GLOBAL_SECTION_PANEL_ID)?.querySelector('iframe');

    if (frame?.contentWindow) {
      const forward = (extra = {}) =>
        frame.contentWindow.postMessage(
          { ...data, ...extra, source: 'statamic-visual-editor', type: 'sve-section-add-block' },
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
        sve.handleInsertBlock(
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

      sve.handleInsertBlock(
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
          sve.handleInsertBardSet(
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

  if (scope && sve.autoOpenPanel(win)) {
    sve.soloSection(topLevelSectionUid(scope, doc) || scope, doc, win);
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
 * sve.sectionPanelContainer on the parent.
 */
export function globalSectionEditorDoc(doc) {
  // Edited in this window there is no panel, so this is null and every caller
  // works in `doc` — exactly as it does for one of the page's own sections.
  const frame = doc.getElementById(sve.GLOBAL_SECTION_PANEL_ID)?.querySelector('iframe');

  try {
    return frame?.contentDocument || null;
  } catch {
    return null;
  }
}

export function globalSectionEditorWin(win) {
  const frame = win.document.getElementById(sve.GLOBAL_SECTION_PANEL_ID)?.querySelector('iframe');

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

    if (!data || data.source !== 'statamic-visual-editor') {
      return;
    }

    if (data.type === 'click') {
      if (data.htmlPath) {
        ask('html-tree:from-preview', { path: data.htmlPath });

        return;
      }

      // Synced section: focus/solo runs inside the left iframe (source entry),
      // not the page form — those uids are not on this page.
      if (sve.forwardGlobalSectionFocus(data, doc, win)) {
        return;
      }

      // Normal page click while the synced-section editor is still up: put the
      // page form back so the sidebar matches the section being edited.
      if (sve.globalSectionEditorOpen(doc) && !data.global) {
        sve.closeGlobalSectionPanel(win);
        sve.previewFrame(doc)?.contentWindow?.postMessage(
          { source: 'statamic-visual-editor', type: 'sve-force-exit-global' },
          win.location.origin
        );
      }

      // Whatever the click turns out to mean below, the tree should show where it
      // landed. Placed here, before the branching, because the branches lead to
      // different functions — a field click with the focus panel on never reaches
      // `sve.focusFromPreview` — and "the preview reported a click" is true of all of
      // them exactly once.
      sve.listViewSyncTo?.(win, data.scope, data.uid);
      applyDeclaredDefaults(data, doc);

      // Template dock follows the section in publish values. Opening the left
      // panel is a different question (`autoOpenPanel`); collapsing that pane
      // must not skip the file load.
      const dockUid = data.uid || data.scope;

      if (dockUid) {
        sve.syncCodeDock?.(win, doc, dockUid);
      }

      if (data.field) {
        // Open what the field belongs to. With the focus panel on that is the
        // block holding it; without it, the top-level section — a nested block
        // passes its row id as scope, which still expands below via
        // handleFieldFocus.
        if (data.scope && sve.autoOpenPanel(win)) {
          if (sve.focusPanelOn(win)) {
            sve.focusFieldOwner(data.field, data.scope, doc, win);
          } else {
            sve.focusFromPreview(data.scope, doc, win, { clampToSection: true });
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
      } else if (sve.autoOpenPanel(win)) {
        // Clicking a section opens the panel showing ONLY that section. Falls
        // back to plain focus (e.g. nested rows without a resolvable set).
        if (!sve.focusFromPreview(data.uid, doc, win)) {
          handleFocus(data.uid, doc, data.afterSetUid, data.uidIndex ?? 0);
        }
      }
    } else if (data.type === 'edit-request') {
      sve.handleEditRequest(data, doc, win);
    } else if (data.type === 'edit-input') {
      sve.handleEditInput(data, doc);
    } else if (data.type === 'edit-control') {
      sve.handleEditControl(data);
    } else if (data.type === 'theme-swatches-request') {
      sve.handleThemeSwatchesRequest(data, win);
    } else if (data.type === 'edit-end') {
      sve.handleEditEnd(data, win);
    } else if (data.type === 'block-format') {
      sve.handleBlockFormat(data, doc);
    } else if (data.type === 'outline') {
      sve.handleOutline(data, win);
    } else if (data.type === 'open-panel-field') {
      // Pencil / "finish in panel": focus the field in the synced-section iframe
      // when that is the active editor — same path as a preview click.
      const iwin = globalSectionEditorWin(win);

      if (iwin && sve.editSession?.container?.name === 'sve-global-section' && sve.editSession.field) {
        sve.setLpCollapsed(win, false);
        iwin.postMessage(
          {
            source: 'statamic-visual-editor',
            type: 'sve-section-focus',
            uid: sve.editSession.scope || null,
            field: sve.editSession.field,
          },
          win.location.origin
        );

        return;
      }

      sve.handleOpenPanelField(data, doc, win);
    } else if (data.type === 'bard-command') {
      const idoc = globalSectionEditorDoc(doc);

      if (idoc && sve.editSession?.container?.name === 'sve-global-section') {
        sve.handleBardCommand(data, idoc, globalSectionEditorWin(win) || win);
      } else {
        sve.handleBardCommand(data, doc, win);
      }
    } else if (data.type === 'asset-edit') {
      const idoc = globalSectionEditorDoc(doc);

      sve.handleAssetEdit(data, idoc || doc);
    } else if (data.type === 'icon-edit') {
      const idoc = globalSectionEditorDoc(doc);

      sve.handleIconEdit(data, idoc || doc, win);
    } else if (data.type === 'link-edit') {
      const idoc = globalSectionEditorDoc(doc);
      const iwin = globalSectionEditorWin(win);

      if (idoc && iwin && sve.editSession?.container?.name === 'sve-global-section') {
        sve.handleLinkEdit(data, idoc, iwin);
      } else {
        sve.handleLinkEdit(data, doc, win);
      }
    } else if (data.type === 'move') {
      sve.handleMove(data, doc);
    } else if (data.type === 'add-set') {
      handleAddSet(data, doc, win);
    } else if (data.type === 'cb-col-width') {
      sve.handleColumnWidth(data, doc);
    } else if (data.type === 'sve-grid-span') {
      sve.handleGridSpan(data, doc, win);
    } else if (data.type === 'open-global') {
      sve.handleOpenGlobal(data, doc, win);
    } else if (data.type === 'open-chrome') {
      sve.handleOpenChrome(data, doc, win);
    } else if (data.type === 'open-chrome-designs') {
      sve.setChromeSidebarMode(win, 'design');
    } else if (data.type === 'open-chrome-settings') {
      sve.setChromeSidebarMode(win, 'settings');
    } else if (data.type === 'close-chrome') {
      // Stepping out of header/footer (e.g. clicking a page section): free the
      // left edge so the section editor isn't stacked under Theme Settings.
      sve.dismissChromeForPageEdit?.(win);
    } else if (data.type === 'request-close-chrome') {
      sve.handleRequestCloseChrome(win);
    } else if (data.type === 'sve-chrome-dirty-query') {
      sve.notifyChromeDirty(win);
    } else if (data.type === 'save-chrome') {
      // The bar's Save, driving whichever form is actually holding the edits.
      // Sent straight to the panel iframe, it went to Theme Settings as the
      // background prefetch had loaded it — a form that had never seen the edit
      // — and saved that instead.
      sve.saveGlobalsPanel(win, () => {});
    } else if (data.type === 'add-row') {
      sve.handleAddRow?.(data, doc, win);
    } else if (data.type === 'add-block-native') {
      // Preview "+": open Statamic's real SetPicker, pin list under the plus.
      handleAddBlockNative(data, doc, win);
    } else if (data.type === 'add-bard-set-native') {
      handleAddBardSetNative(data, doc, win);
    } else if (data.type === 'insert-bard-set') {
      sve.handleInsertBardSet?.(data, doc, win);
    } else if (data.type === 'remove-row') {
      // A section is asked about first. It takes one click to remove and holds
      // everything inside it, and the page it leaves behind looks like a page
      // that was always that way — there is nothing on screen to tell you what
      // is gone. A row is small and sits in view of its siblings, so it goes
      // straight away, as it always has.
      if (data.confirm) {
        sve.confirmCloseDiscard(
          win,
          {
            titleKey: 'remove_section_title',
            bodyKey: 'remove_section_body',
            confirmKey: 'remove_section_confirm',
          },
          () => sve.handleRemoveRow(data, doc, win)
        );
      } else {
        sve.handleRemoveRow(data, doc, win);
      }
    } else if (data.type === 'duplicate-row') {
      sve.handleDuplicateRow(data, doc, win);
    } else if (data.type === 'hide-row') {
      sve.handleHideRow(data, doc, win);
    } else if (data.type === 'row-caps') {
      sve.handleRowCaps(data, doc, win);
    } else if (data.type === 'open-global-section') {
      sve.handleOpenGlobalSection(data, win);
    } else if (data.type === 'sve-pill-box-request') {
      const pill = doc.getElementById(LP_BACK_ID);

      if (pill) {
        tellPreviewWherePillIs(win, pill);
      }
        } else if (data.type === 'close-global-section') {
      sve.closeGlobalSectionPanel(win);
    } else if (data.type === 'request-close-global') {
      sve.handleRequestCloseGlobal(win);
    } else if (data.type === 'sve-global-dirty-query') {
      sve.notifyGlobalSectionDirty(win);
    } else if (data.type === 'save-global-section') {
      // The bar's Save, driving the entry form's real one — wherever it lives.
      sve.saveGlobalSectionPanel(win, () => {});
    } else if (data.type === 'section-settings') {
      sve.handleSectionSettings(data, doc, win);
    } else if (data.type === 'save-section') {
      sve.handleSaveSection(data, doc, win);
    } else if (data.type === 'ext-drop') {
      // A section dragged in from the library was released — insert it where the
      // preview's drop line ended up (data.afterUid, null = at the top).
      if (sveState.libraryDrag) {
        sve.insertSection?.(win, doc, data.afterUid ?? null, sveState.libraryDrag.kind, sveState.libraryDrag.item);
        sveState.libraryDrag = null;
      }
    } else if (data.type === 'cb-add-column') {
      sve.handleAddColumn(data, doc, win);
    } else if (data.type === 'popup') {
      // A column popup is opening (the column-builder addon handles that) —
      // expand and scroll the publish form to the containing section, so the
      // form behind the popup shows where you are when it closes again.
      if (data.sectionUid) {
        handleFocus(data.sectionUid, doc);
      }
    } else if (data.type === 'hover') {
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
  background: ${HEADER_ICON_HOVER} !important;
  opacity: 1 !important;
}
#${LP_BACK_ID}:hover {
  background: rgba(128, 128, 128, .4) !important;
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
      { source: 'statamic-visual-editor', type, ...data },
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
      if (isEmbeddedInSite(win) || sve.livePreviewEditorEl(win.document)) {
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
    const frame = sve.previewFrame(win.document);
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

  cover.id = sve.LP_COVER_ID;
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
    const frame = sve.previewFrame(win.document);
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

  doc.getElementById(sve.LP_COVER_ID)?.remove();

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
    if (doc.getElementById(sve.LP_COVER_ID) === cover) {
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
    sve.claimOrigin(win);
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

  // Kick Theme Settings load as early as possible (cover is up — free bandwidth).
  sve.scheduleChromeGlobalsPrefetch(win);

  let cover = null;

  // An in-app move has already put a cover up — one holding a still of the page it
  // left. Looked for whether or not we're embedded: when the editor is running in
  // the site's overlay, this is the only code that ever takes that cover down, and
  // it blocks clicks while it's up. Missing it here strands the whole editor
  // behind a photograph.
  cover = doc.getElementById(sve.LP_COVER_ID);

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
    sve.hideNavSpinner(win);

    if (embedded) {
      // Chrome must already be in place when the overlay fades in — otherwise
      // the right sidebar / bottom dock jumps in a beat later.
      sveState.dockRestorePaused = false;
      sveState.dockedHeaderRestored = false;

      try {
        restoreDockedHeaderPanels(win);
        sve.pinDockedPanelsUnderHeader(win);
      } catch (err) {
        console.error('[sve] restoreDockedHeaderPanels', err);
      }

      postToHost(win, 'lp-ready');
    }

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
    sve.closeRightPanels(win);
    sve.setLpCollapsed(win, true);
  } else {
    // Live Preview opens with the editor panel following the remembered mode —
    // hide/auto arrive closed (looking like the site, not a CMS); an explicitly
    // chosen `show` is respected.
    sve.setLpCollapsed(win, sve.lpMode(win) !== 'show');
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
      void ensurePanel('sections').then(() => sve.openSectionPicker?.(win, options || {}));
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

  sve.registerRightDockContent?.();

  const style = win.document.createElement('style');
  style.id = '__sve-cp-styles';
  style.textContent = CP_STYLES;
  win.document.head.appendChild(style);

  win.addEventListener('resize', () => {
    relayoutCodeDock(win);
    relayoutAiPanel(win);
    relayoutRightDock(win);
    sve.syncPreviewInset(win);
  });
  win.addEventListener('sve-right-dock-change', () => {
    sve.persistDockedPanel(win);
    sve.syncPreviewInset(win);
    applyHeaderTab(win);
  });
  win.addEventListener('sve-ai-closed', () => {
    sve.syncPreviewInset(win);
    applyHeaderTab(win);
  });

  autoOpenLivePreview(win);
  interceptLivePreviewOpen(win);
  sve.initOpenInPreview(win);
  sve.watchEntrySaves(win);
  sve.watchPreviewRenders(win);
  guardAssetLimit(win);
  sve.listenForGlobalsValues(win);
  sve.listenForSectionValues(win);

  // Capture publish containers BEFORE the sve-panel frame boots. The panel's
  // sve.bootSavedSectionSolo / value poll need sve.activeContainers(); if we register
  // listeners after the panel starts, the container-created event is missed and
  // the sidebar stays on empty entry meta (Published + title) forever.
  sve.registerContainerEvents(win);

  // Running as the globals panel inside Live Preview: strip to the form and
  // stream its values up. None of the Live Preview machinery below applies.
  // The same frame serves a global section's editor — see sve.initGlobalsPanelFrame.
  if (!sve.initGlobalsPanelFrame(win)) {
    // Parent CP window — start warming Theme Settings immediately on entry edit,
    // so it's ready before the user even opens Live Preview.
    sve.scheduleChromeGlobalsPrefetch(win);
  }

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
      sve.ensureLpPanelToggle(win);
      // Live Preview mounts (and remounts) its iframe from here — bind the
      // click-outside forward to whichever one is on screen now.
      sve.ensurePreviewOutsideDismiss(win);
      sve.markStepIntoAll(win);
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

          sendToPreview({ source: 'statamic-visual-editor', type: 'hover', field: fieldKey, scope: scope || undefined }, win);
        }

        return;
      }

      if (lastCpHoverUid !== null) {
        lastCpHoverUid = null;
        sendToPreview({ source: 'statamic-visual-editor', type: 'hover', uid: null }, win);
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
      sendToPreview({ source: 'statamic-visual-editor', type: 'hover', uid, afterSetUid }, win);

      return;
    }

    if (uid === lastCpHoverUid) {
      return;
    }

    lastCpHoverUid = uid;
    sendToPreview({ source: 'statamic-visual-editor', type: 'hover', uid }, win);
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
          sendToPreview({ source: 'statamic-visual-editor', type: 'focus', field: fieldKey, scope: scope || undefined }, win);

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

    const message = { source: 'statamic-visual-editor', type: 'focus', uid };

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
export function replayLivePreview(win, opts) {
  return sve.replayLivePreview(win, opts);
}
