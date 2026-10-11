// Classes on a component call, painted by dock-instant-preview.js without the
// Control Panel: `{{ partial:components/x class="…" }}` hands its classes to
// whatever the component renders, and the paint puts them on that element in
// the same frame — never on the section around the call, never on another
// render beside it, and never when the element cannot be told for certain
// (that waits for the morph). Seconds, no login.
//
//   node tests/browser/instant-component-class.mjs
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

const PATH = 'resources/views/partials/page_sections/content/featured_testimonials.antlers.html';
const ROW = { id: 'ft0001', _visual_id: 'ft0001-ft0002', enabled: true, type: 'content/featured_testimonials' };

/** The component files, as /!/sve/section-template hands them to the dock. */
const FILES = {
  'components/section_heading': `<div class="flow-y flex flex-col {{ settings.sr_only ?= 'sr-only' }} {{ class }}">\n    {{ section_heading }}\n</div>`,
  'components/image': `{{ _blur = blur_load !== 'false' }}\n{{ if _blur }}<div class="blurred-img">{{ /if }}\n<img\n    {{ if _id }} id="{{ _id }}" {{ endif }}\n    class="max-w-full {{ class }}"\n    src="{{ glide :src="_src" width="{{ _w }}" }}"\n>\n{{ if _blur }}</div>{{ /if }}`,
  'components/plain': `<div class="plain-box">{{ text }}</div>`,
  'components/tag': `<span class="tag-chip {{ _class }}">{{ text }}</span>`,
};

const HEADING = (cls = '') => `{{ partial:components/section_heading${cls} }}`;
const IMAGE = (cls = ' class="size-800 rounded-full"') => `{{ partial:components/image :imagePath="profile_image" blur_load="false"${cls} }}`;

/** The section file: a heading call, then a loop whose items hold an image call in `inner`. */
function template({ heading = HEADING(), image = IMAGE(), extra = '', inner = '', meta = 'div' } = {}) {
  return `<section id="id-{{ id }}" class="wrapper py-1000" {{ visual_edit outline_inside="true" section_orderable="true" }}>
  ${heading}${extra}
  <ul class="grid grid-cols-3">
    {{ entries }}
    <li class="card">
      <div class="flex items-center">
        ${image}${inner}
        <${meta} class="flex flex-col"><b>{{ name }}</b></${meta}>
      </div>
    </li>
    {{ /entries }}
  </ul>
</section>`;
}

/**
 * The section as the server renders it. `img` is the image call's output
 * (blur wraps it, stamped as the bridge stamps a component root), `beside` is
 * what else renders next to it in each item.
 */
function render({ heading = 'flow-y flex flex-col', image = 'size-800 rounded-full', twoHeadings = false, plain = false, blur = false, beside = '', tag = '', meta = 'div' } = {}) {
  const h = `<div class="${heading}">Hvad siger kunderne</div>`;
  const img = (name) => `<img class="max-w-full${image ? ` ${image}` : ''}" src="/${name}.jpg">`;
  const out = (name) => (blur ? `<div class="blurred-img" data-sve-component-src="components/image">${img(name)}</div>` : img(name));
  const li = (name) => `<li class="card"><div class="flex items-center">${out(name)}${beside}<${meta} class="flex flex-col"><b>${name}</b></${meta}></div></li>`;

  return `<section id="id-${ROW.id}" class="wrapper py-1000" data-sid="${ROW._visual_id}" data-sid-section-orderable="true">
  ${h}${twoHeadings ? h : ''}${plain ? '<div class="plain-box">x</div>' : ''}${tag}
  <ul class="grid grid-cols-3">${li('Anna')}${li('Bo')}${li('Carl')}</ul>
</section>`;
}

