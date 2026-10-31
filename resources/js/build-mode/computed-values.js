/**
 * What an element shows, for a Style field with no class of its own: the value
 * read off the element on the canvas, in the words the panel writes it in.
 *
 * Owner: Build mode (resources/js/build-mode/).
 * May import: nothing. Reads the canvas's document; writes nothing into the page.
 * Bus messages: none.
 *
 * The site's scale says the name: a value one of its classes gives reads as that
 * class's token (`100`, `base`, `primary`), asked of the browser on a parked
 * probe, so `clamp()` and `var()` are the browser's to work out at this width.
 * Anything else is rem, or a line height's ratio. A size always shows its pixels
 * on hover. The browser's own "nothing here" (`0px`, `none`, `auto`, `normal`)
 * leaves the field empty: a grey 0 in every field says nothing.
 *
 * Only properties that mean what they say are read: `width` and its kin give the
 * used size whatever was set, so a value there would claim a choice nobody made.
 */

/** Properties a field may show without a class. */
const READABLE = /^(font-family|font-size|font-weight|line-height|letter-spacing|color|background-color|border-color|border-radius|opacity|gap|row-gap|column-gap|text-indent|(padding|margin)(-(top|right|bottom|left|block|inline|block-start|block-end|inline-start|inline-end))?|border(-(top|right|bottom|left))?-width)$/;

/** Properties that pass from parent to child. */
const INHERITS = /^(font-|line-height|letter-spacing|color$|text-indent)/;

const NOTHING = new Set(['', '0px', 'none', 'auto', 'normal', 'rgba(0, 0, 0, 0)', 'transparent']);

const round = (n, places) => {
  const factor = 10 ** places;

  return Math.round(n * factor) / factor;
};

export const isReadable = (property) => READABLE.test(String(property || ''));
export const inherits = (property) => INHERITS.test(String(property || ''));

export function isNothing(property, value) {
  const v = String(value ?? '').trim();

  return NOTHING.has(v) || (property === 'opacity' && v === '1');
}

/** `rgb(31, 36, 40)` → `#1f2428`. With an alpha, or anything else, as it is. */
export function hexOf(value) {
  const m = /^rgb\(\s*(\d+),\s*(\d+),\s*(\d+)\s*\)$/.exec(String(value || '').trim());

  return m ? `#${[m[1], m[2], m[3]].map((n) => Number(n).toString(16).padStart(2, '0')).join('')}` : String(value || '');
}

const pixelsOf = (value) => {
  const m = /^(-?\d*\.?\d+)px$/.exec(String(value || '').trim());

  return m ? Number(m[1]) : null;
};

/** `16px` → `1rem`, against the page's root size. */
export function remOf(px, rootPx = 16) {
  return `${round(px / (rootPx || 16), 3)}rem`;
}

/**
 * A computed value in the panel's words, or '' when it cannot be said in one
 * (`padding-block: 10px 20px`, two values under one field).
 */
export function wordsFor(property, value, { rootPx = 16, fontPx = 16 } = {}) {
  const v = String(value ?? '').trim();

  if (property === 'font-family') {
    return v.split(',')[0].trim().replace(/^['"]|['"]$/g, '');
  }

  if (!/^[^\s(]+(\([^)]*\))?$/.test(v)) {
    return '';
  }

  const px = pixelsOf(v);

  if (px === null) {
    return /color$/.test(property) ? hexOf(v) : v;
  }

  return property === 'line-height' ? String(round(px / (fontPx || 16), 2)) : remOf(px, rootPx);
}

/** The field's hover: the property, what it shows, and that as rem and px where it is a size. */
export function hoverText(property, shown, value, { rootPx = 16, source = '' } = {}) {
  const px = pixelsOf(value);
  const size = px === null ? '' : `${remOf(px, rootPx)} = ${round(px, 1)}px`;
  const said = size && (shown === remOf(px, rootPx) || !shown) ? size : [shown, size].filter(Boolean).join(' · ');

  return [`${property}: ${said}`, source].filter(Boolean).join(' · ');
}

/** The one a scale's numbers name, before a word for the same value: `text-100` over `text-base`. */
export function bestToken(names) {
  return names.find((name) => /-\d+$/.test(name)) || names[0] || '';
}

/**
 * @param {object} options
 * @param {() => Element|null} options.element  the picked element on the canvas
 * @param {(property: string) => string[]} options.scale  the site's classes for a property
 * @param {(name: string) => string} options.css  a class's declarations
 */
export function createComputedValues({ element, scale, css }) {
  const probes = new WeakMap();
  const tokens = new Map();

  /** One element, parked for good in a closed-off corner of the document: nothing in the page ever sees it change. */
  function probeIn(doc) {
    let parked = probes.get(doc);

    if (!parked?.host.isConnected) {
      const host = doc.createElement('div');

      host.setAttribute('data-sve-build-probe', '');
      host.style.display = 'none';
      parked = { host, probe: host.attachShadow({ mode: 'open' }).appendChild(doc.createElement('div')) };
      doc.documentElement.appendChild(host);
      probes.set(doc, parked);
    }

    return parked.probe;
  }

  /** Each value `property`'s classes give on this page, at this width: the browser's answer, kept until the width or the sheet changes. */
  function tokensFor(el, property, fontPx) {
    const doc = el.ownerDocument;
    const key = `${property}|${fontPx}|${doc.documentElement.clientWidth}`;

    if (tokens.has(key)) {
      return tokens.get(key);
    }

    const byValue = new Map();
    const probe = probeIn(doc);
    const read = doc.defaultView.getComputedStyle(probe);

    (scale(property) || []).forEach((name) => {
      const text = css(name);

      if (text) {
        // A line height in a unitless token is worked out against a font size.
        probe.style.cssText = property === 'font-size' ? text : `font-size:${fontPx}px;${text}`;

        const value = read.getPropertyValue(property).trim();

        byValue.set(value, [...(byValue.get(value) || []), name]);
      }
    });
    probe.style.cssText = '';
    // An empty scale is the catalog still on its way: asked again next time.
    if (byValue.size) {
      tokens.set(key, byValue);
    }

    return byValue;
  }

  return {
    /**
     * @param {string} property  the field's property
     * @param {string} scaleProperty  the property its scale is built on
     * @param {(name: string) => string} tokenWord  a class as the field shows it (`text-100` → `100`)
     * @returns {{ value: string, words: string, token: string, rootPx: number }|null} `words` empty: nothing to show
     */
    read(property, scaleProperty, tokenWord) {
      const el = element();

      if (!el?.isConnected) {
        return null;
      }

      const view = el.ownerDocument.defaultView;
      const style = view.getComputedStyle(el);
      const value = style.getPropertyValue(property).trim();
      const rootPx = parseFloat(view.getComputedStyle(el.ownerDocument.documentElement).fontSize) || 16;
      const fontPx = parseFloat(style.fontSize) || 16;
      const noBorder = property === 'border-color' && parseFloat(style.borderTopWidth) === 0;

      if (!isReadable(property) || isNothing(property, value) || noBorder) {
        return { value, words: '', token: '', rootPx };
      }

      const names = tokensFor(el, scaleProperty, fontPx).get(style.getPropertyValue(scaleProperty).trim()) || [];
      const token = bestToken(names);

      return { value, words: (token && tokenWord(token)) || wordsFor(property, value, { rootPx, fontPx }), token, rootPx };
    },
    /** The sheet changed: what a class gives may have too. */
    forget() {
      tokens.clear();
    },
  };
}
