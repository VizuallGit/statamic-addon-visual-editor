/**
 * The Edit Content | Vizuall Build switch in the middle of the Live Preview
 * top bar, and in Build the HTML icon among the bar's other icons.
 *
 * Owner: Build mode. Drawn by ensureHeaderToolbar on every pass, and only when
 * `build_mode` is on for this user (Features::visible — it also needs the
 * dock); off, the first line returns and the bar is what it always was.
 *
 *   Edit Content   the editor as it is: the form, the real preview, no dock.
 *   Vizuall Build  the Build panel, the canvas, the HTML tree (build-mode-host.js).
 *   HTML icon      Build's dock on or off, kept for this user. The tree stays.
 *
 * The top bar's icons are the ones the site gave Build; with the dock showing,
 * all of them (`html` in lib/toolbar-modes.js), as a developer wants.
 *
 * Where it stands: in the bar's flow, between the icon row and the right-hand
 * cluster (the box round Save that holds the sizes, syncLpRightBarGaps). The
 * two sides share the room equally (`flex: 1 1 0`, the cluster's contents
 * pushed to its right edge), so the switch stands dead in the middle of the
 * whole bar while both fit in their half. A side wider than its half keeps
 * its width — a flex item never shrinks below its content — and the switch
 * moves over, the same gap on each side, never over an icon. The icon row's
 * own margin is set aside while the switch is there, so the middle is exact.
 * Plain flex: nothing is measured.
 *
 * In the top bar's look: back and forward (undo-redo.js), then the two modes,
 * each on the grey of the bar's groups, the picked one painted as every picked
 * control in the bar is (paintLpActiveControl).
 *
 * The state lives in memory for this Live Preview (build-mode-host.js), and
 * closing one sets it back to Content (lp-width.js). What the user last pressed
 * is kept for them (MODE_KEY): the next Live Preview, on this page or another,
 * goes back to it when its switch is drawn.
 *
 * The top bar's icons follow the mode (toolbar-visibility.js): each mode has
 * the ones the site gave it, so a switch closes what the new mode may not
 * have and draws the bar anew. The dock is the switch's: opened with the tree
 * beside it on the way into a Build, shut on the way back to Content.
 *
 * The Build panel is the left column, so Build opens the column when it was
 * folded away, and leaving it folds it back the way it was. "Started with it
 * closed" is the shell's rule that shuts it again on the next pass
 * (lp-width.js); Build sets that aside too, and hands it back.
 */
import { sveState } from '../cp-state.js';
import { chromeGet, chromeRemove, chromeSet } from '../chrome-prefs.js';
import { featureSaidOn } from '../lib/config.js';
import { injectStyle } from '../lib/style.js';
import { bindTips } from '../cp/tip.js';
import { HEADER_SURFACE, HEADER_TOOLBAR_ID, HTML_TREE_PANEL_ID, LP_PREVIEW_CHROME_ID, TOOLBAR_ADD_ATTR, TOOLBAR_GROUP_ATTR } from '../lib/ids.js';
import { lpHeader } from '../lib/live-preview.js';
import { on } from '../cp/bus.js';
import { EDITOR_MODES, buildDockShown, editorMode, setBuildDockShown, setEditorMode } from '../build-mode-host.js';
import { isCodeDockArmed } from '../code-dock-state.js';
import { closeHtmlTreePanel, openHtmlTreePanel } from '../lazy/html-tree.js';
import { paintLpActiveControl, setLpCollapsed } from '../lp-panel.js';
import { FRAMED_CONTROL_STYLE, LP_TOOLBAR_ICON_STYLE, TOOLBAR_ICONS, toggleCodeDockButton } from './header-toolbar.js';
import { followToolbarMode, leaveToolbarToolsOutsideMode } from '../toolbar-visibility.js';
import { SWITCH_TAB_ATTR, buildSwitchTabOn } from '../build-switch-tab.js';
import { LP_DEVICE_ICONS } from './preview-chrome.js';
import { startUndoRedo } from './undo-redo.js';

