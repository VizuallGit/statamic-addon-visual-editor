// Instant-paint harness without the Control Panel: the real dock-instant-preview.js,
// a stubbed Statamic, a fake dock and a preview iframe holding a section as the
// server renders it. Each scenario edits the template the way the dock would and
// reports what the live section looks like the same frame, plus the trace.
// Seconds, no login — run this before the expensive Live Preview test.
// `node tests/browser/instant-harness.mjs` (SVE_SITE_DIR for another site checkout).

import { createRequire } from 'node:module';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const SITE = process.env.SVE_SITE_DIR || '/Users/flemmingmeyer/Sites/vizuall-skabelon';
const ADDON = new URL('../..', import.meta.url).pathname.replace(/\/$/, '');
const DIR = new URL('.', import.meta.url).pathname;
const puppeteer = createRequire(`${SITE}/package.json`)('puppeteer');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const TEMPLATE = readFileSync(`${SITE}/resources/views/partials/page_sections/other_section/employees_list_2.antlers.html`, 'utf8');

const page = readFileSync(`${DIR}/instant-harness.html`, 'utf8').replace('SCRIPT_SRC', `file://${ADDON}/resources/js/dock-instant-preview.js`);
writeFileSync(`${DIR}/instant-harness.out.html`, page);

const card = (name, job) => `<li class="group"><div class="mb-200 rounded-md overflow-clip "><img src="/x.jpg" class="w-full"></div><div class="space-y-100"><h3 data-sid="${name}-h" data-sid-inline-edit="true" class="text-300">${name}</h3><p>${job}</p></div><div class="text-xs flex flex-col mt-100"><a href="mailto:a@b.c">a@b.c</a><a href="tel:1">1</a></div></li>`;

const LIVE = `<!doctype html><html><head></head><body><main>
<section id="id-mu2jmum7lqpp" class="wrapper" data-sid="mu2jmum73uge-mu2jmum7z6th" data-sid-section-orderable="true" data-sid-outline-inside="true">
  <h2 class="mb-5">Kontakt os</h2>
  <div class="bg-gray-200">
    <p class="text-400">dfsfdsfsd</p>
    <p>fdsfdsfsdfs</p>
    <p>fdsfsd</p>
    <p>ffsfdsffdsfsd</p>
  </div>
  <ul class="grid gap-500 grid-cols-4 max-lg:grid-cols-3 max-md:grid-cols-1">
${card('Anna', 'Chef')}${card('Bo', 'Udvikler')}${card('Cai', 'Design')}
</ul>

  <div class="bg-primary-100 text-350">
    <h2 class="text-650">hfghj</h2></div>
</section>
</main></body></html>`;

const ROW = { id: 'mu2jmum7lqpp', _visual_id: 'mu2jmum73uge-mu2jmum7z6th', enabled: true, type: 'other_section/employees_list_2', headline: 'Kontakt os', props_headline: 'agdfgfdag' };

