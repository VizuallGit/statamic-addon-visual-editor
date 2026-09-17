/**
 * bridge.js — region "inline-edit", split out in WP5. Same statements, same order;
 * only the imports are new. See the barrel bridge.js for what the shell exports.
 */
import { bridgeState } from '../bridge/state.js';
import { EDITING_ATTR, EDIT_REQUEST_TIMEOUT, SID_ATTR, SID_FIELD_ATTR, featureOn, t } from '../bridge.js';
import { normText } from './messages.js';
import { finishEditing } from './editing.js';
import { applyOutlineTone } from './drag.js';

// ===== inline-edit =====
/**
 * Returns the nearest preceding sibling that is (or contains) a non-text
 * [data-sid] element. Handles cases where data-sid lives on a descendant
 * element rather than the sibling itself (e.g. video IFRAME inside a wrapper
 * div that has no data-sid of its own).
 */
export function findPrecedingSetSibling(el) {
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
export function editableFromWrapper(wrapper) {
  let el = wrapper;

  while (
    el.children.length === 1 &&
    normText(el.children[0].textContent) === normText(el.textContent)
  ) {
    el = el.children[0];
  }

  return el;
}

export function placeCaretFromPoint(win, x, y) {
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
export function controlsFrom(wrapper) {
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
export function requestInlineEdit(win, wrapper, event, options = {}) {
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

  const requestId = `sve-edit-${++bridgeState.requestSeq}`;

  if (bridgeState.pendingEdit) {
    clearTimeout(bridgeState.pendingEdit.timeout);
  }

  bridgeState.pendingEdit = {
    requestId,
    wrapper,
    blockEl,
    clickX: event.clientX,
    clickY: event.clientY,
    // Posted instead when the CP denies the edit (dual popup+field elements).
    popupFallback: options.popupFallback ?? null,
    timeout: setTimeout(() => {
      if (bridgeState.pendingEdit && bridgeState.pendingEdit.requestId === requestId) {
        bridgeState.pendingEdit = null;
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
export function currentBlockEl(win, session) {
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
export function caretAtEndOf(win, el) {
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
export function syncSidPlaceholders(doc) {
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

export function removeBardSetInserter(session) {
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
export function updateBardSetInserter(win, session) {
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

export function sendEditInput(win, session) {
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

/**
 * True when the CP (parent window) is in dark mode. Checks explicit theme
 * markers first, then falls back to the luminance of the CP's background — so
 * it works regardless of how Statamic flags the theme. Cross-origin access is
 * guarded (returns light on failure).
 */
export function detectCpDark(win) {
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
export function toolbarThemeFor(dark) {
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

export function removeEditToolbar() {
  if (bridgeState.toolbarEl) {
    // The control dropdown lives on <body>, not in the bar — it would outlive it.
    bridgeState.toolbarEl.ownerDocument.querySelector('[data-sve-menu]')?.remove();
    bridgeState.toolbarEl.remove();
    bridgeState.toolbarEl = null;
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
export function openToolbarMenu(win, anchor, key, rows) {
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

  const theme = bridgeState.toolbarTheme || toolbarThemeFor(detectCpDark(win));
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
export function openControlMenu(win, anchor, control, onPick) {
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
export function highlightSpansToBraces(el) {
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
export function openHighlightColorMenu(win, anchor, control, session, onPick) {
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
export function applyHighlightColor(win, session, control, value) {
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
export function enhanceHighlightBraces(win) {
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

export function positionEditToolbar(win, session) {
  if (!bridgeState.toolbarEl) {
    return;
  }

  const rect = session.el.getBoundingClientRect();
  const barHeight = bridgeState.toolbarEl.offsetHeight || 34;
  let top = rect.top - barHeight - 10;

  // Not enough room above the element — flip below it.
  if (top < 8) {
    top = rect.bottom + 10;
  }

  const maxLeft = win.innerWidth - bridgeState.toolbarEl.offsetWidth - 8;

  bridgeState.toolbarEl.style.top = `${top}px`;
  bridgeState.toolbarEl.style.left = `${Math.max(8, Math.min(rect.left, maxLeft))}px`;
}

/** Highlights toggle buttons (bold/italic) that are active at the caret. */
export function updateEditToolbarState(win) {
  if (!bridgeState.toolbarEl) {
    return;
  }

  bridgeState.toolbarEl.querySelectorAll('[data-sve-cmd]').forEach((btn) => {
    let on = false;

    try {
      on = win.document.queryCommandState(btn.dataset.sveCmd);
    } catch {
      /* unsupported command */
    }

    btn.dataset.sveOn = on ? '1' : '';
    btn.style.background = on ? bridgeState.toolbarTheme?.active || '#e4e4e7' : 'transparent';
  });

  // Span-mark buttons (bard-texstyle) reflect whether the caret sits inside
  // a span of that class.
  const sel = win.getSelection();
  let selNode = sel && sel.rangeCount ? sel.getRangeAt(0).commonAncestorContainer : null;

  if (selNode && selNode.nodeType === 3) {
    selNode = selNode.parentElement;
  }

  bridgeState.toolbarEl.querySelectorAll('[data-sve-span-class]').forEach((btn) => {
    const cls = btn.dataset.sveSpanClass;
    const on = !!(selNode && selNode.closest?.(`span.${cls}`) && bridgeState.editing?.el.contains(selNode.closest(`span.${cls}`)));

    btn.dataset.sveOn = on ? '1' : '';
    btn.style.background = on ? bridgeState.toolbarTheme?.active || '#e4e4e7' : 'transparent';
  });

  // Block-format buttons reflect the current block's tag/class. In whole-field
  // mode "the current block" follows the selection.
  bridgeState.toolbarEl.querySelectorAll('[data-sve-block-tag]').forEach((btn) => {
    const el = bridgeState.editing ? currentBlockEl(win, bridgeState.editing) : null;
    let on = false;

    if (el) {
      const wantClass = btn.dataset.sveBlockClass || '';
      const tagMatches = el.tagName.toLowerCase() === btn.dataset.sveBlockTag;

      on = tagMatches && (wantClass ? el.classList.contains(wantClass) : !hasKnownBlockClass(bridgeState.editing, el));
    }

    btn.dataset.sveOn = on ? '1' : '';
    btn.style.background = on ? bridgeState.toolbarTheme?.active || '#e4e4e7' : 'transparent';
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
export function applyBlockFormat(win, session, spec) {
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
export function bardCommand(win, session, command) {
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
  const barRect = (bridgeState.toolbarEl || session.el).getBoundingClientRect();
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
export function toggleSpanClass(win, session, className) {
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
export function readSelectionVizuProp(win, session, prop) {
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
export function setVizuSpanProp(win, session, prop, value) {
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
export function clearVizuSpanProp(win, session, prop) {
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

export function applyVizuStyle(win, session, style) {
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
export function styleIdentHtml(ident, fallback = '?') {
  if (typeof ident === 'string' && ident.trimStart().startsWith('<')) {
    return `<span style="display:inline-flex;align-items:center;pointer-events:none;width:15px;height:15px">${ident}</span>`;
  }

  return letterIcon(ident || fallback);
}

export function collectBlockClassesFromStyles(bardStyles) {
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

export const headingIcon = (level) =>
  SVG(
    '0 0 14 14',
    `<path d="${HEADING_ICON['h' + level] || HEADING_ICON.h2}" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/>`
  );

// bard-texstyle buttons render a single letter over a "T" stem — the letter
// comes from the style config, so we build it from the style's ident.
export const letterIcon = (letter) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style="display:block;pointer-events:none"><path d="M9.492,2.338C9.931,2.338 10.307,1.941 10.307,1.502C10.307,1.063 9.931,0.666 9.492,0.666L1.104,0.666C0.665,0.666 0.289,1.063 0.289,1.502C0.289,1.941 0.665,2.338 1.104,2.338L4.41,2.338L4.41,14.565C4.41,15.045 4.807,15.443 5.308,15.443C5.789,15.443 6.186,15.045 6.186,14.565L6.186,2.338L9.492,2.338Z"></path><text text-anchor="middle" x="12.75" y="14.5" style="font-size:10px;stroke-width:1px;stroke:currentColor">${(letter || 'T').slice(0, 1).toUpperCase()}</text></svg>`;

export const ICONS = {
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
export function applyControlValue(win, session, control, value) {
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
