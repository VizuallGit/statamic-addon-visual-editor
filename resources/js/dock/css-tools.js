/**
 * code-dock.js — region "css-tools", split out in WP5. Same statements, same order;
 * only the imports are new. See the barrel code-dock.js for what the shell exports.
 */
import { emit } from '../cp/bus.js';
import { cssToolsUi } from '../cp/css/tools.js';
import CodeDockMenu from '../cp/surfaces/CodeDockMenu.vue';
import { twActiveClass, twHasNode, twValueOptions, twWantFamilies } from '../tw-classes.js';
import { moveClassesIntoScope } from '../css-scope-move.js';
import { stripEmptySizeBlocks } from '../css-sizes.js';
import { mountSurface } from '../cp/mount.js';
import { buildScopedCss, matchBraces, tokenTreeFromHtml } from '../css-scope.js';
import { closeClassTokenUi } from '../dock-class-tokens.js';
import { dockState } from '../dock/state.js';
import { flushCssScope, htmlEditorText, htmlFocusOk, htmlScopeEnabled, paintHtmlScope, rememberBracketNames, rememberCssSelectors, syncScopedHtml } from './scope.js';
import { CSS_GRAYS, CSS_MENU_ID, CSS_SPACING, CSS_TOOLS, CSS_TOOL_ICONS, EditorState, EditorView, HANDLES, SCOPE_CLASS, TW_TOOL_ICONS, closeCompletion, editableOf, editors, readOnlyOf } from '../code-dock.js';
import { cssSizeRows, cssStateSuffix, paintCssHead } from './css-sizes.js';
import { paintHtmlToolState } from './html-tools.js';
import { syncTwTarget } from './style-modes.js';
import { onEditorInput } from './save.js';
import { closeDataMenu } from './data-vars.js';

// ===== css-tools =====
export function readParts() {
  const parts = { html: '', css: '', js: '' };

  syncScopedHtml();
  flushCssScope();

  for (const handle of HANDLES) {
    if (handle === 'html') {
      parts.html = dockState.htmlScopeActive ? dockState.htmlFull : (editors.html?.state.doc.toString() ?? '');
    } else if (handle === 'css') {
      // A size block nobody wrote in is a door held open, not a rule. It is
      // shown while you are looking around and taken out on the way to disk.
      parts.css = dockState.lastWin ? stripEmptySizeBlocks(dockState.cssFull, cssSizeRows(dockState.lastWin)) : dockState.cssFull;

      // And a class written at the top of the file belongs in the section's
      // scope. Only moved where there is a scope on the element to move it
      // into, and never a selector built with Antlers — see css-scope-move.js.
      parts.css = moveClassesIntoScope(parts.css, parts.html, SCOPE_CLASS);
    } else {
      parts[handle] = editors[handle]?.state.doc.toString() ?? '';
    }
  }

  return parts;
}

export function cssEditorText() {
  if (dockState.cssValues || !(dockState.htmlScopePref && htmlFocusOk(dockState.htmlFocus?.from, dockState.htmlFocus?.to, dockState.htmlFull.length))) {
    dockState.cssPane = 'full';
    dockState.cssScopeSnapshot = dockState.cssFull;

    return dockState.cssFull;
  }

  const tree = tokenTreeFromHtml(dockState.htmlFull.slice(dockState.htmlFocus.from, dockState.htmlFocus.to));

  if (!tree.length) {
    dockState.cssPane = 'empty';
    dockState.cssScopeSnapshot = '';

    return '';
  }

  dockState.cssPane = 'tree';

  const text = buildScopedCss(dockState.cssFull, tree);

  dockState.cssScopeSnapshot = text;

  return text;
}

