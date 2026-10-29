/**
 * The Content | Visual Build | HTML Build switch in the middle of the Live
 * Preview top bar.
 *
 * Owner: Build mode. Drawn by ensureHeaderToolbar on every pass, and only when
 * `build_mode` is on for this user (Features::visible — it also needs the
 * dock); off, the first line returns and the bar is what it always was.
 *
 *   Content       the editor as it is: the form, the real preview, no dock.
 *   Visual Build  the Build panel, the canvas, the HTML tree (build-mode-host.js).
 *   HTML Build    the form, the canvas, the dock and the HTML tree.
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
 * In the top bar's look: one group box like the sizes' (HEADER_GROUP_STYLE),
 * three framed controls in it, the picked one painted as every picked control
 * in the bar is (paintLpActiveControl). HTML Build wears the icon the dock had
 * in the bar — the dock is no icon any more; it comes with the mode.
 *
 * The state lives in memory for this Live Preview (build-mode-host.js); every
 * Live Preview opens in Content, because closing one sets it back (lp-width.js).
 *
 * The top bar's icons follow the mode (toolbar-visibility.js): each mode has
 * the ones the site gave it, so a switch closes what the new mode may not
 * have and draws the bar anew. The dock is the switch's: opened with the tree
 * beside it on the way into a Build, shut on the way back to Content.
 *
 * The Build panel is the left column, so Visual Build opens the column when
 * it was folded away, and leaving it folds it back the way it was. "Started
 * with it closed" is the shell's rule that shuts it again on the next pass
 * (lp-width.js); Visual Build sets that aside too, and hands it back.
 */
import { sveState } from '../cp-state.js';
import { featureSaidOn } from '../lib/config.js';
import { injectStyle } from '../lib/style.js';
import { HEADER_TOOLBAR_ID, LP_PREVIEW_CHROME_ID } from '../lib/ids.js';
import { lpHeader } from '../lib/live-preview.js';
import { on } from '../cp/bus.js';
import { editorMode, setEditorMode } from '../build-mode-host.js';
import { isCodeDockArmed } from '../code-dock-state.js';
import { openHtmlTreePanel } from '../lazy/html-tree.js';
import { paintLpActiveControl, setLpCollapsed } from '../lp-panel.js';
import { FRAMED_CONTROL_STYLE, HEADER_GROUP_STYLE, TOOLBAR_ICONS, toggleCodeDockButton } from './header-toolbar.js';
import { followToolbarMode, leaveToolbarToolsOutsideMode } from '../toolbar-visibility.js';
import { SWITCH_TAB_ATTR, buildSwitchTabOn } from '../build-switch-tab.js';
import { LP_DEVICE_ICONS } from './preview-chrome.js';

const SWITCH_ID = '__sve-build-switch';
const STYLE_ID = '__sve-build-switch-css';
const MODES = ['content', 'visual', 'html'];
/** Each mode's word in `sveBuildStrings` — Visual Build's is still `mode_build`. */
const LABEL_KEYS = { content: 'mode_content', visual: 'mode_build', html: 'mode_html' };
const FALLBACK = { content: 'Content', visual: 'Vizuall Build', html: 'HTML Build' };
// Drawn like the toolbar's own icons (stroke 2, round): a pen writing the
// content, and a page laid out in blocks. HTML Build wears the dock's own,
// read when the switch is drawn — header-toolbar.js imports this file, so
// its icons are not there yet while this one loads.
const ICONS = {
  content:
    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>',
  visual:
    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="7" rx="1.5"/><rect x="3" y="14" width="10" height="7" rx="1.5"/><rect x="17" y="14" width="4" height="7" rx="1.5"/></svg>',
};
const iconOf = (mode) => (mode === 'html' ? TOOLBAR_ICONS.code : ICONS[mode]);

