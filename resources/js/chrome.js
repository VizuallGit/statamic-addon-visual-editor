/**
 * Settings toggle: `chrome_header`
 * Header and footer, edited in this window.
 *
 * The site's header and footer are fields on a global set, not on the page —
 * so, like a synced section, the page's own form has nothing to edit. The
 * half's globals form is mounted headless in the Live Preview field column
 * (cp/surfaces/ChromeForm.vue: Statamic's PublishContainer on the globals
 * screen's Inertia props, under our own container name) and the selection
 * panel draws the half's tab on its context; its widgets are rows of that
 * form, and every piece of the editor that works on a page section works on
 * them — because it is the same code. What is typed is stashed for the
 * preview; Save runs Statamic's own save pipeline.
 *
 * The borrowed globals page component, the solo isolation of its tabs and the
 * docked globals iframe as a fallback went with phase 2 of the selection panel.
 *
 * Imports leftover helpers from cp.js. Does not get imported by cp.js.
 */
import { sveState } from './cp-state.js';
import { syncCodeDock } from './code-dock-lazy.js';
import { CHROME_CONTAINER, CHROME_HOST_ID, HTML_TREE_PANEL_ID } from './lib/ids.js';
import { unwrapRef } from './lib/values.js';
import { containerContextName, publishContainers, whenContainerContext } from './lib/publish-containers.js';
import { clearSelection, select } from './lib/selection.js';
import { setLpMode } from './lp-panel.js';
import { closeRightPanels, hideGlobalsPanel, syncPreviewInset, syncSectionLibraryAvailability } from './section-library.js';
import { chromeGlobalHandle, chromeIgnoreValuePostsUntil, clearGlobalsStash, globalsAcceptValues, notifyChromeDirty, notifyGlobalSectionDirty, postGlobals, setActiveChromeKind, watchGlobalsPanelSaves } from './globals-panel.js';
import { flushPendingEditUntilPanel } from './inline-edit.js';
import { fetchInertiaPage, postSectionValues } from './global-section.js';
import { mountStatamicSurface } from './cp/mount-statamic.js';
import ChromeForm from './cp/surfaces/ChromeForm.vue';
import { MSG, SOURCE } from './lib/protocol.js';

export let chromeApp = null;
export let chromeInlineKind = null;
export let chromeInlineHandle = null;

/** The headless form's api ({ save }) while it is mounted. */
export let chromeForm = null;

/** The mounted chrome form's publish context, while the selection panel draws it. */
export let chromeCtx = null;

export function chromeHost(doc) {
  return doc.getElementById(CHROME_HOST_ID);
}

/** True while header/footer owns the editor. */
export function chromeEditorOpen(doc) {
  return !!chromeHost(doc);
}

/** The half's own publish container, once its form has mounted. */
export function chromeContainer() {
  return publishContainers.find((container) => container.name === CHROME_CONTAINER) || null;
}

/**
 * Mount the half's globals form headless, on Statamic's PublishContainer under
 * our own container name. The selection panel draws the tab's fields on its
 * context; nothing of the globals screen itself is borrowed, so this holds in
 * every build of the Control Panel. What is typed arrives on `onChange`.
 */
export function mountChromeContainer(win, host, page, handle) {
  chromeForm = null;

  try {
    chromeApp = mountStatamicSurface(ChromeForm, host, {
      name: CHROME_CONTAINER,
      page,
      bind: (api) => {
        chromeForm = api;
      },
      onChange: (values) => onChromeValues(win, handle, values),
    });
  } catch (err) {
    console.error('[sve] chrome form', err);
    chromeApp = null;
  }

  return !!chromeApp;
}

/**
 * The half that isn't open, fetched ahead of being asked for.
 *
 * Only for the case where the two halves have a global set each: stepping across
 * then means unmounting one form and building another, and a round trip in the
 * middle is a field column standing empty. Entries are taken, not read — one
 * mount consumes the page and warms the next one — so nothing here outlives a
 * save of the set it came from.
 */
export const chromeInlinePages = new Map();

export async function takeChromeInlinePage(win, handle) {
  const pending = chromeInlinePages.get(handle);

  chromeInlinePages.delete(handle);

  // A warmed page that came back empty must never be handed on. It is
  // indistinguishable from a real miss by the time the mount sees it, and the
  // editor answers a failed mount by falling back to the docked panel — which
  // opens the header on the RIGHT, in the panel meant for globals, instead of in
  // the field column on the left. A warm miss is thrown away and the click pays
  // for one honest fetch: slower than warm, still the right side of the screen.
  const warmed = pending ? await pending : null;

  return warmed ?? fetchInertiaPage(win, `/cp/globals/${encodeURIComponent(handle)}`).catch(() => null);
}

