/**
 * The Content | Visual Build | HTML Build switch, hanging under the middle of
 * the Live Preview top bar.
 *
 * Owner: Build mode. Drawn by ensureHeaderToolbar on every pass, and only when
 * `build_mode` is on for this user (Features::visible — it also needs the
 * dock); off, the first line returns and the bar is what it always was.
 *
 *   Content       the editor as it is: the form, the real preview, no dock.
 *   Visual Build  the Build panel, the canvas, the HTML tree (build-mode-host.js).
 *   HTML Build    the form, the canvas, the dock and the HTML tree.
 *
 * Where it stands: a tab of the top bar's own colour hanging from its lower
 * edge, in the middle of the whole window — over the left column, the
 * preview and the right-hand panels alike, not the preview's middle. It is a
 * child of Statamic's header, placed from it (`top: 100%`, `left: 50%`), so
 * nothing measures anything and the bar keeps all its room for its icons.
 * Our own sheet keeps the header the box it hangs from (it already is: the
 * rule only says so for a header that holds the switch).
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
import { lpHeader } from '../lib/live-preview.js';
import { on } from '../cp/bus.js';
import { editorMode, setEditorMode } from '../build-mode-host.js';
import { isCodeDockArmed } from '../code-dock-state.js';
import { openHtmlTreePanel } from '../lazy/html-tree.js';
import { paintLpActiveControl, setLpCollapsed } from '../lp-panel.js';
import { FRAMED_CONTROL_STYLE, HEADER_GROUP_STYLE, TOOLBAR_ICONS, toggleCodeDockButton } from './header-toolbar.js';
import { followToolbarMode, leaveToolbarToolsOutsideMode } from '../toolbar-visibility.js';
import { LP_DEVICE_ICONS } from './preview-chrome.js';

const SWITCH_ID = '__sve-build-switch';
const STYLE_ID = '__sve-build-switch-css';
const MODES = ['content', 'visual', 'html'];
/** Each mode's word in `sveBuildStrings` — Visual Build's is still `mode_build`. */
const LABEL_KEYS = { content: 'mode_content', visual: 'mode_build', html: 'mode_html' };
const FALLBACK = { content: 'Content', visual: 'Visual Build', html: 'HTML Build' };
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
/** The tab's rounding, and the hollow it meets the bar with on each side. */
const ROUND = '.75rem';

function ensureStyles(doc) {
  // The two hollows are the bar's colour (inherited, never named) cut round
  // by a mask, so the tab flows out of the bar the way a drawer tab does.
  injectStyle(
    doc,
    STYLE_ID,
    `.live-preview-header:has(> #${SWITCH_ID}){position:relative}
#${SWITCH_ID}{position:absolute;top:100%;left:50%;transform:translateX(-50%);display:flex;padding:0 .375rem .375rem;border-radius:0 0 ${ROUND} ${ROUND};background-color:inherit}
#${SWITCH_ID}::before,#${SWITCH_ID}::after{content:'';position:absolute;top:0;width:${ROUND};height:${ROUND};background-color:inherit;pointer-events:none}
#${SWITCH_ID}::before{right:100%;-webkit-mask:radial-gradient(circle at 0 100%,transparent ${ROUND},#000 calc(${ROUND} + .5px));mask:radial-gradient(circle at 0 100%,transparent ${ROUND},#000 calc(${ROUND} + .5px))}
#${SWITCH_ID}::after{left:100%;-webkit-mask:radial-gradient(circle at 100% 100%,transparent ${ROUND},#000 calc(${ROUND} + .5px));mask:radial-gradient(circle at 100% 100%,transparent ${ROUND},#000 calc(${ROUND} + .5px))}
#${SWITCH_ID} [data-sve-build-mode]{display:inline-flex;align-items:center;justify-content:center;gap:.375rem;padding:0 .625rem;white-space:nowrap}
#${SWITCH_ID} [data-sve-build-mode] svg{display:block;flex:none;width:.875rem;height:.875rem}`
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

  if (!header) {
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

  if (holder.parentElement !== header) {
    header.appendChild(holder);
  }

  paint(holder);
}
