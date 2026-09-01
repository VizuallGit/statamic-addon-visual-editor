/**
 * Settings toggle: `sections`
 * Synced / global section editor.
 * Imports leftover helpers from cp.js. Does not get imported by cp.js.
 */
import { sve } from './cp-registry.js';
import { t } from './cp-t.js';
import { sveState } from './cp-state.js';
import { GLOBALS_PANEL_PARAM, SELECTORS } from './cp-selectors.js';
import {
  LP_SAVE_TIMEOUT,
  autoPickSet,
  findSetByUid,
  openSetPickerOverPreview,
  openSettingsTab,
  rearmFirstSection,
} from './cp.js';
import { syncCodeDock } from './code-dock.js';

// ===== global-section-panel =====
// --- Global section panel -------------------------------------------------------
//
// A synced section's content lives in another entry, so the page's form has
// nothing to edit — only a reference. This opens that entry's own editor in the
// left Live Preview panel and stashes what's being typed, so the page around it
// re-renders live: editing in context, without the section ever needing a URL of
// its own.

/**
 * Where the synced entry's form is built — the one switch between the two ways
 * of editing a global section.
 *
 * true (default) — in THIS window. Statamic renders the entry screen from a
 *   single component, `EntryPublishForm`, and registers it on the CP's Vue app,
 *   so the same form can be mounted straight into the Live Preview field column
 *   from the props the CP would have handed it. Its sets then sit in the very
 *   document the preview talks to, which is the whole point: `findSetByUid`
 *   finds them, Statamic's own Add Set picker opens over the "+" in the preview,
 *   the sidebar shows the section like any other, and Save is the entry form's
 *   own Save. A global section runs on the page's code, not a copy of it.
 *
 * false — the older way: the same form in an iframe covering the left panel,
 *   reached only over postMessage. Every piece of that route is still here
 *   (openGlobalSectionPanel, forwardGlobalSectionFocus, the sve-section-* message
 *   handlers, openSetPickerOverPreview, autoPickSet), so flipping this back
 *   restores it whole.
 */
export const GLOBAL_SECTION_INLINE = true;

/**
 * The same question asked of the site's header and footer — one switch, same
 * shape as the one above.
 *
 * true (default) — Theme Settings' own publish form is mounted in the Live
 *   Preview field column, isolated to the Header (or Footer) tab. Its widgets are
 *   then sets in this document like any section's blocks: clicking one opens it
 *   in the panel, inline edit writes to a real publish container, and Save is the
 *   globals form's own Save.
 *
 * false — the docked Theme Settings iframe, driven over postMessage. That whole
 *   route is still here (sve.openGlobalsPanel, sve.lockChromeGlobalsTab, the sve-lock-tab
 *   and sve-chrome-set-style messages), and it is also what the in-window route
 *   falls back to when the globals page cannot be mounted — so flipping this back
 *   restores it whole.
 *
 * Goes on together with CHROME_LOCKS_PAGE in bridge.js: the page lock is part of
 * editing the header in the left panel, and one without the other is half a
 * behaviour.
 */
export const CHROME_INLINE = true;

export const GLOBAL_SECTION_PANEL_ID = '__sve-global-section-panel';

/** The div the synced entry's form is mounted into, in this document. */
export const GLOBAL_SECTION_HOST_ID = '__sve-global-section-host';

/** Publish-container name for that form — never "base", which is the page's. */
export const GLOBAL_SECTION_CONTAINER = 'sve-global-section';

/** Marks the page's own fields while the field column belongs to a global section. */
export const GLOBAL_SECTION_AWAY_ATTR = 'data-sve-global-away';

// The panel's latest values, as it streams them up: { id, values }. This is what
// lets a global section be edited inline like any other — see sve.activeContainers.

/** First hydrate of the panel form — not a real edit. Same idea as chrome baseline. */

/** True while the form holds exactly what it was opened with — nothing to save. */

/** True after we've pushed unsaved global-section values into the preview stash. */
export let sectionsStashActive = false;

/** Edit-request that arrived before the panel streamed values — retry once ready. */

/** Preview click/focus that arrived before the panel iframe could receive it. */

/**
 * How long after a save the next values still count as the save's own echo.
 *
 * Statamic replaces the form's values with what the server sent back, and that
 * lands a beat after the request resolves — so the first thing read after a save
 * is the saved entry, not an edit of it. Without this window the bar goes back to
 * "unsaved changes" a quarter of a second after saving, and the section is stashed
 * over a page that already has it.
 */

export function globalSectionPanelFrame(win) {
  return win.document.getElementById(GLOBAL_SECTION_PANEL_ID)?.querySelector('iframe') || null;
}

/**
 * Forward a preview click into the synced-section iframe. Returns true when the
 * click was handled (or queued) as a global-section focus — caller must not run
 * the page-form path.
 *
 * Only clicks *inside* a focused global section are forwarded. A click on a
 * normal page section while the panel is still open must hit the page form —
 * otherwise the sidebar shows an empty Headline header from the wrong document
 * while inline edit (correctly) updates the page.
 */
