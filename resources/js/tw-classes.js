/**
 * The Tailwind side of the dock's CSS pane.
 *
 * The pane has two modes. In CSS mode the icon row writes declarations into
 * the rule under the cursor, as it always has. In Tailwind mode the same six
 * icons write classes onto **the tag picked in the HTML tree**, and the pane
 * below lists that tag's classes as chips you can swap, add and drop.
 *
 * The values come from this site's own `@theme`, not Tailwind's defaults —
 * see tw-families.js. Three things stay out of reach on purpose: a `{{ … }}`
 * class, because the utility it renders is not known here; the `[ name ]`
 * scope, which belongs to the CSS pane; and any change at all while the file
 * is locked.
 *
 * A swap edits the *template*, so it lands on every place that partial is
 * used and on every element a loop renders from that one tag.
 */

import { breakpoints as siteBreakpoints } from './breakpoints.js';
import { t } from './lib/i18n.js';
import { chromeGet } from './chrome-prefs.js';
import { ask, emit, on } from './cp/bus.js';
import { mountPane } from './cp/mount-pane.js';
import { mountSurface } from './cp/mount.js';
import CodeDockDataVars from './cp/surfaces/CodeDockDataVars.vue';
import { HT_PATH_ATTR } from './html-pick-align.js';
import { flattenHtmlTree, parseHtmlTree } from './html-tree-parse.js';
import {
  appendToken,
  buildClass,
  groupClassTokens,
  readClassAttr,
  renameTag,
  reorderTokens,
  replaceToken,
  splitClass,
  splitUtility,
  writeClassValue,
} from './tw-parse.js';
import { colorFor, cssFor, familyFor, loadFamilies, optionsForProperty } from './tw-families.js';
import { twUi } from './cp/tailwind/store.js';
import { hideTwOverlay, paintTwOverlay, twPreviewBox } from './tw-overlay.js';
import TwClassList from './cp/surfaces/TwClassList.vue';
import TwClassMenu from './cp/surfaces/TwClassMenu.vue';
import TwAddClass from './cp/surfaces/TwAddClass.vue';
import TwTagMenu from './cp/surfaces/TwTagMenu.vue';
import { previewDocument } from './lib/preview-frame.js';
import { EVENT } from './lib/protocol.js';
import { injectStyle } from './lib/style.js';

const MENU_ID = '__sve-tw-menu';
const ANCHOR_NAME = '--sve-tw-anchor';

/**
 * CSS anchor positioning where the browser has it.
 *
 * The menu is then tied to the button itself: it follows when the strip moves
 * and flips on its own when it runs out of room, without a line of geometry
 * here. `placeMenu` stays as the fallback for browsers without it, and for
 * every menu opened from the panel rather than the strip.
 */
const CAN_ANCHOR = typeof CSS !== 'undefined' && CSS.supports?.('anchor-name: --x');

let anchored = null;
const STYLE_ID = '__sve-tw-style';

/**
 * Screen sizes stay in sight, because that is the axis you move along while
 * looking at a page. Everything else lives behind one menu.
 *
 * Largest first, and `max-` rather than Tailwind's default `min-`: this
 * project designs on the widest size and works downwards, the same direction
 * the responsive fieldtype and every `@media (width < …)` in the sections take.
 * The widest is the rule and the smaller sizes are exceptions from it, so the
 * widest is the bare class — not the phone.
 *
 * The sizes themselves come from the site's own list, so this row and the
 * preview's device buttons can never offer different ones. "All" is prepended
 * because it is not a size: it is the view with no size filter on at all.
 */
function BREAKPOINTS(win = window) {
  const rows = siteBreakpoints(win);

  return [
    { key: '', all: true, device: 'Responsive', label: t(win, 'tw_size_all') },
    ...rows.map((row, i) => ({
      key: row.tw,
      device: row.device,
      label: row.label,
      handle: row.handle,
      prefix: row.base ? '' : undefined,
      under: i === 0 ? null : rows[i - 1].min,
    })),
  ];
}
/**
 * `group-hover` and `group-focus` are the state of *another* tag: they answer
 * to a `group` class on an ancestor, not to the pointer on this one. They sit
 * here anyway, because from where you are standing — pick a tag, pick a
 * state, write a class — they work exactly like `hover`. The `group` itself
 * is a class you put on the parent, and the Add class search knows it.
 */
const STATES = ['', 'dark', 'hover', 'focus', 'active', 'group-hover', 'group-focus', 'before', 'after'];

/**
 * The typography plugin's element variants: `prose-p:text-400` styles every
 * paragraph the element holds. Picked like a state, written the same way.
 */
const PROSE_VARIANTS = [
  'prose-headings', 'prose-lead', 'prose-h1', 'prose-h2', 'prose-h3', 'prose-h4', 'prose-h5', 'prose-h6',
  'prose-p', 'prose-a', 'prose-blockquote', 'prose-figure', 'prose-figcaption', 'prose-strong', 'prose-em',
  'prose-kbd', 'prose-code', 'prose-pre', 'prose-ol', 'prose-ul', 'prose-li', 'prose-table', 'prose-thead',
  'prose-tr', 'prose-th', 'prose-td', 'prose-img', 'prose-video', 'prose-hr',
];

/**
 * Which size the preview's own device buttons mean.
 *
 * The same boundaries the responsive field uses, because they are read from
 * the same list: a size under 1024px is what `max-lg` compiles to. The widest
 * is the base, with no prefix at all, because that is where a section is
 * designed. Fit is deliberately absent — it is not a size, and `filterBySize`
 * reads that absence as "show everything".
 */
function deviceBpMap(win = window) {
  const out = {};

  for (const row of siteBreakpoints(win)) {
    out[row.device] = row.tw;
  }

  return out;
}

