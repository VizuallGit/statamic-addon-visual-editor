/**
 * Settings toggle: `schema`
 *
 * Structured data (schema.org JSON-LD) for the page and for the site.
 *
 * A panel in the Control Panel rather than in the preview, because there is
 * nothing on the page to point at: this block is written for search engines and
 * a visitor never sees it. Two scopes behind one icon — the site's standing
 * description, which goes on every page, and this page's own.
 *
 * Saved straight to the site's storage, not into the entry: it is not a field,
 * and nobody's blueprint changes because this feature exists.
 */
import { sve } from './cp-registry.js';
import { t } from './lib/i18n.js';
import { csrfToken } from './lib/csrf.js';
import { paintLpActiveControl } from './lp-panel.js';

const PANEL_ID = '__sve-schema-panel';

let panel = null;
let card = null;
let state = null;

export function schemaAllowed(win) {
  if (win.Statamic?.$config?.get?.('sveEnabled') === false) {
    return false;
  }

  return win.Statamic?.$config?.get?.('sveFeatures')?.schema === true;
}

/** Is the Control Panel in dark mode? */
function isDark(win) {
  const root = win.document.documentElement;

  return root.classList.contains('dark') || root.getAttribute('data-theme') === 'dark';
}

/** The entry being edited, from the publish form the preview is driving. */
function entryId(win) {
  return (
    win.Statamic?.$config?.get?.('sveEntryId') ||
    win.document.querySelector('[name="id"]')?.value ||
    new URL(win.location.href).pathname.split('/').filter(Boolean).pop() ||
    ''
  );
}

export function isSchemaOpen(doc) {
  return !!doc.getElementById(PANEL_ID);
}

export function closeSchema(win) {
  win.document.getElementById(PANEL_ID)?.remove();
  panel = null;
  card = null;
  state = null;
  win.document.removeEventListener('keydown', onKeydown, true);
  paintButton(win);
}

export function toggleSchema(win) {
  if (!schemaAllowed(win)) {
    return;
  }

  if (isSchemaOpen(win.document)) {
    closeSchema(win);

    return;
  }

  openSchema(win);
}

function onKeydown(e) {
  if (e.key === 'Escape' && panel) {
    e.stopPropagation();
    closeSchema(panel.ownerDocument.defaultView);
  }
}

async function openSchema(win) {
  const doc = win.document;
  const id = entryId(win);

  state = { scope: 'entry', entry: id, site: '', page: '', dirty: false, note: '', ok: null };

  build(win);

  try {
    const res = await win.fetch(`/!/sve/schema?entry=${encodeURIComponent(id)}`, {
      credentials: 'same-origin',
      headers: { 'X-Requested-With': 'XMLHttpRequest', Accept: 'application/json' },
    });

    if (res.ok) {
      const body = await res.json();

      state.site = typeof body?.site === 'string' ? body.site : '';
      state.page = typeof body?.entry === 'string' ? body.entry : '';
      render(win);
    }
  } catch {
    /* an empty panel is still usable */
  }
}

function build(win) {
  const doc = win.document;

  // Same shape as the Edit history dialog: a full-screen layer, a scrim behind,
  // and the card in the middle of it. This is not a tool you point at part of
  // the page with — it is a thing you read and type into, so it sits in front
  // of the page rather than in a corner of it.
  panel = doc.createElement('div');
  panel.id = PANEL_ID;
  panel.style.cssText =
    'position:fixed;inset:0;z-index:5000;display:flex;align-items:center;justify-content:center;' +
    'padding:24px;font:400 0.8125rem/1.45 ui-sans-serif,system-ui,-apple-system,sans-serif;';

  const scrim = doc.createElement('div');

  scrim.style.cssText =
    'position:absolute;inset:0;cursor:pointer;' +
    // Statamic's own modal overlay: gray-800/20, gray-950/60 in dark.
    (isDark(win)
      ? 'background:color-mix(in oklab, var(--theme-color-gray-950,#0a0a0a) 60%, transparent);'
      : 'background:color-mix(in oklab, var(--theme-color-gray-800,#262626) 20%, transparent);');
  scrim.addEventListener('click', () => closeSchema(win));

  card = doc.createElement('div');
  card.style.cssText =
    'position:relative;z-index:1;display:flex;flex-direction:column;' +
    'width:min(720px,100%);max-height:min(72vh,640px);overflow:hidden;border-radius:4px;' +
    'border:1px solid var(--theme-color-content-border,rgba(128,128,128,0.3));' +
    'background:var(--theme-color-content-bg,#fff);color:var(--theme-color-content-text,inherit);' +
    'box-shadow:0 1.5rem 3rem rgba(0,0,0,0.35);';

  panel.append(scrim, card);
  doc.body.appendChild(panel);
  doc.addEventListener('keydown', onKeydown, true);

  render(win);
  paintButton(win);
}

function current() {
  return state.scope === 'site' ? state.site : state.page;
}

function setCurrent(value) {
  if (state.scope === 'site') {
    state.site = value;
  } else {
    state.page = value;
  }
}

