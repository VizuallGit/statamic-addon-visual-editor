/**
 * Bottom HTML / CSS / JS dock for a section type's Antlers file.
 *
 * Super admin, the settings toggle, and the Live Preview header button all
 * have to be on. The file is the shared template for every page that uses the
 * type — which is why editors never see it. The three panes map to markup,
 * `{{ style_push }}` and `{{ script_push }}`; saving writes them back as one
 * file and morphs Live Preview.
 *
 * A super admin can lock a section type so the panes stay visible but
 * read-only. Unlocking asks first: the file is shared by every page that
 * uses the type. Designed types start locked; `custom_section` starts open.
 * The file may hold `{{# sve-locked #}}` or `{{# sve-unlocked #}}`.
 */

import { findSetByUid, replayLivePreview } from './cp.js';
import { sve } from './cp-registry.js';
import { chromeGet, chromeSet } from './chrome-prefs.js';
import { splitterFill } from './right-dock.js';
import { register } from './cp/bus.js';
import { mountPane } from './cp/mount-pane.js';
import CodeDockChrome from './cp/surfaces/CodeDockChrome.vue';
import ChoiceDialog from './cp/surfaces/ChoiceDialog.vue';
import CodeDockHtmlTools from './cp/surfaces/CodeDockHtmlTools.vue';
import CodeDockCssTools from './cp/surfaces/CodeDockCssTools.vue';
import CodeDockMenu from './cp/surfaces/CodeDockMenu.vue';
import { openCpOverlay } from './cp/open-overlay.js';
import { mountSurface } from './cp/mount.js';
import { EditorView, keymap, lineNumbers, highlightActiveLine, highlightActiveLineGutter } from '@codemirror/view';
import { Compartment, EditorState } from '@codemirror/state';
import { defaultKeymap, indentWithTab, historyKeymap, history } from '@codemirror/commands';
import { autocompletion, closeBrackets, closeBracketsKeymap, closeCompletion, completionKeymap } from '@codemirror/autocomplete';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { javascript } from '@codemirror/lang-javascript';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags } from '@lezer/highlight';

const DOCK_ID = '__sve-code-dock';
const STYLE_ID = '__sve-code-dock-style';
const UNLOCK_ID = '__sve-code-dock-unlock';
const HEIGHT_KEY = 'sve-code-dock-height';
const PANES_KEY = 'sve-code-dock-panes';
const WIDTHS_KEY = 'sve-code-dock-widths';
const ARMED_KEY = 'sve-code-dock-armed';
const DEFAULT_HEIGHT = 280;
const MIN_HEIGHT = 120;
const MIN_PANE = 140;
const SAVE_MS = 700;
const HANDLES = ['html', 'css', 'js'];
const LOCK_CLOSED_ICON =
  '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>';
const LOCK_OPEN_ICON =
  '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 7.9-1"/></svg>';
const CSS_MENU_ID = '__sve-css-menu';
const HTML_HEADINGS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
const HTML_TOOLS = [
  { id: 'heading', title: 'heading', menu: 'heading', letter: 'H' },
  { id: 'p', title: 'paragraph', tag: 'p', letter: 'P' },
  { id: 'div', title: 'div', tag: 'div' },
  { id: 'section', title: 'section', tag: 'section' },
  { id: 'ul', title: 'list', tag: 'ul' },
  { id: 'li', title: 'list item', tag: 'li' },
];
const CSS_SPACING = [
  '--size-100',
  '--size-200',
  '--size-300',
  '--size-400',
  '--size-500',
  '--size-600',
  '--size-700',
  '--size-800',
  '--size-900',
  '--gutter',
];
const CSS_GRAYS = [
  ['--gray-50', '#fafafa'],
  ['--gray-100', '#f5f5f5'],
  ['--gray-200', '#e5e5e5'],
  ['--gray-300', '#d4d4d4'],
  ['--gray-400', '#a3a3a3'],
  ['--gray-500', '#737373'],
  ['--gray-600', '#525252'],
  ['--gray-700', '#404040'],
  ['--gray-800', '#262626'],
  ['--gray-900', '#171717'],
  ['--gray-950', '#0a0a0a'],
];
const CSS_TOOLS = [
  { id: 'flex-row', title: 'flex row', flexDir: 'row' },
  { id: 'flex-col', title: 'flex column', flexDir: 'column' },
  { id: 'absolute', title: 'absolute', insert: 'position: absolute;' },
  { id: 'color', title: 'color', property: 'color', menu: 'colors' },
  { id: 'bg', title: 'background color', property: 'background-color', menu: 'colors' },
  { id: 'padding', title: 'padding', property: 'padding', menu: 'spacing' },
  { id: 'margin', title: 'margin', property: 'margin', menu: 'spacing' },
];
const CSS_FLEX_EXTRAS = [
  { id: 'justify-start', title: 'justify start', property: 'justify-content', value: 'flex-start' },
  { id: 'justify-center', title: 'justify center', property: 'justify-content', value: 'center' },
  { id: 'justify-end', title: 'justify end', property: 'justify-content', value: 'flex-end' },
  { id: 'justify-between', title: 'space between', property: 'justify-content', value: 'space-between' },
  { id: 'justify-around', title: 'space around', property: 'justify-content', value: 'space-around' },
  { id: 'align-start', title: 'align start', property: 'align-items', value: 'flex-start', group: 'align' },
  { id: 'align-center', title: 'align center', property: 'align-items', value: 'center', group: 'align' },
  { id: 'align-end', title: 'align end', property: 'align-items', value: 'flex-end', group: 'align' },
  { id: 'align-stretch', title: 'align stretch', property: 'align-items', value: 'stretch', group: 'align' },
];
const CSS_TOOL_ICONS = {
  'flex-row':
    '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2 8h12"/><path d="M4.2 5.8 2 8l2.2 2.2"/><path d="M11.8 5.8 14 8l-2.2 2.2"/></svg>',
  'flex-col':
    '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v12"/><path d="M5.8 4.2 8 2l2.2 2.2"/><path d="M5.8 11.8 8 14l2.2-2.2"/></svg>',
  'justify-start':
    '<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="3.5" width="2.4" height="9" rx=".4"/><rect x="5.4" y="3.5" width="2.4" height="9" rx=".4"/></svg>',
  'justify-center':
    '<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="4.6" y="3.5" width="2.4" height="9" rx=".4"/><rect x="9" y="3.5" width="2.4" height="9" rx=".4"/></svg>',
  'justify-end':
    '<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="8.2" y="3.5" width="2.4" height="9" rx=".4"/><rect x="11.6" y="3.5" width="2.4" height="9" rx=".4"/></svg>',
  'justify-between':
    '<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="3.5" width="2.4" height="9" rx=".4"/><rect x="11.6" y="3.5" width="2.4" height="9" rx=".4"/></svg>',
  'justify-around':
    '<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="4" y="3.5" width="2.4" height="9" rx=".4"/><rect x="9.6" y="3.5" width="2.4" height="9" rx=".4"/></svg>',
  'align-start':
    '<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="3.5" y="2" width="9" height="2.4" rx=".4"/><rect x="3.5" y="5.4" width="9" height="2.4" rx=".4"/></svg>',
  'align-center':
    '<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="3.5" y="4.6" width="9" height="2.4" rx=".4"/><rect x="3.5" y="9" width="9" height="2.4" rx=".4"/></svg>',
  'align-end':
    '<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="3.5" y="8.2" width="9" height="2.4" rx=".4"/><rect x="3.5" y="11.6" width="9" height="2.4" rx=".4"/></svg>',
  'align-stretch':
    '<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="3" y="2" width="4" height="12" rx=".5"/><rect x="9" y="2" width="4" height="12" rx=".5"/></svg>',
  absolute:
    '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2.5" y="2.5" width="11" height="11" rx="1" stroke-dasharray="2 1.5"/><circle cx="8" cy="8" r="1.4" fill="currentColor" stroke="none"/></svg>',
  color:
    '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 13.5 L8 2.5 L12 13.5"/><path d="M5.4 10h5.2"/></svg>',
  bg: '<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="2" width="12" height="12" rx="2" opacity=".85"/></svg>',
  padding:
    '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1"/><rect x="4.5" y="4.5" width="7" height="7" rx=".6"/></svg>',
  margin:
    '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="4.5" y="4.5" width="7" height="7" rx=".6"/><path d="M2 2.5h12M2 13.5h12M2.5 2v12M13.5 2v12" stroke-dasharray="1.4 1.2"/></svg>',
};
const HTML_TOOL_ICONS = {
  div: '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2.5" y="3.5" width="11" height="9" rx="1.2"/></svg>',
  section:
    '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2" y="2.5" width="12" height="11" rx="1.2"/><path d="M2 6.5h12"/></svg>',
  ul: '<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><circle cx="3.2" cy="4" r="1"/><circle cx="3.2" cy="8" r="1"/><circle cx="3.2" cy="12" r="1"/><rect x="5.5" y="3.2" width="8" height="1.5" rx=".4"/><rect x="5.5" y="7.2" width="8" height="1.5" rx=".4"/><rect x="5.5" y="11.2" width="8" height="1.5" rx=".4"/></svg>',
  li: '<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><circle cx="3.2" cy="8" r="1.1"/><rect x="5.5" y="7.2" width="8" height="1.6" rx=".4"/></svg>',
};

let cssColorsPromise = null;

let lastUid = null;
let lastType = null;
let lastParts = { html: '', css: '', js: '' };
let lastLocked = false;
let lockReady = false;
let lastWin = null;
let loadGen = 0;
let saveTimer = null;
let saveInFlight = null;
let dragging = false;
let applying = false;
let layoutObserver = null;
let layoutWin = null;
let observedEditor = null;
let observedRight = null;
let layoutWatchBound = false;
const editors = { html: null, css: null, js: null };
const readOnlyOf = {
  html: new Compartment(),
  css: new Compartment(),
  js: new Compartment(),
};
const editableOf = {
  html: new Compartment(),
  css: new Compartment(),
  js: new Compartment(),
};

