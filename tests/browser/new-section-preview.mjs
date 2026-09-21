/**
 * New section from the block tree — the preview must show it without a save.
 *
 * Opens a page in Live Preview, counts the sections the preview draws, creates
 * a static section through the tree's plus (the two dialogs a person clicks
 * through), and then watches for twelve seconds: does the preview gain a
 * section, and what did the CP ask the server for meanwhile (Live Preview
 * POSTs, replays with sve_sid). The section type made for the probe is
 * deleted again at the end; the entry is never saved.
 *
 *   cd ~/Sites/vizuall-skabelon && SVE_PASS='…' node ~/Sites/statamic-addon-visual-editor-vue/tests/browser/new-section-preview.mjs
 */
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync } from 'node:fs';
import { serveWorktreeBuild } from './serve-worktree.mjs';

const env = (key, fallback) => process.env[key] || fallback;
const SITE_DIR = env('SVE_SITE_DIR', `${process.env.HOME}/Sites/vizuall-skabelon`);
const SITE_URL = env('SVE_SITE_URL', 'http://vizuall-skabelon.test');
const USER = env('SVE_USER', 'claude-test@vizuall.dk');
const PASS = env('SVE_PASS', '');
const ENTRY = env('SVE_ENTRY', '/cp/collections/pages/entries/68f56034-ce7c-4d33-b15d-da7fa7675662');
const CHROME = env('SVE_CHROME', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome');
const WATCH_MS = Number(env('SVE_WATCH_MS', '12000'));
const ADDON_DIR = env('SVE_ADDON_DIR', `${process.env.HOME}/Sites/statamic-addon-visual-editor-vue`);
/** SVE_WORKTREE=1: serve the working tree's build in place of the installed one. */
const WORKTREE = env('SVE_WORKTREE', '') === '1';

const puppeteer = createRequire(`${SITE_DIR}/package.json`)('puppeteer');

// The editor hydrates its layout from the user's `sve_chrome` preferences and
// writes them back on every run — so the test account starts clean each time
// (as the smoke test does), or run N+1 starts where run N left the panels.
const USER_FILE = `${SITE_DIR}/users/${USER}.yaml`;
writeFileSync(USER_FILE, readFileSync(USER_FILE, 'utf8').replace(/^  sve_chrome:\n(?:    .*\n)*/m, ''));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const t0 = Date.now();
const at = () => `${String(Date.now() - t0).padStart(6)}ms`;
const log = (...a) => console.log(at(), ...a);
const step = (name, ok, detail = '') => console.log(`${ok ? 'ok  ' : 'FAIL'} ${name}${detail ? ' — ' + detail : ''}`);
const waitIn = async (frame, sel, ms) => { try { await frame.waitForSelector(sel, { timeout: ms }); return true; } catch { return false; } };

const browser = await puppeteer.launch({ headless: true, executablePath: CHROME, args: ['--window-size=1440,900'], defaultViewport: { width: 1440, height: 900 } });
const page = await browser.newPage();
const errors = [];
const requests = [];
page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
page.on('response', (r) => { if (r.status() >= 400) errors.push(`HTTP ${r.status()} ${r.request().method()} ${r.url().replace(SITE_URL, '').slice(0, 120)}`); });
page.on('console', (m) => { if (m.type() === 'error') errors.push(`console: ${m.text().slice(0, 160)}`); });
page.on('request', (r) => {
  const u = r.url().replace(SITE_URL, '');
  if (/live-preview|preview|sve_sid|section-types|set-meta/i.test(u) && !/\.(js|css|png|svg|woff2?)(\?|$)/.test(u)) requests.push(`${at()} ${r.method()} ${u.slice(0, 140)}`);
});
let madeHandle = '';
page.on('response', async (r) => {
  if (r.request().method() === 'POST' && /\/!\/sve\/section-types/.test(r.url())) {
    try { const j = await r.json(); madeHandle = j?.handle || j?.section?.handle || madeHandle; log('section-types POST →', JSON.stringify(j).slice(0, 200)); } catch {}
  }
});

const sectionFacts = (frame) => frame.evaluate(() => {
  const els = [...document.querySelectorAll('section[id^="id-"], [data-sid][id^="id-"]')];
  return { count: els.length, sids: els.map((el) => el.getAttribute('data-sid') || el.id).join(',') };
});

if (WORKTREE) {
  const served = await serveWorktreeBuild(page, { buildDir: env('SVE_BUILD_DIR', `${ADDON_DIR}/resources/dist/build`), installedManifest: `${SITE_DIR}/public/vendor/visual-editor/build/manifest.json`, scriptsDir: `${ADDON_DIR}/resources/js` });
  log('worktree build served:', typeof served === 'function' ? served() : served);
}

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
  } else if (!(await page.$('#live-preview-iframe'))) {
    await page.evaluate(() => { const btn = [...document.querySelectorAll('button, a')].find((el) => /live preview|forhåndsvisning/i.test(el.textContent || '')); btn?.click(); });
    const overlay = await waitIn(page, 'iframe.sve-edit-overlay[data-open]', 30000);
    step('preview overlay opened', overlay);
    if (overlay) cp = await (await page.$('iframe.sve-edit-overlay')).contentFrame();
  }
  await page.keyboard.press('Escape');
  step('toolbar built', await waitIn(cp, '#__sve-toolbar button', 20000));

  let preview = null;
  let base = { count: 0, sids: '' };
  for (let i = 0; i < 25 && !base.count; i++) {
    const lpEl = await cp.$('#live-preview-iframe');
    preview = lpEl ? await lpEl.contentFrame() : null;
    base = preview ? await sectionFacts(preview).catch(() => ({ count: 0, sids: '' })) : base;
    if (!base.count) await sleep(1000);
  }
  log('preview sections at open:', `${base.count}: ${base.sids}`);

  // SVE_ADD_FIRST=hero: an empty page first gets a section from the Patterns
  // panel (a click on a card adds it at the end), unsaved — the way a person
  // starts a new page — and only then the probe.
  const clickIn = async (frame, selector, accept = null) => {
    const acceptSrc0 = accept ? accept.toString().replace('__WANT__', String(env('SVE_ADD_FIRST', '')).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) : null;
    const box = await frame.evaluate((sel, acceptSrc) => { const accept = acceptSrc ? new Function(`return (${acceptSrc})`)() : null; const el = [...document.querySelectorAll(sel)].find((c) => (!accept || accept(c)) && c.getBoundingClientRect().width > 0); if (!el) return null; el.scrollIntoView({ block: 'center', behavior: 'instant' }); const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width }; }, selector, acceptSrc0);
    if (!box || !box.w) return false;
    const frameEl = await page.$('iframe.sve-edit-overlay');
    const fr = frameEl ? await frameEl.boundingBox() : { x: 0, y: 0 };
    await page.mouse.click(fr.x + box.x, fr.y + box.y);
    return true;
  };
  const wantFirst = env('SVE_ADD_FIRST', '');
  if (wantFirst) {
    step('opened the Patterns panel', await clickIn(cp, '#__sve-toolbar button[data-tab="sections"]'));
    await sleep(3000);
    log('open __sve- elements:', await cp.evaluate(() => [...document.querySelectorAll('[id^="__sve-"]')].filter((el) => el.getBoundingClientRect().width > 0 && el.getBoundingClientRect().height > 0).map((el) => `${el.id}(${Math.round(el.getBoundingClientRect().width)}x${Math.round(el.getBoundingClientRect().height)})`).join(' ')));
    for (const f of page.frames()) {
      const facts = await f.evaluate(() => ({ url: location.pathname.slice(0, 40), lib: document.querySelectorAll('[data-sve-lib-handle]').length, cards: document.querySelectorAll('.sve-lib-card').length, patterns: [...document.querySelectorAll('h1,h2,h3,h4,div,span')].filter((el) => /^\s*(Patterns|Mønstre)\s*$/.test(el.textContent || '')).map((el) => `#${el.closest('[id]')?.id || '?'}`).join(',') })).catch(() => null);
      if (facts && (facts.lib || facts.cards || facts.patterns)) log('frame', JSON.stringify(facts));
    }
    log('"Patterns" text found in:', await cp.evaluate(() => [...document.querySelectorAll('h1,h2,h3,h4,div,span')].filter((el) => /^\s*(Patterns|Mønstre)\s*$/.test(el.textContent || '')).map((el) => `${el.tagName}#${el.id || ''}.${String(el.className).slice(0, 40)} in #${el.closest('[id]')?.id || '?'}`).join(' | ')));
    let card = false;
    for (let i = 0; i < 20 && !card; i++) {
      card = await clickIn(cp, '[data-sve-lib-handle]', (el) => new RegExp(String.raw`__WANT__`, 'i').test(`${el.getAttribute('data-sve-lib-handle')} ${el.textContent || ''}`));
      if (!card) await sleep(300);
    }
    step(`clicked a "${wantFirst}" card in the Patterns panel`, card);
    if (!card) log('library facts:', await cp.evaluate(() => ({ handles: [...document.querySelectorAll('[data-sve-lib-handle]')].slice(0, 12).map((el) => `${el.getAttribute('data-sve-lib-handle')}(${Math.round(el.getBoundingClientRect().width)}x${Math.round(el.getBoundingClientRect().height)})`).join(' '), cards: document.querySelectorAll('.sve-lib-card').length, panels: [...document.querySelectorAll('[id^="__sve-"]')].filter((el) => /panel|library|sections/.test(el.id)).map((el) => `${el.id}:${Math.round(el.getBoundingClientRect().width)}`).join(' ') })));
    // The Patterns panel closed again, so the block tree gets the right shell to itself.
    await cp.evaluate(() => { const panel = [...document.querySelectorAll('[id^="__sve-"]')].find((el) => /sections|library/.test(el.id) && el.querySelector('[data-sve-close]')); panel?.querySelector('[data-sve-close]')?.click(); });
    await sleep(800);
    for (let i = 0; i < 20; i++) {
      await sleep(500);
      const lpEl = await cp.$('#live-preview-iframe');
      preview = lpEl ? await lpEl.contentFrame() : preview;
      base = preview ? await sectionFacts(preview).catch(() => base) : base;
      if (base.count > 0) break;
    }
    log('preview sections after the card:', `${base.count}: ${base.sids}`);
  }
  step('preview draws sections before the probe', base.count > 0, `${base.count}: ${base.sids}`);
  const cpRows = () => cp.evaluate(() => document.querySelectorAll('[data-replicator-set], .replicator-set').length);
  log('CP replicator sets before:', await cpRows());

  // The block tree, and its plus. A real mouse click on the toolbar icon: the
  // overlay iframe sits at an offset in the page, so the icon's rectangle is
  // translated by the iframe's own.
  log('toolbar tabs:', await cp.evaluate(() => [...document.querySelectorAll('#__sve-toolbar button')].map((b) => b.dataset.tab || b.title).join(' | ')));
  // The plus lives in the HTML tree, which comes with the template dock.
  step('clicked the dock icon', await clickIn(cp, '#__sve-toolbar button[data-tab="code"]'));
  let plus = await waitIn(cp, 'button.sve-ht-new', 8000);
  if (!plus) {
    // The icon's first click now and then lands while the toolbar is still
    // settling; the dock is not open, so a second click opens it.
    const dockOpen = await cp.evaluate(() => !!document.getElementById('__sve-code-dock'));
    log('dock open after first click:', dockOpen);
    if (!dockOpen) { await clickIn(cp, '#__sve-toolbar button[data-tab="code"]'); plus = await waitIn(cp, 'button.sve-ht-new', 8000); }
  }
  if (!plus) {
    log('panel facts:', await cp.evaluate(() => ({ list: !!document.querySelector('[data-sve-html-tree-list]'), search: document.querySelectorAll('.sve-ht-search').length, plus: document.querySelectorAll('.sve-ht-new').length, rightPanels: [...document.querySelectorAll('[id^="__sve-"][id$="-panel"], [id*="listview"], [id*="html-tree"]')].map((el) => el.id).join(',') })));
  }
  step('HTML tree opened (plus visible)', plus);
  requests.length = 0;
  await clickIn(cp, 'button.sve-ht-new');

  // Dialog 1: what should the section be? → Static HTML.
  let picked = false;
  for (let i = 0; i < 20 && !picked; i++) {
    picked = await cp.evaluate(() => { const b = [...document.querySelectorAll('button')].find((el) => /^(static html|statisk html)$/i.test((el.textContent || '').trim())); if (b) { b.click(); return true; } return false; });
    if (!picked) await sleep(250);
  }
  step('dialog: Static HTML picked', picked);

  // Dialog 2: the name, then Create.
  let typed = false;
  for (let i = 0; i < 20 && !typed; i++) {
    typed = await cp.evaluate(() => { const inputs = [...document.querySelectorAll('input[type="text"], input:not([type])')].filter((el) => el.getBoundingClientRect().width > 0); const el = inputs[inputs.length - 1]; if (!el) return false; el.focus(); return true; });
    if (!typed) await sleep(250);
  }
  step('dialog: name field focused', typed);
  await page.keyboard.type('Probe sektion ' + Math.random().toString(36).slice(2, 6));
  const created = await cp.evaluate(() => { const b = [...document.querySelectorAll('button')].find((el) => /^(create|opret)$/i.test((el.textContent || '').trim())); if (b) { b.click(); return true; } return false; });
  step('dialog: Create clicked', created);

  // Watch the preview closely: every add/remove of a section, and every render event.
  if (preview) await preview.evaluate(() => {
    window.__probe = [];
    const t = () => Math.round(performance.now());
    const isSection = (n) => n.nodeType === 1 && /^id-/.test(n.id || '');
    new MutationObserver((muts) => {
      for (const m of muts) {
        for (const n of m.removedNodes) if (isSection(n)) window.__probe.push(`${t()} removed ${n.id} sid=${n.getAttribute('data-sid')}`);
        for (const n of m.addedNodes) if (isSection(n)) window.__probe.push(`${t()} added ${n.id} sid=${n.getAttribute('data-sid')}`);
      }
    }).observe(document.body, { childList: true, subtree: true });
    window.addEventListener('statamic:preview-updated', () => window.__probe.push(`${t()} event statamic:preview-updated`));
  }).catch(() => {});
  page.on('request', (r) => { const u = r.url().replace(SITE_URL, ''); if (/live-preview=/.test(u) && r.method() === 'GET') requests.push(`${at()} GET(render) ${u.slice(0, 120)}`); });
  let seen = base;
  let gained = false;
  const started = Date.now();
  while (Date.now() - started < WATCH_MS) {
    await sleep(100);
    const lpEl = await cp.$('#live-preview-iframe');
    preview = lpEl ? await lpEl.contentFrame() : preview;
    const now = preview ? await sectionFacts(preview).catch(() => seen) : seen;
    if (now.count !== seen.count || now.sids !== seen.sids) {
      log(`preview sections: ${now.count} (${now.sids})`);
      seen = now;
    }
    if (now.count > base.count && !gained) { gained = true; log('→ preview gained a section'); }
  }
  log('CP replicator sets after:', await cpRows());
  step('preview shows the new section without a save', gained, `before ${base.count}, after ${seen.count}`);
  const dockPath = await cp.evaluate(() => (document.querySelector('[data-sve-dock-path], .sve-dock-path, #__sve-code-dock [title*=".antlers.html"]')?.textContent || [...document.querySelectorAll('#__sve-code-dock *')].map((el) => el.textContent || '').find((t) => /\.antlers\.html$/.test(t.trim())) || '').trim());
  const treeSections = await cp.evaluate(() => { const list = document.querySelector('[data-sve-html-tree-list]'); return list ? [(list.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 200)] : []; });
  step('the dock opened the new section, not the header', !!madeHandle && dockPath.includes(madeHandle.split('/').pop()) && !/partials\/header\//.test(dockPath), dockPath || '(no path found)');
  step('the HTML tree lists the new section', treeSections.some((t) => /probe sektion/i.test(t)), treeSections.join(' | ') || '(no rows)');
  step('the sections that were there are still there', base.sids.split(',').every((s) => seen.sids.includes(s)), `before: ${base.sids} | after: ${seen.sids}`);

  const probe = preview ? await preview.evaluate(() => window.__probe || []).catch(() => []) : [];
  console.log('--- preview DOM: section adds/removes (ms since preview load) ---');
  for (const l of probe) console.log(' ', l);
  console.log('--- requests during the probe ---');
  for (const r of requests) console.log(' ', r);
  if (errors.length) { console.log('--- errors ---'); for (const e of errors) console.log(' ', e); }
} finally {
  // Undo: the section type made for the probe (files + registry entry). The entry was never saved.
  const cpFrame = (await page.$('iframe.sve-edit-overlay')) ? await (await page.$('iframe.sve-edit-overlay')).contentFrame() : page.mainFrame();
  if (madeHandle) {
    const del = await cpFrame.evaluate(async (handle) => {
      const token = window.Statamic?.$config?.get?.('csrfToken') || document.querySelector('meta[name="csrf-token"]')?.content || '';
      const res = await fetch(`/!/sve/section-types?handle=${encodeURIComponent(handle)}`, { method: 'DELETE', credentials: 'same-origin', headers: { 'X-CSRF-TOKEN': token, 'X-Requested-With': 'XMLHttpRequest', Accept: 'application/json' } });
      return `${res.status}`;
    }, madeHandle).catch((e) => e.message);
    console.log(`cleanup: deleted section type ${madeHandle} → HTTP ${del}`);
  } else {
    console.log('cleanup: no section type was made');
  }
  await browser.close();
}
