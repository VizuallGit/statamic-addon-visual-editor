/**
 * html-tree.js — pick, rename, lock, hide, copy, delete, video, Alpine.
 * Split out of html-tree.js in the quality pass (tab G): the same statements, in the same
 * order; only the imports are new. html-tree.js re-exports this file.
 */
import { t } from '../lib/i18n.js';
import { alpineBooleans, xDataOf } from '../lib/alpine-booleans.js';
import { ask } from '../cp/bus.js';
import { htmlTreeUi } from '../cp/html-tree/store.js';
import { duplicateHtml, deleteHtml, lockHtml, toggleHiddenHtml, unlockHtml } from '../html-tree-edit.js';
import { writeHtmlTreeLabel } from '../html-tree-labels.js';
import { openCpOverlay } from '../cp/open-overlay.js';
import HtmlTreeMenu from '../cp/surfaces/HtmlTreeMenu.vue';
import { humanizeHandle, unwrapRef } from '../lib/values.js';
import { sectionField } from '../lib/config.js';
import { activeContainers } from '../lib/publish-containers.js';
import { setMeta } from '../lib/row-meta.js';
import { handleRemoveRow, renderedSectionType } from '../section-library.js';
import { confirmCloseDiscard } from '../pages.js';
import { MSG, SOURCE } from '../lib/protocol.js';
import { htmlTreeFolds, htmlTreeState } from './state.js';
import { flipAlpineState, htmlTreePanel, openHtmlTreeSection, sendPick } from '../html-tree.js';
import { renderHtmlTree } from './render.js';
import { TOGGLE_OFF, TOGGLE_ON, closeHtmlTreeMenu } from './menus.js';
import { htmlTreeSections } from './sections.js';
import { dockHtml, writeDockHtml } from './prefetch.js';

export function publishHtmlPick(win, roots) {
  if (!htmlTreePanel(win.document)) {
    return;
  }

  sendPick(win, roots);
}

/**
 * Open every row on the way down to this one.
 *
 * By walking for the node and opening what it was found inside, not by cutting
 * the path into prefixes: a tag's path counts only tags, so the `{{ if }}` and
 * `{{ collection }}` rows it sits inside are nowhere in its own path. Matching
 * on prefixes left every one of those shut — and a row inside a shut row is not
 * drawn, so a click in the preview marked nothing and looked broken.
 */
export function expandHtmlTreePath(path) {
  if (!path) {
    return;
  }

  const walk = (nodes, depth) => {
    for (const node of nodes || []) {
      if (node.path === path) {
        return true;
      }

      if (walk(node.children, depth + 1)) {
        // `htmlTreeShut` reads the flip against the default for that depth: the
        // top — the first level, or the layout's <body> — is open already,
        // everything under it is not.
        if (depth === 0 || node.path === htmlTreeState.htmlTreeTopPath) {
          htmlTreeFolds.delete(node.path);
        } else {
          htmlTreeFolds.add(node.path);
        }

        return true;
      }
    }

    return false;
  };

  walk(htmlTreeState.htmlTreeRoots, 0);
}

export function beginHtmlTreeRename(win, id) {
  if (htmlTreeState.htmlTreeSuppressClick) {
    return;
  }

  const row = htmlTreeUi.rows.find((item) => item.id === id);

  if (refuseLocked(win, row)) {
    return;
  }

  // The label renames a class. A condition, loop or component row has no class
  // behind it — its name is what the template says, and is edited as such.
  if (!row || row.kind) {
    return;
  }

  htmlTreeState.htmlTreeActiveId = id;
  htmlTreeUi.rows.forEach((item) => {
    item.current = item.id === id;
  });
  htmlTreeUi.editingId = id;
  htmlTreeUi.draft = row.name;

  win.setTimeout(() => {
    const input = htmlTreePanel(win.document)?.querySelector('[data-sve-ht-rename]');

    input?.focus();
    input?.select();
  }, 0);
}

