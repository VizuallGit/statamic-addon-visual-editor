#!/usr/bin/env node
/**
 * Instant paint with the SECTION's own row picked in the HTML tree.
 *
 * Picking a child's row scopes the pane to that child; picking the section's
 * row scopes it to the whole file, and the file the dock exposes is then the
 * pane itself. Every child typed or edited in that state waited for the ~1 s
 * morph (v1.1.234 and earlier), while the same edit painted at once with the
 * child's own row picked. This measures the wait in ms for both, plus a div's
 * row with a child inside it.
 *
 * Serves the working-tree `resources/js/dock-instant-preview.js` in place of
 * the installed one. The dock autosaves to the section's file on the site: the
 * file is backed up before typing and written back afterwards.
 *
 * Same env vars as live-preview-smoke.mjs (SVE_PASS is required).
 */
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync, unlinkSync, rmdirSync } from 'node:fs';

const startedAt = Date.now();
const env = (key, fallback) => process.env[key] || fallback;
const SITE_DIR = env('SVE_SITE_DIR', `${process.env.HOME}/Sites/vizuall-skabelon`);
const ADDON_DIR = env('SVE_ADDON_DIR', `${process.env.HOME}/Sites/statamic-addon-visual-editor-vue`);
const SITE_URL = env('SVE_SITE_URL', 'http://vizuall-skabelon.test');
const USER = env('SVE_USER', 'claude-test@vizuall.dk');
const PASS = env('SVE_PASS', '');
const ENTRY = env('SVE_ENTRY', '/cp/collections/pages/entries/827310c8-9f8b-4c10-a157-634a0d0f82d5');
const CHROME = env('SVE_CHROME', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome');
const SCRIPT = `${ADDON_DIR}/resources/js/dock-instant-preview.js`;
// Instant is a paint in the same frame; the morph lands after about a second.
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
async function realClick(page, frame, selector) { const r = await absoluteRect(frame, selector); await page.mouse.click(r.x + r.w / 2, r.y + Math.min(r.h / 2, 300)); }

const scriptSource = readFileSync(SCRIPT, 'utf8');
const browser = await puppeteer.launch({ headless: true, executablePath: CHROME, defaultViewport: { width: 1440, height: 900 } });
const page = await browser.newPage();
page.on('pageerror', (e) => report.errors.push(`pageerror: ${e.message}`));
page.on('console', (m) => { if (m.type() === 'error' || /\[sve\] instant/.test(m.text())) report.errors.push(`console: ${m.text().slice(0, 200)}`); });
await page.setRequestInterception(true);
page.on('request', (req) => { if (/\/vendor\/visual-editor\/js\/dock-instant-preview\.js/.test(req.url())) { req.respond({ status: 200, contentType: 'application/javascript', body: scriptSource }); } else { req.continue(); } });

let filePath = null; let original = null; let twPath = null; let twExisted = true;
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
  step('preview section rendered', hasSection);
  await realClick(page, await livePreview(), '[id^="id-"]'); await sleep(2000);
  let dock = false;
  for (let attempt = 1; attempt <= 2 && !dock; attempt++) { await realClick(page, cp, '#__sve-toolbar button[data-tab="code"]'); await sleep(600); dock = await waitIn(cp, '#__sve-code-dock [data-sve-code-pane="html"] .cm-editor', 15000); if (!dock) await sleep(2000); }
  step('code dock open with an HTML pane', dock);
  await sleep(1500);
  filePath = await cp.evaluate(() => { const el = document.querySelector('#__sve-code-dock [data-sve-code-path], [data-sve-code-path]'); return el ? (el.getAttribute('data-sve-code-path') || el.textContent.trim()) : ''; });
  step('dock knows its file', !!filePath, filePath);
  const abs = filePath.startsWith('/') ? filePath : `${SITE_DIR}/${filePath}`;
  if (existsSync(abs)) original = readFileSync(abs, 'utf8');
  step('section file backed up', !!original, abs);
  const twMatch = filePath.match(/page_sections\/(.+)\.antlers\.html$/);
  twPath = twMatch ? `${SITE_DIR}/resources/visual-editor/tw/${twMatch[1]}.css` : null;
  twExisted = twPath ? existsSync(twPath) : true;
  const secLabel = filePath.replace(/^.*page_sections\//, '').replace(/\.antlers\.html$/, '').replace(/[\/_]+/g, ' ').trim();

  const locked = await cp.evaluate(() => document.querySelector('#__sve-code-dock')?.hasAttribute('data-sve-code-locked'));
  if (locked) {
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

  // The HTML tree (the scope button opens it) must be on screen.
  if (!(await cp.$('[data-sve-ht-row]'))) { await realClick(page, cp, '#__sve-code-dock [data-sve-html-scope]'); await waitIn(cp, '[data-sve-ht-row]', 8000); }
  step('html tree open', !!(await cp.$('[data-sve-ht-row]')));

  const dockScope = () => cp.evaluate(() => { const d = document.querySelector('#__sve-code-dock'); const s = d && d.__sveHtmlScope; const c = d?.querySelector('[data-sve-code-pane="html"] .cm-content'); const v = c?.cmTile?.view || c?.cmView?.view; const pane = v ? v.state.doc.toString() : ''; return { scoped: !!d?.hasAttribute('data-sve-html-scoped'), wholeFile: !!s && s.from === 0 && s.to === s.full.length && s.full === pane, row: document.querySelector('[data-sve-ht-current]')?.textContent.trim().slice(0, 40) || '' }; });
  const cmView = () => cp.evaluate(() => { const c = document.querySelector('#__sve-code-dock [data-sve-code-pane="html"] .cm-content'); const v = c?.cmTile?.view || c?.cmView?.view; return v ? { len: v.state.doc.length, caret: v.state.selection.main.head } : null; });
  // The caret through CodeMirror's own API, so it sits exactly where the step says.
  const caretBefore = (needle, back) => cp.evaluate((n, b) => { const c = document.querySelector('#__sve-code-dock [data-sve-code-pane="html"] .cm-content'); const v = c?.cmTile?.view || c?.cmView?.view; if (!v) return null; const doc = v.state.doc.toString(); const at = doc.indexOf(n); if (at < 0) return null; v.dispatch({ selection: { anchor: at + n.length - b }, scrollIntoView: true }); v.focus(); return at + n.length - b; }, needle, back);
  const liveProbe = (cls) => livePreview().then((p) => p.evaluate((c) => document.querySelector('.' + c)?.textContent.trim() ?? null, cls));
  const latency = async (cls, want, max = 4000) => { const t0 = Date.now(); while (Date.now() - t0 < max) { const p = await livePreview(); if (p && await p.evaluate((w) => { const el = document.querySelector('.' + w.cls); return !!el && el.textContent.trim() === w.want; }, { cls, want }).catch(() => false)) return Date.now() - t0; await sleep(20); } return -1; };
  const clickRow = async (finder, ...args) => { for (let i = 0; i < 3; i++) { const hit = await cp.evaluate(finder, ...args); if (!hit || hit.x == null) return false; const b = await (await cp.frameElement()).boundingBox(); await page.mouse.click(b.x + hit.x, b.y + hit.y); await sleep(900); const cur = await cp.evaluate(() => document.querySelector('[data-sve-ht-current]')?.textContent.trim().slice(0, 40) || ''); if (cur === hit.text) return true; } return false; };
  // The tree opens with every section shut. The shut row unfolds the section (no
  // reveal); the root row inside the open box is what a person picks to "select
  // the section", and its name is where they click.
  const unfold = async () => { if (await cp.$('[data-sve-ht-branch]')) return; const hit = await cp.evaluate((label) => { const el = [...document.querySelectorAll('[data-sve-ht-row][data-sve-ht-sec]')].find((r) => r.textContent.toLowerCase().includes(label.toLowerCase())); if (!el) return null; el.scrollIntoView({ block: 'center' }); const r = el.getBoundingClientRect(); return { x: r.x + Math.min(80, r.width / 2), y: r.y + r.height / 2 }; }, secLabel); if (!hit) return; const b = await (await cp.frameElement()).boundingBox(); await page.mouse.click(b.x + hit.x, b.y + hit.y); await sleep(1500); };
  const sectionRow = async () => { await unfold(); return clickRow(() => { const row = document.querySelector('[data-sve-ht-branch] [data-sve-ht-row]'); const el = row?.querySelector('[data-sve-ht-name]') || row; if (!el) return null; el.scrollIntoView({ block: 'center' }); const r = el.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2, text: row.textContent.trim().slice(0, 40) }; }); };
  const rowByText = (re) => clickRow((src) => { const rx = new RegExp(src); const row = [...document.querySelectorAll('[data-sve-ht-row]')].find((r) => rx.test(r.textContent || '')); const el = row?.querySelector('[data-sve-ht-name]') || row; if (!el) return null; el.scrollIntoView({ block: 'center' }); const r = el.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2, text: row.textContent.trim().slice(0, 40) }; }, re.source);
  const typeAndTime = async (name, text, cls, want) => { await page.keyboard.type(text, { delay: 5 }); const ms = await latency(cls, want); step(name, ms >= 0 && ms <= INSTANT_MS, `${ms} ms (live: ${JSON.stringify(await liveProbe(cls))})`); await sleep(2500); };

  // A: the section's row picked — the pane is scoped to the whole file — a static <p> typed after the root's opening tag.
  step('section row picked', await sectionRow());
  const scopeA = await dockScope();
  step('the pane is scoped to the whole file', scopeA.scoped && scopeA.wholeFile, JSON.stringify(scopeA));
  const rootLine = await cp.evaluate(() => { const lines = [...document.querySelectorAll('#__sve-code-dock [data-sve-code-pane="html"] .cm-line')]; let text = ''; for (const line of lines) { text += line.textContent + '\n'; const open = text.search(/<(section|div|article|header)\b/); if (open !== -1 && text.indexOf('>', open) !== -1) { line.scrollIntoView({ block: 'center' }); const r = line.getBoundingClientRect(); return { x: r.right - 2, y: r.y + r.height / 2 }; } } return null; });
  step('found the line that closes the root tag', !!rootLine);
  { const b = await (await cp.frameElement()).boundingBox(); await page.mouse.click(b.x + rootLine.x, b.y + rootLine.y); await page.keyboard.press('End'); await page.keyboard.press('Enter'); }
  await typeAndTime('section row: a new static <p> paints at once', '<p class="sve-probe-a">alpha</p>', 'sve-probe-a', 'alpha');

  // B: still the section's row — the child's text edited.
  step('caret inside the <p>', (await caretBefore('alpha</p>', 4)) != null);
  await typeAndTime('section row: the child\'s text paints at once', 'XY', 'sve-probe-a', 'alphaXY');

  // C: the child's own row picked (the pane scoped to it) — its text edited.
  step('child row picked', await rowByText(/sve-probe-a/));
  const cText = await liveProbe('sve-probe-a');
  await typeAndTime('child row: its text paints at once', 'ZW', 'sve-probe-a', cText + 'ZW');

  // D: the section's row again — the child's text edited again.
  step('section row picked again', await sectionRow());
  const dText = await liveProbe('sve-probe-a');
  step('caret inside the <p> again', (await caretBefore(dText + '</p>', 4)) != null);
  await typeAndTime('section row again: the child\'s text paints at once', 'QQ', 'sve-probe-a', dText + 'QQ');

  // E: the section's row — a div with a child typed after the probe.
  const eText = await liveProbe('sve-probe-a');
  step('caret after the <p>', (await caretBefore(eText + '</p>', 0)) != null);
  await page.keyboard.press('Enter');
  await typeAndTime('section row: a new <div><p> paints at once', '<div class="sve-probe-box"><p class="sve-probe-c">gamma</p></div>', 'sve-probe-c', 'gamma');

  // F: the div's row picked (the pane scoped to the div) — the child's text edited.
  step('div row picked', await rowByText(/sve-probe-box/));
  step('caret inside the div\'s <p>', (await caretBefore('gamma</p>', 4)) != null);
  await typeAndTime('div row: the child\'s text paints at once', 'HH', 'sve-probe-c', 'gammaHH');

  // G: still the div's row — a new <p> typed inside the div.
  step('caret after the div\'s <p>', (await caretBefore('gammaHH</p>', 0)) != null);
  await typeAndTime('div row: a new <p> inside the div paints at once', '<p class="sve-probe-d">delta</p>', 'sve-probe-d', 'delta');
} catch (e) {
  report.errors.push(`exception: ${e.message}`); report.ok = false;
} finally {
  // Close first (the dock flushes a pending save on unload), then put the file
  // back exactly as it was and drop the history snapshots the keystrokes wrote.
  await browser.close();
  await sleep(2000);
  if (original !== null) {
    const abs = filePath.startsWith('/') ? filePath : `${SITE_DIR}/${filePath}`;
    let stable = 0;
    for (let i = 0; i < 60 && stable < 9; i++) { if (readFileSync(abs, 'utf8') !== original) { writeFileSync(abs, original); stable = 0; } else { stable++; } await sleep(700); }
    step('section file restored', readFileSync(abs, 'utf8') === original, abs);
    const historyDir = `${SITE_DIR}/storage/statamic-visual-editor/history/${filePath.replace(/\//g, '_')}`;
    if (existsSync(historyDir)) { let removed = 0; for (const name of readdirSync(historyDir)) { const f = `${historyDir}/${name}`; if (statSync(f).mtimeMs >= startedAt - 1000) { unlinkSync(f); removed++; } } if (!readdirSync(historyDir).length) rmdirSync(historyDir); console.log(`info history snapshots from this run removed — ${removed}`); }
    if (twPath && !twExisted && existsSync(twPath)) { unlinkSync(twPath); const dir = twPath.slice(0, twPath.lastIndexOf('/')); if (!readdirSync(dir).length) rmdirSync(dir); }
  }
}
const realErrors = report.errors.filter((e) => !/favicon|net::ERR_ABORTED|status of 4/i.test(e));
step('no JavaScript errors', realErrors.length === 0, realErrors.slice(0, 5).join(' | '));
console.log(JSON.stringify({ ok: report.ok, errors: realErrors }));
process.exit(report.ok ? 0 : 1);
