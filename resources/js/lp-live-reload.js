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
 * it, a saved template the dock has open goes into the dock's panes as the
 * file now on disk (`handToDock`: the dock paints the difference at once and
 * saves nothing), and the page is rendered again from the values as they
 * stand — one render, scoped to the section when the change is one
 * section's partial, `refreshTemplatesShown` (the reload button spins
 * meanwhile), never a reload of the document, which would eject Live
 * Preview, and not Shift+click's whole refresh, whose six requests before
 * the render are for fieldsets and globals that did not change. When the
 * build changed, the
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
 * Feature module: imports lp-reload.js (the refresh), lib/ and the bus (the
 * dock takes a changed file it has open); the stylesheet
 * swap (`swapSiteCss`, the Theme panel's) is loaded when a build first lands,
 * so Live Preview opens with the same chunks as before. No kernel, no bus
 * registration.
 */
import { ask } from './cp/bus.js';
import { lpHeader } from './lib/live-preview.js';
import { featureSaidOn } from './lib/config.js';
import { pageDocuments } from './lib/preview-frame.js';
import { dockTypeOf, nextStep, sectionTypesOf, statusUrl } from './lib/live-reload.js';
import { refreshTemplatesShown } from './lp-reload.js';

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
 * The section types two changes together can be scoped to: both lists
 * joined, or null (the whole page) as soon as either is.
 */
function joinTypes(a, b) {
  if (a === undefined) {
    return b;
  }

  if (a === null || b === null) {
    return null;
  }

  return [...new Set([...a, ...b])];
}

/**
 * Render the page again, once for every change that arrived while a refresh
 * ran. `refreshTemplatesShown` refuses a second run while one is going — the
 * change that came in the meantime would be lost — so it is asked again
 * after, as long as something came in. `types` (lib: `sectionTypesOf`) says
 * which sections the change is in, when it is only in sections; changes
 * that queue up are rendered together, scoped to all of them or to the
 * whole page as soon as one of them needs it.
 */
async function refresh(win, loop, types) {
  loop.wanted = true;
  loop.types = joinTypes(loop.types, types);

  if (loop.refreshing) {
    return;
  }

  loop.refreshing = true;

  try {
    while (loop.wanted) {
      loop.wanted = false;

      const scope = loop.types;

      loop.types = undefined;

      if (!(await refreshTemplatesShown(win, scope))) {
        // The button's own refresh is running. Wait for it, then run ours:
        // what it fetched may predate the change.
        await sleep(win, 500);
        loop.wanted = true;
        loop.types = joinTypes(loop.types, scope);
      }
    }
  } finally {
    loop.refreshing = false;
  }
}

/**
 * A changed file the dock has open goes into the dock's panes as the file
 * now on disk (`dock:take-file`): the server's split of it into HTML, CSS,
 * JS and baked utilities (`parts`), the way the dock loads a file. The dock
 * paints the difference against the text it had, the same frame, and saves
 * nothing — the file's one writer stays the editor that saved it. The
 * render is the caller's and follows for every change, taken or not.
 *
 * v1.1.508 handed the raw file to `dock:set-html`, as if typed. The autosave
 * that followed made the dock a second writer of a file open in Cursor: it
 * landed seconds later (after the Tailwind compile) over whatever Cursor had
 * saved meanwhile, and with `{{ sve_tw }}` appended once more each time,
 * because the raw file already carried the one the save writes. Measured on
 * Cuben: eight `{{ sve_tw }}` in one partial, and the probe's restore
 * overwritten three seconds after it.
 *
 * An empty file is never handed over: more likely a save caught halfway
 * than a file meant to be empty, and the dock would show nothing for it.
 *
 * True when the dock took at least one file.
 */
function handToDock(changed) {
  const open = String(ask('dock:current-type') || '');

  if (!open) {
    return false;
  }

  let taken = false;

  for (const file of changed || []) {
    const parts = file?.parts;

    if (dockTypeOf(file?.path) !== open || !parts || typeof parts.html !== 'string' || file.content === '') {
      continue;
    }

    if (ask('dock:take-file', { type: open, parts }) === true) {
      taken = true;
    }
  }

  return taken;
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
      // Scoped to the section only when the dock took the file: then that
      // section is the focused one, and the preview morphs it. With another
      // section focused (the dock on its file), a render scoped to a section
      // elsewhere on the page did not land (measured on Cuben: no paint in
      // 7 s); the whole page does, as it did before the scoping.
      const taken = handToDock(step.changed);

      void refresh(win, loop, taken ? sectionTypesOf(step.changed) : null);
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