const SWITCH_ID = '__sve-build-switch';
const STYLE_ID = '__sve-build-switch-css';
const MODES = ['content', 'visual'];
/** The mode this user last pressed. Content writes nothing: it is where a Live Preview starts. */
const MODE_KEY = 'sve-editor-mode';
/** Each mode's word in `sveBuildStrings` — Vizuall Build's is still `mode_build`. */
const LABEL_KEYS = { content: 'mode_content', visual: 'mode_build', dock: 'build_dock', undo_content: 'undo_content', undo_build: 'undo_build', redo_content: 'redo_content', redo_build: 'redo_build' };
const FALLBACK = { content: 'Edit content', visual: 'Vizuall build', dock: 'HTML', undo_content: 'Undo', undo_build: 'Undo', redo_content: 'Redo', redo_build: 'Redo' };
// Drawn like the toolbar's own icons (stroke 2, round): a pen writing the
// content, a page laid out in blocks, and a form's rows. The HTML icon is the
// dock's own, read when the switch is drawn — header-toolbar.js imports this
// file, so its icons are not there yet while this one loads.
const ICONS = {
  content:
    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>',
  visual:
    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3h5a4 4 0 0 1 4 4v3"/><path d="M3 12v5a4 4 0 0 0 4 4h4"/><path d="M6.5 2 7.6 5.4 11 6.5 7.6 7.6 6.5 11 5.4 7.6 2 6.5 5.4 5.4Z"/><path d="m14 21 .6-2.9 4.7-4.7a1.5 1.5 0 0 1 2.1 2.1l-4.7 4.7Z"/><circle cx="12.5" cy="11" r=".6"/></svg>',
  undo:
    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 14 4 9l5-5"/><path d="M20 20v-7a4 4 0 0 0-4-4H4"/></svg>',
  redo:
    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 14 5-5-5-5"/><path d="M4 20v-7a4 4 0 0 1 4-4h12"/></svg>',
};

function ensureStyles(doc) {
  const bar = `.live-preview-header:has(> #${SWITCH_ID})`;
  const tab = `#${SWITCH_ID}[${SWITCH_TAB_ATTR}]`;

  injectStyle(
    doc,
    STYLE_ID,
    `${bar} > #${HEADER_TOOLBAR_ID}{flex:1 1 0;margin-right:0!important}
${bar} > :has(> #${LP_PREVIEW_CHROME_ID}){flex:1 1 0;justify-content:flex-end}
#${SWITCH_ID}{display:flex;flex:none;margin-inline:.5rem}
/* Back and forward, then the two modes, each on the grey of the bar's groups; the same in the bar and on the tab. */
#${SWITCH_ID} > [role="group"]{display:inline-flex;align-items:center;gap:.625rem;flex:none;background:transparent;padding:0}
#${SWITCH_ID} [data-sve-undo-group]{display:inline-flex;gap:.1875rem}
#${SWITCH_ID} [data-sve-undo]{display:inline-flex;align-items:center;justify-content:center;box-sizing:border-box;width:1.75rem;height:1.75rem;padding:0;border:none;border-radius:.375rem;background:${HEADER_SURFACE};color:currentColor;cursor:pointer}
#${SWITCH_ID} [data-sve-undo]:hover:not(:disabled){background:rgba(128,128,128,.28)}
#${SWITCH_ID} [data-sve-undo]:disabled{cursor:default}
#${SWITCH_ID} [data-sve-undo]:disabled svg{opacity:.4}
#${SWITCH_ID} [data-sve-undo] svg{display:block;width:.875rem;height:.875rem}
#${SWITCH_ID} [data-sve-build-mode][aria-pressed="false"]{background:${HEADER_SURFACE}!important;opacity:1!important}
#${SWITCH_ID} [data-sve-build-mode][aria-pressed="false"]:hover{background:rgba(128,128,128,.28)!important}
#${HEADER_TOOLBAR_ID} [data-sve-build-tool][hidden]{display:none!important}
#${SWITCH_ID} [data-sve-build-mode]{display:inline-flex;align-items:center;justify-content:center;gap:.375rem;height:1.75rem!important;padding:0 .625rem;font-size:.8125rem!important;white-space:nowrap}
#${SWITCH_ID} [data-sve-build-mode] svg{display:block;flex:none;width:.875rem;height:.875rem}
/* Everything below is the tab (SWITCH_TAB_ATTR, Live Preview settings → Top bar); without it the
   switch is the group above, like the bar's others.
   The switch on a tab of the bar, as a canvas tool sits on one: no group box, the three buttons
   (--sve-switch-h tall) stand on a tab in the bar's own colour (--sve-switch-base) with
   --sve-switch-pad of tab round them. The tab ends --sve-switch-drop under the bar, the bar running
   into it in two small curves, so the buttons stand that much lower than the bar's other groups.
   The margins keep the switch a 2rem box to the bar, which centres it as one of them;
   --sve-switch-reach is that box's distance to the bar's bottom, measured where the switch is placed. */
${tab}{--sve-switch-h:1.875rem;--sve-switch-pad:.625rem;--sve-switch-drop:2.5rem;--sve-switch-ear:.5rem;--sve-switch-down:calc(var(--sve-switch-reach, .625rem) + 2rem - var(--sve-switch-h) + var(--sve-switch-drop) - var(--sve-switch-pad));margin-top:var(--sve-switch-down);margin-bottom:calc(2rem - var(--sve-switch-h) - var(--sve-switch-down));position:relative;z-index:1}
${tab}::before{content:"";position:absolute;z-index:-1;inset:calc(-1 * var(--sve-switch-pad));border-radius:0 0 .625rem .625rem;background:var(--sve-switch-base,transparent);pointer-events:none}
${tab}::after{content:"";position:absolute;z-index:-1;left:calc(-1 * (var(--sve-switch-pad) + var(--sve-switch-ear)));right:calc(-1 * (var(--sve-switch-pad) + var(--sve-switch-ear)));top:calc(100% + var(--sve-switch-pad) - var(--sve-switch-drop));height:var(--sve-switch-ear);pointer-events:none;background:radial-gradient(circle at 0 100%,transparent var(--sve-switch-ear),var(--sve-switch-base,transparent) calc(var(--sve-switch-ear) + .5px)) left/var(--sve-switch-ear) 100% no-repeat,radial-gradient(circle at 100% 100%,transparent var(--sve-switch-ear),var(--sve-switch-base,transparent) calc(var(--sve-switch-ear) + .5px)) right/var(--sve-switch-ear) 100% no-repeat}
${tab} > [role="group"]{height:auto!important;padding:0!important;background:transparent!important;border-radius:0!important}
${tab} [data-sve-build-mode]{height:var(--sve-switch-h)!important;padding:0 .75rem;font-size:.8125rem!important;border-radius:.375rem!important}
${tab} [data-sve-undo]{width:var(--sve-switch-h);height:var(--sve-switch-h)}
${tab} [data-sve-build-mode] svg{width:.9375rem;height:.9375rem}`
  );
}

