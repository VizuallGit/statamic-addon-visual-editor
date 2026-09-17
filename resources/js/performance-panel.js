/**
 * Settings toggle: `performance`
 * What the page weighs, in the right dock.
 *
 * A sibling of the accessibility panel, and deliberately built the same way: an
 * icon in the Live Preview top bar, one pane in the right sidebar, tabs that
 * are different questions asked of the same page — and not one byte of it
 * loaded until the icon is clicked.
 *
 * The one thing it does differently is where it looks. Every other panel reads
 * the Live Preview iframe; this one must not, because that document is not the
 * page a visitor gets. It carries the bridge, the editor's stylesheet, an
 * Alpine morph and content rendered from unsaved values — measure that and you
 * are measuring the editor. So the public address is loaded once more into a
 * frame of our own, read, and thrown away. See cp/perf/measure.js.
 *
 * Imports leftover helpers from cp.js. Does not get imported by cp.js.
 */
import { sve } from './cp-registry.js';
import { t } from './lib/i18n.js';
import { sveState } from './cp-state.js';
import { setHeaderTab, applyHeaderTab } from './cp.js';
import { mountPane, unmountPane } from './cp/mount-pane.js';
import { RIGHT_PANEL_FILL, releaseRightShellIfEmpty, showInRightShell } from './right-dock.js';
import PerfPane from './cp/surfaces/PerfPane.vue';
import { perfUi, perfRows, psiUi } from './cp/perf/store.js';
import { measurePage } from './cp/perf/measure.js';
import {
  KINDS,
  barsOf,
  fileRow,
  formatMs,
  gradeOf,
  imageRow,
  metricsOf,
  notesOf,
  scoreOf,
  weighKinds,
} from './cp/perf/report.js';
import paneCss from '../css/perf.css?inline';
import { previewFrame } from './lib/preview-frame.js';
import { injectStyle } from './lib/style.js';
import { featureOn } from './lib/config.js';
import { PERF_PANEL_ID } from './lib/ids.js';
import { persistDockedPanel } from './lp-panel.js';
import { closeRightPanels, syncPreviewInset } from './section-library.js';


const STYLE_ID = '__sve-perf-style';
const TABS = ['summary', 'images', 'files'];

/** The Google tab, when this site has it switched on. */
const PSI_TAB = 'psi';
const STRATEGIES = ['mobile', 'desktop'];

/**
 * Chrome's field metrics, under names a person can read.
 *
 * The percentile arrives in the unit Google reports it in — milliseconds for
 * the three timings, hundredths for the layout-shift score — so each says how
 * to render itself rather than leaving a stray divide-by-100 in the template.
 */
const FIELD_METRICS = {
  LARGEST_CONTENTFUL_PAINT_MS: { key: 'lcp', unit: 'ms' },
  INTERACTION_TO_NEXT_PAINT: { key: 'inp', unit: 'ms' },
  CUMULATIVE_LAYOUT_SHIFT_SCORE: { key: 'cls', unit: 'score' },
  FIRST_CONTENTFUL_PAINT_MS: { key: 'fcp', unit: 'ms' },
};

const FIELD_LEVELS = { FAST: 'pass', AVERAGE: 'warn', SLOW: 'fail' };

/** Worst first — a complete list is only useful if the faults are at the top. */
const LEVEL_ORDER = { fail: 0, warn: 1, pass: 2, info: 3 };

/** One reading at a time. A second click while measuring is not a second page. */
let running = false;
/** Whether the panel has read the page since it was opened. */
let measured = false;
let flashTimer = 0;

/**
 * The last answer per device, so switching between mobile and desktop is free.
 * Cleared with the panel — a result is about a page as it was when asked.
 */
let psiCache = new Map();
/** The request in flight, so closing the panel calls it off. */
let psiAbort = null;

function ensureStyle(win) {
  injectStyle(win.document, STYLE_ID, paneCss);
}

export function perfPanel(doc) {
  return doc.getElementById(PERF_PANEL_ID);
}

/**
 * The public address of the page on screen.
 *
 * Taken from where the preview iframe is pointing, because that is the entry's
 * own URL with a token on it — and the token, along with the editor's own
 * flags, is exactly what has to come off. What is left is the address a visitor
 * types.
 *
 * `sve_perf` goes on for two reasons: a fresh document every run rather than
 * one served from the back/forward cache, and a signal to the server that this
 * request is a measurement, so the front-end edit button that only signed-in
 * editors ever see is left out of the page being weighed.
 */
