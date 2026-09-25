#!/usr/bin/env node
/**
 * Breakpoint overview — every screen size side by side in Live Preview.
 *
 * Proves, in a real Live Preview, what the owner asked for: the button is
 * there and visible; closed, the overview costs nothing (no chunk fetched, no
 * extra iframe); open, there is one live view frame per breakpoint at its real
 * width, without the bridge, following what is typed on the left; zoom and pan
 * work; picking a size at 100 % scrolls the row so its frame is whole in view
 * (wider than the pane: left edge at the pane's left edge); and closing leaves
 * the editor exactly as it was — the preview frame's src, transform and
 * window, the iframe count and the event listeners.
 *
 * Measures, does not assume: "visible" is a box, a display and a hit test,
 * not a node in the DOM; clicks are real mouse clicks at page coordinates.
 *
 * Same env vars as live-preview-smoke.mjs (SVE_PASS is required), plus:
 *   SVE_PREFS   layout to start from; default {"sve-lp-panel-mode":"show"} so
 *               the fields on the left can be typed in
 *
 * The size with the ring is the preview itself, in its slot in the row: the
 * layer has a hole there, clicks reach the bridge, a wheel over it pans the
 * row, FOCUS pans the row, a click on another size makes it the active one,
 * and closing puts the preview back exactly as it was. The other sizes are
 * copies of the preview (mirror.js): one server render per change, each copy
 * morphed from the preview's own render a task later; the tree's video hold
 * and the dock's Instant paint reach every frame. The
 * installed PHP decides which script a copy's document loads. Against a site
 * whose InjectBridgeScript predates mirror.js — every SVE_WORKTREE=1 run
 * before `composer update` — the copy documents are fetched by the test and
 * handed the checkout's mirror.js in place of the installed preview.js, so the
 * copies under test are this checkout's; InjectBridgeScriptTest proves the
 * PHP line meanwhile. Without SVE_WORKTREE, the mirror checks are skipped
 * until `composer update`, and enforced after it.
 *
 * Optional:
 *   SVE_VIDEO_FILE  an mp4 on disk, copied into public/ for the video steps
 *                   (skipped without it)
 *
 *   node tests/browser/breakpoint-overview.mjs
 */
import { createHash } from 'node:crypto';
import { copyFileSync, existsSync, readdirSync, readFileSync, rmdirSync, statSync, unlinkSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { serveWorktreeBuild } from './serve-worktree.mjs';

const env = (key, fallback) => process.env[key] || fallback;
const SITE_DIR = env('SVE_SITE_DIR', `${process.env.HOME}/Sites/vizuall-skabelon`);
const SITE_URL = env('SVE_SITE_URL', 'http://vizuall-skabelon.test');
const USER = env('SVE_USER', 'claude-test@vizuall.dk');
const PASS = env('SVE_PASS', '');
const ENTRY = env('SVE_ENTRY', '/cp/collections/pages/entries/68f56034-ce7c-4d33-b15d-da7fa7675662');
const CHROME = env('SVE_CHROME', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome');
const ADDON_DIR = env('SVE_ADDON_DIR', `${process.env.HOME}/Sites/statamic-addon-visual-editor-vue`);
const WORKTREE = env('SVE_WORKTREE', '') === '1';
const BUILD_DIR = env('SVE_BUILD_DIR', `${ADDON_DIR}/resources/dist/build`);

const puppeteer = createRequire(`${SITE_DIR}/package.json`)('puppeteer');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const report = { errors: [], ok: true };
const step = (name, ok, detail = '') => { if (!ok) report.ok = false; console.log(`${ok ? 'ok ' : 'FAIL'} ${name}${detail ? ' — ' + detail : ''}`); };
const info = (name, detail = '') => console.log(`info ${name}${detail ? ' — ' + detail : ''}`);
const skip = (name, why) => console.log(`skip ${name} — ${why}`);

const LAYER = '#__sve-bp-overview';
const BUTTON = '#__sve-preview-chrome [data-overview]';

// What the installed PHP knows. The flag and the strings ship with this feature; mirror.js came later.
const INSTALLED_MIDDLEWARE = `${SITE_DIR}/vendor/statamic-addon/visual-editor/src/Http/Middleware/InjectBridgeScript.php`;
// The comments API keeps a screen size per comment from v1.1.324 on; the vendor copy may be older until `composer update`.
const INSTALLED_COMMENTS = `${SITE_DIR}/vendor/statamic-addon/visual-editor/src/Http/Controllers/CommentsController.php`;
const PHP_HAS_COMMENT_SIZE = existsSync(INSTALLED_COMMENTS) && /'breakpoint'/.test(readFileSync(INSTALLED_COMMENTS, 'utf8'));
const PHP_HAS_VIEW_FLAG = existsSync(INSTALLED_MIDDLEWARE) && readFileSync(INSTALLED_MIDDLEWARE, 'utf8').includes('sve_view');
const PHP_HAS_MIRROR = existsSync(INSTALLED_MIDDLEWARE) && readFileSync(INSTALLED_MIDDLEWARE, 'utf8').includes('mirror.js');
// The copies run this checkout's mirror.js: through the PHP once installed, or through the rewrite below meanwhile.
const MIRROR_UNDER_TEST = PHP_HAS_MIRROR || WORKTREE;
const MIRROR_FILE = WORKTREE ? JSON.parse(readFileSync(`${BUILD_DIR}/manifest.json`, 'utf8'))['resources/js/mirror.js']?.file : '';
const VIDEO_FILE = env('SVE_VIDEO_FILE', '');
const VIDEO_PUBLIC = `${SITE_DIR}/public/sve-bpo-video.mp4`;
// Against another site (SVE_SITE_URL): a video that site already serves, the
// field to click in the preview and a word its text holds on the left.
const VIDEO_SRC = env('SVE_VIDEO_SRC', '');
const FIELD = env('SVE_FIELD', 'headline');
const FIELD_TEXT = env('SVE_FIELD_TEXT', 'professionelle');
// Another site's user may keep the left panel hidden; SVE_SHOW_PANEL=1 presses
// the toolbar's settings key (which sets the panel to "show") when the field
// is not on screen. That choice is saved for that user, like a click of theirs.
const SHOW_PANEL = env('SVE_SHOW_PANEL', '') === '1';
const startedAt = Date.now();

// The entry is typed into and must not change on disk: nothing is saved.
const ENTRY_ID = ENTRY.split('/').pop();
const md5 = (path) => (existsSync(path) ? createHash('md5').update(readFileSync(path)).digest('hex') : '');
const entryFile = (() => {
  try {
    const dir = `${SITE_DIR}/content/collections/pages`;

    return readdirSync(dir).map((f) => `${dir}/${f}`).find((f) => f.endsWith('.md') && readFileSync(f, 'utf8').includes(ENTRY_ID)) || '';
  } catch {
    return '';
  }
})();

// --- helpers (the smoke test's, trimmed) ---------------------------------------

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
  if (!existsSync(file)) return;
  // Either form the CP saves: a block of keys, or an empty `sve_chrome: {}`.
  // Leaving the inline one and adding a block gave the user a duplicate key,
  // and Statamic answered every login with a 500.
  let yaml = readFileSync(file, 'utf8').replace(/^  sve_chrome:[^\n]*\n(?:    .*\n)*/m, '');
  const entries = Object.entries(prefs || {});
  if (entries.length) {
    const block = `  sve_chrome:\n${entries.map(([k, v]) => `    ${k}: '${String(v).replace(/'/g, "''")}'\n`).join('')}`;
    yaml = /^preferences:\n/m.test(yaml) ? yaml.replace(/^preferences:\n/m, `preferences:\n${block}`) : `${yaml.replace(/\n*$/, '\n')}preferences:\n${block}`;
  }
  writeFileSync(file, yaml);
}

// --- run ---------------------------------------------------------------------------

const PREFS = process.env.SVE_PREFS ? JSON.parse(process.env.SVE_PREFS) : { 'sve-lp-panel-mode': 'show' };
seedLayoutPrefs(PREFS);
info('layout prefs', JSON.stringify(PREFS));
info('installed PHP', PHP_HAS_VIEW_FLAG ? 'knows sve_view — every check is enforced' : 'predates sve_view (vendor has the released addon) — the no-bridge and string checks are skipped until composer update');
const entryBefore = md5(entryFile);
// The section file the dock autosaves into during the video and Instant steps; put back in `finally`.
let filePath = '';
let original = null;
let twPath = null;
let twExisted = true;