function ensureStyles(doc) {
  const bar = `.live-preview-header:has(> #${SWITCH_ID})`;
  const tab = `#${SWITCH_ID}[${SWITCH_TAB_ATTR}]`;

  injectStyle(
    doc,
    STYLE_ID,
    `${bar} > #${HEADER_TOOLBAR_ID}{flex:1 1 0;margin-right:0!important}
${bar} > :has(> #${LP_PREVIEW_CHROME_ID}){flex:1 1 0;justify-content:flex-end}
#${SWITCH_ID}{display:flex;flex:none;margin-inline:.5rem}
#${SWITCH_ID} [data-sve-build-mode]{display:inline-flex;align-items:center;justify-content:center;gap:.375rem;padding:0 .625rem;white-space:nowrap}
#${SWITCH_ID} [data-sve-build-mode] svg{display:block;flex:none;width:.875rem;height:.875rem}
/* Everything below is the tab (SWITCH_TAB_ATTR, Live Preview settings → Top bar); without it the
   switch is the group above, like the bar's others.
   The switch on a tab of the bar, as a canvas tool sits on one: no group box, the three buttons
   (--sve-switch-h tall) stand on a tab in the bar's own colour (--sve-switch-base) with
   --sve-switch-pad of tab round them. The tab ends --sve-switch-drop under the bar, the bar running
   into it in two small curves, so the buttons stand that much lower than the bar's other groups.
   The margins keep the switch a 2rem box to the bar, which centres it as one of them;
   --sve-switch-reach is that box's distance to the bar's bottom, measured where the switch is placed. */
${tab}{--sve-switch-h:2.5rem;--sve-switch-pad:.375rem;--sve-switch-drop:1rem;--sve-switch-ear:.5rem;--sve-switch-down:calc(var(--sve-switch-reach, .625rem) + 2rem - var(--sve-switch-h) + var(--sve-switch-drop) - var(--sve-switch-pad));margin-top:var(--sve-switch-down);margin-bottom:calc(2rem - var(--sve-switch-h) - var(--sve-switch-down));position:relative;z-index:1}
${tab}::before{content:"";position:absolute;z-index:-1;inset:calc(-1 * var(--sve-switch-pad));border-radius:0 0 .625rem .625rem;background:var(--sve-switch-base,transparent);pointer-events:none}
${tab}::after{content:"";position:absolute;z-index:-1;left:calc(-1 * (var(--sve-switch-pad) + var(--sve-switch-ear)));right:calc(-1 * (var(--sve-switch-pad) + var(--sve-switch-ear)));top:calc(100% + var(--sve-switch-pad) - var(--sve-switch-drop));height:var(--sve-switch-ear);pointer-events:none;background:radial-gradient(circle at 0 100%,transparent var(--sve-switch-ear),var(--sve-switch-base,transparent) calc(var(--sve-switch-ear) + .5px)) left/var(--sve-switch-ear) 100% no-repeat,radial-gradient(circle at 100% 100%,transparent var(--sve-switch-ear),var(--sve-switch-base,transparent) calc(var(--sve-switch-ear) + .5px)) right/var(--sve-switch-ear) 100% no-repeat}
${tab} > [role="group"]{height:auto!important;padding:0!important;background:transparent!important;border-radius:0!important}
${tab} [data-sve-build-mode]{height:var(--sve-switch-h)!important;padding:0 .75rem;font-size:.8125rem!important;border-radius:.375rem!important}
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

function paint(holder) {
  const mode = editorMode();

  holder.querySelectorAll('[data-sve-build-mode]').forEach((btn) => {
    paintLpActiveControl(btn, btn.dataset.sveBuildMode === mode);
  });
}

function choose(win, holder, mode) {
  const was = editorMode();

  if (mode === was) {
    return;
  }

  if (mode === 'visual') {
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

  if (was === 'visual') {
    restoreColumn(win);
  }

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

  followToolbarMode(editorMode);

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
      btn.innerHTML = `${iconOf(mode)}<span></span>`;
      btn.querySelector('span').textContent = label(win, mode);
      btn.style.cssText = FRAMED_CONTROL_STYLE;
      btn.addEventListener('click', () => choose(win, holder, mode));
      group.appendChild(btn);
    });

    holder.appendChild(group);
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

  paint(holder);
}
