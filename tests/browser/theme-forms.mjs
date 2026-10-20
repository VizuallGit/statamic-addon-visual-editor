#!/usr/bin/env node
/**
 * The theme panel's Forms tab, in a real Live Preview.
 *
 * Opens the panel on a page entry, goes to Forms and checks the sample and
 * the ten rows; rounds the corners and sees the token on the preview's
 * `<html>` in the same tick, and a real text field (one made in the preview
 * when the page has no form) take it; makes the background half and then
 * fully see-through; checks the Buttons tab still paints `--button-radius`;
 * saves, reloads, and reads the result from site.css and from the
 * `{{ theme_tokens }}` style the page is served with. site.css is put back
 * exactly as it was afterwards.
 *
 *   SVE_SITE_DIR=<site> SVE_SITE_URL=http://127.0.0.1:8765 SVE_PASS='…' SVE_WORKTREE=1 \
 *     SVE_ADDON_DIR=<this checkout> SVE_ENTRY=/cp/collections/pages/entries/<id> \
 *     node tests/browser/theme-forms.mjs
 *
 * Same env as theme-panel.mjs: SVE_SITE_DIR, SVE_SITE_URL, SVE_USER, SVE_PASS,
 * SVE_ENTRY, SVE_CHROME, SVE_ADDON_DIR, SVE_WORKTREE. SVE_SHOTS=<dir> saves
 * screenshots of the tab.
 *
 * The site needs the Forms contract: the `--input-*` tokens in site.css'
 * `@theme`, the input rule that reads them in its built CSS, and `input-*`
 * in the MANAGED pattern of its ThemeTokens tag.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { serveWorktreeBuild } from './serve-worktree.mjs';

const env = (key, fallback) => process.env[key] || fallback;
const SITE_DIR = env('SVE_SITE_DIR', `${process.env.HOME}/Sites/vizuall-skabelon`);
const SITE_URL = env('SVE_SITE_URL', 'http://vizuall-skabelon.test');
const USER = env('SVE_USER', 'claude-test@vizuall.dk');
const PASS = env('SVE_PASS', '');
const ENTRY = env('SVE_ENTRY', '/cp/collections/pages/entries/68f56034-ce7c-4d33-b15d-da7fa7675662');
const CHROME = env('SVE_CHROME', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome');
const SHOTS = env('SVE_SHOTS', '');
const ADDON_DIR = env('SVE_ADDON_DIR', `${process.env.HOME}/Sites/statamic-addon-visual-editor-vue`);
const WORKTREE = env('SVE_WORKTREE', '') === '1';

const puppeteer = createRequire(`${SITE_DIR}/package.json`)('puppeteer');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const errors = [];
let passed = 0;
let failed = 0;
const step = (name, ok, detail = '') => {
  if (ok) passed++;
  else failed++;
  console.log(`${ok ? 'ok ' : 'FAIL'} ${name}${detail ? ' — ' + detail : ''}`);
};

const CSS_FILE = `${SITE_DIR}/resources/css/site.css`;
const original = readFileSync(CSS_FILE, 'utf8');

if (!original.includes('--input-radius:')) {
  console.log('FAIL site.css has no --input-* tokens — this site does not have the Forms contract yet');
  console.log('SUMMARY: 0 passed / 1 failed');
  process.exit(1);
}

if (original.includes('--input-radius: 0.5rem;') || original.includes('--input-bg: transparent;')) {
  console.log('FAIL site.css has test values from an earlier run — put site.css back first');
  console.log('SUMMARY: 0 passed / 1 failed');
  process.exit(1);
}

// The right sidebar remembers its open panes in the user's preferences: a
// theme panel the last run left open comes back open on the next, and the
// click on its icon below would close it. So the run starts with the panes
// closed, and the user file is put back as it was afterwards.
const USER_FILE = `${SITE_DIR}/users/${USER}.yaml`;
let userOriginal = null;

try {
  userOriginal = readFileSync(USER_FILE, 'utf8');
} catch {
  // a user stored elsewhere: nothing to reset
}

if (userOriginal && /sve-right-dock-open-panes: '[^']*theme/.test(userOriginal)) {
  writeFileSync(USER_FILE, userOriginal.replace(/(sve-right-dock-open-panes: )'[^']*'/, "$1'[]'").replace(/(sve-right-dock-open: )'1'/, "$1'0'"));
}

const PANEL = '#__sve-theme';
const ROWS = [
  'input-bg', 'input-bg-opacity', 'input-color', 'input-size', 'input-radius',
  'input-border-width', 'input-border-color', 'input-focus', 'input-accent', 'input-check-size',
];
// The bench's own noise, not the editor's: the login's Inertia 409, another
// addon's endpoint refusing a session on a bare host.
const isNoise = (text) => /\/cp\/color-scheme\/|\/cp\/bard-style\/|invalid domain|HTTP 409 |auth\/login|\/cp\/login/.test(text);
const note = (text) => !isNoise(text) && errors.push(text);

/**
 * Where the `nth` visible match inside `frame` is: `local` in the frame's own
 * coordinates, `x`/`y` on the page (through its parent frames), and whether
 * the frame's hit test at that point lands on it.
 */
