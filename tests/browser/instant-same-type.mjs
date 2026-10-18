// Instant paint on every section of the dock's type, without the Control Panel:
// the real dock-instant-preview.js in instant-harness.html, a page holding the
// same section twice (a copy made on the page) and a section of another type.
// An edit in the dock must reach both copies in the same frame, each with its
// own field text, and leave the other section alone. Cuben, 18 Oct 2026: the
// copy kept the old background until the page was saved.
// `node tests/browser/instant-same-type.mjs` (SVE_SITE_DIR for another site checkout;
// SVE_INSTANT_SCRIPT=<file> runs another copy of the script, e.g. the released one).

import { createRequire } from 'node:module';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const SITE = process.env.SVE_SITE_DIR || '/Users/flemmingmeyer/Sites/vizuall-skabelon';
const ADDON = new URL('../..', import.meta.url).pathname.replace(/\/$/, '');
const DIR = new URL('.', import.meta.url).pathname;
const puppeteer = createRequire(`${SITE}/package.json`)('puppeteer');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const TEMPLATE = readFileSync(`${DIR}/fixtures/two_column_text.antlers.html`, 'utf8');
const TYPE = 'content/two_column_text';
const PATH = `resources/views/partials/page_sections/${TYPE}.antlers.html`;

const page = readFileSync(`${DIR}/instant-harness.html`, 'utf8').replace('SCRIPT_SRC', `file://${process.env.SVE_INSTANT_SCRIPT || `${ADDON}/resources/js/dock-instant-preview.js`}`);
writeFileSync(`${DIR}/instant-harness.out.html`, page);

// A Bard heading is an array in the form (no simple value: its live text stays),
// the text a plain string. The copy is reached by `_visual_id`, as a fresh row is.
const bard = (text) => [{ type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text }] }];
const ROWS = [
  { id: 'row-a', _visual_id: 'vid-a', enabled: true, type: TYPE, section_heading: bard('Overskrift A'), text: 'Tekst A' },
  { id: 'row-b', _visual_id: 'vid-b', enabled: true, type: TYPE, section_heading: bard('Overskrift B'), text: 'Tekst B' },
  { id: 'row-h', _visual_id: 'vid-h', enabled: true, type: 'hero/style_1', headline: 'Helt' },
];

/** A section as the server renders it, carrying `sid` as its data-sid. */
function render(row, sid) {
  return TEMPLATE
    .replace(/\{\{\s*id\s*\}\}/g, row.id)
    .replace(/\{\{\s*section_heading\s*\}\}/g, `<h2>${row.section_heading[0].content[0].text}</h2>`)
    .replace(/\{\{\s*text\s*\}\}/g, `<p>${row.text}</p>`)
    .replace(/\{\{\s*visual_edit[^}]*field="(\w+)"[^}]*\}\}/g, `data-sid="${sid}-$1" data-sid-inline-edit="true"`)
    .replace(/\{\{\s*visual_edit[^}]*\}\}/g, `data-sid="${sid}" data-sid-section-orderable="true" data-sid-outline-inside="true"`);
}

const HERO = `<section id="id-row-h" class="wrapper py-1000 bg-gray-800 text-gray-50 flex flex-wrap gap-x-900 gap-y-400" data-sid="row-h" data-sid-section-orderable="true"><div class="hero"><h1>Helt</h1></div></section>`;
const SAVED_CSS = '#id-{{ id }} { background: red; }';
const savedBlock = (id) => `#id-${id}{background:red;}`;
const LIVE = `<!doctype html><html><head><style data-sve-section="row-a">${savedBlock('row-a')}</style><style data-sve-section="row-b">${savedBlock('row-b')}</style></head><body><main>\n${render(ROWS[0], 'row-a')}\n${HERO}\n${render(ROWS[1], 'vid-b')}\n</main></body></html>`;

const ROOT_CLASS = 'class="wrapper py-1000 bg-gray-800';
const HEADING_DIV = /(<div \{\{ visual_edit inline_edit="true" field="section_heading" \}\}[^>]*>)([\s\S]*?)(<\/div>)/;
if (!TEMPLATE.includes(ROOT_CLASS) || !HEADING_DIV.test(TEMPLATE)) throw new Error('the fixture lost its anchors');

