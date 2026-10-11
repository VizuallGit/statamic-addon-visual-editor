// How long one keystroke's paint takes in dock-instant-preview.js, measured
// on the paint's own animation frame: a small section (the employees fixture),
// the site's biggest section file, and a synthetic one of about 60 KB with
// 400 paragraphs — the work must not grow with the parts of the file the
// keystroke did not touch. Same harness as instant-harness.mjs, no Control
// Panel; the Tailwind compiler is the fake one (fixtures/fake-tailwind.mjs),
// so the number for a class keystroke is the paint's own, not the compiler's.
//
//   node tests/browser/instant-perf.mjs            (SVE_SITE_DIR for another site checkout)
//   SVE_PERF_BUDGET=8 node tests/browser/instant-perf.mjs   fail when a keystroke's paint is above 8 ms
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const SITE = process.env.SVE_SITE_DIR || '/Users/flemmingmeyer/Sites/vizuall-skabelon';
const ADDON = new URL('../..', import.meta.url).pathname.replace(/\/$/, '');
const DIR = new URL('.', import.meta.url).pathname;
const puppeteer = createRequire(`${SITE}/package.json`)('puppeteer');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const BUDGET = Number(process.env.SVE_PERF_BUDGET || 0);

const page = readFileSync(`${DIR}/instant-harness.html`, 'utf8').replace('SCRIPT_SRC', `file://${ADDON}/resources/js/dock-instant-preview.js`);
const OUT = `${DIR}/instant-harness.out.html`;
writeFileSync(OUT, page);

const ROW = { id: 'mu2jmum7lqpp', _visual_id: 'mu2jmum73uge-mu2jmum7z6th', enabled: true, type: 'other_section/employees_list_2', headline: 'Kontakt os' };
const PATH = 'resources/views/partials/page_sections/other_section/employees_list_2.antlers.html';
const SMALL = readFileSync(`${DIR}/fixtures/employees_list_2.antlers.html`, 'utf8');

/** 400 paragraphs and 40 nested boxes in the grey box: about 60 KB. */
const BIG = SMALL.replace('<div class="bg-gray-200">', '<div class="bg-gray-200">' + Array.from({ length: 400 }, (_, i) => `\n    <p class="text-400 leading-relaxed mb-200 opacity-90">Afsnit nummer ${i} med noget tekst der fylder lidt mere end et par ord, så filen vokser.</p>`).join('') + Array.from({ length: 40 }, (_, i) => `\n    <div class="rounded-md p-300 bg-white shadow-sm"><h4 class="font-bold">Boks ${i}</h4><p class="text-300">Tekst i boks ${i}</p><a href="#" class="underline">Link ${i}</a></div>`).join(''));

