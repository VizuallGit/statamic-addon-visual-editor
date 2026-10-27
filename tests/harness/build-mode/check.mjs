#!/usr/bin/env node
/**
 * The Build panel in its harness, clicked like a person: every step types or
 * clicks in the real panel and reads the file it wrote.
 *
 *   SVE_HARNESS_URL  where the built harness is served
 *                    (default http://127.0.0.1:8771/build-mode-harness/index.html)
 *   SVE_SITE_DIR     a site checkout with puppeteer in node_modules
 *   SVE_SHOTS        a folder for a screenshot after each step (optional)
 *
 *   node tests/harness/build-mode/check.mjs
 */
import { createRequire } from 'node:module';

const URL = process.env.SVE_HARNESS_URL || 'http://127.0.0.1:8771/build-mode-harness/index.html';
const SITE_DIR = process.env.SVE_SITE_DIR || `${process.env.HOME}/Sites/vizuall-skabelon`;
const SHOTS = process.env.SVE_SHOTS || '';
const puppeteer = createRequire(`${SITE_DIR}/package.json`)('puppeteer');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const results = [];
let failed = 0;
const step = (name, ok, note = '') => {
  results.push(`${ok ? 'ok  ' : 'FAIL'} ${name}${note ? ` — ${note}` : ''}`);
  console.log(results[results.length - 1]);
  if (!ok) failed++;
};

const H2 = '0:section/0:div/0:div/0:div/1:h2';
const COLUMN = '0:section/0:div/0:div/0:div';
const WRAPPER = '0:section/0:div';

const browser = await puppeteer.launch({ headless: true, executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', defaultViewport: { width: 1500, height: 950 } });
const page = await browser.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));

const html = () => page.evaluate(() => window.__sveBuildHarness.html());
const tagOf = (path) => page.evaluate((p) => {
  const h = window.__sveBuildHarness;
  const node = h.selectedPath() === p ? h.pickedClasses() : null;
  return node;
}, path);
const select = (path) => page.evaluate((p) => window.__sveBuildHarness.select(p), path);
const shot = async (name) => SHOTS && page.screenshot({ path: `${SHOTS}/${name}.png` });
const classesOf = async (path) => {
  await select(path);
  await sleep(150);
  return page.evaluate(() => window.__sveBuildHarness.pickedClasses().join(' '));
};
async function typeInto(selector, text) {
  await page.click(selector, { clickCount: 3 });
  await page.evaluate((sel) => { const el = document.querySelector(sel); el.value = ''; el.dispatchEvent(new Event('input', { bubbles: true })); }, selector);
  await page.type(selector, text);
  await page.keyboard.press('Enter');
  await sleep(200);
}

