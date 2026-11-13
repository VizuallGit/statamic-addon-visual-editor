/**
 * tw-classes.js — the menus.
 * Split out of tw-classes.js in the quality pass (tab G): the same statements, in the same
 * order; only the imports are new. tw-classes.js re-exports this file.
 */
import { t } from '../lib/i18n.js';
import { ask, emit } from '../cp/bus.js';
import { mountSurface } from '../cp/mount.js';
import CodeDockDataVars from '../cp/surfaces/CodeDockDataVars.vue';
import { replaceToken } from '../tw-parse.js';
import { retag } from '../lib/retag.js';
import { dataStateLabel, dataStates, isDataState } from '../lib/data-states.js';
import { GROUP_STATES } from '../lib/group-host.js';
import { optionsForProperty, ownValueLabels, ownVariables } from '../tw-families.js';
import { twUi } from '../cp/tailwind/store.js';
import TwClassMenu from '../cp/surfaces/TwClassMenu.vue';
import TwAddClass from '../cp/surfaces/TwAddClass.vue';
import TwTagMenu from '../cp/surfaces/TwTagMenu.vue';
import { twState } from './state.js';
import {
  MENU_ID,
  PROSE_VARIANTS,
  STATES,
  giveGroup,
  giveGroupAround,
  model,
  paint,
  render,
  variantKey,
  wantModel,
} from '../tw-classes.js';
import { ensureStyles } from './styles.js';
import { chipColor, currentValue, resolveVarColor, tagMenuProps, varName } from './resolve.js';
import {
  classValueWith,
  commit,
  currentChips,
  keepPreview,
  locked,
  previewAdd,
  previewSet,
  propertyOf,
  sendPreview,
  setClassValueWith,
  twAddClass,
  twSetClass,
  twSetTag,
  variantChips,
  withoutCovered,
} from './ops.js';

export let variantState = '';
let menuUnhook = null;

