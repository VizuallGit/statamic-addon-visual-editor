/**
 * X-ray: the theme's size tokens as the preview resolves them right now.
 *
 * The site's spacing and type scales are custom properties that end in
 * `clamp()` — `gap-500` is `var(--spacing-500)` is `var(--size-500)` is
 * `clamp(1.5rem, 1.29rem + 1.04vw, 2.125rem)`. What 500 *is* depends on the
 * width, so nothing here computes a clamp: each token is put on a hidden probe
 * in the preview document and the browser says how many pixels it came to at
 * the preview's current width. A measured gap is then compared with those.
 * Re-read on every rescan, which a resize triggers — switching to Tablet
 * gives Tablet's 500.
 *
 * Only tokens the page's stylesheet defines are found; Tailwind writes the ones
 * in use to :root, which is exactly the set a measurement can match.
 *
 * May import: cp/xray/measure.js.
 */
import { tokenName } from './measure.js';

export const PROBE_ID = '__sve-xray-probe';

const SCALES = [
  { key: 'spacing', prefix: '--spacing-' },
  { key: 'text', prefix: '--text-' },
];

/** Names per document: a theme's scale does not grow between two rescans, and the stylesheet walk is not free. */
const namesByDoc = new WeakMap();

/** The custom property names :root carries, from the computed style or, failing that, the stylesheets. */
function rootProperties(pwin, doc) {
  if (namesByDoc.has(doc)) {
    return namesByDoc.get(doc);
  }

  const names = new Set();

  namesByDoc.set(doc, names);

  const cs = pwin.getComputedStyle(doc.documentElement);

  for (let i = 0; i < cs.length; i++) {
    if (cs[i].startsWith('--')) {
      names.add(cs[i]);
    }
  }

  if (names.size) {
    return names;
  }

  // Some engines do not list custom properties on a computed style.
  const walk = (rules) => {
    for (const rule of rules || []) {
      if (rule.style) {
        for (let i = 0; i < rule.style.length; i++) {
          if (rule.style[i].startsWith('--')) {
            names.add(rule.style[i]);
          }
        }
      }

      if (rule.cssRules) {
        walk(rule.cssRules);
      }
    }
  };

  for (const sheet of doc.styleSheets) {
    try {
      walk(sheet.cssRules);
    } catch {
      /* a cross-origin sheet (fonts) — not ours to read */
    }
  }

  return names;
}

/** The hidden element the tokens are measured on. Kept, not re-created: one node, no mutations but its own style. */
export function ensureProbe(doc) {
  let probe = doc.getElementById(PROBE_ID);

  if (!probe) {
    probe = doc.createElement('div');
    probe.id = PROBE_ID;
    probe.setAttribute('aria-hidden', 'true');
    probe.style.cssText = 'position:absolute;left:-9999px;top:0;width:0;height:0;visibility:hidden;pointer-events:none;';
    doc.documentElement.appendChild(probe);
  }

  return probe;
}

/**
 * `{ spacing: [{ name, px }], text: [{ name, px }] }` at the preview's width.
 */
export function readTokens(pwin, doc) {
  const out = { spacing: [], text: [] };
  const probe = ensureProbe(doc);
  const names = rootProperties(pwin, doc);

  for (const scale of SCALES) {
    for (const property of names) {
      const name = tokenName(property, scale.prefix);

      if (!name) {
        continue;
      }

      probe.style.width = `var(${property})`;

      const size = parseFloat(pwin.getComputedStyle(probe).width);

      if (Number.isFinite(size) && size > 0) {
        out[scale.key].push({ name, px: size });
      }
    }
  }

  probe.style.width = '0';

  return out;
}
