#!/usr/bin/env node
/**
 * Section switch — opening a section in Live Preview must write nothing.
 *
 * With the code dock and the HTML tree open: click a section in the preview,
 * then another section's row in the tree, logging every 250 ms what the dock,
 * the tree, lite and the preview are doing. The verdict: after the first
 * click no POST to /!/sve/section-template and no section reload (sve_sid).
 * Before v1.1.169 the dock compiled the file's Tailwind classes on open, took
 * the result for a change, saved and reloaded the section — "Saving…" and a
 * flicker for merely looking at a section, and a reload that landed in the
 * middle of the next switch.
 *
 *   SVE_SITE_DIR / SVE_SITE_URL / SVE_USER / SVE_PASS   as in the smoke test
 *   SVE_ENTRY   an entry whose last section is a "test heroo"-style section
 *               preceded by the section to open first (default: the site's test page)
 *
 *   node tests/browser/section-switch.mjs
 */
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync } from 'node:fs';

const env = (key, fallback) => process.env[key] || fallback;
const SITE_DIR = env('SVE_SITE_DIR', `${process.env.HOME}/Sites/vizuall-skabelon`);
const SITE_URL = env('SVE_SITE_URL', 'http://vizuall-skabelon.test');
const USER = env('SVE_USER', 'claude-test@vizuall.dk');
const PASS = env('SVE_PASS', '');
const ENTRY = env('SVE_ENTRY', '/cp/collections/pages/entries/68d0174e-6b29-425c-9e55-d096b0727ec6');
const CHROME = env('SVE_CHROME', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome');
const puppeteer = createRequire(`${SITE_DIR}/package.json`)('puppeteer');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const t0 = Date.now();
const at = () => String(Date.now() - t0).padStart(6) + ' ms';

// Start from the user's layout: panel shown, dock armed, tree open.
const USER_FILE = `${SITE_DIR}/users/${USER}.yaml`;
function seed(prefs) {
  let yaml = readFileSync(USER_FILE, 'utf8').replace(/^  sve_chrome:\n(?:    .*\n)*/m, '');
  if (prefs) {
    const block = `  sve_chrome:\n${Object.entries(prefs).map(([k, v]) => `    ${k}: '${String(v).replace(/'/g, "''")}'\n`).join('')}`;
    yaml = /^preferences:\n/m.test(yaml) ? yaml.replace(/^preferences:\n/m, `preferences:\n${block}`) : `${yaml.replace(/\n*$/, '\n')}preferences:\n${block}`;
  }
  writeFileSync(USER_FILE, yaml);
}
seed({ 'sve-lp-panel-mode': 'show', 'sve-code-dock-armed': '1', 'sve-right-dock-open': '1', 'sve-right-dock-open-panes': '["html_tree"]' });

const browser = await puppeteer.launch({ headless: true, executablePath: CHROME, args: ['--window-size=1440,900'], defaultViewport: { width: 1440, height: 900 } });
const page = await browser.newPage();
const net = [];
page.on('request', (r) => { const u = r.url().replace(SITE_URL, ''); if (/\/!\/sve\/|live-preview|\/cp\/collections/.test(u) && !/build\/assets|\.png|\.jpg|\.svg/.test(u)) net.push(`${at()} → ${r.method()} ${u.slice(0, 110)}`); });
page.on('framenavigated', (f) => { if (f !== page.mainFrame()) net.push(`${at()} ⟳ frame navigated ${f.url().replace(SITE_URL, '').slice(0, 90)}`); });
page.on('pageerror', (e) => net.push(`${at()} ✗ pageerror ${e.message.slice(0, 120)}`));

