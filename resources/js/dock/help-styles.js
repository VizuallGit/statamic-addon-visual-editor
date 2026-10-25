/**
 * The help popup's look, injected once into the Control Panel's document.
 *
 * A string, not the component's own <style>: the popup lives in a lazy chunk,
 * and a lazy chunk's CSS file is the one Vite loses (it 404s on the server).
 * Scoped to our own `data-sve-help-*` attributes; it styles no Statamic markup.
 * The popup sits on document.body, so `position: fixed` is the page's, not a
 * Replicator's stacking context.
 */
const STYLE_ID = '__sve-help-styles';

export const HELP_POPUP_CSS = `
[data-sve-help-popup] {
  position: fixed;
  z-index: 99999;
  min-width: 15em;
  max-width: 26em;
  box-sizing: border-box;
  overflow: hidden;
  background: #262b3d;
  color: #d6dbe6;
  border: 1px solid #343b52;
  border-radius: 0.55em;
  box-shadow: 0 0.6em 1.6em rgba(0, 0, 0, 0.35);
  font: 500 0.8125rem/1.4 system-ui, -apple-system, "Segoe UI", sans-serif;
}
[data-sve-help-head] {
  display: flex;
  justify-content: space-between;
  gap: 1em;
  padding: 0.4em 0.75em;
  border-bottom: 1px solid #343b52;
  color: #8a93a8;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
[data-sve-help-option] {
  display: flex;
  align-items: baseline;
  gap: 0.6em;
  width: 100%;
  box-sizing: border-box;
  margin: 0;
  padding: 0.45em 0.75em;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
}
[data-sve-help-option][data-active] {
  background: #33406b;
}
[data-sve-help-label] {
  flex: 1 1 auto;
  min-width: 0;
}
[data-sve-help-meta] {
  flex: 0 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #8a93a8;
  font: 0.72rem/1.4 ui-monospace, "SF Mono", Menlo, Consolas, monospace;
}
[data-sve-help-key] {
  flex: 0 0 auto;
  padding: 0 0.4em;
  border: 1px solid #343b52;
  border-radius: 0.3em;
  color: #8a93a8;
  font: 0.7rem/1.5 ui-monospace, "SF Mono", Menlo, Consolas, monospace;
}
`;

export function ensureHelpStyles(doc) {
  if (!doc || doc.getElementById(STYLE_ID)) {
    return;
  }

  const style = doc.createElement('style');

  style.id = STYLE_ID;
  style.textContent = HELP_POPUP_CSS;
  doc.head.appendChild(style);
}
