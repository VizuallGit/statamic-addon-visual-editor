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

import { SUNDAY_AUG30 } from './sunday-aug30.js';
import { replayLivePreview, topLevelSectionIds, topLevelSectionUid } from './cp.js';
import { sve } from './cp-registry.js';
import { chromeGet, chromeSet } from './chrome-prefs.js';
import { ARMED_KEY, isCodeDockArmed, setCodeDockArmed, templateDockAllowed } from './code-dock-state.js';
import { splitterFill } from './right-dock.js';
import { ensurePanel } from './lazy-panels.js';
import { emit, on, register } from './cp/bus.js';
import { mountPane } from './cp/mount-pane.js';
import CodeDockChrome from './cp/surfaces/CodeDockChrome.vue';
import ChoiceDialog from './cp/surfaces/ChoiceDialog.vue';
import CodeDockHtmlTools from './cp/surfaces/CodeDockHtmlTools.vue';
import CodeDockAntlersSelect from './cp/surfaces/CodeDockAntlersSelect.vue';
import CodeDockCssTools from './cp/surfaces/CodeDockCssTools.vue';
import CodeDockCssBoxRow from './cp/surfaces/CodeDockCssBoxRow.vue';
import CodeDockCssDisplayRow from './cp/surfaces/CodeDockCssDisplayRow.vue';
import CodeDockMenu from './cp/surfaces/CodeDockMenu.vue';
import CodeDockAddClass from './cp/surfaces/CodeDockAddClass.vue';
import { flattenHtmlTree, parseHtmlTree } from './html-tree-parse.js';
import { twCandidates } from './tw-candidates.js';
import { tailwindDockOn } from './tailwind-complete.js';
import { setTwOverlayOn, twOverlayOn } from './tw-overlay.js';
import {
  closeTwMenu,
  renderTwClasses,
  twRepaintOverlay,
  twActiveClass,
  twHasNode,
  twOpenAddMenu,
  twOpenToolMenu,
  twSetClass,
} from './tw-classes.js';
import { bindTips } from './cp/tip.js';
import { openCpOverlay } from './cp/open-overlay.js';
import { mountSurface } from './cp/mount.js';
import { applyBracketClass, bracketClassTokens, buildScopedCss, cssClassSelectors, diffBracketNames, findClassRule, firstClassName, mergeScopedCss, pruneBracketCss, rewriteBracketClassTokens, sanitizeCssClassName, syncCssWithBrackets, tokenTreeFromHtml } from './css-scope.js';
import {
  ANTLERS_SNIPPET_GROUPS,
  ANTLERS_SNIPPETS,
  antlersSnippet,
  expandAntlersSnippet,
  indentAntlersSnippet,
} from './antlers-snippets.js';
import {
  VISUAL_EDIT_SNIPPET_GROUPS,
  VISUAL_EDIT_SNIPPETS,
  VISUAL_EDIT_TAG,
  findVisualEditInRange,
  hasAttr,
  visualEditSnippet,
} from './visual-edit-snippets.js';
import { expandHtmlTab, htmlEmmetExtensions } from './html-emmet.js';
import { htmlTagSync } from './html-tag-sync.js';
import {
  PARTIAL_MENU_ID,
  bindPartialNav,
  closePartialMenu,
  partialDecorations,
} from './dock-partials.js';
import {
  CLASS_RENAME_CHIP_ID,
  bindClassTokenNav,
  classTokenDecorations,
  closeClassTokenUi,
} from './dock-class-tokens.js';
import {
  tailwindClassCompletions,
  tailwindHoverExtension,
} from './tailwind-complete.js';

let EditorView;
let keymap;
let lineNumbers;
let highlightActiveLine;
let highlightActiveLineGutter;
let Compartment;
let EditorState;
let StateField;
let StateEffect;
let RangeSetBuilder;
let Decoration;
let defaultKeymap;
let indentWithTab;
let historyKeymap;
let history;
let autocompletion;
let closeBrackets;
let closeBracketsKeymap;
let closeCompletion;
let completionKeymap;
let hoverTooltip;
let htmlLanguage;
let html;
let css;
let javascript;
let HighlightStyle;
let syntaxHighlighting;
let tags;

let cmReady = null;

function loadCm() {
  if (cmReady) {
    return cmReady;
  }

  cmReady = Promise.all([
    import('@codemirror/view'),
    import('@codemirror/state'),
    import('@codemirror/commands'),
    import('@codemirror/autocomplete'),
    import('@codemirror/lang-html'),
    import('@codemirror/lang-css'),
    import('@codemirror/lang-javascript'),
    import('@codemirror/language'),
    import('@lezer/highlight'),
  ]).then(([view, state, commands, complete, langHtml, langCss, langJs, language, highlight]) => {
    EditorView = view.EditorView;
    keymap = view.keymap;
    lineNumbers = view.lineNumbers;
    highlightActiveLine = view.highlightActiveLine;
    highlightActiveLineGutter = view.highlightActiveLineGutter;
    Compartment = state.Compartment;
    EditorState = state.EditorState;
    StateField = state.StateField;
    StateEffect = state.StateEffect;
    RangeSetBuilder = state.RangeSetBuilder;
    Decoration = view.Decoration;
    defaultKeymap = commands.defaultKeymap;
    indentWithTab = commands.indentWithTab;
    historyKeymap = commands.historyKeymap;
    history = commands.history;
    autocompletion = complete.autocompletion;
    closeBrackets = complete.closeBrackets;
    closeBracketsKeymap = complete.closeBracketsKeymap;
    closeCompletion = complete.closeCompletion;
    completionKeymap = complete.completionKeymap;
    hoverTooltip = view.hoverTooltip;
    htmlLanguage = langHtml.htmlLanguage;
    html = langHtml.html;
    css = langCss.css;
    javascript = langJs.javascript;
    HighlightStyle = language.HighlightStyle;
    syntaxHighlighting = language.syntaxHighlighting;
    tags = highlight.tags;

    readOnlyOf.html = new Compartment();
    readOnlyOf.css = new Compartment();
    readOnlyOf.js = new Compartment();
    editableOf.html = new Compartment();
    editableOf.css = new Compartment();
    editableOf.js = new Compartment();
  }).catch((err) => {
    cmReady = null;
    throw err;
  });

  return cmReady;
}

const DOCK_ID = '__sve-code-dock';
const STYLE_ID = '__sve-code-dock-style';
const UNLOCK_ID = '__sve-code-dock-unlock';
const HEIGHT_KEY = 'sve-code-dock-height';
const PANES_KEY = 'sve-code-dock-panes';
const WIDTHS_KEY = 'sve-code-dock-widths';
const SCOPE_KEY = 'sve-html-scope-v2';
const AUTOSAVE_KEY = 'sve-code-dock-autosave';
const STYLE_MODE_KEY = 'sve-code-dock-style-mode';
const DEFAULT_HEIGHT = 280;
const MIN_HEIGHT = 120;
const MIN_PANE = 140;
const SAVE_MS = 250;
const HANDLES = ['html', 'css', 'js'];
const LOCK_CLOSED_ICON =
  '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>';
const LOCK_OPEN_ICON =
  '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 7.9-1"/></svg>';
const BACK_ICON =
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
const SCOPE_ICON =
  '<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M3.75 2A1.75 1.75 0 0 0 2 3.75v1c0 .966.784 1.75 1.75 1.75h.418A1.74 1.74 0 0 0 4 7.25v1.5c0 .49.201.932.525 1.25c-.324.318-.525.76-.525 1.25v1c0 .966.784 1.75 1.75 1.75h6.5A1.75 1.75 0 0 0 14 12.25v-1c0-.49-.201-.932-.525-1.25c.324-.318.525-.76.525-1.25v-1.5c0-.49-.201-.932-.525-1.25c.324-.318.525-.76.525-1.25v-1A1.75 1.75 0 0 0 12.25 2zm8.5 7.5H8v-3h4.25a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-.75.75M7 6.5v3H5.75A.75.75 0 0 1 5 8.75v-1.5a.75.75 0 0 1 .75-.75zm1 4h4.25a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-.75.75H8zm-1 0V13H5.75a.75.75 0 0 1-.75-.75v-1a.75.75 0 0 1 .75-.75zm-1-5V3h6.25a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-.75.75zm-1 0H3.75A.75.75 0 0 1 3 4.75v-1A.75.75 0 0 1 3.75 3H5z"/></svg>';
const AUTOSAVE_ICON =
  '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19.4 16.3A8.5 8.5 0 1 1 18.3 6.3"/><path d="M21 3.2v5.4h-5.4"/></svg>';
const SAVE_ICON =
  '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8"/><path d="M7 3v5h8"/></svg>';
const CSS_ADD_ICON =
  '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';
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
const CSS_BOX_SIDES = [
  { id: 'all', suffix: '', title: 'All sides' },
  { id: 'block', suffix: '-block', title: 'Top and bottom', sep: true },
  { id: 'block-start', suffix: '-block-start', title: 'Top' },
  { id: 'block-end', suffix: '-block-end', title: 'Bottom' },
  { id: 'inline', suffix: '-inline', title: 'Left and right', sep: true },
  { id: 'inline-start', suffix: '-inline-start', title: 'Left' },
  { id: 'inline-end', suffix: '-inline-end', title: 'Right' },
];
/**
 * The same six icons, pointed at Tailwind.
 *
 * A tool is a CSS property either way. In CSS mode it writes a declaration
 * into the rule under the cursor; in Tailwind mode it writes the class that
 * sets that property on the picked tag, taken from this site's `@theme`.
 */
const TW_TOOL_PROPERTY = {
  display: 'display',
  absolute: 'position',
  color: 'color',
  bg: 'background-color',
  padding: 'padding',
  margin: 'margin',
  'tw-text': 'font-size',
  'tw-leading': 'line-height',
  'tw-font': 'font-family',
  'tw-radius': 'border-radius',
  'tw-gap': 'gap',
  'tw-align': 'text-align',
  'tw-w': 'width',
  'tw-h': 'height',
  'tw-maxw': 'max-width',
  'tw-overflow': 'overflow',
  'tw-border': 'border-color',
};

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
const TW_DISPLAY_CLASS = {
  'display-flex': 'flex',
  'flex-row': 'flex-row',
  'flex-col': 'flex-col',
  'justify-start': 'justify-start',
  'justify-center': 'justify-center',
  'justify-end': 'justify-end',
  'justify-between': 'justify-between',
  'justify-around': 'justify-around',
  'align-start': 'items-start',
  'align-center': 'items-center',
  'align-end': 'items-end',
  'align-stretch': 'items-stretch',
};

const TW_EXTRA_TOOLS = [
  { id: 'tw-text', title: 'Font size' },
  { id: 'tw-leading', title: 'Line height' },
  { id: 'tw-font', title: 'Font family' },
  { id: 'tw-align', title: 'Text align' },
  { id: 'tw-border', title: 'Border color' },
  { id: 'tw-radius', title: 'Radius' },
  { id: 'tw-gap', title: 'Gap' },
  { id: 'tw-w', title: 'Width' },
  { id: 'tw-h', title: 'Height' },
  { id: 'tw-maxw', title: 'Max width' },
  { id: 'tw-overflow', title: 'Overflow' },
];

