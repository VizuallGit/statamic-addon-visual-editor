// Instant-paint harness without the Control Panel: the real dock-instant-preview.js,
// a stubbed Statamic, a fake dock and a preview iframe holding a section as the
// server renders it. Each scenario edits the template the way the dock would and
// reports what the live section looks like the same frame, plus the trace.
// Seconds, no login — run this before the expensive Live Preview test.
// `node tests/browser/instant-harness.mjs` (SVE_SITE_DIR for another site checkout).
//
// The live section is rendered from a copy of the site's employees_list_2
// template in ./fixtures (the site's own file changes under a designer's hands,
// and the harness lost its anchors that way); every edit is anchored on markup
// the fixture is known to keep (the grey box, the <ul>, the closing tags).

import { createRequire } from 'node:module';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const SITE = process.env.SVE_SITE_DIR || '/Users/flemmingmeyer/Sites/vizuall-skabelon';
const ADDON = new URL('../..', import.meta.url).pathname.replace(/\/$/, '');
const DIR = new URL('.', import.meta.url).pathname;
const puppeteer = createRequire(`${SITE}/package.json`)('puppeteer');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const TEMPLATE = readFileSync(`${DIR}/fixtures/employees_list_2.antlers.html`, 'utf8');

const page = readFileSync(`${DIR}/instant-harness.html`, 'utf8').replace('SCRIPT_SRC', `file://${ADDON}/resources/js/dock-instant-preview.js`);
writeFileSync(`${DIR}/instant-harness.out.html`, page);

const ROW = { id: 'mu2jmum7lqpp', _visual_id: 'mu2jmum73uge-mu2jmum7z6th', enabled: true, type: 'other_section/employees_list_2', headline: 'Kontakt os', props_headline: 'agdfgfdag' };

const card = (name, job) => `<li class="group"><div class="mb-200 rounded-md overflow-clip "><img src="/x.jpg" class="w-full"></div><div class="space-y-100"><h3 data-sid="${name}-h" data-sid-inline-edit="true" class="text-300">${name}</h3><p>${job}</p></div><div class="text-xs flex flex-col mt-100"><a href="mailto:a@b.c">a@b.c</a><a href="tel:1">1</a></div></li>`;

