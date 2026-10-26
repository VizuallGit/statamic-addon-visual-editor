/**
 * ghost-job.js: the dock AI's answer to a POST — as it came, or, for a job
 * the server runs in the background (the Cursor key), the job's once it is
 * done. On a fake clock: a pause is counted, not waited.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { POLL, POLL_LIMIT, answerOf } from '../../resources/js/dock/ghost-job.js';

function response(status, body) {
  return { ok: status >= 200 && status < 300, status, json: async () => body };
}

/** A window whose clock jumps: each pause is added to `waited` and over at once. */
function fakeWin(polls) {
  const win = {
    waited: 0,
    asked: [],
    setTimeout(fn, ms) {
      win.waited += ms;
      queueMicrotask(fn);

      return 1;
    },
    clearTimeout() {},
    async fetch(url, init) {
      win.asked.push({ url, init });

      return polls(win.asked.length, init);
    },
  };

  return win;
}

const HEADERS = { Accept: 'application/json' };

test('a direct answer is passed on as it came, nothing polled', async () => {
  const win = fakeWin(() => assert.fail('no poll'));
  const out = await answerOf(win, response(200, { ok: true, text: '<p>x</p>', ms: 900 }), HEADERS);

  assert.deepEqual(out, { ok: true, status: 200, body: { ok: true, text: '<p>x</p>', ms: 900 } });
});

test('a direct error is passed on as it came', async () => {
  const out = await answerOf(fakeWin(() => assert.fail('no poll')), response(422, { message: 'Write what should change.' }), HEADERS);

  assert.deepEqual(out, { ok: false, status: 422, body: { message: 'Write what should change.' } });
});

test('202 with a job: asked every POLL until done, then the done answer', async () => {
  const win = fakeWin((n) =>
    n < 3 ? response(200, { ok: true, state: 'pending' }) : response(200, { ok: true, state: 'done', text: '<p>x</p>', ms: 14000 })
  );

  const out = await answerOf(win, response(202, { ok: true, job: 'abc-1' }), HEADERS);

  assert.deepEqual(out, { ok: true, status: 200, body: { ok: true, state: 'done', text: '<p>x</p>', ms: 14000 } });
  assert.equal(win.asked.length, 3);
  assert.equal(win.asked[0].url, '/!/sve/dock-ghost/job/abc-1');
  assert.equal(win.asked[0].init.headers, HEADERS);
  assert.equal(win.waited, 3 * POLL);
});

test('a job that failed comes back with its own status and message', async () => {
  const win = fakeWin(() => response(502, { state: 'done', message: 'Invalid API key' }));

  const out = await answerOf(win, response(202, { ok: true, job: 'abc-2' }), HEADERS);

  assert.deepEqual(out, { ok: false, status: 502, body: { state: 'done', message: 'Invalid API key' } });
});

test('a job the server no longer knows (swept, 404) ends the asking', async () => {
  const win = fakeWin(() => response(404, { message: 'Not Found' }));

  const out = await answerOf(win, response(202, { ok: true, job: 'abc-3' }), HEADERS);

  assert.equal(out.ok, false);
  assert.equal(out.status, 404);
  assert.equal(win.asked.length, 1);
});

test('an abort while polling rejects and asks no more', async () => {
  const abort = new AbortController();
  const win = fakeWin((n) => {
    if (n === 2) {
      abort.abort();
    }

    return response(200, { ok: true, state: 'pending' });
  });

  await assert.rejects(answerOf(win, response(202, { ok: true, job: 'abc-4' }), HEADERS, abort.signal), { name: 'AbortError' });
  assert.equal(win.asked.length, 2);
  assert.equal(win.asked[0].init.signal, abort.signal);
});

test('pending for ever: 504 once POLL_LIMIT has passed', async () => {
  const win = fakeWin(() => response(200, { ok: true, state: 'pending' }));

  const out = await answerOf(win, response(202, { ok: true, job: 'abc-5' }), HEADERS);

  assert.deepEqual(out, { ok: false, status: 504, body: null });
  assert.ok(win.waited >= POLL_LIMIT && win.waited < POLL_LIMIT + POLL, `waited ${win.waited}`);
});
