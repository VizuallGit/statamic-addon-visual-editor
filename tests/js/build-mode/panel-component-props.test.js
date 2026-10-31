/**
 * A component's props stay in Vizuall Build. The host steps aside while Build
 * has the column, and the dock takes the declaration out of the text, so the
 * Build panel is the one place left that can show them.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const JS = join(dirname(fileURLToPath(import.meta.url)), '../../../resources/js');
const panel = readFileSync(join(JS, 'cp/surfaces/BuildPanel.vue'), 'utf8');

test('the panel shows the props while a component file is open, on both sides', () => {
  assert.ok(panel.includes("from '../component-props/store.js'"));
  assert.ok(panel.includes("componentPropsUi.open && !(side.value === 'element' && content.value === 'fields')"));

  const template = panel.slice(panel.indexOf('<template>'));

  assert.ok(
    template.indexOf('data-sve-build-cprops') < template.indexOf("v-if=\"side === 'add'\""),
    'above the two sides, so neither Add nor an element can hide it'
  );
});

test('the props are the props panel itself, through the port, and leave with the panel', () => {
  assert.ok(panel.includes('unmountProps = el ? port.mountFields(el) || null : null;'));
  assert.ok(panel.includes('onBeforeUnmount(() => unmountProps?.());'));
});