/** The tags worth offering. Anything else can still be typed. */
const TAGS = [
  'div', 'section', 'article', 'header', 'footer', 'main', 'aside', 'nav',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'a', 'button', 'label',
  'ul', 'ol', 'li', 'figure', 'figcaption', 'blockquote', 'strong', 'em',
  'small', 'picture', 'img', 'video', 'form', 'table', 'tr', 'td', 'th',
];

/**
 * What new classes are written under: a screen size, a state, or both —
 * `md:hover:bg-primary` is one click on each.
 *
 * The size follows the preview's device buttons until someone picks one by
 * hand; from then on the hand-picked one stands, until the device changes
 * again. Clicking a chip that already exists still edits that chip's own
 * variant — this decides where new classes land, not where old ones live.
 */
let variantBp = '';
let variantState = '';
let bpManual = false;

function deviceBp() {
  try {
    return deviceBpMap(window)[chromeGet(window, 'sve-lp-device')] ?? '';
  } catch {
    return '';
  }
}

function activeBp() {
  return bpManual ? variantBp : deviceBp();
}

/** The variants in Tailwind's own order: size first, then state. */
function variantList() {
  return [activeBp(), variantState].filter(Boolean);
}

function variantKey() {
  return variantList().join(':');
}

/**
 * Anything shaped like a screen size: ours, Tailwind's own min-width set, or
 * the arbitrary `max-[900px]` a self-chosen boundary has to be written as —
 * Tailwind's scale has five steps, and a site's list need not land on them.
 */
const BP_SHAPED = /^(max-)?(sm|md|lg|xl|2xl)$|^(max|min)-\[[^\]]+\]$/;

/** The screen size a group belongs to — `max-lg:hover` belongs to `max-lg`. */
function groupBp(key) {
  return String(key || '').split(':').find((part) => BP_SHAPED.test(part)) || '';
}

/**
 * Filtering is on while a device button is picked, or while a size was picked
 * by hand. On Fit nothing is filtered — that is the view where you want the
 * whole picture.
 */
function filterBySize() {
  if (bpManual) {
    return true;
  }

  try {
    return Object.prototype.hasOwnProperty.call(deviceBpMap(window), chromeGet(window, 'sve-lp-device'));
  } catch {
    return false;
  }
}

/**
 * Does this group belong to the size being looked at?
 *
 * A size the row cannot name — `md:` from before this was desktop-first —
 * stays visible everywhere. Better a group too many than a class that
 * disappears with no way to find it.
 */
function groupInSize(key) {
  if (!filterBySize()) {
    return true;
  }

  const bp = groupBp(key);

  if (bp === activeBp()) {
    return true;
  }

  return !BREAKPOINTS(window).some((item) => item.key === bp);
}

/** The picked tag: `from`/`openTo` locate its open tag in the dock's HTML. */
let node = null;
let chips = new Map();
let model = null;
let modelWanted = false;
let openChipId = '';
let menuUnhook = null;

export function twClassesHost(doc) {
  return doc?.querySelector?.('[data-sve-style="tw"] [data-sve-tw-host]') || null;
}

function ensureStyles(doc) {
  injectStyle(doc, STYLE_ID, `
    #${MENU_ID} {
      position: fixed;
      z-index: 100000;
      box-sizing: border-box;
      min-width: 13rem;
      max-width: 18rem;
      max-height: 60vh;
      overflow-y: auto;
      padding: 0.5rem;
      border-radius: 0.6rem;
      border: 1px solid rgba(255,255,255,.12);
      background: #252526;
      color: #d4d4d4;
      box-shadow: 0 0.5rem 1.5rem rgba(0,0,0,.4);
      font-size: 0.75rem;
    }
    /* A menu with a search and rows under it: the search and the tabs stay
       put, and only the rows scroll — the state popup and the class list. */
    #${MENU_ID}:has([data-sve-tw-rows]),
    #${MENU_ID}[data-sve-data-menu] {
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    #${MENU_ID} [data-sve-tw-rows] {
      flex: 1 1 auto;
      min-height: 0;
      overflow-y: auto;
    }
    /* The search and the tabs keep their height however long the list is. */
    #${MENU_ID} [data-sve-tw-search],
    #${MENU_ID} [data-sve-tw-tabs],
    #${MENU_ID} [data-sve-tw-add-empty] {
      flex: 0 0 auto;
    }
    /* The state popup is the Insert data one: wider than a class menu, same look. */
    #${MENU_ID}[data-sve-data-menu] {
      min-width: 20rem;
      max-width: 20rem;
    }
    #${MENU_ID} [data-sve-tw-menu-title] {
      padding: 0.1em 0.2em 0.5em;
      opacity: .55;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 0.6875rem;
    }
    #${MENU_ID} [data-sve-tw-option],
    #${MENU_ID} [data-sve-tw-remove] {
      all: unset;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      gap: 0.55em;
      width: 100%;
      padding: 0.4em 0.5em;
      border-radius: 0.4em;
      cursor: pointer;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      line-height: 1.5;
    }
    #${MENU_ID} [data-sve-tw-option]:hover,
    #${MENU_ID} [data-sve-tw-remove]:hover {
      background: rgba(255,255,255,.1);
    }
    #${MENU_ID} [data-sve-tw-option][data-active] {
      background: rgba(255,255,255,.06);
    }
    #${MENU_ID} [data-sve-tw-option][data-cursor] {
      background: rgba(255,255,255,.1);
    }
    #${MENU_ID} [data-sve-tw-option][data-sve-tw-off] [data-sve-tw-label] {
      opacity: .45;
      text-decoration: line-through;
      text-decoration-thickness: 1px;
    }
    #${MENU_ID} [data-sve-tw-tick] {
      flex: 0 0 auto;
      width: 0.9em;
      opacity: .7;
      font-family: ui-sans-serif, system-ui, sans-serif;
      line-height: 1;
    }
    #${MENU_ID} [data-sve-tw-dot] {
      flex: 0 0 auto;
      width: 0.9em;
      height: 0.9em;
      border-radius: 0.18em;
      border: 1px solid rgba(128,128,128,.5);
    }
    #${MENU_ID} [data-sve-tw-label] {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    #${MENU_ID} [data-sve-tw-remove] {
      margin-top: 0.3rem;
      border-top: 1px solid rgba(255,255,255,.14);
      border-radius: 0 0 0.4em 0.4em;
      padding-top: 0.6em;
      font-family: ui-sans-serif, system-ui, sans-serif;
    }
    #${MENU_ID} [data-sve-tw-search] {
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
    #${MENU_ID} [data-sve-tw-search]:focus-within {
      border-color: rgba(147,197,253,.7);
    }
    #${MENU_ID} [data-sve-tw-search] svg {
      flex: 0 0 auto;
      opacity: .5;
    }
    #${MENU_ID} [data-sve-tw-add-input],
    #${MENU_ID} [data-sve-tw-filter-input] {
      all: unset;
      flex: 1 1 auto;
      min-width: 0;
      color: inherit;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 0.75rem;
    }
    #${MENU_ID} [data-sve-tw-tabs] {
      display: flex;
      gap: 0.2rem;
      margin-bottom: 0.45rem;
      padding: 0.15rem;
      border-radius: 0.45em;
      background: rgba(0,0,0,.28);
    }
    #${MENU_ID} [data-sve-tw-tab] {
      all: unset;
      flex: 1 1 0;
      box-sizing: border-box;
      padding: 0.35em 0;
      border-radius: 0.35em;
      cursor: pointer;
      text-align: center;
      font-family: ui-sans-serif, system-ui, sans-serif;
      font-size: 0.6875rem;
      opacity: .65;
    }
    #${MENU_ID} [data-sve-tw-tab]:hover { opacity: 1; }
    #${MENU_ID} [data-sve-tw-tab][data-active] {
      opacity: 1;
      background: rgba(255,255,255,.14);
    }
    #${MENU_ID} [data-sve-tw-add-empty] {
      padding: 0.4em 0.5em;
      opacity: .55;
    }
  `);
}

