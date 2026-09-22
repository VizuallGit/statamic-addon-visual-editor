/**
 * Settings toggle: `html_tree`
 * HTML tag tree in the right dock — opens with the template dock, not a top-bar icon.
 * Reads the template dock's HTML pane. Does not import overlay / preview / bridge.
 */
import { t } from './lib/i18n.js';
import { canCreateSections, isHiddenType, isStaticType, libraryStale, updateSectionType } from './section-create.js';
import { openFieldsetOverlay, openGlobalFieldsOverlay } from './section-fields.js';
import { chromeGlobalHandle } from './globals-panel.js';
import { sveState } from './cp-state.js';
import { applyHeaderTab, sendToPreview, setHeaderTab, topLevelSectionIds } from './cp.js';
import { ask, on, register } from './cp/bus.js';
import { mountPane } from './cp/mount-pane.js';
import { RIGHT_PANEL_FILL, releaseRightShellIfEmpty, showInRightShell } from './right-dock.js';
import HtmlTreePane from './cp/surfaces/HtmlTreePane.vue';
import HtmlTreeList from './cp/surfaces/HtmlTreeList.vue';
import { htmlTreeUi, readHtmlTreeLook } from './cp/html-tree/store.js';
import { flattenHtmlTree, isVoidTag, parseTemplateTree } from './html-tree-parse.js';
import {
  componentPropsOn,
  fetchComponentProps,
  propHandle,
  readCallParams,
  valueRows,
  writePropParam,
} from './component-props.js';
import { syncComponentProps, syncComponentPropsHost } from './component-props-host.js';
import { openLiteSection } from './side/lite-sections.js';
import { componentPropsUi } from './cp/component-props/store.js';
import { componentBindPick } from './component-bind.js';
import { openPageMenu } from './link-targets.js';
import { createPropValues, propValuesReady } from './prop-values.js';

/** The values this place gives the component. One form, reused per selection. */
const callValues = createPropValues('sve-call-values');

/** Fields switched to data but not yet given an expression, for the open row. */
const pendingBinds = new Set();
let pendingBindRow = null;
import {
  closingTagIndex,
  dropPlace,
  duplicateHtml,
  deleteHtml,
  moveHtml,
  toggleHiddenHtml,
} from './html-tree-edit.js';
import { htmlTreeDisplayName, readHtmlTreeLabels, writeHtmlTreeLabel } from './html-tree-labels.js';
import { HTML_ICONS, htmlTreeIcon } from './html-tree-icons.js';
import { familyCssVars, tagFamily } from './lib/tag-families.js';
import { applyFamilyColors } from './family-colors.js';
import { closeTwMenu, twOpenTagMenuAt } from './tw-classes.js';
import { serializePickTree } from './html-pick-align.js';
import { openCpOverlay } from './cp/open-overlay.js';
import HtmlTreeMenu from './cp/surfaces/HtmlTreeMenu.vue';
import { extractComponent } from './component-extract.js';
import {
  addAntlersBranch,
  writeAntlersExpression,
  writeLoopSource,
  writeLoopTag,
} from './antlers-edit.js';
import { previewDocument } from './lib/preview-frame.js';
import { injectStyle } from './lib/style.js';
import { firstEntryId, humanizeHandle, unwrapRef } from './lib/values.js';
import { featureOn, sectionField } from './lib/config.js';
import { HTML_TREE_PANEL_ID, LAYOUT_TEMPLATE_TYPE } from './lib/ids.js';
import { activeContainers } from './lib/publish-containers.js';
import { persistDockedPanel } from './lp-panel.js';
import { focusFromPreview, setMeta } from './focus-panel.js';
import { closeRightPanels, globalSectionSet, handleRemoveRow, savedSectionInfo, syncPreviewInset } from './section-library.js';
import { confirmCloseDiscard } from './pages.js';
import { MSG, SOURCE } from './lib/protocol.js';
import { hasToken } from './dock-partials.js';

export const HTML_TREE_STYLE_ID = '__sve-html-tree-style';

/**
 * The rows whose fold the reader has flipped, by path.
 *
 * Two things are load-bearing here. **Paths, not row ids**: an id is an offset
 * into the file, so every edit above a row renames it — a fold state keyed on
 * ids springs the whole tree open on a keystroke, and a state carried into the
 * next file lands on whatever happens to sit at those offsets. And **flipped,
 * not collapsed**: the top level is open and everything under it is shut
 * unless this set says otherwise, so a tree with nothing remembered about it
 * is already the tree a click asked for.
 */
const htmlTreeFolds = new Set();
/** The file the tree last opened, so it only unfolds afresh when it changes. */
let htmlTreeFileKey = '';
/**
 * The markup on screen when the dock said it had moved to another file, or
 * false when nothing is awaited. The move is announced before the file lands,
 * so this is what tells the two apart: the first render whose markup differs
 * is the new file arriving, and that is when the tree reseats itself.
 */
let htmlTreeReseat = false;
/**
 * The markup the last paint drew. A file change is only "announced ahead" when
 * this paint still shows what the last one showed; when the markup has already
 * moved on, the new file is here and the reseat is due now, not later. Null
 * until the first paint — an empty file is a paint too.
 */
let htmlTreeLastHtml = null;
/** No section is unfolded until one is asked for. Set again on every open. */
let htmlTreeShutStart = true;
/** A section clicked whose file has not arrived yet. Drawn as open already. */
let htmlTreePendingUid = '';
let htmlTreePendingTimer = 0;
/** The markup on screen when it was clicked — the file it is waiting to leave. */
let htmlTreePendingHtml = '';
/**
 * Every section's markup, fetched before anyone asks for it.
 *
 * The dock takes about half a second to answer a click — fetch, panes, debounce
 * — and the tree used to sit and wait for it, so opening a section arrived in
 * two steps. Nothing about these files is expensive to hold: the panel fetches
 * each once while the reader is still looking at the list, and a click then has
 * the tags already.
 */
const htmlTreeTemplates = new Map();
const htmlTreeFetching = new Set();
/**
 * Markup the tree is drawing ahead of the dock, from that cache.
 *
 * Set only between a click and the dock catching up. While it stands, the rows
 * on screen are *not* the rows the dock would edit — every id in them is an
 * offset into a file the dock has not loaded yet — so nothing may write.
 */
let htmlTreeAhead = '';
/** True when the click stays on the same template, so no new markup is coming. */
let htmlTreePendingSame = false;
export let htmlTreeActiveId = null;
export let htmlTreeUnhook = null;
// The layout file the tree last stood on <main> in — seated once per landing.
let htmlTreeMainSeated = '';
export let htmlTreeTimer = 0;
let htmlTreeStructureUnhook = null;
let htmlTreeRoots = [];
let htmlTreeDragId = null;
let htmlTreeDragOrigin = null;
let htmlTreeDragEl = null;
let htmlTreePointerId = null;
let htmlTreeDragUnhook = null;
let htmlTreeSuppressClick = false;
let htmlTreeMenu = null;
// A section being dragged between the page's sections (not a row in a file).
let htmlTreeSecDragUid = null;
let htmlTreeSecDragOrigin = null;
let htmlTreeSecDragEl = null;
let htmlTreeSecPointerId = null;
let htmlTreeSecDragUnhook = null;
/**
 * A sort direction chosen before there is a field to sort by.
 *
 * `{{ items | sort: }}` is not a thing that can be written, so picking
 * "Ascending" on its own writes nothing — and without remembering the choice
 * the select would snap back to "As it comes" on the next repaint, which is
 * every keystroke in the limit box. Held here until the field arrives.
 */
let htmlTreeSortDraft = null;

export function htmlTreePanel(doc) {
  return doc.getElementById(HTML_TREE_PANEL_ID);
}

