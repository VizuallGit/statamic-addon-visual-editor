#!/usr/bin/env node
/**
 * A component picked — in the preview or in the HTML tree — shows the values
 * that place gives it in the left column, and they stay there.
 *
 * Opens an entry in Live Preview with the dock armed and the tree open, opens
 * a section whose file calls a component inside a loop, then:
 *   1. clicks one of the component's renders in the preview,
 *   2. clicks another section and back,
 *   3. clicks the component's row in the tree,
 * and reads after each, at 0.4 / 1.5 / 4 s, whether the component's panel is
 * in the column AND visible (checkVisibility through every ancestor, a real
 * size), which fields it lists, and what the section panel is doing.
 *
 *   SVE_SITE_DIR / SVE_SITE_URL / SVE_USER / SVE_PASS   as in the smoke test
 *   SVE_ENTRY     the entry's CP path
 *   SVE_SECTION   the page row (`id`) of a section that calls the component
 *   SVE_OTHER     the page row (`id`) of any other section
 *   SVE_SRC       the component, e.g. components/image
 *   SVE_NO_SEED=1 do not touch the user's preference file
 *
 *   node tests/browser/component-values-column.mjs
 */
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync } from 'node:fs';

const env = (key, fallback) => process.env[key] || fallback;
const SITE_DIR = env('SVE_SITE_DIR', `${process.env.HOME}/Sites/vizuall-skabelon`);
const SITE_URL = env('SVE_SITE_URL', 'http://vizuall-skabelon.test');
const USER = env('SVE_USER', 'claude-test@vizuall.dk');
const PASS = env('SVE_PASS', '');
const ENTRY = env('SVE_ENTRY', '/cp/collections/pages/entries/home');
const SECTION = env('SVE_SECTION', 'muonzpviy7d5');
const OTHER = env('SVE_OTHER', '');
const SRC = env('SVE_SRC', 'components/image');
// What the component renders as, for a click before the preview has marked it.
const RENDER = env('SVE_RENDER', 'li img');
// SVE_TREE=0: the HTML tree stays shut — the preview click alone.
const TREE = env('SVE_TREE', '1') !== '0';
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
if (process.env.SVE_NO_SEED !== '1') seed({ 'sve-lp-panel-mode': 'show', 'sve-lp-collapsed': '0', 'sve-code-dock-armed': '1', 'sve-right-dock-open': TREE ? '1' : '0', 'sve-right-dock-open-panes': TREE ? '["html_tree"]' : '[]' });

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

/** The left column as a person sees it. */
const readColumn = (cp) => cp.evaluate(() => {
  const seen = (el) => !!el && el.isConnected && el.checkVisibility({ opacityProperty: true, visibilityProperty: true }) && el.getBoundingClientRect().width > 20 && el.getBoundingClientRect().height > 20;
  const host = document.getElementById('sve-cprops-host');
  const values = host?.querySelector('.sve-csb__values');
  const labels = values ? [...values.querySelectorAll('label, .field-label, [data-sve-pv-label], .sve-pv__label')].map((l) => l.textContent.trim()).filter(Boolean) : [];
  const sel = document.getElementById('__sve-selection-panel');
  const col = document.querySelector('.live-preview-fields') || document.querySelector('.live-preview-editor');
  return {
    host: !!host,
    hostSeen: seen(host),
    valuesSeen: seen(values),
    head: host?.querySelector('.sve-csb__name')?.textContent.trim() || '',
    labels: [...new Set(labels)].slice(0, 8),
    hostWhy: host ? `${getComputedStyle(host).display}/${getComputedStyle(host).visibility}/${getComputedStyle(host).position}${host.hasAttribute('data-sve-cprops-away') ? ' away' : ''}` : '',
    selSeen: seen(sel),
    selTitle: sel?.querySelector('.sve-sel__title')?.textContent.trim() || '',
    colSelection: !!col?.hasAttribute('data-sve-selection'),
    path: document.querySelector('#__sve-code-dock [data-sve-code-path]')?.textContent.trim() || '',
  };
});

const say = (s) => `host=${s.host ? (s.hostSeen ? 'seen' : `hidden(${s.hostWhy})`) : '∅'} values=${s.valuesSeen ? 'seen' : '∅'} head="${s.head}" labels=[${s.labels.join(',')}] sel=${s.selSeen ? `seen "${s.selTitle}"` : 'hidden'}${s.colSelection ? ' [col:selection]' : ''}`;

/** Where an element of the preview is on the page, for a real click. */
async function previewPoint(page, cp, selector) {
  const overlayBox = await (await page.$('iframe.sve-edit-overlay')).boundingBox();
  const frameEl = await cp.$('#live-preview-iframe');
  const frameBox = await frameEl.boundingBox();
  const preview = await frameEl.contentFrame();
  const r = await preview.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    el.scrollIntoView({ block: 'center' });
    const q = el.getBoundingClientRect();
    return { x: q.x + q.width / 2, y: q.y + Math.min(q.height / 2, 30) };
  }, selector);
  return r ? { x: overlayBox.x + frameBox.x + r.x, y: overlayBox.y + frameBox.y + r.y } : null;
}

