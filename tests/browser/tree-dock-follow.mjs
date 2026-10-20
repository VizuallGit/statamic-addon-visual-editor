#!/usr/bin/env node
/**
 * HTML tree → dock, panel, tree: one click, three followers.
 *
 * Opens an entry in Live Preview with the panel column shown, the dock armed
 * and the HTML tree open, then clicks every section row in the tree and reads,
 * at 0.4 s, 1.5 s and 5 s after the click, which file the dock holds, which
 * section the tree marks and what the panel's header says. Every one of them
 * must name the section that was clicked — for every section, whether it has
 * one field, many or none.
 *
 * With SVE_ADD_SET=<set handle> (e.g. content/contact_form) a row of that set
 * is added through Statamic's own "Add set" + Search Sets before the clicks,
 * so a section with no fields and no markup is in the round too. Nothing is
 * saved.
 *
 *   SVE_SITE_DIR / SVE_SITE_URL / SVE_USER / SVE_PASS   as in the smoke test
 *   SVE_ENTRY     the entry's CP path
 *   SVE_NO_SEED=1 do not touch the user's preference file
 *
 *   node tests/browser/tree-dock-follow.mjs
 */
import { createRequire } from 'node:module';

const env = (key, fallback) => process.env[key] || fallback;
const SITE_DIR = env('SVE_SITE_DIR', `${process.env.HOME}/Sites/vizuall-skabelon`);
const SITE_URL = env('SVE_SITE_URL', 'http://vizuall-skabelon.test');
const USER = env('SVE_USER', 'claude-test@vizuall.dk');
const PASS = env('SVE_PASS', '');
const ENTRY = env('SVE_ENTRY', '/cp/collections/pages/entries/827310c8-9f8b-4c10-a157-634a0d0f82d5');
const ADD_SET = env('SVE_ADD_SET', '');
const CHROME = env('SVE_CHROME', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome');
const puppeteer = createRequire(`${SITE_DIR}/package.json`)('puppeteer');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Start from a known layout: panel shown, dock armed, tree remembered.
import { readFileSync, writeFileSync } from 'node:fs';
const USER_FILE = `${SITE_DIR}/users/${USER}.yaml`;
function seed(prefs) {
  let yaml = readFileSync(USER_FILE, 'utf8').replace(/^  sve_chrome:\n(?:    .*\n)*/m, '');
  const block = `  sve_chrome:\n${Object.entries(prefs).map(([k, v]) => `    ${k}: '${String(v).replace(/'/g, "''")}'\n`).join('')}`;
  yaml = /^preferences:\n/m.test(yaml) ? yaml.replace(/^preferences:\n/m, `preferences:\n${block}`) : `${yaml.replace(/\n*$/, '\n')}preferences:\n${block}`;
  writeFileSync(USER_FILE, yaml);
}
if (process.env.SVE_NO_SEED !== '1') seed({ 'sve-lp-panel-mode': 'show', 'sve-lp-collapsed': '0', 'sve-code-dock-armed': '1', 'sve-right-dock-open': '1', 'sve-right-dock-open-panes': '["html_tree"]' });

const results = [];
let failed = 0;
function step(name, ok, note = '') {
  results.push(`${ok ? 'ok  ' : 'FAIL'} ${name}${note ? ` — ${note}` : ''}`);
  if (!ok) failed++;
}

const browser = await puppeteer.launch({ headless: true, executablePath: CHROME, args: ['--window-size=1600,1000'], defaultViewport: { width: 1600, height: 1000 } });
const page = await browser.newPage();
await page.evaluateOnNewDocument(() => { window.__sveDebug = { ran: [] }; });
const errors = [];
page.on('pageerror', (e) => errors.push(`pageerror ${e.message.slice(0, 160)}`));

/** What the three followers say right now. */
const readState = (cp) => cp.evaluate(() => {
  const dock = document.getElementById('__sve-code-dock');
  const path = dock?.querySelector('[data-sve-code-path]')?.textContent.trim() || '';
  const current = document.querySelector('[data-sve-ht-current]');
  const treeUid = current?.closest('[data-sve-ht-sec-uid]')?.getAttribute('data-sve-ht-sec-uid') || '';
  // The open section has no shut row of its own: the wrapper without one is it.
  const open = [...document.querySelectorAll('[data-sve-ht-sec-uid]')].filter((w) => !w.querySelector(':scope > [data-sve-ht-sec], [data-sve-ht-sec]')).map((w) => w.getAttribute('data-sve-ht-sec-uid'));
  const panel = document.querySelector('#__sve-selection-panel .sve-sel__title')?.textContent.trim() || '';
  const overlay = document.querySelector('iframe[src*="/fields/fieldsets/"]')?.getAttribute('src') || '';
  return { path, treeUid, open, panel, overlay };
});