export function ensureHtmlTreeStyles(doc) {
  injectStyle(doc, HTML_TREE_STYLE_ID, `
    [data-sve-ht-row] {
      all: unset;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 5px 8px;
      min-height: 28px;
      margin-bottom: 3px;
      background: rgba(128,128,128,.16);
      border-radius: 6px;
      font-size: 11px;
      line-height: 1.3;
      cursor: pointer;
      user-select: none;
      position: relative;
      touch-action: none;
      /* The row sets --sve-ht-depth; the classic look steps the whole card in. */
      margin-left: calc(var(--sve-ht-depth, 0) * 12px);
    }
    /* Only the tags look draws these two — see below. */
    [data-sve-ht-indent],
    [data-sve-ht-twist-gap] { display: none; }
    [data-sve-ht-dragging],
    [data-sve-ht-dragging] * {
      cursor: grabbing !important;
    }
    [data-sve-ht-row]:hover { background: rgba(128,128,128,.26); }
    [data-sve-ht-row]:focus-visible { outline: 2px solid #3858e9; outline-offset: -2px; }
    /* One rule, and a shut section is a row — so the section that was just
       clicked wears the same blue its first tag wears when the file lands, and
       the click stays one colour instead of changing hands. */
    [data-sve-ht-row][data-sve-ht-current] { background: #3858e9; color: #fff; }
    [data-sve-ht-row][data-sve-ht-current]:hover { background: #4a68ee; }
    [data-sve-ht-row][data-sve-ht-hidden] { opacity: .5; }
    /* A search: the row is only the way to a match further down. */
    [data-sve-ht-row][data-sve-ht-dim] { opacity: .45; }
    /* The box around the open section's tags — it says where you are working. */
    [data-sve-ht-branch] {
      box-sizing: border-box;
      border: 1px solid rgba(56,88,233,.6);
      border-radius: 0.5625rem;
      padding: 0.3125rem;
      margin-bottom: 0.3125rem;
    }
    [data-sve-ht-branch] > [data-sve-ht-row]:last-child { margin-bottom: 0; }
    /* The page's frame: header, main and footer around the sections. The
       sections step in one level under main, as rows step in under a parent. */
    [data-sve-ht-frame-body] { margin-left: 12px; }
    [data-sve-ht-look="tags"] [data-sve-ht-frame-body] {
      margin: 2px 0 2px 7px;
      padding-left: 7px;
      box-shadow: inset 1px 0 0 color-mix(in srgb, var(--sve-fam-layout) 22%, transparent);
    }
    /* Main names the space between, not a thing to edit: a shade quieter. */
    [data-sve-ht-row][data-sve-ht-frame="main"] [data-sve-ht-name] { opacity: .65; font-weight: 500; }
    /* Inside a component: the section's other rows stay, faded — the
       component's own rows are the lit ones, and the row it unfolds from
       carries the component's colour to say where you are. */
    [data-sve-ht-row][data-sve-ht-context="dim"] { opacity: .38; }
    [data-sve-ht-row][data-sve-ht-context="dim"]:hover { opacity: .6; }
    [data-sve-ht-row][data-sve-ht-context="host"] { box-shadow: inset 2px 0 0 var(--sve-fam-component, #5eead4); }
    [data-sve-ht-row][data-sve-ht-drop="before"]::before,
    [data-sve-ht-row][data-sve-ht-drop="after"]::after {
      content: '';
      position: absolute;
      left: 8px;
      right: 8px;
      height: 2px;
      background: #93c5fd;
      pointer-events: none;
    }
    [data-sve-ht-row][data-sve-ht-drop="before"]::before { top: -2px; }
    [data-sve-ht-row][data-sve-ht-drop="after"]::after { bottom: -2px; }
    [data-sve-ht-row][data-sve-ht-drop="inside"] {
      outline: 2px solid #93c5fd;
      outline-offset: -2px;
    }
    /* A section dragged between sections: the line sits above or below the
       whole section — every row of an open one, the one row of a shut one. */
    [data-sve-ht-sec-uid] { position: relative; }
    [data-sve-ht-sec-uid][data-sve-ht-drop="before"]::before,
    [data-sve-ht-sec-uid][data-sve-ht-drop="after"]::after {
      content: '';
      position: absolute;
      left: 8px;
      right: 8px;
      height: 2px;
      background: #93c5fd;
      pointer-events: none;
      z-index: 2;
    }
    [data-sve-ht-sec-uid][data-sve-ht-drop="before"]::before { top: -2px; }
    [data-sve-ht-sec-uid][data-sve-ht-drop="after"]::after { bottom: -2px; }
    [data-sve-ht-twist] {
      all: unset;
      box-sizing: border-box;
      width: 14px;
      height: 14px;
      flex: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      opacity: .7;
    }
    [data-sve-ht-twist][data-sve-ht-shut] { transform: rotate(-90deg); }
    [data-sve-ht-actions] {
      margin-left: auto;
      flex: none;
      display: none;
      align-items: center;
      gap: 4px;
    }
    [data-sve-ht-row]:hover [data-sve-ht-actions],
    [data-sve-ht-row][data-sve-ht-current] [data-sve-ht-actions],
    [data-sve-ht-row][data-sve-ht-hidden] [data-sve-ht-actions] {
      display: inline-flex;
    }
    [data-sve-ht-video],
    [data-sve-ht-eye],
    [data-sve-ht-fields],
    [data-sve-ht-dup],
    [data-sve-ht-del] {
      all: unset;
      box-sizing: border-box;
      width: 18px;
      height: 18px;
      flex: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      opacity: .7;
      border-radius: 4px;
    }
    [data-sve-ht-video][data-on] { opacity: 1; color: #93c5fd; }
    [data-sve-ht-video]:hover,
    [data-sve-ht-eye]:hover,
    [data-sve-ht-fields]:hover,
    [data-sve-ht-dup]:hover,
    [data-sve-ht-del]:hover { opacity: 1; background: rgba(255,255,255,.12); }
    /* Locked: still there, still readable, plainly not for pressing. */
    [data-sve-ht-eye][disabled],
    [data-sve-ht-fields][disabled],
    [data-sve-ht-dup][disabled],
    [data-sve-ht-del][disabled] { opacity: .3; cursor: default; }
    [data-sve-ht-eye][disabled]:hover,
    [data-sve-ht-fields][disabled]:hover,
    [data-sve-ht-dup][disabled]:hover,
    [data-sve-ht-del][disabled]:hover { opacity: .3; background: none; }
    [data-sve-ht-icon] {
      flex: none;
      width: 14px;
      height: 14px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    [data-sve-ht-icon] svg { display: block; }
    [data-sve-ht-letter] {
      flex: none;
      width: 14px;
      height: 14px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      font-weight: 700;
      line-height: 1;
    }
    [data-sve-ht-text] {
      min-width: 0;
      display: flex;
      align-items: center;
      gap: 6px;
      overflow: hidden;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 11px;
    }
    /* The tag is a label on the row and the name is what the row is about, so
       the tag is the smaller of the two and carries the chip. */
    [data-sve-ht-tag],
    [data-sve-ht-kind] {
      all: unset;
      box-sizing: border-box;
      flex: none;
      padding: 1px 5px;
      border-radius: 4px;
      background: rgba(255,255,255,.08);
      font-size: 10px;
      opacity: .75;
    }
    [data-sve-ht-tag] {
      cursor: pointer;
    }
    [data-sve-ht-tag]:hover {
      opacity: 1;
      background: rgba(255,255,255,.22);
    }
    [data-sve-ht-tag]:focus-visible {
      outline: 2px solid #3858e9;
      outline-offset: -2px;
    }
    /* On the picked row the chip has a blue ground under it, so it lightens
       rather than darkens. */
    [data-sve-ht-row][data-sve-ht-current] [data-sve-ht-tag],
    [data-sve-ht-row][data-sve-ht-current] [data-sve-ht-kind] {
      background: rgba(255,255,255,.16);
      opacity: 1;
    }
    /* A shut section's tag is a span, not a button — there is no file open to
       rename it in. Same chip either way; only the hover tells them apart. */
    [data-sve-ht-row][data-sve-ht-sec] [data-sve-ht-kind] {
      background: rgba(255,255,255,.12);
      color: rgba(255,255,255,.7);
      opacity: 1;
    }
    [data-sve-ht-name] {
      min-width: 2em;
      min-height: 1em;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    [data-sve-ht-rename] {
      all: unset;
      box-sizing: border-box;
      min-width: 48px;
      max-width: 100%;
      padding: 0 4px;
      border-radius: 3px;
      background: rgba(0,0,0,.22);
      font: inherit;
      color: inherit;
    }

    /* ===== The tags look ===================================================
       The tree's own face, so it stops reading as a second block tree: flat
       rows instead of a card each, one thin guide per level of depth, and a
       colour per family of tag on the icon and the chip. The colours are the
       one table in lib/tag-families.js — the HTML pane paints a tag name, an
       Antlers block and a partial call from the same seven, so the tree and
       the pane say the same thing about the same line.
       Everything above is the classic look, untouched. The switch in Live
       Preview settings (HTML_TREE_LOOK_KEY) decides which value the list
       wears as data-sve-ht-look, and every rule here hangs off that. */
    [data-sve-ht-look="tags"] {
      ${familyCssVars('light')}
      /* How much of a row's own colour its pick takes: a wash, not a fill.
         The row mixes it in below — a mix written up here would read
         --sve-ht-c on the list, where no family is set. */
      --sve-ht-pick-mix: 11%;
      --sve-ht-pick-hover-mix: 18%;
    }
    html.dark [data-sve-ht-look="tags"],
    .dark [data-sve-ht-look="tags"] {
      ${familyCssVars('dark')}
      --sve-ht-pick-mix: 24%;
      --sve-ht-pick-hover-mix: 32%;
    }
    /* The family's colour, on a row and on the guide an ancestor of that
       family leaves under itself. */
    [data-sve-ht-look="tags"] [data-sve-ht-row],
    [data-sve-ht-look="tags"] [data-sve-ht-cat="other"] { --sve-ht-c: var(--sve-fam-other); }
    [data-sve-ht-look="tags"] [data-sve-ht-cat="layout"] { --sve-ht-c: var(--sve-fam-layout); }
    [data-sve-ht-look="tags"] [data-sve-ht-cat="text"] { --sve-ht-c: var(--sve-fam-text); }
    [data-sve-ht-look="tags"] [data-sve-ht-cat="media"] { --sve-ht-c: var(--sve-fam-media); }
    [data-sve-ht-look="tags"] [data-sve-ht-cat="loop"] { --sve-ht-c: var(--sve-fam-loop); }
    [data-sve-ht-look="tags"] [data-sve-ht-cat="if"] { --sve-ht-c: var(--sve-fam-if); }
    [data-sve-ht-look="tags"] [data-sve-ht-cat="component"] { --sve-ht-c: var(--sve-fam-component); }

    /* Flat rows, stepped in by their depth: the row's own box — its hover,
       its pick, its bar — begins where its level begins, and the guides are
       drawn in the margin to its left. A picked row that ran the full width
       over the guides read as belonging to every level at once. */
    [data-sve-ht-look="tags"] [data-sve-ht-row] {
      margin: 0 0 0 calc(var(--sve-ht-depth, 0) * 14px);
      padding: 0 6px 0 4px;
      min-height: 26px;
      gap: 5px;
      background: none;
      border-radius: 5px;
    }
    [data-sve-ht-look="tags"] [data-sve-ht-row]:hover { background: rgba(128,128,128,.14); }
    /* The picked row: its own family colour as a wash and a bar at the
       edge, not a solid fill — the name, the chip and the mark have to
       stay readable on it. */
    [data-sve-ht-look="tags"] [data-sve-ht-row][data-sve-ht-current] {
      background: color-mix(in srgb, var(--sve-ht-c) var(--sve-ht-pick-mix), transparent);
      color: inherit;
      box-shadow: inset 2px 0 0 var(--sve-ht-c);
    }
    [data-sve-ht-look="tags"] [data-sve-ht-row][data-sve-ht-current]:hover {
      background: color-mix(in srgb, var(--sve-ht-c) var(--sve-ht-pick-hover-mix), transparent);
    }
    /* Focus: rows are reached with Tab, so a focused row that is not the
       picked one gets a thin ring in its own colour. The picked row already
       says where you are with its wash and bar — the ring on top of that
       looked like a second, blue selection after every click. */
    [data-sve-ht-look="tags"] [data-sve-ht-row]:focus-visible {
      outline: 1px solid color-mix(in srgb, var(--sve-ht-c) 55%, transparent);
      outline-offset: -1px;
    }
    [data-sve-ht-look="tags"] [data-sve-ht-row][data-sve-ht-current]:focus-visible { outline: none; }
    /* A shut section is one row in the page's list; a little air between them. */
    [data-sve-ht-look="tags"] [data-sve-ht-row][data-sve-ht-sec] { margin-bottom: 2px; }
    /* The open section's box, quieter: it says where you are, the bar says
       what you picked. In the section's own family colour — the wrapper
       carries the section row's family (HtmlTreeList.vue) so the box can
       read it; layout if it somehow does not. Enough padding that a picked
       row's wash — the section's own, or a child's — stops short of the
       border instead of sitting on it. */
    [data-sve-ht-look="tags"] [data-sve-ht-branch] {
      border: 1px solid color-mix(in srgb, var(--sve-ht-c, var(--sve-fam-layout)) 45%, transparent);
      border-radius: 7px;
      padding: 4px;
      margin: 0 0 6px;
      background: color-mix(in srgb, var(--sve-ht-c, var(--sve-fam-layout)) 4%, transparent);
    }
    /* A hair of air between the rows under a section, so the eye can tell
       them apart; a shut section already keeps its own distance (above). The
       guide reaches up across that gap so the line under a parent stays one
       line. */
    [data-sve-ht-look="tags"] [data-sve-ht-row] + [data-sve-ht-row] { margin-top: 2px; }

    /* One guide per level, drawn in the row's left margin: 14px per level
       with the line 7px in, so each sits under the twist of the row it
       descends from — in that row's family colour, well held back. Out of
       the flow, so the row's box and everything in it start at the level. */
    [data-sve-ht-look="tags"] [data-sve-ht-indent] {
      display: flex;
      position: absolute;
      top: -2px;
      bottom: 0;
      left: calc(-1 * var(--sve-ht-depth, 0) * 14px);
      width: calc(var(--sve-ht-depth, 0) * 14px);
      pointer-events: none;
    }
    [data-sve-ht-look="tags"] [data-sve-ht-indent] i {
      display: block;
      flex: none;
      width: 14px;
      background: linear-gradient(to right, transparent 7px, var(--sve-ht-c) 7px, var(--sve-ht-c) 8px, transparent 8px);
      opacity: .2;
    }
    /* The first row under an open parent: its innermost guide — the parent's
       own line — starts a little below the parent's box instead of on it, so
       a picked parent's wash and the line under it do not touch. The outer
       guides pass through unbroken; they belong to rows further up. */
    [data-sve-ht-look="tags"] [data-sve-ht-row]:has(> [data-sve-ht-twist]:not([data-sve-ht-shut])) + [data-sve-ht-row] [data-sve-ht-indent] i:last-child {
      margin-top: 5px;
    }
    [data-sve-ht-look="tags"] [data-sve-ht-twist-gap] {
      display: inline-block;
      flex: none;
      width: 14px;
      height: 14px;
    }
    [data-sve-ht-look="tags"] [data-sve-ht-twist] { opacity: .55; }
    [data-sve-ht-look="tags"] [data-sve-ht-twist]:hover { opacity: 1; }
    [data-sve-ht-look="tags"] [data-sve-ht-slot][data-sve-ht-id] {
      margin-left: calc(var(--sve-ht-depth, 0) * 14px);
    }

    /* The family's colour on the mark and on the chip; the name stays the
       panel's own text colour, so the colour is a label and not the row. */
    [data-sve-ht-look="tags"] [data-sve-ht-icon] { color: var(--sve-ht-c); }
    [data-sve-ht-look="tags"] [data-sve-ht-row][data-sve-ht-cat] [data-sve-ht-tag],
    [data-sve-ht-look="tags"] [data-sve-ht-row][data-sve-ht-cat] [data-sve-ht-kind] {
      color: var(--sve-ht-c);
      background: color-mix(in srgb, var(--sve-ht-c) 15%, transparent);
      opacity: 1;
      font-weight: 600;
      letter-spacing: .01em;
    }
    [data-sve-ht-look="tags"] [data-sve-ht-row][data-sve-ht-cat] [data-sve-ht-tag]:hover {
      background: color-mix(in srgb, var(--sve-ht-c) 30%, transparent);
    }
    [data-sve-ht-look="tags"] [data-sve-ht-row][data-sve-ht-current] [data-sve-ht-tag],
    [data-sve-ht-look="tags"] [data-sve-ht-row][data-sve-ht-current] [data-sve-ht-kind] {
      background: color-mix(in srgb, var(--sve-ht-c) 24%, transparent);
    }
    [data-sve-ht-look="tags"] [data-sve-ht-name] { opacity: .82; }
    /* A root row — a section of the page, or the file's own root — names a
       place; the rows under it name what is in it. */
    [data-sve-ht-look="tags"] [data-sve-ht-row][data-sve-ht-depth="0"] [data-sve-ht-name] {
      font-weight: 600;
      opacity: .95;
    }
    [data-sve-ht-look="tags"] [data-sve-ht-row][data-sve-ht-current] [data-sve-ht-name] { opacity: 1; }
    [data-sve-ht-look="tags"] [data-sve-ht-video]:hover,
    [data-sve-ht-look="tags"] [data-sve-ht-eye]:hover,
    [data-sve-ht-look="tags"] [data-sve-ht-fields]:hover,
    [data-sve-ht-look="tags"] [data-sve-ht-dup]:hover,
    [data-sve-ht-look="tags"] [data-sve-ht-del]:hover { background: rgba(128,128,128,.25); }
  `);
}

function dockHtml() {
  const html = ask('dock:html');

  return typeof html === 'string' ? html : '';
}

function dockIsOpen(doc) {
  return !!ask('dock:is-open', doc);
}

function writeDockHtml(html, { save = false } = {}) {
  // Every edit the tree makes comes through here, and every one of them is
  // built from offsets into the rows on screen. While those rows come from the
  // cache, the dock holds a different file at those offsets — so this is the
  // one place that has to refuse, and it covers all of them.
  if (htmlTreeAheadOfDock()) {
    return false;
  }

  if (ask('dock:set-html', html) !== true) {
    return false;
  }

  // A value from a form is finished when the form reports it, so it goes to
  // disk now — with autosave off, it otherwise sat in the pane as "Unsaved"
  // until the component was left, and the preview showed nothing of it.
  if (save) {
    ask('dock:save-now');
  }

  return true;
}

/**
 * The bar at the foot of the pane while a component is open.
 *
 * A component is a file you go *into*, and until now the only way back out was
 * the arrow in the dock's path row or clicking some other section — neither of
 * which says "you are inside something". This does, and it names it.
 *
 * One button, and it saves on the way out — both roads out of a component
 * flush first, so there is no unsaved-changes case for a second button to
 * cover. The hover says so, and says where leaving lands you.
 */
function paintComponentExit(win) {
  const state = ask('dock:component-exit-state') || {};

  htmlTreeUi.exitOpen = !!state.open;

  if (!state.open) {
    htmlTreeUi.onExit = null;

    return;
  }

  htmlTreeUi.exitName = state.name || '';
  htmlTreeUi.exitLabel = t(win, 'component_exit');
  htmlTreeUi.exitTitle = t(win, state.back ? 'component_exit_back' : 'component_exit_close');
  htmlTreeUi.onExit = () => {
    ask('dock:exit-component');
    renderHtmlTree(win);
  };
}

/** The saved section a global row points at — its type is what to name it by. */
function globalSectionType(win, row) {
  const globalSet = globalSectionSet(win);

  if (!globalSet || row.type !== globalSet) {
    return '';
  }

  const id = firstEntryId(row[globalSet]);

  return (id && savedSectionInfo(win, id)?.section_type) || '';
}

/** Types waiting to be fetched, and whether the queue is moving. */
const htmlTreePrefetch = [];
let htmlTreePrefetching = false;
/** Set when the context around an open component is waiting for a file. */
let htmlTreeRepaintOnFetch = false;

/** The next quiet moment, or very soon if the browser never gets one. */
function whenIdle(win, run) {
  if (typeof win.requestIdleCallback === 'function') {
    win.requestIdleCallback(run, { timeout: 2000 });

    return;
  }

  win.setTimeout(run, 200);
}

/**
 * Fetch the markup of every section on the page, once each — one at a time.
 *
 * A queue, not a burst. Firing them together was measured at fourteen requests
 * leaving at once on a page with fourteen sections: 87 KB of markup that cost
 * eleven seconds of server time, because PHP serves a handful at a time and the
 * rest wait. Everything else waited with them — the preview's own render, and
 * `chrome-prefs`, which sat for 1.14s doing nothing but queueing.
 *
 * The point of fetching early is that clicking a section shows its tags at
 * once; that holds whether the markup arrives in one second or in ten, as long
 * as it is there before the click. So: one request in flight, each starting on
 * an idle moment, and the page is left alone while it is still being drawn.
 *
 * Failures are dropped — a section whose template is missing simply opens the
 * slow way.
 */
function prefetchSectionTemplates(win, sections) {
  for (const section of sections) {
    const type = section.type;

    if (
      !type
      || htmlTreeTemplates.has(type)
      || htmlTreeFetching.has(type)
      || htmlTreePrefetch.includes(type)
    ) {
      continue;
    }

    htmlTreePrefetch.push(type);
  }

  // Queue during overlay boot; do not fetch until the preview has painted.
  // The open section is already in the dock — these requests are for the rest.
  if (!sveState.htmlTreePrefetchArmed) {
    return;
  }

  runSectionTemplatePrefetch(win);
}

export function armHtmlTreePrefetch(win) {
  sveState.htmlTreePrefetchArmed = true;
  runSectionTemplatePrefetch(win);
}

function runSectionTemplatePrefetch(win) {
  if (htmlTreePrefetching || !htmlTreePrefetch.length) {
    return;
  }

  htmlTreePrefetching = true;

  const next = () => {
    const type = htmlTreePrefetch.shift();

    if (!type) {
      htmlTreePrefetching = false;

      return;
    }

    // Opened (or fetched) while it sat in the queue — nothing left to ask for.
    if (htmlTreeTemplates.has(type) || htmlTreeFetching.has(type)) {
      whenIdle(win, next);

      return;
    }

    htmlTreeFetching.add(type);
    win
      .fetch(`/!/sve/section-template?type=${encodeURIComponent(type)}`, {
        credentials: 'same-origin',
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
      })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (typeof data?.html === 'string') {
          htmlTreeTemplates.set(type, data.html);

          // Asked for by the context around an open component: draw it now.
          if (htmlTreeRepaintOnFetch) {
            htmlTreeRepaintOnFetch = false;
            renderHtmlTree(win);
          }
        }
      })
      .catch(() => {})
      .finally(() => {
        htmlTreeFetching.delete(type);
        whenIdle(win, next);
      });
  };

  whenIdle(win, next);
}

