/**
 * Load Live Preview tools only when they are opened (or remembered as open).
 *
 * Does not import overlay-host, preview, or bridge. A lazy panel is reached
 * through its facade in lazy/*.js: the facade asks loadedPanel() for the module
 * and, while it is away, answers as the old stub did. ensurePanel() resolves
 * with the module and remembers it, which is what makes that work.
 */
import { sve } from './cp-registry.js';
import { sveState } from './cp-state.js';
import { syncCodeDock as syncCodeDockLazily } from './code-dock-lazy.js';
import {
  registerRightDockHook,
  releaseRightShellIfEmpty,
  RIGHT_PANEL_FILL,
  showInRightShell,
} from './right-dock.js';
import { injectStyle } from './lib/style.js';
import { aiTextStoredOn } from './lazy/ai-text.js';
import { COMMENTS_PANEL_ID, HTML_TREE_PANEL_ID, LISTVIEW_PANEL_ID, OUTLINE_PANEL_ID, PERF_PANEL_ID, SECTION_PICKER_ID } from './lib/ids.js';
import { mountSectionPicker } from './section-library.js';

export const PANEL_IDS = {
  listview: LISTVIEW_PANEL_ID,
  outline: OUTLINE_PANEL_ID,
  html_tree: HTML_TREE_PANEL_ID,
  comments: COMMENTS_PANEL_ID,
  sections: SECTION_PICKER_ID,
  performance: PERF_PANEL_ID,
};

const WAIT_ID = '__sve-panel-wait';
const SPIN_STYLE_ID = '__sve-panel-wait-style';

const loaders = {
  sections: () => import('./section-library.js'),
  listview: () => import('./block-tree.js'),
  outline: () => import('./outline-panel.js'),
  html_tree: () => import('./html-tree.js'),
  performance: () => import('./performance-panel.js'),
  edits: () => import('./page-activity.js'),
  comments: () => Promise.all([import('./block-tree.js'), loadComments()]),
  schema: () => import('./schema-panel.js'),
  ai_text: () => import('./ai-text.js'),
};

/**
 * Comments draws pins over the preview, but only after someone uses the tool.
 * Loading it (and the block tree) with every Live Preview open was the cost of
 * a toolbar icon that is almost never clicked. Hover, click, or a remembered
 * open pane still bring the pins in before they are needed on screen.
 */
let commentsStarted = false;

function loadComments() {
  return import('./comments.js').then((mod) => {
    if (!commentsStarted) {
      commentsStarted = true;
      mod.initComments();
    }

    return mod;
  });
}

const inflight = {};
/** Module namespaces of the panels that have loaded, by key — what lazy/*.js answer from. */
const loaded = {};
let sectionsWarmed = false;

/** The panel's module when it has loaded, else null. Synchronous on purpose. */
export function loadedPanel(key) {
  return loaded[key] || null;
}

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

// The template dock is asked to sync from lite-sections before it is loaded.
// Route it through the lazy door, which knows whether the dock is even on.
// (lite-sections.js is a standalone script and still reads this off window.sve — WP6.)
stub('syncCodeDock', (win, doc, uid) => syncCodeDockLazily(win, doc, uid));

function bindRightDockHooks() {
  if (loaded.listview) {
    registerRightDockHook('listview', {
      fill: loaded.listview.fillListViewPane,
      show: loaded.listview.showListViewPane,
    });
  }

  if (loaded.outline) {
    registerRightDockHook('outline', {
      fill: loaded.outline.fillOutlinePane,
      show: loaded.outline.showOutlinePane,
      hide: (win) => loaded.outline.watchOutlineInPreview?.(win, false),
    });
  }

  if (loaded.html_tree) {
    registerRightDockHook('html_tree', {
      fill: loaded.html_tree.fillHtmlTreePane,
      show: loaded.html_tree.showHtmlTreePane,
    });
  }

  if (loaded.performance) {
    registerRightDockHook('performance', {
      fill: loaded.performance.fillPerfPane,
      show: loaded.performance.showPerfPane,
    });
  }

  if (typeof mountSectionPicker === 'function') {
    registerRightDockHook('sections', {
      fill: (win) => mountSectionPicker(win),
    });
  }
}

stub('registerRightDockContent', bindRightDockHooks);

function ensureSpinStyle(doc) {
  injectStyle(doc, SPIN_STYLE_ID, '@keyframes sve-panel-wait-spin{to{transform:rotate(360deg)}}');
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
  const el = win.document.getElementById(WAIT_ID);

  if (!el) {
    return;
  }

  el.remove();

  // The spinner was the only thing in the sidebar. If the panel it stood in for
  // is not coming — a tool that failed to load, or a click that turned into a
  // close — the sidebar must not stay open around nothing. Bracketed swaps are
  // exempt: there, the next panel really is on its way.
  releaseRightShellIfEmpty(win);
}

/**
 * section-library.js is already in addon.js (insert, set meta, plus). This
 * only binds dock hooks and, if the AI-text switch is already on, the one
 * tool that has to answer the preview without a click.
 *
 * Comments, schema, AI chat, outline and the block tree wait for their icon
 * — or a remembered-open restore.
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

  if (aiTextStoredOn(win)) {
    void ensurePanel('ai_text');
  }
}

/**
 * Overlay fade-in and HTML-tree prefetch both wait for this. Set once, after
 * the preview has painted and remembered panes have been asked for — not
 * while the iframe is still booting.
 */
export function markLivePreviewReady(win) {
  if (sveState.lpReady) {
    return;
  }

  sveState.lpReady = true;
  win.dispatchEvent(new Event('sve-lp-ready'));
}

export function ensurePanel(key) {
  if (!loaders[key]) {
    return Promise.resolve();
  }

  if (!inflight[key]) {
    inflight[key] = loaders[key]()
      .then((mod) => {
        loaded[key] = Array.isArray(mod) ? mod[0] : mod;

        if (typeof sve.registerRightDockContent === 'function' && sve.registerRightDockContent !== bindRightDockHooks) {
          sve.registerRightDockContent();
        } else {
          bindRightDockHooks();
        }

        return loaded[key];
      })
      .catch((err) => {
        delete inflight[key];
        console.error('[sve] load panel', key, err);
        throw err;
      });
  }

  return inflight[key];
}
