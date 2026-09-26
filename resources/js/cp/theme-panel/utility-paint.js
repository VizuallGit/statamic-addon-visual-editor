/**
 * The Utilities tab's paint: a utility being edited, redrawn in Live Preview
 * as it is typed — before it is saved, before the site's CSS is built again.
 *
 * The page's built stylesheet (public/build, Vite) holds each utility where
 * Tailwind sorted it inside `@layer utilities`, variants and all (`card`,
 * `md:card`, `hover:card`). The paint swaps exactly those rules for the
 * draft's, compiled by the same Tailwind the dock uses, at the same place in
 * the layer. So a line taken out of a utility is gone from the page, and a
 * utility keeps its rank against its neighbours (`card p-8` still gets p-8's
 * padding). Nothing else in the sheet is touched.
 *
 * The first touch keeps the layer as the build made it; every paint is drawn
 * from that, so drawing no utilities gives the page back exactly. A new build
 * (`swapSiteCss`) replaces the sheet, and with it everything painted here.
 *
 * DOM only through the documents handed in. No Vue, no fetch.
 */

/** Per built stylesheet: its utilities layer, the rules as built, the rules as drawn now. */
const snapshots = new WeakMap();

const CLASS = /\.((?:\\[0-9a-fA-F]{1,6}[ \t\n]?|\\[^\n0-9a-fA-F]|[\w-]|[^\x00-\x7F])+)/g;

/** The class names in a selector, unescaped: `.md\:card>*` → `['md:card']`. */
export function classTokens(selector) {
  return [...String(selector || '').matchAll(CLASS)].map((m) => m[1].replace(
    /\\([0-9a-fA-F]{1,6})[ \t\n]?|\\(.)/g,
    (_, hex, ch) => (hex ? String.fromCodePoint(parseInt(hex, 16)) : ch)
  ));
}

/**
 * The utility a Tailwind class is made of: what follows the last variant
 * colon (outside brackets), without the important mark.
 * `md:hover:card` → `card`, `[&>p]:card!` → `card`.
 */
export function utilityOf(candidate) {
  const c = String(candidate || '');
  let depth = 0;
  let cut = -1;

  for (let i = 0; i < c.length; i++) {
    const ch = c[i];

    if (ch === '[' || ch === '(') {
      depth++;
    } else if (ch === ']' || ch === ')') {
      depth = Math.max(0, depth - 1);
    } else if (ch === ':' && depth === 0) {
      cut = i;
    }
  }

  return c.slice(cut + 1).replace(/^!|!$/g, '');
}

/** Whether a class belongs to `name`; `tab-*` (a functional utility) owns `tab-4`. */
export function belongsTo(candidate, name) {
  const base = utilityOf(candidate);

  return name.endsWith('-*') ? base.startsWith(name.slice(0, -1)) && base.length > name.length - 1 : base === name;
}

/**
 * The class a rule is for. Tailwind writes the utility's own class first in
 * every selector it makes — `.group-hover\:card:is(:where(.group):hover *)`,
 * `.flow-y>*+*` — so the first class of the first selector decides, and a
 * class that only appears inside a variant's condition does not.
 */
function ownerOf(rule) {
  return classTokens(firstSelector(rule))[0] || '';
}

function firstSelector(rule) {
  if (typeof rule.selectorText === 'string') {
    return rule.selectorText;
  }

  for (const child of rule.cssRules || []) {
    const selector = firstSelector(child);

    if (selector) {
      return selector;
    }
  }

  return '';
}

const kind = (rule) => rule?.constructor?.name || '';

/** The site's built stylesheets: same-origin `<link>`s under /build/assets. */
export function siteLinks(doc) {
  return [...doc.querySelectorAll('link[rel~="stylesheet"][href]')].filter((link) => {
    try {
      const url = new URL(link.getAttribute('href'), doc.baseURI);

      return url.origin === doc.defaultView.location.origin && /^\/build\/assets\/[^/]+\.css$/.test(url.pathname);
    } catch {
      return false;
    }
  });
}

function snapshot(sheet) {
  if (snapshots.has(sheet)) {
    return snapshots.get(sheet);
  }

  let rules;

  try {
    rules = sheet.cssRules;
  } catch {
    return null;
  }

  const layer = [...rules].find((r) => kind(r) === 'CSSLayerBlockRule' && r.name === 'utilities');

  if (!layer) {
    return null;
  }

  const base = [...layer.cssRules].map((r) => ({ text: r.cssText, owner: ownerOf(r) }));
  const snap = { layer, base, live: base.map((b) => b.text) };

  snapshots.set(sheet, snap);

  return snap;
}

