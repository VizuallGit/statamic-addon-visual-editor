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
 * So this opens the new template in the dock rather than inserting anything:
 * an empty section has nothing to show until it is written, and writing it is
 * where the author was heading.
 */
import { t } from './cp-t.js';
import { ask } from './cp/bus.js';
import { openCpOverlay } from './cp/open-overlay.js';
import NewSectionPrompt from './cp/surfaces/NewSectionPrompt.vue';

const API = '/!/sve/section-types';

function csrfToken(win) {
  return (
    win.document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ||
    win.Statamic?.$config?.get?.('csrfToken') ||
    win.Statamic?.$config?.get?.('csrf_token') ||
    ''
  );
}

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

/** Whether the current user may make one at all — the same gate as deleting. */
export function canCreateSections(win) {
  return win.Statamic?.$permissions?.has?.('configure fields') === true;
}

export function openNewSectionDialog(win, { onDone, onError } = {}) {
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

            // Straight into the empty template. The dock is where the section
            // gets written, and the alternative — a toast saying "now go find
            // it" — is the step that makes this worth nothing.
            if (data.section?.handle) {
              ask('dock:open-template', data.section.handle);
            }

            onDone?.(data);
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
