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

/* The loop panel at the caret: the same look as the suggestions, the tree's controls inside. */
[data-sve-help-loop] {
  position: fixed;
  z-index: 99999;
  width: 17em;
  box-sizing: border-box;
  background: #262b3d;
  color: #d6dbe6;
  border: 1px solid #343b52;
  border-radius: 0.55em;
  box-shadow: 0 0.6em 1.6em rgba(0, 0, 0, 0.35);
  font: 500 0.8125rem/1.4 system-ui, -apple-system, "Segoe UI", sans-serif;
}
[data-sve-help-body] {
  padding: 0.6em 0.75em 0.75em;
}
[data-sve-help-sub] {
  margin: 0.8em 0 0.35em;
  color: #8a93a8;
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
[data-sve-help-seg] {
  display: flex;
  gap: 0.2em;
  margin-bottom: 0.45em;
}
[data-sve-help-seg] button {
  all: unset;
  flex: 1 1 0;
  box-sizing: border-box;
  padding: 0.35em 0.5em;
  border-radius: 0.3em;
  background: rgba(128, 128, 128, 0.16);
  cursor: pointer;
  text-align: center;
  font-size: 0.6875rem;
}
[data-sve-help-seg] button[data-active] {
  background: #3858e9;
  color: #fff;
}
[data-sve-help-seg] button:disabled {
  cursor: default;
  opacity: 0.45;
}
[data-sve-help-body] input,
[data-sve-help-body] select {
  box-sizing: border-box;
  width: 100%;
  padding: 0.45em 0.6em;
  border-radius: 0.35em;
  border: 1px solid rgba(128, 128, 128, 0.35);
  background: rgba(0, 0, 0, 0.22);
  color: inherit;
  font: 0.6875rem/1.4 ui-monospace, "SF Mono", Menlo, Consolas, monospace;
}
[data-sve-help-body] select {
  appearance: none;
  -webkit-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8'%3E%3Cpath d='M1 1.5 6 6.5 11 1.5' fill='none' stroke='%23999' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.7em center;
  background-size: 0.65em;
  padding-right: 2.1em;
}
[data-sve-help-body] input:focus,
[data-sve-help-body] select:focus {
  outline: 0.125rem solid #3858e9;
  outline-offset: -1px;
}
[data-sve-help-body] input:disabled,
[data-sve-help-body] select:disabled {
  opacity: 0.55;
}
[data-sve-help-box] {
  position: relative;
}
[data-sve-help-box][data-sve-help-gap] {
  margin-top: 0.35em;
}
[data-sve-help-box] input {
  padding-right: 2em;
}
[data-sve-help-data] {
  all: unset;
  position: absolute;
  top: 50%;
  right: 0.3em;
  transform: translateY(-50%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.5em;
  height: 1.5em;
  border-radius: 0.25em;
  cursor: pointer;
  opacity: 0.55;
}
[data-sve-help-data]:hover:not(:disabled) {
  opacity: 1;
  background: rgba(128, 128, 128, 0.22);
}
[data-sve-help-tick] {
  display: flex;
  align-items: center;
  gap: 0.5em;
  margin-top: 0.75em;
  font-size: 0.6875rem;
  cursor: pointer;
}
[data-sve-help-tick] input {
  width: auto;
  margin: 0;
  padding: 0;
  accent-color: #3858e9;
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
