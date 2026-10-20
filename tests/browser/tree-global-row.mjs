#!/usr/bin/env node
/**
 * HTML tree → a global section's row: the dock opens the section it renders.
 *
 * A page row of the global set renders a saved section (its `section_type`,
 * e.g. hero/style_2) through the wrapper partial `global_section.antlers.html`,
 * whose first tag is a hidden <span> that only carries the row's id. The tree
 * names the row by the section it renders; clicking it must open THAT
 * section's file in the dock — never the wrapper, which the tree would then
 * draw as a `span` row with a `global_section` loop under it.
 *
 * Opens an entry in Live Preview with the dock armed and the tree open, clicks
 * a plain section, then the global row, then a plain section again, and reads
 * after each click which file the dock holds, which section the tree marks
 * open, what the open section's first tag chip says, and whether any chip in
 * the tree reads `span`.
 *
 *   SVE_SITE_DIR / SVE_SITE_URL / SVE_USER / SVE_PASS   as in the smoke test
 *   SVE_ENTRY     the entry's CP path (a page with a global_section row)
 *   SVE_NO_SEED=1 do not touch the user's preference file
 *
 *   node tests/browser/tree-global-row.mjs
 */
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync } from 'node:fs';

const env = (key, fallback) => process.env[key] || fallback;
const SITE_DIR = env('SVE_SITE_DIR', `${process.env.HOME}/Sites/vizuall-skabelon`);
const SITE_URL = env('SVE_SITE_URL', 'http://vizuall-skabelon.test');
const USER = env('SVE_USER', 'claude-test@vizuall.dk');
const PASS = env('SVE_PASS', '');
const ENTRY = env('SVE_ENTRY', '/cp/collections/pages/entries/827310c8-9f8b-4c10-a157-634a0d0f82d5');
const CHROME = env('SVE_CHROME', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome');
const puppeteer = createRequire(`${SITE_DIR}/package.json`)('puppeteer');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

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

/** The dock, the tree and the panel as they stand. */
const readState = (cp) => cp.evaluate(() => {
  const dock = document.getElementById('__sve-code-dock');
  const path = dock?.querySelector('[data-sve-code-path]')?.textContent.trim() || '';
  const wrappers = [...document.querySelectorAll('[data-sve-ht-sec-uid]')];
  const rows = wrappers.map((w) => {
    const uid = w.getAttribute('data-sve-ht-sec-uid');
    const shut = w.querySelector('[data-sve-ht-sec]');
    if (shut) {
      return { uid, open: false, tag: shut.querySelector('[data-sve-ht-kind]')?.textContent.trim() || '', label: shut.textContent.trim().replace(/\s+/g, ' ').slice(0, 40) };
    }
    const first = w.querySelector('[data-sve-ht-id]');
    const chips = [...w.querySelectorAll('[data-sve-ht-tag], [data-sve-ht-kind]')].map((c) => c.textContent.trim());
    return { uid, open: true, tag: first?.querySelector('[data-sve-ht-tag], [data-sve-ht-kind]')?.textContent.trim() || '', label: first?.textContent.trim().replace(/\s+/g, ' ').slice(0, 40) || '', chips };
  });
  const spans = [...document.querySelectorAll('[data-sve-ht-row] [data-sve-ht-tag], [data-sve-ht-row] [data-sve-ht-kind]')].filter((c) => c.textContent.trim() === 'span').length;
  const panel = document.querySelector('#__sve-selection-panel .sve-sel__title')?.textContent.trim() || '';
  return { path, rows, open: rows.filter((r) => r.open).map((r) => r.uid), spans, panel };
});

/** The page's sections as the form knows them. */
const readSections = (cp) => cp.evaluate(() => {
  const values = window.__sveDebug?.values?.() || {};
  const rows = values.page_sections || [];
  return rows.map((row) => ({ uid: row._visual_id || row.id || row._id, type: row.type, label: row._sve_label || '', global: row.global_section || null }));
});

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

/** A confirm the preview may raise ("global section — edit?"): say yes, and say so. */
async function acceptPreviewConfirm(page, cp) {
  const preview = await (await cp.$('#live-preview-iframe'))?.contentFrame();
  if (!preview) return false;
  const box = await preview.evaluate(() => {
    const bs = [...document.querySelectorAll('#__sve-preview-confirm [data-sve-actions] button')];
    const b = bs.pop();
    if (!b) return null;
    const r = b.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  });
  if (!box) return false;
  const overlayBox = await (await page.$('iframe.sve-edit-overlay')).boundingBox();
  const frameBox = await (await cp.$('#live-preview-iframe')).boundingBox();
  await page.mouse.click(overlayBox.x + frameBox.x + box.x, overlayBox.y + frameBox.y + box.y);
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
  const until = async (fn, ms) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await cp.evaluate(fn)) return true; await sleep(250); } return false; };
  for (let i = 0; i < 3 && !(await until(() => !!document.getElementById('__sve-code-dock'), i ? 8000 : 15000)); i++) {
    await cp.evaluate(() => document.querySelector('#__sve-toolbar button[data-tab="code"]')?.click());
  }
  if (!(await until(() => !!document.querySelector('[data-sve-ht-sec-uid]'), 4000))) {
    await cp.evaluate(() => (document.querySelector('button[data-tab="html_tree"]') || [...document.querySelectorAll('button')].find((b) => /html tree|html-træ/i.test(b.getAttribute('title') || b.getAttribute('aria-label') || b.textContent || '')))?.click());
    await until(() => !!document.querySelector('[data-sve-ht-sec-uid]'), 15000);
  }
  await cp.waitForSelector('[data-sve-ht-sec-uid]', { timeout: 30000 }).catch(() => null);
  await sleep(2000);
  step('dock and tree open', await cp.evaluate(() => !!document.getElementById('__sve-code-dock') && !!document.querySelector('[data-sve-ht-sec-uid]')));

  const sections = await readSections(cp);
  const globalRow = sections.find((s) => s.type === 'global_section');
  const plain = sections.filter((s) => s.type !== 'global_section');
  step('the page has a global row and plain sections', !!globalRow && plain.length >= 2, sections.map((s) => `${s.type}${s.global ? `→${String(s.global).slice(0, 8)}` : ''}`).join(' | '));
  if (!globalRow) throw new Error('no global_section row on this page');

  const rendered = await cp.evaluate((id) => window.Statamic?.$config?.get?.('sveSavedSectionLabels')?.[id]?.section_type || '', String(globalRow.global));
  step('the saved section it renders is known to the CP', !!rendered, `${globalRow.global} → ${rendered || '∅'}`);
  const wantFile = fileOf(rendered);

  const before = await readState(cp);
  const globalBefore = before.rows.find((r) => r.uid === globalRow.uid);
  step('shut, the global row says the rendered section\'s tag', globalBefore?.tag === 'section', `tag=${globalBefore?.tag || '∅'} label="${globalBefore?.label || ''}"`);

  const rounds = [
    { name: `plain ${plain[plain.length - 1].type}`, sec: plain[plain.length - 1], want: fileOf(plain[plain.length - 1].type) },
    { name: 'the global row', sec: globalRow, want: wantFile },
    { name: `plain ${plain[0].type} again`, sec: plain[0], want: fileOf(plain[0].type) },
  ];

  for (const round of rounds) {
    const clicked = await clickTreeRow(page, cp, round.sec.uid);
    if (!clicked) { step(`click ${round.name}`, false, 'row not in tree'); continue; }
    const samples = [];
    let confirmed = false;
    for (const wait of [400, 1100, 3500]) {
      await sleep(wait);
      if (!confirmed && (await acceptPreviewConfirm(page, cp))) { confirmed = true; await sleep(600); }
      samples.push(await readState(cp));
    }
    const last = samples[2];
    const openRow = last.rows.find((r) => r.open);
    step(`tree click ${round.name}: dock holds ${round.want} at 0.4/1.5/5 s`, samples.every((s) => s.path.endsWith(round.want)), samples.map((s) => s.path.split('/').pop() || '∅').join(' → ') + (confirmed ? ' (confirm accepted)' : ''));
    step(`tree click ${round.name}: the tree opens that row`, last.open.length === 1 && last.open[0] === round.sec.uid, `open=${last.open.map((u) => sections.find((x) => x.uid === u)?.type || u).join(',') || '∅'}`);
    step(`tree click ${round.name}: the open row's first chip is a real tag, never span`, !!openRow && openRow.tag !== 'span' && openRow.tag !== '', `first=${openRow?.tag || '∅'} chips=${(openRow?.chips || []).slice(0, 6).join(',')}`);
    step(`tree click ${round.name}: no span chip anywhere in the tree`, samples.every((s) => s.spans === 0), `spans at 0.4/1.5/5 s: ${samples.map((s) => s.spans).join('/')}`);
    const globalNow = last.rows.find((r) => r.uid === globalRow.uid);
    step(`tree click ${round.name}: the global row's tag stays section`, !!globalNow && (globalNow.open ? globalNow.tag === 'section' : globalNow.tag === 'section'), `global row: ${globalNow ? `${globalNow.open ? 'open' : 'shut'} tag=${globalNow.tag}` : 'missing'}`);
    step(`tree click ${round.name}: panel shows a row`, !!last.panel, `panel="${last.panel}"`);
  }
} catch (err) {
  step('run', false, err.message);
}

step('no JS errors', errors.length === 0, errors.slice(0, 5).join(' | '));
if (process.env.SVE_LOG) {
  const lines = await (await (await page.$('iframe.sve-edit-overlay'))?.contentFrame())?.evaluate(() => (window.__sveDebug?.log || []).slice(-80)).catch(() => []);
  console.log('--- editor log ---\n' + (lines || []).join('\n'));
}
await browser.close();
console.log(results.join('\n'));
console.log(`\n${failed ? `${failed} FAILED` : 'ALL OK'}`);
process.exit(failed ? 1 : 0);