export function finishHtmlTreeRename(win, save) {
  const id = htmlTreeUi.editingId;

  if (!id) {
    return;
  }

  const row = htmlTreeUi.rows.find((item) => item.id === id);

  htmlTreeUi.editingId = null;

  if (save && row) {
    if (row.sectionRoot) {
      // The open page section's root: the name belongs to this section on
      // this page, not to the file every section of its type renders through
      // — renaming one FAQ must leave the other FAQ its name.
      writeSectionLabel(win, row.sectionRoot, htmlTreeUi.draft);
    } else {
      writeHtmlTreeLabel(ask('dock:current-type') || '', row.path, htmlTreeUi.draft, row.base || row.klass);
    }
  }

  htmlTreeUi.draft = '';
  renderHtmlTree(win);
}

/**
 * The name one section wears on this page: `_sve_label` on its row, the same
 * field the block tree and the focus header read. Empty, or the set's own
 * name again, takes the field off — the row goes back to what its type is
 * called.
 */
function writeSectionLabel(win, uid, label) {
  const field = sectionField(win) || 'page_sections';
  const next = String(label || '')
    .replace(/\s+/g, ' ')
    .trim();

  for (const container of activeContainers(win.document) || []) {
    const values = unwrapRef(container.values);
    const list = values && typeof values === 'object' ? values[field] : null;

    if (!Array.isArray(list)) {
      continue;
    }

    const index = list.findIndex(
      (row) => row && typeof row === 'object' && [row._visual_id, row.id, row._id].includes(uid)
    );

    if (index === -1) {
      continue;
    }

    const type = renderedSectionType(win, list[index]);
    const given = setMeta(win, type)?.display || humanizeHandle(type) || type;
    const rows = JSON.parse(JSON.stringify(list));

    rows[index] = { ...rows[index] };

    if (!next || next === given) {
      delete rows[index]._sve_label;
    } else {
      rows[index]._sve_label = next;
    }

    container.setFieldValue(field, rows);

    return true;
  }

  return false;
}

/**
 * The file's Alpine components, by node id: which of its `x-data` tags each
 * one is, in document order — the order the preview counts `[x-data]` in a
 * section, a half of the frame or the layout — and the booleans it starts
 * with. Counted over the whole file (a half's file: its marked element), not
 * the rows on screen: folding a branch must not change which component a
 * number names. A commented-out tag is not in the preview and is not counted.
 */
export function alpineComponents(roots, html) {
  const out = new Map();
  let nth = 0;

  const walk = (nodes) => {
    for (const node of nodes) {
      if (node.hidden) {
        continue;
      }

      const source = node.kind ? null : xDataOf(html.slice(node.from, node.openTo));

      if (source !== null) {
        out.set(node.id, { nth: nth++, booleans: alpineBooleans(source) });
      }

      walk(node.children || []);
    }
  };

  walk(roots);

  return out;
}

/**
 * The Alpine icon on a row whose x-data has booleans. One boolean: the press
 * sets it. Several: the row menu lists them, each with a check for what the
 * preview shows, and a line sets that one.
 */
export function openAlpineState(win, event, id) {
  const row = htmlTreeUi.rows.find((item) => item.id === id);

  if (!row || !(row.alpineNth >= 0)) {
    return;
  }

  if (row.alpineKeys.length === 1) {
    flipAlpineState(win, row, row.alpineKeys[0]);

    return;
  }

  const rect = event.currentTarget.getBoundingClientRect();

  closeHtmlTreeMenu();
  htmlTreeState.htmlTreeMenu = openCpOverlay(win.document, HtmlTreeMenu, {
    items: row.alpineKeys.map((item) => ({
      label: item.key,
      icon: item.value ? TOGGLE_ON : TOGGLE_OFF,
      onPick: () => {
        closeHtmlTreeMenu();
        flipAlpineState(win, row, item);
      },
    })),
    x: Math.round(rect.left),
    y: Math.round(rect.bottom + 4),
    onClose: () => {
      htmlTreeState.htmlTreeMenu = null;
    },
  });
}

/**
 * A row the padlock holds: locked itself, or inside something locked. Nothing
 * in the tree changes it — not delete, copy, hide, move, rename or a drop — and
 * the dock refuses it too (dock:set-html). Says so once, and answers true.
 */
