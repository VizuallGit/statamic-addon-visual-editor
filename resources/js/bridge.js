// Bridge script — injected into the Live Preview iframe.
// Only activates when running inside an iframe (window.self !== window.top).

const ACTIVE_ATTR = 'data-sid-active';
const HOVER_ATTR = 'data-sid-hover';
const INNER_ATTR = 'data-sid-inner';
const SID_ATTR = 'data-sid';
const SID_FIELD_ATTR = 'data-sid-field';
const STYLES_ID = '__sve-bridge-styles';
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
  // Thin (1px) preview outlines, intentionally fixed rather than inherited from
  // the CP's --focus-outline-width — the in-preview highlight should stay subtle.
  const outlineWidth = '2px';
  // Opacity applied to outline colors so the highlight reads as a gentle hint
  // rather than an aggressive solid border. Tweak here to make it lighter/darker.
  const outlineOpacity = '60%';
  let focusColor = 'currentColor';
  let hoverColor = '#9CA3AF';

  try {
    const cpStyle = getComputedStyle(win.top.document.documentElement);
    focusColor = cpStyle.getPropertyValue('--focus-outline-color').trim() || focusColor;
    hoverColor = cpStyle.getPropertyValue('--theme-color-gray-400').trim() || hoverColor;
  } catch {
    // cross-origin or CP not accessible — use defaults
  }

  doc.documentElement.style.setProperty('--sve-outline-width', outlineWidth);
  doc.documentElement.style.setProperty('--sve-outline-opacity', outlineOpacity);
  doc.documentElement.style.setProperty('--sve-focus-color', focusColor);
  doc.documentElement.style.setProperty('--sve-hover-color', hoverColor);
}

