/**
 * AI chat surface — Vue app of its own. Does not import overlay, preview or cp.js.
 */
import AiPanel from './cp/surfaces/AiPanel.vue';
import { mountSurface } from './cp/mount.js';
import { RIGHT_PANEL_FILL, releaseRightShellIfEmpty, showInRightShell } from './right-dock.js';

const PANEL_ID = '__sve-ai-panel';

let app = null;

export function aiPanelAllowed(win) {
  return win.Statamic?.$config?.get?.('sveFeatures')?.ai_panel === true;
}

export function isAiPanelOpen(doc) {
  return !!doc?.getElementById(PANEL_ID);
}

export function closeAiPanel(win) {
  app?.unmount();
  app = null;
  win?.document?.getElementById(PANEL_ID)?.remove();
  releaseRightShellIfEmpty(win);
}

export function ensureAiPanel(win) {
  if (!aiPanelAllowed(win) || isAiPanelOpen(win.document)) {
    return;
  }

  openAiPanel(win);
}

export function toggleAiPanel(win) {
  if (!aiPanelAllowed(win)) {
    return;
  }

  if (isAiPanelOpen(win.document)) {
    closeAiPanel(win);

    return;
  }

  openAiPanel(win);
}

function openAiPanel(win) {
  const doc = win.document;
  const panel = doc.createElement('div');

  panel.id = PANEL_ID;
  panel.style.cssText = RIGHT_PANEL_FILL;

  app = mountSurface(AiPanel, panel, {
    win,
    onClose: () => {
      closeAiPanel(win);
      win.dispatchEvent(new Event('sve-ai-closed'));
    },
  });
  showInRightShell(win, panel);
}

export function relayoutAiPanel(win) {
  if (!isAiPanelOpen(win.document)) {
    return;
  }

  app?._instance?.exposed?.refreshType?.();
}