export function writeParts(parts, disabled) {
  dockState.applying = true;

  try {
    if (dockState.lastWin) {
      dockState.htmlScopePref = htmlScopeEnabled(dockState.lastWin);
    }

    dockState.htmlFull = parts.html ?? '';
    dockState.cssFull = parts.css ?? '';

    for (const handle of HANDLES) {
      const view = editors[handle];
      let text = parts[handle] ?? '';

      try {
        text = handle === 'html' ? htmlEditorText() : handle === 'css' ? cssEditorText() : text;
      } catch {
        text =
          handle === 'html'
            ? dockState.htmlFull || parts.html || ''
            : handle === 'css'
              ? dockState.cssFull || parts.css || ''
              : text;
      }

      if (!view) {
        continue;
      }

      const current = view.state.doc.toString();
      const effects = [
        readOnlyOf[handle].reconfigure(EditorState.readOnly.of(!!disabled)),
        editableOf[handle].reconfigure(EditorView.editable.of(!disabled)),
      ];

      if (current !== text) {
        view.dispatch({
          changes: { from: 0, to: current.length, insert: text },
          effects,
        });
      } else {
        view.dispatch({ effects });
      }
    }
  } finally {
    dockState.applying = false;
  }

  rememberBracketNames();
  rememberCssSelectors();
  emit('dock:html-changed');

  if (dockState.lastWin) {
    paintCssToolState(dockState.lastWin);
    paintHtmlToolState(dockState.lastWin);
    paintHtmlScope(dockState.lastWin);
    // The Tailwind row holds offsets into the file it was drawn from, and the
    // whole file just changed under it. The editor's own update listener is no
    // help here: it is skipped while `applying` is on, which is exactly when a
    // load, an unlock or a refresh swaps the document. Without this the row
    // kept pointing at the section's tag after a component was opened, and the
    // + menu wrote nothing because those offsets no longer land on a `<`.
    syncTwTarget(dockState.lastWin);
  }
}

export function sameParts(a, b) {
  return a.html === b.html && a.css === b.css && a.js === b.js;
}

function cssDeclaration(text) {
  return String(text || '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .trim()
    .replace(/\s*:\s*/g, ': ')
    .replace(/\s*;\s*/g, ';')
    .replace(/\s+/g, ' ')
    .replace(/;+$/, ';');
}

function cssLinesMatch(a, b) {
  const left = cssDeclaration(a).replace(/;$/, '');
  const right = cssDeclaration(b).replace(/;$/, '');

  return left !== '' && left === right;
}

function cssVarToken(text) {
  const match = cssDeclaration(text).match(/:\s*var\(\s*([^)]+?)\s*\)\s*;?$/i);

  return match ? match[1].trim() : '';
}

function cssPropertyOf(text) {
  const match = cssDeclaration(text).match(/^([a-z-]+)\s*:/i);

  return match ? match[1].toLowerCase() : '';
}

function isCssBoxProperty(prop, prefix) {
  return prop === prefix || prop.startsWith(`${prefix}-`);
}

function cssValueOf(text) {
  const decl = cssDeclaration(text);
  const idx = decl.indexOf(':');

  return idx === -1 ? '' : decl.slice(idx + 1).replace(/;$/, '').trim().toLowerCase();
}

export function normalizeFlexValue(value) {
  const v = String(value || '').trim().toLowerCase();

  if (v === 'start' || v === 'flex-start' || v === 'left' || v === 'top') {
    return 'flex-start';
  }

  if (v === 'end' || v === 'flex-end' || v === 'right' || v === 'bottom') {
    return 'flex-end';
  }

  if (v === 'row-reverse') {
    return 'row-reverse';
  }

  if (v === 'column-reverse') {
    return 'column-reverse';
  }

  return v;
}

function isFlexDisplay(value) {
  const v = normalizeFlexValue(value);

  return v === 'flex' || v === 'inline-flex';
}

export function cssRuleAtCursor() {
  const view = editors.css;

  if (!view) {
    return null;
  }

  const pos = view.state.selection.main.head;
  const text = view.state.doc.toString();
  const stack = [];
  const blocks = [];

  for (let i = 0; i < text.length; i += 1) {
    if (text[i] === '{' && text[i + 1] === '{') {
      const end = text.indexOf('}}', i + 2);

      if (end === -1) {
        break;
      }

      i = end + 1;
      continue;
    }

    if (text[i] === '{') {
      stack.push(i);
    } else if (text[i] === '}') {
      const open = stack.pop();

      if (open != null) {
        blocks.push({ from: open + 1, to: i, text: text.slice(open + 1, i), open });
      }
    }
  }

  let inner = null;

  for (const block of blocks) {
    if (pos < block.open || pos > block.to) {
      continue;
    }

    if (!inner || block.to - block.open < inner.to - inner.open) {
      inner = block;
    }
  }

  return inner;
}

