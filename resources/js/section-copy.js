/**
 * Duplicating a section on the page — as itself, or as a new section type.
 *
 * A section duplicated as itself shares its template with the original: one
 * file, two rows, and a change in the dock is a change to both. That is often
 * what the author wants, and sometimes the opposite — they want a variant to
 * take its own way. So the duplicate on a page section asks which:
 *
 *   Duplicate                — the row again, as it always was.
 *   Duplicate as new section — the server copies the template (CSS and JS ride
 *                              in it), its baked Tailwind and its own fieldset
 *                              to a new type right after it (`SectionTypeMaker
 *                              \Copy`), and the copy on the page is a row of
 *                              that type, with the same content.
 *
 * Only a page section is asked about. A block inside one, a Grid row or a
 * Bard set has no template of its own to copy, and a global section is a
 * saved section's, not a type — those duplicate at once, as before. So does a
 * section for a user who may not make section types (`configure fields`).
 *
 * Loaded on the first duplicate of a page section, not with the CP: two
 * dialogs and a request.
 */
import { t } from './lib/i18n.js';
import { csrfToken } from './lib/csrf.js';
import { humanizeHandle } from './lib/values.js';
import { pageBuilderParams } from './lib/config.js';
import { openCpOverlay } from './cp/open-overlay.js';
import ChoiceDialog from './cp/surfaces/ChoiceDialog.vue';
import NewSectionPrompt from './cp/surfaces/NewSectionPrompt.vue';
import { fetchSetMeta, handleDuplicateRow, pageSectionRow, rowDuplicable } from './section-library.js';
import { addLiteSetConfig } from './side/lite-sections.js';
import { canCreateSections, libraryStale, revealWhenRendered } from './section-create.js';

/** The section's name as the library shows it. */
function typeDisplay(win, type) {
  const types = win.Statamic?.$config?.get?.('sveSectionTypes');
  const known = Array.isArray(types) ? types.find((item) => item?.handle === type) : null;

  return known?.display || humanizeHandle(type);
}

function choose(win, name) {
  return new Promise((resolve) => {
    let done = false;
    const answer = (value) => {
      if (done) {
        return;
      }

      done = true;
      overlay.dismiss();
      resolve(value === 'same' || value === 'new' ? value : null);
    };

    const overlay = openCpOverlay(win.document, ChoiceDialog, {
      title: t(win, 'section_duplicate_title', { name }),
      body: t(win, 'section_duplicate_body'),
      buttons: [
        { value: 'cancel', label: t(win, 'cancel'), variant: 'ghost' },
        { value: 'same', label: t(win, 'section_duplicate_same'), variant: 'muted' },
        { value: 'new', label: t(win, 'section_duplicate_new'), variant: 'primary' },
      ],
      onPick: answer,
      onClose: () => answer(null),
    });
  });
}

async function copyType(win, handle, display) {
  const res = await win.fetch('/!/sve/section-types/copy', {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': csrfToken(win),
      Accept: 'application/json',
    },
    // Which page's list: written in the file of the sections field its blueprint marks.
    body: JSON.stringify({ handle, display, ...pageBuilderParams(win) }),
  });
  const data = await res.json().catch(() => ({}));

  if (!res.ok || !data.section?.handle) {
    const err = new Error(data.error || `section-types/copy ${res.status}`);
    err.reason = data.error;
    throw err;
  }

  return data;
}

/**
 * The new type made, then its row placed after the source. The type's meta
 * comes from the server, which resolves the blueprint per request; the panels
 * beside the preview render from the set config the form was built with, and
 * are told about the new set first — as with a section made with the plus.
 */
async function copyAsNewSection(win, doc, uid, row, display) {
  const data = await copyType(win, row.type, display);
  const made = data.section;
  const meta = await fetchSetMeta(win, made.handle);

  if (meta && Array.isArray(meta.definitions)) {
    addLiteSetConfig(
      made.handle,
      {
        display: made.display,
        icon: made.icon || null,
        hide: made.hidden === true,
        fields: meta.definitions,
        group_display: (data.section_types || []).find((type) => type?.handle === made.handle)?.group_display || made.group,
      },
      made.group
    );
  }

  libraryStale(win);

  const copy = await handleDuplicateRow({ uid, asType: made.handle }, doc, win);

  win.Statamic?.$toast?.success(t(win, 'section_created', { name: made.display }));

  // Stepped into, as a section made with the plus is: the preview selects
  // it once it is drawn, and the dock follows with the new file.
  if (copy) {
    revealWhenRendered(win, [copy._visual_id, copy.id, copy._id]);
  }
}

function askName(win, doc, uid, row, name) {
  let open = true;
  // Escape while the copy is being made, then the request's own end: once.
  const close = () => {
    if (open) {
      open = false;
      overlay.dismiss();
    }
  };
  const overlay = openCpOverlay(win.document, NewSectionPrompt, {
    heading: t(win, 'section_copy_heading', { name }),
    groupLabel: '',
    nameLabel: t(win, 'section_new_name'),
    value: t(win, 'section_copy_name', { name }),
    note: t(win, 'section_copy_note'),
    groups: [],
    cancelLabel: t(win, 'cancel'),
    saveLabel: t(win, 'section_copy_create'),
    onClose: close,
    onOk: (display) => {
      void copyAsNewSection(win, doc, uid, row, display)
        .catch((err) => {
          win.Statamic?.$toast?.error(t(win, err?.reason === 'bad_name' ? 'section_new_bad_name' : 'section_copy_failed'));
        })
        .finally(close);
    },
  });
}

/**
 * The duplicate of a row, from the HTML tree or the preview's row toolbar
 * (`MSG.DUPLICATE_ROW`). A page section asks which kind; anything else is
 * duplicated straight away.
 */
export async function duplicateSection(data, doc, win) {
  const row = canCreateSections(win) && rowDuplicable(data.uid, doc) ? pageSectionRow(win, doc, data.uid) : null;

  if (!row) {
    return handleDuplicateRow(data, doc, win);
  }

  const name = typeDisplay(win, row.type);
  const kind = await choose(win, name);

  if (kind === 'same') {
    return handleDuplicateRow(data, doc, win);
  }

  if (kind === 'new') {
    askName(win, doc, data.uid, row, name);
  }

  return null;
}
