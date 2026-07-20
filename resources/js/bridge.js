// Bridge script — injected into the Live Preview iframe.
// Only activates when running inside an iframe (window.self !== window.top).

const ACTIVE_ATTR = 'data-sid-active';
const HOVER_ATTR = 'data-sid-hover';
const INNER_ATTR = 'data-sid-inner';
const SID_ATTR = 'data-sid';
const SID_FIELD_ATTR = 'data-sid-field';
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
    const cpStyle = getComputedStyle(win.parent.document.documentElement);
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
        [data-sid], [data-sid-field], [data-sid-global] {
            cursor: pointer;
            outline-width: var(--sve-outline-width, 1px);
            outline-style: dashed;
            outline-color: transparent;
            outline-offset: 2px;
            transition: outline-color 0.15s ease;
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
        .${MOUSE_ACTIVE_CLASS} [data-sid], .${MOUSE_ACTIVE_CLASS} [data-sid-field], .${MOUSE_ACTIVE_CLASS} [data-sid-global] {
            outline-color: color-mix(in srgb, var(--sve-hover-color, #9CA3AF) var(--sve-outline-opacity, 55%), transparent);
        }
        [data-sid-global] {
            outline-width: var(--sve-outline-width, 1px);
            outline-style: dashed;
            outline-color: transparent;
            outline-offset: 2px;
            transition: outline-color 0.15s ease;
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
        /* Global (synced) sections. Their content belongs to another entry, so it
           can't be edited from this page — the badge says so, and clicking one
           fades the rest of the page back so it's obvious you've stepped inside
           it. Editing happens in the source's own editor. */
        [data-sve-global] {
            position: relative;
        }
        [data-sve-global]::before {
            /* safe: set from our own translations, never from content */
            content: attr(data-sve-global-label);
            position: absolute;
            top: 0;
            left: 0;
            background: #7c3aed;
            color: #fff;
            font: 500 10px/1 sans-serif;
            padding: 4px 8px;
            border-radius: 0 0 4px 0;
            z-index: 9998;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.15s ease;
        }
        [data-sve-global]:hover::before,
        [data-sve-global][data-sve-global-focused]::before {
            opacity: 1;
        }
        [data-sve-global]:not([data-sve-global-focused]):hover {
            outline: 2px dashed #7c3aed;
            outline-offset: -2px;
            cursor: pointer;
        }
        html.sve-global-focus section[data-sid]:not([data-sve-global-focused]),
        html.sve-global-focus article[data-sid]:not([data-sve-global-focused]) {
            opacity: 0.25;
            filter: saturate(0.4);
            transition: opacity 0.2s ease, filter 0.2s ease;
        }
        [data-sve-global-focused] {
            outline: 3px solid #7c3aed !important;
            outline-offset: -3px;
        }
        /* Before you step in, a global section reads as ONE thing you click into,
           not a pile of separately editable fields — so the per-field outlines
           (from the mouse-active rule above) stay hidden. Once focused they come
           back, because from then on it edits exactly like the page's own. */
        [data-sve-global]:not([data-sve-global-focused]) [data-sid],
        [data-sve-global]:not([data-sve-global-focused]) [data-sid-field],
        [data-sve-global]:not([data-sve-global-focused]) [data-sid-global],
        [data-sve-global]:not([data-sve-global-focused]) [data-sid-inner],
        [data-sve-global]:not([data-sve-global-focused]) [data-sid-hover],
        [data-sve-global]:not([data-sve-global-focused]) [data-sid-active] {
            outline-color: transparent !important;
            cursor: pointer !important;
        }
        [data-sve-global]:not([data-sve-global-focused]) [data-sid-label]::after {
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
    },
    win.location.origin
  );
}

const escapeHtml = (text) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

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

function sendEditInput(win, session) {
  clearTimeout(session.inputTimer);
  session.inputTimer = null;

  // Whole-field Bard: serialize every unlocked block child (plus stray text the
  // browser may have left directly in the wrapper) into an ordered block list —
  // the CP rebuilds the field's node array from it.
  if (session.mode === 'bard-field') {
    const blocks = [];

    for (const child of session.el.childNodes) {
      if (child.nodeType === 3) {
        const text = child.nodeValue.trim();

        if (text) {
          blocks.push({ kind: 'paragraph', level: null, className: null, html: escapeHtml(text) });
        }

        continue;
      }

      if (child.nodeType !== 1 || child.hasAttribute('data-sve-locked')) {
        continue;
      }

      const heading = /^H([1-6])$/.exec(child.tagName);
      // A block holding only the caret placeholder <br> is an empty block — it
      // must not serialize into a stray hardBreak node.
      const html = /^<br\s*\/?>$/i.test(child.innerHTML.trim()) ? '' : child.innerHTML;

      blocks.push({
        kind: heading ? 'heading' : 'paragraph',
        level: heading ? Number(heading[1]) : null,
        className: heading
          ? null
          : (session.blockClasses || []).find((c) => child.classList.contains(c)) || null,
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
      win.parent.postMessage(
        { source: 'statamic-visual-editor', type: 'link-edit', requestId: session.requestId },
        win.location.origin
      );
      finishEditing(win, false);
    }, { html: ICONS.anchor });
  }

  addSeparator();

  // In whole-field mode Enter splits blocks, so it can't double as commit.
  addButton('✓', session.mode === 'bard-field' ? t('save') : t('save_enter'), () => finishEditing(win, false), {
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
const GLOBAL_FOCUS_ATTR = 'data-sve-global-focused';
const GLOBAL_BAR_ID = '__sve-global-bar';

let globalFocusEl = null;
// Held separately from the element: a morph patches our attribute back off the
// live node, so after a re-render the DOM can no longer tell us what we were in.
let globalFocusId = null;

/** Tags each section that came from a Global section with its source's id. */
function tagGlobalSections(win) {
  win.document.querySelectorAll('[data-sve-global-id]').forEach((marker) => {
    const section = marker.nextElementSibling;

    if (section && !section.hasAttribute(GLOBAL_ATTR)) {
      section.setAttribute(GLOBAL_ATTR, marker.getAttribute('data-sve-global-id'));
      section.setAttribute('data-sve-global-label', t('global_badge'));

      // The page's own row id sits on the marker just before this one. Without it
      // the hover control would act on the SOURCE's id — which this page's form
      // has never heard of, so move/remove/settings would all quietly do nothing.
      const row = marker.previousElementSibling?.getAttribute('data-sve-global-row');

      if (row) {
        section.setAttribute(GLOBAL_ROW_ATTR, row);
      }
    }
  });
}

function exitGlobalFocus(win, closePanel = true) {
  const doc = win.document;
  const wasFocused = !!globalFocusEl;

  doc.querySelectorAll(`[${GLOBAL_FOCUS_ATTR}]`).forEach((el) => el.removeAttribute(GLOBAL_FOCUS_ATTR));
  doc.documentElement.classList.remove('sve-global-focus');
  doc.getElementById(GLOBAL_BAR_ID)?.remove();
  globalFocusEl = null;
  globalFocusId = null;

  // Stepping out closes the section's editor with it — leaving it open would keep
  // the page rendering an unsaved section you can no longer see you're in.
  if (wasFocused && closePanel) {
    win.parent.postMessage({ source: 'statamic-visual-editor', type: 'close-global-section' }, win.location.origin);
  }
}

/**
 * Steps into a global section: fade the rest of the page and open its editor.
 * `reopen: false` re-applies the look after a re-render without touching the
 * panel — reopening it would reload the form under the cursor mid-edit.
 */
function enterGlobalFocus(win, section, reopen = true) {
  if (globalFocusEl === section) {
    return;
  }

  exitGlobalFocus(win, false);

  const doc = win.document;

  section.setAttribute(GLOBAL_FOCUS_ATTR, '');
  doc.documentElement.classList.add('sve-global-focus');
  globalFocusEl = section;
  globalFocusId = section.getAttribute(GLOBAL_ATTR);

  const bar = doc.createElement('div');

  bar.id = GLOBAL_BAR_ID;
  bar.style.cssText =
    'position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:2147483646;' +
    'display:flex;align-items:center;gap:12px;background:#1f2937;color:#fff;' +
    'padding:8px 10px 8px 16px;border-radius:10px;box-shadow:0 8px 28px rgba(0,0,0,.4);' +
    'font:500 13px/1.3 sans-serif;user-select:none;';

  const text = doc.createElement('span');

  text.style.cssText = 'opacity:.9;';
  text.innerHTML = t('global_bar', {
    section: `<b style="color:#c4b5fd;">${t('global_bar_section')}</b>`,
  });
  bar.appendChild(text);

  const barButton = (label, background) => {
    const btn = doc.createElement('button');

    btn.type = 'button';
    btn.textContent = label;
    btn.style.cssText =
      'all:unset;cursor:pointer;padding:6px 12px;border-radius:7px;font-size:12px;font-weight:600;' +
      `background:${background};color:#fff;`;
    bar.appendChild(btn);

    return btn;
  };

  // Saving belongs where you're working — you're editing the section here, not in
  // the panel, so the Save is here too (it drives the panel's real one).
  barButton(t('save'), '#7c3aed').addEventListener('click', (event) => {
    event.stopPropagation();
    win.parent.postMessage({ source: 'statamic-visual-editor', type: 'save-global-section' }, win.location.origin);
  });

  barButton(t('close'), 'rgba(255,255,255,.12)').addEventListener('click', (event) => {
    event.stopPropagation();
    exitGlobalFocus(win);
  });

  doc.documentElement.appendChild(bar);

  // Stepping in opens the section's own editor beside the page. That's not just
  // somewhere to type: it's the form that owns this content, and the CP borrows
  // its fields so the text in the page can be edited inline from right here.
  if (reopen) {
    win.parent.postMessage(
      { source: 'statamic-visual-editor', type: 'open-global-section', id: section.getAttribute(GLOBAL_ATTR) },
      win.location.origin
    );
  }
}

// The CP's floating back pill, in our coordinates (see sve-pill-box).
let pillBox = null;

let moveCtrlEl = null;
let moveTargetEl = null;
let moveReposition = null;
// The current control's +/− buttons + the row uid they act on, so the CP's
// row-caps reply can grey out whichever would break the field's min/max.
let moveCtrlRowButtons = null;

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
  if (!moveCtrlRowButtons || moveCtrlRowButtons.uid !== data.uid) {
    return;
  }

  setRowButtonDisabled(moveCtrlRowButtons.addBtn, !data.canAdd);
  setRowButtonDisabled(moveCtrlRowButtons.removeBtn, !data.canRemove);
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
    const left = Math.max(rect.right - width - 10, 10);
    // The CP's back pill floats in this same corner. Where the control would sit
    // under it, start below it instead — the two mustn't stack.
    const clash = pillBox && left + width > pillBox.left;
    const min = clash ? pillBox.bottom + 8 : 10;
    const top = Math.min(Math.max(rect.top + 10, min), Math.max(rect.bottom - height - 10, min));

    moveCtrlEl.style.top = `${top}px`;
    moveCtrlEl.style.left = `${left}px`;
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

const COL_SECTION_SELECTOR = '[data-sid-type="columns"]';

let colChrome = null; // { handle, addBtn, pair, grid }
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

function hideColumnChrome(win) {
  if (!colChrome) {
    return;
  }

  colChrome.handle?.remove();
  colChrome.addBtn?.remove();
  win.removeEventListener('scroll', colChrome.onScroll, true);
  colChrome = null;
}

function positionColumnChrome() {
  if (!colChrome) {
    return;
  }

  const { handle, addBtn, pair, grid } = colChrome;

  if (handle && pair) {
    const ra = pair.a.getBoundingClientRect();
    const rb = pair.b.getBoundingClientRect();
    const x = (ra.right + rb.left) / 2;
    const top = Math.max(ra.top, rb.top);
    const bottom = Math.min(ra.bottom, rb.bottom);

    handle.style.left = `${x - 5}px`;
    handle.style.top = `${(top + bottom) / 2 - 24}px`;
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

  if (colChrome && (colChrome.handle?.contains(event.target) || colChrome.addBtn?.contains(event.target))) {
    return;
  }

  const block = event.target.closest?.(`[${SID_ATTR}]`);
  const section = block?.closest(COL_SECTION_SELECTOR);
  const grid = block?.parentElement;

  if (!block || !section || !grid || win.getComputedStyle(grid).display !== 'grid') {
    hideColumnChrome(win);

    return;
  }

  // VISUAL order, not DOM order: per-breakpoint `order` CSS (order_m/t/d) can
  // render the DOM's first column on the right. The pair is always
  // { a: visually left, b: visually right } so the drag math and the written
  // uids follow what the user actually sees.
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
  const pair = next ? { a: block, b: next } : prev ? { a: prev, b: block } : null;

  if (colChrome && colChrome.grid === grid && colChrome.pair?.a === pair?.a && colChrome.pair?.b === pair?.b) {
    return; // already showing exactly this
  }

  hideColumnChrome(win);

  const doc = win.document;
  let handle = null;

  if (pair) {
    handle = doc.createElement('div');
    handle.style.cssText =
      'position:fixed;z-index:2147483646;width:10px;height:48px;border-radius:6px;' +
      'background:#1f2937;box-shadow:0 2px 10px rgba(0,0,0,.35),inset 0 0 0 1px rgba(255,255,255,.18);' +
      'cursor:col-resize;touch-action:none;';
    handle.title = t('drag_columns');
    handle.addEventListener('pointerdown', (e) => {
      if (e.button !== 0 || widthDrag) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();
      beginWidthDrag(win, pair, grid);
    });
    doc.documentElement.appendChild(handle);
  }

  const addBtn = doc.createElement('button');

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
      { source: 'statamic-visual-editor', type: 'cb-add-column', uid: section.getAttribute(SID_ATTR) },
      win.location.origin
    );
  });
  doc.documentElement.appendChild(addBtn);

  colChrome = { handle, addBtn, pair, grid, onScroll: () => positionColumnChrome() };
  win.addEventListener('scroll', colChrome.onScroll, true);
  positionColumnChrome();
}

function beginWidthDrag(win, pair, grid) {
  const info = columnGridInfo(win, grid);
  const spanA = spanOf(pair.a, info);
  const spanB = spanOf(pair.b, info);

  const badge = win.document.createElement('div');

  badge.style.cssText =
    'position:fixed;z-index:2147483647;pointer-events:none;padding:5px 10px;border-radius:6px;' +
    'background:#1f2937;color:#fff;font:600 12px/1 ui-sans-serif,system-ui,sans-serif;' +
    'box-shadow:0 4px 16px rgba(0,0,0,.35);white-space:nowrap;';
  win.document.documentElement.appendChild(badge);

  widthDrag = {
    ...pair,
    grid,
    info,
    total: spanA + spanB,
    spanA,
    applied: spanA,
    aLeft: pair.a.getBoundingClientRect().left,
    badge,
  };
  win.document.documentElement.classList.add('sve-col-resizing');
}

function updateWidthDrag(win, event) {
  const { a, b, info, total, aLeft, badge } = widthDrag;

  event.preventDefault();

  let next = Math.round((event.clientX - aLeft + info.gap / 2) / info.unit);

  next = Math.max(1, Math.min(total - 1, next));

  if (next !== widthDrag.applied) {
    widthDrag.applied = next;
    // Inline styles for instant feedback — they also don't depend on every
    // col-span-* class being present in the site's compiled CSS. The morph
    // after the CP write replaces them with the real classes.
    a.style.gridColumn = `span ${next} / span ${next}`;
    b.style.gridColumn = `span ${total - next} / span ${total - next}`;
    positionColumnChrome();
  }

  const pct = (n) => `${Math.round((n / info.tracks) * 100)}%`;

  badge.textContent = `${widthDrag.applied}/${info.tracks} · ${pct(widthDrag.applied)}  |  ${total - widthDrag.applied}/${info.tracks} · ${pct(total - widthDrag.applied)}`;
  badge.style.left = `${event.clientX + 14}px`;
  badge.style.top = `${event.clientY + 16}px`;
}

function finishWidthDrag(win, cancelled) {
  const { a, b, total, spanA, applied, badge } = widthDrag;

  badge.remove();
  win.document.documentElement.classList.remove('sve-col-resizing');
  widthDrag = null;

  widthDragJustEnded = true;
  setTimeout(() => (widthDragJustEnded = false), 250);

  if (cancelled || applied === spanA) {
    a.style.gridColumn = '';
    b.style.gridColumn = '';

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
// normal click (inline edit, focus); beyond it a drag starts, the row dims, an
// insertion line marks the drop gap, and releasing posts the target index to
// the CP, which reorders the underlying values array (same machinery as the
// move arrows). The morphed re-render then shows the new order.

const ORDERABLE_ATTR = 'data-sid-orderable';
const DRAG_THRESHOLD = 6; // px of movement before a press becomes a drag

let dragState = null;
let dragJustEnded = false; // one-shot: swallow the click that follows a drag

function orderablePeers(el) {
  return el.parentElement
    ? [...el.parentElement.children].filter((c) => c.hasAttribute(ORDERABLE_ATTR))
    : [];
}

/** Nearest solid background up the ancestor chain — the ghost card uses it so
 *  the row's own text keeps its contrast (white cards would swallow light text
 *  on dark sections). */
function solidBackgroundFor(win, el) {
  let node = el;

  for (let i = 0; node && i < 15; i++) {
    const colour = win.getComputedStyle(node).backgroundColor;

    if (colour && colour !== 'transparent' && !/rgba\(\s*0,\s*0,\s*0,\s*0\s*\)/.test(colour)) {
      return colour;
    }

    node = node.parentElement;
  }

  return '#ffffff';
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

  ghost.setAttribute('data-sve-ghost', '');
  ghost.appendChild(clone);
  ghost.style.cssText =
    'position:fixed;left:0;top:0;z-index:2147483647;pointer-events:none;box-sizing:border-box;' +
    `width:${Math.ceil(rect.width)}px;padding:10px 14px;border-radius:10px;overflow:hidden;` +
    `background:${solidBackgroundFor(win, el)};box-shadow:0 12px 32px rgba(0,0,0,.28),0 0 0 1px rgba(0,0,0,.06);` +
    'opacity:.95;transform-origin:top left;will-change:transform;';
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

      const indicator = win.document.createElement('div');

      indicator.style.cssText =
        'position:fixed;z-index:2147483646;pointer-events:none;border-radius:2px;' +
        'background:var(--sve-focus-color, #3b82f6);box-shadow:0 0 0 1px rgba(255,255,255,.4);';
      // On <html> — see buildDragGhost for why not <body>.
      win.document.documentElement.appendChild(indicator);
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

    const { peers, horizontal, indicator } = dragState;
    const pos = horizontal ? event.clientX : event.clientY;

    // Insertion slot = number of peers whose midpoint the pointer has passed.
    let insert = 0;

    peers.forEach((peer, i) => {
      const rect = peer.getBoundingClientRect();
      const mid = horizontal ? (rect.left + rect.right) / 2 : (rect.top + rect.bottom) / 2;

      if (pos > mid) {
        insert = i + 1;
      }
    });

    dragState.insert = insert;

    // Draw the line in the gap the drop would land in.
    const anchor = peers[Math.min(insert, peers.length - 1)];
    const rect = anchor.getBoundingClientRect();
    const after = insert > peers.length - 1;

    if (horizontal) {
      indicator.style.left = `${(after ? rect.right + 2 : rect.left - 4)}px`;
      indicator.style.top = `${rect.top}px`;
      indicator.style.width = '3px';
      indicator.style.height = `${rect.height}px`;
    } else {
      indicator.style.left = `${rect.left}px`;
      indicator.style.top = `${(after ? rect.bottom + 2 : rect.top - 4)}px`;
      indicator.style.width = `${rect.width}px`;
      indicator.style.height = '3px';
    }
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
  const isPageSection = (el) => el.hasAttribute(SECTION_ORDERABLE_ATTR);

  // Rows opted into ordering (orderable="true") are the innermost thing a hover
  // can land on, so they claim the control before the section around them.
  const isRow = moveEl.hasAttribute(ORDERABLE_ATTR) && !isPageSection(moveEl);

  const peers = moveEl.parentElement
    ? [...moveEl.parentElement.children].filter((el) =>
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
    handle.style.cssText =
      'all:unset;cursor:grab;width:26px;height:26px;display:inline-flex;align-items:center;' +
      'justify-content:center;border-radius:5px;font-size:13px;box-sizing:border-box;touch-action:none;';
    handle.addEventListener('mouseenter', () => (handle.style.background = 'rgba(255,255,255,0.14)'));
    handle.addEventListener('mouseleave', () => (handle.style.background = 'transparent'));
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
        fromIndex: peers.indexOf(moveEl),
        insert: null,
        active: false,
        indicator: null,
        ghost: null,
      };
    });

    ctrl.appendChild(handle);
  }

  if (peers.length > 1) {
    if (horizontal) {
      addArrow('←', t('move_left'), -1);
      addArrow('→', t('move_right'), 1);
    } else {
      addArrow('↑', t('move_up'), -1);
      addArrow('↓', t('move_down'), 1);
    }
  }

  // Orderable rows: add one after this, or remove this one.
  if (isRow) {
    const rowButton = (glyph, title, type, style = '') => {
      const btn = doc.createElement('button');

      btn.type = 'button';
      btn.textContent = glyph;
      btn.title = title;
      btn.style.cssText =
        'all:unset;cursor:pointer;width:26px;height:26px;display:inline-flex;align-items:center;' +
        `justify-content:center;border-radius:5px;font-size:16px;line-height:1;box-sizing:border-box;${style}`;
      btn.addEventListener('mouseenter', () => {
        if (!btn.dataset.sveDisabled) btn.style.background = 'rgba(255,255,255,0.14)';
      });
      btn.addEventListener('mouseleave', () => (btn.style.background = 'transparent'));
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

        win.parent.postMessage({ source: 'statamic-visual-editor', type, uid }, win.location.origin);
        hideMoveControl(win);
      });

      ctrl.appendChild(btn);

      return btn;
    };

    const addBtn = rowButton('+', t('add_another'), 'add-row');
    const removeBtn = rowButton('−', t('remove_this'), 'remove-row', 'color:#fca5a5;');

    // Ask the CP whether this field is at its min/max, and grey out the button
    // that would break the limit. Async: the reply arrives via row-caps-result.
    moveCtrlRowButtons = { uid, addBtn, removeBtn };
    win.parent.postMessage({ source: 'statamic-visual-editor', type: 'row-caps', uid }, win.location.origin);
  }

  // Gear — opens the section's own settings popup (spacing, colours, …), the
  // same one the panel's "Show settings" button opens.
  if (isSection) {
    const gear = doc.createElement('button');

    gear.type = 'button';
    gear.innerHTML = ICONS.settings;
    gear.title = t('section_settings');
    gear.style.cssText =
      'all:unset;cursor:pointer;width:26px;height:26px;display:inline-flex;align-items:center;' +
      'justify-content:center;border-radius:5px;box-sizing:border-box;';
    gear.addEventListener('mouseenter', () => (gear.style.background = 'rgba(255,255,255,0.14)'));
    gear.addEventListener('mouseleave', () => (gear.style.background = 'transparent'));
    gear.addEventListener('mousedown', (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
    gear.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      win.parent.postMessage(
        { source: 'statamic-visual-editor', type: 'section-settings', uid },
        win.location.origin
      );
    });

    ctrl.appendChild(gear);
  }

  // Bookmark — save this section as a reusable template.
  if (isSection) {
    const save = doc.createElement('button');

    save.type = 'button';
    save.innerHTML = ICONS.bookmark;
    save.title = t('save_as_template');
    save.style.cssText =
      'all:unset;cursor:pointer;width:26px;height:26px;display:inline-flex;align-items:center;' +
      'justify-content:center;border-radius:5px;box-sizing:border-box;';
    save.addEventListener('mouseenter', () => (save.style.background = 'rgba(255,255,255,0.14)'));
    save.addEventListener('mouseleave', () => (save.style.background = 'transparent'));
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
    plus.style.cssText =
      'all:unset;cursor:pointer;width:26px;height:26px;display:inline-flex;align-items:center;' +
      'justify-content:center;border-radius:5px;font-size:18px;line-height:1;box-sizing:border-box;';
    plus.addEventListener('mouseenter', () => (plus.style.background = 'rgba(255,255,255,0.14)'));
    plus.addEventListener('mouseleave', () => (plus.style.background = 'transparent'));
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

    // "−" — take this section off the page. Sits under the "+", and goes through
    // the same remove-row handler the orderable rows use: a section IS a row of
    // page_sections, so its min_sets is honoured for free.
    const minus = doc.createElement('button');

    minus.type = 'button';
    minus.textContent = '−';
    minus.title = t('remove_section');
    minus.style.cssText =
      'all:unset;cursor:pointer;width:26px;height:26px;display:inline-flex;align-items:center;' +
      'justify-content:center;border-radius:5px;font-size:16px;line-height:1;box-sizing:border-box;color:#fca5a5;';
    minus.addEventListener('mouseenter', () => {
      if (!minus.dataset.sveDisabled) minus.style.background = 'rgba(255,255,255,0.14)';
    });
    minus.addEventListener('mouseleave', () => (minus.style.background = 'transparent'));
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

      win.parent.postMessage({ source: 'statamic-visual-editor', type: 'remove-row', uid }, win.location.origin);
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
  // reached. Two transparent strips, just above and below the control and part
  // of it, keep `moveCtrlEl.contains(target)` true right across the gap so the
  // control stays put whichever side it's placed on.
  ['top:100%', 'bottom:100%'].forEach((edge) => {
    const bridge = doc.createElement('div');

    bridge.style.cssText = `position:absolute;left:-8px;right:-8px;${edge};height:12px;`;
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

    const kids = [...wrapper.children];
    const blocks = [];
    let cursor = 0;

    for (const node of data.nodes || []) {
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
  } else {
    el = data.target === 'block' && blockEl ? blockEl : editableFromWrapper(wrapper);
  }

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
    lockedEls,
    restoreHtml: el.innerHTML,
    hadContentEditable: el.getAttribute('contenteditable'),
    inputTimer: null,
    dirty: false,
  };

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

  el.setAttribute(EDITING_ATTR, '');

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
    clearTimeout(session.inputTimer);
    session.inputTimer = setTimeout(() => sendEditInput(win, session), EDIT_INPUT_DEBOUNCE);
    positionEditToolbar(win, session);
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

  session.onSelectionChange = () => updateEditToolbarState(win);
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
    const target = resolveSidTarget(win, event);

    if (current !== target) {
      if (current) {
        current.removeAttribute(INNER_ATTR);
      }

      if (target) {
        target.setAttribute(INNER_ATTR, '');
      }
    }

    // Move arrows: rows opted in via move="true" / orderable take priority
    // (innermost); otherwise the page section under the cursor — any element
    // with section-orderable="true", regardless of HTML tag.
    if (moveCtrlEl && moveCtrlEl.contains(event.target)) {
      // hovering the control itself — keep it
    } else {
      const moveEl =
        event.target.closest(`[${ORDERABLE_ATTR}]`) ||
        event.target.closest('[data-sid-move]') ||
        event.target.closest(`[${SECTION_ORDERABLE_ATTR}]`);

      if (moveEl) {
        showMoveControl(win, moveEl);
      } else {
        hideMoveControl(win);
      }
    }

    maybeShowColumnChrome(win, event);

    if (clearTimer) {
      clearTimeout(clearTimer);
    }

    clearTimer = setTimeout(() => {
      win.document.documentElement.classList.remove(MOUSE_ACTIVE_CLASS);
      win.document.querySelectorAll(`[${INNER_ATTR}]`).forEach((el) => {
        el.removeAttribute(INNER_ATTR);
      });
      hideMoveControl(win);

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

export function createClickHandler(win) {
  return function handleClick(event) {
    // The click generated by releasing a drag is not a click — swallow it
    // before it starts an inline edit or a focus jump.
    if (dragJustEnded || widthDragJustEnded) {
      event.preventDefault();
      event.stopPropagation();

      return;
    }

    // Move-control clicks: the buttons handle themselves (and this handler runs
    // in the capture phase — stopping here would block their click listeners).
    if (moveCtrlEl && moveCtrlEl.contains(event.target)) {
      return;
    }

    // The global-section bar owns its own clicks.
    if (event.target.closest(`#${GLOBAL_BAR_ID}`)) {
      return;
    }

    // First click on a global section steps into it: the page fades back and its
    // own editor opens beside you. Once you're in, clicks behave normally again —
    // so the text edits inline exactly like the page's own. Clicking outside
    // steps back out.
    const globalSection = event.target.closest(`[${GLOBAL_ATTR}]`);

    if (globalSection) {
      if (globalFocusEl !== globalSection) {
        event.preventDefault();
        event.stopPropagation();
        enterGlobalFocus(win, globalSection);

        return;
      }
    } else if (globalFocusEl) {
      exitGlobalFocus(win);
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

    const target = resolveSidTarget(win, event);

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

    win.parent.postMessage(message, win.location.origin);
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

    if (data.type === 'ext-drag-start') {
      extDragStart(win);

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

    // Where the CP's floating "back" pill sits, in our coordinates — so a
    // section's control can step out from under it.
    if (data.type === 'sve-pill-box') {
      pillBox = { bottom: data.bottom, left: data.left };

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
    hideMoveControl(win);
    hideColumnChrome(win);
    endDrag(win);

    if (widthDrag) {
      finishWidthDrag(win, true);
    }

    // A morph brings in fresh section elements. Re-tag the global ones and put
    // the focus back on the same section — every keystroke in it re-renders the
    // page, so dropping the focus here would throw you out of it as you type.
    const focusedId = globalFocusId;

    exitGlobalFocus(win, false);
    tagGlobalSections(win);

    if (focusedId) {
      const again = win.document.querySelector(`[${GLOBAL_ATTR}="${focusedId}"]`);

      if (again) {
        enterGlobalFocus(win, again, false);
      }
    }

    setupInserters(win); // fresh blocks after the morph
  });

  // Escape steps back out of a global section.
  win.document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && globalFocusEl && !editing) {
      exitGlobalFocus(win);
    }
  });

  tagGlobalSections(win);

  // The CP posts the pill's box when its chrome re-renders — which has already
  // happened by the time we boot in here. Ask for it, now that we're listening.
  win.parent.postMessage({ source: 'statamic-visual-editor', type: 'sve-pill-box-request' }, win.location.origin);

  // Block inserters: wire them up now, keep them pinned as the preview scrolls or
  // resizes, and rebuild after a morph brings in fresh blocks.
  setupInserters(win);
  win.addEventListener('scroll', () => repositionInserters(win), true);
  win.addEventListener('resize', () => repositionInserters(win));
}

// --- Block inserter: a "+" between a replicator's blocks (Gutenberg-style) ------
//
// A container marked `data-sid-insert="<field>"` (via {{ visual_edit
// insertable="true" }}) gets a "+" in each gap between its blocks. Clicking it
// offers the field's set types; picking one inserts a new block of that type
// there. Orientation follows the layout: stacked blocks get a horizontal divider,
// a row of blocks gets a vertical one — so it works both ways.

const INSERT_ATTR = 'data-sid-insert';
const INSERT_LAYER_ID = '__sve-inserters';
let inserterInstances = [];
let inserterHideTimer = null;

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
 * One "+" under each block, shown only while that block (or the "+") is hovered.
 * An empty field gets a single, always-visible "+" to start it off.
 */
function setupInserters(win) {
  const layer = ensureInserterLayer(win);

  layer.innerHTML = '';
  inserterInstances = [];

  win.document.querySelectorAll(`[${INSERT_ATTR}]`).forEach((container) => {
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
    const blocks = [...container.children].filter((child) => child.hasAttribute(SID_ATTR));

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
    }

    blocks.forEach((block) => {
      const inst = buildInserter(win, { field, sets, block, position: 'after', horizontal, scope });

      layer.appendChild(inst.el);
      inserterInstances.push(inst);

      const show = () => {
        clearTimeout(inserterHideTimer);
        inst.el.style.opacity = '1';
      };
      const hide = () => {
        inserterHideTimer = win.setTimeout(() => {
          inst.el.style.opacity = '0';
        }, 120);
      };

      block.addEventListener('pointerenter', show);
      block.addEventListener('pointerleave', hide);
      inst.el.addEventListener('pointerenter', show);
      inst.el.addEventListener('pointerleave', hide);
    });
  });

  repositionInserters(win);
}

function repositionInserters(win) {
  inserterInstances.forEach((inst) => positionInserter(win, inst));
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
  } else {
    el.style.left = `${r.left}px`;
    el.style.top = `${r.bottom - 15}px`;
    el.style.width = `${r.width}px`;
    el.style.height = '30px';
    el.style.flexDirection = 'row';
    line.style.cssText = 'height:2px;flex:1;background:rgba(99,102,241,.55);';
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
    win.parent.postMessage(
      {
        source: 'statamic-visual-editor',
        type: 'add-block-native',
        anchorUid: opts.block ? opts.block.getAttribute(SID_ATTR) : null,
        sectionUid: opts.scope || null,
        position: opts.position || null,
      },
      win.location.origin
    );
  });

  wrap.appendChild(line);
  wrap.appendChild(btn);
  wrap.__line = line;

  return { el: wrap, ...opts };
}

initBridge();
