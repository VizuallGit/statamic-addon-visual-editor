/**
 * The site's own files in Live Preview: stylesheets under resources/css,
 * scripts under resources/js and SVG icons under resources/svg — three tabs
 * of one panel, each with its own folder, editor language and starter file.
 *
 * Own surface. Does not import overlay, preview, bridge or the template dock.
 * Saving writes the file on disk; Vite picks it up. Preview has no HMR client,
 * so the stylesheet link is cache-busted after a save.
 */
import { mountSurface } from './cp/mount.js';
import { openCpOverlay } from './cp/open-overlay.js';
import { t } from './lib/i18n.js';
import SiteCssPane from './cp/surfaces/SiteCssPane.vue';
import NamePrompt from './cp/surfaces/NamePrompt.vue';
import ChoiceDialog from './cp/surfaces/ChoiceDialog.vue';
import { siteCssUi as ui } from './cp/site-css/store.js';
import { csrfToken } from './lib/csrf.js';
import { previewDocument } from './lib/preview-frame.js';
import { injectStyle } from './lib/style.js';
import { loadCodeMirror, vscTheme } from './lib/codemirror.js';

const PANEL_ID = '__sve-site-css';

let EditorView;
let keymap;
let lineNumbers;
let highlightActiveLine;
let highlightActiveLineGutter;
let tooltips;
let EditorState;
let defaultKeymap;
let indentWithTab;
let historyKeymap;
let history;
let autocompletion;
let closeBrackets;
let closeBracketsKeymap;
let completionKeymap;
let css;
let javascript;
let html;
let HighlightStyle;
let syntaxHighlighting;
let tags;

let cmReady = null;
let cm = null;
let app = null;
let editor = null;
let applying = false;
let savedCss = '';
let loadSeq = 0;

/** This editor's bindings, filled from the shared loader in lib/codemirror.js. */
function loadCm() {
  if (cmReady) {
    return cmReady;
  }

  cmReady = loadCodeMirror()
    .then((loaded) => {
      cm = loaded;
    EditorView = cm.view.EditorView;
    keymap = cm.view.keymap;
    lineNumbers = cm.view.lineNumbers;
    highlightActiveLine = cm.view.highlightActiveLine;
    highlightActiveLineGutter = cm.view.highlightActiveLineGutter;
    tooltips = cm.view.tooltips;
    EditorState = cm.state.EditorState;
    defaultKeymap = cm.commands.defaultKeymap;
    indentWithTab = cm.commands.indentWithTab;
    historyKeymap = cm.commands.historyKeymap;
    history = cm.commands.history;
    autocompletion = cm.autocomplete.autocompletion;
    closeBrackets = cm.autocomplete.closeBrackets;
    closeBracketsKeymap = cm.autocomplete.closeBracketsKeymap;
    completionKeymap = cm.autocomplete.completionKeymap;
    css = cm.langCss.css;
    javascript = cm.langJs.javascript;
    html = cm.langHtml.html;
    HighlightStyle = cm.language.HighlightStyle;
    syntaxHighlighting = cm.language.syntaxHighlighting;
    tags = cm.highlight.tags;
    })
    .catch((err) => {
      cmReady = null;
      throw err;
    });

  return cmReady;
}

const COMPLETE_STYLE_ID = '__sve-site-css-complete';

function ensureCompleteStyles(doc) {
  injectStyle(doc, COMPLETE_STYLE_ID, `
.cm-tooltip.sve-css-complete {
  background: #1E1E21 !important;
  color: #d4d4d4;
  border: 1px solid #454545 !important;
  border-radius: 4px;
  box-shadow: 0 4px 16px rgba(0,0,0,.45);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace !important;
  font-size: 12px !important;
  line-height: 18px !important;
  padding: 0 !important;
  overflow: hidden;
  z-index: 2147483600;
}
.cm-tooltip.sve-css-complete > ul {
  font: inherit !important;
  max-height: 240px;
  padding: 2px 0;
  margin: 0;
}
.cm-tooltip.sve-css-complete > ul > li {
  padding: 1px 8px 1px 6px !important;
  line-height: 22px !important;
  font: inherit !important;
}
.cm-tooltip.sve-css-complete > ul > li[aria-selected] {
  background: rgba(255,255,255,.1) !important;
}
.cm-tooltip.sve-css-complete .cm-completionLabel {
  color: #9cdcfe;
  font-size: 12px !important;
}
.cm-tooltip.sve-css-complete .cm-completionMatchedText {
  text-decoration: none;
  font-weight: 600;
}
.cm-tooltip.sve-css-complete .cm-completionDetail {
  color: #808080 !important;
  font-size: 11px !important;
  font-style: normal !important;
  margin-left: 12px;
}
.cm-tooltip.sve-css-complete .cm-completionIcon {
  width: 14px;
  height: 14px;
  opacity: .65;
  font-size: 11px !important;
}
`);
}

