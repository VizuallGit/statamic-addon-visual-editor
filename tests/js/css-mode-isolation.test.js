import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

/*
 * The CSS mode demo stands beside Tailwind's paint and never in it: it writes no
 * class, says no `tw:changed`, and reaches the canvas through a sheet of its own.
 */

const ROOT = new URL('../../resources/js/', import.meta.url).pathname;
const DIR = join(ROOT, 'build-mode/css-mode');
const FILES = [
  ...readdirSync(DIR).filter((name) => name.endsWith('.js')).map((name) => join(DIR, name)),
  join(ROOT, 'cp/surfaces/BuildStyleCss.vue'),
  join(ROOT, 'cp/surfaces/BuildStyleMode.vue'),
  join(ROOT, 'cp/surfaces/BuildStyleSwitch.vue'),
  join(ROOT, 'cp/surfaces/BuildDataBind.vue'),
];
const read = (file) => readFileSync(file, 'utf8');

test('the demo imports nothing from the Tailwind pane or the kernel', () => {
  const banned = /from\s+['"][^'"]*(tw-classes|tw-tool|tw-compile|tw-overlay|class-target|dock-instant-preview|preview\.js|overlay-host|bridge|live-reload-morph|\/canvas\.js|cp-shell)/;

  for (const file of FILES) {
    assert.ok(!banned.test(read(file)), file);
  }
});

test('the demo calls no function that writes a class, and says no class changed', () => {
  const banned = /\btw(SetClass|AddClass|DropClass|ReplaceClasses|SetFieldClass|SetClassTarget|SetChipHost|SetTag|SetGroup|Reorder|SortClasses|RestoreTag)\b|['"]tw:changed['"]|['"]dock:html-changed['"]|sve:tw-preview/;

  for (const file of FILES) {
    assert.ok(!banned.test(read(file)), file);
  }
});

test('with the demo off, nothing of it but the flag is imported', () => {
  const mode = read(join(ROOT, 'cp/surfaces/BuildStyleMode.vue'));

  assert.ok(/from '\.\/BuildStyle\.vue'/.test(mode));
  assert.ok(/demo \? defineAsyncComponent\(\(\) => import\('\.\/BuildStyleCss\.vue'\)\) : null/.test(mode));
  assert.deepEqual(
    [...mode.matchAll(/^import .* from '([^']+)'/gm)].map((match) => match[1]).sort(),
    ['../../build-mode/css-mode/flag.js', './BuildStyle.vue', 'vue'],
  );
});

test('the sheet is the demo\'s own, on the canvas document\'s root', () => {
  const paint = read(join(DIR, 'paint.js'));

  assert.ok(paint.includes("const SHEET_ID = '__sve-build-css-mode'"));
  assert.ok(paint.includes('page.documentElement.append(sheet)'));
  assert.ok(!/\.head\b|\.body\b/.test(paint.replace(/\/\*[\s\S]*?\*\//g, '')), 'never the head or body the canvas morphs');
});

test('with the demo off the panel\'s looks are not loaded', () => {
  const flag = read(join(DIR, 'flag.js'));

  assert.ok(!/^import .*panel-look/m.test(flag), 'no import at the top of the flag');
  assert.ok(/=== '1'\) \{[\s\S]*import\('\.\/panel-look\.js'\)/.test(flag), 'only inside the flag\'s branch');
});

test('the panel has one door to the demo', () => {
  const panel = read(join(ROOT, 'cp/surfaces/BuildPanel.vue'));

  assert.equal((panel.match(/<BuildStyleMode\b/g) || []).length, 1);
  assert.ok(!/\bBuildStyle\b/.test(panel));
});

test('a Style field draws the data icon only when its port hands it one', () => {
  for (const name of ['BuildValueInput', 'BuildClassField']) {
    const field = read(join(ROOT, `cp/surfaces/${name}.vue`));

    assert.ok(/<component :is="port\.bindIcon" v-if="port\.bindIcon/.test(field), name);
    assert.ok(!/css-mode|BuildDataBind/.test(field.replace(/\/\*[\s\S]*?\*\//g, '')), `${name} imports nothing of the demo`);
  }
});
