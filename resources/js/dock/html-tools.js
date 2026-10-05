/**
 * code-dock.js — region "html-tools", split out in WP5. Same statements, same order;
 * only the imports are new. See the barrel code-dock.js for what the shell exports.
 */
import { on } from '../cp/bus.js';
import CodeDockMenu from '../cp/surfaces/CodeDockMenu.vue';
import CodeDockAddClass from '../cp/surfaces/CodeDockAddClass.vue';
import { tidyHtml } from '../html-tidy.js';
import { twOpenAddMenu } from '../tw-classes.js';
import { mountSurface } from '../cp/mount.js';
import { applyBracketClass, findClassRule, sanitizeCssClassName } from '../css-scope.js';
import { definedElsewhere, importClassCss, loadClassDefs, siteClassOptions } from './class-defs.js';
import { t } from '../lib/i18n.js';
import { dockState } from '../dock/state.js';
import { elementInsertPoint } from './insert-point.js';
import { findHtmlClose, readHtmlTag, skipHtmlNoise, tagAtCursor } from './tag-scan.js';
import { CSS_ADD_ICON, CSS_MENU_ID, DOCK_ID, HTML_HEADINGS, HTML_TOOLS, editors, tags } from '../code-dock.js';
import { onEditorInput } from './save.js';
import { closeCssMenu, indentFromPrevious, lineIndentOf, paintCssToolState, placeCssMenu } from './css-tools.js';
import { applyCssScope, flushCssScope, rememberBracketNames, rememberCssSelectors } from './scope.js';
import { findAntlersBlocks } from '../antlers-blocks.js';
import { writeLoopPagination } from '../antlers-edit.js';
import { locksKept } from '../html-tree-parse.js';
import { minimalChange } from '../lib/minimal-change.js';

// ===== html-tools =====
function cssChrome(dock) {
  return dock?.querySelector('[data-sve-css-chrome]');
}

export function htmlElementAtCursor() {
  const view = editors.html;

  if (!view) {
    return null;
  }

  const pos = view.state.selection.main.head;
  const text = view.state.doc.toString();
  const stack = [];
  let i = 0;

  while (i < pos) {
    const next = skipHtmlNoise(text, i);

    if (next !== i) {
      i = next;
      continue;
    }

    if (text[i] !== '<') {
      i += 1;
      continue;
    }

    const tag = readHtmlTag(text, i);

    if (!tag || tag.from >= pos) {
      break;
    }

    if (tag.kind === 'open') {
      stack.push(tag);
    } else if (tag.kind === 'close') {
      for (let s = stack.length - 1; s >= 0; s -= 1) {
        if (stack[s].name === tag.name) {
          stack.splice(s);
          break;
        }
      }
    }

    i = tag.to;
  }

  const lastLt = text.lastIndexOf('<', Math.max(0, pos - 1));

  if (lastLt !== -1 && text.indexOf('>', lastLt) >= pos) {
    const tag = readHtmlTag(text, lastLt);

    if (tag?.kind === 'open' || tag?.kind === 'void') {
      const close = tag.kind === 'void' ? null : findHtmlClose(text, tag.name, tag.to);

      return close ? { name: tag.name, open: tag, close } : { name: tag.name, open: tag, close: null };
    }
  }

  const open = stack[stack.length - 1];

  if (!open) {
    return null;
  }

  const close = findHtmlClose(text, open.name, open.to);

  return { name: open.name, open, close };
}

function isHeadingTag(name) {
  return HTML_HEADINGS.includes(name);
}

export function finishHtmlEdit() {
  editors.html?.focus();

  if (dockState.lastWin) {
    onEditorInput(dockState.lastWin);
    paintHtmlToolState(dockState.lastWin);
  }
}

/**
 * `userEvent`: the toolbar's element buttons pass `input.toolbar`, so what
 * they write counts as a person's edit and the lock (dock/locked-tags.js)
 * keeps it out of a locked element. A whole-pane swap (tidy) passes nothing:
 * the lock must never cut one of those in half.
 */
export function dispatchHtmlChanges(view, changes, selection, userEvent = undefined) {
  const sorted = [...changes].sort((a, b) => b.from - a.from || b.to - a.to);

  view.dispatch({
    changes: sorted,
    selection,
    ...(userEvent ? { userEvent } : {}),
  });
}

/** What the toolbar's element buttons write counts as typing (see above). */
const TOOLBAR_EVENT = 'input.toolbar';

