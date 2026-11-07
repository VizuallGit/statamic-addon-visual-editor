/**
 * What this site defines for itself — its own scale — read from the `@theme`
 * and `@utility` blocks of site.css (TailwindTheme.php sends exactly those).
 *
 * Owner: the Tailwind catalog (tailwind-complete.js), which every list of
 * classes and values reads: the Style panel's menus, + Class, the dock's
 * suggestions. Their own values come first in all of them (the owner, 7 Nov
 * 2026): `py-500` before `py-0`, `bg-primary-500` before anything Tailwind
 * ships.
 * May import: nothing. Pure — no editor, no bus, no DOM.
 * Bus messages: none.
 */

/**
 * The site's own variables and utilities.
 *
 * `vars`: every custom property its `@theme` blocks set (`--spacing-500`),
 * leaving out a namespace reset (`--color-*: initial`) and a `@theme default`
 * or `@theme reference` block — those are Tailwind's, or only borrowed.
 * `tails`: every dash-ending of those names (`500`, `primary-500`), which is
 * all a class's value can be when it uses one — a cheap first test before the
 * CSS is asked. `utilities`: `@utility` names; `prefixes`: the functional
 * ones (`@utility tab-*` → `tab`).
 *
 * @returns {{ vars: Set<string>, tails: Set<string>, utilities: Set<string>, prefixes: Set<string> }}
 */
export function ownTheme(css) {
  const source = String(css || '').replace(/\/\*[\s\S]*?\*\//g, '');
  const vars = new Set();
  const tails = new Set();
  const utilities = new Set();
  const prefixes = new Set();

  for (const block of blocks(source, '@theme')) {
    if (/\b(?:default|reference)\b/.test(block.head)) {
      continue;
    }

    const decl = /(--[A-Za-z0-9_-]+)\s*:\s*([^;{}]*)/g;
    let match;

    while ((match = decl.exec(block.body))) {
      if (match[2].trim() === 'initial') {
        continue;
      }

      vars.add(match[1]);

      const parts = match[1].slice(2).split('-');

      for (let i = 1; i < parts.length; i++) {
        tails.add(parts.slice(i).join('-'));
      }
    }
  }

  const utility = /@utility\s+([A-Za-z0-9_-]+?)(-\*)?\s*\{/g;
  let match;

  while ((match = utility.exec(source))) {
    (match[2] ? prefixes : utilities).add(match[1]);
  }

  return { vars, tails, utilities, prefixes };
}

/** The custom properties a declaration list reads: `var(--spacing-500)` → `--spacing-500`. */
export function varsIn(css) {
  return [...String(css || '').matchAll(/var\(\s*(--[A-Za-z0-9_-]+)/g)].map((match) => match[1]);
}

/**
 * The site's own first, each side in the order it came in. `isOwn` is asked of
 * an item's `label` when it has one (a menu row), else of the item (a name).
 */
export function ownFirst(list, isOwn) {
  const own = [];
  const rest = [];

  for (const item of list || []) {
    (isOwn(item && typeof item === 'object' ? item.label : item) ? own : rest).push(item);
  }

  return own.length ? [...own, ...rest] : rest;
}

/**
 * The site's variables in the order a value menu offers them: those of the
 * property's own kind first — colours for a colour, the type scale for a font
 * size, the spacing and sizes for the rest — then everything else the site
 * defines, so a `calc()` can still reach any of them.
 */
export function varsForProperty(vars, property) {
  const prop = String(property || '');
  const kinds = /color|fill|stroke|background|outline|decoration|caret|accent/.test(prop)
    ? ['--color-']
    : /font-size/.test(prop)
      ? ['--text-', '--size-']
      : /line-height/.test(prop)
        ? ['--leading-']
        : /font-family/.test(prop)
          ? ['--font-']
          : /radius/.test(prop)
            ? ['--radius-']
            : ['--spacing-', '--size-', '--container'];
  const first = [];
  const rest = [];

  for (const name of vars || []) {
    (kinds.some((kind) => name.startsWith(kind)) ? first : rest).push(name);
  }

  return [...first, ...rest];
}

/** Each `at`-block's head (what stands between the keyword and `{`) and body, braces balanced. */
function blocks(source, at) {
  const out = [];
  let from = 0;

  while ((from = source.indexOf(at, from)) !== -1) {
    const open = source.indexOf('{', from);

    if (open === -1) {
      break;
    }

    let depth = 1;
    let i = open + 1;

    while (i < source.length && depth > 0) {
      if (source[i] === '{') {
        depth += 1;
      } else if (source[i] === '}') {
        depth -= 1;
      }

      i += 1;
    }

    out.push({ head: source.slice(from + at.length, open), body: source.slice(open + 1, i - 1) });
    from = i;
  }

  return out;
}
