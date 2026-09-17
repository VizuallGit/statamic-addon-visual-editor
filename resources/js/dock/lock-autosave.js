/**
 * code-dock.js — region "lock-autosave", split out in WP5. Same statements, same order;
 * only the imports are new. See the barrel code-dock.js for what the shell exports.
 */
import { chromeGet, chromeSet } from '../chrome-prefs.js';
import { on } from '../cp/bus.js';
import ChoiceDialog from '../cp/surfaces/ChoiceDialog.vue';
import { openCpOverlay } from '../cp/open-overlay.js';
import { csrfToken } from '../lib/csrf.js';
import { t } from '../lib/i18n.js';
import { dock } from '../dock/state.js';
import { AUTOSAVE_ICON, AUTOSAVE_KEY, DOCK_ID, SAVE_ICON, UNLOCK_ID, editors } from '../code-dock.js';
import { readParts, sameParts, writeParts } from './css-tools.js';
import { flushSave } from './save.js';
import { paintHtmlScope, paintLock } from './scope.js';
import { setStatus } from './layout.js';

// ===== lock-autosave =====
export function bindLock(win, dock) {
  if (dock._sveLockBound) {
    return;
  }

  dock._sveLockBound = true;

  dock.querySelector('[data-sve-code-lock]')?.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!dock.lockReady || !dock.lastType) {
      return;
    }

    if (dock.lastLocked) {
      confirmUnlock(win);

      return;
    }

    setTemplateLock(win, true);
  });
}

export function autosaveEnabled(win) {
  if (!win) {
    return true;
  }

  return chromeGet(win, AUTOSAVE_KEY) !== '0';
}

function dockIsDirty() {
  const view = editors.html;

  if (!view || view.state.readOnly || !dock.lastType) {
    return false;
  }

  return !sameParts(readParts(), dock.lastParts);
}

export function paintAutosave(win) {
  const dock = win?.document.getElementById(DOCK_ID);
  const autoBtn = dock?.querySelector('[data-sve-code-autosave]');
  const saveBtn = dock?.querySelector('[data-sve-code-save]');

  if (!autoBtn || !saveBtn) {
    return;
  }

  const on = autosaveEnabled(win);
  const dirty = dockIsDirty();

  autoBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
  autoBtn.title = t(win, on ? 'code_dock_autosave_on' : 'code_dock_autosave_off');
  autoBtn.setAttribute('aria-label', autoBtn.title);
  autoBtn.innerHTML = AUTOSAVE_ICON;

  saveBtn.hidden = on;
  saveBtn.title = t(win, 'code_dock_save');
  saveBtn.setAttribute('aria-label', saveBtn.title);
  saveBtn.innerHTML = SAVE_ICON;

  if (dirty) {
    saveBtn.setAttribute('data-dirty', '');
  } else {
    saveBtn.removeAttribute('data-dirty');
  }
}

export function bindAutosave(win, dock) {
  if (dock._sveAutosaveBound) {
    return;
  }

  dock._sveAutosaveBound = true;

  dock.querySelector('[data-sve-code-autosave]')?.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();

    const next = !autosaveEnabled(win);

    chromeSet(win, AUTOSAVE_KEY, next ? '1' : '0');

    if (next) {
      flushSave(win.document);
    } else if (dock.saveTimer) {
      clearTimeout(dock.saveTimer);
      dock.saveTimer = null;
    }

    paintAutosave(win);
  });

  dock.querySelector('[data-sve-code-save]')?.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    flushSave(win.document);
  });
}

function confirmUnlock(win) {
  win.document.getElementById(UNLOCK_ID)?.remove();

  const overlay = openCpOverlay(win.document, ChoiceDialog, {
    title: t(win, 'code_dock_unlock_title'),
    body: t(win, 'code_dock_unlock_body'),
    buttons: [
      { value: 'cancel', label: t(win, 'cancel'), variant: 'ghost' },
      { value: 'ok', label: t(win, 'code_dock_unlock_confirm'), variant: 'primary' },
    ],
    onPick: (value) => {
      overlay.dismiss();

      if (value === 'ok') {
        setTemplateLock(win, false);
      }
    },
  });

  overlay.host.id = UNLOCK_ID;
}

function setTemplateLock(win, locked) {
  const type = dock.lastType;

  if (!type) {
    return;
  }

  const go = () => {
    if (dock.lastType !== type) {
      return;
    }

    win
      .fetch('/!/sve/section-template/lock', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken(win),
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({ type, locked }),
      })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(String(res.status));
        }

        if (dock.lastType !== type) {
          return;
        }

        dock.lastLocked = locked;
        paintLock(win);
        writeParts(dock.lastParts, locked);
        paintHtmlScope(win);
        setStatus(win.document, locked ? t(win, 'code_dock_locked') : '');
      })
      .catch(() => {
        setStatus(win.document, t(win, 'code_dock_error'));
      });
  };

  if (locked) {
    flushSave(win.document);

    if (dock.saveInFlight) {
      dock.saveInFlight.finally(go);

      return;
    }
  }

  go();
}
