#!/usr/bin/env node
/**
 * The header with an empty blueprint — the left panel says so and opens the
 * blueprint; a blueprint save rebuilds the header's form; the preview's bar
 * keeps its Close.
 *
 * Owner's report (21 Oct 2026, Cuben): with no fields in the header's
 * blueprint the panel showed only "Header" and "‹ Page", the preview's bar
 * (and its Close) was gone, and fields added to the blueprint appeared only
 * after a full page load. This probe, on a site copy:
 *
 *   a. writes the copy's header blueprint empty (Cuben's file, `sections: - {}`);
 *   b. opens the header from the preview (`open-chrome`, as the preview sends it):
 *      the panel shows the header tab with no field, the empty state's text and
 *      the "Add fields" door (super user), and the preview's bar has its Close;
 *      the open → paint time is reported;
 *   c. clicks the door: the fields drawer opens on the header's blueprint
 *      (`/fields/blueprints/globals/<set>/edit`); the drawer's own Save is
 *      pressed — its answer must be followed by a fetch of the globals screen
 *      (the refresh) — and the drawer is closed with its Close;
 *   d. writes a blueprint with one text field (`probe_text`) and calls
 *      `__sveDebug.refreshChromeForm(<set>)`: within 2 s the panel draws that
 *      one field, the door is gone, the title is the same, the bar still says
 *      "no changes" with no Save, no globals stash was posted, and Live
 *      Preview's own Save/Publish buttons did not change;
 *   e. types into the new field: the bar turns to "changed", and the globals
 *      stash POST (`/!/sve/globals-preview`) carries the typed text — the
 *      site's header template does not render `probe_text`, so the stash is
 *      what is observable; then refreshes again with the edit unsaved: the
 *      typed text is still in the field and the bar still says "changed";
 *   f. the back arrow ("‹ Page") closes the header form and shows the page;
 *   g. no JS errors in the CP or the preview (bench noise listed apart);
 *   h. puts the blueprint back as it found it (always, also after a failure).
 *
 *   SVE_SITE_DIR   REQUIRED — the site copy; its header blueprint is rewritten
 *                  and restored, so never point this at a real site
 *   SVE_SITE_URL / SVE_USER / SVE_PASS   as in the smoke test
 *   SVE_ENTRY      an entry to open in Live Preview (default: the selection-panel test's)
 *   SVE_HEADER_SET the header's global set (default `site_head`)
 *   SVE_NO_SEED=1  do not touch the user's preference file
 *
 *   SVE_SITE_DIR=<copy> SVE_SITE_URL=http://127.0.0.1:8765 SVE_PASS=… node tests/browser/header-empty-state.mjs
 */
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const env = (key, fallback) => process.env[key] || fallback;

if (!process.env.SVE_SITE_DIR) {
  console.error('SVE_SITE_DIR is required: this probe rewrites that site\'s header blueprint (and puts it back). Point it at a disposable copy.');
  process.exit(2);
}

