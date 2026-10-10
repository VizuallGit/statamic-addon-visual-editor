// Instant paint must leave alone what the page's own script put on the page.
//
// A dialog's body is copied in by Alpine (`$refs.content.innerHTML = …` from a
// <template>); the file leaves that element empty. Instant used to read the
// copied body as "live children the template no longer has", lift it up
// through every parent that names its tag and unwrap it at the top — a shut
// dialog's body stood in the section, outside the dialog, unstyled. It
// happened on any paint of the file while the dialog had a body: switching the
// dock to another section and back was enough.
//
// Same harness as instant-harness.mjs: the real dock-instant-preview.js, a fake
// dock, no Control Panel. `node tests/browser/instant-alpine-content.mjs`.
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const SITE = process.env.SVE_SITE_DIR || '/Users/flemmingmeyer/Sites/vizuall-skabelon';
const ADDON = new URL('../..', import.meta.url).pathname.replace(/\/$/, '');
const DIR = new URL('.', import.meta.url).pathname;
const puppeteer = createRequire(`${SITE}/package.json`)('puppeteer');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const TEMPLATE = `<section id="id-{{ id }}" class="wrapper space-y-gutter" x-data="{ open: false, item: 0 }" {{ visual_edit outline_inside="true" section_orderable="true" }}>
  <div class="flex flex-wrap">
    <h2 class="text-400">Mød husets virksomheder</h2>
  </div>
  <ul class="grid grid-cols-3">
    {{ collection from="companies" }}
      <li class="bg-gray-800 p-500">
        <p class="opacity-70">{{ teaser }}</p>
        <button type="button" class="text-primary">Se profil</button>
        <template>
          {{ partial:components/company_dialog }}
        </template>
      </li>
    {{ /collection }}
  </ul>
  <dialog x-ref="dialog" class="p-0 m-0 open:fixed open:inset-0">
    <div class="relative w-full max-w-2xl">
      <form method="dialog" class="absolute top-200 right-200">
        <button class="grid size-10">x</button>
      </form>
      <div x-ref="content"></div>
    </div>
  </dialog>
</section>`;

const ROW = { id: 'mv163ycjmpjs', _visual_id: 'mv163ycjmpjs-sid', enabled: true, type: 'section/companies_list' };
const PATH = 'resources/views/partials/page_sections/section/companies_list.antlers.html';
const BODY = '<div class="company-dialog"><img src="/x.jpg" class="w-full h-auto"><div class="p-500 flow-y"><h2 class="text-400">Vizuall</h2><p>Brødtekst</p></div></div>';
const card = (t) => `<li class="bg-gray-800 p-500"><p class="opacity-70">${t}</p><button type="button" class="text-primary">Se profil</button><template>${BODY}</template></li>`;

/** As the server renders it, then as Alpine leaves it once the dialog has been opened: the body copied in. */
const LIVE = '<!doctype html><html><head></head><body><main>\n' + TEMPLATE
  .replace(/\{\{\s*id\s*\}\}/g, ROW.id)
  .replace(/\{\{\s*visual_edit[^}]*\}\}/g, `data-sid="${ROW._visual_id}" data-sid-section-orderable="true" data-sid-outline-inside="true"`)
  .replace(/\{\{\s*collection[\s\S]*?\{\{\s*\/collection\s*\}\}/g, card('Reklamebureau') + card('Eventteknik'))
  .replace('<div x-ref="content"></div>', `<div x-ref="content">\n${BODY}\n</div>`) + '\n</main></body></html>';

const page = readFileSync(`${DIR}/instant-harness.html`, 'utf8').replace('SCRIPT_SRC', `file://${ADDON}/resources/js/dock-instant-preview.js`);
writeFileSync(`${DIR}/instant-harness.out.html`, page);

const cases = [
  ['the file as it is, painted again (a switch back to the section)', TEMPLATE],
  ['a class typed on the dialog', TEMPLATE.replace('class="p-0 m-0 open:fixed', 'class="p-0 m-0 bg-black/70 open:fixed')],
  ['a class typed on the card text', TEMPLATE.replace('<p class="opacity-70">', '<p class="opacity-60">')],
];

const browser = await puppeteer.launch({ headless: true, executablePath: existsSync(CHROME) ? CHROME : undefined, args: ['--allow-file-access-from-files'] });
const tab = await browser.newPage();
let failed = 0;

for (const [label, next] of cases) {
  await tab.goto(`file://${DIR}/instant-harness.out.html`);
  const r = await tab.evaluate(async (live, row, tpl, next, path) => {
    const dock = document.getElementById('__sve-code-dock');
    try { localStorage.setItem('sveInstantPreview', 'astro'); } catch { /* astro is the default */ }
    dock.querySelector('[data-sve-code-path]').textContent = path;
    const iframe = document.getElementById('live-preview-iframe');
    iframe.srcdoc = live;
    await new Promise((res) => iframe.addEventListener('load', res, { once: true }));
    const idoc = iframe.contentDocument;
    window.__emit('publish-container-created', { name: 'entry', values: { page_sections: [row] } });
    window.__sveInstantTrace = [];
    window.__paneHtml = tpl;
    dock.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise((res) => setTimeout(res, 80));
    window.__paneHtml = next;
    dock.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise((res) => setTimeout(res, 80));
    const s = idoc.querySelector('section');
    return {
      kids: [...s.children].map((k) => k.tagName.toLowerCase()).join(' '),
      bodyInDialog: !!s.querySelector('dialog [x-ref="content"] > .company-dialog img'),
      dialogClass: s.querySelector('dialog')?.getAttribute('class'),
      cardP: s.querySelector('li p')?.getAttribute('class'),
      trace: window.__sveInstantTrace.map((t) => String(t).replace(/^\d+ /, '').slice(0, 90)),
    };
  }, LIVE, ROW, TEMPLATE, next, PATH);
  const ok = r.kids === 'div ul dialog' && r.bodyInDialog;
  if (!ok) failed++;
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${label}\n     section children: ${r.kids} | body inside the dialog: ${r.bodyInDialog ? 'yes' : 'NO'} | dialog class: ${r.dialogClass} | card <p>: ${r.cardP}\n     trace: ${r.trace.join(' | ')}`);
}
await browser.close();
process.exit(failed ? 1 : 0);
