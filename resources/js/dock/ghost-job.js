/**
 * The dock AI's answer to a POST, also when the server works it out in the
 * background. On the Cursor key an answer takes longer than the web server
 * lets a request live, so the POST answers 202 with a job at once, and this
 * asks `/!/sve/dock-ghost/job/{id}` until the answer is written. It then
 * resolves the way a direct answer does, so the grey text and ⌘K's box
 * cannot tell the difference.
 *
 * May import: nothing — fetch, the timers and the signal come in on `win`.
 */

/** How often a job is asked about, in ms. */
export const POLL = 700;

/** How long at most, in ms. The server counts a job as lost after 200 s. */
export const POLL_LIMIT = 200000;

/**
 * `{ ok, status, body }` for the POST's response `res`: as it came, or —
 * for a started job — the job's once it is done. A request aborted or lost
 * on the network rejects.
 */
export async function answerOf(win, res, headers, signal) {
  const body = await res.json().catch(() => null);

  if (res.status !== 202 || !body?.job) {
    return { ok: res.ok, status: res.status, body };
  }

  for (let waited = 0; waited < POLL_LIMIT; waited += POLL) {
    await pause(win, POLL, signal);

    const poll = await win.fetch(`/!/sve/dock-ghost/job/${encodeURIComponent(body.job)}`, {
      credentials: 'same-origin',
      signal,
      headers,
    });
    const done = await poll.json().catch(() => null);

    // Done — or a status that will not change by asking again (403, a job
    // swept away): either way, the answer.
    if (!poll.ok || done?.state === 'done') {
      return { ok: done?.ok !== false && poll.ok, status: poll.status, body: done };
    }
  }

  return { ok: false, status: 504, body: null };
}

/** `ms` on `win`'s clock; an abort ends it at once and rejects. */
function pause(win, ms, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(signal.reason);

      return;
    }

    const stop = () => {
      win.clearTimeout(timer);
      reject(signal.reason);
    };
    const timer = win.setTimeout(() => {
      signal?.removeEventListener('abort', stop);
      resolve();
    }, ms);

    signal?.addEventListener('abort', stop, { once: true });
  });
}