export function refuseLocked(win, row) {
  if (!row || !(row.locked || row.lockedIn)) {
    return false;
  }

  win.Statamic?.$toast?.error(t(win, 'html_tree_locked_element'));

  return true;
}

/** Whether this user may take a lock off: the developers, who configure fields. */
export function mayUnlock(win) {
  return win.Statamic?.$permissions?.has?.('configure fields') === true;
}

/**
 * The padlock on a row. Anyone who may edit the file locks; only a developer
 * unlocks, and is asked first — unlocking is meant to be the extra step.
 */
export function toggleHtmlTreeLock(win, id) {
  const row = htmlTreeUi.rows.find((item) => item.id === id);

  if (!row || row.lockedIn || ask('dock:is-locked')) {
    return;
  }

  if (!row.locked) {
    applyHtmlEdit(win, id, lockHtml, { lockAction: true });

    return;
  }

  if (!mayUnlock(win)) {
    win.Statamic?.$toast?.error(t(win, 'html_tree_unlock_denied'));

    return;
  }

  confirmCloseDiscard(
    win,
    {
      titleKey: 'html_tree_unlock_title',
      bodyKey: 'html_tree_unlock_body',
      confirmKey: 'html_tree_unlock_confirm',
    },
    () => applyHtmlEdit(win, id, unlockHtml, { lockAction: true, unlock: true })
  );
}

/**
 * A `fixed` row (renderHtmlTree): the layout's header or footer call, or the
 * <body>. Its buttons are not drawn; this is the other way in — the handlers
 * below — shut as well.
 */
function isFixedHtmlTreeRow(id) {
  return !!htmlTreeUi.rows.find((item) => item.id === id)?.fixed;
}

/** The section a row stands for: shut, a row of its own in `sections`; open, the first of the file's tag rows. */
export function sectionOfHtmlTreeRow(id) {
  const shut = htmlTreeUi.sections?.find((item) => item.row?.id === id);

  if (shut) {
    return shut;
  }

  const uid = htmlTreeUi.rows.find((item) => item.id === id)?.sectionRoot;

  return uid ? htmlTreeUi.sections?.find((item) => item.uid === uid) || null : null;
}

export function hideHtmlTreeRow(win, id) {
  if (isFixedHtmlTreeRow(id)) {
    return;
  }

  const section = sectionOfHtmlTreeRow(id);
  const row = htmlTreeUi.rows.find((item) => item.id === id);

  // A section hides on this page, as Statamic's own set switch does. A root
  // already commented out in the file is the exception: this eye is the way
  // back, or it would stay out on every page with nothing to press.
  if (section && !(row?.hidden && row.wrapFrom != null)) {
    win.postMessage(
      { source: SOURCE, type: MSG.HIDE_ROW, uid: section.uid, show: !section.enabled },
      win.location.origin
    );
    // The values change on the next task; the rows are read from them.
    win.setTimeout(() => renderHtmlTree(win), 60);

    return;
  }

  applyHtmlEdit(win, id, toggleHiddenHtml);
}

export function duplicateHtmlTreeRow(win, id) {
  if (isFixedHtmlTreeRow(id)) {
    return;
  }

  // A section, shut or open: a copy of it on the page, the way the hover bar
  // makes one — not a second copy of the markup in the file. The file's lock
  // does not apply; the file is not touched.
  const uid = sectionOfHtmlTreeRow(id)?.uid;

  if (uid) {
    win.postMessage({ source: SOURCE, type: MSG.DUPLICATE_ROW, uid }, win.location.origin);

    return;
  }

  applyHtmlEdit(win, id, duplicateHtml);
}

/**
 * Takes one section off this one page, after asking.
 *
 * Shared by the row's delete control and the right-click menu, and worth
 * sharing: the question, its words and the removal itself all have to match
 * what the block tree and the hover bar do, or the same act would read three
 * ways depending on where it was started.
 */