/** True while the rows come from the cache and the dock is still catching up. */
function htmlTreeAheadOfDock() {
  return !!htmlTreeAhead;
}

/**
 * The outermost tag of every section, read off the page itself.
 *
 * A shut section has no file loaded, so the tree cannot read its first tag from
 * markup it does not have — but the preview has already drawn it, and the
 * element carrying the section's uid *is* that tag. So the row says the same
 * thing shut as it does open, and says it about the tag the section really has:
 * a `div` reads `div`, not a guess.
 *
 * No preview, or a section whose template threw and drew nothing: `section`,
 * which is what a page section is unless someone wrote otherwise.
 */
function sectionRootTags(win) {
  const out = new Map();
  const doc = previewDocument(win);

  if (!doc) {
    return out;
  }

  for (const el of doc.querySelectorAll('[data-sid]')) {
    const uid = el.getAttribute('data-sid');

    if (uid && !out.has(uid)) {
      out.set(uid, el.tagName.toLowerCase());
    }
  }

  return out;
}

/**
 * Every section on the page, read from the publish form's values.
 *
 * The values, not the preview. A template with a syntax error renders no page
 * at all, and that is precisely the moment you need a way back into the file
 * that broke — with nothing to click on, the dock falls back to the first
 * section and there was no other door into the rest. The block tree has always
 * read the page this way; this is the same reading, one row per section.
 */
/** True when this publish form is a page builder, even with zero sections. */
function pageHasSectionField(win, doc) {
  const field = sectionField(win) || 'page_sections';

  for (const container of activeContainers(doc) || []) {
    const values = unwrapRef(container.values);
    const list = values && typeof values === 'object' ? values[field] : null;

    if (Array.isArray(list)) {
      return true;
    }
  }

  return false;
}

function htmlTreeSections(win, doc) {
  const field = sectionField(win) || 'page_sections';
  const tags = sectionRootTags(win);
  const out = [];

  for (const container of activeContainers(doc) || []) {
    const values = unwrapRef(container.values);
    const list = values && typeof values === 'object' ? values[field] : null;

    if (!Array.isArray(list)) {
      continue;
    }

    list.forEach((row) => {
      if (!row || typeof row !== 'object' || Array.isArray(row) || typeof row.type !== 'string') {
        return;
      }

      // Every id the row answers to. Which one the dock was handed is the
      // template's choice, and the three need not agree.
      const ids = [row._visual_id, row.id, row._id].filter(
        (id) => typeof id === 'string' && id !== ''
      );

      if (!ids.length) {
        return;
      }

      const type = globalSectionType(win, row) || row.type;
      const custom = typeof row._sve_label === 'string' ? row._sve_label.trim() : '';
      const tag = ids.map((id) => tags.get(id)).find(Boolean) || 'section';

      // The name a rename gave it, read whether or not its file is open. Shut,
      // the alias used to be invisible and the row said the set's name instead
      // — so the same section answered to two names depending on its state.
      // The root tag's path is its index among the file's root tags, and a
      // section template has one.
      const alias = readHtmlTreeLabels(row.type)[`0:${tag}`];

      out.push({
        uid: ids[0],
        ids,
        type: row.type,
        tag,
        // Its own name first: a rename on the page is this section's, and two
        // sections of one type may be called two things. The alias is the
        // file's, shared by every section that renders through it.
        label:
          custom
          || (typeof alias === 'string' && alias.trim() ? alias.trim() : '')
          || setMeta(win, type)?.display
          || humanizeHandle(type)
          || type,
        // Its first tag's mark — the one it unfolds into. The set's own icon
        // used to go here, so the same section wore one shut and another open.
        svg: htmlTreeIcon(tag, '', null).svg || HTML_ICONS.section,
        cat: tagFamily(tag),
        enabled: row.enabled !== false,
        // Markup only: no fieldset, so no fields icon on its root.
        static: isStaticType(win, type),
      });
    });

    // The first container holding the page builder is the page. A second one is
    // another form open beside it, and its rows belong to that panel.
    break;
  }

  return out;
}

/**
 * Which section the file in the dock belongs to.
 *
 * The uid the dock was opened with answers it when there is one. When there is
 * not — nothing clicked yet, or a preview that never drew — `pageSectionType`
 * answers with the first section that has a type, so the tree says the same
 * rather than marking nothing. An answer that disagrees with the file on screen
 * is no answer: only a type that matches, or a component opened from inside
 * that section, is allowed to claim it.
 */
function currentSectionUid(win, doc, sections) {
  if (!sections.length) {
    return '';
  }

  const type = ask('dock:current-type') || '';
  const uid = ask('dock:current-uid');
  // Inside a component the dock holds a partial, whose path says nothing about
  // which section sent you there. The uid still does.
  const inComponent = !!ask('dock:component-exit-state')?.open;

  if (uid) {
    const ids = topLevelSectionIds(uid, doc);
    const owner = sections.find((section) => section.ids.some((id) => ids.includes(id)));

    if (owner && (inComponent || owner.type === type)) {
      return owner.uid;
    }
  }

  return sections.find((section) => section.type === type)?.uid || '';
}

/**
 * What the first tag is called.
 *
 * The row above it in the list already says the section's name, but the tags
 * under it are indented the same whichever section they came from — so the
 * first one says it too, and the file on screen is named by the tree itself.
 * A component names the component; header, footer and a collection's own
 * template name whatever the dock is holding.
 */
/**
 * The files drawn around the open component, all the way down.
 *
 * Opening a component from a section shows the section's own rows, faded,
 * with the component's rows unfolded under the row that calls it. A component
 * opened from inside another component is the same picture one level deeper:
 * the section's rows, faded, then the first component's rows, faded, then the
 * open one unfolded under its call — every file the dock passed through on
 * the way in (`dock:type-stack`, bottom first), each hung under the row in
 * the file above that calls it.
 *
 * Each level's rows are cloned under their own ids and paths (`ctx0:`,
 * `ctx1:` …) so they cannot be mistaken for the open component's — a
 * `div-176-2` exists in every file — and the open component's own roots are
 * hung, untouched, under the last host. Folds: each level's rows by the usual
 * rule at their real depth, the way down to each host held open (a twist on
 * one of those shuts it), the component's rows by their own rule from their
 * own top, as when the component fills the tree alone.
 *
 * Null when a file on the way is not at hand yet — it is asked for, and the
 * tree paints again when it lands — or when a call cannot be found. The
 * component then fills the tree alone, as before.
 */
function contextAround(win, sections, openUid, roots) {
  const owner = sections.find((section) => section.uid === openUid);
  const src = ask('dock:component-src');
  const stack = ask('dock:type-stack') || [];

  if (!owner || !src || !stack.length) {
    return null;
  }

  const missing = stack.map((level) => level.type).filter((type) => !htmlTreeTemplates.get(type));

  if (missing.length) {
    fetchTemplatesForContext(win, missing);

    return null;
  }

  const tree = [];
  const folds = new Set();
  const hostIds = new Set();
  let hang = (levelTree) => tree.push(...levelTree);
  let host = null;
  let baseDepth = 0;

  for (let i = 0; i < stack.length; i += 1) {
    // What this level calls: the next file on the stack, or the open one.
    const wanted = i + 1 < stack.length ? stack[i + 1].src : src;
    const clone = (node) => ({
      ...node,
      id: `ctx${i}:${node.id}`,
      path: `ctx${i}/${node.path}`,
      ctxLevel: i,
      children: node.children.map(clone),
    });
    const levelTree = parseTemplateTree(htmlTreeTemplates.get(stack[i].type)).map(clone);
    const trail = [];

    const find = (nodes, above) => {
      for (const node of nodes) {
        if (node.kind === 'component' && node.src === wanted) {
          trail.push(...above, node);

          return node;
        }

        const hit = find(node.children, [...above, node]);

        if (hit) {
          return hit;
        }
      }

      return null;
    };

    host = wanted ? find(levelTree, []) : null;

    if (!host) {
      return null;
    }

    const held = new Set(trail.map((node) => node.id));
    const walk = (nodes, depth) => {
      for (const node of nodes) {
        if (node.children.length && (held.has(node.id) ? htmlTreeFolds.has(node.path) : htmlTreeShut(node, depth))) {
          folds.add(node.id);
        }

        walk(node.children, depth + 1);
      }
    };

    walk(levelTree, baseDepth);
    hang(levelTree);
    hostIds.add(host.id);
    // The next file unfolds under this call, one level in from it.
    baseDepth += trail.length;
    hang = ((at) => (next) => {
      at.children = next;
    })(host);
  }

  for (const id of foldedIds(roots)) {
    folds.add(id);
  }

  // A twist on the call row itself shuts the component's rows.
  if (htmlTreeFolds.has(host.path)) {
    folds.add(host.id);
  }

  host.children = roots;

  return {
    tree,
    folds,
    hostId: host.id,
    hostIds,
    levels: stack.length,
    rootId: tree.find((node) => !node.kind)?.id || '',
    label: owner.label,
    svg: owner.svg,
    cat: owner.cat,
  };
}

/**
 * A file on the way into the open component that the tree has not seen —
 * the panel was shut while the dock passed through it. Same endpoint and
 * cache as the section prefetch; the tree paints again when it lands.
 */
function fetchTemplatesForContext(win, types) {
  for (const type of types) {
    if (!htmlTreePrefetch.includes(type) && !htmlTreeFetching.has(type)) {
      htmlTreePrefetch.push(type);
    }
  }

  htmlTreeRepaintOnFetch = true;
  runSectionTemplatePrefetch(win);
}

function htmlTreeRootName(win, sections, openUid) {
  const component = ask('dock:component-exit-state');

  if (component?.open) {
    return humanizeHandle(component.name) || component.name || '';
  }

  if (openUid) {
    return sections.find((section) => section.uid === openUid)?.label || '';
  }

  const type = ask('dock:current-type') || '';

  return setMeta(win, type)?.display || humanizeHandle(type) || '';
}

/**
 * Step into another section: the same move a click on the page makes, without
 * the page. `focusFromPreview` loads the file from publish values before it
 * touches the sidebar, so this works with the preview showing an error.
 */
function openHtmlTreeSection(win, doc, sections, uid, openUid) {
  const section = sections.find((item) => item.uid === uid);

  if (!section) {
    return;
  }

  // The open section draws no row of its own — its tags are the row — so there
  // is nothing here to click and nothing to fold.
  if (uid === openUid) {
    return;
  }

  // Folds belong to the file that is about to be replaced.
  htmlTreeFolds.clear();
  htmlTreeActiveId = null;
  // A click on a section is the answer to "which one", so the list stops
  // holding every section shut from here on.
  htmlTreeShutStart = false;
  closeHtmlTreeMenu();
  endHtmlTreeDrag();

  // The click answers now, not when the file lands: the row that was clicked
  // takes the mark and the box this instant, and unfolds into its tags a moment
  // later. A click that shows nothing until a fetch returns is the jump.
  //
  // The timer is the way out of a load that never arrives — without it the
  // panel would sit lit on a section it never opened.
  htmlTreePendingUid = uid;
  htmlTreePendingHtml = dockHtml();
  // Held in hand already: draw this section's tags now and let the dock catch
  // up behind them. Nothing writes while it does — see `htmlTreeAheadOfDock`.
  htmlTreeAhead = htmlTreeTemplates.get(section.type) || '';

  if (htmlTreeAhead) {
    htmlTreeActiveId = firstTagId(parseTemplateTree(htmlTreeAhead)) || null;
  }
  // Two sections of the same kind share a template: the dock has nothing to
  // fetch, so the wait is over as soon as it answers rather than when markup
  // that is never coming arrives. Asked here, before the click moves anything:
  // the dock's type still names the file on screen.
  htmlTreePendingSame = (ask('dock:current-type') || '') === section.type;
  win.clearTimeout(htmlTreePendingTimer);
  htmlTreePendingTimer = win.setTimeout(() => {
    htmlTreePendingUid = '';
    htmlTreeReseat = false;
    renderHtmlTree(win);
  }, 4000);
  renderHtmlTree(win);

  // Mount the section, then focus it — in that order, and with the wait in
  // between.
  //
  // The panel beside the preview keeps only a handful of sections mounted, and
  // the focus code bails on a set it cannot find in the DOM. A click on the
  // page goes through the same mount but never notices, because it replays
  // itself once the section has landed. Focusing straight after activating is
  // focusing something that is not there yet: the tree and the dock moved, and
  // the sidebar quietly went on showing the section before.
  const focus = () => focusFromPreview(section.uid, doc, win, { clampToSection: true });

  openLiteSection(section.uid, doc, win, focus);
  sendToPreview(
    { source: SOURCE, type: MSG.SVE_ACTIVATE, ids: section.ids },
    win
  );

  // Two sections can share a template, and then the dock has nothing to reload
  // and nothing to announce — but the row that is open has still changed.
  win.setTimeout(() => renderHtmlTree(win), 0);
}

/** Is this row id still in the tree in front of us? */
function hasNodeId(nodes, id) {
  if (!id) {
    return false;
  }

  for (const node of nodes || []) {
    if (node.id === id || hasNodeId(node.children, id)) {
      return true;
    }
  }

  return false;
}

/** The first real tag, depth first: the row that stands for the whole file. */
function firstTagId(nodes) {
  for (const node of nodes || []) {
    if (!node.kind) {
      return node.id;
    }

    const inner = firstTagId(node.children);

    if (inner) {
      return inner;
    }
  }

  return '';
}

/** Is this row shut? Open at the top, shut below it, flipped where asked. */
function htmlTreeShut(node, depth) {
  return htmlTreeFolds.has(node.path) ? depth === 0 : depth > 0;
}

/**
 * Which rows are folded away, as the ids `flattenHtmlTree` asks for.
 *
 * Worked out from the tree in front of us on every paint rather than kept in a
 * set over time: one level open is what a click asks for, and a file nobody has
 * twisted anything in is exactly that with nothing remembered.
 */
function foldedIds(roots) {
  const shut = new Set();

  const walk = (nodes, depth) => {
    for (const node of nodes) {
      if (node.children.length && htmlTreeShut(node, depth)) {
        shut.add(node.id);
      }

      walk(node.children, depth + 1);
    }
  };

  walk(roots, 0);

  return shut;
}