async function pointIn(frame, selector, nth = 0) {
  const r = await frame.evaluate((sel, n) => {
    const seen = [...document.querySelectorAll(sel)].filter((el) => {
      const b = el.getBoundingClientRect();

      return b.width > 0 && b.height > 0;
    });
    const el = seen[n];

    if (!el) {
      return null;
    }

    el.scrollIntoView({ block: 'center', behavior: 'instant' });

    const b = el.getBoundingClientRect();
    const x = b.x + b.width / 2;
    const y = b.y + b.height / 2;
    const hit = document.elementFromPoint(x, y);

    return { x, y, local: { x, y }, hits: !!hit && (hit === el || el.contains(hit)) };
  }, selector, nth);

  if (!r) {
    throw new Error(`nothing visible for ${selector} [${nth}]`);
  }

  for (let f = frame; f.parentFrame(); f = f.parentFrame()) {
    const box = await (await f.frameElement()).boundingBox();

    r.x += box.x;
    r.y += box.y;
  }

  return r;
}

/**
 * A real mouse click — once the target is what the hit test finds at its
 * centre and has stood still for a moment. Right after Live Preview opens, the
 * page is not hit-testable yet and the editor's column is still settling, so
 * a point measured then can land beside the button.
 */
async function click(page, frame, selector, nth = 0) {
  const t0 = Date.now();
  let last = null;
  let point = await pointIn(frame, selector, nth);

  while (Date.now() - t0 < 8000) {
    const still = last && Math.abs(last.x - point.x) < 0.5 && Math.abs(last.y - point.y) < 0.5;
    const onPage = await page.evaluate((px, py) => document.elementFromPoint(px, py)?.tagName !== 'HTML', point.x, point.y);

    if (point.hits && still && onPage) {
      break;
    }

    last = point;
    await sleep(150);
    point = await pointIn(frame, selector, nth);
  }

  await page.mouse.click(point.x, point.y);
}

async function waitFor(frame, fn, arg, ms = 8000) {
  const t0 = Date.now();

  while (Date.now() - t0 < ms) {
    if (await frame.evaluate(fn, arg).catch(() => false)) {
      return true;
    }

    await sleep(100);
  }

  return false;
}

/**
 * Pick an option in one of the panel's native selects, the way a person ends
 * up, and in the same task read the custom property off the preview's
 * `<html>` — the paint is synchronous, so it must be there before any frame.
 */
const pickAndRead = (cp, selector, value, prop) => cp.evaluate((sel, v, p) => {
  const el = document.querySelector(sel);

  if (!el || ![...el.options].some((o) => o.value === v)) {
    return { ok: false, painted: null };
  }

  el.value = v;
  el.dispatchEvent(new Event('change', { bubbles: true }));

  const doc = document.querySelector('#live-preview-iframe')?.contentDocument;

  return { ok: true, painted: doc ? doc.documentElement.style.getPropertyValue(p).trim() : null };
}, selector, value, prop);

/** A real form control in the preview: the page's own when it has one, else one made for a moment. */
const control = (preview, tag = 'input') => preview.evaluate((t) => {
  const own = document.querySelector(t === 'input' ? 'input[type="text"], input[type="email"]' : t);
  const el = own || Object.assign(document.createElement(t), t === 'input' ? { type: 'text' } : {});

  if (!own) {
    document.body.append(el);
  }

  const cs = getComputedStyle(el);
  const out = {
    own: !!own,
    radius: cs.borderRadius,
    bg: cs.backgroundColor,
    rootFont: getComputedStyle(document.documentElement).fontSize,
  };

  if (!own) {
    el.remove();
  }

  return out;
}, tag);

