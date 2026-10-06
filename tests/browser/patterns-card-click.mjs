/**
 * Patterns cards: a click does nothing, a drag zooms the preview, going back
 * over the panel un-zooms it and inserts nothing — in one preview and in the
 * breakpoint overview alike.
 *
 * Env (as live-preview-smoke.mjs): SVE_SITE_URL, SVE_USER, SVE_PASS, SVE_ENTRY,
 * SVE_WORKTREE=1 to serve this checkout's build, SVE_CHROME.
 *
 * The CP's mouse is driven with page.mouse; whether each event actually reached
 * the CP window is measured (a capture listener counts them). If the real mouse
 * does not land (headless CP, see feedback_cp_mouse_dead_headless), the same
 * pointer sequence is dispatched as PointerEvents from inside the CP document —
 * real DOM events through the same capture/bubble chain the editor's listeners
 * sit on, which is what this proof is about.
 */
import { createRequire } from 'node:module';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { serveWorktreeBuild } from './serve-worktree.mjs';

const env = (k, d) => (process.env[k] === undefined || process.env[k] === '' ? d : process.env[k]);
const SITE_DIR = env('SVE_SITE_DIR', `${homedir()}/Sites/vizuall-skabelon`);
const ADDON_DIR = env('SVE_ADDON_DIR', `${homedir()}/Sites/statamic-addon-visual-editor-vue`);
const SITE_URL = env('SVE_SITE_URL', 'http://vizuall-skabelon.test');
const USER = env('SVE_USER', 'claude-test@vizuall.dk');
const PASS = env('SVE_PASS', '');
const ENTRY = env('SVE_ENTRY', '/cp/collections/pages/entries/68f56034-ce7c-4d33-b15d-da7fa7675662');
const WORKTREE = env('SVE_WORKTREE', '') === '1';
const CHROME = env('SVE_CHROME', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome');
const HEADLESS = env('SVE_HEADFUL', '') !== '1';

const require = createRequire(`${SITE_DIR}/package.json`);
const puppeteer = require('puppeteer');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const report = { ok: true, steps: [], errors: [] };
const step = (name, ok, detail = '') => { report.steps.push({ name, ok, detail }); if (!ok) report.ok = false; console.log(`${ok ? 'ok ' : 'FAIL'} ${name}${detail ? ' — ' + detail : ''}`); };
const info = (name, detail = '') => console.log(`info ${name} — ${detail}`);
async function until(fn, ms, every = 50) { const t0 = Date.now(); while (Date.now() - t0 < ms) { const v = await fn(); if (v) return v; await sleep(every); } return null; }
async function waitIn(frame, selector, ms) { try { await frame.waitForSelector(selector, { timeout: ms }); return true; } catch { return false; } }

// The test account starts from the default layout (the editor writes its prefs back on every run).
const USER_FILE = `${SITE_DIR}/users/${USER}.yaml`;
if (existsSync(USER_FILE) && env('SVE_NO_PREFS_WRITES', '') !== '1') {
  writeFileSync(USER_FILE, readFileSync(USER_FILE, 'utf8').replace(/^  sve_chrome:\n(?:    .*\n)*/m, ''));
  info('layout prefs', 'reset');
}

const browser = await puppeteer.launch({ headless: HEADLESS, executablePath: CHROME, args: ['--window-size=1440,900'], defaultViewport: { width: 1440, height: 900 } });
const page = await browser.newPage();
page.on('pageerror', (e) => report.errors.push(`pageerror: ${e.message}`));
page.on('console', (m) => { if (m.type() === 'error') report.errors.push(`console: ${m.text().slice(0, 200)}`); });
page.on('response', (r) => { if (r.status() >= 500) report.errors.push(`HTTP ${r.status()} ${r.url().replace(SITE_URL, '').slice(0, 120)}`); });

let served = null;
if (WORKTREE) {
  served = await serveWorktreeBuild(page, { buildDir: env('SVE_BUILD_DIR', `${ADDON_DIR}/resources/dist/build`), installedManifest: `${SITE_DIR}/public/vendor/visual-editor/build/manifest.json`, scriptsDir: `${ADDON_DIR}/resources/js` });
}

try {
  await page.goto(`${SITE_URL}/cp`, { waitUntil: 'networkidle2' });
  await page.waitForSelector('input[name="email"]', { timeout: 15000 });
  await page.type('input[name="email"]', USER);
  await page.type('input[name="password"]', PASS);
  await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle2' }), page.keyboard.press('Enter')]);
  step('login', !/login/.test(page.url()), page.url());

  await page.goto(`${SITE_URL}${ENTRY}`, { waitUntil: 'networkidle2' });
  await sleep(1500);
  let cp = page.mainFrame();
  let overlayEl = await page.$('iframe.sve-edit-overlay');
  if (!overlayEl && !(await page.$('#live-preview-iframe'))) {
    await page.evaluate(() => { const btn = [...document.querySelectorAll('button, a')].find((el) => /live preview|forhåndsvisning/i.test(el.textContent || '')); btn?.click(); });
    await waitIn(page, 'iframe.sve-edit-overlay[data-open]', 30000);
    overlayEl = await page.$('iframe.sve-edit-overlay');
  }
  if (overlayEl) cp = await overlayEl.contentFrame();
  step('editor overlay', !!overlayEl);
  // The trial-licence dialog takes the first click otherwise.
  await cp.evaluate(() => { const b = [...document.querySelectorAll('button')].find((el) => /snooze/i.test(el.textContent || '')); b?.click(); });

  const toolbar = await waitIn(cp, '#__sve-toolbar button', 20000);
  step('toolbar', toolbar);
  let preview = null;
  for (let i = 0; i < 25 && !preview; i++) {
    const el = await cp.$('#live-preview-iframe');
    const f = el ? await el.contentFrame() : null;
    if (f && (await f.evaluate(() => !!document.querySelector('[id^="id-"]')).catch(() => false))) preview = f; else await sleep(1000);
  }
  step('preview rendered a section', !!preview);
  await sleep(1500);

  // --- instruments ---------------------------------------------------------
  const overlayBox = async () => (overlayEl ? await overlayEl.boundingBox() : { x: 0, y: 0 });
  // What the CP window receives: counted in the capture phase, before anyone can stop it.
  await cp.evaluate(() => { window.__ptr = { down: 0, up: 0, move: 0 }; for (const t of ['pointerdown', 'pointerup', 'pointermove']) window.addEventListener(t, () => { window.__ptr[t.replace('pointer', '')]++; }, true); });
  const ptr = () => cp.evaluate(() => ({ ...window.__ptr }));
  const pageScale = () => cp.evaluate(() => { const body = document.getElementById('live-preview-iframe')?.contentDocument?.body; if (!body) return 1; const t = body.ownerDocument.defaultView.getComputedStyle(body).transform; return t && t !== 'none' ? new DOMMatrix(t).a : 1; });
  const ghostOn = () => cp.evaluate(() => [...document.body.children].some((el) => el.style.position === 'fixed' && el.style.zIndex === '2147483647'));
  const frameLocked = () => cp.evaluate(() => document.getElementById('live-preview-iframe')?.style.pointerEvents === 'none');
  const sectionCount = () => cp.evaluate(() => document.getElementById('live-preview-iframe')?.contentDocument?.querySelectorAll('[data-sid-section-orderable]').length ?? -1);
  const cardPoint = () => cp.evaluate(() => { const el = document.querySelector('[data-sve-lib-kind="page"]') || document.querySelector('[data-sve-lib-kind]'); if (!el) return null; const r = el.getBoundingClientRect(); return r.width > 20 && r.height > 20 ? { x: r.x + r.width / 2, y: r.y + Math.min(r.height / 2, 60) } : null; });
  const DROP_Y = parseFloat(env('SVE_DROP_Y', '0'));
  const previewPoint = () => cp.evaluate((fy) => { const r = document.getElementById('live-preview-iframe').getBoundingClientRect(); return { x: r.x + Math.min(160, r.width / 2), y: fy > 0 ? r.y + r.height * fy : r.y + Math.min(160, r.height / 2) }; }, DROP_Y);

  // Pointer driver: real mouse when it lands in the CP, else PointerEvents dispatched in the CP document.
  let synthetic = false;
  const dispatch = (type, p, buttons) => cp.evaluate((t, x, y, b) => {
    const target = document.elementFromPoint(x, y) || document.documentElement;
    target.dispatchEvent(new PointerEvent(t, { bubbles: true, cancelable: true, composed: true, clientX: x, clientY: y, button: 0, buttons: b, pointerId: 1, pointerType: 'mouse', isPrimary: true, view: window }));
  }, type, p.x, p.y, buttons);
  const toPage = async (p) => { const b = await overlayBox(); return { x: b.x + p.x, y: b.y + p.y }; };
  let held = false;
  const moveTo = async (p, steps = 6) => {
    if (synthetic) { await dispatch('pointermove', p, held ? 1 : 0); return; }
    const a = await toPage(p);
    await page.mouse.move(a.x, a.y, { steps });
  };
  const down = async (p) => { held = true; if (synthetic) return dispatch('pointerdown', p, 1); return page.mouse.down(); };
  const up = async (p) => { held = false; if (synthetic) return dispatch('pointerup', p, 0); return page.mouse.up(); };

  // --- open Patterns --------------------------------------------------------
  const openPatterns = async () => {
    if (await cp.$('[data-sve-lib-kind]')) return true;
    await cp.evaluate(() => document.querySelector('#__sve-toolbar button[data-tab="sections"]')?.click());
    return !!(await until(cardPoint, 10000, 250));
  };
  step('Patterns panel open', await openPatterns());

  // SVE_DOCK=1: the template dock and the HTML tree open too, as the owner works.
  if (env('SVE_DOCK', '') === '1') {
    await cp.evaluate(() => document.querySelector('#__sve-toolbar button[data-tab="code"]')?.click());
    const dock = await waitIn(cp, '#__sve-code-dock', 10000);
    if (!dock) { await cp.evaluate(() => document.querySelector('#__sve-toolbar button[data-tab="code"]')?.click()); }
    await sleep(2500);
    const facts = await cp.evaluate(() => ({ dock: !!document.getElementById('__sve-code-dock'), tree: !!document.getElementById('__sve-html-tree-panel'), patterns: !!document.querySelector('[data-sve-lib-kind]') }));
    info('dock + HTML tree open', JSON.stringify(facts));
    if (!facts.patterns) await openPatterns();
  }

  // Does the real mouse reach the CP? One move + click on empty toolbar space.
  {
    const before = await ptr();
    const c = await cardPoint();
    await moveTo({ x: c.x, y: c.y - 40 }, 2);
    await moveTo(c, 2);
    await sleep(100);
    const after = await ptr();
    synthetic = after.move === before.move;
    info('pointer driver', synthetic ? 'real mouse did not reach the CP — dispatching PointerEvents in the CP document' : `real mouse (${after.move - before.move} moves landed)`);
  }

  // --- the scenario, run once per mode ----------------------------------------
  const scenario = async (mode) => {
    const scaleBack = async () => until(async () => ((await pageScale()) > 0.999 ? true : null), 3000, 30);
    const scaleDown = async () => until(async () => ((await pageScale()) < 0.999 ? true : null), 3000, 30);
    const sections0 = await sectionCount();

    // 1. A plain click: nothing. Then the mouse wanders into the preview with no button held: still nothing.
    let c = await cardPoint();
    await moveTo(c);
    await down(c);
    await sleep(80);
    await up(c);
    await sleep(150);
    const afterClick = { ghost: await ghostOn(), scale: await pageScale(), locked: await frameLocked() };
    const pv = await previewPoint();
    await moveTo({ x: c.x - 30, y: c.y + 10 }, 3);
    await moveTo(pv, 10);
    await sleep(600);
    const afterWander = { ghost: await ghostOn(), scale: await pageScale(), locked: await frameLocked() };
    step(`${mode}: a click on a card does nothing`, !afterClick.ghost && afterClick.scale > 0.999 && !afterClick.locked, JSON.stringify(afterClick));
    step(`${mode}: after the click the mouse can go into the preview and nothing follows it`, !afterWander.ghost && afterWander.scale > 0.999 && !afterWander.locked, JSON.stringify(afterWander));

    // 2. A real drag: out → zoom; back → un-zoom while still held; out again → zoom; back and release → nothing inserted.
    c = await cardPoint();
    await moveTo(c);
    await down(c);
    await moveTo({ x: c.x + 24, y: c.y + 12 }, 4); // sideways inside the panel
    const z0 = await scaleDown();
    step(`${mode}: 24 px inside the panel: card picked up and the page already zooms out`, (await ghostOn()) && !!z0, `scale ${(await pageScale()).toFixed(3)}`);
    await moveTo(pv, 8);
    await sleep(400);
    const z1 = (await pageScale()) < 0.999;
    step(`${mode}: over the preview: still zoomed out`, z1, `scale ${(await pageScale()).toFixed(3)}`);
    await moveTo(c, 8); // back over the cards, button still down: the page stays zoomed out (as always)
    await sleep(400);
    step(`${mode}: back over Patterns while still holding: still zoomed out, nothing decided yet`, (await pageScale()) < 0.999, `scale ${(await pageScale()).toFixed(3)}`);
    await up(c);
    await scaleBack();
    await sleep(600);
    const afterAbort = { ghost: await ghostOn(), scale: await pageScale(), locked: await frameLocked(), sections: await sectionCount() };
    step(`${mode}: released over Patterns: nothing inserted, page at full size`, !afterAbort.ghost && afterAbort.scale > 0.999 && !afterAbort.locked && afterAbort.sections === sections0, JSON.stringify(afterAbort));
    // The mouse wanders again with no button: still nothing.
    await moveTo(pv, 8);
    await sleep(400);
    const wander2 = { ghost: await ghostOn(), scale: await pageScale() };
    step(`${mode}: after the abort the mouse is free`, !wander2.ghost && wander2.scale > 0.999, JSON.stringify(wander2));

    // 3. A drop in the preview inserts.
    c = await cardPoint();
    await moveTo(c);
    await down(c);
    await moveTo({ x: c.x + 24, y: c.y + 12 }, 4);
    await moveTo(pv, 8);
    await scaleDown();
    const sidsBefore = await cp.evaluate(() => [...document.getElementById('live-preview-iframe').contentDocument.querySelectorAll('[data-sid-section-orderable]')].map((el) => el.getAttribute('data-sid')));
    // A timeline from the release: page scale, section count and scrollY every ~30 ms for 3.5 s, sampled inside the CP.
    await cp.evaluate((n0) => { window.__tl = []; const t0 = performance.now(); const f = document.getElementById('live-preview-iframe'); const tick = () => { const d = f.contentDocument; const body = d?.body; const tr = body ? d.defaultView.getComputedStyle(body).transform : 'none'; window.__tl.push({ t: Math.round(performance.now() - t0), s: +(tr && tr !== 'none' ? new DOMMatrix(tr).a : 1).toFixed(3), n: d ? d.querySelectorAll('[data-sid-section-orderable]').length : -1, y: d ? Math.round(d.defaultView.scrollY) : -1, e: d ? (d.defaultView.__sveInlineEdit?.active ? 1 : 0) + (d.querySelector('[data-sve-editing]') ? 2 : 0) : -1 }); if (performance.now() - t0 < 16000) setTimeout(tick, 30); }; tick(); }, sections0);
    await cp.evaluate(() => { const w = document.getElementById('live-preview-iframe').contentWindow; w.__msgLog = []; const t0 = performance.now(); w.addEventListener('message', (ev) => { const d = ev.data || {}; if (d.name || d.source) w.__msgLog.push(`${Math.round(performance.now() - t0)}ms ${d.name || d.type}${d.sectionUids ? ' uids=' + JSON.stringify(d.sectionUids) : ''}${d.cancelled !== undefined ? ' cancelled=' + d.cancelled : ''}`); }, true); w.addEventListener('statamic:preview-updated', () => w.__msgLog.push(`${Math.round(performance.now() - t0)}ms [morphed]`)); const orig = w.postMessage.bind(w); w.postMessage = function (msg, ...rest) { if (msg && /sve-activate|edit-start|sve-html-pick$/.test(msg.type || '')) { const st = String(new Error().stack).split('\n').slice(2, 9).map((l) => l.trim().replace(/^at /, '').replace(/https?:\/\/[^/]+\/[^ ]*\/assets\//, '').replace(/\?[^:)]*/, '')).join(' < '); w.__msgLog.push(`SEND ${msg.type}${msg.ids ? ' ids=' + JSON.stringify(msg.ids) : ''}${msg.uid ? ' uid=' + msg.uid : ''} :: ${st}`); } return orig(msg, ...rest); }; });
    const reqs = [];
    const onReq = (r) => { const u = r.url(); if (/\/cp\/|\/!\/sve|live-preview|preview/.test(u)) reqs.push({ t: Date.now(), m: r.request().method(), u: u.replace(/^https?:\/\/[^/]+/, '').slice(0, 90), s: r.status() }); };
    page.on('response', onReq);
    const t0 = Date.now();
    await up(pv);
    const inserted = await until(async () => ((await sectionCount()) === sections0 + 1 ? true : null), 16000, 50);
    const tInserted = Date.now() - t0;
    const back = await scaleBack();
    const tBack = Date.now() - t0;
    // The new section scrolled into the preview's viewport (its top on screen).
    const inView = await until(() => cp.evaluate((before) => { const doc = document.getElementById('live-preview-iframe').contentDocument; const win = doc.defaultView; const el = [...doc.querySelectorAll('[data-sid-section-orderable]')].find((e) => !before.includes(e.getAttribute('data-sid'))); if (!el) return null; const r = el.getBoundingClientRect(); return r.top >= -1 && r.top < win.innerHeight * 0.8 ? { top: Math.round(r.top), scrollY: Math.round(win.scrollY) } : null; }, sidsBefore), 8000, 50);
    const tInView = Date.now() - t0;
    step(`${mode}: released over the preview: one section inserted, page back at full size`, !!inserted && !!back, `${sections0} → ${await sectionCount()}; inserted after ${tInserted} ms, full size after ${tBack} ms`);
    step(`${mode}: the new section is brought into view`, !!inView, inView ? `after ${tInView} ms, top ${inView.top}, scrollY ${inView.scrollY}` : `not within 8 s`);
    await sleep(Math.max(0, 16100 - (Date.now() - t0)));
    const tl = await cp.evaluate(() => window.__tl || []);
    const changes = tl.filter((e, i) => i === 0 || e.s !== tl[i - 1].s || e.n !== tl[i - 1].n || e.e !== tl[i - 1].e || Math.abs(e.y - tl[i - 1].y) > 2).map((e) => `${e.t}ms s=${e.s} n=${e.n} y=${e.y} edit=${e.e}`);
    info(`${mode}: timeline after release`, changes.slice(0, 40).join(' | '));
    page.off('response', onReq);
    info(`${mode}: preview messages`, (await cp.evaluate(() => document.getElementById('live-preview-iframe').contentWindow.__msgLog || ['(window replaced)'])).filter((m) => !/ext-drag-move/.test(m)).slice(0, 30).join(' | '));
    info(`${mode}: requests after release`, reqs.map((q) => `${q.t - t0}ms ${q.m} ${q.s} ${q.u}`).join(' | '));
  };

  await scenario('one preview');

  // --- the breakpoint overview --------------------------------------------------
  const LAYER = '#__sve-bp-overview';
  const BUTTON = '#__sve-preview-chrome [data-overview]';
  const opened = await cp.evaluate((sel) => { const b = document.querySelector(sel); if (!b) return false; b.click(); return true; }, BUTTON);
  const layer = opened && (await waitIn(cp, LAYER, 10000));
  const copies = layer ? await until(() => cp.evaluate((l) => { const n = [...document.querySelectorAll(`${l} iframe`)].filter((f) => f.getAttribute('src') && f.getAttribute('src') !== 'about:blank').length; return n >= 1 ? n : null; }, LAYER), 15000, 300) : 0;
  step('overview open with several sizes', !!layer && copies >= 1, layer ? `${copies} copies + the preview` : 'no overview layer');
  if (layer) {
    await sleep(2000);
    step('Patterns still open in the overview', await openPatterns());
    await scenario('overview');
  }
} catch (e) {
  report.ok = false;
  report.errors.push(`exception: ${e.message}`);
  console.log('EXC', e.stack);
} finally {
  if (served) info('worktree', `${served()} build files served from the working tree`);
  await browser.close();
}

const fails = report.steps.filter((s) => !s.ok);
console.log(`\n${report.ok ? 'PASS' : 'FAIL'}: ${report.steps.length - fails.length}/${report.steps.length} ok${report.errors.length ? `; errors: ${report.errors.slice(0, 6).join(' | ')}` : ''}`);
process.exit(report.ok ? 0 : 1);
