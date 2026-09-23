/**
 * code-dock.js — region "layout", split out in WP5. Same statements, same order;
 * only the imports are new. See the barrel code-dock.js for what the shell exports.
 */
import { chromeGet, chromeSet } from '../chrome-prefs.js';
import { ARMED_KEY, isCodeDockArmed, setCodeDockArmed, templateDockAllowed } from '../code-dock-state.js';
import { splitterFill } from '../right-dock.js';
import { PARTIAL_MENU_ID } from '../dock-partials.js';
import { CLASS_RENAME_CHIP_ID } from '../dock-class-tokens.js';
import { injectStyle } from '../lib/style.js';
import { familyCssVars } from '../lib/tag-families.js';
import { t } from '../lib/i18n.js';
import { attachDock } from '../lib/dock-host.js';
import { beginOverlayDrag } from '../lib/drag.js';
import { dockState } from '../dock/state.js';
import { BACK_ICON, CSS_MENU_ID, DEFAULT_HEIGHT, DOCK_ID, HANDLES, HEIGHT_KEY, MIN_HEIGHT, MIN_PANE, PANES, PANES_KEY, STYLE_ID, UNLOCK_ID, WIDTHS_KEY, css, editors, html, javascript } from '../code-dock.js';
import { DATA_MENU_ID } from './data-vars.js';
import { relayoutCodeDock } from './dock-api.js';
import { goBackTemplate } from './scope.js';

// ===== layout =====
export function languageOf(handle) {
  if (handle === 'css') {
    return css();
  }

  if (handle === 'js') {
    return javascript();
  }

  return html({ autoCloseTags: true });
}

/**
 * Bubble only — capture would steal keys/clicks from CodeMirror.
 * Stops Statamic Live Preview (DismissableLayer / global shortcuts) from
 * treating the dock as "outside" and closing onto the front end.
 */
export function shieldDock(dock) {
  if (dock._sveShield) {
    return;
  }

  dock._sveShield = true;

  const stop = (event) => event.stopPropagation();

  for (const type of [
    'keydown',
    'keypress',
    'keyup',
    'pointerdown',
    'pointerup',
    'mousedown',
    'mouseup',
    'click',
    'focusin',
  ]) {
    dock.addEventListener(type, stop);
  }
}

export function isPanelFrame(doc) {
  try {
    return new URLSearchParams(doc.defaultView?.location?.search || '').has('sve-panel');
  } catch {
    return false;
  }
}

/**
 * Missing or stale feature maps must stay off — `featureOn()` treats unknown
 * keys as on, which would open a disk-writing dock by accident.
 */
export { ARMED_KEY, isCodeDockArmed, setCodeDockArmed, templateDockAllowed };

function storedHeight(win) {
  const n = parseInt(chromeGet(win, HEIGHT_KEY) ?? '', 10);

  if (Number.isFinite(n) && n >= MIN_HEIGHT) {
    return n;
  }

  return DEFAULT_HEIGHT;
}

function storeHeight(win, px) {
  chromeSet(win, HEIGHT_KEY, String(px));
}

export function storedPanes(win) {
  try {
    const raw = JSON.parse(chromeGet(win, PANES_KEY) || 'null');

    if (raw && typeof raw === 'object') {
      return {
        html: raw.html !== false,
        css: raw.css !== false,
        js: raw.js === true,
        alpine: raw.alpine === true,
      };
    }
  } catch {
    /* ignore */
  }

  return { html: true, css: true, js: false, alpine: false };
}

function storePanes(win, panes) {
  chromeSet(win, PANES_KEY, JSON.stringify(panes));
}

function storedWidths(win) {
  try {
    const raw = JSON.parse(chromeGet(win, WIDTHS_KEY) || 'null');

    if (raw && typeof raw === 'object') {
      const n = (v) => (Number.isFinite(v) && v > 0 ? v : 1);

      const out = {};

      for (const pane of PANES) {
        out[pane] = n(raw[pane]);
      }

      return out;
    }
  } catch {
    /* ignore */
  }

  return Object.fromEntries(PANES.map((pane) => [pane, 1]));
}

function storeWidths(win, widths) {
  chromeSet(win, WIDTHS_KEY, JSON.stringify(widths));
}

