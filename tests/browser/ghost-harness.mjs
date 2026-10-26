// Grey text in a real CodeMirror, without the Control Panel: the real
// dock/ghost-editor.js bundled with esbuild, its dock neighbours replaced by
// small stand-ins (the pane is the whole file, the section is hero/style_2, the
// Data rows are one `title`), the endpoint answered by a fake fetch — then
// typed into with the keyboard in headless Chrome.
//
// What it shows: the request carries the file around the caret and the rows;
// the grey text stands at the caret; Tab takes it in one step and ⌘Z takes it
// back in one; typing through keeps the rest; ⌘→ takes a word; Escape and a
// blur clear it; an answer for a caret that has moved is dropped; nothing is
// asked mid-word or while help's popup is open; a 422 is said once and stops
// the asking. A comment and Enter ask for a block, with "Writing …" while it
// comes; what was taken goes along with the next question and is counted.
// ⌘K opens the box (Statamic's palette held back), rewrites the selection,
// Esc puts it back and Enter keeps it.
//
// What it does not: the dock, the pane's toolbar, the real endpoint — that is
// the Live Preview proof. Seconds, no login.
// `node tests/browser/ghost-harness.mjs` (SVE_SITE_DIR for another site checkout).

import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { build } from 'esbuild';

const SITE = process.env.SVE_SITE_DIR || `${process.env.HOME}/Sites/vizuall-skabelon`;
const ADDON = new URL('../..', import.meta.url).pathname.replace(/\/$/, '');
const CHROME = process.env.SVE_CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const puppeteer = createRequire(`${SITE}/package.json`)('puppeteer');

/** ghost-editor.js's neighbours in the dock, as little as it asks of them. */
const STUBS = {
  '../code-dock.js': `import * as view from '@codemirror/view';
import * as state from '@codemirror/state';
import * as autocomplete from '@codemirror/autocomplete';
export const cm = { view, state, autocomplete };`,
  './state.js': 'export const dockState = { applying: false, htmlScopeActive: false, htmlFocus: null };',
  './scope.js': 'export function currentFullHtml() { return window.__view.state.doc.toString(); }',
  './dock-api.js': "export function currentTemplateType() { return 'hero/style_2'; }",
  './html-tools.js': 'export function finishHtmlEdit() { window.__finished += 1; }',
  './data-vars.js': "export function sectionDataRows() { return Promise.resolve([{ var: 'title', type: 'text', label: 'Title', value: 'Hej' }]); }",
};

const MAIN = `import { EditorView, keymap } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands';
import { enableGhost } from '${ADDON}/resources/js/dock/ghost-editor.js';

window.__finished = 0;
window.__requests = [];
window.__toasts = [];
window.__palette = [];
window.__answer = { status: 200, body: { ok: true, text: '' }, delay: 0 };
window.Statamic = {
  $toast: { error: (message) => window.__toasts.push(message) },
  $config: { get: () => null },
  $commandPalette: { preventIf: (fn) => window.__palette.push(fn) },
};
window.fetch = (url, opts) => {
  // Only the AI's own endpoint is answered here; the preferences' save is not this test's.
  if (!String(url).startsWith('/!/sve/dock-ghost')) {
    return Promise.resolve({ ok: true, status: 200, json: async () => ({}) });
  }

  window.__requests.push({ url, body: JSON.parse(opts.body) });
  const { status, body, delay } = window.__answer;

  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => resolve({ ok: status < 300, status, json: async () => body }), delay);
    opts.signal?.addEventListener('abort', () => {
      clearTimeout(timer);
      reject(new DOMException('aborted', 'AbortError'));
    });
  });
};

const view = new EditorView({
  state: EditorState.create({ doc: '', extensions: [history(), keymap.of([...defaultKeymap, ...historyKeymap, indentWithTab])] }),
  parent: document.getElementById('editor'),
});

window.__view = view;
enableGhost(window, view);
`;

const dir = mkdtempSync(join(tmpdir(), 'sve-ghost-'));

