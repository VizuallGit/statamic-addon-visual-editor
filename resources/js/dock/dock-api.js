/**
 * Save now, autosave or not. For a value a panel has finished writing — a
 * component's field, a switch — not for code someone is in the middle of
 * typing: that is what the autosave toggle is for, and it stays theirs.
 */
register('dock:save-now', () => {
  flushSave(dockState.lastWin?.document);

  return true;
});
/**
 * code-dock.js — region "dock-api", split out in WP5. Same statements, same order;
 * only the imports are new. See the barrel code-dock.js for what the shell exports.
 */
import { SUNDAY_AUG30 } from '../sunday-aug30.js';
import { topLevelSectionUid } from '../cp.js';
import { isCodeDockArmed, templateDockAllowed } from '../code-dock-state.js';
import { ask, emit, on, register } from '../cp/bus.js';
import { mountPane } from '../cp/mount-pane.js';
import CodeDockChrome from '../cp/surfaces/CodeDockChrome.vue';
import { resetDataVars } from '../data-vars.js';
import { syncComponentFocus, syncComponentMap, watchComponentMap } from '../component-focus.js';
import { bindTips } from '../cp/tip.js';
import { bindPartialNav, closePartialMenu } from '../dock-partials.js';
import { bindClassTokenNav, closeClassTokenUi } from '../dock-class-tokens.js';
import { forgetComponentProps } from '../component-props.js';
import { syncComponentProps } from '../component-props-host.js';
import { paintFamilyColors, readFamilyOverrides } from '../family-colors.js';
import { t } from '../lib/i18n.js';
import { attachDock } from '../lib/dock-host.js';
import { HTML_TREE_PANEL_ID } from '../lib/ids.js';
import { unwrapRef } from '../lib/values.js';
import { sectionField } from '../lib/config.js';
import { activeContainers } from '../lib/publish-containers.js';
import { setTypeForUid } from '../focus-panel.js';
import { globalSectionHost } from '../global-section.js';
import { chromeContainer, chromeEditorOpen, chromeHost, chromeInlineKind } from '../chrome.js';
import { closeHtmlTreePanel, openHtmlTreePanel } from '../lazy/html-tree.js';
import { activeChromeKind } from '../globals-panel.js';
import { LAYOUT_TEMPLATE_TYPE } from '../lib/ids.js';
import { previewDocument } from '../lib/preview-frame.js';
import { dockState } from '../dock/state.js';
import { bindBack, bindLayoutWatch, bindPaneToggles, bindResize, bindSplitters, ensureStyle, isPanelFrame, observeDockLayout, paintBack, paintPaneButtons, placeDock, previewBottomPad, setPath, setStatus, shieldDock, stopObservingDockLayout, storedPanes } from './layout.js';
import { DATA_ICON, DOCK_ID, HANDLES, SCOPE_ICON, UNLOCK_ID, css, editors, html, loadCm } from '../code-dock.js';
import { bindCssTools, bindHtmlTidy, bindHtmlTools, bindStyleMode } from './toolbars.js';
import { bindCssAddClass } from './html-tools.js';
import { bindHistory, bindStrip, paintStrip } from './history-strip.js';
import { bindHtmlScope, clearHtmlScopeRange, currentFullHtml, currentSectionValues, flushCssScope, goBackTemplate, htmlEditorText, htmlScopeEnabled, openNestedTemplate, openRenameClassMenu, paintHtmlScope, paintLock, showHtmlFull, showHtmlScope, syncScopedHtml, writeHandleEditor, writeHtmlEditor } from './scope.js';
import { bindAutosave, bindLock, paintAutosave } from './lock-autosave.js';
import { mountEditor, paintHostWait } from './editor.js';
import { paintStyleMode, syncTwTarget } from './style-modes.js';
import { closeCssMenu, cssEditorText, paintCssToolState, writeParts } from './css-tools.js';
import { ensureTwCss, flushSave, isChromeTemplateType, onEditorInput, primeTailwindCompile, refreshPreview, resetTailwindCompile } from './save.js';
import { closeDataMenu, openDataVarsMenu } from './data-vars.js';
import { minimalChange } from '../lib/minimal-change.js';

// ===== dock-api =====
let ensureDockWait = null;

