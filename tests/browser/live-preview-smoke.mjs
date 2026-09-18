#!/usr/bin/env node
/**
 * Live Preview smoke test — the editor boots, a section can be focused from
 * the preview, the code dock opens, and no JavaScript error was thrown.
 *
 * Runs against a real site with the addon installed (the one Composer put in
 * vendor/, i.e. what an editor actually gets). It is not a unit test: it proves
 * the shipped bundle still does the four things every other feature depends on.
 *
 *   SVE_SITE_DIR   site checkout that has puppeteer in node_modules
 *   SVE_SITE_URL   e.g. http://vizuall-skabelon.test
 *   SVE_USER / SVE_PASS   a CP user allowed to open Live Preview
 *   SVE_ENTRY      CP path of an entry to open, e.g. /cp/collections/pages/entries/<id>
 *   SVE_CHROME     Chrome binary (defaults to the Mac app)
 *   SVE_PREFS      JSON of editor layout prefs to start from, e.g. '{"sve-lp-device":"Tablet"}'
 *                  (keys as in chrome-prefs.js). Default: none — the test user's saved
 *                  layout is reset before and after every run, so runs do not inherit
 *                  the docks and device the previous run left open.
 *
 *   node tests/browser/live-preview-smoke.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
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
/** SVE_WORKTREE=1: serve the working tree's build in place of the installed one, so a bundle is proven before release. */
const WORKTREE = env('SVE_WORKTREE', '') === '1';

const puppeteer = createRequire(`${SITE_DIR}/package.json`)('puppeteer');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const report = { steps: [], errors: [], ok: true };
const info = (name, detail = '') => { report.steps.push({ name, ok: true, info: true, detail }); console.log(`info ${name} — ${detail}`); };
const step = (name, ok, detail = '') => { report.steps.push({ name, ok, detail }); if (!ok) report.ok = false; console.log(`${ok ? 'ok ' : 'FAIL'} ${name}${detail ? ' — ' + detail : ''}`); };

