/**
 * Settings toggle: `sections`
 * Synced / global section editor.
 *
 * A synced section's content lives in another entry, so the page's form has
 * nothing to edit — only a reference. This mounts that entry's own publish form
 * (`EntryPublishForm`, registered on the CP's Vue app) in the Live Preview field
 * column, out of sight: its sets register the form's publish context, the
 * selection panel draws the section's rows on that context, and what is typed
 * is stashed so the page around it re-renders live. Save is the entry form's
 * own Save. A global section runs on the page's code, not a copy of it.
 *
 * The iframe route (the same form in a frame covering the column, reached over
 * postMessage), the solo boot that isolated the mounted form and the value
 * poll went with phase 2 of the selection panel.
 *
 * Imports leftover helpers from cp.js. Does not get imported by cp.js.
 */
import { watch } from 'vue';
import { sveState } from './cp-state.js';
import { LP_SAVE_TIMEOUT } from './cp.js';
import { syncCodeDock } from './code-dock-lazy.js';
import { GLOBAL_SECTION_HOST_ID } from './lib/ids.js';
import { unwrapRef } from './lib/values.js';
import { sectionField } from './lib/config.js';
import { csrfToken } from './lib/csrf.js';
import { previewFrame } from './lib/preview-frame.js';
import { publishContainers, whenContainerContext } from './lib/publish-containers.js';
import { setLpMode } from './lp-panel.js';
import { closeRightPanels, savedSectionsCollection, syncPreviewInset, syncSectionLibraryAvailability } from './section-library.js';
import { ensureNestedRowIds, notifyGlobalSectionDirty } from './globals-panel.js';
import { applySectionValues } from './chrome.js';
import { editSession } from './inline-edit.js';
import { ask } from './cp/bus.js';
import { clearSelection, select } from './lib/selection.js';

/** Publish-container name for the borrowed form — never "base", which is the page's. */
export const GLOBAL_SECTION_CONTAINER = 'sve-global-section';

/** True after we've pushed unsaved global-section values into the preview stash. */
export let sectionsStashActive = false;

/**
 * Whether the open global section holds something to save: the stash is only
 * how the page is kept showing what the form holds, so its existence is not
 * the question — whether what it holds differs from what was opened is.
 * Undoing an edit by hand leaves the stash in place and nothing to save.
 */
export function hasUnsavedGlobalSection() {
  return sectionsStashActive && !sveState.sectionValuesMatchBaseline;
}

/** Tells the preview to re-render asking for (or forgetting) the stashed section. */
export function refreshSections(win, active) {
  const frame = previewFrame(win.document);

  const url = ask('lp:lastPreviewUrl');

  if (!frame?.contentWindow || !url) {
    return;
  }

  frame.contentWindow.postMessage({ name: 'sve.sections', active, url }, win.location.origin);
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
  if (editSession) {
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
  notifyGlobalSectionDirty(win);
  win
    .fetch('/!/sve/global-section-stash', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': csrfToken(win),
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: JSON.stringify({ id, values }),
    })
    .then(() => refreshSectionsUnlessEditing(win))
    .catch(() => {});
}

