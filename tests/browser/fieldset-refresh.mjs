#!/usr/bin/env node
/**
 * A field added to a section's fieldset shows in the left panel — on Save,
 * and on a Close that follows Save at once.
 *
 * The owner's way of making a section, done for real: the HTML tree's plus →
 * "with fields" → name → Create; the new row clicked in the tree; the file
 * unlocked in the dock; the fields icon on the section's root row; then
 * Statamic's own Fieldsets screen inside the overlay — Create Field → Text →
 * a display name → the field's Save → the page's Save. Measured after each
 * step: does the section's pane beside the preview carry the new field?
 *
 *   Save, overlay still open   → the field is there (the save hook; dead on
 *                                Statamic 6 until fieldset-save.js)
 *   Close, SVE_CLOSE_GAP ms
 *   after Save                 → the field is there (Close waits on the save)
 *   a click on the section in
 *   the preview, the reload
 *   button                     → still there
 *
 * The section type made for the run is deleted again at the end; the entry
 * is never saved. Layout saves (/!/sve/chrome-prefs) are answered here, so the
 * account's panels are left as they were.
 *
 *   cd ~/Sites/vizuall-skabelon && SVE_PASS='…' npm --prefix ~/Sites/statamic-addon-visual-editor-vue run test:fieldset
 *
 * SVE_WORKTREE=1 serves the working tree's build in place of the installed
 * one (SVE_INSTALLED_MANIFEST names the installed manifest when the site is
 * remote). Same env vars as live-preview-smoke.mjs otherwise.
 */
import { createRequire } from 'node:module';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { serveWorktreeBuild } from './serve-worktree.mjs';

