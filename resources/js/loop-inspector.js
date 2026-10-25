/**
 * A loop's inspector: what it repeats (a field, a collection, a navigation),
 * how it is sorted, how much of it renders.
 *
 * Shared by the HTML tree's panel under the tree and the dock's help popup on
 * a loop's own tag, so the two write the same tag the same way — one model,
 * one set of edits. Pure: a model is built from a loop row, and an edit is
 * `(html, node) => html` for the caller to apply where it applies text (the
 * tree through its dock writer, the popup through the editor). The one piece
 * of UI state — a sort direction chosen before its field — is the caller's,
 * handed in as `draft` and back as `{ draft }`.
 *
 * The row is the tree's antlers row (html-tree-parse.js, addAntlersBlocks):
 * `antlers: 'loop'`, `loopKind`, `expr`, `sortField`, `sortDir`, `limit`,
 * `offset`, `paginate`, `navDepth`, `includeHome`, `params`, `from`, `openTo`,
 * `to`. `loopNodeOf` makes one from a block (antlers-blocks.js) for a caller
 * that has no tree.
 *
 * May import: antlers-blocks.js, antlers-edit.js, lib/.
 */
import { NAV_PAGES } from './antlers-blocks.js';
import { writeLoopSource, writeLoopTag } from './antlers-edit.js';
import { t } from './lib/i18n.js';

export function siteCollections(win) {
  const list = win.Statamic?.$config?.get?.('sveCollections');

  return Array.isArray(list) ? list : [];
}

/**
 * The site's Navigation structures, for the Nav loop.
 *
 * The pages collection's own tree is not one of them and is added by the panel,
 * because `{{ nav }}` reaches it by handle rather than through a navigation. A
 * site with none configured therefore still has something to loop.
 */
export function siteNavigations(win) {
  const list = win.Statamic?.$config?.get?.('sveNavigations');

  return Array.isArray(list) ? list : [];
}

/** Every source the Nav loop offers: the pages tree first, then the navigations. */
export function navSources(win) {
  return [
    { handle: NAV_PAGES, title: t(win, 'antlers_nav_pages') },
    ...siteNavigations(win).map((nav) => ({ handle: nav.handle, title: nav.title })),
  ];
}

/** Which of the three a row is, as the panel's segment names them. */
export function loopKindOf(row) {
  return row?.loopKind === 'collection' ? 'collection' : row?.loopKind === 'nav' ? 'nav' : 'field';
}

/**
 * The tree's row for a loop block, for a caller without a tree: the same
 * fields addAntlersBlocks copies, so antlers-edit writes it the same way.
 */
export function loopNodeOf(block) {
  if (!block || block.kind !== 'loop') {
    return null;
  }

  return {
    id: `antlers-${block.from}`,
    tag: block.name,
    kind: 'antlers',
    antlers: 'loop',
    loopKind: block.loopKind || '',
    handle: block.handle || '',
    params: block.params || '',
    sortField: block.sortField || '',
    sortDir: block.sortDir || '',
    limit: block.limit || '',
    offset: block.offset || '',
    paginate: !!block.paginate,
    alias: block.alias || '',
    navDepth: block.navDepth || '',
    includeHome: !!block.includeHome,
    expr: block.expr,
    from: block.from,
    to: block.to,
    openTo: block.openTo,
  };
}

/**
 * What the panel shows for a loop row.
 *
 * `draft`: a sort direction chosen a moment ago, with no field to sort by yet
 * (see loopSortDirEdit). `key` keys the inputs: by the row alone, not by what
 * is typed in it, or a repaint mid-edit would rebuild the input and lose the
 * caret.
 */
