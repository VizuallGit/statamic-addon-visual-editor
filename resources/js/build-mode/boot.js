/**
 * Build mode's lazy entry: the Build panel in the left column, on a port
 * built from the editor itself (Visual Build), or the canvas alone on a port
 * that only shows and picks (HTML Build, `mountBuildView`).
 *
 * Owner: Build mode (resources/js/build-mode/).
 * Loaded by lazy-panels.js (key `build_mode`) the first time a Build is
 * switched on; Content never loads this chunk, nor anything only it imports.
 * May import: cp/bus.js, cp/mount.js, cp/build-mode/store.js, lib/i18n.js,
 *   breakpoints.js, html-tree-icons.js, html-tree-parse.js, html-tree-edit.js,
 *   code-dock.js (constants only — Build writes the dock's file, so the dock
 *   is loaded in Build anyway), tw-classes.js, tw-tool.js, tw-families.js,
 *   logic-popup.js, build-mode/*, cp/surfaces/BuildPanel.vue.
 * Bus: asks `dock:html`, `dock:set-html`, `lp:set-device`; listens to
 *   `dock:html-changed`, `tw:changed`, `lp:device`. The canvas (canvas.js)
 *   asks and listens for itself.
 *
 * The canvas stands over the preview while either Build is on
 * (`buildModeUi.mode`), not while the panel is mounted: a column Statamic
 * re-renders mounts the panel again, a switch between the two Builds hands
 * the canvas from one port to the other, and the page under it stays as it was.
 *
 * The port is everything the panel may touch (BuildPanel.vue says what it
 * reads). Nothing in it is Build's own logic: the lists and icons are the
 * dock's, the class edits are the Tailwind pane's (tw-classes.js, tw-tool.js),
 * the file is written through `dock:set-html` as a class from the pane is,
 * and the sizes are the pane's. The harness page (tests/harness/build-mode)
 * builds the same port on a file in memory.
 *
 * What lives in existing code comes in as `hooks`, wired by the host:
 *
 *   selectedPath()            the HTML tree's picked row (`path`)
 *   keepPickAt?(from)         after a write that renames the picked row (its
 *                             tag), stand on the element that starts at `from`
 *   select(path)              pick a row the way a click in the tree does —
 *                             the tree, the preview, the dock's cursor and
 *                             tw-classes.js's picked tag all follow it
 *   onSelect(fn) → unhook     a pick made anywhere else
 *   setPlus? / plusPath?      a + target set from the preview
 *
 * `drag(event, item)` hands a tile pressed in Add to the canvas
 * (canvas-ui.js); false when Build has no canvas to drop on. `openPlus(path)`
 * is a + pressed on the canvas: Add's target, shown in the panel — Add opens
 * and flashes (`pointed` counts the presses; BuildPanel.vue).
 *   setSize?(handle)          the pane's own size door; default `lp:set-device`
 *   openStateMenu?(anchor)    the Tailwind pane's state menu (State | Prose) —
 *                             tw-classes.js `openStateMenu`, exported for this
 *   deviceIcons?              the top bar's LP_DEVICE_ICONS (the panel may not
 *                             import the CP shell)
 *   logic?(kind, def)         the dock's ∞ / if path, which opens the inspector.
 *                             Without it the loop / if is written where Add
 *                             points, and its settings open in a popup beside
 *                             the panel, level with the tile (`at`) —
 *                             logic-popup.js
 *   mountFields?(el, node)    a component's fields (the props panel) → unmount
 *   mountSettings?(el, node)  a loop's or condition's settings (the tree's inspector) → unmount
 *
 * Without a hook the port answers from the editor itself: the state menu is
 * the Tailwind pane's (`openStateMenu`), Fields is the component's own
 * sidebar (ComponentSidebar.vue, on cp/component-props/store.js, filled when
 * the tree picks a component's call) and Settings the tree's inspector
 * (HtmlTreeInspector.vue, on htmlTreeUi.inspect) — the same panels, mounted
 * once more in Build's host.
 */

