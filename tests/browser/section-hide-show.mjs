#!/usr/bin/env node
/**
 * A section hidden with the tree's eye, then shown again — in one preview and
 * in the breakpoint overview.
 *
 * The eye wraps the section's file in an Antlers comment; the render then has
 * no such section, and the preview drops it. The eye pressed again unwraps the
 * file, and the render has the section back — but the preview's document does
 * not, so a morph scoped to that section had nothing to morph onto and the
 * section stayed away until a reload (25 Sep 2026). applyUpdate now fetches
 * the whole page when its own document lacks the section, and morphs the body.
 *
 * Proves: the eye hides the section from the preview and from every copy in
 * the overview; the eye again brings it back within a few seconds, in the
 * preview and in every copy; the tree row follows; the file ends as it began;
 * no page errors.
 *
 * Same env vars as breakpoint-overview.mjs (SVE_PASS is required); SVE_FIELD
 * names a field of the section under test (default headline). Against a
 * remote site the file cannot be backed up — the eye is pressed twice, which
 * leaves the file as it was.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
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
const FIELD = env('SVE_FIELD', 'headline');
const LOCAL = existsSync(`${SITE_DIR}/users/${USER}.yaml`);

const puppeteer = createRequire(`${SITE_DIR}/package.json`)('puppeteer');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const report = { errors: [], ok: true };
const step = (name, ok, detail = '') => { if (!ok) report.ok = false; console.log(`${ok ? 'ok ' : 'FAIL'} ${name}${detail ? ' — ' + detail : ''}`); };
const info = (name, detail = '') => console.log(`info ${name}${detail ? ' — ' + detail : ''}`);
const skip = (name, why) => console.log(`skip ${name} — ${why}`);

async function until(fn, ms, every = 100) {
  const end = Date.now() + ms;
  for (;;) {
    const value = await fn();
    if (value) return value;
    if (Date.now() > end) return null;
    await sleep(every);
  }
}
async function waitIn(frame, selector, ms) { try { await frame.waitForSelector(selector, { timeout: ms }); return true; } catch { return false; } }
async function absoluteRect(frame, selector) {
  const rect = await frame.evaluate((sel) => { for (const el of document.querySelectorAll(sel)) { const r = el.getBoundingClientRect(); if (r.width > 0 && r.height > 0 && r.right > 0 && r.bottom > 0 && r.left < innerWidth && r.top < innerHeight) return { x: r.x, y: r.y, w: r.width, h: r.height }; } return null; }, selector);
  if (!rect) throw new Error(`no visible element for ${selector}`);
  for (let f = frame; f.parentFrame(); f = f.parentFrame()) { const box = await (await f.frameElement()).boundingBox(); rect.x += box.x; rect.y += box.y; }
  return rect;
}
async function realClick(page, frame, selector) { const r = await absoluteRect(frame, selector); await page.mouse.click(r.x + r.w / 2, r.y + Math.min(r.h / 2, 300)); return r; }
/** A point inside the CP overlay frame, clicked at page coordinates. */
async function clickInCp(page, cp, point) { const box = await (await cp.frameElement()).boundingBox(); await page.mouse.click(box.x + point.x, box.y + point.y); }

// The test user's layout: the left panel shown so the tree can be opened; put back in `finally`.
function seedLayoutPrefs(prefs) {
  if (!LOCAL) return;
  const file = `${SITE_DIR}/users/${USER}.yaml`;
  let yaml = readFileSync(file, 'utf8').replace(/^  sve_chrome:[^\n]*\n(?:    .*\n)*/m, '');
  const entries = Object.entries(prefs || {});
  if (entries.length) {
    const block = `  sve_chrome:\n${entries.map(([k, v]) => `    ${k}: '${String(v).replace(/'/g, "''")}'\n`).join('')}`;
    yaml = /^preferences:\n/m.test(yaml) ? yaml.replace(/^preferences:\n/m, `preferences:\n${block}`) : `${yaml.replace(/\n*$/, '\n')}preferences:\n${block}`;
  }
  writeFileSync(file, yaml);
}

// --- run ---------------------------------------------------------------------------