const TW_TOOL_ICONS = {
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

/**
 * Box sides, from the logical properties the CSS row uses to the physical
 * ones Tailwind's own scale is built on: `pt-*` is padding-top, and there is
 * no `padding-block-start` utility to point at.
 */
const TW_BOX_SIDE = {
  '': '',
  '-block': '-block',
  '-inline': '-inline',
  '-block-start': '-top',
  '-block-end': '-bottom',
  '-inline-start': '-left',
  '-inline-end': '-right',
};

const STRIP_ICON =
  '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" '
  + 'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
  + '<rect x="3" y="10" width="18" height="11" rx="2"/>'
  + '<rect x="6" y="3" width="9" height="4" rx="1.4" fill="currentColor" stroke="none"/></svg>';

const HISTORY_ICON =
  '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" '
  + 'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
  + '<path d="M3.1 12a8.9 8.9 0 1 0 2.8-6.5L3 8"/><path d="M3 3.4V8h4.6"/>'
  + '<path d="M12 7.4V12l3 1.8"/></svg>';

const CSS_MODE_ICON =
  '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" '
  + 'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
  + '<path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5a2 2 0 0 0 2 2h1"/>'
  + '<path d="M16 3h1a2 2 0 0 1 2 2v5a2 2 0 0 0 2 2 2 2 0 0 0-2 2v5a2 2 0 0 1-2 2h-1"/></svg>';

const TW_MODE_ICON =
  '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" '
  + 'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
  + '<path d="M3 10.5c1.5-4 3.8-5 6-3.5 1.4 1 1.7 2.5 3.4 2.9 2.2.5 3.6-.9 4.6-2.4"/>'
  + '<path d="M3 17c1.5-4 3.8-5 6-3.5 1.4 1 1.7 2.5 3.4 2.9 2.2.5 3.6-.9 4.6-2.4"/></svg>';

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
  { id: 'display', title: 'Display', menu: 'display' },
  { id: 'absolute', title: 'Position', insert: 'position: absolute;' },
  { id: 'color', title: 'Text color', property: 'color', menu: 'colors' },
  { id: 'bg', title: 'Background color', property: 'background-color', menu: 'colors' },
  { id: 'padding', title: 'Padding', property: 'padding', menu: 'box' },
  { id: 'margin', title: 'Margin', property: 'margin', menu: 'box' },
];
const CSS_DISPLAY_ITEMS = [
  { id: 'display-flex', title: 'Flex', display: 'flex' },
  { id: 'flex-row', title: 'Direction: row', flexDir: 'row', sep: true },
  { id: 'flex-col', title: 'Direction: column', flexDir: 'column' },
];
const CSS_FLEX_EXTRAS = [
  { id: 'justify-start', title: 'Justify: start', property: 'justify-content', value: 'flex-start' },
  { id: 'justify-center', title: 'Justify: center', property: 'justify-content', value: 'center' },
  { id: 'justify-end', title: 'Justify: end', property: 'justify-content', value: 'flex-end' },
  { id: 'justify-between', title: 'Justify: between', property: 'justify-content', value: 'space-between' },
  { id: 'justify-around', title: 'Justify: around', property: 'justify-content', value: 'space-around' },
  { id: 'align-start', title: 'Align: start', property: 'align-items', value: 'flex-start', group: 'align' },
  { id: 'align-center', title: 'Align: center', property: 'align-items', value: 'center', group: 'align' },
  { id: 'align-end', title: 'Align: end', property: 'align-items', value: 'flex-end', group: 'align' },
  { id: 'align-stretch', title: 'Align: stretch', property: 'align-items', value: 'stretch', group: 'align' },
];
const CSS_TOOL_ICONS = {
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
let typeStack = [];
let lastParts = { html: '', css: '', js: '' };
let lastLocked = false;
let lockReady = false;
let lastWin = null;
let loadGen = 0;
let saveTimer = null;
let lastBracketNames = null;
let lastCssSelectorNames = null;
let saveInFlight = null;
let dragging = false;
let applying = false;
let htmlScopePref = true;
let htmlScopeActive = false;
/** Which language the CSS pane is in: 'css' or 'tw'. */
let styleMode = 'css';

/** Redraws the icon row for the mode it is now in. Set by bindCssTools. */
let cssToolRow = null;

/** The compiled Tailwind for the classes in `twKey`, ready to be saved. */
let twCss = null;
let twKey = '';
let twBusy = false;
let twDirty = false;
let htmlFocus = null;
let htmlFull = '';
let cssFull = '';
let cssPane = 'full';
let cssScopeSnapshot = '';
let layoutObserver = null;
let layoutWin = null;
let observedEditor = null;
let observedRight = null;
let layoutWatchBound = false;
const editors = { html: null, css: null, js: null };
const readOnlyOf = {
  html: null,
  css: null,
  js: null,
};
const editableOf = {
  html: null,
  css: null,
  js: null,
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
        '&': { height: 'auto', backgroundColor: '#1E1E21', color: '#d4d4d4' },
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
          backgroundColor: '#1E1E21',
          color: '#858585',
          border: 'none',
          borderRight: '1px solid #3c3c3c',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
          fontSize: '13px',
          lineHeight: '1.55',
        },
        '.cm-lineNumbers .cm-gutterElement': { paddingLeft: '8px', paddingRight: '12px' },
        '.cm-scroller': { overflow: 'visible', height: 'auto', minHeight: 0 },
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
export { ARMED_KEY, isCodeDockArmed, setCodeDockArmed, templateDockAllowed };

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
@keyframes sve-cm-wait { to { transform: rotate(360deg); } }
#${DOCK_ID} {
  position: fixed;
  /* Same band as the right dock: above the page, under Statamic stacks. */
  z-index: var(--z-index-above, 1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #1E1E21;
  color: #d4d4d4;
  border-top: 1px solid rgba(255,255,255,.12);
  /* No shadow: the sidebars sit flat against the page and this is the same
     kind of panel. The border is what marks the edge. */
  font-family: ui-sans-serif, system-ui, sans-serif;
}
#${DOCK_ID} [data-sve-code-bar] {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 12px;
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
  margin-left: 4px;
}
#${DOCK_ID} [data-sve-code-back] {
  all: unset;
  cursor: pointer;
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  margin-left: 8px;
  border-radius: 6px;
  color: #d4d4d4;
  opacity: .7;
}
#${DOCK_ID} [data-sve-code-back]:hover {
  opacity: 1;
  background: rgba(255,255,255,.1);
}
#${DOCK_ID} [data-sve-code-back][hidden] {
  display: none;
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
#${DOCK_ID} [data-sve-html-scope] {
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
#${DOCK_ID} [data-sve-html-scope]:hover {
  opacity: 1;
  background: rgba(255,255,255,.1);
}
#${DOCK_ID} [data-sve-html-scope][aria-pressed="true"] {
  opacity: 1;
  color: #93c5fd;
  background: rgba(56,88,233,.22);
}
#${DOCK_ID} [data-sve-code-strip],
#${DOCK_ID} [data-sve-code-history] {
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
#${DOCK_ID} [data-sve-code-strip]:hover,
#${DOCK_ID} [data-sve-code-history]:hover,
#${DOCK_ID} [data-sve-code-history][data-open] {
  opacity: 1;
  background: rgba(255,255,255,.1);
}
#${DOCK_ID} [data-sve-code-strip][aria-pressed="true"] {
  opacity: 1;
  color: #7dd3fc;
  background: rgba(56,189,248,.16);
}
#${DOCK_ID} [data-sve-style-mode] {
  all: unset;
  cursor: pointer;
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 26px;
  padding: 0 8px;
  margin-left: 4px;
  border-radius: 6px;
  color: #d4d4d4;
  opacity: .6;
  font-size: 11px;
  white-space: nowrap;
}
#${DOCK_ID} [data-sve-style-mode]:hover {
  opacity: 1;
  background: rgba(255,255,255,.1);
}
#${DOCK_ID} [data-sve-style-mode][aria-pressed="true"] {
  opacity: 1;
  color: #7dd3fc;
  background: rgba(56,189,248,.16);
}
/* The CSS pane holds two things and shows one: the editor, or the chips. */
#${DOCK_ID} [data-sve-tw-host] {
  display: none;
}
#${DOCK_ID}[data-sve-style="tw"] [data-sve-code-pane="css"] [data-sve-code-host] {
  display: none;
}
#${DOCK_ID}[data-sve-style="tw"] [data-sve-tw-host] {
  display: block;
  flex: 1 1 0;
  min-height: 0;
  overflow: auto;
  overscroll-behavior: contain;
  scrollbar-width: thin;
}
#${DOCK_ID} [data-sve-code-autosave],
#${DOCK_ID} [data-sve-code-save] {
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
#${DOCK_ID} [data-sve-code-autosave]:hover,
#${DOCK_ID} [data-sve-code-save]:hover {
  opacity: 1;
  background: rgba(255,255,255,.1);
}
#${DOCK_ID} [data-sve-code-autosave][aria-pressed="true"] {
  opacity: 1;
  color: #93c5fd;
  background: rgba(56,88,233,.22);
}
#${DOCK_ID} [data-sve-code-save][data-dirty] {
  opacity: 1;
  color: #93c5fd;
  background: rgba(56,88,233,.22);
}
#${DOCK_ID} [data-sve-code-save][hidden] {
  display: none;
}
#${DOCK_ID}[data-sve-code-locked] [data-sve-code-autosave],
#${DOCK_ID}[data-sve-code-locked] [data-sve-html-scope],
#${DOCK_ID}[data-sve-code-locked] [data-sve-style-mode],
#${DOCK_ID}[data-sve-code-locked] [data-sve-code-history],
#${DOCK_ID}[data-sve-code-locked] [data-sve-code-strip],
#${DOCK_ID}[data-sve-code-locked] [data-sve-code-save] {
  pointer-events: none;
  opacity: .28;
}
#${DOCK_ID}[data-sve-code-locked] [data-sve-css-tools],
#${DOCK_ID}[data-sve-code-locked] [data-sve-css-subrow],
#${DOCK_ID}[data-sve-code-locked] [data-sve-html-tools],
#${DOCK_ID}[data-sve-code-locked] [data-sve-antlers-tools],
#${DOCK_ID}[data-sve-code-locked] [data-sve-visual-edit-tools],
#${DOCK_ID}[data-sve-code-locked] [data-sve-css-add-class] {
  pointer-events: none;
  opacity: .28;
}
#${DOCK_ID}[data-sve-code-locked] [data-sve-code-pane] .cm-editor,
#${DOCK_ID}[data-sve-code-locked] [data-sve-tw-host] {
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
  flex: 0 0 16px;
  height: 16px;
  width: 100%;
  cursor: ns-resize;
  z-index: 3;
  ${splitterFill('ns')}
  background-color: var(--theme-color-gray-800, #27272a);
}
#${DOCK_ID} .sve-code-dock {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  height: 100%;
  min-height: 0;
  overflow: hidden;
}
#${DOCK_ID} [data-sve-code-panes] {
  flex: 1 1 0;
  min-height: 0;
  display: flex;
  overflow: hidden;
}
#${DOCK_ID} [data-sve-code-pane] {
  flex: 1 1 0;
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
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
  min-width: 0;
}
#${DOCK_ID} [data-sve-code-pane-label] > span {
  opacity: .38;
}
#${DOCK_ID} [data-sve-css-add-class] {
  all: unset;
  pointer-events: auto;
  box-sizing: border-box;
  width: 22px;
  height: 22px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  background: rgba(255,255,255,.1);
  color: #d4d4d4;
  cursor: pointer;
  opacity: .75;
  flex: none;
}
#${DOCK_ID} [data-sve-css-add-class]:hover,
#${DOCK_ID} [data-sve-css-add-class][data-open] {
  background: rgba(255,255,255,.16);
  opacity: 1;
}
#${DOCK_ID} [data-sve-css-tools],
#${DOCK_ID} [data-sve-html-tools] {
  pointer-events: auto;
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  gap: 1px;
  min-width: 0;
  overflow-x: auto;
}
#${DOCK_ID} [data-sve-html-tools] {
  flex: 1 1 auto;
}
#${DOCK_ID} [data-sve-antlers-tools],
#${DOCK_ID} [data-sve-visual-edit-tools] {
  pointer-events: auto;
  flex: 0 0 auto;
  align-self: stretch;
  margin: -7px 0;
  padding-right: 8px;
  display: flex;
  align-items: stretch;
}
#${DOCK_ID} [data-sve-antlers-select] {
  box-sizing: border-box;
  max-width: 148px;
  height: auto;
  padding: 0 8px 0 10px;
  border: 0;
  border-left: 1px solid rgba(255,255,255,.06);
  border-radius: 0;
  background: transparent;
  color: #d4d4d4;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0;
  text-transform: none;
  cursor: pointer;
  color-scheme: dark;
}
#${DOCK_ID} [data-sve-antlers-select]:hover,
#${DOCK_ID} [data-sve-antlers-select]:focus-visible {
  background: transparent;
}
#${DOCK_ID} [data-sve-css-chrome] {
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  min-width: 0;
}
#${DOCK_ID} [data-sve-css-subrow] {
  display: none;
  align-items: center;
  padding: 2px 6px;
  border-radius: 6px;
  background: rgba(255,255,255,.12);
  pointer-events: auto;
  min-width: 0;
}
/**
 * Air between the tools themselves, not between a tool's children.
 *
 * A separate rule so the HTML pane's own row, which shares the one above,
 * keeps the spacing it has. The children sit in their own containers inside
 * the pill and keep their 1px.
 */
#${DOCK_ID} [data-sve-css-tools] {
  gap: 3px;
  scrollbar-width: none;
}
#${DOCK_ID} [data-sve-css-tools]::-webkit-scrollbar {
  display: none;
}

/**
 * A tool is one item, and its children live inside that item.
 *
 * The surface belongs to the item, so it wraps the icon and whatever it opens
 * without a single offset: everything stays in flow, nothing is drawn over
 * anything, and opening a group only makes its own item wider.
 */
