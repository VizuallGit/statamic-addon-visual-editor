/**
 * Settings toggle: `chrome_header`
 * Header and footer chrome in this window.
 * Imports leftover helpers from cp.js. Does not get imported by cp.js.
 */
import { sve } from './cp-registry.js';
import { t } from './cp-t.js';
import { sveState } from './cp-state.js';
import { SELECTORS } from './cp-selectors.js';
import { openSettingsTab, rearmFirstSection } from './cp.js';
import { syncCodeDock } from './code-dock.js';

// ===== chrome-inline =====
// --- Header / footer, edited in this window --------------------------------------
//
// The site's header and footer are fields on a global set (Theme Settings), not
// on the page — so, like a synced section, the page's own form has nothing to
// edit. Everything below does for that global what the block above does for a
// synced entry: mounts Statamic's own globals form in the Live Preview field
// column and isolates it to the one tab the chrome belongs to. From there the
// header's widgets are sets in this document, and every piece of the editor that
// works on a page section works on them — because it is the same code.

/** The div Theme Settings' form is mounted into, in this document. */
export const CHROME_HOST_ID = '__sve-chrome-host';

/** Publish-container name for that form — never "base", which is the page's. */
export const CHROME_CONTAINER = 'sve-chrome';

export let chromeApp = null;
export let chromeInlineKind = null;
export let chromeInlineHandle = null;
export let chromeValuesTimer = null;

export function chromeHost(doc) {
  return doc.getElementById(CHROME_HOST_ID);
}

/** True while header/footer owns the editor, whichever way it was opened. */
export function chromeEditorOpen(doc) {
  return !!(doc.getElementById(sve.GLOBALS_PANEL_ID) || chromeHost(doc));
}

/** Theme Settings' own publish container, once its form has mounted. */
export function chromeContainer() {
  return sve.publishContainers.find((container) => container.name === CHROME_CONTAINER) || null;
}

/**
 * Statamic's own page-component resolver, borrowed off the running app.
 *
 * The globals screen is an Inertia page, not one of the components registered on
 * the CP's Vue app, so there is no name to resolve it by. Inertia holds the
 * resolver that knows how to load it — asking that rather than reaching for a
 * hashed asset path means this keeps working across Statamic builds.
 */
export function inertiaPageResolver(win) {
  const start = win.document.querySelector('main') || win.document.body;
  let component = start?.__vueParentComponent;

  while (component) {
    if (typeof component.props?.resolveComponent === 'function') {
      return component.props.resolveComponent;
    }

    component = component.parent;
  }

  return null;
}

/**
 * Mount Theme Settings' form, under a container name of our own.
 *
 * The globals page hardcodes `publish-container="base"` — the page entry's name —
 * and two containers answering to one name is a form writing into another form's
 * values. The page's render is therefore taken as it is built and the one prop
 * rewritten before Vue ever sees it. The same pass drops the page's <Head>
 * sibling: it wants Inertia's head manager, which a borrowed app has no business
 * providing, and the form is the only part of that screen we came for.
 */
export function mountChromeForm(win, host, Page, props) {
  let form = null;

  const findForm = (vnode) => {
    if (!vnode || typeof vnode !== 'object' || form) {
      return;
    }

    if (Array.isArray(vnode)) {
      vnode.forEach(findForm);

      return;
    }

    if (vnode.props && ('publish-container' in vnode.props || 'publishContainer' in vnode.props)) {
      if ('publish-container' in vnode.props) {
        vnode.props['publish-container'] = CHROME_CONTAINER;
      }

      if ('publishContainer' in vnode.props) {
        vnode.props.publishContainer = CHROME_CONTAINER;
      }

      form = vnode;

      return;
    }

    if (Array.isArray(vnode.children)) {
      vnode.children.forEach(findForm);
    }
  };

  const Patched = {
    ...Page,
    render(...args) {
      form = null;

      const tree = Page.render.apply(this, args);

      findForm(tree);

      return form || tree;
    },
  };

  // A build that no longer renders the form this way would leave us mounting the
  // whole globals screen under the page's own container name. Better to say so
  // and let the docked panel take it.
  if (typeof Page.render !== 'function') {
    console.error('[sve] globals page has no render — chrome falls back to the panel');

    return false;
  }

  chromeApp = sve.mountBorrowedForm(win, host, (Vue) => () => Vue.h(Patched, props), 'chrome form');

  return !!chromeApp;
}

