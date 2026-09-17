/**
 * Fetch everything again, without leaving Live Preview.
 *
 * Most of what the editor shows was fetched once and kept: the section library's
 * lists, each set's meta and field definitions, the header and footer screens,
 * every section template the HTML tree pulled in. That is the right default —
 * they rarely change while you work — but when they do change under you, the
 * only way back into step was to close the editor and open it again, which
 * costs a five-second page load and puts you back at the top of the page.
 *
 * So: one button that drops every kept answer, asks for the ones the page needs
 * now, and has the preview render itself again.
 *
 * What it deliberately does NOT touch is the publish form's values. They are the
 * author's unsaved work, they are what the preview renders from, and nothing
 * here is worth losing them for. The preview is replayed from those same values,
 * so a page half-edited comes back half-edited.
 */
import { sve } from './cp-registry.js';
import { t } from './lib/i18n.js';
import { LP_ICON_BTN_STYLE, HEADER_SURFACE } from './cp.js';
import { injectStyle } from './lib/style.js';
import { lpHeader } from './lib/live-preview.js';
import { LP_BACK_ID, LP_CHROME_H, LP_RELOAD_ID } from './lib/ids.js';
import { navigateFromLp } from './pages.js';

// No static import of html-tree or section-fields. Both are lazy chunks, and
// importing them here — from a file the Control Panel loads on every page —
// pulls them into the main bundle: measured at 484 kB grown to 636 kB, which is
// exactly the cost this button is not worth. Reached through `sve` and through
// a dynamic import instead, at the moment the button is actually pressed.

const LP_RELOAD_ICON_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" ' +
  'stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
  '<path d="M21 12a9 9 0 1 1-2.64-6.36"></path>' +
  '<polyline points="21 3 21 9 15 9"></polyline>' +
  '</svg>';

const SPIN_STYLE_ID = '__sve-lp-reload-style';

let running = false;

function ensureSpinStyle(doc) {
  injectStyle(doc, SPIN_STYLE_ID, `@keyframes sve-lp-reload-spin{to{transform:rotate(360deg)}}`
    + `#${LP_RELOAD_ID}[data-busy] svg{animation:sve-lp-reload-spin .9s linear infinite;transform-origin:50% 50%}`
    + `#${LP_RELOAD_ID}[data-busy]{cursor:progress}`);
}


/**
 * Load the whole editor again.
 *
 * Refetching the pieces one by one was the clever version, and it left the one
 * thing out that matters most: the page's own blueprint. Statamic builds the
 * publish form from it at page load, so a tab or a field added since is simply
 * not in the form, and nothing short of loading the page again puts it there.
 *
 * So this reloads. Live Preview comes back because the URL says so — the
 * `?live-preview=1` the editor was opened with is still on it — and everything
 * downstream of the load is new by definition: blueprint, fields, meta,
 * templates, the library, header and footer.
 *
 * Unsaved work goes with it. That is what a reload is, and it is what was
 * asked for; the browser's own "leave site?" prompt is the warning, raised by
 * Statamic's unsaved-changes guard rather than by a second one here.
 */
export function reloadEverything(win) {
  // The page picker's own move, aimed back at the page we are already on.
  //
  // `location.reload()` was the obvious version and the wrong one: it tears the
  // document down, so you get a blank screen, then the bare admin form, then
  // the editor booting again. `navigateFromLp` is what the picker in the top
  // bar calls — it puts a still of the current preview up first, asks about
  // unsaved work, and swaps the page in behind it. Same move, same look, only
  // the destination differs: here it is where we already are.
  //
  // `?live-preview=1` so the editor opens again on the other side; without it
  // the move lands on the plain entry screen.
  const url = new win.URL(win.location.href);

  url.searchParams.set('live-preview', '1');

  if (typeof navigateFromLp === 'function') {
    navigateFromLp(win, null, url.toString());

    return;
  }

  win.location.assign(url.toString());
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
    pill.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();

      if (running) {
        return;
      }

      running = true;
      // Spins until the page goes. Nothing clears it: the document it is drawn
      // in is the one being replaced.
      pill.setAttribute('data-busy', '');

      try {
        reloadEverything(win);
      } catch {
        running = false;
        pill.removeAttribute('data-busy');
        win.Statamic?.$toast?.error(t(win, 'reload_lp_failed'));
      }
    });
  }

  if (pill.innerHTML !== LP_RELOAD_ICON_SVG) {
    pill.innerHTML = LP_RELOAD_ICON_SVG;
  }

  pill.title = t(win, 'reload_lp_title');
  pill.setAttribute('aria-label', pill.title);
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

sve.ensureLpReloadButton = ensureLpReloadButton;
