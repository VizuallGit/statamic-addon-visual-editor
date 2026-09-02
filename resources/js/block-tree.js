/**
 * Settings toggle: `listview`
 * Block tree in the right dock.
 * Imports leftover helpers from cp.js. Does not get imported by cp.js.
 */
import { sve } from './cp-registry.js';
import { t } from './cp-t.js';
import { sveState } from './cp-state.js';
import { SELECTORS } from './cp-selectors.js';
import { panelIcon } from './cp-section-groups.js';
import {
  applyHeaderTab,
  findSetByVisualIdInput,
  isGridRow,
  sendToPreview,
  setHeaderTab,
} from './cp.js';
import { mountPane } from './cp/mount-pane.js';
import { mountSurface } from './cp/mount.js';
import {
  RIGHT_PANEL_FILL,
  isRightDockOpen,
  isRightDockResizing,
  registerRightDockHook,
  releaseRightShellIfEmpty,
  placeRightDock,
  rightDockWidth,
  showInRightShell,
} from './right-dock.js';
import { chromeSet } from './chrome-prefs.js';
import CommentsPane from './cp/surfaces/CommentsPane.vue';
import ListViewPane from './cp/surfaces/ListViewPane.vue';
import ListViewBody from './cp/surfaces/ListViewBody.vue';
import ListViewTree from './cp/surfaces/ListViewTree.vue';
import ListViewMenu from './cp/surfaces/ListViewMenu.vue';
import { listViewUi } from './cp/listview/store.js';

// ===== listview =====
// --- Block tree panel ("List View") ---------------------------------------------
// The page as its blocks, docked on the right: the section, and everything nested
// inside it, as one list you can click.
//
// The editor panel already shows one thing at a time and steps down into a block
// by clicking it on the page. That is a good way to work and a poor way to get an
// overview — you can only see where you are, never the shape of the whole page.
// This is the other half: the shape, with every row a way in.
//
// Read from the publish form's own values rather than from the rendered DOM. The
// values are the page; the DOM is one drawing of it, and a block scrolled out of
// view, collapsed, or hidden behind a condition is missing from the drawing while
// still being part of the page.
//
// A click hands the uid to the same `sve.focusFromPreview` the outline uses. Rename
// is the one write: it stores `_sve_label` on the row. The panel is redrawn from
// scratch each time it opens.

export const LISTVIEW_PANEL_ID = '__sve-listview-panel';

// Its own remembered width, and its own default. The tree is a column of short
// labels, so it wants far less room than Theme Settings — sharing that panel's
// 440px opened it twice as wide as it has anything to put there.
export const LISTVIEW_WIDTH_KEY = 'sve-listview-panel-width';
export const LISTVIEW_DEFAULT_WIDTH = 320; // 20rem
export const LISTVIEW_MIN_WIDTH = 220;

export function listViewPanelWidth(win) {
  return rightDockWidth(win);
}

/** The tree as last built, nested. */
export let listViewRoots = [];

/** Uids folded shut. Kept across redraws so a move doesn't reopen the page. */
export const listViewCollapsed = new Set();

/** The row drawn as current — the last one clicked here. */
export let listViewActiveUid = null;

/** The row being dragged, while a drag is in progress. */
export let listViewDragUid = null;

/** Whether the opening state has been decided for this session of the panel. */
export let listViewStarted = false;

/** Holder øje med om låsen skifter andetsteds — se watchListViewLocks. */
export let listViewLockObserver = null;

/** Unhooks for the publish-form watcher — see watchListViewValues. */
export let listViewValuesUnhook = [];
export let listViewValuesTimer = 0;
export let listViewValuesKey = '';
export let listViewValuesTarget = null;

/** Block tree only — heading outline is its own pane. */

/**
 * Opens a row and folds everything inside it.
 *
 * What a section shows when you go into it: its own blocks, and none of theirs.
 * Unfolding the whole subtree put twenty rows on screen for a section with two
 * blocks in it, and the list you came to read became the thing you had to read
 * past. Each block opens on its own when you click it.
 */
export function listViewOpenShallow(node) {
  listViewCollapsed.delete(node.uid);

  const shut = (child) => {
    listViewCollapsed.add(child.uid);
    child.children.forEach(shut);
  };

  node.children.forEach(shut);
}

/** Rows that sit beside `node` in the tree — same parent, same depth. */
export function listViewSiblings(node) {
  if (!node?.parentUid) {
    return listViewRoots;
  }

  const parent = listViewFlat(listViewRoots).find((item) => item.uid === node.parentUid);

  return parent?.children || [];
}

/** Siblings that share the same array — the only ones a move can swap with. */
export function listViewMovePeers(node) {
  return listViewSiblings(node).filter((sib) => sib.listKey === node.listKey);
}

/** First of its list has no up; last has no down. */
export function listViewMoveCaps(node) {
  const peers = listViewMovePeers(node);
  const index = peers.findIndex((sib) => sib.uid === node.uid);

  return {
    up: index > 0,
    down: index >= 0 && index < peers.length - 1,
  };
}

/**
 * Accordion at this node's level: open it, fold every sibling.
 *
 * Same rule the page's sections already had, now at every depth — opening
 * Item (1) shuts Item (2), opening Section heading shuts Content boxes, so
 * the tree shows the place you are rather than every nested row at once.
 */
export function listViewSoloSiblings(node) {
  listViewSiblings(node).forEach((sib) => {
    if (sib.uid === node.uid) {
      listViewCollapsed.delete(sib.uid);
    } else {
      listViewCollapsed.add(sib.uid);
    }
  });
}

/** Opens this row, folds its siblings, and shows only its own children. */
export function listViewOpenExclusive(node) {
  listViewSoloSiblings(node);
  listViewOpenShallow(node);
}

/**
 * Walks from the page down to `node`, accordion-opening each step.
 *
 * A click in live preview lands on one block. The path to it stays open; every
 * sibling along the way shuts. Without this the twist would accordion and the
 * page would not.
 */
export function listViewRevealPath(node) {
  const byUid = new Map(listViewFlat(listViewRoots).map((item) => [item.uid, item]));
  const path = [];

  for (let current = node; current; current = byUid.get(current.parentUid)) {
    path.unshift(current);
  }

  // Unfold the path and accordion each level. Do not shallow-reset a row the
  // user already had open — clicking Item (1) in preview should shut Item (2),
  // not fold the list they were just looking at inside Item (1).
  path.forEach((current) => {
    listViewSoloSiblings(current);
    listViewCollapsed.delete(current.uid);
  });
}

/**
 * Folds every top-level section but one.
 *
 * Kept as the root-only helper the panel's first draw still uses. Nested
 * accordion goes through listViewSoloSiblings.
 */
export function listViewSoloSection(uid) {
  listViewRoots.forEach((root) => {
    if (root.uid === uid) {
      listViewCollapsed.delete(root.uid);
    } else {
      listViewCollapsed.add(root.uid);
    }
  });
}

export function listViewPanel(doc) {
  return doc.getElementById(LISTVIEW_PANEL_ID);
}

/** Last measured Live Preview header bottom — never pin a docked panel to 0. */
export let dockedPanelTopLast = 56;

export function dockedPanelTop(win) {
  const header = sve.lpHeader(win.document);

  if (header) {
    const bottom = Math.round(header.getBoundingClientRect().bottom);

    if (bottom > 8) {
      dockedPanelTopLast = bottom;

      return bottom;
    }
  }

  return dockedPanelTopLast;
}

