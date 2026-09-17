/**
 * code-dock.js — region "css-sizes", split out in WP5. Same statements, same order;
 * only the imports are new. See the barrel code-dock.js for what the shell exports.
 */
import { chromeSet } from '../chrome-prefs.js';
import { ask, on } from '../cp/bus.js';
import { mountPane } from '../cp/mount-pane.js';
import CodeDockCssHead from '../cp/surfaces/CodeDockCssHead.vue';
import CodeDockMenu from '../cp/surfaces/CodeDockMenu.vue';
import { twOpenTagMenuAt } from '../tw-classes.js';
import { cssUi } from '../cp/css/store.js';
import { bpDevice, breakpoints } from '../breakpoints.js';
import { blocksForSize, cssMediaBlocks, foldRangesForSize, idRulesForSize } from '../css-sizes.js';
import { mountSurface } from '../cp/mount.js';
import { bracketToken, matchBraces } from '../css-scope.js';
import { t } from '../lib/i18n.js';
import { dock } from '../dock/state.js';
import { CSS_MENU_ID, DOCK_ID, editors, foldEffect, foldedRanges, unfoldEffect } from '../code-dock.js';
import { closeCssMenu, cssRuleAtCursor, leadingCssIndent, paintCssToolState, placeCssMenu } from './css-tools.js';
import { CSS_SIZE_KEY, CSS_STATES, CSS_STATE_KEY, enterValuesRule, htmlTargetFromCursor } from './style-modes.js';
import { paintCssIdMark } from './editor.js';
import { currentFullHtml } from './scope.js';
import { isCodeDockOpen } from './dock-api.js';

// ===== css-sizes =====
/** The size rows as `css-sizes.js` wants them: handle, base, edge. */
export function cssSizeRows(win) {
  return breakpoints(win).map((row) => ({
    handle: row.handle,
    base: row.base,
    max: row.max,
    media: row.media,
    media_px: row.media_px,
    label: row.label,
  }));
}

export function cssSizeRow(win, handle) {
  return cssSizeRows(win).find((row) => row.handle === handle) || null;
}

/** The pseudo as it is written in CSS — `::before`, but `:hover`. */
export function cssStateSuffix(state = dock.cssState) {
  if (!state) {
    return '';
  }

  return state === 'before' || state === 'after' ? `::${state}` : `:${state}`;
}

/**
 * Put the other sizes away, and open this one.
 *
 * Runs on every size switch and after every load, because the ranges move
 * whenever the text does. Folds this code did not make are left alone — a
 * reader who folded something by hand keeps it folded.
 */
export function applyCssFolds(win, force = false) {
  const view = editors.css;

  if (!view || !foldEffect || !unfoldEffect) {
    return;
  }

  const text = view.state.doc.toString();
  const sig = `${dock.cssValues ? '1' : '0'}|${dock.cssSize}|${cssMediaBlocks(text).map((b) => `${b.from}-${b.to}`).join(',')}`;

  // Typing inside a rule moves nothing that is folded. Re-folding on every
  // keystroke would be work for nothing, and a dispatch per character.
  if (!force && sig === dock.cssFoldSig) {
    return;
  }

  dock.cssFoldSig = sig;

  const rows = cssSizeRows(win);
  const wanted = new Map();
  // The size says what is on screen at all; the ID button says whether this
  // size's own `#id-` rule is one of the things on it. Off is the resting
  // state — the design is what the pane is for — so the rule folds away until
  // it is asked for, at every size and at All too.
  const ranges = [
    ...foldRangesForSize(text, rows, dock.cssSize),
    ...(dock.cssValues
      ? []
      : idRulesForSize(text, rows, dock.cssSize).map((node) => ({ from: node.from, to: node.to }))),
  ];

  for (const range of ranges) {
    if (range.to > range.from) {
      wanted.set(`${range.from}:${range.to}`, { from: range.from, to: range.to });
    }
  }

  const effects = [];
  const present = new Set();

  foldedRanges(view.state).between(0, text.length, (from, to) => {
    const key = `${from}:${to}`;

    present.add(key);

    if (!wanted.has(key) && dock.cssOwnFolds.has(key)) {
      effects.push(unfoldEffect.of({ from, to }));
    }
  });

  for (const [key, range] of wanted) {
    if (!present.has(key)) {
      effects.push(foldEffect.of(range));
    }
  }

  dock.cssOwnFolds = new Set(wanted.keys());

  if (effects.length) {
    view.dispatch({ effects });
  }
}

/**
 * The `@media` spelling a size block this file does not have yet should use.
 *
 * Written in the spelling the file already uses. A file that says
 * `max-width: …px` throughout keeps saying it; everything else gets the
 * site's own unit, which is `em` unless the breakpoint says otherwise.
 *
 * Judged on the whole file, not on the pane: with the tree scope on, the pane
 * is a rebuilt view of one class and may hold no media query at all, and a
 * file written in px would quietly gain its first em one.
 */
