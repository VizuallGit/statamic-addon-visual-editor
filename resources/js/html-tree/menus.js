/**
 * html-tree.js — the row's and the section's menus.
 * Split out of html-tree.js in the quality pass (tab G): the same statements, in the same
 * order; only the imports are new. html-tree.js re-exports this file.
 */
import { t } from '../lib/i18n.js';
import { canCreateSections, isHiddenType, libraryStale, updateSectionType } from '../section-create.js';
import { canEditFields, openFieldsetOverlay } from '../section-fields.js';
import { ask } from '../cp/bus.js';
import { htmlTreeUi } from '../cp/html-tree/store.js';
import { componentName } from '../html-tree-parse.js';
import { openCpOverlay } from '../cp/open-overlay.js';
import HtmlTreeMenu from '../cp/surfaces/HtmlTreeMenu.vue';
import { extractComponent } from '../component-extract.js';
import { MSG, SOURCE } from '../lib/protocol.js';
import { hasToken } from '../dock-partials.js';
import { htmlTreeState } from './state.js';
import { renderHtmlTree } from './render.js';
import { removeSectionFromPage, sectionOfHtmlTreeRow, toggleHtmlTreeLock } from './row-actions.js';
import { selectHtmlTreeRow } from '../html-tree.js';
import { enterFrame } from './frame.js';

/** The three dots holding a menu open: their row keeps its icons while the pointer is on the list. */
let htmlTreeMoreButton = null;

function releaseHtmlTreeMore() {
  htmlTreeMoreButton?.closest('[data-sve-ht-row]')?.removeAttribute('data-sve-ht-more-open');
  htmlTreeMoreButton = null;
}

export function closeHtmlTreeMenu() {
  htmlTreeState.htmlTreeMenu?.dismiss();
  htmlTreeState.htmlTreeMenu = null;
  releaseHtmlTreeMore();
}

/**
 * The menu on a section row: take the section off the page.
 *
 * Deliberately not the same verb as the rest of this tree. Everything else here
 * edits the template file — "delete" on a tag removes that tag from the Antlers,
 * for every page using it. Removing a section takes this one section off this
 * one page and leaves the file alone. They read alike and do very different
 * things, so they are named apart and this one asks first, through the same
 * confirm the block tree and the hover bar already use.
 */
export const TOGGLE_ON =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="m8 12 3 3 5-6"/></svg>';
export const TOGGLE_OFF =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="3" width="18" height="18" rx="4"/></svg>';

const MENU_ICON = (body) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
const MORE_ICONS = {
  up: MENU_ICON('<path d="M12 19V5M6 11l6-6 6 6"/>'),
  down: MENU_ICON('<path d="M12 5v14M6 13l6 6 6-6"/>'),
  save: MENU_ICON('<path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1Z"/>'),
  add: MENU_ICON('<path d="M12 5v14M5 12h14"/>'),
  fieldset: MENU_ICON(
    '<rect x="3" y="4" width="18" height="6" rx="1.5"/><rect x="3" y="14" width="18" height="6" rx="1.5"/>'
  ),
  lock: MENU_ICON('<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>'),
  unlock: MENU_ICON('<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 7.9-.9"/>'),
};

/**
 * What the three dots hold on a section's row: every one the message or the
 * opener the hover bar and the top bar already use, so it does what they do.
 */
function sectionMoreItems(win, section) {
  const sections = htmlTreeUi.sections || [];
  const at = sections.findIndex((item) => item.uid === section.uid);
  const post =
    (type, extra = {}) =>
    () => {
      closeHtmlTreeMenu();
      win.postMessage({ source: SOURCE, type, uid: section.uid, ...extra }, win.location.origin);
      // A move changes the values on the next task; the rows are read from them.
      win.setTimeout(() => renderHtmlTree(win), 60);
    };
  const items = [
    { label: t(win, 'move_up'), icon: MORE_ICONS.up, onPick: at > 0 ? post(MSG.MOVE, { direction: -1 }) : null },
    {
      label: t(win, 'move_down'),
      icon: MORE_ICONS.down,
      onPick: at >= 0 && at < sections.length - 1 ? post(MSG.MOVE, { direction: 1 }) : null,
    },
    { label: t(win, 'html_tree_save_section'), icon: MORE_ICONS.save, onPick: post(MSG.SAVE_SECTION) },
    { label: t(win, 'add_section_below'), icon: MORE_ICONS.add, onPick: post(MSG.ADD_SET) },
  ];

  // A static section has no fieldset: its right-click menu offers to add one.
  if (canEditFields(win) && section.type && !section.static) {
    // Held with the file when it is the file on show: changing what fields a
    // section has while the template that renders them is locked is the
    // half-made edit the lock exists to stop.
    const held = section.current && !htmlTreeUi.canEdit;

    items.push({
      label: t(win, 'html_tree_fieldset'),
      icon: MORE_ICONS.fieldset,
      onPick: held
        ? null
        : () => {
            closeHtmlTreeMenu();
            openFieldsetOverlay(win, section.type);
          },
    });
  }

  return items;
}