export function loopInspectModel(win, row, { key = row.id, draft = '' } = {}) {
  const collection = row.loopKind === 'collection';
  const nav = row.loopKind === 'nav';
  const dir = row.sortDir || draft;
  const kinds = [
    { id: 'field', label: t(win, 'antlers_loop_field') },
    { id: 'collection', label: t(win, 'antlers_loop_collection') },
    { id: 'nav', label: t(win, 'antlers_loop_nav') },
  ];

  // A navigation has no sorting and no limit to offer, because the tag has
  // neither: its order is the order it was dragged into. Depth is what
  // shortens it, and the front page is a question only the pages tree has.
  if (nav) {
    const source = row.expr || NAV_PAGES;

    return {
      key,
      title: t(win, 'antlers_loop'),
      mode: 'loop',
      loopKind: 'nav',
      kinds,
      navs: navSources(win),
      value: source,
      placeholder: t(win, 'antlers_pick_nav'),
      nav: {
        depthTitle: t(win, 'antlers_nav_depth'),
        depth: row.navDepth || '',
        depths: [
          { id: '', label: t(win, 'antlers_nav_depth_all') },
          { id: '1', label: t(win, 'antlers_nav_depth_1') },
          { id: '2', label: t(win, 'antlers_nav_depth_2') },
          { id: '3', label: t(win, 'antlers_nav_depth_3') },
        ],
        // Only the pages tree has a front page to leave in or out.
        homeAsked: source === NAV_PAGES,
        homeLabel: t(win, 'antlers_nav_include_home'),
        includeHome: !!row.includeHome,
      },
      branches: [],
    };
  }

  return {
    key,
    title: t(win, 'antlers_loop'),
    mode: 'loop',
    loopKind: collection ? 'collection' : 'field',
    kinds,
    collections: siteCollections(win),
    value: row.expr || '',
    placeholder: t(win, collection ? 'antlers_pick_collection' : 'antlers_loop_placeholder'),
    sort: {
      title: t(win, 'antlers_sort'),
      dir,
      // Random has nothing to sort by, and neither has "as it comes".
      needsField: dir === 'asc' || dir === 'desc',
      field: row.sortField || '',
      // The field picker lists the section's own fields. A collection is
      // sorted by its entries' fields, which are not those — so there it is
      // typed, and the placeholder names the ones every collection has.
      pickable: !collection,
      placeholder: t(win, collection ? 'antlers_sort_field_entry' : 'antlers_sort_field'),
      dirs: [
        { id: '', label: t(win, 'antlers_sort_none') },
        { id: 'asc', label: t(win, 'antlers_sort_asc') },
        { id: 'desc', label: t(win, 'antlers_sort_desc') },
        { id: 'random', label: t(win, 'antlers_sort_random') },
      ],
    },
    // Paginated, the limit is how many go on each page — the same parameter,
    // a different promise, so it says which.
    limit: {
      title: t(win, row.paginate ? 'antlers_limit_per_page' : 'antlers_limit'),
      value: row.limit || '',
      placeholder: t(win, 'antlers_limit_placeholder'),
    },
    offset: {
      title: t(win, 'antlers_offset'),
      value: row.offset || '',
      placeholder: t(win, 'antlers_offset_placeholder'),
    },
    branches: [],
  };
}

/* ---- Edits: (html, node) => html, or null when nothing is to be written ---- */

/** The source typed or picked: a field's handle, or a collection's. */
export function loopSourceEdit(row, value) {
  return (html, node) => writeLoopSource(html, node, loopKindOf(row) === 'collection' ? 'collection' : 'field', value);
}

/**
 * Switching a loop between a field, a collection and a navigation.
 *
 * Nothing is written until there is somewhere to point: turning a field loop
 * into a collection with no collection chosen would break the template, so
 * the caller just offers the picker and waits. The pages tree needs nothing
 * configured, so the Nav kind always has a source to start on.
 */
export function loopKindEdit(win, row, kind) {
  if (kind === loopKindOf(row)) {
    return null;
  }

  if (kind === 'nav') {
    return (html, node) => writeLoopSource(html, node, 'nav', NAV_PAGES);
  }

  if (kind === 'collection') {
    const first = siteCollections(win)[0]?.handle;

    return first ? (html, node) => writeLoopSource(html, node, 'collection', first) : null;
  }

  return (html, node) => writeLoopSource(html, node, 'field', node.handle || 'items');
}

/**
 * A sort direction chosen. Ascending or descending with no field yet is not
 * writable: the caller holds it as `draft` and shows the field it needs.
 * Dropping the sort drops the field with it: a leftover `sort:title` on a
 * loop the panel says is unsorted is a lie the next reader has to unpick.
 *
 * @returns {{ draft: string } | { edit: Function }}
 */
export function loopSortDirEdit(row, value) {
  const dir = String(value || '');

  if ((dir === 'asc' || dir === 'desc') && !row.sortField) {
    return { draft: dir };
  }

  return {
    edit: (html, node) =>
      writeLoopTag(html, node, {
        sortDir: dir,
        sortField: dir === 'asc' || dir === 'desc' ? node.sortField : '',
      }),
  };
}

/**
 * The field to sort by. It completes a direction chosen a moment ago
 * (`draft`); without one at all, ascending is what "sorted" means.
 */
export function loopSortFieldEdit(row, value, draft = '') {
  const field = String(value || '').trim();
  const dir = row.sortDir || draft || 'asc';

  return (html, node) => writeLoopTag(html, node, { sortField: field, sortDir: dir });
}

export function loopDepthEdit(value) {
  return (html, node) => writeLoopTag(html, node, { navDepth: String(value || '').replace(/\D/g, '') });
}

export function loopIncludeHomeEdit(value) {
  return (html, node) => writeLoopTag(html, node, { includeHome: !!value });
}

export function loopLimitEdit(value) {
  return (html, node) => writeLoopTag(html, node, { limit: String(value || '').replace(/\D/g, '') });
}

export function loopOffsetEdit(value) {
  return (html, node) => writeLoopTag(html, node, { offset: String(value || '').replace(/\D/g, '') });
}
