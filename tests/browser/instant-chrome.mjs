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
// A synced saved section the global-section stage references (`ggggggg`); '' skips the stage.
const GLOBAL_SOURCE = env('SVE_GLOBAL_SOURCE', '1f676f72-975f-46d2-99f8-cc457f456514');
const GLOBAL_PAGE = `${SITE_DIR}/content/collections/pages/sve-probe-global.md`;
const GLOBAL_PAGE_ID = 'a1b2c3d4-0000-4000-8000-svep0b3g10b1'.replace(/[^0-9a-f-]/g, '0');
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
// A 'leave page?' prompt must not hold a navigation.
page.on('dialog', (d) => d.accept().catch(() => {}));
// SVE_ONLY_GLOBAL=1 runs the global-section stage alone.
const ONLY_GLOBAL = env('SVE_ONLY_GLOBAL', '') === '1';
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
  // Config values are reactive proxies; serialise inside the page, or the CDP hands back `{}`.
  const templates = JSON.parse(await cp.evaluate(() => JSON.stringify(window.Statamic?.$config?.get?.('sveChromeTemplates') ?? null)));
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

  /** Where a frame's document sits on the page. */
  const frameOffset = async (frame) => { let x = 0, y = 0; for (let f = frame; f.parentFrame(); f = f.parentFrame()) { const box = await (await f.frameElement()).boundingBox(); x += box.x; y += box.y; } return { x, y }; };
  /** Click inside a frame at an element's centre with the real mouse. */
  const clickIn = async (frame, finder, ...args) => { const hit = await frame.evaluate(finder, ...args); if (!hit) return false; let x = hit.x, y = hit.y; for (let f = frame; f.parentFrame(); f = f.parentFrame()) { const box = await (await f.frameElement()).boundingBox(); x += box.x; y += box.y; } await page.mouse.click(x, y); return true; };
  /**
   * Step into the header or the footer: the first click asks ("global —
   * applies everywhere"), the confirm button steps in, and the CP mounts the
   * half's own form.
   */
  const enterChrome = async (kind) => {
    const lp = await livePreview();
    const sel = `[data-sve-chrome="${kind}"]`;
    // The footer sits below the fold of the preview's own scroll: bring it in first.
    await lp.evaluate((s, k) => document.querySelector(s)?.scrollIntoView({ block: k === 'footer' ? 'end' : 'start' }), sel, kind).catch(() => {});
    await sleep(400);
    const rect = await absoluteRect(lp, sel);
    // The half's own edge, not a heading in it: a click on text may start an
    // inline edit instead of the step-in — a person clicks the empty band.
    const x = rect.x + 8; const y = rect.y + 8;
    const off = await frameOffset(lp);
    const under = await lp.evaluate((px, py) => { const el = document.elementFromPoint(px, py); return el ? `${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}.${[...el.classList].slice(0, 3).join('.')} sid=${!!el.closest('[data-sid]')} chrome=${!!el.closest('[data-sve-chrome]')}` : 'nothing'; }, x - off.x, y - off.y);
    await page.mouse.click(x, y);
    const asked = await waitIn(lp, '#__sve-preview-confirm [data-sve-actions] button', 8000);
    const after = await lp.evaluate(() => ({ html: document.documentElement.className, confirm: !!document.getElementById('__sve-preview-confirm'), editing: !!document.querySelector('[contenteditable="true"]'), active: document.querySelector('[data-sid-active]')?.getAttribute('data-sid') || '' }));
    console.log(`info ${kind}: clicked ${Math.round(x)},${Math.round(y)} on ${under}; confirm shown=${asked}; after=${JSON.stringify(after)}`);
    if (asked) {
      await clickIn(lp, () => { const b = [...document.querySelectorAll('#__sve-preview-confirm [data-sve-actions] button')].pop(); if (!b) return null; const r = b.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
    }
    return waitIn(cp, `#__sve-chrome-host[data-sve-chrome-kind="${kind}"], #__sve-globals-panel[data-sve-chrome-kind="${kind}"]`, 15000);
  };
  /** Leave the half through its bar's last button (Close), so the next click is a page click again. */
  const leaveChrome = async () => { const lp = await livePreview(); await clickIn(lp, () => { const bar = document.querySelector('[id*="chrome-bar"]'); const b = bar ? [...bar.querySelectorAll('button')].pop() : null; if (!b) return null; const r = b.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }); await sleep(1500); };

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

  if (ONLY_GLOBAL) { console.log('info header/footer/static stages skipped'); } else {
  // ---- Header: step into it in the preview, the dock opens its file ----
  step('header editor open', await enterChrome('header'));
  await sleep(1500);
  step('code dock open', await openDock());
  let path = await waitPath(/site_head|partials\/header\//);
  step('dock opened the header\'s file', /partials\/site_head\.antlers\.html$/.test(path), path);
  if (path) { remember(path); await probe('header', path, 'data-sve-chrome="header"', 'sve-probe-h', 'hdr', '[data-sve-chrome="header"]'); }

  // ---- Footer: leave the header first — inside a half the rest of the page is locked ----
  await leaveChrome();
  step('footer editor open', await enterChrome('footer'));
  await sleep(2000);
  path = await waitPath(/partials\/footer\//);
  step('dock opened the footer\'s file', /partials\/footer\/widgets\.antlers\.html$/.test(path), path);
  if (path) { remember(path); await probe('footer', path, 'data-sve-chrome="footer"', 'sve-probe-f', 'ftr', '[data-sve-chrome="footer"]'); }

  // ---- Static (custom) section: a page-section row without a fieldset ----
  await leaveChrome();
  const staticSel = `[data-sid="${STATIC_SID}"]`;
  const lp = await livePreview();
  const hasStatic = await lp.evaluate((s) => !!document.querySelector(s), staticSel);
  step('page holds the static section', hasStatic, staticSel);
  if (hasStatic) {
    // An empty static section has no height to click; give it some for the click only (the morph paints it back).
    await lp.evaluate((s) => { const el = document.querySelector(s); if (el && el.getBoundingClientRect().height < 8) el.style.minHeight = '6em'; el?.scrollIntoView({ block: 'center' }); }, staticSel);
    await sleep(300);
    await realClick(page, lp, staticSel, 30);
    await sleep(2000);
    path = await waitPath(/static_section\//);
    step('dock opened the static section\'s file', /page_sections\/static_section\/.+\.antlers\.html$/.test(path), path);
    if (path) { remember(path); await probe('static', path, 'section_orderable', 'sve-probe-s', 'sta', staticSel); }
  }
  }

  // ---- Global section: a page row that renders a synced saved section ----
  if (GLOBAL_SOURCE) {
    writeFileSync(GLOBAL_PAGE, `---\nid: ${GLOBAL_PAGE_ID}\npublished: false\nblueprint: page\ntitle: sve-probe-global\npage_sections:\n  -\n    id: sveprobeglob\n    _visual_id: sveprobeglob\n    enabled: true\n    type: global_section\n    global_section: ${GLOBAL_SOURCE}\n---\n`);
    await sleep(1500);
    // The stache notices a new flat file on a later request: ask until the entry answers.
    let hasLp = false;
    for (let i = 0; i < 8 && !hasLp; i++) {
      await page.goto(`${SITE_URL}/cp/collections/pages/entries/${GLOBAL_PAGE_ID}`, { waitUntil: 'networkidle2' });
      await sleep(1500);
      hasLp = await page.evaluate(() => !![...document.querySelectorAll('button')].find((e) => /live preview/i.test(e.textContent || '')));
    }
    console.log(`info global: at ${page.url()} — ${await page.title()} — live preview button: ${hasLp}`);
    await page.evaluate(() => [...document.querySelectorAll('button')].find((e) => /live preview/i.test(e.textContent || ''))?.click());
    step('global: preview overlay open', await waitIn(page, 'iframe.sve-edit-overlay[data-open]', 30000));
    const cp2 = await (await page.$('iframe.sve-edit-overlay')).contentFrame();
    await waitIn(cp2, '#__sve-toolbar button', 20000);
    const lp2 = async () => { const el = await cp2.$('#live-preview-iframe'); return el ? el.contentFrame() : null; };
    let rendered = false;
    for (let i = 0; i < 25 && !rendered; i++) { const p = await lp2(); rendered = p ? await p.evaluate(() => !!document.querySelector('[data-sve-global-root] [data-sid]')).catch(() => false) : false; if (!rendered) await sleep(1000); }
    step('global: the referenced section rendered', rendered);
    if (rendered) {
      const g = await lp2();
      const sel = '[data-sve-global-root] [data-sid]';
      await g.evaluate((s) => document.querySelector(s)?.scrollIntoView({ block: 'start' }), sel);
      await sleep(400);
      // The header lies absolute over the top of the first section: click the
      // first point down the section's middle that is the section's own.
      const clickSection = async () => { const f = await lp2(); const hit = await f.evaluate((s) => { const el = document.querySelector(s); if (!el) return null; const r = el.getBoundingClientRect(); const x = r.x + r.width / 2; for (let y = r.y + 12; y < Math.min(r.bottom - 4, window.innerHeight - 4); y += 24) { const at = document.elementFromPoint(x, y); if (at && at.closest('[data-sve-global]') && !at.closest('[data-sve-chrome]')) return { x, y, on: at.tagName.toLowerCase() }; } return null; }, sel); if (!hit) return false; let x = hit.x, y = hit.y; for (let fr = f; fr.parentFrame(); fr = fr.parentFrame()) { const box = await (await fr.frameElement()).boundingBox(); x += box.x; y += box.y; } await page.mouse.click(x, y); console.log(`info global: clicked ${Math.round(x)},${Math.round(y)} on ${hit.on}`); return true; };
      step('global: clicked inside the section', await clickSection());
      const askedG = await waitIn(g, '#__sve-preview-confirm [data-sve-actions] button', 8000);
      if (askedG) {
        await clickIn(g, () => { const b = [...document.querySelectorAll('#__sve-preview-confirm [data-sve-actions] button')].pop(); if (!b) return null; const r = b.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
      }
      const hostG = await waitIn(cp2, '#__sve-global-section-host', 15000);
      const afterG = await (await lp2()).evaluate(() => ({ html: document.documentElement.className, globalAttr: !!document.querySelector('[data-sve-global]'), bar: !!document.querySelector('[id*="global-bar"]'), active: document.querySelector('[data-sid-active]')?.getAttribute('data-sid') || '' })).catch(() => null);
      const cpG = await cp2.evaluate(() => ({ host: !!document.getElementById('__sve-global-section-host'), panel: !!document.getElementById('__sve-global-section-panel'), ids: [...document.querySelectorAll('[id^="__sve-global"]')].map((e) => e.id) }));
      console.log(`info global: confirm shown=${askedG}; preview=${JSON.stringify(afterG)}; cp=${JSON.stringify(cpG)}`);
      step('global: section editor open', hostG);
      await sleep(1500);
      await clickSection();
      await sleep(1500);
      let dock2 = false;
      for (let attempt = 1; attempt <= 2 && !dock2; attempt++) { if (!(await cp2.$('#__sve-code-dock [data-sve-code-pane="html"] .cm-editor'))) { await realClick(page, cp2, '#__sve-toolbar button[data-tab="code"]'); await sleep(600); } dock2 = await waitIn(cp2, '#__sve-code-dock [data-sve-code-pane="html"] .cm-editor', 15000); if (!dock2) await sleep(2000); }
      step('global: code dock open', dock2);
      await sleep(1200);
      const p2 = async (re, ms = 12000) => { const t0 = Date.now(); let v = ''; while (Date.now() - t0 < ms) { v = await cp2.evaluate(() => { const el = document.querySelector('#__sve-code-dock [data-sve-code-path], [data-sve-code-path]'); return el ? (el.getAttribute('data-sve-code-path') || el.textContent.trim()) : ''; }); if (re.test(v)) return v; await sleep(200); } return v; };
      const gpath = await p2(/page_sections\//);
      step('global: dock opened the source section\'s file', /page_sections\/.+\.antlers\.html$/.test(gpath), gpath);
      if (gpath) {
        remember(gpath);
        const locked = await cp2.evaluate(() => document.querySelector('#__sve-code-dock')?.hasAttribute('data-sve-code-locked'));
        if (locked) { await realClick(page, cp2, '#__sve-code-dock [data-sve-code-lock]'); if (await waitIn(cp2, '.sve-dialog .sve-dialog__actions button', 8000)) { const box = await (await cp2.frameElement()).boundingBox(); const r = await cp2.evaluate(() => { const b = [...document.querySelectorAll('.sve-dialog .sve-dialog__actions button')].pop(); const q = b.getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2 }; }); await page.mouse.click(box.x + r.x, box.y + r.y); } for (let i = 0; i < 20; i++) { await sleep(500); if (await cp2.evaluate(() => !document.querySelector('#__sve-code-dock')?.hasAttribute('data-sve-code-locked'))) break; } }
        const at = await cp2.evaluate(() => { const c = document.querySelector('#__sve-code-dock [data-sve-code-pane="html"] .cm-content'); const v = c?.cmTile?.view || c?.cmView?.view; if (!v) return null; const doc = v.state.doc.toString(); const i = doc.search(/<(section|div|article)\b/); if (i < 0) return null; const gt = doc.indexOf('>', i); const line = v.state.doc.lineAt(gt); v.dispatch({ selection: { anchor: line.to }, scrollIntoView: true }); v.focus(); return line.to; });
        step('global: caret after the root\'s line', at != null);
        await page.keyboard.press('Enter');
        const html = '<p class="sve-probe-g">glo</p>';
        await page.keyboard.type(html, { delay: 5 });
        const t0 = Date.now(); let ms = -1;
        while (Date.now() - t0 < 4000) { const g2 = await lp2(); if (g2 && await g2.evaluate(() => document.querySelector('[data-sve-global-root] .sve-probe-g')?.textContent.trim() === 'glo').catch(() => false)) { ms = Date.now() - t0; break; } await sleep(20); }
        step('global: the new <p> paints at once', ms >= 0 && ms <= INSTANT_MS, `${ms} ms`);
        await sleep(3000);
        const g3 = await lp2();
        step('global: still there after the morph', !!g3 && await g3.evaluate(() => document.querySelector('[data-sve-global-root] .sve-probe-g')?.textContent.trim() === 'glo').catch(() => false));
        step('global: the file on disk holds it', fileHas(gpath, html), gpath);
        const trace = await cp2.evaluate(() => (window.__sveInstantTrace || []).slice(-4).map((l) => l.replace(/^\d+ /, '')));
        console.log(`info global trace: ${JSON.stringify(trace)}`);
      }
    }
  }
} catch (e) {
  report.errors.push(`exception: ${e.message}`); report.ok = false;
} finally {
  await browser.close();
  if (existsSync(GLOBAL_PAGE)) { unlinkSync(GLOBAL_PAGE); console.log('info temporary page removed'); }
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