seedLayoutPrefs({ 'sve-lp-panel-mode': 'show' });
const browser = await puppeteer.launch({ headless: true, executablePath: CHROME, args: ['--window-size=1440,900'], defaultViewport: { width: 1440, height: 900 } });
const page = await browser.newPage();
page.on('pageerror', (e) => report.errors.push(`pageerror: ${e.message}`));
page.on('console', (m) => { if (m.type() === 'error') report.errors.push(`console: ${m.text().slice(0, 200)}`); });
page.on('response', (r) => { if (r.status() >= 500) report.errors.push(`HTTP ${r.status()} ${r.request().method()} ${r.url().replace(SITE_URL, '').slice(0, 160)}`); });
// Every Live Preview render fetched: scoped to one section (sve_sid) or the whole page.
const fetches = [];
// A request for the Instant paint's placeholder character (U+E000 in a src): a Control Panel page per element per frame.
const placeholderRequests = [];
page.on('request', (r) => {
  if (/live-preview=/.test(r.url()) && r.method() === 'GET') fetches.push(/[?&]sve_sid=/.test(r.url()) ? 'section' : 'page');
  if (/%EE%80%8[0-2]/i.test(r.url())) placeholderRequests.push(r.url().replace(SITE_URL, '').slice(0, 80));
});
if (WORKTREE) {
  await serveWorktreeBuild(page, { buildDir: BUILD_DIR, installedManifest: `${SITE_DIR}/public/vendor/visual-editor/build/manifest.json`, scriptsDir: `${ADDON_DIR}/resources/js` });
  info('build served from', ADDON_DIR);
}

let filePath = '';
let original = null;
const absolute = (p) => (p.startsWith('/') ? p : `${SITE_DIR}/${p}`);