async function ensureDockAsync(win) {
  const doc = win.document;

  ensureStyle(doc);

  let dock = doc.getElementById(DOCK_ID);

  if (dock) {
    const chromeOk =
      dock.querySelector('[data-sve-css-chrome="subrow-2"]') &&
      dock.querySelector('[data-sve-css-add-class]') &&
      dock.querySelector('[data-sve-html-tools]') &&
      dock.querySelector('[data-sve-html-tidy]') &&
      dock.querySelector('[data-sve-data-vars]') &&
      dock.querySelector('[data-sve-visual-edit-tools]') &&
      dock.querySelector('[data-sve-html-scope]') &&
      dock.querySelector('[data-sve-code-lock]') &&
      dock.querySelector('[data-sve-code-back]') &&
      dock.querySelector('[data-sve-code-autosave]') &&
      dock.querySelector('[data-sve-code-save]') &&
      dock.getAttribute('data-sve-code-chrome') === 'scope-9';

    if (!chromeOk) {
      for (const handle of HANDLES) {
        editors[handle]?.destroy();
        editors[handle] = null;
      }

      dock.remove();
      dock = null;
    }
  }

  if (!dock) {
    dock = doc.createElement('div');
    dock.id = DOCK_ID;
    dock.setAttribute('data-sve-code-chrome', 'scope-9');
    // The user's own family colours, on the root every mark and button reads.
    paintFamilyColors(dock, readFamilyOverrides(win));
    mountPane(dock, CodeDockChrome, {
      htmlLabel: t(win, 'code_dock_html'),
      cssLabel: t(win, 'code_dock_css'),
      jsLabel: t(win, 'code_dock_js'),
      alpineLabel: t(win, 'code_dock_alpine'),
      treeIcon: SCOPE_ICON,
      dataIcon: DATA_ICON,
      dataLabel: t(win, 'data_vars_title'),
    });
    attachDock(doc, dock);
    shieldDock(dock);
    paintPaneButtons(dock, storedPanes(win));
    bindResize(win, dock);
    bindPaneToggles(win, dock);
    bindSplitters(win, dock);
    bindCssTools(win, dock);
    bindCssAddClass(win, dock);
    bindStyleMode(win, dock);
    bindHistory(win, dock);
    bindStrip(win, dock);
    bindTips(win, dock);
    bindHtmlTools(win, dock);
    bindHtmlScope(win, dock);
    bindLock(win, dock);
    bindBack(win, dock);
    bindAutosave(win, dock);

    for (const handle of HANDLES) {
      const host = dock.querySelector(`[data-sve-code-pane="${handle}"] [data-sve-code-host]`);

      paintHostWait(host);
    }

    openHtmlTreePanel(win);
  }

  attachDock(doc, dock);
  shieldDock(dock);
  bindHtmlTidy(win, dock);
  bindHtmlScope(win, dock);
  bindLock(win, dock);
  bindBack(win, dock);
  bindAutosave(win, dock);
  bindLayoutWatch(win);
  observeDockLayout(win);
  paintLock(win);
  paintHtmlScope(win);
  paintBack(win);
  paintAutosave(win);
  paintStyleMode(win);
  paintStrip(win);

  await loadCm();

  if (!editors.html) {
    for (const handle of HANDLES) {
      const host = dock.querySelector(`[data-sve-code-pane="${handle}"] [data-sve-code-host]`);

      host?.replaceChildren();
      mountEditor(win, handle, host);
    }

    for (const handle of ['html', 'css']) {
      if (!editors[handle]) {
        continue;
      }

      bindPartialNav(win, editors[handle], {
        onOpen: (type) => openNestedTemplate(win, type),
        emptyLabel: t(win, 'code_dock_partials_empty'),
        openLabel: (name) => t(win, 'component_open_named', { name }),
        sectionValues: () => currentSectionValues(win),
        isLocked: () => isCodeDockLocked(),
        setHover: (view, range) => dockState.htmlPartialUi?.setHover(view, range),
      });
    }

    if (SUNDAY_AUG30) {
      bindClassTokenNav(win, editors.html, {
        onRename: (token) => openRenameClassMenu(win, token),
        isLocked: () => isCodeDockLocked(),
        setHover: (view, range) => dockState.htmlClassTokenUi?.setHover(view, range),
        title: t(win, 'code_dock_css_rename_class'),
      });
    }
  }

  return dock;
}

function ensureDock(win) {
  if (!ensureDockWait) {
    ensureDockWait = ensureDockAsync(win).finally(() => {
      ensureDockWait = null;
    });
  }

  return ensureDockWait;
}

async function showMissing(win, type) {
  const dock = await ensureDock(win);

  dockState.lastType = type;
  dockState.lastLocked = true;
  dockState.lockReady = true;
  dockState.lastParts = { html: '', css: '', js: '' };
  clearHtmlScopeRange();
  paintLock(win);
  writeParts(dockState.lastParts, true);
  setPath(win.document, type);
  setStatus(win.document, t(win, 'code_dock_missing'));
  paintHtmlScope(win);
  paintBack(win);
  paintAutosave(win);
  placeDock(win, dock);
}