/** Page-level rectangle of an element inside (possibly nested) iframes. */
async function absoluteRect(frame, selector, accept = null) {
  // evaluate() rather than $eval(): Frame.$ came back empty in the doubly nested
  // preview frame while document.querySelector in the same frame found the node.
  const rect = await frame.evaluate((sel, acceptSrc) => {
    const accept = acceptSrc ? new Function(`return (${acceptSrc})`)() : null;
    // The first VISIBLE match: the editor parks helper nodes off-screen, and a
    // click at their coordinates lands on nothing.
    for (const el of document.querySelectorAll(sel)) {
      if (accept && !accept(el)) continue;
      let r = el.getBoundingClientRect();
      if (!(r.width > 0 && r.height > 0)) continue;
      // Below the fold is not "covered": bring it on screen first, as a person scrolling would.
      if (r.bottom <= 0 || r.top >= innerHeight) { el.scrollIntoView({ block: 'center', behavior: 'instant' }); r = el.getBoundingClientRect(); }
      if (!(r.right > 0 && r.bottom > 0 && r.top < innerHeight)) continue;
      // Uncovered: what the browser would hand the click at the centre must be
      // this element (or something inside it) — not an image or a control
      // painted over it, which the bridge would rightly answer for instead.
      const top = document.elementFromPoint(r.x + r.width / 2, r.y + Math.min(r.height / 2, 300));
      if (!top || !el.contains(top)) continue;
      return { x: r.x, y: r.y, w: r.width, h: r.height, what: `${el.tagName.toLowerCase()}${el.hasAttribute('data-sid-field') ? ' field=' + el.getAttribute('data-sid-field') : ''} "${(el.textContent || '').trim().slice(0, 30)}"` };
    }
    return null;
  }, selector, accept ? accept.toString() : null);
  if (!rect) {
    // Say what stood in the way: each candidate's box and what the browser
    // hands a click at its centre — the answer is usually a layer over the page.
    const why = await frame.evaluate((sel) => [...document.querySelectorAll(sel)].slice(0, 6).map((el) => {
      const r = el.getBoundingClientRect();
      const top = document.elementFromPoint(r.x + r.width / 2, r.y + Math.min(r.height / 2, 300));
      const d = (n) => n ? `${n.tagName.toLowerCase()}${n.id ? '#' + n.id : ''}${n.className && typeof n.className === 'string' ? '.' + n.className.split(' ').slice(0, 2).join('.') : ''}${[...n.attributes].filter((a) => /^data-(sid|sve)/.test(a.name)).slice(0, 2).map((a) => ` ${a.name}=${a.value.slice(0, 12)}`).join('')}` : 'nothing';
      return `${d(el)} @${Math.round(r.x)},${Math.round(r.y)} ${Math.round(r.width)}x${Math.round(r.height)} → ${d(top)}`;
    }).join(' ; ') + ` | scrollY=${scrollY} innerHeight=${innerHeight}`, selector);
    throw new Error(`no visible element for ${selector} — ${why}`);
  }
  rect.trail = [`${rect.what || 'el'}@${Math.round(rect.x)},${Math.round(rect.y)} ${Math.round(rect.w)}x${Math.round(rect.h)}`];
  for (let f = frame; f.parentFrame(); f = f.parentFrame()) {
    const el = await f.frameElement();
    const box = await el.boundingBox();
    const name = await el.evaluate((e) => `${e.tagName.toLowerCase()}${e.id ? '#' + e.id : ''}.${[...e.classList].join('.')}`);
    rect.trail.push(`${name}@${Math.round(box.x)},${Math.round(box.y)} ${Math.round(box.width)}x${Math.round(box.height)}`);
    rect.x += box.x; rect.y += box.y;
  }
  return rect;
}
async function realClick(page, frame, selector, accept = null) {
  const r = await absoluteRect(frame, selector, accept);
  const x = r.x + r.w / 2;
  const y = r.y + Math.min(r.h / 2, 300);
  // What is actually under the pointer — a real click lands on the top-most
  // element, not on the selector. While a View Transition runs, the page is a
  // snapshot and every point hit-tests to <html>: a click then reaches nobody.
  // Wait for that to pass, as a person's eye would, and say how long it took.
  const probe = () => page.evaluate((px, py) => {
    const el = document.elementFromPoint(px, py);
    return { under: el ? `${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}.${[...el.classList].slice(0, 2).join('.')}` : 'nothing', html: el?.tagName === 'HTML', cls: document.documentElement.className, vt: !!document.activeViewTransition };
  }, x, y);
  const t0 = Date.now();
  let p = await probe();
  while (p.html && Date.now() - t0 < 8000) { await sleep(100); p = await probe(); }
  const waited = Date.now() - t0;
  await page.mouse.click(x, y);
  return { x: Math.round(x), y: Math.round(y), under: `${p.under}${waited > 150 ? ` (waited ${waited} ms for the page to be hit-testable)` : ''}${p.vt ? ' view-transition-active' : ''}${p.cls ? ` html.${p.cls.split(' ').join('.')}` : ''} [${r.trail.join(' > ')}]` };
}
/**
 * The preview frame once its document has stopped changing: no child-list
 * mutation for `quiet` ms (max `max` ms). The editor reloads and morphs the
 * preview several times after opening — prefs hydrate, the device switches,
 * sections re-render — and a frame that navigates mid-wait is picked up again
 * from the CP. Clicking before this is clicking on a page that is still moving.
 */
async function settledPreview(cp, quiet = 700, max = 12000) {
  const t0 = Date.now();
  let frame = null;
  let ms = 0;
  while (Date.now() - t0 < max) {
    const lpEl = await cp.$('#live-preview-iframe');
    frame = lpEl ? await lpEl.contentFrame() : null;
    if (!frame) { await sleep(200); continue; }
    try {
      ms = await frame.evaluate((q, m) => new Promise((res) => {
        let last = Date.now();
        const start = last;
        const obs = new MutationObserver(() => { last = Date.now(); });
        obs.observe(document.documentElement, { childList: true, subtree: true });
        const tick = () => { if (Date.now() - last >= q || Date.now() - start >= m) { obs.disconnect(); res(Date.now() - start); } else setTimeout(tick, 50); };
        tick();
      }), quiet, Math.max(500, max - (Date.now() - t0)));
      return { frame, waited: ms };
    } catch {
      await sleep(200); // the frame navigated (a reload); find it again
    }
  }
  return { frame, waited: Date.now() - t0 };
}
async function waitIn(frame, selector, ms) {
  try { await frame.waitForSelector(selector, { timeout: ms }); return true; } catch { return false; }
}