function t(win, key, replacements = {}) {
  let out = win.Statamic?.$config?.get?.('sveStrings')?.[key] ?? key;

  for (const [name, value] of Object.entries(replacements)) {
    out = String(out).replaceAll(`:${name}`, value);
  }

  return out;
}

function csrfToken(win) {
  return (
    win.document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ||
    win.Statamic?.$config?.get?.('csrfToken') ||
    win.Statamic?.$config?.get?.('csrf_token') ||
    ''
  );
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
        '.cm-scroller': { overflow: 'auto', minHeight: 0, height: '100%' },
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
        { tag: tags.tagName, color: '#4ec9b0' },
        { tag: tags.propertyName, color: '#9cdcfe' },
        { tag: tags.variableName, color: '#9cdcfe' },
        { tag: tags.attributeName, color: '#9cdcfe' },
        { tag: tags.attributeValue, color: '#ce9178' },
        { tag: tags.angleBracket, color: '#808080' },
        { tag: tags.unit, color: '#b5cea8' },
        { tag: tags.color, color: '#ce9178' },
        { tag: tags.bracket, color: '#ffd700' },
        { tag: tags.punctuation, color: '#d4d4d4' },
        { tag: tags.operator, color: '#d4d4d4' },
      ])
    ),
  ];
}

function languageOf(handle) {
  if (handle === 'css') {
    return css();
  }

  if (handle === 'js') {
    return javascript();
  }

  return html({ autoCloseTags: true });
}

function dockParent(doc) {
  return doc.querySelector('.live-preview') || doc.body;
}

function attachDock(doc, dock) {
  const parent = dockParent(doc);

  if (dock.parentElement !== parent) {
    parent.appendChild(dock);
  }
}

/**
 * Bubble only — capture would steal keys/clicks from CodeMirror.
 * Stops Statamic Live Preview (DismissableLayer / global shortcuts) from
 * treating the dock as "outside" and closing onto the front end.
 */
function shieldDock(dock) {
  if (dock._sveShield) {
    return;
  }

  dock._sveShield = true;

  const stop = (event) => event.stopPropagation();

  for (const type of [
    'keydown',
    'keypress',
    'keyup',
    'pointerdown',
    'pointerup',
    'mousedown',
    'mouseup',
    'click',
    'focusin',
  ]) {
    dock.addEventListener(type, stop);
  }
}

function isPanelFrame(doc) {
  try {
    return new URLSearchParams(doc.defaultView?.location?.search || '').has('sve-panel');
  } catch {
    return false;
  }
}

/**
 * Missing or stale feature maps must stay off — `featureOn()` treats unknown
 * keys as on, which would open a disk-writing dock by accident.
 */
export function templateDockAllowed(win) {
  return win.Statamic?.$config?.get?.('sveFeatures')?.template_dock === true;
}

export function isCodeDockArmed(win) {
  if (!win) {
    return false;
  }

  return chromeGet(win, ARMED_KEY) === '1';
}

export function setCodeDockArmed(win, on) {
  chromeSet(win, ARMED_KEY, on ? '1' : '0');
}

function outermostSetOf(uid, doc) {
  let el = uid ? findSetByUid(uid, doc) : null;

  if (!el) {
    return null;
  }

  let current = el;

  while (true) {
    const parent = current.parentElement?.closest('[data-replicator-set]');

    if (!parent) {
      return current;
    }

    current = parent;
  }
}

function storedHeight(win) {
  const n = parseInt(chromeGet(win, HEIGHT_KEY) ?? '', 10);

  if (Number.isFinite(n) && n >= MIN_HEIGHT) {
    return n;
  }

  return DEFAULT_HEIGHT;
}

function storeHeight(win, px) {
  chromeSet(win, HEIGHT_KEY, String(px));
}

function storedPanes(win) {
  try {
    const raw = JSON.parse(chromeGet(win, PANES_KEY) || 'null');

    if (raw && typeof raw === 'object') {
      return {
        html: raw.html !== false,
        css: raw.css !== false,
        js: raw.js === true,
      };
    }
  } catch {
    /* ignore */
  }

  return { html: true, css: true, js: false };
}

function storePanes(win, panes) {
  chromeSet(win, PANES_KEY, JSON.stringify(panes));
}

function storedWidths(win) {
  try {
    const raw = JSON.parse(chromeGet(win, WIDTHS_KEY) || 'null');

    if (raw && typeof raw === 'object') {
      const n = (v) => (Number.isFinite(v) && v > 0 ? v : 1);

      return { html: n(raw.html), css: n(raw.css), js: n(raw.js) };
    }
  } catch {
    /* ignore */
  }

  return { html: 1, css: 1, js: 1 };
}

function storeWidths(win, widths) {
  chromeSet(win, WIDTHS_KEY, JSON.stringify(widths));
}

