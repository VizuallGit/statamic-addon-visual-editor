#!/usr/bin/env node
/**
 * An Alpine component in the open section: the tree's Alpine icon sets its
 * boolean in the preview and sets it back on the next press; a component with
 * several booleans opens the row menu with one line per key; a dialog driven
 * by `x-effect` is open again after the morph that follows (the morph takes
 * the `open` attribute away, the flip runs the effect again); and a state set
 * before a reload is still set after it, before anything is opened.
 *
 * Serves the working tree's build and dock-instant-preview.js (SVE_WORKTREE=1)
 * so the bridge is proven before release. The dock autosaves to the section's
 * file: it is backed up before typing and written back afterwards, and the
 * states the run remembered are taken out of localStorage again.
 *
 * Same env vars as instant-paint.mjs.
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
page.on('console', (m) => { if (m.type() === 'error') report.errors.push(`console: ${m.text().slice(0, 200)}`); });
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

let abs = null;
let twPath = null;
let twExisted = true;
let original = null;
let fileType = '';
let storedBefore;
let cp = null;

// A probe component's data in the preview, by class: what Alpine holds, and
// for the dialog whether it is open.
const stateOf = (frame, cls) => frame.evaluate((c) => {
  const el = document.querySelector('.' + c);
  if (!el) return null;
  const data = window.Alpine?.$data?.(el);
  const out = { tag: el.tagName.toLowerCase(), alpine: !!window.Alpine };
  for (const key of ['open', 'menuOpen', 'dark']) if (data && key in data) out[key] = data[key];
  if (el.tagName === 'DIALOG') out.dialogOpen = el.open;
  return out;
}, cls);
const stored = () => cp.evaluate(() => { try { return JSON.parse(localStorage.getItem('sveAlpineStates') || '{}'); } catch { return {}; } });

try {
  await page.goto(`${SITE_URL}/cp`, { waitUntil: 'networkidle2' });
  await page.waitForSelector('input[name="email"]');
  await page.type('input[name="email"]', USER); await page.type('input[name="password"]', PASS);
  await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle2' }), page.keyboard.press('Enter')]);
  await page.goto(`${SITE_URL}${ENTRY}`, { waitUntil: 'networkidle2' });
  await sleep(1500);
  await page.evaluate(() => [...document.querySelectorAll('button')].find((e) => /live preview/i.test(e.textContent || ''))?.click());
  step('preview overlay open', await waitIn(page, 'iframe.sve-edit-overlay[data-open]', 30000));
  cp = await (await page.$('iframe.sve-edit-overlay')).contentFrame();
  step('working-tree script served', served > 0, `${served} request(s)${servedBuild ? `; ${servedBuild()} build files from the working tree` : ''}`);
  await waitIn(cp, '#__sve-toolbar button', 20000);
  const livePreview = async () => { const el = await cp.$('#live-preview-iframe'); return el ? el.contentFrame() : null; };
  let hasSection = false;
  for (let i = 0; i < 25 && !hasSection; i++) { const f = await livePreview(); hasSection = f ? await f.evaluate(() => !!document.querySelector('[id^="id-"]')).catch(() => false) : false; if (!hasSection) await sleep(1000); }
  step('preview section rendered', hasSection);
  step('the site’s Alpine is on the preview', await (await livePreview()).evaluate(() => typeof window.Alpine?.$data === 'function'));
  await realClick(page, await livePreview(), '[id^="id-"]'); await sleep(2000);
  let dock = false;
  for (let attempt = 1; attempt <= 2 && !dock; attempt++) { await realClick(page, cp, '#__sve-toolbar button[data-tab="code"]'); await sleep(600); dock = await waitIn(cp, '#__sve-code-dock [data-sve-code-pane="html"] .cm-editor', 15000); if (!dock) await sleep(1000); }
  step('code dock open with an HTML pane', dock);
  await sleep(1500);
  const dockPath = () => cp.evaluate(() => { const el = document.querySelector('#__sve-code-dock [data-sve-code-path], [data-sve-code-path]'); return el ? (el.getAttribute('data-sve-code-path') || el.textContent.trim()) : ''; });
  const filePath = await dockPath();
  abs = filePath ? (filePath.startsWith('/') ? filePath : `${SITE_DIR}/${filePath}`) : null;
  if (abs && existsSync(abs)) original = readFileSync(abs, 'utf8');
  step('section file backed up', !!original, abs || '');
  const twMatch = (filePath || '').match(/page_sections\/(.+)\.antlers\.html$/);
  twPath = twMatch ? `${SITE_DIR}/resources/visual-editor/tw/${twMatch[1]}.css` : null;
  twExisted = twPath ? existsSync(twPath) : true;
  // The file's key in the stored states, as the dock names it; whatever was
  // stored before the run is put back afterwards, and the run starts clean.
  fileType = (filePath.match(/page_sections\/(.+?)\.antlers\.html/) || [])[1] || '';
  storedBefore = await page.evaluate(() => localStorage.getItem('sveAlpineStates'));
  if (fileType) await page.evaluate((type) => { const all = JSON.parse(localStorage.getItem('sveAlpineStates') || '{}'); delete all[type]; localStorage.setItem('sveAlpineStates', JSON.stringify(all)); }, fileType);
  if (await cp.evaluate(() => document.querySelector('#__sve-code-dock')?.hasAttribute('data-sve-code-locked'))) {
    await realClick(page, cp, '#__sve-code-dock [data-sve-code-lock]');
    if (await waitIn(cp, '.sve-dialog .sve-dialog__actions button', 8000)) {
      const box = await (await cp.frameElement()).boundingBox();
      const r = await cp.evaluate(() => { const b = [...document.querySelectorAll('.sve-dialog .sve-dialog__actions button')].pop(); const q = b.getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2 }; });
      await page.mouse.click(box.x + r.x, box.y + r.y);
    }
    let unlocked = false;
    for (let i = 0; i < 20 && !unlocked; i++) { await sleep(500); unlocked = await cp.evaluate(() => !document.querySelector('#__sve-code-dock')?.hasAttribute('data-sve-code-locked')); }
    step('template unlocked for the test', unlocked);
  }

  // Type a line right after the root tag opens, as one input event.
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
    return true;
  };

  // 1. Three probes: one boolean, two booleans, and a dialog an effect opens.
  step('typed the probe components into the HTML pane', await typeAfterRoot(
    '<div class="sve-alpine-probe" x-data="{ open: false }"></div>'
    + '<div class="sve-alpine-probe2" x-data="{ menuOpen: false, dark: true, toggle() { this.menuOpen = !this.menuOpen } }"></div>'
    + '<dialog class="sve-alpine-dialog" x-data="{ open: false }" x-effect="open ? $el.show() : $el.close()"></dialog>'
  ));
  await sleep(4000);
  const before = await stateOf(await livePreview(), 'sve-alpine-probe');
  step('the probe is an Alpine component in the preview, shut as the file says', !!before && before.open === false, JSON.stringify(before));

  // The section's root row first, so the probes' rows are drawn.
  const secLabel = (filePath || '').replace(/^.*page_sections\//, '').replace(/\.antlers\.html$/, '').replace(/[\/_]+/g, ' ').trim();
  const openSectionRow = async () => {
    const row = await cp.evaluate((label) => { const el = [...document.querySelectorAll('[data-sve-ht-row][data-sve-ht-sec]')].find((r) => r.textContent.toLowerCase().includes(label.toLowerCase())); if (!el) return null; el.scrollIntoView({ block: 'center' }); const r = el.getBoundingClientRect(); return { x: r.x + Math.min(60, r.width / 2), y: r.y + r.height / 2 }; }, secLabel);
    if (row) { const b = await (await cp.frameElement()).boundingBox(); await page.mouse.click(b.x + row.x, b.y + row.y); await sleep(1500); }
  };
  const rowOf = (marker) => cp.evaluate((m) => {
    const re = new RegExp(m);
    const hit = [...document.querySelectorAll('[data-sve-ht-row]')].find((el) => re.test(el.textContent || ''));
    if (!hit) return null;
    hit.scrollIntoView({ block: 'center' });
    const r = hit.getBoundingClientRect();
    return { x: r.x + Math.min(60, r.width / 2), y: r.y + r.height / 2 };
  }, marker);
  if (!(await rowOf('sve-alpine-probe(?!2)'))) await openSectionRow();
  const iconOf = (marker) => cp.evaluate((m) => { const re = new RegExp(m); const hit = [...document.querySelectorAll('[data-sve-ht-row]')].find((el) => re.test(el.textContent || '')); const btn = hit?.querySelector('[data-sve-ht-alpine]'); if (!btn) return null; const r = btn.getBoundingClientRect(); return r.width ? { x: r.x + r.width / 2, y: r.y + r.height / 2, on: btn.hasAttribute('data-on'), title: btn.title } : { hidden: true, on: btn.hasAttribute('data-on') }; }, marker);
  const pressIcon = async (marker) => {
    const row = await rowOf(marker);
    if (!row) return 'no row in the tree';
    const b = await (await cp.frameElement()).boundingBox();
    // The icons show on hover, and on the row that is current.
    await page.mouse.move(b.x + row.x - 6, b.y + row.y); await page.mouse.move(b.x + row.x, b.y + row.y); await sleep(300);
    let icon = await iconOf(marker);
    if (!icon || icon.hidden) { await page.mouse.click(b.x + row.x, b.y + row.y); await sleep(500); icon = await iconOf(marker); }
    if (!icon || icon.hidden) return `no Alpine icon on the row: ${JSON.stringify(icon)}`;
    await page.mouse.click(b.x + icon.x, b.y + icon.y);
    return `pressed (was ${icon.on ? 'set' : 'as the file'}; title "${icon.title}")`;
  };
  const noIcon = await cp.evaluate(() => {
    const hits = [...document.querySelectorAll('[data-sve-ht-row]')].filter((el) => /sve-alpine-/.test(el.textContent || ''));
    return { rows: hits.length, icons: hits.filter((el) => el.querySelector('[data-sve-ht-alpine]')).length };
  });
  step('every probe row carries the Alpine icon', noIcon.rows === 3 && noIcon.icons === 3, JSON.stringify(noIcon));

  // 2. One boolean: the press sets it, the next press sets it back.
  let pressed = await pressIcon('sve-alpine-probe(?!2)'); await sleep(700);
  let state = await stateOf(await livePreview(), 'sve-alpine-probe');
  let icon = await iconOf('sve-alpine-probe(?!2)');
  const afterSet = await stored();
  step('the press sets the boolean in the preview, lights the icon and is remembered for the file', !!state && state.open === true && !!icon?.on && Object.values(afterSet[fileType] || {}).some((keys) => keys.open === true), `${pressed}; ${JSON.stringify(state)}; stored: ${JSON.stringify(afterSet)}`);
  pressed = await pressIcon('sve-alpine-probe(?!2)'); await sleep(700);
  state = await stateOf(await livePreview(), 'sve-alpine-probe');
  icon = await iconOf('sve-alpine-probe(?!2)');
  const afterBack = await stored();
  step('the next press puts the file’s value back and forgets it', !!state && state.open === false && !icon?.on && !afterBack[fileType], `${pressed}; ${JSON.stringify(state)}; stored: ${JSON.stringify(afterBack)}`);

  // 3. The dialog: open by its effect, and open again after a morph.
  pressed = await pressIcon('sve-alpine-dialog'); await sleep(700);
  state = await stateOf(await livePreview(), 'sve-alpine-dialog');
  step('the dialog’s boolean opens it through its x-effect', !!state && state.open === true && state.dialogOpen === true, `${pressed}; ${JSON.stringify(state)}`);
  const morphs = await (await livePreview()).evaluate(() => { window.__sveMorphs = 0; window.addEventListener('statamic:preview-updated', () => { window.__sveMorphs++; }); return true; });
  step('typed a nudge to make the server redraw', morphs && await typeAfterRoot('<span class="sve-alpine-nudge"></span>'));
  await sleep(4000);
  state = await stateOf(await livePreview(), 'sve-alpine-dialog');
  const redraws = await (await livePreview()).evaluate(() => window.__sveMorphs);
  step('after the morph the dialog is open again (the effect ran again)', redraws > 0 && !!state && state.open === true && state.dialogOpen === true, `${redraws} redraw(s); ${JSON.stringify(state)}`);

  // 4. Two booleans: the row menu, one line per key, a check for what shows.
  pressed = await pressIcon('sve-alpine-probe2'); await sleep(500);
  const menu = await cp.evaluate(() => {
    const el = [...document.querySelectorAll('.sve-ht-menu')].find((m) => m.getBoundingClientRect().width > 0);
    if (!el) return null;
    return [...el.querySelectorAll('button')].map((b) => ({ label: b.textContent.trim(), checked: !!b.querySelector('svg path'), box: (() => { const r = b.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; })() }));
  });
  step('several booleans open the row menu, one line per key with its check', !!menu && menu.length === 2 && menu[0].label === 'menuOpen' && !menu[0].checked && menu[1].label === 'dark' && menu[1].checked, `${pressed}; ${JSON.stringify(menu?.map(({ label, checked }) => ({ label, checked })))}`);
  if (menu?.[0]) {
    const b = await (await cp.frameElement()).boundingBox();
    await page.mouse.click(b.x + menu[0].box.x, b.y + menu[0].box.y); await sleep(700);
  }
  state = await stateOf(await livePreview(), 'sve-alpine-probe2');
  step('a line in the menu sets that key and leaves the other', !!state && state.menuOpen === true && state.dark === true, JSON.stringify(state));

  // 5. Remembered across a reload, before anything is opened.
  await page.reload({ waitUntil: 'networkidle2' }); await sleep(1500);
  if (!(await page.$('iframe.sve-edit-overlay[data-open]'))) {
    await page.evaluate(() => [...document.querySelectorAll('button')].find((e) => /live preview/i.test(e.textContent || ''))?.click());
  }
  await waitIn(page, 'iframe.sve-edit-overlay[data-open]', 30000);
  cp = await (await page.$('iframe.sve-edit-overlay')).contentFrame();
  await waitIn(cp, '#__sve-toolbar button', 20000);
  for (let i = 0; i < 25; i++) { const f = await livePreview(); if (f && await f.evaluate(() => !!document.querySelector('.sve-alpine-probe2') && !!window.Alpine).catch(() => false)) break; await sleep(1000); }
  await sleep(2500);
  state = await stateOf(await livePreview(), 'sve-alpine-probe2');
  const dialog = await stateOf(await livePreview(), 'sve-alpine-dialog');
  step('still set after a reload, nothing opened', !!state && state.menuOpen === true && !!dialog && dialog.open === true && dialog.dialogOpen === true, `${JSON.stringify(state)}; dialog ${JSON.stringify(dialog)}`);
} catch (e) {
  report.errors.push(`exception: ${e.message} @ ${(e.stack || '').split('\n')[1] || ''}`); report.ok = false;
} finally {
  // The states this run remembered go with it: the key is put back as it was.
  if (storedBefore !== undefined) await page.evaluate((raw) => { if (raw === null) localStorage.removeItem('sveAlpineStates'); else localStorage.setItem('sveAlpineStates', raw); }, storedBefore).catch(() => {});
  await browser.close().catch(() => {});
  if (abs && original !== null) {
    let stable = 0;
    for (let i = 0; i < 12 && stable < 3; i++) { await sleep(600); if (readFileSync(abs, 'utf8') !== original) { writeFileSync(abs, original); stable = 0; } else { stable++; } }
    const rel = abs.replace(`${SITE_DIR}/`, '').replace(/\//g, '_');
    const historyDir = `${SITE_DIR}/storage/statamic-visual-editor/history/${rel}`;
    if (existsSync(historyDir)) { for (const name of readdirSync(historyDir)) { const file = `${historyDir}/${name}`; if (statSync(file).mtimeMs >= startedAt - 1000) unlinkSync(file); } if (!readdirSync(historyDir).length) rmdirSync(historyDir); }
    if (twPath && !twExisted && existsSync(twPath)) { unlinkSync(twPath); const dir = twPath.replace(/\/[^/]+$/, ''); if (existsSync(dir) && !readdirSync(dir).length) rmdirSync(dir); }
    console.log(`info section file restored: ${readFileSync(abs, 'utf8') === original}`);
  }
}
const realErrors = report.errors.filter((e) => !/favicon|net::ERR_ABORTED|licen[cs]e|ResizeObserver/i.test(e));
console.log(JSON.stringify({ ok: report.ok, errors: realErrors.slice(0, 6) }));
process.exit(report.ok ? 0 : 1);