for (const [name, source] of Object.entries(STUBS)) {
  writeFileSync(join(dir, name.replace(/^\.\.?\//, '').replace('/', '-')), source);
}

writeFileSync(join(dir, 'main.js'), MAIN);

const stubbed = {
  name: 'dock-stubs',
  setup(b) {
    b.onResolve({ filter: /^\.\.?\// }, (args) => {
      if (!/\/dock\/ghost-[\w-]+\.js$/.test(args.importer) || !STUBS[args.path]) {
        return undefined;
      }

      return { path: join(dir, args.path.replace(/^\.\.?\//, '').replace('/', '-')) };
    });
  },
};

const bundle = await build({
  entryPoints: [join(dir, 'main.js')],
  bundle: true,
  format: 'iife',
  write: false,
  nodePaths: [join(ADDON, 'node_modules')],
  plugins: [stubbed],
  logLevel: 'silent',
});

rmSync(dir, { recursive: true, force: true });

const html = `<!doctype html><html><body><div id="editor"></div><button id="out">out</button><script>${bundle.outputFiles[0].text}</script></body></html>`;

// Served, not set: a page from about:blank has no localStorage, and the
// preferences the AI remembers in live there.
const server = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);
}).listen(0, '127.0.0.1');

await new Promise((resolve) => server.once('listening', resolve));

const browser = await puppeteer.launch({ headless: true, executablePath: CHROME });
const page = await browser.newPage();
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const results = [];

page.on('pageerror', (err) => results.push({ name: `page error: ${err.message}`, ok: false }));

await page.goto(`http://127.0.0.1:${server.address().port}/`);

const MOD = await page.evaluate(() => (/Mac/.test(navigator.platform) ? 'Meta' : 'Control'));

const check = (name, ok, detail = '') => results.push({ name, ok: !!ok, detail });

/** A fresh file, the caret where `|` is, the answer the endpoint will give. */
async function start(source, answer = {}) {
  await page.evaluate(
    (doc, caret, answer) => {
      const view = window.__view;

      view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: doc }, selection: { anchor: caret } });
      view.focus();
      window.__requests = [];
      window.__toasts = [];
      window.__finished = 0;
      window.__answer = { status: 200, body: { ok: true, text: '' }, delay: 0, ...answer };
    },
    source.replace('|', ''),
    source.indexOf('|'),
    answer
  );
  await pause(50);
}

const state = () =>
  page.evaluate(() => ({
    doc: window.__view.state.doc.toString(),
    ghost: document.querySelector('.cm-sve-ghost')?.textContent ?? null,
    requests: window.__requests.length,
    last: window.__requests.at(-1)?.body ?? null,
    lastUrl: window.__requests.at(-1)?.url ?? null,
    pending: document.querySelector('.cm-sve-ghost--pending')?.textContent ?? null,
    box: !!document.querySelector('[data-sve-ghost-edit]'),
    counts: JSON.parse(localStorage.getItem('sve-code-dock-ghost-counts') || 'null'),
    taken: JSON.parse(localStorage.getItem('sve-code-dock-ghost-taken') || '[]'),
    palette: window.__palette.map((fn) => fn()),
    selection: (() => { const r = window.__view.state.selection.main; return window.__view.state.sliceDoc(r.from, r.to); })(),
    toasts: window.__toasts.slice(),
    finished: window.__finished,
  }));

const ANSWER = 'edit field="title" inline_edit="true" }}';

// 1. The owner's example: {{ visual_ typed in an <h2>, grey text, Tab.
await start('<h2 class="x" |>{{ title }}</h2>', { body: { ok: true, text: ANSWER } });
await page.keyboard.type('{{ visual_');
await pause(700);
let s = await state();
check('one request after the pause', s.requests === 1, `requests ${s.requests}`);
check('the request holds the file before the caret', s.last?.before === '<h2 class="x" {{ visual_', JSON.stringify(s.last?.before));
check('… and after it', s.last?.after === '>{{ title }}</h2>', JSON.stringify(s.last?.after));
check('… the section and its rows, without their values', s.last?.section === 'hero/style_2' && JSON.stringify(s.last?.fields) === '[{"var":"title","type":"text","label":"Title"}]', JSON.stringify(s.last?.fields));
check('grey text stands at the caret', s.ghost === ANSWER, JSON.stringify(s.ghost));
check('grey text is not in the file', s.doc === '<h2 class="x" {{ visual_>{{ title }}</h2>', s.doc);

await page.evaluate(() => {
  window.__answer.body = { ok: true, text: '' };
});
await page.keyboard.press('Tab');
await pause(50);
s = await state();
check('Tab writes it into the file', s.doc === `<h2 class="x" {{ visual_${ANSWER}>{{ title }}</h2>`, s.doc);
check('… and the grey text is gone', s.ghost === null);
check('… and the dock is told (finishHtmlEdit)', s.finished === 1, `finished ${s.finished}`);
await pause(600);
s = await state();
check('taken whole, the next question is asked (Copilot chains)', s.requests === 2, `requests ${s.requests}`);

await page.keyboard.down(MOD);
await page.keyboard.press('z');
await page.keyboard.up(MOD);
await pause(50);
s = await state();
check('⌘Z takes the whole suggestion back in one step', s.doc === '<h2 class="x" {{ visual_>{{ title }}</h2>', s.doc);