function bumpPreviewCss(win) {
  const doc = previewDocument(win);

  if (!doc) {
    return;
  }

  const stamp = String(Date.now());

  doc.querySelectorAll('link[rel="stylesheet"]').forEach((link) => {
    const href = link.getAttribute('href') || '';

    if (!/site\.css|resources\/css/i.test(href)) {
      return;
    }

    try {
      const url = new URL(href, win.location.origin);

      url.searchParams.set('sve-css', stamp);
      link.setAttribute('href', url.toString());
    } catch {
      link.setAttribute('href', `${href.split('?')[0]}?sve-css=${stamp}`);
    }
  });
}

const KINDS = ['css', 'js', 'svg'];

/** The lang key for this kind: site_css_*, site_js_*, site_svg_*. */
function key(kind, name) {
  return `site_${kind}_${name}`;
}

/** The editor language for a kind: CSS, JavaScript, or HTML for SVG markup. */
function languageFor(kind) {
  if (kind === 'js') {
    return javascript();
  }

  if (kind === 'svg') {
    return html();
  }

  return css();
}

/** After a save: stylesheets are cache-busted in the preview; the rest needs no nudge. */
function bumpPreview(win) {
  if (ui.kind === 'css') {
    bumpPreviewCss(win);
  }
}

function paintLabels(win) {
  const kind = ui.kind;

  ui.tabs = KINDS.map((k) => ({ key: k, label: t(win, `site_css_tab_${k}`) }));
  ui.title = t(win, key(kind, 'title'));
  ui.addLabel = t(win, key(kind, 'add'));
  ui.previewLabel = t(win, 'site_svg_preview');
  ui.saveLabel = t(win, 'site_css_save');
  ui.reloadTitle = t(win, 'site_css_reload');
  ui.emptyLabel = t(win, 'site_css_empty');
  ui.notImported = t(win, 'site_css_not_imported');
  ui.importLabel = t(win, 'site_css_import');
  ui.renameLabel = t(win, 'site_css_rename');
  ui.deleteLabel = t(win, 'site_css_delete');
}

function setCss(text) {
  if (!editor) {
    return;
  }

  applying = true;
  editor.dispatch({
    changes: { from: 0, to: editor.state.doc.length, insert: text },
  });
  applying = false;
  savedCss = text;
  ui.dirty = false;
  ui.svgPreview = ui.kind === 'svg' ? text : '';
}

function mountEditor(win, host) {
  editor?.destroy();
  editor = null;

  if (!host || !EditorView) {
    return;
  }

  ensureCompleteStyles(win.document);

  editor = new EditorView({
    state: EditorState.create({
      doc: '',
      extensions: [
        lineNumbers(),
        highlightActiveLine(),
        highlightActiveLineGutter(),
        history(),
        languageFor(ui.kind),
        closeBrackets(),
        autocompletion({
          activateOnTyping: true,
          tooltipClass: () => 'sve-css-complete',
        }),
        tooltips({ parent: win.document.body }),
        keymap.of([
          ...defaultKeymap,
          indentWithTab,
          ...historyKeymap,
          ...completionKeymap,
          ...closeBracketsKeymap,
          {
            key: 'Mod-s',
            run: () => {
              void saveFile(win);

              return true;
            },
          },
        ]),
        EditorView.lineWrapping,
        EditorView.updateListener.of((update) => {
          if (!update.docChanged || applying) {
            return;
          }

          ui.dirty = editor.state.doc.toString() !== savedCss;
          ui.status = ui.dirty ? t(win, 'site_css_unsaved') : '';

          // The icon redraws as it is typed.
          if (ui.kind === 'svg') {
            ui.svgPreview = editor.state.doc.toString();
          }
        }),
        ...vscTheme(cm, { height: '100%', background: '#1E1E21' }),
      ],
    }),
    parent: host,
  });
}

/** The URL with the panel's kind on it — every endpoint takes it. */
function withKind(url) {
  return `${url}${url.includes('?') ? '&' : '?'}kind=${encodeURIComponent(ui.kind)}`;
}

