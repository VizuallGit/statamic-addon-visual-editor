/**
 * cp.js — region "sets", split out in WP5. Same statements, same order;
 * only the imports are new. See the barrel cp.js for what the shell exports.
 */
import { ACTIVE_ATTR, COLLAPSE_SETTLE_MS, HIGHLIGHT_CLASS, HIGHLIGHT_DURATION, SELECTORS } from '../cp-selectors.js';
import { revealSegmentsFor } from '../cp-section-groups.js';
import { FOCUS_STEP_ATTR } from '../lib/ids.js';
import { dataGet, findPathByUid, unwrapRef } from '../lib/values.js';
import { activeContainers } from '../lib/publish-containers.js';
import { setGridRowCollapsed } from './grid-rows.js';
import { scrollBardToTextAfterSet } from './add-section.js';

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
  // — otherwise bootSavedSectionSolo / focus never opens and the sidebar stays
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

  for (const container of activeContainers(doc)) {
    const values = unwrapRef(container.values);

    if (!values || typeof values !== 'object') {
      continue;
    }

    const path = findPathByUid(values, uid);

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
  for (const container of activeContainers(doc)) {
    const values = unwrapRef(container.values);

    if (!values || typeof values !== 'object') {
      continue;
    }

    const path = findPathByUid(values, uid);

    if (path === null) {
      continue;
    }

    const row = dataGet(values, path);

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

  for (const container of activeContainers(doc)) {
    const values = unwrapRef(container.values);

    if (!values || typeof values !== 'object') {
      continue;
    }

    const path = findPathByUid(values, uid);

    if (!path) {
      continue;
    }

    const match = path.match(/^([^.]+)\.(\d+)/);

    if (!match) {
      continue;
    }

    const section = dataGet(values, `${match[1]}.${match[2]}`);

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
      (el) => el.matches('button[type="button"]') && !el.hasAttribute(FOCUS_STEP_ATTR)
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
