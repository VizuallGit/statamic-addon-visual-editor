// Classes in Antlers call parameters, class attributes with Antlers in them,
// and conditions the values decide — without the Control Panel.
//
// The harness page (stubbed Statamic, fake dock, preview iframe), one section
// file that has all three, and the page as the server renders it for the
// row's values (media set, type 'y'). Each scenario edits the file the way the
// dock would and checks what the live section looks like the same frame.
//
// `node tests/browser/instant-calls.mjs` (SVE_SITE_DIR for another site checkout).

import { createRequire } from 'node:module';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const SITE = process.env.SVE_SITE_DIR || '/Users/flemmingmeyer/Sites/vizuall-skabelon';
const ADDON = new URL('../..', import.meta.url).pathname.replace(/\/$/, '');
const DIR = new URL('.', import.meta.url).pathname;
const puppeteer = createRequire(`${SITE}/package.json`)('puppeteer');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const SCRIPT = process.env.SVE_SCRIPT || `${ADDON}/resources/js/dock-instant-preview.js`;
const page = readFileSync(`${DIR}/instant-harness.html`, 'utf8').replace('SCRIPT_SRC', `file://${SCRIPT}`);
writeFileSync(`${DIR}/instant-calls.out.html`, page);

const ROW = { id: 'secK', enabled: true, type: 'banner/style_k', headline: 'Kom forbi', media: '/assets/map.jpg', type_choice: 'y', settings: { align: 'center', sr: false }, items: [{ t: 'a' }, { t: 'b' }] };
const PATH = 'resources/views/partials/page_sections/banner/style_k.antlers.html';

const FILE = `<section id="id-{{ id }}" class="[ {{ _class }} ] wrapper relative" {{ visual_edit outline_inside="true" section_orderable="true" }}>
    {{ if media }}
        <div class="hero-media absolute inset-0"><img src="{{ media }}" class="w-full"></div>
    {{ /if }}
    {{ if !media }}
        <p class="no-media">Intet billede</p>
    {{ /if }}
    <div class="[ blocks ] {{ _alignment }}">
        {{ svg src="pattern" class="absolute top-0 right-0 opacity-10" }}
        <h2 class="title">{{ headline }}</h2>
        {{ svg src="arrow" class="h-400 w-auto" }}
    </div>
    {{ if type_choice == 'x' }}
        <p class="x">x</p>
    {{ elseif type_choice == 'y' }}
        <p class="y">y</p>
    {{ else }}
        <p class="z">z</p>
    {{ /if }}
    {{ if settings.align == 'center' and !settings.sr }}<p class="centered">c</p>{{ /if }}
    {{ if unknown_field }}
        <p class="unknown">u</p>
    {{ /if }}
    {{ items }}
        {{ if t == 'a' }}<p class="item-a">{{ t }}</p>{{ /if }}
    {{ /items }}
</section>
`;

const LIVE = `<!doctype html><html><head></head><body><main>
<section id="id-secK" class="[ banner-style-k ] wrapper relative" data-sid="secK" data-sid-active="true" data-sid-section-orderable="true" data-sid-outline-inside="true">
        <div class="hero-media absolute inset-0"><img src="/assets/map.jpg" class="w-full"></div>
    <div class="[ blocks ] items-center">
        <svg class="absolute top-0 right-0 opacity-10" viewBox="0 0 10 10"><path d="M0 0h10v10z"/></svg>
        <h2 class="title">Kom forbi</h2>
        <svg class="h-400 w-auto" viewBox="0 0 10 10"><path d="M0 0h10v10z"/></svg>
    </div>
        <p class="y">y</p>
    <p class="centered">c</p>
        <p class="item-a">a</p>
</section>
</main></body></html>`;

