/**
 * Keeps the Patterns panel's pictures current — by itself or on the save
 * button, the way the HTML dock saves: automatic or manual, one toggle per
 * user (`sve-previews-auto`; the site's `previews_autowatch` setting is the
 * default for somebody who never chose).
 *
 * Only what changed is ever retaken: the server compares fingerprints
 * (PreviewFingerprint), so a theme colour or font makes every picture stale,
 * an edit to one section's template that one, and nothing else is touched.
 *
 * - Automatic: once a minute while Live Preview is open and the tab is
 *   visible, one cheap check (a fingerprint comparison, no browser) that
 *   starts a run when something is stale — at most one run a minute however
 *   fast a template is being edited, so Live Preview keeps its speed.
 * - Manual: the save button starts the run now (`update`), waits for it and
 *   says what came of it.
 *
 * A run is followed with `probe` checks, which never start one, until it is
 * done; then an open panel fetches its pictures again. One loop per window,
 * started from the Live Preview header (lp-panel.js) and ended when it goes.
 *
 * Feature module: lib/, chrome-prefs. No kernel, no bus.
 */
import { t } from './lib/i18n.js';
import { csrfToken } from './lib/csrf.js';
import { featureSaidOn } from './lib/config.js';
import { lpHeader } from './lib/live-preview.js';
import { SECTION_PICKER_ID } from './lib/ids.js';
import { chromeGet, chromeSet } from './chrome-prefs.js';

export const PREVIEWS_AUTO_KEY = 'sve-previews-auto';

/** Between two automatic checks. */
const AUTO_MS = 60000;
/** Between two checks while a run is under way. */
const FOLLOW_MS = 3000;

/** Per window: the loop, and the check in flight (never two at once). */
const watches = new WeakMap();

function sleep(win, ms) {
  return new Promise((resolve) => win.setTimeout(resolve, ms));
}

function watchOf(win) {
  let watch = watches.get(win);

  if (!watch) {
    // serverAuto: false once the server says its automatic refreshes are off
    // (`previews.auto`) — then there is nothing automatic to switch on.
    // lastStale: what the last check counted, to notice someone else's run.
    watch = { looping: false, check: null, serverAuto: null, lastStale: 0 };
    watches.set(win, watch);
  }

  return watch;
}

/** Automatic, unless this user switched it off — or never chose and the site says off. */
export function previewsAuto(win) {
  if (watchOf(win).serverAuto === false) {
    return false;
  }

  const saved = chromeGet(win, PREVIEWS_AUTO_KEY);

  if (saved === '1' || saved === '0') {
    return saved === '1';
  }

  return featureSaidOn(win, 'previews_autowatch');
}

export function setPreviewsAuto(win, on) {
  chromeSet(win, PREVIEWS_AUTO_KEY, on ? '1' : '0');
}

/**
 * One question to the server. `mode`: undefined (start a run when something
 * is stale), 'update' (the button: start it now) or 'probe' (never start one).
 * Null when the request failed.
 */
export function previewTick(win, mode) {
  const url = mode ? `/!/sve/previews/tick?${mode}=1` : '/!/sve/previews/tick';

  return win
    .fetch(url, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRF-TOKEN': csrfToken(win),
        Accept: 'application/json',
      },
    })
    .then((res) => (res.ok ? res.json() : null))
    .catch(() => null);
}

/** The Patterns panel's two buttons, painted from what the server said. */
export function paintPreviewButtons(win, { busy, stale } = {}) {
  const panel = win.document.getElementById(SECTION_PICKER_ID);
  const autoBtn = panel?.querySelector('[data-sve-previews-auto]');
  const saveBtn = panel?.querySelector('[data-sve-previews-refresh]');

  if (!autoBtn || !saveBtn) {
    return;
  }

  const auto = previewsAuto(win);
  const watch = watchOf(win);
  const working = busy ?? !!watch.check;

  autoBtn.hidden = watch.serverAuto === false;
  autoBtn.setAttribute('aria-pressed', auto ? 'true' : 'false');
  autoBtn.title = t(win, auto ? 'previews_auto_on' : 'previews_auto_off');
  autoBtn.setAttribute('aria-label', autoBtn.title);
  saveBtn.hidden = auto;

  for (const btn of [autoBtn, saveBtn]) {
    if (working) {
      btn.setAttribute('data-sve-busy', '');
    } else {
      btn.removeAttribute('data-sve-busy');
    }
  }

  if (stale !== undefined) {
    if (stale > 0) {
      saveBtn.setAttribute('data-dirty', '');
    } else {
      saveBtn.removeAttribute('data-dirty');
    }
  }
}

/**
 * One check, followed to the end of the run it found or started. Resolves
 * `{ first, last }` (the first and the final answer), or null when the
 * server could not be asked. A check already in flight is joined — except by
 * the save button, which waits for it and then asks for its own run.
 */
export function checkPreviews(win, mode) {
  const watch = watchOf(win);

  if (mode === 'update') {
    // Busy from the click, not from the answer: a second click in between
    // must not ask again.
    paintPreviewButtons(win, { busy: true });
  }

  if (watch.check) {
    return mode === 'update' ? watch.check.then(() => checkPreviews(win, mode)) : watch.check;
  }

  watch.check = (async () => {
    const first = await previewTick(win, mode);

    if (!first) {
      return null;
    }

    watch.serverAuto = first.auto !== false;
    paintPreviewButtons(win, { busy: first.running, stale: first.stale });

    let last = first;

    // Followed while Live Preview is open; closing it ends the following,
    // not the run.
    while (last.running && lpHeader(win.document)) {
      await sleep(win, FOLLOW_MS);

      const next = await previewTick(win, 'probe');

      if (!next) {
        break;
      }

      last = next;
    }

    // The pictures on disk are new — after a run this check followed, or
    // when what was stale is current now (a run somebody else started): an
    // open panel fetches them again.
    if (first.running || (watch.lastStale > 0 && last.stale === 0)) {
      win.document
        .getElementById(SECTION_PICKER_ID)
        ?.dispatchEvent(new win.CustomEvent('sve-library-preview-ready'));
    }

    watch.lastStale = last.stale;
    paintPreviewButtons(win, { busy: last.running, stale: last.stale });

    return { first, last };
  })().finally(() => {
    watch.check = null;
    paintPreviewButtons(win, { busy: false });
  });

  return watch.check;
}

async function run(win) {
  const watch = watchOf(win);

  watch.looping = true;

  try {
    while (lpHeader(win.document)) {
      if (previewsAuto(win) && win.document.visibilityState !== 'hidden') {
        await checkPreviews(win);
      }

      await sleep(win, AUTO_MS);
    }
  } finally {
    watch.looping = false;
  }
}

/**
 * Called wherever the Live Preview header is synchronised (lp-panel.js), so
 * it runs in every state the editor opens in. Idempotent: one loop per
 * window, ending when the header goes; the next open starts a new one.
 */
export function ensureLpPreviewWatch(win) {
  const watch = watchOf(win);

  if (watch.looping || !lpHeader(win.document)) {
    return;
  }

  void run(win);
}
