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
import { dockState } from '../dock/state.js';
import { paintHtmlScope, paintLock } from './scope.js';
import { readParts, sameParts, writeParts } from './css-tools.js';
import { setStatus } from './layout.js';
import { autosaveEnabled, paintAutosave } from './lock-autosave.js';
import { DOCK_ID, SAVE_MS, css, editors, html } from '../code-dock.js';

// ===== save =====
export function refreshPreview(win) {
  if (!dockState.lastUid || !dockState.lastType || String(dockState.lastType).startsWith('view:')) {
    replayLivePreview(win);

    return;
  }

  const sectionUids = topLevelSectionIds(dockState.lastUid, win.document);

  replayLivePreview(win, sectionUids.length ? { sectionUids } : undefined);
}

function postSave(win, type, parts) {
  dockState.saveInFlight = win
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
        ...(componentPropsOn(win) ? { props: dockState.lastProps } : {}),
      }),
    })
    .then(async (res) => {
      if (res.status === 423) {
        dockState.lastLocked = true;
        dockState.lockReady = true;
        paintLock(win);
        writeParts(dockState.lastParts, true);
        paintHtmlScope(win);
        setStatus(win.document, t(win, 'code_dock_locked'));

        return;
      }

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        // The server says why when it can: a file its PHP is not allowed to write.
        throw new Error(data?.error === 'not_writable' ? 'not_writable' : String(res.status));
      }

      if (dockState.lastType === type) {
        dockState.lastParts = parts;

        // The template is on disk but its Tailwind CSS is not: the classes
        // would be missing on the site. Keep the compile dirty so the next
        // save tries again, and say so instead of "Saved".
        if (data?.tw_written === false) {
          dockState.twDirty = true;
          setStatus(win.document, t(win, 'code_dock_tw_not_writable'));
          paintAutosave(win);
          refreshPreview(win);

          return;
        }

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
    .catch((err) => {
      setStatus(win.document, t(win, err?.message === 'not_writable' ? 'code_dock_not_writable' : 'code_dock_error'));
    })
    .finally(() => {
      dockState.saveInFlight = null;
    });

  return dockState.saveInFlight;
}

export function flushSave(doc) {
  if (dockState.saveTimer) {
    clearTimeout(dockState.saveTimer);
    dockState.saveTimer = null;
  }

  const type = dockState.lastType;
  const win = dockState.lastWin;
  const view = editors.html;

  if (!view || view.state.readOnly || !type || !win) {
    return;
  }

  const parts = readParts();
  const twReady = dockState.twCss !== null && tailwindDockOn(win) && twKeyFor(parts.html) === dockState.twKey;

  // A finished compile is worth a save of its own, even when not a character
  // of the file has changed since the last one.
  // A changed declaration is worth a save of its own: the panel edits a list
  // the panes know nothing about, so not a character of them need have moved.
  if (sameParts(parts, dockState.lastParts) && !(twReady && dockState.twDirty) && !dockState.propsDirty) {
    return;
  }

  dockState.propsDirty = false;

  if (twReady) {
    parts.tw = dockState.twCss;
    dockState.twDirty = false;
  }

  setStatus(doc, t(win, 'code_dock_saving'));
  postSave(win, type, parts);
}

/** The classes in the file, in a stable order — the compile's cache key. */
function twKeyFor(html) {
  return twCandidates(html).sort().join(' ');
}

export function resetTailwindCompile() {
  dockState.twCss = null;
  dockState.twKey = '';
  dockState.twDirty = false;
}

/**
 * The file's baked utilities, as the server has them: the compile is "done"
 * for this class list and nothing is dirty. Opening a file then costs no
 * compile and no save; the next real class change starts one.
 */
export function primeTailwindCompile(html, css) {
  dockState.twCss = css;
  dockState.twKey = twKeyFor(html);
  dockState.twDirty = false;
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

  if (key === dockState.twKey || dockState.twBusy) {
    return;
  }

  dockState.twBusy = true;

  void import('../tw-compile.js')
    .then((mod) => mod.compileTailwind(win, html))
    .then((css) => {
      dockState.twBusy = false;
      dockState.twCss = css;
      dockState.twKey = key;
      dockState.twDirty = true;
      scheduleSave(win, win.document);
    })
    .catch((err) => {
      dockState.twBusy = false;
      console.error('[sve] tailwind compile', err);
    });
}

function scheduleSave(win, doc) {
  if (dockState.saveTimer) {
    clearTimeout(dockState.saveTimer);
  }

  dockState.saveTimer = win.setTimeout(() => {
    dockState.saveTimer = null;
    flushSave(doc);
  }, SAVE_MS);
}

export function onEditorInput(win) {
  if (dockState.applying) {
    return;
  }

  const parts = readParts();

  if (sameParts(parts, dockState.lastParts)) {
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
