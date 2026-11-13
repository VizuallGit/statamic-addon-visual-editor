/**
 * inline-edit.js — save a section, a global reference, a page as a template (the library's, from inline-edit.js).
 * Split out of inline-edit.js in the quality pass (tab G): the same statements, in the same
 * order; only the imports are new. inline-edit.js re-exports this file.
 */
import { t } from '../lib/i18n.js';
import NamePrompt from '../cp/surfaces/NamePrompt.vue';
import SaveSectionDialog from '../cp/surfaces/SaveSectionDialog.vue';
import { openCpOverlay } from '../cp/open-overlay.js';
import { sectionField } from '../lib/config.js';
import { csrfToken } from '../lib/csrf.js';
import { dataGet, findPathByUid, unwrapRef } from '../lib/values.js';
import { activeContainers } from '../lib/publish-containers.js';
import {
  buildSectionRow,
  fetchSetMeta,
  globalSectionSet,
  libraryWentStale,
  newRowId,
  rememberSavedSection,
  rowLocation,
  writeSetMeta,
} from '../section-library.js';

/**
 * "Save as template": grab the clicked section's data from the form and store it
 * as a reusable section. A small dialog asks for a name and whether it should be
 * synced (edits propagate) or a copy (independent).
 *
 * Synced: after the library entry is created, replace THIS page's section with a
 * `global_section` reference so Live Preview shows the global badge immediately
 * (without a manual reload). Custom (unsynced): leave the page section as-is.
 */
export function handleSaveSection(data, doc, win) {
  for (const container of activeContainers(doc)) {
    const values = unwrapRef(container.values);

    if (!values || typeof values !== 'object') {
      continue;
    }

    const path = findPathByUid(values, data.uid);

    if (path === null) {
      continue;
    }

    const section = dataGet(values, path);

    if (!section || typeof section !== 'object') {
      return;
    }

    saveSectionDialog(win, section, (name, synced) => {
      win
        .fetch('/!/sve/saved-sections', {
          method: 'POST',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken(win),
            'X-Requested-With': 'XMLHttpRequest',
          },
          body: JSON.stringify({
            title: name,
            section_type: section.type,
            section_data: stripSavedSectionData(section),
            synced,
          }),
        })
        .then(async (res) => {
          const body = await res.json().catch(() => ({}));

          win.Statamic?.$toast?.[res.ok ? 'success' : 'error'](
            res.ok ? t(win, 'saved_toast', { name }) : t(win, 'save_failed')
          );

          if (res.ok) {
            libraryWentStale(win);
          }

          if (!res.ok || !synced || !body.id) {
            return;
          }

          rememberSavedSection(body.id, { title: name, section_type: section.type });

          // Swap the local section for a synced reference — LP morphs from setFieldValue.
          await replaceSectionWithGlobalReference(win, doc, data.uid, body.id);
        })
        .catch(() => win.Statamic?.$toast?.error(t(win, 'save_failed')));
    });

    return;
  }
}

/**
 * Replace the page section at `uid` with a `global_section` row pointing at the
 * newly saved synced entry — same shape as dropping a Global card from the library.
 */
async function replaceSectionWithGlobalReference(win, doc, uid, savedEntryId) {
  const set = globalSectionSet(win);
  const meta = await fetchSetMeta(win, set);
  const newId = newRowId();
  const row = buildSectionRow(win, 'global', { id: savedEntryId }, meta?.defaults, newId);
  const field = sectionField(win);

  for (const container of activeContainers(doc)) {
    const values = unwrapRef(container.values);

    if (!values || typeof values !== 'object') {
      continue;
    }

    const found = rowLocation(values, uid);

    if (!found) {
      continue;
    }

    const { parentPath, index, rows } = found;
    const next = JSON.parse(JSON.stringify(rows));

    next[index] = row;
    writeSetMeta(container, field, row, meta?.new || null);
    container.setFieldValue(parentPath, next);

    return true;
  }

  return false;
}

/**
 * "Save this page as a template": every section on the page, stored as one entry
 * you can drop onto another page.
 *
 * The page's own field is read straight off the publish container, so it captures
 * what's on screen — including edits not yet saved to the page itself.
 */
export function savePageAsTemplate(win, onSaved = () => {}) {
  const doc = win.document;
  const field = sectionField(win);

  let sections = null;

  for (const container of activeContainers(doc)) {
    const values = unwrapRef(container.values);
    const rows = values && typeof values === 'object' ? values[field] : null;

    if (Array.isArray(rows) && rows.length) {
      sections = rows;

      break;
    }
  }

  if (!sections) {
    win.Statamic?.$toast?.error(t(win, 'template_needs_sections'));

    return;
  }

  promptForName(win, t(win, 'save_page_as_template'), t(win, 'template_name'), (name) => {
    win
      .fetch('/!/sve/templates', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken(win),
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({
          title: name,
          // Ids are per-page. A template is a stencil: it gets fresh ones every
          // time it's dropped, or two pages would claim the same section.
          sections: sections.map((section) => stripSavedSectionData(section)),
        }),
      })
      .then((res) => {
        win.Statamic?.$toast?.[res.ok ? 'success' : 'error'](
          res.ok ? t(win, 'template_saved', { name }) : t(win, 'save_failed')
        );

        if (res.ok) {
          libraryWentStale(win);
          onSaved();
        }
      })
      .catch(() => win.Statamic?.$toast?.error(t(win, 'save_failed')));
  });
}

/**
 * Prepare a section for the saved-sections library.
 *
 * Strips CP-only keys (`_visual_id`, `_id`) but KEEPS (or assigns) stable `id`
 * on every set row. Preview templates use `scope="{{ id }}"` on blocks — without
 * nested ids Antlers cascades to the section id and inline edit resolves the
 * wrong path (`page_sections.0.headline` instead of `….blocks.N.headline`).
 */
function stripSavedSectionData(section) {
  const clone = JSON.parse(JSON.stringify(section));

  const walk = (node) => {
    if (Array.isArray(node)) {
      node.forEach(walk);
    } else if (node && typeof node === 'object') {
      delete node._visual_id;
      delete node._id;

      // Replicator/grid set rows only — not Bard nodes (paragraph/text/…).
      if (
        typeof node.type === 'string' &&
        node.type &&
        !node.id &&
        ('enabled' in node || 'blocks' in node || node.type.includes('/'))
      ) {
        node.id = newRowId();
      }

      Object.values(node).forEach(walk);
    }
  };

  walk(clone);

  return clone;
}

/** Minimal "what should it be called?" prompt, themed to the CP. */
function promptForName(win, heading, placeholder, onOk) {
  const overlay = openCpOverlay(win.document, NamePrompt, {
    heading,
    nameLabel: t(win, 'name'),
    placeholder,
    cancelLabel: t(win, 'cancel'),
    saveLabel: t(win, 'save'),
    onOk: (value) => {
      overlay.dismiss();
      onOk(value);
    },
  });
}

/** Minimal name + synced prompt, themed to the CP, appended to the body. */
function saveSectionDialog(win, section, onSave) {
  const overlay = openCpOverlay(win.document, SaveSectionDialog, {
    heading: t(win, 'save_section_heading'),
    nameLabel: t(win, 'name'),
    placeholder: t(win, 'name_placeholder'),
    syncedHint: t(win, 'synced_hint'),
    cancelLabel: t(win, 'cancel'),
    saveLabel: t(win, 'save'),
    onSave: (value, synced) => {
      overlay.dismiss();
      onSave(value, synced);
    },
  });
}
