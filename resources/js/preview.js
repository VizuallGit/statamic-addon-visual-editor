import morphPlugin from '@alpinejs/morph';

/**
 * Live Preview: hot reload via Alpine.morph
 *
 * Injected on live preview responses via InjectBridgeScript (same mechanism
 * as bridge.js), so sites get hot reload automatically — no partial needed.
 * Morph ships in this file; the site front end does not register it.
 *
 * While header/footer chrome is focused, we morph ONLY that chrome node and
 * soft-diff <head> styles. Fade itself is a fixed html overlay (bridge CSS) —
 * not opacity on main — so body morphs can never flash focus open/closed.
 *
 * chromeKind is also pushed from the CP on `sve.globals` so we don't depend
 * solely on the html class surviving every race.
 */

const STYLE_ID = '__sve-preview-styles';
const THEME_SCALE_STYLE_ID = '__sve-theme-scale';
const CHROME_ATTR = 'data-sve-chrome';

function injectPreviewStyles(doc) {
  if (doc.getElementById(STYLE_ID)) {
    return;
  }

  const style = doc.createElement('style');

  style.id = STYLE_ID;
  style.textContent = `
    /* Smooth scroll breaks scroll restoration when the preview morphs/refreshes */
    html { scroll-behavior: auto !important; }
  `;
  doc.head.appendChild(style);
}

injectPreviewStyles(document);

function ensureAlpineMorph() {
  const Alpine = window.Alpine;

  if (!Alpine || typeof Alpine.morph === 'function') {
    return;
  }

  Alpine.plugin(morphPlugin);
}

ensureAlpineMorph();

/** Last live theme scale from CP — re-applied after morph so server :root can't win. */
let lastThemeScaleCss = '';

/**
 * Apply live --primary-* from Theme Settings (lys/sat) without waiting for a
 * full preview morph. Kept at end of <head> so it beats layout_style_push.
 */
/**
 * Apply live --primary-* from Theme Settings (lys/sat). Kept at end of <head>
 * so it beats layout_style_push after morph.
 */
function applyThemeScaleCss(css) {
  if (css) {
    lastThemeScaleCss = css;
  }

  let el = document.getElementById(THEME_SCALE_STYLE_ID);

  // Color-scheme may have written the style directly — after morph it must
  // still sit last in <head>, or the server :root wins.
  if (!lastThemeScaleCss) {
    if (el) {
      document.head.appendChild(el);
    }

    return;
  }

  if (!el) {
    el = document.createElement('style');
    el.id = THEME_SCALE_STYLE_ID;
  }

  el.textContent = `:root{${lastThemeScaleCss}}`;
  document.head.appendChild(el);
}

let updateSeq = 0;
let pendingUrl = null;

// True while a global set is open beside the preview. Renders then have to ask
// for the unsaved globals — otherwise the server uses what's on disk and the
// change you just typed vanishes on the next refresh. Deliberately opt-in per
// render: a stale override must never silently alter an ordinary preview.
let globalsActive = false;

// True while a global (synced) section is open in the side panel — same story:
// the page's own form holds only a reference, so without asking for the unsaved
// section the render falls back to what's on disk.
let sectionsActive = false;

/** CP-authoritative chrome focus (header|footer|null). Beats racing html class. */
let chromeKindFromParent = null;

function withFlags(url) {
  let out = url;

  if (globalsActive) {
    out += (out.includes('?') ? '&' : '?') + 'sve_globals=1';
  }

  if (sectionsActive) {
    out += (out.includes('?') ? '&' : '?') + 'sve_sections=1';
  }

  return out;
}

function editingActive() {
  return !!window.__sveInlineEdit?.active;
}

function normalizeChromeKind(kind) {
  return kind === 'footer' || kind === 'header' ? kind : null;
}

/** Prefer CP message; fall back to html class from bridge. */
function focusedChromeKind() {
  const fromParent = normalizeChromeKind(chromeKindFromParent);

  if (fromParent) {
    return fromParent;
  }

  const root = document.documentElement;

  if (root.classList.contains('sve-chrome-focus-footer')) {
    return 'footer';
  }

  if (root.classList.contains('sve-chrome-focus-header')) {
    return 'header';
  }

  return null;
}

function isPreservedStyle(el) {
  const id = el.id || '';

  return id === STYLE_ID || id.startsWith('__sve-');
}

/**
 * Diff head styles in place. Never wipe-then-readd — that FOUC'd the page every
 * keystroke even when only the footer chrome node changed.
 */
function syncHeadStyles(updated) {
  const live = [...document.head.querySelectorAll('style')].filter((s) => !isPreservedStyle(s));
  const next = [...updated.head.querySelectorAll('style')];
  const nextTexts = next.map((s) => s.textContent);

  live.forEach((s) => {
    if (!nextTexts.includes(s.textContent)) {
      s.remove();
    }
  });

  const remaining = new Set(
    [...document.head.querySelectorAll('style')].filter((s) => !isPreservedStyle(s)).map((s) => s.textContent)
  );

  next.forEach((s) => {
    if (!remaining.has(s.textContent)) {
      document.head.appendChild(s.cloneNode(true));
      remaining.add(s.textContent);
    }
  });
}

/**
 * Morph only the focused chrome node. Use outerHTML (same-document parse) —
 * passing a node from DOMParser's other document is unreliable with Alpine.morph.
 */