function snapshotsOf(doc) {
  return siteLinks(doc).map((link) => link.sheet && snapshot(link.sheet)).filter(Boolean);
}

/**
 * The classes to compile for `names`: every class of theirs the build has
 * (as built, before any paint), plus each plain name — a utility no page used
 * when the build ran, or one just made, is drawn under its own name.
 */
export function utilityCandidates(docs, names) {
  const out = new Set(names.filter((n) => !n.endsWith('-*')));

  for (const doc of docs) {
    for (const snap of snapshotsOf(doc)) {
      for (const { owner } of snap.base) {
        if (owner && names.some((n) => belongsTo(owner, n))) {
          out.add(owner);
        }
      }
    }
  }

  return [...out];
}

/** The compiled draft's utility rules as text, grouped by the class each is for. */
function compiledRules(doc, css) {
  const byOwner = new Map();

  if (!css) {
    return byOwner;
  }

  const sheet = new doc.defaultView.CSSStyleSheet();

  try {
    sheet.replaceSync(css);
  } catch {
    return byOwner;
  }

  const visit = (rules) => {
    for (const rule of rules) {
      const k = kind(rule);

      if (k === 'CSSLayerBlockRule') {
        if (rule.name === 'utilities') {
          visit(rule.cssRules);
        }

        continue;
      }

      const owner = k === 'CSSLayerStatementRule' || k === 'CSSPropertyRule' ? '' : ownerOf(rule);

      if (owner) {
        byOwner.set(owner, [...(byOwner.get(owner) || []), rule.cssText]);
      }
    }
  };

  visit(sheet.cssRules);

  return byOwner;
}

/**
 * Draw `names` from `css` (the draft compiled for their classes) into every
 * built stylesheet of every document; every other utility as built. With no
 * names, the sheets are as the build made them again.
 */
export function paintUtilities(docs, names, css) {
  for (const doc of docs) {
    const byOwner = compiledRules(doc, css);

    for (const snap of snapshotsOf(doc)) {
      draw(snap, names, byOwner);
    }
  }
}

function draw(snap, names, byOwner) {
  const want = [];
  const placed = new Set();

  for (const { text, owner } of snap.base) {
    if (owner && names.some((n) => belongsTo(owner, n))) {
      // A class's rules go where its first built rule was.
      if (!placed.has(owner)) {
        placed.add(owner);
        want.push(...(byOwner.get(owner) || []));
      }

      continue;
    }

    want.push(text);
  }

  // Not in the build yet: last in the layer.
  for (const [owner, texts] of byOwner) {
    if (!placed.has(owner)) {
      want.push(...texts);
    }
  }

  replaceRules(snap, want);
}

/** Only the rules between the common head and tail change. */
function replaceRules(snap, want) {
  const live = snap.live;
  let head = 0;
  let tail = 0;

  while (head < live.length && head < want.length && live[head] === want[head]) {
    head++;
  }

  while (tail < live.length - head && tail < want.length - head && live[live.length - 1 - tail] === want[want.length - 1 - tail]) {
    tail++;
  }

  for (let i = live.length - tail - 1; i >= head; i--) {
    snap.layer.deleteRule(i);
  }

  const drawn = live.slice(0, head);

  for (const text of want.slice(head, want.length - tail)) {
    try {
      snap.layer.insertRule(text, drawn.length);
      drawn.push(text);
    } catch {
      // A rule this browser cannot parse is left out, as it would be from a stylesheet.
    }
  }

  snap.live = [...drawn, ...live.slice(live.length - tail)];
}

/**
 * The site's CSS after a build: each built `<link>` is followed by one to the
 * new file, and goes when that has loaded — the page never shows unstyled.
 * `onLoad` runs once the new sheet is in.
 */
export function swapSiteCss(doc, href, onLoad = () => {}) {
  const target = new URL(href, doc.baseURI).pathname;

  for (const link of siteLinks(doc)) {
    if (new URL(link.getAttribute('href'), doc.baseURI).pathname === target) {
      continue;
    }

    const fresh = link.cloneNode(false);

    fresh.removeAttribute('integrity');
    fresh.setAttribute('href', href);
    fresh.addEventListener('load', () => {
      link.remove();
      onLoad();
    }, { once: true });
    fresh.addEventListener('error', () => fresh.remove(), { once: true });
    link.after(fresh);
  }
}