export function insertHtmlSnippet(snippet, cursorFromStart, selectLength) {
  const view = editors.html;

  if (!view || view.state.readOnly) {
    return;
  }

  const pos = view.state.selection.main.head;
  const line = view.state.doc.lineAt(pos);
  const before = line.text.slice(0, pos - line.from);
  const indent = line.text.trim()
    ? lineIndentOf(line.text)
    : indentFromPrevious(view, line) || lineIndentOf(line.text);
  let insert = snippet;
  let extra = 0;

  if (before.trim() !== '') {
    insert = `\n${indent}${snippet}`;
    extra = 1 + indent.length;
  } else if (!line.text.trim()) {
    insert = `${indent}${snippet}`;
    extra = indent.length;
    view.dispatch({
      changes: { from: line.from, to: line.to, insert },
      selection: caretRange(line.from + extra + cursorFromStart, selectLength),
      userEvent: TOOLBAR_EVENT,
    });

    return;
  }

  view.dispatch({
    changes: { from: pos, to: view.state.selection.main.to, insert },
    selection: caretRange(pos + extra + cursorFromStart, selectLength),
    userEvent: TOOLBAR_EVENT,
  });
}

/** A caret, or a selection over the placeholder the caret was put in front of. */
function caretRange(anchor, length) {
  return length ? { anchor, head: anchor + length } : { anchor };
}

/**
 * Move the caret out of the tag, expression or comment it sits in.
 *
 * Markup goes between tags, never into one: a link written into the middle of
 * a `<video …>` is a broken video, not a link. Returns the caret's position.
 */
function leaveTag(view) {
  const { from } = view.state.selection.main;
  const at = elementInsertPoint(view.state.doc.toString(), from);

  if (at !== from) {
    view.dispatch({ selection: { anchor: at } });
  }

  return at;
}

/** Write an element where the caret is — after the tag it sits in, if any. */
export function insertHtmlElement(snippet, cursorFromStart, selectLength) {
  const view = editors.html;

  if (!view || view.state.readOnly) {
    return;
  }

  leaveTag(view);
  insertHtmlSnippet(snippet, cursorFromStart, selectLength);
}

/**
 * Tags whose button leaves the caret inside what it just wrote.
 *
 * Only the sectioning ones. A section is made in order to be filled, so the
 * next thing written belongs in it. Everything else stacks: click `div` four
 * times and you want four boxes side by side, not four boxes inside each
 * other — which is what leaving the caret between the tags gave you.
 *
 * Working *inside* an existing element is what picking its row in the tree is
 * for, and that puts the caret in any row, whatever its tag.
 */
const FILLED_TAGS = new Set([
  'section',
  'article',
  'header',
  'footer',
  'main',
  'nav',
  'aside',
]);

/**
 * Tags that cannot hold one of their own.
 *
 * An h1 inside an h1 is not HTML, and neither is a p in a p or an a in an a,
 * so a new one written from inside one goes after the element instead.
 *
 * A function, not a set built when the module loads: HTML_HEADINGS comes
 * from code-dock.js, which imports this module, and does not exist yet then.
 */
function isNonSelfNesting(tag) {
  return isHeadingTag(tag) || tag === 'p' || tag === 'a';
}

/**
 * The opening tag a toolbar button writes.
 *
 * A section carries the attributes the site configures for it, so a new one is
 * addressable and clickable in the preview from the moment it exists. Every
 * other tag opens bare.
 */
function openTagFor(tag) {
  // A link without an href is not a link yet; it opens with the attribute in
  // place, and the caret goes into it.
  if (tag === 'a') {
    return '<a href="">';
  }

  if (tag !== 'section') {
    return `<${tag}>`;
  }

  const attrs = dockState.lastWin?.Statamic?.$config?.get?.('sveSectionTag');

  return typeof attrs === 'string' && attrs.trim() ? `<${tag} ${attrs.trim()}>` : `<${tag}>`;
}

/**
 * Put the indentation back in the pane.
 *
 * Whatever the pane holds: the whole file, or the one element the scope button
 * narrowed it to. A scoped pane is a fragment that starts somewhere indented,
 * so its own first line's indent goes back in front of every line — tidying a
 * piece of a file must not walk that piece to the left margin.
 */
export function tidyHtmlPane() {
  const view = editors.html;

  if (!view || view.state.readOnly) {
    return;
  }

  const text = view.state.doc.toString();
  const lead = (text.match(/^[ \t]*/) || [''])[0];
  const tidy = tidyHtml(text)
    .split('\n')
    .map((line) => (line ? lead + line : line))
    .join('\n');

  if (tidy === text) {
    return;
  }

  dispatchHtmlChanges(view, [{ from: 0, to: text.length, insert: tidy }], { anchor: 0 });
  finishHtmlEdit();
}