#${DOCK_ID} [data-sve-css-item] {
  list-style: none;
  display: inline-flex;
  align-items: center;
  /* Same radius as the button's own highlight, so the shape around the icon
     is identical open and closed. */
  border-radius: 4px;
}
/* Only to the right: nothing may move the icon when the group opens. */
#${DOCK_ID} [data-sve-css-item][data-sve-css-open] {
  background: rgba(255,255,255,.12);
}
#${DOCK_ID} [data-sve-css-item][data-sve-css-open] > [data-sve-css-tool][data-open] {
  background: transparent;
}
#${DOCK_ID} [data-sve-css-item] > [data-sve-css-subrow] {
  padding: 0;
  background: transparent;
  border-radius: 0;
}
#${DOCK_ID} [data-sve-css-item] > [data-sve-css-subrow]::before {
  content: '';
  flex: 0 0 auto;
  width: 1px;
  height: 12px;
  margin: 0 6px 0 4px;
  background: rgba(255,255,255,.16);
}
#${DOCK_ID} [data-sve-css-chrome][data-sve-css-sub] [data-sve-css-subrow] {
  display: flex;
}
#${DOCK_ID} [data-sve-css-subrow] > [data-sve-css-sub] {
  display: none;
  align-items: center;
  flex-wrap: wrap;
  gap: 2px;
  min-width: 0;
}
#${DOCK_ID} [data-sve-css-chrome][data-sve-css-sub="padding"] [data-sve-css-sub="box"],
#${DOCK_ID} [data-sve-css-chrome][data-sve-css-sub="margin"] [data-sve-css-sub="box"],
#${DOCK_ID} [data-sve-css-chrome][data-sve-css-sub="display"] [data-sve-css-sub="display"] {
  display: flex;
}
#${DOCK_ID} [data-sve-css-flex-extras] {
  display: none;
  align-items: center;
  flex-wrap: wrap;
  gap: 2px;
}
#${DOCK_ID} [data-sve-css-chrome][data-sve-css-flex-on] [data-sve-css-flex-extras] {
  display: contents;
}
#${DOCK_ID} [data-sve-css-sep] {
  width: 1px;
  height: 12px;
  margin: 0 4px;
  background: rgba(255,255,255,.16);
  flex: 0 0 auto;
}
#${DOCK_ID} [data-sve-css-tool],
#${DOCK_ID} [data-sve-css-box-side],
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
#${DOCK_ID} [data-sve-css-box-side]:hover,
#${DOCK_ID} [data-sve-css-box-side][data-open],
#${DOCK_ID} [data-sve-css-box-side][data-active],
#${DOCK_ID} [data-sve-css-subrow] [data-sve-css-tool]:hover,
#${DOCK_ID} [data-sve-css-subrow] [data-sve-css-tool][data-open],
#${DOCK_ID} [data-sve-css-subrow] [data-sve-css-tool][data-active] {
  background: transparent;
  opacity: 1;
}
/* The hover label lives on the body — see bindTips. A row that scrolls
   would clip anything drawn inside it. */
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
#${CSS_MENU_ID} [data-sve-css-add-label] {
  display: block;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: .04em;
  text-transform: uppercase;
  opacity: .55;
  margin-bottom: 6px;
}
#${CSS_MENU_ID} [data-sve-css-add-input] {
  box-sizing: border-box;
  width: 100%;
  height: 28px;
  padding: 0 8px;
  border: 1px solid rgba(255,255,255,.16);
  border-radius: 4px;
  background: #1E1E21;
  color: #d4d4d4;
  font-size: 12px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
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
#${DOCK_ID} [data-sve-code-split][data-active] {
  filter: brightness(1.15);
}
#${DOCK_ID} [data-sve-code-pane] .cm-editor {
  height: auto !important;
  min-height: 0;
  overflow: visible;
}
#${DOCK_ID} [data-sve-code-pane] .cm-scroller {
  overflow: visible !important;
  height: auto !important;
  min-height: 0 !important;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}
#${DOCK_ID} [data-sve-code-host] {
  flex: 1 1 0;
  min-height: 0;
  overflow: auto;
  overscroll-behavior: contain;
  scrollbar-width: thin;
  scrollbar-color: rgba(255,255,255,.35) transparent;
}
#${DOCK_ID} [data-sve-code-host]::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
#${DOCK_ID} [data-sve-code-host]::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,.28);
  border-radius: 6px;
}
#${DOCK_ID} .sve-cm-css-token {
  background: rgba(215,186,125,.22);
  border-radius: 2px;
}
#${CLASS_RENAME_CHIP_ID} {
  all: unset;
  position: fixed;
  z-index: 90;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 4px;
  background: #3c3c3c;
  color: #d7ba7d;
  border: 1px solid rgba(255,255,255,.16);
  box-shadow: 0 2px 8px rgba(0,0,0,.35);
  cursor: pointer;
}
#${CLASS_RENAME_CHIP_ID}:hover {
  background: #4a4a4a;
}
#${DOCK_ID} .sve-cm-partial {
  text-decoration: underline dotted;
  text-underline-offset: 3px;
  background: rgba(251,191,36,.16);
  cursor: pointer;
}
#${DOCK_ID} .sve-cm-partial-line {
  background: rgba(251,191,36,.12);
}
#${DOCK_ID}[data-sve-code-locked] .sve-cm-partial {
  text-decoration: none;
  background: transparent;
  cursor: default;
  pointer-events: none;
}
#${DOCK_ID}[data-sve-code-locked] .sve-cm-partial-line {
  background: transparent;
}
#${PARTIAL_MENU_ID} {
  position: fixed;
  z-index: 90;
  min-width: 168px;
  max-width: 280px;
  max-height: 240px;
  overflow: auto;
  padding: 6px;
  border-radius: 8px;
  background: #252526;
  color: #d4d4d4;
  border: 1px solid rgba(255,255,255,.12);
  box-shadow: 0 8px 24px rgba(0,0,0,.4);
  font-family: ui-sans-serif, system-ui, sans-serif;
}
#${PARTIAL_MENU_ID} [data-sve-partial-choice] {
  all: unset;
  cursor: pointer;
  display: block;
  width: 100%;
  box-sizing: border-box;
  padding: 5px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
}
#${PARTIAL_MENU_ID} [data-sve-partial-choice]:hover {
  background: rgba(255,255,255,.1);
}
#${PARTIAL_MENU_ID} [data-sve-partial-empty] {
  padding: 6px 8px;
  font-size: 12px;
  opacity: .55;
}
.sve-tw-info {
  font: 11px/1.4 ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  padding: 6px 8px;
  max-width: 320px;
  color: #d4d4d4;
}
.sve-tw-info pre {
  margin: 0;
  white-space: pre-wrap;
  font: inherit;
}
.sve-tw-swatch {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 2px;
  border: 1px solid rgba(255,255,255,.25);
  margin: 0 6px 4px 0;
  vertical-align: middle;
}
.cm-tooltip.sve-tw-complete {
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
}
.cm-tooltip.sve-tw-complete > ul {
  font: inherit !important;
  max-height: 240px;
  padding: 2px 0;
  margin: 0;
}
.cm-tooltip.sve-tw-complete > ul > li {
  padding: 1px 8px 1px 6px !important;
  line-height: 22px !important;
  font: inherit !important;
}
.cm-tooltip.sve-tw-complete > ul > li[aria-selected] {
  background: rgba(255,255,255,.1) !important;
}
.cm-tooltip.sve-tw-complete .cm-completionLabel {
  color: #9cdcfe;
  font-size: 12px !important;
}
.cm-tooltip.sve-tw-complete .cm-completionMatchedText {
  text-decoration: none;
  font-weight: 600;
}
.cm-tooltip.sve-tw-complete .cm-completionDetail {
  display: none;
  color: #808080 !important;
  font-size: 11px !important;
  font-style: normal !important;
  margin-left: 16px;
}
.cm-tooltip.sve-tw-complete > ul > li[aria-selected] .cm-completionDetail {
  display: inline;
}
.cm-tooltip.sve-tw-complete .cm-completionIcon {
  width: 14px;
  height: 14px;
  opacity: .65;
  font-size: 11px !important;
  margin-right: 6px;
}
#${DOCK_ID} .emmet-tracker {
  text-decoration: underline 1px #4ade80;
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
    '__sve-html-tree-panel',
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

function sizeEditorHosts(dock) {
  if (!dock) {
    return;
  }

  const dockH = dock.clientHeight;
  const bar = dock.querySelector('[data-sve-code-bar]');
  const banner = dock.querySelector('[data-sve-code-lock-banner]');
  const bannerH = banner && winOf(dock)?.getComputedStyle(banner).display !== 'none'
    ? banner.offsetHeight
    : 0;
  const panesH = Math.max(64, dockH - (bar?.offsetHeight || 0) - bannerH);
  const panes = dock.querySelector('[data-sve-code-panes]');

  if (panes) {
    panes.style.height = `${panesH}px`;
    panes.style.minHeight = '0';
    panes.style.overflow = 'hidden';
  }

  dock.querySelectorAll('[data-sve-code-host]').forEach((host) => {
    const pane = host.closest('[data-sve-code-pane]');

    if (!pane || pane.style.display === 'none') {
      return;
    }

    let chrome = 0;

    for (const child of pane.children) {
      if (child === host) {
        continue;
      }

      chrome += child.offsetHeight;
    }

    const h = Math.max(64, panesH - chrome);

    host.style.height = `${h}px`;
    host.style.maxHeight = `${h}px`;
    host.style.minHeight = '0';
    host.style.overflow = 'auto';
    bindHostWheel(host);
  });
}

function winOf(el) {
  return el.ownerDocument?.defaultView || lastWin;
}

function bindHostWheel(host) {
  if (host._sveWheelBound) {
    return;
  }

  host._sveWheelBound = true;
  host.addEventListener(
    'wheel',
    (event) => {
      const maxY = host.scrollHeight - host.clientHeight;
      const maxX = host.scrollWidth - host.clientWidth;
      let used = false;

      if (event.deltaY && maxY > 0) {
        const next = Math.min(maxY, Math.max(0, host.scrollTop + event.deltaY));

        if (next !== host.scrollTop) {
          host.scrollTop = next;
          used = true;
        }
      }

      if (event.deltaX && maxX > 0) {
        const next = Math.min(maxX, Math.max(0, host.scrollLeft + event.deltaX));

        if (next !== host.scrollLeft) {
          host.scrollLeft = next;
          used = true;
        }
      }

      if (used) {
        event.preventDefault();
        event.stopPropagation();
      }
    },
    { passive: false }
  );
}

function measureEditors() {
  const dock = (layoutWin || lastWin)?.document?.getElementById(DOCK_ID);

  if (dock) {
    sizeEditorHosts(dock);
  }

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
  sizeEditorHosts(dock);
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
  sizeEditorHosts(dock);
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
    if (event.button !== 0 || event.target.closest('[data-sve-code-pane-btn], [data-sve-code-back], [data-sve-style-mode], [data-sve-code-history], [data-sve-code-strip], [data-sve-html-scope], [data-sve-code-lock], [data-sve-code-autosave], [data-sve-code-save], .cm-editor')) {
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

function paintBack(win) {
  const btn = win?.document?.getElementById(DOCK_ID)?.querySelector('[data-sve-code-back]');

  if (!btn) {
    return;
  }

  btn.hidden = typeStack.length === 0;
  btn.title = t(win, 'code_dock_back');
  btn.setAttribute('aria-label', btn.title);
  btn.innerHTML = BACK_ICON;
}

function bindBack(win, dock) {
  const btn = dock.querySelector('[data-sve-code-back]');

  if (!btn || btn._sveBound) {
    return;
  }

  btn._sveBound = true;
  btn.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    goBackTemplate(win);
  });
}

function currentSectionValues(win) {
  const uid = lastUid;
  const containers = typeof sve.activeContainers === 'function' ? sve.activeContainers(win.document) : [];

  for (const container of containers) {
    const values = sve.unwrapRef?.(container.values) || container.values;

    if (!values || typeof values !== 'object') {
      continue;
    }

    if (uid && typeof sve.findPathByUid === 'function') {
      const path = sve.findPathByUid(values, uid);

      if (path) {
        const parts = path.split('.');
        const section = sve.dataGet?.(values, parts.slice(0, 2).join('.'));

        if (section && typeof section === 'object') {
          return section;
        }
      }
    }
  }

  for (const container of containers) {
    const values = sve.unwrapRef?.(container.values) || container.values;

    if (values && typeof values === 'object') {
      return values;
    }
  }

  return null;
}

function openNestedTemplate(win, type) {
  if (!type || type === lastType) {
    return;
  }

  flushSave(win.document);
  loadTemplate(win, type, 'push');
}

function goBackTemplate(win) {
  const prev = typeStack.pop();

  if (!prev) {
    paintBack(win);

    return;
  }

  flushSave(win.document);
  loadTemplate(win, prev, 'keep');
}

function paintLock(win) {
  const dock = win.document.getElementById(DOCK_ID);
  const btn = dock?.querySelector('[data-sve-code-lock]');
  const banner = dock?.querySelector('[data-sve-code-lock-banner]');

  if (!dock || !btn) {
    return;
  }

  // lockReady only gates the toggle: you cannot lock/unlock until the file
  // has answered. Visual lock follows lastLocked so a locked file never
  // paints unlocked for a frame while that answer is in flight.
  const locked = lastLocked;

  dock.toggleAttribute('data-sve-code-locked', locked);
  if (locked) {
    closePartialMenu(win.document);
    closeClassTokenUi(win.document);
    if (htmlPartialUi) {
      htmlPartialUi.setHover(editors.html, null);
      htmlPartialUi.setHover(editors.css, null);
    }
    htmlClassTokenUi?.setHover(editors.html, null);
  }
  btn.hidden = !lockReady;
  btn.setAttribute('aria-pressed', lastLocked ? 'true' : 'false');
  btn.title = t(win, lastLocked ? 'code_dock_unlock' : 'code_dock_lock');
  btn.setAttribute('aria-label', btn.title);
  btn.innerHTML = lastLocked ? LOCK_CLOSED_ICON : LOCK_OPEN_ICON;

  if (banner) {
    banner.textContent = t(win, 'code_dock_locked_banner');
  }
}

