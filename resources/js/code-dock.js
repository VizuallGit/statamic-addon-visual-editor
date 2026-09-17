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
import { ask, emit, on, register } from './cp/bus.js';
import { mountPane } from './cp/mount-pane.js';
import CodeDockChrome from './cp/surfaces/CodeDockChrome.vue';
import ChoiceDialog from './cp/surfaces/ChoiceDialog.vue';
import CodeDockHtmlTools from './cp/surfaces/CodeDockHtmlTools.vue';
import CodeDockAntlersSelect from './cp/surfaces/CodeDockAntlersSelect.vue';
import CodeDockCssTools from './cp/surfaces/CodeDockCssTools.vue';
import { cssToolsUi } from './cp/css/tools.js';
import { alpineUi } from './cp/alpine/store.js';
import AlpinePanel from './cp/surfaces/AlpinePanel.vue';
import {
  ALPINE_BEHAVIOURS,
  ALPINE_GROUPS,
  behaviourHint,
  fillName,
  stateNames,
  tagAttrs,
} from './alpine-behaviours.js';
import CodeDockCssHead from './cp/surfaces/CodeDockCssHead.vue';
import CodeDockMenu from './cp/surfaces/CodeDockMenu.vue';
import CodeDockAddClass from './cp/surfaces/CodeDockAddClass.vue';
import CodeDockDataVars from './cp/surfaces/CodeDockDataVars.vue';
import {
  cachedDataVars,
  dataVarSnippet,
  dataVarsCollection,
  dataVarsKey,
  dataVarsScope,
  dataVarsSet,
  fetchDataVars,
  groupsWithValues,
  resetDataVars,
  withValues,
} from './data-vars.js';
import { loopScopeAt } from './antlers-blocks.js';
import { flattenHtmlTree, parseHtmlTree } from './html-tree-parse.js';
import { antlersDecorations } from './antlers-highlight.js';
import { tidyHtml } from './html-tidy.js';
import { HTML_ICONS, TEXT_TAGS } from './html-tree-icons.js';
import { twCandidates } from './tw-candidates.js';
import { tailwindDockOn } from './tailwind-complete.js';
import { syncComponentFocus, syncComponentMap, watchComponentMap } from './component-focus.js';
import { setTwOverlayOn, twOverlayOn } from './tw-overlay.js';
import {
  closeTwMenu,
  renderTwClasses,
  twRepaintOverlay,
  twActiveClass,
  twHasNode,
  twOpenAddMenu,
  twOpenTagMenuAt,
  twOpenToolMenu,
  twSetClass,
  twValueOptions,
  twWantFamilies,
} from './tw-classes.js';
import { cssUi } from './cp/css/store.js';
import { bpDevice, breakpoints } from './breakpoints.js';
import { moveClassesIntoScope } from './css-scope-move.js';
import {
  blocksForSize,
  cssMediaBlocks,
  emptySizeBlocks,
  foldRangesForSize,
  idRulesForSize,
  stripEmptySizeBlocks,
} from './css-sizes.js';
import { bindTips } from './cp/tip.js';
import { openCpOverlay } from './cp/open-overlay.js';
import { mountSurface } from './cp/mount.js';
import { applyBracketClass, bracketClassTokens, bracketToken, buildScopedCss, cssClassSelectors, diffBracketNames, findClassRule, firstClassName, matchBraces, mergeScopedCss, pruneBracketCss, rewriteBracketClassTokens, sanitizeCssClassName, syncCssWithBrackets, tokenTreeFromHtml } from './css-scope.js';
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
import { componentPropsOn, forgetComponentProps } from './component-props.js';
import { syncComponentProps } from './component-props-host.js';
import {
  tailwindClassCompletions,
  tailwindHoverExtension,
} from './tailwind-complete.js';
import { csrfToken } from './lib/csrf.js';
import { injectStyle } from './lib/style.js';
import { t } from './lib/i18n.js';
import { attachDock, dockParent } from './lib/dock-host.js';
import { beginOverlayDrag } from './lib/drag.js';
import { loadCodeMirror, vscTheme } from './lib/codemirror.js';
import { HTML_TREE_PANEL_ID } from './lib/ids.js';
import { dataGet, findPathByUid, unwrapRef } from './lib/values.js';
import { featureOn, sectionField } from './lib/config.js';
import { activeContainers } from './lib/publish-containers.js';
import { setTypeForUid } from './focus-panel.js';

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
let codeFolding;
let foldEffect;
let unfoldEffect;
let foldedRanges;
let syntaxHighlighting;
let tags;

let cmReady = null;
let cm = null;

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
const SCOPE_CLASS = '{{ _class }}';

const DOCK_ID = '__sve-code-dock';
const STYLE_ID = '__sve-code-dock-style';
const UNLOCK_ID = '__sve-code-dock-unlock';
const HEIGHT_KEY = 'sve-code-dock-height';
const PANES_KEY = 'sve-code-dock-panes';
const WIDTHS_KEY = 'sve-code-dock-widths';
const SCOPE_KEY = 'sve-html-scope-v2';
const AUTOSAVE_KEY = 'sve-code-dock-autosave';
const STYLE_MODE_KEY = 'sve-code-dock-style-mode';
const VALUES_MODE_KEY = 'sve-code-dock-values';
const DEFAULT_HEIGHT = 280;
const MIN_HEIGHT = 120;
const MIN_PANE = 140;
const SAVE_MS = 250;
const HANDLES = ['html', 'css', 'js'];

/**
 * The panes the dock can show, which is the three file parts plus Alpine.
 *
 * Alpine is not a fourth part of the file — it is attributes on the tags in
 * the HTML — so it has a pane and a button but no editor and nothing to save.
 * `HANDLES` stays the three that are read from and written to disk.
 */
const PANES = ['html', 'css', 'alpine', 'js'];
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
/** The Data button: a small table, for the fields behind the template. */
const DATA_ICON =
  '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><ellipse cx="12" cy="5.5" rx="7.5" ry="3"/><path d="M4.5 5.5v6c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3v-6"/><path d="M4.5 11.5v6c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3v-6"/></svg>';
const AUTOSAVE_ICON =
  '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19.4 16.3A8.5 8.5 0 1 1 18.3 6.3"/><path d="M21 3.2v5.4h-5.4"/></svg>';
const SAVE_ICON =
  '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8"/><path d="M7 3v5h8"/></svg>';
const CSS_ADD_ICON =
  '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';
const CSS_MENU_ID = '__sve-css-menu';
const HTML_HEADINGS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
const HTML_TOOLS = [
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

const ID_MODE_ICON =
  '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" '
  + 'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
  + '<path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18"/></svg>';

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
const CSS_TOOLS = [
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
const CSS_LENGTHS = ['100%', 'auto', 'fit-content', 'min-content', 'max-content', '100vw', '100dvh', '0'];

/** Every tool and every child, flat, for looking one up by id. */
const CSS_TOOL_INDEX = new Map();

for (const tool of CSS_TOOLS) {
  CSS_TOOL_INDEX.set(tool.id, { tool, kid: null });

  for (const kid of tool.kids || []) {
    CSS_TOOL_INDEX.set(kid.id, { tool, kid });
  }
}

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

let cssColorsPromise = null;

let lastUid = null;
let lastType = null;
let typeStack = [];
let lastParts = { html: '', css: '', js: '' };

/**
 * What the open component declares, as the file has it.
 *
 * Held apart from the three panes because it is not one: the panes are text
 * the reader types, this is a list the panel edits. It rides along on every
 * save so the server never has to guess whether a save meant to change it.
 */
let lastProps = [];
let propsDirty = false;
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

/** Which tool has its children open — '' when none has. */
let cssOpenTool = '';

/** Which icon has its menu open. Held here so a second click on it closes. */
let cssOpenMenu = '';

/**
 * Is the pane showing the section's own values rather than its design?
 *
 * The second layer: `#id-{{ id }}` holds what the editor filled in on THIS
 * section, as custom properties the design reads with `var(…)`. Its own button
 * rather than a third click on the language switch — three states on one
 * button is a guess about what the next click gives you.
 */
let cssValues = false;

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

function languageOf(handle) {
  if (handle === 'css') {
    return css();
  }

  if (handle === 'js') {
    return javascript();
  }

  return html({ autoCloseTags: true });
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
        alpine: raw.alpine === true,
      };
    }
  } catch {
    /* ignore */
  }

  return { html: true, css: true, js: false, alpine: false };
}

function storePanes(win, panes) {
  chromeSet(win, PANES_KEY, JSON.stringify(panes));
}

function storedWidths(win) {
  try {
    const raw = JSON.parse(chromeGet(win, WIDTHS_KEY) || 'null');

    if (raw && typeof raw === 'object') {
      const n = (v) => (Number.isFinite(v) && v > 0 ? v : 1);

      const out = {};

      for (const pane of PANES) {
        out[pane] = n(raw[pane]);
      }

      return out;
    }
  } catch {
    /* ignore */
  }

  return Object.fromEntries(PANES.map((pane) => [pane, 1]));
}

function storeWidths(win, widths) {
  chromeSet(win, WIDTHS_KEY, JSON.stringify(widths));
}

