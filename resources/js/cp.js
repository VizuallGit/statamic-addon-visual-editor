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

// --- Inline editing: write-back ---------------------------------------------
//
// The preview iframe sends edit-request / edit-input / edit-end messages
// (see bridge.js). This side resolves the clicked field to a dotted value
// path in the publish form, verifies the rendered text actually matches the
// stored value (so modifier-transformed output can never be written back as
// the wrong value), and writes edits via the container's setFieldValue().
// Statamic's own reactivity does the rest: the deep values watcher marks the
// form dirty and triggers the live preview re-render, and the Bard fieldtype's
// value watcher updates its editor when the value changes from outside.

/** Node types the inline editor may edit as a single contenteditable block. */
const EDITABLE_NODE_TYPES = ['heading', 'paragraph'];

// Publish containers captured from Statamic's `publish-container-created`
// event (fired by Container.vue on mount; payload includes the reactive
// `values` ref and `setFieldValue`). Registered in initCp, which runs inside
// Statamic.booting() — before any container mounts.
const publishContainers = [];

// The active inline-edit session, keyed by the bridge's requestId.
let editSession = null;

export function registerContainerEvents(win = window) {
  const events = win.Statamic?.$events;

  if (!events?.$on) {
    return;
  }

  events.$on('publish-container-created', (payload) => {
    if (payload?.setFieldValue && payload?.values) {
      publishContainers.push(payload);
    }
  });

  events.$on('publish-container-destroyed', (payload) => {
    const index = publishContainers.findIndex((c) => c.name === payload?.name);

    if (index !== -1) {
      publishContainers.splice(index, 1);
    }
  });
}

/** Unwraps a Vue ref (Container.vue provides `values` as a ref). */
function unwrapRef(v) {
  return v && v.__v_isRef ? v.value : v;
}

/**
 * Fallback when no container was captured via events (e.g. the CP script ran
 * after the container mounted): walk the Vue component chain from a
 * [data-visual-id] input to the PublishContainer's provided context, which
 * has the same { values, setFieldValue } shape as the event payload.
 */
function containerFromDom(doc) {
  const el = doc.querySelector(SELECTORS.visualIdInput);
  let component = el?.__vueParentComponent;

  while (component) {
    const ctx = component.provides?.['PublishContainerContext'];

    if (ctx?.setFieldValue) {
      return ctx;
    }

    component = component.parent;
  }

  return null;
}

function activeContainers(doc) {
  // Most recently created first — matches the form the user is looking at.
  const list = [...publishContainers].reverse();

  if (!list.length) {
    const ctx = containerFromDom(doc);

    if (ctx) {
      list.push(ctx);
    }
  }

  // A global section's content belongs to the entry open in the panel — another
  // window, so none of the containers above have ever heard of it. Appended last,
  // so the page's own fields always win a name clash, this stands in for it: every
  // caller (inline edit, findPathByUid, the settings panel) then treats a global
  // section exactly like one of the page's own.
  const panel = sectionPanelContainer(doc);

  if (panel) {
    list.push(panel);
  }

  return list;
}

/** data_get-style dotted path lookup ("page_sections.0.text"). */
function dataGet(obj, path) {
  return path.split('.').reduce((acc, key) => (acc == null ? undefined : acc[key]), obj);
}

/**
 * Recursively finds the dotted path of the set whose _visual_id (or row id)
 * equals uid. Mirrors how the preview's scope uid identifies a section/row.
 *
 * Row ids match both `id` and `_id`: the front-end context exposes `id`
 * (Replicator.processRow renames _id → id), but the publish FORM values keep
 * the raw `_id` key — column builder rows are only findable through it.
 */
function findPathByUid(value, uid, path = '') {
  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      const found = findPathByUid(value[i], uid, path ? `${path}.${i}` : String(i));

      if (found !== null) {
        return found;
      }
    }

    return null;
  }

  if (value && typeof value === 'object') {
    if (value._visual_id === uid || value.id === uid || value._id === uid) {
      return path;
    }

    for (const key of Object.keys(value)) {
      const found = findPathByUid(value[key], uid, path ? `${path}.${key}` : key);

      if (found !== null) {
        return found;
      }
    }
  }

  return null;
}

/**
 * Whitespace-normalizes text for comparison across the preview DOM and the CP
 * form values: nbsp → space, collapse runs, trim. Duplicated in bridge.js
 * because the two files run in separate bundles (CP window vs. preview iframe).
 */
export function normText(s) {
  return (s || '').replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * Flattens a ProseMirror node to plain text for comparison with the preview
 * DOM's textContent. hardBreak maps to '' — <br> contributes nothing to
 * textContent, so both sides must agree ("råvarer.<br>Vi" reads "råvarer.Vi").
 */
function bardNodeText(node) {
  if (!node) {
    return '';
  }

  if (node.type === 'text') {
    return node.text || '';
  }

  if (node.type === 'hardBreak') {
    return '';
  }

  return (node.content || []).map(bardNodeText).join('');
}

/**
 * Collects candidate edit targets for the clicked text within a field value.
 *
 * - string values match when their normalized text equals the clicked block's
 *   (or wrapper's) text.
 * - arrays are treated as Bard: heading/paragraph nodes match on flattened text.
 * - plain objects (group fields like section_heading) recurse one level so
 *   their string/Bard members are reachable.
 *
 * The caller requires EXACTLY one candidate — ambiguity means we cannot know
 * which value the user clicked, so editing is denied.
 */
function resolveEditTargets(value, path, req, depth = 0) {
  if (typeof value === 'string') {
    const t = normText(value);

    if ((req.blockText !== null && t === req.blockText) || t === req.wrapperText) {
      return [{ mode: 'string', path }];
    }

    return [];
  }

  if (Array.isArray(value)) {
    if (req.blockText === null) {
      return [];
    }

    const out = [];

    value.forEach((node, i) => {
      if (
        node &&
        EDITABLE_NODE_TYPES.includes(node.type) &&
        normText(bardNodeText(node)) === req.blockText
      ) {
        out.push({ mode: 'bard', path, index: i });
      }
    });

    return out;
  }

  if (value && typeof value === 'object' && depth < 2) {
    let out = [];

    for (const key of Object.keys(value)) {
      out = out.concat(resolveEditTargets(value[key], `${path}.${key}`, req, depth + 1));
    }

    return out;
  }

  return [];
}

/** HTML tag → ProseMirror mark type for inline content parsing. */
const MARK_TAGS = {
  STRONG: 'bold',
  B: 'bold',
  EM: 'italic',
  I: 'italic',
  U: 'underline',
  S: 'strike',
  STRIKE: 'strike',
  DEL: 'strike',
  CODE: 'code',
  SUB: 'subscript',
  SUP: 'superscript',
};

// bard-texstyle span-type styles that inline editing can toggle. A <span> whose
// class is one of these maps to a btsSpan ProseMirror mark; any other span is
// treated as transparent styling. Mirrors the span-type entries in
// config/statamic/bard_texstyle.php — extend here if the site adds more.
const BTS_SPAN_CLASSES = ['uppercase'];

function sameMarks(a, b) {
  return JSON.stringify(a || []) === JSON.stringify(b || []);
}

/**
 * Parses the innerHTML of an inline-edited block back into ProseMirror inline
 * content. Semantic tags become marks; everything else (site spans, styling
 * wrappers) is transparent — only its text survives. This intentionally
 * ignores presentation-only markup the site's own JS may have injected
 * (e.g. word-reveal <span>s around headline words).
 */
export function parseInlineHtml(html, doc = document, spanClasses = BTS_SPAN_CLASSES) {
  const root = doc.createElement('div');

  root.innerHTML = html;

  const out = [];

  const pushText = (text, marks) => {
    if (!text) {
      return;
    }

    const last = out[out.length - 1];

    if (last && last.type === 'text' && sameMarks(last.marks, marks)) {
      last.text += text;

      return;
    }

    const node = { type: 'text', text };

    if (marks.length) {
      node.marks = marks.map((m) => ({ ...m }));
    }

    out.push(node);
  };

  const walk = (node, marks) => {
    for (const child of node.childNodes) {
      if (child.nodeType === 3) {
        // Collapse whitespace like HTML rendering does — pretty-printed
        // template markup must not leak literal newlines/indentation into text.
        pushText(child.nodeValue.replace(/\u00a0/g, ' ').replace(/\s+/g, ' '), marks);
      } else if (child.nodeType === 1) {
        if (child.tagName === 'BR') {
          out.push({ type: 'hardBreak' });
          continue;
        }

        let childMarks = marks;
        const markType = MARK_TAGS[child.tagName];

        if (markType) {
          childMarks = [...marks, { type: markType }];
        } else if (child.tagName === 'A') {
          const attrs = { href: child.getAttribute('href') };

          for (const attr of ['target', 'rel', 'title']) {
            if (child.getAttribute(attr)) {
              attrs[attr] = child.getAttribute(attr);
            }
          }

          childMarks = [...marks, { type: 'link', attrs }];
        } else if (child.tagName === 'SPAN') {
          // bard-texstyle span marks (e.g. class="uppercase"). Only recognized
          // classes become a btsSpan mark; other spans (site-injected styling
          // wrappers like the hero word-reveal spans) stay transparent.
          const btsClass = [...child.classList].find((c) => spanClasses.includes(c));

          if (btsClass) {
            childMarks = [...marks, { type: 'btsSpan', attrs: { class: btsClass } }];
          }
        }

        walk(child, childMarks);
      }
    }
  };

  walk(root, []);

  // Trim block edges and collapse duplicate spaces across node boundaries.
  for (let i = 0; i < out.length; i++) {
    const node = out[i];

    if (node.type !== 'text') {
      continue;
    }

    if (i === 0) {
      node.text = node.text.replace(/^\s+/, '');
    }

    if (i === out.length - 1) {
      node.text = node.text.replace(/\s+$/, '');
    }

    const prev = out[i - 1];

    if (prev && prev.type === 'text' && prev.text.endsWith(' ') && node.text.startsWith(' ')) {
      node.text = node.text.replace(/^ +/, '');
    }
  }

  return out.filter((n) => n.type !== 'text' || n.text !== '');
}

/** innerText → stored string: nbsp → space, strip the trailing newline(s). */
function cleanEditedText(text) {
  return (text || '').replace(/\u00a0/g, ' ').replace(/\n+$/, '');
}

export function handleEditRequest(data, doc, win) {
  const reply = (message) =>
    sendToPreview({ source: 'statamic-visual-editor', requestId: data.requestId, ...message }, win);

  const req = {
    blockText: data.blockText != null ? normText(data.blockText) : null,
    wrapperText: normText(data.wrapperText || ''),
  };

  for (const container of activeContainers(doc)) {
    const values = unwrapRef(container.values);

    if (!values || typeof values !== 'object') {
      continue;
    }

    let basePath = '';

    if (data.scope) {
      basePath = findPathByUid(values, data.scope);

      if (basePath === null) {
        continue; // scope lives in another container
      }
    }

    const path = [basePath, data.field].filter(Boolean).join('.');
    const value = dataGet(values, path);

    if (value === undefined) {
      continue;
    }

    // Whole-field Bard editing: when every node is an editable text block
    // (heading/paragraph), the entire field becomes ONE session — one toolbar,
    // the caret moves freely between blocks and Enter splits blocks like the
    // panel's own editor. Fields containing other node types (sets, lists,
    // images, …) fall back to the per-block editing below.
    if (
      Array.isArray(value) &&
      value.length &&
      value.every((node) => node && EDITABLE_NODE_TYPES.includes(node.type))
    ) {
      editSession = {
        container,
        requestId: data.requestId,
        mode: 'bard-field',
        path,
        field: data.field,
        scope: data.scope,
        original: JSON.parse(JSON.stringify(value)),
      };
      reply({
        type: 'edit-start',
        mode: 'bard-field',
        target: 'wrapper',
        // Per-node identity so the bridge can map nodes onto DOM blocks.
        nodes: value.map((node) => ({
          type: node.type,
          level: node.attrs?.level ?? null,
          className: node.attrs?.class ?? null,
          text: normText(bardNodeText(node)),
        })),
      });

      return;
    }

    // Fast path: Bard field where the clicked block's index maps directly to
    // the ProseMirror node AND the rendered text matches the stored one.
    if (Array.isArray(value) && data.blockIndex != null && req.blockText !== null) {
      const node = value[data.blockIndex];

      if (
        node &&
        EDITABLE_NODE_TYPES.includes(node.type) &&
        normText(bardNodeText(node)) === req.blockText
      ) {
        editSession = {
          container,
          requestId: data.requestId,
          mode: 'bard',
          path,
          index: data.blockIndex,
          field: data.field,
          scope: data.scope,
          original: JSON.parse(JSON.stringify(value)),
        };
        reply({ type: 'edit-start', mode: 'bard', target: 'block' });

        return;
      }
    }

    const candidates = resolveEditTargets(value, path, req);

    if (candidates.length !== 1) {
      reply({ type: 'edit-deny', reason: candidates.length ? 'ambiguous' : 'no-match' });

      return;
    }

    const target = candidates[0];

    if (target.mode === 'string') {
      // Rows that pair a text with a link (button rows: { text, url }) get a
      // link-edit shortcut in the preview toolbar.
      const rowPath = target.path.includes('.')
        ? target.path.slice(0, target.path.lastIndexOf('.'))
        : '';
      const row = rowPath ? dataGet(values, rowPath) : null;
      const linkPath =
        row && typeof row === 'object' && typeof row.url === 'string' ? `${rowPath}.url` : null;

      editSession = {
        container,
        requestId: data.requestId,
        mode: 'string',
        path: target.path,
        linkPath,
        field: data.field,
        scope: data.scope,
        original: dataGet(values, target.path),
      };
      reply({
        type: 'edit-start',
        mode: 'string',
        target: target.path === path ? 'wrapper' : 'block',
        hasLink: !!linkPath,
      });
    } else {
      editSession = {
        container,
        requestId: data.requestId,
        mode: 'bard',
        path: target.path,
        index: target.index,
        field: data.field,
        scope: data.scope,
        original: JSON.parse(JSON.stringify(dataGet(values, target.path))),
      };
      reply({ type: 'edit-start', mode: 'bard', target: 'block' });
    }

    return;
  }

  reply({ type: 'edit-deny', reason: 'not-found' });
}

export function handleEditInput(data, doc) {
  if (!editSession || editSession.requestId !== data.requestId) {
    return;
  }

  const { container } = editSession;

  if (editSession.mode === 'string') {
    container.setFieldValue(editSession.path, cleanEditedText(data.text));

    return;
  }

  // Whole-field Bard: rebuild the entire node array from the serialized blocks.
  if (editSession.mode === 'bard-field') {
    const values = unwrapRef(container.values);
    const current = dataGet(values, editSession.path);
    const spanClasses =
      Array.isArray(data.spanClasses) && data.spanClasses.length ? data.spanClasses : BTS_SPAN_CLASSES;

    const next = (data.blocks || []).map((block, i) => {
      const type = block.kind === 'heading' ? 'heading' : 'paragraph';
      // Positional merge keeps attrs we don't manage (e.g. textAlign) as long
      // as the block at this index kept its type.
      const orig = Array.isArray(current) && current[i]?.type === type ? current[i] : null;
      const attrs = { ...(orig?.attrs || {}) };
      const node = { type };

      if (type === 'heading') {
        attrs.level = block.level || 2;
        delete attrs.class;
      } else if (block.className) {
        attrs.class = block.className;
      } else {
        delete attrs.class;
      }

      if (Object.keys(attrs).length) {
        node.attrs = attrs;
      }

      const content = parseInlineHtml(block.html || '', doc, spanClasses);

      if (content.length) {
        node.content = content;
      }

      return node;
    });

    container.setFieldValue(editSession.path, next);

    return;
  }

  // Bard: swap the edited node's inline content inside a fresh copy of the
  // current field value (other nodes/sets stay untouched).
  const values = unwrapRef(container.values);
  const current = dataGet(values, editSession.path);

  if (!Array.isArray(current)) {
    return;
  }

  const next = JSON.parse(JSON.stringify(current));
  const node = next[editSession.index];

  if (!node) {
    return;
  }

  const content = parseInlineHtml(
    data.html,
    doc,
    Array.isArray(data.spanClasses) && data.spanClasses.length ? data.spanClasses : BTS_SPAN_CLASSES
  );

  if (content.length) {
    node.content = content;
  } else {
    delete node.content;
  }

  container.setFieldValue(editSession.path, next);
}

export function handleEditEnd(data) {
  if (!editSession || editSession.requestId !== data.requestId) {
    return;
  }

  if (data.cancelled) {
    editSession.container.setFieldValue(editSession.path, editSession.original);
  }

  editSession = null;
}

// command → CP Bard toolbar button title matcher. Core Statamic titles are
// English even in a translated CP; addon buttons (colour) are localized.
const BARD_CMD_TITLE = {
  link: /^link$/i,
  color: /farve|colou?r/i,
  unorderedlist: /unordered list|bullet|punkt/i,
  orderedlist: /ordered list|number|nummer/i,
  quote: /blockquote|quote|citat/i,
  code: /^code$/i,
  codeblock: /code block|kodeblok/i,
  table: /table|tabel/i,
};

/** Builds a DOM Range spanning [from,to] character offsets within blockEl. */
function domRangeForOffsets(blockEl, from, to) {
  const walker = blockEl.ownerDocument.createTreeWalker(blockEl, NodeFilter.SHOW_TEXT);
  let count = 0;
  let startNode = null;
  let startOff = 0;
  let endNode = null;
  let endOff = 0;
  let node;

  while ((node = walker.nextNode())) {
    const len = node.nodeValue.length;

    if (startNode === null && from <= count + len) {
      startNode = node;
      startOff = from - count;
    }

    if (to <= count + len) {
      endNode = node;
      endOff = to - count;
      break;
    }

    count += len;
  }

  if (!startNode) {
    return null;
  }

  if (!endNode) {
    endNode = startNode;
    endOff = startNode.nodeValue.length;
  }

  const range = blockEl.ownerDocument.createRange();

  range.setStart(startNode, startOff);
  range.setEnd(endNode, endOff);

  return range;
}

/**
 * Link/colour/list/quote from the preview toolbar: open the editor panel,
 * select the same character range in the real CP Bard editor, and click its
 * native toolbar button — so Statamic's own popup (link dialog, colour palette)
 * appears, exactly as the user knows it from the panel. Runs after the inline
 * edit has committed; captures field/scope/index synchronously because the CP
 * edit session is torn down by the accompanying edit-end.
 */
export function handleBardCommand(data, doc, win) {
  if (!editSession || editSession.requestId !== data.requestId) {
    return;
  }

  const titleRe = BARD_CMD_TITLE[data.command];

  if (!titleRe) {
    return;
  }

  const { field, scope } = editSession;
  // Whole-field sessions carry the selection's block index in the message; the
  // per-block session stored it at edit-start.
  const index = Number.isInteger(data.blockIndex) ? data.blockIndex : editSession.index;
  // link/colour open a Statamic popup; the rest (lists, quote, …) apply in place.
  const opensPopup = data.command === 'link' || data.command === 'color';

  // Keep the editor panel HIDDEN. It still has real (off-screen) layout, so the
  // set expands, the toolbar button clicks and the popup opens — we then move
  // just that popup over the preview, instead of revealing the whole sidebar.
  // (Deliberately no setLpCollapsed(false) here.)

  let attempts = 0;

  const run = () => {
    const setEl = scope ? findSetByUid(scope, doc) : null;

    if (setEl) {
      [...collectAncestorSets(setEl), setEl].forEach(expandSet);
    }

    const fieldEl = findFieldElement(field, doc, scope);
    // The field id sits on the content wrapper; the toolbar lives on the
    // enclosing .bard-fieldtype. Search from there for both toolbar and editor.
    const bardEl =
      fieldEl?.closest('.bard-fieldtype') || fieldEl?.querySelector('.bard-fieldtype') || fieldEl;
    const ce = bardEl?.querySelector('.ProseMirror') || bardEl?.querySelector('[contenteditable="true"]');
    const toolbar = bardEl?.querySelector('.bard-fixed-toolbar') || bardEl;
    const btn = toolbar
      ? [...toolbar.querySelectorAll('button')].find((b) =>
          titleRe.test(b.getAttribute('title') || b.getAttribute('aria-label') || '')
        )
      : null;

    if (!ce || !btn) {
      if (++attempts < 12) {
        setTimeout(run, 250);
      }

      return;
    }

    const block = ce.children[index];

    if (block && data.to > data.from) {
      const range = domRangeForOffsets(block, data.from, data.to);

      if (range) {
        ce.focus();
        const sel = win.getSelection();

        sel.removeAllRanges();
        sel.addRange(range);
      }
    } else {
      ce.focus();
    }

    // Let ProseMirror sync the DOM selection into its state before the button
    // command reads editor.state.selection.
    setTimeout(() => {
      btn.click();

      if (opensPopup) {
        repositionBardPopup(data.command, data.anchorRect, doc, win);
      }
    }, 70);
  };

  setTimeout(run, 120);
}

/**
 * Finds the Statamic popup that a bard command just opened (link dialog or
 * colour palette) by a distinctive bit of its content, then climbs to the
 * floating (positioned) container.
 */
function findBardPopupEl(command, doc) {
  let anchorNode = null;

  if (command === 'color') {
    anchorNode = [...doc.querySelectorAll('*')].find(
      (e) => e.children.length === 0 && /ingen farve|no colou?r/i.test(e.textContent || '')
    );
  } else if (command === 'link') {
    anchorNode =
      doc.querySelector('input[placeholder="https://"], input[placeholder*="http" i]') ||
      [...doc.querySelectorAll('button, label, span, div, h1, h2, h3')].find(
        (e) =>
          e.children.length === 0 &&
          /apply link|anvend link|update link|opdater link|indsæt link/i.test(e.textContent || '')
      );
  }

  if (!anchorNode) {
    return null;
  }

  let el = anchorNode;

  for (let i = 0; el && i < 12; i++) {
    const cs = doc.defaultView.getComputedStyle(el);
    const w = el.getBoundingClientRect().width;

    // A popover/palette is a small positioned box; skip full-screen overlays.
    if ((cs.position === 'fixed' || cs.position === 'absolute') && w > 120 && w < 640) {
      return el;
    }

    el = el.parentElement;
  }

  return anchorNode.closest('[data-popper-placement]') || anchorNode.parentElement;
}

/**
 * Pins the popup over the preview at the anchor sent by the bridge, keeping the
 * editor panel hidden. Uses !important so Statamic's floating-ui inline styles
 * (written without priority) can't drag it back to the off-screen button.
 */
function repositionBardPopup(command, anchorRect, doc, win) {
  const iframe = doc.getElementById('live-preview-iframe');

  if (!iframe || !anchorRect) {
    return;
  }

  const ir = iframe.getBoundingClientRect();
  const targetLeft = ir.left + (anchorRect.left || 0);
  const targetTop = ir.top + (anchorRect.bottom || 0) + 8;

  const place = (popup) => {
    const w = popup.offsetWidth || 320;
    const left = Math.max(8, Math.min(targetLeft, win.innerWidth - w - 8));
    const top = Math.max(8, targetTop);

    popup.style.setProperty('position', 'fixed', 'important');
    popup.style.setProperty('left', `${left}px`, 'important');
    popup.style.setProperty('top', `${top}px`, 'important');
    popup.style.setProperty('right', 'auto', 'important');
    popup.style.setProperty('bottom', 'auto', 'important');
    popup.style.setProperty('transform', 'none', 'important');
    popup.style.setProperty('margin', '0', 'important');
    popup.style.setProperty('z-index', '2147483000', 'important');
    // Statamic's link editor renders as a full-height stack card — hug its
    // content so it looks like a popover floating over the preview.
    popup.style.setProperty('height', 'auto', 'important');
    popup.style.setProperty('max-height', '85vh', 'important');
    popup.style.setProperty('overflow', 'auto', 'important');
    popup.style.setProperty('border-radius', '12px', 'important');
    popup.style.setProperty('box-shadow', '0 12px 44px rgba(0,0,0,0.28)', 'important');
  };

  let tries = 0;

  const findAndPlace = () => {
    const popup = findBardPopupEl(command, doc);

    if (!popup) {
      if (++tries < 25) {
        setTimeout(findAndPlace, 100);
      }

      return;
    }

    // Re-assert a few times to win against floating-ui's on-open positioning.
    place(popup);
    setTimeout(() => place(popup), 130);
    setTimeout(() => place(popup), 320);
  };

  setTimeout(findAndPlace, 60);
}

/**
 * Toolbar tools the preview can't perform in place (lists, quote, color) send
 * this: open the editor panel and focus the Bard field so the user finishes
 * with the field's real toolbar. Runs after the inline edit has committed.
 */
export function handleOpenPanelField(data, doc, win) {
  if (!editSession || editSession.requestId !== data.requestId || !editSession.field) {
    return;
  }

  const { field, scope } = editSession;

  setLpCollapsed(win, false);
  setTimeout(() => handleFieldFocus(field, doc, { scopeUid: scope }), 100);
}

/**
 * Changes the edited Bard node's block type/attrs (heading level, or paragraph
 * with an optional bard-texstyle class). Only touches type/attrs — the node's
 * inline content is preserved and updated separately via handleEditInput.
 */
export function handleBlockFormat(data) {
  if (!editSession || editSession.requestId !== data.requestId || editSession.mode !== 'bard') {
    return;
  }

  const { container } = editSession;
  const values = unwrapRef(container.values);
  const current = dataGet(values, editSession.path);

  if (!Array.isArray(current)) {
    return;
  }

  const next = JSON.parse(JSON.stringify(current));
  const node = next[editSession.index];

  if (!node) {
    return;
  }

  if (data.node === 'heading') {
    node.type = 'heading';
    node.attrs = { ...(node.attrs || {}), level: data.level };
    delete node.attrs.class;
  } else {
    node.type = 'paragraph';
    node.attrs = { ...(node.attrs || {}), class: data.className ?? null };
    delete node.attrs.level;
  }

  container.setFieldValue(editSession.path, next);
}

/**
 * Opens the asset browser for the clicked image field: locates the CP field
 * wrapper (retrying while the containing set expands — the accompanying click
 * message triggers that expansion) and clicks its Browse button. Statamic's
 * asset selector portals to the body, so it shows even while the editor panel
 * is collapsed off-screen.
 */
export function handleAssetEdit(data, doc) {
  let attempts = 0;

  const tryOpen = () => {
    const setEl = data.scope ? findSetByUid(data.scope, doc) : null;

    // Collapsed sets don't render their field wrappers — expand the scoped set
    // (and its ancestors) so the assets field mounts, then retry below.
    if (setEl) {
      [...collectAncestorSets(setEl), setEl].forEach(expandSet);
    }

    // Assets fields don't always render a field_{path} wrapper id (observed in
    // replicator sets) — fall back to the fieldtype root inside the scoped set.
    const fieldEl =
      findFieldElement(data.field, doc, data.scope) ||
      (setEl ? setEl.querySelector('.assets-fieldtype') : null) ||
      (data.scope ? null : doc.querySelector('.assets-fieldtype'));

    const browse = fieldEl
      ? [...fieldEl.querySelectorAll('button, [role="button"]')].find((b) =>
          /browse|gennemse/i.test(b.textContent)
        )
      : null;

    if (browse) {
      browse.click();

      return;
    }

    if (++attempts < 8) {
      setTimeout(tryOpen, 250);
    }
  };

  tryOpen();
}

/**
 * Link-edit shortcut from the preview toolbar: opens the editor panel and
 * focuses the row's url/link field so the user can change the URL or pick
 * another entry with Statamic's own link fieldtype UI.
 */
export function handleLinkEdit(data, doc, win) {
  if (!editSession || editSession.requestId !== data.requestId || !editSession.linkPath) {
    return;
  }

  const { linkPath, scope } = editSession;

  setLpCollapsed(win, false);

  setTimeout(() => {
    // Preferred: the url field's own wrapper (stacked grids render one).
    let target = findFieldElement(linkPath, doc);

    // Table-mode grid cells carry no field wrapper id — locate the row via its
    // _visual_id and use the link fieldtype cell (or the row itself).
    if (!target && scope) {
      const rowEl = findSetByUid(scope, doc);

      if (rowEl) {
        target = rowEl.querySelector('.link-fieldtype') || rowEl;
      }
    }

    if (!target) {
      return;
    }

    doc.querySelectorAll(`[${ACTIVE_ATTR}]`).forEach((el) => el.removeAttribute(ACTIVE_ATTR));
    target.setAttribute(ACTIVE_ATTR, '');
    switchToContainingTab(target, doc);
    collectAncestorSets(target).forEach(expandSet);

    setTimeout(() => {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      target.classList.add('sve-field-highlight');
      setTimeout(() => target.classList.remove('sve-field-highlight'), 2000);
    }, COLLAPSE_SETTLE_MS);
  }, 100);
}

/**
 * Moves the set identified by uid one position up/down within its containing
 * array (page sections, replicator rows, …). Works generically: the uid is
 * resolved to a value path like "page_sections.2", and the two array items are
 * swapped via setFieldValue — dirty state, replicator re-render and the live
 * preview update all follow from Statamic's own reactivity.
 */
/**
 * Reorders the array item carrying data.uid. Two callers: the hover arrows send
 * a relative `direction` (±1); drag & drop sends an absolute `toIndex`.
 */
export function handleMove(data, doc) {
  const direction = data.direction < 0 ? -1 : 1;

  for (const container of activeContainers(doc)) {
    const values = unwrapRef(container.values);

    if (!values || typeof values !== 'object') {
      continue;
    }

    const path = findPathByUid(values, data.uid);

    if (path === null) {
      continue;
    }

    const dot = path.lastIndexOf('.');

    if (dot === -1) {
      return; // uid sits on a top-level key, not an array item
    }

    const parentPath = path.slice(0, dot);
    const index = Number(path.slice(dot + 1));
    const arr = dataGet(values, parentPath);

    if (!Array.isArray(arr) || !Number.isInteger(index)) {
      return;
    }

    const to = Number.isInteger(data.toIndex)
      ? Math.max(0, Math.min(arr.length - 1, data.toIndex))
      : index + direction;

    if (to === index || to < 0 || to >= arr.length) {
      return; // no movement (or already first/last)
    }

    const next = JSON.parse(JSON.stringify(arr));
    const [item] = next.splice(index, 1);

    next.splice(to, 0, item);
    container.setFieldValue(parentPath, next);

    return;
  }
}

/**
 * Visual column resize: writes the col_w_* span classes the preview's width
 * drag produced. `changes` come in pairs (both columns at a boundary), and the
 * paths are looked up per uid — width writes never shift array indexes, so one
 * values snapshot serves both lookups.
 */
export function handleColumnWidth(data, doc) {
  for (const container of activeContainers(doc)) {
    const values = unwrapRef(container.values);

    if (!values || typeof values !== 'object') {
      continue;
    }

    let applied = false;

    for (const change of data.changes ?? []) {
      if (typeof change?.field !== 'string' || !/^col_w_[mtd]$/.test(change.field)) {
        continue;
      }

      const path = findPathByUid(values, change.uid);

      if (path === null) {
        continue;
      }

      container.setFieldValue(`${path}.${change.field}`, change.value);
      applied = true;
    }

    if (applied) {
      return;
    }
  }
}

/**
 * "+" on a columns section in the preview: append a column to the section's
 * columns array — mirroring the column builder's own addColumn() defaults —
 * and open the new card's edit popup so type and fields can be picked.
 *
 * Written through setFieldValue rather than by clicking the builder's own
 * "Add column" button: programmatic clicks reach the builder's edit buttons
 * fine (the popup flow below), but its add button doesn't respond to them.
 */
export function handleAddColumn(data, doc, win) {
  for (const container of activeContainers(doc)) {
    const values = unwrapRef(container.values);

    if (!values || typeof values !== 'object') {
      continue;
    }

    const sectionPath = findPathByUid(values, data.uid);

    if (sectionPath === null) {
      continue;
    }

    const columns = dataGet(values, `${sectionPath}.columns`);

    if (!Array.isArray(columns)) {
      continue;
    }

    // Same id format and defaults as the builder's addColumn().
    const newId = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    const count = columns.length + 1;
    const newItem = {
      _id: newId,
      type: null,
      enabled: true,
      col_w_m: 'col-span-12',
      col_w_t: 'md:col-span-6',
      col_w_d: 'lg:col-span-4',
      order_m: count,
      order_t: count,
      order_d: count,
    };

    container.setFieldValue(`${sectionPath}.columns`, [...JSON.parse(JSON.stringify(columns)), newItem]);

    // The card only mounts (and the builder's picker machinery only measures
    // real rects) in an expanded set — nudge once; Vue applies it asynchronously.
    const setEl = findSetByUid(data.uid, doc) ?? sortableItemForUid(data.uid, doc);

    if (setEl) {
      [...collectAncestorSets(setEl), setEl].forEach(expandSet);
    }

    openColumnTypePicker(newId, doc, win);

    return;
  }
}

/**
 * Opens the builder's type picker on a (typeless) column card once it has
 * mounted — the same flow the card's own plus icon runs. Cards that already
 * have a type get their edit popup instead.
 */
function openColumnTypePicker(rowId, doc, win, attempts = 0) {
  const card = doc.querySelector(`[data-cb-item-id="${rowId}"]`);
  const trigger = card?.querySelector('.cb-col-plus') ?? card?.querySelector('.cb-edit-btn');

  if (trigger && trigger.offsetParent !== null) {
    trigger.click();
    keepPickerOnScreen(doc, win);

    return;
  }

  if (attempts < 25) {
    setTimeout(() => openColumnTypePicker(rowId, doc, win, attempts + 1), 200);
  }
}

/**
 * The builder positions its type-picker portal at the trigger's rect — with the
 * editor panel parked off-screen (Hide/Auto mode) that lands at left:-10000px.
 * Pull it back into view, centered, so picking a type happens over the preview.
 */
function keepPickerOnScreen(doc, win, attempts = 0) {
  const panel = [...doc.body.children].find(
    (el) => el.style?.position === 'fixed' && el.style?.zIndex === '99999'
  );

  if (panel) {
    const left = parseFloat(panel.style.left);

    if (Number.isNaN(left) || left < 0 || left > win.innerWidth) {
      panel.style.left = `${Math.max(8, (win.innerWidth - (panel.offsetWidth || 224)) / 2)}px`;
      panel.style.top = '120px';
    }

    return;
  }

  if (attempts < 15) {
    setTimeout(() => keepPickerOnScreen(doc, win, attempts + 1), 150);
  }
}

/**
 * "Save as template": grab the clicked section's data from the form and store it
 * as a reusable section. A small dialog asks for a name and whether it should be
 * synced (edits propagate) or a copy (independent).
 */
export function handleSaveSection(data, doc, win) {
  for (const container of activeContainers(doc)) {
    const values = unwrapRef(container.values);

    if (!values || typeof values !== 'object') {
      continue;
    }

    const path = findPathByUid(values, data.uid);

    if (path === null) {
      continue;
    }

    const section = dataGet(values, path);

    if (!section || typeof section !== 'object') {
      return;
    }

    saveSectionDialog(win, section, (name, synced) => {
      win
        .fetch('/!/sve/saved-sections', {
          method: 'POST',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken(win),
            'X-Requested-With': 'XMLHttpRequest',
          },
          body: JSON.stringify({
            title: name,
            section_type: section.type,
            section_data: stripSavedSectionData(section),
            synced,
          }),
        })
        .then((res) => {
          win.Statamic?.$toast?.[res.ok ? 'success' : 'error'](
            res.ok ? t(win, 'saved_toast', { name }) : t(win, 'save_failed')
          );
        })
        .catch(() => win.Statamic?.$toast?.error(t(win, 'save_failed')));
    });

    return;
  }
}