function htmlScopeEnabled(win) {
  if (!win) {
    return htmlScopePref;
  }

  return chromeGet(win, SCOPE_KEY) !== '0';
}

function htmlFocusOk(from, to, length) {
  return from != null && to != null && from >= 0 && to > from && to <= length;
}

function syncScopedHtml() {
  const text = editors.html?.state.doc.toString() ?? '';

  if (!htmlScopeActive || !htmlFocus) {
    htmlFull = text;

    return;
  }

  if (htmlFocus.from < 0 || htmlFocus.from > htmlFull.length || htmlFocus.to < htmlFocus.from) {
    htmlScopeActive = false;
    htmlFull = text;
    htmlFocus = null;

    return;
  }

  htmlFull = htmlFull.slice(0, htmlFocus.from) + text + htmlFull.slice(htmlFocus.to);
  htmlFocus = { from: htmlFocus.from, to: htmlFocus.from + text.length };
}

function currentFullHtml() {
  syncScopedHtml();

  if (htmlScopeActive) {
    return htmlFull;
  }

  return editors.html?.state.doc.toString() ?? lastParts.html ?? '';
}

function rememberBracketNames() {
  lastBracketNames = bracketClassTokens(currentFullHtml()).map((token) => token.name);
}

function rememberCssSelectors() {
  lastCssSelectorNames = cssClassSelectors(editors.css?.state.doc.toString() ?? cssFull);
}

function namesEqual(a, b) {
  return Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((name, i) => name === b[i]);
}

function harvestHtmlTreeCss() {
  const html = htmlScopeActive ? htmlSnippet() : currentFullHtml();
  const tree = tokenTreeFromHtml(html);

  if (!tree.length) {
    return;
  }

  cssFull = mergeScopedCss(cssFull, buildScopedCss(cssFull, tree), tree[0].className);
}

function applyBracketCssSync(prevNames, nextNames) {
  cssFull = syncCssWithBrackets(cssFull, prevNames, nextNames);
  harvestHtmlTreeCss();
  cssFull = pruneBracketCss(cssFull, nextNames, prevNames);
}

function flushBracketSync(win) {
  if (applying || lastLocked || lastBracketNames == null) {
    return;
  }

  const nextNames = bracketClassTokens(currentFullHtml()).map((token) => token.name);

  if (namesEqual(lastBracketNames, nextNames)) {
    return;
  }

  applyBracketCssSync(lastBracketNames, nextNames);
  lastBracketNames = nextNames;
  applyCssScope();
  rememberCssSelectors();
}

function flushCssToHtml() {
  if (applying || lastLocked || lastCssSelectorNames == null || lastBracketNames == null || cssPane === 'empty') {
    return;
  }

  const view = editors.html;
  const nextSelectors = cssClassSelectors(editors.css?.state.doc.toString() ?? '');

  if (!view || namesEqual(lastCssSelectorNames, nextSelectors)) {
    return;
  }

  const owned = new Set(lastBracketNames);
  const { renamed, removed } = diffBracketNames(lastCssSelectorNames, nextSelectors);
  let html = view.state.doc.toString();
  const prevHtml = html;

  for (const pair of renamed) {
    const name = sanitizeCssClassName(pair.to);

    if (!owned.has(pair.from) || !name) {
      continue;
    }

    html = rewriteBracketClassTokens(html, (token) => (token === pair.from ? name : token));
  }

  for (const name of removed) {
    if (!owned.has(name) || nextSelectors.includes(name)) {
      continue;
    }

    html = rewriteBracketClassTokens(html, (token) => (token === name ? '' : token));
  }

  if (html !== prevHtml) {
    applying = true;

    try {
      writeHtmlEditor(html);
    } finally {
      applying = false;
    }
  }

  rememberBracketNames();
  lastCssSelectorNames = nextSelectors;
}

function renameBracketClassAt(token, raw) {
  const name = sanitizeCssClassName(raw);
  const view = editors.html;

  if (!name || !view || view.state.readOnly || name === token.name) {
    return;
  }

  applying = true;

  try {
    view.dispatch({
      changes: { from: token.from, to: token.to, insert: name },
    });
  } finally {
    applying = false;
  }

  const prev = lastBracketNames == null ? [] : lastBracketNames.slice();

  rememberBracketNames();
  applyBracketCssSync(prev, lastBracketNames);
  applyCssScope();
  rememberCssSelectors();

  if (lastWin) {
    onEditorInput(lastWin);
    paintCssToolState(lastWin);
  }
}

function openRenameClassMenu(win, token) {
  const doc = win.document;
  const view = editors.html;
  const coords = view?.coordsAtPos(token.from);

  closeCssMenu(doc);
  closeClassTokenUi(doc);

  const menu = doc.createElement('div');
  const anchor = {
    getBoundingClientRect: () => ({
      left: coords?.left ?? 12,
      right: coords?.right ?? 12,
      top: coords?.top ?? 12,
      bottom: coords?.bottom ?? 12,
      width: 0,
      height: 0,
    }),
  };

  menu.id = CSS_MENU_ID;
  doc.body.appendChild(menu);
  placeCssMenu(win, anchor, menu);
  menu._sveApp = mountSurface(CodeDockAddClass, menu, {
    label: t(win, 'code_dock_css_rename_class'),
    placeholder: t(win, 'code_dock_css_class_placeholder'),
    initial: token.name,
    onAdd: (value) => {
      renameBracketClassAt(token, value);
      closeCssMenu(doc);
    },
  });
}

function htmlEditorText() {
  if (htmlScopePref && htmlFocusOk(htmlFocus?.from, htmlFocus?.to, htmlFull.length)) {
    htmlScopeActive = true;

    return htmlFull.slice(htmlFocus.from, htmlFocus.to);
  }

  htmlScopeActive = false;

  return htmlFull;
}

function writeHandleEditor(handle, text, selection) {
  const view = editors[handle];

  if (!view) {
    return;
  }

  const current = view.state.doc.toString();

  applying = true;

  try {
    if (current !== text) {
      view.dispatch({
        changes: { from: 0, to: current.length, insert: text },
        ...(selection ? { selection, scrollIntoView: true } : {}),
      });
    } else if (selection) {
      view.dispatch({
        selection,
        scrollIntoView: true,
      });
    }
  } finally {
    applying = false;
  }
}

function writeHtmlEditor(text, selection) {
  writeHandleEditor('html', text, selection);
}

function htmlSnippet() {
  if (htmlScopeActive) {
    return editors.html?.state.doc.toString() ?? '';
  }

  if (htmlFocusOk(htmlFocus?.from, htmlFocus?.to, htmlFull.length)) {
    return htmlFull.slice(htmlFocus.from, htmlFocus.to);
  }

  return '';
}

function flushCssScope() {
  const current = editors.css?.state.doc.toString() ?? '';

  if (cssPane === 'tree') {
    if (current === cssScopeSnapshot) {
      return;
    }

    const root =
      tokenTreeFromHtml(htmlSnippet())[0]?.className || firstClassName(current);

    cssFull = mergeScopedCss(cssFull, current, root);
    cssScopeSnapshot = current;
  } else if (cssPane === 'full') {
    cssFull = current;
  }
}

function tokenTreeNeedsCss(css, nodes) {
  for (const node of nodes || []) {
    if (!findClassRule(css, node.className) || tokenTreeNeedsCss(css, node.children)) {
      return true;
    }
  }

  return false;
}

function applyCssScope() {
  let text = cssFull;
  let tree = [];
  let created = false;

  if (!htmlScopePref || !htmlScopeActive) {
    cssPane = 'full';
    text = cssFull;
  } else {
    tree = tokenTreeFromHtml(htmlSnippet());

    if (!tree.length) {
      cssPane = 'empty';
      text = '';
    } else {
      cssPane = 'tree';
      text = buildScopedCss(cssFull, tree);

      if (tokenTreeNeedsCss(cssFull, tree)) {
        cssFull = mergeScopedCss(cssFull, text, tree[0].className);
        created = true;
      }
    }
  }

  cssScopeSnapshot = text;
  writeHandleEditor('css', text);
  rememberCssSelectors();

  if (lastWin) {
    paintCssToolState(lastWin);

    if (created) {
      onEditorInput(lastWin);
    }
  }
}

function showHtmlScope() {
  const view = editors.html;

  if (!view || !htmlFocus) {
    return;
  }

  if (!htmlScopeActive) {
    htmlFull = view.state.doc.toString();
  }

  const length = htmlFull.length;
  const from = Math.max(0, Math.min(htmlFocus.from, length));
  const to = Math.max(from, Math.min(htmlFocus.to, length));

  if (to <= from) {
    return;
  }

  htmlFocus = { from, to };
  htmlScopeActive = true;
  writeHtmlEditor(htmlFull.slice(from, to), { anchor: 0, head: 0 });
  applyCssScope();
  view.focus();
}

function showHtmlFull(selectFocus = true) {
  const view = editors.html;

  if (!view) {
    return;
  }

  flushCssScope();
  syncScopedHtml();
  htmlScopeActive = false;

  const full = htmlFull || view.state.doc.toString();
  const selection =
    selectFocus && htmlFocusOk(htmlFocus?.from, htmlFocus?.to, full.length)
      ? { anchor: htmlFocus.from, head: htmlFocus.to }
      : null;

  htmlFull = full;
  writeHtmlEditor(full, selection);
  cssPane = 'full';
  cssScopeSnapshot = cssFull;
  writeHandleEditor('css', cssFull);
  rememberCssSelectors();
}

function clearHtmlScopeRange() {
  htmlFocus = null;
  htmlScopeActive = false;
  htmlFull = '';
  cssFull = '';
  cssPane = 'full';
  cssScopeSnapshot = '';
  lastBracketNames = null;
  lastCssSelectorNames = null;
}

/**
 * The button stands for the HTML tree as well as the scoping it drives.
 *
 * The two belong together: scoping the panes to one element, with no tree to
 * pick that element in, is a setting pointing at nothing. So pressing it opens
 * the tree and unpressing it puts the tree away.
 *
 * Only ever asked when the site has the tree switched on at all.
 */
let treeOpening = false;

function htmlTreeOpen(win) {
  return !!win?.document.getElementById(sve.HTML_TREE_PANEL_ID);
}

function syncHtmlTree(win, open) {
  if (!win || sve.featureOn?.(win, 'html_tree') === false) {
    return;
  }

  if (!open) {
    if (htmlTreeOpen(win)) {
      sve.closeHtmlTreePanel?.(win);
    }

    return;
  }

  if (htmlTreeOpen(win)) {
    return;
  }

  // The tree is one of the lazily loaded panels, so it may not be here yet.
  // While that is in flight the panel is legitimately absent, and the watcher
  // below must not read that as the reader having closed it.
  treeOpening = true;

  void ensurePanel('html_tree')
    .then(() => {
      if (!htmlTreeOpen(win)) {
        sve.toggleHtmlTreePanel?.(win);
      }
    })
    .catch(() => {
      /* the tree is not available on this site */
    })
    .finally(() => {
      treeOpening = false;
      paintHtmlScope(win);
    });
}

function paintHtmlScope(win) {
  const btn = win?.document.getElementById(DOCK_ID)?.querySelector('[data-sve-html-scope]');

  if (!btn) {
    return;
  }

  htmlScopePref = htmlScopeEnabled(win);

  // Pressed means the tree is on screen. Reading the panel rather than the
  // stored setting is what keeps the two from drifting: the tree can also be
  // closed from its own ✕, or pushed aside when another pane takes the dock,
  // and neither of those comes through this button.
  const shown = sve.featureOn?.(win, 'html_tree') === false
    ? htmlScopePref
    : (htmlTreeOpen(win) || treeOpening);

  btn.setAttribute('aria-pressed', shown ? 'true' : 'false');
  btn.title = t(win, shown ? 'code_dock_html_scope_off' : 'code_dock_html_scope');
  btn.setAttribute('aria-label', btn.title);
  btn.innerHTML = SCOPE_ICON;
  win.document.getElementById(DOCK_ID)?.toggleAttribute('data-sve-html-scoped', htmlScopeActive);
}

function bindHtmlScope(win, dock) {
  if (dock._sveHtmlScopeBound) {
    return;
  }

  dock._sveHtmlScopeBound = true;
  htmlScopePref = htmlScopeEnabled(win);
  bindHtmlTreeWatch(win, dock);

  // The dock has just opened: put the tree where the remembered setting says.
  // On a fresh install that is on.
  syncHtmlTree(win, htmlScopePref);

  dock.querySelector('[data-sve-html-scope]')?.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();

    // From what is on screen, not from what was last stored — otherwise a tree
    // closed by its own ✕ needs two clicks to come back.
    const shown = htmlTreeOpen(win) || treeOpening;

    htmlScopePref = !shown;
    chromeSet(win, SCOPE_KEY, htmlScopePref ? '1' : '0');

    if (htmlScopePref) {
      if (htmlFocus) {
        flushCssScope();
        showHtmlScope();
      }
    } else if (htmlScopeActive) {
      showHtmlFull();
    }

    syncHtmlTree(win, htmlScopePref);
    paintHtmlScope(win);
  });
}