export function newSizeQuery(row, text) {
  const spelling = dock.cssFull || text;

  return /max-width/i.test(spelling) && !/width\s*</i.test(spelling)
    ? row.media_px || row.media
    : row.media;
}

/**
 * Move the cursor into the size being looked at, making its block if needed.
 *
 * A size with nowhere to write is the whole reason this exists: clicking
 * Tablet on a section that has never had a tablet rule should leave you with
 * an empty tablet block and the cursor in it, not with a button that lit up
 * and did nothing.
 */
function enterCssSize(win, handle) {
  const view = editors.css;

  if (!view || view.state.readOnly) {
    return;
  }

  const rows = cssSizeRows(win);
  const row = cssSizeRow(win, handle);
  const text = view.state.doc.toString();

  if (!row || row.base) {
    // The base is what is left over when no size applies — it has no block of
    // its own to step into. All that is needed is to step *out* of one, and
    // only if the cursor is in one; otherwise the click moves nothing.
    const head = view.state.selection.main.head;
    const inside = cssMediaBlocks(text).find((block) => head >= block.from && head <= block.to);

    if (inside) {
      view.dispatch({ selection: { anchor: inside.from }, scrollIntoView: true });
    }

    return;
  }

  const existing = blocksForSize(text, rows, handle);

  if (existing.length) {
    const block = existing[0];
    const at = Math.min(block.bodyTo, block.bodyFrom + (text.slice(block.bodyFrom).match(/^[^\S\n]*\n?/) || [''])[0].length);

    view.dispatch({ selection: { anchor: at }, scrollIntoView: true });

    return;
  }

  const query = newSizeQuery(row, text);
  const spot = newSizeBlockSpot(view, text);
  const insert = `\n\n${spot.indent}@media ${query} {\n${spot.indent}    \n${spot.indent}}${spot.suffix}`;

  view.dispatch({
    changes: { from: spot.at, to: spot.at, insert },
    selection: { anchor: spot.at + insert.lastIndexOf('    ') + 4 },
    scrollIntoView: true,
  });
}

/**
 * Where a size that does not exist yet should be written.
 *
 * Beside its siblings if there are any — these templates keep the sizes
 * together at the bottom of the rule they belong to, and one written somewhere
 * else is one nobody finds again. With no siblings it goes at the end of the
 * rule the cursor is in, which is the rule whose declarations it overrides.
 * Only a cursor in no rule at all falls back to the end of the file.
 */
export function newSizeBlockSpot(view, text) {
  const blocks = cssMediaBlocks(text);

  if (blocks.length) {
    const last = blocks[blocks.length - 1];

    return { at: last.to, indent: leadingCssIndent(text, last.from), suffix: '' };
  }

  const inside = (rule) => ({
    // Just inside the closing brace, indented like the rule's own contents.
    at: rule.to,
    indent: leadingCssIndent(text, rule.to) || `${leadingCssIndent(text, rule.open)}    `,
    // The brace we are writing in front of has to keep its own line, or the
    // rule ends `}}` and the next reader has to count them.
    suffix: `\n${leadingCssIndent(text, rule.open)}`,
  });

  const rule = cssRuleAtCursor();

  if (rule) {
    return inside(rule);
  }

  // No siblings, and the cursor is in none of them. These panes are almost
  // always one rule — `#id-… { … }` in a section, the focused class with the
  // tree scope on — and a size written outside it is a size that belongs to
  // nothing. Only a pane with no single rule to speak of falls back to the end.
  const only = soleTopLevelRule(text);

  return only ? inside(only) : { at: text.length, indent: '', suffix: '' };
}

/** The one rule a pane consists of, or null when it is not shaped like that. */
function soleTopLevelRule(text) {
  const source = String(text || '');
  let found = null;
  let i = 0;
  let chunkStart = 0;

  while (i < source.length) {
    if (source[i] === '}' || source[i] === ';') {
      i += 1;
      chunkStart = i;
      continue;
    }

    if (source[i] !== '{') {
      i += 1;
      continue;
    }

    const close = matchBraces(source, i);

    if (close === -1) {
      return null;
    }

    if (found) {
      // A second one: there is no "the" rule to put it in.
      return null;
    }

    const prelude = source.slice(chunkStart, i).trim();

    // An at-rule is not a home for a size — `@media` inside `@media` is a
    // narrowing nobody asked for, and `@import` has no body to write in.
    found = prelude.startsWith('@') ? null : { from: chunkStart, open: i, to: close };

    if (!found) {
      return null;
    }

    i = close + 1;
    chunkStart = i;
  }

  return found;
}

