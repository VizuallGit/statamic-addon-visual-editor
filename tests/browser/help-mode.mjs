#!/usr/bin/env node
/**
 * Help mode in the HTML pane, in a real Live Preview with real keypresses.
 *
 * Off from the start: the switch's icon is there and not pressed, a click into
 * a tag fetches nothing (no /!/sve/data-vars, no help-editor chunk). The
 * default ticked in ⋮ → HTML tree turns it on for this Live Preview (icon
 * pressed, the editor chunk loads); unticked turns it off again. The icon
 * switches it on by hand. `<ul>` typed on a new line opens the popup with the
 * loop over the section's replicator; Tab writes it, with the loop's own tag
 * and `{{ /… }}`; ⌘Z takes it back in one step. Tab with no popup open is the
 * editor's own (nothing of ours written).
 *
 * The run never saves the editor layout to the server: every write to
 * /!/sve/chrome-prefs is answered here and goes nowhere. The dock autosaves to
 * the section's file on the site: it is backed up before typing and written
 * back afterwards.
 *
 * Timings printed (`info`): Live Preview open and dock open, so a run with
 * SVE_WORKTREE=1 (this build) and one without (the installed build) can be
 * compared — help off must not cost the preview anything.
 *
 *   cd ~/Sites/vizuall-skabelon && SVE_PASS='…' SVE_WORKTREE=1 \
 *     node ~/Sites/statamic-addon-visual-editor-vue/tests/browser/help-mode.mjs
 *
 * SVE_PERF_ONLY=1 stops after the dock opens (for the installed build, which
 * has no help). Same env as live-preview-smoke.mjs.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { serveWorktreeBuild } from './serve-worktree.mjs';

const env = (key, fallback) => process.env[key] || fallback;
const SITE_DIR = env('SVE_SITE_DIR', `${process.env.HOME}/Sites/vizuall-skabelon`);
const SITE_URL = env('SVE_SITE_URL', 'http://vizuall-skabelon.test');
const USER = env('SVE_USER', 'claude-test@vizuall.dk');
const PASS = env('SVE_PASS', '');
const ENTRY = env('SVE_ENTRY', '/cp/collections/pages/entries/827310c8-9f8b-4c10-a157-634a0d0f82d5');
const CHROME = env('SVE_CHROME', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome');
const ADDON_DIR = env('SVE_ADDON_DIR', `${process.env.HOME}/Sites/statamic-addon-visual-editor-vue`);
const WORKTREE = env('SVE_WORKTREE', '') === '1';
const PERF_ONLY = env('SVE_PERF_ONLY', '') === '1';
const SHOTS = env('SVE_SHOTS', '');

const puppeteer = createRequire(`${SITE_DIR}/package.json`)('puppeteer');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const errors = [];
let failed = 0;
const step = (name, ok, detail = '') => {
  failed += ok ? 0 : 1;
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${name}${detail ? ` — ${detail}` : ''}`);
};
const info = (text) => console.log(`info ${text}`);

const DOCK = '#__sve-code-dock';
const PANE = `${DOCK} [data-sve-code-pane="html"]`;
const HELP_BTN = `${DOCK} [data-sve-help-btn]`;
const POPUP = '[data-sve-help-popup]';
const MORE = '#__sve-lp-more';
const MENU = '#__sve-lp-more-menu';

const USER_FILE = `${SITE_DIR}/users/${USER}.yaml`;
const userYaml = existsSync(USER_FILE) ? readFileSync(USER_FILE, 'utf8') : null;

const blockPrefsWrite = (req) => {
  if (req.method() === 'GET' || !req.url().includes('/!/sve/chrome-prefs')) {
    return false;
  }

  req.respond({ status: 200, contentType: 'application/json', body: '{"ok":true}' });

  return true;
};

async function pointIn(frame, selector) {
  const r = await frame.evaluate((sel) => {
    const el = [...document.querySelectorAll(sel)].find((node) => {
      const b = node.getBoundingClientRect();

      return b.width > 0 && b.height > 0;
    });

    if (!el) {
      return null;
    }

    el.scrollIntoView({ block: 'center' });

    const b = el.getBoundingClientRect();

    return { x: b.x + b.width / 2, y: b.y + Math.min(b.height / 2, 300) };
  }, selector);

  if (!r) {
    throw new Error(`nothing visible for ${selector}`);
  }

  for (let f = frame; f.parentFrame(); f = f.parentFrame()) {
    const box = await (await f.frameElement()).boundingBox();

    r.x += box.x;
    r.y += box.y;
  }

  return r;
}

async function click(page, frame, selector) {
  const { x, y } = await pointIn(frame, selector);

  await page.mouse.click(x, y);
}

async function waitFor(frame, fn, arg, ms = 10000) {
  const t0 = Date.now();

  while (Date.now() - t0 < ms) {
    if (await frame.evaluate(fn, arg).catch(() => false)) {
      return true;
    }

    await sleep(100);
  }

  return false;
}

const has = (frame, selector) => frame.evaluate((sel) => !!document.querySelector(sel), selector);
const waitSeen = (frame, selector, ms = 8000) => waitFor(frame, (sel) => !!document.querySelector(sel), selector, ms);
const waitGone = (frame, selector, ms = 8000) => waitFor(frame, (sel) => !document.querySelector(sel), selector, ms);
const shot = async (page, name) => SHOTS && page.screenshot({ path: `${SHOTS}/help-mode-${name}.png` });

/** The HTML pane's CodeMirror view, asked through the element CodeMirror hangs it on. */
const VIEW_OF = `(() => { const c = document.querySelector('${PANE} .cm-content'); return c?.cmView?.view || c?.cmTile?.view || null; })()`;
const paneDoc = (cp) => cp.evaluate(`${VIEW_OF}?.state.doc.toString() ?? null`);
const pressed = (cp) => cp.evaluate((sel) => document.querySelector(sel)?.getAttribute('aria-pressed') ?? null, HELP_BTN);
const helpLoaded = (requests) => requests.some((url) => /help-editor-[\w-]+\.js/.test(url));
const dataVarsCount = (requests) => requests.filter((url) => url.includes('/!/sve/data-vars')).length;

