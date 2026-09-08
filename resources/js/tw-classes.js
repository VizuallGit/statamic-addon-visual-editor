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

import { t } from './cp-t.js';
import { chromeGet } from './chrome-prefs.js';
import { ask, emit, on } from './cp/bus.js';
import { mountPane } from './cp/mount-pane.js';
import { mountSurface } from './cp/mount.js';
import { HT_PATH_ATTR } from './html-pick-align.js';
import { flattenHtmlTree, parseHtmlTree } from './html-tree-parse.js';
import {
  appendToken,
  buildClass,
  groupClassTokens,
  readClassAttr,
  replaceToken,
  writeClassValue,
} from './tw-parse.js';
import { colorFor, cssFor, familyFor, loadFamilies } from './tw-families.js';
import { twUi } from './cp/tailwind/store.js';
import TwClassList from './cp/surfaces/TwClassList.vue';
import TwClassMenu from './cp/surfaces/TwClassMenu.vue';
import TwAddClass from './cp/surfaces/TwAddClass.vue';

const MENU_ID = '__sve-tw-menu';
const STYLE_ID = '__sve-tw-style';

/**
 * Screen sizes stay in sight, because that is the axis you move along while
 * looking at a page. Everything else lives behind one menu.
 *
 * Largest first, and `max-` rather than Tailwind's default `min-`: this
 * project designs on the laptop and works downwards, the same direction the
 * responsive fieldtype and every `@media (width < …)` in the sections take.
 * Laptop is the rule and the smaller sizes are exceptions from it, so the
 * laptop is the bare class — not the phone.
 */
const BREAKPOINTS = [
  { key: '', all: true, device: 'Responsive', label: 'tw_size_all' },
  { key: '', device: 'Laptop', label: 'tw_size_base' },
  { key: 'max-lg', device: 'Tablet', word: 'responsive_tablet', under: 1024 },
  { key: 'max-md', device: 'Mobile', word: 'responsive_mobile', under: 768 },
];
const STATES = ['', 'dark', 'hover', 'focus', 'active', 'before', 'after'];

/**
 * Which size the preview's own device buttons mean.
 *
 * The same two boundaries `ResponsiveFieldtype` uses: tablet is everything
 * under 1024px and mobile everything under 768px, which is exactly what
 * `max-lg` and `max-md` compile to. Laptop is the base, with no prefix at
 * all, because that is where a section is designed.
 */
const DEVICE_BP = { Mobile: 'max-md', Tablet: 'max-lg', Laptop: '', Desktop: '' };

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
    return DEVICE_BP[chromeGet(window, 'sve-lp-device')] ?? '';
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

/** Anything shaped like a screen size, ours or Tailwind's own min-width set. */
const BP_SHAPED = /^(max-)?(sm|md|lg|xl|2xl)$/;

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
    return Object.prototype.hasOwnProperty.call(DEVICE_BP, chromeGet(window, 'sve-lp-device'));
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

  return !BREAKPOINTS.some((item) => item.key === bp);
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
  if (doc.getElementById(STYLE_ID)) {
    return;
  }

  const style = doc.createElement('style');

  style.id = STYLE_ID;
  style.textContent = `
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
    #${MENU_ID} [data-sve-tw-add-input] {
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
  `;
  doc.head.appendChild(style);
}

/**
 * Live preview, one frame ahead of the save.
 *
 * The dock writes the file and the page comes back rendered, which takes a
 * round trip. The picked element is already stamped with its template path,
 * so the same swap can be made in the frame straight away.
 */
function previewDoc(win) {
  const direct = win.document.getElementById('live-preview-iframe');

  if (direct) {
    return direct.contentDocument;
  }

  for (const el of win.document.querySelectorAll('iframe')) {
    try {
      const inner = el.contentDocument?.getElementById('live-preview-iframe');

      if (inner) {
        return inner.contentDocument;
      }
    } catch {
      /* cross-origin */
    }
  }

  return null;
}

