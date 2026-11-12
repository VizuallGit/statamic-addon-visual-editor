/**
 * Is the surface under an element dark? For the editor's own controls drawn
 * over the page (the + inserters, the hover toolbar), which go light on a
 * really dark background. Text and outline contrast are the bridge's.
 *
 * Moved verbatim (var → let) from side/inserter-reveal.js and
 * side/toolbar-look.js, which each had a copy (quality pass C2).
 *
 * May import: nothing.
 */

/** `#abc`, `#aabbcc`, `rgb()` or `rgba()` → { r, g, b, a }, or null. */
function parseRgb(value) {
  let m;
  let h;

  if (!value || typeof value !== 'string') {
    return null;
  }

  m = value.trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);

  if (m) {
    h = m[1];

    if (h.length === 3) {
      h = h.charAt(0) + h.charAt(0) + h.charAt(1) + h.charAt(1) + h.charAt(2) + h.charAt(2);
    }

    return {
      r: parseInt(h.slice(0, 2), 16),
      g: parseInt(h.slice(2, 4), 16),
      b: parseInt(h.slice(4, 6), 16),
      a: 1,
    };
  }

  m = value.match(/rgba?\(\s*([\d.]+)\s*[, ]\s*([\d.]+)\s*[, ]\s*([\d.]+)(?:\s*[,/]\s*([\d.]+%?))?/i);

  if (!m) {
    return null;
  }

  return {
    r: Number(m[1]),
    g: Number(m[2]),
    b: Number(m[3]),
    a: m[4] == null ? 1 : m[4].indexOf('%') !== -1 ? parseFloat(m[4]) / 100 : Number(m[4]),
  };
}

/**
 * The first ancestor (up to 16) with a mostly opaque background decides; the
 * body and the root never count. Dark means a luminance under 0.3 (≈ 70 % dark).
 */
export function surfaceIsDark(win, el) {
  let node = el;
  let i;
  let cs;
  let parsed;
  let lum;

  for (i = 0; node && i < 16; i++) {
    cs = win.getComputedStyle(node);
    parsed = parseRgb(cs.backgroundColor);

    if (parsed && parsed.a >= 0.4) {
      if (node === win.document.body || node === win.document.documentElement) {
        break;
      }

      lum = (0.2126 * parsed.r + 0.7152 * parsed.g + 0.0722 * parsed.b) / 255;

      return lum < 0.3;
    }

    node = node.parentElement;
  }

  return false;
}
