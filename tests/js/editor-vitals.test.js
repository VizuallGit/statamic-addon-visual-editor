import test from 'node:test';
import assert from 'node:assert/strict';
import {
  latencySummary,
  prune,
  ratePerSecond,
  summarizeLongTasks,
} from '../../resources/js/cp/perf/editor-vitals.js';

test('long tasks are counted over the window, longest and total kept', () => {
  const tasks = [
    { start: 0, duration: 80 },        // ended long ago: out
    { start: 9500, duration: 120 },    // ended at 9620, before the window opens at 10000: out
    { start: 15000, duration: 60 },
    { start: 19900, duration: 300 },
  ];

  assert.deepEqual(summarizeLongTasks(tasks, 20000, 10000), { count: 2, totalMs: 360, longestMs: 300 });
  assert.deepEqual(summarizeLongTasks([], 20000), { count: 0, totalMs: 0, longestMs: 0 });
});

test('a task that started before the window but ended inside it still counts', () => {
  assert.equal(summarizeLongTasks([{ start: 9950, duration: 100 }], 20000, 10000).count, 1);
  assert.equal(summarizeLongTasks([{ start: 9850, duration: 100 }], 20000, 10000).count, 0);
});

test('the message rate is per second over the window, to one decimal', () => {
  const times = [1000, 2000, 2500, 3000, 4999, 5000, 9999];

  assert.equal(ratePerSecond(times, 10000, 5000), 0.4); // only 5000 and 9999 fall in [5000, 10000]
  assert.equal(ratePerSecond([], 10000), 0);
  assert.equal(ratePerSecond([9000, 9100, 9200, 9300, 9400], 10000, 5000), 1);
});

test('latency keeps the last and the median', () => {
  assert.deepEqual(latencySummary([]), { last: null, median: null, count: 0 });
  assert.deepEqual(latencySummary([400]), { last: 400, median: 400, count: 1 });
  assert.deepEqual(latencySummary([900, 300, 600.4]), { last: 600, median: 600, count: 3 });
  assert.deepEqual(latencySummary([100, 900]), { last: 900, median: 500, count: 2 });
});

test('prune drops what fell out of the window', () => {
  assert.deepEqual(prune([1, 5, 9, 12], 12, 5), [9, 12]);
  assert.deepEqual(prune([{ t: 1 }, { t: 8 }], 10, 5, (x) => x.t), [{ t: 8 }]);
});
