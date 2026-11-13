/**
 * html-tree.js — the page's sections, which one is open, the root's name.
 * Split out of html-tree.js in the quality pass (tab G): the same statements, in the same
 * order; only the imports are new. html-tree.js re-exports this file.
 */
import { isStaticType } from '../section-create.js';
import { ask } from '../cp/bus.js';
import { parseTemplateTree } from '../html-tree-parse.js';
import { readHtmlTreeLabels } from '../html-tree-labels.js';
import { HTML_ICONS, htmlTreeIcon } from '../html-tree-icons.js';
import { tagFamily } from '../lib/tag-families.js';
import { humanizeHandle, unwrapRef } from '../lib/values.js';
import { sectionField, sectionRootTag } from '../lib/config.js';
import { CHROME_CONTAINER } from '../lib/ids.js';
import { activeContainers } from '../lib/publish-containers.js';
import { setMeta } from '../lib/row-meta.js';
import { renderedSectionType } from '../section-library.js';
import { GLOBAL_SECTION_CONTAINER } from '../global-section.js';
import { htmlTreeFolds, htmlTreeGuessedTags, htmlTreeRootTags, htmlTreeState, htmlTreeTemplates } from './state.js';

/** True while the rows come from the cache and the dock is still catching up. */
export function htmlTreeAheadOfDock() {
  return !!htmlTreeState.htmlTreeAhead;
}

/**
 * The tag a shut section's row says: the first tag of its file — the row it
 * unfolds into when it opens.
 *
 * The file in hand first (fetched ahead, or open in the dock with an edit not
 * yet saved). Before it is, the same file as the server read it when the
 * Control Panel loaded, so a `<div>` reads `div` from the first paint and not
 * `section` until a fetch lands. `section` only for a type with no file.
 */
export function sectionRootTagOf(win, type) {
  return templateRootTag(type) || sectionRootTag(win, type) || 'section';
}

/**
 * The first tag of a section's file in hand — `component` when the file opens
 * with a component call — ; '' while it is not.
 */
function templateRootTag(type) {
  const html = htmlTreeTemplates.get(type);

  if (!html) {
    return '';
  }

  const cached = htmlTreeRootTags.get(type);

  if (cached && cached.html === html) {
    return cached.tag;
  }

  const tag = firstTagNode(parseTemplateTree(html))?.tag || '';
  htmlTreeRootTags.set(type, { html, tag });

  return tag;
}

/**
 * Every section on the page, read from the publish form's values.
 *
 * The values, not the preview. A template with a syntax error renders no page
 * at all, and that is precisely the moment you need a way back into the file
 * that broke — with nothing to click on, the dock falls back to the first
 * section and there was no other door into the rest. The block tree has always
 * read the page this way; this is the same reading, one row per section.
 */
export function htmlTreeSections(win, doc) {
  const field = sectionField(win) || 'page_sections';
  const out = [];

  for (const container of activeContainers(doc) || []) {
    // A global section's borrowed form and the header's form hold rows too,
    // while they are open; those are not the page's, and listing them drew
    // the section a second time under its own row.
    if (container.name === GLOBAL_SECTION_CONTAINER || container.name === CHROME_CONTAINER) {
      continue;
    }

    const values = unwrapRef(container.values);
    const list = values && typeof values === 'object' ? values[field] : null;

    if (!Array.isArray(list)) {
      continue;
    }

    list.forEach((row) => {
      if (!row || typeof row !== 'object' || Array.isArray(row) || typeof row.type !== 'string') {
        return;
      }

      // Every id the row answers to. Which one the dock was handed is the
      // template's choice, and the three need not agree.
      const ids = [row._visual_id, row.id, row._id].filter((id) => typeof id === 'string' && id !== '');

      if (!ids.length) {
        return;
      }

      // What the row renders: its own set, or — for a row of the global set,
      // which only points at a saved section — that section. A global row's
      // own file is a wrapper that opens with a hidden <span> carrying the
      // row's id; it is never the file meant, shut or open. So the row is the
      // section it renders in everything below: its tag and name, the file
      // prefetched for it, and the file the dock is matched against — the
      // same answer the dock gives when the row is clicked.
      const type = renderedSectionType(win, row);
      const custom = typeof row._sve_label === 'string' ? row._sve_label.trim() : '';
      // The file's first tag: what the row says open, so it says it shut too.
      const tag = sectionRootTagOf(win, type);

      // Read before this tab held the file: should the file say otherwise when
      // it lands (edited elsewhere since), the row is drawn again.
      if (!templateRootTag(type)) {
        htmlTreeGuessedTags.set(type, tag);
      }

      // The name a rename gave it, read whether or not its file is open. Shut,
      // the alias used to be invisible and the row said the set's name instead
      // — so the same section answered to two names depending on its state.
      // The root tag's path is its index among the file's root tags, and a
      // section template has one.
      const alias = readHtmlTreeLabels(type)[`0:${tag}`];

      out.push({
        uid: ids[0],
        ids,
        type,
        tag,
        // Its own name first: a rename on the page is this section's, and two
        // sections of one type may be called two things. The alias is the
        // file's, shared by every section that renders through it.
        label:
          custom ||
          (typeof alias === 'string' && alias.trim() ? alias.trim() : '') ||
          setMeta(win, type)?.display ||
          humanizeHandle(type) ||
          type,
        // Its first tag's mark — the one it unfolds into. The set's own icon
        // used to go here, so the same section wore one shut and another open.
        // A section that is one component call unfolds into the component: the
        // cube and the component family, shut as open.
        svg: htmlTreeIcon(tag, rootKind(tag), null).svg || HTML_ICONS.section,
        cat: tagFamily(tag, rootKind(tag)),
        enabled: row.enabled !== false,
        // Markup only: no fieldset, so no fields icon on its root.
        static: isStaticType(win, type),
      });
    });

    // The first container holding the page builder is the page. A second one is
    // another form open beside it, and its rows belong to that panel.
    break;
  }

  return out;
}