export function ensureStyle(doc) {
  injectStyle(doc, STYLE_ID, `
@keyframes sve-cm-wait { to { transform: rotate(360deg); } }
#${DOCK_ID} {
  /* The tree's seven families, for the marks and the toolbar below. */
  ${familyCssVars('dark')}
  position: fixed;
  /* Same band as the right dock: above the page, under Statamic stacks. */
  z-index: var(--z-index-above, 1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #1E1E21;
  color: #d4d4d4;
  border-top: 1px solid rgba(255,255,255,.12);
  /* No shadow: the sidebars sit flat against the page and this is the same
     kind of panel. The border is what marks the edge. */
  font-family: ui-sans-serif, system-ui, sans-serif;
}
#${DOCK_ID} [data-sve-code-bar] {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 12px;
  border-bottom: 1px solid rgba(255,255,255,.08);
  user-select: none;
  cursor: ns-resize;
}
#${DOCK_ID} [data-sve-code-pane-btn] {
  all: unset;
  cursor: pointer;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: .02em;
  opacity: .55;
}
#${DOCK_ID} [data-sve-code-pane-btn][aria-pressed="true"] {
  background: rgba(255,255,255,.12);
  opacity: 1;
}
#${DOCK_ID} [data-sve-code-path] {
  font-size: 11px;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  opacity: .4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
  margin-left: 4px;
}
#${DOCK_ID} [data-sve-code-back] {
  all: unset;
  cursor: pointer;
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  margin-left: 8px;
  border-radius: 6px;
  color: #d4d4d4;
  opacity: .7;
}
#${DOCK_ID} [data-sve-code-back]:hover {
  opacity: 1;
  background: rgba(255,255,255,.1);
}
#${DOCK_ID} [data-sve-code-back][hidden] {
  display: none;
}
#${DOCK_ID} [data-sve-code-status] {
  margin-left: auto;
  font-size: 11px;
  opacity: .7;
  flex: 0 0 auto;
}
#${DOCK_ID} [data-sve-code-lock] {
  all: unset;
  cursor: pointer;
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  margin-left: 4px;
  border-radius: 6px;
  color: #d4d4d4;
  opacity: .8;
  background: rgba(255,255,255,.1);
}
#${DOCK_ID} [data-sve-code-lock]:hover {
  opacity: 1;
  background: rgba(255,255,255,.16);
}
#${DOCK_ID} [data-sve-code-lock][aria-pressed="true"] {
  opacity: 1;
  color: #fbbf24;
  background: rgba(251,191,36,.12);
}
#${DOCK_ID} [data-sve-code-lock][hidden] {
  display: none;
}
#${DOCK_ID} [data-sve-html-scope] {
  all: unset;
  cursor: pointer;
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  margin-left: 4px;
  border-radius: 6px;
  color: #d4d4d4;
  opacity: .8;
  background: rgba(255,255,255,.1);
}
#${DOCK_ID} [data-sve-html-scope]:hover {
  opacity: 1;
  background: rgba(255,255,255,.16);
}
#${DOCK_ID} [data-sve-html-scope][aria-pressed="true"] {
  opacity: 1;
  color: #93c5fd;
  background: rgba(56,88,233,.22);
}
#${DOCK_ID} [data-sve-code-strip],
#${DOCK_ID} [data-sve-code-history] {
  all: unset;
  cursor: pointer;
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  margin-left: 4px;
  border-radius: 6px;
  color: #d4d4d4;
  opacity: .8;
  background: rgba(255,255,255,.1);
}
#${DOCK_ID} [data-sve-code-strip]:hover,
#${DOCK_ID} [data-sve-code-history]:hover,
#${DOCK_ID} [data-sve-code-history][data-open] {
  opacity: 1;
  background: rgba(255,255,255,.16);
}
#${DOCK_ID} [data-sve-code-strip][aria-pressed="true"] {
  opacity: 1;
  color: #7dd3fc;
  background: rgba(56,189,248,.16);
}
#${DOCK_ID}[data-sve-style="tw"] [data-sve-values-mode],
#${DOCK_ID}[data-sve-code-locked] [data-sve-values-mode] {
  display: none;
}
#${DOCK_ID} [data-sve-values-mode],
#${DOCK_ID} [data-sve-style-mode] {
  all: unset;
  cursor: pointer;
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 26px;
  padding: 0 8px;
  margin-left: 4px;
  border-radius: 6px;
  color: #d4d4d4;
  opacity: .8;
  background: rgba(255,255,255,.1);
  font-size: 11px;
  white-space: nowrap;
}
#${DOCK_ID} [data-sve-values-mode]:hover,
#${DOCK_ID} [data-sve-style-mode]:hover {
  opacity: 1;
  background: rgba(255,255,255,.16);
}
#${DOCK_ID} [data-sve-values-mode][aria-pressed="true"],
#${DOCK_ID} [data-sve-style-mode][aria-pressed="true"] {
  opacity: 1;
  color: #7dd3fc;
  background: rgba(56,189,248,.16);
}
/* The CSS pane holds two things and shows one: the editor, or the chips. */
#${DOCK_ID} [data-sve-tw-host] {
  display: none;
}
/* The head row belongs to the editor, so it goes with it: in Tailwind mode the
   chips draw their own, and two rows asking the same question is one too many. */
/* The Alpine pane has no editor to fill it, so its panel does. */
#${DOCK_ID} [data-sve-alpine-host] {
  flex: 1 1 0;
  min-height: 0;
  min-width: 0;
  overflow: auto;
  overscroll-behavior: contain;
  scrollbar-width: thin;
}
#${DOCK_ID} [data-sve-css-head] {
  flex: 0 0 auto;
}
#${DOCK_ID}[data-sve-style="tw"] [data-sve-css-head] {
  display: none;
}
/* Locked: dimmed, not gone. The Tailwind row does the same, and a row that
   disappears reads as broken — a row that is greyed out reads as locked. */
#${DOCK_ID}[data-sve-code-locked] [data-sve-css-head] {
  opacity: .5;
}
#${DOCK_ID}[data-sve-style="tw"] [data-sve-code-pane="css"] [data-sve-code-host] {
  display: none;
}
#${DOCK_ID}[data-sve-style="tw"] [data-sve-tw-host] {
  display: block;
  flex: 1 1 0;
  min-height: 0;
  overflow: auto;
  overscroll-behavior: contain;
  scrollbar-width: thin;
}
#${DOCK_ID} [data-sve-code-autosave],
#${DOCK_ID} [data-sve-code-save] {
  all: unset;
  cursor: pointer;
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  margin-left: 4px;
  border-radius: 6px;
  color: #d4d4d4;
  opacity: .8;
  background: rgba(255,255,255,.1);
}
#${DOCK_ID} [data-sve-code-autosave]:hover,
#${DOCK_ID} [data-sve-code-save]:hover {
  opacity: 1;
  background: rgba(255,255,255,.16);
}
#${DOCK_ID} [data-sve-code-autosave][aria-pressed="true"] {
  opacity: 1;
  color: #93c5fd;
  background: rgba(56,88,233,.22);
}
#${DOCK_ID} [data-sve-code-save][data-dirty] {
  opacity: 1;
  color: #93c5fd;
  background: rgba(56,88,233,.22);
}
#${DOCK_ID} [data-sve-code-save][hidden] {
  display: none;
}
#${DOCK_ID}[data-sve-code-locked] [data-sve-code-autosave],
#${DOCK_ID}[data-sve-code-locked] [data-sve-style-mode],
#${DOCK_ID}[data-sve-code-locked] [data-sve-code-history],
#${DOCK_ID}[data-sve-code-locked] [data-sve-code-strip],
#${DOCK_ID}[data-sve-code-locked] [data-sve-code-save] {
  pointer-events: none;
  opacity: .28;
}
#${DOCK_ID}[data-sve-code-locked] [data-sve-css-tools],
#${DOCK_ID}[data-sve-code-locked] [data-sve-html-tools],
#${DOCK_ID}[data-sve-code-locked] [data-sve-html-tidy],
#${DOCK_ID}[data-sve-code-locked] [data-sve-data-vars],
#${DOCK_ID}[data-sve-code-locked] [data-sve-antlers-tools],
#${DOCK_ID}[data-sve-code-locked] [data-sve-visual-edit-tools],
#${DOCK_ID}[data-sve-code-locked] [data-sve-css-add-class] {
  pointer-events: none;
  opacity: .28;
}
#${DOCK_ID}[data-sve-code-locked] [data-sve-code-pane] .cm-editor,
#${DOCK_ID}[data-sve-code-locked] [data-sve-tw-host] {
  opacity: .62;
}
#${DOCK_ID} [data-sve-code-lock-banner] {
  display: none;
  flex: 0 0 auto;
  padding: 6px 12px;
  font-size: 11px;
  line-height: 1.4;
  color: #fbbf24;
  background: rgba(251,191,36,.08);
  border-bottom: 1px solid rgba(251,191,36,.18);
}
#${DOCK_ID}[data-sve-code-locked] [data-sve-code-lock-banner] {
  display: block;
}
#${UNLOCK_ID} {
  position: fixed;
  inset: 0;
  z-index: 80;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,.5);
}
#${UNLOCK_ID} [data-sve-unlock-card] {
  width: min(420px, calc(100vw - 32px));
  padding: 20px;
  border-radius: 12px;
  background: #252526;
  color: #d4d4d4;
  border: 1px solid rgba(255,255,255,.12);
  box-shadow: 0 16px 40px rgba(0,0,0,.45);
  font-family: ui-sans-serif, system-ui, sans-serif;
}
#${UNLOCK_ID} [data-sve-unlock-title] {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 8px;
}
#${UNLOCK_ID} [data-sve-unlock-body] {
  font-size: 13px;
  line-height: 1.45;
  opacity: .75;
  margin-bottom: 18px;
}
#${UNLOCK_ID} [data-sve-unlock-actions] {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
#${UNLOCK_ID} [data-sve-unlock-actions] button {
  all: unset;
  cursor: pointer;
  padding: 7px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
}
#${UNLOCK_ID} [data-sve-unlock-cancel] {
  background: rgba(255,255,255,.1);
  color: #d4d4d4;
}
#${UNLOCK_ID} [data-sve-unlock-confirm] {
  background: #b45309;
  color: #fff;
}
#${DOCK_ID} [data-sve-code-grip] {
  flex: 0 0 16px;
  height: 16px;
  width: 100%;
  cursor: ns-resize;
  z-index: 3;
  ${splitterFill('ns')}
  background-color: var(--theme-color-gray-800, #27272a);
}
#${DOCK_ID} .sve-code-dock {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  height: 100%;
  min-height: 0;
  overflow: hidden;
}
#${DOCK_ID} [data-sve-code-panes] {
  flex: 1 1 0;
  min-height: 0;
  display: flex;
  overflow: hidden;
}
#${DOCK_ID} [data-sve-code-pane] {
  flex: 1 1 0;
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}
#${DOCK_ID} [data-sve-code-pane-label] {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 8px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: .08em;
  text-transform: uppercase;
  border-bottom: 1px solid rgba(255,255,255,.06);
  user-select: none;
  pointer-events: none;
  position: relative;
  z-index: 2;
  overflow: visible;
  min-width: 0;
}
#${DOCK_ID} [data-sve-code-pane-label] > span {
  opacity: .38;
}
#${DOCK_ID} [data-sve-css-add-class] {
  all: unset;
  pointer-events: auto;
  box-sizing: border-box;
  width: 22px;
  height: 22px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  background: rgba(255,255,255,.1);
  color: #d4d4d4;
  cursor: pointer;
  opacity: .75;
  flex: none;
}
#${DOCK_ID} [data-sve-css-add-class]:hover,
#${DOCK_ID} [data-sve-css-add-class][data-open] {
  background: rgba(255,255,255,.16);
  opacity: 1;
}
#${DOCK_ID} [data-sve-css-tools],
#${DOCK_ID} [data-sve-html-tools] {
  pointer-events: auto;
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  gap: 2px;
  min-width: 0;
  overflow-x: auto;
  /* Scrolls like the Tailwind row, and without a bar across the buttons. */
  scrollbar-width: none;
}
#${DOCK_ID} [data-sve-html-tools]::-webkit-scrollbar {
  display: none;
}
#${DOCK_ID} [data-sve-html-tools] {
  flex: 1 1 auto;
}
#${DOCK_ID} [data-sve-antlers-tools],
#${DOCK_ID} [data-sve-visual-edit-tools] {
  pointer-events: auto;
  flex: 0 0 auto;
  display: flex;
  align-items: center;
}
#${DOCK_ID} [data-sve-css-chrome] {
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  min-width: 0;
}
/**
 * Air between the tools themselves, not between a tool's children.
 *
 * A separate rule so the HTML pane's own row, which shares the one above,
 * keeps the spacing it has. The children sit in their own containers inside
 * the pill and keep their 1px.
 */
#${DOCK_ID} [data-sve-css-tools] {
  gap: 3px;
  scrollbar-width: none;
}
#${DOCK_ID} [data-sve-css-tools]::-webkit-scrollbar {
  display: none;
}

/**
 * A tool is one item, and its children live inside that item.
 *
 * The surface belongs to the item, so it wraps the icon and whatever it opens
 * without a single offset: everything stays in flow, nothing is drawn over
 * anything, and opening a group only makes its own item wider.
 */
#${DOCK_ID} [data-sve-css-item] {
  list-style: none;
  display: inline-flex;
  align-items: center;
  /* Same radius as the button's own highlight, so the shape around the icon
     is identical open and closed. */
  border-radius: 4px;
}
/* Only to the right: nothing may move the icon when the group opens. */
#${DOCK_ID} [data-sve-css-item][data-sve-css-open] {
  background: rgba(255,255,255,.12);
}
#${DOCK_ID} [data-sve-css-item][data-sve-css-open] > [data-sve-css-tool][data-open] {
  background: transparent;
}
#${DOCK_ID} [data-sve-css-kids]::before {
  content: '';
  flex: 0 0 auto;
  width: 1px;
  height: 12px;
  margin: 0 6px 0 4px;
  background: rgba(255,255,255,.16);
}
/* A tool's children, inside the tool's own list item — so they open beside the
   icon they belong to, in its highlight, never somewhere else on the row. */
/* A size block that is in the editor but not in the file. Faded says what a
   dialog would have to explain: nothing here is saved until you write in it. */
#${DOCK_ID} .sve-css-ghost {
  opacity: .32;
}
/* The section's own layer, while it is showing. Same blue the ID button lights
   up in, so the button and the rule it opened are plainly the same thing.

   Loud on purpose. At a tenth of an alpha it was technically drawn and
   practically invisible: two dim lines at the top of a file you were not
   looking at, which is indistinguishable from the button doing nothing. */
#${DOCK_ID} .cm-line.sve-css-id {
  background: rgba(56,189,248,.16);
  box-shadow: inset 3px 0 0 #38bdf8;
}
/* An empty ID rule is still unsaved, and still dropped on the way to disk —
   but it is not faded while the ID is open. It is the one rule the button just
   asked you to write in; drawing it at a third of its strength was telling you
   to type somewhere you could barely see. */
#${DOCK_ID}[data-sve-values="on"] .cm-line.sve-css-id .sve-css-ghost {
  opacity: 1;
}
#${DOCK_ID} [data-sve-css-kids] {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  gap: 2px;
  min-width: 0;
  overflow-x: auto;
  scrollbar-width: none;
}
#${DOCK_ID} [data-sve-css-kids]::-webkit-scrollbar {
  display: none;
}
/**
 * A row with more behind an edge fades out at that edge.
 *
 * The rows scroll without a bar, so the fade is the only sign that there are
 * buttons past the edge. scroll-edges.js measures which edges have more and
 * writes data-sve-scroll-edge; a row that fits carries nothing and is drawn
 * whole. A mask, not an overlay: the row's own buttons fade into whatever is
 * behind them, and nothing sits on top of them to catch a click.
 */
#${DOCK_ID} [data-sve-scroll-edge="right"] {
  -webkit-mask-image: linear-gradient(to right, #000 calc(100% - 2.75em), transparent);
  mask-image: linear-gradient(to right, #000 calc(100% - 2.75em), transparent);
}
#${DOCK_ID} [data-sve-scroll-edge="left"] {
  -webkit-mask-image: linear-gradient(to right, transparent, #000 2.75em);
  mask-image: linear-gradient(to right, transparent, #000 2.75em);
}
#${DOCK_ID} [data-sve-scroll-edge="both"] {
  -webkit-mask-image: linear-gradient(to right, transparent, #000 2.75em, #000 calc(100% - 2.75em), transparent);
  mask-image: linear-gradient(to right, transparent, #000 2.75em, #000 calc(100% - 2.75em), transparent);
}
#${DOCK_ID} [data-sve-css-sep] {
  width: 1px;
  height: 12px;
  margin: 0 4px;
  background: rgba(255,255,255,.16);
  flex: 0 0 auto;
}
#${DOCK_ID} [data-sve-css-tool],
#${DOCK_ID} [data-sve-css-box-side],
#${DOCK_ID} [data-sve-html-tool] {
  all: unset;
  cursor: pointer;
  position: relative;
  /* Every button keeps its size and the row scrolls instead. Left to shrink,
     the last few squeezed themselves into slivers rather than admitting there
     was no room — and squeezed icons read as missing ones. */
  flex: 0 0 auto;
  width: 22px;
  height: 22px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  color: #d4d4d4;
  opacity: .7;
}
#${DOCK_ID} [data-sve-css-tool]:hover,
#${DOCK_ID} [data-sve-css-tool][data-open],
#${DOCK_ID} [data-sve-css-tool][data-active],
#${DOCK_ID} [data-sve-html-tool]:hover,
#${DOCK_ID} [data-sve-html-tool][data-open],
#${DOCK_ID} [data-sve-html-tool][data-active] {
  background: rgba(255,255,255,.12);
  opacity: 1;
}
#${DOCK_ID} [data-sve-css-box-side]:hover,
#${DOCK_ID} [data-sve-css-box-side][data-open],
#${DOCK_ID} [data-sve-css-box-side][data-active],
#${DOCK_ID} [data-sve-css-kids] [data-sve-css-kid]:hover,
#${DOCK_ID} [data-sve-css-kids] [data-sve-css-kid][data-active] {
  background: transparent;
  opacity: 1;
}
/* The hover label lives on the body — see bindTips. A row that scrolls
   would clip anything drawn inside it. */
#${DOCK_ID} [data-sve-html-tool][data-letter] {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0;
  text-transform: none;
  font-family: ui-sans-serif, system-ui, sans-serif;
}
/* The last three buttons write Antlers, not a tag: a component call, a loop,
   a condition. They decide what renders and how often, which is a different
   kind of thing from adding a paragraph - so they carry a colour and read as
   a group at the end of the row rather than as three more tags. Each keeps
   its own hover, or a marked button would look dead under the pointer.
   No backticks in here: this whole sheet is a template literal. */
#${DOCK_ID} [data-sve-html-tool="component"] {
  color: var(--sve-fam-component);
  background: color-mix(in srgb, var(--sve-fam-component) 13%, transparent);
  opacity: 1;
}
#${DOCK_ID} [data-sve-html-tool="component"]:hover,
#${DOCK_ID} [data-sve-html-tool="component"][data-open] {
  background: color-mix(in srgb, var(--sve-fam-component) 26%, transparent);
}
#${DOCK_ID} [data-sve-html-tool="loop"] {
  color: var(--sve-fam-loop);
  background: color-mix(in srgb, var(--sve-fam-loop) 15%, transparent);
  opacity: 1;
}
#${DOCK_ID} [data-sve-html-tool="loop"]:hover,
#${DOCK_ID} [data-sve-html-tool="loop"][data-open] {
  background: color-mix(in srgb, var(--sve-fam-loop) 28%, transparent);
}
#${DOCK_ID} [data-sve-html-tool="if"] {
  color: var(--sve-fam-if);
  background: color-mix(in srgb, var(--sve-fam-if) 13%, transparent);
  opacity: 1;
}
#${DOCK_ID} [data-sve-html-tool="if"]:hover,
#${DOCK_ID} [data-sve-html-tool="if"][data-open] {
  background: color-mix(in srgb, var(--sve-fam-if) 26%, transparent);
}
#${CSS_MENU_ID} {
  position: fixed;
  z-index: 60;
  min-width: 168px;
  max-width: 268px;
  max-height: 22rem;
  overflow: auto;
  padding: 8px;
  border-radius: 8px;
  background: #252526;
  color: #d4d4d4;
  border: 1px solid rgba(255,255,255,.12);
  box-shadow: 0 8px 24px rgba(0,0,0,.4);
  font-family: ui-sans-serif, system-ui, sans-serif;
}
#${DATA_MENU_ID} {
  position: fixed;
  z-index: 60;
  width: 23rem;
}
[data-sve-data-menu] {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  max-width: calc(100vw - 1.5rem);
  max-height: 24rem;
  /* The search and the tabs stay put; only the rows under them scroll. */
  overflow: hidden;
  padding: 0.5rem;
  border-radius: 0.5em;
  background: #252526;
  color: #d4d4d4;
  border: 1px solid rgba(255,255,255,.12);
  box-shadow: 0 0.5em 1.5em rgba(0,0,0,.4);
  font-family: ui-sans-serif, system-ui, sans-serif;
  font-size: 0.75rem;
}
[data-sve-data-menu] [data-sve-data-search] {
  display: flex;
  align-items: center;
  gap: 0.5em;
  box-sizing: border-box;
  height: 2.2rem;
  padding: 0 0.6em;
  margin-bottom: 0.45rem;
  border-radius: 0.45em;
  border: 1px solid rgba(255,255,255,.18);
  background: rgba(0,0,0,.28);
}
[data-sve-data-menu] [data-sve-data-search]:focus-within {
  border-color: rgba(147,197,253,.7);
}
[data-sve-data-menu] [data-sve-data-search] svg {
  flex: 0 0 auto;
  opacity: .5;
}
[data-sve-data-menu] [data-sve-data-input] {
  all: unset;
  flex: 1 1 auto;
  min-width: 0;
  color: inherit;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.75rem;
}
[data-sve-data-menu] [data-sve-data-rows] {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
}
[data-sve-data-menu] [data-sve-data-tabs] {
  display: flex;
  gap: 0.2rem;
  margin-bottom: 0.45rem;
  padding: 0.15rem;
  border-radius: 0.45em;
  background: rgba(0,0,0,.28);
}
[data-sve-data-menu] [data-sve-data-tab] {
  all: unset;
  flex: 1 1 0;
  box-sizing: border-box;
  padding: 0.35em 0;
  border-radius: 0.35em;
  cursor: pointer;
  text-align: center;
  font-size: 0.6875rem;
  opacity: .65;
}
[data-sve-data-menu] [data-sve-data-tab]:hover { opacity: 1; }
[data-sve-data-menu] [data-sve-data-tab][data-active] {
  opacity: 1;
  background: rgba(255,255,255,.14);
}
[data-sve-data-menu] [data-sve-data-group] {
  padding: 0.6em 0.5em 0.25em;
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: .06em;
  text-transform: uppercase;
  opacity: .45;
}
[data-sve-data-menu] [data-sve-data-option] {
  all: unset;
  box-sizing: border-box;
  display: flex;
  align-items: baseline;
  gap: 0.5em;
  width: 100%;
  padding: 0.35em 0.5em;
  border-radius: 0.35em;
  cursor: pointer;
}
[data-sve-data-menu] [data-sve-data-option]:hover,
[data-sve-data-menu] [data-sve-data-option][data-cursor] {
  background: rgba(255,255,255,.1);
}
[data-sve-data-menu] [data-sve-data-name] {
  flex: 0 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}
[data-sve-data-menu] [data-sve-data-parent] {
  flex: 0 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.625rem;
  opacity: .4;
}
[data-sve-data-menu] [data-sve-data-value] {
  flex: 0 1 auto;
  margin-left: auto;
  max-width: 45%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: right;
  font-size: 0.6875rem;
  opacity: .5;
}
[data-sve-data-menu] [data-sve-data-loop] {
  flex: 0 0 auto;
  margin-left: auto;
  padding: 0.1em 0.45em;
  border-radius: 0.3em;
  background: rgba(255,255,255,.1);
  font-size: 0.5625rem;
  letter-spacing: .04em;
  text-transform: uppercase;
  opacity: .6;
}
[data-sve-data-menu] [data-sve-data-empty] {
  padding: 0.5em;
  opacity: .55;
}
#${DOCK_ID} [data-sve-data-vars],
#${DOCK_ID} [data-sve-antlers-btn],
#${DOCK_ID} [data-sve-visual-edit-btn],
#${DOCK_ID} [data-sve-html-tidy] {
  pointer-events: auto;
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 1.65em;
  height: 1.65em;
  margin-right: 0.35em;
  padding: 0;
  border: 0;
  border-radius: 0.3em;
  background: transparent;
  color: #d4d4d4;
  opacity: .62;
  cursor: pointer;
}
/* The Antlers mark is wide; the button grows with it rather than cropping it. */
#${DOCK_ID} [data-sve-antlers-btn] {
  width: auto;
  min-width: 1.65em;
  padding: 0 0.3em;
}
#${DOCK_ID} [data-sve-data-vars] span,
#${DOCK_ID} [data-sve-antlers-btn] span,
#${DOCK_ID} [data-sve-visual-edit-btn] span,
#${DOCK_ID} [data-sve-html-tidy] svg {
  display: flex;
  line-height: 1;
}
#${DOCK_ID} [data-sve-data-vars]:hover,
#${DOCK_ID} [data-sve-data-vars][data-open],
#${DOCK_ID} [data-sve-antlers-btn]:hover,
#${DOCK_ID} [data-sve-antlers-btn][data-open],
#${DOCK_ID} [data-sve-visual-edit-btn]:hover,
#${DOCK_ID} [data-sve-visual-edit-btn][data-open],
#${DOCK_ID} [data-sve-html-tidy]:hover {
  background: rgba(255,255,255,.16);
  opacity: 1;
}
#${CSS_MENU_ID} [data-sve-css-swatches] {
  display: grid;
  grid-template-columns: repeat(8, 16px);
  gap: 4px;
}
#${CSS_MENU_ID} [data-sve-css-swatch] {
  all: unset;
  cursor: pointer;
  width: 16px;
  height: 16px;
  border-radius: 3px;
  box-sizing: border-box;
  border: 1px solid rgba(255,255,255,.2);
}
#${CSS_MENU_ID} [data-sve-css-swatch]:hover,
#${CSS_MENU_ID} [data-sve-css-clear]:hover {
  outline: 1px solid #fff;
  outline-offset: 1px;
}
#${CSS_MENU_ID} [data-sve-css-clear] {
  all: unset;
  cursor: pointer;
  width: 16px;
  height: 16px;
  border-radius: 3px;
  box-sizing: border-box;
  border: 1px solid rgba(255,255,255,.35);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #d4d4d4;
  background: repeating-conic-gradient(#3f3f3f 0% 25%, #2a2a2a 0% 50%) 50% / 8px 8px;
}
#${CSS_MENU_ID} [data-sve-css-choice] {
  all: unset;
  cursor: pointer;
  display: flex;
  align-items: baseline;
  gap: 8px;
  width: 100%;
  box-sizing: border-box;
  padding: 5px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
}
#${CSS_MENU_ID} [data-sve-css-choice-label] {
  flex: 1 1 auto;
  min-width: 0;
}
/* What the row actually writes, in the corner of the row that writes it. Dim,
   because it is the answer to a second question, not the first. */
#${CSS_MENU_ID} [data-sve-css-choice-hint] {
  flex: 0 0 auto;
  opacity: .45;
  font-size: 10px;
}
#${CSS_MENU_ID} [data-sve-css-head-row] {
  display: block;
  padding: 8px 8px 3px;
  font-family: ui-sans-serif, system-ui, sans-serif;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: .04em;
  text-transform: uppercase;
  opacity: .55;
}
#${CSS_MENU_ID} [data-sve-css-head-row]:first-child {
  padding-top: 2px;
}
#${CSS_MENU_ID} [data-sve-css-note-row] {
  display: block;
  padding: 6px 8px 2px;
  font-family: ui-sans-serif, system-ui, sans-serif;
  font-size: 10px;
  line-height: 1.45;
  opacity: .5;
}
#${CSS_MENU_ID} [data-sve-css-choice]:hover,
#${CSS_MENU_ID} [data-sve-css-swatch][data-active],
#${CSS_MENU_ID} [data-sve-css-choice][data-active] {
  outline: 1px solid #fff;
  outline-offset: 1px;
  background: rgba(255,255,255,.1);
}
#${CSS_MENU_ID} [data-sve-css-add-label] {
  display: block;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: .04em;
  text-transform: uppercase;
  opacity: .55;
  margin-bottom: 6px;
}
#${CSS_MENU_ID} [data-sve-css-add-input] {
  box-sizing: border-box;
  width: 100%;
  height: 28px;
  padding: 0 8px;
  border: 1px solid rgba(255,255,255,.16);
  border-radius: 4px;
  background: #1E1E21;
  color: #d4d4d4;
  font-size: 12px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}
/* The "+" menu's search: the site's classes to pick from, a red word when the
   typed name is taken, and the one button that makes a new one. */
#${CSS_MENU_ID} [data-sve-css-add-hint] {
  margin-top: 6px;
  font-size: 11px;
  color: #fca5a5;
}
#${CSS_MENU_ID} [data-sve-css-add-existing] {
  margin: 10px 0 4px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: .04em;
  text-transform: uppercase;
  opacity: .55;
}
#${CSS_MENU_ID} [data-sve-css-add-list] {
  display: flex;
  flex-direction: column;
  gap: 1px;
  max-height: 14em;
  overflow-y: auto;
  margin: 0 -4px;
}
#${CSS_MENU_ID} [data-sve-css-add-option] {
  all: unset;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
  padding: 4px 6px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}
#${CSS_MENU_ID} [data-sve-css-add-option]:hover,
#${CSS_MENU_ID} [data-sve-css-add-option]:focus-visible {
  background: rgba(255,255,255,.1);
}
#${CSS_MENU_ID} [data-sve-css-add-detail] {
  font-size: 10px;
  opacity: .5;
  font-family: ui-sans-serif, system-ui, sans-serif;
  white-space: nowrap;
}
#${CSS_MENU_ID} [data-sve-css-add-none] {
  padding: 4px 6px;
  opacity: .4;
}
#${CSS_MENU_ID} [data-sve-css-add-create] {
  all: unset;
  display: block;
  box-sizing: border-box;
  width: 100%;
  margin-top: 8px;
  padding: 6px 8px;
  border-radius: 4px;
  text-align: center;
  font-size: 11px;
  font-weight: 600;
  color: #fff;
  background: #3858e9;
  cursor: pointer;
}
#${CSS_MENU_ID} [data-sve-css-add-create]:hover { background: #4a68ee; }
#${CSS_MENU_ID} [data-sve-css-add-create][disabled] { opacity: .35; cursor: default; }
#${DOCK_ID} [data-sve-code-split] {
  flex: 0 0 16px;
  cursor: col-resize;
  ${splitterFill('ew')}
  background-color: var(--theme-color-gray-800, #27272a);
  position: relative;
  z-index: 1;
}
#${DOCK_ID} [data-sve-code-split]:hover,
#${DOCK_ID} [data-sve-code-split][data-active] {
  filter: brightness(1.15);
}
#${DOCK_ID} [data-sve-code-pane] .cm-editor {
  height: auto !important;
  min-height: 0;
  overflow: visible;
}
#${DOCK_ID} [data-sve-code-pane] .cm-scroller {
  overflow: visible !important;
  height: auto !important;
  min-height: 0 !important;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}
#${DOCK_ID} [data-sve-code-host] {
  flex: 1 1 0;
  min-height: 0;
  overflow: auto;
  overscroll-behavior: contain;
  scrollbar-width: thin;
  scrollbar-color: rgba(255,255,255,.35) transparent;
}
#${DOCK_ID} [data-sve-code-host]::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
#${DOCK_ID} [data-sve-code-host]::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,.28);
  border-radius: 6px;
}
/* A bracket name the site already defines elsewhere: red, the file in the title. */
#${DOCK_ID} .sve-cm-class-taken {
  color: #fca5a5;
  text-decoration: underline wavy rgba(248,113,113,.9);
  text-underline-offset: .18em;
  cursor: help;
}
#${DOCK_ID} .sve-cm-css-token {
  background: rgba(215,186,125,.22);
  border-radius: 2px;
}
#${CLASS_RENAME_CHIP_ID} {
  all: unset;
  position: fixed;
  z-index: 90;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 4px;
  background: #3c3c3c;
  color: #d7ba7d;
  border: 1px solid rgba(255,255,255,.16);
  box-shadow: 0 2px 8px rgba(0,0,0,.35);
  cursor: pointer;
}
#${CLASS_RENAME_CHIP_ID}:hover {
  background: #4a4a4a;
}
/* The tree's families, in the code (antlers-highlight.js marks them; the
   colours are the one table in lib/tag-families.js, set on the dock as
   variables below). A tag name wears its family; an Antlers value keeps the
   one Antlers colour; what closes a block is held back, so an opening line
   and its closing line do not read as the same thing. */
#${DOCK_ID} .sve-cm-antlers {
  color: #b9a6ff;
}
/* The span inside as well: CodeMirror wraps a tag name in its own highlight
   span, drawn INSIDE the family mark and carrying its own colour — measured
   in the browser, a section sat blue on the outside and teal on the text.
   An Antlers tag has no inner span; the second selector is for the names. */
#${DOCK_ID} .sve-cm-fam-layout, #${DOCK_ID} .sve-cm-fam-layout span { color: var(--sve-fam-layout); }
#${DOCK_ID} .sve-cm-fam-text, #${DOCK_ID} .sve-cm-fam-text span { color: var(--sve-fam-text); }
#${DOCK_ID} .sve-cm-fam-media, #${DOCK_ID} .sve-cm-fam-media span { color: var(--sve-fam-media); }
#${DOCK_ID} .sve-cm-fam-loop, #${DOCK_ID} .sve-cm-fam-loop span { color: var(--sve-fam-loop); }
#${DOCK_ID} .sve-cm-fam-if, #${DOCK_ID} .sve-cm-fam-if span { color: var(--sve-fam-if); }
#${DOCK_ID} .sve-cm-fam-component, #${DOCK_ID} .sve-cm-fam-component span { color: var(--sve-fam-component); }
#${DOCK_ID} .sve-cm-fam-other, #${DOCK_ID} .sve-cm-fam-other span { color: var(--sve-fam-other); }
#${DOCK_ID} .sve-cm-antlers-close {
  opacity: .72;
}
#${DOCK_ID} .sve-cm-antlers-comment {
  color: #6b8f6b;
  font-style: italic;
}
/* Where the file is broken (template-lint.js finds it, dock/problems.js
   paints it): the range wears a wavy line in the editor, and the strip under
   the tool row says it in words. The strip is hidden while there is nothing
   to say, so a file that is fine looks as it always did. */
#${DOCK_ID} .sve-cm-problem {
  text-decoration: underline wavy #f0716b;
  text-decoration-skip-ink: none;
  text-underline-offset: 3px;
  background: rgba(240, 113, 107, .10);
}
#${DOCK_ID} [data-sve-html-problems] {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 2px 8px;
  padding: 4px 10px;
  font-size: 11px;
  line-height: 1.4;
  color: #f5c2bf;
  background: rgba(240, 113, 107, .10);
  border-bottom: 1px solid rgba(240, 113, 107, .25);
}
#${DOCK_ID} [data-sve-html-problems][hidden] {
  display: none;
}
#${DOCK_ID} [data-sve-html-problems] [data-sve-problems-title] {
  flex: 0 0 auto;
  font-weight: 600;
  color: #f0716b;
}
#${DOCK_ID} [data-sve-html-problems] button {
  all: unset;
  cursor: pointer;
  padding: 1px 6px;
  border-radius: 4px;
  color: inherit;
  font: inherit;
  white-space: nowrap;
}
#${DOCK_ID} [data-sve-html-problems] button:hover {
  background: rgba(255, 255, 255, .12);
}
#${DOCK_ID} [data-sve-html-problems] button b {
  font-weight: 600;
  opacity: .8;
}
#${DOCK_ID} .sve-cm-partial {
  text-decoration: underline dotted;
  text-underline-offset: 3px;
  background: color-mix(in srgb, var(--sve-fam-component) 16%, transparent);
  /* Text, because the left button writes here now. The underline still says
     there is a file behind it; the right button is what opens it. */
  cursor: text;
}
#${DOCK_ID} .sve-cm-partial-line {
  background: color-mix(in srgb, var(--sve-fam-component) 10%, transparent);
}
#${DOCK_ID}[data-sve-code-locked] .sve-cm-partial {
  text-decoration: none;
  background: transparent;
  cursor: default;
  pointer-events: none;
}
#${DOCK_ID}[data-sve-code-locked] .sve-cm-partial-line {
  background: transparent;
}
#${PARTIAL_MENU_ID} {
  position: fixed;
  z-index: 90;
  min-width: 168px;
  max-width: 280px;
  max-height: 240px;
  overflow: auto;
  padding: 6px;
  border-radius: 8px;
  background: #252526;
  color: #d4d4d4;
  border: 1px solid rgba(255,255,255,.12);
  box-shadow: 0 8px 24px rgba(0,0,0,.4);
  font-family: ui-sans-serif, system-ui, sans-serif;
}
#${PARTIAL_MENU_ID} [data-sve-partial-choice] {
  all: unset;
  cursor: pointer;
  display: block;
  width: 100%;
  box-sizing: border-box;
  padding: 5px 8px;
  border-radius: 4px;
  font-size: 13px;
  /* A sentence now — "Open image" — not a file name, and the same face the
     HTML tree's row menu uses. */
  font-family: ui-sans-serif, system-ui, sans-serif;
}
#${PARTIAL_MENU_ID} [data-sve-partial-choice]:hover {
  background: rgba(255,255,255,.1);
}
#${PARTIAL_MENU_ID} [data-sve-partial-empty] {
  padding: 6px 8px;
  font-size: 12px;
  opacity: .55;
}
.sve-tw-info {
  font: 11px/1.4 ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  padding: 6px 8px;
  max-width: 320px;
  color: #d4d4d4;
}
.sve-tw-info pre {
  margin: 0;
  white-space: pre-wrap;
  font: inherit;
}
.sve-tw-swatch {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 2px;
  border: 1px solid rgba(255,255,255,.25);
  margin: 0 6px 4px 0;
  vertical-align: middle;
}
.cm-tooltip.sve-tw-complete {
  background: #1E1E21 !important;
  color: #d4d4d4;
  border: 1px solid #454545 !important;
  border-radius: 4px;
  box-shadow: 0 4px 16px rgba(0,0,0,.45);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace !important;
  font-size: 12px !important;
  line-height: 18px !important;
  padding: 0 !important;
  overflow: hidden;
}
.cm-tooltip.sve-tw-complete > ul {
  font: inherit !important;
  max-height: 240px;
  padding: 2px 0;
  margin: 0;
}
.cm-tooltip.sve-tw-complete > ul > li {
  padding: 1px 8px 1px 6px !important;
  line-height: 22px !important;
  font: inherit !important;
}
.cm-tooltip.sve-tw-complete > ul > li[aria-selected] {
  background: rgba(255,255,255,.1) !important;
}
.cm-tooltip.sve-tw-complete .cm-completionLabel {
  color: #9cdcfe;
  font-size: 12px !important;
}
.cm-tooltip.sve-tw-complete .cm-completionMatchedText {
  text-decoration: none;
  font-weight: 600;
}
.cm-tooltip.sve-tw-complete .cm-completionDetail {
  display: none;
  color: #808080 !important;
  font-size: 11px !important;
  font-style: normal !important;
  margin-left: 16px;
}
.cm-tooltip.sve-tw-complete > ul > li[aria-selected] .cm-completionDetail {
  display: inline;
}
.cm-tooltip.sve-tw-complete .cm-completionIcon {
  width: 14px;
  height: 14px;
  opacity: .65;
  font-size: 11px !important;
  margin-right: 6px;
}
#${DOCK_ID} .emmet-tracker {
  text-decoration: underline 1px #4ade80;
}
`);
}

