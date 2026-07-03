// Control Panel script — handles postMessage routing from the Live Preview iframe.

export const SELECTORS = {
  visualIdInput: '[data-visual-id]',
  replicatorSet: '[data-replicator-set]',
  // Bard sets are Tiptap node views; Statamic 6 renders them with [data-node-view-wrapper].
  // There is no [data-bard-set] attribute in the actual CP DOM.
  bardSet: '[data-node-view-wrapper]',
  // Grid rows are stamped with [data-grid-row] by stampGridRows() — they have no
  // native Statamic attribute. Detection relies on the structural pattern: a
  // parent element whose direct <header> child contains a [data-drag-handle] button.
  gridRow: '[data-grid-row]',
  anySet: '[data-replicator-set], [data-node-view-wrapper], [data-grid-row]',
  // Actual toggle: a <button type="button"> that is a direct child of the <header>
  // inside the set. Neither .replicator-set-header nor .bard-set-header exist.
  headerToggle: 'header > button[type="button"]',
};

const HIGHLIGHT_CLASS = 'sve-highlight';
const ACTIVE_ATTR = 'data-sve-active';
const HIGHLIGHT_DURATION = 2000; // ms — matches the sve-highlight-pulse @keyframes animation duration
// Matches the CSS collapse/expand transition duration on Statamic's Replicator/Bard sets.
// Defer scroll/highlight until after this period so scrollIntoView uses the final layout.
// Update this if Statamic's collapse transition duration ever changes.
const COLLAPSE_SETTLE_MS = 300;

/**
 * Walks up from a [data-visual-id] input looking for a Grid row container.
 *
 * Two cases are handled:
 * 1. Replicator/Bard sets: nearest ancestor with a direct <header> child
 *    containing a [data-drag-handle] button.
 * 2. Grid table rows (Statamic v6 GridTable): the <tr> element inside a
 *    <tbody> inside a <table class="grid-table">. The Grid's drag handle is
 *    rendered as <td class="drag-handle"> with no [data-drag-handle] attribute,
 *    so we match on the table class instead.
 */
function findGridRow(input) {
  let el = input.parentElement;

  while (el) {
    // Replicator/Bard style: direct <header> child with [data-drag-handle]
    const header = el.querySelector(':scope > header');

    if (header && header.querySelector('[data-drag-handle]')) {
      return el;
    }

    // Grid table style: <tr> inside <tbody> inside <table class="grid-table">
    if (
      el.tagName === 'TR' &&
      el.parentElement?.tagName === 'TBODY' &&
      el.closest('table.grid-table')
    ) {
      return el;
    }

    el = el.parentElement;
  }

  return null;
}

/**
 * Stamps [data-grid-row] onto Grid row <tr> elements.
 *
 * WHY we cannot rely on [data-visual-id] for Grid rows:
 * The AutoUuid Vue component sets the data-visual-id attribute
 * asynchronously in onMounted(). When the MutationObserver fires for the
 * childList change (Vue adding <tr> elements), the attribute has no value
 * yet. Because the observer only watches childList (not attributes), it
 * never re-fires when the attribute is set — so the rows are never stamped.
 *
 * FIX: stamp all <tbody><tr> rows inside table.grid-table directly by DOM
 * structure. This runs as soon as Vue renders the <tr> elements, before
 * the UUID attribute is populated. By the time a user can click in the
 * preview, Vue has finished mounting and the UUID attribute is already set.
 *
 * Falls back to the drag-handle detection for non-table Grid layouts.
 *
 * Called eagerly in initCp and again via MutationObserver when the DOM
 * changes (e.g. Vue renders new Grid rows after navigation or field expansion).
 */
export function stampGridRows(root = document) {
  // Table-mode grids (mode: table): stamp every <tr> inside a grid table's <tbody>.
  root.querySelectorAll('table.grid-table tbody tr').forEach((tr) => {
    if (!tr.hasAttribute('data-grid-row')) {
      tr.setAttribute('data-grid-row', '');
    }
  });

  // Stacked-mode grids (mode: stacked): each row is a direct child element of
  // the .grid-stacked container (the StackedRow root div, which carries the
  // sortable item class). There is no <table>. We stamp these children directly
  // by DOM structure — independent of [data-visual-id], which is set
  // asynchronously by AutoUuid.vue and may not exist yet when this runs.
  //
  // NOTE: stacked grids are frequently nested inside a Replicator set. The old
  // fallback skipped any input whose closest(anySet) matched — which always
  // matched the surrounding Replicator set, so nested stacked grid rows were
  // never stamped. Stamping by .grid-stacked structure avoids that trap.
  root.querySelectorAll('.grid-stacked').forEach((container) => {
    Array.from(container.children).forEach((child) => {
      if (child.nodeType === 1 && !child.hasAttribute('data-grid-row')) {
        child.setAttribute('data-grid-row', '');
      }
    });
  });

  hideAutoUuidGridColumns(root);
}

