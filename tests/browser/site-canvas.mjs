#!/usr/bin/env node
/**
 * Site canvas — the site's templates and pages on one canvas in Live Preview.
 *
 * Proves, in a real Live Preview, what the owner asked for: the button is in
 * the top bar; closed, the canvas costs nothing (no chunk fetched, no layer,
 * no extra iframe); open, there is one frame per template and per page, in
 * two groups, each one line of frames — the templates in clusters a wide gap
 * apart, each under its collection's heading; the pages under one heading —
 * every frame 1440 wide and as tall as its page (never under the minimum,
 * nothing cut off) loaded through Live Preview without the bridge, the frame
 * of the entry being edited wearing the ring; the open is at 50 % from the
 * sheet's top-left corner with only the near frames loading, and «Fit all»
 * fits everything into the pane; zoom (buttons, the plain + and - keys — which
 * closed are the preview's own zoom — and ctrl/cmd + wheel round the pointer) and pan (drag,
 * wheel) work and a pan opens nothing; Escape and the button close it and
 * leave the editor exactly as it was (the preview frame's src, transform and
 * window, the iframe count, the listeners); the breakpoint overview and the
 * canvas are one state at a time; and a click on a frame lands in the normal
 * editing of that entry, where the canvas then rings that frame.
 *
 * Measures, does not assume: "visible" is a box, a display and a hit test;
 * clicks are real mouse clicks at page coordinates; the time from the click
 * to the layer, to the frames drawn and to their pages painted is reported.
 *
 * Same env vars as live-preview-smoke.mjs (SVE_PASS is required). SVE_WORKTREE=1
 * serves this checkout's build into the Control Panel. The site itself says
 * what it runs: the manifest the CP loads is fetched from SVE_SITE_URL, and
 * whether the installed PHP knows the feature is read off the Control Panel's
 * own config after login — nothing is inferred from local vendor files, so a
 * run against another site (the demo) proves that site.
 *
 * The feature ships off. Until `composer update`, the installed PHP knows
 * neither the flag nor the endpoint; with SVE_WORKTREE=1 the run then (a)
 * turns the flag on in the Control Panel's config as the owner's toggle would
 * and (b) answers /!/sve/site-canvas with what this checkout's controller
 * returns for the site (site-canvas-payload.php, run once in PHP: in
 * SVE_SITE_DIR for the local site, or over ssh for a remote one — SVE_SSH is
 * the host, SVE_REMOTE_DIR the site's directory there; the script, the
 * controller and the lang files are copied to a scratch directory on the
 * server and removed again). The frames still load the real Live Preview
 * documents those URLs name, through the installed PHP. Once the installed
 * PHP knows the feature, neither seam is used: the toggle must be on in
 * Addons › Visual Editor, and the real endpoint answers.
 *
 * SVE_NO_PREFS_WRITES=1 answers every write to /!/sve/chrome-prefs here, so a
 * run on a real person's account (the demo's admin) changes no layout of theirs.
 *
 *   cd ~/Sites/vizuall-skabelon && SVE_PASS='…' SVE_WORKTREE=1 \
 *     node ~/Sites/statamic-addon-visual-editor-vue/tests/browser/site-canvas.mjs
 *
 *   … SVE_SITE_URL=https://vizuall-demo.vizdev.dk SVE_USER=admin@vizuall-demo.vizdev.dk \
 *     SVE_ENTRY=/cp/collections/pages/entries/home SVE_SSH=ploi@vizuall-demo.vizdev.dk \
 *     SVE_REMOTE_DIR=/home/ploi/vizuall-demo.vizdev.dk SVE_NO_PREFS_WRITES=1 SVE_WORKTREE=1 SVE_PASS='…' \
 *     node ~/Sites/statamic-addon-visual-editor-vue/tests/browser/site-canvas.mjs
 */
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, unlinkSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { serveWorktreeBuild } from './serve-worktree.mjs';

const env = (key, fallback) => process.env[key] || fallback;
const SITE_DIR = env('SVE_SITE_DIR', `${process.env.HOME}/Sites/vizuall-skabelon`);
const SITE_URL = env('SVE_SITE_URL', 'http://vizuall-skabelon.test').replace(/\/+$/, '');
const USER = env('SVE_USER', 'claude-test@vizuall.dk');
const PASS = env('SVE_PASS', '');
const ENTRY = env('SVE_ENTRY', '/cp/collections/pages/entries/68f56034-ce7c-4d33-b15d-da7fa7675662');
const CHROME = env('SVE_CHROME', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome');
const ADDON_DIR = env('SVE_ADDON_DIR', `${process.env.HOME}/Sites/statamic-addon-visual-editor-vue`);
const WORKTREE = env('SVE_WORKTREE', '') === '1';
const BUILD_DIR = env('SVE_BUILD_DIR', `${ADDON_DIR}/resources/dist/build`);
// A remote site: where to run this checkout's controller for the list, when the installed PHP cannot.
const SSH = env('SVE_SSH', '');
const REMOTE_DIR = env('SVE_REMOTE_DIR', '');
// The PHP the site runs under there (the server's `php` may be a newer CLI than its FPM).
const REMOTE_PHP = env('SVE_REMOTE_PHP', 'php');
const NO_PREFS_WRITES = env('SVE_NO_PREFS_WRITES', '') === '1';

const puppeteer = createRequire(`${SITE_DIR}/package.json`)('puppeteer');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const report = { errors: [], ok: true };
const step = (name, ok, detail = '') => { if (!ok) report.ok = false; console.log(`${ok ? 'ok ' : 'FAIL'} ${name}${detail ? ' — ' + detail : ''}`); };
const info = (name, detail = '') => console.log(`info ${name}${detail ? ' — ' + detail : ''}`);
const skip = (name, why) => console.log(`skip ${name} — ${why}`);

const LAYER = '#__sve-site-canvas';
const STYLE = '#__sve-site-canvas-style';
const BUTTON = '#__sve-toolbar button[data-tab="site_canvas"]';
const BP_LAYER = '#__sve-bp-overview';
const BP_BUTTON = '#__sve-preview-chrome [data-overview]';
const ENDPOINT = '/!/sve/site-canvas';
const ARRANGE_ENDPOINT = '/!/sve/site-canvas/arrangement';
const FRAME = { width: 1440, minHeight: 600 };
// site-canvas.js GAP and ROW_GAP: sheet pixels between a row's frames, and between two rows (clusters) on a line.
const GAP = 96;
const ROW_GAP = 288;
// site-canvas.js LOAD_AT_ONCE: frames whose page is on its way at the same time.
const LOAD_AT_ONCE = 4;

if (!PASS) {
  console.log('FAIL SVE_PASS is required — the login would fail silently and every step with it');
  process.exit(1);
}

// The manifest the site's Control Panel loads — the site's own, fetched, not a local copy's.
const installedManifestFile = `${tmpdir()}/sve-site-canvas-installed-manifest-${process.pid}.json`;
{
  const res = await fetch(`${SITE_URL}/vendor/visual-editor/build/manifest.json`);
  if (!res.ok) { console.log(`FAIL the site's manifest could not be fetched: ${res.status} ${SITE_URL}/vendor/visual-editor/build/manifest.json`); process.exit(1); }
  writeFileSync(installedManifestFile, await res.text());
}
const installedManifest = JSON.parse(readFileSync(installedManifestFile, 'utf8'));
const installedAddonHash = Object.values(installedManifest).find((e) => e.isEntry && /^assets\/addon-/.test(e.file))?.file || '?';

// The entry is only looked at: nothing is saved, nothing on disk may change (checked for the local site).
const ENTRY_ID = ENTRY.split('/').pop();
const md5 = (path) => (existsSync(path) ? createHash('md5').update(readFileSync(path)).digest('hex') : '');
const LOCAL_SITE = existsSync(`${SITE_DIR}/vendor/autoload.php`) && !SSH;
const entryFile = (() => {
  if (!LOCAL_SITE) return '';
  try {
    const dir = `${SITE_DIR}/content/collections/pages`;

    return readdirSync(dir).map((f) => `${dir}/${f}`).find((f) => f.endsWith('.md') && readFileSync(f, 'utf8').includes(ENTRY_ID)) || '';
  } catch {
    return '';
  }
})();

/** This checkout's controller run for the site: in PHP here, or on the server over ssh. */
function payloadFromCheckout() {
  const script = 'tests/browser/site-canvas-payload.php';
  if (!SSH) {
    return JSON.parse(execFileSync('php', [`${ADDON_DIR}/${script}`, SITE_DIR, USER, SITE_URL], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] }));
  }
  if (!REMOTE_DIR) throw new Error('SVE_REMOTE_DIR is required with SVE_SSH');
  const scratch = `/tmp/sve-site-canvas-${process.pid}`;
  const files = [script, 'src/Http/Controllers/SiteCanvasController.php', 'resources/lang/da/messages.php', 'resources/lang/en/messages.php'];
  const tar = execFileSync('tar', ['-C', ADDON_DIR, '-cf', '-', ...files]);
  execFileSync('ssh', [SSH, `rm -rf ${scratch} && mkdir -p ${scratch} && tar -C ${scratch} -xf -`], { input: tar, stdio: ['pipe', 'inherit', 'inherit'] });
  try {
    const out = execFileSync('ssh', [SSH, `cd ${scratch} && ${REMOTE_PHP} ${script} ${JSON.stringify(REMOTE_DIR)} ${JSON.stringify(USER)} ${JSON.stringify(SITE_URL)}`], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] });
    return JSON.parse(out);
  } finally {
    execFileSync('ssh', [SSH, `rm -rf ${scratch}`], { stdio: 'ignore' });
  }
}

// --- helpers (the breakpoint overview test's, trimmed) --------------------------------

async function waitIn(frame, selector, ms) { try { await frame.waitForSelector(selector, { timeout: ms }); return true; } catch { return false; } }

async function until(fn, ms, every = 100) {
  const t0 = Date.now();
  let value = await fn().catch(() => null);
  while (!value && Date.now() - t0 < ms) { await sleep(every); value = await fn().catch(() => null); }
  return value;
}

/** Page-level box of the first visible match, adding every parent iframe's offset. */
async function absoluteRect(frame, selector) {
  const rect = await frame.evaluate((sel) => {
    for (const el of document.querySelectorAll(sel)) {
      const r = el.getBoundingClientRect();
      if (r.width > 0 && r.height > 0 && r.right > 0 && r.bottom > 0 && r.left < innerWidth && r.top < innerHeight) return { x: r.x, y: r.y, w: r.width, h: r.height };
    }
    return null;
  }, selector);
  if (!rect) throw new Error(`no visible element for ${selector}`);
  for (let f = frame; f.parentFrame(); f = f.parentFrame()) { const box = await (await f.frameElement()).boundingBox(); rect.x += box.x; rect.y += box.y; }
  return rect;
}

async function realClick(page, frame, selector) {
  const r = await absoluteRect(frame, selector);
  await page.mouse.click(r.x + r.w / 2, r.y + Math.min(r.h / 2, 300));
  return r;
}