export async function loadTemplate(win, type, mode = 'replace') {
  if (mode === 'replace') {
    dockState.typeStack = [];
  } else if (mode === 'push' && dockState.lastType && dockState.lastType !== type) {
    dockState.typeStack.push(dockState.lastType);
  }

  const gen = ++dockState.loadGen;

  dockState.lastType = type;
  dockState.lockReady = false;
  clearHtmlScopeRange();
  setStatus(win.document, t(win, 'code_dock_loading'));

  // Kept while the file is on its way (`dock:load-settled`), and made before
  // the first await so it is there the moment the open was asked for: the
  // dock names the new file before it holds it, and a panel that writes into
  // "the open file" must wait for the file, not the name — or it writes the
  // one being left under the new file's path.
  let landed = () => {};

  dockState.loadInFlight = new Promise((resolve) => {
    landed = resolve;
  });

  const dock = await ensureDock(win);

  paintLock(win);
  paintHtmlScope(win);
  paintBack(win);
  paintAutosave(win);
  paintStyleMode(win);
  paintStrip(win);
  placeDock(win, dock);

  win
    .fetch(`/!/sve/section-template?type=${encodeURIComponent(type)}`, {
      credentials: 'same-origin',
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
    })
    .then(async (res) => {
      if (gen !== dockState.loadGen) {
        return;
      }

      if (res.status === 404) {
        showMissing(win, type);

        return;
      }

      if (!res.ok) {
        throw new Error(String(res.status));
      }

      const data = await res.json();

      if (gen !== dockState.loadGen) {
        return;
      }

      dockState.lastParts = {
        html: typeof data.html === 'string' ? data.html : '',
        css: typeof data.css === 'string' ? data.css : '',
        js: typeof data.js === 'string' ? data.js : '',
      };
      dockState.lastProps = Array.isArray(data.props) ? data.props : [];
      dockState.propsDirty = false;
      dockState.lastType = type;
      dockState.lastLocked = !!data.locked;
      dockState.lockReady = true;
      resetTailwindCompile();

      // Baked utilities came with the file: no compile, no save on open.
      if (typeof data.tw === 'string' && data.tw !== '') {
        primeTailwindCompile(dockState.lastParts.html, data.tw);
      }

      paintLock(win);
      writeParts(dockState.lastParts, dockState.lastLocked);
      // The file that just opened decides whether the left column belongs to a
      // component. Stepping in and out of one is a load like any other.
      syncComponentProps(win);

      if (!dockState.lastLocked) {
        ensureTwCss(win, dockState.lastParts.html);
      }

      setPath(win.document, data.path || type);
      setStatus(win.document, dockState.lastLocked ? t(win, 'code_dock_locked') : '');
      // Said before the first keystroke: a server whose PHP cannot write the
      // template or its baked CSS would otherwise fail on every save.
      if (data.writable?.template === false) {
        setStatus(win.document, t(win, 'code_dock_not_writable'));
      } else if (data.writable?.tw === false) {
        setStatus(win.document, t(win, 'code_dock_tw_not_writable'));
      }
      syncComponentFocus(win);
      watchComponentMap(win);
      void syncComponentMap(win);
      paintHtmlScope(win);
      paintBack(win);
      paintAutosave(win);
      placeDock(win, dock);
    })
    .catch(() => {
      if (gen !== dockState.loadGen) {
        return;
      }

      showMissing(win, type);
      setStatus(win.document, t(win, 'code_dock_error'));
    })
    .finally(() => {
      if (gen === dockState.loadGen) {
        dockState.loadInFlight = null;
      }

      landed();
    });
}

export function currentTemplateType() {
  return dockState.lastType || '';
}

export function isCodeDockOpen(doc) {
  return !!doc?.getElementById(DOCK_ID);
}

export function isCodeDockLocked() {
  return dockState.lastLocked;
}

/**
 * Paste AI Write-mode output into the open template dock.
 * HTML goes at the cursor; CSS/JS are appended to those panes.
 *
 * @param {{ html?: string, css?: string, js?: string }} parts
 */
export function insertAiSnippet(win, parts) {
  const html = typeof parts?.html === 'string' ? parts.html.trim() : '';
  const css = typeof parts?.css === 'string' ? parts.css.trim() : '';
  const js = typeof parts?.js === 'string' ? parts.js.trim() : '';

  if (!html && !css && !js) {
    return false;
  }

  if (!win?.document?.getElementById(DOCK_ID)) {
    return false;
  }

  let wrote = false;

  if (html) {
    wrote = insertPaneAtCursor('html', html) || wrote;
  }

  if (css) {
    wrote = appendPane('css', css) || wrote;
  }

  if (js) {
    wrote = appendPane('js', js) || wrote;
  }

  if (wrote) {
    onEditorInput(win);
  }

  return wrote;
}

function insertPaneAtCursor(handle, text) {
  const view = editors[handle];

  if (!view || view.state.readOnly) {
    return false;
  }

  const sel = view.state.selection.main;
  const before = sel.from > 0 ? view.state.doc.sliceString(sel.from - 1, sel.from) : '\n';
  const after = sel.to < view.state.doc.length ? view.state.doc.sliceString(sel.to, sel.to + 1) : '\n';
  const prefix = before === '\n' ? '' : '\n';
  const suffix = after === '\n' ? '' : '\n';
  const insert = `${prefix}${text}${suffix}`;

  view.dispatch({
    changes: { from: sel.from, to: sel.to, insert },
    selection: { anchor: sel.from + insert.length },
  });

  return true;
}