/** The section as the server renders it: fields filled, the loop expanded to three cards, the tags gone. */
function render(tpl) {
  return tpl
    .replace(/\{\{#[\s\S]*?#\}\}/g, '')
    .replace(/\{\{\s*id\s*\}\}/g, ROW.id)
    .replace(/\{\{\s*headline\s*\}\}/g, ROW.headline)
    .replace(/\{\{\s*visual_edit[^}]*\}\}/g, `data-sid="${ROW._visual_id}" data-sid-section-orderable="true" data-sid-outline-inside="true"`)
    .replace(/\{\{\s*collection[\s\S]*?\{\{\s*\/collection\s*\}\}/g, card('Anna', 'Chef') + card('Bo', 'Udvikler') + card('Cai', 'Design'))
    .replace(/\{\{[\s\S]*?\}\}/g, '');
}

const LIVE = `<!doctype html><html><head></head><body><main>\n${render(TEMPLATE)}\n</main></body></html>`;
const COMPONENT = readFileSync(`${DIR}/fixtures/employee_card.antlers.html`, 'utf8');
const COMPONENT_PATH = 'resources/views/partials/components/employee_card.antlers.html';
const SECTION_PATH = 'resources/views/partials/page_sections/other_section/employees_list_2.antlers.html';

// Anchors in the template.
const GREY = /(<div class="bg-gray-200">)([\s\S]*?)(\n  <\/div>)/;
const grey = TEMPLATE.match(GREY);
if (!grey) throw new Error('no grey box in the template');
const greyPs = grey[2].match(/<p[^>]*>[^<]*<\/p>/g) || [];
if (greyPs.length < 3) throw new Error('the grey box needs at least three <p>');
const H2 = TEMPLATE.match(/<h2 class="mb-5"[^>]*>\{\{ headline \}\}<\/h2>/);
if (!H2) throw new Error('no headline <h2> in the template');
const SNIPPET = greyPs[0];
const SNIPPET_AT = TEMPLATE.indexOf(SNIPPET);

const inGrey = (fn) => TEMPLATE.replace(GREY, (m, open, body, close) => open + fn(body) + close);

const scenarios = [
  ['A: nyt <p> sidst i den grå boks', inGrey((b) => b + '\n    <p>NYT AFSNIT</p>')],
  ['B: wrapper om h2', TEMPLATE.replace(H2[0], `<div class="wrap">${H2[0]}</div>`)],
  ['C: h2 → h3', TEMPLATE.replace(H2[0], H2[0].replace('<h2', '<h3').replace('</h2>', '</h3>'))],
  ['D: nyt <p> lige efter </ul>', TEMPLATE.replace('</ul>\n', '</ul>\n<p>EFTER LISTEN</p>\n')],
  ['E1: skriver "<p" (ufærdigt) i den grå boks', inGrey((b) => b + '\n    <p')],
  ['E2: skriver "<p>Ny" (ulukket)', inGrey((b) => b + '\n    <p>Ny')],
  ['F: nyt <div><p> i bunden af sektionen', TEMPLATE.replace('\n</section>', '\n  <div class="ekstra"><p>Bund</p></div>\n</section>')],
  ['G: klasse på den grå boks (kontrol)', TEMPLATE.replace('<div class="bg-gray-200">', '<div class="bg-gray-200 p-500">')],
  ['H: nyt <p> MIDT i den grå boks', TEMPLATE.replace(greyPs[1], greyPs[1] + '\n    <p>MIDT</p>')],
  ['I: wrapper om den grå boks', TEMPLATE.replace(GREY, (m, open, body, close) => `<div class="ydre">${open}${body}${close}</div>`)],
  ['J: 2. <p> i den grå boks slettet', TEMPLATE.replace(greyPs[1] + '\n', '')],
  ['K: uafsluttet citationstegn i class', TEMPLATE.replace(greyPs[2], greyPs[2].replace('<p>', '<p class="bg->'))],
  ['L: uændret skabelon', TEMPLATE],
  // The section's own row picked: the pane is scoped to the whole file, and the
  // file the dock exposes IS the pane. Used to be taken for a snippet with no
  // file, and nothing painted — every child waited for the morph.
  ['Q1: sektionens egen række (scope = hele filen) — nyt <p> sidst i den grå boks', { scoped: true, expose: true, at: 0, snippet: TEMPLATE, next: inGrey((b) => b + '\n    <p>NYT AFSNIT</p>') }],
  ['Q2: sektionens egen række (scope = hele filen) — wrapper om h2', { scoped: true, expose: true, at: 0, snippet: TEMPLATE, next: TEMPLATE.replace(H2[0], `<div class="wrap">${H2[0]}</div>`) }],
  ['Q3: sektionens egen række UDEN udstillet fil (ældre dock) — nyt <p>', { scoped: true, expose: false, snippet: TEMPLATE, next: inGrey((b) => b + '\n    <p>NYT AFSNIT</p>') }],
  // Scoped pane: the dock shows one <p>; the section must still paint whole.
  ['M1: scopet rude (docken udstiller filen) — nabo-<p> efter det scopede', { scoped: true, expose: true, snippet: SNIPPET, next: SNIPPET + '\n    <p>NABO</p>' }],
  ['M2: scopet rude UDEN udstillet fil (ældre dock) — nabo-<p>', { scoped: true, expose: false, snippet: SNIPPET, next: SNIPPET + '\n    <p>NABO</p>' }],
  ['M3: scopet rude — klasse på det scopede <p>', { scoped: true, expose: true, snippet: SNIPPET, next: SNIPPET.replace('text-400', 'text-500') }],
  ['M4: scopet rude — <p> omdøbt til <h3>', { scoped: true, expose: true, snippet: SNIPPET, next: SNIPPET.replace('<p ', '<h3 ').replace('</p>', '</h3>') }],
  // Component file open: every card on the page is an instance and must paint.
  ['N1: komponent — nyt <p> efter props_text i alle kort', { component: true, next: COMPONENT.replace('<p>{{ props_text }}</p>', '<p>{{ props_text }}</p>\n    <p>NY I KORTET</p>') }],
  ['N2: komponent — klasse på kortets rod', { component: true, next: COMPONENT.replace('<li class="group">', '<li class="group kort">') }],
  // CSS: whole pane, and a slice while the HTML pane is scoped.
  ['O1: CSS-ruden (hel fil)', { css: '.o1 { color: red }', next: TEMPLATE }],
  ['O2: CSS-ruden mens HTML er scopet (docken udstiller arket)', { scoped: true, expose: true, snippet: SNIPPET, next: SNIPPET, css: '.o2 { color: blue }', cssFull: '.o2 { color: red }\n.rest { margin: 0 }' }],
  // Antlers in the CSS pane: known fields filled in, tagged declarations dropped, bare tags gone.
  ['P1: CSS-ruden med Antlers (custom property, {{ id }}, bare tag)', { next: TEMPLATE, css: '{{ responsive_css }}\n#id-{{ id }} { background: {{ bg_color }}; margin: 0 }\n.blocks { --grid-cols: {{ cols }}; display: grid; color: red }',
    expectCss: ['#id-mu2jmum7lqpp', 'margin: 0', 'display: grid', 'color: red'], forbidCss: ['{{', '--grid-cols', 'background', 'responsive_css', '\uE000'] }],
];

const browser = await puppeteer.launch({ headless: true, executablePath: existsSync(CHROME) ? CHROME : undefined, args: ['--allow-file-access-from-files'] });
const tab = await browser.newPage();
tab.on('console', (m) => { if ((m.type() === 'error' || m.type() === 'warning') && !/ERR_FILE_NOT_FOUND/.test(m.text())) console.log('  console:', m.text().slice(0, 200)); });
tab.on('pageerror', (e) => console.log('  pageerror:', String(e).slice(0, 200)));
await tab.goto(`file://${DIR}/instant-harness.out.html`);

const compact = (s) => s.replace(/\s+/g, ' ').replace(/> </g, '><').trim();

async function run(label, text) {
  // A fresh page per scenario: the script remembers the last file and paint,
  // and one scenario's memory must not become the next one's result.
  await tab.goto(`file://${DIR}/instant-harness.out.html`);
  const opts = typeof text === 'object' ? text : { next: text };
  const file = opts.component ? COMPONENT : TEMPLATE;
  const result = await tab.evaluate(async (live, row, tpl, next, opts, snippetAt, paths) => {
    const dock = document.getElementById('__sve-code-dock');
    dock.querySelector('[data-sve-code-path]').textContent = opts.component ? paths.component : paths.section;
    dock.toggleAttribute('data-sve-html-scoped', !!opts.scoped);
    dock.__sveHtmlScope = opts.scoped && opts.expose
      ? { full: tpl, from: opts.at ?? snippetAt, to: (opts.at ?? snippetAt) + opts.snippet.length, ...(opts.cssFull != null ? { css: opts.cssFull } : {}) }
      : null;
    window.__paneCss = '';
    const iframe = document.getElementById('live-preview-iframe');
    iframe.srcdoc = live;
    await new Promise((r) => iframe.addEventListener('load', r, { once: true }));
    const idoc = iframe.contentDocument;

    if (opts.component) {
      idoc.querySelectorAll('li.group').forEach((el) => el.setAttribute('data-sve-component-focused', ''));
    }

    const baseline = idoc.querySelector('section').outerHTML;
    window.__emit('publish-container-created', { name: 'entry', values: { page_sections: [row] } });
    window.__sveInstantTrace = [];

    // First paint: the file as it is (nothing should change).
    window.__paneHtml = opts.scoped ? opts.snippet : tpl;
    dock.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise((r) => setTimeout(r, 80));
    const before = idoc.querySelector('section').outerHTML;

    // The edit.
    window.__sveInstantTrace = [];
    window.__paneHtml = next;
    if (opts.css != null) window.__paneCss = opts.css;
    dock.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise((r) => setTimeout(r, 80));
    const after = idoc.querySelector('section').outerHTML;
    const liveCss = idoc.getElementById('__sve-dock-css-live')?.textContent ?? '';

    return { baseline, before, after, liveCss, trace: window.__sveInstantTrace.slice() };
  }, LIVE, ROW, file, opts.next, { scoped: !!opts.scoped, expose: !!opts.expose, snippet: opts.snippet ?? null, at: opts.at ?? null, component: !!opts.component, css: opts.css ?? null, cssFull: opts.cssFull ?? null }, SNIPPET_AT, { component: COMPONENT_PATH, section: SECTION_PATH });

  const same = compact(result.before) === compact(result.after) && (opts.css == null || result.liveCss.includes(opts.css) === false);
  const untouched = compact(result.before) === compact(result.baseline);
  if (opts.expectCss) {
    const missing = opts.expectCss.filter((x) => !result.liveCss.includes(x));
    const present = (opts.forbidCss || []).filter((x) => result.liveCss.includes(x));
    console.log(`\n=== ${label} ===\n  mangler i levende ark:`, missing.length ? missing : 'intet', '| forbudt men til stede:', present.length ? present : 'intet');
    console.log('  ark:', result.liveCss.replace(/\s+/g, ' ').slice(0, 200));
    return { label, same: missing.length > 0 || present.length > 0, untouched: true, listOk: true };
  }
  if (opts.css != null) console.log(`\n=== ${label} ===\n  levende CSS-ark indeholder rudens regel:`, result.liveCss.includes(opts.css) ? 'ja' : 'NEJ', opts.cssFull != null ? `| resten af arket med: ${result.liveCss.includes('.rest') ? 'ja' : 'NEJ'}` : '');
  if (opts.component) console.log(`\n=== ${label} ===\n  forekomster i de 3 kort:`, (result.after.match(/NY I KORTET/g) || []).length, 'x tekst,', (result.after.match(/class="group kort"/g) || []).length, 'x klasse');
  if (opts.css != null || opts.component) { console.log('  trace:', result.trace.map((t) => String(t).replace(/^\d+ /, '').slice(0, 90)).join(' | ') || '(tom)'); return { label, same, untouched, listOk: true }; }
  const ps = (h) => (h.match(/<div class="bg-gray-200[^"]*">([\s\S]*?)<\/div>/) || ['', ''])[1].replace(/<[^>]+>/g, '|').replace(/\s+/g, '').replace(/\|+/g, '|');
  const listOk = /<ul[^>]*>(?:\s*<li class="group">[\s\S]*?<\/li>\s*){3}\s*<\/ul>/.test(result.after);
  console.log(`\n=== ${label} ===`);
  console.log('  paint før redigering ændrede sektionen:', untouched ? 'nej' : 'JA (uventet)');
  console.log('  redigeringen malede:', same ? 'NEJ – sektionen er uændret' : 'JA');
  console.log('  trace:', result.trace.map((t) => String(t).replace(/^\d+ /, '').slice(0, 100)).join(' | ') || '(tom)');
  console.log('  p-tekster i den grå boks:', ps(result.after), ' (før:', ps(result.before) + ')');
  console.log('  ul med 3 kort intakt:', listOk ? 'ja' : 'NEJ');
  if (!same) console.log('  efter:', compact(result.after).slice(0, 360));
  return { label, same, untouched, listOk };
}

const out = [];
for (const [label, text] of scenarios) out.push(await run(label, text));
await browser.close();
console.log('\nOPSUMMERING: ' + out.map((r) => `${r.label.split(':')[0]}=${r.same ? 'venter' : 'malet'}${r.untouched ? '' : '!'}${r.listOk ? '' : ' LISTE-TAB'}`).join(', '));
console.log('(! = den uændrede fil rørte sektionen; venter forventes kun for E1, K, L, M2 og O1; P1=venter betyder FEJL)');
