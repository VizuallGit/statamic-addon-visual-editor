// A section whose parent holds a partial call beside a dynamic sibling, and
// classes the page's own script puts on the page: the real
// dock-instant-preview.js, a fake dock, no Control Panel. Seconds.
//
// Measured 11 Oct 2026: in `<div class="flex items-center">{{ partial:components/image }}
// <div class="flex flex-col">{{ name }}</div></div>` the template's dynamic
// <div> spoke for every live <div> of its tag in that parent, so the
// component's blur wrapper (`<div class="blurred-img">`) got the sibling's
// classes until the morph — its `height: 100%` and the image's fade went
// with them. And `loaded`, which blurred-img.js adds once the picture is
// in, was taken off by every paint of a template `<div class="blurred-img">`
// (the image component open in the dock): every picture on the page went
// back to `opacity: 0` until the morph.
//
//   node tests/browser/instant-partial-sibling.mjs
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
const IMAGE_PATH = 'resources/views/partials/components/image.antlers.html';
const ROW = { id: 'ft0001', _visual_id: 'ft0001-ft0002', enabled: true, type: 'content/featured_testimonials', headline: 'Kunder' };

/** The section: a loop of cards, each with the image component and a dynamic <div> beside it. */
const section = (card) => `<section id="id-{{ id }}" class="wrapper" {{ visual_edit outline_inside="true" section_orderable="true" }}>
<h2 class="mb-5">{{ headline }}</h2>
<ul>{{ entries }}${card}{{ /entries }}</ul>
</section>`;
const CARD = `<li class="card"><div class="flex items-center">
{{ partial:components/image class="x" }}
<div class="flex flex-col"><b>{{ name }}</b></div></div></li>`;
const TEMPLATE = section(CARD);

/** The image component as the site has it: the blur wrapper around the <img>. */
const IMAGE = `{{ _blur = props_image && blur_load !== 'false' }}
{{ if _blur }}<div class="blurred-img" style="background-image: url({{ glide :src="props_image" width="40" }})">{{ /if }}
<img class="max-w-full {{ class }}" src="{{ glide :src="props_image" }}" alt="">
{{ if _blur }}</div>{{ /if }}`;

/** One rendered card: the blur wrapper has `loaded` from blurred-img.js. */
const blur = (n, extra = '') => `<div class="blurred-img loaded"${extra} style="background-image: url(/${n}-40.jpg)"><img class="max-w-full x" src="/${n}.jpg" alt=""></div>`;
const li = (n, wrapperExtra = '') => `<li class="card"><div class="flex items-center">${blur(n, wrapperExtra)}<div class="flex flex-col"><b>${n}</b></div></div></li>`;
const live = (cards) => `<!doctype html><html><head></head><body><main><section id="id-ft0001" class="wrapper" data-sid="ft0001-ft0002" data-sid-section-orderable="true"><h2 class="mb-5">Kunder</h2><ul>${cards}</ul></section></main></body></html>`;

const wrappers = (doc) => [...doc.querySelectorAll('.flex.items-center > div')].map((d) => d.className);