/**
 * Keep right-docked panels under the Live Preview header.
 *
 * They are `position:fixed` with `top` set from the header's height. On a page
 * change the header is often still 0px tall when the panel is restored, so `top`
 * becomes 0 and the tree covers Save & Publish. Re-pin whenever the header loop
 * runs — once the bar has a real height, the panel drops under it.
 */
export function pinDockedPanelsUnderHeader(win) {
  // Only follow the header's height. Restacking panes from the DOM pass
  // reparented Theme Settings and made the top bar blink with Patterns.
  if (isRightDockResizing()) {
    return;
  }

  if (isRightDockOpen(win)) {
    placeRightDock(win);
  }

  sve.placeGlobalsOverlay(win);
}

export function closeListViewPanel(win) {
  if (!listViewPanel(win.document)) {
    return;
  }

  listViewPanel(win.document).remove();
  listViewRoots = [];
  listViewDragUid = null;
  listViewStarted = false;
  listViewCollapsed.clear();
  stopWatchListViewValues(win);

  if (!win.document.getElementById(sve.OUTLINE_PANEL_ID)) {
    sve.watchOutlineInPreview(win, false);
  }

  releaseRightShellIfEmpty(win);
  sve.syncPreviewInset(win);
}

/**
 * Is this one row of a Replicator field — a block — rather than something else
 * that happens to carry a `type`?
 *
 * `type` alone is not enough, and that is the whole difficulty. A Bard field
 * stores its text as ProseMirror nodes, and those are objects with a `type` too:
 * a headline holds a `paragraph`, which holds a `text`. Drawn as blocks they fill
 * the tree with rows for the letters inside the block you were looking for.
 *
 * What separates them is what Statamic and this addon add to a *set*, and only to
 * a set: `enabled`, the switch on the row, and `_visual_id`, injected into every
 * set's blueprint so the preview can point at it. A ProseMirror node has neither,
 * because nothing in the editor treats it as a thing you can turn off or click.
 */
export function isBlockRow(value) {
  return (
    !!value
    && typeof value === 'object'
    && !Array.isArray(value)
    && typeof value.type === 'string'
    && ('enabled' in value || '_visual_id' in value)
  );
}

/**
 * Is this one row of a Grid field?
 *
 * Grid rows have no `type` — they are not sets — so `isBlockRow` cannot see them.
 * What they do have is the same identity a set has: `_visual_id` (injected into
 * every grid), or Statamic's own `id` / `_id`. Without this the tree drew a Links
 * block as one row and hid the buttons inside it, while a List next to it (a
 * nested Replicator) showed every item. The two are the same kind of thing to
 * click; only the fieldtype differs.
 *
 * Named apart from the DOM helper `isGridRow` (a stacked row element). This one
 * reads publish values. Checked only on array items, never on nested objects, so
 * a Bard node's `attrs` (which can carry an `id`) is not mistaken for a row.
 */
export function isGridRowValue(value) {
  return (
    !!value
    && typeof value === 'object'
    && !Array.isArray(value)
    && !isBlockRow(value)
    && typeof value.type !== 'string'
    && ('_visual_id' in value || typeof value.id === 'string' || typeof value._id === 'string')
  );
}

export function isTreeRow(value) {
  return isBlockRow(value) || isGridRowValue(value);
}

/**
 * A label for a grid row that has no set name: the first short text it holds.
 *
 * A link's own "Læs mere" tells the buttons apart; falling back to the field's
 * display name would name every row "Links" under a block already called that.
 */
export function gridRowPreview(row) {
  const keys = ['text', 'title', 'label', 'heading', 'name', 'headline'];

  for (const key of keys) {
    const value = row?.[key];

    if (typeof value !== 'string') {
      continue;
    }

    const text = value.replace(/\s+/g, ' ').trim();

    if (!text) {
      continue;
    }

    return text.length > 40 ? `${text.slice(0, 37)}…` : text;
  }

  return '';
}

/** The id a row is known by, in the order the rest of this file prefers them. */
export function blockRowUid(row) {
  return row._visual_id || row.id || row._id || '';
}

/**
 * Every id a row answers to.
 *
 * A block is annotated in the preview with whichever one its template happened to
 * pass — `data-sid` carries `_visual_id`, `data-sid-field-uid` carries whatever
 * went into `scope`, which is conventionally `id` but need not be, and some rows
 * have no `id` at all. Picking one and hoping is what made this fail twice: the
 * tree held `_visual_id`, the click reported `id`, and neither side was wrong.
 *
 * So all of them are carried, and a match on any is a match. Nothing distinguishes
 * two rows by these ids, so a wider net cannot catch the wrong fish.
 */
export function blockRowIds(row) {
  return [row._visual_id, row.id, row._id].filter((id) => typeof id === 'string' && id !== '');
}

/**
 * The page's blocks, flattened into rows with their depth.
 *
 * Walks every array under the page-builder field, at any depth, because nesting
 * is the thing being shown: a section holds blocks, a block holds rows — Replicator
 * sets and Grid rows alike — and how deep that goes is the fieldset's business,
 * not this panel's. Grid rows that sit directly on a section (Style, background
 * opacity, a responsive field's drawers) are skipped: those are the section's own
 * settings, not something you pick from a tree of blocks.
 *
 * Keys beginning with `_` are skipped. They hold the editor's own bookkeeping —
 * `_visual_id`, `_bp_order` — which is not part of the page and would otherwise
 * be walked into looking for blocks that cannot be there.
 */