export function injectStyles(doc) {
  if (doc.getElementById(STYLES_ID)) {
    return;
  }

  const style = doc.createElement('style');

  style.id = STYLES_ID;
  style.textContent = `
        [data-sid], [data-sid-field] {
            cursor: pointer;
            outline-width: var(--sve-outline-width, 1px);
            outline-style: dashed;
            outline-color: transparent;
            outline-offset: 2px;
            transition: outline-color 0.15s ease;
        }
        .${MOUSE_ACTIVE_CLASS} [data-sid], .${MOUSE_ACTIVE_CLASS} [data-sid-field] {
            outline-color: color-mix(in srgb, var(--sve-hover-color, #9CA3AF) var(--sve-outline-opacity, 55%), transparent);
        }
        [data-sid-inner],
        [data-sid-hover] {
            outline-width: var(--sve-outline-width, 1px) !important;
            outline-style: dashed !important;
            outline-color: color-mix(in srgb, var(--sve-focus-color, currentColor) var(--sve-outline-opacity, 55%), transparent) !important;
            outline-offset: 2px;
        }
        [data-sid-active] {
            outline-width: var(--sve-outline-width, 1px) !important;
            outline-style: solid !important;
            outline-color: color-mix(in srgb, var(--sve-focus-color, currentColor) var(--sve-outline-opacity, 55%), transparent) !important;
            outline-offset: 2px;
        }
        [${EDITING_ATTR}] {
            outline-width: var(--sve-outline-width, 1px) !important;
            outline-style: dashed !important;
            outline-color: color-mix(in srgb, var(--sve-focus-color, currentColor) var(--sve-outline-opacity, 55%), transparent) !important;
            outline-offset: 4px;
            cursor: text !important;
        }
        [${EDITING_ATTR}]:focus {
            /* suppress the site's own focus ring so only the edit outline shows */
            box-shadow: none;
        }
        [data-sid-inside] {
            outline-offset: -2px;
        }
        [data-sid-inside][data-sid-inner],
        [data-sid-inside][data-sid-hover],
        [data-sid-inside][data-sid-active] {
            outline-offset: -2px !important;
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
            background: var(--sve-focus-color, currentColor);
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
 * Sends an edit-request for the clicked [data-sid-field] element. The CP
 * decides whether (and what exactly) it is editable; nothing changes in the
 * DOM until an edit-start reply arrives.
 */
function requestInlineEdit(win, wrapper, event, options = {}) {
  // The direct child of the wrapper containing the click — for Bard fields this
  // is the block element (h1/p/…) whose index maps to the ProseMirror node.
  let blockEl = null;

  if (event.target !== wrapper) {
    let node = event.target;

    while (node.parentElement && node.parentElement !== wrapper) {
      node = node.parentElement;
    }

    if (node.parentElement === wrapper) {
      blockEl = node;
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

  win.top.postMessage(
    {
      source: 'statamic-visual-editor',
      type: 'edit-request',
      requestId,
      field: wrapper.getAttribute(SID_FIELD_ATTR),
      scope: wrapper.getAttribute('data-sid-field-uid') || undefined,
      blockIndex: blockEl ? Array.prototype.indexOf.call(wrapper.children, blockEl) : null,
      blockText: blockEl ? normText(blockEl.textContent) : null,
      wrapperText: normText(wrapper.textContent),
    },
    win.location.origin
  );
}

function sendEditInput(win, session) {
  clearTimeout(session.inputTimer);
  session.inputTimer = null;

  win.top.postMessage(
    {
      source: 'statamic-visual-editor',
      type: 'edit-input',
      requestId: session.requestId,
      text: session.el.innerText,
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
    const top = win.top;
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
    toolbarEl.remove();
    toolbarEl = null;
  }
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

  // Block-format buttons reflect the current block's tag/class.
  toolbarEl.querySelectorAll('[data-sve-block-tag]').forEach((btn) => {
    const el = editing?.el;
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
  neo.contentEditable = old.contentEditable;

  old.removeEventListener('input', session.onInput);
  old.removeEventListener('keydown', session.onKeydown);
  old.removeEventListener('blur', session.onBlur);
  old.replaceWith(neo);

  neo.addEventListener('input', session.onInput);
  neo.addEventListener('keydown', session.onKeydown);
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
  win.top.postMessage(
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
  win.top.postMessage(
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

  if (sel && sel.rangeCount) {
    const range = sel.getRangeAt(0);

    from = charOffsetWithin(session.el, range.startContainer, range.startOffset);
    to = charOffsetWithin(session.el, range.endContainer, range.endOffset);

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

  win.top.postMessage(
    {
      source: 'statamic-visual-editor',
      type: 'bard-command',
      requestId: session.requestId,
      command,
      from,
      to,
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
};

function createEditToolbar(win, session) {
  removeEditToolbar();

  const doc = win.document;
  const bar = doc.createElement('div');

  // Follow the CP's colour scheme so the toolbar matches Statamic's own Bard
  // fixed toolbar in both light and dark mode.
  const theme = toolbarThemeFor(detectCpDark(win));

  toolbarTheme = theme;

  bar.id = '__sve-edit-toolbar';
  bar.style.cssText =
    'position:fixed;z-index:2147483647;display:flex;align-items:center;gap:1px;' +
    `background:${theme.bg};color:${theme.fg};border:1px solid ${theme.border};border-radius:9px;padding:4px;` +
    `box-shadow:${theme.shadow};font-family:ui-sans-serif,system-ui,-apple-system,sans-serif;` +
    'font-size:13px;line-height:1;user-select:none;cursor:default;';

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
      'all:unset;cursor:pointer;min-width:32px;height:32px;display:inline-flex;' +
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

    bar.appendChild(btn);

    return btn;
  };

  const addSeparator = () => {
    const sep = doc.createElement('span');

    sep.style.cssText = `width:1px;height:18px;background:${theme.sep};margin:0 4px;`;
    bar.appendChild(sep);
  };

  const exec = (command, value = null) => {
    win.document.execCommand(command, false, value);
    session.onInput();
    updateEditToolbarState(win);
  };

  const addBlockButton = (label, title, spec, opts = {}) => {
    const btn = addButton(label, title, () => applyBlockFormat(win, session, spec), opts);

    btn.dataset.sveBlockTag = spec.tag;
    btn.dataset.sveBlockClass = spec.className || '';

    return btn;
  };

  if (session.mode === 'bard') {
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
        case 'color':
          // Uses bard-color-picker's own colour palette popup.
          addButton('', 'Tekstfarve', () => bardCommand(win, session, 'color'), { html: ICONS.color });
          break;
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
      win.top.postMessage(
        { source: 'statamic-visual-editor', type: 'link-edit', requestId: session.requestId },
        win.location.origin
      );
      finishEditing(win, false);
    }, { html: ICONS.anchor });
  }

  addSeparator();

  addButton('✓', 'Gem (Enter)', () => finishEditing(win, false), {
    style: 'color:#16a34a;font-weight:700;font-size:15px;',
  });
  addButton('✕', 'Annullér (Esc)', () => finishEditing(win, true), {
    style: 'color:#dc2626;font-weight:700;font-size:15px;',
  });

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

let moveCtrlEl = null;
let moveTargetEl = null;
let moveReposition = null;

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
}

function positionMoveControl(win) {
  if (!moveCtrlEl || !moveTargetEl || !moveTargetEl.isConnected) {
    return;
  }

  const rect = moveTargetEl.getBoundingClientRect();
  const height = moveCtrlEl.offsetHeight || 32;
  const width = moveCtrlEl.offsetWidth || 32;

  // Small elements (buttons, grid rows): center the control above the element
  // so it never covers the content. Tall sections: pin to the top-right corner.
  if (rect.height < 140) {
    let top = rect.top - height - 6;

    if (top < 8) {
      top = rect.bottom + 6;
    }

    moveCtrlEl.style.top = `${top}px`;
    moveCtrlEl.style.left = `${Math.max(rect.left + (rect.width - width) / 2, 8)}px`;
  } else {
    const top = Math.min(Math.max(rect.top + 10, 10), Math.max(rect.bottom - height - 10, 10));

    moveCtrlEl.style.top = `${top}px`;
    moveCtrlEl.style.left = `${Math.max(rect.right - width - 10, 10)}px`;
  }
}

/** True when el's siblings flow horizontally (flex-row parent). */
function isHorizontalFlow(win, el) {
  const parent = el.parentElement;

  if (!parent) {
    return false;
  }

  const style = win.getComputedStyle(parent);

  return style.display.includes('flex') && !style.flexDirection.startsWith('column');
}

function showMoveControl(win, moveEl) {
  if (moveTargetEl === moveEl) {
    return;
  }

  hideMoveControl(win);

  // Sections carry data-sid; field-annotated rows (e.g. buttons) identify
  // their row through the field scope uid instead.
  const uid = moveEl.getAttribute(SID_ATTR) || moveEl.getAttribute('data-sid-field-uid');

  if (!uid) {
    return;
  }

  // A single row/section has nowhere to move — no arrows. Peers are sibling
  // elements of the same kind: move-annotated rows, or sections for sections.
  const peers = moveEl.parentElement
    ? [...moveEl.parentElement.children].filter((el) =>
        moveEl.hasAttribute('data-sid-move')
          ? el.hasAttribute('data-sid-move')
          : el.tagName === 'SECTION' && el.hasAttribute(SID_ATTR)
      )
    : [];

  if (peers.length <= 1) {
    return;
  }

  moveTargetEl = moveEl;

  const doc = win.document;
  const ctrl = doc.createElement('div');
  const horizontal = isHorizontalFlow(win, moveEl);

  ctrl.id = '__sve-move-ctrl';
  ctrl.style.cssText =
    `position:fixed;z-index:2147483646;display:flex;flex-direction:${horizontal ? 'row' : 'column'};gap:2px;` +
    'background:#1f2937;color:#fff;border-radius:8px;padding:3px;' +
    'box-shadow:0 4px 16px rgba(0,0,0,0.35);font-family:sans-serif;user-select:none;';

  const addArrow = (glyph, title, direction) => {
    const btn = doc.createElement('button');

    btn.type = 'button';
    btn.textContent = glyph;
    btn.title = title;
    btn.style.cssText =
      'all:unset;cursor:pointer;width:26px;height:26px;display:inline-flex;align-items:center;' +
      'justify-content:center;border-radius:5px;font-size:14px;box-sizing:border-box;';
    btn.addEventListener('mouseenter', () => (btn.style.background = 'rgba(255,255,255,0.14)'));
    btn.addEventListener('mouseleave', () => (btn.style.background = 'transparent'));
    btn.addEventListener('mousedown', (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      win.top.postMessage(
        { source: 'statamic-visual-editor', type: 'move', uid, direction },
        win.location.origin
      );
    });
    ctrl.appendChild(btn);
  };

  if (horizontal) {
    addArrow('←', 'Flyt til venstre', -1);
    addArrow('→', 'Flyt til højre', 1);
  } else {
    addArrow('↑', 'Flyt op', -1);
    addArrow('↓', 'Flyt ned', 1);
  }

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

  const el = data.target === 'block' && blockEl ? blockEl : editableFromWrapper(wrapper);

  // The toolbar for a Bard field is built from the field's own `buttons` config,
  // emitted by the visual_edit tag on the wrapper (data-sid-bard-buttons) plus a
  // name→{type,class} map for its bard-texstyle styles (data-sid-bard-styles).
  let bardButtons = null;
  let bardStyles = null;

  try {
    const raw = wrapper.getAttribute('data-sid-bard-buttons');

    bardButtons = raw ? raw.split(',').map((s) => s.trim()).filter(Boolean) : null;

    const stylesRaw = wrapper.getAttribute('data-sid-bard-styles');

    bardStyles = stylesRaw ? JSON.parse(stylesRaw) : null;
  } catch {
    /* malformed config — fall back to defaults */
  }

  const session = {
    requestId: data.requestId,
    mode: data.mode, // 'string' | 'bard'
    hasLink: !!data.hasLink,
    bardButtons,
    bardStyles,
    // Block-level bard-texstyle classes (paragraph/heading types) — used to
    // reset an element's style class before applying a new block format.
    blockClasses: bardStyles
      ? Object.values(bardStyles)
          .filter((s) => s.type !== 'span' && s.class)
          .map((s) => s.class)
      : [],
    // Span-type bard-texstyle classes → recognized as btsSpan marks by the CP.
    spanClasses: bardStyles
      ? Object.values(bardStyles)
          .filter((s) => s.type === 'span' && s.class)
          .map((s) => s.class)
      : [],
    el,
    restoreHtml: el.innerHTML,
    hadContentEditable: el.getAttribute('contenteditable'),
    inputTimer: null,
    dirty: false,
  };

  if (data.mode === 'bard') {
    // Full contenteditable so execCommand formatting (toolbar + ⌘B/⌘I) works.
    // Whatever markup lands in the DOM is sanitized by the CP-side parser —
    // only semantic tags become marks, everything else is flattened to text.
    el.contentEditable = 'true';

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

  el.setAttribute(EDITING_ATTR, '');

  session.onInput = () => {
    session.dirty = true;
    clearTimeout(session.inputTimer);
    session.inputTimer = setTimeout(() => sendEditInput(win, session), EDIT_INPUT_DEBOUNCE);
    positionEditToolbar(win, session);
  };

  session.onKeydown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      finishEditing(win, true);

      return;
    }

    if (e.key === 'Enter') {
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

  session.onBlur = () => {
    if (!session.suspendBlur) {
      finishEditing(win, false);
    }
  };

  session.onSelectionChange = () => updateEditToolbarState(win);
  session.reposition = () => positionEditToolbar(win, session);

  el.addEventListener('input', session.onInput);
  el.addEventListener('keydown', session.onKeydown);
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
  el.removeEventListener('blur', session.onBlur);
  win.document.removeEventListener('selectionchange', session.onSelectionChange);
  win.removeEventListener('scroll', session.reposition, true);
  win.removeEventListener('resize', session.reposition);
  removeEditToolbar();

  if (!cancelled && session.dirty) {
    sendEditInput(win, session);
  }

  win.top.postMessage(
    {
      source: 'statamic-visual-editor',
      type: 'edit-end',
      requestId: session.requestId,
      cancelled: !!cancelled,
    },
    win.location.origin
  );

  el.removeAttribute(EDITING_ATTR);

  if (session.hadContentEditable === null) {
    el.removeAttribute('contenteditable');
  } else {
    el.setAttribute('contenteditable', session.hadContentEditable);
  }

  if (cancelled) {
    el.innerHTML = session.restoreHtml;
  }

  if (win.document.activeElement === el) {
    el.blur();
  }

  win.__sveInlineEdit.active = false;
  win.dispatchEvent(new CustomEvent('sve:inline-edit-end'));
}

/**
 * On every mouse movement: shows dashed outlines on all [data-sid] elements
 * and marks the innermost hovered one with a solid outline.
 * Both effects clear after HOVER_CLEAR_DELAY ms of no movement.
 */
export function createMouseMoveHandler(win) {
  let clearTimer = null;

  return function handleMouseMove(event) {
    if (editing) {
      return;
    }

    win.document.documentElement.classList.add(MOUSE_ACTIVE_CLASS);

    // Track innermost [data-sid] or [data-sid-field] for solid outline
    const current = win.document.querySelector(`[${INNER_ATTR}]`);
    const target = event.target.closest(`[${SID_ATTR}], [${SID_FIELD_ATTR}]`);

    if (current !== target) {
      if (current) {
        current.removeAttribute(INNER_ATTR);
      }

      if (target) {
        target.setAttribute(INNER_ATTR, '');
      }
    }

    // Move arrows: rows opted in via move="true" take priority (innermost);
    // otherwise the page section under the cursor. <section> is what the
    // site's templates use for top-level page sections — blocks are divs.
    if (moveCtrlEl && moveCtrlEl.contains(event.target)) {
      // hovering the control itself — keep it
    } else {
      const moveEl =
        event.target.closest('[data-sid-move]') ||
        event.target.closest(`section[${SID_ATTR}]:not([data-sid-type="text"])`);

      if (moveEl) {
        showMoveControl(win, moveEl);
      } else {
        hideMoveControl(win);
      }
    }

    if (clearTimer) {
      clearTimeout(clearTimer);
    }

    clearTimer = setTimeout(() => {
      win.document.documentElement.classList.remove(MOUSE_ACTIVE_CLASS);
      win.document.querySelectorAll(`[${INNER_ATTR}]`).forEach((el) => {
        el.removeAttribute(INNER_ATTR);
      });
      hideMoveControl(win);
    }, HOVER_CLEAR_DELAY);
  };
}

export function createClickHandler(win) {
  return function handleClick(event) {
    // Move-control clicks: the buttons handle themselves (and this handler runs
    // in the capture phase — stopping here would block their click listeners).
    if (moveCtrlEl && moveCtrlEl.contains(event.target)) {
      return;
    }

    if (editing) {
      // Toolbar clicks: return without stopPropagation — this handler runs in
      // the capture phase, and stopping here would prevent the event from ever
      // reaching the toolbar buttons' own click listeners.
      if (toolbarEl && toolbarEl.contains(event.target)) {
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

    const target = event.target.closest(`[${SID_ATTR}], [${SID_FIELD_ATTR}]`);

    if (!target) {
      win.document.querySelectorAll(`[${ACTIVE_ATTR}]`).forEach((el) => {
        el.removeAttribute(ACTIVE_ATTR);
      });

      return;
    }

    event.preventDefault();

    win.document.querySelectorAll(`[${ACTIVE_ATTR}]`).forEach((el) => {
      el.removeAttribute(ACTIVE_ATTR);
    });

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
        target.hasAttribute('data-sid-inline-edit') &&
        target.hasAttribute(SID_FIELD_ATTR) &&
        event.target !== target
      ) {
        requestInlineEdit(win, target, event, { popupFallback: popupMessage });

        return;
      }

      win.top.postMessage(popupMessage, win.location.origin);

      return;
    }

    // Field-handle targeting (data-sid-field) — sends the dot-separated field path.
    // scope = the _visual_id of the surrounding set, so the CP can disambiguate a
    // bare handle (e.g. "text") that repeats across many sections/rows.
    if (target.hasAttribute(SID_FIELD_ATTR)) {
      win.top.postMessage(
        {
          source: 'statamic-visual-editor',
          type: 'click',
          field: target.getAttribute(SID_FIELD_ATTR),
          scope: target.getAttribute('data-sid-field-uid') || undefined,
          label: target.getAttribute('data-sid-label') || undefined,
        },
        win.location.origin
      );

      // Inline editing is opt-in per template: only elements rendered with
      // {{ visual_edit field="…" inline_edit="true" }} carry this attribute.
      // Everything else keeps the classic behaviour (focus the CP field only).
      if (target.hasAttribute('data-sid-inline-edit')) {
        // Media click: the CP opens the field's asset browser instead of a
        // text-edit session. Triggered when the click lands on an image/video,
        // or anywhere in a wrapper whose only content is media (no text).
        const media = event.target.closest('img, picture, video');
        const isMediaClick =
          (media && target.contains(media)) ||
          (normText(target.textContent) === '' && target.querySelector('img, picture, video'));

        if (isMediaClick) {
          win.top.postMessage(
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

        requestInlineEdit(win, target, event);
      }

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
    };

    if (uidIndex > 0) {
      message.uidIndex = uidIndex;
    }

    if (target.getAttribute('data-sid-type') === 'text') {
      const prevSet = findPrecedingSetSibling(target);

      message.afterSetUid = prevSet ? prevSet.getAttribute(SID_ATTR) : null;
    }

    win.top.postMessage(message, win.location.origin);
  };
}

export function createHoverHandler(win) {
  let lastHoveredKey = null;

  function handleHover(event) {
    if (editing) {
      return;
    }

    const target = event.target.closest(`[${SID_ATTR}], [${SID_FIELD_ATTR}]`);

    // Field-handle targeting: deduplicate on the field path string.
    if (target && target.hasAttribute(SID_FIELD_ATTR)) {
      const field = target.getAttribute(SID_FIELD_ATTR);

      if (field === lastHoveredKey) {
        return;
      }

      lastHoveredKey = field;
      win.top.postMessage(
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
      win.top.postMessage({ source: 'statamic-visual-editor', type: 'hover', uid: null }, win.location.origin);

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

    win.top.postMessage(message, win.location.origin);
  }

  // When the mouse leaves the iframe entirely, immediately clear the CP hover
  // state. Without this, dashed outlines in the CP linger indefinitely because
  // the mouseover handler only fires for elements inside the iframe.
  handleHover.reset = () => {
    lastHoveredKey = null;
    win.top.postMessage({ source: 'statamic-visual-editor', type: 'hover', uid: null }, win.location.origin);
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

export function createMessageReceiver(win) {
  return function handleMessage(event) {
    // Guard: only accept messages from the parent frame (the Statamic CP).
    // This prevents cross-site message spoofing from third-party windows.
    if (event.source !== win.top) {
      return;
    }

    const { data } = event;

    if (!data || data.source !== 'statamic-visual-editor') {
      return;
    }

    if (data.type === 'edit-start') {
      startEditing(win, data);

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
          win.top.postMessage(popupFallback, win.location.origin);
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

export function initBridge(win = window) {
  if (win.self === win.top) {
    return;
  }

  // Shared with preview.js (same window): while an inline edit is active, hot
  // reload defers its morph so the DOM under the caret is never replaced.
  win.__sveInlineEdit = win.__sveInlineEdit || { active: false };

  injectStyles(win.document);
  injectCpVariables(win.document, win);

  // The site's live-preview hot-reload script replaces every <style> in <head>
  // on each content update, which strips our injected styles and kills the
  // dashed outlines until a full refresh. Watch <head> and re-inject.
  new win.MutationObserver(() => {
    if (!win.document.getElementById(STYLES_ID)) {
      injectStyles(win.document);
    }
  }).observe(win.document.head, { childList: true });
  win.document.addEventListener('click', createClickHandler(win), true);
  win.document.addEventListener('mousemove', createMouseMoveHandler(win), true);

  const hoverHandler = createHoverHandler(win);

  win.document.addEventListener('mouseover', hoverHandler, true);
  // When the pointer leaves the iframe document (e.g. moves into the CP chrome),
  // immediately tell the CP to clear its hover outline.
  win.document.addEventListener('mouseleave', () => hoverHandler.reset(), true);
  win.addEventListener('message', createMessageReceiver(win));

  // A hot-reload morph replaces section elements — drop the move control so it
  // never points at a detached node; the next hover recreates it.
  win.addEventListener('statamic:preview-updated', () => hideMoveControl(win));
}

initBridge();
