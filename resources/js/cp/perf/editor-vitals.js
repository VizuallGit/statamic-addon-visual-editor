/**
 * What the editor itself feels like, measured from the Control Panel.
 *
 * Three readings, none of which need the preview kernel:
 *
 *   - long tasks on the CP main thread (PerformanceObserver on this window),
 *     which is what a stuttering panel or a laggy keystroke actually is;
 *   - messages between the preview and the CP per second, read off the
 *     window's own `message` events (the bridge marks its messages with
 *     `source`), which is the chattiness budget for the protocol;
 *   - the time from a keystroke in the publish form to the preview having
 *     morphed — `input` on the CP document to `statamic:preview-updated` on
 *     the preview window, the event preview.js dispatches after every morph.
 *
 * Pure helpers first (unit-tested), then the sampler that wires them to a
 * window and reports a snapshot once a second while the tab is open.
 */
import { SOURCE } from '../../lib/protocol.js';
import { previewFrame } from '../../lib/preview-frame.js';

/** Long tasks are judged over the last ten seconds. */
export const TASK_WINDOW_MS = 10000;
/** Message rate is judged over the last five. */
export const MESSAGE_WINDOW_MS = 5000;
/** How many keystroke → preview timings are kept for the median. */
export const LATENCY_SAMPLES = 12;
/** A keystroke the preview never answered within this is not a sample. */
export const LATENCY_TIMEOUT_MS = 8000;

/**
 * @param {{start: number, duration: number}[]} tasks
 * @returns {{count: number, totalMs: number, longestMs: number}}
 */
export function summarizeLongTasks(tasks, now, windowMs = TASK_WINDOW_MS) {
  let count = 0;
  let totalMs = 0;
  let longestMs = 0;

  for (const task of tasks) {
    if (task.start + task.duration < now - windowMs) {
      continue;
    }

    count += 1;
    totalMs += task.duration;
    longestMs = Math.max(longestMs, task.duration);
  }

  return { count, totalMs: Math.round(totalMs), longestMs: Math.round(longestMs) };
}

/** Events per second over the window, from a list of timestamps. */
export function ratePerSecond(times, now, windowMs = MESSAGE_WINDOW_MS) {
  const recent = times.filter((t) => t >= now - windowMs).length;

  return Math.round((recent / (windowMs / 1000)) * 10) / 10;
}

/** @returns {{last: number|null, median: number|null, count: number}} */
export function latencySummary(samples) {
  if (!samples.length) {
    return { last: null, median: null, count: 0 };
  }

  const sorted = [...samples].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  const median = sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;

  return { last: Math.round(samples[samples.length - 1]), median: Math.round(median), count: samples.length };
}

/** Drop what the windows no longer look at, so a long session does not grow. */
export function prune(list, now, windowMs, pick = (x) => x) {
  return list.filter((item) => pick(item) >= now - windowMs);
}

/**
 * Start sampling. Returns a function that stops everything it started.
 *
 * @param {Window} win  the Control Panel window the panel lives in
 * @param {(snapshot: object) => void} onSample  called once a second
 */
export function startEditorVitals(win, onSample) {
  const tasks = [];
  const messages = [];
  const latencies = [];
  let pendingInputAt = null;
  let attachedTo = null;
  let stopped = false;

  const now = () => win.performance.now();

  // 1. long tasks on this thread
  let observer = null;

  try {
    observer = new win.PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        tasks.push({ start: entry.startTime, duration: entry.duration });
      }
    });
    observer.observe({ type: 'longtask', buffered: false });
  } catch {
    observer = null; // not every browser exposes long tasks
  }

  // 2. bridge messages
  const onMessage = (event) => {
    if (event.data?.source === SOURCE) {
      messages.push(now());
    }
  };

  win.addEventListener('message', onMessage);

  // 3. keystroke → preview morphed
  const onInput = (event) => {
    if (!event.isTrusted || event.target?.closest?.('#__sve-perf-panel')) {
      return;
    }

    pendingInputAt = now();
  };

  win.document.addEventListener('input', onInput, true);

  const onPreviewUpdated = () => {
    if (pendingInputAt === null) {
      return;
    }

    const elapsed = now() - pendingInputAt;

    pendingInputAt = null;

    if (elapsed <= LATENCY_TIMEOUT_MS) {
      latencies.push(elapsed);

      if (latencies.length > LATENCY_SAMPLES) {
        latencies.shift();
      }
    }
  };

  // The preview iframe reloads on replay, so the listener follows the window.
  const attach = () => {
    const frame = previewFrame(win);
    let target = null;

    try {
      target = frame?.contentWindow || null;
    } catch {
      target = null;
    }

    if (!target || target === attachedTo) {
      return;
    }

    try {
      attachedTo?.removeEventListener('statamic:preview-updated', onPreviewUpdated);
    } catch {
      /* the old window is gone */
    }

    target.addEventListener('statamic:preview-updated', onPreviewUpdated);
    attachedTo = target;
  };

  attach();

  const tick = win.setInterval(() => {
    if (stopped) {
      return;
    }

    attach();

    const at = now();

    if (pendingInputAt !== null && at - pendingInputAt > LATENCY_TIMEOUT_MS) {
      pendingInputAt = null;
    }

    tasks.splice(0, tasks.length, ...prune(tasks, at, TASK_WINDOW_MS, (t) => t.start + t.duration));
    messages.splice(0, messages.length, ...prune(messages, at, MESSAGE_WINDOW_MS));

    onSample({
      longTasks: summarizeLongTasks(tasks, at),
      messagesPerSecond: ratePerSecond(messages, at),
      previewUpdate: latencySummary(latencies),
      supportsLongTasks: observer !== null,
    });
  }, 1000);

  return () => {
    stopped = true;
    win.clearInterval(tick);
    observer?.disconnect();
    win.removeEventListener('message', onMessage);
    win.document.removeEventListener('input', onInput, true);

    try {
      attachedTo?.removeEventListener('statamic:preview-updated', onPreviewUpdated);
    } catch {
      /* gone */
    }
  };
}