// Until `composer update`, the installed InjectBridgeScript still puts
// preview.js into a copy's document. The test then answers a copy frame's
// request for that preview.js with this checkout's mirror.js — what the
// checkout's PHP injects — keyed on the frame that asks. The document itself
// stays the server's (a document the test fulfilled had no address space in
// Chrome's eyes, and its video was blocked as a private-network request).
const SWAPPING = WORKTREE && !PHP_HAS_MIRROR;
const browser = await puppeteer.launch({ headless: true, executablePath: CHROME, args: ['--window-size=1440,900'], defaultViewport: { width: 1440, height: 900 } });
const page = await browser.newPage();
// Headless Chrome asks for reduced motion, and the row would then jump: the
// glide is measured as a person with the default setting sees it.
await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }]);
// The field to click and a word of its text, handed to every frame the page opens.
await page.evaluateOnNewDocument((field, text) => { window.__sveTestField = field; window.__sveTestFieldText = text; }, FIELD, FIELD_TEXT);
page.on('pageerror', (e) => report.errors.push(`pageerror: ${e.message}`));
page.on('console', (m) => { if (m.type() === 'error') report.errors.push(`console: ${m.text().slice(0, 200)}`); });
page.on('response', (r) => { if (r.status() >= 500) report.errors.push(`HTTP ${r.status()} ${r.request().method()} ${r.url().replace(SITE_URL, '').slice(0, 160)}`); });
const loadedAssets = new Set();
page.on('request', (req) => { const m = req.url().match(/\/(?:vendor\/visual-editor\/build|!\/sve\/build)\/assets\/([^?#]+)/); if (m) loadedAssets.add(m[1]); });
const chunkLoaded = () => [...loadedAssets].filter((f) => /^breakpoint-overview-/.test(f));

let served = null;
let copyScriptsSwapped = 0;
const isCopyScript = (req) => SWAPPING && !!MIRROR_FILE && /\/assets\/preview-[^/?#]+\.js/.test(req.url()) && /[?&]sve_view=/.test(req.frame()?.url() || '');
if (WORKTREE) {
  served = await serveWorktreeBuild(page, { buildDir: BUILD_DIR, installedManifest: `${SITE_DIR}/public/vendor/visual-editor/build/manifest.json`, scriptsDir: `${ADDON_DIR}/resources/js`, extra: (req) => {
    if (!isCopyScript(req)) return false;
    copyScriptsSwapped++;
    req.respond({ status: 200, contentType: 'application/javascript', body: readFileSync(`${BUILD_DIR}/${MIRROR_FILE}`) });
    return true;
  } });
  info('build served from', ADDON_DIR);
  info('copy frames', PHP_HAS_MIRROR ? 'the installed PHP injects mirror.js' : `the installed PHP predates mirror.js — a copy frame's request for preview.js is answered with ${MIRROR_FILE}`);
}
// DevTools, for counting event listeners. A remote object id only resolves in
// the session that made it, and a window reached from another frame's context
// reports no listeners at all — so each object is evaluated in its own frame's
// default context, tracked here.
const cdp = await page.createCDPSession();
const contexts = new Map(); // frame id -> default execution context id
cdp.on('Runtime.executionContextCreated', ({ context }) => { if (context.auxData?.isDefault) contexts.set(context.auxData.frameId, context.id); });
cdp.on('Runtime.executionContextDestroyed', ({ executionContextId }) => { for (const [frameId, id] of contexts) if (id === executionContextId) contexts.delete(frameId); });
cdp.on('Runtime.executionContextsCleared', () => contexts.clear());
await cdp.send('Runtime.enable');
// Which script each listener's handler lives in: the editor keeps binding its
// own listeners while fields mount on the left, so a count by type alone mixes
// theirs with the overview's. Its own are the ones in its chunk.
const scripts = new Map(); // script id -> url
cdp.on('Debugger.scriptParsed', ({ scriptId, url }) => scripts.set(scriptId, url));
await cdp.send('Debugger.enable');

/** Event listeners on an object in a frame — what is bound, and by which script. */
async function listenersOn(frame, expression) {
  const contextId = contexts.get(frame._id);
  if (!contextId) throw new Error(`no execution context for frame ${frame.url().slice(0, 60)}`);
  const { result } = await cdp.send('Runtime.evaluate', { expression, contextId, objectGroup: 'sve-bpo' });
  try {
    const { listeners } = await cdp.send('DOMDebugger.getEventListeners', { objectId: result.objectId, depth: 0 });
    return listeners.map((l) => ({ type: `${l.type}${l.useCapture ? '(capture)' : ''}`, script: (scripts.get(l.scriptId) || '').split('/').pop().replace(/\?.*$/, ''), at: `${l.lineNumber}:${l.columnNumber}` }));
  } finally {
    await cdp.send('Runtime.releaseObjectGroup', { objectGroup: 'sve-bpo' });
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
/** The overview's own listeners per object, as sorted type lists. */
const ownListeners = (snapshot) => Object.fromEntries(Object.entries(snapshot).map(([key, list]) => [key, list.filter((l) => /^breakpoint-overview-/.test(l.script)).map((l) => l.type).sort()]));

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
  const cp = await (await page.$('iframe.sve-edit-overlay')).contentFrame();
  await page.keyboard.press('Escape'); // a trial-licence dialog takes the first click otherwise
  step('top bar built', await waitIn(cp, '#__sve-preview-chrome [data-sve-zoom]', 20000));
  const previewReady = await until(async () => {
    const f = await (await cp.$('#live-preview-iframe'))?.contentFrame();
    return f && (await f.evaluate(() => !!document.querySelector(`[data-sid-field="${window.__sveTestField}"]`))) ? f : null;
  }, 25000, 500);
  step('the preview rendered a headline', !!previewReady);
  await sleep(2500); // prefs hydrate, the device and zoom settle, the preview morphs once or twice

  const config = await cp.evaluate(() => ({
    bps: (window.Statamic.$config.get('sveBreakpoints') || []).map((b) => ({ handle: b.handle, device: b.device, base: !!b.base })),
    devices: JSON.parse(JSON.stringify(window.Statamic.$config.get('livePreview.devices') || {})),
    strings: !!window.Statamic.$config.get('sveStrings')?.bp_overview,
  }));
  const expected = [...config.bps].reverse().map((b) => ({ ...b, width: Number(config.devices[b.device]?.width) || (b.base ? 1440 : 0) }));
  info('breakpoints (Breakpoints::forScript)', config.bps.map((b) => `${b.handle}/${b.device}`).join(' '));

  // 2. The fields of the headline's section on the left: click the headline in the preview.
  const main = previewReady;
  // On the text itself: a tall field's empty gap between its lines opens nothing on the left.
  const clickFieldText = async (frame) => {
    const pt = await frame.evaluate((field) => {
      const el = document.querySelector(`[data-sid-field="${field}"]`);
      if (!el) return null;
      const texty = [el, ...el.querySelectorAll('*')].find((n) => [...n.childNodes].some((c) => c.nodeType === 3 && c.nodeValue.trim())) || el;
      const r = texty.getBoundingClientRect();
      return { x: r.x + Math.min(r.width / 2, 120), y: r.y + Math.min(r.height / 2, 24) };
    }, FIELD);
    if (!pt) throw new Error(`no [data-sid-field="${FIELD}"] in the preview`);
    let { x, y } = pt;
    for (let f = frame; f.parentFrame(); f = f.parentFrame()) { const box = await (await f.frameElement()).boundingBox(); x += box.x; y += box.y; }
    await page.mouse.click(x, y);
  };
  await clickFieldText(main);
  if (SHOW_PANEL) {
    const shown = await until(() => cp.evaluate(() => { const r = document.querySelector('.live-preview-editor')?.getBoundingClientRect(); return !!r && r.right > 0 && r.width > 100; }), 3000, 200);
    if (!shown) { await realClick(page, cp, '#__sve-toolbar button[data-tab="settings"]'); await sleep(1500); await clickFieldText(main); info('left panel', 'was hidden for this user — the settings key pressed it into view'); }
  }
  const field = await until(() => cp.evaluate(() => {
    const editor = document.querySelector('.live-preview-editor');
    const r = editor?.getBoundingClientRect();
    if (!r || r.right <= 0) return null;
    return [...editor.querySelectorAll('.ProseMirror[contenteditable="true"], input[type="text"], textarea')].some((el) => { const b = el.getBoundingClientRect(); return b.width > 0 && b.left >= 0 && new RegExp(window.__sveTestFieldText, 'i').test(el.value ?? el.textContent ?? ''); });
  }), 12000, 300);
  step('the headline field is on screen on the left', !!field);

  // 3. Closed: the button is there and can be seen; the module was never fetched.
  const btn = await visible(cp, BUTTON);
  step('button in the top bar is visible', btn.ok, btn.why);
  step('button stands on its own in #__sve-preview-chrome, between the device icons and zoom', await cp.evaluate((sel) => {
    const b = document.querySelector(sel);
    const chrome = document.getElementById('__sve-preview-chrome');
    const devices = chrome?.querySelector('[data-sve-devices]');
    const zoom = chrome?.querySelector('[data-sve-zoom]');
    const after = (a, c) => !!(a.compareDocumentPosition(c) & Node.DOCUMENT_POSITION_FOLLOWING);
    return !!b && chrome.contains(b) && !devices.contains(b) && !zoom.contains(b) && after(devices, b) && after(b, zoom);
  }, BUTTON));
  const iconAtRest = await cp.evaluate((sel) => ({ icon: getComputedStyle(document.querySelector(`${sel} svg`)).opacity, zoom: getComputedStyle(document.querySelector('#__sve-preview-chrome [data-zoom="out"]')).opacity }), BUTTON);
  step('at rest its icon is as dim as the zoom icons', iconAtRest.icon === iconAtRest.zoom && Number(iconAtRest.icon) < 1, `icon ${iconAtRest.icon}, zoom ${iconAtRest.zoom}`);
  const groupPositionBefore = await cp.evaluate(() => document.querySelector('#__sve-preview-chrome [data-sve-devices]').style.position);
  if (config.strings) {
    const title = await cp.evaluate((sel) => { const b = document.querySelector(sel); return b.getAttribute('title') || b.getAttribute('data-tip') || ''; }, BUTTON);
    step('button has its translated name', !!title && title !== 'bp_overview', `"${title}"`);
  } else {
    skip('button has its translated name', 'the installed addon has no bp_overview string yet');
  }
  step('closed costs nothing: no breakpoint-overview chunk fetched', chunkLoaded().length === 0, `${loadedAssets.size} build files so far`);
  const iframesBefore = await cp.evaluate(() => document.querySelectorAll('iframe').length);
  step('closed costs nothing: no layer, no extra iframe', !(await cp.$(LAYER)), `${iframesBefore} iframe(s) in the CP document`);

  // The preview frame as it is now; compared after closing. The marker lives on
  // its window, so a reload or a new window loses it.
  const mainBefore = await cp.evaluate(() => {
    const f = document.getElementById('live-preview-iframe');
    f.contentWindow.__sveBpoMarker = 'before';
    return { src: f.getAttribute('src'), transform: f.style.transform, css: f.style.cssText, cls: f.className };
  });

  // 4. Open with a real click.
  await realClick(page, cp, BUTTON);
  const layerUp = await waitIn(cp, LAYER, 10000);
  step('click opens the layer', layerUp);
  step('the module was fetched on the click', chunkLoaded().length === 1, chunkLoaded().join(' ') || 'no chunk');
  const iconOpen = await cp.evaluate((sel) => getComputedStyle(document.querySelector(`${sel} svg`)).opacity, BUTTON);
  step('open, its icon is at full strength', iconOpen === '1', `icon ${iconOpen}`);

  const shape = await cp.evaluate((layerSel) => {
    const layer = document.querySelector(layerSel);
    const pane = document.querySelector('.live-preview-contents');
    const cs = getComputedStyle(pane);
    const pr = pane.getBoundingClientRect();
    const box = { left: pr.left + parseFloat(cs.paddingLeft), top: pr.top + parseFloat(cs.paddingTop), width: pane.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight), height: pane.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom) };
    const lr = layer.getBoundingClientRect();
    const canvas = layer.querySelector('.sve-bpo-canvas');
    const scale = new DOMMatrix(getComputedStyle(canvas).transform).a;
    // Beside the active size's frame, where the layer has no hole: at the row's left gutter.
    const top = document.elementFromPoint(lr.x + 6, lr.y + lr.height / 2);
    return {
      covers: ['left', 'top', 'width', 'height'].every((k) => Math.abs(lr[k] - box[k]) <= 1),
      rect: `${Math.round(lr.left)},${Math.round(lr.top)} ${Math.round(lr.width)}x${Math.round(lr.height)} (pane content box ${Math.round(box.left)},${Math.round(box.top)} ${Math.round(box.width)}x${Math.round(box.height)})`,
      parent: layer.parentElement.className.split(' ')[0],
      z: getComputedStyle(layer).zIndex,
      onTop: !!top && layer.contains(top),
      scale,
      pressed: document.querySelector('#__sve-preview-chrome [data-overview]').getAttribute('aria-pressed'),
      frames: [...layer.querySelectorAll('iframe')].map((f) => {
        const r = f.getBoundingClientRect();
        const item = f.closest('[data-bp]');
        const fcs = getComputedStyle(f);
        return { bp: item.dataset.bp, active: item.hasAttribute('data-active'), label: item.querySelector('.sve-bpo-label')?.textContent || '', src: f.getAttribute('src') || '', x: r.x, w: r.width, h: r.height, shown: r.width > 0 && r.height > 0 && fcs.display !== 'none' && fcs.visibility !== 'hidden', pe: fcs.pointerEvents };
      }),
      iframes: document.querySelectorAll('iframe').length,
    };
  }, LAYER);
  step('the layer covers the preview pane (its content box, not the docks)', shape.covers, shape.rect);
  step('the layer sits in Live Preview’s own stacking context, just above the pane', shape.parent === 'live-preview-main' && shape.z === '2' && shape.onTop, `parent=.${shape.parent} z-index=${shape.z} on top at its left gutter=${shape.onTop}`);
  step('one view frame per breakpoint', shape.frames.length === config.bps.length && shape.frames.length === expected.length, `${shape.frames.length} frames, ${config.bps.length} breakpoints`);
  step('frames narrowest first, each at its breakpoint width × zoom',
    shape.frames.every((f, i) => f.bp === expected[i]?.handle && Math.abs(f.w - expected[i].width * shape.scale) <= 1.5 && (i === 0 || f.x > shape.frames[i - 1].x)),
    shape.frames.map((f, i) => `${f.bp} ${f.w.toFixed(1)}px ≈ ${expected[i]?.width}×${shape.scale.toFixed(3)}`).join(' | '));
  step('every frame is on screen and labelled', shape.frames.every((f) => f.shown && /\d+ px$/.test(f.label)), shape.frames.map((f) => `"${f.label}"`).join(' '));
  // The flag's value is the frame's size: one URL per frame, or Chrome queues
  // their requests behind each other (its cache lock) and every update waits.
  const activeHandle = shape.frames.find((f) => f.active)?.bp || '';
  // The active size's frame loads too: its copy sits under the preview, clipped out
  // by the hole, and shows the moment the preview moves to another size.
  step('every size loads with sve_view=<its size>, one URL each — the active size’s frame too, under the preview',
    shape.frames.every((f) => new URL(f.src).searchParams.get('sve_view') === f.bp) && new Set(shape.frames.map((f) => f.src)).size === shape.frames.length,
    shape.frames.map((f) => `${f.bp}${f.active ? ' (active)' : ''}: …${f.src.slice(f.src.indexOf('sve_view'))}`).join(' | '));
  const inSlot = await cp.evaluate((layerSel, bp) => {
    const layer = document.querySelector(layerSel);
    const slot = layer.querySelector(`[data-bp="${bp}"] iframe`).getBoundingClientRect();
    const f = document.getElementById('live-preview-iframe');
    const r = f.getBoundingClientRect();
    const hit = document.elementFromPoint(slot.x + slot.width / 2, slot.y + Math.min(slot.height / 2, 200));
    const zoomBtn = layer.querySelector('[data-bpo="in"]').getBoundingClientRect();
    const zoomHit = document.elementFromPoint(zoomBtn.x + zoomBtn.width / 2, zoomBtn.y + zoomBtn.height / 2);
    return { same: ['x', 'y', 'width', 'height'].every((k) => Math.abs(slot[k] - r[k]) <= 1), slot: `${Math.round(slot.x)},${Math.round(slot.y)} ${Math.round(slot.width)}x${Math.round(slot.height)}`, frame: `${Math.round(r.x)},${Math.round(r.y)} ${Math.round(r.width)}x${Math.round(r.height)}`, hit: hit ? `${hit.tagName.toLowerCase()}#${hit.id}` : 'nothing', clip: (layer.querySelector('.sve-bpo-scroll').style.clipPath || '').startsWith('polygon(evenodd'), band: JSON.stringify(f.contentWindow.__sveBand), fixed: getComputedStyle(f).position, zoomBar: !!zoomHit && !!zoomHit.closest('.sve-bpo-zoom') };
  }, LAYER, activeHandle);
  step('the active size is the preview itself: the iframe stands in the slot, and a point in the slot hits it, through the layer’s hole', inSlot.same && inSlot.hit === 'iframe#live-preview-iframe' && inSlot.clip && inSlot.fixed === 'fixed', `slot ${inSlot.slot}, preview ${inSlot.frame}, hit ${inSlot.hit}, band ${inSlot.band}`);
  step('the zoom bar stays on top of the preview, whole and clickable', inSlot.zoomBar);
  step('frames take no clicks (view only)', shape.frames.every((f) => f.pe === 'none'), shape.frames.map((f) => f.pe).join(' '));
  const baseHandle = config.bps.find((b) => b.base)?.handle;
  const pressedNow = await cp.evaluate(() => [...document.querySelectorAll('#__sve-preview-chrome [data-device][aria-pressed="true"]')].map((b) => b.dataset.device).join());
  const ringWant = config.bps.find((b) => b.device === pressedNow)?.handle || baseHandle;
  step('the ring is on the size the fields edit (the device this user has stored; the base size when none)', shape.frames.filter((f) => f.active).map((f) => f.bp).join() === ringWant, `active=${shape.frames.filter((f) => f.active).map((f) => f.bp).join() || 'none'}, device ${pressedNow || 'none'}`);
  step('the button says it is on', shape.pressed === 'true');
  step('iframes in the CP document = before + one per breakpoint', shape.iframes === iframesBefore + expected.length, `${shape.iframes} = ${iframesBefore} + ${expected.length}`);

  // 5. Each copy loaded the page, the one under the preview included. Without the
  //    bridge; the preview keeps its own. A frame switched out of the row is blank.
  const copyHandles = async () => { const out = []; for (const h of await cp.$$(`${LAYER} iframe`)) { if ((await (await h.getProperty('src')).jsonValue()) !== 'about:blank') out.push(h); } return out; };
  const copiesLoaded = (count) => until(async () => {
    const handles = await copyHandles();
    if (handles.length !== count) return null;
    const out = [];
    for (const h of handles) {
      const f = await h.contentFrame();
      if (!f || !(await f.evaluate(() => document.readyState === 'complete' && !!document.querySelector(`[data-sid-field="${window.__sveTestField}"]`)).catch(() => false))) return null;
      out.push(f);
    }
    return out;
  }, 30000, 300);
  // Every frame in the row, in order — the active size's copy under the preview among them.
  const copySpecs = expected;
  const copyNames = copySpecs.map((b) => (b.handle === activeHandle ? `${b.handle} (under the preview)` : b.handle));
  const frames = await copiesLoaded(copyNames.length);
  step('every copy loaded the page', !!frames, `${copyNames.join(', ')} (the preview is ${activeHandle})`);
  // Under test with the installed PHP, mirror.js arrives under preview.js's
  // URL; what tells them apart is what runs: mirror.js watches video pauses
  // (`document._sveVideoWatch`), preview.js does not.
  const inside = frames ? await Promise.all(frames.map((f) => f.evaluate((swapped) => ({
    bridge: !!document.querySelector('script[src*="bridge"]'),
    preview: !swapped && !!document.querySelector('script[src*="/preview-"]'),
    mirror: (swapped || !!document.querySelector('script[src*="/mirror-"]')) && document._sveVideoWatch === true,
    bridgeRan: '__sveBridgeReady' in window,
    bridgeUi: document.querySelectorAll('#__sve-bridge-styles, #__sve-inserters').length,
    width: innerWidth,
  }), SWAPPING))) : [];
  const mainHasBridge = await main.evaluate(() => !!document.querySelector('script[src*="bridge"]') && '__sveBridgeReady' in window);
  step('the preview itself still has its bridge', mainHasBridge);
  if (MIRROR_UNDER_TEST) {
    step('every view frame runs mirror.js alone — not preview.js, not the bridge', inside.length > 0 && inside.every((f) => f.mirror && !f.preview && !f.bridge), JSON.stringify(inside.map((f) => ({ mirror: f.mirror, preview: f.preview, bridge: f.bridge }))));
    if (SWAPPING) step('each copy frame was handed mirror.js by the test in place of the installed preview.js', copyScriptsSwapped >= copySpecs.length, `${copyScriptsSwapped} request(s)`);
  } else {
    skip('every view frame runs mirror.js', 'the installed InjectBridgeScript predates mirror.js and this is not a working-tree run');
  }
  step('every copy is laid out at its breakpoint width', inside.length > 0 && inside.every((f, i) => f.width === copySpecs[i].width), inside.map((f) => f.width).join(' '));
  if (PHP_HAS_VIEW_FLAG) {
    step('no bridge in any view frame: no script, never ran, no badges/outlines/toolbar', inside.every((f) => !f.bridge && !f.bridgeRan && f.bridgeUi === 0), JSON.stringify(inside));
  } else {
    skip('no bridge in any view frame', `the installed InjectBridgeScript has no sve_view (bridge present: ${inside.map((f) => f.bridge).join(' ')}); proven by InjectBridgeScriptTest until composer update`);
  }

  // 6. Type on the left: every frame follows (forwarded statamic.preview.updated), no reload.
  if (frames && field) {
    for (const f of frames) await f.evaluate(() => { window.__sveBpoFrameMarker = 1; });
    // When each window's morph finished, on one clock (Date.now is shared across same-origin frames).
    for (const f of [main, ...frames]) await f.evaluate(() => { window.__sveBpoMorphs = []; window.addEventListener('statamic:preview-updated', () => window.__sveBpoMorphs.push(Date.now())); });
    const fetches = { preview: 0, copies: 0 };
    const countFetch = (req) => { const u = req.url(); if (!/live-preview=/.test(u) || req.method() !== 'GET') return; if (/[?&]sve_view=/.test(u)) fetches.copies++; else fetches.preview++; };
    page.on('request', countFetch);
    const token = `Q${Date.now().toString(36).slice(-5)}`;
    const target = await cp.evaluate(() => {
      const editor = document.querySelector('.live-preview-editor');
      const el = [...editor.querySelectorAll('.ProseMirror[contenteditable="true"], input[type="text"], textarea')].find((e) => new RegExp(window.__sveTestFieldText, 'i').test(e.value ?? e.textContent ?? ''));
      el.scrollIntoView({ block: 'center', behavior: 'instant' });
      const r = el.getBoundingClientRect();
      return { x: r.right - 12, y: r.top + Math.min(r.height / 2, 14) };
    });
    const overlayBox = await (await page.$('iframe.sve-edit-overlay')).boundingBox();
    await page.mouse.click(overlayBox.x + target.x, overlayBox.y + target.y);
    await page.keyboard.press('End');
    // SVE_DEBUG: when Statamic's preview POST and each document fetch start and end.
    const timeline = [];
    const onReq = (req) => { if (/live-preview=|\/preview(?:[/?]|$)/.test(req.url())) timeline.push({ t: Date.now(), what: `→ ${req.method()} ${req.url().replace(SITE_URL, '').replace(/(live-preview|token)=[^&]+/g, '$1=…').slice(0, 90)}` }); };
    const onRes = (res) => { if (/live-preview=|\/preview(?:[/?]|$)/.test(res.url())) timeline.push({ t: Date.now(), what: `← ${res.status()} ${res.url().replace(SITE_URL, '').replace(/(live-preview|token)=[^&]+/g, '$1=…').slice(0, 90)}` }); };
    if (process.env.SVE_DEBUG) { page.on('request', onReq); page.on('response', onRes); }
    await page.keyboard.type(` ${token}`, { delay: 20 });
    const typedAt = Date.now();
    const has = (f) => f.evaluate((tk) => document.body.textContent.includes(tk), token).catch(() => false);
    // When each one first shows it: the preview, then every view frame.
    const seen = {};
    const names = ['preview', ...copyNames];
    const reached = await until(async () => {
      const now = Date.now() - typedAt;
      const got = await Promise.all([main, ...frames].map(has));
      got.forEach((ok, i) => { if (ok && seen[names[i]] == null) seen[names[i]] = now; });
      return got.every(Boolean);
    }, 10000, 50);
    const took = Date.now() - typedAt;
    const kept = await Promise.all(frames.map((f) => f.evaluate(() => window.__sveBpoFrameMarker === 1).catch(() => false)));
    step('typing on the left reaches the preview and every view frame within 3 s', !!reached && took <= 3000, `${reached ? `${took} ms after the last key` : 'not within 10 s'} (${names.map((n) => `${n} ${seen[n] ?? '–'} ms`).join(', ')}); token ${token}`);
    await sleep(400);
    page.off('request', countFetch);
    const morphs = await Promise.all([main, ...frames].map((f) => f.evaluate(() => window.__sveBpoMorphs || []).catch(() => [])));
    const previewMorph = morphs[0][morphs[0].length - 1];
    const lag = morphs.slice(1).map((list) => (list.length && previewMorph ? list[list.length - 1] - previewMorph : null));
    if (MIRROR_UNDER_TEST) {
      step('one server render per change: the preview fetched, the copies did not', fetches.preview >= 1 && fetches.copies === 0, `preview ${fetches.preview} fetch(es), copies ${fetches.copies}`);
      step('every copy morphed within 50 ms of the preview (the same render, handed on — not a round trip)', lag.every((ms) => ms !== null && ms >= 0 && ms <= 50), `after the preview's morph: ${copyNames.map((n, i) => `${n} ${lag[i] ?? '–'} ms`).join(', ')}`);
    } else {
      skip('one server render per change', 'mirror.js is not under test in this run');
    }
    if (process.env.SVE_DEBUG) {
      page.off('request', onReq);
      page.off('response', onRes);
      console.log(`DEBUG timeline (ms after the last key):\n${timeline.map((e) => `  ${String(e.t - typedAt).padStart(6)} ${e.what}`).join('\n')}`);
    }
    step('the view frames morphed in place (no reload)', kept.every(Boolean), kept.join(' '));
    for (let i = 0; i < token.length + 1; i++) await page.keyboard.press('Backspace');
    const gone = await until(async () => !(await has(main)) && (await Promise.all(frames.map(has))).every((v) => !v), 10000, 150);
    step('deleting it again reaches them too', !!gone);
    await sleep(600);
  } else {
    step('typing on the left reaches every view frame', false, 'no loaded frames or no field to type in');
  }

  // 7. Zoom and pan: a transform on the canvas; the layer scrolls.
  const zoomState = () => cp.evaluate((sel) => {
    const layer = document.querySelector(sel);
    const s = layer.querySelector('.sve-bpo-scroll');
    return { scale: new DOMMatrix(getComputedStyle(layer.querySelector('.sve-bpo-canvas')).transform).a, left: s.scrollLeft, top: s.scrollTop, sw: s.scrollWidth, cw: s.clientWidth, sh: s.scrollHeight, ch: s.clientHeight, level: layer.querySelector('[data-bpo="actual"]').textContent };
  }, LAYER);
  const z0 = await zoomState();
  await realClick(page, cp, `${LAYER} [data-bpo="in"]`);
  await sleep(250);
  const zIn = await zoomState();
  step('zoom in with the button: the canvas scales up, the level follows', zIn.scale > z0.scale && zIn.level === `${Math.round(zIn.scale * 100)}%`, `${z0.scale.toFixed(3)} → ${zIn.scale.toFixed(3)} (${zIn.level})`);
  step('zoomed in, the layer scrolls both ways', zIn.sw > zIn.cw && zIn.sh > zIn.ch, `scroll area ${zIn.sw}x${zIn.sh} in ${zIn.cw}x${zIn.ch}`);
  const layerBox = await absoluteRect(cp, LAYER);
  const cx = layerBox.x + layerBox.w / 2;
  const cy = layerBox.y + layerBox.h / 2;
  await page.mouse.move(cx, cy);
  await page.mouse.wheel({ deltaX: 240, deltaY: 400 });
  await sleep(300);
  const zWheel = await zoomState();
  step('the wheel scrolls the layer', zWheel.top > zIn.top && zWheel.left > zIn.left, `scroll ${zIn.left},${zIn.top} → ${zWheel.left},${zWheel.top}`);
  // Somewhere on the row that is not the preview: a drag on the preview itself
  // is the editor's (a section move), not a pan. The first point on a grid
  // over the layer that the scroller answers for, outside the active slot.
  const grip = await cp.evaluate((sel) => {
    const layer = document.querySelector(sel);
    const s = layer.querySelector('.sve-bpo-scroll');
    const lr = layer.getBoundingClientRect();
    const slot = layer.querySelector('[data-active] iframe')?.getBoundingClientRect();
    for (let y = lr.y + 10; y < lr.bottom - 60; y += 40) {
      for (let x = lr.x + 10; x < lr.right - 10; x += 40) {
        if (slot && x >= slot.left - 4 && x <= slot.right + 4 && y >= slot.top - 4 && y <= slot.bottom + 4) continue;
        const top = document.elementFromPoint(x, y);
        if (top && s.contains(top) && !top.closest('.sve-bpo-zoom')) return { x, y };
      }
    }
    return null;
  }, LAYER);
  const gripX = layerBox.x - (await absoluteRect(cp, LAYER)).x + (grip?.x ?? cx);
  const gripY = layerBox.y - (await absoluteRect(cp, LAYER)).y + (grip?.y ?? cy);
  await page.mouse.move(gripX, gripY);
  await page.mouse.down();
  await page.mouse.move(gripX + 120, gripY + 90, { steps: 6 });
  await page.mouse.up();
  await sleep(200);
  const zDrag = await zoomState();
  step('dragging the row (not the preview) pans the layer', !!grip && zDrag.left < zWheel.left && zDrag.top < zWheel.top, `from ${grip ? `${Math.round(grip.x)},${Math.round(grip.y)}` : 'no free point'}: scroll ${zWheel.left},${zWheel.top} → ${zDrag.left},${zDrag.top}`);
  await page.keyboard.down('Control');
  await page.mouse.wheel({ deltaY: 300 });
  await page.keyboard.up('Control');
  await sleep(250);
  const zCtrl = await zoomState();
  const pageZoom = await page.evaluate(() => window.visualViewport?.scale ?? 1);
  step('ctrl + wheel zooms the canvas, not the browser', zCtrl.scale < zDrag.scale && pageZoom === 1, `${zDrag.scale.toFixed(3)} → ${zCtrl.scale.toFixed(3)}, page zoom ${pageZoom}`);
  await realClick(page, cp, `${LAYER} [data-bpo="out"]`);
  await sleep(250);
  const zOut = await zoomState();
  step('zoom out with the button', zOut.scale < zCtrl.scale, `${zCtrl.scale.toFixed(3)} → ${zOut.scale.toFixed(3)}`);
  await realClick(page, cp, `${LAYER} [data-bpo="fit"]`);
  await sleep(250);
  const zFit = await zoomState();
  const fits = await cp.evaluate((sel) => { const layer = document.querySelector(sel); const lr = layer.getBoundingClientRect(); return [...layer.querySelectorAll('iframe')].every((f) => { const r = f.getBoundingClientRect(); return r.left >= lr.left - 1 && r.right <= lr.right + 1; }); }, LAYER);
  step('fit all: every frame is in view again', Math.abs(zFit.scale - z0.scale) < 0.002 && fits, `scale ${zFit.scale.toFixed(3)} (opened at ${z0.scale.toFixed(3)})`);

  // 7b. While open, every size's button in the top bar carries a mark. Its
  //     click takes that size out of the row (frame blanked) and nothing else —
  //     the size the fields edit stays; again, and the size is back, live.
  const pressedDevice = () => cp.evaluate(() => [...document.querySelectorAll('#__sve-preview-chrome [data-device][aria-pressed="true"]')].map((b) => b.dataset.device).join());
  const rowWidthNow = () => cp.evaluate((sel) => document.querySelector(`${sel} .sve-bpo-sizer`).getBoundingClientRect().width, LAYER);
  const sizeState = (bp) => cp.evaluate((sel, handle) => {
    const item = document.querySelector(`${sel} [data-bp="${handle}"]`);
    return { out: !!item && item.hidden && getComputedStyle(item).display === 'none', src: item?.querySelector('iframe')?.getAttribute('src') || '', mark: document.querySelector(`.sve-bpo-badge[data-bpo-badge="${handle}"]`)?.hasAttribute('data-on') };
  }, LAYER, bp);
  const marks = await cp.evaluate(() => [...document.querySelectorAll('#__sve-preview-chrome [data-sve-devices] .sve-bpo-badge')].map((b) => {
    const r = b.getBoundingClientRect();
    return { bp: b.dataset.bpoBadge, on: b.hasAttribute('data-on'), w: r.width, inButton: !!b.closest('[data-device]'), tone: getComputedStyle(b).backgroundColor };
  }));
  // One tone on every button — the lit one included — so the marks sit beside the buttons, not in them.
  step('every size in the row has an on/off mark at its icon, in one tone', marks.length === expected.length && marks.every((m) => m.on && m.w > 0 && !m.inButton) && new Set(marks.map((m) => m.tone)).size === 1,
    `${marks.map((m) => `${m.bp}:${m.on ? 'on' : 'off'}`).join(' ')} · tone ${marks[0]?.tone}`);
  // A mark for a size in the row is filled with the ring's blue — the same colour that frames the active size.
  step('the marks of the sizes in the row are the ring’s blue', marks.length > 0 && marks.every((m) => m.tone === 'rgb(96, 165, 250)'), marks[0]?.tone || 'no marks');
  const middle = expected.find((b) => b.handle !== activeHandle && b.handle !== expected[0].handle) || expected.find((b) => b.handle !== activeHandle);
  const markSel = (handle) => `#__sve-preview-chrome .sve-bpo-badge[data-bpo-badge="${handle}"]`;
  const pressedBefore = await pressedDevice();
  const rowBefore = await rowWidthNow();
  await realClick(page, cp, markSel(middle.handle));
  await sleep(300);
  const off = await sizeState(middle.handle);
  const rowOff = await rowWidthNow();
  step(`${middle.device}'s mark takes it out of the row, its frame blanked`, off.out && off.src === 'about:blank' && off.mark === false && rowOff < rowBefore, `out=${off.out} src=${off.src} mark on=${off.mark} row ${Math.round(rowBefore)}→${Math.round(rowOff)} px`);
  step('the mark does not change the size the fields edit', (await pressedDevice()) === pressedBefore, `pressed device stays ${pressedBefore}`);
  // Every other size can go; the active one — the preview — stays whatever is pressed.
  const restSizes = expected.filter((b) => b.handle !== middle.handle && b.handle !== activeHandle);
  for (const b of restSizes) await realClick(page, cp, markSel(b.handle));
  await realClick(page, cp, markSel(activeHandle));
  await sleep(300);
  step('with every other size switched out, the active size stays in', !(await sizeState(activeHandle)).out && restSizes.every(async (b) => (await sizeState(b.handle)).out), `${activeHandle} still shown`);
  for (const b of [...restSizes, middle]) await realClick(page, cp, markSel(b.handle));
  const back = await until(async () => {
    const states = await Promise.all(expected.map((b) => sizeState(b.handle)));
    if (states.some((s) => s.out || !s.mark)) return null;
    for (const h of await copyHandles()) { const f = await h.contentFrame(); if (!f || !(await f.evaluate(() => !!document.querySelector(`[data-sid-field="${window.__sveTestField}"]`)).catch(() => false))) return null; }
    return states;
  }, 20000, 300);
  step('marked in again, every size is back in the row and every copy loaded', !!back && back.every((s, i) => new URL(s.src).searchParams.get('sve_view') === expected[i].handle), back ? back.map((s) => s.src === 'about:blank' ? 'blank' : s.src.slice(s.src.indexOf('sve_view'))).join(' | ') : 'not within 20 s');
  const activeMark = await sizeState(activeHandle);
  await realClick(page, cp, markSel(activeHandle));
  await sleep(300);
  step('the active size’s mark does nothing: the size being edited stays in the row', !(await sizeState(activeHandle)).out && (await sizeState(activeHandle)).mark === activeMark.mark, `${activeHandle} still in`);

  // 8. Escape closes; everything is as it was.
  await page.keyboard.press('Escape');
  const layerGone = await until(() => cp.evaluate((sel) => !document.querySelector(sel), LAYER), 3000);
  const after = await cp.evaluate(() => {
    const f = document.getElementById('live-preview-iframe');
    return {
      style: !!document.getElementById('__sve-bp-overview-style'),
      iframes: document.querySelectorAll('iframe').length,
      pressed: document.querySelector('#__sve-preview-chrome [data-overview]')?.getAttribute('aria-pressed'),
      src: f?.getAttribute('src'),
      transform: f?.style.transform,
      css: f?.style.cssText,
      cls: f?.className,
      marker: f?.contentWindow?.__sveBpoMarker,
      marks: document.querySelectorAll('.sve-bpo-badge').length,
      groupPosition: document.querySelector('#__sve-preview-chrome [data-sve-devices]')?.style.position,
    };
  });
  step('Escape closes: layer and its style gone, button off', !!layerGone && !after.style && after.pressed === 'false');
  step('closed, the marks are gone and the size group is as it was', after.marks === 0 && after.groupPosition === groupPositionBefore, `marks ${after.marks}, group position "${after.groupPosition}" (was "${groupPositionBefore}")`);
  step('Escape did not close Live Preview', opened && !!(await page.$('iframe.sve-edit-overlay[data-open]')) && after.src != null);
  step('iframes in the CP document back to before', after.iframes === iframesBefore, `${after.iframes} (before ${iframesBefore})`);
  step('the preview frame is untouched: same src, transform and window', after.src === mainBefore.src && after.transform === mainBefore.transform && after.marker === 'before',
    `src same=${after.src === mainBefore.src} transform "${after.transform}" (was "${mainBefore.transform}") window kept=${after.marker === 'before'}`);
  info('preview frame style and class', after.css === mainBefore.css && after.cls === mainBefore.cls ? 'identical to before' : `now "${after.css}" .${after.cls} — before "${mainBefore.css}" .${mainBefore.cls}`);

  // 9. A second round, measured by DevTools: every listener it bound is gone
  //    again, and the same button closes it.
  const listenersBefore = await listenerSnapshot(cp);
  await realClick(page, cp, BUTTON);
  step('the button opens it again', await waitIn(cp, LAYER, 10000));
  await copiesLoaded(expected.length);
  const listenersOpen = await listenerSnapshot(cp);
  const hookOpen = await cp.evaluate(() => typeof document.getElementById('live-preview-iframe').contentWindow.__sveMirror);
  await realClick(page, cp, BUTTON);
  // The button's click runs through import(): the close lands a task later.
  const closedByButton = await until(() => cp.evaluate((sel) => !document.querySelector(sel), LAYER), 3000);
  step('the same button closes it', !!closedByButton);
  const listenersAfter = await listenerSnapshot(cp);
  const hookAfter = await cp.evaluate(() => { const w = document.getElementById('live-preview-iframe').contentWindow; return { mirror: '__sveMirror' in w, band: '__sveBand' in w, fixed: getComputedStyle(document.getElementById('live-preview-iframe')).position }; });
  step('open, the preview window carries the mirror hook; closed, the hook and the band are gone and the iframe is no longer fixed', hookOpen === 'function' && !hookAfter.mirror && !hookAfter.band && hookAfter.fixed !== 'fixed', `open: ${hookOpen}, after close: mirror ${hookAfter.mirror}, band ${hookAfter.band}, position ${hookAfter.fixed}`);
  // The measurement has to see the overview's own listeners while it is open,
  // or a clean "after" proves nothing: Escape and the ring on the CP window,
  // the preview's load on the pane, the preview's morph on its window.
  const own = { before: ownListeners(listenersBefore), open: ownListeners(listenersOpen), after: ownListeners(listenersAfter) };
  // On the preview: the FOCUS message and the edit's end on its window; wheel and input (an inline edit's keystrokes) on its document.
  const want = { cpWindow: ['keydown', 'sve:breakpoint'], cpDocument: [], pane: ['load(capture)'], previewWindow: ['message', 'sve:inline-edit-end'], previewDocument: ['input(capture)', 'wheel'] };
  const show = (map) => Object.entries(map).map(([k, types]) => `${k} [${types.join(' ')}]`).join(', ');
  step('before opening, the overview has no listener anywhere (DevTools)', Object.values(own.before).every((types) => types.length === 0), show(own.before));
  step('open, DevTools sees exactly the overview’s own listeners', JSON.stringify(own.open) === JSON.stringify(Object.fromEntries(Object.entries(want).map(([k, v]) => [k, [...v].sort()]))), show(own.open));
  step('closed, every listener it bound is gone (DevTools)', Object.values(own.after).every((types) => types.length === 0), show(own.after));
  info('all listeners on those objects (the editor binds its own meanwhile)', Object.keys(listenersBefore).map((k) => `${k} ${listenersBefore[k].length}→${listenersOpen[k].length}→${listenersAfter[k].length}`).join(', '));
  const others = Object.fromEntries(Object.keys(listenersAfter).map((k) => [k, listenersAfter[k].filter((l) => !listenersBefore[k].some((b) => b.type === l.type && b.script === l.script)).map((l) => `${l.type}@${l.script || '?'}`)]));
  if (process.env.SVE_DEBUG) for (const [name, snap] of Object.entries({ open: listenersOpen, after: listenersAfter })) console.log(`DEBUG own listeners ${name}:`, Object.entries(snap).map(([k, list]) => `${k} ${list.filter((l) => /^breakpoint-overview-/.test(l.script)).map((l) => `${l.type}@${l.at}`).join(' ')}`).join(' | '));
  if (Object.values(others).some((list) => list.length)) info('bound by others while it was open', Object.entries(others).filter(([, l]) => l.length).map(([k, l]) => `${k}: ${[...new Set(l)].join(' ')}`).join(' | '));

  // 10. The ring follows the size the fields edit (a device picked in the top bar).
  const mobile = expected[0];
  await realClick(page, cp, BUTTON);
  await waitIn(cp, LAYER, 10000);
  await realClick(page, cp, `#__sve-preview-chrome [data-device="${mobile.device}"]`);
  const ring = await until(() => cp.evaluate((sel) => [...document.querySelectorAll(`${sel} [data-active]`)].map((el) => el.dataset.bp).join() || null, LAYER), 3000);
  step('picking a device in the top bar moves the ring', ring === mobile.handle, `ring on ${ring} after picking ${mobile.device}`);

  // 10b. At 100 % the row is wider than the pane. Picking a size in the top
  //      bar scrolls the row sideways so that size's frame stands whole in
  //      view — measured as the frame's box against the scroller's, after a
  //      real click on each button, in an order where every click has to undo
  //      the scroll the one before it left. Desktop is as wide as the pane and
  //      so can never be whole: its left edge stands at the pane's left edge.
  await realClick(page, cp, `${LAYER} [data-bpo="actual"]`);
  await sleep(250);
  const atActual = await zoomState();
  step('at 100 % the row is wider than the pane, so there is something to scroll to', Math.abs(atActual.scale - 1) < 0.001 && atActual.sw > atActual.cw, `scale ${atActual.scale.toFixed(3)}, row ${atActual.sw} px in a ${atActual.cw} px pane`);
  const placeOf = (handle) => cp.evaluate((sel, bp) => {
    const s = document.querySelector(`${sel} .sve-bpo-scroll`);
    const f = document.querySelector(`${sel} [data-bp="${bp}"] iframe`);
    const v = s.getBoundingClientRect();
    const r = f.getBoundingClientRect();
    const p = document.getElementById('live-preview-iframe').getBoundingClientRect();
    return { left: Math.round(r.left - v.left), right: Math.round(r.right - v.left), width: Math.round(r.width), view: s.clientWidth, scrollLeft: Math.round(s.scrollLeft), ring: document.querySelector(`${sel} [data-active]`)?.dataset.bp || '', previewInSlot: Math.abs(p.left - r.left) <= 1 && Math.abs(p.top - r.top) <= 1 };
  }, LAYER, handle);
  const RING = 4; // 2 px outline + 2 px offset, kept in view with the frame
  const widest = expected[expected.length - 1];
  const narrowest = expected[0];
  const order = [widest, narrowest, ...expected.slice(1, -1), widest, narrowest];
  const scrolls = [];
  let allWhole = true;
  const isWhole = (at) => { const wider = at.width + RING * 2 >= at.view; return wider ? at.left >= 0 && at.left <= RING + 1 : at.left >= RING - 1 && at.right <= at.view - RING + 1; };
  for (const b of order) {
    await realClick(page, cp, `#__sve-preview-chrome [data-device="${b.device}"]`);
    // The reveal is a glide of about a third of a second, not a jump: it lands
    // after some time, passes through positions on the way, and the preview
    // stands in its slot at every reading — placed in the same turn as the row.
    const seenAt = Date.now();
    const positions = new Set();
    let trailed = 0;
    const at = await until(async () => { const p = await placeOf(b.handle); if (p.ring === b.handle) { positions.add(p.scrollLeft); if (!p.previewInSlot) trailed++; } return p.ring === b.handle && isWhole(p) ? p : null; }, 3000, 15);
    const landed = Date.now() - seenAt;
    if (!at) { allWhole = false; step(`picking ${b.device} moves the ring and brings its frame into view`, false, `not within 3 s: ${JSON.stringify(await placeOf(b.handle))}`); continue; }
    const wider = at.width + RING * 2 >= at.view;
    const moved = scrolls.length === 0 || scrolls[scrolls.length - 1] !== at.scrollLeft;
    scrolls.push(at.scrollLeft);
    step(`picking ${b.device}: its frame is ${wider ? 'at the pane\'s left edge (wider than the pane)' : 'whole in view'}`, true, `frame ${at.left}…${at.right} px in a ${at.view} px pane (width ${at.width}), row scrolled to ${at.scrollLeft}`);
    if (moved) step(`picking ${b.device}: the row glided there rather than jumping, with the preview in its slot the whole way`, landed >= 200 && positions.size >= 3 && trailed === 0, `landed after ${landed} ms through ${positions.size} positions; preview trailing the slot at ${trailed} of the readings`);
  }
  // The row moved between the picks: the narrowest and the widest cannot both be in view at 100 %.
  step('the row scrolled to get there (it was not already in view)', allWhole && new Set(scrolls).size > 1, `scroll positions ${scrolls.join(' → ')}`);
  await realClick(page, cp, `${LAYER} [data-bpo="fit"]`);
  await sleep(250);

  // 10c. The active size is the preview, with the whole editor: a click in it
  //      reaches the bridge, a wheel over it pans the row, FOCUS pans the row
  //      to the element, a click on another size makes that size the active
  //      one and swaps the preview and the copy, and a confirm card opened in
  //      the page-high preview sits in the part of it that is on screen.
  const previewNow = async () => (await cp.$('#live-preview-iframe'))?.contentFrame();
  const rowGeo = () => cp.evaluate((sel) => {
    const layer = document.querySelector(sel);
    const s = layer.querySelector('.sve-bpo-scroll');
    const f = document.getElementById('live-preview-iframe');
    const active = layer.querySelector('[data-active]');
    const slot = active?.querySelector('iframe').getBoundingClientRect();
    const fr = f.getBoundingClientRect();
    const view = s.getBoundingClientRect();
    return { active: active?.dataset.bp || '', scroll: [s.scrollLeft, s.scrollTop], max: [s.scrollWidth - s.clientWidth, s.scrollHeight - s.clientHeight], z: new DOMMatrix(getComputedStyle(layer.querySelector('.sve-bpo-canvas')).transform).a, slot: slot ? { x: slot.x, y: slot.y, w: slot.width, h: slot.height } : null, frame: { x: fr.x, y: fr.y, w: fr.width, h: fr.height }, view: { x: view.x, y: view.y, w: s.clientWidth, h: s.clientHeight }, pressed: [...document.querySelectorAll('#__sve-preview-chrome [data-device][aria-pressed="true"]')].map((b) => b.dataset.device).join() };
  }, LAYER);
  const overlayBox2 = await (await page.$('iframe.sve-edit-overlay')).boundingBox();
  const inActive = async (previewPoint) => { const g = await rowGeo(); return { x: overlayBox2.x + g.frame.x + previewPoint.x * g.z, y: overlayBox2.y + g.frame.y + previewPoint.y * g.z, g }; };
  await cp.evaluate(() => { window.__sveBpoMsgs = []; window.addEventListener('message', (e) => { const d = e.data || {}; if (d.source === 'statamic-visual-editor' && /^(click|hover|edit-request)$/.test(d.type)) window.__sveBpoMsgs.push(`${d.type}${d.field ? ' field=' + d.field : ''}${d.uid ? ' uid' : ''}`); }); });
  // The field's place in the preview — read once the document holds it again (a morph may be replacing it this instant).
  const headlineAt = await until(() => previewNow().then((f) => f.evaluate(() => { const el = document.querySelector(`[data-sid-field="${window.__sveTestField}"]`); if (!el) return null; el.scrollIntoView({ block: 'center' }); const r = el.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; })), 8000, 200);
  // The row scrolled so the headline is on screen, then a real click on it in the active frame.
  await cp.evaluate((sel, y) => { const layer = document.querySelector(sel); const s = layer.querySelector('.sve-bpo-scroll'); const z = new DOMMatrix(getComputedStyle(layer.querySelector('.sve-bpo-canvas')).transform).a; s.scrollTop = Math.max(0, y * z - 200); }, LAYER, headlineAt.y);
  await sleep(300);
  let at = await inActive(headlineAt);
  await page.mouse.move(at.x, at.y); await sleep(300);
  await page.mouse.click(at.x, at.y); await sleep(1500);
  const msgs = await cp.evaluate(() => (window.__sveBpoMsgs || []).splice(0));
  const fieldShown = await cp.evaluate(() => { const editor = document.querySelector('.live-preview-editor'); const r = editor?.getBoundingClientRect(); return !!r && r.right > 0 && [...editor.querySelectorAll('.ProseMirror[contenteditable="true"], input[type="text"], textarea')].some((el) => { const b = el.getBoundingClientRect(); return b.width > 0 && b.left >= 0 && new RegExp(window.__sveTestFieldText, 'i').test(el.value ?? el.textContent ?? ''); }); });
  step('a click on the headline in the active frame reaches the bridge and opens the field on the left, as in one preview', msgs.some((m) => m.startsWith(`click field=${FIELD}`)) && fieldShown, `bridge sent [${msgs.join(', ')}] at ${Math.round(at.x)},${Math.round(at.y)} (${at.g.active} at zoom ${at.g.z.toFixed(3)}); field shown: ${fieldShown}`);
  // Keys in the preview are the bridge's: Escape there ends the edit the click began, and never closes the overview.
  await page.keyboard.press('Escape'); await sleep(400);
  const stillOpen = !!(await cp.$(LAYER));
  step('Escape inside the active frame is the bridge’s and leaves the overview open', stillOpen);
  if (!stillOpen) { await realClick(page, cp, BUTTON); await waitIn(cp, LAYER, 10000); await copiesLoaded(expected.length); }
  // A wheel over the active frame pans the row; the preview moves with it in the same turn.
  const g0 = await rowGeo();
  await page.mouse.move(overlayBox2.x + g0.frame.x + Math.min(g0.frame.w, g0.view.w) / 2, overlayBox2.y + Math.max(g0.frame.y, g0.view.y) + 100);
  await page.mouse.wheel({ deltaY: 200 }); await sleep(300);
  const g1 = await rowGeo();
  step('a wheel over the active frame pans the row, and the preview stays in its slot', g1.scroll[1] - g0.scroll[1] >= 100 && Math.abs(g1.frame.y - g1.slot.y) <= 1 && Math.abs((g0.frame.y - g1.frame.y) - (g1.scroll[1] - g0.scroll[1])) <= 1, `scroll ${g0.scroll[1]} → ${g1.scroll[1]}; preview top ${Math.round(g0.frame.y)} → ${Math.round(g1.frame.y)}; slot top ${Math.round(g1.slot.y)}`);
  // FOCUS with a uid — what a section clicked in the Control Panel sends — pans the row to that section, top first.
  await cp.evaluate((sel) => { document.querySelector(`${sel} .sve-bpo-scroll`).scrollTop = 0; }, LAYER); await sleep(200);
  const lastSection = await (await previewNow()).evaluate(() => { const list = [...document.querySelectorAll('[data-sid-section-orderable]')]; const el = list[list.length - 1]; return { sid: el.getAttribute('data-sid'), top: el.getBoundingClientRect().top }; });
  const gBefore = await rowGeo();
  // Where the section's top is in the row, and the scroll that puts it 48 px (× zoom) below the view's top — or as far as the row goes, as the bridge's own scroll would at the page's end.
  const sectionTop = gBefore.slot.y - gBefore.view.y + lastSection.top * gBefore.z;
  const wantScroll = Math.min(Math.max(0, Math.round(sectionTop - 48 * gBefore.z)), gBefore.max[1]);
  await cp.evaluate((sid) => document.getElementById('live-preview-iframe').contentWindow.postMessage({ source: 'statamic-visual-editor', type: 'focus', uid: sid }, '*'), lastSection.sid);
  await sleep(700);
  const g2 = await rowGeo();
  const sectionOnScreen = g2.slot.y - g2.view.y + lastSection.top * g2.z;
  step('FOCUS on a section pans the row so the section stands at the top of the view (or as far as the row goes), and the preview keeps its slot', g2.scroll[1] > 0 && Math.abs(g2.scroll[1] - wantScroll) <= 2 && Math.abs(g2.frame.y - g2.slot.y) <= 1, `scroll ${gBefore.scroll[1]} → ${g2.scroll[1]} (wanted ${wantScroll}, the row's most ${gBefore.max[1]}); section at ${Math.round(sectionOnScreen)} px from the view top`);
  // A click on another size's frame makes it the active one: the preview moves there, and the size it left gets a copy.
  const wasActive = g2.active;
  const other = expected.find((b) => b.handle !== wasActive && b.handle === activeHandle) || expected.find((b) => b.handle !== wasActive);
  await cp.evaluate((sel) => { document.querySelector(`${sel} .sve-bpo-scroll`).scrollTop = 0; }, LAYER); await sleep(200);
  const target = await cp.evaluate((sel, bp) => { const r = document.querySelector(`${sel} [data-bp="${bp}"] iframe`).getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + Math.min(r.height / 2, 150) }; }, LAYER, other.handle);
  // The document in the frame the preview is about to leave, marked: a reload would lose the mark.
  await cp.evaluate((sel, bp) => { const f = document.querySelector(`${sel} [data-bp="${bp}"] iframe`); if (f.contentDocument) f.contentDocument.__sveSameDocument = true; }, LAYER, wasActive);
  await page.mouse.click(overlayBox2.x + target.x, overlayBox2.y + target.y);
  const swapped = await until(async () => { const g = await rowGeo(); return g.active === other.handle && g.pressed === other.device && g.slot && Math.abs(g.frame.x - g.slot.x) <= 1 && Math.abs(g.frame.w - g.slot.w) <= 1 ? g : null; }, 5000, 100);
  const left = await until(() => cp.evaluate((sel, bp) => { const f = document.querySelector(`${sel} [data-bp="${bp}"] iframe`); const src = f.getAttribute('src') || ''; return src.includes(`sve_view=${bp}`) && !!f.contentDocument?.querySelector(`[data-sid-field="${window.__sveTestField}"]`) ? src.slice(src.indexOf('sve_view')) : null; }, LAYER, wasActive), 20000, 300);
  step(`a click on the ${other.device} frame makes it the active size: the preview stands there, and ${wasActive} is a copy again`, !!swapped && !!left, swapped ? `active ${swapped.active}, pressed ${swapped.pressed}, preview ${Math.round(swapped.frame.w)} px wide in the slot; ${wasActive}'s frame: ${left || 'not loaded within 20 s'}` : 'no swap within 5 s');
  const sameDocument = await cp.evaluate((sel, bp) => !!document.querySelector(`${sel} [data-bp="${bp}"] iframe`)?.contentDocument?.__sveSameDocument, LAYER, wasActive);
  step(`${wasActive}'s frame was not reloaded by the switch: the page was already there, under the preview`, sameDocument, sameDocument ? 'same document before and after' : 'a new document — the frame loaded again');

  // 10e. An inline edit in the preview reaches every frame as it is typed: the
  //      preview holds its morphs back while the edit lasts, so the frames are painted.
  const fieldPoint = await (await previewNow()).evaluate((field) => { const el = document.querySelector(`[data-sid-field="${field}"]`); if (!el) return null; const r = el.getBoundingClientRect(); return { x: r.x + Math.min(r.width / 2, 120), y: r.y + Math.min(r.height / 2, 24) }; }, FIELD);
  if (fieldPoint) {
    at = await inActive(fieldPoint);
    await page.mouse.click(at.x, at.y);
    const editing = await until(() => previewNow().then((f) => f.evaluate(() => !!document.querySelector('[data-sve-editing], [contenteditable="true"]'))), 6000, 100);
    if (editing) {
      const token = `Zq${Math.random().toString(36).slice(2, 5)}`;
      const viewFrames = (await Promise.all((await copyHandles()).map((h) => h.contentFrame()))).filter(Boolean);
      const holds = (f) => f.evaluate((tk) => document.body.textContent.includes(tk), token).catch(() => false);
      await page.keyboard.type(token);
      const typedDone = Date.now();
      const painted = await until(async () => (await Promise.all(viewFrames.map(holds))).every(Boolean) ? Date.now() - typedDone : null, 3000, 10);
      step('typing inline in the preview paints the text into every frame at once', painted != null && painted <= 100, painted != null ? `every frame had it ${painted} ms after the last key (${viewFrames.length} frames)` : `not in every frame within 3 s: ${(await Promise.all(viewFrames.map(holds))).join(',')}`);
      const noMarks = await Promise.all(viewFrames.map((f) => f.evaluate(() => !document.querySelector('[contenteditable="true"], [data-sve-editing]')).catch(() => false)));
      step('the frames took the text, not the editing marks', noMarks.every(Boolean), noMarks.join(','));
      await page.keyboard.press('Escape');
      const restored = await until(async () => { const inPreview = await holds(await previewNow()); const inFrames = await Promise.all(viewFrames.map(holds)); return !inPreview && inFrames.every((v) => !v) ? true : null; }, 4000, 50);
      step('Escape cancels the edit, and every frame shows the old text again', !!restored, restored ? 'gone from the preview and every frame' : `preview ${await holds(await previewNow())}, frames ${(await Promise.all(viewFrames.map(holds))).join(',')}`);
    } else {
      skip('inline edit mirrored into the frames', 'a click on the field did not start an inline edit');
    }
  } else {
    skip('inline edit mirrored into the frames', `no [data-sid-field="${FIELD}"] in the preview`);
  }
  await sleep(250);

  // A confirm card in the page-high preview: in the part of the page that is on screen.
  const header = await (await previewNow()).evaluate(() => { const el = document.querySelector('[data-sve-chrome="header"]'); if (!el) return null; const r = el.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + Math.min(r.height / 2, 20) }; });
  if (header) {
    at = await inActive(header);
    await page.mouse.move(at.x, at.y); await sleep(300);
    await page.mouse.click(at.x, at.y);
    const card = await until(() => (previewNow().then((f) => f.evaluate(() => { const o = document.getElementById('__sve-preview-confirm'); if (!o) return null; const r = o.firstElementChild.getBoundingClientRect(); const band = window.__sveBand; const btn = o.querySelector('[data-sve-actions] button'); const b = btn?.getBoundingClientRect(); return { top: r.top, bottom: r.bottom, band, cancel: b ? { x: b.x + b.width / 2, y: b.y + b.height / 2, label: btn.textContent.trim() } : null }; }))), 4000, 100);
    step('a confirm card opened in the active frame sits inside the part of the page on screen', !!card && !!card.band && card.top >= card.band.top - 1 && card.bottom <= card.band.top + card.band.height + 1, card ? `card ${Math.round(card.top)}..${Math.round(card.bottom)} in band ${Math.round(card.band.top)}..${Math.round(card.band.top + card.band.height)}` : 'no confirm card within 4 s (the header click asked nothing)');
    if (card?.cancel) { at = await inActive(card.cancel); await page.mouse.click(at.x, at.y); await sleep(500); step(`${card.cancel.label} in that card can be clicked where it shows`, await (await previewNow()).evaluate(() => !document.getElementById('__sve-preview-confirm'))); }
  } else {
    skip('a confirm card in the active frame', 'the page has no header to ask about');
  }
  await realClick(page, cp, `${LAYER} [data-bpo="fit"]`);

  // 10d. The label above a frame (its name and width) is a way in too, and the way back.
  const labelPoint = (bp) => cp.evaluate((sel, handle) => { const r = document.querySelector(`${sel} [data-bp="${handle}"] .sve-bpo-label`).getBoundingClientRect(); return { x: r.x + Math.min(r.width / 2, 40), y: r.y + r.height / 2 }; }, LAYER, bp);
  let lp = await labelPoint(wasActive);
  await page.mouse.click(overlayBox2.x + lp.x, overlayBox2.y + lp.y);
  const byLabel = await until(async () => { const g = await rowGeo(); return g.active === wasActive && g.slot && Math.abs(g.frame.x - g.slot.x) <= 1 ? g : null; }, 5000, 100);
  step(`a click on ${wasActive}'s label makes it the active size again`, !!byLabel, byLabel ? `active ${byLabel.active}, pressed ${byLabel.pressed}` : 'not within 5 s');
  lp = await labelPoint(other.handle);
  await page.mouse.click(overlayBox2.x + lp.x, overlayBox2.y + lp.y);
  const backByLabel = await until(async () => { const g = await rowGeo(); return g.active === other.handle && g.slot && Math.abs(g.frame.x - g.slot.x) <= 1 ? g : null; }, 5000, 100);
  step(`and ${other.device}'s label brings the preview back there`, !!backByLabel, backByLabel ? `active ${backByLabel.active}` : 'not within 5 s');

  // 10d2. The other frames step back while a size is picked; with Responsive (the strip's "All") every frame stands alike.
  const frameOpacities = () => cp.evaluate((sel) => [...document.querySelectorAll(`${sel} [data-bp]`)].map((item) => ({ bp: item.dataset.bp, active: item.hasAttribute('data-active'), opacity: getComputedStyle(item.querySelector('iframe')).opacity })), LAYER);
  // Read once the 150 ms fade after the last switch has settled.
  const settled = (want) => until(async () => { const o = await frameOpacities(); return o.some((x) => x.active) && o.every((x) => x.opacity === (x.active ? '1' : want)) ? o : null; }, 3000, 50);
  let ops = (await settled('0.7')) || (await frameOpacities());
  step('with a size picked, every other frame stands at 70 % and the picked one at 100 %', ops.some((o) => o.active) && ops.every((o) => o.active ? o.opacity === '1' : o.opacity === '0.7'), ops.map((o) => `${o.bp}${o.active ? '*' : ''} ${o.opacity}`).join(' '));
  const responsive = await cp.$('#__sve-preview-chrome [data-device="Responsive"]');
  if (responsive) {
    const pickedBefore = await pressedDevice();
    await realClick(page, cp, '#__sve-preview-chrome [data-device="Responsive"]');
    const alike = await until(async () => { const o = await frameOpacities(); return o.every((x) => x.opacity === '1') ? o : null; }, 3000, 100);
    step('Responsive picked: every frame stands alike at 100 %', !!alike, (alike || (await frameOpacities())).map((o) => `${o.bp}${o.active ? '*' : ''} ${o.opacity}`).join(' '));
    await realClick(page, cp, `#__sve-preview-chrome [data-device="${other.device}"]`);
    const back = await until(async () => { const o = await frameOpacities(); return o.some((x) => x.active) && o.every((x) => x.active ? x.opacity === '1' : x.opacity === '0.7') ? o : null; }, 3000, 100);
    step(`${other.device} picked again: the others step back again`, !!back, (back || (await frameOpacities())).map((o) => `${o.bp}${o.active ? '*' : ''} ${o.opacity}`).join(' ') + ` (was ${pickedBefore})`);
  } else {
    skip('Responsive: every frame alike', 'no Responsive button in the top bar');
  }

  // 10f. A section dragged in from the library: the row zooms so the active
  //      frame's whole page is in view, and the release puts zoom and scroll back.
  await realClick(page, cp, '#__sve-toolbar button[data-tab="sections"]');
  const libraryCard = await until(() => cp.evaluate(() => { const el = document.querySelector('[data-sve-lib-kind]'); if (!el) return null; const r = el.getBoundingClientRect(); return r.width > 20 && r.height > 20 ? { x: r.x + r.width / 2, y: r.y + Math.min(r.height / 2, 60) } : null; }), 10000, 250);
  if (libraryCard) {
    await realClick(page, cp, `${LAYER} [data-bpo="actual"]`);
    await sleep(500);
    const gBefore = await rowGeo();
    const whole = (g) => g.frame.x >= g.view.x - 1 && g.frame.x + g.frame.w <= g.view.x + g.view.w + 1 && g.frame.y >= g.view.y - 1 && g.frame.y + g.frame.h <= g.view.y + g.view.h + 1;
    info('before the drag', `zoom ${gBefore.z.toFixed(3)}, scroll ${gBefore.scroll.join(',')}, active frame whole in view: ${whole(gBefore)}`);
    await cp.evaluate(() => { window.__bpLog = []; const orig = window.dispatchEvent.bind(window); window.__bpOrigDispatch = orig; window.dispatchEvent = function (event) { if (event?.type === 'sve:breakpoint') window.__bpLog.push({ t: Math.round(performance.now()), bp: event.detail?.bp, device: event.detail?.device, stack: String(new Error().stack).split('\n').slice(2, 6).map((l) => l.trim().replace(/^at /, '').replace(/https?:\/\/[^/]+\/[^ ]*\/assets\//, '')).join(' < ') }); return orig(event); }; });
    await cp.evaluate((sel) => { const canvas = document.querySelector(`${sel} .sve-bpo-canvas`); window.__zoomLog = []; window.__zoomLogOn = true; const tick = () => { window.__zoomLog.push(new DOMMatrix(getComputedStyle(canvas).transform).a.toFixed(3)); if (window.__zoomLogOn) requestAnimationFrame(tick); }; requestAnimationFrame(tick); }, LAYER);
    const cardAt = { x: overlayBox2.x + libraryCard.x, y: overlayBox2.y + libraryCard.y };
    await page.mouse.move(cardAt.x, cardAt.y);
    await page.mouse.down();
    await page.mouse.move(cardAt.x + 24, cardAt.y + 12, { steps: 4 }); // sideways first: a vertical move inside the list is a scroll
    const overFrame = await inActive({ x: 160, y: 160 });
    await page.mouse.move(overFrame.x, overFrame.y, { steps: 8 });
    const gDrag = await until(async () => { const g = await rowGeo(); return whole(g) && g.z < gBefore.z ? g : null; }, 3000, 30);
    await sleep(400);
    const gSettled = await rowGeo();
    step('dragging a library card over the row zooms it so the active frame is whole in view', !!gDrag && whole(gSettled), gDrag ? `zoom ${gBefore.z.toFixed(3)} → ${gSettled.z.toFixed(3)}, frame ${Math.round(gSettled.frame.h)} px high in a ${Math.round(gSettled.view.h)} px pane` : `not within 3 s: ${JSON.stringify(await rowGeo())}`);
    // Every zoom the row passed through, one per animation frame: a glide shows several, a jump one.
    const zoomsOut = await cp.evaluate(() => { const seen = [...new Set(window.__zoomLog)]; window.__zoomLog = []; return seen; });
    step('the zoom-out glides rather than jumping, as in one preview', zoomsOut.length >= 3, `${zoomsOut.length} zoom values on the way out: ${zoomsOut.slice(0, 8).join(' ')}${zoomsOut.length > 8 ? ' …' : ''}`);
    // Let go over the library again: nothing is inserted, and the row goes back to where it was.
    await page.mouse.move(cardAt.x, cardAt.y, { steps: 6 });
    await page.mouse.up();
    const gAfter = await until(async () => { const g = await rowGeo(); return Math.abs(g.z - gBefore.z) < 0.001 && g.scroll[0] === gBefore.scroll[0] && g.scroll[1] === gBefore.scroll[1] ? g : null; }, 3000, 30);
    await sleep(100);
    const zoomsBack = await cp.evaluate(() => { window.__zoomLogOn = false; return [...new Set(window.__zoomLog)]; });
    step('the zoom back glides too', zoomsBack.length >= 3, `${zoomsBack.length} zoom values on the way back`);
    const bpLog = await cp.evaluate(() => { const log = window.__bpLog || []; if (window.__bpOrigDispatch) { window.dispatchEvent = window.__bpOrigDispatch; delete window.__bpOrigDispatch; } return log; });
    step('released outside the preview: zoom and scroll are as before the drag', !!gAfter, (gAfter ? `zoom ${gAfter.z.toFixed(3)}, scroll ${gAfter.scroll.join(',')}` : `not within 3 s: ${JSON.stringify(await rowGeo())}`) + (bpLog.length ? ` — sve:breakpoint fired ${bpLog.length}× during the drag: ${bpLog.map((e) => `${e.bp}/${e.device} via ${e.stack}`).join(' || ')}` : ' — no sve:breakpoint during the drag'));
    await realClick(page, cp, `${LAYER} [data-bpo="fit"]`);
  } else {
    skip('a library drag zooms the row', 'no library card on screen');
  }
  await realClick(page, cp, '#__sve-toolbar button[data-tab="sections"]');
  await sleep(400);

  // 10f2. Deleting a section from the row asks first — with the card in the part of the frame
  //       on screen, the overlay no lower than the pane, and Escape closing the card alone.
  await realClick(page, cp, `${LAYER} [data-bpo="actual"]`);
  await sleep(500);
  const askUid = await (await previewNow()).evaluate(() => document.querySelector('[data-sid-section-orderable]')?.getAttribute('data-sid') || '');
  if (askUid) {
    // The preview's own message, as the hover bar's minus sends it.
    await (await previewNow()).evaluate((uid) => window.parent.postMessage({ source: 'statamic-visual-editor', type: 'remove-row', uid, confirm: true }, window.location.origin), askUid);
    const ask = await until(() => cp.evaluate(() => { const o = document.getElementById('__sve-close-discard'); if (!o) return null; const card = o.firstElementChild; const pane = document.querySelector('.live-preview-contents').getBoundingClientRect(); const r = o.getBoundingClientRect(); const c = card.getBoundingClientRect(); return { overlay: { x: r.x, y: r.y, w: r.width, h: r.height, bottom: r.bottom }, pane: { x: pane.x, y: pane.y, w: pane.width, h: pane.height, bottom: pane.bottom }, card: { top: c.top, bottom: c.bottom, w: c.width }, title: card.textContent.trim().slice(0, 30) }; }), 5000, 100);
    const inPane = ask && ask.overlay.y >= ask.pane.y - 1 && ask.overlay.bottom <= ask.pane.bottom + 1 && ask.card.top >= ask.pane.y && ask.card.bottom <= ask.pane.bottom;
    step('the delete question stands in the frame\'s part on screen: overlay no lower than the pane, card in view', !!inPane, ask ? `overlay ${Math.round(ask.overlay.y)}..${Math.round(ask.overlay.bottom)} in pane ${Math.round(ask.pane.y)}..${Math.round(ask.pane.bottom)}; card ${Math.round(ask.card.top)}..${Math.round(ask.card.bottom)} "${ask.title}"` : 'no question within 5 s');
    await page.keyboard.press('Escape');
    await sleep(400);
    const afterEscape = await cp.evaluate(() => ({ ask: !!document.getElementById('__sve-close-discard'), overview: !!document.getElementById('__sve-bp-overview') }));
    step('Escape closes the question and leaves the overview open', !afterEscape.ask && afterEscape.overview, JSON.stringify(afterEscape));
    const stillThere = await (await previewNow()).evaluate((uid) => !!document.querySelector(`[data-sid="${uid}"]`), askUid);
    step('the section is still on the page', stillThere);
  } else {
    skip('the delete question in the row', 'no orderable section in the preview');
  }
  await realClick(page, cp, `${LAYER} [data-bpo="fit"]`);

  // 10g. Comments belong to a screen size: made on the picked size, shown there
  //      and nowhere else, and the hit layer follows the frame when the row pans.
  await realClick(page, cp, '#__sve-toolbar button[data-tab="comments"]');
  const commentsPane = await waitIn(cp, '[data-sve-right-pane="comments"]', 10000);
  if (commentsPane && (await cp.$('[data-sve-comments-place]'))) {
    await realClick(page, cp, '[data-sve-comments-place]');
    await until(() => cp.evaluate(() => document.querySelector('[data-sve-comments-place]')?.getAttribute('aria-pressed') === 'true'), 3000, 100);
    const gComment = await rowGeo();
    const sizeNow = gComment.active;
    // A point of the frame that is on screen: the row may stand scrolled so the frame's top is above the pane.
    const gSpot = await rowGeo();
    const visibleTop = Math.max(0, (gSpot.view.y - gSpot.frame.y) / gSpot.z);
    const spot = await inActive({ x: 120, y: visibleTop + 80 });
    const hitBefore = await cp.evaluate((pt) => { const hit = document.getElementById('sc-cp-hit'); const r = hit?.getBoundingClientRect(); const under = document.elementsFromPoint(pt.x, pt.y).slice(0, 3).map((el) => el.id || el.className?.toString().slice(0, 20) || el.tagName); return { hit: r ? `${Math.round(r.x)},${Math.round(r.y)} ${Math.round(r.width)}x${Math.round(r.height)} ${getComputedStyle(hit).display}` : 'none', under }; }, { x: spot.x - overlayBox2.x, y: spot.y - overlayBox2.y });
    await page.mouse.click(spot.x, spot.y);
    const draftSize = await until(() => cp.evaluate(() => document.querySelector('[data-sc-thread="__draft"] [data-sc-size] select')?.value || null), 5000, 100);
    step('a click in the active frame opens a new comment for the size being looked at', draftSize === sizeNow, `size picker says ${draftSize}, the ring is on ${sizeNow}` + (draftSize ? '' : ` — hit layer ${hitBefore.hit}; under the click: ${hitBefore.under.join(' > ')}; draft card: ${await cp.evaluate(() => !!document.querySelector('[data-sc-thread="__draft"]'))}`));
    await cp.evaluate(() => document.querySelector('[data-sc-thread="__draft"] textarea')?.focus());
    const token = `Kommentar ${Math.random().toString(36).slice(2, 6)}`;
    await page.keyboard.type(token);
    await cp.evaluate(() => document.querySelector('[data-sc-thread="__draft"] button.is-primary')?.click());
    // The entry the API files the comment under, read off the request itself.
    let commentsEntry = '';
    let createdId = '';
    const onCommentPost = async (res) => { const m = res.request().method() === 'POST' && res.url().match(/\/!\/sve\/comments\/([^/?#]+)$/); if (!m) return; commentsEntry = m[1]; try { createdId = (await res.json())?.comment?.id || ''; } catch { /* not json */ } };
    page.on('response', onCommentPost);
    const pinId = await until(() => (createdId ? cp.evaluate((id) => (document.querySelector(`[data-sc-pin="${id}"]`) ? id : null), createdId) : Promise.resolve(null)), 8000, 150);
    page.off('response', onCommentPost);
    step('the comment is saved and its pin stands in the frame', !!pinId, pinId ? `pin ${pinId}` : 'no pin within 8 s');
    const sizeLabel = expected.find((b) => b.handle === sizeNow)?.device || sizeNow;
    const away = expected.find((b) => b.handle !== sizeNow);
    if (PHP_HAS_COMMENT_SIZE) {
      const where = await until(() => cp.evaluate((tk) => [...document.querySelectorAll('.sve-comments__row')].find((row) => row.textContent.includes(tk))?.querySelector('.sve-comments__where')?.textContent.trim() || null, token), 5000, 150);
      step('the list on the right names the size the comment is for', !!where && where.includes(sizeLabel), where || 'row not found');
      // Another size — through the top bar's own button, which is always on screen (a frame's label may stand above the pane).
      await realClick(page, cp, `#__sve-preview-chrome [data-device="${away.device}"]`);
      const gone = await until(() => cp.evaluate((id) => !document.querySelector(`[data-sc-pin="${id}"]`), pinId), 4000, 100);
      step(`on ${away.device} the ${sizeLabel} comment's pin is not shown`, !!gone, gone ? 'gone' : `still there after 4 s (pressed ${await pressedDevice()})`);
      await realClick(page, cp, `#__sve-preview-chrome [data-device="${expected.find((b) => b.handle === sizeNow)?.device || sizeNow}"]`);
      const backAgain = await until(() => cp.evaluate((id) => !!document.querySelector(`[data-sc-pin="${id}"]`), pinId), 4000, 100);
      step(`back on ${sizeLabel} the pin is there again`, !!backAgain);
    } else {
      skip('the comment is kept for one size (list label, pin only on that size)', 'the installed PHP predates the size field — enforced after composer update');
    }
    // A pan of the row: the hit layer sits exactly on the frame afterwards.
    const panAt = await cp.evaluate((sel) => { const s = document.querySelector(`${sel} .sve-bpo-scroll`); const r = s.getBoundingClientRect(); return { x: r.x + 12, y: r.y + r.height / 2 }; }, LAYER);
    await page.mouse.move(overlayBox2.x + panAt.x, overlayBox2.y + panAt.y);
    await page.mouse.wheel({ deltaY: 160 });
    await sleep(400);
    const layer = await cp.evaluate(() => { const hit = document.getElementById('sc-cp-hit'); const frame = document.getElementById('live-preview-iframe'); if (!hit || !frame) return null; const h = hit.getBoundingClientRect(); const f = frame.getBoundingClientRect(); return { dx: Math.abs(h.x - f.x), dy: Math.abs(h.y - f.y), dw: Math.abs(h.width - f.width), dh: Math.abs(h.height - f.height), display: getComputedStyle(hit).display }; });
    step('after a pan the comments hit layer lies exactly on the preview frame', !!layer && layer.display !== 'none' && layer.dx <= 1 && layer.dy <= 1 && layer.dw <= 1 && layer.dh <= 1, layer ? `offset ${layer.dx.toFixed(1)},${layer.dy.toFixed(1)} size Δ ${layer.dw.toFixed(1)},${layer.dh.toFixed(1)}` : 'no hit layer');
    // Tidy up: the comment deleted through the API, as the card's Slet would.
    const deleted = pinId && commentsEntry ? await cp.evaluate(async (entry, id) => { const token = window.Statamic?.$config?.get('csrfToken') || document.querySelector('meta[name="csrf-token"]')?.content || ''; const r = await fetch(`/!/sve/comments/${entry}/${id}`, { method: 'DELETE', credentials: 'same-origin', headers: { 'X-CSRF-TOKEN': token, 'X-Requested-With': 'XMLHttpRequest', Accept: 'application/json' } }); return r.status; }, commentsEntry, pinId) : null;
    step('the test comment is deleted again', deleted === 200 || deleted === 204, `DELETE → ${deleted} (entry ${commentsEntry || '?'})`);
    await page.keyboard.press('Escape');
  } else {
    skip('comments per screen size', 'the comments pane did not open (feature off, or no access)');
  }
  await realClick(page, cp, '#__sve-toolbar button[data-tab="comments"]');
  await sleep(400);

  // 11. The preview loads a new document while the overview is open (a page
  //     switch, or Statamic swapping the iframe when the URL changes): the
  //     overview binds to the new window, so what is typed next still arrives.
  if (field) {
    await cp.evaluate(() => { const f = document.getElementById('live-preview-iframe'); f.contentWindow.__sveBpoReload = 1; f.src = f.getAttribute('src'); });
    const reloaded = await until(async () => {
      const f = await (await cp.$('#live-preview-iframe'))?.contentFrame();
      return f && (await f.evaluate(() => window.__sveBpoReload !== 1 && document.readyState === 'complete' && !!document.querySelector(`[data-sid-field="${window.__sveTestField}"]`))) ? f : null;
    }, 20000, 200);
    step('the preview reloaded while the overview was open', !!reloaded);
    await sleep(1500);
    const token = `R${Date.now().toString(36).slice(-5)}`;
    const target = await cp.evaluate(() => {
      const el = [...document.querySelectorAll('.live-preview-editor .ProseMirror[contenteditable="true"], .live-preview-editor input[type="text"], .live-preview-editor textarea')].find((e) => new RegExp(window.__sveTestFieldText, 'i').test(e.value ?? e.textContent ?? ''));
      if (!el) return null;
      el.scrollIntoView({ block: 'center', behavior: 'instant' });
      const r = el.getBoundingClientRect();
      return { x: r.right - 12, y: r.top + Math.min(r.height / 2, 14) };
    });
    if (reloaded && target) {
      const overlayBox = await (await page.$('iframe.sve-edit-overlay')).boundingBox();
      await page.mouse.click(overlayBox.x + target.x, overlayBox.y + target.y);
      await page.keyboard.press('End');
      await page.keyboard.type(` ${token}`, { delay: 20 });
      const typedAt = Date.now();
      const viewFrames = (await Promise.all((await copyHandles()).map((h) => h.contentFrame()))).filter(Boolean);
      const has = (f) => f.evaluate((tk) => document.body.textContent.includes(tk), token).catch(() => false);
      const reached = await until(async () => viewFrames.length > 0 && (await has(reloaded)) && (await Promise.all(viewFrames.map(has))).every(Boolean), 10000, 100);
      step('after the reload, typing still reaches every view frame', !!reached, reached ? `${Date.now() - typedAt} ms` : 'not within 10 s');
      for (let i = 0; i < token.length + 1; i++) await page.keyboard.press('Backspace');
      await until(async () => !(await has(reloaded)), 10000, 150);
    } else {
      step('after the reload, typing still reaches every view frame', false, reloaded ? 'no field to type in' : 'the preview did not come back');
    }
  }

  await page.keyboard.press('Escape');
  await until(() => cp.evaluate((sel) => !document.querySelector(sel), LAYER), 3000);

  // 12. The tree's video hold and the dock's Instant paint reach every frame.
  //     Both need the dock on the section's own file: open the dock, then click
  //     a bare spot of the headline's section (a field click scopes the pane to
  //     that block), unlock the template for the test, and back the file up —
  //     the dock autosaves every keystroke.
  const livePreview = async () => (await cp.$('#live-preview-iframe'))?.contentFrame();
  const dockPath = () => cp.evaluate(() => { const el = document.querySelector('#__sve-code-dock [data-sve-code-path], [data-sve-code-path]'); return el ? (el.getAttribute('data-sve-code-path') || el.textContent.trim()) : ''; });
  const clickSection = async (id) => {
    const f = await livePreview();
    // A point inside the section and inside the preview's viewport, on the
    // section itself rather than a field in it (a field click narrows the pane).
    const r = await f.evaluate((i) => {
      const el = document.getElementById(i);
      if (!el) return null;
      el.scrollIntoView({ block: 'start' });
      const q = el.getBoundingClientRect();
      const top = Math.max(q.top, 0); const bottom = Math.min(q.bottom, window.innerHeight);
      // The section element itself under the pointer — its padding, not a wrapper inside it, which would scope the dock to that wrapper.
      for (let y = top + 3; y < bottom - 3; y += 6) {
        for (const x of [q.x + 3, q.x + Math.min(q.width / 3, 240), q.x + q.width / 2, q.x + q.width - 3]) {
          if (document.elementFromPoint(x, y) === el) return { x, y };
        }
      }
      return null;
    }, id);
    if (!r) return false;
    let x = r.x; let y = r.y;
    for (let fr = f; fr.parentFrame(); fr = fr.parentFrame()) { const box = await (await fr.frameElement()).boundingBox(); x += box.x; y += box.y; }
    await page.mouse.click(x, y);
    return true;
  };
  let dockOpen = false;
  for (let attempt = 1; attempt <= 2 && !dockOpen; attempt++) { await realClick(page, cp, '#__sve-toolbar button[data-tab="code"]'); await sleep(600); dockOpen = await waitIn(cp, '#__sve-code-dock [data-sve-code-pane="html"] .cm-editor', 15000); if (!dockOpen) await sleep(1000); }
  step('code dock open', dockOpen);
  const sectionId = await (await livePreview()).evaluate(() => document.querySelector(`[data-sid-field="${window.__sveTestField}"]`)?.closest('[id^="id-"]')?.id || '');
  let onFile = false;
  const wholeFileShown = () => cp.evaluate(() => { const dock = document.querySelector('#__sve-code-dock'); const text = dock?.querySelector('[data-sve-code-pane="html"] .cm-content')?.cmTile?.view?.state.doc.toString() || ''; return !dock?.hasAttribute('data-sve-html-scoped') || /section_orderable/.test(text); });
  for (let attempt = 0; attempt < 3 && dockOpen && !onFile; attempt++) {
    await clickSection(sectionId); await sleep(2000);
    onFile = /page_sections\//.test(await dockPath()) && (await wholeFileShown());
    if (onFile) break;
    // A bare spot is hard to hit in a section full of fields, and a click inside a wrapper scopes the
    // dock to that tag: the section's own row in the HTML tree opens its whole file.
    if (!(await cp.$('[data-sve-ht-row]'))) { await realClick(page, cp, '#__sve-toolbar button[data-tab="html_tree"]').catch(() => null); await sleep(1500); }
    // The open section's own root row: the one with the eye whose label starts with "section" (the other sections' rows are the [sec] rows).
    const row = await cp.evaluate(() => { const r = [...document.querySelectorAll('[data-sve-ht-row]')].find((x) => x.querySelector('[data-sve-ht-eye]') && /^section/.test((x.textContent || '').trim())); if (!r) return null; r.scrollIntoView({ block: 'center' }); const q = r.getBoundingClientRect(); return { x: q.x + Math.min(60, q.width / 2), y: q.y + q.height / 2 }; });
    info('dock scope', `attempt ${attempt + 1}: bare spot ${onFile ? 'gave the whole file' : 'did not'}; root row in the tree ${row ? 'found' : 'not found'}`);
    if (row) { const b = await (await cp.frameElement()).boundingBox(); await page.mouse.click(b.x + row.x, b.y + row.y); await sleep(2500); onFile = /page_sections\//.test(await dockPath()) && (await wholeFileShown()); }
  }
  filePath = await dockPath();
  const dockState = await cp.evaluate(() => { const dock = document.querySelector('#__sve-code-dock'); const text = dock?.querySelector('[data-sve-code-pane="html"] .cm-content')?.cmTile?.view?.state.doc.toString() || ''; return `scoped=${dock?.getAttribute('data-sve-html-scoped')} rows=${document.querySelectorAll('[data-sve-ht-row][data-sve-ht-sec]').length} pane="${text.replace(/\s+/g, ' ').slice(0, 70)}"`; });
  step('the dock shows the headline section’s whole file', onFile, `${filePath || '(no file)'} — ${dockState}`);
  const abs = filePath ? (filePath.startsWith('/') ? filePath : `${SITE_DIR}/${filePath}`) : null;
  if (onFile && abs && existsSync(abs)) original = readFileSync(abs, 'utf8');
  const twMatch = (filePath || '').match(/page_sections\/(.+)\.antlers\.html$/);
  twPath = twMatch ? `${SITE_DIR}/resources/visual-editor/tw/${twMatch[1]}.css` : null;
  twExisted = twPath ? existsSync(twPath) : true;
  if (onFile && await cp.evaluate(() => document.querySelector('#__sve-code-dock')?.hasAttribute('data-sve-code-locked'))) {
    await realClick(page, cp, '#__sve-code-dock [data-sve-code-lock]');
    if (await waitIn(cp, '.sve-dialog .sve-dialog__actions button', 8000)) {
      const box = await (await cp.frameElement()).boundingBox();
      const r = await cp.evaluate(() => { const b = [...document.querySelectorAll('.sve-dialog .sve-dialog__actions button')].pop(); const q = b.getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2 }; });
      await page.mouse.click(box.x + r.x, box.y + r.y);
    }
    let unlocked = false;
    for (let i = 0; i < 20 && !unlocked; i++) { await sleep(500); unlocked = await cp.evaluate(() => !document.querySelector('#__sve-code-dock')?.hasAttribute('data-sve-code-locked')); }
    step('template unlocked for the test', unlocked);
    onFile = onFile && unlocked;
  }
  const ready = onFile && original !== null;

  // A line right after the root tag opens, as one input event: `<v…` would open the dock's tag popup.
  const typeAfterRoot = async (text) => {
    const lineRect = await cp.evaluate(() => {
      const lines = [...document.querySelectorAll('#__sve-code-dock [data-sve-code-pane="html"] .cm-line')];
      let acc = '';
      for (const line of lines) {
        acc += line.textContent + '\n';
        const open = acc.search(/<(section|div|article|header)\b/);
        if (open !== -1 && acc.indexOf('>', open) !== -1) { line.scrollIntoView({ block: 'center' }); const r = line.getBoundingClientRect(); return { x: r.right - 2, y: r.y + r.height / 2 }; }
      }
      return null;
    });
    if (!lineRect) return false;
    const box = await (await cp.frameElement()).boundingBox();
    await page.mouse.click(box.x + lineRect.x, box.y + lineRect.y);
    await page.keyboard.press('End');
    await page.keyboard.press('Enter');
    await cp.evaluate((t) => document.execCommand('insertText', false, t), text);
    const pane = await cp.evaluate(() => document.querySelector('#__sve-code-dock [data-sve-code-pane="html"] .cm-content')?.textContent || '');
    const close = text.match(/<\/[a-z]+>$/)?.[0];
    if (close && pane.split(close).length - 1 > (original.split(close).length - 1) + 1) { for (let i = 0; i < close.length; i++) await page.keyboard.press('Backspace'); }
    return true;
  };
  // The whole line, through the editor's state: a keyboard Home on a wrapped
  // line reaches only the last visual segment, and the rest stayed behind.
  const removeLine = (marker) => cp.evaluate((m) => {
    const view = document.querySelector('#__sve-code-dock [data-sve-code-pane="html"] .cm-content')?.cmTile?.view;
    if (!view) return false;
    const at = view.state.doc.toString().indexOf(m);
    if (at === -1) return false;
    const line = view.state.doc.lineAt(at);
    view.dispatch({ changes: { from: line.from, to: Math.min(line.to + 1, view.state.doc.length) } });
    return !view.state.doc.toString().includes(m);
  }, marker);
  const loadedCopies = () => copiesLoaded(expected.length);
  const openOverview = async () => { if (!(await cp.$(LAYER))) { await realClick(page, cp, BUTTON); await waitIn(cp, LAYER, 10000); } return loadedCopies(); };
  const closeOverview = async () => { await page.keyboard.press('Escape'); await until(() => cp.evaluate((sel) => !document.querySelector(sel), LAYER), 3000); };
  const copyHandleNames = async () => { const out = []; for (const h of await copyHandles()) out.push(await h.evaluate((el) => el.closest('[data-bp]').dataset.bp)); return out; };
  const frameNames = ['preview', ...copyNames];

  // 12a. Video: a hold from the tree stops it in the preview and in every copy;
  //      a remembered hold is there from a copy's first draw; play plays everywhere.
  const stateOf = (frame, cls) => frame.evaluate((c) => { const v = document.querySelector('.' + c); if (!v) return null; return { muted: v.muted, paused: v.paused, held: v.hasAttribute('data-sve-video-hold'), t: +v.currentTime.toFixed(2) }; }, cls).catch(() => null);
  const advancing = async (frame, cls, ms = 900) => { const a = await stateOf(frame, cls); await sleep(ms); const b = await stateOf(frame, cls); return { a, b, moved: !!a && !!b && b.t > a.t }; };
  // Playing: not paused, and the time advancing — once the file has arrived, which takes a moment in a fresh frame.
  const playing = async (frame, cls) => { const b = await until(async () => { const r = await advancing(frame, cls, 400); return r.moved && r.b.paused === false ? r.b : null; }, 8000, 150); return { moved: !!b, b: b || (await stateOf(frame, cls)) }; };
  const showVideo = (r) => (r ? `${r.paused ? 'paused' : 'playing'}${r.held ? ' held' : ''} t=${r.t}` : 'no video');
  const videoRow = async (marker) => cp.evaluate((m) => {
    const rows = [...document.querySelectorAll('[data-sve-ht-row]')];
    const hit = rows.find((el) => (el.querySelector('[data-sve-ht-tag], [data-sve-ht-kind]')?.textContent || '').trim() === 'video' && (el.textContent || '').includes(m));
    if (!hit) return null;
    hit.scrollIntoView({ block: 'center' });
    const r = hit.getBoundingClientRect();
    return { x: r.x + Math.min(60, r.width / 2), y: r.y + r.height / 2 };
  }, marker);
  const pressVideoIcon = async (marker) => {
    const row = await videoRow(marker);
    if (!row) return 'no video row in the tree';
    const b = await (await cp.frameElement()).boundingBox();
    const iconOf = () => cp.evaluate((m) => { const hit = [...document.querySelectorAll('[data-sve-ht-row]')].find((el) => (el.querySelector('[data-sve-ht-tag], [data-sve-ht-kind]')?.textContent || '').trim() === 'video' && (el.textContent || '').includes(m)); const btn = hit?.querySelector('[data-sve-ht-video]'); if (!btn) return null; const r = btn.getBoundingClientRect(); return r.width ? { x: r.x + r.width / 2, y: r.y + r.height / 2, on: btn.hasAttribute('data-on') } : { hidden: true }; }, marker);
    await page.mouse.move(b.x + row.x - 6, b.y + row.y); await page.mouse.move(b.x + row.x, b.y + row.y); await sleep(300);
    let icon = await iconOf();
    if (!icon || icon.hidden) { await page.mouse.click(b.x + row.x, b.y + row.y); await sleep(500); icon = await iconOf(); }
    if (!icon || icon.hidden) return `video icon not clickable: ${JSON.stringify(icon)}`;
    await page.mouse.click(b.x + icon.x, b.y + icon.y);
    return `pressed (was ${icon.on ? 'held' : 'playing'})`;
  };
  const videoOk = ready && (!!VIDEO_SRC || (!!VIDEO_FILE && existsSync(VIDEO_FILE)));
  if (videoOk) {
    if (!VIDEO_SRC) copyFileSync(VIDEO_FILE, VIDEO_PUBLIC);
    step('typed a muted autoplay video into the section', await typeAfterRoot(`<video class="sve-bpo-video" autoplay="true" muted="true" playsinline src="${VIDEO_SRC || `${SITE_URL}/sve-bpo-video.mp4`}"></video>`));
    await sleep(3500); // the save and the morph
    let run = await playing(await livePreview(), 'sve-bpo-video');
    step('the preview plays it after the morph', run.moved && run.b?.paused === false, showVideo(run.b));
    let copies = await openOverview();
    const plays = copies ? await Promise.all(copies.map((f) => playing(f, 'sve-bpo-video'))) : [];
    step('open, every copy shows the video playing', !!copies && plays.every((r) => r.moved && r.b?.paused === false), copies ? plays.map((r, i) => `${copyNames[i]} ${showVideo(r.b)}`).join(', ') : 'copies did not load');
    // The tree: the section's row unfolds its tags; the video row carries the hold icon.
    if (!(await cp.$('[data-sve-ht-row]'))) { await realClick(page, cp, '#__sve-toolbar button[data-tab="html_tree"]'); await sleep(1500); }
    const secLabel = (filePath || '').replace(/^.*page_sections\//, '').replace(/\.antlers\.html$/, '').replace(/[\/_]+/g, ' ').trim();
    const secRow = await cp.evaluate((label) => { const el = [...document.querySelectorAll('[data-sve-ht-row][data-sve-ht-sec]')].find((r) => r.textContent.toLowerCase().includes(label.toLowerCase())); if (!el) return null; el.scrollIntoView({ block: 'center' }); const r = el.getBoundingClientRect(); return { x: r.x + Math.min(60, r.width / 2), y: r.y + r.height / 2 }; }, secLabel);
    if (secRow && !(await videoRow('sve-bpo-video'))) { const b = await (await cp.frameElement()).boundingBox(); await page.mouse.click(b.x + secRow.x, b.y + secRow.y); await sleep(1500); }
    let pressed = await pressVideoIcon('sve-bpo-video'); await sleep(900);
    let all = [await livePreview(), ...(copies || [])];
    const held = await Promise.all(all.map((f) => stateOf(f, 'sve-bpo-video')));
    step('the tree’s hold stops the video in the preview and in every copy', held.length === expected.length + 1 && held.every((r) => r && r.paused === true && r.held === true), `${pressed}; ${frameNames.map((n, i) => `${n} ${showVideo(held[i])}`).join(', ')}`);
    // Closed and opened again: a copy loads fresh from the server and is held from its first draw.
    await closeOverview();
    copies = await openOverview();
    await sleep(800);
    const remembered = copies ? await Promise.all(copies.map((f) => stateOf(f, 'sve-bpo-video'))) : [];
    step('reopened, every copy has the remembered hold from its first draw', !!copies && remembered.every((r) => r && r.paused === true && r.held === true), copies ? remembered.map((r, i) => `${copyNames[i]} ${showVideo(r)}`).join(', ') : 'copies did not load');
    pressed = await pressVideoIcon('sve-bpo-video'); await sleep(900);
    all = [await livePreview(), ...(copies || [])];
    const playAgain = await Promise.all(all.map((f) => playing(f, 'sve-bpo-video')));
    step('the next press plays it again in the preview and in every copy', playAgain.length === expected.length + 1 && playAgain.every((r) => r.moved && r.b?.paused === false && r.b?.held === false), `${pressed}; ${frameNames.map((n, i) => `${n} ${showVideo(playAgain[i]?.b)}`).join(', ')}`);
    step('the video line removed again', await removeLine('sve-bpo-video'));
    await sleep(3500);
  } else {
    skip('video in every frame', !ready ? 'the dock is not on the section file (another site, or no file to back up)' : 'no SVE_VIDEO_FILE on disk and no SVE_VIDEO_SRC');
  }

  // 12b. Instant: a tag typed in the dock is in the preview and in every copy
  //      in the same frame — well before any morph — with the field text kept.
  if (ready) {
    const copies = await openOverview();
    const all = [await livePreview(), ...(copies || [])];
    for (const f of all) await f.evaluate(() => { window.__sveBpoMorphs = []; window.addEventListener('statamic:preview-updated', () => window.__sveBpoMorphs.push(Date.now())); });
    const typedOk = await typeAfterRoot('<aside class="sve-bpo-probe">probe</aside>');
    const typedAt = Date.now();
    const firstSeen = new Array(all.length).fill(null);
    await until(async () => {
      const got = await Promise.all(all.map((f) => f.evaluate(() => !!document.querySelector('.sve-bpo-probe')).catch(() => false)));
      const now = Date.now() - typedAt;
      got.forEach((ok, i) => { if (ok && firstSeen[i] === null) firstSeen[i] = now; });
      return got.every(Boolean);
    }, 2500, 15);
    const morphed = await Promise.all(all.map((f) => f.evaluate(() => (window.__sveBpoMorphs || []).length).catch(() => 0)));
    const instantOk = typedOk && !!copies && firstSeen.every((ms) => ms !== null) && morphed.every((n) => n === 0);
    step('Instant: the new tag is in the preview and in every copy before any morph', instantOk, frameNames.map((n, i) => `${n} ${firstSeen[i] ?? '–'} ms${morphed[i] ? ' (a morph had run)' : ''}`).join(', '));
    if (!instantOk) info('paint script', await cp.evaluate(() => { const view = document.querySelector('#__sve-code-dock [data-sve-code-pane="html"] .cm-content')?.cmTile?.view; const text = view ? view.state.doc.toString() : ''; const at = text.indexOf('sve-bpo-probe'); return `mode=${localStorage.getItem('sveInstantPreview')} v${window.__sveDockInstantPreview} | pane around the probe: ${JSON.stringify(text.slice(Math.max(0, at - 160), at + 80))} | trace: ${(window.__sveInstantTrace || []).slice(-6).map((l) => l.replace(/^\d+ /, '')).join(' → ')}`; }));
    const textKept = await Promise.all(all.map((f) => f.evaluate(() => new RegExp(window.__sveTestFieldText, 'i').test(document.body.textContent)).catch(() => false)));
    step('and the field text is still there in every frame', textKept.every(Boolean), textKept.join(' '));
    step('the probe line removed again', await removeLine('sve-bpo-probe'));
    await sleep(3500);
    const gone = await Promise.all(all.map((f) => f.evaluate(() => !document.querySelector('.sve-bpo-probe')).catch(() => true)));
    step('removed, the morph takes it out of every frame', gone.every(Boolean), gone.join(' '));
    await closeOverview();
  } else {
    skip('Instant in every frame', 'the dock is not on the section file');
  }

  if (process.env.SVE_DEBUG) await page.screenshot({ path: `${tmpdir()}/sve-breakpoint-overview.png` });
  await sleep(800);
} catch (e) {
  report.errors.push(`exception: ${e.message}`);
  report.ok = false;
} finally {
  // The dock flushes a pending save when the page unloads: close the browser
  // first, then put the section file back exactly as it was (lock marker
  // included) once it has been untouched for six seconds, and drop the history
  // snapshots and the baked Tailwind file the test's keystrokes made.
  await browser.close();
  await sleep(2000);
  if (original !== null && filePath) {
    const abs = filePath.startsWith('/') ? filePath : `${SITE_DIR}/${filePath}`;
    let stable = 0;
    for (let i = 0; i < 60 && stable < 9; i++) {
      if (readFileSync(abs, 'utf8') !== original) { writeFileSync(abs, original); stable = 0; } else { stable++; }
      await sleep(700);
    }
    step('section file restored', readFileSync(abs, 'utf8') === original, abs.replace(SITE_DIR + '/', ''));
    const historyDir = `${SITE_DIR}/storage/statamic-visual-editor/history/${filePath.replace(/\//g, '_')}`;
    if (existsSync(historyDir)) {
      let removed = 0;
      for (const name of readdirSync(historyDir)) { const file = `${historyDir}/${name}`; if (statSync(file).mtimeMs >= startedAt - 1000) { unlinkSync(file); removed++; } }
      if (!readdirSync(historyDir).length) rmdirSync(historyDir);
      info('history snapshots from this run removed', String(removed));
    }
    if (twPath && !twExisted && existsSync(twPath)) {
      unlinkSync(twPath);
      const dir = twPath.slice(0, twPath.lastIndexOf('/'));
      if (!readdirSync(dir).length) rmdirSync(dir);
      info('baked Tailwind file from this run removed', twPath.replace(SITE_DIR + '/', ''));
    }
  }
  if (existsSync(VIDEO_PUBLIC)) unlinkSync(VIDEO_PUBLIC);
  seedLayoutPrefs(null);
}

if (served) step('working-tree build was what the CP loaded', served() > 0, `${served()} build files served from the working tree`);
{
  const files = (manifest) => Object.values(manifest).flatMap((e) => [e.file, ...(e.css || []), ...(e.assets || [])]).map((f) => f.replace(/^assets\//, ''));
  const installed = JSON.parse(readFileSync(`${SITE_DIR}/public/vendor/visual-editor/build/manifest.json`, 'utf8'));
  const allowed = new Set(files(installed));
  if (WORKTREE) for (const f of files(JSON.parse(readFileSync(`${BUILD_DIR}/manifest.json`, 'utf8')))) allowed.add(f);
  const strays = [...loadedAssets].filter((f) => !allowed.has(f));
  step('every build file the browser loaded is one the manifest names', strays.length === 0, `${loadedAssets.size} files${strays.length ? ' | not in the manifest: ' + strays.join(' ') : ''}`);
}
step('the entry on disk is unchanged (nothing was saved)', !entryFile || md5(entryFile) === entryBefore, entryFile ? entryFile.replace(SITE_DIR + '/', '') : 'entry file not found');
const realErrors = report.errors.filter((e) => !/favicon|net::ERR_ABORTED|the server responded with a status of 4/i.test(e));
step('no JavaScript errors (CP, overlay, preview, view frames)', realErrors.length === 0, realErrors.slice(0, 5).join(' | '));
console.log(JSON.stringify({ ok: report.ok, errors: realErrors }, null, 0));
process.exit(report.ok ? 0 : 1);
