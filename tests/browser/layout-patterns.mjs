/**
 * Patterns on the layout: the tabs are the layout's places (Headers, Footers,
 * Sections), the layout holds one header and one footer, the other headers
 * stay in the list greyed until the current one is deleted, and a drop lands
 * in its place — no aiming. On a page the panel is the page builder's again.
 *
 * WRITES the site's header, footer and layout globals. The three files are
 * copied first and put back at the end, but run it against a copy of the site
 * (SVE_SITE_DIR + SVE_SITE_URL), never the one someone works in.
 *
 * Env (as patterns-card-click.mjs): SVE_SITE_DIR, SVE_SITE_URL, SVE_USER,
 * SVE_PASS, SVE_PAGE (a page entry's CP path), SVE_CHROME, SVE_HEADFUL=1.
 */
import { createRequire } from 'node:module';
import { copyFileSync, existsSync, readdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';

const env = (k, d) => (process.env[k] === undefined || process.env[k] === '' ? d : process.env[k]);
const SITE_DIR = env('SVE_SITE_DIR', `${homedir()}/Sites/vizuall-skabelon`);
const SITE_URL = env('SVE_SITE_URL', 'http://vizuall-skabelon.test');
const USER = env('SVE_USER', 'claude-test@vizuall.dk');
const PASS = env('SVE_PASS', '');
// A page drawn with the layout ("Test ny" on the kit), for the page-builder check.
const pageFile = `${SITE_DIR}/content/collections/pages/test-ny.md`;
const PAGE = env('SVE_PAGE', existsSync(pageFile) ? `/cp/collections/pages/entries/${readFileSync(pageFile, 'utf8').match(/^id:\s*(\S+)/m)?.[1]}` : '');
const CHROME = env('SVE_CHROME', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome');
const HEADLESS = env('SVE_HEADFUL', '') !== '1';

const require = createRequire(`${SITE_DIR}/package.json`);
const puppeteer = require('puppeteer');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const report = { ok: true, errors: [] };
const step = (name, ok, detail = '') => { if (!ok) report.ok = false; console.log(`${ok ? 'ok ' : 'FAIL'} ${name}${detail ? ' — ' + detail : ''}`); };
const info = (name, detail = '') => console.log(`info ${name} — ${detail}`);
async function until(fn, ms, every = 100) { const t0 = Date.now(); while (Date.now() - t0 < ms) { const v = await fn(); if (v) return v; await sleep(every); } return null; }

// The layout's own template entry: the one whose view is `layout`.
const templatesDir = `${SITE_DIR}/content/collections/templates`;
const layoutFile = readdirSync(templatesDir).find((f) => /^view:\s*'?layout'?\s*$/m.test(readFileSync(`${templatesDir}/${f}`, 'utf8')));
const layoutId = layoutFile && readFileSync(`${templatesDir}/${layoutFile}`, 'utf8').match(/^id:\s*(\S+)/m)?.[1];
const LAYOUT = `/cp/collections/templates/entries/${layoutId}`;

// What the test writes, kept aside and put back.
const GLOBALS = ['site_head', 'site_foot', 'site_layout'].map((h) => `${SITE_DIR}/content/globals/default/${h}.yaml`);
const kept = GLOBALS.map((file) => (existsSync(file) ? (copyFileSync(file, `${file}.layout-test`), file) : null));
const restore = () => {
  kept.forEach((file) => { if (file) { copyFileSync(`${file}.layout-test`, file); unlinkSync(`${file}.layout-test`); } });
};

// The test account starts from the default layout (the editor writes its prefs back on every run).
const USER_FILE = `${SITE_DIR}/users/${USER}.yaml`;
if (existsSync(USER_FILE)) {
  writeFileSync(USER_FILE, readFileSync(USER_FILE, 'utf8').replace(/^  sve_chrome:\n(?:    .*\n)*/m, ''));
}

const browser = await puppeteer.launch({ headless: HEADLESS, executablePath: CHROME, args: ['--window-size=1440,900'], defaultViewport: { width: 1440, height: 900 } });
const page = await browser.newPage();
page.on('pageerror', (e) => report.errors.push(`pageerror: ${e.message}`));
// A 4xx shows up twice — as the response (logged with its URL below) and as
// Chrome's "Failed to load resource" line; only the response says whose it is.
page.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) report.errors.push(`console: ${m.text().slice(0, 200)}`); });
page.on('response', (r) => {
  if (r.status() >= 500) report.errors.push(`HTTP ${r.status()} ${r.url().replace(SITE_URL, '').slice(0, 120)}`);
  else if (r.status() >= 400) info(`HTTP ${r.status()}`, `${r.request().method()} ${r.url().replace(SITE_URL, '').slice(0, 140)}`);
});

