/**
 * Style's port with the writing turned toward CSS: the same fields, handed this
 * instead of the Tailwind pane's functions.
 *
 * Owner: Build mode, the CSS mode demo (resources/js/build-mode/css-mode/).
 * May import: vue, cp/bus.js, cp/mount.js, the read-only parts of css-scope.js,
 *   tw-families.js, tw-parse.js, html-tree-parse.js and build-mode/; never a
 *   function of tw-classes.js. Nothing here writes a class or says `tw:changed`.
 * Bus: asks `dock:css`, `dock:set-css`, `dock:is-locked`, `dock:current-uid`;
 *   listens to `dock:saved`.
 *
 * A field asks the port for the picked element's classes and hands it a class to
 * set. So the port answers with the declarations of the rule being edited,
 * dressed as classes (`padding-top: 5rem` is `pt-[5rem]`), and takes a class by
 * what it compiles to. Only the reading and the writing change: the site's scale,
 * the sizes and the value an element shows are the real port's.
 *
 * What is edited is one selector: a `[ name ]` class of the element, or its one
 * ID. With neither, a click writes nothing and the panel asks for a name. An ID
 * is the section's own (`id-{{ id }}`), one made unique per section
 * (`name-{{ id }}`) or one of the author's (`name`). On the first two, whose
 * rule is this one section's alone, a style can take its value from a field. The
 * rules reach the file through the dock's own door (`dock:set-css`), so they are
 * saved as anything typed in the CSS pane is, and the canvas shows them the same
 * frame through a sheet of this module's (css-mode/paint.js).
 */

import { computed, ref, watch } from 'vue';
import { ask, on } from '../../cp/bus.js';
import { mountSurface } from '../../cp/mount.js';
import TwClassMenu from '../../cp/surfaces/TwClassMenu.vue';
import { panelValues } from '../../cp/panel/store.js';
import BuildDataBind from '../../cp/surfaces/BuildDataBind.vue';
import { addBracketClassToTag, bracketTokens, sanitizeCssClassName } from '../../css-scope.js';
import { newSizeQuery } from '../../dock/css-sizes.js';
import { currentSectionValues } from '../../dock/scope.js';
import { parseTemplateTree } from '../../html-tree-parse.js';
import { loadFamilies } from '../../tw-families.js';
import { splitClass, splitUtility } from '../../tw-parse.js';
import { readAttribute, withAttribute } from '../attrs.js';
import { BUILD_CANVAS_SHOWN_EVENT } from '../../lib/build-canvas-ids.js';
import { buildCanvasFrame } from '../../lib/build-canvas.js';
import { fieldLookup } from '../canvas-paint.js';
import { effectiveClass, fromClass, rootOf, variantChain } from '../classes.js';
import { findByPath, parentOf } from '../place.js';
import { createCssPaint } from './paint.js';
import { readBound, readRule, renameSelector, sizeKey, writeDeclarations } from './rules.js';
import { boundLabel, boundValue, classToCss, cssToClass, fieldsFor, fillValue } from './translate.js';

const MENU_ID = '__sve-css-mode-menu';
const KIND_KEY = 'sve-style-css-target';
/** The unit Spacing's box drags in (BuildSpacingBox.vue): a number from a field is in it too. */
const UNIT_KEY = 'sve-build-spacing-unit';
const SECTION_ID = /^id-\{\{\s*id\s*\}\}$/;
const DYNAMIC_ID = /^([a-zA-Z_][\w-]*)-\{\{\s*id\s*\}\}$/;

const ports = new WeakMap();

/** The CSS port for a Build port: one, so what it has written outlives the element picked. */
export function cssPortFor(win, port) {
  if (!ports.has(port)) {
    ports.set(port, createCssPort(win, port));
  }

  return ports.get(port);
}

function inLoop(nodes, path) {
  return (nodes || []).some((row) => path.startsWith(`${row.path}/`) && ((row.kind === 'antlers' && row.antlers === 'loop') || inLoop(row.children, path)));
}

