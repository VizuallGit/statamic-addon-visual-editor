// Static markup typed beside a field: the owner's intro_2 section (a Bard
// field that draws its own heading and paragraphs, and a static <div> next to
// it), painted by dock-instant-preview.js without the Control Panel.
//
// Measured 25 Sep 2026 on the demo site: a <p> typed next to `{{ text }}` put
// its text into the field's own paragraph, an <h1> replaced the field's
// heading, and after the morph the paragraph stood twice. Every scenario here
// asserts the field's output is untouched, the new tag stands where it was
// typed, and a paint after the morph adds nothing. Seconds, no login.
//
//   node tests/browser/instant-field-neighbour.mjs
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync } from 'node:fs';

const SITE = process.env.SVE_SITE_DIR || '/Users/flemmingmeyer/Sites/vizuall-skabelon';
const ADDON = new URL('../..', import.meta.url).pathname.replace(/\/$/, '');
const DIR = new URL('.', import.meta.url).pathname;
const puppeteer = createRequire(`${SITE}/package.json`)('puppeteer');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const TEMPLATE = readFileSync(`${DIR}/fixtures/intro_2.antlers.html`, 'utf8');
const page = readFileSync(`${DIR}/instant-harness.html`, 'utf8').replace('SCRIPT_SRC', `file://${ADDON}/resources/js/dock-instant-preview.js`);
const OUT = `${DIR}/instant-harness.out.html`;
writeFileSync(OUT, page);

const ROW = { id: 'mu2intro0001', _visual_id: 'mu2intro0001-mu2intro0002', enabled: true, type: 'intro/intro_2', text: [{ type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'Strategisk branding' }] }, { type: 'paragraph', content: [{ type: 'text', text: 'fdsfdsfgfdgfdg' }] }], media: 'x.jpg' };
/** What the Bard field draws. */
const FIELD = '<h1>Strategisk branding</h1><p>fdsfdsfgfdgfdg</p>';
const PATH = 'resources/views/partials/page_sections/intro/intro_2.antlers.html';