function appendPane(handle, text) {
  const view = editors[handle];

  if (!view || view.state.readOnly) {
    return false;
  }

  const len = view.state.doc.length;
  const needsBreak = len > 0 && view.state.doc.sliceString(Math.max(0, len - 1), len) !== '\n';
  const insert = `${needsBreak ? '\n\n' : len ? '\n' : ''}${text}\n`;

  view.dispatch({
    changes: { from: len, insert },
    selection: { anchor: len + insert.length },
  });

  return true;
}

export function refreshCodeDockFromDisk(win) {
  refreshPreview(win);

  if (!dockState.lastType || !win.document.getElementById(DOCK_ID)) {
    return;
  }

  const type = dockState.lastType;

  dockState.lastType = null;
  loadTemplate(win, type, 'keep');
}

export function closeCodeDock(doc) {
  closeDataMenu(doc);
  dockState.loadGen += 1;
  flushSave(doc);
  dockState.lastUid = null;
  dockState.lastType = null;
  dockState.typeStack = [];
  dockState.lastParts = { html: '', css: '', js: '' };
  dockState.lastLocked = false;
  dockState.lockReady = false;
  dockState.lastBracketNames = null;
  dockState.lastCssSelectorNames = null;
  clearHtmlScopeRange();
  dockState.lastWin = doc?.defaultView || dockState.lastWin;
  closeCssMenu(doc);
  closePartialMenu(doc);
  closeClassTokenUi(doc);
  doc?.getElementById(UNLOCK_ID)?.remove();

  for (const handle of HANDLES) {
    editors[handle]?.destroy();
    editors[handle] = null;
  }

  doc?.getElementById(DOCK_ID)?.remove();
  stopObservingDockLayout();

  if (doc) {
    previewBottomPad(doc, 0);
  }

  const win = doc?.defaultView || dockState.lastWin;

  if (win?.document.getElementById(HTML_TREE_PANEL_ID)) {
    closeHtmlTreePanel(win);
  }

  // `lastType` is already cleared above, so this lifts any component fade —
  // and the empty map takes the right-click offer off the page with it.
  if (win) {
    syncComponentFocus(win);
    void syncComponentMap(win);
    // `lastType` is cleared above, so this hands the field column back.
    syncComponentProps(win);
  }
}

export function relayoutCodeDock(win) {
  if (dockState.dragging) {
    return;
  }

  const dock = win.document.getElementById(DOCK_ID);

  if (!dock) {
    return;
  }

  observeDockLayout(win);
  placeDock(win, dock);
}

/**
 * The Antlers file for a page section is keyed by the row's `type` in publish
 * values. The left sidebar is a Vue mount of those rows — whether it is open
 * or has painted a set must not decide which file the dock shows.
 *
 * Header/footer and a global-section host are separate forms, so those still
 * read their own container. Collection index/show uses the entry's `view`.
 */
function pageSectionType(win, doc, uid) {
  if (uid) {
    const sectionUid =
      topLevelSectionUid(uid, doc) || topLevelSectionUid(uid, win.document) || uid;

    return String(
      (typeof setTypeForUid === 'function' &&
        (setTypeForUid(sectionUid, doc) || setTypeForUid(sectionUid, win.document))) ||
        ''
    ).trim();
  }

  const field = typeof sectionField === 'function' ? sectionField(win) : 'page_sections';
  const containers = typeof activeContainers === 'function' ? activeContainers(win.document) : [];

  for (const container of containers) {
    const values = unwrapRef(container.values) || container.values;
    const sections = values?.[field];

    if (!Array.isArray(sections)) {
      continue;
    }

    for (const row of sections) {
      const type = typeof row?.type === 'string' ? row.type.trim() : '';

      if (type) {
        return type;
      }
    }
  }

  return '';
}

export function collectionViewType(win) {
  const features = win.Statamic?.$config?.get?.('sveFeatures') || {};

  if (features.collection_templates !== true) {
    return '';
  }

  const store = win.Statamic?.$config?.get?.('sveCollectionTemplatesCollection') || 'templates';
  const path = win.location?.pathname || '';

  if (!path.includes(`/collections/${store}/entries/`)) {
    return '';
  }

  const containers = typeof activeContainers === 'function' ? activeContainers(win.document) : [];

  for (const container of containers) {
    const values = unwrapRef(container.values) || container.values;
    const view = typeof values?.view === 'string' ? values.view.trim() : '';

    if (!view || view.includes('..')) {
      continue;
    }

    const normalised = view
      .replace(/\.(antlers\.html|blade\.php)$/i, '')
      .replace(/^\/+|\/+$/g, '');

    if (normalised) {
      return `view:${normalised}`;
    }
  }

  return '';
}