const card = (name, job) => `<li class="group"><div class="mb-200 rounded-md overflow-clip "><img src="/x.jpg" class="w-full"></div><div class="space-y-100"><h3 class="text-300">${name}</h3><p>${job}</p></div></li>`;
function render(tpl) {
  return tpl
    .replace(/\{\{#[\s\S]*?#\}\}/g, '')
    .replace(/\{\{\s*id\s*\}\}/g, ROW.id)
    .replace(/\{\{\s*headline\s*\}\}/g, ROW.headline)
    .replace(/\{\{\s*visual_edit[^}]*\}\}/g, `data-sid="${ROW._visual_id}" data-sid-section-orderable="true"`)
    .replace(/\{\{\s*collection[\s\S]*?\{\{\s*\/collection\s*\}\}/g, card('Anna', 'Chef') + card('Bo', 'Udvikler') + card('Cai', 'Design'))
    .replace(/\{\{[\s\S]*?\}\}/g, '');
}

/** The site's biggest section file, as a third case when the site is there. */
const biggest = (() => {
  const dir = `${SITE}/resources/views/partials/page_sections`;
  if (!existsSync(dir)) return null;
  let best = null;
  for (const group of readFileSync === null ? [] : require('node:fs').readdirSync(dir)) {
    const gdir = `${dir}/${group}`;
    if (!require('node:fs').statSync(gdir).isDirectory()) continue;
    for (const file of require('node:fs').readdirSync(gdir)) {
      const text = readFileSync(`${gdir}/${file}`, 'utf8');
      if (!best || text.length > best.text.length) best = { text, path: `resources/views/partials/page_sections/${group}/${file}` };
    }
  }
  return best;
})();
function require(name) { return createRequire(import.meta.url)(name); }

const cases = [
  ['small (employees fixture)', { tpl: SMALL, path: PATH }],
  ['big (60 KB, 400 <p>)', { tpl: BIG, path: PATH }],
];
if (biggest) cases.push([`site's biggest section (${biggest.path.split('/').slice(-2).join('/')})`, { tpl: biggest.text, path: biggest.path }]);

const browser = await puppeteer.launch({ headless: true, executablePath: existsSync(CHROME) ? CHROME : undefined, args: ['--allow-file-access-from-files'] });
const tab = await browser.newPage();
tab.on('pageerror', (e) => console.log('  pageerror:', String(e).slice(0, 200)));
// Every animation-frame callback is timed; the paint script is the only one that asks for frames here.
await tab.evaluateOnNewDocument(() => {
  window.__frames = [];
  const raf = window.requestAnimationFrame.bind(window);
  window.requestAnimationFrame = (cb) => raf((t) => { const s = performance.now(); try { cb(t); } finally { window.__frames.push(performance.now() - s); } });
});
let ok = true;

for (const [label, c] of cases) {
  await tab.goto(`file://${OUT}`);
  const live = `<!doctype html><html><head></head><body><main>\n${render(c.tpl)}\n</main></body></html>`;
  // The row's type is the file's: the paint refuses a section the dock's file does not render.
  const row = { ...ROW, type: c.path.replace(/^.*page_sections\//, '').replace(/\.antlers\.html$/, '') };
  const r = await tab.evaluate(async (live, row, tpl, path, fakeTw) => {
    window.__twCompileUrl = fakeTw;
    const dock = document.getElementById('__sve-code-dock');
    try { localStorage.setItem('sveInstantPreview', 'astro'); } catch { /* file:// */ }
    dock.querySelector('[data-sve-code-path]').textContent = path;
    dock.__sveHtmlScope = null;
    window.__paneCss = '#id-{{ id }} { --x: 1 }\n@scope(.employees-list-2) { :scope { padding-block: 4rem } .group { color: red } }';
    const iframe = document.getElementById('live-preview-iframe');
    iframe.srcdoc = live;
    await new Promise((r) => iframe.addEventListener('load', r, { once: true }));
    window.__emit('publish-container-created', { name: 'entry', values: { page_sections: [row] } });
    const frame = async (html) => {
      window.__frames = [];
      window.__sveInstantTrace = [];
      if (html != null) window.__paneHtml = html;
      dock.dispatchEvent(new Event('input', { bubbles: true }));
      await new Promise((r) => setTimeout(r, 120));
      return { ms: Math.round(window.__frames.reduce((a, b) => a + b, 0) * 10) / 10, frames: window.__frames.length, trace: window.__sveInstantTrace.map((t) => String(t).replace(/^\d+ /, '').slice(0, 80)) };
    };
    const out = {};
    out.first = await frame(tpl);
    await new Promise((r) => setTimeout(r, 300)); // the compiler module loads on the first paint
    out.second = await frame(tpl + ' ');
    const median = async (name, edit) => {
      const runs = [];
      for (let i = 0; i < 7; i++) runs.push((await frame(edit(i))).ms);
      runs.sort((a, b) => a - b);
      out[name] = { ms: runs[3], runs };
    };
    await median('text', (i) => tpl.replace('fdsfsd', 'fdsfsd' + 'x'.repeat(i + 1)));
    await median('class', (i) => tpl.replace('<p>fdsfsd</p>', `<p class="mt-${i}00">fdsfsd</p>`));
    await median('structure', (i) => tpl.replace('<p>fdsfsd</p>', `<p>fdsfsd</p><span>ny ${i}</span>`));
    await median('css', (i) => { window.__paneCss = `#id-{{ id }} { --x: ${i} }`; return null; });
    await median('idle (no change)', () => null);
    return out;
  }, live, row, c.tpl, c.path, `file://${DIR}/fixtures/fake-tailwind.mjs`);
  console.log(`\n${label} — ${Math.round(c.tpl.length / 1024)} KB`);
  for (const [name, v] of Object.entries(r)) {
    console.log(`  ${name.padEnd(18)} ${String(v.ms).padStart(6)} ms${v.runs ? '  (runs: ' + v.runs.join(' ') + ')' : v.frames != null ? `  (${v.frames} frame(s))` : ''}`);
    if (v.trace && name === 'second') console.log('    trace: ' + v.trace.join(' | '));
    if (BUDGET && v.runs && v.ms > BUDGET) { ok = false; console.log(`    OVER BUDGET (${BUDGET} ms)`); }
  }
}
await browser.close();
console.log(ok ? '\nPASS' : '\nFAIL');
process.exit(ok ? 0 : 1);
