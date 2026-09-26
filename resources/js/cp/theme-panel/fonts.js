/**
 * The Fonts tab's side of the server: what is installed (fonts.css read
 * back), and the three ways in. Every answer that changed something carries
 * the new listing, which lands in the panel's store at once — the Typography
 * dropdowns offer a new font without a reload, and the preview gets the new
 * fonts.css.
 *
 * In the Control Panel an installed family is drawn under an alias
 * (`sve-font-<slug>`), so a site font named like one of the CP's own never
 * changes how the CP looks.
 */
import { csrfToken } from '../../lib/csrf.js';
import { themePanelUi as ui } from './store.js';
import { familyAlias } from './font-helpers.js';

const BASE = '/!/sve/fonts';

/** `{ ok, status, data }` — `data.error` names what went wrong when the server says. */
export async function fontsRequest(win, path = '', { method = 'GET', json, form, query } = {}) {
  const params = query ? `?${new URLSearchParams(query)}` : '';

  try {
    const res = await win.fetch(`${BASE}${path}${params}`, {
      method,
      credentials: 'same-origin',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRF-TOKEN': csrfToken(win),
        Accept: 'application/json',
        ...(json ? { 'Content-Type': 'application/json' } : {}),
      },
      body: json ? JSON.stringify(json) : form,
    });
    const data = await res.json().catch(() => ({}));

    return { ok: res.ok, status: res.status, data };
  } catch {
    return { ok: false, status: 0, data: { error: 'offline' } };
  }
}

/** The families the Typography dropdowns offer from fonts.css: installed files and the kits' families. */
export function installedNames() {
  return [...ui.installed.map((f) => f.name), ...ui.kits.flatMap((k) => k.families)];
}

export function installedFamily(name) {
  const key = String(name).toLowerCase();

  return ui.installed.find((f) => f.name.toLowerCase() === key) || null;
}

const registered = new WeakMap();

/** Each installed face under its alias in the CP document, once; kits as their stylesheet. */
function drawInCp(win) {
  const doc = win.document;
  const seen = registered.get(doc) || new Set();

  registered.set(doc, seen);

  for (const family of ui.installed) {
    for (const face of family.faces) {
      const key = `${family.name}|${face.url}|${face.weight}|${face.style}`;

      if (face.missing || seen.has(key) || typeof win.FontFace !== 'function') {
        continue;
      }

      seen.add(key);

      try {
        const descriptors = { weight: face.weight, style: face.style, display: 'swap' };

        if (face.unicodeRange) {
          descriptors.unicodeRange = face.unicodeRange;
        }

        doc.fonts.add(new win.FontFace(familyAlias(family.name), `url("${face.url}")`, descriptors));
      } catch {
        // A descriptor the browser refuses: the row keeps the CP's own font.
      }
    }
  }

  for (const kit of ui.kits) {
    if (!seen.has(kit.url)) {
      seen.add(kit.url);

      const link = doc.createElement('link');

      link.rel = 'stylesheet';
      link.href = kit.url;
      link.dataset.sveFontKit = '';
      doc.head.appendChild(link);
    }
  }
}

export function applyListing(win, listing) {
  ui.installed = Array.isArray(listing?.families) ? listing.families : [];
  ui.kits = Array.isArray(listing?.kits) ? listing.kits : [];
  ui.fontsWritable = listing?.writable !== false;
  ui.fontsStylesheet = listing?.stylesheet || '/fonts/fonts.css';
  drawInCp(win);
}

export async function loadFonts(win) {
  const { ok, data } = await fontsRequest(win);

  if (ok) {
    applyListing(win, data);
  }

  return ok;
}

/**
 * The page documents fetch fonts.css again: the `<link>` the site's
 * `{{ theme_tokens }}` wrote is swapped for a fresh one (the old goes once the
 * new has loaded, so nothing flickers); a page rendered before the file
 * existed gets one.
 */
export function refreshPageFonts(docs) {
  const href = `${ui.fontsStylesheet}?v=${Date.now()}`;

  for (const doc of docs) {
    const old = [...doc.querySelectorAll('link[rel="stylesheet"]')].find((l) => (l.getAttribute('href') || '').split('?')[0].endsWith(ui.fontsStylesheet));
    const link = doc.createElement('link');

    link.rel = 'stylesheet';
    link.href = href;

    if (old) {
      link.addEventListener('load', () => old.remove(), { once: true });
      old.after(link);
    } else {
      doc.head?.appendChild(link);
    }
  }
}

const ERRORS = {
  google_unreachable: 'fonts_error_google',
  not_writable: 'fonts_error_writable',
  install_failed: 'fonts_error_install',
  not_a_font: 'fonts_error_not_font',
  kit_url: 'fonts_error_kit_url',
  kit_empty: 'fonts_error_kit_empty',
};

/** What the server's `error` means, in the editor's language. */
export function errorText(code) {
  return ui.labels[ERRORS[code]] || ui.labels.fonts_error || String(code);
}

/** `1 file`, `4 files`. */
export function filesText(count) {
  return count === 1 ? ui.labels.fonts_file_one : String(ui.labels.fonts_files || ':count').replace(':count', count);
}
