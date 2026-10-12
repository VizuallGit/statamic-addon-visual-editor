// The caret inside an Antlers tag's parameter, and a hold that outlives its
// list. Measured 12 Oct 2026 on Cuben's companies list: with the caret in
// `{{ svg src="{{ logo }}" … class="max-h-5|" }}` the completion list's
// hover held `max-h-5` on every <li> around it — the cards collapsed, teaser
// and button fell out of them — and when the list closed on a click into the
// preview the hold stayed, until the preview was reloaded.
//
//   node tests/browser/instant-antlers-caret.mjs
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync } from 'node:fs';

const SITE = process.env.SVE_SITE_DIR || '/Users/flemmingmeyer/Sites/vizuall-skabelon';
const ADDON = new URL('../..', import.meta.url).pathname.replace(/\/$/, '');
const DIR = new URL('.', import.meta.url).pathname;
const puppeteer = createRequire(`${SITE}/package.json`)('puppeteer');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const TEMPLATE = readFileSync(`${DIR}/fixtures/companies_list.antlers.html`, 'utf8');
const page = readFileSync(`${DIR}/instant-harness.html`, 'utf8').replace('SCRIPT_SRC', `file://${ADDON}/resources/js/dock-instant-preview.js`);
const OUT = `${DIR}/instant-harness.out.html`;
writeFileSync(OUT, page);

