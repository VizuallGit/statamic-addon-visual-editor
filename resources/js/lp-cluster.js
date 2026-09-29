/**
 * The Live Preview cluster — the deferred half of the CP bundle.
 *
 * Everything the editor needs once Live Preview is in play: the CP shell
 * (cp.js), Patterns (section-library), the focus panel and its one-row
 * section list, globals / header / footer, inline edit, pages, open-in-preview
 * and the AI launcher. addon.js owns when this loads (see its header); nothing
 * else imports this file.
 *
 * One chunk, not one per panel: these files call each other's helpers
 * unguarded from the first preview message onwards (section-library alone is
 * reached for row ids, set meta and the section-message handlers). Deferring
 * any one of them on its own left those calls hitting undefined; deferring the
 * whole group together keeps every call inside the same chunk.
 *
 * The side-effect imports keep the order they had in addon.js: that is the
 * order the CP's module graph evaluates in (see side/section-meta-prefetch.js
 * and side/lite-sections.js for the two that depend on it).
 *
 * Statamic.booting / booted callbacks registered after boot never run, so the
 * cluster does not boot itself: addon.js calls bootLpCluster() once Statamic's
 * boot phase has been reached.
 */
import './inline-edit.js';
import './lazy-panels.js';
// Not a panel. Patterns is only its front: the rest of the editor reaches into
// this file for row ids, set meta, the section-message handlers and a dozen
// other helpers, unguarded, from the first render onwards.
import './section-library.js';
// Warms set meta on hover; calls the library above, so it follows it here.
import './side/section-meta-prefetch.js';
import './lp-panel.js';
import './focus-panel.js';
// Mounts one page_sections row at a time in Live Preview; hooks into the
// focus panel above through the bus, so it follows it here.
import './side/lite-sections.js';
import './open-in-preview.js';
import './globals-panel.js';
import './pages.js';
import './global-section.js';
import './chrome.js';
import { initCp } from './cp.js';
import { initAiLauncher } from './ai-launcher.js';

// addon.js takes the first click on Statamic's Live Preview control itself
// while this chunk is on its way, then hands it over through this.
export { openLivePreviewOverlay } from './cp-shell/add-section.js';

// The real lite-sections fieldtype behind the async wrapper addon.js registers
// at boot — Statamic checks a fieldtype's existence once, at render, and a name
// registered after that check stays "Component does not exist" until remount.
export { liteFieldtypeOptionsAsync } from './side/lite-sections.js';

let booted = false;

/** Wire the toolbar and the AI launcher. Once per page; addon.js calls it. */
export function bootLpCluster() {
  if (booted) {
    return;
  }

  booted = true;
  initCp();
  initAiLauncher();
}
