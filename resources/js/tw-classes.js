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
import { HT_PATH_ATTR } from './html-pick-align.js';
import { groupClassTokens } from './tw-parse.js';
import { dataStateLabel, withGroup } from './lib/data-states.js';
import { groupHost } from './lib/group-host.js';
import { cssFor, familyFor, loadFamilies } from './tw-families.js';
import { twUi } from './cp/tailwind/store.js';
import TwClassList from './cp/surfaces/TwClassList.vue';
import TwClassMenu from './cp/surfaces/TwClassMenu.vue';
import { twState } from './tw-classes/state.js';
import { closeTwMenu, openMenu, openStateMenu, optionRows, twOpenTagMenu, variantState } from './tw-classes/menus.js';
import { applyChip, keepPreview, locked, previewChip, twSortClasses } from './tw-classes/ops.js';
import { chipColor, colorCache, currentValue, nodeFor, resolveComponentParam } from './tw-classes/resolve.js';
import { ensureStyles } from './tw-classes/styles.js';

export * from './tw-classes/styles.js';
export * from './tw-classes/resolve.js';
export * from './tw-classes/menus.js';
export * from './tw-classes/ops.js';

export const MENU_ID = '__sve-tw-menu';

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
 * state, write a class — they work exactly like `hover`. Picking one gives
 * `group` to the element around the tag that repeats — the card, the list
 * item — or else its parent (lib/group-host.js), unless one there wears it.
 */
export const STATES = ['', 'dark', 'hover', 'focus', 'active', 'group-hover', 'group-focus', 'before', 'after'];

/**
 * The typography plugin's element variants: `prose-p:text-400` styles every
 * paragraph the element holds. Picked like a state, written the same way.
 */
export const PROSE_VARIANTS = [
  'prose-headings',
  'prose-lead',
  'prose-h1',
  'prose-h2',
  'prose-h3',
  'prose-h4',
  'prose-h5',
  'prose-h6',
  'prose-p',
  'prose-a',
  'prose-blockquote',
  'prose-figure',
  'prose-figcaption',
  'prose-strong',
  'prose-em',
  'prose-kbd',
  'prose-code',
  'prose-pre',
  'prose-ol',
  'prose-ul',
  'prose-li',
  'prose-table',
  'prose-thead',
  'prose-tr',
  'prose-th',
  'prose-td',
  'prose-img',
  'prose-video',
  'prose-hr',
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
export function variantList() {
  return [activeBp(), variantState].filter(Boolean);
}

export function variantKey() {
  return variantList().join(':');
}

/**
 * Anything shaped like a screen size: ours, Tailwind's own min-width set, or
 * the arbitrary `max-[900px]` a self-chosen boundary has to be written as —
 * Tailwind's scale has five steps, and a site's list need not land on them.
 * A container size (`@max-md`, `twSetContainerSize`) takes the same slot, so
 * it groups and filters the same way — and so does one written by hand:
 * `@md`, `@min-[30rem]`, `@max-md/card` (build-mode/container-query.js
 * `isContainerVariant`). `@container` itself is a class, not a size.
 */
const BP_SHAPED =
  /^(max-)?(sm|md|lg|xl|2xl)$|^(max|min)-\[[^\]]+\]$|^@(?!container(?:$|\/))(?:(?:min|max)-)?(?:[a-z0-9]+|\[[^\]]+\])(?:\/[\w-]+)?$/;

