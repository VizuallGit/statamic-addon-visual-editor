// KERNEL — not Vue. Preview iframe bridge. Do not convert this file.
// Do not import it from resources/js/cp/surfaces/.
//
// Bridge script — injected into the Live Preview iframe.
// Only activates when running inside an iframe (window.self !== window.top).

import { findPickRoot, HT_PATH_ATTR, stampHtmlPick, unstampHtmlPick } from './html-pick-align.js';

const ACTIVE_ATTR = 'data-sid-active';
const HOVER_ATTR = 'data-sid-hover';
const INNER_ATTR = 'data-sid-inner';
const SID_ATTR = 'data-sid';
const SID_FIELD_ATTR = 'data-sid-field';
const TOOLBAR_ATTR = 'data-sid-toolbar';
/** Opt-in from `{{ visual_edit section-orderable="true" }}` — tag-agnostic page section. */
const SECTION_ORDERABLE_ATTR = 'data-sid-section-orderable';
const STYLES_ID = '__sve-bridge-styles';

/**
 * A translated string. The CP user's language is resolved server-side and rides
 * in on the preview response (InjectBridgeScript), because the preview can't see
 * the CP's config. Falls back to the key so a missing string is obvious, never
 * blank.
 */
function t(key, replacements = {}) {
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
function featureOn(key) {
  return (window.__sveFeatures || {})[key] !== false;
}

const MOUSE_ACTIVE_CLASS = 'sve-mouse-active';
const HOVER_CLEAR_DELAY = 1500; // ms of mouse inactivity before outline clears
const PULSE_DURATION = 400; // ms — matches the sve-cp-pulse @keyframes animation duration
const EDITING_ATTR = 'data-sve-editing';
const EDIT_REQUEST_TIMEOUT = 2000; // ms before an unanswered edit-request is abandoned
const EDIT_INPUT_DEBOUNCE = 150; // ms of typing pause before syncing the value to the CP

// --- Inline editing state ----------------------------------------------------
// pendingEdit: an edit-request sent to the CP, awaiting edit-start / edit-deny.
// editing: the active inline-edit session (contenteditable element + listeners).
let pendingEdit = null;
let editing = null;
let requestSeq = 0;
let htmlPick = null;

function applyHtmlPick(win) {
  if (!htmlPick) {
    unstampHtmlPick(win.document);

    return;
  }

  const root = findPickRoot(win.document, htmlPick);

  if (root) {
    stampHtmlPick(root, htmlPick.nodes);
  }
}

/**
 * Whitespace-normalizes text for comparison across the preview DOM and the CP
 * form values: nbsp → space, collapse runs, trim. Duplicated in cp.js because
 * the two files run in separate bundles (preview iframe vs. CP window).
 */
export function normText(s) {
  return (s || '').replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * Copies --focus-outline-width and --focus-outline-color from the CP (parent)
 * document into the preview iframe's documentElement so both ends share the
 * same outline token values. Falls back to safe defaults when the CP is
 * inaccessible (cross-origin guard) or the variables are not defined.
 */
export function injectCpVariables(doc, win) {
  // Thin dashed outline. Per-element --sve-outline-color is set from background
  // luminance (black 30% on light, white 30% on dark). Fallback assumes light.
  // Dash/gap are custom (CSS outline can't control them) — painted via ::before.
  const outlineWidth = '1px';
  const outlineColor = 'rgba(0, 0, 0, 0.3)';

  doc.documentElement.style.setProperty('--sve-outline-width', outlineWidth);
  doc.documentElement.style.setProperty('--sve-outline-color', outlineColor);
  doc.documentElement.style.setProperty('--sve-dash', '8px');
  doc.documentElement.style.setProperty('--sve-gap', '6px');
  doc.documentElement.style.setProperty('--sve-focus-color', outlineColor);
  doc.documentElement.style.setProperty('--sve-hover-color', outlineColor);
}

export function injectStyles(doc) {
  if (doc.getElementById(STYLES_ID)) {
    return;
  }

  const style = doc.createElement('style');

  style.id = STYLES_ID;
  style.textContent = `
        [data-sid], [data-sid-field], [data-sid-global] {
            cursor: pointer;
            outline-width: var(--sve-outline-width, 1px);
            outline-style: dashed;
            outline-color: transparent;
            outline-offset: 2px;
            transition: outline-color 0.15s ease;
        }
        /* Iconify/iconamic: layout only. A filled icon uses the same
           hover/active ring as a headline. Empty slots keep a clickable
           dashed box so "no icon yet" still opens the search. */
        [data-sid-field][data-sid-fieldtype="iconify"],
        [data-sid-field][data-sid-fieldtype="iconamic"] {
            position: relative;
            display: inline-flex;
            vertical-align: middle;
            align-items: center;
            justify-content: center;
        }
        [data-sid-field][data-sid-fieldtype="iconify"]:not(:has(svg, img, iconify-icon, picture)),
        [data-sid-field][data-sid-fieldtype="iconamic"]:not(:has(svg, img, iconify-icon, picture)) {
            min-width: 2.25em;
            min-height: 2.25em;
        }
        /* Ghost text while a field is empty — editor only, never stored.
           A real child (not ::before/::after): those pseudos already paint the
           dashed ring and the set label. */
        [data-sve-placeholder] {
            display: inline;
            pointer-events: none;
            user-select: none;
            -webkit-user-select: none;
        }
        [data-sve-placeholder]::before {
            content: attr(data-sve-placeholder);
            opacity: 0.4;
        }
        [${EDITING_ATTR}] [data-sve-placeholder] {
            display: none;
        }
        [data-sid-field][data-sid-fieldtype="iconify"]:not(:has(svg, img, iconify-icon, picture)):not([data-sid-inner]):not([data-sid-hover]):not([data-sid-active]),
        [data-sid-field][data-sid-fieldtype="iconamic"]:not(:has(svg, img, iconify-icon, picture)):not([data-sid-inner]):not([data-sid-hover]):not([data-sid-active]) {
            --sve-outline-color: var(--sve-outline-ambient, rgba(0, 0, 0, 0.18));
        }
        [data-sid-orderable] {
            cursor: grab;
        }
        /* "Whole card is a link" pattern: a stretched-link overlay
           (a::after/::before { position:absolute; inset:0 }) sits on top of an
           orderable card, so the pointer hits the link instead of the row — you
           get a link cursor rather than the grab hand, the drag is swallowed, and
           the browser starts a native link-drag. In the preview a link never
           navigates, so its overlay must not intercept the pointer: let the
           cursor, hit-testing and drag fall through to the card beneath. The link
           itself keeps working (its own box is untouched); only its overlay
           pseudo is neutralised, and native dragging of the link is disabled. */
        [data-sid-orderable] a::after,
        [data-sid-orderable] a::before {
            pointer-events: none !important;
        }
        [data-sid-orderable] a {
            -webkit-user-drag: none;
        }
        .sve-dragging, .sve-dragging * {
            cursor: move !important;
            user-select: none !important;
            -webkit-user-select: none !important;
        }
        /* Drop slot while reordering: a solid 1px ring with a light fill,
           sitting a little outside the row so the next place is obvious. */
        [data-sve-drop-slot] {
            position: fixed;
            z-index: 2147483646;
            pointer-events: none;
            box-sizing: border-box;
        }
        [data-sve-drop-slot="line"] {
            border-radius: 2px;
            background: var(--sve-drop-color, var(--sve-focus-color, #3b82f6));
            box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.4);
        }
        [data-sve-drop-slot="box"] {
            border-radius: 6px;
            border: 1px solid color-mix(in srgb, var(--sve-drop-color, #fff) 70%, transparent);
            background: color-mix(in srgb, var(--sve-drop-color, #fff) 12%, transparent);
        }
        .sve-col-resizing, .sve-col-resizing * {
            cursor: col-resize !important;
            user-select: none !important;
            -webkit-user-select: none !important;
        }
        [data-sve-ghost], [data-sve-ghost] * {
            outline: none !important;
            animation: none !important;
            list-style: none !important;
        }
        [data-sid-global] {
            outline: none;
        }
        /* Custom dashed ring — CSS outline/border can't control dash length.
           ::before (not ::after: labels use ::after) paints wider dashes + gaps. */
        /* The colour, not the shorthand. "outline: none" also resets the colour
           to currentColor and the width to medium, and the base rule's 0.15s
           colour transition then runs that opaque value back down to transparent
           when the attribute goes away — a thin dark edge flashing around every
           block on the way out of a hover. Overriding only the colour leaves
           nothing to transition from. */
        [data-sid-inner],
        [data-sid-hover],
        [data-sid-active],
        [${EDITING_ATTR}] {
            outline-color: transparent !important;
            box-shadow: none !important;
        }
        /* outline="always": while the pointer is anywhere in the container, every
           block in it wears the same ring as the one being hovered — not the
           thin base outline, which sits at a different offset and would read as
           a second border around the same block. A block with a picture in it
           shows its own extent; one that is only text on the section's own
           background does not, and a width you cannot see is one you cannot
           judge.

           The ring is drawn on a pseudo-element, so its block has to be a
           positioning context. Set for good rather than on hover: switching an
           element from static to relative re-anchors anything absolute inside
           it, and having that happen the moment you point at a block would look
           like the page twitching. */
        [data-sid-outline="always"] > [data-sid] {
            position: relative;
        }
        /* Ambient rings sit back a step, so the block under the pointer still
           reads as the one under the pointer. Same ring, less of it. */
        [data-sid-outline="always"]:hover > [data-sid]:not([data-sid-inner]):not([data-sid-hover]):not([data-sid-active]),
        [data-sid-outline="always"][data-sid-outline-on] > [data-sid]:not([data-sid-inner]):not([data-sid-hover]):not([data-sid-active]) {
            --sve-outline-color: var(--sve-outline-ambient, rgba(0, 0, 0, 0.12));
        }
        /* Mid-drag every block steps back, the one being dragged included. What
           matters then is the outline you are pulling, and it can only read as
           the answer if nothing else on screen is speaking at the same volume. */
        html.sve-col-resizing [data-sid-outline="always"] > [data-sid] {
            --sve-outline-color: var(--sve-outline-ambient, rgba(0, 0, 0, 0.12));
        }
        [data-sid-inner]::before,
        [data-sid-hover]::before,
        [data-sid-active]::before,
        [data-sid-outline="always"]:hover > [data-sid]::before,
        [data-sid-outline="always"][data-sid-outline-on] > [data-sid]::before,
        [data-sid-field][data-sid-fieldtype="iconify"]:not(:has(svg, img, iconify-icon, picture))::before,
        [data-sid-field][data-sid-fieldtype="iconamic"]:not(:has(svg, img, iconify-icon, picture))::before,
        [${EDITING_ATTR}]::before {
            content: '';
            position: absolute;
            inset: -6px;
            border-radius: 4px;
            pointer-events: none;
            z-index: 9998;
            box-sizing: border-box;
            background:
                repeating-linear-gradient(
                    90deg,
                    var(--sve-outline-color, rgba(0, 0, 0, 0.3)) 0 var(--sve-dash, 8px),
                    transparent var(--sve-dash, 8px) calc(var(--sve-dash, 8px) + var(--sve-gap, 6px))
                ) top left / 100% var(--sve-outline-width, 1px) no-repeat,
                repeating-linear-gradient(
                    90deg,
                    var(--sve-outline-color, rgba(0, 0, 0, 0.3)) 0 var(--sve-dash, 8px),
                    transparent var(--sve-dash, 8px) calc(var(--sve-dash, 8px) + var(--sve-gap, 6px))
                ) bottom left / 100% var(--sve-outline-width, 1px) no-repeat,
                repeating-linear-gradient(
                    180deg,
                    var(--sve-outline-color, rgba(0, 0, 0, 0.3)) 0 var(--sve-dash, 8px),
                    transparent var(--sve-dash, 8px) calc(var(--sve-dash, 8px) + var(--sve-gap, 6px))
                ) top left / var(--sve-outline-width, 1px) 100% no-repeat,
                repeating-linear-gradient(
                    180deg,
                    var(--sve-outline-color, rgba(0, 0, 0, 0.3)) 0 var(--sve-dash, 8px),
                    transparent var(--sve-dash, 8px) calc(var(--sve-dash, 8px) + var(--sve-gap, 6px))
                ) top right / var(--sve-outline-width, 1px) 100% no-repeat;
        }
        /* Hovering a different field than the clicked/focused one: hide every
           other ring (active + CP hover) so only the hovered field is outlined. */
        html.sve-outline-hover-override [data-sid-active]:not([data-sid-inner])::before,
        html.sve-outline-hover-override [data-sid-hover]:not([data-sid-inner])::before {
            opacity: 0 !important;
            background: none !important;
        }
        [${EDITING_ATTR}] {
            cursor: text !important;
            opacity: 1 !important;
        }
        [data-sid-inline-edit]:has([${EDITING_ATTR}]) {
            opacity: 1 !important;
        }
        [${EDITING_ATTR}]:focus,
        [data-sid]:focus,
        [data-sid-field]:focus,
        [data-sid-global]:focus {
            outline: none !important;
            box-shadow: none !important;
        }
        [data-sid-inside][data-sid-inner]::before,
        [data-sid-inside][data-sid-hover]::before,
        [data-sid-inside][data-sid-active]::before {
            inset: 1px;
        }
        [data-sid-inside][data-sid-label]::after {
            top: -4px;
        }
        [data-sid][data-sid-label] {
            position: relative;
        }
        [data-sid][data-sid-label]::after {
            /* safe: data-sid-label is populated only by Blade/Antlers auto-escaped output; no XSS risk */
            content: attr(data-sid-label);
            position: absolute;
            top: -8px;
            left: calc(-2px - var(--sve-outline-width, 0));
            transform: translateY(calc(-100%));
            background: var(--sve-outline-color, rgba(0, 0, 0, 0.3));
            color: #fff;
            font-size: 10px;
            font-family: sans-serif;
            padding: 2px 8px !important;
            border-radius: 4px;
            pointer-events: none;
            z-index: 9999;
            white-space: nowrap;
            opacity: 0;
            transition: opacity 0.15s ease;
        }
        [data-sid-inner][data-sid-label]::after,
        [data-sid-hover][data-sid-label]::after,
        [data-sid-active][data-sid-label]::after {
            opacity: 1;
        }
        /* Global (synced) sections. Badge is a real child (not ::before) so it
           never collides with the hover/active outline ring — that shared
           ::before used to paint a solid primary fill over the whole section. */
        [data-sve-global] {
            position: relative;
        }
        [data-sve-global-badge] {
            position: absolute;
            top: 0;
            left: 0;
            background: #7c3aed;
            color: #fff;
            font: 500 10px/1 sans-serif;
            padding: 4px 8px;
            border-radius: 0 0 4px 0;
            z-index: 9999;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.15s ease;
        }
        [data-sve-global]:hover > [data-sve-global-badge],
        [data-sve-global][data-sve-global-focused] > [data-sve-global-badge] {
            opacity: 1;
        }
        [data-sve-global]:not([data-sve-global-focused]):hover {
            outline: 2px dashed #7c3aed;
            outline-offset: -2px;
            cursor: pointer;
        }
        /* Inside a global section, the page around it is out of reach: faded and
           not clickable, so it reads as "right now I am editing this, and only
           this". Nothing is hidden — you can still see where you are. The bar at
           the bottom is the way out. */
        html.sve-global-focus section[data-sid]:not([data-sve-global-focused]),
        html.sve-global-focus article[data-sid]:not([data-sve-global-focused]),
        html.sve-global-focus [data-sid-section-orderable]:not([data-sve-global-focused]) {
            opacity: 0.35;
            pointer-events: none;
            transition: opacity 0.2s ease;
        }
        /* The header and footer are outside the section too. */
        html.sve-global-focus > body > header,
        html.sve-global-focus > body > footer {
            opacity: 0.35;
            pointer-events: none;
            transition: opacity 0.2s ease;
        }
        [data-sve-global-focused] {
            outline: 2px solid #7c3aed !important;
            outline-offset: -2px;
        }
        /* Before you step in, a global section reads as ONE thing you click into,
           not a pile of separately editable fields — so nested field outlines
           stay hidden. Once focused they come back, because from then on it
           edits exactly like the page's own. */
        [data-sve-global]:not([data-sve-global-focused]) [data-sid],
        [data-sve-global]:not([data-sve-global-focused]) [data-sid-field],
        [data-sve-global]:not([data-sve-global-focused]) [data-sid-global],
        [data-sve-global]:not([data-sve-global-focused]) [data-sid-inner],
        [data-sve-global]:not([data-sve-global-focused]) [data-sid-hover],
        [data-sve-global]:not([data-sve-global-focused]) [data-sid-active] {
            outline-color: transparent !important;
            cursor: pointer !important;
        }
        [data-sve-global]:not([data-sve-global-focused]) [data-sid-hover]::before,
        [data-sve-global]:not([data-sve-global-focused]) [data-sid-active]::before,
        [data-sve-global]:not([data-sve-global-focused]) [data-sid-inner]::before {
            display: none !important;
        }
        [data-sve-global]:not([data-sve-global-focused]) [data-sid-label]::after {
            display: none !important;
        }
        /* Site chrome (header / footer): focus class on <html>. Fade is a FIXED
           scrim on html::after — NOT opacity on main. Morphing body/main used to
           paint new nodes at full opacity for a frame (= open/close flicker). */
        [data-sve-chrome] {
            position: relative;
        }
        [data-sve-chrome]::before {
            content: attr(data-sve-chrome-label);
            position: absolute;
            top: 0;
            left: 0;
            background: #0f766e;
            color: #fff;
            font: 500 10px/1 sans-serif;
            padding: 4px 8px;
            border-radius: 0 0 4px 0;
            z-index: 9998;
            pointer-events: none;
            opacity: 0;
        }
        html:not([class*="sve-chrome-focus-"]) [data-sve-chrome]:hover::before,
        html.sve-chrome-focus-header [data-sve-chrome="header"]::before,
        html.sve-chrome-focus-footer [data-sve-chrome="footer"]::before {
            opacity: 1;
        }
        html:not([class*="sve-chrome-focus-"]) [data-sve-chrome]:hover {
            outline: 2px dashed #0f766e;
            outline-offset: -2px;
            cursor: pointer;
        }
        /* Chrome this site does not let anyone edit: no label, no outline, no
           pointer — the hover affordance is a promise, and the click behind it
           has been switched off (see chromeEditable). */
        html.sve-chrome-off-header [data-sve-chrome="header"]::before,
        html.sve-chrome-off-footer [data-sve-chrome="footer"]::before {
            display: none !important;
        }
        html.sve-chrome-off-header [data-sve-chrome="header"]:hover,
        html.sve-chrome-off-footer [data-sve-chrome="footer"]:hover {
            outline: none !important;
            cursor: auto !important;
        }
        html.sve-chrome-focus-header::after,
        html.sve-chrome-focus-footer::after {
            content: '';
            position: fixed;
            inset: 0;
            z-index: 2147483000;
            background: rgba(15, 23, 42, 0.5);
            pointer-events: auto;
        }
        html.sve-chrome-focus-header [data-sve-chrome="header"],
        html.sve-chrome-focus-footer [data-sve-chrome="footer"] {
            outline: 3px solid #0f766e !important;
            outline-offset: -3px;
            position: relative;
            z-index: 2147483001;
            pointer-events: auto;
        }
        html.sve-chrome-focus-header [data-sve-chrome="footer"] [data-sid],
        html.sve-chrome-focus-header [data-sve-chrome="footer"] [data-sid-field],
        html.sve-chrome-focus-header [data-sve-chrome="footer"] [data-sid-global],
        html.sve-chrome-focus-header [data-sve-chrome="footer"] [data-sid-inner],
        html.sve-chrome-focus-header [data-sve-chrome="footer"] [data-sid-hover],
        html.sve-chrome-focus-header [data-sve-chrome="footer"] [data-sid-active],
        html.sve-chrome-focus-footer [data-sve-chrome="header"] [data-sid],
        html.sve-chrome-focus-footer [data-sve-chrome="header"] [data-sid-field],
        html.sve-chrome-focus-footer [data-sve-chrome="header"] [data-sid-global],
        html.sve-chrome-focus-footer [data-sve-chrome="header"] [data-sid-inner],
        html.sve-chrome-focus-footer [data-sve-chrome="header"] [data-sid-hover],
        html.sve-chrome-focus-footer [data-sve-chrome="header"] [data-sid-active],
        html:not([class*="sve-chrome-focus-"]) [data-sve-chrome] [data-sid],
        html:not([class*="sve-chrome-focus-"]) [data-sve-chrome] [data-sid-field],
        html:not([class*="sve-chrome-focus-"]) [data-sve-chrome] [data-sid-global],
        html:not([class*="sve-chrome-focus-"]) [data-sve-chrome] [data-sid-inner],
        html:not([class*="sve-chrome-focus-"]) [data-sve-chrome] [data-sid-hover],
        html:not([class*="sve-chrome-focus-"]) [data-sve-chrome] [data-sid-active] {
            outline-color: transparent !important;
            cursor: pointer !important;
        }
        html:not([class*="sve-chrome-focus-"]) [data-sve-chrome] [data-sid-label]::after,
        html.sve-chrome-focus-header [data-sve-chrome="footer"] [data-sid-label]::after,
        html.sve-chrome-focus-footer [data-sve-chrome="header"] [data-sid-label]::after {
            display: none !important;
        }
        .sve-cp-pulse {
            animation: sve-cp-pulse 0.4s ease-out;
        }
        @keyframes sve-cp-pulse {
            0%   { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.5); }
            100% { box-shadow: 0 0 0 8px rgba(59, 130, 246, 0); }
        }
    `;

  doc.head.appendChild(style);
}



/**
 * Returns the nearest preceding sibling that is (or contains) a non-text
 * [data-sid] element. Handles cases where data-sid lives on a descendant
 * element rather than the sibling itself (e.g. video IFRAME inside a wrapper
 * div that has no data-sid of its own).
 */
function findPrecedingSetSibling(el) {
  let prev = el.previousElementSibling;

  while (prev) {
    if (prev.hasAttribute(SID_ATTR) && prev.getAttribute('data-sid-type') !== 'text') {
      return prev;
    }

    // data-sid might live on a descendant inside an un-annotated wrapper (e.g. video)
    const inner = prev.querySelector(`[${SID_ATTR}]:not([data-sid-type="text"])`);

    if (inner) {
      return inner;
    }

    prev = prev.previousElementSibling;
  }

  return null;
}

/**
 * Given the article-set uid and an afterSetUid (the UID of the preceding set,
 * or null for the first text group), returns the matching text element in doc.
 */
export function findTextAfterSetUid(uid, afterSetUid, doc) {
  if (afterSetUid === null) {
    return doc.querySelector(`[${SID_ATTR}="${uid}"][data-sid-type="text"]`);
  }

  const setEl = doc.querySelector(`[${SID_ATTR}="${afterSetUid}"]`);

  if (!setEl) {
    return null;
  }

  // If setEl is not a direct sibling of text elements (e.g. the data-sid lives
  // on a deeply-nested element like an IFRAME inside a wrapper div), bubble up
  // to the level where there are next siblings.
  let scope = setEl;

  while (scope.parentElement && !scope.parentElement.hasAttribute(SID_ATTR) && !scope.nextElementSibling) {
    scope = scope.parentElement;
  }

  let next = scope.nextElementSibling;

  while (next) {
    if (next.hasAttribute(SID_ATTR) && next.getAttribute('data-sid-type') === 'text') {
      return next;
    }

    next = next.nextElementSibling;
  }

  return null;
}

// --- Inline editing ----------------------------------------------------------
//
// Flow: click on a [data-sid-field] element → send edit-request (field, scope,
// clicked block + its text) to the CP. The CP resolves the actual form value,
// verifies the rendered text matches it (so modifier-transformed output is never
// edited into the wrong value), and replies edit-start or edit-deny. On
// edit-start the element becomes contenteditable; input is debounced and synced
// to the CP via edit-input, which writes it into the publish form (dirty state +
// live preview update happen through Statamic's own reactivity). Enter or blur
// commits, Escape cancels (CP restores the original value, we restore the DOM).

/**
 * Descends from a [data-sid-field] wrapper to the innermost element that still
 * contains all of the wrapper's text — so contenteditable lands on e.g. the
 * <p> or <span> holding the value rather than an outer layout <div>.
 */
function editableFromWrapper(wrapper) {
  let el = wrapper;

  while (
    el.children.length === 1 &&
    normText(el.children[0].textContent) === normText(el.textContent)
  ) {
    el = el.children[0];
  }

  return el;
}

function placeCaretFromPoint(win, x, y) {
  const doc = win.document;
  let range = null;

  if (doc.caretRangeFromPoint) {
    range = doc.caretRangeFromPoint(x, y);
  } else if (doc.caretPositionFromPoint) {
    const pos = doc.caretPositionFromPoint(x, y);

    if (pos) {
      range = doc.createRange();
      range.setStart(pos.offsetNode, pos.offset);
      range.collapse(true);
    }
  }

  if (range) {
    const sel = win.getSelection();

    sel.removeAllRanges();
    sel.addRange(range);
  }
}

/**
 * The sibling-field controls the visual_edit tag declared for this element
 * (controls="font_tag|size"), as [{handle, display, type, options, default}].
 */
function controlsFrom(wrapper) {
  try {
    const raw = wrapper.getAttribute('data-sid-controls');
    const list = raw ? JSON.parse(raw) : [];

    return Array.isArray(list) ? list.filter((c) => c && typeof c.handle === 'string') : [];
  } catch {
    return []; // malformed config — no controls rather than a broken toolbar
  }
}

/**
 * Sends an edit-request for the clicked [data-sid-field] element. The CP
 * decides whether (and what exactly) it is editable; nothing changes in the
 * DOM until an edit-start reply arrives.
 */
function requestInlineEdit(win, wrapper, event, options = {}) {
  // The boundary for the feature as a whole. Callers gate too — the popup path
  // has to know it is falling back before it decides what to send instead — so
  // this is the backstop that keeps a future caller from reopening the door.
  if (!featureOn('inline_edit')) {
    return;
  }

  // The direct child of the wrapper containing the click — for Bard fields this
  // is the block element (h1/p/…) whose index maps to the ProseMirror node.
  let blockEl = null;

  if (event.target !== wrapper) {
    let node = event.target;

    while (node.parentElement && node.parentElement !== wrapper) {
      node = node.parentElement;
    }

    if (node.parentElement === wrapper) {
      blockEl = node.hasAttribute('data-sve-placeholder') ? null : node;
    }
  }

  const requestId = `sve-edit-${++requestSeq}`;

  if (pendingEdit) {
    clearTimeout(pendingEdit.timeout);
  }

  pendingEdit = {
    requestId,
    wrapper,
    blockEl,
    clickX: event.clientX,
    clickY: event.clientY,
    // Posted instead when the CP denies the edit (dual popup+field elements).
    popupFallback: options.popupFallback ?? null,
    timeout: setTimeout(() => {
      if (pendingEdit && pendingEdit.requestId === requestId) {
        pendingEdit = null;
      }
    }, EDIT_REQUEST_TIMEOUT),
  };

  win.parent.postMessage(
    {
      source: 'statamic-visual-editor',
      type: 'edit-request',
      requestId,
      field: wrapper.getAttribute(SID_FIELD_ATTR),
      scope: wrapper.getAttribute('data-sid-field-uid') || undefined,
      blockIndex: blockEl ? Array.prototype.indexOf.call(wrapper.children, blockEl) : null,
      blockText: blockEl ? normText(blockEl.textContent) : null,
      wrapperText: normText(wrapper.textContent),
      // Inline Bard (headline): preview has bare text/spans; CP may still hold
      // a legacy string or unwrapped text nodes — flag so edit can upgrade.
      bardInline: wrapper.hasAttribute('data-sid-bard-inline'),
      fieldtype: wrapper.getAttribute('data-sid-fieldtype') || '',
      as: wrapper.getAttribute('data-sid-as') || '',
      // Handles only — the CP answers with their current values so the toolbar
      // can render each control pre-selected.
      controls: controlsFrom(wrapper).map((c) => c.handle),
    },
    win.location.origin
  );
}

const escapeHtml = (text) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * What an empty Bard field is — heading vs paragraph. From `as="h3"` /
 * `placeholder="h3:…"`, or from the wrapper tag itself (`<h3>`).
 */
function sidAsKind(el) {
  const fromAs = parseSidAs(el?.getAttribute?.('data-sid-as') || '');

  if (fromAs) {
    return fromAs;
  }

  const heading = /^H([1-6])$/.exec(el?.tagName || '');

  if (heading) {
    return { kind: 'heading', level: Number(heading[1]) };
  }

  return { kind: 'paragraph', level: null };
}

function parseSidAs(raw) {
  const as = String(raw || '')
    .trim()
    .toLowerCase();

  if (!as) {
    return null;
  }

  if (as === 'p' || as === 'paragraph') {
    return { kind: 'paragraph', level: null };
  }

  const h = /^h([1-6])$/.exec(as) || /^heading:?([1-6])?$/.exec(as);

  if (h) {
    return { kind: 'heading', level: Number(h[1] || 2) };
  }

  return null;
}

/**
 * The wrapper child block containing the current selection (whole-field mode),
 * or the session element itself (per-block modes).
 */
function currentBlockEl(win, session) {
  if (session.mode !== 'bard-field') {
    return session.el;
  }

  const sel = win.getSelection();
  let node = sel && sel.rangeCount ? sel.getRangeAt(0).startContainer : null;

  if (!node) {
    return null;
  }

  if (node.nodeType === 3) {
    node = node.parentElement;
  }

  // Prefer the nearest heading/paragraph (may sit inside a vizuDiv wrapper).
  let el = node;

  while (el && el !== session.el) {
    if (el.nodeType === 1 && /^(H[1-6]|P)$/.test(el.tagName) && !el.hasAttribute('data-sve-locked')) {
      return el;
    }

    el = el.parentElement;
  }

  while (node && node.parentElement && node.parentElement !== session.el) {
    node = node.parentElement;
  }

  return node && node.parentElement === session.el && node.nodeType === 1 && !node.hasAttribute('data-sve-locked')
    ? node
    : null;
}

/** True when the (collapsed) caret sits at the very end of el's text. */
function caretAtEndOf(win, el) {
  const sel = win.getSelection();

  if (!sel || !sel.rangeCount || !sel.isCollapsed) {
    return false;
  }

  const range = sel.getRangeAt(0);

  if (!el.contains(range.endContainer)) {
    return false;
  }

  const after = win.document.createRange();

  after.selectNodeContents(el);
  after.setStart(range.endContainer, range.endOffset);

  return after.toString().trim() === '';
}

/** Empty paragraph/div used as a Bard "add set here" slot. */
function isEmptyEditableBlock(el) {
  if (!el || el.nodeType !== 1 || el.hasAttribute('data-sve-locked')) {
    return false;
  }

  const text = (el.textContent || '').replace(/\u00a0/g, ' ').trim();

  return text === '';
}

/**
 * Ghost text on empty fields (`placeholder="Enter a title"` → data-sid-placeholder).
 *
 * A real span, not a pseudo: ::before is the dashed ring and ::after is the set
 * label. The span has no text nodes, so textContent (and therefore saved values)
 * stay empty — the hint is CSS `content` only, like Gutenberg's RichText.
 */
function syncSidPlaceholders(doc) {
  if (!doc?.querySelectorAll) {
    return;
  }

  doc.querySelectorAll('[data-sid-placeholder]').forEach((el) => {
    const hint = el.getAttribute('data-sid-placeholder') || '';
    const span = [...el.children].find((child) => child.hasAttribute('data-sve-placeholder'));

    if (el.hasAttribute(EDITING_ATTR) || el.querySelector(`[${EDITING_ATTR}]`)) {
      span?.remove();

      return;
    }

    const empty = fieldIsEmptyForPlaceholder(el);

    if (!hint || !empty) {
      span?.remove();

      return;
    }

    const node = span || doc.createElement('span');

    node.setAttribute('data-sve-placeholder', hint);
    node.setAttribute('aria-hidden', 'true');
    node.setAttribute('contenteditable', 'false');

    if (!span) {
      el.insertBefore(node, el.firstChild);
    }
  });
}

function fieldIsEmptyForPlaceholder(el) {
  const clone = el.cloneNode(true);

  clone.querySelectorAll('[data-sve-placeholder]').forEach((node) => node.remove());

  const text = (clone.textContent || '').replace(/\u00a0/g, ' ').trim();

  if (text) {
    return false;
  }

  return !clone.querySelector('svg, img, iconify-icon, picture, video, iframe');
}

/**
 * Absolute index among wrapper children for splicing a Bard set into the
 * serialized node array (locked sets count too).
 */
function bardFieldChildIndex(wrapper, el) {
  return [...wrapper.children].indexOf(el);
}

function removeBardSetInserter(session) {
  if (session?.setInserterEl?.parentNode) {
    session.setInserterEl.parentNode.removeChild(session.setInserterEl);
  }

  if (session) {
    session.setInserterEl = null;
    session.setInserterBlock = null;
  }
}

/**
 * On an empty paragraph in whole-field Bard edit, show a "+" that opens
 * Statamic's native SetPicker (same popup as the Style 2 replicator inserter).
 */
function updateBardSetInserter(win, session) {
  if (!session || session.mode !== 'bard-field' || !session.bardSets?.length) {
    removeBardSetInserter(session);

    return;
  }

  const block = currentBlockEl(win, session);

  if (!block || !isEmptyEditableBlock(block)) {
    removeBardSetInserter(session);

    return;
  }

  session.setInserterBlock = block;

  const doc = win.document;
  let wrap = session.setInserterEl;

  if (!wrap) {
    wrap = doc.createElement('div');
    wrap.setAttribute('data-sve-bard-set-inserter', '');
    wrap.style.cssText =
      'position:fixed;z-index:2147483647;pointer-events:none;display:flex;align-items:center;' +
      'justify-content:center;flex-direction:row;';

    const line = doc.createElement('div');

    line.style.cssText = 'height:2px;flex:1;background:rgba(99,102,241,.55);';

    const btn = doc.createElement('button');

    btn.type = 'button';
    btn.textContent = '+';
    btn.title = t('add_set') !== 'add_set' ? t('add_set') : 'Tilføj set';
    btn.style.cssText =
      'pointer-events:auto;position:absolute;width:26px;height:26px;border:none;border-radius:7px;' +
      'cursor:pointer;background:#18181b;color:#fff;font-size:17px;line-height:1;display:flex;' +
      'align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,.3);';
    btn.addEventListener('mouseenter', () => {
      btn.style.background = 'var(--theme-color-primary,#4f46e5)';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.background = '#18181b';
    });
    btn.addEventListener('mousedown', (e) => {
      e.preventDefault();
      e.stopPropagation();
      session.suspendBlur = true;
    });
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      openNativeBardSetPicker(win, session, btn);
    });

    wrap.appendChild(line);
    wrap.appendChild(btn);
    doc.body.appendChild(wrap);
    wrap.__btn = btn;
    wrap.__line = line;
    session.setInserterEl = wrap;
  }

  const r = block.getBoundingClientRect();

  wrap.style.left = `${r.left}px`;
  wrap.style.top = `${r.bottom - 15}px`;
  wrap.style.width = `${Math.max(r.width, 120)}px`;
  wrap.style.height = '30px';
}

/**
 * Commit the current Bard edit, then ask the CP to open Statamic's real
 * SetPicker pinned under the "+" — same component the replicator uses.
 */
function openNativeBardSetPicker(win, session, btn) {
  const block = session.setInserterBlock;

  if (!session?.field || !block) {
    return;
  }

  const index = bardFieldChildIndex(session.el, block);
  const r = (btn || session.setInserterEl?.__btn)?.getBoundingClientRect?.() || block.getBoundingClientRect();
  const payload = {
    source: 'statamic-visual-editor',
    type: 'add-bard-set-native',
    field: session.field,
    scope: session.scope || null,
    index: index < 0 ? null : index,
    sets: session.bardSets || [],
    anchorRect: {
      left: r.left,
      top: r.top,
      bottom: r.bottom,
      right: r.right,
      width: r.width,
      height: r.height,
    },
  };

  session.dirty = true;
  removeBardSetInserter(session);
  finishEditing(win, false);

  win.parent.postMessage(payload, win.location.origin);
}

