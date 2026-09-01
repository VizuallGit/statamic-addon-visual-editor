/**
 * Site CSS in Live Preview — the files under resources/css.
 *
 * Own surface. Does not import overlay, preview, bridge or the template dock.
 * Saving writes the file on disk; Vite picks it up. Preview has no HMR client,
 * so the stylesheet link is cache-busted after a save.
 */
import { mountSurface } from './cp/mount.js';
import { openCpOverlay } from './cp/open-overlay.js';
import { t } from './cp-t.js';
import { sve } from './cp-registry.js';
import SiteCssPane from './cp/surfaces/SiteCssPane.vue';
import NamePrompt from './cp/surfaces/NamePrompt.vue';
import { siteCssUi as ui } from './cp/site-css/store.js';

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
let HighlightStyle;
let syntaxHighlighting;
let tags;

let cmReady = null;
let app = null;
let editor = null;
let applying = false;
let savedCss = '';
let loadSeq = 0;

function loadCm() {
  if (cmReady) {
    return cmReady;
  }

  cmReady = Promise.all([
    import('@codemirror/view'),
    import('@codemirror/state'),
    import('@codemirror/commands'),
    import('@codemirror/autocomplete'),
    import('@codemirror/lang-css'),
    import('@codemirror/language'),
    import('@lezer/highlight'),
  ]).then(([view, state, commands, complete, langCss, language, highlight]) => {
    EditorView = view.EditorView;
    keymap = view.keymap;
    lineNumbers = view.lineNumbers;
    highlightActiveLine = view.highlightActiveLine;
    highlightActiveLineGutter = view.highlightActiveLineGutter;
    tooltips = view.tooltips;
    EditorState = state.EditorState;
    defaultKeymap = commands.defaultKeymap;
    indentWithTab = commands.indentWithTab;
    historyKeymap = commands.historyKeymap;
    history = commands.history;
    autocompletion = complete.autocompletion;
    closeBrackets = complete.closeBrackets;
    closeBracketsKeymap = complete.closeBracketsKeymap;
    completionKeymap = complete.completionKeymap;
    css = langCss.css;
    HighlightStyle = language.HighlightStyle;
    syntaxHighlighting = language.syntaxHighlighting;
    tags = highlight.tags;
  }).catch((err) => {
    cmReady = null;
    throw err;
  });

  return cmReady;
}

function vscTheme() {
  return [
    EditorView.theme(
      {
        '&': { height: '100%', backgroundColor: '#1e1e1e', color: '#d4d4d4' },
        '.cm-content': {
          caretColor: '#aeafad',
          padding: '12px 0',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
          fontSize: '13px',
          lineHeight: '1.55',
        },
        '.cm-cursor': { borderLeftColor: '#aeafad' },
        '.cm-activeLine': { backgroundColor: '#ffffff0d' },
        '.cm-activeLineGutter': { backgroundColor: '#ffffff0d' },
        '.cm-gutters': {
          backgroundColor: '#1e1e1e',
          color: '#858585',
          border: 'none',
          borderRight: '1px solid #3c3c3c',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
          fontSize: '13px',
          lineHeight: '1.55',
        },
        '.cm-lineNumbers .cm-gutterElement': { paddingLeft: '8px', paddingRight: '12px' },
        '.cm-scroller': { overflow: 'auto', height: '100%', minHeight: 0 },
        '.cm-selectionBackground, &.cm-focused .cm-selectionBackground': {
          backgroundColor: '#264f78 !important',
        },
      },
      { dark: true }
    ),
    syntaxHighlighting(
      HighlightStyle.define([
        { tag: tags.keyword, color: '#569cd6' },
        { tag: tags.string, color: '#ce9178' },
        { tag: tags.comment, color: '#6a9955', fontStyle: 'italic' },
        { tag: tags.number, color: '#b5cea8' },
        { tag: tags.className, color: '#d7ba7d' },
        { tag: tags.propertyName, color: '#9cdcfe' },
        { tag: tags.variableName, color: '#9cdcfe' },
        { tag: tags.unit, color: '#b5cea8' },
        { tag: tags.color, color: '#ce9178' },
        { tag: tags.bracket, color: '#ffd700' },
        { tag: tags.punctuation, color: '#d4d4d4' },
        { tag: tags.operator, color: '#d4d4d4' },
        { tag: tags.definition(tags.propertyName), color: '#9cdcfe' },
      ])
    ),
  ];
}

const COMPLETE_STYLE_ID = '__sve-site-css-complete';

function ensureCompleteStyles(doc) {
  if (doc.getElementById(COMPLETE_STYLE_ID)) {
    return;
  }

  const style = doc.createElement('style');

  style.id = COMPLETE_STYLE_ID;
  style.textContent = `
.cm-tooltip.sve-css-complete {
  background: #1e1e1e !important;
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
`;
  doc.head.appendChild(style);
}

function csrfToken(win) {
  return (
    win.document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ||
    win.Statamic?.$config?.get?.('csrfToken') ||
    win.Statamic?.$config?.get?.('csrf_token') ||
    ''
  );
}

function previewDocument(win) {
  const iframe = win.document.getElementById('live-preview-iframe');

  try {
    const doc = iframe?.contentDocument || null;
    const nested = doc?.getElementById('live-preview-iframe');

    return nested?.contentDocument || doc;
  } catch {
    return null;
  }
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

function paintLabels(win) {
  ui.title = t(win, 'site_css_title');
  ui.addLabel = t(win, 'site_css_add');
  ui.saveLabel = t(win, 'site_css_save');
  ui.reloadTitle = t(win, 'site_css_reload');
  ui.emptyLabel = t(win, 'site_css_empty');
  ui.notImported = t(win, 'site_css_not_imported');
  ui.importLabel = t(win, 'site_css_import');
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
        css(),
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
        }),
        ...vscTheme(),
      ],
    }),
    parent: host,
  });
}

async function request(win, url, options = {}) {
  const res = await win.fetch(url, {
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

    if (seq !== loadSeq) {
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
    bumpPreviewCss(win);
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
    heading: t(win, 'site_css_add_title'),
    nameLabel: t(win, 'site_css_add_label'),
    placeholder: t(win, 'site_css_add_placeholder'),
    cancelLabel: t(win, 'cancel'),
    saveLabel: t(win, 'site_css_add'),
    onOk: async (name) => {
      overlay.dismiss();

      try {
        const data = await request(win, '/!/sve/site-css/create', {
          method: 'POST',
          body: JSON.stringify({ path: name }),
        });

        applyListing(data);
        await openFile(win, data.path);
        bumpPreviewCss(win);
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
    bumpPreviewCss(win);
  } catch {
    ui.status = t(win, 'site_css_error');
  }
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
  win?.document?.getElementById(PANEL_ID)?.remove();
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

      const first = ui.tree.some((node) => node.path === 'site.css')
        ? 'site.css'
        : firstFile(ui.tree);

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

sve.closeSiteCss = closeSiteCss;
sve.toggleSiteCss = toggleSiteCss;
sve.siteCssAllowed = siteCssAllowed;
sve.isSiteCssOpen = isSiteCssOpen;