export function listViewTree(win, doc) {
  const field = sve.sectionField(win);
  const roots = [];

  // `listKey` and `index` are what a drag needs: two rows may sit side by side in
  // the tree and still belong to different arrays — a section with both a
  // `blocks` field and a `content_boxes` field draws all of them as its children.
  // Reordering only means something within one array, so both are carried.
  const collect = (node, depth, parentUid, out, listKey) => {
    if (depth > 12 || !node || typeof node !== 'object') {
      return;
    }

    if (Array.isArray(node)) {
      node.forEach((item, index) => {
        if (!isTreeRow(item)) {
          collect(item, depth, parentUid, out, listKey);

          return;
        }

        const uid = blockRowUid(item);
        const children = [];
        const grid = isGridRowValue(item);

        // Grid rows on a section itself are settings — Style, background,
        // responsive drawers — not blocks. A Links set's buttons sit one level
        // deeper, inside a content block, and those are the ones the tree is for.
        if (grid && depth < 2) {
          return;
        }

        collect(item, depth + 1, uid, children, listKey);

        // Låst? Aflæst fra rækkens element i formularen — låsen er en indstilling
        // på feltet, ikke en værdi på rækken, så værdierne alene kan ikke sige
        // det. `data-row-locked` stemples af projektets LockedRows.js.
        const el = uid ? findSetByVisualIdInput(uid, doc) : null;
        const globalSet = sve.globalSectionSet(win);
        const isGlobal = !grid && item.type === globalSet;
        const globalId = isGlobal ? sve.firstEntryId(item[globalSet]) : '';
        const custom =
          typeof item._sve_label === 'string' ? item._sve_label.trim() : '';

        out.push({
          locked: !!el?.hasAttribute('data-row-locked'),
          // Låst op ved et klik — her eller på hængelåsen i venstre panel. De to
          // steder skriver i de samme attributter, så tilstanden er én.
          unlocked: !!el?.hasAttribute('data-row-unlocked'),
          uid,
          // Every id this row answers to — see blockRowIds. Which one a given
          // block is annotated with in the preview is the template's choice, not
          // something a tree of values can know.
          ids: blockRowIds(item),
          type: item.type || null,
          kind: grid ? 'grid' : 'set',
          preview: grid ? gridRowPreview(item) : '',
          label: custom,
          global: isGlobal,
          globalId,
          globalType: isGlobal ? sve.savedSectionInfo(win, globalId)?.section_type || '' : '',
          depth,
          index,
          listKey,
          parentUid,
          enabled: item.enabled !== false,
          children,
        });
      });

      return;
    }

    Object.entries(node).forEach(([key, value]) => {
      if (key.startsWith('_') || key === 'type' || key === 'id') {
        return;
      }

      collect(value, depth, parentUid, out, key);
    });
  };

  for (const container of sve.activeContainers(doc)) {
    const values = sve.unwrapRef(container.values);

    if (!values || typeof values !== 'object') {
      continue;
    }

    // Header/footer, edited inline, is a site global — its blueprint has never
    // heard of `field` (the page builder's own handle) and may not even agree
    // between the two of them (site_head's blocks live in `blocks`; site_foot
    // has no such field at all). Walk its own values instead of looking for
    // the page's field, so the tree still finds whatever it does have.
    if (container.name === sve.CHROME_CONTAINER) {
      collect(values, 0, null, roots, null);
    } else if (Array.isArray(values[field])) {
      collect(values[field], 0, null, roots, field);
    } else {
      continue;
    }

    // Låsen sidder på FELTET, ikke på rækken: `locked_rows` gør alle rækker i et
    // felt låste. Aflæsningen ovenfor finder kun de rækker der tilfældigvis er
    // tegnet i formularen netop nu, så én fundet lås smittes ud til resten af
    // samme felt. Ellers var det tilfældigt hvilke rækker træet troede var låst.
    const groups = new Map();
    const key = (node) => `${node.parentUid || ''}::${node.listKey}`;

    listViewFlat(roots).forEach((node) => {
      const seen = groups.get(key(node)) || { locked: false, unlocked: false };

      groups.set(key(node), {
        locked: seen.locked || node.locked,
        unlocked: seen.unlocked || node.unlocked,
      });
    });

    listViewFlat(roots).forEach((node) => {
      const seen = groups.get(key(node)) || { locked: false, unlocked: false };

      node.locked = seen.locked;
      node.unlocked = seen.unlocked;
    });

    // The first container holding the page builder is the page. A second one
    // would be another form open beside it — a global section being edited, say —
    // and its blocks belong to that panel, not to this tree.
    break;
  }

  return roots;
}

export const LISTVIEW_STYLE_ID = '__sve-listview-style';

/**
 * The tree's own stylesheet, added once.
 *
 * Inline styles cannot express hover, focus or the drop line, and the panel is
 * built as raw DOM rather than through Vue, so there is no component stylesheet
 * to put them in. Everything is stated in terms of `currentColor` and the
 * Control Panel's own background variable, which is what makes one set of rules
 * serve both the light and the dark theme: the panel inherits the text colour of
 * whichever it is in, and every tint is mixed from that.
 */
export function ensureListViewStyles(doc) {
  let style = doc.getElementById(LISTVIEW_STYLE_ID);

  if (!style) {
    style = doc.createElement('style');
    style.id = LISTVIEW_STYLE_ID;
    doc.head.appendChild(style);
  }

  style.textContent = `
    [data-sve-lv-row] {
      all: unset;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      gap: 7px;
      /* No width: the row is block-level, so it fills what is left after its own
         left margin. That margin is the indent — set on the card rather than as
         padding inside it, so a nested block steps in as a whole instead of
         growing a wide empty shoulder. */
      padding: 6px 8px;
      /* Tall enough for the controls whether they are showing or not. They are
         20px and the label is about 16, so without this the row grew the moment
         the pointer arrived — and every row below it stepped down. Height is
         reserved; the horizontal space is not, since five buttons' worth of it
         would be taken from the label on every row at once. */
      min-height: 32px;
      margin-bottom: 5px;
      background: rgba(128,128,128,.16);
      border-radius: 6px;
      font-size: 11px;
      line-height: 1.3;
      /* An open hand: the row can be picked up and moved. The controls inside it
         take it back — they are pressed, not dragged. */
      cursor: grab;
      position: relative;
      /* WebKit starts no drag on a plain element from the draggable attribute
         alone — it has to be told the element itself is the thing being dragged. */
      -webkit-user-drag: element;
      /* Without it the pointer selects the label instead of taking hold, and the
         drag never begins. */
      user-select: none;
    }
    [data-sve-lv-row]:hover { background: rgba(128,128,128,.26); }
    [data-sve-lv-row]:active,
    [data-sve-lv-row][data-sve-lv-dragging] { cursor: grabbing; }
    /* The dots and the buttons share one slot and swap: at rest the row shows
       what it can do (be moved), under the pointer it shows what you can do to
       it. Neither ever takes space from the other, so nothing shifts. */
    [data-sve-lv-handle] { flex: none; width: 14px; margin-inline-start: 8px; display: inline-flex; align-items: center; justify-content: center; opacity: .55; pointer-events: none; }
    /* Låst: en hængelås i stedet for prikkerne, og den bliver stående når
       markøren er over rækken — den siger hvorfor der ikke er knapper. */
    [data-sve-lv-handle][data-sve-lv-locked] svg { display: none; }
    [data-sve-lv-handle][data-sve-lv-locked]::before {
      content: "";
      width: 12px;
      height: 12px;
      background: currentColor;
      opacity: .9;
      mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 2a5 5 0 0 0-5 5v3H6.5A2.5 2.5 0 0 0 4 12.5v7A2.5 2.5 0 0 0 6.5 22h11a2.5 2.5 0 0 0 2.5-2.5v-7a2.5 2.5 0 0 0-2.5-2.5H17V7a5 5 0 0 0-5-5zm0 2a3 3 0 0 1 3 3v3H9V7a3 3 0 0 1 3-3z'/%3E%3C/svg%3E") center / contain no-repeat;
    }
    /* Kan låsen tages af, er hængelåsen en knap og skal kunne rammes — resten af
       håndtaget siger bare hvad rækken kan og tager ingen klik. */
    [data-sve-lv-handle][data-sve-lv-unlockable] { pointer-events: auto; cursor: pointer; }
    [data-sve-lv-handle][data-sve-lv-unlockable]:hover { opacity: 1; }
    [data-sve-lv-row]:hover [data-sve-lv-handle][data-sve-lv-locked] { display: inline-flex; }
    [data-sve-lv-row]:hover [data-sve-lv-handle] { display: none; }
    [data-sve-lv-row]:focus-visible { outline: 2px solid #3858e9; outline-offset: -2px; }
    /* One colour, two weights. Filled is the row you have selected; the box is
       the section standing open. The same blue in both, deliberately: they are
       two facts about the same place, and a second colour would make them look
       like two unrelated things. */
    [data-sve-lv-row][data-sve-lv-current] { background: #3858e9; color: #fff; }
    [data-sve-lv-row][data-sve-lv-current]:hover { background: #4a68ee; }
    /* The open section, drawn as one thing: the box holds the section's own row
       and every row under it, so what is open reads as a place you are inside of
       rather than a row that happens to be marked.
       Quiet on purpose — it says where you are, and the blue is kept for what you
       have actually chosen.
       A border rather than a box-shadow — the box needs a real bottom edge to
       stop the last row's margin collapsing out through it. */
    [data-sve-lv-branch] {
      border: 1px solid rgba(255,255,255,.15);
      border-radius: 9px;
      box-sizing: border-box;
      width: 100%;
      /* Same inset on every side — the selected row must not sit flush to the box. */
      padding: 5px;
      margin-bottom: 5px;
    }
    [data-sve-lv-branch] > [data-sve-lv-row]:last-child {
      margin-bottom: 0;
    }
    /* Until the selection is one of the rows inside it — then the box is the
       place you are working in, and it says so in the row's blue, held back a
       little: the filled row is what you chose, the box only says where it is. */
    [data-sve-lv-branch][data-sve-lv-here] { border-color: rgba(56,88,233,.6); }
    /* Rows inside the open box take a little of that same blue, so the grey
       chips read as belonging there. The filled row stays solid — that is
       still the one you chose. Delete these two rules to go back. */
    [data-sve-lv-branch][data-sve-lv-here] > [data-sve-lv-row]:not([data-sve-lv-current]) {
      background: rgba(56, 88, 233, .10);
    }
    [data-sve-lv-branch][data-sve-lv-here] > [data-sve-lv-row]:not([data-sve-lv-current]):hover {
      background: rgba(56, 88, 233, .18);
    }
    [data-sve-lv-row][data-sve-lv-off] { opacity: .45; }
    [data-sve-lv-row][data-sve-lv-dragging] { opacity: .4; }
    /* The drop line sits inside the row, so it needs no space of its own and
       cannot push the rows below it while a drag is under way. Which edge it
       lands on is which half of the row the pointer is in — the line is where the
       block will be, not merely which row it is near. */
    [data-sve-lv-row][data-sve-lv-drop="above"] { box-shadow: inset 0 2px 0 0 #3858e9; }
    [data-sve-lv-row][data-sve-lv-drop="below"] { box-shadow: inset 0 -2px 0 0 #3858e9; }
    /* Shown on hover only: the whole row drags, and a handle that is always
       visible reads as the only place that does. */
    /* Out of the way until the row is under the pointer or is the current one.
       Five controls on every row at once would read as the loudest thing in the
       panel, and the panel is for finding your way around. */
    [data-sve-lv-actions] { flex: none; display: none; align-items: center; gap: 1px; margin-inline-start: 8px; }
    [data-sve-lv-row]:hover [data-sve-lv-actions],
    [data-sve-lv-row][data-sve-lv-current] [data-sve-lv-actions] { display: inline-flex; }
    [data-sve-lv-act] {
      all: unset;
      flex: none;
      width: 20px;
      height: 20px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      cursor: pointer;
      opacity: .7;
    }
    [data-sve-lv-act]:hover { opacity: 1; background: rgba(128,128,128,.28); }
    [data-sve-lv-act][data-sve-lv-danger]:hover { background: rgba(229,72,77,.22); color: #e5484d; }
    [data-sve-lv-twist] {
      all: unset;
      flex: none;
      width: 16px;
      height: 16px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 3px;
      cursor: pointer;
      opacity: .65;
      transition: transform .12s ease;
    }
    [data-sve-lv-twist]:hover { opacity: 1; background: rgba(128,128,128,.28); }
    [data-sve-lv-twist][data-sve-lv-shut] { transform: rotate(-90deg); }
    [data-sve-lv-text] { flex: 1 1 auto; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    [data-sve-lv-global] {
      flex: none;
      font-size: 10px;
      font-weight: 600;
      letter-spacing: .02em;
      line-height: 1;
      padding: 3px 6px;
      border-radius: 999px;
      background: rgba(128,128,128,.22);
      opacity: .9;
    }
    [data-sve-lv-row][data-sve-lv-current] [data-sve-lv-global] {
      background: rgba(255,255,255,.22);
    }
    [data-sve-lv-rename] {
      all: unset;
      box-sizing: border-box;
      flex: 1 1 auto;
      min-width: 0;
      font: inherit;
      font-size: 12px;
      line-height: 1.3;
      padding: 1px 4px;
      margin: -1px -4px;
      border-radius: 3px;
      background: rgba(255,255,255,.16);
      outline: 2px solid currentColor;
    }
  `;
}

