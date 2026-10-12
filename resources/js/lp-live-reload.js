/**
 * Live reload in Live Preview: a file saved outside the editor — Cursor over
 * SSH, a deploy, any other process — reaches the preview by itself.
 *
 * The editor already writes the code: the dock saves the template, Site
 * Files saves a stylesheet, and each of them renders the preview again. This
 * is the other direction. While Live Preview is open, the same poll the
 * public page's live-reload button uses (`/!/sve/live-reload`, long-polled:
 * the server holds the request until something differs) is asked with the
 * signatures we hold. When the markup changed and the editor did not write
 * it, the page is rendered again from the values as they stand — the Shift+
 * click of the reload button, `refreshInPlaceShown`, never a reload of the
 * document, which would eject Live Preview. When the build changed, the
 * built stylesheet is swapped into the page, as the Stylesheets panel does
 * after its own save; new JS waits for the next open.
 *
 * The editor's own saves are told apart on the server: every write through
 * `/!/sve/*` stamps the markup signature it leaves behind for this session
 * (`RecordEditorWrite`), and the answer says `own`. Nothing here watches the
 * dock, so a save path added later is covered without a change here.
 *
 * Off unless the site's `live_reload` setting is on for this user
 * (`sveFeatures.live_reload`, which the server already narrows to the
 * audience the setting names — and which a PHP older than this bundle does
 * not send at all: then there is no endpoint to ask, and nothing runs). One loop per window; it ends when the Live
 * Preview header is gone.
 *
 * Feature module: imports lp-reload.js (the refresh) and lib/; the stylesheet
 * swap (`swapSiteCss`, the Theme panel's) is loaded when a build first lands,
 * so Live Preview opens with the same chunks as before. No kernel, no bus
 * registration.
 */
import { lpHeader } from './lib/live-preview.js';
import { featureSaidOn } from './lib/config.js';
import { pageDocuments } from './lib/preview-frame.js';
import { nextStep, statusUrl } from './lib/live-reload.js';
import { refreshInPlaceShown } from './lp-reload.js';

const ENDPOINT = '/!/sve/live-reload';

/** Between two polls when the last answered with no change (the server held it already). */
const AGAIN_MS = 100;
/** While the tab is hidden: nothing to show, ask now and then whether it is back. */
const HIDDEN_MS = 1000;
/** After a failed request. */
const OFFLINE_MS = 3000;
/** After a 401/403: signed out, or the setting switched off for this user. */
const REFUSED_MS = 30000;

/** One loop per window. */
const loops = new WeakMap();

function sleep(win, ms) {
  return new Promise((resolve) => win.setTimeout(resolve, ms));
}

/** Live Preview is open in this window and the feature is on for this user. */
function alive(win) {
  return !!lpHeader(win.document) && featureSaidOn(win, 'live_reload');
}

async function fetchStatus(win, have, signal) {
  const response = await win.fetch(statusUrl(ENDPOINT, have), {
    credentials: 'same-origin',
    cache: 'no-store',
    // As XHR: a plain GET would become the session's "previous URL", where
    // a redirect back from the Control Panel then lands.
    headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
    signal,
  });

  if (response.status === 401 || response.status === 403) {
    return { refused: true };
  }

  if (!response.ok) {
    throw new Error(String(response.status));
  }

  return response.json();
}

/**
 * Render the page again, once for every change that arrived while a refresh
 * ran. `refreshInPlaceShown` refuses a second run while one is going — the
 * change that came in the meantime would be lost — so it is asked again
 * after, as long as something came in.
 */
async function refresh(win, loop) {
  loop.wanted = true;

  if (loop.refreshing) {
    return;
  }

  loop.refreshing = true;

  try {
    while (loop.wanted) {
      loop.wanted = false;

      if (!(await refreshInPlaceShown(win))) {
        // The button's own refresh is running. Wait for it, then run ours:
        // what it fetched may predate the change.
        await sleep(win, 500);
        loop.wanted = true;
      }
    }
  } finally {
    loop.refreshing = false;
  }
}

async function run(win, loop) {
  let have = null;

  while (alive(win) && loops.get(win) === loop) {
    if (win.document.hidden) {
      await sleep(win, HIDDEN_MS);
      continue;
    }

    let answer;

    try {
      answer = await fetchStatus(win, have, loop.controller.signal);
    } catch {
      if (loop.controller.signal.aborted) {
        return;
      }

      await sleep(win, OFFLINE_MS);
      continue;
    }

    if (answer.refused) {
      await sleep(win, REFUSED_MS);
      continue;
    }

    const step = nextStep(have, answer);

    have = step.have;

    if (step.css) {
      const { swapSiteCss } = await import('./cp/theme-panel/utility-paint.js');

      pageDocuments(win).forEach((doc) => swapSiteCss(doc, step.css));
    }

    if (step.refresh) {
      void refresh(win, loop);
    }

    await sleep(win, AGAIN_MS);
  }
}

/**
 * Called from syncLpRightBarGaps on every pass, like the reload button: the
 * one place that runs in every state the editor can open in. Starts the loop
 * when Live Preview is open and the feature is on; the loop ends itself when
 * the header goes, and the next open starts a new one.
 */
export function ensureLpLiveReload(win) {
  const loop = loops.get(win);

  if (loop) {
    if (!alive(win)) {
      loop.controller.abort();
      loops.delete(win);
    }

    return;
  }

  if (!alive(win)) {
    return;
  }

  const next = { controller: new win.AbortController(), refreshing: false, wanted: false };

  loops.set(win, next);

  void run(win, next).finally(() => {
    if (loops.get(win) === next) {
      loops.delete(win);
    }
  });
}
