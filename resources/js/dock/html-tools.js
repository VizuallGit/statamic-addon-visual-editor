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
import { CSS_ADD_ICON, CSS_MENU_ID, DOCK_ID, HTML_HEADINGS, HTML_TOOLS, editors, tags } from '../code-dock.js';
import { onEditorInput } from './save.js';
import { closeCssMenu, indentFromPrevious, lineIndentOf, paintCssToolState, placeCssMenu } from './css-tools.js';
import { applyCssScope, flushCssScope, rememberBracketNames, rememberCssSelectors } from './scope.js';

// ===== html-tools =====
function cssChrome(dock) {
  return dock?.querySelector('[data-sve-css-chrome]');
}

function skipHtmlNoise(text, i) {
  if (text.startsWith('{{', i)) {
    const end = text.indexOf('}}', i + 2);

    return end === -1 ? text.length : end + 2;
  }

  if (text.startsWith('<!--', i)) {
    const end = text.indexOf('-->', i + 4);

    return end === -1 ? text.length : end + 3;
  }

  return i;
}

function readHtmlTag(text, i) {
  if (text[i] !== '<') {
    return null;
  }

  const close = text.indexOf('>', i + 1);

  if (close === -1) {
    return null;
  }

  const chunk = text.slice(i, close + 1);
  const closing = chunk.match(/^<\/([A-Za-z][A-Za-z0-9:-]*)\s*>/);

  if (closing) {
    return { kind: 'close', name: closing[1].toLowerCase(), from: i, to: close + 1 };
  }

  const opening = chunk.match(/^<([A-Za-z][A-Za-z0-9:-]*)/);

  if (!opening) {
    return { kind: 'other', from: i, to: close + 1 };
  }

  const name = opening[1].toLowerCase();
  const self =
    /\/\s*>$/.test(chunk) ||
    ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'].includes(
      name
    );

  return { kind: self ? 'void' : 'open', name, from: i, to: close + 1 };
}

function findHtmlClose(text, name, from) {
  let depth = 1;
  let i = from;

  while (i < text.length) {
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

    if (!tag) {
      break;
    }

    if (tag.kind === 'open' && tag.name === name) {
      depth += 1;
    } else if (tag.kind === 'close' && tag.name === name) {
      depth -= 1;

      if (depth === 0) {
        return tag;
      }
    }

    i = tag.to;
  }

  return null;
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

export function dispatchHtmlChanges(view, changes, selection) {
  const sorted = [...changes].sort((a, b) => b.from - a.from || b.to - a.to);

  view.dispatch({
    changes: sorted,
    selection,
  });
}

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
    });

    return;
  }

  view.dispatch({
    changes: { from: pos, to: view.state.selection.main.to, insert },
    selection: caretRange(pos + extra + cursorFromStart, selectLength),
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
      });
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
    });
    finishHtmlEdit();

    return;
  }

  const el = htmlElementAtCursor();

  if (el?.open && el.close) {
    if (el.name === tag) {
      dispatchHtmlChanges(
        view,
        [
          { from: el.close.from, to: el.close.to, insert: '' },
          { from: el.open.from, to: el.open.to, insert: '' },
        ],
        { anchor: el.open.from }
      );
      finishHtmlEdit();

      return;
    }

    if (isHeadingTag(el.name) && isHeadingTag(tag)) {
      const openRaw = text.slice(el.open.from, el.open.to).replace(new RegExp(`^<${el.name}`, 'i'), `<${tag}`);

      dispatchHtmlChanges(
        view,
        [
          { from: el.close.from, to: el.close.to, insert: `</${tag}>` },
          { from: el.open.from, to: el.open.to, insert: openRaw },
        ],
        { anchor: el.open.from + tag.length + 1 }
      );
      finishHtmlEdit();

      return;
    }
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

  for (const tool of HTML_TOOLS) {
    const btn = dock.querySelector(`[data-sve-html-tool="${tool.id}"]`);

    if (!btn) {
      continue;
    }

    const on = tool.id === 'heading' ? isHeadingTag(tag) : tag === tool.tag;

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
 * Pick how an icon is written: an inline `<svg>` tag, Statamic's `{{ svg }}`
 * tag for a file under resources/svg, or an Iconify field's icon. The two
 * Antlers forms land with a placeholder field handle selected, so typing
 * replaces it — the handle is the section's to know, not the button's.
 */
export function openHtmlSvgMenu(win, anchor) {
  const doc = win.document;
  const current = htmlElementAtCursor()?.name || '';
  const write = {
    inline: () => applyHtmlTag('svg'),
    statamic: () => {
      insertHtmlElement('{{ svg src="icon_field" }}', 13, 10);
      finishHtmlEdit();
    },
    iconify: () => {
      insertHtmlElement('{{ iconify:icon_field }}', 11, 10);
      finishHtmlEdit();
    },
  };

  closeCssMenu(doc);
  anchor.setAttribute('data-open', '');

  const menu = doc.createElement('div');

  menu.id = CSS_MENU_ID;
  doc.body.appendChild(menu);
  placeCssMenu(win, anchor, menu);
  menu._sveApp = mountSurface(CodeDockMenu, menu, {
    kind: 'choices',
    // The Antlers forms first: they are what a theme writes; the bare tag is
    // for the rare hand-drawn icon.
    choices: [
      { value: 'statamic', label: t(win, 'code_dock_svg_statamic'), hint: '{{ svg src="…" }}' },
      { value: 'iconify', label: t(win, 'code_dock_svg_iconify'), hint: '{{ iconify:… }}' },
      { value: 'inline', label: t(win, 'code_dock_svg_inline'), hint: '<svg>', active: current === 'svg' },
    ],
    onPick: (value) => {
      closeCssMenu(doc);
      write[value]?.();
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
