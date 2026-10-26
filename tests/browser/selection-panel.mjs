#!/usr/bin/env node
/**
 * Selection panel — the left column shows what was clicked, at once, and nothing else.
 *
 * Opens an entry in Live Preview with the panel column shown, then:
 *
 *   1. a click on a block inside a section (the preview's own `click` message)
 *      paints that block alone: its name in the header, its fields below, no
 *      section around it — and says how many ms the paint took;
 *   2. the same click three times gives the same panel three times;
 *   3. the back arrow steps to the parent block, then the section, then the page;
 *   4. typing in a field of the panel reaches the preview (the form's values);
 *   5. opening the HTML tree from the top bar leaves the panel standing;
 *   6. the Page Settings icon shows the page again;
 *   7. the old path stayed quiet: no solo marks, no lite rows mounted, no JS errors.
 *
 *   SVE_SITE_DIR / SVE_SITE_URL / SVE_USER / SVE_PASS   as in the smoke test
 *   SVE_ENTRY     an entry with a media_textbox-like section (a block that holds blocks)
 *   SVE_SECTION / SVE_BLOCK / SVE_LEAF   the three ids (section, block in it, block in that)
 *   SVE_LEAF_FIELD   the leaf's text field handle (default `headline`, an inline Bard)
 *   SVE_SHOT      a png path for a screenshot of the leaf state
 *   SVE_HEADER_WIDGET   a widget row id in the site's header (header as a tab, widget as a row)
 *   SVE_GLOBAL_ID / SVE_GLOBAL_LEAF   a synced saved section's entry id, and a block id inside it
 *                      (the global section's rows on the panel); both unset = skipped
 *   SVE_LIST_ROW      a row id inside a block's own list (a Grid row or a nested set, e.g. a link in a links block); unset = skipped
 *   SVE_BARD_SET      a Bard set's id on the page (a set inside a Bard field is a row on the panel); unset = skipped
 *
 * Every kind of click is made three times in a row and must give the same
 * panel three times (the regression the panel exists for).
 *   SVE_NO_SEED=1   do not touch the user's preference file (a remote site)
 *   SVE_PREFLIGHT=1 stop after login, Live Preview and the ids — nothing is clicked or saved
 *   SVE_SKIP_SAVE=1 leave out the typing and Save Changes steps
 *   SVE_WORKTREE=1  serve this checkout's build into the CP instead of the installed one
 *                   (SVE_ADDON_DIR names the checkout; default ~/Sites/statamic-addon-visual-editor-vue)
 *
 * The save step types into the leaf's text field and saves; afterwards it
 * types the original text back and saves again, so a site keeps its content.
 *
 *   node tests/browser/selection-panel.mjs
 */
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync } from 'node:fs';
import { serveWorktreeBuild } from './serve-worktree.mjs';

