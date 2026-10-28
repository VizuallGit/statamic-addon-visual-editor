/**
 * A tile that lands outside every section, on a page built from sections: a
 * section of its own, asked for as the HTML tree's plus asks — static markup,
 * or a section with fields — and put on the page where it landed.
 *
 * Owner: Build mode (resources/js/build-mode/).
 * May import: vue, cp/bus.js, cp/html-tree/store.js, lib/publish-containers.js,
 *   section-create.js, section-import.js.
 * Bus: asks `dock:current-uid`, `dock:chrome-kind`, `dock:component-src`,
 *   `html-tree:open-section`.
 *
 * Which tiles:
 *   Section    always. A section inside a section is never what a designer
 *              means, so on such a page it is the page's next section.
 *   `outside`  Layout's others (Container, Grid, Flex, Div, the div menu's
 *              layouts) and the HTML tags (article … figure), when they have
 *              no parent: dropped beside a section on the canvas, or clicked
 *              while the dock holds no file of its own. With a section open
 *              a click puts them into it, as before.
 *   the rest   text, links, media, lists, logic, components: where Add
 *              points, as before.
 *
 * What it makes is the tree's (section-create.js): chooseSectionKind, then
 * the static or the fields dialog, and the row on the page. Section brings
 * no markup — the server's scaffold is the plus's. Any other tile is the
 * section's root: the import's rootSection gives it the id, the `_class` and
 * the visual_edit every section's root wears.
 *
 * A page not built from sections (a template) has none of this: every tile
 * goes into the file, as before.
 */

import { nextTick } from 'vue';
import { ask } from '../cp/bus.js';
import { htmlTreeUi } from '../cp/html-tree/store.js';
import { pageHasSectionField, pageSectionRows } from '../lib/publish-containers.js';
import { t } from '../lib/i18n.js';
import { canCreateSections, chooseSectionKind, openNewSectionDialog, openStaticSectionDialog, revealWhenRendered } from '../section-create.js';
import { importedTemplate } from '../section-import.js';

/** Add's HTML tags (catalog.js ADD_TAGS) — each a section of its own where it has no parent. */
const TAGS = new Set(['article', 'aside', 'nav', 'header', 'footer', 'figure']);

/**
 * What a tile does on a page built from sections: `always` a new section,
 * `outside` one where it has no parent, '' — it goes where Add points.
 *
 * @param {object} entry  one item of addGroups()
 */
export function sectionKind(win, entry) {
  if (!entry || !pageHasSectionField(win, win.document)) {
    return '';
  }

  const tag = entry.def?.tag;

  if (entry.source === 'tool' && tag === 'section') {
    return 'always';
  }

  return entry.source === 'div' || entry.source === 'columns' || (entry.source === 'own' && TAGS.has(tag)) ? 'outside' : '';
}

/** The page's section open in the dock, or '' — a header, a footer or a component is not one. */
function openSection() {
  return ask('dock:chrome-kind') || ask('dock:component-src') ? '' : String(ask('dock:current-uid') || '');
}

/** Whether the dock holds a file a tile can go into: a section, the header, the footer or a component. */
export function hasParent() {
  return !!(ask('dock:current-uid') || ask('dock:chrome-kind') || ask('dock:component-src'));
}

/** A page built from sections with no file in the dock: only a section of its own has anywhere to go. */
export function onlySections(win) {
  return pageHasSectionField(win, win.document) && !hasParent();
}

/** The page's sections in order, each as the ids it answers to — the uid first. */
export function sectionRows(win) {
  return pageSectionRows(win, win.document).map((row) => row.ids);
}

/** Where a clicked tile's section lands: after the open section, else at the end of the page (null: the top of an empty one). */
export function clickedAfter(win) {
  const open = openSection();

  if (open) {
    return open;
  }

  const rows = sectionRows(win);

  return rows.length ? rows[rows.length - 1][0] : null;
}

let making = false;

/**
 * The popup, the dialog and the section on the page after `afterUid` (null:
 * the top). `markup` is the tile's and becomes the section's root; '' is
 * Section's, the server's scaffold. Once made it is opened, as the tree's plus
 * opens it. One at a time: a tile pressed while the popup is up is not a
 * second section.
 */
export async function makeSection(win, { markup = '', afterUid = null } = {}) {
  if (making) {
    return;
  }

  if (!canCreateSections(win)) {
    win.Statamic?.$toast?.error(t(win, 'section_new_failed'));

    return;
  }

  making = true;

  const release = () => {
    making = false;
  };
  const kind = await chooseSectionKind(win);

  if (!kind) {
    release();

    return;
  }

  const options = {
    afterUid,
    template: markup ? importedTemplate(markup, { root: true }) : null,
    onDone: (data) => {
      release();
      void openMade(data?.uid);
    },
    onError: release,
    onClose: release,
  };

  if (kind === 'static') {
    openStaticSectionDialog(win, options);
  } else {
    openNewSectionDialog(win, options);
  }

  /** Into the section just made — HtmlTreePane.vue `openNewlyMade`: the tree reads the page again, then opens it. */
  async function openMade(uid) {
    if (!uid) {
      return;
    }

    await nextTick();
    htmlTreeUi.onRefresh?.();

    const opened = ask('html-tree:open-section', uid);

    if (opened) {
      revealWhenRendered(win, opened.ids);
    }
  }
}