function createCssPort(win, port) {
  const own = ref(0);
  const rev = computed(() => port.rev.value + own.value);
  const model = ref(null);
  const lookup = (body) => fieldLookup(currentSectionValues(win) || {}, panelValues() || {})(body);
  const paint = createCssPaint(win, (value) => fillValue(value, lookup));
  const kind = ref(readKind());
  const chosen = ref(new Map());
  const idMode = ref('dynamic');
  const notice = ref('');
  /** Moves when a click found nothing to write in: the panel's name field takes the caret. */
  const asked = ref(0);
  let uid = null;

  void loadFamilies(win).then((loaded) => {
    model.value = loaded;
  });

  function readKind() {
    try {
      return win.localStorage.getItem(KIND_KEY) === 'id' ? 'id' : 'class';
    } catch {
      return 'class';
    }
  }

  const cssOf = (name) => model.value?.catalog.css(name) || '';
  const rows = () => port.sizes();
  const fullCss = () => String(ask('dock:css') || '');
  const catalog = { scale: (property) => port.scale(property), cssOf };

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

  const selector = computed(() => {
    rev.value;

    if (kind.value === 'id') {
      const id = idOf();

      return id ? `#${id}` : '';
    }

    const name = classOpen();

    return name ? `.${name}` : '';
  });

  /* ---------------- reading: the rule, dressed as classes ---------------- */

  const declared = computed(() => {
    rev.value;

    return selector.value ? readRule(fullCss(), selector.value, rows()) : [];
  });

  const dressed = computed(() => {
    if (!model.value) {
      return [];
    }

    return declared.value.map((decl) => {
      const name = cssToClass(decl.prop, decl.value, catalog);
      const variant = decl.size ? rows().find((row) => row.handle === decl.size)?.tw : '';

      return variant ? `${variant}:${name}` : name;
    });
  });

  const sizeNow = () => sizeKey(rows(), port.size());
  const variantNow = () => (sizeNow() ? rows().find((row) => row.handle === sizeNow())?.tw || '' : '');

  function activeClass(property) {
    rev.value;

    return effectiveClass(dressed.value.join(' '), [property], [variantNow()], port.propertyOf)?.name || '';
  }

  /* ---------------- writing ---------------- */

  function whereNow() {
    const size = sizeNow();
    const row = rows().find((item) => item.handle === size);

    return { selector: selector.value, size, rows: rows(), query: row ? newSizeQuery(row, fullCss()) : '' };
  }

  function canWrite() {
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

  function write(updates) {
    if (!canWrite() || !updates.length) {
      return;
    }

    followFile();

    const css = fullCss();
    const next = writeDeclarations(css, whereNow(), updates);

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
  }

  const baseOf = (raw) => splitUtility(splitClass(raw).base).name || splitClass(raw).base;

  function declarationsOfClass(name) {
    const decls = classToCss(baseOf(name), cssOf);

    if (!decls) {
      notice.value = port.t('css_mode_no_css', { name: baseOf(name) });
    }

    return decls;
  }

  /** The updates that put `name` in the place of `raw`: what it alone set comes out. */
  function updatesFor(name, raw) {
    const decls = name ? declarationsOfClass(name) : [];

    if (!decls) {
      return null;
    }

    const gone = raw ? classToCss(baseOf(raw), cssOf) || [] : [];

    return [
      ...gone.filter((old) => !decls.some((decl) => decl.prop === old.prop)).map((old) => ({ prop: old.prop, value: null })),
      ...decls.map((decl) => ({ prop: decl.prop, value: decl.value })),
    ];
  }

  /** As the pane's own click: set, or taken off when it is what stands here already. */
  function setClass(name) {
    const decls = declarationsOfClass(name);

    if (!decls) {
      return;
    }

    const here = declared.value.filter((decl) => decl.size === sizeNow());
    const on = decls.every((decl) => here.some((one) => one.prop === decl.prop && one.value === decl.value));

    write(decls.map((decl) => ({ prop: decl.prop, value: on ? null : decl.value })));
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
      const decls = classToCss(name, cssOf);

      if (decls) {
        const label = fromClass(name, root) || name;

        byLabel.set(label, name);
        options.push({
          label,
          css: decls.map((decl) => `${decl.prop}: ${decl.value}`).join('; '),
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
      const updates = label ? updatesFor(nameOf(label), mine?.raw) : null;
      const css = fullCss();

      paint.remember(selector.value, port.selectedPath());
      hold();
      paint.sync(updates ? writeDeclarations(css, whereNow(), updates) : css, rows());
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

            return name && classToCss(name, cssOf) ? name : '';
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
          write((classToCss(baseOf(mine.raw), cssOf) || []).map((decl) => ({ prop: decl.prop, value: null })));
        } else {
          // Nothing by hand here: Remove lets go of the field, if one gives this value.
          const names = [property, title].filter(Boolean);

          write(boundNow().filter((decl) => decl.size === sizeNow() && names.includes(decl.prop)).map((decl) => ({ prop: decl.prop, value: null })));
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

    return JSON.stringify(paint.selectors().flatMap((name) => readBound(fullCss(), name, rows()).map((decl) => fillValue(decl.value, lookup))));
  };

  function hold() {
    const want = mounted > 0 || paint.selectors().length > 0;

    if (want && !stopListening) {
      const stopSaved = on('dock:saved', refresh);
      const stopForm = watch(formNow, () => paint.sync(fullCss(), rows()));

      win.addEventListener(BUILD_CANVAS_SHOWN_EVENT, onCanvas);
      stopListening = () => {
        stopSaved();
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

  const boundNow = () => {
    rev.value;

    return selector.value ? readBound(fullCss(), selector.value, rows()) : [];
  };

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

    const chain = variantChain(rows(), port.size(), '');
    const keyOf = (size) => (size ? rows().find((row) => row.handle === size)?.tw || '' : '');
    const at = chain.findIndex((key) => decls.some((decl) => keyOf(decl.size) === key && [property, twin].includes(decl.prop)));

    if (at === -1 || (current && chain.indexOf(current.key) !== -1 && chain.indexOf(current.key) < at)) {
      return '';
    }

    return boundLabel(decls.find((decl) => keyOf(decl.size) === chain[at] && [property, twin].includes(decl.prop)).value);
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
      kind.value = next === 'id' ? 'id' : 'class';
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

      return true;
    },
  };

  /* ---------------- the port ---------------- */

  return Object.create(port, Object.getOwnPropertyDescriptors({
    rev,
    cssTarget: target,
    /* A style's value from a field: the icon the fields draw, and what it does. */
    bindIcon: BuildDataBind,
    bindable,
    boundOf,
    pickFieldFor,
    pickedClasses: () => (rev.value, dressed.value),
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
    /* A state is not part of this first demo: what is written is the plain rule. */
    state: () => '',
    openStateMenu() {},
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
        return dressed.value.includes(variantNow() ? `${variantNow()}:${item.twClass}` : item.twClass);
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