const openInLivePreview = async (path) => {
  await page.goto(`${SITE_URL}${path}`, { waitUntil: 'networkidle2' });
  await sleep(1500);
  let overlayEl = await page.$('iframe.sve-edit-overlay');

  if (!overlayEl) {
    await page.evaluate(() => { const btn = [...document.querySelectorAll('button, a')].find((el) => /live preview|forhåndsvisning/i.test(el.textContent || '')); btn?.click(); });
    await page.waitForSelector('iframe.sve-edit-overlay[data-open]', { timeout: 30000 }).catch(() => {});
    overlayEl = await page.$('iframe.sve-edit-overlay');
  }

  const cp = overlayEl ? await overlayEl.contentFrame() : page.mainFrame();

  await cp.evaluate(() => { const b = [...document.querySelectorAll('button')].find((el) => /snooze/i.test(el.textContent || '')); b?.click(); });
  await cp.waitForSelector('#__sve-toolbar button', { timeout: 20000 }).catch(() => {});

  return { cp, overlayEl };
};

try {
  step('layout template entry found', !!layoutId, LAYOUT);

  await page.goto(`${SITE_URL}/cp`, { waitUntil: 'networkidle2' });
  await page.waitForSelector('input[name="email"]', { timeout: 15000 });
  await page.type('input[name="email"]', USER);
  await page.type('input[name="password"]', PASS);
  await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle2' }), page.keyboard.press('Enter')]);
  step('login', !/login/.test(page.url()), page.url());

  const { cp } = await openInLivePreview(LAYOUT);
  const s = (key) => cp.evaluate((k) => window.Statamic?.$config?.get?.('sveStrings')?.[k] ?? k, key);
  const inPreview = (fn, arg) => cp.evaluate((src, a) => {
    const doc = document.getElementById('live-preview-iframe')?.contentDocument;
    return doc ? new Function('doc', 'a', `return (${src})(doc, a)`)(doc, a) : null;
  }, fn.toString(), arg);
  const header = () => inPreview((doc) => { const el = doc.querySelector('header[data-sve-chrome="header"]'); return el ? { topbar: !!el.querySelector('.topbar'), html: el.innerHTML.trim().length } : null; });
  const footer = () => inPreview((doc) => { const el = doc.querySelector('footer[data-sve-chrome="footer"]'); return el ? { text: el.textContent.trim().length } : null; });

  step('preview drew the layout\'s header', !!(await until(header, 30000, 500)));

  // --- Patterns on the layout ----------------------------------------------------
  await cp.evaluate(() => document.querySelector('#__sve-toolbar button[data-tab="sections"]')?.click());
  const cards = () => cp.evaluate(() => [...document.querySelectorAll('#__sve-section-picker [data-sve-lib-kind]')].map((el) => ({
    kind: el.getAttribute('data-sve-lib-kind'),
    title: el.querySelector('[data-sve-card-title]')?.textContent.trim(),
    inUse: !!el.querySelector('[data-sve-card-in-use]'),
    blocked: !!el.querySelector('[data-sve-card-disabled]'),
    note: el.querySelector('.sve-lib-card__note')?.textContent.trim() || '',
  })));
  await until(async () => (await cards()).length > 0, 15000, 250);

  const tabs = await cp.evaluate(() => [...document.querySelectorAll('#__sve-section-picker [data-sve-tabs] button')].map((b) => b.textContent.trim()));
  const want = [await s('layout_tab_header'), await s('layout_tab_footer'), await s('layout_tab_sections')];
  step('the layout\'s tabs, and only those', JSON.stringify(tabs) === JSON.stringify(want), JSON.stringify(tabs));
  const hint = await cp.evaluate(() => document.querySelector('#__sve-section-picker [data-sve-hint]')?.textContent.trim());
  step('the hint is the layout\'s', hint === (await s('layout_hint')), hint);

  let list = await cards();
  step('every card is a layout card', list.every((c) => c.kind === 'layout'), JSON.stringify(list.map((c) => c.kind)));
  const style1 = list.find((c) => c.title === 'Header style 1');
  const custom = list.find((c) => c.title === 'Custom header');
  step('the header in use says so', !!style1?.inUse, JSON.stringify(style1));
  step('the other header stays in the list, greyed, saying the current one goes first', !!custom?.blocked && custom.note === (await s('layout_header_taken')), JSON.stringify(custom));

  // --- pointer driver: PointerEvents in the CP document (the CP's mouse is dead headless) ---
  const dispatch = (type, p, buttons) => cp.evaluate((t, x, y, b) => {
    const target = document.elementFromPoint(x, y) || document.documentElement;
    target.dispatchEvent(new PointerEvent(t, { bubbles: true, cancelable: true, composed: true, clientX: x, clientY: y, button: 0, buttons: b, pointerId: 1, pointerType: 'mouse', isPrimary: true, view: window }));
  }, type, p.x, p.y, buttons);
  const cardPoint = (title) => cp.evaluate((tt) => {
    const el = [...document.querySelectorAll('#__sve-section-picker [data-sve-lib-kind]')].find((c) => c.querySelector('[data-sve-card-title]')?.textContent.trim() === tt);
    if (!el) return null;
    el.scrollIntoView({ block: 'center' });
    const r = el.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + Math.min(r.height / 2, 40) };
  }, title);
  const previewPoint = () => cp.evaluate(() => { const r = document.getElementById('live-preview-iframe').getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
  const dropLabel = await s('layout_drop_here');
  const removeLabel = await s('layout_remove_confirm');
  const outlineShown = () => cp.evaluate((label) => [...document.body.children].some((el) => el.style.position === 'fixed' && el.style.display === 'flex' && el.textContent === label), dropLabel);
  let writes = 0;
  page.on('request', (r) => { if (/\/!\/sve\/layout-slots/.test(r.url()) && r.method() !== 'GET') writes++; });

  const drag = async (title) => {
    const c = await cardPoint(title);
    const p = await previewPoint();
    await dispatch('pointerdown', c, 1);
    await dispatch('pointermove', { x: c.x + 30, y: c.y + 4 }, 1);
    await dispatch('pointermove', { x: (c.x + p.x) / 2, y: p.y }, 1);
    await dispatch('pointermove', p, 1);
    await sleep(150);
    const outline = await outlineShown();
    await dispatch('pointerup', p, 0);
    return outline;
  };

  // A greyed card does not drag.
  writes = 0;
  await drag('Custom header');
  await sleep(1200);
  step('dragging a greyed header writes nothing and changes nothing', writes === 0 && !!(await header())?.topbar, `writes ${writes}`);

  // Delete the header in use.
  const clickTrash = (title) => cp.evaluate((tt) => {
    const el = [...document.querySelectorAll('#__sve-section-picker [data-sve-lib-kind]')].find((c) => c.querySelector('[data-sve-card-title]')?.textContent.trim() === tt);
    el?.querySelector('.sve-lib-card__del')?.click();
    return !!el?.querySelector('.sve-lib-card__del');
  }, title);
  const confirmDialog = (label) => cp.evaluate((l) => { const b = [...document.querySelectorAll('.sve-dialog button')].find((el) => el.textContent.trim() === l); b?.click(); return !!b; }, label);

  step('the header in use has a trash', await clickTrash('Header style 1'));
  step('deleting asks first', await until(() => confirmDialog(removeLabel), 3000, 100) !== null);
  const gone = await until(async () => (await header()) === null, 10000, 250);
  step('after delete the preview has no header', !!gone);
  list = await until(async () => { const l = await cards(); return l.length && l.every((c) => !c.inUse && !c.blocked) ? l : null; }, 5000, 200);
  step('after delete every header can be dragged in', !!list, JSON.stringify(await cards()));
  step('the global set holds no header', !/^\s+type: header\//m.test(readFileSync(GLOBALS[0], 'utf8')));

  // Drag the empty one in.
  const outline = await drag('Custom header');
  step('over the preview the drop area is outlined', outline);
  const empty = await until(async () => { const h = await header(); return h && !h.topbar ? h : null; }, 10000, 250);
  step('Custom header is drawn: an empty header, no topbar', !!empty, JSON.stringify(await header()));
  list = await cards();
  step('Custom header in use, Header style 1 greyed', !!list.find((c) => c.title === 'Custom header')?.inUse && !!list.find((c) => c.title === 'Header style 1')?.blocked, JSON.stringify(list));
  step('saved on the global set', /type: header\/custom/.test(readFileSync(GLOBALS[0], 'utf8')));
  const dockFile = await cp.evaluate(() => window.Statamic?.$config?.get?.('sveChromeTemplates')?.header?.type);
  step('the dock opens the custom header\'s partial when you step into the header', dockFile === 'header/custom', dockFile);

  // --- Footers -----------------------------------------------------------------------
  await cp.evaluate((label) => [...document.querySelectorAll('#__sve-section-picker [data-sve-tabs] button')].find((b) => b.textContent.trim() === label)?.click(), want[1]);
  await sleep(500);
  list = await cards();
  step('Footers: Footer style 1 in use, Custom footer greyed', !!list.find((c) => c.title === 'Footer style 1')?.inUse && !!list.find((c) => c.title === 'Custom footer')?.blocked, JSON.stringify(list));
  await clickTrash('Footer style 1');
  await until(() => confirmDialog(removeLabel), 3000, 100);
  step('after delete the preview has no footer', !!(await until(async () => (await footer()) === null, 10000, 250)));
  await drag('Custom footer');
  step('Custom footer is drawn: an empty footer', !!(await until(async () => { const f = await footer(); return f && f.text === 0 ? f : null; }, 10000, 250)), JSON.stringify(await footer()));

  // --- Sections ----------------------------------------------------------------------
  await cp.evaluate((label) => [...document.querySelectorAll('#__sve-section-picker [data-sve-tabs] button')].find((b) => b.textContent.trim() === label)?.click(), want[2]);
  list = await until(async () => { const l = await cards(); return l.length ? l : null; }, 8000, 250);
  info('global sections offered', JSON.stringify((list || []).map((c) => c.title)));

  if (list?.length) {
    const roots = () => inPreview((doc) => doc.querySelectorAll('[data-sve-global-root]').length);
    const before = await roots();
    await drag(list[0].title);
    const after = await until(async () => { const n = await roots(); return n > before ? n : null; }, 10000, 250);
    step('a global section dragged in is drawn under the page content', !!after, `${before} → ${await roots()}`);
    const underMain = await inPreview((doc) => { const main = doc.querySelector('main'); const root = doc.querySelector('[data-sve-global-root]'); return !!(main && root && (main.compareDocumentPosition(root) & Node.DOCUMENT_POSITION_FOLLOWING) && !main.contains(root)); });
    step('…after <main>, not in it', underMain);
    list = await cards();
    step('it is marked as in the layout', !!list.find((c) => c.title === list[0].title)?.inUse, JSON.stringify(list));
    await clickTrash(list[0].title);
    await until(() => confirmDialog(removeLabel), 3000, 100);
    step('removed again', !!(await until(async () => ((await roots()) === before ? true : null), 10000, 250)));
  } else {
    info('sections', 'no global saved sections on this site — skipped');
  }

  // --- On a page the panel is the page builder's ------------------------------------
  const onPage = await openInLivePreview(PAGE);
  // The panel may still be open from the layout (it is remembered): a click would close it.
  await sleep(1500);
  await onPage.cp.evaluate(() => { if (!document.getElementById('__sve-section-picker')) document.querySelector('#__sve-toolbar button[data-tab="sections"]')?.click(); });
  await until(() => onPage.cp.evaluate(() => document.querySelectorAll('#__sve-section-picker [data-sve-tabs] button').length > 0), 15000, 250);
  const pageTabs = await onPage.cp.evaluate(() => [...document.querySelectorAll('#__sve-section-picker [data-sve-tabs] button')].map((b) => b.textContent.trim()));
  const layoutTabNames = want;
  step('on a page: the page builder\'s tabs, none of the layout\'s', pageTabs.length > 0 && !pageTabs.some((tab, i) => tab === layoutTabNames[0] || tab === layoutTabNames[1]), JSON.stringify(pageTabs));
} catch (e) {
  step('ran to the end', false, e.message);
} finally {
  restore();
  await browser.close();
}

const errors = report.errors.filter((e) => !/favicon|ERR_ABORTED|net::ERR/i.test(e));
step('no page errors', errors.length === 0, errors.slice(0, 5).join(' | '));
console.log(report.ok ? '\nPASS' : '\nFAIL');
process.exit(report.ok ? 0 : 1);
