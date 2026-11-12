/**
 * Wear: open and close Live Preview many times in one tab. Documents and
 * event listeners must come back to where they were, or every round leaks.
 * Counted with Chrome's own DOM counters after a garbage collection.
 */
import { expect, test } from '@playwright/test';
import { openLivePreview, publicSectionCount, resetLayout } from './support.mjs';

const ROUNDS = Number(process.env.SVE_WEAR_ROUNDS || 20);

test.beforeEach(() => resetLayout());

// Not yet: after a click on "Close Live Preview" the overlay keeps [data-open]
// (30 s). How Live Preview closes goes through overlay-host.js (core); the
// close step has to be read there before this test can count anything.
test.fixme(`Live Preview opened and closed ${ROUNDS} times does not grow`, async ({ page }) => {
  test.setTimeout(ROUNDS * 30_000);
  const sections = await publicSectionCount();
  const cdp = await page.context().newCDPSession(page);
  const counters = async () => {
    await cdp.send('HeapProfiler.collectGarbage');
    const dom = await cdp.send('Memory.getDOMCounters');
    const heap = await cdp.send('Runtime.getHeapUsage');

    return {
      documents: dom.documents,
      nodes: dom.nodes,
      listeners: dom.jsEventListeners,
      heapMB: Math.round(heap.usedSize / 1e6),
    };
  };
  const rounds = [];

  for (let i = 1; i <= ROUNDS; i++) {
    const { cp } = await openLivePreview(page, sections);
    await cp.getByRole('button', { name: 'Close Live Preview' }).click();
    await expect(page.locator('iframe.sve-edit-overlay[data-open]')).toHaveCount(0);
    rounds.push(await counters());
  }

  const warm = rounds[1];
  const last = rounds.at(-1);
  console.log(`wear: after round 2 ${JSON.stringify(warm)}, after round ${ROUNDS} ${JSON.stringify(last)}`);
  test.info().annotations.push({ type: 'wear', description: JSON.stringify(rounds) });

  expect(last.documents, 'documents left behind').toBeLessThanOrEqual(warm.documents);
  expect(last.listeners, 'event listeners left behind').toBeLessThanOrEqual(Math.ceil(warm.listeners * 1.05));
  expect(last.heapMB, 'JS heap').toBeLessThanOrEqual(Math.ceil(warm.heapMB * 1.2));
});
