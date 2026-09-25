/**
 * Theme colors in Live Preview: the colors in the site's site.css `@theme`,
 * with tints and shades, edited like a design tool.
 *
 * Own surface. Does not import overlay, preview, bridge or the template dock.
 * Two speeds: a change paints into the preview at once (the variables are set
 * on the preview's `<html>`); Save writes site.css through the site-css
 * endpoint, and the site's `{{ theme_tokens }}` tag serves the saved colors on
 * the next render — no build.
 */
import { mountSurface } from './cp/mount.js';
import { openCpOverlay } from './cp/open-overlay.js';
import { t } from './lib/i18n.js';
import { csrfToken } from './lib/csrf.js';
import { previewCopies, previewDocument } from './lib/preview-frame.js';
import ThemeColorsPane from './cp/surfaces/ThemeColorsPane.vue';
import ChoiceDialog from './cp/surfaces/ChoiceDialog.vue';
import { themeColorsUi as ui } from './cp/theme-colors/store.js';
import {
  MAX_VARIANTS,
  familyMode,
  generateSteps,
  isHex,
  nameProblem,
  readColors,
  writeColors,
} from './cp/theme-colors/palette.js';

export const PANEL_ID = '__sve-theme-colors';

const ENTRY = 'site.css';

const LABELS = [
  'title', 'subtitle', 'add', 'save', 'close', 'name', 'color', 'tints', 'shades',
  'steps', 'no_steps', 'replace_warning', 'remove', 'loading',
  'name_empty', 'name_format', 'name_number', 'name_reserved', 'name_taken', 'name_clash',
];

let app = null;
let keySeq = 0;
let loadSeq = 0;
/** Names whose variables this panel has set on the preview, so they can be taken off again. */
let painted = new Set();
let onFrameLoad = null;

async function request(win, url, options = {}) {
  const res = await win.fetch(`${url}${url.includes('?') ? '&' : '?'}kind=css`, {
    credentials: 'same-origin',
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'X-CSRF-TOKEN': csrfToken(win),
      Accept: 'application/json',
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    },
    ...options,
  });

  if (!res.ok) {
    throw new Error(String(res.status));
  }

  return res.json();
}

async function readFile(win) {
  const data = await request(win, `/!/sve/site-css/file?path=${encodeURIComponent(ENTRY)}`);

  return String(data.css || '');
}

function toUi(family) {
  return {
    key: `color-${++keySeq}`,
    name: family.name,
    value: family.value,
    steps: family.steps,
    ...familyMode(family),
    fresh: false,
    problem: null,
  };
}

function plain(families) {
  return families.map(({ name, value, steps }) => ({ name, value, steps }));
}

function find(key) {
  return ui.families.find((f) => f.key === key) || null;
}

/** The documents that show the page: the preview, and the breakpoint overview's frames. */
function pageDocuments(win) {
  return [previewDocument(win), ...previewCopies(win).map((w) => w.document)].filter(Boolean);
}

/**
 * Set every color on the preview's `<html>`, the way `{{ theme_tokens }}`
 * writes them (`--color-x` plus the short `--x`), and take off the ones that
 * are gone. A color with a name problem is not painted.
 */
function paint(win, families = ui.families) {
  const want = new Map();

  for (const f of families) {
    if (f.problem) {
      continue;
    }

    if (f.value) {
      want.set(f.name, f.value);
    }

    for (const step of f.steps || []) {
      want.set(`${f.name}-${step.name}`, step.value);
    }
  }

  for (const doc of pageDocuments(win)) {
    const style = doc.documentElement.style;

    for (const [name, value] of want) {
      style.setProperty(`--color-${name}`, value);
      style.setProperty(`--${name}`, `var(--color-${name})`);
    }

    for (const name of painted) {
      if (!want.has(name)) {
        style.removeProperty(`--color-${name}`);
        style.removeProperty(`--${name}`);
      }
    }
  }

  painted = new Set(want.keys());
}

function changed(win) {
  ui.dirty = true;
  ui.status = '';
  paint(win);
}