const scenarios = [
  ['T1: baggrund på roden (bg-gray-800 → bg-gray-50) — begge kopier', {
    next: TEMPLATE.replace(ROOT_CLASS, 'class="wrapper py-1000 bg-gray-50'),
    expect: (s) => s.a.includes('bg-gray-50') && s.b.includes('bg-gray-50') && !s.a.includes('bg-gray-800') && !s.b.includes('bg-gray-800'),
  }],
  ['T2: wrapper om overskriften — begge, hver med sin egen tekst', {
    next: TEMPLATE.replace(HEADING_DIV, (m, open, body, close) => `<div class="wrap">${open}${body}${close}</div>`),
    expect: (s) => /<div class="wrap"><div[^>]*>\s*<h2>Overskrift A<\/h2>/.test(s.a) && /<div class="wrap"><div[^>]*>\s*<h2>Overskrift B<\/h2>/.test(s.b),
  }],
  ['T3: nyt statisk <p> sidst — begge', {
    next: TEMPLATE.replace('\n</section>', '\n  <p class="ny">NY</p>\n</section>'),
    expect: (s) => s.a.includes('<p class="ny">NY</p>') && s.b.includes('<p class="ny">NY</p>') && s.a.includes('Tekst A') && s.b.includes('Tekst B'),
  }],
  ['T4: CSS-ruden #id-{{ id }} — en regel pr. kopi, begge gemte blokke skåret ud', {
    next: TEMPLATE,
    css: '#id-{{ id }} { background: blue; }',
    expect: (s) => s.css.includes('#id-row-a { background: blue; }') && s.css.includes('#id-row-b { background: blue; }') && !s.css.includes('row-h') && s.saved.every((t) => t === ''),
  }],
  ['T5: CSS-ruden @scope-regel — én gang i arket', {
    next: TEMPLATE,
    css: '@scope (.{{ _class }}) { :scope { color: red } }',
    expect: (s) => (s.css.match(/@scope/g) || []).length === 1 && s.css.includes('.content-two-column-text'),
  }],
  ['T6: dockens fil er en anden type — intet males', {
    next: TEMPLATE.replace(ROOT_CLASS, 'class="wrapper py-1000 bg-gray-50'),
    path: 'resources/views/partials/page_sections/hero/style_2.antlers.html',
    expect: (s) => s.a === s.a0 && s.b === s.b0 && s.hero === s.hero0,
  }],
];

const browser = await puppeteer.launch({ headless: true, executablePath: existsSync(CHROME) ? CHROME : undefined, args: ['--allow-file-access-from-files'] });
const tab = await browser.newPage();
tab.on('pageerror', (e) => console.log('  pageerror:', String(e).slice(0, 200)));

async function run(label, opts) {
  await tab.goto(`file://${DIR}/instant-harness.out.html`);

  const s = await tab.evaluate(async (live, rows, tpl, opts, path, savedCss) => {
    const dock = document.getElementById('__sve-code-dock');
    try { localStorage.setItem('sveInstantPreview', 'astro'); } catch { /* astro is the default */ }
    dock.querySelector('[data-sve-code-path]').textContent = opts.path || path;
    dock.__sveSavedCss = savedCss;
    window.__paneCss = '';
    const iframe = document.getElementById('live-preview-iframe');
    iframe.srcdoc = live;
    await new Promise((r) => iframe.addEventListener('load', r, { once: true }));
    const idoc = iframe.contentDocument;
    // The copy is the section the editor is on.
    idoc.querySelector('[data-sid="vid-b"]').setAttribute('data-sid-active', '');
    window.__emit('publish-container-created', { name: 'entry', values: { page_sections: rows } });

    const read = () => {
      const secs = idoc.querySelectorAll('main > section');

      return { a: secs[0].outerHTML, hero: secs[1].outerHTML, b: secs[2].outerHTML };
    };

    window.__paneHtml = tpl;
    dock.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise((r) => setTimeout(r, 80));
    const before = read();

    window.__sveInstantTrace = [];
    window.__paneHtml = opts.next;
    if (opts.css != null) window.__paneCss = opts.css;
    dock.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise((r) => setTimeout(r, 80));
    const after = read();

    return {
      ...after,
      a0: before.a,
      b0: before.b,
      hero0: before.hero,
      css: idoc.getElementById('__sve-dock-css-live')?.textContent ?? '',
      saved: Array.from(idoc.querySelectorAll('style[data-sve-section]')).map((el) => el.textContent),
      trace: window.__sveInstantTrace.slice(),
    };
  }, LIVE, ROWS, TEMPLATE, { next: opts.next, css: opts.css ?? null, path: opts.path ?? null }, PATH, SAVED_CSS);

  const ok = opts.expect(s) && s.hero === s.hero0;
  console.log(`\n=== ${label} ===\n  ${ok ? 'OK' : 'FEJL'}`);
  if (!ok) {
    console.log('  a:', s.a.replace(/\s+/g, ' ').slice(0, 300));
    console.log('  b:', s.b.replace(/\s+/g, ' ').slice(0, 300));
    console.log('  helt rørt:', s.hero !== s.hero0, '| ark:', s.css.slice(0, 200), '| gemte:', JSON.stringify(s.saved));
    console.log('  trace:', s.trace.map((t) => String(t).replace(/^\d+ /, '').slice(0, 100)).join(' | '));
  }

  return ok;
}

let failed = 0;
for (const [label, opts] of scenarios) {
  if (!(await run(label, opts))) failed++;
}
await browser.close();
console.log(`\n${scenarios.length - failed}/${scenarios.length} ok`);
process.exit(failed ? 1 : 0);
