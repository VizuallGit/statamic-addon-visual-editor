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

  const { field, scope, index } = editSession;

  setLpCollapsed(win, false);

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

    bardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });

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
    setTimeout(() => btn.click(), 70);
  };

  setTimeout(run, 120);
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

    const to = index + direction;

    if (to < 0 || to >= arr.length) {
      return; // already first/last — no-op
    }

    const next = JSON.parse(JSON.stringify(arr));
    const [item] = next.splice(index, 1);

    next.splice(to, 0, item);
    container.setFieldValue(parentPath, next);

    return;
  }
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

const LP_COLLAPSED_KEY = 'sve-lp-editor-collapsed';
const LP_TOGGLE_ID = '__sve-lp-toggle';

// Desired collapse state for the current Live Preview session. null = not
// initialized (live preview closed); read from localStorage on next mount.
let lpCollapsed = null;

function lpCollapsedPreference(win) {
  try {
    const stored = win.localStorage.getItem(LP_COLLAPSED_KEY);

    return stored === null ? true : stored === '1'; // default: collapsed
  } catch {
    return true;
  }
}

function setLpCollapsed(win, collapsed) {
  lpCollapsed = collapsed;

  try {
    win.localStorage.setItem(LP_COLLAPSED_KEY, collapsed ? '1' : '0');
  } catch {
    /* private mode */
  }

  ensureLpPanelToggle(win);
}

/**
 * Injects the panel toggle when the Live Preview screen is (re)mounted, and
 * enforces the desired collapse state. Called from initCp's MutationObserver:
 * the editor pane mounts AFTER the header, so the state must be re-asserted on
 * subsequent mutations rather than applied once at injection time.
 */
export function ensureLpPanelToggle(win) {
  const doc = win.document;
  const header = doc.querySelector('.live-preview-header');

  if (!header) {
    // Live preview closed — forget session state; next open re-reads the pref.
    lpCollapsed = null;

    return;
  }

  if (lpCollapsed === null) {
    lpCollapsed = lpCollapsedPreference(win);
  }

  let btn = doc.getElementById(LP_TOGGLE_ID);

  if (!btn) {
    btn = doc.createElement('button');
    btn.id = LP_TOGGLE_ID;
    btn.type = 'button';
    // Two-pane "sidebar" glyph drawn with borders so it follows the CP theme color.
    btn.innerHTML =
      '<span style="display:inline-block;width:16px;height:12px;border:1.5px solid currentColor;' +
      'border-radius:3px;position:relative;"><span style="position:absolute;left:4px;top:0;bottom:0;' +
      'width:1.5px;background:currentColor;"></span></span>';
    btn.style.cssText =
      'display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;' +
      'border-radius:6px;cursor:pointer;background:transparent;border:none;color:currentColor;';
    btn.addEventListener('mouseenter', () => (btn.style.background = 'rgba(128,128,128,0.15)'));
    btn.addEventListener('mouseleave', () => (btn.style.background = 'transparent'));
    btn.addEventListener('click', () => setLpCollapsed(win, !lpCollapsed));
    header.insertBefore(btn, header.firstChild);
  }

  btn.setAttribute('aria-pressed', lpCollapsed ? 'false' : 'true');
  btn.title = lpCollapsed ? 'Vis redigeringspanel' : 'Skjul redigeringspanel';
  btn.style.opacity = lpCollapsed ? '0.6' : '1';

  const editor = doc.querySelector('.live-preview-editor');

  if (editor) {
    const want = lpCollapsed ? '-10000px' : '';

    if (editor.style.left !== want) {
      editor.style.position = lpCollapsed ? 'absolute' : '';
      editor.style.left = want;
      editor.style.top = lpCollapsed ? '0' : '';
    }
  }
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
      } else {
        handleFocus(data.uid, doc, data.afterSetUid, data.uidIndex ?? 0);
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