/** Steps follow the counts; with both at zero a generated family has none. */
function remake(f) {
  if (f.tints || f.shades) {
    f.steps = generateSteps(f.value, { tints: f.tints, shades: f.shades }).map(({ name, value }) => ({ name, value }));
    f.generated = true;
  } else if (f.generated) {
    f.steps = [];
  }
}

/** Why `name` cannot be used by `f`, or null. The preview is asked whether the site already has `--name`. */
function problemFor(win, f, name) {
  const others = ui.families.filter((o) => o !== f).map((o) => o.name);
  const problem = nameProblem(name, others);

  if (problem) {
    return problem;
  }

  const doc = previewDocument(win);

  if (!painted.has(name) && doc) {
    const existing = doc.defaultView.getComputedStyle(doc.documentElement).getPropertyValue(`--${name}`);

    if (existing.trim()) {
      return 'clash';
    }
  }

  return null;
}

const handlers = (win) => ({
  onClose: () => closeThemeColors(win),
  onSave: () => void saveColors(win),
  onAdd: () => {
    const f = toUi({ name: '', value: '#6b7280', steps: [] });

    f.fresh = true;
    f.problem = 'empty';
    ui.families.unshift(f);
    ui.openKey = f.key;
    ui.dirty = true;
  },
  onOpen: (key) => {
    ui.openKey = ui.openKey === key ? '' : key;
  },
  onName: (key, name) => {
    const f = find(key);

    if (!f || !f.fresh) {
      return;
    }

    f.name = String(name).trim();
    f.problem = problemFor(win, f, f.name);
    changed(win);
  },
  onColor: (key, value) => {
    const f = find(key);
    const v = String(value).trim();

    if (!f || !isHex(v)) {
      return;
    }

    f.value = v.toLowerCase();

    if (f.generated) {
      remake(f);
    }

    changed(win);
  },
  onToggle: (key, kind, on) => {
    const f = find(key);

    if (!f) {
      return;
    }

    f[kind] = on ? f[kind] || 3 : 0;
    remake(f);
    changed(win);
  },
  onCount: (key, kind, n) => {
    const f = find(key);

    if (!f) {
      return;
    }

    f[kind] = Math.max(0, Math.min(MAX_VARIANTS, n));
    remake(f);
    changed(win);
  },
  onStep: (key, name, value) => {
    const f = find(key);
    const step = f?.steps.find((s) => s.name === name);

    if (!step || f.generated || !isHex(value)) {
      return;
    }

    step.value = String(value).toLowerCase();
    changed(win);
  },
  onRemove: (key) => {
    const f = find(key);

    if (!f) {
      return;
    }

    if (f.fresh) {
      ui.families = ui.families.filter((o) => o !== f);
      changed(win);

      return;
    }

    const overlay = openCpOverlay(win.document, ChoiceDialog, {
      title: t(win, 'theme_colors_remove_title', { name: f.name }),
      body: t(win, 'theme_colors_remove_body', { name: f.name }),
      buttons: [
        { value: 'cancel', label: t(win, 'cancel'), variant: 'muted' },
        { value: 'ok', label: t(win, 'theme_colors_remove'), variant: 'danger' },
      ],
      onPick: (value) => {
        overlay.dismiss();

        if (value === 'ok') {
          ui.families = ui.families.filter((o) => o !== f);
          changed(win);
        }
      },
      onClose: () => overlay.dismiss(),
    });
  },
});

async function load(win) {
  const mine = ++loadSeq;

  ui.loading = true;
  ui.status = '';

  try {
    const css = await readFile(win);

    if (mine !== loadSeq || !isThemeColorsOpen(win.document)) {
      return;
    }

    ui.saved = css;
    ui.families = readColors(css).map(toUi);
    ui.dirty = false;
  } catch {
    ui.status = t(win, 'theme_colors_error');
  } finally {
    ui.loading = false;
  }
}

/**
 * Write the colors into the file as it is on disk now, not as it was when the
 * panel opened: writeColors() only touches color lines, so an edit made in the
 * stylesheet editor meanwhile survives.
 */
