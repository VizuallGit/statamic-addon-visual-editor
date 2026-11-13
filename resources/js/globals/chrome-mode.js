/**
 * globals-panel.js — header and footer: the mode, the designs panel, the style.
 * Split out of globals-panel.js in the quality pass (tab G): the same statements, in the same
 * order; only the imports are new. globals-panel.js re-exports this file.
 */
import { t } from '../lib/i18n.js';
import { CHROME_DESIGNS_ID, GLOBALS_PANEL_ID, GLOBALS_PICKER_ID, SECTION_PICKER_ID } from '../lib/ids.js';
import {
  closeRightPanels,
  editorOverlayCss,
  hideGlobalsPanel,
  libraryMatchesQuery,
  mountInLivePreviewEditor,
  releaseLeftEdgeIfFree,
  syncPreviewInset,
} from '../section-library.js';
import { chromeContainer, chromeHost, openChromeInline } from '../chrome.js';
import { activeChromeKind, globalSets, openGlobalsPanel } from './panel.js';

/**
 * Clicking content that comes from a global (global_edit="site_settings.phone"):
 * open that set in the panel and jump to the field. Editing it there updates the
 * preview as you type — the same live path the panel already uses.
 */
export function handleOpenGlobal(data, doc, win) {
  const sets = globalSets(win);

  if (!sets.length) {
    return;
  }

  const [handle, field] = String(data.target || '').split('.');
  const set = sets.find((candidate) => candidate.handle === handle) ?? sets[0];
  const picker = doc.getElementById(GLOBALS_PICKER_ID);

  if (picker) {
    picker.value = set.handle;
  }

  openGlobalsPanel(win, set);

  if (field) {
    focusGlobalField(win, field);
  }
}

/**
 * The global set holding one half of the site frame.
 *
 * The two halves may share one set (`global`) or have one each
 * (`header.global` / `footer.global`). Every caller asks per half, and a shared
 * set simply answers with the same handle twice — so which layout the site uses
 * stops being something the rest of the file has to know.
 */
export function chromeGlobalHandle(win, kind = null) {
  const cfg = chromeConfig(win);
  const own = kind === 'footer' || kind === 'header' ? cfg[kind]?.global : null;

  // Asked without a half — a warm-up, not an open. A site that only names the two
  // separately still gets a real handle rather than the theme's.
  return own || cfg.global || cfg.header?.global || cfg.footer?.global || 'theme_settings';
}

function chromeConfig(win) {
  const cfg = win.Statamic?.$config?.get?.('sveChrome');

  return cfg && typeof cfg === 'object' ? cfg : {};
}

/** Configured layout cards for header/footer (`sveChrome.header.styles` etc.). */
function chromeStyles(win, kind) {
  const list = chromeConfig(win)[kind]?.styles;

  return Array.isArray(list) ? list : [];
}

/**
 * Which half the sidebar is on, resolved the same way everywhere: the module's
 * own note first, then whichever panel still carries the attribute.
 */
function chromeKindInPlay(win, panel = null) {
  const kind =
    activeChromeKind ||
    panel?.getAttribute('data-sve-chrome-kind') ||
    win.document.getElementById(GLOBALS_PANEL_ID)?.getAttribute('data-sve-chrome-kind') ||
    win.document.getElementById(CHROME_DESIGNS_ID)?.getAttribute('data-sve-chrome-kind') ||
    'header';

  return kind === 'footer' ? 'footer' : 'header';
}

/**
 * Whether this half has layout cards to offer. A site that configures none has
 * nothing to choose between, so the Design | Edit content toggle would be two
 * names for the one thing the sidebar can show. Then it stays away.
 */
function chromeHasDesigns(win, panel = null) {
  return chromeStyles(win, chromeKindInPlay(win, panel)).length > 0;
}

export function closeChromeDesignsPanel(win) {
  win.document.getElementById(CHROME_DESIGNS_ID)?.remove();
  releaseLeftEdgeIfFree(win);
  syncPreviewInset(win);
}

const CHROME_MODE_TOGGLE_ATTR = 'data-sve-chrome-mode-toggle';

function paintChromeModeToggle(row, mode) {
  if (!row) {
    return;
  }

  row.querySelectorAll('[data-sve-chrome-mode]').forEach((btn) => {
    const on = btn.getAttribute('data-sve-chrome-mode') === mode;

    btn.style.background = on ? 'rgba(128,128,128,.22)' : 'transparent';
    btn.style.fontWeight = on ? '600' : '500';
    btn.style.opacity = on ? '1' : '.72';
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
  });
}