function ensureStyle(doc) {
  let style = doc.getElementById(STYLE_ID);

  if (!style) {
    style = doc.createElement('style');
    style.id = STYLE_ID;
    doc.head.appendChild(style);
  }

  style.textContent = `
#${DOCK_ID} {
  position: fixed;
  /* Same band as the right dock: above the page, under Statamic stacks. */
  z-index: var(--z-index-above, 1);
  display: flex;
  flex-direction: column;
  overflow: visible;
  background: #1e1e1e;
  color: #d4d4d4;
  border-top: 1px solid rgba(255,255,255,.12);
  box-shadow: 0 -8px 24px rgba(0,0,0,.28);
  font-family: ui-sans-serif, system-ui, sans-serif;
}
#${DOCK_ID} [data-sve-code-bar] {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 18px 12px 10px;
  border-bottom: 1px solid rgba(255,255,255,.08);
  user-select: none;
  cursor: ns-resize;
}
#${DOCK_ID} [data-sve-code-pane-btn] {
  all: unset;
  cursor: pointer;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: .02em;
  opacity: .55;
}
#${DOCK_ID} [data-sve-code-pane-btn][aria-pressed="true"] {
  background: rgba(255,255,255,.12);
  opacity: 1;
}
#${DOCK_ID} [data-sve-code-path] {
  font-size: 11px;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  opacity: .4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
  margin-left: 8px;
}
#${DOCK_ID} [data-sve-code-status] {
  margin-left: auto;
  font-size: 11px;
  opacity: .7;
  flex: 0 0 auto;
}
#${DOCK_ID} [data-sve-code-lock] {
  all: unset;
  cursor: pointer;
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  margin-left: 4px;
  border-radius: 6px;
  color: #d4d4d4;
  opacity: .55;
}
#${DOCK_ID} [data-sve-code-lock]:hover {
  opacity: 1;
  background: rgba(255,255,255,.1);
}
#${DOCK_ID} [data-sve-code-lock][aria-pressed="true"] {
  opacity: 1;
  color: #fbbf24;
  background: rgba(251,191,36,.12);
}
#${DOCK_ID} [data-sve-code-lock][hidden] {
  display: none;
}
#${DOCK_ID}[data-sve-code-locked] [data-sve-css-tools],
#${DOCK_ID}[data-sve-code-locked] [data-sve-html-tools] {
  pointer-events: none;
  opacity: .28;
}
#${DOCK_ID}[data-sve-code-locked] [data-sve-code-pane] .cm-editor {
  opacity: .62;
}
#${DOCK_ID} [data-sve-code-lock-banner] {
  display: none;
  flex: 0 0 auto;
  padding: 6px 12px;
  font-size: 11px;
  line-height: 1.4;
  color: #fbbf24;
  background: rgba(251,191,36,.08);
  border-bottom: 1px solid rgba(251,191,36,.18);
}
#${DOCK_ID}[data-sve-code-locked] [data-sve-code-lock-banner] {
  display: block;
}
#${UNLOCK_ID} {
  position: fixed;
  inset: 0;
  z-index: 80;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,.5);
}
#${UNLOCK_ID} [data-sve-unlock-card] {
  width: min(420px, calc(100vw - 32px));
  padding: 20px;
  border-radius: 12px;
  background: #252526;
  color: #d4d4d4;
  border: 1px solid rgba(255,255,255,.12);
  box-shadow: 0 16px 40px rgba(0,0,0,.45);
  font-family: ui-sans-serif, system-ui, sans-serif;
}
#${UNLOCK_ID} [data-sve-unlock-title] {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 8px;
}
#${UNLOCK_ID} [data-sve-unlock-body] {
  font-size: 13px;
  line-height: 1.45;
  opacity: .75;
  margin-bottom: 18px;
}
#${UNLOCK_ID} [data-sve-unlock-actions] {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
#${UNLOCK_ID} [data-sve-unlock-actions] button {
  all: unset;
  cursor: pointer;
  padding: 7px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
}
#${UNLOCK_ID} [data-sve-unlock-cancel] {
  background: rgba(255,255,255,.1);
  color: #d4d4d4;
}
#${UNLOCK_ID} [data-sve-unlock-confirm] {
  background: #b45309;
  color: #fff;
}
#${DOCK_ID} [data-sve-code-grip] {
  position: absolute;
  left: 0;
  right: 0;
  top: -8px;
  z-index: 3;
  height: 16px;
  cursor: ns-resize;
  ${splitterFill('ns')}
  background-color: var(--theme-color-gray-800, #27272a);
}
#${DOCK_ID} [data-sve-code-panes] {
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
}
#${DOCK_ID} [data-sve-code-pane] {
  flex: 1 1 0;
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  position: relative;
}
#${DOCK_ID} [data-sve-code-pane-label] {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 8px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: .08em;
  text-transform: uppercase;
  border-bottom: 1px solid rgba(255,255,255,.06);
  user-select: none;
  pointer-events: none;
  position: relative;
  z-index: 2;
  overflow: visible;
}
#${DOCK_ID} [data-sve-code-pane-label] > span {
  opacity: .38;
}
#${DOCK_ID} [data-sve-css-tools],
#${DOCK_ID} [data-sve-html-tools] {
  pointer-events: auto;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 1px;
}
#${DOCK_ID} [data-sve-css-flex-extras] {
  display: none;
  align-items: center;
  flex-wrap: wrap;
  gap: 1px;
}
#${DOCK_ID} [data-sve-css-tools][data-sve-css-flex-on] [data-sve-css-flex-extras] {
  display: flex;
}
#${DOCK_ID} [data-sve-css-sep] {
  width: 1px;
  height: 12px;
  margin: 0 4px;
  background: rgba(255,255,255,.16);
  flex: 0 0 auto;
}
#${DOCK_ID} [data-sve-css-tool],
#${DOCK_ID} [data-sve-html-tool] {
  all: unset;
  cursor: pointer;
  position: relative;
  width: 22px;
  height: 22px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  color: #d4d4d4;
  opacity: .7;
}
#${DOCK_ID} [data-sve-css-tool]:hover,
#${DOCK_ID} [data-sve-css-tool][data-open],
#${DOCK_ID} [data-sve-css-tool][data-active],
#${DOCK_ID} [data-sve-html-tool]:hover,
#${DOCK_ID} [data-sve-html-tool][data-open],
#${DOCK_ID} [data-sve-html-tool][data-active] {
  background: rgba(255,255,255,.12);
  opacity: 1;
}
#${DOCK_ID} [data-sve-css-tool]::after,
#${DOCK_ID} [data-sve-html-tool]::after {
  content: attr(data-tip);
  position: absolute;
  left: 50%;
  top: calc(100% + 6px);
  transform: translateX(-50%);
  padding: 3px 7px;
  border-radius: 4px;
  background: #1f1f1f;
  color: #d4d4d4;
  border: 1px solid rgba(255,255,255,.14);
  box-shadow: 0 4px 12px rgba(0,0,0,.35);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0;
  line-height: 1.3;
  text-transform: none;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  z-index: 8;
}
#${DOCK_ID} [data-sve-css-tool]:hover::after,
#${DOCK_ID} [data-sve-html-tool]:hover::after {
  opacity: 1;
}
#${DOCK_ID} [data-sve-css-tool][data-open]::after,
#${DOCK_ID} [data-sve-html-tool][data-open]::after {
  display: none;
}
#${DOCK_ID} [data-sve-html-tool][data-letter] {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0;
  text-transform: none;
  font-family: ui-sans-serif, system-ui, sans-serif;
}
#${CSS_MENU_ID} {
  position: fixed;
  z-index: 60;
  min-width: 168px;
  max-width: 240px;
  max-height: 240px;
  overflow: auto;
  padding: 8px;
  border-radius: 8px;
  background: #252526;
  color: #d4d4d4;
  border: 1px solid rgba(255,255,255,.12);
  box-shadow: 0 8px 24px rgba(0,0,0,.4);
  font-family: ui-sans-serif, system-ui, sans-serif;
}
#${CSS_MENU_ID} [data-sve-css-swatches] {
  display: grid;
  grid-template-columns: repeat(8, 16px);
  gap: 4px;
}
#${CSS_MENU_ID} [data-sve-css-swatch] {
  all: unset;
  cursor: pointer;
  width: 16px;
  height: 16px;
  border-radius: 3px;
  box-sizing: border-box;
  border: 1px solid rgba(255,255,255,.2);
}
#${CSS_MENU_ID} [data-sve-css-swatch]:hover,
#${CSS_MENU_ID} [data-sve-css-clear]:hover {
  outline: 1px solid #fff;
  outline-offset: 1px;
}
#${CSS_MENU_ID} [data-sve-css-clear] {
  all: unset;
  cursor: pointer;
  width: 16px;
  height: 16px;
  border-radius: 3px;
  box-sizing: border-box;
  border: 1px solid rgba(255,255,255,.35);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #d4d4d4;
  background: repeating-conic-gradient(#3f3f3f 0% 25%, #2a2a2a 0% 50%) 50% / 8px 8px;
}
#${CSS_MENU_ID} [data-sve-css-choice] {
  all: unset;
  cursor: pointer;
  display: block;
  width: 100%;
  box-sizing: border-box;
  padding: 5px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
}
#${CSS_MENU_ID} [data-sve-css-choice]:hover,
#${CSS_MENU_ID} [data-sve-css-swatch][data-active],
#${CSS_MENU_ID} [data-sve-css-choice][data-active] {
  outline: 1px solid #fff;
  outline-offset: 1px;
  background: rgba(255,255,255,.1);
}
#${DOCK_ID} [data-sve-code-split] {
  flex: 0 0 16px;
  cursor: col-resize;
  ${splitterFill('ew')}
  background-color: var(--theme-color-gray-800, #27272a);
  position: relative;
  z-index: 1;
}
#${DOCK_ID} [data-sve-code-split]:hover,
#${DOCK_ID} [data-sve-code-split][data-active],
#${DOCK_ID} [data-sve-code-grip]:hover {
  filter: brightness(1.15);
}
#${DOCK_ID} [data-sve-code-pane] .cm-editor {
  flex: 1 1 auto;
  height: 100%;
  min-height: 0;
}
#${DOCK_ID} [data-sve-code-pane] .cm-scroller {
  overflow: auto;
  min-height: 0;
  height: 100%;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}
#${DOCK_ID} [data-sve-code-host] {
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
  flex-direction: column;
}
`;
}

function editorRight(doc) {
  const editor = doc.querySelector('.live-preview-editor');

  if (!editor) {
    return 0;
  }

  const r = editor.getBoundingClientRect();

  if (r.width < 40 || r.right < 40) {
    return 0;
  }

  return Math.round(r.right);
}

function rightInset(doc) {
  let right = 0;

  for (const id of [
    '__sve-section-picker',
    '__sve-outline-panel',
    '__sve-listview-panel',
    '__sve-right-dock',
    '__sve-chrome-designs',
    '__sve-global-section-panel',
    '__sve-ai-panel',
  ]) {
    const el = doc.getElementById(id);

    if (!el || el.hasAttribute('data-sve-chrome-hidden') || el.hasAttribute('data-sve-right-closed') || el.style.display === 'none') {
      continue;
    }

    const r = el.getBoundingClientRect();

    if (r.width > 40 && r.right > doc.documentElement.clientWidth - 8) {
      right = Math.max(right, Math.round(r.width));
    }
  }

  return right;
}

/**
 * Follow the left editor and right dock as they resize. The code dock is
 * `position:fixed` with `left`/`right` measured from those two; without this
 * it stays put until the CP's debounced DOM pass (~500ms) runs.
 */
function observeDockLayout(win) {
  const doc = win.document;

  layoutWin = win;

  if (typeof win.ResizeObserver !== 'function') {
    return;
  }

  if (!layoutObserver) {
    layoutObserver = new win.ResizeObserver(() => {
      if (layoutWin) {
        relayoutCodeDock(layoutWin);
      }
    });
  }

  const editor = doc.querySelector('.live-preview-editor');
  const right = doc.getElementById('__sve-right-dock');

  if (editor !== observedEditor) {
    if (observedEditor) {
      layoutObserver.unobserve(observedEditor);
    }

    observedEditor = editor;

    if (editor) {
      layoutObserver.observe(editor);
    }
  }

  if (right !== observedRight) {
    if (observedRight) {
      layoutObserver.unobserve(observedRight);
    }

    observedRight = right;

    if (right) {
      layoutObserver.observe(right);
    }
  }
}

function stopObservingDockLayout() {
  layoutObserver?.disconnect();
  layoutObserver = null;
  layoutWin = null;
  observedEditor = null;
  observedRight = null;
}

function bindLayoutWatch(win) {
  if (layoutWatchBound) {
    return;
  }

  layoutWatchBound = true;
  win.addEventListener('sve-right-dock-change', () => observeDockLayout(win));
}

function previewBottomPad(doc, px) {
  const el = doc.querySelector('.live-preview-contents');

  if (el) {
    el.style.paddingBottom = px ? `${px}px` : '';
  }
}

function measureEditors() {
  for (const handle of HANDLES) {
    editors[handle]?.requestMeasure();
  }
}

function panesOf(win, dock) {
  const stored = storedPanes(win);
  const out = {};

  for (const handle of HANDLES) {
    const btn = dock.querySelector(`[data-sve-code-pane-btn="${handle}"]`);

    out[handle] = btn ? btn.getAttribute('aria-pressed') === 'true' : stored[handle];
  }

  return out;
}

function paintPaneButtons(dock, panes) {
  for (const handle of HANDLES) {
    const btn = dock.querySelector(`[data-sve-code-pane-btn="${handle}"]`);
    const pane = dock.querySelector(`[data-sve-code-pane="${handle}"]`);

    if (btn) {
      btn.setAttribute('aria-pressed', panes[handle] ? 'true' : 'false');
    }

    if (pane) {
      pane.style.display = panes[handle] ? 'flex' : 'none';
    }
  }

  const visible = HANDLES.filter((handle) => panes[handle]);

  dock.querySelectorAll('[data-sve-code-split]').forEach((split) => {
    const after = split.getAttribute('data-sve-code-split-after');
    const i = visible.indexOf(after);

    split.style.display = i >= 0 && i < visible.length - 1 ? 'block' : 'none';
  });

  applyPaneWidths(dock.ownerDocument.defaultView, dock);
}

