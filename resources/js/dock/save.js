/**
 * code-dock.js — region "save", split out in WP5. Same statements, same order;
 * only the imports are new. See the barrel code-dock.js for what the shell exports.
 */
import { replayLivePreview, topLevelSectionIds } from '../cp.js';
import { twCandidates } from '../tw-candidates.js';
import { tailwindDockOn } from '../tailwind-complete.js';
import { componentPropsOn } from '../component-props.js';
import { csrfToken } from '../lib/csrf.js';
import { t } from '../lib/i18n.js';
import { dock } from '../dock/state.js';
import { paintHtmlScope, paintLock } from './scope.js';
import { readParts, sameParts, writeParts } from './css-tools.js';
import { setStatus } from './layout.js';
import { autosaveEnabled, paintAutosave } from './lock-autosave.js';
import { DOCK_ID, SAVE_MS, css, editors, html } from '../code-dock.js';

// ===== save =====
export function refreshPreview(win) {
  if (!dock.lastUid || !dock.lastType || String(dock.lastType).startsWith('view:')) {
    replayLivePreview(win);

    return;
  }

  const sectionUids = topLevelSectionIds(dock.lastUid, win.document);

  replayLivePreview(win, sectionUids.length ? { sectionUids } : undefined);
}

function postSave(win, type, parts) {
  dock.saveInFlight = win
    .fetch('/!/sve/section-template', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': csrfToken(win),
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: JSON.stringify({
        type,
        html: parts.html,
        css: parts.css,
        js: parts.js,
        ...(typeof parts.tw === 'string' ? { tw: parts.tw } : {}),
        ...(componentPropsOn(win) ? { props: dock.lastProps } : {}),
      }),
    })
    .then(async (res) => {
      if (res.status === 423) {
        dock.lastLocked = true;
        dock.lockReady = true;
        paintLock(win);
        writeParts(dock.lastParts, true);
        paintHtmlScope(win);
        setStatus(win.document, t(win, 'code_dock_locked'));

        return;
      }

      if (!res.ok) {
        throw new Error(String(res.status));
      }

      if (dock.lastType === type) {
        dock.lastParts = parts;
        setStatus(win.document, t(win, 'code_dock_saved'));
        paintAutosave(win);
        win.setTimeout(() => {
          const el = win.document.getElementById(DOCK_ID)?.querySelector('[data-sve-code-status]');

          if (el && el.textContent === t(win, 'code_dock_saved')) {
            el.textContent = '';
          }
        }, 1800);
      }

      refreshPreview(win);
      win.document
        .getElementById('__sve-section-picker')
        ?.dispatchEvent(new win.CustomEvent('sve-library-stale'));
    })
    .catch(() => {
      setStatus(win.document, t(win, 'code_dock_error'));
    })
    .finally(() => {
      dock.saveInFlight = null;
    });

  return dock.saveInFlight;
}

export function flushSave(doc) {
  if (dock.saveTimer) {
    clearTimeout(dock.saveTimer);
    dock.saveTimer = null;
  }

  const type = dock.lastType;
  const win = dock.lastWin;
  const view = editors.html;

  if (!view || view.state.readOnly || !type || !win) {
    return;
  }

  const parts = readParts();
  const twReady = dock.twCss !== null && tailwindDockOn(win) && twKeyFor(parts.html) === dock.twKey;

  // A finished compile is worth a save of its own, even when not a character
  // of the file has changed since the last one.
  // A changed declaration is worth a save of its own: the panel edits a list
  // the panes know nothing about, so not a character of them need have moved.
  if (sameParts(parts, dock.lastParts) && !(twReady && dock.twDirty) && !dock.propsDirty) {
    return;
  }

  dock.propsDirty = false;

  if (twReady) {
    parts.tw = dock.twCss;
    dock.twDirty = false;
  }

  setStatus(doc, t(win, 'code_dock_saving'));
  postSave(win, type, parts);
}

/** The classes in the file, in a stable order — the compile's cache key. */
function twKeyFor(html) {
  return twCandidates(html).sort().join(' ');
}

export function resetTailwindCompile() {
  dock.twCss = null;
  dock.twKey = '';
  dock.twDirty = false;
}

/**
 * Compile this file's classes with Tailwind's own engine.
 *
 * Off the save path: the engine is a lazy chunk and the first load takes a
 * moment, so the save goes ahead without it and the finished compile asks for
 * one more save. Nothing recompiles while the class list is unchanged, which
 * is most keystrokes.
 */
export function ensureTwCss(win, html) {
  if (!win || !tailwindDockOn(win)) {
    return;
  }

  const key = twKeyFor(html);

  if (key === dock.twKey || dock.twBusy) {
    return;
  }

  dock.twBusy = true;

  void import('../tw-compile.js')
    .then((mod) => mod.compileTailwind(win, html))
    .then((css) => {
      dock.twBusy = false;
      dock.twCss = css;
      dock.twKey = key;
      dock.twDirty = true;
      scheduleSave(win, win.document);
    })
    .catch((err) => {
      dock.twBusy = false;
      console.error('[sve] tailwind compile', err);
    });
}

function scheduleSave(win, doc) {
  if (dock.saveTimer) {
    clearTimeout(dock.saveTimer);
  }

  dock.saveTimer = win.setTimeout(() => {
    dock.saveTimer = null;
    flushSave(doc);
  }, SAVE_MS);
}

export function onEditorInput(win) {
  if (dock.applying) {
    return;
  }

  const parts = readParts();

  if (sameParts(parts, dock.lastParts)) {
    paintAutosave(win);
    return;
  }

  paintAutosave(win);
  ensureTwCss(win, parts.html);

  if (!autosaveEnabled(win)) {
    setStatus(win.document, t(win, 'code_dock_unsaved'));

    return;
  }

  setStatus(win.document, t(win, 'code_dock_saving'));
  scheduleSave(win, win.document);
}
