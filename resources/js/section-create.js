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
import { sendToPreview } from './cp.js';
import { ask } from './cp/bus.js';
import { openCpOverlay } from './cp/open-overlay.js';
import NewSectionPrompt from './cp/surfaces/NewSectionPrompt.vue';
import ChoiceDialog from './cp/surfaces/ChoiceDialog.vue';
import { csrfToken } from './lib/csrf.js';
import { previewDocument } from './lib/preview-frame.js';
import { buildSectionRow, fetchSetMeta, hydrateExistingMeta, insertSectionAfter, newRowId } from './section-library.js';
import { MSG, SOURCE } from './lib/protocol.js';

const API = '/!/sve/section-types';

/** Where the server registers static sections — `SectionTypeMaker::STATIC_GROUP`. */
export const STATIC_GROUP = 'static_sections';

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
    // The static group is the server's own: a section with fields does not
    // belong in it, so it is not offered.
    if (type?.group && type.group !== STATIC_GROUP && !seen.has(type.group)) {
      seen.set(type.group, type.group_display || type.group);
    }
  }

  return [...seen].map(([key, display]) => ({ key, display }));
}

/**
 * What this session has learned about a set since the page loaded: made
 * static, hidden from editors, given fields. The maps handed to the page at
 * load (`sveSetMeta`, `sveSectionTypes`) are snapshots; a set made or changed
 * a minute ago is not in them, and the tree would otherwise offer a fields
 * icon on a section that has none.
 */
const typeFlags = new Map();

function remember(section) {
  if (section?.handle) {
    typeFlags.set(section.handle, { static: !!section.static, hidden: !!section.hidden });
  }
}

/** Markup only — no fieldset to open. */
export function isStaticType(win, handle) {
  if (!handle) {
    return false;
  }

  if (typeFlags.has(handle)) {
    return typeFlags.get(handle).static;
  }

  return win.Statamic?.$config?.get?.('sveSetMeta')?.[handle]?.static === true;
}

/** Kept out of the picker: editors cannot insert it. */
export function isHiddenType(win, handle) {
  if (!handle) {
    return false;
  }

  if (typeFlags.has(handle)) {
    return typeFlags.get(handle).hidden;
  }

  const types = win.Statamic?.$config?.get?.('sveSectionTypes');

  return Array.isArray(types) && types.some((type) => type?.handle === handle && type.hidden === true);
}

async function send(win, method, body) {
  const res = await win.fetch(API, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': csrfToken(win),
      Accept: 'application/json',
    },
    credentials: 'same-origin',
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err = new Error(data.error || `section-types ${res.status}`);
    err.reason = data.error;
    throw err;
  }

  remember(data.section);

  return data;
}

/**
 * `static`: a set with markup and no fieldset, in the static group the server
 * keeps. `hidden`: kept out of the picker — an editor cannot insert it.
 */
export function createSection(win, { display, group = '', static: isStatic = false, hidden = false }) {
  return send(win, 'POST', { display, group, static: isStatic, hidden });
}

/**
 * One set changed in place: `hidden` in or out of the picker, `fields` gives
 * a static section the fieldset it was made without. The handle, the rows on
 * every page and the markup stay as they are.
 */