/**
 * Hides the _visual_id column in Grid table fields.
 *
 * Statamic's GridTable renders a <td class="auto_uuid-fieldtype"> for the
 * auto_uuid field. The column header (<th>) uses v-show="field.type !== 'hidden'",
 * which shows the header because our type is "auto_uuid", not "hidden".
 *
 * We use td.cellIndex to find the correct column position and hide both the
 * <th> header and all <td> cells in that column across the entire table.
 */
export function hideAutoUuidGridColumns(root = document) {
  root.querySelectorAll('table.grid-table td.auto_uuid-fieldtype').forEach((td) => {
    if (td.hasAttribute('data-sve-col-hidden')) {
      return;
    }

    const colIndex = td.cellIndex;
    const table = td.closest('table.grid-table');

    if (!table) {
      return;
    }

    table.querySelectorAll(`tr > :nth-child(${colIndex + 1})`).forEach((cell) => {
      cell.setAttribute('data-sve-col-hidden', '');
      cell.style.display = 'none';
    });
  });
}

export function findSetByUid(uid, doc = document, index = 0) {
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
 */
export function isSetCollapsed(setEl) {
  if (setEl.hasAttribute('data-replicator-set')) {
    return setEl.dataset.collapsed === 'true';
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

  const toggle = setEl.querySelector(SELECTORS.headerToggle);

  if (toggle) {
    // Use a non-bubbling click so Vue's @click handler on the button fires,
    // but the document-level handleClick listener (which sends a focus message
    // to the iframe) does NOT fire for this programmatic expand action.
    toggle.dispatchEvent(new MouseEvent('click', { bubbles: false, cancelable: true }));
  }
}

// Breathing room (px) left below the sticky grid header when scrolling a row
// into view, so the highlighted row isn't flush against the header.
const GRID_HEADER_GAP = 12;

/**
 * Height of the sticky <thead> in the grid table containing targetEl, or 0 when
 * targetEl is not inside a table-mode grid (e.g. stacked-mode grids have no
 * <thead>, so no offset is needed).
 */
function getGridHeaderOffset(targetEl) {
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

  const fieldEl = findFieldElement(fieldPath, doc, scopeUid);

  if (!fieldEl) {
    console.warn('[SVE] handleFieldFocus: no field element found for path:', fieldPath);
    return;
  }

  fieldEl.setAttribute(ACTIVE_ATTR, '');

  const tabSwitched = switchToContainingTab(fieldEl, doc);

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

export function createMessageListener(doc = document) {
  return function handleMessage(event) {
    // Guard: only accept messages from the live-preview iframe.
    // This prevents cross-site message spoofing from third-party windows.
    const previewIframe = doc.getElementById('live-preview-iframe');

    if (!previewIframe || event.source !== previewIframe.contentWindow) {
      return;
    }

    const { data } = event;

    if (!data || data.source !== 'statamic-visual-editor') {
      return;
    }

    if (data.type === 'click') {
      if (data.field) {
        handleFieldFocus(data.field, doc, { scopeUid: data.scope });
      } else {
        handleFocus(data.uid, doc, data.afterSetUid, data.uidIndex ?? 0);
      }
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

const CP_STYLES = `
[data-sve-active]:not([contenteditable="false"]), [data-sve-active][contenteditable="false"] > * {
  outline: 2px solid var(--theme-color-blue-500, #3b82f6) !important;
}
[data-sve-hover]:not([data-sve-active]) {
  outline: 2px dashed var(--theme-color-blue-500, #3b82f6) !important;
}
/* Grid rows: draw the outline INSIDE the row so it isn't clipped by the
   surrounding grid table border or overlapped by adjacent rows. */
[data-grid-row][data-sve-active],
[data-grid-row][data-sve-hover] {
  outline-offset: -2px !important;
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

function getUidFromSet(setEl) {
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
function findPrecedingBardSetNode(el, contentEditable) {
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
function getToolbarOffset(targetEl) {
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
function scrollToWithBardOffset(targetEl) {
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
function scrollBardToTextAfterSet(afterSetUid, containerEl) {
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

export function initCp(win = window) {
  const style = win.document.createElement('style');
  style.id = '__sve-cp-styles';
  style.textContent = CP_STYLES;
  win.document.head.appendChild(style);

  // Stamp Grid rows immediately and re-stamp whenever the DOM changes
  // (Vue renders Grid rows asynchronously after page load / field expansion).
  stampGridRows(win.document);
  const gridObserver = new win.MutationObserver(() => stampGridRows(win.document));
  gridObserver.observe(win.document.body, { childList: true, subtree: true });

  const listener = createMessageListener(win.document);

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