const ALPINE_FILE = `<section id="id-{{ id }}" class="[ {{ _class }} ] gallery" x-data="{ open: null, step(d) { var i = this.list.indexOf(this.open); if (i < 0) i = 0; this.open = this.list[i + d] || null; }, label() { return this.open ? '1 / 2' : '' } }" {{ visual_edit section_orderable="true" }}>
    <h2 class="title">{{ headline }}</h2>
    {{ if media }}
        <p class="has-media">m</p>
    {{ endif }}
    <p class="after">efter</p>
</section>
`;
const ALPINE_LIVE = `<!doctype html><html><head></head><body><main>
<section id="id-secK" class="[ banner-style-k ] gallery" x-data="{ open: null }" data-sid="secK" data-sid-active="true" data-sid-section-orderable="true">
    <h2 class="title">Kom forbi</h2>
        <p class="has-media">m</p>
    <p class="after">efter</p>
</section>
</main></body></html>`;

const scenarios = [
  ['K13: et "<" inde i en Alpine x-data standser ikke painten — klasse på roden males', { file: ALPINE_FILE, live: ALPINE_LIVE, next: ALPINE_FILE.replace('class="[ {{ _class }} ] gallery"', 'class="[ {{ _class }} ] gallery sve-k13"'), expect: ['section.gallery.sve-k13'] }],
  ['K14: {{ endif }} lukker blokken — nyt <p> efter den males', { file: ALPINE_FILE, live: ALPINE_LIVE, next: ALPINE_FILE.replace('<p class="after">efter</p>', '<p class="after">efter</p>\n    <p class="probe14">NY</p>'), expect: ['p.probe14', 'p.has-media'] }],

  ['K1: klasse i {{ svg … class }} lander på den svg serveren tegnede', { next: FILE.replace('class="absolute top-0 right-0 opacity-10" }}', 'class="absolute top-0 right-0 opacity-10 sve-k1" }}'), expect: ['svg.absolute.sve-k1'], forbid: ['svg.h-400.sve-k1', '.title.sve-k1'] }],
  ['K2: klasse fjernet fra {{ svg }} går af svg\'en', { next: FILE.replace('class="absolute top-0 right-0 opacity-10" }}', 'class="absolute top-0 right-0" }}'), forbid: ['svg.opacity-10'], expect: ['svg.absolute.top-0'] }],
  ['K3: klasse i det ANDET svg-kald rammer kun det', { next: FILE.replace('class="h-400 w-auto" }}', 'class="h-400 w-auto sve-k3" }}'), expect: ['svg.h-400.sve-k3'], forbid: ['svg.absolute.sve-k3'] }],
  ['K4: klasse på "[ blocks ] {{ _alignment }}" — statiske tokens males, items-center bliver', { next: FILE.replace('class="[ blocks ] {{ _alignment }}"', 'class="[ blocks ] sve-k4 {{ _alignment }}"'), expect: ['.blocks.sve-k4.items-center'] }],
  ['K5: nyt <p> inde i {{ if media }} (sandt) males', { next: FILE.replace('<div class="hero-media absolute inset-0">', '<p class="probe">NY</p><div class="hero-media absolute inset-0">'), expect: ['section > p.probe', '.hero-media'] }],
  ['K6: nyt <p> inde i {{ if !media }} (falsk) males IKKE, intet fjernes', { next: FILE.replace('<p class="no-media">Intet billede</p>', '<p class="no-media">Intet billede</p><p class="probe6">NY</p>'), forbid: ['.probe6', '.no-media'], expect: ['.hero-media', 'p.y'] }],
  ['K7: klasse på <p class="y"> i elseif-grenen males', { next: FILE.replace('<p class="y">y</p>', '<p class="y sve-k7">y</p>'), expect: ['p.y.sve-k7'], forbid: ['p.x', 'p.z'] }],
  ['K8: nyt <p> i den falske if-gren (type_choice == x) males ikke', { next: FILE.replace('<p class="x">x</p>', '<p class="x">x</p><p class="probe8">NY</p>'), forbid: ['.probe8', 'p.x'], expect: ['p.y'] }],
  ['K9: and/not-betingelse (settings.align == center and !settings.sr) → statisk', { next: FILE.replace('<p class="centered">c</p>', '<p class="centered sve-k9">c</p><p class="probe9">NY</p>'), expect: ['p.centered.sve-k9', 'p.probe9'] }],
  ['K10: ukendt felt i {{ if }} er stadig en blok — nyt <p> venter', { next: FILE.replace('<p class="unknown">u</p>', '<p class="unknown">u</p><p class="probe10">NY</p>'), forbid: ['.probe10'] }],
  ['K11: betingelse inde i løkken afgøres ikke — klasse males dog (samme tag)', { next: FILE.replace('<p class="item-a">{{ t }}</p>', '<p class="item-a sve-k11">{{ t }}</p>'), expect: ['p.item-a.sve-k11'] }],
  ['K12: hele filen uændret — intet rører sig', { next: FILE, unchanged: true }],
];