// 2. Typing through it keeps the rest, without asking again.
await start('<h2 class="x" |>{{ title }}</h2>', { body: { ok: true, text: ANSWER } });
await page.keyboard.type('{{ visual_');
await pause(700);
await page.keyboard.type('ed');
await pause(600);
s = await state();
check('typing what the grey text shows keeps the rest', s.ghost === ANSWER.slice(2), JSON.stringify(s.ghost));
check('… without a new request', s.requests === 1, `requests ${s.requests}`);

// 3. ⌘→ takes one word.
await page.keyboard.down(MOD);
await page.keyboard.press('ArrowRight');
await page.keyboard.up(MOD);
await pause(50);
s = await state();
check('⌘→ takes the next word', s.doc === '<h2 class="x" {{ visual_edit>{{ title }}</h2>' && s.ghost === ANSWER.slice(4), `${s.doc} | ${JSON.stringify(s.ghost)}`);

// 4. Escape leaves it.
await page.keyboard.press('Escape');
await pause(50);
s = await state();
check('Escape clears the grey text, the file as it was', s.ghost === null && s.doc === '<h2 class="x" {{ visual_edit>{{ title }}</h2>', s.doc);

// 5. Tab without grey text is the pane's own Tab.
await page.keyboard.press('Tab');
await pause(50);
s = await state();
check('Tab with no grey text does what it did before (indent)', !s.doc.includes('field=') && s.doc !== '<h2 class="x" {{ visual_edit>{{ title }}</h2>', s.doc);

// 6. An answer for a caret that has moved is dropped.
await start('<div>\n  |\n</div>', { body: { ok: true, text: '<p>{{ title }}</p>' }, delay: 600 });
await page.keyboard.type('<p');
await pause(500);
await page.keyboard.press('ArrowLeft');
await pause(900);
s = await state();
check('an answer for a moved caret never shows', s.ghost === null && s.requests === 1, `ghost ${JSON.stringify(s.ghost)} requests ${s.requests}`);

// 7. Mid-word: nothing is asked.
await start('<h2>{{ ti|le }}</h2>', { body: { ok: true, text: 'x' } });
await page.keyboard.type('t');
await pause(600);
s = await state();
check('nothing is asked in the middle of a word', s.requests === 0, `requests ${s.requests}`);

// 8. Help's popup open: nothing is asked, so Tab means one thing.
await start('<div>\n  |\n</div>', { body: { ok: true, text: '<p>{{ title }}</p>' } });
await page.evaluate(() => document.body.insertAdjacentHTML('beforeend', '<div data-sve-help-popup></div>'));
await page.keyboard.type('<p');
await pause(600);
s = await state();
check('nothing is asked while help mode\'s popup is open', s.requests === 0 && s.ghost === null, `requests ${s.requests}`);
await page.evaluate(() => document.querySelector('[data-sve-help-popup]').remove());

// 9. A blur clears it.
await start('<div>\n  |\n</div>', { body: { ok: true, text: '<p>{{ title }}</p>' } });
await page.keyboard.type('<');
await pause(700);
const shown = (await state()).ghost;
await page.focus('#out');
await pause(50);
s = await state();
check('leaving the editor clears the grey text', shown !== null && s.ghost === null, `shown ${JSON.stringify(shown)} after ${JSON.stringify(s.ghost)}`);

// 11. A comment and Enter: a whole block, "Writing …" while it comes.
const BLOCK = '<article class="card flow-y">\n    <h3 {{ visual_edit field="title" inline_edit="true" }}>{{ title }}</h3>\n  </article>';
await start('<div>\n  {{# card with the title #}}|\n</div>', { body: { ok: true, text: BLOCK }, delay: 400 });
await page.keyboard.press('Enter');
await pause(500);
s = await state();
check('Enter under a comment asks for a block', s.requests === 1 && s.last?.mode === 'comment', `requests ${s.requests} mode ${s.last?.mode}`);
check('"Writing …" stands at the caret while it comes', s.pending === 'code_dock_ghost_writing', JSON.stringify(s.pending));
await page.keyboard.press('Tab');
await pause(20);
s = await state();
check('Tab does nothing to "Writing …"', !s.doc.includes('code_dock_ghost_writing') && !s.doc.includes('<article'), s.doc);
await pause(450);
s = await state();
check('the block stands as grey text, many lines', s.ghost === BLOCK && s.pending === null, JSON.stringify(s.ghost));
await page.keyboard.press('Tab');
await pause(50);
s = await state();
check('Tab writes the block', s.doc === `<div>\n  {{# card with the title #}}\n  ${BLOCK}\n</div>`, s.doc);
check('what was taken is remembered with the line it followed', s.taken.at(-1)?.text === BLOCK.slice(0, 200) && s.taken.at(-1)?.line === '{{# card with the title #}}', JSON.stringify(s.taken.at(-1)));
check('shown and taken are counted', s.counts?.shown >= 1 && s.counts?.taken >= 1, JSON.stringify(s.counts));