function editorRight(doc) {
  const editor = doc.querySelector('.live-preview-editor');

  if (!editor) {
    return 0;
  }

  const r = editor.getBoundingClientRect();

  if (r.width < 40 || r.right < 40) {
    return 0;
  }

  return Math.round(r.right);
}

function rightInset(doc) {
  let right = 0;

  for (const id of [
    '__sve-section-picker',
    '__sve-outline-panel',
    '__sve-html-tree-panel',
    '__sve-listview-panel',
    '__sve-right-dock',
    '__sve-chrome-designs',
    '__sve-global-section-panel',
    '__sve-ai-panel',
  ]) {
    const el = doc.getElementById(id);

    if (!el || el.hasAttribute('data-sve-chrome-hidden') || el.hasAttribute('data-sve-right-closed') || el.style.display === 'none') {
      continue;
    }

    const r = el.getBoundingClientRect();

    if (r.width > 40 && r.right > doc.documentElement.clientWidth - 8) {
      right = Math.max(right, Math.round(r.width));
    }
  }

  return right;
}

/**
 * Follow the left editor and right dock as they resize. The code dock is
 * `position:fixed` with `left`/`right` measured from those two; without this
 * it stays put until the CP's debounced DOM pass (~500ms) runs.
 */
export function observeDockLayout(win) {
  const doc = win.document;

  dockState.layoutWin = win;

  if (typeof win.ResizeObserver !== 'function') {
    return;
  }

  if (!dockState.layoutObserver) {
    dockState.layoutObserver = new win.ResizeObserver(() => {
      if (dockState.layoutWin) {
        relayoutCodeDock(dockState.layoutWin);
      }
    });
  }

  const editor = doc.querySelector('.live-preview-editor');
  const right = doc.getElementById('__sve-right-dock');

  if (editor !== dockState.observedEditor) {
    if (dockState.observedEditor) {
      dockState.layoutObserver.unobserve(dockState.observedEditor);
    }

    dockState.observedEditor = editor;

    if (editor) {
      dockState.layoutObserver.observe(editor);
    }
  }

  if (right !== dockState.observedRight) {
    if (dockState.observedRight) {
      dockState.layoutObserver.unobserve(dockState.observedRight);
    }

    dockState.observedRight = right;

    if (right) {
      dockState.layoutObserver.observe(right);
    }
  }
}