function cssFlatDecls(text) {
  const chunk = String(text || '');
  let out = '';
  let depth = 0;

  for (let i = 0; i < chunk.length; i += 1) {
    if (chunk[i] === '{' && chunk[i + 1] === '{') {
      const end = chunk.indexOf('}}', i + 2);

      if (end === -1) {
        break;
      }

      if (depth === 0) {
        out += chunk.slice(i, end + 2);
      }

      i = end + 1;
      continue;
    }

    if (chunk[i] === '{') {
      depth += 1;
      continue;
    }

    if (chunk[i] === '}') {
      depth = Math.max(0, depth - 1);
      continue;
    }

    if (depth === 0) {
      out += chunk[i];
    }
  }

  return out;
}

function parseCssDecls(block) {
  const out = {};

  for (const part of cssFlatDecls(block).split(';')) {
    const prop = cssPropertyOf(part);

    if (prop) {
      out[prop] = cssValueOf(`${part};`);
    }
  }

  return out;
}

function findDeclInRule(view, rule, property) {
  if (!rule || rule.from >= rule.to) {
    return null;
  }

  let line = view.state.doc.lineAt(rule.from);
  let depth = 0;

  while (line.from <= rule.to) {
    const from = Math.max(line.from, rule.from);
    const to = Math.min(line.to, rule.to);
    const text = view.state.doc.sliceString(from, to);

    if (depth === 0 && cssPropertyOf(text) === property) {
      return { from, to, text };
    }

    depth += cssBraceDelta(text);

    if (line.to >= view.state.doc.length || line.to >= rule.to) {
      break;
    }

    line = view.state.doc.lineAt(line.to + 1);
  }

  return null;
}

function cssBraceDelta(text) {
  let delta = 0;
  const chunk = String(text);

  for (let i = 0; i < chunk.length; i += 1) {
    if (chunk[i] === '{' && chunk[i + 1] === '{') {
      const end = chunk.indexOf('}}', i + 2);

      i = end === -1 ? chunk.length : end + 1;
      continue;
    }

    if (chunk[i] === '{') {
      delta += 1;
    } else if (chunk[i] === '}') {
      delta -= 1;
    }
  }

  return delta;
}

export function lineIndentOf(text) {
  return (String(text).match(/^\s*/) || [''])[0];
}

export function indentFromPrevious(view, line, forCss) {
  for (let n = line.number - 1; n >= 1; n -= 1) {
    const prev = view.state.doc.line(n);
    const trimmed = prev.text.trim();

    if (!trimmed) {
      continue;
    }

    const indent = lineIndentOf(prev.text);

    if (forCss && (trimmed === '{' || trimmed.endsWith('{'))) {
      return `${indent}  `;
    }

    if (trimmed === '}' || trimmed.startsWith('}')) {
      continue;
    }

    return indent;
  }

  return '';
}

function cssIndentAt(view, pos) {
  const line = view.state.doc.lineAt(pos);

  if (line.text.trim()) {
    return lineIndentOf(line.text);
  }

  const fromPrev = indentFromPrevious(view, line, true);

  if (fromPrev) {
    return fromPrev;
  }

  const rule = cssRuleAtCursor();

  if (rule) {
    return inferRuleIndent(view, rule);
  }

  return '  ';
}

function inferRuleIndent(view, rule) {
  const startLine = view.state.doc.lineAt(rule.from);
  const endLine = view.state.doc.lineAt(Math.max(rule.from, rule.to));

  for (let n = endLine.number; n >= startLine.number; n -= 1) {
    const line = view.state.doc.line(n);
    const sliceFrom = Math.max(line.from, rule.from);
    const sliceTo = Math.min(line.to, rule.to);
    const text = view.state.doc.sliceString(sliceFrom, sliceTo);

    if (text.trim()) {
      return (text.match(/^\s*/) || [''])[0] || '  ';
    }
  }

  const open = view.state.doc.lineAt(Math.max(0, rule.from - 1));

  return `${(open.text.match(/^\s*/) || [''])[0]}  `;
}

function finishCssEdit() {
  editors.css?.focus();

  if (dockState.lastWin) {
    onEditorInput(dockState.lastWin);
    paintCssToolState(dockState.lastWin);
  }
}

/**
 * The selector in front of a rule's `{`.
 *
 * Read backwards to the previous `}`, `{` or `;` — whatever closed the last
 * thing — which is where this rule's own prelude starts.
 */