/**
 * The colour a class actually paints.
 *
 * The catalog only knows a swatch when `@theme` holds a literal — and this
 * project writes `--color-primary-900: var(--primary-900)`, with the real
 * value in a file the theme endpoint never sees. So the chain is followed in
 * the preview document, which has the whole stylesheet loaded. Reads only:
 * computed styles of the root element, no element added and nothing changed.
 */
const colorCache = new Map();

/**
 * The variable a declaration paints with — but only when it paints a colour.
 *
 * `padding: var(--spacing-100)` also holds a variable, and following that one
 * gave every spacing option an empty swatch next to it.
 */
const COLOR_PROPERTY = /(^|-)color$|^fill$|^stroke$/;

function varName(css) {
  const text = String(css || '');
  const property = text.slice(0, text.indexOf(':')).trim();

  if (!COLOR_PROPERTY.test(property)) {
    return '';
  }

  return /var\(\s*(--[A-Za-z0-9_-]+)\s*\)/.exec(text)?.[1] || '';
}

function resolveVarColor(win, name) {
  if (!name) {
    return '';
  }

  if (colorCache.has(name)) {
    return colorCache.get(name);
  }

  const doc = previewDocument(win);
  const root = doc?.documentElement;
  const view = doc?.defaultView;

  if (!root || !view) {
    return '';
  }

  let value = '';
  let key = name;

  // A custom property is not substituted until it is used, so `--color-x:
  // var(--x)` comes back as written. Follow it by hand, with a stop.
  for (let hop = 0; hop < 6 && key; hop += 1) {
    try {
      value = view.getComputedStyle(root).getPropertyValue(key).trim();
    } catch {
      return '';
    }

    if (!value) {
      return '';
    }

    key = varName(value);

    if (!key) {
      break;
    }
  }

  if (value && !value.startsWith('var(')) {
    colorCache.set(name, value);

    return value;
  }

  return '';
}

/** The catalog's swatch, or the one the preview can resolve. */
function chipColor(win, name) {
  return colorFor(name, model) || resolveVarColor(win, varName(cssFor(name, model)));
}

export function closeTwMenu(win) {
  const menu = win?.document.getElementById(MENU_ID);

  if (anchored) {
    anchored.style.removeProperty('anchor-name');
    anchored = null;
  }

  menuUnhook?.();
  menuUnhook = null;
  openChipId = '';

  if (!menu) {
    return;
  }

  menu._sveApp?.unmount();
  menu.remove();
}

/**
 * Under the thing that opened it, always.
 *
 * A menu that flips above the button when the list is long lands somewhere
 * else every time, and the reader has to go looking for it. It stays put and
 * scrolls instead: the height is whatever room is left below, and only when
 * that is too little does it move up far enough to fit on screen.
 */
function placeMenu(win, anchor, menu) {
  const rect = anchor.getBoundingClientRect();
  const width = menu.offsetWidth || 176;
  const pad = 8;
  const min = 140;

  // Opened from the strip over the preview, it stays over the preview: a menu
  // that spills onto the sidebar or the dock reads as belonging to them.
  const box = anchor.closest?.('#__sve-tw-strip') ? twPreviewBox(win) : null;
  const edgeTop = box ? box.top : 0;
  const edgeBottom = box ? box.bottom : win.innerHeight;
  const edgeLeft = box ? box.left : 0;
  const edgeRight = box ? box.right : win.innerWidth;

  const below = rect.bottom + 4;
  const room = edgeBottom - below - pad;
  const height = Math.max(min, Math.min(room, 420));

  menu.style.left = `${Math.max(edgeLeft + pad, Math.min(rect.left, edgeRight - width - pad))}px`;
  menu.style.maxHeight = `${height}px`;
  menu.style.top = `${room >= min ? below : Math.max(edgeTop + pad, edgeBottom - pad - height)}px`;
}