export function applyHtmlTag(tag) {
  const view = editors.html;

  if (!view || view.state.readOnly) {
    return;
  }

  const sel = view.state.selection.main;
  const text = view.state.doc.toString();
  // A selection is wrapped only when both its ends sit between tags; one that
  // starts or ends inside a tag is not something a tag can go around.
  const wrappable =
    !sel.empty && elementInsertPoint(text, sel.from) === sel.from && elementInsertPoint(text, sel.to) === sel.to;

  if (wrappable) {
    const selected = text.slice(sel.from, sel.to);
    const wrapped = selected.match(new RegExp(`^<${tag}(\\s[^>]*)?>([\\s\\S]*)</${tag}>$`, 'i'));

    if (wrapped) {
      dispatchHtmlChanges(view, [{ from: sel.from, to: sel.to, insert: wrapped[2] }], {
        anchor: sel.from,
        head: sel.from + wrapped[2].length,
      }, TOOLBAR_EVENT);
      finishHtmlEdit();

      return;
    }

    const open = openTagFor(tag);
    let insert = `${open}${selected}</${tag}>`;
    let innerFrom = sel.from + open.length;

    if (tag === 'ul') {
      insert = `<ul>\n  <li>${selected}</li>\n</ul>`;
      innerFrom = sel.from + `<ul>\n  <li>`.length;
    }

    dispatchHtmlChanges(view, [{ from: sel.from, to: sel.to, insert }], {
      anchor: innerFrom,
      head: innerFrom + selected.length,
    }, TOOLBAR_EVENT);
    finishHtmlEdit();

    return;
  }

  // A button takes its element away only from inside one of that element's
  // own tags — `<di|v>` or `</di|v>`. From its content it writes a new one.
  const pos = sel.head;
  const under = tagAtCursor(text, pos);

  if (under && under.name === tag && under.open && under.close) {
    dispatchHtmlChanges(
      view,
      [
        { from: under.close.from, to: under.close.to, insert: '' },
        { from: under.open.from, to: under.open.to, insert: '' },
      ],
      { anchor: under.open.from },
      TOOLBAR_EVENT
    );
    finishHtmlEdit();

    return;
  }

  const el = htmlElementAtCursor();

  if (el?.open && el.close && isHeadingTag(el.name) && isHeadingTag(tag) && el.name !== tag) {
    const openRaw = text.slice(el.open.from, el.open.to).replace(new RegExp(`^<${el.name}`, 'i'), `<${tag}`);

    dispatchHtmlChanges(
      view,
      [
        { from: el.close.from, to: el.close.to, insert: `</${tag}>` },
        { from: el.open.from, to: el.open.to, insert: openRaw },
      ],
      { anchor: el.open.from + tag.length + 1 },
      TOOLBAR_EVENT
    );
    finishHtmlEdit();

    return;
  }

  // The same tag from its content, and one that cannot hold itself: the new
  // one goes after the element, not into it.
  if (el?.open && el.name === tag && isNonSelfNesting(tag)) {
    view.dispatch({ selection: { anchor: el.close ? el.close.to : el.open.to } });
  }

  leaveTag(view);

  const line = view.state.doc.lineAt(view.state.selection.main.head);
  const indent = (line.text.match(/^\s*/) || [''])[0];

  if (tag === 'ul') {
    const snippet = `<ul>\n${indent}  <li></li>\n${indent}</ul>`;

    insertHtmlSnippet(snippet, `<ul>\n${indent}  <li>`.length);
  } else {
    const open = openTagFor(tag);
    const snippet = `${open}</${tag}>`;
    const caret = tag === 'a'
      ? open.indexOf('""') + 1
      : FILLED_TAGS.has(tag) ? open.length : snippet.length;

    insertHtmlSnippet(snippet, caret);
  }

  finishHtmlEdit();
}

/**
 * The innermost collection loop around `pos`, or null.
 *
 * Read from the pane's own text, not the whole file. A scoped pane holds one
 * element, and a loop that opens outside it cannot be rewritten from here: the
 * edit would land in text the pane does not hold, and the scope's range would
 * not survive an edit made on both sides of it (dock-api's shiftFocus follows
 * one). Outside the pane is outside the button's reach — it greys out.
 */
function collectionLoopAt(text, pos) {
  let found = null;

  // Outermost first, so the last one that still holds the caret is innermost.
  for (const block of findAntlersBlocks(text)) {
    if (block.kind === 'loop' && block.loopKind === 'collection' && block.from <= pos && pos < block.to) {
      found = block;
    }
  }

  return found;
}

