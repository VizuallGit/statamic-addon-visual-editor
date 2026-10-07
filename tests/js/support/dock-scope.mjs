/**
 * The real `dock/scope.js` in node, with its CodeMirror/Vue imports stubbed
 * (stub-imports.mjs) and two fake editors standing in for the HTML and CSS
 * panes.
 *
 * `update` is the part of the update listener in dock/editor.js that matters
 * here, in its order: an HTML change not made by the dock → `flushBracketSync`,
 * a CSS change not made by the dock → `flushCssToHtml`, then `onEditorInput` →
 * `readParts`, which syncs the HTML slice and flushes the CSS pane into
 * `cssFull`. The dock writes its own changes with `dockState.applying` set, so
 * a write from inside a flush skips both flushes, exactly as in the browser.
 */
import { register } from 'node:module';
import { flattenHtmlTree, parseHtmlTree } from '../../../resources/js/html-tree-parse.js';
import { bracketClassTokens } from '../../../resources/js/css-scope.js';

const scopeUrl = new URL('../../../resources/js/dock/scope.js', import.meta.url).href;

register('./stub-imports.mjs', import.meta.url, {
  data: {
    target: scopeUrl,
    keep: ['/css-scope.js', '/html-tree-parse.js', '/lib/minimal-change.js', '/dock/state.js'],
  },
});

function fakeView(handle) {
  let text = '';

  return {
    get state() {
      return { doc: { toString: () => text }, readOnly: false, selection: { main: { from: 0 } } };
    },
    dispatch({ changes }) {
      if (changes) {
        text = text.slice(0, changes.from) + changes.insert + text.slice(changes.to);
        update(handle);
      }
    },
    /** What the dock writes when it opens a file: no listener. */
    load(next) {
      text = next;
    },
    /** A keystroke, a paste or ⌘Z: the whole new text, through the listener. */
    type(next) {
      text = next;
      update(handle);
    },
    focus() {},
  };
}

export const editors = { html: fakeView('html'), css: fakeView('css') };

globalThis.__sveStub = (from, name) => {
  if (name === 'editors') {
    return editors;
  }

  if (from === './save.js' && name === 'onEditorInput') {
    return () => readParts();
  }

  return () => {};
};

export const scope = await import(scopeUrl);
export const { dockState } = await import(new URL('../../../resources/js/dock/state.js', import.meta.url).href);

function readParts() {
  if (dockState.applying) {
    return;
  }

  scope.syncScopedHtml();
  scope.flushCssScope();
}

function update(handle) {
  if (handle === 'html' && !dockState.applying) {
    scope.flushBracketSync(null);
  }

  if (handle === 'css' && !dockState.applying) {
    scope.flushCssToHtml();
  }

  readParts();
}

export function rows(html) {
  return flattenHtmlTree(parseHtmlTree(html), new Set());
}

/**
 * Open a file with the CSS pane on the element `row` (a row of `rows(html)`):
 * the CSS pane's own pick (`pick`), the HTML pane scoped to it (`scope`), or
 * the file just opened with nothing picked (`none`).
 */
export function openOn({ by, html, css, row, cssAll = false }) {
  Object.assign(dockState, {
    applying: false,
    lastLocked: false,
    lastWin: null,
    htmlScopePref: true,
    cssValues: false,
    cssAll,
    cssFocus: null,
    htmlFocus: null,
    htmlScopeActive: false,
    htmlFull: html,
    cssFull: css,
  });

  if (by === 'scope') {
    dockState.htmlFocus = { from: row.from, to: row.to };
    editors.html.load(scope.htmlEditorText());
  } else {
    editors.html.load(html);

    if (by === 'pick') {
      dockState.cssFocus = { path: row.path };
    }
  }

  scope.applyCssScope();
  scope.rememberBracketNames();
}

export const fullHtml = () => scope.currentFullHtml();
export const names = () => bracketClassTokens(fullHtml()).map((token) => token.name);