export function stopObservingDockLayout() {
  dockState.layoutObserver?.disconnect();
  dockState.layoutObserver = null;
  dockState.layoutWin = null;
  dockState.observedEditor = null;
  dockState.observedRight = null;
}

export function bindLayoutWatch(win) {
  if (dockState.layoutWatchBound) {
    return;
  }

  dockState.layoutWatchBound = true;
  win.addEventListener('sve-right-dock-change', () => observeDockLayout(win));
}

export function previewBottomPad(doc, px) {
  const el = doc.querySelector('.live-preview-contents');

  if (el) {
    el.style.paddingBottom = px ? `${px}px` : '';
  }
}

function sizeEditorHosts(dock) {
  if (!dock) {
    return;
  }

  const dockH = dock.clientHeight;
  const bar = dock.querySelector('[data-sve-code-bar]');
  const banner = dock.querySelector('[data-sve-code-lock-banner]');
  const bannerH = banner && winOf(dock)?.getComputedStyle(banner).display !== 'none'
    ? banner.offsetHeight
    : 0;
  const panesH = Math.max(64, dockH - (bar?.offsetHeight || 0) - bannerH);
  const panes = dock.querySelector('[data-sve-code-panes]');

  if (panes) {
    panes.style.height = `${panesH}px`;
    panes.style.minHeight = '0';
    panes.style.overflow = 'hidden';
  }

  dock.querySelectorAll('[data-sve-code-host]').forEach((host) => {
    const pane = host.closest('[data-sve-code-pane]');

    if (!pane || pane.style.display === 'none') {
      return;
    }

    let chrome = 0;

    for (const child of pane.children) {
      if (child === host) {
        continue;
      }

      chrome += child.offsetHeight;
    }

    const h = Math.max(64, panesH - chrome);

    host.style.height = `${h}px`;
    host.style.maxHeight = `${h}px`;
    host.style.minHeight = '0';
    host.style.overflow = 'auto';
    bindHostWheel(host);
  });
}

