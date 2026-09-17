/**
 * Making a new section type from the editor.
 *
 * Three files have to be written and agree with each other — the fields, the
 * markup, and the registration in the page-builder fieldset — and doing it by
 * hand means three screens, with the registration as the step everyone forgets.
 * The server writes all three from one handle (see `SectionTypeMaker`); this
 * asks for the two things it cannot work out on its own, the group and the name.
 *
 * The section is usable the moment it exists — no reload. That is not luck: the
 * library inserts by writing the row's value and its meta onto the publish
 * container itself (`insertSectionAfter`), and the meta comes from the server,
 * which resolves the blueprint per request. Statamic's *own* set picker would
 * be a different story — it renders from the blueprint snapshot the form was
 * built with, and does not know about a set added since — but that is not the
 * path the editor uses.
 *
 * So it is dropped onto the page straight away — at the end of the list the
 * plus sits under — and then opened the way a click on it would open it: the
 * tree lists it beside the sections that were already there, the preview steps
 * into it, and the dock holds its empty template, which is where the author was
 * heading. A section that only exists in the library is one the author has to
 * go and find.
 */
import { t } from './lib/i18n.js';
import { sve } from './cp-registry.js';
import { sendToPreview } from './cp.js';
import { ask } from './cp/bus.js';
import { openCpOverlay } from './cp/open-overlay.js';
import NewSectionPrompt from './cp/surfaces/NewSectionPrompt.vue';
import { csrfToken } from './lib/csrf.js';
import { previewDocument } from './lib/preview-frame.js';
import { buildSectionRow, fetchSetMeta, hydrateExistingMeta, insertSectionAfter, newRowId } from './section-library.js';

const API = '/!/sve/section-types';

/**
 * The groups a section can be made in, in the order the page-builder fieldset
 * lists them.
 *
 * Derived from the types rather than asked for separately: the same endpoint
 * the library opens with already carries every set's group and its display
 * name, and a group with no sections in it has no folder convention to follow
 * anyway.
 */
export async function fetchGroups(win) {
  const res = await win.fetch(API, {
    headers: { Accept: 'application/json' },
    credentials: 'same-origin',
  });

  if (!res.ok) {
    throw new Error(`section-types ${res.status}`);
  }

  const data = await res.json();
  const seen = new Map();

  for (const type of data.types || []) {
    if (type?.group && !seen.has(type.group)) {
      seen.set(type.group, type.group_display || type.group);
    }
  }

  return [...seen].map(([key, display]) => ({ key, display }));
}

export async function createSection(win, { display, group }) {
  const res = await win.fetch(API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': csrfToken(win),
      Accept: 'application/json',
    },
    credentials: 'same-origin',
    body: JSON.stringify({ display, group }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err = new Error(data.error || `section-types ${res.status}`);
    err.reason = data.error;
    throw err;
  }

  return data;
}

/**
 * Puts the new section on the page.
 *
 * The same write the library's own cards make — row value plus the set's fresh
 * meta, straight onto the publish container — which is why it works on a set
 * that did not exist when the form was built: the meta comes from the server,
 * which resolves the blueprint per request. Statamic's own set picker is the
 * one thing that stays a page-load behind, and it is not the path used here.
 *
 * `afterUid` is the section to land behind (null = the top of the page).
 * Returns the row, so the caller has the uid to step into, or null when there
 * is no page-builder field to write to — a component, say, or a form that has
 * not finished mounting.
 */
export async function placeNewSection(win, handle, afterUid = null) {
  if (
    !handle
    || typeof fetchSetMeta !== 'function'
    || typeof insertSectionAfter !== 'function'
  ) {
    return null;
  }

  const meta = await fetchSetMeta(win, handle);

  // No meta, no row: the Replicator renders each row from `meta.<field>
  // .existing[<_id>]`, so a row written without it shows in the preview and is
  // missing from the form. Better to leave the page alone and open the
  // template, which is what this did before it placed anything.
  if (!meta) {
    return null;
  }

  const newId = newRowId();
  const row = buildSectionRow(win, 'page', { handle }, meta?.defaults, newId);
  const rowMeta = hydrateExistingMeta(row, meta?.new || {}, meta?.defaults);

  return insertSectionAfter(win, win.document, afterUid, row, rowMeta) ? row : null;
}

// Asking for the section again while the page is still being built. Roughly
// twelve seconds all told — a render round-trip on a heavy page, measured at two
// to three — and then it is left alone.
const REVEAL_EVERY_MS = 700;
const REVEAL_TRIES = 17;

