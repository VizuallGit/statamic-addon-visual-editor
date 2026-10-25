/**
 * The selection panel: the left column shows the selected row and nothing else.
 *
 * What the focus panel did by isolating Statamic's whole form down to one row
 * — marks on the form's DOM, a wait for the row to mount, a second pass when
 * the block inside had not opened yet — this does by drawing the row itself.
 * Statamic's form stays where it is as the data; while something is selected
 * the column hides it and shows this panel instead, and the panel draws the
 * selected row's fields with Statamic's own components on the form's own
 * publish context (cp/surfaces/SelectionPanel.vue). No row has to mount, so
 * there is nothing to wait for: a click paints in the same frame.
 *
 * What it listens to:
 *   lib/selection.js            which row (preview click, tree, back arrow, Page Settings)
 *   lib/publish-containers.js   the page form's context, registered by the lite field
 *
 * What it tells:
 *   the dock (syncCodeDock), the block tree (listViewSyncTo) and the preview
 *   (SVE_ACTIVATE) when the selection came from the panel itself — the other
 *   sources already told them.
 *
 * The one route to the left column since 1.1.553: page sections, the blocks,
 * grid rows and Bard sets inside them, a global section's rows (its borrowed
 * entry form registers its own context when it mounts) and the header and
 * footer (the headless chrome form's context, as a tab of that form). The
 * forms themselves stay as they were — mounted out of sight as the data, with
 * their save, dirty state and the preview stash — nothing of their DOM is
 * isolated, marked or waited for any more.
 *
 * May import: lib/, cp/, cp-state.js, cp-selectors.js, cp-section-groups.js,
 * code-dock-lazy.js, lazy/listview.js, pages.js, section-library.js. Not
 * cp.js, not the kernel.
 */
import { h, nextTick } from 'vue';
import { clearSelection, currentSelection, onSelection, select } from './lib/selection.js';
import { containerContextName, onContainerContext, whenContainerContext } from './lib/publish-containers.js';
import { SELECTION_ATTR, SELECTION_PANEL_ID } from './lib/ids.js';
import { livePreviewEditorEl } from './lib/live-preview.js';
import { injectStyle } from './lib/style.js';
import { previewFrame } from './lib/preview-frame.js';
import { t } from './lib/i18n.js';
import { log } from './lib/debug.js';
import { MSG, SOURCE } from './lib/protocol.js';
import { ACTIVE_ATTR } from './cp-selectors.js';
import { panelIcon } from './cp-section-groups.js';
import { mountStatamicSurface } from './cp/mount-statamic.js';
import { ctxKey, panelStore, panelValues, resolvedSelection, setPanelContexts, setPanelSelection } from './cp/panel/store.js';
import { handleRequestCloseChrome, handleRequestCloseGlobal } from './pages.js';
import { activateSectionsTab } from './lp-width.js';
import SelectionPanel from './cp/surfaces/SelectionPanel.vue';
import { syncCodeDock } from './code-dock-lazy.js';
import { listViewSyncTo } from './lazy/listview.js';

const STYLE_ID = '__sve-selection-panel-style';

let app = null;
let host = null;
let started = false;

/** True when the panel is the thing in the left column right now. */
export function selectionPanelShowing() {
  return !!currentSelection() && !!resolvedSelection.value;
}

/** Whether this panel takes a row: resolvable against one of the open forms. */
export function selectionPanelTakes(win, uid) {
  if (!uid || !panelStore.ctxs.length) {
    return false;
  }

  setPanelSelection({ uid });

  const takes = !!resolvedSelection.value;

  setPanelSelection(currentSelection());

  return takes;
}

/**
 * A click in the preview. The row is the block clicked (`scope`) or the
 * section (`uid`); the field, when the click landed on one, is revealed after
 * the paint. Returns false when this panel does not take the row, so the
 * caller keeps its own path for it.
 */
export function selectFromPreview(win, data) {
  const uid = data?.scope || data?.uid || null;

  if (!uid) {
    return false;
  }

  // The page's context comes from the fields in its sections tab; on Page
  // Settings those are not mounted and there is nothing to resolve against.
  // Show the sections tab (as the focus path did) and select when it is there.
  if (!panelStore.ctxs.length) {
    activateSectionsTab(win);
    whenContainerContext('base', 2000, win).then((ctx) => {
      if (ctx && selectionPanelTakes(win, uid)) {
        select({ uid, field: fieldHandle(data?.field), source: 'preview' });
      }
    });

    return true;
  }

  if (!selectionPanelTakes(win, uid)) {
    return false;
  }

  select({ uid, field: fieldHandle(data?.field), source: 'preview' });

  return true;
}

/** A row chosen somewhere else in the CP (the tree, the outline). */
export function selectRow(win, uid, source = 'tree') {
  if (!selectionPanelTakes(win, uid)) {
    return false;
  }

  select({ uid, source });

  return true;
}