export function forwardGlobalSectionFocus(data, doc, win) {
  // No panel means the form is in this window, and there is nowhere to forward
  // to: the section's fields are in this document, so the click takes the same
  // path a page section's does.
  const panel = doc.getElementById(GLOBAL_SECTION_PANEL_ID);

  if (!panel || !(data.field || data.uid) || !data.global) {
    return false;
  }

  const frame = panel.querySelector('iframe');

  if (frame?.contentWindow) {
    sveState.pendingFocusUntilPanel = null;
    frame.contentWindow.postMessage(
      {
        source: 'statamic-visual-editor',
        type: 'sve-section-focus',
        uid: data.scope || data.uid,
        field: data.field || null,
      },
      win.location.origin
    );

    return true;
  }

  // Panel shell is up but the entry form has not mounted yet — hold the click.
  sveState.pendingFocusUntilPanel = { field: data.field || null, uid: data.scope || data.uid || null };

  return true;
}

export function flushPendingFocusUntilPanel(win) {
  if (!sveState.pendingFocusUntilPanel) {
    return;
  }

  const frame = globalSectionPanelFrame(win);

  if (!frame?.contentWindow) {
    return;
  }

  const { field, uid } = sveState.pendingFocusUntilPanel;

  sveState.pendingFocusUntilPanel = null;
  frame.contentWindow.postMessage(
    {
      source: 'statamic-visual-editor',
      type: 'sve-section-focus',
      uid,
      field,
    },
    win.location.origin
  );
}

/**
 * Synced section panel lives in its own iframe — entry $dirty never sees it.
 * Stash activity is the other signal (same idea as Theme Settings).
 */
export function hasUnsavedGlobalSection(win) {
  // A stash is only how the page is kept showing what the form holds, so its
  // existence is not the question — whether what it holds differs from what was
  // opened is. Undoing an edit by hand leaves the stash in place and the section
  // with nothing to save.
  if (sectionsStashActive && !sveState.sectionValuesMatchBaseline) {
    return true;
  }

  // Edited in this window there is no second $dirty to ask — the form shares the
  // page's, and the baseline compare above is the whole answer.
  const iwin = globalSectionPanelFrame(win)?.contentWindow;

  if (!iwin) {
    return false;
  }

  try {
    const dirty = iwin.Statamic?.$dirty;

    if (typeof dirty?.has !== 'function') {
      return false;
    }

    const raw = typeof dirty.names === 'function' ? dirty.names() : dirty.names;
    const list = sve.unwrapRef(raw);

    if (Array.isArray(list) && list.length) {
      return list.some((name) => dirty.has(name));
    }

    return dirty.has('base');
  } catch {
    return false;
  }
}

/**
 * The open panel, dressed up as a publish container.
 *
 * Reads resolve against the copy of its values it streams us; writes are posted
 * into the panel, where the real container applies them — and its next poll
 * streams the change back, stashes it, and re-renders the page. So an inline edit
 * on a global section takes the same path as one on the page's own fields, and
 * nothing downstream needs to know the difference.
 */
export function sectionPanelContainer(doc) {
  // Only ever a stand-in for a panel. Edited in this window the form registers a
  // real publish container of its own (see sve.registerContainerEvents), and the
  // lookup below finds no panel and returns null — as it should.
  const panel = doc.getElementById(GLOBAL_SECTION_PANEL_ID);
  const frame = panel?.querySelector('iframe');

  if (!panel || !frame?.contentWindow || !sveState.sectionPanelValues?.values) {
    return null;
  }

  const win = doc.defaultView;

  return {
    name: 'sve-global-section',
    values: sveState.sectionPanelValues.values,
    setFieldValue: (path, value) => {
      frame.contentWindow.postMessage(
        { source: 'statamic-visual-editor', type: 'sve-section-set-value', path, value },
        win.location.origin
      );
    },
  };
}

/** Tells the preview to re-render asking for (or forgetting) the stashed section. */
export function refreshSections(win, active) {
  const frame = sve.previewFrame(win.document);

  if (!frame?.contentWindow || !sve.lastPreviewUrl) {
    return;
  }

  frame.contentWindow.postMessage({ name: 'sve.sections', active, url: sve.lastPreviewUrl }, win.location.origin);
}

/** A stash landed while someone was typing — the page owes itself a re-render. */
export let sectionRefreshPending = false;

/**
 * Re-render the page from the stash, unless someone is typing into it.
 *
 * The panel streams its values four times a second, and every one of them used
 * to force the preview to re-render. That is harmless while the panel is what
 * you are typing in, and destructive while the page is: an inline edit puts the
 * caret inside the very element this replaces, so the node goes, the selection
 * goes with it, and what was half-typed lands nowhere. It reads as flicker, as
 * spaces going missing around a styled span, and then as editing simply
 * stopping — and only sometimes, because it is a race against one's own typing.
 *
 * Nothing is lost by waiting. During an inline edit the page is already showing
 * the text as it is typed — that is what inline editing is — so the render being
 * withheld is the one it is already displaying. The debt is settled on the way
 * out of the edit.
 */
export function refreshSectionsUnlessEditing(win) {
  if (sve.editSession) {
    sectionRefreshPending = true;

    return;
  }

  sectionRefreshPending = false;
  refreshSections(win, true);
}

/** An inline edit has ended — pay off a render that was deferred during it. */
export function flushPendingSectionRefresh(win) {
  if (!sectionRefreshPending) {
    return;
  }

  sectionRefreshPending = false;
  refreshSections(win, true);
}