function winOf(el) {
  return el.ownerDocument?.defaultView || dockState.lastWin;
}

function bindHostWheel(host) {
  if (host._sveWheelBound) {
    return;
  }

  host._sveWheelBound = true;
  host.addEventListener(
    'wheel',
    (event) => {
      const maxY = host.scrollHeight - host.clientHeight;
      const maxX = host.scrollWidth - host.clientWidth;
      let used = false;

      if (event.deltaY && maxY > 0) {
        const next = Math.min(maxY, Math.max(0, host.scrollTop + event.deltaY));

        if (next !== host.scrollTop) {
          host.scrollTop = next;
          used = true;
        }
      }

      if (event.deltaX && maxX > 0) {
        const next = Math.min(maxX, Math.max(0, host.scrollLeft + event.deltaX));

        if (next !== host.scrollLeft) {
          host.scrollLeft = next;
          used = true;
        }
      }

      if (used) {
        event.preventDefault();
        event.stopPropagation();
      }
    },
    { passive: false }
  );
}

function measureEditors() {
  const dock = (dockState.layoutWin || dockState.lastWin)?.document?.getElementById(DOCK_ID);

  if (dock) {
    sizeEditorHosts(dock);
  }

  for (const handle of HANDLES) {
    editors[handle]?.requestMeasure();
  }
}