/** The tab button in the mounted form whose label names this chrome. */
export function chromeTabButton(host, kind) {
  const needle = kind === 'footer' ? 'footer' : 'header';

  return [...host.querySelectorAll('button[role="tab"]')].find((tab) =>
    (tab.textContent || '').trim().toLowerCase().startsWith(needle)
  );
}

export function activeChromeTabPanel(host) {
  return (
    host.querySelector('[role="tabpanel"][data-state="active"]') ||
    [...host.querySelectorAll('[role="tabpanel"]')].find((panel) => panel.offsetParent !== null) ||
    null
  );
}

/**
 * Show one tab and nothing else.
 *
 * The isolation is the section view's isolation — the same keep/parent marking
 * `sve.markSoloPath` does, started at the tab's own panel instead of at a set. So the
 * globals form arrives stripped of everything a section's card is stripped of:
 * its title bar, its Save, the row of other tabs, and the page's own fields
 * behind it. What is left is the header's fields under a header naming them.
 */
/**
 * The form's own fields, for a set whose blueprint draws no tab bar.
 *
 * A set holding a single half has a single tab, and Statamic renders no tab
 * strip for one tab — so there is no tabpanel to isolate and no button to press.
 * The whole form is the half, which is the answer, not a failure.
 *
 * Saying "not yet" here is expensive in a way that is easy to miss: the boot
 * retries every 120ms and the host stays at opacity 0 until either the solo
 * lands or the blind reveal timer fires, and that timer is 2.5 seconds. A form
 * that could never be isolated therefore always cost the full 2.5s before it
 * appeared — the whole of the wait between clicking the header and seeing it.
 */
export function soleChromePanel(host) {
  // A tab strip means the tabs are still rendering; that is genuinely "not yet",
  // and answering with the whole form would isolate every half at once.
  if (host.querySelector('[role="tabpanel"]') || host.querySelector('button[role="tab"]')) {
    return null;
  }

  return host.querySelector('.publish-fields') || null;
}

export function soloChromeTab(win, doc, kind) {
  const host = chromeHost(doc);
  const editor = sve.soloRoot(doc);

  if (!host || !editor || !editor.contains(host)) {
    return false;
  }

  const tab = chromeTabButton(host, kind);
  const tabs = host.querySelectorAll('button[role="tab"]');

  // No tab by that name, and more than one to choose from: this is the other
  // half's form, still mounted. Saying "not yet" keeps the caller's host at
  // opacity 0 — isolating the active panel here is what used to leave the
  // previous half on screen until the right form arrived.
  if (!tab && tabs.length > 1) {
    return false;
  }

  if (tab && tab.getAttribute('aria-selected') !== 'true') {
    // reka-ui switches on the full pointer sequence, never a bare click().
    ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click'].forEach((type) => {
      tab.dispatchEvent(new win.PointerEvent(type, { bubbles: true, cancelable: true }));
    });
  }

  const panel = activeChromeTabPanel(host) || soleChromePanel(host);

  if (!panel) {
    return false;
  }

  sve.ensureSoloStyle(doc);

  doc.querySelectorAll(`[${sve.SOLO_PARENT_ATTR}]`).forEach((el) => el.removeAttribute(sve.SOLO_PARENT_ATTR));
  doc.querySelectorAll(`[${sve.SOLO_KEEP_ATTR}]`).forEach((el) => el.removeAttribute(sve.SOLO_KEEP_ATTR));

  for (let node = panel; node && node !== editor && node.parentElement; node = node.parentElement) {
    node.setAttribute(sve.SOLO_KEEP_ATTR, '');
    node.parentElement.setAttribute(sve.SOLO_PARENT_ATTR, '');
  }

  // Lives outside Vue's tree; without this the stylesheet hides it.
  doc.getElementById(sve.FOCUS_HEADER_ID)?.setAttribute(sve.SOLO_KEEP_ATTR, '');

  // The word is written for the middle of a sentence ("you are editing the
  // header"); at the top of the panel it is a name, so it starts like one.
  const word = t(win, kind === 'footer' ? 'chrome_footer' : 'chrome_header');

  sve.paintFocusHeader(
    win,
    doc,
    {
      display: word.charAt(0).toUpperCase() + word.slice(1),
      icon: 'layout',
      instructions: '',
    },
    null
  );

  return true;
}

