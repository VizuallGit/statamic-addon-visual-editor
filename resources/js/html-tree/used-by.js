/**
 * html-tree.js — "Used by" and the page's own template.
 * Split out of html-tree.js in the quality pass (tab G): the same statements, in the same
 * order; only the imports are new. html-tree.js re-exports this file.
 */
import { t } from '../lib/i18n.js';
import { ask } from '../cp/bus.js';
import { htmlTreeUi } from '../cp/html-tree/store.js';
import { collectionTemplatesCollection, sectionLoopFields } from '../lib/config.js';
import { currentCollection, currentEntryId } from '../lib/live-preview.js';
import { ownPageSections, ownPageType, rememberOwnPage } from '../lib/own-page.js';
import { inLivePreview, openTemplateSlot, templateUsage } from '../lp-templates.js';
import { openCollections } from '../lp-collections.js';
import { navigateFromLp } from '../pages.js';
import { renderHtmlTree } from './render.js';

/**
 * Is the page on screen one whose markup is a template it shares with others?
 *
 * A page built from sections is edited through its sections, and a template's
 * own entry (the templates collection, opened from the board) is where a
 * template is edited. Anything else — a service, a case, an employee — is drawn
 * whole by its collection's template, which draws every other entry of it too,
 * and `default` draws the pages as well. Editing that from one page is how a
 * change meant for one page lands on all of them, so the tree names the
 * template and opens it instead. Header, footer and a component opened on the
 * page are the reader's own choice and are drawn as usual.
 */
export function pageOnSharedTemplate(win, pageBuilder, inComponent) {
  if (pageBuilder || inComponent) {
    return false;
  }

  const part = String(ask('dock:chrome-kind') || '');

  if (part === 'header' || part === 'footer') {
    return false;
  }

  const entry = currentEntryId(win);

  // A page with a template of its own (OwnPage): the file is the page's alone,
  // so it is drawn and edited right here.
  if (ownPageType(win)) {
    return false;
  }

  return !!entry && entry !== 'create' && currentCollection(win) !== collectionTemplatesCollection(win);
}

/**
 * How the tree reads a file: a loop over a sections field is one fixed row,
 * "Sidens sektioner" (html-tree-parse.js, addAntlersBlocks).
 */
export function treeOptions(win) {
  // The fields the open template's pages keep their sections in, too: a field
  // made since the Control Panel loaded is not in the site's list yet.
  const loops = [...new Set([...sectionLoopFields(win), ...ownPageSections(win), ...htmlTreeUi.templateSections])];

  return { sectionLoops: loops, sectionsLabel: t(win, 'html_tree_sections_slot') };
}

/** Entries asked whether they have a template of their own, on a page built from sections: once each. */
const ownPageAsked = new Set();

/**
 * A page built from sections may have a template of its own too — an own page
 * whose blueprint has a sections field. Asked once; when it has, the page's
 * file is what the dock holds while no section is chosen, as on any own page,
 * and the tree draws it (the sections are drawn by its loop).
 */
export function learnOwnPage(win) {
  const entry = currentEntryId(win);

  if (!entry || entry === 'create' || ownPageAsked.has(entry) || ownPageType(win)) {
    return;
  }

  ownPageAsked.add(entry);

  void templateUsage(win, { entry }).then((usage) => {
    if (!usage?.own_page || !usage.view || currentEntryId(win) !== entry) {
      return;
    }

    rememberOwnPage(entry, usage.view, usage.sections_fields);

    // The dock stood empty for want of a section: now there is the page's file.
    if (!ask('dock:current-type')) {
      ask('dock:open-file', `view:${usage.view}`);
    }

    renderHtmlTree(win);
  });
}

