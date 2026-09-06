/**
 * Contrast, measured on the rendered page.
 *
 * A pure reading of a document: hand it a `document` and it hands back what the
 * text on it costs a reader to make out. It imports nothing, writes nothing and
 * knows nothing about the Control Panel — which is what lets the same file run
 * later in a headless browser for a dashboard widget, over pages nobody has open.
 *
 * Only rendered text is measured, because only rendered text has a contrast. A
 * colour declared in a stylesheet is a value; a colour on the page is a value
 * over whatever happens to be behind it, and the page is the only place that is
 * known.
 */

/** The editor's own furniture. Injected under ids of ours, and never the page. */
export const CHROME_SELECTOR = '[id^="__sve"], [id^="sve-"], [data-sve-ui]';

/** Text this size (px) is judged by the easier threshold — WCAG's "large text". */
const LARGE_PX = 24;
const LARGE_BOLD_PX = 18.66;
const BOLD = 700;

/** AA is the line a page has to clear. AAA is the line worth aiming at. */
const AA_NORMAL = 4.5;
const AA_LARGE = 3;
const AAA_NORMAL = 7;
const AAA_LARGE = 4.5;

/** Below this a run of text is mid-animation or hidden, not something to judge. */
const MIN_OPACITY = 0.1;
/** A one-pixel box is a screen-reader-only label, not text anyone looks at. */
const MIN_BOX = 2;

const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE', 'SVG', 'IFRAME', 'CANVAS']);

/**
 * Where a run of text counts as being.
 *
 * A block in the page builder first, then whatever part of the page it sits in.
 * The unit matters because bold and italic are elements of their own: a
 * paragraph with four bold words is five elements holding text, all the same
 * colour on the same background, and marking each of them says one true thing
 * five times. One answer per place is the same answer, said once.
 */
const PLACE_SELECTOR = '[data-sid], header, footer, nav, main, section, article, aside';

/**
 * Colour strings as the browser hands them back.
 *
 * Tailwind v4 writes its palette in oklch, and a computed style keeps that space
 * rather than converting to rgb — so a hand-written rgb() parser reads a modern
 * site as unstyled black. The canvas already knows every colour space the browser
 * does, so it is asked instead of reimplemented. One pixel, one context, cached
 * per string: a page has thousands of elements but a handful of colours.
 *
 * The read is 8-bit and unpremultiplied, so a very translucent colour comes back
 * a shade off. It costs a hundredth of a ratio and never changes a verdict.
 */
function colorReader(doc) {
  const canvas = doc.createElement('canvas');

  canvas.width = 1;
  canvas.height = 1;

  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  const cache = new Map();

  return function read(value) {
    if (!value) {
      return null;
    }

    if (cache.has(value)) {
      return cache.get(value);
    }

    let out = null;

    try {
      ctx.clearRect(0, 0, 1, 1);
      ctx.fillStyle = value;
      ctx.fillRect(0, 0, 1, 1);

      const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;

      out = { r, g, b, a: a / 255 };
    } catch {
      out = null;
    }

    cache.set(value, out);

    return out;
  };
}

/** Lay one colour over another. Alpha is the top one's; the result is opaque. */
function over(top, bottom) {
  const a = top.a;

  return {
    r: top.r * a + bottom.r * (1 - a),
    g: top.g * a + bottom.g * (1 - a),
    b: top.b * a + bottom.b * (1 - a),
    a: 1,
  };
}