/**
 * Keep the button and the tree in step when the tree changes without it.
 *
 * The panel has its own ✕, and another pane taking the right dock puts it away
 * too. Neither goes through this button, so both used to leave it lit with
 * nothing behind it — and the panes still narrowed to a tag the reader could no
 * longer see in a tree.
 */
function bindHtmlTreeWatch(win, dock) {
  if (dock._sveTreeWatchBound) {
    return;
  }

  dock._sveTreeWatchBound = true;

  win.addEventListener('sve-right-dock-change', () => {
    if (treeOpening || sve.featureOn?.(win, 'html_tree') === false) {
      return;
    }

    if (!win.document.getElementById(DOCK_ID)) {
      return;
    }

    const shown = htmlTreeOpen(win);

    if (shown === htmlScopeEnabled(win)) {
      return;
    }

    htmlScopePref = shown;
    chromeSet(win, SCOPE_KEY, shown ? '1' : '0');

    if (shown) {
      if (htmlFocus) {
        flushCssScope();
        showHtmlScope();
      }
    } else if (htmlScopeActive) {
      showHtmlFull();
    }

    paintHtmlScope(win);
  });
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

function autosaveEnabled(win) {
  if (!win) {
    return true;
  }

  return chromeGet(win, AUTOSAVE_KEY) !== '0';
}

function dockIsDirty() {
  const view = editors.html;

  if (!view || view.state.readOnly || !lastType) {
    return false;
  }

  return !sameParts(readParts(), lastParts);
}

function paintAutosave(win) {
  const dock = win?.document.getElementById(DOCK_ID);
  const autoBtn = dock?.querySelector('[data-sve-code-autosave]');
  const saveBtn = dock?.querySelector('[data-sve-code-save]');

  if (!autoBtn || !saveBtn) {
    return;
  }

  const on = autosaveEnabled(win);
  const dirty = dockIsDirty();

  autoBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
  autoBtn.title = t(win, on ? 'code_dock_autosave_on' : 'code_dock_autosave_off');
  autoBtn.setAttribute('aria-label', autoBtn.title);
  autoBtn.innerHTML = AUTOSAVE_ICON;

  saveBtn.hidden = on;
  saveBtn.title = t(win, 'code_dock_save');
  saveBtn.setAttribute('aria-label', saveBtn.title);
  saveBtn.innerHTML = SAVE_ICON;

  if (dirty) {
    saveBtn.setAttribute('data-dirty', '');
  } else {
    saveBtn.removeAttribute('data-dirty');
  }
}

function bindAutosave(win, dock) {
  if (dock._sveAutosaveBound) {
    return;
  }

  dock._sveAutosaveBound = true;

  dock.querySelector('[data-sve-code-autosave]')?.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();

    const next = !autosaveEnabled(win);

    chromeSet(win, AUTOSAVE_KEY, next ? '1' : '0');

    if (next) {
      flushSave(win.document);
    } else if (saveTimer) {
      clearTimeout(saveTimer);
      saveTimer = null;
    }

    paintAutosave(win);
  });

  dock.querySelector('[data-sve-code-save]')?.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    flushSave(win.document);
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
        paintLock(win);
        writeParts(lastParts, locked);
        paintHtmlScope(win);
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

  syncScopedHtml();
  flushCssScope();

  for (const handle of HANDLES) {
    if (handle === 'html') {
      parts.html = htmlScopeActive ? htmlFull : (editors.html?.state.doc.toString() ?? '');
    } else if (handle === 'css') {
      parts.css = cssFull;
    } else {
      parts[handle] = editors[handle]?.state.doc.toString() ?? '';
    }
  }

  return parts;
}

function cssEditorText() {
  if (!(htmlScopePref && htmlFocusOk(htmlFocus?.from, htmlFocus?.to, htmlFull.length))) {
    cssPane = 'full';
    cssScopeSnapshot = cssFull;

    return cssFull;
  }

  const tree = tokenTreeFromHtml(htmlFull.slice(htmlFocus.from, htmlFocus.to));

  if (!tree.length) {
    cssPane = 'empty';
    cssScopeSnapshot = '';

    return '';
  }

  cssPane = 'tree';

  const text = buildScopedCss(cssFull, tree);

  cssScopeSnapshot = text;

  return text;
}

function writeParts(parts, disabled) {
  applying = true;

  try {
    if (lastWin) {
      htmlScopePref = htmlScopeEnabled(lastWin);
    }

    htmlFull = parts.html ?? '';
    cssFull = parts.css ?? '';

    for (const handle of HANDLES) {
      const view = editors[handle];
      let text = parts[handle] ?? '';

      try {
        text = handle === 'html' ? htmlEditorText() : handle === 'css' ? cssEditorText() : text;
      } catch {
        text =
          handle === 'html'
            ? htmlFull || parts.html || ''
            : handle === 'css'
              ? cssFull || parts.css || ''
              : text;
      }

      if (!view) {
        continue;
      }

      const current = view.state.doc.toString();
      const effects = [
        readOnlyOf[handle].reconfigure(EditorState.readOnly.of(!!disabled)),
        editableOf[handle].reconfigure(EditorView.editable.of(!disabled)),
      ];

      if (current !== text) {
        view.dispatch({
          changes: { from: 0, to: current.length, insert: text },
          effects,
        });
      } else {
        view.dispatch({ effects });
      }
    }
  } finally {
    applying = false;
  }

  rememberBracketNames();
  rememberCssSelectors();
  emit('dock:html-changed');

  if (lastWin) {
    paintCssToolState(lastWin);
    paintHtmlToolState(lastWin);
    paintHtmlScope(lastWin);
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

function isCssBoxProperty(prop, prefix) {
  return prop === prefix || prop.startsWith(`${prefix}-`);
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
  const stack = [];
  const blocks = [];

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
      stack.push(i);
    } else if (text[i] === '}') {
      const open = stack.pop();

      if (open != null) {
        blocks.push({ from: open + 1, to: i, text: text.slice(open + 1, i), open });
      }
    }
  }

  let inner = null;

  for (const block of blocks) {
    if (pos < block.open || pos > block.to) {
      continue;
    }

    if (!inner || block.to - block.open < inner.to - inner.open) {
      inner = block;
    }
  }

  return inner;
}

function cssFlatDecls(text) {
  const chunk = String(text || '');
  let out = '';
  let depth = 0;

  for (let i = 0; i < chunk.length; i += 1) {
    if (chunk[i] === '{' && chunk[i + 1] === '{') {
      const end = chunk.indexOf('}}', i + 2);

      if (end === -1) {
        break;
      }

      if (depth === 0) {
        out += chunk.slice(i, end + 2);
      }

      i = end + 1;
      continue;
    }

    if (chunk[i] === '{') {
      depth += 1;
      continue;
    }

    if (chunk[i] === '}') {
      depth = Math.max(0, depth - 1);
      continue;
    }

    if (depth === 0) {
      out += chunk[i];
    }
  }

  return out;
}

function parseCssDecls(block) {
  const out = {};

  for (const part of cssFlatDecls(block).split(';')) {
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
  let depth = 0;

  while (line.from <= rule.to) {
    const from = Math.max(line.from, rule.from);
    const to = Math.min(line.to, rule.to);
    const text = view.state.doc.sliceString(from, to);

    if (depth === 0 && cssPropertyOf(text) === property) {
      return { from, to, text };
    }

    depth += cssBraceDelta(text);

    if (line.to >= view.state.doc.length || line.to >= rule.to) {
      break;
    }

    line = view.state.doc.lineAt(line.to + 1);
  }

  return null;
}

function cssBraceDelta(text) {
  let delta = 0;
  const chunk = String(text);

  for (let i = 0; i < chunk.length; i += 1) {
    if (chunk[i] === '{' && chunk[i + 1] === '{') {
      const end = chunk.indexOf('}}', i + 2);

      i = end === -1 ? chunk.length : end + 1;
      continue;
    }

    if (chunk[i] === '{') {
      delta += 1;
    } else if (chunk[i] === '}') {
      delta -= 1;
    }
  }

  return delta;
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

function applyDisplay(value) {
  const decls = currentFlexDecls();

  if (value === 'flex' && isFlexDisplay(decls.display)) {
    applyRuleDecls([
      { property: 'justify-content', value: null },
      { property: 'align-items', value: null },
      { property: 'flex-direction', value: null },
      { property: 'display', value: null },
    ]);

    return;
  }

  applyRuleDecls([{ property: 'display', value }]);
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

  if (dock) {
    placeCssSubrow(dock);
  }

  if (styleMode === 'tw') {
    if (dock) {
      paintTwToolState(win, dock);
    }

    return;
  }

  const decls = currentFlexDecls();
  const flexOn = isFlexDisplay(decls.display);
  const flexDir = normalizeFlexValue(decls['flex-direction']) || (flexOn ? 'row' : '');
  const host = dock?.querySelector('[data-sve-css-tools]');
  const chrome = dock?.querySelector('[data-sve-css-chrome]');
  const sub = chrome?.getAttribute('data-sve-css-sub') || '';
  const boxPrefix = sub === 'padding' || sub === 'margin' ? sub : '';

  if (!dock) {
    return;
  }

  if (chrome) {
    if (flexOn) {
      chrome.setAttribute('data-sve-css-flex-on', '');
    } else {
      chrome.removeAttribute('data-sve-css-flex-on');
    }
  }

  if (host) {
    if (flexOn) {
      host.setAttribute('data-sve-css-flex-on', '');
    } else {
      host.removeAttribute('data-sve-css-flex-on');
    }
  }

  for (const tool of [...CSS_TOOLS, ...CSS_DISPLAY_ITEMS]) {
    const btn = dock.querySelector(`[data-sve-css-tool="${tool.id}"]`);

    if (!btn) {
      continue;
    }

    let on = false;

    if (tool.flexDir) {
      on = flexOn && flexDir === tool.flexDir;
    } else if (tool.display) {
      on = tool.display === 'flex' ? flexOn : normalizeFlexValue(decls.display) === tool.display;
    } else if (tool.insert) {
      const property = cssPropertyOf(tool.insert);

      on = Boolean(property) && normalizeFlexValue(decls[property]) === normalizeFlexValue(cssValueOf(tool.insert));
    } else if (tool.menu === 'box') {
      on = Object.keys(decls).some((key) => isCssBoxProperty(key, tool.property));

      if (sub === tool.property) {
        btn.setAttribute('data-open', '');
      } else {
        btn.removeAttribute('data-open');
      }
    } else if (tool.menu === 'display') {
      on = Boolean(decls.display);

      if (sub === 'display') {
        btn.setAttribute('data-open', '');
      } else {
        btn.removeAttribute('data-open');
      }
    } else if (tool.property) {
      on = tool.property in decls;
    }

    if (on) {
      btn.setAttribute('data-active', '');
    } else {
      btn.removeAttribute('data-active');
    }
  }

  for (const side of CSS_BOX_SIDES) {
    const btn = dock.querySelector(`[data-sve-css-box-side="${side.suffix}"]`);

    if (!btn) {
      continue;
    }

    const on = Boolean(boxPrefix) && `${boxPrefix}${side.suffix}` in decls;

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
  doc?.querySelectorAll('[data-sve-css-tool][data-open], [data-sve-css-box-side][data-open], [data-sve-html-tool][data-open], [data-sve-css-add-class][data-open], [data-sve-code-history][data-open]').forEach((el) =>
    el.removeAttribute('data-open')
  );
}

/** Close CSS/HTML tool menus and CodeMirror suggestions — they sit above Statamic pickers. */
export function closeCodeDockPopups(doc) {
  closeCssMenu(doc);
  closeClassTokenUi(doc);

  for (const handle of HANDLES) {
    if (editors[handle]) {
      closeCompletion?.(editors[handle]);
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
  const value = currentFlexDecls()[property] || '';
  const match = String(value).match(/^var\(\s*([^)]+?)\s*\)$/i);
  const token = match ? match[1].trim() : '';

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
        applyRuleDecls([{ property, value: null }]);
        closeCssMenu(doc);
      },
      onPick: (name) => {
        applyRuleDecls([{ property, value: `var(${name})` }]);
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
      applyRuleDecls([{ property, value: `var(${token})` }]);
      closeCssMenu(doc);
    },
  });
  markCssMenuActive(menu, property);
}

/**
 * Put the open tool's children next to the tool, inside its own highlight.
 *
 * The row is a strip of icons and the children belong to one of them, so a
 * second line left the reader guessing which. Moved, not rebuilt: the box and
 * display rows are Vue apps mounted inside this node, and recreating it would
 * throw them away. When nothing is open it goes back to the label, out of the
 * way of the tool row's own remount.
 */
function placeCssSubrow(dock) {
  const chrome = cssChrome(dock);
  const subrow = chrome?.querySelector('[data-sve-css-subrow]');

  if (!chrome || !subrow) {
    return;
  }

  chrome
    .querySelectorAll('[data-sve-css-item][data-sve-css-open]')
    .forEach((el) => el.removeAttribute('data-sve-css-open'));

  const open = chrome.getAttribute('data-sve-css-sub') || '';
  const item = open ? chrome.querySelector(`[data-sve-css-item="${open}"]`) : null;

  if (item) {
    if (subrow.parentElement !== item) {
      item.appendChild(subrow);
    }

    item.setAttribute('data-sve-css-open', '');

    return;
  }

  const label = chrome.querySelector('[data-sve-code-pane-label]');

  if (label && subrow.parentElement !== label) {
    label.appendChild(subrow);
  }
}

function cssChrome(dock) {
  return dock?.querySelector('[data-sve-css-chrome]');
}

function toggleCssSubrow(win, mode) {
  const dock = win.document.getElementById(DOCK_ID);
  const chrome = cssChrome(dock);

  closeCssMenu(win.document);

  if (!chrome) {
    return;
  }

  if (chrome.getAttribute('data-sve-css-sub') === mode) {
    chrome.removeAttribute('data-sve-css-sub');
  } else {
    chrome.setAttribute('data-sve-css-sub', mode);
  }

  paintCssToolState(win);
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

    if (tag?.kind === 'open' || tag?.kind === 'void') {
      const close = tag.kind === 'void' ? null : findHtmlClose(text, tag.name, tag.to);

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

function addCssClassName(raw) {
  const name = sanitizeCssClassName(raw);
  const htmlView = editors.html;
  const cssView = editors.css;

  if (!name || htmlView?.state.readOnly || cssView?.state.readOnly) {
    return;
  }

  const el = htmlElementAtCursor();

  if (el?.open && htmlView) {
    const open = htmlView.state.doc.sliceString(el.open.from, el.open.to);
    const next = applyBracketClass(open, name);

    if (next !== open) {
      htmlView.dispatch({
        changes: { from: el.open.from, to: el.open.to, insert: next },
      });
    }
  }

  flushCssScope();

  if (!findClassRule(cssFull, name)) {
    cssFull = `${String(cssFull || '').trimEnd()}${cssFull?.trim() ? '\n' : ''}.${name} {\n}\n`;
  }

  applyCssScope();
  rememberBracketNames();
  rememberCssSelectors();

  if (lastWin) {
    onEditorInput(lastWin);
    paintHtmlToolState(lastWin);
    paintCssToolState(lastWin);
  }
}

function openAddClassMenu(win, anchor) {
  const doc = win.document;

  if (anchor.hasAttribute('data-open')) {
    closeCssMenu(doc);

    return;
  }

  closeCssMenu(doc);
  anchor.setAttribute('data-open', '');

  const menu = doc.createElement('div');

  menu.id = CSS_MENU_ID;
  doc.body.appendChild(menu);
  placeCssMenu(win, anchor, menu);
  menu._sveApp = mountSurface(CodeDockAddClass, menu, {
    label: t(win, 'code_dock_css_class_name'),
    placeholder: t(win, 'code_dock_css_class_placeholder'),
    onAdd: (value) => {
      addCssClassName(value);
      closeCssMenu(doc);
    },
  });
}

function bindCssAddClass(win, dock) {
  const btn = dock.querySelector('[data-sve-css-add-class]');

  if (!btn || btn._sveBound) {
    return;
  }

  btn._sveBound = true;
  btn.innerHTML = CSS_ADD_ICON;
  btn.title = t(win, 'code_dock_css_add_class');
  btn.setAttribute('aria-label', btn.title);
  btn.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (styleMode === 'tw') {
      closeCssMenu(win.document);
      twOpenAddMenu(win, btn);

      return;
    }

    openAddClassMenu(win, btn);
  });
}

/**
 * "20 minutes ago · 23:41" — the browser's own wording for the first half, so
 * the list reads in the reader's language without a string to translate.
 */
function historyLabel(at) {
  const seconds = Math.max(0, Math.round(Date.now() / 1000 - at));
  const clock = new Date(at * 1000).toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });
  let relative = clock;

  try {
    const format = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });

    if (seconds < 90) {
      relative = format.format(-seconds, 'second');
    } else if (seconds < 5400) {
      relative = format.format(-Math.round(seconds / 60), 'minute');
    } else if (seconds < 86400) {
      relative = format.format(-Math.round(seconds / 3600), 'hour');
    } else {
      relative = format.format(-Math.round(seconds / 86400), 'day');
    }
  } catch {
    /* the clock time on its own will do */
  }

  return `${relative} · ${clock}`;
}

