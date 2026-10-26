// The HTML pane's Antlers list in a real CodeMirror, without the Control
// Panel: dock/antlers-complete.js bundled with esbuild, its dock neighbours
// replaced by small stand-ins (the site has the collections Employees, Pages
// and Cases; inside `{{ collection from="employees" }}` the rows are an
// employee's), then typed into with the keyboard in headless Chrome.
//
// What it shows: `{{ coll` lists the site's collections and Enter writes the
// loop with the caret inside; `{{ na` in that loop offers `name`, `{{ ima`
// offers `profile_image`, and Enter writes the name without doubling `}}`;
// outside a loop the section's own fields are offered.
//
// `node tests/browser/antlers-complete-harness.mjs` (SVE_SITE_DIR for another site checkout).

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

/** antlers-complete.js's neighbours in the dock, as little as it asks of them. */
const STUBS = {
  './state.js': 'export const dockState = { htmlScopeActive: false, htmlFocus: null };',
  './data-vars.js': `
export function sectionDataRows() {
  return Promise.resolve([{ var: 'title', label: 'Title', type: 'text' }, { var: 'intro', label: 'Intro', type: 'textarea' }]);
}
export function scopeDataRows(win, at) {
  const html = window.__view.state.doc.toString();
  const open = html.lastIndexOf('{{ collection from="employees" }}', at);
  const close = html.indexOf('{{ /collection }}', at);
  return Promise.resolve(open !== -1 && close !== -1
    ? [{ var: 'name', label: 'Name', type: 'text' }, { var: 'profile_image', label: 'Profile image', type: 'assets' }, { var: 'position', label: 'Position', type: 'text' }]
    : []);
}`,
};

const MAIN = `import { EditorView, keymap } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { html, htmlLanguage } from '@codemirror/lang-html';
import { autocompletion, completionKeymap } from '@codemirror/autocomplete';
import { defaultKeymap } from '@codemirror/commands';
import { antlersCompletions } from '${ADDON}/resources/js/dock/antlers-complete.js';

window.Statamic = { $config: { get: (key) => (key === 'sveCollections' ? [{ handle: 'employees', title: 'Employees' }, { handle: 'pages', title: 'Pages' }, { handle: 'cases', title: 'Cases' }] : null) } };

window.__view = new EditorView({
  state: EditorState.create({
    doc: '',
    extensions: [html(), autocompletion(), htmlLanguage.data.of({ autocomplete: antlersCompletions(window) }), keymap.of([...completionKeymap, ...defaultKeymap])],
  }),
  parent: document.getElementById('editor'),
});
`;

const dir = mkdtempSync(join(tmpdir(), 'sve-antlers-'));