export function postSectionValues(win, id, values) {
  sectionsStashActive = true;
  sve.notifyGlobalSectionDirty(win);
  win
    .fetch('/!/sve/global-section-stash', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': sve.csrfToken(win),
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: JSON.stringify({ id, values }),
    })
    .then(() => refreshSectionsUnlessEditing(win))
    .catch(() => {});
}

export function clearSectionsStash(win, { refresh = true } = {}) {
  if (!sectionsStashActive) {
    sve.notifyGlobalSectionDirty(win);

    return Promise.resolve();
  }

  sectionsStashActive = false;

  return win
    .fetch('/!/sve/global-section-stash/clear', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'X-CSRF-TOKEN': sve.csrfToken(win), 'X-Requested-With': 'XMLHttpRequest' },
    })
    .catch(() => {})
    .then(() => {
      sve.notifyGlobalSectionDirty(win);

      if (refresh) {
        refreshSections(win, false);
      }
    });
}

/** Listeners for global-section panel save results. */
export const sectionSaveListeners = [];

export function onSectionSave(callback) {
  sectionSaveListeners.push(callback);

  return () => {
    const index = sectionSaveListeners.indexOf(callback);

    if (index !== -1) {
      sectionSaveListeners.splice(index, 1);
    }
  };
}

export function saveGlobalSectionPanel(win, done) {
  if (!hasUnsavedGlobalSection(win)) {
    done(true);

    return;
  }

  const host = globalSectionHost(win.document);
  const iwin = globalSectionPanelFrame(win)?.contentWindow;

  // Nothing open to save into: whatever the stash still holds is not backed by a
  // form any more, so it goes.
  if (!host && !iwin) {
    clearSectionsStash(win, { refresh: false }).finally(() => done(true));

    return;
  }

  let settled = false;

  const finish = (ok) => {
    if (settled) {
      return;
    }

    settled = true;
    stop();
    clearTimeout(timer);
    done(ok);
  };

  const stop = onSectionSave(finish);
  const timer = win.setTimeout(() => finish(false), LP_SAVE_TIMEOUT);

  if (host) {
    pressGlobalSectionSave(win);

    return;
  }

  iwin.postMessage(
    { source: 'statamic-visual-editor', type: 'sve-globals-save' },
    win.location.origin
  );
}

/**
 * Announce the result of a synced-section save.
 *
 * `frame` is the window holding the form when that is somewhere else; edited in
 * this window there is none, and the baseline it would be asked to move is the
 * one right here.
 */
export function announceSectionSave(parentWin, ok, frame = null) {
  if (ok) {
    sectionsStashActive = true;
    // Saved = new clean baseline (don't treat the next poll as a fresh edit).
    if (sveState.sectionPanelValues?.values) {
      sveState.sectionValuesBaseline = JSON.stringify(sveState.sectionPanelValues.values);
    }
    sveState.sectionValuesMatchBaseline = true;
    sveState.sectionBaselineUntil = Date.now() + 2000;
    clearSectionsStash(parentWin, { refresh: false });

    // The panel form keeps its own "what was it when we last agreed" copy —
    // without this it re-reports the very next poll as an edit and the bar
    // goes back to "unsaved changes" a quarter of a second after saving.
    if (frame) {
      try {
        frame.postMessage(
          { source: 'statamic-visual-editor', type: 'sve-globals-saved' },
          parentWin.location.origin
        );
      } catch {
        /* panel closed while saving */
      }
    }
  }

  [...sectionSaveListeners].forEach((listener) => listener(ok));
}

/**
 * Watch a window for the entry save the synced section's form sends.
 *
 * `entryPath` is a function rather than a string because the window being
 * watched can be this one: the CP is not reloaded between global sections, so
 * which entry counts as "the save" changes while the same patched fetch stays in
 * place.
 */
export function watchGlobalSectionPanelSaves(iwin, parentWin, entryPath = null) {
  if (!iwin || !parentWin || iwin.__sveSectionSaveWatch) {
    return;
  }

  iwin.__sveSectionSaveWatch = true;

  const savePath = entryPath ?? (() => iwin.location.pathname);
  const frame = iwin === parentWin ? null : iwin;

  const isSave = (url, method) => {
    if (!url || !/^(POST|PUT|PATCH)$/i.test(method || 'GET')) {
      return false;
    }

    const base = savePath();

    if (!base) {
      return false;
    }

    let path;

    try {
      path = new URL(url, iwin.location.origin).pathname;
    } catch {
      return false;
    }

    return path.startsWith(base) && !path.includes('/preview');
  };

  const announce = (ok) => announceSectionSave(parentWin, ok, frame);

  const { fetch: originalFetch } = iwin;

  iwin.fetch = function (input, init = {}) {
    const url = typeof input === 'string' ? input : input?.url;
    const method = init.method ?? (typeof input === 'object' ? input?.method : null);

    if (!isSave(url, method)) {
      return originalFetch.call(this, input, init);
    }

    return originalFetch.call(this, input, init).then(
      (response) => {
        announce(response.ok);

        return response;
      },
      (error) => {
        announce(false);

        throw error;
      }
    );
  };

  // The entry update is a PATCH sent by axios, i.e. XMLHttpRequest — it never
  // goes through fetch at all. Watching only fetch is why saving a synced
  // section left the bar reading "unsaved changes" for the rest of the session:
  // the save happened, nothing ever heard about it, and the baseline that says
  // what "saved" looks like was never moved.
  const { open: originalOpen, send: originalSend } = iwin.XMLHttpRequest.prototype;

  iwin.XMLHttpRequest.prototype.open = function (method, url, ...rest) {
    this.__sveSectionMethod = method;
    this.__sveSectionUrl = url;

    return originalOpen.call(this, method, url, ...rest);
  };

  iwin.XMLHttpRequest.prototype.send = function (...args) {
    if (isSave(this.__sveSectionUrl, this.__sveSectionMethod)) {
      this.addEventListener('load', () => {
        announce(this.status >= 200 && this.status < 300);
      });
      this.addEventListener('error', () => announce(false));
    }

    return originalSend.apply(this, args);
  };
}

