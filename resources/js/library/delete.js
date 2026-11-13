/**
 * section-library.js — deleting from the library.
 * Split out of section-library.js in the quality pass (tab G): the same statements, in the same
 * order; only the imports are new. section-library.js re-exports this file.
 */
import { t } from '../lib/i18n.js';
import DeleteLibraryDialog from '../cp/surfaces/DeleteLibraryDialog.vue';
import { mountSurface } from '../cp/mount.js';
import { deleteLibraryUi } from '../cp/library/delete-store.js';
import { csrfToken } from '../lib/csrf.js';
import { unwrapRef } from '../lib/values.js';
import { sectionField } from '../lib/config.js';
import { activeContainers } from '../lib/publish-containers.js';
import { libraryState } from './state.js';
import { blueprintQuery } from './types.js';
import { globalSectionSet } from './row-meta.js';

export const LIBRARY_DELETE_ID = '__sve-library-delete';

/** Which delete question is the current one; see {@link confirmDeleteLibraryItem}. */
let deleteDialogToken = 0;

export const TRASH_ICON =
  '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" ' +
  'stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ' +
  'style="display:block;pointer-events:none"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>' +
  '<path d="M10 11v6M14 11v6"/></svg>';

/**
 * The trash on a library card.
 *
 * Its pointerdown is swallowed so the card's drag handler never starts: without
 * that, aiming for the trash would pick the card up and — under the drag
 * threshold — drop the section onto the page instead of deleting it.
 */
export function libraryDeleteButton(win, kind, item, onDeleted) {
  const btn = win.document.createElement('button');

  btn.type = 'button';
  btn.title = t(win, 'delete_item');
  btn.setAttribute('aria-label', t(win, 'delete_item'));
  btn.innerHTML = TRASH_ICON;
  btn.style.cssText =
    'all:unset;cursor:pointer;flex:0 0 auto;display:inline-flex;align-items:center;justify-content:center;' +
    'width:24px;height:24px;border-radius:6px;color:currentColor;opacity:.45;transition:opacity .12s,color .12s;';
  btn.addEventListener('mouseenter', () => {
    btn.style.opacity = '1';
    btn.style.color = '#dc2626';
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.opacity = '.45';
    btn.style.color = 'currentColor';
  });
  btn.addEventListener('pointerdown', (event) => event.stopPropagation());
  btn.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    confirmDeleteLibraryItem(win, kind, item, onDeleted);
  });

  return btn;
}

/**
 * "Are you sure?" for deleting something out of the library.
 *
 * Three different things, three different costs. A template and a custom section
 * are only ever *copied* onto a page, so the pages built from one keep what they
 * have and the question is simple. A global section is a live reference: the
 * dialog looks first, and if pages point at it they're named, because confirming
 * takes the section off all of them. A section *type* is heavier still — the set
 * leaves the fieldset, so no page can ever add one again, and the pages that
 * have one lose it along with its content.
 */
export function confirmDeleteLibraryItem(win, kind, item, onDeleted) {
  const doc = win.document;
  const isTemplate = kind === 'template';
  const isType = kind === 'page';
  const name = item.display || item.title;

  doc.getElementById(LIBRARY_DELETE_ID)?.remove();

  // Two cards clicked in a row: only the last one asked for may open, or the
  // slower answer would put a second dialog up behind the first.
  const token = ++deleteDialogToken;

  let app = null;
  let host = null;

  const close = () => {
    app?.unmount();
    host?.remove();
    app = null;
    host = null;
  };

  /*
   * The dialog goes up once, with its words and all its buttons already
   * settled.
   *
   * It used to mount on the way to the usage answer: a first paint saying
   * "Checking…" under a lone Cancel, and a second that swapped the text,
   * added two buttons and changed the width — under a pointer already on
   * its way to click. Nothing is shown until there is a whole question to
   * ask.
   */
  const show = () => {
    if (app || token !== deleteDialogToken) {
      return;
    }

    host = doc.createElement('div');
    host.id = LIBRARY_DELETE_ID;
    doc.body.appendChild(host);
    app = mountSurface(DeleteLibraryDialog, host);
  };

  const titleKey = isTemplate
    ? 'delete_template_title'
    : isType
      ? 'delete_section_type_title'
      : 'delete_saved_section_title';

  const usageWhere = (usage) =>
    usage.count > 1
      ? `${usage.collection_title} · ${t(win, 'delete_usage_count', { count: usage.count })}`
      : usage.collection_title;

  const setButtons = (confirmKey, removeUsages) => {
    // A section type offers two ends: out of the page builder, or off the
    // disk with it — its partial and its imported fieldset. The other kinds
    // keep their single Delete.
    const confirms = !confirmKey
      ? []
      : isType
        ? [
            { id: 'confirm', label: t(win, 'delete_confirm_remove_only'), variant: 'danger' },
            { id: 'confirm_files', label: t(win, 'delete_confirm_with_files'), variant: 'danger' },
          ]
        : [{ id: 'confirm', label: t(win, confirmKey), variant: 'danger' }];

    deleteLibraryUi.buttons = [{ id: 'cancel', label: t(win, 'cancel'), variant: '' }, ...confirms];
    deleteLibraryUi.onPick = (id) => {
      close();

      if (id === 'confirm' || id === 'confirm_files') {
        deleteLibraryItem(win, kind, item, removeUsages, onDeleted, id === 'confirm_files');
      }
    };
  };

  deleteLibraryUi.title = t(win, titleKey, { name });
  deleteLibraryUi.body = isTemplate ? t(win, 'delete_template_body') : '';
  deleteLibraryUi.leads = [];
  deleteLibraryUi.usages = [];
  deleteLibraryUi.usageHeading = '';
  deleteLibraryUi.onClose = close;

  // A template has nothing to look up: its question is whole already.
  if (isTemplate) {
    setButtons('delete_confirm', false);
    show();

    return;
  }

  const usageUrl = isType
    ? `/!/sve/section-types/usage?handle=${encodeURIComponent(item.handle)}&${blueprintQuery(win)}`
    : `/!/sve/saved-sections/${encodeURIComponent(item.id)}/usage`;

  win
    .fetch(usageUrl, {
      credentials: 'same-origin',
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
    })
    .then((res) => (res.ok ? res.json() : Promise.reject(res)))
    .then((data) => {
      const usages = data.usages || [];

      if (!usages.length) {
        if (isType) {
          // Leads, not body: the note about the two buttons is its own line.
          deleteLibraryUi.body = '';
          deleteLibraryUi.leads = [t(win, 'delete_section_type_body'), t(win, 'delete_section_type_files_note')];
        } else {
          deleteLibraryUi.body = t(
            win,
            item.synced ? 'delete_global_section_unused_body' : 'delete_saved_section_body'
          );
        }
        setButtons('delete_confirm', false);
        show();

        return;
      }

      const leadKeys = isType
        ? ['delete_section_type_body', 'delete_section_type_used', 'delete_section_type_files_note']
        : ['delete_global_section_body'];

      deleteLibraryUi.body = '';
      deleteLibraryUi.leads = leadKeys.map((key) => t(win, key));
      deleteLibraryUi.usageHeading =
        usages.length === 1
          ? t(win, 'delete_usage_heading_one')
          : t(win, 'delete_usage_heading', { count: usages.length });
      deleteLibraryUi.usages = usages.map((usage) => ({
        title: usage.title,
        where: usageWhere(usage),
      }));
      setButtons('delete_confirm_everywhere', true);
      show();
    })
    .catch(() => {
      // Nothing can be confirmed on an answer that never came: the dialog
      // says so, with Cancel alone.
      deleteLibraryUi.body = t(win, 'delete_usage_failed');
      deleteLibraryUi.leads = [];
      setButtons(null, false);
      show();
    });
}

