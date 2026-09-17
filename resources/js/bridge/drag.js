/**
 * bridge.js — region "drag", split out in WP5. Same statements, same order;
 * only the imports are new. See the barrel bridge.js for what the shell exports.
 */
import { bridgeState } from '../bridge/state.js';
import { DRAG_THRESHOLD, ORDERABLE_ATTR, finishWidthDrag, isHorizontalFlow, updateWidthDrag, widthDrag } from './grid.js';
import { INSERT_ATTR } from './outline-nav.js';
import { GLOBAL_ROOT_ATTR, GLOBAL_ROW_ATTR, blockHolding, peerRect } from './row-toolbar.js';
import { SECTION_ORDERABLE_ATTR, SID_ATTR, t } from '../bridge.js';
import { BLOCK_CTRL_LAYOUT, hideMoveControl, positionMoveControl } from './row-caps-move.js';
import { ICONS, detectCpDark, toolbarThemeFor } from './inline-edit.js';
import { sidTemplatePayload } from './inserters.js';

// ===== drag =====
export function orderablePeers(el) {
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
export function solidBackgroundFor(win, el) {
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
export function parseCssColor(colour, win) {
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
export function applyOutlineTone(win, el) {
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
export function zoomOutForDrag(win) {
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

export function restoreZoom(win, previous) {
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

export function endDrag(win) {
  if (!bridgeState.dragState) {
    return;
  }

  bridgeState.dragState.el.style.opacity = '';
  bridgeState.dragState.indicator?.remove();
  bridgeState.dragState.ghost?.remove();
  restoreZoom(win, bridgeState.dragState.zoom);
  win.document.documentElement.classList.remove('sve-dragging');
  bridgeState.dragState = null;
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

export function createDragPointerDown(win) {
  return function onPointerDown(event) {
    if (event.button !== 0 || bridgeState.editing || bridgeState.dragState) {
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
    bridgeState.dragState = {
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

export function createDragPointerMove(win) {
  return function onPointerMove(event) {
    if (widthDrag) {
      updateWidthDrag(win, event);

      return;
    }

    if (!bridgeState.dragState) {
      return;
    }

    if (!bridgeState.dragState.active) {
      const moved = Math.hypot(event.clientX - bridgeState.dragState.startX, event.clientY - bridgeState.dragState.startY);

      if (moved < DRAG_THRESHOLD) {
        return;
      }

      bridgeState.dragState.active = true;
      bridgeState.dragState.el.style.opacity = '0.45';
      win.document.documentElement.classList.add('sve-dragging');
      hideMoveControl(win);

      const indicator = createDropIndicator(win, bridgeState.dragState.section);

      indicator.style.setProperty('--sve-drop-color', dropMarkerColor(win, bridgeState.dragState.el));
      bridgeState.dragState.indicator = indicator;

      // Ghost first (it measures the element at natural size), then the zoom.
      const { ghost, scale } = buildDragGhost(win, bridgeState.dragState.el);

      bridgeState.dragState.ghost = ghost;
      bridgeState.dragState.ghostScale = scale;

      if (bridgeState.dragState.section) {
        bridgeState.dragState.zoom = zoomOutForDrag(win);
      }
    }

    event.preventDefault();
    moveDragGhost(bridgeState.dragState, event.clientX, event.clientY);

    const { peers, horizontal } = bridgeState.dragState;
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

    bridgeState.dragState.insert = insert;
    paintDropIndicator(bridgeState.dragState);
  };
}

export function createDragPointerUp(win) {
  return function onPointerUp() {
    if (widthDrag) {
      finishWidthDrag(win, false);

      return;
    }

    if (!bridgeState.dragState) {
      return;
    }

    const { active, uid, fromIndex, insert } = bridgeState.dragState;

    endDrag(win);

    if (!active) {
      return; // plain click — let it proceed untouched
    }

    // The click event that follows this pointerup must not start an inline
    // edit or focus jump — the user was dragging, not clicking.
    bridgeState.dragJustEnded = true;
    setTimeout(() => (bridgeState.dragJustEnded = false), 250);

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

export function showMoveControl(win, moveEl) {
  if (bridgeState.moveTargetEl === moveEl) {
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

  bridgeState.moveTargetEl = moveEl;

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
      if (event.button !== 0 || bridgeState.editing || bridgeState.dragState) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      bridgeState.dragState = {
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

      bridgeState.moveCtrlRowButtons = { uid, addBtn: dupBtn, removeBtn };
      win.parent.postMessage({ source: 'statamic-visual-editor', type: 'row-caps', uid }, win.location.origin);
    } else {
      const addBtn = rowButton('+', t('add_another'), 'add-row', '', false, sidTemplatePayload(moveEl));
      // Taking away the last row leaves the block holding this field with
      // nothing to draw — see blockHolding(). The uid, not the element: this
      // rides across postMessage, which can only carry plain data.
      const removeBtn = rowButton('−', t('remove_this'), 'remove-row', '', false, {
        emptyRemovesBlock: blockHolding(moveEl)?.getAttribute(SID_ATTR) || null,
      });

      bridgeState.moveCtrlRowButtons = { uid, addBtn, removeBtn };
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
    bridgeState.moveCtrlRowButtons = { uid, addBtn: null, removeBtn: minus };
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
  bridgeState.moveCtrlEl = ctrl;

  bridgeState.moveReposition = () => positionMoveControl(win);
  win.addEventListener('scroll', bridgeState.moveReposition, true);
  win.addEventListener('resize', bridgeState.moveReposition);
  positionMoveControl(win);
}
