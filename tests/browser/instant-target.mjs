// One target for every file the dock can hold — without the Control Panel.
//
// The real dock-instant-preview.js, the harness page (a stubbed Statamic, a
// fake dock, a preview iframe) and a page that has it all: a header and a
// footer marked `data-sve-chrome`, two page sections of different types (the
// hero is the active one), a <main> around them. The page's form and the
// footer's form are announced the way Statamic announces them. Each scenario
// opens one kind of file in the dock, types, and checks that the paint lands
// in what that file renders — and nowhere else. The footer's rules used to
// be rendered for the active hero; a view's root used to be the active
// section when the tags matched.
//
// `node tests/browser/instant-target.mjs` (SVE_SITE_DIR for another site checkout).

import { createRequire } from 'node:module';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const SITE = process.env.SVE_SITE_DIR || '/Users/flemmingmeyer/Sites/vizuall-skabelon';
const ADDON = new URL('../..', import.meta.url).pathname.replace(/\/$/, '');
const DIR = new URL('.', import.meta.url).pathname;
const puppeteer = createRequire(`${SITE}/package.json`)('puppeteer');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const page = readFileSync(`${DIR}/instant-harness.html`, 'utf8').replace('SCRIPT_SRC', `file://${ADDON}/resources/js/dock-instant-preview.js`);
writeFileSync(`${DIR}/instant-target.out.html`, page);

const ROW_A = { id: 'secA', enabled: true, type: 'hero/style_1', headline: 'Hero A' };
const ROW_B = { id: 'secB', enabled: true, type: 'other_section/employees_list_2', headline: 'Kontakt os' };
const FOOTER_VALUES = { tagline: 'Hej', bg_color: '#123456', blocks: [] };

const HEADER_FILE = `<header class="[ site-head ] wrapper" data-sve-chrome="header" data-sve-chrome-label="Header">
    <div class="inner">
        {{ site_head.blocks }}
            <p {{ visual_edit }}>{{ text }}</p>
        {{ /site_head.blocks }}
    </div>
</header>
`;
const FOOTER_FILE = `{{ site_foot }}
<footer class="[ site-foot ] wrapper" id="id-site-foot" data-sve-chrome="footer" data-sve-chrome-label="Footer">
    <p class="tag">{{ tagline }}</p>
    <p>Copyright</p>
</footer>
{{ /site_foot }}

{{ style_push }}
<style>
#id-site-foot { --color-bg: {{ site_foot.bg_color }}; }
</style>
{{ /style_push }}
`;
const SECTION_FILE = `<section id="id-{{ id }}" class="[ {{ _class }} ]" {{ visual_edit outline_inside="true" section_orderable="true" }}>
    <h2>{{ headline }}</h2>
    <div class="bg-gray-200">
        <p>x</p>
    </div>
</section>
`;
const VIEW_MAIN_FILE = `<main class="site-main">
    {{ page_sections }}
        {{ partial src="partials/page_sections/{type}" }}
    {{ /page_sections }}
</main>
`;
const VIEW_DIV_FILE = `<div class="view-box">
    <p>Tekst</p>
</div>
`;
const VIEW_SECTION_FILE = `<section class="view-section">
    <h2>Hero A</h2>
    <p>Hero text</p>
</section>
`;
const COMPONENT_FILE = `<li class="card"><p>{{ props_text }}</p></li>\n`;

const PATHS = {
  header: 'resources/views/partials/site_head.antlers.html',
  footer: 'resources/views/partials/site_foot.antlers.html',
  section: 'resources/views/partials/page_sections/other_section/employees_list_2.antlers.html',
  view: 'resources/views/services/show.antlers.html',
  component: 'resources/views/partials/components/card.antlers.html',
};

const LIVE = `<!doctype html><html><head></head><body>
<header class="[ site-head ] wrapper" data-sve-chrome="header" data-sve-chrome-label="Header">
    <div class="inner">
        <p data-sid="hb1">Topbar</p>
    </div>
</header>
<main class="site-main">
    <section id="id-secA" class="[ hero-style-1 ]" data-sid="secA" data-sid-active="true" data-sid-section-orderable="true" data-sid-outline-inside="true">
        <h2>Hero A</h2>
        <p>Hero text</p>
    </section>
    <section id="id-secB" class="[ other-section-employees-list-2 ]" data-sid="secB" data-sid-section-orderable="true" data-sid-outline-inside="true">
        <h2>Kontakt os</h2>
        <div class="bg-gray-200">
            <p>x</p>
        </div>
    </section>
    <div class="view-box"><p>Tekst</p></div>
    <div class="view-box"><p>Tekst</p></div>
</main>
<footer class="[ site-foot ] wrapper" id="id-site-foot" data-sve-chrome="footer" data-sve-chrome-label="Footer">
    <p class="tag">Hej</p>
    <p>Copyright</p>
</footer>
</body></html>`;