/**
 * The editor hydrates its layout (docks, device, zoom) from the user's
 * `sve_chrome` preferences on the server, and every run writes them back —
 * so run N+1 used to start in whatever state run N left, and the section click
 * landed in a different layout each time. The test account starts clean.
 */
const USER_FILE = `${SITE_DIR}/users/${USER}.yaml`;
function seedLayoutPrefs(prefs) {
  let yaml = readFileSync(USER_FILE, 'utf8');
  yaml = yaml.replace(/^  sve_chrome:\n(?:    .*\n)*/m, '');
  const entries = Object.entries(prefs || {});
  if (entries.length) {
    const block = `  sve_chrome:\n${entries.map(([k, v]) => `    ${k}: '${String(v).replace(/'/g, "''")}'\n`).join('')}`;
    yaml = /^preferences:\n/m.test(yaml) ? yaml.replace(/^preferences:\n/m, `preferences:\n${block}`) : `${yaml.replace(/\n*$/, '\n')}preferences:\n${block}`;
  }
  writeFileSync(USER_FILE, yaml);
}
const PREFS = process.env.SVE_PREFS ? JSON.parse(process.env.SVE_PREFS) : null;
seedLayoutPrefs(PREFS);
info('layout prefs', PREFS ? `starting from ${JSON.stringify(PREFS)}` : 'reset — default layout');