// [label, { path, live, first?, states, check(after) → problems[] }]
const scenarios = [
  ['a dynamic <div> beside the image call: the blur wrapper keeps its own classes', {
    path: SECTION_PATH, live: live(li('A') + li('B')),
    states: [TEMPLATE, section(CARD.replace('flex flex-col', 'flex flex-col gap-2'))],
    check: (r) => r.wrappers.join(',') === 'blurred-img loaded,flex flex-col gap-2,blurred-img loaded,flex flex-col gap-2' ? [] : [`wrappers: ${r.wrappers.join(',')}`],
  }],
  ['the class typed on the dynamic <div> lands there, letter by letter', {
    path: SECTION_PATH, live: live(li('A') + li('B')),
    states: ['', ' g', ' ga', ' gap', ' gap-', ' gap-2'].map((s) => section(CARD.replace('flex flex-col', 'flex flex-col' + s))),
    check: (r) => r.wrappers.join(',') === 'blurred-img loaded,flex flex-col gap-2,blurred-img loaded,flex flex-col gap-2' ? [] : [`wrappers: ${r.wrappers.join(',')}`],
  }],
  ['a class deleted from the dynamic <div> goes at once; the blur wrapper is untouched', {
    path: SECTION_PATH, live: live(li('A') + li('B')),
    states: [TEMPLATE, section(CARD.replace('flex flex-col', 'flex'))],
    check: (r) => r.wrappers.join(',') === 'blurred-img loaded,flex,blurred-img loaded,flex' ? [] : [`wrappers: ${r.wrappers.join(',')}`],
  }],
  // The image component open in the dock: every instance is painted, and `loaded` stays.
  // The <img>'s class holds `{{ class }}` (the caller's) and is never painted; the wrapper is.
  ['the image component open: a keystroke in the file keeps `loaded` on every wrapper', {
    path: IMAGE_PATH, live: live(li('A', ' data-sve-component-focused=""') + li('B', ' data-sve-component-focused=""')),
    states: [IMAGE, IMAGE.replace('alt=""', 'alt="" width="500"')],
    check: (r) => {
      const out = [];
      if (r.wrappers.join(',') !== 'blurred-img loaded,flex flex-col,blurred-img loaded,flex flex-col') out.push(`wrappers: ${r.wrappers.join(',')}`);
      if (r.imgs.join(',') !== 'max-w-full x,max-w-full x') out.push(`imgs: ${r.imgs.join(',')}`);
      return out;
    },
  }],
  ['the image component open: a class typed on the wrapper itself keeps `loaded` too', {
    path: IMAGE_PATH, live: live(li('A', ' data-sve-component-focused=""') + li('B', ' data-sve-component-focused=""')),
    states: [IMAGE, IMAGE.replace('class="blurred-img"', 'class="blurred-img rounded"')],
    check: (r) => r.wrappers.join(',') === 'blurred-img rounded loaded,flex flex-col,blurred-img rounded loaded,flex flex-col' ? [] : [`wrappers: ${r.wrappers.join(',')}`],
  }],
  ['the image component open: a class the template had and drops goes; `loaded` stays', {
    path: IMAGE_PATH, live: live(li('A', ' data-sve-component-focused=""').replace('blurred-img loaded', 'blurred-img rounded loaded') + li('B', ' data-sve-component-focused=""').replace('blurred-img loaded', 'blurred-img rounded loaded')),
    states: [IMAGE.replace('class="blurred-img"', 'class="blurred-img rounded"'), IMAGE],
    check: (r) => r.wrappers.join(',') === 'blurred-img loaded,flex flex-col,blurred-img loaded,flex flex-col' ? [] : [`wrappers: ${r.wrappers.join(',')}`],
  }],
  // After a morph that replaced the nodes (no memory on them), `loaded` put back by the site's script stays on the next keystroke.
  ['after a morph: `loaded` re-added by the page survives the next paint', {
    path: IMAGE_PATH, live: live(li('A', ' data-sve-component-focused=""') + li('B', ' data-sve-component-focused=""')),
    states: [IMAGE, IMAGE.replace('class="blurred-img"', 'class="blurred-img rounded"')],
    morphThen: IMAGE.replace('class="blurred-img"', 'class="blurred-img rounded-md"'),
    check: (r) => r.wrappers.join(',') === 'blurred-img rounded-md loaded,flex flex-col,blurred-img rounded-md loaded,flex flex-col' ? [] : [`wrappers: ${r.wrappers.join(',')}`],
  }],
];

const browser = await puppeteer.launch({ headless: true, executablePath: CHROME, args: ['--allow-file-access-from-files'] });
const tab = await browser.newPage();
tab.on('pageerror', (e) => console.log('  pageerror:', String(e).slice(0, 200)));
let ok = true;

for (const [label, o] of scenarios) {
  await tab.goto(`file://${OUT}`);
  const r = await tab.evaluate(async (o, row) => {
    const dock = document.getElementById('__sve-code-dock');
    try { localStorage.setItem('sveInstantPreview', 'astro'); } catch { /* file:// */ }
    dock.querySelector('[data-sve-code-path]').textContent = o.path;
    dock.__sveHtmlScope = null;
    window.__paneCss = '';
    const iframe = document.getElementById('live-preview-iframe');
    iframe.srcdoc = o.live;
    await new Promise((r) => iframe.addEventListener('load', r, { once: true }));
    const idoc = iframe.contentDocument;
    window.__emit('publish-container-created', { name: 'entry', values: { page_sections: [row] } });
    window.__sveInstantTrace = [];
    const type = async (html) => { window.__paneHtml = html; dock.dispatchEvent(new Event('input', { bubbles: true })); await new Promise((r) => setTimeout(r, 60)); };
    for (const state of o.states) await type(state);
    if (o.morphThen) {
      // The server's render replaces every card (fresh nodes), the site's script puts `loaded` back, then one more keystroke.
      const ul = idoc.querySelector('ul');
      ul.innerHTML = ul.innerHTML;
      idoc.querySelectorAll('.blurred-img').forEach((el) => el.classList.add('loaded'));
      iframe.contentWindow.dispatchEvent(new CustomEvent('statamic:preview-updated'));
      await new Promise((r) => setTimeout(r, 60));
      await type(o.morphThen);
    }
    return {
      wrappers: [...idoc.querySelectorAll('.flex.items-center > div')].map((d) => d.className),
      imgs: [...idoc.querySelectorAll('img')].map((d) => d.className),
      trace: window.__sveInstantTrace.slice(),
    };
  }, o, ROW);
  const problems = o.check(r);
  const pass = problems.length === 0;
  ok = ok && pass;
  console.log(`${pass ? 'ok ' : 'FAIL'} ${label}`);
  if (!pass) console.log('  ' + problems.join('\n  ') + '\n  trace: ' + r.trace.map((t) => String(t).replace(/^\d+ /, '').slice(0, 90)).join(' | '));
}
await browser.close();
console.log(ok ? '\nPASS' : '\nFAIL');
process.exit(ok ? 0 : 1);