function sendEditInput(win, session) {
  clearTimeout(session.inputTimer);
  session.inputTimer = null;

  // Whole-field Bard: serialize every child in DOM order — unlocked text
  // blocks become heading/paragraph payloads; locked siblings (Bard sets)
  // are emitted as placeholders so the CP can keep them in place.
  if (session.mode === 'bard-field') {
    // Inline Bard: one line of mixed text/spans on the wrapper (no <p> child).
    // Serialize the whole wrapper as a single paragraph — same shape the CP
    // Bard field keeps while editing (wrapInlineValue).
    if (session.bardInline) {
      const html = /^<br\s*\/?>$/i.test(session.el.innerHTML.trim()) ? '' : session.el.innerHTML;

      win.parent.postMessage(
        {
          source: 'statamic-visual-editor',
          type: 'edit-input',
          requestId: session.requestId,
          blocks: [{ kind: 'paragraph', level: null, className: null, html }],
          spanClasses: session.spanClasses,
        },
        win.location.origin
      );

      return;
    }

    const wrapperKind = sidAsKind(session.el);
    const blocks = [];

    for (const child of session.el.childNodes) {
      if (child.nodeType === 3) {
        const text = child.nodeValue.trim();

        if (text) {
          blocks.push({
            kind: wrapperKind.kind,
            level: wrapperKind.level,
            className: null,
            html: escapeHtml(text),
          });
        }

        continue;
      }

      if (child.nodeType !== 1) {
        continue;
      }

      if (child.hasAttribute('data-sve-placeholder')) {
        continue;
      }

      if (child.hasAttribute('data-sve-locked')) {
        const visualId =
          child.getAttribute(SID_ATTR) ||
          child.querySelector?.(`[${SID_ATTR}]`)?.getAttribute(SID_ATTR) ||
          null;

        blocks.push({ kind: 'locked', visualId });
        continue;
      }

      // vizuDiv wrapper (two-columns / three-columns) from bard-styles.
      if (child.hasAttribute('data-vzd')) {
        const nested = [];

        for (const inner of child.children) {
          if (inner.nodeType !== 1 || inner.hasAttribute('data-sve-locked')) {
            continue;
          }

          const innerHeading = /^H([1-6])$/.exec(inner.tagName);
          const innerHtml = /^<br\s*\/?>$/i.test(inner.innerHTML.trim()) ? '' : inner.innerHTML;
          const innerClass =
            (session.blockClasses || []).find((c) => inner.classList?.contains(c)) || null;

          nested.push({
            kind: innerHeading ? 'heading' : 'paragraph',
            level: innerHeading ? Number(innerHeading[1]) : null,
            className: innerClass,
            vizuClass: innerClass,
            vizuBlockStyle: inner.getAttribute?.('data-vbs') || null,
            html: innerHtml,
          });
        }

        blocks.push({
          kind: 'vizuDiv',
          className: child.getAttribute('class') || null,
          children: nested,
        });
        continue;
      }

      const heading = /^H([1-6])$/.exec(child.tagName);
      // A block holding only the caret placeholder <br> is an empty block — it
      // must not serialize into a stray hardBreak node.
      const html = /^<br\s*\/?>$/i.test(child.innerHTML.trim()) ? '' : child.innerHTML;
      const vizuClass =
        (session.blockClasses || []).find((c) => child.classList?.contains(c)) || null;

      blocks.push({
        kind: heading ? 'heading' : 'paragraph',
        level: heading ? Number(heading[1]) : null,
        className: vizuClass,
        vizuClass,
        vizuBlockStyle: child.getAttribute?.('data-vbs') || null,
        html,
      });
    }

    if (!blocks.length) {
      const clone = session.el.cloneNode(true);

      clone.querySelectorAll('[data-sve-placeholder]').forEach((node) => node.remove());

      const html = /^<br\s*\/?>$/i.test((clone.innerHTML || '').trim()) ? '' : clone.innerHTML;

      blocks.push({
        kind: wrapperKind.kind,
        level: wrapperKind.level,
        className: null,
        html,
      });
    }

    win.parent.postMessage(
      {
        source: 'statamic-visual-editor',
        type: 'edit-input',
        requestId: session.requestId,
        blocks,
        spanClasses: session.spanClasses,
      },
      win.location.origin
    );

    return;
  }

  win.parent.postMessage(
    {
      source: 'statamic-visual-editor',
      type: 'edit-input',
      requestId: session.requestId,
      // textContent (not innerText): innerText follows CSS text-transform and
      // would sync UPPERCASE titles into the CP form.
      text: session.el.textContent || '',
      html: session.el.innerHTML,
      // bard-texstyle span classes to recognize as btsSpan marks when parsing
      // the html back to ProseMirror (derived from the field's own styles).
      spanClasses: session.spanClasses,
    },
    win.location.origin
  );
}

// --- Floating edit toolbar -----------------------------------------------------
// A small fixed-position toolbar above the element being edited. Formatting
// buttons (Bard mode only) run execCommand on the current selection — the
// resulting <b>/<i>/<a> markup is parsed back to ProseMirror marks by the CP.
// mousedown is prevented so clicking a button never blurs the editable.

let toolbarEl = null;
// Colour scheme of the last-built toolbar, so updateEditToolbarState knows what
// "active" background to paint.
let toolbarTheme = null;

/**
 * True when the CP (parent window) is in dark mode. Checks explicit theme
 * markers first, then falls back to the luminance of the CP's background — so
 * it works regardless of how Statamic flags the theme. Cross-origin access is
 * guarded (returns light on failure).
 */
function detectCpDark(win) {
  try {
    const top = win.parent;
    const root = top.document.documentElement;

    // Statamic v6 stamps `.dark` on <html> when dark mode is active (following
    // the theme preference / prefers-color-scheme).
    if (root.classList.contains('dark') || root.getAttribute('data-theme') === 'dark') {
      return true;
    }

    if (root.classList.contains('light') || root.getAttribute('data-theme') === 'light') {
      return false;
    }

    return top.matchMedia('(prefers-color-scheme: dark)').matches;
  } catch {
    /* cross-origin or not in an iframe — assume light */
  }

  return false;
}

/** Toolbar colour tokens for the given scheme (mirrors Statamic's own toolbar). */
function toolbarThemeFor(dark) {
  return dark
    ? {
        bg: '#27272a',
        fg: '#e4e4e7',
        border: 'rgba(255,255,255,0.12)',
        shadow: '0 6px 22px rgba(0,0,0,0.55)',
        hover: 'rgba(255,255,255,0.10)',
        active: 'rgba(255,255,255,0.20)',
        sep: 'rgba(255,255,255,0.16)',
      }
    : {
        bg: '#fff',
        fg: '#27272a',
        border: 'rgba(0,0,0,0.09)',
        shadow: '0 6px 22px rgba(0,0,0,0.17)',
        hover: 'rgba(0,0,0,0.06)',
        active: '#e4e4e7',
        sep: 'rgba(0,0,0,0.12)',
      };
}

function removeEditToolbar() {
  if (toolbarEl) {
    // The control dropdown lives on <body>, not in the bar — it would outlive it.
    toolbarEl.ownerDocument.querySelector('[data-sve-menu]')?.remove();
    toolbarEl.remove();
    toolbarEl = null;
  }
}

/**
 * Dropdown for a select-type quick control. Rendered on <body> rather than inside
 * the toolbar so no ancestor can clip it, and closed on the next outside mousedown.
 */
/**
 * A menu hung off a toolbar button. Rendered on <body> rather than inside the
 * toolbar so no ancestor can clip it, and closed on the next mousedown outside.
 *
 * `key` says which button opened it, so a second click on the same one closes it
 * instead of reopening. Rows are {label, selected, danger, dividerBefore, run}.
 */
function openToolbarMenu(win, anchor, key, rows) {
  const doc = win.document;
  const existing = doc.querySelector('[data-sve-menu]');

  if (existing) {
    const same = existing.dataset.for === key;

    if (typeof existing._sveTeardown === 'function') {
      existing._sveTeardown();
    } else {
      existing.remove();
    }

    if (same) {
      return;
    }
  }

  const theme = toolbarTheme || toolbarThemeFor(detectCpDark(win));
  const menu = doc.createElement('div');

  menu.dataset.sveMenu = '';
  menu.dataset.for = key;
  menu.style.cssText =
    'position:fixed;z-index:2147483647;min-width:11em;padding:0.3em;' +
    `background:${theme.bg};color:${theme.fg};border:1px solid ${theme.border};border-radius:0.6em;` +
    `box-shadow:${theme.shadow};font-family:ui-sans-serif,system-ui,-apple-system,sans-serif;` +
    'font-size:13px;line-height:1;';
  // Same reason as the toolbar itself: never blur the editable.
  menu.addEventListener('mousedown', (e) => e.preventDefault());

  const place = () => {
    if (!menu.isConnected || !anchor.isConnected) {
      teardown();

      return;
    }

    const rect = anchor.getBoundingClientRect();

    menu.style.left = `${Math.max(4, Math.min(rect.left, win.innerWidth - menu.offsetWidth - 4))}px`;
    menu.style.top = `${rect.bottom + 4}px`;
  };

  const teardown = () => {
    win.removeEventListener('scroll', place, true);
    win.removeEventListener('resize', place);
    doc.removeEventListener('mousedown', close, true);
    delete menu._sveTeardown;
    menu.remove();
  };

  const close = (e) => {
    if (menu.contains(e.target) || anchor.contains(e.target)) {
      return;
    }

    teardown();
  };

  rows.forEach((item) => {
    if (item.dividerBefore && menu.childNodes.length) {
      const rule = doc.createElement('div');

      rule.style.cssText = `height:1px;margin:0.3em 0.2em;background:${theme.sep};`;
      menu.appendChild(rule);
    }

    const row = doc.createElement('button');

    row.type = 'button';
    row.textContent = item.label;
    row.disabled = !!item.disabled;
    row.style.cssText =
      'all:unset;display:flex;align-items:center;box-sizing:border-box;width:100%;' +
      'padding:0.55em 0.7em;border-radius:0.35em;' +
      `cursor:${item.disabled ? 'not-allowed' : 'pointer'};` +
      `opacity:${item.disabled ? '0.4' : '1'};` +
      `color:${item.danger && !item.disabled ? '#dc2626' : theme.fg};` +
      (item.selected && !item.disabled ? `background:${theme.active};` : '');

    if (!item.disabled) {
      row.addEventListener('mouseenter', () => {
        row.style.background = theme.hover;
      });
      row.addEventListener('mouseleave', () => {
        row.style.background = item.selected ? theme.active : 'transparent';
      });
      row.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        teardown();
        item.run();
      });
    }

    menu.appendChild(row);
  });

  menu._sveTeardown = teardown;
  doc.body.appendChild(menu);

  // After mount so width can keep a right-edge menu on screen. Scroll/resize
  // keep it under the icon (or toolbar button) instead of the viewport.
  place();
  win.addEventListener('scroll', place, true);
  win.addEventListener('resize', place);

  setTimeout(() => doc.addEventListener('mousedown', close, true), 0);
}

/** The select-type quick control's dropdown — one shape of the menu above. */
function openControlMenu(win, anchor, control, onPick) {
  const current = control.value == null ? '' : String(control.value);

  openToolbarMenu(
    win,
    anchor,
    control.handle,
    (control.options || []).map((option) => ({
      label: option.label,
      selected: option.key === current,
      run: () => onPick(option.key),
    }))
  );
}

/**
 * Character offsets of the current selection inside el, or null when there is
 * no usable range (collapsed / outside the editable).
 */
function selectionOffsetsIn(win, el) {
  const sel = win.getSelection();

  if (!sel || sel.rangeCount === 0 || sel.isCollapsed) {
    return null;
  }

  const range = sel.getRangeAt(0);

  if (!el.contains(range.commonAncestorContainer)) {
    return null;
  }

  const pre = win.document.createRange();

  pre.selectNodeContents(el);
  pre.setEnd(range.startContainer, range.startOffset);

  const start = pre.toString().length;
  const end = start + range.toString().length;

  return { start, end };
}

/**
 * Wrap the current text selection in `{…}` so a plain string field can carry a
 * coloured highlight (rendered by the site's highlight_color modifier). No-op
 * when there is no selection or the selection is already a braced segment.
 * Returns true when the DOM text changed (or was already wrapped).
 */
function wrapSelectionInBraces(win, el) {
  const off = selectionOffsetsIn(win, el);

  if (!off) {
    return false;
  }

  const full = el.textContent || '';
  let { start, end } = off;

  // Caret inside an existing {…} — expand to the whole brace pair so we don't
  // nest braces when the user re-colours the same word.
  if (full[start - 1] === '{' && full[end] === '}') {
    return true;
  }

  const mid = full.slice(start, end);

  if (!mid || /^\{[^{}]*\}$/.test(mid)) {
    return true;
  }

  el.textContent = full.slice(0, start) + '{' + mid + '}' + full.slice(end);

  return true;
}

/**
 * Display → edit: coloured <span data-highlight> back to `{text}` so plaintext
 * editing keeps the markers that textContent would otherwise drop.
 */
function highlightSpansToBraces(el) {
  const spans = el.querySelectorAll('span[data-highlight]');

  if (!spans.length) {
    return;
  }

  spans.forEach((span) => {
    const text = span.textContent || '';

    span.replaceWith(el.ownerDocument.createTextNode(`{${text}}`));
  });

  el.normalize();
}

let themeSwatchesCache = null;

/** Snapshot the current selection so async UI (colour swatches) can't kill it. */
function captureSelectionRange(win) {
  const sel = win.getSelection();

  if (!sel || !sel.rangeCount || sel.isCollapsed) {
    return null;
  }

  try {
    return sel.getRangeAt(0).cloneRange();
  } catch {
    return null;
  }
}

/** Re-apply a saved range before wrapping marks (colour/bold). */
function restoreSelectionRange(win, range, rootEl) {
  if (!range) {
    return false;
  }

  try {
    if (rootEl && !rootEl.contains(range.commonAncestorContainer)) {
      return false;
    }

    const sel = win.getSelection();

    sel.removeAllRanges();
    sel.addRange(range);

    return !sel.isCollapsed;
  } catch {
    return false;
  }
}

