// Two static <div>s typed beside a field, styled one keystroke at a time: the
// class typed on one must land on that one and only that one, the other div
// keeps every class it has, texts stay where they are, and nothing doubles.
//
// Measured 25 Sep 2026 on the demo: styling the second div sometimes changed
// the first, and a new class on the first took its padding away. Every
// sequence here is checked after every keystroke, with and without a morph
// in between (the server's render replacing the nodes, or patching them).
//
//   node tests/browser/instant-two-divs.mjs
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync } from 'node:fs';

const SITE = process.env.SVE_SITE_DIR || '/Users/flemmingmeyer/Sites/vizuall-skabelon';
const ADDON = new URL('../..', import.meta.url).pathname.replace(/\/$/, '');
const DIR = new URL('.', import.meta.url).pathname;
const puppeteer = createRequire(`${SITE}/package.json`)('puppeteer');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const BASE = readFileSync(`${DIR}/fixtures/intro_2.antlers.html`, 'utf8');
const page = readFileSync(`${DIR}/instant-harness.html`, 'utf8').replace('SCRIPT_SRC', `file://${ADDON}/resources/js/dock-instant-preview.js`);
const OUT = `${DIR}/instant-harness.out.html`;
writeFileSync(OUT, page);

const ROW = { id: 'mu2intro0001', _visual_id: 'mu2intro0001-mu2intro0002', enabled: true, type: 'intro/intro_2', text: [{ type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'Strategisk branding' }] }, { type: 'paragraph', content: [{ type: 'text', text: 'fdsfdsfgfdgfdg' }] }], media: '/x.jpg' };
const FIELD = '<h1>Strategisk branding</h1><p>fdsfdsfgfdgfdg</p>';
const PATH = 'resources/views/partials/page_sections/intro/intro_2.antlers.html';

/** The owner's template: the field wrapper (nothing static inside it), then the two divs beside it, then the if. */
const SHELL = BASE.replace('    <div>dfsfjdgfdggfdggf</div>\n', '');
const two = (d1, d2) => SHELL.replace('    </div>\n', `    </div>\n  ${d1}\n  ${d2}\n`);
const D1 = '<div class="bg-primary-600 py-800">fdsfds fdsf</div>';
const D2 = '<div class="bg-primary-700">fdssdff</div>';