export function ensureGlobalSectionPanelSaveWatch(win) {
  const frame = globalSectionPanelFrame(win);

  if (!frame) {
    return;
  }

  const arm = () => {
    try {
      if (frame.contentWindow) {
        watchGlobalSectionPanelSaves(frame.contentWindow, win);
      }
    } catch {
      /* iframe not ready */
    }
  };

  arm();
  frame.addEventListener('load', arm);
}

// How long the section panel may stay hidden waiting for its form to rebuild.
// Long enough for a slow boot, short enough that a silent failure is a pause
// rather than an empty panel.
export const SECTION_PANEL_REVEAL_MS = 2500;

/**
 * Show the section panel's frame. Called both by the ready handshake and by a
 * fallback timer, so it has to be safe to run twice — setting an opacity that
 * is already 1 costs nothing.
 */
export function revealSectionPanelFrame(win) {
  const frame = win.document.getElementById(GLOBAL_SECTION_PANEL_ID)?.querySelector('iframe');

  if (frame) {
    frame.style.opacity = '1';
  }
}

export function closeGlobalSectionPanel(win) {
  // Whichever one is open. Only one ever is.
  if (closeGlobalSectionInline(win)) {
    return;
  }

  const panel = win.document.getElementById(GLOBAL_SECTION_PANEL_ID);

  if (!panel) {
    return;
  }

  panel.remove();
  sveState.sectionPanelValues = null;
  sveState.sectionValuesBaseline = null;
  sveState.sectionValuesMatchBaseline = true;
  sveState.pendingEditUntilPanel = null;
  sveState.pendingFocusUntilPanel = null;
  // Left editor was covered — restore normal section editing surface.
  const editor = win.document.querySelector('.live-preview-editor');

  if (editor) {
    editor.querySelectorAll('[data-sve-global-cover]').forEach((el) => el.remove());
  }

  sve.syncPreviewInset(win);

  clearSectionsStash(win, { refresh: true });
  sve.syncSectionLibraryAvailability(win);
}

/**
 * Mount the synced section's publish form in the LEFT Live Preview editor —
 * same slot a normal section uses. Keeps an iframe so values can stream for
 * inline edit; does NOT open a right-hand drawer.
 */
export function openGlobalSectionPanel(win, id) {
  if (GLOBAL_SECTION_INLINE) {
    openGlobalSectionInline(win, id);

    return;
  }

  openGlobalSectionPanelFrame(win, id);
}

/**
 * The docked-panel route: the same form, in an iframe covering the left editor,
 * reached only over postMessage. Kept whole — GLOBAL_SECTION_INLINE picks
 * between this and the in-window form, and this is also where the in-window one
 * falls back to when there is no Live Preview editor to mount into.
 */