/** The screen size a group belongs to — `max-lg:hover` belongs to `max-lg`. */
function groupBp(key) {
  return (
    String(key || '')
      .split(':')
      .find((part) => BP_SHAPED.test(part)) || ''
  );
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

let chips = new Map();
export let model = null;
let modelWanted = false;

export function twClassesHost(doc) {
  return doc?.querySelector?.('[data-sve-style="tw"] [data-sve-tw-host]') || null;
}

export function twHasNode() {
  return !!twState.node && !(twState.node.component && !twState.node.param);
}

export function twVariant() {
  return variantKey();
}

/**
 * What the pane reads and writes instead of the tag's class attribute: an open
 * class (dock/class-target.js), the classes a utility is made of. The
 * pane's reading and writing all pass `currentValue` and `commit`, so every
 * menu, chip and tool works on it unchanged. `{ value, write(value),
 * preview(value) }`, or null for the tag again.
 */
export let classTarget = null;

/** The pane's list drawn again: for a reader with no host of its own (Build's Style), and for class-target.js. */
export function twRefresh(win) {
  render(win);
}

export function twSetClassTarget(win, target) {
  classTarget = target;
  closeTwMenu(win);
  render(win);
}

/**
 * What knows more about a class than the pane does: dock/class-target.js.
 * `mark(raw)` says `{ site, closed, chosen }`, `picking()` says a click chooses,
 * and `take(raw)` is true when it took the click, so the pane's menu stays shut.
 */
let chipHost = null;

export function twSetChipHost(win, host) {
  chipHost = host;
  render(win);
}

/** A size picked, not All: the base size writes no variant, so `twVariant` cannot tell Desktop from All. */
export function twSizePicked() {
  return filterBySize();
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
 * A container size picked in Style's container row (`@max-md` — the container
 * query demo, build-mode/container-query.js): what new classes are written
 * under, in the slot a breakpoint takes, so the two are one at a time. The
 * preview keeps its device — a container's width is not the screen's. `''`
 * gives the slot back to the device buttons, as `lp:device` does.
 */
export function twSetContainerSize(win, variant) {
  variantBp = variant || '';
  bpManual = !!variant;
  closeTwMenu(win);
  render(win);
  emit('tw:changed');
}

/** The container size new classes are written under, or ''. */
export function twContainerSize() {
  const bp = activeBp();

  return bp.startsWith('@') ? bp : '';
}

/**
 * The element starting at `from` given the class `group`, so a
 * `group-data-[…]` state under it holds. Nothing when it has one, or the file
 * is locked. It stands before the pick, so the pick's offsets move with it —
 * or, `write` given (Build: `port.writeMoved`), the writer keeps the pick.
 */
export function giveGroup(from, write = null) {
  const html = ask('dock:html');
  const next = typeof html === 'string' && !locked() ? withGroup(html, from) : html;

  if (next === html) {
    return;
  }

  if (write) {
    write(next);

    return;
  }

  ask('dock:set-html', next);

  if (twState.node && twState.node.from > from) {
    const shift = next.length - html.length;

    twState.node = { ...twState.node, from: twState.node.from + shift, openTo: twState.node.openTo + shift };
  }
}

/**
 * `group-hover` / `group-focus` picked: `group` on the element around the
 * picked tag that repeats, or its parent (lib/group-host.js). Nothing for a
 * component call, or a tag with nothing around it.
 */
export function giveGroupAround(write = null) {
  const html = ask('dock:html');
  const from =
    twState.node && !twState.node.component && typeof html === 'string' ? groupHost(html, twState.node.from) : null;

  if (from !== null) {
    giveGroup(from, write);
  }
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

// site.css was saved: the model and the swatches were read from the old theme.
// Drop them and, with a tag selected, redraw — wantModel() loads the new ones.
if (typeof window !== 'undefined') {
  window.addEventListener('sve:site-css-saved', () => {
    model = null;
    modelWanted = false;
    colorCache.clear();

    if (twState.node) {
      render(window);
    }
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

  if (chipHost?.take(chip.raw)) {
    closeTwMenu(win);

    return;
  }

  if (twState.openChipId === id) {
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

  twState.openChipId = id;
  paint();
}

export function paint() {
  for (const group of twUi.groups) {
    for (const chip of group.chips) {
      chip.open = chip.id === twState.openChipId;
    }
  }
}

/**
 * @param {object|null} row a flattened html-tree row, or null for no selection
 */
export function renderTwClasses(win, row) {
  if (!row || row.from == null || row.openTo == null) {
    twState.node = null;
    chips = new Map();
    closeTwMenu(win);
    render(win);

    return;
  }

  const same =
    twState.node?.component &&
    row.kind === 'component' &&
    twState.node.from === row.from &&
    twState.node.src === row.src;

  twState.node = same ? { ...twState.node, openTo: row.to, path: row.path } : nodeFor(row);

  // Every time, not only on a new pick: a parameter typed into the call by
  // hand is what the call says now.
  if (twState.node.component) {
    resolveComponentParam(win);
  }

  render(win);
}

export function render(win) {
  // The store is filled whether or not the pane is on screen — it is state,
  // not a drawing. Only the mount waits for a host.
  wantModel(win);

  const current = twState.node ? currentValue() : null;
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
  twUi.stateLabel = dataStateLabel(variantState) || variantState || t(win, 'tw_state');
  twUi.canEdit = !locked();
  twUi.picking = !!chipHost?.picking();
  twUi.onChip = (event, id) => onChip(win, event, id);
  // A component's name is not a tag to change.
  twUi.onTag = twState.node?.component ? null : (event) => twOpenTagMenu(win, event.currentTarget);
  twUi.sortTitle = t(win, 'tw_sort');
  twUi.onSort = () => twSortClasses(win);
  twUi.onDrop = (id) => {
    const chip = chips.get(id);

    if (chip && !chip.locked) {
      closeTwMenu(win);
      applyChip(win, chip, '');
    }
  };
  twUi.tag = twState.node?.tag || '';
  // `[ ]` with nothing in it is a scope nobody has named yet — not worth a
  // line in a panel meant to show what this tag actually has.
  const scope = parsed.scope?.label || '';

  twUi.scope = /^\[\s*\]$/.test(scope) ? '' : scope;
  twUi.emptyText = t(
    win,
    !twState.node
      ? 'tw_classes_pick'
      : twState.node.component && twState.node.param === null
        ? 'tw_classes_component_none'
        : twState.node.component && twState.node.param && !current
          ? 'tw_classes_component_bound'
          : parsed.groups.length
            ? 'tw_classes_none_size'
            : 'tw_classes_none'
  );
  twUi.groups = parsed.groups
    .filter((group) => groupInSize(group.key))
    .map((group) => ({
      key: group.key,
      current: group.key === twUi.variant,
      chips: group.items.map((item, index) => {
        const chip = {
          ...item,
          ...(item.dynamic ? null : chipHost?.mark(item.raw)),
          id: `${group.key}-${index}-${item.from}`,
          locked: item.dynamic || !twUi.canEdit,
          open: false,
          color: item.dynamic ? '' : chipColor(win, item.name),
          title: item.dynamic ? t(win, 'tw_classes_dynamic') : cssFor(item.name, model) || item.raw,
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
export function wantModel(win) {
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