function cssRuleSelector(view, rule) {
  if (!rule) {
    return '';
  }

  const text = view.state.doc.toString();
  let from = 0;

  for (let i = rule.open - 1; i >= 0; i -= 1) {
    if (text[i] === '}' || text[i] === '{' || text[i] === ';') {
      from = i + 1;
      break;
    }
  }

  return text.slice(from, rule.open).replace(/\/\*[\s\S]*?\*\//g, '').trim();
}

/**
 * The rule a state button points at — `.card:hover` beside `.card`.
 *
 * Made if it is not there yet, directly after the rule it belongs to, because
 * that is where a person would have written it. Returns the rule to write into,
 * or null when there is nothing to hang a state off.
 */
/**
 * Find or make the nested block a state writes into — `&:hover` inside the rule.
 *
 * Nested, not a second rule beside it: that is how these stylesheets are
 * written, and `&:hover` moves with the rule if the selector is ever renamed.
 * A `.card:hover` written before is still recognised, so an older file is not
 * given a second, nested one saying the same thing.
 */
function cssStateRule(view, rule) {
  if (!dockState.cssState || !rule) {
    return rule;
  }

  const found = cssExistingStateRule(view, rule);

  if (found) {
    return found;
  }

  const selector = cssRuleSelector(view, rule);

  if (!selector || selector.startsWith('@')) {
    return rule;
  }

  const text = view.state.doc.toString();
  const outer = leadingCssIndent(text, rule.open);
  const indent = leadingCssIndent(text, rule.to) || `${outer}    `;
  const tail = (view.state.doc.sliceString(rule.from, rule.to).match(/\n([^\S\n]*)$/) || [null, null])[1];
  const at = tail === null ? rule.to : rule.to - tail.length;
  const insert = `\n${indent}&${cssStateSuffix()} {\n${indent}}\n${tail ?? outer}`;

  view.dispatch({ changes: { from: at, to: rule.to, insert } });

  // Offsets moved with the insert, so the new block is located in the new
  // text rather than through the rule object, which is now stale.
  const next = view.state.doc.toString();
  const open = next.indexOf('{', at + insert.indexOf('&'));
  const close = open === -1 ? -1 : matchBraces(next, open);

  return close === -1
    ? rule
    : { from: open + 1, to: close, text: next.slice(open + 1, close), open };
}

/** The whitespace at the start of the line a position sits on. */
export function leadingCssIndent(text, pos) {
  const start = text.lastIndexOf('\n', pos - 1) + 1;
  const prefix = text.slice(start, pos);

  return (prefix.match(/^\s*/) || [''])[0];
}

export function applyRuleDecls(updates) {
  const view = editors.css;

  if (!view || view.state.readOnly || !updates.length) {
    return;
  }

  const atCursor = cssRuleAtCursor();
  // A state is a second rule, not a second declaration: `:hover` belongs on
  // the selector. Only make one when there is something to put in it —
  // clearing a property must never leave an empty `:hover` behind.
  const rule = updates.some((item) => item.value != null)
    ? cssStateRule(view, atCursor)
    : atCursor;

  if (!rule) {
    const snippet = updates
      .filter((item) => item.value != null)
      .map((item) => `${item.property}: ${item.value};`)
      .join('\n');

    if (snippet) {
      insertCssAtCursor(snippet);
    }

    finishCssEdit();

    return;
  }

  const changes = [];
  const inserts = [];
  const indent = inferRuleIndent(view, rule);

  for (const update of updates) {
    const found = findDeclInRule(view, rule, update.property);

    if (update.value == null) {
      if (!found) {
        continue;
      }

      let from = found.from;
      let to = found.to;
      const after = view.state.doc.sliceString(to, to + 1);

      if (after === '\n') {
        to += 1;
      }

      from = Math.max(from, rule.from);
      to = Math.min(to, rule.to);
      changes.push({ from, to });
      continue;
    }

    if (found && normalizeFlexValue(cssValueOf(found.text)) === normalizeFlexValue(update.value)) {
      continue;
    }

    if (found) {
      const foundIndent = (found.text.match(/^\s*/) || [''])[0];

      changes.push({ from: found.from, to: found.to, insert: `${foundIndent}${update.property}: ${update.value};` });
    } else {
      inserts.push(`${indent}${update.property}: ${update.value};`);
    }
  }

  if (inserts.length) {
    const prefix = !rule.text.includes('\n') || !/\n\s*$/.test(rule.text) ? '\n' : '';
    // The closing brace usually sits on its own indented line. Writing *at*
    // the brace leaves that indent in front of the new declaration and pushes
    // the brace out to column nought — so swallow the whitespace and put the
    // brace back on a line of its own.
    const tail = (rule.text.match(/\n([^\S\n]*)$/) || [null, null])[1];
    const from = tail === null ? rule.to : rule.to - tail.length;
    const close = tail === null ? '' : tail;

    changes.push({ from, to: rule.to, insert: `${prefix}${inserts.join('\n')}\n${close}` });
  }

  if (changes.length) {
    changes.sort((a, b) => b.from - a.from || b.to - a.to);
    view.dispatch({ changes });
  }

  finishCssEdit();
}

export function currentFlexDecls() {
  const view = editors.css;
  const rule = cssRuleAtCursor();

  if (!rule) {
    return {};
  }

  // With a state picked, the row must light up for what `.card:hover` has —
  // otherwise every button looks off the moment you switch to hover.
  if (dockState.cssState && view) {
    const stateRule = cssExistingStateRule(view, rule);

    return stateRule ? parseCssDecls(stateRule.text) : {};
  }

  return parseCssDecls(rule.text);
}

/**
 * The block a state already has — never made, only found.
 *
 * `&:hover` nested inside the rule first, because that is what gets written
 * now; then `.card:hover` anywhere in the file, because that is what older
 * files say. Either way it is one block, and there is never a second.
 */
function cssExistingStateRule(view, rule) {
  const selector = cssRuleSelector(view, rule);
  const suffix = cssStateSuffix();

  if (!selector || selector.startsWith('@')) {
    return null;
  }

  if (selector.endsWith(suffix)) {
    return rule;
  }

  const text = view.state.doc.toString();
  const block = (open) => {
    const close = matchBraces(text, open);

    return close === -1 ? null : { from: open + 1, to: close, text: text.slice(open + 1, close), open };
  };

  for (const wanted of [`&${suffix}`, `${selector}${suffix}`]) {
    const re = new RegExp(`(^|[^\\w-])${wanted.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\{`, 'g');
    let m;

    while ((m = re.exec(text))) {
      const open = text.indexOf('{', m.index);

      // The nested one only counts inside this rule; a `&:hover` under some
      // other selector is some other tag's hover.
      if (wanted.startsWith('&') && (open < rule.from || open > rule.to)) {
        continue;
      }

      const hit = block(open);

      if (hit) {
        return hit;
      }
    }
  }

  return null;
}

export function applyFlexDirection(direction) {
  const decls = currentFlexDecls();
  const flexOn = isFlexDisplay(decls.display);
  const currentDir = normalizeFlexValue(decls['flex-direction']) || (flexOn ? 'row' : '');

  if (flexOn && currentDir === direction) {
    const updates = [];

    if (decls['flex-direction']) {
      updates.push({ property: 'flex-direction', value: null });
    }

    if (isFlexDisplay(decls.display)) {
      updates.push({ property: 'display', value: null });
    }

    applyRuleDecls(updates);

    return;
  }

  applyRuleDecls([
    { property: 'display', value: 'flex' },
    { property: 'flex-direction', value: direction },
  ]);
}

export function applyDisplay(value) {
  const decls = currentFlexDecls();

  if (value === 'flex' && isFlexDisplay(decls.display)) {
    applyRuleDecls([
      { property: 'justify-content', value: null },
      { property: 'align-items', value: null },
      { property: 'flex-direction', value: null },
      { property: 'display', value: null },
    ]);

    return;
  }

  applyRuleDecls([{ property: 'display', value }]);
}

function applyFlexValue(property, value) {
  const decls = currentFlexDecls();

  if (normalizeFlexValue(decls[property]) === normalizeFlexValue(value)) {
    applyRuleDecls([{ property, value: null }]);

    return;
  }

  applyRuleDecls([{ property, value }]);
}

function currentCssLine() {
  const view = editors.css;

  if (!view) {
    return null;
  }

  return view.state.doc.lineAt(view.state.selection.main.head);
}

function removeCssLine(view, line) {
  let from = line.from;
  let to = line.to;

  if (to < view.state.doc.length) {
    to += 1;
  } else if (from > 0) {
    from -= 1;
  }

  view.dispatch({
    changes: { from, to },
    selection: { anchor: Math.min(from, view.state.doc.length) },
  });
}

function replaceCssLine(view, line, text) {
  const indent = (line.text.match(/^\s*/) || [''])[0];
  const next = `${indent}${text.replace(/;?$/, ';')}`;

  view.dispatch({
    changes: { from: line.from, to: line.to, insert: next },
    selection: { anchor: line.from + next.length },
  });
}

function clearCssProperty(property) {
  const view = editors.css;

  if (!view || view.state.readOnly) {
    return;
  }

  const line = currentCssLine();

  if (!line || cssPropertyOf(line.text) !== property) {
    return;
  }

  removeCssLine(view, line);
  view.focus();

  if (dockState.lastWin) {
    onEditorInput(dockState.lastWin);
    paintCssToolState(dockState.lastWin);
  }
}

function applyCssSnippet(text) {
  const view = editors.css;

  if (!view || view.state.readOnly) {
    return;
  }

  const want = cssDeclaration(text).replace(/;?$/, ';');
  const line = currentCssLine();
  const have = line ? line.text : '';

  if (line && cssLinesMatch(have, want)) {
    removeCssLine(view, line);
  } else if (have.trim() && cssPropertyOf(have) === cssPropertyOf(want)) {
    replaceCssLine(view, line, want);
  } else {
    insertCssAtCursor(want);
    view.focus();

    if (dockState.lastWin) {
      onEditorInput(dockState.lastWin);
      paintCssToolState(dockState.lastWin);
    }

    return;
  }

  view.focus();

  if (dockState.lastWin) {
    onEditorInput(dockState.lastWin);
    paintCssToolState(dockState.lastWin);
  }
}

function insertCssAtCursor(text) {
  const view = editors.css;

  if (!view || view.state.readOnly) {
    return;
  }

  const pos = view.state.selection.main.head;
  const line = view.state.doc.lineAt(pos);
  const before = line.text.slice(0, pos - line.from);
  const after = line.text.slice(pos - line.from);
  const indent = cssIndentAt(view, pos);
  const decl = text.replace(/;?$/, ';');

  if (before.trim() === '' && after.trim() === '') {
    const insert = `${indent}${decl}\n${indent}`;

    view.dispatch({
      changes: { from: line.from, to: line.to, insert },
      selection: { anchor: line.from + insert.length },
    });

    return;
  }

  const insert = `\n${indent}${decl}\n${indent}`;

  view.dispatch({
    changes: { from: pos, to: view.state.selection.main.to, insert },
    selection: { anchor: pos + insert.length },
  });
}

export function paintCssToolState(win) {
  try {
    paintCssToolStateInner(win);
    // The head row answers the same three questions the tools do, off the same
    // cursor, so it is repainted on the same beat rather than on a timer.
    paintCssHead(win);
  } catch {
    /* invalid Antlers-in-CSS must not take down Live Preview */
  }
}

/**
 * Redraw the row from what the file says — both languages, one model.
 *
 * Nothing here reaches into the DOM. It fills `cssToolsUi`, the component
 * loops over it, and a tool and its children are lit, opened and clicked by
 * exactly the same rules because they are the same kind of thing.
 */
function paintCssToolStateInner(win) {
  const tw = dockState.styleMode === 'tw';
  const decls = tw ? {} : currentFlexDecls();
  // Is this a flex container? Asked of whichever language is on screen, so
  // alignment appears under the same condition in both.
  const flexOn = tw
    ? isFlexDisplay(twActiveClass('display'))
    : isFlexDisplay(decls.display);
  const flexDir = normalizeFlexValue(decls['flex-direction']) || (flexOn ? 'row' : '');

  /** Is this property set on the rule under the cursor / the picked tag? */
  const isSet = (item) => {
    if (tw) {
      return twHasNode() && !!item.tw && !!twActiveClass(item.tw);
    }

    return !!item.css && item.css in decls;
  };

  cssToolsUi.tools = CSS_TOOLS.map((tool) => {
    const kids = (tool.kids || [])
      // Alignment belongs to a flex container. Offering it on something that is
      // not one is offering to write a declaration that does nothing.
      .filter((kid) => kid.when !== 'flex' || flexOn)
      .map((kid) => ({
        id: kid.id,
        title: kid.title,
        icon: CSS_TOOL_ICONS[kid.icon] || '',
        sep: !!kid.sep,
        open: dockState.cssOpenMenu === kid.id,
        active: tw
          ? isSet(kid)
          : kid.kind === 'display'
            ? flexOn
            : kid.kind === 'flexDir'
              ? flexOn && flexDir === kid.value
              : kid.value
                ? normalizeFlexValue(decls[kid.css]) === normalizeFlexValue(kid.value)
                : isSet(kid),
      }));

    return {
      id: tool.id,
      title: tool.title,
      icon: CSS_TOOL_ICONS[tool.id] || TW_TOOL_ICONS[tool.id] || '',
      open: dockState.cssOpenTool === tool.id || dockState.cssOpenMenu === tool.id,
      kids,
      // A parent is lit when it is set, or when any of its children is: Padding
      // is on whether the file says `padding` or only `padding-block-start`.
      active: tool.value
        ? !tw && normalizeFlexValue(decls[tool.css]) === normalizeFlexValue(tool.value)
        : isSet(tool) || kids.some((kid) => kid.active),
    };
  });
}


export function closeCssMenu(doc) {
  const menu = doc?.getElementById(CSS_MENU_ID);

  dockState.cssOpenMenu = '';

  menu?._sveApp?.unmount();
  menu?.remove();
  doc?.querySelectorAll('[data-sve-css-tool][data-open], [data-sve-html-tool][data-open], [data-sve-css-add-class][data-open], [data-sve-code-history][data-open]').forEach((el) =>
    el.removeAttribute('data-open')
  );
}

/** Close CSS/HTML tool menus and CodeMirror suggestions — they sit above Statamic pickers. */
export function closeCodeDockPopups(doc) {
  closeCssMenu(doc);
  closeDataMenu(doc);
  closeClassTokenUi(doc);

  for (const handle of HANDLES) {
    if (editors[handle]) {
      closeCompletion?.(editors[handle]);
    }
  }
}

function loadThemeColors(win) {
  if (dockState.cssColorsPromise) {
    return dockState.cssColorsPromise;
  }

  const cpUrl =
    win.Statamic?.$config?.get?.('cpUrl') || `/${win.Statamic?.$config?.get?.('cpRoute') || 'cp'}`;

  dockState.cssColorsPromise = win
    .fetch(`${cpUrl}/color-scheme/swatches`, {
      credentials: 'same-origin',
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
    })
    .then(async (res) => {
      if (!res.ok) {
        return [];
      }

      const json = await res.json().catch(() => []);

      return Array.isArray(json) ? json : [];
    })
    .catch(() => [])
    .then((swatches) => {
      const seen = new Set();
      const out = [];

      for (const item of swatches) {
        const raw = item.var || item.value || item.handle;
        const name = String(raw || '')
          .trim()
          .replace(/^var\((.+)\)$/, '$1');

        if (!name || seen.has(name)) {
          continue;
        }

        seen.add(name);
        out.push({ name, hex: item.hex || item.color || '' });
      }

      for (const [name, hex] of CSS_GRAYS) {
        if (seen.has(name)) {
          continue;
        }

        seen.add(name);
        out.push({ name, hex });
      }

      return out;
    });

  return dockState.cssColorsPromise;
}

function markCssMenuActive(menu, property) {
  const value = currentFlexDecls()[property] || '';
  const match = String(value).match(/^var\(\s*([^)]+?)\s*\)$/i);
  const token = match ? match[1].trim() : '';

  for (const btn of menu.querySelectorAll('[data-sve-css-token]')) {
    if (token && btn.getAttribute('data-sve-css-token') === token) {
      btn.setAttribute('data-active', '');
    } else {
      btn.removeAttribute('data-active');
    }
  }
}