async function clickPreview(page, cp, selector) {
  const at = await previewPoint(page, cp, selector);
  if (!at) return false;
  await sleep(300);
  const again = await previewPoint(page, cp, selector);
  await page.mouse.click(again.x, again.y);
  return true;
}

/**
 * A real click on a tree row. On the row's icon when it has one: a tag row's
 * name is a button of its own (the tag chip swallows the click; a double
 * click renames), a component row's is plain text — the icon is neither.
 */
async function clickTreeRow(page, cp, selector) {
  const overlayBox = await (await page.$('iframe.sve-edit-overlay')).boundingBox();
  const rect = await cp.evaluate((sel) => {
    const row = document.querySelector(sel);
    if (!row) return null;
    row.scrollIntoView({ block: 'center' });
    const icon = row.querySelector('[data-sve-ht-icon], [data-sve-ht-letter]');
    const r = (icon && icon.getBoundingClientRect().width > 0 ? icon : row).getBoundingClientRect();
    return icon && icon.getBoundingClientRect().width > 0
      ? { x: r.left + r.width / 2, y: r.top + r.height / 2 }
      : { x: r.left + Math.min(90, r.width / 2), y: r.top + r.height / 2 };
  }, selector);
  if (!rect) return false;
  await page.mouse.click(overlayBox.x + rect.x, overlayBox.y + rect.y);
  return true;
}

async function sample(cp) {
  const out = [];
  for (const wait of [400, 1100, 2500]) {
    await sleep(wait);
    out.push(await readColumn(cp));
  }
  return out;
}