for (const [name, source] of Object.entries(STUBS)) {
  writeFileSync(join(dir, name.replace(/^\.\//, '')), source);
}

writeFileSync(join(dir, 'main.js'), MAIN);

const bundle = await build({
  entryPoints: [join(dir, 'main.js')],
  bundle: true,
  format: 'iife',
  write: false,
  nodePaths: [join(ADDON, 'node_modules')],
  plugins: [
    {
      name: 'dock-stubs',
      setup(b) {
        b.onResolve({ filter: /^\.\// }, (args) => (/\/dock\/antlers-complete\.js$/.test(args.importer) && STUBS[args.path] ? { path: join(dir, args.path.slice(2)) } : undefined));
      },
    },
  ],
  logLevel: 'silent',
});

rmSync(dir, { recursive: true, force: true });

const page = `<!doctype html><html><body><div id="editor"></div><script>${bundle.outputFiles[0].text}</script></body></html>`;
const server = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(page);
}).listen(0, '127.0.0.1');

await new Promise((resolve) => server.once('listening', resolve));

const browser = await puppeteer.launch({ headless: true, executablePath: CHROME });
const tab = await browser.newPage();
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const results = [];
const check = (name, ok, detail = '') => results.push({ name, ok: !!ok, detail });

tab.on('pageerror', (err) => results.push({ name: `page error: ${err.message}`, ok: false }));
await tab.goto(`http://127.0.0.1:${server.address().port}/`);

async function start(source) {
  await tab.evaluate(
    (doc, caret) => {
      window.__view.dispatch({ changes: { from: 0, to: window.__view.state.doc.length, insert: doc }, selection: { anchor: caret } });
      window.__view.focus();
    },
    source.replace('|', ''),
    source.indexOf('|'),
  );
  await pause(50);
}

const state = () =>
  tab.evaluate(() => ({
    doc: window.__view.state.doc.toString(),
    options: [...document.querySelectorAll('.cm-tooltip-autocomplete li')].map((li) => li.textContent),
    caret: window.__view.state.selection.main.head,
  }));

// 1. {{ coll in a <ul>: the site's collections; Enter writes the loop.
await start('<ul>\n  |\n</ul>');
await tab.keyboard.type('{{ coll');
await pause(300);
let s = await state();
check('{{ coll lists the site\'s collections, in the site\'s order', ['employees', 'pages', 'cases'].every((handle, i) => (s.options[i] || '').includes(`collection from="${handle}"`)), JSON.stringify(s.options));

await tab.keyboard.type('ection:emp');
await pause(300);
s = await state();
check('{{ collection:emp narrows it to employees', s.options.length === 1 && s.options[0].includes('collection from="employees"'), JSON.stringify(s.options));
await tab.keyboard.press('Enter');
await pause(100);
s = await state();
check('Enter writes the loop for employees', s.doc === '<ul>\n  {{ collection from="employees" }}\n    \n  {{ /collection }}\n</ul>', JSON.stringify(s.doc));
check('… with the caret on the item line', s.caret === '<ul>\n  {{ collection from="employees" }}\n    '.length, `caret ${s.caret}`);

// 2. Inside the loop: {{ na offers the employee's name; Enter writes it and closes the tag.
await tab.keyboard.type('<li>{{ na');
await pause(300);
s = await state();
check('{{ na inside the loop offers name', s.options.some((text) => text.startsWith('name')) && !s.options.some((text) => text.startsWith('title')), JSON.stringify(s.options));
await tab.keyboard.press('Enter');
await pause(100);
s = await state();
check('Enter writes {{ name }}', s.doc.includes('<li>{{ name }}'), JSON.stringify(s.doc));

// 3. {{ ima finds profile_image by its label; a }} already there is not doubled.
await start('<ul>\n  {{ collection from="employees" }}\n    <li>{{ | }}</li>\n  {{ /collection }}\n</ul>');
await tab.keyboard.type('ima');
await pause(300);
s = await state();
check('{{ ima offers profile_image ("Profile image")', s.options.some((text) => text.startsWith('profile_image')), JSON.stringify(s.options));
await tab.keyboard.press('Enter');
await pause(100);
s = await state();
check('… and the }} that was there stays one', s.doc.includes('<li>{{ profile_image }}</li>'), JSON.stringify(s.doc));

// 4. Outside any loop: the section's own fields.
await start('<section>\n  <h2>|</h2>\n</section>');
await tab.keyboard.type('{{ ti');
await pause(300);
s = await state();
check('outside a loop the section\'s own fields are offered', s.options.some((text) => text.startsWith('title')) && !s.options.some((text) => text.startsWith('name')), JSON.stringify(s.options));

// 5. The image component in the loop: "image" typed finds profile_image, the only image field; Enter closes the quote.
await start('<ul>\n  {{ collection from="employees" }}\n    <li>|</li>\n  {{ /collection }}\n</ul>');
await tab.keyboard.type('{{ partial:components/image :imagePath="image');
await pause(300);
s = await state();
check(':imagePath="image in the loop offers profile_image, and no text field', s.options.length === 1 && s.options[0].startsWith('profile_image'), JSON.stringify(s.options));
await tab.keyboard.press('Enter');
await pause(100);
s = await state();
check('… Enter writes :imagePath="profile_image"', s.doc.includes('{{ partial:components/image :imagePath="profile_image"</li>'), JSON.stringify(s.doc));

await browser.close();
server.close();

let failed = 0;

for (const row of results) {
  failed += row.ok ? 0 : 1;
  console.log(`${row.ok ? '✓' : '✗'} ${row.name}${row.ok || !row.detail ? '' : `  — ${row.detail}`}`);
}

console.log(`\n${results.length - failed}/${results.length} green`);
process.exit(failed ? 1 : 0);