export function placeCssMenu(win, anchor, menu) {
  const rect = anchor.getBoundingClientRect();
  const pad = 8;
  // The anchor sits in the dock, low on the screen: a list that runs past
  // the bottom edge cannot be scrolled to. Where there is more room above,
  // the menu opens upward; either way its height stops at the edge.
  const below = win.innerHeight - (rect.bottom + 4) - pad;
  const above = rect.top - 4 - pad;

  // Measured unclamped: a cap from the last placement would report the cap.
  menu.style.maxHeight = '';

  const height = menu.offsetHeight || 0;
  const upward = height > below && above > below;

  menu.style.left = `${Math.max(pad, Math.min(rect.left, win.innerWidth - 220))}px`;
  menu.style.maxHeight = `${Math.max(120, upward ? above : below)}px`;
  menu.style.top = upward
    ? `${Math.max(pad, rect.top - 4 - Math.min(height, above))}px`
    : `${Math.max(pad, rect.bottom + 4)}px`;
}

export function openCssColorMenu(win, anchor, property) {
  const doc = win.document;

  closeCssMenu(doc);
  anchor.setAttribute('data-open', '');

  const menu = doc.createElement('div');

  menu.id = CSS_MENU_ID;
  doc.body.appendChild(menu);
  placeCssMenu(win, anchor, menu);

  const paint = (swatches) => {
    menu._sveApp?.unmount();
    menu._sveApp = mountSurface(CodeDockMenu, menu, {
      kind: 'colors',
      swatches,
      onClear: () => {
        applyRuleDecls([{ property, value: null }]);
        closeCssMenu(doc);
      },
      onPick: (name) => {
        applyRuleDecls([{ property, value: `var(${name})` }]);
        closeCssMenu(doc);
      },
    });
    markCssMenuActive(menu, property);
  };

  paint(CSS_GRAYS.map(([name, hex]) => ({ name, hex })));

  loadThemeColors(win).then((colors) => {
    if (!doc.getElementById(CSS_MENU_ID)) {
      return;
    }

    paint(colors.map((color) => ({ name: color.name, hex: color.hex })));
  });
}