function flipPreview(win, from, to) {
  const doc = previewDoc(win);

  if (!doc || !node?.path) {
    return;
  }

  for (const el of doc.querySelectorAll(`[${HT_PATH_ATTR}="${node.path}"]`)) {
    try {
      if (from) {
        el.classList.remove(from);
      }

      if (to) {
        el.classList.add(to);
      }
    } catch {
      /* not a class the DOM will take — the re-render has the truth */
    }
  }
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

  const doc = previewDoc(win);
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
  const below = rect.bottom + 4;
  const room = win.innerHeight - below - pad;
  const height = Math.max(min, Math.min(room, 420));

  menu.style.left = `${Math.max(pad, Math.min(rect.left, win.innerWidth - width - pad))}px`;
  menu.style.maxHeight = `${height}px`;
  menu.style.top = `${room >= min ? below : Math.max(pad, win.innerHeight - pad - height)}px`;
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
  placeMenu(win, anchor, menu);

  const reposition = () => placeMenu(win, anchor, menu);
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

function commit(win, html, nextValue, from, to) {
  const next = writeClassValue(html, node, nextValue);

  if (next === html) {
    return;
  }

  flipPreview(win, from, to);
  ask('dock:set-html', next);
  resyncNode(next);
  render(win);
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
export function twSetClass(win, name) {
  if (locked() || !name) {
    return;
  }

  const current = currentValue();

  if (!current) {
    return;
  }

  const property = propertyOf(name);
  const existing = variantChips(current.value).find(
    (chip) => chip.name === name || (property && propertyOf(chip.name) === property)
  );

  if (existing?.name === name) {
    commit(win, current.html, replaceToken(current.value, existing, ''), name, '');

    return;
  }

  if (existing) {
    const raw = buildClass({
      variants: existing.variants,
      name,
      modifier: existing.modifier,
      important: existing.important,
    });

    commit(win, current.html, replaceToken(current.value, existing, raw), existing.raw, raw);

    return;
  }

  const raw = buildClass({ variants: variantList(), name, modifier: '', important: '' });

  commit(win, current.html, appendToken(current.value, raw), '', raw);
}

/**
 * Whatever the reader typed or picked in the + menu.
 *
 * The selected variant goes in front — type `bg-primary-900` with `after`
 * picked and you get `after:bg-primary-900`. Write your own prefix and it is
 * left alone.
 */
export function twAddClass(win, raw) {
  const typed = String(raw || '').trim();
  const prefix = variantKey();
  const value = prefix && !typed.includes(':') ? `${prefix}:${typed}` : typed;

  if (locked() || !typed) {
    return;
  }

  const current = currentValue();

  if (!current) {
    return;
  }

  const already = currentChips(current.value).some((chip) => chip.raw === value);

  if (already) {
    return;
  }

  commit(win, current.html, appendToken(current.value, value), '', value.includes(':') ? '' : value);
}

function applyChip(win, chip, nextName) {
  if (locked()) {
    return;
  }

  const current = currentValue();

  if (!current || current.value.slice(chip.from, chip.to) !== chip.raw) {
    render(win);

    return;
  }

  const nextRaw = nextName
    ? buildClass({
      variants: chip.variants,
      name: nextName,
      modifier: chip.modifier,
      important: chip.important,
    })
    : '';

  commit(win, current.html, replaceToken(current.value, chip, nextRaw), chip.raw, nextRaw);
}

/* ------------------------------------------------------------------ *
 * What the dock's icon row asks
 * ------------------------------------------------------------------ */

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
  const item = BREAKPOINTS[index];

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

function openStateMenu(win, anchor) {
  openMenu(win, anchor, TwClassMenu, {
    title: t(win, 'tw_state'),
    removeLabel: t(win, 'tw_state_none'),
    options: STATES.filter(Boolean).map((key) => ({
      label: key,
      css: '',
      color: null,
      active: key === variantState,
    })),
    onPick: (key) => {
      variantState = STATES.includes(key) ? key : '';
      closeTwMenu(win);
      render(win);
      emit('tw:changed');
    },
    onRemove: () => {
      variantState = '';
      closeTwMenu(win);
      render(win);
      emit('tw:changed');
    },
  });
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
  const options = model?.byProperty.get(property) || [];

  if (!options.length) {
    return;
  }

  const active = twActiveClass(property);

  openMenu(win, anchor, TwClassMenu, {
    title: property,
    removeLabel: t(win, 'tw_classes_remove'),
    options: optionRows(win, options, active),
    onPick: (label) => {
      twSetClass(win, label);
      closeTwMenu(win);
      after?.(label);
    },
    onRemove: () => {
      if (active) {
        twSetClass(win, active);
      }

      closeTwMenu(win);
      after?.('');
    },
  });
}

/** The site's own compositions and utilities, fetched once per session. */
let siteClasses = [];
let siteClassesWanted = false;

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
      const query = String(typed || '').trim().toLowerCase();

      if (!query || !model) {
        return [];
      }

      return model.catalog.items
        .filter((item) => item.label.toLowerCase().includes(query))
        .slice(0, 40)
        .map((item) => ({ label: item.label, css: item.css, color: item.color, active: false }));
    },
    // Left open on purpose: adding three classes should not mean opening the
    // menu and retyping the search three times. Escape or a click outside
    // closes it.
    onAdd: (value) => {
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
    options: optionRows(win, family?.options, chip.name),
    onPick: (label) => {
      applyChip(win, chip, label);
      closeTwMenu(win);
    },
    onRemove: () => {
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
  twUi.variant = variantKey();
  twUi.onBreakpoint = (index) => setBreakpoint(win, index);
  twUi.onState = (event) => openStateMenu(win, event.currentTarget);
  const filtering = filterBySize();

  // The button says what gets written, because that is what ends up in the
  // file and what has to be recognised again later. The hover says which
  // screen that is, in the words the responsive field uses.
  twUi.breakpoints = BREAKPOINTS.map((item, index) => ({
    index,
    label: item.word ? `${item.key}` : t(win, item.label),
    title: item.word
      ? `${t(win, item.word)}  ·  < ${item.under}px`
      : t(win, item.all ? 'tw_size_all_title' : 'tw_size_base_title'),
    active: item.all ? !filtering : filtering && item.key === activeBp(),
  }));
  twUi.state = variantState;
  twUi.stateLabel = variantState || t(win, 'tw_state');
  twUi.canEdit = !locked();
  twUi.onChip = (event, id) => onChip(win, event, id);
  twUi.tag = node?.tag || '';
  twUi.scope = parsed.scope?.label || '';
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