function panesOf(win, dock) {
  const stored = storedPanes(win);
  const out = {};

  for (const handle of PANES) {
    const btn = dock.querySelector(`[data-sve-code-pane-btn="${handle}"]`);

    out[handle] = btn ? btn.getAttribute('aria-pressed') === 'true' : stored[handle];
  }

  return out;
}

export function paintPaneButtons(dock, panes) {
  for (const handle of PANES) {
    const btn = dock.querySelector(`[data-sve-code-pane-btn="${handle}"]`);
    const pane = dock.querySelector(`[data-sve-code-pane="${handle}"]`);

    if (btn) {
      btn.setAttribute('aria-pressed', panes[handle] ? 'true' : 'false');
    }

    if (pane) {
      pane.style.display = panes[handle] ? 'flex' : 'none';
    }
  }

  const visible = PANES.filter((handle) => panes[handle]);

  dock.querySelectorAll('[data-sve-code-split]').forEach((split) => {
    const after = split.getAttribute('data-sve-code-split-after');
    const i = visible.indexOf(after);

    split.style.display = i >= 0 && i < visible.length - 1 ? 'block' : 'none';
  });

  applyPaneWidths(dock.ownerDocument.defaultView, dock);
  sizeEditorHosts(dock);
}

function applyPaneWidths(win, dock) {
  const widths = storedWidths(win);

  for (const handle of PANES) {
    const pane = dock.querySelector(`[data-sve-code-pane="${handle}"]`);

    if (pane) {
      pane.style.flex = `${widths[handle]} 1 0`;
    }
  }
}

