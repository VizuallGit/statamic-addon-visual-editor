#!/usr/bin/env node
/**
 * A video in the open section: autoplays in the preview once painted and
 * once morphed, stops on the tree's hold icon, plays again on the next press
 * — and keeps its muted state through a tag rename in the dock (Chrome sets
 * `muted` from the attribute only while parsing; a copy loses it, and an
 * unmuted video neither autoplays nor plays without a click on the page).
 *
 * Serves the working tree's build and dock-instant-preview.js (SVE_WORKTREE=1)
 * so the bridge is proven before release. The dock autosaves to the section's
 * file: it is backed up before typing and written back afterwards.
 *
 * Same env vars as instant-paint.mjs. SVE_VIDEO_SRC picks the video.
 */
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync, unlinkSync, rmdirSync, copyFileSync } from 'node:fs';
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
// The video: a local file copied into the site's public/ for the run (the
// site's own server answers the range requests a video needs), or a URL.
const VIDEO_FILE = env('SVE_VIDEO_FILE', '');
const PUBLIC_COPY = VIDEO_FILE ? `${SITE_DIR}/public/sve-video-probe.mp4` : null;
const SRC = env('SVE_VIDEO_SRC', PUBLIC_COPY ? `${SITE_URL}/sve-video-probe.mp4` : 'https://vizuall-demo.vizdev.dk/assets/video/vizuall-showreel-2026-bredformat-august-2_1_1_1-1.mp4');
if (PUBLIC_COPY) copyFileSync(VIDEO_FILE, PUBLIC_COPY);
const SCRIPT = `${ADDON_DIR}/resources/js/dock-instant-preview.js`;
// SVE_OTHER: a word in the class or tree label of the section to visit on the round trip (e.g. "static").
const OTHER = env('SVE_OTHER', '');

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

// The probe video's state in the preview, by class.
const stateOf = (frame, cls) => frame.evaluate((c) => {
  const v = document.querySelector('.' + c);
  if (!v) return null;
  return { tag: v.tagName.toLowerCase(), muted: v.muted, paused: v.paused, autoplay: v.hasAttribute('autoplay'), held: v.hasAttribute('data-sve-video-hold'), t: typeof v.currentTime === 'number' ? +v.currentTime.toFixed(2) : null, ready: v.readyState ?? null };
}, cls);
const advancing = async (frame, cls, ms = 900) => { const a = await stateOf(frame, cls); await sleep(ms); const b = await stateOf(frame, cls); return { a, b, moved: !!a && !!b && b.t > a.t }; };

