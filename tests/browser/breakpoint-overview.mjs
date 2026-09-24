#!/usr/bin/env node
/**
 * Breakpoint overview — every screen size side by side in Live Preview.
 *
 * Proves, in a real Live Preview, what the owner asked for: the button is
 * there and visible; closed, the overview costs nothing (no chunk fetched, no
 * extra iframe); open, there is one live view frame per breakpoint at its real
 * width, without the bridge, following what is typed on the left; zoom and pan
 * work; and closing leaves the editor exactly as it was — the preview frame's
 * src, transform and window, the iframe count and the event listeners.
 *
 * Measures, does not assume: "visible" is a box, a display and a hit test,
 * not a node in the DOM; clicks are real mouse clicks at page coordinates.
 *
 * Same env vars as live-preview-smoke.mjs (SVE_PASS is required), plus:
 *   SVE_PREFS   layout to start from; default {"sve-lp-panel-mode":"show"} so
 *               the fields on the left can be typed in
 *
 * Two checks need this checkout's PHP (the `sve_view` flag in
 * InjectBridgeScript, the new strings). Against a site whose installed addon
 * predates them — every SVE_WORKTREE=1 run before `composer update` — they say
 * so and are skipped; InjectBridgeScriptTest proves the flag meanwhile. After
 * `composer update` they are enforced.
 *
 *   node tests/browser/breakpoint-overview.mjs
 */
import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
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

// What the installed PHP knows. The flag and the strings ship with this feature.
const INSTALLED_MIDDLEWARE = `${SITE_DIR}/vendor/statamic-addon/visual-editor/src/Http/Middleware/InjectBridgeScript.php`;
const PHP_HAS_VIEW_FLAG = existsSync(INSTALLED_MIDDLEWARE) && readFileSync(INSTALLED_MIDDLEWARE, 'utf8').includes('sve_view');

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

