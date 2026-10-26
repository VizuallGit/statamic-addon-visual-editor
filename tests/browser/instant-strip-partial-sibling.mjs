// The Tailwind strip's hold beside a partial: the real dock-instant-preview.js,
// a fake dock, no Control Panel. Seconds.
//
// Measured on vizuall-demo 26 Oct 2026 (featured_testimonials): with the caret
// in `<div class="p-900 ">`, a class hovered in the strip's list was held on
// the <div> that `{{ partial:components/section_heading }}` renders right
// after it, too — `pairLive` gave one template child every live child of its
// tag whenever the parent held any Antlers marker. The pick then left the
// class on the heading until the morph: the paint keeps a class it did not
// put on. Now `pairLive` chooses as the structure paint does (one for one;
// every live child of the tag only inside a loop block).
//
//   node tests/browser/instant-strip-partial-sibling.mjs
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync } from 'node:fs';

const SITE = process.env.SVE_SITE_DIR || '/Users/flemmingmeyer/Sites/vizuall-skabelon';
const ADDON = new URL('../..', import.meta.url).pathname.replace(/\/$/, '');
const DIR = new URL('.', import.meta.url).pathname;
const puppeteer = createRequire(`${SITE}/package.json`)('puppeteer');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const page = readFileSync(`${DIR}/instant-harness.html`, 'utf8').replace('SCRIPT_SRC', `file://${ADDON}/resources/js/dock-instant-preview.js`);
const OUT = `${DIR}/instant-harness.out.html`;
writeFileSync(OUT, page);

const SECTION_PATH = 'resources/views/partials/page_sections/content/featured_testimonials.antlers.html';
const ROW = {
  id: 'ft0001', _visual_id: 'ft0001-ft0002', enabled: true, type: 'content/featured_testimonials',
  section_heading: [{ type: 'heading', content: [{ type: 'text', text: 'Vi samarbejder med 350+ kunder' }] }],
  settings: { section_heading_sr_only: false },
  entries: [{ text: 'A', name: 'Anna', position: 'CEO' }, { text: 'B', name: 'Bo', position: 'CTO' }],
};

/** The section as the demo has it: a static <div>, the heading partial, a loop of cards with the image partial inside. */
const tpl = (divClass) => `<section id="id-{{ id }}" class="wrapper py-1000 space-y-gutter" {{ visual_edit outline_inside="true" section_orderable="true" }}>
  <div class="${divClass}"></div>
  {{ partial:components/section_heading }}
  <ul class="[ testimonials-list ] ">
    {{ entries }}
      <li class="[ testimonial-card ] bg-gray-100 p-600">
        <b class="[ icon-block ] text-[8rem] font-heading">“</b>
        <p class="opacity-70">{{ text }}</p>
        <div class="flex items-center gap-400 border-y border-black/10 py-200">
          {{ partial:components/image :imagePath="profile_image" blur_load="true" props_width="100" props_height="100" class="size-800 object-cover rounded-full" }}
          <div class="flex flex-col">
            <b class="text-200 font-heading">{{ name }}</b>
            <span class="text-xs opacity-60">{{ position }}</span>
          </div>
        </div>
      </li>
    {{ /entries }}
  </ul>
</section>`;

// The image partial renders its blur wrapper: a <div> before the card's own <div>.
const card = (n) => `<li class="[ testimonial-card ] bg-gray-100 p-600"><b class="[ icon-block ] text-[8rem] font-heading">“</b><p class="opacity-70">${n.text}</p><div class="flex items-center gap-400 border-y border-black/10 py-200"><div class="blurred-img loaded"><img class="max-w-full size-800 object-cover rounded-full" src="/${n.name}.jpg" width="100" height="100" alt=""></div><div class="flex flex-col"><b class="text-200 font-heading">${n.name}</b><span class="text-xs opacity-60">${n.position}</span></div></div></li>`;

const LIVE = `<!doctype html><html><head></head><body><main>
<section id="id-ft0001" class="wrapper py-1000 space-y-gutter" data-sid="ft0001-ft0002" data-sid-section-orderable="true" data-sid-outline-inside="true">
  <div class="p-900 "></div>
  <div class="flow-y flow-space-400 flex flex-col prose-headings:max-w-[30ch] prose-p:max-w-[75ch] prose-p:opacity-75  content-featured-testimonials">
    <h2>Vi samarbejder med 350+ kunder</h2><p>Hos Vizuall hjælper vi virksomheder med branding.</p>
  </div>
  <ul class="[ testimonials-list ] ">${ROW.entries.map(card).join('')}</ul>
</section>
</main></body></html>`;