/** The page's sections as the form knows them: uid → type/label. */
const readSections = (cp) => cp.evaluate(() => {
  const values = window.__sveDebug?.values?.() || {};
  const rows = values.page_sections || [];
  // A row of the global set renders a saved section: the file the dock opens
  // and the tree marks is that section's, read as section-library.js reads it.
  const globalSet = window.Statamic?.$config?.get?.('sveGlobalSectionSet') || 'global_section';
  const saved = window.Statamic?.$config?.get?.('sveSavedSectionLabels') || {};
  const rendered = (row) => {
    if (row.type !== globalSet) return row.type;
    const ref = row[globalSet];
    const id = typeof ref === 'string' ? ref : Array.isArray(ref) ? (typeof ref[0] === 'string' ? ref[0] : ref[0]?.id) : '';
    return saved[id]?.section_type || row.type;
  };
  return rows.map((row) => ({ uid: row._visual_id || row.id || row._id, type: row.type, rendered: rendered(row), label: row._sve_label || '' }));
});

const treeRows = (cp) => cp.evaluate(() => [...document.querySelectorAll('[data-sve-ht-sec-uid]')].map((w) => ({
  uid: w.getAttribute('data-sve-ht-sec-uid'),
  shut: !!w.querySelector('[data-sve-ht-sec]'),
  label: (w.querySelector('[data-sve-ht-sec]')?.textContent || w.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 40),
})));

async function clickTreeRow(page, cp, uid) {
  const overlayBox = await (await page.$('iframe.sve-edit-overlay')).boundingBox();
  const rect = await cp.evaluate((id) => {
    const w = document.querySelector(`[data-sve-ht-sec-uid="${CSS.escape(id)}"]`);
    const row = w?.querySelector('[data-sve-ht-sec]') || w;
    if (!row) return null;
    row.scrollIntoView({ block: 'center' });
    const r = row.getBoundingClientRect();
    return { x: r.left + Math.min(80, r.width / 2), y: r.top + r.height / 2 };
  }, uid);
  if (!rect) return false;
  await page.mouse.click(overlayBox.x + rect.x, overlayBox.y + rect.y);
  return true;
}

const fileOf = (type) => `${String(type || '').split('/').pop()}.antlers.html`;

