/**
 * Load Live Preview tools only when they are opened (or remembered as open).
 *
 * Does not import overlay-host, preview, or bridge. Panel files assign onto
 * `sve` when they load; stubs below keep chrome/globals/focus from throwing
 * before that happens — missing functions were aborting preview clicks
 * (left sidebar stayed on the full section list) and toolbar highlight
 * (right dock never painted as active).
 */
import { sve } from './cp-registry.js';
import { registerRightDockHook, RIGHT_PANEL_FILL, showInRightShell } from './right-dock.js';

export const PANEL_IDS = {
  listview: '__sve-listview-panel',
  outline: '__sve-outline-panel',
  html_tree: '__sve-html-tree-panel',
  comments: '__sve-comments-pane',
  sections: '__sve-section-picker',
};

const WAIT_ID = '__sve-panel-wait';
const SPIN_STYLE_ID = '__sve-panel-wait-style';

const loaders = {
  sections: () => import('./section-library.js'),
  listview: () => import('./block-tree.js'),
  outline: () => import('./outline-panel.js'),
  html_tree: () => import('./html-tree.js'),
  edits: () => import('./page-activity.js'),
  comments: () => Promise.all([import('./block-tree.js'), import('./comments.js')]),
};

const inflight = {};
let sectionsWarmed = false;

sve.SECTION_PICKER_ID = sve.SECTION_PICKER_ID || PANEL_IDS.sections;
sve.OUTLINE_PANEL_ID = sve.OUTLINE_PANEL_ID || PANEL_IDS.outline;
sve.HTML_TREE_PANEL_ID = sve.HTML_TREE_PANEL_ID || PANEL_IDS.html_tree;
sve.COMMENTS_PANEL_ID = sve.COMMENTS_PANEL_ID || PANEL_IDS.comments;
sve.FOCUS_LOCKED_TABS = sve.FOCUS_LOCKED_TABS || [];

function noop() {}

function stub(name, impl) {
  if (typeof sve[name] !== 'function') {
    sve[name] = impl;
  }
}

function stubUntilLoaded(name, key) {
  if (typeof sve[name] === 'function') {
    return;
  }

  const placeholder = (...args) => {
    void ensurePanel(key).then(() => {
      if (sve[name] !== placeholder) {
        sve[name](...args);
      }
    });
  };

  sve[name] = placeholder;
}

stub('isSectionLibraryLocked', () => false);
stub('featureOn', (win, key) => win.Statamic?.$config?.get?.('sveFeatures')?.[key] !== false);
stub('livePreviewEditorEl', (doc) => doc?.querySelector?.('.live-preview-editor') || null);
stub('closeRightPanels', noop);
stub('syncPreviewInset', noop);
stub('isGlobalsOverlayOpen', () => false);
stub('paintFocusLockedTabs', noop);
stub('dismissChromeForPageEdit', noop);
stub('hideGlobalsPanel', noop);
stub('showGlobalsPanel', noop);
stub('parkGlobalsOverlay', noop);
stub('attachGlobalsOverlay', noop);
stub('placeGlobalsOverlay', noop);
stub('bindGlobalsOverlayLayout', noop);
stub('pinGlobalsPanelLeft', noop);
stub('mountInLivePreviewEditor', noop);
stub('claimLivePreviewEditor', noop);
stub('listViewSyncTo', noop);
stub('sectionField', (win) => win.Statamic?.$config?.get?.('sveSectionField') || 'page_sections');
stub('blockRowUid', (row) => row?._visual_id || row?.id || row?._id || '');

stubUntilLoaded('handleAddRow', 'sections');
stubUntilLoaded('insertSection', 'sections');
stubUntilLoaded('handleInsertBardSet', 'sections');
stubUntilLoaded('handleInsertBlock', 'sections');
stubUntilLoaded('fillHtmlTreePane', 'html_tree');
stubUntilLoaded('showHtmlTreePane', 'html_tree');
stubUntilLoaded('openHtmlTreePanel', 'html_tree');
stubUntilLoaded('closeHtmlTreePanel', 'html_tree');
stubUntilLoaded('toggleHtmlTreePanel', 'html_tree');
stubUntilLoaded('renderHtmlTree', 'html_tree');

