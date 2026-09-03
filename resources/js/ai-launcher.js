/**
 * The AI chat as a floating window in the Control Panel.
 *
 * Live Preview has the chat in its right dock, where a section is selected and
 * the chat can write to it. Everywhere else in the CP — fieldsets, blueprints,
 * an entry form — there is no dock to put it in, and no page it belongs to
 * either. So it sits in the corner the way a support chat does: one button,
 * always in reach, remembers whether you left it open.
 *
 * Not on the Live Preview screen: the dock is already there, and two of the
 * same chat on one screen is one too many.
 *
 * Appended to document.body, which Inertia keeps across CP navigation, so the
 * window survives moving from one screen to the next. Only its visibility is
 * re-checked.
 */
import AiPanel from './cp/surfaces/AiPanel.vue';
import { mountSurface } from './cp/mount.js';
import { chromeGet, chromeRemove, chromeSet } from './chrome-prefs.js';
import { t } from './cp-t.js';

const ROOT_ID = '__sve-ai-launcher';
const OPEN_KEY = 'sve-ai-launcher-open';

let root = null;
let panelHost = null;
let button = null;
let app = null;
let open = false;

function allowed(win) {
  if (win.Statamic?.$config?.get?.('sveEnabled') === false) {
    return false;
  }

  return win.Statamic?.$config?.get?.('sveFeatures')?.ai_panel === true;
}

/** Live Preview docks the same chat itself. */
function inLivePreview(win) {
  return !!win.document.querySelector('.live-preview');
}

const CSS = `
#${ROOT_ID} {
  position: fixed;
  right: 1.25rem;
  bottom: 1.25rem;
  z-index: 2147483000;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.75rem;
  font: 500 0.8125rem/1.3 ui-sans-serif, system-ui, sans-serif;
}
#${ROOT_ID}[hidden] {
  display: none;
}
#${ROOT_ID} [data-sve-ai-window] {
  width: min(23rem, calc(100vw - 2.5rem));
  height: min(34rem, calc(100vh - 9rem));
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 0.875rem;
  border: 1px solid var(--theme-color-content-border, rgba(128, 128, 128, 0.28));
  background: var(--theme-color-content-bg, #fff);
  box-shadow: 0 1.5rem 3rem rgba(0, 0, 0, 0.28);
}
#${ROOT_ID} [data-sve-ai-window][hidden] {
  display: none;
}
#${ROOT_ID} [data-sve-ai-button] {
  all: unset;
  cursor: pointer;
  box-sizing: border-box;
  width: 3.25rem;
  height: 3.25rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--theme-color-primary, #4f46e5);
  color: #fff;
  box-shadow: 0 0.5rem 1.25rem rgba(0, 0, 0, 0.3);
  transition: filter 0.12s ease, transform 0.12s ease;
}
#${ROOT_ID} [data-sve-ai-button]:hover {
  filter: brightness(1.08);
  transform: translateY(-1px);
}
#${ROOT_ID} [data-sve-ai-button] svg {
  width: 1.5rem;
  height: 1.5rem;
  display: block;
}
`;

const CHAT_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>';
const CLOSE_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>';

function ensureStyles(win) {
  const id = `${ROOT_ID}-css`;

  if (win.document.getElementById(id)) {
    return;
  }

  const style = win.document.createElement('style');

  style.id = id;
  style.textContent = CSS;
  win.document.head.appendChild(style);
}

function paintButton(win) {
  button.innerHTML = open ? CLOSE_ICON : CHAT_ICON;

  const label = t(win, open ? 'ai_launcher_close' : 'ai_launcher_open');

  button.setAttribute('aria-label', label);
  button.setAttribute('title', label);
  button.setAttribute('aria-expanded', open ? 'true' : 'false');
}

/**
 * The chat is mounted the first time it is opened, and kept after that — a
 * conversation should still be there when the window is closed and reopened.
 */
function setOpen(win, next) {
  open = !!next;
  panelHost.hidden = !open;
  paintButton(win);

  if (open && !app) {
    app = mountSurface(AiPanel, panelHost, {
      win,
      standalone: true,
      onClose: () => setOpen(win, false),
    });
  }

  if (open) {
    chromeSet(win, OPEN_KEY, '1');
  } else {
    chromeRemove(win, OPEN_KEY);
  }
}

function build(win) {
  ensureStyles(win);

  root = win.document.createElement('div');
  root.id = ROOT_ID;

  panelHost = win.document.createElement('div');
  panelHost.setAttribute('data-sve-ai-window', '');
  panelHost.hidden = true;

  button = win.document.createElement('button');
  button.type = 'button';
  button.setAttribute('data-sve-ai-button', '');
  button.addEventListener('click', () => setOpen(win, !open));

  root.append(panelHost, button);
  win.document.body.appendChild(root);

  paintButton(win);

  if (chromeGet(win, OPEN_KEY) === '1') {
    setOpen(win, true);
  }
}

function sync(win) {
  if (!allowed(win)) {
    return;
  }

  if (!root || !win.document.body.contains(root)) {
    build(win);
  }

  root.hidden = inLivePreview(win);
}

export function initAiLauncher(win = window) {
  let timer = 0;

  const schedule = () => {
    win.clearTimeout(timer);
    timer = win.setTimeout(() => sync(win), 60);
  };

  schedule();

  new win.MutationObserver(schedule).observe(win.document.documentElement, {
    childList: true,
    subtree: true,
  });
}
