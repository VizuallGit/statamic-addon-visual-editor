/**
 * The Tailwind pane's class-list operations (tw-classes.js), run in node with
 * the CP stubbed: a dock that holds one file, a tag picked in it, and what
 * each operation writes back. Written before tw-classes.js was split (quality
 * pass, tab G, Fable's plan 5.5): the expected files are what the code wrote
 * then, so the split must write the same.
 *
 * The class parsing (tw-parse.js), the tree (html-tree-parse.js) and the tag
 * helpers run for real; the theme catalog never arrives (the operations work
 * without it), and everything else is a no-op.
 */
import { register } from 'node:module';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const target = new URL('../../resources/js/tw-classes.js', import.meta.url).href;

register('./support/stub-imports.mjs', import.meta.url, {
  data: {
    target,
    // Split into a folder in tab G: tw-classes.js and tw-classes/*.js are one module here.
    family: [new URL('../../resources/js/tw-classes/', import.meta.url).href],
    keep: [
      '/tw-parse.js',
      '/tw-covered.js',
      '/html-tree-parse.js',
      '/lib/retag.js',
      '/lib/data-states.js',
      '/lib/group-host.js',
      '/lib/tag-choices.js',
    ],
  },
});

const dock = { html: '', locked: false, writes: [] };
const twUi = {};

globalThis.__sveStub = (spec, name) => {
  if (name === 'ask') {
    return (what, arg) => {
      if (what === 'dock:html') return dock.html;
      if (what === 'dock:is-locked') return dock.locked;
      if (what === 'dock:set-html') {
        dock.html = arg;
        dock.writes.push(arg);
      }

      return undefined;
    };
  }
  if (name === 'twUi') return twUi;
  if (name === 'EVENT' || name === 'default') return {};
  if (name === 'GROUP_STATES') return [];
  if (name === 'HT_PATH_ATTR') return 'data-sve-ht-path';
  if (name === 't') return (win, key) => key;
  if (name === 'breakpoints' || name === 'ownVariables' || name === 'optionsForProperty') return () => [];
  if (name === 'loadFamilies') return () => new Promise(() => {});

  return () => undefined;
};

const { flattenHtmlTree, parseHtmlTree } = await import('../../resources/js/html-tree-parse.js');
const tw = await import('../../resources/js/tw-classes.js');

const win = {
  document: { getElementById: () => null, querySelector: () => null, querySelectorAll: () => [] },
  addEventListener() {},
  removeEventListener() {},
  setTimeout: (fn) => fn(),
  clearTimeout() {},
};

const FILE = '<section class="wrapper p-400 flex">\n  <h2 class="text-600 font-bold">Hi</h2>\n</section>\n';

/** The file in the dock, and the tag at `path` picked in the pane. */
function pick(path, html = FILE) {
  dock.html = html;
  dock.writes = [];
  const row = flattenHtmlTree(parseHtmlTree(html), new Set()).find((item) => item.path === path);

  assert.ok(row, `a row at ${path}`);
  tw.renderTwClasses(win, row);
}

/** The file after the operation, with the section's opening tag as `tag` and its class value as `value`. */
const file = (value, tag = 'section') =>
  `<${tag} class="${value}">\n  <h2 class="text-600 font-bold">Hi</h2>\n</${tag}>\n`;

test('twAddClass puts a new class at the end of the picked tag', () => {
  pick('0:section');
  tw.twAddClass(win, 'mt-200');

  assert.equal(dock.html, file('wrapper p-400 flex mt-200'));
});

test('twAddClass on a tag further in writes there, and only there', () => {
  pick('0:section/0:h2');
  tw.twAddClass(win, 'italic');

  assert.equal(
    dock.html,
    '<section class="wrapper p-400 flex">\n  <h2 class="text-600 font-bold italic">Hi</h2>\n</section>\n'
  );
});

test('twSortClasses orders the tag by what each class does', () => {
  pick('0:section');
  tw.twSortClasses(win);

  assert.equal(dock.html, file('flex p-400 wrapper'));
});

test('twReplaceClasses swaps the classes a utility is made of for the utility', () => {
  pick('0:section');
  tw.twReplaceClasses(win, ['p-400', 'flex'], 'card');

  assert.equal(dock.html, file('wrapper card'));
});

test('twSetOneOf puts one of a set in the place of the one worn', () => {
  pick('0:section');
  tw.twSetOneOf(win, ['flex', 'grid', 'block'], 'grid');

  assert.equal(dock.html, file('wrapper p-400 grid'));
});

test('twSetTag changes the tag itself, opening and closing', () => {
  pick('0:section');
  tw.twSetTag(win, 'article');

  assert.equal(dock.html, file('wrapper p-400 flex', 'article'));
});

test('a locked template is written by none of them', () => {
  pick('0:section');
  dock.locked = true;
  tw.twAddClass(win, 'mt-200');
  tw.twSortClasses(win);
  tw.twReplaceClasses(win, ['p-400'], 'card');
  tw.twSetOneOf(win, ['flex', 'grid'], 'grid');
  tw.twSetTag(win, 'article');
  dock.locked = false;

  assert.deepEqual(dock.writes, []);
});
