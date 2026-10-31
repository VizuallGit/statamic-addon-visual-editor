import { test } from 'node:test';
import assert from 'node:assert/strict';
import { coveredBy } from '../../resources/js/tw-covered.js';

const covered = (names, name) => coveredBy(names.split(' '), name).sort();

test('a side alone leaves its axis: the axis still sets the other side', () => {
  assert.deepEqual(covered('py-1000 pt-2', 'pt-2'), []);
  assert.deepEqual(covered('p-4 pl-2', 'pl-2'), []);
});

test('the second side ends the axis', () => {
  assert.deepEqual(covered('py-1000 pt-2 pb-2.5', 'pb-2.5'), ['py-1000']);
  assert.deepEqual(covered('mx-auto ml-2 mr-[3rem]', 'mr-[3rem]'), ['mx-auto']);
});

test('all sides, or both axes, end the class for all four', () => {
  assert.deepEqual(covered('p-4 pt-1 pr-1 pb-1 pl-1', 'pl-1'), ['p-4']);
  assert.deepEqual(covered('p-4 px-2 py-2', 'py-2'), ['p-4']);
  assert.deepEqual(covered('p-4 px-2 pt-1', 'pt-1'), []);
});

test('a wider class takes the narrower ones it would lose to', () => {
  assert.deepEqual(covered('pt-2 pb-2.5 py-4', 'py-4'), ['pb-2.5', 'pt-2']);
  assert.deepEqual(covered('pt-2 px-1 p-4', 'p-4'), ['pt-2', 'px-1']);
  assert.deepEqual(covered('pl-2 py-4', 'py-4'), []);
});

test('a physical and a logical name for one side are one side', () => {
  assert.deepEqual(covered('pbs-500 pt-2', 'pt-2'), ['pbs-500']);
  assert.deepEqual(covered('py-1000 pbs-2 pb-3', 'pb-3'), ['py-1000']);
  assert.deepEqual(covered('px-4 ps-1 pe-2', 'pe-2'), ['px-4']);
});

test('padding, margin and gap stay apart; a negative margin is a margin', () => {
  assert.deepEqual(covered('py-4 mt-1 mb-1', 'mb-1'), []);
  assert.deepEqual(covered('my-4 -mt-1 mb-1', 'mb-1'), ['my-4']);
  assert.deepEqual(covered('gap-4 gap-x-1 gap-y-2', 'gap-y-2'), ['gap-4']);
});

test('what is no box class is left alone', () => {
  assert.deepEqual(covered('prose pt-1 pb-1 py-2', 'flex'), []);
  assert.deepEqual(covered('max-w-sm m-4 ml-1', 'ml-1'), []);
  assert.deepEqual(covered('prose text-lg pt-1', 'pt-1'), []);
  assert.deepEqual(covered('placeholder-red-500 p-1', 'p-1'), []);
});