export function frontendUrl(win, { bust = true } = {}) {
  const iframe = previewFrame(win);

  if (!iframe) {
    return '';
  }

  let href = '';

  try {
    const inner = iframe.contentWindow?.location?.href;

    href = inner && inner !== 'about:blank' ? inner : '';
  } catch {
    href = '';
  }

  href = href || iframe.getAttribute('src') || '';

  if (!href) {
    return '';
  }

  let url;

  try {
    url = new URL(href, win.location.origin);
  } catch {
    return '';
  }

  // A preview-only route — a saved section, a global, a collection sample. Real
  // pages have real addresses; these have nothing a visitor could ask for, and
  // measuring one would be measuring a page that does not exist.
  if (url.pathname.includes('/!/')) {
    return '';
  }

  // Statamic builds the preview address as the entry's own URL plus `target`
  // and `token`; the editor adds its own `sve_` flags on top. All of it comes
  // off, and what is left is the address a visitor types.
  ['live-preview', 'token', 'target', 'statamic-preview'].forEach((key) =>
    url.searchParams.delete(key)
  );
  [...url.searchParams.keys()]
    .filter((key) => key.startsWith('sve_'))
    .forEach((key) => url.searchParams.delete(key));

  // Only our own measurement wants the cache-buster. Google must be sent the
  // address as it really is: a query string it has never seen is a page with no
  // field data and, on a static-cached site, a slower answer than a visitor
  // would ever get.
  if (bust) {
    url.searchParams.set('sve_perf', String(Date.now()));
  }

  return url.toString();
}

/** The same address without the cache-buster, which is ours and not the page's. */
function displayUrl(url) {
  try {
    const clean = new URL(url);

    clean.searchParams.delete('sve_perf');

    return clean.pathname + clean.search;
  } catch {
    return url;
  }
}

function sortRows(rows) {
  return rows.sort((a, b) => {
    const level = (LEVEL_ORDER[a.level] ?? 9) - (LEVEL_ORDER[b.level] ?? 9);

    return level || b.bytes - a.bytes;
  });
}

/** Turn one reading into everything the three tabs show. */
function render(win, raw) {
  const totals = weighKinds(raw);
  const score = scoreOf(raw, totals);
  const grade = gradeOf(score);

  perfUi.url = displayUrl(raw.url);
  perfUi.score = score;
  perfUi.grade = grade;
  perfUi.gradeLabel = t(win, `perf_grade_${grade}`);
  perfUi.metrics = metricsOf(win, raw, totals);
  perfUi.bars = barsOf(win, totals);
  perfUi.notes = notesOf(win, raw);

  const images = sortRows(
    raw.images.map((img, i) => ({ ...imageRow(win, img, i), bytes: img.bytes }))
  );
  const files = raw.resources
    .slice()
    .sort((a, b) => b.bytes - a.bytes)
    .map((res, i) => fileRow(win, res, i));

  perfRows.images = images;
  perfRows.files = files;
  perfRows.emptyImages = t(win, 'perf_images_empty');
  perfRows.emptyFiles = t(win, 'perf_files_empty');
  perfRows.groups = [
    { key: '', label: t(win, 'perf_group_all') },
    ...KINDS.filter((kind) => files.some((row) => row.kind === kind)).map((kind) => ({
      key: kind,
      label: t(win, `perf_kind_${kind}`),
    })),
  ];

  if (perfRows.picked && !perfRows.groups.some((chip) => chip.key === perfRows.picked)) {
    perfRows.picked = '';
  }

  perfUi.found.images = images.filter((row) => row.level === 'fail' || row.level === 'warn').length;
  perfUi.found.files = files.length;
  perfUi.state = 'done';
}

/** Load the page, read it, draw it. The frame is gone before any of this shows. */
export async function measureNow(win) {
  if (running) {
    return;
  }

  const url = frontendUrl(win);

  if (!url) {
    perfUi.state = 'error';
    perfUi.message = t(win, 'perf_no_url');

    return;
  }

  running = true;
  measured = true;
  perfUi.state = 'running';
  perfUi.message = t(win, 'perf_running');

  try {
    const raw = await measurePage(win, url);

    // The address exists, the page behind it does not — an unpublished entry,
    // or one whose route has changed. Measuring the error page and calling it
    // the page's weight would be the one wrong answer worth guarding against.
    if (raw.status >= 400) {
      perfUi.state = 'error';
      perfUi.message = t(win, 'perf_not_public', { status: raw.status });

      return;
    }

    render(win, raw);
  } catch (err) {
    perfUi.state = 'error';
    perfUi.message = t(win, err?.message === 'timeout' ? 'perf_timeout' : 'perf_failed');
    console.error('[sve] measure page', err);
  } finally {
    running = false;
  }
}

