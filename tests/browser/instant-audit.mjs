#!/usr/bin/env node
/**
 * Instant audit: every section on the given pages, nine kinds of edit each,
 * measured in a real Live Preview with real CodeMirror edits in the dock.
 *
 * For each section the dock opens its file and the audit makes, one at a
 * time, undoing each before the next:
 *
 *   class-root        a class on the file's root tag
 *   class-static      a class on the first static element (not in a block, not in an Antlers tag)
 *   class-in-block    a class on the first element inside an {{ if }} / loop body
 *   class-antlers     a class in the literal `class="…"` parameter of an Antlers tag ({{ svg }}, {{ partial }}, …)
 *   new-p-static      a <p> before the root's closing tag
 *   new-p-in-block    a <p> right after the first block's opener
 *   text-static       a word appended to the first static text run
 *   css-rule          a rule appended in the CSS pane
 *   tailwind-class    a Tailwind arbitrary class on the root
 *
 * and records how long the preview takes to show it (polled every ~10 ms, up
 * to 3 s; -1 = not within 3 s). ≤ SVE_INSTANT_MS (100) counts as instant.
 * The paint script's trace tail is kept for every slow edit, so the reason
 * is in the report, not guessed.
 *
 * Env: SVE_SITE_URL, SVE_SITE_DIR, SVE_USER, SVE_PASS (required),
 * SVE_ENTRIES (comma-separated CP entry paths), SVE_ADDON_DIR,
 * SVE_OUT (JSON report path), SVE_INSTANT_MS, SVE_CHROME=1 (header/footer too),
 * SVE_HEADED=1. Every file the dock autosaves is backed up and put back.
 */
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync, unlinkSync, rmdirSync } from 'node:fs';
import { antlersTags, maskAntlers } from '../../resources/js/lib/antlers-tags.js';

const startedAt = Date.now();
const env = (key, fallback) => process.env[key] || fallback;
const SITE_DIR = env('SVE_SITE_DIR', `${process.env.HOME}/Sites/vizuall-skabelon`);
const ADDON_DIR = env('SVE_ADDON_DIR', new URL('../..', import.meta.url).pathname.replace(/\/$/, ''));
const SITE_URL = env('SVE_SITE_URL', 'http://vizuall-skabelon.test');
const USER = env('SVE_USER', 'claude-test@vizuall.dk');
const PASS = env('SVE_PASS', '');
const ENTRIES = env('SVE_ENTRIES', '').split(',').map((s) => s.trim()).filter(Boolean);
const OUT = env('SVE_OUT', '');
const INSTANT_MS = Number(env('SVE_INSTANT_MS', '100'));
const WITH_CHROME = env('SVE_CHROME', '') === '1';
const CHROME_BIN = env('SVE_CHROME_BIN', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome');
const SCRIPT = `${ADDON_DIR}/resources/js/dock-instant-preview.js`;
const POLL_MAX = 3000;

if (!PASS) { console.error('SVE_PASS is required'); process.exit(2); }
if (!ENTRIES.length) { console.error('SVE_ENTRIES is required (comma-separated CP entry paths)'); process.exit(2); }

const puppeteer = createRequire(`${SITE_DIR}/package.json`)('puppeteer');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const report = { site: SITE_URL, files: [], errors: [] };
const scriptSource = readFileSync(SCRIPT, 'utf8');

// ---- Static analysis of a pane's text: where each kind of edit goes --------

const BLOCK_SAME_SCOPE = /^(if|unless|once|cache|nocache|no_cache|style_push|script_push|push|stack|section|markdown|noparse|raw)$/;

/** Block ranges [bodyStart, bodyEnd] for if/unless and loop pairs (not style_push & co). */
function blockRanges(html) {
  const tags = antlersTags(html);
  const closers = new Set();
  for (const t of tags) { if (t.closer) closers.add(t.name); }
  const stack = [];
  const out = [];
  for (const t of tags) {
    if (t.comment) continue;
    const name = /^end(if|unless)$/.test(t.name) ? t.name.slice(3) : t.name;
    if (t.closer || /^end(if|unless)$/.test(t.name)) {
      const i = stack.map((s) => s.name).lastIndexOf(name);
      if (i !== -1) { const open = stack.splice(i, 1)[0]; out.push({ name, from: open.end, to: t.from, openerEnd: open.end }); }
      continue;
    }
    const isBlock = name === 'if' || name === 'unless' || (closers.has(name) && !BLOCK_SAME_SCOPE.test(name));
    if (isBlock) stack.push({ name, end: t.to });
  }
  return out.sort((a, b) => a.from - b.from);
}

/** Ranges of <style>/<script> bodies (never edited). */
function skipRanges(masked) {
  const out = [];
  const re = /<(style|script)\b[^>]*>[\s\S]*?<\/\1>/gi;
  let m;
  while ((m = re.exec(masked))) out.push({ from: m.index, to: m.index + m[0].length });
  return out;
}

const within = (pos, ranges) => ranges.some((r) => pos >= r.from && pos < r.to);

/** HTML tags in the masked text: { from, to, name, classAt (end of class value) | null }. */
function htmlTags(masked) {
  const out = [];
  const re = /<([a-zA-Z][\w:-]*)((?:"[^"]*"|'[^']*'|[^>"'])*)>/g;
  let m;
  while ((m = re.exec(masked))) {
    const attrs = m[2];
    const cls = /(^|\s)class\s*=\s*("([^"]*)"|'([^']*)')/.exec(attrs);
    let classAt = null;
    if (cls) {
      const valueStart = m.index + 1 + m[1].length + cls.index + cls[0].indexOf(cls[2]) + 1;
      classAt = valueStart + (cls[3] ?? cls[4]).length;
    }
    out.push({ from: m.index, to: m.index + m[0].length, name: m[1].toLowerCase(), classAt, selfClosing: /\/\s*>$/.test(m[0]) });
  }
  return out;
}

/** An Antlers tag with a literal class parameter: end of the value, or null. */
function antlersClassParam(html, t) {
  if (t.comment || t.closer) return null;
  const raw = html.slice(t.from, t.to);
  const m = /(\s)(class|_class|props_class)\s*=\s*("([^"{}]*)"|'([^'{}]*)')/.exec(raw);
  if (!m) return null;
  const valueStart = t.from + m.index + m[0].indexOf(m[3]) + 1;
  return { at: valueStart + (m[4] ?? m[5]).length, name: t.name };
}