export function openGlobalSectionPanelFrame(win, id) {
  const doc = win.document;
  const existing = doc.getElementById(GLOBAL_SECTION_PANEL_ID);

  // Already showing this section — leave it be. Rebuilding would reload the form
  // and throw away whatever is half-typed in it.
  if (existing?.dataset.sveSectionId === id) {
    sve.setLpMode(win, 'show');

    return;
  }

  // Close other right drawers; keep left editor free for this form.
  sve.closeRightPanels(win, []);

  sveState.sectionValuesBaseline = null;
  sveState.sectionValuesMatchBaseline = true;
  sveState.pendingEditUntilPanel = null;
  sveState.pendingFocusUntilPanel = null;

  sve.setLpMode(win, 'show');

  const editor = doc.querySelector('.live-preview-editor');
  const collection = encodeURIComponent(sve.savedSectionsCollection(win));
  const url = new URL(`/cp/collections/${collection}/entries/${encodeURIComponent(id)}`, win.location.origin);

  url.searchParams.set(GLOBALS_PANEL_PARAM, '1');

  const panel = doc.createElement('div');

  panel.id = GLOBAL_SECTION_PANEL_ID;
  panel.dataset.sveSectionId = id;
  panel.setAttribute('data-sve-global-cover', '');
  panel.style.cssText =
    'position:absolute;inset:0;z-index:50;display:flex;flex-direction:column;' +
    'background:var(--theme-color-content-bg,#fff);';

  // Docked in Live Preview the preview draws its own bar over the page — the one
  // naming the section, saying whether it has unsaved work, and holding Save and
  // Close. A second Save above the panel is the same button twice, and the strip
  // it sits in is a band of nothing between the top of the panel and the section
  // it is showing. Off the Live Preview screen there is no such bar, so the
  // fallback keeps it: that is the only way to save from there.
  const bar = editor ? null : doc.createElement('div');

  if (bar) {
    bar.style.cssText =
      'display:flex;align-items:center;justify-content:flex-end;gap:8px;padding:6px 10px;' +
      'border-bottom:1px solid rgba(128,128,128,.24);flex:0 0 auto;';

    const save = doc.createElement('button');

    save.type = 'button';
    save.textContent = t(win, 'save');
    save.title = t(win, 'save_global_section');
    save.style.cssText =
      'all:unset;cursor:pointer;padding:5px 12px;border-radius:6px;background:var(--theme-color-primary,#4f46e5);' +
      'color:#fff;font-size:12px;font-weight:600;line-height:1;';
    save.addEventListener('click', () => {
      doc
        .getElementById(GLOBAL_SECTION_PANEL_ID)
        ?.querySelector('iframe')
        ?.contentWindow?.postMessage({ source: 'statamic-visual-editor', type: 'sve-globals-save' }, win.location.origin);
    });
    bar.appendChild(save);
  }

  const frame = doc.createElement('iframe');

  frame.src = url.toString();
  frame.title = t(win, 'global_panel_title');
  // The form arrives as the CP's raw publish view and is rebuilt in place —
  // tabs become a segmented control, blocks become cards. Watching that rebuild
  // is the flicker, so the frame stays invisible until the panel reports ready.
  // The timer is the safety net: a boot that never reports still reveals
  // itself, so a failure can never leave a permanently blank panel.
  frame.style.cssText =
    'flex:1 1 auto;width:100%;border:0;background:transparent;' +
    'opacity:0;transition:opacity .12s ease;';
  frame.addEventListener('load', () => flushPendingFocusUntilPanel(win));
  win.setTimeout(() => revealSectionPanelFrame(win), SECTION_PANEL_REVEAL_MS);

  if (bar) {
    panel.appendChild(bar);
  }

  panel.appendChild(frame);

  if (editor) {
    const cs = win.getComputedStyle(editor);

    if (cs.position === 'static') {
      editor.style.position = 'relative';
    }

    editor.appendChild(panel);
  } else {
    // Fallback if LP editor isn't mounted yet — left-docked fixed panel.
    const top = sve.dockedPanelTop(win);

    panel.style.cssText =
      `position:fixed;top:${top}px;left:0;bottom:0;width:${sve.lpStoredWidth(win)}px;z-index:40;` +
      'display:flex;flex-direction:column;background:var(--theme-color-content-bg,#fff);' +
      'border-right:1px solid rgba(128,128,128,.28);box-shadow:8px 0 24px rgba(0,0,0,.12);';
    doc.body.appendChild(panel);
  }

  ensureGlobalSectionPanelSaveWatch(win);
  sve.notifyGlobalSectionDirty(win);
}


// ===== global-section-inline =====
// --- Global section, edited in this window ---------------------------------------
//
// Everything below builds the synced entry's form where the page's own form
// already is: inside the Live Preview field column. That is the whole difference.
// Once its sets are in this document, a global section is not a special case any
// more — the "+" opens Statamic's picker over the preview, the sidebar solos the
// section, the arrows move it, and inline edit writes to a real publish container.
// Nothing here re-implements any of that; it only puts the fields within reach of
// the code that already does it.

/** The mounted form: its Vue app, the entry it shows, and how to save it. */
export let globalSectionApp = null;
export let globalSectionEntryPath = null;
export let globalSectionValuesTimer = null;
export let globalSectionValuesSeen = null;

export function globalSectionHost(doc) {
  return doc.getElementById(GLOBAL_SECTION_HOST_ID);
}

/** True while a global section owns the editor, whichever way it was opened. */
export function globalSectionEditorOpen(doc) {
  return !!(doc.getElementById(GLOBAL_SECTION_PANEL_ID) || globalSectionHost(doc));
}

/** The synced entry's own publish container, once its form has mounted. */
export function globalSectionContainer() {
  return sve.publishContainers.find((container) => container.name === GLOBAL_SECTION_CONTAINER) || null;
}

/**
 * Ask the Control Panel for a screen the way the Control Panel asks itself.
 *
 * Inertia answers an edit route with exactly the props its page component
 * expects — blueprint, values, meta, localizations and all — so a form can be
 * built here from the same answer, and none of it has to be kept in step by hand
 * with what Statamic's forms want next.
 */
export async function fetchInertiaPage(win, path) {
  const version = win.Statamic?.$app?.config?.globalProperties?.$page?.version || '';

  const response = await win.fetch(path, {
    credentials: 'same-origin',
    headers: {
      'X-Inertia': 'true',
      'X-Inertia-Version': version,
      'X-Requested-With': 'XMLHttpRequest',
      Accept: 'text/html, application/xhtml+xml',
    },
  });

  if (!response.ok) {
    return null;
  }

  const page = await response.json();

  return page?.props ? { component: page.component, props: page.props, path } : null;
}

/** The synced entry's screen, as Inertia would have delivered it. */
export function fetchGlobalSectionProps(win, id) {
  const collection = encodeURIComponent(sve.savedSectionsCollection(win));

  return fetchInertiaPage(win, `/cp/collections/${collection}/entries/${encodeURIComponent(id)}`);
}

