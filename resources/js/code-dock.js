/**
 * code-dock.js — the CP shell's barrel. The code lives in dock/*.js, one file per
 * region; this file keeps the import surface panels already use, plus the two
 * overlay entry points that stay here. Region order below is evaluation order.
 */
import { loadCodeMirror } from './lib/codemirror.js';

/**
 * Bottom HTML / CSS / JS dock for an Antlers file.
 *
 * Super admin, the settings toggle, and the Live Preview header button all
 * have to be on. On a page it is the section you clicked. On a collection
 * index/show template it is that view file, until you click a section.
 * The three panes map to markup, `{{ style_push }}` and `{{ script_push }}`;
 * saving writes them back as one file and morphs Live Preview.
 *
 * A super admin can lock a section type so the panes stay visible but
 * read-only. Unlocking asks first: the file is shared by every page that
 * uses the type. Designed types start locked; `custom_section` starts open.
 * Collection views start unlocked. The file may hold `{{# sve-locked #}}`
 * or `{{# sve-unlocked #}}`.
 */


export let EditorView;
export let keymap;
export let lineNumbers;
export let highlightActiveLine;
export let highlightActiveLineGutter;
let Compartment;
export let EditorState;
export let StateField;
export let StateEffect;
export let RangeSetBuilder;
export let Decoration;
export let defaultKeymap;
export let indentWithTab;
export let historyKeymap;
export let history;
export let autocompletion;
export let closeBrackets;
export let closeBracketsKeymap;
export let closeCompletion;
export let completionKeymap;
export let hoverTooltip;
export let htmlLanguage;
export let html;
export let css;
export let javascript;
let HighlightStyle;
export let codeFolding;
export let foldEffect;
export let unfoldEffect;
export let foldedRanges;
let syntaxHighlighting;
export let tags;

let cmReady = null;
export let cm = null;

/** This editor's bindings, filled from the shared loader in lib/codemirror.js. */
export function loadCm() {
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
    Compartment = cm.state.Compartment;
    EditorState = cm.state.EditorState;
    StateField = cm.state.StateField;
    StateEffect = cm.state.StateEffect;
    RangeSetBuilder = cm.state.RangeSetBuilder;
    Decoration = cm.view.Decoration;
    defaultKeymap = cm.commands.defaultKeymap;
    indentWithTab = cm.commands.indentWithTab;
    historyKeymap = cm.commands.historyKeymap;
    history = cm.commands.history;
    autocompletion = cm.autocomplete.autocompletion;
    closeBrackets = cm.autocomplete.closeBrackets;
    closeBracketsKeymap = cm.autocomplete.closeBracketsKeymap;
    closeCompletion = cm.autocomplete.closeCompletion;
    completionKeymap = cm.autocomplete.completionKeymap;
    hoverTooltip = cm.view.hoverTooltip;
    htmlLanguage = cm.langHtml.htmlLanguage;
    html = cm.langHtml.html;
    css = cm.langCss.css;
    javascript = cm.langJs.javascript;
    HighlightStyle = cm.language.HighlightStyle;
    syntaxHighlighting = cm.language.syntaxHighlighting;
    codeFolding = cm.language.codeFolding;
    foldEffect = cm.language.foldEffect;
    unfoldEffect = cm.language.unfoldEffect;
    foldedRanges = cm.language.foldedRanges;
    tags = cm.highlight.tags;

    readOnlyOf.html = new Compartment();
    readOnlyOf.css = new Compartment();
    readOnlyOf.js = new Compartment();
    editableOf.html = new Compartment();
    editableOf.css = new Compartment();
    editableOf.js = new Compartment();
    })
    .catch((err) => {
      cmReady = null;
      throw err;
    });

  return cmReady;
}

/**
 * The class a section's design is scoped to, as it is written in the markup.
 *
 * `_class` is handed to every section partial by the page_sections loop and is
 * the section type's own name, so it is the same for every instance and unique
 * to the type. The templates put it in the class attribute and in `@scope(…)`.
 */
export const SCOPE_CLASS = '{{ _class }}';

