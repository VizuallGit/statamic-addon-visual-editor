/**
 * The theme panel in Live Preview: colors, the size scale, typography and the
 * button — the tokens in the site's site.css `@theme`, edited like a design
 * tool, one tab each.
 *
 * Own surface. Does not import overlay, preview, bridge or the template dock.
 * Two speeds: a change paints into the preview at once (the variables are set
 * on the preview's `<html>`); Save writes site.css through the site-css
 * endpoint, and the site's `{{ theme_tokens }}` tag serves the saved values
 * on the next render — no build.
 */
import './cp/theme-panel/theme-panel.css';
import { mountSurface } from './cp/mount.js';
import { openCpOverlay } from './cp/open-overlay.js';
import { t } from './lib/i18n.js';
import { csrfToken } from './lib/csrf.js';
import { previewCopies, previewDocument } from './lib/preview-frame.js';
import { RIGHT_PANEL_FILL, releaseRightShellIfEmpty, showInRightShell } from './right-dock.js';
import { closeRightPanels } from './section-library.js';
import ThemePanelPane from './cp/surfaces/ThemePanelPane.vue';
import ChoiceDialog from './cp/surfaces/ChoiceDialog.vue';
import FontDialog from './cp/surfaces/FontDialog.vue';
import { themePanelUi as ui } from './cp/theme-panel/store.js';
import { MAX_VARIANTS, familyMode, generateSteps, isCoreColor, isHex, nameProblem, readColors, remakeSteps, writeColors } from './cp/theme-panel/palette.js';
import { readTokens, writeTokens } from './cp/theme-panel/tokens.js';
import { MIN_VIEWPORT, inferViewport, nextSizeName, parseSize, sizeValue } from './cp/theme-panel/sizes.js';
import { BUTTON_TOKENS, LEVEL_TOKENS, TYPE_TOKENS, firstFamily, isManaged } from './cp/theme-panel/presets.js';
import { applyListing, installedNames, loadFonts, refreshPageFonts } from './cp/theme-panel/fonts.js';
import { bodyProblem, compilerCss, dedent, utilityBodies, utilityNameProblem, writeUtilities } from './cp/theme-panel/utilities.js';
import { paintUtilities, swapSiteCss, utilityCandidates } from './cp/theme-panel/utility-paint.js';

import { THEME_PANEL_ID as PANEL_ID } from './theme-panel-lazy.js';

export { PANEL_ID };

const ENTRY = 'site.css';

const TABS = ['colors', 'spacing', 'fonts', 'type', 'button', 'utilities'];

let app = null;
let keySeq = 0;
let loadSeq = 0;
/** Custom properties this panel has set on the preview, so they can be taken off again. */
let painted = new Set();
/** The tokens as they stood in the file when it was read or saved — a save writes only what differs. */
let savedTokens = new Map();
/** The `@utility` bodies as they stood in the file when it was read or saved. */
let savedUtilities = new Map();
/** Utilities saved while the server could not build the site's CSS: still drawn in the preview. */
const unbuilt = new Set();
let utilitySeq = 0;
let utilityTimer = null;
let utilitiesPainted = false;
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

