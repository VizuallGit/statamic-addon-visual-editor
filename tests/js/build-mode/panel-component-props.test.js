/**
 * A component's head in Vizuall Build. The props host stands aside while Build
 * has the column and the dock takes the declaration out of the text, so the
 * Build panel is the one place left that can show the props: they must always
 * be one button away, and the panel must open on them.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const JS = join(dirname(fileURLToPath(import.meta.url)), '../../../resources/js');
const panel = readFileSync(join(JS, 'cp/surfaces/BuildPanel.vue'), 'utf8');
const boot = readFileSync(join(JS, 'build-mode/boot.js'), 'utf8');

test('the head stands while a component file is open, above Add and the element', () => {
  const template = panel.slice(panel.indexOf('<template>'));

  assert.ok(template.includes('v-if="componentPropsUi.open" class="fg-head bm-chead"'));
  assert.ok(template.indexOf('data-sve-build-chead') < template.indexOf("v-else-if=\"side === 'add'\""));
});

test('the panel opens on the props, and they replace Add or Content | Style', () => {
  assert.ok(panel.includes("const componentView = ref(componentPropsUi.open ? 'props' : '');"));
  assert.ok(panel.includes("componentView.value = open ? 'props' : '';"));

  const template = panel.slice(panel.indexOf('<template>'));

  assert.ok(template.includes(`v-if="componentView === 'props'" ref="propsHost"`));
  assert.ok(template.includes(`v-else-if="componentView === 'info'"`));
});

test('the props are the props panel itself, through the port, and leave with the panel', () => {
  assert.ok(boot.includes('mountProps: (el) => unmounter(mountStatamicSurface(ComponentPropsPane, el)),'));
  assert.ok(panel.includes('unmountProps = el ? port.mountProps(el) || null : null;'));
  assert.ok(panel.includes('onBeforeUnmount(() => unmountProps?.());'));
});

test('a click with a prop\'s target armed is the target\'s: the props stay', () => {
  assert.ok(panel.includes('if (!componentPropsUi.bindingHandle) {'));
  assert.ok(panel.includes("{ flush: 'sync' }"));
  assert.ok(boot.indexOf('clicks.value += 1;') < boot.indexOf("hooks.select?.(wholeOwner(html(), path) || path || '');"), 'counted before the pick disarms it');
});