/** Every node in the tree, folded or not. */
export function listViewFlat(nodes, out = []) {
  nodes.forEach((node) => {
    out.push(node);
    listViewFlat(node.children, out);
  });

  return out;
}

/**
 * Marks in the tree what was just clicked on the page.
 *
 * The other half of selection. Clicking a row already selects the block on the
 * page; without this the reverse was silent, and the tree quietly went on
 * pointing at whatever was last chosen *in it* — which is worse than pointing at
 * nothing, because it looks like an answer.
 *
 * Either id will do. The preview reports whichever the template annotated with,
 * and a tree built from stored values holds both.
 *
 * Ancestors are unfolded on the way, since a row inside a folded parent cannot
 * be shown as current while it is not shown at all. Siblings along that path
 * fold shut, same as twisting a row open in the tree.
 */
export function listViewSyncTo(win, ...candidates) {
  const doc = win.document;
  const wanted = candidates.filter((id) => typeof id === 'string' && id !== '');

  if (!wanted.length || !listViewPanel(doc)) {
    return;
  }

  let flat = listViewFlat(listViewRoots);

  // Deepest first. A click on a block reports the block's own id *and* the
  // section's, and the block is the more specific answer — matching in tree order
  // would take the section every time and the tree would never point at anything
  // but the outermost thing you touched.
  const match = (node) => node.ids.some((id) => wanted.includes(id));
  const byDepth = (a, b) => b.depth - a.depth;
  let node = [...flat].sort(byDepth).find(match);

  // Nothing by that id: the tree was built before the block existed. Rebuild once
  // — the panel does not redraw on its own, and a block added since it opened is
  // exactly the one somebody is most likely to have just clicked.
  if (!node) {
    listViewRoots = listViewTree(win, doc);
    flat = listViewFlat(listViewRoots);
    node = [...flat].sort(byDepth).find(match);

    if (!node) {
      return;
    }
  }

  const before = [...listViewCollapsed].sort().join('\0');

  listViewRevealPath(node);

  const opened = before !== [...listViewCollapsed].sort().join('\0');

  if (listViewActiveUid !== node.uid || opened) {
    listViewActiveUid = node.uid;
    renderListView(win);
  }

  // Into view, but never scrolling the page — `nearest` moves the list only as
  // far as it has to, and not at all when the row is already on screen.
  listViewPanel(doc)?.querySelector('[data-sve-lv-current]')?.scrollIntoView({ block: 'nearest' });
}

/** Flattens the tree to the rows currently visible — folded ones stop the walk. */
export function listViewVisible(nodes, out = []) {
  nodes.forEach((node) => {
    out.push(node);

    if (node.children.length && !listViewCollapsed.has(node.uid)) {
      listViewVisible(node.children, out);
    }
  });

  return out;
}

/**
 * The name a tree row falls back to when nobody has renamed it.
 *
 * A global section is a reference, so the set's own display name is always
 * "Global section". The row should name what it *is* — the source's type —
 * and wear a badge for the reference. A custom `_sve_label` is not this.
 */
export function listViewDefaultLabel(win, item) {
  if (item.kind === 'grid' && item.preview) {
    return item.preview;
  }

  if (item.global) {
    const type = item.globalType || sve.savedSectionInfo(win, item.globalId)?.section_type || '';

    if (type) {
      return sve.setMeta(win, type)?.display || sve.humanizeHandle(type);
    }

    const title = sve.savedSectionInfo(win, item.globalId)?.title || '';

    if (title) {
      return title;
    }
  }

  const meta = item.kind === 'grid' ? sve.gridMeta(win, item.listKey) : sve.setMeta(win, item.type);

  return meta?.display || sve.humanizeHandle(item.type || item.listKey) || t(win, 'listview_item');
}

export function listViewRowLabel(win, item) {
  return item.label || listViewDefaultLabel(win, item);
}