/** Is it on screen: a box, displayed, visible, and what a click at its centre hits. */
async function visible(frame, selector) {
  return frame.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return { ok: false, why: 'not in the DOM' };
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    const top = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
    const hit = !!top && (top === el || el.contains(top));
    return { ok: r.width > 0 && r.height > 0 && cs.display !== 'none' && cs.visibility !== 'hidden' && Number(cs.opacity) > 0 && hit, why: `${Math.round(r.width)}x${Math.round(r.height)} at ${Math.round(r.x)},${Math.round(r.y)} display=${cs.display} visibility=${cs.visibility} opacity=${cs.opacity} hit=${hit ? 'itself' : top ? top.tagName.toLowerCase() + '.' + top.className : 'nothing'}` };
  }, selector);
}

function seedLayoutPrefs(prefs) {
  const file = `${SITE_DIR}/users/${USER}.yaml`;
  if (!LOCAL_SITE || NO_PREFS_WRITES || !existsSync(file)) return;
  let yaml = readFileSync(file, 'utf8').replace(/^  sve_chrome:[^\n]*\n(?:    .*\n)*/m, '');
  const entries = Object.entries(prefs || {});
  if (entries.length) {
    const block = `  sve_chrome:\n${entries.map(([k, v]) => `    ${k}: '${String(v).replace(/'/g, "''")}'\n`).join('')}`;
    yaml = /^preferences:\n/m.test(yaml) ? yaml.replace(/^preferences:\n/m, `preferences:\n${block}`) : `${yaml.replace(/\n*$/, '\n')}preferences:\n${block}`;
  }
  writeFileSync(file, yaml);
}

/** The canvas as it stands: zoom, sizer, scroll, headings, items (screen boxes), the current one. */
const canvasShape = (layerSel) => {
  const layer = document.querySelector(layerSel);
  if (!layer) return null;
  const scroller = layer.querySelector('.sve-sc-scroll');
  const sizer = layer.querySelector('.sve-sc-sizer');
  const sheet = layer.querySelector('.sve-sc-sheet');
  const z = new DOMMatrix(getComputedStyle(sheet).transform).a;
  const sr = sheet.getBoundingClientRect();
  const vr = scroller.getBoundingClientRect();
  return {
    z,
    label: layer.querySelector('[data-sc-zoom="label"]')?.textContent || '',
    scroll: [scroller.scrollLeft, scroller.scrollTop],
    client: [scroller.clientWidth, scroller.clientHeight],
    scrollSize: [scroller.scrollWidth, scroller.scrollHeight],
    sizer: [sizer.offsetWidth, sizer.offsetHeight],
    room: [sheet.offsetLeft, sheet.offsetTop],
    sheetOrigin: [sr.x, sr.y],
    // The sheet on screen (its transform in), and the view it is seen through. A fit fills the view above the zoom bar's strip.
    sheet: { x: sr.x, y: sr.y, w: sr.width, h: sr.height },
    view: { x: vr.x, y: vr.y, w: scroller.clientWidth, h: scroller.clientHeight },
    fit: { x: vr.x, y: vr.y, w: scroller.clientWidth, h: scroller.clientHeight - Math.max(0, layer.clientHeight - layer.querySelector('.sve-sc-zoom').offsetTop) },
    bar: (() => { const b = layer.querySelector('.sve-sc-zoom').getBoundingClientRect(); return { x: b.x, y: b.y, w: b.width, h: b.height }; })(),
    scrollbars: [scroller.offsetWidth - scroller.clientWidth, scroller.offsetHeight - scroller.clientHeight],
    heads: [...layer.querySelectorAll('.sve-sc-head')].map((h) => ({ kind: h.dataset.kind, text: h.textContent, x: h.getBoundingClientRect().x, y: h.getBoundingClientRect().y, size: parseFloat(getComputedStyle(h).fontSize) * z })),
    items: [...layer.querySelectorAll('.sve-sc-item')].map((item) => {
      const r = item.getBoundingClientRect();
      const frame = item.querySelector('iframe');
      const hit = item.querySelector('.sve-sc-hit');
      const top = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
      return { id: item.dataset.id, title: item.querySelector('.sve-sc-title')?.textContent || '', note: item.querySelector('.sve-sc-note')?.textContent || '', current: item.hasAttribute('data-current'), x: r.x, y: r.y, w: r.width, h: r.height, src: frame?.getAttribute('src') || '', hitOnTop: top === hit, hitOn: top ? `${top.tagName.toLowerCase()}${top.className ? '.' + String(top.className).split(' ')[0] : ''}` : 'nothing', labelSize: parseFloat(getComputedStyle(item.querySelector('.sve-sc-label')).fontSize) * z };
    }),
    iframes: document.querySelectorAll('iframe').length,
    pressed: document.querySelector('#__sve-toolbar button[data-tab="site_canvas"]')?.getAttribute('aria-pressed'),
    // Lit as every other icon in the row is: paintLpActiveControl's flat primary, not 'transparent'.
    on: ((b) => !!b && b.style.background !== '' && b.style.background !== 'transparent')(document.querySelector('#__sve-toolbar button[data-tab="site_canvas"]')),
    empty: layer.querySelector('.sve-sc-empty')?.hidden,
  };
};

/** No two of these boxes share area. */
const overlaps = (items) => {
  const out = [];
  for (let i = 0; i < items.length; i++) for (let j = i + 1; j < items.length; j++) {
    const a = items[i]; const b = items[j];
    if (a.x < b.x + b.w - 0.5 && b.x < a.x + a.w - 0.5 && a.y < b.y + b.h - 0.5 && b.y < a.y + a.h - 0.5) out.push(`${a.title}×${b.title}`);
  }
  return out;
};

// --- run ---------------------------------------------------------------------------

const PREFS = process.env.SVE_PREFS ? JSON.parse(process.env.SVE_PREFS) : { 'sve-lp-panel-mode': 'show' };
seedLayoutPrefs(PREFS);
info('layout prefs', LOCAL_SITE && !NO_PREFS_WRITES ? JSON.stringify(PREFS) : 'left as the account has them');
info('site', `${SITE_URL} — installed addon.js ${installedAddonHash}${SSH ? `, list from ${SSH}:${REMOTE_DIR}` : ''}`);
const entryBefore = md5(entryFile);

// Whether the installed PHP knows the feature is the Control Panel's to say
// (`site_canvas` in its sveFeatures), read after login; until then the seam is
// not decided. With SVE_WORKTREE=1 the list is then this checkout's controller's.
let SEAM = false;
let payload = null;
const payloadFrames = (p) => (p?.groups || []).flatMap((g) => (g.rows || []).flatMap((r) => (r.columns || []).flatMap((column, ci) => (column || []).map((f, ri) => ({ ...f, group: g.key, groupTitle: g.title, row: r.key, rowTitle: r.title, column: ci, stack: ri })))));
/** A row's columns as ids. */
const payloadColumns = (row) => (row?.columns || []).map((column) => (column || []).map((f) => f.id));