const browser = await puppeteer.launch({ headless: true, executablePath: CHROME, args: ['--window-size=1440,900'], defaultViewport: { width: 1440, height: 900 } });
const page = await browser.newPage();
page.on('pageerror', (e) => report.errors.push(`pageerror: ${e.message}${e.stack ? ' @ ' + String(e.stack).split('\n').slice(1, 3).join(' | ').trim() : ''}`));
page.on('console', (m) => { if (m.type() === 'error') report.errors.push(`console: ${m.text().slice(0, 200)}`); });
page.on('response', (r) => { if (r.status() >= 500) report.errors.push(`HTTP ${r.status()} ${r.request().method()} ${r.url().replace(SITE_URL, '').slice(0, 160)}`); });
// Every bundle file the browser asked for, by name — the CP loads addon.js from
// /vendor/visual-editor/build, the preview loads bridge.js + preview.js from
// /!/sve/build. Compared with the manifest at the end: a preview that loads a
// bridge the manifest does not name is running some other build.
const loadedAssets = new Set();
page.on('request', (req) => { const m = req.url().match(/\/(?:vendor\/visual-editor\/build|!\/sve\/build)\/assets\/([^?#]+)/); if (m) loadedAssets.add(m[1]); });

if (WORKTREE) {
  const served = await serveWorktreeBuild(page, { buildDir: env('SVE_BUILD_DIR', `${ADDON_DIR}/resources/dist/build`), installedManifest: `${SITE_DIR}/public/vendor/visual-editor/build/manifest.json`, scriptsDir: `${ADDON_DIR}/resources/js` });
  report.worktree = () => `${served()} build files served from the working tree`;
}

try {
  // 1. Login
  await page.goto(`${SITE_URL}/cp`, { waitUntil: 'networkidle2' }); // redirects to the login form
  await page.waitForSelector('input[name="email"]', { timeout: 15000 });
  await page.type('input[name="email"]', USER);
  await page.type('input[name="password"]', PASS);
  await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle2' }), page.keyboard.press('Enter')]);
  step('login', !/login/.test(page.url()), page.url());
  if (WORKTREE) console.log('info build served from', ADDON_DIR);

  // 2. Open the entry — the addon may take us straight to the preview-first overlay.
  await page.goto(`${SITE_URL}${ENTRY}`, { waitUntil: 'networkidle2' });
  await sleep(1500);
  let cp = page.mainFrame();
  const overlayEl = await page.$('iframe.sve-edit-overlay');
  if (overlayEl) {
    cp = await overlayEl.contentFrame();
    step('preview-first overlay present', !!cp);
  } else if (!(await page.$('#live-preview-iframe'))) {
    const clicked = await page.evaluate(() => {
      const btn = [...document.querySelectorAll('button, a')].find((el) => /live preview|forhåndsvisning/i.test(el.textContent || ''));
      if (btn) { btn.click(); return true; }
      return false;
    });
    step('clicked Live Preview button', clicked);
    // Live Preview opens as an overlay iframe that holds the whole CP again;
    // the preview itself is one more iframe inside it.
    // The overlay iframe exists parked off-screen (left: -12000px) while the CP
    // boots inside it; it is on screen only once it carries [data-open].
    const overlay = await waitIn(page, 'iframe.sve-edit-overlay[data-open]', 30000);
    step('preview overlay appeared and opened', overlay);
    if (overlay) {
      cp = await (await page.$('iframe.sve-edit-overlay')).contentFrame();
    }
  }
  await page.keyboard.press('Escape'); // a trial-licence dialog takes the first click otherwise

  // 3. The editor booted: toolbar + preview iframe.
  const toolbar = await waitIn(cp, '#__sve-toolbar button', 20000);
  step('toolbar built (#__sve-toolbar)', toolbar, toolbar ? `${await cp.$$eval('#__sve-toolbar button', (b) => b.length)} buttons` : 'missing');
  // The preview iframe is created, then navigated to the tokenised URL, and the
  // editor may re-wrap it while booting — so re-query it until a section shows.
  let preview = null;
  let hasSection = false;
  let lastErr = '';
  for (let i = 0; i < 25 && toolbar && !hasSection; i++) {
    const lpEl = await cp.$('#live-preview-iframe');
    preview = lpEl ? await lpEl.contentFrame() : null;
    hasSection = preview ? await preview.evaluate(() => !!document.querySelector('[id^="id-"]')).catch((e) => { lastErr = e.message; return false; }) : false;
    if (!hasSection) await sleep(1000);
  }
  step('preview iframe present', !!preview);
  const previewFacts = preview ? await preview.evaluate(() => `${location.pathname} sections=${document.querySelectorAll('section').length} id-sections=${document.querySelectorAll('[id^="id-"]').length} text=${(document.body?.innerText || '').length} viewport=${innerWidth}x${innerHeight}`).catch((e) => e.message) : 'no frame';
  const frameFacts = await cp.evaluate(() => { const el = document.getElementById('live-preview-iframe'); if (!el) return 'no #live-preview-iframe'; const r = el.getBoundingClientRect(); return `iframe ${Math.round(r.width)}x${Math.round(r.height)} class="${el.className}" ${[...el.attributes].filter((a) => /^data-/.test(a.name)).map((a) => `${a.name}=${a.value.slice(0, 16)}`).join(' ')} device=${localStorage.getItem('statamic.live-preview.device') || '-'}`; }).catch((e) => e.message);
  info('preview frame', frameFacts);
  step('a page section rendered in the preview', hasSection, `${previewFacts}${lastErr ? ' | $ error: ' + lastErr.slice(0, 120) : ''}`);

  // 3b. The side scripts (resources/js/side/, part of addon.js since WP6a)
  // each leave their run-once flag on the CP window — "no errors" alone would
  // not tell a script that never ran from one that did.
  const sideFlags = ['__sveIconifyHideRemove', '__sveIconButtonGroupIconify', '__sveResponsiveHideCustomLabel', '__sveGridKeepTable', '__sveGridCollapseGate', '__sveInserterReveal', '__sveToolbarLook', '__sveLibraryDropFocus', '__sveCollectionViewPicker', '__sveCollectionPresetScaffold', '__sveSectionMetaPrefetch', '__sveLiteRegistered'];
  const sideMissing = await cp.evaluate((flags) => flags.filter((f) => !window[f]), sideFlags);
  step('the side scripts ran (resources/js/side/)', sideMissing.length === 0, sideMissing.length ? 'did not run: ' + sideMissing.join(' ') : `${sideFlags.length} run-once flags set`);

  // 4. Click a section in the preview → the CP focuses it.
  if (hasSection) {
    // Spy on what the preview posts to the CP during the click (bridge → cp.js).
    await cp.evaluate(() => { window.__sveSmokeSeen = []; window.addEventListener('message', (e) => { if (e.data?.source === 'statamic-visual-editor') window.__sveSmokeSeen.push(`${e.data.type}${e.data.uid ? ':' + e.data.uid : ''}${e.data.field ? '/' + e.data.field : ''}`); }); });
    // SVE_DEBUG: which documents actually receive the mouse — the click is
    // computed from the preview's geometry, but lands wherever the browser's
    // hit-testing says; an overlay with pointer-events: none, a parked iframe
    // or a scaled preview all move it somewhere else.
    if (process.env.SVE_DEBUG) {
      for (const f of page.frames()) {
        await f.evaluate(() => {
          window.__sveSmokeEv = [];
          const tag = (e) => `${e.type}@${e.clientX},${e.clientY} on ${e.target?.tagName?.toLowerCase()}${e.target?.id ? '#' + e.target.id : ''}${e.target?.getAttribute?.('data-sid') ? ' sid=' + e.target.getAttribute('data-sid') : ''}`;
          for (const type of ['mousedown', 'click']) window.addEventListener(type, (e) => window.__sveSmokeEv.push(tag(e)), true);
        }).catch(() => {});
      }
    }
    // Aim at a field with text in it (a headline, a paragraph): that is what an
    // editor clicks to edit. The middle of a section is whatever happens to be
    // there — an image, the "+" inserter between blocks, or bare padding — and
    // each of those answers differently.
    const settled = await settledPreview(cp);
    if (settled.frame) preview = settled.frame;
    let hit = null;
    for (let attempt = 1; attempt <= 3 && !hit; attempt++) {
      try {
        hit = await realClick(page, preview, '[data-sid-field]:not(:empty)', (el) => (el.textContent || '').trim().length > 3);
      } catch (e) {
        if (attempt === 3 || !/no visible element/.test(e.message)) throw e;
        await sleep(700); // every text field was covered at that instant — a control or a morph in flight
      }
    }
    hit.under = `${hit.under} preview settled after ${settled.waited} ms`;
    await sleep(1500);
    if (process.env.SVE_DEBUG) {
      const got = [];
      const label = (f) => (f === page.mainFrame() ? 'top' : f === cp ? 'overlay' : f === preview ? 'preview' : f.url().replace(SITE_URL, '').slice(0, 40));
      for (const f of page.frames()) {
        const ev = await f.evaluate(() => window.__sveSmokeEv || []).catch(() => []);
        if (ev.length) got.push(`${label(f)}: ${ev.join(' | ')}`);
      }
      // What the overlay document has at the click point, top-most first, and
      // whether the preview iframe or one of its ancestors refuses the mouse.
      const stack = await cp.evaluate((x, y) => {
        const desc = (el) => `${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}${el.className && typeof el.className === 'string' ? '.' + el.className.split(' ').slice(0, 2).join('.') : ''}`;
        const chain = [];
        for (let el = document.getElementById('live-preview-iframe'); el && el !== document.documentElement; el = el.parentElement) {
          const cs = getComputedStyle(el);
          if (cs.pointerEvents === 'none' || cs.visibility === 'hidden' || cs.display === 'none' || cs.opacity === '0') chain.push(`${desc(el)}[pe=${cs.pointerEvents} vis=${cs.visibility} disp=${cs.display} op=${cs.opacity}]`);
        }
        return { at: document.elementsFromPoint(x, y).slice(0, 5).map(desc).join(' > '), refusing: chain.join(' ; ') || 'none' };
      }, hit.x, hit.y);
      console.log('DEBUG overlay hit stack at click:', stack.at, '| refusing the mouse:', stack.refusing);
      const overlays = await page.evaluate(() => [...document.querySelectorAll('iframe.sve-edit-overlay')].map((el) => `${el.hasAttribute('data-open') ? 'open' : 'closed'} ${JSON.stringify(el.getBoundingClientRect()).slice(0, 80)} pe=${getComputedStyle(el).pointerEvents}`));
      console.log('DEBUG mouse received by:', got.length ? got.join(' || ') : 'no frame');
      console.log('DEBUG overlays:', overlays.join(' ; '));
      console.log('DEBUG frames:', page.frames().map((f) => f.url().replace(SITE_URL, '').slice(0, 50)).join(' , '));
    }
    const messages = await cp.evaluate(() => window.__sveSmokeSeen || []);
    // A preview click reaches cp.js as a 'click' message; it opens the focus
    // panel for that block (data-sve-focus-*) and/or marks the set as active.
    const focused = await cp.evaluate(() => ({
      focusPanel: document.querySelectorAll('[data-sve-focus-id], [data-sve-focus-header], [data-sve-focus-title]').length,
      active: document.querySelectorAll('[data-sve-active], [data-sve-solo-parent], [data-sve-solo-keep]').length,
      title: document.querySelector('[data-sve-focus-title]')?.textContent?.trim().slice(0, 40) || '',
    }));
    // The click must reach the CP as a `click` message — that is the one thing
    // every click-to-focus feature hangs on. What the CP then shows (focus
    // panel, lite pane, solo) depends on the panel mode and is only recorded.
    step('preview click reaches the CP', messages.some((m) => /^click(?:[:/]|$)/.test(m)), `bridge sent [${messages.join(' ')}]; focus-panel=${focused.focusPanel} active=${focused.active}; clicked at ${hit.x},${hit.y} on ${hit.under}`);
    if (process.env.SVE_DEBUG) {
      // What the click did on each side — for when the assertion above needs re-thinking.
      const previewSide = await preview.evaluate((px, py) => {
        const at = document.elementFromPoint(px, py);
        return {
          at: at ? `${at.tagName.toLowerCase()}${at.id ? '#' + at.id : ''} sid=${at.closest('[data-sid]')?.getAttribute('data-sid') || '-'}` : 'nothing',
          sidActive: [...document.querySelectorAll('[data-sid-active], [data-sid-hover]')].map((e) => e.tagName.toLowerCase() + '#' + e.id).slice(0, 4),
        };
      }, hit.x - 491, hit.y - 52).catch((e) => e.message);
      const cpSide = await cp.evaluate(() => {
        const attrs = new Set();
        document.querySelectorAll('*').forEach((e) => { for (const a of e.attributes) if (/^data-sve-(lite|active|solo|focus|current)/.test(a.name)) attrs.add(a.name + (a.value ? '=' + a.value.slice(0, 12) : '')); });
        const left = document.querySelector('.live-preview-editor');
        return { attrs: [...attrs].slice(0, 25), leftText: (left?.innerText || '').replace(/\s+/g, ' ').slice(0, 160), lite: document.querySelectorAll('[data-sve-lite]').length };
      });
      const bridgeState = await preview.evaluate(() => ({ bridge: !!(window.__sveStrings || window.__sveFeatures), active: document.activeElement ? document.activeElement.tagName.toLowerCase() + (document.activeElement.isContentEditable ? '[editable]' : '') : '-', editable: document.querySelectorAll('[contenteditable="true"]').length, sids: document.querySelectorAll('[data-sid]').length }));
      console.log('DEBUG preview side:', JSON.stringify(previewSide), JSON.stringify(bridgeState));
      console.log('DEBUG cp side:', JSON.stringify(cpSide));
      await page.screenshot({ path: `${tmpdir()}/sve-after-section-click.png` });
    }
    await sleep(2000);
  }

  // 4b. Hovering a library card warms its set meta before any click
  // (side/section-meta-prefetch.js calling the library). The request is the
  // proof: a fresh session has nothing cached, so the first hover must fetch.
  if (toolbar && (await cp.$('#__sve-toolbar button[data-tab="sections"]'))) {
    const metaRequests = [];
    const spy = (req) => { if (/\/!\/sve\/section-meta\?/.test(req.url())) metaRequests.push(req.url().replace(SITE_URL, '').slice(0, 90)); };
    page.on('request', spy);
    await realClick(page, cp, '#__sve-toolbar button[data-tab="sections"]');
    const card = await waitIn(cp, '[data-sve-lib-handle]', 15000);
    if (card) {
      const r = await absoluteRect(cp, '[data-sve-lib-handle]');
      await page.mouse.move(r.x + r.w / 2, r.y + Math.min(r.h / 2, 60));
      await sleep(1200);
    }
    page.off('request', spy);
    step('hovering a library card prefetches its set meta', card && metaRequests.length > 0, card ? (metaRequests[0] || 'no section-meta request after hover') : 'no library card appeared');
    await realClick(page, cp, '#__sve-toolbar button[data-tab="sections"]'); // close it again
    await sleep(500);
  } else {
    step('library tab available', false, 'no button[data-tab="sections"]');
  }

  // 5. The code dock opens (lazy chunk).
  if (toolbar && (await cp.$('#__sve-toolbar button[data-tab="code"]'))) {
    // The toolbar is rebuilt on every preview render; a click that lands
    // during a rebuild is lost. One retry when the button did not toggle.
    let dock = false;
    let pressed = 'false';
    let hit = null;
    for (let attempt = 1; attempt <= 2 && !dock; attempt++) {
      hit = await realClick(page, cp, '#__sve-toolbar button[data-tab="code"]');
      await sleep(600);
      pressed = await cp.evaluate(() => document.querySelector('#__sve-toolbar button[data-tab="code"]')?.getAttribute('aria-pressed'));
      dock = pressed === 'true' ? await waitIn(cp, '#__sve-code-dock', 15000) : false;
      if (!dock) await sleep(2000);
    }
    step('code dock opened (#__sve-code-dock)', dock, `button aria-pressed=${pressed}; clicked at ${hit.x},${hit.y} on ${hit.under}`);
  } else {
    step('code dock button available', false, 'no button[data-tab="code"] — template_dock off for this user?');
  }

  await sleep(800);
} catch (e) {
  report.errors.push(`exception: ${e.message}`);
  report.ok = false;
} finally {
  await browser.close();
  await sleep(1500); // a debounced layout POST may still be landing on the server
  seedLayoutPrefs(null); // leave the test account as it was found: no saved layout
}

if (report.worktree) step('working-tree build was what the CP loaded', /^[1-9]/.test(report.worktree()), report.worktree());
{
  // Every build file the browser asked for must be one the manifest in use
  // names. The CP's HTML names the installed entries in both modes (the
  // working-tree harness answers those names with this checkout's files, so
  // its own manifest counts too). A name outside that is a stale chunk
  // something loads by hand — a second copy of the editor running beside it.
  const files = (manifest) => Object.values(manifest).flatMap((e) => [e.file, ...(e.css || []), ...(e.assets || [])]).map((f) => f.replace(/^assets\//, ''));
  const installed = JSON.parse(readFileSync(`${SITE_DIR}/public/vendor/visual-editor/build/manifest.json`, 'utf8'));
  const entries = Object.values(installed).filter((e) => e.isEntry).map((e) => e.file.replace(/^assets\//, ''));
  const allowed = new Set(files(installed));
  if (WORKTREE) for (const f of files(JSON.parse(readFileSync(`${env('SVE_BUILD_DIR', `${ADDON_DIR}/resources/dist/build`)}/manifest.json`, 'utf8')))) allowed.add(f);
  const missing = entries.filter((f) => !loadedAssets.has(f));
  const strays = [...loadedAssets].filter((f) => !allowed.has(f));
  step('every build file the browser loaded is one the manifest names', missing.length === 0 && strays.length === 0,
    `${loadedAssets.size} files; entries ${entries.join(' ')}${missing.length ? ' | entry not loaded: ' + missing.join(' ') : ''}${strays.length ? ' | not in the manifest: ' + strays.join(' ') : ''}`);
}
const realErrors = report.errors.filter((e) => !/favicon|net::ERR_ABORTED|the server responded with a status of 4/i.test(e));
step('no JavaScript errors', realErrors.length === 0, realErrors.slice(0, 5).join(' | '));
console.log(JSON.stringify({ ok: report.ok, errors: realErrors }, null, 0));
process.exit(report.ok ? 0 : 1);