export function prefetchOtherChromeHalf(win, kind) {
  const handle = chromeGlobalHandle(win, kind === 'footer' ? 'header' : 'footer');

  // One shared set: the other half is a tab of the form already mounted.
  if (handle === chromeGlobalHandle(win, kind) || chromeInlinePages.has(handle)) {
    return;
  }

  chromeInlinePages.set(
    handle,
    fetchInertiaPage(win, `/cp/globals/${encodeURIComponent(handle)}`).catch(() => null)
  );
}

/**
 * Both halves' screens, fetched before either one is clicked.
 *
 * The click costs an Inertia page fetch, a component resolve and a mount, and
 * only the last two are unavoidable — so the fetch is done up front, while the
 * preview is still rendering and nothing is waiting on it. That is the whole
 * difference between a panel that opens and a panel that arrives.
 */
export function warmChromeInlinePages(win) {
  ['header', 'footer'].forEach((kind) => {
    const handle = chromeGlobalHandle(win, kind);

    if (chromeInlinePages.has(handle)) {
      return;
    }

    const pending = fetchInertiaPage(win, `/cp/globals/${encodeURIComponent(handle)}`).catch(() => null);

    chromeInlinePages.set(handle, pending);

    // Warming runs early — early enough that Inertia may not have a version to
    // send yet and the server answers with a conflict rather than a page. An
    // empty answer is forgotten rather than kept, so the next warm-up can try
    // again and a click never inherits it.
    pending.then((page) => {
      if (!page && chromeInlinePages.get(handle) === pending) {
        chromeInlinePages.delete(handle);
      }
    });
  });
}

/**
 * Forget the warmed screens.
 *
 * A saved set makes every page fetched before it wrong, and a warm page is
 * indistinguishable from a fresh one once it is mounted — the form would open on
 * the values as they were before the save. Cheaper to fetch again than to be
 * subtly wrong, so a save simply throws them away and warms them anew.
 */
export function resetChromeInlinePages(win) {
  chromeInlinePages.clear();
  warmChromeInlinePages(win);
}

/** Open header/footer in the left editor, in this window. */
export async function openChromeInline(win, kind) {
  const doc = win.document;
  const chromeKind = kind === 'footer' ? 'footer' : 'header';
  const handle = chromeGlobalHandle(win, chromeKind);
  const existing = chromeHost(doc);

  setActiveChromeKind(chromeKind);
  chromeInlineKind = chromeKind;
  setLpMode(win, 'show');
  hideGlobalsPanel(win, { release: false });

  // Both halves in one set: they are two tabs of one form, and stepping across is
  // a tab switch rather than a remount — nothing half-typed is lost.
  if (existing && chromeInlineHandle === handle) {
    if (chromeCtx) {
      select({ tab: chromeKind, ctxName: containerContextName(chromeCtx), source: 'chrome' });
    }

    syncSectionLibraryAvailability(win);
    syncCodeDock(win, doc, null);

    return;
  }

  // A set each: the form standing there holds the other half's fields, and no tab
  // of it is the one being asked for. It has to go before the right one is built
  // — the page for that one is normally already in hand (see the prefetch at the
  // end of this function), so the swap is one frame, not a fetch.
  if (existing) {
    closeChromeInline(win, { refresh: false });
    setActiveChromeKind(chromeKind);
    chromeInlineKind = chromeKind;
  }

  // The HTML tree stays: it draws the page's frame, and stepping into the
  // header is what it shows next — the header's rows, the rest faded.
  closeRightPanels(win, doc.getElementById(HTML_TREE_PANEL_ID) ? [HTML_TREE_PANEL_ID] : []);

  const column = doc.querySelector('.live-preview-fields') || doc.querySelector('.live-preview-editor');

  if (!column) {
    chromeInlineKind = null;
    console.error('[sve] no Live Preview column to open the', chromeKind, 'in');
    syncCodeDock(win, doc, null);

    return;
  }

  const host = doc.createElement('div');

  host.id = CHROME_HOST_ID;
  host.dataset.sveChromeKind = chromeKind;
  // Out of sight: the panel draws the half; this form is the data and the save.
  host.style.cssText = 'position:absolute;inset:0;opacity:0;overflow:hidden;pointer-events:none;';
  if (win.getComputedStyle(column).position === 'static') {
    column.style.position = 'relative';
  }
  column.appendChild(host);

  const loaded = await takeChromeInlinePage(win, handle);

  if (chromeHost(doc) !== host) {
    return;
  }

  if (!loaded?.props?.blueprint || !mountChromeContainer(win, host, loaded.props, handle)) {
    closeChromeInline(win);
    console.error('[sve] the globals screen for', handle, 'could not be fetched — the', chromeKind, 'stays closed');
    syncCodeDock(win, doc, null);

    return;
  }

  chromeInlineHandle = handle;
  sveState.chromeValuesBaseline = JSON.stringify(loaded.props.values || {});
  sveState.chromeValuesSeen = sveState.chromeValuesBaseline;
  watchChromeInlineSaves(win);
  adoptChromeContext(win, host, chromeKind);
  syncSectionLibraryAvailability(win);
  syncCodeDock(win, doc, null);
  // Both, not just the other one: this half was consumed on the way in, and
  // re-opening it later should cost no more than stepping across does.
  warmChromeInlinePages(win);
}