/** What the tree says in place of a shared template's rows (`htmlTreeUi.pageTemplate`). */
export function pageTemplateUi(win, entry) {
  const ui = {
    entry,
    text: '',
    note: t(win, 'html_tree_page_template_note'),
    openLabel: t(win, 'html_tree_open_template'),
    canOpen: false,
    onOpen: null,
  };

  // The answer is on its way; the line fills in when it lands, if this page
  // is still the one on screen.
  void templateUsage(win, { entry }).then((usage) => {
    if (!usage || htmlTreeUi.pageTemplate?.entry !== entry) {
      return;
    }

    // The page's own template: the dock opens it on the page, and the tree
    // draws its rows instead of naming it. Drawn straight away; the dock's
    // load draws it again when the file lands. (Waiting for the load first,
    // `await dock:load-settled` as enterFrame does, lost Build's pick: Style
    // then wrote on the file's root instead of the element picked — measured
    // with probe-own-page-canvas, 2 of 2 runs, 9 Nov 2026.)
    if (usage.own_page && usage.view) {
      rememberOwnPage(entry, usage.view, usage.sections_fields);
      ask('dock:open-file', `view:${usage.view}`);
      renderHtmlTree(win);

      return;
    }

    htmlTreeUi.pageTemplate = {
      ...htmlTreeUi.pageTemplate,
      text: t(win, 'html_tree_page_template', { name: usage.name }),
      canOpen: !!usage.open,
      onOpen: usage.open ? (anchor) => openTemplateSlot(win, anchor, usage.open) : null,
    };
  });

  return ui;
}

/**
 * The line above a template open on its own entry: who is drawn with it. Only
 * while the dock holds the template's own file — a section or a component
 * opened from it is not what the line is about.
 */
export function paintUsedBy(win, collectionView) {
  // An own page's file is the page's alone: nobody else to name, and the loop
  // it may draw is over the page's own sections field.
  const own = ownPageType(win);

  if (own && ask('dock:current-type') === own) {
    htmlTreeUi.usedBy = null;
    htmlTreeUi.templateSections = ownPageSections(win);

    return;
  }

  const view = collectionView.replace(/^view:/, '');

  if (!view || ask('dock:current-type') !== collectionView) {
    htmlTreeUi.usedBy = null;
    htmlTreeUi.templateSections = [];

    return;
  }

  if (htmlTreeUi.usedBy?.view === view) {
    return;
  }

  htmlTreeUi.usedBy = null;

  void templateUsage(win, { view }).then((usage) => {
    if (!usage || ask('dock:current-type') !== collectionView) {
      return;
    }

    // One chip per collection, taxonomy or page drawn with it; the layout
    // frames every page, so it gets the one chip that says so.
    const items = usage.everything
      ? [{ name: t(win, 'html_tree_used_by_everything'), kind: 'everything', url: null }]
      : usage.used_by.map((item) => ({ ...item, ...usedByOpener(win, item) }));

    const fields = Array.isArray(usage.sections_fields) ? usage.sections_fields : [];
    const fieldsChanged = fields.join() !== htmlTreeUi.templateSections.join();

    htmlTreeUi.templateSections = fields;
    htmlTreeUi.usedBy = {
      view,
      label: t(win, 'html_tree_used_by'),
      items,
      empty: items.length ? '' : t(win, 'html_tree_used_by_nobody'),
      hint: items.length ? t(win, 'html_tree_used_by_hint', { list: items.map((item) => item.name).join(', ') }) : '',
    };

    // The loops the file is read for, and the "not shown yet" rows, go by these fields: drawn again with them.
    if (fieldsChanged) {
      renderHtmlTree(win);
    }
  });
}

/**
 * The sections fields of the open template's pages that it draws no loop over
 * — each a row "Page sections — not shown yet · Add here" at the end of the
 * tree. Read off the whole file, folds and all.
 */
export function missingSectionLoops(roots, fields = htmlTreeUi.templateSections) {
  const looped = new Set();
  const walk = (nodes) => {
    for (const node of nodes || []) {
      if (node.kind === 'sections') {
        looped.add(node.tag);
      }

      walk(node.children);
    }
  };

  walk(roots);

  return fields.filter((field) => !looped.has(field));
}

/**
 * Where a "Used by" chip goes. A collection or a taxonomy opens its own
 * listing in the collections drawer; a page opens itself in Live Preview,
 * unsaved work asked about first. The count of pages not named goes nowhere.
 */
function usedByOpener(win, item) {
  if (!item.url) {
    return { openLabel: '', onOpen: null };
  }

  const openLabel = t(win, 'html_tree_used_by_open', { name: item.name });

  if (item.kind === 'page') {
    return { openLabel, onOpen: (anchor) => navigateFromLp(win, anchor, inLivePreview(win, item.url)) };
  }

  return { openLabel, onOpen: (anchor) => openCollections(win, { anchor, url: item.url, subtitle: item.name }) };
}
