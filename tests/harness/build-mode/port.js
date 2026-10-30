/**
 * Build mode's port for the harness page — the object build-mode/boot.js
 * builds from the editor, standing on a file in memory instead.
 *
 * The panel cannot tell the two apart: the same lists (the dock's own,
 * read out of code-dock.js), the same placement and markup (place.js,
 * markup.js), the same tree edits (html-tree-edit.js). Only the class
 * functions are stand-ins: they follow tw-classes.js's rules — the same
 * property is replaced at the size picked, the same name again takes it off,
 * a fixed class is set, a scale opens a menu — over a small catalog of this
 * site's scale names, where the editor asks the site's real Tailwind.
 */
import { ref } from 'vue';
import { flattenHtmlTree, parseTemplateTree } from '../../../resources/js/html-tree-parse.js';
import { deleteHtml, duplicateHtml } from '../../../resources/js/html-tree-edit.js';
import { appendToken, readClassAttr, renameTag, replaceToken, splitClass, splitUtility, tokenizeClassValue, writeClassValue } from '../../../resources/js/tw-parse.js';
import { readAttribute, withAttribute } from '../../../resources/js/build-mode/attrs.js';
import { readText, withText } from '../../../resources/js/build-mode/text.js';
import { onlyTypes, wrongFields } from '../../../resources/js/data-var-types.js';
import { isRichBlock, readRich, readRichField, richOwner, sameRich, withRich, withRichField } from '../../../resources/js/build-mode/rich.js';
import { withSvgSrc } from '../../../resources/js/build-mode/svg.js';
import { breakpoints } from '../../../resources/js/breakpoints.js';
import { HTML_ICONS } from '../../../resources/js/html-tree-icons.js';
import { addAt, findByPath } from '../../../resources/js/build-mode/place.js';
import { isColorValue, rootOf } from '../../../resources/js/build-mode/classes.js';

/* ------------------------------------------------------------------ *
 * A small catalog: this site's scale names, by the property they set
 * ------------------------------------------------------------------ */

const SPACE = ['0', '100', '200', '300', '400', '500', '600', '700', '800', '900'];
const COLORS = ['primary', 'secondary', 'tertiary', 'white', 'black', 'gray-100', 'gray-600'];
const SCALES = {
  display: ['block', 'inline-block', 'flex', 'inline-flex', 'grid', 'hidden'],
  position: ['static', 'relative', 'absolute', 'fixed', 'sticky'],
  'flex-direction': ['flex-row', 'flex-col', 'flex-row-reverse', 'flex-col-reverse'],
  'justify-content': ['justify-start', 'justify-center', 'justify-end', 'justify-between', 'justify-around', 'justify-evenly'],
  'align-items': ['items-start', 'items-center', 'items-end', 'items-stretch', 'items-baseline'],
  'grid-template-columns': Array.from({ length: 12 }, (_, i) => `grid-cols-${i + 1}`),
  'text-align': ['text-left', 'text-center', 'text-right', 'text-justify'],
  'font-weight': ['font-thin', 'font-light', 'font-normal', 'font-medium', 'font-semibold', 'font-bold', 'font-extrabold', 'font-black'],
  'font-size': ['300', '400', '500', '600', '700', '800', '900'].map((s) => `text-${s}`),
  'line-height': ['leading-none', 'leading-tight', 'leading-snug', 'leading-normal', 'leading-relaxed'],
  'font-family': ['font-sans', 'font-serif', 'font-mono'],
  color: COLORS.map((c) => `text-${c}`),
  'background-color': COLORS.map((c) => `bg-${c}`),
  'border-color': COLORS.map((c) => `border-${c}`),
  width: ['w-auto', 'w-full', 'w-fit', 'w-1/2', 'w-1/3'],
  height: ['h-auto', 'h-full', 'h-fit'],
  'max-width': ['max-w-none', 'max-w-prose', 'max-w-full'],
  overflow: ['overflow-visible', 'overflow-hidden', 'overflow-clip', 'overflow-auto', 'overflow-scroll'],
  'border-radius': ['rounded-none', 'rounded-sm', 'rounded', 'rounded-md', 'rounded-lg', 'rounded-full'],
  gap: SPACE.map((s) => `gap-${s}`),
  'row-gap': SPACE.map((s) => `gap-y-${s}`),
  'column-gap': SPACE.map((s) => `gap-x-${s}`),
};