/**
 * Register the chrome form's context and select its tab, once the container
 * has registered it — a frame or two at most. Given up after four seconds,
 * when the form did not come, and said so.
 */
function adoptChromeContext(win, host, kind) {
  whenContainerContext(CHROME_CONTAINER, 4000, win).then((ctx) => {
    if (chromeHost(win.document) !== host || chromeInlineKind !== kind) {
      return;
    }

    if (!ctx) {
      closeChromeInline(win);
      console.error('[sve] the', kind, 'form registered no publish context');

      return;
    }

    chromeCtx = ctx;
    select({ tab: kind, ctxName: containerContextName(ctx), source: 'chrome' });
  });
}

/**
 * What the form holds, as it changes — from the container's own update, not a
 * poll. Stashed for the preview over the same channel the docked panel used
 * (`postGlobals` and its debounce), so the render, the chrome bar and the
 * discard path all behave exactly as they did. Inside the settle window after
 * an open or a save, what arrives is the form agreeing with what is on disk —
 * that is the clean state, not an edit.
 */
function onChromeValues(win, handle, values) {
  if (!chromeHost(win.document) || !values || typeof values !== 'object') {
    return;
  }

  const serialized = JSON.stringify(values);

  if (serialized === sveState.chromeValuesSeen) {
    return;
  }

  sveState.chromeValuesSeen = serialized;

  if (Date.now() < chromeIgnoreValuePostsUntil) {
    sveState.chromeValuesBaseline = serialized;

    return;
  }

  if (!globalsAcceptValues) {
    return;
  }

  sveState.globalsStashActive = true;
  notifyChromeDirty(win);
  postGlobals(win, handle, JSON.parse(serialized));
}

/** The form's own save, for the bar's Save. */
export function pressChromeSave(win) {
  if (!chromeHost(win.document) || !chromeForm) {
    return false;
  }

  void chromeForm.save();

  return true;
}

/** Hear the globals save go out — it is this window's request now. */
export function watchChromeInlineSaves(win) {
  watchGlobalsPanelSaves(win, win, () => (chromeInlineHandle ? `/cp/globals/${chromeInlineHandle}` : null));
}

/** Take the form down and hand the column back to the page. */
export function closeChromeInline(win, { refresh = true } = {}) {
  const doc = win.document;
  const host = chromeHost(doc);

  // Nothing of ours is open — and nothing of ours may be forgotten either. This
  // is called on the way IN as well (closeRightPanels clears the field column
  // before the form is built), and clearing the kind there left the boot with
  // nothing to show.
  if (!host) {
    return false;
  }

  chromeInlineKind = null;
  chromeCtx = null;
  clearSelection('chrome');

  // Leaving for real — as opposed to the internal swap that steps from one half
  // to the other, which needs the half it is about to mount still warm. Whatever
  // was saved in here has made the warmed screens wrong, so they go and are
  // fetched again now, while nothing is waiting on them.
  if (refresh) {
    resetChromeInlinePages(win);
  }

  if (chromeApp) {
    try {
      chromeApp.unmount();
    } catch {
      /* already gone */
    }

    chromeApp = null;
  }

  chromeForm = null;
  host.remove();

  chromeInlineHandle = null;
  sveState.chromeValuesSeen = null;
  sveState.chromeValuesBaseline = null;

  syncPreviewInset(win);
  clearGlobalsStash(win, { refresh });
  syncSectionLibraryAvailability(win);
  syncCodeDock(win, doc, null);

  return true;
}

