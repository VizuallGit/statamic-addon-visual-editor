/**
 * code-dock.js — region "history-strip", split out in WP5. Same statements, same order;
 * only the imports are new. See the barrel code-dock.js for what the shell exports.
 */
import { on } from '../cp/bus.js';
import CodeDockMenu from '../cp/surfaces/CodeDockMenu.vue';
import { setTwOverlayOn, twOverlayOn } from '../tw-overlay.js';
import { twRepaintOverlay } from '../tw-classes.js';
import { mountSurface } from '../cp/mount.js';
import { t } from '../lib/i18n.js';
import { dockState } from '../dock/state.js';
import { currentTemplateType, isCodeDockLocked } from './dock-api.js';
import { closeCssMenu, placeCssMenu, writeParts } from './css-tools.js';
import { CSS_MENU_ID, DOCK_ID, HISTORY_ICON, STRIP_ICON } from '../code-dock.js';
import { onEditorInput } from './save.js';
import { syncTwTarget } from './style-modes.js';

// ===== history-strip =====
/**
 * "20 minutes ago · 23:41" — the browser's own wording for the first half, so
 * the list reads in the reader's language without a string to translate.
 */
function historyLabel(at) {
  const seconds = Math.max(0, Math.round(Date.now() / 1000 - at));
  const clock = new Date(at * 1000).toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });
  let relative = clock;

  try {
    const format = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });

    if (seconds < 90) {
      relative = format.format(-seconds, 'second');
    } else if (seconds < 5400) {
      relative = format.format(-Math.round(seconds / 60), 'minute');
    } else if (seconds < 86400) {
      relative = format.format(-Math.round(seconds / 3600), 'hour');
    } else {
      relative = format.format(-Math.round(seconds / 86400), 'day');
    }
  } catch {
    /* the clock time on its own will do */
  }

  return `${relative} · ${clock}`;
}

function sveFetch(win, url) {
  return win.fetch(url, {
    credentials: 'same-origin',
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
  });
}

async function openHistoryMenu(win, anchor) {
  const doc = win.document;
  const type = currentTemplateType();

  closeCssMenu(doc);

  if (!type) {
    return;
  }

  let entries = [];

  try {
    const res = await sveFetch(win, `/!/sve/section-template/history?type=${encodeURIComponent(type)}`);

    if (res.ok) {
      entries = (await res.json())?.entries || [];
    }
  } catch {
    entries = [];
  }

  // The dock can be gone by the time the list arrives.
  if (!doc.getElementById(DOCK_ID) || !doc.contains(anchor)) {
    return;
  }

  anchor.setAttribute('data-open', '');

  const menu = doc.createElement('div');

  menu.id = CSS_MENU_ID;
  doc.body.appendChild(menu);
  placeCssMenu(win, anchor, menu);
  menu._sveApp = mountSurface(CodeDockMenu, menu, {
    kind: 'choices',
    choices: entries.length
      ? entries.map((entry) => ({ value: entry.id, label: historyLabel(entry.at) }))
      : [{ value: '', label: t(win, 'code_dock_history_empty') }],
    onPick: (id) => {
      closeCssMenu(doc);

      if (id) {
        void restoreVersion(win, type, id);
      }
    },
  });
}

/**
 * Put an earlier version back.
 *
 * Through the same door as a keystroke: the panes are written, the dock saves
 * and Live Preview re-renders — and because it lands in the editor's own undo
 * history, a restore you did not mean is one Cmd+Z away.
 */
async function restoreVersion(win, type, id) {
  if (isCodeDockLocked()) {
    return;
  }

  let parts = null;

  try {
    const res = await sveFetch(
      win,
      `/!/sve/section-template/history/entry?type=${encodeURIComponent(type)}&id=${encodeURIComponent(id)}`
    );

    if (res.ok) {
      parts = await res.json();
    }
  } catch {
    parts = null;
  }

  if (!parts || isCodeDockLocked()) {
    return;
  }

  writeParts(
    { html: parts.html ?? '', css: parts.css ?? '', js: parts.js ?? '' },
    dockState.lastLocked
  );
  onEditorInput(win);
  syncTwTarget(win);
}

/** The class strip over the preview: on, off, and remembered. */
export function paintStrip(win) {
  const btn = win?.document.getElementById(DOCK_ID)?.querySelector('[data-sve-code-strip]');

  if (!btn) {
    return;
  }

  // The strip shows the picked tag's Tailwind classes over the preview. In CSS
  // mode there are no chips to show, so the button has nothing to switch — and
  // a switch that does nothing is worse than no switch.
  btn.hidden = dockState.styleMode !== 'tw';

  const on = twOverlayOn(win);

  btn.innerHTML = STRIP_ICON;
  btn.title = t(win, on ? 'tw_strip_on' : 'tw_strip_off');
  btn.setAttribute('aria-label', btn.title);
  btn.setAttribute('aria-pressed', on ? 'true' : 'false');
}

export function bindStrip(win, dock) {
  const btn = dock.querySelector('[data-sve-code-strip]');

  if (!btn || btn._sveBound) {
    return;
  }

  btn._sveBound = true;
  btn.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    setTwOverlayOn(win, !twOverlayOn(win));
    paintStrip(win);
    twRepaintOverlay(win);
  });
  paintStrip(win);
}

export function bindHistory(win, dock) {
  const btn = dock.querySelector('[data-sve-code-history]');

  if (!btn || btn._sveBound) {
    return;
  }

  btn._sveBound = true;
  btn.innerHTML = HISTORY_ICON;
  btn.title = t(win, 'code_dock_history');
  btn.setAttribute('aria-label', btn.title);
  btn.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (btn.hasAttribute('data-open')) {
      closeCssMenu(win.document);

      return;
    }

    void openHistoryMenu(win, btn);
  });
}

export function codeDockStyleMode() {
  return dockState.styleMode;
}