/** One popover, wherever it is anchored: chip, tool icon or the + button. */
function openMenu(win, anchor, component, props) {
  const doc = win.document;

  closeTwMenu(win);
  ensureStyles(doc);

  const menu = doc.createElement('div');

  menu.id = MENU_ID;
  doc.body.appendChild(menu);
  menu._sveApp = mountSurface(component, menu, props);

  const tether = CAN_ANCHOR && !!anchor.closest?.('#__sve-tw-strip');

  if (tether) {
    anchored = anchor;
    anchor.style.setProperty('anchor-name', ANCHOR_NAME);
    menu.style.setProperty('position', 'absolute');
    menu.style.setProperty('position-anchor', ANCHOR_NAME);
    menu.style.setProperty('position-area', 'block-end span-inline-start');
    menu.style.setProperty(
      'position-try-fallbacks',
      'flip-block, flip-inline, flip-block flip-inline'
    );
    menu.style.setProperty('margin', '4px 0 0 0');
    menu.style.setProperty('max-height', '20rem');
  } else {
    placeMenu(win, anchor, menu);
  }

  const reposition = () => {
    if (!tether) {
      placeMenu(win, anchor, menu);
    }
  };
  const onDown = (event) => {
    if (!menu.contains(event.target) && !anchor.contains(event.target)) {
      closeTwMenu(win);
      paint();
    }
  };
  const onKey = (event) => {
    if (event.key === 'Escape') {
      closeTwMenu(win);
      paint();
    }
  };

  doc.addEventListener('pointerdown', onDown, true);
  doc.addEventListener('keydown', onKey, true);
  win.addEventListener('scroll', reposition, true);
  win.addEventListener('resize', reposition);

  menuUnhook = () => {
    doc.removeEventListener('pointerdown', onDown, true);
    doc.removeEventListener('keydown', onKey, true);
    win.removeEventListener('scroll', reposition, true);
    win.removeEventListener('resize', reposition);
  };

  return menu;
}

function optionRows(win, options, active) {
  return (options || []).map((option) => ({
    label: option.label,
    css: option.css,
    color: option.color || resolveVarColor(win, varName(option.css)),
    active: option.label === active,
  }));
}

/* ------------------------------------------------------------------ *
 * Reading and writing the picked tag
 * ------------------------------------------------------------------ */

function locked() {
  return !node || ask('dock:is-locked') === true;
}

/** The class attribute as it stands right now — `''` when the tag has none. */
function currentValue() {
  const html = ask('dock:html');

  if (!node || typeof html !== 'string') {
    return null;
  }

  // The dock can swap to another file between the tree's render and this
  // click. Offsets from the old one must not splice into the new: a tag
  // starts with `<`, and anything else means the pick is stale.
  if (html[node.from] !== '<') {
    return null;
  }

  const attr = readClassAttr(html, node.from, node.openTo);

  return { html, value: attr ? attr.value : '' };
}

/**
 * Offsets move as the file changes, so the picked tag is found again by its
 * path after every write. Without this a second click in a row would splice
 * into the wrong place whenever the first one changed the length of the tag.
 */
function resyncNode(html) {
  if (!node?.path) {
    return;
  }

  const rows = flattenHtmlTree(parseHtmlTree(html), new Set());
  const row = rows.find((item) => item.path === node.path);

  if (row) {
    node = { from: row.from, openTo: row.openTo, path: row.path, tag: row.tag };
  }
}

function commit(win, html, nextValue) {
  const next = writeClassValue(html, node, nextValue);

  if (next === html) {
    return;
  }

  ask('dock:set-html', next);
  resyncNode(next);
  render(win);
}

/**
 * One order for the classes, by what they do.
 *
 * The sequence people tend to think in: what the box is, where it sits, how
 * big, how it reads, how it looks. The site's own names come first — `wrapper`
 * and `cluster` say what the element *is*, and the utilities adjust it.
 *
 * Only used when the reader asks for it. Dragging is the other way, and the
 * file keeps whatever order it has until one of the two is used.
 */
const ORDER = [
  'display', 'position', 'inset', 'top', 'right', 'bottom', 'left', 'z-index',
  'flex-direction', 'flex-wrap', 'justify-content', 'align-items',
  'gap', 'column-gap', 'row-gap',
  'margin', 'margin-inline', 'margin-block',
  'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
  'padding', 'padding-inline', 'padding-block',
  'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
  'width', 'min-width', 'max-width', 'height', 'min-height', 'max-height',
  'font-family', 'font-size', 'font-weight', 'line-height', 'text-align',
  'text-transform', 'text-decoration-line', 'font-style',
  'color', 'background-color', 'border-color', 'border-radius',
  'fill', 'stroke', 'outline-color', 'overflow',
];

function rankOf(name) {
  const property = propertyOf(name);

  if (!property) {
    return -1;
  }

  const at = ORDER.indexOf(property);

  return at === -1 ? ORDER.length : at;
}

/**
 * Sort every class on the tag, in the file.
 *
 * `{{ … }}` classes and the `[ … ]` scope keep their places: one cannot be
 * ranked and the other is the CSS pane's, not Tailwind's. Variants stay
 * together in the order they first appear, with the bare ones first.
 */