/** Ask the CP for theme colour swatches (hex + css var). Cached per page load. */
function fetchThemeSwatches(win) {
  if (themeSwatchesCache) {
    return Promise.resolve(themeSwatchesCache);
  }

  return new Promise((resolve) => {
    const requestId = `swatch-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    let settled = false;

    const finish = (swatches) => {
      if (settled) {
        return;
      }

      settled = true;
      win.removeEventListener('message', onMessage);
      themeSwatchesCache = Array.isArray(swatches) ? swatches : [];
      resolve(themeSwatchesCache);
    };

    const onMessage = (event) => {
      const data = event.data;

      if (
        data?.source === 'statamic-visual-editor' &&
        data.type === 'theme-swatches' &&
        data.requestId === requestId
      ) {
        finish(data.swatches);
      }
    };

    win.addEventListener('message', onMessage);
    win.parent.postMessage(
      { source: 'statamic-visual-editor', type: 'theme-swatches-request', requestId },
      '*'
    );
    win.setTimeout(() => finish([]), 4000);
  });
}

/**
 * Colour control for theme_color_picker / color: open a swatch strip, wrap the
 * current selection in {…}, then commit via the normal edit-control path.
 */
function openHighlightColorMenu(win, anchor, control, session, onPick) {
  const doc = win.document;
  const existing = doc.querySelector('[data-sve-color-menu]');

  if (existing) {
    existing.remove();

    if (existing.dataset.for === control.handle) {
      return;
    }
  }

  // Selection dies when the async swatch strip mounts / focus moves — capture
  // it now so the first colour pick on a new block still has a range to wrap.
  const savedRange = captureSelectionRange(win);

  const menu = doc.createElement('div');

  menu.dataset.sveColorMenu = '';
  menu.dataset.for = control.handle;
  menu.style.cssText =
    'position:fixed;z-index:2147483647;max-width:min(320px,92vw);padding:8px;' +
    'background:#1a1f2e;border:1px solid rgba(255,255,255,.12);border-radius:10px;' +
    'box-shadow:0 8px 24px rgba(0,0,0,.5);display:flex;flex-wrap:wrap;gap:4px;';

  const loading = doc.createElement('div');

  loading.style.cssText = 'padding:8px 12px;font-size:12px;color:#a1a1aa;';
  loading.textContent = '…';
  menu.appendChild(loading);

  const place = () => {
    const rect = anchor.getBoundingClientRect();
    const w = menu.offsetWidth || 280;
    let left = rect.left;
    let top = rect.bottom + 6;

    if (left + w > win.innerWidth - 8) {
      left = Math.max(8, win.innerWidth - w - 8);
    }

    if (top + menu.offsetHeight > win.innerHeight - 8) {
      top = Math.max(8, rect.top - menu.offsetHeight - 6);
    }

    menu.style.left = `${left}px`;
    menu.style.top = `${top}px`;
  };

  doc.body.appendChild(menu);
  place();

  const close = () => {
    menu.remove();
    doc.removeEventListener('mousedown', onDocDown, true);
  };

  const onDocDown = (e) => {
    if (!menu.contains(e.target) && e.target !== anchor) {
      close();
    }
  };

  doc.addEventListener('mousedown', onDocDown, true);

  const pick = (value) => {
    close();
    restoreSelectionRange(win, savedRange, session?.el);
    onPick(value);
  };

  fetchThemeSwatches(win).then((swatches) => {
    if (!menu.isConnected) {
      return;
    }

    menu.innerHTML = '';

    const current = control.value == null ? '' : String(control.value);

    const clearBtn = doc.createElement('button');

    clearBtn.type = 'button';
    clearBtn.title = 'Fjern farve';
    clearBtn.textContent = '×';
    clearBtn.style.cssText =
      'width:22px;height:22px;border-radius:6px;border:1px solid rgba(255,255,255,.2);' +
      'background:transparent;color:#a1a1aa;cursor:pointer;font-size:14px;line-height:1;';
    clearBtn.addEventListener('mousedown', (e) => e.preventDefault());
    clearBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      pick(null);
    });
    menu.appendChild(clearBtn);

    if (!swatches.length) {
      const empty = doc.createElement('div');

      empty.style.cssText = 'padding:4px 8px;font-size:12px;color:#a1a1aa;';
      empty.textContent = 'Ingen farver';
      menu.appendChild(empty);
      place();

      return;
    }

    swatches.forEach((swatch) => {
      const stored = swatch.var
        ? (String(swatch.var).startsWith('var(') ? swatch.var : `var(${swatch.var})`)
        : swatch.hex;
      const btn = doc.createElement('button');

      btn.type = 'button';
      btn.title = stored;
      btn.style.cssText =
        `width:22px;height:22px;border-radius:6px;border:2px solid ${stored === current ? '#fff' : 'transparent'};` +
        `background:${swatch.hex || stored};cursor:pointer;padding:0;`;
      btn.addEventListener('mousedown', (e) => e.preventDefault());
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        pick(stored);
      });
      menu.appendChild(btn);
    });

    place();
  });
}

/**
 * Apply a highlight colour on a plain text field:
 * 1. Wrap the selection in {…} (storage format)
 * 2. Commit text + colour to the CP immediately
 * 3. Paint coloured spans in the DOM so the user never stares at braces
 * 4. End the edit session — do NOT reopen (reopen would show braces again)
 * 5. Drop any deferred (stale) preview morph so it cannot wipe the spans
 */
function applyHighlightColor(win, session, control, value) {
  if (value != null && value !== '') {
    wrapSelectionInBraces(win, session.el);
  }

  // Snapshot braced plain text BEFORE turning it into spans — textContent of
  // coloured spans would drop the {…} markers the modifier needs.
  const bracedText = (session.el.textContent || '').replace(/\u00a0/g, ' ').replace(/\n+$/, '');

  win.parent.postMessage(
    {
      source: 'statamic-visual-editor',
      type: 'edit-input',
      requestId: session.requestId,
      text: bracedText,
      html: session.el.innerHTML,
    },
    win.location.origin
  );

  win.parent.postMessage(
    {
      source: 'statamic-visual-editor',
      type: 'edit-control',
      requestId: session.requestId,
      handle: control.handle,
      value,
    },
    win.location.origin
  );

  if (value != null && value !== '') {
    session.el.setAttribute('data-highlight-color', String(value));
    bracesToHighlightSpans(win, session.el, String(value));
  } else {
    session.el.removeAttribute('data-highlight-color');
  }

  // A preview update may have been deferred while we were editing — that URL is
  // from BEFORE the wrap/colour write and would morph braces back as plain text.
  win.dispatchEvent(new CustomEvent('sve:clear-pending-preview'));

  // Text already committed — skip the dirty sendEditInput in finishEditing.
  session.dirty = false;
  finishEditing(win, false);
}

/** Turn `{accent}` plain text into coloured <span data-highlight> for instant preview. */
function bracesToHighlightSpans(win, el, color) {
  const full = el.textContent || '';

  if (!full.includes('{')) {
    return;
  }

  const doc = win.document;
  const frag = doc.createDocumentFragment();
  const re = /\{([^{}]+)\}/g;
  let last = 0;
  let match;

  while ((match = re.exec(full)) !== null) {
    if (match.index > last) {
      frag.appendChild(doc.createTextNode(full.slice(last, match.index)));
    }

    const span = doc.createElement('span');

    span.setAttribute('data-highlight', '');
    span.style.color = color;
    span.textContent = match[1];
    frag.appendChild(span);
    last = match.index + match[0].length;
  }

  if (last < full.length) {
    frag.appendChild(doc.createTextNode(full.slice(last)));
  }

  el.replaceChildren(frag);
}

/**
 * After a Live Preview morph the server may still emit literal {…} (race, or
 * the Antlers modifier didn't run). Rebuild coloured spans from
 * data-highlight-color whenever braces are visible and spans are missing.
 */
function enhanceHighlightBraces(win) {
  const doc = win.document;

  doc.querySelectorAll('[data-highlight-color]').forEach((el) => {
    if (el.querySelector('span[data-highlight]')) {
      return;
    }

    const text = el.textContent || '';

    if (!text.includes('{')) {
      return;
    }

    const color =
      el.getAttribute('data-highlight-color') || 'var(--highlighted-color)';

    bracesToHighlightSpans(win, el, color);
  });
}

function positionEditToolbar(win, session) {
  if (!toolbarEl) {
    return;
  }

  const rect = session.el.getBoundingClientRect();
  const barHeight = toolbarEl.offsetHeight || 34;
  let top = rect.top - barHeight - 10;

  // Not enough room above the element — flip below it.
  if (top < 8) {
    top = rect.bottom + 10;
  }

  const maxLeft = win.innerWidth - toolbarEl.offsetWidth - 8;

  toolbarEl.style.top = `${top}px`;
  toolbarEl.style.left = `${Math.max(8, Math.min(rect.left, maxLeft))}px`;
}

/** Highlights toggle buttons (bold/italic) that are active at the caret. */
function updateEditToolbarState(win) {
  if (!toolbarEl) {
    return;
  }

  toolbarEl.querySelectorAll('[data-sve-cmd]').forEach((btn) => {
    let on = false;

    try {
      on = win.document.queryCommandState(btn.dataset.sveCmd);
    } catch {
      /* unsupported command */
    }

    btn.dataset.sveOn = on ? '1' : '';
    btn.style.background = on ? toolbarTheme?.active || '#e4e4e7' : 'transparent';
  });

  // Span-mark buttons (bard-texstyle) reflect whether the caret sits inside
  // a span of that class.
  const sel = win.getSelection();
  let selNode = sel && sel.rangeCount ? sel.getRangeAt(0).commonAncestorContainer : null;

  if (selNode && selNode.nodeType === 3) {
    selNode = selNode.parentElement;
  }

  toolbarEl.querySelectorAll('[data-sve-span-class]').forEach((btn) => {
    const cls = btn.dataset.sveSpanClass;
    const on = !!(selNode && selNode.closest?.(`span.${cls}`) && editing?.el.contains(selNode.closest(`span.${cls}`)));

    btn.dataset.sveOn = on ? '1' : '';
    btn.style.background = on ? toolbarTheme?.active || '#e4e4e7' : 'transparent';
  });

  // Block-format buttons reflect the current block's tag/class. In whole-field
  // mode "the current block" follows the selection.
  toolbarEl.querySelectorAll('[data-sve-block-tag]').forEach((btn) => {
    const el = editing ? currentBlockEl(win, editing) : null;
    let on = false;

    if (el) {
      const wantClass = btn.dataset.sveBlockClass || '';
      const tagMatches = el.tagName.toLowerCase() === btn.dataset.sveBlockTag;

      on = tagMatches && (wantClass ? el.classList.contains(wantClass) : !hasKnownBlockClass(editing, el));
    }

    btn.dataset.sveOn = on ? '1' : '';
    btn.style.background = on ? toolbarTheme?.active || '#e4e4e7' : 'transparent';
  });
}

/** True when el carries any of the session's known bard-texstyle block classes. */
function hasKnownBlockClass(session, el) {
  return (session.blockClasses || []).some((c) => el.classList.contains(c));
}

/**
 * Replaces the contenteditable element with one of a different tag (e.g. h2→h3),
 * preserving inner markup, editing state and listeners. Returns the new element.
 * Used for block-format changes; the deferred hot-reload morph reconciles
 * everything on commit/cancel, so no manual tag restore is needed.
 */
function swapEditingElementTag(win, session, tagName) {
  const old = session.el;

  if (old.tagName.toLowerCase() === tagName.toLowerCase()) {
    return old;
  }

  const neo = win.document.createElement(tagName);

  neo.innerHTML = old.innerHTML;
  neo.setAttribute(EDITING_ATTR, '');
  applyOutlineTone(win, neo);
  neo.contentEditable = old.contentEditable;

  old.removeEventListener('input', session.onInput);
  old.removeEventListener('keydown', session.onKeydown);
  old.removeEventListener('keyup', session.onKeyup);
  old.removeEventListener('blur', session.onBlur);
  old.replaceWith(neo);

  neo.addEventListener('input', session.onInput);
  neo.addEventListener('keydown', session.onKeydown);
  neo.addEventListener('keyup', session.onKeyup);
  neo.addEventListener('blur', session.onBlur);

  session.el = neo;

  return neo;
}

/**
 * Applies a block-format change to the edited Bard node. spec describes the
 * target block: { tag, node, level?, className? }. Swaps the preview element
 * (tag) and its bard-texstyle class for instant feedback, then tells the CP to
 * change the ProseMirror node's type/attrs.
 */
function applyBlockFormat(win, session, spec) {
  // Whole-field mode: the format applies to the block the selection sits in,
  // purely in the DOM — the debounced whole-field serialization carries the
  // type/class change to the CP, so no block-format message is needed.
  if (session.mode === 'bard-field') {
    const block = currentBlockEl(win, session);

    if (!block) {
      return;
    }

    let el = block;

    if (block.tagName.toLowerCase() !== spec.tag.toLowerCase()) {
      el = win.document.createElement(spec.tag);
      el.innerHTML = block.innerHTML;
      el.className = block.className;
      block.replaceWith(el);
    }

    session.blockClasses?.forEach((c) => el.classList.remove(c));

    if (spec.className) {
      el.classList.add(spec.className);
    }

    if (!el.getAttribute('class')) {
      el.removeAttribute('class');
    }

    session.el.focus();

    const range = win.document.createRange();

    range.selectNodeContents(el);
    range.collapse(false);

    const sel = win.getSelection();

    sel.removeAllRanges();
    sel.addRange(range);

    session.dirty = true;
    session.onInput();
    updateEditToolbarState(win);

    return;
  }

  const el = swapEditingElementTag(win, session, spec.tag);

  // Reset any bard-texstyle block class we may have added earlier, then apply
  // the new one. We only touch classes we know about (from sveBlockClasses),
  // never the element's own styling classes.
  session.blockClasses?.forEach((c) => el.classList.remove(c));

  if (spec.className) {
    el.classList.add(spec.className);
  }

  session.el.focus();

  const range = win.document.createRange();

  range.selectNodeContents(session.el);
  range.collapse(false);

  const sel = win.getSelection();

  sel.removeAllRanges();
  sel.addRange(range);

  session.dirty = true;
  win.parent.postMessage(
    {
      source: 'statamic-visual-editor',
      type: 'block-format',
      requestId: session.requestId,
      node: spec.node,
      level: spec.level ?? null,
      className: spec.className ?? null,
    },
    win.location.origin
  );

  updateEditToolbarState(win);
}

/**
 * Buttons the inline editor can't perform in place (lists, blockquote, …)
 * delegate to the CP: commit the current edit, open the editor panel and focus
 * the Bard field so the user finishes with the real toolbar there.
 */
function openPanelTool(win, session) {
  win.parent.postMessage(
    { source: 'statamic-visual-editor', type: 'open-panel-field', requestId: session.requestId },
    win.location.origin
  );
  finishEditing(win, false);
}

/** Character offset of (container, offset) within root's text content. */
function charOffsetWithin(root, container, offset) {
  const walker = root.ownerDocument.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let count = 0;
  let node;

  while ((node = walker.nextNode())) {
    if (node === container) {
      return count + offset;
    }

    count += node.nodeValue.length;
  }

  return count;
}

/**
 * Link and text-color use Statamic's own Bard popups (link dialog, colour
 * palette) rather than a re-implementation. We capture the current selection's
 * character range, commit the inline text, and ask the CP to open the real
 * editor at that range and trigger its toolbar button — so the exact same
 * popup the user knows from the panel appears.
 *
 * The bard-command message must be posted BEFORE finishEditing: finishEditing
 * ends the CP edit session, and the command handler needs it (field/scope/
 * block index) still alive when the message arrives.
 */
function bardCommand(win, session, command) {
  const sel = win.getSelection();
  let from = 0;
  let to = 0;

  // Offsets are block-relative: the CP places the selection inside the
  // ProseMirror block at `blockIndex` (whole-field mode) or the session's
  // stored index (per-block mode).
  const scopeEl = session.mode === 'bard-field' ? currentBlockEl(win, session) || session.el : session.el;
  const blockIndex =
    session.mode === 'bard-field'
      ? [...session.el.children].filter((c) => !c.hasAttribute('data-sve-locked')).indexOf(scopeEl)
      : undefined;

  if (sel && sel.rangeCount) {
    const range = sel.getRangeAt(0);

    from = charOffsetWithin(scopeEl, range.startContainer, range.startOffset);
    to = charOffsetWithin(scopeEl, range.endContainer, range.endOffset);

    if (to < from) {
      [from, to] = [to, from];
    }
  }

  // Anchor for popups (link/colour): the CP keeps its editor panel hidden and
  // moves the real Statamic popup here, so it appears over the preview near the
  // text instead of sliding the whole admin sidebar into view. Coords are in the
  // iframe viewport; the CP adds the iframe's own offset.
  const barRect = (toolbarEl || session.el).getBoundingClientRect();
  const anchorRect = {
    left: barRect.left,
    top: barRect.top,
    bottom: barRect.bottom,
    right: barRect.right,
    width: barRect.width,
    height: barRect.height,
  };

  win.parent.postMessage(
    {
      source: 'statamic-visual-editor',
      type: 'bard-command',
      requestId: session.requestId,
      command,
      from,
      to,
      blockIndex,
      anchorRect,
    },
    win.location.origin
  );

  finishEditing(win, false);
}

/**
 * Toggles a bard-texstyle span mark (e.g. class="uppercase") around the current
 * selection. On the CP side parseInlineHtml maps span.<class> back to a btsSpan
 * ProseMirror mark. Unwraps when the selection already sits inside such a span.
 */
function toggleSpanClass(win, session, className) {
  const sel = win.getSelection();

  if (!sel || sel.rangeCount === 0 || sel.isCollapsed) {
    return;
  }

  const range = sel.getRangeAt(0);
  let node = range.commonAncestorContainer;

  if (node.nodeType === 3) {
    node = node.parentElement;
  }

  const existing = node.closest?.(`span.${className}`);

  if (existing && session.el.contains(existing)) {
    // Unwrap: move children out, drop the span.
    const parent = existing.parentNode;

    while (existing.firstChild) {
      parent.insertBefore(existing.firstChild, existing);
    }

    parent.removeChild(existing);
    parent.normalize();
  } else {
    const span = win.document.createElement('span');

    span.className = className;

    try {
      range.surroundContents(span);
    } catch {
      // Selection crosses element boundaries — extract and re-insert.
      span.appendChild(range.extractContents());
      range.insertNode(span);
    }

    const newRange = win.document.createRange();

    newRange.selectNodeContents(span);
    sel.removeAllRanges();
    sel.addRange(newRange);
  }

  session.onInput();
}

/** Merge/remove a CSS property in an inline style string. */
function setCssProp(styleStr, prop, value) {
  const parts = (styleStr || '')
    .split(';')
    .map((s) => s.trim())
    .filter(Boolean);
  const escaped = prop.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const filtered = parts.filter((p) => !new RegExp(`^${escaped}\\s*:`, 'i').test(p));

  if (value !== null && value !== undefined) {
    filtered.push(`${prop}: ${value}`);
  }

  return filtered.join('; ') || null;
}

function readCssProp(styleStr, prop) {
  if (!styleStr) {
    return null;
  }

  const escaped = prop.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = styleStr.match(new RegExp(`(?:^|;)\\s*${escaped}\\s*:\\s*([^;]+)`, 'i'));

  return match ? match[1].trim() : null;
}

/**
 * Toggle a vizuStyle span mark (data-vizu + inline style prop) on the selection.
 */
function toggleVizuSpanProp(win, session, prop, value) {
  const current = readSelectionVizuProp(win, session, prop);

  if (current === value) {
    clearVizuSpanProp(win, session, prop);

    return;
  }

  setVizuSpanProp(win, session, prop, value);
}

/** Current vizuStyle CSS prop on the selection (or null). */
function readSelectionVizuProp(win, session, prop) {
  const sel = win.getSelection();

  if (!sel || !sel.rangeCount) {
    return null;
  }

  let node = sel.getRangeAt(0).commonAncestorContainer;

  if (node.nodeType === 3) {
    node = node.parentElement;
  }

  const existing = node?.closest?.('span[data-vizu]');

  if (!existing || !session.el.contains(existing)) {
    return null;
  }

  return readCssProp(existing.getAttribute('style'), prop);
}

/** Ensure selection has a vizuStyle span with prop=value (never toggles off). */
function setVizuSpanProp(win, session, prop, value) {
  const sel = win.getSelection();
  let range = sel && sel.rangeCount ? sel.getRangeAt(0) : null;

  if (!range || range.collapsed) {
    return;
  }

  let node = range.commonAncestorContainer;

  if (node.nodeType === 3) {
    node = node.parentElement;
  }

  const existing = node.closest?.('span[data-vizu]');

  if (existing && session.el.contains(existing)) {
    existing.setAttribute('style', setCssProp(existing.getAttribute('style'), prop, value));
  } else {
    const span = win.document.createElement('span');

    span.setAttribute('data-vizu', '');
    span.setAttribute('style', `${prop}: ${value}`);

    try {
      range.surroundContents(span);
    } catch {
      span.appendChild(range.extractContents());
      range.insertNode(span);
    }

    const newRange = win.document.createRange();

    newRange.selectNodeContents(span);
    sel.removeAllRanges();
    sel.addRange(newRange);
  }

  session.dirty = true;
  // Flush immediately — colour/marks must hit the sidebar without waiting for
  // the typing debounce (otherwise the panel only updates on the next key).
  clearTimeout(session.inputTimer);
  session.inputTimer = null;
  sendEditInput(win, session);
  updateEditToolbarState(win);
}

/** Remove a vizuStyle CSS prop from the selection; unwrap span if empty. */
function clearVizuSpanProp(win, session, prop) {
  const sel = win.getSelection();

  if (!sel || !sel.rangeCount) {
    return;
  }

  let node = sel.getRangeAt(0).commonAncestorContainer;

  if (node.nodeType === 3) {
    node = node.parentElement;
  }

  const existing = node?.closest?.('span[data-vizu]');

  if (!existing || !session.el.contains(existing)) {
    return;
  }

  const next = setCssProp(existing.getAttribute('style'), prop, null);

  if (!next) {
    const parent = existing.parentNode;

    while (existing.firstChild) {
      parent.insertBefore(existing.firstChild, existing);
    }

    parent.removeChild(existing);
    parent.normalize();
  } else {
    existing.setAttribute('style', next);
  }

  session.dirty = true;
  clearTimeout(session.inputTimer);
  session.inputTimer = null;
  sendEditInput(win, session);
  updateEditToolbarState(win);
}

/** Apply/clear a paragraph/heading class (vizuClass / title). */
function toggleVizuParagraphClass(win, session, className) {
  const block = currentBlockEl(win, session);

  if (!block) {
    return;
  }

  const on = block.classList.contains(className);

  session.blockClasses?.forEach((c) => block.classList.remove(c));

  if (!on) {
    block.classList.add(className);
  }

  if (!block.getAttribute('class')) {
    block.removeAttribute('class');
  }

  session.dirty = true;
  session.onInput();
  updateEditToolbarState(win);
}

/** Apply/clear a block-level CSS prop via data-vbs (flow spacing). */
function toggleVizuBlockProp(win, session, prop, value) {
  const block = currentBlockEl(win, session);

  if (!block) {
    return;
  }

  const current = readCssProp(block.getAttribute('data-vbs'), prop);
  const next = setCssProp(block.getAttribute('data-vbs'), prop, current === value ? null : value);

  if (next) {
    block.setAttribute('data-vbs', next);
    block.style.cssText = next;
  } else {
    block.removeAttribute('data-vbs');
    block.removeAttribute('style');
  }

  session.dirty = true;
  session.onInput();
  updateEditToolbarState(win);
}

/** Wrap/unwrap the current block in a vizuDiv (two-columns / three-columns). */
function toggleVizuDiv(win, session, className) {
  const block = currentBlockEl(win, session);

  if (!block || !session.el.contains(block)) {
    return;
  }

  const wrap = block.closest?.('[data-vzd]');

  if (wrap && session.el.contains(wrap) && wrap.classList.contains(className)) {
    while (wrap.firstChild) {
      wrap.parentNode.insertBefore(wrap.firstChild, wrap);
    }

    wrap.remove();
  } else {
    const div = win.document.createElement('div');

    div.setAttribute('data-vzd', '');
    div.className = className;
    block.parentNode.insertBefore(div, block);
    div.appendChild(block);
  }

  session.dirty = true;
  session.onInput();
  updateEditToolbarState(win);
}

function applyVizuStyle(win, session, style) {
  if (!style) {
    return;
  }

  if (style.type === 'div' && style.class) {
    toggleVizuDiv(win, session, style.class);

    return;
  }

  if (style.target === 'block' && style.prop) {
    toggleVizuBlockProp(win, session, style.prop, style.value);

    return;
  }

  if (style.type === 'paragraph' && style.class) {
    toggleVizuParagraphClass(win, session, style.class);

    return;
  }

  if (style.prop && style.value != null) {
    toggleVizuSpanProp(win, session, style.prop, style.value);
  }
}

/** Toolbar icon from a style/group ident (SVG markup or letter). */
function styleIdentHtml(ident, fallback = '?') {
  if (typeof ident === 'string' && ident.trimStart().startsWith('<')) {
    return `<span style="display:inline-flex;align-items:center;pointer-events:none;width:15px;height:15px">${ident}</span>`;
  }

  return letterIcon(ident || fallback);
}

function collectBlockClassesFromStyles(bardStyles) {
  if (!bardStyles) {
    return [];
  }

  const out = [];

  const push = (s) => {
    if (s?.class && (s.type === 'paragraph' || s.type === 'div' || (s.type && s.type !== 'span'))) {
      out.push(s.class);
    }
  };

  Object.values(bardStyles).forEach((s) => {
    if (s?.kind === 'group' && Array.isArray(s.items)) {
      s.items.forEach(push);
    } else {
      push(s);
    }
  });

  return out;
}

// Statamic's own Bard toolbar icons (captured from the CP so the inline toolbar
// is pixel-identical to the panel's). Keyed by the button `name` used in the
// field's `buttons` config. Sized explicitly (the CP relies on Tailwind size
// classes that don't exist inside the preview).
const SVG = (vb, inner, w = 15) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${w}" viewBox="${vb}" fill="none" style="display:block;pointer-events:none">${inner}</svg>`;

const HEADING_ICON = {
  h1: 'M11.39 7.65v5.1M9.7 8.72h.42c.7 0 1.27-.57 1.27-1.27m1.7 5.3h-3.4m-8.69 0V1.25m5.75 0v11.5M1 6.52h5.75',
  h2: 'M12.93 12.75H9.61V12c0-.53.29-1 .74-1.22l1.84-.86c.44-.21.73-.67.73-1.18 0-.71-.54-1.29-1.21-1.29h-.86c-.54 0-1 .37-1.17.88M1 12.75V1.25m5.75 0v11.5M1 6.52h5.75',
  h3: 'M9.54 11.87c.18.52.67.88 1.25.88h.88c.73 0 1.33-.59 1.33-1.33v-.22c0-.73-.59-1.33-1.33-1.33h-.44.33c.67 0 1.22-.54 1.22-1.22s-.54-1.22-1.22-1.22h-.66c-.56 0-1.03.37-1.17.88M1 12.75V1.25m5.75 0v11.5M1 6.52h5.75',
  h4: 'M12.36 11.42H9.15c-.18 0-.32-.14-.32-.32 0-.08.03-.15.08-.21l2.92-3.34c.06-.07.14-.1.23-.1.17 0 .3.14.3.3v3.67zm0 0h.88m-.88 0v1.33M1 12.75V1.25m5.75 0v11.5M1 6.52h5.75',
};

const headingIcon = (level) =>
  SVG(
    '0 0 14 14',
    `<path d="${HEADING_ICON['h' + level] || HEADING_ICON.h2}" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/>`
  );

// bard-texstyle buttons render a single letter over a "T" stem — the letter
// comes from the style config, so we build it from the style's ident.
const letterIcon = (letter) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style="display:block;pointer-events:none"><path d="M9.492,2.338C9.931,2.338 10.307,1.941 10.307,1.502C10.307,1.063 9.931,0.666 9.492,0.666L1.104,0.666C0.665,0.666 0.289,1.063 0.289,1.502C0.289,1.941 0.665,2.338 1.104,2.338L4.41,2.338L4.41,14.565C4.41,15.045 4.807,15.443 5.308,15.443C5.789,15.443 6.186,15.045 6.186,14.565L6.186,2.338L9.492,2.338Z"></path><text text-anchor="middle" x="12.75" y="14.5" style="font-size:10px;stroke-width:1px;stroke:currentColor">${(letter || 'T').slice(0, 1).toUpperCase()}</text></svg>`;

const ICONS = {
  bold: SVG('0 0 14 14', '<path fill="currentColor" fill-rule="evenodd" d="M3.5.25a.75.75 0 0 0-.75.75v12a.75.75 0 0 0 .75.75h3.75a4 4 0 0 0 1.945-7.496A3.5 3.5 0 0 0 6.75.25H3.5Zm3.25 5.5a2 2 0 1 0 0-4h-2.5v4h2.5Zm-2.5 1.5v5h3a2.5 2.5 0 0 0 0-5h-3Z" clip-rule="evenodd"/>'),
  italic: SVG('0 0 14 14', '<path fill="currentColor" fill-rule="evenodd" d="M12.45.345H5.637a.75.75 0 0 0 0 1.5H8.18l-3.965 10.31H1.55a.75.75 0 1 0 0 1.5h6.813a.75.75 0 0 0 0-1.5H5.82l3.965-10.31h2.664a.75.75 0 0 0 0-1.5Z" clip-rule="evenodd"/>'),
  underline: SVG('0 0 24 24', '<path fill="currentColor" d="M12 17.5c3.31 0 6-2.69 6-6V3a1 1 0 0 0-2 0v8.5a4 4 0 0 1-8 0V3a1 1 0 0 0-2 0v8.5c0 3.31 2.69 6 6 6ZM5 21h14a1 1 0 0 0 0-2H5a1 1 0 0 0 0 2Z"/>'),
  strikethrough: SVG('0 0 24 24', '<path fill="currentColor" d="M21 12H3a1 1 0 0 0 0 2h9.6c1.3.4 2.4 1 2.4 2.2 0 1.5-1.6 2.3-3.4 2.3-1.5 0-2.9-.5-3.7-1.4a1 1 0 1 0-1.5 1.3c1.2 1.4 3.1 2.1 5.2 2.1 3 0 5.4-1.6 5.4-4.3 0-.8-.2-1.5-.6-2.2H21a1 1 0 0 0 0-2ZM6.5 8.3c0-1.5 1.6-2.5 3.6-2.5 1.3 0 2.5.4 3.2 1.2a1 1 0 0 0 1.5-1.3C13.8 4.6 12.2 4 10.1 4 6.9 4 4.5 5.8 4.5 8.3c0 .4 0 .8.2 1.2h2.1c-.2-.4-.3-.8-.3-1.2Z"/>'),
  removeformat: SVG('0 0 24 24', '<path fill="currentColor" d="M20.48 21.66h-15a1 1 0 0 0 0 2h15a1 1 0 0 0 0-2ZM22 6.43 16.38.78a1.49 1.49 0 0 0-2.12 0L6.5 8.54a1 1 0 0 0 0 1.46l6.36 6.37a1 1 0 0 0 1.42 0L22 8.56a1.51 1.51 0 0 0 0-2.13ZM9.18 19.66a1.82 1.82 0 0 0 1.22-.53l1-1.13a.49.49 0 0 0 0-.68l-5.78-5.73a.5.5 0 0 0-.71 0l-2.65 2.7a2.59 2.59 0 0 0 0 3.6l1.08 1.22a1.75 1.75 0 0 0 1.21.55Z"/>'),
  anchor: SVG('0 0 14 14', '<path fill="currentColor" fill-rule="evenodd" d="M6.05 2.664a2.377 2.377 0 0 0 .257 3.057l.456.456-.586.586-.456-.456a2.377 2.377 0 0 0-3.057-.257l-.282.2A7.476 7.476 0 0 0 .645 7.974a2.768 2.768 0 0 0 .288 3.575l1.517 1.517a2.768 2.768 0 0 0 3.575.288 7.475 7.475 0 0 0 1.726-1.737l.22-.31a2.336 2.336 0 0 0-.254-3.005l-.48-.48.586-.586.48.48a2.337 2.337 0 0 0 3.006.253l.309-.22a7.479 7.479 0 0 0 1.737-1.725 2.768 2.768 0 0 0-.288-3.575L11.55.933A2.768 2.768 0 0 0 7.975.645a7.476 7.476 0 0 0-1.726 1.737l-.2.282Zm2.834 3.513.48.48a.837.837 0 0 0 1.076.09l.31-.22a5.975 5.975 0 0 0 1.388-1.379 1.268 1.268 0 0 0-.132-1.637l-1.517-1.517a1.268 1.268 0 0 0-1.637-.132c-.533.384-1 .853-1.38 1.389l-.2.281a.877.877 0 0 0 .095 1.128l.456.456.508-.508a.75.75 0 1 1 1.061 1.06l-.508.509ZM5.116 7.823l-.5.5a.75.75 0 1 0 1.062 1.06l.499-.499.48.48a.837.837 0 0 1 .09 1.076l-.22.31a5.975 5.975 0 0 1-1.379 1.388 1.268 1.268 0 0 1-1.637-.132L1.994 10.49a1.268 1.268 0 0 1-.132-1.637c.384-.533.853-1 1.389-1.38l.281-.2a.877.877 0 0 1 1.128.096l.456.455Z" clip-rule="evenodd"/>'),
  color: SVG('0 0 24 24', '<path fill="currentColor" d="M7 14c-1.66 0-3 1.34-3 3 0 1.31-1.16 2-2 2 .92 1.22 2.49 2 4 2 2.21 0 4-1.79 4-4 0-1.66-1.34-3-3-3zm13.71-9.37-1.34-1.34a1 1 0 0 0-1.41 0L9 12.25 11.75 15l8.96-8.96a1 1 0 0 0 0-1.41z"/>'),
  unorderedlist: SVG('0 0 24 24', '<g fill="currentColor"><path d="M8.5 5H23a1 1 0 0 0 0-2H8.5a1 1 0 0 0 0 2ZM23 11H8.5a1 1 0 0 0 0 2H23a1 1 0 0 0 0-2Zm0 8H8.5a1 1 0 0 0 0 2H23a1 1 0 0 0 0-2Z"/><rect width="3" height="3" x="1" y="2.5" rx=".5"/><rect width="3" height="3" x="1" y="10.5" rx=".5"/><rect width="3" height="3" x="1" y="18.5" rx=".5"/></g>'),
  orderedlist: SVG('0 0 24 24', '<path fill="currentColor" d="M7.75 4.5h15a1 1 0 0 0 0-2h-15a1 1 0 0 0 0 2Zm15 6.5h-15a1 1 0 0 0 0 2h15a1 1 0 0 0 0-2Zm0 8.5h-15a1 1 0 0 0 0 2h15a1 1 0 0 0 0-2ZM2.21 17.25a2 2 0 0 0-1.93 1.48.75.75 0 0 0 1.45.39.5.5 0 0 1 .48-.37.5.5 0 0 1 .5.5.5.5 0 0 1-.5.5.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.5.5 0 0 1-1 .13.75.75 0 1 0-1.44.41 2 2 0 0 0 3.92-.54 1.94 1.94 0 0 0-.34-1.11.28.28 0 0 1 0-.28 1.94 1.94 0 0 0 .34-1.11 2 2 0 0 0-1.98-2Zm2.04-6.5a2 2 0 0 0-4 0 .76.76 0 0 0 .75.75.76.76 0 0 0 .75-.75.5.5 0 0 1 1 0 1 1 0 0 1-.23.64L.41 14a.76.76 0 0 0-.09.79.76.76 0 0 0 .68.43h2.5a.75.75 0 0 0 0-1.5h-.42a.25.25 0 0 1-.22-.14.24.24 0 0 1 0-.27l.81-1a2.59 2.59 0 0 0 .58-1.56ZM4 5.25h-.25A.25.25 0 0 1 3.5 5V1.62A1.38 1.38 0 0 0 2.12.25H1.5a.75.75 0 0 0 0 1.5h.25A.25.25 0 0 1 2 2v3a.25.25 0 0 1-.25.25H1.5a.75.75 0 0 0 0 1.5H4a.75.75 0 0 0 0-1.5Z"/>'),
  quote: SVG('0 0 24 24', '<path fill="currentColor" d="M9.93 3.93a9.71 9.71 0 0 0-9.43 10v1.24a4.94 4.94 0 1 0 4.94-4.94 4.5 4.5 0 0 0-1.11.14.24.24 0 0 1-.26-.09.26.26 0 0 1 0-.28 6.83 6.83 0 0 1 5.86-3.57 1.25 1.25 0 1 0 0-2.5Zm12.32 2.5a1.25 1.25 0 1 0 0-2.5 9.71 9.71 0 0 0-9.43 10v1.24a4.95 4.95 0 1 0 4.94-4.94 4.56 4.56 0 0 0-1.11.14.24.24 0 0 1-.26-.09.26.26 0 0 1 0-.28 6.83 6.83 0 0 1 5.86-3.57Z"/>'),
  code: SVG('0 0 24 24', '<path fill="currentColor" d="M8.29 6.29 2.59 12l5.7 5.71a1 1 0 0 0 1.42-1.42L5.41 12l4.3-4.29a1 1 0 1 0-1.42-1.42Zm7.42 0a1 1 0 0 0-1.42 1.42L18.59 12l-4.3 4.29a1 1 0 0 0 1.42 1.42L21.41 12Z"/>'),
  codeblock: SVG('0 0 24 24', '<path fill="currentColor" d="M20 3H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Zm-9.29 6.29L8.41 11.6l2.3 2.3a1 1 0 0 1-1.42 1.4L6.3 12.3a1 1 0 0 1 0-1.42l3-3a1 1 0 1 1 1.42 1.42Zm6.99 3-2.99 3a1 1 0 0 1-1.42-1.4l2.3-2.3-2.3-2.3a1 1 0 0 1 1.42-1.4l3 3a1 1 0 0 1 0 1.4Z"/>'),
  table: SVG('0 0 24 24', '<path fill="currentColor" d="M20 3H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2ZM4 9h5v3H4V9Zm7 0h9v3h-9V9ZM4 14h5v5H4v-5Zm7 5v-5h9v5h-9Z"/>'),
  settings: SVG(
    '0 0 24 24',
    '<path fill="currentColor" d="M19.4 13a7.8 7.8 0 0 0 0-2l2-1.6a.5.5 0 0 0 .1-.6l-1.9-3.3a.5.5 0 0 0-.6-.2l-2.4 1a7.3 7.3 0 0 0-1.7-1l-.4-2.5a.5.5 0 0 0-.5-.4h-3.8a.5.5 0 0 0-.5.4l-.4 2.5a7.3 7.3 0 0 0-1.7 1l-2.4-1a.5.5 0 0 0-.6.2L2.5 8.8a.5.5 0 0 0 .1.6L4.6 11a7.8 7.8 0 0 0 0 2l-2 1.6a.5.5 0 0 0-.1.6l1.9 3.3c.1.2.4.3.6.2l2.4-1c.5.4 1.1.7 1.7 1l.4 2.5c0 .2.2.4.5.4h3.8c.3 0 .5-.2.5-.4l.4-2.5c.6-.3 1.2-.6 1.7-1l2.4 1c.2.1.5 0 .6-.2l1.9-3.3a.5.5 0 0 0-.1-.6l-2-1.6ZM12 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Z"/>',
    14
  ),
  bookmark: SVG(
    '0 0 24 24',
    '<path fill="currentColor" d="M17 3H7a2 2 0 0 0-2 2v15a1 1 0 0 0 1.55.83L12 17.2l5.45 3.63A1 1 0 0 0 19 20V5a2 2 0 0 0-2-2Z"/>',
    14
  ),
  hide: SVG(
    '0 0 24 24',
    '<path fill="currentColor" d="M12 5c-5 0-9.3 3.1-11 7.5C2.7 16.9 7 20 12 20s9.3-3.1 11-7.5C21.3 8.1 17 5 12 5Zm0 12.5A5 5 0 1 1 12 7.5a5 5 0 0 1 0 10Zm0-8a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm-9.5 9.4 16-16 1.4 1.4-16 16-1.4-1.4Z"/>',
    14
  ),
  duplicate: SVG(
    '0 0 24 24',
    '<path fill="currentColor" d="M16 1H4a2 2 0 0 0-2 2v12h2V3h12V1Zm3 4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Zm0 16H8V7h11v14Z"/>',
    14
  ),
  more: SVG(
    '0 0 24 24',
    '<circle cx="12" cy="5" r="1.7" fill="currentColor"/><circle cx="12" cy="12" r="1.7" fill="currentColor"/><circle cx="12" cy="19" r="1.7" fill="currentColor"/>',
    14
  ),
  trash: SVG(
    '0 0 24 24',
    '<path fill="currentColor" d="M6 7h12v13a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V7Zm3-4h6l1 1h4v2H4V4h4l1-1Zm1 6v9h2V9H10Zm4 0v9h2V9h-2Z"/>',
    14
  ),
};

// How long to keep waiting for the re-render triggered by a quick control before
// reopening the editor anyway (nothing changed, or hot reload is off).
const CONTROL_RERENDER_TIMEOUT = 1500;
// Grace period after a re-render: a control change usually produces two updates
// (the committed text, then the new setting) and we want the last one.
const CONTROL_RERENDER_SETTLE = 250;

/** Re-enters inline editing on a field once the preview has re-rendered it. */
function reopenInlineEdit(win, field, scope) {
  if (!field) {
    return;
  }

  let settle = null;
  let fallback = null;
  let attempts = 0;
  let finished = false;
  const maxAttempts = 8;

  const cleanup = () => {
    finished = true;
    clearTimeout(settle);
    clearTimeout(fallback);
    win.removeEventListener('statamic:preview-updated', onUpdate);
  };

  const open = () => {
    if (finished) {
      return;
    }

    const selector =
      `[${SID_FIELD_ATTR}="${CSS.escape(field)}"]` +
      (scope ? `[data-sid-field-uid="${CSS.escape(scope)}"]` : '');
    const wrapper = win.document.querySelector(selector);

    if (!wrapper) {
      // Global-section control changes (font_tag h1→h2) re-stash and morph
      // twice: once for the committed text, once for the new tag. The first
      // pass often runs before the final node exists — keep waiting.
      attempts += 1;

      if (attempts >= maxAttempts) {
        cleanup();
      }

      return;
    }

    cleanup();

    const rect = wrapper.getBoundingClientRect();

    // Synthetic event: requestInlineEdit only reads target + click coordinates,
    // which decide where the caret lands.
    requestInlineEdit(win, wrapper, {
      target: wrapper,
      clientX: rect.left + 8,
      clientY: rect.top + rect.height / 2,
    });
  };

  const onUpdate = () => {
    if (finished) {
      return;
    }

    clearTimeout(settle);
    // Prefer the latest morph — font_tag/size redraws replace the element.
    settle = setTimeout(open, CONTROL_RERENDER_SETTLE);
  };

  fallback = setTimeout(() => {
    open();

    if (!finished) {
      // Last chance after stash morph (global sections are slower than LP).
      fallback = setTimeout(open, CONTROL_RERENDER_TIMEOUT);
    }
  }, CONTROL_RERENDER_TIMEOUT);

  win.addEventListener('statamic:preview-updated', onUpdate);
}

/**
 * A quick control was used. What it changes is rendered server-side, so the edit
 * is committed first — that also releases the hot-reload morph that inline
 * editing defers — and the session is picked back up on the re-rendered element.
 */
function applyControlValue(win, session, control, value) {
  const { field, scope, requestId } = session;

  // Keep the session alive until the CP has applied the control — finishEditing
  // posts edit-end which clears editSession; if that races ahead of edit-control,
  // the size/font_tag write is dropped.
  win.parent.postMessage(
    {
      source: 'statamic-visual-editor',
      type: 'edit-control',
      requestId,
      handle: control.handle,
      value,
    },
    win.location.origin
  );

  // Defer end so the parent handles edit-control first (same turn's messages
  // are processed in order, but finishEditing also does DOM work here).
  // Start reopen BEFORE finishEditing clears the DOM markers we need — and
  // keep listening across multiple morphs (global stash often fires two).
  win.setTimeout(() => {
    reopenInlineEdit(win, field, scope);
    finishEditing(win, false);
  }, 0);
}

/**
 * The block a row sits inside: the nearest ancestor that is a set of an
 * insertable container. Null when there is none — a row directly in a page
 * section has no block above it, and a page section is never one.
 *
 * A row's own actions stop at the row, and rowContextFor only ever sees the
 * innermost one. So a link inside a links block leaves the block itself out of
 * reach: nothing on the page belongs to it that the cursor can find, because the
 * links cover it completely. This is the way back up to it.
 */
function blockHolding(el) {
  let node = el.parentElement;

  while (node && node.nodeType === 1) {
    if (
      node.hasAttribute(SID_ATTR) &&
      !node.hasAttribute(SECTION_ORDERABLE_ATTR) &&
      node.parentElement?.hasAttribute(INSERT_ATTR)
    ) {
      return node;
    }

    node = node.parentElement;
  }

  return null;
}

/**
 * Everything the toolbar needs to speak for the block a field sits in: what to
 * call it, how to move it, and what can be done to it.
 *
 * Blocks no longer carry a hover control, so this is the only place those actions
 * appear — which is the point. They can't be pulled out from under the cursor,
 * and they can't vanish the moment you start typing.
 *
 * Mirrors showMoveControl's row branch: arrows when there are siblings to swap
 * with, then hide / duplicate / delete for a set inside an insertable container,
 * or add / remove for a plain orderable row.
 */
/**
 * A field that asked for a badge without being a row — `toolbar="true"`, or an
 * `icon=` / `icon_from=` that implies it.
 *
 * It has something to name itself with at the head of the bar, and nothing else:
 * peers, add, duplicate and remove all read the replicator around a row, and a
 * lone field has none. Being movable and wearing a badge are separate questions,
 * so a section heading can have the second without pretending to the first.
 */
function badgeOnlyContext(el) {
  return {
    row: el,
    uid: el.getAttribute('data-sid-field-uid') || el.getAttribute(SID_ATTR) || '',
    peers: [],
    horizontal: false,
    block: null,
    blockUid: null,
    blockLabel: '',
    label: el.getAttribute('data-sid-label') || '',
    icon: el.getAttribute('data-sid-icon') || '',
    iconSvg: el.getAttribute('data-sid-icon-svg') || '',
    moveActions: [],
    itemActions: [],
  };
}

/**
 * The row proper, given any orderable element inside it.
 *
 * Walks out through nested orderables while they stay inside the same replicator
 * container: whatever ends up as a direct child of that container is the row the
 * field owns, and everything below it is decoration the template added.
 */
function outermostRowWithin(row) {
  const container = row.closest(`[${INSERT_ATTR}]`);

  if (!container) {
    return row;
  }

  let out = row;

  for (let i = 0; i < 10; i++) {
    const outer = out.parentElement?.closest(`[${ORDERABLE_ATTR}]`);

    if (!outer || !container.contains(outer)) {
      return out;
    }

    out = outer;
  }

  return out;
}

function rowContextFor(win, el) {
  const inner = el.closest(`[${ORDERABLE_ATTR}]`);

  if (!inner) {
    const badged = el.closest('[data-sid-icon], [data-sid-icon-svg]');

    return badged ? badgeOnlyContext(badged) : null;
  }

  // A page section is not a row: it keeps its own hover control, with actions
  // (settings, save as template, add below) that no text edit would surface.
  if (inner.hasAttribute(SECTION_ORDERABLE_ATTR) || !inner.parentElement) {
    return null;
  }

  // Two orderable layers around one block: a template may wrap each row in an
  // orderable div of its own while the partial inside also declares orderable.
  // The OUTER one is the row — it is what sits among the siblings and what moves
  // in the DOM — so counting the inner one too made the list twice as long, and
  // a drag of one step landed two rows away.
  const row = outermostRowWithin(inner);

  const uid =
    row.getAttribute(GLOBAL_ROW_ATTR) || row.getAttribute(SID_ATTR) || row.getAttribute('data-sid-field-uid');

  if (!uid) {
    return null;
  }

  const post = (type, extra = {}) =>
    win.parent.postMessage(
      { source: 'statamic-visual-editor', type, uid, ...extra },
      win.location.origin
    );

  // The block around the row, when the row is not one itself. Only a nested row
  // has one: a block's own parent IS the insertable container.
  const block = row.parentElement.hasAttribute(INSERT_ATTR) ? null : blockHolding(row);
  const blockUid = block?.getAttribute(SID_ATTR) || null;
  const blockLabel = block?.getAttribute('data-sid-label') || '';

  const peers = orderablePeers(row);
  const horizontal = isHorizontalFlow(win, row);
  const moveActions = [];

  const peerIndex = peers.indexOf(row);

  if (peers.length > 1 && peerIndex >= 0) {
    if (peerIndex > 0) {
      moveActions.push({
        glyph: horizontal ? '←' : '↑',
        label: horizontal ? t('move_left') : t('move_up'),
        run: () => post('move', { direction: -1 }),
      });
    }

    if (peerIndex < peers.length - 1) {
      moveActions.push({
        glyph: horizontal ? '→' : '↓',
        label: horizontal ? t('move_right') : t('move_down'),
        run: () => post('move', { direction: 1 }),
      });
    }
  }

  // Insert on either side of this row. Both hand off to Statamic's own set
  // picker — the same one the "+" between blocks opens — so the choice is made
  // in one place, with its groups, search and previews, wherever it starts.
  const addAt = (position) => {
    const r = row.getBoundingClientRect();
    const edge = position === 'before' ? r.top : r.bottom;

    post('add-block-native', {
      anchorUid: uid,
      sectionUid: row.parentElement.getAttribute('data-sid-insert-scope') || null,
      position,
      // Same as the "+" inserter: inside a global section the picker belongs in
      // the panel's form, where that section's blocks actually live.
      global: !!row.closest(`[${GLOBAL_FOCUS_ATTR}]`),
      // A flat rect on the edge the new block lands at, so the picker opens
      // where it is going rather than over the middle of the block it came from.
      anchorRect: { left: r.left, right: r.left, top: edge, bottom: edge, width: 0, height: 0 },
      ...sidTemplatePayload(row.parentElement),
    });
  };

  // Written out rather than drawn: in a menu a word says what an icon only hints
  // at, and there is room for it.
  const itemActions = row.parentElement.hasAttribute(INSERT_ATTR)
    ? [
        { label: t('add_before'), dividerBefore: true, run: () => addAt('before') },
        { label: t('add_after'), run: () => addAt('after') },
        {
          label: t('duplicate_this'),
          dividerBefore: true,
          requiresAdd: true,
          run: () => post('duplicate-row'),
        },
        { label: t('hide_this'), run: () => post('hide-row') },
        {
          label: t('remove_this'),
          danger: true,
          dividerBefore: true,
          cancels: true,
          requiresRemove: true,
          run: () => post('remove-row'),
        },
      ]
    : [
        {
          label: t('add_another'),
          dividerBefore: true,
          // Hidden when the field is at max_rows / max_sets — see menu open.
          requiresAdd: true,
          run: () => post('add-row', sidTemplatePayload(row)),
        },
        {
          label: t('remove_this'),
          danger: true,
          dividerBefore: true,
          cancels: true,
          requiresRemove: true,
          // Taking the last one leaves the block holding an empty list and
          // drawing nothing, so it would sit there with nothing on the page to
          // reach it by. It goes with the row.
          run: () => post('remove-row', { emptyRemovesBlock: blockUid }),
        },
        // …and the block itself, in one go, without emptying it first. Nothing
        // else offers it: the row shadows the block for the whole of its area.
        ...(blockUid
          ? [
              {
                label: blockLabel ? t('remove_block', { name: blockLabel }) : t('remove_block_plain'),
                danger: true,
                dividerBefore: true,
                cancels: true,
                run: () =>
                  win.parent.postMessage(
                    { source: 'statamic-visual-editor', type: 'remove-row', uid: blockUid },
                    win.location.origin
                  ),
              },
            ]
          : []),
      ];

  return {
    row,
    uid,
    peers,
    horizontal,
    block,
    blockUid,
    blockLabel,
    // The visual_edit tag writes the set's display name here (Str::headline of
    // its type), which is exactly what the Control Panel calls the block.
    // Read off the inner element first: where a template wraps the block, the
    // wrapper is the row that moves, but the partial inside is the one carrying
    // the field annotation — and with it the set's name and icon.
    label: inner.getAttribute('data-sid-label') || row.getAttribute('data-sid-label') || '',
    icon: inner.getAttribute('data-sid-icon') || row.getAttribute('data-sid-icon') || '',
    iconSvg: inner.getAttribute('data-sid-icon-svg') || row.getAttribute('data-sid-icon-svg') || '',
    moveActions,
    itemActions,
  };
}

/**
 * The badge standing for the block. The icon the set names in "Edit Set" comes
 * first — it is the one the author chose, and it arrives already drawn. Then a
 * heading set's level, then an icon the toolbar knows by name, then Iconify /
 * pasted SVG from the raw name, and last the name's first letter, which still
 * tells a Headline from a Richtext at a glance.
 *
 * It is also the only thing left of the block's name out here: the bar sits on
 * top of what it names, so the word only said what was already on screen.
 */
function rowBadge(doc, ctx) {
  const badge = doc.createElement('span');
  const heading = /^h([1-6])$/.exec(ctx.icon);

  badge.style.cssText = 'flex:0 0 auto;display:flex;align-items:center;justify-content:center;opacity:.75;';

  if (ctx.iconSvg) {
    badge.innerHTML = ctx.iconSvg;

    const svg = badge.querySelector('svg');

    if (svg) {
      // The icon files carry the Control Panel's own size; the bar sets its own
      // off the text, the same as every other badge here.
      // As style, not as attributes: presentation attributes lose to any rule
      // the page happens to have for `svg`, and the page is not ours.
      svg.style.setProperty('width', '1.15em', 'important');
      svg.style.setProperty('height', '1.15em', 'important');

      return badge;
    }

    badge.innerHTML = '';
  }

  if (ctx.icon && /^\s*<svg[\s>]/i.test(ctx.icon)) {
    badge.innerHTML = ctx.icon;

    const svg = badge.querySelector('svg');

    if (svg) {
      svg.style.setProperty('width', '1.15em', 'important');
      svg.style.setProperty('height', '1.15em', 'important');

      return badge;
    }

    badge.innerHTML = '';
  }

  if (ctx.icon && /^[a-z0-9-]+:[a-z0-9-]+$/i.test(ctx.icon)) {
    adoptBadgeIconify(badge, ctx.icon);

    return badge;
  }

  if (heading) {
    badge.innerHTML = headingIcon(Number(heading[1]));

    return badge;
  }

  // Statamic's icon names don't all match the toolbar's own; the few that mean
  // the same thing are bridged here, and the rest fall through to the letter.
  const known = ICONS[{ link: 'anchor', table: 'table', code: 'code' }[ctx.icon] ?? ctx.icon];

  if (known) {
    badge.innerHTML = known;

    return badge;
  }

  if (!ctx.label) {
    return null;
  }

  // Knocked into a filled tile so it reads as a mark, not as a stray capital
  // sitting in front of the word it was taken from.
  badge.textContent = ctx.label.trim().charAt(0).toUpperCase();
  badge.style.cssText =
    'flex:0 0 auto;display:flex;align-items:center;justify-content:center;' +
    'width:1.45em;height:1.45em;border-radius:0.35em;font-size:0.85em;font-weight:700;' +
    'background:rgba(128,128,128,.28);';

  return badge;
}

/** Iconify SVGs for preview badges — same cache shape as the CP panel icons. */
const badgeIconifyCache = new Map();

function adoptBadgeIconify(badge, name) {
  const apply = (markup) => {
    if (!markup || !badge.isConnected) {
      return;
    }

    badge.innerHTML = markup;

    const svg = badge.querySelector('svg');

    if (!svg) {
      return;
    }

    svg.removeAttribute('width');
    svg.removeAttribute('height');
    svg.style.setProperty('width', '1.15em', 'important');
    svg.style.setProperty('height', '1.15em', 'important');
    svg.querySelectorAll('[stroke]:not([stroke="none"])').forEach((node) => {
      node.setAttribute('stroke', 'currentColor');
    });
  };

  const cached = badgeIconifyCache.get(name);

  if (typeof cached === 'string') {
    apply(cached);

    return;
  }

  const [prefix, icon] = name.split(':');
  const pending =
    cached ??
    fetch(`https://api.iconify.design/${prefix}/${icon}.svg`)
      .then((res) => (res.ok ? res.text() : ''))
      .then((markup) => {
        badgeIconifyCache.set(name, markup);

        return markup;
      })
      .catch(() => '');

  badgeIconifyCache.set(name, pending);
  pending.then(apply);
}

// --- Wrap-up belt (same shape as the edit toolbar's row chip) -------------------
//
// Nested rows (link buttons) cover their parent block completely. The old
// ↑↓/hide/dup/trash strip is the wrong language — authors already know the
// edit-toolbar belt. This one is that belt, opened on *click* of a Links
// wrap-up (or any block that holds nested orderable rows).

let hoverBeltEl = null;
let hoverBeltTarget = null;
let hoverBeltReposition = null;

function hideHoverBelt(win) {
  if (hoverBeltEl) {
    hoverBeltEl.ownerDocument.querySelector('[data-sve-menu]')?.remove();
    hoverBeltEl.remove();
    hoverBeltEl = null;
  }

  if (hoverBeltReposition) {
    win.removeEventListener('scroll', hoverBeltReposition, true);
    win.removeEventListener('resize', hoverBeltReposition);
    hoverBeltReposition = null;
  }

  hoverBeltTarget = null;
}

function positionHoverBelt(win) {
  if (!hoverBeltEl || !hoverBeltTarget || !hoverBeltTarget.isConnected) {
    return;
  }

  const rect = hoverBeltTarget.getBoundingClientRect();
  const barHeight = hoverBeltEl.offsetHeight || 34;
  let top = rect.top - barHeight - 10;

  if (top < 8) {
    top = rect.bottom + 10;
  }

  const maxLeft = win.innerWidth - hoverBeltEl.offsetWidth - 8;

  hoverBeltEl.style.top = `${top}px`;
  hoverBeltEl.style.left = `${Math.max(8, Math.min(rect.left, maxLeft))}px`;
}

function pointerInHoverBeltGap(event) {
  if (!hoverBeltEl || !hoverBeltTarget) {
    return false;
  }

  if (hoverBeltEl.contains(event.target) || hoverBeltTarget.contains(event.target)) {
    return true;
  }

  const x = event.clientX;
  const y = event.clientY;
  const br = hoverBeltEl.getBoundingClientRect();
  const tr = hoverBeltTarget.getBoundingClientRect();
  const pad = 8;
  const top = Math.min(br.top, tr.top) - pad;
  const bottom = Math.max(br.bottom, tr.bottom) + pad;
  const left = Math.min(br.left, tr.left) - pad;
  const right = Math.max(br.right, tr.right) + pad;

  return x >= left && x <= right && y >= top && y <= bottom;
}

/**
 * The edit-toolbar belt for a row/block, without an edit session — used on hover
 * for wrap-ups (e.g. the Links block) whose children would otherwise steal every
 * pointer event.
 */
function showHoverBelt(win, rowEl) {
  const ctx = rowContextFor(win, rowEl);

  if (!ctx) {
    hideHoverBelt(win);

    return;
  }

  // Already showing for this row — just keep it positioned.
  if (hoverBeltEl && hoverBeltTarget === ctx.row) {
    positionHoverBelt(win);

    return;
  }

  hideHoverBelt(win);

  const doc = win.document;
  const theme = toolbarThemeFor(detectCpDark(win));
  const SQUARE = 32;
  const pill =
    `display:flex;align-items:center;gap:1px;background:${theme.bg};color:${theme.fg};` +
    `border:1px solid ${theme.border};border-radius:9px;padding:4px;box-shadow:${theme.shadow};` +
    'box-sizing:content-box;margin:0;';

  const bar = doc.createElement('div');

  bar.id = '__sve-hover-belt';
  bar.style.cssText =
    'position:fixed;z-index:2147483646;display:flex;align-items:center;gap:7px;' +
    `color:${theme.fg};font-family:ui-sans-serif,system-ui,-apple-system,sans-serif;` +
    'font-size:13px;line-height:1;user-select:none;cursor:default;';
  bar.addEventListener('mousedown', (e) => e.preventDefault());

  const group = doc.createElement('div');

  group.style.cssText = pill;

  const addButton = (label, title, opts = {}) => {
    const btn = doc.createElement('button');

    btn.type = 'button';

    if (opts.html) {
      btn.innerHTML = opts.html;
    } else {
      btn.textContent = label;
    }

    btn.title = title;
    btn.style.cssText =
      `all:unset;cursor:pointer;min-width:${SQUARE}px;height:${SQUARE}px;display:inline-flex;` +
      'align-items:center;justify-content:center;border-radius:8px;padding:0 6px;' +
      `box-sizing:border-box;text-align:center;color:${theme.fg};`;
    btn.addEventListener('mouseenter', () => {
      btn.style.background = theme.hover;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.background = 'transparent';
    });

    if (opts.onPointerDown) {
      btn.style.cursor = 'grab';
      btn.style.touchAction = 'none';
      btn.addEventListener('pointerdown', opts.onPointerDown);
    }

    if (opts.onClick) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        opts.onClick(e);
      });
    }

    group.appendChild(btn);

    return btn;
  };

  const chip = doc.createElement('span');

  chip.style.cssText =
    pill + `flex:0 0 auto;justify-content:center;width:${SQUARE}px;height:${SQUARE}px;` +
    'font-weight:600;white-space:nowrap;';

  const badge = rowBadge(doc, ctx);

  if (badge) {
    chip.appendChild(badge);
  }

  if (ctx.label) {
    chip.title = ctx.label;
  }

  if (chip.childNodes.length) {
    bar.appendChild(chip);
  }

  if (ctx.peers.length > 1) {
    addButton('⠿', t('drag_section'), {
      onPointerDown: (event) => {
        if (event.button !== 0 || dragState) {
          return;
        }

        event.preventDefault();
        event.stopPropagation();

        const { row, uid, peers, horizontal } = ctx;

        hideHoverBelt(win);

        dragState = {
          el: row,
          uid,
          peers,
          horizontal,
          section: false,
          zoom: null,
          startX: event.clientX,
          startY: event.clientY,
          fromIndex: peers.indexOf(row),
          insert: null,
          active: false,
          indicator: null,
          ghost: null,
        };
      },
    });
  }

  const menuBtn = addButton('', t('more_actions'), {
    html: ICONS.more,
    onClick: () => {
      requestRowCaps(win, ctx.uid).then((caps) => {
        const actions = [...ctx.moveActions, ...ctx.itemActions].filter((action) => {
          if (action.requiresAdd && !caps.canAdd) {
            return false;
          }

          if (action.requiresRemove && !caps.canRemove) {
            return false;
          }

          return true;
        });

        openToolbarMenu(
          win,
          menuBtn,
          `hover-${ctx.uid}`,
          actions.map((action) => ({
            label: action.label,
            danger: action.danger,
            dividerBefore: action.dividerBefore,
            run: () => {
              hideHoverBelt(win);
              action.run();
            },
          }))
        );
      });
    },
  });

  if (group.children.length) {
    bar.appendChild(group);
  }

  if (!bar.children.length) {
    return;
  }

  doc.body.appendChild(bar);
  hoverBeltEl = bar;
  hoverBeltTarget = ctx.row;
  positionHoverBelt(win);

  hoverBeltReposition = () => positionHoverBelt(win);
  win.addEventListener('scroll', hoverBeltReposition, true);
  win.addEventListener('resize', hoverBeltReposition);
}

