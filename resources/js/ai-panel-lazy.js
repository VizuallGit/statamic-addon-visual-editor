/**
 * The AI chat, as everything else is allowed to see it.
 *
 * Same export names as ai-panel.js. The Vue app only arrives when the chat is
 * opened (or remembered open), so a Live Preview session that never touches
 * that icon never parses it.
 */
const PANEL_ID = '__sve-ai-panel';

let panel = null;
let loading = null;

export function aiPanelAllowed(win) {
  return win.Statamic?.$config?.get?.('sveFeatures')?.ai_panel === true;
}

export function isAiPanelOpen(doc) {
  return !!doc?.getElementById(PANEL_ID);
}

export function loadAiPanel() {
  if (panel) {
    return Promise.resolve(panel);
  }

  if (!loading) {
    loading = import('./ai-panel.js')
      .then((mod) => {
        panel = mod;

        return mod;
      })
      .catch((err) => {
        loading = null;
        console.error('[sve] load ai panel', err);

        throw err;
      });
  }

  return loading;
}

export function prefetchAiPanel() {
  if (panel || loading) {
    return;
  }

  void loadAiPanel().catch(() => {});
}

export function closeAiPanel(win) {
  if (panel) {
    panel.closeAiPanel(win);

    return;
  }

  win?.document?.getElementById(PANEL_ID)?.remove();
}

export function ensureAiPanel(win) {
  if (!aiPanelAllowed(win) || isAiPanelOpen(win.document)) {
    return Promise.resolve();
  }

  return loadAiPanel().then((mod) => mod.ensureAiPanel(win));
}

export function toggleAiPanel(win) {
  if (!aiPanelAllowed(win)) {
    return Promise.resolve();
  }

  return loadAiPanel().then((mod) => mod.toggleAiPanel(win));
}

export function relayoutAiPanel(win) {
  panel?.relayoutAiPanel(win);
}