function sveFetch(win, url) {
  return win.fetch(url, {
    credentials: 'same-origin',
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
  });
}

async function openHistoryMenu(win, anchor) {
  const doc = win.document;
  const type = currentTemplateType();

  closeCssMenu(doc);

  if (!type) {
    return;
  }

  let entries = [];

  try {
    const res = await sveFetch(win, `/!/sve/section-template/history?type=${encodeURIComponent(type)}`);

    if (res.ok) {
      entries = (await res.json())?.entries || [];
    }
  } catch {
    entries = [];
  }

  // The dock can be gone by the time the list arrives.
  if (!doc.getElementById(DOCK_ID) || !doc.contains(anchor)) {
    return;
  }

  anchor.setAttribute('data-open', '');

  const menu = doc.createElement('div');

  menu.id = CSS_MENU_ID;
  doc.body.appendChild(menu);
  placeCssMenu(win, anchor, menu);
  menu._sveApp = mountSurface(CodeDockMenu, menu, {
    kind: 'choices',
    choices: entries.length
      ? entries.map((entry) => ({ value: entry.id, label: historyLabel(entry.at) }))
      : [{ value: '', label: t(win, 'code_dock_history_empty') }],
    onPick: (id) => {
      closeCssMenu(doc);

      if (id) {
        void restoreVersion(win, type, id);
      }
    },
  });
}

/**
 * Put an earlier version back.
 *
 * Through the same door as a keystroke: the panes are written, the dock saves
 * and Live Preview re-renders — and because it lands in the editor's own undo
 * history, a restore you did not mean is one Cmd+Z away.
 */
async function restoreVersion(win, type, id) {
  if (isCodeDockLocked()) {
    return;
  }

  let parts = null;

  try {
    const res = await sveFetch(
      win,
      `/!/sve/section-template/history/entry?type=${encodeURIComponent(type)}&id=${encodeURIComponent(id)}`
    );

    if (res.ok) {
      parts = await res.json();
    }
  } catch {
    parts = null;
  }

  if (!parts || isCodeDockLocked()) {
    return;
  }

  writeParts(
    { html: parts.html ?? '', css: parts.css ?? '', js: parts.js ?? '' },
    lastLocked
  );
  onEditorInput(win);
  syncTwTarget(win);
}

/** The class strip over the preview: on, off, and remembered. */
function paintStrip(win) {
  const btn = win?.document.getElementById(DOCK_ID)?.querySelector('[data-sve-code-strip]');

  if (!btn) {
    return;
  }

  const on = twOverlayOn(win);

  btn.innerHTML = STRIP_ICON;
  btn.title = t(win, on ? 'tw_strip_on' : 'tw_strip_off');
  btn.setAttribute('aria-label', btn.title);
  btn.setAttribute('aria-pressed', on ? 'true' : 'false');
}

function bindStrip(win, dock) {
  const btn = dock.querySelector('[data-sve-code-strip]');

  if (!btn || btn._sveBound) {
    return;
  }

  btn._sveBound = true;
  btn.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    setTwOverlayOn(win, !twOverlayOn(win));
    paintStrip(win);
    twRepaintOverlay(win);
  });
  paintStrip(win);
}

function bindHistory(win, dock) {
  const btn = dock.querySelector('[data-sve-code-history]');

  if (!btn || btn._sveBound) {
    return;
  }

  btn._sveBound = true;
  btn.innerHTML = HISTORY_ICON;
  btn.title = t(win, 'code_dock_history');
  btn.setAttribute('aria-label', btn.title);
  btn.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (btn.hasAttribute('data-open')) {
      closeCssMenu(win.document);

      return;
    }

    void openHistoryMenu(win, btn);
  });
}

export function codeDockStyleMode() {
  return styleMode;
}

/**
 * The tag the Tailwind row acts on: the one the HTML cursor is inside.
 *
 * Same rule as CSS mode, one pane over — there it is the rule under the
 * cursor, here it is the tag. Clicking a row in the tree, or an element in
 * the preview, moves that cursor, so all three ways of picking end up in the
 * same place instead of fighting each other.
 */
function twTargetFromCursor(win) {
  const view = editors.html;

  if (!view || styleMode !== 'tw') {
    return null;
  }

  const scoped = htmlScopeActive && !!htmlFocus;
  const html = scoped ? htmlFull : view.state.doc.toString();
  const offset = scoped ? htmlFocus.from : 0;
  const pos = offset + view.state.selection.main.from;
  const rows = flattenHtmlTree(parseHtmlTree(html), new Set());
  let found = null;

  // Pre-order, and a child always sits inside its parent's range, so the last
  // row that still contains the cursor is the innermost tag.
  for (const row of rows) {
    if (row.from <= pos && pos < row.to) {
      found = row;
    }
  }

  return found;
}

function syncTwTarget(win) {
  if (styleMode !== 'tw') {
    return;
  }

  renderTwClasses(win, twTargetFromCursor(win));
}

function paintStyleMode(win) {
  const dock = win?.document.getElementById(DOCK_ID);

  if (!dock) {
    return;
  }

  const tw = styleMode === 'tw';

  dock.setAttribute('data-sve-style', styleMode);

  const label = dock.querySelector('[data-sve-css-label]');

  if (label) {
    label.textContent = tw ? t(win, 'code_dock_style_tw') : t(win, 'code_dock_css');
  }

  const btn = dock.querySelector('[data-sve-style-mode]');

  if (!btn) {
    return;
  }

  const text = win.document.createElement('span');

  text.textContent = tw ? t(win, 'code_dock_style_tw') : t(win, 'code_dock_css');
  btn.innerHTML = tw ? TW_MODE_ICON : CSS_MODE_ICON;
  btn.appendChild(text);
  btn.title = t(win, tw ? 'code_dock_style_to_css' : 'code_dock_style_to_tw');
  btn.setAttribute('aria-label', btn.title);
  btn.setAttribute('aria-pressed', tw ? 'true' : 'false');
}

/**
 * Tailwind mode points at the tag picked in the HTML tree, so the tree has to
 * be on screen — an icon row aimed at nothing is the same trap the scope
 * button already avoids.
 */
function applyStyleMode(win) {
  const dock = win?.document.getElementById(DOCK_ID);

  closeCssMenu(win.document);
  closeTwMenu(win);
  cssChrome(dock)?.removeAttribute('data-sve-css-sub');
  paintStyleMode(win);
  cssToolRow?.();

  if (styleMode === 'tw') {
    // Open it the way the tree button does, setting included. Opening it
    // behind the setting's back left the tree on screen with scoping off,
    // and then a click in it only selected the code instead of narrowing
    // the pane to that tag.
    htmlScopePref = true;
    chromeSet(win, SCOPE_KEY, '1');
    syncHtmlTree(win, true);
  }

  syncTwTarget(win);
  paintCssToolState(win);
}

function setStyleMode(win, mode) {
  styleMode = mode === 'tw' ? 'tw' : 'css';
  chromeSet(win, STYLE_MODE_KEY, styleMode);
  applyStyleMode(win);
}

function bindStyleMode(win, dock) {
  if (dock._sveStyleModeBound) {
    return;
  }

  dock._sveStyleModeBound = true;
  styleMode = chromeGet(win, STYLE_MODE_KEY) === 'tw' ? 'tw' : 'css';

  dock.querySelector('[data-sve-style-mode]')?.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    setStyleMode(win, styleMode === 'tw' ? 'css' : 'tw');
  });

  applyStyleMode(win);
}

/** The same click, answered in classes instead of declarations. */
function runTwTool(win, dock, id, btn) {
  const display = TW_DISPLAY_CLASS[id];

  if (display) {
    closeTwMenu(win);
    twSetClass(win, display);
    paintCssToolState(win);

    return;
  }

  const property = TW_TOOL_PROPERTY[id];

  if (!property || !btn) {
    return;
  }

  // A group of values for one property reads as a list of names, not as a
  // strip of pictures. What belongs to the chosen value — a flex container's
  // direction and alignment — stays as icons, and follows the choice.
  if (id === 'display') {
    cssChrome(dock)?.removeAttribute('data-sve-css-sub');
    twOpenToolMenu(win, btn, 'display', (label) => {
      const chrome = cssChrome(dock);

      if (label === 'flex' || label === 'inline-flex' || label === 'grid') {
        chrome?.setAttribute('data-sve-css-sub', 'display');
      } else {
        chrome?.removeAttribute('data-sve-css-sub');
      }

      paintCssToolState(win);
    });

    return;
  }


  if (id === 'padding' || id === 'margin') {
    closeTwMenu(win);
    toggleCssSubrow(win, property);

    return;
  }

  cssChrome(dock)?.removeAttribute('data-sve-css-sub');
  twOpenToolMenu(win, btn, property);
}

/** The CSS property one of the display row's classes sets. */
function propertyOfTwClass(name) {
  if (name === 'flex') {
    return 'display';
  }

  if (name.startsWith('justify-')) {
    return 'justify-content';
  }

  if (name.startsWith('items-')) {
    return 'align-items';
  }

  return 'flex-direction';
}