export function twSortClasses(win) {
  if (locked()) {
    return;
  }

  const current = currentValue();

  if (!current) {
    return;
  }

  const parsed = groupClassTokens(current.value);
  const items = parsed.groups.flatMap((group) => group.items).filter((item) => !item.dynamic);

  if (items.length < 2) {
    return;
  }

  const groupAt = new Map();

  parsed.groups.forEach((group, index) => groupAt.set(group.key, group.key === '' ? -1 : index));

  const sorted = [...items].sort((a, b) => {
    const left = groupAt.get(a.variants.join(':')) ?? 0;
    const right = groupAt.get(b.variants.join(':')) ?? 0;

    return left - right || rankOf(a.name) - rankOf(b.name) || a.name.localeCompare(b.name);
  });

  const slots = [...items].sort((a, b) => a.from - b.from).map((item) => ({ from: item.from, to: item.to }));
  const next = reorderTokens(current.value, slots, sorted.map((item) => item.raw));

  if (next !== current.value) {
    commit(win, current.html, next);
  }
}

/** The CSS property a utility sets, or '' when the catalog has never met it. */
function propertyOf(name) {
  return familyFor(name, model)?.label || '';
}

/**
 * The tag's classes as the file has them this instant.
 *
 * Read from the source, not from the last draw: the icon row asks between
 * renders, and a stale answer is how the second click on a family appends
 * `p-400` next to `p-800` instead of replacing it.
 */
function currentChips(value) {
  return groupClassTokens(value).groups.flatMap((group) => group.items);
}

/** The tag's classes under the variant now selected. */
function variantChips(value) {
  const key = variantKey();

  return currentChips(value).filter(
    (chip) => !chip.dynamic && chip.variants.join(':') === key
  );
}

/**
 * Set one utility on the picked tag.
 *
 * Same family, same slot: `p-400` replaces `p-800`, it does not join it. The
 * class already there is toggled off instead, so the icon row's second click
 * takes it away again.
 */
/**
 * What `twSetClass` would write: same family, same slot — `p-400` replaces
 * `p-800` — and the class already there is toggled off.
 */
function setClassValueWith(value, name) {
  const property = propertyOf(name);
  const existing = variantChips(value).find(
    (chip) => chip.name === name || (property && propertyOf(chip.name) === property)
  );

  if (existing?.name === name) {
    return replaceToken(value, existing, '');
  }

  if (existing) {
    return replaceToken(value, existing, buildClass({
      variants: existing.variants,
      name,
      modifier: existing.modifier,
      important: existing.important,
    }));
  }

  return appendToken(value, buildClass({ variants: variantList(), name, modifier: '', important: '' }));
}

export function twSetClass(win, name) {
  if (locked() || !name) {
    return;
  }

  const current = currentValue();

  if (!current) {
    return;
  }

  commit(win, current.html, setClassValueWith(current.value, name));
}

/** The icon row's menu: the row under the marker, shown as `twSetClass` would write it. */
function previewSet(win, name) {
  const current = name && !locked() ? currentValue() : null;

  if (!current) {
    sendPreview(win, null);

    return;
  }

  const value = setClassValueWith(current.value, name);

  sendPreview(win, value === current.value ? null : { path: node.path, value });
}

/**
 * The tag's class value with `typed` added, the way `twAddClass` writes it.
 *
 * One per family, per variant: picking `bg-white` when `bg-primary-600` is
 * already there should be a change of background, not a second one. A name
 * the catalog does not know — a composition, one of the site's own — has no
 * family to collide with and simply joins the others. The variant picked in
 * the strip goes in front unless the name brings its own.
 *
 * @returns {{ value: string, changed: boolean }}
 */
function classValueWith(value, typed) {
  const prefix = variantKey();
  const raw = prefix && !typed.includes(':') ? `${prefix}:${typed}` : typed;
  const chips = currentChips(value);

  if (chips.some((chip) => chip.raw === raw)) {
    return { value, changed: false };
  }

  const { variants, base } = splitClass(raw);
  const property = propertyOf(splitUtility(base).name);
  const key = variants.join(':');
  const existing = property
    ? chips.find(
      (chip) => !chip.dynamic && chip.variants.join(':') === key && propertyOf(chip.name) === property
    )
    : null;

  return {
    value: existing ? replaceToken(value, existing, raw) : appendToken(value, raw),
    changed: true,
  };
}

export function twAddClass(win, raw) {
  const typed = String(raw || '').trim();

  if (locked() || !typed) {
    return;
  }

  const current = currentValue();

  if (!current) {
    return;
  }

  const next = classValueWith(current.value, typed);

  if (!next.changed) {
    return;
  }

  commit(win, current.html, next.value);
}

/**
 * Show what the add list is on, before it is picked.
 *
 * The painting is the paint script's (dock-instant-preview.js, listening for
 * `sve:tw-preview`): it holds the tag's would-be class value on the live
 * elements, and the rule comes from the same compiler as a save. Here is
 * only the answer to "what would Enter write" — the one place that knows,
 * so hover and Enter cannot disagree. A row always previews; typed text
 * previews once it is a class the catalog can compile.
 */
function previewAdd(win, name, listed) {
  const typed = String(name || '').trim();
  const current = typed && !locked() ? currentValue() : null;

  if (!current || (!listed && !model?.catalog?.resolve(typed))) {
    sendPreview(win, null);

    return;
  }

  const next = classValueWith(current.value, typed);

  sendPreview(win, next.changed ? { path: node.path, value: next.value } : null);
}

/** The pick is about to be written: the paint script keeps what it shows and forgets the hold. */
function keepPreview(win) {
  sendPreview(win, { keep: true });
}

function sendPreview(win, detail) {
  win.document.dispatchEvent(new win.CustomEvent(EVENT.TW_PREVIEW, { detail }));
}

/** What `applyChip` would write for this chip, or null when the file moved under it. */
function chipValueWith(current, chip, nextName) {
  if (current.value.slice(chip.from, chip.to) !== chip.raw) {
    return null;
  }

  const nextRaw = nextName
    ? buildClass({
      variants: chip.variants,
      name: nextName,
      modifier: chip.modifier,
      important: chip.important,
    })
    : '';

  return replaceToken(current.value, chip, nextRaw);
}