/** Icon/name meta for a tree row — a global section uses the source type's icon. */
export function listViewRowMeta(win, item) {
  if (item.kind === 'grid') {
    return sve.gridMeta(win, item.listKey);
  }

  const type = item.global
    ? item.globalType || sve.savedSectionInfo(win, item.globalId)?.section_type || item.type
    : item.type;

  return sve.setMeta(win, type);
}

export function writeRowLabel(win, uid, label) {
  const doc = win.document;

  for (const container of sve.activeContainers(doc)) {
    const values = sve.unwrapRef(container.values);

    if (!values || typeof values !== 'object') {
      continue;
    }

    const found = sve.rowLocation(values, uid);

    if (!found) {
      continue;
    }

    const { parentPath, index, rows, kind } = found;
    const next = JSON.parse(JSON.stringify(rows));
    const value = label.trim();

    if (kind === 'bard-set' && next[index]?.type === 'set') {
      const valuesNode = { ...(next[index].attrs?.values || {}) };

      if (value) {
        valuesNode._sve_label = value;
      } else {
        delete valuesNode._sve_label;
      }

      next[index] = {
        ...next[index],
        attrs: { ...(next[index].attrs || {}), values: valuesNode },
      };
    } else {
      next[index] = { ...next[index] };

      if (value) {
        next[index]._sve_label = value;
      } else {
        delete next[index]._sve_label;
      }
    }

    container.setFieldValue(parentPath, next);

    return;
  }
}

/**
 * Puts the current name on the left panel, if it is showing this row or a
 * block inside it. The tree already redraws; the header does not, unless asked.
 */
export function refreshFocusName(win) {
  const doc = win.document;

  if (!sveState.soloUid) {
    return;
  }

  const kind = doc.documentElement.getAttribute(sve.FOCUS_ROOT_ATTR) || 'section';

  sve.paintFocusHeader(
    win,
    doc,
    sve.focusRowMeta(win, sveState.soloUid, doc),
    sve.focusBack(win, doc, sveState.soloUid, kind)
  );
}

/**
 * Turns the row's name into an input. Enter keeps it, Escape throws it away,
 * an empty name (or the type's own name again) goes back to the default.
 */
export function beginListViewRename(win, rowEl, item) {
  if (!rowEl || !item?.uid || item.kind === 'grid' || rowEl.querySelector('[data-sve-lv-rename]')) {
    return;
  }

  const doc = win.document;
  const text = rowEl.querySelector('[data-sve-lv-text]');

  if (!text) {
    return;
  }

  const input = doc.createElement('input');
  let closed = false;

  input.type = 'text';
  input.setAttribute('data-sve-lv-rename', '');
  input.value = listViewRowLabel(win, item);
  rowEl.draggable = false;

  const finish = (save) => {
    if (closed) {
      return;
    }

    closed = true;
    rowEl.draggable = !item.locked;

    if (save) {
      const next = input.value.replace(/\s+/g, ' ').trim();
      const fallback = listViewDefaultLabel(win, item);
      const stored = next && next !== fallback ? next : '';

      writeRowLabel(win, item.uid, stored);
      sendToPreview(
        {
          source: 'statamic-visual-editor',
          type: 'sve-row-label',
          ids: item.ids,
          label: stored || fallback,
        },
        win
      );
    }

    win.setTimeout(() => {
      renderListView(win);
      refreshFocusName(win);
    }, 0);
  };

  ['mousedown', 'click', 'dblclick', 'pointerdown'].forEach((name) => {
    input.addEventListener(name, (event) => event.stopPropagation());
  });
  input.addEventListener('keydown', (event) => {
    event.stopPropagation();

    if (event.key === 'Enter') {
      event.preventDefault();
      finish(true);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      finish(false);
    }
  });
  input.addEventListener('blur', () => finish(true));

  text.replaceWith(input);
  input.focus();
  input.select();
}

export const LISTVIEW_MENU_ID = '__sve-listview-menu';

/**
 * The row's own menu — the same four things a Replicator set offers, reached
 * from the tree instead of from the form.
 *
 * Appended to `document.body` rather than to the row. The panel clips its
 * contents and the list scrolls inside it, so a menu built where it is anchored
 * would be cut off at the row's own edge. Statamic's CP has the same problem and
 * solves it the same way.
 */
export function openListViewMenu(win, anchor, item) {
  const doc = win.document;

  doc.getElementById(LISTVIEW_MENU_ID)?.remove();

  const host = doc.createElement('div');
  const box = anchor.getBoundingClientRect();
  const items = [];

  host.id = LISTVIEW_MENU_ID;

  if (item.kind !== 'grid') {
    items.push({ id: 'rename', label: t(win, 'listview_rename') });
  }

  if (!item.locked) {
    const caps = listViewMoveCaps(item);

    if (caps.up) {
      items.push({ id: 'up', label: t(win, 'listview_move_up') });
    }

    if (caps.down) {
      items.push({ id: 'down', label: t(win, 'listview_move_down') });
    }

    items.push({ id: 'duplicate', label: t(win, 'listview_duplicate') });
  }

  if (item.kind !== 'grid') {
    items.push({
      id: 'hide',
      label: t(win, item.enabled ? 'listview_hide' : 'listview_show'),
    });
  }

  if (!item.locked) {
    items.push({ id: 'delete', label: t(win, 'listview_delete'), danger: true });
  }

  doc.body.appendChild(host);

  let app;
  const close = () => {
    app?.unmount();
    host.remove();
    win.removeEventListener('scroll', close, true);
    win.removeEventListener('resize', close);
    doc.removeEventListener('pointerdown', onOutside, true);
  };

  function onOutside(event) {
    if (!host.contains(event.target) && event.target !== anchor) {
      close();
    }
  }

  app = mountSurface(ListViewMenu, host, {
    items,
    top: Math.round(box.bottom + 4),
    left: Math.round(box.right - 180),
    onPick: (id) => {
      close();

      if (id === 'rename') {
        beginListViewRename(
          win,
          anchor.closest('[data-sve-lv-row]') || listViewPanel(doc)?.querySelector(`[data-sve-lv-uid="${item.uid}"]`),
          item
        );

        return;
      }

      if (id === 'up') {
        sve.handleMove({ uid: item.uid, direction: -1 }, doc);
      } else if (id === 'down') {
        sve.handleMove({ uid: item.uid, direction: 1 }, doc);
      } else if (id === 'duplicate') {
        sve.handleDuplicateRow({ uid: item.uid }, doc, win);
      } else if (id === 'hide') {
        sve.handleHideRow({ uid: item.uid }, doc, win);
      } else if (id === 'delete') {
        sve.handleRemoveRow({ uid: item.uid }, doc, win);
      }

      win.setTimeout(() => renderListView(win), 0);
    },
  });

  const menuBox = host.firstElementChild?.getBoundingClientRect?.() || host.getBoundingClientRect();

  if (menuBox.bottom > win.innerHeight - 8 && host.firstElementChild) {
    host.firstElementChild.style.top = `${Math.max(8, Math.round(box.top - menuBox.height - 4))}px`;
  }

  win.addEventListener('scroll', close, true);
  win.addEventListener('resize', close);
  doc.addEventListener('pointerdown', onOutside, true);
}

/** Draws the tree. Redrawn whole; never edited in place. */
/**
 * Må den her bruger tage låsen af?
 *
 * Samme svar som i formularen, hvor hængelåsen på rækken er en knap for super
 * admins og en kendsgerning for alle andre. Låsen er et værn mod uheld.
 */
