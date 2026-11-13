/**
 * tw-classes.js — changes to a class list (add, drop, replace, one of a set, sort, the tag).
 * Split out of tw-classes.js in the quality pass (tab G): the same statements, in the same
 * order; only the imports are new. tw-classes.js re-exports this file.
 */
import { ask, emit } from '../cp/bus.js';
import { flattenHtmlTree, parseHtmlTree } from '../html-tree-parse.js';
import {
  appendToken,
  buildClass,
  groupClassTokens,
  reorderTokens,
  replaceToken,
  splitClass,
  splitUtility,
  writeClassValue,
} from '../tw-parse.js';
import { coveredBy } from '../tw-covered.js';
import { retag } from '../lib/retag.js';
import { familyFor } from '../tw-families.js';
import { writeCallParam } from '../component-props.js';
import { EVENT } from '../lib/protocol.js';
import { twState } from './state.js';
import { componentCall, currentValue, nodeFor, tagValue } from './resolve.js';
import { classTarget, model, render, variantKey, variantList, wantModel } from '../tw-classes.js';

/* ------------------------------------------------------------------ *
 * Reading and writing the picked tag
 * ------------------------------------------------------------------ */

export function locked() {
  return !twState.node || (twState.node.component && !twState.node.param) || ask('dock:is-locked') === true;
}

/**
 * Offsets move as the file changes, so the picked tag is found again by its
 * path after every write. Without this a second click in a row would splice
 * into the wrong place whenever the first one changed the length of the tag.
 */
function resyncNode(html) {
  // A call is found again by where it starts (componentCall), and a write
  // inside it never moves that.
  if (!twState.node?.path || twState.node.component) {
    return;
  }

  const rows = flattenHtmlTree(parseHtmlTree(html), new Set());
  const row = rows.find((item) => item.path === twState.node.path);

  if (row) {
    twState.node = nodeFor(row);
  }
}

export function commit(win, html, nextValue) {
  if (classTarget) {
    classTarget.value = nextValue;
    classTarget.write(nextValue);
    render(win);

    return;
  }

  commitTag(win, html, nextValue);
}

/** The picked tag's class value written into the file, whatever the pane is working on. */
function commitTag(win, html, nextValue) {
  const call = twState.node.component ? componentCall(html) : null;
  const next = twState.node.component
    ? call
      ? writeCallParam(html, call, twState.node.param, nextValue)
      : html
    : writeClassValue(html, twState.node, nextValue);

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
  'display',
  'position',
  'inset',
  'top',
  'right',
  'bottom',
  'left',
  'z-index',
  'flex-direction',
  'flex-wrap',
  'justify-content',
  'align-items',
  'gap',
  'column-gap',
  'row-gap',
  'margin',
  'margin-inline',
  'margin-block',
  'margin-top',
  'margin-right',
  'margin-bottom',
  'margin-left',
  'padding',
  'padding-inline',
  'padding-block',
  'padding-top',
  'padding-right',
  'padding-bottom',
  'padding-left',
  'width',
  'min-width',
  'max-width',
  'height',
  'min-height',
  'max-height',
  'font-family',
  'font-size',
  'font-weight',
  'line-height',
  'text-align',
  'text-transform',
  'text-decoration-line',
  'font-style',
  'color',
  'background-color',
  'border-color',
  'border-radius',
  'fill',
  'stroke',
  'outline-color',
  'overflow',
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
  const next = reorderTokens(
    current.value,
    slots,
    sorted.map((item) => item.raw)
  );

  if (next !== current.value) {
    commit(win, current.html, next);
  }
}

/** The CSS property a utility sets, or '' when the catalog has never met it. */
export function propertyOf(name) {
  return familyFor(name, model)?.label || '';
}

/**
 * What a class takes the place of. Usually its property: `p-400` replaces
 * `p-800`. But `blur-sm` and `contrast-50` both print `filter`, and
 * `translate-x-4` and `translate-y-4` both print `translate`, while each only
 * sets its own part of it. Those two stand together, so their slot is the
 * utility as well as the property.
 */
const STACKED = new Set(['filter', 'backdrop-filter', 'transform', 'translate', 'scale']);

function slotOf(name) {
  const property = propertyOf(name);

  return STACKED.has(property) ? `${property} ${model?.catalog?.root(name) || name}` : property;
}

/**
 * The picked tag's class value in the file, with a class open or not: what
 * dock/class-target.js reads to know what the element carries. A read may come
 * between a change of the file and the render after it, so a stale pick is found
 * again by its path first.
 */