import { ref, watch } from 'vue';
import { ask, on } from '../cp/bus.js';
import { mountSurface } from '../cp/mount.js';
import { buildModeUi } from '../cp/build-mode/store.js';
import { t as sveT } from '../lib/i18n.js';
import { breakpoints } from '../breakpoints.js';
import { HTML_ICONS } from '../html-tree-icons.js';
import { flattenHtmlTree, parseHtmlTree, parseTemplateTree } from '../html-tree-parse.js';
import { deleteHtml, duplicateHtml } from '../html-tree-edit.js';
import { CSS_TOOLS, CSS_TOOL_ICONS, HTML_DIVS, HTML_HEADINGS, HTML_TOOLS, TW_TOOL_ICONS } from '../code-dock.js';
import {
  openStateMenu as twOpenStateMenu,
  renderTwClasses,
  twActiveClass,
  twColorOf,
  twOpenValueMenu,
  twPickedClasses,
  twSetClass,
  twSetTag,
  twVariant,
} from '../tw-classes.js';
import { runTwTool, twToolActive } from '../tw-tool.js';
import { openLogicPopup } from '../logic-popup.js';
import { familyFor, loadFamilies, optionsForProperty } from '../tw-families.js';
import { addAt, findByPath } from './place.js';
import { rootFor, rootOf } from './classes.js';
import { readAttribute, withAttribute } from './attrs.js';
import { startColumnsOverlay } from './columns-overlay.js';
import { CANVAS_PAINTED, startCanvas } from './canvas.js';
import { CANVAS_PATH } from './canvas-paint.js';
import BuildPanel from '../cp/surfaces/BuildPanel.vue';
import ComponentSidebar from '../cp/surfaces/ComponentSidebar.vue';
import HtmlTreeInspector from '../cp/surfaces/HtmlTreeInspector.vue';
import { mountStatamicSurface } from '../cp/mount-statamic.js';

/**
 * Mount the panel into `host` (the left column's Build host).
 *
 * @returns {() => void} unmount
 */
export function mountBuildPanel(win, host, hooks = {}) {
  const port = createEditorPort(win, hooks);
  const app = mountSurface(BuildPanel, host, { port });
  const page = buildModeUi.on ? buildCanvas(win) : null;
  const detach = page?.attach(port);
  // Columns drawn over the canvas for the pick (columns-overlay.js).
  const stopColumns = startColumnsOverlay(win, port, page ? { frame: page.frame, attr: CANVAS_PATH, updated: CANVAS_PAINTED, plus: false } : {});

  return () => {
    stopColumns();
    detach?.();
    port.dispose();
    app.unmount();
  };
}

/**
 * HTML Build: the canvas without the panel, on a port that shows the tree's
 * pick and picks by a click — no +, no drags (canvas-ui.js: a port that
 * cannot write).
 *
 * @returns {() => void} unmount
 */
export function mountBuildView(win, hooks = {}) {
  const port = createViewPort(hooks);
  const detach = buildCanvas(win).attach(port);

  return () => {
    detach();
    port.dispose();
  };
}

/** What the canvas reads off a port, and nothing more: the file, the pick, and a pick by a click. */
function createViewPort(hooks) {
  const rev = ref(0);
  const bump = () => {
    rev.value += 1;
  };
  const unhooks = [on('dock:html-changed', bump), on('tw:changed', bump), hooks.onSelect?.(bump)].filter(Boolean);

  return {
    rev,
    html() {
      const text = ask('dock:html');

      return typeof text === 'string' ? text : '';
    },
    selectedPath: () => hooks.selectedPath?.() || '',
    select: (path) => hooks.select?.(path),
    plusPath: () => '',
    dispose() {
      unhooks.forEach((unhook) => unhook());
    },
  };
}

let canvas = null;

/** The canvas, started once for a Build and stopped when Live Preview goes back to Content. */
function buildCanvas(win) {
  if (!canvas) {
    const mine = startCanvas(win);
    const stop = watch(
      () => buildModeUi.mode,
      (mode) => {
        if (mode === 'content') {
          stop();
          mine.stop();

          if (canvas === mine) {
            canvas = null;
          }
        }
      },
      { flush: 'sync' }
    );

    canvas = mine;
  }

  return canvas;
}