/**
 * "Save this page as a template": every section on the page, stored as one entry
 * you can drop onto another page.
 *
 * The page's own field is read straight off the publish container, so it captures
 * what's on screen — including edits not yet saved to the page itself.
 */
function savePageAsTemplate(win, onSaved = () => {}) {
  const doc = win.document;
  const field = sectionField(win);

  let sections = null;

  for (const container of activeContainers(doc)) {
    const values = unwrapRef(container.values);
    const rows = values && typeof values === 'object' ? values[field] : null;

    if (Array.isArray(rows) && rows.length) {
      sections = rows;

      break;
    }
  }

  if (!sections) {
    win.Statamic?.$toast?.error(t(win, 'template_needs_sections'));

    return;
  }

  promptForName(win, t(win, 'save_page_as_template'), t(win, 'template_name'), (name) => {
    win
      .fetch('/!/sve/templates', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken(win),
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({
          title: name,
          // Ids are per-page. A template is a stencil: it gets fresh ones every
          // time it's dropped, or two pages would claim the same section.
          sections: sections.map((section) => stripSavedSectionData(section)),
        }),
      })
      .then((res) => {
        win.Statamic?.$toast?.[res.ok ? 'success' : 'error'](
          res.ok ? t(win, 'template_saved', { name }) : t(win, 'save_failed')
        );

        if (res.ok) {
          onSaved();
        }
      })
      .catch(() => win.Statamic?.$toast?.error(t(win, 'save_failed')));
  });
}

/** Drops the per-instance ids so a saved section is a clean template. */
function stripSavedSectionData(section) {
  const clone = JSON.parse(JSON.stringify(section));

  const strip = (node) => {
    if (Array.isArray(node)) {
      node.forEach(strip);
    } else if (node && typeof node === 'object') {
      delete node.id;
      delete node._id;
      delete node._visual_id;
      Object.values(node).forEach(strip);
    }
  };

  strip(clone);

  return clone;
}

/** Minimal "what should it be called?" prompt, themed to the CP. */
function promptForName(win, heading, placeholder, onOk) {
  const doc = win.document;
  const overlay = doc.createElement('div');

  overlay.style.cssText =
    'position:fixed;inset:0;z-index:2147483600;display:flex;align-items:center;justify-content:center;' +
    'background:rgba(0,0,0,.45);';

  const card = doc.createElement('div');

  card.style.cssText =
    'width:380px;max-width:92vw;background:var(--theme-color-content-bg,#fff);color:currentColor;' +
    'border-radius:12px;padding:20px;box-shadow:0 24px 64px rgba(0,0,0,.35);' +
    'font-family:ui-sans-serif,system-ui,sans-serif;';
  card.innerHTML = `
    <div style="font-size:15px;font-weight:600;margin-bottom:14px;">${heading}</div>
    <label style="display:block;font-size:12px;font-weight:500;margin-bottom:5px;">${t(win, 'name')}</label>
    <input type="text" data-sve-name placeholder="${placeholder}"
      style="width:100%;box-sizing:border-box;height:36px;padding:0 10px;border-radius:8px;
      border:1px solid rgba(128,128,128,.4);background:transparent;color:currentColor;font-size:14px;margin-bottom:18px;">
    <div style="display:flex;justify-content:flex-end;gap:8px;">
      <button type="button" data-sve-cancel style="all:unset;cursor:pointer;padding:7px 14px;border-radius:8px;font-size:13px;color:currentColor;opacity:.75;">${t(win, 'cancel')}</button>
      <button type="button" data-sve-ok style="all:unset;cursor:pointer;padding:7px 16px;border-radius:8px;font-size:13px;font-weight:600;background:var(--theme-color-primary,#4f46e5);color:#fff;">${t(win, 'save')}</button>
    </div>
  `;

  overlay.appendChild(card);
  doc.body.appendChild(overlay);

  const name = card.querySelector('[data-sve-name]');
  const close = () => overlay.remove();

  name.focus();

  const submit = () => {
    const value = name.value.trim();

    if (!value) {
      name.focus();

      return;
    }

    close();
    onOk(value);
  };

  card.querySelector('[data-sve-cancel]').addEventListener('click', close);
  card.querySelector('[data-sve-ok]').addEventListener('click', submit);
  overlay.addEventListener('click', (event) => event.target === overlay && close());
  name.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      submit();
    } else if (event.key === 'Escape') {
      close();
    }
  });
}

/** Minimal name + synced prompt, themed to the CP, appended to the body. */
function saveSectionDialog(win, section, onSave) {
  const doc = win.document;
  const overlay = doc.createElement('div');

  overlay.style.cssText =
    'position:fixed;inset:0;z-index:2147483600;display:flex;align-items:center;justify-content:center;' +
    'background:rgba(0,0,0,.45);';

  const card = doc.createElement('div');

  card.style.cssText =
    'width:380px;max-width:92vw;background:var(--theme-color-content-bg,#fff);color:currentColor;' +
    'border-radius:12px;padding:20px;box-shadow:0 24px 64px rgba(0,0,0,.35);' +
    'font-family:ui-sans-serif,system-ui,sans-serif;';
  card.innerHTML = `
    <div style="font-size:15px;font-weight:600;margin-bottom:14px;">${t(win, 'save_section_heading')}</div>
    <label style="display:block;font-size:12px;font-weight:500;margin-bottom:5px;">${t(win, 'name')}</label>
    <input type="text" data-sve-name placeholder="${t(win, 'name_placeholder')}"
      style="width:100%;box-sizing:border-box;height:36px;padding:0 10px;border-radius:8px;
      border:1px solid rgba(128,128,128,.4);background:transparent;color:currentColor;font-size:14px;margin-bottom:14px;">
    <label style="display:flex;align-items:center;gap:8px;font-size:13px;cursor:pointer;margin-bottom:18px;">
      <input type="checkbox" data-sve-synced style="width:16px;height:16px;">
      <span>${t(win, 'synced_hint')}</span>
    </label>
    <div style="display:flex;justify-content:flex-end;gap:8px;">
      <button type="button" data-sve-cancel style="all:unset;cursor:pointer;padding:7px 14px;border-radius:8px;font-size:13px;color:currentColor;opacity:.75;">${t(win, 'cancel')}</button>
      <button type="button" data-sve-save style="all:unset;cursor:pointer;padding:7px 16px;border-radius:8px;font-size:13px;font-weight:600;background:var(--theme-color-primary,#4f46e5);color:#fff;">${t(win, 'save')}</button>
    </div>
  `;

  overlay.appendChild(card);
  doc.body.appendChild(overlay);

  const name = card.querySelector('[data-sve-name]');
  const synced = card.querySelector('[data-sve-synced]');
  const close = () => overlay.remove();

  name.focus();

  const submit = () => {
    const value = name.value.trim();

    if (!value) {
      name.focus();

      return;
    }

    close();
    onSave(value, synced.checked);
  };

  card.querySelector('[data-sve-cancel]').addEventListener('click', close);
  card.querySelector('[data-sve-save]').addEventListener('click', submit);
  overlay.addEventListener('click', (event) => event.target === overlay && close());
  name.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      submit();
    } else if (event.key === 'Escape') {
      close();
    }
  });
}

// --- Section picker (visual "Add section") ---------------------------------------
//
// The "+" on a section opens this instead of Statamic's native Add Set picker, so
// we can offer three tabs: the built-in section types, and the saved templates
// split into Custom (insert a copy) and Global (insert a reference). Each is shown
// with its preview image. Insertion writes straight into the page_sections array,
// after the section the "+" was clicked on.

/**
 * A translated string, in the language the CP user picked (resolved server-side,
 * see ServiceProvider::strings()). Falls back to the key, so a missing string is
 * visible rather than blank.
 */
function t(win, key, replacements = {}) {
  const strings = win.Statamic?.$config?.get?.('sveStrings') || {};
  let out = strings[key] ?? key;

  for (const [name, value] of Object.entries(replacements)) {
    out = out.replaceAll(`:${name}`, value);
  }

  return out;
}

const SECTION_PICKER_ID = '__sve-section-picker';

function sectionTypes(win) {
  const list = win.Statamic?.$config?.get?.('sveSectionTypes');

  return Array.isArray(list) ? list : [];
}

/** A new uuid for a re-id'd copy. */
function newUuid(win) {
  return win.crypto?.randomUUID ? win.crypto.randomUUID() : `${newRowId()}-${newRowId()}`;
}

/** Gives a section (and everything in it) fresh ids, so a copy is independent. */
function reidSection(win, section) {
  const clone = JSON.parse(JSON.stringify(section));

  const walk = (node) => {
    if (Array.isArray(node)) {
      node.forEach(walk);
    } else if (node && typeof node === 'object') {
      if ('id' in node || '_id' in node) {
        if ('_id' in node) {
          node._id = newRowId();
        } else {
          node.id = newRowId();
        }
      }

      if ('_visual_id' in node) {
        node._visual_id = newUuid(win);
      }

      Object.values(node).forEach(walk);
    }
  };

  walk(clone);

  return clone;
}

/**
 * Inserts a section into page_sections. `afterUid` = the section to drop after;
 * null drops at the very top. `rowMeta` is the set's fresh meta (from the
 * section-meta endpoint): without it the Replicator has no way to render the new
 * row, so it would show in the preview but never in the CP's own section list.
 * Returns false when the field can't be located (e.g. nothing has focus yet).
 */
function insertSectionAfter(win, doc, afterUid, section, rowMeta = null) {
  const field = sectionField(win);

  for (const container of activeContainers(doc)) {
    const values = unwrapRef(container.values);

    if (!values || typeof values !== 'object') {
      continue;
    }

    // No uid → drop at the top of the page_sections array.
    if (afterUid == null) {
      const rows = dataGet(values, field);

      if (!Array.isArray(rows)) {
        continue;
      }

      writeSetMeta(container, field, section, rowMeta);
      container.setFieldValue(field, [section, ...JSON.parse(JSON.stringify(rows))]);

      return true;
    }

    const found = rowLocation(values, afterUid);

    if (!found) {
      continue;
    }

    const { parentPath, index, rows } = found;
    const next = JSON.parse(JSON.stringify(rows));

    next.splice(index + 1, 0, section);
    // Sections live at the top level, so the meta always belongs to `field`.
    writeSetMeta(container, field, section, rowMeta);
    container.setFieldValue(parentPath, next);

    return true;
  }

  return false;
}

/**
 * Registers a new row's meta on the container so the Replicator can render it.
 * The Replicator reads each row's fields from `meta.<field>.existing[<_id>]`;
 * merging the fresh meta under the row's id is what makes the row appear in the
 * CP list (not just the preview).
 */
function writeSetMeta(container, field, section, rowMeta) {
  if (!rowMeta || !section._id || typeof container.setFieldMeta !== 'function') {
    return;
  }

  const allMeta = unwrapRef(container.meta) || {};
  const fieldMeta = allMeta[field] || { existing: {}, new: null, defaults: null, collapsed: [] };

  container.setFieldMeta(field, {
    ...fieldMeta,
    existing: { ...(fieldMeta.existing || {}), [section._id]: rowMeta },
  });
}