async function request(win, url, options = {}) {
  const res = await win.fetch(withKind(url), {
    credentials: 'same-origin',
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'X-CSRF-TOKEN': csrfToken(win),
      Accept: 'application/json',
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    throw new Error(String(res.status));
  }

  return res.json();
}

function applyListing(data) {
  // A listing for another kind (a slow answer after a tab switch) is not this one.
  if (data.kind && data.kind !== ui.kind) {
    return;
  }

  if (data.root) {
    ui.root = data.root;
  }

  if (Array.isArray(data.tree)) {
    ui.tree = data.tree;
  }
}

async function loadTree(win) {
  const data = await request(win, '/!/sve/site-css');

  applyListing(data);
}

async function openFile(win, path) {
  if (!path) {
    return;
  }

  if (ui.dirty && ui.path && ui.path !== path) {
    const ok = await saveFile(win);

    if (!ok) {
      return;
    }
  }

  const seq = ++loadSeq;

  ui.loading = true;
  ui.status = t(win, 'site_css_loading');
  ui.path = path;

  try {
    const data = await request(win, `/!/sve/site-css/file?path=${encodeURIComponent(path)}`);

    if (seq !== loadSeq || (data.kind && data.kind !== ui.kind)) {
      return;
    }

    ui.imported = data.imported !== false;
    setCss(String(data.css || ''));
    ui.status = '';
  } catch {
    if (seq !== loadSeq) {
      return;
    }

    ui.status = t(win, 'site_css_error');
  } finally {
    if (seq === loadSeq) {
      ui.loading = false;
    }
  }
}

async function saveFile(win) {
  if (!ui.path || !editor) {
    return false;
  }

  ui.status = t(win, 'site_css_saving');

  try {
    const data = await request(win, '/!/sve/site-css', {
      method: 'POST',
      body: JSON.stringify({
        path: ui.path,
        css: editor.state.doc.toString(),
      }),
    });

    savedCss = editor.state.doc.toString();
    ui.dirty = false;
    ui.imported = data.imported !== false;
    ui.status = t(win, 'site_css_saved');
    bumpPreview(win);

    if (ui.kind === 'css') {
      // The dock's Tailwind forgets the theme it kept (tw-compile and friends).
      win.dispatchEvent(new CustomEvent('sve:site-css-saved', { detail: { path: ui.path } }));
    }
    win.setTimeout(() => {
      if (ui.status === t(win, 'site_css_saved')) {
        ui.status = '';
      }
    }, 1200);

    return true;
  } catch {
    ui.status = t(win, 'site_css_error');

    return false;
  }
}

async function reloadFile(win) {
  if (!ui.path) {
    return;
  }

  ui.dirty = false;
  await openFile(win, ui.path);
}

function addFile(win) {
  const overlay = openCpOverlay(win.document, NamePrompt, {
    heading: t(win, key(ui.kind, 'add_title')),
    nameLabel: t(win, 'site_css_add_label'),
    placeholder: t(win, key(ui.kind, 'add_placeholder')),
    cancelLabel: t(win, 'cancel'),
    saveLabel: t(win, key(ui.kind, 'add')),
    onOk: async (name) => {
      overlay.dismiss();

      try {
        const data = await request(win, '/!/sve/site-css/create', {
          method: 'POST',
          body: JSON.stringify({ path: name }),
        });

        applyListing(data);
        await openFile(win, data.path);
        bumpPreview(win);
      } catch {
        ui.status = t(win, 'site_css_error');
      }
    },
  });
}

async function importFile(win) {
  if (!ui.path) {
    return;
  }

  try {
    const data = await request(win, '/!/sve/site-css/import', {
      method: 'POST',
      body: JSON.stringify({ path: ui.path }),
    });

    applyListing(data);
    ui.imported = true;
    bumpPreview(win);
  } catch {
    ui.status = t(win, 'site_css_error');
  }
}

/**
 * Rename the open stylesheet. `site.css` is refused server-side — it is the
 * Vite entry, and everything else only reaches the page through it.
 */
function renameFile(win) {
  if (!ui.path) {
    return;
  }

  const from = ui.path;

  const overlay = openCpOverlay(win.document, NamePrompt, {
    heading: t(win, 'site_css_rename'),
    nameLabel: ui.root,
    placeholder: from,
    value: from,
    cancelLabel: t(win, 'cancel'),
    saveLabel: t(win, 'site_css_rename'),
    onOk: async (next) => {
      overlay.dismiss();

      if (!next || next === from) {
        return;
      }

      try {
        const data = await request(win, '/!/sve/site-css/rename', {
          method: 'POST',
          body: JSON.stringify({ from, to: next }),
        });

        applyListing(data);
        ui.path = '';
        await openFile(win, data.path);
        bumpPreview(win);
      } catch {
        ui.status = t(win, 'site_css_rename_error');
      }
    },
  });
}

/**
 * Delete the open stylesheet, and its `@import` with it. Asked first: this is
 * the one button here that cannot be undone.
 */
function deleteFile(win) {
  if (!ui.path) {
    return;
  }

  const path = ui.path;

  const overlay = openCpOverlay(win.document, ChoiceDialog, {
    title: t(win, key(ui.kind, 'delete_title')),
    body: `${ui.root}/${path}`,
    buttons: [
      { value: 'cancel', label: t(win, 'cancel'), variant: 'muted' },
      { value: 'ok', label: t(win, 'site_css_delete'), variant: 'danger' },
    ],
    onPick: async (value) => {
      overlay.dismiss();

      if (value !== 'ok') {
        return;
      }

      try {
        const data = await request(win, '/!/sve/site-css', {
          method: 'DELETE',
          body: JSON.stringify({ path }),
        });

        applyListing(data);
        ui.path = '';
        ui.dirty = false;
        setCss('');
        bumpPreview(win);
      } catch {
        ui.status = t(win, 'site_css_delete_error');
      }
    },
  });
}

function panelParent(doc) {
  return doc.querySelector('.live-preview') || doc.body;
}

function placePanel(win, el) {
  const parent = panelParent(win.document);
  const header = parent.querySelector('.live-preview-header');

  if (win.getComputedStyle(parent).position === 'static') {
    parent.style.position = 'relative';
  }

  if (parent !== el.parentElement) {
    parent.appendChild(el);
  }

  const top = header ? Math.round(header.getBoundingClientRect().height) : 0;

  el.style.top = `${top}px`;
}

export function siteCssAllowed(win) {
  return win.Statamic?.$config?.get?.('sveFeatures')?.site_css === true;
}

export function isSiteCssOpen(doc) {
  return !!doc?.getElementById(PANEL_ID);
}

export function closeSiteCss(win) {
  editor?.destroy();
  editor = null;
  app?.unmount();
  app = null;
  savedCss = '';
  ui.path = '';
  ui.tree = [];
  ui.dirty = false;
  ui.status = '';
  ui.svgPreview = '';
  win?.document?.getElementById(PANEL_ID)?.remove();
}

/** The file a kind opens with: its Vite entry when there is one, else the first in the tree. */
function firstFor(kind, tree) {
  const entry = kind === 'css' ? 'site.css' : kind === 'js' ? 'site.js' : '';

  return entry && tree.some((node) => node.path === entry) ? entry : firstFile(tree);
}

/**
 * Switch the panel to another kind of file. What is open is saved first; the
 * editor is remounted with the kind's language, and the kind's folder listed.
 */
async function setKind(win, kind) {
  if (!KINDS.includes(kind) || kind === ui.kind) {
    return;
  }

  if (ui.dirty && ui.path && !(await saveFile(win))) {
    return;
  }

  ++loadSeq;
  ui.kind = kind;
  ui.path = '';
  ui.tree = [];
  ui.dirty = false;
  ui.status = '';
  ui.svgPreview = '';
  savedCss = '';
  paintLabels(win);

  const host = win.document.getElementById(PANEL_ID)?.querySelector('[data-sve-site-css-host]');

  mountEditor(win, host);

  try {
    await loadTree(win);

    const first = firstFor(kind, ui.tree);

    if (first) {
      await openFile(win, first);
    }
  } catch {
    ui.status = t(win, 'site_css_error');
  }
}

export function toggleSiteCss(win) {
  if (!siteCssAllowed(win)) {
    return;
  }

  if (isSiteCssOpen(win.document)) {
    closeSiteCss(win);

    return;
  }

  openSiteCss(win);
}

function openSiteCss(win) {
  const doc = win.document;
  const panel = doc.createElement('div');

  panel.id = PANEL_ID;
  panel.style.cssText = 'position:absolute;left:0;right:0;bottom:0;';
  paintLabels(win);
  placePanel(win, panel);

  app = mountSurface(SiteCssPane, panel, {
    onClose: () => closeSiteCss(win),
    onSelect: (path) => void openFile(win, path),
    onAdd: () => addFile(win),
    onSave: () => void saveFile(win),
    onReload: () => void reloadFile(win),
    onImport: () => void importFile(win),
    onRename: () => renameFile(win),
    onDelete: () => deleteFile(win),
    onTab: (kind) => void setKind(win, kind),
  });

  const host = panel.querySelector('[data-sve-site-css-host]');

  void loadCm()
    .then(() => {
      if (!isSiteCssOpen(doc)) {
        return;
      }

      mountEditor(win, host);

      return loadTree(win);
    })
    .then(() => {
      if (!isSiteCssOpen(doc)) {
        return;
      }

      const first = firstFor(ui.kind, ui.tree);

      if (first) {
        return openFile(win, first);
      }
    })
    .catch(() => {
      ui.status = t(win, 'site_css_error');
    });
}

function firstFile(nodes) {
  for (const node of nodes || []) {
    if (node.type === 'file') {
      return node.path;
    }

    const nested = firstFile(node.children || []);

    if (nested) {
      return nested;
    }
  }

  return '';
}