export function renderHtmlTree(win) {
  const doc = win.document;
  const panel = htmlTreePanel(doc);
  const list = panel?.querySelector('[data-sve-html-tree-list]');

  if (!list) {
    return;
  }

  ensureHtmlTreeStyles(doc);
  syncComponentProps(win);

  const dock = dockHtml();

  // The dock has caught up the moment it holds the same markup: from here the
  // ids on screen are its ids again, and everything may write.
  if (htmlTreeAhead && htmlTreeAhead === dock) {
    htmlTreeAhead = '';
  }

  const html = htmlTreeAhead || dock;
  const roots = parseTemplateTree(html);
  htmlTreeRoots = roots;
  const type = ask('dock:current-type') || '';
  const aliases = readHtmlTreeLabels(type);
  const pageBuilder = pageHasSectionField(win, doc);
  const component = ask('dock:component-exit-state') || {};
  const inComponent = !!component.open;

  const sections = htmlTreeSections(win, doc);

  // What the dock holds is newer than anything fetched earlier — a save half a
  // minute ago is in it and not in the cache.
  if (type && dock && !htmlTreeAhead) {
    htmlTreeTemplates.set(type, dock);
  }

  prefetchSectionTemplates(win, sections);
  // The section the dock is actually holding, and the one the reader just
  // clicked. They are the same as soon as the file lands.
  const liveUid = currentSectionUid(win, doc, sections);

  // Page with every section removed: the dock may still hold the last file.
  // Showing those tags as if they belonged here is the hang after delete.
  if (pageBuilder && !sections.length) {
    htmlTreeRoots = [];
    htmlTreeUi.rows = [];
    htmlTreeUi.sections = [];
    htmlTreeUi.frame = null;
    htmlTreeUi.pageBuilder = true;
    htmlTreeUi.emptyText = t(win, 'html_tree_empty');
    htmlTreeUi.canEdit = !ask('dock:is-locked');
    htmlTreeUi.look = readHtmlTreeLook(win);
    htmlTreeUi.onRefresh = () => renderHtmlTree(win);
    htmlTreeUi.onSection = null;
    paintComponentExit(win);
    mountPane(list, HtmlTreeList);
    publishHtmlPick(win, []);

    return;
  }

  htmlTreeUi.pageBuilder = pageBuilder;

  const fileKey = `${type}|${liveUid}`;

  // The dock says it has moved on. What it is showing is still the file being
  // left, so this only notes the move and remembers that markup; the tree
  // reseats on the first paint that shows something else — which is the new
  // file arriving. Two sections that share a template are the exception: there
  // is no new markup coming, so the move is over as soon as it is announced.
  //
  // Unless the new file is already on screen. A component opened from a row's
  // menu loads before the tree paints, so the move and its markup arrive in
  // one paint — and a reseat armed on *that* markup waited for the next change
  // to it: the first value typed into a picked component's fields. The picked
  // row jumped to the file's first tag and took the fields with it, once, and
  // never again. The last paint's markup is what tells the two cases apart.
  let reseatNow = false;

  if (fileKey !== htmlTreeFileKey) {
    htmlTreeFileKey = fileKey;
    htmlTreeFolds.clear();

    if (htmlTreeLastHtml !== null && html !== htmlTreeLastHtml) {
      reseatNow = true;
    } else {
      htmlTreeReseat = html;
    }
  }

  if (reseatNow || (htmlTreeReseat !== false && html !== htmlTreeReseat)) {
    htmlTreeReseat = false;
    htmlTreeFolds.clear();
    htmlTreeActiveId = firstTagId(roots) || null;
  }

  htmlTreeLastHtml = html;

  // The clicked section is open once its file is on screen — not merely once
  // the dock has said which file it is going to fetch.
  if (htmlTreePendingUid
    && (htmlTreePendingUid === liveUid || !sections.length)
    && (htmlTreePendingSame || html !== htmlTreePendingHtml)) {
    win.clearTimeout(htmlTreePendingTimer);
    htmlTreePendingUid = '';
    htmlTreeReseat = false;

    // Unless the tree is already sitting on this file — drawn from the cache
    // the instant it was clicked — in which case it was folded and seated
    // then, and anything twisted open since stays open.
    //
    // Asked of the parsed tree, not of the flattened rows: those are built
    // further down, and reaching up for them from here threw on every click
    // that landed on the file the dock already had — which took the whole
    // paint with it, so the section simply never opened.
    if (!hasNodeId(roots, htmlTreeActiveId)) {
      htmlTreeFolds.clear();
      htmlTreeActiveId = firstTagId(roots) || null;
    }
  }

  const pendingUid = sections.some((section) => section.uid === htmlTreePendingUid)
    ? htmlTreePendingUid
    : '';
  // Which section is unfolded, and whether this file is one of the page's
  // sections at all. Header, footer and a collection's own template are not,
  // and a list of sections around their markup would be claiming otherwise.
  const openUid = htmlTreeShutStart ? '' : pendingUid || liveUid;

  // Inside a component, the section's own file is drawn around it: the
  // component's rows unfold from the row that calls it, and everything else
  // fades — the way the preview fades the page around an open component.
  const around = inComponent ? contextAround(win, sections, openUid, roots) : null;

  const inSections = !!(pendingUid || liveUid);

  // A search looks through folded rows too: the list filters what is here,
  // so while a query is in the box the whole file is flattened.
  // Which part of the page's frame this file is — read off the dock's file,
  // so the rows and the frame around them can never disagree. '' on a
  // section, a component, a template.
  const frameKind = inSections || inComponent ? '' : String(ask('dock:chrome-kind') || '');
  // On the layout the row to stand on is <main>, and it sits under a <body>
  // the tree keeps folded: the way down to it opens before the rows are cut.
  const mainNode = frameKind === 'main' ? findNodeByTag(roots, 'main') : null;

  if (mainNode) {
    expandHtmlTreePath(mainNode.path);
  }

  // The dock names its new file before it holds it. Until the markup is that
  // file's — <main> on the layout, the half's own element at the root — no
  // rows: a header drawn around a section's rows is worse than a moment of
  // nothing, and the dock says when the file lands.
  // The half's own element: the one carrying data-sve-chrome, or failing
  // that the first <header>/<footer>. Not simply the file's first tag — a
  // style block or a comment may stand in front of it.
  const chromeNode = frameKind === 'header' || frameKind === 'footer'
    ? roots.find((node) => !node.kind && html.slice(node.from, node.openTo).includes(`data-sve-chrome="${frameKind}"`))
      || findNodeByTag(roots, frameKind)
    : null;
  const landed = frameKind === 'main' ? !!mainNode : !frameKind || !!chromeNode;
  const rows = !landed
    ? []
    : around
      ? flattenHtmlTree(around.tree, htmlTreeUi.query ? new Set() : around.folds)
      : flattenHtmlTree(roots, htmlTreeUi.query ? new Set() : foldedIds(roots));

  if (!html.trim() && !dockIsOpen(doc)) {
    htmlTreeUi.emptyText = t(win, 'html_tree_need_dock');
  } else {
    htmlTreeUi.emptyText = t(win, 'html_tree_empty');
  }

  htmlTreeUi.slotText = t(win, 'antlers_drop_here');
  htmlTreeUi.dataTitle = t(win, 'data_vars_title');
  htmlTreeUi.pageTitle = t(win, 'component_props_page');
  htmlTreeUi.renameTitle = t(win, 'html_tree_rename');
  htmlTreeUi.tagTitle = t(win, 'tw_tag');
  htmlTreeUi.hideTitle = t(win, 'html_tree_hide');
  htmlTreeUi.showTitle = t(win, 'html_tree_show');
  htmlTreeUi.duplicateTitle = t(win, 'html_tree_duplicate');
  htmlTreeUi.deleteTitle = t(win, 'html_tree_delete');
  htmlTreeUi.videoHoldTitle = t(win, 'html_tree_video_hold');
  htmlTreeUi.videoPlayTitle = t(win, 'html_tree_video_play');
  htmlTreeUi.lockedTitle = t(win, 'html_tree_locked');
  htmlTreeUi.searchEmpty = t(win, 'html_tree_search_empty');
  htmlTreeUi.canEdit = !ask('dock:is-locked');
  htmlTreeUi.look = readHtmlTreeLook(win);
  applyFamilyColors(win);
  htmlTreeUi.onQuery = () => renderHtmlTree(win);
  paintComponentExit(win);
  htmlTreeUi.inComponent = inComponent;
  // A faded row is a file you came through: clicking one is the way back to
  // that file — one level out for the file just beneath, two for the one
  // beneath that. The row the open component unfolds from is where you
  // already are.
  htmlTreeUi.onContextRow = (id) => {
    if (!around || id === around.hostId) {
      return;
    }

    const level = rows.find((item) => item.id === id)?.ctxLevel ?? around.levels - 1;

    ask('dock:exit-component', around.levels - level);
    renderHtmlTree(win);
  };
  htmlTreeUi.onSelect = (id) => {
    // A field waiting for something to point at takes the row instead of
    // selecting it. The tree is the reliable half of that gesture: the preview
    // can only offer elements it has managed to line up with the open file.
    const row = rows.find((item) => item.id === id);

    if (row && componentBindPick(win, row.path)) {
      return;
    }

    selectHtmlTreeRow(win, id, rows);
  };
  htmlTreeUi.onTwist = (id) => {
    const path = rows.find((item) => item.id === id)?.path;

    if (!path) {
      return;
    }

    if (htmlTreeFolds.has(path)) {
      htmlTreeFolds.delete(path);
    } else {
      htmlTreeFolds.add(path);
    }

    renderHtmlTree(win);
  };
  htmlTreeUi.onTagChange = (event, id) => {
    const row = htmlTreeUi.rows.find((item) => item.id === id);

    if (row && !htmlTreeAheadOfDock()) {
      twOpenTagMenuAt(win, event.currentTarget, row);
    }
  };
  htmlTreeUi.onRename = (id) => beginHtmlTreeRename(win, id);
  htmlTreeUi.onRenameCommit = () => finishHtmlTreeRename(win, true);
  htmlTreeUi.onRenameCancel = () => finishHtmlTreeRename(win, false);
  htmlTreeUi.onHide = (id) => hideHtmlTreeRow(win, id);
  htmlTreeUi.onVideoHold = (id) => toggleVideoHold(win, id);
  htmlTreeUi.onDuplicate = (id) => duplicateHtmlTreeRow(win, id);
  htmlTreeUi.onDelete = (id) => deleteHtmlTreeRow(win, id);
  htmlTreeUi.onPointerDown = (event, id) => beginHtmlTreePointer(win, event, id);
  htmlTreeUi.onSectionPointerDown = (event, uid) => beginSectionPointer(win, event, uid);
  htmlTreeUi.onContext = (event, id) => openHtmlTreeMenu(win, event, id);
  htmlTreeUi.onInspectCommit = (value) => commitHtmlTreeInspector(win, value);
  htmlTreeUi.onPropValue = (handle, value, bound) => commitComponentValue(win, handle, value, bound);
  // A page picked for a link field is a value, not a binding: what goes into
  // the call is the URL itself, which is what an href needs.
  htmlTreeUi.onPropPage = (anchor, handle) =>
    openPageMenu(win, anchor, (url) => commitComponentValue(win, handle, url, false));
  htmlTreeUi.onLoopKind = (kind) => setHtmlTreeLoopKind(win, kind);
  htmlTreeUi.onAddBranch = (kind) => addHtmlTreeBranch(win, kind);
  htmlTreeUi.onLoopSortField = (value) => {
    const row = activeAntlersRow();
    const field = String(value || '').trim();

    if (!row) {
      return;
    }

    // The field completes a direction chosen a moment ago; without one at all,
    // ascending is what "sorted" means.
    const draft = htmlTreeSortDraft?.id === row.id ? htmlTreeSortDraft.dir : '';
    const dir = row.sortDir || draft || 'asc';

    htmlTreeSortDraft = null;
    applyAntlersEdit(win, (html, node) => writeLoopTag(html, node, { sortField: field, sortDir: dir }));
  };
  htmlTreeUi.onLoopSortDir = (value) => {
    const row = activeAntlersRow();
    const dir = String(value || '');

    if (!row) {
      return;
    }

    // Nothing to write yet: hold the choice and show the field it needs.
    if ((dir === 'asc' || dir === 'desc') && !row.sortField) {
      htmlTreeSortDraft = { id: row.id, dir };
      paintHtmlTreeInspector(win, row);

      return;
    }

    htmlTreeSortDraft = null;

    // Dropping the sort drops the field with it: a leftover `sort:title` on a
    // loop the panel says is unsorted is a lie the next reader has to unpick.
    applyAntlersEdit(win, (html, node) =>
      writeLoopTag(html, node, {
        sortDir: dir,
        sortField: dir === 'asc' || dir === 'desc' ? node.sortField : '',
      })
    );
  };
  htmlTreeUi.onLoopLimit = (value) =>
    applyAntlersEdit(win, (html, row) =>
      writeLoopTag(html, row, { limit: String(value || '').replace(/\D/g, '') })
    );
  // The publish form is the Control Panel's own components, so it gets an app
  // that can see them. The inspector says when its placeholder is there.
  htmlTreeUi.onPropHost = (el) => (el ? callValues.mount(el) : callValues.unmount());
  htmlTreeUi.onInspectData = (anchor, use) => {
    // The picker writes tags into the HTML pane; here the bare handle is what a
    // condition or a loop is made of, so the pick is taken over.
    //
    // From the row's own start, not from inside it: a loop's handle and a
    // condition's expression are written in the scope *around* them, so an
    // outer loop counts and the row itself does not.
    ask('dock:data-menu', {
      anchor,
      at: rows.find((item) => item.id === htmlTreeActiveId)?.from,
      onPick: (row) => use(String(row?.var || '').trim()),
    });
  };

  // The first tag stands for the whole file, so that is where the file's own
  // name goes. A class there says nothing you cannot read one row down, and the
  // bracketed name of a section root is usually `{{ _class }}` — nothing at all.
  const rootId = rows.find((item) => !item.kind)?.id;

  // Inside a component the file is not the section's, so its root tag is
  // drawn as the tag it is — with its own mark, not the section's, and not
  // standing for the section. It used to: the `<li>` wore the section's icon
  // and name, and its bin would have deleted the page section.
  const rootName = inComponent ? '' : htmlTreeRootName(win, sections, openUid);

  // The section this file belongs to, so its root tag can wear the same name
  // and mark the shut row wears. One row, two states — not two rows.
  const openSection = openUid && !inComponent ? sections.find((item) => item.uid === openUid) : null;

  const held = heldVideos(win);
  let videoIndex = 0;
  // On the header's or footer's own file the root row IS that half's row in
  // the frame: named as the half, with no move, no copy, no bin — a header is
  // a header. On the layout it is the <main> row; the rest of that file
  // (html, head, the partial calls) is not this tree's business.
  const chromeKind = frameKind === 'header' || frameKind === 'footer' ? frameKind : '';
  const chromeRootId = chromeNode ? chromeNode.id : '';
  const mainRaw = mainNode ? rows.find((row) => row.id === mainNode.id) || null : null;
  const mainEnd = mainRaw ? nextOutside(rows, mainRaw) : -1;

  if (mainRaw && !rows.slice(rows.indexOf(mainRaw), mainEnd).some((row) => row.id === htmlTreeActiveId)) {
    htmlTreeActiveId = mainRaw.id;
  }

  htmlTreeUi.rows = rows.map((row) => {
    const icon = htmlTreeIcon(row.tag, row.kind, row.antlers);
    // Which of the file's videos this row is, in document order — what the
    // preview is told to hold; -1 for anything that is not a <video>.
    const videoNth = row.tag === 'video' && !row.kind ? videoIndex++ : -1;
    // What the row is called before a rename. Renaming back to it drops the
    // alias again, so the default must be what the alias is measured against.
    const aroundRoot = !!around && row.id === around.rootId;
    const base = row.id === rootId && rootName ? rootName : aroundRoot ? around.label : row.klass;
    const isRoot = row.id === rootId;

    return {
      ...row,
      base,
      // The open page section's root already carries the section's own name
      // (its label); the file's alias must not override it here.
      name: chromeKind && row.id === chromeRootId
        ? t(win, `html_tree_frame_${chromeKind}`)
        : row === mainRaw
          ? t(win, 'html_tree_frame_main')
          : isRoot && openSection ? base : htmlTreeDisplayName(base, row.path, aliases),
      current: row.id === htmlTreeActiveId,
      letter: aroundRoot ? '' : icon.letter || '',
      svg: chromeKind && row.id === chromeRootId
        ? HTML_ICONS[chromeKind]
        : row === mainRaw
          ? HTML_ICONS.main
          : isRoot && openSection ? openSection.svg : aroundRoot ? around.svg : icon.svg || '',
      frame: chromeKind && row.id === chromeRootId ? chromeKind : row === mainRaw ? 'main' : '',
      cat: aroundRoot ? around.cat : tagFamily(row.tag, row.kind, row.antlers),
      // Around the open component: `dim` for the section's own rows, `host`
      // for the one the component unfolds from. '' for the component's rows.
      // Around the open component: `host` for every call on the way down to
      // it, `dim` for the rest of those files' rows, '' for the open one's.
      context: around ? (around.hostIds.has(row.id) ? 'host' : row.id.startsWith('ctx') ? 'dim' : '') : '',
      // The open section IS its first tag row. Carrying the uid here is what
      // lets delete tell "this section on this page" from "this tag in the
      // file" — they are the same row, and they are not the same thing.
      sectionRoot: isRoot && openSection ? openSection.uid : '',
      // The fields icon: on a section's root, where there is a fieldset to
      // open. A template's fields are its blueprint, opened from the top bar;
      // a static section has none — its menu offers to add them.
      fieldsIcon: !!(isRoot && openSection && !openSection.static),
      videoNth,
      videoHeld: videoNth >= 0 && held.has(videoNth),
    };
  });

  syncVideoHolds(win, held);

  // The families above each row, one per level, for the guides the tags look
  // draws: the guide under a loop is the loop's colour. Rows come in document
  // order, so a stack of what sits at each depth is the chain.
  const chain = [];

  for (const row of htmlTreeUi.rows) {
    chain.length = row.depth;
    row.guides = chain.slice();
    chain[row.depth] = row.cat;
  }

  if (mainRaw) {
    const start = rows.indexOf(mainRaw);
    const base = mainRaw.depth;

    htmlTreeUi.rows = htmlTreeUi.rows.slice(start, mainEnd).map((row) => ({
      ...row,
      depth: row.depth - base,
      guides: row.guides.slice(base),
    }));

    // Landing on the layout: stand on <main>, so the pane shows it.
    if (htmlTreeMainSeated !== fileKey) {
      htmlTreeMainSeated = fileKey;
      win.setTimeout(() => selectHtmlTreeRow(win, mainRaw.id, rows), 0);
    }
  }

  // The page's sections: listed under main on a section's file, and — dimmed,
  // to click back out to — around the header's, the footer's or the layout's.
  htmlTreeUi.sections = inSections || frameKind
    ? sections.map((section) => {
        const current = !!openUid && section.uid === openUid;
        // Tags are drawn as soon as there are tags: from the cache the moment
        // it is clicked, and otherwise when the dock answers. Until then the
        // section is one row — lit and shut, about to unfold.
        const ready = current && (!pendingUid || !!htmlTreeAhead);

        return {
          ...section,
          current,
          ready,
          // Shut, a section is drawn by the same component as every other row,
          // from a row built here. Open, it IS the first row of its own file —
          // so the name and the mark computed here are stamped onto that row
          // below, and the two states cannot drift apart.
          row: {
            id: `sec:${section.uid}`,
            section: section.uid,
            tag: section.tag,
            name: section.label,
            kind: '',
            svg: section.svg,
            cat: section.cat,
            letter: '',
            depth: 0,
            hasChildren: true,
            shut: true,
            current,
            hidden: !section.enabled,
          },
        };
      })
    : [];
  htmlTreeUi.frame = frameAroundPage(win, sections, inSections, inComponent, frameKind);
  htmlTreeUi.frameOpenTitle = t(win, 'html_tree_frame_open');
  htmlTreeUi.frameMainTitle = t(win, 'html_tree_frame_main_open');
  htmlTreeUi.frameFieldsTitle = t(win, 'html_tree_frame_fields');
  // A click steps in: main opens the layout's <main> in the dock; a half is
  // clicked the way it is clicked in the preview — the same question, the
  // same door. Already standing there, a click scrolls the preview to it.
  htmlTreeUi.onFrame = (kind) => {
    if (frameKind === kind) {
      scrollPreviewToFrame(win, kind);
    } else {
      enterFrame(win, kind);
    }
  };
  htmlTreeUi.onFrameEnter = (kind) => enterFrame(win, kind);
  // The half's fields are its global set's blueprint.
  htmlTreeUi.onFrameFields = (kind) =>
    openGlobalFieldsOverlay(win, chromeGlobalHandle(win, kind), t(win, `html_tree_frame_${kind}`));
  htmlTreeUi.onFrameTwist = () => {
    htmlTreeUi.mainShut = !htmlTreeUi.mainShut;
  };

  // Not on the release of a drag: the click lands on the row the pointer
  // took hold of, and that section was moved, not asked for.
  htmlTreeUi.onSection = (uid) => {
    if (!htmlTreeSuppressClick) {
      // From inside the header or the footer, a section is the way back out
      // — the same way a click on it in the preview goes.
      leaveChrome(win);
      openHtmlTreeSection(win, doc, sections, uid, openUid);
    }
  };
  htmlTreeUi.onRefresh = () => renderHtmlTree(win);

  paintHtmlTreeInspector(
    win,
    htmlTreeUi.rows.find((item) => item.id === htmlTreeActiveId)
  );
  mountPane(list, HtmlTreeList);
  publishHtmlPick(win, roots);
}