function applyPaneWidths(win, dock) {
  const widths = storedWidths(win);

  for (const handle of HANDLES) {
    const pane = dock.querySelector(`[data-sve-code-pane="${handle}"]`);

    if (pane) {
      pane.style.flex = `${widths[handle]} 1 0`;
    }
  }
}

function placeDock(win, dock) {
  if (dragging) {
    return;
  }

  const doc = win.document;
  attachDock(doc, dock);
  const height = storedHeight(win);
  const left = editorRight(doc);
  const right = rightInset(doc);

  dock.style.left = `${left}px`;
  dock.style.right = `${right}px`;
  dock.style.bottom = '0';
  dock.style.height = `${height}px`;
  previewBottomPad(doc, height);
}

/**
 * Keep pointer events on this window for the whole drag. Live Preview's
 * iframe otherwise swallows mousemove/mouseup the moment the cursor
 * crosses into it — the dock freezes, then jumps when events come back.
 */
function beginOverlayDrag(win, cursor, onMove, onEnd) {
  const doc = win.document;
  const frames = [...doc.querySelectorAll('iframe')];

  frames.forEach((frame) => {
    frame.style.pointerEvents = 'none';
  });

  const shield = doc.createElement('div');
  shield.setAttribute('data-sve-code-drag-shield', '');
  shield.style.cssText =
    `position:fixed;inset:0;z-index:2147483646;cursor:${cursor};user-select:none;`;
  doc.body.appendChild(shield);

  dragging = true;

  let done = false;

  const move = (event) => {
    onMove(event);
  };

  const up = () => {
    if (done) {
      return;
    }

    done = true;
    dragging = false;
    doc.removeEventListener('mousemove', move);
    doc.removeEventListener('mouseup', up);
    win.removeEventListener('blur', up);
    frames.forEach((frame) => {
      frame.style.pointerEvents = '';
    });
    shield.remove();
    onEnd?.();
  };

  doc.addEventListener('mousemove', move);
  doc.addEventListener('mouseup', up);
  win.addEventListener('blur', up);
}

function bindResize(win, dock) {
  if (dock._sveResizeBound) {
    return;
  }

  dock._sveResizeBound = true;

  const startResize = (event) => {
    if (event.button !== 0 || event.target.closest('[data-sve-code-pane-btn], [data-sve-code-lock], .cm-editor')) {
      return;
    }

    event.preventDefault();

    const startY = event.clientY;
    const startH = dock.getBoundingClientRect().height;
    let next = startH;

    beginOverlayDrag(
      win,
      'ns-resize',
      (e) => {
        next = Math.min(
          Math.max(MIN_HEIGHT, startH + (startY - e.clientY)),
          Math.round(win.innerHeight * 0.7)
        );
        dock.style.height = `${next}px`;
        previewBottomPad(win.document, next);
        measureEditors();
      },
      () => {
        storeHeight(win, next);
        placeDock(win, dock);
        win.dispatchEvent(new Event('resize'));
      }
    );
  };

  dock.querySelector('[data-sve-code-bar]')?.addEventListener('mousedown', startResize);
  dock.querySelector('[data-sve-code-grip]')?.addEventListener('mousedown', startResize);
}

function bindSplitters(win, dock) {
  if (dock._sveSplitBound) {
    return;
  }

  dock._sveSplitBound = true;

  dock.querySelectorAll('[data-sve-code-split]').forEach((split) => {
    split.addEventListener('mousedown', (event) => {
      if (event.button !== 0) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      const after = split.getAttribute('data-sve-code-split-after');
      const visible = HANDLES.filter((handle) => panesOf(win, dock)[handle]);
      const i = visible.indexOf(after);
      const leftHandle = visible[i];
      const rightHandle = visible[i + 1];

      if (!leftHandle || !rightHandle) {
        return;
      }

      const leftEl = dock.querySelector(`[data-sve-code-pane="${leftHandle}"]`);
      const rightEl = dock.querySelector(`[data-sve-code-pane="${rightHandle}"]`);
      const startX = event.clientX;
      const leftW = leftEl.getBoundingClientRect().width;
      const rightW = rightEl.getBoundingClientRect().width;
      const total = leftW + rightW;

      split.setAttribute('data-active', '');

      beginOverlayDrag(
        win,
        'col-resize',
        (e) => {
          const dx = e.clientX - startX;
          let nextL = Math.max(MIN_PANE, Math.min(total - MIN_PANE, leftW + dx));
          let nextR = total - nextL;

          if (total < MIN_PANE * 2) {
            nextL = leftW;
            nextR = rightW;
          }

          const widths = storedWidths(win);

          widths[leftHandle] = nextL;
          widths[rightHandle] = nextR;
          storeWidths(win, widths);
          applyPaneWidths(win, dock);
          measureEditors();
        },
        () => {
          split.removeAttribute('data-active');
        }
      );
    });
  });
}

function bindPaneToggles(win, dock) {
  if (dock._svePaneBound) {
    return;
  }

  dock._svePaneBound = true;

  dock.querySelectorAll('[data-sve-code-pane-btn]').forEach((btn) => {
    btn.addEventListener('click', (event) => {
      event.stopPropagation();

      const handle = btn.getAttribute('data-sve-code-pane-btn');
      const panes = panesOf(win, dock);
      const next = { ...panes, [handle]: !panes[handle] };

      if (!next.html && !next.css && !next.js) {
        next[handle] = true;
      }

      storePanes(win, next);
      paintPaneButtons(dock, next);
    });
  });
}

function setStatus(doc, text) {
  const el = doc.getElementById(DOCK_ID)?.querySelector('[data-sve-code-status]');

  if (el) {
    el.textContent = text || '';
  }
}

function setPath(doc, path) {
  const el = doc.getElementById(DOCK_ID)?.querySelector('[data-sve-code-path]');

  if (el) {
    el.textContent = path || '';
    el.title = path || '';
  }
}

function paintLock(win) {
  const dock = win.document.getElementById(DOCK_ID);
  const btn = dock?.querySelector('[data-sve-code-lock]');
  const banner = dock?.querySelector('[data-sve-code-lock-banner]');

  if (!dock || !btn) {
    return;
  }

  const locked = lastLocked && lockReady;

  dock.toggleAttribute('data-sve-code-locked', locked);
  btn.hidden = !lockReady;
  btn.setAttribute('aria-pressed', lastLocked ? 'true' : 'false');
  btn.title = t(win, lastLocked ? 'code_dock_unlock' : 'code_dock_lock');
  btn.setAttribute('aria-label', btn.title);
  btn.innerHTML = lastLocked ? LOCK_CLOSED_ICON : LOCK_OPEN_ICON;

  if (banner) {
    banner.textContent = t(win, 'code_dock_locked_banner');
  }
}

function bindLock(win, dock) {
  if (dock._sveLockBound) {
    return;
  }

  dock._sveLockBound = true;

  dock.querySelector('[data-sve-code-lock]')?.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!lockReady || !lastType) {
      return;
    }

    if (lastLocked) {
      confirmUnlock(win);

      return;
    }

    setTemplateLock(win, true);
  });
}

function confirmUnlock(win) {
  win.document.getElementById(UNLOCK_ID)?.remove();

  const overlay = openCpOverlay(win.document, ChoiceDialog, {
    title: t(win, 'code_dock_unlock_title'),
    body: t(win, 'code_dock_unlock_body'),
    buttons: [
      { value: 'cancel', label: t(win, 'cancel'), variant: 'ghost' },
      { value: 'ok', label: t(win, 'code_dock_unlock_confirm'), variant: 'primary' },
    ],
    onPick: (value) => {
      overlay.dismiss();

      if (value === 'ok') {
        setTemplateLock(win, false);
      }
    },
  });

  overlay.host.id = UNLOCK_ID;
}

function setTemplateLock(win, locked) {
  const type = lastType;

  if (!type) {
    return;
  }

  const go = () => {
    if (lastType !== type) {
      return;
    }

    win
      .fetch('/!/sve/section-template/lock', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken(win),
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({ type, locked }),
      })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(String(res.status));
        }

        if (lastType !== type) {
          return;
        }

        lastLocked = locked;
        writeParts(lastParts, locked);
        paintLock(win);
        setStatus(win.document, locked ? t(win, 'code_dock_locked') : '');
      })
      .catch(() => {
        setStatus(win.document, t(win, 'code_dock_error'));
      });
  };

  if (locked) {
    flushSave(win.document);

    if (saveInFlight) {
      saveInFlight.finally(go);

      return;
    }
  }

  go();
}

function readParts() {
  const parts = { html: '', css: '', js: '' };

  for (const handle of HANDLES) {
    parts[handle] = editors[handle]?.state.doc.toString() ?? '';
  }

  return parts;
}

function writeParts(parts, disabled) {
  applying = true;

  try {
    for (const handle of HANDLES) {
      const view = editors[handle];
      const text = parts[handle] ?? '';

      if (!view) {
        continue;
      }

      const current = view.state.doc.toString();

      if (current !== text) {
        view.dispatch({
          changes: { from: 0, to: current.length, insert: text },
        });
      }

      view.dispatch({
        effects: [
          readOnlyOf[handle].reconfigure(EditorState.readOnly.of(!!disabled)),
          editableOf[handle].reconfigure(EditorView.editable.of(!disabled)),
        ],
      });
    }
  } finally {
    applying = false;
  }

  if (lastWin) {
    paintCssToolState(lastWin);
    paintHtmlToolState(lastWin);
  }
}

function sameParts(a, b) {
  return a.html === b.html && a.css === b.css && a.js === b.js;
}

function cssDeclaration(text) {
  return String(text || '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .trim()
    .replace(/\s*:\s*/g, ': ')
    .replace(/\s*;\s*/g, ';')
    .replace(/\s+/g, ' ')
    .replace(/;+$/, ';');
}

function cssLinesMatch(a, b) {
  const left = cssDeclaration(a).replace(/;$/, '');
  const right = cssDeclaration(b).replace(/;$/, '');

  return left !== '' && left === right;
}

function cssVarToken(text) {
  const match = cssDeclaration(text).match(/:\s*var\(\s*([^)]+?)\s*\)\s*;?$/i);

  return match ? match[1].trim() : '';
}