const SITE_DIR = process.env.SVE_SITE_DIR;
const SITE_URL = env('SVE_SITE_URL', 'http://127.0.0.1:8765');
const USER = env('SVE_USER', 'claude-test@vizuall.dk');
const PASS = env('SVE_PASS', '');
const ENTRY = env('SVE_ENTRY', '/cp/collections/pages/entries/827310c8-9f8b-4c10-a157-634a0d0f82d5');
const HEADER_SET = env('SVE_HEADER_SET', 'site_head');
const CHROME = env('SVE_CHROME', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome');
const NO_SEED = process.env.SVE_NO_SEED === '1';
const puppeteer = createRequire(`${SITE_DIR}/package.json`)('puppeteer');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// --- the copy's header blueprint -------------------------------------------
const BLUEPRINT = `${SITE_DIR}/resources/blueprints/globals/${HEADER_SET}.yaml`;
const ORIGINAL = readFileSync(BLUEPRINT, 'utf8');
// Cuben's file as the owner had it: one tab, one section, no field.
const EMPTY = 'title: Header\ntabs:\n  header:\n    display: Header\n    sections:\n      - {}\n';
const ONE_FIELD = [
  'title: Header',
  'tabs:',
  '  header:',
  '    display: Header',
  '    sections:',
  '      -',
  '        fields:',
  '          -',
  '            handle: probe_text',
  '            field:',
  '              type: text',
  '              display: Probe',
  '',
].join('\n');

function writeBlueprint(text) {
  writeFileSync(BLUEPRINT, text);
  // Blueprints are read from their files on every request (Statamic keeps them
  // in Blink, per request); the cache is cleared as a page load after an edit
  // on a server would find it.
  execFileSync('php', ['artisan', 'cache:clear'], { cwd: SITE_DIR, stdio: 'ignore' });
}

// --- the user's layout -----------------------------------------------------
const USER_FILE = `${SITE_DIR}/users/${USER}.yaml`;
const USER_ORIGINAL = readFileSync(USER_FILE, 'utf8');
function seed(prefs) {
  let yaml = readFileSync(USER_FILE, 'utf8').replace(/^  sve_chrome:\n(?:    .*\n)*/m, '');
  if (prefs) {
    const block = `  sve_chrome:\n${Object.entries(prefs).map(([k, v]) => `    ${k}: '${String(v).replace(/'/g, "''")}'\n`).join('')}`;
    yaml = /^preferences:\n/m.test(yaml) ? yaml.replace(/^preferences:\n/m, `preferences:\n${block}`) : `${yaml.replace(/\n*$/, '\n')}preferences:\n${block}`;
  }
  writeFileSync(USER_FILE, yaml);
}

const results = [];
let failed = 0;
let lastStep = 'start';
function step(name, ok, note = '') {
  lastStep = name;
  results.push(`${ok ? 'ok  ' : 'FAIL'} ${name}${note ? ` — ${note}` : ''}`);
  if (!ok) failed++;
}

let browser = null;

