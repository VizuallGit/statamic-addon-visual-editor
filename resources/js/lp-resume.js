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
 * - the section open in the sidebar, by putting the preview click that opens a
 *   section through the same listeners a real one goes through.
 * - its Content/Style segment and its open accordion, by clicking them.
 *
 * One reading, written once, read once: the key is gone the moment the new
 * editor reads it, and a reading older than a minute or for another page is
 * not used.
 */
import { MSG, SOURCE } from './lib/protocol.js';
import { register } from './cp/bus.js';
import { sveState } from './cp-state.js';
import { FOCUS_HEADER_ID } from './lib/ids.js';
import {
  SECTION_ACTIVE_ATTR as ACTIVE_ATTR,
  SECTION_PANEL_ATTR as PANEL_ATTR,
  SECTION_PANEL_HEAD_ATTR as PANEL_HEAD_ATTR,
  SECTION_PANEL_OPEN_ATTR as PANEL_OPEN_ATTR,
  SECTION_SEG_ATTR as SEG_ATTR,
  sectionFieldLists,
} from './cp-section-groups.js';

const KEY = 'sve-lp-resume';

/** A reading older than this is from some other visit. */
const MAX_AGE_MS = 60000;

/** How long the new editor keeps putting the scroll back after it is shown. */
const HOLD_AFTER_READY_MS = 1500;

/** How long it waits for the section, its segment and its accordion to be there. */
const FOCUS_WAIT_MS = 10000;

/** A new editor that never says it is shown stops being held after this. */
const HOLD_MAX_MS = 20000;

/**
 * Timers, not animation frames: the new editor boots in a frame that is not
 * shown yet, and a frame nobody sees gets no animation frames to run in.
 */
const TICK_MS = 16;

const PREVIEW_ID = 'live-preview-iframe';

/** The set the focus panel is showing (focus-panel.js FOCUS_SET_ATTR). */
const FOCUS_SET = '[data-sve-focus-set]';

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

/**
 * The open set's own field list — the one its segments and accordions belong
 * to. Not the first list on show: the sections around a nested block are on
 * show too, as the frame it stands in.
 */
function focusList(doc) {
  const setEl = doc.querySelector(FOCUS_SET);

  return setEl ? sectionFieldLists(setEl).find((el) => el.hasAttribute(ACTIVE_ATTR)) || null : null;
}

/**
 * A control of the open set's own — never one of a block nested in it, whose
 * segments and accordions go by the same names. On show, and either inside the
 * set's own list or in the focus header, where the panel moves the set's
 * segment control.
 */
function ownControl(doc, list, selector) {
  const header = doc.getElementById(FOCUS_HEADER_ID);

  return [...doc.querySelectorAll(`.live-preview-editor ${selector}`)].find((el) =>
    el.getBoundingClientRect().width > 0 &&
    (el.closest(`[${ACTIVE_ATTR}]`) === list || header?.contains(el))
  ) || null;
}

/** Is the panel showing one set (the focus header is up), rather than the page's list? */
function showingOne(doc) {
  return !!doc.getElementById(FOCUS_HEADER_ID);
}

/** Write down where the editor is. Called right before the reload button's load. */
export function rememberWhereWeAre(win) {
  const doc = win.document;
  const solo = showingOne(doc) ? sveState.soloUid || null : null;
  const list = solo ? focusList(doc) : null;
  const reading = {
    path: win.location.pathname,
    at: Date.now(),
    scroll: readScroll(previewWindow(doc)),
    solo,
    segment: list?.getAttribute(ACTIVE_ATTR) || '',
    panel: list?.getAttribute(PANEL_OPEN_ATTR) || '',
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

/** Wait for `find` to return something, checked every tick, for at most `ms`. */
function when(win, find, ms) {
  return new Promise((resolve) => {
    const until = Date.now() + ms;

    const look = () => {
      const found = find();

      if (found || Date.now() > until) {
        resolve(found || null);

        return;
      }

      win.setTimeout(look, TICK_MS);
    };

    look();
  });
}

/**
 * Open the section again — as a click on it in the preview does. The message
 * comes from the preview's own window, so every listener that checks where a
 * click came from takes it for one.
 */
async function reopen(win, reading) {
  const doc = win.document;

  // The preview has to have drawn its sections, and the sidebar to be there to open one in.
  const pwin = await when(win, () => {
    const p = previewWindow(doc);

    try {
      return p?.document?.querySelector('[id^="id-"]') && doc.querySelector('[data-sve-lite]') ? p : null;
    } catch {
      return null;
    }
  }, FOCUS_WAIT_MS);

  if (!pwin) {
    return;
  }

  win.dispatchEvent(new MessageEvent('message', {
    data: { source: SOURCE, type: MSG.CLICK, uid: reading.solo },
    origin: win.location.origin,
    source: pwin,
  }));

  if (!reading.segment && !reading.panel) {
    return;
  }

  // The segment control and the accordions are built once the set's fields are,
  // and only the open set's are on show once the panel shows it alone.
  const list = await when(win, () => {
    const l = showingOne(doc) ? focusList(doc) : null;

    return l && (!reading.segment || l.querySelector(`[${SEG_ATTR}="${reading.segment}"]`)) ? l : null;
  }, FOCUS_WAIT_MS);

  if (!list) {
    return;
  }

  if (reading.segment && list.getAttribute(ACTIVE_ATTR) !== reading.segment) {
    ownControl(doc, list, `[${SEG_ATTR}="${reading.segment}"]`)?.click();
  }

  if (reading.panel && list.getAttribute(PANEL_OPEN_ATTR) !== reading.panel) {
    // The accordion is on show once its segment is.
    const head = await when(win, () => ownControl(doc, list, `[${PANEL_ATTR}="${reading.panel}"] [${PANEL_HEAD_ATTR}]`), FOCUS_WAIT_MS);

    head?.click();
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

  return reading.solo ? reopen(win, reading) : undefined;
}

// Asked by the shell once the preview has painted, before the new editor is
// shown — so it is shown where the author was, not on its way there.
register('lp:resume', () => resumeWhereWeWere(window));