/** Inertia props → the prop names EntryPublishForm declares. */
export function globalSectionFormProps(props) {
  return {
    publishContainer: GLOBAL_SECTION_CONTAINER,
    method: 'patch',
    // Statamic's own word for "this form is not the screen you are on". Without
    // it a save obeys the after-save preference, which defaults to `listing` —
    // so saving a global section navigated the whole Control Panel to the Global
    // sections index and took Live Preview, the page and the preview with it.
    // It also drops the after-save dropdown and the remembered tab, both of which
    // belong to a form that owns its page.
    isInline: true,
    collectionHandle: props.collection,
    initialActions: props.actions,
    initialTitle: props.title,
    initialReference: props.reference,
    initialFieldset: props.blueprint,
    initialValues: props.values,
    initialExtraValues: props.extraValues,
    initialLocalizedFields: props.localizedFields,
    initialMeta: props.meta,
    initialPermalink: props.permalink,
    originBehavior: props.originBehavior,
    initialLocalizations: props.localizations,
    initialHasOrigin: props.hasOrigin,
    initialOriginValues: props.originValues,
    initialOriginMeta: props.originMeta,
    initialSite: props.locale,
    initialIsWorkingCopy: props.hasWorkingCopy,
    revisionsEnabled: props.revisionsEnabled,
    initialReadOnly: props.readOnly,
    canEditBlueprint: props.canEditBlueprint,
    canManagePublishState: props.canManagePublishState,
    createAnotherUrl: props.createAnotherUrl,
    initialListingUrl: props.initialListingUrl,
    previewTargets: props.previewTargets,
    autosaveInterval: props.autosaveInterval,
    initialItemActions: props.itemActions,
    itemActionUrl: props.itemActionUrl,
  };
}

/**
 * Mount a Statamic form into a host of ours, in this window.
 *
 * A second Vue app rather than a node in the CP's own tree, because there is no
 * seam in the entry screen to hang one off. It borrows the CP app's registry so
 * every fieldtype, directive and injected service resolves exactly as it does on
 * the real screen — the form cannot tell the difference, which is the only way
 * this stays true as Statamic changes.
 */
export function mountBorrowedForm(win, host, renderRoot, label) {
  const Vue = win.Vue;
  const app = win.Statamic?.$app;

  if (!Vue?.createApp || !app) {
    return null;
  }

  try {
    const sub = Vue.createApp(Vue.defineComponent({ setup: () => renderRoot(Vue) }));

    Object.assign(sub._context.components, app._context.components);
    Object.assign(sub._context.directives, app._context.directives);
    Object.assign(sub._context.provides, app._context.provides);
    Object.assign(sub.config.globalProperties, app.config.globalProperties);

    sub.mount(host);

    return sub;
  } catch (err) {
    console.error(`[sve] ${label}`, err);

    return null;
  }
}

export function mountGlobalSectionForm(win, host, props) {
  globalSectionApp = mountBorrowedForm(
    win,
    host,
    (Vue) => {
      // Resolved here, not by name in h(): a string type is an ELEMENT to Vue's
      // runtime, so h('EntryPublishForm') renders a literal <entrypublishform>
      // tag and nothing inside it ever mounts.
      const Form = Vue.resolveComponent('EntryPublishForm');

      return () => Vue.h(Form, globalSectionFormProps(props));
    },
    'global section form'
  );

  return !!globalSectionApp;
}

/**
 * Hide the page's own fields while the column belongs to a global section.
 *
 * The solo view does this too, once it has a set to isolate — but the form takes
 * a moment to mount, and without this the page's fields sit under the section's
 * for that moment. Marked rather than detached: the page's form keeps its state,
 * and stepping back out is one attribute removal away.
 */
export function hidePageFieldsForGlobalSection(host) {
  const column = host.parentElement;

  if (!column) {
    return;
  }

  host.dataset.sveReady = '1';

  [...column.children].forEach((child) => {
    if (child === host) {
      return;
    }

    // The focus header names what the column is showing. It is not a page field —
    // same skip as markPanelIsolate. Hiding it left Header/Footer (and a synced
    // section) without the icon+title every ordinary section has.
    if (child.id === sve.FOCUS_HEADER_ID || child.hasAttribute('data-sve-focus-header')) {
      child.removeAttribute(GLOBAL_SECTION_AWAY_ATTR);

      return;
    }

    child.setAttribute(GLOBAL_SECTION_AWAY_ATTR, '');
  });

  const win = host.ownerDocument.defaultView;

  sve.hideSettingsBar?.(win);
}

export function showPageFieldsAgain(doc) {
  doc.querySelectorAll(`[${GLOBAL_SECTION_AWAY_ATTR}]`).forEach((el) =>
    el.removeAttribute(GLOBAL_SECTION_AWAY_ATTR)
  );

  sve.placeLpWidthPicker?.(doc.defaultView);
}

/**
 * Open the synced entry's form in the left Live Preview editor, in this window.
 */