export async function saveColors(win) {
  if (ui.saving || !ui.dirty) {
    return true;
  }

  if (ui.families.some((f) => f.problem)) {
    ui.status = t(win, 'theme_colors_fix_names');

    return false;
  }

  ui.saving = true;
  ui.status = t(win, 'theme_colors_saving');

  try {
    const css = writeColors(await readFile(win), plain(ui.families));

    await request(win, '/!/sve/site-css', {
      method: 'POST',
      body: JSON.stringify({ path: ENTRY, css }),
    });

    ui.saved = css;
    ui.families.forEach((f) => {
      f.fresh = false;
    });
    ui.dirty = false;
    ui.status = t(win, 'theme_colors_saved');
    win.setTimeout(() => {
      if (ui.status === t(win, 'theme_colors_saved')) {
        ui.status = '';
      }
    }, 1200);

    return true;
  } catch {
    ui.status = t(win, 'theme_colors_error');

    return false;
  } finally {
    ui.saving = false;
  }
}

export function themeColorsAllowed(win) {
  return win.Statamic?.$config?.get?.('sveFeatures')?.site_css === true;
}

export function isThemeColorsOpen(doc) {
  return !!doc?.getElementById(PANEL_ID);
}

function teardown(win) {
  // What is saved stays painted: the page on screen was rendered before the
  // save and still carries the old colors in its <head>.
  paint(win, readColors(ui.saved).map((f) => ({ ...f, problem: null })));

  if (onFrameLoad) {
    win.document.removeEventListener('load', onFrameLoad, true);
    onFrameLoad = null;
  }

  app?.unmount();
  app = null;
  ui.families = [];
  ui.openKey = '';
  ui.dirty = false;
  ui.status = '';
  win.document.getElementById(PANEL_ID)?.remove();
}

/** Close; with unsaved changes, ask first. */
export function closeThemeColors(win) {
  if (!ui.dirty) {
    teardown(win);

    return;
  }

  const overlay = openCpOverlay(win.document, ChoiceDialog, {
    title: t(win, 'theme_colors_unsaved_title'),
    body: t(win, 'theme_colors_unsaved_body'),
    buttons: [
      { value: 'discard', label: t(win, 'theme_colors_discard'), variant: 'muted' },
      { value: 'save', label: t(win, 'theme_colors_save'), variant: 'primary' },
    ],
    onPick: async (value) => {
      overlay.dismiss();

      if (value === 'save' && !(await saveColors(win))) {
        return;
      }

      teardown(win);
    },
    onClose: () => overlay.dismiss(),
  });
}

function placePanel(win, el) {
  const parent = win.document.querySelector('.live-preview') || win.document.body;
  const header = parent.querySelector('.live-preview-header');

  if (win.getComputedStyle(parent).position === 'static') {
    parent.style.position = 'relative';
  }

  parent.appendChild(el);
  el.style.top = `${header ? Math.round(header.getBoundingClientRect().height) : 0}px`;
}

function openThemeColors(win) {
  const doc = win.document;
  const panel = doc.createElement('div');

  panel.id = PANEL_ID;
  panel.style.cssText = 'position:absolute;right:0;bottom:0;width:22rem;max-width:100%;z-index:40;';
  ui.labels = Object.fromEntries(LABELS.map((key) => [key, t(win, `theme_colors_${key}`)]));
  placePanel(win, panel);
  app = mountSurface(ThemeColorsPane, panel, handlers(win));

  // A preview that reloads (another edit, a size switched on) gets the
  // unsaved colors back.
  onFrameLoad = (event) => {
    if (event.target?.tagName === 'IFRAME') {
      win.setTimeout(() => paint(win), 0);
    }
  };
  doc.addEventListener('load', onFrameLoad, true);

  void load(win);
}

export function toggleThemeColors(win) {
  if (!themeColorsAllowed(win)) {
    return;
  }

  if (isThemeColorsOpen(win.document)) {
    closeThemeColors(win);

    return;
  }

  openThemeColors(win);
}