export function updateSectionType(win, { handle, hidden, fields = false }) {
  const body = { handle, fields };

  if (typeof hidden === 'boolean') {
    body.hidden = hidden;
  }

  return send(win, 'PATCH', body);
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
      sendToPreview({ source: SOURCE, type: MSG.SVE_ACTIVATE, ids: wanted }, win);
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

/**
 * The first question the plus asks: static markup, or fields for an editor.
 *
 * Resolves 'static' or 'fields' — or null when the dialog was left, which the
 * caller treats as Cancel: the plus unlocks and nothing is made.
 */
export function chooseSectionKind(win) {
  return new Promise((resolve) => {
    let done = false;
    const answer = (value) => {
      if (done) {
        return;
      }

      done = true;
      overlay.dismiss();
      resolve(value === 'static' || value === 'fields' ? value : null);
    };

    const overlay = openCpOverlay(win.document, ChoiceDialog, {
      title: t(win, 'section_new_kind'),
      body: t(win, 'section_new_kind_note'),
      buttons: [
        { value: 'cancel', label: t(win, 'cancel'), variant: 'ghost' },
        { value: 'static', label: t(win, 'section_new_static'), variant: 'primary' },
        { value: 'fields', label: t(win, 'section_new_with_fields'), variant: 'primary' },
      ],
      onPick: answer,
      onClose: () => answer(null),
    });
  });
}

/** The markup a section in a template starts as: one root, room inside. */
const TEMPLATE_SECTION = '<section class="[ ] py-800">\n    \n</section>\n';

/**
 * A section written into the open template file.
 *
 * Static markup is not a set: it has no fields, no card in the library and no
 * row on the page. It lives in the file that renders the page, at the end,
 * and is on every page that file renders. Saved at once, autosave or not: it
 * is a thing done, not text half-typed.
 *
 * A locked file refuses the write, as it refuses every other — the padlock in
 * the dock is the way in, and the toast says so.
 */
export function insertTemplateSection(win) {
  if (ask('dock:is-locked') === true) {
    win.Statamic?.$toast?.error(t(win, 'code_dock_locked'));

    return false;
  }

  const html = String(ask('dock:html') || '');
  const next = `${html.replace(/\s+$/, '')}\n\n${TEMPLATE_SECTION}`;

  if (ask('dock:set-html', next) !== true) {
    win.Statamic?.$toast?.error(t(win, 'section_new_failed'));

    return false;
  }

  ask('dock:save-now');
  win.Statamic?.$toast?.success(t(win, 'section_new_template_done'));

  return true;
}

/**
 * Makes the section and puts it on the page — the part the two dialogs share.
 *
 * The section lands at the end of the list the plus sits under, then the
 * caller steps into it: it knows the tree it is drawn in; this only knows the
 * row it wrote. Nowhere to put it (no page-builder field in reach) — then the
 * template is still the thing worth opening, as it always was.
 */
async function makeSection(win, overlay, payload, { afterUid, onDone, onError }) {
  try {
    const data = await createSection(win, payload);

    overlay.dismiss();

    win.Statamic?.$toast?.success(
      t(win, 'section_created', { name: data.section?.display || payload.display })
    );

    // An open Patterns panel is holding the list from before this section
    // existed. Same event a saved section fires: it drops its lists and asks
    // again, so the new card appears where the author is already looking
    // instead of after the next reopen.
    libraryStale(win);

    const row = await placeNewSection(win, data.section?.handle, afterUid);

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
}

/**
 * Tells an open Patterns panel its list is out of date.
 *
 * Dispatched by hand rather than through `libraryWentStale`: that lives in
 * section-library.js, and importing it here would pull the whole library —
 * four thousand lines of panel — into the HTML tree's chunk, which is loaded
 * on every section.
 */
export function libraryStale(win) {
  win.document
    .getElementById('__sve-section-picker')
    ?.dispatchEvent(new win.CustomEvent('sve-library-stale'));
}

/**
 * A static section: the name, and whether editors may insert it. No group —
 * the server keeps them together in one.
 */
export function openStaticSectionDialog(win, { afterUid = null, onDone, onError, onClose } = {}) {
  const overlay = openCpOverlay(win.document, NewSectionPrompt, {
    heading: t(win, 'static_section_new'),
    groupLabel: '',
    nameLabel: t(win, 'section_new_name'),
    placeholder: t(win, 'section_new_placeholder'),
    note: t(win, 'static_section_note'),
    groups: [],
    toggleLabel: t(win, 'static_section_insertable'),
    cancelLabel: t(win, 'cancel'),
    saveLabel: t(win, 'section_new_create'),
    onClose,
    onOk: (display, group, insertable) => {
      void makeSection(win, overlay, { display, static: true, hidden: !insertable }, { afterUid, onDone, onError });
    },
  });
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
        void makeSection(win, overlay, { display, group }, { afterUid, onDone, onError });
      },
    });
  })();
}