export async function openGlobalSectionInline(win, id) {
  const doc = win.document;
  const existing = globalSectionHost(doc);

  // Already showing this section — leave it be. Rebuilding would reload the form
  // and throw away whatever is half-typed in it.
  if (existing?.dataset.sveSectionId === id) {
    sve.setLpMode(win, 'show');

    return;
  }

  closeGlobalSectionInline(win, { refresh: false });

  // Close other drawers; the field column is this section's now.
  sve.closeRightPanels(win, []);
  sve.setLpMode(win, 'show');

  const column = doc.querySelector('.live-preview-fields') || doc.querySelector('.live-preview-editor');

  if (!column) {
    // No Live Preview editor to mount into — fall back to the docked panel, which
    // builds its own surface and does not need one.
    openGlobalSectionPanelFrame(win, id);

    return;
  }

  const host = doc.createElement('div');

  host.id = GLOBAL_SECTION_HOST_ID;
  host.dataset.sveSectionId = id;
  // Invisible until soloed — page form stays up so the column is never empty.
  host.style.cssText = 'position:absolute;inset:0;opacity:0;overflow:auto;pointer-events:none;';
  if (win.getComputedStyle(column).position === 'static') {
    column.style.position = 'relative';
  }
  column.appendChild(host);

  const loaded = await fetchGlobalSectionProps(win, id).catch(() => null);

  // Closed (or moved on) while the props were in flight.
  if (globalSectionHost(doc) !== host) {
    return;
  }

  if (!loaded?.props || !mountGlobalSectionForm(win, host, loaded.props)) {
    closeGlobalSectionInline(win);

    return;
  }

  globalSectionEntryPath = new URL(loaded.path, win.location.origin).pathname;
  watchGlobalSectionInlineSaves(win);
  watchGlobalSectionInlineValues(win, id);
  bootGlobalSectionSolo(win, doc, host);
  sve.notifyGlobalSectionDirty(win);
  sve.syncSectionLibraryAvailability(win);
  win.setTimeout(() => syncCodeDock(win, doc, null), 200);
}

/** Solo the section the way a click on a page section would. */
export function bootGlobalSectionSolo(win, doc, host) {
  const field = sve.sectionField(win);
  let attempts = 0;

  const reveal = () => {
    if (globalSectionHost(doc) !== host) {
      return;
    }

    hidePageFieldsForGlobalSection(host);
    host.style.position = '';
    host.style.inset = '';
    host.style.overflow = '';
    host.style.pointerEvents = '';
    host.style.opacity = '1';
  };

  // Safety net: a boot that never settles still shows its form rather than
  // leaving a blank column behind.
  win.setTimeout(reveal, SECTION_PANEL_REVEAL_MS);

  const tryBoot = () => {
    if (globalSectionHost(doc) !== host) {
      return;
    }

    const container = globalSectionContainer();
    const values = container ? sve.unwrapRef(container.values) : null;
    const rows = values && typeof values === 'object' ? values[field] : null;

    if (Array.isArray(rows) && rows.length) {
      // Legacy synced entries stripped nested ids — assign them once so preview
      // scope="{{ id }}" and sve.focusFieldOwner can target the blocks inside.
      const next = JSON.parse(JSON.stringify(rows));

      if (sve.ensureNestedRowIds(next)) {
        container.setFieldValue(field, next);
        win.setTimeout(tryBoot, 150);

        return;
      }

      const uid = next[0]?._visual_id || next[0]?.id || next[0]?._id;

      if (uid && findSetByUid(uid, doc) && sve.soloSection(uid, doc, win, { kind: 'section' })) {
        reveal();

        return;
      }

      if (uid) {
        sve.expandTopLevelSectionSets(doc, field);
      }
    }

    if (attempts++ < 80) {
      win.setTimeout(tryBoot, 120);

      return;
    }

    reveal();
  };

  tryBoot();
}

/**
 * Read what the form holds, four times a second.
 *
 * Polled rather than watched for the same reason the docked panel polled: the
 * container's `values` is a Vue ref, and a JSON compare is both cheaper and far
 * more robust than reaching into Vue's reactivity from outside its own bundle.
 */
export function watchGlobalSectionInlineValues(win, id) {
  stopGlobalSectionInlineValues(win);
  globalSectionValuesSeen = null;

  globalSectionValuesTimer = win.setInterval(() => {
    const container = globalSectionContainer();
    const values = container ? sve.unwrapRef(container.values) : null;

    if (!values || typeof values !== 'object') {
      return;
    }

    const serialized = JSON.stringify(values);

    if (serialized === globalSectionValuesSeen) {
      return;
    }

    globalSectionValuesSeen = serialized;
    sve.applySectionValues(win, id, JSON.parse(serialized));
  }, 250);
}

export function stopGlobalSectionInlineValues(win) {
  if (globalSectionValuesTimer) {
    win.clearInterval(globalSectionValuesTimer);
    globalSectionValuesTimer = null;
  }
}

/**
 * The entry's own Save, pressed for it.
 *
 * The button is in the form's own header, which the solo view hides — hidden is
 * not disabled, so clicking it runs Statamic's real save: validation, revisions,
 * toast and all. An entry's button reads "Save & Publish" and a global set's
 * reads "Save", so the match is on the start of the label.
 */
export function pressGlobalSectionSave(win) {
  const host = globalSectionHost(win.document);

  if (!host) {
    return false;
  }

  const button = [...host.querySelectorAll('button')].find((el) =>
    /^(save|gem)\b/i.test((el.textContent || '').trim())
  );

  if (!button) {
    return false;
  }

  button.click();

  return true;
}

/**
 * Hear the save go out.
 *
 * The form is in this window now, so the request it sends is this window's —
 * matched on the synced entry's own path, which is read live because the CP is
 * never reloaded between one global section and the next.
 */
export function watchGlobalSectionInlineSaves(win) {
  watchGlobalSectionPanelSaves(win, win, () => globalSectionEntryPath);
}

/**
 * Take the form back down and hand the column back to the page. Returns whether
 * there was one — that is how the caller knows which of the two routes was open.
 */