/** Caret right after the root tag's `>`, a new line opened there; the pane's text as it was. */
async function newLineAfterRoot(cp) {
  return cp.evaluate(`(() => {
    const view = ${VIEW_OF};
    if (!view) return null;
    const doc = view.state.doc.toString();
    const open = doc.search(/<(section|div|article|header)\\b/);
    if (open < 0) return null;
    const close = doc.indexOf('>', open);
    if (close < 0) return null;
    view.dispatch({ selection: { anchor: close + 1 }, scrollIntoView: true });
    view.focus();
    return { before: doc, at: close + 1 };
  })()`);
}

async function openLivePreview(page) {
  const t0 = Date.now();

  await page.goto(`${SITE_URL}${ENTRY}`, { waitUntil: 'networkidle2' });
  await sleep(1500);

  if (!(await page.$('iframe.sve-edit-overlay[data-open]'))) {
    await page.evaluate((re) => [...document.querySelectorAll('button, a')].find((el) => new RegExp(re, 'i').test(el.textContent || ''))?.click(), 'live preview|forhåndsvisning');
    await page.waitForSelector('iframe.sve-edit-overlay[data-open]', { timeout: 30000 });
  }

  const cp = await (await page.$('iframe.sve-edit-overlay')).contentFrame();

  await page.keyboard.press('Escape');
  await cp.waitForSelector('#__sve-toolbar button', { timeout: 60000 });

  const ms = Date.now() - t0;

  await sleep(3000);

  return { cp, ms };
}

const livePreview = async (cp) => {
  const el = await cp.$('#live-preview-iframe');

  return el ? el.contentFrame() : null;
};