function setCssSize(win, handle) {
  const next = handle === dock.cssSize ? '' : handle;

  dock.cssSize = next;
  chromeSet(win, CSS_SIZE_KEY, next);

  // Move the preview with it, the way the Tailwind row does. Through the
  // toolbar's own door so the block-order bookkeeping it does still happens.
  // "All" is Fit: no size filter on the row, no frame around the preview.
  ask('lp:set-device', { win, key: next ? bpDevice(next, win) : 'Responsive' });

  if (next) {
    enterCssSize(win, next);
  }

  // The ID is a layer inside a size, not a view instead of one: with it
  // showing, changing size changes which `#id-` rule you are writing in —
  // making it, and the block around it, the same as the button would.
  if (dock.cssValues) {
    enterValuesRule(win);
  }

  applyCssFolds(win, true);
  paintCssIdMark();
  paintCssHead(win);
  paintCssToolState(win);
}

function setCssState(win, state) {
  dock.cssState = CSS_STATES.includes(state) ? state : '';
  chromeSet(win, CSS_STATE_KEY, dock.cssState);
  closeCssMenu(win.document);
  paintCssHead(win);
  paintCssToolState(win);
}

function openCssStateMenu(win, anchor) {
  const doc = win.document;

  closeCssMenu(doc);
  anchor.setAttribute('data-open', '');

  const menu = doc.createElement('div');

  menu.id = CSS_MENU_ID;
  doc.body.appendChild(menu);
  placeCssMenu(win, anchor, menu);
  menu._sveApp = mountSurface(CodeDockMenu, menu, {
    kind: 'choices',
    choices: [
      { value: '', label: t(win, 'css_state_none'), active: !dock.cssState },
      ...CSS_STATES.map((key) => ({
        value: key,
        label: cssStateSuffix(key),
        active: key === dock.cssState,
      })),
    ],
    onPick: (key) => setCssState(win, key),
  });
}

/**
 * The row above the CSS editor: which tag, which size, which state.
 *
 * The tag is the one the HTML cursor is in — the same answer the Tailwind row
 * gives, because it is the same question. Without it the CSS pane was the one
 * place in the dock that never said what it was pointed at.
 */
export function paintCssHead(win) {
  const dock = win?.document.getElementById(DOCK_ID);
  const host = dock?.querySelector('[data-sve-css-head]');

  if (!host) {
    return;
  }

  const target = htmlTargetFromCursor(win);
  const rows = cssSizeRows(win);
  const text = editors.css?.state.doc.toString() ?? '';

  cssUi.tag = target?.tag || '';
  cssUi.scope = bracketToken(target ? currentFullHtml().slice(target.from, target.openTo) : '') || '';
  cssUi.canEdit = !dock.lastLocked;
  cssUi.onTag = (event) => twOpenTagMenuAt(win, event.currentTarget, target);
  cssUi.state = dock.cssState;
  cssUi.stateLabel = dock.cssState ? cssStateSuffix(dock.cssState) : t(win, 'css_state');
  cssUi.onState = (event) => openCssStateMenu(win, event.currentTarget);
  cssUi.onSize = (key) => setCssSize(win, key);
  cssUi.sizes = [
    {
      key: '',
      label: t(win, 'tw_size_all'),
      title: t(win, 'css_size_all_title'),
      active: !dock.cssSize,
    },
    ...rows.map((row) => {
      const has = row.base || blocksForSize(text, rows, row.handle).length > 0;

      return {
        key: row.handle,
        label: row.label,
        title: row.base
          ? t(win, 'css_size_base_title')
          : `@media ${row.media}${has ? '' : `  ·  ${t(win, 'css_size_new')}`}`,
        active: dock.cssSize === row.handle,
      };
    }),
  ];

  // Mounted once. `cssUi` is reactive, so every later repaint is a write to
  // the store — remounting on each keystroke would throw the row away and
  // build it again sixty times a second.
  if (!host._sveMounted) {
    host._sveMounted = true;
    mountPane(host, CodeDockCssHead);
  }
}

/**
 * The preview's device buttons move the CSS row with them.
 *
 * Same rule as the Tailwind row: the size you are looking at is the size you
 * are editing. Fit is not a size, so it clears the filter rather than picking
 * one — that is the view where you want to see the whole file.
 */
on('lp:device', (key) => {
  const win = dock.lastWin;

  if (!win || !isCodeDockOpen(win.document)) {
    return;
  }

  // Fit, and any name this site does not have, mean no filter at all.
  const next = breakpoints(win).find((item) => item.device === key)?.handle || '';

  if (next === dock.cssSize) {
    return;
  }

  dock.cssSize = next;
  chromeSet(win, CSS_SIZE_KEY, next);
  applyCssFolds(win, true);
  paintCssIdMark();
  paintCssHead(win);
  paintCssToolState(win);
});

/* ------------------------------------------------------------------ *
 * Alpine — the fourth pane
 * ------------------------------------------------------------------ */