export const DOCK_ID = '__sve-code-dock';
export const STYLE_ID = '__sve-code-dock-style';
export const UNLOCK_ID = '__sve-code-dock-unlock';
export const HEIGHT_KEY = 'sve-code-dock-height';
export const PANES_KEY = 'sve-code-dock-panes';
export const WIDTHS_KEY = 'sve-code-dock-widths';
export const SCOPE_KEY = 'sve-html-scope-v2';
export const AUTOSAVE_KEY = 'sve-code-dock-autosave';
export const STYLE_MODE_KEY = 'sve-code-dock-style-mode';
export const VALUES_MODE_KEY = 'sve-code-dock-values';
export const DEFAULT_HEIGHT = 280;
export const MIN_HEIGHT = 120;
export const MIN_PANE = 140;
export const SAVE_MS = 250;
export const HANDLES = ['html', 'css', 'js'];

/**
 * The panes the dock can show, which is the three file parts plus Alpine.
 *
 * Alpine is not a fourth part of the file — it is attributes on the tags in
 * the HTML — so it has a pane and a button but no editor and nothing to save.
 * `HANDLES` stays the three that are read from and written to disk.
 */
export const PANES = ['html', 'css', 'alpine', 'js'];
export const LOCK_CLOSED_ICON =
  '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>';
export const LOCK_OPEN_ICON =
  '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 7.9-1"/></svg>';
export const BACK_ICON =
  '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>';
/*
 * Fluent's list-bar-tree, inlined. The button opens the HTML tree, so it should
 * look like one — the old crop-marks square drew "focus", which is the mechanism
 * rather than the thing.
 *
 * Filled rather than stroked, unlike its neighbours in the row: it inherits
 * `currentColor` from the button either way, so pressed and dimmed states are
 * unaffected.
 *
 * The only copy. The dock's markup takes it as a prop rather than repeating it,
 * because a button drawn in two places is a button that ends up drawn two ways.
 */
export const SCOPE_ICON =
  '<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M3.75 2A1.75 1.75 0 0 0 2 3.75v1c0 .966.784 1.75 1.75 1.75h.418A1.74 1.74 0 0 0 4 7.25v1.5c0 .49.201.932.525 1.25c-.324.318-.525.76-.525 1.25v1c0 .966.784 1.75 1.75 1.75h6.5A1.75 1.75 0 0 0 14 12.25v-1c0-.49-.201-.932-.525-1.25c.324-.318.525-.76.525-1.25v-1.5c0-.49-.201-.932-.525-1.25c.324-.318.525-.76.525-1.25v-1A1.75 1.75 0 0 0 12.25 2zm8.5 7.5H8v-3h4.25a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-.75.75M7 6.5v3H5.75A.75.75 0 0 1 5 8.75v-1.5a.75.75 0 0 1 .75-.75zm1 4h4.25a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-.75.75H8zm-1 0V13H5.75a.75.75 0 0 1-.75-.75v-1a.75.75 0 0 1 .75-.75zm-1-5V3h6.25a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-.75.75zm-1 0H3.75A.75.75 0 0 1 3 4.75v-1A.75.75 0 0 1 3.75 3H5z"/></svg>';
/** The Data button: a small table, for the fields behind the template. */
export const DATA_ICON =
  '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><ellipse cx="12" cy="5.5" rx="7.5" ry="3"/><path d="M4.5 5.5v6c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3v-6"/><path d="M4.5 11.5v6c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3v-6"/></svg>';
export const AUTOSAVE_ICON =
  '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19.4 16.3A8.5 8.5 0 1 1 18.3 6.3"/><path d="M21 3.2v5.4h-5.4"/></svg>';
export const SAVE_ICON =
  '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8"/><path d="M7 3v5h8"/></svg>';
export const CSS_ADD_ICON =
  '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';