for (const [box, letter] of [['padding', 'p'], ['margin', 'm']]) {
  const sides = {
    '': '', '-block': 'y', '-inline': 'x', '-block-start': 'bs', '-block-end': 'be', '-inline-start': 's', '-inline-end': 'e',
    '-top': 't', '-bottom': 'b', '-left': 'l', '-right': 'r',
  };

  for (const [suffix, side] of Object.entries(sides)) {
    SCALES[`${box}${suffix}`] = [...SPACE, ...(box === 'margin' ? ['auto'] : [])].map((s) => `${letter}${side}-${s}`);
  }
}

const BY_NAME = new Map();
const BY_ROOT = new Map();

for (const [property, names] of Object.entries(SCALES)) {
  names.forEach((name) => BY_NAME.set(name, property));

  const root = rootOf(names);

  if (root && !BY_ROOT.has(root)) {
    BY_ROOT.set(root, property);
  }
}

/** The property a utility sets — the harness's answer to tw-families' `familyFor`. */
export function propertyOf(name) {
  if (BY_NAME.has(name)) {
    return BY_NAME.get(name);
  }

  const m = /^(-?[a-z-]+?)-(\[(.+)\]|\((.+)\))$/.exec(name);

  if (!m) {
    return '';
  }

  if (m[1] === 'text') {
    const inner = m[3] || m[4] || '';

    return /^length:/.test(inner) || (m[3] && !isColorValue(inner) && !/^color:/.test(inner)) ? 'font-size' : 'color';
  }

  return BY_ROOT.get(m[1]) || '';
}

/* ------------------------------------------------------------------ *
 * The port
 * ------------------------------------------------------------------ */