export function removeSectionFromPage(win, uid) {
  confirmCloseDiscard(
    win,
    {
      titleKey: 'remove_section_title',
      bodyKey: 'remove_section_body',
      confirmKey: 'remove_section_confirm',
    },
    () => {
      const doc = win.document;

      handleRemoveRow({ uid }, doc, win); // the tree follows up through row:removed below
    }
  );
}

/**
 * After a section leaves the page, the tree and dock must leave with it.
 *
 * `handleRemoveRow` updates publish values and Live Preview, but the tree only
 * watched the dock's HTML — so the deleted section's tags stayed on screen.
 * Step into whatever is left, or clear the tree down to the plus.
 */
export function afterHtmlTreeSectionRemoved(win, doc, removedUid) {
  if (htmlTreeState.htmlTreePendingUid === removedUid) {
    win.clearTimeout(htmlTreeState.htmlTreePendingTimer);
    htmlTreeState.htmlTreePendingUid = '';
    htmlTreeState.htmlTreeAhead = '';
  }

  htmlTreeState.htmlTreeActiveId = null;
  htmlTreeState.htmlTreeShutStart = false;
  htmlTreeState.htmlTreeFileKey = '';

  const sections = htmlTreeSections(win, doc);
  const next = sections.find((section) => section.uid !== removedUid) || sections[0];

  if (next) {
    openHtmlTreeSection(win, doc, sections, next.uid, '');
  } else {
    // Empty tree + plus. Clear dock view without autosaving an empty file.
    htmlTreeState.htmlTreeAhead = '';
    htmlTreeUi.rows = [];
    htmlTreeUi.sections = [];
    htmlTreeUi.frame = null;
    htmlTreeUi.pageBuilder = true;
    renderHtmlTree(win); // the dock empties itself on the same row:removed event
  }

  win.setTimeout(() => {
    if (htmlTreePanel(win.document)) {
      renderHtmlTree(win);
    }
  }, 0);
}

/**
 * Delete on a section row means the section; on a tag row it means the tag.
 *
 * They look alike and are not alike: a tag is removed from the Antlers file, so
 * it goes from every page that renders it, while a section is one row of this
 * page's page_sections and the file is untouched. Pointing the control on a
 * section row at the template was the wrong of the two — the row says the
 * section's name and sits in a list of sections, so that is what it is about.
 */
export function deleteHtmlTreeRow(win, id) {
  // No bin on a fixed row, and no other way in either: taking the header or
  // the footer call out takes that half off every page, and without the
  // <body> there is no page.
  if (isFixedHtmlTreeRow(id)) {
    return;
  }

  // Shut, a section is a row of its own in `sections`. Open, the section is the
  // first of the file's tag rows — the one carrying `sectionRoot`.
  const shut = htmlTreeUi.sections?.find((item) => item.row?.id === id);
  const uid = shut ? shut.row?.section || shut.uid : htmlTreeUi.rows.find((item) => item.id === id)?.sectionRoot;

  if (uid) {
    removeSectionFromPage(win, uid);

    return;
  }

  // The template's sections loop: every page drawn with it stops showing its
  // sections. Asked first; the pages' content stays where it is.
  if (htmlTreeUi.rows.find((item) => item.id === id)?.kind === 'sections') {
    confirmCloseDiscard(
      win,
      {
        titleKey: 'html_tree_sections_remove_title',
        bodyKey: 'html_tree_sections_remove_body',
        confirmKey: 'html_tree_sections_remove_confirm',
      },
      () => applyHtmlEdit(win, id, deleteHtml)
    );

    return;
  }

  applyHtmlEdit(win, id, deleteHtml);
}

function applyHtmlEdit(win, id, fn, { lockAction = false, unlock = false } = {}) {
  if (ask('dock:is-locked')) {
    return;
  }

  const html = dockHtml();
  const node = htmlTreeUi.rows.find((item) => item.id === id);

  if (!node || (!lockAction && refuseLocked(win, node))) {
    return;
  }

  const next = fn(html, node);

  if (next !== html) {
    writeDockHtml(next, { unlock });
  }
}