const shown = (s) => s.hostSeen && s.valuesSeen && s.labels.length > 0;

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
  const until = async (fn, ms, arg) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await cp.evaluate(fn, arg)) return true; await sleep(250); } return false; };
  for (let i = 0; i < 3 && !(await until(() => !!document.getElementById('__sve-code-dock'), i ? 8000 : 15000)); i++) {
    await cp.evaluate(() => document.querySelector('#__sve-toolbar button[data-tab="code"]')?.click());
  }
  if (TREE && !(await until(() => !!document.getElementById('__sve-html-tree-panel'), 4000))) {
    await cp.evaluate(() => (document.querySelector('button[data-tab="html_tree"]') || [...document.querySelectorAll('button')].find((b) => /html tree|html-træ/i.test(b.getAttribute('title') || b.getAttribute('aria-label') || b.textContent || '')))?.click());
    await until(() => !!document.getElementById('__sve-html-tree-panel'), 15000);
  }
  // The dock opens the tree with it; shut, it is the tree's own toggle that
  // closes it — the state another right-hand panel leaves it in, too.
  if (!TREE && (await until(() => !!document.getElementById('__sve-html-tree-panel'), 6000))) {
    await cp.evaluate(() => (document.querySelector('button[data-tab="html_tree"]') || [...document.querySelectorAll('button')].find((b) => /html tree|html-træ/i.test(b.getAttribute('title') || b.getAttribute('aria-label') || b.textContent || '')))?.click());
    await until(() => !document.getElementById('__sve-html-tree-panel'), 6000);
  }
  await sleep(1500);
  step(TREE ? 'dock and tree open' : 'dock open, tree shut', await cp.evaluate((tree) => !!document.getElementById('__sve-code-dock') && !!document.getElementById('__sve-html-tree-panel') === tree, TREE));

  // SVE_DRAWER=sections: a drawer of the top bar opened beside the tree, as
  // the owner had the Sections drawer open — does the tree stay?
  if (process.env.SVE_DRAWER) {
    await cp.evaluate((key) => document.querySelector(`#__sve-toolbar button[data-tab="${key}"]`)?.click(), process.env.SVE_DRAWER);
    await sleep(2500);
    const tree = await cp.evaluate(() => !!document.getElementById('__sve-html-tree-panel'));
    step(`the tree is still open after the ${process.env.SVE_DRAWER} drawer`, tree);
  }

  const sectionSel = `#id-${SECTION}`;
  const heading = `${sectionSel} h2, ${sectionSel} h1, ${sectionSel} h3`;
  step('section in the preview', await clickPreview(page, cp, heading), sectionSel);
  // The tree opens one level: a component called straight under <section> has
  // its row at once, one inside a <div> or an {{ if }} not until something
  // unfolds to it (the preview click below does). So the row is noted here,
  // not required.
  const fileHeld = await until(() => /\.antlers\.html$/.test(document.querySelector('#__sve-code-dock [data-sve-code-path]')?.textContent.trim() || ''), 15000);
  const opened = await readColumn(cp);
  const rowAtOnce = TREE && (await cp.evaluate(() => !!document.querySelector('[data-sve-ht-row][title^="partial:"]')));
  step('the section opens in the dock', fileHeld, `${opened.path} · component row in the tree at once: ${rowAtOnce ? 'yes' : 'no (folded)'} · ${say(opened)}`);

  // The stamps the preview needs before a click can name a tag or a component.
  const preview = await (await cp.$('#live-preview-iframe')).contentFrame();
  const t0 = Date.now();
  while (Date.now() - t0 < 10000 && !(await preview.evaluate((s, src) => !!document.querySelector(`${s} [data-sve-component-src="${src}"]`) && !!document.querySelector(`${s} [data-sve-ht-path]`), sectionSel, SRC))) await sleep(250);
  const compSel = `${sectionSel} [data-sve-component-src="${SRC}"]`;
  step('the preview marks the component\'s renders', await preview.evaluate((s) => document.querySelectorAll(s).length, compSel) > 0, compSel);

  // 1. The component in the preview.
  step('click the component in the preview', await clickPreview(page, cp, compSel));
  let s = await sample(cp);
  step('preview click: the component\'s values are visible in the left column at 0.4/1.5/4 s', s.every(shown), s.map(say).join(' → '));

  // 2. Somewhere else, then back.
  if (OTHER) {
    await clickPreview(page, cp, `#id-${OTHER} h2, #id-${OTHER} h1, #id-${OTHER} p`);
    await sleep(2500);
    await clickPreview(page, cp, heading);
    await sleep(2500);
    step('click the component in the preview again', await clickPreview(page, cp, compSel));
    s = await sample(cp);
    step('second preview click: values visible at 0.4/1.5/4 s', s.every(shown), s.map(say).join(' → '));
  }

  // 3. The component's row in the tree.
  if (TREE) {
  await clickPreview(page, cp, heading);
  await sleep(2000);
  step('click the component row in the tree', await clickTreeRow(page, cp, `[data-sve-ht-row][title="partial:${SRC}"]`));
  s = await sample(cp);
  step('tree click: the component\'s values are visible in the left column at 0.4/1.5/4 s', s.every(shown), s.map(say).join(' → '));
  }

  // 4. Straight onto the component from another section: the one click has to
  //    open the section's file and then name the component in it.
  if (OTHER) {
    await clickPreview(page, cp, `#id-${OTHER} h2, #id-${OTHER} h1, #id-${OTHER} p`);
    await until(() => !/cases_list|contact_list/.test(document.querySelector('#__sve-code-dock [data-sve-code-path]')?.textContent || ''), 8000);
    await sleep(2500);
    const away = await readColumn(cp);
    step('click the component while the dock holds another section', await clickPreview(page, cp, `${sectionSel} ${RENDER}`), away.path.split('/').pop());
    s = [];
    for (let i = 0; i < 12; i++) {
      await sleep(400);
      s.push(await readColumn(cp));
    }
    step('one click from another section: values visible from 1.2 s on (12 samples, 0.4 s apart)', s.slice(2).every(shown), s.map((x, i) => `${((i + 1) * 0.4).toFixed(1)}s ${shown(x) ? 'shown' : say(x)}`).join(' | '));
  }

  // 5. The column handed back. The section's own row in the tree (the open
  //    file's root, not a component) lets the component go; the section's
  //    panel must be in the column again at once — marked, visible, and with
  //    its way out as one word at the top level (no arrow: nothing above).
  if (TREE) {
    const rootId = await cp.evaluate(() => {
      const rows = [...document.querySelectorAll('[data-sve-ht-row]')];
      const at = rows.findIndex((row, i) => row.getAttribute('data-sve-ht-depth') === '0' && rows[i + 1]?.getAttribute('data-sve-ht-depth') === '1');
      return at === -1 ? '' : rows[at].getAttribute('data-sve-ht-id');
    });
    step('click the section\'s own row in the tree', !!rootId && (await clickTreeRow(page, cp, `[data-sve-ht-row][data-sve-ht-id="${rootId}"]`)), rootId);
    s = await sample(cp);
    const handedBack = (x) => !x.host && x.selSeen && x.colSelection;
    step('section row: the section\'s panel is back in the column at 0.4/1.5/4 s', s.every(handedBack), s.map(say).join(' → '));
    const exit = await cp.evaluate(() => {
      const button = document.querySelector('#__sve-selection-panel .sve-sel__back');
      return button ? { text: button.textContent.trim(), arrow: !!button.querySelector('.sve-sel__arrow') } : null;
    });
    step('the section panel\'s way out is one word, no arrow', !!exit && exit.text.length > 0 && !exit.arrow, JSON.stringify(exit));
  }
} catch (err) {
  step('run', false, err.message);
}

step('no JS errors', errors.length === 0, errors.slice(0, 5).join(' | '));
if (process.env.SVE_LOG) {
  const lines = await (await (await page.$('iframe.sve-edit-overlay'))?.contentFrame())?.evaluate(() => (window.__sveDebug?.log || []).slice(-60)).catch(() => []);
  console.log((lines || []).join('\n'));
}
console.log(results.join('\n'));
console.log(failed ? `\n${failed} FAIL` : '\nall ok');
await browser.close();
process.exit(failed ? 1 : 0);
