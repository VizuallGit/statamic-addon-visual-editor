/**
 * The rules of live reload in Live Preview (lib/live-reload.js): what the
 * poll asks for and what each answer means.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dockTypeOf, nextStep, sectionTypesOf, statusUrl } from '../../resources/js/lib/live-reload.js';

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

  assert.deepEqual(step, { have: { markup: 'm1', build: 'b1' }, refresh: false, css: null, changed: null });
});

test('an unchanged answer asks for nothing', () => {
  const have = { markup: 'm1', build: 'b1' };

  assert.deepEqual(nextStep(have, { markup: 'm1', build: 'b1', own: false, css: '/x.css' }), {
    have,
    refresh: false,
    css: null,
    changed: null,
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

  assert.deepEqual(step, { have: { markup: 'm1', build: 'b2' }, refresh: false, css: '/build/assets/site-b.css', changed: null });
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

test('the files behind a foreign change come along; an own change or a server that cannot say gives none', () => {
  const have = { markup: 'm1', build: 'b1' };
  const files = [{ path: 'resources/views/a.antlers.html', content: '<p>a</p>' }];

  assert.deepEqual(nextStep(have, { markup: 'm2', build: 'b1', own: false, changed: files }).changed, files);
  assert.equal(nextStep(have, { markup: 'm2', build: 'b1', own: true, changed: files }).changed, null);
  assert.equal(nextStep(have, { markup: 'm2', build: 'b1', own: false, changed: null }).changed, null);
  assert.equal(nextStep(have, { markup: 'm2', build: 'b1', own: false }).changed, null, 'an older server');
});

test("dockTypeOf: a section partial's handle, '' for any other file", () => {
  assert.equal(dockTypeOf('resources/views/partials/page_sections/hero/style_2.antlers.html'), 'hero/style_2');
  assert.equal(dockTypeOf('/srv/site/resources/views/partials/page_sections/media_textbox.antlers.html'), 'media_textbox');
  assert.equal(dockTypeOf('resources/views/layout.antlers.html'), '');
  assert.equal(dockTypeOf('resources/views/partials/components/card.antlers.html'), '');
  assert.equal(dockTypeOf(''), '');
  assert.equal(dockTypeOf(undefined), '');
});

test('sectionTypesOf: the types when every changed file is a section partial, null otherwise', () => {
  const hero = { path: 'resources/views/partials/page_sections/hero/style_2.antlers.html' };
  const stats = { path: 'resources/views/partials/page_sections/content/stats.antlers.html' };

  assert.deepEqual(sectionTypesOf([hero, stats, hero]), ['hero/style_2', 'content/stats']);
  assert.equal(sectionTypesOf([hero, { path: 'resources/views/layout.antlers.html' }]), null, 'the layout changed too: the whole page');
  assert.equal(sectionTypesOf([]), null);
  assert.equal(sectionTypesOf(null), null, 'the server could not say');
});