function cssPropertyOf(text) {
  const match = cssDeclaration(text).match(/^([a-z-]+)\s*:/i);

  return match ? match[1].toLowerCase() : '';
}

function cssValueOf(text) {
  const decl = cssDeclaration(text);
  const idx = decl.indexOf(':');

  return idx === -1 ? '' : decl.slice(idx + 1).replace(/;$/, '').trim().toLowerCase();
}

function normalizeFlexValue(value) {
  const v = String(value || '').trim().toLowerCase();

  if (v === 'start' || v === 'flex-start' || v === 'left' || v === 'top') {
    return 'flex-start';
  }

  if (v === 'end' || v === 'flex-end' || v === 'right' || v === 'bottom') {
    return 'flex-end';
  }

  if (v === 'row-reverse') {
    return 'row-reverse';
  }

  if (v === 'column-reverse') {
    return 'column-reverse';
  }

  return v;
}

function isFlexDisplay(value) {
  const v = normalizeFlexValue(value);

  return v === 'flex' || v === 'inline-flex';
}

function cssRuleAtCursor() {
  const view = editors.css;

  if (!view) {
    return null;
  }

  const pos = view.state.selection.main.head;
  const text = view.state.doc.toString();
  const blocks = [];
  let depth = 0;
  let start = -1;

  for (let i = 0; i < text.length; i += 1) {
    if (text[i] === '{' && text[i + 1] === '{') {
      const end = text.indexOf('}}', i + 2);

      if (end === -1) {
        break;
      }

      i = end + 1;
      continue;
    }

    if (text[i] === '{') {
      if (depth === 0) {
        start = i;
      }

      depth += 1;
    } else if (text[i] === '}') {
      depth -= 1;

      if (depth === 0 && start !== -1) {
        blocks.push({ from: start + 1, to: i, text: text.slice(start + 1, i), open: start });
        start = -1;
      }
    }
  }

  for (const block of blocks) {
    if (pos >= block.open && pos <= block.to) {
      return block;
    }
  }

  return null;
}

function parseCssDecls(block) {
  const out = {};

  for (const part of String(block || '').split(';')) {
    const prop = cssPropertyOf(part);

    if (prop) {
      out[prop] = cssValueOf(`${part};`);
    }
  }

  return out;
}

function findDeclInRule(view, rule, property) {
  if (!rule || rule.from >= rule.to) {
    return null;
  }

  let line = view.state.doc.lineAt(rule.from);

  while (line.from <= rule.to) {
    const from = Math.max(line.from, rule.from);
    const to = Math.min(line.to, rule.to);
    const text = view.state.doc.sliceString(from, to);

    if (cssPropertyOf(text) === property) {
      return { from, to, text };
    }

    if (line.to >= view.state.doc.length || line.to >= rule.to) {
      break;
    }

    line = view.state.doc.lineAt(line.to + 1);
  }

  return null;
}

function lineIndentOf(text) {
  return (String(text).match(/^\s*/) || [''])[0];
}

function indentFromPrevious(view, line, forCss) {
  for (let n = line.number - 1; n >= 1; n -= 1) {
    const prev = view.state.doc.line(n);
    const trimmed = prev.text.trim();

    if (!trimmed) {
      continue;
    }

    const indent = lineIndentOf(prev.text);

    if (forCss && (trimmed === '{' || trimmed.endsWith('{'))) {
      return `${indent}  `;
    }

    if (trimmed === '}' || trimmed.startsWith('}')) {
      continue;
    }

    return indent;
  }

  return '';
}

function cssIndentAt(view, pos) {
  const line = view.state.doc.lineAt(pos);

  if (line.text.trim()) {
    return lineIndentOf(line.text);
  }

  const fromPrev = indentFromPrevious(view, line, true);

  if (fromPrev) {
    return fromPrev;
  }

  const rule = cssRuleAtCursor();

  if (rule) {
    return inferRuleIndent(view, rule);
  }

  return '  ';
}

function inferRuleIndent(view, rule) {
  const startLine = view.state.doc.lineAt(rule.from);
  const endLine = view.state.doc.lineAt(Math.max(rule.from, rule.to));

  for (let n = endLine.number; n >= startLine.number; n -= 1) {
    const line = view.state.doc.line(n);
    const sliceFrom = Math.max(line.from, rule.from);
    const sliceTo = Math.min(line.to, rule.to);
    const text = view.state.doc.sliceString(sliceFrom, sliceTo);

    if (text.trim()) {
      return (text.match(/^\s*/) || [''])[0] || '  ';
    }
  }

  const open = view.state.doc.lineAt(Math.max(0, rule.from - 1));

  return `${(open.text.match(/^\s*/) || [''])[0]}  `;
}

function finishCssEdit() {
  editors.css?.focus();

  if (lastWin) {
    onEditorInput(lastWin);
    paintCssToolState(lastWin);
  }
}

function applyRuleDecls(updates) {
  const view = editors.css;

  if (!view || view.state.readOnly || !updates.length) {
    return;
  }

  const rule = cssRuleAtCursor();

  if (!rule) {
    const snippet = updates
      .filter((item) => item.value != null)
      .map((item) => `${item.property}: ${item.value};`)
      .join('\n');

    if (snippet) {
      insertCssAtCursor(snippet);
    }

    finishCssEdit();

    return;
  }

  const changes = [];
  const inserts = [];
  const indent = inferRuleIndent(view, rule);

  for (const update of updates) {
    const found = findDeclInRule(view, rule, update.property);

    if (update.value == null) {
      if (!found) {
        continue;
      }

      let from = found.from;
      let to = found.to;
      const after = view.state.doc.sliceString(to, to + 1);

      if (after === '\n') {
        to += 1;
      }

      from = Math.max(from, rule.from);
      to = Math.min(to, rule.to);
      changes.push({ from, to });
      continue;
    }

    if (found && normalizeFlexValue(cssValueOf(found.text)) === normalizeFlexValue(update.value)) {
      continue;
    }

    if (found) {
      const foundIndent = (found.text.match(/^\s*/) || [''])[0];

      changes.push({ from: found.from, to: found.to, insert: `${foundIndent}${update.property}: ${update.value};` });
    } else {
      inserts.push(`${indent}${update.property}: ${update.value};`);
    }
  }

  if (inserts.length) {
    const prefix = !rule.text.includes('\n') || !/\n\s*$/.test(rule.text) ? '\n' : '';

    changes.push({ from: rule.to, to: rule.to, insert: `${prefix}${inserts.join('\n')}\n` });
  }

  if (changes.length) {
    changes.sort((a, b) => b.from - a.from || b.to - a.to);
    view.dispatch({ changes });
  }

  finishCssEdit();
}

function currentFlexDecls() {
  const rule = cssRuleAtCursor();

  return rule ? parseCssDecls(rule.text) : {};
}

function applyFlexDirection(direction) {
  const decls = currentFlexDecls();
  const flexOn = isFlexDisplay(decls.display);
  const currentDir = normalizeFlexValue(decls['flex-direction']) || (flexOn ? 'row' : '');

  if (flexOn && currentDir === direction) {
    const updates = [];

    if (decls['flex-direction']) {
      updates.push({ property: 'flex-direction', value: null });
    }

    if (isFlexDisplay(decls.display)) {
      updates.push({ property: 'display', value: null });
    }

    applyRuleDecls(updates);

    return;
  }

  applyRuleDecls([
    { property: 'display', value: 'flex' },
    { property: 'flex-direction', value: direction },
  ]);
}

function applyFlexValue(property, value) {
  const decls = currentFlexDecls();

  if (normalizeFlexValue(decls[property]) === normalizeFlexValue(value)) {
    applyRuleDecls([{ property, value: null }]);

    return;
  }

  applyRuleDecls([{ property, value }]);
}

function currentCssLine() {
  const view = editors.css;

  if (!view) {
    return null;
  }

  return view.state.doc.lineAt(view.state.selection.main.head);
}

function removeCssLine(view, line) {
  let from = line.from;
  let to = line.to;

  if (to < view.state.doc.length) {
    to += 1;
  } else if (from > 0) {
    from -= 1;
  }

  view.dispatch({
    changes: { from, to },
    selection: { anchor: Math.min(from, view.state.doc.length) },
  });
}

function replaceCssLine(view, line, text) {
  const indent = (line.text.match(/^\s*/) || [''])[0];
  const next = `${indent}${text.replace(/;?$/, ';')}`;

  view.dispatch({
    changes: { from: line.from, to: line.to, insert: next },
    selection: { anchor: line.from + next.length },
  });
}

function clearCssProperty(property) {
  const view = editors.css;

  if (!view || view.state.readOnly) {
    return;
  }

  const line = currentCssLine();

  if (!line || cssPropertyOf(line.text) !== property) {
    return;
  }

  removeCssLine(view, line);
  view.focus();

  if (lastWin) {
    onEditorInput(lastWin);
    paintCssToolState(lastWin);
  }
}

function applyCssSnippet(text) {
  const view = editors.css;

  if (!view || view.state.readOnly) {
    return;
  }

  const want = cssDeclaration(text).replace(/;?$/, ';');
  const line = currentCssLine();
  const have = line ? line.text : '';

  if (line && cssLinesMatch(have, want)) {
    removeCssLine(view, line);
  } else if (have.trim() && cssPropertyOf(have) === cssPropertyOf(want)) {
    replaceCssLine(view, line, want);
  } else {
    insertCssAtCursor(want);
    view.focus();

    if (lastWin) {
      onEditorInput(lastWin);
      paintCssToolState(lastWin);
    }

    return;
  }

  view.focus();

  if (lastWin) {
    onEditorInput(lastWin);
    paintCssToolState(lastWin);
  }
}

