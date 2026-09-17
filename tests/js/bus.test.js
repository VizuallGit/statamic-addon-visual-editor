/**
 * Contract test for the CP event bus (resources/js/cp/bus.js).
 *
 * The bus is how surfaces talk without importing each other:
 *   register(name, fn) + ask(name, payload)  — one answerer, returns its value
 *   on(name, fn) + emit(name, payload)        — many listeners, no return value
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { register, ask, on, emit } from '../../resources/js/cp/bus.js';

test('ask() returns what the registered handler returns', () => {
  register('test:double', (n) => n * 2);
  assert.equal(ask('test:double', 21), 42);
});

test('ask() on an unknown name returns undefined instead of throwing', () => {
  assert.equal(ask('test:nobody-registered-this'), undefined);
});

test('register() replaces an earlier handler for the same name', () => {
  register('test:replace', () => 'first');
  register('test:replace', () => 'second');
  assert.equal(ask('test:replace'), 'second');
});

test('emit() reaches every listener in the order they subscribed', () => {
  const seen = [];
  on('test:event', (p) => seen.push(`a:${p}`));
  on('test:event', (p) => seen.push(`b:${p}`));
  emit('test:event', 'x');
  assert.deepEqual(seen, ['a:x', 'b:x']);
});

test('the function on() returns unsubscribes only that listener', () => {
  const seen = [];
  const off = on('test:unsub', () => seen.push('kept'));
  const offGone = on('test:unsub', () => seen.push('gone'));
  offGone();
  emit('test:unsub');
  off();
  emit('test:unsub');
  assert.deepEqual(seen, ['kept']);
});
