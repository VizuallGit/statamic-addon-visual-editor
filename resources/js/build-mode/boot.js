/**
 * Build mode's lazy entry: the Build panel in the left column, on a port
 * built from the editor itself.
 *
 * Owner: Build mode (resources/js/build-mode/).
 * Loaded by lazy-panels.js (key `build_mode`) the first time Build is
 * switched on; Content never loads this chunk, nor anything only it imports.
 * May import: cp/bus.js, cp/mount.js, lib/i18n.js, breakpoints.js,
 *   html-tree-icons.js, html-tree-parse.js, html-tree-edit.js, code-dock.js
 *   (constants only — Build writes the dock's file, so the dock is loaded in
 *   Build anyway), tw-classes.js, tw-tool.js, tw-families.js, build-mode/*,
 *   cp/surfaces/BuildPanel.vue.
 * Bus: asks `dock:html`, `dock:set-html`, `lp:set-device`; listens to
 *   `dock:html-changed`, `tw:changed`, `lp:device`.
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
 *   select(path)              pick a row the way a click in the tree does —
 *                             the tree, the preview, the dock's cursor and
 *                             tw-classes.js's picked tag all follow it
 *   onSelect(fn) → unhook     a pick made anywhere else
 *   setPlus? / plusPath?      a + target set from the tree or the preview
 *   setSize?(handle)          the pane's own size door; default `lp:set-device`
 *   logic?(kind, def)         the dock's ∞ / if path, which opens the inspector
 *   mountFields?(el, node)    a component's fields (the props panel) → unmount
 *   mountSettings?(el, node)  a loop's or condition's settings (the tree's inspector) → unmount
 */

import { ref } from 'vue';
import { ask, on } from '../cp/bus.js';
import { mountSurface } from '../cp/mount.js';
import { t as sveT } from '../lib/i18n.js';
import { breakpoints } from '../breakpoints.js';
import { HTML_ICONS } from '../html-tree-icons.js';
import { parseTemplateTree } from '../html-tree-parse.js';
import { deleteHtml, duplicateHtml } from '../html-tree-edit.js';
import { CSS_TOOLS, CSS_TOOL_ICONS, HTML_DIVS, HTML_HEADINGS, HTML_TOOLS, TW_TOOL_ICONS } from '../code-dock.js';
import {
  twActiveClass,
  twAddClass,
  twOpenToolMenu,
  twPickedClasses,
  twReplaceClasses,
  twSetClass,
  twVariant,
} from '../tw-classes.js';
import { runTwTool, twToolActive } from '../tw-tool.js';
import { familyFor, loadFamilies, optionsForProperty } from '../tw-families.js';
import { addAt, findByPath } from './place.js';
import { rootFor, rootOf } from './classes.js';
import BuildPanel from '../cp/surfaces/BuildPanel.vue';

/**
 * Mount the panel into `host` (the left column's Build host).
 *
 * @returns {() => void} unmount
 */
export function mountBuildPanel(win, host, hooks = {}) {
  const port = createEditorPort(win, hooks);
  const app = mountSurface(BuildPanel, host, { port });

  return () => {
    port.dispose();
    app.unmount();
  };
}

/** The port, on the editor. Exported for the bench test. */
export function createEditorPort(win, hooks = {}) {
  const rev = ref(0);
  const plus = ref('');
  let wrote = '';
  let model = null;
  let modelWanted = false;
  /** A scale's root → its property, for a typed class the catalog has never compiled. */
  const byRoot = new Map();

  const bump = () => {
    rev.value += 1;
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

  const unhooks = [
    on('dock:html-changed', bump),
    on('tw:changed', bump),
    on('lp:device', bump),
    hooks.onSelect?.(bump),
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
      plus.value = '';
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
      if (ask('dock:set-html', next) === false) {
        return false;
      }

      wrote = select;
      plus.value = '';

      if (select) {
        hooks.select?.(select);
      }

      bump();

      return true;
    },
    justWrote: (path) => path === wrote,
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
    logic(kind, def) {
      if (hooks.logic) {
        hooks.logic(kind, def);

        return;
      }

      const out = addAt(html(), port.plusPath() || port.selectedPath(), String(def?.snippet || '').replace(/\n+$/, ''));

      if (out) {
        port.write(out.html, { select: out.path });
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
    mountFields: hooks.mountFields,
    mountSettings: hooks.mountSettings,

    /* Sizes — the Tailwind pane's list, and its door */
    sizes: rows,
    size() {
      rev.value;

      const variant = twVariant().split(':').find((part) => rows().some((row) => row.tw && row.tw === part)) || '';

      return variant ? rows().find((row) => row.tw === variant)?.handle || null : null;
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
    pickedClasses: () => (rev.value, twPickedClasses()?.raws || []),
    activeClass: (property) => (rev.value, twActiveClass(property)),
    setClass: (name) => twSetClass(win, name),
    addClass: (name) => twAddClass(win, name),
    replaceClasses: (raws, name) => twReplaceClasses(win, raws, twVariant() ? `${twVariant()}:${name}` : name),
    openMenu: (property, anchor) => twOpenToolMenu(win, anchor, property),
    run: (item, anchor) => runTwTool(win, item, anchor),
    active: (item) => (rev.value, twToolActive(item)),

    dispose() {
      unhooks.forEach((unhook) => unhook());
    },
  };

  return port;
}