export function closeGlobalSectionInline(win, { refresh = true } = {}) {
  const doc = win.document;
  const host = globalSectionHost(doc);

  stopGlobalSectionInlineValues(win);

  if (!host) {
    return false;
  }

  if (globalSectionApp) {
    try {
      globalSectionApp.unmount();
    } catch {
      /* already gone */
    }

    globalSectionApp = null;
  }

  host.remove();
  sve.clearSolo(doc);
  openSettingsTab(win);
  showPageFieldsAgain(doc);

  globalSectionEntryPath = null;
  globalSectionValuesSeen = null;
  sveState.sectionBaselineUntil = 0;
  sveState.sectionPanelValues = null;
  sveState.sectionValuesBaseline = null;
  sveState.sectionValuesMatchBaseline = true;
  sveState.pendingEditUntilPanel = null;
  sveState.pendingFocusUntilPanel = null;

  rearmFirstSection();
  sve.syncPreviewInset(win);
  clearSectionsStash(win, { refresh });
  sve.syncSectionLibraryAvailability(win);
  syncCodeDock(win, doc, sveState.soloUid);

  return true;
}



sve.GLOBAL_SECTION_INLINE = GLOBAL_SECTION_INLINE;
sve.CHROME_INLINE = CHROME_INLINE;
sve.GLOBAL_SECTION_PANEL_ID = GLOBAL_SECTION_PANEL_ID;
sve.GLOBAL_SECTION_HOST_ID = GLOBAL_SECTION_HOST_ID;
sve.GLOBAL_SECTION_CONTAINER = GLOBAL_SECTION_CONTAINER;
sve.GLOBAL_SECTION_AWAY_ATTR = GLOBAL_SECTION_AWAY_ATTR;
Object.defineProperty(sve, 'sectionsStashActive', { get() { return sectionsStashActive; }, set(v) { sectionsStashActive = v; } });
sve.globalSectionPanelFrame = globalSectionPanelFrame;
sve.forwardGlobalSectionFocus = forwardGlobalSectionFocus;
sve.flushPendingFocusUntilPanel = flushPendingFocusUntilPanel;
sve.hasUnsavedGlobalSection = hasUnsavedGlobalSection;
sve.sectionPanelContainer = sectionPanelContainer;
sve.refreshSections = refreshSections;
Object.defineProperty(sve, 'sectionRefreshPending', { get() { return sectionRefreshPending; }, set(v) { sectionRefreshPending = v; } });
sve.refreshSectionsUnlessEditing = refreshSectionsUnlessEditing;
sve.flushPendingSectionRefresh = flushPendingSectionRefresh;
sve.postSectionValues = postSectionValues;
sve.clearSectionsStash = clearSectionsStash;
sve.sectionSaveListeners = sectionSaveListeners;
sve.onSectionSave = onSectionSave;
sve.saveGlobalSectionPanel = saveGlobalSectionPanel;
sve.announceSectionSave = announceSectionSave;
sve.watchGlobalSectionPanelSaves = watchGlobalSectionPanelSaves;
sve.ensureGlobalSectionPanelSaveWatch = ensureGlobalSectionPanelSaveWatch;
sve.SECTION_PANEL_REVEAL_MS = SECTION_PANEL_REVEAL_MS;
sve.revealSectionPanelFrame = revealSectionPanelFrame;
sve.closeGlobalSectionPanel = closeGlobalSectionPanel;
sve.openGlobalSectionPanel = openGlobalSectionPanel;
sve.openGlobalSectionPanelFrame = openGlobalSectionPanelFrame;
Object.defineProperty(sve, 'globalSectionApp', { get() { return globalSectionApp; }, set(v) { globalSectionApp = v; } });
Object.defineProperty(sve, 'globalSectionEntryPath', { get() { return globalSectionEntryPath; }, set(v) { globalSectionEntryPath = v; } });
Object.defineProperty(sve, 'globalSectionValuesTimer', { get() { return globalSectionValuesTimer; }, set(v) { globalSectionValuesTimer = v; } });
Object.defineProperty(sve, 'globalSectionValuesSeen', { get() { return globalSectionValuesSeen; }, set(v) { globalSectionValuesSeen = v; } });
sve.globalSectionHost = globalSectionHost;
sve.globalSectionEditorOpen = globalSectionEditorOpen;
sve.globalSectionContainer = globalSectionContainer;
sve.fetchInertiaPage = fetchInertiaPage;
sve.fetchGlobalSectionProps = fetchGlobalSectionProps;
sve.globalSectionFormProps = globalSectionFormProps;
sve.mountBorrowedForm = mountBorrowedForm;
sve.mountGlobalSectionForm = mountGlobalSectionForm;
sve.hidePageFieldsForGlobalSection = hidePageFieldsForGlobalSection;
sve.showPageFieldsAgain = showPageFieldsAgain;
sve.openGlobalSectionInline = openGlobalSectionInline;
sve.bootGlobalSectionSolo = bootGlobalSectionSolo;
sve.watchGlobalSectionInlineValues = watchGlobalSectionInlineValues;
sve.stopGlobalSectionInlineValues = stopGlobalSectionInlineValues;
sve.pressGlobalSectionSave = pressGlobalSectionSave;
sve.watchGlobalSectionInlineSaves = watchGlobalSectionInlineSaves;
sve.closeGlobalSectionInline = closeGlobalSectionInline;