/**
 * toolbar="true" on a row/set, without inline_edit: the same belt as a wrap-up
 * (icon, drag, more → move / delete), opened on click. A field that asked to be
 * typed into keeps the edit toolbar instead.
 */
function openRowToolbar(win, el) {
  if (!el.hasAttribute(TOOLBAR_ATTR) || el.hasAttribute('data-sid-inline-edit')) {
    return;
  }

  hideMoveControl(win);
  showHoverBelt(win, el);
}

function createEditToolbar(win, session) {
  removeEditToolbar();
  hideHoverBelt(win);

  const doc = win.document;
  const bar = doc.createElement('div');

  // Follow the CP's colour scheme so the toolbar matches Statamic's own Bard
  // fixed toolbar in both light and dark mode.
  const theme = toolbarThemeFor(detectCpDark(win));

  toolbarTheme = theme;

  // Two boxes with the page showing between them: the icon naming the block,
  // and the controls acting on it. The bar itself draws nothing and only lines
  // them up, so the gap is the section's own background — which is what says the
  // icon is a different kind of thing rather than the first button on a row.
  //
  // Both boxes are built from the same square: a button is one, and so is the
  // icon. That is what keeps the two the same height and the icon's box a true
  // 1:1 — the sizes were written out twice before, and drifted apart.
  const SQUARE = 32;

  // `box-sizing` and `margin` are spelled out because this is drawn inside the
  // customer's own page: a theme with `* { box-sizing: border-box }` — which is
  // most of them — would otherwise have the icon's fixed square measure its own
  // padding and border from the inside, and come out short of the controls.
  const pill =
    `display:flex;align-items:center;gap:1px;background:${theme.bg};color:${theme.fg};` +
    `border:1px solid ${theme.border};border-radius:9px;padding:4px;box-shadow:${theme.shadow};` +
    'box-sizing:content-box;margin:0;';

  bar.id = '__sve-edit-toolbar';
  bar.style.cssText =
    'position:fixed;z-index:2147483647;display:flex;align-items:center;gap:7px;' +
    `color:${theme.fg};font-family:ui-sans-serif,system-ui,-apple-system,sans-serif;` +
    'font-size:13px;line-height:1;user-select:none;cursor:default;';

  // Everything that is not the icon. Filled first and hung on the bar last, so
  // the icon comes first however much ends up in here.
  const group = doc.createElement('div');

  group.style.cssText = pill;

  // Never steal focus from the editable — otherwise every button click would
  // blur it and commit the edit before the action runs.
  bar.addEventListener('mousedown', (e) => e.preventDefault());

  const addButton = (label, title, action, opts = {}) => {
    const btn = doc.createElement('button');

    btn.type = 'button';

    if (opts.html) {
      btn.innerHTML = opts.html;
    } else {
      btn.textContent = label;
    }

    btn.title = title;

    if (opts.cmd) {
      btn.dataset.sveCmd = opts.cmd;
    }

    if (opts.spanClass) {
      btn.dataset.sveSpanClass = opts.spanClass;
    }

    btn.style.cssText =
      `all:unset;cursor:pointer;min-width:${SQUARE}px;height:${SQUARE}px;display:inline-flex;` +
      'align-items:center;justify-content:center;border-radius:8px;padding:0 6px;' +
      `box-sizing:border-box;text-align:center;color:${theme.fg};` +
      (opts.style || '');

    btn.addEventListener('mouseenter', () => {
      if (!btn.dataset.sveOn) {
        btn.style.background = theme.hover;
      }
    });
    btn.addEventListener('mouseleave', () => {
      if (!btn.dataset.sveOn) {
        btn.style.background = 'transparent';
      }
    });
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      action();
    });

    // A grab handle starts its work on pointerdown, not on click — but it is the
    // same button otherwise, and gets its look from the same place.
    if (opts.onPointerDown) {
      btn.style.cursor = opts.cursor || 'grab';
      btn.style.touchAction = 'none';
      btn.addEventListener('pointerdown', opts.onPointerDown);
    }

    group.appendChild(btn);

    return btn;
  };

  // The bar is built in sections, and each one asks for a rule in front of
  // itself without knowing whether the section before it put anything on the
  // bar. So the rule is refused when there is nothing to divide, or when the
  // last thing added was already one: two rules in a row read as a gap where a
  // section went missing.
  const addSeparator = () => {
    const last = group.lastElementChild;

    if (!last || last.dataset.sveSep) {
      return;
    }

    const sep = doc.createElement('span');

    sep.dataset.sveSep = '1';
    sep.style.cssText = `width:1px;height:18px;background:${theme.sep};margin:0 4px;`;
    group.appendChild(sep);
  };

  // The block this text belongs to, named and handled at the head of the bar —
  // the same shape Gutenberg uses, and the reason the hover control could go.
  // Only where the template asked for a bar. The row around the text may well be
  // orderable — that is what lets the boxes be rearranged — but being movable is
  // not a reason to hang a bar over a field that did not ask for one. The badge,
  // the drag handle and the actions menu all belong to the same answer.
  const rowCtx = session.el.hasAttribute(TOOLBAR_ATTR)
    ? rowContextFor(win, session.el)
    : null;

  if (rowCtx) {
    const chip = doc.createElement('span');

    // The same 26px box the buttons occupy, so the bar keeps its rhythm — but
    // with no hover and nothing to press. That, and the rule set after it, is
    // what says this one is naming the block rather than acting on it.
    // The same square, in the same box: one square plus the pill's own padding
    // and border on each side is the controls' height, and the icon's box comes
    // out 1:1 without either measurement being repeated.
    chip.style.cssText =
      pill + `flex:0 0 auto;justify-content:center;width:${SQUARE}px;height:${SQUARE}px;` +
      'font-weight:600;white-space:nowrap;';

    const badge = rowBadge(doc, rowCtx);

    if (badge) {
      chip.appendChild(badge);
    }

    // The name is the badge's tooltip rather than a word on the bar. The bar
    // stands on the block it names, so the word repeated what was already there
    // — and the room it took is the room the field's own controls wanted.
    if (rowCtx.label) {
      chip.title = rowCtx.label;
    }

    if (chip.childNodes.length) {
      bar.appendChild(chip);
    }

    // Drag handle. The drag machinery refuses to start while a caret is in the
    // page — and the row is about to move out from under it anyway — so the edit
    // is committed first and the existing pointermove/pointerup take it from here.
    if (rowCtx.peers.length > 1) {
      addButton('⠿', t('drag_section'), () => {}, {
        onPointerDown: (event) => {
          if (event.button !== 0 || dragState) {
            return;
          }

          event.preventDefault();
          event.stopPropagation();

          const { row, uid, peers, horizontal } = rowCtx;

          finishEditing(win, false);

          dragState = {
            el: row,
            uid,
            peers,
            horizontal,
            section: false,
            zoom: null,
            startX: event.clientX,
            startY: event.clientY,
            fromIndex: peers.indexOf(row),
            insert: null,
            active: false,
            indicator: null,
            ghost: null,
          };
        },
      });
    }

    // Moving lives in the ⋮ menu alone. As arrows it was the same two commands a
    // second time, next to the menu that already spelled them out, on a bar the
    // field's own controls have to share.
    //
    // Only a divider once there is something to divide: with the arrows gone, a
    // block with no icon, no name and no siblings puts nothing here at all.
    if (group.children.length) {
      addSeparator();
    }
  }

  const markActive = (btn) => {
    btn.dataset.sveOn = '1';
    btn.style.background = theme.active;
  };

  /**
   * One sibling-field control. The fieldtype decides the shape, and nothing
   * else: button_group and radio render as a segmented row, select as a
   * dropdown — the same two shapes they have in the Control Panel.
   *
   * The count used to decide it too (buttons up to three options, a dropdown
   * beyond), which meant a four-option button_group silently became a dropdown
   * and the toolbar disagreed with the panel beside it about what the field is.
   * A bar that grows a little is the smaller price.
   */
  const addControl = (control) => {
    const current = control.value == null ? '' : String(control.value);

    if (control.type === 'theme_color_picker' || control.type === 'color') {
      const btn = addButton('', control.display || 'Farve', () => {}, { html: ICONS.color });

      if (current) {
        btn.style.boxShadow = `inset 0 -3px 0 ${current}`;
      }

      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        openHighlightColorMenu(win, btn, control, session, (value) => {
          applyHighlightColor(win, session, control, value);
        });
      });

      return;
    }

    if (control.type === 'toggle') {
      const on = control.value === true || current === '1' || current === 'true';
      const btn = addButton(control.display, control.display, () => applyControlValue(win, session, control, !on), {
        style: 'padding:0 10px;font-size:12px;font-weight:600;',
      });

      if (on) {
        markActive(btn);
      }

      return;
    }

    const options = control.options || [];

    if (control.type !== 'select' && options.length) {
      options.forEach((option) => {
        const btn = addButton(
          option.label,
          `${control.display}: ${option.label}`,
          () => applyControlValue(win, session, control, option.key),
          { style: 'padding:0 8px;font-size:12px;font-weight:600;' }
        );

        if (option.key === current) {
          markActive(btn);
        }
      });

      return;
    }

    // Closed button shows the field title ("Size") while the value is empty or
    // still the blueprint default — not "Small" just because that is the default.
    // After the author picks a non-default option, show that option's label.
    const defaultKey = control.default != null && control.default !== '' ? String(control.default) : '';
    const isChosen = current !== '' && current !== defaultKey;
    const selected = isChosen ? options.find((option) => option.key === current) : null;
    const btn = addButton(
      `${selected ? selected.label : control.display} ▾`,
      selected ? `${control.display}: ${selected.label}` : control.display,
      () => {},
      { style: 'padding:0 10px;font-size:12px;gap:4px;' }
    );

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      openControlMenu(win, btn, control, (value) => applyControlValue(win, session, control, value));
    });
  };

  // Sibling-field controls (controls="font_tag|size") before Bard tools like
  // colour — tag/size are the block’s own settings and should lead the bar.
  if (session.controls?.length) {
    if (group.children.length) {
      addSeparator();
    }

    session.controls.forEach(addControl);
  }

  const exec = (command, value = null) => {
    win.document.execCommand(command, false, value);
    session.dirty = true;
    clearTimeout(session.inputTimer);
    session.inputTimer = null;
    sendEditInput(win, session);
    updateEditToolbarState(win);
  };

  const addBlockButton = (label, title, spec, opts = {}) => {
    const btn = addButton(label, title, () => applyBlockFormat(win, session, spec), opts);

    btn.dataset.sveBlockTag = spec.tag;
    btn.dataset.sveBlockClass = spec.className || '';

    return btn;
  };

  if (session.mode === 'bard' || session.mode === 'bard-field') {
    // Build the toolbar from the field's own `buttons` config (passed through
    // as session.bardButtons) — never a hardcoded set. Each button name is
    // rendered by its handler below; unknown names are skipped. Buttons that
    // inline editing can't perform in place (lists, quote, color) fall back to
    // opening the CP panel focused on this field.
    const buttons = session.bardButtons?.length
      ? session.bardButtons
      : ['bold', 'italic', 'anchor', 'removeformat'];
    const styles = session.bardStyles || {};

    // Rendered in the field's own `buttons` order, no separators — mirroring
    // Statamic's own toolbar exactly. Each name maps to the real Bard icon.
    for (const name of buttons) {
      if (/^h[1-6]$/.test(name)) {
        const level = Number(name.slice(1));

        addBlockButton('', `Heading ${level}`, { tag: name, node: 'heading', level }, {
          html: headingIcon(level),
        });
        continue;
      }

      const style = styles[name];

      if (style?.kind === 'group' && Array.isArray(style.items)) {
        // Dropdown group from bard_styles.php (sizes, flow spacing, …).
        const groupBtn = addButton('', style.name || name, () => {}, {
          html: styleIdentHtml(style.ident, (style.name || name)[0]),
        });

        groupBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();

          const existing = doc.querySelector('[data-sve-bard-style-menu]');

          if (existing) {
            existing.remove();

            if (existing.dataset.for === name) {
              return;
            }
          }

          const menu = doc.createElement('div');

          menu.dataset.sveBardStyleMenu = '';
          menu.dataset.for = name;
          menu.style.cssText =
            'position:fixed;z-index:2147483647;min-width:160px;padding:4px;' +
            'background:#1a1f2e;border:1px solid rgba(255,255,255,.12);border-radius:8px;' +
            'box-shadow:0 8px 24px rgba(0,0,0,.5);';

          style.items.forEach((item) => {
            const row = doc.createElement('button');

            row.type = 'button';
            row.style.cssText =
              'display:flex;align-items:center;gap:8px;width:100%;padding:5px 10px;border:none;' +
              'cursor:pointer;text-align:left;background:transparent;border-radius:4px;color:#e2e8f0;';
            row.innerHTML =
              `<span style="min-width:22px;font-size:11px;opacity:.8">${item.ident && !String(item.ident).startsWith('<') ? item.ident : '·'}</span>` +
              `<span style="font-size:12px;flex:1">${item.name || item.handle || ''}</span>`;
            row.addEventListener('mouseenter', () => {
              row.style.background = 'rgba(255,255,255,.07)';
            });
            row.addEventListener('mouseleave', () => {
              row.style.background = 'transparent';
            });
            row.addEventListener('mousedown', (ev) => ev.preventDefault());
            row.addEventListener('click', (ev) => {
              ev.preventDefault();
              applyVizuStyle(win, session, item);
              menu.remove();
            });
            menu.appendChild(row);
          });

          const r = groupBtn.getBoundingClientRect();

          menu.style.left = `${Math.max(4, Math.min(r.left, win.innerWidth - 180))}px`;
          menu.style.top = `${r.bottom + 4}px`;
          doc.body.appendChild(menu);

          const close = (ev) => {
            if (menu.contains(ev.target) || groupBtn.contains(ev.target)) {
              return;
            }

            menu.remove();
            doc.removeEventListener('mousedown', close, true);
          };

          setTimeout(() => doc.addEventListener('mousedown', close, true), 0);
        });

        continue;
      }

      if (style?.kind === 'vizu') {
        addButton('', style.name || name, () => applyVizuStyle(win, session, style), {
          html: styleIdentHtml(style.ident, (style.name || name)[0]),
        });
        continue;
      }

      if (style) {
        // bard-texstyle: the icon is the style's letter (matching bts-icon-letter).
        if (style.type === 'span') {
          addButton('', style.name || name, () => toggleSpanClass(win, session, style.class), {
            spanClass: style.class,
            html: letterIcon(style.ident || (style.name || name)),
          });
        } else {
          const tag = style.type === 'heading' ? `h${style.level || 2}` : 'p';

          addBlockButton('', style.name || name, {
            tag,
            node: style.type === 'heading' ? 'heading' : 'paragraph',
            level: style.level,
            className: style.class,
          }, { html: letterIcon(style.ident || (style.name || name)) });
        }

        continue;
      }

      switch (name) {
        case 'bold':
          addButton('', 'Bold (⌘B)', () => exec('bold'), { cmd: 'bold', html: ICONS.bold });
          break;
        case 'italic':
          addButton('', 'Italic (⌘I)', () => exec('italic'), { cmd: 'italic', html: ICONS.italic });
          break;
        case 'underline':
          addButton('', 'Underline (⌘U)', () => exec('underline'), { cmd: 'underline', html: ICONS.underline });
          break;
        case 'strikethrough':
          addButton('', 'Strikethrough', () => exec('strikethrough'), {
            cmd: 'strikethrough',
            html: ICONS.strikethrough,
          });
          break;
        case 'anchor':
          // Uses Statamic's own link dialog (opened for the selection).
          addButton('', 'Link', () => bardCommand(win, session, 'link'), { html: ICONS.anchor });
          break;
        case 'removeformat':
          addButton('', 'Remove Formatting', () => {
            exec('removeFormat');
            exec('unlink');
          }, { html: ICONS.removeformat });
          break;
        case 'color': {
          // In-preview theme swatches — keep the edit session open. The old
          // bardCommand path finished editing and tried to click the CP Bard
          // colour button, which fails with floating toolbars (nothing opens).
          const colorBtn = addButton('', 'Tekstfarve', () => {}, { html: ICONS.color });
          const activeColor = readSelectionVizuProp(win, session, 'color');

          if (activeColor) {
            colorBtn.style.boxShadow = `inset 0 -3px 0 ${activeColor}`;
          }

          colorBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            openHighlightColorMenu(
              win,
              colorBtn,
              { handle: '__bard_color__', value: readSelectionVizuProp(win, session, 'color') },
              session,
              (value) => {
                if (value == null || value === '') {
                  clearVizuSpanProp(win, session, 'color');
                } else {
                  setVizuSpanProp(win, session, 'color', value);
                }
              }
            );
          });
          break;
        }
        case 'quote':
        case 'unorderedlist':
        case 'orderedlist':
        case 'code':
        case 'codeblock':
        case 'table': {
          // Block-structure tools performed via Statamic's own editor command.
          const titles = {
            quote: 'Blockquote',
            unorderedlist: 'Unordered List',
            orderedlist: 'Ordered List',
            code: 'Code',
            codeblock: 'Code Block',
            table: 'Table',
          };

          addButton('', titles[name], () => bardCommand(win, session, name), { html: ICONS[name] });
          break;
        }
        default:
          // Unknown button name — skip silently.
          break;
      }
    }
  }

  // String fields belonging to a row that also has a link/url value (e.g.
  // button rows): shortcut to edit the link in the CP panel. The link-edit
  // message must be posted BEFORE finishEditing so the CP still has the edit
  // session (and its resolved link path) when the message arrives.
  if (session.hasLink) {
    addButton('', 'Skift link', () => {
      win.parent.postMessage(
        { source: 'statamic-visual-editor', type: 'link-edit', requestId: session.requestId },
        win.location.origin
      );
      finishEditing(win, false);
    }, { html: ICONS.anchor });
  }

  // Everything that can be done to the block, behind one button at the far end —
  // away from the drag handle, so nothing destructive sits under a pointer that
  // was reaching for a move. Written out in words, moving included: a menu has
  // room to say what an arrow could only hint at.
  if (rowCtx && (rowCtx.moveActions.length || rowCtx.itemActions.length)) {
    addSeparator();

    const menuBtn = addButton('', t('more_actions'), () => {}, { html: ICONS.more });

    menuBtn.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();

      // Honour max_rows / min_rows before the menu appears — otherwise
      // "Add another" stays clickable on a field that's already full.
      requestRowCaps(win, rowCtx.uid).then((caps) => {
        const actions = [...rowCtx.moveActions, ...rowCtx.itemActions].filter((action) => {
          if (action.requiresAdd && !caps.canAdd) {
            return false;
          }

          if (action.requiresRemove && !caps.canRemove) {
            return false;
          }

          return true;
        });

        const items = actions.map((action) => ({
          label: action.label,
          danger: action.danger,
          dividerBefore: action.dividerBefore,
          run: () => {
            // The session ends before the row changes: the paths shift with it, and
            // a deferred edit-input landing afterwards would write into whatever
            // took its place. Removing cancels — there is nothing left to commit to.
            finishEditing(win, !!action.cancels);
            action.run();
          },
        }));

        openToolbarMenu(win, menuBtn, `row-${rowCtx.uid}`, items);
      });
    });
  }

  // Commit/cancel live on Enter (inline Bard), Esc, and click-outside — the
  // green ✓ / red ✕ only cluttered the bar and nobody used them.
  if (group.children.length) {
    bar.appendChild(group);
  }

  // Nothing to show — an empty toolbar is just a box hovering over the text.
  if (!bar.children.length) {
    return;
  }

  doc.body.appendChild(bar);
  toolbarEl = bar;
  positionEditToolbar(win, session);
  updateEditToolbarState(win);
}

// --- Move arrows -----------------------------------------------------------------
// Hovering a page section (or any element annotated with move="true") shows a
// small arrow control. Clicking sends a move message; the CP swaps the two
// items in the containing array (page_sections, grid/repeater rows, …) and
// Statamic's reactivity re-renders both the publish form and the preview.
// Rows laid out horizontally (flex-row parents) get ←/→ instead of ↑/↓.

// --- Global (synced) sections ---------------------------------------------------
//
// A global section renders the SOURCE entry's markup, so its content isn't part of
// this page's form and can't be edited here — it belongs to another entry. The
// template leaves a hidden marker in front of it; we tag the section itself so it
// can be badged, focused (the rest of the page fades back, so you always know you
// are inside a synced section) and handed off to its own editor.

const GLOBAL_ATTR = 'data-sve-global';
// The page's own page_sections row id for a global section (see the partial).
const GLOBAL_ROW_ATTR = 'data-sve-global-row';

/** The display:contents wrapper a global section's rendered sections live in. */
const GLOBAL_ROOT_ATTR = 'data-sve-global-root';

/**
 * A peer's box, even when it has none of its own.
 *
 * A global section is wrapped in display:contents so it adds no layout box —
 * measuring it gives zeros, and a drop beside it landed in the wrong place.
 * What it renders does have a box, so measure that instead.
 */
function peerRect(el) {
  const rect = el.getBoundingClientRect();

  if (rect.width || rect.height) {
    return rect;
  }

  const first = el.firstElementChild;

  if (!first) {
    return rect;
  }

  const a = first.getBoundingClientRect();
  const b = (el.lastElementChild ?? first).getBoundingClientRect();
  const left = Math.min(a.left, b.left);
  const top = Math.min(a.top, b.top);

  return new DOMRect(left, top, Math.max(a.right, b.right) - left, Math.max(a.bottom, b.bottom) - top);
}
const GLOBAL_FOCUS_ATTR = 'data-sve-global-focused';
const GLOBAL_BAR_ID = '__sve-global-bar';

let globalFocusEl = null;
// Held separately from the element: a morph patches our attribute back off the
// live node, so after a re-render the DOM can no longer tell us what we were in.
let globalFocusId = null;

/** Tags each section that came from a Global section with its source's id. */
function tagGlobalSections(win) {
  const label = t('global_badge');

  const ensureBadge = (el, text) => {
    let badge = el.querySelector(':scope > [data-sve-global-badge]');

    if (!badge) {
      badge = win.document.createElement('span');
      badge.setAttribute('data-sve-global-badge', '');
      el.prepend(badge);
    }

    badge.textContent = text;
  };

  const apply = (el, sourceId, row) => {
    el.setAttribute(GLOBAL_ATTR, sourceId);
    el.setAttribute('data-sve-global-label', label);
    ensureBadge(el, label);

    if (row) {
      el.setAttribute(GLOBAL_ROW_ATTR, row);
    }
  };

  // Preferred: wrap from the template (display:contents) — every section inside
  // belongs to this synced source; nothing after it on the page gets tagged.
  win.document.querySelectorAll('[data-sve-global-root]').forEach((root) => {
    const sourceId = root.getAttribute('data-sve-global-root');
    const row =
      root.previousElementSibling?.getAttribute('data-sve-global-row') ||
      root.parentElement?.querySelector(':scope > [data-sve-global-row]')?.getAttribute('data-sve-global-row');

    // Only the page_sections roots (direct children), not nested rows/blocks —
    // those would otherwise get the purple "Global" badge too.
    [...root.children].forEach((el) => {
      if (el.hasAttribute(SID_ATTR) || /^SECTION|ARTICLE$/i.test(el.tagName)) {
        apply(el, sourceId, row);
      }
    });
  });

  // Legacy marker (single following sibling) for sites that haven't updated the
  // global_section partial yet.
  win.document.querySelectorAll('[data-sve-global-id]').forEach((marker) => {
    if (marker.closest('[data-sve-global-root]')) {
      return;
    }

    const sourceId = marker.getAttribute('data-sve-global-id');
    const row = marker.previousElementSibling?.getAttribute('data-sve-global-row');
    const section = marker.nextElementSibling;

    if (section && !section.hasAttribute(GLOBAL_ATTR)) {
      apply(section, sourceId, row);
    }
  });
}

function exitGlobalFocus(win, closePanel = true) {
  const doc = win.document;
  const wasFocused = !!globalFocusEl || !!globalFocusId;

  doc.querySelectorAll(`[${GLOBAL_FOCUS_ATTR}]`).forEach((el) => el.removeAttribute(GLOBAL_FOCUS_ATTR));
  doc.documentElement.classList.remove('sve-global-focus');
  doc.getElementById(GLOBAL_BAR_ID)?.remove();
  globalSaveBtn = null;
  globalStatusEl = null;
  globalSectionDirty = false;
  globalSectionLabel = null;
  globalFocusEl = null;
  globalFocusId = null;

  // Stepping out closes the section's editor with it — leaving it open would keep
  // the page rendering an unsaved section you can no longer see you're in.
  if (wasFocused && closePanel) {
    win.parent.postMessage({ source: 'statamic-visual-editor', type: 'close-global-section' }, win.location.origin);
  }

  // … and it goes away again with the focus.
  if (wasFocused) {
    setupInserters(win);
  }
}

/**
 * After a Live Preview morph the section nodes are new DOM. Re-apply focus marks
 * without tearing down panel state (exitGlobalFocus would clear globalFocusId and
 * leave fields un-editable until the user re-confirms enter).
 */
function rebindGlobalFocus(win, sourceId, attempt = 0) {
  if (!sourceId) {
    return;
  }

  tagGlobalSections(win);

  const doc = win.document;
  const sections = [...doc.querySelectorAll(`[${GLOBAL_ATTR}="${CSS.escape(sourceId)}"]`)];

  if (!sections.length) {
    if (attempt < 10) {
      win.setTimeout(() => rebindGlobalFocus(win, sourceId, attempt + 1), 80);
    }

    // Keep the id sticky so the next click can still recover focus.
    globalFocusId = sourceId;

    return;
  }

  doc.querySelectorAll(`[${GLOBAL_FOCUS_ATTR}]`).forEach((el) => el.removeAttribute(GLOBAL_FOCUS_ATTR));
  sections.forEach((el) => el.setAttribute(GLOBAL_FOCUS_ATTR, ''));
  doc.documentElement.classList.add('sve-global-focus');
  globalFocusEl = sections[0];
  globalFocusId = sourceId;

  // A morph replaces the whole page, bar included — put it back, or stepping
  // into a global section and typing one character loses the way to save it.
  if (!doc.getElementById(GLOBAL_BAR_ID)) {
    mountGlobalBar(win);
  }
}

/**
 * Statamic CP light/dark tokens for dialogs rendered inside the preview iframe
 * (which doesn't inherit CP CSS variables). Reads the parent CP theme when possible.
 */
function cpDialogTheme(win) {
  let dark = false;
  let bg = '';
  let primary = '';

  try {
    const root = win.parent?.document?.documentElement;

    if (root) {
      dark = root.classList.contains('dark');
      const cs = win.parent.getComputedStyle(root);

      bg = (cs.getPropertyValue('--theme-color-content-bg') || '').trim();
      primary = (cs.getPropertyValue('--theme-color-primary') || '').trim();
    }
  } catch {
    // Cross-origin or missing parent — fall back below.
  }

  return {
    dark,
    bg: bg || (dark ? '#1e293b' : '#ffffff'),
    color: dark ? '#f8fafc' : '#0f172a',
    muted: dark ? 'rgba(248,250,252,.7)' : 'rgba(15,23,42,.7)',
    primary: primary || '#4f46e5',
    overlay: 'rgba(0,0,0,.45)',
  };
}

/** Statamic primary button (same look as CP “Save & Publish”). */
function svePrimaryBtn(theme, { compact = false } = {}) {
  const pad = compact ? '6px 12px' : '8px 14px';
  const size = compact ? '12px' : '13px';

  return (
    `all:unset;cursor:pointer;padding:${pad};border-radius:8px;font-size:${size};font-weight:600;` +
    `background:${theme.primary};color:#fff;`
  );
}

/** Quiet secondary/cancel chip — 10% white on dark, 10% black on light. */
function sveSecondaryBtn(theme, { compact = false } = {}) {
  const pad = compact ? '6px 12px' : '8px 14px';
  const size = compact ? '12px' : '13px';
  const wash = theme.dark ? 'rgba(255,255,255,.1)' : 'rgba(0,0,0,.1)';

  return (
    `all:unset;cursor:pointer;padding:${pad};border-radius:8px;font-size:${size};font-weight:600;` +
    `color:${theme.color};background:${wash};`
  );
}

/** Destructive (discard / close without saving). */
function sveDangerBtn(theme, { compact = false } = {}) {
  const pad = compact ? '6px 12px' : '8px 14px';
  const size = compact ? '12px' : '13px';

  return (
    `all:unset;cursor:pointer;padding:${pad};border-radius:8px;font-size:${size};font-weight:600;` +
    'background:#dc2626;color:#fff;'
  );
}

/** Floating focus bar (header/footer/global) — same surface as dialog cards. */
function sveFocusBarStyle(theme) {
  return (
    'position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:2147483646;' +
    `display:flex;align-items:center;gap:10px;background:${theme.bg};color:${theme.color};` +
    'padding:8px 10px 8px 16px;border-radius:10px;box-shadow:0 8px 28px rgba(0,0,0,.35);' +
    'font:500 13px/1.3 ui-sans-serif,system-ui,sans-serif;user-select:none;'
  );
}

/**
 * Confirm overlay in the preview — same card/button chrome as CP
 * confirmCloseDiscard / confirmUnsaved (Statamic light + dark).
 */
function showPreviewConfirm(win, { title, body, confirmLabel, cancelLabel, danger = false, onConfirm, onCancel }) {
  const doc = win.document;
  const theme = cpDialogTheme(win);

  doc.getElementById('__sve-preview-confirm')?.remove();

  const overlay = doc.createElement('div');

  overlay.id = '__sve-preview-confirm';
  overlay.style.cssText =
    'position:fixed;inset:0;z-index:2147483647;display:flex;align-items:center;justify-content:center;' +
    `background:${theme.overlay};font-family:ui-sans-serif,system-ui,sans-serif;`;

  const card = doc.createElement('div');

  card.style.cssText =
    `width:400px;max-width:92vw;background:${theme.bg};color:${theme.color};` +
    'border-radius:12px;padding:22px;box-shadow:0 24px 64px rgba(0,0,0,.35);';
  card.innerHTML =
    `<div style="font-size:15px;font-weight:600;margin-bottom:6px;">${title}</div>` +
    `<div style="font-size:13px;color:${theme.muted};line-height:1.45;margin-bottom:18px;">${body}</div>` +
    '<div data-sve-actions style="display:flex;justify-content:flex-end;gap:8px;flex-wrap:wrap;"></div>';

  const actions = card.querySelector('[data-sve-actions]');
  const close = () => overlay.remove();

  const button = (label, style, fn) => {
    const btn = doc.createElement('button');

    btn.type = 'button';
    btn.textContent = label;
    btn.style.cssText = style;
    btn.addEventListener('click', (event) => {
      event.stopPropagation();
      close();
      fn?.();
    });
    actions.appendChild(btn);
  };

  button(cancelLabel || t('cancel'), sveSecondaryBtn(theme), () => onCancel?.());
  button(
    confirmLabel,
    danger ? sveDangerBtn(theme) : svePrimaryBtn(theme),
    () => onConfirm?.()
  );

  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) {
      close();
      onCancel?.();
    }
  });

  overlay.appendChild(card);
  doc.documentElement.appendChild(overlay);
}

function confirmEnterGlobal(win, section) {
  showPreviewConfirm(win, {
    title: t('global_enter_title'),
    body: t('global_enter_body'),
    confirmLabel: t('global_enter_confirm'),
    cancelLabel: t('cancel'),
    onConfirm: () => enterGlobalFocus(win, section),
  });
}

function requestCloseGlobal(win) {
  win.parent.postMessage({ source: 'statamic-visual-editor', type: 'request-close-global' }, win.location.origin);
}

let globalSaveBtn = null;
let globalStatusEl = null;
let globalSectionDirty = false;
/** The set's display name, as the CP reads it off the panel's values. */
let globalSectionLabel = null;

function setGlobalSectionDirtyUI(dirty) {
  globalSectionDirty = !!dirty;

  if (globalSaveBtn) {
    globalSaveBtn.style.display = globalSectionDirty ? '' : 'none';
  }

  if (globalStatusEl) {
    globalStatusEl.textContent = globalSectionDirty ? t('chrome_bar_dirty') : t('chrome_bar_clean');
  }
}

/**
 * The bar that says which global section is being edited, whether it holds
 * unsaved work, and where to save it.
 *
 * The same bar the header and footer get, for the same reason: stepping into
 * something shared has to keep saying so, and the page behind it can no longer
 * be trusted to — what you are looking at is one of several places this section
 * appears. Built here rather than in the CP because it belongs over the page, in
 * the preview's own coordinates; the CP's panel is beside it, not on it.
 */
function mountGlobalBar(win) {
  const doc = win.document;
  const theme = cpDialogTheme(win);

  doc.getElementById(GLOBAL_BAR_ID)?.remove();

  const bar = doc.createElement('div');

  bar.id = GLOBAL_BAR_ID;
  bar.style.cssText = sveFocusBarStyle(theme);

  const text = doc.createElement('span');

  text.style.cssText = `font-weight:400;color:${theme.muted};`;
  text.innerHTML = t('global_bar', {
    section: `<b style="font-weight:700;color:${theme.color};">${globalSectionLabel || t('global_bar_fallback')}</b>`,
  });

  const status = doc.createElement('span');

  status.style.cssText = `font-weight:400;color:${theme.muted};`;
  status.textContent = globalSectionDirty ? t('chrome_bar_dirty') : t('chrome_bar_clean');
  globalStatusEl = status;

  text.appendChild(doc.createTextNode(' '));
  text.appendChild(status);
  bar.appendChild(text);

  const barButton = (label, style) => {
    const btn = doc.createElement('button');

    btn.type = 'button';
    btn.textContent = label;
    btn.style.cssText = style;
    bar.appendChild(btn);

    return btn;
  };

  // Save only while there is something to save — the CP drives the flag.
  globalSaveBtn = barButton(t('save'), svePrimaryBtn(theme, { compact: true }));
  globalSaveBtn.style.display = globalSectionDirty ? '' : 'none';
  globalSaveBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    win.parent.postMessage(
      { source: 'statamic-visual-editor', type: 'save-global-section' },
      win.location.origin
    );
  });

  barButton(t('close'), sveSecondaryBtn(theme, { compact: true })).addEventListener('click', (event) => {
    event.stopPropagation();
    requestCloseGlobal(win);
  });

  doc.documentElement.appendChild(bar);
}

/**
 * Steps into a global section: mark it focused and open its editor on the LEFT
 * (same place as a normal section). Confirm already happened; from here it
 * edits like any other section — values live on the synced source entry.
 * `reopen: false` re-applies the look after a re-render without remounting the
 * panel (would reload the form mid-edit).
 */
function enterGlobalFocus(win, section, reopen = true) {
  const sourceId = section.getAttribute(GLOBAL_ATTR);

  // Already focused on this synced source (any of its rendered sections).
  if (globalFocusId && globalFocusId === sourceId && globalFocusEl) {
    if (!win.document.getElementById(GLOBAL_BAR_ID)) {
      mountGlobalBar(win);
    }

    return;
  }

  exitChromeFocus(win, false);
  exitGlobalFocus(win, false);

  const doc = win.document;

  // Focus every rendered chunk that belongs to this synced source (multi-section
  // globals), not only the one that was clicked.
  doc.querySelectorAll(`[${GLOBAL_ATTR}="${CSS.escape(sourceId)}"]`).forEach((el) => {
    el.setAttribute(GLOBAL_FOCUS_ATTR, '');
  });
  doc.documentElement.classList.add('sve-global-focus');
  globalFocusEl = section;
  globalFocusId = sourceId;
  mountGlobalBar(win);

  // Open the source entry in the left Live Preview editor — same slot a normal
  // section uses. Inline edit borrows that form's values (sectionPanelContainer).
  if (reopen) {
    win.parent.postMessage(
      { source: 'statamic-visual-editor', type: 'open-global-section', id: sourceId },
      win.location.origin
    );
  }

  win.parent.postMessage({ source: 'statamic-visual-editor', type: 'sve-global-dirty-query' }, win.location.origin);

  // The section's own "+" only exists while it is being edited.
  setupInserters(win);
}

// --- Site chrome (header / footer) ----------------------------------------------
//
// Same focus UX as global sections, but the content lives in a global set
// (theme_settings by default). Stepping in fades the page, opens that global in
// the side panel, and switches the library to Header/Footer design cards.

const CHROME_ATTR = 'data-sve-chrome';
const CHROME_FOCUS_ATTR = 'data-sve-chrome-focused';
const CHROME_BAR_ID = '__sve-chrome-bar';