// Site-specific handles all come from the server config (provideToScript), never
// from a literal here — the addon has to work as installed on any site.

/** The Replicator field the page builder lives in. */
function sectionField(win) {
  return win.Statamic?.$config?.get?.('sveSectionField') || 'page_sections';
}

/** The Replicator set a page uses to reference a synced ("global") saved section. */
function globalSectionSet(win) {
  return win.Statamic?.$config?.get?.('sveGlobalSectionSet') || 'global_section';
}

/** The collection saved sections live in. */
function savedSectionsCollection(win) {
  return win.Statamic?.$config?.get?.('sveSavedSectionsCollection') || 'saved_sections';
}

/** The Replicator set handle a library card of the given kind inserts. */
function setHandleFor(win, kind, item) {
  if (kind === 'global') {
    return globalSectionSet(win);
  }

  if (kind === 'custom') {
    return item.section_type;
  }

  return item.handle;
}

// Fresh set meta + defaults, per set handle, cached for the session (the
// blueprint doesn't change while the form is open).
const sectionMetaCache = new Map();

/** The collection being edited, read from the CP URL. */
function currentCollection(win) {
  const match = win.location.pathname.match(/\/collections\/([^/]+)\//);

  return match ? match[1] : null;
}

/** Fetches (and caches) a set's fresh meta + default values from the addon. */
/**
 * Meta + defaults for a set in a NESTED replicator field (a section's own
 * `blocks`), for the in-preview block inserter. Same endpoint as sections, with a
 * `field` so it resolves the nested replicator instead of the top-level one.
 */
async function fetchNestedSetMeta(win, field, setHandle) {
  const key = `${field}::${setHandle}`;

  if (sectionMetaCache.has(key)) {
    return sectionMetaCache.get(key);
  }

  const collection = currentCollection(win);

  if (!collection) {
    return null;
  }

  const url =
    `/!/sve/section-meta?collection=${encodeURIComponent(collection)}` +
    `&field=${encodeURIComponent(field)}&set=${encodeURIComponent(setHandle)}`;

  const res = await win.fetch(url, {
    credentials: 'same-origin',
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
  });

  const data = res.ok ? await res.json() : null;

  sectionMetaCache.set(key, data);

  return data;
}

/**
 * Registers a new row's meta in a NESTED replicator field, so the row renders in
 * the Control Panel form (the sidebar), not only the preview.
 *
 * The meta for a top-level field is set with `setFieldMeta(field, …)`, but a
 * nested field's meta lives deep inside the top field's — so we clone the top
 * field's meta, walk into the nested field within the clone, add the row there,
 * and write the whole top field back. `parentPath` is like `page_sections.2.blocks`.
 */
function writeNestedRowMeta(container, values, parentPath, rowId, rowMeta) {
  if (!rowMeta || !rowId || typeof container.setFieldMeta !== 'function') {
    return;
  }

  const fullMeta = unwrapRef(container.meta) || {};
  const segments = parentPath.split('.');
  const topField = segments[0];

  if (!fullMeta[topField]) {
    return;
  }

  const clone = JSON.parse(JSON.stringify(fullMeta[topField]));
  // metaForPath walks meta keyed by row _id — pass the top field's own meta and
  // values, and the path below it (e.g. "2.blocks").
  const nested = metaForPath(clone, dataGet(values, topField), segments.slice(1).join('.'));

  if (!nested || typeof nested !== 'object') {
    return;
  }

  nested.existing = { ...(nested.existing || {}), [rowId]: rowMeta };
  container.setFieldMeta(topField, clone);
}

/**
 * "+" between a replicator's blocks: insert a new set of the chosen type, next to
 * the block the "+" sits by (or as the first block when the field is empty). The
 * row is written into the nested array with its meta, so it shows in both the
 * preview and the CP form.
 */
async function handleInsertBlock(data, doc, win) {
  const { field, set, anchorUid, position, scope } = data;

  if (!field || !set) {
    return;
  }

  const meta = await fetchNestedSetMeta(win, field, set);
  const rowId = newRowId();
  const row = {
    ...(meta?.defaults ? JSON.parse(JSON.stringify(meta.defaults)) : {}),
    _id: rowId,
    _visual_id: newUuid(win),
    type: set,
  };

  for (const container of activeContainers(doc)) {
    const values = unwrapRef(container.values);

    if (!values || typeof values !== 'object') {
      continue;
    }

    // Anchored to a sibling block: splice in beside it.
    if (anchorUid) {
      const loc = rowLocation(values, anchorUid);

      if (!loc) {
        continue;
      }

      const next = JSON.parse(JSON.stringify(loc.rows));

      next.splice(position === 'before' ? loc.index : loc.index + 1, 0, row);
      writeNestedRowMeta(container, values, loc.parentPath, rowId, meta?.new);
      container.setFieldValue(loc.parentPath, next);

      return;
    }

    // Empty field: no sibling to anchor to — seed the section's own field array.
    if (scope) {
      const sectionPath = findPathByUid(values, scope);

      if (sectionPath === null) {
        continue;
      }

      const fieldPath = `${sectionPath}.${field}`;
      const existing = dataGet(values, fieldPath);
      const next = Array.isArray(existing) ? JSON.parse(JSON.stringify(existing)) : [];

      next.push(row);
      writeNestedRowMeta(container, values, fieldPath, rowId, meta?.new);
      container.setFieldValue(fieldPath, next);

      return;
    }
  }
}

async function fetchSetMeta(win, setHandle) {
  if (sectionMetaCache.has(setHandle)) {
    return sectionMetaCache.get(setHandle);
  }

  const collection = currentCollection(win);

  if (!collection) {
    return null;
  }

  const url =
    `/!/sve/section-meta?collection=${encodeURIComponent(collection)}&set=${encodeURIComponent(setHandle)}`;

  const res = await win.fetch(url, {
    credentials: 'same-origin',
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
  });

  if (!res.ok) {
    return null;
  }

  const data = await res.json();

  sectionMetaCache.set(setHandle, data);

  return data;
}

/** The section object to insert for a library card of the given kind. */
function buildSectionRow(win, kind, item, defaults, newId) {
  const base = {
    ...JSON.parse(JSON.stringify(defaults || {})),
    _id: newId,
    _visual_id: newUuid(win),
    enabled: true,
  };

  if (kind === 'page') {
    return { ...base, type: item.handle };
  }

  if (kind === 'global') {
    // A reference — the template renders the source's current sections. The set
    // and its entries field share one handle, so the row is built from it.
    const set = globalSectionSet(win);

    return { ...base, type: set, [set]: [item.id] };
  }

  // custom: an independent copy with fresh ids, laid over the type's defaults so
  // any fields added since it was saved still get sensible values.
  return {
    ...base,
    ...reidSection(win, item.section_data || {}),
    _id: newId,
    _visual_id: newUuid(win),
    enabled: true,
    type: item.section_type,
  };
}

/**
 * Inserts a library card's section: fetches the set's fresh meta, builds the
 * row from it, and drops it in at `afterUid` (null = top). Async because the
 * meta round-trip is what lets the row render in the CP list, not only the
 * preview.
 */
async function insertSection(win, doc, afterUid, kind, item) {
  if (kind === 'template') {
    return insertTemplate(win, doc, afterUid, item);
  }

  const meta = await fetchSetMeta(win, setHandleFor(win, kind, item));
  const newId = newRowId();
  const row = buildSectionRow(win, kind, item, meta?.defaults, newId);

  insertSectionAfter(win, doc, afterUid, row, meta?.new || null);
}

/**
 * Drops a whole template onto the page.
 *
 * Every section in it is copied — a template is a stencil, never a reference —
 * and each one is laid over its type's current defaults, so a template saved
 * before a field existed still gets a sensible value for it.
 *
 * Meta is fetched per section *type*, not per row: the Replicator renders each row
 * from `meta.<field>.existing[<_id>]`, so without it the sections would appear in
 * the preview and be missing from the CP list.
 */
async function insertTemplate(win, doc, afterUid, item) {
  const sections = (item.sections || []).filter((section) => section && section.type);

  if (!sections.length) {
    win.Statamic?.$toast?.error(t(win, 'template_empty'));

    return;
  }

  const mode = await askTemplateMode(win, item);

  if (!mode) {
    return; // cancelled
  }

  const rows = [];
  const metas = [];

  for (const section of sections) {
    const meta = await fetchSetMeta(win, section.type);
    const newId = newRowId();

    rows.push(
      buildSectionRow(win, 'custom', { section_data: section, section_type: section.type }, meta?.defaults, newId)
    );
    metas.push(meta?.new || null);
  }

  insertSectionsAfter(win, doc, afterUid, rows, metas, mode === 'replace');
}

/**
 * The multi-row sibling of `insertSectionAfter`: all of a template's sections in
 * one write.
 *
 * One `setFieldValue` for the lot, not one per section — each call re-renders the
 * Replicator, so inserting fifteen sections one at a time would be fifteen
 * re-renders and fifteen preview reloads.
 */
function insertSectionsAfter(win, doc, afterUid, rows, rowMetas, replace) {
  const field = sectionField(win);

  for (const container of activeContainers(doc)) {
    const values = unwrapRef(container.values);

    if (!values || typeof values !== 'object') {
      continue;
    }

    const existing = dataGet(values, field);

    if (!Array.isArray(existing)) {
      continue;
    }

    rows.forEach((row, index) => writeSetMeta(container, field, row, rowMetas[index]));

    if (replace) {
      container.setFieldValue(field, rows);

      return true;
    }

    if (afterUid == null) {
      container.setFieldValue(field, [...rows, ...JSON.parse(JSON.stringify(existing))]);

      return true;
    }

    const found = rowLocation(values, afterUid);

    if (!found) {
      continue;
    }

    const next = JSON.parse(JSON.stringify(found.rows));

    next.splice(found.index + 1, 0, ...rows);
    container.setFieldValue(found.parentPath, next);

    return true;
  }

  return false;
}

/**
 * Replace what's on the page, or add to it?
 *
 * Asked every time rather than remembered: dropping a template on an empty page
 * and dropping one onto a page you've already built are different intentions, and
 * replacing is not undoable from here.
 */
function askTemplateMode(win, item) {
  return new Promise((resolve) => {
    const doc = win.document;
    const overlay = doc.createElement('div');

    overlay.style.cssText =
      'position:fixed;inset:0;z-index:2147483600;display:flex;align-items:center;justify-content:center;' +
      'background:rgba(0,0,0,.45);font-family:ui-sans-serif,system-ui,sans-serif;';

    const card = doc.createElement('div');

    card.style.cssText =
      'width:420px;max-width:92vw;background:var(--theme-color-content-bg,#fff);color:currentColor;' +
      'border-radius:12px;padding:22px;box-shadow:0 24px 64px rgba(0,0,0,.35);';
    card.innerHTML =
      `<div style="font-size:15px;font-weight:600;margin-bottom:6px;">${item.title}</div>` +
      `<div style="font-size:13px;opacity:.7;line-height:1.45;margin-bottom:18px;">${t(win, 'template_mode_body', {
        count: (item.sections || []).length,
      })}</div>` +
      '<div data-sve-actions style="display:flex;justify-content:flex-end;gap:8px;flex-wrap:wrap;"></div>';

    const actions = card.querySelector('[data-sve-actions]');
    const close = (value) => {
      overlay.remove();
      resolve(value);
    };

    const button = (label, style, value) => {
      const btn = doc.createElement('button');

      btn.type = 'button';
      btn.textContent = label;
      btn.style.cssText = `all:unset;cursor:pointer;padding:8px 14px;border-radius:8px;font-size:13px;${style}`;
      btn.addEventListener('click', () => close(value));
      actions.appendChild(btn);
    };

    button(t(win, 'cancel'), 'opacity:.7;color:currentColor;', null);
    button(t(win, 'template_replace'), 'color:currentColor;background:rgba(128,128,128,.16);font-weight:500;', 'replace');
    button(t(win, 'template_append'), 'background:var(--theme-color-primary,#4f46e5);color:#fff;font-weight:600;', 'append');

    overlay.addEventListener('click', (event) => event.target === overlay && close(null));
    overlay.appendChild(card);
    doc.body.appendChild(overlay);
  });
}

function closeSectionPicker(win) {
  win.document.getElementById(SECTION_PICKER_ID)?.remove();
  syncPreviewInset(win);
}

/**
 * Only one right-hand panel at a time.
 *
 * They all dock to the same edge, so two open at once means one is hidden behind
 * the other — and the preview holding room for a panel you can't see. Opening any
 * of them closes the rest; `keep` is the one being opened. Called with nothing to
 * close them all, which is what leaving Live Preview does.
 */
function closeRightPanels(win, keep = null) {
  if (keep !== SECTION_PICKER_ID) {
    closeSectionPicker(win);
  }

  if (keep !== GLOBALS_PANEL_ID) {
    closeGlobalsPanel(win);
  }

  if (keep !== GLOBAL_SECTION_PANEL_ID) {
    closeGlobalSectionPanel(win);
  }
}

/**
 * Right-hand panels (this picker, the globals panel) dock at the viewport edge.
 * Rather than overlay the preview, they PUSH it — the same way the left editor
 * pane does — by reserving room on the right of the centering container so the
 * iframe reflows and stays fully visible. Reserves the widest open panel.
 */
function syncPreviewInset(win) {
  const doc = win.document;
  const el = doc.querySelector('.live-preview-contents');

  if (!el) {
    return;
  }

  const px = rightPanelWidth(doc);

  el.style.transition = 'padding-right .2s ease';
  el.style.paddingRight = px ? `${px}px` : '';

  // Anything else floating over the preview has to clear the panel too.
  positionLpBackButton(win);
}

/** How much of the right edge the open panel is taking, in px (0 if none). */
function rightPanelWidth(doc) {
  let px = 0;

  for (const id of [SECTION_PICKER_ID, GLOBALS_PANEL_ID, GLOBAL_SECTION_PANEL_ID]) {
    const panel = doc.getElementById(id);

    if (panel) {
      px = Math.max(px, Math.round(panel.getBoundingClientRect().width));
    }
  }

  return px;
}

// The section library is a docked panel, not a popup: it stays open while you
// work, and you drag a card straight into the preview to place it (or click to
// drop it at the end). The pending drag lives here so the ext-drop reply from
// the bridge knows what to insert.
let libraryDrag = null;

/** Opens/creates the docked section library. Toggles closed if already open. */
function openSectionPicker(win) {
  const doc = win.document;

  if (doc.getElementById(SECTION_PICKER_ID)) {
    closeSectionPicker(win);

    return;
  }

  closeRightPanels(win, SECTION_PICKER_ID);

  const header = lpHeader(doc);
  const top = header ? Math.round(header.getBoundingClientRect().bottom) : 0;

  const panel = doc.createElement('div');

  panel.id = SECTION_PICKER_ID;
  panel.style.cssText =
    `position:fixed;top:${top}px;right:0;bottom:0;width:340px;z-index:41;display:flex;flex-direction:column;` +
    'background:var(--theme-color-content-bg,#fff);color:currentColor;' +
    'border-left:1px solid rgba(128,128,128,.28);box-shadow:-8px 0 24px rgba(0,0,0,.18);' +
    'font-family:ui-sans-serif,system-ui,sans-serif;';

  panel.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 14px;border-bottom:1px solid rgba(128,128,128,.2);flex:0 0 auto;">
      <div style="font-size:14px;font-weight:600;">Sektioner</div>
      <button type="button" data-sve-close style="all:unset;cursor:pointer;width:26px;height:26px;display:inline-flex;align-items:center;justify-content:center;border-radius:6px;opacity:.7;">✕</button>
    </div>
    <div style="padding:6px 10px;font-size:11px;opacity:.6;flex:0 0 auto;">${t(win, 'library_hint')}</div>
    <div data-sve-tabs style="display:flex;gap:3px;padding:2px 12px 0;flex:0 0 auto;"></div>
    <div data-sve-grid style="flex:1 1 auto;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:12px;"></div>
  `;

  doc.body.appendChild(panel);
  syncPreviewInset(win);

  const tabsEl = panel.querySelector('[data-sve-tabs]');
  const gridEl = panel.querySelector('[data-sve-grid]');

  panel.querySelector('[data-sve-close]').addEventListener('click', () => closeSectionPicker(win));

  const tabs = [
    { key: 'page', label: t(win, 'tab_page') },
    { key: 'custom', label: t(win, 'tab_custom') },
    { key: 'global', label: t(win, 'tab_global') },
    { key: 'template', label: t(win, 'tab_templates') },
  ];
  let active = 'page';
  let saved = null;
  let templates = null;

  // Block layout, not flex: a flex column here collapsed the image to its
  // content height and let it overflow the card. A plain block with a 16:9
  // image (its content absolutely positioned, so the ratio sets the height) and
  // a title beneath renders identically on every tab.
  const card = (title, imageUrl, kind, item) => {
    const el = doc.createElement('div');

    el.style.cssText =
      'cursor:grab;flex:0 0 auto;border:1px solid rgba(128,128,128,.25);border-radius:10px;overflow:hidden;' +
      'background:rgba(128,128,128,.05);transition:border-color .12s;user-select:none;touch-action:none;';
    el.addEventListener('mouseenter', () => (el.style.borderColor = 'var(--theme-color-primary,#4f46e5)'));
    el.addEventListener('mouseleave', () => (el.style.borderColor = 'rgba(128,128,128,.25)'));
    el.innerHTML = `
      <div style="position:relative;width:100%;height:177px;background:rgba(128,128,128,.12);overflow:hidden;pointer-events:none;">
        ${
          imageUrl
            ? `<img src="${imageUrl}" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:top;display:block;">`
            : `<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;opacity:.4;font-size:12px;">${t(win, 'no_preview')}</div>`
        }
      </div>
      <div style="padding:8px 10px;font-size:12px;font-weight:500;pointer-events:none;">${title}</div>
    `;

    beginCardDrag(win, el, kind, item);

    return el;
  };

  const empty = (text) => {
    const el = doc.createElement('div');

    el.style.cssText = 'padding:30px 6px;text-align:center;opacity:.55;font-size:12px;';
    el.textContent = text;

    return el;
  };

  const renderPage = () => {
    gridEl.innerHTML = '';

    const types = sectionTypes(win);

    if (!types.length) {
      gridEl.appendChild(empty(t(win, 'no_section_types')));

      return;
    }

    types.forEach((type) => gridEl.appendChild(card(type.display, type.image_url, 'page', type)));
  };

  const renderSaved = (synced) => {
    gridEl.innerHTML = '';

    const items = (saved || []).filter((s) => !!s.synced === synced);

    if (!items.length) {
      gridEl.appendChild(
        empty(
          synced
            ? t(win, 'no_global_sections')
            : t(win, 'no_saved_sections')
        )
      );

      return;
    }

    items.forEach((item) =>
      gridEl.appendChild(card(item.title, item.preview_url, synced ? 'global' : 'custom', item))
    );
  };

  // A template's card carries the whole page, so it says how many sections that
  // is — the picture alone can't tell you whether you're about to drop three
  // sections or fifteen.
  const renderTemplates = () => {
    gridEl.innerHTML = '';

    const save = doc.createElement('button');

    save.type = 'button';
    save.textContent = t(win, 'save_page_as_template');
    save.style.cssText =
      'all:unset;cursor:pointer;flex:0 0 auto;text-align:center;padding:10px;border-radius:8px;font-size:12px;' +
      'font-weight:600;background:var(--theme-color-primary,#4f46e5);color:#fff;';
    save.addEventListener('click', () => savePageAsTemplate(win, () => {
      templates = null;
      renderActive();
    }));
    gridEl.appendChild(save);

    if (!(templates || []).length) {
      gridEl.appendChild(empty(t(win, 'no_templates')));

      return;
    }

    templates.forEach((item) =>
      gridEl.appendChild(
        card(`${item.title} · ${t(win, 'template_count', { count: item.count })}`, item.preview_url, 'template', item)
      )
    );
  };

  const renderActive = () => {
    tabsEl.querySelectorAll('button').forEach((b) => {
      const on = b.dataset.tab === active;

      b.style.background = on ? 'rgba(128,128,128,.2)' : 'transparent';
      b.style.fontWeight = on ? '600' : '500';
      b.style.opacity = on ? '1' : '.7';
    });

    if (active === 'page') {
      renderPage();

      return;
    }

    if (active === 'template') {
      if (templates === null) {
        gridEl.innerHTML = '';
        gridEl.appendChild(empty(t(win, 'loading')));

        win
          .fetch('/!/sve/templates', { credentials: 'same-origin', headers: { 'X-Requested-With': 'XMLHttpRequest' } })
          .then((res) => res.json())
          .then((data) => {
            templates = data.templates || [];
            renderTemplates();
          })
          .catch(() => {
            templates = [];
            gridEl.innerHTML = '';
            gridEl.appendChild(empty(t(win, 'templates_failed')));
          });

        return;
      }

      renderTemplates();

      return;
    }

    if (saved === null) {
      gridEl.innerHTML = '';
      gridEl.appendChild(empty(t(win, 'loading')));

      win
        .fetch('/!/sve/saved-sections', { credentials: 'same-origin', headers: { 'X-Requested-With': 'XMLHttpRequest' } })
        .then((res) => res.json())
        .then((data) => {
          saved = data.sections || [];
          renderSaved(active === 'global');
        })
        .catch(() => {
          saved = [];
          gridEl.innerHTML = '';
          gridEl.appendChild(empty(t(win, 'saved_sections_failed')));
        });

      return;
    }

    renderSaved(active === 'global');
  };

  tabs.forEach((tab) => {
    const b = doc.createElement('button');

    b.type = 'button';
    b.dataset.tab = tab.key;
    b.textContent = tab.label;
    b.style.cssText = 'all:unset;cursor:pointer;padding:6px 12px;border-radius:8px;font-size:12px;color:currentColor;';
    b.addEventListener('click', () => {
      active = tab.key;
      renderActive();
    });
    tabsEl.appendChild(b);
  });

  renderActive();
}

/**
 * Pointer drag on a library card. Below the threshold it's a click (drop at the
 * end); beyond it, the preview zooms out and shows a drop line, and releasing
 * drops the section where the line is. The preview owns the zoom + line + target
 * detection; this side just forwards the pointer and inserts on the reply.
 */
function beginCardDrag(win, cardEl, kind, item) {
  cardEl.addEventListener('pointerdown', (event) => {
    if (event.button !== 0 || libraryDrag) {
      return;
    }

    event.preventDefault();
    cardEl.setPointerCapture(event.pointerId);

    const doc = win.document;
    const frame = previewFrame(doc);
    const startX = event.clientX;
    const startY = event.clientY;
    let active = false;
    let ghost = null;

    const toPreview = (e) => {
      const r = frame.getBoundingClientRect();

      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };

    const start = () => {
      active = true;
      // The iframe would swallow the pointer once we're over it — let this window
      // keep the events, and map the coordinates ourselves.
      frame.style.pointerEvents = 'none';
      frame.contentWindow.postMessage({ source: 'statamic-visual-editor', type: 'ext-drag-start' }, win.location.origin);

      ghost = cardEl.cloneNode(true);
      ghost.style.cssText +=
        ';position:fixed;z-index:2147483647;pointer-events:none;width:220px;opacity:.9;transform:rotate(1.5deg);box-shadow:0 12px 32px rgba(0,0,0,.3);';
      doc.body.appendChild(ghost);
    };

    const onMove = (e) => {
      if (!active) {
        if (Math.hypot(e.clientX - startX, e.clientY - startY) < 6) {
          return;
        }

        start();
      }

      const p = toPreview(e);

      frame.contentWindow.postMessage(
        { source: 'statamic-visual-editor', type: 'ext-drag-move', x: p.x, y: p.y },
        win.location.origin
      );

      if (ghost) {
        ghost.style.left = `${e.clientX - 110}px`;
        ghost.style.top = `${e.clientY - 16}px`;
      }
    };

    const onUp = (e) => {
      win.removeEventListener('pointermove', onMove);
      win.removeEventListener('pointerup', onUp);
      win.removeEventListener('pointercancel', onUp);
      ghost?.remove();

      if (!active) {
        // A click: drop at the end of the page.
        insertSection(win, doc, lastSectionUid(doc), kind, item);

        return;
      }

      // The bridge replies with ext-drop → the message listener inserts.
      libraryDrag = { kind, item };
      frame.style.pointerEvents = '';
      frame.contentWindow.postMessage(
        { source: 'statamic-visual-editor', type: 'ext-drag-end', cancelled: e.type === 'pointercancel' },
        win.location.origin
      );
    };

    win.addEventListener('pointermove', onMove);
    win.addEventListener('pointerup', onUp);
    win.addEventListener('pointercancel', onUp);
  });
}

/** The uid of the last top-level page section in the preview (for click-append). */
function lastSectionUid(doc) {
  const frame = previewFrame(doc);
  const inner = frame?.contentDocument;
  const sections = inner ? [...inner.querySelectorAll('section[data-sid], article[data-sid]')] : [];

  return sections.length ? sections[sections.length - 1].getAttribute('data-sid') : null;
}

/** A fresh row id in the same shape Statamic uses for replicator/grid rows. */
function newRowId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

/**
 * A blank row modelled on an existing one.
 *
 * Copying the row's shape rather than building one from the blueprint: the
 * blueprint isn't reachable from here, and a row that's missing keys renders
 * wrong. Text is cleared, ids are regenerated, and everything else is kept —
 * so a new button arrives with the same styling and an empty label, ready to
 * fill in, rather than as something the template can't render.
 */
function blankRowFrom(row) {
  const next = {};

  for (const [key, value] of Object.entries(row)) {
    if (key === 'id' || key === '_id') {
      next[key] = newRowId();
    } else if (key === '_visual_id') {
      next[key] = crypto?.randomUUID ? crypto.randomUUID() : `${newRowId()}-${newRowId()}`;
    } else if (typeof value === 'string') {
      next[key] = '';
    } else {
      next[key] = JSON.parse(JSON.stringify(value ?? null));
    }
  }

  return next;
}

/**
 * Walks the container meta alongside the values to the field meta at `path`.
 * Meta mirrors the values tree but keys array rows by their `_id`
 * (`existing[<_id>]`) rather than by index, so numeric path segments are
 * resolved through the value at that index. Returns null if the path can't be
 * followed.
 */
function metaForPath(fullMeta, values, path) {
  let meta = fullMeta;
  let val = values;

  for (const seg of path.split('.')) {
    if (meta == null) {
      return null;
    }

    if (/^\d+$/.test(seg)) {
      const row = Array.isArray(val) ? val[Number(seg)] : null;

      if (!row || !meta.existing) {
        return null;
      }

      meta = meta.existing[row._id];
      val = row;
    } else {
      meta = meta[seg];
      val = val ? val[seg] : null;
    }
  }

  return meta;
}

/**
 * A new row for an orderable field, pre-filled with the field's DEFAULT values
 * (from the grid meta) so the CP inputs show them and inline editing works right
 * away — matching what Statamic's own "Add row" does. Text-only defaults live in
 * `meta.<field>.defaults`; replicators (per-set defaults) have none, so those
 * fall back to a blank clone of the neighbouring row.
 */
function newRowFor(win, container, values, parentPath, sampleRow) {
  const fullMeta = unwrapRef(container.meta);
  const fieldMeta = fullMeta ? metaForPath(fullMeta, values, parentPath) : null;
  const defaults = fieldMeta && typeof fieldMeta === 'object' ? fieldMeta.defaults : null;

  if (!defaults || typeof defaults !== 'object' || Array.isArray(defaults)) {
    return blankRowFrom(sampleRow);
  }

  const row = JSON.parse(JSON.stringify(defaults));

  row._id = newRowId();

  if ('_visual_id' in row || (sampleRow && '_visual_id' in sampleRow)) {
    row._visual_id = newUuid(win);
  }

  return row;
}

/** The array a row lives in, plus its index. */
function rowLocation(values, uid) {
  const path = findPathByUid(values, uid);
  const dot = path === null ? -1 : path.lastIndexOf('.');

  if (dot === -1) {
    return null;
  }

  const parentPath = path.slice(0, dot);
  const index = Number(path.slice(dot + 1));
  const rows = dataGet(values, parentPath);

  if (!Array.isArray(rows) || !Number.isInteger(index)) {
    return null;
  }

  return { parentPath, index, rows };
}

/**
 * What the blueprint allows for the field this row lives in (max_rows/min_rows,
 * or max_sets/min_sets on a replicator). Looked up by the containing set's type
 * first, since the same handle appears in several sets with different limits.
 */
function rowLimits(values, parentPath, win) {
  const all = win.Statamic?.$config?.get?.('sveRowLimits') ?? {};
  const handle = parentPath.slice(parentPath.lastIndexOf('.') + 1);
  const dot = parentPath.lastIndexOf('.');
  const set = dot === -1 ? null : dataGet(values, parentPath.slice(0, dot));
  const type = set && typeof set === 'object' ? set.type : null;

  return (type ? all[`${type}.${handle}`] : null) ?? all[handle] ?? {};
}

/** "+" on an orderable row: add another one just after it, within the field's max. */
export function handleAddRow(data, doc, win) {
  for (const container of activeContainers(doc)) {
    const values = unwrapRef(container.values);

    if (!values || typeof values !== 'object') {
      continue;
    }

    const found = rowLocation(values, data.uid);

    if (!found) {
      continue;
    }

    const { parentPath, index, rows } = found;
    const { max } = rowLimits(values, parentPath, win);

    if (max && rows.length >= max) {
      return; // the field is full — the CP wouldn't allow it either
    }

    const next = JSON.parse(JSON.stringify(rows));

    next.splice(index + 1, 0, newRowFor(win, container, values, parentPath, rows[index]));
    container.setFieldValue(parentPath, next);

    return;
  }
}

/** "−" on an orderable row: take it out, unless the field's min needs it. */
export function handleRemoveRow(data, doc, win) {
  for (const container of activeContainers(doc)) {
    const values = unwrapRef(container.values);

    if (!values || typeof values !== 'object') {
      continue;
    }

    const found = rowLocation(values, data.uid);

    if (!found) {
      continue;
    }

    const { parentPath, index, rows } = found;
    const { min } = rowLimits(values, parentPath, win);

    if (min && rows.length <= min) {
      return; // removing it would take the field below its minimum
    }

    const next = JSON.parse(JSON.stringify(rows));

    next.splice(index, 1);
    container.setFieldValue(parentPath, next);

    return;
  }
}

/**
 * Answers the preview's row-caps request: whether the row's field can take
 * another row / lose this one, given its min/max. Lets the preview grey out the
 * +/− that would break the limit (the limit is still enforced here too).
 */
export function handleRowCaps(data, doc, win) {
  for (const container of activeContainers(doc)) {
    const values = unwrapRef(container.values);

    if (!values || typeof values !== 'object') {
      continue;
    }

    const found = rowLocation(values, data.uid);

    if (!found) {
      continue;
    }

    const { parentPath, rows } = found;
    const { min, max } = rowLimits(values, parentPath, win);
    const count = rows.length;

    sendToPreview(
      {
        source: 'statamic-visual-editor',
        type: 'row-caps-result',
        uid: data.uid,
        canAdd: !max || count < max,
        canRemove: !min || count > min,
      },
      win
    );

    return;
  }
}

/**
 * "Rediger global sektion": a synced section's content belongs to the saved entry,
 * not to this page — so its own editor is docked beside the preview, and what's
 * typed in it is stashed so the page around it re-renders live. Editing in
 * context, without leaving the page or giving the section a URL of its own.
 */
export function handleOpenGlobalSection(data, win) {
  if (!data.id) {
    return;
  }

  openGlobalSectionPanel(win, data.id);
}

/**
 * The gear on a section in the preview: open that section's own settings popup
 * (spacing, colours, …) — the very one the panel's "Show settings" button opens,
 * so every fieldtype and condition inside it behaves exactly as it always has.
 *
 * The set has to be expanded first: a collapsed set keeps its fields behind
 * v-show, and the popup measures layout as it opens — clicked while hidden it
 * does nothing at all.
 */
export function handleSectionSettings(data, doc, win) {
  const setEl = findSetByUid(data.uid, doc) ?? sortableItemForUid(data.uid, doc);

  if (!setEl) {
    return;
  }

  // Expand ONCE. Expanding is a toggle and Vue applies it asynchronously, so a
  // second nudge while the first is still pending closes the set right back up.
  [...collectAncestorSets(setEl), setEl].forEach(expandSet);

  let attempts = 0;
  let revealed = false;

  const open = () => {
    // Some sections hide their settings behind a revealer — open it first. It's a
    // toggle, so it gets exactly one click.
    if (!revealed) {
      const revealer = settingsRevealer(setEl);

      if (revealer && /^(show|vis)/i.test((revealer.textContent || '').trim())) {
        revealer.click();
        revealed = true;
      }
    }

    // A collapsed set renders no fields, and revealing takes a beat — just wait.
    if (!sectionSettingsFields(setEl).length) {
      if (++attempts < 30) {
        setTimeout(open, 200);
      }

      return;
    }

    // Let Vue settle before isolating; fall back to showing the whole section if
    // the settings can't be pinned down.
    setTimeout(() => {
      if (!soloSectionSettings(data.uid, doc, win)) {
        soloSection(data.uid, doc, win);
      }

      forcePanelOpen = true;
      setLpCollapsed(win, false);
    }, 250);
  };

  open();
}

/**
 * The section's own "Show settings" revealer.
 *
 * Settings aren't a popup — `show_settings` is a `revealer` fieldtype that
 * unhides the section's `settings` fields in place. Sections are full of buttons
 * that say much the same thing (every button row and column has its own), so the
 * section's is picked by nesting: its fields sit in the set's own field list,
 * everything else's are one or more field lists further in.
 */
function settingsRevealer(setEl) {
  const depth = (el) => {
    let levels = 0;

    for (let node = el.parentElement; node && node !== setEl; node = node.parentElement) {
      if (node.classList?.contains('publish-fields')) {
        levels++;
      }
    }

    return levels;
  };

  // Found by fieldtype, not by label: the field is *called* "Show settings", but
  // the button Statamic renders inside it reads "Show Fields".
  return [...setEl.querySelectorAll('.revealer-fieldtype button')].sort(
    (a, b) => depth(a) - depth(b)
  )[0];
}

/**
 * The panel row for a top-level array item, located via the form values: the
 * uid's path ("page_sections.3") gives the field handle and index, and the
 * sortable rows render in values order.
 */
function sortableItemForUid(uid, doc) {
  for (const container of activeContainers(doc)) {
    const values = unwrapRef(container.values);

    if (!values || typeof values !== 'object') {
      continue;
    }

    const path = findPathByUid(values, uid);
    const match = path?.match(/^([^.]+)\.(\d+)$/);

    if (!match) {
      continue;
    }

    return doc.querySelectorAll(`.field_${match[1]}-sortable-item`)[Number(match[2])] ?? null;
  }

  return null;
}

// --- Live Preview: collapsible editor panel ----------------------------------
//
// Inline editing makes the publish form optional for everyday text tweaks, so
// the editor pane starts collapsed — the preview gets the full width. A toggle
// button injected into the live-preview header brings it back.
//
// Collapsing moves the pane off-screen (position:absolute; left:-10000px)
// instead of display:none: the pane keeps real layout, which the column
// builder's popup-opening machinery depends on (with display:none its
// components report zero rects and the popup silently fails to open). The
// popup itself portals to document.body, so it shows fine while collapsed.

const LP_TOGGLE_ID = '__sve-lp-toggle';
const LP_MODE_ID = '__sve-lp-mode';
const LP_MODE_KEY = 'sve-lp-panel-mode';

// The panel runs in one of three modes, chosen in the header and remembered
// across sessions:
//   hide — never opens, not even when something in the preview is clicked
//   auto — closed until something in the preview is clicked, then opens on it
//   show — always open
const LP_MODES = ['hide', 'auto', 'show'];
const LP_MODE_LABELS = { hide: 'Hide', auto: 'Auto', show: 'Show' };

// Collapse state for the current Live Preview session (auto mode moves it at
// runtime). null = not initialized (live preview closed); derived from the
// stored mode on next mount.
let lpCollapsed = null;

// Set while a section's settings are on show — see ensureLpPanelToggle.
let forcePanelOpen = false;

function lpMode(win) {
  try {
    const stored = win.localStorage.getItem(LP_MODE_KEY);

    return LP_MODES.includes(stored) ? stored : 'hide';
  } catch {
    return 'hide';
  }
}

function setLpMode(win, mode) {
  try {
    win.localStorage.setItem(LP_MODE_KEY, mode);
  } catch {
    /* private mode */
  }

  // Switching to Show reveals the FULL form, like the old open-toggle did.
  if (mode === 'show') {
    clearSolo(win.document);
  }

  setLpCollapsed(win, mode !== 'show');
}

/**
 * A preview interaction (clicking a section, an inline field, …) wants the
 * panel open. Whether it gets it depends on the mode — in `hide` it never does.
 * Returns whether the panel is (now) available.
 */
function autoOpenPanel(win) {
  if (lpMode(win) === 'hide') {
    return false;
  }

  setLpCollapsed(win, false);

  return true;
}

function setLpCollapsed(win, collapsed) {
  lpCollapsed = collapsed;

  ensureLpPanelToggle(win);
}

// --- Single-section ("solo") panel ---------------------------------------------
// Clicking a section in the preview opens the editor panel showing ONLY that
// section's fields — instead of the whole page_sections list. Isolation is done
// the Vue-safe way: mark the path from the section's set up to the editor root
// with attributes, then hide everything else via an injected <style>. We never
// insert nodes into, or set inline display on, Statamic's Vue-managed field
// tree — doing so corrupts Vue's virtual-DOM diffing and tears the whole form
// down. A MutationObserver re-applies the marks whenever Vue re-renders the
// fields (e.g. when a set is expanded), so isolation survives re-renders.

const SOLO_STYLE_ID = 'sve-solo-style';
const SOLO_BACK_ID = 'sve-solo-back';
const SOLO_SAVE_ID = 'sve-solo-save';
const SOLO_PARENT_ATTR = 'data-sve-solo-parent';
const SOLO_KEEP_ATTR = 'data-sve-solo-keep';

let soloUid = null;
let soloObserver = null;

/** Removes all solo marks, the injected style, the observer and the back button. */
export function clearSolo(doc) {
  soloUid = null;

  if (soloObserver) {
    soloObserver.disconnect();
    soloObserver = null;
  }

  doc.getElementById(SOLO_STYLE_ID)?.remove();
  doc.getElementById(SOLO_BACK_ID)?.remove();
  doc.getElementById(SOLO_SAVE_ID)?.remove();
  doc.querySelectorAll(`[${SOLO_PARENT_ATTR}]`).forEach((el) => el.removeAttribute(SOLO_PARENT_ATTR));
  doc.querySelectorAll(`[${SOLO_KEEP_ATTR}]`).forEach((el) => el.removeAttribute(SOLO_KEEP_ATTR));
}

function ensureSoloStyle(doc) {
  if (doc.getElementById(SOLO_STYLE_ID)) {
    return;
  }

  const style = doc.createElement('style');

  style.id = SOLO_STYLE_ID;
  // Hide every child that is not on the kept path. Pure CSS — Vue keeps managing
  // the real DOM; only computed visibility changes.
  style.textContent = `[${SOLO_PARENT_ATTR}] > *:not([${SOLO_KEEP_ATTR}]) { display: none !important; }`;
  doc.head.appendChild(style);
}

/**
 * Back-to-full-form control, appended to the body (outside the Vue tree). When a
 * `saveUid` is given (settings view), a "Gem sektion" button is placed beside it
 * so the section can be saved as a template right from the panel — the same
 * action as the hover control's bookmark, offered "begge steder".
 */
function addSoloBackButton(doc, win, saveUid = null) {
  if (doc.getElementById(SOLO_BACK_ID)) {
    return;
  }

  const header = lpHeader(doc);
  // A header pill, styled like the others — grey, not a floating white button.
  const pill =
    'display:inline-flex;align-items:center;gap:6px;height:28px;padding:0 12px;border:none;' +
    'border-radius:8px;background:rgba(128,128,128,.16);color:currentColor;cursor:pointer;' +
    'font-size:12px;font-weight:500;font-family:inherit;';
  // Drop it into the header where the publish tabs would sit, so "back to all
  // sections" reads as part of the same row of controls.
  const anchor =
    doc.getElementById(SETTINGS_TABS_ID) ||
    doc.getElementById(HEADER_TOOLBAR_ID)?.querySelector('button[data-tab="settings"]');

  const btn = doc.createElement('button');

  btn.id = SOLO_BACK_ID;
  btn.type = 'button';
  btn.innerHTML = `<span style="font-size:15px;line-height:1;">&#8249;</span><span>${t(win, 'all_sections')}</span>`;
  btn.style.cssText = pill;
  btn.addEventListener('mouseenter', () => (btn.style.background = 'rgba(128,128,128,.28)'));
  btn.addEventListener('mouseleave', () => (btn.style.background = 'rgba(128,128,128,.16)'));
  btn.addEventListener('click', () => {
    // Leaving a settings view hands the panel back to whatever mode is selected;
    // leaving an ordinary solo view leaves the panel exactly as it was.
    const wasSettings = forcePanelOpen;

    forcePanelOpen = false;
    clearSolo(doc);

    if (wasSettings) {
      setLpCollapsed(win, lpMode(win) !== 'show');
    }
  });

  if (anchor) {
    anchor.after(btn);
  } else if (header) {
    header.insertBefore(btn, header.firstChild);
  } else {
    doc.body.appendChild(btn);
  }

  if (!saveUid) {
    return;
  }

  const save = doc.createElement('button');

  save.id = SOLO_SAVE_ID;
  save.type = 'button';
  save.innerHTML =
    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
    'stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    `<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg><span>${t(win, 'save_section')}</span>`;
  save.style.cssText = pill;
  save.addEventListener('mouseenter', () => (save.style.background = 'rgba(128,128,128,.28)'));
  save.addEventListener('mouseleave', () => (save.style.background = 'rgba(128,128,128,.16)'));
  save.addEventListener('click', () => handleSaveSection({ uid: saveUid }, doc, win));

  btn.after(save);
}

/**
 * Marks the path from the target set up to the editor root: each parent gets
 * SOLO_PARENT_ATTR, each child on the path gets SOLO_KEEP_ATTR. Combined with
 * the injected style, this hides every off-path element. Returns true on success.
 */
function markSoloPath(uid, editor, doc) {
  doc.querySelectorAll(`[${SOLO_PARENT_ATTR}]`).forEach((el) => el.removeAttribute(SOLO_PARENT_ATTR));
  doc.querySelectorAll(`[${SOLO_KEEP_ATTR}]`).forEach((el) => el.removeAttribute(SOLO_KEEP_ATTR));

  const setEl = findSetByUid(uid, doc);

  if (!setEl || !editor.contains(setEl)) {
    return false;
  }

  let node = setEl;

  while (node && node !== editor && node.parentElement) {
    node.setAttribute(SOLO_KEEP_ATTR, '');
    node.parentElement.setAttribute(SOLO_PARENT_ATTR, '');
    node = node.parentElement;
  }

  // Expand the set (and any ancestor sets) so its fields show.
  [...collectAncestorSets(setEl), setEl].forEach(expandSet);

  return true;
}

/**
 * Isolates a section's settings — and nothing else — in the editor panel.
 *
 * Reuses the solo marking, only starting deeper: instead of keeping the path down
 * to the whole set, it keeps the path down to the set's own `settings` fields, so
 * the panel shows the spacing/colour controls alone. Several fields can be kept
 * at once (settings plus its per-breakpoint siblings) — the style only hides
 * children that aren't marked, so marked siblings all survive.
 */
export function soloSectionSettings(uid, doc, win) {
  const setEl = findSetByUid(uid, doc);
  const editor = doc.querySelector('.live-preview-editor');

  if (!setEl || !editor || !editor.contains(setEl)) {
    return false;
  }

  soloUid = uid;

  const apply = () => {
    const targets = sectionSettingsFields(setEl);

    if (!targets.length) {
      return false;
    }

    ensureSoloStyle(doc);

    doc.querySelectorAll(`[${SOLO_PARENT_ATTR}]`).forEach((el) => el.removeAttribute(SOLO_PARENT_ATTR));
    doc.querySelectorAll(`[${SOLO_KEEP_ATTR}]`).forEach((el) => el.removeAttribute(SOLO_KEEP_ATTR));

    targets.forEach((target) => {
      for (let node = target; node && node !== editor && node.parentElement; node = node.parentElement) {
        node.setAttribute(SOLO_KEEP_ATTR, '');
        node.parentElement.setAttribute(SOLO_PARENT_ATTR, '');
      }
    });

    addSoloBackButton(doc, win, uid);

    return true;
  };

  if (!apply()) {
    return false;
  }

  if (soloObserver) {
    soloObserver.disconnect();
  }

  const target = doc.querySelector('.live-preview-fields') || editor;

  soloObserver = new MutationObserver(() => {
    if (soloUid === uid && !doc.querySelector(`[${SOLO_KEEP_ATTR}]`)) {
      apply();
    }
  });
  soloObserver.observe(target, { childList: true, subtree: true });

  return true;
}

// A section's settings are a tabby field (the Farver / Spacing / Custom css tabs),
// sometimes alongside a breakpoint switcher for the per-device values. Targeting
// the fieldtypes, not field ids: in Statamic 6 the `field_…` ids are on the inputs
// themselves, not on any wrapper, so there is nothing to match a handle against.
const SETTINGS_FIELDTYPES = '.tabby-fieldtype, [class*="breakpoint-fieldtype"]';

/**
 * The section's own settings fields.
 *
 * Everything nested in a section brings settings of its own — every button row,
 * every column — and they render the same fieldtypes. The section's are the least
 * deeply nested: they sit in the set's own field list, the rest one or more field
 * lists further in.
 */
function sectionSettingsFields(setEl) {
  const depth = (el) => {
    let levels = 0;

    for (let node = el.parentElement; node && node !== setEl; node = node.parentElement) {
      if (node.classList?.contains('publish-fields')) {
        levels++;
      }
    }

    return levels;
  };

  const fields = [...setEl.querySelectorAll(SETTINGS_FIELDTYPES)];

  if (!fields.length) {
    return [];
  }

  const shallowest = Math.min(...fields.map(depth));

  return fields.filter((el) => depth(el) === shallowest);
}

/**
 * Isolates one section in the editor panel. Returns false when the set can't be
 * located at all (caller falls back to normal focus). Marks are re-applied on
 * every field re-render via a MutationObserver.
 */
/**
 * Make the sections tab the one on screen.
 *
 * Sections live in the first publish tab. If another tab (SEO, Sidebar) is
 * selected when you open a section, its fields sit in a tab panel the CP has
 * hidden — so isolating them shows nothing. Switching back first is what keeps the
 * section from opening into a blank panel.
 */
function activateSectionsTab(win) {
  const first = nativeTabButtons(win.document)[0];

  if (first && first.getAttribute('aria-selected') !== 'true') {
    ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click'].forEach((type) => {
      first.dispatchEvent(new win.PointerEvent(type, { bubbles: true, cancelable: true }));
    });
  }
}