/**
 * Pick a value for one property, from this site's own scale.
 *
 * `extra` is what the scale cannot answer — `auto`, `100%`, `fit-content`.
 * They go at the top, because on Width they are the usual answer and the
 * scale is the exception.
 */
/** A short, fixed list — `text-align` has four answers and always will. */
export function openCssChoiceMenu(win, anchor, property, choices) {
  const doc = win.document;

  closeCssMenu(doc);
  anchor.setAttribute('data-open', '');

  const menu = doc.createElement('div');
  const current = currentFlexDecls()[property] || '';

  menu.id = CSS_MENU_ID;
  doc.body.appendChild(menu);
  placeCssMenu(win, anchor, menu);
  menu._sveApp = mountSurface(CodeDockMenu, menu, {
    kind: 'choices',
    choices: (choices || []).map((value) => ({
      value,
      label: value,
      active: normalizeFlexValue(value) === normalizeFlexValue(current),
    })),
    onPick: (value) => {
      // Clicking what is already set takes it off again, the same as every
      // other toggle in this row.
      const same = normalizeFlexValue(value) === normalizeFlexValue(currentFlexDecls()[property] || '');

      applyRuleDecls([{ property, value: same ? null : value }]);
      closeCssMenu(doc);
    },
  });
}

export function openCssValueMenu(win, anchor, property, extra = []) {
  const doc = win.document;

  closeCssMenu(doc);
  anchor.setAttribute('data-open', '');
  twWantFamilies(win);

  const menu = doc.createElement('div');

  menu.id = CSS_MENU_ID;
  doc.body.appendChild(menu);
  placeCssMenu(win, anchor, menu);

  const paint = () => {
    const rows = [
      ...extra.map((value) => ({ value, label: value })),
      ...twValueOptions(win, property).map((option) => ({
        value: option.value,
        label: option.value,
      })),
    ];
    const current = currentFlexDecls()[property] || '';

    menu._sveApp?.unmount();
    menu._sveApp = mountSurface(CodeDockMenu, menu, {
      kind: 'choices',
      choices: rows.map((row) => ({
        ...row,
        active: normalizeFlexValue(row.value) === normalizeFlexValue(current),
      })),
      onPick: (value) => {
        applyRuleDecls([{ property, value: value || null }]);
        closeCssMenu(doc);
      },
    });
  };

  paint();

  // The theme is one fetch. Draw what is known now, and again when it lands —
  // the alternative is a menu that is empty the first time it is opened.
  loadThemeColors(win).then(() => {
    if (doc.getElementById(CSS_MENU_ID) === menu) {
      paint();
    }
  });
}

export function openCssSpacingMenu(win, anchor, property) {
  const doc = win.document;

  closeCssMenu(doc);
  anchor.setAttribute('data-open', '');

  const menu = doc.createElement('div');

  menu.id = CSS_MENU_ID;
  doc.body.appendChild(menu);
  placeCssMenu(win, anchor, menu);
  menu._sveApp = mountSurface(CodeDockMenu, menu, {
    kind: 'choices',
    choices: CSS_SPACING.map((token) => ({ value: token, token, label: token })),
    onPick: (token) => {
      applyRuleDecls([{ property, value: `var(${token})` }]);
      closeCssMenu(doc);
    },
  });
  markCssMenuActive(menu, property);
}