async function openDock(page, cp) {
  let hasSection = false;

  for (let i = 0; i < 25 && !hasSection; i++) {
    const p = await livePreview(cp);

    hasSection = p ? await p.evaluate(() => !!document.querySelector('[id^="id-"]')).catch(() => false) : false;

    if (!hasSection) {
      await sleep(1000);
    }
  }

  step('preview section rendered', hasSection);

  // A section laid out in the preview is clicked there; one without a height
  // (an empty section on this page) is picked from the HTML tree instead.
  const visible = (sel) => [...document.querySelectorAll(sel)].some((el) => {
    const b = el.getBoundingClientRect();

    return b.width > 0 && b.height > 0;
  });

  if (await waitFor(await livePreview(cp), visible, '[id^="id-"]', 5000)) {
    await click(page, await livePreview(cp), '[id^="id-"]');
    await sleep(2000);
  }

  const t0 = Date.now();
  let dock = await has(cp, `${PANE} .cm-editor`);

  for (let attempt = 1; attempt <= 2 && !dock; attempt++) {
    await click(page, cp, '#__sve-toolbar button[data-tab="code"]');
    await sleep(600);
    dock = await waitSeen(cp, `${PANE} .cm-editor`, 15000);

    if (!dock) {
      await sleep(2000);
    }
  }

  const ms = Date.now() - t0;

  step('code dock open with an HTML pane', dock);
  await sleep(1500);

  const hasFile = () => cp.evaluate((sel) => !!document.querySelector(`${sel} [data-sve-code-path]`)?.getAttribute('data-sve-code-path'), DOCK);

  if (!(await hasFile())) {
    if (!(await has(cp, '[data-sve-ht-row]'))) {
      await click(page, cp, `${DOCK} [data-sve-html-scope]`);
      await waitSeen(cp, '[data-sve-ht-row]', 8000);
    }

    await click(page, cp, '[data-sve-ht-row][data-sve-ht-sec] [data-sve-ht-name], [data-sve-ht-row][data-sve-ht-sec]');
    await waitFor(cp, (sel) => !!document.querySelector(`${sel} [data-sve-code-path]`)?.getAttribute('data-sve-code-path'), DOCK, 10000);
    await sleep(1500);
  }

  return ms;
}

async function unlockDock(page, cp) {
  const locked = await cp.evaluate((sel) => document.querySelector(sel)?.hasAttribute('data-sve-code-locked'), DOCK);

  if (!locked) {
    return true;
  }

  await click(page, cp, `${DOCK} [data-sve-code-lock]`);

  if (await waitSeen(cp, '.sve-dialog .sve-dialog__actions button', 8000)) {
    const box = await (await cp.frameElement()).boundingBox();
    const r = await cp.evaluate(() => {
      const b = [...document.querySelectorAll('.sve-dialog .sve-dialog__actions button')].pop();
      const q = b.getBoundingClientRect();

      return { x: q.x + q.width / 2, y: q.y + q.height / 2 };
    });

    await page.mouse.click(box.x + r.x, box.y + r.y);
  }

  return waitFor(cp, (sel) => !document.querySelector(sel)?.hasAttribute('data-sve-code-locked'), DOCK, 10000);
}

async function openMenuTab(page, cp, tab) {
  if (!(await cp.$(MENU))) {
    await click(page, cp, MORE);
    await cp.waitForSelector(MENU, { timeout: 5000 });
  }

  await click(page, cp, `${MENU} [data-sve-lp-settings-tab="${tab}"]`);
  await sleep(250);
}

async function closeMenu(page, cp) {
  if (await cp.$(MENU)) {
    await page.keyboard.press('Escape');
    await waitGone(cp, MENU, 3000);
  }
}

/** Tick or untick one of the help's rows in ⋮ → HTML tree (by its string key); leaves the menu closed. */
async function setHelpTick(page, cp, key, on) {
  await openMenuTab(page, cp, 'tree');

  const hit = await cp.evaluate((menu, k) => {
    // The strings are PHP's (sveStrings); a site whose PHP is older than this
    // build shows the key itself, so both are looked for.
    const label = window.Statamic?.$config?.get?.('sveStrings')?.[k] || k;
    const row = [...document.querySelectorAll(`${menu} label.sve-lp-settings__row`)].find((el) => (el.textContent || '').trim() === label.trim());
    const box = row?.querySelector('input[type="checkbox"]');

    if (!box) {
      return null;
    }

    box.scrollIntoView({ block: 'center' });

    const b = box.getBoundingClientRect();

    return { x: b.x + b.width / 2, y: b.y + b.height / 2, checked: box.checked };
  }, MENU, key);

  if (!hit) {
    await closeMenu(page, cp);

    return false;
  }

  if (hit.checked !== on) {
    const box = await (await cp.frameElement()).boundingBox();

    await page.mouse.click(box.x + hit.x, box.y + hit.y);
    await sleep(300);
  }

  await closeMenu(page, cp);
  await sleep(300);

  return true;
}