function insertCssAtCursor(text) {
  const view = editors.css;

  if (!view || view.state.readOnly) {
    return;
  }

  const pos = view.state.selection.main.head;
  const line = view.state.doc.lineAt(pos);
  const before = line.text.slice(0, pos - line.from);
  const after = line.text.slice(pos - line.from);
  const indent = cssIndentAt(view, pos);
  const decl = text.replace(/;?$/, ';');

  if (before.trim() === '' && after.trim() === '') {
    const insert = `${indent}${decl}\n${indent}`;

    view.dispatch({
      changes: { from: line.from, to: line.to, insert },
      selection: { anchor: line.from + insert.length },
    });

    return;
  }

  const insert = `\n${indent}${decl}\n${indent}`;

  view.dispatch({
    changes: { from: pos, to: view.state.selection.main.to, insert },
    selection: { anchor: pos + insert.length },
  });
}

function paintCssToolState(win) {
  try {
    paintCssToolStateInner(win);
  } catch {
    /* invalid Antlers-in-CSS must not take down Live Preview */
  }
}

function paintCssToolStateInner(win) {
  const dock = win?.document?.getElementById(DOCK_ID);
  const line = currentCssLine();
  const have = line ? cssDeclaration(line.text) : '';
  const prop = cssPropertyOf(have);
  const decls = currentFlexDecls();
  const flexOn = isFlexDisplay(decls.display);
  const flexDir = normalizeFlexValue(decls['flex-direction']) || (flexOn ? 'row' : '');
  const host = dock?.querySelector('[data-sve-css-tools]');

  if (!dock) {
    return;
  }

  if (host) {
    if (flexOn) {
      host.setAttribute('data-sve-css-flex-on', '');
    } else {
      host.removeAttribute('data-sve-css-flex-on');
    }
  }

  for (const tool of CSS_TOOLS) {
    const btn = dock.querySelector(`[data-sve-css-tool="${tool.id}"]`);

    if (!btn) {
      continue;
    }

    let on = false;

    if (tool.flexDir) {
      on = flexOn && flexDir === tool.flexDir;
    } else if (tool.insert) {
      on = cssLinesMatch(have, tool.insert);
    } else {
      on = prop === tool.property;
    }

    if (on) {
      btn.setAttribute('data-active', '');
    } else {
      btn.removeAttribute('data-active');
    }
  }

  for (const tool of CSS_FLEX_EXTRAS) {
    const btn = dock.querySelector(`[data-sve-css-tool="${tool.id}"]`);

    if (!btn) {
      continue;
    }

    const on = normalizeFlexValue(decls[tool.property]) === normalizeFlexValue(tool.value);

    if (on) {
      btn.setAttribute('data-active', '');
    } else {
      btn.removeAttribute('data-active');
    }
  }
}

function closeCssMenu(doc) {
  const menu = doc?.getElementById(CSS_MENU_ID);

  menu?._sveApp?.unmount();
  menu?.remove();
  doc?.querySelectorAll('[data-sve-css-tool][data-open], [data-sve-html-tool][data-open]').forEach((el) =>
    el.removeAttribute('data-open')
  );
}

/** Close CSS/HTML tool menus and CodeMirror suggestions — they sit above Statamic pickers. */
export function closeCodeDockPopups(doc) {
  closeCssMenu(doc);

  for (const handle of HANDLES) {
    if (editors[handle]) {
      closeCompletion(editors[handle]);
    }
  }
}

function loadThemeColors(win) {
  if (cssColorsPromise) {
    return cssColorsPromise;
  }

  const cpUrl =
    win.Statamic?.$config?.get?.('cpUrl') || `/${win.Statamic?.$config?.get?.('cpRoute') || 'cp'}`;

  cssColorsPromise = win
    .fetch(`${cpUrl}/color-scheme/swatches`, {
      credentials: 'same-origin',
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
    })
    .then(async (res) => {
      if (!res.ok) {
        return [];
      }

      const json = await res.json().catch(() => []);

      return Array.isArray(json) ? json : [];
    })
    .catch(() => [])
    .then((swatches) => {
      const seen = new Set();
      const out = [];

      for (const item of swatches) {
        const raw = item.var || item.value || item.handle;
        const name = String(raw || '')
          .trim()
          .replace(/^var\((.+)\)$/, '$1');

        if (!name || seen.has(name)) {
          continue;
        }

        seen.add(name);
        out.push({ name, hex: item.hex || item.color || '' });
      }

      for (const [name, hex] of CSS_GRAYS) {
        if (seen.has(name)) {
          continue;
        }

        seen.add(name);
        out.push({ name, hex });
      }

      return out;
    });

  return cssColorsPromise;
}

function markCssMenuActive(menu, property) {
  const line = currentCssLine();
  const have = line ? line.text : '';
  const token = cssPropertyOf(have) === property ? cssVarToken(have) : '';

  for (const btn of menu.querySelectorAll('[data-sve-css-token]')) {
    if (token && btn.getAttribute('data-sve-css-token') === token) {
      btn.setAttribute('data-active', '');
    } else {
      btn.removeAttribute('data-active');
    }
  }
}

function placeCssMenu(win, anchor, menu) {
  const rect = anchor.getBoundingClientRect();
  const pad = 8;

  menu.style.left = `${Math.max(pad, Math.min(rect.left, win.innerWidth - 220))}px`;
  menu.style.top = `${Math.max(pad, rect.bottom + 4)}px`;
}

function openCssColorMenu(win, anchor, property) {
  const doc = win.document;

  closeCssMenu(doc);
  anchor.setAttribute('data-open', '');

  const menu = doc.createElement('div');

  menu.id = CSS_MENU_ID;
  doc.body.appendChild(menu);
  placeCssMenu(win, anchor, menu);

  const paint = (swatches) => {
    menu._sveApp?.unmount();
    menu._sveApp = mountSurface(CodeDockMenu, menu, {
      kind: 'colors',
      swatches,
      onClear: () => {
        clearCssProperty(property);
        closeCssMenu(doc);
      },
      onPick: (name) => {
        applyCssSnippet(`${property}: var(${name});`);
        closeCssMenu(doc);
      },
    });
    markCssMenuActive(menu, property);
  };

  paint(CSS_GRAYS.map(([name, hex]) => ({ name, hex })));

  loadThemeColors(win).then((colors) => {
    if (!doc.getElementById(CSS_MENU_ID)) {
      return;
    }

    paint(colors.map((color) => ({ name: color.name, hex: color.hex })));
  });
}

function openCssSpacingMenu(win, anchor, property) {
  const doc = win.document;

  closeCssMenu(doc);
  anchor.setAttribute('data-open', '');

  const menu = doc.createElement('div');

  menu.id = CSS_MENU_ID;
  doc.body.appendChild(menu);
  placeCssMenu(win, anchor, menu);
  menu._sveApp = mountSurface(CodeDockMenu, menu, {
    kind: 'choices',
    choices: CSS_SPACING.map((token) => ({ value: token, token, label: token })),
    onPick: (token) => {
      applyCssSnippet(`${property}: var(${token});`);
      closeCssMenu(doc);
    },
  });
  markCssMenuActive(menu, property);
}

function skipHtmlNoise(text, i) {
  if (text.startsWith('{{', i)) {
    const end = text.indexOf('}}', i + 2);

    return end === -1 ? text.length : end + 2;
  }

  if (text.startsWith('<!--', i)) {
    const end = text.indexOf('-->', i + 4);

    return end === -1 ? text.length : end + 3;
  }

  return i;
}

function readHtmlTag(text, i) {
  if (text[i] !== '<') {
    return null;
  }

  const close = text.indexOf('>', i + 1);

  if (close === -1) {
    return null;
  }

  const chunk = text.slice(i, close + 1);
  const closing = chunk.match(/^<\/([A-Za-z][A-Za-z0-9:-]*)\s*>/);

  if (closing) {
    return { kind: 'close', name: closing[1].toLowerCase(), from: i, to: close + 1 };
  }

  const opening = chunk.match(/^<([A-Za-z][A-Za-z0-9:-]*)/);

  if (!opening) {
    return { kind: 'other', from: i, to: close + 1 };
  }

  const name = opening[1].toLowerCase();
  const self =
    /\/\s*>$/.test(chunk) ||
    ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'].includes(
      name
    );

  return { kind: self ? 'void' : 'open', name, from: i, to: close + 1 };
}

function findHtmlClose(text, name, from) {
  let depth = 1;
  let i = from;

  while (i < text.length) {
    const next = skipHtmlNoise(text, i);

    if (next !== i) {
      i = next;
      continue;
    }

    if (text[i] !== '<') {
      i += 1;
      continue;
    }

    const tag = readHtmlTag(text, i);

    if (!tag) {
      break;
    }

    if (tag.kind === 'open' && tag.name === name) {
      depth += 1;
    } else if (tag.kind === 'close' && tag.name === name) {
      depth -= 1;

      if (depth === 0) {
        return tag;
      }
    }

    i = tag.to;
  }

  return null;
}