/** The padlock, on any row of the file that can stand on its own. Shut and lit in the row while it holds. */
function lockMoreItem(win, row) {
  const open = htmlTreeUi.canEdit && (!row.locked || htmlTreeUi.canUnlock);

  return {
    label: row.locked
      ? htmlTreeUi.canUnlock
        ? htmlTreeUi.unlockTitle
        : htmlTreeUi.lockedByTitle
      : htmlTreeUi.lockTitle,
    icon: row.locked ? MORE_ICONS.unlock : MORE_ICONS.lock,
    onPick: open
      ? () => {
          closeHtmlTreeMenu();
          toggleHtmlTreeLock(win, row.id);
        }
      : null,
  };
}

/**
 * The three dots on a row, opened by resting on them or pressing them. A section
 * offers what acts on the section; any other row its padlock and what a
 * right-click offers. Resting on the dots picks nothing.
 */
export function openHtmlTreeRowMore(win, button, id) {
  if (!button.isConnected || (htmlTreeState.htmlTreeMenu && htmlTreeMoreButton === button)) {
    return;
  }

  const section = sectionOfHtmlTreeRow(id);
  const row = htmlTreeUi.rows.find((item) => item.id === id);

  if (!section) {
    openHtmlTreeMenu(win, null, id, { anchor: button, lead: row ? [lockMoreItem(win, row)] : [] });

    return;
  }

  closeHtmlTreeMenu();

  htmlTreeMoreButton = button;
  button.closest('[data-sve-ht-row]')?.setAttribute('data-sve-ht-more-open', '');
  htmlTreeState.htmlTreeMenu = openCpOverlay(win.document, HtmlTreeMenu, {
    items: [...sectionMoreItems(win, section), ...(row ? [lockMoreItem(win, row)] : [])],
    x: 0,
    y: 0,
    anchor: button,
    onClose: () => {
      htmlTreeState.htmlTreeMenu = null;
      releaseHtmlTreeMore();
    },
  });
}

/**
 * What the section's menu adds for whoever may configure fields: whether
 * editors may insert this type from Patterns (Statamic's own `hide` on the
 * set), and for a static section the way out of being static — fields. Both
 * edit the fieldset in the repository, so both are gated the way making a
 * section is. Empty for everyone else.
 */
function sectionTypeItems(win, uid) {
  const section = htmlTreeUi.sections?.find((item) => item.uid === uid);
  const type = section?.type || '';

  if (!type || !canCreateSections(win)) {
    return [];
  }

  const name = section.label || type;
  const hidden = isHiddenType(win, type);
  const failed = () => win.Statamic?.$toast?.error(t(win, 'section_update_failed'));

  const items = [
    {
      label: t(win, 'static_section_insertable'),
      icon: hidden ? TOGGLE_OFF : TOGGLE_ON,
      onPick: () => {
        closeHtmlTreeMenu();

        void updateSectionType(win, { handle: type, hidden: !hidden })
          .then(() => {
            win.Statamic?.$toast?.success(
              t(win, hidden ? 'section_shown_to_editors' : 'section_hidden_from_editors', { name })
            );
            // The Patterns panel's list is the one this changes.
            libraryStale(win);
          })
          .catch(failed);
      },
    },
  ];

  if (section.static) {
    items.push({
      label: t(win, 'section_add_fields'),
      onPick: () => {
        closeHtmlTreeMenu();

        // The fieldset is written and imported; the section is an ordinary
        // one from here. Its root gets the fields icon on the next paint, and
        // the fieldset opens straight away — adding fields was the point.
        void updateSectionType(win, { handle: type, fields: true })
          .then(() => {
            win.Statamic?.$toast?.success(t(win, 'section_fields_added', { name }));
            libraryStale(win);
            renderHtmlTree(win);
            openFieldsetOverlay(win, type);
          })
          .catch(failed);
      },
    });
  }

  return items;
}

function openHtmlTreeSectionMenu(win, event, section) {
  const uid = section.row?.section || section.uid;

  if (!uid) {
    return;
  }

  htmlTreeState.htmlTreeMenu = openCpOverlay(win.document, HtmlTreeMenu, {
    items: [
      ...sectionTypeItems(win, uid),
      {
        label: t(win, 'html_tree_remove_section'),
        danger: true,
        onPick: () => {
          closeHtmlTreeMenu();
          // Same question, same words as the block tree and the hover bar: a
          // section takes one click to remove and holds everything inside it,
          // and the page it leaves behind looks like it was always that way.
          removeSectionFromPage(win, uid);
        },
      },
    ],
    x: event.clientX,
    y: event.clientY,
    onClose: () => {
      htmlTreeState.htmlTreeMenu = null;
    },
  });
}

/**
 * The menu on a row. From a right-click it opens at the pointer; from the three
 * dots (`anchor`) under them, with `lead` above what the row offers, and the row
 * is picked only when an item is chosen: resting on the dots changes nothing.
 */