/**
 * What the synced section's form now holds — however it was read.
 *
 * The docked panel posts it up; edited in this window it is read straight off the
 * form's own publish container. Both arrive here, so the baseline, the Save
 * button and the preview stash are decided in one place.
 */
export function applySectionValues(win, id, values) {
  // What the bar names the section by, and what an inline edit waits for.
  sveState.sectionPanelValues = { id, values };

  // An inline edit clicked before the form had values — try again now.
  flushPendingEditUntilPanel();

  const serialized = JSON.stringify(values ?? {});

  // First poll after open = baseline, not dirty. Otherwise Save (primary)
  // lights up the moment you enter a global section with no real edits. The
  // same is true of the first values to arrive after a save — see
  // sveState.sectionBaselineUntil — and the window is closed as soon as it is used, so
  // one echo is all it ever covers.
  if (sveState.sectionValuesBaseline === null || Date.now() < sveState.sectionBaselineUntil) {
    sveState.sectionBaselineUntil = 0;
    sveState.sectionValuesBaseline = serialized;
    sveState.sectionValuesMatchBaseline = true;
    notifyGlobalSectionDirty(win);

    return;
  }

  // Whether this is a change is a question about the Save button. Whether the
  // page should be re-rendered is not — the preview shows what the form holds,
  // and putting a value back to what it was when the section was opened is as
  // much a thing to show as any other edit.
  //
  // It used to return here, and that is the "sometimes it doesn't update":
  // a heading flipped H1 → H2 → H1 stayed on H2, because the last step matched
  // the baseline and never reached the stash. The panel and the page then
  // disagreed, and every later click was aimed at a page the form had moved on
  // from — which is what made editing seem to break at random.
  sveState.sectionValuesMatchBaseline = serialized === sveState.sectionValuesBaseline;

  notifyGlobalSectionDirty(win);
  postSectionValues(win, id, values);
}

export function listenForGlobalsValues(win) {
  win.addEventListener('message', (event) => {
    if (event.origin !== win.location.origin) {
      return;
    }

    const { data } = event;

    // Theme Settings (iframe) → sektionens Theme Color Picker-swatches.
    // Color-scheme dispatches også direkte på top; dette fanger postMessage.
    if (data?.source === SOURCE && data.type === MSG.SVE_THEME_SCALE_VALUES && data.values) {
      win.dispatchEvent(new CustomEvent('sve-theme-colors', { detail: data.values }));

      return;
    }

    if (data?.source !== SOURCE || data.type !== MSG.SVE_GLOBALS_VALUES) {
      return;
    }

    const panel = win.document.getElementById(GLOBALS_PANEL_ID);

    if (!panel || event.source !== panel.querySelector('iframe')?.contentWindow) {
      return;
    }

    // Live palette i sektioner mens Theme Settings er åben (også prefetch/hidden).
    if (data.values && data.handle === 'theme_settings') {
      win.dispatchEvent(new CustomEvent('sve-theme-colors', { detail: data.values }));
    }

    // Hidden prefetch panel: Theme Settings hydrates in the background. Those
    // value polls must NOT mark the editor dirty or the back button always
    // offers "Save, publish and go back" with no real edits.
    if (panel.hasAttribute('data-sve-chrome-hidden') || panel.style.visibility === 'hidden') {
      return;
    }

    // Discard/reload in progress — ignore stale polls from the old form.
    if (!globalsAcceptValues) {
      return;
    }

    const serialized = JSON.stringify(data.values ?? {});

    // Tab-lock / remount after entering chrome mutates the form once — treat as baseline, not dirty.
    if (activeChromeKind && Date.now() < chromeIgnoreValuePostsUntil) {
      sveState.chromeValuesBaseline = serialized;

      return;
    }

    if (activeChromeKind && sveState.chromeValuesBaseline !== null && serialized === sveState.chromeValuesBaseline) {
      return;
    }

    // Show Save on the chrome bar immediately (stash POST is still debounced).
    sveState.globalsStashActive = true;
    notifyChromeDirty(win);

    postGlobals(win, data.handle, data.values);
  });
}
