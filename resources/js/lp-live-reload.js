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
 * it, a saved template the dock has open goes into the dock as if typed
 * there — pane by pane, as the server split it (`handToDock`: the dock's own
 * Instant paint, autosave and render follow). A dock open on another
 * section of the page follows the saved section (`followSave`), so the next
 * save of it is a keystroke too. Anything else has the page rendered again
 * from the values as they stand — one render,
 * `refreshTemplatesShown` (the reload button spins meanwhile), never a reload
 * of the document, which would eject Live Preview, and not Shift+click's
 * whole refresh, whose six requests before the render are for fieldsets and
 * globals that did not change. When the build changed, the
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
 * Feature module: imports lp-reload.js (the refresh), lib/, the bus (the
 * dock takes a changed file it has open) and lazy-panels.js (the HTML tree,
 * loaded when the dock follows a save, for its `html-tree:open-section`);
 * the stylesheet
 * swap (`swapSiteCss`, the Theme panel's) is loaded when a build first lands,
 * so Live Preview opens with the same chunks as before. No kernel, no bus
 * registration.
 */
import { ask } from './cp/bus.js';
import { ensurePanel } from './lazy-panels.js';
import { lpHeader } from './lib/live-preview.js';
import { featureSaidOn, sectionField } from './lib/config.js';
import { activeContainers } from './lib/publish-containers.js';
import { unwrapRef } from './lib/values.js';
import { pageDocuments } from './lib/preview-frame.js';
import { nextStep, panesFor, statusUrl } from './lib/live-reload.js';
import { refreshTemplatesShown } from './lp-reload.js';

const ENDPOINT = '/!/sve/live-reload';

/** Between two polls when the last answered with no change (the server held it already). */
const AGAIN_MS = 100;
/** While the tab is hidden: nothing to show, ask now and then whether it is back. */
const HIDDEN_MS = 1000;
/**
 * After a failed request. The first failure is asked again at once
 * (RETRY_MS): a held poll whose PHP worker went away (nginx answers 502) is
 * no reason to miss a save by seconds — the next poll carries the same
 * signatures, so a change that landed meanwhile is answered straight away.
 * Failing again means the server is away; then the long wait.
 */
const RETRY_MS = 250;
const OFFLINE_MS = 3000;
/** After a 401/403: signed out, or the setting switched off for this user. */
const REFUSED_MS = 30000;

/** One loop per window. */
const loops = new WeakMap();

/**
 * What the loop decided, for the browser probe only: a window without
 * `__sveDebug` (lib/debug.js — the tests create it before any script runs)
 * records nothing, so a normal Control Panel pays one property read.
 */
function trace(win, what, data) {
  if (win.__sveDebug) {
    win.console.debug(`[sve live-reload] ${what} ${JSON.stringify(data ?? null)}`);
  }
}

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
 * ran. `refreshTemplatesShown` refuses a second run while one is going — the
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
      trace(win, 'render', null);

      if (!(await refreshTemplatesShown(win))) {
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

/**
 * The panes of a file the dock has open go into the dock as if they had been
 * typed there (`dock:set-html`, and `dock:set-css` / `dock:set-js` where
 * those changed too). From there it is the dock's own path, unchanged: the
 * Instant paint of the difference against the text the dock had, the
 * autosave (the same panes, stamped as the editor's own) and the render
 * after it. That is what makes a save in Cursor look like a keystroke in the
 * dock — and why nothing else paints: a whole file painted without the
 * dock's memory of the previous text put elements in the wrong place until
 * the render (v1.1.506–507, withdrawn).
 *
 * All or nothing: a lock or props that differ from the dock's are not a
 * keystroke, and the markup goes first because it is the one pane the dock
 * may refuse (the HTML tree's padlock). Refused, the dock still holds its
 * own text and the page is rendered; never the new CSS beside the old
 * markup, which the autosave would write over the file.
 */
function giveDock(panes) {
  if (ask('dock:is-locked') === true || panes.locked === true) {
    return false;
  }

  if (JSON.stringify(panes.props ?? []) !== JSON.stringify(ask('dock:props') ?? [])) {
    return false;
  }

  if (ask('dock:set-html', panes.html) !== true) {
    return false;
  }

  if (panes.css !== ask('dock:css')) {
    ask('dock:set-css', panes.css);
  }

  if (panes.js !== ask('dock:js')) {
    ask('dock:set-js', panes.js);
  }

  return true;
}

/**
 * True when every changed file was taken by the dock, so no render of ours
 * is needed; false when at least one was not (the dock shows another file,
 * is locked, the file is not one the dock opens) and the page has to be
 * rendered again.
 */
function handToDock(win, changed) {
  const open = String(ask('dock:current-type') || '');
  let rest = false;

  for (const file of changed || []) {
    const panes = panesFor(file, open);
    const taken = panes !== null && giveDock(panes);

    trace(win, 'hand-to-dock', { open, path: file?.path, type: file?.type ?? null, panes: !!file?.panes, taken });

    if (!taken) {
      rest = true;
    }
  }

  return !rest && (changed || []).length > 0;
}

/**
 * The visual id of the first row on this page drawn by `type`, read from the
 * publish form's values — the real source, not whether the sidebar has the
 * set mounted. '' when no row on the page is.
 */
function rowOfType(win, type) {
  const field = sectionField(win) || 'page_sections';

  for (const container of activeContainers(win.document) || []) {
    const rows = unwrapRef(container.values)?.[field];

    if (!Array.isArray(rows)) {
      continue;
    }

    for (const row of rows) {
      if (!row || typeof row !== 'object' || row.type !== type) {
        continue;
      }

      const uid = [row._visual_id, row.id, row._id].find((id) => typeof id === 'string' && id !== '');

      if (uid) {
        return uid;
      }
    }
  }

  return '';
}

/**
 * The dock is open on one section's file and another section's partial on
 * this page was saved from outside: that section is opened the way a click
 * on it opens it (the HTML tree's `html-tree:open-section` — the preview's
 * mark, the sidebar, the dock). The dock then holds the file as saved, so
 * this save shows with the render; the next save of the same file is a
 * keystroke in the dock. The dock alone is not switched (`dock:open-file`):
 * Instant paints into the section the preview has marked, which would still
 * be the other one.
 *
 * Only from one page section to another: a dock on the layout, the header,
 * a component or a collection view is where the reader is working, and
 * stays.
 */
async function followSave(win, changed) {
  const open = String(ask('dock:current-type') || '');

  if (!open || ask('dock:is-open', win.document) !== true || !rowOfType(win, open)) {
    return;
  }

  for (const file of changed || []) {
    if (!file?.panes || typeof file.type !== 'string' || file.type === open) {
      continue;
    }

    const uid = rowOfType(win, file.type);

    if (!uid) {
      continue;
    }

    await ensurePanel('html_tree');
    trace(win, 'follow', { type: file.type, uid, opened: !!ask('html-tree:open-section', uid) });

    return;
  }
}

async function run(win, loop) {
  let have = null;
  let failed = 0;

  while (alive(win) && loops.get(win) === loop) {
    if (win.document.hidden) {
      await sleep(win, HIDDEN_MS);
      continue;
    }

    let answer;

    try {
      answer = await fetchStatus(win, have, loop.controller.signal);
    } catch (error) {
      if (loop.controller.signal.aborted) {
        return;
      }

      failed += 1;
      trace(win, 'poll-failed', String(error?.message || error));
      await sleep(win, failed === 1 ? RETRY_MS : OFFLINE_MS);
      continue;
    }

    failed = 0;

    if (answer.refused) {
      await sleep(win, REFUSED_MS);
      continue;
    }

    const step = nextStep(have, answer);

    trace(win, 'answer', {
      markup: have ? answer.markup !== have.markup : 'baseline',
      own: answer.own,
      refresh: step.refresh,
      changed: (answer.changed || []).map((file) => `${file.path}:${typeof file.content === 'string' ? file.content.length : 'no content'}`),
    });
    have = step.have;

    if (step.css) {
      const { swapSiteCss } = await import('./cp/theme-panel/utility-paint.js');

      pageDocuments(win).forEach((doc) => swapSiteCss(doc, step.css));
    }

    if (step.refresh && !handToDock(win, step.changed)) {
      void refresh(win, loop);
      void followSave(win, step.changed);
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