/** A whole tab of a form — the header, the footer — chosen by the editor. */
export function selectTab(win, tab, ctxName, source = 'chrome') {
  if (!tab || !ctxName) {
    return false;
  }

  select({ tab, ctxName, source });

  return true;
}

/**
 * Out of what is selected, the way a person means it: a row of the page back
 * to the page; a row or tab of a global section or of the header out of that
 * form (its own close, with its unsaved-changes question), which also takes
 * the selection with it.
 */
export function leaveSelection(win, source = 'panel') {
  const row = resolvedSelection.value;
  const name = row?.ctxName || currentSelection()?.ctxName || 'base';

  if (name === 'sve-global-section') {
    handleRequestCloseGlobal(win);

    return;
  }

  // The header or the footer: out through the half's own close — the same
  // door as the bar under the preview and Escape. It asks about unsaved
  // edits, parks the drawer, takes the form down (and the selection with it)
  // and tells the preview to drop the half's focus. Taking the form down from
  // here alone left the preview faded on a header the panel had already left.
  if (name !== 'base') {
    handleRequestCloseChrome(win);

    return;
  }

  clearSelection(source);
}

/** `data-sid-field` carries a dotted path at times; the field is its last part. */
function fieldHandle(field) {
  return typeof field === 'string' && field ? field.split('.').pop() : null;
}

/** Once per page, from the Live Preview cluster's boot. */
export function initSelectionPanel(win) {
  if (started) {
    return;
  }

  started = true;

  // For the browser tests only: a way to read the form's values from outside.
  if (win.__sveDebug) {
    win.__sveDebug.values = () => JSON.parse(JSON.stringify(panelValues() || null));
    win.__sveDebug.contexts = () => panelStore.ctxs.map(containerContextName);
  }
  panelStore.strings = { back: t(win, 'selection_back'), page: t(win, 'selection_page') };
  panelStore.onBack = (parent, row) => {
    if (parent?.kind === 'tab') {
      selectTab(win, parent.handle, parent.ctxName, 'panel');
    } else if (parent?.uid) {
      selectRow(win, parent.uid, 'panel');
    } else if (row && row.ctxName !== 'base') {
      leaveSelection(win, 'panel');
    } else {
      clearSelection('panel');
    }
  };

  // The selection the panel last painted, and the timer of a switch not yet
  // made. One switch at a time: a selection that arrives while one is pending
  // rides on that timer, and the switch applies whatever is selected when it
  // runs — never the selection it was scheduled for. Applying the scheduled
  // one let an older click win over a newer: the first click blurred the
  // panel's field and waited, the second found nothing focused and painted
  // at once, and 80 ms later the first painted over it.
  let applied = null;
  let pendingSwitch = 0;

  onContainerContext((list) => {
    setPanelContexts(list);
    applied = currentSelection();
    paint(win, applied, null);
  });

  const apply = () => {
    const selection = currentSelection();
    const previous = applied;

    pendingSwitch = 0;
    applied = selection;
    setPanelSelection(selection);
    paint(win, selection, previous);
  };

  onSelection(() => {
    if (pendingSwitch) {
      return;
    }

    // A field in the panel still focused when its tree goes is a field whose
    // blur handler runs after its element is gone — Bard's reaches for
    // `$refs.container.contains` on a timer after the blur and throws. Let go
    // of the focus first and give that timer its turn; the new row paints
    // right after (measured: 5 ms was not enough in a headless Chrome).
    const active = host?.ownerDocument?.activeElement;

    if (host && active && host.contains(active) && typeof active.blur === 'function') {
      log(`blur before switch: ${active.tagName.toLowerCase()} focused=${active === active.ownerDocument.activeElement} hasFocus=${active.ownerDocument.hasFocus()}`);
      active.blur();
      log(`after blur: active=${active.ownerDocument.activeElement?.tagName?.toLowerCase()}`);
      pendingSwitch = win.setTimeout(apply, 80);

      return;
    }

    apply();
  });
}

/** The column the panel lives in: the fields column, or the editor pane when there is none. */
function column(doc) {
  return doc.querySelector('.live-preview-fields') || livePreviewEditorEl(doc);
}

/**
 * While the panel shows, Statamic's form is out of sight but not out of
 * layout. `display: none` on it changed the publish tabs' width to zero, their
 * overflow check re-rendered the tab bar, and the active tab's content — the
 * lite sections field, and with it the publish context this panel draws on —
 * unmounted 180 ms after the panel appeared. Lifted out of the flow at the
 * column's own width, invisible and untouchable, the form keeps its measurements
 * and stays mounted; the panel takes the flow. The page's own tab bar (Page
 * Settings, SEO) above the column folds to nothing the same careful way: it
 * belongs to the page, not to the row on show, and it keeps its width so the
 * tabs' overflow check has nothing new to say.
 */