function collectionLoopAtCaret() {
  const view = editors.html;

  return view ? collectionLoopAt(view.state.doc.toString(), view.state.selection.main.head) : null;
}

/**
 * Pages on or off for the collection loop the caret is in (antlers-edit's
 * writeLoopPagination does the writing).
 *
 * All or nothing. The edit spans the loop from its tag to its end, so the
 * padlock's filter — which drops the part of a change that touches a locked
 * element — would keep the tag and lose the wrapper, or the other way round.
 * So it is dispatched as the dock's own edit, and refused whole when a locked
 * element would not survive it, the way dock:set-html refuses.
 *
 * Only the span that differs is replaced (lib/minimal-change): a caret outside
 * the loop stays where it was, one inside lands on the loop's own tag.
 */
export function toggleHtmlPagination() {
  const view = editors.html;

  if (!view || view.state.readOnly) {
    return;
  }

  const text = view.state.doc.toString();
  const loop = collectionLoopAt(text, view.state.selection.main.head);

  if (!loop) {
    return;
  }

  const next = writeLoopPagination(text, loop, !loop.paginate);

  if (next === text) {
    return;
  }

  if (!locksKept(text, next)) {
    dockState.lastWin?.Statamic?.$toast?.error(t(dockState.lastWin, 'html_tree_locked_element'));

    return;
  }

  const [from, to, insert] = minimalChange(text, next);

  dispatchHtmlChanges(view, [{ from, to, insert }]);
  finishHtmlEdit();
}

export function paintHtmlToolState(win) {
  try {
    paintHtmlToolStateInner(win);
  } catch {
    /* invalid Antlers-in-HTML must not take down Live Preview */
  }
}

function paintHtmlToolStateInner(win) {
  const dock = win?.document?.getElementById(DOCK_ID);
  const el = htmlElementAtCursor();
  const tag = el?.name || '';

  if (!dock) {
    return;
  }

  // Pagination answers to the loop around the caret, not to the tag under it:
  // lit when that loop already pages, greyed out outside a collection loop.
  const loop = collectionLoopAtCaret();

  for (const tool of HTML_TOOLS) {
    const btn = dock.querySelector(`[data-sve-html-tool="${tool.id}"]`);

    if (!btn) {
      continue;
    }

    const paging = tool.action === 'pagination';
    const on = paging ? !!loop?.paginate : tool.id === 'heading' ? isHeadingTag(tag) : tag === tool.tag;

    if (paging) {
      btn.disabled = !loop;
    }

    if (on) {
      btn.setAttribute('data-active', '');
    } else {
      btn.removeAttribute('data-active');
    }
  }
}

/**
 * Pick which tag to write: the six headings, or the text tags.
 *
 * One button per kind, not one per tag. `h2` and `h3` are the same decision
 * made twice, and so are `p` and `span` — the row of buttons stays short
 * enough to read, and the choice is made where it is made.
 */
export function openHtmlTagMenu(win, anchor, tags) {
  const doc = win.document;
  const current = htmlElementAtCursor()?.name || '';

  closeCssMenu(doc);
  anchor.setAttribute('data-open', '');

  const menu = doc.createElement('div');

  menu.id = CSS_MENU_ID;
  doc.body.appendChild(menu);
  placeCssMenu(win, anchor, menu);
  menu._sveApp = mountSurface(CodeDockMenu, menu, {
    kind: 'choices',
    choices: tags.map((tag) => ({
      value: tag,
      label: tag.toUpperCase(),
      active: current === tag,
    })),
    onPick: (tag) => {
      applyHtmlTag(tag);
      closeCssMenu(doc);
    },
  });
}

/**
 * Pick a component to write in at the cursor.
 *
 * The list is the folder, read fresh each time the button is used — a
 * component made a moment ago in the tree has to be here without a reload.
 */
export function openHtmlComponentMenu(win, anchor) {
  const doc = win.document;

  closeCssMenu(doc);
  anchor.setAttribute('data-open', '');

  const menu = doc.createElement('div');

  menu.id = CSS_MENU_ID;
  doc.body.appendChild(menu);
  placeCssMenu(win, anchor, menu);

  const paint = (choices) => {
    if (!doc.getElementById(CSS_MENU_ID)) {
      return;
    }

    menu._sveApp?.unmount();
    menu._sveApp = mountSurface(CodeDockMenu, menu, {
      kind: 'choices',
      choices,
      onPick: (tag) => {
        if (tag) {
          insertHtmlElement(tag, tag.length);
          finishHtmlEdit();
        }

        closeCssMenu(doc);
      },
    });
    placeCssMenu(win, anchor, menu);
  };

  paint([{ value: '', label: t(win, 'code_dock_loading') }]);

  win
    .fetch('/!/sve/components', {
      credentials: 'same-origin',
      headers: { 'X-Requested-With': 'XMLHttpRequest', Accept: 'application/json' },
    })
    .then((res) => (res.ok ? res.json() : { items: [] }))
    .then((data) => {
      const items = Array.isArray(data.items) ? data.items : [];

      paint(
        items.length
          ? items.map((item) => ({ value: item.tag, label: item.name }))
          : [{ value: '', label: t(win, 'component_none') }]
      );
    })
    .catch(() => paint([{ value: '', label: t(win, 'component_none') }]));
}

