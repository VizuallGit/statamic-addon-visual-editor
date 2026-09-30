import { test } from 'node:test';
import assert from 'node:assert/strict';
import { frameAxios, isSaveRequest, isSaveResponse, watchFieldsetSaves } from '../../resources/js/cp/surfaces/fieldset-save.js';

/** An axios with interceptors that can be driven by hand. */
function fakeAxios() {
  const request = [];
  const response = [];

  return {
    interceptors: {
      request: { use: (ok) => request.push(ok) },
      response: { use: (ok, bad) => response.push({ ok, bad }) },
    },
    // Runs a request through what was hooked, the way axios would.
    send(config, outcome) {
      for (const fn of request) {
        config = fn(config);
      }

      if (outcome.error) {
        const error = { config, response: { status: outcome.status } };

        return Promise.all(response.map((h) => h.bad(error).catch(() => {})));
      }

      for (const h of response) {
        h.ok({ config, status: outcome.status });
      }

      return Promise.resolve();
    },
  };
}

const PATCH = { method: 'patch', url: '/cp/fields/fieldsets/intro.style_1' };

test('the client is found where Statamic 6 keeps it, and where Statamic 5 did', () => {
  const app = { config: { globalProperties: { $axios: 'on the app' } } };

  assert.equal(frameAxios({ Statamic: { $app: app } }), 'on the app');
  assert.equal(frameAxios({ Statamic: { $axios: 'on the window', $app: app } }), 'on the window');
  assert.equal(frameAxios({ Statamic: { $config: {} } }), null);
  assert.equal(frameAxios(null), null);
});

test('the save is the PATCH to the update URL — not the edit page, not a GET', () => {
  assert.ok(isSaveRequest(PATCH));
  assert.ok(isSaveRequest({ method: 'PUT', url: '/cp/fields/fieldsets/x' }));
  assert.ok(!isSaveRequest({ method: 'get', url: '/cp/fields/fieldsets/intro.style_1/edit' }));
  assert.ok(!isSaveRequest({ method: 'patch', url: '/cp/fields/fieldsets/intro.style_1/edit' }));
  assert.ok(!isSaveRequest({ method: 'patch', url: '/cp/collections/pages/entries/1' }));
  assert.ok(isSaveRequest({ method: 'patch', url: '/cp/fields/blueprints/globals/header' }, /\/fields\/blueprints\/globals\//));
  assert.ok(isSaveResponse({ config: PATCH, status: 204 }));
  assert.ok(!isSaveResponse({ config: PATCH, status: 422 }));
});

test('a save reports when it leaves and when it has landed, and Close can wait on it', async () => {
  const axios = fakeAxios();
  const win = { Statamic: { $app: { config: { globalProperties: { $axios: axios } } } } };
  const seen = [];
  let done = null;

  assert.ok(watchFieldsetSaves(win, {
    onSaving: (promise) => {
      done = promise;
      seen.push('saving');
    },
    onSaved: () => seen.push('saved'),
  }));

  // Hooked once: a second ask does not stack a second set of interceptors.
  assert.ok(watchFieldsetSaves(win, { onSaved: () => seen.push('twice') }));

  // The fake answers in the same tick; the order is what is asserted.
  await axios.send({ ...PATCH }, { status: 204 });

  assert.deepEqual(seen, ['saving', 'saved']);
  assert.ok(done instanceof Promise);
  await done;

  // A second save is a second promise: Close waits on the latest one.
  const first = done;

  await axios.send({ ...PATCH }, { status: 204 });
  assert.notEqual(done, first);
  await done;
  assert.deepEqual(seen, ['saving', 'saved', 'saving', 'saved']);
});

test('a refused save still settles the promise, and reports no save', async () => {
  const axios = fakeAxios();
  const win = { Statamic: { $axios: axios } };
  const seen = [];
  let done = null;

  watchFieldsetSaves(win, { onSaving: (p) => { done = p; }, onSaved: () => seen.push('saved') });

  await axios.send({ ...PATCH }, { status: 422, error: true });
  await done;

  assert.deepEqual(seen, []);
});

test('the page the screen sits on, and its other requests, are not saves', async () => {
  const axios = fakeAxios();
  const win = { Statamic: { $axios: axios } };
  const seen = [];

  watchFieldsetSaves(win, { onSaving: () => seen.push('saving'), onSaved: () => seen.push('saved') });

  await axios.send({ method: 'get', url: '/cp/fields/fieldsets/intro.style_1/edit' }, { status: 200 });
  await axios.send({ method: 'post', url: '/cp/fields/fieldtypes' }, { status: 200 });

  assert.deepEqual(seen, []);
});

test('no client yet: nothing is hooked, and the caller is told to ask again', () => {
  const win = { Statamic: { $config: {} } };

  assert.equal(watchFieldsetSaves(win, {}), false);
  assert.equal(win.__sveFsSaveWatch, undefined);
});