/**
 * The dock handle for a half of the site frame.
 *
 * The server names the file that carries the half's root in the preview
 * (`sveChromeTemplates`, ScriptChrome::templates): the partial with
 * `data-sve-chrome` on it. When that is a styled partial and the form on
 * screen picks a layout (`header_style`), the form's choice wins — switching
 * the layout opens the layout's file. Used to be `{kind}/{style}` whatever
 * the site renders: on a site whose header is `partials/site_head.antlers.html`
 * the dock wrote to a file nothing renders, and every keystroke saved without
 * a change in the preview.
 */
function chromeTemplateFor(win, kind, values) {
  const templates = win.Statamic?.$config?.get?.('sveChromeTemplates') || {};
  const server = templates[kind] && typeof templates[kind].type === 'string' ? templates[kind] : null;
  const styles = win.Statamic?.$config?.get?.('sveChromeStyles') || {};
  const fallback = `${kind}/${typeof styles[kind] === 'string' && styles[kind] !== '' ? styles[kind] : 'style_1'}`;
  const handle = server?.type || fallback;
  const style = values?.[`${kind}_style`];

  if ((!server || server.styled) && typeof style === 'string' && style !== '') {
    return `${kind}/${style}`;
  }

  return handle;
}

/**
 * Which part of the page's frame the dock's FILE is: 'header', 'footer',
 * 'main' (the layout) — or '' on a section, a template, a component.
 *
 * Read off the file, not off the sidebar. The header's form and the header's
 * file open at different moments, and a tree drawn from the sidebar's state
 * showed the header's rows under a section, and a section's rows under the
 * header, one step behind whatever had just happened.
 */