function htmlElementAtCursor() {
  const view = editors.html;

  if (!view) {
    return null;
  }

  const pos = view.state.selection.main.head;
  const text = view.state.doc.toString();
  const stack = [];
  let i = 0;

  while (i < pos) {
    const next = skipHtmlNoise(text, i);

    if (next !== i) {
      i = next;
      continue;
    }

    if (text[i] !== '<') {
      i += 1;
      continue;
    }

    const tag = readHtmlTag(text, i);

    if (!tag || tag.from >= pos) {
      break;
    }

    if (tag.kind === 'open') {
      stack.push(tag);
    } else if (tag.kind === 'close') {
      for (let s = stack.length - 1; s >= 0; s -= 1) {
        if (stack[s].name === tag.name) {
          stack.splice(s);
          break;
        }
      }
    }

    i = tag.to;
  }

  const lastLt = text.lastIndexOf('<', Math.max(0, pos - 1));

  if (lastLt !== -1 && text.indexOf('>', lastLt) >= pos) {
    const tag = readHtmlTag(text, lastLt);

    if (tag?.kind === 'open') {
      const close = findHtmlClose(text, tag.name, tag.to);

      return close ? { name: tag.name, open: tag, close } : { name: tag.name, open: tag, close: null };
    }
  }

  const open = stack[stack.length - 1];

  if (!open) {
    return null;
  }

  const close = findHtmlClose(text, open.name, open.to);

  return { name: open.name, open, close };
}

function isHeadingTag(name) {
  return HTML_HEADINGS.includes(name);
}

function finishHtmlEdit() {
  editors.html?.focus();

  if (lastWin) {
    onEditorInput(lastWin);
    paintHtmlToolState(lastWin);
  }
}

function dispatchHtmlChanges(view, changes, selection) {
  const sorted = [...changes].sort((a, b) => b.from - a.from || b.to - a.to);

  view.dispatch({
    changes: sorted,
    selection,
  });
}

function insertHtmlSnippet(snippet, cursorFromStart) {
  const view = editors.html;

  if (!view || view.state.readOnly) {
    return;
  }

  const pos = view.state.selection.main.head;
  const line = view.state.doc.lineAt(pos);
  const before = line.text.slice(0, pos - line.from);
  const indent = line.text.trim()
    ? lineIndentOf(line.text)
    : indentFromPrevious(view, line) || lineIndentOf(line.text);
  let insert = snippet;
  let extra = 0;

  if (before.trim() !== '') {
    insert = `\n${indent}${snippet}`;
    extra = 1 + indent.length;
  } else if (!line.text.trim()) {
    insert = `${indent}${snippet}`;
    extra = indent.length;
    view.dispatch({
      changes: { from: line.from, to: line.to, insert },
      selection: { anchor: line.from + extra + cursorFromStart },
    });

    return;
  }

  view.dispatch({
    changes: { from: pos, to: view.state.selection.main.to, insert },
    selection: { anchor: pos + extra + cursorFromStart },
  });
}

function applyHtmlTag(tag) {
  const view = editors.html;

  if (!view || view.state.readOnly) {
    return;
  }

  const sel = view.state.selection.main;
  const text = view.state.doc.toString();

  if (!sel.empty) {
    const selected = text.slice(sel.from, sel.to);
    const wrapped = selected.match(new RegExp(`^<${tag}(\\s[^>]*)?>([\\s\\S]*)</${tag}>$`, 'i'));

    if (wrapped) {
      dispatchHtmlChanges(view, [{ from: sel.from, to: sel.to, insert: wrapped[2] }], {
        anchor: sel.from,
        head: sel.from + wrapped[2].length,
      });
      finishHtmlEdit();

      return;
    }

    let insert = `<${tag}>${selected}</${tag}>`;
    let innerFrom = sel.from + tag.length + 2;

    if (tag === 'ul') {
      insert = `<ul>\n  <li>${selected}</li>\n</ul>`;
      innerFrom = sel.from + `<ul>\n  <li>`.length;
    }

    dispatchHtmlChanges(view, [{ from: sel.from, to: sel.to, insert }], {
      anchor: innerFrom,
      head: innerFrom + selected.length,
    });
    finishHtmlEdit();

    return;
  }

  const el = htmlElementAtCursor();

  if (el?.open && el.close) {
    if (el.name === tag) {
      dispatchHtmlChanges(
        view,
        [
          { from: el.close.from, to: el.close.to, insert: '' },
          { from: el.open.from, to: el.open.to, insert: '' },
        ],
        { anchor: el.open.from }
      );
      finishHtmlEdit();

      return;
    }

    if (isHeadingTag(el.name) && isHeadingTag(tag)) {
      const openRaw = text.slice(el.open.from, el.open.to).replace(new RegExp(`^<${el.name}`, 'i'), `<${tag}`);

      dispatchHtmlChanges(
        view,
        [
          { from: el.close.from, to: el.close.to, insert: `</${tag}>` },
          { from: el.open.from, to: el.open.to, insert: openRaw },
        ],
        { anchor: el.open.from + tag.length + 1 }
      );
      finishHtmlEdit();

      return;
    }
  }

  const line = view.state.doc.lineAt(sel.head);
  const indent = (line.text.match(/^\s*/) || [''])[0];

  if (tag === 'ul') {
    const snippet = `<ul>\n${indent}  <li></li>\n${indent}</ul>`;

    insertHtmlSnippet(snippet, `<ul>\n${indent}  <li>`.length);
  } else {
    insertHtmlSnippet(`<${tag}></${tag}>`, tag.length + 2);
  }

  finishHtmlEdit();
}

function paintHtmlToolState(win) {
  try {
    paintHtmlToolStateInner(win);
  } catch {
    /* invalid Antlers-in-HTML must not take down Live Preview */
  }
}

function paintHtmlToolStateInner(win) {
  const dock = win?.document?.getElementById(DOCK_ID);
  const el = htmlElementAtCursor();
  const tag = el?.name || '';

  if (!dock) {
    return;
  }

  for (const tool of HTML_TOOLS) {
    const btn = dock.querySelector(`[data-sve-html-tool="${tool.id}"]`);

    if (!btn) {
      continue;
    }

    const on = tool.id === 'heading' ? isHeadingTag(tag) : tag === tool.tag;

    if (on) {
      btn.setAttribute('data-active', '');
    } else {
      btn.removeAttribute('data-active');
    }
  }
}

function openHtmlHeadingMenu(win, anchor) {
  const doc = win.document;
  const current = htmlElementAtCursor()?.name || '';

  closeCssMenu(doc);
  anchor.setAttribute('data-open', '');

  const menu = doc.createElement('div');

  menu.id = CSS_MENU_ID;
  doc.body.appendChild(menu);
  placeCssMenu(win, anchor, menu);
  menu._sveApp = mountSurface(CodeDockMenu, menu, {
    kind: 'choices',
    choices: HTML_HEADINGS.map((tag) => ({
      value: tag,
      label: tag.toUpperCase(),
      active: current === tag,
    })),
    onPick: (tag) => {
      applyHtmlTag(tag);
      closeCssMenu(doc);
    },
  });
}

function bindCssTools(win, dock) {
  const host = dock.querySelector('[data-sve-css-tools]');

  if (!host || host._sveBound) {
    return;
  }

  host._sveBound = true;

  const allCss = [...CSS_TOOLS, ...CSS_FLEX_EXTRAS];
  const runCssTool = (id, btn) => {
    const tool = allCss.find((item) => item.id === id);

    if (!tool) {
      return;
    }

    if (tool.flexDir) {
      closeCssMenu(win.document);
      applyFlexDirection(tool.flexDir);

      return;
    }

    if (tool.property && tool.value) {
      closeCssMenu(win.document);
      applyFlexValue(tool.property, tool.value);

      return;
    }

    if (tool.insert) {
      closeCssMenu(win.document);
      applyCssSnippet(tool.insert);

      return;
    }

    if (tool.menu === 'colors') {
      openCssColorMenu(win, btn, tool.property);

      return;
    }

    if (tool.menu === 'spacing') {
      openCssSpacingMenu(win, btn, tool.property);
    }
  };

  let alignSep = false;
  const extras = CSS_FLEX_EXTRAS.map((extra) => {
    const row = {
      ...extra,
      icon: CSS_TOOL_ICONS[extra.id] || '',
      sep: extra.group === 'align' && !alignSep,
    };

    if (row.sep) {
      alignSep = true;
    }

    return row;
  });

  mountPane(host, CodeDockCssTools, {
    tools: CSS_TOOLS.map((tool) => ({ ...tool, icon: CSS_TOOL_ICONS[tool.id] || '' })),
    extras,
    onTool: (id) => runCssTool(id, host.querySelector(`[data-sve-css-tool="${id}"]`)),
  });

  win.document.addEventListener(
    'mousedown',
    (event) => {
      if (event.target.closest(`#${CSS_MENU_ID}, [data-sve-css-tools], [data-sve-html-tools]`)) {
        return;
      }

      closeCssMenu(win.document);
    },
    true
  );
}

function bindHtmlTools(win, dock) {
  const host = dock.querySelector('[data-sve-html-tools]');

  if (!host || host._sveBound) {
    return;
  }

  host._sveBound = true;

  mountPane(host, CodeDockHtmlTools, {
    tools: HTML_TOOLS.map((tool) => ({
      ...tool,
      icon: HTML_TOOL_ICONS[tool.id] || '',
    })),
    onTool: (id) => {
      const tool = HTML_TOOLS.find((item) => item.id === id);
      const btn = host.querySelector(`[data-sve-html-tool="${id}"]`);

      if (!tool) {
        return;
      }

      if (tool.menu === 'heading') {
        openHtmlHeadingMenu(win, btn);

        return;
      }

      closeCssMenu(win.document);
      applyHtmlTag(tool.tag);
    },
  });
}

function refreshPreview(win) {
  replayLivePreview(win);
}