const PROBE = '<p class="probe">NY</p>';

const scenarios = [
  ['F1: footer-fil — nyt <p> males i footeren, intet andet rører sig', { kind: 'footer', file: FOOTER_FILE, next: FOOTER_FILE.replace('    <p>Copyright</p>\n', `    <p>Copyright</p>\n    ${PROBE}\n`), expect: { footer: ['NY'] }, untouched: ['header', 'secA', 'secB'] }],
  ['F2: footer-fil — {{ tagline }} inde i {{ site_foot }} fyldes fra footerens formular', { kind: 'footer', file: FOOTER_FILE, next: FOOTER_FILE.replace('    <p>Copyright</p>\n', '    <p>Copyright</p>\n    <p class="tag2">{{ tagline }}</p>\n'), expect: { footer: ['class="tag2">Hej<'] }, untouched: ['header', 'secA', 'secB'] }],
  ['F3: footer-fil — CSS-ruden renderes mod footerens værdier, ikke den aktive sektion', { kind: 'footer', file: FOOTER_FILE, next: FOOTER_FILE, css: '#id-site-foot { --color-bg: {{ site_foot.bg_color }}; color: red }\n{{ responsive_css selector="#id-site-foot .tag" only="padding" }}\n  margin: 0;\n{{ /responsive_css }}', expectCss: ['--color-bg: #123456', 'color: red', '#id-site-foot .tag{'], forbidCss: ['#id-secA', '#id-secB', '{{', ''] }],
  ['H1: header-fil — nyt <p> males i headeren', { kind: 'header', file: HEADER_FILE, next: HEADER_FILE.replace('    </div>\n</header>', `    </div>\n    ${PROBE}\n</header>`), expect: { header: ['NY'] }, untouched: ['secA', 'secB', 'footer'] }],
  ['H2: header-fil — CSS-ruden: intet felt kendt → deklaration med tag droppes, resten står', { kind: 'header', file: HEADER_FILE, next: HEADER_FILE, css: '.site-head { color: red; --x: {{ site_head.nothing }} }', expectCss: ['color: red'], forbidCss: ['--x', '{{', '#id-secA'] }],
  ['S1: sektion B-fil mens A er aktiv — #id-{{ id }} i CSS-ruden rammer B, ikke A', { kind: 'section', file: SECTION_FILE, next: SECTION_FILE, css: '#id-{{ id }} { color: red }', expectCss: ['#id-secB'], forbidCss: ['#id-secA', '{{'] }],
  ['S2: sektion B-fil mens A er aktiv — nyt <p> males i B, A røres ikke', { kind: 'section', file: SECTION_FILE, next: SECTION_FILE.replace('        <p>x</p>\n', `        <p>x</p>\n        ${PROBE}\n`), expect: { secB: ['NY'] }, untouched: ['header', 'secA', 'footer'] }],
  ['V1: skabelonfil med rod <main> (den eneste) — nyt <p> males i main', { kind: 'view', file: VIEW_MAIN_FILE, next: VIEW_MAIN_FILE.replace('</main>', `    ${PROBE}\n</main>`), expect: { main: ['NY'] }, untouched: ['header', 'secA', 'secB', 'footer'] }],
  ['V2: skabelonfil med rod <div> og to kandidater — intet males, morphen er alt', { kind: 'view', file: VIEW_DIV_FILE, next: VIEW_DIV_FILE.replace('<p>Tekst</p>', `<p>Tekst</p>\n    ${PROBE}`), untouched: ['header', 'secA', 'secB', 'footer', 'main'], expectTrace: /more than one <div>/ }],
  ['V3: skabelonfil med rod <section> mens A (samme tag) er aktiv — A røres ikke', { kind: 'view', file: VIEW_SECTION_FILE, next: VIEW_SECTION_FILE.replace('<p>Hero text</p>', `<p>Hero text</p>\n    ${PROBE}`), untouched: ['header', 'secA', 'secB', 'footer', 'main'] }],
  ['C1: komponentfil uden instanser på siden — intet males', { kind: 'component', file: COMPONENT_FILE, next: COMPONENT_FILE.replace('</li>', `${PROBE}</li>`), untouched: ['header', 'secA', 'secB', 'footer', 'main'], expectTrace: /nothing on the page renders/ }],
];