try {
  writeBlueprint(EMPTY);
  if (!NO_SEED) seed({ 'sve-lp-panel-mode': 'show', 'sve-lp-collapsed': '0' });

  browser = await puppeteer.launch({ headless: true, executablePath: CHROME, args: ['--window-size=1440,900'], defaultViewport: { width: 1440, height: 900 } });
  const page = await browser.newPage();
  await page.evaluateOnNewDocument(() => { window.__sveDebug = { ran: [] }; });

  const errors = [];
  const noise = [];
  // Failures of the bench, not of the editor: another addon's endpoint refusing
  // the session on a bare host, Inertia's version check after a rebuild, and
  // Statamic's own `null.options` in the CP.
  const isNoise = (text) => /\/cp\/color-scheme\/|\/cp\/bard-style\/|invalid domain|409 |auth\/login|reading 'options'/.test(text);
  const note = (text) => (isNoise(text) ? noise : errors).push(`${text} [after: ${lastStep}]`);
  page.on('pageerror', (e) => note(`pageerror ${e.message.slice(0, 160)} @ ${(e.stack || '').split('\n').slice(1, 3).join(' ').replace(SITE_URL, '').slice(0, 200)}`));
  page.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) note(`console ${m.text().slice(0, 160)}`); });
  page.on('response', (r) => { if (r.status() >= 400) note(`${r.status()} ${r.url().replace(SITE_URL, '').slice(0, 120)}`); });

  // Every request the run cares about, timed: the globals screen (the form's
  // fetch and the warm-up), the blueprint save, the globals stash.
  const net = [];
  const screenPath = `/cp/globals/${HEADER_SET}`;
  page.on('request', (r) => {
    const url = r.url().replace(SITE_URL, '');
    if (url.split('?')[0] === screenPath && r.headers()['x-inertia']) net.push({ at: Date.now(), kind: 'screen', url });
    if (r.method() === 'POST' && url.startsWith('/!/sve/globals-preview') && !url.includes('/clear')) net.push({ at: Date.now(), kind: 'stash', body: r.postData() || '' });
  });
  page.on('response', (r) => {
    const url = r.url().replace(SITE_URL, '');
    if (r.request().method() === 'PATCH' && url.startsWith(`/cp/fields/blueprints/globals/${HEADER_SET}`)) net.push({ at: Date.now(), kind: 'blueprint-save', status: r.status() });
  });

  // --- login and Live Preview (as tests/browser/selection-panel.mjs) ---------
  await page.goto(`${SITE_URL}/cp`, { waitUntil: 'networkidle2' });
  if (await page.$('input[name="email"]')) {
    await page.type('input[name="email"]', USER);
    await page.type('input[name="password"]', PASS);
    // Statamic answers the login with a 409 (Inertia version) and sends the
    // browser to /cp/login; the session is set all the same.
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

  // The preview's document is replaced by a full render now and then; always
  // ask for the current one.
  const previewNow = async () => {
    const el = await cp.$('#live-preview-iframe');
    return el ? el.contentFrame() : null;
  };
  let preview = null;
  for (let i = 0; i < 30; i++) {
    preview = await previewNow();
    const ready = preview ? await preview.evaluate(() => !!document.querySelector('[data-sve-chrome="header"], header')).catch(() => false) : false;
    if (ready) break;
    await sleep(1000);
  }
  await sleep(2500);

  // The words, as this user's CP and the preview have them — read, not assumed.
  const cpStrings = await cp.evaluate(() => {
    const s = window.Statamic?.$config?.get?.('sveStrings') || {};
    return { noFields: s.selection_no_fields ?? null, addFields: s.selection_add_fields ?? null };
  });
  const barStrings = await preview.evaluate(() => {
    const s = window.__sveStrings || {};
    return { close: s.close ?? null, clean: s.chrome_bar_clean ?? null, dirty: s.chrome_bar_dirty ?? null, save: s.save ?? null };
  });
  step('strings (informational)', true, `panel: "${cpStrings.noFields}" / "${cpStrings.addFields}"; bar: "${barStrings.close}" / "${barStrings.clean}" / "${barStrings.dirty}"`);

  const PANEL = '#__sve-selection-panel [data-sve-selection-panel]';
  const readPanel = () => cp.evaluate((sel) => {
    const visible = (el) => !!el && el.getClientRects().length > 0;
    const col = document.querySelector('.live-preview-fields') || document.querySelector('.live-preview-editor');
    const root = document.querySelector(sel);
    const groups = root ? [...root.querySelectorAll('.form-group')].filter(visible) : [];
    const empty = root?.querySelector('[data-sve-selection-empty]') || null;
    const door = root?.querySelector('[data-sve-selection-fields-door]') || null;
    return {
      shown: visible(root),
      kind: root?.getAttribute('data-sve-selection-kind') || '',
      title: root?.querySelector('.sve-sel__title')?.textContent.trim() || '',
      back: root?.querySelector('.sve-sel__back')?.textContent.trim().replace(/^‹\s*/, '') || '',
      formGroups: groups.length,
      probeField: groups.some((g) => g.outerHTML.includes('probe_text')),
      empty: visible(empty),
      emptyText: empty?.querySelector('p')?.textContent.trim() || '',
      door: visible(door),
      doorText: door?.textContent.trim() || '',
      chromeHost: !!document.getElementById('__sve-chrome-host'),
      columnMarked: !!col?.hasAttribute('data-sve-selection'),
      contexts: (window.__sveDebug?.contexts?.() || []).join('+'),
      statamicFormVisible: [...(col?.querySelectorAll('.form-group, [data-sve-lite]') || [])].some((el) => !el.closest('#__sve-selection-panel') && !el.closest('#__sve-chrome-host') && visible(el) && getComputedStyle(el).visibility !== 'hidden'),
    };
  }, PANEL);

  const readBar = async () => {
    const pv = await previewNow();
    return pv
      ? pv.evaluate(() => {
          const bar = document.getElementById('__sve-chrome-bar');
          const buttons = bar ? [...bar.querySelectorAll('button')] : [];
          return {
            exists: !!bar,
            text: bar?.textContent.replace(/\s+/g, ' ').trim() || '',
            buttons: buttons.filter((b) => b.style.display !== 'none').map((b) => b.textContent.trim()),
          };
        }).catch(() => ({ exists: false, text: '', buttons: [] }))
      : { exists: false, text: '', buttons: [] };
  };

  // Live Preview's own Save / Publish, as the eye sees them.
  const readLpSave = () => cp.evaluate(() =>
    [...document.querySelectorAll('.live-preview-header button')]
      .filter((b) => /save|publish|gem|udgiv/i.test(b.textContent || ''))
      .map((b) => `${b.textContent.trim()}:${b.disabled ? 'off' : 'on'}`)
      .join(' | ')
  );

  // --- b. open the empty header ---------------------------------------------
  // Timed in the CP frame, frame by frame: the open message → the first frame
  // with the panel's title painted and the column marked.
  await cp.evaluate(() => {
    const t0 = performance.now();
    window.__sveOpenMs = null;
    const tick = () => {
      const title = document.querySelector('#__sve-selection-panel .sve-sel__title')?.textContent.trim() || '';
      const marked = !!(document.querySelector('.live-preview-fields') || document.querySelector('.live-preview-editor'))?.hasAttribute('data-sve-selection');
      if (title && marked) { window.__sveOpenMs = performance.now() - t0; return; }
      if (performance.now() - t0 < 5000) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
  await preview.evaluate(() => window.parent.postMessage({ source: 'statamic-visual-editor', type: 'open-chrome', kind: 'header' }, '*'));
  let openMs = null;
  for (let t0 = Date.now(); Date.now() - t0 < 5000 && openMs == null; ) { openMs = await cp.evaluate(() => window.__sveOpenMs); if (openMs == null) await sleep(16); }
  await sleep(1200);
  const opened = await readPanel();
  step('opening the empty header shows its tab on the panel', opened.shown && opened.kind === 'tab' && opened.chromeHost && opened.contexts.includes('sve-chrome'), `title="${opened.title}" kind=${opened.kind} contexts=${opened.contexts}`);
  step('the empty header tab has no field (no .form-group)', opened.shown && opened.formGroups === 0, `formGroups=${opened.formGroups}`);
  step('the panel says the header has no fields', opened.empty && !!cpStrings.noFields && opened.emptyText === cpStrings.noFields, `empty=${opened.empty} text="${opened.emptyText}"`);
  step('the panel offers the door to the header\'s fields (super user)', opened.door && opened.doorText === cpStrings.addFields, `door=${opened.door} text="${opened.doorText}"`);
  step('open message → painted panel (informational)', true, openMs == null ? 'not painted within 5 s' : `${Math.round(openMs)} ms`);
  const barOpen = await readBar();
  step('the preview\'s header bar stands, with its Close', barOpen.exists && !!barStrings.close && barOpen.buttons.includes(barStrings.close), `bar=${barOpen.exists} buttons=[${barOpen.buttons.join(', ')}] "${barOpen.text.slice(0, 80)}"`);
  step('the bar says nothing has changed', barOpen.exists && barOpen.text.includes(barStrings.clean) && !barOpen.buttons.includes(barStrings.save), `"${barOpen.text.slice(0, 80)}"`);

  // --- c. the door: the header's blueprint in the fields drawer --------------
  if (opened.door) {
    await cp.evaluate(() => document.querySelector('[data-sve-selection-fields-door]')?.click());
    let src = '';
    for (let i = 0; i < 40 && !src; i++) { src = await cp.evaluate(() => document.querySelector('.sve-fs-overlay iframe')?.getAttribute('src') || ''); if (!src) await sleep(100); }
    step('the door opens the header\'s blueprint in the fields drawer', src.includes(`/fields/blueprints/globals/${HEADER_SET}/edit`), `src=${src || '(no drawer)'}`);

    // The drawer's own Save: Statamic's blueprint builder saves whatever it
    // holds, changed or not; its answer must be followed by the refresh's fetch
    // of the globals screen.
    let saveAnswer = null;
    let refreshFetches = [];
    const drawerEl = await cp.$('.sve-fs-overlay iframe');
    const drawer = drawerEl ? await drawerEl.contentFrame() : null;
    let saveBtn = null;
    for (let i = 0; i < 60 && drawer && !saveBtn; i++) {
      saveBtn = await drawer.evaluateHandle(() => {
        const label = typeof window.__ === 'function' ? window.__('Save') : 'Save';
        return [...document.querySelectorAll('button')].find((b) => b.textContent.trim() === label && b.getClientRects().length > 0) || null;
      }).catch(() => null);
      if (saveBtn && !(await saveBtn.evaluate((b) => !!b).catch(() => false))) saveBtn = null;
      if (!saveBtn) await sleep(250);
    }
    if (saveBtn) {
      const mark = Date.now();
      await saveBtn.evaluate((b) => b.click());
      for (let t0 = Date.now(); Date.now() - t0 < 8000 && !saveAnswer; ) { saveAnswer = net.find((n) => n.kind === 'blueprint-save' && n.at >= mark) || null; if (!saveAnswer) await sleep(50); }
      if (saveAnswer) {
        await sleep(2500);
        refreshFetches = net.filter((n) => n.kind === 'screen' && n.at >= saveAnswer.at);
      }
      step('the drawer\'s Save goes through', !!saveAnswer && saveAnswer.status >= 200 && saveAnswer.status < 300, saveAnswer ? `PATCH ${saveAnswer.status}` : 'no PATCH answer within 8 s');
      step('the blueprint save is followed by a fetch of the header\'s globals screen (the refresh)', refreshFetches.length >= 1, `screen fetches after the save: ${refreshFetches.length}${refreshFetches.length ? ` (first after ${refreshFetches[0].at - saveAnswer.at} ms)` : ''}`);
    } else {
      step('the drawer\'s Save goes through', false, 'no Save button in the drawer');
    }

    await cp.evaluate(() => document.querySelector('.sve-fs-overlay .sve-fs__bar button')?.click());
    await sleep(600);
    const drawerGone = await cp.evaluate(() => !document.querySelector('.sve-fs-overlay'));
    const afterDrawer = await readPanel();
    step('the drawer closes with its Close; the header tab is still on the panel, still empty, door still there', drawerGone && afterDrawer.shown && afterDrawer.kind === 'tab' && afterDrawer.title === opened.title && afterDrawer.empty && afterDrawer.door, `drawerGone=${drawerGone} title="${afterDrawer.title}" empty=${afterDrawer.empty} door=${afterDrawer.door}`);
    const barAfterDrawer = await readBar();
    step('after the blueprint save the bar is still there and still clean', barAfterDrawer.exists && barAfterDrawer.text.includes(barStrings.clean), `"${barAfterDrawer.text.slice(0, 80)}"`);
  } else {
    step('the door opens the header\'s blueprint in the fields drawer', false, 'no door on the panel');
  }

  // --- d. a field in the blueprint; the form rebuilt on it -------------------
  writeBlueprint(ONE_FIELD);
  const lpSaveBefore = await readLpSave();
  const stashesBefore = net.filter((n) => n.kind === 'stash').length;
  const refresh = await cp.evaluate(async (handle) => {
    if (typeof window.__sveDebug?.refreshChromeForm !== 'function') {
      return { missing: true };
    }
    const t0 = performance.now();
    const painted = new Promise((resolve) => {
      const tick = () => {
        const group = [...document.querySelectorAll('#__sve-selection-panel [data-sve-selection-panel] .form-group')].find((el) => el.outerHTML.includes('probe_text'));
        if (group) return resolve(performance.now() - t0);
        if (performance.now() - t0 > 2000) return resolve(null);
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    const ok = await window.__sveDebug.refreshChromeForm(handle);
    return { ok, resolvedMs: performance.now() - t0, paintedMs: await painted };
  }, HEADER_SET);
  // Past the settle window, so a late report from the new form would have landed.
  await sleep(1500);
  const refreshed = await readPanel();
  step('refreshChromeForm is there (test hook)', !refresh.missing, refresh.missing ? 'window.__sveDebug.refreshChromeForm is not a function' : `resolved ${refresh.ok} in ${Math.round(refresh.resolvedMs)} ms`);
  step('within 2 s the panel draws the new field', refresh.paintedMs != null && refreshed.formGroups === 1 && refreshed.probeField, `painted=${refresh.paintedMs == null ? 'no' : `${Math.round(refresh.paintedMs)} ms`} formGroups=${refreshed.formGroups} probe=${refreshed.probeField}`);
  step('the door and the empty text are gone', !refreshed.door && !refreshed.empty, `door=${refreshed.door} empty=${refreshed.empty}`);
  step('the panel is still the header tab, same title', refreshed.shown && refreshed.kind === 'tab' && refreshed.title === opened.title && refreshed.contexts.includes('sve-chrome'), `title="${refreshed.title}" kind=${refreshed.kind} contexts=${refreshed.contexts}`);
  const barRefreshed = await readBar();
  step('the bar is still there and still clean (the refresh is not an edit)', barRefreshed.exists && barRefreshed.text.includes(barStrings.clean) && !barRefreshed.buttons.includes(barStrings.save), `buttons=[${barRefreshed.buttons.join(', ')}] "${barRefreshed.text.slice(0, 80)}"`);
  const stashesAfterRefresh = net.filter((n) => n.kind === 'stash').length - stashesBefore;
  step('the refresh posted no globals stash', stashesAfterRefresh === 0, `stash POSTs=${stashesAfterRefresh}`);
  const lpSaveAfter = await readLpSave();
  step('Live Preview\'s Save/Publish did not change', lpSaveAfter === lpSaveBefore, `before "${lpSaveBefore}" after "${lpSaveAfter}"`);

  // --- e. typing into the new field still reaches the stash ------------------
  const typed = `Probe ${Date.now().toString(36)}`;
  const input = await cp.$(`${PANEL} .form-group input[type="text"], ${PANEL} .form-group input:not([type])`);
  if (input && refreshed.probeField) {
    const mark = Date.now();
    await input.click();
    await input.type(typed);
    let dirtyBar = null;
    for (let t0 = Date.now(); Date.now() - t0 < 3000; ) { dirtyBar = await readBar(); if (dirtyBar.text.includes(barStrings.dirty)) break; await sleep(100); }
    let stash = null;
    for (let t0 = Date.now(); Date.now() - t0 < 3000 && !stash; ) { stash = net.find((n) => n.kind === 'stash' && n.at >= mark && n.body.includes(typed)) || null; if (!stash) await sleep(100); }
    step('typing in the new field turns the bar to "changed"', dirtyBar.text.includes(barStrings.dirty), `"${dirtyBar.text.slice(0, 80)}" buttons=[${dirtyBar.buttons.join(', ')}]`);
    step('the typed text goes to the globals stash (the header template does not render probe_text)', !!stash, stash ? `POST /!/sve/globals-preview ${stash.at - mark} ms after the first key` : 'no stash POST with the typed text within 3 s');

    // A blueprint save with the edit still unsaved: what is typed stays, and so
    // does "changed".
    await cp.evaluate((handle) => window.__sveDebug?.refreshChromeForm?.(handle), HEADER_SET);
    await sleep(1500);
    const kept = await cp.evaluate((sel) => document.querySelector(`${sel} .form-group input`)?.value ?? null, PANEL);
    const barKept = await readBar();
    step('a refresh with an unsaved edit keeps the typed text in the field', kept === typed, `value="${kept}"`);
    step('… and the bar still says "changed"', barKept.text.includes(barStrings.dirty) && barKept.buttons.includes(barStrings.save), `"${barKept.text.slice(0, 80)}" buttons=[${barKept.buttons.join(', ')}]`);
  } else {
    step('typing in the new field turns the bar to "changed"', false, 'no text input for probe_text on the panel');
  }

  // --- f. back to the page ---------------------------------------------------
  await cp.evaluate((sel) => document.querySelector(`${sel} .sve-sel__back`)?.click(), PANEL);
  await sleep(1000);
  const out = await readPanel();
  step('the back arrow closes the header form and shows the page', !out.chromeHost && !out.columnMarked && out.statamicFormVisible, `chromeHost=${out.chromeHost} marked=${out.columnMarked} formVisible=${out.statamicFormVisible} contexts=${out.contexts}`);

  // --- g. -------------------------------------------------------------------
  step('no JS errors in the CP or the preview', errors.length === 0, errors.slice(0, 4).join(' | ') + (noise.length ? ` (bench noise, not counted: ${[...new Set(noise.map((n) => n.replace(/ \[after: .*$/, '')))].slice(0, 4).join(' | ')})` : ''));
  step('network (informational)', true, net.map((n) => `${n.kind}${n.status ? `:${n.status}` : ''}`).join(' '));
} catch (e) {
  step('run', false, e.message.slice(0, 300));
} finally {
  if (browser) await browser.close();
  // --- h. leave the copy as it was found -----------------------------------
  writeBlueprint(ORIGINAL);
  if (!NO_SEED) writeFileSync(USER_FILE, USER_ORIGINAL);
  step('the header blueprint is put back', readFileSync(BLUEPRINT, 'utf8') === ORIGINAL);
}

console.log(results.join('\n'));
process.exit(failed ? 1 : 0);