const env = (key, fallback) => process.env[key] || fallback;
const SITE_DIR = env('SVE_SITE_DIR', `${process.env.HOME}/Sites/vizuall-skabelon`);
const ADDON_DIR = env('SVE_ADDON_DIR', `${process.env.HOME}/Sites/statamic-addon-visual-editor-vue`);
const SITE_URL = env('SVE_SITE_URL', 'http://vizuall-skabelon.test');
const USER = env('SVE_USER', 'claude-test@vizuall.dk');
const PASS = env('SVE_PASS', '');
const ENTRY = env('SVE_ENTRY', '/cp/collections/pages/entries/827310c8-9f8b-4c10-a157-634a0d0f82d5');
const CHROME = env('SVE_CHROME', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome');
/** How soon after the page's Save the overlay is closed. */
const CLOSE_GAP = Number(env('SVE_CLOSE_GAP', '120'));
const DEBUG = env('SVE_DEBUG', '');
const WORKTREE = env('SVE_WORKTREE', '') === '1';

const puppeteer = createRequire(`${SITE_DIR}/package.json`)('puppeteer');

// A local test account starts with a clean layout; a remote one is left alone
// (its layout saves are answered below and never reach it).
const USER_FILE = `${SITE_DIR}/users/${USER}.yaml`;
if (existsSync(USER_FILE) && /vizuall-skabelon\.test/.test(SITE_URL)) {
  writeFileSync(USER_FILE, readFileSync(USER_FILE, 'utf8').replace(/^  sve_chrome:\n(?:    .*\n)*/m, ''));
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const t0 = Date.now();
const at = () => `${String(Date.now() - t0).padStart(6)}ms`;
const log = (...a) => console.log(at(), ...a);
const report = { ok: true };
const step = (name, ok, detail = '') => { if (!ok) report.ok = false; console.log(`${ok ? 'ok  ' : 'FAIL'} ${name}${detail ? ' — ' + detail : ''}`); };
const waitIn = async (frame, sel, ms) => { try { await frame.waitForSelector(sel, { timeout: ms }); return true; } catch { return false; } };

const blockPrefsWrite = (req) => {
  if (req.method() === 'GET' || !req.url().includes('/!/sve/chrome-prefs')) {
    return false;
  }

  req.respond({ status: 200, contentType: 'application/json', body: '{"ok":true}' });

  return true;
};

const browser = await puppeteer.launch({ headless: true, executablePath: CHROME, args: ['--window-size=1600,1000'], defaultViewport: { width: 1600, height: 1000 } });
const page = await browser.newPage();
const errors = [];
const requests = [];
page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
page.on('console', (m) => { if (m.type() === 'error' && !/40[19]|409/.test(m.text())) errors.push(`console: ${m.text().slice(0, 200)}`); });
page.on('request', (r) => {
  const u = r.url().replace(SITE_URL, '');
  if (/section-meta|section-types|fields\/fieldsets/i.test(u) && !/\.(js|css|png|svg|woff2?)(\?|$)/.test(u)) requests.push(`${at()} ${r.method()} ${u.slice(0, 140)}`);
});
let made = null;
page.on('response', async (r) => {
  if (r.request().method() === 'POST' && /\/!\/sve\/section-types/.test(r.url())) {
    try { made = (await r.json())?.section || null; } catch { /* not ours */ }
  }
});

if (WORKTREE) {
  await serveWorktreeBuild(page, {
    buildDir: env('SVE_BUILD_DIR', `${ADDON_DIR}/resources/dist/build`),
    installedManifest: env('SVE_INSTALLED_MANIFEST', `${SITE_DIR}/public/vendor/visual-editor/build/manifest.json`),
    scriptsDir: `${ADDON_DIR}/resources/js`,
    extra: blockPrefsWrite,
  });
  log('worktree build served');
} else {
  await page.setRequestInterception(true);
  page.on('request', (req) => blockPrefsWrite(req) || req.continue());
}

/** A real mouse click on the first visible match inside the editor's frame. */
const clickIn = async (frame, selector, accept = null) => {
  const src = accept ? accept.toString() : null;
  const box = await frame.evaluate((sel, acceptSrc) => { const acc = acceptSrc ? new Function(`return (${acceptSrc})`)() : null; const el = [...document.querySelectorAll(sel)].find((c) => (!acc || acc(c)) && c.getBoundingClientRect().width > 0); if (!el) return null; el.scrollIntoView({ block: 'center', behavior: 'instant' }); const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }, selector, src);
  if (!box) return false;
  const frameEl = await page.$('iframe.sve-edit-overlay');
  const fr = frameEl ? await frameEl.boundingBox() : { x: 0, y: 0 };
  await page.mouse.click(fr.x + box.x, fr.y + box.y);
  return true;
};

/** The section panes beside the preview: what each shows, seen and unseen. */
const paneFacts = (frame) => frame.evaluate(() => {
  const out = { lite: document.querySelector('[data-sve-lite]')?.getAttribute('data-sve-lite') || '(none)', sets: [] };
  for (const pane of document.querySelectorAll('[data-sve-lite-pane]')) {
    for (const s of pane.querySelectorAll('[data-replicator-set], .replicator-set, .sve-lite-item')) {
      const r = s.getBoundingClientRect();
      out.sets.push({ role: pane.getAttribute('data-sve-lite-pane'), visible: r.width > 0 && r.height > 0, text: (s.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 160), textContent: (s.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 160), labels: [...s.querySelectorAll('label')].map((l) => (l.textContent || '').trim()).filter(Boolean).slice(0, 12) });
    }
  }
  return out;
});
const shows = (facts) => facts.sets.some((s) => s.visible && /Probefelt/.test(s.text));

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
  const overlayEl = await page.$('iframe.sve-edit-overlay');
  if (overlayEl) {
    cp = await overlayEl.contentFrame();
  } else {
    await page.evaluate(() => { const btn = [...document.querySelectorAll('button, a')].find((el) => /live preview|forhåndsvisning/i.test(el.textContent || '')); btn?.click(); });
    const overlay = await waitIn(page, 'iframe.sve-edit-overlay[data-open]', 30000);
    step('preview overlay opened', overlay);
    if (overlay) cp = await (await page.$('iframe.sve-edit-overlay')).contentFrame();
  }
  await page.keyboard.press('Escape');
  step('toolbar built', await waitIn(cp, '#__sve-toolbar button', 20000));
  await sleep(3000);

  // The dock and the HTML tree, and its plus.
  step('clicked the dock icon', await clickIn(cp, '#__sve-toolbar button[data-tab="code"]'));
  let plus = await waitIn(cp, 'button.sve-ht-new', 8000);
  if (!plus) { await clickIn(cp, '#__sve-toolbar button[data-tab="code"]'); plus = await waitIn(cp, 'button.sve-ht-new', 8000); }
  step('HTML tree opened (plus visible)', plus);
  await clickIn(cp, 'button.sve-ht-new');

  // Which kind? With fields. Then the name, and Create.
  let picked = false;
  for (let i = 0; i < 20 && !picked; i++) {
    picked = await cp.evaluate(() => { const b = [...document.querySelectorAll('button')].filter((el) => el.getBoundingClientRect().width > 0).find((el) => /felter|fields/i.test((el.textContent || '').trim()) && !/static|statisk/i.test(el.textContent || '')); if (b) { b.click(); return true; } return false; });
    if (!picked) await sleep(250);
  }
  step('dialog: "with fields" picked', picked);
  await sleep(800);
  let typed = false;
  for (let i = 0; i < 20 && !typed; i++) {
    typed = await cp.evaluate(() => { const inputs = [...document.querySelectorAll('input[type="text"], input:not([type])')].filter((el) => el.getBoundingClientRect().width > 0); const el = inputs[inputs.length - 1]; if (!el) return false; el.focus(); return true; });
    if (!typed) await sleep(250);
  }
  step('dialog: name field focused', typed);
  await page.keyboard.type('Probe felter ' + Math.random().toString(36).slice(2, 6));
  await sleep(300);
  step('dialog: Create clicked', await cp.evaluate(() => { const b = [...document.querySelectorAll('button')].find((el) => /^(create|opret)$/i.test((el.textContent || '').trim())); if (b) { b.click(); return true; } return false; }));
  for (let i = 0; i < 40 && !made; i++) await sleep(250);
  step('section type made', !!made, made ? `${made.handle} → ${made.fieldset}` : '');
  if (!made) throw new Error('no section made');
  await sleep(4000);
  await cp.evaluate(() => { document.querySelector('.sve-fs-overlay button[aria-label]')?.click(); });
  await sleep(1500);

  // "Then I go in": the new section's row in the tree.
  const rowBox = await cp.evaluate((name) => {
    const list = document.querySelector('[data-sve-html-tree-list]') || document;
    const el = [...list.querySelectorAll('*')].filter((e) => e.children.length < 6 && (e.textContent || '').includes(name) && e.getBoundingClientRect().width > 0).sort((a, b) => a.getBoundingClientRect().width - b.getBoundingClientRect().width)[0];
    if (!el) return null;
    el.scrollIntoView({ block: 'center', behavior: 'instant' });
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }, made.display);
  if (rowBox) { const fr = await (await page.$('iframe.sve-edit-overlay')).boundingBox(); await page.mouse.click(fr.x + rowBox.x, fr.y + rowBox.y); }
  step('clicked the new section in the tree', !!rowBox);
  await sleep(2500);
  const before = await paneFacts(cp);
  step('the panel shows the new section, without the field yet', before.sets.some((s) => s.textContent.includes(made.display)) && !shows(before));

  // Unlock the file in the dock (the fields icon is locked with it).
  step('clicked the dock lock', await clickIn(cp, '#__sve-code-dock [data-sve-code-lock]'));
  await sleep(800);
  await cp.evaluate(() => { [...document.querySelectorAll('button')].filter((el) => el.getBoundingClientRect().width > 0).find((el) => /^(lås op|unlock)$/i.test((el.textContent || '').trim()))?.click(); });
  await sleep(1500);
  step('fields icon enabled', await cp.evaluate(() => { const b = document.querySelector('[data-sve-ht-fields]'); return !!b && !b.disabled; }));
  step('clicked the fields icon', await clickIn(cp, '[data-sve-ht-fields]'));
  step('fieldset overlay opened', await waitIn(cp, '.sve-fs-overlay iframe', 10000));
  await sleep(5000);

  // Statamic's own Fieldsets screen, driven the way a person does it.
  const fsFrameEl = await cp.$('.sve-fs-overlay iframe');
  const fs = fsFrameEl ? await fsFrameEl.contentFrame() : null;
  const fsBox = fsFrameEl ? await fsFrameEl.boundingBox() : { x: 0, y: 0 };
  const ovBox = await (await page.$('iframe.sve-edit-overlay')).boundingBox();
  step('fieldset frame reachable', !!fs);
  const fsClick = async (re, which = 'first') => {
    const box = await fs.evaluate((src, pick) => { const re = new RegExp(src, 'i'); const els = [...document.querySelectorAll('button, a, [role="menuitem"]')].filter((b) => b.getBoundingClientRect().width > 0 && re.test((b.textContent || b.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim())); const el = pick === 'last' ? els[els.length - 1] : els[0]; if (!el) return null; el.scrollIntoView({ block: 'center', behavior: 'instant' }); const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }, re, which);
    if (!box) return false;
    await page.mouse.click(ovBox.x + fsBox.x + box.x, ovBox.y + fsBox.y + box.y);
    return true;
  };
  // A site running Pro without a licence shows a Licensing Alert over the screen.
  await fsClick('^snooze$');
  await sleep(800);
  step('Create Field clicked', await fsClick('^(create field|opret felt)$'));
  await sleep(2000);
  const textType = await fs.evaluate(() => { const el = [...document.querySelectorAll('button')].find((b) => b.getBoundingClientRect().width > 0 && /^text$/i.test((b.textContent || '').trim())); if (!el) return null; el.scrollIntoView({ block: 'center', behavior: 'instant' }); const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
  step('Text fieldtype picked', !!textType);
  if (textType) await page.mouse.click(ovBox.x + fsBox.x + textType.x, ovBox.y + fsBox.y + textType.y);
  await sleep(2000);
  const focused = await fs.evaluate(() => { const el = document.querySelector('#field_display, input[name="display"]'); if (!el) return false; el.focus(); el.select?.(); return true; });
  step('display name focused', focused);
  await page.keyboard.down('Meta'); await page.keyboard.press('a'); await page.keyboard.up('Meta');
  await page.keyboard.type('Probefelt');
  await sleep(800);
  // The field's own Save is the last "Save" on screen; the page's is the first.
  step("the field's Save clicked", await fsClick('^(save|gem)$', 'last'));
  await sleep(2000);
  step('the field is listed on the screen', await fs.evaluate(() => /Probefelt/.test(document.body.textContent || '')));
  if (DEBUG) await page.screenshot({ path: `${DEBUG}/fieldset-before-save.png` });

  requests.length = 0;
  step("the page's Save clicked", await fsClick('^(save|gem)$', 'first'));
  await sleep(4000);
  step('the fieldset was saved (PATCH)', requests.some((r) => /PATCH .*fields\/fieldsets/.test(r)), requests.join(' ; '));
  const afterSave = await paneFacts(cp);
  step('after Save, overlay still open: the panel SHOWS the new field', shows(afterSave), afterSave.sets.map((s) => s.labels.join('/')).join(' | '));
  if (DEBUG) await page.screenshot({ path: `${DEBUG}/fieldset-after-save.png` });

  // Save again and close right behind it: Close has to wait for the save.
  requests.length = 0;
  step("the page's Save clicked again", await fsClick('^(save|gem)$', 'first'));
  await sleep(CLOSE_GAP);
  step(`overlay closed ${CLOSE_GAP} ms after Save`, await cp.evaluate(() => { const b = document.querySelector('.sve-fs-overlay button[aria-label]'); if (b) { b.click(); return true; } return false; }));
  await sleep(4000);
  const afterClose = await paneFacts(cp);
  step('after Close: the panel SHOWS the new field', shows(afterClose), afterClose.sets.map((s) => s.labels.join('/')).join(' | '));
  const order = requests.map((r) => r.replace(/^\s*\d+ms /, '').split(' ')[0] + ' ' + (r.match(/fieldsets|section-meta|section-types/) || [''])[0]);
  log('requests, Save then Close:', order.join(' → '));

  // A click on the section in the preview, and the reload button.
  const lpEl = await cp.$('#live-preview-iframe');
  const preview = lpEl ? await lpEl.contentFrame() : null;
  const lpBox = lpEl ? await lpEl.boundingBox() : null;
  const target = preview ? await preview.evaluate(() => { const els = [...document.querySelectorAll('section[id^="id-"]')].filter((el) => el.getBoundingClientRect().width > 0); const el = els[els.length - 1]; if (!el) return null; el.scrollIntoView({ block: 'center', behavior: 'instant' }); const r = el.getBoundingClientRect(); return { x: r.left + Math.min(r.width / 2, 200), y: r.top + Math.min(r.height / 2, 30) }; }) : null;
  if (target && lpBox) { await page.mouse.click(ovBox.x + lpBox.x + target.x, ovBox.y + lpBox.y + target.y); await sleep(3000); }
  step('after a click on the section in the preview: still shown', !!target && shows(await paneFacts(cp)));
  // Shift: the in-place refresh. A plain click is a real load and replaces the
  // document this test is reading.
  await page.keyboard.down('Shift');
  step('shift-clicked the reload button', await clickIn(cp, '#__sve-lp-reload'));
  await page.keyboard.up('Shift');
  await sleep(6000);
  step('after the in-place refresh: still shown', shows(await paneFacts(cp)));

  if (errors.length) { console.log('--- errors ---'); for (const e of errors) console.log(' ', e); }
} catch (e) {
  report.ok = false;
  console.log('ERROR', e.message);
} finally {
  const cpFrame = (await page.$('iframe.sve-edit-overlay')) ? await (await page.$('iframe.sve-edit-overlay')).contentFrame() : page.mainFrame();
  if (made?.handle) {
    const del = await cpFrame.evaluate(async (handle) => {
      const token = window.Statamic?.$config?.get?.('csrfToken') || document.querySelector('meta[name="csrf-token"]')?.content || '';
      const res = await fetch(`/!/sve/section-types?handle=${encodeURIComponent(handle)}`, { method: 'DELETE', credentials: 'same-origin', headers: { 'X-CSRF-TOKEN': token, 'X-Requested-With': 'XMLHttpRequest', Accept: 'application/json' } });
      return `${res.status}`;
    }, made.handle).catch((e) => e.message);
    console.log(`cleanup: deleted section type ${made.handle} → HTTP ${del}`);
  }
  await browser.close();
  console.log(report.ok ? 'ALL OK' : 'FAILED');
  process.exit(report.ok ? 0 : 1);
}
