#!/usr/bin/env node
/**
 * Instant HTML paint — typing structure in the dock's HTML pane changes the
 * focused Live Preview section in the same frame, before the PHP morph.
 *
 * Serves the working-tree `resources/js/dock-instant-preview.js` in place of
 * the installed one (request interception), so the script is proven in a real
 * browser before it is released. The dock autosaves to the section's file on
 * the site: the file is backed up before typing and written back afterwards.
 *
 * Same env vars as live-preview-smoke.mjs. Also:
 *   SVE_ADDON_DIR  addon checkout (defaults to the sibling of SVE_SITE_DIR)
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
const ENTRY = env('SVE_ENTRY', '/cp/collections/pages/entries/68f56034-ce7c-4d33-b15d-da7fa7675662');
const CHROME = env('SVE_CHROME', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome');
const SCRIPT = `${ADDON_DIR}/resources/js/dock-instant-preview.js`;

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
async function realClick(page, frame, selector) { const r = await absoluteRect(frame, selector); await page.mouse.click(r.x + r.w / 2, r.y + Math.min(r.h / 2, 300)); }

const scriptSource = readFileSync(SCRIPT, 'utf8');
const browser = await puppeteer.launch({ headless: true, executablePath: CHROME, defaultViewport: { width: 1440, height: 900 } });
const page = await browser.newPage();
page.on('pageerror', (e) => report.errors.push(`pageerror: ${e.message}`));
page.on('console', (m) => { if (m.type() === 'error' || /\[sve\] instant/.test(m.text())) report.errors.push(`console: ${m.text().slice(0, 200)}`); });
// The standalone script always comes from this checkout; with SVE_WORKTREE=1 the
// build does too, so the dock chunk under test is this checkout's as well.
let served = 0;
const answerScript = (req) => {
  if (!/\/vendor\/visual-editor\/js\/dock-instant-preview\.js/.test(req.url())) return false;
  served++;
  req.respond({ status: 200, contentType: 'application/javascript', body: scriptSource });
  return true;
};
let servedBuild = null;
if (process.env.SVE_WORKTREE === '1') {
  servedBuild = await serveWorktreeBuild(page, { buildDir: process.env.SVE_BUILD_DIR || `${ADDON_DIR}/resources/dist/build`, installedManifest: `${SITE_DIR}/public/vendor/visual-editor/build/manifest.json`, scriptsDir: `${ADDON_DIR}/resources/js`, extra: answerScript });
} else {
  await page.setRequestInterception(true);
  page.on('request', (req) => { if (!answerScript(req)) req.continue(); });
}

let filePath = null;
let original = null;
try {
  await page.goto(`${SITE_URL}/cp`, { waitUntil: 'networkidle2' });
  await page.waitForSelector('input[name="email"]');
  await page.type('input[name="email"]', USER); await page.type('input[name="password"]', PASS);
  await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle2' }), page.keyboard.press('Enter')]);
  await page.goto(`${SITE_URL}${ENTRY}`, { waitUntil: 'networkidle2' });
  await sleep(1500);
  await page.evaluate(() => [...document.querySelectorAll('button')].find((e) => /live preview/i.test(e.textContent || ''))?.click());
  const overlay = await waitIn(page, 'iframe.sve-edit-overlay[data-open]', 30000);
  step('preview overlay open', overlay);
  const cp = await (await page.$('iframe.sve-edit-overlay')).contentFrame();
  step('working-tree script served to the CP', served > 0, `${served} request(s) intercepted${servedBuild ? `; ${servedBuild()} build files from the working tree` : ''}`);
  await waitIn(cp, '#__sve-toolbar button', 20000);

  let preview = null; let hasSection = false;
  for (let i = 0; i < 25 && !hasSection; i++) {
    const lpEl = await cp.$('#live-preview-iframe'); preview = lpEl ? await lpEl.contentFrame() : null;
    hasSection = preview ? await preview.evaluate(() => !!document.querySelector('[id^="id-"]')).catch(() => false) : false;
    if (!hasSection) await sleep(1000);
  }
  step('preview section rendered', hasSection);
  // The iframe is re-created on unlock and on some morphs: look it up before every use.
  const livePreview = async () => { const el = await cp.$('#live-preview-iframe'); return el ? el.contentFrame() : null; };

  // Focus a section, open the dock.
  await realClick(page, await livePreview(), '[id^="id-"]'); await sleep(2000);
  let dock = false;
  for (let attempt = 1; attempt <= 2 && !dock; attempt++) { await realClick(page, cp, '#__sve-toolbar button[data-tab="code"]'); await sleep(600); dock = await waitIn(cp, '#__sve-code-dock [data-sve-code-pane="html"] .cm-editor', 15000); if (!dock) await sleep(2000); }
  step('code dock open with an HTML pane', dock);
  await sleep(1500);

  filePath = await cp.evaluate(() => { const el = document.querySelector('#__sve-code-dock [data-sve-code-path], [data-sve-code-path]'); return el ? (el.getAttribute('data-sve-code-path') || el.textContent.trim()) : ''; });
  step('dock knows its file', !!filePath, filePath);
  const abs = filePath ? (filePath.startsWith('/') ? filePath : `${SITE_DIR}/${filePath}`) : null;
  if (abs && existsSync(abs)) original = readFileSync(abs, 'utf8');
  step('section file backed up', !!original, abs || '');

  // A locked template ignores keystrokes. Unlock through the dock's own button
  // and confirm dialog; restoring the file afterwards restores the lock marker.
  const lockedAtStart = await cp.evaluate(() => document.querySelector('#__sve-code-dock')?.hasAttribute('data-sve-code-locked'));
  if (lockedAtStart) {
    await realClick(page, cp, '#__sve-code-dock [data-sve-code-lock]');
    const dialog = await waitIn(cp, '.sve-dialog .sve-dialog__actions button', 8000);
    if (dialog) {
      const box = await (await cp.frameElement()).boundingBox();
      const r = await cp.evaluate(() => { const b = [...document.querySelectorAll('.sve-dialog .sve-dialog__actions button')].pop(); const q = b.getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2, label: b.textContent.trim() }; });
      await page.mouse.click(box.x + r.x, box.y + r.y);
      console.log('info unlock dialog — clicked', JSON.stringify(r.label));
    }
    let unlocked = false;
    for (let i = 0; i < 20 && !unlocked; i++) { await sleep(500); unlocked = await cp.evaluate(() => !document.querySelector('#__sve-code-dock')?.hasAttribute('data-sve-code-locked')); }
    step('template unlocked for the test', unlocked);
  } else {
    console.log('info template was not locked');
  }

  // The section the dock is showing, in the preview.
  // The section root the dock is editing: the first visible [id^="id-"] element, read
  // the same way before and after so the comparison is on one node.
  const before = await (await livePreview()).evaluate(() => { for (const el of document.querySelectorAll('[id^="id-"]')) { const r = el.getBoundingClientRect(); if (r.width > 0 && r.height > 0 && r.right > 0 && r.bottom > 0) return { sid: el.getAttribute('data-sid') || '', id: el.id, kids: el.children.length }; } return { sid: '', id: '', kids: 0 }; });
  step('live section located', !!before.id, `${before.id} (${before.kids} children)`);

  // Type: a static element right after the root's opening tag — with real
  // keystrokes, so the dock's own input handlers run exactly as for a person.
  const probe = '<p class="sve-instant-probe">instant</p>';
  const tile = await cp.evaluate(() => { const c = document.querySelector('#__sve-code-dock [data-sve-code-pane="html"] .cm-content'); const t = c && c.cmTile; return t ? `cmTile keys: ${Object.keys(t).slice(0, 12).join(',')}; view? ${!!t.view} editorView? ${!!t.editorView}` : 'no cmTile'; });
  console.log('info CodeMirror content node —', tile);
  const lineRect = await cp.evaluate(() => {
    const lines = [...document.querySelectorAll('#__sve-code-dock [data-sve-code-pane="html"] .cm-line')];
    let text = '';
    for (const line of lines) {
      text += line.textContent + '\n';
      const open = text.search(/<(section|div|article|header)\b/);
      if (open !== -1 && text.indexOf('>', open) !== -1) { const r = line.getBoundingClientRect(); line.scrollIntoView({ block: 'center' }); const r2 = line.getBoundingClientRect(); return { x: r2.right - 2, y: r2.y + r2.height / 2, line: line.textContent.slice(0, 60) }; }
    }
    return null;
  });
  step('found the line that closes the root tag', !!lineRect, lineRect?.line || '');
  let typed = { ok: false, why: 'no line' };
  if (lineRect) {
    const box = await (await cp.frameElement()).boundingBox();
    await page.mouse.click(box.x + lineRect.x, box.y + lineRect.y);
    await page.keyboard.press('End');
    await page.keyboard.press('Enter');
    await page.keyboard.type(probe, { delay: 5 });
    typed = { ok: true };
  }
  step('typed a static element into the HTML pane', typed.ok, typed.why || '');

  // Same frame: the probe is in the preview well before the ~1 s morph.
  await sleep(120);
  console.log('info dock —', await cp.evaluate(() => { const d = document.querySelector('#__sve-code-dock'); return `${[...d.attributes].map((a) => a.name + (a.value ? '=' + a.value.slice(0, 20) : '')).join(' ')} | script v${window.__sveDockInstantPreview} | trace: ${(window.__sveInstantTrace || []).slice(-6).map((l) => l.replace(/^\d+ /, '')).join(' → ')}`; }));
  const painted = await (await livePreview()).evaluate(() => { const el = document.querySelector('.sve-instant-probe'); return el ? { text: el.textContent, inRoot: !!el.closest('[id^="id-"]') } : null; });
  step('probe painted within 120 ms (before morph)', !!painted && painted.text === 'instant' && painted.inRoot, JSON.stringify(painted));

  // Server-owned attributes were not invented, the root kept its data-sid.
  const after = await (await livePreview()).evaluate(() => { const el = document.querySelector('.sve-instant-probe'); const root = el?.closest('[id^="id-"]'); return { probeSid: el?.hasAttribute('data-sid') || false, rootSid: root?.getAttribute('data-sid') || '' }; });
  step('no data-sid invented; root kept its data-sid', after.probeSid === false && after.rootSid === before.sid, JSON.stringify(after));

  // Remove the probe again — Shift+Home selects the typed line, Backspace twice
  // removes it and the newline. The morph (truth) then takes it out of the preview.
  await page.keyboard.down('Shift'); await page.keyboard.press('Home'); await page.keyboard.up('Shift');
  await page.keyboard.press('Backspace'); await page.keyboard.press('Backspace');
  await sleep(3500);
  const gone = await (await livePreview()).evaluate(() => !document.querySelector('.sve-instant-probe'));
  step('probe gone after the morph', gone);
} catch (e) {
  report.errors.push(`exception: ${e.message}`); report.ok = false;
} finally {
  // The dock flushes a pending save when the page unloads, so close the browser
  // first, then put the section file back exactly as it was (the dock's own
  // lock marker included) and drop the history snapshots it wrote for the
  // test's keystrokes.
  await browser.close();
  await sleep(2000);
  if (original !== null) {
    const abs = filePath.startsWith('/') ? filePath : `${SITE_DIR}/${filePath}`;
    // The last save the dock posted may still be running in PHP (it bakes
    // Tailwind on save); keep restoring until the file has been untouched for
    // six seconds.
    let stable = 0;
    for (let i = 0; i < 60 && stable < 9; i++) {
      if (readFileSync(abs, 'utf8') !== original) { writeFileSync(abs, original); stable = 0; } else { stable++; }
      await sleep(700);
    }
    step('section file restored', readFileSync(abs, 'utf8') === original, abs);
    const historyDir = `${SITE_DIR}/storage/statamic-visual-editor/history/${filePath.replace(/\//g, '_')}`;
    if (existsSync(historyDir)) {
      let removed = 0;
      for (const name of readdirSync(historyDir)) { const file = `${historyDir}/${name}`; if (statSync(file).mtimeMs >= startedAt - 1000) { unlinkSync(file); removed++; } }
      if (!readdirSync(historyDir).length) rmdirSync(historyDir);
      console.log(`info history snapshots from this run removed — ${removed}`);
    }
  }
}
const realErrors = report.errors.filter((e) => !/favicon|net::ERR_ABORTED|status of 4/i.test(e));
step('no JavaScript errors', realErrors.length === 0, realErrors.slice(0, 5).join(' | '));
console.log(JSON.stringify({ ok: report.ok, errors: realErrors }));
process.exit(report.ok ? 0 : 1);