function channel(value) {
  const c = value / 255;

  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

/** WCAG relative luminance. */
export function luminance(color) {
  return 0.2126 * channel(color.r) + 0.7152 * channel(color.g) + 0.0722 * channel(color.b);
}

/** WCAG contrast ratio, 1 (identical) to 21 (black on white). */
export function contrastRatio(fg, bg) {
  const a = luminance(fg);
  const b = luminance(bg);

  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

export function toHex(color) {
  const part = (value) => Math.round(Math.min(255, Math.max(0, value))).toString(16).padStart(2, '0');

  return `#${part(color.r)}${part(color.g)}${part(color.b)}`;
}

/**
 * Colour tokens inside a computed gradient.
 *
 * A gradient is not automatically an unanswerable background. Half of them in a
 * Tailwind site run between two shades of the same colour, or are a flat scrim
 * laid over a photo — and refusing to measure those throws away the answer for
 * most headers on the web. What cannot be measured is a picture: `url()` has no
 * colours to read, and no amount of parsing will give it any.
 */
const COLOR_TOKEN =
  /#[0-9a-f]{3,8}\b|\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\([^()]*\)/gi;

function gradientStops(value, read) {
  if (value.includes('url(')) {
    return null;
  }

  const stops = [];

  for (const match of value.match(COLOR_TOKEN) || []) {
    const color = read(match);

    if (color) {
      stops.push(color);
    }
  }

  return stops;
}

/**
 * The stack of paint behind this text, nearest first.
 *
 * Each entry is one layer with one or more possible colours — one for a plain
 * background, several for a gradient, because a gradient is a different colour
 * at either end and text sitting on it meets all of them.
 */
const OVERLAY_POSITIONS = new Set(['absolute', 'fixed', 'sticky']);

function backdropLayers(el, view, read) {
  const layers = [];
  let node = el;
  let unknown = false;
  let opaque = false;
  let floating = false;

  while (node && node.nodeType === 1) {
    const style = view.getComputedStyle(node);
    const image = style.backgroundImage;
    let stops = null;

    if (OVERLAY_POSITIONS.has(style.position)) {
      floating = true;
    }

    if (image && image !== 'none') {
      stops = gradientStops(image, read);

      if (!stops) {
        unknown = true;
      } else if (stops.length) {
        // Above this node's own background colour, which is what it is painted on.
        layers.push(stops);
      }
    }

    const color = read(style.backgroundColor);

    if (color && color.a > 0) {
      layers.push([color]);

      if (color.a >= 0.999) {
        opaque = true;

        break;
      }
    }

    if (stops && stops.length && stops.every((stop) => stop.a >= 0.999)) {
      opaque = true;

      break;
    }

    node = node.parentElement;
  }

  // The limit every contrast checker meets, said out loud rather than guessed
  // past: a header lifted out of the flow sits over whatever it happens to
  // cover, and that is not its parent. Walking the ancestors finds the page
  // background and calls a translucent scrim over a photograph "white text on
  // white" — a fail invented out of the wrong element. Where nothing opaque was
  // found and the text is floating, the honest answer is that we can't see what
  // is under it.
  return { layers, unknown: unknown || (floating && !opaque) };
}

/** More than this many possible backdrops and the page is telling us it doesn't know. */
const MAX_BACKDROPS = 12;

/**
 * Lay the stack down, from the furthest layer forward, into every colour the
 * text could actually be sitting on. Nothing opaque anywhere up the chain means
 * the page ends at the canvas, which the browser paints white.
 */
function backdrops(layers) {
  let results = [{ r: 255, g: 255, b: 255, a: 1 }];

  for (let i = layers.length - 1; i >= 0; i -= 1) {
    const next = new Map();

    for (const base of results) {
      for (const color of layers[i]) {
        const composed = over(color, base);

        next.set(toHex(composed), composed);
      }
    }

    results = [...next.values()];

    if (results.length > MAX_BACKDROPS) {
      return null;
    }
  }

  return results;
}

function placeOf(el) {
  return el.closest(PLACE_SELECTOR) || el.ownerDocument.body;
}

/** Does this element hold words of its own, rather than only other elements? */
function hasOwnText(el) {
  for (const node of el.childNodes) {
    if (node.nodeType === 3 && node.nodeValue.trim()) {
      return true;
    }
  }

  return false;
}

/** The words themselves, for the panel to show which run of text is meant. */
function ownText(el) {
  let out = '';

  for (const node of el.childNodes) {
    if (node.nodeType === 3) {
      out += node.nodeValue;
    }
  }

  return out.replace(/\s+/g, ' ').trim();
}

/**
 * Four answers, not two.
 *
 * `fail` is below AA and has to be fixed. `warn` clears AA but not AAA — legal,
 * and still hard work for anyone reading it in sunlight. `pass` clears both.
 * `unknown` is the one that matters most for a page builder: text on an image or
 * a gradient, where the ratio changes with the picture and no number is true.
 */
export function verdict(ratio, large) {
  if (ratio < (large ? AA_LARGE : AA_NORMAL)) {
    return 'fail';
  }

  if (ratio < (large ? AAA_LARGE : AAA_NORMAL)) {
    return 'warn';
  }

  return 'pass';
}

/**
 * Every run of text on the page, grouped by the colours it uses.
 *
 * Grouped because a page is repetition: forty cards in one type size on one
 * background are one decision, not forty problems, and a list that says so is
 * one a person can act on.
 *
 * Within a group, one element per place — see PLACE_SELECTOR. The count is
 * places rather than elements, because a paragraph and the bold words inside it
 * are one piece of text to a reader and one thing to change to an editor.
 *
 * @param {Document} doc
 * @returns {{key: string, ratio: number, level: string, large: boolean, fg: string,
 *   bg: string, unknown: boolean, spread: number, text: string, count: number,
 *   els: Element[]}[]}
 */
export function scanContrast(doc) {
  const view = doc.defaultView || window;
  const read = colorReader(doc);
  const groups = new Map();

  for (const el of doc.body.querySelectorAll('*')) {
    // Upper-cased: an <svg> inside an HTML document reports its tag in lower case.
    if (SKIP_TAGS.has(el.tagName.toUpperCase()) || !hasOwnText(el) || el.closest(CHROME_SELECTOR)) {
      continue;
    }

    const rect = el.getBoundingClientRect();

    if (rect.width < MIN_BOX || rect.height < MIN_BOX) {
      continue;
    }

    const style = view.getComputedStyle(el);

    if (style.visibility !== 'visible' || Number(style.opacity) < MIN_OPACITY) {
      continue;
    }

    const size = parseFloat(style.fontSize) || 16;
    const weight = parseInt(style.fontWeight, 10) || 400;
    const large = size >= LARGE_PX || (size >= LARGE_BOLD_PX && weight >= BOLD);

    // Text painted through its own background — a gradient headline. The letters
    // are the picture, and the colour property says nothing about them.
    const clipped =
      style.webkitTextFillColor === 'transparent' ||
      style.color === 'rgba(0, 0, 0, 0)' ||
      (style.webkitBackgroundClip || style.backgroundClip) === 'text';

    const fg = read(style.color);

    if (!fg) {
      continue;
    }

    const back = backdropLayers(el, view, read);
    const candidates = back.unknown || clipped ? null : backdrops(back.layers);

    // The worst place on the background is the one that decides. Text over a
    // gradient passes only where it passes everywhere along it — reporting the
    // kind end of a two-tone hero is how a page gets signed off unreadable.
    let worst = null;
    let best = 0;

    for (const bg of candidates || []) {
      const composed = over(fg, bg);
      const ratio = contrastRatio(composed, bg);

      if (!worst || ratio < worst.ratio) {
        worst = { ratio, bg, composed };
      }

      best = Math.max(best, ratio);
    }

    const unknown = !worst;
    const ratio = worst ? worst.ratio : 0;
    const level = unknown ? 'unknown' : verdict(ratio, large);
    const fgHex = worst ? toHex(worst.composed) : toHex(fg);
    const bgHex = worst ? toHex(worst.bg) : '';
    const spread = worst && best - ratio > 0.5 ? best : 0;
    const key = `${fgHex}|${bgHex}|${large ? 'L' : 'N'}|${level}`;

    const place = placeOf(el);
    const existing = groups.get(key);

    if (existing) {
      // Elements arrive in document order, so the first one seen in a place is
      // the outermost — the paragraph, not the bold word inside it.
      if (!existing.places.has(place)) {
        existing.places.set(place, el);
      }

      continue;
    }

    groups.set(key, {
      key,
      ratio,
      level,
      large,
      fg: fgHex,
      bg: bgHex,
      unknown,
      text: ownText(el).slice(0, 120),
      spread,
      places: new Map([[place, el]]),
    });
  }

  const rank = { fail: 0, unknown: 1, warn: 2, pass: 3 };

  return [...groups.values()]
    .map(({ places, ...group }) => ({
      ...group,
      count: places.size,
      els: [...places.values()],
    }))
    .sort((a, b) => rank[a.level] - rank[b.level] || a.ratio - b.ratio);
}

/** The tally above the list: how much of the page is in each state. */
export function contrastCounts(groups) {
  const counts = { fail: 0, warn: 0, pass: 0, unknown: 0 };

  groups.forEach((group) => {
    counts[group.level] += group.count;
  });

  return counts;
}