function bindRightDockHooks() {
  if (typeof sve.fillListViewPane === 'function') {
    registerRightDockHook('listview', {
      fill: sve.fillListViewPane,
      show: sve.showListViewPane,
    });
  }

  if (typeof sve.fillOutlinePane === 'function') {
    registerRightDockHook('outline', {
      fill: sve.fillOutlinePane,
      show: sve.showOutlinePane,
      hide: (win) => sve.watchOutlineInPreview?.(win, false),
    });
  }

  if (typeof sve.fillHtmlTreePane === 'function') {
    registerRightDockHook('html_tree', {
      fill: sve.fillHtmlTreePane,
      show: sve.showHtmlTreePane,
    });
  }

  if (typeof sve.mountSectionPicker === 'function') {
    registerRightDockHook('sections', {
      fill: (win) => sve.mountSectionPicker(win),
    });
  }
}

stub('registerRightDockContent', bindRightDockHooks);

stub('syncSectionLibraryAvailability', (win) => {
  const placeholder = sve.syncSectionLibraryAvailability;

  void ensurePanel('sections').then(() => {
    if (sve.syncSectionLibraryAvailability !== placeholder) {
      sve.syncSectionLibraryAvailability(win);
    }
  });
});

function ensureSpinStyle(doc) {
  if (doc.getElementById(SPIN_STYLE_ID)) {
    return;
  }

  const style = doc.createElement('style');

  style.id = SPIN_STYLE_ID;
  style.textContent =
    '@keyframes sve-panel-wait-spin{to{transform:rotate(360deg)}}';
  doc.head.appendChild(style);
}

export function isRightPanelInDom(win, key) {
  const id = PANEL_IDS[key];

  return !!(id && win.document.getElementById(id));
}

export function showPanelWait(win, key) {
  if (!PANEL_IDS[key] || isRightPanelInDom(win, key)) {
    return;
  }

  const doc = win.document;

  ensureSpinStyle(doc);

  let el = doc.getElementById(WAIT_ID);

  if (!el) {
    el = doc.createElement('div');
    el.id = WAIT_ID;
    el.style.cssText =
      RIGHT_PANEL_FILL +
      'display:flex;align-items:center;justify-content:center;min-height:8rem;';
    el.innerHTML =
      '<span style="width:18px;height:18px;border:2px solid currentColor;border-right-color:transparent;border-radius:50%;display:block;animation:sve-panel-wait-spin .6s linear infinite" aria-hidden="true"></span>';
  }

  el.setAttribute('data-sve-right-pane', key);
  showInRightShell(win, el);
}

export function hidePanelWait(win) {
  win.document.getElementById(WAIT_ID)?.remove();
}

/**
 * section-library.js is also globals overlay, insert, chrome-dismiss — not only
 * Patterns. Warm it once Live Preview is on screen so a headline click and a
 * Patterns click hit the real functions, not a race with the first import.
 */
export function warmLivePreviewCore(win) {
  if (sectionsWarmed) {
    return;
  }

  if (!win?.document?.querySelector?.('.live-preview-editor, #live-preview-iframe')) {
    return;
  }

  sectionsWarmed = true;
  void ensurePanel('sections');
}

export function ensurePanel(key) {
  if (!loaders[key]) {
    return Promise.resolve();
  }

  if (!inflight[key]) {
    inflight[key] = loaders[key]()
      .then(() => {
        if (typeof sve.registerRightDockContent === 'function' && sve.registerRightDockContent !== bindRightDockHooks) {
          sve.registerRightDockContent();
        } else {
          bindRightDockHooks();
        }
      })
      .catch((err) => {
        delete inflight[key];
        console.error('[sve] load panel', key, err);
        throw err;
      });
  }

  return inflight[key];
}
