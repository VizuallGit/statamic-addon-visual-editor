/**
 * Long tasks (over 50 ms on the main thread), each counted once.
 *
 * The CP, the overlay that holds the CP again and the preview inside it share
 * one main thread, and Chrome reports a long task to every document on it that
 * observes: the same task three times, a tenth of a millisecond apart (each
 * document has its own timeOrigin). Phase 0 counted 15 long tasks at the first
 * switch to Build; there were 5. Two different tasks cannot start within a
 * millisecond of each other, since the first holds the thread for 50 ms or more.
 *
 * Used by tests/e2e/moments.spec.mjs and tests/browser/measure-moments.mjs.
 */

/** Run in every document of the tab: its long tasks, on the wall clock, in `window.__longTasks`. */
export const OBSERVE_LONG_TASKS = `
  window.__longTasks = [];
  try {
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) window.__longTasks.push([performance.timeOrigin + e.startTime, e.duration]);
    }).observe({ type: 'longtask', buffered: true });
  } catch (e) {}
`;

/** `[start, duration]` pairs from every document → each task once. */
export function uniqueLongTasks(entries) {
  const out = [];

  for (const [start, duration] of [...entries].sort((a, b) => a[0] - b[0])) {
    const last = out.at(-1);

    if (!last || start - last[0] > 1 || Math.round(duration) !== Math.round(last[1])) {
      out.push([start, duration]);
    }
  }

  return out;
}

/** Count, total and longest of the tasks that started between `from` and `to` (wall clock, ms). */
export function longTaskSummary(entries, from, to) {
  const hit = uniqueLongTasks(entries.filter(([start]) => start >= from && start <= to));

  return {
    count: hit.length,
    totalMs: Math.round(hit.reduce((sum, [, duration]) => sum + duration, 0)),
    longestMs: Math.round(hit.reduce((max, [, duration]) => Math.max(max, duration), 0)),
  };
}
