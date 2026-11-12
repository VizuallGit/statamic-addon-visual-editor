/**
 * One element, one markup: the dock's HTML toolbar writes what Build's Add
 * tile writes for the same element (dock/element-markup.js → markup.js), and
 * only the caret is the dock's own (`caretIn`).
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { addGroups, tileForTool } from '../../../resources/js/build-mode/catalog.js';
import { caretIn, markupFor } from '../../../resources/js/build-mode/markup.js';
import { imageMarkup, pictureMarkup, pictureSizes } from '../../../resources/js/build-mode/image.js';
import { HTML_DIVS, HTML_HEADINGS, HTML_TOOLS } from './dock-lists.js';

const LISTS = { htmlTools: HTML_TOOLS, divs: HTML_DIVS, headings: HTML_HEADINGS };
// A site that makes images (its App\Frontend\ImageMarkup says so).
const SITE = { formats: ['webp', 'jpg', 'png'], quality: 70 };
globalThis.Statamic = { $config: { get: (key) => (key === 'sveImageOptions' ? SITE : null) } };
const ROWS = [
  { handle: 'laptop', base: true, min_px: 1024, media_px: '' },
  { handle: 'tablet', base: false, min_px: 768, media_px: '(max-width: 1023.98px)' },
  { handle: 'mobile', base: false, min_px: 0, media_px: '(max-width: 767.98px)' },
];
const OPTS = {
  sectionTag: 'id="id-{{ id }}"',
  mobile: 'max-md',
  preset: '2',
  text: { heading: 'New heading', text: 'Write your text here.', button: 'Read more', link: 'Link', item: 'List item' },
  images: { img: imageMarkup(70), picture: pictureMarkup(pictureSizes(ROWS), 70) },
};
const words = Object.values(OPTS.text);
const read = (path) => readFileSync(fileURLToPath(new URL(`../../../resources/js/${path}`, import.meta.url)), 'utf8');

/** Every Build tile, by id — the elements Build adds. */
function tiles() {
  return new Map(
    addGroups(LISTS)
      .flatMap((group) => group.items)
      .map((entry) => [entry.id, entry])
  );
}

test('every toolbar button that adds an element finds the tile that adds the same element', () => {
  const pairs = {
    section: 'section',
    grid: 'grid',
    heading: 'heading',
    text: 'text',
    richtext: 'richtext',
    a: 'link',
    button: 'button',
    img: 'image',
    picture: 'picture',
    gallery: 'gallery',
    video: 'video',
    ul: 'list',
    hr: 'divider',
    loop: 'loop',
    if: 'if',
  };

  for (const [tool, tile] of Object.entries(pairs)) {
    assert.equal(tileForTool(LISTS, tool)?.id, tile, tool);
  }

  // Not an element to add, or one with a way of its own.
  for (const tool of ['component', 'pagination', 'svg']) {
    assert.equal(tileForTool(LISTS, tool), null, tool);
  }
});

test('the button and the tile write the very same markup', () => {
  const byId = tiles();

  for (const tool of HTML_TOOLS) {
    const entry = tileForTool(LISTS, tool.id);

    if (!entry) {
      continue;
    }

    const id = entry.id;
    const fromTile = markupFor(byId.get(id), OPTS);

    assert.equal(markupFor(entry, OPTS), fromTile, tool.id);
    assert.ok(fromTile, tool.id);
  }
});

test('an image and a picture come with their options; a heading and a text with their word', () => {
  assert.equal(
    markupFor(tileForTool(LISTS, 'img'), OPTS),
    '<img src="" alt="" width="1200" format="webp" quality="70" blur>'
  );
  assert.match(
    markupFor(tileForTool(LISTS, 'picture'), OPTS),
    /^<picture>\n {4}<source media="\(max-width: 767\.98px\)" width="768" height="768">\n {4}<source media="\(max-width: 1023\.98px\)" width="1024" height="768">\n {4}<img src="" alt="" width="1200" height="675" format="webp" quality="70" blur>\n<\/picture>$/
  );
  assert.equal(markupFor(tileForTool(LISTS, 'heading'), { ...OPTS, heading: 'h3' }), '<h3>New heading</h3>');
  assert.equal(
    markupFor(tileForTool(LISTS, 'text'), { ...OPTS, textTag: 'span' }),
    '<span>Write your text here.</span>'
  );
  assert.equal(markupFor(tileForTool(LISTS, 'text'), OPTS), '<p>Write your text here.</p>');
});

test("the dock's caret: into an empty attribute, over the word, where a snippet says, inside an empty element", () => {
  const at = (markup, def) => {
    const c = caretIn(markup, words, def);

    return markup.slice(0, c.at) + '|' + markup.slice(c.at, c.at + c.select) + '|' + markup.slice(c.at + c.select);
  };

  assert.equal(at('<a href="">Link</a>'), '<a href="||">Link</a>');
  assert.equal(at('<img src="" alt="" width="1200">'), '<img src="||" alt="" width="1200">');
  assert.equal(at('<h2>New heading</h2>'), '<h2>|New heading|</h2>');
  assert.equal(at('<ul>\n    <li>List item</li>\n</ul>'), '<ul>\n    <li>|List item|</li>\n</ul>');
  assert.equal(at('<div class="grid grid-cols-2"></div>'), '<div class="grid grid-cols-2">||</div>');
  assert.equal(at('<hr>'), '<hr>||');

  const loop = HTML_TOOLS.find((tool) => tool.id === 'loop');
  assert.equal(at(markupFor(tileForTool(LISTS, 'loop'), OPTS), loop), '{{ |items| }}\n\n{{ /items }}');
});

test('a site that makes no images has no Picture, in the dock or in Build', () => {
  const saved = globalThis.Statamic;

  globalThis.Statamic = undefined;

  try {
    assert.equal(tileForTool(LISTS, 'picture'), null);
    assert.ok(
      !addGroups(LISTS)
        .flatMap((group) => group.items)
        .some((entry) => entry.id === 'picture')
    );
    assert.match(
      read('dock/element-markup.js'),
      /HTML_TOOLS\.filter\(\(tool\) => !tool\.images \|\| siteImageOptions\(win\)\)/
    );
  } finally {
    globalThis.Statamic = saved;
  }
});

test('the dock writes through it: snippet buttons, tag buttons and menus alike', () => {
  const toolbars = read('dock/toolbars.js');
  const tools = read('dock/html-tools.js');

  assert.match(toolbars, /const element = toolElement\(win, tool\.id\)/);
  assert.match(toolbars, /tools: toolbarTools\(win\)\.map/);
  assert.match(tools, /const element = tagElement\(dockState\.lastWin, tag, classes\);/);

  // code-dock.js loads the dock's files before its own lists exist: a list read at load throws there.
  const mine = read('dock/element-markup.js');
  assert.doesNotMatch(mine.replace(/^\s*(\/\/|\*|\/\*\*).*$/gm, ''), /^const \w+ = \{[^}]*HTML_(TOOLS|DIVS|HEADINGS)/m);
});