export function soloSection(uid, doc, win) {
  if (!uid || !findSetByUid(uid, doc)) {
    return false;
  }

  soloUid = uid;

  const apply = () => {
    const editor = doc.querySelector('.live-preview-editor');

    if (!editor) {
      return;
    }

    activateSectionsTab(win); // guarded — only clicks when it isn't already showing

    ensureSoloStyle(doc);

    if (markSoloPath(uid, editor, doc)) {
      addSoloBackButton(doc, win);
    }
  };

  apply();
  setTimeout(apply, 180); // once the tab switch above has re-rendered the fields

  // Re-apply whenever Vue rebuilds the field tree (expanding a set, live-preview
  // refresh, …). Guarded so our own marking doesn't loop: we only act when the
  // marks have gone missing.
  if (soloObserver) {
    soloObserver.disconnect();
  }

  const target = doc.querySelector('.live-preview-fields') || doc.querySelector('.live-preview-editor');

  if (target) {
    soloObserver = new MutationObserver(() => {
      if (soloUid !== uid) {
        return;
      }

      if (!doc.querySelector(`[${SOLO_KEEP_ATTR}]`)) {
        apply();
      }
    });
    soloObserver.observe(target, { childList: true, subtree: true });
  }

  return true;
}

/**
 * Injects the panel toggle when the Live Preview screen is (re)mounted, and
 * enforces the desired collapse state. Called from initCp's MutationObserver:
 * the editor pane mounts AFTER the header, so the state must be re-asserted on
 * subsequent mutations rather than applied once at injection time.
 */
