/**
 * Settings toggle: `html_tree`
 * HTML tag tree in the right dock — opens with the template dock, not a top-bar icon.
 * Reads the template dock's HTML pane. Does not import overlay / preview / bridge.
 */
import { sve } from './cp-registry.js';
import { t } from './cp-t.js';
import { sveState } from './cp-state.js';
import { applyHeaderTab, sendToPreview, setHeaderTab, topLevelSectionIds } from './cp.js';
import { ask, on, register } from './cp/bus.js';
import { mountPane } from './cp/mount-pane.js';
import { RIGHT_PANEL_FILL, releaseRightShellIfEmpty, showInRightShell } from './right-dock.js';
import HtmlTreePane from './cp/surfaces/HtmlTreePane.vue';
import HtmlTreeList from './cp/surfaces/HtmlTreeList.vue';
import { htmlTreeUi } from './cp/html-tree/store.js';
import { flattenHtmlTree, isVoidTag, parseTemplateTree } from './html-tree-parse.js';
import {
  componentPropsOn,
  fetchComponentProps,
  readCallParams,
  valueRows,
  writeCallParam,
} from './component-props.js';
import { syncComponentProps, syncComponentPropsHost } from './component-props-host.js';
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

export const HTML_TREE_PANEL_ID = '__sve-html-tree-panel';
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
export let htmlTreeTimer = 0;
let htmlTreeRoots = [];
let htmlTreeDragId = null;
let htmlTreeDragOrigin = null;
let htmlTreeDragEl = null;
let htmlTreePointerId = null;
let htmlTreeDragUnhook = null;
let htmlTreeSuppressClick = false;
let htmlTreeMenu = null;
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
  let style = doc.getElementById(HTML_TREE_STYLE_ID);

  if (!style) {
    style = doc.createElement('style');
    style.id = HTML_TREE_STYLE_ID;
    doc.head.appendChild(style);
  }

  style.textContent = `
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
    }
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
    /* The box around the open section's tags — it says where you are working. */
    [data-sve-ht-branch] {
      box-sizing: border-box;
      border: 1px solid rgba(56,88,233,.6);
      border-radius: 0.5625rem;
      padding: 0.3125rem;
      margin-bottom: 0.3125rem;
    }
    [data-sve-ht-branch] > [data-sve-ht-row]:last-child { margin-bottom: 0; }
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
  `;
}

function dockHtml() {
  const html = ask('dock:html');

  return typeof html === 'string' ? html : '';
}

function dockIsOpen(doc) {
  return !!ask('dock:is-open', doc);
}

function writeDockHtml(html) {
  // Every edit the tree makes comes through here, and every one of them is
  // built from offsets into the rows on screen. While those rows come from the
  // cache, the dock holds a different file at those offsets — so this is the
  // one place that has to refuse, and it covers all of them.
  if (htmlTreeAheadOfDock()) {
    return false;
  }

  return ask('dock:set-html', html) === true;
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
  const globalSet = sve.globalSectionSet?.(win);

  if (!globalSet || row.type !== globalSet) {
    return '';
  }

  const id = sve.firstEntryId?.(row[globalSet]);

  return (id && sve.savedSectionInfo?.(win, id)?.section_type) || '';
}

/**
 * Fetch the markup of every section on the page, once each.
 *
 * The same request the dock makes, so it costs the server nothing it was not
 * going to be asked for anyway — just asked earlier. Failures are dropped:
 * a section whose template is missing simply opens the slow way.
 */
function prefetchSectionTemplates(win, sections) {
  for (const section of sections) {
    const type = section.type;

    if (!type || htmlTreeTemplates.has(type) || htmlTreeFetching.has(type)) {
      continue;
    }

    htmlTreeFetching.add(type);
    win
      .fetch(`/!/sve/section-template?type=${encodeURIComponent(type)}`, {
        credentials: 'same-origin',
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
      })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        htmlTreeFetching.delete(type);

        if (typeof data?.html === 'string') {
          htmlTreeTemplates.set(type, data.html);
        }
      })
      .catch(() => htmlTreeFetching.delete(type));
  }
}

/** True while the rows come from the cache and the dock is still catching up. */
function htmlTreeAheadOfDock() {
  return !!htmlTreeAhead;
}

