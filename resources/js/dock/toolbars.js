/**
 * code-dock.js — region "toolbars", split out in WP5. Same statements, same order;
 * only the imports are new. See the barrel code-dock.js for what the shell exports.
 */
import { chromeGet, chromeSet } from '../chrome-prefs.js';
import { mountPane } from '../cp/mount-pane.js';
import CodeDockHtmlTools from '../cp/surfaces/CodeDockHtmlTools.vue';
import CodeDockCssTools from '../cp/surfaces/CodeDockCssTools.vue';
import { cssToolsUi } from '../cp/css/tools.js';
import { HTML_ICONS, TEXT_TAGS } from '../html-tree-icons.js';
import { closeTwMenu, twOpenToolMenu, twSetClass } from '../tw-classes.js';
import { breakpoints } from '../breakpoints.js';
import { t } from '../lib/i18n.js';
import { dockState } from '../dock/state.js';
import { CSS_LENGTHS, CSS_MENU_ID, CSS_TOOL_INDEX, HTML_HEADINGS, HTML_TOOLS, STYLE_MODE_KEY, VALUES_MODE_KEY } from '../code-dock.js';
import { CSS_SIZE_KEY, CSS_STATES, CSS_STATE_KEY, applyStyleMode, paintValuesMode, setValuesMode } from './style-modes.js';
import { applyDisplay, applyFlexDirection, applyRuleDecls, closeCssMenu, currentFlexDecls, normalizeFlexValue, openCssChoiceMenu, openCssColorMenu, openCssSpacingMenu, openCssValueMenu, paintCssToolState } from './css-tools.js';
import { applyHtmlTag, finishHtmlEdit, insertHtmlElement, openHtmlComponentMenu, openHtmlTagMenu, tidyHtmlPane } from './html-tools.js';
import { watchScrollEdges, watchScrollEdgesIn } from './scroll-edges.js';
import { bindAntlersSnippets, bindDataVars, bindVisualEditSnippets } from './data-vars.js';

// ===== toolbars =====
function setStyleMode(win, mode) {
  dockState.styleMode = mode === 'tw' ? 'tw' : 'css';
  chromeSet(win, STYLE_MODE_KEY, dockState.styleMode);
  applyStyleMode(win);
}

export function bindStyleMode(win, dock) {
  if (dock._sveStyleModeBound) {
    return;
  }

  dock._sveStyleModeBound = true;
  dockState.styleMode = chromeGet(win, STYLE_MODE_KEY) === 'tw' ? 'tw' : 'css';

  // The size and the state are where the reader left them. A size this site no
  // longer has falls back to All rather than to a button that cannot light up.
  const storedSize = chromeGet(win, CSS_SIZE_KEY) || '';

  dockState.cssSize = breakpoints(win).some((row) => row.handle === storedSize) ? storedSize : '';
  dockState.cssState = CSS_STATES.includes(chromeGet(win, CSS_STATE_KEY)) ? chromeGet(win, CSS_STATE_KEY) : '';

  dockState.cssValues = chromeGet(win, VALUES_MODE_KEY) === '1';

  dock.querySelector('[data-sve-style-mode]')?.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    setStyleMode(win, dockState.styleMode === 'tw' ? 'css' : 'tw');
  });

  dock.querySelector('[data-sve-values-mode]')?.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    setValuesMode(win, !dockState.cssValues);
  });

  applyStyleMode(win);
  paintValuesMode(win);
}

/**
 * One click handler for the row, and one for the children.
 *
 * A tool with children opens them; a tool without does its own thing. A child
 * does its own thing and nothing else — it never opens anything, which is why
 * there is only one level to reason about.
 */