const browser = await puppeteer.launch({ headless: true, executablePath: existsSync(CHROME) ? CHROME : undefined, args: ['--allow-file-access-from-files'] });
const tab = await browser.newPage();
tab.on('console', (m) => { if ((m.type() === 'error' || m.type() === 'warning') && !/ERR_FILE_NOT_FOUND/.test(m.text())) console.log('  console:', m.text().slice(0, 200)); });
tab.on('pageerror', (e) => console.log('  pageerror:', String(e).slice(0, 200)));

const compact = (s) => s.replace(/\s+/g, ' ').replace(/> </g, '><').trim();
const PARTS = { header: 'header', secA: '#id-secA', secB: '#id-secB', footer: 'footer', main: 'main' };

async function run(label, opts) {
  await tab.goto(`file://${DIR}/instant-target.out.html`);
  const result = await tab.evaluate(async (live, rows, footerValues, opts, path, parts) => {
    const dock = document.getElementById('__sve-code-dock');
    try { localStorage.setItem('sveInstantPreview', 'astro'); } catch { /* file:// without storage: astro is the default */ }
    // The site's chrome config, as the CP hands it to the script.
    const get = window.Statamic.$config.get;
    window.Statamic.$config.get = (k) => (k === 'sveChrome' ? { global: 'site_head', header: { global: 'site_head' }, footer: { global: 'site_foot' } } : get(k));
    dock.querySelector('[data-sve-code-path]').textContent = path;
    dock.removeAttribute('data-sve-html-scoped');
    dock.__sveHtmlScope = null;
    window.__paneCss = '';
    const iframe = document.getElementById('live-preview-iframe');
    iframe.srcdoc = live;
    await new Promise((r) => iframe.addEventListener('load', r, { once: true }));
    const idoc = iframe.contentDocument;
    const snap = () => Object.fromEntries(Object.entries(parts).map(([k, sel]) => [k, idoc.querySelector(sel)?.outerHTML ?? '']));

    window.__emit('publish-container-created', { name: 'base', values: { page_sections: rows } });
    window.__emit('publish-container-created', { name: 'sve-chrome', values: footerValues });

    const baseline = snap();
    window.__sveInstantTrace = [];
    window.__paneHtml = opts.file;
    dock.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise((r) => setTimeout(r, 80));
    const before = snap();

    window.__sveInstantTrace = [];
    window.__paneHtml = opts.next;
    if (opts.css != null) window.__paneCss = opts.css;
    dock.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise((r) => setTimeout(r, 80));
    const after = snap();
    const liveCss = idoc.getElementById('__sve-dock-css-live')?.textContent ?? '';

    return { baseline, before, after, liveCss, trace: window.__sveInstantTrace.slice() };
  }, LIVE, [ROW_A, ROW_B], FOOTER_VALUES, { file: opts.file, next: opts.next, css: opts.css ?? null }, PATHS[opts.kind], PARTS);

  const problems = [];
  for (const k of Object.keys(PARTS)) {
    if (compact(result.before[k]) !== compact(result.baseline[k])) problems.push(`den uændrede fil rørte ${k}`);
  }
  for (const k of opts.untouched || []) {
    if (compact(result.after[k]) !== compact(result.before[k])) problems.push(`${k} ændrede sig: ${compact(result.after[k]).slice(0, 160)}`);
  }
  for (const [k, needles] of Object.entries(opts.expect || {})) {
    for (const n of needles) if (!result.after[k].includes(n)) problems.push(`${k} mangler "${n}": ${compact(result.after[k]).slice(0, 200)}`);
  }
  for (const n of opts.expectCss || []) if (!result.liveCss.includes(n)) problems.push(`arket mangler "${n}"`);
  for (const n of opts.forbidCss || []) if (result.liveCss.includes(n)) problems.push(`arket har "${n}"`);
  if (opts.expectTrace && !result.trace.some((t) => opts.expectTrace.test(t))) problems.push(`sporet siger ikke ${opts.expectTrace}`);

  const ok = problems.length === 0;
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${label}`);
  if (!ok) for (const p of problems) console.log(`      - ${p}`);
  if (opts.css != null) console.log(`      ark: ${result.liveCss.replace(/\s+/g, ' ').slice(0, 160)}`);
  console.log(`      trace: ${result.trace.map((t) => String(t).replace(/^\d+ /, '').slice(0, 110)).join(' | ') || '(tom)'}`);
  return ok;
}

let okCount = 0;
for (const [label, opts] of scenarios) if (await run(label, opts)) okCount += 1;
await browser.close();
console.log(`\n${okCount}/${scenarios.length} ok`);
process.exit(okCount === scenarios.length ? 0 : 1);