/** The alpha of a computed color: `rgba(…, a)`, `color(srgb r g b / a)`; opaque without one. */
function alphaOf(color) {
  const m = /\/\s*([\d.]+)\s*\)$/.exec(color) || /^rgba\([^)]*,\s*([\d.]+)\)$/.exec(color);

  return m ? Number(m[1]) : 1;
}

/** The `{{ theme_tokens }}` style the page was served with (an unlayered `:root{…}`). */
const servedTokens = (preview) => preview.evaluate(() => [...document.querySelectorAll('style')].map((s) => s.textContent).find((t) => /^:root\{/.test(t.trim()) && t.includes('--input-')) || '');

const shot = async (cp, page, name) => {
  if (!SHOTS) {
    return '';
  }

  const path = `${SHOTS}/theme-forms-${name}.png`;
  const el = await cp.$(PANEL);

  await (el ? el.screenshot({ path }) : page.screenshot({ path }));

  return path;
};

const browser = await puppeteer.launch({ headless: true, executablePath: CHROME, args: ['--window-size=1440,1000'], defaultViewport: { width: 1440, height: 1000 } });
const page = await browser.newPage();

page.on('pageerror', (e) => note(`pageerror: ${e.message}`));
page.on('console', (m) => m.type() === 'error' && !/Failed to load resource/.test(m.text()) && note(`console: ${m.text().slice(0, 200)}`));
page.on('response', (r) => r.status() >= 400 && note(`HTTP ${r.status()} ${r.request().method()} ${r.url().replace(SITE_URL, '').slice(0, 140)}`));

if (WORKTREE) {
  await serveWorktreeBuild(page, {
    buildDir: `${ADDON_DIR}/resources/dist/build`,
    installedManifest: `${SITE_DIR}/public/vendor/visual-editor/build/manifest.json`,
    scriptsDir: `${ADDON_DIR}/resources/js`,
  });
  console.log('info build served from the working tree');
}

/** Open the entry's Live Preview; resolves to the CP frame and the preview frame. */
async function openLivePreview() {
  await page.goto(`${SITE_URL}${ENTRY}`, { waitUntil: 'networkidle2' });
  await sleep(1500);

  if (!(await page.$('iframe.sve-edit-overlay'))) {
    await page.evaluate(() => [...document.querySelectorAll('button, a')].find((el) => /live preview|forhåndsvisning/i.test(el.textContent || ''))?.click());
    await page.waitForSelector('iframe.sve-edit-overlay[data-open]', { timeout: 30000 });
  }

  const cp = await (await page.$('iframe.sve-edit-overlay')).contentFrame();

  await page.keyboard.press('Escape');
  await cp.waitForSelector('#__sve-toolbar button', { timeout: 20000 });

  let preview = null;

  for (let i = 0; i < 25 && !preview; i++) {
    const el = await cp.$('#live-preview-iframe');
    const f = el ? await el.contentFrame() : null;

    if (f && (await f.evaluate(() => !!document.querySelector('[id^="id-"]')).catch(() => false))) {
      preview = f;
    } else {
      await sleep(1000);
    }
  }

  return { cp, preview };
}

const icon = '#__sve-toolbar button[data-tab="theme"]';
const tab = (key) => `${PANEL} [data-sve-theme-tab="${key}"]`;

try {
  // ── Login: Statamic answers the POST with a 409 (Inertia version) and sends
  // the browser to /cp/login, a 404 for a user who is now logged in — the
  // session is set all the same. So: Enter, a moment, then /cp.
  await page.goto(`${SITE_URL}/cp`, { waitUntil: 'networkidle2' });

  if (await page.$('input[name="email"]')) {
    await page.type('input[name="email"]', USER);
    await page.type('input[name="password"]', PASS);
    await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 8000 }).catch(() => null), page.keyboard.press('Enter')]);
    await sleep(500);
    await page.goto(`${SITE_URL}/cp`, { waitUntil: 'networkidle2' });
  }

  step('login', !(await page.$('input[name="password"]')), page.url().replace(SITE_URL, ''));
  errors.length = 0; // the login page's own 401/409s are not the editor's

  let { cp, preview } = await openLivePreview();

  step('preview has the page', !!preview);
  step('the page is served the input tokens by theme_tokens', (await servedTokens(preview)).includes('--input-radius: 0.375rem'));

  const before = await control(preview);

  step('a text field starts with the site.css default corners (0.375rem)', before.radius === '6px', JSON.stringify(before));

  // ── Open the panel on Forms ───────────────────────────────────────────
  step('palette icon in the top bar', !!(await cp.$(icon)));
  await click(page, cp, icon);
  step('the panel opens and has a Forms tab', await waitFor(cp, (sel) => !!document.querySelector(sel), tab('forms'), 15000));
  step('each tab has its icon (7)', await cp.evaluate((p) => document.querySelectorAll(`${p} .sve-theme__tab .sve-theme__tab-icon svg`).length === 7, PANEL));
  await waitFor(cp, (p) => !document.querySelector(`${p} .sve-theme__empty`), PANEL, 10000);
  await click(page, cp, tab('forms'));
  step('Forms is the open tab', await waitFor(cp, (sel) => document.querySelector(sel)?.classList.contains('is-on'), tab('forms')));

  const sample = await cp.evaluate((p) => {
    const s = document.querySelector(`${p} [data-sve-forms-sample]`);

    if (!s) {
      return null;
    }

    const text = s.querySelector('input[type="text"]');
    const box = s.getBoundingClientRect();

    return {
      text: !!text,
      placeholder: text?.placeholder || '',
      textarea: !!s.querySelector('textarea'),
      checkbox: !!s.querySelector('input[type="checkbox"]:checked'),
      radio: !!s.querySelector('input[type="radio"]:checked'),
      send: s.querySelector('.sve-theme__forms-send')?.textContent.trim() || '',
      visible: box.width > 0 && box.height > 0,
      radius: text ? getComputedStyle(text).borderRadius : '',
    };
  }, PANEL);

  step('the sample has a text field, a textarea, a checked checkbox and radio, and a Send button',
    !!sample && sample.visible && sample.text && sample.textarea && sample.checkbox && sample.radio && !!sample.send, JSON.stringify(sample));
  step('its labels are strings, not keys', !!sample && !!sample.placeholder && !/^forms_|^theme_/.test(sample.placeholder) && !/^forms_/.test(sample.send), `${sample?.placeholder} / ${sample?.send}`);

  const rows = await cp.evaluate((p, names) => ({
    fields: document.querySelectorAll(`${p} .sve-theme__body .sve-theme__field`).length,
    selects: names.filter((n) => !!document.querySelector(`${p} select[data-sve-input="${n}"]`)),
    values: Object.fromEntries(names.map((n) => [n, document.querySelector(`${p} select[data-sve-input="${n}"]`)?.value ?? null])),
    groups: document.querySelector(`${p} select[data-sve-input="input-bg"]`)?.querySelectorAll('optgroup').length || 0,
  }), PANEL, ROWS);

  step('ten rows, one select per token', rows.fields === 10 && rows.selects.length === 10, `${rows.fields} rows; missing: ${ROWS.filter((n) => !rows.selects.includes(n)).join(' ')}`);
  step('the rows show the values in site.css', rows.values['input-radius'] === '0.375rem' && rows.values['input-bg'] === 'var(--color-white)'
    && rows.values['input-bg-opacity'] === '100%' && rows.values['input-check-size'] === '1.1em', JSON.stringify(rows.values));
  step('a color row lists basics plus a group per theme color', rows.groups > 2, `${rows.groups} groups`);

  const shot1 = await shot(cp, page, '1-defaults');

  // ── Corners: painted in the same task, and a real field takes them ────
  const corners = await pickAndRead(cp, `${PANEL} select[data-sve-input="input-radius"]`, '0.5rem', '--input-radius');

  step('Corners → 0.5rem paints --input-radius on the preview\'s <html> in the same tick', corners.ok && corners.painted === '0.5rem', JSON.stringify(corners));

  const rounded = await control(preview);

  step(`a ${rounded.own ? 'text field on the page' : 'text field made in the preview'} computes border-radius 8px`, rounded.radius === '8px', JSON.stringify(rounded));
  step('the sample follows', await cp.evaluate((p) => getComputedStyle(document.querySelector(`${p} [data-sve-forms-sample] input[type="text"]`)).borderRadius === '8px', PANEL));

  // ── Background and its opacity ────────────────────────────────────────
  const half = await pickAndRead(cp, `${PANEL} select[data-sve-input="input-bg-opacity"]`, '50%', '--input-bg-opacity');
  const halfField = await control(preview);

  step('Opacity → 50%: painted, and the field\'s white is half see-through', half.painted === '50%' && alphaOf(halfField.bg) === 0.5, `${JSON.stringify(half)} bg=${halfField.bg}`);

  const clear = await pickAndRead(cp, `${PANEL} select[data-sve-input="input-bg"]`, 'transparent', '--input-bg');
  const clearField = await control(preview);

  step('Background → transparent: painted, and the field has no background', clear.painted === 'transparent' && alphaOf(clearField.bg) === 0, `${JSON.stringify(clear)} bg=${clearField.bg}`);

  const shot2 = await shot(cp, page, '2-changed');

  // ── The Buttons tab still paints its own token ────────────────────────
  await click(page, cp, tab('button'));
  await waitFor(cp, (sel) => document.querySelector(sel)?.classList.contains('is-on'), tab('button'));

  const buttonSelect = `${PANEL} .sve-theme__section label.sve-theme__field:nth-of-type(3) select`;
  const buttonWas = await cp.evaluate((sel) => document.querySelector(sel)?.value ?? null, buttonSelect);
  const buttonTry = buttonWas === '0.75rem' ? '1rem' : '0.75rem';
  const btn = await pickAndRead(cp, buttonSelect, buttonTry, '--button-radius');

  step(`Buttons: Corners → ${buttonTry} paints --button-radius at once`, btn.ok && btn.painted === buttonTry, `${JSON.stringify(btn)} (was ${buttonWas})`);

  const btnBack = await pickAndRead(cp, buttonSelect, buttonWas, '--button-radius');

  step('Buttons: back to what site.css has', btnBack.ok && btnBack.painted === buttonWas, JSON.stringify(btnBack));
  await click(page, cp, tab('forms'));
  step('Forms keeps its unsaved values over a tab switch', await waitFor(cp, (p) => document.querySelector(`${p} select[data-sve-input="input-radius"]`)?.value === '0.5rem'
    && document.querySelector(`${p} select[data-sve-input="input-bg"]`)?.value === 'transparent', PANEL));

  // ── Save, then the file and a fresh render ────────────────────────────
  await click(page, cp, `${PANEL} .sve-theme__save`);

  for (let t0 = Date.now(); Date.now() - t0 < 10000 && !readFileSync(CSS_FILE, 'utf8').includes('--input-radius: 0.5rem;');) {
    await sleep(100);
  }

  await waitFor(cp, (p) => !!document.querySelector(`${p} .sve-theme__save`)?.disabled && !/sav|gemmer/i.test(document.querySelector(`${p} .sve-theme__status`)?.textContent || ''), PANEL, 5000);

  const css = readFileSync(CSS_FILE, 'utf8');
  const expect = ['--input-radius: 0.5rem;', '--input-bg-opacity: 50%;', '--input-bg: transparent;'];

  step('site.css has the three changes', expect.every((line) => css.includes(line)), expect.filter((line) => !css.includes(line)).join(' | '));

  const touched = css.split('\n').filter((line) => !original.includes(line) && line.trim() !== '').filter((line) => !/--input-(radius|bg-opacity|bg):/.test(line));

  step('nothing else in site.css changed (the button\'s corners neither)', touched.length === 0 && css.split('\n').length === original.split('\n').length, touched.slice(0, 3).join(' | '));

  ({ cp, preview } = await openLivePreview());

  const served = await servedTokens(preview);

  step('after a reload the theme_tokens style carries --input-radius: 0.5rem', served.includes('--input-radius: 0.5rem'), served.match(/--input-[^;]*;/g)?.join(' ') || 'no input tokens');
  step('and the other two', served.includes('--input-bg: transparent') && served.includes('--input-bg-opacity: 50%'));

  const after = await control(preview);

  step('a text field on the fresh page computes 8px corners and no background — no panel open, no build', after.radius === '8px' && alphaOf(after.bg) === 0, JSON.stringify(after));

  if (shot1 || shot2) {
    console.log(`info screenshots: ${[shot1, shot2].filter(Boolean).join(' ')}`);
  }
} catch (err) {
  step('ran to the end', false, err.message);

  if (SHOTS) {
    await page.screenshot({ path: `${SHOTS}/theme-forms-failed.png` }).catch(() => {});
  }
} finally {
  // A save still on its way would land after a restore made right now.
  await browser.close();
  await sleep(1500);
  writeFileSync(CSS_FILE, original);

  if (userOriginal !== null) {
    writeFileSync(USER_FILE, userOriginal);
  }

  await sleep(500);
  console.log(readFileSync(CSS_FILE, 'utf8') === original ? 'info site.css put back as it was' : 'WARNING: site.css was NOT restored');
}

step('no JS errors', errors.length === 0, errors.slice(0, 5).join(' | '));
console.log(`SUMMARY: ${passed} passed / ${failed} failed`);
process.exit(failed ? 1 : 0);