export function bindCssTools(win, dock) {
  const host = dock.querySelector('[data-sve-css-tools]');

  if (!host || host._sveBound) {
    return;
  }

  host._sveBound = true;

  const btnFor = (id) => dock.querySelector(`[data-sve-css-tool="${id}"], [data-sve-css-kid="${id}"]`);

  /** What a click writes — the same for a tool and for one of its children. */
  const run = (item) => {
    const btn = btnFor(item.id);
    // A second click on the icon that opened the menu closes it again. Read
    // before closing, because closing is what forgets which one it was.
    const wasOpen = dockState.cssOpenMenu === item.id;

    closeCssMenu(win.document);

    if (wasOpen) {
      closeTwMenu(win);
      paintCssToolState(win);

      return;
    }

    if (!btn) {
      return;
    }

    // Only a menu is "open". A toggle does its thing and is done, so marking it
    // open would make the next click on it do nothing at all. Remembered AFTER
    // the menu is up: every opener closes whatever was there first, and that
    // is what forgets which icon it belonged to.
    const opensMenu = dockState.styleMode === 'tw'
      ? !item.twClass && !!item.tw
      : !item.kind && !item.value && !(item.css in currentFlexDecls()) && !!item.menu;
    const remember = () => {
      if (opensMenu) {
        dockState.cssOpenMenu = item.id;
      }
    };

    if (dockState.styleMode === 'tw') {
      closeTwMenu(win);

      // A fixed class is set outright; a scale opens its menu. Same two cases
      // as in CSS, where one is a value and the other is a list to pick from.
      if (item.twClass) {
        twSetClass(win, item.twClass);
        paintCssToolState(win);
      } else if (item.tw) {
        twOpenToolMenu(win, btn, item.tw, () => paintCssToolState(win));
        remember();
        paintCssToolState(win);
      }

      return;
    }

    if (item.kind === 'flexDir') {
      applyFlexDirection(item.value);

      return;
    }

    if (item.kind === 'display') {
      applyDisplay(item.value);

      return;
    }

    if (item.value) {
      // Clicking what is already set takes it off again. Every button in this
      // row is a toggle, so none of them is a surprise.
      const same = normalizeFlexValue(currentFlexDecls()[item.css]) === normalizeFlexValue(item.value);

      applyRuleDecls([{ property: item.css, value: same ? null : item.value }]);

      return;
    }

    if (item.css in currentFlexDecls()) {
      applyRuleDecls([{ property: item.css, value: null }]);
      paintCssToolState(win);

      return;
    }

    if (item.menu === 'colors') {
      openCssColorMenu(win, btn, item.css);
    } else if (item.menu === 'spacing') {
      openCssSpacingMenu(win, btn, item.css);
    } else if (item.menu === 'sizes') {
      openCssValueMenu(win, btn, item.css, CSS_LENGTHS);
    } else if (item.menu === 'choices') {
      openCssChoiceMenu(win, btn, item.css, item.choices);
    } else if (item.menu === 'values') {
      openCssValueMenu(win, btn, item.css);
    }

    remember();
    paintCssToolState(win);
  };

  cssToolsUi.onTool = (id) => {
    const tool = CSS_TOOL_INDEX.get(id)?.tool;

    if (!tool) {
      return;
    }

    if (tool.kids?.length) {
      // A tool with children is a door, not a switch.
      dockState.cssOpenTool = dockState.cssOpenTool === tool.id ? '' : tool.id;
      closeCssMenu(win.document);
      paintCssToolState(win);

      return;
    }

    run(tool);
  };

  cssToolsUi.onKid = (toolId, kidId) => {
    const found = CSS_TOOL_INDEX.get(kidId);

    if (found?.kid) {
      run(found.kid);
    }
  };

  dockState.cssToolRow = () => {
    mountPane(host, CodeDockCssTools);
    paintCssToolState(win);
  };

  dockState.cssToolRow();
  watchScrollEdges(host);
  watchScrollEdgesIn(host, '[data-sve-css-kids]');

  win.document.addEventListener(
    'mousedown',
    (event) => {
      if (event.target.closest(`#${CSS_MENU_ID}, [data-sve-css-tools], [data-sve-html-tools], [data-sve-css-add-class]`)) {
        return;
      }

      closeCssMenu(win.document);
    },
    true
  );
}

function paintHtmlTidy(win, dock) {
  const btn = dock.querySelector('[data-sve-html-tidy]');

  if (!btn) {
    return;
  }

  btn.innerHTML = HTML_ICONS.tidy || '';
  btn.title = t(win, 'code_dock_html_tidy');
  btn.setAttribute('aria-label', btn.title);
  btn.setAttribute('data-tip', btn.title);
}

export function bindHtmlTidy(win, dock) {
  const btn = dock.querySelector('[data-sve-html-tidy]');

  paintHtmlTidy(win, dock);

  if (!btn || btn._sveBound) {
    return;
  }

  btn._sveBound = true;
  btn.addEventListener('mousedown', (event) => event.preventDefault());
  btn.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    tidyHtmlPane();
  });
}

export function bindHtmlTools(win, dock) {
  const host = dock.querySelector('[data-sve-html-tools]');

  if (!host || host._sveBound) {
    return;
  }

  host._sveBound = true;

  mountPane(host, CodeDockHtmlTools, {
    tools: HTML_TOOLS.map((tool) => ({
      ...tool,
      icon: HTML_ICONS[tool.id] || '',
    })),
    onTool: (id) => {
      const tool = HTML_TOOLS.find((item) => item.id === id);
      const btn = host.querySelector(`[data-sve-html-tool="${id}"]`);

      if (!tool) {
        return;
      }

      if (tool.menu === 'heading') {
        openHtmlTagMenu(win, btn, HTML_HEADINGS);

        return;
      }

      if (tool.menu === 'text') {
        openHtmlTagMenu(win, btn, TEXT_TAGS);

        return;
      }

      if (tool.tidy) {
        tidyHtmlPane();

        return;
      }

      if (tool.menu === 'component') {
        openHtmlComponentMenu(win, btn);

        return;
      }

      closeCssMenu(win.document);

      if (tool.snippet) {
        insertHtmlElement(tool.snippet, tool.caret ?? tool.snippet.length, tool.select);
        finishHtmlEdit();

        return;
      }

      applyHtmlTag(tool.tag);
    },
  });

  watchScrollEdges(host);
  bindAntlersSnippets(win, dock);
  bindVisualEditSnippets(win, dock);
  bindDataVars(win, dock);
}