/**
 * Brings the new section into view once the preview has drawn it.
 *
 * The row is written onto the publish form and the preview is asked for it in
 * the same breath — but the page is rendered from that form a second or two
 * later, and a request that lands before the element does is dropped without a
 * word. That is why a brand new section sat below the fold while the editor
 * showed the top of the page.
 *
 * So the preview is asked again, and the question is only put once it can be
 * answered: the element has to be in the preview's document first. Where that
 * document cannot be read, the request goes out a few times regardless —
 * selecting the same section twice costs nothing.
 *
 * Every id the row answers to is offered, not just `_visual_id`. A set made
 * moments ago is not in the blueprint the form was built with, so the template
 * falls back to the row's `id` — measured: the section was stamped
 * `data-sid="<id>"`, and asking for `_visual_id` alone found nothing.
 */
export function revealWhenRendered(win, ids) {
  const wanted = (ids || []).filter(Boolean);

  if (!wanted.length) {
    return;
  }

  let tries = 0;

  const askAgain = () => {
    tries += 1;

    const doc = previewDocument(win);
    const rendered = doc
      ? wanted.some((id) => doc.querySelector(`[data-sid="${CSS.escape(id)}"]`))
      : true;

    if (rendered) {
      sendToPreview({ source: 'statamic-visual-editor', type: 'sve-activate', ids: wanted }, win);
    }

    // Blind (no readable document): a handful of tries, then stop. Sighted:
    // stop at the first one that lands.
    if (rendered ? !doc && tries < 6 : tries < REVEAL_TRIES) {
      win.setTimeout(askAgain, REVEAL_EVERY_MS);
    }
  };

  win.setTimeout(askAgain, REVEAL_EVERY_MS);
}

/** Whether the current user may make one at all — the same gate as deleting. */
export function canCreateSections(win) {
  return win.Statamic?.$permissions?.has?.('configure fields') === true;
}

export function openNewSectionDialog(win, { afterUid = null, onDone, onError, onClose } = {}) {
  void (async () => {
    let groups = [];

    try {
      groups = await fetchGroups(win);
    } catch (err) {
      onError?.(err);
      win.Statamic?.$toast?.error(t(win, 'section_new_failed'));

      return;
    }

    if (!groups.length) {
      onError?.(new Error('no groups'));
      win.Statamic?.$toast?.error(t(win, 'section_new_failed'));

      return;
    }

    const overlay = openCpOverlay(win.document, NewSectionPrompt, {
      heading: t(win, 'section_new'),
      groupLabel: t(win, 'section_new_group'),
      nameLabel: t(win, 'section_new_name'),
      placeholder: t(win, 'section_new_placeholder'),
      note: t(win, 'section_new_note'),
      groups,
      cancelLabel: t(win, 'cancel'),
      saveLabel: t(win, 'section_new_create'),
      // Cancel, Escape and a click on the backdrop close without creating.
      // The plus in the HTML tree stays locked until one of onDone / onError /
      // onClose fires, so this has to be the third.
      onClose,
      onOk: (display, group) => {
        void (async () => {
          try {
            const data = await createSection(win, { display, group });

            overlay.dismiss();

            win.Statamic?.$toast?.success(
              t(win, 'section_created', { name: data.section?.display || display })
            );

            // An open Patterns panel is holding the list from before this
            // section existed. Same event a saved section fires: it drops its
            // lists and asks again, so the new card appears where the author is
            // already looking instead of after the next reopen.
            //
            // Dispatched by hand rather than through `libraryWentStale`: that
            // lives in section-library.js, and importing it here would pull the
            // whole library — four thousand lines of panel — into the HTML
            // tree's chunk, which is loaded on every section.
            win.document
              .getElementById('__sve-section-picker')
              ?.dispatchEvent(new win.CustomEvent('sve-library-stale'));

            // Onto the page, at the end of the list the plus sits under. The
            // caller steps into it from there — it knows the tree it is drawn
            // in; this only knows the row it wrote.
            const row = await placeNewSection(win, data.section?.handle, afterUid);

            // Nowhere to put it (no page-builder field in reach) — then the
            // template is still the thing worth opening, as it always was.
            if (!row && data.section?.handle) {
              ask('dock:open-template', data.section.handle);
            }

            onDone?.({ ...data, uid: row?._visual_id || '' });
          } catch (err) {
            overlay.dismiss();

            win.Statamic?.$toast?.error(
              t(win, err.reason === 'bad_name' ? 'section_new_bad_name' : 'section_new_failed')
            );

            onError?.(err);
          }
        })();
      },
    });
  })();
}