export const CSS_MENU_ID = '__sve-css-menu';
export const HTML_HEADINGS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
export const HTML_TOOLS = [
  { id: 'section', title: 'section', tag: 'section' },
  { id: 'div', title: 'div', tag: 'div' },
  { id: 'heading', title: 'heading', menu: 'heading' },
  { id: 'text', title: 'text', menu: 'text' },
  { id: 'a', title: 'link', tag: 'a' },
  { id: 'img', title: 'image', snippet: '<img src="" alt="">', caret: 10 },
  { id: 'svg', title: 'svg', tag: 'svg' },
  { id: 'ul', title: 'list', tag: 'ul' },
  { id: 'li', title: 'list item', tag: 'li' },
  { id: 'component', title: 'component', menu: 'component' },
  // Antlers, not tags: what renders, and how often.
  //
  // Both land with a working expression already in them. `{{ if }}` with an
  // empty condition is not valid Antlers — it throws on the next render, so
  // the preview would break between clicking the button and typing. The caret
  // sits on that placeholder, selected, so typing still replaces it.
  { id: 'loop', title: 'loop', snippet: '{{ items }}\n\n{{ /items }}\n', caret: 3, select: 5 },
  { id: 'if', title: 'if', snippet: '{{ if true }}\n\n{{ /if }}\n', caret: 6, select: 4 },
];
export const CSS_SPACING = [
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
/**
 * The same six icons, pointed at Tailwind.
 *
 * A tool is a CSS property either way. In CSS mode it writes a declaration
 * into the rule under the cursor; in Tailwind mode it writes the class that
 * sets that property on the picked tag, taken from this site's `@theme`.
 */
/**
 * Buttons only Tailwind mode shows.
 *
 * Type scale, leading, typeface, radius and gap are families the theme
 * already declares — the CSS row never grew a button for them because you
 * would write the declaration by hand.
 */
/**
 * The display row's buttons, in Tailwind.
 *
 * Same buttons, same order, same icons — only what they write differs. Every
 * name here is in the catalog, so `twSetClass` sorts add, replace and toggle
 * out by family on its own: one `justify-*` at a time, one direction at a
 * time.
 */
export const TW_TOOL_ICONS = {
  'tw-text':
    '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">'
    + '<path d="M1.5 13 5 3l3.5 10M2.7 10h4.6"/><path d="M12.5 3.5v9M11 5l1.5-1.5L14 5M11 11l1.5 1.5L14 11"/></svg>',
  'tw-leading':
    '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">'
    + '<path d="M6 3.5h8.5M6 8h8.5M6 12.5h8.5"/><path d="M2.5 4.5v7M1.4 5.6 2.5 4.5l1.1 1.1M1.4 10.4l1.1 1.1 1.1-1.1"/></svg>',
  'tw-font':
    '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">'
    + '<path d="M3 4.2V3h10v1.2M8 3v10M6 13h4"/></svg>',
  'tw-radius':
    '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">'
    + '<path d="M2.5 13.5v-6a5 5 0 0 1 5-5h6"/><path d="M13.5 6.5v7h-7" stroke-dasharray="2 2"/></svg>',
  'tw-gap':
    '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">'
    + '<rect x="1.6" y="3" width="4.2" height="10" rx=".6"/><rect x="10.2" y="3" width="4.2" height="10" rx=".6"/><path d="M8 4.5v7"/></svg>',
  'tw-align':
    '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">'
    + '<path d="M2 3.5h12M2 8h8M2 12.5h10"/></svg>',
  'tw-w':
    '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">'
    + '<path d="M2 3.5v9M14 3.5v9"/><path d="M4.5 8h7"/><path d="M6 6.2 4.2 8 6 9.8M10 6.2 11.8 8 10 9.8"/></svg>',
  'tw-h':
    '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">'
    + '<path d="M3.5 2h9M3.5 14h9"/><path d="M8 4.5v7"/><path d="M6.2 6 8 4.2 9.8 6M6.2 10 8 11.8 9.8 10"/></svg>',
  'tw-maxw':
    '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">'
    + '<path d="M1.5 3v10M14.5 3v10"/><path d="M5 8h6"/><path d="M6.6 6.2 4.8 8l1.8 1.8M9.4 6.2 11.2 8l-1.8 1.8"/></svg>',
  'tw-overflow':
    '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round">'
    + '<rect x="1.8" y="4.5" width="8.6" height="9.7" rx="1.2"/><path d="M6.5 1.8h7.7v7.7" stroke-linecap="round"/></svg>',
  'tw-border':
    '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2">'
    + '<rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.6"/>'
    + '<rect x="5.6" y="5.6" width="4.8" height="4.8" rx=".6" stroke-width="1" opacity=".45"/></svg>',
};

export const STRIP_ICON =
  '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" '
  + 'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
  + '<rect x="3" y="10" width="18" height="11" rx="2"/>'
  + '<rect x="6" y="3" width="9" height="4" rx="1.4" fill="currentColor" stroke="none"/></svg>';

export const HISTORY_ICON =
  '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" '
  + 'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
  + '<path d="M3.1 12a8.9 8.9 0 1 0 2.8-6.5L3 8"/><path d="M3 3.4V8h4.6"/>'
  + '<path d="M12 7.4V12l3 1.8"/></svg>';

export const CSS_MODE_ICON =
  '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" '
  + 'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
  + '<path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5a2 2 0 0 0 2 2h1"/>'
  + '<path d="M16 3h1a2 2 0 0 1 2 2v5a2 2 0 0 0 2 2 2 2 0 0 0-2 2v5a2 2 0 0 1-2 2h-1"/></svg>';

export const ID_MODE_ICON =
  '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" '
  + 'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
  + '<path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18"/></svg>';

export const TW_MODE_ICON =
  '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" '
  + 'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
  + '<path d="M3 10.5c1.5-4 3.8-5 6-3.5 1.4 1 1.7 2.5 3.4 2.9 2.2.5 3.6-.9 4.6-2.4"/>'
  + '<path d="M3 17c1.5-4 3.8-5 6-3.5 1.4 1 1.7 2.5 3.4 2.9 2.2.5 3.6-.9 4.6-2.4"/></svg>';

export const CSS_GRAYS = [
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
/**
 * Every tool in the CSS row, and the children each one opens.
 *
 * ONE shape, for all of them. A tool is an icon, what it sets, and a list of
 * children — and a child is an icon, what it sets, and nothing else. Padding's
 * sides, Flex's alignment, Border's edges and Radius's corners are the same
 * list with different entries, drawn by the same loop, opened by the same
 * click. There is no second kind of tool and no second kind of row.
 *
 * A child says what a click on it does, in one of three ways:
 *
 *   `menu`   open that menu for `css` (this site's scale, or its colours)
 *   `value`  set `css` to it, or take it off again if it is already that
 *   `kind`   one of the two that clear neighbours as well: display, direction
 *
 * `css` is the logical property written here; `tw` the physical one Tailwind's
 * own scale is built on, because there is no `padding-block-start` utility.
 */

/** The seven parts of a box, built for whichever property owns them. */
const boxKids = (prefix) => [
  { id: `${prefix}-all`, icon: 'box-all', title: 'All sides', css: prefix, tw: prefix },
  { id: `${prefix}-block`, icon: 'box-block', title: 'Top and bottom', css: `${prefix}-block`, tw: `${prefix}-block`, sep: true },
  { id: `${prefix}-block-start`, icon: 'box-block-start', title: 'Top', css: `${prefix}-block-start`, tw: `${prefix}-top` },
  { id: `${prefix}-block-end`, icon: 'box-block-end', title: 'Bottom', css: `${prefix}-block-end`, tw: `${prefix}-bottom` },
  { id: `${prefix}-inline`, icon: 'box-inline', title: 'Left and right', css: `${prefix}-inline`, tw: `${prefix}-inline`, sep: true },
  { id: `${prefix}-inline-start`, icon: 'box-inline-start', title: 'Left', css: `${prefix}-inline-start`, tw: `${prefix}-left` },
  { id: `${prefix}-inline-end`, icon: 'box-inline-end', title: 'Right', css: `${prefix}-inline-end`, tw: `${prefix}-right` },
];

/** Flex's own children: what it is, which way it runs, how it lines up. */
const DISPLAY_KIDS = [
  { id: 'display-flex', twClass: 'flex', icon: 'display-flex', title: 'Flex', kind: 'display', value: 'flex', css: 'display' },
  { id: 'flex-row', twClass: 'flex-row', icon: 'flex-row', title: 'Direction: row', kind: 'flexDir', value: 'row', css: 'flex-direction', sep: true },
  { id: 'flex-col', twClass: 'flex-col', icon: 'flex-col', title: 'Direction: column', kind: 'flexDir', value: 'column', css: 'flex-direction' },
  { id: 'justify-start', twClass: 'justify-start', icon: 'justify-start', title: 'Justify: start', css: 'justify-content', value: 'flex-start', when: 'flex', sep: true },
  { id: 'justify-center', twClass: 'justify-center', icon: 'justify-center', title: 'Justify: center', css: 'justify-content', value: 'center', when: 'flex' },
  { id: 'justify-end', twClass: 'justify-end', icon: 'justify-end', title: 'Justify: end', css: 'justify-content', value: 'flex-end', when: 'flex' },
  { id: 'justify-between', twClass: 'justify-between', icon: 'justify-between', title: 'Justify: between', css: 'justify-content', value: 'space-between', when: 'flex' },
  { id: 'justify-around', twClass: 'justify-around', icon: 'justify-around', title: 'Justify: around', css: 'justify-content', value: 'space-around', when: 'flex' },
  { id: 'align-start', twClass: 'items-start', icon: 'align-start', title: 'Align: start', css: 'align-items', value: 'flex-start', when: 'flex', sep: true },
  { id: 'align-center', twClass: 'items-center', icon: 'align-center', title: 'Align: center', css: 'align-items', value: 'center', when: 'flex' },
  { id: 'align-end', twClass: 'items-end', icon: 'align-end', title: 'Align: end', css: 'align-items', value: 'flex-end', when: 'flex' },
  { id: 'align-stretch', twClass: 'items-stretch', icon: 'align-stretch', title: 'Align: stretch', css: 'align-items', value: 'stretch', when: 'flex' },
];

const GAP_KIDS = [
  { id: 'gap-all', icon: 'gap-all', title: 'Both', css: 'gap', tw: 'gap', menu: 'spacing' },
  { id: 'gap-row', icon: 'gap-row', title: 'Between rows', css: 'row-gap', tw: 'row-gap', menu: 'spacing', sep: true },
  { id: 'gap-col', icon: 'gap-col', title: 'Between columns', css: 'column-gap', tw: 'column-gap', menu: 'spacing' },
];

const BORDER_KIDS = [
  { id: 'bd-all', icon: 'bd-all', title: 'All sides', css: 'border-color', tw: 'border-color', menu: 'colors' },
  { id: 'bd-block', icon: 'bd-block', title: 'Top and bottom', css: 'border-block-color', tw: 'border-color', menu: 'colors', sep: true },
  { id: 'bd-top', icon: 'bd-top', title: 'Top', css: 'border-block-start-color', tw: 'border-top-color', menu: 'colors' },
  { id: 'bd-bottom', icon: 'bd-bottom', title: 'Bottom', css: 'border-block-end-color', tw: 'border-bottom-color', menu: 'colors' },
  { id: 'bd-inline', icon: 'bd-inline', title: 'Left and right', css: 'border-inline-color', tw: 'border-color', menu: 'colors', sep: true },
  { id: 'bd-left', icon: 'bd-left', title: 'Left', css: 'border-inline-start-color', tw: 'border-left-color', menu: 'colors' },
  { id: 'bd-right', icon: 'bd-right', title: 'Right', css: 'border-inline-end-color', tw: 'border-right-color', menu: 'colors' },
];

const RADIUS_KIDS = [
  { id: 'rd-all', icon: 'rd-all', title: 'All corners', css: 'border-radius', tw: 'border-radius', menu: 'values' },
  { id: 'rd-tl', icon: 'rd-tl', title: 'Top left', css: 'border-start-start-radius', tw: 'border-top-left-radius', menu: 'values', sep: true },
  { id: 'rd-tr', icon: 'rd-tr', title: 'Top right', css: 'border-start-end-radius', tw: 'border-top-right-radius', menu: 'values' },
  { id: 'rd-br', icon: 'rd-br', title: 'Bottom right', css: 'border-end-end-radius', tw: 'border-bottom-right-radius', menu: 'values' },
  { id: 'rd-bl', icon: 'rd-bl', title: 'Bottom left', css: 'border-end-start-radius', tw: 'border-bottom-left-radius', menu: 'values' },
];

/** The row, in order. `kids` is what unfolds under the icon. */
export const CSS_TOOLS = [
  { id: 'display', title: 'Display', css: 'display', tw: 'display', kids: DISPLAY_KIDS },
  { id: 'absolute', title: 'Position', css: 'position', tw: 'position', value: 'absolute' },
  { id: 'color', title: 'Text color', css: 'color', tw: 'color', menu: 'colors' },
  { id: 'bg', title: 'Background color', css: 'background-color', tw: 'background-color', menu: 'colors' },
  { id: 'padding', title: 'Padding', css: 'padding', tw: 'padding', kids: boxKids('padding') },
  { id: 'margin', title: 'Margin', css: 'margin', tw: 'margin', kids: boxKids('margin') },
  { id: 'tw-text', title: 'Font size', css: 'font-size', tw: 'font-size', menu: 'values' },
  { id: 'tw-leading', title: 'Line height', css: 'line-height', tw: 'line-height', menu: 'values' },
  { id: 'tw-font', title: 'Font family', css: 'font-family', tw: 'font-family', menu: 'values' },
  { id: 'tw-align', title: 'Text align', css: 'text-align', tw: 'text-align', menu: 'choices', choices: ['left', 'center', 'right', 'justify'] },
  { id: 'tw-border', title: 'Border color', css: 'border-color', tw: 'border-color', kids: BORDER_KIDS },
  { id: 'tw-radius', title: 'Radius', css: 'border-radius', tw: 'border-radius', kids: RADIUS_KIDS },
  { id: 'tw-gap', title: 'Gap', css: 'gap', tw: 'gap', kids: GAP_KIDS },
  { id: 'tw-w', title: 'Width', css: 'width', tw: 'width', menu: 'sizes' },
  { id: 'tw-h', title: 'Height', css: 'height', tw: 'height', menu: 'sizes' },
  { id: 'tw-maxw', title: 'Max width', css: 'max-width', tw: 'max-width', menu: 'sizes' },
  { id: 'tw-overflow', title: 'Overflow', css: 'overflow', tw: 'overflow', menu: 'choices', choices: ['visible', 'hidden', 'clip', 'auto', 'scroll'] },
];

/** Lengths that are not on a scale — a box is as wide as it needs to be. */
export const CSS_LENGTHS = ['100%', 'auto', 'fit-content', 'min-content', 'max-content', '100vw', '100dvh', '0'];

/** Every tool and every child, flat, for looking one up by id. */
export const CSS_TOOL_INDEX = new Map();

for (const tool of CSS_TOOLS) {
  CSS_TOOL_INDEX.set(tool.id, { tool, kid: null });

  for (const kid of tool.kids || []) {
    CSS_TOOL_INDEX.set(kid.id, { tool, kid });
  }
}

export const CSS_TOOL_ICONS = {
  display:
    '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="2.5" width="13" height="11" rx="1.2"/><path d="M5 6.5h6M5 9.5h4"/></svg>',
  'display-flex':
    '<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="3.5" width="3.4" height="9" rx=".4"/><rect x="6.3" y="3.5" width="3.4" height="9" rx=".4"/><rect x="10.6" y="3.5" width="3.4" height="9" rx=".4"/></svg>',
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
    '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">'
    + '<path d="M3.4 11.2 7.4 2.4l4 8.8"/><path d="M4.7 8.4h5.4"/>'
    + '<rect x="1.6" y="12.8" width="12.8" height="2.2" rx=".6" fill="currentColor" stroke="none"/></svg>',
  bg:
    '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3">'
    + '<path d="M8 1.9a6.1 6.1 0 1 0 0 12.2c.85 0 1.35-.55 1.35-1.25 0-.38-.18-.66-.4-.88a1.2 1.2 0 0 1 .85-2.05h1.3A3.5 3.5 0 0 0 14.1 6.1C14.1 3.75 11.4 1.9 8 1.9Z"/>'
    + '<circle cx="4.9" cy="6.5" r=".95" fill="currentColor" stroke="none"/>'
    + '<circle cx="8" cy="4.8" r=".95" fill="currentColor" stroke="none"/>'
    + '<circle cx="11.1" cy="6.5" r=".95" fill="currentColor" stroke="none"/>'
    + '<circle cx="4.7" cy="9.9" r=".95" fill="currentColor" stroke="none"/></svg>',
  padding:
    '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1"/><rect x="4.5" y="4.5" width="7" height="7" rx=".6"/></svg>',
  margin:
    '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="4.5" y="4.5" width="7" height="7" rx=".6"/><path d="M2 2.5h12M2 13.5h12M2.5 2v12M13.5 2v12" stroke-dasharray="1.4 1.2"/></svg>',
  // Every side. Same silhouette as the tool that opens the group, but filled
  // rather than outlined — the parent stands right next to it, and two thin
  // squares beside each other read as the same icon twice.
  'box-all':
    '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4">'
    + '<rect x="1.5" y="1.5" width="13" height="13" rx="1"/>'
    + '<rect x="4.5" y="4.5" width="7" height="7" rx=".4" fill="currentColor" stroke="none"/></svg>',
  'box-block':
    '<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="3.2" width="9.6" height="2.3" rx=".35" stroke="none"/><rect x="3.2" y="10.5" width="9.6" height="2.3" rx=".35" stroke="none"/></svg>',
  'box-block-start':
    '<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="3.2" width="9.6" height="2.3" rx=".35" stroke="none"/></svg>',
  'box-block-end':
    '<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="10.5" width="9.6" height="2.3" rx=".35" stroke="none"/></svg>',
  'box-inline':
    '<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="3.2" width="2.3" height="9.6" rx=".35" stroke="none"/><rect x="10.5" y="3.2" width="2.3" height="9.6" rx=".35" stroke="none"/></svg>',
  'box-inline-start':
    '<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="3.2" width="2.3" height="9.6" rx=".35" stroke="none"/></svg>',
  'box-inline-end':
    '<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="10.5" y="3.2" width="2.3" height="9.6" rx=".35" stroke="none"/></svg>',
  // Gap: two plates with the run between them marked, turned each way.
  'gap-all':
    '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><rect x="1.6" y="3" width="4.2" height="10" rx=".6"/><rect x="10.2" y="3" width="4.2" height="10" rx=".6"/><path d="M8 4.5v7"/></svg>',
  'gap-row':
    '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><rect x="3" y="1.6" width="10" height="4.2" rx=".6"/><rect x="3" y="10.2" width="10" height="4.2" rx=".6"/><path d="M4.5 8h7"/></svg>',
  'gap-col':
    '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><rect x="1.6" y="3" width="4.2" height="10" rx=".6"/><rect x="10.2" y="3" width="4.2" height="10" rx=".6"/><path d="M8 4.5v7"/></svg>',
  // Border: the box, with the edge being set drawn thick.
  'bd-all':
    '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4"/></svg>',
  'bd-block':
    '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M2.6 3.2h10.8M2.6 12.8h10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',
  'bd-top':
    '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M2.6 3.2h10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',
  'bd-bottom':
    '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M2.6 12.8h10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',
  'bd-inline':
    '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M3.2 2.6v10.8M12.8 2.6v10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',
  'bd-left':
    '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M3.2 2.6v10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',
  'bd-right':
    '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" stroke-width="1" opacity=".35"/><path d="M12.8 2.6v10.8" stroke-width="2.2" stroke-linecap="round"/></svg>',
  // Radius: the box with one corner rounded and drawn thick.
  'rd-all':
    '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="3.4"/></svg>',
  'rd-tl':
    '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-linecap="round"><path d="M13.4 2.6H6a3.4 3.4 0 0 0-3.4 3.4v7.4" stroke-width="1" opacity=".35"/><path d="M2.6 9V6A3.4 3.4 0 0 1 6 2.6h3" stroke-width="2.2"/></svg>',
  'rd-tr':
    '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-linecap="round"><path d="M2.6 2.6h7.4a3.4 3.4 0 0 1 3.4 3.4v7.4" stroke-width="1" opacity=".35"/><path d="M7 2.6h3A3.4 3.4 0 0 1 13.4 6v3" stroke-width="2.2"/></svg>',
  'rd-br':
    '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-linecap="round"><path d="M13.4 2.6v7.4a3.4 3.4 0 0 1-3.4 3.4H2.6" stroke-width="1" opacity=".35"/><path d="M13.4 7v3a3.4 3.4 0 0 1-3.4 3.4H7" stroke-width="2.2"/></svg>',
  'rd-bl':
    '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-linecap="round"><path d="M2.6 2.6v7.4a3.4 3.4 0 0 0 3.4 3.4h7.4" stroke-width="1" opacity=".35"/><path d="M2.6 7v3A3.4 3.4 0 0 0 6 13.4h3" stroke-width="2.2"/></svg>',
};

export const editors = { html: null, css: null, js: null };
export const readOnlyOf = {
  html: null,
  css: null,
  js: null,
};
export const editableOf = {
  html: null,
  css: null,
  js: null,
};

export * from './dock/layout.js';
export * from './dock/scope.js';
export * from './dock/lock-autosave.js';
export * from './dock/css-tools.js';
export * from './dock/html-tools.js';
export * from './dock/history-strip.js';
export * from './dock/style-modes.js';
export * from './dock/css-sizes.js';
export * from './dock/alpine.js';
export * from './dock/toolbars.js';
export * from './dock/data-vars.js';
export * from './dock/save.js';
export * from './dock/editor.js';
export * from './dock/dock-api.js';