const env = (key, fallback) => process.env[key] || fallback;
const SITE_DIR = env('SVE_SITE_DIR', `${process.env.HOME}/Sites/vizuall-skabelon`);
const ADDON_DIR = env('SVE_ADDON_DIR', `${process.env.HOME}/Sites/statamic-addon-visual-editor-vue`);
const WORKTREE = env('SVE_WORKTREE', '') === '1';
const SITE_URL = env('SVE_SITE_URL', 'http://vizuall-skabelon.test');
const USER = env('SVE_USER', 'claude-test@vizuall.dk');
const PASS = env('SVE_PASS', '');
const ENTRY = env('SVE_ENTRY', '/cp/collections/pages/entries/827310c8-9f8b-4c10-a157-634a0d0f82d5');
const SECTION = env('SVE_SECTION', 'muaayv1kuchr-muaayv1kjzay');
const BLOCK = env('SVE_BLOCK', 'muaayv1krbnu-muaayv1kdu91');
const LEAF = env('SVE_LEAF', 'muaayv1kuxei-muaayv1kfjwu');
const LEAF_FIELD = env('SVE_LEAF_FIELD', 'headline');
const CHROME = env('SVE_CHROME', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome');
const SHOT = env('SVE_SHOT', '');
const HEADER_WIDGET = env('SVE_HEADER_WIDGET', '');
const GLOBAL_ID = env('SVE_GLOBAL_ID', '');
const GLOBAL_LEAF = env('SVE_GLOBAL_LEAF', '');
const LIST_ROW = env('SVE_LIST_ROW', '');
const BARD_SET = env('SVE_BARD_SET', '');
const puppeteer = createRequire(`${SITE_DIR}/package.json`)('puppeteer');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const USER_FILE = `${SITE_DIR}/users/${USER}.yaml`;
function seed(prefs) {
  let yaml = readFileSync(USER_FILE, 'utf8').replace(/^  sve_chrome:\n(?:    .*\n)*/m, '');
  if (prefs) {
    const block = `  sve_chrome:\n${Object.entries(prefs).map(([k, v]) => `    ${k}: '${String(v).replace(/'/g, "''")}'\n`).join('')}`;
    yaml = /^preferences:\n/m.test(yaml) ? yaml.replace(/^preferences:\n/m, `preferences:\n${block}`) : `${yaml.replace(/\n*$/, '\n')}preferences:\n${block}`;
  }
  writeFileSync(USER_FILE, yaml);
}
const NO_SEED = process.env.SVE_NO_SEED === '1';
const PREFLIGHT = process.env.SVE_PREFLIGHT === '1';
const SKIP_SAVE = process.env.SVE_SKIP_SAVE === '1';
if (!NO_SEED) seed({ 'sve-lp-panel-mode': 'show', 'sve-lp-collapsed': '0' });

const results = [];
let failed = 0;
function step(name, ok, note = '') {
  lastStep = name;
  results.push(`${ok ? 'ok  ' : 'FAIL'} ${name}${note ? ` — ${note}` : ''}`);
  if (!ok) failed++;
}

const browser = await puppeteer.launch({ headless: true, executablePath: CHROME, args: ['--window-size=1440,900'], defaultViewport: { width: 1440, height: 900 } });
const page = await browser.newPage();
await page.evaluateOnNewDocument(() => { window.__sveDebug = { ran: [] }; });
let cpForLog = null;
const errors = [];
const noise = [];
// Failures of the bench, not of the editor: another addon's endpoint refusing
// the session on a bare host, Inertia's version check after a rebuild.
const isNoise = (text) => /\/cp\/color-scheme\/|\/cp\/bard-style\/|invalid domain|409 |auth\/login/.test(text);
let lastStep = 'start';
const note = (text) => (isNoise(text) ? noise : errors).push(`${text} [after: ${lastStep}]`);
page.on('pageerror', (e) => note(`pageerror ${e.message.slice(0, 160)} @ ${(e.stack || '').split('\n').slice(1, 3).join(' ').replace(SITE_URL, '').slice(0, 200)}`));
// Console "Failed to load resource" lines carry no URL; the response does.
page.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) note(`console ${m.text().slice(0, 160)}`); });
page.on('response', (r) => { if (r.status() >= 400) note(`${r.status()} ${r.url().replace(SITE_URL, '').slice(0, 120)}`); });

if (WORKTREE) {
  await serveWorktreeBuild(page, {
    buildDir: `${ADDON_DIR}/resources/dist/build`,
    installedManifest: `${SITE_DIR}/public/vendor/visual-editor/build/manifest.json`,
    scriptsDir: `${ADDON_DIR}/resources/js`,
  });
  console.log('info build served from the working tree');
}

