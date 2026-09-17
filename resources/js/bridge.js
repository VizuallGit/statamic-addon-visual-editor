/**
 * bridge.js — the CP shell's barrel. The code lives in bridge/*.js, one file per
 * region; this file keeps the import surface panels already use, plus the two
 * overlay entry points that stay here. Region order below is evaluation order.
 */

// KERNEL — not Vue. Preview iframe bridge. Do not convert this file.
// Do not import it from resources/js/cp/surfaces/.
//
// Bridge script — injected into the Live Preview iframe.
// Only activates when running inside an iframe (window.self !== window.top).


export const ACTIVE_ATTR = 'data-sid-active';
export const HOVER_ATTR = 'data-sid-hover';
export const INNER_ATTR = 'data-sid-inner';
export const SID_ATTR = 'data-sid';
export const SID_FIELD_ATTR = 'data-sid-field';
export const TOOLBAR_ATTR = 'data-sid-toolbar';
/** Opt-in from `{{ visual_edit section-orderable="true" }}` — tag-agnostic page section. */
export const SECTION_ORDERABLE_ATTR = 'data-sid-section-orderable';
export const STYLES_ID = '__sve-bridge-styles';

/**
 * A translated string. The CP user's language is resolved server-side and rides
 * in on the preview response (InjectBridgeScript), because the preview can't see
 * the CP's config. Falls back to the key so a missing string is obvious, never
 * blank.
 */
export function t(key, replacements = {}) {
  let out = (window.__sveStrings || {})[key] ?? key;

  for (const [name, value] of Object.entries(replacements)) {
    out = out.replaceAll(`:${name}`, value);
  }

  return out;
}

/**
 * Is a tool switched on for this site? (Addons > Statamic Visual Editor.)
 *
 * Rides in on the preview response the same way the strings do. Unknown keys read
 * as on — an absent map must not strip the editor down to nothing.
 */
export function featureOn(key) {
  return (window.__sveFeatures || {})[key] !== false;
}

export const MOUSE_ACTIVE_CLASS = 'sve-mouse-active';
export const HOVER_CLEAR_DELAY = 1500; // ms of mouse inactivity before outline clears
export const PULSE_DURATION = 400; // ms — matches the sve-cp-pulse @keyframes animation duration
export const EDITING_ATTR = 'data-sve-editing';
export const EDIT_REQUEST_TIMEOUT = 2000; // ms before an unanswered edit-request is abandoned
export const EDIT_INPUT_DEBOUNCE = 150; // ms of typing pause before syncing the value to the CP

export const COMPONENT_FOCUSED = 'data-sve-component-focused';
export const COMPONENT_DIM = 'data-sve-component-dim';

export * from './bridge/component-pick.js';
export * from './bridge/messages.js';
export * from './bridge/inline-edit.js';
export * from './bridge/row-toolbar.js';
export * from './bridge/global-sections.js';
export * from './bridge/header-footer.js';
export * from './bridge/row-caps-move.js';
export * from './bridge/grid.js';
export * from './bridge/drag.js';
export * from './bridge/editing.js';
export * from './bridge/sid-targets.js';
export * from './bridge/outline-nav.js';
export * from './bridge/inserters.js';