function addCssClassName(raw) {
  const name = sanitizeCssClassName(raw);
  const htmlView = editors.html;
  const cssView = editors.css;

  if (!name || htmlView?.state.readOnly || cssView?.state.readOnly) {
    return;
  }

  const el = htmlElementAtCursor();

  if (el?.open && htmlView) {
    const open = htmlView.state.doc.sliceString(el.open.from, el.open.to);
    const next = applyBracketClass(open, name);

    if (next !== open) {
      htmlView.dispatch({
        changes: { from: el.open.from, to: el.open.to, insert: next },
      });
    }
  }

  flushCssScope();

  if (!findClassRule(dockState.cssFull, name)) {
    dockState.cssFull = `${String(dockState.cssFull || '').trimEnd()}${dockState.cssFull?.trim() ? '\n' : ''}.${name} {\n}\n`;
  }

  applyCssScope();
  rememberBracketNames();
  rememberCssSelectors();

  if (dockState.lastWin) {
    onEditorInput(dockState.lastWin);
    paintHtmlToolState(dockState.lastWin);
    paintCssToolState(dockState.lastWin);
  }
}

function openAddClassMenu(win, anchor) {
  const doc = win.document;

  if (anchor.hasAttribute('data-open')) {
    closeCssMenu(doc);

    return;
  }

  closeCssMenu(doc);
  anchor.setAttribute('data-open', '');

  const menu = doc.createElement('div');

  menu.id = CSS_MENU_ID;
  doc.body.appendChild(menu);
  placeCssMenu(win, anchor, menu);

  // A name the site already has: in this file's CSS, or anywhere else.
  const takenText = (raw) => {
    const name = sanitizeCssClassName(raw);

    if (!name) {
      return '';
    }

    if (findClassRule(dockState.cssFull, name)) {
      return t(win, 'class_exists_here');
    }

    const files = [...new Set(definedElsewhere(win, name).map((d) => String(d.file).replace(/^.*\//, '')))];

    return files.length ? t(win, 'class_exists_pick', { file: files.join(', ') }) : '';
  };
  // Picking one that exists: onto the tag, its rule made here if this file
  // lacks it, and its declarations brought in from wherever the site has them.
  const pick = (name) => {
    addCssClassName(name);
    importClassCss(win, sanitizeCssClassName(name));
    closeCssMenu(doc);
  };
  // Drawn at once from what the catalogue already holds, and again — with the
  // typed text kept — when a fresh catalogue lands.
  const paint = () => {
    if (!doc.getElementById(CSS_MENU_ID)) {
      return;
    }

    const initial = menu.querySelector('[data-sve-css-add-input]')?.value || '';

    menu._sveApp?.unmount();
    menu._sveApp = mountSurface(CodeDockAddClass, menu, {
      label: t(win, 'code_dock_css_class_name'),
      placeholder: t(win, 'code_dock_css_class_placeholder'),
      initial,
      options: siteClassOptions(win, t(win, 'class_this_file')),
      existingLabel: t(win, 'code_dock_css_class_existing'),
      createLabel: t(win, 'code_dock_css_class_create'),
      takenText,
      onPick: pick,
      onClose: () => closeCssMenu(doc),
      onAdd: (value) => {
        addCssClassName(value);
        closeCssMenu(doc);
      },
    });
    placeCssMenu(win, anchor, menu);
  };

  paint();
  void loadClassDefs(win).then(paint);
}

export function bindCssAddClass(win, dock) {
  const btn = dock.querySelector('[data-sve-css-add-class]');

  if (!btn || btn._sveBound) {
    return;
  }

  btn._sveBound = true;
  btn.innerHTML = CSS_ADD_ICON;
  btn.title = t(win, 'code_dock_css_add_class');
  btn.setAttribute('aria-label', btn.title);
  btn.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (dockState.styleMode === 'tw') {
      closeCssMenu(win.document);
      twOpenAddMenu(win, btn);

      return;
    }

    openAddClassMenu(win, btn);
  });
}