const browser = await puppeteer.launch({ headless: true, executablePath: CHROME, args: ['--window-size=1440,900'], defaultViewport: { width: 1440, height: 900 } });
const page = await browser.newPage();
await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }]);
if (WORKTREE) {
  // The CP's inline `var StatamicConfig = {…}` runs through this setter. Where
  // the installed PHP predates the feature (no `site_canvas` key at all) the
  // flag is set on, as the owner's toggle would have it; where the PHP knows
  // it, the site's own toggle stands. In every document the page opens — the
  // overlay that holds the Control Panel included. `__sveSiteCanvasSeam` says
  // which it was.
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(window, 'StatamicConfig', {
      configurable: true,
      get() { return undefined; },
      set(value) {
        const features = value && typeof value === 'object' && value.sveFeatures && typeof value.sveFeatures === 'object' ? value.sveFeatures : null;
        if (features) {
          window.__sveSiteCanvasSeam = !('site_canvas' in features);
          if (window.__sveSiteCanvasSeam) features.site_canvas = true;
        }
        Object.defineProperty(window, 'StatamicConfig', { value, writable: true, configurable: true });
      },
    });
  });
}
page.on('pageerror', (e) => report.errors.push(`pageerror: ${e.message}`));
page.on('console', (m) => { if (m.type() === 'error') report.errors.push(`console: ${m.text().slice(0, 200)}`); });
page.on('response', (r) => { if (r.status() >= 500) report.errors.push(`HTTP ${r.status()} ${r.request().method()} ${r.url().replace(SITE_URL, '').slice(0, 160)}`); });
const loadedAssets = new Set();
let endpointCalls = 0;
let arrangeCalls = 0; // the canvas posting the pages' columns (the run's own restore is marked)
page.on('request', (req) => {
  const m = req.url().match(/\/(?:vendor\/visual-editor\/build|!\/sve\/build)\/assets\/([^?#]+)/);
  if (m) loadedAssets.add(m[1]);
  // The run's own look at the list (marked) is not the canvas asking.
  if (req.url().replace(SITE_URL, '').split('?')[0] === ENDPOINT && req.headers()['x-sve-test'] !== 'probe') endpointCalls++;
  if (req.url().replace(SITE_URL, '').split('?')[0] === ARRANGE_ENDPOINT && req.method() === 'POST' && req.headers()['x-sve-test'] !== 'probe') arrangeCalls++;
});
const chunkLoaded = () => [...loadedAssets].filter((f) => /^site-canvas-/.test(f));
// Which scripts each canvas frame's document loaded, by the frame that asked.
const frameScripts = new Map(); // frame url -> [script names]
page.on('request', (req) => {
  if (req.resourceType() !== 'script') return;
  const url = req.frame()?.url() || '';
  if (!/[?&]sve_view=canvas/.test(url)) return;
  if (!frameScripts.has(url)) frameScripts.set(url, []);
  frameScripts.get(url).push(req.url().split('/').pop().split('?')[0]);
});

let served = null;
// Laravel Herd injects its own AI bubble (herd-ai.js, a fixed `#herd-ai-host`)
// into every local page — the Control Panel and the frames alike. It is the
// developer machine's, not the site's, and it sits over whatever stands in
// that corner; a run proves the canvas, so it is answered with an empty
// module (an abort would be an error in every document's console).
let herdBlocked = 0;
let prefsWritesBlocked = 0;
const extra = (req) => {
  if (/\/herd-ai\.js(?:[?#]|$)/.test(req.url())) { herdBlocked++; req.respond({ status: 200, contentType: 'application/javascript', body: 'export {};' }); return true; }
  if (NO_PREFS_WRITES && req.method() !== 'GET' && req.url().includes('/!/sve/chrome-prefs')) { prefsWritesBlocked++; req.respond({ status: 200, contentType: 'application/json', body: '{"ok":true}' }); return true; }
  if (!SEAM || req.url().replace(SITE_URL, '').split('?')[0] !== ENDPOINT) return false;
  req.respond({ status: 200, contentType: 'application/json', body: JSON.stringify(payload) });
  return true;
};
if (WORKTREE) {
  served = await serveWorktreeBuild(page, { buildDir: BUILD_DIR, installedManifest: installedManifestFile, scriptsDir: `${ADDON_DIR}/resources/js`, extra });
  info('build served from', ADDON_DIR);
} else {
  await page.setRequestInterception(true);
  page.on('request', (req) => { if (!extra(req)) req.continue(); });
}
// How many canvas frames have their page on its way at once (document requests
// with sve_view=canvas, from request to response): site-canvas.js's load cap.
let loadingNow = 0;
let loadingPeak = 0;
let frameDocuments = 0;
const isCanvasDocument = (req) => req.resourceType() === 'document' && /[?&]sve_view=canvas/.test(req.url());
page.on('request', (req) => { if (isCanvasDocument(req)) { loadingNow++; frameDocuments++; loadingPeak = Math.max(loadingPeak, loadingNow); } });
page.on('requestfinished', (req) => { if (isCanvasDocument(req)) loadingNow--; });
page.on('requestfailed', (req) => { if (isCanvasDocument(req)) loadingNow--; });

// DevTools, for counting event listeners (as breakpoint-overview.mjs does).
const cdp = await page.createCDPSession();
const contexts = new Map();
cdp.on('Runtime.executionContextCreated', ({ context }) => { if (context.auxData?.isDefault) contexts.set(context.auxData.frameId, context.id); });
cdp.on('Runtime.executionContextDestroyed', ({ executionContextId }) => { for (const [frameId, id] of contexts) if (id === executionContextId) contexts.delete(frameId); });
cdp.on('Runtime.executionContextsCleared', () => contexts.clear());
await cdp.send('Runtime.enable');
const scripts = new Map();
cdp.on('Debugger.scriptParsed', ({ scriptId, url }) => scripts.set(scriptId, url));
await cdp.send('Debugger.enable');

async function listenersOn(frame, expression) {
  const contextId = contexts.get(frame._id);
  if (!contextId) throw new Error(`no execution context for frame ${frame.url().slice(0, 60)}`);
  const { result } = await cdp.send('Runtime.evaluate', { expression, contextId, objectGroup: 'sve-sc' });
  try {
    const { listeners } = await cdp.send('DOMDebugger.getEventListeners', { objectId: result.objectId, depth: 0 });
    return listeners.map((l) => ({ type: `${l.type}${l.useCapture ? '(capture)' : ''}`, script: (scripts.get(l.scriptId) || '').split('/').pop().replace(/\?.*$/, '') }));
  } finally {
    await cdp.send('Runtime.releaseObjectGroup', { objectGroup: 'sve-sc' });
  }
}
async function listenerSnapshot(cp) {
  const preview = await (await cp.$('#live-preview-iframe')).contentFrame();
  return {
    cpWindow: await listenersOn(cp, 'window'),
    cpDocument: await listenersOn(cp, 'document'),
    pane: await listenersOn(cp, "document.querySelector('.live-preview-contents')"),
    previewWindow: await listenersOn(preview, 'window'),
    previewDocument: await listenersOn(preview, 'document'),
  };
}
const ownListeners = (snapshot) => Object.fromEntries(Object.entries(snapshot).map(([key, list]) => [key, list.filter((l) => /^site-canvas-/.test(l.script)).map((l) => l.type).sort()]));

/** Open the canvas with a real click; the layer, the items and their pages timed from the click. */
async function openCanvas(cp, expectedFrames) {
  const t0 = Date.now();
  await realClick(page, cp, BUTTON);
  const layerAt = (await waitIn(cp, LAYER, 10000)) ? Date.now() - t0 : null;
  const itemsAt = (await until(() => cp.evaluate((sel, n) => document.querySelectorAll(`${sel} .sve-sc-item`).length === n, LAYER, expectedFrames), 10000, 20)) ? Date.now() - t0 : null;
  return { t0, layerAt, itemsAt };
}
/**
 * All `expected` frames have been given a src (a few at a time, the next as one
 * loads) and painted their page: a document other than about:blank, complete,
 * with a body that holds something.
 */
async function framesPainted(cp, t0, expected) {
  let firstAt = null;
  const all = await until(async () => {
    const handles = await cp.$$(`${LAYER} iframe.sve-sc-frame[src]`);
    const states = [];
    for (const h of handles) {
      const f = await h.contentFrame();
      const ok = !!f && f.url() !== 'about:blank' && (await f.evaluate(() => document.readyState === 'complete' && document.body?.children.length > 0).catch(() => false));
      states.push(ok);
    }
    if (firstAt === null && states.some(Boolean)) firstAt = Date.now() - t0;
    return handles.length === expected && states.every(Boolean) ? handles.length : null;
  }, 120000, 200);
  return { count: all, firstAt, allAt: all ? Date.now() - t0 : null };
}
/**
 * At 50 % only the frames near the view load, and a page's height can bring
 * more near: the near set is settled when every frame with a src has painted
 * its page and no frame was given a src between two looks.
 */
async function nearPainted(cp, t0) {
  let firstAt = null;
  let last = -1;
  const count = await until(async () => {
    const handles = await cp.$$(`${LAYER} iframe.sve-sc-frame[src]`);
    const states = [];
    for (const h of handles) {
      const f = await h.contentFrame();
      states.push(!!f && f.url() !== 'about:blank' && (await f.evaluate(() => document.readyState === 'complete' && document.body?.children.length > 0).catch(() => false)));
    }
    if (firstAt === null && states.some(Boolean)) firstAt = Date.now() - t0;
    const settled = handles.length > 0 && states.every(Boolean) && handles.length === last;
    last = handles.length;
    return settled ? handles.length : null;
  }, 120000, 250);
  return { count: count ?? 0, firstAt, allAt: count ? Date.now() - t0 : null };
}
async function closeByEscape(cp) {
  await page.keyboard.press('Escape');
  return until(() => cp.evaluate((sel) => !document.querySelector(sel), LAYER), 3000);
}

try {
  // 1. Log in, open the entry, open Live Preview (the overlay that holds the CP again).
  await page.goto(`${SITE_URL}/cp`, { waitUntil: 'networkidle2' });
  await page.waitForSelector('input[name="email"]', { timeout: 15000 });
  await page.type('input[name="email"]', USER);
  await page.type('input[name="password"]', PASS);
  await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle2' }), page.keyboard.press('Enter')]);
  step('login', !/login/.test(page.url()), page.url());
  await page.goto(`${SITE_URL}${ENTRY}`, { waitUntil: 'networkidle2' });
  await sleep(1500);
  if (!(await page.$('iframe.sve-edit-overlay'))) {
    await page.evaluate(() => { [...document.querySelectorAll('button, a')].find((el) => /live preview|forhåndsvisning/i.test(el.textContent || ''))?.click(); });
  }
  const opened = await waitIn(page, 'iframe.sve-edit-overlay[data-open]', 30000);
  step('Live Preview opened', opened);
  let cp = await (await page.$('iframe.sve-edit-overlay')).contentFrame();
  await page.keyboard.press('Escape'); // a trial-licence dialog takes the first click otherwise
  step('top bar built', await waitIn(cp, '#__sve-preview-chrome [data-sve-zoom]', 20000));
  const previewReady = await until(async () => {
    const f = await (await cp.$('#live-preview-iframe'))?.contentFrame();
    return f && (await f.evaluate(() => !!document.querySelector('[data-sid]'))) ? f : null;
  }, 25000, 500);
  step('the preview rendered the page', !!previewReady);
  await sleep(2500); // prefs hydrate, the device and zoom settle, the preview morphs once or twice

  const config = await cp.evaluate(() => ({
    flag: window.Statamic.$config.get('sveFeatures')?.site_canvas,
    seam: window.__sveSiteCanvasSeam === true,
    strings: !!window.Statamic.$config.get('sveStrings')?.site_canvas_button,
  }));
  SEAM = config.seam;
  info('installed PHP', SEAM ? 'predates site_canvas (no key in sveFeatures) — the flag is turned on in the CP config and the endpoint is answered from this checkout’s controller (site-canvas-payload.php) until composer update' : 'knows site_canvas — the toggle in Addons › Visual Editor must be on, and the real endpoint answers');
  if (!WORKTREE && config.flag === undefined) {
    console.log('skip the whole run — the installed addon has no site canvas and this is not a working-tree run (SVE_WORKTREE=1)');
    await browser.close();
    process.exit(0);
  }
  step(`the feature is on for this Control Panel (${SEAM ? 'turned on by the run, as the toggle would' : 'the site’s toggle'})`, config.flag === true, `sveFeatures.site_canvas = ${JSON.stringify(config.flag)}${!SEAM && config.flag !== true ? ' — switch on "Site canvas (demo)" in Addons › Visual Editor' : ''}`);

  // The list the canvas will draw: this checkout's controller's, or the real endpoint's.
  if (SEAM) {
    const t = Date.now();
    payload = payloadFromCheckout();
    info('list from this checkout’s controller', `${SSH ? `over ssh on ${SSH}` : 'in PHP here'}, ${Date.now() - t} ms`);
  } else {
    // The real endpoint, looked at once by the run (marked, so it is not counted as the canvas asking). Each call mints new tokens.
    payload = await cp.evaluate(async (url) => (await fetch(url, { credentials: 'same-origin', headers: { Accept: 'application/json', 'X-SVE-Test': 'probe' } })).json(), ENDPOINT);
  }
  const frames = payloadFrames(payload);
  const groups = payload?.groups || [];
  step('the endpoint lists two groups, templates then pages, each with rows of columns of frames; only the pages can be arranged', groups.map((g) => g.key).join(',') === 'templates,pages' && frames.length > 0 && groups.every((g) => g.rows.length > 0 && g.rows.every((r) => Array.isArray(r.columns) && r.columns.length > 0)) && groups.map((g) => g.arrange).join(',') === 'false,true', `${groups.map((g) => `${g.key} "${g.title}"${g.arrange ? ' (arrange)' : ''}: ${g.rows.map((r) => `${r.title} ${payloadColumns(r).map((c) => c.length).join('+')}`).join(', ')}`).join(' | ')} — ${frames.length} frames`);
  step('the entry being edited is among the pages', frames.some((f) => f.id === ENTRY_ID && f.group === 'pages'));
  step('every frame has an id, a title, a tokenised Live Preview URL and an edit URL', frames.every((f) => f.id && f.title && /[?&]token=/.test(f.preview) && /[?&]live-preview=/.test(f.preview) && /\/cp\//.test(f.edit)));
  step('no concrete entry of another collection is a frame: templates are index/show/layout/page views, pages are the pages collection', frames.every((f) => (f.group === 'templates' ? /\/collection-view-preview\//.test(f.preview) : /\/cp\/collections\/pages\//.test(f.edit))));
  info('frames', frames.map((f) => `${f.group}/${f.row}: ${f.title}`).join(' | '));

  // 2. Closed: the button is there and can be seen; nothing of the canvas exists.
  const btn = await visible(cp, BUTTON);
  step('button in the top bar is visible', btn.ok, btn.why);
  step('button stands in the top bar’s icon row (#__sve-toolbar), not in #__sve-preview-chrome beside the sizes and zoom', await cp.evaluate((sel) => {
    const b = document.querySelector(sel);
    return !!b && !!b.closest('#__sve-toolbar') && !document.getElementById('__sve-preview-chrome')?.contains(b);
  }, BUTTON));
  if (config.strings) {
    const title = await cp.evaluate((sel) => document.querySelector(sel).getAttribute('title') || '', BUTTON);
    step('button has its translated name', !!title && title !== 'site_canvas_button', `"${title}"`);
  } else {
    skip('button has its translated name', 'the installed addon has no site_canvas strings yet (composer update)');
  }
  step('closed costs nothing: no site-canvas chunk fetched, no endpoint call', chunkLoaded().length === 0 && endpointCalls === 0, `${loadedAssets.size} build files so far, ${endpointCalls} endpoint call(s)`);
  const iframesBefore = await cp.evaluate(() => document.querySelectorAll('iframe').length);
  step('closed costs nothing: no layer, no style, no extra iframe', !(await cp.$(LAYER)) && !(await cp.$(STYLE)), `${iframesBefore} iframe(s) in the CP document`);
  step('closed, the button is not pressed', (await cp.evaluate((sel) => document.querySelector(sel).getAttribute('aria-pressed'), BUTTON)) === 'false');

  // The preview frame as it is now; compared after closing. The marker lives on
  // its window, so a reload or a new window loses it.
  const mainBefore = await cp.evaluate(() => {
    const f = document.getElementById('live-preview-iframe');
    f.contentWindow.__sveScMarker = 'before';
    return { src: f.getAttribute('src'), transform: f.style.transform, css: f.style.cssText, cls: f.className };
  });
  const listenersBefore = await listenerSnapshot(cp);

  // At rest on an axis: centred where the sheet fits the view above the zoom bar (`fit`); its edge FIT_MARGIN_PX (24) in from the view's where it does not.
  const FIT_MARGIN_PX = 24;
  const ZOOM_MIN = 0.03;
  const ZOOM_DEFAULT = 0.5;
  const LOAD_MARGIN_PX = 200;
  const atRest = (s) => ['x', 'y'].every((axis) => {
    const size = axis === 'x' ? 'w' : 'h';
    return s.sheet[size] <= s.fit[size] + 0.5
      ? Math.abs((s.sheet[axis] + s.sheet[size] / 2) - (s.fit[axis] + s.fit[size] / 2)) <= 1.5
      : Math.abs((s.sheet[axis] - s.fit[axis]) - FIT_MARGIN_PX) <= 1.5;
  });
  const restDetail = (s) => `zoom ${s.z.toFixed(3)} (${s.label}); sheet ${Math.round(s.sheet.w)}x${Math.round(s.sheet.h)} at ${Math.round(s.sheet.x - s.view.x)},${Math.round(s.sheet.y - s.view.y)} in a ${s.client.join('x')} pane (${Math.round(s.fit.h)} above the zoom bar)`;
  // A frame is near the view when its rect crosses the view grown by the load margin.
  const near = (s, it) => it.x < s.view.x + s.view.w + LOAD_MARGIN_PX && it.x + it.w > s.view.x - LOAD_MARGIN_PX && it.y < s.view.y + s.view.h + LOAD_MARGIN_PX && it.y + it.h > s.view.y - LOAD_MARGIN_PX;

  // 3. Open with a real click: the layer, the frames at 50 %, the near ones' pages — timed.
  const open1 = await openCanvas(cp, frames.length);
  step('click opens the layer', open1.layerAt !== null, `${open1.layerAt} ms after the click`);
  step('the module was fetched on the click, once', chunkLoaded().length === 1, chunkLoaded().join(' ') || 'no chunk');
  step('the endpoint was asked once', endpointCalls === 1, `${endpointCalls} call(s)`);
  step(`every frame is drawn: ${frames.length} items`, open1.itemsAt !== null, `${open1.itemsAt} ms after the click`);
  const nearPainted1 = await nearPainted(cp, open1.t0);
  const shape0 = await cp.evaluate(canvasShape, LAYER);
  if (process.env.SVE_DEBUG) await page.screenshot({ path: `${tmpdir()}/sve-site-canvas-open.png` });
  step('the open is 50 %, and the label reads it', Math.abs(shape0.z - ZOOM_DEFAULT) < 0.001 && shape0.label === '50%', `zoom ${shape0.z.toFixed(3)} "${shape0.label}"`);
  step('at 50 % the sheet rests from its top-left corner, a margin in from the view’s — or in the middle, on an axis it fits on', atRest(shape0), restDetail(shape0));
  step('a frame is 720 px wide on screen at the open', shape0.items.every((it) => Math.abs(it.w - FRAME.width * ZOOM_DEFAULT) <= 1.5), `${shape0.items[0]?.w.toFixed(1)} px`);
  const withSrc0 = shape0.items.filter((it) => it.src);
  const nearNow0 = shape0.items.filter((it) => near(shape0, it));
  step('only the frames near the view were given their page; the rest are empty shells until they come near', withSrc0.length >= 1 && withSrc0.length < frames.length && nearNow0.every((it) => it.src), `${withSrc0.length} of ${frames.length} have a src (${withSrc0.map((it) => `"${it.title}"`).join(', ')}); ${nearNow0.length} near the view now, all with one`);
  step('every frame given its page painted it', nearPainted1.count === withSrc0.length && nearPainted1.count >= 1, `${nearPainted1.count} painted, first ${nearPainted1.firstAt} ms after the click`);

  // «Fit all»: everything near, everything loads — the rest of the run looks at the fitted sheet.
  const tFit = Date.now();
  await realClick(page, cp, `${LAYER} [data-sc-zoom="fit"]`);
  const painted1 = await framesPainted(cp, tFit, frames.length);
  step('after «Fit all», every frame painted its page', painted1.count === frames.length, `all ${painted1.count ?? 0} of ${frames.length} by ${painted1.allAt} ms after the click on «Fit all»`);
  step(`at most ${LOAD_AT_ONCE} pages were on their way at once (the load cap), and each page was asked for once`, loadingPeak >= 1 && loadingPeak <= LOAD_AT_ONCE && frameDocuments === frames.length, `peak ${loadingPeak} in flight; ${frameDocuments} frame documents for ${frames.length} frames`);
  info('time from the click', `layer ${open1.layerAt} ms · items ${open1.itemsAt} ms · first near page ${nearPainted1.firstAt} ms · all pages ${painted1.allAt} ms after «Fit all»`);

  const shape1 = await cp.evaluate(canvasShape, LAYER);
  if (process.env.SVE_DEBUG) await page.screenshot({ path: `${tmpdir()}/sve-site-canvas-fit.png` });
  const geometry = await cp.evaluate((layerSel) => {
    const layer = document.querySelector(layerSel);
    const pane = document.querySelector('.live-preview-contents');
    const cs = getComputedStyle(pane);
    const pr = pane.getBoundingClientRect();
    const box = { left: pr.left + parseFloat(cs.paddingLeft), top: pr.top + parseFloat(cs.paddingTop), width: pane.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight), height: pane.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom) };
    const lr = layer.getBoundingClientRect();
    const top = document.elementFromPoint(lr.x + 6, lr.y + 6);
    return {
      covers: ['left', 'top', 'width', 'height'].every((k) => Math.abs(lr[k] - box[k]) <= 1),
      rect: `${Math.round(lr.left)},${Math.round(lr.top)} ${Math.round(lr.width)}x${Math.round(lr.height)} (pane content box ${Math.round(box.left)},${Math.round(box.top)} ${Math.round(box.width)}x${Math.round(box.height)})`,
      parent: layer.parentElement.className.split(' ')[0],
      insideContents: !!layer.closest('.live-preview-contents'),
      z: getComputedStyle(layer).zIndex,
      onTop: !!top && layer.contains(top),
      role: layer.getAttribute('role'),
    };
  }, LAYER);
  step('the layer covers the preview pane (its content box, not the docks)', geometry.covers, geometry.rect);
  step('the layer sits in Live Preview’s own stacking context, beside the pane, never inside it', geometry.parent === 'live-preview-main' && !geometry.insideContents && geometry.z === '2' && geometry.onTop, `parent=.${geometry.parent} z-index=${geometry.z} on top=${geometry.onTop}`);
  step('open, the button is pressed and lit', shape1.pressed === 'true' && shape1.on === true);
  // A fit fills the view above the zoom bar's strip (`fit`), so a fitted sheet never stands under the bar.
  const inView = (s) => s.sheet.x >= s.fit.x - 0.5 && s.sheet.y >= s.fit.y - 0.5 && s.sheet.x + s.sheet.w <= s.fit.x + s.fit.w + 0.5 && s.sheet.y + s.sheet.h <= s.fit.y + s.fit.h + 0.5;
  const centred = (s) => Math.abs((s.sheet.x + s.sheet.w / 2) - (s.fit.x + s.fit.w / 2)) <= 1.5 && Math.abs((s.sheet.y + s.sheet.h / 2) - (s.fit.y + s.fit.h / 2)) <= 1.5;
  const fitsWhole = (s) => inView(s) && centred(s);
  const fitDetail = (s) => `${restDetail(s)}${fitsWhole(s) ? '' : s.z <= ZOOM_MIN + 1e-6 ? ' — ZOOM_MIN reached, the sheet starts at the top-left margin' : ''}`;
  step('«Fit all» fits everything: the whole sheet in the pane above the zoom bar, centred, zoomed down to do it — or, where ZOOM_MIN stops that, from its top-left edge', shape1.z < ZOOM_DEFAULT && (fitsWhole(shape1) || (shape1.z <= ZOOM_MIN + 1e-6 && atRest(shape1))), fitDetail(shape1));
  step('a view’s width and height of room round the sheet, and no scrollbar drawn', Math.abs(shape1.room[0] - shape1.client[0]) <= 1 && Math.abs(shape1.room[1] - shape1.client[1]) <= 1 && shape1.scrollbars[0] === 0 && shape1.scrollbars[1] === 0, `room ${shape1.room.join('x')}, scroll area ${shape1.scrollSize.join('x')}, scrollbars ${shape1.scrollbars.join('x')} px`);
  step('the zoom label reads the zoom', shape1.label === `${Math.round(shape1.z * 100)}%`, `"${shape1.label}" for ${shape1.z.toFixed(3)}`);

  // 4. Two groups and their rows, in the endpoint's order, stacked top to bottom.
  const groupHeads = shape1.heads.filter((h) => h.kind === 'group');
  const rowHeads = shape1.heads.filter((h) => h.kind === 'row');
  step('two group headings, templates then pages, with the endpoint’s titles', groupHeads.length === 2 && groupHeads.map((h) => h.text).join('|') === groups.map((g) => g.title).join('|') && groupHeads[0].y < groupHeads[1].y, groupHeads.map((h) => `"${h.text}" at y ${Math.round(h.y)}`).join(', '));
  // A group of one row is headed once (the pages: "Pages" over "Pages" would say it twice); a group of several has a heading over each cluster, along the line.
  const rowsExpected = groups.flatMap((g) => (g.rows.length > 1 ? g.rows.map((r) => r.title) : []));
  step('a row heading over each cluster of a group with several rows, left to right on its line; none for a group of one row', rowHeads.map((h) => h.text).join('|') === rowsExpected.join('|') && rowHeads.every((h, i) => i === 0 || h.y > rowHeads[i - 1].y + 0.5 || (Math.abs(h.y - rowHeads[i - 1].y) <= 0.5 && h.x > rowHeads[i - 1].x)), `${rowHeads.map((h) => `"${h.text}" at ${Math.round(h.x)},${Math.round(h.y)}`).join(', ')}; groups of one row: ${groups.filter((g) => g.rows.length === 1).map((g) => `"${g.title}"`).join(', ') || 'none'}`);
  step('headings and labels keep their screen size whatever the zoom', groupHeads.every((h) => Math.abs(h.size - 18) < 0.5) && rowHeads.every((h) => Math.abs(h.size - 13) < 0.5) && shape1.items.every((it) => Math.abs(it.labelSize - 12) < 0.5), `group ${groupHeads[0]?.size.toFixed(1)} px, row ${rowHeads[0]?.size.toFixed(1)} px, label ${shape1.items[0]?.labelSize.toFixed(1)} px on screen at zoom ${shape1.z.toFixed(3)}`);

  // 5. One frame per entry: 1440 wide × as tall as its page, scaled, none overlapping, under its group.
  const byId = new Map(frames.map((f) => [f.id, f]));
  step(`one frame per entry, ${frames.length} in all, each with its title`, shape1.items.length === frames.length && shape1.items.every((it) => byId.get(it.id)?.title === it.title), shape1.items.map((it) => `"${it.title}"`).join(' '));
  step('every frame is 1440 × zoom wide on screen, and no less than the minimum height × zoom tall', shape1.items.every((it) => Math.abs(it.w - FRAME.width * shape1.z) <= 1.5 && it.h >= FRAME.minHeight * shape1.z - 1.5), `${shape1.items[0]?.w.toFixed(1)} ≈ ${FRAME.width}×${shape1.z.toFixed(3)}; heights ${shape1.items.map((it) => Math.round(it.h / shape1.z)).join(' ')} sheet px`);
  const heightsSeen = new Set(shape1.items.map((it) => Math.round(it.h / shape1.z)));
  step('the frames are as tall as their pages, not one size: more than one height among them', heightsSeen.size > 1, `${heightsSeen.size} distinct heights: ${[...heightsSeen].sort((a, b) => a - b).join(' ')}`);
  // Each group is one line: its frames share a top, in the endpoint's order left to right; between two rows (clusters) the gap is the wide one, within a row the narrow one.
  const groupLines = groups.map((g) => {
    // The first frame of each column: along the line (a stacked frame stands under its column's first, and is not in this walk).
    const its = g.rows.flatMap((r) => r.columns.map((column) => ({ ...shape1.items.find((it) => it.id === column[0].id), row: r.key })));
    const gaps = its.slice(1).map((it, i) => ({ sheet: (it.x - (its[i].x + its[i].w)) / shape1.z, cluster: it.row !== its[i].row }));
    return { key: g.key, its, gaps };
  });
  step('each group is one line: its columns’ tops are level, left to right in the endpoint’s order', groupLines.every(({ its }) => its.length > 0 && its.every((it) => it && Math.abs(it.y - its[0].y) <= 0.5 && (it === its[0] || it.x > its[its.indexOf(it) - 1].x))), groupLines.map(({ key, its }) => `${key}: ${its.length} at y ${Math.round(its[0]?.y)}`).join('; '));
  step('within a cluster the frames stand a frame gap apart; between two clusters the wide row gap, so the clusters read as clusters', groupLines.every(({ gaps }) => gaps.every((g) => Math.abs(g.sheet - (g.cluster ? ROW_GAP : GAP)) <= 2)), groupLines.map(({ key, gaps }) => `${key}: ${gaps.map((g) => `${Math.round(g.sheet)}${g.cluster ? ' (cluster)' : ''}`).join(' ')} sheet px`).join('; '));
  const over = overlaps(shape1.items);
  step('no two frames overlap', over.length === 0, over.join(', ') || `${shape1.items.length} frames clear of each other`);
  const templateItems = shape1.items.filter((it) => byId.get(it.id)?.group === 'templates');
  const pageItems = shape1.items.filter((it) => byId.get(it.id)?.group === 'pages');
  step('every template frame stands above every page frame, under its group heading', templateItems.length > 0 && pageItems.length > 0 && Math.max(...templateItems.map((it) => it.y + it.h)) <= Math.min(...pageItems.map((it) => it.y)) && templateItems.every((it) => it.y > groupHeads[0].y) && pageItems.every((it) => it.y > groupHeads[1].y), `${templateItems.length} template frames end at y ${Math.round(Math.max(...templateItems.map((it) => it.y + it.h)))}, ${pageItems.length} page frames start at y ${Math.round(Math.min(...pageItems.map((it) => it.y)))}`);
  step('the entry being edited wears the ring, and no other', shape1.items.filter((it) => it.current).map((it) => it.id).join(',') === ENTRY_ID);
  const ring = await cp.evaluate((sel) => { const hit = document.querySelector(`${sel} .sve-sc-item[data-current] .sve-sc-hit`); const cs = getComputedStyle(hit); return { width: parseFloat(cs.outlineWidth), color: cs.outlineColor, style: cs.outlineStyle }; }, LAYER);
  step('the ring is drawn: a solid outline, as thick on screen whatever the zoom', ring.style === 'solid' && Math.abs(ring.width * shape1.z - 3) < 0.6, `${ring.width.toFixed(1)} px on the sheet × ${shape1.z.toFixed(3)} ≈ 3 px, ${ring.color}`);

  // 6. Every frame's src: the view flag on, one URL each; the current one the preview's own URL, the rest the endpoint's.
  const mainSrc = await cp.evaluate(() => document.getElementById('live-preview-iframe').getAttribute('src') || '');
  const srcs = shape1.items.map((it) => it.src);
  step('fitted, every frame is near and has a src, each with sve_view=canvas, no two alike', srcs.every((s) => s && new URL(s).searchParams.get('sve_view') === 'canvas') && new Set(srcs).size === srcs.length, `${srcs.length} URLs`);
  const currentItem = shape1.items.find((it) => it.current);
  const stripFlag = (u) => { const url = new URL(u); url.searchParams.delete('sve_view'); return url.toString(); };
  // The real endpoint mints a token (and Statamic's live-preview nonce) anew on every call, so the canvas's answer and the run's probe agree on everything but those.
  const sameTarget = (a, b) => { const x = new URL(a); const y = new URL(b); for (const k of ['token', 'live-preview']) { x.searchParams.delete(k); y.searchParams.delete(k); } return x.toString() === y.toString(); };
  const currentFromPreview = !!currentItem && !!mainSrc && mainSrc !== 'about:blank' && new URL(currentItem.src).searchParams.get('token') === new URL(mainSrc, SITE_URL).searchParams.get('token');
  step('the current frame loads the preview’s own URL (same token as the preview iframe), flagged', currentFromPreview, `canvas …${currentItem?.src.slice(-70)} | preview …${mainSrc.slice(-70)}`);
  step('every other frame loads the endpoint’s URL for that entry, flagged, with a token', shape1.items.filter((it) => !it.current).every((it) => (SEAM ? stripFlag(it.src) === new URL(byId.get(it.id).preview).toString() : sameTarget(stripFlag(it.src), byId.get(it.id).preview) && /[?&]token=\w+/.test(it.src))));

  // 7. Inside the frames: a desktop-wide viewport as tall as the page, mirror.js alone, no bridge, nothing to click.
  const inside = [];
  for (const h of await cp.$$(`${LAYER} iframe.sve-sc-frame[src]`)) {
    const f = await h.contentFrame();
    inside.push(await f.evaluate(() => ({
      url: location.href,
      width: innerWidth,
      height: innerHeight,
      scrollHeight: document.documentElement.scrollHeight,
      scrollY: scrollY,
      bridge: !!document.querySelector('script[src*="bridge"]'),
      bridgeRan: '__sveBridgeReady' in window,
      bridgeUi: document.querySelectorAll('#__sve-bridge-styles, #__sve-inserters').length,
      mirror: !!document.querySelector('script[src*="/mirror-"]'),
      preview: !!document.querySelector('script[src*="/preview-"]'),
      vite: !!document.querySelector('script[src*="@vite/client"]'),
      body: document.body.children.length,
    })).catch((e) => ({ error: e.message })));
  }
  step('every frame is a 1440-wide viewport as tall as its page: no less than the minimum, nothing of the page cut off, at its top', inside.length === frames.length && inside.every((f) => f.width === FRAME.width && f.height >= FRAME.minHeight && f.scrollHeight <= f.height + 1 && f.scrollY === 0), inside.map((f) => `${f.width}x${f.height} (page ${f.scrollHeight})`).join(' '));
  // The installed InjectBridgeScript honours `sve_view` (every release since the breakpoint overview); the frames say so.
  step('no bridge in any frame: no script, never ran, no badges/outlines/toolbar; mirror.js alone, not preview.js', inside.every((f) => !f.bridge && !f.bridgeRan && f.bridgeUi === 0 && f.mirror && !f.preview), JSON.stringify(inside.map((f) => ({ bridge: f.bridge, mirror: f.mirror, preview: f.preview })).filter((v, i, a) => a.findIndex((o) => JSON.stringify(o) === JSON.stringify(v)) === i)));
  // The frames are Live Preview documents through the installed middleware, as the preview is: the Vite client is its decision, per document, not the canvas's. Noted, not judged.
  const mainVite = await previewReady.evaluate(() => !!document.querySelector('script[src*="@vite/client"]'));
  const viteIn = (sel) => inside.filter((f) => sel(f)).length;
  info('@vite/client (the installed Live Preview chain’s choice)', `preview ${mainVite ? 'has it' : 'has none'}; ${viteIn((f) => f.vite)} of ${inside.length} frames have it (${viteIn((f) => f.vite && /collection-view-preview/.test(f.url))} of ${viteIn((f) => /collection-view-preview/.test(f.url))} template views, ${viteIn((f) => f.vite && !/collection-view-preview/.test(f.url))} of ${viteIn((f) => !/collection-view-preview/.test(f.url))} pages)`);
  const scriptsPerFrame = [...frameScripts.values()];
  step('each frame’s document asked for the one editor script (mirror), no bridge, no preview', scriptsPerFrame.length > 0 && scriptsPerFrame.every((list) => !list.some((s) => /^(bridge|preview)-/.test(s)) && list.filter((s) => /^mirror-/.test(s)).length === 1), `${scriptsPerFrame.length} frame documents; scripts of the first: ${scriptsPerFrame[0]?.join(' ')}`);
  const within = (px, py, r) => px >= r.x && px <= r.x + r.w && py >= r.y && py <= r.y + r.h;
  const seen = shape1.items.filter((it) => within(it.x + it.w / 2, it.y + it.h / 2, shape1.view));
  // The zoom bar floats over the corner; a fitted sheet stands clear of it, and only a sheet ZOOM_MIN left bigger than the pane can have a frame under it.
  const underBar = seen.filter((it) => within(it.x + it.w / 2, it.y + it.h / 2, shape1.bar));
  step('a transparent layer takes the click on every frame in view: the hit test lands on it, not the iframe', seen.length > 0 && seen.every((it) => it.hitOnTop || underBar.includes(it)) && (underBar.length === 0 || !fitsWhole(shape1)), `${seen.length} of ${shape1.items.length} frames have their middle in view${underBar.length ? `; ${underBar.length} under the zoom bar (${underBar.map((it) => `"${it.title}"`).join(', ')}) — the pane is smaller than the sheet at ZOOM_MIN` : ''}${seen.some((it) => !it.hitOnTop && !underBar.includes(it)) ? '; under the middle of ' + seen.filter((it) => !it.hitOnTop && !underBar.includes(it)).map((it) => `"${it.title}" (${Math.round(it.x - shape1.view.x)},${Math.round(it.y - shape1.view.y)} ${Math.round(it.w)}x${Math.round(it.h)}): ${it.hitOn}`).join(', ') : ''}`);
  const frameHoverCursor = await cp.evaluate((sel) => getComputedStyle(document.querySelector(`${sel} .sve-sc-hit`)).cursor, LAYER);
  step('the hit layer reads as clickable', frameHoverCursor === 'pointer', frameHoverCursor);

  // 8. Zoom: the buttons step the ladder; "Fit all" comes back; ctrl + wheel zooms round the pointer; a plain wheel scrolls.
  await realClick(page, cp, `${LAYER} [data-sc-zoom="in"]`);
  await sleep(150);
  const zoomedIn = await cp.evaluate(canvasShape, LAYER);
  step('the plus steps the zoom up and the label follows', zoomedIn.z > shape1.z + 0.001 && zoomedIn.label === `${Math.round(zoomedIn.z * 100)}%`, `${shape1.z.toFixed(3)} → ${zoomedIn.z.toFixed(3)} (${zoomedIn.label})`);
  step('zoomed in, the frames keep their viewport size × zoom and their srcs', zoomedIn.items.every((it, i) => Math.abs(it.w - FRAME.width * zoomedIn.z) <= 1.5 && it.src === shape1.items[i].src));
  // The keys: a plain + steps in, a plain - steps out — the same ladder as the buttons. Focus is on the button just clicked, not in a field.
  const lpZoomLabel = () => cp.evaluate(() => document.querySelector('#__sve-preview-chrome [data-sve-zoom] [data-zoom="label"]')?.textContent.trim());
  const lpLabelBeforeKeys = await lpZoomLabel();
  await page.keyboard.press('+');
  await sleep(150);
  const keyedIn = await cp.evaluate(canvasShape, LAYER);
  step('the + key steps the zoom up one more step, the label following', keyedIn.z > zoomedIn.z + 0.001 && keyedIn.label === `${Math.round(keyedIn.z * 100)}%`, `${zoomedIn.z.toFixed(3)} → ${keyedIn.z.toFixed(3)} (${keyedIn.label})`);
  await page.keyboard.press('-');
  await sleep(150);
  const keyedOut = await cp.evaluate(canvasShape, LAYER);
  step('the - key steps it back down to where the button had it', Math.abs(keyedOut.z - zoomedIn.z) < 0.001, `${keyedIn.z.toFixed(3)} → ${keyedOut.z.toFixed(3)}`);
  const lpLabelWhileOpen = await lpZoomLabel();
  step('while the canvas is open, the keys left the preview’s own zoom alone', lpLabelWhileOpen === lpLabelBeforeKeys, `top bar reads "${lpLabelWhileOpen}" (was "${lpLabelBeforeKeys}")`);
  await realClick(page, cp, `${LAYER} [data-sc-zoom="fit"]`);
  await sleep(150);
  const refit = await cp.evaluate(canvasShape, LAYER);
  step('"Fit all" after a zoom-in is the same fit again, the sheet at rest', Math.abs(refit.z - shape1.z) < 0.001 && (fitsWhole(refit) || (refit.z <= ZOOM_MIN + 1e-6 && atRest(refit))), fitDetail(refit));
  // Ctrl + wheel over a point: the sheet point under the pointer stays under it — the nearest sheet point, for a pointer in the room beside the sheet.
  const layerRect = await absoluteRect(cp, `${LAYER} .sve-sc-scroll`);
  const pointer = { x: layerRect.x + layerRect.w * 0.3, y: layerRect.y + layerRect.h * 0.4 };
  const before = await cp.evaluate(canvasShape, LAYER);
  const cpBox = await (await cp.frameElement()).boundingBox();
  const sheetSize = [before.sheet.w / before.z, before.sheet.h / before.z];
  const onSheet = (point) => point.map((v, i) => Math.min(sheetSize[i], Math.max(0, v)));
  const sheetPointBefore = onSheet([((pointer.x - cpBox.x) - before.sheetOrigin[0]) / before.z, ((pointer.y - cpBox.y) - before.sheetOrigin[1]) / before.z]);
  await page.mouse.move(pointer.x, pointer.y);
  await page.keyboard.down('Control');
  await page.mouse.wheel({ deltaY: -400 });
  await page.keyboard.up('Control');
  await sleep(200);
  const wheeled = await cp.evaluate(canvasShape, LAYER);
  const sheetPointAfter = onSheet([((pointer.x - cpBox.x) - wheeled.sheetOrigin[0]) / wheeled.z, ((pointer.y - cpBox.y) - wheeled.sheetOrigin[1]) / wheeled.z]);
  // Judged on screen: a sheet pixel is a fraction of a screen pixel at a small zoom.
  const driftPx = [0, 1].map((i) => Math.abs(sheetPointAfter[i] - sheetPointBefore[i]) * wheeled.z);
  step('ctrl + wheel zooms in round the pointer: the sheet point under it stays put (within a screen pixel)', wheeled.z > before.z + 0.01 && driftPx.every((d) => d <= 1.5), `${before.z.toFixed(3)} → ${wheeled.z.toFixed(3)}; sheet point ${sheetPointBefore.map((v) => Math.round(v)).join(',')} → ${sheetPointAfter.map((v) => Math.round(v)).join(',')} (${driftPx.map((d) => d.toFixed(2)).join(',')} px on screen)`);
  const pageZoom = await cp.evaluate(() => window.visualViewport?.scale ?? 1);
  step('the browser’s own page zoom was left alone', pageZoom === 1, `visualViewport.scale ${pageZoom}`);
  // A plain wheel at a zoom that overflows the pane scrolls the sheet, and changes no zoom.
  await realClick(page, cp, `${LAYER} [data-sc-zoom="label"]`);
  await sleep(150);
  const actual = await cp.evaluate(canvasShape, LAYER);
  step('a click on the percent is 100 %: a frame is 1440 px wide on screen, the sheet larger than the pane', Math.abs(actual.z - 1) < 0.001 && Math.abs(actual.items[0].w - FRAME.width) <= 1 && actual.sheet.w > actual.view.w && actual.sheet.h > actual.view.h, `zoom ${actual.z}, sheet ${Math.round(actual.sheet.w)}x${Math.round(actual.sheet.h)} in ${actual.client.join('x')}`);
  // The zoom to 100 % was round the view's middle, held to the nearest sheet point: part of the sheet is in view, never empty room alone.
  const sheetInView = (s) => s.sheet.x < s.view.x + s.view.w && s.sheet.x + s.sheet.w > s.view.x && s.sheet.y < s.view.y + s.view.h && s.sheet.y + s.sheet.h > s.view.y;
  step('at 100 % the view still shows the sheet (the zoom held the nearest sheet point, not empty room)', sheetInView(actual), `sheet at ${Math.round(actual.sheet.x - actual.view.x)},${Math.round(actual.sheet.y - actual.view.y)} of the view`);
  // How far the scroll box lets the view go on each axis from here; a wheel or drag past that stops there.
  const maxScroll = (s) => [s.scrollSize[0] - s.client[0], s.scrollSize[1] - s.client[1]];
  const expectScroll = (s, dx, dy) => [Math.min(maxScroll(s)[0], Math.max(0, s.scroll[0] + dx)), Math.min(maxScroll(s)[1], Math.max(0, s.scroll[1] + dy))];
  await page.mouse.move(layerRect.x + layerRect.w / 2, layerRect.y + layerRect.h / 2);
  await page.mouse.wheel({ deltaY: 300 });
  await sleep(200);
  const scrolledDown = await cp.evaluate(canvasShape, LAYER);
  const downRoom = maxScroll(actual)[1] - actual.scroll[1];
  step('a plain wheel scrolls the canvas down and changes no zoom', (downRoom > 0 ? scrolledDown.scroll[1] > actual.scroll[1] : scrolledDown.scroll[1] === actual.scroll[1]) && Math.abs(scrolledDown.z - actual.z) < 0.001, `scrollTop ${actual.scroll[1]} → ${scrolledDown.scroll[1]} (${downRoom} px of room below)`);
  await page.mouse.wheel({ deltaX: 300 });
  await sleep(200);
  const scrolledRight = await cp.evaluate(canvasShape, LAYER);
  const rightRoom = maxScroll(scrolledDown)[0] - scrolledDown.scroll[0];
  step('a horizontal wheel scrolls it sideways', rightRoom > 0 ? scrolledRight.scroll[0] > scrolledDown.scroll[0] : scrolledRight.scroll[0] === scrolledDown.scroll[0], `scrollLeft ${scrolledDown.scroll[0]} → ${scrolledRight.scroll[0]} (${rightRoom} px of room to the right)`);

  // 8b. Arrange: a page dragged under another stands in its column, the columns are posted and the endpoint answers them; a drop above the pages' heading is nowhere; dragged back out, the columns are as they were.
  await realClick(page, cp, `${LAYER} [data-sc-zoom="fit"]`);
  await sleep(300);
  const pagesRow = groups.find((g) => g.key === 'pages')?.rows[0];
  const columns0 = payloadColumns(pagesRow);
  const arr0 = await cp.evaluate(canvasShape, LAYER);
  const itemOf = (shape, id) => shape.items.find((it) => it.id === id);
  const atPage = (pt) => ({ x: cpBox.x + pt.x, y: cpBox.y + pt.y });
  /** A frame's box in sheet pixels, so two shapes compare whatever their zoom. */
  const onSheetBox = (shape, it) => ({ x: (it.x - shape.sheet.x) / shape.z, y: (it.y - shape.sheet.y) / shape.z });
  const samePlaces = (a, b) => a.items.every((it, i) => { const p = onSheetBox(a, it); const q = onSheetBox(b, b.items[i]); return Math.abs(p.x - q.x) <= 1 && Math.abs(p.y - q.y) <= 1; });
  /** Press on `from`, move to `to` in steps (a look in the middle through `peek`), and release unless `hold`. CP-frame coordinates. */
  const dragFrame = async (from, to, { peek = null, release = true } = {}) => {
    const a = atPage(from); const b = atPage(to);
    await page.mouse.move(a.x, a.y);
    await page.mouse.down();
    for (let i = 1; i <= 12; i++) await page.mouse.move(a.x + (b.x - a.x) * (i / 12), a.y + (b.y - a.y) * (i / 12));
    await sleep(60);
    const seen = peek ? await peek() : null;
    if (release) { await page.mouse.up(); await sleep(250); }
    return seen;
  };
  const dragState = () => cp.evaluate((sel) => {
    const layer = document.querySelector(sel);
    const dragging = layer.querySelector('.sve-sc-item[data-dragging]');
    const bar = layer.querySelector('.sve-sc-drop');
    const r = bar && !bar.hidden ? bar.getBoundingClientRect() : null;
    const scroller = layer.querySelector('.sve-sc-scroll');
    return { dragging: dragging?.dataset.id || null, transform: dragging ? getComputedStyle(dragging).transform : null, bar: r ? { x: r.x, y: r.y, w: r.width, h: r.height } : null, cursor: getComputedStyle(scroller).cursor, scroll: { x: scroller.scrollLeft, y: scroller.scrollTop } };
  }, LAYER);
  const canArrange = columns0.length >= 3 && columns0.every((c) => c.length === 1);
  step('the pages come one a column, three or more of them, so a page can be stood under another', canArrange, `${columns0.length} columns: ${columns0.map((c) => c.length).join('+')}`);
  if (canArrange) {
    const [, [overId], [movingId]] = columns0; // the second page and the third: the third goes under the second
    const over0 = itemOf(arr0, overId); const moving0 = itemOf(arr0, movingId);
    const next0 = columns0[3] ? itemOf(arr0, columns0[3][0]) : null;
    const from = { x: moving0.x + moving0.w / 2, y: moving0.y + moving0.h / 2 };
    const to = { x: over0.x + over0.w / 2, y: over0.y + over0.h + Math.max(6, GAP * arr0.z) };
    step('an arrangeable frame says so, and offers a grab cursor; a template frame does not', arr0.items.length > 0 && (await cp.evaluate((sel, id, tid) => { const page = document.querySelector(`${sel} .sve-sc-item[data-id="${id}"]`); const tpl = document.querySelector(`${sel} .sve-sc-item[data-id="${tid}"]`); return page?.hasAttribute('data-arrange') && getComputedStyle(page.querySelector('.sve-sc-hit')).cursor === 'grab' && !tpl?.hasAttribute('data-arrange') && getComputedStyle(tpl.querySelector('.sve-sc-hit')).cursor === 'pointer'; }, LAYER, movingId, frames.find((f) => f.group === 'templates')?.id)));
    const still0 = await dragState();
    const mid = await dragFrame(from, to, { peek: dragState });
    step('a press on a page frame never pans: the sheet stood still under the lifted frame, the first pixels under the threshold included', !!mid && mid.scroll.x === still0.scroll.x && mid.scroll.y === still0.scroll.y, `scroll ${still0.scroll.x},${still0.scroll.y} → ${mid?.scroll.x},${mid?.scroll.y}`);
    step('lifted, the frame follows the pointer (a transform, the sheet not laid out again) and a bar across the column under the page it would stand beneath says where it lands', !!mid && mid.dragging === movingId && mid.transform !== 'none' && !!mid.bar && mid.bar.w > mid.bar.h && Math.abs(mid.bar.x - over0.x) <= 1.5 && mid.bar.y > over0.y + over0.h - 1 && mid.cursor === 'grabbing', `dragging ${mid?.dragging}, bar ${mid?.bar ? `${Math.round(mid.bar.w)}×${Math.round(mid.bar.h)} at ${Math.round(mid.bar.x)},${Math.round(mid.bar.y)}` : 'none'} (column at x ${Math.round(over0.x)}, frame ends at y ${Math.round(over0.y + over0.h)}), cursor ${mid?.cursor}`);
    const arr1 = await cp.evaluate(canvasShape, LAYER);
    const over1 = itemOf(arr1, overId); const moving1 = itemOf(arr1, movingId);
    const next1 = next0 ? itemOf(arr1, columns0[3][0]) : null;
    const closedUp = !next1 || Math.abs(onSheetBox(arr1, next1).x - onSheetBox(arr0, moving0).x) <= 1;
    step('dropped, it stands under that page in its column, a label and a gap below it; the columns to its right close up', Math.abs(moving1.x - over1.x) <= 1 && Math.abs(onSheetBox(arr1, moving1).y - (onSheetBox(arr1, over1).y + over1.h / arr1.z + GAP + 28 / arr1.z)) <= 1.5 / arr1.z && closedUp && !(await dragState()).dragging && !(await dragState()).bar, `${movingId.slice(0, 8)} at ${Math.round(moving1.x)},${Math.round(moving1.y)} under ${overId.slice(0, 8)} at ${Math.round(over1.x)},${Math.round(over1.y)} (ends ${Math.round(over1.y + over1.h)}); next column on the sheet now at x ${next1 ? Math.round(onSheetBox(arr1, next1).x) : '—'} (the moved one stood at ${Math.round(onSheetBox(arr0, moving0).x)})`);
    step('no two frames overlap after the drop', overlaps(arr1.items).length === 0, overlaps(arr1.items).join(', ') || 'clear');
    const want1 = columns0.flatMap((c, i) => (i === 1 ? [[overId, movingId]] : i === 2 ? [] : [c]));
    const posted = await until(async () => { const p = await cp.evaluate(async (url) => (await fetch(url, { credentials: 'same-origin', headers: { Accept: 'application/json', 'X-SVE-Test': 'probe' } })).json(), ENDPOINT); const c = payloadColumns((p.groups || []).find((g) => g.key === 'pages')?.rows[0]); return JSON.stringify(c) === JSON.stringify(want1) ? c : null; }, 4000);
    step('the columns were posted once and the endpoint answers them: the two pages one column, the rest as they were', !!posted && arrangeCalls === 1, `${arrangeCalls} post(s); endpoint ${posted ? 'answers the new columns' : 'does not answer the new columns'}`);
    // Above the pages' heading — on the templates' line — is nowhere: no bar, and the drop changes nothing.
    const templatesHead = arr1.heads.find((h) => h.kind === 'group');
    const nowhere = await dragFrame({ x: moving1.x + moving1.w / 2, y: moving1.y + moving1.h / 2 }, { x: over1.x + over1.w / 2, y: templatesHead.y + 4 }, { peek: dragState });
    const arr2 = await cp.evaluate(canvasShape, LAYER);
    step('dragged up among the templates, the bar is gone (nowhere to land), and the drop leaves the columns as they were', !!nowhere && nowhere.dragging === movingId && !nowhere.bar && samePlaces(arr2, arr1) && arrangeCalls === 1, `bar ${nowhere?.bar ? 'shown' : 'none'}, ${arrangeCalls} post(s), frames where they were: ${samePlaces(arr2, arr1)}`);
    // Back out: into the gap right of its column, a new column of its own — the columns as before.
    const back = await dragFrame({ x: moving1.x + moving1.w / 2, y: moving1.y + moving1.h / 2 }, { x: over1.x + over1.w + Math.max(2, (GAP / 2) * arr1.z), y: over1.y + over1.h / 2 }, { peek: dragState });
    const arr3 = await cp.evaluate(canvasShape, LAYER);
    const restored = await until(async () => { const p = await cp.evaluate(async (url) => (await fetch(url, { credentials: 'same-origin', headers: { Accept: 'application/json', 'X-SVE-Test': 'probe' } })).json(), ENDPOINT); const c = payloadColumns((p.groups || []).find((g) => g.key === 'pages')?.rows[0]); return JSON.stringify(c) === JSON.stringify(columns0) ? c : null; }, 4000);
    step('dragged out into the gap beside its old column, the bar stands down the line there; dropped, it is a column of its own again and everything stands as before — on the sheet and at the endpoint', !!back && !!back.bar && back.bar.h > back.bar.w && samePlaces(arr3, arr0) && !!restored && arrangeCalls === 2, `bar ${back?.bar ? `${Math.round(back.bar.w)}×${Math.round(back.bar.h)}` : 'none'}; frames back: ${samePlaces(arr3, arr0)}; endpoint ${restored ? 'as before' : 'NOT as before'}; ${arrangeCalls} post(s)`);
    if (!restored) {
      // Leave the site as it was found.
      const status = await cp.evaluate(async (url, columns) => (await fetch(url, { method: 'POST', credentials: 'same-origin', headers: { Accept: 'application/json', 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest', 'X-SVE-Test': 'probe', 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || window.Statamic?.$config?.get?.('csrfToken') || '' }, body: JSON.stringify({ columns }) })).status, ARRANGE_ENDPOINT, columns0);
      info('the arrangement was put back by hand', `POST ${status}`);
    }
    step('a drag on a page frame opened nothing: the canvas is still open, the editor on the same entry', !!(await cp.$(LAYER)) && cp.url().includes(ENTRY_ID));
  }

  // 9. Pan: a drag moves the view; it opens nothing. A press on a page frame lifts the frame (8) and never pans, so the press goes to the view's centre or, if a page frame stands there, the nearest spot that is not one — the sheet, a heading, a plate, a template frame all pan.
  const panFrom = await cp.evaluate((sel, rect) => {
    const layer = document.querySelector(sel);
    const centre = { x: rect.x + rect.w / 2, y: rect.y + rect.h / 2 };
    const free = (x, y) => { const el = document.elementFromPoint(x, y); return !!el && layer.contains(el) && !el.closest('.sve-sc-item[data-arrange]') && !el.closest('.sve-sc-zoom'); };
    for (let r = 0; r <= Math.min(rect.w, rect.h) / 2 - 8; r += 12) {
      for (const [dx, dy] of [[0, 0], [0, -r], [r, 0], [-r, 0], [0, r], [r, -r], [-r, -r], [r, r], [-r, r]]) {
        if (free(centre.x + dx, centre.y + dy)) return { x: centre.x + dx, y: centre.y + dy, offCentre: Math.hypot(dx, dy) };
      }
    }
    return { ...centre, offCentre: NaN };
  }, LAYER, layerRect);
  const beforePan = await cp.evaluate(canvasShape, LAYER);
  await page.mouse.move(panFrom.x, panFrom.y);
  await page.mouse.down();
  for (let i = 1; i <= 10; i++) await page.mouse.move(panFrom.x - 20 * i, panFrom.y - 12 * i);
  await page.mouse.up();
  await sleep(200);
  const afterPan = await cp.evaluate(canvasShape, LAYER);
  const stillOpenAfterPan = !!(await cp.$(LAYER));
  const panWant = expectScroll(beforePan, 200, 120);
  step('a drag pans the canvas by the distance dragged (to the scroll box’s end at most)', !!afterPan && Math.abs(afterPan.scroll[0] - panWant[0]) <= 2 && Math.abs(afterPan.scroll[1] - panWant[1]) <= 2, `scroll ${beforePan.scroll.join(',')} → ${afterPan?.scroll.join(',')} (dragged 200,120; expected ${panWant.map(Math.round).join(',')}; pressed ${Number.isNaN(panFrom.offCentre) ? 'at the centre, no free spot found' : panFrom.offCentre === 0 ? 'at the centre' : `${Math.round(panFrom.offCentre)} px off the centre, clear of the page frames`})`);
  step('a drag on the sheet opened nothing: the canvas is still open, the editor on the same entry', stillOpenAfterPan && cp.url().includes(ENTRY_ID), stillOpenAfterPan ? 'open' : 'closed');
  // Scrolling in only loads frames not yet loaded: all were, so the srcs are what they were.
  step('scrolled and panned about, every frame keeps the src it was given (nothing reloads)', afterPan.items.every((it, i) => it.src === shape1.items[i].src));

  // 10. Escape closes and leaves the editor as it was.
  const listenersOpen = await listenerSnapshot(cp);
  const closed = await closeByEscape(cp);
  const after = await cp.evaluate((styleSel) => {
    const f = document.getElementById('live-preview-iframe');
    return {
      style: !!document.querySelector(styleSel),
      iframes: document.querySelectorAll('iframe').length,
      pressed: document.querySelector('#__sve-toolbar button[data-tab="site_canvas"]')?.getAttribute('aria-pressed'),
      on: ((b) => !!b && b.style.background !== '' && b.style.background !== 'transparent')(document.querySelector('#__sve-toolbar button[data-tab="site_canvas"]')),
      src: f?.getAttribute('src'),
      transform: f?.style.transform,
      css: f?.style.cssText,
      cls: f?.className,
      marker: f?.contentWindow?.__sveScMarker,
    };
  }, STYLE);
  step('Escape closes: layer and its style gone, button off', !!closed && !after.style && after.pressed === 'false' && after.on === false);
  step('Escape did not close Live Preview', !!(await page.$('iframe.sve-edit-overlay[data-open]')) && after.src != null);
  step('iframes in the CP document back to before', after.iframes === iframesBefore, `${after.iframes} (before ${iframesBefore})`);
  step('the preview frame is untouched: same src, transform and window', after.src === mainBefore.src && after.transform === mainBefore.transform && after.marker === 'before', `src same=${after.src === mainBefore.src} transform "${after.transform}" (was "${mainBefore.transform}") window kept=${after.marker === 'before'}`);
  info('preview frame style and class', after.css === mainBefore.css && after.cls === mainBefore.cls ? 'identical to before' : `now "${after.css}" .${after.cls} — before "${mainBefore.css}" .${mainBefore.cls}`);
  // Closed, the same keys are the preview's own zoom — the top bar's − and + (one step down its ladder, and back up).
  const lpBefore = await lpZoomLabel();
  await page.keyboard.press('-');
  await sleep(250);
  const lpDown = await lpZoomLabel();
  await page.keyboard.press('+');
  await sleep(250);
  const lpBack = await lpZoomLabel();
  const pct = (s) => parseInt(s, 10);
  step('closed, the - key steps the preview’s own zoom (the top bar’s) down a step, and + brings it back', pct(lpDown) < pct(lpBefore) && lpBack === lpBefore, `top bar "${lpBefore}" → "${lpDown}" → "${lpBack}"`);
  const listenersAfter = await listenerSnapshot(cp);
  const own = { before: ownListeners(listenersBefore), open: ownListeners(listenersOpen), after: ownListeners(listenersAfter) };
  const show = (map) => Object.entries(map).map(([k, types]) => `${k} [${types.join(' ')}]`).join(', ');
  // Its own listeners on these objects while open: Escape on the CP window. The rest sit on its own layer; the pane is watched by a ResizeObserver, not a listener.
  const want = { cpWindow: ['keydown'], cpDocument: [], pane: [], previewWindow: [], previewDocument: [] };
  step('before opening, the canvas has no listener anywhere (DevTools)', Object.values(own.before).every((types) => types.length === 0), show(own.before));
  step('open, DevTools sees exactly the canvas’s own listeners: Escape on the CP window, nothing on the preview', JSON.stringify(own.open) === JSON.stringify(want), show(own.open));
  step('closed, every listener it bound is gone (DevTools)', Object.values(own.after).every((types) => types.length === 0), show(own.after));
  info('all listeners on those objects (the editor binds its own meanwhile)', Object.keys(listenersBefore).map((k) => `${k} ${listenersBefore[k].length}→${listenersOpen[k].length}→${listenersAfter[k].length}`).join(', '));

  // 11. Reopened: the list is not asked for again; the frame being edited takes the preview's URL as it is now; the button closes it.
  const open2 = await openCanvas(cp, frames.length);
  step('the button opens it again', open2.layerAt !== null && open2.itemsAt !== null, `layer ${open2.layerAt} ms, items ${open2.itemsAt} ms`);
  step('reopened, the list is the one already fetched: no second endpoint call, no second chunk', endpointCalls === 1 && chunkLoaded().length === 1, `${endpointCalls} call(s)`);
  // The frames are made anew on each open, at 50 % again, and the near ones given their pages a few at a time again.
  const painted2 = await nearPainted(cp, open2.t0);
  const shape2 = await cp.evaluate(canvasShape, LAYER);
  step('reopened at 50 %, at rest from the top-left corner, the ring on the same entry', Math.abs(shape2.z - ZOOM_DEFAULT) < 0.001 && atRest(shape2) && shape2.items.find((it) => it.current)?.id === ENTRY_ID, restDetail(shape2));
  step('reopened, the frames near the view painted their pages again', painted2.count >= 1 && painted2.count === shape2.items.filter((it) => it.src).length, `${painted2.count} by ${painted2.allAt} ms after the click`);
  const mainSrc2 = await cp.evaluate(() => document.getElementById('live-preview-iframe').getAttribute('src') || '');
  const current2 = shape2.items.find((it) => it.current);
  // The current frame has a src only if it is near the view at 50 % in this pane; given one, it is the preview's URL as it is now.
  const currentOk2 = !current2?.src || new URL(current2.src).searchParams.get('token') === new URL(mainSrc2, SITE_URL).searchParams.get('token');
  step('reopened, every frame given its page has the URL it had — the current one the preview’s URL as it is now, when it is near', currentOk2 && shape2.items.filter((it) => !it.current && it.src).every((it) => it.src === shape1.items.find((o) => o.id === it.id)?.src), current2?.src ? `current …${current2.src.slice(-40)}` : `the current frame ("${current2?.title}") is not near the view at 50 % in this ${shape2.client.join('x')} pane — no src yet, as designed`);
  await realClick(page, cp, BUTTON);
  const closedByButton = await until(() => cp.evaluate((sel) => !document.querySelector(sel), LAYER), 3000);
  step('the same button closes it', !!closedByButton);

  // 12. One state at a time with the breakpoint overview.
  if (await cp.$(BP_BUTTON)) {
    await realClick(page, cp, BP_BUTTON);
    const bpUp = await waitIn(cp, BP_LAYER, 10000);
    await sleep(500);
    await realClick(page, cp, BUTTON);
    const canvasUp = await waitIn(cp, LAYER, 10000);
    const bpGone = await until(() => cp.evaluate((sel) => !document.querySelector(sel), BP_LAYER), 3000);
    step('the canvas opened over an open breakpoint overview closes the overview first', bpUp && canvasUp && !!bpGone, `overview ${bpUp ? 'was open' : 'did not open'}, canvas ${canvasUp ? 'open' : 'closed'}, overview now ${bpGone ? 'gone' : 'still there'}`);
    await cp.evaluate((sel, n) => document.querySelectorAll(`${sel} .sve-sc-item`).length === n, LAYER, frames.length);
    await realClick(page, cp, BP_BUTTON);
    const bpBack = await waitIn(cp, BP_LAYER, 10000);
    const canvasGone = await until(() => cp.evaluate((sel) => !document.querySelector(sel), LAYER), 3000);
    const canvasOff = await cp.evaluate((sel, styleSel) => document.querySelector(sel)?.getAttribute('aria-pressed') === 'false' && !document.querySelector(styleSel), BUTTON, STYLE);
    step('the overview opened over the open canvas closes the canvas first (its one ask), button off, style gone', bpBack && !!canvasGone && canvasOff, `overview ${bpBack ? 'open' : 'closed'}, canvas ${canvasGone ? 'gone' : 'still there'}`);
    await realClick(page, cp, BP_BUTTON);
    const bpClosed = await until(() => cp.evaluate((sel) => !document.querySelector(sel), BP_LAYER), 3000);
    const restored = await cp.evaluate(() => { const f = document.getElementById('live-preview-iframe'); return { iframes: document.querySelectorAll('iframe').length, src: f?.getAttribute('src'), marker: f?.contentWindow?.__sveScMarker }; });
    step('both closed, the editor is as it was: iframe count, preview src and window', !!bpClosed && restored.iframes === iframesBefore && restored.src === mainBefore.src && restored.marker === 'before', `${restored.iframes} iframes (before ${iframesBefore})`);
  } else {
    skip('one state at a time with the breakpoint overview', 'no overview button in this Control Panel');
  }

  // 13. A click on a frame: the canvas closes and Live Preview moves to that entry — the one way it already has.
  // SVE_TARGET names the page to move to (its id); otherwise the first page that is not the one open.
  const target = frames.find((f) => f.group === 'pages' && f.id !== ENTRY_ID && (!process.env.SVE_TARGET || f.id === process.env.SVE_TARGET));
  if (target) {
    const open3 = await openCanvas(cp, frames.length);
    step('opened once more for the click', open3.itemsAt !== null);
    // «Fit all» brings every frame into view; the target may stand outside it at 50 %.
    await realClick(page, cp, `${LAYER} [data-sc-zoom="fit"]`);
    await sleep(150);
    const t0 = Date.now();
    await realClick(page, cp, `${LAYER} .sve-sc-item[data-id="${target.id}"] .sve-sc-hit`);
    const closedOnClick = await until(() => cp.evaluate((sel) => !document.querySelector(sel), LAYER).catch(() => true), 3000);
    step('the click closes the canvas at once', !!closedOnClick, `${Date.now() - t0} ms`);
    const moved = await until(async () => {
      for (const h of await page.$$('iframe.sve-edit-overlay[data-open]')) {
        const f = await h.contentFrame();
        if (f && f.url().includes(target.id) && (await f.$('#__sve-preview-chrome [data-sve-zoom]'))) return f;
      }
      return null;
    }, 40000, 300);
    step(`Live Preview is on "${target.title}" with its top bar`, !!moved, `${Date.now() - t0} ms after the click; ${moved ? moved.url().replace(SITE_URL, '') : 'not there'}`);
    if (moved) {
      cp = moved;
      const previewAgain = await until(async () => { const f = await (await cp.$('#live-preview-iframe'))?.contentFrame(); return f && (await f.evaluate(() => document.readyState === 'complete')) ? f : null; }, 25000, 500);
      step('its preview rendered', !!previewAgain);
      await sleep(2000);
      const open4 = await openCanvas(cp, frames.length);
      const shape4 = await cp.evaluate(canvasShape, LAYER);
      step('on the new entry the canvas rings that frame, and the list is drawn again from the endpoint of this Control Panel', open4.itemsAt !== null && shape4?.items.find((it) => it.current)?.id === target.id, `ring on "${shape4?.items.find((it) => it.current)?.title}"`);
      // The canvas's own frame of the entry just left shows the page as saved — nothing was changed, so it is the same page.
      await closeByEscape(cp);
      step('Escape closes it here too, Live Preview stays on the new entry', !(await cp.$(LAYER)) && cp.url().includes(target.id));
    }
  } else {
    skip('a click on a frame moves Live Preview', 'no other page to move to');
  }

  if (process.env.SVE_DEBUG) await page.screenshot({ path: `${tmpdir()}/sve-site-canvas.png` });
  await sleep(500);
} catch (e) {
  report.errors.push(`exception: ${e.message}`);
  report.ok = false;
} finally {
  await browser.close();
  seedLayoutPrefs(null);
  try { unlinkSync(installedManifestFile); } catch { /* already gone */ }
}

if (served) step('working-tree build was what the CP loaded', served() > 0, `${served()} build files served from the working tree`);
if (herdBlocked) info('Herd’s AI bubble kept out', `${herdBlocked} request(s) for herd-ai.js answered with an empty module`);
if (NO_PREFS_WRITES) info('layout prefs writes kept off the account', `${prefsWritesBlocked} write(s) to /!/sve/chrome-prefs answered here`);
{
  const files = (manifest) => Object.values(manifest).flatMap((e) => [e.file, ...(e.css || []), ...(e.assets || [])]).map((f) => f.replace(/^assets\//, ''));
  const allowed = new Set(files(installedManifest));
  if (WORKTREE) for (const f of files(JSON.parse(readFileSync(`${BUILD_DIR}/manifest.json`, 'utf8')))) allowed.add(f);
  const strays = [...loadedAssets].filter((f) => !allowed.has(f));
  step('every build file the browser loaded is one the manifest names', strays.length === 0, `${loadedAssets.size} files${strays.length ? ' | not in the manifest: ' + strays.join(' ') : ''}`);
}
step('the entry on disk is unchanged (nothing was saved)', !entryFile || md5(entryFile) === entryBefore, entryFile ? entryFile.replace(SITE_DIR + '/', '') : 'entry file not found');
const realErrors = report.errors.filter((e) => !/favicon|net::ERR_ABORTED|the server responded with a status of 4/i.test(e));
step('no JavaScript errors (CP, overlay, preview, canvas frames)', realErrors.length === 0, realErrors.slice(0, 5).join(' | '));
console.log(JSON.stringify({ ok: report.ok, errors: realErrors }, null, 0));
process.exit(report.ok ? 0 : 1);