try {
  // 1. Log in, open the entry, open Live Preview.
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
  step('Live Preview opened', await waitIn(page, 'iframe.sve-edit-overlay[data-open]', 30000));
  const cp = await (await page.$('iframe.sve-edit-overlay')).contentFrame();
  await page.keyboard.press('Escape');
  step('top bar built', await waitIn(cp, '#__sve-preview-chrome [data-sve-zoom]', 20000));
  const preview = async () => (await cp.$('#live-preview-iframe'))?.contentFrame();
  const main = await until(async () => {
    const f = await preview();
    return f && (await f.evaluate((field) => !!document.querySelector(`[data-sid-field="${field}"]`), FIELD).catch(() => false)) ? f : null;
  }, 25000, 500);
  step(`the preview rendered a ${FIELD}`, !!main);
  await sleep(2500);
  const sectionId = await main.evaluate((field) => document.querySelector(`[data-sid-field="${field}"]`)?.closest('[id^="id-"]')?.id || '', FIELD);
  step('the field sits in a section', !!sectionId, sectionId);

  // 2. The dock on that section's file, unlocked, and the tree open.
  // A licensing dialog on a production site takes the first click now and then: one more try.
  let dock = false;
  for (let attempt = 0; attempt < 2 && !dock; attempt++) {
    await realClick(page, cp, '#__sve-toolbar button[data-tab="code"]');
    dock = await waitIn(cp, '#__sve-code-dock [data-sve-code-pane="html"] .cm-editor', 15000);
  }
  step('the dock opened', dock);
  const dockPath = () => cp.evaluate(() => { const el = document.querySelector('#__sve-code-dock [data-sve-code-path], [data-sve-code-path]'); return el ? (el.getAttribute('data-sve-code-path') || el.textContent.trim()) : ''; });
  // The tree comes with the dock; a site with the older toolbar tab needs it pressed.
  if (!(await cp.$('[data-sve-ht-row]')) && (await cp.$('#__sve-toolbar button[data-tab="html_tree"]'))) { await realClick(page, cp, '#__sve-toolbar button[data-tab="html_tree"]'); await sleep(1500); }
  step('the tree is open', !!(await cp.$('[data-sve-ht-row]')));
  // The section's row in the tree opens its file in the dock.
  for (let attempt = 0; attempt < 3; attempt++) {
    const row = await cp.evaluate((id) => {
      const rows = [...document.querySelectorAll('[data-sve-ht-row][data-sve-ht-sec]')];
      const r = rows.find((x) => (x.getAttribute('data-sve-ht-row') || '').includes(id.replace(/^id-/, ''))) || rows[0];
      if (!r) return null;
      r.scrollIntoView({ block: 'center' });
      const q = r.getBoundingClientRect();
      return { x: q.x + Math.min(80, q.width / 2), y: q.y + q.height / 2 };
    }, sectionId);
    if (!row) break;
    await clickInCp(page, cp, row);
    await sleep(2500);
    if (/page_sections\//.test(await dockPath())) break;
  }
  filePath = await dockPath();
  step('the dock shows the section file', /page_sections\//.test(filePath), filePath.replace(/^.*views\//, ''));
  if (await cp.evaluate(() => document.querySelector('#__sve-code-dock')?.hasAttribute('data-sve-code-locked'))) {
    await realClick(page, cp, '#__sve-code-dock [data-sve-code-lock]');
    if (await waitIn(cp, '.sve-dialog .sve-dialog__actions button', 8000)) {
      const confirm = await cp.evaluate(() => { const b = [...document.querySelectorAll('.sve-dialog .sve-dialog__actions button')].pop(); const q = b.getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2 }; });
      await clickInCp(page, cp, confirm);
    }
    await until(() => cp.evaluate(() => !document.querySelector('#__sve-code-dock')?.hasAttribute('data-sve-code-locked')), 10000, 500);
  }
  step('the file is unlocked', await cp.evaluate(() => !document.querySelector('#__sve-code-dock')?.hasAttribute('data-sve-code-locked')));
  if (LOCAL && existsSync(absolute(filePath))) { original = readFileSync(absolute(filePath), 'utf8'); info('file backed up', filePath.replace(/^.*page_sections\//, '')); } else { skip('file backup', 'not a local site'); }

  // What the preview, the copies and the tree row hold for the section.
  const inPreview = async () => (await preview()).evaluate((id) => !!document.getElementById(id), sectionId);
  const inCopies = async () => Promise.all((await cp.$$('#__sve-bp-overview iframe')).map(async (h) => {
    const src = await (await h.getProperty('src')).jsonValue();
    if (!src || src === 'about:blank') return 'slot';
    const f = await h.contentFrame();
    return f ? f.evaluate((id) => (document.getElementById(id) ? 'present' : 'absent'), sectionId).catch(() => '?') : '?';
  }));
  const rowState = () => cp.evaluate(() => { const r = [...document.querySelectorAll('[data-sve-ht-row]')].find((x) => /^section/.test((x.textContent || '').trim())); return r ? (r.hasAttribute('data-sve-ht-hidden') ? 'hidden' : 'shown') : 'no row'; });
  // The eye on the open section's own row: it shows on hover, so the mouse gets there first.
  const eye = async () => {
    const target = await cp.evaluate(() => {
      const r = [...document.querySelectorAll('[data-sve-ht-row]')].find((x) => x.querySelector('[data-sve-ht-eye]') && /^section/.test((x.textContent || '').trim()));
      if (!r) return null;
      r.scrollIntoView({ block: 'center' });
      const q = r.getBoundingClientRect();
      return { x: q.x + Math.min(60, q.width / 2), y: q.y + q.height / 2 };
    });
    if (!target) return 'no section row with an eye';
    const box = await (await cp.frameElement()).boundingBox();
    await page.mouse.move(box.x + target.x - 6, box.y + target.y);
    await page.mouse.move(box.x + target.x, box.y + target.y);
    await sleep(300);
    const icon = await cp.evaluate(() => {
      const r = [...document.querySelectorAll('[data-sve-ht-row]')].find((x) => x.querySelector('[data-sve-ht-eye]') && /^section/.test((x.textContent || '').trim()));
      const e = r?.querySelector('[data-sve-ht-eye]');
      if (!e) return null;
      const q = e.getBoundingClientRect();
      return q.width ? { x: q.x + q.width / 2, y: q.y + q.height / 2, disabled: e.hasAttribute('disabled') } : null;
    });
    if (!icon) return 'the eye did not show';
    if (icon.disabled) return 'the eye is disabled';
    await clickInCp(page, cp, icon);
    return '';
  };
  const cycle = async (where) => {
    fetches.splice(0);
    let why = await eye();
    step(`${where}: the eye is clickable`, !why, why);
    const gone = await until(async () => !(await inPreview()), 6000, 200);
    step(`${where}: hidden — the section left the preview`, !!gone, `renders fetched: ${fetches.join(', ') || 'none'}`);
    step(`${where}: hidden — the tree row says so`, (await rowState()) === 'hidden', await rowState());
    if (where === 'overview') { const copies = await until(async () => { const c = await inCopies(); return c.every((s) => s !== 'present') ? c : null; }, 6000, 300); step('overview: hidden — every copy dropped it too', !!copies, (copies || (await inCopies())).join(' ')); }
    await sleep(1500);
    fetches.splice(0);
    const started = Date.now();
    why = await eye();
    step(`${where}: the eye is clickable again`, !why, why);
    const back = await until(inPreview, 8000, 200);
    step(`${where}: shown — the section is back in the preview`, !!back, `after ${Date.now() - started} ms; renders fetched: ${fetches.join(', ') || 'none'}`);
    step(`${where}: shown — the tree row says so`, (await rowState()) === 'shown', await rowState());
    if (where === 'overview') { const copies = await until(async () => { const c = await inCopies(); return c.every((s) => s !== 'absent') ? c : null; }, 8000, 300); step('overview: shown — every copy has it back', !!copies, (copies || (await inCopies())).join(' ')); }
    await sleep(1500);
  };

  // 3. One preview.
  step('the section is in the preview to begin with', await inPreview());
  await cycle('preview');

  // 4. The overview.
  await realClick(page, cp, '#__sve-preview-chrome [data-overview]');
  step('the overview opened', await waitIn(cp, '#__sve-bp-overview', 10000));
  await until(async () => { const c = await inCopies(); return c.length > 1 && c.every((s) => s !== '?' && s !== 'absent') ? c : null; }, 12000, 500);
  step('every copy shows the section to begin with', (await inCopies()).every((s) => s !== 'absent'), (await inCopies()).join(' '));
  await cycle('overview');
  await page.keyboard.press('Escape');
  await sleep(800);
  step('the overview closed', !(await cp.$('#__sve-bp-overview')));

  if (original !== null) {
    await sleep(2500);
    // The dock's own save adds `{{ sve_tw }}` to a file that lacks it; the eye's wrap and unwrap must leave nothing else.
    const bare = (text) => text.replace(/\n*\{\{ sve_tw \}\}\n*/g, '\n\n');
    const now = bare(readFileSync(absolute(filePath), 'utf8'));
    const was = bare(original);
    const at = [...now].findIndex((ch, i) => ch !== was[i]);
    step('the file ends as it began (apart from the dock\'s sve_tw line)', now === was, now === was ? '' : `${was.length} → ${now.length} chars; first difference at ${at}: ${JSON.stringify(was.slice(Math.max(0, at - 20), at + 30))} → ${JSON.stringify(now.slice(Math.max(0, at - 20), at + 30))}`);
  }
} catch (e) {
  step('no exception', false, e.stack || e.message);
} finally {
  await browser.close();
  await sleep(2000);
  if (original !== null) {
    const abs = absolute(filePath);
    let stable = 0;
    for (let i = 0; i < 40 && stable < 8; i++) { if (readFileSync(abs, 'utf8') !== original) { writeFileSync(abs, original); stable = 0; } else stable++; await sleep(500); }
    info('file restored', String(readFileSync(abs, 'utf8') === original));
  }
  seedLayoutPrefs(null);
}

step('no request for a placeholder URL (an <img> or <video> built from the template must not load U+E000)', placeholderRequests.length === 0, placeholderRequests.length ? `${placeholderRequests.length} request(s), e.g. ${placeholderRequests[0]}` : 'none');
const errors = report.errors.filter((e) => !/favicon|ERR_ABORTED|status of 4|ERR_NETWORK_CHANGED/.test(e));
step('no page errors', errors.length === 0, errors.slice(0, 4).join(' | '));
console.log(report.ok ? '\nPASS' : '\nFAIL');
process.exit(report.ok ? 0 : 1);