/**
 * What a click outside the header/footer means while you are inside one.
 *
 * true (default) — nothing at all, the same lock a global section has. The page
 *   around it is faded and out of reach, and the way out is the bar at the bottom.
 * false — the older behaviour: the click asks the Control Panel to close chrome,
 *   warning first if Theme Settings has unsaved work.
 *
 * Goes off together with CHROME_INLINE in cp.js — the lock is part of editing the
 * header in the left panel, and on its own over the docked route it would only
 * take away a way out that route still expects to have.
 */
const CHROME_LOCKS_PAGE = true;

let chromeFocusEl = null;
let chromeFocusKind = null;
/** Survives morph exits (closePanel=false) so Theme Settings edits don't eject you. */
let chromeFocusKindSticky = null;


/**
 * Flags the chrome this site has switched off, so the CSS above can drop its
 * hover affordance. On <html> rather than the elements themselves: the header
 * and footer are the site's own markup and get replaced on every morph, while
 * the root element survives — the same reason the focus classes live there.
 */
function markDisabledChrome(doc) {
  ['header', 'footer'].forEach((kind) => {
    doc.documentElement.classList.toggle(`sve-chrome-off-${kind}`, !featureOn(`chrome_${kind}`));
  });
}

/**
 * The chrome element only if this site lets it be edited, else null.
 *
 * Header and footer toggle separately, so the answer depends on which one was
 * hit — a site can open its footer to editors while its header stays fixed.
 */
function chromeEditable(el) {
  if (!el) {
    return null;
  }

  const kind = el.getAttribute(CHROME_ATTR) === 'footer' ? 'footer' : 'header';

  return featureOn(`chrome_${kind}`) ? el : null;
}

function chromeFocusClass(kind) {
  return kind === 'footer' ? 'sve-chrome-focus-footer' : 'sve-chrome-focus-header';
}

function clearChromeFocusClasses(doc) {
  doc.documentElement.classList.remove(
    'sve-chrome-focus',
    'sve-chrome-focus-header',
    'sve-chrome-focus-footer'
  );
}

function applyChromeFocusClass(doc, kind) {
  const next = chromeFocusClass(kind);

  // Idempotent: don't thrash classList if already correct (avoids style recalc flicker).
  if (doc.documentElement.classList.contains(next)) {
    doc.documentElement.classList.remove(
      next === 'sve-chrome-focus-footer' ? 'sve-chrome-focus-header' : 'sve-chrome-focus-footer',
      'sve-chrome-focus'
    );

    return;
  }

  clearChromeFocusClasses(doc);
  doc.documentElement.classList.add(next);
}

function hasChromeFocusClass(doc, kind = null) {
  if (kind) {
    return doc.documentElement.classList.contains(chromeFocusClass(kind));
  }

  return (
    doc.documentElement.classList.contains('sve-chrome-focus-header') ||
    doc.documentElement.classList.contains('sve-chrome-focus-footer')
  );
}

function rememberedChromeKind() {
  return chromeFocusKindSticky || chromeFocusKind || (typeof window !== 'undefined' ? window.__sveChromeKind : null);
}

function rememberChromeKind(kind) {
  chromeFocusKind = kind || null;
  chromeFocusKindSticky = kind || null;

  if (typeof window !== 'undefined') {
    window.__sveChromeKind = kind || null;
  }
}

/** Rebind after morph: keep html kind class; only refresh the live element pointer. */
function rebindChromeFocus(win, kind, attempt = 0) {
  const chromeKind = kind === 'footer' ? 'footer' : kind === 'header' ? 'header' : null;

  if (!chromeKind) {
    return;
  }

  rememberChromeKind(chromeKind);

  const doc = win.document;

  // Fade/outline live on <html> — re-assert without removing (no flicker).
  applyChromeFocusClass(doc, chromeKind);

  const again = doc.querySelector(`[${CHROME_ATTR}="${chromeKind}"]`);

  if (!again) {
    if (attempt < 50) {
      setTimeout(() => rebindChromeFocus(win, chromeKind, attempt + 1), 40);
    }

    return;
  }

  if (chromeFocusEl !== again || !again.hasAttribute(CHROME_FOCUS_ATTR)) {
    doc.querySelectorAll(`[${CHROME_FOCUS_ATTR}]`).forEach((el) => {
      if (el !== again) {
        el.removeAttribute(CHROME_FOCUS_ATTR);
      }
    });
    again.setAttribute(CHROME_FOCUS_ATTR, '');
    chromeFocusEl = again;
    chromeFocusKind = chromeKind;
  }

  if (!doc.getElementById(CHROME_BAR_ID)) {
    mountChromeBar(win, chromeKind);
  }
}

/** @deprecated name — soft rebind, never exit/enter. */
function restoreChromeFocus(win, kind, attempt = 0) {
  rebindChromeFocus(win, kind, attempt);
}

function exitChromeFocus(win, closePanel = true) {
  const doc = win.document;
  const wasFocused = !!chromeFocusEl;

  doc.querySelectorAll(`[${CHROME_FOCUS_ATTR}]`).forEach((el) => el.removeAttribute(CHROME_FOCUS_ATTR));
  clearChromeFocusClasses(doc);
  doc.getElementById(CHROME_BAR_ID)?.remove();
  chromeSaveBtn = null;
  chromeStatusEl = null;
  chromeDirty = false;
  chromeFocusEl = null;
  chromeFocusKind = null;

  if (closePanel) {
    chromeFocusKindSticky = null;
    win.__sveChromeKind = null;
  }

  if (wasFocused && closePanel) {
    win.parent.postMessage({ source: 'statamic-visual-editor', type: 'close-chrome' }, win.location.origin);
  }
}

/**
 * Steps into header/footer: fade the rest of the page and open theme settings.
 * `reopen: false` keeps the panel after a morph (same idea as enterGlobalFocus).
 */
function enterChromeFocus(win, el, reopen = true) {
  if (chromeFocusEl === el && hasChromeFocusClass(win.document, el.getAttribute(CHROME_ATTR) || 'header')) {
    if (!win.document.getElementById(CHROME_BAR_ID)) {
      mountChromeBar(win, el.getAttribute(CHROME_ATTR) || 'header');
    }

    return;
  }

  // Can't be in both at once.
  exitGlobalFocus(win, false);
  exitChromeFocus(win, false);

  const doc = win.document;
  const kind = el.getAttribute(CHROME_ATTR) || 'header';

  el.setAttribute(CHROME_FOCUS_ATTR, '');
  applyChromeFocusClass(doc, kind);
  chromeFocusEl = el;
  rememberChromeKind(kind);
  mountChromeBar(win, kind);

  if (reopen) {
    win.parent.postMessage({ source: 'statamic-visual-editor', type: 'open-chrome', kind }, win.location.origin);
  }

  win.parent.postMessage({ source: 'statamic-visual-editor', type: 'sve-chrome-dirty-query' }, win.location.origin);
}

let chromeSaveBtn = null;
let chromeStatusEl = null;
let chromeDirty = false;

function setChromeDirtyUI(dirty) {
  chromeDirty = !!dirty;

  if (chromeSaveBtn) {
    chromeSaveBtn.style.display = chromeDirty ? '' : 'none';
  }

  if (chromeStatusEl) {
    chromeStatusEl.textContent = chromeDirty ? t('chrome_bar_dirty') : t('chrome_bar_clean');
  }
}

function requestCloseChrome(win) {
  win.parent.postMessage({ source: 'statamic-visual-editor', type: 'request-close-chrome' }, win.location.origin);
}

/**
 * Confirm before stepping into header/footer — same “this is global” gate as
 * synced sections, so a stray click doesn’t open Theme Settings by accident.
 */
function confirmEnterChrome(win, el) {
  const kind = el.getAttribute(CHROME_ATTR) === 'footer' ? 'footer' : 'header';
  const chrome = t(kind === 'footer' ? 'chrome_footer' : 'chrome_header');

  showPreviewConfirm(win, {
    title: t('chrome_enter_title', { chrome }),
    body: t('chrome_enter_body', { chrome }),
    confirmLabel: t('chrome_enter_confirm'),
    cancelLabel: t('cancel'),
    onConfirm: () => enterChromeFocus(win, el),
  });
}

function mountChromeBar(win, kind) {
  const doc = win.document;
  const theme = cpDialogTheme(win);

  doc.getElementById(CHROME_BAR_ID)?.remove();

  const bar = doc.createElement('div');

  bar.id = CHROME_BAR_ID;
  bar.style.cssText = sveFocusBarStyle(theme);

  const text = doc.createElement('span');

  text.style.cssText = `font-weight:400;color:${theme.muted};`;
  text.innerHTML = t('chrome_bar', {
    chrome: `<b style="font-weight:700;color:${theme.color};">${t(kind === 'footer' ? 'chrome_footer' : 'chrome_header')}</b>`,
  });

  const status = doc.createElement('span');

  status.style.cssText = `font-weight:400;color:${theme.muted};`;
  status.textContent = chromeDirty ? t('chrome_bar_dirty') : t('chrome_bar_clean');
  chromeStatusEl = status;

  text.appendChild(doc.createTextNode(' '));
  text.appendChild(status);
  bar.appendChild(text);

  const barButton = (label, style) => {
    const btn = doc.createElement('button');

    btn.type = 'button';
    btn.textContent = label;
    btn.style.cssText = style;
    bar.appendChild(btn);

    return btn;
  };

  // Save only when Theme Settings has unsaved edits (CP drives visibility).
  chromeSaveBtn = barButton(t('save'), svePrimaryBtn(theme, { compact: true }));
  chromeSaveBtn.style.display = chromeDirty ? '' : 'none';
  chromeSaveBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    win.parent.postMessage({ source: 'statamic-visual-editor', type: 'save-chrome' }, win.location.origin);
  });

  barButton(t('close'), sveSecondaryBtn(theme, { compact: true })).addEventListener('click', (event) => {
    event.stopPropagation();
    requestCloseChrome(win);
  });

  doc.documentElement.appendChild(bar);
}

// The CP's floating back pill, in our coordinates (see sve-pill-box).
let pillBox = null;

let moveCtrlEl = null;
let moveTargetEl = null;
let moveReposition = null;
// The current control's +/− buttons + the row uid they act on, so the CP's
// row-caps reply can grey out whichever would break the field's min/max.
let moveCtrlRowButtons = null;

// Waiting for a row-caps reply so a toolbar menu can hide Add another / Remove
// when the field's min/max would reject them.
let pendingRowCaps = null;

/** Greys out (or restores) a +/− button, and blocks its click while disabled. */
function setRowButtonDisabled(btn, disabled) {
  if (!btn) {
    return;
  }

  btn.dataset.sveDisabled = disabled ? '1' : '';
  btn.style.opacity = disabled ? '0.3' : '';
  btn.style.cursor = disabled ? 'not-allowed' : 'pointer';

  if (disabled) {
    btn.style.background = 'transparent';
  }
}

/** Applies a row-caps reply from the CP to the current control's buttons. */
function applyRowCaps(data) {
  if (pendingRowCaps && pendingRowCaps.uid === data.uid) {
    const { resolve } = pendingRowCaps;

    pendingRowCaps = null;
    resolve(data);
  }

  if (!moveCtrlRowButtons || moveCtrlRowButtons.uid !== data.uid) {
    return;
  }

  setRowButtonDisabled(moveCtrlRowButtons.addBtn, !data.canAdd);
  setRowButtonDisabled(moveCtrlRowButtons.removeBtn, !data.canRemove);
}

/**
 * Asks the CP whether this row's field can take another / lose this one.
 * Resolves with { canAdd, canRemove }; falls back to allowing both if the
 * reply never arrives (so a hung CP can't trap the menu closed).
 */
function requestRowCaps(win, uid) {
  return new Promise((resolve) => {
    if (pendingRowCaps) {
      pendingRowCaps.resolve({ canAdd: true, canRemove: true });
    }

    const timer = win.setTimeout(() => {
      if (pendingRowCaps?.uid === uid) {
        pendingRowCaps = null;
        resolve({ canAdd: true, canRemove: true });
      }
    }, 400);

    pendingRowCaps = {
      uid,
      resolve: (data) => {
        win.clearTimeout(timer);
        resolve({
          canAdd: data.canAdd !== false,
          canRemove: data.canRemove !== false,
        });
      },
    };

    win.parent.postMessage(
      { source: 'statamic-visual-editor', type: 'row-caps', uid },
      win.location.origin
    );
  });
}

function hideMoveControl(win) {
  if (moveCtrlEl) {
    moveCtrlEl.remove();
    moveCtrlEl = null;
  }

  if (moveReposition) {
    win.removeEventListener('scroll', moveReposition, true);
    win.removeEventListener('resize', moveReposition);
    moveReposition = null;
  }

  moveTargetEl = null;
  moveCtrlRowButtons = null;
}

// Block action bar (hide/dup/delete) placement.
// - 'left-vertical'     → vertical stack on the left (right if no room)  [current]
// - 'above-horizontal'  → horizontal strip just above the field         [previous,
//                         restore this if the left layout feels worse]
const BLOCK_CTRL_LAYOUT = 'above-horizontal';

function positionMoveControl(win) {
  if (!moveCtrlEl || !moveTargetEl || !moveTargetEl.isConnected) {
    return;
  }

  const rect = moveTargetEl.getBoundingClientRect();
  const height = moveCtrlEl.offsetHeight || 32;
  const width = moveCtrlEl.offsetWidth || 32;
  const isSection = moveTargetEl.hasAttribute(SECTION_ORDERABLE_ATTR);
  const gap = 8;
  const margin = 8;

  // Page sections keep the original top-right pin so ↑/↓ stay reachable.
  if (isSection) {
    const left = Math.max(rect.right - width - 10, 10);
    const clash = pillBox && left + width > pillBox.left;
    const min = clash ? pillBox.bottom + 8 : 10;
    const top = Math.min(Math.max(rect.top + 10, min), Math.max(rect.bottom - height - 10, min));

    moveCtrlEl.style.top = `${top}px`;
    moveCtrlEl.style.left = `${left}px`;

    return;
  }

  const layout = moveCtrlEl.dataset.sveLayout || BLOCK_CTRL_LAYOUT;

  // Previous layout — horizontal strip above the field (kept for easy restore).
  if (layout === 'above-horizontal') {
    let top = rect.top - height - gap;

    if (top < margin) {
      top = rect.bottom + gap;
    }

    const left = Math.max(margin, Math.min(rect.left, win.innerWidth - width - margin));

    moveCtrlEl.style.top = `${top}px`;
    moveCtrlEl.style.left = `${left}px`;

    return;
  }

  // left-vertical: prefer left of the item; fall back to the right.
  // Vertically center on the item (not pinned to top/bottom).
  let left = rect.left - width - gap;

  if (left < margin) {
    left = rect.right + gap;

    if (left + width > win.innerWidth - margin) {
      left = Math.max(margin, win.innerWidth - width - margin);
    }
  }

  let top = rect.top + (rect.height - height) / 2;

  if (top + height > win.innerHeight - margin) {
    top = Math.max(margin, win.innerHeight - height - margin);
  }

  if (top < margin) {
    top = margin;
  }

  if (pillBox && left + width > pillBox.left && top < pillBox.bottom + 8) {
    top = Math.max(top, pillBox.bottom + 8);
  }

  moveCtrlEl.style.top = `${top}px`;
  moveCtrlEl.style.left = `${left}px`;
}

/** True when the pointer is in the gap between the control and its target. */
function pointerInMoveControlGap(event) {
  if (!moveCtrlEl || !moveTargetEl) {
    return false;
  }

  if (moveCtrlEl.contains(event.target) || moveTargetEl.contains(event.target)) {
    return true;
  }

  const x = event.clientX;
  const y = event.clientY;
  const cr = moveCtrlEl.getBoundingClientRect();
  const tr = moveTargetEl.getBoundingClientRect();
  const pad = 6;
  const vTop = Math.min(cr.top, tr.top) - pad;
  const vBottom = Math.max(cr.bottom, tr.bottom) + pad;
  const hLeft = Math.min(cr.left, tr.left) - pad;
  const hRight = Math.max(cr.right, tr.right) + pad;

  // Control to the left of the target
  if (cr.right <= tr.left + pad) {
    return x >= cr.right - pad && x <= tr.left + pad && y >= vTop && y <= vBottom;
  }

  // Control to the right of the target
  if (cr.left >= tr.right - pad) {
    return x >= tr.right - pad && x <= cr.left + pad && y >= vTop && y <= vBottom;
  }

  // Control above the target
  if (cr.bottom <= tr.top + pad) {
    return x >= hLeft && x <= hRight && y >= cr.bottom - pad && y <= tr.top + pad;
  }

  // Control below the target
  if (cr.top >= tr.bottom - pad) {
    return x >= hLeft && x <= hRight && y >= tr.bottom - pad && y <= cr.top + pad;
  }

  return false;
}

/** True when el's siblings sit side by side (flex-row, multi-column grid, …). */
function isHorizontalFlow(win, el) {
  const peers = orderablePeers(el);

  if (peers.length >= 2) {
    const a = peerRect(peers[0]);
    const b = peerRect(peers[1]);

    return Math.abs(a.left - b.left) > Math.abs(a.top - b.top);
  }

  const parent = el.parentElement;

  if (!parent) {
    return false;
  }

  const style = win.getComputedStyle(parent);

  if (style.display.includes('flex') && !style.flexDirection.startsWith('column')) {
    return true;
  }

  if (style.display.includes('grid')) {
    const cols = style.gridTemplateColumns;

    return Boolean(cols) && cols !== 'none' && cols.trim().split(/\s+/).length > 1;
  }

  return false;
}

// --- Column builder: visual width drag + add column ------------------------------
//
// Column blocks live in a CSS grid inside a section annotated with
// data-sid-type="columns". Hovering a block shows a resize handle on the
// boundary to its row neighbour; dragging it snaps both blocks to the grid's
// tracks (live, via inline grid-column) and a badge reads out the split.
// Releasing posts the new spans to the CP, which writes the breakpoint's
// col_w_* fields (m <768, t <1024, d otherwise — the same buckets the column
// builder's own width widget uses). A "+" pill in the grid's corner asks the CP
// to click the column builder's own "Add column" button.
//
// The same handle serves a second kind of grid: any container a template opts in
// with `{{ visual_edit grid_view="true" }}`. There the blocks are ordinary
// replicator rows, and what gets written is a span field on the row (per
// breakpoint, if the field is responsive) rather than column-builder classes.
// Two things differ, and only two: what a release writes, and that the tracks
// are drawn while you drag — a column builder row IS the grid, but a hero block
// sits in a grid nobody can see.

const COL_SECTION_SELECTOR = '[data-sid-type="columns"]';

/** `{{ visual_edit grid_view="true" grid="12" }}` on the blocks' container. */
const GRID_ATTR = 'data-sid-grid';
const GRID_FIELD_ATTR = 'data-sid-grid-field';
const GRID_MIN_ATTR = 'data-sid-grid-min';
const GRID_RESIZE_ATTR = 'data-sid-grid-resize';
const GRID_HANDLES_ATTR = 'data-sid-grid-handles';
const GRID_PREVIEW_ATTR = 'data-sid-grid-preview';

let colChrome = null; // { handle, addBtn, pair, grid, mode, lines }
let widthDrag = null;
let widthDragJustEnded = false;

function bpFieldForWidth(width) {
  if (width < 768) {
    return { field: 'col_w_m', prefix: '' };
  }

  if (width < 1024) {
    return { field: 'col_w_t', prefix: 'md:' };
  }

  return { field: 'col_w_d', prefix: 'lg:' };
}

/** Track/gap geometry of a resolved CSS grid, in screen pixels. */
function columnGridInfo(win, grid) {
  const style = win.getComputedStyle(grid);
  const tracks = style.gridTemplateColumns.split(' ').length;
  const gap = parseFloat(style.columnGap) || 0;
  const rect = grid.getBoundingClientRect();
  const padLeft = parseFloat(style.paddingLeft) || 0;
  const padRight = parseFloat(style.paddingRight) || 0;
  const width = rect.width - padLeft - padRight;

  return { tracks, gap, unit: (width + gap) / tracks, left: rect.left + padLeft };
}

function spanOf(el, info) {
  return Math.max(1, Math.round((el.getBoundingClientRect().width + info.gap) / info.unit));
}

function onSameRow(a, b) {
  const ra = a.getBoundingClientRect();
  const rb = b.getBoundingClientRect();

  return rb.top < ra.bottom && rb.bottom > ra.top;
}

function visibleColumnsOf(grid, win) {
  return [...grid.children].filter(
    (el) => el.hasAttribute(SID_ATTR) && win.getComputedStyle(el).display !== 'none' && el.getBoundingClientRect().width > 0
  );
}

/**
 * The block under the pointer, seen from the grid: the child of an opted-in
 * container that the pointer is somewhere inside.
 *
 * Climbing beats `closest('[data-sid]')` here. A hero block holds annotated
 * elements of its own — a headline, an image — and the nearest one of those has
 * a parent that is no grid, so a pointer over the actual content would find
 * nothing to resize. What matters is which of the grid's own children the
 * pointer is in, however deep.
 */
function gridBlockFor(win, event) {
  const target = event.target;
  let node = target?.nodeType === 1 ? target : (target?.parentElement ?? null);

  for (let i = 0; node && i < 20; i++) {
    const parent = node.parentElement;

    if (parent?.hasAttribute(GRID_ATTR) && node.hasAttribute(SID_ATTR)) {
      return { block: node, grid: parent };
    }

    node = parent;
  }

  // The gap between two blocks belongs to the container, not to either block —
  // and it is exactly what the pointer crosses on its way to the handle. Without
  // falling back to the nearest block here, the chrome is taken down the moment
  // you reach for it, and the handle can never be grabbed at all.
  const grid = target?.closest?.(`[${GRID_ATTR}]`);
  const block = grid ? nearestGridChild(grid, win, event) : null;

  return block ? { block, grid } : null;
}

/** The grid child the pointer is in, or — over a gap — the one it is nearest. */
function nearestGridChild(grid, win, event) {
  let best = null;
  let bestDistance = Infinity;

  for (const el of visibleColumnsOf(grid, win)) {
    const rect = el.getBoundingClientRect();
    const dx = Math.max(rect.left - event.clientX, 0, event.clientX - rect.right);
    const dy = Math.max(rect.top - event.clientY, 0, event.clientY - rect.bottom);
    const distance = dx * dx + dy * dy;

    if (distance < bestDistance) {
      bestDistance = distance;
      best = el;
    }
  }

  return best;
}

/**
 * How many columns to write to, the fewest a block may keep, and which of the
 * two ways of resizing this container asked for.
 *
 * `free` — each block owns its width. Drag it wide enough and the row runs out
 * of room, so the next block wraps underneath; you then go and set that one too.
 *
 * `split` — the boundary between two blocks is what moves. What one gains the
 * other gives up, the row stays full, and 50/50 becomes 66/33 in one gesture.
 *
 * Neither is the right answer everywhere, which is why it is the template that
 * says: a hero of two halves wants `split`, a row of cards wants `free`.
 */
function gridConfig(grid) {
  const declared = parseInt(grid.getAttribute(GRID_ATTR) || '', 10);
  const min = parseInt(grid.getAttribute(GRID_MIN_ATTR) || '', 10);

  return {
    columns: Number.isFinite(declared) && declared > 0 ? declared : null,
    field: grid.getAttribute(GRID_FIELD_ATTR) || 'span',
    min: Number.isFinite(min) && min > 0 ? min : 1,
    split: (grid.getAttribute(GRID_RESIZE_ATTR) || 'free') === 'split',
    // `both` — a handle on each edge, and only where dragging can still change
    // something. `right` — one handle on the trailing edge, always.
    handles: (grid.getAttribute(GRID_HANDLES_ATTR) || 'both') === 'right' ? 'right' : 'both',
    // `live` — the block takes its new width as you drag, row breaks and all.
    // `outline` — only an outline follows the pointer, and the layout is left
    // alone until you let go. Steadier to aim with, at the cost of not seeing
    // what the row does until it is done.
    preview: (grid.getAttribute(GRID_PREVIEW_ATTR) || 'live') === 'outline' ? 'outline' : 'live',
  };
}

/**
 * White on a dark section, black on a light one — the same reading the hover
 * outlines take, so the two never disagree about which way the page leans.
 *
 * A fixed colour cannot work here: the tracks lie on whatever background the
 * section happens to have, and any hue picked in advance is invisible against
 * some of them. Plain black and white at low opacity are the two that always
 * have somewhere to go.
 */
function gridTone(win, el) {
  const parsed = parseCssColor(solidBackgroundFor(win, el), win);
  const luminance = parsed ? (0.2126 * parsed.r + 0.7152 * parsed.g + 0.0722 * parsed.b) / 255 : 1;

  // White gets a touch less than black: dark overlays on a light page read
  // heavier than light ones on a dark page at the same alpha. `outline` is the
  // same 30% the hover rings use, so a drag outline and a block edge match.
  return luminance < 0.45
    ? { fill: 'rgba(255,255,255,.03)', outline: 'rgba(255, 255, 255, 0.3)', ambient: 'rgba(255, 255, 255, 0.12)' }
    : { fill: 'rgba(0,0,0,.04)', outline: 'rgba(0, 0, 0, 0.3)', ambient: 'rgba(0, 0, 0, 0.12)' };
}

/**
 * The dashed ring, as an inline background.
 *
 * Same four gradients the stylesheet paints around a hovered block, in the same
 * dash and gap. The drag outline is the same kind of thing — "this is the piece
 * we are talking about" — so it should not be a second visual language.
 */
function dashedRing(colour) {
  const stripe = (deg) =>
    `repeating-linear-gradient(${deg}deg, ${colour} 0 8px, transparent 8px 14px)`;

  return [
    `${stripe(90)} top left / 100% 1px no-repeat`,
    `${stripe(90)} bottom left / 100% 1px no-repeat`,
    `${stripe(180)} top left / 1px 100% no-repeat`,
    `${stripe(180)} top right / 1px 100% no-repeat`,
  ].join(',');
}

/**
 * The always-on outline takes its colour once, on the container.
 *
 * Set there rather than on each block because a custom property inherits: one
 * reading of the section's background answers for every block in it, however
 * many get added later.
 */
function toneOutlineContainer(win, event) {
  const el = event.target?.closest?.('[data-sid-outline]');

  if (!el || el.dataset.sveOutlineToned) {
    return;
  }

  const tone = gridTone(win, el);

  el.dataset.sveOutlineToned = '1';
  el.style.setProperty('--sve-outline-color', tone.outline);
  el.style.setProperty('--sve-outline-ambient', tone.ambient);
}

// The tracks outlive the chrome around them. Moving from one block to the next
// tears the handle down and builds a new one, and lines rebuilt along with it
// would blink at every crossing — so they live here, keyed to their grid, and
// are only really taken down when the pointer leaves for good.
let gridLines = null; // { el, grid, timer }

function removeGridLinesNow() {
  if (!gridLines) {
    return;
  }

  clearTimeout(gridLines.timer);
  gridLines.el.remove();
  gridLines = null;
}

/**
 * How tall the tracks are drawn: the section around the grid, not the grid.
 *
 * The columns only ever came from the grid horizontally — where a track starts
 * and how wide it is. Vertically there is nothing to inherit, so they may as
 * well run the section's full height and read as part of it, instead of
 * stopping short at the padding the blocks happen to sit inside.
 *
 * Deliberately measured rather than fixed by moving the padding onto the blocks:
 * that would change the page itself to suit a ruler that is only on screen while
 * somebody hovers.
 */
function gridLinesBox(grid) {
  const host = grid.parentElement?.closest(`[${SID_ATTR}]`) ?? grid;

  return host.getBoundingClientRect();
}

function positionGridLines() {
  if (!gridLines) {
    return;
  }

  const { el, grid } = gridLines;
  const box = gridLinesBox(grid);
  const info = columnGridInfo(grid.ownerDocument.defaultView, grid);

  el.style.left = `${info.left}px`;
  el.style.top = `${box.top}px`;
  el.style.height = `${box.height}px`;
}

/** Fades out, then goes. `immediate` is for a morph, where the grid it measured is gone. */
function hideGridLines(immediate = false) {
  if (!gridLines) {
    return;
  }

  if (immediate) {
    removeGridLinesNow();

    return;
  }

  if (gridLines.timer) {
    return; // already on its way out
  }

  const { el } = gridLines;

  el.style.opacity = '0';
  gridLines.timer = setTimeout(() => {
    if (gridLines?.el === el) {
      removeGridLinesNow();
    }
  }, 220);
}

/**
 * The tracks, drawn over the grid.
 *
 * Measured from the resolved grid rather than from the declared column count, so
 * the lines land on the boundaries the browser actually used — gap, padding and
 * a scaled preview included. Faint on purpose: this is a ruler held up against
 * the page, not part of it.
 *
 * Calling it again for the same grid is how a fade already under way is called
 * back — which is what makes crossing from one block to another look like
 * nothing happened at all.
 */
function showGridLines(win, grid, info) {
  if (gridLines && gridLines.grid === grid) {
    clearTimeout(gridLines.timer);
    gridLines.timer = null;
    gridLines.el.style.opacity = '1';
    positionGridLines();

    return;
  }

  removeGridLinesNow();

  const doc = win.document;
  const rect = gridLinesBox(grid);
  const tone = gridTone(win, grid);
  const box = doc.createElement('div');

  box.style.cssText =
    `position:fixed;z-index:2147483644;pointer-events:none;opacity:0;transition:opacity .14s ease;` +
    `left:${info.left}px;top:${rect.top}px;` +
    `width:${info.unit * info.tracks - info.gap}px;height:${rect.height}px;`;

  for (let i = 0; i < info.tracks; i++) {
    const track = doc.createElement('div');

    track.style.cssText =
      `position:absolute;top:0;bottom:0;left:${i * info.unit}px;width:${info.unit - info.gap}px;` +
      `background:${tone.fill};`;
    box.appendChild(track);
  }

  doc.documentElement.appendChild(box);
  gridLines = { el: box, grid, timer: null };

  // Next frame: a transition needs a value to move away from, and one set in the
  // same frame as the element is inserted has nothing to move away from.
  win.requestAnimationFrame(() => {
    if (gridLines?.el === box) {
      box.style.opacity = '1';
    }
  });
}

function hideColumnChrome(win) {
  hideGridLines();

  if (!colChrome) {
    return;
  }

  colChrome.handles.forEach(({ el }) => el.remove());
  colChrome.addBtn?.remove();
  colChrome.grid?.removeAttribute('data-sid-outline-on');
  win.removeEventListener('scroll', colChrome.onScroll, true);
  colChrome = null;
}

function positionColumnChrome() {
  if (!colChrome) {
    return;
  }

  const { handles, addBtn, grid, block } = colChrome;

  positionGridLines();

  for (const { el, side, pair } of handles) {
    let x;
    let top;
    let bottom;

    if (pair) {
      const ra = pair.a.getBoundingClientRect();
      const rb = pair.b.getBoundingClientRect();

      x = (ra.right + rb.left) / 2;
      top = Math.max(ra.top, rb.top);
      bottom = Math.min(ra.bottom, rb.bottom);
    } else {
      // A block owns its own width, so its handle sits on its own edge — not on
      // a boundary shared with a neighbour. Dragging it takes nothing from
      // anyone; the row simply runs out of room and the next block wraps.
      const rect = block.getBoundingClientRect();

      x = side === 'left' ? rect.left : rect.right;
      top = rect.top;
      bottom = rect.bottom;
    }

    // Centred on its own box, so a handle with a bigger grab area than its bar
    // still sits exactly on the edge.
    el.style.left = `${x - el.offsetWidth / 2}px`;
    el.style.top = `${(top + bottom) / 2 - el.offsetHeight / 2}px`;
  }

  if (addBtn) {
    const rect = grid.getBoundingClientRect();

    addBtn.style.left = `${rect.right - 40}px`;
    addBtn.style.top = `${rect.bottom - 40}px`;
  }
}

/**
 * Hovering a column block summons its chrome: the resize handle on the boundary
 * to its row neighbour (right one preferred) and the add-column pill.
 */
function maybeShowColumnChrome(win, event) {
  if (widthDrag) {
    return;
  }

  if (
    colChrome &&
    (colChrome.handles.some(({ el }) => el.contains(event.target)) || colChrome.addBtn?.contains(event.target))
  ) {
    return;
  }

  // Two ways to be a resizable block, asked in order of how specific they are:
  // a child of a container that opted in with grid_view, or a column-builder
  // column. The first is looked up by climbing, because the pointer is usually
  // over the block's contents rather than the block itself.
  const spanned = gridBlockFor(win, event);
  const block = spanned?.block ?? event.target.closest?.(`[${SID_ATTR}]`);
  const grid = spanned?.grid ?? block?.parentElement;
  const mode = spanned ? 'span' : block?.closest(COL_SECTION_SELECTOR) ? 'columns' : null;

  if (!block || !mode || !grid || win.getComputedStyle(grid).display !== 'grid') {
    hideColumnChrome(win);

    return;
  }

  const config = mode === 'span' ? gridConfig(grid) : null;

  // VISUAL order, not DOM order: per-breakpoint `order` CSS (order_m/t/d) can
  // render the DOM's first column on the right. Neighbours are read left to
  // right off the screen, so the drag math and the written uids follow what the
  // user actually sees.
  const rowMates = visibleColumnsOf(grid, win)
    .filter((el) => el === block || onSameRow(block, el))
    .sort((x, y) => x.getBoundingClientRect().left - y.getBoundingClientRect().left);
  const index = rowMates.indexOf(block);

  if (index === -1) {
    hideColumnChrome(win);

    return;
  }

  const next = rowMates[index + 1] ?? null;
  const prev = rowMates[index - 1] ?? null;

  // Which edges are worth offering. An edge already flush against the grid has
  // nowhere left to grow, so its handle is dropped — but only as long as the
  // other one survives. A block filling the whole row is flush on both sides,
  // and dropping both would leave it with no way back: it could never be made
  // narrower again. Stranding beats tidiness, so in that case both stay.
  const sides = [];

  if (mode === 'span' && config.handles === 'both') {
    const info = columnGridInfo(win, grid);
    const rect = block.getBoundingClientRect();

    if (rect.left > info.left + 2) {
      sides.push('left');
    }

    if (rect.right < info.left + info.unit * info.tracks - info.gap - 2) {
      sides.push('right');
    }

    if (sides.length === 0) {
      sides.push('left', 'right');
    }
  } else {
    sides.push('right');
  }

  // `split` borrows the column builder's pairing wholesale: same boundary, same
  // give-and-take. Only what gets written at the end differs.
  const pairFor = (side) => {
    if (mode !== 'columns' && !config?.split) {
      return null;
    }

    if (side === 'left') {
      return prev ? { a: prev, b: block } : null;
    }

    return next ? { a: block, b: next } : prev ? { a: prev, b: block } : null;
  };

  const wanted = sides.map((side) => ({ side, pair: pairFor(side) }));

  // Column builder: a lone column has no boundary to drag, so it gets nothing.
  const live = mode === 'columns' ? wanted.filter((w) => w.pair) : wanted;

  if (
    colChrome &&
    colChrome.grid === grid &&
    colChrome.mode === mode &&
    colChrome.block === block &&
    colChrome.handles.length === live.length &&
    colChrome.handles.every((h, i) => h.side === live[i].side && h.pair?.a === live[i].pair?.a && h.pair?.b === live[i].pair?.b)
  ) {
    return; // already showing exactly this
  }

  hideColumnChrome(win);

  const doc = win.document;
  const handles = live.map(({ side, pair }) => {
    const el = doc.createElement('div');

    el.style.cssText =
      'position:fixed;z-index:2147483646;width:10px;height:48px;border-radius:6px;' +
      'background:#1f2937;box-shadow:0 2px 10px rgba(0,0,0,.35),inset 0 0 0 1px rgba(255,255,255,.18);' +
      'cursor:col-resize;touch-action:none;';
    el.title = t('drag_columns');

    // A hero's blocks sit far apart, and 10px of grab area in the middle of all
    // that space is a target you aim at rather than reach for. The bar keeps its
    // size; what grows is the invisible box around it.
    if (mode === 'span') {
      const bar = doc.createElement('div');

      bar.style.cssText =
        'width:10px;height:48px;border-radius:6px;pointer-events:none;' +
        'background:#1f2937;box-shadow:0 2px 10px rgba(0,0,0,.35),inset 0 0 0 1px rgba(255,255,255,.18);';
      el.style.cssText =
        'position:fixed;z-index:2147483646;width:28px;height:64px;background:transparent;' +
        'display:flex;align-items:center;justify-content:center;cursor:col-resize;touch-action:none;';
      el.appendChild(bar);
    }

    el.addEventListener('pointerdown', (e) => {
      if (e.button !== 0 || widthDrag) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();
      beginWidthDrag(win, pair ?? { a: block, b: null }, grid, mode, e.clientX, side, el);
    });

    // The tracks belong to the handle, not to the section: they answer "where
    // can this land", which is only a question once you have reached for it.
    // A column builder block draws its own edges and has never needed them.
    if (mode === 'span') {
      el.addEventListener('pointerenter', () => showGridLines(win, grid, columnGridInfo(win, grid)));
      el.addEventListener('pointerleave', () => {
        if (!widthDrag) {
          hideGridLines();
        }
      });
    }

    doc.documentElement.appendChild(el);

    return { el, side, pair };
  });

  let addBtn = null;

  if (mode === 'columns') {
    const section = block.closest(COL_SECTION_SELECTOR);

    addBtn = doc.createElement('button');
    addBtn.type = 'button';
    addBtn.textContent = '+';
    addBtn.title = t('add_column');
    addBtn.style.cssText =
      'position:fixed;z-index:2147483646;width:28px;height:28px;border:none;border-radius:50%;' +
      'background:#1f2937;color:#fff;font-size:18px;line-height:1;cursor:pointer;' +
      'box-shadow:0 2px 10px rgba(0,0,0,.35);display:inline-flex;align-items:center;justify-content:center;';
    addBtn.addEventListener('pointerdown', (e) => e.stopPropagation());
    addBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      win.parent.postMessage(
        { source: 'statamic-visual-editor', type: 'cb-add-column', uid: section?.getAttribute(SID_ATTR) },
        win.location.origin
      );
    });
    doc.documentElement.appendChild(addBtn);
  }

  // The handle lives outside the container, so reaching for it ends the
  // container's :hover and would take every block's edge down with it — right
  // when you need to see what you are about to resize. The chrome's own lifetime
  // is the honest answer to "is this section being worked on", so it carries the
  // rings: raised here, dropped in hideColumnChrome, and untouched for as long
  // as the pointer is on a handle or a drag is running.
  if (mode === 'span') {
    grid.setAttribute('data-sid-outline-on', '');
  }

  colChrome = { handles, addBtn, block, grid, mode, onScroll: () => positionColumnChrome() };
  win.addEventListener('scroll', colChrome.onScroll, true);
  positionColumnChrome();
}