/** Sends the delete, then tells the picker to reload the list it came from. */
export function deleteLibraryItem(win, kind, item, removeUsages, onDeleted, deleteFiles = false) {
  const name = item.display || item.title;
  const suffix = removeUsages ? 'remove_usages=1' : '';

  const url =
    kind === 'template'
      ? `/!/sve/templates/${encodeURIComponent(item.id)}`
      : kind === 'page'
        ? `/!/sve/section-types?handle=${encodeURIComponent(item.handle)}&${blueprintQuery(win)}${suffix ? `&${suffix}` : ''}${deleteFiles ? '&delete_files=1' : ''}`
        : `/!/sve/saved-sections/${encodeURIComponent(item.id)}${suffix ? `?${suffix}` : ''}`;

  win
    .fetch(url, {
      method: 'DELETE',
      credentials: 'same-origin',
      headers: {
        'X-CSRF-TOKEN': csrfToken(win),
        'X-Requested-With': 'XMLHttpRequest',
      },
    })
    .then(async (res) => {
      const body = await res.json().catch(() => ({}));

      if (!res.ok) {
        win.Statamic?.$toast?.error(t(win, 'delete_failed'));

        return;
      }

      // The page open in the editor holds its own copy of the form. The server
      // took the rows out of the entry on disk, but not out of this — and saving
      // the page would write them straight back.
      if (kind === 'global') {
        stripSectionsFromForm(win, sectionReferenceMatcher(win, item.id));
      } else if (kind === 'page') {
        stripSectionsFromForm(win, (row) => row?.type === item.handle);
        // The picker's type list came from the page render, and one of them no
        // longer exists. The server sent the fresh list back with the delete.
        if (Array.isArray(body.section_types)) {
          libraryState.sectionTypesOverride = { field: sectionField(win), types: body.section_types };
        }
      }

      win.Statamic?.$toast?.success(
        body.removed_from
          ? t(win, 'deleted_toast_everywhere', { name, count: body.removed_from })
          : t(win, 'deleted_toast', { name })
      );

      onDeleted();
    })
    .catch(() => win.Statamic?.$toast?.error(t(win, 'delete_failed')));
}

/** Matches a `global_section` row pointing at a given saved-section entry. */
export function sectionReferenceMatcher(win, savedEntryId) {
  const set = globalSectionSet(win);
  const id = String(savedEntryId);

  return (row) =>
    row !== null &&
    typeof row === 'object' &&
    row.type === set &&
    []
      .concat(row[set] ?? [])
      .map(String)
      .includes(id);
}

/** Takes every matching section row out of the form open in the editor. */
export function stripSectionsFromForm(win, matches) {
  const doc = win.document;
  const field = sectionField(win);

  const strip = (node) => {
    if (Array.isArray(node)) {
      return node.filter((entry) => !matches(entry)).map(strip);
    }

    if (node !== null && typeof node === 'object') {
      return Object.fromEntries(Object.entries(node).map(([key, value]) => [key, strip(value)]));
    }

    return node;
  };

  for (const container of activeContainers(doc)) {
    const values = unwrapRef(container.values);
    const rows = values && typeof values === 'object' ? values[field] : null;

    if (!Array.isArray(rows)) {
      continue;
    }

    const before = JSON.parse(JSON.stringify(rows));
    const next = strip(before);

    if (JSON.stringify(next) !== JSON.stringify(before)) {
      container.setFieldValue(field, next);
    }
  }
}