try {
  await page.goto(URL, { waitUntil: 'networkidle0' });
  await sleep(500);
  step('the panel draws Add with the dock\'s own tiles', await page.evaluate(() => ['section', 'container', 'columns', 'heading', 'loop', 'li'].every((id) => document.querySelector(`[data-sve-build-tile="${id}"]`))));

  // Pick the heading: the panel turns to Style.
  await select(H2);
  await sleep(250);
  step('picking an element opens Style with its name', await page.evaluate(() => /Heading/.test(document.querySelector('.sve-build-head__name')?.textContent || '')));

  // Spacing box: padding block-start, typed.
  await typeInto('.sve-build-box__in.is-t input', '10px');
  step('a typed value in padding block-start writes pbs-[10px]', / pbs-\[10px\]/.test(await classesOf(H2)), await classesOf(H2));
  const painted = await page.evaluate(() => {
    const doc = document.querySelector('.hx-frame').contentDocument;
    return getComputedStyle(doc.querySelector('h2')).paddingBlockStart;
  });
  step('…and the compiler paints it in the preview', painted === '10px', `padding-block-start ${painted}`);
  await shot('1-padding');

  // Link "all", custom property.
  await page.evaluate(() => [...document.querySelectorAll('.sve-build-box__link button')].find((b) => /all|alle/.test(b.textContent)).click());
  await sleep(150);
  await typeInto('.sve-build-box__in.is-t input', '--gutter');
  step('linked to all four sides, --gutter writes p-(--gutter)', /(^| )p-\(--gutter\)/.test(await classesOf(H2)), await classesOf(H2));
  await page.evaluate(() => [...document.querySelectorAll('.sve-build-box__link button')][0].click());

  // Mobile + font-size from a token.
  await page.evaluate(() => [...document.querySelectorAll('.sve-build-sizes button')].find((b) => /Mobile/.test(b.textContent)).click());
  await sleep(150);
  const fontInput = await page.evaluateHandle(() => [...document.querySelectorAll('.sve-build-row')].find((r) => r.textContent.includes('font-size'))?.querySelector('input'));
  await fontInput.asElement().click({ clickCount: 3 });
  await page.keyboard.type('500');
  await page.keyboard.press('Enter');
  await sleep(200);
  step('on Mobile, font-size 500 writes max-md:text-500 and keeps the base text-800', /max-md:text-500/.test(await classesOf(H2)) && /(^| )text-800/.test(await classesOf(H2)), await classesOf(H2));
  await shot('2-mobile');
  await page.evaluate(() => [...document.querySelectorAll('.sve-build-sizes button')][0].click());

  // Position: relative — the site's own position classes as a row.
  await page.evaluate(() => { const g = document.querySelector('[data-group="position"]'); g.open = true; });
  await sleep(150);
  await page.evaluate(() => [...document.querySelectorAll('[data-group="position"] .sve-build-seg button')].find((b) => b.textContent.trim() === 'relative').click());
  step('position: relative writes relative', /(^| )relative( |$)/.test(await classesOf(H2)), await classesOf(H2));
  await page.evaluate(() => [...document.querySelectorAll('[data-group="position"] .sve-build-seg button')].find((b) => b.textContent.trim() === 'relative').click());
  step('…clicked again, it is taken off — the same toggle as the Tailwind pane', !/(^| )relative( |$)/.test(await classesOf(H2)));

  // A field that still has focus when the pick moves writes nothing anywhere.
  const columnBefore = await classesOf(COLUMN);
  await select(H2);
  await sleep(150);
  const focused = await page.evaluateHandle(() => [...document.querySelectorAll('.sve-build-row')].find((r) => r.textContent.includes('font-size'))?.querySelector('input'));
  await focused.asElement().click();
  await select(COLUMN);
  await sleep(200);
  await page.mouse.click(700, 900);
  await sleep(150);
  // The column was never styled: it must still be exactly what the file started with.
  step('a focused field writes nothing onto the next pick', columnBefore === 'flow-y' && (await classesOf(COLUMN)) === 'flow-y', `${columnBefore} → ${await classesOf(COLUMN)}`);

  // Add: a heading into the picked column, at its end.
  await select(COLUMN);
  await sleep(150);
  await page.evaluate(() => [...document.querySelectorAll('.sve-build__tabs button')][0].click());
  await sleep(150);
  const target = await page.evaluate(() => document.querySelector('.sve-build-target span')?.textContent);
  step('Add says where the element lands', /into|i /.test(target || ''), target);
  await page.click('[data-sve-build-tile="heading"]');
  await sleep(200);
  const afterHeading = await html();
  step('Heading lands as the column\'s last child, indented', afterHeading.includes('<a href="" class="btn">Se vores cases</a>\n                <h2>New heading</h2>\n            </div>'));
  step('…and is picked', await page.evaluate(() => /h2$/.test(window.__sveBuildHarness.selectedPath())));
  await shot('3-heading');

  // The tree's + on the wrapper → Columns ⅓ × 3.
  await page.evaluate((p) => window.__sveBuildHarness.setPlus(p), WRAPPER);
  await sleep(150);
  await page.click('[data-sve-build-tile="columns"]');
  await sleep(150);
  await page.evaluate(() => [...document.querySelectorAll('.sve-build-picker__pick')].find((b) => b.textContent.includes('⅓ × 3')).click());
  await sleep(250);
  const afterColumns = await html();
  step('the tree\'s + on the wrapper, Columns ⅓ × 3: a grid with three empty columns at the end of the wrapper',
    afterColumns.includes('        <div class="grid grid-cols-3 max-md:grid-cols-1">\n            <div></div>\n            <div></div>\n            <div></div>\n        </div>\n    </div>'));
  const cols = await page.evaluate(() => {
    const doc = document.querySelector('.hx-frame').contentDocument;
    const grid = [...doc.querySelectorAll('.grid-cols-3')][0];
    return grid ? getComputedStyle(grid).gridTemplateColumns.split(' ').length : 0;
  });
  step('…drawn as three columns in the preview', cols === 3, `${cols} tracks`);

  // A component from the site's folder.
  await page.evaluate(() => [...document.querySelectorAll('.sve-build-add__sub button')][1].click());
  await sleep(300);
  const comp = await page.evaluate(() => document.querySelectorAll('[data-sve-build-component]').length);
  step('Components lists the site\'s partials/components', comp > 5, `${comp} components`);
  await page.click('[data-sve-build-component="card"]');
  await sleep(200);
  step('a component tile writes the call the dock\'s component menu writes', (await html()).includes('{{ partial:components/card }}'));
  await shot('4-columns-card');

  // Danish.
  await page.evaluate(() => [...document.querySelectorAll('.hx-sw button')].find((b) => b.textContent === 'DA').click());
  await sleep(200);
  step('the panel speaks Danish when the CP does', await page.evaluate(() => /Tilføj/i.test(document.querySelector('.sve-build__tabs').textContent)));

  step('no JavaScript errors', !errors.length, errors.slice(0, 3).join(' | '));
} catch (e) {
  step('no exception', false, e.stack);
} finally {
  await browser.close();
}

console.log(`\n${results.length - failed}/${results.length} ok`);
process.exit(failed ? 1 : 0);