/**
 * Where the outline sits for a given span, in screen pixels.
 *
 * Anchored on the edge you did NOT grab, so the outline grows the way your hand
 * moves. That the block itself may end up somewhere else entirely — wrapped onto
 * the next row — is the trade this mode makes: a steady thing to aim at while
 * dragging, and the truth on release.
 */
function updateDragGhost(span) {
  const { ghost, handleEl, info, side, anchorLeft, anchorRight, blockTop, blockHeight } = widthDrag;
  const width = Math.max(0, span * info.unit - info.gap);
  const left = side === 'left' ? anchorRight - width : anchorLeft;

  // Sat 6px outside the columns it stands for, which is where a block's own ring
  // sits. Drawn flush instead, the same width would look a hair narrower than
  // the block it is about to become.
  ghost.style.left = `${left - 6}px`;
  ghost.style.top = `${blockTop - 6}px`;
  ghost.style.width = `${width + 12}px`;
  ghost.style.height = `${blockHeight + 12}px`;

  // The handle travels with the outline's dragged edge, so what you are holding
  // and what you are aiming stay the same thing.
  if (handleEl) {
    const edge = side === 'left' ? left : left + width;

    handleEl.style.left = `${edge - handleEl.offsetWidth / 2}px`;
  }
}

function beginWidthDrag(win, pair, grid, mode = 'columns', startX = 0, side = 'right', handleEl = null) {
  const info = columnGridInfo(win, grid);
  const spanA = spanOf(pair.a, info);
  const spanB = pair.b ? spanOf(pair.b, info) : 0;
  const config = mode === 'span' ? gridConfig(grid) : { field: null, min: 1, preview: 'live' };
  const rectA = pair.a.getBoundingClientRect();

  // Only a block resized on its own gets the outline. A paired drag is about the
  // boundary between two blocks, and one of the two standing still while the
  // other is outlined says nothing useful.
  let ghost = null;

  if (config.preview === 'outline' && !pair.b) {
    const tone = gridTone(win, grid);

    ghost = win.document.createElement('div');
    ghost.style.cssText =
      'position:fixed;z-index:2147483645;pointer-events:none;border-radius:4px;' +
      `background:${dashedRing(tone.outline)};`;
    win.document.documentElement.appendChild(ghost);
  }

  const badge = win.document.createElement('div');

  badge.style.cssText =
    'position:fixed;z-index:2147483647;pointer-events:none;padding:5px 10px;border-radius:6px;' +
    'background:#1f2937;color:#fff;font:600 12px/1 ui-sans-serif,system-ui,sans-serif;' +
    'box-shadow:0 4px 16px rgba(0,0,0,.35);white-space:nowrap;';
  win.document.documentElement.appendChild(badge);

  // The tracks are already up if the chrome is; a drag started any other way
  // still gets to see them.
  if (mode === 'span') {
    showGridLines(win, grid, info);
  }

  widthDrag = {
    ...pair,
    grid,
    info,
    mode,
    field: config.field,
    // Resized on its own, a block may go as narrow as the grid allows and as
    // wide as the whole row. Paired, it has to leave the other half room to
    // exist — its ceiling is what the two of them share.
    min: mode === 'span' ? Math.min(config.min, info.tracks) : 1,
    max: pair.b
      ? spanA + spanB - (mode === 'span' ? Math.min(config.min, info.tracks) : 1)
      : Math.min(info.tracks, config.columns ?? info.tracks),
    total: spanA + spanB,
    spanA,
    applied: spanA,
    aLeft: rectA.left,
    startX,
    // Grabbed on the left, the block gets wider as the pointer goes left.
    // Both edges write the same number; the side only says which way is bigger.
    sign: side === 'left' ? -1 : 1,
    side,
    ghost,
    handleEl,
    anchorLeft: rectA.left,
    anchorRight: rectA.right,
    blockTop: rectA.top,
    blockHeight: rectA.height,
    badge,
  };

  if (ghost) {
    updateDragGhost(spanA);
  }

  win.document.documentElement.classList.add('sve-col-resizing');
}

function updateWidthDrag(win, event) {
  const { a, b, info, total, aLeft, badge, min, max, spanA, startX, sign } = widthDrag;

  event.preventDefault();

  // Paired, the pointer IS the boundary, so the width is read off its position.
  // Alone, it is read as a distance travelled instead: a block that outgrows its
  // row wraps mid-drag and its left edge moves out from under the pointer — as a
  // position, the width would jump the moment the row broke.
  let next = b
    ? Math.round((event.clientX - aLeft + info.gap / 2) / info.unit)
    : spanA + sign * Math.round((event.clientX - startX) / info.unit);

  next = Math.max(min, Math.min(max, next));

  if (next !== widthDrag.applied) {
    widthDrag.applied = next;

    if (widthDrag.ghost) {
      // The layout is left alone until release; only the outline moves.
      updateDragGhost(next);
    } else {
      // Inline styles for instant feedback — they also don't depend on every
      // col-span-* class being present in the site's compiled CSS. The morph
      // after the CP write replaces them with the real classes.
      a.style.gridColumn = `span ${next} / span ${next}`;

      if (b) {
        b.style.gridColumn = `span ${total - next} / span ${total - next}`;
      }

      positionColumnChrome();
    }
  }

  const pct = (n) => `${Math.round((n / info.tracks) * 100)}%`;
  const applied = widthDrag.applied;

  badge.textContent = b
    ? `${applied}/${info.tracks} · ${pct(applied)}  |  ${total - applied}/${info.tracks} · ${pct(total - applied)}`
    : `${applied}/${info.tracks} · ${pct(applied)}`;
  badge.style.left = `${event.clientX + 14}px`;
  badge.style.top = `${event.clientY + 16}px`;
}

function finishWidthDrag(win, cancelled) {
  const { a, b, total, spanA, applied, badge, mode, field, ghost } = widthDrag;

  badge.remove();
  ghost?.remove();
  win.document.documentElement.classList.remove('sve-col-resizing');
  widthDrag = null;

  // Outlined drags have left the layout untouched so far. This is the jump the
  // mode trades for: the block takes its width now, in one move, and the write
  // that follows only confirms what is already on screen.
  if (ghost && !cancelled && applied !== spanA) {
    a.style.gridColumn = `span ${applied} / span ${applied}`;
  }

  positionColumnChrome();

  // Let go still holding the handle and the tracks stay — no pointerenter is
  // coming to bring them back, and blinking them out under a pointer that never
  // moved would read as something breaking.
  if (!colChrome?.handles.some(({ el }) => el.matches(':hover'))) {
    hideGridLines();
  }

  widthDragJustEnded = true;
  setTimeout(() => (widthDragJustEnded = false), 250);

  if (cancelled || applied === spanA) {
    a.style.gridColumn = '';

    if (b) {
      b.style.gridColumn = '';
    }

    return;
  }

  // Written once, on release. Every write re-renders the page builder in the CP,
  // and one landing mid-request leaves a promise unsettled — which is a spinner
  // that never stops. During the drag the inline grid-column is the whole story.
  if (mode === 'span') {
    const changes = [{ uid: a.getAttribute(SID_ATTR), span: applied }];

    if (b) {
      changes.push({ uid: b.getAttribute(SID_ATTR), span: total - applied });
    }

    win.parent.postMessage(
      { source: 'statamic-visual-editor', type: 'sve-grid-span', field, changes },
      win.location.origin
    );

    return;
  }

  const bp = bpFieldForWidth(win.innerWidth);
  const value = (n) => `${bp.prefix}col-span-${n}`;

  // The inline styles stay on until the CP write comes back through the morph —
  // removing them now would snap the columns back for a beat.
  win.parent.postMessage(
    {
      source: 'statamic-visual-editor',
      type: 'cb-col-width',
      changes: [
        { uid: a.getAttribute(SID_ATTR), field: bp.field, value: value(applied) },
        { uid: b.getAttribute(SID_ATTR), field: bp.field, value: value(total - applied) },
      ],
    },
    win.location.origin
  );
}

// --- Drag & drop reordering ([data-sid-orderable]) -------------------------------
//
// Rows opted in via orderable="true" can be dragged among their sibling rows
// (grid/replicator items rendered in a loop). A pointer-based drag with a
// threshold keeps clicks working: below the threshold the pointerdown is a
// normal click (inline edit, focus); beyond it a drag starts, the row dims, a
// dashed slot marks the landing place (same language as the hover rings; a
// section drag still uses the thin insertion line), and releasing posts the
// target index to the CP, which reorders the underlying values array (same
// machinery as the move arrows). The morphed re-render then shows the new order.

const ORDERABLE_ATTR = 'data-sid-orderable';
const DRAG_THRESHOLD = 6; // px of movement before a press becomes a drag

let dragState = null;
let dragJustEnded = false; // one-shot: swallow the click that follows a drag

function orderablePeers(el) {
  if (!el.parentElement) {
    return [];
  }

  const siblings = [...el.parentElement.children].filter((c) => c.hasAttribute(ORDERABLE_ATTR));

  if (siblings.length > 1) {
    return siblings;
  }

  // A block standing alone among its DOM siblings may still have peers: a
  // template is free to wrap each row in markup of its own, and then no two rows
  // share a parent. What they do share is the replicator container, so ask that
  // — counting only rows it owns directly, so a nested replicator's rows are not
  // mistaken for this one's.
  const container = el.closest(`[${INSERT_ATTR}]`);

  if (!container) {
    return siblings;
  }

  const owned = [...container.querySelectorAll(`[${ORDERABLE_ATTR}]`)].filter((row) => {
    if (row.parentElement?.closest(`[${INSERT_ATTR}]`) !== container) {
      return false;
    }

    // Not a row nested inside another row: a wrapped block declares orderable
    // twice over, and counting both would double the list.
    const outer = row.parentElement?.closest(`[${ORDERABLE_ATTR}]`);

    return !outer || !container.contains(outer);
  });

  return owned.length > 1 ? owned : siblings;
}

/** Nearest solid background up the ancestor chain — the ghost card uses it so
 *  the row's own text keeps its contrast (white cards would swallow light text
 *  on dark sections). */
function solidBackgroundFor(win, el) {
  let node = el;

  for (let i = 0; node && i < 15; i++) {
    const colour = win.getComputedStyle(node).backgroundColor;

    if (
      colour &&
      colour !== 'transparent' &&
      !/rgba\(\s*0,\s*0,\s*0,\s*0\s*\)/.test(colour) &&
      parseCssColor(colour, win)
    ) {
      return colour;
    }

    node = node.parentElement;
  }

  return '#ffffff';
}

/** Parse hex, rgb/rgba (comma or space), color(srgb …), or any CSS colour via canvas. */
function parseCssColor(colour, win) {
  if (!colour || typeof colour !== 'string') {
    return null;
  }

  const value = colour.trim();
  const hex = value.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);

  if (hex) {
    let h = hex[1];

    if (h.length === 3) {
      h = h.split('').map((c) => c + c).join('');
    }

    return {
      r: parseInt(h.slice(0, 2), 16),
      g: parseInt(h.slice(2, 4), 16),
      b: parseInt(h.slice(4, 6), 16),
    };
  }

  const rgbComma = value.match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/i);

  if (rgbComma) {
    return { r: Number(rgbComma[1]), g: Number(rgbComma[2]), b: Number(rgbComma[3]) };
  }

  const rgbSpace = value.match(/rgba?\(\s*([\d.]+)(%?)\s+([\d.]+)(%?)\s+([\d.]+)(%?)/i);

  if (rgbSpace) {
    const channel = (n, pct) => (pct ? (Number(n) / 100) * 255 : Number(n));

    return {
      r: channel(rgbSpace[1], rgbSpace[2]),
      g: channel(rgbSpace[3], rgbSpace[4]),
      b: channel(rgbSpace[5], rgbSpace[6]),
    };
  }

  const srgb = value.match(/color\(\s*srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)/i);

  if (srgb) {
    return {
      r: Number(srgb[1]) * 255,
      g: Number(srgb[2]) * 255,
      b: Number(srgb[3]) * 255,
    };
  }

  return parseCssColorViaCanvas(value, win);
}

function parseCssColorViaCanvas(colour, win) {
  if (!win?.document) {
    return null;
  }

  try {
    const canvas = win.document.createElement('canvas');

    canvas.width = 1;
    canvas.height = 1;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    if (!ctx) {
      return null;
    }

    ctx.fillStyle = colour;
    ctx.fillRect(0, 0, 1, 1);

    const d = ctx.getImageData(0, 0, 1, 1).data;

    return { r: d[0], g: d[1], b: d[2] };
  } catch {
    return null;
  }
}

/**
 * Outline that contrasts with the element's background: black @ 30% on light,
 * white @ 30% on dark. Applied as a local --sve-outline-color on the element.
 */
function applyOutlineTone(win, el) {
  if (!el) {
    return;
  }

  const parsed = parseCssColor(solidBackgroundFor(win, el), win);
  const luminance = parsed
    ? (0.2126 * parsed.r + 0.7152 * parsed.g + 0.0722 * parsed.b) / 255
    : 1;
  const color = luminance < 0.45 ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)';

  el.style.setProperty('--sve-outline-color', color);

  // ::before dash ring needs a positioning context; don't override absolute/fixed.
  if (win.getComputedStyle(el).position === 'static') {
    el.style.position = 'relative';
  }
}

/**
 * The ghost lives on <html>, outside the section's @scope / #id / contrast
 * colour. Copy the live computed paint so white text stays white, dark text
 * stays dark, and icons keep their fill — then one opacity on the card fades
 * the whole thing together.
 */
function copyLiveAppearance(win, source, dest) {
  const paint = (from, to) => {
    const cs = win.getComputedStyle(from);

    to.style.color = cs.color;
    to.style.webkitTextFillColor = cs.webkitTextFillColor;

    if (cs.backgroundColor && cs.backgroundColor !== 'transparent' && !/rgba\(\s*0,\s*0,\s*0,\s*0\s*\)/.test(cs.backgroundColor)) {
      to.style.backgroundColor = cs.backgroundColor;
    }

    if (cs.fill && cs.fill !== 'none') {
      to.style.fill = cs.fill;
    }

    if (cs.stroke && cs.stroke !== 'none') {
      to.style.stroke = cs.stroke;
    }
  };

  paint(source, dest);

  const fromKids = source.querySelectorAll('*');
  const toKids = dest.querySelectorAll('*');

  fromKids.forEach((node, i) => {
    if (toKids[i]) {
      paint(node, toKids[i]);
    }
  });
}

/**
 * A floating preview card of the dragged row (Sanity-style): a stripped clone
 * in a shadowed, slightly scaled card that rides along with the pointer.
 */
function buildDragGhost(win, el) {
  const doc = win.document;
  const rect = el.getBoundingClientRect();
  const ghost = doc.createElement('div');
  const clone = el.cloneNode(true);

  // The clone is decoration only — strip editor annotations so bridge queries
  // and outline styles never mistake it for content. `id` attributes stay:
  // sections are styled through #id-… selectors (style_push), and stripping
  // them would leave the ghost unstyled. The original element precedes the
  // ghost in tree order, so id lookups still resolve to the real one.
  [clone, ...clone.querySelectorAll('*')].forEach((node) => {
    [...node.attributes].forEach((attr) => {
      if (attr.name.startsWith('data-sid')) {
        node.removeAttribute(attr.name);
      }
    });
  });
  clone.style.margin = '0';
  copyLiveAppearance(win, el, clone);

  const live = win.getComputedStyle(el);

  ghost.setAttribute('data-sve-ghost', '');
  ghost.appendChild(clone);
  ghost.style.cssText =
    'position:fixed;left:0;top:0;z-index:2147483647;pointer-events:none;box-sizing:border-box;' +
    `width:${Math.ceil(rect.width)}px;padding:10px 14px;border-radius:10px;overflow:hidden;` +
    `background:${solidBackgroundFor(win, el)};color:${live.color};` +
    'box-shadow:0 12px 32px rgba(0,0,0,.28),0 0 0 1px rgba(0,0,0,.06);' +
    'opacity:.8;transform-origin:top left;will-change:transform;';
  // On <html>, not <body>: a section drag scales <body> down for the overview,
  // and a transformed ancestor both captures and scales position:fixed children.
  doc.documentElement.appendChild(ghost);

  // Scale wide rows down to a hand-sized card.
  return { ghost, scale: Math.min(1, 300 / Math.max(rect.width, 1)) };
}

function moveDragGhost(state, x, y) {
  if (state.ghost) {
    state.ghost.style.transform = `translate(${x + 14}px, ${y + 12}px) scale(${state.ghostScale}) rotate(1.5deg)`;
  }
}

/**
 * Section drags zoom the whole page out (Sanity-style) so its full structure is
 * on screen and "drag the hero to the bottom" is one small movement instead of
 * a scroll marathon. Scaling <body> is purely visual — layout, rects and the
 * pointer math all keep working in screen space. Returns what restoreZoom needs,
 * or null when the page already fits the viewport.
 */
function zoomOutForDrag(win) {
  const doc = win.document;
  const body = doc.body;
  const scale = (win.innerHeight - 32) / doc.documentElement.scrollHeight;

  if (scale >= 0.999) {
    return null;
  }

  const previous = {
    scroll: win.scrollY,
    transform: body.style.transform,
    origin: body.style.transformOrigin,
    transition: body.style.transition,
  };

  body.style.transformOrigin = 'top center';
  body.style.transition = 'transform .35s ease';
  win.scrollTo(0, 0);
  // Next frame, so the transition property is committed before the transform
  // changes — otherwise the zoom snaps instead of animating.
  win.requestAnimationFrame(() => {
    body.style.transform = `scale(${Math.max(scale, 0.02)})`;
  });

  return previous;
}

function restoreZoom(win, previous) {
  if (!previous) {
    return;
  }

  const body = win.document.body;

  body.style.transform = previous.transform;

  win.setTimeout(() => {
    body.style.transformOrigin = previous.origin;
    body.style.transition = previous.transition;
    win.scrollTo(0, previous.scroll);
  }, 380);
}

function endDrag(win) {
  if (!dragState) {
    return;
  }

  dragState.el.style.opacity = '';
  dragState.indicator?.remove();
  dragState.ghost?.remove();
  restoreZoom(win, dragState.zoom);
  win.document.documentElement.classList.remove('sve-dragging');
  dragState = null;
}

/** Outline that reads on the row's own background — the global focus colour
 *  is a light-page grey and disappears on a dark section. */
function dropMarkerColor(win, el) {
  const parsed = parseCssColor(solidBackgroundFor(win, el), win);
  const luminance = parsed
    ? (0.2126 * parsed.r + 0.7152 * parsed.g + 0.0722 * parsed.b) / 255
    : 1;

  return luminance < 0.45 ? '#ffffff' : '#000000';
}

function createDropIndicator(win, section) {
  const indicator = win.document.createElement('div');

  indicator.setAttribute('data-sve-drop-slot', section ? 'line' : 'box');
  // On <html> — see buildDragGhost for why not <body>.
  win.document.documentElement.appendChild(indicator);

  return indicator;
}

function paintDropIndicator(state) {
  const { peers, horizontal, indicator, insert, section } = state;

  if (!indicator || insert === null) {
    return;
  }

  const after = insert > peers.length - 1;
  const target = after
    ? peers[peers.length - 1]
    : peers[Math.min(insert === 0 ? 0 : insert, peers.length - 1)];
  const rect = peerRect(target);

  if (section) {
    if (horizontal) {
      indicator.style.left = `${after ? rect.right + 2 : rect.left - 4}px`;
      indicator.style.top = `${rect.top}px`;
      indicator.style.width = '3px';
      indicator.style.height = `${rect.height}px`;
    } else {
      indicator.style.left = `${rect.left}px`;
      indicator.style.top = `${after ? rect.bottom + 2 : rect.top - 4}px`;
      indicator.style.width = `${rect.width}px`;
      indicator.style.height = '3px';
    }

    return;
  }

  const pad = 10;

  indicator.style.width = `${Math.max(rect.width, 24) + pad * 2}px`;
  indicator.style.height = `${Math.max(rect.height, 24) + pad * 2}px`;

  if (horizontal) {
    indicator.style.top = `${rect.top - pad}px`;
    indicator.style.left = `${(after ? rect.right + 6 : rect.left) - pad}px`;
  } else {
    indicator.style.left = `${rect.left - pad}px`;
    indicator.style.top = `${(after ? rect.bottom + 6 : rect.top) - pad}px`;
  }
}

function createDragPointerDown(win) {
  return function onPointerDown(event) {
    if (event.button !== 0 || editing || dragState) {
      return;
    }

    const el = event.target.closest(`[${ORDERABLE_ATTR}]`);

    if (!el) {
      return;
    }

    const uid = el.getAttribute(SID_ATTR) || el.getAttribute('data-sid-field-uid');
    const peers = orderablePeers(el);

    if (!uid || peers.length <= 1) {
      return;
    }

    // Nothing is prevented here — a press that never crosses the threshold
    // must stay a perfectly normal click.
    dragState = {
      el,
      uid,
      peers,
      horizontal: isHorizontalFlow(win, el),
      section: false,
      zoom: null,
      startX: event.clientX,
      startY: event.clientY,
      fromIndex: peers.indexOf(el),
      insert: null,
      active: false,
      indicator: null,
      ghost: null,
    };
  };
}

function createDragPointerMove(win) {
  return function onPointerMove(event) {
    if (widthDrag) {
      updateWidthDrag(win, event);

      return;
    }

    if (!dragState) {
      return;
    }

    if (!dragState.active) {
      const moved = Math.hypot(event.clientX - dragState.startX, event.clientY - dragState.startY);

      if (moved < DRAG_THRESHOLD) {
        return;
      }

      dragState.active = true;
      dragState.el.style.opacity = '0.45';
      win.document.documentElement.classList.add('sve-dragging');
      hideMoveControl(win);

      const indicator = createDropIndicator(win, dragState.section);

      indicator.style.setProperty('--sve-drop-color', dropMarkerColor(win, dragState.el));
      dragState.indicator = indicator;

      // Ghost first (it measures the element at natural size), then the zoom.
      const { ghost, scale } = buildDragGhost(win, dragState.el);

      dragState.ghost = ghost;
      dragState.ghostScale = scale;

      if (dragState.section) {
        dragState.zoom = zoomOutForDrag(win);
      }
    }

    event.preventDefault();
    moveDragGhost(dragState, event.clientX, event.clientY);

    const { peers, horizontal } = dragState;
    const pos = horizontal ? event.clientX : event.clientY;

    // Insertion slot = number of peers whose midpoint the pointer has passed.
    let insert = 0;

    peers.forEach((peer, i) => {
      const rect = peerRect(peer);
      const mid = horizontal ? (rect.left + rect.right) / 2 : (rect.top + rect.bottom) / 2;

      if (pos > mid) {
        insert = i + 1;
      }
    });

    dragState.insert = insert;
    paintDropIndicator(dragState);
  };
}

function createDragPointerUp(win) {
  return function onPointerUp() {
    if (widthDrag) {
      finishWidthDrag(win, false);

      return;
    }

    if (!dragState) {
      return;
    }

    const { active, uid, fromIndex, insert } = dragState;

    endDrag(win);

    if (!active) {
      return; // plain click — let it proceed untouched
    }

    // The click event that follows this pointerup must not start an inline
    // edit or focus jump — the user was dragging, not clicking.
    dragJustEnded = true;
    setTimeout(() => (dragJustEnded = false), 250);

    if (insert === null) {
      return;
    }

    // Slot → target index in after-removal terms.
    const to = insert > fromIndex ? insert - 1 : insert;

    if (to === fromIndex) {
      return;
    }

    win.parent.postMessage(
      { source: 'statamic-visual-editor', type: 'move', uid, toIndex: to },
      win.location.origin
    );
  };
}

function showMoveControl(win, moveEl) {
  if (moveTargetEl === moveEl) {
    return;
  }

  hideMoveControl(win);

  // Sections carry data-sid; field-annotated rows (e.g. buttons) identify
  // their row through the field scope uid instead. A global section is the odd
  // one out: its markup is the SOURCE entry's, so its data-sid belongs to another
  // entry entirely — the page's own row id is what this form can act on.
  const uid =
    moveEl.getAttribute(GLOBAL_ROW_ATTR) ||
    moveEl.getAttribute(SID_ATTR) ||
    moveEl.getAttribute('data-sid-field-uid');

  if (!uid) {
    return;
  }

  // A single row/section has nowhere to move — no arrows. Peers are sibling
  // elements of the same kind: orderable rows, move-annotated rows, or other
  // page sections (opted in via section-orderable="true" — any HTML tag).
  // A global section counts as a section on this page like any other. What sits
  // among the page's sections is its display:contents wrapper, so that wrapper
  // is a peer too — otherwise a page with one normal and one global section
  // looks like it has only one, and neither gets arrows.
  const isPageSection = (el) =>
    el.hasAttribute(SECTION_ORDERABLE_ATTR) || el.hasAttribute(GLOBAL_ROOT_ATTR);

  // Rows opted into ordering (orderable="true") are the innermost thing a hover
  // can land on, so they claim the control before the section around them.
  const isRow = moveEl.hasAttribute(ORDERABLE_ATTR) && !isPageSection(moveEl);

  // Direct child of an insertable container → full set actions (hide/dup/delete).
  // Declared early so Bard mixed content can show move arrows vs all siblings.
  const isBlockSet = isRow && moveEl.parentElement?.hasAttribute(INSERT_ATTR);

  // Inside a global section the mouse is on one of the SOURCE's sections, one
  // level in from the page's own list. Its place among the page's sections is
  // the wrapper's place, so peers are counted from there.
  const globalRoot = isRow ? null : moveEl.closest(`[${GLOBAL_ROOT_ATTR}]`);
  const peerEl = globalRoot ?? moveEl;

  const peers = peerEl.parentElement
    ? [...peerEl.parentElement.children].filter((el) =>
        isRow
          ? el.hasAttribute(ORDERABLE_ATTR)
          : moveEl.hasAttribute('data-sid-move')
            ? el.hasAttribute('data-sid-move')
            : isPageSection(el)
      )
    : [];

  // Page sections also get an "add section" (+) button, so their control is
  // worth showing even when a section is the only one on the page.
  const isSection = !moveEl.hasAttribute('data-sid-move') && !isRow && isPageSection(moveEl);

  // An orderable row always gets its control: even the last one left needs a "+"
  // to add another (and a "−" to remove itself).
  if (peers.length <= 1 && !isSection && !isRow) {
    return;
  }

  moveTargetEl = moveEl;

  const doc = win.document;
  const theme = toolbarThemeFor(detectCpDark(win));
  const ctrl = doc.createElement('div');
  // Two different questions, and they were being answered by the same word.
  //
  // `flowsSideways` is about the thing itself: does it sit beside its siblings
  // or above them? That is what decides which way the arrows point — and a
  // section is always stacked, so it moves up and down, never left and right.
  //
  // `horizontal` is only about the strip of buttons: a section's control lies
  // across its top corner the way a toolbar does, whichever way the section
  // itself moves. Rows keep taking their layout from their flow.
  const flowsSideways = isHorizontalFlow(win, moveEl);
  const horizontal = isSection || flowsSideways;
  const BTN = 26;
  const btnCss =
    `all:unset;cursor:pointer;width:${BTN}px;height:${BTN}px;display:inline-flex;align-items:center;` +
    `justify-content:center;border-radius:6px;box-sizing:border-box;color:${theme.fg};line-height:1;`;
  const paintHover = (btn) => {
    btn.addEventListener('mouseenter', () => {
      if (!btn.dataset.sveDisabled) {
        btn.style.background = theme.hover;
      }
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.background = 'transparent';
    });
  };

  ctrl.id = '__sve-move-ctrl';
  // Same tokens as the headline/richtext edit toolbar — just a smaller pill.
  ctrl.style.cssText =
    `position:fixed;z-index:2147483646;display:flex;flex-direction:${horizontal ? 'row' : 'column'};gap:1px;` +
    `background:${theme.bg};color:${theme.fg};border:1px solid ${theme.border};border-radius:9px;padding:3px;` +
    `box-shadow:${theme.shadow};font-family:ui-sans-serif,system-ui,-apple-system,sans-serif;user-select:none;`;

  const addArrow = (glyph, title, direction) => {
    const btn = doc.createElement('button');

    btn.type = 'button';
    btn.textContent = glyph;
    btn.title = title;
    btn.style.cssText = `${btnCss}font-size:14px;`;
    paintHover(btn);
    btn.addEventListener('mousedown', (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      win.parent.postMessage(
        { source: 'statamic-visual-editor', type: 'move', uid, direction },
        win.location.origin
      );
    });
    ctrl.appendChild(btn);
  };

  // Drag handle (sections opted in via section-orderable="true"): grab it and
  // the page zooms out to a full-structure overview where the section can be
  // dropped anywhere — the arrows stay for single-step moves.
  if (moveEl.hasAttribute('data-sid-section-orderable') && peers.length > 1) {
    const handle = doc.createElement('button');

    handle.type = 'button';
    handle.textContent = '⠿';
    handle.title = t('drag_section');
    handle.style.cssText = `${btnCss}cursor:grab;font-size:13px;touch-action:none;`;
    paintHover(handle);
    handle.addEventListener('pointerdown', (event) => {
      if (event.button !== 0 || editing || dragState) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      dragState = {
        el: moveEl,
        uid,
        peers,
        horizontal: false,
        section: true,
        zoom: null,
        startX: event.clientX,
        startY: event.clientY,
        fromIndex: peers.indexOf(peerEl),
        insert: null,
        active: false,
        indicator: null,
        ghost: null,
      };
    });

    ctrl.appendChild(handle);
  }

  const peerIndex = peers.indexOf(peerEl);
  const canStep = peers.length > 1 && peerIndex >= 0;
  const canMovePrev = canStep && peerIndex > 0;
  const canMoveNext = canStep && peerIndex < peers.length - 1;

  if (canMovePrev || canMoveNext) {
    if (flowsSideways) {
      if (canMovePrev) {
        addArrow('←', t('move_left'), -1);
      }

      if (canMoveNext) {
        addArrow('→', t('move_right'), 1);
      }
    } else {
      if (canMovePrev) {
        addArrow('↑', t('move_up'), -1);
      }

      if (canMoveNext) {
        addArrow('↓', t('move_down'), 1);
      }
    }
  }

  // Orderable rows: add/remove, or for replicator blocks inside an insertable
  // container — hide / duplicate / delete (matching the CP set header actions).
  if (isRow) {
    const rowButton = (glyphOrHtml, title, type, style = '', asHtml = false, extra = null) => {
      const btn = doc.createElement('button');

      btn.type = 'button';

      if (asHtml) {
        btn.innerHTML = glyphOrHtml;
      } else {
        btn.textContent = glyphOrHtml;
      }

      btn.title = title;
      btn.style.cssText = `${btnCss}font-size:16px;${style}`;
      paintHover(btn);
      btn.addEventListener('mousedown', (e) => {
        e.preventDefault();
        e.stopPropagation();
      });
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        // At the field's min/max the button is disabled — the CP would reject it
        // anyway, this just makes that visible.
        if (btn.dataset.sveDisabled) {
          return;
        }

        win.parent.postMessage(
          { source: 'statamic-visual-editor', type, uid, ...(extra || {}) },
          win.location.origin
        );
        hideMoveControl(win);
      });

      ctrl.appendChild(btn);

      return btn;
    };

    if (isBlockSet) {
      // Layout switch: see BLOCK_CTRL_LAYOUT at the top of this file.
      if (BLOCK_CTRL_LAYOUT === 'above-horizontal') {
        ctrl.style.flexDirection = 'row';
        ctrl.dataset.sveLayout = 'above-horizontal';
      } else {
        ctrl.style.flexDirection = 'column';
        ctrl.dataset.sveLayout = 'left-vertical';
      }

      rowButton(ICONS.hide, t('hide_this'), 'hide-row', '', true);
      const dupBtn = rowButton(ICONS.duplicate, t('duplicate_this'), 'duplicate-row', '', true);
      const removeBtn = rowButton(ICONS.trash, t('remove_this'), 'remove-row', '', true);

      moveCtrlRowButtons = { uid, addBtn: dupBtn, removeBtn };
      win.parent.postMessage({ source: 'statamic-visual-editor', type: 'row-caps', uid }, win.location.origin);
    } else {
      const addBtn = rowButton('+', t('add_another'), 'add-row', '', false, sidTemplatePayload(moveEl));
      // Taking away the last row leaves the block holding this field with
      // nothing to draw — see blockHolding(). The uid, not the element: this
      // rides across postMessage, which can only carry plain data.
      const removeBtn = rowButton('−', t('remove_this'), 'remove-row', '', false, {
        emptyRemovesBlock: blockHolding(moveEl)?.getAttribute(SID_ATTR) || null,
      });

      moveCtrlRowButtons = { uid, addBtn, removeBtn };
      win.parent.postMessage({ source: 'statamic-visual-editor', type: 'row-caps', uid }, win.location.origin);
    }
  }

  // Bookmark — save this section as a reusable template.
  if (isSection) {
    const save = doc.createElement('button');

    save.type = 'button';
    save.innerHTML = ICONS.bookmark;
    save.title = t('save_as_template');
    save.style.cssText = btnCss;
    paintHover(save);
    save.addEventListener('mousedown', (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
    save.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      win.parent.postMessage(
        { source: 'statamic-visual-editor', type: 'save-section', uid },
        win.location.origin
      );
      hideMoveControl(win);
    });

    ctrl.appendChild(save);
  }

  // "+" — opens Statamic's own Add Set picker, inserting after this section.
  if (isSection) {
    const plus = doc.createElement('button');

    plus.type = 'button';
    plus.textContent = '+';
    plus.title = t('add_section_below');
    plus.style.cssText = `${btnCss}font-size:18px;`;
    paintHover(plus);
    plus.addEventListener('mousedown', (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
    plus.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      win.parent.postMessage(
        { source: 'statamic-visual-editor', type: 'add-set', uid },
        win.location.origin
      );
    });

    ctrl.appendChild(plus);

    // Duplicate — the same handler the orderable rows use, because a section IS
    // a row of page_sections.
    const copy = doc.createElement('button');

    copy.type = 'button';
    copy.innerHTML = ICONS.duplicate;
    copy.title = t('duplicate_this');
    copy.style.cssText = btnCss;
    paintHover(copy);
    copy.addEventListener('mousedown', (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
    copy.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      win.parent.postMessage(
        { source: 'statamic-visual-editor', type: 'duplicate-row', uid },
        win.location.origin
      );
      hideMoveControl(win);
    });

    ctrl.appendChild(copy);

    // Take this section off the page. A bin rather than a minus sign: a minus
    // reads as "one fewer" — it could as well mean collapse or zoom out — while
    // a bin says what is actually about to happen. The rows next door have said
    // it that way all along.
    //
    // Goes through the same remove-row handler the orderable rows use, so
    // `min_sets` is honoured for free.
    const minus = doc.createElement('button');

    minus.type = 'button';
    minus.innerHTML = ICONS.trash;
    minus.title = t('remove_section');
    minus.style.cssText = btnCss;
    paintHover(minus);
    minus.addEventListener('mousedown', (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
    minus.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (minus.dataset.sveDisabled) {
        return;
      }

      win.parent.postMessage(
        { source: 'statamic-visual-editor', type: 'remove-row', uid, confirm: true },
        win.location.origin
      );
      hideMoveControl(win);
    });

    ctrl.appendChild(minus);

    // Ask the CP whether page_sections is at its min, so the button greys out
    // instead of silently doing nothing — same as the orderable rows'.
    moveCtrlRowButtons = { uid, addBtn: null, removeBtn: minus };
    win.parent.postMessage({ source: 'statamic-visual-editor', type: 'row-caps', uid }, win.location.origin);
  }

  // Bridge the gap between the control and its row. The control sits a few px
  // off the row, and the cursor has to cross that gap to reach it — but in the
  // gap `event.target` is neither the row nor the control, so the hover handler
  // would switch to the section's control and this one would vanish before it's
  // reached. Tall transparent strips (plus geometric hit-testing in
  // pointerInMoveControlZone) keep the control reachable.
  ['top:100%', 'bottom:100%'].forEach((edge) => {
    const bridge = doc.createElement('div');

    bridge.style.cssText = `position:absolute;left:-12px;right:-12px;${edge};height:24px;`;
    ctrl.appendChild(bridge);
  });

  doc.body.appendChild(ctrl);
  moveCtrlEl = ctrl;

  moveReposition = () => positionMoveControl(win);
  win.addEventListener('scroll', moveReposition, true);
  win.addEventListener('resize', moveReposition);
  positionMoveControl(win);
}