export function createHarnessPort({ html, lists, strings, components, svgs, sectionTag, states, prose, colors, dataModel = {}, onMenu }) {
  const file = ref(html);
  const selected = ref('');
  const plus = ref('');
  const pointed = ref(0);
  const panel = ref('add');
  const size = ref(null);
  const state = ref('');
  const rev = ref(0);
  let wrote = '';

  const bump = () => {
    rev.value += 1;
  };
  const rows = () => breakpoints(window);
  // The size, then the state — the order tw-classes.js writes them in (`max-md:hover`).
  const variant = () => [size.value ? rows().find((row) => row.handle === size.value)?.tw || '' : '', state.value].filter(Boolean).join(':');
  const node = () => (selected.value ? findByPath(parseTemplateTree(file.value), selected.value) : null);
  const value = () => {
    const picked = node();

    return picked && !picked.kind ? readClassAttr(file.value, picked.from, picked.openTo)?.value || '' : null;
  };
  const chips = (text) =>
    tokenizeClassValue(text)
      .filter((tok) => !tok.dynamic && tok.text !== '[' && tok.text !== ']')
      .map((tok) => {
        const { variants, base } = splitClass(tok.text);

        return { ...tok, raw: tok.text, key: variants.join(':'), name: splitUtility(base).name };
      });
  const commit = (next) => {
    const picked = node();

    if (picked) {
      file.value = writeClassValue(file.value, picked, next);
      bump();
    }
  };

  const port = {
    rev,
    lists,
    t(key, replace = {}) {
      let out = strings[key] ?? key;

      for (const [name, val] of Object.entries(replace)) {
        out = String(out).replaceAll(`:${name}`, val);
      }

      return out;
    },

    /* The file, the pick and the + target */
    html: () => file.value,
    selectedPath: () => selected.value,
    plusPath: () => plus.value,
    select(path) {
      selected.value = richOwner(file.value, path) || path || '';
      plus.value = '';
      panel.value = 'element';
      bump();
    },
    setPlus(path) {
      plus.value = path || '';

      if (path) {
        selected.value = path;
      }

      bump();
    },
    panel,
    escape() {
      if (panel.value !== 'element' || !selected.value) {
        return false;
      }

      panel.value = 'add';

      return true;
    },
    pointed,
    openPlus(path) {
      port.setPlus(path);
      pointed.value += 1;
    },
    write(next, { select = '' } = {}) {
      file.value = next;
      wrote = select;
      selected.value = select || selected.value;
      plus.value = '';
      bump();
    },
    justWrote: (path) => path === wrote,
    sectionTag: () => sectionTag,
    mobileVariant: () => rows()[rows().length - 1]?.tw || 'max-md',
    components: () => Promise.resolve(components),
    svgs: () => Promise.resolve(svgs || { root: 'resources/svg', icons: [] }),
    setSvgAt(path, src) {
      const target = path ? findByPath(parseTemplateTree(file.value), path) : null;
      const next = target ? withSvgSrc(file.value, target, src) : file.value;

      if (next !== file.value) {
        port.write(next, { select: path });
      }
    },
    logic(kind, def) {
      const out = addAt(file.value, plus.value || selected.value, String(def?.snippet || '').replace(/\n+$/, ''));

      if (out) {
        port.write(out.html, { select: out.path });
      }
    },
    duplicate() {
      const picked = node();

      if (picked) {
        port.write(duplicateHtml(file.value, picked), { select: selected.value });
      }
    },
    remove() {
      const picked = node();

      if (picked) {
        file.value = deleteHtml(file.value, picked);
        selected.value = '';
        bump();
      }
    },

    setTag(name) {
      const picked = node();

      if (picked) {
        port.write(renameTag(file.value, picked, name), { select: selected.value.replace(/[^/]+$/, (last) => last.replace(/:[^:]+$/, `:${name}`)) });
      }
    },
    attr(name) {
      const picked = node();

      return picked ? readAttribute(file.value, picked, name) : null;
    },
    setAttrsAt(path, attrs) {
      let next = file.value;

      for (const [name, val] of Object.entries(attrs || {})) {
        const target = path ? findByPath(parseTemplateTree(next), path) : null;

        next = target ? withAttribute(next, target, name, val) : next;
      }

      if (next !== file.value) {
        port.write(next, { select: path });
      }
    },
    rich() {
      rev.value;

      const picked = node();

      return picked ? readRich(file.value, picked) : null;
    },
    richOwner: (path) => richOwner(file.value, path),
    isRichBlock: () => (rev.value, isRichBlock(file.value, node())),
    richField() {
      rev.value;

      const picked = node();

      return picked ? readRichField(file.value, picked) : null;
    },
    setRichField(path, text) {
      const target = path ? findByPath(parseTemplateTree(file.value), path) : null;
      const next = target ? withRichField(file.value, target, text) : file.value;

      if (next !== file.value) {
        port.write(next, { select: path });
      }
    },
    setRichAt(path, val) {
      const target = path ? findByPath(parseTemplateTree(file.value), path) : null;
      const now = target ? readRich(file.value, target) : null;

      if (now && !sameRich(now.html, val)) {
        port.write(withRich(file.value, target, val), { select: path });
      }
    },
    text() {
      rev.value;

      const picked = node();

      return picked ? readText(file.value, picked) : null;
    },
    setText(path, val) {
      const target = path ? findByPath(parseTemplateTree(file.value), path) : null;

      const next = target ? withText(file.value, target, val) : file.value;

      if (next !== file.value) {
        port.write(next, { select: path });
      }
    },
    pickField(anchor, path, types, pick) {
      const fits = onlyTypes(dataModel, types);
      const names = [...fits.section, ...fits.page.flatMap((group) => group.items), ...fits.site.flatMap((group) => group.items)].map((row) => row.var);

      onMenu?.({ anchor, title: 'data', names, active: '', pick: (name) => pick(`{{ ${name} }}`) });
    },
    wrongFields: (path, text, types) => Promise.resolve(wrongFields(text, dataModel, types)),

    /* Sizes and state — the Tailwind pane's list and its state menu */
    sizes: rows,
    state: () => state.value,
    openStateMenu(anchor) {
      onMenu?.({
        anchor,
        tabs: [
          { id: 'state', label: 'State', names: states },
          { id: 'prose', label: 'Prose', names: prose },
        ],
        none: strings.tw_state_none || 'No state',
        active: state.value,
        pick: (name) => {
          state.value = name || '';
          bump();
        },
      });
    },
    size: () => size.value,
    setSize(handle) {
      size.value = handle || null;
      bump();
    },

    /* Classes — tw-classes.js's rules, on the catalog above */
    propertyOf,
    scale: (property) => SCALES[property] || [],
    colorOf(name) {
      const m = /^(?:text|bg|border)-(.+)$/.exec(name || '');

      return m && COLORS.includes(m[1]) ? colors[m[1]] || `var(--color-${m[1]})` : '';
    },
    pickedClasses: () => {
      const text = value();

      return text === null ? [] : chips(text).map((chip) => chip.raw);
    },
    activeClass(property) {
      const text = value();

      return text === null ? '' : chips(text).find((chip) => chip.key === variant() && propertyOf(chip.name) === property)?.name || '';
    },
    setClass(name) {
      const text = value();

      if (text === null || !name) {
        return;
      }

      const property = propertyOf(name);
      const hit = chips(text).find((chip) => chip.key === variant() && (chip.name === name || (property && propertyOf(chip.name) === property)));
      const full = variant() ? `${variant()}:${name}` : name;

      commit(hit ? replaceToken(text, hit, hit.name === name ? '' : full) : appendToken(text, full));
    },
    /**
     * A value field's menu — twOpenValueMenu's rule: a pick takes the place of
     * the field's own class (`own`), or goes in one per property and size; the
     * row already there changes nothing; Remove takes the own class off.
     */
    /** twSetFieldClass's rule, which the menu's pick writes by as well. */
    setFieldClass(name, ownRaw) {
      const text = value();

      if (text === null) {
        return;
      }

      const full = !name ? '' : variant() ? `${variant()}:${name}` : name;
      const hits = ownRaw ? chips(text).filter((chip) => chip.raw === ownRaw).sort((a, b) => b.from - a.from) : [];
      let next = text;

      if (hits.length) {
        hits.forEach((chip, i) => {
          next = replaceToken(next, chip, i === hits.length - 1 ? full : '');
        });
      } else if (full && !chips(text).some((chip) => chip.raw === full)) {
        const property = propertyOf(name);
        const hit = property ? chips(text).find((chip) => chip.key === variant() && propertyOf(chip.name) === property) : null;

        next = hit ? replaceToken(text, hit, full) : appendToken(text, full);
      }

      if (next !== text) {
        commit(next);
      }
    },
    openValueMenu(anchor, { property, names = null, title = '', own = null, free = null } = {}) {
      const write = (name) => port.setFieldClass(name, own?.raw || '');

      onMenu?.({
        anchor,
        title: title || property,
        names: names || port.scale(property),
        active: own?.name || '',
        free,
        pick: write,
        remove: own ? () => write('') : null,
      });
    },
    openMenu(property, anchor) {
      onMenu?.({ anchor, title: property, names: port.scale(property), active: port.activeClass(property), pick: (name) => port.setClass(name) });
    },

    /* One tool of the row — runTwTool / twToolActive's rule */
    run(item, anchor) {
      if (item.twClass) {
        port.setClass(item.twClass);
      } else if (item.twGroup) {
        onMenu?.({ anchor, title: item.title, names: item.twGroup, active: '', pick: (name) => port.setClass(name) });
      } else if (item.tw) {
        port.openMenu(item.tw, anchor);
      }
    },
    active(item) {
      if (!node()) {
        return false;
      }

      if (item.twClass) {
        return port.activeClass(item.css || item.tw) === item.twClass;
      }

      if (item.twGroup) {
        const have = chips(value() || '').filter((chip) => chip.key === variant()).map((chip) => chip.name);

        return item.twGroup.some((name) => have.includes(name));
      }

      return !!item.tw && !!port.activeClass(item.tw);
    },
  };

  return port;
}

/** The tree the harness draws on the right, as the HTML tree flattens it. */
export function treeRows(html) {
  return flattenHtmlTree(parseTemplateTree(html), new Set());
}

export { HTML_ICONS };
