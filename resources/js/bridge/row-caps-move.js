/**
 * bridge.js — region "row-caps-move", split out in WP5. Same statements, same order;
 * only the imports are new. See the barrel bridge.js for what the shell exports.
 */
import { bridgeState } from '../bridge/state.js';
import { SECTION_ORDERABLE_ATTR } from '../bridge.js';

// ===== row-caps-move =====
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
export function applyRowCaps(data) {
  if (bridgeState.pendingRowCaps && bridgeState.pendingRowCaps.uid === data.uid) {
    const { resolve } = bridgeState.pendingRowCaps;

    bridgeState.pendingRowCaps = null;
    resolve(data);
  }

  if (!bridgeState.moveCtrlRowButtons || bridgeState.moveCtrlRowButtons.uid !== data.uid) {
    return;
  }

  setRowButtonDisabled(bridgeState.moveCtrlRowButtons.addBtn, !data.canAdd);
  setRowButtonDisabled(bridgeState.moveCtrlRowButtons.removeBtn, !data.canRemove);
}

/**
 * Asks the CP whether this row's field can take another / lose this one.
 * Resolves with { canAdd, canRemove }; falls back to allowing both if the
 * reply never arrives (so a hung CP can't trap the menu closed).
 */
export function requestRowCaps(win, uid) {
  return new Promise((resolve) => {
    if (bridgeState.pendingRowCaps) {
      bridgeState.pendingRowCaps.resolve({ canAdd: true, canRemove: true });
    }

    const timer = win.setTimeout(() => {
      if (bridgeState.pendingRowCaps?.uid === uid) {
        bridgeState.pendingRowCaps = null;
        resolve({ canAdd: true, canRemove: true });
      }
    }, 400);

    bridgeState.pendingRowCaps = {
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

export function hideMoveControl(win) {
  if (bridgeState.moveCtrlEl) {
    bridgeState.moveCtrlEl.remove();
    bridgeState.moveCtrlEl = null;
  }

  if (bridgeState.moveReposition) {
    win.removeEventListener('scroll', bridgeState.moveReposition, true);
    win.removeEventListener('resize', bridgeState.moveReposition);
    bridgeState.moveReposition = null;
  }

  bridgeState.moveTargetEl = null;
  bridgeState.moveCtrlRowButtons = null;
}

// Block action bar (hide/dup/delete) placement.
// - 'left-vertical'     → vertical stack on the left (right if no room)  [current]
// - 'above-horizontal'  → horizontal strip just above the field         [previous,
//                         restore this if the left layout feels worse]
export const BLOCK_CTRL_LAYOUT = 'above-horizontal';

export function positionMoveControl(win) {
  if (!bridgeState.moveCtrlEl || !bridgeState.moveTargetEl || !bridgeState.moveTargetEl.isConnected) {
    return;
  }

  const rect = bridgeState.moveTargetEl.getBoundingClientRect();
  const height = bridgeState.moveCtrlEl.offsetHeight || 32;
  const width = bridgeState.moveCtrlEl.offsetWidth || 32;
  const isSection = bridgeState.moveTargetEl.hasAttribute(SECTION_ORDERABLE_ATTR);
  const gap = 8;
  const margin = 8;

  // Page sections keep the original top-right pin so ↑/↓ stay reachable.
  if (isSection) {
    const left = Math.max(rect.right - width - 10, 10);
    const clash = bridgeState.pillBox && left + width > bridgeState.pillBox.left;
    const min = clash ? bridgeState.pillBox.bottom + 8 : 10;
    const top = Math.min(Math.max(rect.top + 10, min), Math.max(rect.bottom - height - 10, min));

    bridgeState.moveCtrlEl.style.top = `${top}px`;
    bridgeState.moveCtrlEl.style.left = `${left}px`;

    return;
  }

  const layout = bridgeState.moveCtrlEl.dataset.sveLayout || BLOCK_CTRL_LAYOUT;

  // Previous layout — horizontal strip above the field (kept for easy restore).
  if (layout === 'above-horizontal') {
    let top = rect.top - height - gap;

    if (top < margin) {
      top = rect.bottom + gap;
    }

    const left = Math.max(margin, Math.min(rect.left, win.innerWidth - width - margin));

    bridgeState.moveCtrlEl.style.top = `${top}px`;
    bridgeState.moveCtrlEl.style.left = `${left}px`;

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

  if (bridgeState.pillBox && left + width > bridgeState.pillBox.left && top < bridgeState.pillBox.bottom + 8) {
    top = Math.max(top, bridgeState.pillBox.bottom + 8);
  }

  bridgeState.moveCtrlEl.style.top = `${top}px`;
  bridgeState.moveCtrlEl.style.left = `${left}px`;
}

/** True when the pointer is in the gap between the control and its target. */
export function pointerInMoveControlGap(event) {
  if (!bridgeState.moveCtrlEl || !bridgeState.moveTargetEl) {
    return false;
  }

  if (bridgeState.moveCtrlEl.contains(event.target) || bridgeState.moveTargetEl.contains(event.target)) {
    return true;
  }

  const x = event.clientX;
  const y = event.clientY;
  const cr = bridgeState.moveCtrlEl.getBoundingClientRect();
  const tr = bridgeState.moveTargetEl.getBoundingClientRect();
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