function applyChip(win, chip, nextName) {
  if (locked()) {
    return;
  }

  const current = currentValue();
  const value = current ? chipValueWith(current, chip, nextName) : null;

  if (value == null) {
    render(win);

    return;
  }

  commit(win, current.html, value);
}

/** The chip's menu: the row under the marker, shown as `applyChip` would write it. */
function previewChip(win, chip, label) {
  const current = label && !locked() ? currentValue() : null;
  const value = current ? chipValueWith(current, chip, label) : null;

  sendPreview(win, value == null || value === current.value ? null : { path: node.path, value });
}

/* ------------------------------------------------------------------ *
 * What the dock's icon row asks
 * ------------------------------------------------------------------ */

/**
 * Change the tag itself.
 *
 * The path a node is found by carries its tag name, so after a rename it no
 * longer matches. The opening offset does not move, though, so that is what
 * the node is found by again.
 */
export function twSetTag(win, name) {
  if (locked() || !node) {
    return;
  }

  const html = ask('dock:html');

  if (typeof html !== 'string' || html[node.from] !== '<') {
    return;
  }

  const next = renameTag(html, node, name);

  if (next === html) {
    return;
  }

  const at = node.from;

  ask('dock:set-html', next);

  const rows = flattenHtmlTree(parseHtmlTree(next), new Set());
  const row = rows.find((item) => item.from === at);

  if (row) {
    node = { from: row.from, openTo: row.openTo, path: row.path, tag: row.tag };
  }

  render(win);
  emit('tw:changed');
}

/**
 * The same menu for a row in the tree.
 *
 * It works on the row it was opened from and leaves the panel's own picked
 * tag alone — changing a tag in the tree should not move what the class list
 * is looking at.
 */
export function twOpenTagMenuAt(win, anchor, target) {
  if (!target?.tag) {
    return;
  }

  openMenu(win, anchor, TwTagMenu, {
    label: t(win, 'tw_tag'),
    placeholder: t(win, 'tw_tag_placeholder'),
    current: String(target.tag).toLowerCase(),
    tags: TAGS,
    onPick: (name) => {
      renameAt(win, target, name);
      closeTwMenu(win);
    },
  });
}

function renameAt(win, target, name) {
  if (ask('dock:is-locked') === true) {
    return;
  }

  const html = ask('dock:html');

  if (typeof html !== 'string' || html[target.from] !== '<') {
    return;
  }

  const next = renameTag(html, target, name);

  if (next !== html) {
    ask('dock:set-html', next);
  }
}

export function twOpenTagMenu(win, anchor) {
  openMenu(win, anchor, TwTagMenu, {
    label: t(win, 'tw_tag'),
    placeholder: t(win, 'tw_tag_placeholder'),
    current: (node?.tag || '').toLowerCase(),
    tags: TAGS,
    onPick: (name) => {
      twSetTag(win, name);
      closeTwMenu(win);
    },
  });
}

/**
 * Put the shown classes in a new order.
 *
 * Only the slots the reader can see are rewritten — a class hidden by the
 * size filter keeps its place in the file, so dragging under one filter does
 * not quietly shuffle what another one shows.
 */
export function twReorder(win, ids) {
  if (locked()) {
    return;
  }

  const current = currentValue();

  if (!current) {
    return;
  }

  const picked = ids.map((id) => chips.get(id)).filter(Boolean);

  if (picked.length < 2) {
    return;
  }

  const slots = [...picked].sort((a, b) => a.from - b.from).map((chip) => ({ from: chip.from, to: chip.to }));
  const next = reorderTokens(current.value, slots, picked.map((chip) => chip.raw));

  if (next === current.value) {
    return;
  }

  commit(win, current.html, next);
}

export function twHideOverlay(win) {
  hideTwOverlay(win);
}

/** Draw the strip again — the toolbar calls this after switching it on. */
export function twRepaintOverlay(win) {
  paintTwOverlay(win, node?.path || '');
}

export function twHasNode() {
  return !!node;
}

export function twVariant() {
  return variantKey();
}

/**
 * Picking a size here moves the preview's own device buttons with it.
 *
 * Through the toolbar's own door, so whatever it does besides resizing — it
 * files the block order under the size being left — still happens. The device
 * change comes back as `lp:device`, which is what actually sets the row, so
 * the two can never show different sizes.
 */
function setBreakpoint(win, index) {
  const item = BREAKPOINTS(win)[index];

  if (!item) {
    return;
  }

  ask('lp:set-device', { win, key: item.device });

  bpManual = !item.all;
  variantBp = item.key;
  closeTwMenu(win);
  render(win);
  emit('tw:changed');
}

/**
 * States and prose variants in one popup — the Insert data one, with a tab
 * for each and a search field. The first row of the states tab clears the
 * state; a prose variant is picked the same way and written the same way.
 */
function openStateMenu(win, anchor) {
  const none = t(win, 'tw_state_none');
  const known = new Set([...STATES.filter(Boolean), ...PROSE_VARIANTS]);

  openMenu(win, anchor, CodeDockDataVars, {
    title: t(win, 'tw_state'),
    placeholder: t(win, 'tw_state_search'),
    emptyText: t(win, 'data_vars_empty'),
    noSectionText: t(win, 'data_vars_empty'),
    loopText: '',
    tabs: [
      { id: 'state', label: t(win, 'tw_state') },
      { id: 'prose', label: t(win, 'tw_prose') },
    ],
    data: {
      state: [
        { var: none, id: '' },
        ...STATES.filter(Boolean).map((key) => ({ var: key, id: key, value: key === variantState ? '●' : '' })),
      ],
      prose: PROSE_VARIANTS.map((key) => ({ var: key, id: key, value: key === variantState ? '●' : '' })),
    },
    onPick: (row) => {
      variantState = known.has(row.id) ? row.id : '';
      closeTwMenu(win);
      render(win);
      emit('tw:changed');
    },
  });
  win.document.getElementById(MENU_ID)?.setAttribute('data-sve-data-menu', '');
}