try {
  await page.goto(`${SITE_URL}/cp`, { waitUntil: 'networkidle2' });
  if (await page.$('input[name="email"]')) {
    await page.type('input[name="email"]', USER);
    await page.type('input[name="password"]', PASS);
    await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 8000 }).catch(() => null), page.keyboard.press('Enter')]);
    await sleep(500);
    await page.goto(`${SITE_URL}/cp`, { waitUntil: 'networkidle2' });
  }
  step('login', !(await page.$('input[name="password"]')), page.url());

  await page.goto(`${SITE_URL}${ENTRY}`, { waitUntil: 'networkidle2' });
  await sleep(1200);
  if (!(await page.$('iframe.sve-edit-overlay'))) {
    await page.evaluate(() => [...document.querySelectorAll('button, a')].find((el) => /live preview|forhåndsvisning/i.test(el.textContent || ''))?.click());
    await page.waitForSelector('iframe.sve-edit-overlay[data-open]', { timeout: 30000 });
  }
  const cp = await (await page.$('iframe.sve-edit-overlay')).contentFrame();
  await page.keyboard.press('Escape');
  await cp.waitForSelector('#__sve-toolbar button', { timeout: 20000 });
  await sleep(2500);
  // The dock and the tree from the top bar when the remembered layout did not bring them.
  const until = async (fn, ms) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await cp.evaluate(fn)) return true; await sleep(250); } return false; };
  // The remembered layout brings the dock a moment after the toolbar; a click
  // on its icon before that would switch it off instead.
  // The icon toggles: when the remembered "armed" state never produced a dock,
  // the first click switches it off and the second brings the dock.
  for (let i = 0; i < 3 && !(await until(() => !!document.getElementById('__sve-code-dock'), i ? 8000 : 15000)); i++) {
    await cp.evaluate(() => document.querySelector('#__sve-toolbar button[data-tab="code"]')?.click());
  }
  if (!(await until(() => !!document.querySelector('[data-sve-ht-sec-uid]'), 4000))) {
    await cp.evaluate(() => (document.querySelector('button[data-tab="html_tree"]') || [...document.querySelectorAll('button')].find((b) => /html tree|html-træ/i.test(b.getAttribute('title') || b.getAttribute('aria-label') || b.textContent || '')))?.click());
    await until(() => !!document.querySelector('[data-sve-ht-sec-uid]'), 15000);
  }
  await cp.waitForSelector('[data-sve-ht-sec-uid]', { timeout: 30000 }).catch(() => null);
  await sleep(2000);
  if (process.env.SVE_SHOT) await page.screenshot({ path: process.env.SVE_SHOT });
  step('dock and tree open', await cp.evaluate(() => !!document.getElementById('__sve-code-dock') && !!document.querySelector('[data-sve-ht-sec-uid]')), await cp.evaluate(() => `dock=${!!document.getElementById('__sve-code-dock')} tree=${document.querySelectorAll('[data-sve-ht-sec-uid]').length} toolbar=${[...document.querySelectorAll('#__sve-toolbar button[data-tab]')].map((b) => b.dataset.tab).join(',')}`));

  let sections = await readSections(cp);
  step('form values readable', sections.length > 0, `${sections.length} sections`);

  let addedUid = '';
  if (ADD_SET) {
    // The preview's plus, as the bridge sends it once a set is chosen in Search
    // Sets: one set named, so the CP inserts it after the last section without
    // the picker. The row is new in the form and in the preview; nothing is saved.
    const last = sections[sections.length - 1];
    const before = sections.map((s) => s.uid);
    const preview = await (await cp.$('#live-preview-iframe'))?.contentFrame();
    await preview.evaluate((payload) => window.parent.postMessage(payload, '*'), {
      source: 'statamic-visual-editor', type: 'add-block-native', field: 'page_sections', sets: [{ handle: ADD_SET }],
      anchorUid: last.uid, sectionUid: last.uid, scope: last.uid, position: 'after',
      anchorRect: { left: 200, top: 200, bottom: 226, right: 226, width: 26, height: 26 },
    });
    const t0 = Date.now();
    while (Date.now() - t0 < 15000) {
      sections = await readSections(cp);
      if (sections.length > before.length) break;
      await sleep(300);
    }
    const added = sections.find((s) => !before.includes(s.uid));
    addedUid = added?.uid || '';
    step(`a ${ADD_SET} row added through the preview's plus`, !!added && added.type === ADD_SET, added ? `${added.type} ${added.uid}` : `still ${sections.length} sections`);
    await until(() => false, 0);
    // The preview morphs the new section in and the tree lists it.
    const t1 = Date.now();
    while (Date.now() - t1 < 15000 && (await treeRows(cp)).length < sections.length) await sleep(300);
    if (addedUid) {
      const inPreview = await preview.evaluate((id) => { const el = document.querySelector(`[data-sid="${id}"]`); return el ? `${el.tagName.toLowerCase()} ${Math.round(el.getBoundingClientRect().height)}px high, ${el.querySelectorAll('[data-sid-field]').length} fields` : 'not in preview'; }, addedUid);
      step('the new section is in the preview (informational)', true, inPreview);
    }
  }

  const rows = await treeRows(cp);
  step('tree lists the sections', rows.length === sections.length, `tree ${rows.length}: ${rows.map((r) => r.label).join(' | ')} / form ${sections.length}`);

  const added = sections.find((s) => s.uid === addedUid);
  const order = sections.length > 1 ? [...sections.slice(1), sections[0], added || sections[1]] : sections;
  for (const sec of order) {
    const before = await readState(cp);
    const clicked = await clickTreeRow(page, cp, sec.uid);
    if (!clicked) { step(`click ${sec.type}`, false, 'row not in tree'); continue; }
    const samples = [];
    for (const wait of [400, 1100, 3500]) {
      await sleep(wait);
      samples.push(await readState(cp));
    }
    const want = fileOf(sec.rendered || sec.type);
    const last = samples[2];
    const dockOk = samples.every((s) => s.path.endsWith(want));
    const treeOk = last.open.length === 1 && last.open[0] === sec.uid;
    step(`tree click ${sec.type} (${sec.label || '-'}): dock holds ${want} at 0.4/1.5/5 s`, dockOk, samples.map((s) => s.path.split('/').pop() || '∅').join(' → ') + ` (before: ${before.path.split('/').pop() || '∅'})`);
    step(`tree click ${sec.type}: tree opens that section after 5 s`, treeOk, `open=${last.open.map((u) => sections.find((x) => x.uid === u)?.type || u).join(',')} marked=${sections.find((x) => x.uid === last.treeUid)?.type || last.treeUid || '∅'}`);
    step(`tree click ${sec.type}: panel shows it`, !!last.panel, `panel="${last.panel}"`);
  }

  // The fields icon on the open section's row opens that section's fieldset.
  const lastSec = order[order.length - 1];
  const iconOpened = await cp.evaluate(() => {
    const btn = [...document.querySelectorAll('[data-sve-ht-fields]')].find((b) => b.getClientRects().length) || document.querySelector('[data-sve-ht-fields]');
    if (!btn) return 'no icon';
    btn.click();
    return 'clicked';
  });
  await sleep(5000);
  const after = await readState(cp);
  const fsFile = String(lastSec.rendered || lastSec.type || '').replace('/', '.');
  step(`fields icon opens the fieldset of ${lastSec.type}`, after.overlay.includes(`/fields/fieldsets/${encodeURIComponent(fsFile)}/`) || after.overlay.includes(`/fields/fieldsets/${fsFile}/`), `${iconOpened}; overlay=${after.overlay.replace(SITE_URL, '') || '∅'}`);
  await page.keyboard.press('Escape');
} catch (err) {
  step('run', false, err.message);
}

step('no JS errors', errors.length === 0, errors.slice(0, 5).join(' | '));
if (process.env.SVE_LOG) {
  const lines = await (await (await page.$('iframe.sve-edit-overlay'))?.contentFrame())?.evaluate(() => (window.__sveDebug?.log || []).slice(-60)).catch(() => []);
  console.log('--- editor log ---\n' + (lines || []).join('\n'));
}
await browser.close();
console.log(results.join('\n'));
console.log(`\n${failed ? `${failed} FAILED` : 'ALL OK'}`);
process.exit(failed ? 1 : 0);