export function ensureLpPanelToggle(win) {
  const doc = win.document;
  const header = lpHeader(doc);

  if (!header) {
    // Live preview closed — forget session state; next open re-reads the mode.
    // The docked panels belong to the preview, so they go with it: left behind,
    // they'd hang over the ordinary publish form with nothing to preview into.
    // The floating back pill lives on document.body (outside Vue), so it must be
    // removed explicitly — otherwise it survives into the ordinary CP dashboard.
    lpCollapsed = null;
    clearSolo(doc);
    closeRightPanels(win);
    removeLpBackButton(doc);

    return;
  }

  if (lpCollapsed === null) {
    lpCollapsed = lpMode(win) !== 'show';
  }

  // Opening a section's settings holds the panel open for as long as they're
  // shown, whatever the mode says — otherwise the observer that re-applies the
  // mode on every Vue re-render slams it shut again a moment later.
  if (forcePanelOpen) {
    lpCollapsed = false;
  }

  let icon = doc.getElementById(LP_TOGGLE_ID);

  if (!icon) {
    // The panel glyph is purely an indicator — the mode buttons next to it do
    // the switching. Drawn with borders so it follows the CP theme color.
    icon = doc.createElement('span');
    icon.id = LP_TOGGLE_ID;
    icon.innerHTML =
      '<span style="display:inline-block;width:16px;height:12px;border:1.5px solid currentColor;' +
      'border-radius:3px;position:relative;"><span style="position:absolute;left:4px;top:0;bottom:0;' +
      'width:1.5px;background:currentColor;"></span></span>';
    icon.style.cssText =
      'display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;color:currentColor;';
    header.insertBefore(icon, header.firstChild);
  }

  icon.style.opacity = lpCollapsed ? '0.6' : '1';

  let group = doc.getElementById(LP_MODE_ID);

  if (!group) {
    group = doc.createElement('div');
    group.id = LP_MODE_ID;
    group.style.cssText =
      'display:inline-flex;align-items:center;gap:2px;padding:2px;' +
      'border-radius:8px;background:rgba(128,128,128,.16);font-family:inherit;';

    LP_MODES.forEach((mode) => {
      const btn = doc.createElement('button');

      btn.type = 'button';
      btn.dataset.mode = mode;
      btn.textContent = LP_MODE_LABELS[mode];
      btn.style.cssText =
        'padding:4px 10px;border:none;border-radius:6px;cursor:pointer;background:transparent;' +
        'color:currentColor;font-size:12px;font-weight:500;line-height:1;';
      btn.addEventListener('click', () => setLpMode(win, mode));
      group.appendChild(btn);
    });

    icon.after(group);
  }

  const active = lpMode(win);

  group.querySelectorAll('button').forEach((btn) => {
    const on = btn.dataset.mode === active;

    // A light-grey pill on the active mode, with the text left in the theme's own
    // colour — no forced black.
    btn.style.background = on ? 'rgba(128,128,128,.45)' : 'transparent';
    btn.style.color = 'currentColor';
    btn.style.opacity = on ? '1' : '.75';
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
  });

  ensureGlobalsPicker(win);
  ensureSectionLibraryButton(win);
  ensureCollectionPicker(win);
  enhanceGrids(win);

  // Collapse all of the above into the icon toolbar — one control at a time.
  ensureHeaderToolbar(win);
  applyHeaderTab(win);

  const editor = doc.querySelector('.live-preview-editor');

  if (editor) {
    const want = lpCollapsed ? '-10000px' : '';

    if (editor.style.left !== want) {
      editor.style.position = lpCollapsed ? 'absolute' : '';
      editor.style.left = want;
      editor.style.top = lpCollapsed ? '0' : '';
    }
  }

  ensureLpBackButton(win);
  positionLpBackButton(win);
}

// --- Header toolbar: one control at a time -------------------------------------
//
// The header used to show every control at once — the panel mode, the collection
// picker, the globals dropdown, the sections button. For an editor a customer
// uses, that's noise. This collapses them to a row of icons; clicking one reveals
// only its control and hides the rest. The settings icon is the important one: it
// opens the editor panel and mirrors its tabs (Main/SEO/Sidebar, read live so a
// renamed tab just follows) into the header, plus a Save — so "edit the SEO" is
// one obvious click, not a hunt.

const HEADER_TOOLBAR_ID = '__sve-toolbar';
const SETTINGS_TABS_ID = '__sve-settings-tabs';

// null = nothing expanded (the simplest header). Persisted so it survives the
// header being rebuilt on every preview update.
let headerTab = undefined;

function loadHeaderTab(win) {
  if (headerTab !== undefined) {
    return;
  }

  try {
    headerTab = win.localStorage.getItem('sve-header-tab') || null;
  } catch {
    headerTab = null;
  }
}

function setHeaderTab(win, tab) {
  headerTab = tab;

  try {
    tab ? win.localStorage.setItem('sve-header-tab', tab) : win.localStorage.removeItem('sve-header-tab');
  } catch {
    /* private mode */
  }
}

const TOOLBAR_ICONS = {
  // The panel glyph — the same mark that used to sit alone as the mode indicator.
  settings:
    '<span style="display:inline-block;width:16px;height:12px;border:1.5px solid currentColor;' +
    'border-radius:3px;position:relative;"><span style="position:absolute;left:4px;top:0;bottom:0;' +
    'width:1.5px;background:currentColor;"></span></span>',
  pages:
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" style="display:block"><rect x="4" y="3" width="16" height="18" rx="2"/>' +
    '<line x1="8" y1="8" x2="16" y2="8"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="8" y1="16" x2="13" y2="16"/></svg>',
  globals:
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" style="display:block"><circle cx="12" cy="12" r="9"/>' +
    '<line x1="3" y1="12" x2="21" y2="12"/><path d="M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18"/></svg>',
  sections:
    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" style="display:block"><rect x="3" y="3" width="7" height="7" rx="1"/>' +
    '<rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>' +
    '<rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
};

/** The icon row at the far left of the Live Preview header. */
function ensureHeaderToolbar(win) {
  const doc = win.document;
  const header = lpHeader(doc);

  if (!header || doc.getElementById(HEADER_TOOLBAR_ID)) {
    return;
  }

  const bar = doc.createElement('div');

  bar.id = HEADER_TOOLBAR_ID;
  bar.style.cssText = 'display:inline-flex;align-items:center;gap:8px;margin-right:8px;';

  [
    { key: 'settings', title: t(win, 'panel') },
    { key: 'pages', title: t(win, 'pages') },
    { key: 'globals', title: t(win, 'globals') },
    { key: 'sections', title: t(win, 'sections') },
  ].forEach((tab) => {
    const btn = doc.createElement('button');

    btn.type = 'button';
    btn.dataset.tab = tab.key;
    btn.title = tab.title;
    btn.innerHTML = TOOLBAR_ICONS[tab.key];
    btn.style.cssText =
      'width:32px;height:30px;display:inline-flex;align-items:center;justify-content:center;' +
      'border:none;border-radius:8px;cursor:pointer;background:transparent;color:currentColor;';
    btn.addEventListener('click', () => toggleHeaderTab(win, tab.key));
    bar.appendChild(btn);
  });

  header.insertBefore(bar, header.firstChild);
}

function toggleHeaderTab(win, key) {
  const active = headerTab === key;

  if (key === 'sections') {
    // Its "expanded" form is the docked panel, not a header control.
    setHeaderTab(win, active ? null : 'sections');
    openSectionPicker(win); // toggles

    if (!active) {
      setLpCollapsed(win, true); // give the preview its width back
    }

    applyHeaderTab(win);

    return;
  }

  // Switching to an inline control closes any docked right panel — one thing out
  // at a time.
  closeRightPanels(win);
  setHeaderTab(win, active ? null : key);

  // The settings tab is the editor panel. Move the MODE with it, not just the
  // panel — an open panel while Hide stays lit is a contradiction. Opening → Show,
  // closing → Hide, so Hide/Auto/Show always tells the truth about what's on
  // screen.
  if (key === 'settings') {
    setLpMode(win, active ? 'hide' : 'show');
  }

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
function ensureSettingsTabs(win) {
  const doc = win.document;
  const bar = doc.getElementById(HEADER_TOOLBAR_ID);

  if (!bar) {
    return null;
  }

  let group = doc.getElementById(SETTINGS_TABS_ID);

  if (!group) {
    group = doc.createElement('div');
    group.id = SETTINGS_TABS_ID;
    group.style.cssText =
      'display:none;align-items:center;gap:2px;padding:2px;border-radius:8px;' +
      'background:rgba(128,128,128,.16);font-family:inherit;';
    bar.after(group);
  }

  const nativeTabs = nativeTabButtons(doc);

  // Rebuild if the set of tabs changed (count or labels) — cheap, and keeps a
  // renamed or blueprint-specific tab in step.
  const signature = nativeTabs.map((tabEl) => tabEl.textContent.trim()).join('|');

  if (group.dataset.sig !== signature) {
    group.dataset.sig = signature;
    group.innerHTML = '';

    // Skip the first tab (Main): its content is the sections, which you edit in
    // the preview itself — so it has no place in the settings row.
    nativeTabs.forEach((tabEl, index) => {
      if (index === 0) {
        return;
      }

      const btn = doc.createElement('button');

      btn.type = 'button';
      btn.dataset.tabIndex = String(index);
      btn.textContent = tabEl.textContent.trim();
      btn.style.cssText =
        'padding:4px 10px;border:none;border-radius:6px;cursor:pointer;background:transparent;' +
        'color:currentColor;font-size:12px;font-weight:500;line-height:1;';
      btn.addEventListener('click', () => clickNativeTab(win, index));
      group.appendChild(btn);
    });
  }

  // Highlight the selected tab only when its content is actually on screen. With
  // the panel closed nothing is shown, so nothing should look active — a lit-up
  // SEO with no SEO in sight is just a lie.
  const panelOpen = !lpCollapsed;

  group.querySelectorAll('[data-tab-index]').forEach((btn) => {
    const selected = nativeTabs[Number(btn.dataset.tabIndex)]?.getAttribute('aria-selected') === 'true';
    const on = panelOpen && selected;

    btn.style.background = on ? 'rgba(128,128,128,.45)' : 'transparent';
    btn.style.color = 'currentColor';
    btn.style.opacity = on ? '1' : '.75';
  });

  return group;
}

/**
 * The publish tabs actually on screen. reka-ui renders a hidden measurement copy
 * of the tab list alongside the live one, so filtering to what's visible is what
 * keeps a click landing on the real tab rather than its ghost.
 */
function nativeTabButtons(doc) {
  return [...(doc.querySelector('.live-preview-editor')?.querySelectorAll('button[role="tab"]') ?? [])].filter(
    (el) => el.offsetParent !== null
  );
}

/** Switch the editor panel to a publish tab by clicking its real tab button. */
function clickNativeTab(win, index) {
  const fire = () => {
    const el = nativeTabButtons(win.document)[index];

    if (!el) {
      return;
    }

    // reka-ui's tabs switch on the full pointer sequence, not a bare .click(),
    // and they want real PointerEvents.
    ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click'].forEach((type) => {
      el.dispatchEvent(new win.PointerEvent(type, { bubbles: true, cancelable: true }));
    });

    setTimeout(() => ensureSettingsTabs(win), 60); // re-highlight the new selection
  };

  // Asking for a tab means asking to see it — so an open panel is implied. On
  // Hide the panel is closed and its tabs aren't even rendered yet, so switch to
  // Show first and let them mount before clicking. Leaving the mode on Hide while
  // showing a tab would just be a contradiction.
  if (lpMode(win) === 'hide' || lpCollapsed) {
    setLpMode(win, 'show');
    setTimeout(fire, 140);
  } else {
    fire();
  }
}