export function mayUnlockRows(win) {
  return !!win.Statamic?.$permissions?.has?.('super');
}

/**
 * Sætter låsen på — eller tager den af — for hele den liste rækken hører til.
 *
 * Ikke kun den ene række, og det er med vilje: `locked_rows` er en indstilling på
 * FELTET, så alle rækker i listen er låst af samme grund. Træet kan i forvejen
 * bare aflæse de rækker der tilfældigvis er tegnet i formularen netop nu og
 * smitter fundet ud til resten af listen (se listViewTree) — låste man én række
 * op, ville dens søskende låse den igen i næste optegning.
 *
 * Skrives på formularens rækker, hvor projektets LockedRows.js læser dem. Det er
 * det ene sted tilstanden bor, så hængelåsen her og hængelåsen i venstre panel er
 * to visninger af samme kendsgerning — hvad man end klikker på, følger det andet
 * med. Intet gemmes: låsen er på igen næste gang siden åbnes.
 */
export function setListViewListLock(doc, item, locked) {
  listViewFlat(listViewRoots)
    .filter((node) => node.parentUid === item.parentUid && node.listKey === item.listKey)
    .forEach((node) => {
      const el = node.uid ? findSetByVisualIdInput(node.uid, doc) : null;

      if (!el) {
        return;
      }

      el.toggleAttribute('data-row-locked', locked);
      el.toggleAttribute('data-row-unlocked', !locked);
    });
}

/**
 * The publish container the tree is reading — the first one that holds the
 * page builder. Same pick as listViewTree, so a watcher and a draw never
 * disagree about which form is the page.
 */
export function listViewPageContainer(win, doc) {
  const field = sve.sectionField(win);

  for (const container of sve.activeContainers(doc)) {
    const values = sve.unwrapRef(container.values);

    if (values && typeof values === 'object' && Array.isArray(values[field])) {
      return container;
    }
  }

  return null;
}

/**
 * Uids, types, labels and fold of the tree — enough to know a section was
 * added, removed, renamed or reordered, without treating every keystroke
 * in a text field as a new page.
 */
export function listViewStructureKey(nodes) {
  return nodes
    .map((node) =>
      [node.uid, node.type, node.enabled ? 1 : 0, node.label, listViewStructureKey(node.children)].join('\0')
    )
    .join('\n');
}

export function stopWatchListViewValues(win) {
  listViewValuesUnhook.forEach((unhook) => {
    if (typeof unhook === 'function') {
      unhook();
    }
  });
  listViewValuesUnhook = [];
  listViewValuesTarget = null;
  listViewValuesKey = '';

  if (win && listViewValuesTimer) {
    win.clearTimeout(listViewValuesTimer);
  }

  listViewValuesTimer = 0;
}

/**
 * Redraws the tree when the page's sections change somewhere else.
 *
 * A drop from Patterns, a delete in the live preview, a duplicate — they all
 * write through the publish container and update the preview, but this panel
 * used to keep the snapshot it took when it opened. A click rebuilt it (see
 * listViewSyncTo); without one, the new section was on the page and missing
 * here. Watch the same values the tree is built from, and only redraw when
 * the structure actually moved.
 */
export function watchListViewValues(win) {
  const doc = win.document;
  const container = listViewPageContainer(win, doc);

  if (!container || typeof container.setFieldValue !== 'function') {
    if (listViewPanel(doc) && !listViewValuesUnhook.length) {
      win.setTimeout(() => {
        if (listViewPanel(doc) && !listViewValuesUnhook.length) {
          watchListViewValues(win);
        }
      }, 250);
    }

    return;
  }

  if (listViewValuesTarget === container && listViewValuesUnhook.length) {
    return;
  }

  stopWatchListViewValues(win);
  listViewValuesTarget = container;
  listViewValuesKey = listViewStructureKey(listViewRoots.length ? listViewRoots : listViewTree(win, doc));

  const schedule = () => {
    win.clearTimeout(listViewValuesTimer);
    listViewValuesTimer = win.setTimeout(() => {
      if (!listViewPanel(doc)) {
        return;
      }

      const next = listViewTree(win, doc);
      const key = listViewStructureKey(next);

      if (key === listViewValuesKey) {
        return;
      }

      listViewValuesKey = key;
      doc.dispatchEvent(new win.CustomEvent('sve-page-structure'));
      renderListView(win);
    }, 0);
  };

  const original = container.setFieldValue;

  const watchedSetFieldValue = function watchedSetFieldValue(...args) {
    const result = original.apply(this, args);

    schedule();

    return result;
  };

  container.setFieldValue = watchedSetFieldValue;

  listViewValuesUnhook.push(() => {
    if (container.setFieldValue === watchedSetFieldValue) {
      container.setFieldValue = original;
    }
  });

  const vueWatch = win.Vue?.watch;
  const values = container.values;

  if (typeof vueWatch === 'function' && values) {
    const stop = vueWatch(
      values.__v_isRef ? values : () => sve.unwrapRef(values)?.[sve.sectionField(win)],
      schedule,
      { deep: true }
    );

    if (typeof stop === 'function') {
      listViewValuesUnhook.push(stop);
    }
  }
}

/**
 * Tegner træet om når låsen skifter et andet sted.
 *
 * Hængelåsen i venstre panel skriver i de samme attributter, og træet er råt DOM
 * uden reaktivitet — uden dette stod det med den lås der var da det sidst blev
 * tegnet. Kun de to attributter aflyttes, og kun mens panelet er åbent.
 */
export function watchListViewLocks(win) {
  if (listViewLockObserver) {
    return;
  }

  const doc = win.document;
  let queued = false;

  listViewLockObserver = new MutationObserver(() => {
    if (queued || !listViewPanel(doc)) {
      return;
    }

    queued = true;
    win.requestAnimationFrame(() => {
      queued = false;

      if (listViewPanel(doc)) {
        renderListView(win);
      }
    });
  });

  listViewLockObserver.observe(doc.body, {
    subtree: true,
    attributes: true,
    attributeFilter: ['data-row-locked', 'data-row-unlocked'],
  });
}