function ensureStyle(doc) {
  injectStyle(doc, STYLE_ID, `
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
#${DOCK_ID}[data-sve-style="tw"] [data-sve-values-mode],
#${DOCK_ID}[data-sve-code-locked] [data-sve-values-mode] {
  display: none;
}
#${DOCK_ID} [data-sve-values-mode],
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
#${DOCK_ID} [data-sve-values-mode]:hover,
#${DOCK_ID} [data-sve-style-mode]:hover {
  opacity: 1;
  background: rgba(255,255,255,.1);
}
#${DOCK_ID} [data-sve-values-mode][aria-pressed="true"],
#${DOCK_ID} [data-sve-style-mode][aria-pressed="true"] {
  opacity: 1;
  color: #7dd3fc;
  background: rgba(56,189,248,.16);
}
/* The CSS pane holds two things and shows one: the editor, or the chips. */
#${DOCK_ID} [data-sve-tw-host] {
  display: none;
}
/* The head row belongs to the editor, so it goes with it: in Tailwind mode the
   chips draw their own, and two rows asking the same question is one too many. */
/* The Alpine pane has no editor to fill it, so its panel does. */
#${DOCK_ID} [data-sve-alpine-host] {
  flex: 1 1 0;
  min-height: 0;
  min-width: 0;
  overflow: auto;
  overscroll-behavior: contain;
  scrollbar-width: thin;
}
#${DOCK_ID} [data-sve-css-head] {
  flex: 0 0 auto;
}
#${DOCK_ID}[data-sve-style="tw"] [data-sve-css-head] {
  display: none;
}
/* Locked: dimmed, not gone. The Tailwind row does the same, and a row that
   disappears reads as broken — a row that is greyed out reads as locked. */
#${DOCK_ID}[data-sve-code-locked] [data-sve-css-head] {
  opacity: .5;
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
#${DOCK_ID}[data-sve-code-locked] [data-sve-html-tools],
#${DOCK_ID}[data-sve-code-locked] [data-sve-html-tidy],
#${DOCK_ID}[data-sve-code-locked] [data-sve-data-vars],
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
  gap: 2px;
  min-width: 0;
  overflow-x: auto;
  /* Scrolls like the Tailwind row, and without a bar across the buttons. */
  scrollbar-width: none;
}
#${DOCK_ID} [data-sve-html-tools]::-webkit-scrollbar {
  display: none;
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
#${DOCK_ID} [data-sve-css-kids]::before {
  content: '';
  flex: 0 0 auto;
  width: 1px;
  height: 12px;
  margin: 0 6px 0 4px;
  background: rgba(255,255,255,.16);
}
/* A tool's children, inside the tool's own list item — so they open beside the
   icon they belong to, in its highlight, never somewhere else on the row. */
/* A size block that is in the editor but not in the file. Faded says what a
   dialog would have to explain: nothing here is saved until you write in it. */
#${DOCK_ID} .sve-css-ghost {
  opacity: .32;
}
/* The section's own layer, while it is showing. Same blue the ID button lights
   up in, so the button and the rule it opened are plainly the same thing.

   Loud on purpose. At a tenth of an alpha it was technically drawn and
   practically invisible: two dim lines at the top of a file you were not
   looking at, which is indistinguishable from the button doing nothing. */
#${DOCK_ID} .cm-line.sve-css-id {
  background: rgba(56,189,248,.16);
  box-shadow: inset 3px 0 0 #38bdf8;
}
/* An empty ID rule is still unsaved, and still dropped on the way to disk —
   but it is not faded while the ID is open. It is the one rule the button just
   asked you to write in; drawing it at a third of its strength was telling you
   to type somewhere you could barely see. */
#${DOCK_ID}[data-sve-values="on"] .cm-line.sve-css-id .sve-css-ghost {
  opacity: 1;
}
#${DOCK_ID} [data-sve-css-kids] {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  gap: 2px;
  min-width: 0;
  overflow-x: auto;
  scrollbar-width: none;
}
#${DOCK_ID} [data-sve-css-kids]::-webkit-scrollbar {
  display: none;
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
  /* Every button keeps its size and the row scrolls instead. Left to shrink,
     the last few squeezed themselves into slivers rather than admitting there
     was no room — and squeezed icons read as missing ones. */
  flex: 0 0 auto;
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
#${DOCK_ID} [data-sve-css-kids] [data-sve-css-kid]:hover,
#${DOCK_ID} [data-sve-css-kids] [data-sve-css-kid][data-active] {
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
/* The last three buttons write Antlers, not a tag: a component call, a loop,
   a condition. They decide what renders and how often, which is a different
   kind of thing from adding a paragraph - so they carry a colour and read as
   a group at the end of the row rather than as three more tags. Each keeps
   its own hover, or a marked button would look dead under the pointer.
   No backticks in here: this whole sheet is a template literal. */
#${DOCK_ID} [data-sve-html-tool="component"] {
  color: #5eead4;
  background: rgba(45,212,191,.13);
  opacity: 1;
}
#${DOCK_ID} [data-sve-html-tool="component"]:hover,
#${DOCK_ID} [data-sve-html-tool="component"][data-open] {
  background: rgba(45,212,191,.26);
}
#${DOCK_ID} [data-sve-html-tool="loop"] {
  color: #a5b4fc;
  background: rgba(129,140,248,.15);
  opacity: 1;
}
#${DOCK_ID} [data-sve-html-tool="loop"]:hover,
#${DOCK_ID} [data-sve-html-tool="loop"][data-open] {
  background: rgba(129,140,248,.28);
}
#${DOCK_ID} [data-sve-html-tool="if"] {
  color: #e8c468;
  background: rgba(234,179,8,.13);
  opacity: 1;
}
#${DOCK_ID} [data-sve-html-tool="if"]:hover,
#${DOCK_ID} [data-sve-html-tool="if"][data-open] {
  background: rgba(234,179,8,.26);
}
#${CSS_MENU_ID} {
  position: fixed;
  z-index: 60;
  min-width: 168px;
  max-width: 268px;
  max-height: 22rem;
  overflow: auto;
  padding: 8px;
  border-radius: 8px;
  background: #252526;
  color: #d4d4d4;
  border: 1px solid rgba(255,255,255,.12);
  box-shadow: 0 8px 24px rgba(0,0,0,.4);
  font-family: ui-sans-serif, system-ui, sans-serif;
}
#${DATA_MENU_ID} {
  position: fixed;
  z-index: 60;
  box-sizing: border-box;
  width: 23rem;
  max-width: calc(100vw - 1.5rem);
  max-height: 24rem;
  overflow: auto;
  padding: 0.5rem;
  border-radius: 0.5em;
  background: #252526;
  color: #d4d4d4;
  border: 1px solid rgba(255,255,255,.12);
  box-shadow: 0 0.5em 1.5em rgba(0,0,0,.4);
  font-family: ui-sans-serif, system-ui, sans-serif;
  font-size: 0.75rem;
}
#${DATA_MENU_ID} [data-sve-data-search] {
  display: flex;
  align-items: center;
  gap: 0.5em;
  box-sizing: border-box;
  height: 2.2rem;
  padding: 0 0.6em;
  margin-bottom: 0.45rem;
  border-radius: 0.45em;
  border: 1px solid rgba(255,255,255,.18);
  background: rgba(0,0,0,.28);
}
#${DATA_MENU_ID} [data-sve-data-search]:focus-within {
  border-color: rgba(147,197,253,.7);
}
#${DATA_MENU_ID} [data-sve-data-search] svg {
  flex: 0 0 auto;
  opacity: .5;
}
#${DATA_MENU_ID} [data-sve-data-input] {
  all: unset;
  flex: 1 1 auto;
  min-width: 0;
  color: inherit;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.75rem;
}
#${DATA_MENU_ID} [data-sve-data-tabs] {
  display: flex;
  gap: 0.2rem;
  margin-bottom: 0.45rem;
  padding: 0.15rem;
  border-radius: 0.45em;
  background: rgba(0,0,0,.28);
}
#${DATA_MENU_ID} [data-sve-data-tab] {
  all: unset;
  flex: 1 1 0;
  box-sizing: border-box;
  padding: 0.35em 0;
  border-radius: 0.35em;
  cursor: pointer;
  text-align: center;
  font-size: 0.6875rem;
  opacity: .65;
}
#${DATA_MENU_ID} [data-sve-data-tab]:hover { opacity: 1; }
#${DATA_MENU_ID} [data-sve-data-tab][data-active] {
  opacity: 1;
  background: rgba(255,255,255,.14);
}
#${DATA_MENU_ID} [data-sve-data-group] {
  padding: 0.6em 0.5em 0.25em;
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: .06em;
  text-transform: uppercase;
  opacity: .45;
}
#${DATA_MENU_ID} [data-sve-data-option] {
  all: unset;
  box-sizing: border-box;
  display: flex;
  align-items: baseline;
  gap: 0.5em;
  width: 100%;
  padding: 0.35em 0.5em;
  border-radius: 0.35em;
  cursor: pointer;
}
#${DATA_MENU_ID} [data-sve-data-option]:hover,
#${DATA_MENU_ID} [data-sve-data-option][data-cursor] {
  background: rgba(255,255,255,.1);
}
#${DATA_MENU_ID} [data-sve-data-name] {
  flex: 0 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}
#${DATA_MENU_ID} [data-sve-data-parent] {
  flex: 0 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.625rem;
  opacity: .4;
}
#${DATA_MENU_ID} [data-sve-data-value] {
  flex: 0 1 auto;
  margin-left: auto;
  max-width: 45%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: right;
  font-size: 0.6875rem;
  opacity: .5;
}
#${DATA_MENU_ID} [data-sve-data-loop] {
  flex: 0 0 auto;
  margin-left: auto;
  padding: 0.1em 0.45em;
  border-radius: 0.3em;
  background: rgba(255,255,255,.1);
  font-size: 0.5625rem;
  letter-spacing: .04em;
  text-transform: uppercase;
  opacity: .6;
}
#${DATA_MENU_ID} [data-sve-data-empty] {
  padding: 0.5em;
  opacity: .55;
}
#${DOCK_ID} [data-sve-data-vars],
#${DOCK_ID} [data-sve-html-tidy] {
  pointer-events: auto;
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 1.65em;
  height: 1.65em;
  margin-right: 0.35em;
  padding: 0;
  border: 0;
  border-radius: 0.3em;
  background: transparent;
  color: #d4d4d4;
  opacity: .62;
  cursor: pointer;
}
#${DOCK_ID} [data-sve-data-vars] span,
#${DOCK_ID} [data-sve-html-tidy] svg {
  display: flex;
  line-height: 1;
}
#${DOCK_ID} [data-sve-data-vars]:hover,
#${DOCK_ID} [data-sve-data-vars][data-open],
#${DOCK_ID} [data-sve-html-tidy]:hover {
  background: rgba(255,255,255,.16);
  opacity: 1;
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
  display: flex;
  align-items: baseline;
  gap: 8px;
  width: 100%;
  box-sizing: border-box;
  padding: 5px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
}
#${CSS_MENU_ID} [data-sve-css-choice-label] {
  flex: 1 1 auto;
  min-width: 0;
}
/* What the row actually writes, in the corner of the row that writes it. Dim,
   because it is the answer to a second question, not the first. */
#${CSS_MENU_ID} [data-sve-css-choice-hint] {
  flex: 0 0 auto;
  opacity: .45;
  font-size: 10px;
}
#${CSS_MENU_ID} [data-sve-css-head-row] {
  display: block;
  padding: 8px 8px 3px;
  font-family: ui-sans-serif, system-ui, sans-serif;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: .04em;
  text-transform: uppercase;
  opacity: .55;
}
#${CSS_MENU_ID} [data-sve-css-head-row]:first-child {
  padding-top: 2px;
}
#${CSS_MENU_ID} [data-sve-css-note-row] {
  display: block;
  padding: 6px 8px 2px;
  font-family: ui-sans-serif, system-ui, sans-serif;
  font-size: 10px;
  line-height: 1.45;
  opacity: .5;
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
/* Antlers. The partial call keeps its own amber; everything else that decides
   what renders is one colour, and what closes a block is that colour held back,
   so an opening line and its closing line do not read as the same thing. */
#${DOCK_ID} .sve-cm-antlers {
  color: #b9a6ff;
}
#${DOCK_ID} .sve-cm-antlers-close {
  color: #8d7fc4;
}
#${DOCK_ID} .sve-cm-antlers-comment {
  color: #6b8f6b;
  font-style: italic;
}
#${DOCK_ID} .sve-cm-partial {
  text-decoration: underline dotted;
  text-underline-offset: 3px;
  background: rgba(251,191,36,.16);
  /* Text, because the left button writes here now. The underline still says
     there is a file behind it; the right button is what opens it. */
  cursor: text;
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
  font-size: 13px;
  /* A sentence now — "Open image" — not a file name, and the same face the
     HTML tree's row menu uses. */
  font-family: ui-sans-serif, system-ui, sans-serif;
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
`);
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

  for (const handle of PANES) {
    const btn = dock.querySelector(`[data-sve-code-pane-btn="${handle}"]`);

    out[handle] = btn ? btn.getAttribute('aria-pressed') === 'true' : stored[handle];
  }

  return out;
}