function ensureStyle(doc) {
  injectStyle(
    doc,
    STYLE_ID,
    `[${SELECTION_ATTR}] { position: relative; }
[${SELECTION_ATTR}] > :not(#${SELECTION_PANEL_ID}) {
  position: absolute !important; inset: 0 !important; overflow: hidden !important;
  visibility: hidden !important; opacity: 0 !important; pointer-events: none !important;
}
#${SELECTION_PANEL_ID} { display: block; min-height: 100%; }
.live-preview-editor:has([${SELECTION_ATTR}]) [role="tablist"]:not(#${SELECTION_PANEL_ID} [role="tablist"]) {
  height: 0 !important; min-height: 0 !important; overflow: hidden !important; visibility: hidden !important;
  margin: 0 !important; padding: 0 !important; border: 0 !important;
}`
  );
}

/** The host element, in the column, mounted. Rebuilt when the column was. */
function ensureHost(win) {
  const doc = win.document;
  const col = column(doc);

  if (!col) {
    return null;
  }

  if (host && host.isConnected && host.parentElement === col) {
    return host;
  }

  teardown();
  ensureStyle(doc);
  log('ensureHost: new host');

  host = doc.createElement('div');
  host.id = SELECTION_PANEL_ID;
  col.appendChild(host);

  app = mountStatamicSurface(
    {
      setup() {
        return () => {
          const row = resolvedSelection.value;

          // Keyed on the owning form: a row of another form is a fresh tree on
          // that form's context, never the old fields re-bound.
          return row
            ? h(SelectionPanel, {
                key: ctxKey(row.ctx),
                ctx: row.ctx,
                drawIcon: panelIcon,
                onPainted: () => revealField(win),
              })
            : null;
        };
      },
    },
    host
  );

  return host;
}

function teardown() {
  if (app) {
    try {
      app.unmount();
    } catch {
      /* already gone with its column */
    }
  }

  app = null;
  host?.remove();
  host = null;
}

/** Show the panel for the selection, or give the column back to Statamic's form. */
function paint(win, selection, previous) {
  const doc = win.document;
  const col = column(doc);

  if (!col) {
    return;
  }

  const showing = !!selection && !!resolvedSelection.value;

  log(`paint showing=${showing} uid=${selection?.uid || (selection?.tab ? `tab:${selection.tab}` : null)} ctxs=${panelStore.ctxs.map(containerContextName).join('+')} resolved=${!!resolvedSelection.value}`);

  if (!showing) {
    col.removeAttribute(SELECTION_ATTR);

    if (previous && !selection) {
      // Back to the page: the dock follows the page, the preview drops its mark.
      syncCodeDock(win, doc, null);
    }

    return;
  }

  ensureHost(win);
  col.setAttribute(SELECTION_ATTR, '');

  const row = resolvedSelection.value;

  // The dock follows the selection, whoever made it: the tree, the outline,
  // the block tree, the panel's own back arrow. A click on the page tells the
  // dock before it selects (cp-shell/add-section.js), and a second ask for the
  // file already held changes nothing — so the dock is told here for every
  // source, and the selection is the one place it follows. Until here a click
  // in the tree reached the dock only by accident: SVE_ACTIVATE opens an inline
  // edit on a section with exactly one field, and that edit request syncs the
  // dock. A section with no field, or several, left the dock on the previous
  // file — and the tree, which marks the dock's section, jumped back to that
  // one four seconds later, with the fields icon opening its fieldset.
  if (row.uid) {
    syncCodeDock(win, doc, row.uid);
  }

  // The panel's own back arrow is the one source that has not told the others.
  if (selection.source === 'panel' && row.uid) {
    listViewSyncTo(win, row.uid);
    previewFrame(doc)?.contentWindow?.postMessage(
      { source: SOURCE, type: MSG.SVE_ACTIVATE, ids: [row.uid, row.row?._id].filter(Boolean) },
      win.location.origin
    );
  }
}

/**
 * The field the click landed on, into view and marked, once the fields are
 * drawn. Statamic ids a field `field_<path with underscores>`; the panel's
 * path plus the handle is that id.
 */
function revealField(win) {
  const selection = currentSelection();
  const row = resolvedSelection.value;

  if (!host || !selection?.field || !row) {
    return;
  }

  nextTick(() => {
    const id = `field_${`${row.path}.${selection.field}`.replaceAll('.', '_')}`;
    const el = host.querySelector(`#${CSS.escape(id)}`)?.closest('.form-group') || null;

    host.querySelectorAll(`[${ACTIVE_ATTR}]`).forEach((node) => node.removeAttribute(ACTIVE_ATTR));

    if (!el) {
      return;
    }

    el.setAttribute(ACTIVE_ATTR, '');
    el.scrollIntoView({ block: 'nearest' });
  });
}