function label(win, mode) {
  const strings = win.Statamic?.$config?.get?.('sveBuildStrings') || {};

  return strings[LABEL_KEYS[mode]] || FALLBACK[mode];
}

/** The dock, then the tree: the tree only opens beside an open dock. */
function openDockAndTree(win) {
  if (!isCodeDockArmed(win)) {
    toggleCodeDockButton(win);

    const off = on('dock:html-changed', () => {
      off();

      if (editorMode() !== 'content') {
        void openHtmlTreePanel(win);
      }
    });

    return;
  }

  void openHtmlTreePanel(win);
}

/** The column as Content left it, while Visual Build holds it open. */
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

/** Back and forward as this mode has them: what they go through is the mode's. */
let history = null;

function paintUndo(holder) {
  const win = holder.ownerDocument.defaultView;
  const word = editorMode() === 'content' ? 'content' : 'build';

  [['undo', history?.canUndo()], ['redo', history?.canRedo()]].forEach(([name, can]) => {
    const btn = holder.querySelector(`[data-sve-undo="${name}"]`);
    const title = label(win, `${name}_${word}`);

    if (btn) {
      btn.disabled = !can;

      if (btn.getAttribute('aria-label') !== title) {
        btn.title = title;
        btn.setAttribute('aria-label', title);
      }
    }
  });
}

function paint(holder) {
  const mode = editorMode();
  const win = holder.ownerDocument.defaultView;
  const inBuild = mode !== 'content';

  holder.querySelectorAll('[data-sve-build-mode]').forEach((btn) => {
    const picked = btn.dataset.sveBuildMode === 'visual' ? inBuild : !inBuild;

    paintLpActiveControl(btn, picked);
    btn.setAttribute('aria-pressed', String(picked));
  });
  paintUndo(holder);
  const dock = holder.ownerDocument.querySelector('[data-sve-build-tool="dock"]');

  if (dock) {
    const on = inBuild && buildDockShown(win);

    dock.hidden = !inBuild;
    paintLpActiveControl(dock, on);
    dock.setAttribute('aria-pressed', String(on));
  }
}

/** The bar's icons as the mode has them: all of them while the dock shows. */
function barMode(win) {
  const mode = editorMode();

  return mode === 'content' ? 'content' : buildDockShown(win) ? 'html' : 'visual';
}

function toggleDock(win, holder) {
  setBuildDockShown(win, !buildDockShown(win));
  paint(holder);
  leaveToolbarToolsOutsideMode(win);
}