/** Handles an edit-start reply: turns the target element contenteditable. */
function startEditing(win, data) {
  if (!pendingEdit || pendingEdit.requestId !== data.requestId) {
    return;
  }

  const { wrapper, blockEl, clickX, clickY, timeout } = pendingEdit;

  clearTimeout(timeout);
  pendingEdit = null;

  if (editing) {
    finishEditing(win, false);
  }

  let el;
  let lockedEls = [];

  if (data.mode === 'bard-field') {
    // Whole-field session: the wrapper itself becomes the editable. Map the
    // field's nodes onto the wrapper's direct children in order; every
    // unmatched child (buttons, loops, other partials sharing the wrapper) is
    // locked so the caret and edits can never reach it.
    el = wrapper;

    const bardInline = wrapper.hasAttribute('data-sid-bard-inline');
    const kids = [...wrapper.children];
    const nodes = data.nodes || [];

    // Inline Bard (headline etc.) augments to bare text/spans — no <p> child
    // like richtext. The wrapper IS the single block; skip child mapping.
    if (
      bardInline &&
      nodes.length === 1 &&
      normText(wrapper.textContent) === nodes[0].text
    ) {
      lockedEls = [];
    } else {
      const blocks = [];
      let cursor = 0;

      for (const node of nodes) {
        let found = null;

        while (cursor < kids.length) {
          const candidate = kids[cursor++];

          if (normText(candidate.textContent) === node.text) {
            found = candidate;
            break;
          }
        }

        if (!found) {
          // The DOM doesn't line up with the stored nodes (modifier output,
          // restructured markup) — abort rather than guess; the CP rolls back.
          win.parent.postMessage(
            { source: 'statamic-visual-editor', type: 'edit-end', requestId: data.requestId, cancelled: true },
            win.location.origin
          );

          return;
        }

        blocks.push(found);
      }

      lockedEls = kids.filter((kid) => !blocks.includes(kid));
    }
  } else {
    el = data.target === 'block' && blockEl ? blockEl : editableFromWrapper(wrapper);
  }

  // The toolbar for a Bard field is built from the field's own `buttons` config,
  // emitted by the visual_edit tag on the wrapper (data-sid-bard-buttons) plus a
  // name→{type,class} map for its bard-texstyle styles (data-sid-bard-styles).
  let bardButtons = null;
  let bardStyles = null;
  let bardSets = [];
  const bardInline = wrapper.hasAttribute('data-sid-bard-inline');

  try {
    const raw = wrapper.getAttribute('data-sid-bard-buttons');

    bardButtons = raw ? raw.split(',').map((s) => s.trim()).filter(Boolean) : null;

    const stylesRaw = wrapper.getAttribute('data-sid-bard-styles');

    bardStyles = stylesRaw ? JSON.parse(stylesRaw) : null;

    const setsRaw = wrapper.getAttribute('data-sid-bard-sets');

    bardSets = setsRaw ? JSON.parse(setsRaw) : [];
  } catch {
    /* malformed config — fall back to defaults */
  }

  // Sibling-field quick controls: shape from the tag (types, options), current
  // value from the CP's reply — the two are matched up by handle here so the
  // toolbar only ever deals with one list.
  const controls = controlsFrom(wrapper).map((control) => ({
    ...control,
    value: data.controls?.[control.handle] ?? control.default ?? null,
  }));

  const session = {
    requestId: data.requestId,
    mode: data.mode, // 'string' | 'bard'
    hasLink: !!data.hasLink,
    controls,
    bardButtons,
    bardStyles,
    bardSets: Array.isArray(bardSets) ? bardSets : [],
    bardInline,
    field: wrapper.getAttribute(SID_FIELD_ATTR) || null,
    scope: wrapper.getAttribute('data-sid-field-uid') || null,
    // Block-level bard-texstyle / bard-styles classes (paragraph/heading/div) —
    // used to reset an element's style class before applying a new block format.
    blockClasses: collectBlockClassesFromStyles(bardStyles),
    // Span-type bard-texstyle classes → recognized as btsSpan marks by the CP.
    spanClasses: bardStyles
      ? Object.values(bardStyles)
          .filter((s) => s.type === 'span' && s.class && s.kind !== 'vizu' && s.kind !== 'group')
          .map((s) => s.class)
      : [],
    el,
    lockedEls,
    restoreHtml: el.innerHTML,
    hadContentEditable: el.getAttribute('contenteditable'),
    inputTimer: null,
    dirty: false,
    setInserterEl: null,
  };

  el.querySelectorAll('[data-sve-placeholder]').forEach((node) => node.remove());

  // Before contenteditable: turn highlight spans back into {text} so a plain
  // string field keeps its markers (textContent would otherwise drop them).
  if (data.mode === 'string') {
    highlightSpansToBraces(el);
  }

  if (data.mode === 'bard' || data.mode === 'bard-field') {
    // Full contenteditable so execCommand formatting (toolbar + ⌘B/⌘I) works.
    // Whatever markup lands in the DOM is sanitized by the CP-side parser —
    // only semantic tags become marks, everything else is flattened to text.
    el.contentEditable = 'true';

    // Non-field content sharing the wrapper stays untouchable.
    lockedEls.forEach((locked) => {
      locked.setAttribute('data-sve-locked', '');
      locked.setAttribute('contenteditable', 'false');
    });

    try {
      win.document.execCommand('styleWithCSS', false, false);
    } catch {
      /* deprecated but harmless */
    }
  } else {
    // plaintext-only keeps string fields plain even on rich paste. Firefox
    // doesn't support it — fall back to standard contenteditable there.
    try {
      el.contentEditable = 'plaintext-only';
    } catch {
      /* unsupported value */
    }

    if (el.contentEditable !== 'plaintext-only') {
      el.contentEditable = 'true';
    }
  }

  applyOutlineTone(win, el);
  el.setAttribute(EDITING_ATTR, '');

  // Placeholder templates often dim default copy (e.g. opacity-50). Clear that
  // as soon as editing begins — waiting for blur/morph leaves the text faded
  // while the caret is already in the field.
  session.opacityEl = wrapper;
  session.prevOpacity = wrapper.style.opacity;
  wrapper.style.opacity = '1';

  // Lift the editable element above any stretched-link / decorative overlay that
  // sits on top of it (see resolveSidTarget) for the duration of the edit, so
  // clicks to place the caret land on the text instead of committing the edit by
  // hitting the overlay. Only stacking is affected; a static element is made
  // position:relative with no offsets, so layout does not move. Restored on finish.
  session.prevZIndex = el.style.zIndex;
  session.prevPosition = el.style.position;

  if (win.getComputedStyle(el).position === 'static') {
    el.style.position = 'relative';
  }

  el.style.zIndex = '2147483646';

  session.onInput = () => {
    session.dirty = true;
    syncSidPlaceholders(win.document);
    clearTimeout(session.inputTimer);
    session.inputTimer = setTimeout(() => sendEditInput(win, session), EDIT_INPUT_DEBOUNCE);
    positionEditToolbar(win, session);
    updateBardSetInserter(win, session);
  };

  session.onKeydown = (e) => {
    // Titles often sit inside <button> (e.g. intro slider). Space/Enter would
    // activate the button and kick the user out of editing — stop that bubble
    // without blocking the character itself (no preventDefault on keydown).
    if (e.code === 'Space' || e.key === ' ') {
      e.stopPropagation();
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      finishEditing(win, true);

      return;
    }

    if (e.key === 'Enter') {
      // Inline Bard (headline etc.): Enter commits — never split into new lines.
      if (session.bardInline) {
        e.preventDefault();
        finishEditing(win, false);

        return;
      }

      // Whole-field Bard: Enter splits blocks like the panel's editor.
      // Shift+Enter falls through to the browser's <br> (parsed to hardBreak).
      // At the very end of a heading a paragraph is inserted (Bard's
      // behaviour); everywhere else the browser's own block split matches.
      if (session.mode === 'bard-field') {
        if (e.shiftKey) {
          return;
        }

        const block = currentBlockEl(win, session);

        if (block && /^H[1-6]$/.test(block.tagName) && caretAtEndOf(win, block)) {
          e.preventDefault();

          const p = win.document.createElement('p');

          p.innerHTML = '<br>';
          block.after(p);

          const range = win.document.createRange();

          range.setStart(p, 0);
          range.collapse(true);

          const sel = win.getSelection();

          sel.removeAllRanges();
          sel.addRange(range);
          session.onInput();
        }

        // After Enter (browser split or heading→p), offer the set "+" on an
        // empty paragraph — same idea as Bard's empty-line set button in the CP.
        win.setTimeout(() => updateBardSetInserter(win, session), 0);

        return;
      }

      // Shift+Enter inserts a newline in plain string fields (textarea-style);
      // everywhere else Enter commits — block splitting is out of scope.
      if (e.shiftKey && data.mode === 'string') {
        return;
      }

      e.preventDefault();

      if (!e.shiftKey) {
        finishEditing(win, false);
      }
    }
  };

  // Button activation from Space happens on keyup — kill it there.
  session.onKeyup = (e) => {
    if (e.code === 'Space' || e.key === ' ') {
      e.stopPropagation();
      e.preventDefault();
    }
  };

  session.onBlur = () => {
    if (!session.suspendBlur) {
      finishEditing(win, false);
    }
  };

  session.onSelectionChange = () => {
    updateEditToolbarState(win);
    updateBardSetInserter(win, session);
  };
  session.reposition = () => positionEditToolbar(win, session);

  el.addEventListener('input', session.onInput);
  el.addEventListener('keydown', session.onKeydown);
  el.addEventListener('keyup', session.onKeyup);
  el.addEventListener('blur', session.onBlur);
  win.document.addEventListener('selectionchange', session.onSelectionChange);
  win.addEventListener('scroll', session.reposition, true);
  win.addEventListener('resize', session.reposition);

  hideMoveControl(win);
  editing = session;
  win.__sveInlineEdit.active = true;

  el.focus();
  placeCaretFromPoint(win, clickX, clickY);
  createEditToolbar(win, session);
}

/**
 * Ends the active inline-edit session. Commits (final edit-input flush) unless
 * cancelled; on cancel the DOM is restored and the CP rolls the value back.
 * Always notifies preview.js (via window flag + event) so a deferred hot-reload
 * morph can run.
 */
export function finishEditing(win, cancelled) {
  if (!editing) {
    return;
  }

  const session = editing;

  // Clear first: el.blur() below re-fires onBlur → finishEditing must no-op.
  editing = null;

  clearTimeout(session.inputTimer);

  const { el } = session;

  el.removeEventListener('input', session.onInput);
  el.removeEventListener('keydown', session.onKeydown);
  el.removeEventListener('keyup', session.onKeyup);
  el.removeEventListener('blur', session.onBlur);
  win.document.removeEventListener('selectionchange', session.onSelectionChange);
  win.removeEventListener('scroll', session.reposition, true);
  win.removeEventListener('resize', session.reposition);
  removeEditToolbar();
  removeBardSetInserter(session);

  if (!cancelled && session.dirty) {
    sendEditInput(win, session);
  }

  win.parent.postMessage(
    {
      source: 'statamic-visual-editor',
      type: 'edit-end',
      requestId: session.requestId,
      cancelled: !!cancelled,
    },
    win.location.origin
  );

  el.removeAttribute(EDITING_ATTR);

  // Restore the stacking overrides applied in startEditing.
  el.style.zIndex = session.prevZIndex || '';
  el.style.position = session.prevPosition || '';

  // Only restore dimming when the edit was cancelled or never changed —
  // after a real commit keep full opacity until the hot-reload morph
  // replaces the node (avoids a brief fade-out flash between blur and morph).
  if (session.opacityEl && (cancelled || !session.dirty)) {
    session.opacityEl.style.opacity = session.prevOpacity || '';
  }

  if (session.hadContentEditable === null) {
    el.removeAttribute('contenteditable');
  } else {
    el.setAttribute('contenteditable', session.hadContentEditable);
  }

  (session.lockedEls || []).forEach((locked) => {
    locked.removeAttribute('data-sve-locked');
    locked.removeAttribute('contenteditable');
  });

  if (cancelled) {
    el.innerHTML = session.restoreHtml;
  }

  syncSidPlaceholders(win.document);

  if (win.document.activeElement === el) {
    el.blur();
  }

  win.__sveInlineEdit.active = false;
  win.dispatchEvent(new CustomEvent('sve:inline-edit-end'));
}

/**
 * Show/hide the hover move control from a pointer event.
 *
 * The Links wrap-up belt is click-driven (see showHoverBelt) — not hover — so
 * it matches the per-link belt. Nested rows still defer to the section control
 * on hover; plain blocks keep their actions in the click toolbar.
 */
function updateMoveControlFromPointer(win, event) {
  if (moveCtrlEl && moveCtrlEl.contains(event.target)) {
    return;
  }

  // Keep a pinned wrap-up belt while the pointer is on it or in the gap to it.
  if (hoverBeltEl && (hoverBeltEl.contains(event.target) || pointerInHoverBeltGap(event))) {
    return;
  }

  const rowEl = event.target.closest(`[${ORDERABLE_ATTR}]`);

  if (rowEl && !rowEl.hasAttribute(SECTION_ORDERABLE_ATTR)) {
    // A block keeps its own toolbar — that part stands. But the section around
    // it should not go away just because the cursor moved onto something inside
    // it: the control belongs to the whole section, and the cursor never left.
    // It used to blink out and back as you passed over a heading, which looked
    // like the control couldn't make up its mind.
    const section = rowEl.closest(`[${SECTION_ORDERABLE_ATTR}]`);

    if (section) {
      showMoveControl(win, section);
    } else {
      hideMoveControl(win);
    }

    return;
  }

  const moveEl =
    rowEl ||
    event.target.closest('[data-sid-move]') ||
    event.target.closest(`[${SECTION_ORDERABLE_ATTR}]`);

  if (editing) {
    const editRoot = editing.wrapper || editing.el;

    if (
      moveEl &&
      editRoot &&
      (moveEl === editRoot || moveEl.contains(editRoot) || editRoot.contains(moveEl))
    ) {
      hideMoveControl(win);

      return;
    }
  }

  if (moveEl) {
    showMoveControl(win, moveEl);
  } else if (pointerInMoveControlGap(event)) {
    // gap between control and target — keep it so hide/delete stay clickable
  } else {
    hideMoveControl(win);
  }
}

/**
 * The Links wrap-up (or any block that holds nested orderable rows) the click
 * should open a belt for — or null when the click belongs to a child row/field.
 */
function wrapUpBeltTarget(target, event) {
  // Field chrome around nested rows (the links flex wrapper): click on padding,
  // not on a child button.
  if (target.hasAttribute(SID_FIELD_ATTR)) {
    const childRow = target.querySelector(`[${ORDERABLE_ATTR}]`);
    const clickedRow = event.target.closest(`[${ORDERABLE_ATTR}]`);

    if (childRow && (!clickedRow || clickedRow === target)) {
      return blockHolding(childRow);
    }

    return null;
  }

  // The block itself (empty-gone around the links), when the click did not land
  // on an inner orderable row.
  if (
    target.hasAttribute(ORDERABLE_ATTR) &&
    !target.hasAttribute(SECTION_ORDERABLE_ATTR) &&
    target.parentElement?.hasAttribute(INSERT_ATTR) &&
    target.querySelector(`[${ORDERABLE_ATTR}]`)
  ) {
    const inner = event.target.closest(`[${ORDERABLE_ATTR}]`);

    if (inner && inner !== target) {
      return null;
    }

    return target;
  }

  return null;
}

/**
 * On every mouse movement: marks the innermost hovered editable element with
 * a dashed outline. Clears after HOVER_CLEAR_DELAY ms of no movement.
 * (Only the hovered / active / editing element is outlined — not every field.)
 * Hovering a different field than the active one temporarily hides the active
 * outline so the two rings don't overlap.
 */
export function createMouseMoveHandler(win) {
  let clearTimer = null;
  const HOVER_OVERRIDE = 'sve-outline-hover-override';

  const syncHoverOverride = (target) => {
    // Any pinned outline (click/CP focus or CP hover) that isn't the element
    // under the cursor gets suppressed while preview-hovering another field.
    const pinned =
      win.document.querySelector(`[${ACTIVE_ATTR}]`) ||
      win.document.querySelector(`[${HOVER_ATTR}]`);
    const hoveringOther = !!(target && pinned && target !== pinned);

    win.document.documentElement.classList.toggle(HOVER_OVERRIDE, hoveringOther);
  };

  return function handleMouseMove(event) {
    // Always keep block actions working — even while another field is being
    // inline-edited (that used to early-return and made "hover down" feel broken).
    if (!htmlPick) {
      updateMoveControlFromPointer(win, event);
    }

    if (editing) {
      return;
    }

    win.document.documentElement.classList.add(MOUSE_ACTIVE_CLASS);

    if (htmlPick) {
      const current = win.document.querySelector(`[${INNER_ATTR}]`);
      const target = event.target.closest?.(`[${HT_PATH_ATTR}]`) || null;

      if (current !== target) {
        if (current) {
          current.removeAttribute(INNER_ATTR);
        }

        if (target) {
          applyOutlineTone(win, target);
          target.setAttribute(INNER_ATTR, '');
        }
      }

      syncHoverOverride(target);

      if (clearTimer) {
        clearTimeout(clearTimer);
      }

      clearTimer = setTimeout(() => {
        win.document.documentElement.classList.remove(MOUSE_ACTIVE_CLASS);
        win.document.documentElement.classList.remove(HOVER_OVERRIDE);
        win.document.querySelectorAll(`[${INNER_ATTR}]`).forEach((el) => {
          el.removeAttribute(INNER_ATTR);
        });
      }, HOVER_CLEAR_DELAY);

      return;
    }

    // Track innermost [data-sid] or [data-sid-field] for hover outline
    const current = win.document.querySelector(`[${INNER_ATTR}]`);
    const target = resolveSidTarget(win, event);

    if (current !== target) {
      if (current) {
        current.removeAttribute(INNER_ATTR);
      }

      if (target) {
        applyOutlineTone(win, target);
        target.setAttribute(INNER_ATTR, '');
      }
    }

    syncHoverOverride(target);

    toneOutlineContainer(win, event);
    maybeShowColumnChrome(win, event);

    if (clearTimer) {
      clearTimeout(clearTimer);
    }

    clearTimer = setTimeout(() => {
      win.document.documentElement.classList.remove(MOUSE_ACTIVE_CLASS);
      win.document.documentElement.classList.remove(HOVER_OVERRIDE);
      win.document.querySelectorAll(`[${INNER_ATTR}]`).forEach((el) => {
        el.removeAttribute(INNER_ATTR);
      });

      // Don't yank the control out from under a parked pointer — the user may
      // have stopped moving to click hide/delete.
      if (!(moveCtrlEl && (moveCtrlEl.matches(':hover') || moveTargetEl?.matches(':hover')))) {
        hideMoveControl(win);
      }

      if (!widthDrag) {
        hideColumnChrome(win);
      }
    }, HOVER_CLEAR_DELAY);
  };
}

/**
 * Resolves the visual-editor target for a pointer event, seeing through
 * decorative overlays that swallow the event.
 *
 * A common site pattern makes a whole card clickable with a stretched link —
 * `a::after { position:absolute; inset:0 }`, often z-indexed above the card's
 * text. The real pointer event then lands on that overlay, so
 * event.target.closest() walks up to the enclosing section/row and never
 * reaches the inline-editable field the user was pointing at: it sits UNDER the
 * overlay as a cousin, not an ancestor.
 *
 * Resolve the normal target first. When it is not itself an editable field,
 * scan the hit-test stack at the pointer for the topmost [data-sid-field]
 * element that lives inside that target, and prefer it. Constraining to
 * base.contains(field) means we only ever look through overlays within the same
 * block — a field in another section/row is never grabbed by mistake.
 */
function resolveSidTarget(win, event) {
  const base = event.target.closest(`[${SID_ATTR}], [${SID_FIELD_ATTR}]`);

  if (!base || base.hasAttribute(SID_FIELD_ATTR)) {
    return base;
  }

  if (typeof event.clientX !== 'number' || typeof event.clientY !== 'number') {
    return base;
  }

  const stack = win.document.elementsFromPoint(event.clientX, event.clientY);

  for (const el of stack) {
    // The stack is topmost-first; a covered field always paints above its own
    // section/row, so once we reach `base` there is nothing left to find.
    if (el === base) {
      break;
    }

    const field = el.closest?.(`[${SID_FIELD_ATTR}]`);

    if (field && base.contains(field)) {
      return field;
    }
  }

  return base;
}

const ICON_PICKER_TYPES = ['iconify', 'iconamic'];

function isIconPickerField(el) {
  const type = (el.getAttribute('data-sid-fieldtype') || '').toLowerCase();

  if (ICON_PICKER_TYPES.includes(type)) {
    return true;
  }

  // Blueprint missed: a wrapper whose only content is an icon graphic.
  if (!el.hasAttribute('data-sid-inline-edit')) {
    return false;
  }

  return !!el.querySelector('svg, iconify-icon') && normText(el.textContent) === '';
}

function iconFieldHasValue(el) {
  if (el.querySelector('[data-sve-icon-empty]')) {
    return false;
  }

  if (el.querySelector('svg, img, iconify-icon, picture')) {
    return true;
  }

  return normText(el.textContent) !== '';
}

function iconFieldHasConfiguredDefault(el) {
  return (
    el.hasAttribute('data-sve-icon-has-default') ||
    el.hasAttribute('data-sve-icon-default') ||
    !!el.querySelector('[data-sve-icon-default], [data-sve-icon-has-default]')
  );
}

function postIconEdit(win, wrapper, action) {
  win.parent.postMessage(
    {
      source: 'statamic-visual-editor',
      type: 'icon-edit',
      action,
      field: wrapper.getAttribute(SID_FIELD_ATTR),
      scope: wrapper.getAttribute('data-sid-field-uid') || undefined,
    },
    win.location.origin
  );
}

/**
 * Change / Remove hung off the clicked icon — same two actions as the Iconify
 * field in the sidebar, but sitting on the preview so the panel can stay closed.
 * If the fieldtype has a default, Remove is omitted: the icon cannot be cleared.
 */
function openIconFieldMenu(win, wrapper) {
  const items = [
    {
      label: t('icon_change'),
      run: () => postIconEdit(win, wrapper, 'change'),
    },
  ];

  if (!iconFieldHasConfiguredDefault(wrapper)) {
    items.push({
      label: t('icon_remove'),
      danger: true,
      run: () => postIconEdit(win, wrapper, 'remove'),
    });
  }

  openToolbarMenu(win, wrapper, 'icon-picker', items);
}

export function createClickHandler(win) {
  return function handleClick(event) {
    // The click generated by releasing a drag is not a click — swallow it
    // before it starts an inline edit or a focus jump.
    if (dragJustEnded || widthDragJustEnded) {
      event.preventDefault();
      event.stopPropagation();

      return;
    }

    // Move-control / wrap-up-belt clicks: the buttons handle themselves (and this
    // handler runs in the capture phase — stopping here would block their listeners).
    if (moveCtrlEl && moveCtrlEl.contains(event.target)) {
      return;
    }

    if (hoverBeltEl && hoverBeltEl.contains(event.target)) {
      return;
    }

    // The global-section bar owns its own clicks.
    if (event.target.closest(`#${GLOBAL_BAR_ID}`)) {
      return;
    }

    // Confirm overlays own their clicks (don't treat as "outside").
    if (event.target.closest('#__sve-preview-confirm')) {
      return;
    }

    // Inline toolbar + portaled menus live on <body>, outside [data-sve-global]
    // / chrome. They are still editing the focused section — never a leave.
    if (
      (toolbarEl && toolbarEl.contains(event.target)) ||
      event.target.closest?.(
        '[data-sve-menu], [data-sve-color-menu], [data-sve-bard-style-menu], [data-sve-bard-set-inserter]'
      )
    ) {
      return;
    }

    // The block inserters draw in an overlay layer on <body>, outside
    // [data-sve-global] — but the "+" inserts INTO the section it sits on. A
    // click on one is editing the focused section, never a leave.
    if (event.target.closest?.(`#${INSERT_LAYER_ID}`)) {
      return;
    }

    // The chrome (header/footer) bar owns its own clicks.
    if (event.target.closest(`#${CHROME_BAR_ID}`)) {
      return;
    }

    // First click on header/footer: confirm (“global — applies everywhere”),
    // then step into chrome focus. Once inside, nested clicks edit normally.
    // A site that has switched this half of the chrome off gets neither — the
    // click falls through to whatever is under it, as on any other page.
    const chromeEl = chromeEditable(event.target.closest(`[${CHROME_ATTR}]`));

    if (chromeEl) {
      if (chromeFocusEl !== chromeEl) {
        event.preventDefault();
        event.stopPropagation();
        confirmEnterChrome(win, chromeEl);

        return;
      }
    } else if (chromeFocusEl || hasChromeFocusClass(win.document)) {
      event.preventDefault();
      event.stopPropagation();

      // Inside the header or the footer the rest of the page is locked, exactly
      // as it is inside a global section: a click out there does nothing at all.
      // Leaving is a decision made on the bar at the bottom — Save or Close — or
      // with Escape, not something that happens to you because the pointer
      // landed an inch too far down the page.
      if (!CHROME_LOCKS_PAGE) {
        requestCloseChrome(win);
      }

      return;
    }

    // Global section: confirm before entering ("changes apply everywhere").
    // Outside click asks CP to close — same discard warning as chrome.
    // Compare by source id (not element ref): a synced entry can render several
    // sections, and clicks inside any of them must stay in focus — not re-open
    // the enter dialog.
    const globalSection = event.target.closest(`[${GLOBAL_ATTR}]`);

    if (globalSection) {
      const sourceId = globalSection.getAttribute(GLOBAL_ATTR);

      if (globalFocusId && globalFocusId === sourceId) {
        // Morph may have stripped data-sve-global-focused — recover and keep editing.
        if (!globalSection.hasAttribute(GLOBAL_FOCUS_ATTR)) {
          rebindGlobalFocus(win, sourceId);
        }
        // Fall through to normal field/inline-edit handling below.
      } else {
        event.preventDefault();
        event.stopPropagation();
        confirmEnterGlobal(win, globalSection);

        return;
      }
    } else if (globalFocusEl || globalFocusId) {
      // Inside a global section, the rest of the page is locked: a click out
      // there does nothing at all. Leaving is a decision you make on the bar at
      // the bottom — Save or Close — or with Escape, not something that happens
      // to you because the pointer landed an inch too far to the left.
      event.preventDefault();
      event.stopPropagation();

      return;
    }

    if (editing) {
      // Toolbar clicks: return without stopPropagation — this handler runs in
      // the capture phase, and stopping here would prevent the event from ever
      // reaching the toolbar buttons' own click listeners.
      if (toolbarEl && toolbarEl.contains(event.target)) {
        return;
      }

      // Dropdowns / swatch strips are portaled to <body> (not inside toolbarEl).
      // Treating them as "outside" committed the edit before the option click
      // ran — size never applied, and colour hit a dead CP session (preview
      // painted via the closure, sidebar only after the next keystroke).
      if (
        event.target.closest?.(
          '[data-sve-menu], [data-sve-color-menu], [data-sve-bard-style-menu]'
        )
      ) {
        return;
      }

      // Bard set "+" (same idea as the toolbar): must not commit the edit, or
      // the inserter is torn down before its own click listener can run.
      // Do NOT stopPropagation — this handler is capture-phase; stopping would
      // keep the event from reaching the button.
      if (event.target.closest?.('[data-sve-bard-set-inserter]')) {
        return;
      }

      if (editing.el.contains(event.target)) {
        // Clicking inside the active inline editor: let the browser place the
        // caret, but isolate the click from site JS (lightboxes, sliders, …).
        event.stopPropagation();

        return;
      }

      // Clicking anywhere else commits the edit; fall through so the click
      // also performs its normal focus/edit-request behaviour.
      finishEditing(win, false);
    }

    // Content that comes from a global set: open it in the panel beside the
    // preview rather than trying to edit it in place — the value is usually
    // rendered inside other text, so what's on screen isn't what's stored.
    const globalEl = event.target.closest('[data-sid-global]');

    if (globalEl) {
      event.preventDefault();
      event.stopPropagation();
      win.parent.postMessage(
        {
          source: 'statamic-visual-editor',
          type: 'open-global',
          target: globalEl.getAttribute('data-sid-global') || '',
        },
        win.location.origin
      );

      return;
    }

    if (htmlPick) {
      const picked = event.target.closest?.(`[${HT_PATH_ATTR}]`);

      if (picked) {
        event.preventDefault();
        event.stopPropagation();
        win.document.querySelectorAll(`[${ACTIVE_ATTR}]`).forEach((el) => {
          el.removeAttribute(ACTIVE_ATTR);
        });
        hideHoverBelt(win);
        hideMoveControl(win);
        applyOutlineTone(win, picked);
        picked.setAttribute(ACTIVE_ATTR, '');
        win.parent.postMessage(
          {
            source: 'statamic-visual-editor',
            type: 'click',
            htmlPath: picked.getAttribute(HT_PATH_ATTR),
          },
          win.location.origin
        );

        return;
      }
    }

    const target = resolveSidTarget(win, event);

    if (!target) {
      win.document.querySelectorAll(`[${ACTIVE_ATTR}]`).forEach((el) => {
        el.removeAttribute(ACTIVE_ATTR);
      });
      hideHoverBelt(win);

      return;
    }

    event.preventDefault();

    win.document.querySelectorAll(`[${ACTIVE_ATTR}]`).forEach((el) => {
      el.removeAttribute(ACTIVE_ATTR);
    });

    // Links wrap-up (and similar blocks with nested orderable rows): same belt
    // as a single link, opened on click — not hover.
    const wrapUp = wrapUpBeltTarget(target, event);

    if (wrapUp) {
      applyOutlineTone(win, wrapUp);
      wrapUp.setAttribute(ACTIVE_ATTR, '');
      hideMoveControl(win);
      showHoverBelt(win, wrapUp);

      const uid =
        wrapUp.getAttribute(GLOBAL_ROW_ATTR) ||
        wrapUp.getAttribute(SID_ATTR) ||
        wrapUp.getAttribute('data-sid-field-uid');

      if (uid) {
        win.parent.postMessage(
          {
            source: 'statamic-visual-editor',
            type: 'click',
            uid,
            global: !!wrapUp.closest(`[${GLOBAL_FOCUS_ATTR}]`),
          },
          win.location.origin
        );
      } else if (target.hasAttribute(SID_FIELD_ATTR)) {
        win.parent.postMessage(
          {
            source: 'statamic-visual-editor',
            type: 'click',
            field: target.getAttribute(SID_FIELD_ATTR),
            scope: target.getAttribute('data-sid-field-uid') || undefined,
            label: target.getAttribute('data-sid-label') || undefined,
            global: !!target.closest(`[${GLOBAL_FOCUS_ATTR}]`),
          },
          win.location.origin
        );
      }

      return;
    }

    hideHoverBelt(win);

    applyOutlineTone(win, target);
    target.setAttribute(ACTIVE_ATTR, '');

    // Popup targeting (data-sid-action="popup") — opens a CP popup for this item.
    if (target.getAttribute('data-sid-action') === 'popup') {
      const popupMessage = {
        source: 'statamic-visual-editor',
        type: 'popup',
        uid: target.getAttribute(SID_ATTR),
        // The containing section's uid — lets the CP expand and scroll the
        // publish form to the section whose popup is being opened.
        sectionUid:
          target.parentElement?.closest(`[${SID_ATTR}]`)?.getAttribute(SID_ATTR) ?? null,
      };

      // Dual-annotated blocks (popup + field + inline-edit): clicks on content
      // try inline editing first. The CP denies when the clicked element does
      // not map onto the field value (padding, images, unmatched text) — the
      // edit-deny handler then opens the popup instead.
      if (
        featureOn('inline_edit') &&
        target.hasAttribute('data-sid-inline-edit') &&
        target.hasAttribute(SID_FIELD_ATTR) &&
        event.target !== target
      ) {
        requestInlineEdit(win, target, event, { popupFallback: popupMessage });

        return;
      }

      win.parent.postMessage(popupMessage, win.location.origin);

      return;
    }

    // Field-handle targeting (data-sid-field) — sends the dot-separated field path.
    // scope = the _visual_id of the surrounding set, so the CP can disambiguate a
    // bare handle (e.g. "text") that repeats across many sections/rows.
    if (target.hasAttribute(SID_FIELD_ATTR)) {
      win.parent.postMessage(
        {
          source: 'statamic-visual-editor',
          type: 'click',
          field: target.getAttribute(SID_FIELD_ATTR),
          scope: target.getAttribute('data-sid-field-uid') || undefined,
          label: target.getAttribute('data-sid-label') || undefined,
          // The starting values this template declared for the block —
          // `controls="tag:h2|font_size:text-600"`. The toolbar has always used
          // them to draw itself; sending them on means the side panel can agree,
          // which it cannot do on its own: it renders the Statamic form, and the
          // form has never heard of the template.
          controlDefaults: controlsFrom(target)
            .filter((c) => c.default != null && c.default !== '')
            .map((c) => ({ handle: c.handle, default: c.default })),
          // Only route sidebar focus into the synced-section panel when the
          // click is inside a focused global section — not every click while
          // that panel happens to be open.
          global: !!target.closest(`[${GLOBAL_FOCUS_ATTR}]`),
        },
        win.location.origin
      );

      // Inline editing is opt-in per template: only elements rendered with
      // {{ visual_edit field="…" inline_edit="true" }} carry this attribute.
      // Everything else keeps the classic behaviour (focus the CP field only).
      // A site can also switch it off wholesale, which is the same thing one
      // level up: every flagged element falls back to that classic behaviour,
      // and the click message above has already focused the field.
      if (featureOn('inline_edit') && target.hasAttribute('data-sid-inline-edit')) {
        // Media click: the CP opens the field's asset browser instead of a
        // text-edit session. Triggered when the click lands on an image/video,
        // or anywhere in a wrapper whose only content is media (no text).
        const media = event.target.closest('img, picture, video');
        const isMediaClick =
          (media && target.contains(media)) ||
          (normText(target.textContent) === '' && target.querySelector('img, picture, video'));

        if (isMediaClick) {
          win.parent.postMessage(
            {
              source: 'statamic-visual-editor',
              type: 'asset-edit',
              field: target.getAttribute(SID_FIELD_ATTR),
              scope: target.getAttribute('data-sid-field-uid') || undefined,
            },
            win.location.origin
          );

          return;
        }

        // Iconify: filled icon → Change/Remove (same as the sidebar). Empty →
        // Iconify's own search, same as "Browse Iconify".
        if (isIconPickerField(target)) {
          if (iconFieldHasValue(target)) {
            openIconFieldMenu(win, target);
          } else {
            postIconEdit(win, target, 'browse');
          }

          return;
        }

        requestInlineEdit(win, target, event);

        return;
      }

      openRowToolbar(win, target);

      return;
    }

    const uid = target.getAttribute(SID_ATTR);

    // Determine which occurrence of this uid was clicked so the CP can target
    // the correct row when multiple sets share the same uuid (e.g. after a
    // Replicator "Duplicate Set" before the AutoUuid fieldtype has had a chance
    // to regenerate a fresh uuid for the copy).
    const allSameSid = Array.from(win.document.querySelectorAll(`[${SID_ATTR}]`)).filter(
      (el) => el.getAttribute(SID_ATTR) === uid
    );
    const uidIndex = allSameSid.indexOf(target);

    const message = {
      source: 'statamic-visual-editor',
      type: 'click',
      uid,
      global: !!target.closest(`[${GLOBAL_FOCUS_ATTR}]`),
    };

    if (uidIndex > 0) {
      message.uidIndex = uidIndex;
    }

    if (target.getAttribute('data-sid-type') === 'text') {
      const prevSet = findPrecedingSetSibling(target);

      message.afterSetUid = prevSet ? prevSet.getAttribute(SID_ATTR) : null;
    }

    win.parent.postMessage(message, win.location.origin);
    openRowToolbar(win, target);
  };
}

export function createHoverHandler(win) {
  let lastHoveredKey = null;

  function handleHover(event) {
    if (editing) {
      return;
    }

    const target = resolveSidTarget(win, event);

    // Field-handle targeting: deduplicate on the field path string.
    if (target && target.hasAttribute(SID_FIELD_ATTR)) {
      const field = target.getAttribute(SID_FIELD_ATTR);

      if (field === lastHoveredKey) {
        return;
      }

      lastHoveredKey = field;
      win.parent.postMessage(
        {
          source: 'statamic-visual-editor',
          type: 'hover',
          field,
          scope: target.getAttribute('data-sid-field-uid') || undefined,
          label: target.getAttribute('data-sid-label') || undefined,
        },
        win.location.origin
      );

      return;
    }

    const uid = target ? target.getAttribute(SID_ATTR) : null;

    // Deduplicate: skip when still over the same element (or still off any element).
    if (uid === lastHoveredKey) {
      return;
    }

    lastHoveredKey = uid;

    if (!uid) {
      // Mouse left all annotated elements — tell the CP to clear its hover state.
      win.parent.postMessage({ source: 'statamic-visual-editor', type: 'hover', uid: null }, win.location.origin);

      return;
    }

    const message = {
      source: 'statamic-visual-editor',
      type: 'hover',
      uid,
    };

    if (target.getAttribute('data-sid-type') === 'text') {
      const prevSet = findPrecedingSetSibling(target);

      message.afterSetUid = prevSet ? prevSet.getAttribute(SID_ATTR) : null;
    }

    win.parent.postMessage(message, win.location.origin);
  }

  // When the mouse leaves the iframe entirely, immediately clear the CP hover
  // state. Without this, dashed outlines in the CP linger indefinitely because
  // the mouseover handler only fires for elements inside the iframe.
  handleHover.reset = () => {
    lastHoveredKey = null;
    win.parent.postMessage({ source: 'statamic-visual-editor', type: 'hover', uid: null }, win.location.origin);
  };

  return handleHover;
}