const browser = await puppeteer.launch({ headless: true, executablePath: existsSync(CHROME) ? CHROME : undefined, args: ['--allow-file-access-from-files'] });
const tab = await browser.newPage();
tab.on('console', (m) => { if ((m.type() === 'error' || m.type() === 'warning') && !/ERR_FILE_NOT_FOUND/.test(m.text())) console.log('  console:', m.text().slice(0, 200)); });
tab.on('pageerror', (e) => console.log('  pageerror:', String(e).slice(0, 200)));

const compact = (s) => s.replace(/\s+/g, ' ').replace(/> </g, '><').trim();

async function run(label, opts) {
  await tab.goto(`file://${DIR}/instant-calls.out.html`);
  const result = await tab.evaluate(async (live, row, file, next, path, expect, forbid) => {
    const dock = document.getElementById('__sve-code-dock');
    try { localStorage.setItem('sveInstantPreview', 'astro'); } catch { /* file:// */ }
    dock.querySelector('[data-sve-code-path]').textContent = path;
    dock.removeAttribute('data-sve-html-scoped');
    dock.__sveHtmlScope = null;
    window.__paneCss = '';
    const iframe = document.getElementById('live-preview-iframe');
    iframe.srcdoc = live;
    await new Promise((r) => iframe.addEventListener('load', r, { once: true }));
    const idoc = iframe.contentDocument;
    window.__emit('publish-container-created', { name: 'base', values: { page_sections: [row] } });
    const baseline = idoc.querySelector('section').outerHTML;
    window.__sveInstantTrace = [];
    window.__paneHtml = file;
    dock.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise((r) => setTimeout(r, 80));
    const before = idoc.querySelector('section').outerHTML;
    window.__sveInstantTrace = [];
    window.__paneHtml = next;
    dock.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise((r) => setTimeout(r, 80));
    const after = idoc.querySelector('section').outerHTML;
    const has = (sel) => !!idoc.querySelector(sel);
    return { baseline, before, after, trace: window.__sveInstantTrace.slice(), has: Object.fromEntries([...expect, ...forbid].map((s) => [s, has(s)])) };
  }, opts.live || LIVE, ROW, opts.file || FILE, opts.next, PATH, opts.expect || [], opts.forbid || []);

  const problems = [];
  if (compact(result.before) !== compact(result.baseline)) problems.push('den uændrede fil rørte sektionen: ' + compact(result.before).slice(0, 200));
  for (const sel of opts.expect || []) if (!result.has[sel]) problems.push(`mangler ${sel}`);
  for (const sel of opts.forbid || []) if (result.has[sel]) problems.push(`har ${sel}`);
  if (opts.unchanged && compact(result.after) !== compact(result.before)) problems.push('sektionen ændrede sig');
  const ok = problems.length === 0;
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${label}`);
  if (!ok) { for (const p of problems) console.log(`      - ${p}`); console.log(`      efter: ${compact(result.after).slice(0, 1200)}`); }
  console.log(`      trace: ${result.trace.map((t) => String(t).replace(/^\d+ /, '').slice(0, 110)).join(' | ') || '(tom)'}`);
  return ok;
}

let okCount = 0;
for (const [label, opts] of scenarios) if (await run(label, opts)) okCount += 1;
await browser.close();
console.log(`\n${okCount}/${scenarios.length} ok`);
process.exit(okCount === scenarios.length ? 0 : 1);
