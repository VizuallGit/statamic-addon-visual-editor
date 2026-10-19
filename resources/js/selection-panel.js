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
 * Behind the `selection_panel` feature, off by default. Phase 0: page sections
 * and the blocks and grid rows inside them. Header, footer and global sections
 * keep their own path until phase 1.
 *
 * May import: lib/, cp/, cp-state.js, cp-selectors.js, cp-section-groups.js,
 * code-dock-lazy.js, lazy/listview.js. Not cp.js, not the kernel.
 */
import { h, nextTick } from 'vue';
import { clearSelection, currentSelection, onSelection, select } from './lib/selection.js';
import { onContainerContext } from './lib/publish-containers.js';
import { selectionPanelOn } from './lib/config.js';
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
import { panelStore, panelValues, resolvedSelection, setPanelContext, setPanelSelection } from './cp/panel/store.js';
import SelectionPanel from './cp/surfaces/SelectionPanel.vue';
import { syncCodeDock } from './code-dock-lazy.js';
import { listViewSyncTo } from './lazy/listview.js';

const STYLE_ID = '__sve-selection-panel-style';

let app = null;
let host = null;
let started = false;

/** True when the panel is the thing in the left column right now. */
export function selectionPanelShowing(win) {
  return selectionPanelOn(win) && !!currentSelection() && !!resolvedSelection.value;
}

/** Whether this panel takes a row: resolvable against the page form. */
export function selectionPanelTakes(win, uid) {
  if (!selectionPanelOn(win) || !uid || !panelStore.ctx) {
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

/** `data-sid-field` carries a dotted path at times; the field is its last part. */
function fieldHandle(field) {
  return typeof field === 'string' && field ? field.split('.').pop() : null;
}

/** Once per page, from the Live Preview cluster's boot. Nothing when the feature is off. */
export function initSelectionPanel(win) {
  if (started || !selectionPanelOn(win)) {
    return;
  }

  started = true;

  // For the browser tests only: a way to read the form's values from outside.
  if (win.__sveDebug) {
    win.__sveDebug.values = () => JSON.parse(JSON.stringify(panelValues() || null));
  }
  panelStore.strings = { back: t(win, 'selection_back'), page: t(win, 'selection_page') };
  panelStore.onBack = (parentUid) => {
    if (parentUid) {
      selectRow(win, parentUid, 'panel');
    } else {
      clearSelection('panel');
    }
  };

  onContainerContext((ctx) => {
    setPanelContext(ctx);
    paint(win, currentSelection(), null);
  });

  onSelection((selection, previous) => {
    setPanelSelection(selection);
    paint(win, selection, previous);
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
        return () =>
          panelStore.ctx
            ? h(SelectionPanel, {
                key: panelStore.ctxId,
                ctx: panelStore.ctx,
                drawIcon: panelIcon,
                onPainted: () => revealField(win),
              })
            : null;
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

  const showing = !!selection && !!panelStore.ctx && !!resolvedSelection.value;

  log(`paint showing=${showing} uid=${selection?.uid || null} ctx=${!!panelStore.ctx} resolved=${!!resolvedSelection.value}`);

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

  // The panel's own back arrow is the one source that has not told the others.
  if (selection.source === 'panel') {
    const row = resolvedSelection.value;

    syncCodeDock(win, doc, row.uid);
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
