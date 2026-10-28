/**
 * The Content | Build switch in the middle of the Live Preview top bar.
 *
 * Owner: Build mode. Drawn by ensureHeaderToolbar on every pass, and only when
 * `build_mode` is on for this user (Features::visible — it also needs the
 * dock); off, the first line returns and the bar is what it always was.
 *
 * In the top bar's own look: one group box like the sizes' (HEADER_GROUP_STYLE),
 * two framed controls in it, the picked one painted as every picked control in
 * the bar is (paintLpActiveControl). No colour of its own.
 *
 * Where it stands: in a holder that takes the free room between the icon row
 * and the right-hand cluster, centred in it — and only that room. The bar is
 * nearly full already (25 icons and the right-hand cluster leave ~120 px at
 * 1600 px), so each mode is its icon, with the words "Content | Build" beside
 * it when the holder has room for them and as tooltips when it has not: a
 * container query, so no script measures anything. The switch never pushes
 * the right-hand cluster off the screen. It never joins the right-hand
 * cluster — syncLpRightBarGaps owns that order and re-states it on every
 * pass, and a second "just before Close" placement there is what pushed two
 * buttons round each other in a ring. The cluster's `margin-left: auto` meets
 * a holder that has already taken the room, so the two never pull.
 *
 * The state lives in memory for this Live Preview (build-mode-host.js); every
 * Live Preview opens in Content, because closing one turns Build off (lp-width.js).
 *
 * The Build panel is the left column, so Build opens the column when it was
 * folded away, and Content folds it back the way it was. "Started with it
 * closed" is the shell's rule that shuts it again on the next pass
 * (lp-width.js); Build sets that aside too, and hands it back.
 */
import { sveState } from '../cp-state.js';
import { featureSaidOn } from '../lib/config.js';
import { injectStyle } from '../lib/style.js';
import { HEADER_TOOLBAR_ID } from '../lib/ids.js';
import { lpHeader } from '../lib/live-preview.js';
import { on } from '../cp/bus.js';
import { buildModeOn, setBuildMode } from '../build-mode-host.js';
import { isCodeDockArmed } from '../code-dock-state.js';
import { openHtmlTreePanel } from '../lazy/html-tree.js';
import { paintLpActiveControl, setLpCollapsed } from '../lp-panel.js';
import { FRAMED_CONTROL_STYLE, HEADER_GROUP_STYLE, toggleCodeDockButton } from './header-toolbar.js';
import { LP_DEVICE_ICONS } from './preview-chrome.js';

const SWITCH_ID = '__sve-build-switch';
const STYLE_ID = '__sve-build-switch-css';
const MODES = ['content', 'build'];
// Drawn like the toolbar's own icons (stroke 2, round): a pen writing the content, and a page laid out in blocks.
const ICONS = {
  content:
    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>',
  build:
    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="7" rx="1.5"/><rect x="3" y="14" width="10" height="7" rx="1.5"/><rect x="17" y="14" width="4" height="7" rx="1.5"/></svg>',
};

function ensureStyles(doc) {
  injectStyle(
    doc,
    STYLE_ID,
    `#${SWITCH_ID}{display:flex;flex:1 1 0;min-width:3.875rem;justify-content:center;align-items:center;container-type:inline-size}
#${SWITCH_ID} [data-sve-build-mode]{display:inline-flex;align-items:center;justify-content:center;gap:.35rem;padding:0 .5rem}
#${SWITCH_ID} [data-sve-build-mode] svg{display:block;flex:none}
@container (max-width: 11rem){
  #${SWITCH_ID} [data-sve-build-mode]{padding:0 .3rem}
  #${SWITCH_ID} [data-sve-build-mode] span{display:none}
}`
  );
}

function label(win, mode) {
  const strings = win.Statamic?.$config?.get?.('sveBuildStrings') || {};

  return strings[`mode_${mode}`] || (mode === 'build' ? 'Build' : 'Content');
}

/** The dock, then the tree: the tree only opens beside an open dock. */
function openDockAndTree(win) {
  if (!isCodeDockArmed(win)) {
    toggleCodeDockButton(win);

    const off = on('dock:html-changed', () => {
      off();

      if (buildModeOn()) {
        void openHtmlTreePanel(win);
      }
    });

    return;
  }

  void openHtmlTreePanel(win);
}

/** The column as Content left it, while Build holds it open. */
let leftAs = null;

function openColumn(win) {
  leftAs = { collapsed: sveState.lpCollapsed, enterClosed: sveState.lpEnterSidebarClosed };
  sveState.lpEnterSidebarClosed = false;

  if (sveState.lpCollapsed !== false) {
    setLpCollapsed(win, false);
  }
}

function restoreColumn(win) {
  const was = leftAs;

  leftAs = null;

  if (!was) {
    return;
  }

  sveState.lpEnterSidebarClosed = was.enterClosed;

  if (was.collapsed) {
    setLpCollapsed(win, true);
  }
}

function paint(holder) {
  holder.querySelectorAll('[data-sve-build-mode]').forEach((btn) => {
    paintLpActiveControl(btn, (btn.dataset.sveBuildMode === 'build') === buildModeOn());
  });
}

function choose(win, holder, mode) {
  const build = mode === 'build';

  if (build === buildModeOn()) {
    return;
  }

  if (build) {
    openColumn(win);
  }

  setBuildMode(win, build, {
    deviceIcons: LP_DEVICE_ICONS,
    openDock: () => openDockAndTree(win),
  });

  if (!build) {
    restoreColumn(win);
  }

  paint(holder);
}

export function ensureBuildSwitch(win) {
  if (!featureSaidOn(win, 'build_mode')) {
    return;
  }

  const doc = win.document;
  const header = lpHeader(doc);
  const bar = doc.getElementById(HEADER_TOOLBAR_ID);

  if (!header || !bar) {
    return;
  }

  let holder = doc.getElementById(SWITCH_ID);

  if (!holder) {
    ensureStyles(doc);
    holder = doc.createElement('div');
    holder.id = SWITCH_ID;
    holder.dataset.sveBuildSwitch = '';

    const group = doc.createElement('div');

    group.setAttribute('role', 'group');
    group.style.cssText = `${HEADER_GROUP_STYLE}gap:4px;flex:none;`;

    MODES.forEach((mode) => {
      const btn = doc.createElement('button');

      btn.type = 'button';
      btn.dataset.sveBuildMode = mode;
      btn.title = label(win, mode);
      btn.setAttribute('aria-label', label(win, mode));
      btn.innerHTML = `${ICONS[mode]}<span></span>`;
      btn.querySelector('span').textContent = label(win, mode);
      btn.style.cssText = FRAMED_CONTROL_STYLE;
      btn.addEventListener('click', () => choose(win, holder, mode));
      group.appendChild(btn);
    });

    holder.appendChild(group);
  }

  if (holder.parentElement !== header || holder.previousElementSibling !== bar) {
    bar.after(holder);
  }

  paint(holder);
}