/**
 * The preview's device buttons move the size back under their own control.
 * A reader who picked `xl` by hand and then clicks the tablet means the
 * tablet — the hand-picked size was for the size they were looking at.
 */
on('lp:device', () => {
  bpManual = false;

  if (twClassesHost(window.document)) {
    render(window);
  }
});

/** The class this tag has for a CSS property, for painting a tool active. */
export function twActiveClass(property) {
  const current = property ? currentValue() : null;

  if (!current) {
    return '';
  }

  return variantChips(current.value).find((chip) => propertyOf(chip.name) === property)?.name || '';
}

export function twOpenToolMenu(win, anchor, property, after) {
  const options = optionsForProperty(property, model);

  if (!options.length) {
    return;
  }

  const active = twActiveClass(property);

  openMenu(win, anchor, TwClassMenu, {
    title: property,
    removeLabel: t(win, 'tw_classes_remove'),
    searchPlaceholder: t(win, 'tw_filter_placeholder'),
    options: optionRows(win, options, active),
    onPreview: (label) => previewSet(win, label),
    onPick: (label) => {
      keepPreview(win);
      twSetClass(win, label);
      closeTwMenu(win);
      after?.(label);
    },
    onRemove: () => {
      keepPreview(win);

      if (active) {
        twSetClass(win, active);
      }

      closeTwMenu(win);
      after?.('');
    },
  });
}

/**
 * The same scale, as CSS values rather than as class names.
 *
 * The CSS row and the Tailwind row offer the same choices because they read
 * the same `@theme` — the difference is only what a click writes. `text-400`
 * and `font-size: var(--text-400)` are the same decision said twice, and a
 * panel that offered different scales depending on which language you were in
 * would be a panel that made you learn the site twice.
 *
 * Empty until the theme has been fetched; `twWantFamilies` starts that.
 *
 * @returns {Array<{label: string, value: string, color: string}>}
 */
export function twValueOptions(win, property) {
  const seen = new Set();
  const out = [];

  for (const option of optionsForProperty(property, model) || []) {
    const css = String(option.css || '');
    const colon = css.indexOf(':');

    if (colon === -1) {
      continue;
    }

    const value = css.slice(colon + 1).replace(/;+\s*$/, '').trim();

    if (!value || seen.has(value)) {
      continue;
    }

    seen.add(value);
    out.push({
      label: value,
      value,
      color: option.color || resolveVarColor(win, varName(css)) || '',
    });
  }

  return out;
}

/** Make sure the theme is on its way, for a panel that is about to need it. */
export function twWantFamilies(win) {
  wantModel(win);
}

/** The site's own compositions and utilities, fetched once per session. */
let siteClasses = [];
let siteClassesWanted = false;

// site.css was saved: the model and the swatches were read from the old theme.
// Drop them and, with a tag selected, redraw — wantModel() loads the new ones.
if (typeof window !== 'undefined') {
  window.addEventListener('sve:site-css-saved', () => {
    model = null;
    modelWanted = false;
    colorCache.clear();

    if (node) {
      render(window);
    }
  });
}

function wantSiteClasses(win) {
  if (siteClassesWanted) {
    return;
  }

  siteClassesWanted = true;

  void win
    .fetch('/!/sve/site-css/classes', {
      credentials: 'same-origin',
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
    })
    .then((res) => (res.ok ? res.json() : { groups: [] }))
    .then((data) => {
      siteClasses = Array.isArray(data?.groups) ? data.groups : [];
      // Onto the store as well: a menu already open reads from there and
      // fills in when this lands, instead of staying empty until reopened.
      twUi.siteClasses = siteClasses;
    })
    .catch(() => {
      siteClassesWanted = false;
    });
}

export function twOpenAddMenu(win, anchor) {
  wantSiteClasses(win);

  openMenu(win, anchor, TwAddClass, {
    label: t(win, 'tw_add_class'),
    placeholder: t(win, 'tw_add_placeholder'),
    emptyText: t(win, 'tw_add_empty'),
    offText: t(win, 'tw_class_not_imported'),
    sitePlaceholder: t(win, 'tw_add_placeholder_site'),
    siteLabel: t(win, 'tw_add_site'),
    tailwindLabel: t(win, 'tw_add_tailwind'),
    search: (typed) => {
      const raw = String(typed || '').trim();
      const query = raw.toLowerCase();

      if (!query || !model) {
        return [];
      }

      const catalog = model.catalog;

      // `p` has to reach `p-100` before `uppercase`: a name that starts with
      // what was typed comes first, and only then the ones that merely
      // contain it. Without that the cut at 40 was all coincidence.
      const starts = [];
      const contains = [];

      for (let i = 0; i < catalog.names.length; i++) {
        const name = catalog.lower[i];

        if (name.startsWith(query)) {
          if (starts.length < 40) {
            starts.push(catalog.names[i]);
          }
        } else if (contains.length < 40 && name.includes(query)) {
          contains.push(catalog.names[i]);
        }
      }

      starts.sort((a, b) => a.length - b.length);

      const names = [...starts, ...contains].slice(0, 40);

      // Tailwind's grammar reaches past any list: `w-[37px]`, `bg-primary/50`,
      // `md:flex`, `grid-cols-5!`. When what was typed compiles, it belongs at
      // the top — the way out of "no match" should be a row you can see the
      // CSS of, not a leap of faith.
      if (!names.includes(raw) && catalog.resolve(raw)) {
        names.unshift(raw);
      }

      return catalog.rows(names).map((item) => ({
        label: item.label,
        css: item.css,
        color: item.color,
        active: false,
      }));
    },
    // Left open on purpose: adding three classes should not mean opening the
    // menu and retyping the search three times. Escape or a click outside
    // closes it.
    onPreview: (name, listed) => previewAdd(win, name, listed),
    onAdd: (value) => {
      keepPreview(win);
      twAddClass(win, value);
    },
  });
}