try {
  await page.goto(`${SITE_URL}/cp`, { waitUntil: 'networkidle2' });
  await page.type('input[name="email"]', USER); await page.type('input[name="password"]', PASS);
  await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle2' }), page.keyboard.press('Enter')]);
  await page.goto(`${SITE_URL}${ENTRY}`, { waitUntil: 'networkidle2' });
  await sleep(1500);
  let cp = page.mainFrame();
  if (!(await page.$('iframe.sve-edit-overlay'))) {
    await page.evaluate(() => [...document.querySelectorAll('button, a')].find((el) => /live preview|forhåndsvisning/i.test(el.textContent || ''))?.click());
    await page.waitForSelector('iframe.sve-edit-overlay[data-open]', { timeout: 30000 });
  }
  cp = await (await page.$('iframe.sve-edit-overlay')).contentFrame();
  await page.keyboard.press('Escape');
  await cp.waitForSelector('#__sve-toolbar button', { timeout: 20000 });
  const preview = async () => { const el = await cp.$('#live-preview-iframe'); return el ? el.contentFrame() : null; };
  for (let i = 0; i < 25; i++) { const p = await preview(); if (p && (await p.evaluate(() => document.querySelectorAll('[id^="id-"]').length).catch(() => 0)) > 5) break; await sleep(1000); }
  await sleep(2500);

  const snap = async (label) => {
    const p = await preview();
    const c = await cp.evaluate(() => {
      const path = document.querySelector('[data-sve-code-path]');
      const dock = document.getElementById('__sve-code-dock');
      const status = dock?.querySelector('[data-sve-code-status]')?.textContent?.trim() || '';
      const cur = document.querySelector('[data-sve-ht-current]');
      const lite = document.querySelector('[data-sve-lite]')?.getAttribute('data-sve-lite');
      const trace = (window.__sveInstantTrace || []).slice(-1)[0];
      return { file: (path?.getAttribute('data-sve-code-path') || path?.textContent || '').split('/').slice(-2).join('/'), status, tree: cur?.textContent?.trim().slice(0, 40) || '', lite, trace: typeof trace === 'string' ? trace.slice(0, 80) : '' };
    }).catch((e) => ({ err: e.message.slice(0, 60) }));
    const pv = p ? await p.evaluate(() => {
      const sec = document.querySelector('.hero-test-heroo, [class*="test-heroo"]') || [...document.querySelectorAll('section[id^="id-"]')].pop();
      return { heroo: sec ? `${sec.id} ${sec.className.slice(0, 30)} text="${(sec.innerText || '').trim().slice(0, 30)}" children=${sec.children.length}` : 'none', active: document.querySelectorAll('[data-sid-active]').length };
    }).catch((e) => ({ err: e.message.slice(0, 60) })) : { err: 'no preview' };
    const msgs = await cp.evaluate(() => { const m = (window.__probeMsgs || []).splice(0); return m.join(' '); }).catch(() => '');
    net.push(`${at()} [${label}] dock=${c.file || '-'} ${c.status ? '(' + c.status + ')' : ''} | tree=${c.tree} | lite=${c.lite} | paint=${(c.trace || '').replace(/^\d+ /, '')} | heroo: ${pv.heroo} active=${pv.active}${msgs ? ' | msgs: ' + msgs : ''}`);
  };

  // section A: a text field inside the employees list; section B: the test heroo root (empty)
  const rects = await (await preview()).evaluate(() => {
    const vis = (el) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 ? { x: r.x + r.width / 2, y: r.y + Math.min(r.height / 2, 200), top: r.top } : null; };
    const all = [...document.querySelectorAll('section[id^="id-"]')];
    const heroo = all.find((s) => /heroo/i.test(s.className));
    // the employees list carries no _class on its root; it is the section right before the test heroo
    const emp = heroo ? all[all.indexOf(heroo) - 1] : all.find((s) => /Assurand/.test(s.innerText || ''));
    const a = emp?.querySelector('h2[data-sid-field], [data-sid-field]') || emp;
    return { a: a ? { ...vis(a), id: emp.id, what: a.tagName + ' ' + (a.getAttribute('data-sid-field') || '') } : null, b: heroo ? { ...vis(heroo), id: heroo.id, cls: heroo.className } : null };
  });
  net.push(`${at()} targets A=${JSON.stringify(rects.a)} B=${JSON.stringify(rects.b)}`);
  const frameBox = await (await cp.$('#live-preview-iframe')).boundingBox();
  const overlayBox = await (await page.$('iframe.sve-edit-overlay')).boundingBox();
  const toPage = (r) => ({ x: overlayBox.x + frameBox.x + r.x, y: overlayBox.y + frameBox.y + r.y });
  await cp.evaluate(() => { window.__probeMsgs = []; window.addEventListener('message', (e) => { if (e.data?.source === 'statamic-visual-editor') window.__probeMsgs.push(`${e.data.type}${e.data.uid ? ':' + e.data.uid.slice(-4) : ''}${e.data.field ? '/' + e.data.field : ''}`); }); });
  const clickIn = async (r, label) => {
    // bring the target into the preview's viewport, then aim at what is really there
    const again = await (await preview()).evaluate((id) => {
      const el = document.getElementById(id);
      el.scrollIntoView({ block: 'center', behavior: 'instant' });
      const rr = el.getBoundingClientRect();
      const x = rr.x + rr.width / 2, y = Math.max(rr.y + 20, Math.min(rr.y + rr.height / 2, innerHeight - 20));
      const under = document.elementFromPoint(x, y);
      return { x, y, under: under ? `${under.tagName.toLowerCase()}${under.id ? '#' + under.id : ''} sid=${under.closest('[data-sid]')?.getAttribute('data-sid')?.slice(-4) || '-'}` : 'nothing' };
    }, r.id);
    const fb = await (await cp.$('#live-preview-iframe')).boundingBox();
    const p = { x: overlayBox.x + fb.x + again.x, y: overlayBox.y + fb.y + again.y };
    await cp.evaluate(() => { window.__probeMsgs.length = 0; });
    net.push(`${at()} CLICK ${label} at ${Math.round(p.x)},${Math.round(p.y)} (preview ${Math.round(again.x)},${Math.round(again.y)} under ${again.under}; frame y=${Math.round(fb.y)} h=${Math.round(fb.height)})`);
    await page.mouse.click(p.x, p.y);
  };

  await snap('start');
  await clickIn(rects.a, 'A employees');
  for (let i = 0; i < 12; i++) { await sleep(250); if (i % 2 === 1) await snap(`A+${(i + 1) * 250}`); }
  await sleep(1500); await snap('A settled');
  // Verdict for the fix: opening a section must not save it, and must not reload it.
  const sinceA = net.slice(net.findIndex((l) => /CLICK A/.test(l)));
  const saved = sinceA.filter((l) => /POST \/!\/sve\/section-template/.test(l)).length;
  const reloaded = sinceA.filter((l) => /sve_sid=/.test(l)).length;
  net.push(`${at()} VERDICT opening a section: ${saved} save(s), ${reloaded} section reload(s) — ${saved === 0 && reloaded === 0 ? 'OK, nothing written or reloaded' : 'STILL SAVES/RELOADS ON OPEN'}`);
  // B: the way the user reaches an empty section — its row in the HTML tree
  const herooRect = await (await preview()).evaluate((id) => { const r = document.getElementById(id).getBoundingClientRect(); return { h: Math.round(r.height), w: Math.round(r.width) }; }, rects.b.id);
  const row = await cp.evaluate(() => {
    const rows = [...document.querySelectorAll('[data-sve-ht-row]')];
    const hit = rows.find((el) => /heroo/i.test(el.textContent || ''));
    if (!hit) return { rows: rows.length, texts: rows.slice(0, 8).map((r) => (r.textContent || '').trim().slice(0, 24)) };
    const r = hit.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2, text: (hit.textContent || '').trim().slice(0, 40), attrs: [...hit.attributes].map((a) => a.name + (a.value ? '=' + a.value.slice(0, 14) : '')).join(' ') };
  });
  net.push(`${at()} heroo section in preview: ${JSON.stringify(herooRect)}; tree row: ${JSON.stringify(row)}`);
  if (row.x) {
    await cp.evaluate(() => { window.__probeMsgs.length = 0; });
    net.push(`${at()} CLICK B tree row at ${Math.round(overlayBox.x + row.x)},${Math.round(overlayBox.y + row.y)}`);
    await page.mouse.click(overlayBox.x + row.x, overlayBox.y + row.y);
  }
  const rowState = async () => cp.evaluate(() => { const hit = [...document.querySelectorAll('[data-sve-ht-row]')].find((el) => /heroo/i.test(el.textContent || '')); return hit ? [...hit.attributes].filter((a) => a.name !== 'style').map((a) => a.name.replace('data-sve-ht-', '') + (a.value ? '=' + a.value.slice(0, 10) : '')).join(' ') + ' cls=' + hit.className.slice(0, 40) : 'no row'; }).catch(() => '?');
  for (let i = 0; i < 24; i++) { await sleep(250); await snap(`B+${(i + 1) * 250}`); net.push(`${at()}        heroo row: ${await rowState()}`); }
  await sleep(1000); await snap('B settled');
} catch (e) {
  net.push(`${at()} EXCEPTION ${e.message}`);
} finally {
  await browser.close();
  await sleep(1500);
  seed(null);
}
console.log(net.join('\n'));
const verdict = net.find((l) => /VERDICT/.test(l)) || '';
process.exit(/OK, nothing written/.test(verdict) && !net.some((l) => /EXCEPTION/.test(l)) ? 0 : 1);