/** The plan for one file: a list of edits with offsets into the pane text. */
function planEdits(html, css, sid) {
  const masked = maskAntlers(html);
  const blocks = blockRanges(html);
  const skips = skipRanges(masked);
  const tags = htmlTags(masked);
  const open = tags.filter((t) => !within(t.from, skips));
  const root = open[0];
  const edits = [];
  const sel = `[data-sid="${sid}"]`;
  // The root's closing tag: the last </name> outside style/script.
  const closeRe = root ? new RegExp(`</${root.name}\\s*>`, 'gi') : null;
  let rootClose = null;
  if (closeRe) { let m; while ((m = closeRe.exec(masked))) { if (!within(m.index, skips)) rootClose = m.index; } }
  const inBlock = (pos) => blocks.some((b) => pos >= b.from && pos < b.to);
  const staticEl = open.find((t) => t !== root && t.classAt != null && !inBlock(t.from));
  const inIf = (pos) => blocks.some((b) => (b.name === 'if' || b.name === 'unless') && pos >= b.from && pos < b.to);
  const inLoop = (pos) => blocks.some((b) => b.name !== 'if' && b.name !== 'unless' && pos >= b.from && pos < b.to);
  const ifEl = open.find((t) => t.classAt != null && inIf(t.from) && !inLoop(t.from));
  const loopEl = open.find((t) => t.classAt != null && inLoop(t.from));
  const antlersParam = antlersTags(html).map((t) => antlersClassParam(html, t)).find((p) => p && !within(p.at, skips));
  const firstIf = blocks.find((b) => (b.name === 'if' || b.name === 'unless') && !within(b.openerEnd, skips) && !inLoop(b.openerEnd));
  const firstLoop = blocks.find((b) => b.name !== 'if' && b.name !== 'unless' && !within(b.openerEnd, skips));
  // The first static text run: between > and <, letters only, outside blocks, style and Antlers.
  let textAt = null;
  { const re = />([^<{}-]*[A-Za-zÆØÅæøå]{3,}[^<{}-]*)</g; let m; while ((m = re.exec(masked))) { const pos = m.index + 1 + m[1].length; if (within(m.index, skips) || inBlock(m.index)) continue; if (/^\s*$/.test(m[1])) continue; textAt = pos; break; } }

  if (root && root.classAt != null) edits.push({ kind: 'class-root', pane: 'html', from: root.classAt, insert: ' sve-a1', check: `!!document.querySelector('.sve-a1')` });
  else edits.push({ kind: 'class-root', skip: 'root has no class attribute' });
  if (staticEl) edits.push({ kind: 'class-static', pane: 'html', from: staticEl.classAt, insert: ' sve-a2', check: `!!document.querySelector('${sel} .sve-a2')` });
  else edits.push({ kind: 'class-static', skip: 'no static element with a class' });
  if (ifEl) edits.push({ kind: 'class-in-if', pane: 'html', from: ifEl.classAt, insert: ' sve-a3', check: `!!document.querySelector('${sel} .sve-a3')` });
  else edits.push({ kind: 'class-in-if', skip: 'no element inside an if' });
  if (loopEl) edits.push({ kind: 'class-in-loop', pane: 'html', from: loopEl.classAt, insert: ' sve-a5', check: `!!document.querySelector('${sel} .sve-a5')` });
  else edits.push({ kind: 'class-in-loop', skip: 'no element inside a loop' });
  if (antlersParam) edits.push({ kind: 'class-antlers', pane: 'html', from: antlersParam.at, insert: ' sve-a4', check: `!!document.querySelector('${sel} .sve-a4')`, note: `{{ ${antlersParam.name} }}` });
  else edits.push({ kind: 'class-antlers', skip: 'no Antlers tag with a literal class parameter' });
  // A class inside a condition's literal in a class attribute: `{{ x ?= 'a b' }}` or `{{ x ? 'a' : 'b' }}`.
  // It paints on the element that shows the branch — so only when the page renders that branch somewhere.
  const ternary = (() => { const re = /\{\{\s*([^{}]*?)\s*\?=?\s*'([^']*)'/g; let m; while ((m = re.exec(html))) { const at = m.index + m[0].length - 1; if (within(at, skips)) continue; const tag = tags.find((t) => t.classAt != null && at > t.from && at < t.to); if (tag) return { at, cond: m[1], tokens: m[2].split(/\s+/).filter(Boolean) }; } return null; })();
  if (ternary && ternary.tokens.length) edits.push({ kind: 'class-ternary', pane: 'html', from: ternary.at, insert: ' sve-a6', check: `!!document.querySelector('${sel} .sve-a6')`, pre: `[...document.querySelectorAll('${sel}, ${sel} *')].some((el) => ${JSON.stringify(ternary.tokens)}.every((t) => el.classList.contains(t)))`, note: `{{ ${ternary.cond} ?= '${ternary.tokens.join(' ')}' }}` });
  else edits.push({ kind: 'class-ternary', skip: 'no condition with a class literal in a class attribute' });
  if (rootClose != null) edits.push({ kind: 'new-p-static', pane: 'html', from: rootClose, insert: '<p class="sve-p1">probe</p>\n', check: `document.querySelector('${sel} .sve-p1')?.textContent === 'probe'` });
  else edits.push({ kind: 'new-p-static', skip: 'no root closing tag' });
  if (firstIf) edits.push({ kind: 'new-p-in-if', pane: 'html', from: firstIf.openerEnd, insert: '<p class="sve-p2">probe</p>', check: `!!document.querySelector('${sel} .sve-p2')`, note: `{{ ${firstIf.name} }}` });
  else edits.push({ kind: 'new-p-in-if', skip: 'no if' });
  // Inside the first element of the loop's body: one per rendered item, where the item's root is the live element.
  const loopItem = firstLoop ? open.find((t) => t.from >= firstLoop.from && t.from < firstLoop.to && !t.selfClosing && !/^(br|img|hr|input|source|path|use)$/.test(t.name)) : null;
  if (loopItem) edits.push({ kind: 'new-p-in-loop-item', pane: 'html', from: loopItem.to, insert: '<p class="sve-p4">probe</p>', check: `!!document.querySelector('${sel} .sve-p4')`, note: `<${loopItem.name}> in {{ ${firstLoop.name} }}` });
  else edits.push({ kind: 'new-p-in-loop-item', skip: 'no element inside a loop' });
  if (firstLoop) edits.push({ kind: 'new-p-in-loop', pane: 'html', from: firstLoop.openerEnd, insert: '<p class="sve-p3">probe</p>', check: `!!document.querySelector('${sel} .sve-p3')`, note: `{{ ${firstLoop.name} }}` });
  else edits.push({ kind: 'new-p-in-loop', skip: 'no loop' });
  if (textAt != null) edits.push({ kind: 'text-static', pane: 'html', from: textAt, insert: ' qzxw', check: `(document.querySelector('${sel}')?.textContent || '').includes('qzxw')` });
  else edits.push({ kind: 'text-static', skip: 'no static text' });
  if (root && root.classAt != null) edits.push({ kind: 'tailwind-class', pane: 'html', from: root.classAt, insert: ' tracking-[0.37px]', check: `!!document.querySelector('.tracking-\\\\[0\\\\.37px\\\\]') && getComputedStyle(document.querySelector('.tracking-\\\\[0\\\\.37px\\\\]')).letterSpacing === '0.37px'` });
  else edits.push({ kind: 'tailwind-class', skip: 'root has no class attribute' });
  // Last, with the dock's All on: a free rule belongs in the whole sheet. With a pick, the CSS
  // pane shows the picked element's own `[ name ]` rules and a rule for another selector is
  // not kept there (dock/scope.js mergedCssFull) — that is the dock's rule, not a paint delay.
  edits.push({ kind: 'css-rule', pane: 'css', all: true, atEnd: true, insert: `\n${sel} { outline-offset: 7px; }\n`, check: `getComputedStyle(document.querySelector('${sel}')).outlineOffset === '7px'` });
  return edits;
}

// ---- Browser ---------------------------------------------------------------

const browser = await puppeteer.launch({ headless: env('SVE_HEADED', '') !== '1', executablePath: existsSync(CHROME_BIN) ? CHROME_BIN : undefined, defaultViewport: { width: 1440, height: 900 } });
const page = await browser.newPage();
page.on('dialog', (d) => d.accept().catch(() => {}));
page.on('pageerror', (e) => report.errors.push(`pageerror: ${e.message}`));
await page.setRequestInterception(true);
page.on('request', (req) => { if (/\/vendor\/visual-editor\/js\/dock-instant-preview\.js/.test(req.url())) { req.respond({ status: 200, contentType: 'application/javascript', body: scriptSource }); } else { req.continue(); } });

const backups = new Map();
const touched = new Set();
const remember = (rel) => { const abs = rel.startsWith('/') ? rel : `${SITE_DIR}/${rel}`; if (!backups.has(abs) && existsSync(abs)) backups.set(abs, readFileSync(abs, 'utf8')); touched.add(rel); return abs; };

async function waitIn(frame, selector, ms) { try { await frame.waitForSelector(selector, { timeout: ms }); return true; } catch { return false; } }
async function frameOffset(frame) { let x = 0, y = 0; for (let f = frame; f.parentFrame(); f = f.parentFrame()) { const box = await (await f.frameElement()).boundingBox(); x += box.x; y += box.y; } return { x, y }; }

try {
  await page.goto(`${SITE_URL}/cp`, { waitUntil: 'networkidle2' });
  await page.waitForSelector('input[name="email"]');
  await page.type('input[name="email"]', USER); await page.type('input[name="password"]', PASS);
  await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(() => {}), page.keyboard.press('Enter')]);
  await sleep(500);

  for (const entry of ENTRIES) {
    await page.goto(`${SITE_URL}${entry}`, { waitUntil: 'networkidle2' });
    if (await page.$('input[name="password"]')) { report.errors.push('login failed'); break; }
    await sleep(1500);
    await page.evaluate(() => [...document.querySelectorAll('button')].find((e) => /live preview/i.test(e.textContent || ''))?.click());
    if (!(await waitIn(page, 'iframe.sve-edit-overlay[data-open]', 30000))) { report.errors.push(`${entry}: no overlay`); continue; }
    const cp = await (await page.$('iframe.sve-edit-overlay')).contentFrame();
    await waitIn(cp, '#__sve-toolbar button', 20000);
    const livePreview = async () => { const el = await cp.$('#live-preview-iframe'); return el ? el.contentFrame() : null; };
    let lp = null;
    for (let i = 0; i < 30 && !lp; i++) { const p = await livePreview(); if (p && await p.evaluate(() => !!document.querySelector('[data-sid-section-orderable]')).catch(() => false)) lp = p; else await sleep(1000); }
    if (!lp) { report.errors.push(`${entry}: preview never rendered`); continue; }
    await sleep(1500);

    const dockPath = () => cp.evaluate(() => { const el = document.querySelector('#__sve-code-dock [data-sve-code-path]'); return el ? (el.getAttribute('data-sve-code-path') || el.textContent.trim()) : ''; });
    const openDock = async () => { if (!(await cp.$('#__sve-code-dock [data-sve-code-pane="html"] .cm-editor'))) { const b = await cp.$('#__sve-toolbar button[data-tab="code"]'); if (b) { const r = await b.boundingBox(); const off = await frameOffset(cp); await page.mouse.click(off.x + r.x + r.width / 2, off.y + r.y + r.height / 2); } } return waitIn(cp, '#__sve-code-dock [data-sve-code-pane="html"] .cm-editor', 15000); };
    const unlock = async () => { const locked = await cp.evaluate(() => document.querySelector('#__sve-code-dock')?.hasAttribute('data-sve-code-locked')); if (!locked) return; const b = await cp.$('#__sve-code-dock [data-sve-code-lock]'); if (!b) return; const r = await b.boundingBox(); const off = await frameOffset(cp); await page.mouse.click(off.x + r.x + r.width / 2, off.y + r.y + r.height / 2); if (await waitIn(cp, '.sve-dialog .sve-dialog__actions button', 8000)) { const q = await cp.evaluate(() => { const b = [...document.querySelectorAll('.sve-dialog .sve-dialog__actions button')].pop(); const r = b.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }); await page.mouse.click(off.x + q.x, off.y + q.y); } for (let i = 0; i < 20; i++) { await sleep(400); if (!(await cp.evaluate(() => document.querySelector('#__sve-code-dock')?.hasAttribute('data-sve-code-locked')))) return; } };
    const showPane = async (h) => { const pressed = await cp.evaluate((h) => document.querySelector(`#__sve-code-dock [data-sve-code-pane-btn="${h}"]`)?.getAttribute('aria-pressed') === 'true', h); if (pressed) return; const b = await cp.$(`#__sve-code-dock [data-sve-code-pane-btn="${h}"]`); if (!b) return; const r = await b.boundingBox(); const off = await frameOffset(cp); await page.mouse.click(off.x + r.x + r.width / 2, off.y + r.y + r.height / 2); await sleep(500); };
    const pressAll = async () => { const on = await cp.evaluate(() => document.querySelector('#__sve-code-dock [data-sve-all]')?.getAttribute('aria-pressed') === 'true'); if (on) return; const b = await cp.$('#__sve-code-dock [data-sve-all]'); if (!b) return; const r = await b.boundingBox(); const off = await frameOffset(cp); await page.mouse.click(off.x + r.x + r.width / 2, off.y + r.y + r.height / 2); await sleep(700); };
    const paneText = (h) => cp.evaluate((h) => { const c = document.querySelector(`#__sve-code-dock [data-sve-code-pane="${h}"] .cm-content`); const v = c?.cmTile?.view || c?.cmView?.view; return v ? v.state.doc.toString() : null; }, h);
    const dispatch = (h, from, to, insert) => cp.evaluate((h, f, t, ins) => { const c = document.querySelector(`#__sve-code-dock [data-sve-code-pane="${h}"] .cm-content`); const v = c?.cmTile?.view || c?.cmView?.view; if (!v) return false; v.dispatch({ changes: { from: f, to: t, insert: ins }, selection: { anchor: f + ins.length } }); return true; }, h, from, to, insert);
    const traceTail = () => cp.evaluate(() => (window.__sveInstantTrace || []).slice(-6).map((l) => String(l).replace(/^\d+ /, '').slice(0, 400)));
    const until = async (frame, check, max) => { const t0 = Date.now(); for (;;) { let ok = false; try { ok = await frame.evaluate((c) => { try { return !!eval(c); } catch { return false; } }, check); } catch { ok = false; } if (ok) return Date.now() - t0; if (Date.now() - t0 > max) return -1; await sleep(8); } };

    const sections = await lp.evaluate(() => { const seen = new Set(); const out = []; for (const el of document.querySelectorAll('[data-sid-section-orderable]')) { if (el.closest('[data-sve-chrome]')) continue; const sid = el.getAttribute('data-sid'); if (!sid || seen.has(sid) || el.parentElement?.closest('[data-sid]')) continue; seen.add(sid); out.push({ sid, tag: el.tagName.toLowerCase(), cls: el.getAttribute('class') || '' }); } return out; });
    console.log(`\n### ${entry} — ${sections.length} section(s)`);

    const seenFiles = new Set();
    for (const s of sections) {
      const lpNow = await livePreview();
      if (!lpNow) break;
      // Click the section's own edge, the way a person does, so the dock follows
      // it — centred in the viewport first, so the sticky header is not what is
      // under the mouse, and a little below the section's top for the same reason.
      const rect = await lpNow.evaluate((sid) => { const el = document.querySelector(`[data-sid="${sid}"]`); el.scrollIntoView({ block: 'center' }); const r = el.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height, global: !!el.closest('[data-sve-global-root]') }; }, s.sid);
      await sleep(400);
      const rect2 = await lpNow.evaluate((sid) => { const r = document.querySelector(`[data-sid="${sid}"]`).getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height, vh: window.innerHeight }; }, s.sid);
      const off = await frameOffset(lpNow);
      const cx = rect2.x + 6;
      const cy = Math.min(Math.max(rect2.y + 6, 180), rect2.y + rect2.h - 6, rect2.vh - 10);
      const under = await lpNow.evaluate((px, py) => { const el = document.elementFromPoint(px, py); return el ? `${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''} sid=${el.closest('[data-sid]')?.getAttribute('data-sid') || '-'} chrome=${!!el.closest('[data-sve-chrome]')}` : 'nothing'; }, cx, cy);
      await page.mouse.click(off.x + cx, off.y + cy);
      await sleep(1200);
      // A confirm ("global — applies everywhere"): step in for a global section, back out otherwise.
      const confirm = await lpNow.$('#__sve-preview-confirm [data-sve-actions] button');
      if (confirm) { const q = await lpNow.evaluate((last) => { const bs = [...document.querySelectorAll('#__sve-preview-confirm [data-sve-actions] button')]; const b = last ? bs.pop() : bs[0]; const r = b.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }, rect.global); await page.mouse.click(off.x + q.x, off.y + q.y); await sleep(1500); }
      console.log(`click ${s.sid} at ${Math.round(cx)},${Math.round(cy)} on ${under}${confirm ? ' (confirm ' + (rect.global ? 'accepted' : 'declined') + ')' : ''}`);
      if (!(await openDock())) { report.errors.push(`${s.sid}: dock did not open`); continue; }
      let path = ''; for (let i = 0; i < 40; i++) { path = await dockPath(); if (/page_sections\//.test(path)) break; await sleep(200); }
      if (!/page_sections\//.test(path)) { console.log(`skip ${s.sid}: dock shows "${path}"`); continue; }
      if (seenFiles.has(path)) { console.log(`dup  ${path} (same file twice on the page; a class there must paint on both — covered by the first)`); continue; }
      seenFiles.add(path);
      remember(path);
      await unlock();
      await sleep(400);
      const html = await paneText('html'); const css = (await paneText('css')) ?? '';
      if (html == null) { report.errors.push(`${path}: no html pane`); continue; }
      const edits = planEdits(html, css, s.sid);
      const row = { entry, path, sid: s.sid, results: [] };
      report.files.push(row);
      console.log(`\n== ${path}`);
      for (const e of edits) {
        if (e.skip) { row.results.push({ kind: e.kind, skip: e.skip }); console.log(`  ${e.kind.padEnd(16)} —  (${e.skip})`); continue; }
        // An edit that can only show where the page renders the branch: skipped, not judged, when it does not.
        if (e.pre && !(await (await livePreview()).evaluate((c) => { try { return !!eval(c); } catch { return false; } }, e.pre))) { row.results.push({ kind: e.kind, skip: 'the page renders no element with that branch' }); console.log(`  ${e.kind.padEnd(16)} —  (the page renders no element with that branch)${e.note ? '  ' + e.note : ''}`); continue; }
        // The pane the edit goes in is shown first, as a person has it: CodeMirror
        // draws no lines in a hidden pane, and then nothing watches the keystroke.
        await showPane(e.pane);
        if (e.all) await pressAll();
        const before = await paneText(e.pane);
        if (e.atEnd) e.from = before == null ? 0 : before.length;
        if (before == null || e.from > before.length) { row.results.push({ kind: e.kind, skip: 'pane changed' }); continue; }
        await cp.evaluate(() => { window.__sveInstantTrace = []; });
        const frame = await livePreview();
        await dispatch(e.pane, e.from, e.from, e.insert);
        const ms = await until(frame, e.check, POLL_MAX);
        const trace = await traceTail();
        const verdict = ms < 0 ? 'NEVER' : ms <= INSTANT_MS ? 'instant' : 'slow';
        if (verdict === 'NEVER') {
          const dbg = await (await livePreview()).evaluate((sel) => { const el = document.querySelector(sel); return { root: el ? el.outerHTML.slice(0, 220) : 'no element for ' + sel, sheet: (document.getElementById('__sve-dock-css-live')?.textContent || '').slice(-200), styles: [...document.querySelectorAll('head style')].length }; }, `[data-sid="${s.sid}"]`);
          const paneNow = (await paneText(e.pane)) || '';
          console.log(`      DEBUG live: ${dbg.root}\n      DEBUG sheet tail: ${dbg.sheet.replace(/\s+/g, ' ')}\n      DEBUG pane around edit: ${JSON.stringify(paneNow.slice(Math.max(0, e.from - 60), e.from + e.insert.length + 20))}`);
        }
        row.results.push({ kind: e.kind, ms, verdict, note: e.note, trace: verdict === 'instant' ? undefined : trace });
        console.log(`  ${e.kind.padEnd(16)} ${String(ms).padStart(5)} ms  ${verdict}${e.note ? '  ' + e.note : ''}${verdict !== 'instant' ? '\n      ' + trace.join('\n      ') : ''}`);
        // Undo, then wait for the preview to drop it again (paint or morph), so the next edit starts clean.
        await dispatch(e.pane, e.from, e.from + e.insert.length, '');
        const gone = await until(await livePreview(), `!(${e.check})`, 4000);
        if (gone < 0) console.log(`      (undo not visible within 4 s)`);
        await sleep(1300);
      }
    }
  }
} catch (e) {
  report.errors.push(`exception: ${e.stack || e.message}`);
} finally {
  await browser.close();
  await sleep(1500);
  for (const [abs, original] of backups) {
    let stable = 0;
    for (let i = 0; i < 60 && stable < 6; i++) { if (readFileSync(abs, 'utf8') !== original) { writeFileSync(abs, original); stable = 0; } else { stable++; } await sleep(500); }
    if (readFileSync(abs, 'utf8') !== original) report.errors.push(`not restored: ${abs}`);
  }
  for (const rel of touched) {
    const historyDir = `${SITE_DIR}/storage/statamic-visual-editor/history/${rel.replace(/\//g, '_')}`;
    if (existsSync(historyDir)) { for (const name of readdirSync(historyDir)) { const f = `${historyDir}/${name}`; if (statSync(f).mtimeMs >= startedAt - 1000) unlinkSync(f); } if (!readdirSync(historyDir).length) rmdirSync(historyDir); }
  }
}

// ---- Summary ------------------------------------------------------------------
const kinds = ['class-root', 'class-static', 'class-in-if', 'class-in-loop', 'class-antlers', 'class-ternary', 'new-p-static', 'new-p-in-if', 'new-p-in-loop', 'new-p-in-loop-item', 'text-static', 'tailwind-class', 'css-rule'];
console.log('\nOPSUMMERING pr. slags (instant / langsom / aldrig / sprunget over):');
for (const k of kinds) {
  const rs = report.files.flatMap((f) => f.results.filter((r) => r.kind === k));
  const n = (v) => rs.filter((r) => r.verdict === v).length;
  const skipped = rs.filter((r) => r.skip).length;
  const slowMs = rs.filter((r) => r.verdict === 'slow').map((r) => r.ms);
  console.log(`  ${k.padEnd(16)} ${String(n('instant')).padStart(3)} / ${String(n('slow')).padStart(3)} / ${String(n('NEVER')).padStart(3)} / ${String(skipped).padStart(3)}${slowMs.length ? `   langsom: ${Math.min(...slowMs)}–${Math.max(...slowMs)} ms` : ''}`);
}
if (report.errors.length) console.log('\nerrors:\n  ' + report.errors.join('\n  '));
if (OUT) writeFileSync(OUT, JSON.stringify(report, null, 2));
console.log(`\n${report.files.length} file(s) measured; restored: ${backups.size}`);
