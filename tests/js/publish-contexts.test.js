/**
 * lib/publish-containers.js — the registry of publish contexts: one per form,
 * named by its container, newest first, holder-counted.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  containerContext, containerContextName, containerContexts, onContainerContext,
  registerContainerContext, unregisterContainerContext,
} from '../../resources/js/lib/publish-containers.js';

const ctx = (name) => ({ name: { __v_isRef: true, value: name }, setFieldValue() {}, values: {} });

test('contexts register once per form, newest first, and the page is the one named base', () => {
  const seen = [];
  const off = onContainerContext((list) => seen.push(list.map(containerContextName).join(',')));
  const page = ctx('base');
  const global = ctx('sve-global-section');

  registerContainerContext(page);
  registerContainerContext(global);
  assert.deepEqual(containerContexts().map(containerContextName), ['sve-global-section', 'base']);
  assert.equal(containerContext(), page);

  // The field that registers it remounts: created before the old unmounts.
  registerContainerContext(page);
  unregisterContainerContext(page);
  assert.equal(containerContexts().length, 2);

  unregisterContainerContext(global);
  assert.deepEqual(containerContexts().map(containerContextName), ['base']);
  unregisterContainerContext(page);
  assert.deepEqual(containerContexts(), []);
  assert.equal(containerContext(), null);
  registerContainerContext(null); // a missing inject registers nothing
  assert.deepEqual(seen, ['', 'base', 'sve-global-section,base', 'base', '']);
  off();
});

test('whenContainerContext answers now, later, or null after the wait', async () => {
  const { whenContainerContext } = await import('../../resources/js/lib/publish-containers.js');
  const win = { setTimeout: (fn, ms) => setTimeout(fn, ms), clearTimeout: (t) => clearTimeout(t) };
  const page = ctx('base');
  registerContainerContext(page);
  assert.equal(await whenContainerContext('base', 50, win), page);
  const later = whenContainerContext('sve-chrome', 500, win);
  const chrome = ctx('sve-chrome');
  setTimeout(() => registerContainerContext(chrome), 20);
  assert.equal(await later, chrome);
  assert.equal(await whenContainerContext('nothing', 30, win), null);
  unregisterContainerContext(chrome);
  unregisterContainerContext(page);
});
