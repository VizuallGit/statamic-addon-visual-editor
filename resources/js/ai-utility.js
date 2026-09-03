/**
 * The AI chat on its own Control Panel page (Utilities → AI Assistant).
 *
 * Same component as the Live Preview dock — this only gives it somewhere to
 * live when there is no preview open. Utility pages are Inertia-rendered: the
 * Blade view arrives as a string of HTML that Vue writes into the document
 * *after* boot, and leaves again on the next CP navigation. So the host element
 * is watched for rather than looked up once.
 */
import AiPanel from './cp/surfaces/AiPanel.vue';
import { mountSurface } from './cp/mount.js';

export const AI_UTILITY_HOST = 'sve-ai-utility';

let app = null;
let host = null;

function allowed(win) {
  if (win.Statamic?.$config?.get?.('sveEnabled') === false) {
    return false;
  }

  return win.Statamic?.$config?.get?.('sveFeatures')?.ai_panel === true;
}

/** Mount when the page appears, unmount when it goes. */
function sync(win) {
  const el = win.document.getElementById(AI_UTILITY_HOST);

  if (el === host) {
    return;
  }

  app?.unmount();
  app = null;
  host = null;

  if (!el || !allowed(win)) {
    return;
  }

  host = el;
  app = mountSurface(AiPanel, el, { win, standalone: true });
}

export function initAiUtility(win = window) {
  let timer = 0;

  const schedule = () => {
    win.clearTimeout(timer);
    timer = win.setTimeout(() => sync(win), 60);
  };

  schedule();

  // Vue's own writes inside the host trip this too; the identity check above
  // makes a re-run free.
  new win.MutationObserver(schedule).observe(win.document.documentElement, {
    childList: true,
    subtree: true,
  });
}
