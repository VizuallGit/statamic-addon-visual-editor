// A condition's class literals — `{{ highlighted ?= 'btn …' }}` in the header's
// nav loop, `{{ a ? 'x' : 'y' }}`, `{{ if … }}x{{ else }}y{{ /if }}` inside a
// class attribute — painted the same frame, without the Control Panel.
//
// The harness page (stubbed Statamic, fake dock, preview iframe), the demo's
// header as the server renders it (four links, Kontakt highlighted), and a
// section whose values decide the condition. Each scenario runs its pane
// states in order, some with a morph between (the server's render of an
// OLDER state put back, as the real morph does a few keystrokes late), and
// checks what the live markup shows after every state.
//
// `node tests/browser/instant-branches.mjs` (SVE_SCRIPT for another script).

import { createRequire } from 'node:module';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const SITE = process.env.SVE_SITE_DIR || '/Users/flemmingmeyer/Sites/vizuall-skabelon';
const ADDON = new URL('../..', import.meta.url).pathname.replace(/\/$/, '');
const DIR = new URL('.', import.meta.url).pathname;
const puppeteer = createRequire(`${SITE}/package.json`)('puppeteer');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const SCRIPT = process.env.SVE_SCRIPT || `${ADDON}/resources/js/dock-instant-preview.js`;
const page = readFileSync(`${DIR}/instant-harness.html`, 'utf8').replace('SCRIPT_SRC', `file://${SCRIPT}`);
writeFileSync(`${DIR}/instant-branches.out.html`, page);
const FAKE_TW = `file://${DIR}/fixtures/fake-tailwind.mjs`;

// ---- The header (chrome) --------------------------------------------------

const HEADER_PATH = 'resources/views/partials/site_head.antlers.html';
const LIT = "btn bg-gray-800 text-gray-50 py-[.8em] px-[1em] text-xs";
const HEADER = `<header x-data="{ mobilMenu: false }" class="wrapper" data-sve-chrome="header" data-sve-chrome-label="Header">
  <div class="flex items-center py-400 border-b border-gray-900/15 gap-x-500">
    <a aria-label="Gå til {{ site_settings.site_name }} forside" href="/">
      {{ svg src="logo" class="h-500 w-auto" }}
    </a>
    <nav class="ml-auto" aria-label="Primary navigation">
      <menu class="font-bold flex items-center gap-x-[1.5em]">
        {{ nav:main_navigation }}
          <li><a class="{{ highlighted ?= '${LIT}' }}" href="{{ url }}">{{ title }}</a></li>
        {{ /nav:main_navigation }}
      </menu>
    </nav>
    <button @click="mobilMenu = true" aria-label="Åben mobil menu">{{ svg src="menu" class="h-400 w-auto" }}</button>
  </div>
</header>
`;

const ITEMS = [
  { title: 'Kompetancer', url: '/kompetancer', highlighted: false },
  { title: 'Cases', url: '/cases', highlighted: false },
  { title: 'Om os', url: '/om-os', highlighted: false },
  { title: 'Kontakt', url: '/kontakt', highlighted: true },
];