function frameKindOnDock() {
  const type = currentTemplateType();

  if (!type) {
    return '';
  }

  if (type === LAYOUT_TEMPLATE_TYPE) {
    return 'main';
  }

  // A collection's own template: the page's content, inside main.
  if (dockState.lastWin && type === collectionViewType(dockState.lastWin)) {
    return 'template';
  }

  const styled = type.match(/^(header|footer)\//);

  if (styled) {
    return styled[1];
  }

  const templates = dockState.lastWin?.Statamic?.$config?.get?.('sveChromeTemplates') || {};

  return ['header', 'footer'].find((kind) => templates[kind]?.type === type) || '';
}

/** The half whose FORM the sidebar holds — 'header', 'footer' — or ''. */
function chromeKindOpen(doc) {
  const kind = chromeInlineKind || activeChromeKind;

  if (kind !== 'header' && kind !== 'footer') {
    return '';
  }

  return chromeHost(doc) || chromeEditorOpen(doc) ? kind : '';
}

function chromeTemplateType(win, doc) {
  const kind = chromeInlineKind || activeChromeKind;

  if (kind !== 'header' && kind !== 'footer') {
    return '';
  }

  if (!chromeHost(doc) && !chromeEditorOpen(doc)) {
    return '';
  }

  return chromeTemplateFor(win, kind, unwrapRef(chromeContainer()?.values) || {});
}

/**
 * A page with no sections and nothing picked still has a header and a footer
 * in the preview. The dock opens the header's template then, with the style
 * the site has chosen (`sveChromeStyles` comes from the globals), so the
 * button never does nothing.
 */
/** Whether a top-level row of the page builder renders `type`. */
function pageHasType(win, type) {
  if (!type || String(type).startsWith('view:') || isChromeTemplateType(win, type)) {
    return false;
  }

  const field = typeof sectionField === 'function' ? sectionField(win) : 'page_sections';
  const containers = typeof activeContainers === 'function' ? activeContainers(win.document) : [];

  for (const container of containers) {
    const values = unwrapRef(container.values) || container.values;
    const rows = values?.[field];

    if (Array.isArray(rows) && rows.some((row) => row?.type === type)) {
      return true;
    }
  }

  return false;
}

function globalSectionTemplateType(doc) {
  const host = globalSectionHost(doc) || doc.getElementById('__sve-global-section-host');

  if (!host) {
    return '';
  }

  return host.querySelector('[data-replicator-set][data-type]')?.getAttribute('data-type') || '';
}

/**
 * Load the template file for the section the editor is on.
 *
 * `uid` is a visual id on the page (section or a block inside it). Type is
 * always the outer page-section row in publish values. Do not wait for that
 * row to exist as a replicator set in the left sidebar.
 */
export function syncCodeDock(win, doc, uid) {
  if (dockState.dragging) {
    return;
  }

  const uidChanged = !!(uid && uid !== dockState.lastUid);

  // The section asked for is remembered even while the dock is shut: opened
  // later with nothing named, it shows what was chosen, not the default.
  if (uid) {
    dockState.lastUid = uid;
  }

  if (!win || !doc || isPanelFrame(doc) || !templateDockAllowed(win) || !isCodeDockArmed(win)) {
    if (doc) {
      closeCodeDock(doc);
    }

    return;
  }

  // A file the page no longer shows is not kept, and neither is the section
  // chosen before it: the header or the footer just closed, a global section
  // left, a section deleted. Only when no editor for those is open, and only
  // for a file no page row renders — a section just added, whose row is not
  // in the values yet, is still the page's.
  const leftBehind =
    !uid &&
    !!dockState.lastType &&
    dockState.lastType !== LAYOUT_TEMPLATE_TYPE &&
    !chromeHost(doc) &&
    !chromeEditorOpen(doc) &&
    !globalSectionHost(doc) &&
    !pageHasType(win, dockState.lastType);

  if (leftBehind) {
    dockState.lastUid = null;
  }

  const chosen = uid || dockState.lastUid || '';
  const resolved =
    chromeTemplateType(win, doc) ||
    globalSectionTemplateType(doc) ||
    (chosen ? pageSectionType(win, doc, chosen) : '') ||
    collectionViewType(win) ||
    (!uid && !leftBehind ? dockState.lastType : '');
  // Nothing chosen — on opening, after a part of the frame closed, with the
  // chosen section gone: the layout's <main>. The page's content is the place
  // to stand by default, and what a new section lands in. Never for a request
  // for a section by uid, which must keep what it holds rather than hand the
  // dock (and the tree with it) elsewhere.
  const type = resolved || (!uid ? LAYOUT_TEMPLATE_TYPE : '');

  // On the layout because nothing else was chosen, not because it was: the
  // first section added to such a page is what the reader wants open.
  dockState.onEmptyPage = !resolved && !uid;

  dockState.lastWin = win;

  if (!type) {
    return;
  }

  if (type === dockState.lastType && doc.getElementById(DOCK_ID)) {
    return;
  }

  if (dockState.typeStack.length && dockState.lastType && dockState.lastType !== type) {
    const root = dockState.typeStack[0];

    if (type === root && !uidChanged) {
      return;
    }

    dockState.typeStack = [];
  }

  flushSave(doc);
  loadTemplate(win, type, 'replace');
}

// A different tag, or a class added to it, relights the icon row.
on('tw:changed', () => {
  if (dockState.lastWin && dockState.styleMode === 'tw') {
    paintCssToolState(dockState.lastWin);
  }
});

register('dock:is-open', (doc) => isCodeDockOpen(doc));
register('dock:is-locked', () => isCodeDockLocked());
register('dock:html', () => currentFullHtml());
register('dock:reveal-html', ({ from, to, caret } = {}) => {
  const view = editors.html;

  if (!view || from == null) {
    return;
  }

  dockState.htmlScopePref = htmlScopeEnabled(dockState.lastWin);
  syncScopedHtml();
  flushCssScope();

  const length = dockState.htmlFull.length;
  const start = Math.max(0, Math.min(from, length));
  const end = Math.max(start, Math.min(to ?? from, length));

  dockState.htmlFocus = end > start ? { from: start, to: end } : null;

  // `caret` says "put me inside this", which the tree asks for so the next
  // thing written lands in the row that was picked. Without one the whole
  // range is selected, which is what a plain reveal has always done.
  const at = caret == null ? null : Math.max(0, Math.min(caret, length));

  if (dockState.htmlScopePref && dockState.htmlFocus) {
    showHtmlScope(at);
    paintHtmlScope(dockState.lastWin);

    return;
  }

  if (dockState.htmlScopeActive) {
    showHtmlFull(true, at);
    paintHtmlScope(dockState.lastWin);

    return;
  }

  view.dispatch({
    selection: at == null ? { anchor: start, head: end } : { anchor: at },
    scrollIntoView: true,
  });
  view.focus();
});
register('dock:insert-snippet', ({ win, parts }) => insertAiSnippet(win, parts));
register('dock:refresh', (win) => refreshCodeDockFromDisk(win));
register('dock:tw-follow', () => {
  if (dockState.lastWin) {
    syncTwTarget(dockState.lastWin);
  }
});
/**
 * The CSS pane, whole — `cssFull` is the truth, and the pane may be showing a
 * scoped slice of it, so it is flushed first. Extracting a component reads and
 * rewrites it: the rules that describe the markup leave with the markup.
 */
register('dock:css', () => {
  flushCssScope();

  return dockState.cssFull;
});
register('dock:set-css', (css) => {
  if (typeof css !== 'string' || isCodeDockLocked()) {
    return false;
  }

  if (!editors.css || !dockState.lastWin) {
    return false;
  }

  flushCssScope();
  dockState.cssFull = css;
  writeHandleEditor('css', cssEditorText());
  onEditorInput(dockState.lastWin);

  return true;
});
/**
 * Open the field picker anchored on someone else's button. `onPick` gets the
 * row, so the caller decides what a pick writes and where. `at` says where in
 * the template the caller is standing, so the loop around it can be read; left
 * out, the HTML pane's cursor answers that instead.
 */
register('dock:data-menu', ({ anchor, onPick, at } = {}) => {
  if (!anchor || !dockState.lastWin) {
    return false;
  }

  closeDataMenu(dockState.lastWin.document);
  closeCssMenu(dockState.lastWin.document);
  openDataVarsMenu(dockState.lastWin, anchor, onPick, at);

  return true;
});
/**
 * The open file's declared fields, and a change to them.
 *
 * A change is a save: the list is not text anyone is mid-word in, so there is
 * nothing to debounce and nothing to lose by writing it straight away.
 */
register('dock:props', () => dockState.lastProps.map((prop) => ({ ...prop })));
register('dock:set-props', ({ win, props } = {}) => {
  if (!Array.isArray(props) || isCodeDockLocked()) {
    return false;
  }

  dockState.lastProps = props;
  dockState.propsDirty = true;
  forgetComponentProps(componentSrcOf(currentTemplateType()));
  flushSave((win || dockState.lastWin)?.document);

  return true;
});

/** `view:partials/components/card` is the component `components/card`. */
function componentSrcOf(type) {
  const match = /^view:partials\/(components\/[A-Za-z0-9_-]+)$/.exec(String(type || ''));

  return match ? match[1] : '';
}

register('dock:component-src', () => componentSrcOf(currentTemplateType()));

/**
 * The templates beneath the open one, bottom first — the section, then each
 * component passed through on the way in — with the component src each one
 * is, when it is one. The HTML tree draws them around the open component.
 */
register('dock:type-stack', () =>
  dockState.typeStack.map((type) => ({ type, src: componentSrcOf(type) }))
);

/**
 * What a way out of the open component would say and do.
 *
 * `back` is the difference that matters: a component reached from a section
 * has a template underneath to return to, and one opened on its own has
 * nothing beneath it — leaving that means closing the dock.
 */
register('dock:component-exit-state', () => {
  const src = componentSrcOf(currentTemplateType());

  return {
    open: !!src,
    name: src ? src.split('/').pop() : '',
    back: dockState.typeStack.length > 0,
  };
});

/**
 * Leave the open component. Both roads out save on the way — `goBackTemplate`
 * and `closeCodeDock` each flush first — so there is no version of this that
 * loses what was typed.
 */
register('dock:exit-component', (levels = 1) => {
  if (!dockState.lastWin || !componentSrcOf(currentTemplateType())) {
    return false;
  }

  if (dockState.typeStack.length) {
    // More than one level out — a click on the section's own row while a
    // component inside a component is open — drops the templates in between
    // without loading them; only the one landed on is loaded.
    for (let n = Number(levels) || 1; n > 1 && dockState.typeStack.length > 1; n -= 1) {
      dockState.typeStack.pop();
    }

    goBackTemplate(dockState.lastWin);
  } else {
    closeCodeDock(dockState.lastWin.document);
  }

  return true;
});

register('dock:current-type', () => currentTemplateType());
// True while the dock shows the header only because the page has no sections.
register('dock:on-empty-page', () => !!dockState.onEmptyPage);
register('dock:current-uid', () => dockState.lastUid);
// A part of the frame was closed on purpose (the bar's Close, Escape): the
// page's content is the place to stand again — said outright, not inferred
// from whether the part's editor is still in the DOM, which on a server (the
// docked editor) it is for a moment longer.
register('dock:leave-part', () => {
  const win = dockState.lastWin;

  if (!win) {
    return false;
  }

  dockState.lastUid = null;
  flushSave(win.document);
  void loadTemplate(win, LAYOUT_TEMPLATE_TYPE, 'replace');

  return true;
});
// Which part of the frame the dock's file is, so the tree can draw header,
// main and footer around the page — and which half's form the sidebar holds.
register('dock:chrome-kind', () => frameKindOnDock());
// The collection template this entry is, if it is one — the tree's way back to it.
register('dock:collection-view', () => (dockState.lastWin ? collectionViewType(dockState.lastWin) : ''));
register('dock:chrome-open', (doc) => chromeKindOpen(doc));
/**
 * The save in the air, if any. A panel that writes the file and then asks the
 * server about what it wrote has to wait for this — the answer is read from
 * disk, and the write is still on its way there.
 */
register('dock:save-settled', () => dockState.saveInFlight || null);
/**
 * The load in the air, if any. `dock:current-type` answers with the new file's
 * name the moment it is asked for; the file itself lands when this settles.
 */
register('dock:load-settled', () => dockState.loadInFlight || null);
/**
 * Re-render the preview without saving anything.
 *
 * For changes the dock did not make and cannot see — a field added to the
 * section's fieldset, say. The page is still showing a render from before it.
 */
/**
 * Forget the data picker's variable lists.
 *
 * They are built from the blueprint and cached for as long as the page is
 * open — which was fine while a blueprint could not change under it. It can
 * now: a field added or removed in the fields panel changes what the picker
 * should offer. Clearing is all that is needed; the picker fetches when it is
 * opened, so the next open is correct and nothing on screen moves before then.
 */
register('dock:reset-data-vars', (setHandle) => {
  resetDataVars(typeof setHandle === 'string' && setHandle ? setHandle : undefined);

  return true;
});

register('dock:refresh-preview', () => {
  if (!dockState.lastWin) {
    return false;
  }

  refreshPreview(dockState.lastWin);

  return true;
});

/**
 * Open a file in the dock as the file — not stacked under the one before, the
 * way a component opens from a partial link. The tree opens the layout so:
 * there is nothing to go back to, because the frame's rows are the way out.
 */
register('dock:open-file', (type) => {
  if (typeof type !== 'string' || !type || !dockState.lastWin) {
    return false;
  }

  if (type === dockState.lastType) {
    return true;
  }

  flushSave(dockState.lastWin.document);
  void loadTemplate(dockState.lastWin, type, 'replace');

  return true;
});

/** Open another template — the same push the partial links in the panes do. */
register('dock:open-template', (type) => {
  if (typeof type !== 'string' || !type || !dockState.lastWin) {
    return false;
  }

  openNestedTemplate(dockState.lastWin, type);

  return true;
});
register('dock:set-html', (html) => {
  if (typeof html !== 'string' || isCodeDockLocked()) {
    return false;
  }

  const view = editors.html;

  if (!view || !dockState.lastWin) {
    return false;
  }

  // Empty string = detach view (last section gone). Never autosave an empty file.
  if (html === '') {
    if (dockState.saveTimer) {
      clearTimeout(dockState.saveTimer);
      dockState.saveTimer = null;
    }

    // Drop any in-flight Tailwind compile save; it would post empty HTML.
    dockState.twDirty = false;
    dockState.twCss = null;
    dockState.twKey = '';

    // Detach before clearing panes — flushSave no-ops without lastType, and
    // readParts reads cssFull (not the CSS editor), so clear that too.
    dockState.lastType = null;
    dockState.lastUid = null;
    dockState.lastParts = { html: '', css: '', js: '' };
    dockState.cssFull = '';
    dockState.htmlFull = '';

    dockState.applying = true;

    try {
      clearHtmlScopeRange();

      for (const handle of HANDLES) {
        const ed = editors[handle];

        if (!ed) {
          continue;
        }

        const current = ed.state.doc.toString();

        if (current !== '') {
          ed.dispatch({
            changes: { from: 0, to: current.length, insert: '' },
          });
        }
      }
    } finally {
      dockState.applying = false;
    }

    return true;
  }

  const before = dockState.htmlFull;

  dockState.htmlFull = html;

  if (dockState.htmlScopeActive) {
    // The scoped pane shows `htmlFull.slice(htmlFocus)`. An edit that changed
    // the length of what is inside that range leaves the end of it pointing
    // short, and the pane renders a truncated tag — `{{ /artis`. Writing in
    // that pane then syncs the truncation back into the file, so the range is
    // moved with the edit rather than left behind.
    dockState.htmlFocus = shiftFocus(dockState.htmlFocus, before, html);
    writeHtmlEditor(htmlEditorText());
    onEditorInput(dockState.lastWin);
    emit('dock:html-changed');

    return true;
  }

  const current = view.state.doc.toString();

  if (current !== html) {
    // Only the span that differs is replaced. A whole-document change maps
    // the cursor to the end of the file, and everything that follows the
    // cursor followed it: the HTML tree's row, the Tailwind strip's tag, the
    // preview's focus all jumped to the section root after a class was added
    // from the strip. A minimal change keeps the caret on the tag it was in.
    const [from, to, insert] = minimalChange(current, html);

    view.dispatch({
      changes: { from, to, insert },
    });
  }

  return true;
});
/**
 * Empty the dock panes without saving. Used when the last page section is
 * removed — `dock:set-html ''` would autosave an empty Antlers file.
 */
register('dock:show-empty', () => ask('dock:set-html', ''));

// The last page section left the page (removed from the tree, the preview or
// the block tree): the file it showed is no longer on this page.
on('row:removed', ({ parentPath, remaining, win }) => {
  if (remaining === 0 && parentPath === sectionField(win)) {
    ask('dock:show-empty');
  }
});

/**
 * Move a focus range so it still covers the same thing after an edit.
 *
 * Where the two texts first differ says whether the edit landed before the
 * range (move both ends), inside it (stretch the end), or after it (leave it).
 */
function shiftFocus(focus, before, after) {
  const delta = after.length - before.length;

  if (!focus || !delta) {
    return focus;
  }

  let at = 0;

  while (at < before.length && at < after.length && before[at] === after[at]) {
    at += 1;
  }

  if (at >= focus.to) {
    return focus;
  }

  if (at < focus.from) {
    return { from: Math.max(0, focus.from + delta), to: Math.max(0, focus.to + delta) };
  }

  return { from: focus.from, to: Math.max(focus.from, focus.to + delta) };
}