export function placeDock(win, dock) {
  if (dockState.dragging) {
    return;
  }

  const doc = win.document;
  attachDock(doc, dock);
  const height = storedHeight(win);
  const left = editorRight(doc);
  const right = rightInset(doc);

  dock.style.left = `${left}px`;
  dock.style.right = `${right}px`;
  dock.style.bottom = '0';
  dock.style.height = `${height}px`;
  previewBottomPad(doc, height);
  sizeEditorHosts(dock);
}

/**
 * Keep pointer events on this window for the whole drag. Live Preview's
 * iframe otherwise swallows mousemove/mouseup the moment the cursor
 * crosses into it — the dock freezes, then jumps when events come back.
 */
/** The dock's drag: the shared overlay drag plus this module's `dragging` flag. */
function beginDockDrag(win, cursor, onMove, onEnd) {
  dockState.dragging = true;

  beginOverlayDrag(
    win,
    cursor,
    onMove,
    () => {
      dockState.dragging = false;
      onEnd?.();
    },
    'data-sve-code-drag-shield'
  );
}

export function bindResize(win, dock) {
  if (dock._sveResizeBound) {
    return;
  }

  dock._sveResizeBound = true;

  const startResize = (event) => {
    // Anything you can operate is not a place to grab the dock by. This used to
    // be a hand-kept list of every button in the bar, and the cost of missing
    // one is invisible and total: pressing it starts a drag, the drag shield
    // goes up under the cursor, the pointer comes up on the shield instead of
    // on the button, and the browser never makes a click at all. The button
    // looks right, lights nothing, does nothing, and there is no error to find.
    // `[data-sve-values-mode]` was the one missing, and the ID button was dead
    // for as long as it existed.
    //
    // The bar is still draggable — by the grip above it, and by the empty space
    // between the controls, which is what people reach for anyway.
    if (event.button !== 0 || event.target.closest(
      'button, a, input, select, textarea, label, [role="button"], [contenteditable], .cm-editor'
    )) {
      return;
    }

    event.preventDefault();

    const startY = event.clientY;
    const startH = dock.getBoundingClientRect().height;
    let next = startH;

    beginDockDrag(
      win,
      'ns-resize',
      (e) => {
        next = Math.min(
          Math.max(MIN_HEIGHT, startH + (startY - e.clientY)),
          Math.round(win.innerHeight * 0.7)
        );
        dock.style.height = `${next}px`;
        previewBottomPad(win.document, next);
        measureEditors();
      },
      () => {
        storeHeight(win, next);
        placeDock(win, dock);
        win.dispatchEvent(new Event('resize'));
      }
    );
  };

  dock.querySelector('[data-sve-code-bar]')?.addEventListener('mousedown', startResize);
  dock.querySelector('[data-sve-code-grip]')?.addEventListener('mousedown', startResize);
}