export function renderListView(win) {
  const doc = win.document;
  const list = listViewPanel(doc)?.querySelector('[data-sve-listview-list]');

  if (!list) {
    return;
  }

  ensureListViewStyles(doc);
  watchListViewLocks(win);
  watchListViewValues(win);

  listViewRoots = listViewTree(win, doc);
  listViewValuesKey = listViewStructureKey(listViewRoots);

  // How the panel opens: the first section unfolded, the rest shut. Decided once
  // per opening rather than on every draw, so a section you fold by hand stays
  // folded through a move, a click on the page, or anything else that redraws.
  if (!listViewStarted && listViewRoots.length) {
    listViewSoloSection(listViewRoots[0].uid);
    listViewOpenShallow(listViewRoots[0]);

    // And marked, not merely unfolded. The panel opens showing the first
    // section's blocks, so that is where you are — a tree with nothing blue in
    // it reads as though nothing has been chosen yet.
    //
    // Only the mark. Nothing is opened on the page from here: this runs while
    // the editor is still settling, and reaching into it at that moment is what
    // left the panel and the preview blank once already.
    listViewActiveUid ??= listViewRoots[0].uid;

    listViewStarted = true;
  }

  const visible = listViewVisible(listViewRoots);
  const boxFor = new Map();

  listViewRoots.forEach((root) => {
    if (listViewCollapsed.has(root.uid)) {
      return;
    }

    const inside = listViewVisible([root]);
    const here = inside.some((node) => node.uid && node.uid === listViewActiveUid);

    inside.forEach((node) => boxFor.set(node, { id: root.uid, here }));
  });

  const actSvg = (paths) =>
    `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;

  const rowOf = (item, key) => {
    const meta = listViewRowMeta(win, item);
    const actions = [];

    if (item.uid && !item.locked) {
      if (item.unlocked && mayUnlockRows(win)) {
        actions.push({
          id: 'relock',
          title: t(win, 'listview_relock'),
          svg: actSvg('<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/>'),
        });
      }

      const caps = listViewMoveCaps(item);

      if (caps.up) {
        actions.push({
          id: 'up',
          title: t(win, 'listview_move_up'),
          svg: actSvg('<path d="M12 19V5M5 12l7-7 7 7"/>'),
        });
      }

      if (caps.down) {
        actions.push({
          id: 'down',
          title: t(win, 'listview_move_down'),
          svg: actSvg('<path d="M12 5v14M19 12l-7 7-7-7"/>'),
        });
      }

      actions.push(
        {
          id: 'duplicate',
          title: t(win, 'listview_duplicate'),
          svg: actSvg('<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/>'),
        },
        {
          id: 'delete',
          title: t(win, 'listview_delete'),
          svg: actSvg('<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>'),
          danger: true,
        }
      );
    }

    return {
      key,
      uid: item.uid || '',
      depth: item.depth,
      current: item.uid === listViewActiveUid,
      off: !item.enabled,
      title: item.enabled ? '' : t(win, 'listview_hidden'),
      hasChildren: item.children.length > 0,
      shut: listViewCollapsed.has(item.uid),
      twistTitle: t(win, 'listview_toggle'),
      iconName: meta?.icon || 'block',
      label: listViewRowLabel(win, item),
      canRename: item.kind !== 'grid',
      renameTitle: item.kind === 'grid' ? '' : t(win, 'listview_rename'),
      global: item.global ? t(win, 'listview_global') : '',
      globalTitle: t(win, 'global_badge'),
      locked: !!item.locked,
      hasMenu: !!item.uid,
      menuTitle: t(win, 'listview_actions'),
      actions,
      handleLocked: !!item.locked,
      handleUnlockable: !!(item.locked && mayUnlockRows(win)),
      handleTitle: item.locked
        ? t(win, mayUnlockRows(win) ? 'listview_unlock' : 'listview_locked')
        : '',
      dim: !item.uid,
      draggable: !!(item.uid && !item.locked),
    };
  };

  const groups = [];
  let current = null;

  visible.forEach((item, index) => {
    const box = boxFor.get(item);
    const row = rowOf(item, `${item.uid || 'anon'}-${index}`);

    if (box) {
      if (!current || current.id !== box.id) {
        current = { boxed: true, here: box.here, id: box.id, rows: [] };
        groups.push(current);
      }

      current.rows.push(row);
    } else {
      current = null;
      groups.push({ boxed: false, here: false, rows: [row] });
    }
  });

  const findItem = (uid) => listViewVisible(listViewRoots).find((node) => node.uid === uid);
  const rowEl = (event) => event.currentTarget?.closest?.('[data-sve-lv-row]') || event.currentTarget;

  listViewUi.emptyText = t(win, 'listview_empty');
  listViewUi.groups = visible.length ? groups : [];
  listViewUi.onTwist = (uid) => {
    const item = findItem(uid);

    if (!item) {
      return;
    }

    if (!listViewCollapsed.has(item.uid)) {
      listViewCollapsed.add(item.uid);
    } else {
      listViewOpenExclusive(item);
    }

    renderListView(win);
  };
  listViewUi.onSelect = (uid) => {
    const item = findItem(uid);

    if (!item) {
      return;
    }

    listViewActiveUid = item.uid;
    listViewRevealPath(item);
    renderListView(win);
    sve.focusFromPreview(item.uid, doc, win, { clampToSection: true });
    sendToPreview({ source: 'statamic-visual-editor', type: 'sve-activate', ids: item.ids }, win);
  };
  listViewUi.onRename = (uid, event) => {
    const item = findItem(uid);

    beginListViewRename(win, rowEl(event), item);
  };
  listViewUi.onAction = (uid, id) => {
    const item = findItem(uid);

    if (!item) {
      return;
    }

    if (id === 'relock') {
      setListViewListLock(doc, item, true);
    } else if (id === 'up') {
      sve.handleMove({ uid: item.uid, direction: -1 }, doc);
    } else if (id === 'down') {
      sve.handleMove({ uid: item.uid, direction: 1 }, doc);
    } else if (id === 'duplicate') {
      sve.handleDuplicateRow({ uid: item.uid }, doc, win);
    } else if (id === 'delete') {
      sve.handleRemoveRow({ uid: item.uid }, doc, win);
    }

    win.setTimeout(() => renderListView(win), 0);
  };
  listViewUi.onMenu = (uid, el) => {
    const item = findItem(uid);

    if (item) {
      openListViewMenu(win, el, item);
    }
  };
  listViewUi.onUnlock = (uid) => {
    const item = findItem(uid);

    if (!item) {
      return;
    }

    setListViewListLock(doc, item, false);
    renderListView(win);
  };
  listViewUi.onDragStart = (uid, event) => {
    const item = findItem(uid);

    if (!item || item.locked) {
      event.preventDefault();

      return;
    }

    listViewDragUid = item.uid;
    rowEl(event)?.setAttribute('data-sve-lv-dragging', '');
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', item.uid);
  };
  listViewUi.onDragEnd = (uid, event) => {
    listViewDragUid = null;
    rowEl(event)?.removeAttribute('data-sve-lv-dragging');
    list.querySelectorAll('[data-sve-lv-drop]').forEach((el) => el.removeAttribute('data-sve-lv-drop'));
  };

  const sameList = (item) => {
    const dragged = listViewVisible(listViewRoots).find((node) => node.uid === listViewDragUid);

    return (
      dragged
      && item
      && dragged.uid !== item.uid
      && dragged.parentUid === item.parentUid
      && dragged.listKey === item.listKey
    );
  };

  const dropSide = (event) => {
    const box = rowEl(event).getBoundingClientRect();

    return event.clientY < box.top + box.height / 2 ? 'above' : 'below';
  };

  listViewUi.onDragOver = (uid, event) => {
    const item = findItem(uid);

    if (!sameList(item)) {
      return;
    }

    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    rowEl(event)?.setAttribute('data-sve-lv-drop', dropSide(event));
  };
  listViewUi.onDragLeave = (uid, event) => {
    rowEl(event)?.removeAttribute('data-sve-lv-drop');
  };
  listViewUi.onDrop = (uid, event) => {
    const item = findItem(uid);
    const row = rowEl(event);
    const side = row?.getAttribute('data-sve-lv-drop') || dropSide(event);

    row?.removeAttribute('data-sve-lv-drop');

    if (!sameList(item)) {
      return;
    }

    event.preventDefault();

    const moved = listViewDragUid;
    const from = listViewVisible(listViewRoots).find((node) => node.uid === moved).index;
    const target = item.index - (from < item.index ? 1 : 0);

    sve.handleMove({ uid: moved, toIndex: side === 'above' ? target : target + 1 }, doc);
    listViewDragUid = null;
    listViewActiveUid = moved;
    win.setTimeout(() => renderListView(win), 0);
  };

  mountPane(list, ListViewTree);

  visible.forEach((item) => {
    if (!item.uid) {
      return;
    }

    const slot = list.querySelector(`[data-sve-lv-uid="${item.uid}"] [data-sve-lv-icon]`);
    const meta = listViewRowMeta(win, item);
    const icon = panelIcon(doc, meta?.icon || 'block');

    if (slot && icon) {
      icon.style.flex = 'none';
      slot.replaceWith(icon);
    }
  });
}


export function fillListViewPane(win, pane) {
  if (pane.querySelector('[data-sve-listview-list]')) {
    return;
  }

  pane.id = LISTVIEW_PANEL_ID;
  mountPane(pane, ListViewBody, { hint: t(win, 'listview_hint') });
}

export function showListViewPane(win) {
  renderListView(win);
}

export function registerRightDockContent() {
  registerRightDockHook('listview', {
    fill: fillListViewPane,
    show: showListViewPane,
  });
  registerRightDockHook('outline', {
    fill: sve.fillOutlinePane,
    show: sve.showOutlinePane,
    hide: (win) => sve.watchOutlineInPreview(win, false),
  });
  registerRightDockHook('sections', {
    fill: (win) => sve.mountSectionPicker(win),
  });
}

export function toggleListViewPanel(win) {
  const doc = win.document;

  if (listViewPanel(doc)) {
    closeListViewPanel(win);

    return;
  }

  sve.closeRightPanels(win, [LISTVIEW_PANEL_ID]);

  const panel = doc.createElement('div');

  panel.id = LISTVIEW_PANEL_ID;
  panel.style.cssText = RIGHT_PANEL_FILL;
  mountPane(panel, ListViewPane, {
    title: t(win, 'listview'),
  });

  panel.querySelector('[data-sve-close]').addEventListener('click', () => {
    closeListViewPanel(win);

    if (sveState.headerTab === 'listview') {
      setHeaderTab(win, null);
    }

    sve.persistDockedPanel(win);
    applyHeaderTab(win);
  });
  showInRightShell(win, panel);
  sve.syncPreviewInset(win);

  setListViewTab(win, 'tree');
}

export function commentsPanel(doc) {
  return doc.getElementById(sve.COMMENTS_PANEL_ID);
}

export function closeCommentsPanel(win) {
  if (!commentsPanel(win.document)) {
    return;
  }

  commentsPanel(win.document).remove();
  releaseRightShellIfEmpty(win);
  win.dispatchEvent(new CustomEvent('sve-right-dock-change', { detail: {} }));
  sve.syncPreviewInset(win);
}

export function toggleCommentsPanel(win) {
  const doc = win.document;

  if (commentsPanel(doc)) {
    closeCommentsPanel(win);

    return;
  }

  sve.closeRightPanels(win, [sve.COMMENTS_PANEL_ID]);

  const panel = doc.createElement('div');

  panel.id = sve.COMMENTS_PANEL_ID;
  panel.style.cssText = RIGHT_PANEL_FILL;
  mountPane(panel, CommentsPane, {
    title: t(win, 'comments_pane'),
    placeTitle: t(win, 'comments_place'),
  });
  panel.querySelector('[data-sve-close]').addEventListener('click', () => {
    closeCommentsPanel(win);
    sve.persistDockedPanel(win);
    applyHeaderTab(win);
  });
  showInRightShell(win, panel);
  sve.persistDockedPanel(win);
  applyHeaderTab(win);
  sve.syncPreviewInset(win);
}

/** Fills the block tree pane. Outline is a separate panel. */
export function setListViewTab(win, tab) {
  const panel = listViewPanel(win.document);

  if (!panel) {
    return;
  }

  sveState.listViewTab = 'tree';
  chromeSet(win, 'sve-listview-tab', 'tree');

  const body = panel.querySelector('[data-sve-lv-body]');

  mountPane(body, ListViewBody, { hint: t(win, 'listview_hint') });
  renderListView(win);
}



sve.LISTVIEW_PANEL_ID = LISTVIEW_PANEL_ID;
sve.LISTVIEW_WIDTH_KEY = LISTVIEW_WIDTH_KEY;
sve.LISTVIEW_DEFAULT_WIDTH = LISTVIEW_DEFAULT_WIDTH;
sve.LISTVIEW_MIN_WIDTH = LISTVIEW_MIN_WIDTH;
sve.listViewPanelWidth = listViewPanelWidth;
Object.defineProperty(sve, 'listViewRoots', { get() { return listViewRoots; }, set(v) { listViewRoots = v; } });
sve.listViewCollapsed = listViewCollapsed;
Object.defineProperty(sve, 'listViewActiveUid', { get() { return listViewActiveUid; }, set(v) { listViewActiveUid = v; } });
Object.defineProperty(sve, 'listViewDragUid', { get() { return listViewDragUid; }, set(v) { listViewDragUid = v; } });
Object.defineProperty(sve, 'listViewStarted', { get() { return listViewStarted; }, set(v) { listViewStarted = v; } });
Object.defineProperty(sve, 'listViewLockObserver', { get() { return listViewLockObserver; }, set(v) { listViewLockObserver = v; } });
sve.listViewOpenShallow = listViewOpenShallow;
sve.listViewSiblings = listViewSiblings;
sve.listViewMovePeers = listViewMovePeers;
sve.listViewMoveCaps = listViewMoveCaps;
sve.listViewSoloSiblings = listViewSoloSiblings;
sve.listViewOpenExclusive = listViewOpenExclusive;
sve.listViewRevealPath = listViewRevealPath;
sve.listViewSoloSection = listViewSoloSection;
sve.listViewPanel = listViewPanel;
Object.defineProperty(sve, 'dockedPanelTopLast', { get() { return dockedPanelTopLast; }, set(v) { dockedPanelTopLast = v; } });
sve.dockedPanelTop = dockedPanelTop;
sve.pinDockedPanelsUnderHeader = pinDockedPanelsUnderHeader;
sve.closeListViewPanel = closeListViewPanel;
sve.isBlockRow = isBlockRow;
sve.isGridRowValue = isGridRowValue;
sve.isTreeRow = isTreeRow;
sve.gridRowPreview = gridRowPreview;
sve.blockRowUid = blockRowUid;
sve.blockRowIds = blockRowIds;
sve.listViewTree = listViewTree;
sve.LISTVIEW_STYLE_ID = LISTVIEW_STYLE_ID;
sve.ensureListViewStyles = ensureListViewStyles;
sve.listViewFlat = listViewFlat;
sve.listViewSyncTo = listViewSyncTo;
sve.listViewVisible = listViewVisible;
sve.listViewDefaultLabel = listViewDefaultLabel;
sve.listViewRowLabel = listViewRowLabel;
sve.listViewRowMeta = listViewRowMeta;
sve.writeRowLabel = writeRowLabel;
sve.refreshFocusName = refreshFocusName;
sve.beginListViewRename = beginListViewRename;
sve.LISTVIEW_MENU_ID = LISTVIEW_MENU_ID;
sve.openListViewMenu = openListViewMenu;
sve.mayUnlockRows = mayUnlockRows;
sve.setListViewListLock = setListViewListLock;
sve.watchListViewLocks = watchListViewLocks;
sve.listViewPageContainer = listViewPageContainer;
sve.listViewStructureKey = listViewStructureKey;
sve.stopWatchListViewValues = stopWatchListViewValues;
sve.watchListViewValues = watchListViewValues;
sve.renderListView = renderListView;
sve.fillListViewPane = fillListViewPane;
sve.showListViewPane = showListViewPane;
sve.registerRightDockContent = registerRightDockContent;
sve.toggleListViewPanel = toggleListViewPanel;
sve.commentsPanel = commentsPanel;
sve.closeCommentsPanel = closeCommentsPanel;
sve.toggleCommentsPanel = toggleCommentsPanel;
sve.setListViewTab = setListViewTab;