const scenarios = [
  ['A: nyt <p> sidst i bg-gray-200', TEMPLATE.replace('<p>ffsfdsffdsfsd</p>', '<p>ffsfdsffdsfsd</p>\n    <p>NYT AFSNIT</p>')],
  ['B: wrapper om h2', TEMPLATE.replace('<h2 class="mb-5" >{{ headline }}</h2>', '<div class="wrap"><h2 class="mb-5" >{{ headline }}</h2></div>')],
  ['C: h2 → h3', TEMPLATE.replace('<h2 class="mb-5" >{{ headline }}</h2>', '<h3 class="mb-5" >{{ headline }}</h3>')],
  ['D: nyt <p> mellem </ul> og sidste div', TEMPLATE.replace('</ul>\n', '</ul>\n<p>EFTER LISTEN</p>\n')],
  ['E1: skriver "<p" (ufærdigt) i bg-gray-200', TEMPLATE.replace('<p>ffsfdsffdsfsd</p>', '<p>ffsfdsffdsfsd</p>\n    <p')],
  ['E2: skriver "<p>Ny" (ulukket)', TEMPLATE.replace('<p>ffsfdsffdsfsd</p>', '<p>ffsfdsffdsfsd</p>\n    <p>Ny')],
  ['F: nyt <div><p> i bunden af sektionen', TEMPLATE.replace('<h2 class="text-650">hfghj</h2></div>', '<h2 class="text-650">hfghj</h2></div>\n  <div class="ekstra"><p>Bund</p></div>')],
  ['G: klasse på bg-gray-200 (kontrol)', TEMPLATE.replace('<div class="bg-gray-200">', '<div class="bg-gray-200 p-500">')],
  ['H: nyt <p> MIDT i bg-gray-200', TEMPLATE.replace('<p>fdsfdsfsdfs</p>', '<p>fdsfdsfsdfs</p>\n    <p>MIDT</p>')],
  ['I: wrapper om bg-gray-200', TEMPLATE.replace('<div class="bg-gray-200">', '<div class="ydre"><div class="bg-gray-200">').replace('<p>ffsfdsffdsfsd</p>\n  </div>', '<p>ffsfdsffdsfsd</p>\n  </div></div>')],
  ['J: 2. <p> slettet', TEMPLATE.replace('    <p>fdsfdsfsdfs</p>\n', '')],
  ['K: uafsluttet citationstegn i class', TEMPLATE.replace('<p>fdsfsd</p>', '<p class="bg->fdsfsd</p>')],
  ['L: uændret skabelon', TEMPLATE],
];
console.log('midTag på selve skabelonen:', /<\/?[a-zA-Z][^<>"']*(?:"[^"]*"[^<>"']*|'[^']*'[^<>"']*)*(?:<|$|"[^"]*(?:<|$)|'[^']*(?:<|$))/.test(TEMPLATE));

const browser = await puppeteer.launch({ headless: true, executablePath: existsSync(CHROME) ? CHROME : undefined, args: ['--allow-file-access-from-files'] });
const tab = await browser.newPage();
tab.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') console.log('  console:', m.text().slice(0, 200)); });
tab.on('pageerror', (e) => console.log('  pageerror:', String(e).slice(0, 200)));
await tab.goto(`file://${DIR}/instant-harness.out.html`);

const compact = (s) => s.replace(/\s+/g, ' ').replace(/> </g, '><').trim();

async function run(label, text) {
  const result = await tab.evaluate(async (live, row, tpl, next) => {
    const iframe = document.getElementById('live-preview-iframe');
    iframe.srcdoc = live;
    await new Promise((r) => iframe.addEventListener('load', r, { once: true }));
    window.__emit('publish-container-created', { name: 'entry', values: { page_sections: [row] } });
    window.__sveInstantTrace = [];

    // First paint: the template as the file has it (nothing should change).
    window.__paneHtml = tpl;
    document.getElementById('__sve-code-dock').dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise((r) => setTimeout(r, 80));
    const before = iframe.contentDocument.querySelector('section').outerHTML;
    const traceBefore = window.__sveInstantTrace.slice();

    // The edit.
    window.__sveInstantTrace = [];
    window.__paneHtml = next;
    const t0 = performance.now();
    document.getElementById('__sve-code-dock').dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise((r) => setTimeout(r, 80));
    const after = iframe.contentDocument.querySelector('section').outerHTML;

    return { before, after, traceBefore, trace: window.__sveInstantTrace.slice(), live: iframe.contentDocument.querySelector('main').innerHTML };
  }, LIVE, ROW, TEMPLATE, text);

  const same = compact(result.before) === compact(result.after);
  console.log(`\n=== ${label} ===`);
  console.log('  paint før redigering ændrede sektionen:', compact(result.before) !== compact(LIVE.match(/<section[\s\S]*<\/section>/)[0]) ? 'JA (uventet)' : 'nej');
  console.log('  redigeringen malede:', same ? 'NEJ – sektionen er uændret' : 'JA');
  console.log('  trace:', result.trace.map((t) => String(t).slice(0, 110)).join(' | ') || '(tom)');
  const ps = (h) => (h.match(/<div class="bg-gray-200[^"]*">([\s\S]*?)<\/div>/) || ['',''])[1].replace(/<[^>]+>/g, '|').replace(/\s+/g, '').replace(/\|+/g, '|');
  console.log('  p-tekster i bg-gray-200:', ps(result.after), ' (original:', ps(LIVE) + ')');
  console.log('  ul med 3 kort intakt:', /<ul[^>]*>(?:\s*<li class="group">[\s\S]*?<\/li>\s*){3}<\/ul>/.test(result.after) ? 'ja' : 'NEJ');
  if (!same) console.log('  efter:', compact(result.after).slice(0, 420));
  return { label, same, trace: result.trace, after: result.after };
}

const out = [];
for (const [label, text] of scenarios) out.push(await run(label, text));
await browser.close();
console.log('\nOPSUMMERING: ' + out.map((r) => `${r.label.split(':')[0]}=${r.same ? 'VENTER' : 'malet'}`).join(', '));