// Each scenario is a list of steps run in the page, then checks on what was read.
//   ['pane', html]   the dock's HTML pane says this (an input event → a paint)
//   ['hover', d]     the strip list is on a class (`sve:tw-preview`), null = it left
//   ['mode', m]      Instant ('astro') or '1 s' ('morph')
//   ['morph', live]  the server's render replaces the section, then preview-updated
//   ['updated']      preview-updated with the DOM as it is
//   ['wait', ms]     ['read', name]
const S = {
  first: (html) => ['pane', html],
  edit: (html) => ['pane', html],
};
const scenarios = [
  ['first class on the heading call: on the heading div at once, the section untouched', {
    live: render(), steps: [S.first(template()), S.edit(template({ heading: HEADING(' class="mt-400"') })), ['read', 'a'], ['updated'], ['read', 'b']],
    check: { a: { heading: 'flow-y flex flex-col mt-400' }, b: { heading: 'flow-y flex flex-col mt-400' } },
  }],
  ['a second class: added, the first stays', {
    live: render({ heading: 'flow-y flex flex-col mt-400' }), steps: [S.first(template({ heading: HEADING(' class="mt-400"') })), S.edit(template({ heading: HEADING(' class="mt-400 p-200"') })), ['read', 'a']],
    check: { a: { heading: 'flow-y flex flex-col mt-400 p-200' } },
  }],
  ['a class swapped (mt-400 → mt-600)', {
    live: render({ heading: 'flow-y flex flex-col mt-400' }), steps: [S.first(template({ heading: HEADING(' class="mt-400"') })), S.edit(template({ heading: HEADING(' class="mt-600"') })), ['read', 'a']],
    check: { a: { heading: 'flow-y flex flex-col mt-600' } },
  }],
  ['the last class removed: the parameter goes, the component keeps its own', {
    live: render({ heading: 'flow-y flex flex-col mt-400' }), steps: [S.first(template({ heading: HEADING(' class="mt-400"') })), S.edit(template()), ['read', 'a']],
    check: { a: { heading: 'flow-y flex flex-col' } },
  }],
  ['a class the component has itself is never taken away (flex removed from the call)', {
    live: render({ heading: 'flow-y flex flex-col mt-400' }), steps: [S.first(template({ heading: HEADING(' class="flex mt-400"') })), S.edit(template({ heading: HEADING(' class="mt-400"') })), ['read', 'a']],
    check: { a: { heading: 'flow-y flex flex-col mt-400' } },
  }],
  ['the image in a loop: every rendered image changes, max-w-full stays', {
    live: render(), steps: [S.first(template()), S.edit(template({ image: IMAGE(' class="size-900 rounded-full"') })), ['read', 'a']],
    check: { a: { images: 'max-w-full rounded-full size-900' } },
  }],
  // The name block is a <p> here: a dynamic <div> right after a component's <div>
  // is rewritten by the structure paint itself (origin/main too) — its own issue.
  ['the image wrapped by blur (its root stamped): the image changes, the wrapper does not', {
    live: render({ blur: true, meta: 'p' }), steps: [S.first(template({ meta: 'p' })), S.edit(template({ image: IMAGE(' class="size-900 rounded-full"'), meta: 'p' })), ['read', 'a']],
    check: { a: { images: 'max-w-full rounded-full size-900', blurDivs: 'blurred-img' } },
  }],
  ['the image wrapped by blur, its root not stamped: known from the component file, the image changes', {
    live: render({ blur: true, meta: 'p' }).replace(/ data-sve-component-src="components\/image"/g, ''), steps: [S.first(template({ meta: 'p' })), S.edit(template({ image: IMAGE(' class="size-900 rounded-full"'), meta: 'p' })), ['read', 'a']],
    check: { a: { images: 'max-w-full rounded-full size-900' } },
  }],
  ['own <img> siblings of the same kind beside the call: only the call’s image changes', {
    live: render({ beside: '<img class="max-w-full badge" src="/b1.jpg"><img class="max-w-full badge2" src="/b2.jpg">' }),
    steps: [S.first(template({ inner: '\n        <img class="max-w-full badge" src="/b1.jpg"><img class="max-w-full badge2" src="/b2.jpg">' })), S.edit(template({ image: IMAGE(' class="size-900 rounded-full"'), inner: '\n        <img class="max-w-full badge" src="/b1.jpg"><img class="max-w-full badge2" src="/b2.jpg">' })), ['read', 'a']],
    check: { a: { images: 'max-w-full rounded-full size-900', badges: ['max-w-full badge', 'max-w-full badge2'] } },
  }],
  ['another partial renders the same component beside the call: only the call’s image changes', {
    live: render({ beside: '<div class="block-media"><img class="max-w-full size-800 rounded-full" src="/blk.jpg"></div>' }),
    steps: [S.first(template({ inner: '\n        {{ partial:blocks/media }}' })), S.edit(template({ image: IMAGE(' class="size-900 rounded-full"'), inner: '\n        {{ partial:blocks/media }}' })), ['read', 'a']],
    check: { a: { images: 'max-w-full rounded-full size-900', blockImages: 'max-w-full size-800 rounded-full' } },
  }],
  ['a field renders the same component bare beside the call: two candidates, nothing painted', {
    live: render({ beside: '<img class="max-w-full size-800 rounded-full" src="/field.jpg">' }),
    steps: [S.first(template({ inner: '\n        {{ text }}' })), S.edit(template({ image: IMAGE(' class="size-900 rounded-full"'), inner: '\n        {{ text }}' })), ['read', 'a']],
    check: { a: { images: 'max-w-full size-800 rounded-full' } },
  }],
  ['_class on a component that reads {{ _class }}: painted', {
    live: render({ tag: '<span class="tag-chip">Ny</span>' }),
    steps: [S.first(template({ extra: '\n  {{ partial:components/tag }}' })), S.edit(template({ extra: '\n  {{ partial:components/tag _class="mt-400" }}' })), ['read', 'a']],
    check: { a: { tag: 'tag-chip mt-400' } },
  }],
  ['the same component called twice: nothing painted, the morph decides', {
    live: render({ twoHeadings: true }), steps: [S.first(template({ extra: `\n  ${HEADING()}` })), S.edit(template({ heading: HEADING(' class="mt-400"'), extra: `\n  ${HEADING()}` })), ['read', 'a']],
    check: { a: { heading: 'flow-y flex flex-col', headings: 2 } },
  }],
  ['a component that reads no {{ class }}: nothing painted', {
    live: render({ plain: true }), steps: [S.first(template({ extra: '\n  {{ partial:components/plain }}' })), S.edit(template({ extra: '\n  {{ partial:components/plain class="mt-400" }}' })), ['read', 'a']],
    check: { a: { heading: 'flow-y flex flex-col', plain: 'plain-box' } },
  }],
  ['a bound :class is Antlers, not classes: nothing painted', {
    live: render(), steps: [S.first(template()), S.edit(template({ heading: HEADING(' :class="heading_class"') })), ['read', 'a']],
    check: { a: { heading: 'flow-y flex flex-col' } },
  }],
  ['a call added in the same edit: the list of calls moved, so it waits', {
    live: render(), steps: [S.first(template()), S.edit(template({ heading: HEADING(' class="mt-400"'), extra: '\n  {{ partial:components/plain }}' })), ['read', 'a']],
    check: { a: { heading: 'flow-y flex flex-col' } },
  }],
  ['the class picked before the component’s file arrived: painted when it does', {
    live: render(), slow: 400, steps: [S.first(template()), S.edit(template({ heading: HEADING(' class="mt-400"') })), ['wait', 600], ['read', 'a']],
    check: { a: { heading: 'flow-y flex flex-col mt-400' } },
  }],
  ['two edits before the file arrived: the first value is still taken off', {
    live: render({ heading: 'flow-y flex flex-col a-1' }), slow: 500,
    steps: [S.first(template({ heading: HEADING(' class="a-1"') })), S.edit(template({ heading: HEADING(' class="mt-4"') })), S.edit(template({ heading: HEADING(' class="mt-40"') })), ['wait', 700], ['read', 'a']],
    check: { a: { heading: 'flow-y flex flex-col mt-40' } },
  }],
  ['the file’s first fetch failed (a server error): asked again, and the class paints', {
    live: render(), fail: 1, steps: [S.first(template()), S.edit(template({ heading: HEADING(' class="mt-400"') })), ['wait', 200], ['read', 'a']],
    check: { a: { heading: 'flow-y flex flex-col mt-400' } },
  }],
  ['hover in the strip list: held on the heading, gone again when the list leaves', {
    live: render(), steps: [S.first(template()), S.edit(template()), ['hover', { component: 'components/section_heading', param: 'class', old: '', value: 'mt-400' }], ['read', 'held'], ['hover', null], ['read', 'a']],
    check: { held: { heading: 'flow-y flex flex-col mt-400' }, a: { heading: 'flow-y flex flex-col' } },
  }],
  ['a hold across a preview update: leaving the list still takes the class back', {
    live: render(), suggestOpen: true, steps: [S.first(template()), S.edit(template()), ['hover', { component: 'components/section_heading', param: 'class', old: '', value: 'mt-400' }], ['updated'], ['read', 'held'], ['hover', null], ['read', 'a']],
    check: { held: { heading: 'flow-y flex flex-col mt-400' }, a: { heading: 'flow-y flex flex-col' } },
  }],
  ['a scoped slice with no file around it: the strip list holds nothing (no guessed element)', {
    live: render(), scopedSnippet: true,
    steps: [['pane', `<div class="flex items-center">\n  ${IMAGE()}\n</div>`],
      ['hover', { component: 'components/image', param: 'class', old: 'size-800 rounded-full', value: 'size-800 rounded-full opacity-50' }], ['wait', 100],
      ['hover', { component: 'components/image', param: 'class', old: 'size-800 rounded-full', value: 'size-800 rounded-full opacity-40' }], ['read', 'a']],
    check: { a: {} },
  }],
  ['“1 s” in between: after the morph and back to Instant, the server’s classes are not swapped off', {
    live: render({ heading: 'flow-y flex flex-col sr-only mt-400' }),
    steps: [S.first(template({ heading: HEADING(' class="sr-only mt-400"') })), ['mode', 'morph'], S.edit(template({ heading: HEADING(' class="mt-400"') })),
      ['morph', render({ heading: 'flow-y flex flex-col sr-only mt-400' })], ['mode', 'astro'], S.edit(template({ heading: HEADING(' class="mt-400"') }) + ' '), ['read', 'a']],
    check: { a: { heading: 'flow-y flex flex-col sr-only mt-400' } },
  }],
];