function morphChromeOnly(updated, kind) {
  ensureAlpineMorph();

  const live = document.querySelector(`[${CHROME_ATTR}="${kind}"]`);
  const next = updated.body.querySelector(`[${CHROME_ATTR}="${kind}"]`);

  if (!live || !next) {
    return false;
  }

  try {
    if (window.Alpine?.morph) {
      window.Alpine.morph(live, next.outerHTML);
    } else {
      live.replaceWith(document.importNode(next, true));
    }
  } catch (e) {
    return false;
  }

  // Re-assert focus class after morph (belt + suspenders with overlay CSS).
  document.documentElement.classList.add(
    kind === 'footer' ? 'sve-chrome-focus-footer' : 'sve-chrome-focus-header'
  );
  document.documentElement.classList.remove(
    kind === 'footer' ? 'sve-chrome-focus-header' : 'sve-chrome-focus-footer',
    'sve-chrome-focus'
  );

  return true;
}

function morphFullBody(updated) {
  ensureAlpineMorph();

  try {
    if (window.Alpine?.morph) {
      // Alpine.morph(el, htmlString) uses createElement() → firstElementChild
      // only. Passing body.innerHTML therefore morphs <body> against <header>
      // (the first child), swaps the whole body for the header, and blanks
      // main/footer until a full iframe reload. Build a same-document <body>
      // stand-in so patch runs body→body and updates all children.
      const to = document.createElement('body');

      for (const attr of updated.body.attributes) {
        to.setAttribute(attr.name, attr.value);
      }

      to.innerHTML = updated.body.innerHTML;
      window.Alpine.morph(document.body, to);
    } else {
      document.body.innerHTML = updated.body.innerHTML;
    }
  } catch (e) {
    document.body.innerHTML = updated.body.innerHTML;
  }

  // Full body morph can drop html classes in some Alpine versions — restore.
  const kind = focusedChromeKind();

  if (kind) {
    document.documentElement.classList.add(
      kind === 'footer' ? 'sve-chrome-focus-footer' : 'sve-chrome-focus-header'
    );
  }
}

function leftLivePreview(requested, finalUrl) {
  try {
    const from = new URL(requested, window.location.origin);
    const to = new URL(finalUrl || requested, window.location.origin);
    const had = from.searchParams.has('token') || from.searchParams.has('live-preview');
    const has = to.searchParams.has('token') || to.searchParams.has('live-preview');

    if (had && !has) {
      return true;
    }

    if (to.pathname.includes('/!/sve/') && /preview/i.test(to.pathname)) {
      return true;
    }
  } catch {
    /* ignore */
  }

  return false;
}

async function applyUpdate(url) {
  if (!url) {
    return;
  }

  // Drop stale responses when rapid edits overtake each other.
  const seq = ++updateSeq;
  let text;

  try {
    const res = await fetch(withFlags(url), { credentials: 'same-origin' });

    if (!res.ok || leftLivePreview(url, res.url)) {
      return;
    }

    text = await res.text();
  } catch {
    return;
  }

  if (seq !== updateSeq) {
    return;
  }

  // An inline edit may have started while the fetch was in flight — defer.
  if (editingActive()) {
    pendingUrl = url;

    return;
  }

  const updated = new DOMParser().parseFromString(text, 'text/html');

  // Rediger lives on the public site, never in Live Preview. Morphing that
  // document in paints the front end into the iframe and looks like an eject.
  if (updated.getElementById('sve-edit-button')) {
    return;
  }

  const savedScrollY = window.scrollY;
  const chromeKind = focusedChromeKind();

  try {
    syncHeadStyles(updated);
    // Server HTML carries saved bias/sat in :root — put live scale back on top.
    applyThemeScaleCss();

    let surgical = false;

    if (chromeKind) {
      surgical = morphChromeOnly(updated, chromeKind);
    }

    if (!surgical) {
      morphFullBody(updated);
    }
  } catch {
    return;
  }

  window.dispatchEvent(new CustomEvent('statamic:preview-updated'));

  const restoreScroll = () => window.scrollTo({ top: savedScrollY, behavior: 'instant' });

  restoreScroll();
  requestAnimationFrame(restoreScroll);
}

window.addEventListener('message', (event) => {
  if (event.data?.source === 'statamic-visual-editor' && event.data.type === 'sve-theme-scale') {
    applyThemeScaleCss(event.data.css || '');

    return;
  }

  if (event.data?.name === 'sve.globals') {
    globalsActive = !!event.data.active;
    chromeKindFromParent = event.data.active
      ? normalizeChromeKind(event.data.chromeKind)
      : null;

    if (event.data.url) {
      applyUpdate(event.data.url);
    }

    return;
  }

  if (event.data?.name === 'sve.sections') {
    sectionsActive = !!event.data.active;

    if (event.data.url) {
      applyUpdate(event.data.url);
    }

    return;
  }

  if (event.data?.name !== 'statamic.preview.updated') {
    return;
  }

  if (editingActive()) {
    pendingUrl = event.data.url;

    return;
  }

  applyUpdate(event.data.url);
});

window.addEventListener('sve:clear-pending-preview', () => {
  pendingUrl = null;
});

window.addEventListener('sve:inline-edit-end', () => {
  if (pendingUrl) {
    const url = pendingUrl;

    pendingUrl = null;
    applyUpdate(url);
  }
});
