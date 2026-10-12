/**
 * The rules of live reload in Live Preview (lib/live-reload.js): what the
 * poll asks for and what each answer means.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { nextStep, statusUrl } from '../../resources/js/lib/live-reload.js';

test('the first poll asks without signatures; later polls carry what we hold', () => {
  assert.equal(statusUrl('/!/sve/live-reload', null), '/!/sve/live-reload');
  assert.equal(
    statusUrl('/!/sve/live-reload', { markup: 'm 1', build: 'b&1' }),
    '/!/sve/live-reload?markup=m%201&build=b%261'
  );
  assert.equal(statusUrl('/!/sve/live-reload', { markup: 'm1' }), '/!/sve/live-reload');
});

test('the first answer is adopted and nothing is done about it', () => {
  const step = nextStep(null, { markup: 'm1', build: 'b1', own: false, css: '/build/assets/site-a.css' });

  assert.deepEqual(step, { have: { markup: 'm1', build: 'b1' }, refresh: false, css: null });
});

test('an unchanged answer asks for nothing', () => {
  const have = { markup: 'm1', build: 'b1' };

  assert.deepEqual(nextStep(have, { markup: 'm1', build: 'b1', own: false, css: '/x.css' }), {
    have,
    refresh: false,
    css: null,
  });
});

test('markup changed from outside the editor → refresh', () => {
  const step = nextStep({ markup: 'm1', build: 'b1' }, { markup: 'm2', build: 'b1', own: false });

  assert.equal(step.refresh, true);
  assert.equal(step.css, null);
  assert.deepEqual(step.have, { markup: 'm2', build: 'b1' });
});

test("markup changed by the editor's own write → adopted, no refresh", () => {
  const step = nextStep({ markup: 'm1', build: 'b1' }, { markup: 'm2', build: 'b1', own: true });

  assert.equal(step.refresh, false);
  assert.deepEqual(step.have, { markup: 'm2', build: 'b1' });
});

test('an answer without `own` (an older server) is treated as foreign', () => {
  assert.equal(nextStep({ markup: 'm1', build: 'b1' }, { markup: 'm2', build: 'b1' }).refresh, true);
});

test('build changed → the built stylesheet is swapped, nothing re-rendered', () => {
  const step = nextStep(
    { markup: 'm1', build: 'b1' },
    { markup: 'm1', build: 'b2', own: false, css: '/build/assets/site-b.css' }
  );

  assert.deepEqual(step, { have: { markup: 'm1', build: 'b2' }, refresh: false, css: '/build/assets/site-b.css' });
});

test('build changed but the server names no stylesheet → adopted, nothing swapped', () => {
  const step = nextStep({ markup: 'm1', build: 'b1' }, { markup: 'm1', build: 'b2', own: false, css: null });

  assert.equal(step.css, null);
  assert.equal(step.have.build, 'b2');
});

test('markup and build changed together → both', () => {
  const step = nextStep(
    { markup: 'm1', build: 'b1' },
    { markup: 'm2', build: 'b2', own: false, css: '/build/assets/site-b.css' }
  );

  assert.equal(step.refresh, true);
  assert.equal(step.css, '/build/assets/site-b.css');
});

test('a change is acted on once: the next unchanged answer is quiet', () => {
  const first = nextStep({ markup: 'm1', build: 'b1' }, { markup: 'm2', build: 'b1', own: false });
  const second = nextStep(first.have, { markup: 'm2', build: 'b1', own: false });

  assert.equal(first.refresh, true);
  assert.equal(second.refresh, false);
});
