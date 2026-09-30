/**
 * bridge.js — region "outline-nav", split out in WP5. Same statements, same order;
 * only the imports are new. See the barrel bridge.js for what the shell exports.
 */
import { HT_PATH_ATTR, unstampHtmlPick } from '../html-pick-align.js';
import { handleAiTextMessage, initAiText } from '../ai-text-bridge.js';
import { bridgeState } from '../bridge/state.js';
import { ACTIVE_ATTR, HOVER_ATTR, PULSE_DURATION, SECTION_ORDERABLE_ATTR, SID_ATTR, SID_FIELD_ATTR, STYLES_ID, t } from '../bridge.js';
import { applyOutlineTone, createDragPointerDown, createDragPointerMove, createDragPointerUp, endDrag, parseCssColor, restoreZoom, solidBackgroundFor, zoomOutForDrag } from './drag.js';
import { COMPONENT_NAME, COMPONENT_SRC, applyComponentFocus, applyComponentMap, applyHtmlPick, pointAnchor } from './component-pick.js';
import { applyRowCaps, hideMoveControl } from './row-caps-move.js';
import { exitChromeFocus, hasChromeFocusClass, markDisabledChrome, rebindChromeFocus, rememberedChromeKind, requestCloseChrome, setChromeDirtyUI } from './header-footer.js';
import { GLOBAL_BAR_ID, openRowToolbar } from './row-toolbar.js';
import { cpDialogTheme, exitGlobalFocus, mountGlobalBar, rebindGlobalFocus, requestCloseGlobal, setGlobalSectionDirtyUI, tagGlobalSections } from './global-sections.js';
import { createMouseMoveHandler, startEditing } from './editing.js';
import { enhanceHighlightBraces, findTextAfterSetUid, openToolbarMenu, requestInlineEdit, syncSidPlaceholders } from './inline-edit.js';
import { injectCpVariables, injectStyles } from './messages.js';
import { createClickHandler, createHoverHandler } from './sid-targets.js';
import { finishWidthDrag, hideColumnChrome, hideGridLines, widthDrag } from './grid.js';
import { repositionInserters, setupInserters } from './inserters.js';
import { MSG, SOURCE } from '../lib/protocol.js';
import { applyVideoHolds, setVideoHold, watchVideoPauses } from './video-hold.js';

