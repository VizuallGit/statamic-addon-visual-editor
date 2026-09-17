/**
 * code-dock.js — region "style-modes", split out in WP5. Same statements, same order;
 * only the imports are new. See the barrel code-dock.js for what the shell exports.
 */
import { chromeSet } from '../chrome-prefs.js';
import { on } from '../cp/bus.js';
import { flattenHtmlTree, parseHtmlTree } from '../html-tree-parse.js';
import { closeTwMenu, renderTwClasses } from '../tw-classes.js';
import { blocksForSize, idRulesForSize } from '../css-sizes.js';
import { t } from '../lib/i18n.js';
import { dockState } from '../dock/state.js';
import { CSS_MODE_ICON, DOCK_ID, ID_MODE_ICON, SCOPE_KEY, TW_MODE_ICON, VALUES_MODE_KEY, editors, html } from '../code-dock.js';
import { applyCssFolds, cssSizeRow, cssSizeRows, newSizeBlockSpot, newSizeQuery, paintCssHead } from './css-sizes.js';
import { closeCssMenu, leadingCssIndent, paintCssToolState } from './css-tools.js';
import { applyCssScope, flushCssScope, syncHtmlTree } from './scope.js';
import { paintCssIdMark } from './editor.js';
import { paintStrip } from './history-strip.js';
import { paintAlpine } from './alpine.js';

// ===== style-modes =====
/**
 * The tag the Tailwind row acts on: the one the HTML cursor is inside.
 *
 * Same rule as CSS mode, one pane over — there it is the rule under the
 * cursor, here it is the tag. Clicking a row in the tree, or an element in
 * the preview, moves that cursor, so all three ways of picking end up in the
 * same place instead of fighting each other.
 */
function twTargetFromCursor(win) {
  return dockState.styleMode === 'tw' ? htmlTargetFromCursor(win) : null;
}

/**
 * The tag the HTML cursor is inside, whichever language the style pane is in.
 *
 * Both rows point at the same thing and should say the same thing, so they ask
 * the same function — the mode only decides who is listening.
 */
export function htmlTargetFromCursor(win) {
  const view = editors.html;

  if (!view) {
    return null;
  }

  const scoped = dockState.htmlScopeActive && !!dockState.htmlFocus;
  const html = scoped ? dockState.htmlFull : view.state.doc.toString();
  const offset = scoped ? dockState.htmlFocus.from : 0;
  const pos = offset + view.state.selection.main.from;
  const rows = flattenHtmlTree(parseHtmlTree(html), new Set());
  let found = null;

  // Pre-order, and a child always sits inside its parent's range, so the last
  // row that still contains the cursor is the innermost tag.
  for (const row of rows) {
    if (row.from <= pos && pos < row.to) {
      found = row;
    }
  }

  return found;
}

export function syncTwTarget(win) {
  if (dockState.styleMode !== 'tw') {
    return;
  }

  renderTwClasses(win, twTargetFromCursor(win));
}

export function paintValuesMode(win) {
  const dock = win?.document.getElementById(DOCK_ID);
  const btn = dock?.querySelector('[data-sve-values-mode]');

  if (!dock || !btn) {
    return;
  }

  dock.setAttribute('data-sve-values', dockState.cssValues ? 'on' : 'off');

  const text = win.document.createElement('span');

  text.textContent = t(win, 'code_dock_values');
  btn.innerHTML = ID_MODE_ICON;
  btn.appendChild(text);
  btn.title = t(win, dockState.cssValues ? 'code_dock_values_off' : 'code_dock_values_on');
  btn.setAttribute('aria-label', btn.title);
  btn.setAttribute('aria-pressed', dockState.cssValues ? 'true' : 'false');
}

/**
 * Make this size's own rule if it has none yet, and put the cursor in it.
 *
 * Same promise the size blocks make: here is somewhere to write. Empty, it is
 * faded and never saved — so turning the ID on and off again leaves the file
 * exactly as it was, and a section that has no values yet still has a door to
 * them.
 *
 * One rule per size, not one per section: a value that changes on mobile has
 * to be written where mobile can see it, so the button opens the rule for the
 * size the panel is on and makes the block around it if that is missing too.
 */