const browser = await puppeteer.launch({ headless: true, executablePath: CHROME, args: ['--window-size=1440,900'], defaultViewport: { width: 1440, height: 900 } });
const page = await browser.newPage();
const requests = [];

await page.evaluateOnNewDocument((path) => {
  const real = window.fetch;

  window.fetch = function fetch(input, init) {
    const url = typeof input === 'string' ? input : input?.url || '';
    const method = String(init?.method || input?.method || 'GET').toUpperCase();

    if (url.includes(path) && method !== 'GET') {
      return Promise.resolve(new Response('{"ok":true}', { status: 200, headers: { 'Content-Type': 'application/json' } }));
    }

    return real.apply(this, arguments);
  };
}, '/!/sve/chrome-prefs');

page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
page.on('console', (m) => m.type() === 'error' && errors.push(`console: ${m.text().slice(0, 200)}`));
page.on('response', (r) => r.status() >= 500 && errors.push(`HTTP ${r.status()} ${r.request().method()} ${r.url().replace(SITE_URL, '').slice(0, 140)}`));
page.on('request', (req) => requests.push(req.url()));

if (WORKTREE) {
  await serveWorktreeBuild(page, {
    buildDir: `${ADDON_DIR}/resources/dist/build`,
    installedManifest: env('SVE_INSTALLED_MANIFEST', `${SITE_DIR}/public/vendor/visual-editor/build/manifest.json`),
    scriptsDir: `${ADDON_DIR}/resources/js`,
    extra: blockPrefsWrite,
  });
  info(`build served from ${ADDON_DIR}`);
} else {
  await page.setRequestInterception(true);
  page.on('request', (req) => {
    if (!blockPrefsWrite(req)) {
      req.continue();
    }
  });
  info('the installed build');
}

if (userYaml !== null) {
  writeFileSync(USER_FILE, userYaml.replace(/^  sve_chrome:\n(?:    .*\n)*/m, ''));
}

let filePath = null;
let original = null;

