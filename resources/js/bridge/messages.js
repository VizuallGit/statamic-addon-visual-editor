/**
 * bridge.js — region "messages", split out in WP5. Same statements, same order;
 * only the imports are new. See the barrel bridge.js for what the shell exports.
 */
import { EDITING_ATTR, STYLES_ID } from '../bridge.js';

// ===== messages =====
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
        /* Editing a component: the page around it fades so it is obvious which
           piece the dock is writing. Unlike a global section this is not a
           lock — the page stays clickable, because it says where you are, it
           does not ask you to leave. */
        html.sve-component-focus [data-sve-component-dim] {
            opacity: 0.3;
            transition: opacity 0.2s ease;
        }
        html.sve-component-focus [data-sve-component-focused] {
            outline: 2px solid #7c3aed;
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
        /* The half being edited stays as it is; the REST of the page fades —
           <main>, the other half, and any sibling of the half in <body> that
           does not hold it. Faded by opacity on those parts, not by a scrim
           over everything: a header with no background of its own showed the
           scrim through it and read as faded too. The faded parts take no
           clicks — a click on them lands on <body> and is the way out. */
        html.sve-chrome-focus-header main,
        html.sve-chrome-focus-header [data-sve-chrome="footer"],
        html.sve-chrome-focus-header body > :not([data-sve-chrome="header"]):not(:has([data-sve-chrome="header"])):not(script):not(style),
        html.sve-chrome-focus-footer main,
        html.sve-chrome-focus-footer [data-sve-chrome="header"],
        html.sve-chrome-focus-footer body > :not([data-sve-chrome="footer"]):not(:has([data-sve-chrome="footer"])):not(script):not(style) {
            opacity: 0.35 !important;
            pointer-events: none !important;
        }
        html.sve-chrome-focus-header [data-sve-chrome="header"],
        html.sve-chrome-focus-footer [data-sve-chrome="footer"] {
            outline: 3px solid #0f766e !important;
            outline-offset: -3px;
            opacity: 1 !important;
            pointer-events: auto !important;
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
