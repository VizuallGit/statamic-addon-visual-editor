/**
 * Google Fonts in the "Add font" dialog: the catalog (from the server, which
 * keeps Google's list for a week) and the previews.
 *
 * A preview is only paint: the browser asks Google's CSS API for exactly the
 * characters on screen (`text=`), a kilobyte or two per family, and draws
 * them under an alias (`sve-gf-<slug>`). What gets installed is decided by
 * the server from the same catalog — this file never writes anything.
 */
import { fontsRequest } from './fonts.js';
import { isItalic, previewAlias, weightOf } from './font-helpers.js';

const CSS = 'https://fonts.googleapis.com/css2';

let catalog = null;

/** `{ fonts }` or `{ error }`; the list is fetched once per CP session. */
export async function loadCatalog(win) {
  if (catalog) {
    return { fonts: catalog };
  }

  const { ok, data } = await fontsRequest(win, '/google');

  if (!ok || !Array.isArray(data.fonts)) {
    return { error: data.error || 'google_unreachable' };
  }

  catalog = data.fonts;

  return { fonts: catalog };
}

/** css2's `family=` for a preview: each variant's weight and style, as they are. */
function familyParam(font, variants) {
  const italic = variants.some(isItalic);
  const tuples = variants
    .map((v) => [isItalic(v) ? 1 : 0, weightOf(v)])
    .sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const spec = italic
    ? `ital,wght@${tuples.map(([i, w]) => `${i},${w}`).join(';')}`
    : `wght@${tuples.map(([, w]) => w).join(';')}`;

  return `${font.family.replace(/ /g, '+')}:${spec}`;
}

const loaded = new Map();

/**
 * Draw `variants` of a family for `text`, under its alias; resolves true
 * when the faces are ready. Asked once per family, variants and letters.
 */
export function loadPreview(win, font, variants, text) {
  const chars = [...new Set(text)].sort().join('');
  const key = `${font.family}|${variants.join(',')}|${chars}`;

  if (!loaded.has(key)) {
    loaded.set(key, drawPreview(win, font, variants, chars).catch(() => {
      loaded.delete(key);

      return false;
    }));
  }

  return loaded.get(key);
}

async function drawPreview(win, font, variants, chars) {
  const url = `${CSS}?family=${familyParam(font, variants)}&text=${encodeURIComponent(chars)}&display=swap`;
  const res = await win.fetch(url);

  if (!res.ok) {
    return false;
  }

  const css = await res.text();
  const faces = [];

  for (const [, body] of css.matchAll(/@font-face\s*\{([^}]*)\}/g)) {
    const src = /src:\s*url\(([^)]+)\)/.exec(body)?.[1];

    if (!src) {
      continue;
    }

    const descriptors = {
      weight: /font-weight:\s*([^;]+);/.exec(body)?.[1]?.trim() || '400',
      style: /font-style:\s*([^;]+);/.exec(body)?.[1]?.trim() || 'normal',
    };
    const range = /unicode-range:\s*([^;]+);/.exec(body)?.[1]?.trim();

    if (range) {
      descriptors.unicodeRange = range;
    }

    const face = new win.FontFace(previewAlias(font.family), `url(${src})`, descriptors);

    win.document.fonts.add(face);
    faces.push(face.load());
  }

  await Promise.all(faces);

  return faces.length > 0;
}
