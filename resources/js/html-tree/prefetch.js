/**
 * html-tree.js — every section's markup, fetched in a quiet moment.
 * Split out of html-tree.js in the quality pass (tab G): the same statements, in the same
 * order; only the imports are new. html-tree.js re-exports this file.
 */
import { t } from '../lib/i18n.js';
import { sveState } from '../cp-state.js';
import { ask } from '../cp/bus.js';
import { htmlTreeUi } from '../cp/html-tree/store.js';
import { htmlTreeAheadOfDock, sectionRootTagOf } from './sections.js';
import { renderHtmlTree } from './render.js';
import { htmlTreeFetching, htmlTreeGuessedTags, htmlTreeTemplates } from './state.js';

export function dockHtml() {
  const html = ask('dock:html');

  return typeof html === 'string' ? html : '';
}

export function dockIsOpen(doc) {
  return !!ask('dock:is-open', doc);
}

export function writeDockHtml(html, { save = false, unlock = false } = {}) {
  // Every edit the tree makes comes through here, and every one of them is
  // built from offsets into the rows on screen. While those rows come from the
  // cache, the dock holds a different file at those offsets — so this is the
  // one place that has to refuse, and it covers all of them.
  if (htmlTreeAheadOfDock()) {
    return false;
  }

  if (ask('dock:set-html', unlock ? { html, unlock: true } : html) !== true) {
    return false;
  }

  // A value from a form is finished when the form reports it, so it goes to
  // disk now — with autosave off, it otherwise sat in the pane as "Unsaved"
  // until the component was left, and the preview showed nothing of it.
  if (save) {
    ask('dock:save-now');
  }

  return true;
}

/**
 * The bar at the foot of the pane while a component is open.
 *
 * A component is a file you go *into*, and until now the only way back out was
 * the arrow in the dock's path row or clicking some other section — neither of
 * which says "you are inside something". This does, and it names it.
 *
 * One button, and it saves on the way out — both roads out of a component
 * flush first, so there is no unsaved-changes case for a second button to
 * cover. The hover says so, and says where leaving lands you.
 */
export function paintComponentExit(win) {
  const state = ask('dock:component-exit-state') || {};

  htmlTreeUi.exitOpen = !!state.open;

  if (!state.open) {
    htmlTreeUi.onExit = null;

    return;
  }

  htmlTreeUi.exitName = state.name || '';
  htmlTreeUi.exitLabel = t(win, 'component_exit');
  htmlTreeUi.exitTitle = t(win, state.back ? 'component_exit_back' : 'component_exit_close');
  htmlTreeUi.onExit = () => {
    ask('dock:exit-component');
    renderHtmlTree(win);
  };
}

/** Types waiting to be fetched, and whether the queue is moving. */
export const htmlTreePrefetch = [];
let htmlTreePrefetching = false;

/** The next quiet moment, or very soon if the browser never gets one. */
function whenIdle(win, run) {
  if (typeof win.requestIdleCallback === 'function') {
    win.requestIdleCallback(run, { timeout: 2000 });

    return;
  }

  win.setTimeout(run, 200);
}

/**
 * Fetch the markup of every section on the page, once each — one at a time.
 *
 * A queue, not a burst. Firing them together was measured at fourteen requests
 * leaving at once on a page with fourteen sections: 87 KB of markup that cost
 * eleven seconds of server time, because PHP serves a handful at a time and the
 * rest wait. Everything else waited with them — the preview's own render, and
 * `chrome-prefs`, which sat for 1.14s doing nothing but queueing.
 *
 * The point of fetching early is that clicking a section shows its tags at
 * once; that holds whether the markup arrives in one second or in ten, as long
 * as it is there before the click. So: one request in flight, each starting on
 * an idle moment, and the page is left alone while it is still being drawn.
 *
 * Failures are dropped — a section whose template is missing simply opens the
 * slow way.
 */
export function prefetchSectionTemplates(win, sections) {
  for (const section of sections) {
    const type = section.type;

    if (!type || htmlTreeTemplates.has(type) || htmlTreeFetching.has(type) || htmlTreePrefetch.includes(type)) {
      continue;
    }

    htmlTreePrefetch.push(type);
  }

  // Queue during overlay boot; do not fetch until the preview has painted.
  // The open section is already in the dock — these requests are for the rest.
  if (!sveState.htmlTreePrefetchArmed) {
    return;
  }

  runSectionTemplatePrefetch(win);
}

export function armHtmlTreePrefetch(win) {
  sveState.htmlTreePrefetchArmed = true;
  runSectionTemplatePrefetch(win);
}

function runSectionTemplatePrefetch(win) {
  if (htmlTreePrefetching || !htmlTreePrefetch.length) {
    return;
  }

  htmlTreePrefetching = true;

  const next = () => {
    const type = htmlTreePrefetch.shift();

    if (!type) {
      htmlTreePrefetching = false;

      return;
    }

    // Opened (or fetched) while it sat in the queue — nothing left to ask for.
    if (htmlTreeTemplates.has(type) || htmlTreeFetching.has(type)) {
      whenIdle(win, next);

      return;
    }

    htmlTreeFetching.add(type);
    win
      .fetch(`/!/sve/section-template?type=${encodeURIComponent(type)}`, {
        credentials: 'same-origin',
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
      })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (typeof data?.html === 'string') {
          htmlTreeTemplates.set(type, data.html);

          // A shut row drawn before its file came, from the server's reading at
          // load, and the file has been edited since: draw what it says now.
          const guessed = htmlTreeGuessedTags.get(type);
          htmlTreeGuessedTags.delete(type);
          const wrongTag = !!guessed && guessed !== sectionRootTagOf(win, type);

          if (wrongTag) {
            renderHtmlTree(win);
          }
        }
      })
      .catch(() => {})
      .finally(() => {
        htmlTreeFetching.delete(type);
        whenIdle(win, next);
      });
  };

  whenIdle(win, next);
}