function paintTwToolState(win, dock) {
  const chrome = dock.querySelector('[data-sve-css-chrome]');
  const sub = chrome?.getAttribute('data-sve-css-sub') || '';
  const boxPrefix = sub === 'padding' || sub === 'margin' ? sub : '';

  // The justify and align buttons only mean something once the tag is a flex
  // container, which is the same rule the CSS side follows.
  const display = twHasNode() ? twActiveClass('display') : '';
  const flexOn = display === 'flex' || display === 'inline-flex' || display === 'grid';

  for (const el of [chrome, dock.querySelector('[data-sve-css-tools]')]) {
    if (!el) {
      continue;
    }

    if (flexOn) {
      el.setAttribute('data-sve-css-flex-on', '');
    } else {
      el.removeAttribute('data-sve-css-flex-on');
    }
  }

  for (const [id, name] of Object.entries(TW_DISPLAY_CLASS)) {
    const btn = dock.querySelector(`[data-sve-css-tool="${id}"]`);

    if (!btn) {
      continue;
    }

    if (twHasNode() && twActiveClass(propertyOfTwClass(name)) === name) {
      btn.setAttribute('data-active', '');
    } else {
      btn.removeAttribute('data-active');
    }
  }

  for (const tool of [...CSS_TOOLS, ...TW_EXTRA_TOOLS]) {
    const btn = dock.querySelector(`[data-sve-css-tool="${tool.id}"]`);

    if (!btn) {
      continue;
    }

    const property = TW_TOOL_PROPERTY[tool.id];
    const on = twHasNode() && !!property && !!twActiveClass(property);

    if (sub === property && (tool.id === 'padding' || tool.id === 'margin')) {
      btn.setAttribute('data-open', '');
    } else {
      btn.removeAttribute('data-open');
    }

    if (on) {
      btn.setAttribute('data-active', '');
    } else {
      btn.removeAttribute('data-active');
    }
  }

  for (const side of CSS_BOX_SIDES) {
    const btn = dock.querySelector(`[data-sve-css-box-side="${side.suffix}"]`);

    if (!btn) {
      continue;
    }

    const property = boxPrefix ? `${boxPrefix}${TW_BOX_SIDE[side.suffix] ?? side.suffix}` : '';

    if (property && twActiveClass(property)) {
      btn.setAttribute('data-active', '');
    } else {
      btn.removeAttribute('data-active');
    }
  }
}

function bindCssTools(win, dock) {
  const host = dock.querySelector('[data-sve-css-tools]');

  if (!host || host._sveBound) {
    return;
  }

  host._sveBound = true;

  const allCss = [...CSS_TOOLS, ...CSS_DISPLAY_ITEMS, ...CSS_FLEX_EXTRAS];
  const runCssTool = (id, btn) => {
    if (styleMode === 'tw') {
      runTwTool(win, dock, id, btn);

      return;
    }

    const tool = allCss.find((item) => item.id === id);

    if (!tool) {
      return;
    }

    if (tool.flexDir) {
      closeCssMenu(win.document);
      applyFlexDirection(tool.flexDir);

      return;
    }

    if (tool.display) {
      closeCssMenu(win.document);
      applyDisplay(tool.display);

      return;
    }

    if (tool.property && tool.value) {
      closeCssMenu(win.document);
      applyFlexValue(tool.property, tool.value);

      return;
    }

    if (tool.insert) {
      const property = cssPropertyOf(tool.insert);
      const value = cssValueOf(tool.insert);
      const decls = currentFlexDecls();

      closeCssMenu(win.document);
      cssChrome(dock)?.removeAttribute('data-sve-css-sub');

      if (property && normalizeFlexValue(decls[property]) === normalizeFlexValue(value)) {
        applyRuleDecls([{ property, value: null }]);
      } else {
        applyRuleDecls([{ property, value }]);
      }

      return;
    }

    if (tool.menu === 'colors') {
      cssChrome(dock)?.removeAttribute('data-sve-css-sub');
      openCssColorMenu(win, btn, tool.property);

      return;
    }

    if (tool.menu === 'box') {
      toggleCssSubrow(win, tool.property);

      return;
    }

    if (tool.menu === 'display') {
      toggleCssSubrow(win, 'display');

      return;
    }

    if (tool.menu === 'spacing') {
      openCssSpacingMenu(win, btn, tool.property);
    }
  };

  let alignSep = false;
  const extras = CSS_FLEX_EXTRAS.map((extra, i) => {
    const row = {
      ...extra,
      icon: CSS_TOOL_ICONS[extra.id] || '',
      sep: i === 0 || (extra.group === 'align' && !alignSep),
    };

    if (extra.group === 'align' && !alignSep) {
      alignSep = true;
    }

    return row;
  });

  cssToolRow = () => {
    const tools = styleMode === 'tw' ? [...CSS_TOOLS, ...TW_EXTRA_TOOLS] : CSS_TOOLS;

    cssChrome(dock)?.removeAttribute('data-sve-css-sub');
    placeCssSubrow(dock);

    mountPane(host, CodeDockCssTools, {
      tools: tools.map((tool) => ({
        ...tool,
        icon: CSS_TOOL_ICONS[tool.id] || TW_TOOL_ICONS[tool.id] || '',
      })),
      onTool: (id) => runCssTool(id, dock.querySelector(`[data-sve-css-tool="${id}"]`)),
    });
  };

  cssToolRow();

  const boxHost = dock.querySelector('[data-sve-css-sub="box"]');

  if (boxHost && !boxHost._sveBound) {
    boxHost._sveBound = true;
    mountPane(boxHost, CodeDockCssBoxRow, {
      sides: CSS_BOX_SIDES.map((side) => ({
        ...side,
        icon: CSS_TOOL_ICONS[`box-${side.id}`] || '',
      })),
      onSide: (suffix) => {
        const prefix = cssChrome(dock)?.getAttribute('data-sve-css-sub');
        const btn = boxHost.querySelector(`[data-sve-css-box-side="${suffix}"]`);
        const property = `${prefix}${suffix}`;
        const decls = styleMode === 'tw' ? {} : currentFlexDecls();

        if ((prefix !== 'padding' && prefix !== 'margin') || !btn) {
          return;
        }

        if (styleMode === 'tw') {
          twOpenToolMenu(win, btn, `${prefix}${TW_BOX_SIDE[suffix] ?? suffix}`);

          return;
        }

        if (property in decls) {
          closeCssMenu(win.document);
          applyRuleDecls([{ property, value: null }]);
          return;
        }

        openCssSpacingMenu(win, btn, property);
        paintCssToolState(win);
      },
    });
  }

  const displayHost = dock.querySelector('[data-sve-css-sub="display"]');

  if (displayHost && !displayHost._sveBound) {
    displayHost._sveBound = true;
    mountPane(displayHost, CodeDockCssDisplayRow, {
      items: CSS_DISPLAY_ITEMS.map((item) => ({
        ...item,
        icon: CSS_TOOL_ICONS[item.id] || '',
      })),
      extras,
      onTool: (id) => runCssTool(id, dock.querySelector(`[data-sve-css-tool="${id}"]`)),
    });
  }

  win.document.addEventListener(
    'mousedown',
    (event) => {
      if (event.target.closest(`#${CSS_MENU_ID}, [data-sve-css-tools], [data-sve-css-subrow], [data-sve-html-tools], [data-sve-css-add-class]`)) {
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

  bindAntlersSnippets(win, dock);
  bindVisualEditSnippets(win, dock);
}

function bindAntlersSnippets(win, dock) {
  const host = dock.querySelector('[data-sve-antlers-tools]');

  if (!host || host._sveBound) {
    return;
  }

  host._sveBound = true;

  mountPane(host, CodeDockAntlersSelect, {
    label: t(win, 'code_dock_antlers'),
    groups: ANTLERS_SNIPPET_GROUPS.map((group) => ({
      id: group.id,
      label: t(win, group.lang),
      items: ANTLERS_SNIPPETS.filter((item) => item.group === group.id).map((item) => ({
        id: item.id,
        label: item.label,
      })),
    })),
    onPick: (id) => insertAntlersSnippet(id),
  });
}

function insertAntlersSnippet(id) {
  const spec = antlersSnippet(id);
  const view = editors.html;

  if (!spec || !view || view.state.readOnly) {
    return;
  }

  const pos = view.state.selection.main.head;
  const line = view.state.doc.lineAt(pos);
  const indent = line.text.trim()
    ? lineIndentOf(line.text)
    : indentFromPrevious(view, line) || lineIndentOf(line.text);
  const { text, cursor } = expandAntlersSnippet(spec.snippet);

  insertHtmlSnippet(indentAntlersSnippet(text, indent), cursor);
  finishHtmlEdit();
}

function bindVisualEditSnippets(win, dock) {
  const host = dock.querySelector('[data-sve-visual-edit-tools]');

  if (!host || host._sveBound) {
    return;
  }

  host._sveBound = true;

  mountPane(host, CodeDockAntlersSelect, {
    label: t(win, 'code_dock_visual_edit'),
    groups: VISUAL_EDIT_SNIPPET_GROUPS.map((group) => ({
      id: group.id,
      label: t(win, group.lang),
      items: VISUAL_EDIT_SNIPPETS.filter((item) => item.group === group.id).map((item) => ({
        id: item.id,
        label: item.label,
      })),
    })),
    onPick: (id) => insertVisualEditSnippet(id),
  });
}

/**
 * Merges `spec.attr` into an already-found {{ visual_edit ... }} tag, right
 * before its closing `}}`, instead of opening a new pair of braces — the
 * whole point being that picking `inline_edit` after `visual_edit` doesn't
 * repeat `{{ }}`. A no-op (just refocuses) when the attribute is already
 * there.
 */
function mergeVisualEditAttr(view, doc, tag, spec) {
  if (hasAttr(tag.inner, spec.attr)) {
    view.focus();

    return;
  }

  const { text: attrText, cursor: attrCursor } = expandAntlersSnippet(spec.attr);
  let trimEnd = tag.closeIdx;

  while (trimEnd > tag.openIdx + 2 && /\s/.test(doc[trimEnd - 1])) {
    trimEnd--;
  }

  view.dispatch({
    changes: { from: trimEnd, to: tag.closeIdx, insert: ` ${attrText} ` },
    selection: { anchor: trimEnd + 1 + attrCursor },
  });
  finishHtmlEdit();
}

/**
 * Picking an item from the "Visual edit" dropdown annotates the HTML element
 * the cursor/selection is on or inside — the same element htmlElementAtCursor()
 * finds for the other HTML toolbar buttons (bold, heading, …) — not wherever
 * the raw text cursor happens to sit. Clicking inside a <div>'s attributes or
 * its content, or with a <h1>'s text selected, targets that div or h1.
 *
 * If that element already has a {{ visual_edit }} tag, the attribute is
 * merged into it (see mergeVisualEditAttr); otherwise a fresh
 * {{ visual_edit <attr> }} is opened right after the tag name, inside its
 * opening tag — `<h1 {{ visual_edit … }} class="...">`, matching how it's
 * written by hand. Only when the cursor sits outside any HTML element at all
 * does this fall back to inserting loose text at the cursor.
 */
function insertVisualEditSnippet(id) {
  const spec = visualEditSnippet(id);
  const view = editors.html;

  if (!spec || !view || view.state.readOnly) {
    return;
  }

  const doc = view.state.doc.toString();
  const el = htmlElementAtCursor();

  if (el?.open) {
    const existing = findVisualEditInRange(doc, el.open.from, el.open.to, VISUAL_EDIT_TAG);

    if (existing) {
      if (spec.attr) {
        mergeVisualEditAttr(view, doc, existing, spec);
      } else {
        view.dispatch({ selection: { anchor: existing.openIdx + 2 + VISUAL_EDIT_TAG.length } });
        view.focus();
      }

      return;
    }

    const insertAt = el.open.from + 1 + el.name.length;
    const raw = spec.standalone || `{{ ${VISUAL_EDIT_TAG} ${spec.attr} }}`;
    const { text, cursor } = expandAntlersSnippet(raw);

    view.dispatch({
      changes: { from: insertAt, to: insertAt, insert: ` ${text}` },
      selection: { anchor: insertAt + 1 + cursor },
    });
    finishHtmlEdit();

    return;
  }

  const pos = view.state.selection.main.head;
  const line = view.state.doc.lineAt(pos);
  const indent = line.text.trim()
    ? lineIndentOf(line.text)
    : indentFromPrevious(view, line) || lineIndentOf(line.text);
  const raw = spec.standalone || `{{ ${VISUAL_EDIT_TAG} ${spec.attr} }}`;
  const { text, cursor } = expandAntlersSnippet(raw);

  insertHtmlSnippet(indentAntlersSnippet(text, indent), cursor);
  finishHtmlEdit();
}

function refreshPreview(win) {
  if (!lastUid || !lastType || String(lastType).startsWith('view:')) {
    replayLivePreview(win);

    return;
  }

  const sectionUids = topLevelSectionIds(lastUid, win.document);

  replayLivePreview(win, sectionUids.length ? { sectionUids } : undefined);
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
        paintLock(win);
        writeParts(lastParts, true);
        paintHtmlScope(win);
        setStatus(win.document, t(win, 'code_dock_locked'));

        return;
      }

      if (!res.ok) {
        throw new Error(String(res.status));
      }

      if (lastType === type) {
        lastParts = parts;
        setStatus(win.document, t(win, 'code_dock_saved'));
        paintAutosave(win);
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
  const twReady = twCss !== null && tailwindDockOn(win) && twKeyFor(parts.html) === twKey;

  // A finished compile is worth a save of its own, even when not a character
  // of the file has changed since the last one.
  if (sameParts(parts, lastParts) && !(twReady && twDirty)) {
    return;
  }

  if (twReady) {
    parts.tw = twCss;
    twDirty = false;
  }

  setStatus(doc, t(win, 'code_dock_saving'));
  postSave(win, type, parts);
}

/** The classes in the file, in a stable order — the compile's cache key. */
function twKeyFor(html) {
  return twCandidates(html).sort().join(' ');
}

export function resetTailwindCompile() {
  twCss = null;
  twKey = '';
  twDirty = false;
}

/**
 * Compile this file's classes with Tailwind's own engine.
 *
 * Off the save path: the engine is a lazy chunk and the first load takes a
 * moment, so the save goes ahead without it and the finished compile asks for
 * one more save. Nothing recompiles while the class list is unchanged, which
 * is most keystrokes.
 */
function ensureTwCss(win, html) {
  if (!win || !tailwindDockOn(win)) {
    return;
  }

  const key = twKeyFor(html);

  if (key === twKey || twBusy) {
    return;
  }

  twBusy = true;

  void import('./tw-compile.js')
    .then((mod) => mod.compileTailwind(win, html))
    .then((css) => {
      twBusy = false;
      twCss = css;
      twKey = key;
      twDirty = true;
      scheduleSave(win, win.document);
    })
    .catch((err) => {
      twBusy = false;
      console.error('[sve] tailwind compile', err);
    });
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
    paintAutosave(win);
    return;
  }

  paintAutosave(win);
  ensureTwCss(win, parts.html);

  if (!autosaveEnabled(win)) {
    setStatus(win.document, t(win, 'code_dock_unsaved'));

    return;
  }

  setStatus(win.document, t(win, 'code_dock_saving'));
  scheduleSave(win, win.document);
}

let htmlPartialUi = null;
let htmlClassTokenUi = null;

function partialUi() {
  if (!htmlPartialUi) {
    htmlPartialUi = partialDecorations({
      Decoration,
      StateField,
      StateEffect,
      RangeSetBuilder,
      EditorView,
    });
  }

  return htmlPartialUi;
}

function classTokenUi() {
  if (!htmlClassTokenUi) {
    htmlClassTokenUi = classTokenDecorations({
      Decoration,
      StateField,
      StateEffect,
      RangeSetBuilder,
      EditorView,
    });
  }

  return htmlClassTokenUi;
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
        autocompletion({ tooltipClass: () => 'sve-tw-complete' }),
        ...(handle === 'html'
          ? [
              htmlLanguage.data.of({
                autocomplete: tailwindClassCompletions(win),
              }),
              tailwindHoverExtension(hoverTooltip, win),
            ]
          : []),
        ...(handle === 'html' ? [...htmlEmmetExtensions(), htmlTagSync()] : []),
        keymap.of([
          ...defaultKeymap,
          ...(handle === 'html' ? [{ key: 'Tab', run: expandHtmlTab }] : []),
          indentWithTab,
          ...historyKeymap,
          ...completionKeymap,
          ...closeBracketsKeymap,
        ]),
        saveKey,
        EditorView.lineWrapping,
        ...(handle === 'html' || handle === 'css'
          ? partialUi().extensions
          : []),
        ...(SUNDAY_AUG30 && handle === 'html' ? classTokenUi().extensions : []),
        readOnlyOf[handle].of(EditorState.readOnly.of(!!lastLocked)),
        editableOf[handle].of(EditorView.editable.of(!lastLocked)),
        EditorView.updateListener.of((update) => {
          if (SUNDAY_AUG30 && handle === 'html' && update.docChanged && !applying) {
            flushBracketSync(win);
            emit('dock:html-changed');
          }

          if (SUNDAY_AUG30 && handle === 'css' && update.docChanged && !applying) {
            flushCssToHtml();
          }

          if (update.docChanged) {
            onEditorInput(win);
          }

          if (handle === 'css' && (update.docChanged || update.selectionSet)) {
            paintCssToolState(win);
          }

          if (handle === 'html' && (update.docChanged || update.selectionSet)) {
            paintHtmlToolState(win);

            if (!applying) {
              syncTwTarget(win);
            }
          }
        }),
        ...vscTheme(),
      ],
    }),
    parent,
  });
}