function paintAllChromeModeToggles(win, mode) {
  win.document.querySelectorAll(`[${CHROME_MODE_TOGGLE_ATTR}]`).forEach((row) => {
    paintChromeModeToggle(row, mode);
  });
}

export function removeChromeModeToggles(win) {
  win.document.querySelectorAll(`[${CHROME_MODE_TOGGLE_ATTR}]`).forEach((el) => el.remove());
}

/**
 * Segmented Design | Settings control for the chrome sidebar.
 * Replaces the old Designs/Settings buttons on the preview bottom bar.
 */
function buildChromeModeToggle(win, mode) {
  const doc = win.document;
  const row = doc.createElement('div');

  row.setAttribute(CHROME_MODE_TOGGLE_ATTR, '');
  row.style.cssText = 'display:flex;gap:4px;padding:2px 10px 0;flex:0 0 auto;';

  const track = doc.createElement('div');

  track.style.cssText =
    'display:flex;flex:1 1 auto;gap:2px;padding:3px;border-radius:10px;' + 'background:rgba(128,128,128,.12);';

  const makeBtn = (key, label) => {
    const btn = doc.createElement('button');

    btn.type = 'button';
    btn.textContent = label;
    btn.setAttribute('data-sve-chrome-mode', key);
    btn.style.cssText =
      'all:unset;cursor:pointer;flex:1 1 0;text-align:center;padding:7px 10px;' +
      'border-radius:8px;font-size:12px;line-height:1.2;color:currentColor;';
    btn.addEventListener('click', (event) => {
      event.stopPropagation();
      setChromeSidebarMode(win, key);
    });
    track.appendChild(btn);
  };

  makeBtn('design', t(win, 'chrome_designs'));
  // Key stays 'settings' — it names the sidebar mode, which is the global set's
  // own form. The label says what that form is for: the header's content.
  makeBtn('settings', t(win, 'chrome_content'));
  row.appendChild(track);
  paintChromeModeToggle(row, mode);

  return row;
}

/** Insert (or refresh) the Design/Settings toggle under a panel header. */
function ensureChromeModeToggle(win, panel, mode) {
  if (!panel) {
    return;
  }

  // No layout cards configured: the sidebar only ever shows the fields, so the
  // toggle is a choice with one outcome. Drop it, and any copy left from a half
  // that does have cards.
  if (!chromeHasDesigns(win, panel)) {
    panel.querySelector(`[${CHROME_MODE_TOGGLE_ATTR}]`)?.remove();

    return;
  }

  let row = panel.querySelector(`[${CHROME_MODE_TOGGLE_ATTR}]`);

  if (!row) {
    row = buildChromeModeToggle(win, mode);
    const header = panel.firstElementChild;

    if (header?.nextSibling) {
      panel.insertBefore(row, header.nextSibling);
    } else {
      panel.appendChild(row);
    }
  } else {
    paintChromeModeToggle(row, mode);
  }
}

/** Switch chrome sidebar between design picker and Theme Settings. */
export function setChromeSidebarMode(win, mode) {
  const kind =
    activeChromeKind ||
    win.document.getElementById(GLOBALS_PANEL_ID)?.getAttribute('data-sve-chrome-kind') ||
    win.document.getElementById(CHROME_DESIGNS_ID)?.getAttribute('data-sve-chrome-kind') ||
    'header';
  const chromeKind = kind === 'footer' ? 'footer' : 'header';

  // `design` is only reachable where cards exist; without them the request
  // falls through to the fields, which is all there is to show.
  if (mode === 'design' && chromeStyles(win, chromeKind).length) {
    openChromeDesignsPanel(win, chromeKind);
    paintAllChromeModeToggles(win, 'design');

    return;
  }

  // Keep designs mounted (hidden) so toggling back is instant.
  const designs = win.document.getElementById(CHROME_DESIGNS_ID);

  if (designs) {
    designs.style.cssText = 'position:fixed;left:-10000px;top:0;width:440px;height:100vh;z-index:-1;display:none;';
    designs.setAttribute('data-sve-chrome-hidden', '1');
  }

  // "settings" is the half's own tab on the panel again — the fields never
  // left, the design drawer was only sitting over them.
  openChromeInline(win, chromeKind);
  paintAllChromeModeToggles(win, 'settings');
}