try {
  await page.goto(`${SITE_URL}/cp`, { waitUntil: 'networkidle2' });
  await page.waitForSelector('input[name="email"]');
  await page.type('input[name="email"]', USER); await page.type('input[name="password"]', PASS);
  await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle2' }), page.keyboard.press('Enter')]);
  await page.goto(`${SITE_URL}${ENTRY}`, { waitUntil: 'networkidle2' });
  await sleep(1500);
  await page.evaluate(() => [...document.querySelectorAll('button')].find((e) => /live preview/i.test(e.textContent || ''))?.click());
  step('preview overlay open', await waitIn(page, 'iframe.sve-edit-overlay[data-open]', 30000));
  const cp = await (await page.$('iframe.sve-edit-overlay')).contentFrame();
  step('working-tree script served', served > 0, `${served} request(s)${servedBuild ? `; ${servedBuild()} build files from the working tree` : ''}`);
  await waitIn(cp, '#__sve-toolbar button', 20000);
  const livePreview = async () => { const el = await cp.$('#live-preview-iframe'); return el ? el.contentFrame() : null; };
  let hasSection = false;
  for (let i = 0; i < 25 && !hasSection; i++) { const f = await livePreview(); hasSection = f ? await f.evaluate(() => !!document.querySelector('[id^="id-"]')).catch(() => false) : false; if (!hasSection) await sleep(1000); }
  step('preview section rendered', hasSection);
  await realClick(page, await livePreview(), '[id^="id-"]'); await sleep(2000);
  let dock = false;
  for (let attempt = 1; attempt <= 2 && !dock; attempt++) { await realClick(page, cp, '#__sve-toolbar button[data-tab="code"]'); await sleep(600); dock = await waitIn(cp, '#__sve-code-dock [data-sve-code-pane="html"] .cm-editor', 15000); if (!dock) await sleep(1000); }
  step('code dock open with an HTML pane', dock);
  await sleep(1500);
  const filePath = await cp.evaluate(() => { const el = document.querySelector('#__sve-code-dock [data-sve-code-path], [data-sve-code-path]'); return el ? (el.getAttribute('data-sve-code-path') || el.textContent.trim()) : ''; });
  abs = filePath ? (filePath.startsWith('/') ? filePath : `${SITE_DIR}/${filePath}`) : null;
  if (abs && existsSync(abs)) original = readFileSync(abs, 'utf8');
  step('section file backed up', !!original, abs || '');
  const twMatch = (filePath || '').match(/page_sections\/(.+)\.antlers\.html$/);
  twPath = twMatch ? `${SITE_DIR}/resources/visual-editor/tw/${twMatch[1]}.css` : null;
  twExisted = twPath ? existsSync(twPath) : true;
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

  // Type a line right after the root tag opens.
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
    // `<v…` opens the dock's tag popup, which takes the letters that follow as
    // its filter. Insert the line as one input event instead — CodeMirror
    // reads it from the DOM the way it reads a paste.
    await cp.evaluate((t) => document.execCommand('insertText', false, t), text);
    // closeBrackets may have added a closing tag of its own already.
    const pane = await cp.evaluate(() => document.querySelector('#__sve-code-dock [data-sve-code-pane="html"] .cm-content')?.textContent || '');
    const close = text.match(/<\/[a-z]+>$/)?.[0];
    if (close && pane.split(close).length - 1 > (original.split(close).length - 1) + 1) { for (let i = 0; i < close.length; i++) await page.keyboard.press('Backspace'); }
    const line = await cp.evaluate((c) => [...document.querySelectorAll('#__sve-code-dock [data-sve-code-pane="html"] .cm-line')].find((l) => l.textContent.includes(c))?.textContent || '', text.match(/class="([^"]+)"/)[1]);
    console.log(`info pane line — ${line.slice(0, 200)}`);
    return true;
  };
  const trace = () => cp.evaluate(() => (window.__sveInstantTrace || []).slice(-6).join(' | ')).catch(() => '');

  // 1. Painted before the morph, and playing after it.
  step('typed a muted autoplay video into the HTML pane', await typeAfterRoot(`<video class="sve-video-probe" autoplay="true" muted="true" src="${SRC}"></video>`));
  await sleep(150);
  const painted = await stateOf(await livePreview(), 'sve-video-probe');
  step('painted in the same frame, muted', !!painted && painted.tag === 'video' && painted.muted === true, `${JSON.stringify(painted)}; trace: ${await trace()}`);
  await sleep(3500);
  let run = await advancing(await livePreview(), 'sve-video-probe');
  step('plays after the morph (muted, time advancing)', run.moved && run.b?.muted === true && run.b?.paused === false, JSON.stringify(run.b));
  if (!run.b) throw new Error('no probe video in the preview after the morph — nothing more to measure');

  // 2. The tree's hold icon: still, then playing again.
  const secLabel = (filePath || '').replace(/^.*page_sections\//, '').replace(/\.antlers\.html$/, '').replace(/[\/_]+/g, ' ').trim();
  const secRow = await cp.evaluate((label) => { const el = [...document.querySelectorAll('[data-sve-ht-row][data-sve-ht-sec]')].find((r) => r.textContent.toLowerCase().includes(label.toLowerCase())); if (!el) return null; el.scrollIntoView({ block: 'center' }); const r = el.getBoundingClientRect(); return { x: r.x + Math.min(60, r.width / 2), y: r.y + r.height / 2 }; }, secLabel);
  if (secRow) { const b = await (await cp.frameElement()).boundingBox(); await page.mouse.click(b.x + secRow.x, b.y + secRow.y); await sleep(1500); }
  const videoRow = async () => cp.evaluate(() => {
    const rows = [...document.querySelectorAll('[data-sve-ht-row]')];
    const hit = rows.find((el) => (el.querySelector('[data-sve-ht-tag], [data-sve-ht-kind]')?.textContent || '').trim() === 'video' && /sve-video-probe(?!2)/.test(el.textContent || ''));
    if (!hit) return null;
    hit.scrollIntoView({ block: 'center' });
    const r = hit.getBoundingClientRect();
    return { x: r.x + Math.min(60, r.width / 2), y: r.y + r.height / 2, w: r.width };
  });
  const pressVideoIcon = async () => {
    const row = await videoRow();
    if (!row) return 'no video row in the tree';
    const b = await (await cp.frameElement()).boundingBox();
    await page.mouse.move(b.x + row.x, b.y + row.y); await sleep(250);
    const icon = await cp.evaluate(() => { const rows = [...document.querySelectorAll('[data-sve-ht-row]')]; const hit = rows.find((el) => /sve-video-probe(?!2)/.test(el.textContent || '')); const btn = hit?.querySelector('[data-sve-ht-video]'); if (!btn) return null; const r = btn.getBoundingClientRect(); return r.width ? { x: r.x + r.width / 2, y: r.y + r.height / 2, on: btn.hasAttribute('data-on') } : { hidden: true }; });
    if (!icon || icon.hidden) return `video icon not clickable: ${JSON.stringify(icon)}`;
    await page.mouse.click(b.x + icon.x, b.y + icon.y);
    return `pressed (was ${icon.on ? 'held' : 'playing'})`;
  };
  let pressed = await pressVideoIcon(); await sleep(700);
  let held = await stateOf(await livePreview(), 'sve-video-probe');
  step('hold icon stops the video', !!held && held.paused === true && held.held === true, `${pressed}; ${JSON.stringify(held)}`);
  pressed = await pressVideoIcon(); await sleep(900);
  run = await advancing(await livePreview(), 'sve-video-probe');
  step('next press plays it again', run.moved && run.b?.paused === false && run.b?.held === false, `${pressed}; ${JSON.stringify(run.b)}`);
  await sleep(2500);
  run = await advancing(await livePreview(), 'sve-video-probe');
  step('still playing after the morph that follows', run.moved && run.b?.paused === false, JSON.stringify(run.b));

  // 2b. Into another section and back: the icon must still speak of this
  //     video. The spy records which section each hold message names.
  await (await livePreview()).evaluate(() => {
    window.__sveHoldLog = [];
    window.addEventListener('message', (e) => { if (e.data && e.data.type === 'sve-video-hold') window.__sveHoldLog.push(`${e.data.on ? 'hold' : 'play'} ${String(e.data.uid).slice(0, 14)}:${e.data.nth}`); });
    window.__sveHits = [];
    document.addEventListener('click', (e) => { const t = e.target; window.__sveHits.push(`${t.tagName.toLowerCase()}.${String(t.className).slice(0, 20)} sec=${t.closest('[id^="id-"]')?.id || '-'}`); }, true);
  });
  await cp.evaluate(() => { window.__sveMsgs = []; window.addEventListener('message', (e) => { const d = e.data || {}; if (d.type === 'click') window.__sveMsgs.push(`click${d.uid ? ' uid=' + String(d.uid).slice(0, 12) : ''}${d.field ? ' field=' + d.field + ' scope=' + String(d.scope || '').slice(0, 12) : ''}${d.htmlPath ? ' path=' + d.htmlPath.slice(0, 18) : ''}`); }); });
  const spied = async () => `hits: ${await (await livePreview()).evaluate(() => (window.__sveHits || []).splice(0).join(' | ')).catch(() => 'n/a')}; msgs: ${await cp.evaluate(() => (window.__sveMsgs || []).splice(0).join(' | ')).catch(() => 'n/a')}`;
  const clickSection = async (id) => {
    const f = await livePreview();
    // A point that is inside the section AND inside the preview's own viewport:
    // the dock and the tree cover the bottom and the right of the CP, so the
    // section's centre is not always a place a click can reach.
    const r = await f.evaluate((i) => {
      const el = document.getElementById(i);
      if (!el) return null;
      el.scrollIntoView({ block: 'start' });
      const q = el.getBoundingClientRect();
      const top = Math.max(q.top, 0); const bottom = Math.min(q.bottom, window.innerHeight);
      // The editor draws its own toolbar over the section's top edge: walk down
      // until the point under the pointer really is this section.
      for (let y = top + 24; y < bottom - 10; y += 32) {
        for (const x of [q.x + Math.min(q.width / 3, 240), q.x + q.width / 2]) {
          const hit = document.elementFromPoint(x, y);
          // A spot of the section itself, not a field in it: a field click narrows the tree to that block.
          if (hit && hit.closest('[id^="id-"]')?.id === i && !hit.closest('[id^="__sve"], [data-sve-menu], [data-sve-belt], [data-sve-chrome-bar], [data-sid-field], [data-sid-inline-edit], a, button')) return { x, y };
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
  const sections = await (await livePreview()).evaluate(() => [...document.querySelectorAll('[id^="id-"]')].filter((el) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; }).map((el) => ({ id: el.id, sid: (el.getAttribute('data-sid') || '').slice(0, 14), cls: el.className.slice(0, 60), video: !!el.querySelector('.sve-video-probe') })));
  const mine = sections.find((sec) => sec.video);
  const other = sections.find((sec) => !sec.video && (!OTHER || sec.cls.includes(OTHER))) || sections.find((sec) => !sec.video);
  step('a second section to visit', !!mine && !!other, `${other ? `${other.id} [${other.cls}]` : '-'}; all: ${sections.map((sec) => `${sec.id}${sec.video ? ' (video)' : ''}`).join(', ')}`);
  if (mine && other) {
    const dockPath = () => cp.evaluate(() => { const el = document.querySelector('#__sve-code-dock [data-sve-code-path], [data-sve-code-path]'); return el ? (el.getAttribute('data-sve-code-path') || el.textContent.trim()) : ''; });
    await clickSection(other.id); await sleep(2500);
    // Away is not a reason to stop: the video keeps playing while another
    // section has the focus, whether or not it is on screen.
    run = await advancing(await livePreview(), 'sve-video-probe');
    step('keeps playing while another section is open', run.moved && run.b?.paused === false, `${JSON.stringify(run.b)}; visible: ${await (await livePreview()).evaluate(() => { const v = document.querySelector('.sve-video-probe'); const r = v.getBoundingClientRect(); return `${Math.round(r.top)}..${Math.round(r.bottom)} of ${window.innerHeight}`; })}`);
    await (await livePreview()).evaluate(() => document.querySelector('.sve-video-probe').pause());
    await sleep(400);
    run = await advancing(await livePreview(), 'sve-video-probe');
    step('a pause from elsewhere is undone (autoplay, not held)', run.moved && run.b?.paused === false, JSON.stringify(run.b));
    const away = `${await dockPath()}; ${await spied()}`;
    await clickSection(mine.id); await sleep(2500);
    step('back on the video section (via the preview)', (await dockPath()) === filePath, `away: ${away} | back: ${await dockPath()}; ${await spied()}`);
    const secRow2 = await cp.evaluate((label) => { const el = [...document.querySelectorAll('[data-sve-ht-row][data-sve-ht-sec]')].find((r) => r.textContent.toLowerCase().includes(label.toLowerCase())); if (!el) return null; el.scrollIntoView({ block: 'center' }); const r = el.getBoundingClientRect(); return { x: r.x + Math.min(60, r.width / 2), y: r.y + r.height / 2, open: el.hasAttribute('data-sve-ht-open') || el.getAttribute('aria-expanded') === 'true' }; }, secLabel);
    if (secRow2 && !(await videoRow())) { const b = await (await cp.frameElement()).boundingBox(); await page.mouse.click(b.x + secRow2.x, b.y + secRow2.y); await sleep(1500); }
    pressed = await pressVideoIcon(); await sleep(900);
    held = await stateOf(await livePreview(), 'sve-video-probe');
    const log1 = await (await livePreview()).evaluate(() => window.__sveHoldLog.splice(0));
    step('after the round trip the icon still stops it', !!held && held.paused === true && held.held === true, `${pressed}; ${JSON.stringify(held)}; messages: ${log1.join(', ')}; section sid ${mine.sid}`);
    pressed = await pressVideoIcon(); await sleep(900);
    run = await advancing(await livePreview(), 'sve-video-probe');
    const log2 = await (await livePreview()).evaluate(() => window.__sveHoldLog.splice(0));
    step('and the next press plays it again', run.moved && run.b?.paused === false && run.b?.held === false, `${pressed}; ${JSON.stringify(run.b)}; messages: ${log2.join(', ')}`);

    // 2b'. Into the header and out again: the video keeps playing there too.
    const headerRow = await cp.evaluate(() => { const el = [...document.querySelectorAll('[data-sve-ht-row]')].find((r) => /\bheader\b/i.test(r.querySelector('[data-sve-ht-tag], [data-sve-ht-kind]')?.textContent || '') && (r.getAttribute('data-sve-ht-frame') || /Header/.test(r.textContent))); if (!el) return null; el.scrollIntoView({ block: 'center' }); const r = el.getBoundingClientRect(); return { x: r.x + Math.min(70, r.width / 2), y: r.y + r.height / 2, text: el.textContent.trim().slice(0, 20) }; });
    if (headerRow) {
      const bb = await (await cp.frameElement()).boundingBox();
      await page.mouse.click(bb.x + headerRow.x, bb.y + headerRow.y, { clickCount: 2 }); await sleep(3000);
      run = await advancing(await livePreview(), 'sve-video-probe');
      const inHeader = await cp.evaluate(() => !!document.querySelector('#__sve-chrome-host, #__sve-globals-panel, [data-sve-chrome-form]'));
      step('keeps playing while the header is open', run.moved && run.b?.paused === false, `header open: ${inHeader}; ${JSON.stringify(run.b)}`);
      await page.keyboard.press('Escape'); await sleep(1500);
      await clickSection(mine.id); await sleep(2500);
    } else {
      console.log('info no header row in the tree');
    }

    // 2c. The same round trip through the HTML tree's section rows: a shut
    //     section is a row with data-sve-ht-sec; clicking it opens that one.
    const shutRow = (wantLabel) => cp.evaluate((label) => {
      const rows = [...document.querySelectorAll('[data-sve-ht-row][data-sve-ht-sec]')];
      const el = label ? rows.find((r) => (r.textContent || '').toLowerCase().includes(label.toLowerCase())) : rows[0];
      if (!el) return null;
      el.scrollIntoView({ block: 'center' });
      const r = el.getBoundingClientRect();
      return { x: r.x + Math.min(80, r.width / 2), y: r.y + r.height / 2, text: (el.textContent || '').trim().slice(0, 30) };
    }, wantLabel);
    const b = await (await cp.frameElement()).boundingBox();
    let viaTree = false;
    let hops = [];
    const otherRow = (await shutRow(OTHER)) || (await shutRow(''));
    if (otherRow) {
      await page.mouse.click(b.x + otherRow.x, b.y + otherRow.y); await sleep(2500); hops.push(`→ ${otherRow.text} (${await dockPath()})`);
      const backRow = await shutRow(secLabel);
      if (backRow) { await page.mouse.click(b.x + backRow.x, b.y + backRow.y); await sleep(2500); viaTree = true; hops.push(`→ ${backRow.text}`); }
    }
    const secRows = hops;
    step('round trip through the tree rows', viaTree && (await dockPath()) === filePath, `${secRows.join(' ')}; dock: ${await dockPath()}`);
    if (viaTree) {
      pressed = await pressVideoIcon(); await sleep(900);
      held = await stateOf(await livePreview(), 'sve-video-probe');
      const log3 = await (await livePreview()).evaluate(() => window.__sveHoldLog.splice(0));
      step('after the tree round trip the icon stops it', !!held && held.paused === true && held.held === true, `${pressed}; ${JSON.stringify(held)}; messages: ${log3.join(', ')}`);
      pressed = await pressVideoIcon(); await sleep(900);
      run = await advancing(await livePreview(), 'sve-video-probe');
      const log4 = await (await livePreview()).evaluate(() => window.__sveHoldLog.splice(0));
      step('and plays again', run.moved && run.b?.paused === false && run.b?.held === false, `${pressed}; ${JSON.stringify(run.b)}; messages: ${log4.join(', ')}`);
    }
  }

  // 3. Renamed tag in the dock: a <div> with the video's attributes becomes a
  //    <video>, and keeps its muted state (the copy is made with createElement).
  step('typed a div with the video attributes', await typeAfterRoot(`<div class="sve-video-probe2" autoplay="true" muted="true" src="${SRC}"></div>`));
  await sleep(3500);
  // Rename through the editor itself: both tags in one change, as the tree's
  // "Change tag" does it.
  const renamed = await cp.evaluate(() => {
    const contents = [...document.querySelectorAll('#__sve-code-dock [data-sve-code-pane="html"] .cm-content')];
    const view = contents.map((c) => c.cmView?.view || c.cmTile?.view || c.cmTile?.editorView || null).find(Boolean);
    if (!view) return { why: `no view: ${contents.length} content nodes; cmTile keys ${contents.map((c) => Object.keys(c.cmTile || {}).slice(0, 10).join('+')).join(' / ')}` };
    const doc = view.state.doc.toString();
    const open = doc.indexOf('<div class="sve-video-probe2"');
    if (open === -1) return { why: 'probe2 not in doc' };
    const close = doc.indexOf('</div>', open);
    const changes = [{ from: open + 1, to: open + 4, insert: 'video' }];
    if (close !== -1) changes.push({ from: close + 2, to: close + 5, insert: 'video' });
    view.dispatch({ changes, userEvent: 'input.type' });
    return { open, close };
  });
  await sleep(150);
  console.log(`info pane line after rename — ${await cp.evaluate(() => [...document.querySelectorAll('#__sve-code-dock [data-sve-code-pane="html"] .cm-line')].find((l) => /sve-video-probe2/.test(l.textContent))?.textContent.slice(0, 120) || '')}`);
  const swapped = await stateOf(await livePreview(), 'sve-video-probe2');
  step('renamed to <video> in the same frame, still muted', !!renamed && !renamed.why && !!swapped && swapped.tag === 'video' && swapped.muted === true, `${JSON.stringify(renamed)}; ${JSON.stringify(swapped)}`);
  await sleep(3500);
  run = await advancing(await livePreview(), 'sve-video-probe2');
  step('the renamed video plays after the morph', run.moved && run.b?.muted === true && run.b?.paused === false, JSON.stringify(run.b));
} catch (e) {
  report.errors.push(`exception: ${e.message} @ ${(e.stack || "").split("\n")[1] || ""}`); report.ok = false;
} finally {
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
  if (PUBLIC_COPY && existsSync(PUBLIC_COPY)) unlinkSync(PUBLIC_COPY);
}
const realErrors = report.errors.filter((e) => !/favicon|net::ERR_ABORTED|licen[cs]e|ResizeObserver/i.test(e));
console.log(JSON.stringify({ ok: report.ok, errors: realErrors.slice(0, 6) }));
process.exit(report.ok ? 0 : 1);