// ===== outline-nav =====
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
      { source: SOURCE, type: MSG.EXT_DROP, afterUid },
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
    { source: SOURCE, type: MSG.OUTLINE, items: collectOutline(win) },
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

    if (!data || data.source !== SOURCE) {
      return;
    }

    // AI text owns every ai-text-* message and answers for all of them, so it
    // is asked before the chain below rather than added to the end of it.
    if (handleAiTextMessage(data)) {
      return;
    }

    if (data.type === MSG.SVE_HTML_PICK) {
      if (!data.on) {
        bridgeState.htmlPick = null;
        unstampHtmlPick(win.document);

        return;
      }

      bridgeState.htmlPick = {
        uid: data.uid || '',
        uids: Array.isArray(data.uids) ? data.uids : [],
        tag: data.tag || '',
        klass: data.klass || '',
        all: !!data.all,
        nodes: data.nodes || [],
      };
      applyHtmlPick(win);

      return;
    }

    if (data.type === MSG.SVE_COMPONENT_MAP) {
      bridgeState.componentMap = Array.isArray(data.items) ? data.items : [];
      applyComponentMap(win);

      return;
    }

    if (data.type === MSG.SVE_COMPONENT_FOCUS) {
      bridgeState.componentFocus = data.on ? { name: data.name || '', selector: data.selector || '' } : null;
      applyComponentFocus(win);

      return;
    }

    if (data.type === MSG.SVE_HTML_PICK_FOCUS) {
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

    if (data.type === MSG.SVE_VIDEO_HOLD) {
      setVideoHold(win, data);

      return;
    }

    if (data.type === MSG.EXT_DRAG_START) {
      extDragStart(win);

      return;
    }

    if (data.type === MSG.OUTLINE_WATCH) {
      watchOutline(win, !!data.on);

      return;
    }

    if (data.type === MSG.OUTLINE_FOCUS) {
      focusOutlineEntry(win, data.index);

      return;
    }

    if (data.type === MSG.EXT_DRAG_MOVE) {
      extDragMove(win, data.x, data.y);

      return;
    }

    if (data.type === MSG.EXT_DRAG_END) {
      extDragEnd(win, !!data.cancelled);

      return;
    }

    if (data.type === MSG.ROW_CAPS_RESULT) {
      applyRowCaps(data);

      return;
    }

    // CP re-asserts header/footer focus after Theme Settings morphs the preview.
    if (data.type === MSG.SVE_RESTORE_CHROME) {
      rebindChromeFocus(win, data.kind === 'footer' ? 'footer' : 'header');

      return;
    }

    if (data.type === MSG.SVE_CHROME_DIRTY) {
      setChromeDirtyUI(!!data.dirty, data.fields, win);

      return;
    }

    if (data.type === MSG.SVE_GLOBAL_DIRTY) {
      // The label arrives with the dirty state because it comes from the same
      // place: the values the panel streams up. It can be null on the first
      // reply, before the form has hydrated — keep the last real one.
      if (data.label) {
        const changed = bridgeState.globalSectionLabel !== data.label;

        bridgeState.globalSectionLabel = data.label;

        if (changed && win.document.getElementById(GLOBAL_BAR_ID)) {
          mountGlobalBar(win);
        }
      }

      setGlobalSectionDirtyUI(!!data.dirty);

      return;
    }

    // CP finished a close (clean, or after discard confirm) — drop focus UI.
    // Panel already dismissed by CP; don't post close-* again.
    if (data.type === MSG.SVE_FORCE_EXIT_CHROME) {
      setChromeDirtyUI(false);
      bridgeState.chromeFocusKindSticky = null;
      win.__sveChromeKind = null;
      exitChromeFocus(win, false);

      return;
    }

    if (data.type === MSG.SVE_FORCE_EXIT_GLOBAL) {
      setGlobalSectionDirtyUI(false);
      exitGlobalFocus(win, false);

      return;
    }

    // Where the CP's floating "back" pill sits, in our coordinates — so a
    // section's control can step out from under it.
    if (data.type === MSG.SVE_PILL_BOX) {
      bridgeState.pillBox = { bottom: data.bottom, left: data.left };

      return;
    }

    // The block tree asking for a row to be selected the way clicking it on the
    // page selects it — outlined, scrolled to, and with its toolbar up.
    //
    // A message rather than a synthesised click: a click carries a position, and
    // the position is what decides which block of a Bard field is being edited.
    // There is no position here, so the element is named instead and the rest of
    // the flow is the ordinary one.
    if (data.type === MSG.SVE_ACTIVATE) {
      activateByUid(win, data);

      return;
    }

    if (data.type === MSG.EDIT_START) {
      startEditing(win, data);

      return;
    }

    // Panel still hydrating — stretch the pending-edit window so a quick click
    // right after entering a global section isn't abandoned at 2s.
    if (data.type === MSG.EDIT_PENDING) {
      if (bridgeState.pendingEdit && bridgeState.pendingEdit.requestId === data.requestId) {
        clearTimeout(bridgeState.pendingEdit.timeout);
        bridgeState.pendingEdit.timeout = setTimeout(() => {
          if (bridgeState.pendingEdit && bridgeState.pendingEdit.requestId === data.requestId) {
            bridgeState.pendingEdit = null;
          }
        }, 10000);
      }

      return;
    }

    if (data.type === MSG.EDIT_DENY) {
      if (bridgeState.pendingEdit && bridgeState.pendingEdit.requestId === data.requestId) {
        const { popupFallback } = bridgeState.pendingEdit;

        clearTimeout(bridgeState.pendingEdit.timeout);
        bridgeState.pendingEdit = null;

        // Dual popup+field element whose click didn't resolve to editable
        // text — open the popup, as a plain click on the block always did.
        if (popupFallback) {
          win.parent.postMessage(popupFallback, win.location.origin);
        }
      }

      return;
    }

    if (data.type === MSG.HOVER) {
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

    if (data.type === MSG.FOCUS) {
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
  initAiText(win, t, {
    // The CP's accent — the colour its buttons are painted in.
    primary: () => cpDialogTheme(win).primary,
    // Is the surface behind this element dark? Same readers the drop marker and
    // the edit toolbar use, so a popover on a dark section flips the same way
    // the toolbar above it does. The 0.3 cut matches toolbar-look.js.
    surfaceIsDark: (el) => {
      const parsed = parseCssColor(solidBackgroundFor(win, el), win);

      if (!parsed) {
        return false;
      }

      return (0.2126 * parsed.r + 0.7152 * parsed.g + 0.0722 * parsed.b) / 255 < 0.3;
    },
  });
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
  // Right-click a component in the page to open its file. The browser menu is
  // only taken over where there is a component to offer — everywhere else the
  // page behaves as it always did.
  win.addEventListener(
    'contextmenu',
    (event) => {
      const el = event.target?.closest?.(`[${COMPONENT_SRC}]`);

      if (!el) {
        return;
      }

      const src = el.getAttribute(COMPONENT_SRC);

      if (!src) {
        return;
      }

      event.preventDefault();

      const name = el.getAttribute(COMPONENT_NAME) || src;

      openToolbarMenu(win, pointAnchor(event.clientX, event.clientY), 'component', [
        {
          label: t('component_open_named', { name }),
          run: () => {
            win.parent.postMessage(
              { source: SOURCE, type: MSG.OPEN_COMPONENT, src },
              win.location.origin
            );
          },
        },
      ]);
    },
    true
  );

  watchVideoPauses(win);
  // A fresh document knows no holds; the panel remembers them.
  win.parent.postMessage({ source: SOURCE, type: MSG.SVE_VIDEO_HOLDS_REQUEST }, win.location.origin);

  win.addEventListener('statamic:preview-updated', () => {
    // Holds put back, and autoplay put right, on every draw — not only while
    // something is held: the morph itself can leave a video standing still.
    applyVideoHolds(win);

    if (bridgeState.htmlPick) {
      applyHtmlPick(win);
    }

    if (bridgeState.componentFocus) {
      applyComponentFocus(win);
    }

    if (bridgeState.componentMap.length) {
      applyComponentMap(win);
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
    const focusedId = bridgeState.globalFocusId;
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
    if (event.key === 'Escape' && !bridgeState.editing) {
      if (win.document.getElementById('__sve-preview-confirm')) {
        win.document.getElementById('__sve-preview-confirm')?.remove();

        return;
      }

      if (bridgeState.chromeFocusEl || hasChromeFocusClass(win.document)) {
        requestCloseChrome(win);
      } else if (bridgeState.globalFocusEl) {
        requestCloseGlobal(win);
      }
    }
  });

  tagGlobalSections(win);

  // The CP posts the pill's box when its chrome re-renders — which has already
  // happened by the time we boot in here. Ask for it, now that we're listening.
  win.parent.postMessage({ source: SOURCE, type: MSG.SVE_PILL_BOX_REQUEST }, win.location.origin);

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

export const INSERT_ATTR = 'data-sid-insert';
export const INSERT_LAYER_ID = '__sve-inserters';
// Sit the stacked "+" just below the last block, not straddling its bottom edge.
export const INSERT_AFTER_GAP = 8;