const ROW = { id: 'mv163ycjmpjs', _visual_id: '09c313c2-f769-4765-8969-f93700b14d6f', enabled: true, type: 'section/companies_list', section_heading: [{ type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Mød husets virksomheder' }] }], text: [{ type: 'paragraph', content: [{ type: 'text', text: 'Ni fagligheder.' }] }] };
const PATH = 'resources/views/partials/page_sections/section/companies_list.antlers.html';
const LI = 'bg-gray-800 p-500 relative flow-y';

const card = (name, teaser, i) => `<li class="${LI}">
  <svg width="auto" height="auto" class="max-h-500 w-auto" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 35"><path d="M0 0h220v35H0z"/></svg>
  <p class="flow-space-600 opacity-70">${teaser}</p>
  <button type="button" @click="item = ${i}; open = true" aria-haspopup="dialog" class="link-parent text-primary"><span class="flex items-center gap-[.4em]">Se profil <svg class="h-[1em]" aria-hidden="true" viewBox="0 0 24 24"><path d="M4 12h16"/></svg></span><span class="sr-only"> om ${name}</span></button>
  <template><div class="company-dialog"><h2 id="company-dialog-title" class="text-400">${name}</h2><p>${teaser}</p></div></template>
</li>`;

/** The section as the server renders it: three cards, the fields drawn, the tags gone. */
function render(tpl) {
  return tpl
    .replace(/\{\{#[\s\S]*?#\}\}/g, '')
    .replace(/\{\{\s*id\s*\}\}/g, ROW.id)
    .replace(/\{\{\s*visual_edit[^}]*\}\}/g, `data-sid="${ROW._visual_id}" data-sid-section-orderable="true" data-sid-outline-inside="true"`)
    .replace(/\{\{\s*section_heading\s*\}\}/g, '<h2>Mød husets virksomheder</h2>')
    .replace(/\{\{\s*text\s*\}\}/g, '<p>Ni fagligheder.</p>')
    .replace(/\{\{\s*collection[\s\S]*?\{\{\s*\/collection\s*\}\}/g, card('Vizuall', 'Reklamebureau', 0) + card('Eventpro', 'Eventteknik', 1) + card('Itention', 'IT-rådgivning', 2))
    .replace(/\{\{\s*sve_tw\s*\}\}/g, '')
    .replace(/\{\{\s*style_push\s*\}\}[\s\S]*?\{\{\s*\/style_push\s*\}\}/g, '')
    .replace(/\{\{[\s\S]*?\}\}/g, '');
}

const LIVE = `<!doctype html><html><head></head><body><main>\n${render(TEMPLATE)}\n</main></body></html>`;
const SVG_CLASS = 'class="max-h-500 w-auto" aria-hidden="true" }}';
if (!TEMPLATE.includes(SVG_CLASS)) throw new Error('the svg tag is not where the fixture had it');
const inSvg = TEMPLATE.replace(SVG_CLASS, 'class="max-h-5 w-auto" aria-hidden="true" }}');
const CARET_SVG = inSvg.indexOf('max-h-5 w-auto') + 'max-h-5'.length;
const LI_TAG = `<li class="${LI}">`;
if (!TEMPLATE.includes(LI_TAG)) throw new Error('the <li> is not where the fixture had it');
const inLi = TEMPLATE.replace(LI_TAG, `<li class="${LI} p-6">`);
const CARET_LI = inLi.indexOf(`${LI} p-6`) + `${LI} p-6`.length;

const browser = await puppeteer.launch({ headless: true, executablePath: CHROME, args: ['--allow-file-access-from-files'] });
const tab = await browser.newPage();
tab.on('pageerror', (e) => console.log('  pageerror:', String(e).slice(0, 200)));
const checks = [];
const check = (name, ok, detail) => { checks.push(ok); console.log(`${ok ? 'ok  ' : 'FAIL'} ${name}${detail ? ' — ' + detail : ''}`); };

await tab.goto(`file://${OUT}`);
const result = await tab.evaluate(async (live, row, path, states) => {
  const dock = document.getElementById('__sve-code-dock');
  try { localStorage.setItem('sveInstantPreview', 'astro'); } catch { /* file:// */ }
  dock.querySelector('[data-sve-code-path]').textContent = path;
  const iframe = document.getElementById('live-preview-iframe');
  iframe.srcdoc = live;
  await new Promise((r) => iframe.addEventListener('load', r, { once: true }));
  const idoc = iframe.contentDocument;
  window.__emit('publish-container-created', { name: 'entry', values: { page_sections: [row] } });
  const liClasses = () => [...new Set([...idoc.querySelectorAll('section > ul > li')].map((li) => li.getAttribute('class')))];
  const paint = async (html, caret) => { window.__paneHtml = html; window.__paneCaret = caret; window.__sveInstantTrace = []; dock.dispatchEvent(new Event('input', { bubbles: true })); await new Promise((r) => setTimeout(r, 60)); };
  const preview = async (value) => { window.__sveInstantTrace = []; document.dispatchEvent(new CustomEvent('sve:tw-preview', { detail: value == null ? undefined : { value } })); await new Promise((r) => setTimeout(r, 30)); };
  const trace = () => (window.__sveInstantTrace || []).map((t) => String(t).replace(/^\d+ /, '')).join(' | ');
  const out = {};

  // 1. Caret inside `{{ svg … class="max-h-5|" }}`: the strip's list and the
  // completion list ask for `max-h-5` — nothing on the page is that tag.
  await paint(states.inSvg, states.caretSvg);
  out.svgPaint = { li: liClasses(), trace: trace() };
  await preview('max-h-5');
  out.svgHold = { li: liClasses(), trace: trace() };
  await preview(null);

  // 2. Caret inside the <li>'s own class: the hold lands on every card — and
  // goes when the completion list leaves the page without a word.
  await paint(states.inLi, states.caretLi);
  const tooltip = document.createElement('div');
  tooltip.className = 'cm-tooltip sve-tw-complete';
  tooltip.innerHTML = '<ul><li aria-selected="true"><span class="cm-completionLabel">p-60</span></li></ul>';
  document.body.appendChild(tooltip);
  tooltip.querySelector('li').dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
  await new Promise((r) => setTimeout(r, 30));
  out.liHold = { li: liClasses(), trace: trace() };
  tooltip.remove();
  await new Promise((r) => setTimeout(r, 30));
  out.liReleased = { li: liClasses(), trace: trace() };

  // 3. A tag still being typed: `{{ sv` with no `}}` to come waits.
  await paint(states.inLi.replace('{{ teaser }}', '{{ teas'), 0);
  out.openTag = { teasers: [...idoc.querySelectorAll('section > ul > li > p')].map((p) => p.textContent.trim()) };

  return out;
}, LIVE, ROW, PATH, { inSvg, caretSvg: CARET_SVG, inLi, caretLi: CARET_LI });
await browser.close();

check('a class edited inside {{ svg … }} changes no card', result.svgPaint.li.length === 1 && result.svgPaint.li[0] === LI, JSON.stringify(result.svgPaint.li));
check('the list on that caret holds nothing: no live element inside an Antlers tag', result.svgHold.li.length === 1 && result.svgHold.li[0] === LI && /inside an Antlers tag/.test(result.svgHold.trace), `${JSON.stringify(result.svgHold.li)} | ${result.svgHold.trace.slice(0, 160)}`);
check('a hold on the <li> itself lands on every card', result.liHold.li.length === 1 && result.liHold.li[0] === `${LI} p-6 p-60`, JSON.stringify(result.liHold.li));
check('the completion list leaving the page takes the hold with it', result.liReleased.li.length === 1 && result.liReleased.li[0] === `${LI} p-6`, JSON.stringify(result.liReleased.li));
check('a tag still being typed (`{{ teas`) leaves the field text alone', result.openTag.teasers.join(',') === 'Reklamebureau,Eventteknik,IT-rådgivning', result.openTag.teasers.join(','));
console.log(checks.every(Boolean) ? '\nPASS' : '\nFAIL');
process.exit(checks.every(Boolean) ? 0 : 1);
