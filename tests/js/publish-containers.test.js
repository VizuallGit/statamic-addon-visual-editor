/**
 * Contract tests for lib/publish-containers.js — the one list of Statamic's
 * publish containers and the order activeContainers() hands them out in.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  publishContainers, addContainer, onContainer, registerContainerSource, registerContainerEvents, activeContainers,
} from '../../resources/js/lib/publish-containers.js';

const container = (name) => ({ name, setFieldValue() {}, values: {} });
const emptyDoc = { querySelector: () => null };

test('addContainer keeps each container once and announces it to listeners', () => {
  const seen = [];
  onContainer((c) => seen.push(c.name));
  const a = container('a');
  addContainer(a);
  addContainer(a);
  addContainer({ name: 'no-setter', values: {} });
  assert.deepEqual(publishContainers.map((c) => c.name), ['a']);
  assert.deepEqual(seen, ['a']);
});

test('onContainer replays containers that were already known', () => {
  const seen = [];
  onContainer((c) => seen.push(c.name));
  assert.deepEqual(seen, ['a']);
});

test('registerContainerEvents subscribes once and follows created/destroyed', () => {
  const handlers = {};
  const events = { $on: (name, fn) => { handlers[name] = fn; } };
  const win = { Statamic: { $events: events } };
  registerContainerEvents(win);
  registerContainerEvents(win);
  handlers['publish-container-created'](container('b'));
  handlers['publish-container-created']({ name: 'ignored', values: {} });
  assert.deepEqual(publishContainers.map((c) => c.name), ['a', 'b']);
  handlers['publish-container-destroyed']({ name: 'a' });
  assert.deepEqual(publishContainers.map((c) => c.name), ['b']);
});

test('activeContainers is newest first, then the registered sources last', () => {
  addContainer(container('c'));
  const panel = container('panel');
  registerContainerSource(() => panel);
  registerContainerSource(() => null);
  assert.deepEqual(activeContainers(emptyDoc).map((c) => c.name), ['c', 'b', 'panel']);
});