/* ------------------------------------------------------------------ *
 * The chip list
 * ------------------------------------------------------------------ */

function onChip(win, event, id) {
  const chip = chips.get(id);

  if (!chip || chip.locked) {
    return;
  }

  if (openChipId === id) {
    closeTwMenu(win);
    paint();

    return;
  }

  const family = familyFor(chip.name, model);

  openMenu(win, event.currentTarget, TwClassMenu, {
    title: family?.label || '',
    removeLabel: t(win, 'tw_classes_remove'),
    searchPlaceholder: t(win, 'tw_filter_placeholder'),
    options: optionRows(win, family?.options, chip.name),
    onPreview: (label) => previewChip(win, chip, label),
    onPick: (label) => {
      keepPreview(win);
      applyChip(win, chip, label);
      closeTwMenu(win);
    },
    onRemove: () => {
      keepPreview(win);
      applyChip(win, chip, '');
      closeTwMenu(win);
    },
  });

  openChipId = id;
  paint();
}

function paint() {
  for (const group of twUi.groups) {
    for (const chip of group.chips) {
      chip.open = chip.id === openChipId;
    }
  }
}

/**
 * @param {object|null} row a flattened html-tree row, or null for no selection
 */
export function renderTwClasses(win, row) {
  if (!row || row.from == null || row.openTo == null) {
    node = null;
    chips = new Map();
    closeTwMenu(win);
    render(win);

    return;
  }

  node = { from: row.from, openTo: row.openTo, path: row.path, tag: row.tag };
  render(win);
}

function render(win) {
  // The store is filled whether or not the pane is on screen — it is state,
  // not a drawing. Only the mount waits for a host.
  wantModel(win);

  const current = node ? currentValue() : null;
  const parsed = current ? groupClassTokens(current.value) : { scope: null, groups: [] };

  chips = new Map();

  twUi.baseLabel = t(win, 'tw_size_base');
  twUi.scopeTitle = t(win, 'tw_classes_scope');
  twUi.dropTitle = t(win, 'tw_classes_remove');
  twUi.variant = variantKey();
  twUi.onBreakpoint = (index) => setBreakpoint(win, index);
  twUi.onState = (event) => openStateMenu(win, event.currentTarget);
  const filtering = filterBySize();

  // The button says what gets written, because that is what ends up in the
  // file and what has to be recognised again later. The hover says which
  // screen that is, in the words the responsive field uses.
  // The button says the screen; the hover says the prefix it writes, so the
  // class in the file can still be recognised later.
  twUi.breakpoints = BREAKPOINTS(win).map((item, index) => ({
    index,
    label: item.label,
    title: item.under
      ? `${item.key}:  ·  < ${item.under}px`
      : t(win, item.all ? 'tw_size_all_title' : 'tw_size_base_title'),
    active: item.all ? !filtering : filtering && item.key === activeBp(),
  }));
  twUi.state = variantState;
  twUi.stateLabel = variantState || t(win, 'tw_state');
  twUi.canEdit = !locked();
  twUi.onChip = (event, id) => onChip(win, event, id);
  twUi.onTag = (event) => twOpenTagMenu(win, event.currentTarget);
  twUi.sortTitle = t(win, 'tw_sort');
  twUi.onSort = () => twSortClasses(win);
  twUi.onDrop = (id) => {
    const chip = chips.get(id);

    if (chip && !chip.locked) {
      closeTwMenu(win);
      applyChip(win, chip, '');
    }
  };
  twUi.tag = node?.tag || '';
  // `[ ]` with nothing in it is a scope nobody has named yet — not worth a
  // line in a panel meant to show what this tag actually has.
  const scope = parsed.scope?.label || '';

  twUi.scope = /^\[\s*\]$/.test(scope) ? '' : scope;
  twUi.emptyText = t(
    win,
    !node ? 'tw_classes_pick' : parsed.groups.length ? 'tw_classes_none_size' : 'tw_classes_none'
  );
  twUi.groups = parsed.groups.filter((group) => groupInSize(group.key)).map((group) => ({
    key: group.key,
    current: group.key === twUi.variant,
    chips: group.items.map((item, index) => {
      const chip = {
        ...item,
        id: `${group.key}-${index}-${item.from}`,
        locked: item.dynamic || !twUi.canEdit,
        open: false,
        color: item.dynamic ? '' : chipColor(win, item.name),
        title: item.dynamic
          ? t(win, 'tw_classes_dynamic')
          : cssFor(item.name, model) || item.raw,
      };

      chips.set(chip.id, chip);

      return chip;
    }),
  }));

  const host = twClassesHost(win.document);

  if (host) {
    ensureStyles(win.document);
    mountPane(host, TwClassList);
  }

  paint();
  paintTwOverlay(win, node?.path || '');
  emit('tw:changed');
}

/**
 * The theme catalog is one fetch, and the chips are useful without it — a
 * class reads the same either way. So draw first, then redraw once the site's
 * own scale is here and the menus have something to offer.
 */
function wantModel(win) {
  if (model || modelWanted) {
    return;
  }

  modelWanted = true;

  void loadFamilies(win)
    .then((next) => {
      model = next;
      render(win);
    })
    .catch(() => {
      modelWanted = false;
    });
}