export function bindSplitters(win, dock) {
  if (dock._sveSplitBound) {
    return;
  }

  dock._sveSplitBound = true;

  dock.querySelectorAll('[data-sve-code-split]').forEach((split) => {
    split.addEventListener('mousedown', (event) => {
      if (event.button !== 0) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      const after = split.getAttribute('data-sve-code-split-after');
      const visible = PANES.filter((handle) => panesOf(win, dock)[handle]);
      const i = visible.indexOf(after);
      const leftHandle = visible[i];
      const rightHandle = visible[i + 1];

      if (!leftHandle || !rightHandle) {
        return;
      }

      const leftEl = dock.querySelector(`[data-sve-code-pane="${leftHandle}"]`);
      const rightEl = dock.querySelector(`[data-sve-code-pane="${rightHandle}"]`);
      const startX = event.clientX;
      const leftW = leftEl.getBoundingClientRect().width;
      const rightW = rightEl.getBoundingClientRect().width;
      const total = leftW + rightW;

      split.setAttribute('data-active', '');

      beginDockDrag(
        win,
        'col-resize',
        (e) => {
          const dx = e.clientX - startX;
          let nextL = Math.max(MIN_PANE, Math.min(total - MIN_PANE, leftW + dx));
          let nextR = total - nextL;

          if (total < MIN_PANE * 2) {
            nextL = leftW;
            nextR = rightW;
          }

          const widths = storedWidths(win);

          widths[leftHandle] = nextL;
          widths[rightHandle] = nextR;
          storeWidths(win, widths);
          applyPaneWidths(win, dock);
          measureEditors();
        },
        () => {
          split.removeAttribute('data-active');
        }
      );
    });
  });
}

export function bindPaneToggles(win, dock) {
  if (dock._svePaneBound) {
    return;
  }

  dock._svePaneBound = true;

  dock.querySelectorAll('[data-sve-code-pane-btn]').forEach((btn) => {
    btn.addEventListener('click', (event) => {
      event.stopPropagation();

      const handle = btn.getAttribute('data-sve-code-pane-btn');
      const panes = panesOf(win, dock);
      const next = { ...panes, [handle]: !panes[handle] };

      if (!next.html && !next.css && !next.js) {
        next[handle] = true;
      }

      storePanes(win, next);
      paintPaneButtons(dock, next);
    });
  });
}

export function setStatus(doc, text) {
  const el = doc.getElementById(DOCK_ID)?.querySelector('[data-sve-code-status]');

  if (el) {
    el.textContent = text || '';
  }
}

export function setPath(doc, path) {
  const el = doc.getElementById(DOCK_ID)?.querySelector('[data-sve-code-path]');

  if (el) {
    el.textContent = path || '';
    el.title = path || '';
  }
}

export function paintBack(win) {
  const btn = win?.document?.getElementById(DOCK_ID)?.querySelector('[data-sve-code-back]');

  if (!btn) {
    return;
  }

  btn.hidden = dockState.typeStack.length === 0;
  btn.title = t(win, 'code_dock_back');
  btn.setAttribute('aria-label', btn.title);
  btn.innerHTML = BACK_ICON;
}

export function bindBack(win, dock) {
  const btn = dock.querySelector('[data-sve-code-back]');

  if (!btn || btn._sveBound) {
    return;
  }

  btn._sveBound = true;
  btn.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    goBackTemplate(win);
  });
}