/**
 * Keep that view on screen while Vue rebuilds the form under it.
 *
 * Stored in `sveState.soloObserver` on purpose: it is the same slot a section's solo uses,
 * so stepping from the header into one of its widgets replaces this watch with
 * that one, and `sve.clearSolo` takes down whichever is running.
 */
export function watchChromeSolo(win, doc, kind) {
  if (sveState.soloObserver) {
    sveState.soloObserver.disconnect();
  }

  const target = doc.querySelector('.live-preview-fields') || doc.body;
  let queued = false;

  sveState.soloObserver = new MutationObserver(() => {
    if (chromeInlineKind !== kind || sveState.soloUid || queued) {
      return;
    }

    queued = true;
    win.requestAnimationFrame(() => {
      queued = false;

      if (chromeInlineKind === kind && !sveState.soloUid && chromeHost(doc)) {
        soloChromeTab(win, doc, kind);
      }
    });
  });
  sveState.soloObserver.observe(target, { childList: true, subtree: true });
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

  return warmed ?? sve.fetchInertiaPage(win, `/cp/globals/${encodeURIComponent(handle)}`).catch(() => null);
}

export function prefetchOtherChromeHalf(win, kind) {
  const handle = sve.chromeGlobalHandle(win, kind === 'footer' ? 'header' : 'footer');

  // One shared set: the other half is a tab of the form already mounted.
  if (handle === sve.chromeGlobalHandle(win, kind) || chromeInlinePages.has(handle)) {
    return;
  }

  chromeInlinePages.set(
    handle,
    sve.fetchInertiaPage(win, `/cp/globals/${encodeURIComponent(handle)}`).catch(() => null)
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
    const handle = sve.chromeGlobalHandle(win, kind);

    if (chromeInlinePages.has(handle)) {
      return;
    }

    const pending = sve.fetchInertiaPage(win, `/cp/globals/${encodeURIComponent(handle)}`).catch(() => null);

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
  const handle = sve.chromeGlobalHandle(win, chromeKind);
  const existing = chromeHost(doc);

  sve.setActiveChromeKind(chromeKind);
  chromeInlineKind = chromeKind;
  sve.setLpMode(win, 'show');
  sve.hideGlobalsPanel(win, { release: false });

  // Both halves in one set: they are two tabs of one form, and stepping across is
  // a tab switch rather than a remount — nothing half-typed is lost.
  if (existing && chromeInlineHandle === handle) {
    sveState.soloUid = null;
    soloChromeTab(win, doc, chromeKind);
    watchChromeSolo(win, doc, chromeKind);
    sve.syncSectionLibraryAvailability(win);
    syncCodeDock(win, doc, null);

    return;
  }

  // A set each: the form standing there holds the other half's fields, and no tab
  // of it is the one being asked for. It has to go before the right one is built
  // — the page for that one is normally already in hand (see the prefetch at the
  // end of this function), so the swap is one frame, not a fetch.
  if (existing) {
    closeChromeInline(win, { refresh: false });
    sve.setActiveChromeKind(chromeKind);
    chromeInlineKind = chromeKind;
  }

  sve.closeRightPanels(win, []);

  const column = doc.querySelector('.live-preview-fields') || doc.querySelector('.live-preview-editor');
  const resolver = inertiaPageResolver(win);

  if (!column || !resolver) {
    openGlobalsPanelFrameForChrome(win, chromeKind);

    return;
  }

  const host = doc.createElement('div');

  host.id = CHROME_HOST_ID;
  host.dataset.sveChromeKind = chromeKind;
  // Invisible until isolated — but the page form stays up. Hiding it first left
  // an empty column until this host faded in (the jump / delay in the sidebar).
  host.style.cssText = 'position:absolute;inset:0;opacity:0;overflow:auto;pointer-events:none;';
  if (win.getComputedStyle(column).position === 'static') {
    column.style.position = 'relative';
  }
  column.appendChild(host);

  const loaded = await takeChromeInlinePage(win, handle);

  if (chromeHost(doc) !== host) {
    return;
  }

  let Page = null;

  if (loaded?.component) {
    try {
      const mod = await resolver(loaded.component);

      Page = mod?.default ?? mod;
    } catch {
      Page = null;
    }
  }

  if (chromeHost(doc) !== host) {
    return;
  }

  if (!Page || !mountChromeForm(win, host, Page, loaded.props)) {
    closeChromeInline(win);
    openGlobalsPanelFrameForChrome(win, chromeKind);

    return;
  }

  chromeInlineHandle = handle;
  watchChromeInlineSaves(win);
  watchChromeInlineValues(win, handle);
  bootChromeSolo(win, doc, host, chromeKind);
  sve.syncSectionLibraryAvailability(win);
  syncCodeDock(win, doc, null);
  // Both, not just the other one: this half was consumed on the way in, and
  // re-opening it later should cost no more than stepping across does.
  warmChromeInlinePages(win);
}

/** The docked Theme Settings route, for when the in-window one cannot be built. */
export function openGlobalsPanelFrameForChrome(win, kind) {
  const set = sve.globalSets(win).find((candidate) => candidate.handle === sve.chromeGlobalHandle(win, kind));

  if (!set) {
    return;
  }

  sve.openGlobalsPanel(win, set, { chromeLock: kind });
  sve.showGlobalsPanel(win);
  sve.lockChromeGlobalsTab(win, kind);
}

/** Isolate the tab once the form has rendered enough of itself to be isolated. */
export function bootChromeSolo(win, doc, host, kind) {
  let attempts = 0;

  const reveal = () => {
    if (chromeHost(doc) !== host) {
      return;
    }

    sve.hidePageFieldsForGlobalSection(host);
    host.style.position = '';
    host.style.inset = '';
    host.style.overflow = '';
    host.style.pointerEvents = '';
    host.style.opacity = '1';
  };

  win.setTimeout(reveal, sve.SECTION_PANEL_REVEAL_MS);

  const tryBoot = () => {
    if (chromeHost(doc) !== host || chromeInlineKind !== kind) {
      return;
    }

    if (soloChromeTab(win, doc, kind)) {
      watchChromeSolo(win, doc, kind);
      reveal();

      return;
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
 * Read what the form holds, four times a second, and stash it for the preview.
 *
 * Same channel the docked panel used — `sve.postGlobals` and its debounce — so the
 * render, the chrome bar and the discard path all behave exactly as they did.
 */
export function watchChromeInlineValues(win, handle) {
  stopChromeInlineValues(win);
  sveState.chromeValuesSeen = null;

  chromeValuesTimer = win.setInterval(() => {
    if (!chromeHost(win.document)) {
      return;
    }

    const container = chromeContainer();
    const values = container ? sve.unwrapRef(container.values) : null;

    if (!values || typeof values !== 'object') {
      return;
    }

    const serialized = JSON.stringify(values);

    if (serialized === sveState.chromeValuesSeen) {
      return;
    }

    const first = sveState.chromeValuesSeen === null;

    sveState.chromeValuesSeen = serialized;

    // First read is what the form opened with — the baseline, not an edit.
    if (first) {
      sveState.chromeValuesBaseline = serialized;

      return;
    }

    // Inside the settle window after an open or a save, what arrives is the form
    // agreeing with what is on disk — that is the clean state, not an edit.
    if (Date.now() < sve.chromeIgnoreValuePostsUntil) {
      sveState.chromeValuesBaseline = serialized;

      return;
    }

    if (serialized === sveState.chromeValuesBaseline) {
      return;
    }

    if (!sve.globalsAcceptValues) {
      return;
    }

    sveState.globalsStashActive = true;
    sve.notifyChromeDirty(win);
    sve.postGlobals(win, handle, JSON.parse(serialized));
  }, 250);
}

export function stopChromeInlineValues(win) {
  if (chromeValuesTimer) {
    win.clearInterval(chromeValuesTimer);
    chromeValuesTimer = null;
  }
}

/**
 * The globals form's own Save, pressed for it. Hidden by the solo view, which is
 * not the same as disabled — the click runs Statamic's real save, and that form
 * never navigates afterwards, so there is nothing to hold back.
 */
export function pressChromeSave(win) {
  const host = chromeHost(win.document);

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

/** Hear the globals save go out — it is this window's request now. */
export function watchChromeInlineSaves(win) {
  sve.watchGlobalsPanelSaves(win, win, () => (chromeInlineHandle ? `/cp/globals/${chromeInlineHandle}` : null));
}

/** Take the form down and hand the column back to the page. */
export function closeChromeInline(win, { refresh = true } = {}) {
  const doc = win.document;
  const host = chromeHost(doc);

  // Nothing of ours is open — and nothing of ours may be forgotten either. This
  // is called on the way IN as well (sve.closeRightPanels clears the field column
  // before the form is built), and clearing the kind there left the boot with
  // nothing to isolate: the whole Theme Settings screen, ten tabs and all.
  if (!host) {
    return false;
  }

  stopChromeInlineValues(win);
  chromeInlineKind = null;

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

  host.remove();
  sve.clearSolo(doc);
  openSettingsTab(win);
  sve.showPageFieldsAgain(doc);

  chromeInlineHandle = null;
  sveState.chromeValuesSeen = null;
  sveState.chromeValuesBaseline = null;

  rearmFirstSection();
  sve.syncPreviewInset(win);
  sve.clearGlobalsStash(win, { refresh });
  sve.syncSectionLibraryAvailability(win);
  syncCodeDock(win, doc, sveState.soloUid);

  return true;
}

/** The panel frame reports what's being typed → stash it → re-render the page. */
export function listenForSectionValues(win) {
  win.addEventListener('message', (event) => {
    if (event.origin !== win.location.origin) {
      return;
    }

    const { data } = event;

    if (data?.source !== 'statamic-visual-editor') {
      return;
    }

    // Entry form finished booting — flush any preview click held while it loaded.
    if (data.type === 'sve-section-panel-ready') {
      const panel = win.document.getElementById(sve.GLOBAL_SECTION_PANEL_ID);

      if (panel && event.source === panel.querySelector('iframe')?.contentWindow) {
        sve.flushPendingFocusUntilPanel(win);
        // The rebuild is done — this is the first moment the form is worth
        // looking at, so it is the moment it becomes visible.
        sve.revealSectionPanelFrame(win);
      }

      return;
    }

    if (data.type !== 'sve-section-values') {
      return;
    }

    const panel = win.document.getElementById(sve.GLOBAL_SECTION_PANEL_ID);

    if (!panel || event.source !== panel.querySelector('iframe')?.contentWindow) {
      return;
    }

    applySectionValues(win, data.id, data.values);
  });
}

/**
 * What the synced section's form now holds — however it was read.
 *
 * The docked panel posts it up; edited in this window it is read straight off the
 * form's own publish container. Both arrive here, so the baseline, the Save
 * button and the preview stash are decided in one place.
 */
export function applySectionValues(win, id, values) {
  // Kept so the panel can stand in as a container — that's what lets a global
  // section's text be edited inline in the page (see sve.sectionPanelContainer).
  sveState.sectionPanelValues = { id, values };

  // Inline edit / focus clicked before hydrate finished — try again now.
  sve.flushPendingEditUntilPanel();
  sve.flushPendingFocusUntilPanel(win);

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
    sve.notifyGlobalSectionDirty(win);

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

  sve.notifyGlobalSectionDirty(win);
  sve.postSectionValues(win, id, values);
}

export function listenForGlobalsValues(win) {
  win.addEventListener('message', (event) => {
    if (event.origin !== win.location.origin) {
      return;
    }

    const { data } = event;

    // Theme Settings (iframe) → sektionens Theme Color Picker-swatches.
    // Color-scheme dispatches også direkte på top; dette fanger postMessage.
    if (data?.source === 'statamic-visual-editor' && data.type === 'sve-theme-scale-values' && data.values) {
      win.dispatchEvent(new CustomEvent('sve-theme-colors', { detail: data.values }));

      return;
    }

    if (data?.source !== 'statamic-visual-editor' || data.type !== 'sve-globals-values') {
      return;
    }

    const panel = win.document.getElementById(sve.GLOBALS_PANEL_ID);

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
    if (!sve.globalsAcceptValues) {
      return;
    }

    const serialized = JSON.stringify(data.values ?? {});

    // Tab-lock / remount after entering chrome mutates the form once — treat as baseline, not dirty.
    if (sve.activeChromeKind && Date.now() < sve.chromeIgnoreValuePostsUntil) {
      sveState.chromeValuesBaseline = serialized;

      return;
    }

    if (sve.activeChromeKind && sveState.chromeValuesBaseline !== null && serialized === sveState.chromeValuesBaseline) {
      return;
    }

    // Show Save on the chrome bar immediately (stash POST is still debounced).
    sveState.globalsStashActive = true;
    sve.notifyChromeDirty(win);

    sve.postGlobals(win, data.handle, data.values);
  });
}



sve.CHROME_HOST_ID = CHROME_HOST_ID;
sve.CHROME_CONTAINER = CHROME_CONTAINER;
Object.defineProperty(sve, 'chromeApp', { get() { return chromeApp; }, set(v) { chromeApp = v; } });
Object.defineProperty(sve, 'chromeInlineKind', { get() { return chromeInlineKind; }, set(v) { chromeInlineKind = v; } });
Object.defineProperty(sve, 'chromeInlineHandle', { get() { return chromeInlineHandle; }, set(v) { chromeInlineHandle = v; } });
Object.defineProperty(sve, 'chromeValuesTimer', { get() { return chromeValuesTimer; }, set(v) { chromeValuesTimer = v; } });
sve.chromeHost = chromeHost;
sve.chromeEditorOpen = chromeEditorOpen;
sve.chromeContainer = chromeContainer;
sve.inertiaPageResolver = inertiaPageResolver;
sve.mountChromeForm = mountChromeForm;
sve.chromeTabButton = chromeTabButton;
sve.activeChromeTabPanel = activeChromeTabPanel;
sve.soleChromePanel = soleChromePanel;
sve.soloChromeTab = soloChromeTab;
sve.watchChromeSolo = watchChromeSolo;
sve.chromeInlinePages = chromeInlinePages;
sve.takeChromeInlinePage = takeChromeInlinePage;
sve.prefetchOtherChromeHalf = prefetchOtherChromeHalf;
sve.warmChromeInlinePages = warmChromeInlinePages;
sve.resetChromeInlinePages = resetChromeInlinePages;
sve.openChromeInline = openChromeInline;
sve.openGlobalsPanelFrameForChrome = openGlobalsPanelFrameForChrome;
sve.bootChromeSolo = bootChromeSolo;
sve.watchChromeInlineValues = watchChromeInlineValues;
sve.stopChromeInlineValues = stopChromeInlineValues;
sve.pressChromeSave = pressChromeSave;
sve.watchChromeInlineSaves = watchChromeInlineSaves;
sve.closeChromeInline = closeChromeInline;
sve.listenForSectionValues = listenForSectionValues;
sve.applySectionValues = applySectionValues;
sve.listenForGlobalsValues = listenForGlobalsValues;