const browser = await puppeteer.launch({ headless: true, executablePath: CHROME, args: ['--allow-file-access-from-files'] });
const tab = await browser.newPage();
tab.on('pageerror', (e) => console.log('  pageerror:', String(e).slice(0, 200)));
let ok = true;
const norm = (v) => String(v).split(/\s+/).filter(Boolean).sort().join(' ');

for (const [label, opts] of scenarios) {
  await tab.goto(`file://${OUT}`);
  const live = `<!doctype html><html><head></head><body><main>\n${opts.live}\n</main></body></html>`;
  const r = await tab.evaluate(async (live, row, path, files, steps, slow, fail, suggestOpen, scopedSnippet) => {
    const dock = document.getElementById('__sve-code-dock');
    const wait = (ms) => new Promise((done) => setTimeout(done, ms));
    try { localStorage.setItem('sveInstantPreview', 'astro'); } catch { /* file:// */ }
    // The component files: what /!/sve/section-template answers on the site.
    let failures = fail;
    window.fetch = async (url) => {
      const src = decodeURIComponent(String(url).split('type=')[1] || '').replace('view:partials/', '');
      if (slow) await wait(slow);
      if (failures > 0 && src in files) { failures--; return { ok: false, status: 500, json: async () => ({}) }; }
      return { ok: src in files, status: src in files ? 200 : 404, json: async () => ({ html: files[src] }) };
    };
    // The strip list open (the paint keeps a hold across a paint only then).
    if (suggestOpen) { const el = document.createElement('div'); el.id = '__sve-tw-menu'; el.innerHTML = '<input data-sve-tw-add-input>'; document.body.appendChild(el); }
    dock.querySelector('[data-sve-code-path]').textContent = path;
    dock.__sveHtmlScope = null;
    // A scoped pane whose file the dock does not expose.
    if (scopedSnippet) dock.setAttribute('data-sve-html-scoped', '');
    window.__paneCss = '';
    const iframe = document.getElementById('live-preview-iframe');
    iframe.srcdoc = live;
    await new Promise((done) => iframe.addEventListener('load', done, { once: true }));
    const idoc = iframe.contentDocument;
    const read = () => ({
      section: idoc.querySelector('section').getAttribute('class'),
      headings: idoc.querySelectorAll('.flow-y').length,
      headingClasses: [...idoc.querySelectorAll('.flow-y')].map((el) => el.getAttribute('class')),
      images: [...idoc.querySelectorAll('li img')].filter((el) => !/\/(b1|b2|blk|field)\.jpg$/.test(el.getAttribute('src'))).map((el) => el.getAttribute('class')),
      badges: [...idoc.querySelectorAll('li img[src="/b1.jpg"], li img[src="/b2.jpg"]')].slice(0, 2).map((el) => el.getAttribute('class')),
      blockImages: [...idoc.querySelectorAll('.block-media img')].map((el) => el.getAttribute('class')),
      blurDivs: [...idoc.querySelectorAll('[data-sve-component-src]')].map((el) => el.getAttribute('class')),
      plain: idoc.querySelector('.plain-box')?.getAttribute('class') ?? '',
      tag: idoc.querySelector('.tag-chip')?.getAttribute('class') ?? '',
    });
    window.__emit('publish-container-created', { name: 'entry', values: { page_sections: [row] } });
    const reads = {};
    for (const [kind, arg] of steps) {
      if (kind === 'pane') { window.__paneHtml = arg; dock.dispatchEvent(new Event('input', { bubbles: true })); await wait(120); }
      if (kind === 'hover') { document.dispatchEvent(new CustomEvent('sve:tw-preview', { detail: arg })); await wait(40); }
      if (kind === 'mode') { try { localStorage.setItem('sveInstantPreview', arg); } catch { /* file:// */ } }
      if (kind === 'morph') { idoc.querySelector('section').outerHTML = arg; iframe.contentWindow.dispatchEvent(new CustomEvent('statamic:preview-updated')); await wait(120); }
      if (kind === 'updated') { iframe.contentWindow.dispatchEvent(new CustomEvent('statamic:preview-updated')); await wait(120); }
      if (kind === 'wait') await wait(arg);
      if (kind === 'read') reads[arg] = read();
    }
    return { reads, trace: (window.__sveInstantTrace || []).filter((line) => / call: /.test(line)).map((line) => line.replace(/^\d+ /, '')) };
  }, live, ROW, PATH, FILES, opts.steps, opts.slow || 0, opts.fail || 0, !!opts.suggestOpen, !!opts.scopedSnippet);

  let pass = true;
  const problems = [];
  for (const [name, want] of Object.entries(opts.check)) {
    const got = r.reads[name];
    if (!got) { pass = false; problems.push(`${name}: not read`); continue; }
    const fail = (what) => { pass = false; problems.push(`${name}.${what}`); };
    if (got.section !== 'wrapper py-1000') fail(`section=${got.section}`);
    if (want.heading && !got.headingClasses.every((c) => norm(c) === norm(want.heading))) fail(`heading=${JSON.stringify(got.headingClasses)}`);
    if (want.headings && got.headings !== want.headings) fail(`headings=${got.headings}`);
    if (!want.heading && !got.headingClasses.every((c) => norm(c) === norm('flow-y flex flex-col'))) fail(`heading=${JSON.stringify(got.headingClasses)}`);
    const wantImages = want.images || 'max-w-full size-800 rounded-full';
    if (got.images.length !== 3 || !got.images.every((c) => norm(c) === norm(wantImages))) fail(`images=${JSON.stringify(got.images)}`);
    if (want.badges && JSON.stringify(got.badges) !== JSON.stringify(want.badges)) fail(`badges=${JSON.stringify(got.badges)}`);
    if (want.blockImages && !got.blockImages.every((c) => norm(c) === norm(want.blockImages))) fail(`blockImages=${JSON.stringify(got.blockImages)}`);
    if (want.blurDivs && !got.blurDivs.every((c) => norm(c) === norm(want.blurDivs))) fail(`blurDivs=${JSON.stringify(got.blurDivs)}`);
    if (want.plain && got.plain !== want.plain) fail(`plain=${got.plain}`);
    if (want.tag && norm(got.tag) !== norm(want.tag)) fail(`tag=${got.tag}`);
  }
  ok = ok && pass;
  console.log(`${pass ? 'ok ' : 'FAIL'} ${label}`);
  if (!pass) console.log(`     ${problems.join('\n     ')}\n     trace ${JSON.stringify(r.trace)}`);
}

await browser.close();
console.log(JSON.stringify({ ok }));
process.exit(ok ? 0 : 1);