export function closeTwMenu(win) {
  const menu = win?.document.getElementById(MENU_ID);

  menuUnhook?.();
  menuUnhook = null;
  twState.openChipId = '';

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
export function openMenu(win, anchor, component, props) {
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

export function optionRows(win, options, active) {
  return (options || []).map((option) => ({
    label: option.label,
    css: option.css,
    color: option.color || resolveVarColor(win, varName(option.css)),
    active: option.label === active,
  }));
}

/**
 * The same menu for a row in the tree.
 *
 * It works on the row it was opened from and leaves the panel's own picked
 * tag alone — changing a tag in the tree should not move what the class list
 * is looking at. `pick`: who writes the name instead (Build's Content, which
 * keeps its pick on the renamed element).
 */
export function twOpenTagMenuAt(win, anchor, target, pick = null) {
  if (!target?.tag) {
    return;
  }

  openMenu(win, anchor, TwTagMenu, tagMenuProps(win, target.tag, pick || ((name) => renameAt(win, target, name))));
}

function renameAt(win, target, name) {
  if (ask('dock:is-locked') === true) {
    return;
  }

  const html = ask('dock:html');

  if (typeof html !== 'string' || html[target.from] !== '<') {
    return;
  }

  const next = retag(html, target.from, name);

  if (next !== html) {
    ask('dock:set-html', next);
  }
}

export function twOpenTagMenu(win, anchor) {
  openMenu(
    win,
    anchor,
    TwTagMenu,
    tagMenuProps(win, twState.node?.tag, (name) => twSetTag(win, name))
  );
}

/**
 * States, prose variants and Data states in one popup — the Insert data one,
 * with a tab for each and a search field. The first row of the states tab
 * clears the state; a prose variant is picked the same way and written the
 * same way. Data (lib/data-states.js): the data attributes on the picked tag
 * and around it, each value one can take — `group-data-[position=left]` — so
 * a class holds only while the attribute says so; picked on an element around
 * it, that element is given `group`. Exported for Build mode's state button
 * (build-mode/boot.js).
 */
export function openStateMenu(win, anchor, { write = null } = {}) {
  const html = ask('dock:html');
  const at = twState.node && !twState.node.component ? twState.node.from : null;
  const model = at === null || typeof html !== 'string' ? null : ask('dock:data-model', { at });

  Promise.resolve(model)
    .catch(() => null)
    .then((resolved) => {
      if (anchor?.isConnected === false) {
        return;
      }

      showStateMenu(win, anchor, at === null || typeof html !== 'string' ? [] : dataStates(html, at, resolved), write);
    });
}

function showStateMenu(win, anchor, states, write) {
  const none = t(win, 'tw_state_none');
  const known = new Set([...STATES.filter(Boolean), ...PROSE_VARIANTS]);
  const dataTab = { id: 'data', label: t(win, 'tw_state_data') };
  const tabs = [
    { id: 'state', label: t(win, 'tw_state') },
    { id: 'prose', label: t(win, 'tw_prose') },
  ];

  openMenu(win, anchor, CodeDockDataVars, {
    title: t(win, 'tw_state'),
    placeholder: t(win, 'tw_state_search'),
    emptyText: t(win, 'data_vars_empty'),
    noSectionText: t(win, 'data_vars_empty'),
    loopText: '',
    // The tab the state picked is on, first: a Data state opens on Data.
    tabs: isDataState(variantState) ? [dataTab, ...tabs] : [...tabs, dataTab],
    data: {
      state: [
        { var: none, id: '' },
        ...STATES.filter(Boolean).map((key) => ({ var: key, id: key, value: key === variantState ? '●' : '' })),
      ],
      prose: PROSE_VARIANTS.map((key) => ({ var: key, id: key, value: key === variantState ? '●' : '' })),
      data: states.length
        ? [
            { var: none, id: '' },
            ...states.map((state) => ({
              var: dataStateLabel(state.id),
              id: state.id,
              value: state.id === variantState ? '●' : `<${state.tag}>`,
            })),
          ]
        : [],
    },
    onPick: (row) => {
      const state = states.find((item) => item.id === row.id);

      if (state && !state.own) {
        giveGroup(state.from, write);
      } else if (!state && GROUP_STATES.includes(row.id)) {
        giveGroupAround(write);
      }

      variantState = state ? state.id : known.has(row.id) ? row.id : '';
      closeTwMenu(win);
      render(win);
      emit('tw:changed');
    },
  });
  win.document.getElementById(MENU_ID)?.setAttribute('data-sve-data-menu', '');
}

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

/** Which of a named group the picked tag has right now — `''` for none. */
export function twGroupActive(names) {
  const current = names?.length ? currentValue() : null;

  if (!current) {
    return '';
  }

  const have = new Set(variantChips(current.value).map((chip) => chip.name));

  return names.find((name) => have.has(name)) || '';
}

/**
 * The class value with one of a group set, and the group's other members off.
 *
 * `setClassValueWith` works out what a class replaces from the property it
 * sets, and a border width sets two of them — `border-style` as well as
 * `border-width`. A utility that sets two has no family at all, so left to
 * itself it would let `border-2` join `border-4` rather than take its place.
 * The group is named by the caller instead, and cleared here first.
 */
function groupValueWith(value, names, name) {
  let next = value;

  for (const other of names) {
    if (other !== name && variantChips(next).some((chip) => chip.name === other)) {
      next = setClassValueWith(next, other);
    }
  }

  // Picking the one already there takes it off, the same as every other
  // toggle in the row: `setClassValueWith` removes a name that is its own.
  return name ? setClassValueWith(next, name) : next;
}

/** Set one of a named group on the picked tag; `''` takes the group off. */
export function twSetGroup(win, names, name) {
  if (locked() || !names?.length) {
    return;
  }

  const current = currentValue();

  if (!current) {
    return;
  }

  commit(win, current.html, groupValueWith(current.value, names, name));
}

/**
 * A menu of named classes, where only one of the group may stand.
 *
 * For a scale Tailwind does not expose as one — see {@link groupValueWith}.
 * No search field: a group named by hand is four rows, not four hundred.
 */
export function twOpenGroupMenu(win, anchor, title, names, after) {
  if (!names?.length || !currentValue()) {
    return;
  }

  const active = twGroupActive(names);

  openMenu(win, anchor, TwClassMenu, {
    title,
    removeLabel: t(win, 'tw_classes_remove'),
    options: names.map((name) => ({ label: name, css: '', color: '', active: name === active })),
    onPreview: (label) => {
      const now = label && !locked() ? currentValue() : null;

      if (!now) {
        sendPreview(win, null);

        return;
      }

      const value = groupValueWith(now.value, names, label);

      sendPreview(win, value === now.value ? null : { path: twState.node.path, value });
    },
    onPick: (label) => {
      keepPreview(win);
      twSetGroup(win, names, label);
      closeTwMenu(win);
      after?.(label);
    },
    onRemove: () => {
      keepPreview(win);
      twSetGroup(win, names, '');
      closeTwMenu(win);
      after?.('');
    },
  });
}

/**
 * The class value with a value field's pick in it (Build's Style fields).
 *
 * `own` is what the field reads as its own — its class, or a physical twin
 * under a logical field (`pt-800` under padding-block-start) — and the pick
 * takes its place. With nothing of its own the pick goes in as `twAddClass`
 * writes it: one per family, per variant. The row already there changes
 * nothing: a field's row means "this one", never "off".
 */
function fieldValueWith(value, name, own) {
  const drop = new Set(own || []);
  const hits = currentChips(value)
    .filter((chip) => !chip.dynamic && drop.has(chip.raw))
    .sort((a, b) => b.from - a.from);

  if (!hits.length) {
    return name ? withoutCovered(classValueWith(value, name).value, name) : value;
  }

  const prefix = variantKey();
  const raw = !name ? '' : prefix && !name.includes(':') ? `${prefix}:${name}` : name;
  let next = value;

  hits.forEach((chip, index) => {
    next = replaceToken(next, chip, index === hits.length - 1 ? raw : '');
  });

  return name ? withoutCovered(next, name) : next;
}

/** A value field's class written straight — a drag on Spacing's box — in the place of `own` (a raw), as its menu's pick is. */
export function twSetFieldClass(win, name, own) {
  const current = name && !locked() ? currentValue() : null;

  if (current) {
    commit(win, current.html, fieldValueWith(current.value, name, own ? [own] : []));
  }
}

/**
 * A value field's menu: the tool menu's popover, rows, search and preview,
 * writing the way a value typed into the field does (`fieldValueWith`), so
 * the row under the marker and the row picked are one edit.
 *
 * `property` is the scale offered, or `names` a group named by hand (border
 * widths, shadows — see {@link groupValueWith}); `own` (`{ raw, name }`) the
 * class the field holds — its ✓, what a pick replaces and what Remove takes
 * off. `free(text)` is the class typed text would be: with it, the search
 * also writes a value the scale does not have (`10px`, `calc(…)`, `--gutter`),
 * once Tailwind compiles it.
 */
export function twOpenValueMenu(
  win,
  anchor,
  { property, names = null, title = '', own = null, free = null, after } = {}
) {
  if (!currentValue()) {
    return;
  }

  const options = names ? names.map((label) => ({ label, css: '', color: '' })) : optionsForProperty(property, model);

  if (!options.length && !free) {
    return;
  }

  const owned = own?.raw ? [own.raw] : [];
  const next = (label) => {
    const now = !locked() ? currentValue() : null;
    const value = now ? fieldValueWith(now.value, label, owned) : null;

    return now && value !== now.value ? { html: now.html, value } : null;
  };

  openMenu(win, anchor, TwClassMenu, {
    title: title || property,
    removeLabel: t(win, 'tw_classes_remove'),
    searchPlaceholder: t(win, 'tw_filter_placeholder'),
    options: optionRows(win, options, own?.name || ''),
    free: free
      ? (text) => {
          const name = free(text);

          return name && model?.catalog?.resolve(name) ? name : '';
        }
      : null,
    // The own-value mode: the site's variables to reach for, its words, and
    // the CSS a typed value comes to (TwClassMenu).
    vars: free ? ownVariables(model, property) : [],
    labels: free ? ownValueLabels((key) => t(win, key)) : null,
    cssOf: (name) => model?.catalog?.css(name) || '',
    onPreview: (label) => {
      const change = label ? next(label) : null;

      sendPreview(win, change ? { path: twState.node.path, value: change.value } : null);
    },
    onPick: (label) => {
      const change = next(label);

      if (change) {
        keepPreview(win);
        commit(win, change.html, change.value);
      }

      closeTwMenu(win);
      after?.(label);
    },
    onRemove: () => {
      const change = owned.length ? next('') : null;

      if (change) {
        keepPreview(win);
        commit(win, change.html, change.value);
      }

      closeTwMenu(win);
      after?.('');
    },
  });
}

/** The colour a class paints with, as the menu's dot shows it: the catalog's, or the preview's for a theme variable. */
export function twColorOf(win, name) {
  return name ? chipColor(win, name) : '';
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

    const value = css
      .slice(colon + 1)
      .replace(/;+\s*$/, '')
      .trim();

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
      // Within each, the site's own first (`py-500` before `py-0`), and the
      // cut at 40 after that order, so the site's scale never falls off.
      const starts = [];
      const contains = [];

      for (let i = 0; i < catalog.names.length; i++) {
        const name = catalog.lower[i];

        if (name.startsWith(query)) {
          starts.push(catalog.names[i]);
        } else if (name.includes(query)) {
          contains.push(catalog.names[i]);
        }
      }

      starts.sort((a, b) => a.length - b.length);

      const names = [...catalog.ownFirst(starts), ...catalog.ownFirst(contains)].slice(0, 40);

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
