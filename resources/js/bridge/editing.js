/**
 * bridge.js — region "editing", split out in WP5. Same statements, same order;
 * only the imports are new. See the barrel bridge.js for what the shell exports.
 */
import { HT_PATH_ATTR } from '../html-pick-align.js';
import { bridgeState } from '../bridge/state.js';
import { normText } from './messages.js';
import { caretAtEndOf, collectBlockClassesFromStyles, controlsFrom, currentBlockEl, editableFromWrapper, highlightSpansToBraces, placeCaretFromPoint, positionEditToolbar, removeBardSetInserter, removeEditToolbar, sendEditInput, syncSidPlaceholders, updateBardSetInserter, updateEditToolbarState } from './inline-edit.js';
import { ACTIVE_ATTR, EDITING_ATTR, EDIT_INPUT_DEBOUNCE, HOVER_ATTR, HOVER_CLEAR_DELAY, INNER_ATTR, MOUSE_ACTIVE_CLASS, SECTION_ORDERABLE_ATTR, SID_FIELD_ATTR } from '../bridge.js';
import { applyOutlineTone, showMoveControl } from './drag.js';
import { hideMoveControl, pointerInMoveControlGap } from './row-caps-move.js';
import { blockHolding, createEditToolbar, hoverBeltEl, pointerInHoverBeltGap } from './row-toolbar.js';
import { ORDERABLE_ATTR, hideColumnChrome, maybeShowColumnChrome, toneOutlineContainer, widthDrag } from './grid.js';
import { INSERT_ATTR } from './outline-nav.js';
import { resolveSidTarget } from './sid-targets.js';

// ===== editing =====
/** Handles an edit-start reply: turns the target element contenteditable. */
export function startEditing(win, data) {
  if (!bridgeState.pendingEdit || bridgeState.pendingEdit.requestId !== data.requestId) {
    return;
  }

  const { wrapper, blockEl, clickX, clickY, timeout } = bridgeState.pendingEdit;

  clearTimeout(timeout);
  bridgeState.pendingEdit = null;

  if (bridgeState.editing) {
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
      // An empty field still renders its placeholder as real markup — the
      // template draws it so it reaches the frontend and section previews too.
      // With no nodes to match, every child ends up locked, the placeholder
      // among them: the wrapper takes a toolbar but can never be typed into.
      //
      // Inline Bard (headline) has no child to lock — the placeholder sits
      // straight in the wrapper, so you type on top of it and it becomes the
      // value. Leave richtext's placeholder unlocked so it behaves the same
      // way. Anything else sharing the wrapper is foreign and still gets locked.
      const placeholderKids = [];

      if (!nodes.length) {
        const hint = normText(wrapper.getAttribute('data-sid-placeholder') || '');

        if (hint) {
          kids.forEach((kid) => {
            if (normText(kid.textContent) === hint) {
              placeholderKids.push(kid);
            }
          });
        }
      }

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

      lockedEls = kids.filter(
        (kid) => !blocks.includes(kid) && !placeholderKids.includes(kid)
      );
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
  bridgeState.editing = session;
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
  if (!bridgeState.editing) {
    return;
  }

  const session = bridgeState.editing;

  // Clear first: el.blur() below re-fires onBlur → finishEditing must no-op.
  bridgeState.editing = null;

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
  if (bridgeState.moveCtrlEl && bridgeState.moveCtrlEl.contains(event.target)) {
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

  if (bridgeState.editing) {
    const editRoot = bridgeState.editing.wrapper || bridgeState.editing.el;

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
export function wrapUpBeltTarget(target, event) {
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
    // inline-edited (that used to early-return and made "hover down" feel broken),
    // and while the HTML tree is pointing at the preview: pointing at a tag and
    // moving the section around it are two different jobs, and the belt's own
    // buttons already stop their clicks before the pick handler sees them.
    updateMoveControlFromPointer(win, event);

    if (bridgeState.editing) {
      return;
    }

    win.document.documentElement.classList.add(MOUSE_ACTIVE_CLASS);

    if (bridgeState.htmlPick) {
      // The belt hovers above the section it belongs to, and is not part of the
      // page — reaching for one of its buttons must not read as "left the tag".
      if (bridgeState.moveCtrlEl && bridgeState.moveCtrlEl.contains(event.target)) {
        return;
      }

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
      if (!(bridgeState.moveCtrlEl && (bridgeState.moveCtrlEl.matches(':hover') || bridgeState.moveTargetEl?.matches(':hover')))) {
        hideMoveControl(win);
      }

      if (!widthDrag) {
        hideColumnChrome(win);
      }
    }, HOVER_CLEAR_DELAY);
  };
}
