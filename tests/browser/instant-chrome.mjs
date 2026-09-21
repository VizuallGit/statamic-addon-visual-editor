#!/usr/bin/env node
/**
 * Instant paint and morph in the files that are NOT page-section rows: the
 * header, the footer and a static (custom) section.
 *
 * The header's file is the partial carrying `data-sve-chrome="header"` (on
 * this site `partials/site_head.antlers.html`), the footer's is
 * `partials/footer/widgets.antlers.html`. The dock used to open
 * `header/style_1` — a file nothing renders — so every keystroke saved and
 * the preview never changed. Each step types a static <p> into the open file,
 * measures how long the preview takes to show it (Instant is one frame) and
 * checks it is still there after the ~1 s morph (the morph reads the file:
 * only the right file keeps it).
 *
 * Serves the working tree's `dock-instant-preview.js`; with SVE_WORKTREE=1
 * the build too. Every file the dock autosaves is backed up and put back.
 *
 * Env: SVE_PASS (required), SVE_ENTRY (a page with a static section — the
 * default page holds `static_section/uuuuuu`), the rest as live-preview-smoke.mjs.
 */
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync, unlinkSync, rmdirSync } from 'node:fs';
import { serveWorktreeBuild } from './serve-worktree.mjs';

const startedAt = Date.now();
const env = (key, fallback) => process.env[key] || fallback;
const SITE_DIR = env('SVE_SITE_DIR', `${process.env.HOME}/Sites/vizuall-skabelon`);
const ADDON_DIR = env('SVE_ADDON_DIR', `${process.env.HOME}/Sites/statamic-addon-visual-editor-vue`);
const SITE_URL = env('SVE_SITE_URL', 'http://vizuall-skabelon.test');
const USER = env('SVE_USER', 'claude-test@vizuall.dk');
const PASS = env('SVE_PASS', '');
const ENTRY = env('SVE_ENTRY', '/cp/collections/pages/entries/4cfafa3a-3d8d-4d68-8df7-bdd0a86b0960');
const STATIC_SID = env('SVE_STATIC_SID', 'mubfn690itlw');
const CHROME = env('SVE_CHROME', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome');
const SCRIPT = `${ADDON_DIR}/resources/js/dock-instant-preview.js`;
const INSTANT_MS = 200;

const puppeteer = createRequire(`${SITE_DIR}/package.json`)('puppeteer');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const report = { steps: [], errors: [], ok: true };
const step = (name, ok, detail = '') => { report.steps.push({ name, ok, detail }); if (!ok) report.ok = false; console.log(`${ok ? 'ok ' : 'FAIL'} ${name}${detail ? ' — ' + detail : ''}`); };
async function waitIn(frame, selector, ms) { try { await frame.waitForSelector(selector, { timeout: ms }); return true; } catch { return false; } }
async function absoluteRect(frame, selector) {
  const rect = await frame.evaluate((sel) => { for (const el of document.querySelectorAll(sel)) { const r = el.getBoundingClientRect(); if (r.width > 0 && r.height > 0 && r.right > 0 && r.bottom > 0) return { x: r.x, y: r.y, w: r.width, h: r.height }; } return null; }, selector);
  if (!rect) throw new Error(`no visible element for ${selector}`);
  for (let f = frame; f.parentFrame(); f = f.parentFrame()) { const box = await (await f.frameElement()).boundingBox(); rect.x += box.x; rect.y += box.y; }
  return rect;
}
async function realClick(page, frame, selector, yMax = 300) { const r = await absoluteRect(frame, selector); await page.mouse.click(r.x + r.w / 2, r.y + Math.min(r.h / 2, yMax)); }

const scriptSource = readFileSync(SCRIPT, 'utf8');
const browser = await puppeteer.launch({ headless: true, executablePath: CHROME, defaultViewport: { width: 1440, height: 900 } });
const page = await browser.newPage();
page.on('pageerror', (e) => report.errors.push(`pageerror: ${e.message}`));
page.on('console', (m) => { if (m.type() === 'error' || /\[sve\] instant/.test(m.text())) report.errors.push(`console: ${m.text().slice(0, 200)}`); });
const answerScript = (req) => { if (!/\/vendor\/visual-editor\/js\/dock-instant-preview\.js/.test(req.url())) return false; req.respond({ status: 200, contentType: 'application/javascript', body: scriptSource }); return true; };
let servedBuild = null;
if (process.env.SVE_WORKTREE === '1') {
  servedBuild = await serveWorktreeBuild(page, { buildDir: process.env.SVE_BUILD_DIR || `${ADDON_DIR}/resources/dist/build`, installedManifest: `${SITE_DIR}/public/vendor/visual-editor/build/manifest.json`, scriptsDir: `${ADDON_DIR}/resources/js`, extra: answerScript });
} else {
  await page.setRequestInterception(true);
  page.on('request', (req) => { if (!answerScript(req)) req.continue(); });
}

// Every file the dock wrote to, with what it held before.
const backups = new Map();
const touched = new Set();
const remember = (rel) => { const abs = rel.startsWith('/') ? rel : `${SITE_DIR}/${rel}`; if (!backups.has(abs) && existsSync(abs)) backups.set(abs, readFileSync(abs, 'utf8')); touched.add(rel); return abs; };

try {
  await page.goto(`${SITE_URL}/cp`, { waitUntil: 'networkidle2' });
  await page.waitForSelector('input[name="email"]');
  await page.type('input[name="email"]', USER); await page.type('input[name="password"]', PASS);
  await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle2' }), page.keyboard.press('Enter')]);
  step('login', !/login/.test(page.url()), page.url());
  await page.goto(`${SITE_URL}${ENTRY}`, { waitUntil: 'networkidle2' });
  await sleep(1500);
  await page.evaluate(() => [...document.querySelectorAll('button')].find((e) => /live preview/i.test(e.textContent || ''))?.click());
  step('preview overlay open', await waitIn(page, 'iframe.sve-edit-overlay[data-open]', 30000));
  const cp = await (await page.$('iframe.sve-edit-overlay')).contentFrame();
  await waitIn(cp, '#__sve-toolbar button', 20000);
  const livePreview = async () => { const el = await cp.$('#live-preview-iframe'); return el ? el.contentFrame() : null; };
  let hasSection = false;
  for (let i = 0; i < 25 && !hasSection; i++) { const p = await livePreview(); hasSection = p ? await p.evaluate(() => !!document.querySelector('[id^="id-"]')).catch(() => false) : false; if (!hasSection) await sleep(1000); }
  step('preview rendered', hasSection);
  const templates = await cp.evaluate(() => window.Statamic?.$config?.get?.('sveChromeTemplates') || null);
  step('server names the chrome files', !!templates?.header?.type && !!templates?.footer?.type, JSON.stringify(templates));

  const dockPath = () => cp.evaluate(() => { const el = document.querySelector('#__sve-code-dock [data-sve-code-path], [data-sve-code-path]'); return el ? (el.getAttribute('data-sve-code-path') || el.textContent.trim()) : ''; });
  const openDock = async () => { let ok = false; for (let attempt = 1; attempt <= 2 && !ok; attempt++) { if (!(await cp.$('#__sve-code-dock [data-sve-code-pane="html"] .cm-editor'))) { await realClick(page, cp, '#__sve-toolbar button[data-tab="code"]'); await sleep(600); } ok = await waitIn(cp, '#__sve-code-dock [data-sve-code-pane="html"] .cm-editor', 15000); if (!ok) await sleep(2000); } await sleep(1200); return ok; };
  const waitPath = async (re, ms = 12000) => { const t0 = Date.now(); let p = ''; while (Date.now() - t0 < ms) { p = await dockPath(); if (re.test(p)) return p; await sleep(200); } return p; };
  const unlockIfLocked = async () => {
    const locked = await cp.evaluate(() => document.querySelector('#__sve-code-dock')?.hasAttribute('data-sve-code-locked'));
    if (!locked) return true;
    await realClick(page, cp, '#__sve-code-dock [data-sve-code-lock]');
    if (await waitIn(cp, '.sve-dialog .sve-dialog__actions button', 8000)) { const box = await (await cp.frameElement()).boundingBox(); const r = await cp.evaluate(() => { const b = [...document.querySelectorAll('.sve-dialog .sve-dialog__actions button')].pop(); const q = b.getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2 }; }); await page.mouse.click(box.x + r.x, box.y + r.y); }
    for (let i = 0; i < 20; i++) { await sleep(500); if (await cp.evaluate(() => !document.querySelector('#__sve-code-dock')?.hasAttribute('data-sve-code-locked'))) return true; }
    return false;
  };
  // The caret at the end of the first line that holds `needle`, through CodeMirror's own API.
  const caretAfterLine = (needle) => cp.evaluate((n) => { const c = document.querySelector('#__sve-code-dock [data-sve-code-pane="html"] .cm-content'); const v = c?.cmTile?.view || c?.cmView?.view; if (!v) return null; const doc = v.state.doc.toString(); const at = doc.indexOf(n); if (at < 0) return null; const line = v.state.doc.lineAt(at); v.dispatch({ selection: { anchor: line.to }, scrollIntoView: true }); v.focus(); return line.to; }, needle);
  const liveHas = (sel, want) => livePreview().then((p) => p ? p.evaluate((w) => { const el = document.querySelector(w.sel); return !!el && el.textContent.trim() === w.want; }, { sel, want }).catch(() => false) : false);
  const latency = async (sel, want, max = 4000) => { const t0 = Date.now(); while (Date.now() - t0 < max) { if (await liveHas(sel, want)) return Date.now() - t0; await sleep(20); } return -1; };
  const fileHas = (rel, text) => { const abs = rel.startsWith('/') ? rel : `${SITE_DIR}/${rel}`; return existsSync(abs) && readFileSync(abs, 'utf8').includes(text); };

  /** Type a probe after the root line and measure: Instant, then the morph keeping it, then the file holding it. */
  const probe = async (name, rel, rootNeedle, cls, text, hostSel) => {
    await unlockIfLocked();
    step(`${name}: caret after the root's line`, (await caretAfterLine(rootNeedle)) != null, rootNeedle);
    await page.keyboard.press('Enter');
    const html = `<p class="${cls}">${text}</p>`;
    await page.keyboard.type(html, { delay: 5 });
    const ms = await latency(`${hostSel} .${cls}`, text);
    step(`${name}: the new <p> paints at once`, ms >= 0 && ms <= INSTANT_MS, `${ms} ms`);
    await sleep(3000);
    step(`${name}: still there after the morph`, await liveHas(`${hostSel} .${cls}`, text));
    step(`${name}: the file on disk holds it`, fileHas(rel, html), rel);
    const trace = await cp.evaluate(() => (window.__sveInstantTrace || []).slice(-4).map((l) => l.replace(/^\d+ /, '')));
    console.log(`info ${name} trace: ${JSON.stringify(trace)}`);
  };

  // ---- Header: click it in the preview, the dock opens its file ----
  await realClick(page, await livePreview(), '[data-sve-chrome="header"]', 40);
  step('header editor open', await waitIn(cp, '#__sve-chrome-host, #__sve-globals-panel', 15000));
  await sleep(1500);
  step('code dock open', await openDock());
  let path = await waitPath(/site_head|partials\/header\//);
  step('dock opened the header\'s file', /partials\/site_head\.antlers\.html$/.test(path), path);
  if (path) { remember(path); await probe('header', path, 'data-sve-chrome="header"', 'sve-probe-h', 'hdr', '[data-sve-chrome="header"]'); }

  // ---- Footer ----
  await realClick(page, await livePreview(), '[data-sve-chrome="footer"]', 40);
  await sleep(2000);
  path = await waitPath(/partials\/footer\//);
  step('dock opened the footer\'s file', /partials\/footer\/widgets\.antlers\.html$/.test(path), path);
  if (path) { remember(path); await probe('footer', path, 'data-sve-chrome="footer"', 'sve-probe-f', 'ftr', '[data-sve-chrome="footer"]'); }

  // ---- Static (custom) section: a page-section row without a fieldset ----
  const staticSel = `[data-sid="${STATIC_SID}"]`;
  const lp = await livePreview();
  const hasStatic = await lp.evaluate((s) => !!document.querySelector(s), staticSel);
  step('page holds the static section', hasStatic, staticSel);
  if (hasStatic) {
    await realClick(page, lp, staticSel, 30);
    await sleep(2000);
    path = await waitPath(/static_section\//);
    step('dock opened the static section\'s file', /page_sections\/static_section\/.+\.antlers\.html$/.test(path), path);
    if (path) { remember(path); await probe('static', path, 'section_orderable', 'sve-probe-s', 'sta', staticSel); }
  }
} catch (e) {
  report.errors.push(`exception: ${e.message}`); report.ok = false;
} finally {
  await browser.close();
  await sleep(2000);
  for (const [abs, original] of backups) {
    let stable = 0;
    for (let i = 0; i < 60 && stable < 9; i++) { if (readFileSync(abs, 'utf8') !== original) { writeFileSync(abs, original); stable = 0; } else { stable++; } await sleep(700); }
    step('file restored', readFileSync(abs, 'utf8') === original, abs);
  }
  for (const rel of touched) {
    const historyDir = `${SITE_DIR}/storage/statamic-visual-editor/history/${rel.replace(/\//g, '_')}`;
    if (existsSync(historyDir)) { let removed = 0; for (const name of readdirSync(historyDir)) { const f = `${historyDir}/${name}`; if (statSync(f).mtimeMs >= startedAt - 1000) { unlinkSync(f); removed++; } } if (!readdirSync(historyDir).length) rmdirSync(historyDir); console.log(`info history snapshots removed for ${rel} — ${removed}`); }
  }
  if (servedBuild) console.log(`info ${servedBuild()} build files served from the working tree`);
}
const realErrors = report.errors.filter((e) => !/favicon|net::ERR_ABORTED|status of 4/i.test(e));
step('no JavaScript errors', realErrors.length === 0, realErrors.slice(0, 5).join(' | '));
console.log(JSON.stringify({ ok: report.ok, errors: realErrors }));
process.exit(report.ok ? 0 : 1);
