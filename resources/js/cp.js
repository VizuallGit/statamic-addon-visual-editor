/**
 * cp.js — the CP shell's barrel. The code lives in cp-shell/*.js, one file per
 * region; this file keeps the import surface panels already use, plus the two
 * overlay entry points that stay here. Region order below is evaluation order.
 */
import { t } from './lib/i18n.js';
import { SELECTORS } from './cp-selectors.js';
import { stampGridRows } from './cp-section-groups.js';

/**
 * Control Panel hub for Live Preview.
 *
 * Owns postMessage routing from the preview iframe, the LP toolbar, and
 * helpers that several panels share (find a set by `_visual_id`, highlight,
 * replay). Panel UIs are not mounted from here:
 *
 *   section-library.js  — Patterns / saved sections
 *   outline-panel.js    — heading outline
 *   block-tree.js       — list view + comments dock
 *   focus-panel.js      — one-section editor beside the preview
 *   inline-edit.js      — name prompts / save-section dialogs
 *   code-dock.js        — template dock
 *   site-css.js         — site stylesheets (resources/css)
 *   ai-panel.js         — AI chat
 *
 * Overlay open/goto live in overlay-host.js (locked). This file loads them
 * with import() so the CP bundle does not parse overlay-host at boot.
 */

export { t } from './lib/i18n.js';
export { SELECTORS, GLOBALS_PANEL_PARAM } from './cp-selectors.js';
export { stampGridRows, hideAutoUuidGridColumns } from './cp-section-groups.js';


export async function openOverlay(win, url) {
  const overlay = await import('./overlay-host.js');

  overlay.openOverlay(win, url);
}

export * from './cp-shell/sets.js';
export * from './cp-shell/preview-chrome.js';
export * from './cp-shell/block-order.js';
export * from './cp-shell/header-toolbar.js';
export * from './cp-shell/grid-rows.js';
export * from './cp-shell/add-section.js';
export * from './cp-shell/boot.js';
