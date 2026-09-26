/**
 * Theme colors in the site's site.css — read, generate, write back.
 *
 * `@theme` in site.css is the one place a theme color lives:
 * `--color-moss: #55613f; --color-moss-600: #3f4a2c;`. The site puts those on
 * `:root` at request time (`{{ theme_tokens }}`), so a saved color reaches
 * the page without a build.
 *
 * A family is a base color plus numbered steps. New steps are tints (lighter)
 * and shades (darker) of the base, and their number says how light they
 * really are — on Tailwind's neutral scale, so a dark step is never called
 * 100 just because it came first.
 *
 * Pure functions, no DOM: the panel reads the file, edits families, and saves
 * the text writeColors() returns. Only literal colors are touched; a token
 * that points at a variable (`var(--contrast-light)`) is left as it is.
 */

/** Same literal test as the site's ThemeTokens tag — what it reads, this writes. */
const LITERAL = /^(?:#[0-9a-fA-F]{3,8}|(?:rgba?|hsla?|oklch|oklab|lab|lch|color)\([^;]*\))$/;

const DECL = /^(\s*)--color-([\w-]+)\s*:\s*(.+?)\s*;\s*$/;

const THEME_BLOCK = /@theme\b[^{]*\{([^}]*)\}/g;

const STEP = /^(.+)-(\d+)$/;

/** Names Tailwind or CSS already mean something by. */
const RESERVED = new Set(['transparent', 'current', 'inherit', 'initial', 'unset', 'revert']);

/** Tailwind's own step names. */
export const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

/**
 * OKLCH lightness of Tailwind v4's neutral palette at each step — gray, so
 * the number is about lightness only. A step is named after where its own
 * lightness falls on this line.
 */
const ANCHORS = [
  [1, 0],
  [0.985, 50],
  [0.97, 100],
  [0.922, 200],
  [0.87, 300],
  [0.708, 400],
  [0.556, 500],
  [0.439, 600],
  [0.371, 700],
  [0.269, 800],
  [0.205, 900],
  [0.145, 950],
  [0, 1000],
];

/** How far tints and shades reach, in OKLCH lightness. */
const LIGHTEST = 0.985;
const DARKEST = 0.1;

export const MAX_VARIANTS = 5;

export function isLiteral(value) {
  return LITERAL.test(String(value).trim());
}

function parseHex(hex) {
  const m = /^#([0-9a-f]{3}|[0-9a-f]{6})(?:[0-9a-f]{2})?$/i.exec(String(hex).trim());

  if (!m) {
    return null;
  }

  const h = m[1].length === 3 ? m[1].replace(/./g, '$&$&') : m[1];

  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
}

function toLinear(c) {
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function fromLinear(c) {
  return c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055;
}

/** `#rrggbb` → `{ l, c, h }` in OKLCH, or null for anything that is not a hex. */
export function hexToOklch(hex) {
  const rgb = parseHex(hex);

  if (!rgb) {
    return null;
  }

  const [r, g, b] = rgb.map((v) => toLinear(v / 255));
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;

  return { l: L, c: Math.hypot(A, B), h: ((Math.atan2(B, A) * 180) / Math.PI + 360) % 360 };
}

function oklchToLinear({ l, c, h }) {
  const a = c * Math.cos((h * Math.PI) / 180);
  const b = c * Math.sin((h * Math.PI) / 180);
  const L = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const M = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const S = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;

  return [
    4.0767416621 * L - 3.3077115913 * M + 0.2309699292 * S,
    -1.2684380046 * L + 2.6097574011 * M - 0.3413193965 * S,
    -0.0041960863 * L - 0.7034186147 * M + 1.707614701 * S,
  ];
}

function inGamut(rgb) {
  return rgb.every((v) => v >= -1e-4 && v <= 1 + 1e-4);
}

/**
 * OKLCH → `#rrggbb`. A color outside sRGB loses chroma until it fits:
 * lightness and hue stay, and lightness is what the step's name is about.
 */
export function oklchToHex(color) {
  let rgb = oklchToLinear(color);

  if (!inGamut(rgb)) {
    let lo = 0;
    let hi = color.c;

    for (let i = 0; i < 24; i++) {
      const mid = (lo + hi) / 2;

      if (inGamut(oklchToLinear({ ...color, c: mid }))) {
        lo = mid;
      } else {
        hi = mid;
      }
    }

    rgb = oklchToLinear({ ...color, c: lo });
  }

  return '#' + rgb
    .map((v) => Math.round(Math.min(1, Math.max(0, fromLinear(v))) * 255).toString(16).padStart(2, '0'))
    .join('');
}

/** Where a color's lightness falls on the 0–1000 line — 50 is near white, 950 near black. */
export function lightnessNumber(hex) {
  const color = hexToOklch(hex);

  if (!color) {
    return 500;
  }

  const l = Math.min(1, Math.max(0, color.l));

  for (let i = 1; i < ANCHORS.length; i++) {
    const [l1, n1] = ANCHORS[i - 1];
    const [l2, n2] = ANCHORS[i];

    if (l >= l2) {
      return n1 + ((l1 - l) / (l1 - l2)) * (n2 - n1);
    }
  }

  return 1000;
}

/** The number closest to `ideal` above `above`, preferring Tailwind's own names, then multiples of 25. */
function pickNumber(ideal, above, max) {
  let best = null;
  let bestScore = Infinity;

  for (let n = 5; n <= max; n += 5) {
    if (n <= above) {
      continue;
    }

    const score = Math.abs(n - ideal) + (STEPS.includes(n) ? 0 : n % 25 === 0 ? 40 : 60);

    if (score < bestScore) {
      best = n;
      bestScore = score;
    }
  }

  return best ?? above + 1;
}

/**
 * A number per color, in the same order as given: unique, lighter is always
 * lower, and each as close to the color's real lightness as the others allow.
 */
export function nameSteps(values) {
  const order = values
    .map((value, i) => ({ i, n: lightnessNumber(value) }))
    .sort((a, b) => a.n - b.n);
  const names = new Array(values.length);
  let prev = 0;

  order.forEach((step, k) => {
    const darkerLeft = order.length - k - 1;

    names[step.i] = pickNumber(step.n, prev, 995 - 5 * darkerLeft);
    prev = names[step.i];
  });

  return names;
}

function clampCount(n) {
  return Math.max(0, Math.min(MAX_VARIANTS, Math.round(Number(n) || 0)));
}

/**
 * The colors of `base`'s tints and shades, nearest the base first:
 * `{ tints: ['#…', …], shades: ['#…', …] }`.
 */
export function stepValues(base, { tints = 0, shades = 0 } = {}) {
  const color = hexToOklch(base);
  const out = { tints: [], shades: [] };

  if (!color) {
    return out;
  }

  const nTints = clampCount(tints);
  const nShades = clampCount(shades);
  const darkest = Math.min(DARKEST, color.l * 0.6);
  const lightest = Math.max(LIGHTEST, color.l);

  for (let i = 1; i <= nTints; i++) {
    const t = i / (nTints + 1);

    out.tints.push(oklchToHex({ l: color.l + (lightest - color.l) * t, c: color.c * (1 - 0.6 * t), h: color.h }));
  }

  for (let i = 1; i <= nShades; i++) {
    const t = i / (nShades + 1);

    out.shades.push(oklchToHex({ l: color.l + (darkest - color.l) * t, c: color.c * (1 - 0.3 * t), h: color.h }));
  }

  return out;
}

/**
 * Tints and shades of `base`, named by lightness, lightest first.
 * Returns `[{ name: '300', value: '#…', kind: 'tint' | 'shade' }]`.
 *
 * How a family's steps are named the first time — and again only when
 * someone asks for it ("rename by lightness"); see remakeSteps().
 */
export function generateSteps(base, counts = {}) {
  const values = stepValues(base, counts);
  const made = [
    ...values.tints.map((value) => ({ kind: 'tint', value })),
    ...values.shades.map((value) => ({ kind: 'shade', value })),
  ];
  const names = nameSteps(made.map((step) => step.value));

  return made
    .map((step, i) => ({ name: String(names[i]), value: step.value, kind: step.kind }))
    .sort((a, b) => Number(a.name) - Number(b.name));
}

/** A free number strictly between `lo` and `hi`, as close to `ideal` as the free ones allow — else past `hi`. */
function freeNumber(ideal, lo, hi, taken) {
  let best = null;
  let bestScore = Infinity;

  for (let n = 5; n < 1000; n += 5) {
    if (n <= lo || n >= hi || taken.has(String(n))) {
      continue;
    }

    const score = Math.abs(n - ideal) + (STEPS.includes(n) ? 0 : n % 25 === 0 ? 40 : 60);

    if (score < bestScore) {
      best = n;
      bestScore = score;
    }
  }

  if (best !== null) {
    return String(best);
  }

  let n = Math.max(lo, hi, 995) + 5;

  while (taken.has(String(n))) {
    n += 5;
  }

  return String(n);
}

const num = (name) => Number(name);

/**
 * Tints and shades of `base` that keep the names they already have.
 *
 * A step's name is written in templates (`bg-moss-350`), so it must not move
 * when the color does. The first time a family gets steps they are named by
 * lightness (generateSteps); after that a new base only changes their colors.
 * The tint nearest the base keeps the nearest tint's name, and so on
 * outwards; a step added at the far end gets a new name past the others
 * (lighter tints lower, darker shades higher); a step taken away frees the
 * outermost name.
 *
 * `previous` are the family's steps before, `previousBase` the base they were
 * made from — which of them were tints is decided against that base, not the
 * new one (a light gray turned navy would otherwise call every step a tint).
 * Returns `[{ name, value, kind }]`, in number order.
 */
export function remakeSteps(base, counts, previous = [], previousBase = base) {
  if (!hexToOklch(base)) {
    return [];
  }

  if (!previous.length) {
    return generateSteps(base, counts);
  }

  const was = hexToOklch(previousBase) || hexToOklch(base);
  const values = stepValues(base, counts);
  const before = previous.map((step) => ({ name: String(step.name), l: hexToOklch(step.value)?.l ?? 0 }));
  // Nearest the base first: a tint is lighter than the base, so the nearest has the highest number.
  const oldTints = before.filter((s) => s.l > was.l).map((s) => s.name).sort((a, b) => num(b) - num(a));
  const oldShades = before.filter((s) => s.l <= was.l).map((s) => s.name).sort((a, b) => num(a) - num(b));
  const taken = new Set();
  const out = [];

  let hi = oldTints.length ? Infinity : oldShades.length ? num(oldShades[0]) : 1000;

  values.tints.forEach((value, k) => {
    const name = k < oldTints.length ? oldTints[k] : freeNumber(lightnessNumber(value), 0, hi, new Set([...taken, ...oldShades]));

    taken.add(name);
    hi = Math.min(hi, num(name));
    out.push({ name, value, kind: 'tint' });
  });

  let lo = oldShades.length ? -Infinity : Math.max(0, ...out.map((s) => num(s.name)).filter(Number.isFinite));

  values.shades.forEach((value, k) => {
    const name = k < oldShades.length ? oldShades[k] : freeNumber(lightnessNumber(value), lo, 1000, taken);

    taken.add(name);
    lo = Math.max(lo, num(name));
    out.push({ name, value, kind: 'shade' });
  });

  return out.sort((a, b) => num(a.name) - num(b.name));
}

/** Whether the steps carry the names generateSteps() would give them now — if not, "rename by lightness" has something to do. */
export function namedByLightness(family, counts) {
  const want = generateSteps(family.value, counts).map((s) => s.name).sort();
  const have = (family.steps || []).map((s) => String(s.name)).sort();

  return want.length === have.length && want.every((name, i) => name === have[i]);
}

/**
 * How a family's steps were made: `{ tints, shades, generated }`.
 *
 * Generated means the steps are the colors stepValues() gives for those
 * counts — whatever they are called, since names stay put when the base
 * changes (remakeSteps). Then the panel shows the counts and remakes the
 * steps with the base. Anything else (the theme's own 50–950, hand-picked
 * steps) is kept as it is until someone asks for tints or shades.
 */
export function familyMode(family) {
  const steps = family.steps || [];
  const base = hexToOklch(family.value);

  if (!steps.length) {
    return { tints: 0, shades: 0, generated: true };
  }

  if (!base) {
    return { tints: 0, shades: 0, generated: false };
  }

  let tints = 0;
  let shades = 0;

  for (const step of steps) {
    const color = hexToOklch(step.value);

    if (!color) {
      return { tints: 0, shades: 0, generated: false };
    }

    color.l > base.l ? tints++ : shades++;
  }

  if (tints > MAX_VARIANTS || shades > MAX_VARIANTS) {
    return { tints: 0, shades: 0, generated: false };
  }

  const made = stepValues(family.value, { tints, shades });
  const want = [...made.tints, ...made.shades].sort();
  const have = steps.map((s) => String(s.value).trim().toLowerCase()).sort();
  const same = want.length === have.length && want.every((value, i) => value === have[i]);

  return same ? { tints, shades, generated: true } : { tints: 0, shades: 0, generated: false };
}

export function isHex(value) {
  return parseHex(value) !== null;
}

/**
 * Whether `name` can be a new color. Returns an error key, or null when fine.
 * `taken` is the names already in the file.
 */
export function nameProblem(name, taken = []) {
  const n = String(name || '').trim();

  if (!n) {
    return 'empty';
  }

  if (!/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(n)) {
    return 'format';
  }

  if (STEP.test(n)) {
    return 'number';
  }

  if (RESERVED.has(n)) {
    return 'reserved';
  }

  if (taken.includes(n)) {
    return 'taken';
  }

  return null;
}

function themeBlocks(css) {
  const blocks = [];

  for (const m of css.matchAll(THEME_BLOCK)) {
    const start = m.index + m[0].indexOf('{') + 1;

    blocks.push({ start, end: start + m[1].length, body: m[1] });
  }

  return blocks;
}

/** Literal `--color-*` declarations in the `@theme` blocks, in file order. */
function literalDecls(css) {
  const decls = [];

  for (const block of themeBlocks(css)) {
    for (const line of block.body.split('\n')) {
      const m = DECL.exec(line);

      if (m && isLiteral(m[3])) {
        decls.push({ name: m[2], value: m[3] });
      }
    }
  }

  return decls;
}

/**
 * The families in site.css, in file order:
 * `[{ name: 'primary', value: '#11122C', steps: [{ name: '50', value: '#f4f5f7' }, …] }]`.
 * A step whose base is missing still shows, under a family with `value: null`.
 */
export function readColors(css) {
  const decls = literalDecls(String(css || ''));
  const families = new Map();

  const family = (name) => {
    if (!families.has(name)) {
      families.set(name, { name, value: null, steps: [] });
    }

    return families.get(name);
  };

  for (const d of decls) {
    const step = STEP.exec(d.name);

    // A base can never end in a number (nameProblem), so a number is always a step.
    if (step) {
      family(step[1]).steps.push({ name: step[2], value: d.value });
    } else {
      family(d.name).value = d.value;
    }
  }

  for (const f of families.values()) {
    f.steps.sort((a, b) => Number(a.name) - Number(b.name));
  }

  return [...families.values()];
}

/**
 * site.css with its literal theme colors made to match `families` — the
 * shape readColors() returns. Changed values are rewritten in place, removed
 * ones deleted, new steps land in number order inside their family, and a new
 * family goes after the last literal color. Every other line stays byte for
 * byte, so the file's own formatting and its other tokens are untouched.
 */
export function writeColors(css, families) {
  const text = String(css || '');
  const blocks = themeBlocks(text);

  if (!blocks.length) {
    return text;
  }

  const wanted = new Map();

  for (const f of families) {
    if (f.value) {
      wanted.set(f.name, String(f.value).trim());
    }

    for (const s of f.steps || []) {
      wanted.set(`${f.name}-${s.name}`, String(s.value).trim());
    }
  }

  // New families and steps go into the block that already holds colors.
  const home = blocks.find((b) => literalDecls(`@theme{${b.body}}`).length) || blocks[0];
  let out = text;

  for (const block of [...blocks].reverse()) {
    const next = rewriteBlock(block.body, wanted, block === home ? families : null);

    out = out.slice(0, block.start) + next + out.slice(block.end);
  }

  return out;
}

function rewriteBlock(body, wanted, families) {
  const lines = body.split('\n');
  const kept = [];
  const seen = new Set();
  const lastOf = new Map();
  let lastColor = -1;
  let indent = '    ';

  for (const line of lines) {
    const m = DECL.exec(line);

    if (m && isLiteral(m[3])) {
      if (!wanted.has(m[2])) {
        continue;
      }

      const value = wanted.get(m[2]);

      kept.push(value === m[3] ? line : `${m[1]}--color-${m[2]}: ${value};`);
      seen.add(m[2]);
      indent = m[1];
      lastColor = kept.length - 1;
      lastOf.set(m[2], kept.length - 1);
      continue;
    }

    if (m && lastColor === -1) {
      indent = m[1];
    }

    kept.push(line);
  }

  if (!families) {
    return kept.join('\n');
  }

  if (lastColor === -1) {
    lastColor = kept.map((l) => DECL.test(l)).lastIndexOf(true);
  }

  if (lastColor === -1) {
    lastColor = Math.max(0, kept.length - 2);
  }

  /** Lines to add after an index of `kept`, in the order they were asked for. */
  const after = new Map();
  const add = (index, line) => {
    if (!after.has(index)) {
      after.set(index, []);
    }

    after.get(index).push(line);
  };
  const decl = (name) => `${indent}--color-${name}: ${wanted.get(name)};`;

  for (const f of families) {
    const names = [
      ...(f.value ? [f.name] : []),
      ...[...(f.steps || [])].sort((a, b) => Number(a.name) - Number(b.name)).map((s) => `${f.name}-${s.name}`),
    ];
    const missing = names.filter((n) => !seen.has(n));

    if (!missing.length) {
      continue;
    }

    const present = names.filter((n) => seen.has(n));

    if (!present.length) {
      add(lastColor, '');
      missing.forEach((n) => add(lastColor, decl(n)));
      continue;
    }

    for (const n of missing) {
      // After the nearest line of this family that sorts before it; else before its first line.
      const before = names.slice(0, names.indexOf(n)).filter((p) => seen.has(p)).pop();
      const anchor = before ? lastOf.get(before) : lastOf.get(present[0]) - 1;

      add(anchor, decl(n));
    }
  }

  const result = [];

  if (after.has(-1)) {
    result.push(...after.get(-1));
  }

  kept.forEach((line, i) => {
    result.push(line);

    if (after.has(i)) {
      result.push(...after.get(i));
    }
  });

  return result.join('\n');
}

/** The color names in use, for nameProblem(). */
export function takenNames(families) {
  return families.map((f) => f.name);
}

/**
 * Colors the theme always has. Sections are wireframed in gray and imported
 * into every site, so the gray scale can be changed but never removed.
 */
export const CORE_COLORS = ['gray'];

export function isCoreColor(name) {
  return CORE_COLORS.includes(name);
}
