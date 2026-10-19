/**
 * Come back where you were after the reload button's load.
 *
 * The reload button loads the page again so that everything is new — the
 * blueprint, every fieldset, the icons on their tabs. A load also forgets where
 * the author was: the preview starts at the top, the sidebar on the page's list
 * of sections. Coming back somewhere else is the thing that makes a reload feel
 * like one, so the old editor writes down where it was, and the new one goes
 * there before anyone sees it.
 *
 * What is kept, and how it is put back:
 *
 * - the preview's scroll, as the section at the top of the viewport and how far
 *   into it — a section that grew or shrank in the reload is still the one on
 *   top. Put back on every preview document the new editor loads until it is
 *   shown, and once more after; the first wheel, key or pointer in the preview
 *   ends it.
 * - the row selected in the panel, selected again once the page's form has
 *   registered its context — the panel paints it from the values.
 *
 * One reading, written once, read once: the key is gone the moment the new
 * editor reads it, and a reading older than a minute or for another page is
 * not used.
 */
import { register } from './cp/bus.js';
import { sveState } from './cp-state.js';
import { currentSelection, select } from './lib/selection.js';
import { whenContainerContext } from './lib/publish-containers.js';

const KEY = 'sve-lp-resume';

/** A reading older than this is from some other visit. */
const MAX_AGE_MS = 60000;

/** How long the new editor keeps putting the scroll back after it is shown. */
const HOLD_AFTER_READY_MS = 1500;

/** How long it waits for the page's form to register its context. */
const CONTEXT_WAIT_MS = 10000;

/** A new editor that never says it is shown stops being held after this. */
const HOLD_MAX_MS = 20000;

/**
 * Timers, not animation frames: the new editor boots in a frame that is not
 * shown yet, and a frame nobody sees gets no animation frames to run in.
 */
const TICK_MS = 16;

const PREVIEW_ID = 'live-preview-iframe';


let resumed = false;

function previewWindow(doc) {
  try {
    return doc.getElementById(PREVIEW_ID)?.contentWindow || null;
  } catch {
    return null;
  }
}

/** The section shell (`<section id="id-…">`) at the top of the preview, and how far into it. */
function readScroll(pwin) {
  const pdoc = pwin?.document;

  if (!pdoc?.body) {
    return null;
  }

  const top = [...pdoc.querySelectorAll('[id^="id-"]')].find((el) => el.getBoundingClientRect().bottom > 0);

  return {
    id: top?.id || null,
    offset: top ? Math.round(-top.getBoundingClientRect().top) : 0,
    y: Math.round(pwin.scrollY),
  };
}

/** Write down where the editor is. Called right before the reload button's load. */
export function rememberWhereWeAre(win) {
  const doc = win.document;
  const selection = currentSelection();
  const reading = {
    path: win.location.pathname,
    at: Date.now(),
    scroll: readScroll(previewWindow(doc)),
    // A row of the page's own form; a header or a global section's form is
    // not mounted again by a reload, so there is nothing to put back there.
    uid: selection?.uid && (!selection.ctxName || selection.ctxName === 'base') ? selection.uid : null,
  };

  try {
    win.sessionStorage.setItem(KEY, JSON.stringify(reading));
  } catch {
    /* private mode: the reload still works, it just starts at the top */
  }
}

/** Forget the reading: the load it was for did not happen. */
export function forgetWhereWeAre(win) {
  try {
    win.sessionStorage.removeItem(KEY);
  } catch {
    /* private mode */
  }
}

/** The reading, once. */
function takeReading(win) {
  let raw = null;

  try {
    raw = win.sessionStorage.getItem(KEY);
    win.sessionStorage.removeItem(KEY);
  } catch {
    return null;
  }

  let reading = null;

  try {
    reading = raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }

  if (!reading || reading.path !== win.location.pathname || Date.now() - Number(reading.at) > MAX_AGE_MS) {
    return null;
  }

  return reading;
}

/** Scroll a preview document to the reading. True when it is there. */
function applyScroll(pwin, scroll) {
  const pdoc = pwin?.document;

  if (!pdoc?.body) {
    return false;
  }

  const el = scroll.id ? pdoc.getElementById(scroll.id) : null;

  if (scroll.id && !el) {
    return false; // not drawn yet
  }

  const target = el ? el.getBoundingClientRect().top + pwin.scrollY + scroll.offset : scroll.y;

  if (Math.abs(pwin.scrollY - target) > 1) {
    pwin.scrollTo({ top: target, behavior: 'instant' });
  }

  return Math.abs(pwin.scrollY - target) <= 1;
}

/**
 * Hold the preview's scroll at the reading while the new editor boots: the
 * preview document is loaded (and may be loaded again) before the editor is
 * shown, and each new document starts at the top.
 */
function holdScroll(win, scroll) {
  const doc = win.document;
  let stopped = false;
  let readyAt = 0;
  let watched = null;

  const stop = () => {
    stopped = true;
  };

  // The author's own scrolling ends it.
  const watchInput = (pwin) => {
    if (!pwin || watched === pwin) {
      return;
    }

    watched = pwin;

    for (const type of ['wheel', 'keydown', 'pointerdown', 'touchstart']) {
      pwin.addEventListener(type, stop, { once: true, passive: true, capture: true });
    }
  };

  const until = Date.now() + HOLD_MAX_MS;

  const tick = () => {
    if (stopped || Date.now() > until) {
      return;
    }

    if (sveState.lpReady && !readyAt) {
      readyAt = Date.now();
    }

    if (readyAt && Date.now() - readyAt > HOLD_AFTER_READY_MS) {
      return;
    }

    const pwin = previewWindow(doc);

    try {
      watchInput(pwin);
      applyScroll(pwin, scroll);
    } catch {
      /* the frame is between documents */
    }

    win.setTimeout(tick, TICK_MS);
  };

  tick();
}

/**
 * Select the row again, once the page's form has registered its context —
 * the panel paints it from the values the moment it is selected.
 */
async function reopen(win, reading) {
  const ctx = await whenContainerContext('base', CONTEXT_WAIT_MS, win);

  if (ctx) {
    select({ uid: reading.uid, source: 'resume' });
  }
}

/**
 * In the new editor: go back to the reading, if the last one was this page's.
 * Once per document. Settles when the section is open again (or when there is
 * nothing to open); the scroll goes on being held on its own.
 */
function resumeWhereWeWere(win) {
  if (resumed) {
    return undefined;
  }

  resumed = true;

  const reading = takeReading(win);

  if (!reading) {
    return undefined;
  }

  if (reading.scroll) {
    holdScroll(win, reading.scroll);
  }

  return reading.uid ? reopen(win, reading) : undefined;
}

// Asked by the shell once the preview has painted, before the new editor is
// shown — so it is shown where the author was, not on its way there.
register('lp:resume', () => resumeWhereWeWere(window));
