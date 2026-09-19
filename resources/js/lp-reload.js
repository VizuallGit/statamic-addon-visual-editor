/**
 * Fetch everything again, without leaving Live Preview.
 *
 * Most of what the editor shows was fetched once and kept: the section library's
 * lists, each set's meta and field definitions, the header and footer screens,
 * every section template the HTML tree pulled in, the data picker's lists. That
 * is the right default — they rarely change while you work — but when they do
 * change under you (a field added to a fieldset, a template edited on disk),
 * the editor keeps showing what it had.
 *
 * So: one button that drops every kept answer, asks for the ones the page needs
 * now, and has the preview render itself again — in place. No navigation, no
 * still of the preview, no editor booting again. When it is done the icon turns
 * into a green check for a moment: everything is up to date.
 *
 * What it deliberately does NOT touch is the publish form's values. They are the
 * author's unsaved work, they are what the preview renders from, and nothing
 * here is worth losing them for. The preview is replayed from those same values,
 * so a page half-edited comes back half-edited.
 *
 * What it cannot do is change the page's own blueprint: Statamic builds the
 * publish form from it at page load, so a tab or a field added to the *page*
 * (not to a section's fieldset) is only there after a real load. Shift+click
 * is that load — the page picker's own move, aimed at the page we are on —
 * and it is exactly what a plain click did before 19 September 2026.
 */
import { t } from './lib/i18n.js';
import { ask } from './cp/bus.js';
import { LP_ICON_BTN_STYLE } from './cp.js';
import { injectStyle } from './lib/style.js';
import { lpHeader } from './lib/live-preview.js';
import { HEADER_SURFACE, LP_BACK_ID, LP_CHROME_H, LP_RELOAD_ID, SECTION_PICKER_ID } from './lib/ids.js';
import { sectionField } from './lib/config.js';
import { dataGet, unwrapRef } from './lib/values.js';
import { activeContainers } from './lib/publish-containers.js';
import { navigateFromLp } from './pages.js';
import { resetChromeInlinePages } from './chrome.js';
import { libraryWentStale, refreshSectionTypes, sectionMetaCache } from './section-library.js';
import { clearHtmlTreeTemplates, renderHtmlTree } from './lazy/html-tree.js';

// No static import of section-fields: it is reached only from the HTML tree's
// lazy chunk today, and importing it here — from a file the Control Panel
// loads on every page — would pull it and the fieldset overlay into the main
// bundle. A dynamic import at the moment the button is pressed keeps it out.

/**
 * Both icons live in the button at once; `data-done` on the button decides
 * which one shows. Kept as one constant because ensureLpReloadButton() compares
 * innerHTML against it on every observer pass — a second markup would be put
 * back to the first on the next pass. Every attribute carries a value so the
 * browser's serialisation matches the string exactly.
 */
const LP_RELOAD_ICON_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" ' +
  'stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-icon="reload">' +
  '<path d="M21 12a9 9 0 1 1-2.64-6.36"></path>' +
  '<polyline points="21 3 21 9 15 9"></polyline>' +
  '</svg>' +
  '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" ' +
  'stroke="#16a34a" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-icon="done">' +
  '<polyline points="20 6 9 17 4 12"></polyline>' +
  '</svg>';

const SPIN_STYLE_ID = '__sve-lp-reload-style';

/** How long the green check stays before the reload icon comes back. */
const DONE_MS = 2500;

let running = false;
let doneTimer = 0;

function ensureSpinStyle(doc) {
  injectStyle(doc, SPIN_STYLE_ID, `@keyframes sve-lp-reload-spin{to{transform:rotate(360deg)}}`
    + `#${LP_RELOAD_ID}[data-busy] svg[data-icon="reload"]{animation:sve-lp-reload-spin .9s linear infinite;transform-origin:50% 50%}`
    + `#${LP_RELOAD_ID}[data-busy]{cursor:progress}`
    + `#${LP_RELOAD_ID} svg[data-icon="done"]{display:none}`
    + `#${LP_RELOAD_ID}[data-done] svg[data-icon="done"]{display:block}`
    + `#${LP_RELOAD_ID}[data-done] svg[data-icon="reload"]{display:none}`);
}

/** Every section type on the page, each once — what there is anything to refetch for. */
function typesOnPage(win) {
  const field = sectionField(win);
  const seen = new Set();

  for (const container of activeContainers(win.document)) {
    const rows = dataGet(unwrapRef(container.values), field);

    if (!Array.isArray(rows)) {
      continue;
    }

    for (const row of rows) {
      if (row && typeof row.type === 'string' && row.type) {
        seen.add(row.type);
      }
    }

    // The first container holding the page builder is the page; a second is
    // another form open beside it. Same reading as the HTML tree's.
    break;
  }

  return [...seen];
}

/**
 * Drop every kept answer and ask again, without leaving the page.
 *
 * Each step is a function the editor already runs on its own save paths:
 * Save in the fieldset overlay refreshes one set's fields and meta, a saved
 * global forgets the header and footer screens, a section saved into the
 * library marks it stale. This runs the lot, for every section type on the
 * page, and then has the preview render itself again from the values as they
 * stand.
 */