function render(tpl) {
  return tpl
    .replace(/\{\{#[\s\S]*?#\}\}/g, '')
    .replace(/\{\{\s*id\s*\}\}/g, ROW.id)
    .replace(/aria-label="[^"]*"/, 'aria-label="Strategisk branding"')
    .replace(/\{\{\s*visual_edit outline_inside[^}]*\}\}/g, `data-sid="${ROW._visual_id}" data-sid-section-orderable="true" data-sid-outline-inside="true"`)
    .replace(/\{\{\s*visual_edit inline_edit[^}]*\}\}/g, 'data-sid-field="text" data-sid-inline-edit="true"')
    .replace(/\{\{\s*text\s*\}\}/g, FIELD)
    .replace(/\{\{\s*if \(media[\s\S]*?\{\{\s*\/if\s*\}\}/g, '<img src="/x.jpg" class="flow-space-500">')
    .replace(/\{\{[\s\S]*?\}\}/g, '');
}

/** Every state a string passes through when typed or deleted one character at a time. */
const typed = (from, to) => { const out = []; for (let i = from.length; i <= to.length; i++) out.push(to.slice(0, i)); return out; };
const deleted = (from, to) => { const out = []; for (let i = from.length; i >= to.length; i--) out.push(from.slice(0, i)); return out; };
const states = (list1, list2) => { const out = []; const n = Math.max(list1.length, list2.length); for (let i = 0; i < n; i++) out.push(two(list1[Math.min(i, list1.length - 1)], list2[Math.min(i, list2.length - 1)])); return out; };
const d = (cls, text) => `<div class="${cls}">${text}</div>`;

// Each scenario: the pane states in order, what the two divs must show after every state, and how the morph comes between (none | replace | patch).
const scenarios = [];
const four = (d1, d2) => two(d1, `${d2}\n  ${D1}\n  <div class="bg-primary">fdssdff</div>`);
for (const morph of ['none', 'replace', 'patch', 'replace-last-two']) {
  scenarios.push([`four divs, the last two twins of the first two: a class typed on the second lands there only (morph: ${morph})`, {
    states: typed('bg-primary-700', 'bg-primary-700 mt-500').map((c) => four(D1, d(c, 'fdssdff'))),
    morph,
  }]);
  scenarios.push([`four divs: the second's class deleted to "bg-primary" — now a twin of the fourth — then "-300" typed (morph: ${morph})`, {
    states: [...deleted('bg-primary-700', 'bg-primary').map((c) => four(D1, d(c, 'fdssdff'))), ...typed('bg-primary', 'bg-primary-300').slice(1).map((c) => four(D1, d(c, 'fdssdff')))],
    morph,
  }]);
  scenarios.push([`four divs: the first's class changed while the third is its twin (morph: ${morph})`, {
    states: [...deleted('bg-primary-600 py-800', 'bg-primary- py-800').map((c) => four(d(c, 'fdsfds fdsf'), D2)), ...typed('bg-primary- py-800', 'bg-primary-300 py-800').slice(1).map((c) => four(d(c, 'fdsfds fdsf'), D2))],
    morph,
  }]);
  if (morph === 'replace-last-two') continue;
  scenarios.push([`class of the second div deleted to "bg-primary", then "-300" typed (morph: ${morph})`, {
    states: states([D1], [...deleted('bg-primary-700', 'bg-primary').map((c) => d(c, 'fdssdff')), ...typed('bg-primary', 'bg-primary-300').slice(1).map((c) => d(c, 'fdssdff'))]),
    morph,
  }]);
  scenarios.push([`class of the first div: background changed, then " rounded" added (morph: ${morph})`, {
    states: states([...deleted('bg-primary-600 py-800', 'bg-primary- py-800').map((c) => d(c, 'fdsfds fdsf')), ...typed('bg-primary- py-800', 'bg-primary-300 py-800').slice(1).map((c) => d(c, 'fdsfds fdsf')), ...typed('bg-primary-300 py-800', 'bg-primary-300 py-800 rounded').slice(1).map((c) => d(c, 'fdsfds fdsf'))], [D2]),
    morph,
  }]);
  scenarios.push([`autocomplete: "bg-pr" on the second div becomes "bg-primary-300" in one step (morph: ${morph})`, {
    states: states([D1], [d('bg-pr', 'fdssdff'), d('bg-primary-300', 'fdssdff')]),
    morph,
  }]);
  scenarios.push([`text typed into the second div (morph: ${morph})`, {
    states: states([D1], typed('fdssdff', 'fdssdff og mere').map((t) => d('bg-primary-700', t))),
    morph,
  }]);
  scenarios.push([`the second div typed from nothing beside the first (morph: ${morph})`, {
    states: [two(D1, ''), ...typed('', '<div class="bg-primary-700">fdssdff</div>').slice(1).map((s) => two(D1, s))],
    morph,
    allowMidTag: true,
  }]);
  scenarios.push([`a class typed on the first div while the second has the same text as its class (morph: ${morph})`, {
    states: states(typed('bg-primary-600 py-800', 'bg-primary-600 py-800 mt-300').map((c) => d(c, 'fdsfds fdsf')), [D2]),
    morph,
  }]);
}

const browser = await puppeteer.launch({ headless: true, executablePath: CHROME, args: ['--allow-file-access-from-files'] });
const tab = await browser.newPage();
tab.on('pageerror', (e) => console.log('  pageerror:', String(e).slice(0, 200)));
let ok = true;

// --- A class held from a list (the strip's, or the HTML pane's completion): on the tag the caret is in, and only there. ---
const FAKE_TW = `file://${DIR}/fixtures/fake-tailwind.mjs`;
const holdScenarios = [
  ['a class held for the second div lands on the second div; the first keeps its classes and its CSS', {
    pane: two(D1, D2), caretIn: 'bg-primary-700', value: 'bg-primary-700 bg-primary-300',
    expectDivs: [{ cls: 'bg-primary-600 py-800', text: 'fdsfds fdsf' }, { cls: 'bg-primary-700 bg-primary-300', text: 'fdssdff' }],
    fileSheetHas: ['.py-800', '.bg-primary-600', '.bg-primary-700'], holdSheetHas: ['.bg-primary-300'],
    afterRelease: [{ cls: 'bg-primary-600 py-800', text: 'fdsfds fdsf' }, { cls: 'bg-primary-700', text: 'fdssdff' }],
  }],
  ['a class held for the first div lands on the first div; the second is untouched', {
    pane: two(D1, D2), caretIn: 'bg-primary-600 py-800', value: 'bg-primary-600 py-800 rounded',
    expectDivs: [{ cls: 'bg-primary-600 py-800 rounded', text: 'fdsfds fdsf' }, { cls: 'bg-primary-700', text: 'fdssdff' }],
    fileSheetHas: ['.py-800'], holdSheetHas: ['.rounded'],
    afterRelease: [{ cls: 'bg-primary-600 py-800', text: 'fdsfds fdsf' }, { cls: 'bg-primary-700', text: 'fdssdff' }],
  }],
  ['a class held for a third div still being typed lands nowhere: the two on the page are untouched', {
    pane: two(D1, `${D2}\n  <div class="bg-pr`), caretIn: '<div class="bg-pr', value: 'bg-primary-300',
    expectDivs: [{ cls: 'bg-primary-600 py-800', text: 'fdsfds fdsf' }, { cls: 'bg-primary-700', text: 'fdssdff' }],
    fileSheetHas: ['.py-800'], holdSheetHas: [],
    afterRelease: [{ cls: 'bg-primary-600 py-800', text: 'fdsfds fdsf' }, { cls: 'bg-primary-700', text: 'fdssdff' }],
  }],
  ['the class kept (Enter) and then written: the file sheet has it, the hold sheet is gone', {
    pane: two(D1, D2), caretIn: 'bg-primary-700', value: 'bg-primary-700 bg-primary-300', keep: true, then: two(D1, d('bg-primary-700 bg-primary-300', 'fdssdff')),
    expectDivs: [{ cls: 'bg-primary-600 py-800', text: 'fdsfds fdsf' }, { cls: 'bg-primary-700 bg-primary-300', text: 'fdssdff' }],
    fileSheetHas: ['.py-800'], writtenSheetHas: ['.py-800', '.bg-primary-300'], holdSheetHas: null,
    afterRelease: [{ cls: 'bg-primary-600 py-800', text: 'fdsfds fdsf' }, { cls: 'bg-primary-700 bg-primary-300', text: 'fdssdff' }],
  }],
];
for (const [label, o] of holdScenarios) {
  await tab.goto(`file://${OUT}`);
  const live = `<!doctype html><html><head></head><body><main>\n${render(two(D1, D2))}\n</main></body></html>`;
  const r = await tab.evaluate(async (live, row, o, path, fakeTw) => {
    window.__twCompileUrl = fakeTw;
    const dock = document.getElementById('__sve-code-dock');
    try { localStorage.setItem('sveInstantPreview', 'astro'); localStorage.removeItem('sveInstantHover'); } catch { /* file:// */ }
    dock.querySelector('[data-sve-code-path]').textContent = path;
    dock.__sveHtmlScope = null;
    window.__paneCss = '';
    const iframe = document.getElementById('live-preview-iframe');
    iframe.srcdoc = live;
    await new Promise((r) => iframe.addEventListener('load', r, { once: true }));
    const idoc = iframe.contentDocument;
    window.__emit('publish-container-created', { name: 'entry', values: { page_sections: [row] } });
    const snapshot = () => [...idoc.querySelectorAll('section > div:not([data-sid-field])')].map((el) => ({ cls: (el.getAttribute('class') || '').trim().split(/\s+/).filter(Boolean).join(' '), text: el.textContent.trim() }));
    const sheets = () => ({ file: idoc.getElementById('__sve-tw-dock-live')?.textContent ?? null, hold: idoc.getElementById('__sve-tw-hold-live')?.textContent ?? null, order: [...idoc.head.querySelectorAll('style')].map((s) => s.id).join('>') });
    window.__paneHtml = o.pane;
    // The last occurrence: a short marker is a prefix of an earlier class too.
    window.__paneCaret = o.pane.lastIndexOf(o.caretIn) + o.caretIn.length;
    dock.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise((r) => setTimeout(r, 300)); // the compiler module loads on the first paint
    dock.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise((r) => setTimeout(r, 60));
    const before = { divs: snapshot(), sheets: sheets() };
    document.dispatchEvent(new CustomEvent('sve:tw-preview', { detail: { path: 'x', value: o.value } }));
    await new Promise((r) => setTimeout(r, 60));
    const held = { divs: snapshot(), sheets: sheets() };
    if (o.keep) {
      document.dispatchEvent(new CustomEvent('sve:tw-preview', { detail: { keep: true } }));
      window.__paneHtml = o.then;
      dock.dispatchEvent(new Event('input', { bubbles: true }));
    } else {
      document.dispatchEvent(new CustomEvent('sve:tw-preview'));
    }
    await new Promise((r) => setTimeout(r, 60));
    const released = { divs: snapshot(), sheets: sheets() };
    return { before, held, released };
  }, live, ROW, o, PATH, FAKE_TW);
  const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  const problems = [];
  if (!same(r.before.divs, wanted(o.pane).slice(0, 2))) problems.push(`  before the hold: ${JSON.stringify(r.before.divs)}`);
  if (!same(r.held.divs, o.expectDivs)) problems.push(`  held: want ${JSON.stringify(o.expectDivs)} got ${JSON.stringify(r.held.divs)}`);
  for (const c of o.fileSheetHas) if (!(r.held.sheets.file || '').includes(c)) problems.push(`  held: the file sheet lost ${c}: ${JSON.stringify(r.held.sheets.file)}`);
  if (o.holdSheetHas === null) { /* checked after the keep */ } else if (o.holdSheetHas.length === 0) { if (r.held.sheets.hold) problems.push(`  held: a hold sheet although nothing was held: ${r.held.sheets.hold}`); } else for (const c of o.holdSheetHas) if (!(r.held.sheets.hold || '').includes(c)) problems.push(`  held: the hold sheet lacks ${c}: ${JSON.stringify(r.held.sheets.hold)}`);
  if (r.held.sheets.hold && !/__sve-tw-dock-live>__sve-tw-hold-live$/.test(r.held.sheets.order)) problems.push(`  held: sheet order ${r.held.sheets.order}`);
  if (!same(r.released.divs, o.afterRelease)) problems.push(`  released: want ${JSON.stringify(o.afterRelease)} got ${JSON.stringify(r.released.divs)}`);
  if (r.released.sheets.hold) problems.push(`  released: the hold sheet is still there: ${r.released.sheets.hold}`);
  if (o.keep) for (const c of o.writtenSheetHas) if (!(r.released.sheets.file || '').includes(c)) problems.push(`  written: the file sheet lacks ${c}: ${JSON.stringify(r.released.sheets.file)}`);
  const pass = problems.length === 0;
  ok = ok && pass;
  console.log(`${pass ? 'ok ' : 'FAIL'} ${label}`);
  if (!pass) console.log(problems.join('\n'));
}

/** The two divs as the pane state says they should be, from the state's markup. */
function wanted(state) {
  const m = [...state.matchAll(/<div class="([^"]*)">([^<]*)<\/div>/g)].map((x) => ({ cls: x[1].trim().split(/\s+/).filter(Boolean).join(' '), text: x[2].trim() }));
  return m;
}
/** A pane state the parser reads differently — a tag still being typed — is one the paint waits on; the check waits with it. */
const midTag = (html) => /<\/?[a-zA-Z][^<>"']*(?:"[^"]*"[^<>"']*|'[^']*'[^<>"']*)*(?:<|$|"[^"]*(?:<|$)|'[^']*(?:<|$))/.test(html);

for (const [label, opts] of scenarios) {
  await tab.goto(`file://${OUT}`);
  const first = opts.states[0];
  const live = `<!doctype html><html><head></head><body><main>\n${render(first)}\n</main></body></html>`;
  const results = await tab.evaluate(async (live, row, states, path, morph, renders) => {
    const dock = document.getElementById('__sve-code-dock');
    try { localStorage.setItem('sveInstantPreview', 'astro'); } catch { /* file:// */ }
    dock.querySelector('[data-sve-code-path]').textContent = path;
    dock.__sveHtmlScope = null;
    window.__paneCss = '';
    const iframe = document.getElementById('live-preview-iframe');
    iframe.srcdoc = live;
    await new Promise((r) => iframe.addEventListener('load', r, { once: true }));
    const idoc = iframe.contentDocument;
    window.__emit('publish-container-created', { name: 'entry', values: { page_sections: [row] } });
    const snapshot = () => [...idoc.querySelectorAll('section > div:not([data-sid-field])')].map((el) => ({ cls: (el.getAttribute('class') || '').trim().split(/\s+/).filter(Boolean).join(' '), text: el.textContent.trim() }));
    const out = [];
    for (let i = 0; i < states.length; i++) {
      window.__paneHtml = states[i];
      dock.dispatchEvent(new Event('input', { bubbles: true }));
      await new Promise((r) => setTimeout(r, 40));
      out.push({ i, divs: snapshot(), field: idoc.querySelector('[data-sid-field="text"]')?.innerHTML.replace(/\s+/g, ' ').trim(), sections: idoc.querySelectorAll('section').length });
      // The morph after this keystroke's save: the server's render of this very state.
      // The server renders what is saved: a tag still open, or a div not closed yet, is the file's doing, not the paint's — no morph on those states.
      const half = /<\/?[a-zA-Z][^<>"']*(?:"[^"]*"[^<>"']*|'[^']*'[^<>"']*)*(?:<|$|"[^"]*(?:<|$)|'[^']*(?:<|$))/.test(states[i]) || (states[i].match(/<div\b/g) || []).length !== (states[i].match(/<\/div>/g) || []).length;
      if (morph === 'replace' && i % 2 === 1 && !half) {
        const tmp = document.createElement('div'); tmp.innerHTML = renders[i];
        const fresh = tmp.querySelector('section'); const old = idoc.querySelector('section');
        if (fresh && old) { old.replaceWith(idoc.importNode(fresh, true)); }
        iframe.contentWindow.dispatchEvent(new CustomEvent('statamic:preview-updated'));
        await new Promise((r) => setTimeout(r, 40));
        out.push({ i: i + 0.5, divs: snapshot(), field: idoc.querySelector('[data-sid-field="text"]')?.innerHTML.replace(/\s+/g, ' ').trim(), sections: idoc.querySelectorAll('section').length, afterMorph: true });
      } else if (morph === 'replace-last-two' && i % 2 === 1 && !half) {
        // The server's render of this state, but only the last two divs swapped for fresh nodes: the first two stay the paint's own.
        const tmp = document.createElement('div'); tmp.innerHTML = renders[i];
        const want = [...tmp.querySelectorAll('section > div:not([data-sid-field])')];
        const have = [...idoc.querySelectorAll('section > div:not([data-sid-field])')];
        have.slice(-2).forEach((h, k) => { const w = want[want.length - 2 + k]; if (w) h.replaceWith(idoc.importNode(w, true)); else h.remove(); });
        iframe.contentWindow.dispatchEvent(new CustomEvent('statamic:preview-updated'));
        await new Promise((r) => setTimeout(r, 40));
        out.push({ i: i + 0.5, divs: snapshot(), field: idoc.querySelector('[data-sid-field="text"]')?.innerHTML.replace(/\s+/g, ' ').trim(), sections: idoc.querySelectorAll('section').length, afterMorph: true });
      } else if (morph === 'patch' && i % 2 === 1 && !half) {
        // Alpine.morph keeps the nodes: attributes and text patched in place, by position.
        const tmp = document.createElement('div'); tmp.innerHTML = renders[i];
        const want = [...tmp.querySelectorAll('section > div:not([data-sid-field])')];
        const have = [...idoc.querySelectorAll('section > div:not([data-sid-field])')];
        want.forEach((w, k) => { const h = have[k]; if (!h) { idoc.querySelector('section > img, section > video')?.before(idoc.importNode(w, true)); return; } if (h.getAttribute('class') !== w.getAttribute('class')) h.setAttribute('class', w.getAttribute('class') || ''); if (h.textContent !== w.textContent) h.textContent = w.textContent; });
        have.slice(want.length).forEach((h) => h.remove());
        iframe.contentWindow.dispatchEvent(new CustomEvent('statamic:preview-updated'));
        await new Promise((r) => setTimeout(r, 40));
        out.push({ i: i + 0.5, divs: snapshot(), field: idoc.querySelector('[data-sid-field="text"]')?.innerHTML.replace(/\s+/g, ' ').trim(), sections: idoc.querySelectorAll('section').length, afterMorph: true });
      }
    }
    return out;
  }, live, ROW, opts.states, PATH, opts.morph, opts.states.map(render));
  const problems = [];
  for (const r of results) {
    const state = opts.states[Math.floor(r.i)];
    const want = wanted(state);
    if (!r.afterMorph && midTag(state)) continue; // the paint waits on a half-typed tag; the previous paint stands
    const got = r.divs;
    const same = got.length === want.length && got.every((g, k) => g.cls === want[k].cls && g.text === want[k].text);
    if (!same) problems.push(`  step ${r.i}${r.afterMorph ? ' (after morph)' : ''}: want ${JSON.stringify(want)} got ${JSON.stringify(got)}`);
    if (r.field !== FIELD) problems.push(`  step ${r.i}: the field changed: ${r.field}`);
    if (r.sections !== 1) problems.push(`  step ${r.i}: ${r.sections} sections`);
  }
  const pass = problems.length === 0;
  ok = ok && pass;
  console.log(`${pass ? 'ok ' : 'FAIL'} ${label} — ${results.length} checks`);
  if (!pass) console.log(problems.slice(0, 6).join('\n'));
}
await browser.close();
console.log(ok ? '\nPASS' : '\nFAIL');
process.exit(ok ? 0 : 1);
