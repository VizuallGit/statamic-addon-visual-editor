/**
 * Style's port with the writing turned toward CSS: the same fields, handed this
 * instead of the Tailwind pane's functions.
 *
 * Owner: Build mode, the CSS mode demo (resources/js/build-mode/css-mode/).
 * May import: vue, cp/bus.js, cp/mount.js, the read-only parts of css-scope.js,
 *   tw-families.js, tw-parse.js, html-tree-parse.js and build-mode/; never a
 *   function of tw-classes.js. Nothing here writes a class or says `tw:changed`.
 * Bus: asks `dock:css`, `dock:set-css`, `dock:is-locked`, `dock:current-uid`;
 *   says `css-mode:changed` (a step for the top bar's history); listens to
 *   `dock:saved` and `css-mode:restored` (a step put back).
 *
 * A field asks the port for the picked element's classes and hands it a class to
 * set. So the port answers with the declarations of the rule being edited,
 * dressed as classes (`padding-top: 5rem` is `pt-[5rem]`), and takes a class by
 * what it compiles to (translate.js), the fields that share one value in their
 * share of it (parts.js). Only the reading and the writing change: the site's
 * scale, the sizes and the value an element shows are the real port's. A state
 * (`:hover`) is the rule's own, and reads as Tailwind's `hover:` does to a field.
 *
 * What is edited is one selector: a `[ name ]` class of the element, its one
 * ID, or the element under one of its data attributes' values (Data): the
 * section's `#id-{{ id }}`, then the attribute — on the element itself
 * `#id-{{ id }} [data-image="left"]`, on one around it
 * `#id-{{ id }}[data-position="right"] .name` with the element's own class or ID.
 * With none, a click writes nothing and the panel asks for a name. An ID
 * is the section's own (`id-{{ id }}`), one made unique per section
 * (`name-{{ id }}`) or one of the author's (`name`). On the first two, whose
 * rule is this one section's alone, a style can take its value from a field. The
 * rules reach the file through the dock's own door (`dock:set-css`), so they are
 * saved as anything typed in the CSS pane is, and the canvas shows them the same
 * frame through a sheet of this module's (css-mode/paint.js).
 */

import { computed, ref, watch } from 'vue';
import { ask, emit, on } from '../../cp/bus.js';
import { mountSurface } from '../../cp/mount.js';
import TwClassMenu from '../../cp/surfaces/TwClassMenu.vue';
import { panelValues } from '../../cp/panel/store.js';
import BuildDataBind from '../../cp/surfaces/BuildDataBind.vue';
import { addBracketClassToTag, bracketTokens, sanitizeCssClassName } from '../../css-scope.js';
import { cssStateSuffix, newSizeQuery } from '../../dock/css-sizes.js';
import { currentSectionValues } from '../../dock/scope.js';
import { CSS_STATES } from '../../dock/style-modes.js';
import { parseTemplateTree } from '../../html-tree-parse.js';
import { loadFamilies } from '../../tw-families.js';
import { splitClass, splitUtility } from '../../tw-parse.js';
import { readAttribute, withAttribute } from '../attrs.js';
import { dataStates } from '../../lib/data-states.js';
import { BUILD_CANVAS_SHOWN_EVENT } from '../../lib/build-canvas-ids.js';
import { buildCanvasFrame } from '../../lib/build-canvas.js';
import { fieldLookup } from '../canvas-paint.js';
import { BUILD_TOOLS, STYLE_FIELDS } from '../catalog.js';
import { effectiveClass, fromClass, rootFor, rootOf, variantChain } from '../classes.js';
import { findByPath, parentOf } from '../place.js';
import { createCssPaint } from './paint.js';
import { PART_PROPS, applyUpdates, isPartProp, partsOf, readPlaces } from './parts.js';
import { readBound, readRule, renameSelector, sizeKey, writeDeclarations } from './rules.js';
import { boundLabel, boundValue, createTranslator, fieldsFor, fillValue, planIsOn, planUpdates, printKeyframes } from './translate.js';

const MENU_ID = '__sve-css-mode-menu';
const KIND_KEY = 'sve-style-css-target';
/** The states a rule of the CSS can have, as the dock's CSS pane has them; `before` and `after` need a `content`. */
const SUFFIXES = CSS_STATES.map((state) => cssStateSuffix(state));
const PSEUDO_ELEMENT = /^::/;
/** The unit Spacing's box drags in (BuildSpacingBox.vue): a number from a field is in it too. */
const UNIT_KEY = 'sve-build-spacing-unit';
const SECTION_ID = /^id-\{\{\s*id\s*\}\}$/;
const DYNAMIC_ID = /^([a-zA-Z_][\w-]*)-\{\{\s*id\s*\}\}$/;

/**
 * A value from a field, dressed as a class like the rest: a name the fields can
 * hold, so the family's dot and the sizes treat it as any value. It has no CSS of
 * its own; the port knows it by name, and the Style field shows the field instead.
 * An image's has the shape the image field looks for.
 */
const BOUND = 'sve-bound';
const boundName = (prop) => (prop === 'background-image' ? `bg-[url(${BOUND})]` : `${BOUND}-[${prop}]`);

function propOfBound(name) {
  if (name === boundName('background-image')) {
    return 'background-image';
  }

  return new RegExp(`^${BOUND}-\\[(.+)\\]$`).exec(name || '')?.[1] || '';
}