// 12. The next question carries what was taken.
await start('<div>\n  |\n</div>', { body: { ok: true, text: '' } });
await page.keyboard.type('<p');
await pause(600);
s = await state();
check('the next request carries the author\'s taken suggestions', Array.isArray(s.last?.taken) && s.last.taken.some((row) => row.text === BLOCK.slice(0, 200)), JSON.stringify(s.last?.taken?.length));

// 13. ⌘K on a selection: the box, the palette held, the rewrite, Esc puts it back.
await start('<div>\n  |<h2>{{ title }}</h2>\n</div>', { body: { ok: true, text: '<h3 class="text-secondary">{{ title }}</h3>' }, delay: 200 });
await page.evaluate(() => {
  const view = window.__view;
  const from = view.state.doc.toString().indexOf('<h2>');

  view.dispatch({ selection: { anchor: from, head: from + '<h2>{{ title }}</h2>'.length } });
});
s = await state();
check('Statamic\'s ⌘K palette is held back while the editor has the focus', s.palette.length === 1 && s.palette[0] === true, JSON.stringify(s.palette));
await page.keyboard.down(MOD);
await page.keyboard.press('k');
await page.keyboard.up(MOD);
await pause(100);
s = await state();
check('⌘K opens the box', s.box);
check('… and the palette stays held while the box has the focus', s.palette[0] === true);
await page.keyboard.type('make it an h3 in the secondary colour');
await page.keyboard.press('Enter');
await pause(50);
s = await state();
check('Enter sends the instruction with the selection', s.lastUrl === '/!/sve/dock-ghost/edit' && s.last?.instruction === 'make it an h3 in the secondary colour' && s.last?.selection === '<h2>{{ title }}</h2>', JSON.stringify(s.last));
await pause(300);
s = await state();
check('the answer replaces the selection and is selected', s.doc === '<div>\n  <h3 class="text-secondary">{{ title }}</h3>\n</div>' && s.selection === '<h3 class="text-secondary">{{ title }}</h3>', s.doc);
await page.keyboard.press('Escape');
await pause(50);
s = await state();
check('Esc puts back what stood there and closes the box', s.doc === '<div>\n  <h2>{{ title }}</h2>\n</div>' && !s.box, s.doc);

// 14. ⌘K again, Enter keeps it — counted, remembered.
await page.evaluate(() => {
  const view = window.__view;
  const from = view.state.doc.toString().indexOf('<h2>');

  view.focus();
  view.dispatch({ selection: { anchor: from, head: from + '<h2>{{ title }}</h2>'.length } });
});
await page.keyboard.down(MOD);
await page.keyboard.press('k');
await page.keyboard.up(MOD);
await pause(100);
await page.keyboard.type('h3');
await page.keyboard.press('Enter');
await pause(400);
await page.keyboard.press('Enter');
await pause(50);
s = await state();
check('Enter keeps the rewrite and closes the box', s.doc === '<div>\n  <h3 class="text-secondary">{{ title }}</h3>\n</div>' && !s.box, s.doc);
check('… counted as asked and kept', s.counts?.edits === 2 && s.counts?.kept === 1, JSON.stringify(s.counts));
check('… and remembered as the author\'s way', s.taken.at(-1)?.line === '⌘K h3', JSON.stringify(s.taken.at(-1)));

// 15. Out of the editor, Statamic's ⌘K is Statamic's again.
await page.focus('#out');
await pause(50);
s = await state();
check('away from the editor the palette opens as always', s.palette[0] === false, JSON.stringify(s.palette));

// Last, because it stops this editor asking: no key: said once, then no more asking.
await start('<div>\n  |\n</div>', { status: 422, body: { message: 'Grey text needs an Anthropic API key' } });
await page.keyboard.type('<p');
await pause(600);
await page.keyboard.type('>');
await pause(600);
s = await state();
check('a 422 is said once', s.toasts.length === 1 && s.toasts[0].includes('Anthropic'), JSON.stringify(s.toasts));
check('… and the editor stops asking', s.requests === 1, `requests ${s.requests}`);

await browser.close();
server.close();

let failed = 0;

for (const row of results) {
  failed += row.ok ? 0 : 1;
  console.log(`${row.ok ? '✓' : '✗'} ${row.name}${row.ok || !row.detail ? '' : `  — ${row.detail}`}`);
}

console.log(`\n${results.length - failed}/${results.length} green`);
process.exit(failed ? 1 : 0);