function colorUi(family) {
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

function sizeUi(name, value) {
  const size = parseSize(value);

  return size ? { key: `size-${++keySeq}`, name, value, min: size.min, max: size.max, fresh: false, problem: null } : null;
}

function plainFamilies(families) {
  return families.map(({ name, value, steps }) => ({ name, value, steps }));
}

/** The families in fonts.css and the ones the page has fonts for, plus the ones the theme names. */
function fontFamilies(win) {
  const names = new Set(installedNames());
  const doc = previewDocument(win);

  try {
    doc?.fonts?.forEach((face) => names.add(face.family.replace(/^['"]|['"]$/g, '')));
  } catch {
    // no FontFaceSet: the theme's own families below are enough
  }

  [ui.type['font-base'], ui.type['font-heading']].forEach((stack) => stack && names.add(firstFamily(stack)));
  names.delete('Iconfont');

  return [...names].filter(Boolean).sort((a, b) => a.localeCompare(b));
}

function remember(css) {
  const tokens = readTokens(css);

  ui.saved = css;
  savedTokens = tokens;
  ui.families = readColors(css).map(colorUi);
  // Each color's step names as saved: what the Colors tab says will go on the next save.
  ui.savedSteps = Object.fromEntries(ui.families.map((f) => [f.name, f.steps.map((s) => String(s.name))]));
  ui.sizes = [...tokens].filter(([name]) => name.startsWith('size-')).map(([name, value]) => sizeUi(name, value)).filter(Boolean);
  ui.maxViewport = parseSize(tokens.get('container-width'))?.max || inferViewport(ui.sizes.map((s) => s.value)) || 1280;
  ui.type = Object.fromEntries(TYPE_TOKENS.map((name) => [name, tokens.get(name) || '']));
  ui.button = Object.fromEntries(BUTTON_TOKENS.map((name) => [name, tokens.get(name) || '']));
  ui.leadings = [...tokens]
    .filter(([name, value]) => name.startsWith('leading-') && /^[\d.]+$/.test(value))
    .map(([name, value]) => ({ name: name.slice('leading-'.length), value }));
  // A utility keeps its key over a save, so its open editor stays as it is.
  const keys = new Map(ui.utilities.map((u) => [u.name, u.key]));

  savedUtilities = utilityBodies(css);
  ui.savedUtilities = Object.fromEntries(savedUtilities);
  ui.utilities = [...savedUtilities].map(([name, body]) => utilityUi(name, body, keys.get(name)));
  ui.dirty = false;
}

function utilityUi(name, body, key = `utility-${++keySeq}`) {
  return { key, name, body, fresh: false, problem: null };
}

const findUtility = (key) => ui.utilities.find((u) => u.key === key) || null;

/** A new utility's name first, then braces that do not pair up. */
function utilityProblem(u) {
  const name = u.fresh ? utilityNameProblem(u.name, ui.utilities.filter((o) => o !== u).map((o) => o.name)) : null;

  return name || bodyProblem(u.body);
}

/**
 * What a save changes among the utilities: `{ name: body }` for a new or
 * edited one, `{ name: null }` for one that is gone. `forPaint` keeps a body
 * whose braces do not pair up yet — the preview tries it; a save never does.
 */
function utilityChanges(forPaint = false) {
  const changes = {};

  for (const u of ui.utilities) {
    const usable = !u.problem || (forPaint && u.problem === 'braces');

    if (usable && savedUtilities.get(u.name) !== dedent(u.body)) {
      changes[u.name] = u.body;
    }
  }

  for (const name of savedUtilities.keys()) {
    if (!ui.utilities.some((u) => u.name === name)) {
      changes[name] = null;
    }
  }

  return changes;
}

/**
 * Draw the utilities being edited, and the saved ones the server has not
 * built yet, into the preview's built stylesheet (utility-paint.js), compiled
 * by the dock's Tailwind. The newest call wins; CSS that Tailwind cannot read
 * yet (half typed) leaves the last paint on screen.
 */
async function drawUtilities(win) {
  const mine = ++utilitySeq;
  const changes = utilityChanges(true);
  const names = [...new Set([...Object.keys(changes), ...unbuilt])];
  const docs = pageDocuments(win);

  if (!names.length) {
    if (utilitiesPainted) {
      paintUtilities(docs, [], '');
      utilitiesPainted = false;
    }

    return;
  }

  const candidates = utilityCandidates(docs, names);
  const draft = compilerCss(writeUtilities(ui.saved, changes));

  try {
    const { compileDraft } = await import('./tw-compile.js');
    const css = await compileDraft(win, draft, candidates);

    if (mine === utilitySeq) {
      paintUtilities(pageDocuments(win), names, css);
      utilitiesPainted = true;
    }
  } catch {
    // Not CSS Tailwind can read yet: the next keystroke tries again.
  }
}

function utilityChanged(win) {
  ui.dirty = true;
  ui.status = '';
  win.clearTimeout(utilityTimer);
  utilityTimer = win.setTimeout(() => void drawUtilities(win), 120);
}

/**
 * Build the site's CSS on the server (SiteBuild.php) and put the new file in
 * the preview, which then shows exactly what visitors get. When the server
 * cannot build, the tab says why and the paint stays.
 */
async function buildSiteCss(win) {
  ui.status = t(win, 'theme_utilities_building');

  let reason = 'error';

  try {
    const data = await request(win, '/!/sve/site-css/build', { method: 'POST', body: '{}' });

    if (data.ok && data.css) {
      unbuilt.clear();
      ui.buildNote = '';
      // Once the new sheet is in, anything typed during the build is drawn on it.
      pageDocuments(win).forEach((doc) => swapSiteCss(doc, data.css, () => void drawUtilities(win)));

      return;
    }

    reason = data.reason || reason;
  } catch {
    // The server did not answer: said below.
  }

  ui.buildNote = t(win, 'theme_utilities_not_built', { reason: t(win, `theme_utilities_reason_${reason}`) });
}

/** The container width as written: unchanged, the file's own text. */
function containerValue() {
  const saved = savedTokens.get('container-width');

  return parseSize(saved)?.max === ui.maxViewport ? saved : `${Number((ui.maxViewport / 16).toFixed(4))}rem`;
}

/** A size as written: unchanged (same min, max and container), the file's own text. */
function sizeText(size) {
  const saved = parseSize(size.value);
  const viewport = parseSize(savedTokens.get('container-width'))?.max;

  if (size.value && saved && saved.min === size.min && saved.max === size.max && (viewport === ui.maxViewport || saved.min === saved.max)) {
    return size.value;
  }

  return sizeValue(size.min, size.max, ui.maxViewport);
}

/** Every token the panel manages besides colors, as the tabs say: name => value. */
function desiredTokens() {
  const out = { 'container-width': containerValue() };

  for (const size of ui.sizes) {
    if (size.problem) {
      continue;
    }

    out[size.name] = sizeText(size);

    // A size new in this session is a Tailwind class through `--spacing-*` and
    // `--text-*` (`p-1300`, `text-1300`), pointing at itself. The file's own
    // sizes keep exactly the lines they have.
    if (!savedTokens.has(size.name)) {
      const suffix = size.name.slice('size-'.length);

      for (const utility of ['spacing', 'text']) {
        if (!savedTokens.has(`${utility}-${suffix}`)) {
          out[`${utility}-${suffix}`] = `var(--${size.name})`;
        }
      }
    }
  }

  for (const [name, value] of Object.entries({ ...ui.type, ...ui.button })) {
    if (value) {
      out[name] = value;
    }
  }

  return out;
}

/** What a save changes in the file: the tokens that differ from it; sizes and heading overrides that are gone (null). */
function tokenChanges() {
  const want = desiredTokens();
  const changes = {};

  for (const [name, value] of Object.entries(want)) {
    if (savedTokens.get(name) !== value) {
      changes[name] = value;
    }
  }

  for (const name of savedTokens.keys()) {
    if (name.startsWith('size-') && !(name in want) && !ui.sizes.some((s) => s.name === name)) {
      changes[name] = null;
    }

    // A heading level set back to "as the headings" loses its own line.
    if (LEVEL_TOKENS.includes(name) && !ui.type[name]) {
      changes[name] = null;
    }
  }

  // A removed size takes along its `--spacing-*` / `--text-*` lines, but only
  // lines that point at exactly it — nothing else is touched.
  for (const [name, value] of Object.entries(changes)) {
    if (value !== null || !name.startsWith('size-')) {
      continue;
    }

    const suffix = name.slice('size-'.length);

    for (const utility of ['spacing', 'text']) {
      if (savedTokens.get(`${utility}-${suffix}`) === `var(--${name})`) {
        changes[`${utility}-${suffix}`] = null;
      }
    }
  }

  return changes;
}

/** The documents that show the page: the preview, and the breakpoint overview's frames. */
function pageDocuments(win) {
  return [previewDocument(win), ...previewCopies(win).map((w) => w.document)].filter(Boolean);
}

/** The custom properties `{{ theme_tokens }}` would write for this state: colors (plus short names) and the rest. */
function propertiesFor(families, tokens) {
  const want = new Map();

  for (const f of families) {
    if (f.problem) {
      continue;
    }

    const set = (name, value) => {
      want.set(`--color-${name}`, value);
      want.set(`--${name}`, `var(--color-${name})`);
    };

    if (f.value) {
      set(f.name, f.value);
    }

    (f.steps || []).forEach((step) => set(`${f.name}-${step.name}`, step.value));
  }

  for (const [name, value] of Object.entries(tokens)) {
    if (value !== null && isManaged(name)) {
      want.set(`--${name}`, value);
    }
  }

  return want;
}

/** Set every value on the preview's `<html>`, and take off the ones that are gone. */
function paint(win, want = propertiesFor(ui.families, desiredTokens())) {
  for (const doc of pageDocuments(win)) {
    const style = doc.documentElement.style;

    for (const [name, value] of want) {
      style.setProperty(name, value);
    }

    for (const name of painted) {
      if (!want.has(name)) {
        style.removeProperty(name);
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

const findColor = (key) => ui.families.find((f) => f.key === key) || null;
const findSize = (key) => ui.sizes.find((s) => s.key === key) || null;

/**
 * Steps follow the counts; with both at zero a generated family has none.
 * A saved color's step names stay (remakeSteps) — templates may use them —
 * `previousBase` being the base the current steps were made from. A color not
 * saved yet is used nowhere, so its names simply follow lightness.
 */
function remake(f, previousBase = f.value) {
  if (f.tints || f.shades) {
    const counts = { tints: f.tints, shades: f.shades };

    f.steps = (f.fresh ? generateSteps(f.value, counts) : remakeSteps(f.value, counts, f.steps, previousBase))
      .map(({ name, value }) => ({ name, value }));
    f.generated = true;
  } else if (f.generated) {
    f.steps = [];
  }
}

/** Why `name` cannot be a new color, or null. The preview is asked whether the site already has `--name`. */
function colorProblem(win, f, name) {
  const problem = nameProblem(name, ui.families.filter((o) => o !== f).map((o) => o.name));

  if (problem) {
    return problem;
  }

  const doc = previewDocument(win);
  const existing = !painted.has(`--${name}`) && doc
    ? doc.defaultView.getComputedStyle(doc.documentElement).getPropertyValue(`--${name}`).trim()
    : '';

  return existing ? 'clash' : null;
}

function sizeProblem(size, name) {
  if (!/^size-[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name)) {
    return 'format';
  }

  return ui.sizes.some((o) => o !== size && o.name === name) ? 'taken' : null;
}

/**
 * The "Add font" dialog over the Control Panel. What it installs is on the
 * server already; here the store takes the new list, the Typography dropdowns
 * offer the font, and the preview fetches the new fonts.css.
 */
function openFontDialog(win) {
  const overlay = openCpOverlay(win.document, FontDialog, {
    win,
    onInstalled: (listing, message) => {
      overlay.dismiss();
      fontsInstalled(win, listing, message);
    },
    onClose: () => {},
  });
}

let fontsStatusTimer = null;

function fontsInstalled(win, listing, message) {
  applyListing(win, listing);
  ui.fonts = fontFamilies(win);
  refreshPageFonts(pageDocuments(win));
  ui.fontsStatus = message || '';
  win.clearTimeout(fontsStatusTimer);
  fontsStatusTimer = win.setTimeout(() => {
    ui.fontsStatus = '';
  }, 5000);
}

/** Ask before a saved thing is removed: templates may use it. */
function confirmRemove(win, title, body, remove) {
  const overlay = openCpOverlay(win.document, ChoiceDialog, {
    title,
    body,
    buttons: [
      { value: 'cancel', label: t(win, 'cancel'), variant: 'muted' },
      { value: 'ok', label: t(win, 'theme_panel_remove'), variant: 'danger' },
    ],
    onPick: (value) => {
      overlay.dismiss();

      if (value === 'ok') {
        remove();
        changed(win);
      }
    },
    onClose: () => overlay.dismiss(),
  });
}

const handlers = (win) => ({
  onClose: () => closeThemePanel(win),
  onSave: () => void saveTheme(win),
  onTab: (tab) => {
    if (TABS.includes(tab)) {
      ui.tab = tab;
    }
  },

  // Colors
  onAddColor: () => {
    const f = colorUi({ name: '', value: '#6b7280', steps: [] });

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
    const f = findColor(key);

    if (f?.fresh) {
      f.name = String(name).trim();
      f.problem = colorProblem(win, f, f.name);
      changed(win);
    }
  },
  onColor: (key, value) => {
    const f = findColor(key);
    const v = String(value).trim();

    if (!f || !isHex(v)) {
      return;
    }

    const before = f.value;

    f.value = v.toLowerCase();

    if (f.generated) {
      remake(f, before);
    }

    changed(win);
  },
  // Names by lightness again, asked for: classes with the old names stop working (the tab says which).
  onRenameByLightness: (key) => {
    const f = findColor(key);

    if (f?.generated && (f.tints || f.shades)) {
      f.steps = generateSteps(f.value, { tints: f.tints, shades: f.shades }).map(({ name, value }) => ({ name, value }));
      changed(win);
    }
  },
  onToggle: (key, kind, on) => {
    const f = findColor(key);

    if (f) {
      f[kind] = on ? f[kind] || 3 : 0;
      remake(f);
      changed(win);
    }
  },
  onCount: (key, kind, n) => {
    const f = findColor(key);

    if (f) {
      f[kind] = Math.max(0, Math.min(MAX_VARIANTS, n));
      remake(f);
      changed(win);
    }
  },
  onStep: (key, name, value) => {
    const f = findColor(key);
    const step = f?.steps.find((s) => s.name === name);

    if (step && !f.generated && isHex(value)) {
      step.value = String(value).toLowerCase();
      changed(win);
    }
  },
  onRemoveColor: (key) => {
    const f = findColor(key);
    const remove = () => {
      ui.families = ui.families.filter((o) => o !== f);
    };

    if (!f || isCoreColor(f.name)) {
      return;
    }

    if (f.fresh) {
      remove();
      changed(win);

      return;
    }

    confirmRemove(win, t(win, 'theme_colors_remove_title', { name: f.name }), t(win, 'theme_colors_remove_body', { name: f.name }), remove);
  },

  // Spacing
  onAddSize: () => {
    const last = ui.sizes[ui.sizes.length - 1];
    const size = {
      key: `size-${++keySeq}`,
      name: nextSizeName(ui.sizes.map((s) => s.name)),
      value: '',
      min: last ? last.min : 16,
      max: last ? last.max : 16,
      fresh: true,
      problem: null,
    };

    ui.sizes.push(size);
    ui.selectedSize = size.key;
    changed(win);
  },
  onSizeName: (key, name) => {
    const size = findSize(key);

    if (size?.fresh) {
      size.name = `size-${String(name).trim().replace(/^size-/, '')}`;
      size.problem = sizeProblem(size, size.name);
      changed(win);
    }
  },
  onSize: (key, field, px) => {
    const size = findSize(key);
    const n = Number(px);

    if (size && (field === 'min' || field === 'max') && Number.isFinite(n) && n > 0) {
      size[field] = n;
      changed(win);
    }
  },
  onSelectSize: (key) => {
    ui.selectedSize = key;
  },
  onRemoveSize: (key) => {
    const size = findSize(key);
    const remove = () => {
      ui.sizes = ui.sizes.filter((s) => s !== size);
    };

    if (!size) {
      return;
    }

    if (size.fresh) {
      remove();
      changed(win);

      return;
    }

    confirmRemove(win, t(win, 'theme_spacing_remove_title', { name: size.name }), t(win, 'theme_spacing_remove_body'), remove);
  },
  onViewport: (px) => {
    const n = Math.round(Number(px));

    if (Number.isFinite(n) && n > MIN_VIEWPORT) {
      ui.maxViewport = n;
      changed(win);
    }
  },

  // Fonts: added at once, no Save — the dropdowns and the preview have them straight away.
  onAddFont: () => openFontDialog(win),

  // Typography and button
  onType: (name, value) => {
    if (TYPE_TOKENS.includes(name)) {
      ui.type[name] = value;
      changed(win);
    }
  },
  onButton: (name, value) => {
    if (BUTTON_TOKENS.includes(name)) {
      ui.button[name] = value;
      changed(win);
    }
  },

  // Utilities: the editor's text is the body; the preview follows it.
  onAddUtility: () => {
    const u = { key: `utility-${++keySeq}`, name: '', body: '', fresh: true, problem: 'empty' };

    ui.utilities.unshift(u);
    ui.openUtility = u.key;
    ui.dirty = true;
  },
  onOpenUtility: (key) => {
    ui.openUtility = ui.openUtility === key ? '' : key;
  },
  onUtilityName: (key, name) => {
    const u = findUtility(key);

    if (u?.fresh) {
      u.name = String(name).trim();
      u.problem = utilityProblem(u);
      utilityChanged(win);
    }
  },
  onUtilityBody: (key, body) => {
    const u = findUtility(key);

    if (u) {
      u.body = String(body);
      u.problem = utilityProblem(u);
      utilityChanged(win);
    }
  },
  onRemoveUtility: (key) => {
    const u = findUtility(key);
    const remove = () => {
      ui.utilities = ui.utilities.filter((o) => o !== u);
      utilityChanged(win);
    };

    if (!u) {
      return;
    }

    if (u.fresh) {
      remove();

      return;
    }

    confirmRemove(win, t(win, 'theme_utilities_remove_title', { name: u.name }), t(win, 'theme_utilities_remove_body', { name: u.name }), remove);
  },
});

async function load(win) {
  const mine = ++loadSeq;

  ui.loading = true;
  ui.status = '';

  try {
    // The fonts are a list of their own; the theme loads without them.
    const [css] = await Promise.all([readFile(win), loadFonts(win).catch(() => false)]);

    if (mine !== loadSeq || !isThemePanelOpen(win.document)) {
      return;
    }

    remember(css);
    ui.buildNote = '';
    ui.fonts = fontFamilies(win);
  } catch {
    ui.status = t(win, 'theme_panel_error');
  } finally {
    ui.loading = false;
  }
}

/**
 * Write every tab into the file as it is on disk now, not as it was when the
 * panel opened: colors touch only color lines, tokens only the lines that
 * changed, so an edit made in the stylesheet editor meanwhile survives.
 */
export async function saveTheme(win) {
  if (ui.saving || !ui.dirty) {
    return true;
  }

  if (ui.families.some((f) => f.problem) || ui.sizes.some((s) => s.problem) || ui.utilities.some((u) => u.problem)) {
    const braces = ui.utilities.some((u) => u.problem === 'braces');

    ui.status = t(win, braces ? 'theme_utilities_braces' : 'theme_panel_fix_names');

    return false;
  }

  ui.saving = true;
  ui.status = t(win, 'theme_panel_saving');

  try {
    const changes = tokenChanges();
    const utilityEdits = utilityChanges();
    const css = writeUtilities(writeTokens(writeColors(await readFile(win), plainFamilies(ui.families)), changes), utilityEdits);

    await request(win, '/!/sve/site-css', {
      method: 'POST',
      body: JSON.stringify({ path: ENTRY, css }),
    });

    const { tab, openKey, selectedSize, openUtility } = ui;

    remember(css);
    Object.assign(ui, {
      tab,
      openKey: ui.families.some((f) => f.key === openKey) ? openKey : '',
      selectedSize,
      openUtility: ui.utilities.some((u) => u.key === openUtility) ? openUtility : '',
    });
    // The dock's Tailwind forgets the theme it kept, so the new colors, sizes
    // and fonts are classes it suggests and paints straight away.
    win.dispatchEvent(new CustomEvent('sve:site-css-saved', { detail: { path: ENTRY } }));

    // A utility is a rule in the built stylesheet, not a token on :root: the
    // page shows the saved one once the site's CSS is built again.
    if (Object.keys(utilityEdits).length) {
      Object.keys(utilityEdits).forEach((name) => unbuilt.add(name));
      await buildSiteCss(win);
    }

    ui.status = t(win, 'theme_panel_saved');
    win.setTimeout(() => {
      if (ui.status === t(win, 'theme_panel_saved')) {
        ui.status = '';
      }
    }, 1200);

    return true;
  } catch {
    ui.status = t(win, 'theme_panel_error');

    return false;
  } finally {
    ui.saving = false;
  }
}

export function themePanelAllowed(win) {
  return win.Statamic?.$config?.get?.('sveFeatures')?.site_css === true;
}

export function isThemePanelOpen(doc) {
  return !!doc?.getElementById(PANEL_ID);
}

/**
 * Take the panel down. `keep` (another tool took the sidebar with unsaved
 * changes): the edits stay in the store and painted, for the next open.
 * Otherwise what is saved stays painted — the page on screen was rendered
 * before the save and still carries the old values in its <head>.
 */
function teardown(win, { keep = false } = {}) {
  if (!keep) {
    paint(win, propertiesFor(readColors(ui.saved), Object.fromEntries(readTokens(ui.saved))));
    // Utilities as saved: what was only typed leaves the preview; what was
    // saved but not built yet stays drawn.
    ui.utilities = [...savedUtilities].map(([name, body]) => utilityUi(name, body));
    win.clearTimeout(utilityTimer);
    void drawUtilities(win);
  }

  if (onFrameLoad) {
    win.document.removeEventListener('load', onFrameLoad, true);
    onFrameLoad = null;
  }

  app?.unmount();
  app = null;

  if (!keep) {
    ui.families = [];
    ui.sizes = [];
    ui.openKey = '';
    ui.openUtility = '';
    ui.dirty = false;
  }

  ui.status = '';
  win.document.getElementById(PANEL_ID)?.remove();
  releaseRightShellIfEmpty(win);
  // The shell listens for this: the top-bar icon, the preview's inset.
  win.dispatchEvent(new CustomEvent('sve-right-dock-change', { detail: {} }));
}

/** True while the unsaved-changes question is on screen — a second close waits for it. */
let asking = false;

/**
 * Close. With unsaved changes, ask first — unless `force`: another tool is
 * taking the sidebar, and the changes are kept for the next open instead.
 * Safe to call twice (the sidebar's own close button and ours both do).
 */
export function closeThemePanel(win, { force = false } = {}) {
  if (!isThemePanelOpen(win.document) || asking) {
    return;
  }

  if (force || !ui.dirty) {
    teardown(win, { keep: force && ui.dirty });

    return;
  }

  asking = true;

  const overlay = openCpOverlay(win.document, ChoiceDialog, {
    title: t(win, 'theme_panel_unsaved_title'),
    body: t(win, 'theme_panel_unsaved_body'),
    buttons: [
      { value: 'discard', label: t(win, 'theme_panel_discard'), variant: 'muted' },
      { value: 'save', label: t(win, 'theme_panel_save'), variant: 'primary' },
    ],
    onPick: async (value) => {
      overlay.dismiss();

      try {
        if (value === 'save' && !(await saveTheme(win))) {
          return;
        }

        teardown(win);
      } finally {
        asking = false;
      }
    },
    onClose: () => {
      asking = false;
      overlay.dismiss();
    },
  });
}

/** Every `theme_*` string the panel shows, by key without the prefix. */
function labels(win) {
  const strings = win.Statamic?.$config?.get?.('sveStrings') || {};

  return Object.fromEntries(
    Object.keys(strings)
      .filter((key) => /^theme_(panel|colors|spacing|fonts|type|button|utilities)_/.test(key))
      .map((key) => [key.replace(/^theme_/, ''), t(win, key)])
  );
}

/**
 * Into the shared right sidebar, like every other tool: the others close
 * (pinned ones stay), the preview moves over for it, and the sidebar's own
 * pin and close sit in the panel's header.
 */
function openThemePanel(win) {
  const doc = win.document;
  const panel = doc.createElement('div');

  closeRightPanels(win, [PANEL_ID]);
  panel.id = PANEL_ID;
  panel.style.cssText = RIGHT_PANEL_FILL;
  ui.labels = labels(win);
  app = mountSurface(ThemePanelPane, panel, handlers(win));
  // Tells the shell (sve-right-dock-change): the top-bar icon lights, the preview moves over.
  showInRightShell(win, panel);

  // A preview that reloads (another edit, a size switched on) gets the
  // unsaved values back.
  onFrameLoad = (event) => {
    if (event.target?.tagName === 'IFRAME') {
      win.setTimeout(() => {
        paint(win);
        void drawUtilities(win);
      }, 0);
    }
  };
  doc.addEventListener('load', onFrameLoad, true);

  // Unsaved changes from before another tool took the sidebar: back as they were.
  if (ui.dirty && ui.saved) {
    ui.fonts = fontFamilies(win);
    paint(win);

    return;
  }

  void load(win);
}

export function toggleThemePanel(win) {
  if (!themePanelAllowed(win)) {
    return;
  }

  if (isThemePanelOpen(win.document)) {
    closeThemePanel(win);

    return;
  }

  openThemePanel(win);
}