export function twTagClasses() {
  const html = ask('dock:html');

  if (twState.node && !twState.node.component && typeof html === 'string' && html[twState.node.from] !== '<') {
    resyncNode(html);
  }

  return tagValue()?.value || '';
}

/** The picked tag's class value back as it was: a class that could not be saved. */
export function twRestoreTag(win, value) {
  const current = locked() ? null : tagValue();

  if (current && current.value !== value) {
    commit(win, current.html, value);
  }
}

/** Where the picked tag is in the file's tree, '' with none. */
export function twPickedPath() {
  return twState.node?.path || '';
}

/** Whether Tailwind builds `name`, as far as the catalog has come. It is asked for here, and a render follows it. */
export function twIsTailwindClass(win, name) {
  if (!model) {
    wantModel(win);

    return false;
  }

  return model.catalog.has(name) || !!model.catalog.resolve(name);
}

/**
 * The picked tag's classes as the file has them, for a utility made of them
 * (dock/tw-utility.js). `{{ … }}` classes and the `[ … ]` scope are left out:
 * neither is a utility. Null without a pick, or while the file is locked.
 *
 * @returns {{ tag: string, raws: string[] }|null}
 */
export function twPickedClasses() {
  if (locked()) {
    return null;
  }

  const current = currentValue();

  if (!current) {
    return null;
  }

  return {
    tag: twState.node.component ? '' : String(twState.node.tag || ''),
    raws: currentChips(current.value)
      .filter((chip) => !chip.dynamic)
      .map((chip) => chip.raw),
  };
}

/**
 * `raws` off the picked tag, `name` where the first of them stood: the classes
 * a utility was made of, swapped for the utility. Everything else on the tag
 * stays where it is.
 */
export function twDropClass(win, raw) {
  if (locked()) {
    return;
  }

  const current = currentValue();
  const chip = current && currentChips(current.value).find((one) => !one.dynamic && one.raw === raw);

  if (chip) {
    commit(win, current.html, replaceToken(current.value, chip, ''));
  }
}

export function twReplaceClasses(win, raws, name) {
  if (locked() || !name) {
    return;
  }

  const current = currentValue();

  if (!current) {
    return;
  }

  const drop = new Set(raws);
  // From the end, so each swap leaves the offsets before it as they were.
  const chips = currentChips(current.value)
    .filter((chip) => !chip.dynamic && drop.has(chip.raw))
    .sort((a, b) => b.from - a.from);

  if (!chips.length) {
    return;
  }

  let next = current.value;

  chips.forEach((chip, index) => {
    next = replaceToken(next, chip, index === chips.length - 1 ? name : '');
  });

  commit(win, current.html, next);
}

/**
 * One of `set` on the picked tag, at every size: `name` in the place of the
 * one it wears, or after its classes; '' takes it off. Not the size or state
 * picked in Style — a Container's width (BuildContainerWidth.vue) is the
 * Container's, as its tag is.
 */
export function twSetOneOf(win, set, name) {
  const current = locked() ? null : tagValue();

  if (!current) {
    return;
  }

  const worn = currentChips(current.value)
    .filter((chip) => !chip.dynamic && set.includes(chip.raw))
    .sort((a, b) => b.from - a.from);
  let next = current.value;

  worn.forEach((chip, index) => {
    next = replaceToken(next, chip, index === worn.length - 1 ? name : '');
  });

  if (!worn.length && name) {
    next = appendToken(next, name);
  }

  if (next !== current.value) {
    commitTag(win, current.html, next);
  }
}

/**
 * The tag's classes as the file has them this instant.
 *
 * Read from the source, not from the last draw: the icon row asks between
 * renders, and a stale answer is how the second click on a family appends
 * `p-400` next to `p-800` instead of replacing it.
 */
export function currentChips(value) {
  return groupClassTokens(value).groups.flatMap((group) => group.items);
}