/**
 * Show where an image sits on the page.
 *
 * The measured document is long gone, so this matches by URL against the
 * preview that is still on screen. A file used in two places lands on the first
 * one, which is the honest answer to "show me this image" — the weight is the
 * file's, not the placement's.
 */
function flashInPreview(win, url) {
  const iframe = previewFrame(win);
  let doc = null;

  try {
    doc = iframe?.contentDocument || null;
  } catch {
    doc = null;
  }

  if (!doc) {
    return;
  }

  const name = url.split('/').pop().split('?')[0];
  const target = [...doc.querySelectorAll('img')].find((img) => {
    const src = img.currentSrc || img.src || '';

    return src === url || src.includes(name);
  });

  if (!target) {
    return;
  }

  target.scrollIntoView({ behavior: 'smooth', block: 'center' });

  const before = target.style.outline;

  target.style.outline = '3px solid #4530d8';
  win.clearTimeout(flashTimer);
  flashTimer = win.setTimeout(() => {
    target.style.outline = before;
  }, 1400);
}

function psiGrade(score) {
  if (score === null) {
    return 'info';
  }

  return score >= 90 ? 'good' : score >= 50 ? 'ok' : 'poor';
}

function fieldRows(win, field) {
  return field
    .map((metric) => {
      const meta = FIELD_METRICS[metric.key];

      if (!meta) {
        return null;
      }

      return {
        key: metric.key,
        label: t(win, `perf_field_${meta.key}`),
        value:
          meta.unit === 'ms'
            ? formatMs(metric.percentile)
            : (metric.percentile / 100).toLocaleString(undefined, { maximumFractionDigits: 2 }),
        level: FIELD_LEVELS[metric.category] || 'info',
      };
    })
    .filter(Boolean);
}

function paintPsi(win, data) {
  psiUi.score = data.score ?? null;
  psiUi.grade = psiGrade(data.score ?? null);
  psiUi.gradeLabel = t(win, `perf_grade_${psiUi.grade === 'info' ? 'ok' : psiUi.grade}`);
  psiUi.cached = !!data.cached;
  psiUi.lab = (data.lab || []).map((row) => ({ ...row }));
  psiUi.field = fieldRows(win, data.field || []);
  psiUi.fieldTitle = t(win, 'perf_psi_field');
  psiUi.fieldNote = data.field_is_origin ? t(win, 'perf_psi_field_origin') : '';
  psiUi.fieldEmpty = t(win, 'perf_psi_field_empty');
  psiUi.opportunitiesTitle = t(win, 'perf_psi_opportunities');
  psiUi.opportunities = (data.opportunities || []).map((row) => ({
    ...row,
    time: formatMs(row.savings),
    help: row.value || t(win, 'perf_psi_saving', { time: formatMs(row.savings) }),
  }));
  psiUi.state = 'done';
}

/**
 * Ask this site to ask Google.
 *
 * Never called on its own: it takes half a minute, it leaves the building, and
 * it is only ever wanted by someone looking at the tab. The request is held so
 * that closing the panel calls it off rather than leaving a fetch running for a
 * panel that is gone.
 */
export async function runPsi(win, { fresh = false } = {}) {
  const strategy = psiUi.strategy;
  const url = frontendUrl(win, { bust: false });

  if (!url) {
    psiUi.state = 'error';
    psiUi.message = t(win, 'perf_no_url');

    return;
  }

  if (!fresh && psiCache.has(strategy)) {
    paintPsi(win, psiCache.get(strategy));

    return;
  }

  psiAbort?.abort();
  psiAbort = new win.AbortController();

  psiUi.state = 'running';
  psiUi.message = t(win, 'perf_psi_running');

  const query = new URLSearchParams({ url, strategy });

  if (fresh) {
    query.set('fresh', '1');
  }

  try {
    const res = await win.fetch(`/!/sve/pagespeed?${query}`, {
      credentials: 'same-origin',
      headers: { Accept: 'application/json' },
      signal: psiAbort.signal,
    });

    if (!res.ok) {
      throw new Error(String(res.status));
    }

    const data = await res.json();

    // The address is not one Google can reach. Said plainly rather than passed
    // on as a Lighthouse error, which reads like a fault in the page.
    if (data.reason === 'local') {
      psiUi.state = 'local';
      psiUi.message = t(win, 'perf_psi_local');

      return;
    }

    if (!data.ok) {
      psiUi.state = 'error';
      psiUi.message = data.needs_key
        ? `${data.message}\n\n${t(win, 'perf_psi_needs_key')}`
        : data.message || t(win, 'perf_psi_failed');

      return;
    }

    psiCache.set(strategy, data);
    paintPsi(win, data);
  } catch (err) {
    if (err?.name === 'AbortError') {
      return;
    }

    psiUi.state = 'error';
    psiUi.message = t(win, 'perf_psi_failed');
    console.error('[sve] pagespeed', err);
  } finally {
    psiAbort = null;
  }
}

