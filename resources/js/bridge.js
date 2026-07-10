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
            outline-style: solid !important;
            outline-color: var(--sve-focus-color, currentColor) !important;
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
function requestInlineEdit(win, wrapper, event) {
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
    },
    win.location.origin
  );
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

  const session = {
    requestId: data.requestId,
    mode: data.mode, // 'string' | 'bard'
    el,
    restoreHtml: el.innerHTML,
    hadContentEditable: el.getAttribute('contenteditable'),
    inputTimer: null,
    dirty: false,
  };

  // plaintext-only keeps existing inline markup (strong/em/a) intact while
  // typed or pasted content stays plain text. Firefox doesn't support it —
  // fall back to standard contenteditable there.
  try {
    el.contentEditable = 'plaintext-only';
  } catch {
    /* unsupported value */
  }

  if (el.contentEditable !== 'plaintext-only') {
    el.contentEditable = 'true';
  }

  el.setAttribute(EDITING_ATTR, '');

  session.onInput = () => {
    session.dirty = true;
    clearTimeout(session.inputTimer);
    session.inputTimer = setTimeout(() => sendEditInput(win, session), EDIT_INPUT_DEBOUNCE);
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

  session.onBlur = () => finishEditing(win, false);

  el.addEventListener('input', session.onInput);
  el.addEventListener('keydown', session.onKeydown);
  el.addEventListener('blur', session.onBlur);

  editing = session;
  win.__sveInlineEdit.active = true;

  el.focus();
  placeCaretFromPoint(win, clickX, clickY);
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

    if (clearTimer) {
      clearTimeout(clearTimer);
    }

    clearTimer = setTimeout(() => {
      win.document.documentElement.classList.remove(MOUSE_ACTIVE_CLASS);
      win.document.querySelectorAll(`[${INNER_ATTR}]`).forEach((el) => {
        el.removeAttribute(INNER_ATTR);
      });
    }, HOVER_CLEAR_DELAY);
  };
}

export function createClickHandler(win) {
  return function handleClick(event) {
    if (editing) {
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
      win.top.postMessage(
        {
          source: 'statamic-visual-editor',
          type: 'popup',
          uid: target.getAttribute(SID_ATTR),
          // The containing section's uid — lets the CP expand and scroll the
          // publish form to the section whose popup is being opened.
          sectionUid:
            target.parentElement?.closest(`[${SID_ATTR}]`)?.getAttribute(SID_ATTR) ?? null,
        },
        win.location.origin
      );

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

      // Also try to edit the clicked text right here in the preview.
      requestInlineEdit(win, target, event);

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
        clearTimeout(pendingEdit.timeout);
        pendingEdit = null;
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
}

initBridge();