export function enterValuesRule(win) {
  const view = editors.css;

  if (!view || view.state.readOnly) {
    return;
  }

  const rows = cssSizeRows(win);
  const text = view.state.doc.toString();
  const found = idRulesForSize(text, rows, dockState.cssSize);

  // The caret is the whole answer to "did anything happen". Put it in the rule
  // and take the focus with it: a caret in a pane nobody is typing in does not
  // blink, so the rule opened and the editor still looked untouched.
  view.focus();

  if (found.length) {
    const node = found[0];
    const at = Math.min(node.bodyTo, node.bodyFrom
      + (text.slice(node.bodyFrom).match(/^[^\S\n]*\n?/) || [''])[0].length);

    view.dispatch({ selection: { anchor: at }, scrollIntoView: true });

    return;
  }

  const row = cssSizeRow(win, dockState.cssSize);

  // All and the base share one rule, and it goes at the top of the file: the
  // values come before the design that reads them, and there is no block to
  // put them in.
  if (!row || row.base) {
    const head = '#id-{{ id }} {\n    ';

    view.dispatch({
      changes: { from: 0, to: 0, insert: `${head}\n}\n\n` },
      selection: { anchor: head.length },
      scrollIntoView: true,
    });

    return;
  }

  const block = blocksForSize(text, rows, dockState.cssSize)[0];

  // A narrower size writes its rule inside its own block, at the top of it —
  // same reason the base one is at the top of the file.
  if (block) {
    const indent = `${leadingCssIndent(text, block.from)}    `;
    const head = `\n${indent}#id-{{ id }} {\n${indent}    `;

    view.dispatch({
      changes: { from: block.bodyFrom, to: block.bodyFrom, insert: `${head}\n${indent}}\n` },
      selection: { anchor: block.bodyFrom + head.length },
      scrollIntoView: true,
    });

    return;
  }

  // No block for this size either. The rule and the block it lives in are one
  // thing to write, not a button that has to be clicked twice.
  const spot = newSizeBlockSpot(view, text);
  const inner = `${spot.indent}    `;

  // Unless the spot is already inside the ID rule — the shape where the sizes
  // are nested in it. There the block IS the size's layer, and naming the rule
  // again inside itself would read as `#id-… #id-…`: a descendant of itself,
  // matching nothing.
  const nested = idRulesForSize(text, rows, '')
    .some((node) => spot.at > node.bodyFrom && spot.at <= node.bodyTo);
  const head = nested
    ? `\n\n${spot.indent}@media ${newSizeQuery(row, text)} {\n${inner}`
    : `\n\n${spot.indent}@media ${newSizeQuery(row, text)} {\n${inner}#id-{{ id }} {\n${inner}    `;
  const tail = nested
    ? `\n${spot.indent}}${spot.suffix}`
    : `\n${inner}}\n${spot.indent}}${spot.suffix}`;

  view.dispatch({
    changes: { from: spot.at, to: spot.at, insert: `${head}${tail}` },
    selection: { anchor: spot.at + head.length },
    scrollIntoView: true,
  });
}

export function setValuesMode(win, on) {
  dockState.cssValues = !!on;
  chromeSet(win, VALUES_MODE_KEY, dockState.cssValues ? '1' : '0');
  closeCssMenu(win.document);
  dockState.cssOpenTool = '';
  paintValuesMode(win);
  // The pane's content changes, not just what is folded in it: hiding the ID
  // hands the tree scope back whatever it had.
  flushCssScope();
  applyCssScope();

  if (dockState.cssValues) {
    enterValuesRule(win);
  }

  applyCssFolds(win, true);
  paintCssIdMark();
  paintCssHead(win);
  paintCssToolState(win);
}

export function paintStyleMode(win) {
  const dock = win?.document.getElementById(DOCK_ID);

  if (!dock) {
    return;
  }

  const tw = dockState.styleMode === 'tw';

  dock.setAttribute('data-sve-style', dockState.styleMode);

  const label = dock.querySelector('[data-sve-css-label]');

  if (label) {
    label.textContent = tw ? t(win, 'code_dock_style_tw') : t(win, 'code_dock_css');
  }

  const btn = dock.querySelector('[data-sve-style-mode]');

  if (!btn) {
    return;
  }

  const text = win.document.createElement('span');

  text.textContent = tw ? t(win, 'code_dock_style_tw') : t(win, 'code_dock_css');
  btn.innerHTML = tw ? TW_MODE_ICON : CSS_MODE_ICON;
  btn.appendChild(text);
  btn.title = t(win, tw ? 'code_dock_style_to_css' : 'code_dock_style_to_tw');
  btn.setAttribute('aria-label', btn.title);
  btn.setAttribute('aria-pressed', tw ? 'true' : 'false');
}

/**
 * Tailwind mode points at the tag picked in the HTML tree, so the tree has to
 * be on screen — an icon row aimed at nothing is the same trap the scope
 * button already avoids.
 */
export function applyStyleMode(win) {
  const dock = win?.document.getElementById(DOCK_ID);

  closeCssMenu(win.document);
  closeTwMenu(win);
  // Switching language closes whatever was open: the row is about to be the
  // other language's, and a group left open would be pointing at nothing.
  dockState.cssOpenTool = '';
  dockState.cssOpenMenu = '';

  // Tailwind has no per-instance layer — its classes are on the tag, not in a
  // rule — so switching language leaves the ID behind rather than showing a
  // button that would point at nothing.
  if (dockState.styleMode === 'tw' && dockState.cssValues) {
    dockState.cssValues = false;
    chromeSet(win, VALUES_MODE_KEY, '0');
  }

  paintStyleMode(win);
  paintValuesMode(win);
  paintStrip(win);
  dockState.cssToolRow?.();

  if (dockState.styleMode === 'tw') {
    // Open it the way the tree button does, setting included. Opening it
    // behind the setting's back left the tree on screen with scoping off,
    // and then a click in it only selected the code instead of narrowing
    // the pane to that tag.
    dockState.htmlScopePref = true;
    chromeSet(win, SCOPE_KEY, '1');
    syncHtmlTree(win, true);
  }

  syncTwTarget(win);
  paintAlpine(win);
  paintCssToolState(win);
}

/**
 * Which screen size the CSS pane is looking at, and which state it writes for.
 *
 * `cssSize` is a breakpoint handle, or '' for "all of them". It does two
 * things and no more: it puts the other sizes' `@media` blocks away, and it
 * parks the cursor inside this size's block — and because every tool in the
 * row writes into the rule the cursor is in, that is all it takes for a click
 * on Padding to land under the right size.
 *
 * What it deliberately does NOT do is rewrite the pane. The text in front of
 * you is the file on disk, every time. Folding is reversible; a filtered view
 * that has to be merged back is one parse away from losing an edit.
 */
export const CSS_SIZE_KEY = 'sve-css-size';
export const CSS_STATE_KEY = 'sve-css-state';

/** Pseudo-classes worth a button. `before`/`after` are elements, and say so. */
export const CSS_STATES = ['hover', 'focus', 'focus-visible', 'active', 'disabled', 'before', 'after'];