/**
 * The page's frame: header, main and footer, drawn around the sections.
 *
 * The layout puts them around every page, so the tree shows them where they
 * are — the header first, the sections inside main, the footer last. They are
 * rows to look at and to go to, not rows to edit: none of them moves, copies,
 * renames or deletes, because a header is a header.
 *
 * On a section's file the three stand around the page's list. On the
 * header's, the footer's or the layout's own file that part's root row wears
 * the frame (stamped in the rows above) and the other two stand shut and
 * dimmed around it, with the sections dimmed under main — every one of them a
 * way back out. Anywhere else — a collection's template, a component — there
 * is no frame, and the list is what it was.
 */
function frameAroundPage(win, sections, inSections, inComponent, kind) {
  if (!inSections && !kind) {
    return null;
  }

  const row = (part) => ({
    id: `frame:${part}`,
    frame: part,
    synthetic: true,
    tag: part,
    name: t(win, `html_tree_frame_${part}`),
    kind: '',
    svg: HTML_ICONS[part] || '',
    cat: 'layout',
    letter: '',
    depth: 0,
    // Only main folds, and only when there are sections in it to fold away.
    hasChildren: part === 'main' && sections.length > 0,
    shut: part !== 'main',
    current: false,
    hidden: false,
  });

  return { kind, header: row('header'), main: row('main'), footer: row('footer') };
}

/** The first node with this tag, wherever it sits in the tree. */
function findNodeByTag(nodes, tag) {
  for (const node of nodes || []) {
    if (node.tag === tag && !node.kind) {
      return node;
    }

    const inner = findNodeByTag(node.children, tag);

    if (inner) {
      return inner;
    }
  }

  return null;
}

/** The index of the first row after `row` that is not inside it. */
function nextOutside(rows, row) {
  let i = rows.indexOf(row) + 1;

  while (i < rows.length && rows[i].depth > row.depth) {
    i += 1;
  }

  return i;
}