function paintPaneButtons(dock, panes) {
  for (const handle of PANES) {
    const btn = dock.querySelector(`[data-sve-code-pane-btn="${handle}"]`);
    const pane = dock.querySelector(`[data-sve-code-pane="${handle}"]`);

    if (btn) {
      btn.setAttribute('aria-pressed', panes[handle] ? 'true' : 'false');
    }

    if (pane) {
      pane.style.display = panes[handle] ? 'flex' : 'none';
    }
  }

  const visible = PANES.filter((handle) => panes[handle]);

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

  for (const handle of PANES) {
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
/** The dock's drag: the shared overlay drag plus this module's `dragging` flag. */
function beginDockDrag(win, cursor, onMove, onEnd) {
  dragging = true;

  beginOverlayDrag(
    win,
    cursor,
    onMove,
    () => {
      dragging = false;
      onEnd?.();
    },
    'data-sve-code-drag-shield'
  );
}

function bindResize(win, dock) {
  if (dock._sveResizeBound) {
    return;
  }

  dock._sveResizeBound = true;

  const startResize = (event) => {
    // Anything you can operate is not a place to grab the dock by. This used to
    // be a hand-kept list of every button in the bar, and the cost of missing
    // one is invisible and total: pressing it starts a drag, the drag shield
    // goes up under the cursor, the pointer comes up on the shield instead of
    // on the button, and the browser never makes a click at all. The button
    // looks right, lights nothing, does nothing, and there is no error to find.
    // `[data-sve-values-mode]` was the one missing, and the ID button was dead
    // for as long as it existed.
    //
    // The bar is still draggable — by the grip above it, and by the empty space
    // between the controls, which is what people reach for anyway.
    if (event.button !== 0 || event.target.closest(
      'button, a, input, select, textarea, label, [role="button"], [contenteditable], .cm-editor'
    )) {
      return;
    }

    event.preventDefault();

    const startY = event.clientY;
    const startH = dock.getBoundingClientRect().height;
    let next = startH;

    beginDockDrag(
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
      const visible = PANES.filter((handle) => panesOf(win, dock)[handle]);
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

      beginDockDrag(
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
  const containers = typeof activeContainers === 'function' ? activeContainers(win.document) : [];

  for (const container of containers) {
    const values = unwrapRef(container.values) || container.values;

    if (!values || typeof values !== 'object') {
      continue;
    }

    if (uid && typeof findPathByUid === 'function') {
      const path = findPathByUid(values, uid);

      if (path) {
        const parts = path.split('.');
        const section = dataGet(values, parts.slice(0, 2).join('.'));

        if (section && typeof section === 'object') {
          return section;
        }
      }
    }
  }

  for (const container of containers) {
    const values = unwrapRef(container.values) || container.values;

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

  // The ID is the file's own instance layer, not the tag you have picked, and
  // the tree scope rebuilds the pane from the picked tag's classes — a view
  // the `#id-` rule is not in. So showing the ID shows the file.
  if (cssValues || !htmlScopePref || !htmlScopeActive) {
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
    applyCssFolds(lastWin, true);
    paintCssToolState(lastWin);

    if (created) {
      onEditorInput(lastWin);
    }
  }
}

/**
 * Show only the focused range in the HTML pane.
 *
 * `caret` is a position in the whole file — the point the tree asked to be put
 * inside — and is translated into this slice. Without one the caret sits at the
 * start of the slice, which is in front of the opening tag: everything written
 * next then lands outside the very row that was picked.
 */
function showHtmlScope(caret) {
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

  const at = caret == null ? 0 : Math.max(0, Math.min(caret - from, to - from));

  writeHtmlEditor(htmlFull.slice(from, to), { anchor: at, head: at });
  applyCssScope();
  view.focus();
}

function showHtmlFull(selectFocus = true, caret = null) {
  const view = editors.html;

  if (!view) {
    return;
  }

  flushCssScope();
  syncScopedHtml();
  htmlScopeActive = false;

  const full = htmlFull || view.state.doc.toString();
  // A caret beats the range: the tree asked to be put inside the row, not to
  // have it selected.
  const selection =
    caret != null
      ? { anchor: Math.max(0, Math.min(caret, full.length)) }
      : selectFocus && htmlFocusOk(htmlFocus?.from, htmlFocus?.to, full.length)
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
  return !!win?.document.getElementById(HTML_TREE_PANEL_ID);
}

function syncHtmlTree(win, open) {
  if (!win || featureOn(win, 'html_tree') === false) {
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
  const shown = featureOn(win, 'html_tree') === false
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
    if (treeOpening || featureOn(win, 'html_tree') === false) {
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
      // A size block nobody wrote in is a door held open, not a rule. It is
      // shown while you are looking around and taken out on the way to disk.
      parts.css = lastWin ? stripEmptySizeBlocks(cssFull, cssSizeRows(lastWin)) : cssFull;

      // And a class written at the top of the file belongs in the section's
      // scope. Only moved where there is a scope on the element to move it
      // into, and never a selector built with Antlers — see css-scope-move.js.
      parts.css = moveClassesIntoScope(parts.css, parts.html, SCOPE_CLASS);
    } else {
      parts[handle] = editors[handle]?.state.doc.toString() ?? '';
    }
  }

  return parts;
}

function cssEditorText() {
  if (cssValues || !(htmlScopePref && htmlFocusOk(htmlFocus?.from, htmlFocus?.to, htmlFull.length))) {
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
    // The Tailwind row holds offsets into the file it was drawn from, and the
    // whole file just changed under it. The editor's own update listener is no
    // help here: it is skipped while `applying` is on, which is exactly when a
    // load, an unlock or a refresh swaps the document. Without this the row
    // kept pointing at the section's tag after a component was opened, and the
    // + menu wrote nothing because those offsets no longer land on a `<`.
    syncTwTarget(lastWin);
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

/**
 * The selector in front of a rule's `{`.
 *
 * Read backwards to the previous `}`, `{` or `;` — whatever closed the last
 * thing — which is where this rule's own prelude starts.
 */
function cssRuleSelector(view, rule) {
  if (!rule) {
    return '';
  }

  const text = view.state.doc.toString();
  let from = 0;

  for (let i = rule.open - 1; i >= 0; i -= 1) {
    if (text[i] === '}' || text[i] === '{' || text[i] === ';') {
      from = i + 1;
      break;
    }
  }

  return text.slice(from, rule.open).replace(/\/\*[\s\S]*?\*\//g, '').trim();
}

/**
 * The rule a state button points at — `.card:hover` beside `.card`.
 *
 * Made if it is not there yet, directly after the rule it belongs to, because
 * that is where a person would have written it. Returns the rule to write into,
 * or null when there is nothing to hang a state off.
 */
/**
 * Find or make the nested block a state writes into — `&:hover` inside the rule.
 *
 * Nested, not a second rule beside it: that is how these stylesheets are
 * written, and `&:hover` moves with the rule if the selector is ever renamed.
 * A `.card:hover` written before is still recognised, so an older file is not
 * given a second, nested one saying the same thing.
 */
function cssStateRule(view, rule) {
  if (!cssState || !rule) {
    return rule;
  }

  const found = cssExistingStateRule(view, rule);

  if (found) {
    return found;
  }

  const selector = cssRuleSelector(view, rule);

  if (!selector || selector.startsWith('@')) {
    return rule;
  }

  const text = view.state.doc.toString();
  const outer = leadingCssIndent(text, rule.open);
  const indent = leadingCssIndent(text, rule.to) || `${outer}    `;
  const tail = (view.state.doc.sliceString(rule.from, rule.to).match(/\n([^\S\n]*)$/) || [null, null])[1];
  const at = tail === null ? rule.to : rule.to - tail.length;
  const insert = `\n${indent}&${cssStateSuffix()} {\n${indent}}\n${tail ?? outer}`;

  view.dispatch({ changes: { from: at, to: rule.to, insert } });

  // Offsets moved with the insert, so the new block is located in the new
  // text rather than through the rule object, which is now stale.
  const next = view.state.doc.toString();
  const open = next.indexOf('{', at + insert.indexOf('&'));
  const close = open === -1 ? -1 : matchBraces(next, open);

  return close === -1
    ? rule
    : { from: open + 1, to: close, text: next.slice(open + 1, close), open };
}

/** The whitespace at the start of the line a position sits on. */
function leadingCssIndent(text, pos) {
  const start = text.lastIndexOf('\n', pos - 1) + 1;
  const prefix = text.slice(start, pos);

  return (prefix.match(/^\s*/) || [''])[0];
}

function applyRuleDecls(updates) {
  const view = editors.css;

  if (!view || view.state.readOnly || !updates.length) {
    return;
  }

  const atCursor = cssRuleAtCursor();
  // A state is a second rule, not a second declaration: `:hover` belongs on
  // the selector. Only make one when there is something to put in it —
  // clearing a property must never leave an empty `:hover` behind.
  const rule = updates.some((item) => item.value != null)
    ? cssStateRule(view, atCursor)
    : atCursor;

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
    // The closing brace usually sits on its own indented line. Writing *at*
    // the brace leaves that indent in front of the new declaration and pushes
    // the brace out to column nought — so swallow the whitespace and put the
    // brace back on a line of its own.
    const tail = (rule.text.match(/\n([^\S\n]*)$/) || [null, null])[1];
    const from = tail === null ? rule.to : rule.to - tail.length;
    const close = tail === null ? '' : tail;

    changes.push({ from, to: rule.to, insert: `${prefix}${inserts.join('\n')}\n${close}` });
  }

  if (changes.length) {
    changes.sort((a, b) => b.from - a.from || b.to - a.to);
    view.dispatch({ changes });
  }

  finishCssEdit();
}

function currentFlexDecls() {
  const view = editors.css;
  const rule = cssRuleAtCursor();

  if (!rule) {
    return {};
  }

  // With a state picked, the row must light up for what `.card:hover` has —
  // otherwise every button looks off the moment you switch to hover.
  if (cssState && view) {
    const stateRule = cssExistingStateRule(view, rule);

    return stateRule ? parseCssDecls(stateRule.text) : {};
  }

  return parseCssDecls(rule.text);
}

/**
 * The block a state already has — never made, only found.
 *
 * `&:hover` nested inside the rule first, because that is what gets written
 * now; then `.card:hover` anywhere in the file, because that is what older
 * files say. Either way it is one block, and there is never a second.
 */
function cssExistingStateRule(view, rule) {
  const selector = cssRuleSelector(view, rule);
  const suffix = cssStateSuffix();

  if (!selector || selector.startsWith('@')) {
    return null;
  }

  if (selector.endsWith(suffix)) {
    return rule;
  }

  const text = view.state.doc.toString();
  const block = (open) => {
    const close = matchBraces(text, open);

    return close === -1 ? null : { from: open + 1, to: close, text: text.slice(open + 1, close), open };
  };

  for (const wanted of [`&${suffix}`, `${selector}${suffix}`]) {
    const re = new RegExp(`(^|[^\\w-])${wanted.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\{`, 'g');
    let m;

    while ((m = re.exec(text))) {
      const open = text.indexOf('{', m.index);

      // The nested one only counts inside this rule; a `&:hover` under some
      // other selector is some other tag's hover.
      if (wanted.startsWith('&') && (open < rule.from || open > rule.to)) {
        continue;
      }

      const hit = block(open);

      if (hit) {
        return hit;
      }
    }
  }

  return null;
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
    // The head row answers the same three questions the tools do, off the same
    // cursor, so it is repainted on the same beat rather than on a timer.
    paintCssHead(win);
  } catch {
    /* invalid Antlers-in-CSS must not take down Live Preview */
  }
}

/**
 * Redraw the row from what the file says — both languages, one model.
 *
 * Nothing here reaches into the DOM. It fills `cssToolsUi`, the component
 * loops over it, and a tool and its children are lit, opened and clicked by
 * exactly the same rules because they are the same kind of thing.
 */
function paintCssToolStateInner(win) {
  const tw = styleMode === 'tw';
  const decls = tw ? {} : currentFlexDecls();
  // Is this a flex container? Asked of whichever language is on screen, so
  // alignment appears under the same condition in both.
  const flexOn = tw
    ? isFlexDisplay(twActiveClass('display'))
    : isFlexDisplay(decls.display);
  const flexDir = normalizeFlexValue(decls['flex-direction']) || (flexOn ? 'row' : '');

  /** Is this property set on the rule under the cursor / the picked tag? */
  const isSet = (item) => {
    if (tw) {
      return twHasNode() && !!item.tw && !!twActiveClass(item.tw);
    }

    return !!item.css && item.css in decls;
  };

  cssToolsUi.tools = CSS_TOOLS.map((tool) => {
    const kids = (tool.kids || [])
      // Alignment belongs to a flex container. Offering it on something that is
      // not one is offering to write a declaration that does nothing.
      .filter((kid) => kid.when !== 'flex' || flexOn)
      .map((kid) => ({
        id: kid.id,
        title: kid.title,
        icon: CSS_TOOL_ICONS[kid.icon] || '',
        sep: !!kid.sep,
        open: cssOpenMenu === kid.id,
        active: tw
          ? isSet(kid)
          : kid.kind === 'display'
            ? flexOn
            : kid.kind === 'flexDir'
              ? flexOn && flexDir === kid.value
              : kid.value
                ? normalizeFlexValue(decls[kid.css]) === normalizeFlexValue(kid.value)
                : isSet(kid),
      }));

    return {
      id: tool.id,
      title: tool.title,
      icon: CSS_TOOL_ICONS[tool.id] || TW_TOOL_ICONS[tool.id] || '',
      open: cssOpenTool === tool.id || cssOpenMenu === tool.id,
      kids,
      // A parent is lit when it is set, or when any of its children is: Padding
      // is on whether the file says `padding` or only `padding-block-start`.
      active: tool.value
        ? !tw && normalizeFlexValue(decls[tool.css]) === normalizeFlexValue(tool.value)
        : isSet(tool) || kids.some((kid) => kid.active),
    };
  });
}


function closeCssMenu(doc) {
  const menu = doc?.getElementById(CSS_MENU_ID);

  cssOpenMenu = '';

  menu?._sveApp?.unmount();
  menu?.remove();
  doc?.querySelectorAll('[data-sve-css-tool][data-open], [data-sve-html-tool][data-open], [data-sve-css-add-class][data-open], [data-sve-code-history][data-open]').forEach((el) =>
    el.removeAttribute('data-open')
  );
}

/** Close CSS/HTML tool menus and CodeMirror suggestions — they sit above Statamic pickers. */
export function closeCodeDockPopups(doc) {
  closeCssMenu(doc);
  closeDataMenu(doc);
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

/**
 * Pick a value for one property, from this site's own scale.
 *
 * `extra` is what the scale cannot answer — `auto`, `100%`, `fit-content`.
 * They go at the top, because on Width they are the usual answer and the
 * scale is the exception.
 */
/** A short, fixed list — `text-align` has four answers and always will. */
function openCssChoiceMenu(win, anchor, property, choices) {
  const doc = win.document;

  closeCssMenu(doc);
  anchor.setAttribute('data-open', '');

  const menu = doc.createElement('div');
  const current = currentFlexDecls()[property] || '';

  menu.id = CSS_MENU_ID;
  doc.body.appendChild(menu);
  placeCssMenu(win, anchor, menu);
  menu._sveApp = mountSurface(CodeDockMenu, menu, {
    kind: 'choices',
    choices: (choices || []).map((value) => ({
      value,
      label: value,
      active: normalizeFlexValue(value) === normalizeFlexValue(current),
    })),
    onPick: (value) => {
      // Clicking what is already set takes it off again, the same as every
      // other toggle in this row.
      const same = normalizeFlexValue(value) === normalizeFlexValue(currentFlexDecls()[property] || '');

      applyRuleDecls([{ property, value: same ? null : value }]);
      closeCssMenu(doc);
    },
  });
}

function openCssValueMenu(win, anchor, property, extra = []) {
  const doc = win.document;

  closeCssMenu(doc);
  anchor.setAttribute('data-open', '');
  twWantFamilies(win);

  const menu = doc.createElement('div');

  menu.id = CSS_MENU_ID;
  doc.body.appendChild(menu);
  placeCssMenu(win, anchor, menu);

  const paint = () => {
    const rows = [
      ...extra.map((value) => ({ value, label: value })),
      ...twValueOptions(win, property).map((option) => ({
        value: option.value,
        label: option.value,
      })),
    ];
    const current = currentFlexDecls()[property] || '';

    menu._sveApp?.unmount();
    menu._sveApp = mountSurface(CodeDockMenu, menu, {
      kind: 'choices',
      choices: rows.map((row) => ({
        ...row,
        active: normalizeFlexValue(row.value) === normalizeFlexValue(current),
      })),
      onPick: (value) => {
        applyRuleDecls([{ property, value: value || null }]);
        closeCssMenu(doc);
      },
    });
  };

  paint();

  // The theme is one fetch. Draw what is known now, and again when it lands —
  // the alternative is a menu that is empty the first time it is opened.
  loadThemeColors(win).then(() => {
    if (doc.getElementById(CSS_MENU_ID) === menu) {
      paint();
    }
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

function cssChrome(dock) {
  return dock?.querySelector('[data-sve-css-chrome]');
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

function insertHtmlSnippet(snippet, cursorFromStart, selectLength) {
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
      selection: caretRange(line.from + extra + cursorFromStart, selectLength),
    });

    return;
  }

  view.dispatch({
    changes: { from: pos, to: view.state.selection.main.to, insert },
    selection: caretRange(pos + extra + cursorFromStart, selectLength),
  });
}

/** A caret, or a selection over the placeholder the caret was put in front of. */
function caretRange(anchor, length) {
  return length ? { anchor, head: anchor + length } : { anchor };
}

/**
 * Tags whose button leaves the caret inside what it just wrote.
 *
 * Only the sectioning ones. A section is made in order to be filled, so the
 * next thing written belongs in it. Everything else stacks: click `div` four
 * times and you want four boxes side by side, not four boxes inside each
 * other — which is what leaving the caret between the tags gave you.
 *
 * Working *inside* an existing element is what picking its row in the tree is
 * for, and that puts the caret in any row, whatever its tag.
 */
const FILLED_TAGS = new Set([
  'section',
  'article',
  'header',
  'footer',
  'main',
  'nav',
  'aside',
]);

/**
 * The opening tag a toolbar button writes.
 *
 * A section carries the attributes the site configures for it, so a new one is
 * addressable and clickable in the preview from the moment it exists. Every
 * other tag opens bare.
 */
function openTagFor(tag) {
  if (tag !== 'section') {
    return `<${tag}>`;
  }

  const attrs = lastWin?.Statamic?.$config?.get?.('sveSectionTag');

  return typeof attrs === 'string' && attrs.trim() ? `<${tag} ${attrs.trim()}>` : `<${tag}>`;
}

/**
 * Put the indentation back in the pane.
 *
 * Whatever the pane holds: the whole file, or the one element the scope button
 * narrowed it to. A scoped pane is a fragment that starts somewhere indented,
 * so its own first line's indent goes back in front of every line — tidying a
 * piece of a file must not walk that piece to the left margin.
 */
function tidyHtmlPane() {
  const view = editors.html;

  if (!view || view.state.readOnly) {
    return;
  }

  const text = view.state.doc.toString();
  const lead = (text.match(/^[ \t]*/) || [''])[0];
  const tidy = tidyHtml(text)
    .split('\n')
    .map((line) => (line ? lead + line : line))
    .join('\n');

  if (tidy === text) {
    return;
  }

  dispatchHtmlChanges(view, [{ from: 0, to: text.length, insert: tidy }], { anchor: 0 });
  finishHtmlEdit();
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

    const open = openTagFor(tag);
    let insert = `${open}${selected}</${tag}>`;
    let innerFrom = sel.from + open.length;

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
    const open = openTagFor(tag);
    const snippet = `${open}</${tag}>`;

    insertHtmlSnippet(snippet, FILLED_TAGS.has(tag) ? open.length : snippet.length);
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

/**
 * Pick which tag to write: the six headings, or the text tags.
 *
 * One button per kind, not one per tag. `h2` and `h3` are the same decision
 * made twice, and so are `p` and `span` — the row of buttons stays short
 * enough to read, and the choice is made where it is made.
 */
function openHtmlTagMenu(win, anchor, tags) {
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
    choices: tags.map((tag) => ({
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

/**
 * Pick a component to write in at the cursor.
 *
 * The list is the folder, read fresh each time the button is used — a
 * component made a moment ago in the tree has to be here without a reload.
 */
function openHtmlComponentMenu(win, anchor) {
  const doc = win.document;

  closeCssMenu(doc);
  anchor.setAttribute('data-open', '');

  const menu = doc.createElement('div');

  menu.id = CSS_MENU_ID;
  doc.body.appendChild(menu);
  placeCssMenu(win, anchor, menu);

  const paint = (choices) => {
    if (!doc.getElementById(CSS_MENU_ID)) {
      return;
    }

    menu._sveApp?.unmount();
    menu._sveApp = mountSurface(CodeDockMenu, menu, {
      kind: 'choices',
      choices,
      onPick: (tag) => {
        if (tag) {
          insertHtmlSnippet(tag, tag.length);
          finishHtmlEdit();
        }

        closeCssMenu(doc);
      },
    });
    placeCssMenu(win, anchor, menu);
  };

  paint([{ value: '', label: t(win, 'code_dock_loading') }]);

  win
    .fetch('/!/sve/components', {
      credentials: 'same-origin',
      headers: { 'X-Requested-With': 'XMLHttpRequest', Accept: 'application/json' },
    })
    .then((res) => (res.ok ? res.json() : { items: [] }))
    .then((data) => {
      const items = Array.isArray(data.items) ? data.items : [];

      paint(
        items.length
          ? items.map((item) => ({ value: item.tag, label: item.name }))
          : [{ value: '', label: t(win, 'component_none') }]
      );
    })
    .catch(() => paint([{ value: '', label: t(win, 'component_none') }]));
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

  // The strip shows the picked tag's Tailwind classes over the preview. In CSS
  // mode there are no chips to show, so the button has nothing to switch — and
  // a switch that does nothing is worse than no switch.
  btn.hidden = styleMode !== 'tw';

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
  return styleMode === 'tw' ? htmlTargetFromCursor(win) : null;
}

/**
 * The tag the HTML cursor is inside, whichever language the style pane is in.
 *
 * Both rows point at the same thing and should say the same thing, so they ask
 * the same function — the mode only decides who is listening.
 */
function htmlTargetFromCursor(win) {
  const view = editors.html;

  if (!view) {
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

function paintValuesMode(win) {
  const dock = win?.document.getElementById(DOCK_ID);
  const btn = dock?.querySelector('[data-sve-values-mode]');

  if (!dock || !btn) {
    return;
  }

  dock.setAttribute('data-sve-values', cssValues ? 'on' : 'off');

  const text = win.document.createElement('span');

  text.textContent = t(win, 'code_dock_values');
  btn.innerHTML = ID_MODE_ICON;
  btn.appendChild(text);
  btn.title = t(win, cssValues ? 'code_dock_values_off' : 'code_dock_values_on');
  btn.setAttribute('aria-label', btn.title);
  btn.setAttribute('aria-pressed', cssValues ? 'true' : 'false');
}

/**
 * Make this size's own rule if it has none yet, and put the cursor in it.
 *
 * Same promise the size blocks make: here is somewhere to write. Empty, it is
 * faded and never saved — so turning the ID on and off again leaves the file
 * exactly as it was, and a section that has no values yet still has a door to
 * them.
 *
 * One rule per size, not one per section: a value that changes on mobile has
 * to be written where mobile can see it, so the button opens the rule for the
 * size the panel is on and makes the block around it if that is missing too.
 */
function enterValuesRule(win) {
  const view = editors.css;

  if (!view || view.state.readOnly) {
    return;
  }

  const rows = cssSizeRows(win);
  const text = view.state.doc.toString();
  const found = idRulesForSize(text, rows, cssSize);

  // The caret is the whole answer to "did anything happen". Put it in the rule
  // and take the focus with it: a caret in a pane nobody is typing in does not
  // blink, so the rule opened and the editor still looked untouched.
  view.focus();

  if (found.length) {
    const node = found[0];
    const at = Math.min(node.bodyTo, node.bodyFrom
      + (text.slice(node.bodyFrom).match(/^[^\S\n]*\n?/) || [''])[0].length);

    view.dispatch({ selection: { anchor: at }, scrollIntoView: true });

    return;
  }

  const row = cssSizeRow(win, cssSize);

  // All and the base share one rule, and it goes at the top of the file: the
  // values come before the design that reads them, and there is no block to
  // put them in.
  if (!row || row.base) {
    const head = '#id-{{ id }} {\n    ';

    view.dispatch({
      changes: { from: 0, to: 0, insert: `${head}\n}\n\n` },
      selection: { anchor: head.length },
      scrollIntoView: true,
    });

    return;
  }

  const block = blocksForSize(text, rows, cssSize)[0];

  // A narrower size writes its rule inside its own block, at the top of it —
  // same reason the base one is at the top of the file.
  if (block) {
    const indent = `${leadingCssIndent(text, block.from)}    `;
    const head = `\n${indent}#id-{{ id }} {\n${indent}    `;

    view.dispatch({
      changes: { from: block.bodyFrom, to: block.bodyFrom, insert: `${head}\n${indent}}\n` },
      selection: { anchor: block.bodyFrom + head.length },
      scrollIntoView: true,
    });

    return;
  }

  // No block for this size either. The rule and the block it lives in are one
  // thing to write, not a button that has to be clicked twice.
  const spot = newSizeBlockSpot(view, text);
  const inner = `${spot.indent}    `;

  // Unless the spot is already inside the ID rule — the shape where the sizes
  // are nested in it. There the block IS the size's layer, and naming the rule
  // again inside itself would read as `#id-… #id-…`: a descendant of itself,
  // matching nothing.
  const nested = idRulesForSize(text, rows, '')
    .some((node) => spot.at > node.bodyFrom && spot.at <= node.bodyTo);
  const head = nested
    ? `\n\n${spot.indent}@media ${newSizeQuery(row, text)} {\n${inner}`
    : `\n\n${spot.indent}@media ${newSizeQuery(row, text)} {\n${inner}#id-{{ id }} {\n${inner}    `;
  const tail = nested
    ? `\n${spot.indent}}${spot.suffix}`
    : `\n${inner}}\n${spot.indent}}${spot.suffix}`;

  view.dispatch({
    changes: { from: spot.at, to: spot.at, insert: `${head}${tail}` },
    selection: { anchor: spot.at + head.length },
    scrollIntoView: true,
  });
}

function setValuesMode(win, on) {
  cssValues = !!on;
  chromeSet(win, VALUES_MODE_KEY, cssValues ? '1' : '0');
  closeCssMenu(win.document);
  cssOpenTool = '';
  paintValuesMode(win);
  // The pane's content changes, not just what is folded in it: hiding the ID
  // hands the tree scope back whatever it had.
  flushCssScope();
  applyCssScope();

  if (cssValues) {
    enterValuesRule(win);
  }

  applyCssFolds(win, true);
  paintCssIdMark();
  paintCssHead(win);
  paintCssToolState(win);
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
  // Switching language closes whatever was open: the row is about to be the
  // other language's, and a group left open would be pointing at nothing.
  cssOpenTool = '';
  cssOpenMenu = '';

  // Tailwind has no per-instance layer — its classes are on the tag, not in a
  // rule — so switching language leaves the ID behind rather than showing a
  // button that would point at nothing.
  if (styleMode === 'tw' && cssValues) {
    cssValues = false;
    chromeSet(win, VALUES_MODE_KEY, '0');
  }

  paintStyleMode(win);
  paintValuesMode(win);
  paintStrip(win);
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
  paintAlpine(win);
  paintCssToolState(win);
}

/**
 * Which screen size the CSS pane is looking at, and which state it writes for.
 *
 * `cssSize` is a breakpoint handle, or '' for "all of them". It does two
 * things and no more: it puts the other sizes' `@media` blocks away, and it
 * parks the cursor inside this size's block — and because every tool in the
 * row writes into the rule the cursor is in, that is all it takes for a click
 * on Padding to land under the right size.
 *
 * What it deliberately does NOT do is rewrite the pane. The text in front of
 * you is the file on disk, every time. Folding is reversible; a filtered view
 * that has to be merged back is one parse away from losing an edit.
 */
const CSS_SIZE_KEY = 'sve-css-size';
const CSS_STATE_KEY = 'sve-css-state';

/** Pseudo-classes worth a button. `before`/`after` are elements, and say so. */
const CSS_STATES = ['hover', 'focus', 'focus-visible', 'active', 'disabled', 'before', 'after'];

let cssSize = '';
let cssState = '';

/** The folds this panel made, so a reader's own folds are never undone. */
let cssOwnFolds = new Set();

/** Size + block positions, so unchanged text is not re-folded on every key. */
let cssFoldSig = '';

/** The size rows as `css-sizes.js` wants them: handle, base, edge. */
function cssSizeRows(win) {
  return breakpoints(win).map((row) => ({
    handle: row.handle,
    base: row.base,
    max: row.max,
    media: row.media,
    media_px: row.media_px,
    label: row.label,
  }));
}

function cssSizeRow(win, handle) {
  return cssSizeRows(win).find((row) => row.handle === handle) || null;
}

/** The pseudo as it is written in CSS — `::before`, but `:hover`. */
function cssStateSuffix(state = cssState) {
  if (!state) {
    return '';
  }

  return state === 'before' || state === 'after' ? `::${state}` : `:${state}`;
}

/**
 * Put the other sizes away, and open this one.
 *
 * Runs on every size switch and after every load, because the ranges move
 * whenever the text does. Folds this code did not make are left alone — a
 * reader who folded something by hand keeps it folded.
 */
function applyCssFolds(win, force = false) {
  const view = editors.css;

  if (!view || !foldEffect || !unfoldEffect) {
    return;
  }

  const text = view.state.doc.toString();
  const sig = `${cssValues ? '1' : '0'}|${cssSize}|${cssMediaBlocks(text).map((b) => `${b.from}-${b.to}`).join(',')}`;

  // Typing inside a rule moves nothing that is folded. Re-folding on every
  // keystroke would be work for nothing, and a dispatch per character.
  if (!force && sig === cssFoldSig) {
    return;
  }

  cssFoldSig = sig;

  const rows = cssSizeRows(win);
  const wanted = new Map();
  // The size says what is on screen at all; the ID button says whether this
  // size's own `#id-` rule is one of the things on it. Off is the resting
  // state — the design is what the pane is for — so the rule folds away until
  // it is asked for, at every size and at All too.
  const ranges = [
    ...foldRangesForSize(text, rows, cssSize),
    ...(cssValues
      ? []
      : idRulesForSize(text, rows, cssSize).map((node) => ({ from: node.from, to: node.to }))),
  ];

  for (const range of ranges) {
    if (range.to > range.from) {
      wanted.set(`${range.from}:${range.to}`, { from: range.from, to: range.to });
    }
  }

  const effects = [];
  const present = new Set();

  foldedRanges(view.state).between(0, text.length, (from, to) => {
    const key = `${from}:${to}`;

    present.add(key);

    if (!wanted.has(key) && cssOwnFolds.has(key)) {
      effects.push(unfoldEffect.of({ from, to }));
    }
  });

  for (const [key, range] of wanted) {
    if (!present.has(key)) {
      effects.push(foldEffect.of(range));
    }
  }

  cssOwnFolds = new Set(wanted.keys());

  if (effects.length) {
    view.dispatch({ effects });
  }
}

/**
 * The `@media` spelling a size block this file does not have yet should use.
 *
 * Written in the spelling the file already uses. A file that says
 * `max-width: …px` throughout keeps saying it; everything else gets the
 * site's own unit, which is `em` unless the breakpoint says otherwise.
 *
 * Judged on the whole file, not on the pane: with the tree scope on, the pane
 * is a rebuilt view of one class and may hold no media query at all, and a
 * file written in px would quietly gain its first em one.
 */
function newSizeQuery(row, text) {
  const spelling = cssFull || text;

  return /max-width/i.test(spelling) && !/width\s*</i.test(spelling)
    ? row.media_px || row.media
    : row.media;
}

/**
 * Move the cursor into the size being looked at, making its block if needed.
 *
 * A size with nowhere to write is the whole reason this exists: clicking
 * Tablet on a section that has never had a tablet rule should leave you with
 * an empty tablet block and the cursor in it, not with a button that lit up
 * and did nothing.
 */
function enterCssSize(win, handle) {
  const view = editors.css;

  if (!view || view.state.readOnly) {
    return;
  }

  const rows = cssSizeRows(win);
  const row = cssSizeRow(win, handle);
  const text = view.state.doc.toString();

  if (!row || row.base) {
    // The base is what is left over when no size applies — it has no block of
    // its own to step into. All that is needed is to step *out* of one, and
    // only if the cursor is in one; otherwise the click moves nothing.
    const head = view.state.selection.main.head;
    const inside = cssMediaBlocks(text).find((block) => head >= block.from && head <= block.to);

    if (inside) {
      view.dispatch({ selection: { anchor: inside.from }, scrollIntoView: true });
    }

    return;
  }

  const existing = blocksForSize(text, rows, handle);

  if (existing.length) {
    const block = existing[0];
    const at = Math.min(block.bodyTo, block.bodyFrom + (text.slice(block.bodyFrom).match(/^[^\S\n]*\n?/) || [''])[0].length);

    view.dispatch({ selection: { anchor: at }, scrollIntoView: true });

    return;
  }

  const query = newSizeQuery(row, text);
  const spot = newSizeBlockSpot(view, text);
  const insert = `\n\n${spot.indent}@media ${query} {\n${spot.indent}    \n${spot.indent}}${spot.suffix}`;

  view.dispatch({
    changes: { from: spot.at, to: spot.at, insert },
    selection: { anchor: spot.at + insert.lastIndexOf('    ') + 4 },
    scrollIntoView: true,
  });
}

/**
 * Where a size that does not exist yet should be written.
 *
 * Beside its siblings if there are any — these templates keep the sizes
 * together at the bottom of the rule they belong to, and one written somewhere
 * else is one nobody finds again. With no siblings it goes at the end of the
 * rule the cursor is in, which is the rule whose declarations it overrides.
 * Only a cursor in no rule at all falls back to the end of the file.
 */
function newSizeBlockSpot(view, text) {
  const blocks = cssMediaBlocks(text);

  if (blocks.length) {
    const last = blocks[blocks.length - 1];

    return { at: last.to, indent: leadingCssIndent(text, last.from), suffix: '' };
  }

  const inside = (rule) => ({
    // Just inside the closing brace, indented like the rule's own contents.
    at: rule.to,
    indent: leadingCssIndent(text, rule.to) || `${leadingCssIndent(text, rule.open)}    `,
    // The brace we are writing in front of has to keep its own line, or the
    // rule ends `}}` and the next reader has to count them.
    suffix: `\n${leadingCssIndent(text, rule.open)}`,
  });

  const rule = cssRuleAtCursor();

  if (rule) {
    return inside(rule);
  }

  // No siblings, and the cursor is in none of them. These panes are almost
  // always one rule — `#id-… { … }` in a section, the focused class with the
  // tree scope on — and a size written outside it is a size that belongs to
  // nothing. Only a pane with no single rule to speak of falls back to the end.
  const only = soleTopLevelRule(text);

  return only ? inside(only) : { at: text.length, indent: '', suffix: '' };
}

/** The one rule a pane consists of, or null when it is not shaped like that. */
function soleTopLevelRule(text) {
  const source = String(text || '');
  let found = null;
  let i = 0;
  let chunkStart = 0;

  while (i < source.length) {
    if (source[i] === '}' || source[i] === ';') {
      i += 1;
      chunkStart = i;
      continue;
    }

    if (source[i] !== '{') {
      i += 1;
      continue;
    }

    const close = matchBraces(source, i);

    if (close === -1) {
      return null;
    }

    if (found) {
      // A second one: there is no "the" rule to put it in.
      return null;
    }

    const prelude = source.slice(chunkStart, i).trim();

    // An at-rule is not a home for a size — `@media` inside `@media` is a
    // narrowing nobody asked for, and `@import` has no body to write in.
    found = prelude.startsWith('@') ? null : { from: chunkStart, open: i, to: close };

    if (!found) {
      return null;
    }

    i = close + 1;
    chunkStart = i;
  }

  return found;
}

function setCssSize(win, handle) {
  const next = handle === cssSize ? '' : handle;

  cssSize = next;
  chromeSet(win, CSS_SIZE_KEY, next);

  // Move the preview with it, the way the Tailwind row does. Through the
  // toolbar's own door so the block-order bookkeeping it does still happens.
  // "All" is Fit: no size filter on the row, no frame around the preview.
  ask('lp:set-device', { win, key: next ? bpDevice(next, win) : 'Responsive' });

  if (next) {
    enterCssSize(win, next);
  }

  // The ID is a layer inside a size, not a view instead of one: with it
  // showing, changing size changes which `#id-` rule you are writing in —
  // making it, and the block around it, the same as the button would.
  if (cssValues) {
    enterValuesRule(win);
  }

  applyCssFolds(win, true);
  paintCssIdMark();
  paintCssHead(win);
  paintCssToolState(win);
}

function setCssState(win, state) {
  cssState = CSS_STATES.includes(state) ? state : '';
  chromeSet(win, CSS_STATE_KEY, cssState);
  closeCssMenu(win.document);
  paintCssHead(win);
  paintCssToolState(win);
}

function openCssStateMenu(win, anchor) {
  const doc = win.document;

  closeCssMenu(doc);
  anchor.setAttribute('data-open', '');

  const menu = doc.createElement('div');

  menu.id = CSS_MENU_ID;
  doc.body.appendChild(menu);
  placeCssMenu(win, anchor, menu);
  menu._sveApp = mountSurface(CodeDockMenu, menu, {
    kind: 'choices',
    choices: [
      { value: '', label: t(win, 'css_state_none'), active: !cssState },
      ...CSS_STATES.map((key) => ({
        value: key,
        label: cssStateSuffix(key),
        active: key === cssState,
      })),
    ],
    onPick: (key) => setCssState(win, key),
  });
}

/**
 * The row above the CSS editor: which tag, which size, which state.
 *
 * The tag is the one the HTML cursor is in — the same answer the Tailwind row
 * gives, because it is the same question. Without it the CSS pane was the one
 * place in the dock that never said what it was pointed at.
 */
function paintCssHead(win) {
  const dock = win?.document.getElementById(DOCK_ID);
  const host = dock?.querySelector('[data-sve-css-head]');

  if (!host) {
    return;
  }

  const target = htmlTargetFromCursor(win);
  const rows = cssSizeRows(win);
  const text = editors.css?.state.doc.toString() ?? '';

  cssUi.tag = target?.tag || '';
  cssUi.scope = bracketToken(target ? currentFullHtml().slice(target.from, target.openTo) : '') || '';
  cssUi.canEdit = !lastLocked;
  cssUi.onTag = (event) => twOpenTagMenuAt(win, event.currentTarget, target);
  cssUi.state = cssState;
  cssUi.stateLabel = cssState ? cssStateSuffix(cssState) : t(win, 'css_state');
  cssUi.onState = (event) => openCssStateMenu(win, event.currentTarget);
  cssUi.onSize = (key) => setCssSize(win, key);
  cssUi.sizes = [
    {
      key: '',
      label: t(win, 'tw_size_all'),
      title: t(win, 'css_size_all_title'),
      active: !cssSize,
    },
    ...rows.map((row) => {
      const has = row.base || blocksForSize(text, rows, row.handle).length > 0;

      return {
        key: row.handle,
        label: row.label,
        title: row.base
          ? t(win, 'css_size_base_title')
          : `@media ${row.media}${has ? '' : `  ·  ${t(win, 'css_size_new')}`}`,
        active: cssSize === row.handle,
      };
    }),
  ];

  // Mounted once. `cssUi` is reactive, so every later repaint is a write to
  // the store — remounting on each keystroke would throw the row away and
  // build it again sixty times a second.
  if (!host._sveMounted) {
    host._sveMounted = true;
    mountPane(host, CodeDockCssHead);
  }
}

/**
 * The preview's device buttons move the CSS row with them.
 *
 * Same rule as the Tailwind row: the size you are looking at is the size you
 * are editing. Fit is not a size, so it clears the filter rather than picking
 * one — that is the view where you want to see the whole file.
 */
on('lp:device', (key) => {
  const win = lastWin;

  if (!win || !isCodeDockOpen(win.document)) {
    return;
  }

  // Fit, and any name this site does not have, mean no filter at all.
  const next = breakpoints(win).find((item) => item.device === key)?.handle || '';

  if (next === cssSize) {
    return;
  }

  cssSize = next;
  chromeSet(win, CSS_SIZE_KEY, next);
  applyCssFolds(win, true);
  paintCssIdMark();
  paintCssHead(win);
  paintCssToolState(win);
});

/* ------------------------------------------------------------------ *
 * Alpine — the fourth pane
 * ------------------------------------------------------------------ */

/**
 * Write one attribute onto the tag the HTML cursor is in.
 *
 * Replaces it if the tag already has it, otherwise adds it right after the tag
 * name — where a person would put it, and where it reads first. An empty value
 * is written bare (`x-cloak`, `x-transition`), because that is how Alpine's own
 * documentation writes them and a `=""` looks like something went wrong.
 */
function setAlpineAttr(win, name, value) {
  const view = editors.html;
  const target = htmlTargetFromCursor(win);

  if (!view || view.state.readOnly || !target) {
    return;
  }

  const scoped = htmlScopeActive && !!htmlFocus;
  const offset = scoped ? htmlFocus.from : 0;
  const html = scoped ? htmlFull : view.state.doc.toString();
  const open = html.slice(target.from, target.openTo);
  const written = value === '' ? name : `${name}="${value}"`;
  const found = tagAttrs(open).find((attr) => attr.name === name);

  let next;

  if (found) {
    next = open.slice(0, found.from) + written + open.slice(found.to);
  } else {
    // After the tag name: `<div |x-data="…" class="…">`.
    const at = open.search(/\s|\/?>$/);

    next = at === -1 ? open : `${open.slice(0, at)} ${written}${open.slice(at)}`;
  }

  if (next === open) {
    return;
  }

  dispatchHtmlChanges(
    view,
    [{ from: target.from - offset, to: target.openTo - offset, insert: next }],
    null
  );
  paintAlpine(win);
}

function removeAlpineAttr(win, name) {
  const view = editors.html;
  const target = htmlTargetFromCursor(win);

  if (!view || view.state.readOnly || !target) {
    return;
  }

  const scoped = htmlScopeActive && !!htmlFocus;
  const offset = scoped ? htmlFocus.from : 0;
  const html = scoped ? htmlFull : view.state.doc.toString();
  const open = html.slice(target.from, target.openTo);
  const found = tagAttrs(open).find((attr) => attr.name === name);

  if (!found) {
    return;
  }

  let from = found.from;

  // Take the space in front with it, or the tag keeps widening.
  while (from > 0 && /\s/.test(open[from - 1])) {
    from -= 1;
  }

  const next = open.slice(0, from) + open.slice(found.to);

  dispatchHtmlChanges(
    view,
    [{ from: target.from - offset, to: target.openTo - offset, insert: next }],
    null
  );
  paintAlpine(win);
}

/** The `x-data` names in scope: this tag's, then whatever wraps it. */
function alpineStatesInScope(win) {
  const view = editors.html;

  if (!view) {
    return [];
  }

  const scoped = htmlScopeActive && !!htmlFocus;
  const html = scoped ? htmlFull : view.state.doc.toString();
  const target = htmlTargetFromCursor(win);
  const out = [];
  const rows = flattenHtmlTree(parseHtmlTree(html), new Set());

  for (const row of rows) {
    // An ancestor of the picked tag, or the tag itself: its state is readable
    // from here. A sibling's is not, and offering it would write a name that
    // resolves to nothing.
    if (!target || row.from > target.from || row.to < target.to) {
      continue;
    }

    const data = tagAttrs(html.slice(row.from, row.openTo)).find((attr) => attr.name === 'x-data');

    if (data) {
      out.push(...stateNames(data.value));
    }
  }

  return [...new Set(out)];
}

/**
 * The switches this tag declares itself, as opposed to the ones it inherits.
 *
 * The difference decides whether writing another `x-data` here would help. On
 * the tag that already holds one it adds a name to the same scope. On a tag
 * below it, it starts a *new* scope that hides the one above — so `@click`
 * written next to it would flip a different `open` than the one `x-show` is
 * watching, and nothing would ever line up.
 */
function alpineOwnStates(win) {
  const view = editors.html;
  const target = htmlTargetFromCursor(win);

  if (!view || !target) {
    return [];
  }

  const scoped = htmlScopeActive && !!htmlFocus;
  const html = scoped ? htmlFull : view.state.doc.toString();
  const data = tagAttrs(html.slice(target.from, target.openTo))
    .find((attr) => attr.name === 'x-data');

  return data ? stateNames(data.value) : [];
}

function openAlpineMenu(win, anchor) {
  const doc = win.document;

  closeCssMenu(doc);
  anchor.setAttribute('data-open', '');

  const states = alpineStatesInScope(win);
  const menu = doc.createElement('div');

  menu.id = CSS_MENU_ID;
  doc.body.appendChild(menu);
  placeCssMenu(win, anchor, menu);
  // Grouped, with the heading above each group and the attribute beside each
  // row. Flat, the list read as sixteen ways to say the same thing: nothing in
  // it said which row put state on the section, which one went on the button,
  // and which one went on the box that reacts.
  //
  // And until there is a switch to point at, the list is only the first group.
  // A trigger or a reaction written against a name nothing declares is the
  // worst failure Alpine has: no error, no warning, the thing simply never
  // happens — and the person who picked it has no way to find out why. Offering
  // it at all is the mistake, so step two appears when step one is done.
  const staged = !states.length;
  // Inherited: the switch lives on a tag above this one. Offering `x-data`
  // here offers the one thing that would break it — see `alpineOwnStates`.
  const inherited = !staged && !alpineOwnStates(win).length;
  const groups = ALPINE_GROUPS.filter((group) => (
    group.id === 'state' ? !inherited : !staged
  ));
  const choices = groups.flatMap((group) => {
    const rows = ALPINE_BEHAVIOURS.filter((item) => item.group === group.id);

    if (!rows.length) {
      return [];
    }

    return [
      {
        value: `\u0000${group.id}`,
        label: t(win, staged && group.id === 'state' ? 'alpine_group_state_first' : group.lang),
        heading: true,
      },
      ...rows.map((item) => ({
        value: item.id,
        label: t(win, item.label),
        hint: behaviourHint(item),
      })),
    ];
  });

  if (staged) {
    // Why the list is short, in the list. Without it the menu looks broken.
    choices.push({ value: '\u0000note', label: t(win, 'alpine_needs_state'), note: true });
  }

  menu._sveApp = mountSurface(CodeDockMenu, menu, {
    kind: 'choices',
    choices,
    onPick: (id) => {
      const behaviour = ALPINE_BEHAVIOURS.find((item) => item.id === id);

      closeCssMenu(doc);

      if (!behaviour) {
        return;
      }

      if (!behaviour.needsName) {
        for (const attr of behaviour.attrs) {
          setAlpineAttr(win, attr.name, attr.value);
        }

        return;
      }

      askAlpineName(win, anchor, behaviour, states);
    },
  });
}

/**
 * Which state this behaviour is about.
 *
 * The names already in scope are offered first, because picking the same name
 * twice is how two tags end up talking to each other — and typing it a second
 * time is where the typo goes.
 */
function askAlpineName(win, anchor, behaviour, states) {
  const doc = win.document;
  const apply = (name) => {
    const clean = String(name || '').trim().replace(/[^\w$]/g, '');

    closeCssMenu(doc);

    if (!clean) {
      return;
    }

    for (const attr of fillName(behaviour.attrs, clean)) {
      setAlpineAttr(win, attr.name, attr.value.replace('|', ''));
    }
  };

  if (!states.length) {
    openAlpineNameInput(win, anchor, apply);

    return;
  }

  const menu = doc.createElement('div');

  menu.id = CSS_MENU_ID;
  doc.body.appendChild(menu);
  placeCssMenu(win, anchor, menu);
  menu._sveApp = mountSurface(CodeDockMenu, menu, {
    kind: 'choices',
    choices: [
      // Which switch, said out loud. Two menus in a row that look alike is how
      // you end up picking a name for a question you thought was about events.
      { value: '\u0000head', label: t(win, 'alpine_name'), heading: true },
      ...states.map((name) => ({ value: name, label: name })),
      { value: '\u0000new', label: t(win, 'alpine_new_name') },
    ],
    onPick: (value) => {
      if (value === '\u0000new') {
        openAlpineNameInput(win, anchor, apply);

        return;
      }

      apply(value);
    },
  });
}

function openAlpineNameInput(win, anchor, onDone) {
  const doc = win.document;

  closeCssMenu(doc);
  anchor.setAttribute('data-open', '');

  const menu = doc.createElement('div');

  menu.id = CSS_MENU_ID;
  doc.body.appendChild(menu);
  placeCssMenu(win, anchor, menu);
  menu._sveApp = mountSurface(CodeDockAddClass, menu, {
    label: t(win, 'alpine_name'),
    placeholder: t(win, 'alpine_name_placeholder'),
    onAdd: (value) => onDone(value),
  });
}

/** Draw the pane for whatever tag the HTML cursor is in. */
function paintAlpine(win) {
  const dock = win?.document.getElementById(DOCK_ID);
  const host = dock?.querySelector('[data-sve-alpine-host]');

  if (!host) {
    return;
  }

  const target = htmlTargetFromCursor(win);
  const view = editors.html;
  const scoped = htmlScopeActive && !!htmlFocus;
  const html = view ? (scoped ? htmlFull : view.state.doc.toString()) : '';
  const attrs = target ? tagAttrs(html.slice(target.from, target.openTo)) : [];

  alpineUi.tag = target?.tag || '';
  alpineUi.canEdit = !lastLocked && !!target;
  // "Start with a switch on the section" is the wrong thing to read with the
  // switch's own name sitting in the chip beside it.
  alpineUi.emptyText = t(
    win,
    target ? (alpineStatesInScope(win).length ? 'alpine_none_ready' : 'alpine_none') : 'alpine_pick'
  );
  alpineUi.addLabel = t(win, 'alpine_add');
  alpineUi.dropTitle = t(win, 'alpine_remove');
  alpineUi.states = alpineStatesInScope(win);
  alpineUi.chips = attrs
    .filter((attr) => attr.alpine)
    .map((attr) => ({
      id: attr.name,
      name: attr.name,
      value: attr.value,
      title: attr.value ? `${attr.name}="${attr.value}"` : attr.name,
    }));
  alpineUi.onAdd = (event) => openAlpineMenu(win, event.currentTarget);
  alpineUi.onDrop = (id) => removeAlpineAttr(win, id);
  alpineUi.onChip = (event, id) => {
    const chip = alpineUi.chips.find((item) => item.id === id);

    if (chip) {
      openAlpineNameInput(win, event.currentTarget, (value) => setAlpineAttr(win, id, value));
    }
  };

  if (!host._sveMounted) {
    host._sveMounted = true;
    mountPane(host, AlpinePanel);
  }
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

  // The size and the state are where the reader left them. A size this site no
  // longer has falls back to All rather than to a button that cannot light up.
  const storedSize = chromeGet(win, CSS_SIZE_KEY) || '';

  cssSize = breakpoints(win).some((row) => row.handle === storedSize) ? storedSize : '';
  cssState = CSS_STATES.includes(chromeGet(win, CSS_STATE_KEY)) ? chromeGet(win, CSS_STATE_KEY) : '';

  cssValues = chromeGet(win, VALUES_MODE_KEY) === '1';

  dock.querySelector('[data-sve-style-mode]')?.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    setStyleMode(win, styleMode === 'tw' ? 'css' : 'tw');
  });

  dock.querySelector('[data-sve-values-mode]')?.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    setValuesMode(win, !cssValues);
  });

  applyStyleMode(win);
  paintValuesMode(win);
}

/**
 * One click handler for the row, and one for the children.
 *
 * A tool with children opens them; a tool without does its own thing. A child
 * does its own thing and nothing else — it never opens anything, which is why
 * there is only one level to reason about.
 */
function bindCssTools(win, dock) {
  const host = dock.querySelector('[data-sve-css-tools]');

  if (!host || host._sveBound) {
    return;
  }

  host._sveBound = true;

  const btnFor = (id) => dock.querySelector(`[data-sve-css-tool="${id}"], [data-sve-css-kid="${id}"]`);

  /** What a click writes — the same for a tool and for one of its children. */
  const run = (item) => {
    const btn = btnFor(item.id);
    // A second click on the icon that opened the menu closes it again. Read
    // before closing, because closing is what forgets which one it was.
    const wasOpen = cssOpenMenu === item.id;

    closeCssMenu(win.document);

    if (wasOpen) {
      closeTwMenu(win);
      paintCssToolState(win);

      return;
    }

    if (!btn) {
      return;
    }

    // Only a menu is "open". A toggle does its thing and is done, so marking it
    // open would make the next click on it do nothing at all. Remembered AFTER
    // the menu is up: every opener closes whatever was there first, and that
    // is what forgets which icon it belonged to.
    const opensMenu = styleMode === 'tw'
      ? !item.twClass && !!item.tw
      : !item.kind && !item.value && !(item.css in currentFlexDecls()) && !!item.menu;
    const remember = () => {
      if (opensMenu) {
        cssOpenMenu = item.id;
      }
    };

    if (styleMode === 'tw') {
      closeTwMenu(win);

      // A fixed class is set outright; a scale opens its menu. Same two cases
      // as in CSS, where one is a value and the other is a list to pick from.
      if (item.twClass) {
        twSetClass(win, item.twClass);
        paintCssToolState(win);
      } else if (item.tw) {
        twOpenToolMenu(win, btn, item.tw, () => paintCssToolState(win));
        remember();
        paintCssToolState(win);
      }

      return;
    }

    if (item.kind === 'flexDir') {
      applyFlexDirection(item.value);

      return;
    }

    if (item.kind === 'display') {
      applyDisplay(item.value);

      return;
    }

    if (item.value) {
      // Clicking what is already set takes it off again. Every button in this
      // row is a toggle, so none of them is a surprise.
      const same = normalizeFlexValue(currentFlexDecls()[item.css]) === normalizeFlexValue(item.value);

      applyRuleDecls([{ property: item.css, value: same ? null : item.value }]);

      return;
    }

    if (item.css in currentFlexDecls()) {
      applyRuleDecls([{ property: item.css, value: null }]);
      paintCssToolState(win);

      return;
    }

    if (item.menu === 'colors') {
      openCssColorMenu(win, btn, item.css);
    } else if (item.menu === 'spacing') {
      openCssSpacingMenu(win, btn, item.css);
    } else if (item.menu === 'sizes') {
      openCssValueMenu(win, btn, item.css, CSS_LENGTHS);
    } else if (item.menu === 'choices') {
      openCssChoiceMenu(win, btn, item.css, item.choices);
    } else if (item.menu === 'values') {
      openCssValueMenu(win, btn, item.css);
    }

    remember();
    paintCssToolState(win);
  };

  cssToolsUi.onTool = (id) => {
    const tool = CSS_TOOL_INDEX.get(id)?.tool;

    if (!tool) {
      return;
    }

    if (tool.kids?.length) {
      // A tool with children is a door, not a switch.
      cssOpenTool = cssOpenTool === tool.id ? '' : tool.id;
      closeCssMenu(win.document);
      paintCssToolState(win);

      return;
    }

    run(tool);
  };

  cssToolsUi.onKid = (toolId, kidId) => {
    const found = CSS_TOOL_INDEX.get(kidId);

    if (found?.kid) {
      run(found.kid);
    }
  };

  cssToolRow = () => {
    mountPane(host, CodeDockCssTools);
    paintCssToolState(win);
  };

  cssToolRow();

  win.document.addEventListener(
    'mousedown',
    (event) => {
      if (event.target.closest(`#${CSS_MENU_ID}, [data-sve-css-tools], [data-sve-html-tools], [data-sve-css-add-class]`)) {
        return;
      }

      closeCssMenu(win.document);
    },
    true
  );
}

function paintHtmlTidy(win, dock) {
  const btn = dock.querySelector('[data-sve-html-tidy]');

  if (!btn) {
    return;
  }

  btn.innerHTML = HTML_ICONS.tidy || '';
  btn.title = t(win, 'code_dock_html_tidy');
  btn.setAttribute('aria-label', btn.title);
  btn.setAttribute('data-tip', btn.title);
}

function bindHtmlTidy(win, dock) {
  const btn = dock.querySelector('[data-sve-html-tidy]');

  paintHtmlTidy(win, dock);

  if (!btn || btn._sveBound) {
    return;
  }

  btn._sveBound = true;
  btn.addEventListener('mousedown', (event) => event.preventDefault());
  btn.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    tidyHtmlPane();
  });
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
      icon: HTML_ICONS[tool.id] || '',
    })),
    onTool: (id) => {
      const tool = HTML_TOOLS.find((item) => item.id === id);
      const btn = host.querySelector(`[data-sve-html-tool="${id}"]`);

      if (!tool) {
        return;
      }

      if (tool.menu === 'heading') {
        openHtmlTagMenu(win, btn, HTML_HEADINGS);

        return;
      }

      if (tool.menu === 'text') {
        openHtmlTagMenu(win, btn, TEXT_TAGS);

        return;
      }

      if (tool.tidy) {
        tidyHtmlPane();

        return;
      }

      if (tool.menu === 'component') {
        openHtmlComponentMenu(win, btn);

        return;
      }

      closeCssMenu(win.document);

      if (tool.snippet) {
        insertHtmlSnippet(tool.snippet, tool.caret ?? tool.snippet.length, tool.select);
        finishHtmlEdit();

        return;
      }

      applyHtmlTag(tool.tag);
    },
  });

  bindAntlersSnippets(win, dock);
  bindVisualEditSnippets(win, dock);
  bindDataVars(win, dock);
}

// --- Data ------------------------------------------------------------------
//
// A button beside the Antlers and Visual edit pickers that answers "what can I
// write here?" — the section's own fields, the page's, and the site's globals,
// searchable, with the values they hold right now beside them. Picking one
// writes the tag at the cursor.

const DATA_MENU_ID = '__sve-data-menu';

let dataMenuUnhook = null;

function closeDataMenu(doc) {
  const menu = doc?.getElementById(DATA_MENU_ID);

  dataMenuUnhook?.();
  dataMenuUnhook = null;
  menu?._sveApp?.unmount();
  menu?.remove();
  doc?.querySelector('[data-sve-data-vars][data-open]')?.removeAttribute('data-open');
}

/**
 * The collection a collection-view template renders, from the template entry's
 * own `source_collection` — the reason to open one is the entries in it.
 */
function dataVarsView(win) {
  if (!collectionViewType(win)) {
    return { view: '', kind: '' };
  }

  const containers = typeof activeContainers === 'function' ? activeContainers(win.document) : [];

  for (const container of containers) {
    const values = unwrapRef(container.values) || container.values;
    const view = typeof values?.source_collection === 'string' ? values.source_collection.trim() : '';

    if (view) {
      return { view, kind: String(values?.kind || '').trim() };
    }
  }

  return { view: '', kind: '' };
}

/**
 * The loops the picker is being opened inside.
 *
 * Two callers, one answer. The HTML pane asks from the cursor; the tree asks
 * from the row that was clicked, and hands its offset in. Both are offsets into
 * the whole template, so the scoped pane's slice is added back before reading.
 */
function dataVarsScopeAt(win, at) {
  const html = currentFullHtml();

  if (Number.isFinite(at)) {
    return loopScopeAt(html, at);
  }

  const view = editors.html;

  if (!view) {
    return [];
  }

  const offset = htmlScopeActive && htmlFocus ? htmlFocus.from : 0;

  return loopScopeAt(html, offset + view.state.selection.main.from);
}

function dataVarsQuery(win, at) {
  const { view, kind } = dataVarsView(win);

  return {
    collection: dataVarsCollection(win) || '',
    set: dataVarsSet(currentTemplateType()),
    view,
    kind,
    scope: dataVarsScope(dataVarsScopeAt(win, at)),
  };
}

/** The page's own values — the whole entry, not the section inside it. */
function currentPageValues(win) {
  const containers = typeof activeContainers === 'function' ? activeContainers(win.document) : [];

  for (const container of containers) {
    const values = unwrapRef(container.values) || container.values;

    if (values && typeof values === 'object') {
      return values;
    }
  }

  return null;
}

/** The catalogue with this moment's values folded in. */
function dataVarsModel(win, raw) {
  return {
    // A loop's rows hold one value each and no single one of them is *the*
    // value, so the scope tab shows names alone — same rule as a nested field.
    scope: raw?.scope?.groups || [],
    section: withValues(raw?.section || [], currentSectionValues(win)),
    page: groupsWithValues(raw?.page || [], currentPageValues(win)),
    site: raw?.site || [],
  };
}

/**
 * Straight in at the cursor, unlike the Antlers snippets, which open a block and
 * earn their own line. `{{ headline }}` belongs inside the tag you are already
 * standing in, so breaking the line would be wrong.
 */
function insertDataVar(row, group) {
  const spec = dataVarSnippet(row, group);
  const view = editors.html;

  if (!spec || !view || view.state.readOnly) {
    return;
  }

  const range = view.state.selection.main;
  const line = view.state.doc.lineAt(range.from);
  const indent = lineIndentOf(line.text);
  const text = indentAntlersSnippet(spec.text, indent);

  view.dispatch({
    changes: { from: range.from, to: range.to, insert: text },
    selection: { anchor: range.from + spec.cursor + (spec.text.includes('\n') ? indent.length : 0) },
  });
  finishHtmlEdit();
}

/**
 * Under the button, or above it when the dock is parked at the foot of the
 * screen — which is where it usually is, so below is the exception, not the
 * rule. Measured, because the menu is wider than the CSS pickers and its
 * height depends on how many fields the section turned out to have.
 */
function placeDataMenu(win, anchor, menu) {
  const rect = anchor.getBoundingClientRect();
  const pad = 8;
  const width = menu.offsetWidth || 368;
  const height = menu.offsetHeight || 240;
  const below = win.innerHeight - rect.bottom - pad;
  const above = rect.top - pad;
  const top = below >= height || below >= above ? rect.bottom + 4 : rect.top - height - 4;

  menu.style.left = `${Math.max(pad, Math.min(rect.left, win.innerWidth - width - pad))}px`;
  menu.style.top = `${Math.max(pad, Math.min(top, win.innerHeight - height - pad))}px`;
}

/**
 * The field picker. `onPick` lets somewhere other than the HTML pane use it —
 * the tree's condition and loop fields want the bare handle, not a tag.
 */
function openDataVarsMenu(win, anchor, onPick, at) {
  const doc = win.document;

  closeDataMenu(doc);
  anchor.setAttribute('data-open', '');

  const menu = doc.createElement('div');

  menu.id = DATA_MENU_ID;
  doc.body.appendChild(menu);

  const query = dataVarsQuery(win, at);

  /*
   * Inside a loop, the loop goes first and opens selected: standing in
   * `{{ collection:services }}`, a service's own fields are what you came for,
   * and the section's are the ones that would not render. They keep their tab —
   * Antlers still reaches them from in there — just not the first one.
   */
  const tabsFor = (raw) =>
    [
      raw?.scope?.groups?.length
        ? { id: 'scope', label: raw.scope.label || t(win, 'data_vars_tab_loop') }
        : null,
      { id: 'section', label: t(win, 'data_vars_tab_section') },
      { id: 'page', label: t(win, 'data_vars_tab_page') },
      { id: 'site', label: t(win, 'data_vars_tab_site') },
    ].filter(Boolean);

  const paint = (raw) => {
    if (!doc.getElementById(DATA_MENU_ID)) {
      return;
    }

    menu._sveApp?.unmount();
    menu._sveApp = mountSurface(CodeDockDataVars, menu, {
      title: t(win, 'data_vars_title'),
      placeholder: t(win, 'data_vars_placeholder'),
      emptyText: t(win, 'data_vars_empty'),
      noSectionText: t(win, 'data_vars_no_section'),
      loopText: t(win, 'data_vars_loop'),
      tabs: tabsFor(raw),
      data: dataVarsModel(win, raw),
      // Left open on purpose: picking a headline and then its text should not
      // mean reopening the menu. Escape or a click outside closes it.
      onPick: (row, group) => (onPick ? onPick(row, group) : insertDataVar(row, group)),
    });

    // The list just changed height; where it opened has to follow.
    placeDataMenu(win, anchor, menu);
  };

  paint(cachedDataVars(dataVarsKey(query)) || { scope: null, section: [], page: [], site: [] });
  void fetchDataVars(win, query).then(paint);

  placeDataMenu(win, anchor, menu);

  const reposition = () => placeDataMenu(win, anchor, menu);
  const onDown = (event) => {
    if (!menu.contains(event.target) && !anchor.contains(event.target)) {
      closeDataMenu(doc);
    }
  };
  const onKey = (event) => {
    if (event.key === 'Escape') {
      closeDataMenu(doc);
    }
  };

  doc.addEventListener('pointerdown', onDown, true);
  doc.addEventListener('keydown', onKey, true);
  win.addEventListener('scroll', reposition, true);
  win.addEventListener('resize', reposition);

  dataMenuUnhook = () => {
    doc.removeEventListener('pointerdown', onDown, true);
    doc.removeEventListener('keydown', onKey, true);
    win.removeEventListener('scroll', reposition, true);
    win.removeEventListener('resize', reposition);
  };
}

function bindDataVars(win, dock) {
  const btn = dock.querySelector('[data-sve-data-vars]');

  if (!btn || btn._sveBound) {
    return;
  }

  btn._sveBound = true;
  btn.addEventListener('mousedown', (event) => event.preventDefault());
  btn.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (win.document.getElementById(DATA_MENU_ID)) {
      closeDataMenu(win.document);

      return;
    }

    closeCssMenu(win.document);
    openDataVarsMenu(win, btn);
  });
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
        ...(componentPropsOn(win) ? { props: lastProps } : {}),
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
  // A changed declaration is worth a save of its own: the panel edits a list
  // the panes know nothing about, so not a character of them need have moved.
  if (sameParts(parts, lastParts) && !(twReady && twDirty) && !propsDirty) {
    return;
  }

  propsDirty = false;

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
let htmlAntlersUi = null;
let htmlClassTokenUi = null;

let cssGhostUi = null;

/**
 * Draw a size block nobody has written in yet as not-yet-written.
 *
 * It is in the editor, it takes the cursor, you can type in it — but it is
 * faded, because it is not in the file and will not be unless something is
 * put in it. The moment a declaration lands, it is no longer empty, the fade
 * goes, and it saves with everything else. Nothing to confirm, nothing to
 * clean up: the rule is simply "an empty one does not count".
 */
function cssGhostExtension() {
  if (cssGhostUi) {
    return cssGhostUi;
  }

  const mark = Decoration.mark({ class: 'sve-css-ghost' });

  const build = (state) => {
    const builder = new RangeSetBuilder();

    if (!lastWin) {
      return builder.finish();
    }

    try {
      for (const range of emptySizeBlocks(state.doc.toString(), cssSizeRows(lastWin))) {
        builder.add(range.from, range.to, mark);
      }
    } catch {
      /* half-typed CSS must not take the pane down */
    }

    return builder.finish();
  };

  cssGhostUi = StateField.define({
    create: (state) => build(state),
    update: (value, tr) => (tr.docChanged ? build(tr.state) : value),
    provide: (field) => EditorView.decorations.from(field),
  });

  return cssGhostUi;
}

let cssIdUi = null;
let cssIdEffect = null;

/**
 * Draw the rule you are writing in while the ID is showing.
 *
 * The ID layer is one rule among the design's many, and a fold opening is a
 * quiet thing to happen in a file this long. So it is marked for as long as it
 * is on screen — a line down its left edge and a ground of its own — and "I am
 * writing in the ID now" is something you see rather than work out.
 */
function cssIdExtension() {
  if (cssIdUi) {
    return cssIdUi;
  }

  cssIdEffect = StateEffect.define();

  const line = Decoration.line({ class: 'sve-css-id' });

  const build = (state) => {
    const builder = new RangeSetBuilder();

    if (!lastWin || !cssValues) {
      return builder.finish();
    }

    try {
      const doc = state.doc;

      for (const node of idRulesForSize(doc.toString(), cssSizeRows(lastWin), cssSize)) {
        const first = doc.lineAt(Math.min(node.from, doc.length)).number;
        const last = doc.lineAt(Math.min(Math.max(node.to - 1, node.from), doc.length)).number;

        for (let n = first; n <= last; n += 1) {
          builder.add(doc.line(n).from, doc.line(n).from, line);
        }
      }
    } catch {
      /* half-typed CSS must not take the pane down */
    }

    return builder.finish();
  };

  cssIdUi = StateField.define({
    create: (state) => build(state),
    update: (value, tr) => (
      tr.docChanged || tr.effects.some((effect) => effect.is(cssIdEffect))
        ? build(tr.state)
        : value
    ),
    provide: (field) => EditorView.decorations.from(field),
  });

  return cssIdUi;
}

/**
 * Redraw the marking after something other than the text moved it.
 *
 * The field follows the document on its own. The button and the size row move
 * which rule is meant without touching a character, and that is what this is
 * for.
 */
function paintCssIdMark() {
  if (cssIdEffect && editors.css) {
    editors.css.dispatch({ effects: cssIdEffect.of(null) });
  }
}

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

function antlersUi() {
  if (!htmlAntlersUi) {
    htmlAntlersUi = antlersDecorations({
      Decoration,
      StateField,
      RangeSetBuilder,
      EditorView,
    });
  }

  return htmlAntlersUi;
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
        // Only the CSS pane folds, and only this code folds it: the size row
        // puts the other sizes away rather than cutting them out of the text.
        // Folding is reversible and lossless, which rewriting the pane is not.
        ...(handle === 'css' ? [codeFolding(), cssGhostExtension(), cssIdExtension()] : []),
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
        ...(handle === 'html' ? antlersUi().extensions : []),
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

          // A size block that was just written has to be put away like the
          // ones that were already there — including one an undo brought back.
          if (handle === 'css' && update.docChanged && !applying) {
            applyCssFolds(win);
          }

          if (handle === 'html' && (update.docChanged || update.selectionSet)) {
            paintHtmlToolState(win);
            paintAlpine(win);

            if (!applying) {
              syncTwTarget(win);
            }
          }
        }),
        ...vscTheme(cm, {
          height: 'auto',
          background: '#1E1E21',
          scroller: { overflow: 'visible', height: 'auto', minHeight: 0 },
          extraTags: (tags) => [
            { tag: tags.tagName, color: '#4ec9b0' },
            { tag: tags.attributeName, color: '#9cdcfe' },
            { tag: tags.attributeValue, color: '#ce9178' },
            { tag: tags.angleBracket, color: '#808080' },
          ],
        }),
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

    sve.openHtmlTreePanel?.(win);
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
      lastProps = Array.isArray(data.props) ? data.props : [];
      propsDirty = false;
      lastType = type;
      lastLocked = !!data.locked;
      lockReady = true;
      resetTailwindCompile();
      paintLock(win);
      writeParts(lastParts, lastLocked);
      // The file that just opened decides whether the left column belongs to a
      // component. Stepping in and out of one is a load like any other.
      syncComponentProps(win);

      if (!lastLocked) {
        ensureTwCss(win, lastParts.html);
      }

      setPath(win.document, data.path || type);
      setStatus(win.document, lastLocked ? t(win, 'code_dock_locked') : '');
      syncComponentFocus(win);
      watchComponentMap(win);
      void syncComponentMap(win);
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
  closeDataMenu(doc);
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

  if (win?.document.getElementById(HTML_TREE_PANEL_ID)) {
    sve.closeHtmlTreePanel?.(win);
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

function chromeTemplateType(win, doc) {
  const kind = sve.chromeInlineKind || sve.activeChromeKind;

  if (kind !== 'header' && kind !== 'footer') {
    return '';
  }

  if (!sve.chromeHost?.(doc) && !sve.chromeEditorOpen?.(doc)) {
    return '';
  }

  const values = unwrapRef(sve.chromeContainer?.()?.values) || {};
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
register('dock:reveal-html', ({ from, to, caret } = {}) => {
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

  // `caret` says "put me inside this", which the tree asks for so the next
  // thing written lands in the row that was picked. Without one the whole
  // range is selected, which is what a plain reveal has always done.
  const at = caret == null ? null : Math.max(0, Math.min(caret, length));

  if (htmlScopePref && htmlFocus) {
    showHtmlScope(at);
    paintHtmlScope(lastWin);

    return;
  }

  if (htmlScopeActive) {
    showHtmlFull(true, at);
    paintHtmlScope(lastWin);

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
  if (lastWin) {
    syncTwTarget(lastWin);
  }
});
/**
 * The CSS pane, whole — `cssFull` is the truth, and the pane may be showing a
 * scoped slice of it, so it is flushed first. Extracting a component reads and
 * rewrites it: the rules that describe the markup leave with the markup.
 */
register('dock:css', () => {
  flushCssScope();

  return cssFull;
});
register('dock:set-css', (css) => {
  if (typeof css !== 'string' || isCodeDockLocked()) {
    return false;
  }

  if (!editors.css || !lastWin) {
    return false;
  }

  flushCssScope();
  cssFull = css;
  writeHandleEditor('css', cssEditorText());
  onEditorInput(lastWin);

  return true;
});
/**
 * Open the field picker anchored on someone else's button. `onPick` gets the
 * row, so the caller decides what a pick writes and where. `at` says where in
 * the template the caller is standing, so the loop around it can be read; left
 * out, the HTML pane's cursor answers that instead.
 */
register('dock:data-menu', ({ anchor, onPick, at } = {}) => {
  if (!anchor || !lastWin) {
    return false;
  }

  closeDataMenu(lastWin.document);
  closeCssMenu(lastWin.document);
  openDataVarsMenu(lastWin, anchor, onPick, at);

  return true;
});
/**
 * The open file's declared fields, and a change to them.
 *
 * A change is a save: the list is not text anyone is mid-word in, so there is
 * nothing to debounce and nothing to lose by writing it straight away.
 */
register('dock:props', () => lastProps.map((prop) => ({ ...prop })));
register('dock:set-props', ({ win, props } = {}) => {
  if (!Array.isArray(props) || isCodeDockLocked()) {
    return false;
  }

  lastProps = props;
  propsDirty = true;
  forgetComponentProps(componentSrcOf(currentTemplateType()));
  flushSave((win || lastWin)?.document);

  return true;
});

/** `view:partials/components/card` is the component `components/card`. */
function componentSrcOf(type) {
  const match = /^view:partials\/(components\/[A-Za-z0-9_-]+)$/.exec(String(type || ''));

  return match ? match[1] : '';
}

register('dock:component-src', () => componentSrcOf(currentTemplateType()));

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
    back: typeStack.length > 0,
  };
});

/**
 * Leave the open component. Both roads out save on the way — `goBackTemplate`
 * and `closeCodeDock` each flush first — so there is no version of this that
 * loses what was typed.
 */
register('dock:exit-component', () => {
  if (!lastWin || !componentSrcOf(currentTemplateType())) {
    return false;
  }

  if (typeStack.length) {
    goBackTemplate(lastWin);
  } else {
    closeCodeDock(lastWin.document);
  }

  return true;
});

register('dock:current-type', () => currentTemplateType());
register('dock:current-uid', () => lastUid);
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
  if (!lastWin) {
    return false;
  }

  refreshPreview(lastWin);

  return true;
});

/** Open another template — the same push the partial links in the panes do. */
register('dock:open-template', (type) => {
  if (typeof type !== 'string' || !type || !lastWin) {
    return false;
  }

  openNestedTemplate(lastWin, type);

  return true;
});
register('dock:set-html', (html) => {
  if (typeof html !== 'string' || isCodeDockLocked()) {
    return false;
  }

  const view = editors.html;

  if (!view || !lastWin) {
    return false;
  }

  // Empty string = detach view (last section gone). Never autosave an empty file.
  if (html === '') {
    if (saveTimer) {
      clearTimeout(saveTimer);
      saveTimer = null;
    }

    // Drop any in-flight Tailwind compile save; it would post empty HTML.
    twDirty = false;
    twCss = null;
    twKey = '';

    // Detach before clearing panes — flushSave no-ops without lastType, and
    // readParts reads cssFull (not the CSS editor), so clear that too.
    lastType = null;
    lastUid = null;
    lastParts = { html: '', css: '', js: '' };
    cssFull = '';
    htmlFull = '';

    applying = true;

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
      applying = false;
    }

    return true;
  }

  const before = htmlFull;

  htmlFull = html;

  if (htmlScopeActive) {
    // The scoped pane shows `htmlFull.slice(htmlFocus)`. An edit that changed
    // the length of what is inside that range leaves the end of it pointing
    // short, and the pane renders a truncated tag — `{{ /artis`. Writing in
    // that pane then syncs the truncation back into the file, so the range is
    // moved with the edit rather than left behind.
    htmlFocus = shiftFocus(htmlFocus, before, html);
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

/**
 * Empty the dock panes without saving. Used when the last page section is
 * removed — `dock:set-html ''` would autosave an empty Antlers file.
 */
register('dock:show-empty', () => ask('dock:set-html', ''));

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

sve.syncCodeDock = syncCodeDock;