export async function refreshInPlace(win) {
  // The section templates the tree pulled in, and the meta cache behind every
  // panel. Dropped first: what follows has to ask the server, not answer from
  // what it already had. The tree's cache is only there when the tree has
  // loaded; the facade skips otherwise.
  clearHtmlTreeTemplates();
  sectionMetaCache.clear();

  // The header and footer screens, which are warmed once and then handed out.
  resetChromeInlinePages(win);

  // The library's lists (saved sections, templates, section types). An open
  // panel asks for its types again on the stale event; only when it is not
  // there is the list asked for here — refreshSectionTypes keeps a generation
  // counter, and a second call on top of the panel's own would throw the
  // panel's answer away.
  libraryWentStale(win);

  if (!win.document.getElementById(SECTION_PICKER_ID)) {
    refreshSectionTypes(win, () => {});
  }

  // The data picker's three tabs. No handle: every list goes.
  ask('dock:reset-data-vars');

  // Each section's fields and meta, one type at a time. Serial on purpose:
  // firing one request per type at once is what made opening Live Preview slow
  // enough to be worth fixing, and this is the same shape of work.
  const { refreshFieldsForType } = await import('./section-fields.js');

  for (const type of typesOnPage(win)) {
    try {
      await refreshFieldsForType(win, type);
    } catch {
      // A type whose fieldset has gone is not a reason to stop refreshing the
      // rest — it simply keeps what it had.
    }
  }

  // The panels that draw from the form's values rather than from the server.
  renderHtmlTree(win);

  // And the page itself, rendered again from the values as they stand. A
  // morph in the iframe — never a reload, which would eject Live Preview.
  ask('lp:replay', { win });
}

/**
 * Load the whole editor again — the page picker's own move, aimed back at the
 * page we are already on.
 *
 * `location.reload()` was the obvious version and the wrong one: it tears the
 * document down, so you get a blank screen, then the bare admin form, then
 * the editor booting again. `navigateFromLp` is what the picker in the top
 * bar calls — it puts a still of the current preview up first, asks about
 * unsaved work, and swaps the page in behind it. Same move, same look, only
 * the destination differs: here it is where we already are.
 *
 * Everything downstream of the load is new by definition: blueprint, fields,
 * meta, templates, the library, header and footer. Unsaved work goes with it
 * unless the unsaved-work question is answered with Save.
 *
 * `?live-preview=1` so the editor opens again on the other side; without it
 * the move lands on the plain entry screen.
 */
export function reloadEverything(win) {
  const url = new win.URL(win.location.href);

  url.searchParams.set('live-preview', '1');

  if (typeof navigateFromLp === 'function') {
    navigateFromLp(win, null, url.toString());

    return;
  }

  win.location.assign(url.toString());
}

function paintTitle(win, pill) {
  pill.title = pill.hasAttribute('data-done')
    ? t(win, 'reload_lp_done')
    : `${t(win, 'reload_lp_title')} · ${t(win, 'reload_lp_full_hint')}`;
  pill.setAttribute('aria-label', pill.title);
}

/** The green check for a moment, then the reload icon again. */
function showDone(win, pill) {
  win.clearTimeout(doneTimer);
  pill.setAttribute('data-done', '');
  paintTitle(win, pill);

  doneTimer = win.setTimeout(() => {
    pill.removeAttribute('data-done');
    paintTitle(win, pill);
  }, DONE_MS);
}

function onReloadClick(win, pill, event) {
  event.preventDefault();
  event.stopPropagation();

  if (running) {
    return;
  }

  running = true;
  win.clearTimeout(doneTimer);
  pill.removeAttribute('data-done');
  pill.setAttribute('data-busy', '');

  // Shift: the whole page, as before. Spins until the page goes — nothing
  // clears it, the document it is drawn in is the one being replaced.
  if (event.shiftKey) {
    try {
      reloadEverything(win);
    } catch {
      running = false;
      pill.removeAttribute('data-busy');
      win.Statamic?.$toast?.error(t(win, 'reload_lp_failed'));
    }

    return;
  }

  void refreshInPlace(win)
    .then(() => showDone(win, pill))
    .catch(() => win.Statamic?.$toast?.error(t(win, 'reload_lp_failed')))
    .finally(() => {
      running = false;
      pill.removeAttribute('data-busy');
    });
}

export function ensureLpReloadButton(win) {
  const doc = win.document;
  const header = lpHeader(doc);
  const back = doc.getElementById(LP_BACK_ID);

  if (!header || !back) {
    return;
  }

  ensureSpinStyle(doc);

  let pill = doc.getElementById(LP_RELOAD_ID);

  if (!pill) {
    pill = doc.createElement('button');
    pill.id = LP_RELOAD_ID;
    pill.type = 'button';
    pill.style.cssText = `${LP_ICON_BTN_STYLE}flex-shrink:0;`;
    pill.addEventListener('click', (event) => onReloadClick(win, pill, event));
  }

  if (pill.innerHTML !== LP_RELOAD_ICON_SVG) {
    pill.innerHTML = LP_RELOAD_ICON_SVG;
  }

  paintTitle(win, pill);
  pill.style.opacity = '1';
  pill.style.background = HEADER_SURFACE;
  pill.style.padding = '0';
  pill.style.width = `${LP_CHROME_H - 4}px`;
  pill.style.height = `${LP_CHROME_H}px`;
  pill.style.borderRadius = '.5rem';
  pill.style.marginLeft = '0';
  pill.style.marginRight = '0';

  // Right of Close, left of More. Never moved when it is already there: a
  // Node.after on every observer pass freezes Live Preview.
  if (pill.parentElement !== back.parentElement || pill.previousElementSibling !== back) {
    back.after(pill);
  }
}