function render(win) {
  if (!panel) {
    return;
  }

  const doc = win.document;

  card.textContent = '';

  // --- head: title, the two scopes, close ---
  const head = doc.createElement('div');

  head.style.cssText =
    'flex:0 0 auto;display:flex;align-items:center;gap:0.5rem;padding:0.625rem 0.75rem;' +
    'border-bottom:1px solid rgba(128,128,128,0.25);';

  const title = doc.createElement('div');

  title.textContent = t(win, 'schema_title');
  title.style.cssText = 'font-weight:600;flex:0 0 auto;';

  const tabs = doc.createElement('div');

  tabs.style.cssText = 'display:flex;gap:0.25rem;flex:1 1 auto;';

  [
    ['entry', 'schema_page'],
    ['site', 'schema_site'],
  ].forEach(([scope, key]) => {
    const tab = doc.createElement('button');
    const on = state.scope === scope;

    tab.type = 'button';
    tab.textContent = t(win, key);
    tab.style.cssText =
      'all:unset;cursor:pointer;padding:0.1875rem 0.5rem;border-radius:4px;font-size:0.75rem;' +
      (on
        ? 'background:var(--theme-color-primary,#4530D8);color:#fff;font-weight:600;'
        : 'border:1px solid rgba(128,128,128,0.3);');
    tab.addEventListener('click', () => {
      state.scope = scope;
      state.note = '';
      state.ok = null;
      render(win);
    });
    tabs.appendChild(tab);
  });

  const close = doc.createElement('button');

  close.type = 'button';
  close.textContent = '✕';
  close.title = t(win, 'schema_close');
  close.style.cssText =
    'all:unset;cursor:pointer;width:1.25rem;height:1.25rem;display:flex;align-items:center;' +
    'justify-content:center;border-radius:4px;opacity:0.7;';
  close.addEventListener('click', () => closeSchema(win));

  head.append(title, tabs, close);

  // --- body ---
  const body = doc.createElement('div');

  body.style.cssText = 'flex:1 1 auto;overflow:auto;padding:0.75rem;display:flex;flex-direction:column;gap:0.5rem;';

  const hint = doc.createElement('div');

  hint.textContent = t(win, 'schema_hint');
  hint.style.cssText = 'opacity:0.7;font-size:0.6875rem;line-height:1.4;';

  const area = doc.createElement('textarea');

  area.value = current();
  area.placeholder = t(win, 'schema_placeholder');
  area.spellcheck = false;
  area.rows = 14;
  area.style.cssText =
    'box-sizing:border-box;width:100%;min-height:16rem;resize:vertical;padding:0.5rem;border-radius:4px;' +
    'border:1px solid rgba(128,128,128,0.35);background:var(--theme-color-content-bg,#fff);color:inherit;' +
    'font:400 12px/1.5 ui-monospace,SFMono-Regular,Menlo,monospace;';
  area.addEventListener('input', () => {
    setCurrent(area.value);
    state.dirty = true;
    state.ok = check(area.value);
    paintStatus(win);
  });

  body.append(hint, area);

  // --- foot: status + save ---
  const foot = doc.createElement('div');

  foot.style.cssText =
    'flex:0 0 auto;display:flex;align-items:center;gap:0.5rem;padding:0.625rem 0.75rem;' +
    'border-top:1px solid rgba(128,128,128,0.25);';

  const save = doc.createElement('button');

  save.type = 'button';
  save.textContent = t(win, 'schema_save');
  save.style.cssText =
    'all:unset;cursor:pointer;padding:0.375rem 0.75rem;border-radius:4px;font-weight:600;font-size:0.75rem;' +
    'background:var(--theme-color-primary,#4530D8);color:#fff;';
  save.addEventListener('click', () => persist(win, area.value));

  const status = doc.createElement('div');

  status.dataset.sveSchemaStatus = '';
  status.style.cssText = 'flex:1 1 auto;font-size:0.6875rem;opacity:0.85;';

  foot.append(save, status);
  card.append(head, body, foot);

  state.ok = area.value.trim() === '' ? null : check(area.value);
  paintStatus(win);
}

/** Valid JSON, as far as the browser can tell before the server sees it. */
function check(value) {
  const text = value.trim().replace(/^<script[^>]*>|<\/script>$/gi, '').trim();

  if (text === '') {
    return null;
  }

  try {
    const parsed = JSON.parse(text);

    return parsed && typeof parsed === 'object';
  } catch {
    return false;
  }
}

function paintStatus(win) {
  const status = card?.querySelector('[data-sve-schema-status]');

  if (!status) {
    return;
  }

  if (state.note) {
    status.textContent = state.note;
    status.style.color = state.noteBad ? '#dc2626' : 'inherit';

    return;
  }

  status.style.color = state.ok === false ? '#dc2626' : 'inherit';
  status.textContent =
    state.ok === null
      ? t(win, 'schema_empty')
      : state.ok
        ? t(win, 'schema_valid')
        : t(win, 'schema_invalid');
}

async function persist(win, value) {
  state.note = t(win, 'schema_saving');
  state.noteBad = false;
  paintStatus(win);

  try {
    const res = await win.fetch('/!/sve/schema', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRF-TOKEN': csrfToken(win),
        Accept: 'application/json',
      },
      body: JSON.stringify({ scope: state.scope, entry: state.entry, json: value }),
    });
    const body = await res.json().catch(() => null);

    if (!res.ok) {
      state.note = body?.message || t(win, 'schema_invalid');
      state.noteBad = true;
      paintStatus(win);

      return;
    }

    // The server hands back what it parsed and re-encoded — showing that is how
    // you can tell the page now holds exactly this.
    setCurrent(body?.json ?? value);
    state.note = t(win, 'schema_saved');
    state.noteBad = false;
    state.dirty = false;
    render(win);
  } catch (e) {
    state.note = e?.message || t(win, 'schema_invalid');
    state.noteBad = true;
    paintStatus(win);
  }
}

function paintButton(win) {
  const btn = win.document.querySelector('#__sve-toolbar button[data-tab="schema"]');

  if (btn) {
    paintLpActiveControl(btn, isSchemaOpen(win.document));
  }
}