function postSave(win, type, parts) {
  saveInFlight = win
    .fetch('/!/sve/section-template', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': csrfToken(win),
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: JSON.stringify({
        type,
        html: parts.html,
        css: parts.css,
        js: parts.js,
        ...(typeof parts.tw === 'string' ? { tw: parts.tw } : {}),
      }),
    })
    .then(async (res) => {
      if (res.status === 423) {
        lastLocked = true;
        lockReady = true;
        writeParts(lastParts, true);
        paintLock(win);
        setStatus(win.document, t(win, 'code_dock_locked'));

        return;
      }

      if (!res.ok) {
        throw new Error(String(res.status));
      }

      if (lastType === type) {
        lastParts = parts;
        setStatus(win.document, t(win, 'code_dock_saved'));
        win.setTimeout(() => {
          const el = win.document.getElementById(DOCK_ID)?.querySelector('[data-sve-code-status]');

          if (el && el.textContent === t(win, 'code_dock_saved')) {
            el.textContent = '';
          }
        }, 1800);
      }

      refreshPreview(win);
      win.document
        .getElementById('__sve-section-picker')
        ?.dispatchEvent(new win.CustomEvent('sve-library-stale'));
    })
    .catch(() => {
      setStatus(win.document, t(win, 'code_dock_error'));
    })
    .finally(() => {
      saveInFlight = null;
    });

  return saveInFlight;
}

function flushSave(doc) {
  if (saveTimer) {
    clearTimeout(saveTimer);
    saveTimer = null;
  }

  const type = lastType;
  const win = lastWin;
  const view = editors.html;

  if (!view || view.state.readOnly || !type || !win) {
    return;
  }

  const parts = readParts();

  if (sameParts(parts, lastParts)) {
    return;
  }

  setStatus(doc, t(win, 'code_dock_saving'));
  postSave(win, type, parts);
}

function scheduleSave(win, doc) {
  if (saveTimer) {
    clearTimeout(saveTimer);
  }

  saveTimer = win.setTimeout(() => {
    saveTimer = null;
    flushSave(doc);
  }, SAVE_MS);
}

function onEditorInput(win) {
  if (applying) {
    return;
  }

  const parts = readParts();

  if (sameParts(parts, lastParts)) {
    return;
  }

  setStatus(win.document, t(win, 'code_dock_saving'));
  scheduleSave(win, win.document);
}

function mountEditor(win, handle, parent) {
  editors[handle]?.destroy();

  const saveKey = keymap.of([
    {
      key: 'Mod-s',
      run: () => {
        flushSave(win.document);

        return true;
      },
    },
  ]);

  editors[handle] = new EditorView({
    state: EditorState.create({
      doc: '',
      extensions: [
        lineNumbers(),
        highlightActiveLine(),
        highlightActiveLineGutter(),
        history(),
        languageOf(handle),
        closeBrackets(),
        autocompletion(),
        keymap.of([
          ...defaultKeymap,
          indentWithTab,
          ...historyKeymap,
          ...completionKeymap,
          ...closeBracketsKeymap,
        ]),
        saveKey,
        EditorView.lineWrapping,
        readOnlyOf[handle].of(EditorState.readOnly.of(false)),
        editableOf[handle].of(EditorView.editable.of(true)),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            onEditorInput(win);
          }

          if (handle === 'css' && (update.docChanged || update.selectionSet)) {
            paintCssToolState(win);
          }

          if (handle === 'html' && (update.docChanged || update.selectionSet)) {
            paintHtmlToolState(win);
          }
        }),
        ...vscTheme(),
      ],
    }),
    parent,
  });
}

function ensureDock(win) {
  const doc = win.document;

  ensureStyle(doc);

  let dock = doc.getElementById(DOCK_ID);

  if (dock) {
    const cssLabel = dock.querySelector('[data-sve-code-pane="css"] [data-sve-code-pane-label]');
    const chromeOk =
      cssLabel?.getAttribute('data-sve-css-chrome') === 'flex-tools-1' &&
      dock.querySelector('[data-sve-html-tools]') &&
      dock.querySelector('[data-sve-code-lock]') &&
      dock.getAttribute('data-sve-code-chrome') === 'lock-1';

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
    dock.setAttribute('data-sve-code-chrome', 'lock-1');
    mountPane(dock, CodeDockChrome, {
      htmlLabel: t(win, 'code_dock_html'),
      cssLabel: t(win, 'code_dock_css'),
      jsLabel: t(win, 'code_dock_js'),
    });
    attachDock(doc, dock);
    shieldDock(dock);
    paintPaneButtons(dock, storedPanes(win));
    bindResize(win, dock);
    bindPaneToggles(win, dock);
    bindSplitters(win, dock);
    bindCssTools(win, dock);
    bindHtmlTools(win, dock);
    bindLock(win, dock);

    for (const handle of HANDLES) {
      const host = dock.querySelector(`[data-sve-code-pane="${handle}"] [data-sve-code-host]`);

      mountEditor(win, handle, host);
    }
  }

  attachDock(doc, dock);
  shieldDock(dock);
  bindLock(win, dock);
  bindLayoutWatch(win);
  observeDockLayout(win);
  paintLock(win);

  return dock;
}

function showMissing(win, type) {
  const dock = ensureDock(win);

  lastType = type;
  lastLocked = true;
  lockReady = false;
  lastParts = { html: '', css: '', js: '' };
  writeParts(lastParts, true);
  setPath(win.document, type);
  setStatus(win.document, t(win, 'code_dock_missing'));
  paintLock(win);
  placeDock(win, dock);
}

function loadTemplate(win, type) {
  const gen = ++loadGen;
  const dock = ensureDock(win);

  lastType = type;
  lastLocked = true;
  lockReady = false;
  writeParts({ html: '', css: '', js: '' }, true);
  setPath(win.document, type);
  setStatus(win.document, t(win, 'code_dock_loading'));
  paintLock(win);
  placeDock(win, dock);

  win
    .fetch(`/!/sve/section-template?type=${encodeURIComponent(type)}`, {
      credentials: 'same-origin',
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
    })
    .then(async (res) => {
      if (gen !== loadGen) {
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

      if (gen !== loadGen) {
        return;
      }

      lastParts = {
        html: typeof data.html === 'string' ? data.html : '',
        css: typeof data.css === 'string' ? data.css : '',
        js: typeof data.js === 'string' ? data.js : '',
      };
      lastType = type;
      lastLocked = !!data.locked;
      lockReady = true;
      writeParts(lastParts, lastLocked);
      setPath(win.document, data.path || type);
      setStatus(win.document, lastLocked ? t(win, 'code_dock_locked') : '');
      paintLock(win);
      placeDock(win, dock);
    })
    .catch(() => {
      if (gen !== loadGen) {
        return;
      }

      showMissing(win, type);
      setStatus(win.document, t(win, 'code_dock_error'));
    });
}

export function currentTemplateType() {
  return lastType || '';
}

export function isCodeDockOpen(doc) {
  return !!doc?.getElementById(DOCK_ID);
}

export function isCodeDockLocked() {
  return lastLocked;
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
  replayLivePreview(win);

  if (!lastType || !win.document.getElementById(DOCK_ID)) {
    return;
  }

  const type = lastType;

  lastType = null;
  loadTemplate(win, type);
}

export function closeCodeDock(doc) {
  loadGen += 1;
  flushSave(doc);
  lastUid = null;
  lastType = null;
  lastParts = { html: '', css: '', js: '' };
  lastLocked = false;
  lockReady = false;
  lastWin = doc?.defaultView || lastWin;
  closeCssMenu(doc);
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
}

export function relayoutCodeDock(win) {
  if (dragging) {
    return;
  }

  const dock = win.document.getElementById(DOCK_ID);

  if (!dock) {
    return;
  }

  observeDockLayout(win);
  placeDock(win, dock);
}

function firstSectionType(doc) {
  return doc.querySelector('[data-replicator-set][data-type]')?.getAttribute('data-type') || '';
}

/**
 * Show or hide the dock.
 *
 * The header button arms it. A nested block still belongs to its outer section.
 * Once armed, the window stays open even with nothing selected — last file, or
 * the first section on the page.
 */
function chromeTemplateType(win, doc) {
  const kind = sve.chromeInlineKind || sve.activeChromeKind;

  if (kind !== 'header' && kind !== 'footer') {
    return '';
  }

  if (!sve.chromeHost?.(doc) && !sve.chromeEditorOpen?.(doc)) {
    return '';
  }

  const values = sve.unwrapRef?.(sve.chromeContainer?.()?.values) || {};
  const style = values[kind === 'footer' ? 'footer_style' : 'header_style'] || 'style_1';

  return `${kind}/${style}`;
}

function globalSectionTemplateType(doc) {
  const host = sve.globalSectionHost?.(doc) || doc.getElementById('__sve-global-section-host');

  if (!host) {
    return '';
  }

  return host.querySelector('[data-replicator-set][data-type]')?.getAttribute('data-type') || '';
}

export function syncCodeDock(win, doc, uid) {
  if (dragging) {
    return;
  }

  if (!win || !doc || isPanelFrame(doc) || !templateDockAllowed(win) || !isCodeDockArmed(win)) {
    if (doc) {
      closeCodeDock(doc);
    }

    return;
  }

  const chromeType = chromeTemplateType(win, doc);
  const globalType = chromeType ? '' : globalSectionTemplateType(doc);
  const setEl = outermostSetOf(uid, doc);
  const type = chromeType || globalType || setEl?.getAttribute('data-type') || lastType || firstSectionType(doc);

  lastWin = win;

  if (uid) {
    lastUid = uid;
  }

  if (!type) {
    placeDock(win, ensureDock(win));

    return;
  }

  if (type === lastType && doc.getElementById(DOCK_ID)) {
    placeDock(win, doc.getElementById(DOCK_ID));

    return;
  }

  flushSave(doc);
  loadTemplate(win, type);
}

register('dock:is-open', (doc) => isCodeDockOpen(doc));
register('dock:is-locked', () => isCodeDockLocked());
register('dock:insert-snippet', ({ win, parts }) => insertAiSnippet(win, parts));
register('dock:refresh', (win) => refreshCodeDockFromDisk(win));
register('dock:current-type', () => currentTemplateType());