try {
  await page.goto(`${SITE_URL}/cp`, { waitUntil: 'networkidle2' });
  await page.waitForSelector('input[name="email"]', { timeout: 15000 });
  await page.type('input[name="email"]', USER);
  await page.type('input[name="password"]', PASS);
  await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle2' }), page.keyboard.press('Enter')]);
  step('login', !/login/.test(page.url()));
  errors.length = 0;

  const { cp, ms: lpMs } = await openLivePreview(page);

  info(`live preview open in ${lpMs} ms`);

  const dockMs = await openDock(page, cp);

  info(`dock open in ${dockMs} ms`);

  if (PERF_ONLY) {
    throw Object.assign(new Error('perf only'), { perfOnly: true });
  }

  filePath = await cp.evaluate((sel) => {
    const el = document.querySelector(`${sel} [data-sve-code-path], [data-sve-code-path]`);

    return el ? el.getAttribute('data-sve-code-path') || el.textContent.trim() : '';
  }, DOCK);

  const abs = filePath && (filePath.startsWith('/') ? filePath : `${SITE_DIR}/${filePath}`);

  if (abs && existsSync(abs)) {
    original = readFileSync(abs, 'utf8');
  }

  step('section file backed up', !!original, abs || '(no path)');
  step('template unlocked for the test', await unlockDock(page, cp));

  // ── Off from the start ────────────────────────────────────────────────
  step('the switch’s icon is in the HTML pane’s toolbar, not pressed', (await pressed(cp)) === 'false', `aria-pressed=${await pressed(cp)}`);

  const fetchesBefore = dataVarsCount(requests);
  const placed = await newLineAfterRoot(cp);

  step('caret after the root tag', !!placed);
  await page.keyboard.press('End');
  await page.keyboard.press('Enter');
  await page.keyboard.type('<p>', { delay: 20 });
  await sleep(1200);
  step('help off: nothing fetched and no popup', dataVarsCount(requests) === fetchesBefore && !helpLoaded(requests) && !(await has(cp, POPUP)), `data-vars +${dataVarsCount(requests) - fetchesBefore}, chunk ${helpLoaded(requests)}`);
  // The <p> and its closing tag: the editor's own closeTags, untouched by help.
  step('typing is the editor’s own: <p></p> closed by it', (await paneDoc(cp))?.includes('<p></p>'));

  // ── The default from ⋮ → HTML tree turns it on for this Live Preview ───
  step('the default ticked in the settings', await setHelpTick(page, cp, 'lp_settings_code_dock_help', true));
  step('…switches the icon on', await waitFor(cp, (sel) => document.querySelector(sel)?.getAttribute('aria-pressed') === 'true', HELP_BTN, 5000), `aria-pressed=${await pressed(cp)}`);
  await sleep(800);
  step('…and loads the editor side', helpLoaded(requests));
  step('the default unticked switches it off again', await setHelpTick(page, cp, 'lp_settings_code_dock_help', false) && (await waitFor(cp, (sel) => document.querySelector(sel)?.getAttribute('aria-pressed') === 'false', HELP_BTN, 5000)), `aria-pressed=${await pressed(cp)}`);

  // ── The icon switches it on by hand ────────────────────────────────────
  await click(page, cp, HELP_BTN);
  step('the icon pressed turns help on', await waitFor(cp, (sel) => document.querySelector(sel)?.getAttribute('aria-pressed') === 'true', HELP_BTN, 3000), `aria-pressed=${await pressed(cp)}`);

  // ── <ul> → popup → Tab → the loop; ⌘Z one step ─────────────────────────
  const placedAgain = await newLineAfterRoot(cp);

  step('caret after the root tag again', !!placedAgain);
  await page.keyboard.press('End');
  await page.keyboard.press('Enter');

  const beforeUl = await paneDoc(cp);

  await page.keyboard.type('<ul>', { delay: 30 });
  step('`<ul>` typed opens the popup', await waitSeen(cp, POPUP, 6000));
  await shot(page, 'popup');

  const options = await cp.evaluate((sel) => [...document.querySelectorAll(`${sel} [data-sve-help-option]`)].map((el) => el.textContent.trim().replace(/\s+/g, ' ')), POPUP);

  info(`popup: ${options.join(' | ')}`);
  step('the popup offers the loop over the section’s list (≤ 3 rows)', options.length >= 1 && options.length <= 3 && options.some((text) => /replicator|grid|løkke|loop|gentag/i.test(text)), options.join(' | '));

  const where = await cp.evaluate(`(() => {
    const view = ${VIEW_OF};
    const popup = document.querySelector('${POPUP}');
    if (!view || !popup) return null;
    const caret = view.coordsAtPos(view.state.selection.main.head);
    const b = popup.getBoundingClientRect();
    return { caret: caret && { left: Math.round(caret.left), bottom: Math.round(caret.bottom), top: Math.round(caret.top) }, popup: { left: Math.round(b.left), top: Math.round(b.top), bottom: Math.round(b.bottom), width: Math.round(b.width), height: Math.round(b.height) } };
  })()`);
  const nearCaret = !!where?.caret && (
    (where.popup.top >= where.caret.bottom && where.popup.top - where.caret.bottom < 16)
    || (where.popup.bottom <= where.caret.top && where.caret.top - where.popup.bottom < 16)
  ) && Math.abs(where.popup.left - where.caret.left) < 300;

  step('the popup sits at the caret (under it, or above when there is no room)', nearCaret, JSON.stringify(where));

  const afterUl = await paneDoc(cp);

  await page.keyboard.press('Tab');
  await sleep(400);

  const written = await paneDoc(cp);
  const loopWritten = !!written && /<ul[^>]*\{\{ visual_edit field="(\w+)"[^}]*\}\}>[\s\S]*\{\{ \1 \}\}[\s\S]*<li[\s\S]*\{\{ \/\1 \}\}\s*<\/ul>/.test(written);

  step('Tab writes the loop: the tag, `{{ field }}`, a <li>, `{{ /field }}`', loopWritten, (written || '').slice(placed?.at || 0, (placed?.at || 0) + 220).replace(/\n/g, '⏎'));
  step('the popup is gone after Tab', await waitGone(cp, POPUP, 2000));
  await shot(page, 'written');

  await page.keyboard.down('Meta');
  await page.keyboard.press('KeyZ');
  await page.keyboard.up('Meta');
  await sleep(400);

  const undone = await paneDoc(cp);

  step('⌘Z takes the loop back in one step: `<ul></ul>` as typed is there again', undone === afterUl, undone === beforeUl ? 'went one step too far (the <ul> itself is gone)' : `${(undone || '').length} chars vs ${(afterUl || '').length}`);

  // ── Tab with no popup is the editor’s own ──────────────────────────────
  await page.keyboard.press('Escape');
  await sleep(200);
  step('Esc: no popup', !(await has(cp, POPUP)));

  const beforeTab = await paneDoc(cp);

  await page.keyboard.press('Tab');
  await sleep(300);

  const afterTab = await paneDoc(cp);

  step('Tab without a popup writes nothing of ours', !!afterTab && !/visual_edit field="\w+" outline_inside/.test(afterTab.slice(0, afterTab.length - (beforeTab?.length || 0) + 60)) && afterTab.length - (beforeTab?.length || 0) <= 8, `${afterTab?.length - beforeTab?.length} chars`);

  // ── «Add a class»: the pane's picker (the setting on), class="" in the pane (off) ──
  const PICKERS = '#__sve-tw-menu, #__sve-css-menu';
  const classOptionIndex = () => cp.evaluate((sel) => [...document.querySelectorAll(`${sel} [data-sve-help-option]`)].findIndex((el) => /class|klasse/i.test(el.textContent || '') && !/same|samme/i.test(el.textContent || '')), POPUP);
  const pickClass = async () => {
    const placedP = await newLineAfterRoot(cp);

    if (!placedP) {
      return { opened: false };
    }

    await page.keyboard.press('End');
    await page.keyboard.press('Enter');
    await page.keyboard.type('<p>', { delay: 30 });

    const opened = await waitSeen(cp, POPUP, 6000);
    const index = opened ? await classOptionIndex() : -1;

    for (let i = 0; i < index; i++) {
      await page.keyboard.press('ArrowDown');
    }

    const before = await paneDoc(cp);

    if (index >= 0) {
      await page.keyboard.press('Enter');
      await sleep(600);
    }

    return { opened, index, before, after: await paneDoc(cp) };
  };

  const viaPicker = await pickClass();

  step('«Add a class» is offered on a fresh <p>', viaPicker.opened && viaPicker.index >= 0, `index ${viaPicker.index}`);
  step('…and opens the pane’s class picker, nothing written yet', (await has(cp, PICKERS)) && viaPicker.after === viaPicker.before, `picker ${await has(cp, PICKERS)}; doc ${viaPicker.after === viaPicker.before ? 'unchanged' : 'changed'}`);
  await shot(page, 'picker');
  await page.keyboard.press('Escape');
  await sleep(300);
  step('Esc closes the picker', await waitGone(cp, PICKERS, 3000));

  step('the picker setting unticked', await setHelpTick(page, cp, 'lp_settings_code_dock_help_picker', false));

  const inline = await pickClass();

  step('…then «Add a class» writes class="" in the pane with the caret inside', inline.opened && inline.index >= 0 && /<p class="">/.test(inline.after || '') && !(await has(cp, PICKERS)), (inline.after || '').slice(placed?.at || 0, (placed?.at || 0) + 60).replace(/\n/g, '⏎'));
  step('…and the Tailwind list opens between the quotes', await waitSeen(cp, `${PANE} .cm-tooltip-autocomplete`, 4000));
  await page.keyboard.press('Escape');
  await sleep(200);
  step('the picker setting ticked again', await setHelpTick(page, cp, 'lp_settings_code_dock_help_picker', true));

  // ── The click setting: off, a click into a tag asks nothing; a typed > still does ──
  step('the click setting unticked', await setHelpTick(page, cp, 'lp_settings_code_dock_help_click', false));
  await cp.evaluate(`(() => { const view = ${VIEW_OF}; const doc = view.state.doc.toString(); const at = doc.indexOf('<p class=""'); view.dispatch({ selection: { anchor: at + 2 }, scrollIntoView: true }); view.focus(); })()`);

  const caretXY = await cp.evaluate(`(() => { const view = ${VIEW_OF}; const c = view.coordsAtPos(view.state.selection.main.head); return c && { x: c.left + 1, y: (c.top + c.bottom) / 2 }; })()`);
  const cpBox = await (await cp.frameElement()).boundingBox();

  await page.mouse.click(cpBox.x + caretXY.x, cpBox.y + caretXY.y);
  await sleep(1000);
  step('click setting off: a click into a tag opens no popup', !(await has(cp, POPUP)));

  const placedTyped = await newLineAfterRoot(cp);

  step('caret after the root tag for a typed tag', !!placedTyped);
  await page.keyboard.press('End');
  await page.keyboard.press('Enter');
  await page.keyboard.type('<p>', { delay: 30 });
  step('click setting off: a typed > still opens the popup', await waitSeen(cp, POPUP, 6000));
  await page.keyboard.press('Escape');
  step('the click setting ticked again', await setHelpTick(page, cp, 'lp_settings_code_dock_help_click', true));

  // ── A loop's own tag: «What should … repeat?» → Enter → the loop panel ──
  const LOOP_PANEL = '[data-sve-help-loop]';
  const loopAt = await cp.evaluate(`(() => { const view = ${VIEW_OF}; const doc = view.state.doc.toString(); const at = doc.search(/\\{\\{ blocks \\}\\}/); if (at < 0) return null; view.dispatch({ selection: { anchor: at + 4 }, scrollIntoView: true }); view.focus(); const c = view.coordsAtPos(at + 4); return c && { x: c.left + 1, y: (c.top + c.bottom) / 2 }; })()`);

  step('a loop tag to click into', !!loopAt);

  if (loopAt) {
    await page.mouse.click(cpBox.x + loopAt.x, cpBox.y + loopAt.y);
    step('the loop’s own tag asks what it repeats', await waitSeen(cp, POPUP, 6000) && /repeat|gentage/i.test(await cp.evaluate((sel) => document.querySelector(`${sel} [data-sve-help-option]`)?.textContent || '', POPUP)));
    await page.keyboard.press('Enter');
    step('Enter opens the loop panel', await waitSeen(cp, LOOP_PANEL, 3000));
    await shot(page, 'loop-panel');

    const kinds = await cp.evaluate((sel) => [...document.querySelectorAll(`${sel} [data-sve-help-seg] button`)].map((b) => `${b.textContent.trim()}${b.hasAttribute('data-active') ? '*' : ''}`), LOOP_PANEL);

    step('the panel shows Field as the kind, with Collection and Nav beside it', kinds.length === 3 && /\*$/.test(kinds[0]), kinds.join(' '));
    await page.keyboard.press('Escape');
    step('Esc closes the loop panel', await waitGone(cp, LOOP_PANEL, 3000));
  }

  // ── The icon switches it off: the next tag typed opens nothing ─────────
  await click(page, cp, HELP_BTN);
  step('the icon pressed again turns help off', await waitFor(cp, (sel) => document.querySelector(sel)?.getAttribute('aria-pressed') === 'false', HELP_BTN, 3000));

  const placedOff = await newLineAfterRoot(cp);

  step('caret after the root tag once more', !!placedOff);
  await page.keyboard.press('End');
  await page.keyboard.press('Enter');
  await page.keyboard.type('<ol>', { delay: 30 });
  await sleep(1200);
  step('help off again: `<ol>` opens no popup', !(await has(cp, POPUP)));
} catch (e) {
  if (!e.perfOnly) {
    errors.push(`run: ${e.message}`);
  }
} finally {
  const abs = filePath && (filePath.startsWith('/') ? filePath : `${SITE_DIR}/${filePath}`);

  if (original !== null && abs) {
    // The dock's autosave may still be on its way; the file is put back after it.
    await sleep(2500);
    writeFileSync(abs, original);
    info(`section file put back: ${abs}`);
  }

  if (userYaml !== null) {
    writeFileSync(USER_FILE, userYaml);
  }

  await browser.close();
}

for (const line of errors) {
  console.log(`err  ${line}`);
}

console.log(failed || errors.length ? `FAILED (${failed} step(s), ${errors.length} error(s))` : 'PASSED');
process.exit(failed || errors.length ? 1 : 0);