/** The preview document, however deep the frame it is drawn in sits. */
function previewDocument(win) {
  const direct = win.document.getElementById('live-preview-iframe');
  const frames = direct ? [direct] : [];

  if (!direct) {
    for (const el of win.document.querySelectorAll('iframe')) {
      try {
        const inner = el.contentDocument?.getElementById('live-preview-iframe');

        if (inner) {
          frames.push(inner);
        }
      } catch {
        /* cross-origin */
      }
    }
  }

  try {
    return frames[0]?.contentDocument || null;
  } catch {
    return null;
  }
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
function htmlTreeSections(win, doc) {
  const field = sve.sectionField?.(win) || 'page_sections';
  const tags = sectionRootTags(win);
  const out = [];

  for (const container of sve.activeContainers?.(doc) || []) {
    const values = sve.unwrapRef?.(container.values);
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
        label:
          (typeof alias === 'string' && alias.trim() ? alias.trim() : '')
          || custom
          || sve.setMeta?.(win, type)?.display
          || sve.humanizeHandle?.(type)
          || type,
        // Its first tag's mark — the one it unfolds into. The set's own icon
        // used to go here, so the same section wore one shut and another open.
        svg: htmlTreeIcon(tag, '', null).svg || HTML_ICONS.section,
        enabled: row.enabled !== false,
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
function htmlTreeRootName(win, sections, openUid) {
  const component = ask('dock:component-exit-state');

  if (component?.open) {
    return sve.humanizeHandle?.(component.name) || component.name || '';
  }

  if (openUid) {
    return sections.find((section) => section.uid === openUid)?.label || '';
  }

  const type = ask('dock:current-type') || '';

  return sve.setMeta?.(win, type)?.display || sve.humanizeHandle?.(type) || '';
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
  const focus = () => sve.focusFromPreview?.(section.uid, doc, win, { clampToSection: true });

  if (typeof sve.openLiteSection === 'function') {
    sve.openLiteSection(section.uid, doc, win, focus);
  } else {
    focus();
  }
  sendToPreview(
    { source: 'statamic-visual-editor', type: 'sve-activate', ids: section.ids },
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

  const fileKey = `${type}|${liveUid}`;

  // The dock says it has moved on. What it is showing is still the file being
  // left, so this only notes the move and remembers that markup; the tree
  // reseats on the first paint that shows something else — which is the new
  // file arriving. Two sections that share a template are the exception: there
  // is no new markup coming, so the move is over as soon as it is announced.
  if (fileKey !== htmlTreeFileKey) {
    htmlTreeFileKey = fileKey;
    htmlTreeFolds.clear();
    htmlTreeReseat = html;
  }

  if (htmlTreeReseat !== false && html !== htmlTreeReseat) {
    htmlTreeReseat = false;
    htmlTreeFolds.clear();
    htmlTreeActiveId = firstTagId(roots) || null;
  }

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
  const inSections = !!(pendingUid || liveUid);

  const rows = flattenHtmlTree(roots, foldedIds(roots));

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
  htmlTreeUi.lockedTitle = t(win, 'html_tree_locked');
  htmlTreeUi.canEdit = !ask('dock:is-locked');
  paintComponentExit(win);
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
  htmlTreeUi.onDuplicate = (id) => duplicateHtmlTreeRow(win, id);
  htmlTreeUi.onDelete = (id) => deleteHtmlTreeRow(win, id);
  htmlTreeUi.onPointerDown = (event, id) => beginHtmlTreePointer(win, event, id);
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
  const rootName = htmlTreeRootName(win, sections, openUid);

  // The section this file belongs to, so its root tag can wear the same name
  // and mark the shut row wears. One row, two states — not two rows.
  const openSection = openUid ? sections.find((item) => item.uid === openUid) : null;

  htmlTreeUi.rows = rows.map((row) => {
    const icon = htmlTreeIcon(row.tag, row.kind, row.antlers);
    // What the row is called before a rename. Renaming back to it drops the
    // alias again, so the default must be what the alias is measured against.
    const base = row.id === rootId && rootName ? rootName : row.klass;
    const isRoot = row.id === rootId;

    return {
      ...row,
      base,
      name: htmlTreeDisplayName(base, row.path, aliases),
      current: row.id === htmlTreeActiveId,
      letter: icon.letter || '',
      svg: isRoot && openSection ? openSection.svg : icon.svg || '',
    };
  });

  htmlTreeUi.sections = inSections
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
  htmlTreeUi.onSection = (uid) => openHtmlTreeSection(win, doc, sections, uid, openUid);

  paintHtmlTreeInspector(
    win,
    htmlTreeUi.rows.find((item) => item.id === htmlTreeActiveId)
  );
  mountPane(list, HtmlTreeList);
  publishHtmlPick(win, roots);
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
      source: 'statamic-visual-editor',
      type: 'sve-html-pick',
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
    writeHtmlTreeLabel(
      ask('dock:current-type') || '',
      row.path,
      htmlTreeUi.draft,
      row.base || row.klass
    );
  }

  htmlTreeUi.draft = '';
  renderHtmlTree(win);
}

function hideHtmlTreeRow(win, id) {
  applyHtmlEdit(win, id, toggleHiddenHtml);
}

function duplicateHtmlTreeRow(win, id) {
  applyHtmlEdit(win, id, duplicateHtml);
}

function deleteHtmlTreeRow(win, id) {
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

function openHtmlTreeMenu(win, event, id) {
  closeHtmlTreeMenu();

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
  if (!/\{[A-Za-z_][A-Za-z0-9_]*\}/.test(row.src)) {
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

  if (!row || (source && row.path.startsWith(`${source.path}/`))) {
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

    for (const [handle, set] of readCallParams(dockHtml().slice(row.from, row.to))) {
      if (set.bound) {
        bindings[handle] = set.value;
      } else {
        params[handle] = set.value;
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
    const next = writeCallParam(html, { from: row.from, to }, handle, value);

    if (next === html) {
      continue;
    }

    to += next.length - before;
    html = next;
  }

  if (html !== dockHtml()) {
    writeDockHtml(html);
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
  const next = writeCallParam(html, row, handle, value, { bound });

  if (next !== html) {
    writeDockHtml(next);
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
 * By the row's own offsets, and `writeCallParam` refuses to splice when the
 * text at them is no longer a tag — so a pane that moved on between the paint
 * and the keystroke loses the edit instead of cutting the file in half.
 */
function commitComponentValue(win, handle, value, bound) {
  const row = htmlTreeUi.rows.find((item) => item.id === htmlTreeActiveId);

  if (row?.kind !== 'component' || ask('dock:is-locked')) {
    return;
  }

  const html = dockHtml();
  const next = writeCallParam(html, row, handle, value, { bound });

  if (next !== html) {
    writeDockHtml(next);
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
      source: 'statamic-visual-editor',
      type: 'sve-html-pick-focus',
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

  htmlTreeUnhook = on('dock:html-changed', refresh);
}

export function stopWatchHtmlTreeDock(win) {
  htmlTreeUnhook?.();
  htmlTreeUnhook = null;
  win?.clearTimeout?.(htmlTreeTimer);
  htmlTreeTimer = 0;
}

export function closeHtmlTreePanel(win) {
  const panel = htmlTreePanel(win.document);

  sendToPreview(
    {
      source: 'statamic-visual-editor',
      type: 'sve-html-pick',
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
  htmlTreePendingUid = '';
  win?.clearTimeout?.(htmlTreePendingTimer);

  if (!panel) {
    sve.syncPreviewInset(win);

    return;
  }

  panel.remove();

  if (sveState.headerTab === 'html_tree') {
    setHeaderTab(win, null);
  }

  releaseRightShellIfEmpty(win);
  sve.persistDockedPanel(win);
  applyHeaderTab(win);
  sve.syncPreviewInset(win);
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

  if (!sve.featureOn(win, 'html_tree')) {
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
  sve.closeRightPanels(win, [HTML_TREE_PANEL_ID]);

  const panel = doc.createElement('div');

  panel.id = HTML_TREE_PANEL_ID;
  panel.style.cssText = RIGHT_PANEL_FILL;
  mountPane(panel, HtmlTreePane, {
    title: t(win, 'html_tree'),
  });

  panel.querySelector('[data-sve-close]')?.addEventListener('click', () => closeHtmlTreePanel(win));
  showInRightShell(win, panel);
  sve.persistDockedPanel(win);
  applyHeaderTab(win);
  sve.syncPreviewInset(win);
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

  sendToPreview({ source: 'statamic-visual-editor', type: 'sve-html-pick', on: false }, win);

  return true;
});

sve.HTML_TREE_PANEL_ID = HTML_TREE_PANEL_ID;
sve.htmlTreePanel = htmlTreePanel;
sve.closeHtmlTreePanel = closeHtmlTreePanel;
sve.fillHtmlTreePane = fillHtmlTreePane;
sve.showHtmlTreePane = showHtmlTreePane;
sve.openHtmlTreePanel = openHtmlTreePanel;
sve.toggleHtmlTreePanel = toggleHtmlTreePanel;
sve.renderHtmlTree = renderHtmlTree;