const ports = new WeakMap();

/** The CSS port for a Build port: one, so what it has written outlives the element picked. */
export function cssPortFor(win, port) {
  if (!ports.has(port)) {
    ports.set(port, createCssPort(win, port));
  }

  return ports.get(port);
}

/** Whether the row at `path` stands in a loop. Found by walking: a row's path does not name the Antlers tag around it. */
function inLoop(nodes, path, within = false) {
  return (nodes || []).some((row) => (within && row.path === path) || inLoop(row.children, path, within || (row.kind === 'antlers' && row.antlers === 'loop')));
}

function createCssPort(win, port) {
  const own = ref(0);
  const rev = computed(() => port.rev.value + own.value);
  const model = ref(null);
  const lookup = (body) => fieldLookup(currentSectionValues(win) || {}, panelValues() || {})(body);
  const paint = createCssPaint(win, (value) => fillValue(value, lookup), SUFFIXES);
  const kind = ref(readKind());
  const chosen = ref(new Map());
  const idMode = ref('dynamic');
  /** The state being written (`hover`), '' for the plain rule: this mode's own, the Tailwind pane keeps its. */
  const stateNow = ref('');
  const notice = ref('');
  /** Moves when a click found nothing to write in: the panel's name field takes the caret. */
  const asked = ref(0);
  let uid = null;

  void loadFamilies(win).then((loaded) => {
    model.value = loaded;
  });

  function readKind() {
    try {
      const stored = win.localStorage.getItem(KIND_KEY);

      return stored === 'id' || stored === 'data' ? stored : 'class';
    } catch {
      return 'class';
    }
  }

  const rows = () => port.sizes();
  const fullCss = () => String(ask('dock:css') || '');

  /** The names Style's fields have beyond the property scales: lists by hand, and fields that are one utility. */
  function fieldNames() {
    if (!port.scale('display').length) {
      return null;
    }

    const tools = [...port.lists.cssTools, ...BUILD_TOOLS].flatMap((tool) => [tool, ...(tool.kids || [])]);
    const fields = Object.values(STYLE_FIELDS).flat();

    const names = [
      'border-0',
      ...tools.flatMap((tool) => tool.twGroup || []),
      ...fields.flatMap((field) => field.names || []),
      ...fields.flatMap((field) => (field.roots?.length ? port.utilityNames(field.roots, field.only) : [])),
    ];

    // Compiled in one go: one call for a list is a fraction of one per name.
    model.value.catalog.fill(names);

    return names;
  }

  const translator = computed(() => (model.value
    ? createTranslator({
      ruleOf: (name) => model.value.catalog.rule(name),
      themeValue: (name) => model.value.catalog.design?.resolveThemeValue?.(name),
      scale: (property) => port.scale(property),
      named: fieldNames,
    })
    : null));
  const planFor = (name) => translator.value?.planFor(name) || null;

  /* ---------------- the element, and what is edited on it ---------------- */

  function picked() {
    const html = port.html();
    const path = port.selectedPath();
    const node = path ? findByPath(parseTemplateTree(html), path) : null;

    // A component call or an Antlers tag has no tag of its own to name.
    return node && !node.kind && node.tag && node.openTo ? { html, path, node, open: html.slice(node.from, node.openTo) } : null;
  }

  function isFileRoot() {
    const at = picked();

    if (!at) {
      return false;
    }

    // Found in the tree it is asked of: parentOf goes by the node itself.
    const roots = parseTemplateTree(at.html);

    return !parentOf(roots, findByPath(roots, at.path));
  }

  const classNames = () => {
    const at = picked();

    return at ? bracketTokens(at.open) : [];
  };

  const idOf = () => {
    const at = picked();

    return at ? readAttribute(at.html, at.node, 'id') || '' : '';
  };

  /** What the element's ID is, and what may be done with it. */
  function idInfo() {
    const raw = idOf();
    const dynamic = DYNAMIC_ID.exec(raw);

    if (!raw) {
      return null;
    }

    const at = picked();

    // On a round of a loop `{{ id }}` is the round's, in the CSS outside it the section's: a rule cannot reach it.
    if (at && inLoop(parseTemplateTree(at.html), at.path)) {
      return { kind: 'loop', raw, label: raw, name: '', fields: false };
    }

    if (SECTION_ID.test(raw)) {
      return { kind: 'section', raw, label: raw, name: '', fields: true };
    }

    if (dynamic) {
      return { kind: 'dynamic', raw, label: dynamic[1], name: dynamic[1], fields: true };
    }

    return raw.includes('{{') ? { kind: 'other', raw, label: raw, name: '', fields: false } : { kind: 'own', raw, label: raw, name: raw, fields: false };
  }

  /** `{{ id }}` is a section's row: in a header, a footer or a component's file it says nothing. */
  const canBeDynamic = () => !!ask('dock:current-uid') && !ask('dock:chrome-kind') && !ask('dock:component-src');

  /** The tag's other IDs in the file, and an own name anywhere on the page, are taken. */
  function idTaken(html, raw, self = '') {
    const flat = (text) => text.replace(/\{\{\s*([\s\S]*?)\s*\}\}/g, '{{$1}}');
    const inFile = [...html.matchAll(/\sid\s*=\s*["']([^"']*)["']/g)].map((match) => flat(match[1]));
    const others = inFile.filter((one) => one !== flat(self));

    return others.includes(flat(raw)) || (!raw.includes('{{') && raw !== self && !!buildCanvasFrame(win)?.contentDocument?.getElementById(raw));
  }

  function classOpen() {
    const names = classNames();
    const kept = chosen.value.get(port.selectedPath());

    return names.includes(kept) ? kept : names[0] || '';
  }

  /* ---------------- Data: the element under a data attribute's value ---------------- */

  /** The data model of the picked element's place: a field's options are the values its attribute can take. */
  const dataModel = ref(null);
  /** The Data condition picked per element, by path. */
  const chosenData = ref(new Map());

  watch(
    () => [kind.value, port.selectedPath()],
    ([now]) => {
      const at = now === 'data' ? picked() : null;

      dataModel.value = null;

      if (at) {
        Promise.resolve(ask('dock:data-model', { at: at.node.from }))
          .then((model) => {
            dataModel.value = model || null;
          })
          .catch(() => {});
      }
    },
    { immediate: true }
  );

  /** The data attributes on the element and around it, each value one can take (lib/data-states.js). */
  function dataConditions() {
    const at = picked();

    return at ? dataStates(at.html, at.node.from, dataModel.value) : [];
  }

  function dataOpen() {
    const list = dataConditions();
    const kept = chosenData.value.get(port.selectedPath());

    return list.find((cond) => cond.id === kept) || list[0] || null;
  }

  /** The file's outermost element, and its ID as written when it is the section's own (`id-{{ id }}`). */
  function sectionRoot() {
    const at = picked();
    const roots = at ? parseTemplateTree(at.html) : [];
    const root = at ? findByPath(roots, at.path.split('/')[0]) : null;
    const id = root && !root.kind ? readAttribute(at.html, root, 'id') || '' : '';

    return root && SECTION_ID.test(id) ? { node: root, id } : null;
  }

  /** The element's own name, for a condition around it: its ID, else its open class. */
  function ownName() {
    const id = idOf();

    if (id && idInfo()?.kind !== 'loop') {
      return `#${id}`;
    }

    const name = classOpen();

    return name ? `.${name}` : '';
  }

  /** Why Data cannot write now, as a language key; '' when it can. */
  function dataBlocked() {
    const cond = dataOpen();

    if (!cond) {
      return 'css_mode_data_none';
    }

    if (!sectionRoot()) {
      return 'css_mode_data_need_section_id';
    }

    return cond.own || ownName() ? '' : 'css_mode_data_need_name';
  }

  function dataSelector() {
    const cond = dataOpen();
    const root = sectionRoot();

    if (!cond || !root || dataBlocked()) {
      return '';
    }

    const attr = cond.value === null ? `[data-${cond.key}]` : `[data-${cond.key}="${cond.value}"]`;
    const on = cond.from === root.node.from ? `#${root.id}${attr}` : `#${root.id} ${attr}`;

    return cond.own ? on : `${on} ${ownName()}`;
  }

  const selector = computed(() => {
    rev.value;

    if (kind.value === 'data') {
      dataModel.value;
      chosenData.value;

      return dataSelector();
    }

    if (kind.value === 'id') {
      const id = idOf();

      return id && idInfo()?.kind !== 'loop' ? `#${id}` : '';
    }

    const name = classOpen();

    return name ? `.${name}` : '';
  });

  /* ---------------- reading: the rule, dressed as classes ---------------- */

  const suffixNow = () => (stateNow.value ? cssStateSuffix(stateNow.value) : '');
  const stateName = (suffix) => (suffix ? CSS_STATES.find((state) => cssStateSuffix(state) === suffix) : '');

  /** Only the states the file has a word of: most files have none, and each is another walk of its rules. */
  const statesInFile = (css) => SUFFIXES.filter((suffix) => css.includes(suffix));

  /** Each state's declarations, as `{ size, suffix, prop, value }`. */
  const eachState = (read) => {
    rev.value;

    if (!selector.value) {
      return [];
    }

    const css = fullCss();

    return ['', ...statesInFile(css)].flatMap((suffix) => read(css, `${selector.value}${suffix}`, rows()).map((decl) => ({ ...decl, suffix })));
  };

  const declared = computed(() => eachState(readRule));

  /** Whether a declaration is a shared value's, read through its parts. */
  const asParts = (decl) => isPartProp(decl.prop) && !!partsOf(decl.prop, decl.value);

  const sizeVariant = (size) => (size ? rows().find((row) => row.handle === size)?.tw || '' : '');
  const variantKey = (size, suffix) => [sizeVariant(size), stateName(suffix)].filter(Boolean).join(':');

  /** Declarations by the place they stand: a size and a state. */
  function placesOf(decls) {
    const out = new Map();

    for (const decl of decls) {
      const key = variantKey(decl.size, decl.suffix);

      out.set(key, [...(out.get(key) || []), decl]);
    }

    return out;
  }

  const dressed = computed(() => {
    if (!translator.value) {
      return [];
    }

    const named = (size, suffix, name) => {
      const key = variantKey(size, suffix);

      return key ? `${key}:${name}` : name;
    };
    const css = fullCss();
    const parts = selector.value
      ? PART_PROPS.filter((prop) => css.includes(prop)).flatMap((prop) => readPlaces(css, selector.value, prop, rows(), statesInFile(css))
        .filter((place) => place.own.size)
        .flatMap((place) => translator.value.namesForParts(prop, place.own).map((name) => named(place.size, place.suffix, name))))
      : [];

    return [
      ...[...placesOf(declared.value.filter((decl) => !asParts(decl))).values()]
        .flatMap((decls) => translator.value.namesForDeclarations(decls).map((name) => named(decls[0].size, decls[0].suffix, name))),
      ...parts,
      ...boundNow().map((decl) => named(decl.size, decl.suffix, boundName(decl.prop))),
    ];
  });

  const sizeNow = () => sizeKey(rows(), port.size());
  const keyNow = () => variantKey(sizeNow(), suffixNow());

  /** A class's own property, for one Tailwind lists under none: `border-2` also says its style. */
  function propertyOf(name) {
    const plan = /^\[/.test(name || '') ? null : planFor(name);
    const hard = plan && !plan.parts.length ? plan.decls.filter((decl) => !decl.soft) : [];

    return propOfBound(name) || /^\[([\w-]+):/.exec(name || '')?.[1] || port.propertyOf(name) || (hard.length === 1 ? hard[0].prop : '');
  }

  function activeClass(property) {
    rev.value;

    return effectiveClass(dressed.value.join(' '), [property], [keyNow()], propertyOf)?.name || '';
  }

  /** What stands at the place being written: the declarations, and a shared value's own parts. */
  const hereNow = () => new Map(declared.value.filter((decl) => decl.size === sizeNow() && decl.suffix === suffixNow()).map((decl) => [decl.prop, decl.value]));

  /** The properties that reach the place being written from a wider size or the plain state. */
  const reachingNow = () => {
    const chain = variantChain(rows(), port.size(), stateNow.value);

    return new Set(declared.value.filter((decl) => chain.includes(variantKey(decl.size, decl.suffix))).map((decl) => decl.prop));
  };

  function ownParts(prop) {
    const css = fullCss();
    const place = readPlaces(css, selector.value, prop, rows(), statesInFile(`${css}${suffixNow()}`)).find((one) => one.size === sizeNow() && one.suffix === suffixNow());

    return place?.own || new Map();
  }

  /* ---------------- writing ---------------- */

  function whereNow() {
    const size = sizeNow();
    const row = rows().find((item) => item.handle === size);

    return { selector: selector.value, suffix: suffixNow(), suffixes: statesInFile(`${fullCss()}${suffixNow()}`), size, rows: rows(), query: row ? newSizeQuery(row, fullCss()) : '' };
  }

  function canWrite() {
    if (kind.value === 'id' && idInfo()?.kind === 'loop') {
      notice.value = port.t('css_mode_id_loop');

      return false;
    }

    if (!selector.value) {
      asked.value += 1;

      return false;
    }

    if (ask('dock:is-locked') === true) {
      notice.value = port.t('css_mode_locked');

      return false;
    }

    // In `@scope` a class reaches what is under the root, never the root: the
    // rule would be written and do nothing, here and on the public page.
    if (kind.value === 'class' && isFileRoot() && /@scope\b/i.test(fullCss())) {
      notice.value = port.t('css_mode_root_scope');

      return false;
    }

    return true;
  }

  function followFile() {
    const now = ask('dock:current-uid') ?? null;

    if (now !== uid) {
      uid = now;
      paint.clear();
    }
  }

  /**
   * `::before` shows nothing until it has a `content`: it comes with the first
   * value, and goes with the last.
   */
  function withContent(css, where) {
    const place = { ...where, selector: `${where.selector}${where.suffix}` };

    if (!PSEUDO_ELEMENT.test(where.suffix)) {
      return css;
    }

    const props = readRule(css, place.selector, where.rows).filter((decl) => decl.size === where.size);
    const others = props.some((decl) => decl.prop !== 'content') || readBound(css, place.selector, where.rows).some((decl) => decl.size === where.size);
    const content = props.find((decl) => decl.prop === 'content');

    if (others && !content) {
      return writeDeclarations(css, place, [{ prop: 'content', value: '""' }]);
    }

    return !others && content?.value === '""' ? writeDeclarations(css, place, [{ prop: 'content', value: null }]) : css;
  }

  /**
   * A shared value the fields cannot take apart (a gradient of four stops, a
   * value holding a field, `none`, an image): a part written would replace it
   * whole, and it is the author's. The property, if an update would.
   */
  function byHandIn(updates) {
    const css = fullCss();
    const hit = updates.find((one) => {
      if (!one.key || one.value === null || one.value === undefined) {
        return false;
      }

      const place = readPlaces(css, selector.value, one.prop, rows(), statesInFile(`${css}${suffixNow()}`)).find((item) => item.size === sizeNow() && item.suffix === suffixNow());

      return place?.opaque && place.value !== null;
    });

    return hit?.prop || '';
  }

  const nextCss = (css, updates) => {
    const where = whereNow();

    return withContent(applyUpdates(css, where, updates), where);
  };

  function write(updates) {
    if (!canWrite() || !updates.length) {
      return;
    }

    followFile();

    const byHand = byHandIn(updates);

    if (byHand) {
      notice.value = port.t('css_mode_value_by_hand', { prop: byHand });

      return;
    }

    const css = fullCss();
    const next = nextCss(css, updates);

    notice.value = '';

    if (next === css) {
      return;
    }

    if (ask('dock:set-css', next) === false) {
      notice.value = port.t('css_mode_locked');

      return;
    }

    paint.remember(selector.value, port.selectedPath());
    hold();
    paint.sync(next, rows());
    own.value += 1;
    emit('css-mode:changed');
  }

  /* Without its variants. `w-1/2` keeps its `/2`: that is the class, not an opacity. */
  const baseOf = (raw) => splitClass(raw).base.replace(/^!|!$/g, '');

  function planOfClass(name) {
    const plan = planFor(baseOf(name));

    if (!plan) {
      notice.value = port.t('css_mode_no_css', { name: baseOf(name) });
    }

    return plan;
  }

  /** What a class on the element stands for; a field's value is the one declaration. */
  function planOfRaw(raw) {
    const prop = propOfBound(baseOf(raw));

    return prop ? { decls: [{ prop, value: '' }], parts: [], keyframes: '' } : planFor(baseOf(raw));
  }

  /** The steps of the animation a class needs, as the update that puts them in the file. */
  function withSteps(plan, updates) {
    const node = plan?.keyframes ? model.value.catalog.design?.theme.getKeyframes?.().find((one) => one.params === plan.keyframes) : null;

    return node ? [...updates, { keyframes: plan.keyframes, text: printKeyframes(node) }] : updates;
  }

  /** The updates that put `name` in the place of `raw`: what it alone set comes out. */
  function updatesFor(name, raw) {
    const plan = name ? planOfClass(name) : null;

    if (name && !plan) {
      return null;
    }

    return withSteps(plan, planUpdates(plan, raw ? planOfRaw(raw) : null, hereNow(), reachingNow()));
  }

  /*
   * The family's dot takes its classes off one after the other, in one go. What
   * went along with a class before it (`transition`'s easing) would read as not
   * there and be set again, so it is remembered until the go is over.
   */
  const justOff = new Set();

  /** As the pane's own click: set, or taken off when it is what stands here already. */
  function setClass(name) {
    // The family's dot on a value from a field: the field lets go.
    if (propOfBound(baseOf(name))) {
      write([{ prop: propOfBound(baseOf(name)), value: null }]);

      return;
    }

    // The family's dot names a class without its alpha (`bg-primary-300`): what stands here is `bg-primary-300/50`.
    const standing = dressed.value.map((raw) => splitClass(raw)).find((one) => one.variants.join(':') === keyNow() && splitUtility(one.base).modifier && splitUtility(one.base).name === baseOf(name));
    const plan = planOfClass(standing?.base || name);

    if (!plan) {
      return;
    }

    if (plan.decls.length && plan.decls.every((decl) => justOff.has(decl.prop))) {
      return;
    }

    if (planIsOn(plan, hereNow(), ownParts)) {
      const updates = planUpdates(null, plan, hereNow());

      updates.forEach((one) => one.prop && !one.key && justOff.add(one.prop));
      queueMicrotask(() => justOff.clear());
      write(updates);
    } else {
      write(withSteps(plan, planUpdates(plan, null, hereNow(), reachingNow())));
    }
  }

  function setFieldClass(name, raw) {
    const updates = updatesFor(name, raw);

    if (updates) {
      write(updates);
    }
  }

  /* ---------------- a value's menu: the pane's rows, in the file's words ---------------- */

  function closeMenu() {
    const menu = win.document.getElementById(MENU_ID);

    if (menu) {
      menu._sveClose?.();
      menu._sveApp?.unmount();
      menu.remove();
    }
  }

  function place(menu, anchor) {
    const box = anchor.getBoundingClientRect();
    const high = menu.offsetHeight;
    const below = box.bottom + 4;

    menu.style.left = `${Math.max(4, Math.min(box.left, win.innerWidth - menu.offsetWidth - 4))}px`;
    menu.style.top = `${below + high > win.innerHeight - 4 ? Math.max(4, box.top - high - 4) : below}px`;
  }

  function openValueMenu(anchor, { property, names = null, title = '', own: mine = null, free = null } = {}) {
    closeMenu();

    const list = names || port.scale(property);
    const root = rootOf(list);
    const byLabel = new Map();
    const options = [];

    for (const name of list) {
      const plan = planFor(name);

      if (plan) {
        // A list with no one root (`skew-x-12`, `-skew-x-12`): each row by its own, its sign kept.
        const label = root ? fromClass(name, root) || name : `${name.startsWith('-') ? '-' : ''}${fromClass(name, rootFor(name)) || name}`;

        byLabel.set(label, name);
        options.push({
          label,
          css: [...plan.decls.filter((decl) => !decl.soft), ...plan.parts].map((one) => `${one.prop}: ${one.value}`).join('; '),
          color: port.colorOf(name) || '',
          active: name === mine?.name,
        });
      }
    }

    if (!options.length && !free) {
      return;
    }

    const nameOf = (label) => byLabel.get(label) || label;
    const preview = (label) => {
      const wanted = label ? updatesFor(nameOf(label), mine?.raw) : null;
      const updates = wanted && byHandIn(wanted) ? null : wanted;
      const css = fullCss();

      paint.remember(selector.value, port.selectedPath());
      hold();
      paint.sync(updates ? nextCss(css, updates) : css, rows());
    };
    const menu = win.document.createElement('div');

    menu.id = MENU_ID;
    win.document.body.appendChild(menu);
    menu._sveApp = mountSurface(TwClassMenu, menu, {
      title: title || property,
      removeLabel: port.t('tw_classes_remove'),
      searchPlaceholder: port.t('css_mode_menu_search'),
      options,
      free: free
        ? (text) => {
            const name = free(text);

            if (name && planFor(name)) {
              return name;
            }

            // A plain number the scale has no row for (`leading-1.3`): as a typed value.
            const typed = name ? `${rootFor(name)}-[${String(text).trim().replace(/\s+/g, '_')}]` : '';

            return typed && planFor(typed) ? typed : '';
          }
        : null,
      onPreview: selector.value ? preview : null,
      onPick(label) {
        closeMenu();

        if (selector.value) {
          setFieldClass(nameOf(label), mine?.raw);
        } else {
          asked.value += 1;
        }
      },
      onRemove() {
        closeMenu();

        if (mine?.raw) {
          write(planUpdates(null, planOfRaw(mine.raw), hereNow()));
        } else {
          // Nothing by hand here: Remove lets go of the field, if one gives this value.
          const names = [property, title].filter(Boolean);

          write(boundNow().filter((decl) => decl.size === sizeNow() && decl.suffix === suffixNow() && names.includes(decl.prop)).map((decl) => ({ prop: decl.prop, value: null })));
        }
      },
    });
    place(menu, anchor);

    const onDown = (event) => {
      if (!menu.contains(event.target) && !anchor.contains(event.target)) {
        closeMenu();
        paint.sync(fullCss(), rows());
      }
    };
    const onKey = (event) => {
      if (event.key === 'Escape') {
        closeMenu();
        paint.sync(fullCss(), rows());
      }
    };

    win.document.addEventListener('pointerdown', onDown, true);
    win.document.addEventListener('keydown', onKey, true);
    menu._sveClose = () => {
      win.document.removeEventListener('pointerdown', onDown, true);
      win.document.removeEventListener('keydown', onKey, true);
    };
  }

  /* ---------------- the dock's save, and the canvas coming to show ---------------- */

  const refresh = () => {
    followFile();
    own.value += 1;
    paint.sync(fullCss(), rows());
  };

  /*
   * Listening lasts while the panel is mounted or the sheet stands: the sheet
   * outlives the panel (Content's tab, HTML Build), and has to follow the file
   * and the form there too. The canvas gone, there is no sheet left to keep.
   */
  let mounted = 0;
  let stopListening = null;

  const onCanvas = () => {
    if (!buildCanvasFrame(win)) {
      paint.clear();
    }

    refresh();
    hold();
  };

  /** What the fields in the sheet hold now: it changes the frame the form is typed in. */
  const formNow = () => {
    own.value;

    // Nothing to paint without the canvas: it reads the file again when it comes back.
    if (!buildCanvasFrame(win)) {
      return '';
    }

    const css = fullCss();

    return JSON.stringify(paint.selectors().flatMap((name) => ['', ...statesInFile(css)].flatMap((suffix) => readBound(css, `${name}${suffix}`, rows()).map((decl) => fillValue(decl.value, lookup)))));
  };

  function hold() {
    const want = mounted > 0 || paint.selectors().length > 0;

    if (want && !stopListening) {
      const stopSaved = on('dock:saved', refresh);
      const stopRestored = on('css-mode:restored', refresh);
      const stopForm = watch(formNow, () => paint.sync(fullCss(), rows()));

      win.addEventListener(BUILD_CANVAS_SHOWN_EVENT, onCanvas);
      stopListening = () => {
        stopSaved();
        stopRestored();
        stopForm();
        win.removeEventListener(BUILD_CANVAS_SHOWN_EVENT, onCanvas);
        stopListening = null;
      };
    } else if (!want && stopListening) {
      stopListening();
    }
  }

  function listen() {
    mounted += 1;
    hold();

    return () => {
      mounted -= 1;
      hold();
    };
  }

  /* ---------------- a style's value from a field ---------------- */

  const boundNow = () => eachState(readBound);

  /** Whether a field may give the property its value: the rule has to be this one section's alone. */
  function bindable(property) {
    rev.value;

    return kind.value === 'id' && !!idInfo()?.fields && !!fieldsFor(property) && !isLocked();
  }

  const isLocked = () => ask('dock:is-locked') === true;

  /** The field a Style field shows instead of its value, or ''. `current`: the class it would show, which may stand nearer. */
  function boundOf(property, twin = '', current = null) {
    rev.value;

    const decls = boundNow();

    if (!decls.length) {
      return '';
    }

    const chain = variantChain(rows(), port.size(), stateNow.value);
    const keyOf = (decl) => variantKey(decl.size, decl.suffix);

    // All four sides from one field: the side shows through to it, as to a value.
    if (current && propOfBound(current.name) && ![property, twin].includes(propOfBound(current.name))) {
      return boundLabel(decls.find((decl) => decl.prop === propOfBound(current.name) && keyOf(decl) === current.key)?.value);
    }

    const at = chain.findIndex((key) => decls.some((decl) => keyOf(decl) === key && [property, twin].includes(decl.prop)));

    if (at === -1 || (current && chain.indexOf(current.key) !== -1 && chain.indexOf(current.key) < at)) {
      return '';
    }

    return boundLabel(decls.find((decl) => keyOf(decl) === chain[at] && [property, twin].includes(decl.prop)).value);
  }

  /** The dock's list of fields beside the icon, of the kinds that fit: a pick is written as the style's value. */
  function pickFieldFor(anchor, property, twin = '') {
    const prop = twin || property;
    const fits = fieldsFor(prop);

    if (!fits || !selector.value) {
      return;
    }

    const at = picked();

    port.pickField(anchor, port.selectedPath(), fits.types, (tag) => {
      const name = tag.replace(/^\{\{\s*|\s*\}\}$/g, '');
      let unit = 'rem';

      try {
        unit = win.localStorage.getItem(UNIT_KEY) || unit;
      } catch {
        /* the default */
      }

      Promise.resolve(ask('dock:data-model', { at: at?.node.from })).then((model) => {
        const rowsOf = [...(model?.section || []), ...(model?.page || []).flatMap((group) => group.items || []), ...(model?.site || []).flatMap((group) => group.items || [])];
        const type = rowsOf.find((row) => row.var === name)?.type || '';

        write([{ prop, value: boundValue(prop, tag, { type, current: lookup(name) ?? '', unit }) }]);
      });
    }, { single: !!fits.single });
  }

  /* ---------------- what the panel's target row works with ---------------- */

  const target = {
    kind,
    notice,
    asked,
    selector,
    choose(next) {
      kind.value = next === 'id' || next === 'data' ? next : 'class';
      notice.value = '';

      try {
        win.localStorage.setItem(KIND_KEY, kind.value);
      } catch {
        /* lasts this visit */
      }

      own.value += 1;
    },
    /** Whether the picked element is a tag of the file's: a name can go on it. */
    usable: () => (rev.value, !!picked()),
    classes: () => (rev.value, classNames()),
    open: () => (rev.value, classOpen()),
    openClass(name) {
      const next = new Map(chosen.value);

      next.set(port.selectedPath(), name);
      chosen.value = next;
      notice.value = '';
      own.value += 1;
    },
    /** The element's ID as it is written (`id-{{ id }}`), or ''. */
    id: () => (rev.value, idOf()),
    addClass(text) {
      const at = picked();
      const name = sanitizeCssClassName(text);

      if (!at || !name) {
        notice.value = port.t('css_mode_bad_name');

        return false;
      }

      const out = addBracketClassToTag(at.html, at.node.from, at.node.openTo, name);

      if (out.html === at.html || !port.write(out.html, { select: at.path })) {
        notice.value = port.t(out.html === at.html ? 'css_mode_class_refused' : 'css_mode_locked');

        return false;
      }

      target.openClass(name);

      return true;
    },
    idInfo: () => (rev.value, idInfo()),
    /** How a new ID is made: unique per section, or a name of the author's. */
    idMode,
    canBeDynamic: () => (rev.value, canBeDynamic()),
    /** Data: the conditions on offer — `{ id, label, on, own }` — and the one open. */
    dataConditions: () => {
      rev.value;
      dataModel.value;

      return dataConditions().map((cond) => ({
        id: cond.id,
        label: cond.value === null ? `data-${cond.key}` : `data-${cond.key} = ${cond.value}`,
        on: cond.own ? '' : cond.tag,
        own: cond.own,
      }));
    },
    dataOpen: () => {
      rev.value;
      dataModel.value;
      chosenData.value;

      return dataOpen()?.id || '';
    },
    openData(id) {
      const next = new Map(chosenData.value);

      next.set(port.selectedPath(), id);
      chosenData.value = next;
      notice.value = '';
      own.value += 1;
    },
    /** Why nothing can be written on the picked element right now, as a language key; '' when it can. */
    blocked: () => {
      rev.value;

      if (!picked()) {
        return 'css_mode_not_element';
      }

      if (kind.value === 'data') {
        dataModel.value;
        chosenData.value;

        return dataBlocked();
      }

      if (kind.value === 'id') {
        return idInfo()?.kind === 'loop' ? 'css_mode_id_loop' : selector.value ? '' : 'css_mode_need_id';
      }

      if (!selector.value) {
        return 'css_mode_need_class';
      }

      return isFileRoot() && /@scope\b/i.test(fullCss()) ? 'css_mode_root_scope' : '';
    },
    /** A click on the fields while they are off: the name field takes the caret. */
    ask() {
      asked.value += 1;
    },
    /** The file's outermost element takes the section's own ID, not a name. */
    isRoot: () => (rev.value, isFileRoot() && canBeDynamic()),
    addSectionId() {
      const at = picked();

      if (!at || idOf()) {
        return false;
      }

      if (!port.write(withAttribute(at.html, at.node, 'id', 'id-{{ id }}'), { select: at.path })) {
        notice.value = port.t('css_mode_locked');

        return false;
      }

      notice.value = '';
      own.value += 1;

      return true;
    },
    addId(text) {
      const at = picked();
      const name = sanitizeCssClassName(text);

      if (!at || !name || idOf()) {
        notice.value = port.t('css_mode_bad_name');

        return false;
      }

      const roots = parseTemplateTree(at.html);

      // An ID in a loop would stand on every round of it.
      if (inLoop(roots, at.path)) {
        notice.value = port.t('css_mode_id_loop');

        return false;
      }

      const raw = idMode.value === 'dynamic' && canBeDynamic() ? `${name}-{{ id }}` : name;

      if (idTaken(at.html, raw)) {
        notice.value = port.t('css_mode_id_taken', { name });

        return false;
      }

      if (!port.write(withAttribute(at.html, at.node, 'id', raw), { select: at.path })) {
        notice.value = port.t('css_mode_locked');

        return false;
      }

      notice.value = '';
      own.value += 1;

      return true;
    },
    /** A new name: on the element and in every rule that names it, in one go. */
    renameId(text) {
      const at = picked();
      const info = idInfo();
      const name = sanitizeCssClassName(text);

      if (!at || !info || !['dynamic', 'own'].includes(info.kind) || !name) {
        notice.value = port.t('css_mode_bad_name');

        return false;
      }

      const raw = info.kind === 'dynamic' ? `${name}-{{ id }}` : name;

      if (raw === info.raw) {
        return true;
      }

      if (idTaken(at.html, raw, info.raw)) {
        notice.value = port.t('css_mode_id_taken', { name });

        return false;
      }

      if (!port.write(withAttribute(at.html, at.node, 'id', raw), { select: at.path })) {
        notice.value = port.t('css_mode_locked');

        return false;
      }

      const before = `#${info.raw}`;
      const after = `#${raw}`;

      ask('dock:set-css', renameSelector(fullCss(), before, after));

      if (paint.selectors().includes(before)) {
        paint.forget(before);
        paint.remember(after, at.path);
      }

      notice.value = '';
      own.value += 1;
      paint.sync(fullCss(), rows());
      emit('css-mode:changed');

      return true;
    },
  };

  /* ---------------- the port ---------------- */

  return Object.create(port, Object.getOwnPropertyDescriptors({
    rev,
    cssTarget: target,
    /* The Tailwind pane's words for its state menu name its `prose-*`, which is no state here. */
    t: (key, replace) => port.t(key === 'state_title' ? 'css_mode_state' : key, replace),
    /* A style's value from a field: the icon the fields draw, and what it does. */
    bindIcon: BuildDataBind,
    bindable,
    boundOf,
    pickFieldFor,
    pickedClasses: () => (rev.value, dressed.value),
    propertyOf,
    /* A value from a field on a field that is one utility: it counts as that utility's. */
    utilityRoot: (name) => propOfBound(name) || port.utilityRoot(name),
    bindsUtility: (field) => field.label === 'rotate',
    colorOf(name) {
      const prop = propOfBound(name);

      return prop ? port.seen?.(prop, prop)?.raw || '' : port.colorOf(name);
    },
    /** A value from a field: its hover says so, what the element shows is still read. */
    seen(property, scaleProperty, shown = '') {
      if (boundOf(property, scaleProperty === property ? '' : scaleProperty)) {
        return { grey: '', raw: port.seen(property, scaleProperty)?.raw || '', tip: port.t('css_mode_field_value') };
      }

      return port.seen(property, scaleProperty, shown);
    },
    /** The image field opens empty on a value from a field: it holds no file of its own. */
    mountField(el, options) {
      return port.mountField(el, { ...options, value: String(options?.value || '') === BOUND ? '' : options?.value });
    },
    activeClass,
    setClass,
    setFieldClass,
    openValueMenu,
    /* The pane's list and its open class are the Tailwind side's: the fields see none here. */
    classesShown: ref(false),
    classes: {
      ...port.classes,
      target: () => '',
      empty: () => true,
      ownCss: () => false,
      picking: () => false,
      startPicking() {},
      stopPicking() {},
      edit() {},
    },
    /* A rule's state, as the dock's CSS pane lists them. Tailwind's `prose-*` is no state of a rule. */
    state: () => (rev.value, stateNow.value),
    openStateMenu(anchor) {
      closeMenu();

      const menu = win.document.createElement('div');

      menu.id = MENU_ID;
      win.document.body.appendChild(menu);
      menu._sveApp = mountSurface(TwClassMenu, menu, {
        title: port.t('css_mode_state'),
        removeLabel: port.t('state_normal'),
        options: CSS_STATES.map((state) => ({ label: state, css: cssStateSuffix(state), color: '', active: state === stateNow.value })),
        onPick(label) {
          closeMenu();
          stateNow.value = label;
          own.value += 1;
        },
        onRemove() {
          closeMenu();
          stateNow.value = '';
          own.value += 1;
        },
      });
      place(menu, anchor);

      const onDown = (event) => {
        if (!menu.contains(event.target) && !anchor.contains(event.target)) {
          closeMenu();
        }
      };

      win.document.addEventListener('pointerdown', onDown, true);
      menu._sveClose = () => win.document.removeEventListener('pointerdown', onDown, true);
    },
    run(item, anchor) {
      if (!item) {
        return '';
      }

      if (item.twClass) {
        setClass(item.twClass);

        return 'set';
      }

      if (item.twGroup || item.tw) {
        openValueMenu(anchor, { names: item.twGroup || null, property: item.tw, title: item.title });

        return 'menu';
      }

      return '';
    },
    active(item) {
      rev.value;

      if (!item) {
        return false;
      }

      if (item.twClass) {
        return dressed.value.includes(keyNow() ? `${keyNow()}:${item.twClass}` : item.twClass);
      }

      if (item.twGroup) {
        return item.twGroup.some((name) => dressed.value.includes(keyNow() ? `${keyNow()}:${name}` : name));
      }

      return !!(item.tw && activeClass(item.tw));
    },
    listen,
    closeMenu,
    leave() {
      closeMenu();
      paint.clear();
      hold();
    },
  }));
}