const browser = await puppeteer.launch({ headless: true, executablePath: CHROME, args: ['--window-size=1440,900'], defaultViewport: { width: 1440, height: 900 } });
const page = await browser.newPage();
page.on('pageerror', (e) => report.errors.push(`pageerror: ${e.message}`));
page.on('console', (m) => { if (m.type() === 'error') report.errors.push(`console: ${m.text().slice(0, 200)}`); });
page.on('response', (r) => { if (r.status() >= 500) report.errors.push(`HTTP ${r.status()} ${r.request().method()} ${r.url().replace(SITE_URL, '').slice(0, 160)}`); });
const loadedAssets = new Set();
page.on('request', (req) => { const m = req.url().match(/\/(?:vendor\/visual-editor\/build|!\/sve\/build)\/assets\/([^?#]+)/); if (m) loadedAssets.add(m[1]); });
const chunkLoaded = () => [...loadedAssets].filter((f) => /^breakpoint-overview-/.test(f));

let served = null;
if (WORKTREE) {
  served = await serveWorktreeBuild(page, { buildDir: BUILD_DIR, installedManifest: `${SITE_DIR}/public/vendor/visual-editor/build/manifest.json`, scriptsDir: `${ADDON_DIR}/resources/js` });
  info('build served from', ADDON_DIR);
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
    return f && (await f.evaluate(() => !!document.querySelector('[data-sid-field="headline"]'))) ? f : null;
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
  await realClick(page, main, '[data-sid-field="headline"]');
  const field = await until(() => cp.evaluate(() => {
    const editor = document.querySelector('.live-preview-editor');
    const r = editor?.getBoundingClientRect();
    if (!r || r.right <= 0) return null;
    return [...editor.querySelectorAll('.ProseMirror[contenteditable="true"], input[type="text"], textarea')].some((el) => { const b = el.getBoundingClientRect(); return b.width > 0 && b.left >= 0 && /professionelle/i.test(el.value ?? el.textContent ?? ''); });
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
    const top = document.elementFromPoint(lr.x + lr.width / 2, lr.y + lr.height / 2);
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
  step('the layer sits in Live Preview’s own stacking context, just above the pane', shape.parent === 'live-preview-main' && shape.z === '2' && shape.onTop, `parent=.${shape.parent} z-index=${shape.z} on top at its centre=${shape.onTop}`);
  step('one view frame per breakpoint', shape.frames.length === config.bps.length && shape.frames.length === expected.length, `${shape.frames.length} frames, ${config.bps.length} breakpoints`);
  step('frames narrowest first, each at its breakpoint width × zoom',
    shape.frames.every((f, i) => f.bp === expected[i]?.handle && Math.abs(f.w - expected[i].width * shape.scale) <= 1.5 && (i === 0 || f.x > shape.frames[i - 1].x)),
    shape.frames.map((f, i) => `${f.bp} ${f.w.toFixed(1)}px ≈ ${expected[i]?.width}×${shape.scale.toFixed(3)}`).join(' | '));
  step('every frame is on screen and labelled', shape.frames.every((f) => f.shown && /\d+ px$/.test(f.label)), shape.frames.map((f) => `"${f.label}"`).join(' '));
  // The flag's value is the frame's size: one URL per frame, or Chrome queues
  // their requests behind each other (its cache lock) and every update waits.
  step('every frame loads with sve_view=<its size>, one URL each',
    shape.frames.every((f) => new URL(f.src).searchParams.get('sve_view') === f.bp) && new Set(shape.frames.map((f) => f.src)).size === shape.frames.length,
    shape.frames.map((f) => `${f.bp}: …${f.src.slice(f.src.indexOf('sve_view'))}`).join(' | '));
  step('frames take no clicks (view only)', shape.frames.every((f) => f.pe === 'none'), shape.frames.map((f) => f.pe).join(' '));
  const baseHandle = config.bps.find((b) => b.base)?.handle;
  step('the ring is on the size the fields edit (default: the base size)', shape.frames.filter((f) => f.active).map((f) => f.bp).join() === baseHandle, `active=${shape.frames.filter((f) => f.active).map((f) => f.bp).join() || 'none'}`);
  step('the button says it is on', shape.pressed === 'true');
  step('iframes in the CP document = before + one per breakpoint', shape.iframes === iframesBefore + expected.length, `${shape.iframes} = ${iframesBefore} + ${expected.length}`);

  // 5. Each view frame loaded the page. Without the bridge; the preview keeps its own.
  const frames = await until(async () => {
    const handles = await cp.$$(`${LAYER} iframe`);
    const out = [];
    for (const h of handles) {
      const f = await h.contentFrame();
      if (!f || !(await f.evaluate(() => document.readyState === 'complete' && !!document.querySelector('[data-sid-field="headline"]')).catch(() => false))) return null;
      out.push(f);
    }
    return out.length === expected.length ? out : null;
  }, 30000, 300);
  step('every view frame loaded the page', !!frames);
  const inside = frames ? await Promise.all(frames.map((f) => f.evaluate(() => ({
    bridge: !!document.querySelector('script[src*="bridge"]'),
    preview: !!document.querySelector('script[src*="preview"]'),
    bridgeRan: '__sveBridgeReady' in window,
    bridgeUi: document.querySelectorAll('#__sve-bridge-styles, #__sve-inserters').length,
    width: innerWidth,
  })))) : [];
  const mainHasBridge = await main.evaluate(() => !!document.querySelector('script[src*="bridge"]') && '__sveBridgeReady' in window);
  step('the preview itself still has its bridge', mainHasBridge);
  step('every view frame runs preview.js (it can morph)', inside.length > 0 && inside.every((f) => f.preview));
  step('every view frame is laid out at its breakpoint width', inside.length > 0 && inside.every((f, i) => f.width === expected[i].width), inside.map((f) => f.width).join(' '));
  if (PHP_HAS_VIEW_FLAG) {
    step('no bridge in any view frame: no script, never ran, no badges/outlines/toolbar', inside.every((f) => !f.bridge && !f.bridgeRan && f.bridgeUi === 0), JSON.stringify(inside));
  } else {
    skip('no bridge in any view frame', `the installed InjectBridgeScript has no sve_view (bridge present: ${inside.map((f) => f.bridge).join(' ')}); proven by InjectBridgeScriptTest until composer update`);
  }

  // 6. Type on the left: every frame follows (forwarded statamic.preview.updated), no reload.
  if (frames && field) {
    for (const f of frames) await f.evaluate(() => { window.__sveBpoFrameMarker = 1; });
    const token = `Q${Date.now().toString(36).slice(-5)}`;
    const target = await cp.evaluate(() => {
      const editor = document.querySelector('.live-preview-editor');
      const el = [...editor.querySelectorAll('.ProseMirror[contenteditable="true"], input[type="text"], textarea')].find((e) => /professionelle/i.test(e.value ?? e.textContent ?? ''));
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
    const names = ['preview', ...expected.map((b) => b.handle)];
    const reached = await until(async () => {
      const now = Date.now() - typedAt;
      const got = await Promise.all([main, ...frames].map(has));
      got.forEach((ok, i) => { if (ok && seen[names[i]] == null) seen[names[i]] = now; });
      return got.every(Boolean);
    }, 10000, 50);
    const took = Date.now() - typedAt;
    const kept = await Promise.all(frames.map((f) => f.evaluate(() => window.__sveBpoFrameMarker === 1).catch(() => false)));
    step('typing on the left reaches the preview and every view frame within 3 s', !!reached && took <= 3000, `${reached ? `${took} ms after the last key` : 'not within 10 s'} (${names.map((n) => `${n} ${seen[n] ?? '–'} ms`).join(', ')}); token ${token}`);
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
  await page.mouse.move(cx, cy);
  await page.mouse.down();
  await page.mouse.move(cx + 120, cy + 90, { steps: 6 });
  await page.mouse.up();
  await sleep(200);
  const zDrag = await zoomState();
  step('dragging pans the layer', zDrag.left < zWheel.left && zDrag.top < zWheel.top, `scroll ${zWheel.left},${zWheel.top} → ${zDrag.left},${zDrag.top}`);
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
  const middle = expected[Math.min(1, expected.length - 1)];
  const markSel = (handle) => `#__sve-preview-chrome .sve-bpo-badge[data-bpo-badge="${handle}"]`;
  const pressedBefore = await pressedDevice();
  const rowBefore = await rowWidthNow();
  await realClick(page, cp, markSel(middle.handle));
  await sleep(300);
  const off = await sizeState(middle.handle);
  const rowOff = await rowWidthNow();
  step(`${middle.device}'s mark takes it out of the row, its frame blanked`, off.out && off.src === 'about:blank' && off.mark === false && rowOff < rowBefore, `out=${off.out} src=${off.src} mark on=${off.mark} row ${Math.round(rowBefore)}→${Math.round(rowOff)} px`);
  step('the mark does not change the size the fields edit', (await pressedDevice()) === pressedBefore, `pressed device stays ${pressedBefore}`);
  // The last size in the row cannot be switched out: an empty overview is a grey pane.
  const restSizes = expected.filter((b) => b.handle !== middle.handle);
  for (const b of restSizes.slice(0, -1)) await realClick(page, cp, markSel(b.handle));
  const last = restSizes[restSizes.length - 1];
  await realClick(page, cp, markSel(last.handle));
  await sleep(300);
  step('the last size in the row stays in', !(await sizeState(last.handle)).out, `${last.handle} still shown`);
  for (const b of [...restSizes.slice(0, -1), middle]) await realClick(page, cp, markSel(b.handle));
  const back = await until(async () => {
    const states = await Promise.all(expected.map((b) => sizeState(b.handle)));
    if (states.some((s) => s.out || !s.mark)) return null;
    const handles = await cp.$$(`${LAYER} iframe`);
    for (const h of handles) { const f = await h.contentFrame(); if (!f || !(await f.evaluate(() => !!document.querySelector('[data-sid-field="headline"]')).catch(() => false))) return null; }
    return states;
  }, 20000, 300);
  step('marked in again, every size is back in the row and loaded', !!back && back.every((s, i) => new URL(s.src).searchParams.get('sve_view') === expected[i].handle), back ? back.map((s) => s.src.slice(s.src.indexOf('sve_view'))).join(' | ') : 'not within 20 s');

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
  await waitIn(cp, LAYER, 10000);
  await until(async () => {
    const handles = await cp.$$(`${LAYER} iframe`);
    // Loaded means the page, not the about:blank every new iframe starts as.
    for (const h of handles) { const f = await h.contentFrame(); if (!f || !(await f.evaluate(() => document.readyState === 'complete' && !!document.querySelector('[data-sid-field="headline"]')).catch(() => false))) return false; }
    return handles.length === expected.length;
  }, 30000, 300);
  const listenersOpen = await listenerSnapshot(cp);
  await realClick(page, cp, BUTTON);
  // The button's click runs through import(): the close lands a task later.
  const closedByButton = await until(() => cp.evaluate((sel) => !document.querySelector(sel), LAYER), 3000);
  step('the same button closes it', !!closedByButton);
  const listenersAfter = await listenerSnapshot(cp);
  // The measurement has to see the overview's own listeners while it is open,
  // or a clean "after" proves nothing: Escape and the ring on the CP window,
  // the preview's load on the pane, the preview's morph on its window.
  const own = { before: ownListeners(listenersBefore), open: ownListeners(listenersOpen), after: ownListeners(listenersAfter) };
  const want = { cpWindow: ['keydown', 'sve:breakpoint'], cpDocument: [], pane: ['load(capture)'], previewWindow: ['statamic:preview-updated'] };
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

  // 11. The preview loads a new document while the overview is open (a page
  //     switch, or Statamic swapping the iframe when the URL changes): the
  //     overview binds to the new window, so what is typed next still arrives.
  if (field) {
    await cp.evaluate(() => { const f = document.getElementById('live-preview-iframe'); f.contentWindow.__sveBpoReload = 1; f.src = f.getAttribute('src'); });
    const reloaded = await until(async () => {
      const f = await (await cp.$('#live-preview-iframe'))?.contentFrame();
      return f && (await f.evaluate(() => window.__sveBpoReload !== 1 && document.readyState === 'complete' && !!document.querySelector('[data-sid-field="headline"]'))) ? f : null;
    }, 20000, 200);
    step('the preview reloaded while the overview was open', !!reloaded);
    await sleep(1500);
    const token = `R${Date.now().toString(36).slice(-5)}`;
    const target = await cp.evaluate(() => {
      const el = [...document.querySelectorAll('.live-preview-editor .ProseMirror[contenteditable="true"], .live-preview-editor input[type="text"], .live-preview-editor textarea')].find((e) => /professionelle/i.test(e.value ?? e.textContent ?? ''));
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
      const viewFrames = await Promise.all((await cp.$$(`${LAYER} iframe`)).map((h) => h.contentFrame()));
      const has = (f) => f.evaluate((tk) => document.body.textContent.includes(tk), token).catch(() => false);
      const reached = await until(async () => (await has(reloaded)) && (await Promise.all(viewFrames.map(has))).every(Boolean), 10000, 100);
      step('after the reload, typing still reaches every view frame', !!reached, reached ? `${Date.now() - typedAt} ms` : 'not within 10 s');
      for (let i = 0; i < token.length + 1; i++) await page.keyboard.press('Backspace');
      await until(async () => !(await has(reloaded)), 10000, 150);
    } else {
      step('after the reload, typing still reaches every view frame', false, reloaded ? 'no field to type in' : 'the preview did not come back');
    }
  }

  await page.keyboard.press('Escape');
  await until(() => cp.evaluate((sel) => !document.querySelector(sel), LAYER), 3000);

  if (process.env.SVE_DEBUG) await page.screenshot({ path: `${tmpdir()}/sve-breakpoint-overview.png` });
  await sleep(800);
} catch (e) {
  report.errors.push(`exception: ${e.message}`);
  report.ok = false;
} finally {
  await browser.close();
  await sleep(1500); // a debounced layout POST may still be landing
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