// [label, { caretTag (the open tag the caret sits in, default the p-900 div), hover (the class value the list shows), pick, close, want }]
const DIV = ['div.p-900.bg-primary'];
const scenarios = [
  ['hover bg-primary in the strip on <div class="p-900 "> — only that div is held', { hover: 'p-900 bg-primary', want: DIV }],
  ['hover, then pick (keep) and the pane gets the class — only that div, and the paint agrees', { hover: 'p-900 bg-primary', pick: 'p-900 bg-primary', want: DIV }],
  ['hover, then the list closes (no detail) — nothing left anywhere', { hover: 'p-900 bg-primary', close: true, want: DIV }],
  ['caret in the <ul>: hover a class — only the ul', { caretTag: '<ul class="[ testimonials-list ] ', hover: '[ testimonials-list ] bg-primary', want: ['ul.[.testimonials-list'] }],
  ['caret in the loop <li>: hover a class — every card, not the heading', { caretTag: '<li class="[ testimonial-card ] bg-gray-100 p-600', hover: '[ testimonial-card ] bg-gray-100 p-600 bg-primary', want: ['li.[.testimonial-card', 'li.[.testimonial-card'] }],
  ['caret in <div class="flex flex-col"> beside the image call: hover — those divs, not the blur wrappers', { caretTag: '<div class="flex flex-col', hover: 'flex flex-col bg-primary', want: ['div.flex.flex-col', 'div.flex.flex-col'] }],
];

const browser = await puppeteer.launch({ headless: true, executablePath: CHROME, args: ['--allow-file-access-from-files'] });
const tab = await browser.newPage();
tab.on('pageerror', (e) => console.log('  pageerror:', String(e).slice(0, 300)));
tab.on('console', (m) => { if (m.type() === 'warning') console.log('  console.warn:', m.text().slice(0, 300)); });
let ok = true;

for (const [label, o] of scenarios) {
  await tab.goto(`file://${OUT}`);
  const startHtml = tpl('p-900 ');
  const caretNeedle = o.caretTag || '<div class="p-900 ';
  const caret = startHtml.indexOf(caretNeedle) + caretNeedle.length;
  const r = await tab.evaluate(async (o) => {
    const dock = document.getElementById('__sve-code-dock');
    try { localStorage.setItem('sveInstantPreview', 'astro'); } catch { /* file:// */ }
    dock.querySelector('[data-sve-code-path]').textContent = o.path;
    dock.__sveHtmlScope = null;
    window.__paneCss = '';
    const iframe = document.getElementById('live-preview-iframe');
    iframe.srcdoc = o.live;
    await new Promise((r) => iframe.addEventListener('load', r, { once: true }));
    const idoc = iframe.contentDocument;
    window.__emit('publish-container-created', { name: 'entry', values: { page_sections: [o.row] } });
    window.__sveInstantTrace = [];
    const tick = () => new Promise((r) => setTimeout(r, 60));
    const type = async (html) => { window.__paneHtml = html; dock.dispatchEvent(new Event('input', { bubbles: true })); await tick(); };
    const marked = () => [...idoc.querySelectorAll('[class~="bg-primary"]')].map((d) => d.tagName.toLowerCase() + '.' + d.className.trim().split(/\s+/).slice(0, 2).join('.'));
    await type(o.startHtml);
    window.__paneCaret = o.caret;
    // The strip's list is open while it is hovered (twSuggestOpen reads the DOM).
    const menu = document.createElement('div'); menu.id = '__sve-tw-menu'; document.body.appendChild(menu);
    document.dispatchEvent(new CustomEvent('sve:tw-preview', { detail: { path: '0:section/0:div', value: o.hover } }));
    await tick();
    const held = marked();
    if (o.close) {
      document.dispatchEvent(new CustomEvent('sve:tw-preview'));
      menu.remove();
      await tick();
    }
    if (o.pickHtml) {
      document.dispatchEvent(new CustomEvent('sve:tw-preview', { detail: { keep: true } }));
      menu.remove();
      await type(o.pickHtml);
    }
    return { held, after: marked(), trace: window.__sveInstantTrace.filter((t) => /tw: (caret|holding|no live)/.test(t)).map((t) => String(t).replace(/^\d+ /, '').slice(0, 160)) };
  }, { path: SECTION_PATH, live: LIVE, row: ROW, startHtml, caret, hover: o.hover, pickHtml: o.pick ? tpl(o.pick) : '', close: !!o.close });

  const afterWant = o.close ? [] : o.want;
  const pass = JSON.stringify(r.held) === JSON.stringify(o.want) && JSON.stringify(r.after) === JSON.stringify(afterWant);
  ok = ok && pass;
  console.log(`${pass ? 'ok ' : 'FAIL'} ${label}`);
  if (!pass) console.log(`  held:  ${JSON.stringify(r.held)}\n  after: ${JSON.stringify(r.after)}\n  want:  ${JSON.stringify(o.want)} / ${JSON.stringify(afterWant)}\n  trace: ${r.trace.join(' | ')}`);
}
await browser.close();
console.log(ok ? '\nPASS' : '\nFAIL');
process.exit(ok ? 0 : 1);
