/**
 * Wear: open and close Live Preview many times in one tab. Documents and
 * event listeners must come back to where they were, or every round leaks.
 * Counted with Chrome's own DOM counters after a garbage collection.
 */
import { expect, test } from '@playwright/test';
import { openLivePreview, publicSectionCount, resetLayout } from './support.mjs';

const ROUNDS = Number(process.env.SVE_WEAR_ROUNDS || 6);

test.beforeEach(() => resetLayout());

test(`Live Preview opened and closed ${ROUNDS} times does not grow`, async ({ page }) => {
  test.setTimeout(ROUNDS * 30_000);
  const sections = await publicSectionCount();
  const cdp = await page.context().newCDPSession(page);
  const counters = async () => {
    // The browser keeps what was written to the console, with the objects in
    // it. Statamic's developer build (APP_DEBUG) writes a Vue warning with the
    // live component for every form it mounts, so there the console holds each
    // old form. That is the console's memory, not the page's: emptied first.
    await cdp.send('Runtime.discardConsoleEntries');
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
    const { cp } = await openLivePreview(page, sections, { navigate: i === 1 });
    // Close opens a menu: back to the admin (this entry), back to the site, or a new tab.
    await cp.getByRole('button', { name: 'Close Live Preview' }).click();
    await cp.getByText('Back to admin', { exact: true }).click();
    await expect(page.locator('iframe.sve-edit-overlay[data-open]')).toHaveCount(0);
    // Still the same document: a reload would hide any leak this test is for.
    expect(new URL(page.url()).pathname).toContain('/cp/collections/');
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