/**
 * What the first tag is called.
 *
 * The row above it in the list already says the section's name, but the tags
 * under it are indented the same whichever section they came from — so the
 * first one says it too, and the file on screen is named by the tree itself.
 * A component names the component; header, footer and a collection's own
 * template name whatever the dock is holding.
 */
export function htmlTreeRootName(win, sections, openUid) {
  const component = ask('dock:component-exit-state');

  if (component?.open) {
    return humanizeHandle(component.name) || component.name || '';
  }

  if (openUid) {
    return sections.find((section) => section.uid === openUid)?.label || '';
  }

  const type = ask('dock:current-type') || '';

  // A template — a collection's view, the layout — is many elements side by
  // side, not one that stands for the file. Its first tag is a tag like the
  // rest: unnamed until someone names it, not "View:default".
  if (String(type).startsWith('view:')) {
    return '';
  }

  return setMeta(win, type)?.display || humanizeHandle(type) || '';
}

/** Is this row id still in the tree in front of us? */
export function hasNodeId(nodes, id) {
  if (!id) {
    return false;
  }

  for (const node of nodes || []) {
    if (node.id === id || hasNodeId(node.children, id)) {
      return true;
    }
  }

  return false;
}

/** The first real tag, depth first: the row that stands for the whole file. */
export function firstTagId(nodes) {
  return firstTagNode(nodes)?.id || '';
}

/**
 * The first real tag in document order, looking inside conditions and loops —
 * or the first component call, when that comes first.
 *
 * A section written as one component call has no tag of its own; what it
 * unfolds into is the component. Standing for the file, that row wears the
 * section's name and mark, and the shut row says `component` — not `section`
 * shut and `intro_style` open, two names for one thing. The server reads the
 * same rule (SectionRootTags::of), so the row is right on its first paint.
 */
function firstTagNode(nodes) {
  for (const node of nodes || []) {
    if (isRootNode(node)) {
      return node;
    }

    const inner = firstTagNode(node.children);

    if (inner) {
      return inner;
    }
  }

  return null;
}

/** A node that can stand for a file: an HTML tag, or a component call. */
export function isRootNode(node) {
  return !node.kind || node.kind === 'component';
}

/** The kind a root row of this tag has: `component` for a component call, else none. */
function rootKind(tag) {
  return tag === 'component' ? 'component' : '';
}

/**
 * Is this row shut? Open at the top, shut below it, flipped where asked.
 *
 * On the layout the top is also the <body> the tree is cut to. As a row below
 * <html> it would start shut whenever the folds start afresh — the panel opened
 * again, say — and the whole layout would be one folded row.
 */
export function htmlTreeShut(node, depth) {
  const top = depth === 0 || node.path === htmlTreeState.htmlTreeTopPath;

  return htmlTreeFolds.has(node.path) ? top : !top;
}