/** The port, on the editor. Exported for the bench test. */
export function createEditorPort(win, hooks = {}) {
  const rev = ref(0);
  const plus = ref('');
  const pointed = ref(0);
  let wrote = '';
  let model = null;
  let modelWanted = false;
  /** A scale's root → its property, for a typed class the catalog has never compiled. */
  const byRoot = new Map();

  const bump = () => {
    rev.value += 1;
  };

  // The + target is the host's when it keeps one (the tree's + sets it there).
  const clearPlus = () => {
    if (hooks.setPlus) {
      hooks.setPlus('');
    } else {
      plus.value = '';
    }
  };

  // The catalog (and with it the compiler) is asked for the first time Style
  // draws a value — never by Add, never by the switch.
  const wantModel = () => {
    if (!modelWanted) {
      modelWanted = true;
      loadFamilies(win).then((loaded) => {
        model = loaded;
        bump();
      });
    }
  };

  /*
   * The Tailwind pane's functions write on the tag tw-classes.js has picked.
   * The dock tells it from its cursor only while its own style pane is in
   * Tailwind mode (dock/style-modes.js `syncTwTarget`); Build tells it from
   * the tree's pick, every time the pick moves — the same function, the same
   * row shape (parseHtmlTree), so the pane and Build write on one tag.
   */
  const follow = () => {
    const path = hooks.selectedPath?.() || '';
    const row = path ? flattenHtmlTree(parseHtmlTree(html()), new Set()).find((item) => item.path === path) : null;

    renderTwClasses(win, row || null);
    bump();
  };

  const unhooks = [
    on('dock:html-changed', bump),
    on('tw:changed', bump),
    on('lp:device', bump),
    hooks.onSelect?.(follow),
  ].filter(Boolean);

  const html = () => {
    const text = ask('dock:html');

    return typeof text === 'string' ? text : '';
  };
  const picked = () => {
    const path = hooks.selectedPath?.() || '';

    return path ? findByPath(parseTemplateTree(html()), path) : null;
  };
  const rows = () => breakpoints(win);
  const strings = () => win.Statamic?.$config?.get?.('sveBuildStrings') || {};

  const port = {
    rev,
    lists: {
      htmlTools: HTML_TOOLS,
      divs: HTML_DIVS,
      headings: HTML_HEADINGS,
      cssTools: CSS_TOOLS,
      toolIcons: { ...CSS_TOOL_ICONS, ...TW_TOOL_ICONS },
      htmlIcons: HTML_ICONS,
      deviceIcons: hooks.deviceIcons || {},
    },

    /** Build's own strings (`sve::build`), then the editor's — the dock's lang keys among them. */
    t(key, replace = {}) {
      rev.value;

      let out = strings()[key];

      if (out === undefined) {
        return sveT(win, key, replace);
      }

      for (const [name, value] of Object.entries(replace)) {
        out = String(out).replaceAll(`:${name}`, value);
      }

      return out;
    },

    /* The file, the pick and the + target */
    html,
    selectedPath: () => (rev.value, hooks.selectedPath?.() || ''),
    plusPath: () => (hooks.plusPath ? hooks.plusPath() : plus.value),
    select(path) {
      clearPlus();
      hooks.select?.(path || '');
      bump();
    },
    setPlus(path) {
      if (hooks.setPlus) {
        hooks.setPlus(path || '');
      } else {
        plus.value = path || '';
      }

      if (path) {
        hooks.select?.(path);
      }

      bump();
    },
    write(next, { select = '' } = {}) {
      // The dock's lock is the file's: nothing is written past it.
      if (ask('dock:is-locked') === true || ask('dock:set-html', next) === false) {
        return false;
      }

      wrote = select;
      clearPlus();

      if (select) {
        hooks.select?.(select);
      }

      bump();

      return true;
    },
    justWrote: (path) => path === wrote,
    drag: (event, item) => !!canvas?.dragNew(event, item),
    /** A + on the canvas: Add takes its place, and the panel shows it took it. */
    pointed,
    openPlus(path) {
      port.setPlus(path);
      pointed.value += 1;
    },
    sectionTag: () => String(win.Statamic?.$config?.get?.('sveSectionTag') || ''),
    mobileVariant: () => rows()[rows().length - 1]?.tw || 'max-md',
    components() {
      return win
        .fetch('/!/sve/components', {
          credentials: 'same-origin',
          headers: { 'X-Requested-With': 'XMLHttpRequest', Accept: 'application/json' },
        })
        .then((res) => (res.ok ? res.json() : { items: [] }))
        .then((data) => (Array.isArray(data.items) ? data.items : []));
    },
    logic(kind, def, at) {
      if (hooks.logic) {
        hooks.logic(kind, def);

        return;
      }

      const out = addAt(html(), port.plusPath() || port.selectedPath(), String(def?.snippet || '').replace(/\n+$/, ''));

      if (out && port.write(out.html, { select: out.path }) && at) {
        openLogicPopup(win, { path: out.path, at, beside: at.closest('[data-sve-build-root]') });
      }
    },
    duplicate() {
      const node = picked();

      if (node) {
        port.write(duplicateHtml(html(), node), { select: node.path });
      }
    },
    remove() {
      const node = picked();

      if (node) {
        port.write(deleteHtml(html(), node));
      }
    },
    setTag(name) {
      // The tree names a row by its tag, so h1 → h2 is a new row to it: the
      // pick would be lost. The element starts where it started, and the tree
      // stands on what starts there once the file lands (`keepPickAt`).
      const node = picked();

      if (node) {
        hooks.keepPickAt?.(node.from);
      }

      twSetTag(win, name);
    },
    attr: (name) => {
      const node = picked();

      return node ? readAttribute(html(), node, name) : null;
    },
    setAttr(name, value) {
      const node = picked();

      if (node) {
        port.write(withAttribute(html(), node, name, value), { select: node.path });
      }
    },
    mountFields: hooks.mountFields || ((el) => unmounter(mountStatamicSurface(ComponentSidebar, el))),
    mountSettings: hooks.mountSettings || ((el) => unmounter(mountStatamicSurface(HtmlTreeInspector, el))),

    /* Sizes — the Tailwind pane's list, and its door */
    sizes: rows,
    size() {
      rev.value;

      const variant = twVariant().split(':').find((part) => rows().some((row) => row.tw && row.tw === part)) || '';

      return variant ? rows().find((row) => row.tw === variant)?.handle || null : null;
    },
    /** The pane's state (`hover`, `prose-p`): the variant tw-classes.js writes, less its size. */
    state() {
      rev.value;

      return twVariant()
        .split(':')
        .filter((part) => part && !rows().some((row) => row.tw && row.tw === part))
        .join(':');
    },
    openStateMenu(anchor) {
      if (hooks.openStateMenu) {
        hooks.openStateMenu(anchor);
      } else {
        twOpenStateMenu(win, anchor);
      }
    },
    setSize(handle) {
      if (hooks.setSize) {
        hooks.setSize(handle);
      } else {
        const row = rows().find((item) => item.handle === handle);

        ask('lp:set-device', { win, key: row && !row.base ? row.device : 'Responsive' });
      }

      bump();
    },

    /* Classes — the Tailwind pane's functions, on the tag tw-classes.js has picked */
    scale(property) {
      if (!model) {
        wantModel();

        return [];
      }

      const names = optionsForProperty(property, model).map((option) => option.label);
      const root = rootOf(names);

      if (root && !byRoot.has(root)) {
        byRoot.set(root, property);
      }

      return names;
    },
    propertyOf(name) {
      if (!model) {
        wantModel();

        return '';
      }

      return familyFor(name, model)?.label || byRoot.get(rootFor(name)) || '';
    },
    /** The colour a class paints with — the dot the Tailwind pane's menu draws beside it. */
    colorOf: (name) => (rev.value, twColorOf(win, name)),
    pickedClasses: () => (rev.value, twPickedClasses()?.raws || []),
    activeClass: (property) => (rev.value, twActiveClass(property)),
    setClass: (name) => twSetClass(win, name),
    /** A value field's menu — a scale, or a group named by hand: the pane's popover, search and preview, written as the field writes. */
    openValueMenu: (anchor, options) => twOpenValueMenu(win, anchor, options),
    run: (item, anchor) => runTwTool(win, item, anchor),
    active: (item) => (rev.value, twToolActive(item)),

    dispose() {
      unhooks.forEach((unhook) => unhook());
    },
  };

  if (hooks.selectedPath) {
    follow();
  }

  return port;
}

/** A mounted app as the port's unmount function. */
function unmounter(app) {
  return () => {
    try {
      app?.unmount();
    } catch {
      /* already gone with its host */
    }
  };
}