/** Show the control for the active tab, hide the rest, light up the active icon. */
/** Hide Statamic's "Live Preview" header label — it names the obvious. */
function hideLpLabel(doc) {
  const header = lpHeader(doc);

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

function applyHeaderTab(win) {
  const doc = win.document;

  loadHeaderTab(win);
  hideLpLabel(doc);

  // The standalone panel glyph and the old Hide/Auto/Show group are replaced by
  // the toolbar — keep them out of the way.
  const glyph = doc.getElementById(LP_TOGGLE_ID);

  if (glyph) {
    glyph.style.display = 'none';
  }

  // The sections icon in the toolbar replaces the old "Sektioner" text button.
  const lib = doc.getElementById(LIBRARY_BUTTON_ID);

  if (lib) {
    lib.style.display = 'none';
  }

  const settingsTabs = ensureSettingsTabs(win);
  const controls = {
    settings: settingsTabs,
    pages: doc.getElementById(COLLECTION_PICKER_ID)?.parentElement,
    globals: doc.getElementById(GLOBALS_PICKER_ID),
  };

  // Hide/Auto/Show lives under the settings tab — the same tab that owns the
  // panel it controls.
  const modeGroup = doc.getElementById(LP_MODE_ID);

  if (modeGroup) {
    modeGroup.style.display = headerTab === 'settings' ? 'inline-flex' : 'none';
  }

  Object.entries(controls).forEach(([key, el]) => {
    if (el) {
      el.style.display = headerTab === key ? 'inline-flex' : 'none';
    }
  });

  // Each control sits directly after the icon it belongs to, so it reads as
  // connected to it. Guarded — moving a node on every call would trip the
  // observer that re-runs this into a loop.
  const bar = doc.getElementById(HEADER_TOOLBAR_ID);
  const iconOf = (tab) => bar?.querySelector(`button[data-tab="${tab}"]`);
  const place = (anchor, el) => {
    if (anchor && el && anchor.nextElementSibling !== el) {
      anchor.after(el);
    }
  };

  const settingsIcon = iconOf('settings');

  place(settingsIcon, modeGroup); // Hide/Auto/Show
  place(modeGroup || settingsIcon, settingsTabs); // then the publish tabs
  place(iconOf('pages'), controls.pages);
  place(iconOf('globals'), controls.globals);

  const sectionsOpen = !!doc.getElementById(SECTION_PICKER_ID);

  // Only the icon buttons — the control groups now live inside the toolbar too,
  // and a bare querySelectorAll('button') would reach in and wipe the highlight
  // off Hide/Auto/Show and the tabs.
  doc.getElementById(HEADER_TOOLBAR_ID)?.querySelectorAll(':scope > button[data-tab]').forEach((btn) => {
    const on = btn.dataset.tab === headerTab || (btn.dataset.tab === 'sections' && sectionsOpen);

    btn.style.background = on ? 'rgba(128,128,128,.30)' : 'transparent';
    btn.style.opacity = on ? '1' : '.7';
  });
}

// --- Grid rows: collapse to a title, one open at a time ------------------------
//
// Statamic's Grid (stacked) shows every row's fields in full, which eats the
// editor panel when a grid has several rows. This turns each row into an
// accordion item — the header collapses to a one-line title (the first field's
// value), and opening one closes the others — the way the Replicator already
// behaves. Rows are Statamic's own DOM: a `.grid-stacked > <panel>` with a
// `<header>` (drag handle + duplicate/delete) and a fields body beside it. We
// only mark and toggle; Vue keeps owning the DOM.

const GRID_ROW_ATTR = 'data-sve-grid-row';
const GRID_COLLAPSED_ATTR = 'data-sve-grid-collapsed';
const GRID_DONE_ATTR = 'data-sve-grid-done';
const GRID_STYLE_ID = 'sve-grid-accordion-style';

function ensureGridStyle(doc) {
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
const GRID_TITLE_SKIP = [
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
function gridRowTitle(row) {
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

function setGridRowCollapsed(row, collapsed) {
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
function isGridRow(el) {
  return el.matches('div') && !!el.querySelector(':scope > header');
}

function enhanceGridRow(win, row, stacked) {
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
function enhanceGrids(win) {
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

const LP_BACK_ID = '__sve-lp-back';

/** How long to wait for a save to come back before giving the button up again. */
const LP_SAVE_TIMEOUT = 15000;

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
function leaveEditor(win, link, leave, { publish = true } = {}) {
  if (link.dataset.busy) {
    return;
  }

  const save = saveButtonIn(win.document);
  const hasPublish = !!publishButtonIn(win.document);
  const saveOnly = hasPublish && !publish;

  if (!save) {
    if (!saveOnly) {
      leave();
    }

    return;
  }

  if (!hasUnsavedChanges(win)) {
    if (saveOnly) {
      return;
    }

    // Revisions on + publish requested but nothing dirty: still publish the
    // current working copy if a Publish button exists, then leave.
    if (hasPublish && publish) {
      runBusy(win, link, (release, setLabel) => {
        postToHost(win, 'lp-leaving');
        publishWorkingCopy(win, {
          onSuccess: () => leaveQuietly(win, leave),
          onFailure: release,
          onPublishing: () => setLabel(t(win, 'publishing')),
        });
      });

      return;
    }

    leave();

    return;
  }

  runBusy(win, link, (release, setLabel) => {
    setLabel(t(win, 'saving'));

    if (!saveOnly) {
      postToHost(win, 'lp-leaving');
    }

    let settled = false;

    const stop = onEntrySave((ok) => {
      if (settled) {
        return;
      }

      // Revisions off, or save-only: one step.
      if (!hasPublish || saveOnly) {
        settled = true;
        stop();
        clearTimeout(timer);

        if (!ok) {
          release();

          return;
        }

        if (saveOnly) {
          release();
        } else {
          leaveQuietly(win, leave);
        }

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

      publishWorkingCopy(win, {
        onSuccess: () => leaveQuietly(win, leave),
        onFailure: release,
        onPublishing: () => setLabel(t(win, 'publishing')),
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
  });
}

/** Marks the back-pill busy, runs `work`, and gives it release/setLabel helpers. */
function runBusy(win, link, work) {
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
function entryPublishUrl(win) {
  return `${win.location.pathname.replace(/\/$/, '')}/publish`;
}

/**
 * Publish the working copy with no dialog — the same POST Statamic's "Publish
 * Now" makes, minus the notes field.
 *
 * Waits until the form is clean (Publish would be enabled) so we never race the
 * preceding Save Changes.
 */
function publishWorkingCopy(win, { onSuccess, onFailure, onPublishing } = {}) {
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

    // Mirror canPublish: dirty form → wait; Publish button disabled → wait.
    const button = publishButtonIn(win.document);

    if (hasUnsavedChanges(win) || button?.disabled) {
      if (++attempts > 50) {
        finish(false);

        return;
      }

      enableTimer = win.setTimeout(tryPublish, 100);

      return;
    }

    onPublishing?.();

    const rearm = disarmUnloadWarning(win);

    win
      .fetch(entryPublishUrl(win), {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'X-CSRF-TOKEN': csrfToken(win),
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
 * "Back to the live site" in the Live Preview header. Closing Live Preview with
 * the × drops you into the admin — which is exactly the thing we're trying to
 * keep people out of when they arrived from the front end.
 *
 * When we're embedded in the site's edit overlay, this doesn't navigate at all:
 * it asks the site to close the overlay. The page is still sitting there
 * underneath, untouched, so returning is instant and nothing re-animates.
 */
const LP_BACK_MENU_ID = '__sve-lp-back-menu';

/**
 * Keeps the floating back button below the header and clear of whatever panel is
 * docked right.
 *
 * Re-measured on every re-render rather than once: the header isn't at its final
 * height on the first pass, and a top measured then leaves the pill sitting on
 * top of it. A no-op when nothing actually moved — this runs on every mutation,
 * and rebuilding on each would tear the menu away mid-click.
 */
function positionLpBackButton(win) {
  const doc = win.document;
  const pill = doc.getElementById(LP_BACK_ID);

  if (!pill) {
    return;
  }

  const header = lpHeader(doc);
  const top = `${(header ? Math.round(header.getBoundingClientRect().bottom) : 0) + 16}px`;
  const right = `${rightPanelWidth(doc) + 16}px`;

  if (pill.style.top !== top || pill.style.right !== right) {
    pill.style.top = top;
    pill.style.right = right;
    // The menu is anchored to where the pill *was* — it can't follow, so it goes.
    doc.getElementById(LP_BACK_MENU_ID)?.remove();
  }

  tellPreviewWherePillIs(win, pill);
}

/**
 * Hands the preview the pill's box, in the preview's own coordinates.
 *
 * A tall section's hover control pins to its top-right — the same corner the pill
 * floats in — and the bridge can't see the pill to dodge it: it lives in the CP
 * window. Sending the real geometry (rather than assuming a fixed offset) is what
 * keeps this right in the device-preview modes too, where the iframe is narrower
 * and centred, and the pill isn't over the page at all.
 */
function tellPreviewWherePillIs(win, pill) {
  const frame = previewFrame(win.document);

  if (!frame) {
    return;
  }

  const f = frame.getBoundingClientRect();
  const r = pill.getBoundingClientRect();

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

/** Tear down the floating back pill (and its menu) when Live Preview closes. */
function removeLpBackButton(doc) {
  doc.getElementById(LP_BACK_MENU_ID)?.remove();
  doc.getElementById(LP_BACK_ID)?.remove();
}

/**
 * "Back" — return to the live site when embedded, or close Live Preview when
 * opened from the dashboard.
 */
function ensureLpBackButton(win) {
  const doc = win.document;
  const header = lpHeader(doc);

  if (!header || doc.getElementById(LP_BACK_ID)) {
    return;
  }

  const embedded = isEmbeddedInSite(win);
  const visit = [...doc.querySelectorAll('a')].find((a) => /visit url|besøg url/i.test(a.textContent || ''));
  const href = visit?.getAttribute('href');

  const pill = doc.createElement('a');

  pill.id = LP_BACK_ID;
  pill.href = href ?? '#';
  pill.title = t(win, embedded ? 'back_to_site_title' : 'back_to_admin_title');
  pill.innerHTML =
    '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" ' +
    'stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M11 18h3.75a5.25 5.25 0 1 0 0-10.5H5M7.5 4L4 7.5L7.5 11"></path>' +
    `</svg><span>${t(win, embedded ? 'back_to_site' : 'back_to_admin')}</span>`;
  pill.style.cssText =
    'position:fixed;z-index:2147483000;display:inline-flex;align-items:center;' +
    'padding:9px;border-radius:999px;background:#18181b;color:#fff;text-decoration:none;' +
    'font:500 13px/1 ui-sans-serif,system-ui,sans-serif;white-space:nowrap;cursor:pointer;' +
    'box-shadow:0 4px 14px rgba(0,0,0,.28);transition:right .2s ease,top .2s ease,padding .18s ease;';

  const label = pill.querySelector('span');

  label.style.cssText =
    'max-width:0;opacity:0;overflow:hidden;white-space:nowrap;' +
    'transition:max-width .18s ease,opacity .18s ease,margin-left .18s ease;';

  const expand = () => {
    pill.style.padding = '9px 14px 9px 11px';
    label.style.maxWidth = '200px';
    label.style.opacity = '1';
    label.style.marginLeft = '7px';
  };

  const collapse = () => {
    if (doc.getElementById(LP_BACK_MENU_ID) || pill.dataset.busy) {
      return;
    }

    pill.style.padding = '9px';
    label.style.maxWidth = '0';
    label.style.opacity = '0';
    label.style.marginLeft = '0';
  };

  pill.addEventListener('mouseenter', expand);
  pill.addEventListener('mouseleave', collapse);
  pill.sveExpand = expand;
  pill.sveCollapse = collapse;

  const leave = () => leaveLivePreview(win, href || pill.href);

  pill.addEventListener('click', (event) => {
    event.preventDefault();

    if (doc.getElementById(LP_BACK_MENU_ID)) {
      doc.getElementById(LP_BACK_MENU_ID).remove();

      return;
    }

    if (!hasUnsavedChanges(win) || !saveButtonIn(doc)) {
      leave();

      return;
    }

    openLpBackMenu(win, pill, leave);
  });

  doc.body.appendChild(pill);
  positionLpBackButton(win);
}

/**
 * Leave Live Preview the way you entered it:
 * - Embedded → close overlay onto the entry's front-end URL.
 * - From dashboard → close Live Preview and stay in admin.
 */
function leaveLivePreview(win, fallbackUrl = null) {
  if (isEmbeddedInSite(win)) {
    const visitNow = [...win.document.querySelectorAll('a')].find((a) =>
      /visit url|besøg url/i.test(a.textContent || '')
    );
    const url = visitNow?.getAttribute('href') || fallbackUrl || null;

    postToHost(win, 'lp-close', url ? { url } : {});

    return;
  }

  closeLivePreviewUi(win);
}

/** Click Statamic's Live Preview × so we stay on the admin entry form. */
function closeLivePreviewUi(win) {
  const header = lpHeader(win.document);

  if (!header) {
    return;
  }

  const buttons = [...header.querySelectorAll('button')];
  const close =
    buttons.find((button) => {
      const label = `${button.getAttribute('aria-label') || ''} ${button.title || ''}`.trim();

      return /^(close|luk)\b/i.test(label);
    }) ||
    [...buttons].reverse().find((button) => {
      const text = (button.textContent || '').trim();

      return text === '' && button.querySelector('svg');
    });

  close?.click();
}

/** Ways out when there are unsaved changes (revisions → three choices). */
function openLpBackMenu(win, pill, leave) {
  const doc = win.document;
  const menu = doc.createElement('div');
  const rect = pill.getBoundingClientRect();
  const revisions = !!publishButtonIn(doc);
  const embedded = isEmbeddedInSite(win);

  menu.id = LP_BACK_MENU_ID;
  menu.style.cssText =
    `position:fixed;z-index:2147483001;top:${Math.round(rect.bottom + 8)}px;` +
    `right:${Math.round(win.innerWidth - rect.right)}px;min-width:${Math.max(190, Math.round(rect.width))}px;` +
    'display:flex;flex-direction:column;padding:5px;border-radius:10px;background:#18181b;' +
    'box-shadow:0 12px 32px rgba(0,0,0,.4);font:500 13px/1.2 ui-sans-serif,system-ui,sans-serif;';

  const item = (label, onClick, primary) => {
    const btn = doc.createElement('button');

    btn.type = 'button';
    btn.textContent = label;
    btn.style.cssText =
      'all:unset;cursor:pointer;padding:9px 12px;border-radius:7px;white-space:nowrap;' +
      (primary ? 'color:#fff;' : 'color:rgba(255,255,255,.65);');
    btn.addEventListener('mouseenter', () => (btn.style.background = 'rgba(255,255,255,.12)'));
    btn.addEventListener('mouseleave', () => (btn.style.background = 'transparent'));
    btn.addEventListener('click', (event) => {
      event.stopPropagation();
      menu.remove();
      onClick();
    });
    menu.appendChild(btn);

    return btn;
  };

  const savePublishLabel = revisions
    ? t(win, embedded ? 'back_save_publish_and_leave' : 'back_save_publish_and_close')
    : t(win, embedded ? 'back_save_and_leave' : 'back_save_and_close');

  item(savePublishLabel, () => {
    pill.sveExpand?.();
    leaveEditor(win, pill, leave, { publish: true });
  }, true);

  if (revisions) {
    item(t(win, 'back_save_only'), () => {
      pill.sveExpand?.();
      leaveEditor(win, pill, leave, { publish: false });
    }, false);
  }

  item(t(win, embedded ? 'back_leave_only' : 'back_close_only'), leave, false);

  doc.body.appendChild(menu);

  const away = (event) => {
    if (menu.contains(event.target) || pill.contains(event.target)) {
      return;
    }

    menu.remove();
    pill.sveCollapse?.();
    doc.removeEventListener('click', away, true);
  };

  setTimeout(() => doc.addEventListener('click', away, true), 0);
}

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
function insertButtonOf(item) {
  const holder =
    item.querySelector(':scope > [id^="reka-popover-trigger"]') ??
    [...item.children].find((c) => c.classList?.contains('justify-center')) ??
    null;

  return holder?.querySelector('button') ?? null;
}

/**
 * The picker is a popover anchored to its trigger. With the editor panel parked
 * off-canvas the trigger sits off-screen, so a list-view popover would render
 * off-screen too — centre it when that happens. (Grid view is a centred modal
 * and needs no help.)
 */
function ensurePickerVisible(doc, win) {
  let attempts = 0;

  const run = () => {
    const input = doc.querySelector('input[placeholder*="Search Sets" i], input[placeholder*="Search" i]');

    if (!input) {
      if (++attempts < 25) {
        setTimeout(run, 100);
      }

      return;
    }

    let el = input;

    for (let i = 0; el && i < 12; i++) {
      const cs = win.getComputedStyle(el);

      if (cs.position === 'fixed' || cs.position === 'absolute') {
        break;
      }

      el = el.parentElement;
    }

    if (!el) {
      return;
    }

    const rect = el.getBoundingClientRect();

    if (rect.left >= 0 && rect.right <= win.innerWidth && rect.width > 0) {
      return; // already on screen
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
  };

  setTimeout(run, 80);
}

/**
 * Safety net for when the per-row insert trigger can't be used: the Replicator's
 * "Add Set" button appends the picked set at the very end, so we watch the
 * section array and, as soon as it grows, move the new set to sit right after
 * the section the "+" was clicked on. Same value-array machinery as handleMove.
 */
function repositionAfterAdd(uid, doc) {
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
  openSectionPicker(win);
}

/**
 * Drive Statamic's native Add Set picker to insert next to `setEl`. Shared by the
 * section "+" and the in-preview block "+": both just need the picker opened at
 * the right position, and Statamic does the insert (with correct meta) itself.
 */
function nativeAddSetAt(setEl, uid, doc, win) {
  const item = setEl.closest('[class*="sortable-item"]');

  if (!item?.parentElement) {
    return false;
  }

  // Walk the real row list (not nextElementSibling — a stray node between rows
  // must not throw the position off).
  const rows = [...item.parentElement.children].filter((c) =>
    /sortable-item/.test((c.className || '').toString())
  );
  const next = rows[rows.indexOf(item) + 1] ?? null;

  // Preferred: click the NEXT row's "insert before me" trigger — Statamic then
  // inserts exactly where we want and nothing else is needed.
  if (next) {
    const trigger = insertButtonOf(next);

    if (trigger) {
      trigger.click();
      ensurePickerVisible(doc, win);

      return true;
    }
  }

  // Otherwise the Replicator's own "Add Set" button, which appends at the end —
  // so unless this really is the last row, move the picked set into place after.
  const replicator = item.closest('.replicator-fieldtype-container') ?? doc;
  const addButton = [...replicator.querySelectorAll('button')].find((b) => /add set/i.test(b.textContent || ''));

  if (!addButton) {
    return false;
  }

  if (next) {
    repositionAfterAdd(uid, doc);
  }

  addButton.click();
  ensurePickerVisible(doc, win);

  return true;
}

/** Legacy: drive Statamic's native Add Set picker (kept for reference/fallback). */
export function handleAddSetNative(data, doc, win) {
  const setEl = findSetByUid(data.uid, doc);

  if (setEl) {
    nativeAddSetAt(setEl, data.uid, doc, win);
  }
}

/**
 * The in-preview "+" between a replicator's blocks, using Statamic's OWN Add Set
 * picker — the same one the CP shows, with search, groups and previews, and the
 * native insert so meta is never our problem.
 *
 * The catch is that the picker is driven from the CP form, where the block's row
 * only exists once its section is expanded. So we expand the section first, wait
 * for the block's row to mount, and then open the picker beside it. Empty field:
 * no block to sit by — open the picker from the replicator's own Add Set button.
 */
function handleAddBlockNative(data, doc, win) {
  const { anchorUid, sectionUid } = data;
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
        nativeAddSetAt(block, anchorUid, doc, win);

        return;
      }
    } else if (section) {
      const addButton = [...section.querySelectorAll('button')].find((b) => /add set/i.test(b.textContent || ''));

      if (addButton) {
        addButton.click();
        ensurePickerVisible(doc, win);

        return;
      }
    }

    if (++attempts < 25) {
      setTimeout(run, 100); // the row mounts a beat after the section expands
    }
  };

  setTimeout(run, 60);
}

export function createMessageListener(doc = document, win = window) {
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

        // Clicking (or inline-editing) a field also opens the panel showing ONLY
        // its section, same as clicking the section itself. data.scope is the
        // containing set's uid. In `hide` mode the panel stays closed.
        if (data.scope && autoOpenPanel(win)) {
          soloSection(data.scope, doc, win);
        }
      } else if (autoOpenPanel(win)) {
        // Clicking a section opens the panel showing ONLY that section. Falls
        // back to plain focus (e.g. nested rows without a resolvable set).
        if (!soloSection(data.uid, doc, win)) {
          handleFocus(data.uid, doc, data.afterSetUid, data.uidIndex ?? 0);
        }
      }
    } else if (data.type === 'edit-request') {
      handleEditRequest(data, doc, win);
    } else if (data.type === 'edit-input') {
      handleEditInput(data, doc);
    } else if (data.type === 'edit-end') {
      handleEditEnd(data);
    } else if (data.type === 'block-format') {
      handleBlockFormat(data);
    } else if (data.type === 'open-panel-field') {
      handleOpenPanelField(data, doc, win);
    } else if (data.type === 'bard-command') {
      handleBardCommand(data, doc, win);
    } else if (data.type === 'asset-edit') {
      handleAssetEdit(data, doc);
    } else if (data.type === 'link-edit') {
      handleLinkEdit(data, doc, win);
    } else if (data.type === 'move') {
      handleMove(data, doc);
    } else if (data.type === 'add-set') {
      handleAddSet(data, doc, win);
    } else if (data.type === 'cb-col-width') {
      handleColumnWidth(data, doc);
    } else if (data.type === 'open-global') {
      handleOpenGlobal(data, doc, win);
    } else if (data.type === 'add-row') {
      handleAddRow(data, doc, win);
    } else if (data.type === 'add-block-native') {
      handleAddBlockNative(data, doc, win);
    } else if (data.type === 'remove-row') {
      handleRemoveRow(data, doc, win);
    } else if (data.type === 'row-caps') {
      handleRowCaps(data, doc, win);
    } else if (data.type === 'open-global-section') {
      handleOpenGlobalSection(data, win);
    } else if (data.type === 'sve-pill-box-request') {
      const pill = doc.getElementById(LP_BACK_ID);

      if (pill) {
        tellPreviewWherePillIs(win, pill);
      }
    } else if (data.type === 'close-global-section') {
      closeGlobalSectionPanel(win);
    } else if (data.type === 'save-global-section') {
      // The bar's Save, driving the panel's real one.
      doc
        .getElementById(GLOBAL_SECTION_PANEL_ID)
        ?.querySelector('iframe')
        ?.contentWindow?.postMessage(
          { source: 'statamic-visual-editor', type: 'sve-globals-save' },
          win.location.origin
        );
    } else if (data.type === 'section-settings') {
      handleSectionSettings(data, doc, win);
    } else if (data.type === 'save-section') {
      handleSaveSection(data, doc, win);
    } else if (data.type === 'ext-drop') {
      // A section dragged in from the library was released — insert it where the
      // preview's drop line ended up (data.afterUid, null = at the top).
      if (libraryDrag) {
        insertSection(win, doc, data.afterUid ?? null, libraryDrag.kind, libraryDrag.item);
        libraryDrag = null;
      }
    } else if (data.type === 'cb-add-column') {
      handleAddColumn(data, doc, win);
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
/* Live Preview header: cluster icon, mode group and the "Live Preview" title on
   the left with an even gap; the actions keep the right edge. Statamic lays the
   header out with space-between, which strands the title mid-header. */
.live-preview-header {
  justify-content: flex-start !important;
  align-items: center !important;
  gap: 1.25rem;
}
.live-preview-header > :last-child {
  margin-left: auto;
}
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

/**
 * True when the CP is running inside the front end's edit overlay (a full-screen
 * iframe on the site) rather than as a page of its own.
 */
function isEmbeddedInSite(win) {
  return win.parent !== win.self;
}

/** Tell the hosting site something happened. No-op when we aren't embedded. */
function postToHost(win, type, data = {}) {
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
function previewPainted(doc) {
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
 * The front-end "Rediger" button opens this with ?live-preview=1 — open Live
 * Preview straight away by clicking the CP's own button, then drop the param so
 * a refresh doesn't reopen it.
 *
 * Two ways in:
 *  - Embedded in the site's edit overlay: the site keeps us invisible and
 *    crossfades us in, so we just report when the preview has painted.
 *  - Navigated to directly: we cover ourselves in the colour of the page we came
 *    from, so the admin never flashes up behind Live Preview.
 */
/**
 * Statamic's own "open Live Preview" button, found in whatever language the CP is
 * speaking — matching the English label alone left every other locale waiting on
 * the failsafe, staring at a blank cover.
 */
function livePreviewButton(doc) {
  return [...doc.querySelectorAll('button, a')].find((el) => {
    const text = `${el.textContent || ''} ${el.getAttribute('title') || ''}`;

    return /live.?preview|forhåndsvis|vorschau|voorbeeld|aperçu|vista previa/i.test(text);
  });
}

/**
 * The screen that stands in while Live Preview opens.
 *
 * Flat colour alone reads as "nothing is happening" — which is exactly what the
 * old cover looked like for the second or two it was up. The spinner says the
 * wait is deliberate, and the colour is the page you were just looking at, so it
 * feels like the page staying rather than the CMS loading.
 */
function buildLpCover(doc, background, { blocking = false } = {}) {
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

  cover.innerHTML =
    '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" ' +
    'stroke-linecap="round" style="opacity:.85;animation:sve-lp-spin 1s linear infinite;">' +
    '<path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>' +
    '<style>@keyframes sve-lp-spin{to{transform:rotate(360deg)}}</style>';

  return cover;
}


/**
 * Covers the screen *before* leaving, in the colour of the preview you're looking
 * at, and hands that colour to the next page so its own cover matches. Without
 * this the CP is bare for the moment between the click and the next page booting
 * — which is the whole reason switching pages felt like a trip through the
 * dashboard rather than a step sideways.
 */
function previewBackground(win) {
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

function coverForNavigation(win, { blocking = false } = {}) {
  const doc = win.document;
  const background = previewBackground(win);
  const cover = buildLpCover(doc, background, { blocking });

  doc.getElementById(LP_COVER_ID)?.remove();
  (doc.body ?? doc.documentElement).appendChild(cover);

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

function autoOpenLivePreview(win) {
  const params = new URLSearchParams(win.location.search);

  if (params.get('live-preview') !== '1') {
    return;
  }

  openLivePreviewCovered(win);
}

/**
 * Opens Live Preview behind a cover, and reveals once it has painted.
 *
 * Split out from the page-load path so an in-app navigation can reuse it: the
 * entry picker swaps pages without a reload, so there's no boot to hook into,
 * but the same "hide the CP, open the preview, fade in" is exactly what's wanted.
 */
function openLivePreviewCovered(win, { closePanels = false } = {}) {
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
      postToHost(win, 'lp-ready'); // the site fades its own overlay in
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

// Notified with `true`/`false` whenever the entry is written back (or fails to
// be). Watching the network rather than a Statamic event: `saved` is emitted on
// the publish component, not on a global bus, so there is nothing to listen to
// from out here.
const saveListeners = [];

function onEntrySave(callback) {
  saveListeners.push(callback);

  return () => {
    const index = saveListeners.indexOf(callback);

    if (index !== -1) {
      saveListeners.splice(index, 1);
    }
  };
}

/**
 * Watch for the entry being written back.
 *
 * Statamic saves an entry to the very URL its edit screen lives at, and publishes
 * to a path just below it. Anchoring on that path is what keeps the CP's other
 * chatter — Live Preview's own render POST, preference writes — from reading as a
 * save.
 */
function watchEntrySaves(win) {
  const entryPath = win.location.pathname;

  const isSave = (url, method) => {
    if (!url || !/^(POST|PUT|PATCH)$/i.test(method || 'GET')) {
      return false;
    }

    let path;

    try {
      path = new URL(url, win.location.origin).pathname;
    } catch {
      return false;
    }

    return path.startsWith(entryPath) && !path.includes('/preview');
  };

  const announce = (ok, rearm) => {
    if (ok) {
      // The site under the editor overlay is now showing stale content.
      postToHost(win, 'lp-saved');
    } else {
      rearm();
    }

    [...saveListeners].forEach((listener) => listener(ok));
  };

  const { fetch: originalFetch } = win;

  win.fetch = function (input, init = {}) {
    const url = typeof input === 'string' ? input : input?.url;
    const method = init.method ?? (typeof input === 'object' ? input?.method : null);

    if (!isSave(url, method)) {
      return originalFetch.call(this, input, init);
    }

    const rearm = disarmUnloadWarning(win);

    return originalFetch.call(this, input, init).then(
      (response) => {
        announce(response.ok, rearm);

        return response;
      },
      (error) => {
        announce(false, rearm);

        throw error;
      }
    );
  };

  const { open: originalOpen } = win.XMLHttpRequest.prototype;

  win.XMLHttpRequest.prototype.open = function (method, url, ...rest) {
    if (isSave(url, method)) {
      const rearm = disarmUnloadWarning(win);

      this.addEventListener('load', () => announce(this.status >= 200 && this.status < 300, rearm));
      this.addEventListener('error', () => announce(false, rearm));
    }

    return originalOpen.call(this, method, url, ...rest);
  };
}

/**
 * Statamic guards against losing unsaved edits with beforeunload handlers. From
 * the moment a save request is in flight, that guard can only misfire: the
 * content is already written server-side by the time anything reacts to it — and
 * things do react. In dev, Vite's full-reload sees the content file change and
 * reloads the site (this page's host) before the save response is even back,
 * which put up a "changes you made may not be saved" prompt about changes that
 * were being saved.
 *
 * So: stand the guard down when a save starts. Returns a re-arm function for
 * when the save fails and the edits genuinely are unsaved again.
 */
function disarmUnloadWarning(win) {
  const dirty = win.Statamic?.$dirty;

  if (!dirty) {
    return () => {};
  }

  let names = [];

  try {
    const raw = typeof dirty.names === 'function' ? dirty.names() : dirty.names;
    const list = unwrapRef(raw);

    names = Array.isArray(list) ? [...list] : [];
    dirty.disableWarning?.();
    names.forEach((name) => dirty.remove(name));
  } catch {
    /* best effort — worst case the browser asks */
  }

  return () => {
    try {
      names.forEach((name) => dirty.add(name));
    } catch {
      /* same */
    }
  };
}

/**
 * True when the open entry has edits that haven't been written back. Statamic
 * tracks this globally, keyed by publish-container name ("base" for the entry
 * form itself).
 */
function hasUnsavedChanges(win) {
  const dirty = win.Statamic?.$dirty;

  if (typeof dirty?.has !== 'function') {
    return true; // can't tell — saving is the safe side to be wrong on
  }

  const names = new Set(publishContainers.map((container) => container.name).filter(Boolean));

  names.add('base');

  return [...names].some((name) => dirty.has(name));
}

/**
 * Drops the dirty marks — what discarding means. Left up, they'd re-arm the
 * warning on the *next* navigation, long after the edits they stood for are gone.
 */
function discardChanges(win) {
  const dirty = win.Statamic?.$dirty;

  if (typeof dirty?.remove !== 'function') {
    return;
  }

  const names = new Set(publishContainers.map((container) => container.name).filter(Boolean));

  names.add('base');

  // Statamic's own list — it knows about containers we never saw.
  if (typeof dirty.names === 'function') {
    (dirty.names() ?? []).forEach((name) => names.add(name));
  }

  names.forEach((name) => dirty.remove(name));
}

/**
 * Calls off Statamic's own unsaved-changes confirm for the navigation we're about
 * to make. We've already asked — in our own dialog, in the middle of the screen —
 * and a second, native "Are you sure?" on top of that is just the same question
 * twice.
 *
 * Clearing the dirty marks is not enough on its own: the guard is a router
 * listener that fires its confirm unconditionally, and it's only unhooked by a
 * Vue watcher on the dirty list — which flushes on the next tick, after our visit
 * has already been cancelled. This is Statamic's own synchronous escape hatch,
 * the one its actions use for `bypassesDirtyWarning`.
 */
function dismissDirtyWarning(win) {
  win.Statamic?.$dirty?.disableWarning?.();
}

function saveButtonIn(doc) {
  const header = lpHeader(doc);

  return [...(header?.querySelectorAll('button') ?? [])].find((button) => {
    const text = (button.textContent || '').trim();

    if (isPublishButtonLabel(text)) {
      return false;
    }

    return /^(save|gem)\b/i.test(text);
  });
}

/**
 * "Publish…" / "Publicér…" — present only when revisions are enabled.
 */
function publishButtonIn(doc) {
  const header = lpHeader(doc);

  return [...(header?.querySelectorAll('button') ?? [])].find((button) =>
    isPublishButtonLabel((button.textContent || '').trim())
  );
}

function isPublishButtonLabel(text) {
  return /^(publish|udgiv|public[eé]r)\b/i.test(text);
}

/**
 * Leaving right when the save response lands races Statamic's own handling of
 * it: the dirty flag is still up for a beat, and unloading in that window makes
 * the browser ask "changes you made may not be saved" — about changes that WERE
 * just saved. So wait for the flag to drop, and disarm Statamic's unload warning
 * (its own switch for exactly this) as a backstop before leaving.
 */
function leaveQuietly(win, leave, attempts = 0) {
  if (hasUnsavedChanges(win) && attempts < 30) {
    setTimeout(() => leaveQuietly(win, leave, attempts + 1), 100);

    return;
  }

  try {
    win.Statamic?.$dirty?.disableWarning?.();
  } catch {
    /* best effort — worst case the browser asks */
  }

  leave();
}

// --- Globals beside Live Preview -------------------------------------------------
//
// A picker in the Live Preview header lists the global sets. Choosing one opens
// it in a panel on the right — as an iframe of Statamic's own globals screen, so
// every fieldtype, replicator and validation works exactly as it does in the CP.
// (The left editor pane belongs to Statamic's Vue tree; putting a second publish
// form in there tears the entry form down.)
//
// Typing in that form re-renders the preview immediately: the values are posted
// to the addon, which stashes them for the session, and the preview is asked to
// render again with `sve_globals=1` — the middleware then swaps the saved globals
// for these unsaved ones. Statamic itself only re-renders when the ENTRY changes,
// so the re-render is triggered by replaying the last preview URL.

const GLOBALS_PANEL_ID = '__sve-globals-panel';
const GLOBALS_PICKER_ID = '__sve-globals-picker';
const GLOBALS_PANEL_PARAM = 'sve-panel';
const GLOBALS_DEBOUNCE = 200;

// The URL of the most recent preview render, replayed whenever a global changes.
let lastPreviewUrl = null;
let globalsSaveTimer = null;

function globalSets(win) {
  const sets = win.Statamic?.$config?.get?.('sveGlobalSets');

  return Array.isArray(sets) ? sets : [];
}

function csrfToken(win) {
  return (
    win.document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ||
    win.Statamic?.$config?.get?.('csrfToken') ||
    win.Statamic?.$config?.get?.('csrf_token') ||
    ''
  );
}

/**
 * The live Live Preview header — never the frozen copy of it.
 *
 * While a move is in flight there are two on the page: the real bar, and the
 * still on the cover that keeps it from blinking out. They match selector for
 * selector, so anything reaching for the header by class alone stands a good
 * chance of finding the photograph — and our own pollers would then build the
 * pickers into a bar that's about to be thrown away.
 */
function lpHeader(doc) {
  return (
    [...doc.querySelectorAll('.live-preview-header')].find((el) => !el.closest(`#${LP_COVER_ID}`)) ??
    null
  );
}

function previewFrame(doc) {
  return doc.getElementById('live-preview-iframe');
}

/** Ask the preview to render again, with or without the unsaved globals. */
function refreshPreview(win, active) {
  const frame = previewFrame(win.document);

  if (!frame?.contentWindow || !lastPreviewUrl) {
    return;
  }

  frame.contentWindow.postMessage(
    { name: 'sve.globals', active, url: lastPreviewUrl },
    win.location.origin
  );
}

/**
 * Records the URL of each preview render. Statamic POSTs the entry's values and
 * gets back a tokenised URL; that URL is what the preview iframe loads, and what
 * we replay to re-render after a global changes.
 */
function watchPreviewRenders(win) {
  const isPreviewCall = (url, method) =>
    typeof url === 'string' && url.includes('/preview') && /^POST$/i.test(method || 'GET');

  const remember = (payload) => {
    try {
      const data = typeof payload === 'string' ? JSON.parse(payload) : payload;

      if (data?.url) {
        lastPreviewUrl = data.url;
      }
    } catch {
      /* not the payload we expected */
    }
  };

  const { fetch: originalFetch } = win;

  win.fetch = function (input, init = {}) {
    const url = typeof input === 'string' ? input : input?.url;
    const method = init.method ?? (typeof input === 'object' ? input?.method : null);
    const request = originalFetch.call(this, input, init);

    if (!isPreviewCall(url, method)) {
      return request;
    }

    return request.then((response) => {
      response.clone().json().then(remember).catch(() => {});

      return response;
    });
  };

  // Statamic's CP talks to the server through axios, i.e. XMLHttpRequest — the
  // preview render never goes through fetch at all.
  const { open: originalOpen } = win.XMLHttpRequest.prototype;

  win.XMLHttpRequest.prototype.open = function (method, url, ...rest) {
    if (isPreviewCall(url, method)) {
      this.addEventListener('load', () => {
        if (this.status >= 200 && this.status < 300) {
          remember(this.response ?? this.responseText);
        }
      });
    }

    return originalOpen.call(this, method, url, ...rest);
  };
}

function postGlobals(win, handle, values) {
  clearTimeout(globalsSaveTimer);

  globalsSaveTimer = setTimeout(() => {
    win
      .fetch('/!/sve/globals-preview', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken(win),
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({ handle, values }),
      })
      .then(() => refreshPreview(win, true))
      .catch(() => {
        /* the preview simply keeps the last render */
      });
  }, GLOBALS_DEBOUNCE);
}

function closeGlobalsPanel(win) {
  const panel = win.document.getElementById(GLOBALS_PANEL_ID);

  if (!panel) {
    return;
  }

  panel.remove();
  syncPreviewInset(win);

  // Drop the stash and put the saved globals back in the preview.
  win
    .fetch('/!/sve/globals-preview/clear', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'X-CSRF-TOKEN': csrfToken(win), 'X-Requested-With': 'XMLHttpRequest' },
    })
    .catch(() => {})
    .then(() => refreshPreview(win, false));
}

const GLOBALS_WIDTH_KEY = 'sve-globals-panel-width';
const GLOBALS_MIN_WIDTH = 320;

function globalsPanelWidth(win) {
  let stored = 0;

  try {
    stored = Number(win.localStorage.getItem(GLOBALS_WIDTH_KEY)) || 0;
  } catch {
    /* private mode */
  }

  const max = Math.max(GLOBALS_MIN_WIDTH, win.innerWidth - 360);

  return Math.min(Math.max(stored || 440, GLOBALS_MIN_WIDTH), max);
}

/** Drag handle on the panel's inner edge; the width is remembered. */
function globalsResizer(win, panel) {
  const handle = win.document.createElement('div');

  handle.style.cssText =
    'position:absolute;left:0;top:0;bottom:0;width:6px;cursor:col-resize;z-index:1;touch-action:none;';
  handle.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) {
      return;
    }

    event.preventDefault();
    handle.setPointerCapture(event.pointerId);

    // The iframe swallows pointer events once the cursor crosses into it, so it
    // has to sit out the drag.
    const frame = panel.querySelector('iframe');

    if (frame) {
      frame.style.pointerEvents = 'none';
    }

    const onMove = (move) => {
      const max = Math.max(GLOBALS_MIN_WIDTH, win.innerWidth - 360);
      const width = Math.min(Math.max(win.innerWidth - move.clientX, GLOBALS_MIN_WIDTH), max);

      panel.style.width = `${width}px`;
      syncPreviewInset(win);
    };

    const onUp = () => {
      win.removeEventListener('pointermove', onMove);
      win.removeEventListener('pointerup', onUp);

      if (frame) {
        frame.style.pointerEvents = '';
      }

      try {
        win.localStorage.setItem(GLOBALS_WIDTH_KEY, String(parseInt(panel.style.width, 10)));
      } catch {
        /* private mode */
      }
    };

    win.addEventListener('pointermove', onMove);
    win.addEventListener('pointerup', onUp);
  });

  return handle;
}

function globalsPanelUrl(win, set) {
  const url = new URL(set.url, win.location.origin);

  url.searchParams.set(GLOBALS_PANEL_PARAM, '1');

  return url.toString();
}

function openGlobalsPanel(win, set) {
  const doc = win.document;
  const existing = doc.getElementById(GLOBALS_PANEL_ID);

  // Switching sets reuses the panel rather than replacing it. Tearing an iframe
  // out of the page discards its session-history entries, and the browser then
  // traverses the joint history to recover — which fires `popstate` on the top
  // window. In the front-end edit overlay that reads as "the user pressed Back",
  // and the whole editor closes a few seconds after you pick a second global set.
  if (existing) {
    const frame = existing.querySelector('iframe');
    const title = existing.querySelector('[data-sve-globals-title]');

    if (frame && title) {
      title.textContent = set.title;
      frame.title = set.title;
      frame.contentWindow.location.replace(globalsPanelUrl(win, set));

      return;
    }

    existing.remove();
  }

  closeRightPanels(win, GLOBALS_PANEL_ID);

  const header = lpHeader(doc);
  const top = header ? Math.round(header.getBoundingClientRect().bottom) : 0;

  const panel = doc.createElement('div');

  panel.id = GLOBALS_PANEL_ID;
  panel.style.cssText =
    `position:fixed;top:${top}px;right:0;bottom:0;width:${globalsPanelWidth(win)}px;z-index:40;` +
    'display:flex;flex-direction:column;background:var(--theme-color-content-bg,#fff);' +
    'border-left:1px solid rgba(128,128,128,.28);box-shadow:-8px 0 24px rgba(0,0,0,.18);';

  panel.appendChild(globalsResizer(win, panel));

  const bar = doc.createElement('div');

  bar.style.cssText =
    'display:flex;align-items:center;justify-content:space-between;gap:8px;padding:8px 10px 8px 14px;' +
    'border-bottom:1px solid rgba(128,128,128,.24);font:600 13px/1 ui-sans-serif,system-ui,sans-serif;' +
    'color:currentColor;flex:0 0 auto;';
  const title = doc.createElement('span');

  title.setAttribute('data-sve-globals-title', '');
  title.textContent = set.title;
  bar.appendChild(title);

  // The CP's own Save sits in the page header, which the panel strips away — so
  // the panel carries its own, wired to the real button inside the frame.
  const actions = doc.createElement('div');

  actions.style.cssText = 'display:flex;align-items:center;gap:6px;';

  const save = doc.createElement('button');

  save.type = 'button';
  save.textContent = t(win, 'save');
  save.title = t(win, 'save_globals');
  save.style.cssText =
    'all:unset;cursor:pointer;padding:5px 12px;border-radius:6px;background:var(--theme-color-primary,#4f46e5);' +
    'color:#fff;font-size:12px;font-weight:600;line-height:1;';
  save.addEventListener('click', () => {
    const frame = doc.getElementById(GLOBALS_PANEL_ID)?.querySelector('iframe');

    frame?.contentWindow?.postMessage(
      { source: 'statamic-visual-editor', type: 'sve-globals-save' },
      win.location.origin
    );
  });
  actions.appendChild(save);

  const close = doc.createElement('button');

  close.type = 'button';
  close.textContent = '✕';
  close.title = t(win, 'close');
  close.style.cssText =
    'all:unset;cursor:pointer;width:26px;height:26px;display:inline-flex;align-items:center;' +
    'justify-content:center;border-radius:6px;color:currentColor;opacity:.7;';
  close.addEventListener('mouseenter', () => (close.style.background = 'rgba(128,128,128,.18)'));
  close.addEventListener('mouseleave', () => (close.style.background = 'transparent'));
  close.addEventListener('click', () => {
    const picker = doc.getElementById(GLOBALS_PICKER_ID);

    if (picker) {
      picker.value = '';
    }

    closeGlobalsPanel(win);
  });
  actions.appendChild(close);
  bar.appendChild(actions);

  const frame = doc.createElement('iframe');

  frame.src = globalsPanelUrl(win, set);
  frame.title = set.title;
  frame.style.cssText = 'flex:1 1 auto;width:100%;border:0;background:transparent;';

  panel.appendChild(bar);
  panel.appendChild(frame);
  doc.body.appendChild(panel);
  syncPreviewInset(win);
}

/** The global-set picker, sat beside the panel-mode buttons in the LP header. */
function ensureGlobalsPicker(win) {
  const doc = win.document;
  const group = doc.getElementById(LP_MODE_ID);
  const sets = globalSets(win);

  if (!group || !sets.length || doc.getElementById(GLOBALS_PICKER_ID)) {
    return;
  }

  const select = doc.createElement('select');

  select.id = GLOBALS_PICKER_ID;
  select.title = 'Rediger globale indstillinger ved siden af previewet';
  select.style.cssText =
    'height:28px;padding:0 8px;border-radius:8px;cursor:pointer;color:currentColor;' +
    'background:rgba(128,128,128,.16);border:none;font-size:12px;font-weight:500;font-family:inherit;';

  const placeholder = doc.createElement('option');

  placeholder.value = '';
  placeholder.textContent = t(win, 'globals');
  select.appendChild(placeholder);

  sets.forEach((set) => {
    const option = doc.createElement('option');

    option.value = set.handle;
    option.textContent = set.title;
    select.appendChild(option);
  });

  select.addEventListener('change', () => {
    const set = sets.find((candidate) => candidate.handle === select.value);

    if (set) {
      openGlobalsPanel(win, set);
    } else {
      closeGlobalsPanel(win);
    }
  });

  group.after(select);
}

const LIBRARY_BUTTON_ID = '__sve-library-btn';

/** A "Sektioner" toggle in the LP header that opens/closes the section library. */
function ensureSectionLibraryButton(win) {
  const doc = win.document;
  const group = doc.getElementById(LP_MODE_ID);

  if (!group || doc.getElementById(LIBRARY_BUTTON_ID)) {
    return;
  }

  const btn = doc.createElement('button');

  btn.id = LIBRARY_BUTTON_ID;
  btn.type = 'button';
  btn.title = t(win, 'sections');
  btn.innerHTML =
    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" style="display:block"><rect x="3" y="3" width="7" height="7" rx="1"/>' +
    '<rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>' +
    '<rect x="14" y="14" width="7" height="7" rx="1"/></svg>';
  btn.style.cssText =
    'height:28px;display:inline-flex;align-items:center;gap:6px;padding:0 10px;border-radius:8px;cursor:pointer;' +
    'color:currentColor;background:rgba(128,128,128,.16);border:none;font-size:12px;font-weight:500;font-family:inherit;';
  btn.append(t(win, 'sections'));
  btn.addEventListener('click', () => openSectionPicker(win));

  // After the globals picker if it exists, otherwise right after the mode group.
  (doc.getElementById(GLOBALS_PICKER_ID) || group).after(btn);
}

/**
 * Runs inside the globals panel's iframe: strips the CP chrome down to the form,
 * and streams the form's values up to the Live Preview window as they're typed.
 */
function initGlobalsPanelFrame(win) {
  const doc = win.document;

  if (!new URLSearchParams(win.location.search).has(GLOBALS_PANEL_PARAM)) {
    return false;
  }

  const style = doc.createElement('style');

  style.textContent = `
    body { background: transparent !important; }
    [data-sve-panel-hide] { display: none !important; }
  `;
  doc.head.appendChild(style);

  // The same panel serves a global SET (/cp/globals/<handle>) and a global
  // SECTION (/cp/collections/<c>/entries/<id>) — both are just a publish form in
  // an iframe. The path says which; each stashes through its own channel, and
  // only an entry brings its own Save button along.
  const isEntry = win.location.pathname.includes('/collections/');

  // Strip the CP's own chrome (top bar, main nav) but nothing else: the publish
  // form lives inside <main>, and it has plenty of its own <header>s (every
  // replicator set) and <nav>s (the tab bar) that must survive.
  const hideChrome = () => {
    const main = doc.querySelector('main');

    doc.querySelectorAll('nav, header').forEach((el) => {
      if (main && (main.contains(el) || el.contains(main))) {
        return;
      }

      el.setAttribute('data-sve-panel-hide', '');
    });

    // An entry's own Save & Publish sits inside <main>, so the sweep above leaves
    // it — but the panel has its own Save, and two of them (doing the same thing)
    // is just a way to wonder which one you're supposed to press. Hidden, not
    // removed: the panel's Save still clicks it.
    if (isEntry) {
      doc.querySelectorAll('button').forEach((button) => {
        if (!/^(save|gem)\b/i.test((button.textContent || '').trim())) {
          return;
        }

        // The button and the little dropdown chevron beside it, and nothing more —
        // hiding an ancestor here would take half the form with it.
        button.setAttribute('data-sve-panel-hide', '');
        button.nextElementSibling?.setAttribute('data-sve-panel-hide', '');
      });
    }
  };

  hideChrome();
  new win.MutationObserver(hideChrome).observe(doc.documentElement, { childList: true, subtree: true });

  // Statamic's own Save button lives in the page header the panel strips away.
  // It still works — it just can't be seen — so the panel's Save clicks it, and
  // the normal save (validation, revisions, toast) runs untouched.
  win.addEventListener('message', (event) => {
    if (event.origin !== win.location.origin) {
      return;
    }

    if (event.data?.source !== 'statamic-visual-editor') {
      return;
    }

    // An inline edit in the page, on content this form owns: apply it to the real
    // container here. The value poll below streams it straight back out, so the
    // page re-renders with it — the edit never has to know it crossed a window.
    if (event.data.type === 'sve-section-set-value') {
      for (const container of activeContainers(doc)) {
        container.setFieldValue(event.data.path, event.data.value);

        return;
      }

      return;
    }

    if (event.data.type !== 'sve-globals-save') {
      return;
    }

    // A global set's button reads "Save"; an entry's reads "Save & Publish" — so
    // match the start, not the whole label, or the panel's Save silently does
    // nothing for a global section. Clicking works even though it's hidden.
    [...doc.querySelectorAll('button')]
      .find((button) => /^(save|gem)\b/i.test((button.textContent || '').trim()))
      ?.click();
  });

  const handle = win.location.pathname.split('/').filter(Boolean).pop();
  let previous = null;

  // Polled rather than watched: the container's `values` is a Vue ref, and a
  // 200ms compare is both cheaper and far more robust than reaching into Vue's
  // reactivity from outside its bundle.
  win.setInterval(() => {
    for (const container of activeContainers(doc)) {
      const values = unwrapRef(container.values);

      if (!values || typeof values !== 'object') {
        continue;
      }

      const serialized = JSON.stringify(values);

      if (serialized === previous) {
        return;
      }

      previous = serialized;

      try {
        win.parent.postMessage(
          isEntry
            ? { source: 'statamic-visual-editor', type: 'sve-section-values', id: handle, values: JSON.parse(serialized) }
            : { source: 'statamic-visual-editor', type: 'sve-globals-values', handle, values: JSON.parse(serialized) },
          win.location.origin
        );
      } catch {
        /* the panel was closed */
      }

      return;
    }
  }, 250);

  return true;
}

/**
 * Clicking content that comes from a global (global_edit="site_settings.phone"):
 * open that set in the panel and jump to the field. Editing it there updates the
 * preview as you type — the same live path the panel already uses.
 */
export function handleOpenGlobal(data, doc, win) {
  const sets = globalSets(win);

  if (!sets.length) {
    return;
  }

  const [handle, field] = String(data.target || '').split('.');
  const set = sets.find((candidate) => candidate.handle === handle) ?? sets[0];
  const picker = doc.getElementById(GLOBALS_PICKER_ID);

  if (picker) {
    picker.value = set.handle;
  }

  openGlobalsPanel(win, set);

  if (field) {
    focusGlobalField(win, field);
  }
}

/** Waits for the panel's form to mount, then scrolls the field into view. */
function focusGlobalField(win, field, attempts = 0) {
  const frame = win.document.getElementById(GLOBALS_PANEL_ID)?.querySelector('iframe');
  const inner = frame?.contentDocument;

  const input = inner?.querySelector(`[name="${field}"], #${CSS.escape(field)}`);

  if (input) {
    input.scrollIntoView({ block: 'center' });
    input.focus?.();

    return;
  }

  if (attempts < 30) {
    setTimeout(() => focusGlobalField(win, field, attempts + 1), 200);
  }
}

/** In the Live Preview window: take the values streamed up by the panel. */

// --- Collection picker: move between entries without leaving the preview -------
//
// Live Preview is bound to one entry, so "staying in it" is really: navigate, and
// land back in it. `?live-preview=1` (autoOpenLivePreview) reopens it on arrival,
// so the seam doesn't show. Collections without a route have no page to render —
// they still appear, because jumping to "new blog post" is worth having, but they
// open the ordinary editor and say so.

const COLLECTION_PICKER_ID = '__sve-collection-picker';
const ENTRY_PICKER_ID = '__sve-entry-picker';
const NEW_ENTRY_ID = '__sve-new-entry';

const LP_COVER_ID = 'sve-lp-cover';

function pickerCollections(win) {
  const list = win.Statamic?.$config?.get?.('sveCollections');

  return Array.isArray(list) ? list : [];
}

/** The entry currently open, from the CP URL. */
function currentEntryId(win) {
  const match = win.location.pathname.match(/\/entries\/([^/]+)/);

  return match ? match[1] : null;
}

/**
 * Asks about unsaved work before leaving — a dialog, not a dropdown hanging off
 * whatever you happened to click. Losing edits is the kind of thing that deserves
 * the middle of the screen.
 */
function confirmUnsaved(win, onSave, onDiscard, onCancel = () => {}) {
  const doc = win.document;
  const overlay = doc.createElement('div');

  overlay.style.cssText =
    'position:fixed;inset:0;z-index:2147483646;display:flex;align-items:center;justify-content:center;' +
    'background:rgba(0,0,0,.45);font-family:ui-sans-serif,system-ui,sans-serif;';

  const card = doc.createElement('div');

  card.style.cssText =
    'width:400px;max-width:92vw;background:var(--theme-color-content-bg,#fff);color:currentColor;' +
    'border-radius:12px;padding:22px;box-shadow:0 24px 64px rgba(0,0,0,.35);';
  card.innerHTML =
    `<div style="font-size:15px;font-weight:600;margin-bottom:6px;">${t(win, 'unsaved_title')}</div>` +
    `<div style="font-size:13px;opacity:.7;line-height:1.45;margin-bottom:18px;">${t(win, 'unsaved_body')}</div>` +
    '<div data-sve-actions style="display:flex;justify-content:flex-end;gap:8px;flex-wrap:wrap;"></div>';

  const actions = card.querySelector('[data-sve-actions]');
  const close = () => overlay.remove();

  const button = (label, style, onClick) => {
    const btn = doc.createElement('button');

    btn.type = 'button';
    btn.textContent = label;
    btn.style.cssText = `all:unset;cursor:pointer;padding:8px 14px;border-radius:8px;font-size:13px;${style}`;
    btn.addEventListener('click', () => {
      close();
      onClick();
    });
    actions.appendChild(btn);
  };

  button(t(win, 'cancel'), 'opacity:.7;color:currentColor;', onCancel);
  button(t(win, 'unsaved_discard'), 'color:currentColor;background:rgba(128,128,128,.16);font-weight:500;', onDiscard);
  button(
    t(win, 'unsaved_save'),
    'background:var(--theme-color-primary,#4f46e5);color:#fff;font-weight:600;',
    onSave
  );

  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) {
      close();
      onCancel();
    }
  });

  overlay.appendChild(card);
  doc.body.appendChild(overlay);
}

const LP_NAV_SPINNER_ID = '__sve-nav-spinner';

/** A quiet "working on it", so the page you're still looking at isn't a lie. */
function showNavSpinner(win) {
  const doc = win.document;

  if (doc.getElementById(LP_NAV_SPINNER_ID)) {
    return;
  }

  const header = lpHeader(doc);
  const top = header ? Math.round(header.getBoundingClientRect().bottom) : 0;
  const pip = doc.createElement('div');

  pip.id = LP_NAV_SPINNER_ID;
  pip.style.cssText =
    `position:fixed;top:${top + 16}px;left:50%;transform:translateX(-50%);z-index:2147483000;` +
    'display:flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:999px;' +
    'background:#18181b;color:#fff;box-shadow:0 4px 14px rgba(0,0,0,.28);pointer-events:none;';
  pip.innerHTML =
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" ' +
    'stroke-linecap="round" style="opacity:.9;animation:sve-lp-spin 1s linear infinite;">' +
    '<path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>' +
    '<style>@keyframes sve-lp-spin{to{transform:rotate(360deg)}}</style>';
  doc.body.appendChild(pip);
}

function hideNavSpinner(win) {
  win.document.getElementById(LP_NAV_SPINNER_ID)?.remove();
}

/**
 * Saves, then goes where the user actually asked to go.
 *
 * Statamic answers a save with a redirect of its own — out to the collection
 * listing — and it lands after ours, so simply moving first loses the race and
 * dumps you in the admin: the one place this whole picker exists to keep you out
 * of. So we swallow that one redirect and make the move ourselves.
 *
 * If the save fails we stay put, because the error is in here.
 */
function saveThenNavigate(win, go) {
  const router = win.__STATAMIC__?.inertia?.router;
  const save = saveButtonIn(win.document);

  if (!save) {
    go();

    return;
  }

  if (typeof router?.on !== 'function') {
    leaveQuietly(win, go); // no router to head off; a full load outruns the redirect

    return;
  }

  showNavSpinner(win);

  let settled = false;

  // The save's own redirect, intercepted. Ours goes out from the next tick so
  // the router isn't asked to start a visit while it's still cancelling one.
  const offBefore = router.on('before', () => {
    offBefore();
    win.setTimeout(go, 0);

    return false;
  });

  const stop = onEntrySave((ok) => {
    if (settled) {
      return;
    }

    settled = true;
    stop();
    clearTimeout(timer);

    if (!ok) {
      offBefore();
      hideNavSpinner(win);
    }
  });

  const timer = win.setTimeout(() => {
    if (settled) {
      return;
    }

    settled = true;
    stop();
    offBefore();
    hideNavSpinner(win);
  }, LP_SAVE_TIMEOUT);

  save.click();
}

/**
 * Moves to another entry without the page going out from under you.
 *
 * A full page load tears the current document down — that's the blank. Inertia
 * fetches the next page while this one stays on screen, and only swaps once it
 * has it; the cover then only has to hide the brief moment between the swap and
 * the preview painting, rather than the whole trip. Falls back to a plain load
 * where the router isn't reachable.
 */
function navigateFromLp(win, anchor, url, onCancel = () => {}) {
  const router = win.__STATAMIC__?.inertia?.router;

  const go = () => {
    // By the time anything calls this, the unsaved question has been put to the
    // user and answered — on every path into it.
    dismissDirtyWarning(win);

    // Running in the site's editor overlay, the move belongs to the host: it boots
    // the next page hidden and only swaps once that page has painted, so the page
    // you're looking at stays — really stays, not a picture of it — for the whole
    // wait. That's the front-end edit button's own route, and nothing done inside
    // this document can match it: an Inertia swap takes the live preview down with
    // it, and anything put over that gap is a second page change.
    //
    // A spinner, because the wait is now spent looking at a page that is doing
    // nothing.
    if (isEmbeddedInSite(win)) {
      showNavSpinner(win);

      // If the host can't produce the page, don't leave a spinner turning at
      // someone: take the ordinary route instead.
      const onFail = (event) => {
        if (event.origin !== win.location.origin) {
          return;
        }

        if (event.data?.source !== 'statamic-visual-editor' || event.data.type !== 'lp-goto-failed') {
          return;
        }

        win.removeEventListener('message', onFail);
        hideNavSpinner(win);
        coverForNavigation(win, { blocking: true });
        win.location.href = url;
      };

      win.addEventListener('message', onFail);
      postToHost(win, 'lp-goto', { url });

      return;
    }

    if (!router?.visit) {
      coverForNavigation(win);
      win.location.href = url;

      return;
    }

    // Standing alone in the Control Panel there's no host holding the page, so the
    // gap has to be covered: one cover in the colour you were looking at, a spinner
    // on it, and the next page fades in once its preview has painted.
    coverForNavigation(win, { blocking: true });

    router.visit(url, {
      onSuccess: () => {
        // The cover stays up until the new preview has painted — that reveal is
        // the whole point, so it's `reveal` that takes it down.
        if (/[?&]live-preview=1/.test(url)) {
          openLivePreviewCovered(win, { closePanels: true });

          return;
        }

        win.document.getElementById(LP_COVER_ID)?.remove();
      },
      onError: () => {
        win.document.getElementById(LP_COVER_ID)?.remove();
      },
    });
  };

  if (!hasUnsavedChanges(win) || !saveButtonIn(win.document)) {
    go();

    return;
  }

  confirmUnsaved(
    win,
    () => saveThenNavigate(win, go),
    () => {
      discardChanges(win);
      go();
    },
    onCancel
  );
}

/**
 * "New page": a title and a slug, and you're in it.
 *
 * The Control Panel's create screen would do this too, but it's a whole form on a
 * whole other page — and there is nothing to fill in yet. This asks the two things
 * that can't be guessed and creates the entry bare, so the next thing you see is
 * the page itself, ready to build.
 */
function newEntryDialog(win, collection, onCreated) {
  const doc = win.document;
  const overlay = doc.createElement('div');

  overlay.style.cssText =
    'position:fixed;inset:0;z-index:2147483600;display:flex;align-items:center;justify-content:center;' +
    'background:rgba(0,0,0,.45);font-family:ui-sans-serif,system-ui,sans-serif;';

  const card = doc.createElement('div');
  const input =
    'width:100%;box-sizing:border-box;height:36px;padding:0 10px;border-radius:8px;' +
    'border:1px solid rgba(128,128,128,.4);background:transparent;color:currentColor;font-size:14px;';

  card.style.cssText =
    'width:420px;max-width:92vw;background:var(--theme-color-content-bg,#fff);color:currentColor;' +
    'border-radius:12px;padding:22px;box-shadow:0 24px 64px rgba(0,0,0,.35);';
  card.innerHTML = `
    <div style="font-size:15px;font-weight:600;margin-bottom:16px;">${t(win, 'new_in', { collection: collection.title })}</div>
    <label style="display:block;font-size:12px;font-weight:500;margin-bottom:5px;">${t(win, 'title')}</label>
    <input type="text" data-sve-title style="${input}margin-bottom:12px;">
    <label style="display:block;font-size:12px;font-weight:500;margin-bottom:5px;">${t(win, 'slug')}</label>
    <input type="text" data-sve-slug style="${input}">
    <div data-sve-error style="display:none;font-size:12px;color:#dc2626;margin-top:8px;"></div>
    <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:20px;">
      <button type="button" data-sve-cancel style="all:unset;cursor:pointer;padding:8px 14px;border-radius:8px;font-size:13px;color:currentColor;opacity:.75;">${t(win, 'cancel')}</button>
      <button type="button" data-sve-create style="all:unset;cursor:pointer;padding:8px 16px;border-radius:8px;font-size:13px;font-weight:600;background:var(--theme-color-primary,#4f46e5);color:#fff;">${t(win, 'create')}</button>
    </div>
  `;

  overlay.appendChild(card);
  doc.body.appendChild(overlay);

  const title = card.querySelector('[data-sve-title]');
  const slug = card.querySelector('[data-sve-slug]');
  const error = card.querySelector('[data-sve-error]');
  const create = card.querySelector('[data-sve-create]');
  const close = () => overlay.remove();

  title.focus();

  // The slug follows the title until it's touched, and then it's yours — retyping
  // the title shouldn't quietly undo a slug you chose on purpose.
  let slugOwned = false;

  slug.addEventListener('input', () => (slugOwned = true));
  title.addEventListener('input', () => {
    if (!slugOwned) {
      slug.value = slugify(title.value);
    }
  });

  const submit = () => {
    const name = title.value.trim();

    if (!name) {
      title.focus();

      return;
    }

    create.style.opacity = '.6';
    create.style.pointerEvents = 'none';
    error.style.display = 'none';

    win
      .fetch(`/!/sve/collections/${encodeURIComponent(collection.handle)}/entries`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken(win),
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({ title: name, slug: slug.value.trim() }),
      })
      .then(async (res) => {
        const body = await res.json().catch(() => ({}));

        if (!res.ok) {
          // A taken slug is the one failure worth answering in place.
          error.textContent = body.message || t(win, 'create_failed');
          error.style.display = 'block';
          create.style.opacity = '1';
          create.style.pointerEvents = '';

          return;
        }

        close();
        onCreated(body.id);
      })
      .catch(() => {
        error.textContent = t(win, 'create_failed');
        error.style.display = 'block';
        create.style.opacity = '1';
        create.style.pointerEvents = '';
      });
  };

  card.querySelector('[data-sve-cancel]').addEventListener('click', close);
  create.addEventListener('click', submit);
  overlay.addEventListener('click', (event) => event.target === overlay && close());
  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      submit();
    } else if (event.key === 'Escape') {
      close();
    }
  });
}

/** The slug Statamic would make: lowercase, ascii-ish, hyphenated. */
function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[æ]/g, 'ae')
    .replace(/[ø]/g, 'oe')
    .replace(/[å]/g, 'aa')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function ensureCollectionPicker(win) {
  const doc = win.document;
  const group = doc.getElementById(LP_MODE_ID);
  const collections = pickerCollections(win);

  if (!group || !collections.length || doc.getElementById(COLLECTION_PICKER_ID)) {
    return;
  }

  const style =
    'height:28px;padding:0 8px;border-radius:8px;cursor:pointer;color:currentColor;' +
    'background:rgba(128,128,128,.16);border:none;font-size:12px;font-weight:500;font-family:inherit;';

  const wrap = doc.createElement('div');

  wrap.style.cssText = 'display:inline-flex;align-items:center;gap:4px;';

  const collectionSelect = doc.createElement('select');

  collectionSelect.id = COLLECTION_PICKER_ID;
  collectionSelect.style.cssText = style;

  collections.forEach((collection) => {
    const option = doc.createElement('option');

    option.value = collection.handle;
    // Say it in the option rather than only on hover: you shouldn't have to
    // discover that a collection can't be previewed by picking it.
    option.textContent = collection.previewable
      ? collection.title
      : `${collection.title} · ${t(win, 'no_preview_collection')}`;
    collectionSelect.appendChild(option);
  });

  const entrySelect = doc.createElement('select');

  entrySelect.id = ENTRY_PICKER_ID;
  entrySelect.style.cssText = `${style}max-width:220px;`;

  const newBtn = doc.createElement('button');

  newBtn.type = 'button';
  newBtn.id = NEW_ENTRY_ID;
  newBtn.textContent = `+ ${t(win, 'new_entry')}`;
  newBtn.style.cssText = `${style}font-weight:600;`;

  const selected = () => collections.find((c) => c.handle === collectionSelect.value);

  const fillEntries = async (keepCurrent) => {
    const collection = selected();

    entrySelect.innerHTML = '';
    newBtn.title = t(win, 'new_in', { collection: collection?.title ?? '' });
    collectionSelect.title = collection?.previewable
      ? ''
      : t(win, 'no_preview_hint', { collection: collection?.title ?? '' });

    const placeholder = doc.createElement('option');

    placeholder.value = '';
    placeholder.textContent = t(win, 'choose_entry');
    entrySelect.appendChild(placeholder);

    let entries = [];

    try {
      const res = await win.fetch(`/!/sve/collections/${encodeURIComponent(collectionSelect.value)}/entries`, {
        credentials: 'same-origin',
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
      });

      entries = res.ok ? (await res.json()).entries ?? [] : [];
    } catch {
      entries = [];
    }

    entries.forEach((entry) => {
      const option = doc.createElement('option');

      option.value = entry.id;
      option.textContent = entry.published ? entry.title : `${entry.title} ·`;
      entrySelect.appendChild(option);
    });

    if (keepCurrent) {
      entrySelect.value = currentEntryId(win) ?? '';
    }
  };

  collectionSelect.addEventListener('change', () => fillEntries(false));

  entrySelect.addEventListener('change', () => {
    if (!entrySelect.value || entrySelect.value === currentEntryId(win)) {
      return;
    }

    const collection = selected();
    const url =
      `${win.location.origin}/cp/collections/${encodeURIComponent(collection.handle)}` +
      `/entries/${encodeURIComponent(entrySelect.value)}${collection.previewable ? '?live-preview=1' : ''}`;

    // Stay-put has to look like staying put: if the trip is called off, the
    // picker goes back to naming the entry that's actually open.
    navigateFromLp(win, entrySelect, url, () => {
      entrySelect.value = currentEntryId(win) ?? '';
    });
  });

  newBtn.addEventListener('click', () => {
    const collection = selected();

    newEntryDialog(win, collection, (id) => {
      const url =
        `${win.location.origin}/cp/collections/${encodeURIComponent(collection.handle)}` +
        `/entries/${encodeURIComponent(id)}${collection.previewable ? '?live-preview=1' : ''}`;

      // The entry already exists by now, so there is nothing unsaved to ask about
      // — but this is the route that knows how to land in a preview.
      navigateFromLp(win, newBtn, url);
    });
  });

  wrap.appendChild(collectionSelect);
  wrap.appendChild(entrySelect);
  wrap.appendChild(newBtn);
  group.after(wrap);

  // Open on whatever you're already editing, so the picker reads as "you are
  // here" rather than an empty control.
  collectionSelect.value = currentCollection(win) ?? collections[0].handle;
  fillEntries(true);
}

// --- Global section panel -------------------------------------------------------
//
// A synced section's content lives in another entry, so the page's form has
// nothing to edit — only a reference. This docks that entry's own editor beside
// the preview and stashes what's being typed, so the page around it re-renders
// live: editing in context, without the section ever needing a URL of its own.

const GLOBAL_SECTION_PANEL_ID = '__sve-global-section-panel';

// The panel's latest values, as it streams them up: { id, values }. This is what
// lets a global section be edited inline like any other — see activeContainers.
let sectionPanelValues = null;

/**
 * The open panel, dressed up as a publish container.
 *
 * Reads resolve against the copy of its values it streams us; writes are posted
 * into the panel, where the real container applies them — and its next poll
 * streams the change back, stashes it, and re-renders the page. So an inline edit
 * on a global section takes the same path as one on the page's own fields, and
 * nothing downstream needs to know the difference.
 */
function sectionPanelContainer(doc) {
  const panel = doc.getElementById(GLOBAL_SECTION_PANEL_ID);
  const frame = panel?.querySelector('iframe');

  if (!panel || !frame?.contentWindow || !sectionPanelValues?.values) {
    return null;
  }

  const win = doc.defaultView;

  return {
    name: 'sve-global-section',
    values: sectionPanelValues.values,
    setFieldValue: (path, value) => {
      frame.contentWindow.postMessage(
        { source: 'statamic-visual-editor', type: 'sve-section-set-value', path, value },
        win.location.origin
      );
    },
  };
}

/** Tells the preview to re-render asking for (or forgetting) the stashed section. */
function refreshSections(win, active) {
  const frame = previewFrame(win.document);

  if (!frame?.contentWindow || !lastPreviewUrl) {
    return;
  }

  frame.contentWindow.postMessage({ name: 'sve.sections', active, url: lastPreviewUrl }, win.location.origin);
}

function postSectionValues(win, id, values) {
  win
    .fetch('/!/sve/global-section-stash', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': csrfToken(win),
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: JSON.stringify({ id, values }),
    })
    .then(() => refreshSections(win, true))
    .catch(() => {});
}

export function closeGlobalSectionPanel(win) {
  const panel = win.document.getElementById(GLOBAL_SECTION_PANEL_ID);

  if (!panel) {
    return;
  }

  panel.remove();
  sectionPanelValues = null;
  syncPreviewInset(win);

  // Drop the stash and put the saved section back in the preview.
  win
    .fetch('/!/sve/global-section-stash/clear', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'X-CSRF-TOKEN': csrfToken(win), 'X-Requested-With': 'XMLHttpRequest' },
    })
    .catch(() => {})
    .then(() => refreshSections(win, false));
}

/** Docks a global section's own editor beside the page's preview. */
export function openGlobalSectionPanel(win, id) {
  const doc = win.document;
  const existing = doc.getElementById(GLOBAL_SECTION_PANEL_ID);

  // Already showing this section — leave it be. Rebuilding would reload the form
  // and throw away whatever is half-typed in it.
  if (existing?.dataset.sveSectionId === id) {
    return;
  }

  // Nothing to keep: any panel that's up — including this one showing a different
  // section — is about to be replaced by the one we're building.
  closeRightPanels(win);

  const header = lpHeader(doc);
  const top = header ? Math.round(header.getBoundingClientRect().bottom) : 0;
  const collection = encodeURIComponent(savedSectionsCollection(win));
  const url = new URL(`/cp/collections/${collection}/entries/${encodeURIComponent(id)}`, win.location.origin);

  url.searchParams.set(GLOBALS_PANEL_PARAM, '1');

  const panel = doc.createElement('div');

  panel.id = GLOBAL_SECTION_PANEL_ID;
  panel.dataset.sveSectionId = id;
  panel.style.cssText =
    `position:fixed;top:${top}px;right:0;bottom:0;width:${globalsPanelWidth(win)}px;z-index:40;` +
    'display:flex;flex-direction:column;background:var(--theme-color-content-bg,#fff);' +
    'border-left:1px solid rgba(128,128,128,.28);box-shadow:-8px 0 24px rgba(0,0,0,.18);';

  panel.appendChild(globalsResizer(win, panel));

  const bar = doc.createElement('div');

  bar.style.cssText =
    'display:flex;align-items:center;justify-content:space-between;gap:8px;padding:8px 10px 8px 14px;' +
    'border-bottom:1px solid rgba(128,128,128,.24);font:600 13px/1 ui-sans-serif,system-ui,sans-serif;' +
    'color:currentColor;flex:0 0 auto;';

  const title = doc.createElement('span');

  title.innerHTML = `${t(win, 'global_panel_title')} <span style="opacity:.55;font-weight:400;">${t(win, 'global_panel_note')}</span>`;
  bar.appendChild(title);

  const actions = doc.createElement('div');

  actions.style.cssText = 'display:flex;align-items:center;gap:6px;';

  const save = doc.createElement('button');

  save.type = 'button';
  save.textContent = t(win, 'save');
  save.title = t(win, 'save_global_section');
  save.style.cssText =
    'all:unset;cursor:pointer;padding:5px 12px;border-radius:6px;background:var(--theme-color-primary,#4f46e5);' +
    'color:#fff;font-size:12px;font-weight:600;line-height:1;';
  save.addEventListener('click', () => {
    doc
      .getElementById(GLOBAL_SECTION_PANEL_ID)
      ?.querySelector('iframe')
      ?.contentWindow?.postMessage({ source: 'statamic-visual-editor', type: 'sve-globals-save' }, win.location.origin);
  });
  actions.appendChild(save);

  const close = doc.createElement('button');

  close.type = 'button';
  close.textContent = '✕';
  close.title = t(win, 'close');
  close.style.cssText =
    'all:unset;cursor:pointer;width:26px;height:26px;display:inline-flex;align-items:center;' +
    'justify-content:center;border-radius:6px;opacity:.7;';
  close.addEventListener('click', () => closeGlobalSectionPanel(win));
  actions.appendChild(close);

  bar.appendChild(actions);

  const frame = doc.createElement('iframe');

  frame.src = url.toString();
  frame.title = t(win, 'global_panel_title');
  frame.style.cssText = 'flex:1 1 auto;width:100%;border:0;background:transparent;';

  panel.appendChild(bar);
  panel.appendChild(frame);
  doc.body.appendChild(panel);
  syncPreviewInset(win);
}

/** The panel frame reports what's being typed → stash it → re-render the page. */
function listenForSectionValues(win) {
  win.addEventListener('message', (event) => {
    if (event.origin !== win.location.origin) {
      return;
    }

    const { data } = event;

    if (data?.source !== 'statamic-visual-editor' || data.type !== 'sve-section-values') {
      return;
    }

    const panel = win.document.getElementById(GLOBAL_SECTION_PANEL_ID);

    if (!panel || event.source !== panel.querySelector('iframe')?.contentWindow) {
      return;
    }

    // Kept so the panel can stand in as a container — that's what lets a global
    // section's text be edited inline in the page (see sectionPanelContainer).
    sectionPanelValues = { id: data.id, values: data.values };

    postSectionValues(win, data.id, data.values);
  });
}

function listenForGlobalsValues(win) {
  win.addEventListener('message', (event) => {
    if (event.origin !== win.location.origin) {
      return;
    }

    const { data } = event;

    if (data?.source !== 'statamic-visual-editor' || data.type !== 'sve-globals-values') {
      return;
    }

    const panel = win.document.getElementById(GLOBALS_PANEL_ID);

    if (!panel || event.source !== panel.querySelector('iframe')?.contentWindow) {
      return;
    }

    postGlobals(win, data.handle, data.values);
  });
}

// --- Asset browser: hard-enforce the field's file limit --------------------------
//
// A field with max_files: 1 can still end up holding several assets: the browser
// only clamps the selection on its own checkbox path, so the other ways a row can
// become selected (clicking the filename, which opens the asset editor) slip past
// it. Rather than guess at Statamic's internals, enforce the limit the browser
// itself advertises: its footer reads "N/M selected". Whenever N exceeds M, the
// extra rows are deselected — keeping the row that was clicked last, which is the
// one the user meant.

const ASSET_COUNT_RE = /^(\d+)\s*\/\s*(\d+)\s+selected$/i;

/** The browser's "N/M selected" footer, if it's on screen. */
function assetCounter(doc) {
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

function checkedAssetToggles(doc) {
  return [...doc.querySelectorAll('[role="checkbox"], input[type="checkbox"]')].filter(
    (el) =>
      el.checked === true ||
      el.getAttribute('aria-checked') === 'true' ||
      el.dataset?.state === 'checked'
  );
}

// The row the user touched most recently — the selection we keep when trimming.
let lastAssetRow = null;

function enforceAssetLimit(doc) {
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

function guardAssetLimit(win) {
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

export function initCp(win = window) {
  const style = win.document.createElement('style');
  style.id = '__sve-cp-styles';
  style.textContent = CP_STYLES;
  win.document.head.appendChild(style);

  autoOpenLivePreview(win);
  watchEntrySaves(win);
  watchPreviewRenders(win);
  guardAssetLimit(win);
  listenForGlobalsValues(win);
  listenForSectionValues(win);

  // Running as the globals panel inside Live Preview: strip to the form and
  // stream its values up. None of the Live Preview machinery below applies.
  // The same frame serves a global section's editor — see initGlobalsPanelFrame.
  initGlobalsPanelFrame(win);

  // Capture publish containers (values + setFieldValue) for inline-edit
  // write-back. Runs inside Statamic.booting(), before any container mounts.
  registerContainerEvents(win);

  // Stamp Grid rows immediately and re-stamp whenever the DOM changes
  // (Vue renders Grid rows asynchronously after page load / field expansion).
  // The same observer injects the Live Preview panel toggle when that screen
  // mounts (it lives in a portal that appears/disappears dynamically).
  stampGridRows(win.document);
  ensureLpPanelToggle(win);
  const gridObserver = new win.MutationObserver(() => {
    stampGridRows(win.document);
    ensureLpPanelToggle(win);
  });
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