export function clearSectionsStash(win, { refresh = true } = {}) {
  if (!sectionsStashActive) {
    notifyGlobalSectionDirty(win);

    return Promise.resolve();
  }

  sectionsStashActive = false;

  return win
    .fetch('/!/sve/global-section-stash/clear', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'X-CSRF-TOKEN': csrfToken(win), 'X-Requested-With': 'XMLHttpRequest' },
    })
    .catch(() => {})
    .then(() => {
      notifyGlobalSectionDirty(win);

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

/** The entry form's own Save, for the bar's Save. `done(ok)` when the save has been heard. */
export function saveGlobalSectionPanel(win, done) {
  if (!hasUnsavedGlobalSection()) {
    done(true);

    return;
  }

  // Nothing open to save into: whatever the stash still holds is not backed by a
  // form any more, so it goes.
  if (!globalSectionHost(win.document)) {
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

  pressGlobalSectionSave(win);
}

/** Announce the result of a synced-section save: saved = the new clean baseline. */
export function announceSectionSave(win, ok) {
  if (ok) {
    sectionsStashActive = true;

    if (sveState.sectionPanelValues?.values) {
      sveState.sectionValuesBaseline = JSON.stringify(sveState.sectionPanelValues.values);
    }

    sveState.sectionValuesMatchBaseline = true;
    sveState.sectionBaselineUntil = Date.now() + 2000;
    clearSectionsStash(win, { refresh: false });
  }

  [...sectionSaveListeners].forEach((listener) => listener(ok));
}

/**
 * Hear the entry save the synced section's form sends, in this window.
 *
 * `entryPath` is a function rather than a string: the CP is not reloaded
 * between global sections, so which entry counts as "the save" changes while
 * the same patched fetch and XHR stay in place. Patched once per window.
 */
export function watchGlobalSectionSaves(iwin, entryPath) {
  if (!iwin || iwin.__sveSectionSaveWatch) {
    return;
  }

  iwin.__sveSectionSaveWatch = true;

  const savePath = entryPath;

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

  const announce = (ok) => announceSectionSave(iwin, ok);

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

/** Close the open global section's form, if one is open. */
export function closeGlobalSectionPanel(win) {
  closeGlobalSectionInline(win);
}

/** The mounted form: its Vue app, the entry it shows, and how to save it. */
export let globalSectionApp = null;
export let globalSectionEntryPath = null;
let stopGlobalSectionValues = null;

export function globalSectionHost(doc) {
  return doc.getElementById(GLOBAL_SECTION_HOST_ID);
}

/** True while a global section owns the editor. */
export function globalSectionEditorOpen(doc) {
  return !!globalSectionHost(doc);
}

/** The synced entry's own publish container, once its form has mounted. */
export function globalSectionContainer() {
  return publishContainers.find((container) => container.name === GLOBAL_SECTION_CONTAINER) || null;
}

/**
 * Ask the Control Panel for a screen the way the Control Panel asks itself.
 *
 * Inertia answers an edit route with exactly the props its page component
 * expects — blueprint, values, meta, localizations and all — so a form can be
 * built here from the same answer, and none of it has to be kept in step by hand
 * with what Statamic's forms want next.
 */
/**
 * Inertia's version for this build of the Control Panel.
 *
 * It goes out with every request, and the server answers 409 Conflict when it
 * does not match. An empty one never matches — and warming the header and
 * footer screens runs early, before Statamic's app has mounted and put a
 * version anywhere this can read it. So the fetch was thrown away and paid for
 * again on the click: measured at one conflict per global, 216 KB and a second
 * and a half of server time spent on answers nobody could use.
 *
 * So it is waited for rather than guessed at. Five seconds at the outside; if
 * the app never mounts there is nothing here worth warming, and asking without
 * a version is exactly what this stops doing.
 */
async function inertiaVersion(win) {
  for (let tries = 0; tries < 50; tries += 1) {
    const version = win.Statamic?.$app?.config?.globalProperties?.$page?.version;

    if (version) {
      return version;
    }

    await new Promise((resolve) => win.setTimeout(resolve, 100));
  }

  return '';
}

export async function fetchInertiaPage(win, path) {
  const version = await inertiaVersion(win);

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
  const collection = encodeURIComponent(savedSectionsCollection(win));

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
 * Open the synced entry's form in the left Live Preview editor, in this window.
 */
export async function openGlobalSectionInline(win, id) {
  const doc = win.document;
  const existing = globalSectionHost(doc);

  // Already showing this section — leave it be. Rebuilding would reload the form
  // and throw away whatever is half-typed in it.
  if (existing?.dataset.sveSectionId === id) {
    setLpMode(win, 'show');

    return;
  }

  closeGlobalSectionInline(win, { refresh: false });

  // Close other drawers; the field column is this section's now.
  closeRightPanels(win, []);
  setLpMode(win, 'show');

  const column = doc.querySelector('.live-preview-fields') || doc.querySelector('.live-preview-editor');

  if (!column) {
    console.error('[sve] no Live Preview column to open the global section in');

    return;
  }

  const host = doc.createElement('div');

  host.id = GLOBAL_SECTION_HOST_ID;
  host.dataset.sveSectionId = id;
  // Out of sight: the panel draws the rows; this form is the data and the save.
  host.style.cssText = 'position:absolute;inset:0;opacity:0;overflow:hidden;pointer-events:none;';
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
    console.error('[sve] the global section', id, 'could not be mounted');

    return;
  }

  globalSectionEntryPath = new URL(loaded.path, win.location.origin).pathname;
  watchGlobalSectionSaves(win, () => globalSectionEntryPath);
  adoptGlobalSectionContext(win, host, id);
  notifyGlobalSectionDirty(win);
  syncSectionLibraryAvailability(win);
  win.setTimeout(() => syncCodeDock(win, doc, null), 200);
}

/**
 * The borrowed form's context is read off its sets once they are drawn, the
 * rows get the ids the preview targets them by (legacy synced entries lost
 * their nested ids on save), the values start streaming to the stash, and
 * the section's first row is selected — drawn on that context.
 */
function adoptGlobalSectionContext(win, host, id) {
  const field = sectionField(win);

  whenContainerContext(GLOBAL_SECTION_CONTAINER, 4000, win).then((ctx) => {
    if (globalSectionHost(win.document) !== host) {
      return;
    }

    if (!ctx) {
      closeGlobalSectionInline(win);
      console.error('[sve] the global section', id, 'registered no publish context');

      return;
    }

    const values = unwrapRef(ctx.values);
    const rows = values && typeof values === 'object' ? values[field] : null;

    if (Array.isArray(rows) && rows.length) {
      const next = JSON.parse(JSON.stringify(rows));

      if (ensureNestedRowIds(next)) {
        ctx.setFieldValue(field, next);
      }
    }

    watchGlobalSectionInlineValues(win, id, ctx);

    const first = Array.isArray(rows) ? rows[0] : null;
    const uid = first?._visual_id || first?.id || first?._id || null;

    if (uid) {
      select({ uid, source: 'global' });
    }
  });
}

/**
 * What the form holds, as it changes.
 *
 * A watch on the container's values ref — Statamic's own container already
 * watches it deep for its dirty state — debounced to a quarter second, the
 * cadence the old poll had. The first reading is the baseline; every later
 * one goes to the stash and re-renders the page (applySectionValues). The
 * baseline is read a beat after the form has mounted, not the instant its
 * context appears: fields normalise their values on mount (a responsive
 * wrapper reshapes its drawers before its first render), and read earlier
 * those writes counted as edits — Close then asked to discard nothing.
 */
export function watchGlobalSectionInlineValues(win, id, ctx) {
  stopGlobalSectionInlineValues(win);

  let timer = null;

  const push = () => {
    const values = unwrapRef(ctx.values);

    if (values && typeof values === 'object') {
      applySectionValues(win, id, JSON.parse(JSON.stringify(values)));
    }
  };

  timer = win.setTimeout(push, 300);

  const stop = watch(
    () => unwrapRef(ctx.values),
    () => {
      win.clearTimeout(timer);
      timer = win.setTimeout(push, 250);
    },
    { deep: true }
  );

  stopGlobalSectionValues = () => {
    win.clearTimeout(timer);
    stop();
  };
}

export function stopGlobalSectionInlineValues() {
  if (stopGlobalSectionValues) {
    stopGlobalSectionValues();
    stopGlobalSectionValues = null;
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
 * Take the form back down and hand the column back to the page. Returns whether
 * there was one.
 */
export function closeGlobalSectionInline(win, { refresh = true } = {}) {
  const doc = win.document;
  const host = globalSectionHost(doc);

  stopGlobalSectionInlineValues();

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
  clearSelection('global');

  globalSectionEntryPath = null;
  sveState.sectionBaselineUntil = 0;
  sveState.sectionPanelValues = null;
  sveState.sectionValuesBaseline = null;
  sveState.sectionValuesMatchBaseline = true;
  sveState.pendingEditUntilPanel = null;

  syncPreviewInset(win);
  clearSectionsStash(win, { refresh });
  syncSectionLibraryAvailability(win);
  syncCodeDock(win, doc, null);

  return true;
}