function choose(win, holder, mode) {
  const was = editorMode();

  if (mode === was) {
    return;
  }

  if (mode === 'content') {
    chromeRemove(win, MODE_KEY);
  } else {
    chromeSet(win, MODE_KEY, mode);
  }

  if (was === 'content') {
    openColumn(win);
  }

  setEditorMode(win, mode, {
    deviceIcons: LP_DEVICE_ICONS,
    // After the switch has painted: Content shut the dock, and an editor
    // already loaded mounts in the same task (~200 ms) — the switch first.
    openDock: () =>
      win.requestAnimationFrame(() =>
        win.setTimeout(() => {
          if (editorMode() !== 'content') {
            openDockAndTree(win);
          }
        }, 0)
      ),
  });

  if (mode === 'content') {
    restoreColumn(win);

    // Parked by a tool in the sidebar, and only Build brings it back.
    if (win.document.getElementById(HTML_TREE_PANEL_ID)?.hidden) {
      closeHtmlTreePanel(win);
    }
  }

  history?.sync();
  paint(holder);
  // What the new mode may not have shuts once the switch has painted — on the
  // way to Content that is the dock too, ~50 ms of its own; the tree goes with it.
  win.requestAnimationFrame(() =>
    win.setTimeout(() => {
      if (editorMode() === 'content' && isCodeDockArmed(win)) {
        toggleCodeDockButton(win);
      }

      leaveToolbarToolsOutsideMode(win);
    }, 0)
  );
}

export function ensureBuildSwitch(win) {
  if (!featureSaidOn(win, 'build_mode')) {
    return;
  }

  followToolbarMode(() => barMode(win));

  const doc = win.document;
  const header = lpHeader(doc);
  const bar = doc.getElementById(HEADER_TOOLBAR_ID);

  if (!header || !bar) {
    return;
  }

  let holder = doc.getElementById(SWITCH_ID);
  let drawn = false;

  if (!holder) {
    ensureStyles(doc);
    holder = doc.createElement('div');
    holder.id = SWITCH_ID;
    holder.dataset.sveBuildSwitch = '';
    bindTips(win, holder);

    const group = doc.createElement('div');

    group.setAttribute('role', 'group');

    const steps = doc.createElement('div');

    steps.dataset.sveUndoGroup = '';
    history?.stop();
    history = startUndoRedo(win, () => paintUndo(holder));

    ['undo', 'redo'].forEach((name) => {
      const btn = doc.createElement('button');

      btn.type = 'button';
      btn.dataset.sveUndo = name;
      btn.innerHTML = ICONS[name];
      btn.disabled = true;
      btn.addEventListener('click', () => history?.[name]());
      steps.appendChild(btn);
    });
    group.appendChild(steps);

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
    drawn = true;
  }

  // The dock's icon among the bar's: at the end of its last group, before the group's +.
  let dock = doc.querySelector('[data-sve-build-tool="dock"]');

  if (!dock) {
    dock = doc.createElement('button');
    dock.type = 'button';
    dock.dataset.sveBuildTool = 'dock';
    dock.title = label(win, 'dock');
    dock.setAttribute('aria-label', label(win, 'dock'));
    dock.innerHTML = TOOLBAR_ICONS.code;
    dock.style.cssText = LP_TOOLBAR_ICON_STYLE;
    dock.querySelector('svg')?.setAttribute('width', '15');
    dock.querySelector('svg')?.setAttribute('height', '15');
    dock.addEventListener('click', () => toggleDock(win, holder));
  }

  const lastGroup = [...bar.querySelectorAll(`:scope > [${TOOLBAR_GROUP_ATTR}]`)].pop() || bar;

  if (dock.parentElement !== lastGroup) {
    lastGroup.insertBefore(dock, lastGroup.querySelector(`:scope > [${TOOLBAR_ADD_ATTR}]`));
  }

  // Right after the icon row, as the bar's other placements anchor theirs:
  // only a switch out of place is moved, so a pass has nothing to undo.
  if (holder.parentElement !== header || holder.previousElementSibling !== bar) {
    bar.after(holder);
  }

  // The bar's colour, for the tab that hangs over the preview (light or dark theme), and how far
  // the switch's 2rem box (its margin box, which the bar centres) stands above the bar's bottom.
  holder.toggleAttribute(SWITCH_TAB_ATTR, buildSwitchTabOn(win));

  const holderCss = win.getComputedStyle(holder);

  holder.style.setProperty('--sve-switch-base', win.getComputedStyle(header).backgroundColor);
  holder.style.setProperty('--sve-switch-reach', `${Math.max(0, header.getBoundingClientRect().bottom - (holder.getBoundingClientRect().bottom + parseFloat(holderCss.marginBottom)))}px`);

  history?.sync();
  paint(holder);

  if (drawn && editorMode() === 'content') {
    const kept = chromeGet(win, MODE_KEY);

    // Fields had a mode of its own, with its icon: whoever left it there is in Build.
    if (EDITOR_MODES.includes(kept)) {
      choose(win, holder, kept === 'fields' ? 'visual' : kept);
    }
  }
}
