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
// the asking.
//
// What it does not: the dock, the pane's toolbar, the real endpoint — that is
// the Live Preview proof. Seconds, no login.
// `node tests/browser/ghost-harness.mjs` (SVE_SITE_DIR for another site checkout).

import { createRequire } from 'node:module';
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
window.__answer = { status: 200, body: { ok: true, text: '' }, delay: 0 };
window.Statamic = { $toast: { error: (message) => window.__toasts.push(message) }, $config: { get: () => null } };
window.fetch = (url, opts) => {
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
      if (!args.importer.endsWith('/dock/ghost-editor.js') || !STUBS[args.path]) {
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

const browser = await puppeteer.launch({ headless: true, executablePath: CHROME });
const page = await browser.newPage();
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const results = [];

page.on('pageerror', (err) => results.push({ name: `page error: ${err.message}`, ok: false }));

await page.setContent(html);

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

// 10. No key: said once, then no more asking.
await start('<div>\n  |\n</div>', { status: 422, body: { message: 'Grey text needs an Anthropic API key' } });
await page.keyboard.type('<p');
await pause(600);
await page.keyboard.type('>');
await pause(600);
s = await state();
check('a 422 is said once', s.toasts.length === 1 && s.toasts[0].includes('Anthropic'), JSON.stringify(s.toasts));
check('… and the editor stops asking', s.requests === 1, `requests ${s.requests}`);

await browser.close();

let failed = 0;

for (const row of results) {
  failed += row.ok ? 0 : 1;
  console.log(`${row.ok ? '✓' : '✗'} ${row.name}${row.ok || !row.detail ? '' : `  — ${row.detail}`}`);
}

console.log(`\n${results.length - failed}/${results.length} green`);
process.exit(failed ? 1 : 0);