/** The section as the server renders it: the field drawn, the tags gone, the if resolved to an <img>. */
function render(tpl, { video = false } = {}) {
  return tpl
    .replace(/\{\{#[\s\S]*?#\}\}/g, '')
    .replace(/\{\{\s*id\s*\}\}/g, ROW.id)
    .replace(/aria-label="[^"]*"/, 'aria-label="Strategisk branding"')
    .replace(/\{\{\s*visual_edit outline_inside[^}]*\}\}/g, `data-sid="${ROW._visual_id}" data-sid-section-orderable="true" data-sid-outline-inside="true"`)
    .replace(/\{\{\s*visual_edit inline_edit[^}]*\}\}/g, 'data-sid-field="text" data-sid-inline-edit="true"')
    .replace(/\{\{\s*text\s*\}\}/g, FIELD)
    .replace(/\{\{\s*if \(media[\s\S]*?\{\{\s*\/if\s*\}\}/g, video ? '<video class="flow-space-500" src="x.mp4" autoplay muted playsinline></video>' : '<img src="/x.jpg" class="flow-space-500">')
    .replace(/\{\{[\s\S]*?\}\}/g, '');
}

const afterText = (extra) => TEMPLATE.replace('{{ text  }}\n', `{{ text  }}\n${extra}\n`);
const afterDiv = (extra) => TEMPLATE.replace('<div>dfsfjdgfdggfdggf</div>\n', `<div>dfsfjdgfdggfdggf</div>\n${extra}\n`);
const STATIC = '<div>dfsfjdgfdggfdggf</div>';

// [label, { next, live?, first?, expect }] — `expect` is the field div's children, tags and text, after the edit.
const scenarios = [
  ['<p> after the static div (the screenshot)', { next: afterDiv('    <p>fcdsfds</p>'), expect: `${FIELD}${STATIC}<p>fcdsfds</p>` }],
  ['<p> right after {{ text }}', { next: afterText('    <p>fcdsfds</p>'), expect: `${FIELD}<p>fcdsfds</p>${STATIC}` }],
  ['<h1> right after {{ text }}: the field’s heading stays', { next: afterText('    <h1>Ny overskrift</h1>'), expect: `${FIELD}<h1>Ny overskrift</h1>${STATIC}` }],
  ['<div class="x"> right after {{ text }}: the static div keeps its text', { next: afterText('    <div class="x">ny</div>'), expect: `${FIELD}<div class="x">ny</div>${STATIC}` }],
  ['the <p> typed letter by letter: one node, growing', { next: afterDiv('    <p>fcdsfdsX</p>'), first: afterDiv('    <p>fcdsfds</p>'), live: render(afterDiv('    <p>fcdsfds</p>')), expect: `${FIELD}${STATIC}<p>fcdsfdsX</p>` }],
  ['after the morph the server has the <p> too: a paint adds nothing', { next: afterDiv('    <p>fcdsfds</p>'), first: afterDiv('    <p>fcdsfds</p>'), live: render(afterDiv('    <p>fcdsfds</p>')), expect: `${FIELD}${STATIC}<p>fcdsfds</p>` }],
  ['<h2> beside the field’s <h1>: nothing is renamed', { next: afterText('    <h2>Under</h2>'), expect: `${FIELD}<h2>Under</h2>${STATIC}` }],
  ['a class on the static div: the field is untouched', { next: TEMPLATE.replace('<div>dfsfjdgfdggfdggf</div>', '<div class="mt-500">dfsfjdgfdggfdggf</div>'), expect: `${FIELD}<div class="mt-500">dfsfjdgfdggfdggf</div>` }],
  ['a class on the field’s wrapper: the field is untouched', { next: TEMPLATE.replace('prose-p:opacity-70"', 'prose-p:opacity-70 gap-300"'), expect: `${FIELD}${STATIC}`, wrapperClass: 'gap-300' }],
  ['CSS typed in the CSS pane: the live sheet holds it, the markup is untouched', { next: TEMPLATE, css: '#id-{{ id }} { --x: 1 }\n@scope(.intro-2) { :scope { padding-block: 4rem } }', expect: `${FIELD}${STATIC}`, expectCss: ['#id-mu2intro0001 { --x: 1 }', 'padding-block: 4rem'] }],
  // Deleting again. A node the paint made goes at once; so does the server's
  // copy of it after the morph, adopted when it matched the template word for word.
  ['the typed <p> deleted again: gone at once, the field untouched', { first: afterDiv('    <p>fcdsfds</p>'), next: TEMPLATE, expect: `${FIELD}${STATIC}` }],
  ['deleted after the morph drew it: gone at once too', { first: afterDiv('    <p>fcdsfds</p>'), live: render(afterDiv('    <p>fcdsfds</p>')), next: TEMPLATE, expect: `${FIELD}${STATIC}` }],
  // Half-deleted states the parser reads differently — `</` swallows what follows as a comment — wait for the next keystroke.
  ['half-deleted `<p>f</` beside the video: nothing changes, the video stays', { first: afterText('    <p>f</p>'), live: render(afterText('    <p>f</p>'), { video: true }), next: afterText('    <p>f</'), expect: `${FIELD}<p>f</p>${STATIC}`, video: true }],
  ['half-deleted `<p>f<`: the typed paragraph shows "f<", the field is untouched, the video stays', { first: afterText('    <p>f</p>'), live: render(afterText('    <p>f</p>'), { video: true }), next: afterText('    <p>f<'), expect: `${FIELD}<p>f&lt; </p>${STATIC}`, video: true }],
  // One letter typed next to a paragraph that happens to start with it: not that paragraph.
  ['a one-letter <p>V</p> beside a field paragraph starting with V: a new node, the field untouched', { next: afterText('    <p>V</p>'), live: render(TEMPLATE).replace('fdsfdsfgfdgfdg', 'Vi hjælper virksomheder'), expect: `<h1>Strategisk branding</h1><p>Vi hjælper virksomheder</p><p>V</p>${STATIC}` }],
];

const browser = await puppeteer.launch({ headless: true, executablePath: CHROME, args: ['--allow-file-access-from-files'] });
const tab = await browser.newPage();
tab.on('pageerror', (e) => console.log('  pageerror:', String(e).slice(0, 200)));
const kids = (html) => { const m = html.match(/<div data-sid-field="text"[^>]*>([\s\S]*?)<\/div>\s*(?:<img|<video)/); return m ? m[1].replace(/\s+/g, ' ').replace(/> </g, '><').replace(/<(\w+)([^>]*)>/g, (all, tag, attrs) => `<${tag}${/class="[^"]*"/.test(attrs) ? ' ' + attrs.match(/class="[^"]*"/)[0] : ''}>`).trim() : '(no field div)'; };
let ok = true;
for (const [label, opts] of scenarios) {
  await tab.goto(`file://${OUT}`);
  const live = `<!doctype html><html><head></head><body><main>\n${opts.live || render(TEMPLATE)}\n</main></body></html>`;
  const r = await tab.evaluate(async (live, row, first, next, path, css) => {
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
    window.__paneHtml = first;
    dock.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise((r) => setTimeout(r, 80));
    window.__paneHtml = next;
    if (css != null) window.__paneCss = css;
    dock.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise((r) => setTimeout(r, 80));
    const after = idoc.querySelector('section').outerHTML;
    // The paint that follows a morph: the same pane again.
    iframe.contentWindow.dispatchEvent(new CustomEvent('statamic:preview-updated'));
    await new Promise((r) => setTimeout(r, 80));
    return { after, again: idoc.querySelector('section').outerHTML, wrapperClass: idoc.querySelector('[data-sid-field="text"]').className, liveCss: idoc.getElementById('__sve-dock-css-live')?.textContent ?? '', video: !!idoc.querySelector('section > video') };
  }, live, ROW, opts.first || TEMPLATE, opts.next, PATH, opts.css ?? null);
  const got = kids(r.after);
  const again = kids(r.again);
  let pass = got === opts.expect && again === opts.expect;
  if (opts.wrapperClass) pass = pass && r.wrapperClass.split(/\s+/).includes(opts.wrapperClass);
  if (opts.expectCss) pass = pass && opts.expectCss.every((x) => r.liveCss.includes(x));
  if (opts.video) pass = pass && r.video;
  ok = ok && pass;
  console.log(`${pass ? 'ok ' : 'FAIL'} ${label}`);
  if (!pass) console.log(`     want ${opts.expect}\n     got  ${got}\n     again ${again}${opts.wrapperClass ? `\n     wrapper class ${r.wrapperClass}` : ''}${opts.expectCss ? `\n     live css ${r.liveCss.replace(/\s+/g, ' ').slice(0, 200)}` : ''}${opts.video ? `\n     video in the section: ${r.video}` : ''}`);
}
await browser.close();
console.log(JSON.stringify({ ok }));
process.exit(ok ? 0 : 1);