/** The header as the server renders a pane state: the loop expanded, the conditions decided per item, every other tag gone. */
function renderHeader(tpl) {
  const item = (body, it) => body
    .replace(/\{\{\s*if highlighted\s*\}\}([\s\S]*?)(?:\{\{\s*else\s*\}\}([\s\S]*?))?\{\{\s*\/if\s*\}\}/g, (m, a, b) => (it.highlighted ? a : b || ''))
    .replace(/\{\{\s*highlighted\s*\?=\s*'([^']*)'\s*\}\}/g, (m, a) => (it.highlighted ? a : ''))
    .replace(/\{\{\s*highlighted\s*\?\s*'([^']*)'\s*:\s*'([^']*)'\s*\}\}/g, (m, a, b) => (it.highlighted ? a : b))
    .replace(/\{\{\s*title\s*\}\}/g, it.title)
    .replace(/\{\{\s*url\s*\}\}/g, it.url);
  return tpl
    .replace(/\{\{\s*nav:main_navigation\s*\}\}([\s\S]*?)\{\{\s*\/nav:main_navigation\s*\}\}/, (m, body) => ITEMS.map((it) => item(body, it)).join(''))
    .replace(/\{\{\s*svg[^}]*class="([^"]*)"[^}]*\}\}/g, '<svg class="$1" viewBox="0 0 1 1"></svg>')
    .replace(/\{\{\s*site_settings\.site_name\s*\}\}/g, 'Vizuall')
    .replace(/\{\{[\s\S]*?\}\}/g, '');
}

const headerLive = (tpl) => `<!doctype html><html><head></head><body>${renderHeader(tpl)}<main></main></body></html>`;

// ---- A section whose values decide the condition ---------------------------

const SECTION_PATH = 'resources/views/partials/page_sections/banner/style_b.antlers.html';
const ROW = { id: 'secB', enabled: true, type: 'banner/style_b', headline: 'Hej', settings: { sr: true, width: 'full' }, tone: '' };
const SECTION = `<section id="id-{{ id }}" class="[ {{ _class }} ] wrapper" {{ visual_edit outline_inside="true" section_orderable="true" }}>
    <h2 class="title {{ settings.sr ?= 'sr-only' }}">{{ headline }}</h2>
    <div class="box {{ settings.width == 'full' ?= 'w-full' }} {{ tone ?: 'bg-white' }}">x</div>
    <p class="{{ settings.sr ? 'hidden' : 'block' }}">p</p>
</section>
`;
const SECTION_LIVE = `<!doctype html><html><head></head><body><main>
<section id="id-secB" class="[ banner-style-b ] wrapper" data-sid="secB" data-sid-active="true" data-sid-section-orderable="true" data-sid-outline-inside="true">
    <h2 class="title sr-only">Hej</h2>
    <div class="box w-full bg-white">x</div>
    <p class="hidden">p</p>
</section>
</main></body></html>`;

// ---- Scenarios --------------------------------------------------------------

const h = (next) => HEADER.replace(LIT, next);
const KONTAKT = 'a[href="/kontakt"]';
const OTHERS = ['a[href="/kompetancer"]', 'a[href="/cases"]', 'a[href="/om-os"]'];
const othersWithout = (cls) => Object.fromEntries(OTHERS.map((s) => [`${s}.${cls}`, false]));

const scenarios = [
  ['B1: header — bg-gray-800 → bg-gray-900 inde i {{ highlighted ?= … }} males på Kontakt alene', {
    chrome: true,
    steps: [{ next: h(LIT.replace('bg-gray-800', 'bg-gray-900')), has: { [`${KONTAKT}.btn.bg-gray-900.text-xs`]: true, [`${KONTAKT}.bg-gray-800`]: false, ...othersWithout('bg-gray-900'), ...othersWithout('btn') } }],
  }],
  ['B2: header — ny klasse i literalen lander kun på Kontakt', {
    chrome: true,
    steps: [{ next: h(LIT + ' sve-b2'), has: { [`${KONTAKT}.btn.sve-b2`]: true, ...othersWithout('sve-b2') } }],
  }],
  ['B3: header — klasse fjernet fra literalen går af Kontakt', {
    chrome: true,
    steps: [{ next: h(LIT.replace(' py-[.8em]', '')), has: { [`${KONTAKT}.btn.px-\\[1em\\]`]: true, [`${KONTAKT}.py-\\[\\.8em\\]`]: false } }],
  }],
  ['B4: header — tegn for tegn: 800 → 80 → 8 → 9 → 90 → 900, hvert trin males', {
    chrome: true,
    steps: ['bg-gray-80', 'bg-gray-8', 'bg-gray-9', 'bg-gray-90', 'bg-gray-900'].map((c) => ({ next: h(LIT.replace('bg-gray-800', c)), has: { [`${KONTAKT}.btn.${c}`]: true, [`${KONTAKT}.bg-gray-800`]: c === 'bg-gray-800', ...othersWithout(c) } })),
  }],
  ['B5: header — morphen lægger et ÆLDRE gem tilbage (bg-gray-8): painten retter det straks til det skrevne', {
    chrome: true,
    steps: [
      { next: h(LIT.replace('bg-gray-800', 'bg-gray-80')), has: { [`${KONTAKT}.bg-gray-80`]: true } },
      { next: h(LIT.replace('bg-gray-800', 'bg-gray-8')), has: { [`${KONTAKT}.bg-gray-8`]: true } },
      { next: h(LIT.replace('bg-gray-800', 'bg-gray-9')), has: { [`${KONTAKT}.bg-gray-9`]: true } },
      { next: h(LIT.replace('bg-gray-800', 'bg-gray-90')), morph: headerLive(h(LIT.replace('bg-gray-800', 'bg-gray-8'))), has: { [`${KONTAKT}.btn.bg-gray-90`]: true, [`${KONTAKT}.bg-gray-8`]: false } },
      { next: h(LIT.replace('bg-gray-800', 'bg-gray-900')), has: { [`${KONTAKT}.btn.bg-gray-900`]: true, [`${KONTAKT}.bg-gray-90`]: false } },
    ],
  }],
  ['B6: header — statisk klasse ved siden af udtrykket rammer alle fire links, Kontakt beholder btn', {
    chrome: true,
    steps: [{ next: HEADER.replace('<a class="{{', '<a class="link sve-b6 {{'), has: { [`${KONTAKT}.btn.sve-b6.link`]: true, ...Object.fromEntries(OTHERS.map((s) => [`${s}.sve-b6.link`, true])), ...othersWithout('btn') } }],
  }],
  ['B7: header — {{ if highlighted }}…{{ else }}…{{ /if }} i class: else-grenen redigeret → de tre andre links', {
    chrome: true,
    file: HEADER.replace(`{{ highlighted ?= '${LIT}' }}`, '{{ if highlighted }}btn solid{{ else }}plain{{ /if }}'),
    steps: [
      { next: HEADER.replace(`{{ highlighted ?= '${LIT}' }}`, '{{ if highlighted }}btn solid{{ else }}plain2{{ /if }}'), has: { ...Object.fromEntries(OTHERS.map((s) => [`${s}.plain2`, true])), ...othersWithout('plain'), [`${KONTAKT}.btn.solid`]: true, [`${KONTAKT}.plain2`]: false } },
      { next: HEADER.replace(`{{ highlighted ?= '${LIT}' }}`, '{{ if highlighted }}btn solid big{{ else }}plain2{{ /if }}'), has: { [`${KONTAKT}.btn.solid.big`]: true, ...othersWithout('big') } },
    ],
  }],
  ['B8: header — {{ highlighted ? \'btn\' : \'link\' }}: begge grene redigeres', {
    chrome: true,
    file: HEADER.replace(`{{ highlighted ?= '${LIT}' }}`, "{{ highlighted ? 'btn' : 'link' }}"),
    steps: [
      { next: HEADER.replace(`{{ highlighted ?= '${LIT}' }}`, "{{ highlighted ? 'btn' : 'link2' }}"), has: { ...Object.fromEntries(OTHERS.map((s) => [`${s}.link2`, true])), [`${KONTAKT}.btn`]: true, [`${KONTAKT}.link2`]: false } },
      { next: HEADER.replace(`{{ highlighted ?= '${LIT}' }}`, "{{ highlighted ? 'btn2' : 'link2' }}"), has: { [`${KONTAKT}.btn2`]: true, [`${KONTAKT}.btn`]: false, ...othersWithout('btn2') } },
    ],
  }],
  ['B9: header — uændret fil rører intet', { chrome: true, steps: [{ next: HEADER, unchanged: true }] }],
  ['B10: header — citationstegnet slettet midt i udtrykket: intet males, intet går i stykker', {
    chrome: true,
    steps: [{ next: HEADER.replace(`?= '${LIT}'`, `?= ${LIT}'`), unchanged: true }],
  }],
  ['B11: header — det levende Tailwind-ark bygges for klassen inde i literalen', {
    chrome: true, tw: true,
    steps: [{ next: h(LIT.replace('bg-gray-800', 'bg-gray-901')), has: { [`${KONTAKT}.bg-gray-901`]: true }, sheetHas: ['.bg-gray-901{'] }],
  }],
  ['S1: sektion — {{ settings.sr ?= \'sr-only\' }} afgjort sand af værdierne: literalen males som statisk klasse', {
    section: true,
    steps: [{ next: SECTION.replace("?= 'sr-only'", "?= 'sr-only2'"), has: { 'h2.title.sr-only2': true, 'h2.sr-only': false } }],
  }],
  ['S2: sektion — {{ settings.width == \'full\' ?= \'w-full\' }} afgjort sand: males', {
    section: true,
    steps: [{ next: SECTION.replace("?= 'w-full'", "?= 'w-full max-w-none'"), has: { 'div.box.w-full.max-w-none.bg-white': true } }],
  }],
  ['S3: sektion — {{ tone ?: \'bg-white\' }} (tomt felt → literalen) afgjort: males', {
    section: true,
    steps: [{ next: SECTION.replace("?: 'bg-white'", "?: 'bg-black'"), has: { 'div.box.bg-black': true, 'div.box.bg-white': false } }],
  }],
  ['S4: sektion — {{ settings.sr ? \'hidden\' : \'block\' }} afgjort sand: den sande gren males, den falske ikke', {
    section: true,
    steps: [
      { next: SECTION.replace("? 'hidden' : 'block'", "? 'hidden2' : 'block'"), has: { 'p.hidden2': true, 'p.hidden': false } },
      { next: SECTION.replace("? 'hidden' : 'block'", "? 'hidden2' : 'block2'"), has: { 'p.hidden2': true, 'p.block2': false } },
    ],
  }],
  ['S5: sektion — afgjort FALSK gren redigeret: elementet rører sig ikke', {
    section: true, row: { ...ROW, settings: { sr: false, width: 'half' } },
    live: SECTION_LIVE.replace('class="title sr-only"', 'class="title"').replace('class="box w-full bg-white"', 'class="box bg-white"').replace('class="hidden"', 'class="block"'),
    steps: [{ next: SECTION.replace("?= 'sr-only'", "?= 'sr-only2'").replace("?= 'w-full'", "?= 'w-full2'"), has: { 'h2.title': true, 'h2.sr-only2': false, 'div.box.bg-white': true, 'div.w-full2': false, 'p.block': true } }],
  }],
];

// ---- Runner -----------------------------------------------------------------

const browser = await puppeteer.launch({ headless: true, executablePath: existsSync(CHROME) ? CHROME : undefined, args: ['--allow-file-access-from-files'] });
const tab = await browser.newPage();
tab.on('console', (m) => { if ((m.type() === 'error' || m.type() === 'warning') && !/ERR_FILE_NOT_FOUND/.test(m.text())) console.log('  console:', m.text().slice(0, 200)); });
tab.on('pageerror', (e) => console.log('  pageerror:', String(e).slice(0, 200)));

const compact = (s) => s.replace(/\s+/g, ' ').replace(/> </g, '><').trim();

async function run(label, opts) {
  const file = opts.file || (opts.section ? SECTION : HEADER);
  const live = opts.live || (opts.section ? SECTION_LIVE : headerLive(file));
  const path = opts.section ? SECTION_PATH : HEADER_PATH;
  const rootSel = opts.section ? 'section' : 'header';
  await tab.evaluateOnNewDocument((url) => { window.__twCompileUrl = url; }, opts.tw ? FAKE_TW : '');
  await tab.goto(`file://${DIR}/instant-branches.out.html`);
  const result = await tab.evaluate(async (live, row, file, steps, path, rootSel) => {
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
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    const root = () => idoc.querySelector(rootSel);
    const baseline = root().outerHTML;
    // First paint: the file as it is (nothing should change) — and the script's memory of it.
    window.__sveInstantTrace = [];
    window.__paneHtml = file;
    dock.dispatchEvent(new Event('input', { bubbles: true }));
    await wait(120);
    const before = root().outerHTML;
    const out = [];
    for (const step of steps) {
      window.__sveInstantTrace = [];
      window.__paneHtml = step.next;
      dock.dispatchEvent(new Event('input', { bubbles: true }));
      await wait(80);
      if (step.morph) {
        // The server's render of an older state comes back, new nodes and all, and the preview says so.
        const doc = new DOMParser().parseFromString(step.morph, 'text/html');
        root().replaceWith(idoc.importNode(doc.querySelector(rootSel), true));
        iframe.contentWindow.dispatchEvent(new Event('statamic:preview-updated'));
        await wait(80);
      }
      const has = Object.fromEntries(Object.keys(step.has || {}).map((sel) => [sel, !!idoc.querySelector(sel)]));
      const sheet = idoc.getElementById('__sve-tw-dock-live')?.textContent ?? '';
      out.push({ after: root().outerHTML, has, sheet, trace: window.__sveInstantTrace.slice() });
    }
    return { baseline, before, steps: out };
  }, live, opts.row || ROW, file, opts.steps, path, rootSel);

  const problems = [];
  if (compact(result.before) !== compact(result.baseline)) problems.push('den uændrede fil rørte markup\'en: ' + compact(result.before).slice(0, 200));
  opts.steps.forEach((step, i) => {
    const got = result.steps[i];
    for (const [sel, want] of Object.entries(step.has || {})) if (got.has[sel] !== want) problems.push(`trin ${i + 1}: ${want ? 'mangler' : 'har'} ${sel}`);
    if (step.unchanged && compact(got.after) !== compact(result.before)) problems.push(`trin ${i + 1}: markup\'en ændrede sig`);
    for (const s of step.sheetHas || []) if (!got.sheet.includes(s)) problems.push(`trin ${i + 1}: det levende TW-ark mangler ${s}`);
  });
  const ok = problems.length === 0;
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${label}`);
  if (!ok) {
    for (const p of problems) console.log(`      - ${p}`);
    const last = result.steps[result.steps.length - 1];
    console.log(`      efter: ${compact(last.after).slice(0, 900)}`);
    console.log(`      trace: ${last.trace.map((t) => String(t).replace(/^\d+ /, '').slice(0, 120)).join(' | ') || '(tom)'}`);
  }
  return ok;
}

let okCount = 0;
for (const [label, opts] of scenarios) if (await run(label, opts)) okCount += 1;
await browser.close();
console.log(`\n${okCount}/${scenarios.length} ok`);
process.exit(okCount === scenarios.length ? 0 : 1);