/** The tag's classes under the variant now selected. */
export function variantChips(value) {
  const key = variantKey();

  return currentChips(value).filter((chip) => !chip.dynamic && chip.variants.join(':') === key);
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
/**
 * `value` without the padding, margin and gap classes `name`, just written,
 * leaves with nothing to do: at the size and state being edited, as the rest of
 * a write is. A class marked `!` wins by itself, so it neither goes nor counts.
 */
export function withoutCovered(value, name) {
  const base = splitClass(name).base;
  const chips = variantChips(value).filter((chip) => !chip.important);
  const gone = new Set(
    chips.some((chip) => chip.name === base)
      ? coveredBy(
          chips.map((chip) => chip.name),
          base
        )
      : []
  );
  let next = value;

  chips
    .filter((chip) => gone.has(chip.name))
    .sort((a, b) => b.from - a.from)
    .forEach((chip) => {
      next = replaceToken(next, chip, '');
    });

  return next;
}

export function setClassValueWith(value, name) {
  const slot = slotOf(name);
  const existing = variantChips(value).find((chip) => chip.name === name || (slot && slotOf(chip.name) === slot));

  if (existing?.name === name) {
    return replaceToken(value, existing, '');
  }

  if (existing) {
    return withoutCovered(
      replaceToken(
        value,
        existing,
        buildClass({
          variants: existing.variants,
          name,
          modifier: existing.modifier,
          important: existing.important,
        })
      ),
      name
    );
  }

  return withoutCovered(
    appendToken(value, buildClass({ variants: variantList(), name, modifier: '', important: '' })),
    name
  );
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
export function previewSet(win, name) {
  const current = name && !locked() ? currentValue() : null;

  if (!current) {
    sendPreview(win, null);

    return;
  }

  const value = setClassValueWith(current.value, name);

  sendPreview(win, value === current.value ? null : { path: twState.node.path, value });
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
export function classValueWith(value, typed) {
  const prefix = variantKey();
  const raw = prefix && !typed.includes(':') ? `${prefix}:${typed}` : typed;
  const chips = currentChips(value);

  if (chips.some((chip) => chip.raw === raw)) {
    return { value, changed: false };
  }

  const { variants, base } = splitClass(raw);
  const slot = slotOf(splitUtility(base).name);
  const key = variants.join(':');
  const existing = slot
    ? chips.find((chip) => !chip.dynamic && chip.variants.join(':') === key && slotOf(chip.name) === slot)
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
 * The painting is Build's canvas's (build-mode/canvas-hold.js, listening for
 * `sve:tw-preview`): it holds the tag's would-be class value on its element,
 * and the rule comes from the same compiler as a save. Here is
 * only the answer to "what would Enter write" — the one place that knows,
 * so hover and Enter cannot disagree. A row always previews; typed text
 * previews once it is a class the catalog can compile.
 */
export function previewAdd(win, name, listed) {
  const typed = String(name || '').trim();
  const current = typed && !locked() ? currentValue() : null;

  if (!current || (!listed && !model?.catalog?.resolve(typed))) {
    sendPreview(win, null);

    return;
  }

  const next = classValueWith(current.value, typed);

  sendPreview(win, next.changed ? { path: twState.node.path, value: next.value } : null);
}

/** The pick is about to be written: the canvas keeps what it shows and forgets the hold. */
export function keepPreview(win) {
  sendPreview(win, { keep: true });
}

export function sendPreview(win, detail) {
  if (classTarget && typeof detail?.value === 'string') {
    win.document.dispatchEvent(
      new win.CustomEvent(EVENT.TW_PREVIEW, { detail: { ...detail, value: classTarget.preview(detail.value) } })
    );

    return;
  }

  // A call's classes land on whatever its component renders, and a tag's own
  // class (`{{ svg class="…" }}`) on an element the server renders: neither
  // is an element of the file the canvas holds by path, so nothing previews —
  // the pick shows once it is written.
  const next = (twState.node?.tagCall || twState.node?.component) && typeof detail?.value === 'string' ? null : detail;

  win.document.dispatchEvent(new win.CustomEvent(EVENT.TW_PREVIEW, { detail: next }));
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

export function applyChip(win, chip, nextName) {
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
export function previewChip(win, chip, label) {
  const current = label && !locked() ? currentValue() : null;
  const value = current ? chipValueWith(current, chip, label) : null;

  sendPreview(win, value == null || value === current.value ? null : { path: twState.node.path, value });
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
  if (locked() || !twState.node) {
    return;
  }

  const html = ask('dock:html');

  if (typeof html !== 'string' || html[twState.node.from] !== '<') {
    return;
  }

  const next = retag(html, twState.node.from, name);

  if (next === html) {
    return;
  }

  const at = twState.node.from;

  ask('dock:set-html', next);

  const rows = flattenHtmlTree(parseHtmlTree(next), new Set());
  const row = rows.find((item) => item.from === at);

  if (row) {
    twState.node = { from: row.from, openTo: row.openTo, path: row.path, tag: row.tag };
  }

  render(win);
  emit('tw:changed');
}