/** Scroll the preview to the header, the footer, or the content between them. */
function scrollPreviewToFrame(win, kind) {
  const pdoc = previewDocument(win);
  const el = kind === 'main' ? pdoc?.querySelector('main') : pdoc?.querySelector(`[data-sve-chrome="${kind}"]`);

  el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * Out of the header's or footer's form, when it is open: the same way a
 * click on a page section in the preview leaves it. The form's edits stay
 * stashed; the preview is told to drop the half's focus.
 */
function leaveChrome(win) {
  const open = String(ask('dock:chrome-open', win.document) || '');

  if (open !== 'header' && open !== 'footer') {
    return false;
  }

  win.postMessage({ source: SOURCE, type: MSG.CLOSE_CHROME }, win.location.origin);
  sendToPreview({ source: SOURCE, type: MSG.SVE_FORCE_EXIT_CHROME }, win);

  return true;
}

/**
 * Step into a part of the frame.
 *
 * A half: clicked in the preview, exactly as the reader clicks it there —
 * the bridge asks its "this is global" question, and on yes steps in: focus,
 * the page faded around it, the form, the file. Only a preview without the
 * half (not rendered, not editable) is told directly.
 *
 * Main: the layout's file in the dock, and the tree stands on its <main>.
 *
 * The tree stays open through the door (chrome.js keeps it). For the case it
 * was not open, it is drawn once the dock holds the half's file — polled,
 * because the reader answers the question on their own time, and nothing
 * announces the answer to this module. Gives up quietly.
 */
function enterFrame(win, kind) {
  const doc = win.document;

  if (String(ask('dock:chrome-kind') || '') === kind) {
    return;
  }

  if (kind === 'main') {
    leaveChrome(win);
    ask('dock:open-file', LAYOUT_TEMPLATE_TYPE);

    return;
  }

  if (kind !== 'header' && kind !== 'footer') {
    return;
  }

  const el = previewDocument(win)?.querySelector(`[data-sve-chrome="${kind}"]`);

  if (el) {
    el.scrollIntoView({ block: 'nearest' });
    el.dispatchEvent(new el.ownerDocument.defaultView.MouseEvent('click', { bubbles: true, cancelable: true }));
  } else {
    win.postMessage({ source: SOURCE, type: MSG.OPEN_CHROME, kind }, win.location.origin);
  }

  const started = Date.now();
  const back = async () => {
    if (String(ask('dock:chrome-kind') || '') !== kind) {
      if (Date.now() - started < 30000) {
        win.setTimeout(back, 250);
      }

      return;
    }

    await (ask('dock:load-settled') || null);
    openHtmlTreePanel(win);
  };

  win.setTimeout(back, 250);
}

function publishHtmlPick(win, roots) {
  if (!htmlTreePanel(win.document)) {
    return;
  }

  sendPick(win, roots);
}

/**
 * Turn the preview into something you can point at.
 *
 * Split out from `publishHtmlPick` because binding a field works whether or
 * not the tree panel is open — the panel is one reason to stamp the preview,
 * not the only one.
 */
function sendPick(win, roots) {
  const first = roots[0];

  // Inside a component the dock's uid still names the *section* it was opened
  // from, and lining the file up against that element cannot work: a component
  // is not the section, it is whatever the section called. With no uid the
  // preview falls back to the first element matching the file's own root tag
  // and class — one of the places the component renders, which is all that is
  // needed, because every one of them came from this one file.
  const component = !!ask('dock:component-src');
  const uid = component ? '' : ask('dock:current-uid') || '';

  sendToPreview(
    {
      source: SOURCE,
      type: MSG.SVE_HTML_PICK,
      on: true,
      uid,
      // Only a component renders in more than one place, and only there should
      // every match be stamped. A section that happens to arrive without a uid
      // must still line up with one element — matching on tag and class alone
      // would stamp every other section on the page with this one's paths.
      all: component,
      tag: first?.tag || '',
      klass: first?.klass || '',
      nodes: serializePickTree(roots),
    },
    win
  );
}

/**
 * Open every row on the way down to this one.
 *
 * By walking for the node and opening what it was found inside, not by cutting
 * the path into prefixes: a tag's path counts only tags, so the `{{ if }}` and
 * `{{ collection }}` rows it sits inside are nowhere in its own path. Matching
 * on prefixes left every one of those shut — and a row inside a shut row is not
 * drawn, so a click in the preview marked nothing and looked broken.
 */
function expandHtmlTreePath(path) {
  if (!path) {
    return;
  }

  const walk = (nodes, depth) => {
    for (const node of nodes || []) {
      if (node.path === path) {
        return true;
      }

      if (walk(node.children, depth + 1)) {
        // `htmlTreeShut` reads the flip against the default for that depth: the
        // top level is open already, everything under it is not.
        if (depth === 0) {
          htmlTreeFolds.delete(node.path);
        } else {
          htmlTreeFolds.add(node.path);
        }

        return true;
      }
    }

    return false;
  };

  walk(htmlTreeRoots, 0);
}

function beginHtmlTreeRename(win, id) {
  if (htmlTreeSuppressClick) {
    return;
  }

  const row = htmlTreeUi.rows.find((item) => item.id === id);

  // The label renames a class. A condition, loop or component row has no class
  // behind it — its name is what the template says, and is edited as such.
  if (!row || row.kind) {
    return;
  }

  htmlTreeActiveId = id;
  htmlTreeUi.rows.forEach((item) => {
    item.current = item.id === id;
  });
  htmlTreeUi.editingId = id;
  htmlTreeUi.draft = row.name;

  win.setTimeout(() => {
    const input = htmlTreePanel(win.document)?.querySelector('[data-sve-ht-rename]');

    input?.focus();
    input?.select();
  }, 0);
}

function finishHtmlTreeRename(win, save) {
  const id = htmlTreeUi.editingId;

  if (!id) {
    return;
  }

  const row = htmlTreeUi.rows.find((item) => item.id === id);

  htmlTreeUi.editingId = null;

  if (save && row) {
    if (row.sectionRoot) {
      // The open page section's root: the name belongs to this section on
      // this page, not to the file every section of its type renders through
      // — renaming one FAQ must leave the other FAQ its name.
      writeSectionLabel(win, row.sectionRoot, htmlTreeUi.draft);
    } else {
      writeHtmlTreeLabel(
        ask('dock:current-type') || '',
        row.path,
        htmlTreeUi.draft,
        row.base || row.klass
      );
    }
  }

  htmlTreeUi.draft = '';
  renderHtmlTree(win);
}

/**
 * The name one section wears on this page: `_sve_label` on its row, the same
 * field the block tree and the focus header read. Empty, or the set's own
 * name again, takes the field off — the row goes back to what its type is
 * called.
 */
function writeSectionLabel(win, uid, label) {
  const field = sectionField(win) || 'page_sections';
  const next = String(label || '').replace(/\s+/g, ' ').trim();

  for (const container of activeContainers(win.document) || []) {
    const values = unwrapRef(container.values);
    const list = values && typeof values === 'object' ? values[field] : null;

    if (!Array.isArray(list)) {
      continue;
    }

    const index = list.findIndex(
      (row) => row && typeof row === 'object' && [row._visual_id, row.id, row._id].includes(uid)
    );

    if (index === -1) {
      continue;
    }

    const type = globalSectionType(win, list[index]) || list[index].type;
    const given = setMeta(win, type)?.display || humanizeHandle(type) || type;
    const rows = JSON.parse(JSON.stringify(list));

    rows[index] = { ...rows[index] };

    if (!next || next === given) {
      delete rows[index]._sve_label;
    } else {
      rows[index]._sve_label = next;
    }

    container.setFieldValue(field, rows);

    return true;
  }

  return false;
}

const VIDEO_HOLDS_KEY = 'sveVideoHolds';

/** The videos of the open file held paused, by their order in the file. */
function heldVideos(win) {
  const type = String(ask('dock:current-type') || '');

  try {
    const all = JSON.parse(win.localStorage.getItem(VIDEO_HOLDS_KEY) || '{}');
    const list = type && Array.isArray(all[type]) ? all[type] : [];

    return new Set(list.filter((n) => Number.isInteger(n)));
  } catch {
    return new Set();
  }
}

function rememberVideoHolds(win, held) {
  const type = String(ask('dock:current-type') || '');

  if (!type) {
    return;
  }

  try {
    const all = JSON.parse(win.localStorage.getItem(VIDEO_HOLDS_KEY) || '{}');

    if (held.size) {
      all[type] = [...held].sort((a, b) => a - b);
    } else {
      delete all[type];
    }

    win.localStorage.setItem(VIDEO_HOLDS_KEY, JSON.stringify(all));
  } catch {
    /* no storage: the hold lasts the session */
  }
}

/**
 * Tell the preview which of the open section's videos stay paused. Sent on
 * every draw of the tree — the preview's bridge starts over on a full load,
 * and an extra hold on a video already held costs nothing.
 */
function syncVideoHolds(win, held) {
  const uid = String(ask('dock:current-uid') || '');

  for (const nth of held) {
    sendToPreview({ source: SOURCE, type: MSG.SVE_VIDEO_HOLD, uid, nth, on: true }, win);
  }
}

/**
 * The video icon on a <video> row: hold the video paused in the preview, or
 * let it play again. Nothing in the file changes — the site keeps its
 * autoplay; only the editor stops watching it.
 */
function toggleVideoHold(win, id) {
  const row = htmlTreeUi.rows.find((item) => item.id === id);

  if (!row || !(row.videoNth >= 0)) {
    return;
  }

  const held = heldVideos(win);
  const on = !held.has(row.videoNth);

  if (on) {
    held.add(row.videoNth);
  } else {
    held.delete(row.videoNth);
  }

  rememberVideoHolds(win, held);
  sendToPreview({ source: SOURCE, type: MSG.SVE_VIDEO_HOLD, uid: String(ask('dock:current-uid') || ''), nth: row.videoNth, on }, win);
  renderHtmlTree(win);
}

function hideHtmlTreeRow(win, id) {
  applyHtmlEdit(win, id, toggleHiddenHtml);
}

function duplicateHtmlTreeRow(win, id) {
  // The open section's root: a copy of the section on the page, the way the
  // hover bar makes one — not a second copy of the markup in the file. The
  // file's lock does not apply; the file is not touched.
  const uid = htmlTreeUi.rows.find((item) => item.id === id)?.sectionRoot;

  if (uid) {
    win.postMessage({ source: SOURCE, type: MSG.DUPLICATE_ROW, uid }, win.location.origin);

    return;
  }

  applyHtmlEdit(win, id, duplicateHtml);
}

/**
 * Takes one section off this one page, after asking.
 *
 * Shared by the row's delete control and the right-click menu, and worth
 * sharing: the question, its words and the removal itself all have to match
 * what the block tree and the hover bar do, or the same act would read three
 * ways depending on where it was started.
 */
function removeSectionFromPage(win, uid) {
  confirmCloseDiscard(
    win,
    {
      titleKey: 'remove_section_title',
      bodyKey: 'remove_section_body',
      confirmKey: 'remove_section_confirm',
    },
    () => {
      const doc = win.document;

      handleRemoveRow({ uid }, doc, win); // the tree follows up through row:removed below
    }
  );
}

/**
 * After a section leaves the page, the tree and dock must leave with it.
 *
 * `handleRemoveRow` updates publish values and Live Preview, but the tree only
 * watched the dock's HTML — so the deleted section's tags stayed on screen.
 * Step into whatever is left, or clear the tree down to the plus.
 */
function afterHtmlTreeSectionRemoved(win, doc, removedUid) {
  if (htmlTreePendingUid === removedUid) {
    win.clearTimeout(htmlTreePendingTimer);
    htmlTreePendingUid = '';
    htmlTreeAhead = '';
  }

  htmlTreeActiveId = null;
  htmlTreeShutStart = false;
  htmlTreeFileKey = '';

  const sections = htmlTreeSections(win, doc);
  const next = sections.find((section) => section.uid !== removedUid) || sections[0];

  if (next) {
    openHtmlTreeSection(win, doc, sections, next.uid, '');
  } else {
    // Empty tree + plus. Clear dock view without autosaving an empty file.
    htmlTreeAhead = '';
    htmlTreeUi.rows = [];
    htmlTreeUi.sections = [];
    htmlTreeUi.frame = null;
    htmlTreeUi.pageBuilder = true;
    renderHtmlTree(win); // the dock empties itself on the same row:removed event
  }

  win.setTimeout(() => {
    if (htmlTreePanel(win.document)) {
      renderHtmlTree(win);
    }
  }, 0);
}

// A page section removed anywhere — the tree's own delete, the preview's
// overlay, the block tree — leaves the tree the same way. Only while the panel
// is on screen: with it closed there is nothing to step into or clear.
on('row:removed', ({ uid, parentPath, doc, win }) => {
  if (parentPath !== sectionField(win) || !htmlTreePanel(win.document)) {
    return;
  }

  afterHtmlTreeSectionRemoved(win, doc, uid);
});

/**
 * Delete on a section row means the section; on a tag row it means the tag.
 *
 * They look alike and are not alike: a tag is removed from the Antlers file, so
 * it goes from every page that renders it, while a section is one row of this
 * page's page_sections and the file is untouched. Pointing the control on a
 * section row at the template was the wrong of the two — the row says the
 * section's name and sits in a list of sections, so that is what it is about.
 */
function deleteHtmlTreeRow(win, id) {
  // Shut, a section is a row of its own in `sections`. Open, the section is the
  // first of the file's tag rows — the one carrying `sectionRoot`.
  const shut = htmlTreeUi.sections?.find((item) => item.row?.id === id);
  const uid = shut ? shut.row?.section || shut.uid : htmlTreeUi.rows.find((item) => item.id === id)?.sectionRoot;

  if (uid) {
    removeSectionFromPage(win, uid);

    return;
  }

  applyHtmlEdit(win, id, deleteHtml);
}

function applyHtmlEdit(win, id, fn) {
  if (ask('dock:is-locked')) {
    return;
  }

  const html = dockHtml();
  const node = htmlTreeUi.rows.find((item) => item.id === id);

  if (!node) {
    return;
  }

  const next = fn(html, node);

  if (next !== html) {
    writeDockHtml(next);
  }
}

export function closeHtmlTreeMenu() {
  htmlTreeMenu?.dismiss();
  htmlTreeMenu = null;
}

/**
 * The menu on a section row: take the section off the page.
 *
 * Deliberately not the same verb as the rest of this tree. Everything else here
 * edits the template file — "delete" on a tag removes that tag from the Antlers,
 * for every page using it. Removing a section takes this one section off this
 * one page and leaves the file alone. They read alike and do very different
 * things, so they are named apart and this one asks first, through the same
 * confirm the block tree and the hover bar already use.
 */
const TOGGLE_ON =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="m8 12 3 3 5-6"/></svg>';
const TOGGLE_OFF =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="3" width="18" height="18" rx="4"/></svg>';

/**
 * What the section's menu adds for whoever may configure fields: whether
 * editors may insert this type from Patterns (Statamic's own `hide` on the
 * set), and for a static section the way out of being static — fields. Both
 * edit the fieldset in the repository, so both are gated the way making a
 * section is. Empty for everyone else.
 */
function sectionTypeItems(win, uid) {
  const section = htmlTreeUi.sections?.find((item) => item.uid === uid);
  const type = section?.type || '';

  if (!type || !canCreateSections(win)) {
    return [];
  }

  const name = section.label || type;
  const hidden = isHiddenType(win, type);
  const failed = () => win.Statamic?.$toast?.error(t(win, 'section_update_failed'));

  const items = [
    {
      label: t(win, 'static_section_insertable'),
      icon: hidden ? TOGGLE_OFF : TOGGLE_ON,
      onPick: () => {
        closeHtmlTreeMenu();

        void updateSectionType(win, { handle: type, hidden: !hidden })
          .then(() => {
            win.Statamic?.$toast?.success(
              t(win, hidden ? 'section_shown_to_editors' : 'section_hidden_from_editors', { name })
            );
            // The Patterns panel's list is the one this changes.
            libraryStale(win);
          })
          .catch(failed);
      },
    },
  ];

  if (section.static) {
    items.push({
      label: t(win, 'section_add_fields'),
      onPick: () => {
        closeHtmlTreeMenu();

        // The fieldset is written and imported; the section is an ordinary
        // one from here. Its root gets the fields icon on the next paint, and
        // the fieldset opens straight away — adding fields was the point.
        void updateSectionType(win, { handle: type, fields: true })
          .then(() => {
            win.Statamic?.$toast?.success(t(win, 'section_fields_added', { name }));
            libraryStale(win);
            renderHtmlTree(win);
            openFieldsetOverlay(win, type);
          })
          .catch(failed);
      },
    });
  }

  return items;
}

function openHtmlTreeSectionMenu(win, event, section) {
  const uid = section.row?.section || section.uid;

  if (!uid) {
    return;
  }

  htmlTreeMenu = openCpOverlay(win.document, HtmlTreeMenu, {
    items: [
      ...sectionTypeItems(win, uid),
      {
        label: t(win, 'html_tree_remove_section'),
        danger: true,
        onPick: () => {
          closeHtmlTreeMenu();
          // Same question, same words as the block tree and the hover bar: a
          // section takes one click to remove and holds everything inside it,
          // and the page it leaves behind looks like it was always that way.
          removeSectionFromPage(win, uid);
        },
      },
    ],
    x: event.clientX,
    y: event.clientY,
    onClose: () => {
      htmlTreeMenu = null;
    },
  });
}

function openHtmlTreeMenu(win, event, id) {
  closeHtmlTreeMenu();

  // A shut section is drawn by the same row component as every tag, but it does
  // not live in `rows` — it lives in `sections`. Looking only in `rows` is why
  // right-clicking a section in this tree did nothing at all.
  const section = htmlTreeUi.sections?.find((item) => item.row?.id === id);

  if (section) {
    openHtmlTreeSectionMenu(win, event, section);

    return;
  }

  const row = htmlTreeUi.rows.find((item) => item.id === id);

  if (!row) {
    return;
  }

  selectHtmlTreeRow(win, id, htmlTreeUi.rows);

  const at = { x: event.clientX, y: event.clientY };
  const show = (items) => {
    if (!items.length) {
      return;
    }

    htmlTreeMenu?.dismiss();
    htmlTreeMenu = openCpOverlay(win.document, HtmlTreeMenu, {
      items,
      x: at.x,
      y: at.y,
      onClose: () => {
        htmlTreeMenu = null;
      },
    });
  };

  if (row.kind === 'component') {
    openComponentRow(win, row, show);

    return;
  }

  if (!htmlTreeUi.canEdit) {
    return;
  }

  show([
    // The open section's root: the same switches its shut row offers.
    ...(row.sectionRoot ? sectionTypeItems(win, row.sectionRoot) : []),
    {
      label: t(win, 'component_make'),
      onPick: () => {
        closeHtmlTreeMenu();
        extractComponent(win, row, {
          onDone: () => renderHtmlTree(win),
          onError: (err) => {
            win.alert(
              err?.status === 409 ? t(win, 'component_exists') : t(win, 'component_failed')
            );
          },
        });
      },
    },
  ]);
}

const openComponent = (win, type) => {
  closeHtmlTreeMenu();
  ask('dock:open-template', type);
};

/**
 * A `{{ partial src="blocks/{type}" }}` is not one file — the block being
 * rendered decides which. So the row offers the folder: every partial the call
 * could resolve to, the way the dock's own partial links do.
 */
function openComponentRow(win, row, show) {
  if (!hasToken(row.src)) {
    show([
      {
        label: t(win, 'component_open_named', { name: row.name || row.src }),
        onPick: () => openComponent(win, `view:partials/${row.src}`),
      },
    ]);

    return;
  }

  show([{ label: t(win, 'code_dock_loading'), onPick: null }]);

  win
    .fetch(`/!/sve/section-template/partials?src=${encodeURIComponent(row.src)}`, {
      credentials: 'same-origin',
      headers: { 'X-Requested-With': 'XMLHttpRequest', Accept: 'application/json' },
    })
    .then((res) => (res.ok ? res.json() : { items: [] }))
    .then((data) => {
      const items = Array.isArray(data.items) ? data.items : [];

      show(
        items.length
          ? items.map((item) => ({
              label: t(win, 'component_open_named', { name: item.label }),
              onPick: () => openComponent(win, item.type),
            }))
          : [{ label: t(win, 'component_none'), onPick: null }]
      );
    })
    .catch(() => show([{ label: t(win, 'component_none'), onPick: null }]));
}

function beginHtmlTreePointer(win, event, id) {
  if (event.button !== 0 || ask('dock:is-locked') || htmlTreeUi.editingId) {
    return;
  }

  if (event.target?.closest?.('button, input')) {
    return;
  }

  endHtmlTreeDrag();
  htmlTreeDragId = id;
  htmlTreeDragOrigin = { x: event.clientX, y: event.clientY };
  htmlTreeDragEl = event.currentTarget;
  htmlTreePointerId = event.pointerId;

  const onMove = (move) => trackHtmlTreePointer(win, move);
  const onUp = (up) => finishHtmlTreePointer(win, up);

  htmlTreeDragUnhook = () => {
    win.document.removeEventListener('pointermove', onMove, true);
    win.document.removeEventListener('pointerup', onUp, true);
    win.document.removeEventListener('pointercancel', onUp, true);
    htmlTreeDragUnhook = null;
  };

  win.document.addEventListener('pointermove', onMove, true);
  win.document.addEventListener('pointerup', onUp, true);
  win.document.addEventListener('pointercancel', onUp, true);
}

function trackHtmlTreePointer(win, event) {
  if (!htmlTreeDragId || !htmlTreeDragOrigin) {
    return;
  }

  const dx = event.clientX - htmlTreeDragOrigin.x;
  const dy = event.clientY - htmlTreeDragOrigin.y;

  if (!htmlTreeUi.dragging && dx * dx + dy * dy < 25) {
    return;
  }

  if (!htmlTreeUi.dragging) {
    htmlTreeUi.dragging = true;

    try {
      htmlTreeDragEl?.setPointerCapture?.(htmlTreePointerId);
    } catch {
      // Capture is optional — document listeners still track the move.
    }
  }

  event.preventDefault();

  const under = win.document.elementFromPoint(event.clientX, event.clientY);
  const slot = under?.closest?.('[data-sve-ht-slot]');

  // The empty block's slot is the block's inside — there is no child row to
  // aim at, and "after the opening tag" is what the reader means by dropping
  // into the dashed box.
  if (slot) {
    const into = slot.getAttribute('data-sve-ht-id');

    if (into && into !== htmlTreeDragId) {
      htmlTreeUi.dropId = into;
      htmlTreeUi.dropPlace = 'inside';

      return;
    }
  }

  const el = under?.closest?.('[data-sve-ht-row]');
  const id = el?.getAttribute('data-sve-ht-id');

  if (!id || id === htmlTreeDragId) {
    htmlTreeUi.dropId = null;
    htmlTreeUi.dropPlace = null;

    return;
  }

  const row = htmlTreeUi.rows.find((item) => item.id === id);
  const source = htmlTreeUi.rows.find((item) => item.id === htmlTreeDragId);

  // Not onto a row of the file around the open component: its offsets are
  // another file's, and a drop there would splice into the wrong one.
  if (!row || row.context || (source && row.path.startsWith(`${source.path}/`))) {
    htmlTreeUi.dropId = null;
    htmlTreeUi.dropPlace = null;

    return;
  }

  const rect = el.getBoundingClientRect();
  htmlTreeUi.dropId = id;
  htmlTreeUi.dropPlace = dropPlace(
    event.clientY - rect.top,
    rect.height,
    !isVoidTag(row.tag) && row.kind !== 'component'
  );
}

function finishHtmlTreePointer(win, event) {
  const sourceId = htmlTreeDragId;
  const targetId = htmlTreeUi.dropId;
  const place = htmlTreeUi.dropPlace || 'after';
  const dragged = htmlTreeUi.dragging;

  endHtmlTreeDrag();

  if (dragged) {
    htmlTreeSuppressClick = true;
    win.setTimeout(() => {
      htmlTreeSuppressClick = false;
    }, 0);
  }

  if (!dragged || ask('dock:is-locked') || !sourceId || !targetId || sourceId === targetId) {
    return;
  }

  event?.preventDefault?.();

  const html = dockHtml();
  const next = moveHtml(html, htmlTreeRoots, sourceId, targetId, place);

  if (next !== html) {
    writeDockHtml(next);
  }
}

function endHtmlTreeDrag() {
  try {
    htmlTreeDragEl?.releasePointerCapture?.(htmlTreePointerId);
  } catch {
    // Already released, or never captured.
  }

  htmlTreeDragUnhook?.();
  htmlTreeDragId = null;
  htmlTreeDragOrigin = null;
  htmlTreeDragEl = null;
  htmlTreePointerId = null;
  htmlTreeUi.dragging = false;
  htmlTreeUi.dropId = null;
  htmlTreeUi.dropPlace = null;
}

/**
 * Dragging a section up or down the page, from the tree.
 *
 * The same press-and-move the rows of a file have, but what moves is the row
 * in `page_sections`, not markup: the preview's own drag sends `MOVE` with the
 * index to land at, and this sends the same message from the tree — through
 * the window, the way the preview does, so the one handler that reorders the
 * form's values stays the one. The file the section renders through is never
 * touched, so a locked dock does not stop it.
 *
 * The target is whichever section's wrapper the pointer is over — any of the
 * open section's rows count as the open section — and before/after is the
 * upper or lower half of that wrapper.
 */
function beginSectionPointer(win, event, uid) {
  if (event.button !== 0 || !uid || htmlTreeUi.editingId) {
    return;
  }

  if (event.target?.closest?.('button, input')) {
    return;
  }

  endSectionDrag();
  htmlTreeSecDragUid = uid;
  htmlTreeSecDragOrigin = { x: event.clientX, y: event.clientY };
  htmlTreeSecDragEl = event.currentTarget;
  htmlTreeSecPointerId = event.pointerId;

  const onMove = (move) => trackSectionPointer(win, move);
  const onUp = (up) => finishSectionPointer(win, up);

  htmlTreeSecDragUnhook = () => {
    win.document.removeEventListener('pointermove', onMove, true);
    win.document.removeEventListener('pointerup', onUp, true);
    win.document.removeEventListener('pointercancel', onUp, true);
    htmlTreeSecDragUnhook = null;
  };

  win.document.addEventListener('pointermove', onMove, true);
  win.document.addEventListener('pointerup', onUp, true);
  win.document.addEventListener('pointercancel', onUp, true);
}

function trackSectionPointer(win, event) {
  if (!htmlTreeSecDragUid || !htmlTreeSecDragOrigin) {
    return;
  }

  const dx = event.clientX - htmlTreeSecDragOrigin.x;
  const dy = event.clientY - htmlTreeSecDragOrigin.y;

  if (!htmlTreeUi.dragging && dx * dx + dy * dy < 25) {
    return;
  }

  if (!htmlTreeUi.dragging) {
    htmlTreeUi.dragging = true;

    try {
      htmlTreeSecDragEl?.setPointerCapture?.(htmlTreeSecPointerId);
    } catch {
      // Capture is optional — document listeners still track the move.
    }
  }

  event.preventDefault();

  const under = win.document.elementFromPoint(event.clientX, event.clientY);
  const wrap = under?.closest?.('[data-sve-ht-sec-uid]');
  const uid = wrap?.getAttribute('data-sve-ht-sec-uid') || '';

  if (!uid || uid === htmlTreeSecDragUid) {
    htmlTreeUi.sectionDrop = null;

    return;
  }

  const rect = wrap.getBoundingClientRect();

  htmlTreeUi.sectionDrop = {
    uid,
    place: event.clientY - rect.top < rect.height / 2 ? 'before' : 'after',
  };
}

function finishSectionPointer(win, event) {
  const uid = htmlTreeSecDragUid;
  const drop = htmlTreeUi.sectionDrop;
  const dragged = htmlTreeUi.dragging;

  endSectionDrag();

  if (dragged) {
    htmlTreeSuppressClick = true;
    win.setTimeout(() => {
      htmlTreeSuppressClick = false;
    }, 0);
  }

  if (!dragged || !uid || !drop?.uid || drop.uid === uid) {
    return;
  }

  event?.preventDefault?.();
  moveSectionOnPage(win, uid, drop.uid, drop.place);
}

function endSectionDrag() {
  try {
    htmlTreeSecDragEl?.releasePointerCapture?.(htmlTreeSecPointerId);
  } catch {
    // Already released, or never captured.
  }

  htmlTreeSecDragUnhook?.();
  htmlTreeSecDragUid = null;
  htmlTreeSecDragOrigin = null;
  htmlTreeSecDragEl = null;
  htmlTreeSecPointerId = null;
  htmlTreeUi.dragging = false;
  htmlTreeUi.sectionDrop = null;
}

/**
 * Where the dragged section lands, as the index `MOVE` expects: the position
 * in the list once the section has been taken out of it. Read from the
 * publish values — the tree's list is drawn from them, but the values are
 * what the handler counts in.
 */
function moveSectionOnPage(win, uid, targetUid, place) {
  const field = sectionField(win) || 'page_sections';

  for (const container of activeContainers(win.document) || []) {
    const values = unwrapRef(container.values);
    const list = values && typeof values === 'object' ? values[field] : null;

    if (!Array.isArray(list)) {
      continue;
    }

    const at = (id) =>
      list.findIndex((row) => row && typeof row === 'object' && [row._visual_id, row.id, row._id].includes(id));
    const from = at(uid);
    const target = at(targetUid);

    if (from === -1 || target === -1 || from === target) {
      return false;
    }

    let to = place === 'before' ? target : target + 1;

    if (from < to) {
      to -= 1;
    }

    if (to === from) {
      return false;
    }

    win.postMessage({ source: SOURCE, type: MSG.MOVE, uid, toIndex: to }, win.location.origin);

    // The values move on the next task; the list is read from them.
    win.setTimeout(() => renderHtmlTree(win), 60);

    return true;
  }

  return false;
}

/**
 * What the panel under the tree shows for the selected row.
 *
 * Only conditions and loops have anything to offer: a condition is an
 * expression, a loop is the field it walks. Everything else — tags, components
 * — is edited where it already can be, so the panel stays empty rather than
 * inventing a second place to do the same thing.
 */
function siteCollections(win) {
  const list = win.Statamic?.$config?.get?.('sveCollections');

  return Array.isArray(list) ? list : [];
}

function paintHtmlTreeInspector(win, row) {
  if (row?.kind === 'component') {
    paintComponentValues(win, row);

    return;
  }

  // Anything else, and the column goes back to the section it belongs to.
  if (componentPropsUi.callOpen) {
    componentPropsUi.callOpen = false;
    componentPropsUi.callStore = null;
    callValues.forget();
    syncComponentPropsHost(win);
  }

  if (row?.kind !== 'antlers') {
    htmlTreeUi.inspect = null;

    return;
  }

  // Keyed by the row alone, not by what is typed in it. Every commit repaints
  // the tree, and a key that moved with the value would rebuild the input
  // mid-edit — losing the caret, and with it picking a second field.
  const key = row.id;

  // `{{ else }}` is the branch with nothing to say about itself.
  if (row.tag === 'else') {
    htmlTreeUi.inspect = {
      key,
      title: t(win, 'antlers_condition'),
      mode: 'note',
      note: t(win, 'antlers_else_note'),
    };

    return;
  }

  if (row.antlers === 'loop') {
    const collection = row.loopKind === 'collection';
    const draft = htmlTreeSortDraft?.id === row.id ? htmlTreeSortDraft.dir : '';
    const dir = row.sortDir || draft;

    htmlTreeUi.inspect = {
      key,
      title: t(win, 'antlers_loop'),
      mode: 'loop',
      loopKind: collection ? 'collection' : 'field',
      kinds: [
        { id: 'field', label: t(win, 'antlers_loop_field') },
        { id: 'collection', label: t(win, 'antlers_loop_collection') },
      ],
      collections: siteCollections(win),
      value: row.expr || '',
      placeholder: t(win, collection ? 'antlers_pick_collection' : 'antlers_loop_placeholder'),
      sort: {
        title: t(win, 'antlers_sort'),
        dir,
        // Random has nothing to sort by, and neither has "as it comes".
        needsField: dir === 'asc' || dir === 'desc',
        field: row.sortField || '',
        // The field picker lists the section's own fields. A collection is
        // sorted by its entries' fields, which are not those — so there it is
        // typed, and the placeholder names the ones every collection has.
        pickable: !collection,
        placeholder: t(win, collection ? 'antlers_sort_field_entry' : 'antlers_sort_field'),
        dirs: [
          { id: '', label: t(win, 'antlers_sort_none') },
          { id: 'asc', label: t(win, 'antlers_sort_asc') },
          { id: 'desc', label: t(win, 'antlers_sort_desc') },
          { id: 'random', label: t(win, 'antlers_sort_random') },
        ],
      },
      limit: {
        title: t(win, 'antlers_limit'),
        value: row.limit || '',
        placeholder: t(win, 'antlers_limit_placeholder'),
      },
      branches: [],
    };

    return;
  }

  htmlTreeUi.inspect = {
    key,
    title: t(win, 'antlers_condition'),
    mode: 'condition',
    value: row.expr || '',
    placeholder: t(win, 'antlers_condition_placeholder'),
    branches: [
      { id: 'elseif', label: t(win, 'antlers_add_elseif') },
      { id: 'else', label: t(win, 'antlers_add_else') },
    ],
  };
}

/**
 * The values this place gives a component.
 *
 * The declaration comes from the component's own file; what is filled in comes
 * from the call in front of us. Nothing is stored anywhere for this — the two
 * fields you type in *are* `{{ partial:components/card headline="…" }}`, which
 * is why the same card two rows down can say something else entirely.
 *
 * The fetch is per component per session, so clicking through a list of cards
 * costs one request, not one per card.
 */
function paintComponentValues(win, row) {
  if (!componentPropsOn(win)) {
    htmlTreeUi.inspect = null;

    return;
  }

  if (!row.src) {
    return;
  }

  const key = row.id;

  htmlTreeUi.inspect = {
    key,
    title: t(win, 'component_props_values'),
    mode: 'note',
    note: t(win, 'code_dock_loading'),
  };

  // The Control Panel's own fields when it can lend them: rich text as Bard,
  // a picture as the asset browser, a link as the page picker. The plain boxes
  // below are what is left when it cannot.
  if (propValuesReady()) {
    const params = {};
    const bindings = {};

    // Keyed by the short handle, because that is what the form is drawn from.
    // A call can carry both spellings while an older one is being edited; the
    // prefixed parameter is the one the render reads, so it is the one shown.
    const set = new Map();

    for (const [param, found] of readCallParams(dockHtml().slice(row.from, row.to))) {
      const handle = propHandle(param);

      if (handle && (param !== handle || !set.has(handle))) {
        set.set(handle, found);
      }
    }

    for (const [handle, found] of set) {
      if (found.bound) {
        bindings[handle] = found.value;
      } else {
        params[handle] = found.value;
      }
    }

    // A field switched to data but not yet given an expression has nothing in
    // the call to remember it by. Held here until it gets one, or is switched
    // back — writing an empty `:handle=""` to remember it would be litter.
    if (pendingBindRow !== key) {
      pendingBindRow = key;
      pendingBinds.clear();
    }

    for (const handle of pendingBinds) {
      if (!(handle in bindings)) {
        bindings[handle] = '';
      }
    }

    // The left column, not the right pane. Every other set of input fields in
    // Live Preview is over there, and a component's values are no different —
    // it is the section's own fields that step aside while one is picked.
    htmlTreeUi.inspect = null;
    componentPropsUi.callOpen = true;
    componentPropsUi.title = componentPropsUi.title || t(win, 'component_props');
    componentPropsUi.callTitle = row.klass || row.name || row.src;
    componentPropsUi.callStore = callValues.ui;
    callValues.ui.canBind = true;
    callValues.ui.dataTitle = t(win, 'data_vars_title');
    callValues.ui.exprPlaceholder = t(win, 'component_props_expr');
    callValues.ui.onToggleBind = (handle, on) => toggleComponentBinding(win, handle, on);
    callValues.ui.onExpr = (handle, expr) => writeComponentBinding(win, handle, expr);
    // A component's values are written in the call, so the scope is the call's
    // own: a card inside `{{ collection:services }}` is handed a service's
    // fields, not the section's.
    callValues.ui.onPickData = (handle, anchor) =>
      ask('dock:data-menu', {
        anchor,
        at: row.from,
        onPick: (item) => writeComponentBinding(win, handle, String(item?.var || '').trim()),
      });
    callValues.load(win, {
      key: `${row.src}::${key}`,
      src: row.src,
      params,
      bindings,
      readOnly: ask('dock:is-locked') === true,
    });
    callValues.watch(win, {
      src: row.src,
      write: (next) => writeComponentValues(win, next, bindings),
    });
    syncComponentPropsHost(win);

    return;
  }

  void fetchComponentProps(win, row.src).then((props) => {
    // Clicking on is faster than the network. Whatever is selected now wins.
    if (htmlTreeUi.inspect?.key !== key) {
      return;
    }

    if (!props.length) {
      htmlTreeUi.inspect = {
        key,
        title: t(win, 'component_props_values'),
        mode: 'note',
        note: t(win, 'component_props_values_none'),
      };

      return;
    }

    htmlTreeUi.inspect = {
      key,
      title: t(win, 'component_props_values'),
      mode: 'props',
      inheritLabel: t(win, 'component_props_inherit'),
      rows: valueRows(props, dockHtml().slice(row.from, row.to)),
    };
  });
}

/**
 * Everything the publish form now holds, written into the call in one pass.
 *
 * One pass because each write changes the length of the tag the next one is
 * measured against — writing them one at a time through the tree would splice
 * the second value by offsets the first had already moved.
 */
function writeComponentValues(win, params, bindings = {}) {
  const row = htmlTreeUi.rows.find((item) => item.id === htmlTreeActiveId);

  if (row?.kind !== 'component' || ask('dock:is-locked')) {
    return;
  }

  let html = dockHtml();
  let to = row.to;

  for (const [handle, value] of Object.entries(params || {})) {
    // A field reading from the page is not in the form, so the form has nothing
    // to say about it. Writing its empty value would take the expression out.
    if (handle in bindings) {
      continue;
    }

    const before = html.length;
    const next = writePropParam(html, { from: row.from, to }, handle, value);

    if (next === html) {
      continue;
    }

    to += next.length - before;
    html = next;
  }

  if (html !== dockHtml()) {
    writeDockHtml(html, { save: true });
    renderHtmlTree(win);
  }
}

/**
 * A field switched between holding a value and reading one from the page.
 *
 * Both directions take the parameter out of the call: what is there now is
 * either a value the expression replaces, or an expression the field replaces,
 * and neither survives the switch.
 */
function toggleComponentBinding(win, handle, on) {
  if (on) {
    pendingBinds.add(handle);
  } else {
    pendingBinds.delete(handle);
  }

  writeOneCallParam(win, handle, '', on);
  renderHtmlTree(win);
}

/** The expression a bound field reads. Empty leaves the field waiting. */
function writeComponentBinding(win, handle, expr) {
  pendingBinds.add(handle);
  writeOneCallParam(win, handle, expr, true);
  renderHtmlTree(win);
}

function writeOneCallParam(win, handle, value, bound) {
  const row = htmlTreeUi.rows.find((item) => item.id === htmlTreeActiveId);

  if (row?.kind !== 'component' || ask('dock:is-locked')) {
    return;
  }

  const html = dockHtml();
  const next = writePropParam(html, row, handle, value, { bound });

  if (next !== html) {
    writeDockHtml(next, { save: true });
  }
}

/** The selected row, read back from the rows the last paint produced. */
function activeAntlersRow() {
  const row = htmlTreeUi.rows.find((item) => item.id === htmlTreeActiveId);

  return row?.kind === 'antlers' && !ask('dock:is-locked') ? row : null;
}

function applyAntlersEdit(win, fn) {
  const row = activeAntlersRow();

  if (!row) {
    return;
  }

  const html = dockHtml();
  const next = fn(html, row);

  if (next !== html) {
    writeDockHtml(next);
    renderHtmlTree(win);
  }
}

/**
 * One field written into the call this row is.
 *
 * By the row's own offsets, and `writePropParam` refuses to splice when the
 * text at them is no longer a tag — so a pane that moved on between the paint
 * and the keystroke loses the edit instead of cutting the file in half.
 */
function commitComponentValue(win, handle, value, bound) {
  const row = htmlTreeUi.rows.find((item) => item.id === htmlTreeActiveId);

  if (row?.kind !== 'component' || ask('dock:is-locked')) {
    return;
  }

  const html = dockHtml();
  const next = writePropParam(html, row, handle, value, { bound });

  if (next !== html) {
    writeDockHtml(next, { save: true });
    renderHtmlTree(win);
  }
}

function commitHtmlTreeInspector(win, value) {
  applyAntlersEdit(win, (html, row) =>
    row.antlers === 'loop'
      ? writeLoopSource(html, row, row.loopKind === 'collection' ? 'collection' : 'field', value)
      : writeAntlersExpression(html, row, value)
  );
}

/**
 * Switching a loop between a field and a collection.
 *
 * Nothing is written until there is somewhere to point: turning a field loop
 * into a collection with no collection chosen would break the template, so the
 * panel just offers the picker and waits.
 */
function setHtmlTreeLoopKind(win, kind) {
  const row = activeAntlersRow();

  if (!row || row.antlers !== 'loop') {
    return;
  }

  const current = row.loopKind === 'collection' ? 'collection' : 'field';

  if (kind === current) {
    return;
  }

  if (kind === 'collection') {
    const first = siteCollections(win)[0]?.handle;

    if (!first) {
      return;
    }

    applyAntlersEdit(win, (html, node) => writeLoopSource(html, node, 'collection', first));

    return;
  }

  applyAntlersEdit(win, (html, node) => writeLoopSource(html, node, 'field', node.handle || 'items'));
}

function addHtmlTreeBranch(win, kind) {
  applyAntlersEdit(win, (html, row) => addAntlersBranch(html, row, kind));
}

/**
 * Where the caret goes when a row is picked: inside it, as its last child.
 *
 * Picking a row in the tree is how you say "I am working in here" — for any
 * row, not just containers. The toolbar is the other half of that: a button
 * there stacks a new element beside the last one, so the two together read as
 * "choose the place, then add things to it".
 *
 * Null for rows with no inside to speak of: void tags, and components, whose
 * content lives in another file.
 */
function insertPointFor(html, row) {
  if (!html || !row || row.kind === 'component' || isVoidTag(row.tag)) {
    return null;
  }

  const close = closingTagIndex(html, row);

  // `<div></div>` closes exactly where it opens. That is not "no inside" — it
  // is an empty one, and the point between the two tags is the whole reason
  // this exists.
  if (close < row.openTo) {
    return null;
  }

  // The closing tag usually sits on its own indented line. Aiming at the end of
  // the line before it keeps the tag where it is; aiming at the tag itself
  // would leave the new element wedged in front of it.
  const lineStart = html.lastIndexOf('\n', close - 1) + 1;

  if (html.slice(lineStart, close).trim() === '' && lineStart > row.openTo) {
    return lineStart - 1;
  }

  return close;
}

function selectHtmlTreeRow(win, id, rows) {
  if (htmlTreeSuppressClick) {
    return;
  }
  const row = (rows || htmlTreeUi.rows).find((item) => item.id === id);

  if (!row) {
    return;
  }

  htmlTreeActiveId = id;
  htmlTreeUi.rows.forEach((item) => {
    item.current = item.id === id;
  });

  paintHtmlTreeInspector(win, row);

  // Same reason as `writeDockHtml`: these are offsets, and the dock is a
  // moment behind. The row is still picked — only the jump to it waits.
  if (htmlTreeAheadOfDock()) {
    return;
  }

  ask('dock:reveal-html', {
    from: row.from,
    to: row.to,
    caret: insertPointFor(dockHtml(), row),
  });

  // The reveal has just put the cursor on this tag. The Tailwind pane cannot
  // hear that for itself — the dock writes the pane with `applying` set, and
  // nothing that follows the editor may run during those — so it is told here,
  // once the reveal is done.
  ask('dock:tw-follow');

  sendToPreview(
    {
      source: SOURCE,
      type: MSG.SVE_HTML_PICK_FOCUS,
      path: row.path,
    },
    win
  );
}

/**
 * The call a click landed inside, when it landed inside one.
 *
 * Everything a partial draws belongs to another file, so the tree has no row
 * for it — but it has a row for the call, and that is the thing to mark. Of
 * several calls on the same file, the one inside the tag the click was aligned
 * with; a component called once from somewhere else entirely still answers.
 */
function componentPathFor(path, src) {
  if (!src) {
    return '';
  }

  const hits = [];

  const walk = (nodes, insideParent) => {
    for (const node of nodes || []) {
      const inside = insideParent || node.path === path;

      if (node.kind === 'component' && node.src === src) {
        hits.push({ path: node.path, inside });
      }

      walk(node.children, inside);
    }
  };

  walk(htmlTreeRoots, false);

  return (hits.find((hit) => hit.inside) || hits[0])?.path || '';
}

function selectHtmlTreeByPath(win, path) {
  if (!path || !htmlTreePanel(win.document)) {
    return;
  }

  // Pointing at something in the preview says which section as plainly as
  // clicking its row does.
  htmlTreeShutStart = false;
  expandHtmlTreePath(path);
  renderHtmlTree(win);

  const row = htmlTreeUi.rows.find((item) => item.path === path);

  if (!row) {
    return;
  }

  selectHtmlTreeRow(win, row.id, htmlTreeUi.rows);

  // The row can be anywhere in a long tree — a click in the preview that marks
  // something off screen has marked nothing, as far as the reader can see.
  win.setTimeout(() => {
    htmlTreePanel(win.document)
      ?.querySelector('[data-sve-ht-row][data-sve-ht-current]')
      ?.scrollIntoView({ block: 'nearest' });
  }, 0);
}

export function watchHtmlTreeDock(win) {
  if (htmlTreeUnhook) {
    return;
  }

  const refresh = () => {
    if (htmlTreeUi.editingId || htmlTreeUi.dragging) {
      return;
    }

    win.clearTimeout(htmlTreeTimer);
    htmlTreeTimer = win.setTimeout(() => {
      if (htmlTreePanel(win.document)) {
        renderHtmlTree(win);
      }
    }, 80);
  };

  // Dock HTML and page_sections both own what this tree shows. A section
  // delete updates values (and fires sve-page-structure) without touching the
  // dock — listening only to the dock left the deleted section on screen.
  const onStructure = () => {
    refresh();

    // The dock holds the header only because the page had no sections. Now
    // it has one, and that one is what the reader wants open — not the header.
    if (ask('dock:on-empty-page') === true) {
      const sections = htmlTreeSections(win, win.document);

      if (sections[0]) {
        openHtmlTreeSection(win, win.document, sections, sections[0].uid, '');
      }
    }
  };

  htmlTreeUnhook = on('dock:html-changed', refresh);
  win.document.addEventListener('sve-page-structure', onStructure);
  htmlTreeStructureUnhook = () => {
    win.document.removeEventListener('sve-page-structure', onStructure);
  };
}

export function stopWatchHtmlTreeDock(win) {
  htmlTreeUnhook?.();
  htmlTreeUnhook = null;
  htmlTreeStructureUnhook?.();
  htmlTreeStructureUnhook = null;
  win?.clearTimeout?.(htmlTreeTimer);
  htmlTreeTimer = 0;
}

export function closeHtmlTreePanel(win) {
  const panel = htmlTreePanel(win.document);

  sendToPreview(
    {
      source: SOURCE,
      type: MSG.SVE_HTML_PICK,
      on: false,
    },
    win
  );
  stopWatchHtmlTreeDock(win);
  callValues.forget();
  componentPropsUi.callOpen = false;
  componentPropsUi.callStore = null;
  syncComponentPropsHost(win);
  endHtmlTreeDrag();
  closeHtmlTreeMenu();
  closeTwMenu(win);
  htmlTreeActiveId = null;
  htmlTreeUi.inspect = null;
  htmlTreeUi.editingId = null;
  htmlTreeUi.draft = '';
  htmlTreeUi.sections = [];
  htmlTreeUi.pageBuilder = false;
  htmlTreePendingUid = '';
  win?.clearTimeout?.(htmlTreePendingTimer);

  if (!panel) {
    syncPreviewInset(win);

    return;
  }

  panel.remove();

  if (sveState.headerTab === 'html_tree') {
    setHeaderTab(win, null);
  }

  releaseRightShellIfEmpty(win);
  persistDockedPanel(win);
  applyHeaderTab(win);
  syncPreviewInset(win);
}

export function fillHtmlTreePane(win, pane) {
  if (pane.querySelector('[data-sve-html-tree-list]')) {
    return;
  }

  pane.id = HTML_TREE_PANEL_ID;
  mountPane(pane, HtmlTreePane, {
    title: t(win, 'html_tree'),
  });
  pane.querySelector('[data-sve-close]')?.addEventListener('click', () => closeHtmlTreePanel(win));
}

export function showHtmlTreePane(win) {
  watchHtmlTreeDock(win);
  renderHtmlTree(win);
}

export function openHtmlTreePanel(win) {
  const doc = win.document;

  if (!featureOn(win, 'html_tree')) {
    return;
  }

  if (htmlTreePanel(doc)) {
    watchHtmlTreeDock(win);
    renderHtmlTree(win);

    return;
  }

  if (!dockIsOpen(doc)) {
    return;
  }

  // A panel that opens with a section already unfolded answers a question
  // nobody asked, and buries the list of the others under it.
  htmlTreeShutStart = true;
  htmlTreeFolds.clear();
  closeRightPanels(win, [HTML_TREE_PANEL_ID]);

  const panel = doc.createElement('div');

  panel.id = HTML_TREE_PANEL_ID;
  panel.style.cssText = RIGHT_PANEL_FILL;
  mountPane(panel, HtmlTreePane, {
    title: t(win, 'html_tree'),
  });

  panel.querySelector('[data-sve-close]')?.addEventListener('click', () => closeHtmlTreePanel(win));
  showInRightShell(win, panel);
  persistDockedPanel(win);
  applyHeaderTab(win);
  syncPreviewInset(win);
  watchHtmlTreeDock(win);
  renderHtmlTree(win);
}

export function toggleHtmlTreePanel(win) {
  if (htmlTreePanel(win.document)) {
    closeHtmlTreePanel(win);

    return;
  }

  openHtmlTreePanel(win);
}

/**
 * Opens a section by uid the way a click on its row does — without the row
 * having to be on screen first. The tree lists sections only while the dock
 * holds one of them, so a section just made on an empty page (or while the
 * dock held the header) had no row to click; the form has it all the same.
 * Answers with the ids the preview knows it by, or null when it is not on
 * the page.
 */
register('html-tree:open-section', (uid) => {
  const win = window;
  const doc = win.document;
  const sections = htmlTreeSections(win, doc);
  const section = sections.find((item) => item.uid === uid || item.ids.includes(uid));

  if (!section) {
    return null;
  }

  openHtmlTreeSection(win, doc, sections, section.uid, '');

  return { uid: section.uid, ids: section.ids };
});

register('html-tree:from-preview', ({ path, src } = {}) => {
  // A field waiting for something to point at gets the click first. Nothing is
  // armed the rest of the time, so the tree's own behaviour is untouched.
  if (componentBindPick(window, path)) {
    return;
  }

  selectHtmlTreeByPath(window, componentPathFor(path, src) || path);
});

/**
 * Pick mode, asked for by something other than the tree.
 *
 * Turning it off is refused while the panel is open: the tree is then the one
 * that put it there, and taking it away would leave the panel unable to follow
 * a click in the preview.
 */
register('html-tree:arm-pick', (on) => {
  const win = window;

  if (on) {
    sendPick(win, parseTemplateTree(dockHtml()));

    return true;
  }

  if (htmlTreePanel(win.document)) {
    return true;
  }

  sendToPreview({ source: SOURCE, type: MSG.SVE_HTML_PICK, on: false }, win);

  return true;
});
/**
 * Forget every section template held in memory.
 *
 * The cache is what lets a click on a section show its tags at once, and it is
 * never invalidated on its own — a template edited outside this window would go
 * unnoticed for as long as the editor stays open. The reload button is where
 * that is answered.
 */
export function clearHtmlTreeTemplates() {
  htmlTreeTemplates.clear();
  htmlTreeFetching.clear();
  htmlTreePrefetch.length = 0;
}