function psiOn(win) {
  return !!featureOn(win, 'psi');
}

function bindPsiStore(win) {
  psiUi.hint = t(win, 'perf_psi_hint');
  psiUi.runLabel = t(win, 'perf_psi_run');
  psiUi.strategies = STRATEGIES.map((key) => ({ key, label: t(win, `perf_psi_${key}`) }));
  psiUi.onStrategy = (key) => {
    if (!STRATEGIES.includes(key) || psiUi.strategy === key) {
      return;
    }

    psiUi.strategy = key;
    void runPsi(win);
  };
  psiUi.onRun = () => void runPsi(win, { fresh: true });
}

function bindStore(win) {
  const tabs = psiOn(win) ? [...TABS, PSI_TAB] : TABS;

  perfUi.tabs = tabs.map((key) => ({ key, label: t(win, `perf_tab_${key}`) }));
  perfUi.onTab = (key) => {
    if (!tabs.includes(key)) {
      return;
    }

    perfUi.tab = key;

    // Google is asked when you go and look, and not a moment before: the run
    // takes half a minute and leaves the building, so it waits for the one
    // click that says it is wanted.
    if (key === PSI_TAB && psiUi.state === 'idle') {
      void runPsi(win);
    }
  };

  if (psiOn(win)) {
    bindPsiStore(win);
  }
  perfUi.hint = t(win, 'perf_hint');
  perfUi.runLabel = t(win, 'perf_run');
  perfUi.onRun = () => void measureNow(win);
  perfRows.onGroup = (key) => {
    perfRows.picked = perfRows.picked === key ? '' : key;
  };
  perfRows.onJump = (row) => {
    perfRows.active = row.key;

    if (row.key.startsWith('img-')) {
      flashInPreview(win, row.url);

      return;
    }

    win.open(row.url, '_blank', 'noopener');
  };
}

export function fillPerfPane(win, pane) {
  if (pane.querySelector('.sve-perf')) {
    return;
  }

  ensureStyle(win);
  bindStore(win);
  pane.id = PERF_PANEL_ID;
  mountPane(pane, PerfPane, { title: t(win, 'performance'), withChrome: true });
  pane.querySelector('[data-sve-close]')?.addEventListener('click', () => closePerformancePanel(win));
}

/** Opened, or brought back to the front: read the page unless we already have. */
export function showPerfPane(win) {
  if (!measured) {
    void measureNow(win);
  }
}

export function closePerformancePanel(win) {
  const panel = perfPanel(win.document);

  measured = false;
  perfUi.state = 'idle';
  perfUi.tab = 'summary';
  perfRows.images = [];
  perfRows.files = [];
  psiAbort?.abort();
  psiAbort = null;
  psiCache = new Map();
  psiUi.state = 'idle';
  psiUi.lab = [];
  psiUi.field = [];
  psiUi.opportunities = [];
  perfUi.found.images = 0;
  perfUi.found.files = 0;

  if (panel) {
    unmountPane(panel);
    panel.remove();
  }

  if (sveState.headerTab === 'performance') {
    setHeaderTab(win, null);
  }

  releaseRightShellIfEmpty(win);
  persistDockedPanel(win);
  applyHeaderTab(win);
  syncPreviewInset(win);
}

/** Opens the panel, or closes it when it is already up. */
export function togglePerformancePanel(win) {
  const doc = win.document;

  if (!featureOn(win, 'performance')) {
    return;
  }

  if (perfPanel(doc)) {
    closePerformancePanel(win);

    return;
  }

  closeRightPanels(win, [PERF_PANEL_ID]);
  ensureStyle(win);
  bindStore(win);

  const panel = doc.createElement('div');

  panel.id = PERF_PANEL_ID;
  panel.style.cssText = RIGHT_PANEL_FILL;
  mountPane(panel, PerfPane, { title: t(win, 'performance'), withChrome: true });

  // Into the sidebar first, then dressed — the same order the outline panel
  // uses, and for the same reason: a line that throws while wiring the close
  // button must not be able to take the whole panel with it.
  showInRightShell(win, panel);
  panel.querySelector('[data-sve-close]')?.addEventListener('click', () => closePerformancePanel(win));
  persistDockedPanel(win);
  applyHeaderTab(win);
  syncPreviewInset(win);

  void measureNow(win);
}
sve.togglePerformancePanel = togglePerformancePanel;
sve.closePerformancePanel = closePerformancePanel;
sve.fillPerfPane = fillPerfPane;
sve.showPerfPane = showPerfPane;
