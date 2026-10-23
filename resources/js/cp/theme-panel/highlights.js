/**
 * Highlights: a name that points at a color of the palette.
 *
 * In site.css a highlight is a color token whose value is another color token,
 * `--color-highlight-1: var(--color-primary-500);`. It has no steps and no
 * color of its own, so the palette (readColors) never sees it — only literal
 * colors are a palette color. Tailwind gives it `text-highlight-1` and
 * friends like any theme color, the pickers list it beside the palette, and
 * the site's `{{ theme_tokens }}` serves it on `:root` as `--color-highlight-1`
 * plus the short `--highlight-1`. Nothing in the site's own CSS uses one;
 * where a highlight is picked, it follows the palette color it points at.
 */

const VALUE = /^var\(\s*--color-([\w-]+)\s*\)$/;
const NAME = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;
const DEFAULT = /^highlight-(\d+)$/;
const RESERVED = new Set(['transparent', 'current', 'inherit', 'initial', 'unset', 'revert', 'white', 'black']);

/** Is this value a highlight's — a pointer at a color token? */
export function isHighlightValue(value) {
  return VALUE.test(String(value || '').trim());
}

/**
 * The highlights among the `@theme` tokens (readTokens), in file order:
 * `[{ name, value }]` with the name without `color-`.
 */
export function readHighlights(tokens) {
  const out = [];

  for (const [name, value] of tokens) {
    if (name.startsWith('color-') && isHighlightValue(value)) {
      out.push({ name: name.slice('color-'.length), value: value.trim() });
    }
  }

  return out;
}

/**
 * Why a highlight cannot be called `name`, or null. `taken` are the other
 * highlights' names; `families` the palette (readColors' shape), whose names
 * and step names a highlight may not shadow.
 */
export function highlightNameProblem(name, taken = [], families = []) {
  const n = String(name || '').trim();

  if (!n) {
    return 'empty';
  }

  if (!NAME.test(n)) {
    return 'format';
  }

  if (RESERVED.has(n) || taken.includes(n)) {
    return 'taken';
  }

  for (const f of families) {
    if (!f.name) {
      continue;
    }

    if (n === f.name || (f.steps || []).some((s) => n === `${f.name}-${s.name}`)) {
      return 'taken';
    }
  }

  return null;
}

/** The name a new highlight gets: `highlight-1`, then one more than the highest in use. */
export function nextHighlightName(names) {
  const top = Math.max(0, ...names.map((n) => Number(DEFAULT.exec(n)?.[1] || 0)));

  return `highlight-${top + 1}`;
}