/**
 * Design picker for header/footer — same shared LP editor as Theme Settings /
 * page sections. Hides Theme Settings while open; form stays mounted for writes.
 */
function openChromeDesignsPanel(win, kind) {
  const doc = win.document;
  const chromeKind = kind === 'footer' ? 'footer' : 'header';
  const existing = doc.getElementById(CHROME_DESIGNS_ID);

  if (existing) {
    existing.setAttribute('data-sve-chrome-kind', chromeKind);
    existing.dispatchEvent(new CustomEvent('sve-chrome-render'));
    hideGlobalsPanel(win);
    existing.style.display = 'flex';
    existing.removeAttribute('data-sve-chrome-hidden');
    mountInLivePreviewEditor(win, existing);
    ensureChromeModeToggle(win, existing, 'design');
    paintAllChromeModeToggles(win, 'design');
    syncPreviewInset(win);

    return;
  }

  // Keep Theme Settings mounted (hidden) + sections library if open on the right.
  closeRightPanels(win, [CHROME_DESIGNS_ID, GLOBALS_PANEL_ID, SECTION_PICKER_ID]);
  hideGlobalsPanel(win);

  const panel = doc.createElement('div');

  panel.id = CHROME_DESIGNS_ID;
  panel.setAttribute('data-sve-chrome-kind', chromeKind);
  panel.style.cssText = editorOverlayCss();

  panel.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 14px;border-bottom:1px solid rgba(128,128,128,.2);flex:0 0 auto;">
      <div style="font-size:14px;font-weight:600;" data-sve-title></div>
    </div>
    <div data-sve-hint style="padding:6px 14px;font-size:11px;opacity:.6;flex:0 0 auto;"></div>
    <div data-sve-search-wrap style="padding:8px 12px 0;flex:0 0 auto;">
      <input data-sve-search type="text" autocomplete="sve-off"
        style="width:100%;box-sizing:border-box;padding:8px 10px;border-radius:8px;border:1px solid rgba(128,128,128,.3);
        background:rgba(128,128,128,.06);color:currentColor;font:inherit;font-size:12px;outline:none;">
    </div>
    <div data-sve-scroll style="flex:1 1 auto;min-height:0;overflow-y:auto;-webkit-overflow-scrolling:touch;padding:12px;">
      <div data-sve-grid style="column-gap:12px;"></div>
    </div>
  `;

  const applyLayout = () => {
    const w = panel.getBoundingClientRect().width || 400;
    const cols = w >= 720 ? 3 : w >= 480 ? 2 : 1;
    const grid = panel.querySelector('[data-sve-grid]');

    if (grid) {
      grid.style.columnCount = String(cols);
    }
  };

  mountInLivePreviewEditor(win, panel);
  ensureChromeModeToggle(win, panel, 'design');
  applyLayout();
  syncPreviewInset(win);

  // Recalc columns when the shared editor is resized.
  new win.ResizeObserver(() => applyLayout()).observe(panel);

  const titleEl = panel.querySelector('[data-sve-title]');
  const hintEl = panel.querySelector('[data-sve-hint]');
  const searchEl = panel.querySelector('[data-sve-search]');
  const gridEl = panel.querySelector('[data-sve-grid]');
  let query = '';

  const empty = (msg) => {
    const el = doc.createElement('div');

    el.style.cssText =
      'padding:24px 8px;text-align:center;opacity:.55;font-size:13px;column-span:all;break-inside:avoid;';
    el.textContent = msg;

    return el;
  };

  const markSelected = (style) => {
    gridEl.querySelectorAll('[data-sve-chrome-style]').forEach((el) => {
      const on = el.getAttribute('data-sve-chrome-style') === style;

      el.style.borderColor = on ? 'var(--theme-color-primary,#4f46e5)' : 'rgba(128,128,128,.25)';
      el.style.boxShadow = on ? '0 0 0 1px var(--theme-color-primary,#4f46e5)' : 'none';
    });
  };

  const render = () => {
    const activeKind = panel.getAttribute('data-sve-chrome-kind') === 'footer' ? 'footer' : 'header';

    titleEl.textContent = activeKind === 'footer' ? t(win, 'tab_footer') : t(win, 'tab_header');
    hintEl.textContent = t(win, 'chrome_library_hint');
    searchEl.placeholder = t(win, 'chrome_search_placeholder');
    gridEl.innerHTML = '';

    const styles = chromeStyles(win, activeKind);

    if (!styles.length) {
      gridEl.appendChild(empty(t(win, 'chrome_no_styles')));

      return;
    }

    const filtered = styles.filter((item) => libraryMatchesQuery({ ...item, title: item.label || item.title }, query));

    if (!filtered.length) {
      gridEl.appendChild(empty(t(win, 'library_no_matches')));

      return;
    }

    filtered.forEach((item) => {
      const el = doc.createElement('div');
      const title = item.label || item.handle;
      const imageUrl = item.preview_url || item.image || '';

      el.setAttribute('data-sve-chrome-style', item.handle);
      el.style.cssText =
        'cursor:pointer;display:inline-block;width:100%;break-inside:avoid;margin:0 0 12px;border:1px solid rgba(128,128,128,.25);' +
        'border-radius:10px;overflow:hidden;background:rgba(128,128,128,.05);transition:border-color .12s;' +
        'user-select:none;vertical-align:top;';
      el.addEventListener('mouseenter', () => (el.style.borderColor = 'var(--theme-color-primary,#4f46e5)'));
      el.addEventListener('mouseleave', () => {
        const selected = el.style.boxShadow && el.style.boxShadow !== 'none';

        el.style.borderColor = selected ? 'var(--theme-color-primary,#4f46e5)' : 'rgba(128,128,128,.25)';
      });
      el.innerHTML = `
        <div style="width:100%;background:rgba(128,128,128,.12);pointer-events:none;">
          ${
            imageUrl
              ? `<img src="${imageUrl}" alt="" style="width:100%;height:auto;display:block;">`
              : `<div style="width:100%;aspect-ratio:16/5;min-height:56px;display:flex;align-items:center;justify-content:center;opacity:.45;font-size:12px;">${title}</div>`
          }
        </div>
        <div style="padding:8px 10px;font-size:12px;font-weight:500;pointer-events:none;">${title}</div>
      `;
      el.addEventListener('click', () => {
        markSelected(item.handle);
        setChromeStyle(win, activeKind, item.handle);
      });
      gridEl.appendChild(el);
    });
  };

  searchEl.addEventListener('input', () => {
    query = searchEl.value || '';
    render();
  });

  panel.addEventListener('sve-chrome-render', render);
  render();
  searchEl.focus();
}

/** Writes header.style / footer.style into the open globals panel form. */
function setChromeStyle(win, kind, style, attempt = 0) {
  const handle = chromeGlobalHandle(win, kind);
  const sets = globalSets(win);
  const set = sets.find((candidate) => candidate.handle === handle);

  // Edited in this window the field is right here — the same write the panel is
  // asked to make over postMessage, made directly.
  const container = chromeHost(win.document) ? chromeContainer() : null;

  if (container) {
    container.setFieldValue(`${kind === 'footer' ? 'footer' : 'header'}_style`, style);

    win.document
      .getElementById(CHROME_DESIGNS_ID)
      ?.querySelectorAll('[data-sve-chrome-style]')
      .forEach((el) => {
        const on = el.getAttribute('data-sve-chrome-style') === style;

        el.style.borderColor = on ? 'var(--theme-color-primary,#4f46e5)' : 'rgba(128,128,128,.25)';
        el.style.boxShadow = on ? '0 0 0 1px var(--theme-color-primary,#4f46e5)' : 'none';
      });

    return;
  }

  console.warn('[sve] no', kind, 'form open to write the style into');

  // Mark the chosen card in the open designs panel.
  const panel = win.document.getElementById(CHROME_DESIGNS_ID);

  panel?.querySelectorAll('[data-sve-chrome-style]').forEach((el) => {
    const on = el.getAttribute('data-sve-chrome-style') === style;

    el.style.borderColor = on ? 'var(--theme-color-primary,#4f46e5)' : 'rgba(128,128,128,.25)';
    el.style.boxShadow = on ? '0 0 0 1px var(--theme-color-primary,#4f46e5)' : 'none';
  });
}

/** Waits for the panel's form to mount, then scrolls the field into view. */
function focusGlobalField(win, field, attempts = 0) {
  const frame = win.document.getElementById(GLOBALS_PANEL_ID)?.querySelector('iframe');
  const inner = frame?.contentDocument;

  const input = inner?.querySelector(`[name="${field}"], #${CSS.escape(field)}`);

  if (input) {
    input.scrollIntoView({ block: 'center' });
    input.focus?.();

    return;
  }

  if (attempts < 30) {
    setTimeout(() => focusGlobalField(win, field, attempts + 1), 200);
  }
}