/** The panel as the eye sees it: header, back label, field count, nested sets. */
const PANEL = '#__sve-selection-panel [data-sve-selection-panel]';
const panelStrings = { page: null };
const readPanel = (cp) => cp.evaluate((sel) => {
  const col = document.querySelector('.live-preview-fields') || document.querySelector('.live-preview-editor');
  const panel = document.querySelector(sel);
  const visible = (el) => !!el && el.getClientRects().length > 0;
  const fields = panel ? [...panel.querySelectorAll('.publish-fields > .form-group')].filter(visible) : [];
  return {
    columnMarked: !!col?.hasAttribute('data-sve-selection'),
    shown: visible(panel),
    title: panel?.querySelector('.sve-sel__title')?.textContent.trim() || '',
    back: panel?.querySelector('.sve-sel__back')?.textContent.trim().replace(/^‹\s*/, '') || '',
    kind: panel?.getAttribute('data-sve-selection-kind') || '',
    fieldCount: fields.length,
    fieldHandles: fields.map((f) => f.querySelector('[id^="field_"]')?.id.replace(/^field_/, '').split('_').pop() || f.className.split(' ').find((c) => c.startsWith('field-w-')) || '?').slice(0, 12),
    sets: panel ? [...panel.querySelectorAll('[data-replicator-set]')].map((s) => `${s.dataset.type}${s.hasAttribute('data-collapsed') ? '(collapsed)' : '(open)'}`) : [],
    activeField: panel?.querySelector('[data-sve-active] [id^="field_"]')?.id || panel?.querySelector('[data-sve-active]')?.className || '',
    soloMarks: document.querySelectorAll('[data-sve-solo-parent], [data-sve-solo-keep], [data-sve-panel-away], [data-sve-global-away]').length,
    contexts: (window.__sveDebug?.contexts?.() || []).join('+'),
    chromeHost: !!document.getElementById('__sve-chrome-host'),
    globalHost: !!document.getElementById('__sve-global-section-host'),
    liteRows: [...document.querySelectorAll('[data-sve-lite] [data-replicator-set]')].length,
    statamicFormVisible: [...(col?.querySelectorAll('.form-group, [data-sve-lite]') || [])].some((el) => !el.closest('#__sve-selection-panel') && visible(el) && getComputedStyle(el).visibility !== 'hidden'),
    tabsVisible: [...document.querySelectorAll('.live-preview-editor [role="tablist"]')].some((el) => !el.closest('#__sve-selection-panel') && visible(el) && getComputedStyle(el).visibility !== 'hidden' && el.getBoundingClientRect().height > 0),
  };
}, PANEL);

/**
 * A click message from the preview, timed from the message to the painted
 * panel. Measured inside the CP frame, frame by frame: the first frame in
 * which the panel's title is the one expected (or, with no expectation, is
 * not what it was) and the column carries the selection mark. One loop at a
 * time — a later call ends the earlier loop, so a stale loop never answers for
 * a newer click.
 */