/**
 * Finds a [data-sid-field] element in the document by field path.
 * Matches both exact dot-notation paths ("seo.title") and underscore-normalized
 * paths ("seo_title") that the CP sends when doing reverse hover sync.
 *
 * Counterpart: cp.js `findFieldElement()` — runs in the CP and resolves the
 * CP-side `#field_{handle}` element via getElementById instead of a DOM scan.
 * The two functions cannot share code because they run in separate bundles
 * (preview iframe vs. CP window).
 */
function findFieldElement(field, doc, scope) {
  // Scoped lookup: when a set _visual_id is supplied, restrict the search to the
  // element carrying data-sid="<scope>" (the set) and its descendants. This makes
  // a bare handle like "text" resolve to the correct repeated instance instead of
  // the first one in the document.
  const root =
    (scope && doc.querySelector(`[${SID_ATTR}="${scope}"]`)) || doc;

  const normalized = field.replaceAll('.', '_');

  // Exact match within scope (preview→CP direction uses dot notation, e.g. "text").
  const exact = root.querySelector(`[${SID_FIELD_ATTR}="${field}"]`);
  if (exact) return exact;

  // Full normalization match (e.g. "seo.title" matches data-sid-field="seo.title").
  const fullMatch = [...root.querySelectorAll(`[${SID_FIELD_ATTR}]`)].find(
    (el) => el.getAttribute(SID_FIELD_ATTR).replaceAll('.', '_') === normalized
  );
  if (fullMatch) return fullMatch;

  // Suffix match (CP→preview direction): the CP sends the full Statamic field ID
  // suffix, e.g. "page_sections_0_text". Match a short handle like "text" against
  // the tail. When scoped to a single set this is unambiguous; without a scope it
  // falls back to the first match, which is only correct for non-repeated fields.
  for (const el of root.querySelectorAll(`[${SID_FIELD_ATTR}]`)) {
    const attr = el.getAttribute(SID_FIELD_ATTR).replaceAll('.', '_');
    if (normalized === attr || normalized.endsWith('_' + attr)) return el;
  }

  return null;
}

/**
 * Briefly plays the sve-cp-pulse animation on el, restarting it if already running.
 * Used to signal that a CP interaction caused this preview element to be focused.
 */
function pulseElement(el) {
  el.classList.remove('sve-cp-pulse');
  void el.offsetWidth; // force reflow to restart animation
  el.classList.add('sve-cp-pulse');
  setTimeout(() => el.classList.remove('sve-cp-pulse'), PULSE_DURATION);
}

// --- External drag (dragging a section in from the CP's library panel) ----------
//
// The library panel lives in the CP window; the drop target is in here. The CP
// forwards the pointer (in this window's coordinates, so zoom doesn't matter —
// both cursor and section rects are in the same viewport space) and we show a
// drop line between the page's sections, exactly like an internal section drag,
// including the same zoom-out so the whole page is reachable. On release we tell
// the CP which section to drop after; the CP does the insert.

let extDrag = null;

function topLevelSections(win) {
  return [...win.document.querySelectorAll(`[${SECTION_ORDERABLE_ATTR}]`)].filter(
    (el) => el.getBoundingClientRect().width > 0
  );
}

function extDragStart(win) {
  const indicator = win.document.createElement('div');

  indicator.style.cssText =
    'position:fixed;z-index:2147483646;pointer-events:none;height:4px;border-radius:2px;' +
    'background:var(--sve-focus-color,#3b82f6);box-shadow:0 0 0 1px rgba(255,255,255,.5);';
  win.document.documentElement.appendChild(indicator);

  extDrag = { zoom: zoomOutForDrag(win), indicator, afterUid: null };
}

function extDragMove(win, x, y) {
  if (!extDrag) {
    return;
  }

  const sections = topLevelSections(win);
  let afterEl = null;

  // Sections are in document (top-to-bottom) order — the drop goes after the last
  // one whose midpoint the cursor has passed.
  for (const el of sections) {
    const rect = el.getBoundingClientRect();

    if (y > (rect.top + rect.bottom) / 2) {
      afterEl = el;
    } else {
      break;
    }
  }

  extDrag.afterUid = afterEl ? afterEl.getAttribute('data-sid') : null;

  const anchor = afterEl || sections[0];

  if (anchor) {
    const rect = anchor.getBoundingClientRect();

    extDrag.indicator.style.left = `${rect.left}px`;
    extDrag.indicator.style.width = `${rect.width}px`;
    extDrag.indicator.style.top = `${(afterEl ? rect.bottom : rect.top) - 2}px`;
  }
}

function extDragEnd(win, cancelled) {
  if (!extDrag) {
    return;
  }

  const { afterUid } = extDrag;

  extDrag.indicator?.remove();
  restoreZoom(win, extDrag.zoom);
  extDrag = null;

  if (!cancelled) {
    win.parent.postMessage(
      { source: 'statamic-visual-editor', type: 'ext-drop', afterUid },
      win.location.origin
    );
  }
}

// --- Heading outline -----------------------------------------------------------
// Every heading on the page, in the order a reader meets them, for the outline
// panel in the Control Panel.
//
// Collected here because only the preview knows. The CP holds fields, and a
// heading on the page can come from a block, a global, a partial or the layout —
// the rendered document is the one place they are all one list, in the order they
// are actually read.
//
// Nothing is remembered between messages: an entry is identified by its position
// in the list, and the list is rebuilt on both sides of every exchange. The page
// changes constantly — every keystroke re-renders and morphs it — so a rebuilt
// list is always the current one, where a remembered element would be a node that
// no longer exists.

const OUTLINE_SELECTOR = 'h1, h2, h3, h4, h5, h6';

// The editor's own furniture — toolbars, hover controls, the front-end edit
// button. All of it is injected under an id of ours, and none of it is the page.
const OUTLINE_CHROME = '[id^="__sve"], [id^="sve-"], [data-sve-ui]';

// A morph is hundreds of mutations; the panel wants the settled result.
const OUTLINE_SETTLE_MS = 400;

let outlineWatcher = null;

/** The heading elements the outline is built from, in document order. */
function outlineElements(win) {
  return [...win.document.querySelectorAll(OUTLINE_SELECTOR)].filter(
    // Rendered, and the page's own: a heading in a closed mobile menu is not on
    // the page as anyone sees it, and neither is one in our own toolbar.
    (el) => !el.closest(OUTLINE_CHROME) && el.getClientRects().length > 0
  );
}

/**
 * The outline as the panel receives it.
 *
 * Each entry carries what it takes to act on it: the level and the text to draw,
 * and — where the template annotated it — the set and field it sits in, so a
 * click can open the block that owns the heading as readily as scroll to it.
 */
function collectOutline(win) {
  return outlineElements(win).map((el) => {
    const set = el.closest(`[${SID_ATTR}]`);
    const field = el.closest(`[${SID_FIELD_ATTR}]`);

    return {
      level: Number(el.tagName.slice(1)) || 1,
      text: (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 160),
      uid: set?.getAttribute(SID_ATTR) || null,
      field: field?.getAttribute(SID_FIELD_ATTR) || null,
      scope: field?.getAttribute('data-sid-field-uid') || null,
    };
  });
}

function sendOutline(win) {
  win.parent.postMessage(
    { source: 'statamic-visual-editor', type: 'outline', items: collectOutline(win) },
    win.location.origin
  );
}

/**
 * Keeps the panel's list in step with the page while it is open.
 *
 * Only while it is open: watching costs little, but a panel nobody has opened
 * should cost nothing at all.
 */
function watchOutline(win, on) {
  if (outlineWatcher) {
    outlineWatcher.observer.disconnect();
    win.clearTimeout(outlineWatcher.timer);
    outlineWatcher = null;
  }

  if (!on) {
    return;
  }

  const observer = new win.MutationObserver(() => {
    win.clearTimeout(outlineWatcher.timer);
    outlineWatcher.timer = win.setTimeout(() => sendOutline(win), OUTLINE_SETTLE_MS);
  });

  outlineWatcher = { observer, timer: 0 };
  observer.observe(win.document.body, { childList: true, subtree: true, characterData: true });

  sendOutline(win);
}

/** Brings a heading into view and marks it, the same way a click in the CP does. */
function focusOutlineEntry(win, index) {
  const el = outlineElements(win)[index];

  if (!el) {
    return;
  }

  win.document.querySelectorAll(`[${ACTIVE_ATTR}]`).forEach((node) => {
    node.removeAttribute(ACTIVE_ATTR);
  });

  applyOutlineTone(win, el);
  el.setAttribute(ACTIVE_ATTR, '');
  // Centred rather than aligned to the top: a heading is the start of something,
  // and the point of jumping to it is seeing what it heads.
  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  pulseElement(el);
}

export function createMessageReceiver(win) {
  return function handleMessage(event) {
    // Guard: only accept messages from the parent frame (the Statamic CP).
    // This prevents cross-site message spoofing from third-party windows.
    if (event.source !== win.parent) {
      return;
    }

    const { data } = event;

    if (!data || data.source !== 'statamic-visual-editor') {
      return;
    }

    if (data.type === 'sve-html-pick') {
      if (!data.on) {
        htmlPick = null;
        unstampHtmlPick(win.document);

        return;
      }

      htmlPick = {
        uid: data.uid || '',
        tag: data.tag || '',
        klass: data.klass || '',
        nodes: data.nodes || [],
      };
      applyHtmlPick(win);

      return;
    }

    if (data.type === 'sve-html-pick-focus') {
      win.document.querySelectorAll(`[${ACTIVE_ATTR}]`).forEach((el) => {
        el.removeAttribute(ACTIVE_ATTR);
      });

      const el = data.path
        ? [...win.document.querySelectorAll(`[${HT_PATH_ATTR}]`)].find(
            (node) => node.getAttribute(HT_PATH_ATTR) === data.path
          )
        : null;

      if (el) {
        applyOutlineTone(win, el);
        el.setAttribute(ACTIVE_ATTR, '');
      }

      return;
    }

    if (data.type === 'ext-drag-start') {
      extDragStart(win);

      return;
    }

    if (data.type === 'outline-watch') {
      watchOutline(win, !!data.on);

      return;
    }

    if (data.type === 'outline-focus') {
      focusOutlineEntry(win, data.index);

      return;
    }

    if (data.type === 'ext-drag-move') {
      extDragMove(win, data.x, data.y);

      return;
    }

    if (data.type === 'ext-drag-end') {
      extDragEnd(win, !!data.cancelled);

      return;
    }

    if (data.type === 'row-caps-result') {
      applyRowCaps(data);

      return;
    }

    // CP re-asserts header/footer focus after Theme Settings morphs the preview.
    if (data.type === 'sve-restore-chrome') {
      rebindChromeFocus(win, data.kind === 'footer' ? 'footer' : 'header');

      return;
    }

    if (data.type === 'sve-chrome-dirty') {
      setChromeDirtyUI(!!data.dirty);

      return;
    }

    if (data.type === 'sve-global-dirty') {
      // The label arrives with the dirty state because it comes from the same
      // place: the values the panel streams up. It can be null on the first
      // reply, before the form has hydrated — keep the last real one.
      if (data.label) {
        const changed = globalSectionLabel !== data.label;

        globalSectionLabel = data.label;

        if (changed && win.document.getElementById(GLOBAL_BAR_ID)) {
          mountGlobalBar(win);
        }
      }

      setGlobalSectionDirtyUI(!!data.dirty);

      return;
    }

    // CP finished a close (clean, or after discard confirm) — drop focus UI.
    // Panel already dismissed by CP; don't post close-* again.
    if (data.type === 'sve-force-exit-chrome') {
      setChromeDirtyUI(false);
      chromeFocusKindSticky = null;
      win.__sveChromeKind = null;
      exitChromeFocus(win, false);

      return;
    }

    if (data.type === 'sve-force-exit-global') {
      setGlobalSectionDirtyUI(false);
      exitGlobalFocus(win, false);

      return;
    }

    // Where the CP's floating "back" pill sits, in our coordinates — so a
    // section's control can step out from under it.
    if (data.type === 'sve-pill-box') {
      pillBox = { bottom: data.bottom, left: data.left };

      return;
    }

    // The block tree asking for a row to be selected the way clicking it on the
    // page selects it — outlined, scrolled to, and with its toolbar up.
    //
    // A message rather than a synthesised click: a click carries a position, and
    // the position is what decides which block of a Bard field is being edited.
    // There is no position here, so the element is named instead and the rest of
    // the flow is the ordinary one.
    if (data.type === 'sve-activate') {
      activateByUid(win, data);

      return;
    }

    if (data.type === 'edit-start') {
      startEditing(win, data);

      return;
    }

    // Panel still hydrating — stretch the pending-edit window so a quick click
    // right after entering a global section isn't abandoned at 2s.
    if (data.type === 'edit-pending') {
      if (pendingEdit && pendingEdit.requestId === data.requestId) {
        clearTimeout(pendingEdit.timeout);
        pendingEdit.timeout = setTimeout(() => {
          if (pendingEdit && pendingEdit.requestId === data.requestId) {
            pendingEdit = null;
          }
        }, 10000);
      }

      return;
    }

    if (data.type === 'edit-deny') {
      if (pendingEdit && pendingEdit.requestId === data.requestId) {
        const { popupFallback } = pendingEdit;

        clearTimeout(pendingEdit.timeout);
        pendingEdit = null;

        // Dual popup+field element whose click didn't resolve to editable
        // text — open the popup, as a plain click on the block always did.
        if (popupFallback) {
          win.parent.postMessage(popupFallback, win.location.origin);
        }
      }

      return;
    }

    if (data.type === 'hover') {
      win.document.querySelectorAll(`[${HOVER_ATTR}]`).forEach((el) => {
        el.removeAttribute(HOVER_ATTR);
      });

      // Field-handle hover: highlight the element annotated with data-sid-field.
      if (data.field) {
        const el = findFieldElement(data.field, win.document, data.scope);

        if (el) {
          applyOutlineTone(win, el);
          el.setAttribute(HOVER_ATTR, '');
        }

        return;
      }

      if (data.uid) {
        const el =
          'afterSetUid' in data
            ? findTextAfterSetUid(data.uid, data.afterSetUid, win.document)
            : win.document.querySelector(`[${SID_ATTR}="${data.uid}"]`);

        if (el) {
          applyOutlineTone(win, el);
          el.setAttribute(HOVER_ATTR, '');
        }
      }

      return;
    }

    if (data.type === 'focus') {
      win.document.querySelectorAll(`[${ACTIVE_ATTR}]`).forEach((el) => {
        el.removeAttribute(ACTIVE_ATTR);
      });

      // Field-handle focus: highlight the element annotated with data-sid-field.
      if (data.field) {
        const el = findFieldElement(data.field, win.document, data.scope);

        if (el) {
          applyOutlineTone(win, el);
          el.setAttribute(ACTIVE_ATTR, '');

          // Only scroll when the lookup was scoped to a specific set. An
          // unscoped lookup of a repeated handle (e.g. "text" clicked inside
          // a column popup) resolves to the first match in the document and
          // would yank the preview to the top of the page mid-edit.
          if (data.scope) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            pulseElement(el);
          }
        }

        return;
      }

      if (data.uid) {
        const el =
          'afterSetUid' in data
            ? findTextAfterSetUid(data.uid, data.afterSetUid, win.document)
            : win.document.querySelector(`[${SID_ATTR}="${data.uid}"]`);

        if (el) {
          applyOutlineTone(win, el);
          el.setAttribute(ACTIVE_ATTR, '');

          // Bard text focus (afterSetUid) fires on every click while editing
          // in the editor — keep the highlight but don't move the page under
          // the user. Set-level focus (no afterSetUid) still scrolls, so
          // clicking a section in the CP locates it in the preview.
          if (!('afterSetUid' in data)) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            pulseElement(el);
          }
        }
      }
    }
  };
}

/**
 * Selects the block a uid names, as a click on it would.
 *
 * Two ids are offered, because a block is annotated twice and not always with
 * the same one. `data-sid` carries the set's `_visual_id`, injected into the
 * blueprint; `data-sid-field-uid` carries whatever the template passed as
 * `scope`, which is conventionally the row's own `id`. A tree built from the
 * stored values knows both and cannot tell which the template chose, so it sends
 * both and the first that matches anything wins.
 *
 * The toolbar only comes up when the block has exactly one annotated field. With
 * several — a section, say — there is no one thing that was clicked, and opening
 * the first of them would be a guess presented as an answer.
 */
function activateByUid(win, data) {
  const doc = win.document;
  const ids = (Array.isArray(data.ids) ? data.ids : [data.uid, data.rowId]).filter(Boolean);
  let el = null;

  // The field annotation is tried before the set one, and both are tried for
  // every id. A block is often marked as a field on the element that draws it
  // and as a set on nothing at all, so looking only for `data-sid` finds the
  // section it sits in — and outlining the section when a headline was asked for
  // looks exactly like the feature not working.
  for (const id of ids) {
    el = doc.querySelector(`[data-sid-field-uid="${CSS.escape(id)}"]`);

    if (el) {
      break;
    }
  }

  if (!el) {
    for (const id of ids) {
      el = doc.querySelector(`[${SID_ATTR}="${CSS.escape(id)}"]`);

      if (el) {
        break;
      }
    }
  }

  if (!el) {
    return;
  }

  doc.querySelectorAll(`[${ACTIVE_ATTR}]`).forEach((node) => node.removeAttribute(ACTIVE_ATTR));
  applyOutlineTone(win, el);
  el.setAttribute(ACTIVE_ATTR, '');
  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  pulseElement(el);

  const fields = el.matches(`[${SID_FIELD_ATTR}]`)
    ? [el]
    : [...el.querySelectorAll(`[${SID_FIELD_ATTR}]`)];

  if (fields.length !== 1) {
    openRowToolbar(win, el);

    return;
  }

  // `event.target === wrapper` on purpose: it is what tells requestInlineEdit
  // that no particular block within the field was aimed at, so the whole field
  // is the subject — which is exactly the case when the click came from a list.
  requestInlineEdit(win, fields[0], { target: fields[0] });
}

/**
 * The preview is for editing, not for browsing: following a link would replace
 * the page being edited with another one, inside an iframe with no way back.
 * So links (and form submits) are stopped before they navigate.
 *
 * Only the navigation is cancelled — the event still propagates, so clicking a
 * link keeps doing everything else it does here: selecting its section, opening
 * its field, starting an inline edit.
 *
 * Registered before the editor's own click handler so it runs first, whatever
 * that one decides to do with the event.
 */
function blockNavigation(win) {
  const stopLink = (event) => {
    // Modified clicks would open a new tab rather than leave the preview — but
    // "no navigation at all" is the point, so those go too.
    if (event.target.closest?.('a[href]')) {
      event.preventDefault();
    }
  };

  win.document.addEventListener('click', stopLink, true);
  win.document.addEventListener('auxclick', stopLink, true); // middle-click
  win.document.addEventListener(
    'submit',
    (event) => event.preventDefault(),
    true
  );
}

export function initBridge(win = window) {
  if (win.self === win.parent) {
    return;
  }

  // Morph/HTML refresh must not stack duplicate listeners or wipe chrome state.
  if (win.__sveBridgeReady) {
    return;
  }

  win.__sveBridgeReady = true;

  // Shared with preview.js (same window): while an inline edit is active, hot
  // reload defers its morph so the DOM under the caret is never replaced.
  win.__sveInlineEdit = win.__sveInlineEdit || { active: false };

  injectStyles(win.document);
  injectCpVariables(win.document, win);
  markDisabledChrome(win.document);

  // The site's live-preview hot-reload script replaces every <style> in <head>
  // on each content update, which strips our injected styles and kills the
  // dashed outlines until a full refresh. Watch <head> and re-inject.
  new win.MutationObserver(() => {
    if (!win.document.getElementById(STYLES_ID)) {
      injectStyles(win.document);
    }
  }).observe(win.document.head, { childList: true });
  blockNavigation(win);
  win.document.addEventListener('click', createClickHandler(win), true);
  win.document.addEventListener('mousemove', createMouseMoveHandler(win), true);

  const hoverHandler = createHoverHandler(win);

  win.document.addEventListener('mouseover', hoverHandler, true);
  // When the pointer leaves the iframe document (e.g. moves into the CP chrome),
  // immediately tell the CP to clear its hover outline.
  win.document.addEventListener('mouseleave', () => hoverHandler.reset(), true);
  win.addEventListener('message', createMessageReceiver(win));

  // Drag & drop reordering for [data-sid-orderable] rows.
  win.document.addEventListener('pointerdown', createDragPointerDown(win), true);
  win.document.addEventListener('pointermove', createDragPointerMove(win), true);
  win.document.addEventListener('pointerup', createDragPointerUp(win), true);
  win.document.addEventListener(
    'pointercancel',
    () => {
      if (widthDrag) {
        finishWidthDrag(win, true);
      }

      endDrag(win);
    },
    true
  );

  // A hot-reload morph replaces section elements — drop the move control so it
  // never points at a detached node; the next hover recreates it. Same for a
  // drag in flight: its element and peers are about to be detached.
  win.addEventListener('statamic:preview-updated', () => {
    if (htmlPick) {
      applyHtmlPick(win);
    }

    hideMoveControl(win);
    hideColumnChrome(win);
    win.document.querySelector('[data-sve-menu]')?.remove();
    // No fade here: the grid the tracks were measured against is being replaced,
    // so there is nothing left for them to sit on while they bow out.
    hideGridLines(true);
    endDrag(win);

    if (widthDrag) {
      finishWidthDrag(win, true);
    }

    // Rebuild {…} → coloured spans if the morph left literal braces.
    enhanceHighlightBraces(win);

    // Morph may replace body nodes. Keep html.sve-chrome-focus-* intact —
    // never exit/enter chrome here (that was the open/close flicker).
    // Same for global focus: exitGlobalFocus+enter used to clear globalFocusId
    // when the new node wasn't ready yet — then H1→H2 (and any control morph)
    // left the section "unfocused", so the next click opened the enter-dialog
    // instead of the inline toolbar.
    const focusedId = globalFocusId;
    const focusedChrome = rememberedChromeKind();

    tagGlobalSections(win);

    if (focusedId) {
      rebindGlobalFocus(win, focusedId);
    } else if (focusedChrome) {
      // One path for every morph, surgical or full-body. The old code only
      // re-pointed at the node when Alpine had replaced it, and left the rest
      // alone on the grounds that a surgical morph keeps everything — but it
      // doesn't: the morph patches the chrome node against server HTML, which
      // carries no `data-sve-chrome-focused`, so the attribute is stripped off
      // the very node it kept. A full-body morph additionally takes the bar with
      // it, since that lives in <body>.
      //
      // `rebindChromeFocus` is the soft rebind — it re-asserts the html class
      // without clearing it first, re-tags the node, and remounts the bar only
      // when it is actually gone. It never exits and re-enters, which is what
      // used to flicker.
      rebindChromeFocus(win, focusedChrome);
    }

    setupInserters(win); // fresh blocks after the morph
    syncSidPlaceholders(win.document);
  });

  // Escape asks to leave chrome / global focus (CP warns if dirty).
  win.document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !editing) {
      if (win.document.getElementById('__sve-preview-confirm')) {
        win.document.getElementById('__sve-preview-confirm')?.remove();

        return;
      }

      if (chromeFocusEl || hasChromeFocusClass(win.document)) {
        requestCloseChrome(win);
      } else if (globalFocusEl) {
        requestCloseGlobal(win);
      }
    }
  });

  tagGlobalSections(win);

  // The CP posts the pill's box when its chrome re-renders — which has already
  // happened by the time we boot in here. Ask for it, now that we're listening.
  win.parent.postMessage({ source: 'statamic-visual-editor', type: 'sve-pill-box-request' }, win.location.origin);

  // Block inserters: wire them up now, keep them pinned as the preview scrolls or
  // resizes, and rebuild after a morph brings in fresh blocks.
  setupInserters(win);
  enhanceHighlightBraces(win);
  syncSidPlaceholders(win.document);
  win.addEventListener('scroll', () => repositionInserters(win), true);
  win.addEventListener('resize', () => repositionInserters(win));
}

// --- Block inserter: a single "+" after the last block --------------------------
//
// A container marked `data-sid-insert="<field>"` (via {{ visual_edit
// insertable="true" }}) gets ONE "+" after its last block. Shown while the
// container (or the "+") is hovered. Clicking opens Statamic's Add Set picker
// and inserts after that last block. An empty field gets a single, always-
// visible "+" to start it off. Orientation follows the layout: stacked blocks
// get a horizontal divider, a row of blocks gets a vertical one.

const INSERT_ATTR = 'data-sid-insert';
const INSERT_LAYER_ID = '__sve-inserters';
// Sit the stacked "+" just below the last block, not straddling its bottom edge.
const INSERT_AFTER_GAP = 8;
let inserterInstances = [];

function collectSidFieldDefaults(root) {
  const out = {};

  if (!root?.querySelectorAll) {
    return out;
  }

  root.querySelectorAll('[data-sid-field][data-sid-default]').forEach((el) => {
    const field = el.getAttribute('data-sid-field');
    const value = el.getAttribute('data-sid-default');

    if (field && value != null && value !== '') {
      out[field] = value;
    }
  });

  return out;
}

function sidTemplatePayload(el) {
  const container = el?.hasAttribute?.(INSERT_ATTR) ? el : el?.closest?.(`[${INSERT_ATTR}]`);
  const row = el?.closest?.('[data-sid-orderable]');
  const containerTemplate =
    container?.getAttribute('data-sid-template') || el?.getAttribute?.('data-sid-template') || '';
  const rowTemplate =
    row?.getAttribute('data-sid-template') ||
    container?.getAttribute('data-sid-row-template') ||
    '';
  const fieldDefaults = collectSidFieldDefaults(container || el);
  const extra = {};

  if (container?.getAttribute(INSERT_ATTR)) {
    extra.field = container.getAttribute(INSERT_ATTR);
  }

  // A click on an existing row uses that row's template (`icon|title` on the
  // <li>). The container's `3:item` is only for seeding a new list.
  extra.template = rowTemplate || containerTemplate;
  extra.rowTemplate = rowTemplate;
  extra.containerTemplate = containerTemplate;

  if (Object.keys(fieldDefaults).length) {
    extra.fieldDefaults = fieldDefaults;
  }

  return extra;
}

/**
 * Is this global section the one being edited?
 *
 * A morph can strip the focus attribute, so the id we are focused on counts too
 * — the same recovery the click handler does.
 */
function isGlobalFocused(section) {
  return (
    section.hasAttribute(GLOBAL_FOCUS_ATTR) ||
    (!!globalFocusId && globalFocusId === section.getAttribute(GLOBAL_ATTR))
  );
}

function ensureInserterLayer(win) {
  let layer = win.document.getElementById(INSERT_LAYER_ID);

  if (!layer) {
    layer = win.document.createElement('div');
    layer.id = INSERT_LAYER_ID;
    layer.style.cssText = 'position:fixed;inset:0;z-index:2147482400;pointer-events:none;';
    win.document.body.appendChild(layer);
  }

  return layer;
}

/**
 * One "+" after the last block (or in an empty container), shown while the
 * insertable container — or the "+" itself — is hovered.
 */
function setupInserters(win) {
  const layer = ensureInserterLayer(win);

  layer.innerHTML = '';
  inserterInstances = [];

  win.document.querySelectorAll(`[${INSERT_ATTR}]`).forEach((container) => {
    if (!container.getAttribute('data-sid-row-template')) {
      const row = [...container.querySelectorAll('[data-sid-orderable][data-sid-template]')].find(
        (el) => el !== container
      );

      if (row?.getAttribute('data-sid-template')) {
        container.setAttribute('data-sid-row-template', row.getAttribute('data-sid-template'));
      }
    }

    // Bard whole-field (inline_edit): uses its own empty-paragraph "+" / SetPicker,
    // not the Style 2 replicator inserter strip.
    if (
      container.hasAttribute('data-sid-inline-edit') ||
      container.hasAttribute('data-sid-bard-sets')
    ) {
      return;
    }

    // Inside a global section you have not stepped into: its blocks belong to
    // the synced source, not to this page, and the "+" would offer to add one
    // to a field the page cannot edit. Worse, the inserter draws in an overlay
    // layer outside the section, so clicking it reads as a click outside the
    // global section and asks you to leave it. Entering the section calls this
    // again, and the "+" appears then.
    const globalSection = container.closest(`[${GLOBAL_ATTR}]`);

    if (globalSection && !isGlobalFocused(globalSection)) {
      return;
    }

    let sets = [];

    try {
      sets = JSON.parse(container.getAttribute('data-sid-insert-sets') || '[]');
    } catch {
      sets = [];
    }

    if (!sets.length) {
      return;
    }

    const field = container.getAttribute(INSERT_ATTR);
    const scope = container.getAttribute('data-sid-insert-scope');

    // A block is a direct child of the insertable container, annotated three
    // ways: as a set (data-sid), as an orderable row, or as the field it edits
    // (data-sid-field). Headline/richtext put orderable on themselves so a
    // wrapper is not needed (a wrapper breaks the parent's `> * + *` / flow-y).
    // A links wrapper is only data-sid-field — the buttons inside are the
    // orderable rows. Counting SID/orderable alone skipped that last block, so
    // the "+" sat on the richtext. Only direct children, never nested fields.
    const blocks = [...container.children].filter(
      (child) =>
        child.hasAttribute(SID_ATTR) ||
        child.hasAttribute(ORDERABLE_ATTR) ||
        child.hasAttribute(SID_FIELD_ATTR)
    );

    // A field that is full has nothing to offer. The Control Panel greys out its
    // Add Set button at `max_sets`; this "+" is the addon's own control, so it
    // has to be told — otherwise the preview invites an insert the form refuses.
    const max = Number(container.getAttribute('data-sid-insert-max'));

    if (Number.isFinite(max) && max > 0 && blocks.length >= max) {
      return;
    }

    if (!blocks.length) {
      const inst = buildInserter(win, { field, sets, scope, container, empty: true });

      inst.el.style.opacity = '1';
      layer.appendChild(inst.el);
      inserterInstances.push(inst);

      return;
    }

    // Orientation from the blocks themselves: two blocks that differ more in x
    // than in y sit side by side (→ a vertical divider), else stacked.
    let horizontal = false;

    if (blocks.length >= 2) {
      const a = blocks[0].getBoundingClientRect();
      const b2 = blocks[1].getBoundingClientRect();

      horizontal = Math.abs(b2.left - a.left) > Math.abs(b2.top - a.top);
    } else {
      // One block left and nothing to measure against — ask the container how it
      // lays its children out. It matters: a two-column section down to its last
      // block would otherwise offer a full-width bar under the text, which reads
      // as the inserter of whatever replicator is *inside* that block rather than
      // as the way to put the second column back.
      const style = win.getComputedStyle(container);
      const display = style.display;

      if (display === 'flex' || display === 'inline-flex') {
        horizontal = style.flexDirection.startsWith('row');
      } else if (display === 'grid' || display === 'inline-grid') {
        horizontal =
          style.gridAutoFlow.startsWith('column') ||
          style.gridTemplateColumns.split(' ').filter(Boolean).length > 1;
      }
    }

    const lastBlock = blocks[blocks.length - 1];
    const inst = buildInserter(win, {
      field,
      sets,
      block: lastBlock,
      position: 'after',
      horizontal,
      scope,
      container,
    });

    layer.appendChild(inst.el);
    inserterInstances.push(inst);

    let hideTimer = null;
    const show = () => {
      clearTimeout(hideTimer);
      inst.el.style.opacity = '1';
    };
    const hide = () => {
      hideTimer = win.setTimeout(() => {
        inst.el.style.opacity = '0';
      }, 120);
    };

    // Hover the whole insertable area (not each block) so one "+" appears
    // after the last block whenever the section content is hovered.
    container.addEventListener('pointerenter', show);
    container.addEventListener('pointerleave', hide);
    inst.el.addEventListener('pointerenter', show);
    inst.el.addEventListener('pointerleave', hide);
  });

  repositionInserters(win);
}

function repositionInserters(win) {
  inserterInstances.forEach((inst) => positionInserter(win, inst));
}

function contentColumnRect(inst) {
  const kids = [...(inst.container?.children || [])].filter(
    (child) =>
      child.hasAttribute(SID_ATTR) ||
      child.hasAttribute(ORDERABLE_ATTR) ||
      child.hasAttribute(SID_FIELD_ATTR)
  );
  const fallback = inst.block.getBoundingClientRect();

  if (!kids.length) {
    return { left: fallback.left, width: fallback.width };
  }

  let left = Infinity;
  let right = -Infinity;

  kids.forEach((child) => {
    const box = child.getBoundingClientRect();

    left = Math.min(left, box.left);
    right = Math.max(right, box.right);
  });

  return { left, width: right - left };
}

function positionInserter(win, inst) {
  const el = inst.el;
  const line = el.__line;

  if (inst.empty) {
    const r = inst.container.getBoundingClientRect();

    el.style.left = `${r.left}px`;
    el.style.top = `${r.top + 6}px`;
    el.style.width = `${r.width}px`;
    el.style.height = '30px';
    el.style.flexDirection = 'row';
    line.style.cssText = 'height:2px;flex:1;background:rgba(99,102,241,.45);';

    return;
  }

  const r = inst.block.getBoundingClientRect();

  if (inst.horizontal) {
    el.style.left = `${r.right - 15}px`;
    el.style.top = `${r.top}px`;
    el.style.width = '30px';
    el.style.height = `${r.height}px`;
    el.style.flexDirection = 'column';
    line.style.cssText = 'width:2px;flex:1;background:rgba(99,102,241,.55);';

    // In a grid_view section the resize handle sits on this very edge, centred.
    // Two controls in one spot means one of them cannot be used, so the "+"
    // moves to the foot of the strip — the far end of the same line, still
    // plainly "add one after this".
    if (el.__btn) {
      const shared = inst.container.hasAttribute(GRID_ATTR);

      el.__btn.style.top = shared ? 'auto' : '';
      el.__btn.style.bottom = shared ? '0' : '';
    }
  } else {
    // Width of the blocks in the column (headline, text, links) — not the
    // insertable container. That box is often the whole section: a hero image
    // is `absolute`, so the container still stretches under it to the viewport.
    const col = contentColumnRect(inst);

    el.style.left = `${col.left}px`;
    el.style.top = `${r.bottom + INSERT_AFTER_GAP}px`;
    el.style.width = `${col.width}px`;
    el.style.height = '30px';
    el.style.flexDirection = 'row';
    line.style.cssText = 'height:2px;flex:1;background:rgba(99,102,241,.55);';

    if (el.__btn) {
      el.__btn.style.top = '';
      el.__btn.style.bottom = '';
    }
  }
}

function buildInserter(win, opts) {
  const doc = win.document;
  const wrap = doc.createElement('div');

  wrap.style.cssText =
    'position:fixed;pointer-events:none;display:flex;align-items:center;justify-content:center;' +
    'opacity:0;transition:opacity .1s;';

  const line = doc.createElement('div');
  const btn = doc.createElement('button');

  btn.type = 'button';
  btn.textContent = '+';
  btn.style.cssText =
    'pointer-events:auto;position:absolute;width:26px;height:26px;border:none;border-radius:7px;cursor:pointer;' +
    'background:#18181b;color:#fff;font-size:17px;line-height:1;display:flex;align-items:center;justify-content:center;' +
    'box-shadow:0 2px 8px rgba(0,0,0,.3);';
  btn.addEventListener('mouseenter', () => (btn.style.background = 'var(--theme-color-primary,#4f46e5)'));
  btn.addEventListener('mouseleave', () => (btn.style.background = '#18181b'));
  btn.addEventListener('click', (event) => {
    event.stopPropagation();
    event.preventDefault();
    // Hand off to Statamic's own Add Set picker (opened in the CP), rather than a
    // little popover of our own — native search, groups, previews, and insert.
    // Pass the + button's rect so the CP can pin the picker under it in the
    // preview (instead of leaving it in the sidebar).
    const r = btn.getBoundingClientRect();
    const inGlobal = !!opts.container?.closest?.(`[${GLOBAL_FOCUS_ATTR}]`);

    const send = (extra = {}) =>
      win.parent.postMessage(
        {
          source: 'statamic-visual-editor',
          type: 'add-block-native',
          anchorUid: opts.block
            ? opts.block.getAttribute(SID_ATTR) || opts.block.getAttribute('data-sid-field-uid')
            : null,
          sectionUid: opts.scope || null,
          // A global section's fields are not in the page's form — they live in
          // the panel docked beside the preview. The CP needs to know which form
          // to work in, and only we can see where the "+" is sitting.
          global: inGlobal,
          position: opts.position || null,
          anchorRect: {
            left: r.left,
            top: r.top,
            bottom: r.bottom,
            right: r.right,
            width: r.width,
            height: r.height,
          },
          ...extra,
          ...sidTemplatePayload(opts.container),
        },
        win.location.origin
      );

    // In a global section the CP opens Statamic's picker itself, over the
    // preview, because the section's own form is in the panel and its picker
    // would appear over there. It needs the list to do that.
    send({ sets: opts.sets || [] });
  });

  wrap.appendChild(line);
  wrap.appendChild(btn);
  wrap.__line = line;
  wrap.__btn = btn;

  return { el: wrap, ...opts };
}

initBridge();