export function openHtmlTreeMenu(win, event, id, { anchor = null, lead = [] } = {}) {
  closeHtmlTreeMenu();

  // A shut section is drawn by the same row component as every tag, but it does
  // not live in `rows` — it lives in `sections`. Looking only in `rows` is why
  // right-clicking a section in this tree did nothing at all.
  const section = htmlTreeUi.sections?.find((item) => item.row?.id === id);

  if (section) {
    openHtmlTreeSectionMenu(win, event, section);

    return;
  }

  const row = htmlTreeUi.rows.find((item) => item.id === id);

  if (!row) {
    return;
  }

  if (!anchor) {
    selectHtmlTreeRow(win, id, htmlTreeUi.rows);
  }

  const at = anchor ? { x: 0, y: 0 } : { x: event.clientX, y: event.clientY };
  const show = (rowItems) => {
    const items = [
      ...lead,
      ...rowItems.map((item) =>
        anchor && item.onPick
          ? {
              ...item,
              onPick: () => {
                selectHtmlTreeRow(win, id, htmlTreeUi.rows);
                item.onPick();
              },
            }
          : item
      ),
    ];

    if (!items.length) {
      return;
    }

    htmlTreeState.htmlTreeMenu?.dismiss();

    if (anchor) {
      htmlTreeMoreButton = anchor;
      anchor.closest('[data-sve-ht-row]')?.setAttribute('data-sve-ht-more-open', '');
    }

    htmlTreeState.htmlTreeMenu = openCpOverlay(win.document, HtmlTreeMenu, {
      items,
      x: at.x,
      y: at.y,
      anchor,
      onClose: () => {
        htmlTreeState.htmlTreeMenu = null;
        releaseHtmlTreeMore();
      },
    });
  };

  /*
   * The layout's header and footer calls are the frame, not one more
   * component. Their menu offers the frame's own door — `enterFrame`, the
   * same question and the same step-in a click on the half gives in the
   * preview — instead of pushing the file into the dock behind it: opening
   * `site_head` that way left the preview unfocused and the half's form shut,
   * so the site had two ways in that ended somewhere different.
   */
  if (row.frameCall) {
    show([
      {
        // The same word the confirm uses, so the menu and the question it
        // opens name one thing: "Edit the header" -> "Global header".
        label: t(win, 'html_tree_frame_edit', { frame: t(win, `chrome_${row.frameCall}`) }),
        onPick: () => {
          closeHtmlTreeMenu();
          enterFrame(win, row.frameCall);
        },
      },
    ]);

    return;
  }

  if (row.kind === 'component') {
    openComponentRow(win, row, show);

    return;
  }

  // A slot is a hole, not a tag: nothing in the menu applies to it. Nor to a
  // sections loop: made a component, it would carry every page's sections
  // off into another file. Nor to an `{{ svg }}`: it is a call, not markup.
  if (row.kind === 'slot' || row.kind === 'sections' || row.kind === 'svg' || row.locked || row.lockedIn) {
    show([]);

    return;
  }

  if (!htmlTreeUi.canEdit) {
    show([]);

    return;
  }

  // The open component's own root already is a component; making it one
  // again would wrap the file in a copy of itself. The tags under it may
  // still become components of their own.
  if (row.componentRoot) {
    show([]);

    return;
  }

  show([
    // The open section's root: the same switches its shut row offers.
    ...(row.sectionRoot ? sectionTypeItems(win, row.sectionRoot) : []),
    {
      label: t(win, 'component_make'),
      onPick: () => {
        closeHtmlTreeMenu();
        extractComponent(win, row, {
          onDone: () => renderHtmlTree(win),
          onError: (err) => {
            win.alert(err?.status === 409 ? t(win, 'component_exists') : t(win, 'component_failed'));
          },
        });
      },
    },
  ]);
}

const openComponent = (win, type) => {
  closeHtmlTreeMenu();
  ask('dock:open-template', type);
};

/**
 * A `{{ partial src="blocks/{type}" }}` is not one file — the block being
 * rendered decides which. So the row offers the folder: every partial the call
 * could resolve to, the way the dock's own partial links do.
 */
function openComponentRow(win, row, show) {
  if (!hasToken(row.src)) {
    show([
      {
        // The file that opens, by its own name. The row may wear another: a
        // section written as one component call wears the section's.
        label: t(win, 'component_open_named', { name: componentName(row.src) || row.src }),
        onPick: () => openComponent(win, `view:partials/${row.src}`),
      },
    ]);

    return;
  }

  show([{ label: t(win, 'code_dock_loading'), onPick: null }]);

  win
    .fetch(`/!/sve/section-template/partials?src=${encodeURIComponent(row.src)}`, {
      credentials: 'same-origin',
      headers: { 'X-Requested-With': 'XMLHttpRequest', Accept: 'application/json' },
    })
    .then((res) => (res.ok ? res.json() : { items: [] }))
    .then((data) => {
      const items = Array.isArray(data.items) ? data.items : [];

      show(
        items.length
          ? items.map((item) => ({
              label: t(win, 'component_open_named', { name: item.label }),
              onPick: () => openComponent(win, item.type),
            }))
          : [{ label: t(win, 'component_none'), onPick: null }]
      );
    })
    .catch(() => show([{ label: t(win, 'component_none'), onPick: null }]));
}