function paintHostWait(host) {
  if (!host || host.querySelector('.cm-editor')) {
    return;
  }

  host.replaceChildren();

  const spin = host.ownerDocument.createElement('span');

  spin.style.cssText =
    'width:16px;height:16px;margin:12px;border:2px solid #858585;border-right-color:transparent;border-radius:50%;display:block;animation:sve-cm-wait .6s linear infinite';
  host.appendChild(spin);
}

let ensureDockWait = null;

async function ensureDockAsync(win) {
  const doc = win.document;

  ensureStyle(doc);

  let dock = doc.getElementById(DOCK_ID);

  if (dock) {
    const chromeOk =
      dock.querySelector('[data-sve-css-chrome="subrow-2"]') &&
      dock.querySelector('[data-sve-css-subrow]') &&
      dock.querySelector('[data-sve-css-add-class]') &&
      dock.querySelector('[data-sve-html-tools]') &&
      dock.querySelector('[data-sve-visual-edit-tools]') &&
      dock.querySelector('[data-sve-html-scope]') &&
      dock.querySelector('[data-sve-code-lock]') &&
      dock.querySelector('[data-sve-code-back]') &&
      dock.querySelector('[data-sve-code-autosave]') &&
      dock.querySelector('[data-sve-code-save]') &&
      dock.getAttribute('data-sve-code-chrome') === 'scope-7';

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
    dock.setAttribute('data-sve-code-chrome', 'scope-7');
    mountPane(dock, CodeDockChrome, {
      htmlLabel: t(win, 'code_dock_html'),
      cssLabel: t(win, 'code_dock_css'),
      jsLabel: t(win, 'code_dock_js'),
      treeIcon: SCOPE_ICON,
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

    sve.openHtmlTreePanel?.(win);
  }

  attachDock(doc, dock);
  shieldDock(dock);
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
        sectionValues: () => currentSectionValues(win),
        isLocked: () => isCodeDockLocked(),
        setHover: (view, range) => htmlPartialUi?.setHover(view, range),
      });
    }

    if (SUNDAY_AUG30) {
      bindClassTokenNav(win, editors.html, {
        onRename: (token) => openRenameClassMenu(win, token),
        isLocked: () => isCodeDockLocked(),
        setHover: (view, range) => htmlClassTokenUi?.setHover(view, range),
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

  lastType = type;
  lastLocked = true;
  lockReady = true;
  lastParts = { html: '', css: '', js: '' };
  clearHtmlScopeRange();
  paintLock(win);
  writeParts(lastParts, true);
  setPath(win.document, type);
  setStatus(win.document, t(win, 'code_dock_missing'));
  paintHtmlScope(win);
  paintBack(win);
  paintAutosave(win);
  placeDock(win, dock);
}

async function loadTemplate(win, type, mode = 'replace') {
  if (mode === 'replace') {
    typeStack = [];
  } else if (mode === 'push' && lastType && lastType !== type) {
    typeStack.push(lastType);
  }

  const gen = ++loadGen;

  lastType = type;
  lockReady = false;
  clearHtmlScopeRange();
  setStatus(win.document, t(win, 'code_dock_loading'));

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
      resetTailwindCompile();
      paintLock(win);
      writeParts(lastParts, lastLocked);

      if (!lastLocked) {
        ensureTwCss(win, lastParts.html);
      }

      setPath(win.document, data.path || type);
      setStatus(win.document, lastLocked ? t(win, 'code_dock_locked') : '');
      paintHtmlScope(win);
      paintBack(win);
      paintAutosave(win);
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
  refreshPreview(win);

  if (!lastType || !win.document.getElementById(DOCK_ID)) {
    return;
  }

  const type = lastType;

  lastType = null;
  loadTemplate(win, type, 'keep');
}

export function closeCodeDock(doc) {
  loadGen += 1;
  flushSave(doc);
  lastUid = null;
  lastType = null;
  typeStack = [];
  lastParts = { html: '', css: '', js: '' };
  lastLocked = false;
  lockReady = false;
  lastBracketNames = null;
  lastCssSelectorNames = null;
  clearHtmlScopeRange();
  lastWin = doc?.defaultView || lastWin;
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

  const win = doc?.defaultView || lastWin;

  if (win?.document.getElementById(sve.HTML_TREE_PANEL_ID)) {
    sve.closeHtmlTreePanel?.(win);
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
      (typeof sve.setTypeForUid === 'function' &&
        (sve.setTypeForUid(sectionUid, doc) || sve.setTypeForUid(sectionUid, win.document))) ||
        ''
    ).trim();
  }

  const field = typeof sve.sectionField === 'function' ? sve.sectionField(win) : 'page_sections';
  const containers = typeof sve.activeContainers === 'function' ? sve.activeContainers(win.document) : [];

  for (const container of containers) {
    const values = sve.unwrapRef?.(container.values) || container.values;
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

function collectionViewType(win) {
  const features = win.Statamic?.$config?.get?.('sveFeatures') || {};

  if (features.collection_templates !== true) {
    return '';
  }

  const store = win.Statamic?.$config?.get?.('sveCollectionTemplatesCollection') || 'templates';
  const path = win.location?.pathname || '';

  if (!path.includes(`/collections/${store}/entries/`)) {
    return '';
  }

  const containers = typeof sve.activeContainers === 'function' ? sve.activeContainers(win.document) : [];

  for (const container of containers) {
    const values = sve.unwrapRef?.(container.values) || container.values;
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

/**
 * Load the template file for the section the editor is on.
 *
 * `uid` is a visual id on the page (section or a block inside it). Type is
 * always the outer page-section row in publish values. Do not wait for that
 * row to exist as a replicator set in the left sidebar.
 */
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

  const type =
    chromeTemplateType(win, doc) ||
    globalSectionTemplateType(doc) ||
    pageSectionType(win, doc, uid) ||
    collectionViewType(win) ||
    (!uid ? lastType : '');
  const uidChanged = !!(uid && uid !== lastUid);

  lastWin = win;

  if (uid) {
    lastUid = uid;
  }

  if (!type) {
    return;
  }

  if (type === lastType && doc.getElementById(DOCK_ID)) {
    return;
  }

  if (typeStack.length && lastType && lastType !== type) {
    const root = typeStack[0];

    if (type === root && !uidChanged) {
      return;
    }

    typeStack = [];
  }

  flushSave(doc);
  loadTemplate(win, type, 'replace');
}

// A different tag, or a class added to it, relights the icon row.
on('tw:changed', () => {
  if (lastWin && styleMode === 'tw') {
    paintCssToolState(lastWin);
  }
});

register('dock:is-open', (doc) => isCodeDockOpen(doc));
register('dock:is-locked', () => isCodeDockLocked());
register('dock:html', () => currentFullHtml());
register('dock:reveal-html', ({ from, to } = {}) => {
  const view = editors.html;

  if (!view || from == null) {
    return;
  }

  htmlScopePref = htmlScopeEnabled(lastWin);
  syncScopedHtml();
  flushCssScope();

  const length = htmlFull.length;
  const start = Math.max(0, Math.min(from, length));
  const end = Math.max(start, Math.min(to ?? from, length));

  htmlFocus = end > start ? { from: start, to: end } : null;

  if (htmlScopePref && htmlFocus) {
    showHtmlScope();
    paintHtmlScope(lastWin);

    return;
  }

  if (htmlScopeActive) {
    showHtmlFull();
    paintHtmlScope(lastWin);

    return;
  }

  view.dispatch({
    selection: { anchor: start, head: end },
    scrollIntoView: true,
  });
  view.focus();
});
register('dock:insert-snippet', ({ win, parts }) => insertAiSnippet(win, parts));
register('dock:refresh', (win) => refreshCodeDockFromDisk(win));
register('dock:tw-follow', () => {
  if (lastWin) {
    syncTwTarget(lastWin);
  }
});
register('dock:current-type', () => currentTemplateType());
register('dock:current-uid', () => lastUid);
register('dock:set-html', (html) => {
  if (typeof html !== 'string' || isCodeDockLocked()) {
    return false;
  }

  const view = editors.html;

  if (!view || !lastWin) {
    return false;
  }

  htmlFull = html;

  if (htmlScopeActive) {
    writeHtmlEditor(htmlEditorText());
    onEditorInput(lastWin);
    emit('dock:html-changed');

    return true;
  }

  const current = view.state.doc.toString();

  if (current !== html) {
    view.dispatch({
      changes: { from: 0, to: current.length, insert: html },
    });
  }

  return true;
});

sve.syncCodeDock = syncCodeDock;