async function clickIn(preview, cp, payload, expectTitle) {
  await cp.evaluate((want) => {
    const token = (window.__svePaintToken = (window.__svePaintToken || 0) + 1);
    const read = () => document.querySelector('#__sve-selection-panel .sve-sel__title')?.textContent.trim() || '';
    const before = read();
    window.__svePaintT0 = performance.now();
    window.__svePaintMs = null;
    const tick = () => {
      if (window.__svePaintToken !== token) return;
      const title = read();
      const marked = !!(document.querySelector('.live-preview-fields') || document.querySelector('.live-preview-editor'))?.hasAttribute('data-sve-selection');
      const done = want ? title === want && marked : title !== before && marked;
      if (done) { window.__svePaintMs = performance.now() - window.__svePaintT0; return; }
      if (performance.now() - window.__svePaintT0 < 5000) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, expectTitle);
  await preview.evaluate((data) => window.parent.postMessage({ source: 'statamic-visual-editor', ...data }, '*'), payload);
  const t0 = Date.now();
  let ms = null;
  while (Date.now() - t0 < 5000) {
    ms = await cp.evaluate(() => window.__svePaintMs);
    if (ms != null) break;
    await sleep(16);
  }
  return ms;
}

/** The same click three times; the panel read after each. */
async function thrice(preview, cp, payload, expectTitle = null) {
  const reads = [];

  for (let i = 0; i < 3; i++) {
    await clickIn(preview, cp, payload, expectTitle);
    await sleep(250);
    const r = await readPanel(cp);
    reads.push(`${r.kind}|${r.title}|${r.back}|${r.fieldCount}|${r.sets.join(',')}`);
  }

  return { same: new Set(reads).size === 1, read: reads[0], reads };
}

try {
  await page.goto(`${SITE_URL}/cp`, { waitUntil: 'networkidle2' });
  if (await page.$('input[name="email"]')) {
    await page.type('input[name="email"]', USER);
    await page.type('input[name="password"]', PASS);
    // Statamic answers the login with a 409 (Inertia version) and sends the
    // browser to /cp/login, which is a 404 for a user who is now logged in; the
    // session is set all the same. So: press Enter, give it a moment, go on.
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
  cpForLog = cp;
  await page.keyboard.press('Escape');
  await cp.waitForSelector('#__sve-toolbar button', { timeout: 20000 });

  let preview = null;
  for (let i = 0; i < 30; i++) {
    const el = await cp.$('#live-preview-iframe');
    preview = el ? await el.contentFrame() : null;
    // A block's id sits on its wrapper (`data-sid`) or on the field it drew (`data-sid-field-uid`).
    const ready = preview ? await preview.evaluate((ids) => ids.every((id) => !!document.querySelector(`[data-sid="${id}"], [data-sid-field-uid="${id}"]`)), [SECTION, BLOCK, LEAF]).catch(() => false) : false;
    if (ready) break;
    await sleep(1000);
  }
  const idsThere = preview ? await preview.evaluate((ids) => ids.map((id) => !!document.querySelector(`[data-sid="${id}"], [data-sid-field-uid="${id}"]`)), [SECTION, BLOCK, LEAF]).catch(() => []) : [];
  // Informational: a saved page may carry other ids in the preview than the
  // form (saves strip and reassign nested ids). The clicks below are the proof.
  step('preview shows the section, the block and the leaf (informational)', true, `${SECTION}=${idsThere[0]} ${BLOCK}=${idsThere[1]} ${LEAF}=${idsThere[2]}`);
  await sleep(2500);

  if (PREFLIGHT) {
    const pre = await readPanel(cp);
    step('preflight: panel mode and column', true, `columnMarked=${pre.columnMarked} formVisible=${pre.statamicFormVisible} lpCollapsed=${await cp.evaluate(() => getComputedStyle(document.querySelector('.live-preview-editor') || document.body).width)}`);
    throw new Error('preflight done');
  }

  const before = await readPanel(cp);
  step('before any click the column shows the page form, not the panel', !before.columnMarked && !before.shown, JSON.stringify(before));

  // 1. the leaf block, by a field click as the preview sends it
  const times = [];
  for (let i = 0; i < 3; i++) {
    const ms = await clickIn(preview, cp, { type: 'click', field: LEAF_FIELD, scope: LEAF }, null);
    // null expectTitle: measure to the first paint of a panel for this id instead
    times.push(ms);
    await sleep(300);
  }
  const leaf = await readPanel(cp);
  const leaf0Title = leaf.title;
  step('a click on the leaf block paints the panel', leaf.shown && leaf.columnMarked, JSON.stringify(leaf));
  step('the panel shows the leaf alone: one set, its own fields, no section around it', leaf.sets.length === 0 && leaf.fieldCount > 0 && leaf.fieldCount < 12, `fields=${leaf.fieldCount} ${leaf.fieldHandles.join(',')} sets=${leaf.sets.join(',')}`);
  step('the page\'s own tabs (Page Settings, SEO) are out of the way while a row shows', !leaf.tabsVisible, `tabsVisible=${leaf.tabsVisible}`);
  step('the back arrow names the block it sits in', !!leaf.back && leaf.back !== leaf.title, `back="${leaf.back}" title="${leaf.title}"`);
  step('the clicked field is marked in the panel', leaf.activeField.endsWith(`_${LEAF_FIELD}`), leaf.activeField);

  // 1b. timed: another block, then the leaf again, measured to the title
  const t1 = await clickIn(preview, cp, { type: 'click', uid: SECTION }, null);
  await sleep(200);
  const section1 = await readPanel(cp);
  const t2 = await clickIn(preview, cp, { type: 'click', field: LEAF_FIELD, scope: LEAF }, leaf.title);
  await sleep(200);
  const t3 = await clickIn(preview, cp, { type: 'click', uid: SECTION }, section1.title);
  await sleep(200);
  const t4 = await clickIn(preview, cp, { type: 'click', field: LEAF_FIELD, scope: LEAF }, leaf.title);
  step('click → painted title, measured in the CP frame', t2 != null && t4 != null && t2 < 200 && t4 < 200, `leaf ${Math.round(t2)} ms, ${Math.round(t4)} ms; section ${t3 == null ? '?' : Math.round(t3)} ms`);

  // 2. same click three times = same panel
  const reads = [];
  for (let i = 0; i < 3; i++) {
    await clickIn(preview, cp, { type: 'click', uid: SECTION }, section1.title);
    await sleep(150);
    await clickIn(preview, cp, { type: 'click', field: LEAF_FIELD, scope: LEAF }, leaf.title);
    await sleep(250);
    const r = await readPanel(cp);
    reads.push(`${r.title}|${r.back}|${r.fieldCount}|${r.sets.join(',')}`);
  }
  step('the same click three times gives the same panel', new Set(reads).size === 1, reads[0]);
  const sec3 = await thrice(preview, cp, { type: 'click', uid: SECTION }, section1.title);
  step('a section clicked three times gives the same panel', sec3.same && sec3.read.startsWith('set|'), sec3.read);
  if (LIST_ROW) {
    const list3 = await thrice(preview, cp, { type: 'click', uid: LIST_ROW }, null);
    step('a row inside a block\'s list clicked three times is the same row on the panel', list3.same && /^(grid|set)\|/.test(list3.read), list3.read);
  }
  if (BARD_SET) {
    const bard3 = await thrice(preview, cp, { type: 'click', uid: BARD_SET }, null);
    step('a Bard set clicked three times is the same row on the panel', bard3.same && bard3.read.startsWith('set|'), bard3.read);
  }
  await clickIn(preview, cp, { type: 'click', field: LEAF_FIELD, scope: LEAF }, leaf.title);
  await sleep(250);

  // 3. back: leaf → block → section → page
  const back = async () => { await cp.evaluate((sel) => document.querySelector(`${sel} .sve-sel__back`)?.click(), PANEL); await sleep(300); return readPanel(cp); };
  const block = await back();
  step('back from the leaf shows the block it sits in', block.shown && block.title === leaf.back, `title="${block.title}" back="${block.back}" fields=${block.fieldCount} sets=${block.sets.join(',')}`);
  step('the block shows its own blocks as a folded list, not opened', block.sets.length > 0 && block.sets.every((s) => s.endsWith('(collapsed)')), block.sets.join(','));
  const section = await back();
  panelStrings.page = section.back;
  step('back from the block shows the section', section.shown && section.title === block.back && section.kind === 'set', `title="${section.title}" back="${section.back}" fields=${section.fieldCount}`);
  const pageAgain = await back();
  step('back from the section shows the page form again', !pageAgain.columnMarked && !pageAgain.shown && pageAgain.statamicFormVisible, JSON.stringify(pageAgain));

  // 4. typing in the panel reaches the preview
  await clickIn(preview, cp, { type: 'click', field: LEAF_FIELD, scope: LEAF }, leaf.title);
  await sleep(300);
  const typed = `Panel ${Date.now().toString(36)}`;
  const inputSel = `${PANEL} [data-sve-active] input, ${PANEL} [data-sve-active] textarea, ${PANEL} [data-sve-active] .ProseMirror`;
  // The first VISIBLE input of the active field (a set carries hidden inputs too).
  const visibleInput = async () => {
    const handles = await cp.$$(inputSel);
    for (const h of handles) {
      if (await h.evaluate((el) => el.type !== 'hidden' && el.getClientRects().length > 0)) return h;
    }
    return null;
  };
  let inputEl = SKIP_SAVE ? null : await visibleInput();
  const hasInput = !!inputEl;
  const original = hasInput ? await inputEl.evaluate((el) => ('value' in el && el.tagName !== 'DIV' ? el.value : el.textContent) || '') : '';
  const typeInto = async (text) => {
    inputEl = (await visibleInput()) || inputEl;
    const about = await inputEl.evaluate((el) => `${el.tagName.toLowerCase()}.${String(el.className).split(' ').slice(0, 2).join('.')} connected=${el.isConnected} rect=${JSON.stringify(el.getBoundingClientRect()).slice(0, 60)}`);
    try {
      await inputEl.click({ clickCount: 3 });
    } catch (e) {
      console.log('typeInto: click failed on', about, '—', e.message.slice(0, 80), '— focusing instead');
      await inputEl.evaluate((el) => el.focus());
    }
    // The keyboard belongs to the page, not to the CP frame.
    await page.keyboard.down('Meta'); await page.keyboard.press('a'); await page.keyboard.up('Meta');
    await page.keyboard.press('Backspace');
    await inputEl.type(text);
  };
  if (hasInput) {
    await typeInto(typed);
  }
  let inPreview = false;
  for (let i = 0; i < 30 && hasInput; i++) {
    inPreview = await preview.evaluate((text) => (document.body?.textContent || '').includes(text), typed).catch(() => false);
    if (inPreview) break;
    await sleep(200);
  }
  step('text typed in the panel reaches the preview', SKIP_SAVE || (hasInput && inPreview), SKIP_SAVE ? 'skipped (SVE_SKIP_SAVE)' : hasInput ? `"${typed}"` : 'no text input in the active field');

  // 4b. Save Changes: the same form, the same save — and the panel stays where it was.
  const saveBtn = await cp.evaluateHandle(() => [...document.querySelectorAll('.live-preview-header button')].find((b) => /save changes|gem ændringer/i.test(b.textContent || '')) || null);
  const saveEnabled = !SKIP_SAVE && (await cp.evaluate((b) => !!b && !b.disabled, saveBtn));
  step('the typed change marks the form dirty: Save Changes is enabled', SKIP_SAVE || saveEnabled, SKIP_SAVE ? 'skipped' : '');
  const saveNow = () => new Promise((resolve) => { const h = (r) => { if (/\/cp\/collections\/pages\/entries\//.test(r.url()) && r.request().method() !== 'GET') { page.off('response', h); resolve(r.status()); } }; page.on('response', h); setTimeout(() => resolve(0), 15000); });
  if (saveEnabled) {
      const saved = saveNow();
    await cp.evaluate((b) => b.click(), saveBtn);
    const status = await saved;
    await sleep(2500);
    const afterSave = await readPanel(cp);
    step('Save Changes goes through', status >= 200 && status < 300, `status ${status}`);
    step('after the save the panel still shows the same block', afterSave.shown && afterSave.title === leaf.title && afterSave.columnMarked, `title="${afterSave.title}" marked=${afterSave.columnMarked}`);

    // Put the text back and save again: the site keeps what it had.
    await typeInto(original);
    await sleep(400);
    const restoring = saveNow();
    await cp.evaluate((b) => b.click(), saveBtn);
    const restored = await restoring;
    await sleep(1500);
    const backInPreview = await preview.evaluate((text) => (document.body?.textContent || '').includes(text) , original.trim().slice(0, 40)).catch(() => false);
    step('the original text is put back and saved', restored >= 200 && restored < 300 && backInPreview, `status ${restored} "${original.slice(0, 40)}"`);
  }

  // 5. the HTML tree from the top bar leaves the panel standing
  const treeBtn = (await cp.$('#__sve-toolbar button[data-tab="html_tree"]')) || (await cp.$('#__sve-toolbar button[data-tab="listview"]'));
  const treeName = (await cp.$('#__sve-toolbar button[data-tab="html_tree"]')) ? 'HTML tree' : 'block tree';
  if (treeBtn) {
    // Clicked through the DOM: a toolbar preset may keep the button out of view.
    await cp.evaluate((b) => b.click(), treeBtn);
    // The tree is a lazy chunk: on a remote site it takes a moment to arrive and draw its rows.
    for (let i = 0; i < 30; i++) { if (await cp.$('[data-sve-lv-row], [data-sve-ht-row]')) break; await sleep(250); }
    await sleep(600);
    const withTree = await readPanel(cp);
    step(`opening the ${treeName} from the top bar keeps the panel`, withTree.shown && withTree.title === leaf.title, `title="${withTree.title}"`);
    const treeRow = await cp.evaluate(() => document.querySelector('[data-sve-lv-current]')?.textContent.trim().slice(0, 40) || '');
    const treeInfo = await cp.evaluate((uid) => {
      const rows = [...document.querySelectorAll('[data-sve-lv-row]')];
      return `rows=${rows.length} hasLeaf=${rows.some((r) => (r.getAttribute('data-sve-lv-uid') || '') === uid)} first=${rows.slice(0, 4).map((r) => `${r.getAttribute('data-sve-lv-uid')?.slice(0, 12)}:${r.textContent.trim().slice(0, 14)}`).join(',')} panel=${!!document.getElementById('__sve-listview-panel')} current=${document.querySelectorAll('[data-sve-lv-current]').length}`;
    }, LEAF);
    step('the block tree points at the selected block', treeRow !== '' && treeRow.toLowerCase().includes(leaf.title.toLowerCase().slice(0, 6)), `tree row "${treeRow}" ${treeInfo}`);
    await cp.evaluate((b) => b.click(), treeBtn);
    await sleep(500);
  } else {
    step('opening a tree from the top bar keeps the panel', false, 'no tree button on this toolbar');
  }

  // Where the focus is before the page is shown again (a Bard left focused would blur as it unmounts).
  const focusInfo = await cp.evaluate(() => { const a = document.activeElement; const panel = document.getElementById('__sve-selection-panel'); return `${a?.tagName?.toLowerCase()}.${[...(a?.classList || [])].slice(0, 2).join('.')} inPanel=${!!(panel && a && panel.contains(a))} pmFocused=${!!document.querySelector('#__sve-selection-panel .ProseMirror-focused')}`; });
  step('focus before Page Settings (informational)', true, focusInfo);

  // 6. Page Settings icon shows the page
  const settingsBtn = await cp.$('#__sve-toolbar button[data-tab="settings"]');
  if (settingsBtn) {
    await settingsBtn.click();
    await sleep(600);
    const afterSettings = await readPanel(cp);
    step('the Page Settings icon shows the page again', !afterSettings.columnMarked && !afterSettings.shown, JSON.stringify(afterSettings));
  } else {
    step('the Page Settings icon shows the page again', false, 'no settings button found');
  }

  // 8. phase 1: the header as a tab of its form, a widget as a row in it
  if (HEADER_WIDGET) {
    const tOpen = await clickIn(preview, cp, { type: 'open-chrome', kind: 'header' }, null);
    await sleep(600);
    const headerTab = await readPanel(cp);
    step('opening the header paints its tab on the panel, no reveal wait', headerTab.shown && headerTab.kind === 'tab' && headerTab.fieldCount > 0 && headerTab.soloMarks === 0, `title="${headerTab.title}" fields=${headerTab.fieldCount} contexts=${headerTab.contexts} ms=${tOpen == null ? '?' : Math.round(tOpen)}`);
    const widget3 = await thrice(preview, cp, { type: 'click', uid: HEADER_WIDGET }, null);
    const widget = await readPanel(cp);
    step('a widget in the header is a row on the panel, with the header as its way back', widget.shown && widget.kind === 'set' && widget.back === headerTab.title, `title="${widget.title}" back="${widget.back}"`);
    step('the widget clicked three times gives the same panel', widget3.same, widget3.read);
    const header3 = await thrice(preview, cp, { type: 'open-chrome', kind: 'header' }, headerTab.title);
    step('the header opened three times gives the same panel', header3.same && header3.read.startsWith('tab|'), header3.read);
    await clickIn(preview, cp, { type: 'click', uid: HEADER_WIDGET }, null);
    await sleep(300);
    const backToTab = await back();
    step('back from the widget shows the header tab again', backToTab.kind === 'tab' && backToTab.title === headerTab.title, `title="${backToTab.title}"`);
    const outOfHeader = await back();
    await sleep(600);
    const afterHeader = await readPanel(cp);
    step('back from the header closes its form and shows the page', !afterHeader.chromeHost && !afterHeader.columnMarked && afterHeader.statamicFormVisible, `chromeHost=${afterHeader.chromeHost} contexts=${afterHeader.contexts} ${outOfHeader.title}`);
  }

  // 9. phase 1: a global section's rows on the panel, from its own form
  if (GLOBAL_ID) {
    await preview.evaluate((id) => window.parent.postMessage({ source: 'statamic-visual-editor', type: 'open-global-section', id }, '*'), GLOBAL_ID);
    let opened = null;
    for (let i = 0; i < 40; i++) { opened = await readPanel(cp); if (opened.shown && opened.contexts.includes('sve-global-section')) break; await sleep(250); }
    step('opening a global section paints its first row at once, from its own context', opened.shown && opened.kind === 'set' && opened.contexts.includes('sve-global-section') && opened.soloMarks === 0, `title="${opened.title}" contexts=${opened.contexts} solo=${opened.soloMarks}`);

    // The preview re-renders the section from the form's values; a block in it
    // is found there, by the id it carries now.
    let leaf = null;
    for (let i = 0; i < 40 && !leaf; i++) {
      const el = await cp.$('#live-preview-iframe');
      const pv = el ? await el.contentFrame() : null;
      leaf = pv ? await pv.evaluate(() => { const f = document.querySelector('[data-sve-global-root] [data-sid-field-uid]'); return f ? { scope: f.getAttribute('data-sid-field-uid'), field: f.getAttribute('data-sid-field') } : null; }).catch(() => null) : null;
      if (!leaf) await sleep(250);
    }
    step('the preview shows the global section with ids the form knows', !!leaf, leaf ? `${leaf.field}@${leaf.scope}` : 'no field inside [data-sve-global-root]');
    if (leaf) {
      const elNow = await cp.$('#live-preview-iframe'); const pvNow = await elNow.contentFrame();
      const gleaf3 = await thrice(pvNow, cp, { type: 'click', field: leaf.field, scope: leaf.scope, global: true }, null);
      const gleaf = await readPanel(cp);
      step('the block in the global section clicked three times gives the same panel', gleaf3.same, gleaf3.read);
      step('a block inside the global section is a row on the panel', gleaf.shown && gleaf.kind === 'set' && gleaf.title !== opened.title && gleaf.contexts.includes('sve-global-section'), `title="${gleaf.title}" back="${gleaf.back}"`);
      let steps = 0;
      let r = gleaf;
      while (r.shown && r.back !== panelStrings.page && steps < 4) { r = await back(); steps += 1; }
      step('back steps up to the global section itself', r.shown && r.title === opened.title, `title="${r.title}" after ${steps} steps`);
    }
    await back();
    await sleep(800);
    const afterGlobal = await readPanel(cp);
    step('back from the global section closes its form and shows the page', !afterGlobal.globalHost && !afterGlobal.columnMarked && !afterGlobal.contexts.includes('sve-global-section') && afterGlobal.contexts.includes('base'), `globalHost=${afterGlobal.globalHost} contexts=${afterGlobal.contexts}`);
    // And the page's own rows are still the panel's: the context survived the detour.
    await clickIn(preview, cp, { type: 'click', field: LEAF_FIELD, scope: LEAF }, leaf0Title);
    await sleep(300);
    const again = await readPanel(cp);
    step('after the global section, a page block paints as before', again.shown && again.title === leaf0Title, `title="${again.title}" contexts=${again.contexts}`);
    await back(); await back(); await back();
  }

  // 7. the old path stayed quiet
  const last = await readPanel(cp);
  step('no solo marks on the form, no lite rows mounted', last.soloMarks === 0 && last.liteRows === 0, `solo=${last.soloMarks} lite=${last.liteRows}`);
  step('no JS errors', errors.length === 0, errors.slice(0, 4).join(' | ') + (noise.length ? ` (bench noise, not counted: ${[...new Set(noise)].slice(0, 3).join(' | ')})` : ''));

  if (SHOT) {
    await clickIn(preview, cp, { type: 'click', field: LEAF_FIELD, scope: LEAF }, leaf.title);
    await sleep(400);
    await page.screenshot({ path: SHOT });
  }
} catch (e) {
  if (e.message !== 'preflight done') step('run', false, e.message.slice(0, 300));
} finally {
  if (cpForLog) {
    const log = await cpForLog.evaluate(() => (window.__sveDebug?.log || []).filter((l) => !/lite created|ctx |beforeUnmount/.test(l))).catch(() => []);
    results.push('--- editor log (selection, paint) ---', ...log.slice(-40).map((l) => '  ' + l.slice(0, 220)));
  }
  await browser.close();
  if (!NO_SEED) seed(null);
}

console.log(results.join('\n'));
process.exit(failed ? 1 : 0);
